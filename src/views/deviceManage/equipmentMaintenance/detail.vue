<template>
  <div class="base-page-wrap">
    <!-- has-return -->
    <div class="base-page-wrap-hd">
      <el-descriptions title="保养信息" :column="4">
        <el-descriptions-item label="设备名称">{{ detailData.equipmentName }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ detailData.equipmentCode }}</el-descriptions-item>
        <el-descriptions-item label="保养单号">{{ detailData.orderCode }}</el-descriptions-item>
        <el-descriptions-item label="保养负责人">{{ detailData.maintainUser }}</el-descriptions-item>
        <!-- <el-descriptions-item label="状态">{{ detailData.status }}</el-descriptions-item> -->
        <el-descriptions-item label="状态">{{ detailData.statusDesc }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <icon-title>
      <template #title>设备保养项</template>
      <template #right>
        <div style="display: flex; align-items: center">
          <p style="margin-right: 5px">全选</p>
          <el-switch
            style="margin-right: 10px"
            v-model="allSelect"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeSwitch"
          >
          </el-switch>
          <el-button type="primary" size="mini" @click="onSubmit" v-if="detailData.status && detailData.status != 'end'">
            提交
          </el-button>
        </div>
      </template>
    </icon-title>
    <div class="base-page-wrap-bd">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table :data="tableData" border stripe height="100%">
        <!-- <el-table-column align="center" type="selection" width="55"> </el-table-column> -->
        <el-table-column align="center" prop="serial" label="序号" />
        <!-- <el-table-column align="center" prop="method" label="保养方法" /> -->
        <el-table-column align="center" prop="methodDesc" label="保养方法" />
        <el-table-column align="center" prop="part" label="保养部位" />
        <!-- <el-table-column align="center" prop="period" label="保养周期" /> -->
        <el-table-column align="center" prop="periodDesc" label="保养周期" />
        <el-table-column align="center" prop="standard" label="保养标准" />
        <el-table-column align="center" prop="status" label="状态" />
        <el-table-column align="center" prop="upkeepDesc" label="保养内容" />
        <el-table-column align="center" prop="duty" label="实施方" />
        <!-- <el-table-column align="center" prop="createTime" label="创建时间" /> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base-page-wrap-ft">
      <!-- <el-pagination
        @current-change="currentChange"
        :current-page.sync="page.pageNum"
        layout="total, prev, pager, next"
        :total="page.total"
        background
      >
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipmentRepairRecordDetail',
  data() {
    return {
      routeData: {},
      detailData: {},
      tableData: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      isSelected: [],
      allSelect: false
    }
  },
  mounted() {
    let obj = JSON.parse(this.$route.query.data)
    this.routeData = obj
    this.onQuery()
  },
  methods: {
    changeSwitch() {
      if (this.allSelect) {
        this.tableData.forEach((item) => {
          item.status = '1'
        })
      } else {
        this.tableData.forEach((item) => {
          item.status = '0'
        })
      }
    },
    onQuery() {
      const params = {
        orderCode: this.routeData.orderCode
      }
      this.$api.equipment.GetEquipmentUpkeepOrderDetail(params).then((res) => {
        if (res) {
          this.detailData = res
          this.tableData = res.upkeepOrderDetailList
        }
      })
    },
    handleSelectionChange(val) {
      this.isSelected = val.map((item) => item.id)
    },
    onSubmit() {
      // this.tableData.forEach((item) => {
      //   if (this.isSelected.includes(item.id)) {
      //     item.status = 1
      //   }
      // })

      const checkItems = this.tableData.map((item) => {
        const { id, ...rest } = item
        return rest
      })

      const params = {
        equipmentId: this.detailData.equipmentId,
        id: this.detailData.id,
        upkeepOrderDetailList: checkItems
      }

      this.$api.equipment.CompleteEquipmentUpkeepOrder(params).then((res) => {
        if (res) {
          this.$router.go(-1)
          this.$message.success('提交成功')
        }
      })
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

  .base-page-wrap-hd {
    /deep/ .el-descriptions__body {
      padding: 0 20px 20px;
      background: none;
    }
  }

  .base-page-wrap-bd {
    height: 0;
    flex: 1;
    flex-basis: 0;
  }

  // .base-page-wrap-ft {
  // }
}
</style>
