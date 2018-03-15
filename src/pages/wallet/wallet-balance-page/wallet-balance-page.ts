import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Http,Headers } from '@angular/http';
import { DatePipe } from '@angular/common';    //日期
import { urlService } from "../../../providers/urlService";
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { servicesInfo } from"../../../providers/service-info"
import{ WalletPage } from "../my-wallet";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
declare var cordova:any;
@Component({
  selector: 'wallet-balance-page',
  templateUrl: 'wallet-balance-page.html'
})
export class BalancePage {
 
  
  constructor(public navCtrl: NavController,
            public toastCtrl: ToastController,
            private http: Http,
            public servicesInfo: servicesInfo,
            public urlService: urlService,
            private datePipe: DatePipe,
            public iab: InAppBrowser,
            private app: App,
            private network: Network,
  ) {
    console.log(this.nowDate)
    console.log(this.iab,"-----")
  }
  balance:any="";//全部体现的余额
  balance2;
  reqNo;  //银行请求号
  date = new Date();
 
  nowDate = this.datePipe.transform(this.date,'yyyy-MM-dd');
  bankCardNo; //银行卡账号
  cashAmount;//可提现金额
  bankName;  //银行名称
  bankLogoPath;  //银行logo
  hasSuccess = false;
  offline:boolean=false;
  acctInfo={
    "DBTXZD":"0",
    "DBTXZG":"0",
    "DRTXZG":"0",
  };  //提现金额的限制
  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 3000,
      position:'bottom'

    });
    toast.present();
  }
  goBack(){
    this.navCtrl.pop()
  }
  checkNetwork(){
    let self = this;

    self.network.onDisconnect().subscribe(()=>{
          self.offline=true; 
          self.toast('无网络连接，请检查。');
    });
    self.network.onConnect().subscribe(()=>{
          self.offline=false; 
    });

  }
  
  allIn(){
    this.balance = this.balance2;
  }
  affirmGet(){
    
      let pattern = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
      if(pattern.test(this.balance)==false){
        this.toast("金额输入有误。");
        this.balance = "";
      }else if(this.acctInfo.DBTXZD>this.balance||this.balance>this.acctInfo.DBTXZG){
        this.toast("提现金额范围有误。");
        this.balance = "";
      }else{
        this.hasSuccess = true;
        let params={
          "data":{
            "withdrawType":1,
            "amount":this.balance,
            "platform":1,      
          },
          "token":this.servicesInfo.token
        }
        if(this.offline == true){
          this.toast('无网络连接，请检查。');
          return;
     }
        let self = this;

        this.urlService.postDatas(interfaceUrls.addwithdrawReq,params).then(function(resp){
          if(resp){
              if(resp.errorinfo==null){
                self.hasSuccess = false;
                  // window.location.href = resp.data.resultUrl;
                  // window.open(resp.data.resultUrl,"_self")
                  let options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'no'
                  };

                  // console.log(this.window,window)
                    const browser = self.iab.create(resp.data.resultUrl,"_self","location=no");
                  
                     browser.on("exit").subscribe(
                      (res) => {
                        // Handle url checking and body parsing here
                        console.log('event exit with' + res);
                        self.exitMoney();
                       },
                       (error) => {
                        // Handle error here
                        console.log(error);
                       }
                       );
                  self.reqNo = resp.data.weReqNo;

              }else{
                  self.toast(resp.errorinfo.errormessage);
                  self.hasSuccess = false;
                  if(resp.errorinfo.errorcode=="10003"){
                    self.app.getRootNav().setRoot(UserLogin);
                  }
              }
          }
        })
        .catch(function(){
          self.hasSuccess = false;
          self.toast("服务器异常请稍后重试。")
        });
        
     
      }

  }


  exitMoney(){
    if(this.reqNo == undefined){
      // self.toast("操作失败");
     }else{
       this.hasSuccess = true;
        let self = this;
        let params={
           "data":{
             "reqNo":this.reqNo,
             "transID":"02",
             "platform":1,
             "orgStartDate":this.nowDate,
             "orgEndDate":this.nowDate
           },
           "token":this.servicesInfo.token,
         }
          this.urlService.postDatas(interfaceUrls.searchTradeByReqNo,params).then(function(resp){
            if(resp){
                if(resp.errorinfo==null){
                    self.hasSuccess = false;        
                    self.toast(resp.data.OrgRespMsg);
                    self.navCtrl.pop();    //返回钱包页面

                }else{
                    self.toast(resp.errorinfo.errormessage);
                    self.hasSuccess = false;
                }
            }
          });
     }
  }



  //监听浏览器关闭事件

 
ionViewDidLoad(){

//查询可用金额
let param2 = {
  "data":{
    "platform":1,

  },
  "token":this.servicesInfo.token
}
let self = this;

this.urlService.postDatas(interfaceUrls.getSubAccountAmount,param2).then(function(resp){
 if(resp){
     if(resp.errorinfo==null){
      //  console.log((resp.data.bankInfo[0].bankCardNo));
       self.balance2 =  resp.data.cashAmount;
       self.cashAmount = resp.data.cashAmount;
     }else{
       self2.toast(resp.errorinfo.errormessage);
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
              for(var i = 0;i<resp.data.bankInfo.length;i++){
                    if(resp.data.bankInfo[i].state==2){
                      self2.bankCardNo = ((resp.data.bankInfo[i].bankCardNo).substr(-4));
                      self2.bankName = resp.data.bankInfo[i].bankName;
                      self2.bankLogoPath = resp.data.bankInfo[i].bankLogoPath;
                    }        
              }
         }else{
           self2.toast(resp.errorinfo.errormessage);
         }
     }
   });
   this.checkNetwork();  
   this.getAccCheck();
  }
  
 //监听提现金额不能大于5000
  a = 0;
 changeMon(){
    this.balance = (this.balance).replace(/[^\d^\.]+/g,'');
    let regMoney = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    console.log(this.balance)
    
    if(this.balance.length>1){
      if(regMoney.test(this.balance)==false){
        this.a = this.a+1
        if(this.a>1){
          this.balance = ""
          this.toast("金额输入有误。");
          this.a = 0;
        }
       
      }else{
        // if(this.acctInfo.DBTXZD>this.balance||this.balance>this.acctInfo.DBTXZG){
        //   this.toast("单笔提现金额有误。")
        // }else{
        //   this.balance = this.balance;
        // }
        this.balance = this.balance;
      }
    
    }
 }

 //获取提现限额类数据
 getAccCheck(){
    
  let param= {
    "data":{
        "platform":1,
    },
    "token":this.servicesInfo.token
  }
  let self2 = this;
  this.urlService.postDatas(interfaceUrls.queryAccCheck,param).then(function(resp){
   if(resp){
       if(resp.errorinfo==null){
          console.log(resp)
          self2.acctInfo = resp.data.data;
          console.log(self2.acctInfo)
       }else{
         self2.toast(resp.errorinfo.errormessage);
       }
   }
 });

 }

//  testPik(){
//   this.navCtrl.popToRoot(); 
//  }

}
