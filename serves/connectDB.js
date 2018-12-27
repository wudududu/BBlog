let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/BBlog')
let db = mongoose.connection

// 通过句柄监听事件
db.on('open', function(err) {
  if (err) {
    console.log('数据库连接失败');
    throw err
  }
  console.log('数据库连接成功')
})

const Schema = mongoose.Schema
// 定义用户表数据结构
const userModel = new Schema({
  id: String,
  nickname: String,
  password: String
})
// 定义文章数据结构
const articleModel = new Schema({
  id: String,
  title: String,
  time: String, 
  skeleton: String, // 纲要
  content: String, // 内容
  comment: Array, // 评论
})
// 将表的数据结构和表关联起来
exports.user = mongoose.model('users', userModel, 'users')
exports.article = mongoose.model('articles', articleModel, 'articles')