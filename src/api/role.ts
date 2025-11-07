import request from "@/utils/request";

export const getRoleOptionsApi = () => {
  return request<OptionItem[]>({
    url: "/roles",
    method: "get",
  });
};
