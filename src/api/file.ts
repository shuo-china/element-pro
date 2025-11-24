import request from "@/utils/request";
import type { AxiosRequestConfig } from "axios";
import { saveAs } from "file-saver";

export interface UploadResponseData {
  key: string;
  name: string;
  path: string;
  full_path: string;
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

function getFileNameFromHeaders(
  headers: Record<string, any>,
  defaultName = "download",
) {
  const disposition =
    headers["Content-Disposition"] || headers["content-disposition"];
  if (!disposition) return defaultName;

  let fileName;
  const filenameRegex = /filename=["']?([^"';]+)["']?/i;
  const match = disposition.match(filenameRegex);

  if (match && match[1]) {
    fileName = match[1];

    try {
      fileName = fileName.replace(/\+/g, "%20");
      fileName = decodeURIComponent(fileName);
    } catch (e) {}
  }

  return fileName || defaultName;
}

export function downloadApi(url: string, params?: Record<string, any>) {
  return request<number>({
    url,
    params,
    method: "get",
    responseType: "blob",
    returnFullResponse: true,
  }).then((res) => {
    saveAs(res.data, getFileNameFromHeaders(res.headers));
  });
}
