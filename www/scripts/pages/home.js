import i0 from '../i0.js'
export default 

i0.obj('home',
`
    <section>
        <h1>Archon Reset Server</h1>
        <div>
            <button class="action" i0="list">List</button>
        </div>
        <div>
            <input i0="getKey" placeholder="key">
            <button class="action" i0="get">Get</button>
        </div>
        <div>
            <input i0="removeKey" placeholder="key">
            <button class="action" i0="remove">Remove</button>
        </div>
        <hr>
        <div>
            <button class="action" i0="create">Test Create</button>
        </div>
        <div>
            <button class="action" i0="login">Test Login</button>
        </div>
        <div>
            <input i0="email" placeholder="email">
            <input i0="sessionId" placeholder="sessionId">
            <button class="action" i0="validate">Validate</button>
        </div>
    </section>
`,
async (ui, props) => {
    ui.email.value = 'brayanbyrdsong@gmail.com'

    ui.list.onclick = async () => {
        let list = await i0.fetch('admin', {list:true})
        console.log(list)
    }

    ui.create.onclick = async () => { 
        let res = await i0.fetch('signin', {signup:true, email: 'brayanbyrdsong@gmail.com', password: 'admin'})
        console.clear()
        console.log(res)
        let list = await i0.fetch('admin', {list:true})
        console.log(list)
    }

    ui.login.onclick = async () => {
        let res = await i0.fetch('signin', {signin:true, email: 'brayanbyrdsong@gmail.com', password: 'admin'})
        console.log(res)
    }

    ui.remove.onclick = async () => {
        const key = ui.removeKey.value
        if(key){
            let res = await i0.fetch('admin', {remove: key})
            console.clear()
            console.log(res)
            let list = await i0.fetch('admin', {list:true})
            console.log(list)
            ui.removeKey.value = ''
        }
    }

    ui.get.onclick = async () => {
        const key = ui.getKey.value
        if(key){
            let res = await i0.fetch('admin', {get: key})
            console.log(res)
        }
    }

    ui.validate.onclick = async () => {
        const email = ui.email.value
        const sessionId = ui.sessionId.value
        if(email && sessionId){
            let res = await i0.fetch('signin', {email, sessionId})
            console.log(res)
            ui.sessionId.value = ''
        }
    }

})