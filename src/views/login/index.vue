<template>
  <div>
    <!-- 页面结构 -->
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // ... existing data ...
      demoData: 'demo数据',
    }
  },
  created() {
    console.log('组件实例创建完成')
  },
  mounted() {
    console.log('DOM挂载完成')
  },
  methods: {
    demoFn() {
      console.log('demo方法')
    },
  },
}
</script>
<style lang="less" scoped></style>
