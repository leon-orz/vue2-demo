<template>
  <el-dialog title="子设备列表" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="form-box">
      <el-form ref="form" :inline="true" :model="form" label-width="80px">
        <el-form-item label="设备编号" prop="name">
          <el-input clearable @clear="conditionQuery" v-model="form.equipmentCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="name">
          <el-select v-model="form.type" clearable @change="conditionQuery" @clear="conditionQuery" placeholder="请选择">
            <el-option v-for="item in deviceTypeArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input clearable @clear="conditionQuery" v-model="form.equipmentName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="conditionQuery" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" height="40vh" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="equipmentCode" label="设备编号" align="center"> </el-table-column>
      <el-table-column prop="equipmentName" label="设备名称" align="center"> </el-table-column>
      <el-table-column prop="type" label="设备类型" align="center"> </el-table-column>
    </el-table>
    <div class="flex flex-end" style="margin-top: 0.5vw">
      <el-pagination
        background
        @current-change="currentChange"
        layout="prev, pager, next"
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="total"
      >
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
  name: 'deviceAccountDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    //主设备id
    mainId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      form: {
        equipmentCode: '',
        equipmentName: '',
        type: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      deviceTypeArr: [],
      tableData: [],
      multipleSelection: []
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val == true) {
          this.getDeviceType()
          this.querySubsetData()
        }
      }
    }
  },
  created() {},
  methods: {
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
    //查询子设备列表
    querySubsetData() {
      let self = this
      self.tableData = []
      let param = {
        pageIndex: self.pageIndex,
        pageSize: self.pageSize,
        mainId: self.mainId,
        ...self.form
      }
      this.$api.masterData.queryEquipmentNotData(param).then((res) => {
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
      self
        .$confirm('确认添加?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let param = []
          self.multipleSelection.forEach((item) => {
            param.push({
              mainId: self.mainId,
              detailId: item.id
            })
          })
          self.$api.masterData.addSubDeviceData(param).then((res) => {
            try {
              self.$message.success('添加成功！')
              self.handleClose()
              self.$parent.querySubsetTable()
            } catch (error) {
              // error
            }
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    conditionQuery() {
      let self = this
      self.pageIndex = 1
      self.querySubsetData()
    },
    currentChange(val) {
      let self = this
      self.pageIndex = val
      self.querySubsetData()
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
          return false
        }
      })
    }
  }
}
</script>

<style></style>
