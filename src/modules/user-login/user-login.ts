import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserRegister} from '../user-register/user-register ';
import {UserRegInfo} from "../user-Reg-Info/userRegInfo";
import { ActionSheetController } from 'ionic-angular';//底部提示信息
import { ToastController } from 'ionic-angular';
import { interfaceUrls }from "../../providers/serviceUrls"
import { Network } from '@ionic-native/network';
import {Http,Headers} from '@angular/http';
// import { Device } from '@ionic-native/device';
import {servicesInfo} from "../../providers/service-info";//将公共数据放在服务中

// import { HomePage } from "../../pages/home/home";//登录成功以后将首页定位根页面
import {TabPage} from "../../pages/tab-page/tab-page";
import { UserPwdFind }from "../user-pwd-find/userPwdFind"

export interface UserInfo {
    userName: string;
    pwd: string;
}

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

                public actionSheetCtrl: ActionSheetController,
                public toastCtrl: ToastController,
                private network: Network,
                private http: Http,
                public servicesInfo: servicesInfo,
            ) {
                // console.log('Device UUID is: ' + this.device.uuid);
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
      }
    login() {
        // this.navCtrl.setRoot(TabPage);    //仅做测试用，正式版本需要注释
        if(this.offline == true){
            this.toast('无网络连接，请检查');
            return;
       }
        console.log("123")
        let self = this;
        if (this.userInfo.userName == '' || this.userInfo.pwd == '') {
            // this.loginError = true;
            // this.errMsg = "用户名、密码不能为空！";
            this.toast("用户名、密码不能为空！")
        } else {
            let params = { "data":{
                "mobile": this.userInfo.userName,
                "password": this.userInfo.pwd
            }};
            console.log("123",params)
             this.http.post(interfaceUrls.login, params)
             .map(res => res.json())
             .subscribe(function (data) {

               let dataInfo =  JSON.stringify(data);

               if(data){
                    if(data.errorinfo==null){
                        self.servicesInfo.token = data.data.token;
                        localStorage.setItem("token",data.data.token);
                        self.servicesInfo.userId = data.data.userId;
                        localStorage.setItem("VERSION",data.version);
                        self.toast("登录成功");
                        self.navCtrl.setRoot(TabPage);
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
        // this.navCtrl.push(UserRegister);
        this.navCtrl.push(UserRegInfo);
    }
    rembPwd(){
        this.remberPwd = true;
        this.toast("记住密码");
    }
}
