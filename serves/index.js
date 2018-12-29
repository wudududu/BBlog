const koa = require('koa')
const router = require('koa-router')()
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
// var bodyParser = require('koa-bodyparser')
let body = require('koa-body')

const dealMD = require('./dealMD').dealMD // 处理md文件
const user = require('./connectDB.js').user


const app = new koa()

// app.use(bodyParser({
//   enableTypes: ['json', 'form', 'form-data']
// }))
app.use(body({
  multipart: true,
  formidable: {
      maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}))

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
  await user.find({'nickname': ctx.request.body.nickname, 'password': password}, function (err, data) {
    if (err) throw err
    if (!data.toString()) {
      ctx.response.body = '用户名或密码错误'
    } else {
      ctx.response.body = '登录成功'
    }
  })
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
  
})
// 添加路由中间件
app.use(router.routes())

app.listen(8080, function () {console.log('监听8080中')})