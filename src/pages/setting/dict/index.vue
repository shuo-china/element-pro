<template>
  <div class="flex h-full gap-x-6 p-6">
    <el-card
      class="flex-1 overflow-auto"
      body-class="flex flex-wrap gap-6"
      shadow="never"
    >
      <div class="min-h-25">
        <el-button
          size="large"
          icon="Plus"
          plain
          class="h-full w-85 border-dashed"
          @click="handleCreateDict"
          >添加字典</el-button
        >
      </div>
      <el-card
        v-for="item in dictList"
        class="w-85 cursor-pointer"
        :class="activeDictId === item.id ? 'border-primary bg-primary/10' : ''"
        shadow="hover"
        header-class="p-4"
        body-class="p-4"
        @click="activeDictId = item.id"
      >
        <template #header>
          <div class="flex gap-x-1">
            <div class="flex flex-1 items-center overflow-hidden">
              <div class="truncate">{{ item.dict_name }}</div>
            </div>
            <el-tag v-if="item.status === 1" type="primary">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
        <div class="flex items-center justify-between">
          <div class="text-info text-sm">{{ item.dict_type }}</div>
          <div>
            <el-button
              size="small"
              icon="Edit"
              @click.stop="handleUpdateDict(item)"
            ></el-button>
            <el-button
              size="small"
              icon="Delete"
              @click.stop="handleDeleteDict(item.id)"
            ></el-button>
          </div>
        </div>
      </el-card>
    </el-card>
    <div shadow="never" class="basis-130">
      <el-card shadow="never" class="max-h-full overflow-auto">
        <div class="flex flex-wrap gap-4">
          <el-tag
            v-for="item in dictValueList"
            closable
            effect="plain"
            size="large"
            :type="item.status === 1 ? 'primary' : 'danger'"
            class="cursor-pointer"
            @close="handleDeleteDictValue(item.id)"
            @click="handleUpdateDictVal(item)"
          >
            <span>{{ item.dict_key }}</span>
            <el-divider direction="vertical" />
            <span>{{ item.dict_value }}</span>
          </el-tag>
          <el-button
            plain
            class="border-dashed"
            icon="Plus"
            @click="handleCreateDictVal"
            >添加字典值</el-button
          >
        </div>
      </el-card>
    </div>
    <dict-form
      :mode="dictMode"
      v-model:visible="dictFormVisible"
      :id="dictId"
      @finished="refreshDictList"
    />
    <dict-val-form
      :dict-id="activeDictId"
      :mode="dictValMode"
      v-model:visible="dictValFormVisible"
      :id="dictValId"
      @finished="refreshDictValueList"
    />
  </div>
</template>

<script setup lang="ts">
import {
  getDictListApi,
  getDictValueListApi,
  deleteDictApi,
  deleteDictValueApi,
} from "@/api/dict";
import useRequest from "@/hooks/useRequest";
import DictForm from "./DictForm.vue";
import DictValForm from "./DictValForm.vue";
import { ElMessageBox } from "element-plus";

const { data: dictList, refresh: refreshDictList } = useRequest(getDictListApi);
const {
  run,
  data: dictValueList,
  refresh: refreshDictValueList,
} = useRequest(getDictValueListApi, {
  manual: true,
});

const activeDictId = ref(0);

watch(activeDictId, (v) => {
  run({
    dict_id: v,
  });
});

const dictFormVisible = ref(false);
const dictId = ref<number>();
const dictMode = ref<"create" | "update">("create");

const handleCreateDict = () => {
  dictMode.value = "create";
  dictId.value = undefined;
  dictFormVisible.value = true;
};

const handleUpdateDict = (item) => {
  dictMode.value = "update";
  dictId.value = item.id;
  dictFormVisible.value = true;
};

const handleDeleteDict = (id: number) => {
  ElMessageBox.confirm("确定要删除吗？", {
    type: "warning",
  })
    .then(() => {
      return deleteDictApi(id);
    })
    .then(() => {
      refreshDictList();
    });
};

const dictValFormVisible = ref(false);
const dictValId = ref<number>();
const dictValMode = ref<"create" | "update">("create");

const handleCreateDictVal = () => {
  dictValMode.value = "create";
  dictValId.value = undefined;
  dictValFormVisible.value = true;
};

const handleUpdateDictVal = (item) => {
  dictValMode.value = "update";
  dictValId.value = item.id;
  dictValFormVisible.value = true;
};

const handleDeleteDictValue = (id: number) => {
  deleteDictValueApi(id).then(() => refreshDictValueList());
};
</script>
