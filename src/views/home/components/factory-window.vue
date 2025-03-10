<template>
  <div class="info-wrap" :class="location">
    <p class="info-wrap-title">
      <i></i><span>{{ title }}</span>
    </p>
    <div class="info-wrap-row">
      <div class="info-row-l" v-if="chartsData.in_use">
        <pie-chart name="在用数量" :chartdata="chartsData.in_use" :opts="opts"></pie-chart>
      </div>
      <i class="info-row-d"></i>
      <div class="info-row-r" v-if="chartsData.plan">
        <pie-chart name="规划数量" :chartdata="chartsData.plan" :opts="opts"></pie-chart>
      </div>
    </div>
    <div class="info-wrap-row">
      <div class="info-row-l" v-if="chartsData.equipment_status">
        <pie-chart name="设备运行状态" :chartdata="chartsData.equipment_status" :opts="opts"></pie-chart>
      </div>
      <i class="info-row-d"></i>
      <div class="info-row-r" v-if="chartsData.storage">
        <ring-chart name="仓储" :chartdata="chartsData.storage" :opts="opts"></ring-chart>
      </div>
    </div>
    <div class="info-wrap-row">
      <div class="info-row-l">
        <div class="info-num">
          <div class="info-num-bd" v-if="chartsData.throughput_task">
            <div class="info-num-item">
              <p>仓储吞吐量</p>
              <span>{{ chartsData.throughput_task[0]?.throughput || 0 }}</span>
            </div>
            <div class="info-num-item">
              <p>运输任务量</p>
              <span>{{ chartsData.throughput_task[0]?.taskNumber || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      <i class="info-row-d"></i>
      <div class="info-row-r" v-if="chartsData.utilization_rate">
        <pie-chart name="利用率" :chartdata="chartsData.utilization_rate" :opts="opts"></pie-chart>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from '../pie-chart.vue'
import RingChart from '../ring-chart.vue'

export default {
  name: 'FactoryWindow',
  components: { PieChart, RingChart },
  props: {
    curFactory: {
      type: String,
      default: ''
    },
    curFactoryData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      opts: {
        legend: false,
        label: true,
        name: true
      }
    }
  },
  computed: {
    title() {
      if (this.curFactory == 'factory_all') {
        return '总厂区'
      } else if (this.curFactory == 'factory_one') {
        return '联一'
      } else if (this.curFactory == 'factory_two') {
        return '联二'
      } else if (this.curFactory == 'factory_three') {
        return '联三'
      } else {
        return '总厂区'
      }
    },
    location() {
      if (this.curFactory == 'factory_all') {
        return 'all'
      } else if (this.curFactory == 'factory_one') {
        return 'left'
      } else if (this.curFactory == 'factory_two') {
        return 'right'
      } else if (this.curFactory == 'factory_three') {
        return 'right'
      } else {
        return 'all'
      }
    },
    chartsData() {
      if (this.curFactoryData && this.curFactory) {
        if (this.curFactory !== 'factory_all') {
          const obj = Object.fromEntries(Object.entries(this.curFactoryData).filter(([key]) => key.includes(this.curFactory)))
          const obj2 = {}
          Object.keys(obj).forEach((item) => {
            const newKey = item.replace(this.curFactory + '-', '')
            obj2[newKey] = obj[item]
          })
          return obj2
        } else {
          return {
            ...this.curFactoryData
          }
        }
      } else {
        return {
          in_use: [],
          equipment_status: [],
          storage: [],
          plan: [],
          throughput_task: [],
          utilization_rate: []
        }
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.info-wrap {
  position: absolute;
  z-index: 1;
  width: 600px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0px 4px 19px 0px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  transition: all 0.3s;
  pointer-events: none;

  &.all {
    top: 0;
    left: 0;
  }

  &.left {
    top: 50%;
    left: 0%;
    transform: translateY(-50%);
  }

  &.right {
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
  }

  .info-wrap-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;

    display: flex;
    align-items: center;

    i {
      display: inline-block;
      width: 30px;
      height: 30px;
      background: url(../../../assets/imgs/new-sbt.png) no-repeat;
      background-size: cover;
      margin-right: 10px;
    }
  }

  .info-wrap-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: relative;

    // & + .info-wrap-row {
    //   margin-top: 5px;
    // }
  }

  .info-row-d {
    width: 2px;
    height: 50px;
    margin: 0 10px;
    background: #d0d0d0;
  }

  .info-row-l,
  .info-row-r {
    flex: 50%;
    height: 200px; // 150px
    // border: 1px solid #000;
  }

  .info-num {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .info-num-bd {
      width: 210px;
      height: 110px;
      border-radius: 6px;
      background: #d4e2e5;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }

    p {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      line-height: 16px;
    }
    span {
      font-size: 26px;
      color: #31595a;
      font-weight: bold;
      line-height: 30px;
    }
  }
}
</style>
