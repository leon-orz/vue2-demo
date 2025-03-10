<template>
  <div class="page-vessel column" style="width: 100%; height: 100%; padding: 0">
    <div class="content column">
      <div class="flex flex-end align-center">
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
          @change="changeIsFuture"
        >
        </el-date-picker>
      </div>
      <div class="flex full-height home-wrap" style="margin-top: 10px">
        <div class="svg-wrap">
          <object
            id="svgDom"
            ref="svgObject"
            :data="svgSrc"
            type="image/svg+xml"
            @load="onSVGLoad"
            width="100%"
            height="100%"
          ></object>
        </div>
      </div>
    </div>

    <factory-window :curFactory="curFactory" :curFactoryData="curData" />
  </div>
</template>

<script>
import svgData from '../../assets/16.svg'
import FactoryWindow from './components/factory-window.vue'
import FactoryWindowAll from './components/factory-window-all.vue'

let leaveTimer = null

export default {
  name: 'home',
  components: {
    FactoryWindow,
    FactoryWindowAll
  },
  data() {
    return {
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
      activeName: 'day',
      mainFactoryTableData: {},
      factoryTableData: {},
      timeR: [],

      svgSrc: svgData || '',
      timer: null,

      curFactory: '',
      curData: {}
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

        this.$nextTick(() => {
          this.queryMainFactoryAreaEquipment()
          this.queryFactoryEquipment()
        })
      }
    }
  },
  created() {
    const startOfDay = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    const endOfDay = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    this.timeR = [startOfDay, endOfDay]
  },
  mounted() {
    this.$nextTick(() => {
      this.queryMainFactoryAreaEquipment()
      this.queryFactoryEquipment()
    })

    // clearInterval(this.timer)
    // this.timer = setInterval(() => {
    //   this.queryMainFactoryAreaEquipment()
    //   this.queryFactoryEquipment()
    // }, 1000 * 60)
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    onSVGLoad(event) {
      // error
      const svgObject = this.$refs.svgObject
      const svgDoc = svgObject.contentDocument

      if (!svgDoc) {
        console.error('SVG document not available.')
        return
      }

      const c1 = svgDoc.getElementById('Group lian1')
      const c2 = svgDoc.getElementById('Group lian2')
      const c3 = svgDoc.getElementById('Group lian3')

      c1.addEventListener('click', () => {
        this.$router.push({
          path: '/home-area',
          query: {
            data: JSON.stringify({ factoryCode: 'factory_one', act: this.activeName, timeR: this.timeR })
          }
        })
      })
      c2.addEventListener('click', () => {
        this.$router.push({
          path: '/home-area',
          query: {
            data: JSON.stringify({ factoryCode: 'factory_two', act: this.activeName, timeR: this.timeR })
          }
        })
      })
      c3.addEventListener('click', () => {
        this.$router.push({
          path: '/home-area',
          query: {
            data: JSON.stringify({ factoryCode: 'factory_three', act: this.activeName, timeR: this.timeR })
          }
        })
      })

      c1.addEventListener('mouseenter', () => {
        leaveTimer && clearTimeout(leaveTimer)
        this.curData = this.factoryTableData
        this.curFactory = 'factory_one'
      })
      c2.addEventListener('mouseenter', () => {
        leaveTimer && clearTimeout(leaveTimer)
        this.curData = this.factoryTableData
        this.curFactory = 'factory_two'
      })
      c3.addEventListener('mouseenter', () => {
        leaveTimer && clearTimeout(leaveTimer)
        this.curData = this.factoryTableData
        this.curFactory = 'factory_three'
      })

      c1.addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(() => {
          this.curData = this.mainFactoryTableData
          this.curFactory = 'factory_all'
        }, 500)
      })
      c2.addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(() => {
          this.curData = this.mainFactoryTableData
          this.curFactory = 'factory_all'
        }, 500)
      })
      c3.addEventListener('mouseleave', () => {
        leaveTimer = setTimeout(() => {
          this.curData = this.mainFactoryTableData
          this.curFactory = 'factory_all'
        }, 500)
      })
    },
    // 查询总厂区设备
    queryMainFactoryAreaEquipment() {
      this.$api.factory
        .getFactoryHomePageCompanyMap({
          // isFuture: this.isFuture,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          time: this.typeData.find((item) => item.code == this.activeName).desc
        })
        .then((res) => {
          if (res) {
            this.mainFactoryTableData = res
            this.curData = this.mainFactoryTableData
            this.curFactory = 'factory_all'
          }
        })
    },
    // 查询厂区设备
    queryFactoryEquipment() {
      this.$api.factory
        .getFactoryHomePageMap({
          // isFuture: this.isFuture,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          time: this.typeData.find((item) => item.code == this.activeName).desc
        })
        .then((res) => {
          if (res) {
            this.factoryTableData = res
          }
        })
    },
    typeHover(type) {
      this.activeName = type
    },
    changeIsFuture() {
      // this.isFuture = this.isFuture == 0 ? 1 : 0
      this.queryMainFactoryAreaEquipment()
      this.queryFactoryEquipment()
    },
    jumpDetail(item) {
      let obj = {
        orgCode: item.orgCode
      }

      this.$router.push({
        path: '/home-area',
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

.chart-svg-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-shrink: 0;
}
::v-deep #svgcanvas {
  width: 100%;
  height: 100%;
}
.home-wrap {
  display: flex;
  flex-direction: column;
  // .table-wrap {
  //   .angle::after {
  //     // left: 0;
  //   }
  // }
  .svg-wrap {
    height: 0;
    flex: 1;
    flex-basis: 0;
  }
}
</style>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
