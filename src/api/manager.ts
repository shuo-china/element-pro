import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

interface ManagerInfoResponseData {
  base_info: {
    id: number;
    nickname: string;
    roles: string[];
  };
}

export function getAccessTokenByPasswordApi(data: {
  username: string;
  password: string;
}) {
  return request<{ access_token: string }>({
    url: "/login/tokens",
    method: "post",
    data,
  });
}

export function getAccessTokenByWechatApi(data: { code: string }) {
  return request<{ access_token: string }>({
    url: "/tokens",
    method: "post",
    data,
  });
}

export function getCurrentManagerInfoApi(options?: AxiosRequestConfig) {
  return request<ManagerInfoResponseData>({
    url: "/manager",
    method: "get",
    ...options,
  });
}

export function getManagerPaginationApi(params?: Record<string, any>) {
  return request<Pagination<ManagerInfoResponseData>>({
    url: "/search/managers",
    method: "get",
    params,
  });
}

export function createManagerApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/managers",
    method: "post",
    data,
    ...options,
  });
}

export function getManagerDetailApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: `/manager/${id}`,
    method: "get",
    ...options,
  });
}

export function updateManagerApi(id: number, data: Record<string, any>) {
  return request({
    url: `/managers/${id}`,
    method: "patch",
    data,
  });
}

export function deleteManagerApi(id: number) {
  return request({
    url: `/managers/${id}`,
    method: "delete",
  });
}

export function bindWechatApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/manager/bind",
    method: "post",
    data,
    ...options,
  });
}
