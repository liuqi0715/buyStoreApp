import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserRegister} from "../user-register/user-register "
import { ToastController } from 'ionic-angular';

import {Http,Headers} from '@angular/http';
import { interfaceUrls }from "../../providers/serviceUrls";//接地址
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';    //注册协议

import {UserAgreement} from "../user-agreement/user-agreement"
import{servicesInfo} from"../../providers/service-info"
@Component({
    selector: 'page-UserRegInfo',
    templateUrl: 'UserRegInfo.html',
})
export class UserRegInfo {
    constructor(public navCtrl: NavController,
                public toastCtrl: ToastController,
                private http: Http,
                public alertCtrl: AlertController,
                private network: Network,
                public servicesInfo: servicesInfo,
                )
        {

        };
    userInfo = {
        phone: '',
        yzm: '',
        newPassWord: '',
        rePassWord: ''
    };
    errorTip = false;        //为true显示错误提示
    errorTipMsg = "";
    hasClick=false;
    hq = "获取验证码";
    num = 60;
    agreeI=false;    //阅读并同意协议
    hasSuccess=false;    //显示模态框
    offline:boolean=false;
    /**
     * 重新对获取验证码进行定义
     */
    verifyCode: any = {
      verifyCodeTips: "获取验证码",
      countdown: 60,//总共时间
      disable: true
    }
    getCode(){

    }
    settime() {
      if (this.verifyCode.countdown == 1) {
        this.verifyCode.countdown = 60;
        this.verifyCode.verifyCodeTips = "获取验证码";
        this.verifyCode.disable = true;
        return;
      } else {
        this.verifyCode.countdown--;
      }
      this.verifyCode.verifyCodeTips =  this.verifyCode.countdown +　"s";
      setTimeout(() => {
        this.verifyCode.verifyCodeTips =  this.verifyCode.countdown + "s" ;
        this.settime();
      }, 1000);
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
    toast(actions){
        let toast = this.toastCtrl.create({
          message: actions,
          duration: 2000,
          position:'middle'

        });
        toast.present();
      }
//注册协议
    showAlert() {
        this.navCtrl.push(UserAgreement)
    }
    agree(){
        if(this.agreeI==true){
            this.errorTipMsg = "";
        }
    }
    ionViewDidLoad(){
          this.checkNetwork()
          var img = new Image()
          img.src = "assets/img/login/logo2.png";
    }
    next(){

        var pwdTest = /^(?![\d]+$)(?![a-zA-Z]+$)(?![-!@#$%^&*()_+.{}`=|\/\[\]\\\'?;\':,<>]+$)[\da-zA-Z-!@#$%^&*()_+.{}`=|\/\[\]\\\'?;\':,<>]{6,32}$/;
        if(!this.userInfo.phone){
            this.toast("请输入手机号")
        } else if (!(/^1[34578]\d{9}$/.test(this.userInfo.phone))) {
            this.toast("手机号输入有误")
        } else if (this.userInfo.yzm == null || this.userInfo.yzm == "") {
            this.toast("请输入手机验证码")
        } else if(this.userInfo.newPassWord.length ==0){
            this.toast("请输入密码");
        }else if(this.userInfo.rePassWord.length==0){
            this.toast("请再次输入密码");
        }else if (this.userInfo.newPassWord.length < 6 || this.userInfo.newPassWord.length > 32) {
            this.toast("密码长度只能在6-23位之间");
        } else if (!pwdTest.test(this.userInfo.newPassWord) || !pwdTest.test(this.userInfo.rePassWord)) {
            this.toast("密码只能由字母、数字、特殊字符的两种或三种组合成！");
        } else if (this.userInfo.newPassWord != this.userInfo.rePassWord) {
            this.toast("两次输入的密码不一致！")
        } else if(this.agreeI==false){
            this.toast("注册必须同意协议！");
        }else{
            this.hasSuccess = true;
            this.servicesInfo.userPhone = this.userInfo.phone;
            if(this.offline == true){
                this.toast('无网络连接，请检查');
                return;
           }
            let params={
                "data":{
                    "mobilePhone":this.userInfo.phone,
                    "pwd":this.userInfo.newPassWord,
                    "code":this.userInfo.yzm
                }
            }
            let self = this;
            this.http.post(interfaceUrls.addStoreRegistered,params)
            .map(res => res.json())
            .subscribe(function (data) {
                if(data.errorinfo==null){
                    self.servicesInfo.userId = data.data.userId;
                    self.navCtrl.push(UserRegister)
                    self.hasSuccess = false;
                    self.servicesInfo.mobilePhone = self.userInfo.phone;
                    self.servicesInfo.pwd = self.userInfo.newPassWord;
                }else{
                    self.hasSuccess = false;
                    self.toast(data.errorinfo.errormessage);
                }
            })
        }
         this.navCtrl.push(UserRegister)        //仅做测试用，正式环境需要注释

    }
    findPasswordCode(){
        if(!this.userInfo.phone) {
            this.toast("请输入手机号");
        }else if (!(/^1[34578]\d{9}$/.test(this.userInfo.phone))) {
            this.toast("请输入正确的手机号")
        }else{
            let params = { "data":{
                "mobile": this.userInfo.phone,
            }};
            if(this.offline == true){
                this.toast('无网络连接，请检查');
                return;
           }
            let self = this;
            this.http.post(interfaceUrls.getCode,params)
            .map(res => res.json())
            .subscribe(function (data) {
                if(data.errorinfo==null){
                    self.errorTip = false;
                    self.hasClick = true;
                    /*let timer = setInterval(() => {
                        if (self.num == 0) {
                            clearInterval(timer);
                            self.hasClick = false;
                            self.hq = "重新获取";
                            self.num = 60;
                            return;
                        }else{
                           self.num--;
                           console.log(self.num)
                           console.log(self.hasClick)
                        }

                    }, 1000);*/
                    self.verifyCode.disable = false;
                    self.settime();
                }else{
                    self.toast(data.errorinfo.errormessage)
                }
            },(err)=>{
              self.toast("服务器异常，请稍后再试")
            }
          )
        }
    }
}
