const { builtinModules } = require("module")

function getExpireTime() {
    let date = new Date()
    let expireDays = 10
    date.setTime(date.getTime() + 30 * 1000)
    return date.toGMTString()
}

function doesTokenExist(cookie) {
    if (!cookie) return
    cookie = cookie.split(';').map(e => {
        let kv = e.trim().split('=')
        return {
            [kv[0]]: kv[1]
        }
    })
    let index = cookie.findIndex(e => e.token === 'logInSuccessfulToken')
    return index !== -1
}

function getCookieObj(cookie) {
    if (!cookie) return
    let cookieObj = {}
    cookie = cookie.split(';').forEach(e => {
        let kv = e.trim().split('=')
        cookieObj[kv[0]] = kv[1]
    })
    return cookieObj
}

function getRedirectUrl(url) {
    let query = url.split('?')[1]
    if (!query) {
        return
    }
    let queryList = query.split('&').map(e => {
        kv = e.trim().split('=')
        return {
            [kv[0]]: kv[1]
        }
    })
    let index = queryList.findIndex(e => e.redirectUrl)
    if (index !== -1) {
        return queryList[index].redirectUrl
    }
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