<template>
  <div class="tabs-content">
    <icon-title>
      <template #title>审批完成列表</template>
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
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApprovalCompleted',
  props: {
    tableData: {
      type: Array,
      default: []
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
