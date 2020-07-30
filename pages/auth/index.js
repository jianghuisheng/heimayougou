import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from '../../utils/asyncWx.js';
Page({
  // 获取用户信息

  async handleGetUserInfo(e) {
    try {
      // console.log(e);
      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2 获取小程序登录后的code
      const { code } = await login();
      // 3 发送请求 获取用户的token
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 需要企业账号，或者企业账号给开发者的白名单
      const { token } = await request({ url: '/users/wxlogin', data: loginParams, method: "post" });
      console.log(res);
      // 4 把token存入缓存中 同时跳转回上一个页面(已经拿到)
      wx.setStorageSync("token", token);
      wx.navigateBack({ delta: 1 })
    } catch (error) { console.log(error); }
  }
})