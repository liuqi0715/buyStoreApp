import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { SELLORDERDETAIL_URL} from "../../../providers/Constants";
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import{servicesInfo} from"../../../providers/service-info"
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
// declare let cordova:any;
declare var BMap;
declare let baidumap_location: any;
@Component({
  selector: 'wallet-phone-page',
  templateUrl: 'wallet-phone-page.html',
})
export class changePhonePage {

  public subObj = {
    oldphone:"",
    newphone:""
  };
  offline:boolean=false;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      public http: Http, 
      public urlService: urlService, 
      public toastCtrl: ToastController,
      public servicesInfo: servicesInfo,
      public iab: InAppBrowser,
      private app: App,   
      
      private network: Network,   
    ) {
  }
  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 3000,
      position:'bottom'

    });
    toast.present();
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
  ionViewDidLoad() {
    this.checkNetwork() 
  }

  goBack() {
    this.navCtrl.pop();
  }

  submit(){
  if(this.subObj.newphone.length==0){
      this.toast("请输入新手机号")
    }else if(!(/^1[34578]\d{9}$/.test(this.subObj.newphone))){
      this.toast("请输入正确的新手机号");
    }else{
      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
      }
      let param2 = {
        "data":{
          "platform":1,
          "mobile":this.subObj.newphone
        },
        "token":this.servicesInfo.token,
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.changePayPhone,param2).then(function(resp){
       if(resp){
           if(resp.errorinfo==null){
            console.log(resp,"??")
            const browser = self.iab.create(resp.data.resultUrl,"_self","location=no");
            browser.on("exit").subscribe(
              (res) => {
                // Handle url checking and body parsing here
                console.log('event exit with' + res);
                self.navCtrl.pop()
               },
               (error) => {
                // Handle error here
                console.log(error);
               }
               );
           }else{
             self.toast(resp.errorinfo.errormessage);
             if(resp.errorinfo.errorcode=="1003"){
              self.app.getRootNav().setRoot(UserLogin);
            }
           }
       }
      });
    }
  }

}
