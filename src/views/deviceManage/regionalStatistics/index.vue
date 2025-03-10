<template>
  <div class="secondary-page-wrap">
    <!-- 筛选 -->
    <div class="filter-wrap">
      <el-form ref="form" :inline="true">
        <el-form-item>
          <el-select v-model="form.factory" clearable placeholder="厂区" @change="queryTableData">
            <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="filter-wrap-r">
        <el-button
          v-for="(item, index) in typeData"
          :key="index"
          @click="typeHover(item.code)"
          :class="activeName == item.code ? 'grayish-blue-select' : 'grayish-blue'"
          type="primary"
          >{{ item.desc }}</el-button
        >
        <el-divider direction="vertical"></el-divider>
        <el-date-picker
          v-model="timeR"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeIsFuture"
        >
        </el-date-picker>
      </div>
    </div>

    <div class="content-wrap">
      <icon-title>
        <template #title>{{ $route.meta.title }}</template>
      </icon-title>
      <div class="headTable-wrap">
        <el-table :data="headTableData" style="width: 100%">
          <el-table-column prop="equipmentCount" label="设备总数" align="center"> </el-table-column>
          <el-table-column prop="devUtilizationRate" label="设备利用率" align="center">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.devUtilizationRate < 80 ? 'red' : '#000' }">{{
                scope.row.devUtilizationRate
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="总吞吐量" align="center"> </el-table-column>
          <el-table-column prop="start" label="吐量" align="center"> </el-table-column>
          <el-table-column prop="end" label="吞量" align="center"> </el-table-column>
          <el-table-column prop="equipmentYes" label="运行数量" align="center"> </el-table-column>
          <el-table-column prop="equipmentNo" label="异常数量" align="center"> </el-table-column>
          <el-table-column
            align="center"
            v-for="(header, index) in tableHeaders"
            :key="index"
            :prop="header.prop"
            :label="header.label"
          >
          </el-table-column>
        </el-table>
      </div>

      <div class="charts-wrap">
        <icon-title>
          <template #title>利用率统计</template>
        </icon-title>
        <line-chart :chartdata="chartsData"></line-chart>
      </div>

      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="uploadFile" label="区域图片" align="center">
            <template slot-scope="scope">
              <div @click="openImgView(scope.row.uploadFile)">
                <el-image style="width: 60px; height: 60px" :src="scope.row.uploadFile" fit="fill">
                  <div slot="error" class="image-slot"></div>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="areaCode" label="区域编号" align="center"> </el-table-column>
          <el-table-column prop="areaName" label="区域名称" align="center"> </el-table-column>
          <el-table-column prop="equipmentCount" label="设备总数" align="center"> </el-table-column>
          <el-table-column prop="devUtilizationRate" label="设备利用率" align="center">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.devUtilizationRate < 80 ? 'red' : '#000' }">{{
                scope.row.devUtilizationRate
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="总吞吐量" align="center"> </el-table-column>
          <el-table-column prop="start" label="吐量" align="center"> </el-table-column>
          <el-table-column prop="end" label="吞量" align="center"> </el-table-column>
          <el-table-column prop="equipmentYes" label="运行数量" align="center"> </el-table-column>
          <el-table-column prop="equipmentNo" label="异常数量" align="center"> </el-table-column>
          <el-table-column
            align="center"
            v-for="(header, index) in bottomTableHeaders"
            :key="index"
            :prop="header.prop"
            :label="header.label"
          >
          </el-table-column>
          <el-table-column width="90" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="detailTable(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-image-viewer v-if="showViewer" :url-list="previewSrcList" :on-close="closeViewer" />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import LineChart from '../../home/line-chart.vue'

export default {
  name: 'RegionalStatistics',
  components: { ElImageViewer, LineChart },
  data() {
    return {
      form: {
        factory: ''
      },
      factoryList: [],
      typeData: [
        {
          desc: '日',
          code: 'day'
        },
        {
          desc: '周',
          code: 'week'
        },
        {
          desc: '月',
          code: 'month'
        },
        {
          desc: '年',
          code: 'year'
        }
      ],
      timeR: [],
      activeName: 'day',
      headTableData: [],
      tableHeaders: [],
      bottomTableHeaders: [],
      tableData: [],
      chartsData: [],
      showViewer: false,
      previewSrcList: []
    }
  },
  watch: {
    activeName(newValue, oldValue) {
      if (newValue) {
        if (newValue == 'day') {
          const startOfDay = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
          const endOfDay = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
          this.timeR = [startOfDay, endOfDay]
        }
        if (newValue == 'week') {
          const now = this.$moment()
          const oneWeekAgo = this.$moment().subtract(1, 'weeks')
          this.timeR = [oneWeekAgo.startOf('day').format('YYYY-MM-DD HH:mm:ss'), now.endOf('day').format('YYYY-MM-DD HH:mm:ss')]
        }
        if (newValue == 'month') {
          const now = this.$moment()
          const oneWeekAgo = this.$moment().subtract(1, 'month')
          this.timeR = [oneWeekAgo.startOf('day').format('YYYY-MM-DD HH:mm:ss'), now.endOf('day').format('YYYY-MM-DD HH:mm:ss')]
        }
        if (newValue == 'year') {
          const now = this.$moment()
          const oneWeekAgo = this.$moment().subtract(1, 'year')
          this.timeR = [oneWeekAgo.startOf('day').format('YYYY-MM-DD HH:mm:ss'), now.endOf('day').format('YYYY-MM-DD HH:mm:ss')]
        }

        this.queryTableData()
      }
    }
  },
  created() {
    const startOfDay = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    const endOfDay = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.timeR = [startOfDay, endOfDay]
  },
  mounted() {
    this.queryFactoryList()
  },
  methods: {
    // 查询工厂列表
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res
          // 先默认选中第一项
          if (!this.form.factory) {
            this.form.factory = this.factoryList[0].code
            this.queryTableData()
          }
        }
      })
    },
    queryHeadTableData() {
      // GetEquipmentThroughputHeadAll GetEquipmentAreaHeadAll
      this.$api.equipment
        .GetEquipmentThroughputHeadAll({
          factoryCode: this.form.factory,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          if (res) {
            this.headTableData = res?.jsonList ?? []
            this.tableHeaders = res?.enumsList ?? []
          } else {
            this.headTableData = []
            this.tableHeaders = []
          }
        })
    },
    queryChartsData() {
      this.$api.factory
        .queryHandlingCapacityStatistics({
          factoryCode: this.form.factory,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          startDate: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endDate: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          if (res) {
            this.chartsData = res || []
          } else {
            this.chartsData = []
          }
        })
    },
    // 查询表格数据
    queryTableData() {
      this.queryHeadTableData()
      this.queryChartsData()

      this.$api.equipment
        .GetEquipmentAreaData({
          factoryCode: this.form.factory,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          if (res) {
            this.tableData = res?.jsonObjectList || []
            this.bottomTableHeaders = res?.enumsList ?? []
          } else {
            this.tableData = []
            this.bottomTableHeaders = []
          }
        })
    },
    typeHover(type) {
      this.activeName = type
      this.queryTableData()
    },
    changeIsFuture() {
      this.queryTableData()
    },
    openImgView(img) {
      this.previewSrcList = [img]
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    detailTable(row) {
      let obj = {
        from: 'rs',
        areaCode: row.areaCode,
        factoryCode: this.form.factory,
        deviceType: row.code
      }

      this.$router.push({
        path: '/home-device-type',
        query: {
          data: JSON.stringify(obj)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.grayish-blue {
  background-color: #83bed0;
  border-color: #83bed0;
}
.grayish-blue-select {
  background-color: #22b7e1;
  border-color: #22b7e1;
}
.blue-btn {
  background-color: #83bed0;
  border-color: #83bed0;
}
.blue-btn-select {
  background-color: #25a2ff;
  border-color: #25a2ff;
}
</style>
