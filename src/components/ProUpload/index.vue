<template>
  <el-upload
    ref="uploadRef"
    :multiple="multiple"
    :file-list="fileList"
    :class="{ disabled: fileList.length >= uploadProps.limit! }"
    v-bind="uploadProps"
    :before-upload="handleBeforeUpload"
    :http-request="handleHttpRequest"
    @update:file-list="handleUpdateFileList"
    @success="handleSuccess"
    @error="handleError"
    @exceed="handleExceed"
    @remove="handleRemove"
    @preview="handlePreview"
  >
    <template #default>
      <el-button icon="Upload">上传</el-button>
    </template>
    <template #tip v-if="showTip">
      <div v-if="limitExtTip" class="mt-1.5 text-xs text-black/50">
        {{ limitExtTip }}
      </div>
      <div v-if="limitSizeTip" class="mt-1.5 text-xs text-black/50">
        {{ limitSizeTip }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import config from "@/config";
import { UPDATE_FILE_LIST_EVENT, UPDATE_MODEL_EVENT } from "@/utils/constants";
import { byteTransform } from "@/utils/transform";
import {
  ElMessage,
  type UploadFile,
  type UploadFiles,
  type UploadInstance,
  type UploadProps,
  type UploadRawFile,
  type UploadRequestOptions,
  type UploadUserFile,
} from "element-plus";
import { uploadApi, type UploadResponseData } from "@/api/upload";

type FileItem = UploadUserFile & { id: number };

const emit = defineEmits([UPDATE_MODEL_EVENT, UPDATE_FILE_LIST_EVENT]);

const props = withDefaults(
  defineProps<{
    type?: "image" | "file";
    modelValue?: string | number;
    fileList?: FileItem[];
    showTip?: boolean;
    uploadProps?: Partial<UploadProps>;
    config?: {
      apiURL?: string;
      limitExt?: string[];
      limitSize?: number;
    };
  }>(),
  {
    type: "image",
    modelValue: "",
    showTip: true,
    fileList: () => [],
    config: () => ({}),
    uploadProps: () => ({}),
  },
);

const defaultFileUploadProps: Partial<UploadProps> = {
  limit: 1,
};

const defaultImageUploadProps: Partial<UploadProps> = {
  limit: 1,
  listType: "picture-card",
};

const uploadProps = computed<Partial<UploadProps>>(() =>
  Object.assign(
    {},
    props.type === "file" ? defaultFileUploadProps : defaultImageUploadProps,
    props.uploadProps,
  ),
);

const uploadConfig = computed(() => ({
  ...config.upload[props.type],
  ...props.config,
}));

const multiple = computed(() => (uploadProps.value.limit === 1 ? false : true));

const limitExt = computed(() => {
  let ext = uploadConfig.value.limitExt;
  if (typeof ext === "string") {
    ext = ext ? (ext as string).split(",").map((e) => e.toLowerCase()) : [];
  }
  return ext;
});

const limitExtTip = computed(() => {
  if (limitExt.value.length) {
    return `支持${limitExt.value.join("、")}格式的文件`;
  }
  return "";
});

const limitSizeTip = computed(() => {
  if (uploadConfig.value.limitSize) {
    return `最大上传文件大小：${byteTransform(uploadConfig.value.limitSize)}`;
  }
  return "";
});

const handleBeforeUpload = (rawFile: UploadRawFile) => {
  const limitExtArr = limitExt.value;
  if (Array.isArray(limitExtArr) && limitExtArr.length) {
    const suffix = rawFile.name
      .substring(rawFile.name.lastIndexOf(".") + 1)
      .toLowerCase();
    if (!limitExtArr.includes(suffix)) {
      ElMessage.error(`文件格式不正确，当前支持格式：${limitExtArr.join(",")}`);
      return false;
    }
  }

  const limitSize = uploadConfig.value.limitSize;
  if (limitSize) {
    if (rawFile.size / 1024 > limitSize) {
      ElMessage.error(`文件大小不能超过${byteTransform(limitSize)}`);
      return false;
    }
  }

  return true;
};

const fileList = ref<FileItem[]>(props.fileList || []);

const handleUpdateFileList = (newVal: FileItem[]) => {
  fileList.value = newVal;
  emit(UPDATE_FILE_LIST_EVENT, newVal);
};

watch(
  () => props.fileList,
  (newValue) => {
    fileList.value = newValue || [];
  },
);

const getCurrentValue = (files: FileItem[]) => {
  const ids = files
    .filter((f) => f.status === "success")
    .map((f) => f.id || (f.response as UploadResponseData)?.id);
  const value = uploadProps.value.limit === 1 ? ids[0] : ids.join(",");
  return value ?? "";
};

const handleSuccess = (_response, _uploadFile, uploadFiles: UploadFiles) => {
  emit(UPDATE_MODEL_EVENT, getCurrentValue(uploadFiles as FileItem[]));
};

const handleError = () => {
  emit(UPDATE_MODEL_EVENT, getCurrentValue(fileList.value));
};

const handleRemove = (_uploadFile, uploadFiles: UploadFiles) => {
  emit(UPDATE_MODEL_EVENT, getCurrentValue(uploadFiles as FileItem[]));
};

const uploadRef = ref<UploadInstance>();
const handleExceed = (files: File[]) => {
  if (uploadProps.value.limit === 1 && uploadRef.value) {
    uploadRef.value.clearFiles();
    uploadRef.value.handleStart(files[0] as UploadRawFile);
    uploadRef.value.submit();
  } else {
    ElMessage.error(`文件上传数量最多 ${uploadProps.value.limit} 个`);
  }
};

function handleHttpRequest(options: UploadRequestOptions) {
  return new Promise((resolve, reject) => {
    return uploadApi(options.file)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function handlePreview(uploadFile: UploadFile) {
  window.open(uploadFile.url);
}
</script>

<style lang="scss" scoped>
.disabled :deep(.el-upload--picture-card) {
  display: none;
}
</style>
