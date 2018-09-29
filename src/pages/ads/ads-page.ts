import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { addCardPage } from "../wallet/wallet-addCard-page/wallet-addCard-page";
import { changePhonePage } from "../wallet/wallet-phone-page/wallet-phone-page";
import { WalletMoney } from "../wallet/wallet-money-page/wallet-money-page";
import { BalancePage } from "../wallet/wallet-balance-page/wallet-balance-page";
import { rechargePage } from "../wallet/wallet-recharge-page/wallet-recharge-page";

import { interfaceUrls }from "../../providers/serviceUrls";//接地址
import { urlService } from "../../providers/urlService";  //post请求
import { ToastController } from 'ionic-angular';
import { servicesInfo } from"../../providers/service-info"
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
@Component({
  selector: 'ads-page',
  templateUrl: 'ads-page.html'
})
export class adsPage {


  constructor(public navCtrl: NavController,
            public urlService: urlService,
            public toastCtrl: ToastController,
            public servicesInfo: servicesInfo,
            public iab: InAppBrowser
  ) {
    console.log(this.servicesInfo.token,"token")
  }
  getMoreInfo = false;
  listP = false;  //四种交互
  rules = false;  //提现规则
  totalAmount;    //银行卡总金额
  bankName;    //银行卡名称
  bankCardNo;  //银行卡卡号
  bankCardNo2;//前面四位
  hasNoCard=true;  //银行卡有的

    toast(actions){
      let toast = this.toastCtrl.create({
        message: actions,
        duration: 3000,
        position:'bottom'

      });
      toast.present();
    }
    ionViewWillEnter(){
      let params= {
         "data":{
            "platform":1,
         },
         "token":this.servicesInfo.token
       }

      let self = this;
       this.urlService.postDatas(interfaceUrls.getSubAccountAmount,params)
       .then(function(resp){
        //  console.log("1",resp);
        if(resp){
            if(resp.errorinfo==null){
              self.totalAmount = resp.data.totalAmount;
            }else{
              self.toast(resp.errorinfo.errormessage);
            }
        }
      });
//查询银行卡信息
    let param= {
      "data":{
         "platform":1,
      },
      "token":this.servicesInfo.token
    }
    let self2 = this;
    this.urlService.postDatas(interfaceUrls.getSubAccountBankInfo,param).then(function(resp){
     if(resp){
         if(resp.errorinfo==null){
           if(resp.data.bankInfo.length==0){
              this.hasNoCard = false;
           }else{
            for(var i = 0;i<resp.data.bankInfo.length;i++){
              if(resp.data.bankInfo[i].state==2){
                self2.bankCardNo = ((resp.data.bankInfo[i].bankCardNo).substr(-4))
                self2.bankCardNo2 = ((resp.data.bankInfo[i].bankCardNo).substring(0,4))
                self2.bankName = resp.data.bankInfo[i].bankName
                    }
            }
           }

         }else{
           self.toast(resp.errorinfo.errormessage);
         }
     }
    });

  }
    getMore(){
      this.listP = true;
      this.getMoreInfo = true;
     this.rules = false;  //提现规则
    }
    noGet(){
      this.getMoreInfo = false;
    }
    goRecharge(){
      this.navCtrl.push(rechargePage);
    }
    back(){
      this.navCtrl.pop()
    }
    changePwd(){
      this.listP = false;
    }
    changePhone(){
      this.listP = false;
    }

    needHelp(){
      this.listP = false;
    }
    goBalance(){
      this.navCtrl.push(BalancePage)
    }
    getMo(){
      if(this.hasNoCard==true){
        this.getMoreInfo = true;
        this.rules=true;
        this.listP = false;
      }else{
        this.toast("您还没有添加过银行卡");
      }

    }
    listRecord(){
      this.navCtrl.push(WalletMoney)
    }
    addCard(){
      this.navCtrl.push(addCardPage);
    }
    //修改交易密码

    editPassword(){
      let param2 = {
        "data":{
          "platform":1,
        },
        "token":this.servicesInfo.token,
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.changePayPwd,param2).then(function(resp){
       if(resp){
           if(resp.errorinfo==null){
            const browser = self.iab.create(resp.data.resultUrl,"_self","location=no");
            browser.on("exit").subscribe(
              (res) => {
                console.log('event exit with' + res);
               },
               (error) => {
                console.log(error);
               }
               );
           }else{
             self.toast(resp.errorinfo.errormessage);
           }
       }
      });
    }
    //修改绑定手机号
    editPhone(){
      this.navCtrl.push(changePhonePage);

    }

}
