<template>
  <dialog-form
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined"
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
import {
  createDictValueApi,
  getDictValueDetailApi,
  updateDictValueApi,
} from "@/api/dict";
import { ElMessage, type FormRules } from "element-plus";

const emit = defineEmits(["created", "updated", "finished"]);

const props = defineProps<{
  mode: "create" | "update";
  id?: number;
  dictId?: number;
}>();

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

const getDetailInfo = async (params) =>
  getDictValueDetailApi(params).then((res) => ({
    dict_key: res.dict_key,
    dict_value: res.dict_value,
    status: res.status === 1,
  }));

const handleSubmit = (cb) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb) => {
  createDictValueApi({
    dict_id: props.dictId,
    ...formData.value,
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
  updateDictValueApi({
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
