<template>
  <div>
    <SearchForm
      :model="searchParams"
      @reset="tableRef?.reset"
      @search="() => tableRef?.search(searchParams)"
    >
      <el-form-item prop="name" label="姓名">
        <el-input v-model="searchParams.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="searchParams.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="company_no" label="公司编号">
        <el-input
          v-model="searchParams.company_no"
          placeholder="请输入公司编号"
        />
      </el-form-item>
      <el-form-item prop="job_no" label="工号">
        <el-input v-model="searchParams.job_no" placeholder="请输入工号" />
      </el-form-item>
    </SearchForm>
    <ProTable class="mt-4" ref="tableRef" :request="getUserListApi">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="create_time" label="创建时间" />
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import { getUserListApi } from "@/api/user";
import type { ProTableInstance } from "@/components/ProTable/index.vue";

const searchParams = ref({
  name: "",
  mobile: "",
  company_no: "",
  job_no: "",
});

const tableRef = ref<ProTableInstance>();
</script>

<style lang="scss" scoped></style>
