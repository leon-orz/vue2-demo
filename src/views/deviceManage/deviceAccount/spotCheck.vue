<template>
  <el-dialog title="设备点检" :visible.sync="dialogVisible" width="50%" @close="onClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="点检需求" prop="need">
            <el-input v-model="form.need" placeholder="请输入点检需求"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="点检部位" prop="part">
            <el-input v-model="form.part" placeholder="请输入点检部位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="点检类别" prop="type">
            <el-select v-model="form.type" placeholder="请选择点检类别" clearable filterable>
              <el-option v-for="item in checkTypeList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="序号" prop="serial">
            <el-input v-model="form.serial" placeholder="请输入序号" @input="filterInputSerial"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="标准耗时" prop="elapsedTime">
            <el-input v-model="form.elapsedTime" placeholder="请输入标准耗时"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="点检次数" prop="checkNum">
            <el-input-number v-model="form.checkNum" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="点检频率" prop="checkFrequency">
            <el-select v-model="form.checkFrequency" placeholder="请选择点检类别" clearable filterable>
              <el-option v-for="item in checkFrequencyList" :key="item.id" :label="item.name" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="备注">
            <el-input v-model="form.note" placeholder="请输入备注"></el-input>
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
  name: 'SpotCheck',
  data() {
    return {
      dialogVisible: false,
      form: {
        need: '',
        part: '',
        type: '',
        serial: '',
        elapsedTime: '',
        note: '',
        checkFrequency: '',
        checkNum: 1
      },
      rules: {
        need: [{ required: true, message: '请输入点检需求', trigger: 'blur' }],
        part: [{ required: true, message: '请输入点检部位', trigger: 'blur' }],
        type: [{ required: true, message: '请选择点检类别', trigger: 'change' }],
        serial: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        elapsedTime: [{ required: true, message: '请输入标准耗时', trigger: 'blur' }],
        checkFrequency: [{ required: true, message: '请选择点检频率', trigger: 'change' }],
        checkNum: [{ required: true, message: '请输入点检次数', trigger: 'blur' }]
      },
      id: '',
      equipmentCode: '',
      checkTypeList: [],
      checkFrequencyList: []
    }
  },
  methods: {
    filterInputSerial(val) {
      if (!/^\d*$/.test(val)) {
        // 正则表达式测试是否只包含数字
        this.form.serial = val.replace(/\D/g, '') // 移除非数字字符
      }
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
      this.queryTypeList()
      this.queryCheckFrequency()
      this.dialogVisible = true
    },
    queryCheckFrequency() {
      this.$api.masterData.getPrecisionData({ function: 'CHECKFREQUENCY' }).then((res) => {
        if (res) {
          this.checkFrequencyList = res || []
        } else {
          this.checkFrequencyList = []
        }
      })
    },
    queryTypeList() {
      // 点检类型 GetEquipmentTypeList
      this.$api.equipment.GetEquipmentTypeList().then((res) => {
        if (res) {
          this.checkTypeList = res
        }
      })
    },
    onConfirm() {
      const params = {
        equipmentId: this.id,
        equipmentCode: this.equipmentCode,
        ...this.form
      }
      this.$api.equipment.InsertOrUpdateCheckItem(params).then((res) => {
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
        serial: '',
        elapsedTime: '',
        note: ''
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped></style>
