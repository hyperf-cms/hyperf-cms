import request from "@/utils/request";
export function globalConfigList(params) {
  return request({
    url: "/setting/system_module/global_config/list",
    method: "get",
    params: params
  });
}

export function createGlobalConfig(params) {
  return request({
    url: "/setting/system_module/global_config/store",
    method: "post",
    data: params
  });
}

export function editGlobalConfig(id) {
  return request({
    url: "/setting/system_module/global_config/edit/" + id,
    method: "get",
    params: ""
  });
}

export function updateGlobalConfig(id, params) {
  return request({
    url: "/setting/system_module/global_config/update" + "/" + id,
    method: "put",
    data: params
  });
}

export function deleteGlobalConfig(id, data) {
  return request({
    url: "/setting/system_module/global_config/destroy" + "/" + id,
    method: "delete",
    data: data
  });
}
