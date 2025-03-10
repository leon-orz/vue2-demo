<template>
  <div class="base-page-wrap">
    <div class="base-page-wrap-hd"></div>
    <icon-title>
      <template #title> {{ isEquipmentCheckRecord ? '设备保养记录' : '设备保养' }}详情 </template>
    </icon-title>
    <div class="base-page-wrap-bd">
      <el-table :data="tableData" border stripe height="100%" style="width: 100%" v-loading="tableLoading">
        <el-table-column align="center" prop="serialNumber" label="序号" width="70" />
        <el-table-column align="center" prop="orderCode" label="保养工单号" min-width="120" />
        <el-table-column align="center" prop="statusName" label="状态" />
        <el-table-column align="center" prop="part" label="保养部位" />
        <el-table-column align="center" prop="upkeepDesc" label="保养内容" />
        <el-table-column align="center" prop="standard" label="保养标准" />
        <el-table-column align="center" prop="methodName" label="保养方法" />
        <el-table-column align="center" prop="duty" label="实施方" />
        <el-table-column align="center" prop="upkeepTime" label="保养日期" />
        <el-table-column align="center" prop="equipmentCode" label="设备编码" />
        <el-table-column align="center" prop="upkeepResult" label="保养结果" />
        <el-table-column align="center" prop="note" label="备注" />
        <el-table-column align="center" label="操作" v-if="!isEquipmentCheckRecord">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openCheck(scope.row)">保养</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base-page-wrap-ft"></div>

    <el-dialog title="设备保养" :visible.sync="checkDialogShow" width="30%" @click="onCheckClose()">
      <el-form label-width="120px" :inline="false">
        <el-form-item label="保养结果">
          <el-select v-model="checkForm.upkeepResult" placeholder="请选择" clearable filterable>
            <el-option label="OK" value="OK"> </el-option>
            <el-option label="NG" value="NG"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养记录备注">
          <el-input v-model="checkForm.orderNote"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="checkDialogShow = false">取消</el-button>
        <el-button type="primary" @click="onCheckConfirm()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EquipmentCheckDetails',
  data() {
    return {
      form: {
        code: ''
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableLoading: false,
      orderCode: '',
      checkDialogShow: false,
      checkForm: {
        upkeepResult: '',
        orderNote: '',
        checkCode: '',
        checkId: ''
      },
      isEquipmentCheckRecord: false
    }
  },
  created() {
    this.orderCode = this.$route.query.orderCode || ''
    this.isEquipmentCheckRecord = this.$route.query.from && this.$route.query.from == 'equipmentMaintenanceRecord' ? true : false
  },
  mounted() {
    this.onQuery()
  },
  methods: {
    // 查询 保养信息
    onQuery() {
      const params = {
        orderCode: this.orderCode
      }

      this.tableLoading = true

      this.$api.equipment
        .EquipmentUpkeepOrderDetailQueryListByOrderCodes(params)
        .then((res) => {
          if (res) {
            this.tableData = res || []
          } else {
            this.tableData = []
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // 设备保养 窗口
    openCheck(row) {
      this.checkForm.checkCode = row.orderCode
      this.checkForm.checkId = row.id
      this.checkDialogShow = true
    },
    onCheckClose() {
      this.checkForm = {
        upkeepResult: '',
        orderNote: '',
        checkCode: '',
        checkId: ''
      }
      this.checkDialogShow = false
    },
    onCheckConfirm() {
      const params = {
        orderCode: this.checkForm.checkCode,
        id: this.checkForm.checkId,
        upkeepResult: this.checkForm.upkeepResult,
        note: this.checkForm.orderNote
      }

      this.$api.equipment
        .EquipmentUpkeepOrderDetailUpdateByIds([params])
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
