const Database = require("@replit/database")
const db = new Database()

const list = async () => {
    let res = await db.list()
    return res
}

const feedback = async () => {
    let res = await db.get('feedback')
    return res
}

module.exports = {
    list,
    feedback
}