const crypto = require('crypto')
/**
 * nickname,password
 */
function register(ctx, next) {
  console.log(ctx)
  let password = crypto.createHash('md5').update(ctx.request.body.password).digest('hex')
  user.create({
    id: ctx.request.body.nickname,
    nickname: ctx.request.body.nickname,
    password
  }, (err) => {
    if (err) console.log(err)
    console.log('注册成功')
  })
}

exports.register = register