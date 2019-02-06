const { Schema} = require('../Schema/config')
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
    from:{
        type:ObjectId,
        ref:'users'
    },  //关联 users的表
    article:{
        type:ObjectId,
        ref:'articles'
    },
    // avatar:String,
    content:String
},{
    versionKey:false,
    timestamps:{
        createdAt:'created'
    }
})

// 设置 comment 的remove 钩子
CommentSchema.post('remove',(doc)=>{
    const Article = require('../Module/article')
    const User = require('../Module/user')
    const {from,article} = doc

    // 对应文章的评论数 -1
    Article.updateOne({_id:article},{$inc:{commentNum:-1}}).exec()
    // 文章对应作者的评论数 -1
    User.updateOne({_id:from},{$inc:{commentNum:-1}}).exec()

})
 

module.exports =CommentSchema