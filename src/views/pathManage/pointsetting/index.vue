<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <div class="full-height column">
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form" label-width="130px">
          <el-form-item label="点位编号">
            <el-input clearable @clear="conditionQuery" v-model="form.pointCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="点位名称">
            <el-input clearable @clear="conditionQuery" v-model="form.pointName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="点位类型">
            <el-select v-model="form.type" clearable @change="conditionQuery" @clear="conditionQuery" placeholder="请选择">
              <el-option v-for="item in poinTypeArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="conditionQuery" size="small">查询</el-button>
            <el-button type="primary" @click="resetForm" plain size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <icon-title style="margin-top: 0.5vw">
        <template #title>点位列表</template>
        <template #right>
          <el-button type="primary" size="small" @click="openMapDialog()" style="margin-left: auto">新增点位图形化</el-button>
          <!-- <el-button type="primary" size="small" @click="add()">新增点位</el-button> -->
        </template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
          <el-table-column prop="pointCode" label="点位编号" align="center"> </el-table-column>
          <el-table-column prop="pointName" label="点位名称" align="center"> </el-table-column>
          <el-table-column prop="typeDesc" label="点位类型" align="center"> </el-table-column>
          <!-- <el-table-column prop="coordinateX" label="页面坐标X" align="center">
							</el-table-column>
							<el-table-column prop="coordinateY" label="页面坐标Y" align="center">
							</el-table-column> -->
          <el-table-column prop="agvX" label="AGV坐标X" align="center"> </el-table-column>
          <el-table-column prop="agvY" label="AGV坐标Y" align="center"> </el-table-column>
          <el-table-column prop="svgX" label="SVG坐标X" align="center"> </el-table-column>
          <el-table-column prop="svgY" label="SVG坐标Y" align="center"> </el-table-column>
          <el-table-column width="260" label="操作" align="center">
            <template slot-scope="scope">
              <div class="flex">
                <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                <el-button type="warning" size="small" @click="batchUpdatePoint(scope.row)">清理绑定路径</el-button>
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
    </div>

    <pointsettingDialog :dialogVisible.sync="dialogVisible" :row="tableDataRow" :title="dialogtitle"></pointsettingDialog>

    <!-- 点位新增 -->
    <map-dialog ref="mapDialogRef" @close="queryTable" />
  </div>
</template>

<script>
import pointsettingDialog from './dialog.vue'
import mapDialog from './mapDialog.vue'
export default {
  name: 'pointsetting',
  components: {
    pointsettingDialog,
    mapDialog
  },
  data() {
    return {
      form: {
        pointCode: '',
        pointName: '',
        type: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      poinTypeArr: [],
      tableData: [],
      tableDataRow: {},
      dialogtitle: '',
      dialogVisible: false
    }
  },
  mounted() {
    this.getPoinType()
    this.queryTable()
  },
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
          // error;
        }
      })
    },
    //查询点位列表
    queryTable() {
      let self = this
      self.tableData = []
      let param = {
        pageIndex: self.pageIndex,
        pageSize: self.pageSize,
        ...self.form
      }
      self.$api.masterData.queryPoinTable(param).then((res) => {
        try {
          self.total = res.total
          self.tableData = res.list
        } catch (error) {
          // error;
        }
      })
    },
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
          self.$api.masterData.deletePoineData(param).then((res) => {
            try {
              self.$message.success('删除成功！')
              self.queryTable()
            } catch (error) {
              // error;
            }
          })
        })
        .catch(() => {})
    },
    batchUpdatePoint(row) {
      let self = this
      self
        .$confirm('是否清理?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$api.masterData.batchUpdatePoint({ id: parseInt(row.id) }).then((res) => {
            try {
              self.$message.success('清理成功！')
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
      self.dialogtitle = '新增'
      self.dialogVisible = true
    },
    edit(row) {
      this.dialogtitle = '编辑'
      this.dialogVisible = true
      this.tableDataRow = row
    },
    openMapDialog() {
      this.$refs.mapDialogRef.open()
    }
  }
}
</script>

<style></style>
