import useRequest from "./useRequest";
import { merge, pick } from "lodash";
import type { Options, Service } from "./useRequest/type";
import { useConfigStore } from "@/store/config";

interface PaginationType {
  pageKey: string;
  pageSizeKey: string;
  totalKey: string;
  dataKey: string;
}

export interface PaginationExtendsOption {
  pagination?: Partial<PaginationType>;
}

export interface PaginationOptions<R = any, P extends unknown[] = any>
  extends Options<R, P>,
    PaginationExtendsOption {}

const configStore = useConfigStore();

function usePagination<R = any, P extends unknown[] = any>(
  service: Service<R, P>,
  options: PaginationOptions<R, P> = {},
) {
  const { pagination, ...restOptions } = options;

  const { config } = configStore;

  const defaultPaginationOptions: PaginationType = {
    // reuqest keys
    pageKey: config?.pagination.requestPageKey || "page",
    pageSizeKey: config?.pagination.requestPageSizeKey || "list_rows",
    // response keys
    totalKey: config?.pagination.responseTotalKey || "total",
    dataKey: config?.pagination.responseDataKey || "data",
  };

  const { pageKey, pageSizeKey, totalKey, dataKey } = Object.assign(
    {},
    defaultPaginationOptions,
    pagination,
  );

  const finallyOptions = merge(
    {
      defaultParams: [
        {
          [pageKey]: 1,
          [pageSizeKey]: config?.pagination.defaultPageSize || 10,
        },
      ],
    },
    restOptions,
  ) as Options<R, P>;

  const defaultParamsKeys = Object.keys(
    finallyOptions.defaultParams![0] as Record<string, any>,
  );

  const {
    data: responseData,
    loading,
    params,
    run,
    refresh,
  } = useRequest<R, P>(service, finallyOptions, {
    params: finallyOptions.defaultParams,
  });

  const paging = (
    paginationParams?: Record<string, any>,
    isKeepExtraParams = true,
  ) => {
    const [oldPaginationParams, ...restParams] = (params.value as P[]) || [];
    let newPaginationParams;
    if (isKeepExtraParams) {
      newPaginationParams = {
        ...oldPaginationParams,
        ...paginationParams,
      };
    } else {
      newPaginationParams = {
        ...pick(oldPaginationParams, defaultParamsKeys),
        ...paginationParams,
      };
    }

    const mergerParams = [newPaginationParams, ...restParams] as P;
    run(...mergerParams);
  };

  const search = (paginationParams?: Record<string, any>) => {
    paging({ [pageKey]: 1, ...paginationParams }, false);
  };

  const reset = () => {
    search();
  };

  const changePage = (page: number, otherParams?: Record<string, any>) => {
    paging({ [pageKey]: page, ...otherParams });
  };

  const changePageSize = (
    pageSize: number,
    otherParams?: Record<string, any>,
  ) => {
    paging({ [pageSizeKey]: pageSize, [pageKey]: 1, ...otherParams });
  };

  const total = computed(() => responseData.value?.[totalKey] || 0);

  const data = computed(() => responseData.value?.[dataKey] || []);

  const currentPage = computed({
    get: () =>
      (params.value?.[0] as any)?.[pageKey] ??
      (finallyOptions.defaultParams![0] as Record<string, any>)[pageKey],
    set(val: number) {
      changePage(val);
    },
  });

  const pageSize = computed({
    get: () =>
      (params.value?.[0] as any)?.[pageSizeKey] ??
      (finallyOptions.defaultParams![0] as Record<string, any>)[pageSizeKey],
    set(val: number) {
      changePageSize(val);
    },
  });

  return {
    loading,
    data,
    currentPage,
    pageSize,
    total,
    paging,
    search,
    reset,
    refresh,
    changePage,
    changePageSize,
  };
}

export default usePagination;
