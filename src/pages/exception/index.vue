<template>
  <page>
    <search-form
      :form-props="{ model: searchParams }"
      @search="handleSearch"
      @reset="handleReset"
    >
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="searchParams.keyword"
          clearable
          placeholder="错误信息 / 文件 / URL"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="时间" prop="date_range">
        <el-date-picker
          v-model="searchParams.date_range"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="w-full!"
        />
      </el-form-item>
    </search-form>

    <pro-table
      ref="tableRef"
      :request="getExceptionPaginationApi"
      :table-props="{ rowKey: 'id' }"
    >
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column label="请求" min-width="260" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="flex items-center gap-x-2">
            <el-tag effect="plain" :type="getMethodTagType(row.request_method)">
              {{ row.request_method }}
            </el-tag>
            <span class="truncate">{{ row.request_url }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="错误信息" min-width="260" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="font-medium">{{ row.issue }}</div>
          <div class="text-info mt-1 text-xs">
            {{ row.file }}:{{ row.line }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="request_ip" label="请求 IP" width="150" />
      <el-table-column prop="request_time" label="请求时间" width="180" />
      <el-table-column label="操作" fixed="right" width="140">
        <template #default="{ row }">
          <action-group>
            <action-item>
              <el-button link type="primary" @click="handleDetail(row.id)">
                详情
              </el-button>
            </action-item>
            <action-item>
              <el-button link type="danger" @click="handleDelete(row.id)">
                删除
              </el-button>
            </action-item>
          </action-group>
        </template>
      </el-table-column>
    </pro-table>

    <el-drawer v-model="detailVisible" title="错误日志详情" size="50%">
      <el-descriptions
        v-if="detail"
        :column="1"
        :border="true"
        :label-width="110"
      >
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="错误码">
          {{ detail.error_code }}
        </el-descriptions-item>
        <el-descriptions-item label="错误信息">
          {{ detail.issue }}
        </el-descriptions-item>
        <el-descriptions-item label="文件位置">
          {{ detail.file }}:{{ detail.line }}
        </el-descriptions-item>
        <el-descriptions-item label="请求地址">
          {{ detail.request_url }}
        </el-descriptions-item>
        <el-descriptions-item label="请求方式">
          {{ detail.request_method }}
        </el-descriptions-item>
        <el-descriptions-item label="请求 IP">
          {{ detail.request_ip }}
        </el-descriptions-item>
        <el-descriptions-item label="请求时间">
          {{ detail.request_time }}
        </el-descriptions-item>
        <el-descriptions-item label="记录时间">
          {{ detail.create_time }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </page>
</template>

<script setup lang="ts">
import {
  deleteExceptionApi,
  getExceptionDetailApi,
  getExceptionPaginationApi,
  type ExceptionLog,
} from "@/api/exception";
import type { ProTableInstance } from "@/components/ProTable/type";
import { ElMessageBox } from "element-plus";

const tableRef = ref<ProTableInstance>();

const searchParams = reactive({
  keyword: "",
  date_range: [] as string[],
});

const detailVisible = ref(false);
const detail = ref<ExceptionLog>();

const getSearchParams = () => ({
  keyword: searchParams.keyword,
  date_range: searchParams.date_range,
});

const handleSearch = () => {
  tableRef.value?.search(getSearchParams());
};

const handleReset = () => {
  searchParams.keyword = "";
  searchParams.date_range = [];
  tableRef.value?.reset();
};

const handleDetail = (id: number) => {
  getExceptionDetailApi(id).then((res) => {
    detail.value = res;
    detailVisible.value = true;
  });
};

const handleDelete = (id: number) => {
  ElMessageBox.confirm("确定要删除该错误日志吗？", {
    type: "warning",
  })
    .then(() => deleteExceptionApi(id))
    .then(() => tableRef.value?.refresh());
};

const getMethodTagType = (method: string) => {
  const map: Record<
    string,
    "primary" | "success" | "warning" | "danger" | "info"
  > = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    DELETE: "danger",
  };
  return map[method] || "info";
};
</script>
