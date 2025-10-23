<template>
  <div class="py-6 text-center text-xs text-black/50">
    {{ config?.base.copyright }}
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();

const { config } = storeToRefs(configStore);
</script>
