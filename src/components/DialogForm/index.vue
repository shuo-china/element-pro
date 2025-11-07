<template>
  <el-dialog
    v-model="visible"
    v-bind="dialogProps"
    @open="handleOpen"
    @closed="handleClosed"
    destroy-on-close
  >
    <el-form v-loading="loading" ref="formRef" v-bind="formProps">
      <slot />
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        :disabled="loading"
        :loading="submitting"
        @click="handleConfirm()"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { DialogProps, FormInstance, FormProps } from "element-plus";
import _ from "lodash";

let initialValues;
const visible = defineModel("visible", { type: Boolean, default: false });

const props = defineProps<{
  dialogProps?: Partial<DialogProps>;
  formProps?: Partial<FormProps>;
  request?: () => Promise<Record<string, any>>;
}>();

const emit = defineEmits<{
  submit: [cb: (result: boolean) => void];
}>();

const defaultDialogProps: Partial<DialogProps> = {
  width: "500px",
  modalClass: "dialog-form-modal",
};

const dialogProps = computed(() =>
  Object.assign({}, defaultDialogProps, props.dialogProps),
);

const defaultFormProps: Partial<FormProps> = {
  labelPosition: "top",
};

const formProps = computed(() =>
  Object.assign({}, defaultFormProps, props.formProps),
);

const formRef = ref<FormInstance>();
const submitting = ref(false);
const loading = ref(false);

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

const handleClosed = () => {
  submitting.value = false;
  if (props.formProps?.model) {
    Object.assign(props.formProps.model, _.cloneDeep(initialValues));
  }
  formRef.value?.resetFields();
};

const handleOpen = () => {
  if (props.request) {
    loading.value = true;
    props
      .request()
      .then((values) => {
        initialValues = values;
        if (props.formProps?.model && visible.value) {
          Object.assign(props.formProps.model, _.cloneDeep(initialValues));
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const _expose = {
  loading,
};

defineExpose(_expose);

onMounted(() => {
  if (props.formProps?.model) {
    initialValues = _.cloneDeep(props.formProps.model);
  }
});
</script>

<style lang="scss" scoped>
:global(.dialog-form-modal .el-dialog) {
  padding: 24px;
}
</style>
