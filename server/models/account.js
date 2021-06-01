const guid = require('../utils/guid.js')
const Database = require("@replit/database")
const verifyCode = require('../utils/verifyCode.js')

module.exports = class{

    constructor(email, password, firstname, lastname, nickname){
        this.firstname = firstname
        this.lastname = lastname
        this.nickname = nickname
        this.email = email
        this.password = password
        this.data = {}
        this.verified = false
        this.freeTrial = false
        this.subTime = 0
        this.verificationCode = verifyCode()
    }

    checkSessionTime = () => {
        const date = new Date(this.sessionTime)
        const compare = new Date()
        compare.setDate(date.getDate() + 7);
        if(new Date() > compare){
            this.sessionId = guid()
            this.sessionTime = new Date().toDateString()
            const db = new Database()
            db.set(`user-${this.email}`, this.save())
        }
    }

    async log(email, password){
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
        let obj = {
            email: this.email,
            sessionId: this.sessionId,
            nickname: this.nickname,
            subTime: this.subTime,
            verified: this.verified,
            freeTrial: this.freeTrial,
        }
        if(this.paymentSessionId) obj.paymentSessionId = this.paymentSessionId
        if(this.customer) obj.customer = this.customer
        if(this.active) obj.active = this.active
        return obj
    }

    save(){
        let obj = {
            email: this.email,
            password: this.password,
            sessionId: this.sessionId,
            sessionTime: this.sessionTime,
            data: JSON.stringify(this.data),
            firstname: this.firstname,
            lastname: this.lastname,
            nickname: this.nickname,
            subTime: this.subTime,
            verified: this.verified,
            freeTrial: this.freeTrial,
        }
        if(!this.verified) obj.verificationCode = this.verificationCode
        if(this.paymentSessionId) obj.paymentSessionId = this.paymentSessionId
        if(this.customer) obj.customer = this.customer
        if(this.active) obj.active = this.active
        if(this.recover) obj.recover = this.recover
        return obj
    }

    load(obj){
        this.email = obj.email
        this.password = obj.password
        this.sessionId = obj.sessionId
        this.sessionTime = new Date(obj.sessionTime)
        this.firstname = obj.firstname
        this.lastname = obj.lastname
        this.nickname = obj.nickname
        this.subTime = obj.subTime
        this.verified = obj.verified
        this.freeTrial = obj.freeTrial
        if(obj.verificationCode && !this.verified) this.verificationCode = obj.verificationCode
        if(obj.paymentSessionId) this.paymentSessionId = obj.paymentSessionId
        if(obj.customer) this.customer = obj.customer
        if(obj.active) this.active = obj.active
        if(obj.recover) this.recover = obj.recover
        if(obj.data) this.data = JSON.parse(obj.data)
        this.checkSessionTime(this.email, this)
        return this
    }

    async savetodb(){
        const db = new Database()
        await db.set(`user-${this.email}`, this.save())
    }
}