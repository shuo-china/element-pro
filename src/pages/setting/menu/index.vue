<template>
  <div class="menu-page flex h-full gap-x-3 bg-[#f4f6f9] p-3">
    <el-card
      class="menu-tree-panel w-150 min-w-100 overflow-hidden"
      body-class="flex h-full flex-col p-5"
      shadow="never"
    >
      <div class="mb-4 flex items-center justify-between gap-x-3">
        <el-dropdown trigger="hover" @command="handleAddCommand">
          <el-button type="primary" plain>
            添加菜单
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="root">添加顶级菜单</el-dropdown-item>
              <el-dropdown-item command="child" :disabled="!activeMenu">
                添加子菜单
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-tooltip
          :content="expanded ? '全部收起' : '全部展开'"
          placement="top"
        >
          <el-button
            circle
            plain
            :icon="expanded ? 'Fold' : 'Expand'"
            @click="toggleExpand"
          />
        </el-tooltip>
      </div>

      <el-scrollbar v-loading="treeLoading" class="min-h-0 flex-1">
        <el-empty
          v-if="!menuTree.length && !treeLoading"
          description="暂无菜单"
        />
        <el-tree
          v-else
          ref="treeRef"
          :data="menuTree"
          :default-expand-all="expanded"
          draggable
          :expand-on-click-node="false"
          :highlight-current="true"
          :indent="24"
          node-key="id"
          @node-click="handleSelectMenu"
          @node-drop="handleNodeDrop"
        >
          <template #default="{ data }">
            <div class="menu-tree-node">
              <el-icon v-if="data.icon" class="shrink-0 text-base">
                <component :is="getIconComponent(data.icon)" />
              </el-icon>
              <span class="truncate">{{ data.title }}</span>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </el-card>

    <el-card
      class="min-w-100 flex-1 overflow-hidden"
      body-class="flex h-full flex-col p-0"
      shadow="never"
    >
      <div
        class="flex h-12 items-center gap-x-2 border-b border-[#e5e7eb] px-4 text-sm text-[#111827]"
      >
        <span>{{ panelTitle }}</span>
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-4">
        <el-form
          ref="formRef"
          class="mx-auto max-w-[1080px]"
          label-width="96px"
          :model="formData"
          :rules="rules"
        >
          <el-form-item label="上级菜单" prop="parent_id">
            <el-tree-select
              v-model="formData.parent_id"
              check-strictly
              clearable
              :data="parentOptions"
              :props="{
                label: 'label',
                children: 'children',
                disabled: 'disabled',
              }"
              node-key="value"
              placeholder="请选择上级菜单"
              :render-after-expand="false"
              value-key="value"
            />
          </el-form-item>

          <el-form-item label="标题" prop="title" required>
            <el-input v-model="formData.title" placeholder="请输入标题" />
          </el-form-item>

          <el-form-item label="路径" prop="path" required>
            <el-input v-model="formData.path" placeholder="请输入路径" />
          </el-form-item>

          <el-form-item label="图标" prop="icon">
            <el-select
              v-model="formData.icon"
              class="icon-select"
              clearable
              filterable
              popper-class="menu-icon-select-popper"
              placeholder="请选择图标"
              :value-on-clear="''"
            >
              <template #label="{ value }">
                <span class="icon-select-value">
                  <el-icon v-if="value">
                    <component :is="getIconComponent(value)" />
                  </el-icon>
                </span>
              </template>
              <el-option
                v-for="iconName in iconNames"
                :key="iconName"
                :label="iconName"
                :value="iconName"
              >
                <span class="icon-option">
                  <el-icon>
                    <component :is="getIconComponent(iconName)" />
                  </el-icon>
                </span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="接口标识" prop="api_keys">
            <div class="api-key-list">
              <div
                v-for="(_apiKey, index) in formData.api_keys"
                :key="index"
                class="api-key-row"
              >
                <el-input
                  v-model="formData.api_keys[index]"
                  placeholder="请输入 app/controller/action"
                />
                <el-button
                  circle
                  icon="SemiSelect"
                  plain
                  @click="handleRemoveApiKey(index)"
                />
              </div>
              <el-button
                class="mt-2 h-9 w-full border-dashed"
                icon="Plus"
                plain
                @click="handleAddApiKey"
              >
                新增接口标识
              </el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="submitting"
              @click="handleSubmit"
            >
              保存
            </el-button>
            <el-button
              v-if="mode === 'update'"
              type="danger"
              plain
              @click="handleDelete"
              >删除</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  createMenuApi,
  deleteMenuApi,
  getMenuTreeApi,
  updateMenuSortApi,
  updateMenuApi,
  type Menu,
} from "@/api/menu";
import { setupDynamicRoutes } from "@/router/dynamic";
import { useMenuStore } from "@/store/menu";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import type { Component } from "vue";

type MenuForm = {
  id?: number;
  parent_id: number;
  title: string;
  icon: string;
  path: string;
  api_keys: string[];
};

type MenuOption = {
  label: string;
  value: number;
  disabled?: boolean;
  children?: MenuOption[];
};

const emptyForm = (): MenuForm => ({
  parent_id: 0,
  title: "",
  icon: "",
  path: "",
  api_keys: [],
});

const formRef = ref<FormInstance>();
const treeRef = ref();
const menuTree = ref<Menu[]>([]);
const treeLoading = ref(false);
const submitting = ref(false);
const expanded = ref(true);
const mode = ref<"create" | "update">("create");
const activeMenu = ref<Menu>();
const formData = ref<MenuForm>(emptyForm());
const iconMap = ElementPlusIconsVue as unknown as Record<string, Component>;
const iconNames = Object.keys(iconMap).sort((a, b) => a.localeCompare(b));
const menuStore = useMenuStore();

const getIconComponent = (iconName: string) => iconMap[iconName];

const apiKeyPattern =
  /^[A-Za-z][A-Za-z0-9_]*\/[A-Za-z][A-Za-z0-9_]*\/[A-Za-z][A-Za-z0-9_]*$/;

const normalizeApiKeys = (apiKeys: string[] = []) =>
  Array.from(
    new Set(apiKeys.map((apiKey) => apiKey.trim()).filter((apiKey) => apiKey)),
  );

const handleAddApiKey = () => {
  formData.value.api_keys.push("");
};

const handleRemoveApiKey = (index: number) => {
  formData.value.api_keys.splice(index, 1);
};

const rules: FormRules = {
  parent_id: [{ required: true, message: "请选择上级菜单", trigger: "change" }],
  title: [{ required: true, message: "请输入菜单标题", trigger: "blur" }],
  path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
  api_keys: [
    {
      validator: (_rule, value: string[] = [], callback) => {
        const apiKeys = value
          .map((apiKey) => apiKey.trim())
          .filter((apiKey) => apiKey);
        const invalidApiKey = apiKeys.find(
          (apiKey) => !apiKeyPattern.test(apiKey),
        );

        if (invalidApiKey) {
          callback(
            new Error(
              `接口标识格式错误：${invalidApiKey}，请使用 app/controller/action`,
            ),
          );
          return;
        }

        if (new Set(apiKeys).size !== apiKeys.length) {
          callback(new Error("接口标识不能重复"));
          return;
        }

        callback();
      },
      trigger: "blur",
    },
  ],
};

const panelTitle = computed(() => {
  if (mode.value === "create") {
    return formData.value.parent_id ? "新增子菜单" : "新增菜单";
  }

  return `编辑菜单：${formData.value.title || "-"}`;
});

const parentOptions = computed<MenuOption[]>(() => [
  {
    label: "顶级菜单",
    value: 0,
  },
  ...buildParentOptions(menuTree.value),
]);

const refreshMenuTree = async () => {
  treeLoading.value = true;
  try {
    menuTree.value = normalizeMenuTree(await getMenuTreeApi());
    // await nextTick();
    if (activeMenu.value) {
      treeRef.value?.setCurrentKey(activeMenu.value.id);
    }
  } catch (error) {
    menuTree.value = [];
  } finally {
    treeLoading.value = false;
  }
};

const refreshCurrentMenus = async () => {
  await menuStore.updateMenus();
  setupDynamicRoutes(menuStore.menus);
};

const normalizeMenuTree = (items: any[] = []): Menu[] =>
  (Array.isArray(items) ? items : []).map((item) => {
    const menu: Menu = {
      id: Number(item.id),
      parent_id: Number(item.parent_id || 0),
      title: item.title || "",
      icon: item.icon || "",
      path: item.path || "",
      api_keys: Array.isArray(item.api_keys) ? item.api_keys : [],
    };
    const children = normalizeMenuTree(item.children);

    if (children.length) {
      menu.children = children;
    }

    return menu;
  });

const buildParentOptions = (items: Menu[]): MenuOption[] =>
  (Array.isArray(items) ? items : []).map((item) => {
    const disabled =
      mode.value === "update" && isChild(item, formData.value.id);

    const option: MenuOption = {
      label: item.title,
      value: item.id,
      disabled,
    };

    if (Array.isArray(item.children) && item.children.length) {
      option.children = buildParentOptions(item.children);
    }

    return option;
  });

const isChild = (item: Menu, id?: number): boolean => {
  if (id === undefined || item.id === id) {
    return false;
  }

  if (item.parent_id === id) {
    return true;
  }

  if (!item.parent_id) {
    return false;
  }

  const parent = findMenu(menuTree.value, item.parent_id);

  return parent ? isChild(parent, id) : false;
};

const handleSelectMenu = (item: Menu) => {
  activeMenu.value = item;
  mode.value = "update";
  formData.value = {
    id: item.id,
    parent_id: item.parent_id,
    title: item.title,
    icon: item.icon || "",
    path: item.path,
    api_keys: [...(item.api_keys || [])],
  };
  formRef.value?.clearValidate();
};

const handleNodeDrop = async () => {
  const currentId = activeMenu.value?.id;
  const menus = flattenMenuSort(menuTree.value);

  try {
    await updateMenuSortApi({ menus });
    await refreshMenuTree();
    await refreshCurrentMenus();

    if (currentId) {
      const current = findMenu(menuTree.value, currentId);
      if (current) {
        handleSelectMenu(current);
      }
    }
  } catch (error) {
    await refreshMenuTree();
  }
};

const flattenMenuSort = (items: Menu[], parentId = 0) =>
  items.flatMap((item, index) => [
    {
      id: item.id,
      parent_id: parentId,
      order: index + 1,
    },
    ...flattenMenuSort(item.children || [], item.id),
  ]);

const findMenu = (items: Menu[], id: number): Menu | undefined => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }

    const found = findMenu(item.children || [], id);
    if (found) {
      return found;
    }
  }

  return undefined;
};

const handleAddCommand = (command: "root" | "child") => {
  if (command === "child") {
    handleCreateChild();
    return;
  }

  handleCreateRoot();
};

const handleCreateRoot = () => {
  mode.value = "create";
  activeMenu.value = undefined;
  formData.value = emptyForm();
  treeRef.value?.setCurrentKey();
  formRef.value?.clearValidate();
};

const handleCreateChild = () => {
  if (!activeMenu.value) {
    ElMessage.warning("请先选择一个菜单");
    return;
  }

  mode.value = "create";
  formData.value = {
    ...emptyForm(),
    parent_id: activeMenu.value.id,
  };
  formRef.value?.clearValidate();
};

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) {
    return;
  }

  submitting.value = true;
  try {
    const submitData = {
      ...formData.value,
      icon: formData.value.icon || "",
      api_keys: normalizeApiKeys(formData.value.api_keys),
    };

    if (mode.value === "create") {
      await createMenuApi(submitData);
      ElMessage.success("新增成功");
      handleCreateRoot();
    } else {
      await updateMenuApi(submitData);
      ElMessage.success("保存成功");
      activeMenu.value = {
        ...(activeMenu.value as Menu),
        ...submitData,
      };
    }

    await refreshMenuTree();
    await refreshCurrentMenus();
  } finally {
    submitting.value = false;
  }
};

const handleDelete = () => {
  if (!formData.value.id) {
    return;
  }

  ElMessageBox.confirm("删除后会同时删除所有子菜单，确定继续吗？", {
    type: "warning",
  })
    .then(async () => {
      await deleteMenuApi(formData.value.id!);
      ElMessage.success("删除成功");
      handleCreateRoot();
      await refreshMenuTree();
      await refreshCurrentMenus();
    })
    .catch(() => undefined);
};

const toggleExpand = () => {
  expanded.value = !expanded.value;
  setMenuNodesExpanded(menuTree.value, expanded.value);
};

const setMenuNodesExpanded = (items: Menu[], value: boolean) => {
  items.forEach((item) => {
    const node = treeRef.value?.getNode(item.id);

    if (node) {
      node.expanded = value;
    }

    setMenuNodesExpanded(item.children || [], value);
  });
};

onMounted(() => {
  refreshMenuTree();
});
</script>

<style scoped lang="scss">
.menu-page {
  min-height: 0;
}

.menu-tree-panel {
  :deep(.el-card__body) {
    min-height: 0;
  }

  :deep(.el-tree-node__content) {
    height: 38px;
  }

  :deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
    background-color: #e8f3ff;
  }
}

.menu-tree-node {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  column-gap: 10px;
  font-size: 15px;
}

.icon-select {
  width: 100%;
}

.api-key-list {
  width: 100%;
}

.api-key-row {
  display: flex;
  align-items: center;
  column-gap: 8px;
}

.api-key-row + .api-key-row {
  margin-top: 8px;
}

.icon-select :deep(.el-select__selected-item) {
  display: flex;
  align-items: center;
}

.icon-select-value {
  display: inline-flex;
  height: var(--el-component-size);
  align-items: center;
  font-size: 18px;
  line-height: 1;
}

.icon-select-value .el-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-option {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

:global(.menu-icon-select-popper .el-select-dropdown__list) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
  gap: 6px;
  padding: 8px;
}

:global(.menu-icon-select-popper .el-select-dropdown__item) {
  display: flex;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0;
}

:global(.menu-icon-select-popper .el-select-dropdown__item.is-selected) {
  background-color: var(--el-color-primary-light-9);
}

:global(.menu-icon-select-popper .el-select-dropdown__item span) {
  line-height: 1;
}
</style>
