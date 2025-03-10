<template>
  <div class="s-menu" :style="{ width: isCollapse ? '0' : '11vw' }" style="transition: all 0.5s; overflow: hidden">
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :collapse-transition="false"
      :default-active="$route.name"
      :unique-opened="true"
      v-if="!isCollapse"
    >
      <div v-for="(route, index) in menus" :key="index">
        <div v-if="!route.hidden">
          <!-- 含子页面 -->
          <!-- TODO 控制台报错了，暂时不考虑权限控制 -->
          <!-- v-authority="route.meta ? route.meta.authCode || '' : ''" -->
          <el-submenu :index="route.name" v-if="route.children && route.name">
            <template slot="title">
              <div>
                <span slot="title">{{ route.meta ? route.meta.title : route.name }}</span>
              </div>
            </template>
            <!-- 子页面 -->
            <div v-for="(item, index) in route.children" :key="index">
              <!-- v-authority="item.meta ? item.meta.authCode || '' : ''" -->
              <el-menu-item v-if="!item.hidden" :index="item.name" @click="jump(item.path)">
                <span slot="title">{{ item.meta ? item.meta.title : item.name }}</span>
              </el-menu-item>
            </div>
          </el-submenu>
          <!-- 单页面 -->
          <!-- <el-menu-item
            v-else-if="route.children && route.children.length > 0"
            :index="route.children[0].name"
            @click="jump(route.children[0].path)"
            v-authority="route.children[0].meta ? route.children[0].meta.authCode || '' : ''"
          >
            <span slot="title">{{ route.children[0].meta ? route.children[0].meta.title : route.children[0].name }}</span>
          </el-menu-item> -->
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  // BUG menu冲突了，所以改成大写驼峰
  name: 'Menu',
  props: ['isCollapse'],
  data() {
    return {
      menus: []
    }
  },
  mounted() {
    this.menus = JSON.parse(JSON.stringify(this.$router.options.routes))
  },
  methods: {
    jump(path) {
      this.$router.push({ path: path })
    }
  }
}
</script>

<style></style>
