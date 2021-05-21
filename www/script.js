import i0 from './i0.js'

i0.obj('home', 
`
    <h1>Admin Panel</h1>
    <div><b>Users</b></div>
    <div i0="users"></div>
    <div><b>Feedback</b></div>
    <div i0="feedback"></div>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
        
        *{    
            font-family: 'Inter', sans-serif;
        }

        html{
            background: violet;
        }

        .bubble{
            background: white;
            padding: 12px;
            margin: 12px;
            box-shadow: 0 3px 5px rgba(0,0,0,0.3);
            border-radius: 9px;
        }
    </style>
`,
async ui => {

    let res = await i0.fetch('admin', {users: true})
    console.log(res)
    if(res){
        res.forEach(string => {
            if(string.substr(0, 5) === 'user-' && string.substr(5) !== 'undefined'){
                ui.users.appendChild(i0.element(`
                    <div class="bubble">${string.substr(5)}</div>
                `))
            }
        })
    }

    res = await i0.fetch('admin', {feedback: true})
    console.log(res)
    if(res){
        res.forEach(string => {
            ui.feedback.appendChild(i0.element(`
                <div class="bubble">${string}</div>
            `))
        })
    }
        
})

i0.target('https://essencialsbackend.blbbrayan.repl.co')
i0.router({'': 'home', '#home': 'home'})