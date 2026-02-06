<template>
  <div class="flex h-full gap-x-6 p-6">
    <el-card class="flex-1 overflow-auto" body-class="flex flex-wrap gap-6 content-start" shadow="never">
      <div class="min-h-25 max-w-full">
        <el-button size="large" icon="Plus" plain class="h-full max-w-full w-85 border-dashed"
          @click="handleCreateDict">添加字典</el-button>
      </div>
      <el-card v-for="item in dictTypeList" class="w-85 cursor-pointer"
        :class="activeDictTypeId === item.id ? 'border-primary bg-primary/10' : ''" shadow="hover" header-class="p-4"
        body-class="p-4" @click="activeDictTypeId = item.id">
        <template #header>
          <div class="flex gap-x-1">
            <div class="flex flex-1 items-center overflow-hidden">
              <div class="truncate">{{ item.name }}</div>
            </div>
            <el-tag v-if="item.status === 1" type="primary">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
        <div class="flex items-center justify-between">
          <div class="text-info text-sm">{{ item.key }}</div>
          <div>
            <el-button size="small" icon="Edit" @click.stop="handleUpdateDict(item)"></el-button>
            <el-button size="small" icon="Delete" @click.stop="handleDeleteDict(item.id)"></el-button>
          </div>
        </div>
      </el-card>
    </el-card>
    <el-card class="basis-130 overflow-auto" shadow="never">
      <div v-if="activeDictTypeId" class="flex flex-wrap gap-4">
        <el-tag v-for="item in dictItemList" closable effect="plain" size="large"
          :type="item.status === 1 ? 'primary' : 'danger'" class="cursor-pointer" @close="handleDeleteDictItem(item.id)"
          @click="handleUpdateDictItem(item)">
          <span>{{ item.name }}</span>
          <el-divider direction="vertical" />
          <span>{{ item.value }}</span>
        </el-tag>
        <el-button plain class="border-dashed" icon="Plus" @click="handleCreateDictItem">添加字典值</el-button>
      </div>
    </el-card>
    <dict-type-form :mode="dictTypeMode" v-model:visible="dictTypeFormVisible" :id="dictTypeId"
      @finished="refreshDictTypeList" />
    <dict-item-form :type-id="activeDictTypeId" :mode="dictItemMode" v-model:visible="dictItemFormVisible"
      :id="dictItemId" @finished="refreshDictItemList" />
  </div>
</template>

<script setup lang="ts">
import {
  getDictTypeListApi,
  deleteDictTypeApi
} from "@/api/dict_type";
import {
  getDictItemListApi,
  deleteDictItemApi
} from '@/api/dict_item'
import useRequest from "@/hooks/useRequest";
import DictTypeForm from "./DictTypeForm.vue";
import DictItemForm from "./DictItemForm.vue";
import { ElMessageBox } from "element-plus";

const { data: dictTypeList, refresh: refreshDictTypeList } = useRequest(getDictTypeListApi);
const {
  run,
  data: dictItemList,
  refresh: refreshDictItemList,
} = useRequest(getDictItemListApi, {
  manual: true,
});

const activeDictTypeId = ref();

watch(activeDictTypeId, (v) => {
  run({
    type_id: v,
  });
});

const dictTypeFormVisible = ref(false);
const dictTypeId = ref<number>();
const dictTypeMode = ref<"create" | "update">("create");

const handleCreateDict = () => {
  dictTypeMode.value = "create";
  dictTypeId.value = undefined;
  dictTypeFormVisible.value = true;
};

const handleUpdateDict = (item) => {
  dictTypeMode.value = "update";
  dictTypeId.value = item.id;
  dictTypeFormVisible.value = true;
};

const handleDeleteDict = (id: number) => {
  ElMessageBox.confirm("确定要删除吗？", {
    type: "warning",
  })
    .then(() => {
      return deleteDictTypeApi(id);
    })
    .then(() => {
      refreshDictTypeList();
    });
};

const dictItemFormVisible = ref(false);
const dictItemId = ref<number>();
const dictItemMode = ref<"create" | "update">("create");

const handleCreateDictItem = () => {
  dictItemMode.value = "create";
  dictItemId.value = undefined;
  dictItemFormVisible.value = true;
};

const handleUpdateDictItem = (item) => {
  dictItemMode.value = "update";
  dictItemId.value = item.id;
  dictItemFormVisible.value = true;
};

const handleDeleteDictItem = (id: number) => {
  deleteDictItemApi(id).then(() => refreshDictItemList());
};
</script>
