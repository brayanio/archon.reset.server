const server = require('../utils/server.js')
const admin = require('../pipes/admin.js')

module.exports = server.post('admin', body => {
    const list = body.list
    const remove = body.remove
    const get = body.get

    if(list){
        console.log('admin:list')
        return admin.getData()
    }

    if(remove){
        console.log('admin:remove')
        return admin.remove(remove)
    }

    if(get){
        console.log('admin:get')
        return admin.get(get)
    }
})