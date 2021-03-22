const auth = require("./auth.js")

const load = async (email, sessionId) => {
    const account = await auth.load(email, sessionId)
    if(account.error) return account
    return account.data
}

const save = async (email, sessionId, key, data) => {
    const account = await auth.load(email, sessionId)
    if(account.error) return account
    account.data[key] = data
    await account.savetodb()
    return {msg: 'Save successful'}
}

module.exports = {load, save}