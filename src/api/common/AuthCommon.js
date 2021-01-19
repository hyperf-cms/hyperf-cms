import request from '@/utils/request'
export function getVerificationCode(params) {
  return request({
    url:'/common/auth/verification_code',
    method:'get',
    params:params
  })
}