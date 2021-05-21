let guid = (r, v) =>
'i0-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => 
  (r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8))
  .toString(16))

// main ui
let components = {}
let nuggetprops = {}

const _getNuggets = (clone, ui) => {
    Array.from(clone.querySelectorAll('[i0-nugget]')).forEach(el => {
        let props = nuggetprops[el.getAttribute('props')] || {}
        let id = el.getAttribute('i0')
        let i0El = load(el.getAttribute('i0-nugget'), props)
        let nodeAr = Array.from(i0El.childNodes).filter(n => n.nodeName !== '#text')
        let nodeEl = nodeAr.length === 1 ? nodeAr[0] : nodeAr
        el.parentNode.replaceChild(i0El, el)
        if(props.i0propdelete) delete nuggetprops[el.getAttribute('props')]
        if(id) ui[id] = nodeEl
    })
}

const _geti0 = (clone, ui) => {
    Array.from(clone.querySelectorAll('[i0]')).forEach(el => {
        if(el.getAttribute('i0-nugget')) return null
        ui[el.getAttribute('i0')] = el
        el.removeAttribute('i0')
    })
}

const obj = (id, html, init) => {
    const template = document.createElement('template')
    template.innerHTML = html
    components[id] = {template, init}
}

const load = (id, props, el) => {
    if(components[id]){
        const clone = components[id].template.content.cloneNode(true)
        const ui = {}
        _geti0(clone, ui)
        _getNuggets(clone, ui)
        if(components[id].init)
            components[id].init(ui, props)

        if(el) el.parentNode.replaceChild(clone, el)
        return clone
    }
}

const element = (html, init, el) => {
    const template = document.createElement('template')
    template.innerHTML = html
    const clone = template.content.cloneNode(true)
    const ui = {}
    _geti0(clone, ui)    
    if(init) init(ui)
    _getNuggets(clone, ui)
    if(el) el.parentNode.replaceChild(clone, el)
    return clone
}

const nugget = (component, props, i0Id) => {
    let id = guid()
    if(props) {
        nuggetprops[id] = props
        props.i0propdelete = props.i0propdelete || false
    }
    let i0attr = i0Id ? `i0="${i0Id}"` : ''
    return `<input ${i0attr} i0-nugget="${component}" props="${id}">`
}

// routing
let routes
const transition = app => {
    app.style.opacity = '0'
    setTimeout(() => { 
        app.style.opacity = '1' 
        app.style.transition = '0.3s'
        setTimeout(() => { app.style.transition = '0s' }, 300)
    }, 50)
}
const loadRoute = app => {
    const route = routes[location.hash]
    if(route){
        app.innerHTML = ''
        transition(app)
        app.appendChild(load(route))
    }
}
const router = (obj) => {
    const app = document.createElement('app')
    routes = obj
    loadRoute(app)
    app.style.opacity = '0'
    onhashchange = () => loadRoute(app)
    document.body.appendChild(app)
}

// http
let target = ''

const JSON_to_URLEncoded = (element,key,list) => {
    list = list || []
    if(typeof element == 'object')
        for (let idx in element)
        JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list)
    else 
        list.push(key+'='+encodeURIComponent(element))
    return list.join('&')
}

const post = body => { return {
    method: "POST",
    body: JSON_to_URLEncoded(body || {}), 
    cache: 'no-cache',
    headers: {
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
} }

const onFetch = (path, body) => target 
    ? fetch(
        path ? `${target}/${path}` : target, 
        post(body)
    ).then(res => res.json())
    : null

// utils
const form = el => {
    let obj = {}
    Array.from(el).forEach(e => {obj[e.getAttribute('i0form')] = {value: e.value, el: e}})

    obj.clearForm = () => {
        Object.values(obj).forEach(val => {
            if(val.el && val.el.type !== 'button')
                val.el.value = ''
        })
    }

    return obj
}

// Broadcast
let broadcasts = {}
const onbroadcast = (name, fn) => {
    if(!broadcasts[name]) broadcasts[name] = [fn]
    else broadcasts[name].push(fn)
    return {close: () => broadcasts[name] = broadcasts[name].filter(f => f !== fn)}
}
const broadcast = (name, ...props) => {
    if(broadcasts[name]) broadcasts[name].forEach(fn => fn(...props))
}
const emptybroadcast = name => broadcasts[name] = []

// i0
export default {
    obj, load, element, nugget,
    router,
    fetch: onFetch, target: str => target = str,
    broadcast, onbroadcast, emptybroadcast,
    form, guid
}