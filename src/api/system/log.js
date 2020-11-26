import request from '@/utils/request'

export function getLogList(params) {
  return request({
    url:'/setting/system/get_log_list',
    method:'get',
    params: params
  });
}

export function getLogFile(params) {
  return request({
    url:'/setting/system/get_log_file',
    method:'get',
    params: params
  });
}

export function deleteLog(params) {
  return request({
    url: '/setting/system/delete_log',
    method: 'post',
    data: params
  })
}
