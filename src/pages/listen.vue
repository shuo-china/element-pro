<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold">创业补贴计算器</h1>

    <el-form
      :model="formData"
      label-position="top"
      :rules="rules"
      ref="formRef"
    >
      <!-- 基本信息 -->
      <el-card class="mb-6">
        <template #header>
          <div class="font-bold">基本信息</div>
        </template>

        <el-form-item label="创业者身份" prop="identity">
          <el-select
            v-model="formData.identity"
            placeholder="请选择创业者身份"
            class="w-full"
          >
            <el-option
              label="高校毕业生（在校及毕业5年内）"
              value="graduate"
              title="高校毕业生是指：普通高校在校生/技工院校在校生/毕业5年内高校毕业生/毕业5年内国(境)外毕业生/毕业5年内技工院校毕业"
            />
            <el-option label="复员转业退役军人" value="veteran" />
            <el-option label="农民" value="farmer" />
            <el-option label="登记失业人员" value="unemployed" />
            <el-option label="就业困难人员" value="difficult" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="营业执照注册时间" prop="registerDate">
          <el-date-picker
            v-model="formData.registerDate"
            type="date"
            placeholder="选择日期"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="是否变更过法定代表人" prop="hasChangedLegalRep">
          <el-radio-group v-model="formData.hasChangedLegalRep">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否首次创业" prop="firstBusiness">
          <el-select
            v-model="formData.firstBusiness"
            placeholder="请选择"
            class="w-full"
          >
            <el-option label="非首次创业" value="none" />
            <el-option label="江苏省内首次创业" value="jiangsu" />
            <el-option label="国内首次创业" value="china" />
          </el-select>
        </el-form-item>

        <el-form-item
          label="单位名下是否有1人参保满6个月且目前正常缴费（含法定代表人）"
          prop="hasInsurance"
        >
          <el-radio-group v-model="formData.hasInsurance">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="吸纳就业人数（签订劳动合同并缴社保满6个月的员工数。不含法定代表人）"
          prop="employeeCount"
        >
          <el-input-number
            v-model="formData.employeeCount"
            :min="0"
            :precision="0"
            class="w-full"
          />
        </el-form-item>
      </el-card>

      <!-- 大学生创业相关信息 -->
      <el-card v-if="showGraduateFields" class="mb-6">
        <template #header>
          <div class="font-bold">大学生创业相关信息</div>
        </template>

        <el-form-item
          label="法定代表人毕业时间（如在读则填写预计毕业时间）"
          prop="graduationDate"
        >
          <el-date-picker
            v-model="formData.graduationDate"
            type="date"
            placeholder="选择日期"
            class="w-full"
          />
        </el-form-item>

        <el-form-item
          label="法定代表人股权比例"
          prop="equityRatio"
          v-if="showEquityFields"
        >
          <el-input-number
            v-model="formData.equityRatio"
            :min="0"
            :max="100"
            :precision="2"
            class="w-full"
          >
            <template #suffix>%</template>
          </el-input-number>
        </el-form-item>

        <!-- 股权比例≥30%时显示的字段 -->
        <template v-if="showAdvancedFields">
          <el-form-item
            label="招用毕业五年内大学生并缴纳社保人数"
            prop="graduateEmployeeCount"
          >
            <el-input-number
              v-model="formData.graduateEmployeeCount"
              :min="0"
              :precision="0"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="法定代表人学历" prop="education">
            <el-select
              v-model="formData.education"
              placeholder="请选择"
              class="w-full"
            >
              <el-option label="专科" value="college" />
              <el-option label="本科" value="bachelor" />
              <el-option label="硕士" value="master" />
              <el-option label="博士" value="doctor" />
            </el-select>
          </el-form-item>

          <el-form-item label="法定代表人户籍" prop="household">
            <el-select
              v-model="formData.household"
              placeholder="请选择"
              class="w-full"
            >
              <el-option label="非徐州市" value="nonXuzhou" />
              <el-option label="徐州市" value="xuzhou" />
            </el-select>
          </el-form-item>

          <el-form-item
            label="徐州市区划"
            prop="xuzhouArea"
            v-if="formData.household === 'xuzhou'"
          >
            <el-select
              v-model="formData.xuzhouArea"
              placeholder="请选择"
              class="w-full"
            >
              <el-option label="丰县" value="fengxian" />
              <el-option label="沛县" value="peixian" />
              <el-option label="邳州市" value="pizhou" />
              <el-option label="睢宁县" value="suining" />
              <el-option label="新沂市" value="xinyi" />
              <el-option label="铜山区" value="tongshan" />
              <el-option label="鼓楼区" value="gulou" />
              <el-option label="云龙区" value="yunlong" />
              <el-option label="泉山区" value="quanshan" />
              <el-option label="贾汪区" value="jiawang" />
              <el-option label="经开区" value="jingkai" />
            </el-select>
          </el-form-item>

          <el-form-item label="是否入驻以下大学生创业园" prop="inBusinessPark">
            <el-radio-group v-model="formData.inBusinessPark">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <div
              v-if="formData.inBusinessPark"
              class="mt-2 text-sm text-gray-500"
            >
              包括：徐州市大学生创业园；江苏师范大学科技园大学生创业园；中国矿业大学大学科技园大学生创业园；徐州工程学院大学科技园；徐州工业职业技术学院大学生创业园；江苏建筑职业技术学院大学生创业园；中国矿业大学智创空间；云创共享创业孵化基地
            </div>
          </el-form-item>

          <template v-if="formData.inBusinessPark">
            <el-form-item label="企业年营业收入(万元)" prop="annualRevenue">
              <el-input-number
                v-model="formData.annualRevenue"
                :min="0"
                :precision="2"
                class="w-full"
              />
            </el-form-item>

            <el-form-item
              label="是否属于以下特定行业：贸易、培训、餐饮、建筑施工、房地产开发"
              prop="isSpecificIndustry"
            >
              <el-radio-group v-model="formData.isSpecificIndustry">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="是否在市级创业基地内经营" prop="inCityBase">
              <el-radio-group v-model="formData.inCityBase">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <template v-if="formData.inBusinessPark || formData.inCityBase">
            <el-form-item label="是否发生代账费用" prop="hasAccountingFee">
              <el-radio-group v-model="formData.hasAccountingFee">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="纳税人类型"
              prop="taxpayerType"
              v-if="formData.hasAccountingFee"
            >
              <el-radio-group v-model="formData.taxpayerType">
                <el-radio label="small">小规模纳税人</el-radio>
                <el-radio label="general">一般纳税人</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </template>
      </el-card>

      <div class="flex justify-center">
        <el-button type="primary" @click="calculateSubsidy">计算补贴</el-button>
      </div>
    </el-form>

    <!-- 计算结果展示 -->
    <el-dialog v-model="showResult" title="补贴计算结果" width="80%">
      <el-table :data="subsidyResults" border>
        <el-table-column prop="index" label="序号" width="60" />
        <el-table-column prop="name" label="补贴项目" />
        <el-table-column prop="amount" label="预估补贴金额（元）" />
        <el-table-column prop="description" label="说明" />
      </el-table>
      <div class="mt-4 text-gray-500">
        <p>注意：</p>
        <p>1. 结果仅为预估值，实际申请以官方审核为准。</p>
        <p>
          2.
          同一法定代表人注册多家大学生创业企业的，只能以一家企业作为申报主体享受补贴。
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";

// 表单数据
const formData = ref({
  identity: "", // 创业者身份
  registerDate: null, // 营业执照注册时间
  hasChangedLegalRep: false, // 是否变更过法定代表人
  firstBusiness: "", // 是否首次创业
  hasInsurance: false, // 单位名下是否有1人参保满6个月且目前正常缴费
  employeeCount: 0, // 吸纳就业人数
  graduationDate: null, // 法定代表人毕业时间
  equityRatio: 0, // 法定代表人股权比例
  graduateEmployeeCount: 0, // 招用毕业五年内大学生并缴纳社保人数
  education: "", // 法定代表人学历
  household: "", // 法定代表人户籍
  xuzhouArea: "", // 徐州市区划
  inBusinessPark: false, // 是否入驻大学生创业园
  annualRevenue: 0, // 企业年营业收入
  isSpecificIndustry: false, // 是否属于特定行业
  inCityBase: false, // 是否在市级创业基地内经营
  hasAccountingFee: false, // 是否发生代账费用
  taxpayerType: "", // 纳税人类型
});

// 表单验证规则
const rules = {
  identity: [
    { required: true, message: "请选择创业者身份", trigger: "change" },
  ],
  registerDate: [
    { required: true, message: "请选择营业执照注册时间", trigger: "change" },
  ],
  firstBusiness: [
    { required: true, message: "请选择是否首次创业", trigger: "change" },
  ],
};

const formRef = ref();

// 计算注册年限（精确到日）
const registerYears = computed(() => {
  if (!formData.value.registerDate) return 0;
  const now = dayjs();
  const registerDate = dayjs(formData.value.registerDate);
  return now.diff(registerDate, "day") / 365;
});

// 计算注册月数
const registerMonths = computed(() => {
  if (!formData.value.registerDate) return 0;
  const now = dayjs();
  const registerDate = dayjs(formData.value.registerDate);
  return now.diff(registerDate, "month");
});

// 判断是否显示大学生创业相关字段
const showGraduateFields = computed(() => {
  return (
    formData.value.identity === "graduate" &&
    registerYears.value <= 5 &&
    !formData.value.hasChangedLegalRep
  );
});

// 判断是否显示股权相关字段
const showEquityFields = computed(() => {
  if (!showGraduateFields.value) return false;
  if (!formData.value.graduationDate) return false;

  const graduationDate = dayjs(formData.value.graduationDate);
  const registerDate = dayjs(formData.value.registerDate);

  // 判断是否在毕业五年内注册营业执照
  return registerDate.diff(graduationDate, "year") <= 5;
});

// 判断是否显示高级字段（股权比例≥30%）
const showAdvancedFields = computed(() => {
  return showEquityFields.value && formData.value.equityRatio >= 30;
});

// 结果相关
const showResult = ref(false);
const subsidyResults = ref([]);

// 计算补贴
const calculateSubsidy = async () => {
  // 表单验证
  try {
    await formRef.value.validate();
  } catch (error) {
    return;
  }

  const results = [
    calculateOneTimeSubsidy(),
    calculateEmploymentSubsidy(),
    calculateSocialInsuranceSubsidy(),
    calculateHousingSubsidy(),
    calculatePerformanceReward(),
    calculateAccountingSubsidy(),
  ];

  subsidyResults.value = results;
  showResult.value = true;
};

// 一次性创业补贴
const calculateOneTimeSubsidy = () => {
  const result = {
    index: 1,
    name: "一次性创业补贴",
    amount: 0,
    description: "",
  };

  // 条件判断
  const validIdentity = [
    "graduate",
    "veteran",
    "farmer",
    "unemployed",
    "difficult",
  ].includes(formData.value.identity);
  if (!validIdentity) {
    result.description = "创业者身份不符合条件";
    return result;
  }

  if (formData.value.firstBusiness !== "jiangsu") {
    result.description = "非江苏省内首次创业";
    return result;
  }

  if (registerMonths.value < 6) {
    result.description = "营业执照注册年限不足6个月";
    return result;
  }

  if (registerYears.value > 3) {
    result.description = "营业执照注册年限超过3年";
    return result;
  }

  if (formData.value.hasChangedLegalRep) {
    result.description = "已变更过法定代表人";
    return result;
  }

  if (!formData.value.hasInsurance) {
    result.description = "单位名下无人参保满6个月或目前未正常缴费";
    return result;
  }

  // 符合条件
  result.amount = 10000;
  result.description = "预估金额为一次性补贴金额";
  return result;
};

// 创业带动就业补贴
const calculateEmploymentSubsidy = () => {
  const result = {
    index: 2,
    name: "创业带动就业补贴",
    amount: 0,
    description: "",
  };

  // 条件判断
  const validIdentity = [
    "graduate",
    "veteran",
    "farmer",
    "unemployed",
    "difficult",
  ].includes(formData.value.identity);
  if (!validIdentity) {
    result.description = "创业者身份不符合条件";
    return result;
  }

  if (formData.value.firstBusiness !== "china") {
    result.description = "非国内首次创业";
    return result;
  }

  if (registerMonths.value < 6) {
    result.description = "营业执照注册年限不足6个月";
    return result;
  }

  if (registerYears.value > 3) {
    result.description = "营业执照注册年限超过3年";
    return result;
  }

  if (formData.value.hasChangedLegalRep) {
    result.description = "已变更过法定代表人";
    return result;
  }

  if (formData.value.employeeCount < 1) {
    result.description = "吸纳就业人数<1";
    return result;
  }

  // 符合条件，计算补贴金额
  const amount = formData.value.employeeCount * 3000;
  result.amount = Math.min(amount, 300000); // 最高30万
  result.description = "预估金额为吸纳就业人数×3000元(最高30万)";
  return result;
};

// 大学生创业企业社保补贴
const calculateSocialInsuranceSubsidy = () => {
  const result = {
    index: 3,
    name: "大学生创业企业社保补贴",
    amount: 0,
    description: "",
  };

  // 条件判断
  if (!showAdvancedFields.value) {
    result.description = "法定代表人股权比例不足30%";
    return result;
  }

  if (formData.value.graduateEmployeeCount < 1) {
    result.description = "招用毕业五年内大学生并缴纳社保人数<1";
    return result;
  }

  // 符合条件，计算补贴金额
  // 年度补贴金额(元/人)=4879（最低基数）×26.9%×12（个月）×招用毕业五年内大学生并缴纳社保人数
  const amount = 4879 * 0.269 * 12 * formData.value.graduateEmployeeCount;
  result.amount = Math.round(amount);
  result.description =
    "预估金额为最低缴费基数一年的补贴金额，企业成立五年内均可享受，每名员工最多可享受3年";
  return result;
};

// 大学生创业企业法定代表人住房补贴
const calculateHousingSubsidy = () => {
  const result = {
    index: 4,
    name: "大学生创业企业法定代表人住房补贴",
    amount: 0,
    description: "",
  };

  // 条件判断
  if (!showAdvancedFields.value) {
    result.description = "法定代表人股权比例不足30%";
    return result;
  }

  // 判断户籍是否符合条件
  const isValidHousehold =
    formData.value.household === "nonXuzhou" ||
    (formData.value.household === "xuzhou" &&
      ["fengxian", "peixian", "pizhou", "suining", "xinyi"].includes(
        formData.value.xuzhouArea,
      ));

  if (!isValidHousehold) {
    result.description = "法定代表人户籍不符合条件";
    return result;
  }

  // 符合条件，根据学历计算补贴金额
  let monthlyAmount = 0;
  switch (formData.value.education) {
    case "college":
    case "bachelor":
      monthlyAmount = 400;
      break;
    case "master":
      monthlyAmount = 600;
      break;
    case "doctor":
      monthlyAmount = 1000;
      break;
  }

  result.amount = monthlyAmount * 12;
  result.description = "预估金额为一年的补贴金额，最多可享受3年";
  return result;
};

// 大学生创业企业业绩奖励
const calculatePerformanceReward = () => {
  const result = {
    index: 5,
    name: "大学生创业企业业绩奖励",
    amount: 0,
    description: "",
  };

  // 条件判断
  if (!showAdvancedFields.value) {
    result.description = "法定代表人股权比例不足30%";
    return result;
  }

  if (!formData.value.inBusinessPark) {
    result.description = "未入驻市级及以上大学生创业园";
    return result;
  }

  if (formData.value.annualRevenue < 50) {
    result.description = "年营业收入<50万元";
    return result;
  }

  if (formData.value.isSpecificIndustry) {
    result.description = "属于特定行业";
    return result;
  }

  if (formData.value.annualRevenue > 10000) {
    // 1亿元
    result.description = "年营业收入>1亿元";
    return result;
  }

  // 符合条件，根据年营业收入计算奖励金额
  let rewardAmount = 0;
  if (
    formData.value.annualRevenue >= 50 &&
    formData.value.annualRevenue < 100
  ) {
    rewardAmount = 10000; // 1万元
  } else if (
    formData.value.annualRevenue >= 100 &&
    formData.value.annualRevenue < 300
  ) {
    rewardAmount = 30000; // 3万元
  } else if (
    formData.value.annualRevenue >= 300 &&
    formData.value.annualRevenue < 500
  ) {
    rewardAmount = 50000; // 5万元
  } else if (formData.value.annualRevenue >= 500) {
    rewardAmount = 80000; // 8万元
  }

  result.amount = rewardAmount;
  result.description = "预估金额为一年的补贴金额，最多可享受5年";
  return result;
};

// 大学生创业企业会计代账补贴
const calculateAccountingSubsidy = () => {
  const result = {
    index: 6,
    name: "大学生创业企业会计代账补贴",
    amount: 0,
    description: "",
  };

  // 条件判断
  if (!showAdvancedFields.value) {
    result.description = "法定代表人股权比例不足30%";
    return result;
  }

  if (!formData.value.inBusinessPark && !formData.value.inCityBase) {
    result.description = "未入驻大学生创业园或未在市级创业基地内经营";
    return result;
  }

  if (!formData.value.hasAccountingFee) {
    result.description = "未发生代账费用";
    return result;
  }

  // 符合条件，根据纳税人类型计算补贴金额
  let monthlyAmount = 0;
  if (formData.value.taxpayerType === "small") {
    monthlyAmount = 200; // 小规模纳税人
  } else if (formData.value.taxpayerType === "general") {
    monthlyAmount = 400; // 一般纳税人
  }

  result.amount = monthlyAmount * 12;
  result.description = "预估金额为一年的补贴金额，最多可享受3年";
  return result;
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
