import request from "@/utils/request";
export function getHomeData(params) {
  return request({
    url: "/home",
    method: "get",
    params: params
  });
}

export function getWorldMapData(params) {
  return request({
    url: "/world_map_data",
    method: "get",
    params: params
  });
}
