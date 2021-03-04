import request from '@/utils/request'
export function getLogPath(params) {
  return request({
    url: '/setting/log_module/system_log/log_path',
    method: 'get',
    params: params
  })
}

export function getLogContent(params) {
  return request({
    url: '/setting/log_module/system_log/log_content',
    method: 'get',
    params: params
  })
}

export function destroyLog(params) {
  return request({
    url: '/setting/log_module/system_log/destroy_log',
    method: 'delete',
    data: params
  })
}