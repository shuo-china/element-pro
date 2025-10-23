<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
    @submit="handleSubmit"
  >
    <el-form-item label="类型" prop="type">
      <el-select v-model="formData.type" @change="handleTypeChange">
        <el-option value="text" label="单行文本" />
        <el-option value="textarea" label="多行文本" />
        <el-option value="select" label="下拉框" />
        <el-option value="switch" label="开关" />
        <el-option value="tags" label="标签" />
        <el-option value="number" label="数字" />
        <el-option value="file" label="单个文件" />
        <el-option value="files" label="多个文件" />
        <el-option value="image" label="单张图片" />
        <el-option value="images" label="多张图片" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="formData.type === 'select'"
      prop="options"
      label="下拉框选项"
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
import { createConfigApi } from "@/api/config";
import { ElMessage, type FormRules } from "element-plus";
import { transformSubmitOptions } from "./shared";
import _ from "lodash";

const emit = defineEmits(["created"]);

const visible = defineModel("visible", { type: Boolean, default: false });

const props = defineProps<{ groupName?: string }>();

const formRef = ref();
const formData = ref({
  type: "",
  title: "",
  name: "",
  tips: "",
  options: [] as Option[],
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
  if (type === "select") {
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

const handleSubmit = (cb) => {
  createConfigApi({
    ...formData.value,
    group: props.groupName,
    options: transformSubmitOptions(formData.value.options),
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
