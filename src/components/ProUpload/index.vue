<template>
  <el-upload
    ref="uploadRef"
    :multiple="multiple"
    :file-list="fileList"
    :class="{
      disabled: fileList.length >= uploadProps.limit!,
      empty: fileList.length === 0,
    }"
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
      <el-icon v-if="type === 'image'" :size="26"><Plus /></el-icon>
      <el-button v-else icon="Upload">上传</el-button>
    </template>
    <template #tip v-if="showTip">
      <div class="mt-1.5 text-xs text-black/50">
        <span>{{ limitSizeTip }}</span>
        <span v-if="limitSizeTip && limitExtTip">，</span>
        <span>{{ limitExtTip }}</span>
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
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
import { uploadApi, type UploadResponseData } from "@/api/file";
import { useConfigStore } from "@/store/config";

type FileItem = UploadUserFile & { key: string; path?: string };

const emit = defineEmits(["update:modelValue", "update:file-list", "change"]);

const configStore = useConfigStore();
const { config } = storeToRefs(configStore);

const props = withDefaults(
  defineProps<{
    type?: "image" | "file";
    modelValue?: string;
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
  ...config.value?.upload[props.type],
  ...props.config,
}));

const multiple = computed(() => (uploadProps.value.limit === 1 ? false : true));

const limitExt = computed(() => {
  let ext = uploadConfig.value.limitExt || [];
  if (typeof ext === "string") {
    ext = ext ? (ext as string).split(",").map((e) => e.toLowerCase()) : [];
  }
  return ext;
});

const limitExtTip = computed(() => {
  if (limitExt.value.length) {
    return `支持${limitExt.value.join("、")}格式`;
  }
  return "";
});

const limitSizeTip = computed(() => {
  if (uploadConfig.value.limitSize) {
    return `大小不超过：${byteTransform(uploadConfig.value.limitSize)}`;
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
      ElMessage.error(
        `文件格式不正确，当前支持格式：${limitExtArr.join("，")}`,
      );
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

const transformFileList = (files: FileItem[]) => {
  if (!Array.isArray(files)) {
    return [];
  }
  files.forEach((file) => {
    if (!file.url && file.path) {
      file.url = file.path;
    }
  });
  return files;
};

const fileList = ref<FileItem[]>(transformFileList(props.fileList) || []);

const handleUpdateFileList = (newVal: FileItem[]) => {
  fileList.value = newVal;
  emit("update:file-list", newVal);
};

watch(
  () => props.fileList,
  (newValue) => {
    fileList.value = transformFileList(newValue) || [];
  },
);

const getCurrentValue = (files: FileItem[]) => {
  const keys = files
    .filter((f) => f.status === "success")
    .map((f) => f.key || (f.response as UploadResponseData)?.key);
  const value = uploadProps.value.limit === 1 ? keys[0] : keys.join(",");
  return value ?? "";
};

const handleSuccess = (_response, _uploadFile, uploadFiles: UploadFiles) => {
  const value = getCurrentValue(uploadFiles as FileItem[]);
  if (value !== props.modelValue) {
    emit("update:modelValue", value);
    emit("change", value);
  }
};

const handleError = () => {
  const value = getCurrentValue(fileList.value);
  if (value !== props.modelValue) {
    emit("update:modelValue", value);
    emit("change", value);
  }
};

const handleRemove = (_uploadFile, uploadFiles: UploadFiles) => {
  const value = getCurrentValue(uploadFiles as FileItem[]);
  if (value !== props.modelValue) {
    emit("update:modelValue", value);
    emit("change", value);
  }
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

.empty :deep(.el-upload-list) {
  margin-top: 0;
}

:deep(.el-upload-list .el-upload-list__item:last-child) {
  margin-bottom: 0;
}

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 120px;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 120px;
}
</style>
