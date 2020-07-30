
import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

/**
 * 1 发送请求获取数据
 * 2 点击轮播图 预览大图
 *   1 给轮播图绑定点击事件
 *   2 调用小程序的api previewImage
 * 3 点击 加入购物车
 *   1 先绑定点击事件
 *   2 获取缓存中的购物车数据 数组格式
 *   3 先判断 当前的商品是否已经存在于 购物车
 *   4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
 *   5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上购买数量属性 num 重新把购物车数组 填充回缓存种
 *   6 弹出提示
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },

  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });

    this.GoodsInfo = goodsObj;

    this.setData({
      // goodsObj

      // 优化数据结构(只用需要的)
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // 小程序部分苹果不识别webp格式 1.找后台解决 2.暂时前台正则替换
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },

  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 1.构造要预览的图片地址
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2.几首传递过来的图片url
    const curret = e.currentTarget.dataset.url;
    wx.previewImage({
      current: curret,
      urls: urls,
    });
  },

  // 点击加入购物车
  handleCartAdd() {
    // console.log('%c'+'购物车','color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)')
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // image:'',
      // duration: 1500,
      mask: true
    })
  }

})