const Archon = require("./archon.js")
const Database = require("@replit/database")
const db = new Database()
const guid = require('../utils/guid.js')

module.exports = class{

    constructor(email, password){
        this.email = email
        this.password = password
        this.archon = []
        this.log(email, password)
        this.exp = 0
    }

    log(email, password){
        if(email != this.email) return {error: 'Credentials do not match'}
        if(password != this.password) return {error: 'Credentials do not match'}
        this.sessionId = guid()
        this.sessionTime = new Date()
        db.set(`user-${email}`, this.save())
        return this.exportable()
    }

    validate(email, sessionId){
        if(this.email === email && this.sessionId === sessionId){
            return true
        }
    }

    exportable(){
        return {
            email: this.email,
            sessionId: this.sessionId,
            archon: this.archon.map(a => a.exportable()),
            exp: this.exp
        }
    }

    save(){
        return {
            email: this.email,
            password: this.password,
            sessionId: this.sessionId,
            sessionTime: this.sessionTime,
            archon: this.archon.map(a => a.save()),
            exp: this.exp
        }
    }

    load(obj){
        this.email = obj.email
        this.password = obj.password
        this.sessionId = obj.sessionId
        this.sessionTime = obj.sessionTime
        this.archon = obj.archon.map(d => (new Archon().load(d)))
        this.exp = obj.exp
        return this
    }

    savetodb(){
        db.set(`user-${this.email}`, this.save())
    }
}