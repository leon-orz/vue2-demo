<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <div class="full-height column">
      <div class="form-box">
        <!-- label-width="130px" -->
        <el-form ref="form" :inline="true" :model="form">
          <el-form-item label="分组编码">
            <el-input v-model="form.groupCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="分组名称">
            <el-input v-model="form.groupName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button type="primary" plain size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <icon-title style="margin-top: 0.5vw">
        <template #title>分组列表</template>
        <template #right>
          <el-button type="primary" size="small" @click="add">新增</el-button>
        </template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%" v-loading="loading">
          <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
          <el-table-column prop="groupCode" label="分组编码" align="center"> </el-table-column>
          <el-table-column prop="groupName" label="分组名称" align="center"> </el-table-column>
          <el-table-column prop="createTime" label="时间" align="center"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
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
    <!-- 新增 编辑 -->
    <group-dialog :dialogVisible.sync="dialogVisible" :row="tableDataRow" :title="dialogtitle"></group-dialog>
  </div>
</template>

<script>
import GroupDialog from './group-dialog.vue'

export default {
  name: 'Group',
  components: {
    GroupDialog
  },
  data() {
    return {
      form: {
        groupCode: '',
        groupName: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      dialogVisible: false,
      dialogtitle: '新增',
      tableDataRow: {}
    }
  },
  mounted() {
    this.queryTable()
  },
  methods: {
    queryTable() {
      const params = {
        ...this.form,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }

      this.loading = true

      this.$api.group
        .GroupPagingQuery(params)
        .then((res) => {
          const { list, total } = res
          if (res) {
            this.tableData = list
            this.total = total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 分页
    currentChange(val) {
      this.pageIndex = val
      this.queryTable()
    },
    // 查询
    query() {
      this.pageIndex = 1
      this.queryTable()
    },
    // 重置
    reset() {
      this.form = {
        groupCode: '',
        groupName: ''
      }
      this.pageIndex = 1
      this.queryTable()
    },
    // 新增
    add() {
      this.dialogtitle = '新增'
      this.tableDataRow = {}
      this.dialogVisible = true
    },
    // 编辑
    edit(row) {
      this.dialogtitle = '编辑'
      this.tableDataRow = row
      this.dialogVisible = true
    },
    // 删除
    del(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.group.GroupDel({ groupId: row.groupId }).then((res) => {
            if (res) {
              this.$message.success('操作成功！')
              this.queryTable()
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped></style>
