const server = require('../utils/server.js')
const paymentPipe = require('../pipes/payment.js')

module.exports = server.post('payment', async (body, req) => {
    const email = body.email.toLowerCase()
    const sessionId = body.sessionId
    const webhook = body.webhook
    const checkSession = body.checkSession
    const checkSubscription = body.checkSubscription

    if(webhook)
        return await paymentPipe.review(email, sessionId)

    if(checkSession)
        return await paymentPipe.checkPaymentSession(email, sessionId)

    if(checkSubscription)
        return await paymentPipe.checkSubscription(email, sessionId)

    return await paymentPipe.request(email, sessionId)
})