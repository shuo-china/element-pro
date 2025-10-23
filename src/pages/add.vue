<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    @submit="handleSubmit"
  >
    <el-form-item label="配置类型" prop="type">
      <el-select v-model="formData.type">
        <el-select-option value="text">单行文本</el-select-option>
      </el-select>
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import { ElMessage, type FormRules } from "element-plus";

const id = defineModel("id", { type: Number, default: 0 });
const formRef = ref();
const formData = ref({
  type: "",
});

const visible = computed({
  get: () => {
    return !!id.value;
  },
  set: (val) => {
    if (!val) {
      id.value = 0;
    }
  },
});

const rules: FormRules = {
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
};

const setInitialValues = (id: number) => {
  if (!id) {
    return;
  }
  formRef.value.loading = true;
  setTimeout(() => {
    formRef.value.loading = false;
  }, 1000);
};
watch(id, setInitialValues);

const handleSubmit = (cb) => {
  setTimeout(() => {
    ElMessage.success("提交成功");
    cb(true);
  }, 1000);
};
</script>
