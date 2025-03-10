<template>
  <div class="base-page-wrap">
    <div class="base-page-wrap-hd">
      <!-- search start -->
      <el-form :inline="true">
        <el-form-item label="单号">
          <el-input v-model="form.equChaRevCode" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input v-model="form.equipmentCode" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="form.equipmentName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="timeArr"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="changeTime"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onQuery()">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- search end -->
    </div>
    <div class="base-page-wrap-bd">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="申请录入" name="apply_for_input">
          <request-entry :tableData="tableData" @refresh="onQuery" v-loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="评估" name="estimate">
          <evaluate :tableData="tableData" @refresh="onQuery" v-loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="审批" name="approve">
          <approval :tableData="tableData" @refresh="onQuery" v-loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="审批完成" name="approval_completed">
          <approval-completed :tableData="tableData" @refresh="onQuery" v-loading="loading" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="base-page-wrap-ft">
      <el-pagination
        @current-change="currentChange"
        :current-page.sync="pageData.pageNum"
        :page-size="pageData.pageSize"
        layout="total, prev, pager, next"
        :total="pageData.total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import RequestEntry from './request-entry.vue'
import Evaluate from './evaluate.vue'
import Approval from './approval.vue'
import ApprovalCompleted from './approval-completed.vue'

export default {
  name: 'EquipmentChangeReview',
  components: {
    RequestEntry,
    Evaluate,
    Approval,
    ApprovalCompleted
  },
  data() {
    return {
      activeName: 'apply_for_input',
      timeArr: [],
      form: {
        equChaRevCode: '',
        startTime: '',
        endTime: ''
      },
      pageData: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    reset() {
      this.form = {
        equChaRevCode: '',
        startTime: '',
        endTime: ''
      }
      this.timeArr = []
      this.pageData.pageNum = 1
      this.onQuery()
    },
    changeTime() {
      if (this.timeArr && this.timeArr.length > 0) {
        this.form.startTime = this.timeArr[0]
        this.form.endTime = this.timeArr[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    currentChange(val) {
      this.pageData.pageNum = val
      this.onQuery()
    },
    onQuery() {
      if (this.timeArr && this.timeArr.length > 0) {
        this.form.startTime = this.timeArr[0]
        this.form.endTime = this.timeArr[1]
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }

      const params = {
        ...this.form,
        ...this.pageData,
        equChaRevStatus: this.activeName
      }

      this.loading = true
      this.$api.equipment
        .PageInfoEquipmentChangeReview(params)
        .then((res) => {
          if (res && res.list) {
            this.tableData = res.list
            this.pageData.total = res.total
          } else {
            this.tableData = []
            this.pageData.total = 0
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClick(tab, event) {
      this.tableData = []

      this.onQuery()
    }
  }
}
</script>

<style lang="less" scoped>
.base-page-wrap {
  width: 100%;
  height: 100%;

  padding: 10px;
  background: rgba(255, 255, 255, 0.35) url('@/assets/icons/组8.svg') no-repeat top right 10px;
  border-radius: 6px;

  display: flex;
  flex-direction: column;

  // .base-page-wrap-hd {
  // }

  .base-page-wrap-bd {
    height: 0;
    flex: 1;
    flex-basis: 0;

    display: flex;
    flex-direction: column;
  }

  .base-page-wrap-ft {
    text-align: right;
  }
}

/deep/.el-tabs {
  height: 0;
  flex: 1;
  flex-basis: 0;

  display: flex;
  flex-direction: column;

  .el-tabs__content {
    height: 0;
    flex: 1;
    flex-basis: 0;

    display: flex;
    flex-direction: column;

    .el-tab-pane {
      height: 0;
      flex: 1;
      flex-basis: 0;

      display: flex;
      flex-direction: column;
    }
  }
}
</style>
