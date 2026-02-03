import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export type ConfigType =
  | "text"
  | "number"
  | "switch"
  | "select"
  | "image"
  | "images"
  | "file"
  | "files"
  | "tags"
  | "checkbox";

export interface ConfigItem {
  id: number;
  group_id: number;
  type: ConfigType;
  name: string;
  key: string;
  value: any;
  desc: string;
  options: string;
}

export function getConfigItemListApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<ConfigItem[]>({
    url: "/config_item/list",
    method: "get",
    params,
    ...options,
  });
}

export function getConfigItemDetailApi(
  id: number,
  options?: AxiosRequestConfig,
) {
  return request<ConfigItem>({
    url: "/config_item/detail",
    method: "get",
    params: { id },
    ...options,
  });
}

export function createConfigItemApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/config_item/create`,
    method: "post",
    data,
    ...options,
  });
}

export function updateConfigItemApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/config_item/update`,
    method: "post",
    data,
    ...options,
  });
}

export function updateConfigItemValueApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/config_item/updateValue`,
    method: "post",
    data,
    ...options,
  });
}

export function deleteConfigItemApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/config_item/delete`,
    method: "post",
    params: { id },
    ...options,
  });
}

export function getConfigItemTypeOptionsApi(options?: AxiosRequestConfig) {
  return request({
    url: `/config_item/typeOptions`,
    method: "get",
    ...options,
  });
}
