<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    size="large"
    @keyup.enter="handleSubmit"
  >
    <el-form-item prop="username">
      <el-input
        v-model="formData.username"
        placeholder="用户名"
        prefix-icon="User"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="formData.password"
        placeholder="密码"
        prefix-icon="Lock"
        show-password
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="w-full"
        size="large"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useManagerStore } from "@/store/manager";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

const managerStore = useManagerStore();
const router = useRouter();

const loading = ref(false);
const formRef = ref<FormInstance>();

const formData = reactive({
  username: "",
  password: "",
});

const rules: FormRules<typeof formData> = {
  username: {
    required: true,
    message: "请输入用户名",
  },
  password: {
    required: true,
    message: "请输入密码",
  },
};

const handleSubmit = () => {
  if (!formRef.value) return;

  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      managerStore
        .getAccessToken("password", {
          username: formData.username,
          password: formData.password,
        })
        .then(() => {
          router.push("/").then(() => {
            ElMessage.success("登录成功");
          });
        })
        .catch(() => {
          loading.value = false;
        });
    }
  });
};
</script>
