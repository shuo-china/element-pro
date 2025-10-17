<template>
  <el-dialog v-model="visible" v-bind="dialogProps" @closed="handleClosed">
    <el-form v-loading="loading" ref="formRef" v-bind="formProps">
      <slot />
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
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

const visible = defineModel("visible", { type: Boolean, default: false });

const props = defineProps<{
  dialogProps?: Partial<DialogProps>;
  formProps?: Partial<FormProps>;
}>();

const emit = defineEmits<{
  submit: [cb: (result: boolean) => void];
  reset: [];
}>();

const defaultDialogProps: Partial<DialogProps> = {
  width: "560px",
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
        submitting.value = false;
        if (result) {
          visible.value = false;
        }
      });
    }
  });
};

const handleCancel = () => {
  visible.value = false;
};

const handleClosed = () => {
  formRef.value?.resetFields();
  emit("reset");
};

const _expose = {
  loading,
};

defineExpose(_expose);
</script>

<style lang="scss" scoped>
:global(.dialog-form-modal .el-dialog) {
  padding: 24px;
}
</style>
