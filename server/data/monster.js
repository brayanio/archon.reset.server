const Monster = require('../models/monster.js')
const Stats = require('../models/stats.js')
const monsterAbilityData = require('./monster-ability.js')

module.exports = {
    Illusion: () => new Monster( 'Illusion', 1, 'illusion', 10 * 4, 3, [monsterAbilityData["Basic Attack"]()], new Stats(40, 12, 5, 1, 3) )
}