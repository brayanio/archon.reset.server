const Database = require("@replit/database")
const db = new Database()
const Account = require("../models/account.js")
const mail = require('../utils/mail.js')

const create = async (email, password, firstname, lastname, nickname) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(res) return {error: 'Email already in use'}
    const account = new Account(email, password, firstname, lastname, nickname)
    res = await account.log(email, password)
    res = await mail.sendMail(email, 
        'Verify your email address',
        `
            <h1>Thank you for signing up for Essencials, ${nickname}!</h1>
            <p>
                <i>Your verification code is:</i>&nbsp;<b>${account.verificationCode}</b>
            </p>
            <p>Enter your code on <a href="https://www.essencials.page/?#home">www.essencials.page/#home</a>.</p>
        `
    )
    res = await db.set(key, account.save())
    return account.exportable()
}

const log = async (email, password) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(!res) return {error: 'Account not found'}
    let account = new Account()
    account.load(res)
    return account.log(email, password)
}

const validate = async (email, sessionId) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(!res) return {error: 'Account not found'}
    let account = new Account()
    account.load(res)
    if(!account.validate(email, sessionId)) return {error: 'Invalid session'}
    return account.exportable()
}

const load = async (email, sessionId) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(!res) return {error: 'Account not found'}
    let account = new Account()
    account.load(res)
    if(!account.validate(email, sessionId)) return {error: 'Invalid session'}
    return account
}

const verifyEmail = async (email, sessionId, code) => {
    let account = await load(email, sessionId)
    if(account.error) return account

    if(account.verificationCode === code){
        account.verified = true
        delete account.verificationCode
        await account.savetodb()
        return account.exportable()
    } 
    return {error: 'code incorrect'}
}

const startFreeTrial = async (email, sessionId) => {
    let account = await load(email, sessionId)
    if(account.error) return account

    if(account.freeTrial === false){
        account.freeTrial = true
        account.subTime = 30
        await account.savetodb()
        return account.exportable()
    }
    return {error: 'free trial has expired'}
}

module.exports = {create, log, validate, load, verifyEmail, startFreeTrial}