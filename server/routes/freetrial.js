const server = require('../utils/server.js')
const authPipe = require('../pipes/auth.js')

module.exports = server.post('freetrial', async body => {
    const email = body.email.toLowerCase()
    const sessionId = body.sessionId
    console.log('free trial', email)
    return await authPipe.startFreeTrial(email, sessionId)
})