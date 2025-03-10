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
        <el-form-item>
          <el-select v-model="form.deviceType" placeholder="设备类型" clearable @change="changeDeviceType()">
            <el-option v-for="item in deviceTypeArr" :key="item.id" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.device" placeholder="设备" clearable @change="changeDevice()">
            <el-option v-for="item in deviceList" :key="item.id" :label="item.equipmentName" :value="item.equipmentCode">
            </el-option>
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
          <div :class="['tab', { active: activeTab === 'statistics' }]" @click="onTab('statistics')">统计</div>
          <div :class="['tab', { active: activeTab === 'deviceList' }]" @click="onTab('deviceList')">日志列表</div>
          <div
            :class="['tab', { active: activeTab === 'subDevice' }]"
            v-if="subDeviceData.length > 0"
            @click="onTab('subDevice')"
          >
            子设备列表
          </div>
        </div>
      </div>
      <div class="body-wrap">
        <template v-if="activeTab == 'statistics'">
          <icon-title>
            <template #title>设备</template>
          </icon-title>
          <div class="headTable-wrap">
            <el-table :data="deviceTableData" style="width: 100%">
              <el-table-column prop="uploadFile" label="设备图片" align="center">
                <template slot-scope="scope">
                  <div @click="openImgView(scope.row.uploadFile)">
                    <el-image style="width: 40px; height: 40px" :src="scope.row.uploadFile" fit="fill">
                      <div slot="error" class="image-slot"></div>
                    </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="code" label="设备编号" align="center"> </el-table-column>
              <el-table-column prop="name" label="设备名称" align="center"> </el-table-column>
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
              <el-table-column prop="equipmentYes" label="运行状态" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.equipmentYes == 0 ? '异常' : '正常' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="equipmentNo" label="异常次数" align="center"> </el-table-column>
              <el-table-column prop="currentStatusDesc" label="设备运行状态" align="center"> </el-table-column>
            </el-table>
          </div>

          <div class="grid-container">
            <div class="grid-item grid-cell-1">
              <div class="grid-row">
                <div class="grid-row-l">
                  <icon-title>
                    <template #title>设备运行状态</template>
                  </icon-title>
                  <div class="grid-row-fill">
                    <div class="device-status">
                      <i></i>
                      <div class="device-status-info">
                        <p>设备编号: {{ deviceInfo?.equipmentCode }}</p>
                        <p>设备名称: {{ deviceInfo?.equipmentName }}</p>
                        <p>状态: {{ deviceInfo?.statusDesc }}</p>
                        <p>更新时间: {{ deviceInfo?.updateTime }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grid-row-r" v-if="form.deviceType == 'SB-CC' || form.deviceType == 'SB-DK'">
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
                <div class="grid-row-l" v-if="form.deviceType !== 'SB-CC' && form.deviceType !== 'SB-DK'">
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
                <div class="grid-row-r" v-else>
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
                  <template #title>
                    {{ form.deviceType == 'SB-CC' || form.deviceType == 'SB-DK' ? '吞吐量统计' : '任务数统计' }}
                  </template>
                </icon-title>
                <div class="grid-row-fill">
                  <div style="height: 100%">
                    <line-chart
                      :name="form.deviceType == 'SB-CC' || form.deviceType == 'SB-DK' ? '吞吐量' : '任务数'"
                      :chartdata="taskStatistics"
                    ></line-chart>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-if="activeTab == 'deviceList'">
          <div class="device-table-wrap">
            <div class="table-wrap">
              <icon-title>
                <template #title>吞吐量日志列表</template>
              </icon-title>
              <div class="table-content">
                <el-table :data="throughputLog" height="100%" style="width: 100%">
                  <el-table-column prop="registerTime" label="记录时间" align="center"> </el-table-column>
                  <el-table-column prop="pathMainCode" label="路径编码" align="center"> </el-table-column>
                  <el-table-column prop="equipmentCode" label="设备编号" align="center"> </el-table-column>
                  <el-table-column prop="equipmentName" label="设备名称" align="center"> </el-table-column>
                  <el-table-column prop="typeDesc" label="任务类型" align="center"> </el-table-column>
                  <el-table-column prop="startCodeName" label="起始道口" align="center"> </el-table-column>
                  <el-table-column prop="endCodeName" label="结束道口" align="center"> </el-table-column>
                  <el-table-column prop="questCode" label="任务编码" align="center" min-width="200"> </el-table-column>
                </el-table>
              </div>
              <el-pagination
                @current-change="tuntuPageChange"
                :current-page.sync="tuntuPage.pageNum"
                :page-size="tuntuPage.pageSize"
                layout="total, prev, pager, next"
                :total="tuntuPage.total"
                background
              >
              </el-pagination>
            </div>

            <div class="table-wrap">
              <icon-title>
                <template #title>状态日志列表</template>
              </icon-title>
              <div class="table-content">
                <el-table :data="statusLog" height="100%" style="width: 100%">
                  <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
                  <el-table-column prop="statusDesc" label="设备状态" align="center"> </el-table-column>
                  <el-table-column prop="stateSt" label="时长" align="center"> </el-table-column>
                  <el-table-column prop="startTime" label="状态开始时间" align="center"> </el-table-column>
                  <el-table-column prop="endTime" label="状态结束时间" align="center"> </el-table-column>
                </el-table>
              </div>
              <el-pagination
                @current-change="statusPageChange"
                :current-page.sync="statusPage.pageNum"
                :page-size="statusPage.pageSize"
                layout="total, prev, pager, next"
                :total="statusPage.total"
                background
              >
              </el-pagination>
            </div>
          </div>
        </template>

        <!-- 子设备列表 -->
        <template v-if="activeTab == 'subDevice'">
          <icon-title>
            <template #title>子设备列表</template>
          </icon-title>
          <div class="subDevice-table-wrap">
            <el-table :data="subDeviceData" border stripe>
              <el-table-column align="center" prop="code" label="设备编号" />
              <el-table-column align="center" prop="name" label="设备名称" />
              <el-table-column align="center" prop="devUtilizationRate" label="设备利用率" />
              <el-table-column align="center" prop="count" label="总吞吐量" />
              <el-table-column align="center" prop="start" label="吐量" />
              <el-table-column align="center" prop="end" label="吞量" />
              <el-table-column align="center" prop="equipmentYes" label="运行状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.equipmentYes == 0 ? '异常' : '正常' }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="equipmentNo" label="异常次数" />
              <el-table-column align="center" prop="currentStatusDesc" label="资产状态" />
              <el-table-column align="center" prop="scrapCount" label="报废数量" />
              <el-table-column align="center" prop="transferCount" label="转移数量" />
              <el-table-column align="center" prop="traWarehouseCount" label="转库数量" />
              <el-table-column width="90" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="detailTable(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="text-align: right">
            <el-pagination
              @size-change="subDeviceSizeChange"
              @current-change="subDeviceCurrentChange"
              :current-page.sync="subDevicePageData.pageNum"
              :page-sizes="[20, 40, 80, 100]"
              :page-size="subDevicePageData.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="subDevicePageData.total"
              background
            >
            </el-pagination>
          </div>
        </template>
      </div>
    </div>

    <el-image-viewer v-if="showViewer" :url-list="previewSrcList" :on-close="closeViewer" />
  </div>
</template>

<script>
import { barLineEcharVray } from './throughput'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import LineChart from './line-chart.vue'
import PieChart from './pie-chart.vue'
import RingChart from './ring-chart.vue'
import BarChart from './bar-chart.vue'

export default {
  name: 'deviceStatement',
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
      form: {
        factory: '',
        areaCode: '',
        area: [],
        deviceType: '',
        device: ''
      },
      // 工厂列表
      factoryList: [],
      // 区域列表
      areaList: [],
      // 设备类型
      deviceTypeArr: [],
      // 设备列表
      deviceList: [],
      deviceTableData: [],
      showViewer: false,
      previewSrcList: [],
      pieData: {
        devReliability: 0,
        devUtilizationRate: 0,
        devEfficiency: 0,
        devFailureRate: 0
      },
      activeTab: 'statistics', // 默认选中统计标签页

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
        legend: true,
        label: true,
        name: false
      },
      taskNumber: 0,
      throughput: 0,
      taskStatistics: [],
      // 吞吐量日志
      throughputLog: [],
      tuntuPage: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      statusLog: [],
      statusPage: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      deviceInfo: null,
      subDeviceData: [],
      subDevicePageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
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
    const actData = this.$ls.get('activeName')
    // if (actData && actData.device) {
    //   this.routeData = actData
    // } else {
    this.routeData = obj
    // }

    this.form.factory = this.routeData.factoryCode || ''
    this.form.areaCode = this.routeData.areaCode || ''
    this.form.deviceType = this.routeData.deviceType || ''
    this.form.device = this.routeData.device || ''

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
    this.queryAreaList()
    this.queryDeviceType()
    this.queryDeviceList()

    this.queryPageData()
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
    changeDeviceType() {
      const cur = this.deviceTypeArr.find((item) => item.code == this.form.deviceType)
      this.deviceTypeName = cur.desc
      this.deviceList = []
      this.form.device = ''

      this.queryDeviceList()
    },
    changeDevice() {
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

      this.$ls.set('activeName', {
        id: this.routeData.id,
        factoryCode: this.form.factory,
        areaCode: this.form.areaCode,
        deviceType: this.form.deviceType,
        device: this.form.device,
        act: this.activeName
      })

      if (this.form.factory) {
        this.queryPageData()
      }
    },
    onTab(type) {
      this.activeTab = type
      this.queryPageData()
    },
    getStatusStyle({ row, column }) {
      // && row.devUtilizationRate < 80
      if (column.property == 'devUtilizationRate') {
        // , color: '#fff'
        return { background: '#ff3737' }
      }
      return {}
    },
    // 查询工厂列表
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res || []

          // 先默认选中第一项
          if (!this.form.factory) {
            this.form.factory = this.factoryList[0].code
          }
        } else {
          this.factoryList = []
        }
      })
    },
    // 查询区域列表 根据工厂编码
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
        })
    },
    // 查询设备类型
    queryDeviceType() {
      this.$api.masterData.getPrecisionData({ function: 'SB' }).then((res) => {
        if (res) {
          this.deviceTypeArr = res || []
        } else {
          this.deviceTypeArr = []
        }
      })
    },
    // 查询设备列表
    queryDeviceList() {
      this.$api.equipment
        .EquipmentList({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          type: this.form.deviceType
        })
        .then((res) => {
          if (res) {
            this.deviceList = res || []
          } else {
            this.deviceList = []
          }
        })
    },
    // 查询设备信息
    queryDeviceInfo() {
      const cur = this.deviceList.find((item) => item.equipmentCode == this.form.device)
      this.$api.equipment
        .EquipmentThroughputEquipmentDetail({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          type: this.form.deviceType,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          // status: this.isFuture,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          equipmentCode: cur ? cur.equipmentCode : this.form.device
        })
        .then((res) => {
          if (res) {
            this.deviceTableData = res || []
          } else {
            this.deviceTableData = []
          }
          this.querySubDevice()
        })
    },
    querySubDevice() {
      this.$api.equipment
        .QuerySonEquipmentList({
          id: this.deviceTableData[0].id,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          ...this.subDevicePageData
        })
        .then((res) => {
          if (res && res.list) {
            this.subDeviceData = res.list || []
            this.subDevicePageData.total = res.total || 0
          } else {
            this.subDeviceData = []
            this.subDevicePageData.total = 0
          }
        })
    },
    subDeviceSizeChange(val) {
      this.subDevicePageData.pageSize = val
      this.querySubDevice()
    },
    subDeviceCurrentChange(val) {
      this.subDevicePageData.pageNum = val
      this.querySubDevice()
    },
    queryDeviceByCode() {
      const cur = this.deviceList.find((item) => item.equipmentCode == this.form.device)
      this.$api.equipment
        .GetByCode({
          code: cur ? cur.equipmentCode : this.form.device,
          type: this.form.deviceType
        })
        .then((res) => {
          if (res) {
            this.deviceInfo = res || []
          } else {
            this.deviceInfo = []
          }
        })
    },
    // 查询吞吐量日志
    queryThroughputLog() {
      const cur = this.deviceList.find((item) => item.equipmentCode == this.form.device)
      this.$api.equipment
        .EquipmentThroughputLog({
          equipmentCode: cur ? cur.equipmentCode : this.form.device,
          type: this.form.deviceType,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          ...this.tuntuPage
        })
        .then((res) => {
          if (res && res.list) {
            this.throughputLog = res.list || []
            this.tuntuPage.total = res.total
          } else {
            this.throughputLog = []
            this.tuntuPage.total = 0
          }
        })
    },
    tuntuPageChange(val) {
      this.tuntuPage.pageNum = val
      this.queryThroughputLog()
    },
    // 状态日志 log
    queryStatusLog() {
      const cur = this.deviceList.find((item) => item.equipmentCode == this.form.device)
      this.$api.equipment
        .QueryPageListByEquipmentCode({
          equipmentCode: cur ? cur.equipmentCode : this.form.device,
          startDate: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endDate: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          ...this.statusPage
        })
        .then((res) => {
          if (res && res.list) {
            this.statusLog = res.list || []
            this.statusPage.total = res.total
          } else {
            this.statusLog = []
            this.statusPage.total = 0
          }
        })
    },
    statusPageChange(val) {
      this.statusPage.pageNum = val
      this.queryStatusLog()
    },
    // pieChart
    openImgView(img) {
      this.previewSrcList = [img]
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    conditionQuery() {
      let self = this
      this.queryPageData()
    },
    async queryPageData() {
      try {
        this.isLoading = true
        await this.queryDeviceInfo()
        await this.queryDeviceByCode()
        await this.queryThroughputLog()
        await this.queryStatusLog()

        if (this.activeTab == 'statistics') {
          this.$nextTick(async () => {
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

    queryWarehousing() {
      this.$api.factory
        .getEquipmentThroughputStorageProportionData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          type: this.form.deviceType,
          equipmentCode: this.form.device
        })
        .then((res) => {
          if (res) {
            this.chartsData.storage = res.map((item) => {
              return {
                ...item
              }
            })
          } else {
            this.chartsData.storage = []
          }
        })
    },
    queryUtilization() {
      this.$api.factory
        .getEquipmentThroughputTimeStatusData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          type: this.form.deviceType,
          equipmentCode: this.form.device,
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
          } else {
            this.chartsData.utilization_rate = []
          }
        })
    },
    queryUtilizationBar() {
      this.$api.factory
        .getEquipmentThroughputStatusStatistics({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          type: this.form.deviceType,
          equipmentCode: this.form.device,
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
          } else {
            this.utilizationBarData = []
          }
        })
    },
    queryNum() {
      this.$api.factory
        .getEquipmentThroughputTaskData({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          type: this.form.deviceType,
          equipmentCode: this.form.device,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          if (res) {
            this.throughput = res[0].throughput
            this.taskNumber = res[0].taskNumber
          } else {
            this.throughput = 0
            this.taskNumber = 0
          }
        })
    },
    queryNumStatistics() {
      this.$api.factory
        .queryHandlingCapacityStatistics({
          factoryCode: this.form.factory,
          areaCode: this.form.areaCode,
          type: this.form.deviceType,
          equipmentCode: this.form.device,
          time: this.typeData.find((item) => item.code == this.activeName).desc,
          startDate: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endDate: this.timeR && this.timeR[1] ? this.timeR[1] : ''
        })
        .then((res) => {
          // error
          if (res) {
            this.taskStatistics = res || []
          } else {
            this.taskStatistics = []
          }
        })
    },

    detailTable(row) {
      let obj = {
        factoryCode: this.form.factory,
        areaCode: this.form.areaCode,
        deviceType: this.form.deviceType,
        device: this.form.device,
        subCode: row.code,
        act: this.activeName,
        timeR: this.timeR
      }
      this.$router.push({
        path: '/home-device-sub',
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
  background-color: #25a2ff;
  border-color: #25a2ff;
}
.center-flex {
  margin-top: 0.8vw;
  height: 35vh;
  flex: 1;
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

      &.grid-cell-1 {
        grid-row: 1 / 2; /* 第一行 */
        grid-column: 1 / 3; /* 第一列 */
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

.device-status {
  width: 100%;
  height: 100%;
  display: flex;

  i {
    flex: 50%;
    height: 100%;
    background: url(../../assets/imgs/new-sb1.png) center no-repeat;
    background-size: contain;
  }

  .device-status-info {
    flex: 50%;

    p {
      background: url(../../assets/imgs/new-sb3.png) left top no-repeat;
      line-height: 40px;
      padding-left: 42px;

      & + p {
        margin-top: 10px;
      }
    }
  }
}

.device-table-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-wrap {
    height: 50%;
    flex: 1;
    flex-basis: 50%;

    display: flex;
    flex-direction: column;

    .table-content {
      height: 0;
      flex: 1;
      flex-basis: 0;
    }
  }
}

.subDevice-table-wrap {
  height: 0;
  flex: 1;
  flex-basis: 0;
  margin: 10px 0;
}
</style>
