const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const { getExpireTime, doesTokenExist } = require('../utils.js')

http.createServer((req, res) => {
    let { url, method } = req
    url = url.split('?')[0]
    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    //console.log('cookie', req.headers.cookie.split(';'))
    switch (url) {
        case '/login':
            switch (method) {
                case 'GET':
                    let isLogin = doesTokenExist(req.headers.cookie)
                    if (isLogin) {
                        res.end('您已登录')
                        return
                    }
                    console.log('[p2] isLogin', isLogin)
                    const filePath = './view/login.html'
                    console.log('method', method)
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
                    res.setHeader('Set-Cookie', 'token=logInSuccessfulToken; domain=ke.com; httpOnly=true; Expires=' + getExpireTime())
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