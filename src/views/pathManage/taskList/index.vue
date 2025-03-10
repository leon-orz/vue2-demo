<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <div class="full-height column">
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form" label-width="130px">
          <el-form-item label="设备编号">
            <el-select
              v-model="form.equipmentCode"
              @change="conditionQuery"
              @clear="conditionQuery"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in deviceArr"
                :key="item.equipmentCode"
                :label="item.equipmentCode"
                :value="item.equipmentCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="form.equipmentName" @clear="conditionQuery" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="任务编号">
            <el-input v-model="form.questCode" @clear="conditionQuery" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="路径编号">
            <el-select v-model="form.pathMainCode" filterable clearable placeholder="请选择">
              <el-option v-for="item in pathArr" :key="item.id" :label="item.equipmentName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务完成时间">
            <el-date-picker
              clearable
              v-model="registerTime"
              @change="conditionQuery"
              @clear="conditionQuery"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="起始道口">
            <el-select
              v-model="form.startCode"
              @change="conditionQuery"
              @clear="conditionQuery"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in crossingArr"
                :key="item.equipmentCode"
                :label="item.equipmentName"
                :value="item.equipmentCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结束道口">
            <el-select
              v-model="form.endCode"
              @change="conditionQuery"
              @clear="conditionQuery"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in crossingArr"
                :key="item.equipmentCode"
                :label="item.equipmentName"
                :value="item.equipmentCode"
              >
              </el-option>
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
          <el-button type="primary" size="small" @click="add()">新增</el-button>
        </template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                :data="[props.row.pathRegisterDetailVOLis[0]]"
                :show-header="false"
                :span-method="arraySpanMethod"
                style="width: 100%"
              >
                <el-table-column width="62" align="center"> </el-table-column>
                <el-table-column align="center">
                  <template slot-scope="scope">
                    {{ props.row.questCode }}
                  </template>
                </el-table-column>
                <el-table-column palign="center">
                  <template slot-scope="scope">
                    {{ props.row.pathMainCode }}
                  </template>
                </el-table-column>
                <el-table-column prop="num" align="center">
                  <template slot-scope="scope">
                    <el-steps :active="6" align-center>
                      <el-step
                        title="点位"
                        v-for="(poinItem, poinIndex) in props.row.pathRegisterDetailVOLis"
                        :key="poinIndex"
                        :description="poinItem.pointCode"
                      ></el-step>
                    </el-steps>
                  </template>
                </el-table-column>
                <el-table-column align="center"> </el-table-column>
                <el-table-column align="center"> </el-table-column>
                <el-table-column align="center"> </el-table-column>
                <el-table-column align="center"> </el-table-column>
                <el-table-column align="center"> </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
          <el-table-column prop="questCode" label="任务编码" align="center"> </el-table-column>
          <el-table-column prop="pathMainCode" label="路径编码" align="center"> </el-table-column>
          <el-table-column prop="equipmentCode" label="设备编号" align="center"> </el-table-column>
          <el-table-column prop="equipmentName" label="设备名称" align="center"> </el-table-column>
          <el-table-column prop="typeDesc" label="任务类型" align="center"> </el-table-column>
          <el-table-column prop="registerTime" label="任务完成时间" align="center"> </el-table-column>
          <el-table-column prop="startCodeName" label="起始道口" align="center"> </el-table-column>
          <el-table-column prop="endCodeName" label="结束道口" align="center"> </el-table-column>
          <el-table-column prop="pointStart" label="起始点位" align="center"> </el-table-column>
          <el-table-column prop="pointEnd" label="结束点位" align="center"> </el-table-column>
          <!-- <el-table-column prop="address" label="任务状态" align="center">
            <template slot-scope="scope">
              <span :style="tabStatusColor(scope.row)">{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="任务优先级" align="center">
          </el-table-column>
          <el-table-column prop="address" label="任务进度" align="center">
            <template slot-scope="scope">
              <div>
                <el-progress :width="70" type="circle" text-color="#30cefb" color="#30cefb" :percentage="25"></el-progress>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column width="140" label="操作" align="center">
            <template slot-scope="scope">
              <div class="flex">
                <el-button v-if="scope.row.type == 'PR-SD'" type="primary" size="small" @click="edit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-if="scope.row.isDelete || scope.row.type == 'PR-SD'"
                  type="danger"
                  size="mini"
                  @click="deleteTable(scope.row)"
                  >删除</el-button
                >
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
    <taskListDialog :dialogVisible.sync="dialogVisible" :row="tableDataRow" :title="dialogtitle"></taskListDialog>
  </div>
</template>

<script>
import taskListDialog from './taskListDialog.vue'
export default {
  name: 'taskList',
  components: {
    taskListDialog
  },
  data() {
    return {
      form: {
        equipmentCode: '',
        equipmentName: '',
        questCode: '',
        pathMainCode: '',
        startCode: '',
        endCode: '',
        startTime: '',
        endTime: ''
      },
      registerTime: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      options: [],
      tableData: [],
      tableDataRow: {},
      dialogtitle: '',
      dialogVisible: false,
      deviceArr: [],
      crossingArr: [],
      pathArr: []
    }
  },
  computed: {
    tabStatusColor() {
      return function (val) {
        if (!val.status) return
        let code = val.status
        switch (code) {
          case '进行中':
            return { color: '#30E3BB' }
          case '已完成':
            return { color: '#30cefb' }
          default:
            return { color: '#333' }
        }
      }
    }
  },
  created () {
    const now = this.$moment()
    const oneWeekAgo = this.$moment().subtract(1, 'weeks')
    this.registerTime = [oneWeekAgo.format('YYYY-MM-DD HH:mm:ss'), now.format('YYYY-MM-DD HH:mm:ss')]
  },
  mounted() {
    let self = this
    self.queryTable()
    this.getDeviceData()
    this.getDeviceDKData()
    this.getPathData()
  },
  methods: {
    //查询任务列表
    queryTable() {
      if (this.registerTime && this.registerTime.length > 0) {
        this.form.startTime = this.registerTime[0]
        this.form.endTime = this.registerTime[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }

      let self = this
      self.tableData = []
      let param = {
        pageIndex: self.pageIndex,
        pageSize: self.pageSize,
        ...self.form
      }
      self.$api.masterData.queryTaskTable(param).then((res) => {
        try {
          self.total = res.total
          self.tableData = res.list
        } catch (error) {
          // error
        }
      })
    },
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
          self.pathArr = res
        } catch (error) {
          // error
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
          self.$api.masterData.deleteTaskData(param).then((res) => {
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        return [2, 6]
      } else if (columnIndex > 3) {
        return [0, 0]
      }
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
      self.registerTime = []
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
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-step__icon {
  width: 0.7vw;
  height: 0.7vw;
  .el-step__icon-inner {
    display: none;
  }
}
/deep/ .el-step.is-horizontal,
.el-step__icon-inner {
  position: relative;
  height: 7vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
/deep/.el-step__head.is-finish {
  margin-top: 2%;
  color: #30cefb;
  border-color: #30cefb;
}
/deep/ .el-step__title {
  width: 100%;
  color: #226193;
  font-size: 0.7vw;
  line-height: 0.7vw;
  position: absolute;
  top: 0%;
}
/deep/ .el-step__description.is-finish {
  font-size: 0.7vw;
  color: #333;
}
/deep/ .el-progress__text {
  font-size: 0.7vw !important;
}
</style>
