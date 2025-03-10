<template>
  <div class="info-wrap" v-if="factoryData">
    <p class="info-wrap-title"><i></i><span>总厂区</span></p>
    <div class="info-wrap-row">
      <div class="info-row-l" v-if="factoryData.in_use">
        <pie-chart name="在用数量" :chartdata="factoryData.in_use" :opts="opts"></pie-chart>
      </div>
      <i class="info-row-d"></i>
      <div class="info-row-r" v-if="factoryData.plan">
        <pie-chart name="规划数量" :chartdata="factoryData.plan" :opts="opts"></pie-chart>
      </div>
    </div>
    <div class="info-wrap-row">
      <div class="info-row-l" v-if="factoryData.equipment_status">
        <pie-chart name="设备运行状态" :chartdata="factoryData.equipment_status" :opts="opts"></pie-chart>
      </div>
      <i class="info-row-d"></i>
      <div class="info-row-r" v-if="factoryData.storage">
        <ring-chart name="仓储" :chartdata="factoryData.storage" :opts="opts"></ring-chart>
      </div>
    </div>
    <div class="info-wrap-row">
      <div class="info-row-l">
        <div class="info-num">
          <div class="info-num-bd" v-if="factoryData.throughput_task">
            <div class="info-num-item">
              <p>仓储吞吐量</p>
              <span>{{ factoryData.throughput_task[0]?.throughput || 0 }}</span>
            </div>
            <div class="info-num-item">
              <p>运输任务量</p>
              <span>{{ factoryData.throughput_task[0]?.taskNumber || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      <i class="info-row-d"></i>
      <div class="info-row-r" v-if="factoryData.utilization_rate">
        <pie-chart name="利用率" :chartdata="factoryData.utilization_rate" :opts="opts"></pie-chart>
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
    factoryData: {
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
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.info-wrap {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 550px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0px 4px 19px 0px rgba(0, 0, 0, 0.15);
  border-radius: 6px;

  &.left {
    top: 50%;
    right: 50%;
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
    height: 180px; // 150px
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
