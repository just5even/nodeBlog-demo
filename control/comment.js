const Article = require('../Module/article')
const User = require('../Module/user')
const Comment = require('../Module/comment')


// 保存评论
exports.save = async ctx=>{
    let massage = {
        status:0,
        msg:'发表失败1'
    }
    if(ctx.session.isNew)return ctx.body = massage
    const data = ctx.request.body
    data.from = ctx.session.uid

    await new Promise((res,rej)=>{
        new Comment(data)
        .save((err,data)=>{
            if(err) return rej(massage)
            //保存当前文章的评论计数器
            Article
                .updateOne({_id:data.article},{$inc:{
                    commentNum:1}},err=>{
                        if(err) return console.log(err)
                        console.log('评论更新成功')
                    })

            //用户的评论计数器
            User
                .updateOne({_id:data.from},{$inc:{commentNum:1}},err=>{
                    if(err) return console.log(err)
                        console.log('用户评论更新成功')
                })
            massage={
                status:1,
                msg:'发表成功'
            }
            res(massage)
        })
    })
    .then(data=>{
        ctx.body=data     
    })
    .catch(err=>{
        ctx.body = err
    })
    
}


//查询用户所有评论
exports.getComment = async ctx=>{
    const uid = ctx.session.uid
    const data = await Comment
        .find({from:uid})
        .populate('article','title')

    ctx.body = {
        code:0,
        count:data.length,
        data
    }
}

//评论删除
exports.del = async ctx=>{
    console.log(ctx.params)
    const commentId = ctx.params.id
    let res={
        state:1,
        message:'删除成功'
    }

    await Comment
        .findById(commentId)
        .then(data=>data.remove())
        .catch(err=>{
            res = {
                state:0,
                message:'删除失败'
            }
        })

    ctx.body = res 
}