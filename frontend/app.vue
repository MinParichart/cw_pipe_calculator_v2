<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'CW Pipe Calculator',
  meta: [
    { name: 'description', content: 'ระบบคำนวณขนาดท่อน้ำดีสำหรับที่พักอาศัยสูงไม่เกิน 2 ชั้น' },
  ],
})
</script>
