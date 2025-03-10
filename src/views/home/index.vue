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
  </div>
</template>

<script>
import svgData from '../../assets/14.svg'

export default {
  name: 'home',
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
      mainFactoryTableData: [],
      factoryTableData: [],
      timeR: [],

      svgSrc: svgData || '',
      timer: null
    }
  },
  created() {
    const now = this.$moment()
    const oneWeekAgo = this.$moment().subtract(1, 'weeks')
    this.timeR = [oneWeekAgo.format('YYYY-MM-DD HH:mm:ss'), now.format('YYYY-MM-DD HH:mm:ss')]
  },
  mounted() {},
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
            data: JSON.stringify({ orgCode: 'factory_one' })
          }
        })
      })
      c2.addEventListener('click', () => {
        this.$router.push({
          path: '/home-area',
          query: {
            data: JSON.stringify({ orgCode: 'factory_two' })
          }
        })
      })
      c3.addEventListener('click', () => {
        this.$router.push({
          path: '/home-area',
          query: {
            data: JSON.stringify({ orgCode: 'factory_three' })
          }
        })
      })

      const c1c = svgDoc.getElementById('Group changfang1')
      const c2c = svgDoc.getElementById('Group changfang2')
      const c3c = svgDoc.getElementById('Group changfang3')
      const c1l = svgDoc.getElementById('Group 1707479939')
      const c2l = svgDoc.getElementById('Group 1707479955')
      const c3l = svgDoc.getElementById('Group 1707479956')
      // Group 1707479956 Group 1707479955 Group 1707479939

      c1c.style.display = 'none'
      c1l.style.display = 'none'
      c2c.style.display = 'none'
      c2l.style.display = 'none'
      c3c.style.display = 'none'
      c3l.style.display = 'none'

      c1.addEventListener('mouseenter', () => {
        c1c.style.display = 'block'
        c1l.style.display = 'block'
      })
      c2.addEventListener('mouseenter', () => {
        c2c.style.display = 'block'
        c2l.style.display = 'block'
      })
      c3.addEventListener('mouseenter', () => {
        c3c.style.display = 'block'
        c3l.style.display = 'block'
      })

      c1.addEventListener('mouseleave', () => {
        c1c.style.display = 'none'
        c1l.style.display = 'none'
      })
      c2.addEventListener('mouseleave', () => {
        c2c.style.display = 'none'
        c2l.style.display = 'none'
      })
      c3.addEventListener('mouseleave', () => {
        c3c.style.display = 'none'
        c3l.style.display = 'none'
      })

      this.queryMainFactoryAreaEquipment()
      this.queryFactoryEquipment()

      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.queryMainFactoryAreaEquipment()
        this.queryFactoryEquipment()
      }, 1000 * 60)
    },
    renderSvgz() {
      const svgRef = this.$refs.svgObject
      const svgDoc = svgRef.contentDocument

      if (!svgDoc) {
        console.error('SVG document not available.')
        return
      }

      const cz = svgDoc && svgDoc.getElementById('zongchangqu')

      if (!cz) {
        console.error('SVG document getElementById error.')
        return
      }
      const data = this.mainFactoryTableData[0].homePageList[0]
      if (data.enumsList && data.enumsList.length) {
        data.enumsList.forEach((item) => {
          if (!item.count) {
            svgDoc.getElementById(item.id).style.display = 'none'
          } else {
            // ${item.name}:
            svgDoc.getElementById(item.id).getElementsByTagName('tspan')[1].innerHTML = `${item.count}`
          }
        })
      }

      svgDoc.getElementById('shuliang_0').getElementsByTagName('tspan')[1].innerHTML = `${data.devCount || 0}`
      svgDoc.getElementById('liyonglv_0').getElementsByTagName('tspan')[1].innerHTML = `${data.devUtilizationRate || 0}`
      svgDoc.getElementById('guzhanglv_0').getElementsByTagName('tspan')[1].innerHTML = `${data.devFailureRate || 0}`
      svgDoc.getElementById('tuntuzongliang_0').getElementsByTagName('tspan')[1].innerHTML = `${data.count || 0}`
      svgDoc.getElementById('tunliang_0').getElementsByTagName('tspan')[1].innerHTML = `${data.end || 0}`
      svgDoc.getElementById('tuliang_0').getElementsByTagName('tspan')[1].innerHTML = `${data.start || 0}`
    },
    renderSvg() {
      const svgRef = this.$refs.svgObject
      const svgDoc = svgRef.contentDocument

      if (!svgDoc) {
        console.error('SVG document not available.')
        return
      }

      let dataList = []
      this.factoryTableData.forEach((item) => {
        if (item.homePageList && item.homePageList.length) {
          dataList.push(item.homePageList[0])
        }
      })

      dataList.forEach((el, i) => {
        // 静态固定的label shuliang_1 shuliang_2_2 shuliang_3_2
        let idPath = i > 0 ? `_${i + 1}_2` : `_${i + 1}`
        svgDoc.getElementById(`shuliang${idPath}`).getElementsByTagName('tspan')[1].innerHTML = `${el.devCount || 0}`
        svgDoc.getElementById(`liyonglv${idPath}`).getElementsByTagName('tspan')[1].innerHTML = `${el.devUtilizationRate || 0}`
        svgDoc.getElementById(`guzhanglv${idPath}`).getElementsByTagName('tspan')[1].innerHTML = `${el.devFailureRate || 0}`
        svgDoc.getElementById(`tuntuzongliang${idPath}`).getElementsByTagName('tspan')[1].innerHTML = `${el.count || 0}`
        svgDoc.getElementById(`tunliang${idPath}`).getElementsByTagName('tspan')[1].innerHTML = `${el.end || 0}`
        svgDoc.getElementById(`tuliang${idPath}`).getElementsByTagName('tspan')[1].innerHTML = `${el.start || 0}`
        // //给动态数据控制显隐
        if (el.enumsList && el.enumsList.length) {
          el.enumsList.forEach((item) => {
            item.count == 0
              ? (svgDoc.getElementById(item.id).style.display = 'none')
              : (svgDoc.getElementById(item.id).getElementsByTagName('tspan')[1].innerHTML = ` ${item.count}`)
            // ${item.name}:
          })
        }
      })
    },
    // 查询总厂区设备
    queryMainFactoryAreaEquipment() {
      this.$api.equipment
        .MainFactoryAreaEquipment({
          // isFuture: this.isFuture,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          time: this.typeData.find((item) => item.code == this.activeName).desc
        })
        .then((res) => {
          if (res) {
            this.mainFactoryTableData = res
            this.$nextTick(() => {
              this.renderSvgz()
            })
          }
        })
    },
    // 查询厂区设备
    queryFactoryEquipment() {
      this.$api.equipment
        .FactoryEquipment({
          // isFuture: this.isFuture,
          startTime: this.timeR && this.timeR[0] ? this.timeR[0] : '',
          endTime: this.timeR && this.timeR[1] ? this.timeR[1] : '',
          time: this.typeData.find((item) => item.code == this.activeName).desc
        })
        .then((res) => {
          if (res) {
            this.factoryTableData = res
            this.$nextTick(() => {
              this.renderSvg()
            })
          }
        })
    },
    typeHover(type) {
      this.activeName = type

      this.queryMainFactoryAreaEquipment()
      this.queryFactoryEquipment()
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
