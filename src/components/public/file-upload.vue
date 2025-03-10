<template>
  <el-dialog title="上传文件" width="500px" :visible.sync="filesUploadDialog" style="text-align:left">
    <el-form :model="fileForm" :rules="filerules" ref="fileForm" label-width="100px" class="demo-roleForm">
      <el-form-item label="文件名" prop="fileName">
        <el-input v-model.trim="fileForm.fileName" placeholder="请输入文件名"></el-input>
      </el-form-item>
      <el-form-item label="文件" prop="fileUrl">
        <el-upload class="upload-demo" :headers="{'X-Auth-Token':token}" :action="URL" :on-success="handleSuccess" :on-remove="delImg" :file-list="fileList" :clearFiles="clearFiles" :limit="1"
                   multiple>
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-input v-show="fileUrlShow" v-model="fileForm.fileUrl" disabled></el-input>
      </el-form-item>
      <el-form-item label="文件类型" prop="fileType">
        <el-select v-model="fileForm.fileType" placeholder="请选择文件类型">
          <el-option v-for="file in fileTypeList" :key="file.etId" :label="file.etName" :value="file.etCode">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:filesUploadDialog', false)">取 消</el-button>
      <el-button type="primary" @click="add('fileForm')">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { useUserStore } from '@/stores/user'
export default {
  name: "fileUpload",
  props: {
    filesUploadDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileForm: {
        fileName: '',
        fileUrl: '',
        fileType: ''
      },
      filerules: {
        fileName: [
          {
            required: true,
            message: '请输入文件名',
            trigger: 'blur'
          }
        ],
        fileUrl: [
          {
            required: true,
            message: '请选择文件',
            trigger: 'blur'
          }
        ],
        fileType: [
          {
            required: true,
            message: '请选择文件类型',
            trigger: 'change'
          }
        ]
      },
      URL: '',
      token: '',
      fileList: [],
      clearFiles: '',
    }
  },
  mounted() {
    this.URL = ''
    this.token = useUserStore().token
  },
  methods: {
    handleSuccess(res, file) {
      this.fileList = []
      this.fileForm.fileUrl = file.response.data
      this.fileUrlShow = true
      this.fileUpload = false
    },
  }
}
</script>

<style>
</style>