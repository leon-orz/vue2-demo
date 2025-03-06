<template>
  <div class="header-container">
    <div class="left-section">
      <img src="@/assets/img/login/logo.png" alt="logo" class="logo" />
      <h2 class="title">物流设备管理平台</h2>
    </div>

    <div class="right-section">
      <div class="datetime">{{ currentDateTime }}</div>
      <el-button type="primary" size="small" @click="handleLogout">退出登录</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LayoutHeader',
  data() {
    return {
      currentDateTime: '',
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    updateTime() {
      const now = this.$moment()
      this.currentDateTime = now.format('YYYY-MM-DD HH:mm:ss')
    },
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    },
  },
  mounted() {
    this.updateTime()
    this.timer = setInterval(() => {
      this.updateTime()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="less" scoped>
.header-container {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left-section {
    display: flex;
    align-items: center;

    .logo {
      margin-right: 10px;
    }

    .title {
      font-size: 20px;
      color: #fff;
      text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.34);
    }
  }

  .right-section {
    display: flex;
    align-items: center;

    .datetime {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      letter-spacing: 1px;
      margin-right: 15px;
    }
  }
}
</style>
