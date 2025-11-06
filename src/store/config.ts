import { getInitialConfigApi } from "@/api/config";

interface Config {
  base: {
    title: string;
    description: string;
    logo: string;
    layout: "top" | "side" | "mix";
  };
  upload: Record<
    "image" | "file",
    {
      limitExt: string;
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
          logo: res.base.web_site_logo,
          layout: res.base.web_site_layout,
        },
        pagination: {
          defaultPageSize: res.pagination.default_page_size,
          requestPageKey: res.pagination.request_page_key,
          requestPageSizeKey: res.pagination.request_page_size_key,
          responseTotalKey: res.pagination.response_total_key,
          responseDataKey: res.pagination.response_data_key,
        },
        upload: {
          image: {
            limitExt: res.upload.upload_image_ext,
            limitSize: res.upload.upload_image_size,
          },
          file: {
            limitExt: res.upload.upload_file_ext,
            limitSize: res.upload.upload_file_size,
          },
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
