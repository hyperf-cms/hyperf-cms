import request from '@/utils/request'
export function getSystemConfig() {
  return request({
    url:'/setting/system/get_config',
    method:'get',
  })
}
