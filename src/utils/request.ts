import axios, { type AxiosRequestConfig } from "axios";
import { useManagerStore } from "@/store/manager";
import { ElMessage, ElNotification } from "element-plus";

declare module "axios" {
  interface AxiosRequestConfig {
    showErrorMessage?: boolean;
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

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const managerStore = useManagerStore();
  if (managerStore.token) {
    config.headers.Authorization = `Bearer ${managerStore.token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // http status code !2xx
    const { response, message, config } = error;

    if (response && response.data) {
      if (response.status === 401 && response.data.code === "TOKEN_INVALID") {
        useManagerStore().clear();
        location.reload();
      } else {
        const errorMsg = response.data.message || message || "Unknown Error";
        if (response.status >= 500) {
          ElNotification({
            type: "error",
            title: response.status,
            message: errorMsg,
          });
        } else if (config.showErrorMessage !== false) {
          ElMessage.error(errorMsg);
        }
        return Promise.reject(
          new ApiError(errorMsg, response.status, response.data),
        );
      }
    } else {
      return Promise.reject(error);
    }
  },
);

function request<T = any, R = any>(config: AxiosRequestConfig<R>): Promise<T> {
  return axiosInstance(config).then((res) => res.data);
}

export default request;
