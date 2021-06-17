import request from '@/utils/request'
export function getControlList(params) {
  return request({
    url: '/setting/technique_module/control/list',
    method: 'get',
    params: params
  })
}

export function changeControl(params) {
  return request({
    url: '/setting/technique_module/control/change_control',
    method: 'post',
    data: params
  })
}
