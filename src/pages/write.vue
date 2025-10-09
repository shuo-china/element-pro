<template>
  <search-form :model="data">
    <el-form-item label="Activity name" prop="name">
      <el-input v-model="data.name" />
    </el-form-item>
    <el-form-item label="Instant delivery" prop="delivery">
      <el-switch v-model="data.delivery" />
    </el-form-item>
    <el-form-item label="Instant delivery" prop="aa">
      <el-switch v-model="data.delivery" />
    </el-form-item>
    <el-form-item label="Instant delivery" prop="bb">
      <el-switch v-model="data.delivery" />
    </el-form-item>
    <el-form-item label="Instant delivery" prop="c'ccc">
      <el-switch v-model="data.delivery" />
    </el-form-item>
  </search-form>
</template>

<script setup lang="ts">
const data = reactive({
  name: "",
  delivery: false,
});
</script>
