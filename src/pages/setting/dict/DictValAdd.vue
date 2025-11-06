<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    @submit="handleSubmit"
  >
    <el-form-item label="键" prop="dict_key">
      <el-input v-model="formData.dict_key"></el-input>
    </el-form-item>
    <el-form-item label="值" prop="dict_value">
      <el-input v-model="formData.dict_value"></el-input>
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
import { createDictValueApi } from "@/api/dict";

const props = defineProps(["dictId"]);

const emit = defineEmits(["created"]);

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  dict_key: "",
  dict_value: "",
  status: true,
});

const rules: FormRules = {
  dict_key: [{ required: true, message: "请填写键" }],
  dict_value: [{ required: true, message: "请填写值" }],
};

const handleSubmit = (cb) => {
  createDictValueApi({
    dict_id: props.dictId,
    ...formData.value,
  })
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
