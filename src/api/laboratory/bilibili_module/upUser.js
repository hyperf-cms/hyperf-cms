import request from "@/utils/request";

export function upUserAdd(params) {
  return request({
    url: "/laboratory/bilibili_module/up_user/up_user_add",
    method: "post",
    data: params
  });
}

export function upUser(params) {
  return request({
    url: "/laboratory/bilibili_module/up_user/up_user",
    method: "get",
    params: params
  });
}

export function upUserSearch(params) {
  return request({
    url: "/laboratory/bilibili_module/up_user/up_user_search",
    method: "get",
    params: params
  });
}

export function upUserChartTrend(params) {
  return request({
    url: "/laboratory/bilibili_module/up_user/up_user_chart_trend",
    method: "get",
    params: params
  });
}
