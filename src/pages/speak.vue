<template>
  <el-button @click="id = 1">1</el-button>
  <add v-model:id="id" />
</template>

<script setup lang="ts">
import Add from "./add.vue";

const id = ref(0);
</script>
