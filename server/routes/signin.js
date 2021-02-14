const server = require('../utils/server.js')
const auth = require('../pipes/auth.js')
const salt = require('../utils/salt.js')

module.exports = server.post('signin', body => {
  const email = body.email.toLowerCase()
  const password = salt(body.password)
  const signup = body.signup
  const signin = body.signin
  const sessionId = body.sessionId

  if(signup) {
      console.log('signup', email)
      return auth.create(email, password)
  }
  if(signin) {
      console.log('signin', email)
      return auth.log(email, password)
  }
  if(sessionId){
      console.log('sessionId', email)
      return auth.validate(email, sessionId)
  }
})