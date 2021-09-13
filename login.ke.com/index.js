const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const ejs = require('ejs')
const { getExpireTime, doesTokenExist, getRedirectUrl, getCookieObj, getParam } = require('../utils.js')
const { SessionHandler } = require('./session.js')
const token = 'logInSuccessfulToken'

const userDataBase = {

}

http.createServer((req, res) => {
    let { url, method } = req
    pureUrl = url.split('?')[0]

    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    switch (pureUrl) {
        case '/login':
            switch (method) {
                case 'GET':
                    let redirectUrl = getRedirectUrl(url)
                    let isLogin = doesTokenExist(req.headers.cookie)
                    if (isLogin) {
                        if (redirectUrl) {
                            res.writeHead(302, { Location: `http://${redirectUrl}?token=${token}` })
                        }
                        res.end('您已登录')
                        return
                    }
                    const filePath = './view/login.ejs'
                    ejs.renderFile(filePath, { redirectUrl: redirectUrl }, null, function (err, str) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end(str)
                        }
                    })
                    break
            }
            break
        case '/handle-login':
            let data = ''
            req.on('data', function (chunk) {
                data += chunk
            })
            req.on('end', function () {
                data = querystring.parse(data)
                const { userName, password, redirectUrl } = data
                if (userName === 'Ethan' && password === '123456') {
                    res.setHeader('Set-Cookie', `token=${token}; domain=ke.com; httpOnly=true; Expires= + ${getExpireTime()}`)
                    userDataBase[token] = userName
                    if (redirectUrl && redirectUrl !== '/') {
                        res.writeHead(302, { 'Location': `http://${redirectUrl.slice(0, redirectUrl.length - 1)}?token=${token}` })
                        res.end('redirecting...')
                        return
                    }
                    res.end('登录成功')
                } else {
                    res.end('登录失败')
                }
            })
            break
        case '/verify-token':
            const param = getParam(url)
            if (param.token === token) {
                res.writeHead(200)
                let obj = {
                    code: 200,
                    message: 'login in successful',
                    userName: userDataBase[token]
                }
                res.end(JSON.stringify(obj))
            }
            break;
    }
}).listen(3000, function () {
    console.log('login service is listening on 3000')
})