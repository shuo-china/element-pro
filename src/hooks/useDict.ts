import useRequest from "@/hooks/useRequest";
import { getDictOptionsApi } from "@/api/dict";

function useDict<T extends string>(key: T | T[]) {
  const keys = Array.isArray(key) ? key.join(",") : key;

  const { data, loading } = useRequest(getDictOptionsApi, {
    defaultParams: [
      {
        dict_types: keys,
      },
    ],
  });

  const dict = computed<Record<T, Option[]>>(() => data.value || {});

  return {
    dict,
    dictLoading: loading,
  };
}

export default useDict;
