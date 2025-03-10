<template>
  <el-dialog title="设备维修" :visible.sync="dialogVisible" width="50%" @close="">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="厂区">
            <el-select v-model="form.factory" placeholder="请选择厂区" @change="changeFactory">
              <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="区域">
            <el-select v-model="form.area" placeholder="请选择区域" @change="changeArea">
              <el-option v-for="item in areaList" :key="item.areaId" :label="item.areaName" :value="item.areaCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="设备类型">
            <el-select v-model="form.equipmentType" placeholder="请选择设备类型" @change="changeEquipmentType">
              <el-option v-for="item in equipmentTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="设备">
            <el-select v-model="form.equipment" placeholder="请选择设备">
              <el-option
                v-for="item in equipmentList"
                :key="item.id"
                :label="item.equipmentName"
                :value="item.equipmentCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="故障原因" prop="maintainMessage">
            <el-input v-model="form.maintainMessage" placeholder="请输入故障原因" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="故障类型" prop="maintainType">
            <!-- <el-input v-model="form.maintainType" placeholder="请输入故障类型" clearable></el-input> -->
            <el-select v-model="form.maintainType" placeholder="请选择故障类型" clearable filterable>
              <el-option v-for="item in faultTypeList" :key="item.id" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-form-item label="维修时长" prop="maintainDuration">
            <el-input v-model="form.maintainDuration" placeholder="请输入维修时长" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="维修内容" prop="maintainDesc">
            <el-input v-model="form.maintainDesc" placeholder="请输入维修内容" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      dialogVisible: false,
      form: {
        factory: '',
        area: '',
        equipmentType: '',
        equipment: '',
        maintainMessage: '',
        maintainType: '',
        maintainDuration: '',
        maintainDesc: ''
      },
      factoryList: [],
      areaList: [],
      equipmentTypeList: [],
      equipmentList: [],
      tableData: [],
      rules: {
        maintainMessage: [{ required: true, message: '请输入故障原因', trigger: 'blur' }],
        maintainType: [{ required: true, message: '请选择故障类型', trigger: 'change' }],
        maintainDuration: [{ required: true, message: '请输入维修时长', trigger: 'blur' }],
        maintainDesc: [{ required: true, message: '请输入维修内容', trigger: 'blur' }]
      },
      faultTypeList: []
    }
  },
  methods: {
    open(row) {
      if (row) {
        this.form = {
          ...row
        }
      }
      this.queryFactoryList()
      this.queryFaultTypeList()
      this.dialogVisible = true
    },
    onSubmit() {
      const cur = this.equipmentList.find((item) => item.equipmentCode === this.form.equipment)
      const params = {
        equipmentId: cur.id,
        ...this.form
      }
      this.$api.equipment.InsertOrUpdateEquipmentMaintain(params).then((res) => {
        if (res) {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },
    // 故障类型 列表
    queryFaultTypeList() {
      const params = { function: 'GZLX' }

      this.$api.equipment.GetPrecisionDictionariesList(params).then((res) => {
        if (res) {
          this.faultTypeList = res
        }
      })
    },
    /* 选择工厂 */
    changeFactory() {
      this.form.area = ''
      this.form.equipmentType = ''
      this.form.equipment = ''
      this.queryAreaList()
    },
    /* 选择区域 */
    changeArea() {
      this.form.equipmentType = ''
      this.form.equipment = ''
      this.queryEquipmentTypeList()
    },
    /* 选择设备类型 */
    changeEquipmentType() {
      this.form.equipment = ''
      this.queryEquipmentList()
    },
    // 查询厂区列表
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res
        }
      })
    },
    // 查询区域
    queryAreaList() {
      const params = {
        factoryCode: this.form.factory
      }
      this.$api.equipment.FactoryArea(params).then((res) => {
        if (res) {
          this.areaList = res
        }
      })
    },
    // 查询设备类型
    queryEquipmentTypeList() {
      const params = { function: 'SB' }
      this.$api.masterData.getPrecisionData(params).then((res) => {
        if (res) {
          this.equipmentTypeList = res
        }
      })
    },
    // 查询设备
    queryEquipmentList() {
      const params = {
        factoryCode: this.form.factory,
        areaCodes: this.form.area,
        type: this.form.equipmentType
      }
      this.$api.equipment.EquipmentList(params).then((res) => {
        if (res) {
          this.equipmentList = res
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
