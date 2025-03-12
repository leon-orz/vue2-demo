<template>
  <div class="head-identifier flex flex-between align-center">
    <div class="flex align-center">
      <img src="@/assets/imgs/login/image1030.png" alt="logo" />
      <span>物流设备管理平台</span>
    </div>
    <div class="flex align-center">
      <p class="digital-clock">{{ dateTime }}</p>
      <!-- 非登录页时显示退出按钮 -->
      <el-button type="primary" size="mini" @click="outLog()" v-if="$route.name != 'Login'">退出登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerMenu',
  data() {
    return {
      datetimer: null,
      dateTime: '',
    }
  },
  created() {
    this.startTimeUpdater()
  },
  methods: {
    // 启动定时器更新当前时间
    startTimeUpdater() {
      this.datetimer = setInterval(() => {
        this.dateTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    },

    // 处理用户退出登录操作
    outLog() {
      this.$store.dispatch('user/logout')
      this.$router.push({ path: '/' })
    },
  },
  beforeDestroy() {
    if (this.datetimer) {
      clearInterval(this.datetimer)
      this.datetimer = null
    }
  },
}
</script>

<style lang="less" scoped>
.digital-clock {
  color: #333;
  margin-right: 10px;
}

::v-deep .el-button--primary {
  background-color: #30cefb;
  border-color: #30cefb;
  transition: all 0.3s ease;

  &:hover {
    background-color: darken(#30cefb, 10%);
    border-color: darken(#30cefb, 10%);
  }
}
</style>
