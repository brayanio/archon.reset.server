const Database = require("@replit/database")
const db = new Database()
const auth = require("./auth.js")

const send =  async (email, sessionId, feedback) => {
    let res = await auth.load(email, sessionId)
    if(res.error) return res
    const key = `feedback`
    let feedbackAr = await db.get(key)
    if(!feedbackAr) feedbackAr = []
    feedbackAr.push(email + ': ' + feedback)
    db.set(key, feedbackAr)
    return {msg: 'feedback submitted'}
}

module.exports = {send}