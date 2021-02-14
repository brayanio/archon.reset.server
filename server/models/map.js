const guid = require('../utils/guid.js')

const Account = require('../models/account.js')
const Database = require("@replit/database")
const db = new Database()

module.exports = class{

    constructor(name, monsters, maps, population){
        this.name = name
        this.maps = maps
        this.population = population
        this.players = []
        this.monsters = monsters
        this.update()
    }

    targetMonster(){
        let targets = this.monsters.filter(stack => stack.amount > 0)
        if(targets.length){
            const target = targets[Math.floor(Math.random() * targets.length)]
            return target
        }
    }

    targetPlayer(){
        let targets = this.players.filter(player => player.stats.vitality > 0)
        if(targets.length){
            const target = targets[Math.floor(Math.random() * targets.length)]
            return target
        }
    }

    tick(){
        //spawn monsters
        const spawned = this.monsters.filter(monster => monster.spawnTick())
        if(spawned.length) this.update()
        // regen
        let regenerated = this.players.filter(player => player.regen())
        if(regenerated.length) this.update()
        regenerated = this.monsters.filter(monster => monster.regen())
        if(regenerated.length) this.update()
        //combat - players
        if(this.targetMonster()){
            const attackers = this.players.filter(player => player.combatTick(() => this.targetMonster()))
            if(attackers.length) this.update()
        }
        //combat - monsters
        if(this.targetPlayer()){
            const attackers = this.monsters.filter(monster => monster.combatTick(() => this.targetPlayer()))
            if(attackers.length) this.update()
        }
        // Reward EXP
        this.monsters.forEach(monster => {
            // console.log(monster.killed)
            if(monster.killed){
                let killed = monster.killed + 0
                monster.killed = 0
                this.players.forEach(async player => {
                    let res = await db.get(`user-${player.accountId}`)
                    const account = new Account()
                    account.load(res)
                    account.exp += (killed * monster.exp)
                    account.savetodb()
                    console.log('')
                    console.log('map:tick')
                    console.log('Adding EXP to account')
                    console.log('')
                })
            }
        })
    }

    update(){
        this.lastupdate = new Date()
        this.updateKey = guid()
    }

    join(archon){
        if(!this.players.find(a => a.id === archon.id)){
            this.players.push(archon)
            this.update()
        }
    }

    exportable(archonId){
        return {
            name: this.name,
            maps: this.maps,
            player: this.players.find(p => p.id === archonId).exportable(),
            allies: this.players.filter(p => p.id !== archonId).map(p => p.exportable()),
            monsters: this.monsters.map(monster => monster.exportable()),
            updateKey: this.updateKey
        }
    }

}