import request from "@/utils/request";

export type ConfigType =
  | "text"
  | "number"
  | "switch"
  | "select"
  | "image"
  | "images"
  | "file"
  | "files"
  | "tags";

export interface ConfigItem {
  id: number;
  type: ConfigType;
  title: string;
  name: string;
  value: any;
  tips: string;
  options: string;
}

export function getInitialConfigApi() {
  return request({
    url: "/config/initialize",
    method: "get",
  });
}

export function getConfigGroupsApi() {
  return request<OptionItem[]>({
    url: "/config/group",
    method: "get",
  });
}

export function getConfigListApi(params?: Record<string, any>) {
  return request<ConfigItem[]>({
    url: "/configs",
    method: "get",
    params,
  });
}

export function getConfigDetailApi(id: number) {
  return request<ConfigItem>({
    url: `/configs/detail/${id}`,
    method: "get",
  });
}

export function createConfigApi(data: Record<string, any>) {
  return request({
    url: `/configs`,
    method: "post",
    data,
  });
}

export function updateConfigApi(id: number, data: Record<string, any>) {
  return request({
    url: `/configs/${id}`,
    method: "patch",
    data,
  });
}

export function deleteConfigApi(id: number) {
  return request({
    url: `/configs/${id}`,
    method: "delete",
  });
}
