import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
/**
 * total 总条数
 * page = Math.ceil(total/pagesize) 向上取整
 * pagenum 当前页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  // 接口的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },



  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams });
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages)

    // 数组拼接，而不是整个替换新的10条数据
    this.setData({
      // goodsList: res.goods
      goodsList:[...this.data.goodsList,...res.goods]
    })

    wx.stopPullDownRefresh();
  },

  // 标题点击事件
  handleTabsItemChange(e) {
    // console.log(e);
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },


  // 页面上滑 滚动条触底事件
  onReachBottom() {
    console.log('页面触底')
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      console.log('没有下一页数据')
      wx.showToast({
        title: '没有下一页数据了',
      })
    }else{
      console.log('有下一页数据');
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  // 下拉刷新事件
  onPullDownRefresh(){
    console.log('刷新中');
    // 1.重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1;
    // 发送请求
    this.getGoodsList();
  }


})