<template>
  <el-table ref="_ref" v-loading="loading" :data="data" v-bind="tableProps">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"></slot>
    </template>
  </el-table>
  <div class="mt-4 flex justify-end">
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
      v-bind="paginationProps" />
  </div>
</template>

<script setup lang="ts">
import type { PaginationProps, TableInstance, TableProps } from "element-plus";
import usePagination, { type PaginationOptions } from "@/hooks/usePagination";
import type { Service } from "@/hooks/useRequest/type";

const props = withDefaults(
  defineProps<{
    request: Service<any, any>;
    requestOptions?: PaginationOptions;
    tableProps?: Partial<TableProps<any>>;
    paginationProps?: Partial<PaginationProps>;
  }>(),
  {
    requestOptions: () => ({}),
    tableProps: () => ({}),
    paginationProps: () => ({}),
  },
);

const defaultTableProps: Partial<TableProps<any>> = {
  size: "large",
  headerCellClassName: "bg-[#f5f7fa] text-[var(--el-text-color-regular)]",
};

const tableProps = computed(() =>
  Object.assign({}, defaultTableProps, props.tableProps),
);

const defaultPaginationProps: Partial<PaginationProps> = {
  layout: "prev, pager, next, sizes, total",
  background: true,
  pageSizes: [10, 15, 20, 30, 50, 100],
};

const paginationProps = computed(() =>
  Object.assign({}, defaultPaginationProps, props.paginationProps),
);

const { data, loading, currentPage, pageSize, total, search, reset, refresh } =
  usePagination(props.request, props.requestOptions);

const _ref = ref();

const _expose = {
  currentPage,
  search,
  reset,
  refresh,
  getInstance: () => _ref.value as TableInstance,
};

defineExpose(_expose);
</script>
