<template>
  <el-drawer
    v-model="visible"
    v-bind="drawerProps"
    @closed="handleClosed"
    class="drawer-form-container max-w-full"
  >
    <el-form ref="formRef" v-loading="requesting" v-bind="formProps">
      <slot />
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        :disabled="requesting"
        :loading="submitting"
        @click="handleConfirm()"
        >确认</el-button
      >
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { DrawerProps, FormInstance, FormProps } from "element-plus";
import _ from "lodash";

let initialValues;
let mountedValues;

const visible = defineModel("visible", { type: Boolean, default: false });

const props = withDefaults(
  defineProps<{
    drawerProps?: Partial<DrawerProps>;
    formProps?: Partial<FormProps>;
    params?: any;
    request?: (params?: any) => Promise<Record<string, any>>;
  }>(),
  {
    params: () => ({}),
  },
);

const emit = defineEmits<{
  submit: [cb: (result: boolean) => void];
}>();

const defaultDrawerProps: Partial<DrawerProps> = {
  size: "800px",
};

const drawerProps = computed(() =>
  Object.assign({}, defaultDrawerProps, props.drawerProps),
);

const defaultFormProps: Partial<FormProps> = {
  labelPosition: "left",
};

const formProps = computed(() =>
  Object.assign({}, defaultFormProps, props.formProps),
);

const formRef = ref<FormInstance>();
const submitting = ref(false);
const requesting = ref(false);

const handleConfirm = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid) => {
    if (valid && !submitting.value) {
      submitting.value = true;
      emit("submit", (result: boolean) => {
        if (result) {
          visible.value = false;
        } else {
          submitting.value = false;
        }
      });
    }
  });
};

const reset = () => {
  formRef.value?.resetFields();
  if (props.formProps?.model) {
    Object.assign(props.formProps.model, _.cloneDeep(initialValues));
  }
};

const handleClosed = () => {
  submitting.value = false;
  formRef.value?.resetFields();
  if (props.formProps?.model) {
    Object.assign(props.formProps.model, _.cloneDeep(mountedValues));
  }
};

watch([visible, () => props.request, () => props.params], ([v, r, p]) => {
  if (v && r) {
    requesting.value = true;
    r(p)
      .then((values) => {
        initialValues = values;
        if (props.formProps?.model && visible.value) {
          Object.assign(props.formProps.model, _.cloneDeep(initialValues));
        }
      })
      .finally(() => {
        requesting.value = false;
      });
  }
});

onMounted(() => {
  if (props.formProps?.model) {
    mountedValues = _.cloneDeep(props.formProps.model);
    initialValues = _.cloneDeep(props.formProps.model);
  }
});

defineExpose({
  reset,
});
</script>

<style lang="scss" scoped>
.drawer-form-container {
  :global(.el-drawer__header) {
    margin-bottom: 0;
  }
}
</style>
