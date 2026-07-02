import { getDictInitApi } from "@/api/dict_type";

type Dict = Record<string, OptionItem[]>;

export const useDictStore = defineStore("dict", () => {
  const dict = ref<Dict>({});

  const initAfterLogin = () => {
    return getDictInitApi().then((res) => {
      dict.value = res || {};
    });
  };

  const getDict = <T extends string>(key: T | T[]) => {
    const keys = Array.isArray(key) ? key : [key];

    return keys.reduce<Partial<Record<T, OptionItem[]>>>((result, item) => {
      result[item] = dict.value[item] || [];
      return result;
    }, {});
  };

  return {
    dict,
    getDict,
    initAfterLogin,
  };
});
