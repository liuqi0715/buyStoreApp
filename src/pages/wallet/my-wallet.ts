import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { addCardPage } from "../wallet/wallet-addCard-page/wallet-addCard-page";
import { changePhonePage } from "../wallet/wallet-phone-page/wallet-phone-page";
// import { changePasswordPage } from "../wallet/wallet-password-page/wallet-password-page";
import { WalletMoney } from "../wallet/wallet-money-page/wallet-money-page";
import { BalancePage } from "../wallet/wallet-balance-page/wallet-balance-page";
import { rechargePage } from "../wallet/wallet-recharge-page/wallet-recharge-page";

import { interfaceUrls }from "../../providers/serviceUrls";//接地址
import { urlService } from "../../providers/urlService";  //post请求
import { ToastController } from 'ionic-angular';
import{servicesInfo} from"../../providers/service-info"
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { App } from 'ionic-angular';
import { UserLogin } from "../../modules/user-login/user-login";
@Component({
  selector: 'page-wallet',
  templateUrl: 'my-wallet.html'
})
export class WalletPage {
 
  
  constructor(public navCtrl: NavController,
            public urlService: urlService,
            public toastCtrl: ToastController,
            public servicesInfo: servicesInfo,
            public iab: InAppBrowser,
            private app: App,
            private network: Network,
  ) {
    console.log(this.servicesInfo.token,"token")
  }
  getMoreInfo = false;
  listP = false;  //四种交互
  rules = false;  //提现规则
  totalAmount=0.00;    //银行卡总金额
  bankName;    //银行卡名称
  bankCardNo:any;  //银行卡卡号
  bankCardNo2;//前面四位
  hasNoCard=true;  //银行卡有的
  hasSuccess = false;  //显示模态框
  bankLogoPath;//银行logo图片
  offline:boolean=false;
    toast(actions){
      let toast = this.toastCtrl.create({
        message: actions,
        duration: 3000,
        position:'middle'
  
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
    ionViewDidLoad(){
      this.checkNetwork()        
    }
    ionViewWillEnter(){
      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
       }
      this.hasSuccess = true;
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
            self.hasSuccess = false;
            if(resp.errorinfo==null){
              self.totalAmount = resp.data.totalAmount;
            }else {
              self.toast(resp.errorinfo.errormessage);
              //如果token失效，重新登录
              if(resp.errorinfo.errorcode=="10003"){
                self.app.getRootNav().setRoot(UserLogin);
              }
            }
        }
      })
      .catch(
        function(){
          self.hasSuccess = false;
          // self.toast("服务器异常请稍后重试。")
        }
        )
      ;
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
            self2.hasNoCard = false;
           }else{
            for(var i = 0;i<resp.data.bankInfo.length;i++){
                if(resp.data.bankInfo[i].state==2){
                  self2.bankLogoPath = resp.data.bankInfo[i].bankLogoPath;
                  self2.bankCardNo = ((resp.data.bankInfo[i].bankCardNo).substr(-4));
                  self2.bankCardNo2 = ((resp.data.bankInfo[i].bankCardNo).substring(0,4));
                  self2.bankName = resp.data.bankInfo[i].bankName;
                }        
            }
           }
              
         }else{
           self.toast(resp.errorinfo.errormessage);
         }
     }
    })
    .catch(
      function(){
        self.hasSuccess = false;
        // self.toast("服务器异常请稍后重试。")
      }
      )
    ;


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
    // changeCard(){
    //   this.listP = false;
    // }
    needHelp(){
      this.listP = false;
    }
    goBalance(){
            
    }
    getMo(){
      if(this.hasNoCard==true){
        // this.getMoreInfo = true;
        this.rules=true;
        this.listP = false;
        this.navCtrl.push(BalancePage).then(() => {
          const index = this.navCtrl.getActive().index;
          console.log(index);
          // this.navCtrl.remove(1, 2);
          });
      }else{
        this.toast("您还没有添加过银行卡");
      }
     
    }
    listRecord(){
      this.navCtrl.push(WalletMoney).then(() => {
        const index = this.navCtrl.getActive().index;
          console.log(index);
        // this.navCtrl.remove(1, 2);
      });
    }
    addCard(){
      this.navCtrl.push(addCardPage);
    }
    //修改交易密码

    editPassword(){
      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
   }
      // this.navCtrl.push(changePasswordPage);
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
            console.log(resp,"??")
            const browser = self.iab.create(resp.data.resultUrl,"_self","location=no");
            browser.on("exit").subscribe(
              (res) => {
                // Handle url checking and body parsing here
                console.log('event exit with' + res);

               },
               (error) => {
                // Handle error here
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
    editBankNo(){

    }
}
