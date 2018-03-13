import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { SELLORDERDETAIL_URL} from "../../../providers/Constants";
import { ToastController } from 'ionic-angular';

import {servicesInfo} from"../../../providers/service-info"
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { BankInfoPage } from "../wallet-bankInfo-page/wallet-bankInfo-page";  //银行卡信息页面
import { App } from 'ionic-angular';

import { Network } from '@ionic-native/network';
import { UserLogin } from "../../../modules/user-login/user-login";
// declare let cordova:any;
declare var BMap;
declare let baidumap_location: any;
@Component({
  selector: 'wallet-addCard-page',
  templateUrl: 'wallet-addCard-page.html',
})
export class addCardPage {

  public subObj = {
    userName:"",
    // phone:"",
    bankNo:null,
    // personNo:null
   
  };
  reqNo;
  bankName="";//银行卡名称
  bankType;  //银行卡信息
  bankCode;    //银行卡code
        
  a:number;
  
  bankCodeInfo;    //请选择银行卡名称，这里接收选择后的银行卡信息
  hasSuccess=false; //默认不显示
  offline:boolean=false;
  bankNo;  //将银行卡重新赋值给一个变量；
  maxBankNo = "";
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
      duration: 1000,
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
  ionViewDidLoad() {
    this.checkNetwork();
  }
  //获取所有的银行卡名称
  ionViewWillEnter(){
    console.log(this.servicesInfo.bankInfo,"===")
      if(this.servicesInfo.bankInfo==""||this.servicesInfo.bankInfo==undefined){
        this.bankCodeInfo = "请选择银行卡名称";
      }else{
        this.bankCodeInfo = this.servicesInfo.bankInfo.bankFullName;
        this.bankName = this.bankCodeInfo;
        this.bankCode = this.servicesInfo.bankInfo.bankCode;
      }

  }
  goBankInfo(){
    this.navCtrl.push(BankInfoPage)
  }

  goBack() {
    this.navCtrl.pop();
  }

  //将银行卡号四位分割一次
  changeNo(){
    // this.subObj.bankNo = ((this.subObj.bankNo)).replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");   

      // if(((this.subObj.bankNo).replace(/[\s]/g, '').length)%4==0 && ((this.subObj.bankNo).replace(/[\s]/g, '').length)>0){
      //   console.log("??")
      //   this.subObj.bankNo = (this.subObj.bankNo).toString() + " ";
      // }else{
      //   this.subObj.bankNo = (this.subObj.bankNo).toString();
      //   console.log("//")
      // }

      // var len=this.subObj.bankNo.length;
      // this.subObj.bankNo = this.subObj.bankNo.replace(/[^\d]/g,"");
      // // var num=parseInt(((this.subObj.bankNo).length)/4);
      // var num=Math.floor(((this.subObj.bankNo).length)/4);
      // var last=(this.subObj.bankNo.length)%4;
      // var n=0;
      // var temp="";
      // for(var i=0;i<num;i++){
      //     temp=temp+" "+this.subObj.bankNo.substring(n,n+4);
      //     n=n+4;
      // }
      // if(last == 0){
      //   return;
      // }else{
      //   temp=temp+" "+this.subObj.bankNo.substring(this.subObj.bankNo.length-last,this.subObj.bankNo.length);
      // }
      // this.subObj.bankNo = temp;

      this.subObj.bankNo = (this.subObj.bankNo).replace(/[^\d]/g,"").replace(/(\d{4})(?=\d)/g, "$1 "); 
      if((this.subObj.bankNo).replace(/[^\d]/g,"").length == 22){
        this.maxBankNo = this.subObj.bankNo;
      }else if((this.subObj.bankNo).replace(/[^\d]/g,"").length > 22){
        this.subObj.bankNo = this.maxBankNo;
      }
      if((this.subObj.bankNo).replace(/[^\d]/g,"").length == 6){
        this.checkBankInfo();
      } 
   
  }
  //将身份证号四位分割一次
 
  //根据输入的银行卡号查询银行卡名称
  checkBankInfo(){
      let reg = /^([1-9]{1})(\d{14}|\d{14,22})$/;
      if((this.subObj.bankNo)!=null){
      this.bankNo = ((this.subObj.bankNo).replace(/[^\d]/g,""));//将银行卡重新赋值给一个变量；

          console.log(reg.test(this.subObj.bankNo))
          console.log(((this.subObj.bankNo).toString()).length)
            let param={
                "data": {
                  "cardNo":(this.subObj.bankNo).replace(/[^\d]/g,"")
                }
            }
            if(this.offline == true){
              this.toast('无网络连接，请检查');
              return;
             }
            this.hasSuccess = true;
            let self = this;
            this.urlService.postDatas(interfaceUrls.checkBankInfo,param).then(function(resp){
              if(resp){
                self.hasSuccess = false;
                if(resp.errorinfo==null){
                    if(resp.data.bankFullName!=""){
                      console.log(resp,"??");
                      // self.bankCodeInfo = resp.data.bankclsname2;
                      self.bankCodeInfo = resp.data.bankFullName;
                      self.servicesInfo.bankInfo = resp.data;
                      self.bankName = self.bankCodeInfo;
                      self.bankCode = resp.data.bankCode;
                    }else{
                      self.bankCodeInfo="请选择银行卡名称"
                    }
                }else{
                  // self.toast(resp.errorinfo.errormessage);
                  console.log(resp.errorinfo.errormessage);
                  
                     if(resp.errorinfo.errorcode=="10003"){
                      self.app.getRootNav().setRoot(UserLogin);
                    }
                }
              }
            })
            .catch(function(error){
              console.log(error)
              // self.toast("服务器异常,请稍后再试。")
              self.hasSuccess = false;
            });
      }
  }
//光标离开时请求；
checkBankInfo2(){
  let reg = /^([1-9]{1})(\d{14}|\d{14,22})$/;
  if((this.subObj.bankNo)!=null){
    this.bankNo = ((this.subObj.bankNo).replace(/[^\d]/g,""));//将银行卡重新赋值给一个变量；

          console.log(reg.test(this.subObj.bankNo))
          console.log(((this.subObj.bankNo).toString()).length)
          if(((this.subObj.bankNo).toString()).length>=6){
            let param={
                "data": {
                  "cardNo":(this.subObj.bankNo).replace(/[^\d]/g,"")
                }
            }
            if(this.offline == true){
              this.toast('无网络连接，请检查');
              return;
             }
            this.hasSuccess = true;
            let self = this;
            this.urlService.postDatas(interfaceUrls.checkBankInfo,param).then(function(resp){
              if(resp){
                self.hasSuccess = false;
                if(resp.errorinfo==null){
                    if(resp.data.bankFullName!=""){
                      console.log(resp,"??");
                      // self.bankCodeInfo = resp.data.bankclsname2;
                      self.bankCodeInfo = resp.data.bankFullName;
                      self.servicesInfo.bankInfo = resp.data;
                      self.bankName = self.bankCodeInfo;
                      self.bankCode = resp.data.bankCode;
                    }else{
                      self.bankCodeInfo="请选择银行卡名称"
                    }
                }else{
                  // self.toast(resp.errorinfo.errormessage);
                  console.log(resp.errorinfo.errormessage);
                  
                     if(resp.errorinfo.errorcode=="10003"){
                      self.app.getRootNav().setRoot(UserLogin);
                    }
                }
              }
            })
            .catch(function(error){
              console.log(error)
              // self.toast("服务器异常,请稍后再试。")
              self.hasSuccess = false;
            })
            ;
        }
    }
}

  getBankName(){
     
      // for(var i=0;i<this.bankType.length;i++){
      //     if(this.bankCode==this.bankType[i].bankCode){
      //           this.bankName = this.bankType[i].bankName;
      //     }
      // }
      // console.log(this.bankCode, this.bankName)
  }
  getName(actions){
    console.log("??")
    console.log(actions,"====")
  }
  submit(){
    let reg2 = /^([1-9]{1})(\d{14}|\d{14,18})$/;              //银行卡卡号
    console.log(this.subObj);
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号码
    if(this.subObj.userName.length==0){
          this.toast("请输入用户名")
    }else  if(reg2.test((this.subObj.bankNo).replace(/\s/g,""))==false){
      console.log((this.subObj.bankNo).replace(/\s/g,""))
        this.toast("银行账号输入有误");
    }else{     /*****/
      this.hasSuccess = true;
      let param2 = {
        "data":{
          "platform":1,        
          "deviceType":"MOBILE",
          "bankCardNo":(this.subObj.bankNo).replace(/[^\d]/g,""),
          "bankCardName":this.subObj.userName,
          // "atBankPhone":this.subObj.phone,
          // "idCard":(this.subObj.personNo).replace(/\s/g,""),
          "bankCode":this.bankCode,
          "bankName":this.bankName
        },
        "token":this.servicesInfo.token,
      }
      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
     }
      let self = this;
      this.urlService.postDatas(interfaceUrls.addCard,param2).then(function(resp){
           if(resp){     /***/
            self.hasSuccess = false;
               if(resp.errorinfo==null){
                console.log(resp,"??")
                self.reqNo = resp.data.reqNo;
                const browser = self.iab.create(resp.data.url,"_self","location=no");
                browser.on("exit").subscribe(
                  (res) => {
                    // Handle url checking and body parsing here
                    console.log('event exit with' + res);
                    self.checkCard();
                   },
                   (error) => {
                    // Handle error here
                    console.log(error);
                   }
                   );
               }else{
                 self.toast(resp.errorinfo.errormessage);
                 if(resp.errorinfo.errorcode=="10003"){
                    self.app.getRootNav().setRoot(UserLogin);
                  }
               }
           }  /***/
      });

 /*****/   }

  }
//查询帮卡是否成功
    checkCard(){
      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
      }
      let param = {
        "data":{
          "platform":1,
          "reqNo":this.reqNo,
        },
        "token":this.servicesInfo.token,         
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.addCard,param).then(function(resp){
            if(resp){
                  if(resp.errorinfo==null){
                      console.log(resp,"==")
                      if(resp.data.susses=="Y"){
                          self.navCtrl.pop();
                      }else{
                        self.toast("操作失败")
                      }

                  }else{
                    self.toast(resp.errorinfo.errormessage);
                  }


            }
      })
    }



}
