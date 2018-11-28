var app = getApp();
var api = require('../../utils/tai.js');
Page({
  data: {
    motto: '颜龄检测',
    images: {},
    img: '',
    base64img: ''
  },
  onShareAppMessage: function () {
    return {
      title: '颜龄检测小程序',
      path: '/pages/animal/animal',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 500
          });
        }
      },
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          wx.showToast({
            title: '分享取消',
            icon: 'loading',
            duration: 500
          })
        }
      }
    }
  },
  clear: function (event) {
    console.info(event);
    wx.clearStorage();
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  uploads: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //console.log( res )
        if (res.tempFiles[0].size > 500 * 1024) {
          wx.showToast({
            title: '图片文件过大哦',
            icon: 'none',
            mask: true,
            duration: 1500
          })
        } else {
          that.setData({
            img: res.tempFilePaths[0]
          })
        }
        wx.showLoading({
          title: "颜龄检测中...",
          mask: true
        })
        //根据上传的图片读取图片的base64
        var fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: res.tempFilePaths[0].toString(),
          encoding: 'base64',
          success(res) {
            //获取到图片的base64 进行请求接口
            api.faceageRequest(res.data, {
              success(res) {
                var code = res.ret;
                if (code == 0) {
                  wx.hideLoading();
                  that.setData({
                    img: 'data:image/png;base64,' + res.data.image
                  })
                } else {
                  wx.hideLoading();
                  wx.showModal({
                    title: '错误提示',
                    content: res.msg,
                    showCancel: false
                  })
                }
              }, 
              fail(res) {
                wx.hideLoading();
                wx.showModal({
                  title: '错误提示',
                  content: res.msg,
                  showCancel: false
                })
              }
            })
          }
        })
      },
    })
  },
  onLoad: function () {
  }
});