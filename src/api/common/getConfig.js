import request from '@/utils/request'
export function getVerificationCode(params) {
  return request({
    url:'/common/get_verification_code',
    method:'get',
    params:params
  })
}

export function getRandMd5Key(params) {
  return request({
    url:'/common/get_rand_md5',
    method:'get',
    params:params
  })
}

export function getRsaKey(params) {
  return request({
    url:'/common/get_rsa_key',
    method:'get',
    params:params
  })
}

export function getMaintainStatus(params) {
  return request({
    url: '/common/get_maintain_status',
    method: 'get',
    params: params
  })
}

export function getSimpleMaintainStatus(params) {
  return request({
    url: '/common/get_simple_maintain_status',
    method: 'get',
    params: params
  })
}
