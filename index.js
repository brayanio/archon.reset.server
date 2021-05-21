const Database = require("@replit/database")
const db = new Database()

db.list().then(val => console.log(val))

// db.delete('user-brayanbyrdsong@gmail.com')

/* SERVER */
const server = require('./server/utils/server.js')
require('./server/routes/admin.js')
require('./server/routes/data.js')
require('./server/routes/feedback.js')
require('./server/routes/freetrial.js')
require('./server/routes/payment.js')
require('./server/routes/signin.js')
require('./server/routes/verify.js')
require('./server/routes/webhook.js')
server.serve(4200)