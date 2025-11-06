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
import { getDictDetailApi, updateDictApi } from "@/api/dict";
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
  dict_name: "",
  dict_type: "",
  status: true,
});

const rules: FormRules = {
  dict_name: [{ required: true, message: "请填写字典名称" }],
  dict_type: [{ required: true, message: "请填写字典key" }],
};

const setInitialValues = (id: number) => {
  if (!id) {
    return;
  }
  formRef.value.loading = true;
  getDictDetailApi(id).then((res) => {
    formRef.value.loading = false;
    formData.value = {
      dict_name: res.dict_name,
      dict_type: res.dict_type,
      status: res.status === 1,
    };
  });
};
watch(id, setInitialValues);

const handleSubmit = (cb) => {
  updateDictApi({
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
