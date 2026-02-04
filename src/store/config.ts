import { getConfigInitApi, getConfigInitNoAuthApi } from "@/api/config_group";
import _ from "lodash";

interface Config {
  base: {
    title: string;
    description: string;
    logo: Nullable<FileItem>;
    copyright: string;
    layout: "top" | "side" | "mix";
    loginTypes: ("password" | "wechat")[];
  };
  upload: Record<
    "image" | "file",
    {
      limitExt: string[];
      limitSize: number;
    }
  >;
  pagination: {
    defaultPageSize: number;
    requestPageKey: string;
    requestPageSizeKey: string;
    responseTotalKey: string;
    responseDataKey: string;
  };
  wechat: {
    appid: string;
  };
}

const transformReceivedConfig = (res: any) => {
  return {
    base: {
      title: res.base?.web_site_title || "",
      description: res.base?.web_site_description || "",
      copyright: res.base?.web_site_copyright || "",
      logo: res.base?.web_site_logo || null,
      layout: res.base?.web_site_layout || "side",
      loginTypes: res.base?.web_site_login_type || [],
    },
    upload: {
      image: {
        limitExt: res.upload?.image_ext || [],
        limitSize: res.upload?.image_size || 0,
      },
      file: {
        limitExt: res.upload?.file_ext || [],
        limitSize: res.upload?.file_size || 0,
      },
    },
    pagination: {
      defaultPageSize: res.pagination?.default_page_size || 10,
      requestPageKey: res.pagination?.request_page_key || "page",
      requestPageSizeKey: res.pagination?.request_page_size_key || "list_rows",
      responseTotalKey: res.pagination?.response_total_key || "total",
      responseDataKey: res.pagination?.response_data_key || "data",
    },
    wechat: {
      appid: res.wechat?.appid || "",
    },
  };
};

export const useConfigStore = defineStore("config", () => {
  const config = ref<Nullable<Config>>(null);

  const initBeforeLogin = () => {
    return getConfigInitNoAuthApi().then((res) => {
      config.value = transformReceivedConfig(res);
    });
  };

  const initAfterLogin = () => {
    return getConfigInitApi().then((res) => {
      config.value = transformReceivedConfig(res);
    });
  };

  return {
    config,
    initBeforeLogin,
    initAfterLogin,
  };
});
