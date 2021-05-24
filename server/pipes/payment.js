const auth = require("./auth.js")
const payment = require("../utils/payment.js")

const request =  async (email, sessionId) => {
    const account = await auth.load(email, sessionId)
    if(!account || account.error) return account || {error: 'Account not found.'}
    return await payment.request(account)
}

const review =  async (req) => {
    return await payment.review(req)
}

const checkPaymentSession =  async (email, sessionId) => {
    const account = await auth.load(email, sessionId)
    if(!account || account.error) return account || {error: 'Account not found.'}
    return await payment.checkPaymentSession(account)
}

const checkSubscription =  async (email, sessionId) => {
    const account = await auth.load(email, sessionId)
    if(!account || account.error) return account || {error: 'Account not found.'}
    return await payment.checkSubscription(account)
}

module.exports = {request, review, checkPaymentSession, checkSubscription}