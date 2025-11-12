<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined"
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
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="formData.nickname" />
    </el-form-item>
    <el-form-item label="角色" prop="role_ids">
      <el-checkbox-group v-model="formData.role_ids" :options="roleOptions" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import {
  createManagerApi,
  getManagerDetailApi,
  updateManagerApi,
} from "@/api/manager";
import { ElMessage, type FormRules } from "element-plus";
import { mobileRule } from "@/utils/rules";
import useRequest from "@/hooks/useRequest";
import { getRoleOptionsApi } from "@/api/role";

const emit = defineEmits(["created", "updated", "finished"]);

const props = defineProps<{
  mode: "create" | "update";
  id?: number;
}>();

const visible = defineModel("visible", { type: Boolean, default: false });

const { data: roleOptions } = useRequest(getRoleOptionsApi);

const formData = ref({
  username: "",
  password: "",
  mobile: "",
  nickname: "",
  role_ids: [],
});

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名" }],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (props.mode === "create") {
          if (!value) {
            return callback(new Error("请输入密码"));
          }
        }
        return callback();
      },
    },
  ],
  mobile: [mobileRule],
  nickname: [{ required: true, message: "请输入昵称" }],
};

const getDetailInfo = async (params) =>
  getManagerDetailApi(params).then((res) => ({
    username: res.username,
    mobile: res.mobile,
    nickname: res.nickname,
    role_ids: res.roles.map((item) => item.id),
  }));

const handleSubmit = (cb) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb) => {
  createManagerApi(formData.value)
    .then(() => {
      ElMessage.success("提交成功");
      emit("created");
      emit("finished");
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};

const handleUpdateSubmit = (cb) => {
  updateManagerApi(props.id!, formData.value)
    .then(() => {
      ElMessage.success("提交成功");
      emit("updated", props.id);
      emit("finished");
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};
</script>
