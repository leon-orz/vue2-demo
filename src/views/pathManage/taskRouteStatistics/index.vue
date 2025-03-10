<template>
  <div class="base-page-wrap">
    <div class="path-wrap">
      <div class="path-wrap-l">
        <div class="tips">
          运行状态：
          <p><i class="tips-a"></i>大于10</p>
          <p><i class="tips-b"></i>大于5且小于10</p>
          <p><i class="tips-c"></i>小于5</p>
        </div>
        <div class="img-wrap" ref="imgWrap">
          <img :src="dynamicImageSrc" alt="" />
          <svg class="path-wrapper" ref="mapSvgRef"></svg>
          <div class="points-list">
            <div
              class="points-item"
              v-for="(item, idx) in points"
              :class="item.colorClass"
              :key="idx"
              :style="{ left: item.svgX + '%', top: item.svgY + '%' }"
            >
              <i />
              <div class="name">{{ item.pathMainName }} {{ item.pointName }}</div>
              <div class="line-start" v-if="item.location == 'start'">起</div>
              <div class="line-end" v-if="item.location == 'end'">终</div>
              <!-- <div>{{ item.count }}</div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="path-wrap-r">
        <div class="select-wrap">
          <el-select v-model="factoryCode" placeholder="请选择" @change="queryData()">
            <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
          </el-select>
          <el-select style="margin-left: 10px" v-model="type" placeholder="请选择" @change="queryData()">
            <el-option label="路线" value="path"> </el-option>
            <el-option label="分组" value="group"> </el-option>
          </el-select>
        </div>
        <icon-title>
          <template #title>任务明细栏</template>
        </icon-title>
        <div class="table-wrap">
          <el-table :data="tableData" border stripe height="100%" style="width: 100%">
            <el-table-column align="center" prop="pathName" label="路线编号" />
            <el-table-column align="center" prop="count" label="次数" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapDialogDraggable from './mapDialogDraggable.js'
import mapDialogWheelscale from './mapDialogWheelscale.js'

export default {
  name: 'TaskRouteStatistics',
  data() {
    return {
      tableData: [],
      factoryList: [],
      factoryCode: '',
      type: 'path',
      points: [],
      colorLen: 6
    }
  },
  computed: {
    dynamicImageSrc() {
      // 假设有一个逻辑来决定哪个图片应该被显示
      return this.factoryCode == 'factory_one'
        ? require('@/assets/c1.jpg')
        : this.factoryCode == 'factory_two'
        ? require('@/assets/c2.jpg')
        : require('@/assets/c3.jpg')
    }
  },
  created() {
    this.queryFactoryList()
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.imgWrap

      // 滚轮缩放
      mapDialogWheelscale({
        el,
        speed: 0.5,
        // 为了居中
        translateX: `-50%`,
        translateY: `-50%`
      })
      // 拖拽
      mapDialogDraggable({ el })
    })
  },
  methods: {
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res || []

          // 先默认选中第一项
          if (!this.factoryCode) {
            this.factoryCode = this.factoryList[0].code
            this.queryData()
          }
        } else {
          this.factoryList = []
        }
      })
    },
    queryData() {
      this.$api.path.PathNameBoardVO({ factoryCode: this.factoryCode, type: this.type }).then((res) => {
        if (res) {
          this.tableData = res || []
        } else {
          this.tableData = []
        }
        this.renderLineAndPoint(this.tableData)
      })
    },
    renderLineAndPoint(list) {
      const self = this
      const points = []
      const svg = this.$refs.mapSvgRef
      svg.innerHTML = ''

      list.forEach((path) => {
        // 大于10  小于10 大于 5  小于5
        let status = 'd'
        if (path.count) {
          status = path.count >= 10 ? 'a' : path.count >= 5 ? 'b' : 'c'
        }

        if (!path.pointList || path.pointList.length === 0) return

        // 点位
        const pathPoints = path.pointList.map((item, index) => {
          return {
            ...item,
            pathMainId: path.pathMainId,
            pathMainCode: path.pathMainCode,
            pathMainName: path.pathMainName,
            count: path.count,
            colorClass: `points-class-${status}`,
            location: index == 0 ? 'start' : index == path.pointList.length - 1 ? 'end' : ''
          }
        })
        points.push(...pathPoints)

        // 路径
        wirteLine(path.pointList, status)
      })

      this.points = points

      function wirteLine(pathPointList, status) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        const className = 'polyline-class-' + status // 颜色区分

        pathPointList.forEach((point, pointIdx) => {
          if (pointIdx === 0) return
          const { x: x1, y: y1 } = self.pointPos2SvgPos(pathPointList[pointIdx - 1])
          const { x: x2, y: y2 } = self.pointPos2SvgPos(point)
          const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
          polyline.setAttribute('class', className)
          polyline.setAttribute('points', `${x1},${y1} ${x2},${y2}`)
          polyline.setAttribute('stroke-width', 5)
          polyline.setAttribute('stroke-dasharray', 'none')
          polyline.setAttribute('fill', 'none')
          polyline.setAttribute('stroke-linecap', 'round')
          group.appendChild(polyline)
        })

        svg.appendChild(group)
      }
    },

    // 点位坐标转换svg
    pointPos2SvgPos({ svgX, svgY }) {
      const { offsetWidth, offsetHeight } = this.$refs.imgWrap
      return {
        x: (svgX / 100) * offsetWidth,
        y: (svgY / 100) * offsetHeight
      }
    }
  }
}
</script>

<style lang="less" scoped>
.base-page-wrap {
  width: 100%;
  height: 100%;

  background: rgba(255, 255, 255, 0.35) url('@/assets/icons/组8.svg') no-repeat top right 10px;
  border-radius: 6px;
  overflow: hidden;
}

.path-wrap {
  width: 100%;
  height: 100%;
  background: #fff;

  display: flex;

  .path-wrap-l {
    width: 0;
    flex: 1;
    flex-basis: 0;

    background: #48647c;

    position: relative;

    .tips {
      position: absolute;
      top: 5px;
      left: 10px;
      display: flex;
      align-items: center;

      font-size: 15px;
      color: #fff;

      p {
        display: flex;
        align-items: center;
        line-height: 1;

        & + p {
          margin-left: 10px;
        }
      }

      i {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        margin-right: 5px;

        &.tips-a {
          background-color: var(--path-map-color-a);
        }
        &.tips-b {
          background-color: var(--path-map-color-b);
        }
        &.tips-c {
          background-color: var(--path-map-color-c);
        }
      }
    }

    .img-wrap {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;

      .path-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }

      .points-list {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        .points-item {
          display: inline-block;
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          // background-color: rgba(7, 255, 73, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          /* 为了不变形 将元素写大后使用scale缩小 */
          transform: translateX(-50%) translateY(-50%) scale(0.2);

          i {
            // background-color: rgb(7, 255, 73);
            width: 60%;
            height: 60%;
            border-radius: 50%;
            display: inline-block;
          }

          .name {
            display: none;
            padding: 4px;
            font-size: 12px;
            position: absolute;
            transform: scale(5) translateX(50%);
            top: 0;
            left: 30px;
            color: white;
            // border-left: 3px solid rgb(7, 255, 73);
            border-left-width: 3px;
            border-left-style: solid;
            background-color: #00000090;
            z-index: 999;
            white-space: normal;
            word-break: keep-all;
          }

          &:hover {
            .name {
              display: inline-block;
            }
          }

          .line-start,
          .line-end {
            position: absolute;
            top: -100%;
            left: 0;
            margin-top: -100%;
            margin-left: 8px;
            width: 30px;
            height: 30px;
            scale: calc(5);
            border-radius: 50%;
            font-size: 12px;
            color: #fff;
            line-height: 30px;
            text-align: center;
            z-index: 999;
          }
          .line-start {
            background: #ff4545;

            &::after {
              content: '';
              display: block;
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 8px solid #ff4545;
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
          .line-end {
            background: #22be28;

            &::after {
              content: '';
              display: block;
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 8px solid #22be28;
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
        }
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
      user-select: none;
      pointer-events: none;
      object-fit: contain;
    }
  }

  .path-wrap-r {
    width: 35%;
    padding: 30px 20px;

    display: flex;
    flex-direction: column;

    .select-wrap {
      margin-bottom: 10px;
    }

    .table-wrap {
      height: 0;
      flex: 1;
      flex-basis: 0;
    }
  }
}
</style>

<style>
:root {
  /* 预设颜色 */
  --path-map-color-a: #ff4545;
  --path-map-color-b: #ff9345;
  --path-map-color-c: #00d186;
  --path-map-color-d: #24a4e2;

  --path-map-color-a-opacity: rgba(255, 69, 69, 0.3);
  --path-map-color-b-opacity: rgba(255, 147, 69, 0.3);
  --path-map-color-c-opacity: rgba(0, 209, 132, 0.3);
  --path-map-color-d-opacity: rgba(36, 163, 226, 0.3);
}

.path-wrapper polyline {
  transition: all 1s linear;
  animation-duration: 120s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-name: svg-polyline;
}

@keyframes svg-polyline {
  from {
    stroke-dashoffset: 2000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

img {
  pointer-events: none;
  user-select: none;
}

/* 预设颜色 */
.block-class-a {
  background-color: var(--path-map-color-a);
}
.polyline-class-a {
  stroke: var(--path-map-color-a);
}
.points-item.points-class-a {
  background-color: var(--path-map-color-a-opacity);
}
.points-item.points-class-a > i {
  background-color: var(--path-map-color-a);
}
.points-item.points-class-a .name {
  border-color: var(--path-map-color-a);
}

/* 预设颜色 */
.block-class-b {
  background-color: var(--path-map-color-b);
}
.polyline-class-b {
  stroke: var(--path-map-color-b);
}
.points-item.points-class-b {
  background-color: var(--path-map-color-b-opacity);
}
.points-item.points-class-b > i {
  background-color: var(--path-map-color-b);
}
.points-item.points-class-b .name {
  border-color: var(--path-map-color-b);
}

/* 预设颜色 */
.block-class-c {
  background-color: var(--path-map-color-c);
}
.polyline-class-c {
  stroke: var(--path-map-color-c);
}
.points-item.points-class-c {
  background-color: var(--path-map-color-c-opacity);
}
.points-item.points-class-c > i {
  background-color: var(--path-map-color-c);
}
.points-item.points-class-c .name {
  border-color: var(--path-map-color-c);
}

/* 预设颜色 */
.block-class-d {
  background-color: var(--path-map-color-d);
}
.polyline-class-d {
  stroke: var(--path-map-color-d);
}
.points-item.points-class-d {
  background-color: var(--path-map-color-d-opacity);
}
.points-item.points-class-d > i {
  background-color: var(--path-map-color-d);
}
.points-item.points-class-d .name {
  border-color: var(--path-map-color-d);
}
</style>
