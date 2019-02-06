const Article = require('../Module/article')
const User = require('../Module/user')
const Comment = require('../Module/comment')
const encrypt =require('../util/crypto')


// 用户注册路由
exports.reg = async (ctx)=>{

    //用户注册是post发过来的数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password

    // 查询数据库用户名是否存在
    await new Promise((res,rej)=>{
        User.find({username},(err,data)=>{
            if(err) return rej(err)
            if(data.length!==0){
                //查询到数据，说明用户名已经存在
                return res('')
            }

            //不存在，存到数据库
            const _user =new User({
                username,
                password:encrypt(password),
                articleNum:0,
                commentNum:0
            })
            _user.save((err,data)=>{
                if(err){
                    rej(err)
                }else{
                    res(data)
                }
            })
        })
    }).then(async data=>{
        if(data){
            //注册成功
            await ctx.render('isOk.pug',{
                status:'注册成功'
            })
        }else{
            //用户明已存在
            await ctx.render('isOk.pug',{
                status:'用户名已存在'
            })
        }
    })
    .catch(async err=>{
        await ctx.render('isOk.pug',{
            status:'注册失败，请重试'
        })
    })
}

//用户登录处理
exports.login = async ctx=>{
    const data = ctx.request.body
    username = data.username
    password = encrypt(data.password)

    await new Promise((res,rej)=>{
        User.find({username},(err,data)=>{
            if(err) return rej(err)
            if(data.length === 0) return rej('用户名不存在')
            if(password==data[0].password) return res(data)

            res('')            
        })
    }).then(async data=>{
        if(!data){
            return  ctx.render('isOk.pug',{
                status:'密码错误'
            })
        }

            // 把用户传过来到cookie里设置username，password
            ctx.cookies.set('uid',data[0]._id,{
                domain:'localhost',
                path:'/',
                maxAge:36e5,
                httpOnly:true,//true 为不让客户端访问
                overwrite:false,
                // signed:false
            })

            ctx.cookies.set('username',username,{
                domain:'localhost',
                path:'/',
                maxAge:36e5,
                httpOnly:true,//true 为不让客户端访问
                overwrite:false,
                // signed:false
            })

            ctx.session = {
                username,
                uid:data[0]._id,
                avatar:data[0].avatar,
                role:data[0].role
            }

            await  ctx.render('isOk.pug',{
                status:'登录成功'
            })   
    })
    .catch(async err=>{
        await ctx.render('isOk.pug',{
            status:err
        })
    })
}

// 保持用户的登录状态
exports.keepLogin = async (ctx,next)=>{
    if(ctx.session.isNew){
        if(ctx.cookies.get('username')){
            ctx.session = {
                username:ctx.cookies.get('username'),
                uid:ctx.cookies.get('uid')
            }
        }
    }
    await next()
}

// 用户退出
exports.quit = async ctx=>{
    ctx.session = null
    ctx.cookies.set('username',null,{
        maxAge:0
    })
    ctx.cookies.set('uid',null,{
        maxAge:0
    })
    ctx.redirect('/')
}

// 用户上传头像
exports.upload = async ctx=>{
    const filename = ctx.req.file.filename
    let data = {}
    await User.updateOne({_id:ctx.session.uid},{$set:{
        avatar:'/avatar/'+filename
    }},(err,res)=>{
        if(err){
            data = {
                status:1,
                msg:"上传失败"
            }
        }else{
            data = {
                status:1,
                message:"上传成功"
            }
            ctx.session.avatar = '/avatar/'+filename
        }
    })
    ctx.body=data
    
}


// 获取所有用户
exports.getUsers = async ctx=>{
    const data = await User
        .find()

    ctx.body = {
        code:0,
        count:data.length,
        data
    }
}

// 删除用户
exports.del = async ctx=>{
    const userId = ctx.params.id
    let res = {
        state:1,
        message:'删除成功'
    }

    await User
        .findById(userId)
        .then(data=>{
            data.remove()
            console.log(data)
        })
        .catch(err=>{
            res = {
                state:0,
                message:'删除失败'
            }
        })

        ctx.body = res
}