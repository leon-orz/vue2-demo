<template>
  <div class="base-page-wrap">
    <div class="base-page-cntr">
      <icon-title>
        <template #title>设备状态</template>
      </icon-title>

      <div class="base-table-wrap">
        <el-table :data="equipmentStatusData" border stripe height="100%" style="width: 100%">
          <el-table-column align="center" prop="factoryCode" label="工厂编码" />
          <el-table-column align="center" prop="factoryName" label="工厂名称" />
          <el-table-column align="center" prop="type" label="设备类型" />
          <el-table-column align="center" prop="typeName" label="设备类型名称" />
          <el-table-column align="center" prop="allCount" label="设备总数" />
          <el-table-column align="center" prop="breakdownCount" label="故障数" />
          <el-table-column align="center" prop="checkCount" label="点检数量" />
        </el-table>
      </div>
    </div>

    <div class="base-page-cntr">
      <icon-title>
        <template #title>服务器监控</template>
      </icon-title>

      <div class="base-table-wrap">
        <div class="server-wrap">
          <div class="server-cntr" v-for="(item, index) in serverMonitoringData" :key="index">
            <div class="server-card">
              <div class="server-card-hd">
                <p>{{ item.serviceIp }}</p>
                <p>{{ item.stateDate }}</p>
              </div>
              <div class="server-card-bd" v-for="(s, si) in item.serviceList" :key="si">
                <p>{{ s.service }}</p>

                <div class="server-card-bd-item" v-for="(d, di) in s.demoList" :key="di">
                  <p>{{ d.demo }}</p>
                  <p>{{ d.result }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewOfStatus',
  data() {
    return {
      equipmentStatusData: [],
      serverMonitoringData: []
    }
  },
  created() {},
  mounted() {
    this.queryEquipmentStatus()
    this.queryServerMonitoring()
  },
  methods: {
    queryEquipmentStatus() {
      this.$api.equipment.QueryEquipmentStateBoardListByFactoryCode().then((res) => {
        if (res) {
          this.equipmentStatusData = res || []
        } else {
          this.equipmentStatusData = []
        }
      })
    },
    queryServerMonitoring() {
      this.$api.equipment.ServerSurveillanceQueryListByParam({}).then((res) => {
        if (res) {
          this.serverMonitoringData = res || []
        } else {
          this.serverMonitoringData = []
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

  display: grid;
  grid-template-rows: 40% 60%;
  grid-template-columns: 100%;

  .base-page-cntr {
    display: flex;
    flex-direction: column;

    .base-table-wrap {
      height: 0;
      flex: 1;
      flex-basis: 0;
    }
  }
}
.server-wrap {
  width: 100%;
  height: 100%;
  overflow: auto;

  .server-cntr {
    float: left;
    width: 25%;
  }

  .server-card {
    height: 250px;
    margin: 10px;
    padding: 20px;
    border-radius: 8px;
    background: #e3f2fd;
    // border: 1px solid #90caf9;
    color: #212121;
    overflow: auto;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

    display: flex;
    flex-direction: column;

    .server-card-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      font-weight: bold;
      p + p {
        margin-left: 15px;
      }
    }

    .server-card-bd {
      font-size: 16px;
      margin-top: 15px;
    }

    .server-card-bd-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #757575;
      line-height: 2;
      border-bottom: 1px solid #b3e5fc;
      padding: 5px 10px;
      margin-top: 10px;
    }
  }
}
</style>
