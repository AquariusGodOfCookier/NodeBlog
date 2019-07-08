var express = require('express')
var app = express()

app.use('/admin',require('./admin'))

app.get('/',function(req,res){
    res.send('index')
})

app.listen(3001)