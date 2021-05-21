const server = require('../utils/server.js')
const adminPipe = require('../pipes/admin.js')

module.exports = server.post('admin', async body => {
  
    const users = body.users
    if(users){
        return await adminPipe.list()
    }

    const feedback = body.feedback
    if(feedback){
        return await adminPipe.feedback()
    }

})