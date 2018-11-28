/**
 * 封装腾讯AI 鉴权示例代码
 * 只提供了一个颜龄检测接口的封装。可以根据自己的需求封装即可
 */
let md5 = require('md5.js')
let app_id = '2110164554'//自己的appid
let app_key = 'YFMBxwP9XhZuhItc';//自己的appkey
let faceageUrl = 'https://api.ai.qq.com/fcgi-bin/ptu/ptu_faceage';
//颜龄检测接口
let faceageRequest = (base64Img, callback) => {
  console.log('app_id: ' + app_id)
  //拼接鉴权必须的参数
  let params = {
    app_id: app_id,
    image: base64Img,
    nonce_str: Math.random().toString(36).substr(2),
    time_stamp: parseInt(new Date().getTime() / 1000).toString()
  }
  params['sign'] = _genRequestSign(params)
  //发送接口请求
  wx.request({
    url: faceageUrl,
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      callback.success(res.data)
    },
    fail: function (res) {
      if (callback.fail)
        callback.fail()
    }
  })
}
//对参数进行排序MD5计算
let _genRequestSign = (params) => {
  // 1. 对请求参数按字典升序排序
  params = _sortObject(params)
  // 2. 拼接键值对，value部分进行URL编码
  let paramStr = ''
  let keys = Object.keys(params)
  for (let idx in keys) {
    let key = keys[idx]
    paramStr += key + '=' + encodeURIComponent(params[key]) + '&'
  }
  // 3. 拼接key
  paramStr += 'app_key=' + app_key
  // 4. md5
  return md5.hexMD5(paramStr).toUpperCase()
}
//对KEY进行排序
let _sortObject = (obj) => {
  var keys = Object.keys(obj).sort()
  var newObj = {}
  for (var i = 0; i < keys.length; i++) {
    newObj[keys[i]] = obj[keys[i]]
  }
  return newObj
}
//暴露出去的接口
module.exports = {
  faceageRequest: faceageRequest
}