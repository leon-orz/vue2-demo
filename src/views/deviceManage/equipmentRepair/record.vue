<template>
  <div class="base-page-wrap">
    <div class="base-page-wrap-hd">
      <!-- search start -->
      <el-form :inline="true">
        <el-form-item label="厂区">
          <el-select v-model="form.factory" placeholder="请选择厂区" @change="changeFactory">
            <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域">
          <el-select v-model="form.area" placeholder="请选择区域" @change="changeArea">
            <el-option v-for="item in areaList" :key="item.areaId" :label="item.areaName" :value="item.areaCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="form.equipmentType" placeholder="请选择设备类型" @change="changeEquipmentType">
            <el-option v-for="item in equipmentTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备">
          <el-select v-model="form.equipment" placeholder="请选择设备">
            <el-option
              v-for="item in equipmentList"
              :key="item.id"
              :label="item.equipmentName"
              :value="item.equipmentCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- search end -->
    </div>

    <icon-title>
      <template #title>设备维修记录</template>
      <template #right>
        <el-button type="primary" size="mini" @click="onAdd">新增</el-button>
      </template>
    </icon-title>

    <div class="base-page-wrap-bd">
      <el-table :data="tableData" border stripe height="100%">
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column align="center" prop="maintainCode" label="维修单号" />
        <el-table-column align="center" prop="equipmentCode" label="设备编码" />
        <el-table-column align="center" prop="equipmentName" label="设备名称" />
        <el-table-column align="center" prop="maintainDesc" label="维修内容" />
        <el-table-column align="center" prop="maintainMessage" label="故障原因" />
        <!-- <el-table-column align="center" prop="maintainType" label="故障类型" /> -->
        <el-table-column align="center" prop="maintainTypeDesc" label="故障类型" />
        <el-table-column align="center" prop="maintainDuration" label="维修时长" />
        <el-table-column align="center" prop="createTime" label="创建时间" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="onDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base-page-wrap-ft">
      <el-pagination
        @current-change="currentChange"
        :current-page.sync="page.pageNum"
        layout="total, prev, pager, next"
        :total="page.total"
        background
      >
      </el-pagination>
    </div>

    <dialog-box ref="dialogBox" @refresh="onQuery"></dialog-box>
  </div>
</template>

<script>
import DialogBox from './dialog.vue'
export default {
  name: 'EquipmentRepairRecord',
  components: {
    DialogBox
  },
  data() {
    return {
      form: {
        factory: '',
        area: '',
        equipmentType: '',
        equipment: ''
      },
      factoryList: [],
      areaList: [],
      equipmentTypeList: [],
      equipmentList: [],
      tableData: [],
      page: {
        total: 0,
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  mounted() {
    this.queryFactoryList()
    this.onQuery()
  },
  methods: {
    reset() {
      this.form = {
        factory: '',
        area: '',
        equipmentType: '',
        equipment: ''
      }
      this.page.pageNum = 1

      this.onQuery()
    },
    // 查询 点检信息
    onQuery() {
      const params = {
        equipmentCode: this.form.equipment,
        maintainCode: ''
      }
      this.$api.equipment.GetPageEquipmentMaintainList(params).then((res) => {
        if (res) {
          this.tableData = res.list
          this.page.total = res.total
        }
      })
    },
    currentChange(val) {
      this.page.pageNum = val
      this.onQuery()
    },
    onAdd() {
      this.$refs.dialogBox.open()
    },
    onUpdate(row) {
      this.$refs.dialogBox.open(row)
    },
    onDel(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // DelEquipmentMaintain
          this.$api.equipment.DelEquipmentMaintain({ id: row.id }).then((res) => {
            if (res) {
              this.$message.success('删除成功')
              this.onQuery()
            }
          })
        })
        .catch(() => {})
    },
    /* 选择工厂 */
    changeFactory() {
      this.form.area = ''
      this.form.equipmentType = ''
      this.form.equipment = ''
      this.queryAreaList()
    },
    /* 选择区域 */
    changeArea() {
      this.form.equipmentType = ''
      this.form.equipment = ''
      this.queryEquipmentTypeList()
    },
    /* 选择设备类型 */
    changeEquipmentType() {
      this.form.equipment = ''
      this.queryEquipmentList()
    },
    // 查询厂区列表
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res || []
        }
      })
    },
    // 查询区域
    queryAreaList() {
      const params = {
        factoryCode: this.form.factory
      }
      this.$api.equipment.FactoryArea(params).then((res) => {
        if (res) {
          this.areaList = res || []
        }
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
    // 查询设备
    queryEquipmentList() {
      const params = {
        factoryCode: this.form.factory,
        areaCodes: this.form.area,
        type: this.form.equipmentType
      }
      this.$api.equipment.EquipmentList(params).then((res) => {
        if (res) {
          this.equipmentList = res || []
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
