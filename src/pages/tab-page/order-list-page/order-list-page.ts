import { Component } from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { ORDERLIST_URL} from "../../../providers/Constants";
import { orderAgreePage } from "../order-agree-page/order-agree-page";
import { orderDetailPage } from "../order-detail-page/order-detail-page";
import { ToastController, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
@Component({
  selector: 'order-list-page',
  templateUrl: 'order-list-page.html',
})
export class orderListPage {

  currentPage: any = 0;
  maxPage: any = 1;
  orderList: any = [];
  offline: boolean = true;
  firstOffline:boolean = true;
  noContent: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public urlService: urlService,
    public servicesInfo: servicesInfo,
    private network: Network,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private app: App
    ) {
  }

  ionViewDidEnter(){
    this.currentPage = 0;
    this.orderList = [];
    this.checkNetwork();
    this.getInfoDatas();
  }

  reload(){
    this.currentPage = 0;
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
          if(self.orderList.length == 0){
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
    
    // if(this.offline == true){
    //      // this.toast('无网络连接，请检查');
    //      return;
    // }

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '数据加载中'
    });

    loading.present();

    ++this.currentPage;
    let data = {
       "data":{
          "pageNo": this.currentPage,
          "pageSize": 10,

       },
       "token":this.servicesInfo.token,
    };
    let self = this;
    this.urlService.postDatas(ORDERLIST_URL,data).then(function(resp){
      loading.dismiss();
      if(resp){
        if(resp.errorinfo == null){
            if(resp.data.orderList.length == 0){
              self.noContent = true;
            }else{
              self.noContent = false;
              for(var i = 0;i<resp.data.orderList.length;i++){
                 self.orderList.push(resp.data.orderList[i]);
                 self.maxPage = resp.data.totalPage;
              }
            }
        }else{
          self.toast(resp.errorinfo);
             /*token失效的问题*/
             if(resp.errorinfo.errorcode=="10003"){
              self.app.getRootNav().setRoot(UserLogin);
            }
        }
      }
      self.firstOffline = false;
    }).catch(function(err){
      if(self.offline==false && self.orderList.length != 0){
         self.firstOffline = false;
      }
      if(self.orderList.length == 0){
         self.noContent = true;
      }
      console.log(err);
      self.toast("服务器异常，请重试");
      loading.dismiss();
    });

  }

  doInfinite(infiniteScroll){

    if(this.currentPage < this.maxPage){
        ++this.currentPage;
        let data = {
           "data":{
              "pageNo": this.currentPage,
              "pageSize": 10,

           },
           "token":this.servicesInfo.token,
        };
        let self = this;
        setTimeout(() => {
          self.urlService.postDatas(ORDERLIST_URL,data).then(function(resp){
            if(resp){
              if(resp.errorinfo == null){
                  for(var i = 0;i<resp.data.orderList.length;i++){
                     self.orderList.push(resp.data.orderList[i]);
                  }
                  infiniteScroll.complete();
              }else{
                self.toast(resp.errorinfo);
                 /*token失效的问题*/
                   if(resp.errorinfo.errorcode=="10003"){
                    self.app.getRootNav().setRoot(UserLogin);
                  }
              }
            }
          }).catch(function(err){
            self.toast('服务器异常，请重试');
          });
        }, 500);

    }else{
        infiniteScroll.enable(false);
    }
  }

  goDetail(list){
    if(list.orderStatus == "7" || list.orderStatus == "8" || list.orderStatus == "9"){
      this.navCtrl.push(orderDetailPage, {
        "orderNo":list.orderNo
        // "orderNo":"O20180201000005"
      });
    }else{
      this.navCtrl.push(orderAgreePage, {
        "orderNo":list.orderNo
        // "orderNo":"O20180201000005"
      });
    }
  }

}
