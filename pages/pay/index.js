
import { request } from '../../request/index.js';
import { requestPayment } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];

    // 过滤未被选中的数据
    cart = cart.filter(v => v.checked);

    this.setData({ address })
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum
    });
  },

  // 点击 支付
  async handleOrderPay() {
    try {
      // 1. 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 2. 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      /* 后边需要企业账号了 */
      // 3. 获得授权后就能拿到token
      console.log('%c' + '已经存在token', 'color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)')
      // 创建订单
      const header = { Authorization: token };
      // 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      // 4. 准备发送请求 创建订单 获取订单编号
      const orderParams = { order_price, consignee_addr, goods };
      const { order_number } = await request({ url: "/my/orders/create", method: 'POST', data: orderParams })
      // 5. 发起 预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", data: { order_number }, method: 'post' })
      // 6. 发起 微信支付
      await requestPayment(pay);
      // 7. 查询后台 订单支付状态
      const res = await request({ url: "/my/orders/chkOrder", data: { order_number }, method: 'post' });
      await showToast({title:"支付成功"})
      // 8. 支付成功了 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v=>!v.checked);
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (error) {
      await showToast({title:"支付失败"})
      console.log(error);
    }
  }
})


