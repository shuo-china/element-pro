import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

interface ManagerInfoResponseData {
  base_info: {
    id: number;
    nickname: string;
    roles: string[];
  };
}

export function getAccessTokenApi(data: {
  username: string;
  password: string;
}) {
  return request<{ access_token: string }>({
    url: "/login/tokens",
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
