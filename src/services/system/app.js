import qs from 'qs';
import { request, config } from '../../assets/utils/index';

const { api } = config;
const { userInfo, userLogout, userLogin } = api;

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: qs.stringify(params),
  });
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  });
}

export async function query (params) {
  return request({
    url: userInfo,
    method: 'get',
    data: params,
  });
}
