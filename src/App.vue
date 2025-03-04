<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'Hello Vue!',
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
