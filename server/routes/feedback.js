const server = require('../utils/server.js')
const feedbackPipe = require('../pipes/feedback.js')

module.exports = server.post('feedback', async body => {
    const email = body.email.toLowerCase()
    const sessionId = body.sessionId
    const feedback = body.feedback
    console.log('feedback submitted')
    return await feedbackPipe.send(email, sessionId, feedback)
})