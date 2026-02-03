<template>
  <dialog-form v-model:visible="visible" :form-props="{ model: formData, rules }" :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined" @submit="handleSubmit">
    <el-form-item label="配置组名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="配置组键" prop="key">
      <el-input v-model="formData.key" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import {
  createConfigGroupApi,
  getConfigGroupDetailApi,
  updateConfigGroupApi,
} from "@/api/config_group";
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
  name: [{ required: true, message: "请输入配置组名称" }],
  key: [{ required: true, message: "请输入配置组键" }],
};

const getDetailInfo = async (params) =>
  getConfigGroupDetailApi(params).then((res) => ({
    name: res.name,
    key: res.key,
  }));

const handleSubmit = (cb) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb) => {
  createConfigGroupApi(formData.value)
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
  updateConfigGroupApi({
    id: props.id,
    ...formData.value
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
