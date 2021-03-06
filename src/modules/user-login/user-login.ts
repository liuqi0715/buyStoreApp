import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserRegister} from '../user-register/user-register ';
import {UserRegInfo} from "../user-Reg-Info/userRegInfo";
import { ActionSheetController } from 'ionic-angular';//底部提示信息
import { ToastController } from 'ionic-angular';
import { interfaceUrls }from "../../providers/serviceUrls"
import { Network } from '@ionic-native/network';
import {Http,Headers} from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { App } from 'ionic-angular';
import {servicesInfo} from "../../providers/service-info";//将公共数据放在服务中

import {TabPage} from "../../pages/tab-page/tab-page";
import { UserPwdFind }from "../user-pwd-find/userPwdFind"
import { UPDATEREGID_URL, PAGEJUMP_URL } from "../../providers/Constants";
import { urlService } from "../../providers/urlService";  //post请求

export interface UserInfo {
    userName: string;
    pwd: string;
}
declare var $: any;//引入jq
declare var window;
@Component({
    selector: 'user-login',
    templateUrl: 'user-login.html',
})
export class UserLogin {
    loginError = false;
    errMsg = '';

    userInfo: UserInfo = {
        userName: '',
        pwd: ''
    };
    data=[{"a":1},{"a":2},{"b":3}];

    params={

    };
    offline:boolean=false;
    remberPwd = false;//记住密码
    public
    constructor(public navCtrl: NavController,
                private nativeStorage: NativeStorage,
                public actionSheetCtrl: ActionSheetController,
                public toastCtrl: ToastController,
                private network: Network,
                private http: Http,
                public servicesInfo: servicesInfo,
                private app: App,
                public urlService: urlService,
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


    findPwd() {
        this.navCtrl.push(UserPwdFind);
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
        this.checkNetwork();
        if (this.servicesInfo.hasRegister==true){
           this.userInfo.userName = this.servicesInfo.mobilePhone;
           this.userInfo.pwd = this.servicesInfo.pwd;
        }else{
        }
    }
    changepic(){
      var a = $("#file")[0].files[0].size;
      var b = $("#file");
      var img = new Image();
      img.src = "assets/img/login/logo2.png"
      var reads = new FileReader();
      reads.readAsDataURL($("#file")[0].files[0]);
      reads.onload = function (e) {
      }

    }
    ionViewDidEnter(){
      /*this.userInfo.userName = localStorage.getItem("user");
      this.userInfo.pwd = localStorage.getItem("pwd");*/
    }
    login() {
        // this.navCtrl.setRoot(TabPage);    //仅做测试用，正式版本需要注释
        if(this.offline == true){
            this.toast('无网络连接，请检查');
            return;
       }
        let self = this;
        if (this.userInfo.userName == '' || this.userInfo.pwd == '') {
            this.toast("用户名、密码不能为空！")
        } else {
            let params = { "data":{
                "mobile": this.userInfo.userName,
                "password": this.userInfo.pwd
            }};
             this.http.post(interfaceUrls.login, params)
             .map(res => res.json())
             .subscribe(function (data) {
               let dataInfo =  JSON.stringify(data);
               if(data){
                    if(data.errorinfo==null){
                        self.servicesInfo.token = data.data.token;
                        localStorage.setItem("token",data.data.token);
                        localStorage.setItem("user", self.userInfo.userName);
                        localStorage.setItem("pwd", self.userInfo.pwd);
                        self.servicesInfo.userId = data.data.userId;
                        localStorage.setItem("VERSION",data.version);
                        localStorage.setItem("userId", data.data.userId);
                        self.toast("登录成功");
                        self.app.getRootNav().setRoot(TabPage);
                        self.nativeStorage.setItem('token', { "token": data.data.token, "userId": data.data.userId })
                          .then(
                          (data) => { console.log('Stored item!', data)},
                          error => console.error('Error storing item', error)
                          );
                        /**
                         * 获取极光ID
                         */
                        if (window.plugins && window.plugins.jPushPlugin){
                          window.plugins.jPushPlugin.init();
                            window.plugins.jPushPlugin.getRegistrationID(function (regId) {
                              try {
                                let data = {
                                  "data": {
                                    "regId": regId
                                  },
                                  "token": self.servicesInfo.token
                                };

                                self.urlService.postDatas(UPDATEREGID_URL, data).then(function (resp) {
                                  if (resp) {
                                    if (resp.errorinfo == null) {

                                    }
                                  }
                                });

                              } catch (exception) {

                              }
                            });
                        }
                    }else{
                        self.loginError = true;
                        self.toast(data.errorinfo.errormessage);
                    }
               }
             },function(err){
                 self.toast("服务器异常，请稍后再试")
             }
            )
             ;
        }
    }
    regsiter(){
        this.navCtrl.push(UserRegInfo);
    }
    rembPwd(){
        this.remberPwd = true;
        this.toast("记住密码");
    }
}
