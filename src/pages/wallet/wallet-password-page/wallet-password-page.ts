import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { Network } from '@ionic-native/network';
import { NavController, NavParams,App} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { EDITPW_URL} from "../../../providers/Constants";
import { ToastController } from 'ionic-angular';
import {servicesInfo} from"../../../providers/service-info";//公共信息
import {UserLogin} from "../../../modules/user-login/user-login";

// declare let cordova:any;
declare var BMap;
declare let baidumap_location: any;
@Component({
  selector: 'wallet-password-page',
  templateUrl: 'wallet-password-page.html',
})
export class changePasswordPage {

  public subObj = {
    oldval:null,
    newval:null,
    newval1:null
  };
  offline:boolean=false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http, 
              public urlService: urlService, 
              public toastCtrl: ToastController,
              public servicesInfo: servicesInfo,
              private app: App,
              private network: Network,
    ) {
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

  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 3000,
      position:'bottom'

    });
    toast.present();
  }

  submit(){
    if(this.offline == true){
      this.toast('无网络连接，请检查');
      return;
     }
    var pwdTest = /^(?![\d]+$)(?![a-zA-Z]+$)(?![-!@#$%^&*()_+.{}`=|\/\[\]\\\'?;\':,<>]+$)[\da-zA-Z-!@#$%^&*()_+.{}`=|\/\[\]\\\'?;\':,<>]{6,32}$/;
    if(!pwdTest.test(this.subObj.newval)||!pwdTest.test(this.subObj.newval1)){
          this.toast("密码只能由字母、数字、特殊字符的两种或三种组合成！")
    }else if(this.subObj.newval!=this.subObj.newval1){
          this.toast("两次输入的密码不一致")
    }else{
          console.log(this.subObj);
          let data = {
             "data":{
                "oldPwd":this.subObj.oldval,
                "newPwd":this.subObj.newval,
                "sureNewPwd":this.subObj.newval1,
                "platform":1,
             },
             "token":this.servicesInfo.token
          };
          console.log(data);
          let self = this;
          this.urlService.postDatas(EDITPW_URL,data).then(function(resp){
            if(resp){
              console.log(resp);
              if(resp.errorinfo == null){
                  self.toast("修改成功,请重新登录");
                  localStorage.removeItem("token");
                  self.app.getRootNav().setRoot(UserLogin);
              }else{
                  self.toast(resp.errorinfo.errormessage);
              }
            }
          });
    }
  
  }

}
