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
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <!-- search end -->
    </div>
    <div class="base-page-wrap-bd">
      <el-table :data="tableData" border stripe height="100%">
        <!-- <el-table-column align="center" type="index" label="序号" width="80" /> -->
        <!-- <el-table-column align="center" prop="equipmentId" label="设备" /> -->
        <!-- <el-table-column align="center" prop="type" label="点检类别" /> -->
        <el-table-column align="center" prop="typeDesc" label="点检类别" />
        <el-table-column align="center" prop="part" label="点检部位" />
        <el-table-column align="center" prop="need" label="点检需求" />
        <el-table-column align="center" prop="serial" label="序号" />
        <el-table-column align="center" prop="elapsedTime" label="标准耗时" />
        <el-table-column align="center" prop="note" label="备注" />
        <el-table-column align="center" prop="createTime" label="创建时间" />
        <!--<el-table-column prop="a" label="a"> </el-table-column> -->
      </el-table>
    </div>
    <!-- <div class="base-page-wrap-ft">3</div> -->
  </div>
</template>

<script>
export default {
  name: 'EquipmentRepair',
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
      tableData: []
    }
  },
  mounted() {
    this.queryFactoryList()
  },
  methods: {
    // 查询 点检信息
    onQuery() {
      const params = {
        equipmentCode: this.form.equipment
      }
      this.$api.equipment.GetEquipmentCheck(params).then((res) => {
        if (res) {
          this.tableData = res.checkItemList
        }
      })
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
