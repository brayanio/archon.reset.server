const server = require('../utils/server.js')
const paymentPipe = require('../pipes/payment.js')

module.exports = server.post('webhook', async (body, req) => {
    return await paymentPipe.review(req)
})