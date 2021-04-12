import request from '@/utils/request'
export function timedTaskList(params) {
  return request({
    url: '/setting/monitoring_module/timed_task/list',
    method: 'get',
    params: params
  })
}

export function createTimedTask(params) {
  return request({
    url: '/setting/monitoring_module/timed_task/store',
    method: 'post',
    data: params
  })
}

export function editTimedTask(id) {
  return request({
    url: '/setting/monitoring_module/timed_task/edit/' + id,
    method: 'get',
    params: ''
  })
}

export function updateTimedTask(id, params) {
  return request({
    url: '/setting/monitoring_module/timed_task/update' + '/' + id,
    method: 'put',
    data: params
  })
}

export function deleteTimedTask(id) {
  return request({
    url: '/setting/monitoring_module/timed_task/destroy' + '/' + id,
    method: 'delete',
    data: id,
  })
}