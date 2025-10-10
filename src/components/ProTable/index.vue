<template>
  <el-table
    ref="_ref"
    v-loading="loading"
    :data="data"
    size="large"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"></slot>
    </template>
  </el-table>
  <div class="mt-4 flex justify-end">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      v-bind="paginationProps"
    />
  </div>
</template>

<script setup lang="ts">
import type { PaginationProps, TableInstance } from "element-plus";
import usePagination from "@/hooks/usePagination";
import { proTableProps, type ProTableProps } from "./props";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps(proTableProps as ProTableProps);

const defaultPaginationProps: Partial<PaginationProps> = {
  layout: "prev, pager, next, sizes, total",
  background: true,
};

const paginationProps = computed(() =>
  Object.assign({}, defaultPaginationProps, props.paginationProps),
);

const { data, loading, currentPage, pageSize, total, search, reset, refresh } =
  usePagination(props.request, props.requestOptions);

const _ref = ref();

const _expose = {
  search,
  reset,
  refresh,
  getInstance: () => _ref.value as TableInstance,
};

defineExpose(_expose);

export type ProTableInstance = typeof _expose;
</script>
