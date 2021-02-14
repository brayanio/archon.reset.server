const guid = require('../utils/guid.js')

module.exports = class{

    constructor(name, exp, asset, respawnTime, population, monsterAbilities, stats){
        this.name = name
        this.exp = exp
        this.asset = asset
        this.amount = population
        this.stats = stats
        this.respawnTime = respawnTime
        this.population = population
        this.id = guid()
        this.respawn = 0
        this.monsterAbilities = monsterAbilities
        this.regenCounter = 0
        this.killed = 0
    }

    spawnTick(){
        if(this.amount < this.population){
            this.respawn++
            if(this.respawn >= this.respawnTime){
                console.log('monster spawn', this.name)
                this.respawn = 0
                this.amount++
                return true
            }
        } else {
            this.respawn = 0
        }
    }

    combatTick(getPlayer){
        if(this.amount > 0){
            let usedAbility = false
            this.monsterAbilities.forEach(ability => {
                ability.timer++
                if(ability.timer >= ability.cooldown && this.stats.energy >= ability.cost){                    
                    for(let a = 0; a < this.amount; a++){
                        const player = getPlayer()
                        if(player){
                            ability.use(this, player, true)
                            usedAbility = true
                            console.log('Ability Used', this.name, ability.name)
                        }
                    }
                    if(usedAbility)
                        this.stats.energy -= ability.cost
                }
            })
            return usedAbility
        }
    }

    regen(){
        let regenerated = false
        if(this.stats.vitality < this.stats.base.vitality || this.stats.energy < this.stats.base.energy){
            this.regenCounter++
            if(this.regenCounter >= 20){
                if(this.stats.vitality < this.stats.base.vitality){
                    this.stats.vitality += this.stats.vitalityRegen
                    if(this.stats.vitality > this.stats.base.vitality) this.stats.vitality = this.stats.base.vitality
                    console.log('regen health', this.name, this.stats.vitality)
                    regenerated = true
                }
                if(this.stats.energy < this.stats.base.energy){
                    this.stats.energy += this.stats.energyRegen
                    if(this.stats.energy > this.stats.base.energy) this.stats.energy = this.stats.base.energy
                    console.log('regen energy', this.name, this.stats.energy)
                    regenerated = true
                }
                this.regenCounter = 0
            }
        }
        return regenerated
    }

    attack(damage){
        if(this.amount > 0){
            let shield = this.stats.shield + 0
            if(shield > 0){
                this.stats.shield -= damage
                if(this.stats.shield <= 0){
                    damage = this.stats.shield * -1
                    this.stats.shield = 0
                } else damage = 0
            }
            this.stats.vitality -= damage
            if(this.stats.vitality <= 0){
                this.amount--
                this.killed++
                damage = this.stats.vitality * -1
                this.stats.reset()
                this.attack(damage)
            }
        }
    }

    exportable(){
        return {
            name: this.name,
            asset: this.asset,
            amount: this.amount,
            stats: this.stats.exportable(),
            id: this.id
        }
    }

}