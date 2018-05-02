import { Component } from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams, AlertController, ActionSheetController, App, Tabs, ToastController, LoadingController } from 'ionic-angular';
import { TabSell } from "../tab-sell-page/tab-sell-page";
import { urlService } from "../../../providers/urlService";
import { ORDERBORN_URL, RELEASEORDER_URL, FILEUPLOAD_URL } from "../../../providers/Constants";
import { Network } from '@ionic-native/network';
import { UserLogin} from "../../../modules/user-login/user-login";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { AndroidPermissions } from '@ionic-native/android-permissions';
declare  var $; 
declare var BMap;
declare let baidumap_location: any;

@Component({
  selector: 'order-born-page',
  templateUrl: 'order-born-page.html',
})
export class orderBornPage {
  public orderlist = [];//用于存储提交的所有数据信息；
  public models = [];
  public numsArray = [];
  public total1 = null;
  public total2 = null;
  public total3 = null;
  public unit1 = null;
  public unit2 = null;
  public unit3 = null;
  public customFocused = false;
  public navTitle = [];
  public lat = null;
  public lon = null;
  public orderNo = window.sessionStorage.getItem('newOrder');
  public storage = window.sessionStorage;
  datas : any = []; 
  offline:boolean = false;
  showAll:boolean = false;
  firstOffline:boolean = true;
  noContent:boolean = false;
  dataTemp1:any[] = new Array();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private network: Network,
    public urlService: urlService,
    public servicesInfo: servicesInfo,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    public tabs: Tabs,
    private app: App,
    private androidPermissions: AndroidPermissions
    ) {
  }

  ionViewDidLoad() {
    this.getInfoDatas();
  }

  ionViewDidEnter() {
    this.checkNetwork();
    this.getPos();
  }

  reload(){
    this.getInfoDatas();
  }

  goBack() {
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

  checkNetwork(){
    let self = this;

    self.network.onDisconnect().subscribe(()=>{
        self.offline=true; 
        if(self.models.length == 0){
          self.firstOffline = true;
          self.noContent = true;
        }
          // self.toast('无网络连接，请检查');
    });
    self.network.onConnect().subscribe(()=>{
        self.offline=false; 
    });

  }

  getInfoDatas(){
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '数据加载中'
    });

    loading.present();
    let self = this;

    let data = {
      //  "token": "1234123548",
       "userId": this.servicesInfo.userId,
       "version": 1,
       "data":{
         "recycleId":this.navParams.data.recycleId,
         "recyclePhone":this.navParams.data.recyclePhone
       },
       "token":this.servicesInfo.token
    };
    
    this.urlService.postDatas(ORDERBORN_URL,data).then(function(resp){
      if(resp){
        loading.dismiss();
        if(resp.errorinfo == null){
            var dataTemp = resp.data.listArry;
            if(dataTemp.length==0){
              self.noContent = true;
            }else{
              self.noContent = false;
              for(var i = 0;i < dataTemp.length;i++){
                dataTemp[i].numSelected = null;
                dataTemp[i].modelSelected = [];
                var dataArray = dataTemp[i].batteryTypeList;
                dataTemp[i].public = self.navParams.data.public;
                for(var j = 0;j < dataArray.length;j++){
                   // dataArray[j].value = 0;
                   // dataArray[j].total = 0;
                   if(j < 2){
                     dataArray[j].check = true;
                     dataArray[j].isShow = true;
                   }else{
                     dataArray[j].check = false;
                     dataArray[j].isShow = false;
                   }
                }
              }

              for(var i = 0;i < dataTemp.length;i++){
                var dataArray1 = dataTemp[i].numConfigList;
                var numObj = {};
                numObj['downLimit'] = 0;
                numObj['upLimit'] = 0;
                numObj['labelName'] = '自定义';
                numObj['unitPre'] = dataTemp[i].numConfigList[0].unitPre;
                dataArray1.push(numObj);
                for(var j = 0;j < dataArray1.length;j++){
                   dataArray1[j].check = false;
                }
              }

              self.datas = dataTemp;
              self.navTitle = [];
              if(self.datas.length>0){
                for(var k = 0;k < self.datas.length;k++){
                  self.navTitle.push(self.datas[k].catName);
                }
              }
              self.slcItem(0);

              setTimeout(function(){
                self.initSlideLine();
              },100);
           }
           
        }else{
          /*token失效的问题*/
          if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
      self.firstOffline = false;
    }).catch(function(err){
        if(self.offline == false && self.datas.length != 0){
           self.firstOffline = false;
        }
        if(self.models.length == 0){
          self.noContent = true;
        }
        
        loading.dismiss();
        self.toast("服务器异常，请重试");
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

  slcItem(idx){
    this.models = this.datas[idx].batteryTypeList;
    this.numsArray = this.datas[idx].numConfigList;
    this.checkShowAll();
  }

  checkShowAll(){
    if(this.models.length >2){
      let count = 0;
      for(var i = 0; i < this.models.length;i++){
        if(this.models[i].isShow == false){
           this.showAll = false;
           count++;
           break;
        };
      }
      if(count == 0){
        this.showAll = true;
      }
    }else{
      this.showAll = true;
    }
  }

  showMore(){
    for(var i = 0; i < this.models.length;i++){
      this.models[i].isShow = true;
    }
    this.showAll = true;
  }

  checkItem(idx){
    this.models[idx].check = !this.models[idx].check;
    this.countAll();
  }

  getSellNum(num,idx){
    for(var i = 0; i < this.numsArray.length;i++){
      if(idx != i){
        this.numsArray[i].check = false;
      }
    }
    this.numsArray[idx].check = !this.numsArray[idx].check;
    this.countAll();
  }

  customFocus(){
    if(this.numsArray[this.numsArray.length - 1].labelName.replace(/[^0-9]/ig,"")){
      this.numsArray[this.numsArray.length - 1].labelName = this.numsArray[this.numsArray.length - 1].labelName.replace(/[^0-9]/ig,"");
    }else{
      this.numsArray[this.numsArray.length - 1].labelName = null;
    }
    this.customFocused = true;
  }

  customBlur(){
    if(this.numsArray[this.numsArray.length - 1].labelName == null || this.numsArray[this.numsArray.length - 1].labelName == '' || this.numsArray[this.numsArray.length - 1].labelName == '自定义' || this.numsArray[this.numsArray.length - 1].labelName == ' '){
       this.numsArray[this.numsArray.length - 1].labelName = '自定义';
    }else{
       let unit = this.numsArray[this.numsArray.length - 1].unitPre;
       this.numsArray[this.numsArray.length - 1].upLimit = this.numsArray[this.numsArray.length - 1].downLimit = this.numsArray[this.numsArray.length - 1].labelName;
       this.numsArray[this.numsArray.length - 1].labelName = this.numsArray[this.numsArray.length - 1].labelName+unit;
    }
    this.customFocused = false;
    this.numsArray[this.numsArray.length - 1].check = true;
    this.countAll();
  }

  initSlideLine(){
     var itemLen = this.navTitle.length;
     var itemWidth = $(".bOrder_subbar").width()/itemLen;
     $(".bOrder_subbar_item").width(itemWidth);
     if(itemLen == 1){
        $("#initSlideLine").hide();
        return;
     }else{
        $("#initSlideLine").show();
     }
     var itemHeight = $(".bOrder_subbar_item").height();
     var lineWidth = $("#initSlideLine").width();
     var initSlideLine = document.getElementById("initSlideLine");
     initSlideLine.style.transform = 'translate3d('+ (itemWidth - lineWidth)/2 +'px, '+ (itemHeight - 5) +'px, '+'0)';
     initSlideLine.style.webkitTransform = 'translate3d('+ (itemWidth - lineWidth)/2 +'px, '+ (itemHeight - 5) +'px, '+'0)';
     $(".bOrder_subbar_item").each(function(inx,val){
       var idx = inx;
       $(this).click(function(){
           initSlideLine.style.transition = 'transform 0.5s ease-out';
           initSlideLine.style.webkitTransition = '-webkit-transform 0.5s ease-out';
           initSlideLine.style.transform = 'translate3d('+ ((itemWidth - lineWidth)/2 + itemWidth*idx) +'px, '+ (itemHeight - 5) +'px, '+'0)';
           initSlideLine.style.webkitTransform = 'translate3d('+ ((itemWidth - lineWidth)/2 + itemWidth*idx) +'px, '+ (itemHeight - 5) +'px, '+'0)';
       });
     });
   }

   limitNum(){
     // console.log(this.numsArray[this.numsArray.length - 1].labelName);
     if(this.numsArray[this.numsArray.length - 1].labelName){
        var input = this.numsArray[this.numsArray.length - 1].labelName.replace(/[^\d]/g,"");
     }
     
     if(input){
       if(input < 1000){
          this.numsArray[this.numsArray.length - 1].labelName = parseInt(input);
       }else if(input <=  0){
          this.numsArray[this.numsArray.length - 1].labelName = "";
       }else{
          this.numsArray[this.numsArray.length - 1].labelName = 999;
       }
     }else{
       this.numsArray[this.numsArray.length - 1].labelName = null;
     }
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

     if(this.models[idx].ratePrice !=="" && this.models[idx].ratePrice !==" " && this.models[idx].ratePrice !==null && this.models[idx].ratePrice > 0 && this.models[idx].ratePrice <= 9999){
        this.models[idx].ratePrice = clearNoNum(this.models[idx].ratePrice);
     }else if(this.models[idx].ratePrice > 9999){
        this.models[idx].ratePrice = 9999;
     }else{
        this.models[idx].ratePrice = 0;
     }

     this.models[idx].check = true;

     this.countAll();

   };
   //递增
   plus(idx){

     // if(this.models[idx].check == false){
     //   return;
     // }
     console.log(this.models[idx].check);
     if(this.models[idx].ratePrice < 9999){
        this.models[idx].ratePrice = Math.round((parseFloat(this.models[idx].ratePrice) + 1)*Math.pow(10, 2))/Math.pow(10, 2);
     }else{
        this.models[idx].ratePrice = 9999;
     }

     this.models[idx].check = true;

     this.countAll();
   };
   //递减
   minus(idx){
     // if(this.models[idx].check == false){
     //   return;
     // }
     if(this.models[idx].ratePrice > 0){
        if(parseFloat(this.models[idx].ratePrice) - 1 > 0){
          this.models[idx].ratePrice = Math.round((parseFloat(this.models[idx].ratePrice) - 1)*Math.pow(10, 2))/Math.pow(10, 2);
        }else{
          this.models[idx].ratePrice = 0;
        }
     }else{
        this.models[idx].ratePrice = 0;
     }

     this.models[idx].check = true;
     
     this.countAll();
   };

   countAll(){

     let dataArray1 = this.datas[0].numConfigList;
     let dataArray2 = this.datas[1]?this.datas[1].numConfigList:null;
     let dataArray3 = this.datas[2]?this.datas[2].numConfigList:null;
     let count1 = 0;
     let count2 = 0;
     let count3 = 0;
   
     for(var i = 0;i < this.datas.length; i++){
       let models = this.datas[i].batteryTypeList;
       this.datas[i].modelSelected = [];
       for(var j = 0;j < models.length; j++){
         if(models[j].check == true){
           this.datas[i].modelSelected.push(models[j]);
         }
       }
     }

     for(var j = 0;j < dataArray1.length;j++){
       if(dataArray1[j].check == true){
         if(dataArray1[j].labelName && this.datas[0].modelSelected.length > 0){
          this.unit1 = dataArray1[j].labelName.replace(/[0-9]/ig,"");
          this.total1 = dataArray1[j].labelName.replace(/[^0-9]/ig,"");
          count1++;
         }
         this.datas[0].numSelected = dataArray1[j];
       };

       if(count1 == 0){
         this.unit1 = null;
         this.total1 = null;
         this.datas[0].numSelected = null;
       }
     }

     if(dataArray2){
       for(var j = 0;j < dataArray2.length;j++){
         if(dataArray2[j].check == true){
           if(dataArray2[j].labelName && this.datas[1].modelSelected.length > 0){
            this.unit2 = dataArray2[j].labelName.replace(/[0-9]/ig,"");
            this.total2 = dataArray2[j].labelName.replace(/[^0-9]/ig,"");
            count2++;
           }
           this.datas[1].numSelected = dataArray2[j];
         };
       }

       if(count2 == 0){
         this.unit2 = null;
         this.total2 = null;
         this.datas[1].numSelected = null;
       }
     }

     if(dataArray3){
       for(var j = 0;j < dataArray3.length;j++){
         if(dataArray3[j].check == true){
           if(dataArray3[j].labelName && this.datas[2].modelSelected.length > 0){
              this.unit3 = dataArray3[j].labelName.replace(/[0-9]/ig,"");
              this.total3 = dataArray3[j].labelName.replace(/[^0-9]/ig,"");
              count3++;
           }
           this.datas[2].numSelected = dataArray3[j];
         };
       }

       if(count3 == 0){
         this.unit3 = null;
         this.total3 = null;
         this.datas[2].numSelected = null;
       }

     }

   }

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
       self.navCtrl.popToRoot();
     }, (err) => {
       self.navCtrl.popToRoot();
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

  openCam(){
      var self = this;
      const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum:true
      } 

      this.camera.getPicture(options).then((imageData) => {
       self.upload(imageData);
      }, (err) => {
       self.toast("报单成功");
       self.navCtrl.popToRoot();
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
                            self.openCam();
                        },
                        err => {
                            // alert(JSON.stringify(err));
                            self.toast("存储权限未打开,上传图片失败");
                        }
                     )
                  }else{
                    self.openCam();
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
                            self.openCam();
                        },
                        err => {
                            // alert(JSON.stringify(err));
                            self.toast("存储权限未打开,上传图片失败");
                        }
                     )
                  }else{
                    self.openCam();
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
 
  orderNext(){
     var self = this;
     let count = 0;
     let count1 = 0;

     if(self.navParams.data.public){
        for(var i = 0;i < this.datas.length; i++){

         this.datas[i].latitudePreOrder = this.lat;
         this.datas[i].longitudePreOrder = this.lon;

         if(this.datas[i].numSelected == null){
           this.datas[i].modelSelected = [];
         }else{

           if(this.datas[i].numSelected.labelName == '自定义'){
             this.toast('请填写自定义出售量');
             return;
           }

           if(this.datas[i].modelSelected.length == 0){
             count1++;
           }
         }

         let models = this.datas[i].modelSelected;
         for(var j = 0;j < models.length; j++){
           if(models[j].ratePrice == 0){
              count++;
           }
         }
       }
     }else{
       for(var i = 0;i < this.datas.length; i++){
         this.datas[i].latitudePreOrder = this.lat;
         this.datas[i].longitudePreOrder = this.lon;
       }
     }

     if(count > 0 || count1 > 0){
         this.toast('请填完整报价');
         return;
     }

     if(this.offline == true){
         this.toast('无网络连接，请检查');
         return;
     }

     if(this.total1 == null && this.total2 == null && this.total3 == null){
        this.toast("请选填完整!");
        return;
     }

     console.log(this.datas);

     let data = {
         "userId": this.servicesInfo.userId,
         "version": 1,
         "data":{
            "releaseRoderList":this.datas,
         },
         "token":this.servicesInfo.token
      };

     let confirm = this.alertCtrl.create({
      title: '温馨提示',
      message: '您的下单量越真实，电池照片越真实，回收商的接单效率越高',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确认',
          handler: () => {

              self.urlService.postDatas(RELEASEORDER_URL,data).then(function(resp){
                  if(resp){
                    if(resp.errorinfo == null){
                        self.orderNo = resp.data.orderNo;
                        self.checkPermission();
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

          }
        }
      ]
    });
    confirm.present();

   }


}
