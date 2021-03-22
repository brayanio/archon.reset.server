module.exports = class{

    constructor(email, password){
        this.email = email
        this.password = password
        this.data = {}
    }

    checkSessionTime = () => {
        const date = new Date(this.sessionTime)
        const compare = new Date()
        compare.setDate(date.getDate() + 7);
        if(new Date() > compare){
            this.sessionId = guid()
            this.sessionTime = new Date().toDateString()
            db.set(`user-${this.email}`, this.save())
        }
    }

    async log(email, password){
        const guid = require('../utils/guid.js')
        const Database = require("@replit/database")
        const db = new Database()
        if(email != this.email) return {error: 'Credentials do not match'}
        if(password != this.password) return {error: 'Credentials do not match'}
        const account = await db.get(`user-${email}`)
        if(account){
            this.email = email
            this.sessionTime = account.sessionTime
            this.checkSessionTime(email, account)
        }
        else {
            this.sessionId = guid()
            this.sessionTime = new Date().toDateString()
            db.set(`user-${email}`, this.save())
        }
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
            sessionId: this.sessionId
        }
    }

    save(){
        return {
            email: this.email,
            password: this.password,
            sessionId: this.sessionId,
            sessionTime: this.sessionTime,
            data: JSON.stringify(this.data)
        }
    }

    load(obj){
        this.email = obj.email
        this.password = obj.password
        this.sessionId = obj.sessionId
        this.sessionTime = new Date(obj.sessionTime)
        if(obj.data) this.data = JSON.parse(obj.data)
        this.checkSessionTime(this.email, this)
        return this
    }

    async savetodb(){
        const Database = require("@replit/database")
        const db = new Database()
        await db.set(`user-${this.email}`, this.save())
    }
}