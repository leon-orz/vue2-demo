<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <div class="full-height column">
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form">
          <el-form-item label="系统名称">
            <el-input v-model="form.name" placeholder="请输入系统名称" clearable @change="conditionQuery()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="conditionQuery()" size="small">查询</el-button>
            <el-button type="primary" @click="resetForm()" plain size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <icon-title style="margin-top: 0.5vw">
        <template #title>服务列表</template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
          <el-table-column prop="name" label="系统名称" align="center"> </el-table-column>
          <el-table-column prop="okQty" label="正常数量" align="center"> </el-table-column>
          <el-table-column prop="noQty" label="异常数量" align="center"> </el-table-column>
          <el-table-column prop="status" label="状态" align="center"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
          <el-table-column width="90" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="detailTable(scope.row)">详情</el-button>
            </template>
          </el-table-column>
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
  name: 'ServiceManagement',
  data() {
    return {
      form: {
        name: ''
      },
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: []
    }
  },
  mounted() {
    this.queryTableData()
  },
  methods: {
    queryTableData() {
      const params = {
        ...this.form,
        ...this.pageData
      }
      this.$api.group.PageInfoSysService(params).then((res) => {
        if (res && res.list) {
          this.tableData = res.list || []
          this.pageData.total = res.total
        } else {
          this.tableData = []
          this.pageData.total = 0
        }
      })
    },
    currentChange(val) {
      this.pageData.pageNum = val
      this.queryTableData()
    },
    conditionQuery() {
      this.pageData.pageNum = 1
      this.queryTableData()
    },
    resetForm() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.conditionQuery()
    },
    detailTable(row) {
      this.$router.push({
        path: '/serviceManagementDetail',
        query: {
          serviceId: row.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
