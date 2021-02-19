import { getMultidata, getGoodsData } from '../../service/home'

const type = ['pop', 'new', 'sell']
const TOP_DISTANCE = 1000
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommends: [],
    titles: ['流行', '新款', '精选'],
    goods: {
      pop: { page: 0, list: [] },
      new: { page: 0, list: [] },
      sell: { page: 0, list: [] }
    },
    currentType: "pop",
    showBackTop: false,
    isTabFixed: false,
    tabScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.请求轮播图和推荐的数据
    this._getMultidata()
    // 2. 请求tabcontrol中的商品数据
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')
  },
  //---------------------数据请求---------------------------------
  _getMultidata() {
    getMultidata().then(res => {
      console.log(res)
      const banners = res.data.data.banner.list
      const recommends = res.data.data.recommend.list

      this.setData({
        banners: banners,
        recommends: recommends,
      })
    })
  },
  _getGoodsData(type) {
    // 1. 获取页面代码
    const page = this.data.goods[type].page + 1

    // 2.请求商品数据
    getGoodsData(type, page).then(res => {
      // console.log(res)
      // 2.1 取出数据
      const list = res.data.data.list

      // 2.2 将数据设置到对应的type的list中
      // this.data.goods[type].list.push(...list)
      const oldList = this.data.goods[type].list
      oldList.push(...list)

      // 2.3 将数据设置到data中的goods中
      const typeKey = `goods.${type}.list`
      const pageKey = `goods.${type}.page`
      this.setData({
        [typeKey]: oldList,
        [pageKey]: page
      })
    })
  },

  //---------------------事件方法---------------------------------
  handleTabClick(event) {
    // 1. 取出index
    const index = event.detail.index
    // console.log(index)

    // 2. 设置currentType
    this.setData({
      currentType: type[index]
    })
  },

  /**
   * 页面滚动触发事件的处理函数
  */
  onPageScroll(options) {
    // 1. 取出scrollTop
    const scrollTop = options.scrollTop

    // 2. 修改showBackTop 属性
    const flag = scrollTop >= TOP_DISTANCE
    if (flag != this.data.showBackTop) {
      this.setData({
        showBackTop: flag
      })
    }

    // 3. 修改 isTabFixed 属性
    const flagTab = scrollTop >= this.data.tabScrollTop
    if (flagTab != this.data.isTabFixed) {
      this.setData({
        isTabFixed: flagTab
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("滚动到底部")
    // 上拉加载更多
    this._getGoodsData(this.data.currentType)
  },

  // 图片加载完成处理方法
  handleImageLoad() {
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      console.log(rect);
      this.data.tabScrollTop = rect.top
    }).exec()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})