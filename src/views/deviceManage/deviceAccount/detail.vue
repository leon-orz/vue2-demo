<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false" class="border-btm">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <Breadcrumb class="border-btm"></Breadcrumb>
    <div style="margin-top: 1vw" class="full-height column">
      <icon-title>
        <template #title>详细信息</template>
      </icon-title>
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form" label-width="80px">
          <el-form-item label="设备编号">
            <el-input disabled v-model="form.equipmentCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input disabled v-model="form.equipmentName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input disabled v-model="form.specification" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="出厂年月">
            <el-date-picker disabled v-model="form.goTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="厂家">
            <el-input disabled v-model="form.manufacturers" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="使用年限">
            <el-input disabled v-model="form.employYear" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="进厂日期">
            <el-date-picker disabled v-model="form.outTiem" type="date" placeholder="选择日期"> </el-date-picker>
          </el-form-item>
          <el-form-item label="所属车间">
            <el-input disabled v-model="form.workshop" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="所属工段">
            <el-input disabled v-model="form.section" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="所属产线">
            <el-input disabled v-model="form.line" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="责任人">
            <el-input disabled v-model="form.person" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备状态">
            <el-input disabled v-model="form.deviceStatusArr" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-input disabled v-model="form.type" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="full-height column">
        <el-tab-pane
          v-for="(tab, index) in tabList.filter((item) => !(item.code == 'equipment_hierarchy' && form.type == 'SB-DK'))"
          :key="tab.code"
          :label="tab.label"
          :name="tab.name"
        >
          <template v-if="tab.code == 'equipment_hierarchy' && form.type != 'SB-DK'">
            <icon-title :iconHidden="false">
              <template #title>子设备列表</template>
              <template #right>
                <el-button type="primary" @click="subsetDialogManage" size="small">新增</el-button>
              </template>
            </icon-title>
            <div class="full-height">
              <el-table :data="tableData" height="100%" style="width: 100%">
                <el-table-column type="index" width="80" label="序号" align="center"> </el-table-column>
                <el-table-column prop="equipmentCode" label="设备编号" align="center"> </el-table-column>
                <el-table-column prop="equipmentName" label="设备名称" align="center"> </el-table-column>
                <el-table-column width="120" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" @click="deleteRow(scope.row)" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template v-if="tab.code == 'check_order'">
            <icon-title :iconHidden="false">
              <template #title>设备点检</template>
              <template #right>
                <el-button type="primary" size="small" @click="openSpotCheck()">新增</el-button>
              </template>
            </icon-title>
            <div class="full-height">
              <el-table :data="spotCheckData" border stripe height="100%">
                <el-table-column align="center" prop="serial" label="序号"> </el-table-column>
                <el-table-column align="center" prop="part" label="点检部位"> </el-table-column>
                <el-table-column align="center" prop="need" label="点检需求"> </el-table-column>
                <el-table-column align="center" prop="typeDesc" label="点检类别"> </el-table-column>
                <el-table-column align="center" prop="elapsedTime" label="标准耗时"> </el-table-column>
                <el-table-column align="center" prop="checkNum" label="点检次数"> </el-table-column>
                <el-table-column align="center" prop="checkFrequencyName" label="点检频率"> </el-table-column>
                <el-table-column align="center" prop="note" label="备注" min-width="200"> </el-table-column>
                <!-- <el-table-column align="center" prop="createTime" label="创建时间"> </el-table-column> -->
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="openSpotCheck(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="spotCheckDel(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template v-if="tab.code == 'equipment_upkeep'">
            <icon-title :iconHidden="false">
              <template #title>设备保养</template>
              <template #right>
                <el-button type="primary" size="small" @click="openMaintain()">新增</el-button>
              </template>
            </icon-title>
            <div class="full-height">
              <el-table :data="maintainData" border stripe height="100%">
                <el-table-column align="center" prop="serialNumber" label="序号"> </el-table-column>
                <el-table-column align="center" prop="part" label="保养部位"> </el-table-column>
                <el-table-column align="center" prop="upkeepDesc" label="保养内容"> </el-table-column>
                <el-table-column align="center" prop="methodDesc" label="保养方法"> </el-table-column>
                <el-table-column align="center" prop="standard" label="保养标准"> </el-table-column>
                <el-table-column align="center" prop="upkeepNum" label="保养次数"> </el-table-column>
                <el-table-column align="center" prop="upkeepFrequencyName" label="保养频率"> </el-table-column>
                <el-table-column align="center" prop="duty" label="实施方"> </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="openMaintain(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="maintainDel(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template v-if="tab.code == 'path_main'">
            <icon-title :iconHidden="false">
              <template #title>路径</template>
            </icon-title>
            <div class="full-height">
              <el-table :data="pathMianData" border stripe height="100%">
                <el-table-column align="center" prop="pathMainName" label="路径名称"> </el-table-column>
                <el-table-column align="center" prop="pathMainCode" label="路径编号"> </el-table-column>
                <el-table-column align="center" prop="railroadIdOneName" label="起始道口"> </el-table-column>
                <el-table-column align="center" prop="railroadIdTwoName" label="结束道口"> </el-table-column>
                <el-table-column align="center" prop="standardDuration" label="标准时长"> </el-table-column>
              </el-table>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <subsetDialog :dialogVisible.sync="dialogVisible" :mainId="form.id"></subsetDialog>
      <!-- 点检 spotCheck -->
      <spotCheck ref="spotCheckRef" @refresh="querySpotCheckData" />
      <!-- 保养 maintain -->
      <maintain ref="maintainRef" @refresh="queryMaintainData" />
    </div>
  </div>
</template>

<script>
import subsetDialog from './dialog.vue'
import Breadcrumb from '../../layout/breadcrumb.vue'
import spotCheck from './spotCheck.vue'
import maintain from './maintain.vue'

export default {
  name: 'deviceAccountDetail',
  components: {
    Breadcrumb,
    subsetDialog,
    spotCheck,
    maintain
  },
  data() {
    return {
      id: '',
      equipmentCode: '',
      activeName: 'file',
      tabList: [
        {
          label: '子设备',
          name: 'file',
          code: 'equipment_hierarchy'
        },
        {
          label: '设备点检',
          name: 'point',
          code: 'check_order'
        },
        {
          label: '设备保养',
          name: 'maintain',
          code: 'equipment_upkeep'
        },
        {
          label: '路径',
          name: 'path',
          code: 'path_main'
        }
      ],
      form: {},
      dialogVisible: false,
      tableData: [],
      spotCheckData: [],
      maintainData: [],
      pathMianData: []
    }
  },
  mounted() {
    let self = this
    if (self.$route.query.id) {
      self.id = self.$route.query.id
      self.equipmentCode = self.$route.query.equipmentCode
      self.queryDetailTable()
      self.querySubsetTable()
    }
  },
  methods: {
    //查询主设备详情数据
    queryDetailTable() {
      let self = this
      let param = self.id
      self.$api.masterData.getDeviceDetailData(param).then((res) => {
        try {
          self.form = res
        } catch (error) {
          // error
        }
      })
    },
    //查询主设备下子设备数据
    querySubsetTable() {
      let self = this
      let param = {
        mainId: self.id
      }
      self.$api.masterData.getDeviceSubsetDetailData(param).then((res) => {
        try {
          self.tableData = res.equipmentHierarchyVOS
        } catch (error) {
          // error
        }
      })
    },
    //tab切换
    handleClick() {
      let self = this

      if (this.activeName == 'file') {
        self.queryDetailTable()
      }
      if (this.activeName == 'point') {
        this.querySpotCheckData()
      }
      if (this.activeName == 'maintain') {
        this.queryMaintainData()
      }
      if (this.activeName == 'path') {
        this.getPathMainPointEquipmentList()
      }
    },
    subsetDialogManage() {
      let self = this
      self.dialogVisible = true
    },
    //删除
    deleteRow(row) {
      let self = this
      let param = []
      param.push(row.id)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          self.$api.masterData.deleteSubDeviceData(param).then((res) => {
            try {
              self.$message.success('删除成功！')
              self.querySubsetTable()
            } catch (error) {
              // error
            }
          })
        })
        .catch(() => {})
    },

    // 设备点检
    openSpotCheck(row) {
      const params = {
        ...row
      }
      this.$refs.spotCheckRef.open(
        row
          ? { eid: this.id, equipmentCode: this.equipmentCode, ...params }
          : { eid: this.id, equipmentCode: this.equipmentCode }
      )
    },
    querySpotCheckData() {
      this.$api.equipment
        .GetCheckItem({
          equipmentCode: this.equipmentCode
        })
        .then((res) => {
          if (res) {
            this.spotCheckData = res
          }
        })
    },
    spotCheckDel(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.equipment.DelCheckItem({ id: row.id }).then((res) => {
            if (res) {
              this.$message.success('删除成功！')
              this.querySpotCheckData()
            }
          })
        })
        .catch(() => {})
    },
    // 设备保养
    openMaintain(row) {
      const params = {
        ...row
      }
      this.$refs.maintainRef.open(
        row
          ? { eid: this.id, equipmentCode: this.equipmentCode, ...params }
          : { eid: this.id, equipmentCode: this.equipmentCode }
      )
    },
    queryMaintainData() {
      this.$api.equipment
        .GetEquipmentUpkeep({
          equipmentCode: this.equipmentCode
        })
        .then((res) => {
          if (res) {
            this.maintainData = res
          }
        })
    },
    maintainDel(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.equipment.DelEquipmentUpkeep({ id: row.id }).then((res) => {
            if (res) {
              this.$message.success('删除成功！')
              this.queryMaintainData()
            }
          })
        })
        .catch(() => {})
    },
    //查询设备路径
    getPathMainPointEquipmentList() {
      let self = this
      let param = {
        equipmentCode: self.equipmentCode
      }
      self.$api.masterData.getPathMainPointEquipmentList(param).then((res) => {
        try {
          self.pathMianData = res
        } catch (error) {
          // error
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-tabs__nav {
  padding: 5px 0;
}
/deep/ .el-tabs__content {
  flex: 1;
  height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}
/deep/ .el-tab-pane {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
