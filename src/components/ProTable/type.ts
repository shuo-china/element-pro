import type { TableInstance } from "element-plus";

export type ProTableInstance = {
  search: (paginationParams?: Record<string, any>) => void;
  reset: () => void;
  refresh: () => void;
  getInstance: () => TableInstance;
};
