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

const load = (id, props) => {
    if(components[id]){
        const clone = components[id].template.content.cloneNode(true)
        const ui = {}
        _geti0(clone, ui)
        _getNuggets(clone, ui)
        if(components[id].init)
            components[id].init(ui, props)
        return clone
    }
}

const element = (html, init) => {
    const template = document.createElement('template')
    template.innerHTML = html
    const clone = template.content.cloneNode(true)
    const ui = {}
    _geti0(clone, ui)    
    if(init) init(ui)
    _getNuggets(clone, ui)
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
    }, 0)
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
const checkCollision = (rect1, rect2) => 
    (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) 

const empty = el => {
    while(el.lastChild) el.removeChild(el.lastChild)
}

const id = a => document.querySelector(`#${a[0]}`)
const find = e => {
    let parent = e.parentNode
    if(parent){
        while(parent.parentNode) parent = parent.parentNode
        return a => parent.querySelector(`#${a[0]}`)
    } 
    return a => e.querySelector(`#${a[0]}`)
}
const prop = (el, val) => el.querySelector(`[prop="${val}"]`)

const sound = (name, volume) => {
    let a = new Audio(`./assets/${name}.mp3`)
    a.volume = volume || BASE_SOUND
    a.play()
    return a
}

const form = el => {
    let obj = {}
    Array.from(el).forEach(e => {obj[e.id] = {value: e.value, el: e}})

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
    return {close: () => broadcasts[name].indexOf(fn) ? broadcasts[name].splice(broadcasts[name].indexOf(fn), 1) : null}
}
const broadcast = (name, ...props) => {
    if(broadcasts[name]) broadcasts[name].forEach(fn => fn(...props))
}

// i0
export default {
    obj, load, element, nugget,
    router,
    fetch: onFetch, target: str => target = str,
    checkCollision, empty, id, find, prop, sound, form,
    broadcast, onbroadcast
}