const miniGuid = require('../utils/mini-guid.js')
const Stats = require('./stats.js')
const abilityData = require('../data/ability.js')

module.exports = class{

    constructor(name, race, paragon, accountId){
        this.name = name
        this.race = race
        this.paragon = paragon
        this.id = miniGuid()
        this.stats = new Stats(111, 60, 10, 2, 3)
        this.map = 'Medea'
        this.abilities = [abilityData["Basic Attack"]()]
        this.regenCounter = 0
        this.isDead = false
        this.deathCounter = null
        this.accountId = accountId
    }

    combatTick(getMonster){
        let usedAbility = false
        this.abilities.forEach(ability => {
            ability.timer++
            if(ability.timer >= ability.cooldown && this.stats.energy >= ability.cost){
                const monster = getMonster()
                if(monster){
                    ability.use(this, monster)
                    usedAbility = true
                    console.log('Ability Used', this.name, ability.name)
                }
            }
        })
        return usedAbility
    }

    regen(){
        if(!this.isDead && this.stats.vitality <= 0){
            this.isDead = true
            this.deathCounter = 0
        }
        if(!this.isDead){
            if(this.stats.vitality < this.stats.base.vitality || this.stats.energy < this.stats.base.energy){
                this.regenCounter++
                if(this.regenCounter >= 20){
                    if(this.stats.vitality < this.stats.base.vitality){
                        this.stats.vitality += this.stats.vitalityRegen
                        if(this.stats.vitality > this.stats.base.vitality) this.stats.vitality = this.stats.base.vitality
                        console.log('regen health', this.name, this.stats.vitality)
                    }
                    if(this.stats.energy < this.stats.base.energy){
                        this.stats.energy += this.stats.energyRegen
                        if(this.stats.energy > this.stats.base.energy) this.stats.energy = this.stats.base.energy
                        console.log('regen energy', this.name, this.stats.energy)
                    }
                    this.regenCounter = 0
                }
            } else this.regenCounter = 0
        }
        if(this.isDead) {
            this.deathCounter++
            if(this.deathCounter >= (4 * 45)){
                this.stats.reset()
                this.isDead = false
                this.deathCounter = null
            }
        }
    }

    attack(damage){
        let shield = this.stats.shield + 0
        if(shield > 0){
            this.stats.shield -= damage
            if(this.stats.shield <= 0){
                damage = this.stats.shield * -1
                this.stats.shield = 0
            } else damage = 0
        }
        this.stats.vitality -= damage
    }

    exportable(){
        return {
            name: this.name,
            race: this.race,
            paragon: this.paragon,
            id: this.id,
            stats: this.stats.exportable()
        }
    }

    save(){
        return {
            name: this.name,
            race: this.race,
            paragon: this.paragon,
            id: this.id,
            map: this.map,
            accountId: this.accountId
        }
    }

    load(obj){
        this.name = obj.name
        this.race = obj.race
        this.paragon = obj.paragon
        this.id = obj.id
        this.map = obj.map
        this.accountId = obj.accountId
        return this
    }

}