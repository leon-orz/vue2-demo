<template>
  <div class="map-dialog" v-if="dialogVisible">
    <div class="map-form">
      <div class="tags" v-if="pointPath && pointPath.length">
        <el-tag
          size="small"
          type="info"
          closable
          v-for="(item, idx) in pointPath"
          :key="idx"
          @close="pointPath.splice(idx, 1)"
          >{{ item.pointName }}</el-tag
        >
      </div>
      <div v-else>请点击选择点位</div>
      <div class="buttons">
        <el-button size="small" type="primary" @click="pointPath = []">清空</el-button>
        <el-button size="small" type="primary" @click="save()">保存</el-button>
      </div>
    </div>
    <div class="map-wrapper" :style="wrapperStyle" ref="mapContainer">
      <img src="@/assets/scene-low.webp" />
      <svg class="path-wrapper" ref="mapSvgRef"></svg>
      <div class="points-list">
        <div
          class="points-item"
          v-for="(item, idx) in points"
          :key="idx"
          :style="{ left: item.svgX + '%', top: item.svgY + '%' }"
          @click="selectPoint(item)"
        >
          <i />
          <div class="name">{{ item.pointName }}</div>
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
      dialogVisible: false,
      wrapperStyle: {},
      points: [],

      pathMainCode: '',
      pathMainId: '',

      pointPath: []
    }
  },
  watch: {
    pointPath: {
      handler: function (val) {
        this.renderPath(val)
      },
      deep: true
    }
  },
  mounted() {
    // 初始化svg地图大小
    const size = Math.min(window.innerWidth, window.innerHeight)
    this.wrapperStyle = {
      width: size * 0.9 + 'px',
      height: size * 0.9 + 'px'
    }
  },
  methods: {
    open({ pathMainCode, pathMainId }) {
      this.pathMainCode = pathMainCode
      this.pathMainId = pathMainId
      this.queryPathPoints()
      this.queryPointList()
      this.dialogVisible = true
      this.$nextTick(() => {
        const el = this.$refs.mapContainer

        // 滚轮缩放
        mapDialogWheelscale({
          el,
          speed: 0.5,
          // 为了居中
          translateX: `-${el.offsetWidth / 2}px`,
          translateY: `-${el.offsetHeight / 2}px`
        })
        // 拖拽
        mapDialogDraggable({ el })
      })
    },

    // 保存
    save() {
      const data = this.pointPath.map((item, index) => {
        return {
          serial: index + 1,
          pointId: item.pointId,
          pathMainId: this.pathMainId
        }
      })
      this.$api.masterData.addPathPoinData(data).then((res) => {
        try {
          this.$message.success('保存成功！')
          this.close()
        } catch (error) {
          // error
        }
      })
    },

    // 查询路径
    queryPathPoints() {
      const param = {
        pathMainId: this.pathMainId
      }
      this.$api.masterData.getPathPoinDetailData(param).then((res) => {
        this.pointPath = res.pathDetailVOList || []
        // {
        //     "id": 87,
        //     "serial": 71,
        //     "pointId": 1173,
        //     "pointCode": "ztb2827",
        //     "pointName": "ztb2827",
        //     "svgX": "28",
        //     "svgY": "27"
        // }
      })
    },
    //查询点位列表
    queryPointList() {
      let param = {
        pageIndex: 1,
        pageSize: 1000 // 仅展示1000个点位
      }
      this.$api.masterData.queryPoinTable(param).then((res) => {
        if (res) {
          this.points = res.list || []
          // {
          //     "id": 1627,
          //     "pointCode": "hh",
          //     "pointName": "hh",
          //     "type": "DW-PT",
          //     "isDelete": false,
          //     "createUser": "admin",
          //     "createTime": "2024-09-25 11:25:33",
          //     "updateUser": "admin",
          //     "updateTime": "2024-09-25 11:25:33",
          //     "typeDesc": "普通点位",
          //     "svgX": "79.11490683229813",
          //     "svgY": "7.608695652173914"
          // }
        } else {
          this.points = []
        }
      })
    },

    // 选择点位
    selectPoint(point) {
      const data = {
        serial: this.pointPath.length + 1,
        pointId: point.id,
        pointCode: point.pointCode,
        pointName: point.pointName,
        svgX: point.svgX,
        svgY: point.svgY
      }
      this.pointPath.push(data)
    },

    // 渲染路径
    renderPath(list) {
      const svg = this.$refs.mapSvgRef
      svg.innerHTML = ''
      list.forEach((point, pointIdx) => {
        if (pointIdx === 0) return
        const { x: x1, y: y1 } = this.pointPos2SvgPos(list[pointIdx - 1])
        const { x: x2, y: y2 } = this.pointPos2SvgPos(point)
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
        polyline.setAttribute('stroke', '#07ff4980')
        polyline.setAttribute('points', `${x1},${y1} ${x2},${y2}`)
        polyline.setAttribute('stroke-width', 3)
        polyline.setAttribute('stroke-dasharray', '10 10')
        polyline.setAttribute('fill', 'none')
        polyline.setAttribute('stroke-linecap', 'round')
        svg.appendChild(polyline)
      })

      // 普通线条
    },

    // 点位坐标转换svg
    pointPos2SvgPos({ svgX, svgY }) {
      const { offsetWidth, offsetHeight } = this.$refs.mapContainer
      return {
        x: (svgX / 100) * offsetWidth,
        y: (svgY / 100) * offsetHeight
      }
    },

    close() {
      this.dialogVisible = false
      this.pointPath = []
      this.$emit('close')
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

.map-form {
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
.tags .el-tag {
  margin: 0 5px 3px 0;
}
.buttons {
  text-align: right;
  margin-top: 20px;
}
</style>
<style>
img {
  pointer-events: none;
  user-select: none;
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
</style>
