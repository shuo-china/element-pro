import useRequest from "@/hooks/useRequest";
import { getDictItemOptionsApi } from "@/api/dict_item";
import type { Options } from "./useRequest/type";
import { merge } from "lodash";

type Result<T extends string> = Partial<Record<T, OptionItem[]>>;

function useDict<T extends string, P extends unknown[] = any>(
  key: T | T[],
  options: Options<Result<T>, P> = {},
) {
  const keys = Array.isArray(key) ? key.join(",") : key;

  const finallyOptions = merge(
    {
      defaultParams: [
        {
          dict_types: keys,
        },
      ] as Parameters<typeof getDictItemOptionsApi>,
    },
    options,
  );

  const { data, loading, ...rest } = useRequest(
    getDictItemOptionsApi,
    finallyOptions,
  );

  const dict = computed<Result<T>>(() => data.value || {});

  return {
    dict,
    dictLoading: loading,
    ...rest,
  };
}

export default useDict;
