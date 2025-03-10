<template>
  <div class="secondary-page-wrap">
    <!-- 筛选 -->
    <div class="filter-wrap has-return">
      <el-form ref="form" :inline="true">
        <el-form-item>
          <el-select v-model="form.factory" placeholder="请选择厂区" clearable @change="changeFactory()">
            <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.areaCode" placeholder="请选择区域" clearable @change="changeArea()">
            <el-option v-for="item in areaList" :key="item.areaId" :label="item.areaName" :value="item.areaCode"> </el-option>
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
          :default-time="['00:00:00', '23:59:59']"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeTime()"
        >
        </el-date-picker>
      </div>
    </div>

    <div class="content-wrap">
      <div class="tab-container">
        <div class="tabs">
          <div :class="['tab', { active: activeTab === 'statistics' }]" @click="activeTab = 'statistics'">统计</div>
          <div :class="['tab', { active: activeTab === 'deviceList' }]" @click="activeTab = 'deviceList'">设备列表</div>
        </div>
      </div>
      <div class="body-wrap">
        <template v-if="activeTab == 'statistics'">
          <icon-title>
            <template #title>
              厂区 - {{ factoryList.length && factoryList.find((item) => item.code == form.factory).desc }}
            </template>
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
              />
            </el-table>
          </div>
          <div class="grid-container">
            <div class="grid-item">
              <div class="grid-row">
                <div class="grid-row-l">
                  <icon-title>
                    <template #title>在用数量</template>
                  </icon-title>
                  <div class="grid-row-fill">
                    <div style="height: 100%">
                      <pie-chart name="在用数量" :chartdata="chartsData.in_use" :opts="opts"></pie-chart>
                    </div>
                  </div>
                </div>
                <div class="grid-row-r">
                  <icon-title>
                    <template #title>规划数量</template>
                  </icon-title>
                  <div class="grid-row-fill">
                    <div style="height: 100%">
                      <pie-chart name="规划数量" :chartdata="chartsData.plan" :opts="opts"></pie-chart>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid-item">
              <div class="grid-row">
                <div class="grid-row-l">
                  <icon-title>
                    <template #title>设备运行状态</template>
                  </icon-title>
                  <div class="grid-row-fill">
                    <div style="height: 100%">
                      <pie-chart name="设备运行状态" :chartdata="chartsData.equipment_status" :opts="opts"></pie-chart>
                    </div>
                  </div>
                </div>
                <div class="grid-row-r">
                  <icon-title>
                    <template #title>仓储</template>
                  </icon-title>
                  <div class="grid-row-fill">
                    <div style="height: 100%">
                      <ring-chart name="仓储" :chartdata="chartsData.storage" :opts="opts"></ring-chart>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid-item grid-cell">
              <div class="grid-row" style="flex-direction: column">
                <icon-title>
                  <template #title>利用率</template>
                </icon-title>
                <div class="grid-row-fill">
                  <div class="grid-row">
                    <div class="grid-row-l">
                      <div style="height: 100%">
                        <pie-chart name="利用率" :chartdata="chartsData.utilization_rate" :opts="opts"></pie-chart>
                      </div>
                    </div>
                    <div class="grid-row-r">
                      <div style="height: 100%">
                        <bar-chart :chartdata="utilizationBarData"></bar-chart>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid-item">
              <div class="grid-row">
                <div class="grid-row-l">
                  <icon-title>
                    <template #title>运输任务量</template>
                  </icon-title>
                  <div class="grid-row-fill">
                    <div class="num-bg">
                      <p>运输任务量</p>
                      <span>{{ taskNumber }}</span>
                    </div>
                  </div>
                </div>
                <div class="grid-row-r">
                  <icon-title>
                    <template #title>仓储吞吐量</template>
                  </icon-title>
                  <div class="grid-row-fill">
                    <div class="num-bg">
                      <p>仓储吞吐量</p>
                      <span>{{ throughput }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid-item">
              <div class="grid-row" style="flex-direction: column">
                <icon-title>
                  <template #title>吞吐量统计</template>
                </icon-title>
                <div class="grid-row-fill">
                  <div style="height: 100%">
                    <line-chart name="吞吐量" :chartdata="taskStatistics"></line-chart>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="table-wrap" v-if="activeTab == 'deviceList'">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="uploadFile" label="设备图片" align="center">
              <template slot-scope="scope">
                <div @click="openImgView(scope.row.uploadFile)">
                  <el-image style="width: 60px; height: 60px" :src="scope.row.uploadFile" fit="fill">
                    <div slot="error" class="image-slot"></div>
                  </el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="类型编号" align="center"> </el-table-column>
            <el-table-column prop="name" label="类型名称" align="center"> </el-table-column>
            <el-table-column prop="equipmentCount" label="设备总数" align="center"> </el-table-column>
            <el-table-column prop="devUtilizationRate" label="设备利用率" align="center">
              <template slot-scope="scope">
                <span :style="{ color: scope.row.devUtilizationRate < 80 ? 'red' : '#000' }">
                  {{ scope.row.devUtilizationRate }}
                </span>
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
            />
            <el-table-column width="90" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="detailTable(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-image-viewer v-if="showViewer" :url-list="previewSrcList" :on-close="closeViewer" />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import LineChart from './line-chart.vue'
import PieChart from './pie-chart.vue'
import RingChart from './ring-chart.vue'
import BarChart from './bar-chart.vue'

export default {
  name: 'homeDetail',
  components: { ElImageViewer, LineChart, PieChart, RingChart, BarChart },
  data() {
    return {
      routeData: {},
      isFuture: 0,
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
      tableData: [],
      form: {
        factory: '',
        areaCode: '',
        area: []
      },
      deviceTypeArr: [],
      // 工厂列表
      factoryList: [],
      // 区域列表
      areaList: [],
      showViewer: false,
      previewSrcList: [],
      headTableData: [],
      isLoading: false,
      tableHeaders: [],
      bottomTableHeaders: [],
      activeTab: 'statistics', // 默认选中统计标签页,
      chartsData: {
        in_use: [],
        equipment_status: [],
        storage: [],
        plan: [],
        throughput_task: [],
        utilization_rate: []
      },
      utilizationBarData: [],
      opts: {
        legend: false,
        label: true,
        name: false
      },
      taskNumber: 0,
      throughput: 0,
      taskStatistics: []
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
      }
    }
  },
  created() {
    let obj = JSON.parse(this.$route.query.data)
    this.routeData = obj

    this.activeName = this.routeData.act || 'day'

    if (this.routeData.timeR) {
      this.timeR = this.routeData.timeR
    } else {
      const startOfDay = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const endOfDay = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.timeR = [startOfDay, endOfDay]
    }
  },
  mounted() {
    this.queryFactoryList()
  },
  methods: {
    changeFactory() {
      this.areaList = []
      this.form.areaCode = ''
      this.queryAreaList()
      this.queryPageData()
    },
    changeArea() {
      this.queryPageData()
    },
    changeTime() {
      this.queryPageData()
    },
    typeHover(type) {
      this.activeName = type
      if (this.activeName == 'day') {
        const startOfDay = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
        const endOfDay = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
        this.timeR = [startOfDay, endOfDay]
      }
      if (this.activeName == 'week') {
        const now = this.$moment()
        const oneWeekAgo = this.$moment().subtract(1, 'weeks')
        this.timeR = [oneWeekAgo.startOf('day').format('YYYY-MM-DD HH:mm:ss'), now.endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      }
      if (this.activeName == 'month') {
        const now = this.$moment()
        const oneWeekAgo = this.$moment().subtract(1, 'month')
        this.timeR = [oneWeekAgo.startOf('day').format('YYYY-MM-DD HH:mm:ss'), now.endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      }
      if (this.activeName == 'year') {
        const now = this.$moment()
        const oneWeekAgo = this.$moment().subtract(1, 'year')
        this.timeR = [oneWeekAgo.startOf('day').format('YYYY-MM-DD HH:mm:ss'), now.endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      }

      if (this.form.factory) {
        this.queryPageData()
      }
    },
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res || []

          // 先默认选中第一项
          if (!this.form.factory) {
            this.form.factory = this.routeData.factoryCode || this.factoryList[0].code
            this.queryAreaList()
          }
        } else {
          this.factoryList = []
        }
      })
    },
    queryAreaList() {
      this.$api.equipment
        .FactoryArea({
          factoryCode: this.form.factory
        })
        .then((res) => {
          if (res) {
            this.areaList = res || []
          } else {
            this.areaList = []
          }
          this.queryPageData()
        })
    },
    async queryPageData() {
      try {
        this.isLoading = true
        await this.queryHeadTableData()
        await this.queryTableData()
        if (this.activeTab == 'statistics') {
          this.$nextTick(async () => {
            await this.queryInUse()
            await this.queryPlanUse()
            await this.queryEquipmentStatus()
            await this.queryWarehousing()
            await this.queryUtilization()
            await this.queryUtilizationBar()
            await this.queryNum()
            await this.queryNumStatistics()
          })
        }
      } catch (error) {
        // error
      } finally {
        this.isLoading = false
      }
    },
    queryHeadTableData() {
      this.$api.equipment
        .GetEquipmentThroughputHeadAll({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
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
    queryTableData() {
      this.$api.equipment
        .EquipmentThroughput({
          factoryCode: this.form.factory,
          // this.form.area.join(',')
          areaCode: this.form.areaCode,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          // status: this.isFuture
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          enumCode: 'hierarchy_two'
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
    queryInUse() {
      this.$api.factory
        .getEquipmentThroughputNormalData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode
        })
        .then((res) => {
          if (res) {
            this.chartsData.in_use = res.map((item) => {
              return {
                ...item
              }
            })
          }
        })
    },
    queryPlanUse() {
      this.$api.factory
        .getEquipmentThroughputNoNormalData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode
        })
        .then((res) => {
          if (res) {
            this.chartsData.plan = res.map((item) => {
              return {
                ...item
              }
            })
          }
        })
    },
    queryEquipmentStatus() {
      this.$api.factory
        .getEquipmentThroughputStatusData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode
        })
        .then((res) => {
          if (res) {
            this.chartsData.equipment_status = res.map((item) => {
              return {
                ...item,
                name: item.xaxis
              }
            })
          }
        })
    },
    queryWarehousing() {
      this.$api.factory
        .getEquipmentThroughputStorageProportionData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode
        })
        .then((res) => {
          if (res) {
            this.chartsData.storage = res.map((item) => {
              return {
                ...item
              }
            })
          }
        })
    },
    queryUtilization() {
      this.$api.factory
        .getEquipmentThroughputTimeStatusData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          if (res) {
            this.chartsData.utilization_rate = res.map((item) => {
              return {
                ...item,
                name: item.xaxis
              }
            })
          }
        })
    },
    queryUtilizationBar() {
      this.$api.factory
        .getEquipmentThroughputStatusStatistics({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          if (res) {
            this.utilizationBarData = res.map((item) => {
              return {
                ...item
              }
            })
          }
        })
    },
    queryNum() {
      this.$api.factory
        .getEquipmentThroughputTaskData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          if (res) {
            this.throughput = res[0].throughput
            this.taskNumber = res[0].taskNumber
          }
        })
    },
    queryNumStatistics() {
      // this.$api.equipment
      //   .GetEquipmentUtilizationRateData({
      //     factoryCode: this.form.factory,
      //     areaCode: this.form.areaCode,
      //     time: this.typeData.find((item) => item.code == this.activeName).desc,
      //     startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
      //     endTime: this.timeR && this.timeR[1] ? this.timeR[1] : ''
      //   })
      //   .then((res) => {
      //     if (res) {
      //       this.taskStatistics = res || []
      //     } else {
      //       this.taskStatistics = []
      //     }
      //   })

      this.$api.factory
        .queryHandlingCapacityStatistics({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          startDate: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endDate: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          // error
          if (res) {
            this.taskStatistics = res
          }
        })
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
        name: row.name,
        factoryCode: this.form.factory,
        areaCode: this.form.areaCode,
        deviceType: row.code,
        act: this.activeName,
        timeR: this.timeR
      }

      this.$router.push({
        path: '/home-device-type',
        query: {
          data: JSON.stringify(obj)
        }
      })
    },
    getStatusStyle({ row, column }) {
      // && row.devUtilizationRate < 80
      if (column.property == 'devUtilizationRate') {
        // , color: '#fff'
        return { background: '#ff3737' }
      }
      return {}
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

.content-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;
}

.tab-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #f2f3f4;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  user-select: none;
  border-bottom: 2px solid transparent;
  /* 默认无边框 */
}

.tab.active {
  border-bottom: 3px solid #1bccfe;
}

.body-wrap {
  height: 0;
  flex: 1;
  flex-basis: 0;

  display: flex;
  flex-direction: column;

  .grid-container {
    height: 0;
    flex: 1;
    flex-basis: 0;

    .grid-item {
      .grid-row {
        height: 100%;
        display: flex;

        .grid-row-l,
        .grid-row-r {
          flex: 50%;

          display: flex;
          flex-direction: column;
        }
      }

      .grid-row-fill {
        height: 0;
        flex: 1;
        flex-basis: 0;
      }

      &.grid-cell {
        grid-row: 2 / 3; /* 第二行 */
        grid-column: 1 / 3; /* 跨两列 */
      }
    }
  }
}

.num-bg {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: url(../../assets/imgs/new-sb2.png) center no-repeat;

  p {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
  }
  span {
    font-size: 32px;
    font-weight: bold;
    color: #3b6062;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
}
</style>
