const Database = require("@replit/database")
const db = new Database()
const Account = require("../models/account.js")
const mail = require('../utils/mail.js')
const verifyCode = require('../utils/verifyCode.js')

const create = async (email, password, firstname, lastname, nickname) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(res) return {error: 'Email already in use'}
    const account = new Account(email, password, firstname, lastname, nickname)
    res = await account.log(email, password)
    res = await mail.sendMail(email, 
        'Verify your email address',
        `
            <h1>Thank you for signing up for Essencials, ${account.nickname}!</h1>
            <p>
                <i>Your verification code is:</i>&nbsp;<b>${account.verificationCode}</b>
            </p>
            <p>Enter your code on <a href="https://www.essencials.page/?#home">www.essencials.page/#home</a>.</p>
        `
    )
    res = await db.set(key, account.save())
    return account.exportable()
}

const resendVerifyEmail = async (email, sessionId) => {
    let account = await load(email, sessionId)
    if(account.error || !account) return account || {error: 'Account not found'}
    res = await mail.sendMail(email, 
        'Verify your email address',
        `
            <h1>Thank you for signing up for Essencials, ${account.nickname}!</h1>
            <p>
                <i>Your verification code is:</i>&nbsp;<b>${account.verificationCode}</b>
            </p>
            <p>Enter your code on <a href="https://www.essencials.page/?#home">www.essencials.page/#home</a>.</p>
        `
    )
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
    console.log('validate payment session id', account.paymentSessionId)
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
        const date = new Date()
        date.setDate(date.getDate() + 7)
        account.subTime = date.toDateString()
        await account.savetodb()
        return account.exportable()
    }
    return {error: 'free trial has expired'}
}

const recoverPassword = async (email) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(!res) return {error: 'Account not found'}
    let account = new Account()
    account.load(res)
    account.recover = verifyCode()
    account.savetodb()
    await mail.sendMail(email, 
        'Change password',
        `
            <h1>A request has been filled to change your password, ${account.nickname}.</h1>
            <p>
                <i>Your recover code is:</i>&nbsp;<b>${account.recover}</b>
            </p>
            <p>Enter your code on <a href="https://www.essencials.page/#recoverpassword">www.essencials.page/#recoverpassword</a>.</p>
            <p>If you did not request this, then just ignore this email to keep the same password.</p>
        `
    )
    return {msg: 'Account recover code created'}
}

const verifyRecoverPassword = async (email, password, code) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(!res) return {error: 'Account not found'}
    let account = new Account()
    account.load(res)
    if(account.recover !== code) return {error: 'Incorrect recover code'}
    delete account.recover
    account.password = password
    account.savetodb()
    return {msg: 'Account password successfully changed'}
}

const changeNickname = async (email, sessionId, name) => {
    let account = await load(email, sessionId)
    if(account.error) return account

    account.nickname = name
    account.savetodb()
    return {msg: 'gucci'}
}

module.exports = {create, log, validate, load, verifyEmail, resendVerifyEmail, startFreeTrial, recoverPassword, verifyRecoverPassword, changeNickname}