import { Component } from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { MSG_URL, MSGDETAILS_URL } from "../../../providers/Constants";
import { orderAgreePage } from "./../../tab-page/order-agree-page/order-agree-page";
import { orderDetailPage } from "./../../tab-page/order-detail-page/order-detail-page";
import { orderCommentPage } from "./../../tab-page/order-comment-page/order-comment-page";
import { msgDetails } from "../../wallet/wallet-msgDetails-page/wallet-msgDetails-page";
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { App } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { UserLogin } from "../../../modules/user-login/user-login";
// declare let cordova:any;
declare var BMap;
declare let baidumap_location: any;
@Component({
  selector: 'wallet-message-page',
  templateUrl: 'wallet-message-page.html',
})
export class messagePage {

  msgList: any = [];
  currentPage: any = 0;
  maxPage: any = 1;
  offline: boolean = false;
  firstOffline: boolean = true;
  noContent: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public urlService: urlService,
              public servicesInfo: servicesInfo,
              private app: App,
              private network: Network,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController

    ) {
  }

  ionViewDidEnter() {
    this.currentPage = 0;
    this.msgList = [];
    this.checkNetwork();
    this.getInfoDatas();
  }

  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }

  reload(){
    this.currentPage = 0;
    this.getInfoDatas();
  }

  checkNetwork(){
    let self = this;

    self.network.onDisconnect().subscribe(()=>{
          self.offline=true; 
          if(self.msgList.length == 0){
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
    //    // this.toast('无网络连接，请检查');
    //    return;
    // }

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '数据加载中'
    });

    loading.present();
    ++this.currentPage;
    let data = {
       "data":{
         "pageNumber":this.currentPage,
         "pageSize":10,
         "platform":1,
       },
       "token":this.servicesInfo.token
    };

    let self = this;
    this.urlService.postDatas(MSG_URL,data).then(function(resp){
      if(resp){
        loading.dismiss();
        if(resp.errorinfo == null){
           if(resp.data.msgList.length == 0){
             self.noContent = true;
           }else{
             self.noContent = false;
             self.maxPage = resp.data.totalPage;
             for(var i = 0;i<resp.data.msgList.length;i++){
                self.msgList.push(resp.data.msgList[i]);
             }
           }
        }else{
          if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
      self.firstOffline = false;
    }).catch(function(err){
      if(self.offline==false && self.msgList.length != 0){
         self.firstOffline = false;
      }
      if(self.msgList.length == 0){
         self.noContent = true;
      }
      self.toast("服务器异常，请重试");
      loading.dismiss();
    });

  }

  doInfinite(infiniteScroll){

    if(this.currentPage < this.maxPage){
        ++this.currentPage;
        let data = {
           "data":{
             "pageNumber":this.currentPage,
             "pageSize":10,
             "platform":1,
           },
           "token":this.servicesInfo.token
        };

        let self = this;
        setTimeout(() => {

          this.urlService.postDatas(MSG_URL,data).then(function(resp){
            if(resp){
              if(resp.errorinfo == null){
                 self.maxPage = resp.data.totalPage;
                 for(var i = 0;i<resp.data.msgList.length;i++){
                    self.msgList.push(resp.data.msgList[i]);
                 }
                 infiniteScroll.complete();
              }else{
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

  detail(msg){
      console.log(msg);
      if(msg.msgType == 1){
        this.navCtrl.push(msgDetails,{
          "msgContentId":msg.jpusMsgId
        });
      }else{
        if(msg.orderStatusNo == 2){
          this.navCtrl.push(orderAgreePage,{
            orderNo:msg.orderNo
          });
        }else if(msg.orderStatusNo == 1 || msg.orderStatusNo == 4){
          this.navCtrl.push(orderDetailPage,{
            orderNo:msg.orderNo
          });
        }else if(msg.orderStatusNo == 3){
          this.navCtrl.push(orderCommentPage,{
            orderNo:msg.orderNo
          });
        }
      }

  }

}
