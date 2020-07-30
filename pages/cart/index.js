// 1.点击收货地址
// handleChooseAddres
// 2.获取收货地址 wx.chooseAddress
// 获取用户权限
/**
 * 1 假设用户点击获取收获地址的确定 权限状态scope = true
 * 2 取消scope为false
 * 3 没调用过是undefined
 * 
 * 4 获取的地址存到缓存中
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart') || [];
    // every 数组方法 会遍历 接收一个回调函数 每个回调函数都返回true 那么，every方法的返回值为true
    // 只要有一个回调函数返回了false，那么不再循环执行，直接返回false
    // 空数组调用every就是true
    // const allChecked = cart.every(v=>v.checked);
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    this.setData({
      address
    })
    this.setCart(cart);
  },

  /* handleChooseAddress() {
    wx.getSetting({
      success: (result) => {
        // console.log(result)
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          wx.chooseAddress({
            success: (result1) => {
              console.log(result1)
            }
          })
        } else {
          wx.openSetting({
            success: (result2) => {
              wx.chooseAddress({
                success: (result3) => {
                  console.log(result3)
                }
              })
            }
          })
        }
      },
    })
  }, */
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },

  // 商品的选中
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // true不为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart);
  },

  // 商品的全选
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // return;
    const { operation, id } = e.currentTarget.dataset;
    // console.log(operation,id)
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: '您是否要删除？' })
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  // 点击 结算
  async handlePay() {
    // 1.判断有没有收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 2.判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有勾选商品" });
      return;
    }
    // 3.跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})