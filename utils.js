const { builtinModules } = require("module")

function getExpireTime() {
    let date = new Date()
    let expireDays = 10
    date.setTime(date.getTime() + expireDays * 24 * 3600 * 1000)
    return date.toGMTString()
}

function doesTokenExist(cookie) {
    cookie = cookie.split(';').map(e => {
        let kv = e.trim().split('=')
        return {
            [kv[0]]: kv[1]
        }
    })
    console.log('[p0] cookie', cookie)
    let index = cookie.findIndex(e => e.token === 'logInSuccessfulToken')
    console.log('[p1] index', index)
    return index !== -1
}

module.exports = {
    getExpireTime,
    doesTokenExist
}