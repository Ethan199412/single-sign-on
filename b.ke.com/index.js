const http = require('http')
const fs = require('fs')
const { doesTokenExist } = require('../utils.js')

http.createServer((req, res) => {
    const { url, method } = req

    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    const pureUrl = url.split('?')[0]
    switch (pureUrl) {
        case '/':
            if (doesTokenExist(req.headers.cookie)) {
                const filePath = './view/a.html'
                fs.readFile(filePath, function (err, data) {
                    if (err) {
                        res.end(err)
                    } else {
                        res.end(data.toString())
                    }
                })
            } else {
                console.log('origin', req.headers.host)
                res.writeHead(302, { 'Location': 'http://login.ke.com:3000/login?redirectUrl=' + req.headers.host }) // 重定向
                res.end('<div>未登录</div>')
            }

    }
}).listen(3002, function () {
    console.log('b.ke.com running on 3002')
})