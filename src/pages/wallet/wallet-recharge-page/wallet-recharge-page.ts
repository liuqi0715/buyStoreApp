import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Http,Headers } from '@angular/http';
import { urlService } from "../../../providers/urlService";
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { servicesInfo } from"../../../providers/service-info"

import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
@Component({
  selector: 'wallet-recharge-page',
  templateUrl: 'wallet-recharge-page.html'
})
export class rechargePage {
  constructor(public navCtrl: NavController,
            public toastCtrl: ToastController,
            private http: Http,
            public servicesInfo: servicesInfo,
            public urlService: urlService,
            private app: App,
  ) {

  }
  balance:any;//全部体现的余额

  virlAcct={
    // "BankName":""
  };  //虚拟卡信息
  acct={
    // "BankName":""
  };      //真实卡信息
  bankCardNo;
  bankCardNo2;  //真实卡号

  bankCardNo3;
  bankCardNo4;  //虚拟卡号
  hasSuccess = false;  //显示模态框
  bankLogoPath;    //银行logo
  bankCardNum;  //充值账号
  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }
  goBack(){
    this.navCtrl.pop()
  }
  //进入页面查询虚拟真实卡号信息

  ionViewWillEnter(){
    console.log("11")
    this.hasSuccess = true;
     let param2 = {
        data:{
            "platform":1
        },
        "token":this.servicesInfo.token
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.getBindInformation,param2).then(function(resp){
       if(resp){
           if(resp.errorinfo==null){
            console.log(resp.data,"??")
            if(resp.data){
                  
                  //真实银行卡信息
                  self.hasSuccess = false;
                  self.acct = resp.data.acct;
                  if(resp.data.acct.AcctNo!=null){
                    self.bankCardNo = ((resp.data.acct.AcctNo).substr(-4));
                    self.bankCardNo2 = ((resp.data.acct.AcctNo).substring(0,4));
                  }
                 
                  self.bankLogoPath = resp.data.acct.bankLogoPath;
                  //虚拟卡信息

                self.virlAcct = resp.data.virlAcct;
                if(resp.data.virlAcct.VirlAcctNo!=null){
                  self.bankCardNo3 = ((resp.data.virlAcct.VirlAcctNo).substr(-4));
                  self.bankCardNo4 = ((resp.data.virlAcct.VirlAcctNo).substring(0,4));
                  self.bankCardNum = (resp.data.virlAcct.VirlAcctNo).replace(/(\d{4})(?=\d)/g, "$1  ");
                }
              
            }

           }else{
             self.toast(resp.errorinfo.errormessage);
             self.hasSuccess = false;
             if(resp.errorinfo.errorcode=="10003"){
              self.app.getRootNav().setRoot(UserLogin);
            }
           }
       }
      }).catch(function(){
        self.toast("服务器异常，请稍后再试。")
      })
      ;
  }

}
