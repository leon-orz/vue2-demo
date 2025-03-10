<template>
  <div class="page-vessel-bg column" style="width: 100%;height: 100%;">
    <icon-title :iconHidden="false" class="border-btm">
      <template #title>{{$route.meta.title}}</template>
    </icon-title>
    <Breadcrumb class="border-btm"></Breadcrumb>
    <div style="margin-top: 1vw" class="full-height column">
      <icon-title>
        <template #title>详细信息</template>
      </icon-title>
      <div class="form-box">
        <el-form ref="form" :inline="true" :model="form" label-width="80px">
          <el-form-item label="设备编号">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="出厂年月">
            <el-date-picker v-model="form.name" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="厂家">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="使用年限">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="进厂日期">
            <el-date-picker v-model="form.name" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="所属车间">
            <el-select v-model="form.name" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属工段">
            <el-select v-model="form.name" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属产线">
            <el-select v-model="form.name" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任人">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备状态">
            <el-select v-model="form.name" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="full-height column">
        <el-tab-pane v-for="(tab,index) in tabList" :label="tab.label" :name="tab.name" :key="tab.name">
          <icon-title :iconHidden="false">
            <template #title>文件列表</template>
            <template #right>
              <el-button type="primary" size="small">上传文件</el-button>
            </template>
          </icon-title>
          <div class="full-height">
            <el-table :data="tableData" height="100%" style="width: 100%;">
              <el-table-column type="index" width="80" label="序号" align="center">
              </el-table-column>
              <el-table-column prop="date" label="文件名称" align="center">
              </el-table-column>
              <el-table-column prop="name" label="文件类型" align="center">
              </el-table-column>
              <el-table-column prop="address" label="上传日期" align="center">
              </el-table-column>
              <el-table-column prop="address" label="创建人" align="center">
              </el-table-column>
              <el-table-column width="120" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="foot-btn flex flex-end" style="margin-top: 0.5vw">
            <el-button type="primary" size="small">保存</el-button>
            <el-button type="primary" plain size="small" @click="$router.go(-1)">返回</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../../layout/breadcrumb.vue'
export default {
  name: "taskListDetail",
  components: {
    Breadcrumb
  },
  data() {
    return {
      activeName: "file",
      tabList: [
        {
          label: "文件信息",
          name: "file",
        },
      ],
      form: {
        name: "",
      },
      options: [],
      tableData: [
        {
          id: 1,
          name: "1"
        }
      ],
    }
  },
  mounted() {

  },
  methods: {

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