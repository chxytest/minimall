// const baseUrl = 'http://123.207.32.32:8000'
const baseUrl = 'http://152.136.185.210:8000/api/w6'

export default function(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + options.url,
      method: options.method || 'get',
      data: options.data || {},
      success: resolve,
      fail: reject
    })
  })
}