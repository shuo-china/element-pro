import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export interface Menu {
  id: number;
  parent_id: number;
  title: string;
  path: string;
  icon?: string;
  api_keys?: string[];
  children?: Menu[];
}

export function getMenuTreeApi(options?: AxiosRequestConfig) {
  return request<Menu[]>({
    url: "/menu/tree",
    method: "get",
    ...options,
  });
}

export function getCurrentMenuTreeApi(options?: AxiosRequestConfig) {
  return request<Menu[]>({
    url: "/menu/currentMenus",
    method: "get",
    ...options,
  });
}

export function createMenuApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/menu/create",
    method: "post",
    data,
    ...options,
  });
}

export function updateMenuApi(
  data: Record<string, any>,
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/menu/update",
    method: "post",
    data,
    ...options,
  });
}

export function updateMenuSortApi(
  data: { menus: Array<{ id: number; parent_id: number; order: number }> },
  options?: AxiosRequestConfig,
) {
  return request({
    url: "/menu/sort",
    method: "post",
    data,
    ...options,
  });
}

export function deleteMenuApi(id: number, options?: AxiosRequestConfig) {
  return request({
    url: "/menu/delete",
    method: "delete",
    params: { id },
    ...options,
  });
}
