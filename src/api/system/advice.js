import request from '@/utils/request'

export function getAdviceList(params) {
    return request({
        url:'/setting/system/advice',
        method:'get',
        params:params
    });
}

export function getOneAdvice(params) {
  return request({
      url:'/setting/system/advice',
      method:'get',
      params:params
  });
}

export function createAdvice(params) {
  return request({
      url:'/setting/system/advice',
      method:'post',
      data:params
  });
}

export function updateAdvice(id, params) {
  return request({
      url:'/setting/system/advice' + '/' + id,
      method:'put',
      data:params
  });
}

export function changeStatus(params) {
  return request({
    url: '/setting/system/reply_advice',
    method: 'post',
    data: params
  })
}

export function deleteAdvice(id) {
  return request({
      url:'/setting/system/advice' + '/' + id,
      method:'delete'
  });
}

export function getAdviceReply(params) {
  return request({
    url: '/setting/system/advice',
    method: 'get',
    params: params
  })
}