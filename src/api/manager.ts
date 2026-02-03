import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

interface ManagerInfoResponseData {
  id: number;
  nickname: string;
  roles: string[];
  is_top: number;
}

export function getAccessTokenByPasswordApi(
  data: {
    username: string;
    password: string;
  },
  options?: AxiosRequestConfig,
) {
  return request<{ access_token: string }>({
    url: "/access/createTokenByPassword",
    method: "post",
    data,
    ...options,
  });
}

export function getAccessTokenByWechatApi(
  data: { code: string },
  options?: AxiosRequestConfig,
) {
  return request<{ access_token: string }>({
    url: "/access/createTokenByWechat",
    method: "post",
    data,
    ...options,
  });
}

export function getCurrentManagerInfoApi(options?: AxiosRequestConfig) {
  return request<ManagerInfoResponseData>({
    url: "/manager/currentManager",
    method: "get",
    ...options,
  });
}

export function getManagerPaginationApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<Pagination<ManagerInfoResponseData>>({
    url: "/manager/pagination",
    method: "get",
    params,
    ...options,
  });
}

export function createManagerApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/manager/create",
    method: "post",
    data,
    ...options,
  });
}

export function getManagerDetailApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/manager/detail`,
    method: "get",
    params: { id },
    ...options,
  });
}

export function updateManagerApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: `/manager/update`,
    method: "patch",
    data,
    ...options,
  });
}

export function deleteManagerApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/manager/delete`,
    method: "delete",
    params: { id },
    ...options,
  });
}

export function bindWechatApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/manager/bindWechat",
    method: "post",
    data,
    ...options,
  });
}
export function unBindWechatApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/manager/unBindWechat",
    method: "post",
    data,
    ...options,
  });
}
