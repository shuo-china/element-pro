import axios, { type AxiosRequestConfig } from "axios";
import { useUserStore } from "@/store/user";
import { ElMessage, ElNotification } from "element-plus";

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
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // http status code !2xx
    const { response, message } = error;
    if (response && response.data) {
      if (response.status === 401 && response.data.code === "TOKEN_INVALID") {
        useUserStore().clear();
        location.reload();
      } else {
        const errorMsg = response.data.message || message || "Unknown Error";
        if (response.status >= 500) {
          ElNotification({
            type: "error",
            title: response.status,
            message: errorMsg,
          });
        } else {
          ElMessage.error(errorMsg);
        }
      }

      return Promise.reject(
        new ApiError(message, response.status, response.data),
      );
    }

    return Promise.reject(error);
  },
);

function request<T = any, R = any>(config: AxiosRequestConfig<R>): Promise<T> {
  return axiosInstance(config).then((res) => res.data);
}

export default request;
