<template>
  <el-breadcrumb separator="/" style="height: 3vw;" class="flex align-center">
    <el-breadcrumb-item v-for="item in lists" :key="item.meta.title">
      <router-link :to="item.path">{{ item.meta.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      lists: [],
    };
  },
  created() {
    this.lists = this.$route.matched; //获取路由内的全部信息
  },
  //这里必须使用监听，否则无法实时获取路由变动信息。
  //监听后路由会实时变动，不然需要手动刷新路径才会改变
  watch: {
    $route(to, from) {
      this.lists = to.matched;
    },
  },
};
</script>
<style lang="less" scoped>
  /deep/ .el-breadcrumb {
  }
  /deep/ .el-breadcrumb__separator {
    color: #606060;
  }
  /deep/ .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    color: #606060;
    font-size: 0.8vw;
    font-weight: unset;
  }
  /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner a {
    font-size: 0.8vw;
    color: #30cefb;
  }
</style>
