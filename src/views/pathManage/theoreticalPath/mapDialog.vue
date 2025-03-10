<template>
  <div class="map-dialog" v-if="dialogVisible">
    <div class="path-tag-wrapper">
      <div class="path-tag-wrapper-item" v-for="(path, pathIdx) in linePathList" :key="path.pathMainCode">
        <div class="path-tag-wrapper-item-block" :class="'block-class-' + ((pathIdx % colorLen) + 1)"></div>
        <div class="path-tag-wrapper-item-name">{{ path.pathMainName }}</div>
      </div>
    </div>
    <div class="map-wrapper" :style="wrapperStyle" ref="mapContainer">
      <img :src="dynamicImageSrc" />
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
        </div>
      </div>
    </div>
    <div class="map-dialog-close" @click="dialogVisible = false">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>
<script>
import mapDialogDraggable from './mapDialogDraggable.js'
import mapDialogWheelscale from './mapDialogWheelscale.js'
export default {
  name: 'mapDialog',
  data() {
    return {
      colorLen: 6,
      dialogVisible: false,
      wrapperStyle: {},
      points: [],
      linePathList: [],
      factoryCode: 'factory_one'
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
  mounted() {
    // 初始化svg地图大小
    const size = Math.min(window.innerWidth, window.innerHeight)
    console.log(size)
    // this.wrapperStyle = {
    //   width: size + 'px',
    //   height: size + 'px'
    // }
  },
  methods: {
    open({ thePathCode, factoryCode }) {
      this.factoryCode = factoryCode
      this.thePathCode = thePathCode
      this.dialogVisible = true
      this.getThePathDetailData()
      this.$nextTick(() => {
        const el = this.$refs.mapContainer

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

    getThePathDetailData() {
      const params = {
        thePathCode: this.thePathCode
      }
      this.$api.masterData.getThePathDetailData(params).then((res) => {
        if (res) {
          this.linePathList = res || []
        } else {
          this.linePathList = []
          this.$message.error('当前路线暂时没有路径')
        }
        this.renderLineAndPoint(this.linePathList)
      })
    },

    renderLineAndPoint(list) {
      const self = this
      const points = []
      const svg = this.$refs.mapSvgRef
      svg.innerHTML = ''

      list.forEach((path, idx) => {
        const colorClassCount = (idx % this.colorLen) + 1
        if (!path.pointList || path.pointList.length === 0) return

        // 点位
        const pathPoints = path.pointList.map((item) => {
          return {
            ...item,
            pathMainId: path.pathMainId,
            pathMainCode: path.pathMainCode,
            pathMainName: path.pathMainName,
            colorClass: `points-class-${colorClassCount}`
          }
        })
        points.push(...pathPoints)

        // 路径
        wirteLine(path.pointList, colorClassCount)
      })
      this.points = points

      function wirteLine(pathPointList, colorClass) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        const className = 'polyline-class-' + colorClass // 颜色区分

        pathPointList.forEach((point, pointIdx) => {
          if (pointIdx === 0) return
          const { x: x1, y: y1 } = self.pointPos2SvgPos(pathPointList[pointIdx - 1])
          const { x: x2, y: y2 } = self.pointPos2SvgPos(point)
          const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
          polyline.setAttribute('class', className)
          polyline.setAttribute('points', `${x1},${y1} ${x2},${y2}`)
          polyline.setAttribute('stroke-width', 3)
          polyline.setAttribute('stroke-dasharray', '5 10')
          polyline.setAttribute('fill', 'none')
          polyline.setAttribute('stroke-linecap', 'round')
          group.appendChild(polyline)
        })

        svg.appendChild(group)
      }
    },

    // 点位坐标转换svg
    pointPos2SvgPos({ svgX, svgY }) {
      const { offsetWidth, offsetHeight } = this.$refs.mapContainer
      return {
        x: (svgX / 100) * offsetWidth,
        y: (svgY / 100) * offsetHeight
      }
    }
  }
}
</script>
<style scoped>
.map-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
}

.map-wrapper {
  /*
    大小可以变， 宽高比不能变 1:1
    width: 1000px;
	height: 1000px;
    */
  left: 50%;
  top: 50%;
  position: absolute;
}
.map-wrapper img {
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
  object-fit: contain;
}

.map-dialog-close {
  width: 40px;
  height: 40px;
  color: white;
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.4);
}

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
}
.points-item {
  display: inline-block;
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(7, 255, 73, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* 为了不变形 将元素写大后使用scale缩小 */
  transform: translateX(-50%) translateY(-50%) scale(0.2);
}
.points-item > i {
  background-color: rgb(7, 255, 73);
  width: 60%;
  height: 60%;
  border-radius: 50%;
  display: inline-block;
}
.points-item .name {
  display: none;
  padding: 4px;
  font-size: 12px;
  position: absolute;
  transform: scale(5) translateX(50%);
  top: 0;
  left: 30px;
  color: white;
  border-left: 3px solid rgb(7, 255, 73);
  background-color: #00000090;
  z-index: 999;
  white-space: normal;
  word-break: keep-all;
}

.points-item:hover .name {
  display: inline-block;
}

.path-tag-wrapper {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 80vw;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(30px);
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.path-tag-wrapper-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.path-tag-wrapper-item-block {
  width: 30px;
  height: 15px;
  border-radius: 4px;
  margin-right: 6px;
}
</style>
<style>
:root {
  /* 预设颜色 */
  --path-map-color-1: rgb(7, 255, 73);
  --path-map-color-2: rgb(255, 127, 7);
  --path-map-color-3: rgb(201, 7, 255);
  --path-map-color-4: rgb(255, 7, 85);
  --path-map-color-5: rgb(15, 7, 255);
  --path-map-color-6: rgb(255, 255, 0);
  --path-map-color-7: rgb(7, 251, 255);

  --path-map-color-1-opacity: rgba(7, 255, 73, 0.3);
  --path-map-color-2-opacity: rgba(255, 127, 7, 0.3);
  --path-map-color-3-opacity: rgba(201, 7, 255, 0.3);
  --path-map-color-4-opacity: rgba(255, 7, 85, 0.3);
  --path-map-color-5-opacity: rgba(15, 7, 255, 0.3);
  --path-map-color-6-opacity: rgba(255, 255, 0, 0.3);
  --path-map-color-7-opacity: rgba(7, 251, 255, 0.3);
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
.block-class-1 {
  background-color: var(--path-map-color-1);
}
.polyline-class-1 {
  stroke: var(--path-map-color-1);
}
.points-item.points-class-1 {
  background-color: var(--path-map-color-1-opacity);
}
.points-item.points-class-1 > i {
  background-color: var(--path-map-color-1);
}
.points-item.points-class-1 .name {
  border-color: var(--path-map-color-1);
}

/* 预设颜色 */
.block-class-2 {
  background-color: var(--path-map-color-2);
}
.polyline-class-2 {
  stroke: var(--path-map-color-2);
}
.points-item.points-class-2 {
  background-color: var(--path-map-color-2-opacity);
}
.points-item.points-class-2 > i {
  background-color: var(--path-map-color-2);
}
.points-item.points-class-2 .name {
  border-color: var(--path-map-color-2);
}

/* 预设颜色 */
.block-class-3 {
  background-color: var(--path-map-color-3);
}
.polyline-class-3 {
  stroke: var(--path-map-color-3);
}
.points-item.points-class-3 {
  background-color: var(--path-map-color-3-opacity);
}
.points-item.points-class-3 > i {
  background-color: var(--path-map-color-3);
}
.points-item.points-class-3 .name {
  border-color: var(--path-map-color-3);
}

/* 预设颜色 */
.block-class-4 {
  background-color: var(--path-map-color-4);
}
.polyline-class-4 {
  stroke: var(--path-map-color-4);
}
.points-item.points-class-4 {
  background-color: var(--path-map-color-4-opacity);
}
.points-item.points-class-4 > i {
  background-color: var(--path-map-color-4);
}
.points-item.points-class-4 .name {
  border-color: var(--path-map-color-4);
}

/* 预设颜色 */
.block-class-5 {
  background-color: var(--path-map-color-5);
}
.polyline-class-5 {
  stroke: var(--path-map-color-5);
}
.points-item.points-class-5 {
  background-color: var(--path-map-color-5-opacity);
}
.points-item.points-class-5 > i {
  background-color: var(--path-map-color-5);
}
.points-item.points-class-5 .name {
  border-color: var(--path-map-color-5);
}

/* 预设颜色 */
.block-class-6 {
  background-color: var(--path-map-color-6);
}
.polyline-class-6 {
  stroke: var(--path-map-color-6);
}
.points-item.points-class-6 {
  background-color: var(--path-map-color-6-opacity);
}
.points-item.points-class-6 > i {
  background-color: var(--path-map-color-6);
}
.points-item.points-class-6 .name {
  border-color: var(--path-map-color-6);
}
</style>
