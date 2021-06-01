const server = require('../utils/server.js')
const authPipe = require('../pipes/auth.js')
const salt = require('../utils/salt.js')

module.exports = server.post('recover', async body => {
    const email = body.email.toLowerCase()
    const password = body.password ? salt(body.password) : null
    const code = body.code ? body.code.toLowerCase() : null
    console.log('recover password', email)
    if(password && code)
        return await authPipe.verifyRecoverPassword(email, password, code)
    return await authPipe.recoverPassword(email)
})