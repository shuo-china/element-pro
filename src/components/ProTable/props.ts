import type { PaginationOptions } from "@/hooks/usePagination";
import type { Service } from "@/hooks/useRequest/type";
import type { PaginationProps } from "element-plus";
import tableProps from "element-plus/es/components/table/src/table/defaults.mjs";

export const proTableProps = {
  request: {
    type: Function as PropType<Service<any, any>>,
    required: true,
  },
  requestOptions: {
    type: Object as PropType<PaginationOptions>,
    default: () => ({}),
  },
  paginationProps: {
    type: Object as PropType<Partial<PaginationProps>>,
    default: () => ({}),
  },
} as const;

export type ProTableProps = typeof proTableProps & typeof tableProps;
