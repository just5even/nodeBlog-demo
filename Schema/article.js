const { Schema} = require('../Schema/config')
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
    author:{
        type:ObjectId,
        ref:'users'
    },  //关联 users的表
    title:String,
    content:String,
    tips:String,
    commentNum:Number
},{
    versionKey:false,
    timestamps:{
        createdAt:'created'
    }
})

//设置article的remove钩子

ArticleSchema.post('remove',doc=>{
    const Comment = require('../Module/comment')
    const User = require('../Module/user')

    const {_id:artId,author:authorId} = doc

    

    // 文章对应作者的评论 -1
    Comment
        .find({article:artId})
        .then(data=>{
            console.log(data)
            data.forEach(v=>v.remove())
        })
        .catch(err=>{
            console.log(err)
        })

    //用户的文章数 -1
    User.updateOne({_id:authorId},{$inc:{articleNum:-1}}).exec()
})

module.exports = ArticleSchema