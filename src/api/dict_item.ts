import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

interface DictItem {
  id: number;
  type_id: number;
  key: string;
  name: string;
  value: string;
  status: number;
}

export function getDictItemOptionsApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict_item/options",
    method: "get",
    params,
    ...options,
  });
}

export function getDictItemListApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<DictItem[]>({
    url: "/dict_item/list",
    method: "get",
    params,
    ...options,
  });
}

export function getDictItemDetailApi(id: number, options?: AxiosRequestConfig) {
  return request<DictItem>({
    url: "/dict_item/detail",
    method: "get",
    params: { id },
    ...options,
  });
}

export function createDictItemApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict_item/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateDictItemApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/dict_item/update",
    method: "post",
    data,
    ...options,
  });
}

export function deleteDictItemApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "/dict_item/delete",
    method: "post",
    params: { id },
    ...options,
  });
}
