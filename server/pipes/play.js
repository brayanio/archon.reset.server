const auth = require('./auth.js')
const mapService = require('../services/map.js')

const load = async (email, sessionId, archonId) => {
    const account = await auth.load(email, sessionId)
    if(account.error) return account
    const archon = account.archon.find(a => a.id === archonId)
    return mapService.joinRoom(archon)
}

const check = async (email, sessionId, archonId, updateKey) => {
    const account = await auth.load(email, sessionId)
    if(account.error) return account
    const archon = account.archon.find(a => a.id === archonId)
    return mapService.checkRoom(archon, updateKey)
}

const changeMap = async (email, sessionId, archonId, mapId) => {
    const account = await auth.load(email, sessionId)
    if(account.error) return account
    const archon = account.archon.find(a => a.id === archonId)
    return mapService.changeMap(account, archon, mapId)
}

module.exports = {
    load, check, changeMap
}