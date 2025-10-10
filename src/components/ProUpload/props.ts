import type { uploadProps, UploadUserFile } from "element-plus";

export type FileItem = UploadUserFile & { id: number };

export const proUploadProps = {
  type: {
    type: String as PropType<"image" | "file">,
    default: "image",
  },
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: "",
  },
  fileList: {
    type: Array as PropType<FileItem[]>,
    default: () => [],
  },
  showTip: {
    type: Boolean,
    default: true,
  },
  config: {
    type: Object as PropType<{
      apiURL?: string;
      limitExt?: string[];
      limitSize?: number;
    }>,
  },
} as const;

export type ProUploadProps = typeof proUploadProps &
  Omit<typeof uploadProps, "fileList">;
