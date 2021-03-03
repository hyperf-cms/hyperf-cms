import request from '@/utils/request'
export function getHomeData(params) {
  return request({
    url: '/home',
    method:'get',
    params:params
  })
}