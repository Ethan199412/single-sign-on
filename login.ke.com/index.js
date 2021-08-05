const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const { getExpireTime, doesTokenExist, getRedirectUrl } = require('../utils.js')
let redirectUrl

http.createServer((req, res) => {
    let { url, method } = req
    //const redirectUrl = getRedirectUrl(url)
    //console.log('redirectUrl',redirectUrl)
    pureUrl = url.split('?')[0]

    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    //console.log('cookie', req.headers.cookie.split(';'))
    switch (pureUrl) {
        case '/login':
            switch (method) {
                case 'GET':
                    redirectUrl = getRedirectUrl(url)
                    let isLogin = doesTokenExist(req.headers.cookie)
                    if (isLogin) {
                        res.end('您已登录')
                        return
                    }
                    //console.log('[p2] isLogin', isLogin)
                    const filePath = './view/login.html'
                    //console.log('method', method)
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            res.end(err)
                            return
                        }
                        res.end(data.toString())
                    })
                    break
            }
            break
        case '/handleLogin':
            let data = ''
            req.on('data', function (chunk) {
                data += chunk
            })
            req.on('end', function () {
                data = querystring.parse(data)
                console.log('data', data, typeof data, data.userName, data.password)
                if (data.userName === 'Ethan' && data.password === '123456') {
                    let token = 'logInSuccessfulToken'
                    res.setHeader('Set-Cookie', `token=${token}; domain=ke.com; httpOnly=true; Expires= + ${getExpireTime()}`)
                    if (redirectUrl) {
                        console.log('[p2] redirectUrl', redirectUrl)
                        res.writeHead(302, { 'Location': `http://${redirectUrl}` })
                        res.end('redirecting...')
                        return
                    }
                    res.end('登录成功')
                } else {
                    res.end('登录失败')
                }
            })
            break
    }
}).listen(3000, function () {
    console.log('login service is listening on 3000')
})