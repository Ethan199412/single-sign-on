const { builtinModules } = require("module")

function getExpireTime() {
    let date = new Date()
    let expireSeconds = 30
    date.setTime(date.getTime() + expireSeconds * 1000)
    return date.toGMTString()
}

function doesTokenExist(cookie) {
    let cookieObj = getCookieObj(cookie)
    let token = cookieObj && cookieObj.token
    return !!token
}

function getCookieObj(cookie) {
    console.log('[p0] cookie', cookie)
    if (!cookie) return
    let cookieObj = {}
    cookie = cookie.split(';').forEach(e => {
        let kv = e.trim().split('=')
        cookieObj[kv[0]] = kv[1]
    })
    return cookieObj
}

function getRedirectUrl(url) {
    let param = getParam(url)
    return param.redirectUrl
}

function getParam(url) {
    let query = url.split('?')[1]
    if (!query) {
        return {}
    }
    let param = {}
    query.split('&').forEach(e => {
        let kv = e.trim().split('=')
        param[kv[0]] = kv[1]
    })
    return param
}

module.exports = {
    getExpireTime,
    doesTokenExist,
    getRedirectUrl,
    getParam,
    getCookieObj
}