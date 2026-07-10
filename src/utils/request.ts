import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { useManagerStore } from "@/store/manager";
import { ElMessage, ElNotification } from "element-plus";

declare module "axios" {
  interface AxiosRequestConfig {
    showErrorMessage?: boolean;
    returnFullResponse?: boolean;
  }
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export class ApiTokenInvalidError extends ApiError {
  constructor(data: ApiErrorData) {
    super("ApiTokenInvalidError", 401, data);
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

async function parseBlobErrorData(data: unknown) {
  if (!(data instanceof Blob)) return data;

  try {
    const text = await data.text();
    return text ? JSON.parse(text) : data;
  } catch {
    return data;
  }
}

axiosInstance.interceptors.request.use((config) => {
  const managerStore = useManagerStore();
  if (managerStore.token) {
    config.headers.Authorization = `Bearer ${managerStore.token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // http status code !2xx
    const { response, message, config } = error;

    if (response && response.data) {
      const responseData = await parseBlobErrorData(response.data);

      if (response.status === 401 && responseData.code === "TOKEN_INVALID") {
        useManagerStore().clear();
        location.reload();
        return Promise.reject(new ApiTokenInvalidError(responseData));
      } else {
        const errorMsg = responseData.message || message || "Unknown Error";
        if (response.status >= 500) {
          ElNotification({
            type: "error",
            title: response.status + "",
            message: errorMsg,
          });
        } else if (config.showErrorMessage !== false) {
          ElMessage.error(errorMsg);
        }
        return Promise.reject(
          new ApiError(errorMsg, response.status, responseData),
        );
      }
    } else {
      return Promise.reject(error);
    }
  },
);

function request<T = any, R = any>(
  config: AxiosRequestConfig<R> & { returnFullResponse: true },
): Promise<AxiosResponse<T>>;

function request<T = any, R = any>(config: AxiosRequestConfig<R>): Promise<T>;

function request<T = any, R = any>(
  config: AxiosRequestConfig<R>,
): Promise<T | AxiosResponse<T>> {
  return axiosInstance(config).then((res) =>
    config.returnFullResponse ? res : res.data,
  );
}

export default request;
