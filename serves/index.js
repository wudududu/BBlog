const koa = require('koa')
const router = require('koa-router')()
const crypto = require('crypto')
var bodyParser = require('koa-bodyparser')

const user = require('./connectDB.js').user

const app = new koa()

app.use(bodyParser())

router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>Hello World</h1>`
})
router.post('/register', async (ctx, next) => {
  let password = crypto.createHash('md5').update(ctx.request.body.password).digest('hex')
  await user.create({
    id: ctx.request.body.nickname,
    nickname: ctx.request.body.nickname,
    password
  }).then(() => ctx.response.body = '注册成功')
  .catch(err => console.log(err))
})

// 添加路由中间件
app.use(router.routes())

app.listen(8080, function () {console.log('监听8080中')})