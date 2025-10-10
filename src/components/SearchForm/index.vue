<template>
  <div class="mb-4">
    <el-form ref="formRef" label-suffix=":" v-bind="$attrs">
      <el-row :gutter="36" class="gap-y-6">
        <el-col
          v-for="(vnode, index) in $slots.default?.()"
          v-bind="span"
          :class="isCollapse && index >= collapsedMaxCount ? 'hidden!' : ''"
        >
          <component :is="vnode" />
        </el-col>
        <div class="flex flex-1 items-center justify-end px-3">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <div
            v-if="showCollapseBtn"
            class="ml-3 cursor-pointer text-sm text-[var(--el-color-primary)]"
            @click="toggleCollapse()"
          >
            <template v-if="isCollapse">
              展开
              <el-icon>
                <arrow-down />
              </el-icon>
            </template>
            <template v-else>
              收起
              <el-icon>
                <arrow-up />
              </el-icon>
            </template>
          </div>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { breakpointsElement } from "@vueuse/core";
import type { FormInstance } from "element-plus";

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits(["search", "reset"]);

const span = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 6,
};

const formRef = ref<FormInstance>();
const breakpoints = useBreakpoints(breakpointsElement);
const active = breakpoints.active();

const [isCollapse, toggleCollapse] = useToggle(true);
const collapsedMaxCount = computed(() => {
  const colCount = 24 / span[active.value];
  return colCount <= 1 ? 1 : colCount - 1;
});
const showCollapseBtn = computed(() =>
  (formRef.value?.fields.length || 0) > collapsedMaxCount.value ? true : false,
);

const handleSearch = () => {
  emit("search");
};

const handleReset = () => {
  formRef.value?.resetFields();
  emit("reset");
};
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
