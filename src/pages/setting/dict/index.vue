<template>
  <div class="flex h-full gap-x-6">
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
          @click="dictAddVisible = true"
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
              @click.stop="dictEditId = item.id"
            ></el-button>
            <el-popconfirm
              title="确定删除吗?"
              @confirm="handleDeleteDict(item.id)"
            >
              <template #reference>
                <el-button size="small" icon="Delete" @click.stop></el-button>
              </template>
            </el-popconfirm>
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
            @click="dictValEditId = item.id"
          >
            <span>{{ item.dict_key }}</span>
            <el-divider direction="vertical" />
            <span>{{ item.dict_value }}</span>
          </el-tag>
          <el-button
            plain
            class="border-dashed"
            icon="Plus"
            @click="dictValVisible = true"
            >添加字典值</el-button
          >
        </div>
      </el-card>
    </div>
    <dict-add v-model:visible="dictAddVisible" @created="refreshDictList" />
    <dict-edit v-model:id="dictEditId" @updated="refreshDictList" />
    <dict-val-add
      :dict-id="activeDictId"
      v-model:visible="dictValVisible"
      @created="refreshDictValueList"
    />
    <dict-val-edit v-model:id="dictValEditId" @updated="refreshDictValueList" />
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
import DictAdd from "./DictAdd.vue";
import DictEdit from "./DictEdit.vue";
import DictValAdd from "./DictValAdd.vue";
import DictValEdit from "./DictValEdit.vue";

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

const dictAddVisible = ref(false);
const dictEditId = ref(0);

const dictValVisible = ref(false);
const dictValEditId = ref(0);

const handleDeleteDict = (id: number) => {
  deleteDictApi(id).then(() => refreshDictList());
};

const handleDeleteDictValue = (id: number) => {
  deleteDictValueApi(id).then(() => refreshDictValueList());
};
</script>
