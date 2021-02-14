const auth = require('./auth.js')
const Archon = require('../models/archon.js')

const createArchon = async (email, sessionId, name, race, paragon) => {
    const account = await auth.load(email, sessionId)
    if(account.error) return account
    let archon = new Archon(name, race, paragon, email)
    console.log(account)
    account.archon.push(archon)
    account.savetodb()
    return account.exportable()
}

module.exports = {
    createArchon
}