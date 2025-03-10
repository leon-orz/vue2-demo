<template>
  <div class="noMarginFill login-page">
    <div class="login-main-box column">
      <div class="flex flex-center">
        <img class="welcome-img" src="@/assets/imgs/login/Group1707479759.png" alt="welcome speech" />
      </div>
      <div class="login-info-box column">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="loginForm">
          <el-form-item prop="account">
            <el-input v-model="loginForm.account" clearable>
              <div slot="prefix">
                <i class="el-input__icon el-icon-user"></i>
                <span>账号</span>
              </div>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password>
              <div slot="prefix">
                <i class="el-input__icon el-icon-lock"></i>
                <span>密码</span>
              </div>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              round
              :disabled="!loginForm.account || !loginForm.password"
              :loading="loading"
              @click="submitForm('loginForm')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      activeName: 'accountLogin',
      loginForm: {
        account: '',
        password: '',
      },
      loading: false,
      loginRules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login()
        } else {
          this.loading = false
          return false
        }
      })
    },
    async login() {
      try {
        const res = await this.$api.user.Login({
          account: this.loginForm.account,
          password: this.loginForm.password,
        })
        if (res) {
          this.$store.dispatch('user/login', res)
          this.$message.success('登录成功')
          this.$router.push('/home')
        } else {
          this.$message.error(res.message || '登录失败')
        }
      } catch (error) {
        this.$message.error(error.message || '登录失败')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="less">
/* 登录页基础样式 */
.login-page {
  height: 100vh;
}
.login-main-box {
  min-width: 400px;
  padding: 20px;
}
</style>
