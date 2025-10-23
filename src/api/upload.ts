import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";

export interface UploadResponseData {
  key: string;
  name: string;
  path: string;
}

export function uploadApi(file: File, options?: AxiosRequestConfig) {
  const form = new FormData();
  form.append("file", file);

  return request<UploadResponseData>({
    url: "/files",
    method: "post",
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...options,
  });
}
