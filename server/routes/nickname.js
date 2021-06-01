const server = require('../utils/server.js')
const authPipe = require('../pipes/auth.js')

module.exports = server.post('nickname', async body => {
    const email = body.email.toLowerCase()
    const sessionId = body.sessionId
    const name = body.name
    console.log('change nickname', email)
    return await authPipe.changeNickname(email, sessionId, name)
})