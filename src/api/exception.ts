import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export interface ExceptionLog {
  id: number;
  file: string;
  line: string;
  error_code: string;
  issue: string;
  request_ip: string;
  request_url: string;
  request_method: string;
  request_time: string;
  create_time: string;
  update_time: string;
}

export function getExceptionPaginationApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request<Pagination<ExceptionLog>>({
    url: "/exception/pagination",
    method: "get",
    params,
    ...options,
  });
}

export function getExceptionDetailApi(
  id: number,
  options?: AxiosRequestConfig,
) {
  return request<ExceptionLog>({
    url: "/exception/detail",
    method: "get",
    params: { id },
    ...options,
  });
}

export function deleteExceptionApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "/exception/delete",
    method: "post",
    params: { id },
    ...options,
  });
}
