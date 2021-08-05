const http = require('http')
const fs = require('fs')
const { doesTokenExist } = require('../utils.js')

http.createServer((req, res) => {
    const { url, method } = req

    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    switch (url) {
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
}).listen(3001, function () {
    console.log('a.ke.com running on 3001')
})