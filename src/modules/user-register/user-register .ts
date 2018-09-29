import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';


import {UserRegAddress} from "../user-Reg-Address/userRegAddress"

import { FileChooser } from '@ionic-native/file-chooser';//选择图片上传
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';        //提示信息
import { App } from 'ionic-angular';
import {stringify} from 'qs';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ActionSheetController } from 'ionic-angular';//底部提示信息
import {Http,Headers} from '@angular/http';
import { interfaceUrls }from "../../providers/serviceUrls";//接口地址
import { NavParams } from 'ionic-angular';
import{servicesInfo} from "../../providers/service-info";
import{ UserOpenAccount }from"../user-open-account/userOpenAccount";    //开户页面
import { UserLogin } from "../user-login/user-login";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ImagePicker } from '@ionic-native/image-picker';

declare var $: any;//引入jq

@Component({
    selector: 'user-register',
    templateUrl: 'user-register.html',
})
export class UserRegister {
    constructor(public navCtrl: NavController,
        private fileChooser: FileChooser,
        public toastCtrl: ToastController,
        private camera: Camera,
        private FileTransfer: FileTransfer,
        private file: File,
        private app: App,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        private http: Http,
        public NavParams:NavParams,
        public servicesInfo:servicesInfo,
        private network: Network,
        private androidPermissions: AndroidPermissions,
        private imagePicker: ImagePicker
    )
{
    
};

    stroe={
        stroeName:"",
        stroePerson:"",
        stroePersonPhone:""
    }

    /*--摄像头--*/
    hasImg=true;
    hasnotImg=false;
    path: string;

    /*选择图片上传*/
    linseImg = true;


    /*--摄像头--*/

    leader;
    stroeStyle=null;
    stroeAddres=null;
    cityData: any[]=null; //城市数据
    cityName: string = '请选择您的城市'; //初始化城市名
    code: string; //城市编码
    areadata: any;
    errorTip=false;
    errorTipMsg;

    imgType = 0;
    StoreType:any=null;    //店铺类型
    storeImage:any=null;    //门店照片
    storeLicenseImage:any=null;//营业执照照片

    StoreT:any;
    addressSer;
    datas=[{"a":1},{"a":2},{"a":3}];


    StoreUrl=null;
    LicenseUrl=null;

    hasSuccess=false;    //显示模态框
    offline:boolean=false;

    uploadImgFail = false;   //上传失败时显示失败摸态框
    uploadLinFail = false;

    uploadImgUrl = false;  //上传图片后的门店图片缩略图开关
    uploadImgUrl2 = false; //上传图片后的营业执照缩略图开关

    storeUrlScale = "assets/img/login/camera.png";         //保存门店缩略图
    licenseUrlScale = "assets/img/login/camera.png";       //保存营业执照缩略图

    test(){
        var test = [];
        for(var i = 0;i<this.datas.length;i++){
            test.push(this.datas[i]);
        }
        test.splice(1,1);
    }

    toast(actions){
        let toast = this.toastCtrl.create({
          message: actions,
          duration: 2000,
          position:'middle'

        });
        toast.present();
      }

      ngOnInit(){

        let self = this;
        let params = {
            "data":{
            }
        }
        this.http.post(interfaceUrls.getStoreType,params)
        .map(res => res.json())
        .subscribe(function (data) {
            if(data.errorinfo==null){
                self.StoreType = data.data.storeTypeList;

            }else{
                // this.toast("注册成功");
            }
        })
    }
    checkNetwork(){
        let self = this;

        self.network.onDisconnect().subscribe(()=>{
              self.offline=true;
              self.toast('无网络连接，请检查');
        });
        self.network.onConnect().subscribe(()=>{
              self.offline=false;
        });

      }
    ionViewDidLoad(){
        this.checkNetwork()
    }
    getType(){
        // console.log(t.configValue);
        // console.log("11",this.StoreT);
    }
    address(){
        this.navCtrl.push(UserRegAddress)
            // this.navCtrl.push(UserReg2);
    }


    takePicture(){

        const options: CameraOptions = {
            quality: 85,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 600,
            targetHeight: 600
          }
          this.camera.getPicture(options).then((imageData) => {
            this.hasnotImg=true;
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.path = imageData;

            if(this.imgType==1){
                this.storeImage = imageData;
                this.uploadStoreImg();
                this.StoreUrl = null;
            }else if(this.imgType==2){
                this.storeLicenseImage = imageData;
                this.LicenseUrl = null;
                this.uploadLicenseImg()
            }

          }, (err) => {
            this.toast("照片添加失败。")
          });
    }


  chosePicture(){

    let self0 = this;
    const options = {
      maximumImagesCount:1,
      quality: 85,
      width:600,
      height:600
    }

    this.imagePicker.getPictures(options).then((results) => {
        if(results.length<=0){
            self0.toast("图片未选择");
        }else{
           if (self0.imgType == 1) {
              self0.storeImage = results.pop();
              self0.StoreUrl = null;
              self0.uploadStoreImg();
            } else if (self0.imgType == 2) {
              self0.storeLicenseImage = results.pop();
              self0.LicenseUrl = null;
              self0.uploadLicenseImg();
            }
        }



    }, (err) => {

     });
  }






//上传图片地址----
uploadStoreImg() {


    this.StoreUrl == null
    this.uploadImgFail = true;
    this.hasImg = false;
    this.uploadImgUrl = false;
    var self = this;
    const fileTransfer: FileTransferObject = this.FileTransfer.create();
    const apiPath = interfaceUrls.uploadImage+"?key="+self.servicesInfo.userPhone+"&type="+2;
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'storeImage.jpg',   //文件名称
      headers: {},
    };

    fileTransfer.upload(self.storeImage, apiPath, options)
      .then((data ) => {

          data.response = JSON.parse(data.response);
          if((data as any).response.errorinfo==null){

            self.StoreUrl =  (data as any).response.data.url;
            self.storeUrlScale = (data as any).response.data.urlScale
                  var box = document.getElementById("stroeImg");
                  //box.innerHTML = "";
                  self.hasImg = false;
                  self.uploadImgUrl = true;
                  self.uploadImgFail = false;

          }else{
            self.toast((data as any).response.errorinfo.errormessage);
            self.uploadImgFail = false;
            self.hasImg = true;
          }
      }, (err) => {
          self.uploadImgFail = false;
          self.hasImg = true;
          self.storeImage = ""
          self.uploadImgUrl = false;
          switch(err.code)
          {
          case 1:
            self.toast("未找到相关文件");
            break;
          case 2:
            self.toast("服务器异常");
            break;
          case 3:
            self.toast("网络异常");
          break;
          case 4:
            self.toast("上传被中止");
          break;
          case 5:
            self.toast("重复上传");
          break;
          default:
            self.toast("服务器异常");
          }
      });
  }
uploadLicenseImg() {

    this.uploadImgUrl2 = false;
    this.uploadLinFail = true;
    this.linseImg = false;
    this.LicenseUrl == null
    var self = this;
    // console.log(self.servicesInfo.userPhone)
    const fileTransfer: FileTransferObject = this.FileTransfer.create();
    const apiPath = interfaceUrls.uploadImage+"?key="+self.servicesInfo.userPhone+"&type="+3;
    // alert(apiPath);
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'storeLicenseImage.jpg',   //文件名称
      headers: {},
    };

    fileTransfer.upload(this.storeLicenseImage, apiPath, options)
      .then((data) => {
        data.response = JSON.parse(data.response);
        if((data as any).response.errorinfo==null){
          self.LicenseUrl =  (data as any).response.data.url;
          self.licenseUrlScale = (data as any).response.data.urlScale


          self.linseImg = false;
         // box2.innerHTML = "";
          self.uploadLinFail = false;
          self.uploadImgUrl2 = true;

        }else{
          self.toast((data as any).response.errorinfo.errormessage);
          self.uploadLinFail = false;
          self.linseImg = true;
        }
      }, (err) => {
          self.uploadLinFail = false;
          self.linseImg = true;
          self.storeLicenseImage = "";
          self.uploadImgUrl2 = false;
          switch(err.code)
          {
          case 1:
            self.toast("未找到相关文件");
            break;
          case 2:
            self.toast("服务器异常");
            break;
          case 3:
            self.toast("网络异常");
          break;
          case 4:
            self.toast("上传被中止");
          break;
          case 5:
            self.toast("重复上传");
          break;
          default:
            self.toast("服务器异常");
          }
      });
  }




checkPermission(){
   var self = this;
   self.androidPermissions.checkPermission(self.androidPermissions.PERMISSION.CAMERA).then(
      result => {
        // alert('可读权限'+result.hasPermission);
        if(result.hasPermission == false){
          self.androidPermissions.requestPermission(self.androidPermissions.PERMISSION.CAMERA).then(
          result => {
            self.androidPermissions.checkPermission(self.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
              result => {
                // alert('可写权限'+result.hasPermission);
                if(result.hasPermission == false){
                   self.androidPermissions.requestPermission(self.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
                      result => {
                          self.upLoad();
                      },
                      err => {
                          // alert(JSON.stringify(err));
                          self.toast("存储权限未打开,上传图片失败");
                      }
                   )
                }else{
                  self.upLoad();
                }

              }
            );
          })
        }else{
            self.androidPermissions.checkPermission(self.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
              result => {
                // alert('可写权限'+result.hasPermission);
                if(result.hasPermission == false){
                   self.androidPermissions.requestPermission(self.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
                      result => {
                          self.upLoad();
                      },
                      err => {
                          // alert(JSON.stringify(err));
                          self.toast("存储权限未打开,上传图片失败");
                      }
                   )
                }else{
                  self.upLoad();
                }

              }
            );
        }
      },
      err => {
        self.toast("相机权限未打开,上传图片失败");
      }
    );
}

upLoad() {
    let actionSheet = this.actionSheetCtrl.create({
        title: '请合理选择图片来源，且您必须上传图片，这将影响您的注册审核进度。',
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
               this.chosePicture()
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

//门店照片-----------为1

  stroeImg(){
        if (this.uploadImgFail==true){
            console.info('正在上传中。。')
        }else{
          this.checkPermission();
          this.imgType = 1;
        }


    }
//营业执照-----------为2
     license(){
       if (this.uploadLinFail == true){
          console.info("上传图片中。。")
       }else{
         this.checkPermission();
         this.imgType = 2;
       }

     }
     confirm(str: string = '您确定此操作吗？',  noStr: string = '取消',okStr: string = '确定'): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.alertCtrl.create({
                title: "提示", message: str, enableBackdropDismiss: false, buttons: [{
                    text: okStr, handler: resolve
                }, {
                    text: noStr, handler: () => {
                        reject('操作被取消')
                    }
                }]
            }).present();
        });
    }


    regsiter(){
        // this.navCtrl.push(UserOpenAccount);    //仅做测试用，正式环境需要注释

        if(this.offline == true){
            this.toast('无网络连接，请检查');
            return;
       }
        let regStroe = new RegExp(/^(\W){1,7}$/) ;            //店铺名字
        let regName = new RegExp(/^([\u4e00-\u9fa5]){2,7}$/) ;//姓名
        if(this.stroe.stroeName==""||this.stroe.stroeName==undefined){

            this.toast("请输入正确的店铺名称")
            return;
        }else if(this.stroe.stroePerson==""||this.stroe.stroePerson==undefined||regName.test(this.stroe.stroePerson)==false){

            this.toast("请输入正确的姓名");
            return;
        }else  if(this.stroe.stroePersonPhone==""||this.stroe.stroePersonPhone==undefined){

            this.toast("请输入微信账号");
            return;
        }else if(this.StoreT==""||this.StoreT==undefined){
            this.toast("请选择店铺类型")
            return;

        }else if(this.storeImage==undefined||this.storeImage==""){
            this.toast("请上传门店图片")

            return;
        }else  if(this.storeLicenseImage==undefined||this.storeLicenseImage==""){
            this.toast("请上传营业执照");
            return;
        }else  if(this.servicesInfo.areaId==undefined){
            this.toast("请选择详细地址");
            return;
        }else if(this.servicesInfo.address==""||this.servicesInfo.address==undefined){
            this.toast("请输入详细地址");
            return;
        }else if(this.StoreUrl==null){
            if(this.uploadImgFail == true){
              this.toast("图片上传中，请勿操作")
            }else{
              this.toast("门店图片上传失败,请重新选择")
              return;
            }

        }else if(this.LicenseUrl==null){
          if(this.uploadLinFail==true){
            this.toast("图片上传中，请勿操作")
          }else{
              this.toast("营业执照图片上传失败，请重新选择")
              return;
          }

        } else {

            this.confirm("请确定您的信息输入正确,这将影响您后续的操作。")
            .then(()=>{
                this.hasSuccess = true;
                this.servicesInfo.stroePerson = this.stroe.stroePerson;
                let self = this;
                let params = {
                    "data":{
                        "storeName":this.stroe.stroeName,
                        "storeType":this.StoreT,
                        "address":this.servicesInfo.address,
                        "storeImage":this.StoreUrl,
                        "storeLicenseImage":this.LicenseUrl,
                        "userId":this.servicesInfo.userId,
                        "longitude":this.servicesInfo.longitude,
                        "latitude":this.servicesInfo.latitude,
                        "areaId":this.servicesInfo.areaId,
                        "refereePhone":this.stroe.stroePersonPhone,
                        "userName":this.stroe.stroePerson
                    }
                }
                this.http.post(interfaceUrls.updStoreRegistered,params)
                .map(res => res.json())
                .subscribe(function (data) {
                    if(data.data.msgCode=="Y"){
                        self.toast("注册成功");
                        self.servicesInfo.orgId = data.data.userId    //不确定
                        self.servicesInfo.creditCode = data.data.creditCode;    //社会统一信用代码
                        if(self.servicesInfo.creditCode==null || self.servicesInfo.creditCode==""){
                            self.servicesInfo.creditCode =  data.data.registerNo;    //注册号
                        }

                        if(data.data.state=="1"){
                            setTimeout(()=>{
                                self.navCtrl.push(UserOpenAccount);
                            },2000)

                        }else if(data.data.state=="0"){
                            setTimeout(()=>{
                                self.app.getRootNav().setRoot(UserLogin);
                                self.servicesInfo.hasRegister = true;
                            },2000)
                        }
                        self.hasSuccess = false;
                    }else{
                        self.toast(data.errorinfo.errormessage);
                        self.hasSuccess = false;
                    }
                },err=>{
                  self.hasSuccess = false;
                  self.toast("注册失败，请检查网络后重试。");
                  setTimeout(()=>{
                    self.app.getRootNav().setRoot(UserLogin);
                  },2000)
                })
            })
            .catch(err => {
                    this.toast("操作取消。");
            })
        }
    }
    ionViewDidEnter(){
        if(this.servicesInfo.pcar!=undefined&&this.servicesInfo.address!=undefined){
            this.addressSer = this.servicesInfo.pcar+","+this.servicesInfo.address;
        }else{
            this.addressSer = "选择详细地址"
        }
    }
}

