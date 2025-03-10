<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <div class="full-height column">
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form">
          <!-- label="时间" -->
          <el-form-item>
            <!-- conditionQuery -->
            <el-date-picker
              v-model="form.time"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="conditionQuery()"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="conditionQuery()" size="small">查询</el-button>
            <el-button type="primary" @click="resetForm()" plain size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <icon-title style="margin-top: 0.5vw">
        <template #title>服务详情</template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
          <el-table-column prop="equipmentCode" label="设备编码" align="center"> </el-table-column>
          <el-table-column prop="equipmentName" label="设备名称" align="center"> </el-table-column>
          <el-table-column prop="equipmentServiceDetailOkQty" label="正常数量" align="center"> </el-table-column>
          <el-table-column prop="equipmentServiceDetailNoQty" label="异常数量" align="center"> </el-table-column>
          <el-table-column prop="equipmentStatus" label="状态" align="center"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
        </el-table>
      </div>
      <div class="flex flex-end" style="margin-top: 0.5vw">
        <el-pagination
          background
          @current-change="currentChange"
          layout="prev, pager, next"
          :current-page="pageData.pageNum"
          :page-size="pageData.pageSize"
          :total="pageData.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceManagementDetail',
  data() {
    return {
      form: {
        time: []
      },
      equipmentServiceId: '',
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: []
    }
  },
  mounted() {
    this.equipmentServiceId = this.$route.query.equipmentServiceId
    this.queryTableData()
  },
  methods: {
    queryTableData() {
      const params = {
        equipmentServiceId: this.equipmentServiceId,
        startTime: this.form.time && this.form.time[0] ? this.form.time[0] : '',
        endTime: this.form.time && this.form.time[1] ? this.form.time[1] : '',
        ...this.pageData
      }
      this.$api.group.PageInfoSysEquipmentServiceDetail(params).then((res) => {
        if (res && res.list) {
          this.tableData = res.list || []
          this.pageData.total = res.total
        } else {
          this.tableData = []
          this.pageData.total = 0
        }
      })
    },
    conditionQuery() {
      this.pageData.pageNum = 1
      this.queryTableData()
    },
    resetForm() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.time = []
      this.conditionQuery()
    },
    currentChange(val) {
      this.pageData.pageNum = val
      this.queryTableData()
    }
  }
}
</script>

<style lang="less" scoped></style>
