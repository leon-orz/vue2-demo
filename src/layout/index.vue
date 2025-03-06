<template>
  <div class="main-container">
    <layout-header />
    <div class="content-wrapper">
      <el-container class="full-cntr">
        <el-aside class="side-menu">
          <layout-menu />
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import LayoutHeader from './header.vue'
import LayoutMenu from './menu.vue'

export default {
  name: 'Layout',
  components: {
    LayoutHeader,
    LayoutMenu,
  },
}
</script>

<style lang="less" scoped>
.main-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow:
    inset 0px 0px 250px 0px #99acbb,
    inset 0px 0px 250px 0px #99acbb,
    inset 0px 0px 250px 0px #99acbb,
    inset 0px 0px 250px 0px #99acbb;

  display: flex;
  flex-direction: column;

  .content-wrapper {
    flex-grow: 1;
  }

  .full-cntr {
    width: 100%;
    height: 100%;
  }

  .side-menu {
  }
}
</style>
