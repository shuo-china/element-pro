import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

interface DitcItem {
  id: number;
  dict_name: string;
  dict_type: string;
  dict_value_count: number;
  status: number;
}

interface DitcValueItem {
  id: number;
  dict_key: string;
  dict_value: string;
  status: number;
}

export function getDictListApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<DitcItem[]>({
    url: "/dict",
    method: "get",
    params,
    ...options,
  });
}

export function getDictDetailApi(id: number, options?: AxiosRequestConfig) {
  return request<DitcItem>({
    url: `/dict/detail/${id}`,
    method: "get",
    ...options,
  });
}

export function createDictApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateDictApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict/update",
    method: "post",
    data,
    ...options,
  });
}

export function deleteDictApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/dict/delete/${id}`,
    method: "delete",
    ...options,
  });
}

export function getDictValueListApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<DitcValueItem[]>({
    url: "/dict_value",
    method: "get",
    params,
    ...options,
  });
}

export function getDictValueDetailApi(
  id: number,
  options?: AxiosRequestConfig,
) {
  return request<DitcValueItem>({
    url: `/dict_value/detail/${id}`,
    method: "get",
    ...options,
  });
}

export function createDictValueApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict_value/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateDictValueApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict_value/update",
    method: "post",
    data,
    ...options,
  });
}

export function deleteDictValueApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/dict_value/delete/${id}`,
    method: "delete",
    ...options,
  });
}

export function getDictOptionsApi(
  params: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/data/dict_types",
    method: "get",
    params,
    ...options,
  });
}
