<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="form-box">
      <el-form ref="form" :rules="rules" :model="form" :inline="true" label-width="120px">
        <el-form-item label="厂区">
          <el-select
            v-model="form.factoryCode"
            placeholder="请选择"
            clearable
            @change="
              areas = []
              changeFactory()
            "
          >
            <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="areaCode">
          <el-select v-model="areas" placeholder="请选择" multiple clearable @change="changeArea">
            <el-option v-for="item in areaList" :key="item.areaId" :label="item.areaName" :value="item.areaCode"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select clearable v-model="form.type" placeholder="请选择">
            <el-option v-for="item in deviceTypeArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentCode">
          <el-input
            :disabled="title == '编辑' ? true : false"
            clearable
            v-model="form.equipmentCode"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input clearable v-model="form.equipmentName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="资产状态" prop="currentStatus">
          <el-select clearable v-model="form.currentStatus" placeholder="请选择">
            <el-option v-for="item in deviceStatusArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行状态" prop="status">
          <el-select clearable v-model="form.status" :disabled="title == '编辑' ? true : false" placeholder="请选择">
            <el-option v-for="item in deviceYXStatusArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="person">
          <!-- <el-input clearable v-model="form.person" placeholder="请输入"></el-input> -->
          <el-select v-model="form.person" placeholder="请选择" clearable filterable>
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userAccount">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input clearable v-model="form.specification" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="实际值">
          <el-input clearable v-model="form.actualValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="最大值">
          <el-input clearable v-model="form.maxValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="出厂年月">
          <el-date-picker clearable v-model="form.goTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="厂家">
          <el-input clearable v-model="form.manufacturers" value-format="yyyy-MM-dd" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="使用年限" prop="employYear">
          <el-input clearable v-model="form.employYear" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="进厂日期">
          <el-date-picker clearable v-model="form.outTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属车间">
          <el-input clearable v-model="form.workshop" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="所属工段">
          <el-input clearable v-model="form.section" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="所属产线">
          <el-input clearable v-model="form.line" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位编号">
          <el-input clearable v-model="form.pointCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            action="/api/file/upload"
            ref="upload"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-remove="uploadRemove"
          >
            <i slot="default" class="el-icon-plus"></i>
            <!-- <el-button slot="trigger" size="small" type="primary">上传图片</el-button> -->
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'mainDeviceDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '新增'
    }
  },
  data() {
    return {
      areas: [],
      form: {
        factoryCode: '',
        factoryName: '',
        areaIds: '',
        areaCode: '',
        areaName: '',
        equipmentCode: '',
        equipmentName: '',
        specification: '',
        goTime: '',
        manufacturers: '',
        employYear: '',
        outTime: '',
        workshop: '',
        section: '',
        line: '',
        person: '',
        status: '',
        currentStatus: '',
        type: '',
        pointCode: '',
        uploadFileName: '',
        uploadFile: '',
        actualValue: '',
        maxValue: ''
      },
      deviceStatusArr: [],
      deviceYXStatusArr: [],
      deviceTypeArr: [],
      rules: {
        equipmentCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        // employYear: [{ validator: this.validateNumberInput, trigger: 'blur' }],
        areaCode: [{ required: true, message: '请选择区域', trigger: 'change' }],
        currentStatus: [{ required: true, message: '请选择设备状态', trigger: 'change' }],
        status: [{ required: true, message: '请选择设备运行状态', trigger: 'change' }],
        person: [{ required: true, message: '请选择责任人', trigger: 'change' }]
      },
      // 区域列表
      areaList: [],
      // 工厂列表
      factoryList: [],
      userList: [],
      fileList: []
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.getDeviceType()
          this.getDeviceStatus()
          if (Object.keys(this.row).length === 0) {
            this.formEmpty()
          } else {
            this.form = JSON.parse(JSON.stringify(this.row))
            this.areas = this.row.areaCode.split(',')
            // error
            this.fileList = this.form.uploadFile ? [{ url: this.form.uploadFile }] : []
            if (this.form.factoryCode) {
              this.queryAreaList()
            }
          }
        }
      }
    }
  },
  mounted() {
    this.queryFactoryList()
    // this.queryAreaList()
    this.queryUser()
  },
  methods: {
    queryUser() {
      // GetUserList
      this.$api.equipment.GetUserList().then((res) => {
        if (res) {
          this.userList = res
        }
      })
    },
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
      this.queryAreaList()
    },
    // 查询区域列表
    queryAreaList() {
      this.$api.equipment.FactoryArea({ factoryCode: this.form.factoryCode }).then((res) => {
        if (res) {
          this.areaList = res
        }
      })
    },
    changeArea(val) {
      const cur = this.areaList.filter((object) => val.includes(object.areaCode))
      this.form.areaName = cur.map((item) => item.areaName).join(',')
      this.form.areaCode = cur.map((item) => item.areaCode).join(',')
      this.form.areaIds = cur.map((item) => item.areaId).join(',')
    },
    //年限数字类型判断
    validateNumberInput(rule, value, callback) {
      const reg = /^\d+$/
      if (!value) return callback()
      if (!value.trim()) return callback()
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    },
    //获取设备类型
    getDeviceType() {
      let self = this
      let param = {
        function: 'SB'
      }
      this.$api.masterData.getPrecisionData(param).then((res) => {
        try {
          self.deviceTypeArr = res
        } catch (error) {
          // error
        }
      })
    },
    //获取设备状态
    getDeviceStatus() {
      let self = this
      this.$api.masterData
        .getPrecisionData({
          function: 'SBZT'
        })
        .then((res) => {
          try {
            self.deviceStatusArr = res
          } catch (error) {
            // error
          }
        })
      this.$api.masterData
        .getPrecisionData({
          function: 'SBYXZT'
        })
        .then((res) => {
          try {
            self.deviceYXStatusArr = res
          } catch (error) {
            // error
          }
        })
    },
    submitForm() {
      let self = this
      self.$refs.form.validate((valid) => {
        if (valid) {
          if (self.title == '编辑') {
            self.editData()
          } else {
            self.addData()
          }
        } else {
          // error
          return false
        }
      })
    },
    addData() {
      let self = this
      let data = [self.form]
      self.$api.masterData.addMainDeviceData(data).then((res) => {
        try {
          self.$message.success('新增成功！')
          self.handleClose()
          self.$parent.queryTable()
        } catch (error) {
          // error
        }
      })
    },
    editData() {
      let self = this
      let data = [self.form]
      self.$api.masterData.updateMainDeviceData(data).then((res) => {
        try {
          self.$message.success('编辑成功！')
          self.handleClose()
          self.$parent.queryTable()
        } catch (error) {
          // error
        }
      })
    },
    handleClose() {
      this.formEmpty()
      this.areas = []
      this.fileList = []
      this.$emit('update:dialogVisible', false)
    },
    formEmpty() {
      //清空
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    // 上传图片 成功
    uploadSuccess(res, file) {
      const { filename, url } = res.data
      if (url) {
        this.form.uploadFileName = filename
        this.form.uploadFile = url
        this.$message.success('上传成功！')
      }
    },
    // 上传图片 失败
    uploadError(err, file) {
      this.$message.error('上传失败！')
    },
    uploadRemove(file) {
      this.form.uploadFileName = ''
      this.form.uploadFile = ''
    }
  }
}
</script>

<style lang="less" scoped>
/* el-upload-list--picture-card  el-upload--picture-card*/
::v-deep {
  .el-upload-list__item,
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
</style>
