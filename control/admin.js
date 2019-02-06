const Article = require('../Module/article')
const User = require('../Module/user')
const Comment = require('../Module/comment')

const fs = require('fs')
const {join} = require('path')

exports.index = async ctx=>{
    if(ctx.session.isNew){
        // 没有登录
        ctx.status = 404
        return await ctx.render('404.pug',{title:'404'}) 
    }

    const id = ctx.params.id
    let flag = false
    const arr = fs.readdirSync(join(__dirname,"../views/admin"))
    
    arr.forEach(v=>{
        const name = v.replace(/^(admin\-)|(\.pug)$/g,'')
        if(name === id){
            flag = true
        }
    })

    if(flag){
        await ctx.render("./admin/admin-" + id+'.pug',{
            title:'后台管理页面',
            session:ctx.session,
            role:ctx.session.role
        })
    }else{
        ctx.status=404
        await ctx.render('404.pug',{title:"404"})
    }
    
}