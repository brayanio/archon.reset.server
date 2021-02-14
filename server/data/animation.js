const Animation = require('../models/animation.js')

module.exports = {
    ['Basic Attack']: () => new Animation('Basic Attack', 'basic-attack', 5, 6)
}