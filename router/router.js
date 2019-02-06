const Router = require('koa-router')
const router = new Router;
// 拿到操作user表的逻辑对象
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')
const admin = require('../control/admin')
const upload = require('../util/upload')

// 设计主页
router.get('/',user.keepLogin,article.getList)

// 处理用户登录界面
router.post('/user/login',user.login
    // const date =ctx.request.body
    // 把用户名提出来 --->去数据库插叙
)

// 处理注册界面
router.post('/user/reg',user.reg)

// 退出界面
router.get('/user/layout',user.quit)


// 注册或者登录界面
router.get(/^\/user\/(?=reg|login)/,async ctx=>{
    // console.log(ctx.params.id) 
    //show为true则显示注册
    const show = /reg$/.test(ctx.path)
    await ctx.render('register.pug',{show})
})

// 文章发表页面
router.get('/article',user.keepLogin,article.addPage)

//文章添加
router.post('/article',user.keepLogin,article.add)

// 对用户的登录：
    // 登录  RESTful /user/login
    // 注册  /user/reg
    // 退出  /user/logout


//文章分页路由
router.get('/page/:id',user.keepLogin,article.getList)

//文章详情页
router.get('/article/:id',user.keepLogin,article.details)

//发表评论
router.post('/comment',user.keepLogin,comment.save)

//后台首页
router.get('/admin/:id',user.keepLogin,admin.index)

//头像上传
router.post('/upload',user.keepLogin,upload.single('file'),user.upload)

//获取所有评论
router.get('/user/comments',user.keepLogin,comment.getComment)

// 删除用户评论
router.del('/comment/:id',comment.del)

//获取所有文章
router.get('/user/articles',user.keepLogin,article.getArticle)

// 删除文章以及用户评论
router.del('/article/:id',article.del)

// 获取所有用户
router.get('/user/users',user.keepLogin,user.getUsers)

// 删除用户
router.del('/user/:id',user.del)

// 404页面 
router.get('*',async ctx=>{
    await ctx.render('404.pug',{
        title:404,
        session:ctx.session
    })
})

module.exports = router