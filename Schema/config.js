// 连接数据库，导出db schema
const mongoose = require('mongoose')
const db = mongoose.createConnection(
    'mongodb://localhost:27017/blogproject',{
        useNewUrlParser:true
    }
)



// 用原生es6的promise代替mongoose的promise
mongoose.Promise = global.Promise

db.on('error',()=>{
    console.log('连接数据库失败！')
})

db.on('open',()=>{
    console.log('数据库连接成功!')
})

//把mongoose的 schema取出来
const Schema = mongoose.Schema

module.exports = {
    db,
    Schema
}