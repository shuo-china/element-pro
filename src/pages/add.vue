<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    @submit="handleSubmit"
  >
    <el-form-item label="姓名" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import { ElMessage, type FormRules } from "element-plus";

const id = defineModel("id", { type: Number, default: 0 });
const formRef = ref();

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

const formData = ref({
  name: "",
});

const rules: FormRules = {
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
};

const getInitialValues = () => {
  formRef.value.loading = true;
  setTimeout(() => {
    formRef.value.loading = false;
    formData.value = {
      name: "张三",
    };
  }, 1000);
};
watch(id, getInitialValues);

const handleSubmit = (cb) => {
  setTimeout(() => {
    ElMessage.success("提交成功");
    cb(true);
  }, 1000);
};
</script>
