import { Component } from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams, Tabs} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { urlService } from "../../../providers/urlService";
import { RELEASEORDER_URL, FILEUPLOAD_URL } from "../../../providers/Constants";
import { ActionSheetController } from 'ionic-angular';//底部提示信息
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
import { TabSell } from "../tab-sell-page/tab-sell-page";
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import {UserLogin} from "../../../modules/user-login/user-login";

declare var BMap;
declare let baidumap_location: any;

@Component({
  selector: 'order-confirm-page',
  templateUrl: 'order-confirm-page.html',
})
export class orderConfirmPage {

  datas : any = [];
  public totalPrice = 0;
  public totalWeight = 0;
  public orderNo = window.sessionStorage.getItem('newOrder');
  public storage = window.sessionStorage;
  public goodListTitle = ["型号","单价","数量","合计"];
  private dataTemp1 = null;
  public canEdit = false;
  public lat = null;
  public lon = null;
  offline:boolean=false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private camera: Camera,
    public urlService: urlService,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private transfer: FileTransfer,
    private file: File,
    public tabs: Tabs,
    private network: Network,
    public servicesInfo: servicesInfo,
    private app: App,
    ) {
  }

  ionViewDidEnter() {
    this.checkNetwork();
  	this.dataTemp1 = JSON.parse(this.navParams.data.orderData);

    for(var i = 0;i < this.dataTemp1.length;i++){
        var dataArray = this.dataTemp1[i].batteryTypeList;
        var dataArrayLoop = dataArray.length;
        for(var j = 0;j < dataArrayLoop;j++){
           if(dataArray[j].value == 0){
               this.dataTemp1[i].batteryTypeList.splice(j, 1);
               j = j - 1;
               dataArrayLoop = dataArrayLoop - 1;
           };
        }
    }

    this.datas = this.dataTemp1;
    this.canEdit = this.dataTemp1[0].public;
    console.log(this.dataTemp1[0]);
    this.getPos();
    this.countAll();
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

  getPos(){
    let self = this;

    if('undefined' != typeof baidumap_location){
      baidumap_location.getCurrentPosition(function(result){
        self.lat = result.latitude;
        self.lon = result.longitude;
      });
    }
  }

  countAll(){
      this.totalPrice = 0;
      this.totalWeight = 0;
      for(var i = 0;i < this.datas.length;i++){
        var dataArray = this.datas[i].batteryTypeList;
        for(var j = 0;j < dataArray.length;j++){
           dataArray[j].unitPricePre = Math.round((parseFloat(this.datas[i].price)*parseFloat(dataArray[j].commWeight))*Math.pow(10, 2))/Math.pow(10, 2);
           dataArray[j].total = Math.round((parseFloat(this.datas[i].price)*parseFloat(dataArray[j].commWeight)*parseFloat(dataArray[j].value))*Math.pow(10, 2))/Math.pow(10, 2);
           this.totalPrice = Math.round((this.totalPrice+parseFloat(this.datas[i].price)*parseFloat(dataArray[j].commWeight)*parseFloat(dataArray[j].value))*Math.pow(10, 2))/Math.pow(10, 2);
           this.totalWeight = Math.round((this.totalWeight+parseFloat(dataArray[j].commWeight)*parseFloat(dataArray[j].value))*Math.pow(10, 2))/Math.pow(10, 2);
        }
      }
  }

  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }

   // 输入数量，获取相应输入值
  limitIn(idx){

    function clearNoNum(obj){  
        obj = obj.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
        obj = obj.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
        obj = obj.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
        if(obj.indexOf(".")< 0 && obj !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
         obj= parseFloat(obj);  
        }
        return obj;  
     }

     if(this.datas[idx].price !=="" && this.datas[idx].price !==" " && this.datas[idx].price !== null && this.datas[idx].price > 0 && this.datas[idx].price < 999){
        // this.datas[idx].price = Math.round(this.datas[idx].price*Math.pow(10, 2))/Math.pow(10, 2);
        this.datas[idx].price = clearNoNum(this.datas[idx].price);
     }else{
        this.datas[idx].price = 0;
     }
     this.countAll();
  };
   //递增
  plus(idx){
     if(this.datas[idx].price < 999){
        this.datas[idx].price = Math.round((parseFloat(this.datas[idx].price) + 0.1)*Math.pow(10, 2))/Math.pow(10, 2);
     }else{
        this.datas[idx].price = 999;
     }
     this.countAll();
  };
   //递减
  minus(idx){
     if(this.datas[idx].price > 0){
        this.datas[idx].price = Math.round((parseFloat(this.datas[idx].price) - 0.1)*Math.pow(10, 2))/Math.pow(10, 2);
     }else{
        this.datas[idx].price = 0;
     }
     this.countAll();
  };

  upload(fileUrl) {

    // var data = {
    //    "data":{
    //      "key":this.orderNo,
    //      "type":1
    //    }
    // };

    var self = this;
    var fileTransfer = this.transfer.create();
    let options: FileUploadOptions = {
       fileKey: 'file',
       fileName: self.orderNo + '.jpg',
       headers: {}
    }
    
    var uploadUrl = FILEUPLOAD_URL + '?key='+this.orderNo+'&type='+1;
    fileTransfer.upload(fileUrl, uploadUrl, options)
     .then((data) => {
       self.toast("报单成功");
       // setTimeout(function(){
       //   // self.navCtrl.setRoot(TabSell);
       // },3000);
       self.navCtrl.setRoot(TabSell);
     }, (err) => {
       self.toast(err);
     });
  }

  openCam(){
      var self = this;
      const options: CameraOptions = {
        quality: 90,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500
      } 

      this.camera.getPicture(options).then((imageData) => {

       self.upload(imageData);

      }, (err) => {
       self.toast(err);
      });
   }
 
   next(){

     if(this.offline == true){
         this.toast('无网络连接，请检查');
         return;
     }

     let self = this;
     var count = 0;
     var submitObj = [];

     for(var i = 0;i< this.datas.length;i++){
       if(this.datas[i].batteryTypeList.length > 0){
          submitObj.push(this.datas[i]);
       }
     }

     for(var i = 0;i< submitObj.length;i++){
       submitObj[i].latitudePreOrder = this.lat;
       submitObj[i].longitudePreOrder = this.lon;
       if(submitObj[i].price == 0){
          count++;
       }
     }

     if(count > 0){
       self.toast("报价不能为0");
       return;
     }

     let data = {
         "userId": this.servicesInfo.userId,
         "version": 1,
         "data":{
            "releaseRoderList":submitObj,
         },
         "token":this.servicesInfo.token,
      };

      this.urlService.postDatas(RELEASEORDER_URL,data).then(function(resp){
          if(resp){
            if(resp.errorinfo == null){
                self.orderNo = resp.data.orderNo;
                self.openCam();
               
            }else{
              self.toast(resp.errorinfo.errormessage);
              // self.openCam();      //李子让暂时注释
              /*token失效的问题*/
              if(resp.errorinfo.errorcode=="10003"){
                self.app.getRootNav().setRoot(UserLogin);
              }
            }
          }
        });
    
      // self.navCtrl.push(TabSell, {});

      

   }

}
