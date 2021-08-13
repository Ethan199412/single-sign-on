const http = require('http')
const { doesTokenExist, getCookieObj, getParam, getExpireTime } = require('../utils.js')
const Axios = require('axios')
const ejs = require('ejs')

function verifyTokenAndRender(token, req, res) {
    Axios.get('http://my-login.ke.com:3000/verify-token', {
        params: {
            token
        }
    }).then(response => {
        if (response.data.code === 200) {
            console.log('response data', response.data)
            const filePath = './view/b.ejs'

            console.log('[p1] req.headers', req.headers)
            res.setHeader('Set-Cookie',`token=${token}; Expires=${getExpireTime()}; domain=${req.headers.host.replace(/:\d+/,'')}; httpOnly=true`)
            ejs.renderFile(filePath, { userName: response.data.userName }, null, function (err, string) {
                if (err) {
                    res.end(err)
                } else {
                    res.end(string)
                }
            })
        }
    })
}

http.createServer((req, res) => {
    const { url, method } = req

    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    const pureUrl = url.split('?')[0]
    const param = getParam(url)

    switch (pureUrl) {
        case '/':
            if (param.token) {
                verifyTokenAndRender(param.token, req, res)
                return
            }

            if (doesTokenExist(req.headers.cookie)) {
                let cookieObj = getCookieObj(req.headers.cookie)
                console.log('[p0] cookieObj', cookieObj)
                verifyTokenAndRender(cookieObj.token, req, res)
            } else {
                console.log('[p1] cookieObj', getCookieObj(req.headers.cookie))
                res.writeHead(302, { 'Location': 'http://my-login.ke.com:3000/login?redirectUrl=' + req.headers.host }) // 重定向
                res.end('<div>未登录</div>')
            }
    }
}).listen(3002, function () {
    console.log('b.ke.com running on 3002')
})