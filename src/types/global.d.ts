import { pagination } from "@/config";

export {};

declare global {
  type Nullable<T> = null | T;

  type UnRef<T> = T extends Ref<infer V> ? V : T;

  type ApiErrorData = {
    code: string;
    message: string;
  };

  type Pagination<T = any> = Record<
    (typeof pagination)["responseTotalKey"],
    number
  > & {
    [k in (typeof pagination)["responseDataKey"]]: T[];
  };
}
