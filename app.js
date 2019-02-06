const Koa = require('koa')
const router = require('./router/router')
const views = require('koa-views')
const body = require('koa-body')
const { join } = require('path')
const static = require('koa-static')
const logger = require('koa-logger')
const session = require('koa-session')
const compress = require('koa-compress')

//生成koa实例
const app = new Koa;

//注册日志模块
// app.use(logger())

//注册资源压缩模块
app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

//配置session
app.keys = ['chenjunyu']
const CONFIG = {
    key:'Sid',
    maxAge:36e5,
    overwrite:true,
    httpOnly:true,
    signed:true,
    rolling:true
}
app.use(session(CONFIG,app))


//配置koa-body
app.use(body())

//配置静态资源目录
app.use(static(join(__dirname,'public')))

//配置视图模板
app.use(views(join(__dirname,'views')),{
    extension:'pug'
})



// 注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000,()=>{
        console.log('项目启动成功')
    })

{
    const {db} = require('./Schema/config')
    const UserSchema = require('./Schema/user')
    const encrypt = require('./util/crypto')

    //通过db对象创建操作user数据库的模型对象
    const User = db.model('users',UserSchema)

    User    
        .find({username:'admin'})
        .then(data=>{
            if(data.length ===0){
                //说明没有登录  创建一个管理员
                new User({
                    username:'admin',
                    password:encrypt('admin'),
                    role:666,
                    articleNum:0,
                    commentNum:0
                }).save()
                    .then(data=>{
                        console.log('管理员用户名 ---> admin  密码---> admin')
                    })
                    .catch(err=>console.log('管理员检查失败'))
            }else{
                console.log('管理员用户名 ---> admin  密码---> admin')                
            }
        })
}