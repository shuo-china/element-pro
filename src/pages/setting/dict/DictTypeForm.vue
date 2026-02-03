<template>
  <dialog-form v-model:visible="visible" :form-props="{ model: formData, rules }" :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined" @submit="handleSubmit">
    <el-form-item label="字典名称" prop="name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="字典key" prop="key">
      <el-input v-model="formData.key"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch v-model="formData.status" inline-prompt active-text="启用" inactive-text="禁用" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import { createDictTypeApi, getDictTypeDetailApi, updateDictTypeApi } from "@/api/dict_type";
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
  status: true,
});

const rules: FormRules = {
  name: [{ required: true, message: "请填写字典名称" }],
  key: [{ required: true, message: "请填写字典key" }],
};

const getDetailInfo = async (params) =>
  getDictTypeDetailApi(params).then((res) => ({
    name: res.name,
    key: res.key,
    status: res.status === 1,
  }));

const handleSubmit = (cb) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb) => {
  createDictTypeApi({
    ...formData.value,
    status: formData.value.status ? 1 : 0,
  })
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
  updateDictTypeApi({
    id: props.id,
    ...formData.value,
    status: formData.value.status ? 1 : 0,
  })
    .then(() => {
      ElMessage.success("提交成功");
      emit("updated");
      emit("finished");
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};
</script>
