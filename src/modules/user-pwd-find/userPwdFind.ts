import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserRegister} from "../user-register/user-register "
import { ToastController } from 'ionic-angular';

import {Http,Headers} from '@angular/http';
import { interfaceUrls }from "../../providers/serviceUrls";//接地址
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';    //注册协议

import {UserAgreement} from "../user-agreement/user-agreement"
import{servicesInfo} from"../../providers/service-info";
import { urlService } from "../../providers/urlService";
@Component({
    selector: 'page-userPwdFind',
    templateUrl: 'userPwdFind.html',
})

export class UserPwdFind {
    constructor(public navCtrl: NavController,
                public toastCtrl: ToastController,
                private http: Http,
                public alertCtrl: AlertController,
                public urlService: urlService,
                public servicesInfo: servicesInfo,
                private network: Network,
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

    offline:boolean=false;
    verifyCode: any = {
      verifyCodeTips: "获取验证码",
      countdown: 60,//总共时间
      disable: true
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
    ionViewDidLoad(){
        this.checkNetwork()
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
        this.verifyCode.verifyCodeTips = this.verifyCode.countdown + 　"s";
        setTimeout(() => {
        this.verifyCode.verifyCodeTips = this.verifyCode.countdown + "s";
        this.settime();
        }, 1000);
    }
    next(){
        var pwdTest = /^(?![\d]+$)(?![a-zA-Z]+$)(?![-!@#$%^&*()_+.{}`=|\/\[\]\\\'?;\':,<>]+$)[\da-zA-Z-!@#$%^&*()_+.{}`=|\/\[\]\\\'?;\':,<>]{6,32}$/;
        if(!this.userInfo.phone){
            this.toast("请输入手机号")
        } else if (!(/^1[34578]\d{9}$/.test(this.userInfo.phone))) {
            this.toast("手机号输入有误")
        } else if (this.userInfo.yzm == null || this.userInfo.yzm == "") {
            this.toast("请输入手机验证码")
        } else if (this.userInfo.newPassWord.length < 6 || this.userInfo.newPassWord.length > 32) {
            this.toast("密码长度只能在6-23位之间");
        } else if (!pwdTest.test(this.userInfo.newPassWord) || !pwdTest.test(this.userInfo.rePassWord)) {
            this.toast("密码只能由字母、数字、特殊字符的两种或三种组合成！");
        } else if (this.userInfo.newPassWord != this.userInfo.rePassWord) {
            this.toast("两次输入的密码不一致！")
        } else{
            let params={
                "data":{
                    "mobile":this.userInfo.phone,
                    "newPwd":this.userInfo.newPassWord,
                    "code":this.userInfo.yzm
                }
            }
            if(this.offline == true){
                this.toast('无网络连接，请检查');
                return;
           }
            let self = this;
            this.urlService.postDatas(interfaceUrls.findPwd,params)
            .then(function(resp){
                console.log(resp)
                if(resp){
                    if(resp.errorinfo==null){
                        setTimeout(function(){
                            self.toast("密码修改成功,请重新登录。")
                            localStorage.setItem("token","");
                            self.navCtrl.pop();
                        },2000);
                    }else{
                        self.toast(resp.errorinfo.errormessage)
                    }
                }
            });
        }
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
            let self = this;
            this.urlService.postDatas(interfaceUrls.findPwdCode,params)
            .then(function(resp){
                if(resp.errorinfo==null){
                    self.errorTip = false;
                    self.hasClick = true;
                    /*let timer = setInterval(() => {
                        if (self.num == 0) {
                            clearInterval(timer);
                            self.hasClick = false;
                            self.hq = "重新获取";
                            self.num = 60;
                            return;
                        }
                        self.num--;
                    }, 1000);*/
                    self.verifyCode.disable = false;
                    self.settime();
                }else{
                    self.toast(resp.errorinfo.errormessage)
                }
           });
        }
    }
}
