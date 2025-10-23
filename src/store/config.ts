import { getInitialConfigApi } from "@/api/config";

interface Config {
  base: {
    title: string;
    description: string;
    copyright: string;
    logo: string;
  };
  // upload: Record<
  //   "image" | "file",
  //   {
  //     limitExt: string[];
  //     limitSize: number;
  //   }
  // >;
  // pagination: {
  //   defaultPageSize: number;
  //   requestPageKey: string;
  //   requestPageSizeKey: string;
  //   responseTotalKey: string;
  //   responseDataKey: string;
  // };
}

export const useConfigStore = defineStore("config", () => {
  const config = ref<Nullable<Config>>(null);

  const isInitialized = computed(() => {
    return !!config.value;
  });

  const init = () => {
    return getInitialConfigApi().then((res) => {
      config.value = {
        base: {
          title: res.base.web_site_title,
          description: res.base.web_site_description,
          copyright: res.base.web_site_copyright,
          logo: res.base.web_site_logo,
        },
      };
    });
  };

  return {
    isInitialized,
    config,
    init,
  };
});
