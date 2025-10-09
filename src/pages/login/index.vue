<template>
  <div
    class="flex h-full flex-col"
    :style="{ backgroundImage: `url(${bg})`, backgroundSize: '100% 100%' }"
  >
    <div class="flex-1 py-8">
      <div class="flex flex-col px-8 py-6">
        <div class="text-center">
          <div class="flex items-center justify-center">
            <img
              class="w-11"
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
              alt="logo"
            />
            <span class="ml-4 text-3xl font-bold">Element Pro</span>
          </div>
          <div class="mt-3 mb-10 text-sm text-black/50">
            Element Pro 中后台前端/设计解决方案
          </div>
        </div>
        <div class="mx-auto w-80 max-w-[75vw]">
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
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import bg from "@/assets/bg.png";

const userStore = useUserStore();
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
      userStore
        .getAccessToken(formData)
        .then(() => {
          ElMessage.success("登录成功");
          router.push("/");
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>
