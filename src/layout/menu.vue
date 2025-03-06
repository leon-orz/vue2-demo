<template>
  <el-menu :default-active="$route.path" mode="vertical" @select="handleSelect" class="custom-menu">
    <template v-for="route in filteredRoutes">
      <el-menu-item v-if="!route.children" :index="route.path" :key="route.path">
        <i v-if="route.meta?.icon" :class="route.meta.icon"></i>
        {{ route.meta?.title }}
      </el-menu-item>

      <el-submenu v-else :index="route.path" :key="route.path + '-submenu'">
        <template slot="title">
          <i v-if="route.meta?.icon" :class="route.meta.icon"></i>
          {{ route.meta?.title }}
        </template>
        <el-menu-item v-for="child in route.children" :key="child.path" :index="child.path" v-if="child.meta?.title">
          {{ child.meta?.title }}
        </el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
export default {
  name: 'LayoutMenu',
  data() {
    return {
      activeSubmenus: [],
    }
  },
  computed: {
    filteredRoutes() {
      return this.$router.options.routes.filter(
        route => route.meta?.title && (route.children ? route.children.some(child => child.meta?.title) : true),
      )
    },
  },
  methods: {
    handleSelect(path) {
      this.$router.push(path)
    },
  },
}
</script>

<style lang="less" scoped>
.custom-menu {
  width: 200px;
  min-height: 400px;
}
</style>
