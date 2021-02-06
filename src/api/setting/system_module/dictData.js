import request from '@/utils/request'
export function dictDataList(params) {
  return request({
    url: '/setting/system_module/dict_data/list',
    method: 'get',
    params: params
  })
}

export function createDictData(params) {
  return request({
    url: '/setting/system_module/dict_data/store',
    method: 'post',
    data: params
  })
}

export function editDictData(id) {
  return request({
    url: '/setting/system_module/dict_data/edit/' + id,
    method: 'get',
    params: ''
  })
}

export function updateDictData(id, params) {
  return request({
    url: '/setting/system_module/dict_data/update' + '/' + id,
    method: 'put',
    data: params
  })
}

export function deleteDictData(id) {
  return request({
    url: '/setting/system_module/dict_data/destroy' + '/' + id,
    method: 'delete',
    data: id,
  })
}