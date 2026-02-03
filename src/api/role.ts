import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export const getRoleOptionsApi = (options?: AxiosRequestConfig) => {
  return request<OptionItem[]>({
    url: "/role/options",
    method: "get",
    ...options,
  });
};

export const getRolePaginationApi = (
  params: Record<string, any>,
  options?: AxiosRequestConfig,
) => {
  return request({
    url: "/role/pagination",
    method: "get",
    params,
    ...options,
  });
};

export function getRoleDetailApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/role/detail`,
    method: "get",
    params: { id },
    ...options,
  });
}

export function createRoleApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/role/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateRoleApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/role/update`,
    method: "patch",
    data,
    ...options,
  });
}

export function deleteRoleApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/role/delete`,
    method: "delete",
    params: { id },
    ...options,
  });
}
