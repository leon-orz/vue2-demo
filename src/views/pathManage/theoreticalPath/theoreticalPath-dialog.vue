<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" :inline="false" label-width="80px">
      <el-form-item label="路径编码" prop="thePathCode">
        <el-input v-model="form.thePathCode" :disabled="title == '编辑'" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="路径名称" prop="thePathName">
        <el-input v-model="form.thePathName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="起始道口" prop="railroadIdOne">
        <el-select v-model="form.railroadIdOne" filterable clearable placeholder="请选择">
          <el-option v-for="item in crossingArr" :key="item.id" :label="item.equipmentName" :value="item.pointCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结束道口" prop="railroadIdTwo">
        <el-select v-model="form.railroadIdTwo" filterable clearable placeholder="请选择">
          <el-option v-for="item in crossingArr" :key="item.id" :label="item.equipmentName" :value="item.pointCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工厂" prop="factoryCode">
        <el-select v-model="factoryCode" @change="queryPointList()">
          <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
        </el-select>
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
  name: 'theoreticalPathDialog',
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
        thePathCode: '',
        thePathName: '',
        railroadIdOne: '',
        railroadIdTwo: ''
      },
      crossingArr: [],
      rules: {
        thePathCode: [{ required: true, message: '请输入路径编码', trigger: 'blur' }],
        thePathName: [{ required: true, message: '请输入路径名称', trigger: 'blur' }],
        railroadIdOne: [{ required: true, message: '请选择开始道口', trigger: 'change' }],
        railroadIdTwo: [{ required: true, message: '请选择结束道口', trigger: 'change' }]
      },
      factoryCode: '',
      factoryList: []
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
  mounted() {
    this.queryFactoryList()
    this.getDeviceData()
  },
  methods: {
    // 工厂
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res || []

          // 先默认选中第一项
          if (!this.factoryCode) {
            this.factoryCode = this.factoryList[0].code
          }
        } else {
          this.factoryList = []
        }
      })
    },
    //查询设备道口数据
    getDeviceData() {
      let self = this
      let param = {
        type: ''
      }
      self.$api.masterData.queryEquipmentList(param).then((res) => {
        try {
          self.crossingArr = res
        } catch (error) {
          // error;
        }
      })
    },
    // 提交
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            factoryCode: this.factoryCode
          }
          const type = this.title == '新增' ? 'add' : 'edit'
          if ('add' == type) {
            this.$api.group.addTheoreticalPath(data).then((res) => {
              if (res) {
                this.$message.success('操作成功！')
                this.handleClose()
                this.$parent.queryTable()
              }
            })
          } else {
            this.$api.group.editTheoreticalPath(data).then((res) => {
              if (res) {
                this.$message.success('操作成功！')
                this.handleClose()
                this.$parent.queryTable()
              }
            })
          }
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
