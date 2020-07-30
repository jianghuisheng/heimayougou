import { request } from '../../request/index.js';
// click+shift折叠缩放
// click+alt选中单词行
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cateList: [],
    // 楼层数组
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },

  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          cateList: result
        })
      })
  },

  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },

  // onload: function (options) {
  //   wx.request({
  //     url: '/home/swiperdata',
  //     data: {},
  //     header: { 'content-type': 'application/json' },
  //     method: 'GET',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: (result) => {
  //       console.log(result);
  //       this.setData({
  //         swiperList: result.data.message
  //       })
  //     },
  //     fail: () => { },
  //     complete: () => { }
  //   });

  //   // 简化默认值
  //   wx.request({
  //     url: 'c',
  //     success: (result) => {
  //       this.setData({
  //         swiperList: result.data.message
  //       })
  //     }
  //   });

  //   // 回调地狱
  //   wx.request({
  //     url: '/home/swiperdata',
  //     data: {},
  //     header: { 'content-type': 'application/json' },
  //     method: 'GET',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: (result) => {
  //       console.log(result);
  //       this.setData({
  //         swiperList: result.data.message
  //       })
  //       wx.request({
  //         url: '',
  //         data: {},
  //         header: { 'content-type': 'application/json' },
  //         method: 'GET',
  //         dataType: 'json',
  //         responseType: 'text',
  //         success: (result) => {
  //           wx.request({
  //             url: '',
  //             data: {},
  //             header: { 'content-type': 'application/json' },
  //             method: 'GET',
  //             dataType: 'json',
  //             responseType: 'text',
  //             success: (result) => {

  //             },
  //             fail: () => { },
  //             complete: () => { }
  //           });

  //         },
  //         fail: () => { },
  //         complete: () => { }
  //       });

  //     },
  //     fail: () => { },
  //     complete: () => { }
  //   });
  // }
})