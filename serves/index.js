const koa = require('koa')
const router = require('koa-router')()
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const cors = require('koa2-cors')
// var bodyParser = require('koa-bodyparser')
let body = require('koa-body')

const dealMD = require('./dealMD').dealMD // 处理md文件
const user = require('./connectDB.js').user
const article = require('./connectDB.js').article


const app = new koa()

// app.use(bodyParser({
//   enableTypes: ['json', 'form', 'form-data']
// }))
app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(body({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}))
app.use(function *(next) {
  yield *next
  if (this.response.status === 404) console.log('404')
})
router.post('/', async (ctx, next) => {
  
})
// 注册
router.post('/register', async (ctx, next) => {
  console.log(ctx.request.body.password)
  let password = crypto.createHash('md5').update(ctx.request.body.password).digest('hex')
  await user.create({
    id: ctx.request.body.nickname,
    nickname: ctx.request.body.nickname,
    password
  }).then(() => ctx.response.body = '注册成功')
  .catch(err => console.log(err))
})
// 登录
router.post('/login', async (ctx, next) => {
  let password = crypto.createHash('md5').update(ctx.request.body.password).digest('hex')
  let data = await user.find({'nickname': ctx.request.body.nickname, 'password': password}, function (err, data) {
    if (err) ctx.response.body = err
  })
  if (!data.toString()) {
    ctx.response.body = '用户名或密码错误'
  } else {
    ctx.response.body = '登录成功'
  }
})
// 发布文章
router.post('/pushArticle', async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file // 获取上传文件

  const re = /^(#{1,6})\s(.*)$/
  dealMD(file.path)
  return ctx.body = "上传成功！"
})
// 请求文章列表
router.get('/getArticleList', async (ctx, next) => {
  console.log(ctx.request.query)
  let data = await article.find({}, 'skeleton title time', { skip: (ctx.request.query.page - 1) * ctx.request.query.limit, maxscan: +ctx.request.query.limit }, function (err, data) {
    if (err) ctx.response.body = err
  })
  ctx.response.body = data
})
// 请求文章detail
router.get('/getArticle/:id', async (ctx, next) => {
  console.log(ctx.params.id)
  let data = await article.find({_id: ctx.params.id}, function (err, data) {
    if (err) ctx.response.body = err
  })
  ctx.response.status = 200
  ctx.response.body = data[0]
})
// 添加路由中间件
app.use(router.routes())

app.listen(8080, function () {console.log('监听8080中')})