<template>
  <el-dialog title="点位列表" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="form-box">
      <el-form ref="form" :inline="true" :model="form" label-width="80px">
        <el-form-item label="点位编号" prop="name">
          <el-input clearable @clear="conditionQuery" v-model="form.pointCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="点位名称" prop="name">
          <el-input clearable @clear="conditionQuery" v-model="form.pointName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="conditionQuery" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" height="40vh" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="pointCode" label="点位编号" align="center">
      </el-table-column>
      <el-table-column prop="pointName" label="点位名称" align="center">
      </el-table-column>
    </el-table>
    <div class="flex flex-end" style="margin-top:0.5vw">
      <el-pagination background @current-change="currentChange" layout="prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="total">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "pathSettingDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    //主路径id
    pointId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        pointCode: "",
        pointName: "",
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      multipleSelection: [],
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val == true) {
          this.queryPoinData()
        }
      }
    }
  },
  created() {
  },
  methods: {
    //查询点位列表
    queryPoinData() {
      let self = this
      self.tableData = []
      let param = {
        pageIndex: self.pageIndex,
        pageSize: self.pageSize,
        pointId: self.pointId,
        ...self.form
      }
      self.$api.masterData.queryPoinTable(param).then((res) => {
        try {
          self.total = res.total
          self.tableData = res.list
        } catch (error) {
          // error
        }
      })
    },
    addSubset() {
      let self = this
      self.$confirm('确认添加?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = []
        self.multipleSelection.forEach((item, index) => {
          param.push({
            serial: (index + 1),
            pointId: item.id,
            pathMainId: self.pointId
          })
        });
        self.$api.masterData.addPathPoinData(param).then((res) => {
          try {
            self.$message.success("添加成功！")
            self.handleClose()
            self.$parent.querySubsetTable()
          } catch (error) {
            // error
          }
        })
      }).catch(() => {
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    conditionQuery() {
      let self = this
      self.pageIndex = 1
      self.queryPoinData()
    },
    currentChange(val) {
      let self = this
      self.pageIndex = val
      self.queryPoinData()
    },
    //弹窗关闭
    handleClose(done) {
      //清空
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.$emit('update:dialogVisible', false)
    },
    //弹窗确认按钮click
    submitForm() {
      let self = this
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.addSubset()
        } else {
          // error
          return false;
        }
      });
    },
  },
}
</script>

<style>
</style>