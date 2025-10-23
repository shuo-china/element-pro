import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

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

interface UserInfoResponseData {
  base_info: {
    id: number;
    name: string;
    roles: string[];
  };
}

export function getCurrentUserInfoApi(options?: AxiosRequestConfig) {
  return request<UserInfoResponseData>({
    url: "/manager",
    method: "get",
    ...options,
  });
}

export function getUserListApi(params?: Record<string, any>) {
  return request<Pagination<UserInfoResponseData>>({
    url: "/search/managers",
    method: "get",
    params,
  });
}
