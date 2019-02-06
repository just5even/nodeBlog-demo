const {Schema} = require('./config')
const UserSchema = new Schema({
    username:String,
    password:String,
    role:{
        type:Number,
        default:1
    },
    avatar:{
        type:String,
        default:'/avatar/default.jpg'
    },
    articleNum:{
        type:Number,
        default:0
    },
    commentNum:{
        type:Number,
        default:0
    }
},{
    versionKey:false
})

UserSchema.post('remove',doc=>{
    const userId = doc._id
    const Article = require('../Module/article')
    const Comment = require('../Module/comment')

    

    // 对应用户的文章删除 --引用钩子
    Article
        .find({author:userId})
        .then(data=>{
            data.forEach(v=>{
                v.remove()
            })
        })
        .catch(err=>{
            console.log(err)
        })

    Comment
        .find({from:userId})
        .then(data=>{
            console.log(data)
            data.forEach(v=>v.remove())
        })
        .catch(err=>{
            console.log(err)
        })
})

module.exports = UserSchema