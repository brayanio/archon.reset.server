const server = require('../utils/server.js')
const authPipe = require('../pipes/auth.js')

module.exports = server.post('verify', async body => {
    const email = body.email.toLowerCase()
    const sessionId = body.sessionId
    const code = body.code
    console.log('email verified', email)
    return await authPipe.verifyEmail(email, sessionId, code)
})