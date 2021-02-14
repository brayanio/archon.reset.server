/* SERVER */
const server = require('./server/utils/server.js')
require('./server/routes/admin.js')
require('./server/routes/create.js')
require('./server/routes/play.js')
require('./server/routes/signin.js')
server.serve(4200)