import type { FormInstance } from "element-plus";

export type DrawerFormInstance = {
  reset: () => void;
  getFormInstance: () => FormInstance;
};
