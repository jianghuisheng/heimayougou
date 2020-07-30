import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    // 左侧的内容
    leftMenuList: [],
    // 右侧的内容
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条
    scrollTop: 0
  },

  // 接口的返回数据
  Cates: [],

  onLoad: function (options) {
    // this.getCates();

    /* 
    1.先判断本地有没有旧数据 {tiem:Data.now(),data:[...]}
    2.没有发送请求
    3.有看有没有过期
    */
    const Cates = wx.getStorageSync("cates");

    if (!Cates) {
      this.getCates();
    } else {
      // 定义过期时间 10s
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        console.log('旧数据可以使用')
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类的数据
  // getCates() {
  //   request({
  //     url: '/categories'
  //   })
  //     .then(res => {
  //       this.Cates = res.data.message;

  //       /* 
  //       本地存储
  //       web 存的时候需要toString()
  //       小程序 存什么类型数据，获取就是什么类型
  //       */
  //       wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })

  //       let leftMenuList = this.Cates.map(v => v.cat_name);
  //       let rightContent = this.Cates[0].children;
  //       this.setData({
  //         leftMenuList,
  //         rightContent
  //       })
  //     })
  // },

  async getCates() {
    // 1.使用es7的async await发送请求 后边代码顺序执行
    const res = await request({ url: "/categories" });

    this.Cates = res;
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  handleItemTap(e) {
    console.log(e);

    /* 
      1.获取被点击的标题身上的索引
      2.给data中的currentIndex赋值
    */
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})