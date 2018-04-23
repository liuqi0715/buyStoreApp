import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabPage } from "../pages/tab-page/tab-page";
import { orderDetailPage } from "../pages/tab-page/order-detail-page/order-detail-page";
import { orderAgreePage } from "../pages/tab-page/order-agree-page/order-agree-page";
import { orderCommentPage } from "../pages/tab-page/order-comment-page/order-comment-page";
import { msgDetails } from "../pages/wallet/wallet-msgDetails-page/wallet-msgDetails-page";
import { messagePage } from "../pages/wallet/wallet-message-page/wallet-message-page";
import { adsPage } from "../pages/ads/ads-page";
// import {Splash} from "../pages/splash/splash";
import { App } from 'ionic-angular';
import { UserLogin } from "../modules/user-login/user-login";
import { Http,Headers } from '@angular/http';
import { interfaceUrls }from "../providers/serviceUrls";//接口地址所有的
import { servicesInfo } from "../providers/service-info";
import { urlService } from "../providers/urlService";
import { UPDATEREGID_URL, PAGEJUMP_URL, SIGNINFO_URL } from "../providers/Constants";
import { NativeStorage } from '@ionic-native/native-storage';
import { Device } from '@ionic-native/device';

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = localStorage.getItem("token") ? TabPage : UserLogin;
  platform: any = Platform;
  toast: any = ToastController;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  firstTime1:any = true;

  dataToken = "1";    //保存用户的token

  @ViewChild(Nav) nav: Nav;


  constructor(
    platform: Platform,
    statusBar: StatusBar,
    toast: ToastController,
    private http: Http,
    public splashScreen: SplashScreen,
    public urlService: urlService,
    public servicesInfo:servicesInfo,
    private nativeStorage: NativeStorage,
    private app: App,
    private device: Device
  ) {
    this.platform = platform;
    this.toast = toast;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();
      statusBar.overlaysWebView(true);
      this.initJPush();
      this.initializeApp();

    });
    let self = this;
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      console.log(device.cordova,"devirce is ready----");
      self.autoLogin();
    }
  }



  initializeApp() {
    this.platform.ready().then(() => {

      if(window.MobileAccessibility){
         window.MobileAccessibility.usePreferredTextZoom(false);
      }
      //注册返回按键事件
      this.platform.registerBackButtonAction((): any => {
        let activeVC = this.nav.getActive();
        let page = activeVC.instance;
        if (!(page instanceof TabPage)) {
          if (!this.nav.canGoBack()) {
            //当前页面为tabs，退出APP
            return this.showExit();
          }
          //当前页面为tabs的子页面，正常返回
          return this.nav.pop();
        }
        let tabs = page.tabs;
        let activeNav = tabs.getSelected();
        if (!activeNav.canGoBack()) {
          //当前页面为tab栏，退出APP
          return this.showExit();
        }
        //当前页面为tab栏的子页面，正常返回
        return activeNav.pop();
      }, 101);
    });
  }

 // initJPush() {
 //  //启动极光推送
 //    var self = this;
 //    if (window.plugins && window.plugins.jPushPlugin) {
 //      window.plugins.jPushPlugin.init();
 //      self.getRegistrationID();
 //    }

 //  }

 initJPush() {
  //启动极光推送
    var self = this;
    if (window.plugins && window.plugins.jPushPlugin) {
      window.plugins.jPushPlugin.init();
      self.getRegistrationID();
      // window.plugins.jPushPlugin.setDebugMode(true);
      // window.plugins.jPushPlugin.setCustomPushNotificationBuilder();
      // document.addEventListener("jpush.receiveNotification", () => {
      //   this.msgList.push({content:window.plugins.jPushPlugin.receiveNotification.alert})
      //   alert( this.msgList);
      //   alert(window.plugins.jPushPlugin.receiveNotification.alert);
      //   alert(JSON.stringify(window.plugins.jPushPlugin.receiveNotification));
      // }, false);

      document.addEventListener("jpush.openNotification", function (event) {
        // var alertContent
        var evt:any = event;
        var msgType:any = null;
        var msgList:any = [];
        var orderNo:any = null;
        var orderStatusNo:any = null;
        // alert(JSON.stringify(evt));
        // if(device.platform == "Android") {
        //   alertContent = event.alert
        // } else {
        //   alertContent = event.aps.alert
        // }
        // self.navCtrl.push(msgDetails,{
        //   "msgContentId":evt.extras["cn.jpush.android.MSG_ID"]
        // });
        if(self.firstTime1 == true){
            self.firstTime1 = false;
            let data = {
               "data":{
                 "jpushId":evt.extras["cn.jpush.android.MSG_ID"]
               },
               "token":self.servicesInfo.token
            };
            self.urlService.postDatas(PAGEJUMP_URL,data).then(function(resp){
              if(resp){
                if(resp.errorinfo == null){
                    msgList = resp.data.map;
                    orderNo = msgList.orderNo;
                    msgType = msgList.msgType;
                    orderStatusNo = msgList.orderStatusNo;

                    if(msgType == 1){
                      self.nav.push(msgDetails,{
                        "msgContentId":msgList.jpusMsgId
                      });
                    }else{
                      if(orderStatusNo == 2){
                        self.nav.push(orderAgreePage,{
                          orderNo:orderNo
                        });
                      }else if(orderStatusNo == 1){
                        self.nav.push(orderDetailPage,{
                          orderNo:orderNo
                        });
                      }else if(orderStatusNo == 3){
                        self.nav.push(orderCommentPage,{
                          orderNo:orderNo
                        });
                      }else if(orderStatusNo == 4){
                        self.nav.push(messagePage,{
                          orderNo:orderNo
                        });
                      }
                    }
                }
              }
            }).catch(function(err){
              self.toast(err);
            });

            setTimeout(function(){
              self.firstTime1 = true;
            },1000);
        }

        // for(var i =0 ;i<self.msgList.length;i++){
        //    var rcObj = self.msgList[i];
        //    if(rcObj.extras["cn.jpush.android.MSG_ID"] == evt.extras["cn.jpush.android.MSG_ID"]){
        //       msgList = JSON.parse(rcObj.message).msgList;
        //       // alert(JSON.stringify(msgList));
        //       orderNo = msgList[0].orderNo;
        //       msgType = msgList[0].msgType;
        //       orderStatusNo = msgList[0].orderStatusNo;
        //    }
        // }
        // alert(msgType+"/"+orderNo+"/"+orderStatusNo);
        // if(msgType == 1){
        //   self.navCtrl.push(msgDetails,{
        //     "msgContentId":evt.extras["cn.jpush.android.MSG_ID"]
        //   });
        // }else{
        //   if(orderStatusNo == 2){
        //     self.navCtrl.push(orderAgreePage,{
        //       orderNo:orderNo
        //     });
        //   }else if(orderStatusNo == 1){
        //     self.navCtrl.push(orderDetailPage,{
        //       orderNo:orderNo
        //     });
        //   }else if(orderStatusNo == 3){
        //     self.navCtrl.push(orderCommentPage,{
        //       orderNo:orderNo
        //     });
        //   }
        // }

      }, false);

      // document.addEventListener("jpush.receiveMessage", function (event) {
      //   // var message
      //   // var evt:any = event;
      //   // // alert(JSON.stringify(evt));
      //   // self.msgList.push(evt);
      //   // if (this.devicePlatform == 'Android') {
      //   //   message = evt.message;
      //   //   alert(message);
      //   // } else {
      //   //   message = evt.content;
      //   // }
      //    if(self.firstTime2 == true){
      //       self.firstTime2 = false;
      //       let data = {
      //          "data":{

      //          },
      //          "token":this.servicesInfo.token
      //       };

      //       self.urlService.postDatas(SELLORDER_URL,data).then(function(resp){
      //         if(resp){
      //           if(resp.errorinfo == null){
      //             self.orderCard = resp.data.orderInfo;
      //           }
      //         }
      //       });
      //       setTimeout(function(){
      //         self.firstTime2 = true;
      //       },1000);
      //    }

      // }, false);
    }

  }

  getRegistrationID(){
    var self = this;
    window.plugins.jPushPlugin.getRegistrationID(function (regId) {
        try {
          // alert("JPushPlugin:registrationID is " + regId);
          let data = {
             "data":{
                "regId":regId
             },
             "token":self.servicesInfo.token
          };

          self.urlService.postDatas(UPDATEREGID_URL,data).then(function(resp){
            if(resp){
              if(resp.errorinfo == null){
                 console.log(resp.data);
                 // alert(self.datas);
              }
            }
          });

        } catch (exception) {
          console.log(exception);
        }
      });
  }
  //双击退出提示框，这里使用Ionic2的ToastController

  showExit() {
    if (this.backButtonPressed) this.platform.exitApp();  //当触发标志为true时，即2秒内双击返回按键则退出APP
    else {
      let toast = this.toast.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
      this.backButtonPressed = true;
      //2秒内没有再次点击返回则将触发标志标记为false
      setTimeout(() => {
        this.backButtonPressed = false;
      }, 2000)
    }
  }

  //进入app首先登录
  autoLogin() {
    let self = this;
    // if(localStorage.getItem("token")){
    //   this.splashScreen.hide();
    //   this.nav.setRoot(TabPage);
    // }else{
    //   this.nav.setRoot(UserLogin);
    // }



      self.nativeStorage.getItem('token')
        .then(
        data => {
          console.log(data, "platform===");
          if (data.token) {
            self.dataToken = data.token;
            self.app.getRootNav().setRoot(TabPage);
            self.servicesInfo.token = self.dataToken;
            console.info('token已存进入tab页面', self.dataToken)
            console.log(self.servicesInfo.token, "====服务中的token")
            self.checkLogin();
          } else {
            self.app.getRootNav().setRoot(UserLogin);
            console.info('UserLogin页面')
            self.checkLogin();
          }
          self.splashScreen.hide();

        },
        error => {
          self.splashScreen.hide();
          self.app.getRootNav().setRoot(UserLogin);
          console.error(error, "ready出错了");
          self.checkLogin();
        });


  }

  /**
   * 检测用户登录
   */
    checkLogin(){
      let Token =  localStorage.getItem("token")
      let data = {
        "token": Token
      };
      this.urlService.postDatas(SIGNINFO_URL, data).then(function (resp) {
        if (resp) {
          console.info(">>>>>>>")
        }
      }).catch(function (err) {
        // self.toast(err);
      });
    }
}

