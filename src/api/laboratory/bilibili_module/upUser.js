import request from "@/utils/request";

export function upUserAdd(params) {
  return request({
    url: "/laboratory/bilibili_module/up_user/up_user_add",
    method: "post",
    data: params
  });
}
