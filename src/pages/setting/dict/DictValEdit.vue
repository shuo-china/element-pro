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
import { getDictValueDetailApi, updateDictValueApi } from "@/api/dict";
import { ElMessage, type FormRules } from "element-plus";

const emit = defineEmits(["updated"]);

const id = defineModel("id", { type: Number, default: 0 });

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

const formRef = ref();
const formData = ref({
  dict_key: "",
  dict_value: "",
  status: true,
});

const rules: FormRules = {
  dict_key: [{ required: true, message: "请填写键" }],
  dict_value: [{ required: true, message: "请填写值" }],
};

const setInitialValues = (id: number) => {
  if (!id) {
    return;
  }
  formRef.value.loading = true;
  getDictValueDetailApi(id).then((res) => {
    formRef.value.loading = false;
    formData.value = {
      dict_key: res.dict_key,
      dict_value: res.dict_value,
      status: res.status === 1,
    };
  });
};
watch(id, setInitialValues);

const handleSubmit = (cb) => {
  updateDictValueApi({
    id: id.value,
    ...formData.value,
    status: formData.value.status ? 1 : 0,
  })
    .then(() => {
      ElMessage.success("提交成功");
      emit("updated");
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};
</script>
