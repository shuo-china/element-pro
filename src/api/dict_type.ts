import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

interface DictType {
  id: number;
  name: string;
  key: string;
  status: number;
}

export function getDictTypeListApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<DictType[]>({
    url: "/dict_type/list",
    method: "get",
    params,
    ...options,
  });
}

export function getDictTypeDetailApi(id: number, options?: AxiosRequestConfig) {
  return request<DictType>({
    url: "/dict_type/detail",
    method: "get",
    params: { id },
    ...options,
  });
}

export function createDictTypeApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict_type/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateDictTypeApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict_type/update",
    method: "post",
    data,
    ...options,
  });
}

export function deleteDictTypeApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "dict_type/delete",
    params: { id },
    method: "post",
    ...options,
  });
}
