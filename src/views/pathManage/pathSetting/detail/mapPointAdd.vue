<template>
  <el-dialog title="新增" :visible.sync="dialogVisible" width="50%" append-to-body>
    <div class="form-box">
      <el-form ref="form" :inline="true" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="点位编号" prop="pointCode">
          <el-input v-model="form.pointCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位名称" prop="pointName">
          <el-input v-model="form.pointName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option v-for="item in poinTypeArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <!--
                <el-form-item label="页面坐标X" prop="svgX">
					<el-input v-model="form.svgX" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="页面坐标Y" prop="svgY">
					<el-input v-model="form.svgY" placeholder="请输入"></el-input>
				</el-form-item>
                -->
        <el-form-item label="AGV坐标X" prop="agvX">
          <el-input v-model="form.agvX" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="AGV坐标Y" prop="agvY">
          <el-input v-model="form.agvY" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'pointsettingDialog',
  data() {
    return {
      dialogVisible: false,
      form: {
        pointCode: '',
        pointName: '',
        type: '',
        svgX: '',
        svgY: '',
        agvX: '',
        agvY: ''
      },
      poinTypeArr: [],
      rules: {
        pointCode: [{ required: true, message: '请输入点位编号', trigger: 'blur' }],
        pointName: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择点位类型', trigger: 'change' }]
        // agvX: [
        //   { required: true, message: '请输入AGV坐标X', trigger: 'blur' },
        // ],
        // agvY: [
        //   { required: true, message: '请输入AGV坐标X', trigger: 'blur' },
        // ],
      },
      factoryCode: ''
    }
  },
  mounted() {},
  methods: {
    open({ x, y, factoryCode }) {
      this.form.svgX = x
      this.form.svgY = y
      this.factoryCode = factoryCode
      this.getPoinType()
      this.dialogVisible = true
    },
    //获取点位类型
    async getPoinType() {
      const param = {
        function: 'DW'
      }
      this.$api.masterData.getPrecisionData(param).then((res) => {
        this.poinTypeArr = res
      })
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.masterData.addPoinData([{ ...this.form, factoryCode: this.factoryCode }]).then((res) => {
            this.$message.success('新增成功！')
            this.$emit('success')
            this.close()
          })
        } else {
          // error
          return false
        }
      })
    },
    close() {
      this.dialogVisible = false
      this.$emit('close')
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style></style>
