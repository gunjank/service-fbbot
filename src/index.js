'use strict'
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

const bunyan = require('bunyan')



let app = express()

global.log = bunyan.createLogger({
    name: 'node-fbbot'
});
const bot = require('./lib/bot')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    //console.log("get call happen with req " + req);
    return bot._verify(req, res)
})

app.post('/', (req, res) => {
    //console.log("post call happen with req.body " + req.body);
    bot._handleMessage(req.body)
    res.end(JSON.stringify({
        status: 'ok'
    }))
})

http.createServer(app).listen(process.env.PORT || 3000)