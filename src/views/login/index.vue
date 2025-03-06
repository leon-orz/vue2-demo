<template>
  <div class="login-page">
    <div class="login-page-hd">
      <div class="logo">
        <img src="../../assets/img/login/logo.png" alt="logo" />
        <h2>物流设备管理平台</h2>
      </div>
    </div>

    <div class="login-box">
      <div class="login-title">
        <img src="../../assets/img/login/login_t.png" alt="" />
      </div>
      <div class="login-form">
        <p class="login-form-tip">账号登录</p>
        <el-form class="login-form-content" :model="form" :rules="rules" ref="form">
          <el-form-item prop="account">
            <el-input v-model="form.account" placeholder="账号" prefix-icon="el-icon-user" class="custom-input" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="密码"
              show-password
              prefix-icon="el-icon-lock"
              class="custom-input"
            />
          </el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin()" style="width: 100%">立即登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleLogin() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            await this.$store.dispatch('user/login', this.form)
            this.$message.success('登录成功')
            this.$router.push('/')
          } catch (error) {
            this.$message.error('登录失败')
          }
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.custom-input {
  /deep/ .el-input__inner {
    padding-left: 32px;
  }
  .el-input__prefix {
    left: 5px;
    i {
      font-size: 16px;
    }
  }
}

.login-page {
  width: 100%;
  height: 100%;
  background: url(../../assets//img/login/bg.png) no-repeat center;
  background-size: 100% 100%;

  position: relative;

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 25vw;
    min-height: 50vh;
    background: #fff;
    border-radius: 20px;
    border: 1px solid rgba(36, 164, 226, 0.2);
    box-shadow: 0 4px 40px 0 rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;

    .login-title {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 80%;
        height: 10%;
        margin-top: 10%;
      }
    }

    .login-form {
      flex-grow: 1;
      padding: 10% 15%;

      .login-form-tip {
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        line-height: 1.7;
        color: #409eff;
        border-bottom: 2px solid #409eff;
        margin-bottom: 20px;
      }
    }
  }
}

.login-page-hd {
  padding: 15px;

  .logo {
    display: flex;
    align-items: center;
    vertical-align: middle;

    h2 {
      font-size: 24px;
      color: #fff;
    }
  }
}
</style>
