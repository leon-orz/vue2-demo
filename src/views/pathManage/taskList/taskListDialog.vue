<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div class="form-box">
      <el-form ref="form" :rules="rules" :model="form" :inline="true" label-width="120px">
        <el-form-item label="设备编号">
          <el-select
            v-model="form.equipmentCode"
            @change="equipmentChange"
            ref="equipmentRef"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in deviceArr"
              :key="item.equipmentCode"
              :label="item.equipmentName"
              :value="item.equipmentCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input disabled v-model="form.equipmentName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="任务编号" prop="questCode">
          <el-input v-model="form.questCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="路径编号" prop="pathMainCode">
          <el-select v-model="form.pathMainCode" filterable clearable placeholder="请选择">
            <el-option v-for="item in pathArr" :key="item.pathMainCode" :label="item.pathMainName" :value="item.pathMainCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务完成时间" prop="registerTime">
          <el-date-picker
            clearable
            v-model="form.registerTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="起始道口" prop="startCode">
          <el-select v-model="form.startCode" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in crossingArr"
              :key="item.equipmentCode.toString()"
              :label="item.equipmentName"
              :value="item.equipmentCode.toString()"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束道口" prop="endCode">
          <el-select v-model="form.endCode" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in crossingArr"
              :key="item.equipmentCode.toString()"
              :label="item.equipmentName"
              :value="item.equipmentCode.toString()"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始点位" prop="pointStart">
          <el-input v-model="form.pointStart" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="结束点位" prop="pointEnd">
          <el-input v-model="form.pointEnd" placeholder="请输入" clearable></el-input>
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
  name: 'taskListDialog',
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
      form: {
        equipmentCode: '',
        equipmentName: '',
        questCode: '',
        pathMainCode: '',
        registerTime: '',
        startCode: '',
        endCode: '',
        pointStart: '',
        pointEnd: ''
      },
      rules: {
        // equipmentCode: [{ required: true, message: '请选择设备编号', trigger: 'change' }],
        questCode: [{ required: true, message: '请输入任务编号', trigger: 'blur' }],
        registerTime: [{ required: true, message: '请选择任务完成时间', trigger: 'change' }],
        startCode: [{ required: true, message: '请选择起始道口', trigger: 'change' }],
        endCode: [{ required: true, message: '请选择结束道口', trigger: 'change' }],
        pointStart: [{ required: true, message: '请输入起始点位', trigger: 'blur' }],
        pointEnd: [{ required: true, message: '请输入结束点位', trigger: 'blur' }]
      },
      deviceArr: [],
      crossingArr: [],
      pathArr: []
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.getDeviceData()
          this.getDeviceDKData()
          this.getPathData()
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
    //查询设备道口数据
    getDeviceDKData() {
      let self = this
      let param = {
        pageIndex: 1,
        pageSize: 99999,
        type: 'SB-DK'
      }
      self.$api.masterData.queryDeviceAccountTable(param).then((res) => {
        try {
          self.crossingArr = res.list
        } catch (error) {
          // error
        }
      })
    },
    //查询设备数据
    getDeviceData() {
      let self = this
      let param = {
        pageIndex: 1,
        pageSize: 99999
      }
      self.$api.masterData.queryDeviceAccountTable(param).then((res) => {
        try {
          self.deviceArr = res.list
        } catch (error) {
          // error
        }
      })
    },
    //查询路径列表
    getPathData() {
      let self = this
      self.tableData = []
      let param = {
        pageIndex: 1,
        pageSize: 99999
      }
      self.$api.masterData.queryPathTable(param).then((res) => {
        try {
          self.pathArr = res.list
        } catch (error) {
          // error
        }
      })
    },
    equipmentChange() {
      setTimeout(() => {
        this.form.equipmentName = this.$refs.equipmentRef.selectedLabel
      }, 100)
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
      let form = JSON.parse(JSON.stringify(self.form))
      let newData = {
        equipmentCode: '',
        equipmentName: '',
        questCode: '',
        pathMainCode: '',
        registerTime: '',
        startCode: '',
        endCode: '',
        pointStart: '',
        pointEnd: ''
      }
      Object.keys(newData).forEach((key) => {
        if (form.hasOwnProperty(key)) {
          newData[key] = form[key]
        }
      })
      let data = [newData]
      self.$api.masterData.addTaskData(data).then((res) => {
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
      self.$api.masterData.updateTaskData(data).then((res) => {
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

<style></style>
