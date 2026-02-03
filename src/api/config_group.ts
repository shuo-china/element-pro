import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export interface ConfigGroup {
  id: number;
  name: string;
  key: string;
}

export function getConfigInitApi(options?: AxiosRequestConfig) {
  return request({
    url: "/config_group/init",
    method: "get",
    ...options,
  });
}

export function getConfigGroupOptionsApi(options?: AxiosRequestConfig) {
  return request<OptionItem[]>({
    url: "/config_group/options",
    method: "get",
    ...options,
  });
}

export function getConfigGroupListApi(options?: AxiosRequestConfig) {
  return request({
    url: "/config_group/list",
    method: "get",
    ...options,
  });
}

export function getConfigGroupPaginationApi(options?: AxiosRequestConfig) {
  return request({
    url: "/config_group/pagination",
    method: "get",
    ...options,
  });
}

export function getConfigGroupDetailApi(
  id: number,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/config_group/detail",
    method: "get",
    params: {
      id,
    },
    ...options,
  });
}

export function createConfigGroupApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/config_group/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateConfigGroupApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/config_group/update",
    method: "post",
    data,
    ...options,
  });
}

export function deleteConfigGroupApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "/config_group/delete",
    method: "post",
    params: {
      id,
    },
    ...options,
  });
}
