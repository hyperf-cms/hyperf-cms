import request from "@/utils/request";

export function videoAdd(params) {
  return request({
    url: "/laboratory/bilibili_module/video/video_add",
    method: "post",
    data: params
  });
}

export function video(params) {
  return request({
    url: "/laboratory/bilibili_module/video/video",
    method: "get",
    params: params
  });
}

export function videoSearch(params) {
  return request({
    url: "/laboratory/bilibili_module/video/video_title_search",
    method: "get",
    params: params
  });
}

export function videoChartTrend(params) {
  return request({
    url: "/laboratory/bilibili_module/video/video_chart_trend",
    method: "get",
    params: params
  });
}

export function videoDataReport(params) {
  return request({
    url: "/laboratory/bilibili_module/video/video_data_report",
    method: "get",
    params: params
  });
}
