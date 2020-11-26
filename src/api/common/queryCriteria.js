import request from '@/utils/request'
export function getUserList(params) {
  return request({
    url:'/common/query_criteria/get_user_list',
    method:'get',
    params:params
  })
}

export function getDeliveryUserList(params) {
  return request({
    url:'/common/query_criteria/get_delivery_user_list',
    method:'get',
    params:params
  })
}

export function getAdminUserList(params) {
  return request({
    url:'/common/query_criteria/get_admin_user_list',
    method:'get',
    params:params
  })
}

export function getGameList(params) {
  return request({
    url:'/common/query_criteria/get_game_list',
    method:'get',
    params:params
  })
}

export function getGamePromotionList(params) {
  return request({
    url:'/common/query_criteria/get_game_promotion_list',
    method:'get',
    params:params
  })
}

export function getFileMaterialPxList(params) {
  return request({
    url:'/common/query_criteria/get_file_material_px',
    method:'get',
    params:params
  })
}

export function getCpList(params) {
  return request({
    url:'/common/query_criteria/get_cp_list',
    method:'get',
    params:params
  })
}

export function getChannelList(params) {
  return request({
    url:'/common/query_criteria/get_channel_list',
    method:'get',
    params:params
  })
}

export function getPackPluginList(params) {
  return request({
    url:'/common/query_criteria/get_pack_plugin_list',
    method:'get',
    params:params
  })
}

export function getAdBodyList(params) {
  return request({
    url:'/common/query_criteria/get_ad_body_list',
    method:'get',
    params:params
  })
}

export function getAdQueryLists(params) {
  return request({
    url: '/common/query_criteria/get_ad_query_list',
    method: 'get',
    params: params
  })
}


export function getPackList(params) {
  return request({
    url:'/common/query_criteria/get_pack_list',
    method:'get',
    params:params
  })
}

export function getKeystoreOptionsList(params) {
  return request({
    url:'/common/query_criteria/get_keystore_list',
    method:'get',
    params:params
  })
}

export function getToutiaoMainAccount(params) {
  return request({
    url:'/common/query_criteria/get_toutiao_main_account',
    method:'get',
    params:params
  })
}

export function getGdtMainAccount(params) {
  return request({
    url:'/common/query_criteria/get_gdt_main_account',
    method:'get',
    params:params
  })
}

export function getGdtTreeAccount(params) {
  return request({
    url:'/common/query_criteria/get_gdt_tree_account',
    method:'get',
    params:params
  })
}

export function getToutiaoTreeAccount(params) {
  return request({
    url:'/common/query_criteria/get_toutiao_tree_account',
    method:'get',
    params:params
  })
}

export function getPaywayList(params) {
  return request({
    url: '/common/query_criteria/get_payway_list',
    method: 'get',
    params: params
  })
}

export function getWechatMainAccount(params) {
  return request({
    url:'/common/query_criteria/get_wechat_main_account',
    method:'get',
    params:params
  })
}


export function getPerformerList(params) {
  return request({
    url:'/common/query_criteria/get_performer_list',
    method:'get',
    params:params
  })
}

export function getVideoList(params) {
  return request({
    url:'/common/query_criteria/get_video_list',
    method:'get',
    params:params
  })
}

export function getDeviceWhiteList(params) {
  return request({
    url:'/common/query_criteria/get_device_white_list',
    method:'get',
    params:params
  })
}

export function getChannelAccount(params) {
  return request({
    url: '/common/query_criteria/get_channel_account',
    method: 'get',
    params: params
  })
}

export function getChannelAgent(params) {
  return request({
    url: '/common/query_criteria/get_channel_agent',
    method: 'get',
    params: params
  })
}