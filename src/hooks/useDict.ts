import type { Options } from "./useRequest/type";
import { useDictStore } from "@/store/dict";

type Result<T extends string> = Partial<Record<T, OptionItem[]>>;

function useDict<T extends string, P extends unknown[] = any>(
  key: T | T[],
  _options: Options<Result<T>, P> = {},
) {
  const dictStore = useDictStore();
  const dict = computed<Result<T>>(() => dictStore.getDict(key));

  return {
    dict,
  };
}

export default useDict;
