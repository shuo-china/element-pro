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
              <el-icon v-if="data.icon" class="menu-tree-icon">
                <component :is="data.icon" />
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
              clearable
              filterable
              :value-on-clear="''"
              placeholder="请选择图标"
            >
              <el-option
                v-for="icon in iconOptions"
                :key="icon"
                :label="icon"
                :value="icon"
              >
                <div class="flex items-center gap-x-2">
                  <el-icon>
                    <component :is="icon" />
                  </el-icon>
                  <span>{{ icon }}</span>
                </div>
              </el-option>
            </el-select>
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
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import * as ElementPlusIcons from "@element-plus/icons-vue";

type MenuForm = {
  id?: number;
  parent_id: number;
  title: string;
  path: string;
  icon: string;
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
  path: "",
  icon: "",
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

const rules: FormRules = {
  parent_id: [{ required: true, message: "请选择上级菜单", trigger: "change" }],
  title: [{ required: true, message: "请输入菜单标题", trigger: "blur" }],
  path: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
};

const panelTitle = computed(() => {
  if (mode.value === "create") {
    return formData.value.parent_id ? "新增子菜单" : "新增菜单";
  }

  return `编辑菜单：${formData.value.title || "-"}`;
});

const iconOptions = Object.keys(ElementPlusIcons);

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

const normalizeMenuTree = (items: any[] = []): Menu[] =>
  (Array.isArray(items) ? items : []).map((item) => {
    const menu: Menu = {
      id: Number(item.id),
      parent_id: Number(item.parent_id || 0),
      title: item.title || "",
      path: item.path || "",
      icon: item.icon || "",
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
    path: item.path,
    icon: item.icon || "",
  };
  formRef.value?.clearValidate();
};

const handleNodeDrop = async () => {
  const currentId = activeMenu.value?.id;
  const menus = flattenMenuSort(menuTree.value);

  try {
    await updateMenuSortApi({ menus });
    ElMessage.success("排序已保存");
    await refreshMenuTree();

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
    if (mode.value === "create") {
      await createMenuApi(formData.value);
      ElMessage.success("新增成功");
      handleCreateRoot();
    } else {
      await updateMenuApi(formData.value);
      ElMessage.success("保存成功");
      activeMenu.value = {
        ...(activeMenu.value as Menu),
        ...formData.value,
      };
    }

    await refreshMenuTree();
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

.menu-tree-icon {
  flex: 0 0 auto;
  color: #606266;
  font-size: 18px;
}
</style>
