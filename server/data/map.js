const Map = require('../models/map.js')
const monsters = require('./monster.js')

module.exports = {
    Medea: () => new Map('Medea', [monsters.Illusion()], ['Medea Outlands'], 3),
    'Medea Outlands': () => new Map('Medea Outlands', [monsters.Illusion(), monsters.Illusion(), monsters.Illusion()], ['Medea'], 9)
}