import request from '@/utils/request'
export function operateLogList(params) {
  return request({
    url: '/setting/log_module/operate_log/list',
    method: 'get',
    params: params
  })
}