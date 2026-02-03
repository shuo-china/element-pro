<template>
  <dialog-form v-model:visible="visible" :form-props="{ model: formData, rules }" :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined" @submit="handleSubmit">
    <el-form-item label="类型" prop="type">
      <el-select v-model="formData.type" :loading="typeOptionsLoading" :options="typeOptions"
        @change="handleTypeChange">
      </el-select>
    </el-form-item>
    <el-form-item v-if="formData.type === 'select' || formData.type === 'checkbox'" prop="options" label="选项" required>
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
            <el-button size="small" v-show="formData.options.length > 1" icon="SemiSelect" circle
              @click="formData.options.splice($index, 1)" />
          </template>
        </el-table-column>
      </el-table>
      <el-button text bg class="mt-2 w-full" @click="handleAddSelectOption">
        新增一行
      </el-button>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="键" prop="key">
      <el-input v-model="formData.key" />
    </el-form-item>
    <el-form-item label="备注" prop="desc">
      <el-input type="textarea" v-model="formData.desc" />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import {
  createConfigItemApi,
  getConfigItemDetailApi,
  getConfigItemTypeOptionsApi,
  updateConfigItemApi,
} from "@/api/config_item";
import { ElMessage, type FormRules } from "element-plus";
import _ from "lodash";
import useRequest from "@/hooks/useRequest";

const emit = defineEmits(["created", "updated", "finished"]);

const props = defineProps<{
  mode: "create" | "update";
  id?: number;
  groupId?: number;
}>();

const { loading: typeOptionsLoading, data: typeOptions } = useRequest(getConfigItemTypeOptionsApi)

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  type: "",
  name: "",
  key: "",
  desc: "",
  options: [] as OptionItem[],
});

const rules: FormRules = {
  type: [{ required: true, message: "请选择配置项类型" }],
  name: [{ required: true, message: "请输入配置项名称" }],
  key: [{ required: true, message: "请输入配置项键" }],
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
  getConfigItemDetailApi(params).then((res) => ({
    type: res.type,
    name: res.name,
    key: res.key,
    desc: res.desc,
    options: res.options,
  }));

const handleSubmit = (cb) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb) => {
  createConfigItemApi({
    ...formData.value,
    group_id: props.groupId,
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
  updateConfigItemApi({
    ...formData.value,
    id: props.id,
    group_id: props.groupId,
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
