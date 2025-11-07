<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    @submit="handleSubmit"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="formData.password" />
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="formData.mobile" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import { createManagerApi } from "@/api/manager";
import { ElMessage, type FormRules } from "element-plus";
import { mobileRule } from "@/utils/rules";
import useRequest from "@/hooks/useRequest";
import { getRoleOptionsApi } from "@/api/role";

const props = withDefaults(
  defineProps<{
    mode?: "update" | "create";
    id?: number;
  }>(),
  {
    mode: "create",
  },
);

const emit = defineEmits(["created"]);

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  username: "",
  password: "",
  mobile: "",
});

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名" }],
  password: [{ required: true, message: "请输入密码" }],
  mobile: [mobileRule],
};

const handleSubmit = (cb) => {
  createManagerApi(formData.value)
    .then(() => {
      ElMessage.success("提交成功");
      emit("created");
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};

const { loading: roleOptionsLoading } = useRequest(getRoleOptionsApi);
</script>
