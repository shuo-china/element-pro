<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    @submit="handleSubmit"
  >
    <el-form-item label="字典名称" prop="dict_name">
      <el-input v-model="formData.dict_name"></el-input>
    </el-form-item>
    <el-form-item label="字典key" prop="dict_type">
      <el-input v-model="formData.dict_type"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch
        v-model="formData.status"
        inline-prompt
        active-text="启用"
        inactive-text="禁用"
      />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import { ElMessage, type FormRules } from "element-plus";
import { createDictApi } from "@/api/dict";

const emit = defineEmits(["created"]);

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  dict_name: "",
  dict_type: "",
  status: true,
});

const rules: FormRules = {
  dict_name: [{ required: true, message: "请填写字典名称" }],
  dict_type: [{ required: true, message: "请填写字典key" }],
};

const handleSubmit = (cb) => {
  createDictApi(formData.value)
    .then(() => {
      ElMessage.success("提交成功");
      emit("created");
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};
</script>
