<template>
  <dialog-form
    ref="formRef"
    v-model:visible="visible"
    :form-props="{ model: formData, rules }"
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
import { getConfigDetailApi, updateConfigApi } from "@/api/config";
import { ElMessage, type FormRules } from "element-plus";
import { transformReceiveOptions, transformSubmitOptions } from "./shared";
import _ from "lodash";
import useDict from "@/hooks/useDict";

const { dict, dictLoading } = useDict("config_type");

const emit = defineEmits(["updated"]);

const id = defineModel("id", { type: Number, default: 0 });
const formRef = ref();
const formData = ref({
  type: "",
  title: "",
  name: "",
  tips: "",
  options: [] as Option[],
});

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

const rules: FormRules = {
  type: [{ required: true, message: "请选择配置类型" }],
  options: [
    {
      validator: (_rule, value, callback) => {
        console.log(value);
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

const setInitialValues = (id: number) => {
  if (!id) {
    return;
  }
  formRef.value.loading = true;
  getConfigDetailApi(id).then((res) => {
    formRef.value.loading = false;
    formData.value = {
      type: res.type,
      title: res.title,
      name: res.name,
      tips: res.tips,
      options: transformReceiveOptions(res.options),
    };
  });
};
watch(id, setInitialValues);

const handleSubmit = (cb) => {
  updateConfigApi(id.value, {
    ...formData.value,
    options: transformSubmitOptions(formData.value.options),
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
