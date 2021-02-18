import axios from 'axios'
import { Notification, Message, MessageBox } from 'element-ui'
import store from '../store'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  config.headers['X-Token'] = 'token' // 让每个请求携带自定义token 请根据实际情况自行修改
  config.headers['Authorization'] = 'Bearer ' + 'token'

  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof (value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Message({
    showClose: true,
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {

    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const msg = response.message || response.msg;
    if (code === 401) {
      Message({
        message: msg,
        type: 'error'
      })
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
