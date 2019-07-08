var ejs = require('ejs')
var MongoControl = require('./databasecontrol').MongoControl

var page = new MongoControl('test','page')

page.find({},function(err,data){
    ejs.renderFile('./index.ejs',{data : data},function(err,data){
        console.log(err,data)
    })
})