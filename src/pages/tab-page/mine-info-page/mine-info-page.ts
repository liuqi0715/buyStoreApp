import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { BASICINFO_URL} from "../../../providers/Constants";
import { orderAgreePage } from "../order-agree-page/order-agree-page";
import{servicesInfo} from"../../../providers/service-info";
import { App } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';//底部提示信息
import { FileChooser } from '@ionic-native/file-chooser';//选择图片上传
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
import { interfaceUrls } from "../../../providers/serviceUrls";

@Component({
  selector: 'mine-info-page',
  templateUrl: 'mine-info-page.html',
})
export class myInfoPage {

  datas: any = {};
  user: any = {};
  StoreUrl="";    //上传头像接口返回的图片地址
  storeImage="";  //门店照片地址
  hasImg = true;  //默认显示图片
  WXphone="";  //微信账号
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public urlService: urlService,
    public servicesInfo: servicesInfo,
    private app: App,
    public actionSheetCtrl: ActionSheetController,
    private fileChooser: FileChooser,
    public toastCtrl: ToastController,
    private camera: Camera,
    private FileTransfer: FileTransfer,
    public alertCtrl: AlertController
    ) {
  }

  ionViewDidLoad(){
    this.getInfoDatas();
  }

  goBack(){
    this.navCtrl.pop();
  }
  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 2000,
      position:'middle'

    });
    toast.present();
  }

  getInfoDatas(){
    
    let data = {
       "data":{
       },
       "token":this.servicesInfo.token,
    };
   console.log(data);
    let self = this;
    this.urlService.postDatas(BASICINFO_URL,data).then(function(resp){
      if(resp){
        if(resp.errorinfo == null){
            self.datas = resp.data;
            console.log(resp.data);
            self.user = resp.data.storesInfo;
        }else{
          /*token失效的问题*/
          if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
    });
  }
  changeImg(){
    let actionSheet = this.actionSheetCtrl.create({
      title: '请合理选择图片来源。',
      buttons: [
        {
          text: '拍照上传',
          role: 'destructive',
          handler: () => {
            this.takePicture();
          }
        },{
          text: '从相册中选择',
          handler: () => {
             this.shosePicture()
          }
        },{
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  

  takePicture(){
    console.log(this.servicesInfo.userPhone)
    console.log("门店照片");
    console.log(this.camera,"???")
    const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500
      }
      this.camera.getPicture(options).then((imageData) => {      
        let base64Image = 'data:image/jpeg;base64,' + imageData;
 
            this.hasImg=false;
            var box = document.getElementById("stroeImg");
            box.innerHTML = "";
            var img = document.createElement("img");
            img.src = imageData;
            this.storeImage = imageData;
            img.setAttribute("class","imgSize")
            box.appendChild(img);
            this.uploadStoreImg();



      }, (err) => {
        this.toast("上传头像添加失败。")
      });
}
//选择照片上传
shosePicture(){

    console.log("头像");
    var self0 = this;
    this.fileChooser.open()
    .then(
            function(url){
              var box = document.getElementById("stroeImg");
              box.innerHTML = "";
              var img = document.createElement("img");
              img.src = url;
              self0.storeImage = url;
              img.setAttribute("class","imgSize");
              box.appendChild(img);
              self0.uploadStoreImg();
 
            }
        )
    .catch(
        function(e){         
          self0.toast("照片添加失败。")
        }
    );
}
uploadStoreImg() {
  var self = this;
  console.log(self.user.mobilePhone)
  console.log(self.storeImage,"===self.storeImage")
 const fileTransfer: FileTransferObject = this.FileTransfer.create();
  const apiPath = interfaceUrls.uploadImage+"?key="+ self.user.mobilePhone+"&type="+2;
  let options: FileUploadOptions = {
    fileKey: 'file',
    fileName: 'storeImage.jpg',   //文件名称
    headers: {},

  };

  fileTransfer.upload(self.storeImage, apiPath, options)
    .then((data ) => {
      data.response = JSON.parse(data.response);
        if((data as any).response.errorinfo==null){
          this.StoreUrl =  (data as any).response.data.url;
          this.toast("上传成功")
        }
     console.log(data.response)
     
    }, (err) => {
      // alert(err)
      console.log(err,"??");
      this.toast(err);
    });
}
  changeWxPhone(wx){
    
    let data = {
       "data":{
         "phone":wx.WXphone
       },
       "token":this.servicesInfo.token,
    };
   console.log(data,interfaceUrls.updateWXPhone);
    let self = this;
    this.urlService.postDatas(interfaceUrls.updateWXPhone,data).then(function(resp){
      if(resp){
        // if(resp.)
        console.log(resp)
        if(resp.errorinfo == null){
           self.toast("修改成功");
          self.user.refereePhone = wx.WXphone;
           
        }else{
          /*token失效的问题*/
          if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
    }).catch(err=>{
      self.toast("服务器异常，请稍候再试")
    })
    ;
  }
  changeWX(){
    let self = this;
    let prompt = this.alertCtrl.create({
      title: '修改微信账号',
      message: "此账号用来接收平台补贴,请谨慎修改。",
      inputs: [
        {
          name: 'WXphone',
          placeholder: "请输入新的微信号"
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked',data);
            self.toast("操作取消");
          }
        },
        {
          text: '确定',
          handler: data => {
            console.log('Saved clicked',data);
            if(data.WXphone==""){
              self.toast("未进行修改")
            }else{
              self.changeWxPhone(data);
            }
            // this.changeWxPhone()
           
          }
        }
      ]
    });
    prompt.present();
  }
  




}
