<template>
  <div
    class="wang-editor-wrapper flex flex-col overflow-hidden rounded border border-black/15"
  >
    <toolbar
      :editor="editorRef"
      :mode="mode"
      class="border-b border-black/15"
    />
    <editor
      class="flex-1 overflow-y-auto"
      v-model="modelValue"
      :mode="mode"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { IEditorConfig } from "@wangeditor/editor";
import { uploadApi } from "@/api/file";

const mode = "default";

const modelValue = defineModel({ type: String, default: "" });

const editorRef = shallowRef();

const handleCreated = (editor) => {
  editorRef.value = editor;
};

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
  }
});

const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn) {
        const res = await uploadApi(file);
        insertFn(res.full_path, res.name);
      },
    },
    uploadVideo: {
      async customUpload(file: File, insertFn) {
        const res = await uploadApi(file);
        insertFn(res.full_path, res.name);
      },
    },
  },
};
</script>

<style lang="scss">
.wang-editor-wrapper {
  img {
    vertical-align: baseline;
  }
}
</style>
