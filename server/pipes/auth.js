const Database = require("@replit/database")
const db = new Database()
const Account = require("../models/account.js")

const create = async (email, password) => {
    const key = `user-${email}`
    let res = await db.get(key)
    if(res) return {error: 'Email already in use'}
    const account = new Account(email, password)
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

module.exports = {create, log, validate, load}