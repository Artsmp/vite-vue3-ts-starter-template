<template>
  <div class="py-4">
    <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div class="flex-shrink-0">
        <img class="h-12 w-12" src="../assets/logo.png" alt="ChitChat Logo" />
      </div>
      <div>
        <div class="text-xl font-medium text-black">ChitChat</div>
        <p class="text-gray-400">You have a new message!</p>
      </div>
    </div>
    <n-space class="pt-4">
      <n-button>Default</n-button>
      <n-button type="tertiary">Tertiary</n-button>
      <n-button type="primary">Primary</n-button>
      <n-button type="info">Info</n-button>
      <n-button type="success">Success</n-button>
      <n-button type="warning">Warning</n-button>
      <n-button type="error">Error</n-button>
    </n-space>
    <n-icon size="40">
      <game-controller-outline />
    </n-icon>
    <n-icon size="40" color="#0e7a0d">
      <game-controller />
    </n-icon>
    <n-icon size="40" color="#f00">
      <BonfireOutline />
    </n-icon>
  </div>
</template>

<script setup lang="ts">
  import {} from 'vue';
  import { GameControllerOutline, GameController, BonfireOutline } from '@vicons/ionicons5';
  // console.log('VITE_APP_API_URL', import.meta.env.VITE_APP_API_URL);
</script>

<style lang="scss" scoped>
  .n-icon {
    background-color: $primary-color;
  }
</style>
