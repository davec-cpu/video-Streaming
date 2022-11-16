var express = require('express')
var fs = require('fs')
var app = express()

app.get('/video', (req, res)=>{
    const range = req.headers.range //vi tri trong video
    //cho cilent bient gui ve doan video nao
    const videoPath = 'video/samplevid.mp4'
    const videoSize = fs.statSync(videoPath).size

    const chunkSize = 1 * 1e+6
    const start = Number(range.replace(/\D/g, '')) // /_/g la global match, \D la 
    const end = Math.min(start + chunkSize, videoSize - 1)
    console.log('range: ', range)
    const contentLength = end - start + 1

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }

    console.log('headers: ', headers)
//206 chi dinh minh chi gui di mot phan cua video
    res.writeHead(206, headers)
    
    const stream = fs.createReadStream(videoPath, {start, end})
    stream.pipe(res)
})

app.get('/home', (req, res)=>{
    res.sendFile(__dirname+"/index.html")
})

 

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server is running ')
})