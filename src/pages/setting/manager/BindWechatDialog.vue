<template>
  <el-dialog v-model="visible" :width="300">
    <div class="flex flex-col items-center justify-center pt-6 pb-8">
      <span class="mb-3 text-black/50">请使用微信扫一扫</span>
      <div class="h-40 w-40 rounded-xs border border-black/20">
        <iframe
          sandbox="allow-scripts allow-top-navigation allow-same-origin"
          scrolling="no"
          frameBorder="0"
          width="100%"
          height="100%"
          allowTransparency="true"
          :src="src"
        ></iframe>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";

const props = defineProps<{
  managerId: number;
}>();

const visible = defineModel("visible", { type: Boolean, default: false });
const configStore = useConfigStore();
const { config } = storeToRefs(configStore);

const src = ref("");
const generateSrc = () => {
  src.value =
    "https://open.weixin.qq.com/connect/qrconnect?appid=" +
    config.value?.wechat.appid +
    "&redirect_uri=" +
    encodeURIComponent(
      window.location.origin +
        `/callback?scene=bindWechat&managerId=${props.managerId}`,
    ) +
    "&response_type=code&scope=snsapi_login&stylelite=1&fast_login=0" +
    "&_=" +
    Date.now();
};

watch(visible, (val) => {
  if (val) {
    generateSrc();
  } else {
    src.value = "";
  }
});
</script>
