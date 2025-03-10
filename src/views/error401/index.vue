<script setup>
import router from '@/router'

// back
const goBack = () => {
  router.back()
}
</script>
<template>
  <div class="error-401">
    <h1>401</h1>
    <h3>您暂无权访问该页面</h3>
    <button @click="goBack()">返回</button>
  </div>
</template>

<style scoped lang="less">
  .error-401 {
    margin: 20px;
    h1 {
      margin: 20px 0;
    }
    h3 {
      margin: 10px 0;
    }
  }
</style>
