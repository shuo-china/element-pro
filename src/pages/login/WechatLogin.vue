<template>
  <div class="flex justify-center">
    <div class="h-55 w-55">
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
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();
const { config } = storeToRefs(configStore);

const src = ref("");
const generateSrc = () => {
  src.value =
    "https://open.weixin.qq.com/connect/qrconnect?appid=" +
    config.value?.wechat.appid +
    "&redirect_uri=" +
    encodeURIComponent(window.location.origin + "/callback?scene=wechatLogin") +
    "&response_type=code&scope=snsapi_login&stylelite=1&fast_login=1" +
    "&_=" +
    Date.now();
};

generateSrc();
</script>
