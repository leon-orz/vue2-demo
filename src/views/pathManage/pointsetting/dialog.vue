<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div class="form-box">
      <el-form ref="form" :inline="true" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="点位编号" prop="pointCode">
          <el-input v-model="form.pointCode" :disabled="title == '编辑'" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位名称" prop="pointName">
          <el-input v-model="form.pointName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option v-for="item in poinTypeArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="页面坐标X" prop="coordinateX">
          <el-input v-model="form.coordinateX" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="页面坐标Y" prop="coordinateY">
          <el-input v-model="form.coordinateY" placeholder="请输入"></el-input>
        </el-form-item> -->
        <el-form-item label="AGV坐标X" prop="agvX">
          <el-input v-model="form.agvX" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="AGV坐标Y" prop="agvY">
          <el-input v-model="form.agvY" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="SVG坐标X" prop="svgX">
          <el-input v-model="form.svgX" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="SVG坐标Y" prop="svgY">
          <el-input v-model="form.svgY" placeholder="请输入"></el-input>
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
  name: 'pointsettingDialog',
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
        pointCode: '',
        pointName: '',
        type: '',
        // coordinateX: "",
        // coordinateY: "",
        agvX: '',
        agvY: ''
      },
      poinTypeArr: [],
      rules: {
        pointCode: [{ required: true, message: '请输入点位编号', trigger: 'blur' }],
        pointName: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择点位类型', trigger: 'change' }]
        // coordinateX: [
        //   { required: true, message: '请输入页面坐标X', trigger: 'blur' },
        // ],
        // coordinateY: [
        //   { required: true, message: '请输入页面坐标Y', trigger: 'blur' },
        // ],
        // agvX: [
        //   { required: true, message: '请输入AGV坐标X', trigger: 'blur' },
        // ],
        // agvY: [
        //   { required: true, message: '请输入AGV坐标X', trigger: 'blur' },
        // ],
      }
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.getPoinType()
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
    //获取点位类型
    getPoinType() {
      let self = this
      let param = {
        function: 'DW'
      }
      this.$api.masterData.getPrecisionData(param).then((res) => {
        try {
          self.poinTypeArr = res
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
      self.$api.masterData.addPoinData(data).then((res) => {
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
      self.$api.masterData.updatePoinData(data).then((res) => {
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
