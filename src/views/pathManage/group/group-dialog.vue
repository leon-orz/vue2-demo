<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" :inline="false" label-width="80px">
      <el-form-item label="分组编码" prop="groupCode">
        <el-input v-model="form.groupCode" :disabled="title == '编辑'" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="分组名称" prop="groupName">
        <el-input v-model="form.groupName" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'GroupDialog',
  props: {
    title: {
      type: String,
      default: '新增'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        groupCode: '',
        groupName: ''
      },
      rules: {
        groupCode: [{ required: true, message: '请输入分组编码', trigger: 'blur' }],
        groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          if (Object.keys(this.row).length === 0) {
            this.formEmpty()
          } else {
            this.form = JSON.parse(JSON.stringify(this.row))
          }
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 提交
    handleSubmit() {
      // if (!this.form.groupCode || !this.form.groupName) return
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form
          }
          const type = this.title == '新增' ? 'add' : 'edit'
          this.$api.group.GroupOperate(data, type).then((res) => {
            if (res) {
              this.$message.success('操作成功！')
              this.handleClose()
              this.$parent.queryTable()
            }
          })
        } else {
          // error
          return false
        }
      })
    },
    // 关闭
    handleClose() {
      this.formEmpty()
      this.$emit('update:dialogVisible', false)
    },
    formEmpty() {
      //清空
      for (const key in this.form) {
        this.form[key] = ''
      }
    }
  }
}
</script>

<style scoped></style>
