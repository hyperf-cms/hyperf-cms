import request from "@/utils/request";
export function dictTypeList(params) {
  return request({
    url: "/setting/system_module/dict_type/list",
    method: "get",
    params: params
  });
}

export function createDictType(params) {
  return request({
    url: "/setting/system_module/dict_type/store",
    method: "post",
    data: params
  });
}

export function editDictType(id) {
  return request({
    url: "/setting/system_module/dict_type/edit/" + id,
    method: "get",
    params: ""
  });
}

export function updateDictType(id, params) {
  return request({
    url: "/setting/system_module/dict_type/update" + "/" + id,
    method: "put",
    data: params
  });
}

export function deleteDictType(id, data) {
  return request({
    url: "/setting/system_module/dict_type/destroy" + "/" + id,
    method: "delete",
    data: data
  });
}
