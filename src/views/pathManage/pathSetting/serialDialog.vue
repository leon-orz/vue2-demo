<template>
  <el-dialog title="编辑" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div class="form-box">
      <el-form ref="form" :inline="true" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="序号" prop="serial">
          <el-input v-model="form.serial" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位编号" prop="pointCode">
          <el-input v-model="form.pointCode" disabled placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位名称" prop="pointName">
          <el-input v-model="form.pointName" disabled placeholder="请输入"></el-input>
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
  name: "pointsettingDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      form: {
        serial: "",
        pointCode: "",
        pointName: "",
      },
      poinTypeArr: [],
      rules: {
        serial: [
          { required: true, message: '请输入序号', trigger: 'blur' },
        ],
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
  mounted() {

  },
  methods: {
    submitForm() {
      let self = this
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.editData()
        } else {
          // error
          return false;
        }
      });
    },
    editData() {
      let self = this
      let data = [self.form]
      self.$api.masterData.updatePathPoinData(data).then((res) => {
        try {
          self.$message.success("编辑成功！")
          self.handleClose()
          self.$parent.querySubsetTable()
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
    },
  },
}
</script>

<style>
</style>