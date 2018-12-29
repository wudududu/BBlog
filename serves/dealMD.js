const fs = require('fs')
const readline = require('readline')
const article = require('./connectDB.js').article

function dealMD(path) {
  const re = /^(#{1,6})\s(.*)$/
  let fRead = fs.createReadStream(path)
  let objReadLine = readline.createInterface({
    input: fRead
  })
  let arr = []
  objReadLine.on('line', (line) => {
    arr.push(line)
  })
  objReadLine.on('close', () => {
    console.log(arr)
    let skeleton = []
    arr.forEach(i => {
      if (re.exec(i)) skeleton.push(i)
    })
    article.create({
      title: skeleton[0].split('#')[1],
      skeleton,
      content: arr,
      time: new Date(),
      // 标签
    })
  })
}
exports.dealMD = dealMD