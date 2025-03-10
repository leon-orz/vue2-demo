<template>
  <div class="map-dialog" v-if="dialogVisible">
    <div class="map-wrapper" :style="wrapperStyle" ref="mapContainer" @dblclick="onDbClick">
      <img src="@/assets/scene-low.webp" />
      <div class="points-list">
        <div
          class="points-item"
          v-for="(item, idx) in points"
          :key="idx"
          :style="{ left: item.svgX + '%', top: item.svgY + '%' }"
        >
          <i />
          <div class="name">{{ item.pointName }}</div>
        </div>
      </div>
    </div>
    <div class="map-dialog-close" @click="dialogVisible = false">
      <i class="el-icon-close"></i>
    </div>

    <!-- 点位新增 -->
    <mapPointAdd ref="mapPointAddRef" @success="queryPointList()" />
  </div>
</template>
<script>
import mapPointAdd from './mapPointAdd.vue'
import mapDialogDraggable from './mapDialogDraggable.js'
import mapDialogWheelscale from './mapDialogWheelscale.js'
export default {
  name: 'mapDialog',
  components: { mapPointAdd },
  data() {
    return {
      dialogVisible: false,
      wrapperStyle: {},
      points: []
    }
  },
  mounted() {
    // 初始化svg地图大小
    const size = Math.min(window.innerWidth, window.innerHeight)
    this.wrapperStyle = {
      width: size + 'px',
      height: size + 'px'
    }
  },
  methods: {
    open() {
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

    //查询点位列表
    queryPointList() {
      let param = {
        pageIndex: 1,
        pageSize: 1000 // 仅展示1000个点位
      }
      this.$api.masterData.queryPoinTable(param).then((res) => {
        if (res) {
          this.points = res.list || []
        } else {
          this.points = []
        }
      })
    },

    onDbClick(e) {
      const { x, y } = this.positionTransform({ x: e.offsetX, y: e.offsetY })
      this.$refs.mapPointAddRef.open({
        x,
        y
      })
    },

    positionTransform({ x, y }) {
      const el = this.$refs.mapContainer
      const width = el.offsetWidth
      const height = el.offsetHeight
      return {
        x: (x / width) * 100,
        y: (y / height) * 100
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
}

.points-item:hover .name {
  display: inline-block;
}
</style>
<style>
img {
  pointer-events: none;
  user-select: none;
}
</style>
