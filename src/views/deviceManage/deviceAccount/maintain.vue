<template>
  <el-dialog title="设备保养" :visible.sync="dialogVisible" width="50%" @close="onClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="保养部位" prop="part">
            <el-input v-model="form.part" placeholder="请输入保养部位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="序号" prop="serialNumber">
            <el-input v-model="form.serialNumber" placeholder="请输入序号" @input="filterInputSerial"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="保养内容" prop="upkeepDesc">
            <el-input v-model="form.upkeepDesc" placeholder="请输入保养内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="保养标准" prop="standard">
            <el-input v-model="form.standard" placeholder="请输入保养标准"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="保养方法" prop="method">
            <el-select v-model="form.method" placeholder="请选择保养方法" clearable filterable>
              <el-option v-for="item in methodList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="保养次数" prop="upkeepNum">
            <el-input-number v-model="form.upkeepNum" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="保养频率" prop="upkeepFrequency">
            <el-select v-model="form.upkeepFrequency" placeholder="请选择保养频率" clearable filterable>
              <el-option v-for="item in upkeepFrequencyList" :key="item.id" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="实施方" prop="duty">
            <el-input v-model="form.duty" placeholder="请输入实施方"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'maintain',
  data() {
    return {
      dialogVisible: false,
      form: {
        method: '',
        standard: '',
        upkeepDesc: '',
        part: '',
        serialNumber: '',
        duty: '',
        // 保养次数 upkeepNum 保养频率 upkeepFrequency
        upkeepNum: 1,
        upkeepFrequency: ''
      },
      rules: {
        method: [{ required: true, message: '请选择保养方法', trigger: 'change' }],
        standard: [{ required: true, message: '请输入保养标准', trigger: 'blur' }],
        upkeepDesc: [{ required: true, message: '请输入保养内容', trigger: 'blur' }],
        part: [{ required: true, message: '请输入保养部位', trigger: 'blur' }],
        serialNumber: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        duty: [{ required: true, message: '请输入实施方', trigger: 'blur' }],
        upkeepNum: [{ required: true, message: '请输入保养次数', trigger: 'blur' }],
        upkeepFrequency: [{ required: true, message: '请输入保养频率', trigger: 'change' }]
      },
      id: '',
      equipmentCode: '',
      upkeepFrequencyList: [],
      methodList: []
    }
  },
  methods: {
    filterInputSerial(val) {
      if (!/^\d*$/.test(val)) {
        // 正则表达式测试是否只包含数字
        this.form.serialNumber = val.replace(/\D/g, '') // 移除非数字字符
      }
    },
    queryUpkeepFrequency() {
      this.$api.masterData.getPrecisionData({ function: 'UPKEEPFREQUENCY' }).then((res) => {
        if (res) {
          this.upkeepFrequencyList = res || []
        } else {
          this.upkeepFrequencyList = []
        }
      })
    },
    queryMethodList() {
      this.$api.equipment.GetMaintainRespTypeList().then((res) => {
        if (res) {
          this.methodList = res
        }
      })
    },
    open(data) {
      this.id = data.eid
      this.equipmentCode = data.equipmentCode
      const { eid, ...obj } = data
      if (data.id) {
        this.form = {
          ...obj
        }
      }
      this.queryUpkeepFrequency()
      this.queryMethodList()
      this.dialogVisible = true
    },
    onConfirm() {
      const params = {
        equipmentId: this.id,
        equipmentCode: this.equipmentCode,
        ...this.form
      }
      this.$api.equipment.InsertOrUpdateEquipmentUpkeep(params).then((res) => {
        if (res) {
          this.$message.success('保存成功')
          this.$emit('refresh')
          this.onClose()
        }
      })
    },
    onClose() {
      this.form = {
        need: '',
        part: '',
        type: '',
        serialNumber: '',
        elapsedTime: '',
        note: ''
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped></style>
