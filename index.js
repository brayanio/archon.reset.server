const Database = require("@replit/database")
const db = new Database()

db.list().then(val => console.log(val))

db.delete('user-brayanbyrdsong@icloud.com')

/* SERVER */
const server = require('./server/utils/server.js')
require('./server/routes/data.js')
require('./server/routes/signin.js')
server.serve(4200)