import { TOKEN_KEY } from "@/utils/constants";
import {
  getAccessTokenByPasswordApi,
  getAccessTokenByWechatApi,
  getCurrentManagerInfoApi,
} from "@/api/manager";

export interface ManagerInfo {
  id: number;
  nickname: string;
  roles: string[];
  isTop: boolean;
}

export const useManagerStore = defineStore("manager", () => {
  const token = useLocalStorage<Nullable<string>>(TOKEN_KEY, null);
  const managerInfo = ref<Nullable<ManagerInfo>>(null);

  const hasManagerInfo = computed(() => managerInfo.value !== null);

  const getAccessToken = async (type: "wechat" | "password", data) => {
    const getAccessTokenApi =
      type === "wechat"
        ? getAccessTokenByWechatApi
        : getAccessTokenByPasswordApi;
    const result = await getAccessTokenApi(data);
    token.value = result.access_token;
  };

  const getManagerInfo = async () => {
    const { id, nickname, roles, is_top } = await getCurrentManagerInfoApi();
    managerInfo.value = {
      id,
      nickname,
      roles,
      isTop: !!is_top,
    };
  };

  const clear = () => {
    token.value = null;
    managerInfo.value = null;
  };

  return {
    token,
    managerInfo,
    hasManagerInfo,
    getAccessToken,
    getManagerInfo,
    clear,
  };
});
