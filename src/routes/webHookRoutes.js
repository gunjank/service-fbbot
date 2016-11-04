'use strict'

const bot = require('../lib/bot');
module.exports = function (app) {

    //-----Web hook calls start
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

    //-----Web hook calls end

}