const Database = require("@replit/database")
const db = new Database()

const getData = async () => {
    let res = await db.list()
    return res
}

const remove = (key) => {
    db.delete(key)
    return {msg: 'complete'}
}

const get = async (key) => {
    let res = await db.get(key)
    return res
}

module.exports = {getData, remove, get}