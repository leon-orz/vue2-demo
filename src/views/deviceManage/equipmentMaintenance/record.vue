<template>
  <div class="base-page-wrap">
    <div class="base-page-wrap-hd">
      <!-- search start -->
      <el-form :inline="true">
        <el-form-item label="设备类型">
          <el-select
            v-model="form.equipmentType"
            placeholder="请选择设备类型"
            clearable
            filterable
            @change="changeEquipmentType"
          >
            <el-option v-for="item in equipmentTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select v-model="form.equipment" placeholder="请选择设备" clearable filterable>
            <el-option
              v-for="item in equipmentList"
              :key="item.id"
              :label="item.equipmentName + '-' + item.equipmentCode"
              :value="item.equipmentCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onQuery()">查询</el-button>
          <el-button @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- search end -->
    </div>
    <icon-title>
      <template #title>设备保养记录</template>
    </icon-title>
    <div class="base-page-wrap-bd">
      <el-table ref="multipleTable" :data="tableData" border stripe height="100%" style="width: 100%" v-loading="tableLoading">
        <el-table-column align="center" type="index" label="序号" width="70" />
        <el-table-column align="center" prop="orderCode" label="保养单号" />
        <el-table-column align="center" prop="equipmentCode" label="设备编码" />
        <el-table-column align="center" prop="statusName" label="状态" />
        <el-table-column align="center" prop="upkeepResult" label="保养结果" />
        <el-table-column align="center" prop="upkeepTime" label="保养日期" />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onDetails(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base-page-wrap-ft">
      <div style="text-align: right">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page.sync="page.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="page.total"
          background
        >
        </el-pagination>
      </div>
    </div>

    <!-- dialog -->
    <el-dialog title="保养" :visible.sync="checkDialogShow" width="30%" @close="onCloseCheckDialog()">
      <el-select v-model="upkeepResult" placeholder="请选择" clearable filterable>
        <el-option label="OK" value="OK"> </el-option>
        <el-option label="NG" value="NG"> </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="checkDialogShow = false">取消</el-button>
        <el-button type="primary" @click="onCheckConfirm()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EquipmentCheck',
  data() {
    return {
      form: {
        equipmentType: '',
        equipment: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableLoading: false,
      factoryList: [],
      areaList: [],
      equipmentTypeList: [],
      equipmentList: [],
      isSelected: [],
      checkDialogShow: false,
      upkeepResult: ''
    }
  },
  created() {
    this.queryEquipmentTypeList()
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    // 查询设备类型
    queryEquipmentTypeList() {
      const params = { function: 'SB' }
      this.$api.masterData.getPrecisionData(params).then((res) => {
        if (res) {
          this.equipmentTypeList = res || []
        }
      })
    },
    /* 选择设备类型 */
    changeEquipmentType() {
      this.form.equipment = ''
      this.queryEquipmentList()
    },
    // 查询设备
    queryEquipmentList() {
      const params = {
        equipmentCode: this.form.equipment,
        type: this.form.equipmentType
      }
      this.$api.equipment.EquipmentList(params).then((res) => {
        if (res) {
          this.equipmentList = res || []
        } else {
          this.equipmentList = []
        }
      })
    },
    // 查询 保养信息
    onQuery() {
      const params = {
        equipmentCode: this.form.equipment,
        type: this.form.equipmentType,
        ...this.page
      }
      this.tableLoading = true
      this.$api.equipment
        .EquipmentUpkeepOrderPageInfoEquipmentUpkeepOrder(params)
        .then((res) => {
          if (res && res.list) {
            this.tableData = res.list
            this.page.total = res.total
          } else {
            this.tableData = []
            this.page.total = 0
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    onReset() {
      this.form = {
        equipmentType: '',
        equipment: ''
      }
      this.page = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      this.onQuery()
    },
    // 分页 pageSize
    sizeChange(val) {
      this.page.pageSize = val
      this.onQuery()
    },
    // 分页 pageNum
    currentChange(val) {
      this.page.pageNum = val
      this.onQuery()
    },
    onDetails(row) {
      this.$router.push({
        path: '/equipmentMaintenanceDetails',
        query: {
          orderCode: row.orderCode,
          from: 'equipmentMaintenanceRecord'
        }
      })
    },
    handleSelectionChange(val) {
      this.isSelected = val.map((i) => i.id)
    },
    oneKeyCheck() {
      // CheckOrderDetailUpdateUnFinishStateByIds
      this.$confirm('此操作将修改所有为保养工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.equipment
            .EquipmentUpkeepOrderDetailUpdateFinishStateByIds()
            .then((res) => {
              if (res) {
                this.$message.success('操作成功')
                this.onQuery()
              }
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },
    batchInspection() {
      if (!this.isSelected.length) return this.$message.warning('请选择设备工单')
      this.checkDialogShow = true
    },
    onCloseCheckDialog() {
      this.upkeepResult = ''
      this.isSelected = []
      this.$refs.multipleTable.clearSelection()
      this.checkDialogShow = false
    },
    onCheckConfirm() {
      this.$api.equipment
        .EquipmentUpkeepOrderUpdateByIds(
          {
            upkeepResult: this.upkeepResult
          },
          this.isSelected
        )
        .then((res) => {
          if (res) {
            this.$message.success('操作成功')
            this.checkDialogShow = false
            this.onQuery()
          }
        })
        .catch((err) => {
          console.log(err)
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

  // .base-page-wrap-hd {
  // }

  .base-page-wrap-bd {
    height: 0;
    flex: 1;
    flex-basis: 0;
  }

  // .base-page-wrap-ft {
  // }
}
</style>
