import { TOKEN_KEY } from "@/utils/constants";
import { getAccessTokenApi, getCurrentUserInfoApi } from "@/api/user";

export interface UserInfo {
  id: number;
  nickname: string;
  roles: string[];
}

export const useUserStore = defineStore("user", () => {
  const token = useLocalStorage<Nullable<string>>(TOKEN_KEY, null);
  const userInfo = ref<Nullable<UserInfo>>(null);

  const hasUserInfo = computed(() => userInfo.value !== null);

  const getAccessToken = async (data) => {
    const result = await getAccessTokenApi(data);
    token.value = result.access_token;
  };

  const getUserInfo = async () => {
    const { id, name, roles } = await getCurrentUserInfoApi();
    userInfo.value = {
      id,
      nickname: name,
      roles,
    };
  };

  const clear = () => {
    token.value = null;
    userInfo.value = null;
  };

  return {
    token,
    userInfo,
    hasUserInfo,
    getAccessToken,
    getUserInfo,
    clear,
  };
});
