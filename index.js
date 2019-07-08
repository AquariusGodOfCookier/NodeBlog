
const express = require('express') 

const app = express()    


const bodyParser = require('body-parser')   

const urlencodedParser = bodyParser.urlencoded({ extended: false }) 


const cookieParser = require('cookie-parser')         


const MongoControl = require('./tools/databasecontrol').MongoControl

const page = new MongoControl('blog', 'page')

const comment = new MongoControl('blog', 'comment') 


const ejs = require('ejs')


const moment = require('moment')


app.use(cookieParser())



app.use(express.static('./static', {
    index: false
}))


app.use('/admin',express.static('./static',{index:false}))

app.use('/admin',require('./admin'))



app.get('/', function (req, res) {
   
    page.find({}, function (err, data) {
       
        ejs.renderFile('./ejs-tpl/index.ejs', { data: data }, function (error, html) {
            res.send(html)
        })
    })
})

app.get('/p', function (req, res) {
   
    var _id = req.query._id
    
    page.findById(_id, function (err, result) {
        // 如果没有这篇文章，则报404
        if (result.length == 0) {
            res.status(404).send('你来到我的秘密花♂园')
            return
        }

        

        var data = result[0] 
        comment.find({ fid: _id ,state : 1}, function (err, result) {
            
            ejs.renderFile('./ejs-tpl/page.ejs', { data: data,comment : result }, function (err, html) {
                res.send(html)
            })
        })
    })
})

app.post('/submitComment',urlencodedParser,function(req,res){

    
    var _id = req.query._id
    
    var {email , content} = req.body

    
    if(!_id){
        res.send('不允许评论')
        return 
    }
    if(!email || !content){
        res.send('不允许评论')
        return 
    }
   
    comment.insert({
        fid : _id,
        author : email,
        content : content,
        date : moment().format('YYYY-MM-DD HH-mm-ss'),
        state : 0
    },(err,result)=>{
        if(err){
          
            res.status(500).send('你发了什么评论把我的服务器干崩了？')
            return
        }
       
        res.redirect(
            '/p?_id=' + _id
        )
    })
})


app.listen(3000)