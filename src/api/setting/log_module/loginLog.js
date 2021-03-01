import request from '@/utils/request'
export function loginLogList(params) {
  return request({
    url: '/setting/log_module/login_log/list',
    method: 'get',
    params: params
  })
}