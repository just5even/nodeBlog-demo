const crypto = require('crypto')

//加密对象，返回加密成功的数据
module.exports = function(password,key='chen jun yu '){
    const hamc = crypto.createHmac('sha256',key)
    hamc.update(password)
    const passwordHamc = hamc.digest('hex')
    return passwordHamc
}