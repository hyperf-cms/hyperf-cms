import request from '@/utils/request'
export function getServer(params) {
  return request({
    url: '/setting/monitoring_module/serve',
    method: 'get',
    params: params
  })
}