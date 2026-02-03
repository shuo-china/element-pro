<template>
  <dialog-form v-model:visible="visible" :form-props="{ model: formData, rules }" :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined" @submit="handleSubmit">
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="角色Key" prop="key">
      <el-input v-model="formData.key" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import {
  createRoleApi,
  getRoleDetailApi,
  updateRoleApi,
} from "@/api/role";
import { ElMessage, type FormRules } from "element-plus";

const emit = defineEmits(["created", "updated", "finished"]);

const props = defineProps<{
  mode: "create" | "update";
  id?: number;
}>();

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  name: "",
  key: "",
});

const rules: FormRules = {
  name: [{ required: true, message: "请输入角色名称" }],
  key: [{ required: true, message: "请输入角色Key" }],
};

const getDetailInfo = async (params) =>
  getRoleDetailApi(params).then((res) => ({
    name: res.name,
    key: res.key,
  }));

const handleSubmit = (cb) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb) => {
  createRoleApi(formData.value)
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
  updateRoleApi({
    ...formData.value,
    id: props.id,
  })
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
