<template>
  <div class="noMarginFill general-page">
    <headerMenu></headerMenu>
    <div style="flex: 1; height: 0" class="flex">
      <el-container>
        <el-aside width="auto" style="margin-left: 1vw" class="flex align-center">
          <sideMenu :isCollapse="isCollapse"></sideMenu>
          <div class="isCollapseBtn" :class="{ isCollapse: isCollapse }" @click="isCollapse = !isCollapse">
            <i class="el-icon-arrow-left"></i>
          </div>
        </el-aside>
        <el-main>
          <returnBtn v-if="detail"></returnBtn>
          <div class="main-wrap">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import headerMenu from './headerMenu.vue'
import sideMenu from './menu.vue'
export default {
  name: 'layout',
  components: {
    headerMenu,
    sideMenu
  },
  data() {
    return {
      detail: false,
      isCollapse: false //菜单展开
    }
  },
  watch: {
    $route: {
      handler(to, form) {
        this.detail = to.meta.detail
      },
      immediate: true
    }
  }
}
</script>

<style>
.el-main {
  padding: 10px;
  position: relative;
}
.main-wrap {
  width: 100%;
  height: 100%;
}
</style>
