<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <div class="full-height column">
      <div class="form-box">
        <el-form :inline="true">
          <el-form-item label="功能">
            <el-select
                v-model="formData.function"
                placeholder="请选择"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option v-for="item in fnList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编码">
            <el-input v-model="formData.code" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="formData.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="formData.desc" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button type="primary" plain size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <icon-title style="margin-top: 0.5vw">
        <template #title>列表</template>
        <template #right>
          <el-button type="primary" size="small" @click="add">新增</el-button>
        </template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%" v-loading="loading">
          <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
          <el-table-column prop="function" label="功能" align="center"> </el-table-column>
          <el-table-column prop="functionDesc" label="功能描述" align="center"> </el-table-column>
          <el-table-column prop="name" label="名称" align="center"> </el-table-column>
          <el-table-column prop="code" label="编码" align="center"> </el-table-column>
          <el-table-column prop="desc" label="描述" align="center"> </el-table-column>
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
    <el-dialog :title="title" :visible.sync="dialogShow" width="30%" @close="close">
      <el-form :model="form" ref="form" :rules="rules" :inline="false" label-width="80px">
        <el-row :gutter="0">
          <el-col :span="12" :offset="0">
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入" :disabled="title == '编辑'" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="功能" prop="function">
              <el-select
                v-model="form.function"
                placeholder="请选择"
                :disabled="title == '编辑'"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option v-for="item in fnList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="描述">
              <el-input v-model="form.desc" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dictMaintain',
  data() {
    return {
      formData: {
        function: '',
        code: '',
        name: '',
        desc: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      dialogShow: false,
      title: '新增',
      form: {
        function: '',
        code: '',
        name: '',
        desc: ''
      },
      rules: {
        function: [{ required: true, message: '请选择', trigger: 'change' }],
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      fnList: []
    }
  },
  created() {},
  mounted() {
    this.queryTable()
    this.queryDictFunction()
  },
  methods: {
    queryTable() {
      const params = {
        ...this.formData,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }

      this.$api.dict.pageInfoDictionaries(params).then((res) => {
        if (res && res.list.length) {
          this.tableData = res.list
          this.total = res.total
        } else {
          this.tableData = []
          this.total = 0
        }
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
        factoryCode: '',
        factoryName: '',
        areaCode: '',
        areaName: ''
      }
      this.pageIndex = 1
      this.queryTable()
    },
    // 新增
    add() {
      this.title = '新增'
      this.queryDictFunction()
      this.dialogShow = true
    },
    // 编辑
    edit(row) {
      this.title = '编辑'
      this.form = { ...row }
      this.queryDictFunction()
      this.dialogShow = true
    },
    queryDictFunction() {
      this.$api.dict.getDictionariesFunctionList().then((res) => {
        this.fnList = res || []
      })
    },
    // 提交
    onSubmit() {
      if (this.title == '新增') {
        this.$api.dict.add({ ...this.form }).then((res) => {
          if (res) {
            this.$message.success('新增成功！')
            this.queryTable()
            this.dialogShow = false
          }
        })
      }
      if (this.title == '编辑') {
        this.$api.dict.edit({ ...this.form }).then((res) => {
          if (res) {
            this.$message.success('编辑成功！')
            this.queryTable()
            this.dialogShow = false
          }
        })
      }
    },
    close() {
      this.title = ''
      this.form = {
        factoryCode: '',
        factoryName: '',
        areaCode: '',
        areaName: ''
      }
      this.dialogShow = false
    },
    // 删除
    del(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.dict.del({ id: row.id }).then((res) => {
            if (res) {
              this.$message.success('删除成功！')
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
