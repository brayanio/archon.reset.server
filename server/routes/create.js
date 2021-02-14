const server = require('../utils/server.js')
const create = require('../pipes/create.js')

module.exports = server.post('create', body => {
    const email = body.email
    const sessionId = body.sessionId
    const name = body.name
    const race = body.race
    const paragon = body.paragon
    console.log('create', email)

    return create.createArchon(email, sessionId, name, race, paragon)
})