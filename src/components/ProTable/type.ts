import type { TableInstance } from "element-plus";

export type ProTableInstance = {
  currentPage: number;
  search: (paginationParams?: Record<string, any>) => void;
  reset: () => void;
  refresh: () => void;
  getInstance: () => TableInstance;
};
