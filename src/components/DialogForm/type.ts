import type { FormInstance } from "element-plus";

export type DialogFormInstance = {
  reset: () => void;
  getFormInstance: () => FormInstance;
};
