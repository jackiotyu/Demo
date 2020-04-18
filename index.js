var MongoClient = require('mongodb').MongoClient
// var pass = process.env.PASS
var dataUrl = `mongodb+srv://jack:huang1540..@database-lnq44.azure.mongodb.net/test?retryWrites=true&w=majority`
var conn = function (url) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) reject(err)
        else resolve(db)
      }
    )
  })
}

var toArray = function (data) {
  return new Promise((resolve, reject) => {
    data.toArray((err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}

// HTTP function
exports.handler = async function http(req) {
  // queryStringParameters
  // body
  // path
  // headers
  // // // // console.log(req)
  // let body = JSON.stringify(req)
  // let params = body.queryStringParameters
  //获取对应查询参数
  let params = req.queryStringParameters
  // let hero = {"hero": req.queryStringParameters.hero}
  // // // // console.log(params)
  try {
    //连接数据库
    var con = await conn(dataUrl)
    var db = con.db('ForHonorHero')
    var col = db.collection('HeroDataCNversion')
    // var CNCol = db.collection('chineseName')
    if (params !== null) {

      // 在数据库中查询对应对象参数
      var res = await toArray(col.find(params, { projection: { _id: 0 } }))
      return {
        headers: {
          'content-type': 'application/json; charset=utf8',
          'cache-control':
            'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        },
        statusCode: 200,
        // body: JSON.stringify(res)
        body: JSON.stringify(res),
      }
    } else {
      var res = { response: '请输入查询数据' }
      return { statusCode: 500, body: JSON.stringify(res) }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
