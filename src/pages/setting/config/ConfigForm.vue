<template>
  <dialog-form
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined"
    @submit="handleSubmit"
  >
    <el-form-item label="类型" prop="type">
      <el-select
        v-model="formData.type"
        :loading="dictLoading"
        :options="dict.config_type"
        @change="handleTypeChange"
      >
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="formData.type === 'select' || formData.type === 'checkbox'"
      prop="options"
      label="选项"
      required
    >
      <el-table :data="formData.options" size="small">
        <el-table-column label="Label">
          <template #default="{ row }">
            <el-input v-model="row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Value">
          <template #default="{ row }">
            <el-input v-model="row.value"></el-input>
          </template>
        </el-table-column>
        <el-table-column :width="60">
          <template #default="{ $index }">
            <el-button
              size="small"
              v-show="formData.options.length > 1"
              icon="SemiSelect"
              circle
              @click="formData.options.splice($index, 1)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-button text bg class="mt-2 w-full" @click="handleAddSelectOption">
        新增一行
      </el-button>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="formData.title" />
    </el-form-item>
    <el-form-item label="键名" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="备注" prop="tips">
      <el-input type="textarea" v-model="formData.tips" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import {
  createConfigApi,
  getConfigDetailApi,
  updateConfigApi,
} from "@/api/config";
import { ElMessage, type FormRules } from "element-plus";
import { transformReceiveOptions, transformSubmitOptions } from "./shared";
import _ from "lodash";
import useDict from "@/hooks/useDict";

const emit = defineEmits(["created", "updated", "finished"]);

const props = defineProps<{
  mode: "create" | "update";
  id?: number;
  groupName?: string;
}>();

const { dict, dictLoading } = useDict("config_type");

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  type: "",
  title: "",
  name: "",
  tips: "",
  options: [] as OptionItem[],
});

const rules: FormRules = {
  type: [{ required: true, message: "请选择配置类型" }],
  options: [
    {
      validator: (_rule, value, callback) => {
        if (value.find((item) => !item.label || !item.value)) {
          callback(new Error("请输入完整的选项"));
        } else if (
          Object.values(_.countBy(value, "label")).some(
            (i) => (i as number) > 1,
          )
        ) {
          callback(new Error("含有重复的Label值"));
        } else if (
          Object.values(_.countBy(value, "value")).some(
            (i) => (i as number) > 1,
          )
        ) {
          callback(new Error("含有重复的Value值"));
        } else {
          callback();
        }
      },
    },
  ],
  title: [{ required: true, message: "请输入标题" }],
  name: [{ required: true, message: "请输入键名" }],
};

const handleTypeChange = (type) => {
  if (type === "select" || type === "checkbox") {
    if (formData.value.options.length === 0) {
      formData.value.options.push({
        label: "",
        value: "",
      });
    }
  } else {
    formData.value.options = [];
  }
};

const handleAddSelectOption = () => {
  formData.value.options.push({
    label: "",
    value: "",
  });
};

const getDetailInfo = async (params) =>
  getConfigDetailApi(params).then((res) => ({
    type: res.type,
    title: res.title,
    name: res.name,
    tips: res.tips,
    options: transformReceiveOptions(res.options),
  }));

const handleSubmit = (cb) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb) => {
  createConfigApi({
    ...formData.value,
    group: props.groupName,
    options: transformSubmitOptions(formData.value.options),
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
  updateConfigApi(props.id!, {
    ...formData.value,
    options: transformSubmitOptions(formData.value.options),
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
