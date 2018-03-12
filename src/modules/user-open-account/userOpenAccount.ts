import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserRegister} from "../user-register/user-register "
import { ToastController } from 'ionic-angular';

import {Http,Headers} from '@angular/http';
import { interfaceUrls }from "../../providers/serviceUrls";//接地址

import { AlertController } from 'ionic-angular';    //注册协议
import { Network } from '@ionic-native/network';
import {UserAgreement} from "../user-agreement/user-agreement"
import{servicesInfo} from"../../providers/service-info";
import { urlService } from "../../providers/urlService";
import {TabMine} from "../../pages/tab-page/tab-mine-page/tab-mine-page";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { addCardPage } from "../../pages/wallet/wallet-addCard-page/wallet-addCard-page";
@Component({
    selector: 'page-UserOpenAccount',
    templateUrl: 'userOpenAccount.html',
})
export class UserOpenAccount {
    constructor(public navCtrl: NavController,
                public toastCtrl: ToastController,
                private http: Http,
                public alertCtrl: AlertController,
                public urlService: urlService,
                public servicesInfo: servicesInfo,
                public iab: InAppBrowser,
                private network: Network,
                )
        {
           
        };
    campanyName;    //企业名称
    linsceNum;    //营业执照号码
    personNum;    //身份证号码
    personName;    //姓名
    personPhone;    //手机号
    hasSuccess=false;  //模态框的显示
    hasLinsceNum=false;    //输入框置为无效
    hasNotLinsceNum=true;    //输入框显示
    offline:boolean=false;
    toast(actions){
    let toast = this.toastCtrl.create({
        message: actions,
        duration: 3000,
        position:'bottom'

    });
    toast.present();
    }

    //将注册成功返回的识别信息（营业执照号码返回并赋值）
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
    ionViewWillEnter(){
        
        if(this.servicesInfo.creditCode!=null && this.servicesInfo.creditCode!=""){
            this.linsceNum = this.servicesInfo.creditCode;
            this.hasLinsceNum = true;
            this.hasNotLinsceNum = false;
        }else{
            // this.linsceNum = this.servicesInfo.creditCode;
            this.hasLinsceNum = false;
            this.hasNotLinsceNum = true;
        }
        this.campanyName = this.servicesInfo.firmName;//公司名称
        this.personName = this.servicesInfo.operName;//公司名称
        console.log(this.personName,this.campanyName);
    }
    ionViewDidLoad(){
        this.checkNetwork()        
    }
    next(){
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号码
        let regName = new RegExp(/^([\u4e00-\u9fa5]){2,7}$/) ;//姓名
        
        if(this.campanyName==""){
            this.toast("请输入企业名称。")
        }else if(this.linsceNum.length<10){
            this.toast("营业执照输入有误。")
            console.log(this.linsceNum)
        }else if(reg.test(this.personNum)==false){
            this.toast("您的身份证号输入有误。")
        }else if(regName.test(this.personName)==false){
                this.toast("姓名仅支持2-7为的汉字。")
        }else if(!(/^1[34578]\d{9}$/.test(this.personPhone))){
            this.toast("手机号输入有误。")
        }else{
            if(this.offline == true){
                this.toast('无网络连接，请检查');
                return;
           }

            if(this.servicesInfo.token){
                let params = {
                    "data":{
                        "deviceType":"MOBILE",
                        // "orgID":this.servicesInfo.orgId,
                        "comName":this.campanyName,
                        "property":"4",
                        "phone":this.personPhone,        //手机号
                        "name":this.personName,        //姓名
                        "userName":this.personName,    //用户名
                        "certifiType":1,            //证件类型
                        "certifiNo":this.personNum,               //证件号码  
                        "orgCode":this.linsceNum,        //组织机构代码  
                        "bsAbleCode":this.linsceNum,        //营业许可证号
                        "taxCode":this.linsceNum,            //税务登记证号
                        "bsAbleImg":"",                    //营业许可证地址
                        "platform":1,
                    },
                    "token":this.servicesInfo.token
                }
                this.hasSuccess=true;  //模态框的显示
                let self = this;
                this.urlService.postDatas(interfaceUrls.addUser,params)
                .then(function(resp){
                 //  console.log("1",resp);
                 if(resp){
                     if(resp.errorinfo==null){
                        self.hasSuccess=false;  //模态框的显示
                             //resp.data.url
                             const browser = self.iab.create(resp.data.url,"_self","location=no");
                             
                            browser.on("exit").subscribe(
                                (res) => {
                                // Handle url checking and body parsing here
                                console.log('event exit with' + res);
                                // self.navCtrl.push(TabMine);
                                self.checkOpen();
                                },
                                (error) => {
                                // Handle error here
                                console.log(error);
                                }
                                );
                        
                     }else{
                        self.hasSuccess=false;  //模态框的显示
                       self.toast(resp.errorinfo.errormessage);
                     }
                 }
               });
            }else{
                let params = {
                    "data":{
                        "deviceType":"MOBILE",
                        "orgID":this.servicesInfo.orgId,
                        "comName":this.campanyName,
                        "property":"4",
                        "phone":this.personPhone,
                        "name":this.personName,
                        "certifiType":1,            //证件类型
                        "certifiNo":this.personNum,               //证件号码  身份证号  
                        "bsAbleCode":this.linsceNum,                    //营业执照注册号码
                        "platform":1,
    
                    },
                
                }
                this.hasSuccess=true;  //模态框的显示

                
                let self = this;
                this.urlService.postDatas(interfaceUrls.addUserByNoLogin,params)
                .then(function(resp){
                 //  console.log("1",resp);
                 if(resp){
                     if(resp.errorinfo==null){
                        //   self.navCtrl.push(TabMine);
                        const browser = self.iab.create(resp.data.url,"_self","location=no");
                        self.hasSuccess=false;  //模态框的显示
                       browser.on("exit").subscribe(
                           (res) => {
                           // Handle url checking and body parsing here
                           console.log('event exit with' + res);
                        //    self.navCtrl.push(TabMine);
                              self.checkOpen();
                           },
                           (error) => {
                           // Handle error here
                           console.log(error);
                           }
                           );
                     }else{
                        self.hasSuccess=false;  //模态框的显示
                       self.toast(resp.errorinfo.errormessage);
                     }
                 }
               });
            }
         

        
        }

    }

    linsceGo(){
      
            console.log("临时营业执照");

    }
    //查询开户是否成功
    checkOpen(){
        let params;
        if(this.servicesInfo.token==undefined||this.servicesInfo.token==""){
             params= {
                "data":{
                   "platform":1,  
                   "userPhone":this.servicesInfo.userPhone   
                },  
            } 
        }else{
             params= {
                "data":{
                   "platform":1,     
                },
                "token":this.servicesInfo.token
              }
        }
        
        let self = this;
        this.urlService.postDatas(interfaceUrls.openAccountQuery2,params)
        .then(function(resp){
            console.log("1",resp);
            if(resp){
               if(resp.errorinfo==null){
                   if(resp.data.susses=="Y"){
                      if(resp.data.isBindCard==1){
                        // self.navCtrl.push(WalletPage)
                        // self.toast("开户成功，已绑定银行卡");
                        console.log("开户成功，已绑定银行卡");
                       }else if(resp.data.isBindCard==0){
                        self.toast("开户成功，暂未绑定银行卡");
                        self.navCtrl.push(addCardPage)
                       }
                   }else if(resp.data.susses=="N"){
                      self.toast("开户失败");
                   }
                    
               }else{
                 self.toast(resp.errorinfo.errormessage);
               }
           }
         });
    }

}
