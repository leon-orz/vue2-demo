<template>
  <div class="tabs-content">
    <icon-title>
      <template #title>评估列表</template>
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
            <el-button type="primary" size="mini" @click="onEvaluate(scope.row)">确认</el-button>
            <el-button type="danger" size="mini" @click="toBackspace(scope.row)">回退</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="回退原因" :visible.sync="backShow" width="50%" @close="onClose">
      <div>
        <el-input v-model="reason" placeholder="请输入回退原因" clearable></el-input>
      </div>
      <span slot="footer">
        <el-button @click="backShow = false">取消</el-button>
        <el-button type="primary" @click="onBackspace">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Evaluate',
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
    onEvaluate(row) {
      this.$confirm('确定提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          equChaRevCode: row.equChaRevCode
        }
        this.$api.equipment.ConfirmEvaluationEquipmentChangeReview(params).then((res) => {
          this.$message.success('提交成功')
          this.$emit('refresh')
        })
      })
    },
    toBackspace(row) {
      this.backItem = row
      this.reason = ''
      this.backShow = true
    },
    onBackspace() {
      const params = {
        equChaRevCode: this.backItem.equChaRevCode,
        equChaRevEvaluationDesc: this.reason
      }
      this.$api.equipment.BackEvaluationEquipmentChangeReview(params).then((res) => {
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
