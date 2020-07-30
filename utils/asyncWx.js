export const getSetting = () => {
    return new Promise((resove, reject) => {
        wx.getSetting({
            success: (result) => {
                resove(result)
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

export const chooseAddress = () => {
    return new Promise((resove, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resove(result)
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

export const openSetting = () => {
    return new Promise((resove, reject) => {
        wx.openSetting({
            success: (result) => {
                resove(result)
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

/**
 *  promise形式 showModal
 * @param {object} param0 
 */
export const showModal = ({ content }) => {
    return new Promise((resove, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resove(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/**
 *  promise形式 showToast
 * @param {object} param0 
 */
export const showToast = ({ title }) => {
    return new Promise((resove, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
                resove(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

// 微信登录
export const login = () => {
    return new Promise((resove, reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resove(result);
            },
            fail: (err) => {
                reject(err);
            }
        });

    })
}

// 微信支付
export const requestPayment = (pay) => {
    return new Promise((resove, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resove(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}
