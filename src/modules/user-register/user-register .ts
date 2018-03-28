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
    )
{
    console.log(this.servicesInfo.latitude,"latitude")
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
    test(){
        var test = [];
        for(var i = 0;i<this.datas.length;i++){
            test.push(this.datas[i]);
        }
        test.splice(1,1);
        console.log(test);
        console.log(this.datas);
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
        console.log("11",this.StoreT);
    }
    address(){
        console.log(">>")
        this.navCtrl.push(UserRegAddress)
            // this.navCtrl.push(UserReg2);
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
            this.hasnotImg=true;
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.path = imageData;
            if(this.imgType==1){
                this.hasImg=false;
                var box = document.getElementById("stroeImg");
                box.innerHTML = "";
                var img = document.createElement("img");
                img.src = imageData;
                this.storeImage = imageData;
                img.setAttribute("class","imgSize")
                box.appendChild(img);
                this.uploadStoreImg();

            }else if(this.imgType==2){
                this.linseImg=false;
                var box2 = document.getElementById("license");
                box2.innerHTML = "";
                var img2 = document.createElement("img");
                img2.src = imageData;
                this.storeLicenseImage = imageData;
                img2.setAttribute("class","imgSize")
                box2.appendChild(img2);
                this.uploadLicenseImg()
            }

          }, (err) => {
            this.toast("照片添加失败。")
          });
    }
    //选择照片上传
    shosePicture(){

        console.log("营业执照");
        var self0 = this;
        this.fileChooser.open()
        .then(
                function(url){
                    if(self0.imgType==1){
                        var box = document.getElementById("stroeImg");
                        box.innerHTML = "";
                        var img = document.createElement("img");
                        img.src = url;
                        self0.storeImage = url;
                        img.setAttribute("class","imgSize");
                        box.appendChild(img);
                        self0.uploadStoreImg();
                    }else if(self0.imgType==2){
                        var box2 = document.getElementById("license");
                        box2.innerHTML = "";
                        var img2 = document.createElement("img");
                        img2.src = url;
                        self0.storeLicenseImage = url;
                        img2.setAttribute("class","imgSize")
                        box2.appendChild(img2);
                        self0.uploadLicenseImg()
                    }
                }
            )
        .catch(
            function(e){
                self0.toast("照片添加失败。")
            }
        );
    }

//上传图片地址----
uploadStoreImg() {
    var self = this;
    console.log(self.servicesInfo.userPhone)
    console.log(self.storeImage,"===self.storeImage")
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
            this.StoreUrl =  (data as any).response.data.url;
          }
       console.log(data.response)

      }, (err) => {
        // alert(err)
        console.log(err,"??");
        this.toast(err);
      });
  }
uploadLicenseImg() {
    // alert("11")
    var self = this;
    console.log(self.servicesInfo.userPhone)
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
          this.LicenseUrl =  (data as any).response.data.url;
        }
        console.log(data.response)
      }, (err) => {
        // alert(err)
        console.log(err,"??");
        this.toast(err);
      });
  }


  testImg(){
    // alert("12")
    this.uploadStoreImg();
    this.uploadLicenseImg();
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

//门店照片-----------为1

    stroeImg(){
        // alert("11")
        this.upLoad();
        this.imgType = 1;

    }
     /*--上传照片--*/
//营业执照-----------为2
     license(){
        this.upLoad();
        this.imgType = 2;
     }
     confirm(str: string = '您确定此操作吗？', okStr: string = '确定', noStr: string = '取消'): Promise<any> {
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
        // let regPhone= new RegExp(/^[a-zA-Z\d_]{5,}$/);//微信号
        // [a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}
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
             this.toast("门店图片上传失败")
             return;
        }else if(this.LicenseUrl==null){
            this.toast("营业执照图片上传失败")
            return;
        } else {


            this.confirm("请确定您的信息输入正确,这将影响您后续的操作。")
            .then(()=>{
                console.log("===");
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
                        // msgCode
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
                            },2000)

                        }

                        self.hasSuccess = false;
                    }else{
                        self.toast(data.errorinfo.errormessage);
                        self.hasSuccess = false;
                    }


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

