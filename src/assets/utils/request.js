import axios from 'axios';
import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { apiPrefix } from './config';
import { message } from 'antd';

axios.defaults.baseURL = `http://localhost:8000${apiPrefix}`;
axios.defaults.withCredentials = true;

/*
 * 主要功能：web应用程序发送请求
 *
 * @param url  请求后台的地址
 * @param method  请求方式 'get'、'post'、'delete'、'push'
 * @param data 请求后台需要携带的参数
 * @param fetchType  请求类型，判断是否跨域请求 'CORS'、'YQL'、'JSONP'
 * */
const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options;
  /* lodash 是一款 js 工具库，作用是进行深度克隆，最多克隆四层*/
  const cloneData = lodash.cloneDeep(data);

  /* 解析 url，将 'http://localhost:3000/user/:id' 变成 'http://localhost:3000/user/10001'*/
  try {
    let domain = '';
    /* 获取 url 后面的具体请求，如：url=http://locahost:3000/user,最终设置 url = '/user', domain='http://locahost:3000'
     正则表达式：http://locahost:3000/user 会匹配到 http://localhost:3000*/
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domain = url.match(/[a-zA-z]+:\/\/[^/]*/)[0];
      url = url.slice(domain.length);
    }

    /* 如 url = '/user/:id'   而 data = {id: 10001}  使用 pathToRegexp.compile(url)(data) 之后就变成 /user/10001
     url = '/user/:id/:name'  使用 pathToRegexp.parse(url) 之后 match = ['id', 'name']
     * */
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    /* 组装 url，最终变成：url = 'http://locahost:3000/user/10001'*/
    url = domain + url;
  } catch (e) {
    message.error(e.message);
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      });
    case 'delete':
      return axios.delete(url, {
        params: cloneData,
      });
    case 'post':
      return axios.post(url, cloneData);
    case 'put':
      return axios.put(url, cloneData);
    case 'patch':
      return axios.patch(url, cloneData);
    default:
      return axios(options);
  }
};

/*
 * 主要功能：封装 fetch 函数
 *
 * @param url  请求后台的地址
 * @param method  请求方式 'get'、'post'、'delete'、'push'
 * @param data 请求后台需要携带的参数
 * */
export default function request (options) {
  return fetch(options).then((response) => {
    const { statusText, status } = response;
    // let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    let data = response.data;

    return {
      success: true,
      message: statusText,
      status,
      ...data,
    };
  }).catch((error) => {
    const { response } = error;
    let msg;
    let status;
    let otherData = {};
    if (response) {
      const { data, statusText } = response;
      otherData = data;
      status = response.status;
      msg = data.message || statusText;
    } else {
      status = 600;
      msg = 'Network Error';
    }
    return { success: false, status, message: msg, ...otherData };
  });
}
