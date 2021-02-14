const Ability = require('../models/ability.js')

module.exports = {
    ['Basic Attack']: () => new Ability('Basic Attack', 'basic-attack', 5, 6)
        .on((monster, player) => {
            player.attack(monster.stats.power)
        })
}