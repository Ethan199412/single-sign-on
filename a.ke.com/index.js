const http = require('http')
const fs = require('fs')
const { doesTokenExist, getCookieObj } = require('../utils.js')
const Axios = require('axios')
const ejs = require('ejs')

http.createServer((req, res) => {
    const { url, method } = req

    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    const pureUrl = url.split('?')[0]
    switch (pureUrl) {
        case '/':
            if (doesTokenExist(req.headers.cookie)) {
                let cookieObj = getCookieObj(req.headers.cookie)
                Axios.get('http://my-login.ke.com:3000/verify-token', {
                    params: {
                        token: cookieObj.token
                    }
                }).then(response => {
                    if (response.data.code === 200) {
                        console.log('response data', response.data)
                        const filePath = './view/a.ejs'
                        // fs.readFile(filePath, function (err, data) {
                        //     if (err) {
                        //         res.end(err)
                        //     } else {
                        //         res.end(data.toString())
                        //     }
                        // })
                        ejs.renderFile(filePath, { userName: response.data.userName }, null, function (err, string) {
                            if (err) {
                                res.end(err)
                            } else {
                                res.end(string)
                            }
                        })
                    }
                })
            } else {
                res.writeHead(302, { 'Location': 'http://my-login.ke.com:3000/login?redirectUrl=' + req.headers.host }) // 重定向
                res.end('<div>未登录</div>')
            }
    }
}).listen(3001, function () {
    console.log('a.ke.com running on 3001')
})