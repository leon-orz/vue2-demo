<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div class="form-box">
      <el-form ref="form" :inline="true" :rules="rules" :model="form" label-width="150px">
        <el-form-item label="路径编号" prop="pathMainCode">
          <el-input :disabled="title == '编辑' ? true : false" v-model="form.pathMainCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="路径名称" prop="pathMainName">
          <el-input v-model="form.pathMainName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="form.pathGroupCode" clearable placeholder="请选择">
            <el-option v-for="item in groupList" :key="item.groupCode" :label="item.groupName" :value="item.groupCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准时长(分钟)" prop="standardDuration">
          <el-input v-model="form.standardDuration" placeholder="请输入标准时长"></el-input>
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
  name: 'pathSettingDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
    queryrow: {
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
        thePathCode: '',
        railroadIdOne: '',
        railroadIdTwo: '',
        pathMainCode: '',
        pathMainName: '',
        pathGroupCode: '',
        standardDuration: 0
      },
      crossingArr: [],
      theoreticalPathObj: {},
      theoreticalPathList: [],
      rules: {
        pathMainCode: [{ required: true, message: '请输入路径编号', trigger: 'blur' }],
        pathMainName: [{ required: true, message: '请输入路径名称', trigger: 'blur' }],
        railroadIdOne: [{ required: true, message: '请选择起始道口', trigger: 'change' }],
        railroadIdTwo: [{ required: true, message: '请选择结束道口', trigger: 'change' }],
        standardDuration: [{ required: true, message: '请输入标准时长', trigger: 'blur' }]
      },
      groups: [],
      groupList: []
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.queryGroupList()

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
    this.queryGroupList()
  },
  methods: {
    // 分组
    queryGroupList() {
      this.$api.group.GroupList().then((res) => {
        if (res) {
          this.groupList = res
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
      let form = JSON.parse(JSON.stringify(self.form))
      let newData = {
        thePathCode: '',
        railroadIdOne: '',
        railroadIdTwo: '',
        pathMainCode: '',
        pathMainName: '',
        pathGroupCode: '',
        standardDuration: 0
      }
      Object.keys(newData).forEach((key) => {
        if (form.hasOwnProperty(key)) {
          newData[key] = form[key]
        }
      })
      let data = [{ ...newData, ...this.queryrow }]
      self.$api.masterData.addPathData(data).then((res) => {
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
      let data = { ...self.form }
      self.$api.masterData.updatePathData(data).then((res) => {
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

      this.form = {
        thePathCode: '',
        railroadIdOne: '',
        railroadIdTwo: '',
        pathMainCode: '',
        pathMainName: '',
        pathGroupCode: '',
        standardDuration: 0
      }
      this.groups = []
      this.theoreticalPathObj = {}
    }
  }
}
</script>

<style></style>
