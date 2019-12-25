<template>
  <div id="Acquisition">
    <!-- vant组件-上传照片 -->
    <div style>
      <div style="padding-top:30px;text-align: center;">
        <div class="addbtnbox" v-for="(item,index) in fileList" :key="index">
          <img
            :src="item.content"
            alt
            style="display: block;width: 100%;height: 100%;object-fit: cover;"
            @click="preview"
          />
          <van-icon
            name="delete"
            size="20px"
            style="position: absolute;right: 0;bottom: 0;padding: 2px;background-color: rgba(0, 0, 0, 0.45);"
            color="#fff"
            @click="deleteItem(index)"
          />
        </div>
        <van-uploader
          upload-text="请上传照片"
          preview-image
          v-model="fileList"
          :max-count="1"
          :before-read="beforeRead"
          :after-read="onRead"
          name="add-o"
          v-show="fileList.length<1"
        >
          <div class="addbtnbox">
            <van-icon name="plus" size="64px" color="rgb(208, 208, 208)" />
          </div>
        </van-uploader>
      </div>
    </div>

    <div class="formGroup">
      <van-cell-group>
        <van-field
          v-model="userInfo.userNo"
          center
          clearable
          label="工号"
          class="fieldStyle"
          placeholder="请输入工号"
        >
          <van-button slot="button" size="small" type="primary" @click="search()">查询</van-button>
        </van-field>

        <van-field class="fieldStyle" v-model="userInfo.userName" clearable label="姓名" placeholder disabled />

        <van-field class="fieldStyle" v-model="userInfo.deptName" clearable label="部门" placeholder disabled />

        <van-field class="fieldStyle" v-model="userInfo.userIdentity" clearable label="身份证" placeholder disabled />
        <div></div>
      </van-cell-group>
    </div>

    <div class="footbtn">
      <van-button
        type="primary"
        v-bind:disabled="disableSubmit"
        v-bind:loading="saving"
        loading-text="保存中..."
        v-cloak
        @click="saveData"
        ref="submit"
      >提 交</van-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import reqwest from 'reqwest'
import takeApi from "@/api/takePhoto";
import cfg from '@/config/config'
import { Button, Uploader, ImagePreview, Icon, Field,CellGroup,Toast } from "vant";
Vue.use(ImagePreview);
Vue.use(Toast);
Vue.use(Field);

export default {
  components: {
    [Button.name]: Button,
    [Uploader.name]: Uploader,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [ImagePreview.name]: ImagePreview,
    [Toast.name]:Toast
  },
  name: "",
  data() {
    return {
      apiUrl:cfg.apiUrl,
      fileIds: [],
      fileList: [], //上传的照片
      saving: false,
      disableSubmit: false, //提交按钮状态
      userInfo:{
        userNo: '', //工号
        userName: '', //姓名,
        deptSerial:'',//部门编号
        deptName: '',//部门名称
        userIdentity:'' //身份证
      }
    };
  },
  methods: {
    search(){
      let userNo = this.userInfo.userNo.trim();
      if(userNo=='' || userNo == null){
        Toast.fail('请输入工号');
        return;
      }
      takeApi.getUserInfoByUserNo({
        searchName:userNo
      }).then(res=>{
        if(res.code==200){
          if(res.result!=null){
            this.userInfo = res.result;
            if(this.userInfo.userIdentity == '' || this.userInfo.userIdentity == null){
              this.userInfo.userIdentity = '该员工信息未输入身份证号信息';
            }
          }else{
            this.userInfo.userName = '';
            this.userInfo.deptName = '';
            this.userInfo.userIdentity = '';
            Toast.fail('该员工不存在');
          }
        }else{
            Toast.fail('出现异常');
        }
      });
    },
    // 图片预览
    preview() {
      let arr = [];
      for (let i = 0; i < this.fileList.length; i++) {
        const element = this.fileList[i];
        arr.push(element.content);
      }
      // console.log(arr);
      ImagePreview(arr);
    },
    // 判断上传的是否是jpg图片格式
    beforeRead(file) {
      if (file.type != "image/png" && file.type != "image/jpg" && file.type != "image/jpeg") {
        Toast.fail('请选择图片');
        return false;
      }
      return true;
    },
    onRead(file) {
      this.fileList = [];
      this.fileList.push(file); // fileList是一个数组
    },

    // 删除当前照片
    deleteItem(index) {
      // 删除指定下标的图片对象
      if (isNaN(index) || index >= this.fileList.length) {
        return false;
      }
      let tmp = [];
      //for (let i = 0, len = this.fileList.length; i < len; i++) {
      //  if (this.fileList[i] == this.fileList[index]) {
      //    tmp.push(this.fileList[i]);
      //  }
      //}
      this.fileList = tmp;
      this.fileIds.splice(index, 1);
    },
    // 提交时按钮状态
    setSumitButtonStatus(bol) {
      this.saving = bol;
      this.disableSubmit = bol;
    },
    // 提交
    saveData() {
      
      let _this = this;
      // 验证员工信息
      if(this.userInfo.userNo == '' || this.userInfo.userNo == null){
        Toast.fail('请输入工号');
        return;
      }else{
        if(this.userInfo.userName == '' || this.userInfo.userName == null){
          Toast.fail('未查询到信息');
          return;
        }
      }

      //验证是否选择文件
      if(this.fileList.length==0){
        Toast.fail('请选择图片');
        return;
      }
      
      //显示加载样式
      this.setSumitButtonStatus(true);

      //准备请求的条件
      const formData = new FormData();
      let file = this.fileList[0].file;
      let userInfo = JSON.stringify({
        'userNo':this.userInfo.userNo,
        'userName':this.userInfo.userName,
        'deptSerial':this.userInfo.deptSerial,
        'deptName':this.userInfo.deptName
      });
      formData.append('file',file);
      formData.append('userInfo',userInfo);

      //发送请求
      reqwest({
        url: this.apiUrl+'api/user/face/takePhoto',
        method: 'post',
        processData: false,
        data: formData,
        success: (result) => {
          if(result.code=='200'){
            _this.fileIds = [];
            _this.fileList = [];
            _this.userInfo = {
              userNo: '', //工号
              userName: '', //姓名,
              deptSerial:'',//部门编号
              deptName: '',//部门名称
              userIdentity:'' //身份证
            }
            Toast.success('上传成功');
          }else{
            Toast.fail('上传失败');
          }
        },
        error: (e) => {
            Toast.fail('出现异常');
        },
        complete:() => {
          //显示加载样式
          _this.setSumitButtonStatus(false);
        }
      });

    }
  }
};
</script>

<style scoped>
#Acquisition {
  padding-bottom: 226px;
}
.footbtn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 10px;
  z-index: 1000;
  background-color: #fff;
  border-top: 1px solid #eee;
}
.footbtn .van-button {
  flex: 1;
  margin: 0 1%;
  font-size: 20px;
}
.van-uploader {
  position: relative;
  display: flex;
  text-align: center;
  justify-content: center;
}
.addbtnbox {
  border: 1px dashed #e5e5e5;
  width: 14rem;
  height: 18rem;
  display: flex;
  display: -webkit-inline-box;
  align-items: center;
  justify-content: center;
  position: relative;
}
.fieldStyle {
  padding: 14px;
}
.formGroup {
  padding: 0px 15px 0px 0px;
  position: fixed;
  right: 0px;
  left: 0;
  bottom: 64px;
}
</style>
