<template>
  <div class="tabs-content">
    <icon-title>
      <template #title>申请录入列表</template>
      <template #right>
        <div style="text-align: right">
          <el-button type="primary" size="small" @click="onBatchApplication">提交申请</el-button>
          <el-button type="primary" size="small" @click="addShow = true">新增</el-button>
        </div>
      </template>
    </icon-title>

    <div class="table-wrap">
      <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"> </el-table-column>
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
            <el-button type="primary" size="mini" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="onDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="addShow" width="50%" @close="onClose">
      <el-form :inline="false">
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="设备类型">
              <el-select v-model="form.equipmentType" placeholder="请选择设备类型" @change="changeEquipmentType">
                <el-option v-for="item in equipmentTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="设备">
              <el-select v-model="form.equipmentCode" placeholder="请选择设备" @change="changeEquipmentCode">
                <el-option
                  v-for="item in equipmentList"
                  :key="item.id"
                  :label="item.equipmentName + '-' + item.equipmentCode"
                  :value="item.equipmentCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0">
            <el-form-item label="申请类型">
              <el-select v-model="form.equChaRevType" placeholder="请选择" clearable filterable>
                <el-option v-for="item in typeList" :key="item.id" :label="item.desc" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :offset="0">
            <el-form-item label="申请内容">
              <el-input v-model="form.equChaRevDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button @click="addShow = false">取消</el-button>
        <el-button type="primary" @click="onAdd()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RequestEntry',
  props: {
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selects: [],
      addShow: false,
      form: {
        equipmentType: '',
        equipmentCode: '',
        equipmentName: '',
        equChaRevType: '',
        equChaRevDesc: ''
      },
      equipmentTypeList: [],
      equipmentList: [],
      typeList: [],
      title: '新增'
    }
  },
  mounted() {
    this.queryEquipmentTypeList()
    this.queryType()
  },
  methods: {
    handleSelectionChange(val) {
      this.selects = val
    },
    onBatchApplication() {
      if (!this.selects.length) return this.$message.error('请先选择')

      this.$confirm('确定提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          equChaRevCodes: this.selects.map((item) => item.equChaRevCode).join()
        }
        this.$api.equipment.BatchSubmitEquipmentChangeReview(params).then((res) => {
          this.$message.success('提交成功')
          this.$emit('refresh')
        })
      })
    },

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
      this.form.equipmentCode = ''
      this.form.equipmentName = ''
      this.queryEquipmentList()
    },
    // 查询设备
    queryEquipmentList() {
      const params = {
        type: this.form.equipmentType
      }
      this.$api.equipment.EquipmentList(params).then((res) => {
        if (res) {
          this.equipmentList = res || []
        }
      })
    },
    // 选择设备
    changeEquipmentCode() {
      const cur = this.equipmentList.find((item) => item.equipmentCode === this.form.equipmentCode)
      this.form.equipmentName = cur.equipmentName
    },
    queryType() {
      const params = { function: 'SBZT' }
      this.$api.equipment.GetEquipmentStatusList(params).then((res) => {
        this.typeList = res
      })
    },
    // 新增
    onAdd() {
      const params = {
        ...this.form
      }
      if (this.title == '编辑') {
        this.$api.equipment.EditEquipmentChangeReview(params).then((res) => {
          this.$message.success('编辑成功')
          this.onClose()
          this.$emit('refresh')
        })
      } else {
        this.$api.equipment.AddEquipmentChangeReview(params).then((res) => {
          this.$message.success('新增成功')
          this.onClose()
          this.$emit('refresh')
        })
      }
    },
    // 编辑
    onEdit(row) {
      this.title = row ? '编辑' : '新增'
      this.form = {
        ...row
      }
      this.addShow = true
    },
    // 删除
    onDel(row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          equChaRevId: row.equChaRevId
        }
        this.$api.equipment.DelEquipmentChangeReview(params).then((res) => {
          this.$message.success('删除成功')
          this.$emit('refresh')
        })
      })
    },
    // 关闭
    onClose() {
      this.form = {
        equipmentType: '',
        equipmentCode: '',
        equipmentName: '',
        equChaRevType: '',
        equChaRevDesc: ''
      }
      this.title = '新增'
      this.addShow = false
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
