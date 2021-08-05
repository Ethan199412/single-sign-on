const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
    let { url, method } = req
    // 访问公共资源
    if (/\/public/.test(url) && method === 'GET') {
        // console.log('url', url)
        // url = url.slice(7)
        // console.log('url', url)
        const filePath = '.' + url + '.html'
        fs.readFile(filePath,function(err,data){
            if(err){
                res.end(err)
            }
            res.end(data.toString())
        })
    }
    else {
        switch (url) {
            case '/login':
                console.log('method', method)
                break
        }
    }
}).listen(3000, function () {
    console.log('login service is listening on 3000')
})