<template>
  <div class="page-vessel-bg column" style="width: 100%; height: 100%">
    <icon-title :iconHidden="false">
      <template #title>{{ $route.meta.title }}</template>
    </icon-title>
    <div class="full-height column">
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form">
          <el-form-item label="厂区">
            <el-select
              v-model="form.factoryCode"
              placeholder="请选择"
              clearable
              @change="
                areas = []
                changeFactory()
              "
            >
              <el-option v-for="item in factoryList" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域">
            <el-select v-model="areas" placeholder="请选择" multiple collapse-tags clearable @change="changeArea">
              <el-option v-for="item in areaList" :key="item.areaId" :label="item.areaName" :value="item.areaCode"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备编号">
            <el-input clearable @clear="conditionQuery" v-model="form.equipmentCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input clearable @clear="conditionQuery" v-model="form.equipmentName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="form.type" clearable @change="conditionQuery" @clear="conditionQuery" placeholder="请选择">
              <el-option v-for="item in deviceTypeArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资产状态">
            <el-select v-model="form.currentStatus" placeholder="请选择" clearable>
              <el-option v-for="item in deviceStatusArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运行状态">
            <el-select v-model="form.status" placeholder="请选择" clearable>
              <el-option v-for="item in deviceYXStatusArr" :key="item.code" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="点位编码">
            <el-input v-model="form.pointCode" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="conditionQuery" size="small">查询</el-button>
            <el-button type="primary" @click="resetForm" plain size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <icon-title style="margin-top: 0.5vw">
        <template #title>设备列表</template>
        <template #right>
          <el-button type="primary" @click="add()" size="small">新增主设备</el-button>
        </template>
      </icon-title>
      <div class="full-height">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="70"> </el-table-column>
          <el-table-column prop="uploadFile" label="设备图片" align="center">
            <template slot-scope="scope">
              <div @click="openImgView(scope.row.uploadFile)">
                <el-image style="width: 60px; height: 60px" :src="scope.row.uploadFile" fit="fill">
                  <div slot="error" class="image-slot"></div>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="equipmentCode" label="设备编号" align="center"> </el-table-column> -->
          <el-table-column prop="equipmentName" label="设备名称" align="center"> </el-table-column>
          <el-table-column prop="typeDesc" label="设备类型" align="center"> </el-table-column>
          <!-- <el-table-column prop="factoryCode" label="厂区编码" align="center"> </el-table-column> -->
          <el-table-column prop="factoryName" label="厂区名称" align="center"> </el-table-column>
          <!-- <el-table-column prop="areaCode" label="区域编码" align="center"> </el-table-column> -->
          <el-table-column prop="areaName" label="区域名称" align="center"> </el-table-column>
          <el-table-column prop="pointCode" label="点位编码" align="center"> </el-table-column>
          <el-table-column prop="actualValue" label="存储实际值" align="center"> </el-table-column>
          <el-table-column prop="maxValue" label="最大值" align="center"> </el-table-column>
          <el-table-column prop="statusDesc" label="运行状态" align="center" width="150"> </el-table-column>
          <el-table-column prop="currentStatusDesc" label="资产状态" align="center"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="100"> </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <div class="flex">
                <el-button type="info" size="mini" @click="sbbgSubset(scope.row)">变更审核</el-button>
                <el-button type="primary" size="mini" @click="bindingSubset(scope.row)">部署</el-button>
                <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteTable(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex flex-end" style="margin-top: 0.5vw">
        <el-pagination
          background
          @current-change="currentChange"
          layout="prev, pager, next"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="total"
        >
        </el-pagination>
      </div>
      <mainDeviceDialog
        :dialogVisible.sync="mainDeviceDialogShow"
        :title="mainDeviceDialogTitle"
        :row="tableDataRow"
      ></mainDeviceDialog>
    </div>
    <el-image-viewer v-if="showViewer" :url-list="previewSrcList" :on-close="closeViewer" />
    <el-dialog title="设备变更审核" :visible.sync="sbbgShow" width="30%">
      <div class="form-box">
        <el-form ref="sbbgForm" :rules="sbbgRules" :model="sbbgInfo" :inline="true" label-width="120px">
          <el-form-item label="申请类型" prop="equChaRevType">
            <el-select v-model="sbbgInfo.equChaRevType" placeholder="请选择" clearable filterable>
              <el-option v-for="item in typeList" :key="item.id" :label="item.desc" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请内容" prop="equChaRevDesc">
            <el-input clearable type="textarea" :rows="2" v-model="sbbgInfo.equChaRevDesc" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sbbgShow = false">取 消</el-button>
        <el-button type="primary" @click="sbbgSubmit('sbbgForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mainDeviceDialog from './mainDeviceDialog.vue'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'deviceAccount',
  components: {
    mainDeviceDialog,
    ElImageViewer
  },
  data() {
    return {
      areas: [],
      form: {
        factoryCode: '',
        factoryName: '',
        areaName: '',
        areaCode: '',
        equipmentCode: '',
        equipmentName: '',
        type: '',
        currentStatus: '',
        status: '',
        pointCode: ''
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      deviceTypeArr: [],
      tableData: [],
      tableDataRow: {},
      mainDeviceDialogTitle: '',
      mainDeviceDialogShow: false,
      areaList: [],
      // 工厂列表
      factoryList: [],
      showViewer: false,
      previewSrcList: [],
      deviceStatusArr: [],
      deviceYXStatusArr: [],
      sbbgShow: false,
      sbbgInfo: {
        equChaRevDesc: '',
        equChaRevType: '',
        equipmentCode: '',
        equipmentType: ''
      },
      sbbgRules: {
        equChaRevDesc: [{ required: true, message: '请输入申请内容', trigger: 'blur' }],
        equChaRevType: [{ required: true, message: '请选择申请类型', trigger: 'change' }]
      },
      typeList: []
    }
  },
  mounted() {
    this.getDeviceType()
    this.queryTable()
    this.queryFactoryList()
    this.getDeviceStatus()
    this.queryType()
  },
  methods: {
    // 查询设备状态类型
    queryType() {
      const params = { function: 'SBZT' }
      this.$api.equipment.GetEquipmentStatusList(params).then((res) => {
        this.typeList = res
      })
    },
    // 设备变更点击打开弹框
    sbbgSubset(row) {
      this.sbbgInfo.equChaRevDesc = ''
      this.sbbgInfo.equChaRevType = ''
      this.sbbgShow = true
      let info = row
      this.sbbgInfo.equipmentCode = info.equipmentCode
      this.sbbgInfo.equipmentType = info.type
      // error
    },
    // 设备变更提交
    sbbgSubmit(sbbgForm) {
      const params = {
        ...this.sbbgInfo
      }
      this.$refs[sbbgForm].validate((valid) => {
        if (valid) {
          this.$api.equipment.AddEquipmentChangeReview(params).then((res) => {
            this.$message.success('提交审核成功')
            this.sbbgShow = false
            this.$emit('refresh')
          })
        } else {
          return false
        }
      })
    },
    // 查询工厂列表
    queryFactoryList() {
      this.$api.equipment.FactoryData().then((res) => {
        if (res) {
          this.factoryList = res
        }
      })
    },
    changeFactory() {
      const cur = this.factoryList.find((item) => item.code == this.form.factoryCode)
      this.form.factoryName = cur.desc
      this.queryAreaList()
    },
    // 查询区域列表
    queryAreaList() {
      this.$api.equipment.FactoryArea({}).then((res) => {
        if (res) {
          this.areaList = res
        }
      })
    },
    changeArea(val) {
      const cur = this.areaList.filter((object) => val.includes(object.areaCode))
      this.form.areaName = cur.map((item) => item.areaName).join(',')
      this.form.areaCode = cur.map((item) => item.areaCode).join(',')
      // const cur = this.areaList.find((item) => item.areaCode === val)
      // this.form.areaName = cur.areaName
    },
    //获取设备类型
    getDeviceType() {
      let self = this
      let param = {
        function: 'SB'
      }
      this.$api.masterData.getPrecisionData(param).then((res) => {
        try {
          self.deviceTypeArr = res
        } catch (error) {
          // error
        }
      })
    },
    //获取设备状态
    getDeviceStatus() {
      let self = this
      this.$api.masterData
        .getPrecisionData({
          function: 'SBZT'
        })
        .then((res) => {
          try {
            self.deviceStatusArr = res
          } catch (error) {
            // error
          }
        })
      this.$api.masterData
        .getPrecisionData({
          function: 'SBYXZT'
        })
        .then((res) => {
          try {
            self.deviceYXStatusArr = res
          } catch (error) {
            // error
          }
        })
    },
    //查询主设备列表
    queryTable() {
      let self = this
      self.tableData = []
      let param = {
        pageIndex: self.pageIndex,
        pageSize: self.pageSize,
        ...self.form
      }
      self.$api.masterData.queryDeviceAccountTable(param).then((res) => {
        try {
          self.total = res.total
          self.tableData = res.list
        } catch (error) {
          // error
        }
      })
    },
    deleteTable(row) {
      let self = this
      let param = []
      param.push(row.id)
      self
        .$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$api.masterData.deleteMainDeviceData(param).then((res) => {
            try {
              self.$message.success('删除成功！')
              self.queryTable()
            } catch (error) {
              // error
            }
          })
        })
        .catch(() => {})
    },
    conditionQuery() {
      let self = this
      self.pageIndex = 1
      self.queryTable()
    },
    openImgView(img) {
      this.previewSrcList = [img]
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    currentChange(val) {
      let self = this
      self.pageIndex = val
      self.queryTable()
    },
    resetForm() {
      let self = this
      for (const key in self.form) {
        self.form[key] = ''
      }
      self.conditionQuery()
    },
    add() {
      let self = this
      self.tableDataRow = {}
      self.mainDeviceDialogTitle = '新增'
      self.mainDeviceDialogShow = true
    },
    edit(row) {
      let self = this
      self.tableDataRow = row
      self.mainDeviceDialogTitle = '编辑'
      self.mainDeviceDialogShow = true
    },
    bindingSubset(row) {
      this.$router.push({
        name: 'deviceAccountDetail',
        query: {
          id: row.id,
          equipmentCode: row.equipmentCode
        }
      })
    }
  }
}
</script>

<style></style>
