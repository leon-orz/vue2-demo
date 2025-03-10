<template>
  <div class="base-page-wrap">
    <div class="base-page-wrap-hd has-return">
      <Breadcrumb class="border-btm"></Breadcrumb>
    </div>

    <icon-title>
      <template #title>点位列表</template>
      <template #right>
        <div style="display: flex; align-items: center">
          <el-button type="primary" @click="openPonitConfigList()">新增</el-button>
        </div>
      </template>
    </icon-title>
    <div class="base-page-wrap-bd">
      <el-table :data="pointConfigData" border stripe height="100%" style="width: 100%">
        <el-table-column align="center" prop="serial" label="序号" width="80" />
        <el-table-column align="center" prop="pointCode" label="点位编号" />
        <el-table-column align="center" prop="pathMainCode" label="路径编号" />
        <el-table-column align="center" prop="thePathCode" label="理论路径编号" />
        <el-table-column align="center" prop="createTime" label="创建时间" />
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="openEdit(scope.row)">编辑</el-button> -->
            <el-button type="danger" size="mini" @click="delPonit(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="base-page-wrap-ft"></div>

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="pointConfigDialogShow" width="50%" @close="">
      <div style="text-align: right; margin-bottom: 10px">
        <el-button type="primary" @click="add()">添加</el-button>
      </div>
      <div style="height: 45vh">
        <el-table :data="pointConfigList" border stripe height="100%" style="width: 100%">
          <el-table-column align="center" label="序号">
            <template slot-scope="{ row }">
              <el-input v-model="row.serial" placeholder="请输入" clearable></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pointCode" label="点位编号"></el-table-column>
          <!-- <el-table-column align="center" label="点位编号">
            <template slot-scope="{ row }">
              <el-select
                v-model="row.pointCode"
                filterable
                remote
                placeholder="请输入"
                :remote-method="pointRemoteMethod"
                :loading="pointSelectLoading"
              >
                <el-option v-for="item in pointList" :key="item.id" :label="item.pointName" :value="item.pointCode">
                </el-option>
              </el-select>
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="pathMainCode" label="路径编号"> </el-table-column>
          <el-table-column align="center" prop="thePathCode" label="理论路径编号"> </el-table-column>
          <!-- <el-table-column align="center" label="操作">
            <template slot-scope="{ $index }">
              <el-button type="danger" size="mini" @click="del($index)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <span slot="footer">
        <el-button @click="pointConfigDialogShow = false">取消</el-button>
        <el-button type="primary" @click="onConfirm()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editConfigDialogShow" width="30%" @close="">
      <el-form :inline="false" label-width="100px">
        <el-form-item label="序号">
          <el-input v-model="editConfigData.serial"></el-input>
        </el-form-item>
        <el-form-item label="点位编号">
          <el-select
            style="width: 100%"
            v-model="editConfigData.pointCode"
            filterable
            remote
            placeholder="请输入"
            :remote-method="pointRemoteMethod"
            :loading="pointSelectLoading"
          >
            <el-option v-for="item in pointList" :key="item.id" :label="item.pointName" :value="item.pointCode"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editConfigDialogShow = false">取消</el-button>
        <el-button type="primary" @click="editConfirm()">确定</el-button>
      </span>
    </el-dialog>

    <map-dialog ref="mapDialogRef" @close="queryTable" @edit="toEdit" />
  </div>
</template>

<script>
import Breadcrumb from '@/views/layout/breadcrumb.vue'
import mapDialog from './detail/mapDialog.vue'

export default {
  name: 'PathSettingDetail',
  components: { Breadcrumb, mapDialog },
  data() {
    return {
      routeData: null,
      pointConfigData: [],
      pointConfigDialogShow: false,
      pointConfigList: [],
      pointSelectLoading: false,
      pointList: [],
      editConfigDialogShow: false,
      editConfigData: {}
    }
  },
  created() {
    this.routeData = this.$route.query
  },
  mounted() {
    if (this.routeData.thePathCode) {
      this.queryPoint()
    }
  },
  methods: {
    queryPoint() {
      this.$api.path
        .pathDetailQueryListByParam({
          thePathCode: this.routeData.thePathCode
        })
        .then((res) => {
          if (res) {
            this.pointConfigData = res || []
          } else {
            this.pointConfigData = []
          }
        })
    },
    openPonitConfigList() {
      this.pointConfigList = []
      // this.pointConfigDialogShow = true

      this.$refs.mapDialogRef.open({ factoryCode: this.routeData.factoryCode, pointIdx: this.pointConfigData.length + 1 })
    },
    add() {
      this.pointConfigList.push({
        serial: '',
        pointCode: '',
        pathMainCode: this.routeData.pathMainCode,
        thePathCode: this.routeData.thePathCode,
        factoryCode: this.routeData.factoryCode
      })
    },
    del(index) {
      this.pointConfigList.splice(index, 1)
    },
    pointRemoteMethod(val) {
      this.pointSelectLoading = true
      this.$api.path
        .getPagePointList({
          pageIndex: 1,
          pageSize: 10,
          pointCode: val,
          factoryCode: this.routeData.factoryCode
        })
        .then((res) => {
          if (res) {
            this.pointList = res.list || []
          }
        })
        .finally(() => {
          this.pointSelectLoading = false
        })
    },
    onConfirm() {
      const data = [...this.pointConfigList]
      this.$api.path.insertPathDetailList(data).then((res) => {
        if (res) {
          this.$message.success('保存成功！')
          this.pointConfigDialogShow = false
          this.$refs.mapDialogRef.onClose()
          this.queryPoint()
        }
      })
    },
    openEdit(row) {
      this.editConfigData = {
        ...row
      }
      this.editConfigDialogShow = true
    },
    editConfirm() {
      this.$api.path.updateById([{ ...this.editConfigData }]).then((res) => {
        if (res) {
          this.$message.success('保存成功！')
          this.editConfigDialogShow = false
          this.queryPoint()
        }
      })
    },
    toEdit(data) {
      this.pointConfigList = data.map((item, index) => {
        return {
          serial: this.pointConfigData.length + 1 + index + 1,
          pointCode: item.pointCode,
          pathMainCode: this.routeData.pathMainCode,
          thePathCode: this.routeData.thePathCode,
          factoryCode: this.routeData.factoryCode
        }
      })
      this.pointConfigDialogShow = true
    },
    delPonit(row) {
      this.$api.path.deleteByIds([row.id]).then((res) => {
        if (res) {
          this.$message.success('删除成功！')
          this.queryPoint()
        }
      })
    },
    queryTable() {}
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

  display: flex;
  flex-direction: column;

  .base-page-wrap-hd {
    &.has-return {
      margin-right: 50px;
    }
  }

  .base-page-wrap-bd {
    height: 0;
    flex: 1;
    flex-basis: 0;
  }

  // .base-page-wrap-ft {
  // }
}
</style>
