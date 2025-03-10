<template>
  <div class="secondary-page-wrap">
    <div class="content-wrap">
      <icon-title>
        <template #title>首页管理</template>
        <template #right>
          <el-button type="primary" size="mini" @click="onOpen('add')">新增</el-button>
        </template>
      </icon-title>

      <div class="home-list">
        <el-table :data="listData" @cell-mouse-enter="onRowMouseEnter" @row-click="onRowClick">
          <el-table-column type="index" label="序号" align="center" width="80"> </el-table-column>
          <el-table-column prop="thirdSysName" label="系统名称" align="center">
            <template slot-scope="scope">
              <span style="cursor: pointer">{{ scope.row.thirdSysName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thirdSysDesc" label="系统描述" align="center"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="openUrl(scope.row)">打开</el-button>
              <el-button type="primary" size="mini" @click="onOpen('edit', scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="onDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        @current-change="currentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        background
        style="text-align: right"
      >
      </el-pagination>
    </div>

    <!-- add edit dialog -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="onClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="系统名称" prop="thirdSysName">
          <el-input v-model="form.thirdSysName"></el-input>
        </el-form-item>
        <el-form-item label="系统IP地址" prop="thirdSysIp">
          <el-input v-model="form.thirdSysIp"></el-input>
        </el-form-item>
        <el-form-item label="系统描述" prop="thirdSysDesc">
          <el-input v-model="form.thirdSysDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onAdd">OK</el-button>
      </span>
    </el-dialog>

    <div class="link-show-block" v-if="showLink">{{ linkUrl }}</div>
  </div>
</template>

<script>
export default {
  name: 'HomeManage',
  data() {
    return {
      showLink: false,
      linkUrl: '',
      listData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: '新增',
      dialogVisible: false,
      form: {
        thirdSysName: '',
        thirdSysIp: '',
        thirdSysDesc: ''
      },
      rules: {
        thirdSysName: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
        thirdSysIp: [{ required: true, message: '请输入系统名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.queryHomeList()
  },
  methods: {
    onRowClick(row) {
      this.openUrl(row)
    },
    onRowMouseEnter(row) {
      this.linkUrl = row.thirdSysIp
      this.showLink = true
    },
    queryHomeList() {
      const params = { pageNum: this.pageNum, pageSize: this.pageSize }
      this.$api.group
        .PageInfoSysThirdSystem({
          pageNum: 1,
          pageSize: 10
        })
        .then((res) => {
          // error
          if (res && res.list) {
            this.listData = res.list
            this.total = res.total
          }
        })
    },
    onOpen(type, row) {
      this.title = type == 'edit' ? '编辑' : '新增'
      if (row) {
        this.form = {
          thirdSysId: row.thirdSysId,
          thirdSysName: row.thirdSysName,
          thirdSysDesc: row.thirdSysDesc,
          thirdSysIp: row.thirdSysIp
        }
      }

      this.dialogVisible = true
    },
    onAdd() {
      // onAdd SysThirdSystemAdd
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title == '编辑') {
            this.$api.group
              .SysThirdSystemEdit({
                ...this.form
              })
              .then((res) => {
                if (res) {
                  this.$message.success('修改成功！')
                  this.dialogVisible = false
                  this.queryHomeList()
                }
              })
          } else {
            this.$api.group
              .SysThirdSystemAdd({
                ...this.form
              })
              .then((res) => {
                if (res) {
                  this.$message.success('新增成功！')
                  this.dialogVisible = false
                  this.queryHomeList()
                }
              })
          }
        } else {
          // error
          return false
        }
      })
    },
    onDel(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.group
            .SysThirdSystemDel({
              thirdSysId: row.thirdSysId
            })
            .then((res) => {
              if (res) {
                this.$message.success('删除成功！')
                this.queryHomeList()
              }
            })
        })
        .catch(() => {})
    },
    onClose() {
      this.form = {
        thirdSysName: '',
        thirdSysIp: '',
        thirdSysDesc: ''
      }
    },
    openUrl(row) {
      window.open(row.thirdSysIp)
    },
    currentChange(val) {
      this.pageNum = val
      this.queryHomeList()
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrap {
  display: flex;
  flex-direction: column;

  .home-list {
    height: 0;
    flex: 1;
    flex-basis: 0;
  }
}

.link-show-block {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 2px 10px;
  font-size: 12px;
  line-height: 1.5;
  background: #eee;
}
</style>
