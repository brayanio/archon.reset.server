const Map = require('../data/map.js')

let maps = {}
let playerIndex = {}

const joinRoom = (archon) => {
    const map = archon.map
    let open
    if(!maps[map]){
        open = Map[map]()
        maps[map] = {[open.id]: open}
    }
    if(!open)
        open = Object.values(maps[map]).find(m => m.players.length < m.population)
    if(!open){
        open = Map[map]()
        maps[map][open.id] = open
    }
    playerIndex[archon.id] = open.id
    open.join(archon)
    return open.exportable(archon.id)
}

const checkRoom = (archon, updateKey) => {
    if(!maps[archon.map]) return {error: 'Player must join a room'}
    const map = maps[archon.map][playerIndex[archon.id]]
    if(map){
        map.lastupdate = new Date()
        if(map.updateKey !== updateKey)
            return map.exportable(archon.id)
        else
            return {msg: 'No updates'}
    }
    return {error: 'Player must join a room'}
}

const changeMap = (account, archon, mapName) => {
    if(!maps[archon.map]) return {error: 'Player must join a room'}
    const map = maps[archon.map][playerIndex[archon.id]]
    if(map && map.maps.find(m => m === mapName)){
        map.players = map.players.filter(a => a.id !== archon.id)
        archon.map = mapName
        account.savetodb()
        return joinRoom(archon)
    }
    return {error: 'Player must join a room'}
}

//tick interval
setInterval(() => 
    Object.values(maps).forEach(mapObj => 
        Object.values(mapObj).forEach(map => {
            // tick
            map.tick()
            // check for death
            const delta = Math.abs(new Date() - map.lastupdate)
            if(delta > 1000 * 60 * 20) delete maps[map.name][map.id]
            // console.log(delta)
        })
    ), 250
)

module.exports = {
    joinRoom, checkRoom, changeMap
}