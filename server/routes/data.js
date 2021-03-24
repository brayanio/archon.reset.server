const server = require('../utils/server.js')
const dataPipe = require('../pipes/data.js')

module.exports = server.post('data', async body => {
  const email = body.email.toLowerCase()
  const sessionId = body.sessionId
  const load = body.load
  const key = body.key
  const data = body.data

  if(load){
      console.log('load', email)
      return await dataPipe.load(email, sessionId)
  }
  if(key && data){
      console.log('save', key, email)
      return await dataPipe.save(email, sessionId, key, data)
  }
})