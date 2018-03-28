import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { orderConfirmPage } from "../order-confirm-page/order-confirm-page";
import { TabSell } from "../tab-sell-page/tab-sell-page";
import { urlService } from "../../../providers/urlService";
import { ORDERBORN_URL } from "../../../providers/Constants";
import { servicesInfo } from"../../../providers/service-info";
import { ToastController, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import {UserLogin} from "../../../modules/user-login/user-login";
declare  var $; 

@Component({
  selector: 'order-born-page',
  templateUrl: 'order-born-page.html',
})
export class orderBornPage {
  public orderlist = [];//用于存储提交的所有数据信息；
  public models = [];
  public totalPrice = 0;
  public totalWeight = 0;
  public navTitle = [];
  datas : any = []; 
  offline:boolean = false;
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
    private app: App,
    ) {
  }

  ionViewDidLoad() {
    this.getInfoDatas();
  }

  ionViewDidEnter() {
    this.checkNetwork();
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
        if(resp.errorinfo == null){
            loading.dismiss();
            var dataTemp = resp.data.listArry;
            if(dataTemp.length==0){
              self.noContent = true;
            }else{
              self.noContent = false;
              for(var i = 0;i < dataTemp.length;i++){
                var dataArray = dataTemp[i].batteryTypeList;
                dataTemp[i].public = self.navParams.data.public;
                for(var j = 0;j < dataArray.length;j++){
                   dataArray[j].value = 0;
                   dataArray[j].total = 0;
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
           }

           setTimeout(function(){
             self.initSlideLine();
           },100);
           
        }else{
          /*token失效的问题*/
          if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
      self.firstOffline = false;
    }).catch(function(err){
        if(self.offline==false && self.datas.length != 0){
           self.firstOffline = false;
        }
        if(self.models.length == 0){
          self.noContent = true;
        }
        
        loading.dismiss();
        self.toast("服务器异常，请重试");
    });
  }

  public slcItem(idx){
    this.models = this.datas[idx].batteryTypeList;
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

   countAll(){
      this.totalPrice = 0;
      this.totalWeight = 0;
      for(var i = 0;i < this.datas.length;i++){
        var dataArray = this.datas[i].batteryTypeList;
        for(var j = 0;j < dataArray.length;j++){
           this.totalPrice = Math.round((this.totalPrice+parseFloat(dataArray[j].unitPricePre)*parseFloat(dataArray[j].value))*Math.pow(10, 2))/Math.pow(10, 2);
           this.totalWeight = Math.round((this.totalWeight+parseFloat(dataArray[j].commWeight)*parseFloat(dataArray[j].value))*Math.pow(10, 2))/Math.pow(10, 2);
        }
      }
   }

   // 输入数量，获取相应输入值
   limitIn(idx){
     if(this.models[idx].value !=="" && this.models[idx].value !==" " && this.models[idx].value !==null && this.models[idx].value > 0 && this.models[idx].value <= 9999){
        this.models[idx].value = parseInt(this.models[idx].value);
     }else if(this.models[idx].value > 9999){
        this.models[idx].value = 9999;
     }else{
        this.models[idx].value = 0;
     }
     this.countAll();
   };
   //递增
   plus(idx){
     if(this.models[idx].value < 9999){
        this.models[idx].value = parseInt(this.models[idx].value) + 1;
     }else{
        this.models[idx].value = 9999;
     }
     this.countAll();
   };
   //递减
   minus(idx){
     if(this.models[idx].value > 0){
        this.models[idx].value = parseInt(this.models[idx].value) - 1;
     }else{
        this.models[idx].value = 0;
     }
     this.countAll();
   };

   orderNext(){
     if(this.noContent == true){
        this.toast("不能提交空内容!");
        return;
     }

     if(this.totalWeight == 0){
        this.toast("请填写数量!");
        return;
     }

     this.dataTemp1 = this.datas;
     this.navCtrl.push(orderConfirmPage, {
       orderData: JSON.stringify(this.dataTemp1)
     });
   }


}
