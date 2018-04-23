import { Component } from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { AlertController } from 'ionic-angular';
import { SELLINFO_URL, SELLORDERDETAIL1_URL, CANCELORDER_URL, CONFIRMORDER_URL} from "../../../providers/Constants";
import { servicesInfo } from"../../../providers/service-info";
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import {UserLogin} from "../../../modules/user-login/user-login";
// declare let cordova:any;
declare var BMap;
declare  var $; 
declare  var Swiper; 
declare let baidumap_location: any;
@Component({
  selector: 'order-agree-page',
  templateUrl: 'order-agree-page.html',
})
export class orderAgreePage {

  public map = null;
  default:any= {"x":114.06667,"y":22.61667};
  datas: any = [];
  datas1: any = [];
  catLists: any = [];
  statements: any = [];
  offline:boolean=false;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private network: Network,
    public urlService: urlService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public servicesInfo: servicesInfo,
    private app: App
    ) {
  }

  ionViewDidEnter() {
    this.getInfoDatas();
    this.checkNetwork();
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

  getInfoDatas(){
    
    let data = {
       "data":{
         "orderNo":this.navParams.data.orderNo,

       },
       "token":this.servicesInfo.token,
    };
    let self = this;

    this.urlService.postDatas(SELLORDERDETAIL1_URL,data).then(function(resp){
      if(resp){
        if(resp.errorinfo == null){
            self.datas = resp.data;
            self.catLists = resp.data.catLists;
            console.log(self.catLists);
            self.statements = resp.data.statements;
        }
      }
    });
  }

  cancelOrder(){

    if(this.offline == true){
         this.toast('无网络连接，请检查');
         return;
    }
    let confirm = this.alertCtrl.create({
      title: '确认取消订单吗?',
      // message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
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
              let data = {
                 "data":{
                   "orderNo":this.navParams.data.orderNo
                 },
                 "token":this.servicesInfo.token,
              };
              let self = this;
              this.urlService.postDatas(CANCELORDER_URL,data).then(function(resp){
                if(resp){
                  if(resp.errorinfo == null){
                     self.toast("取消订单成功");
                     setTimeout(function(){
                        self.goBack();
                     },2000);
                  }else{
                     self.toast(resp.errorinfo.errormessage);
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

  confirmOrder(){

    if(this.offline == true){
         this.toast('无网络连接，请检查');
         return;
    }

    let confirm = this.alertCtrl.create({
      title: '是否确认订单?',
      // message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
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
              let data = {
                 "data":{
                   "orderNo":this.navParams.data.orderNo
                 },
                 "token":this.servicesInfo.token,
              };
              let self = this;
              this.urlService.postDatas(CONFIRMORDER_URL,data).then(function(resp){
                if(resp){
                  if(resp.errorinfo == null){
                     self.getInfoDatas();
                     self.toast("确认订单成功");
                  }else{
                     self.toast(resp.errorinfo.errormessage);
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
