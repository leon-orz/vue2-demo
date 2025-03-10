<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <div class="full-height column">
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form" label-width="130px">
          <el-form-item label="路径编号">
            <el-input clearable @clear="conditionQuery" v-model="form.pathMainCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="路径名称">
            <el-input clearable @clear="conditionQuery" v-model="form.pathMainName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="理论路径编号">
            <el-input clearable @clear="conditionQuery" v-model="form.thePathCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="理论路径名称">
            <el-input clearable @clear="conditionQuery" v-model="form.thePathName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="起始道口" prop="railroadIdOne">
            <el-select
              v-model="form.railroadIdOne"
              filterable
              clearable
              @change="conditionQuery"
              @clear="conditionQuery"
              placeholder="请选择"
            >
              <el-option v-for="item in deviceArr" :key="item.id" :label="item.equipmentName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结束道口" prop="railroadIdTwo">
            <el-select
              v-model="form.railroadIdTwo"
              filterable
              clearable
              @change="conditionQuery"
              @clear="conditionQuery"
              placeholder="请选择"
            >
              <el-option v-for="item in deviceArr" :key="item.id" :label="item.equipmentName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="conditionQuery" size="small">查询</el-button>
            <el-button type="primary" @click="resetForm" plain size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <icon-title style="margin-top: 0.5vw">
        <template #title>路径列表</template>
        <template #right>
          <el-button type="primary" @click="add()" size="small">新增路径</el-button>
        </template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
          <el-table-column prop="pathGroupCode" label="分组" align="center"> </el-table-column>
          <el-table-column prop="pathMainCode" label="路径编号" align="center"> </el-table-column>
          <el-table-column prop="pathMainName" label="路径名称" align="center"> </el-table-column>
          <el-table-column prop="thePathName" label="理论路径名称" align="center"> </el-table-column>
          <el-table-column prop="thePathCode" label="理论路径编码" align="center"> </el-table-column>
          <el-table-column prop="railroadIdOneName" label="起始道口" align="center"> </el-table-column>
          <el-table-column prop="railroadIdTwoName" label="结束道口" align="center"> </el-table-column>
          <el-table-column prop="standardDuration" label="标准时长(分钟)" align="center"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
          <el-table-column width="240" label="操作" align="center">
            <template slot-scope="scope">
              <div class="flex">
                <el-button type="primary" size="small" @click="bindingSubset(scope.row)">绑定点位</el-button>
                <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteTable(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      <pathSettingDialog
        :title="pathDialogTitle"
        :dialogVisible.sync="pathDialogShow"
        :row="tableDataRow"
        :queryrow="queryrow"
      ></pathSettingDialog>
    </div>
  </div>
</template>

<script>
import pathSettingDialog from './pathSettingDialog.vue'
export default {
  name: 'pathSetting',
  components: {
    pathSettingDialog
  },
  data() {
    return {
      form: {
        pathMainCode: '',
        pathMainName: '',
        railroadIdOne: '',
        railroadIdTwo: '',
        thePathCode: '',
        thePathName: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      deviceArr: [],
      tableDataRow: {},
      pathDialogTitle: '',
      pathDialogShow: false,
      queryrow: {},
      factoryCode: ''
    }
  },
  mounted() {
    if (this.$route.query.railroadIdOne) {
      this.queryrow = {
        thePathCode: this.$route.query.thePathCode,
        railroadIdOne: this.$route.query.railroadIdOne,
        railroadIdTwo: this.$route.query.railroadIdTwo,
        factoryCode: this.$route.query.factoryCode
      }
      this.factoryCode = this.$route.query.factoryCode
    }
    this.getDeviceData()
    this.queryTable()
  },
  methods: {
    //查询设备道口数据
    getDeviceData() {
      let self = this
      let param = {
        pageIndex: 1,
        pageSize: 99999,
        type: 'SB-DK'
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
    queryTable() {
      let self = this
      self.tableData = []
      let param = {
        ...self.form,
        thePathCode: this.$route.query.thePathCode || ''
      }
      self.$api.masterData.queryPathTable(param).then((res) => {
        try {
          self.tableData = res
        } catch (error) {
          // error
        }
      })
    },
    //路径删除
    deleteTable(row) {
      let self = this
      let param = []
      param.push(row.id)
      self
        .$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$api.masterData.deletePathData(param).then((res) => {
            try {
              self.$message.success('删除成功！')
              self.queryTable()
            } catch (error) {
              // error
            }
          })
        })
        .catch(() => {})
    },
    conditionQuery() {
      let self = this
      self.pageIndex = 1
      self.queryTable()
    },
    currentChange(val) {
      let self = this
      self.pageIndex = val
      self.queryTable()
    },
    resetForm() {
      let self = this
      for (const key in self.form) {
        self.form[key] = ''
      }
      self.conditionQuery()
    },
    add() {
      let self = this
      self.tableDataRow = {}
      self.pathDialogTitle = '新增'
      self.pathDialogShow = true
    },
    edit(row) {
      let self = this
      self.tableDataRow = row
      self.pathDialogTitle = '编辑'
      self.pathDialogShow = true
    },
    bindingSubset(row) {
      this.$router.push({
        name: 'pathSettingDetail',
        query: {
          thePathCode: row.thePathCode,
          pathMainCode: row.pathMainCode,
          factoryCode: this.factoryCode
        }
      })
    }
  }
}
</script>

<style></style>
