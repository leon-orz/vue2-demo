<template>
  <div class="tabs-content">
    <icon-title>
      <template #title>审批列表</template>
    </icon-title>

    <div class="table-wrap">
      <el-table :data="tableData" border stripe>
        <el-table-column align="center" type="index" label="序号" width="70" />
        <el-table-column align="center" prop="equChaRevCode" label="申请单号" />
        <el-table-column align="center" prop="equipmentCode" label="设备编码" />
        <el-table-column align="center" prop="equipmentName" label="设备名称" />
        <el-table-column align="center" prop="equChaRevDesc" label="申请内容" />
        <el-table-column align="center" prop="equChaRevTypeDesc" label="申请类型" />
        <el-table-column align="center" prop="equChaRevEvaluationDesc" label="回退原因" />
        <el-table-column align="center" prop="equChaRevNoPassDesc" label="申请不通过原因" />
        <el-table-column align="center" prop="equChaRevStartTime" label="申请日期" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onPass(scope.row)">通过</el-button>
            <el-button type="danger" size="mini" @click="toTurnDown(scope.row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="拒绝原因" :visible.sync="backShow" width="50%" @close="onClose">
      <div>
        <el-input v-model="reason" placeholder="请输入拒绝原因" clearable></el-input>
      </div>
      <span slot="footer">
        <el-button @click="backShow = false">取消</el-button>
        <el-button type="primary" @click="onTurnDown">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Approval',
  props: {
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      backItem: {},
      backShow: false,
      reason: ''
    }
  },
  methods: {
    onPass(row) {
      this.$confirm('确定提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          equChaRevCode: row.equChaRevCode
        }
        this.$api.equipment.ApprovedEquipmentChangeReview(params).then((res) => {
          this.$message.success('提交成功')
          this.$emit('refresh')
        })
      })
    },
    toTurnDown(row) {
      this.backItem = row
      this.reason = ''
      this.backShow = true
    },
    onTurnDown() {
      const params = {
        equChaRevCode: this.backItem.equChaRevCode,
        equChaRevNoPassDesc: this.reason
      }
      this.$api.equipment.NoPassEquipmentChangeReview(params).then((res) => {
        this.$message.success('提交成功')
        this.$emit('refresh')
        this.onClose()
      })
    },
    onClose() {
      this.reason = ''
      this.backItem = {}
      this.backShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.tabs-content {
  height: 0;
  flex: 1;
  flex-basis: 0;

  display: flex;
  flex-direction: column;

  .table-wrap {
    height: 0;
    flex: 1;
    flex-basis: 0;
  }
}
</style>
