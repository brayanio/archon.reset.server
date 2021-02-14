const server = require('../utils/server.js')
const play = require('../pipes/play.js')

module.exports = server.post('play', body => {
    const email = body.email
    const sessionId = body.sessionId
    const archonId = body.archonId
    const updateKey = body.updateKey
    const mapName = body.mapName
    const load = body.load

    if(load){
        console.log('play:load', email)
        return play.load(email, sessionId, archonId)
    }
    if(updateKey){
        console.log('play:check', email)
        return play.check(email, sessionId, archonId, updateKey)
    }
    if(mapName){
        console.log('play:changeMap', email, mapName)
        return play.changeMap(email, sessionId, archonId, mapName)
    }
})