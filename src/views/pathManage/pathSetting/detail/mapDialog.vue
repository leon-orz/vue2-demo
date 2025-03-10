<template>
  <div class="map-dialog" v-if="dialogVisible">
    <div class="map-dialog-close" @click="onClose()">
      <i class="el-icon-close"></i>
    </div>

    <div class="main-cntr">
      <div class="select-wrap">
        <el-select v-model="factoryCode" @change="queryPointList()">
          <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
        </el-select>
        <div class="map-dialog-list">
          <div class="map-dialog-list-item" v-for="(item, index) in selectedData" :key="index">
            <span> ({{ index + 1 + pointIdx }}) </span>
            <p>{{ item.pointName }}</p>
            <span @click="delPointSelected(index)">删除</span>
          </div>
        </div>
        <div style="text-align: right">
          <el-button type="primary" @click="pointConfirm()">确认</el-button>
        </div>
      </div>
      <div class="path-wrap">
        <!-- @dblclick="onDbClick" -->
        <div class="img-wrap" :style="wrapperStyle" ref="mapContainer">
          <img :src="dynamicImageSrc" alt="" />

          <div class="points-list">
            <div
              class="points-item"
              v-for="(item, idx) in points"
              :key="idx"
              :style="{ left: item.svgX + '%', top: item.svgY + '%' }"
              :class="{ selected: selectedData.some((sitem) => sitem.pointCode == item.pointCode) }"
              @click="selectPoint(item)"
            >
              <i />
              <div class="name">{{ item.pointName }}</div>
            </div>
          </div>
        </div>
      </div>
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
      points: [],
      factoryCode: 'factory_one',
      factoryList: [],
      selectedData: [],
      pointIdx: 1
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
    const size = Math.min(window.innerWidth, window.innerHeight)
    console.log(size)
    // width: size + 'px',
    // this.wrapperStyle = {
    //   height: size * 0.9 + 'px'
    // }
  },
  methods: {
    open(rData) {
      if (rData && rData.factoryCode) {
        this.factoryCode = rData.factoryCode
        this.pointIdx = rData.pointIdx
      }

      this.queryFactoryList()
      this.queryPointList()

      this.dialogVisible = true

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
    // 工厂
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res || []

          // 先默认选中第一项
          if (!this.factoryCode) {
            this.factoryCode = this.factoryList[0].code
          }
        } else {
          this.factoryList = []
        }
      })
    },

    //查询点位列表
    queryPointList() {
      let param = {
        factoryCode: this.factoryCode,
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
        y,
        factoryCode: this.factoryCode
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
    },
    onClose() {
      this.dialogVisible = false
      this.$emit('close')
    },
    selectPoint(point) {
      const isSelected = this.selectedData.some((item) => item.pointCode == point.pointCode)
      if (isSelected) {
        const idx = this.selectedData.findIndex((item) => item.pointCode == point.pointCode)
        this.selectedData.splice(idx, 1)
        return
      }
      this.selectedData.push(point)
    },
    pointConfirm() {
      this.$emit('edit', this.selectedData)
    },
    delPointSelected(idx) {
      this.selectedData.splice(idx, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.map-dialog {
  position: fixed;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  z-index: 999;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
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

.select-wrap {
  width: 300px;

  .map-dialog-list {
    height: 200px;
    margin: 15px 0;
    padding: 10px;
    border-radius: 10px;
    background: #fff;
    overflow-y: auto;

    .map-dialog-list-item {
      font-size: 15px;

      display: flex;
      justify-content: space-between;

      & + .map-dialog-list-item {
        margin-top: 5px;
        border-top: 1px solid #eee;
      }
    }
  }
}

.main-cntr {
  width: 90%;
  height: 90%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;

  .path-wrap {
    width: 0;
    flex: 1;
    flex-basis: 0;

    position: relative;

    .img-wrap {
      //   height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        max-width: 100%;
        max-height: 100%;
        user-select: none;
        pointer-events: none;
        object-fit: contain;
      }
    }
  }
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

.points-item.selected {
  background-color: rgba(7, 255, 73, 0.8);
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
