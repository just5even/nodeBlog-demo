const Article = require('../Module/article')
const User = require('../Module/user')
const Comment = require('../Module/comment')


// 拿到user的实例对象




exports.addPage = async ctx=>{
    await ctx.render('add-article.pug',{
        title:'发表文章',
        session:ctx.session
    })
}

exports.add = async ctx=>{
    if(ctx.session.isNew){
        //如果为true,则是没有登录
        return ctx.body= {
            msg:'用户未登录',
            status:0
        }
    } 
    //用户登录情况

    const data = ctx.request.body  //用户通过post传过来的数据

    data.author = ctx.session.uid
    data.commentNum = 0
    // console.log(data)


    await new Promise((res,rej)=>{
        new Article(data)
        .save((err,data)=>{
            if(err){
                return rej(err)
            }
            // 更新文章计数
            User
                .updateOne({_id:data.author},{$inc:{articleNum:1}},err=>{
                    if(err) return console.log(err)
                })

            res(data)
        })
    })
    .then(data=>{
        ctx.body = {
            msg:'发表成功',
            status:1
        }
     })
     .catch(err=>{
         ctx.body={
             msg:'发表失败',
             status:0
         }
     })
    
}

exports.getList = async ctx=>{

    //查询每篇文章对应作者的头像

    // id ctx.params.id
    let  page = ctx.params.id || 1
    page--

    const maxNum = await Article.estimatedDocumentCount((err,num)=>{
        if(err)return console.log(err)
        return num
    })

    const artList =await Article
        .find()
        .sort('-created')
        .skip(5*page)
        .limit(5)
        //拿到了5条数据
        .populate({
            path:'author',
            select:'username _id avatar'
        })
        .then(data =>data)
        .catch(err=>{
            console.log(err)
        })

    await ctx.render('index.pug',{
        title:"实战博客首页",
        session:ctx.session,
        artList,
        maxNum
    })
}

exports.details = async ctx=>{
    const _id = ctx.params.id
    const article = await Article
            .findById(_id)
            .populate('author','username')
            .then(data=>data)

    const comment = await Comment
            .find({article:_id})
            .sort('-created')
            .populate('from','username avatar')
            .then(data=>data)
            .catch(err=>console.log(err))
    
    await ctx.render('article.pug',{
        title:article.title,
        session:ctx.session,
        article,
        comment
    })
}

exports.getArticle = async ctx=>{
    const uid = ctx.session.uid
    const data =await Article
            .find({author:uid})

    ctx.body = {
        code:0,
        count:data.length,
        data
    }

}


exports.del = async ctx=>{
        const articleId = ctx.params.id
        let res={
            state:1,
            message:'删除成功'
        }
    
        await Article
            .findById(articleId)
            .then(data=>data.remove())
            .catch(err=>{
                res = {
                    state:0,
                    message:'删除失败'
                }
            })
    
        ctx.body = res 
    }