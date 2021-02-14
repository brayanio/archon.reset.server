const guid = require('../utils/guid.js')

module.exports = class{

    constructor(name, asset, cost, cooldown, animation){
        this.name = name
        this.asset = asset
        this.cost = cost
        this.cooldown = cooldown
        this.timer = 0
        this.animation = animation
    }

    on(fn){
        this.onability = fn
        return this
    }

    use(player, monster, nocost){
        if(nocost === undefined) player.stats.energy -= this.cost
        this.timer = 0
        this.onability(player, monster)
    }

    exportable(){
        return {
            name: this.name,
            asset: this.asset
        }
    }

}