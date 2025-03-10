<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" :inline="true" label-width="80px">
      <el-form-item label="厂区" prop="factoryCode">
        <el-select v-model="form.factoryCode" clearable @change="changeFactory" placeholder="厂区">
          <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区域编码" prop="areaCode">
        <el-input v-model="form.areaCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="区域名称" prop="areaName">
        <el-input v-model="form.areaName" placeholder="请输入"></el-input>
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
  name: 'AddEditDialog',
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
        factoryCode: '',
        factoryName: '',
        areaCode: '',
        areaName: ''
      },
      rules: {
        factoryCode: [{ required: true, message: '请选择厂区', trigger: 'change' }],
        areaCode: [{ required: true, message: '请输入区域编码', trigger: 'blur' }],
        areaName: [{ required: true, message: '请输入区域名称', trigger: 'blur' }]
      },
      // 工厂列表
      factoryList: []
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.queryFactoryList()
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
    // 查询工厂列表
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res
        }
      })
    },
    changeFactory() {
      const cur = this.factoryList.find((item) => item.code == this.form.factoryCode)
      this.form.factoryName = cur.desc
    }, // 提交
    handleSubmit() {
      // if (!this.form.areaCode || !this.form.areaName || !this.form.factoryCode) return

      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form
          }
          const type = this.title == '新增' ? 'add' : 'edit'
          this.$api.regional.RegionalOperate(data, type).then((res) => {
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
