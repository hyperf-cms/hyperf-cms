import request from '@/utils/request'
export function initUserInfo(params) {
  return request({
    url: '/laboratory/chat_module/init_user_info',
    method: 'get',
    params: params
  })
}