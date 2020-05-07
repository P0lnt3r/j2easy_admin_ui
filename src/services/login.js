import request from '@/utils/request';


export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

import { BM_API_BASE } from '@/services/config'
export async function login( params ){
  return request( `${BM_API_BASE}/bm/login` , {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}
