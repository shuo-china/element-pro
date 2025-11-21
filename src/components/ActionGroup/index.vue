<template>
  <div class="flex items-center">
    <template v-for="(node, index) in visibleNodes" :key="index">
      <component :is="node" />
      <el-divider
        v-if="index < visibleNodes.length - 1 || dropdownNodes.length > 0"
        direction="vertical"
      />
    </template>
    <!-- 更多 -->
    <el-dropdown v-if="dropdownNodes.length > 0">
      <el-button link type="primary" class="outline-none">
        更多<el-icon><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <component
            v-for="(node, index) in dropdownNodes"
            :key="index"
            :is="node"
          />
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { Fragment, isVNode, cloneVNode } from "vue";

const props = defineProps({
  max: { type: Number, default: 3 },
});

const slots = useSlots();

const getValidNodes = (nodes: VNode[]): VNode[] => {
  let result: VNode[] = [];

  nodes.forEach((node) => {
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...getValidNodes(node.children as VNode[]));
      return;
    }

    if (!isVNode(node)) {
      return;
    }

    const componentType = node.type as any;
    if (
      typeof componentType === "object" &&
      componentType.name === "ActionItem"
    ) {
      result.push(node);
    }
  });

  return result;
};

const allNodes = computed(() => {
  if (!slots.default) return [];
  return getValidNodes(slots.default());
});

const visibleNodes = computed(() => {
  const nodes = allNodes.value;
  if (nodes.length <= props.max) {
    return nodes.map((node) => cloneVNode(node, { _isDropdown: false }));
  }
  return nodes
    .slice(0, props.max - 1)
    .map((node) => cloneVNode(node, { _isDropdown: false }));
});

const dropdownNodes = computed(() => {
  const nodes = allNodes.value;
  if (nodes.length <= props.max) return [];
  return nodes
    .slice(props.max - 1)
    .map((node) => cloneVNode(node, { _isDropdown: true }));
});
</script>
