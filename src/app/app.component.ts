import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabPage } from "../pages/tab-page/tab-page";
import { orderDetailPage } from "../pages/tab-page/order-detail-page/order-detail-page";
import { orderAgreePage } from "../pages/tab-page/order-agree-page/order-agree-page";
import { orderCommentPage } from "../pages/tab-page/order-comment-page/order-comment-page";
import { msgDetails } from "../pages/wallet/wallet-msgDetails-page/wallet-msgDetails-page";
import { adsPage } from "../pages/ads/ads-page";
// import {Splash} from "../pages/splash/splash";

import { UserLogin } from "../modules/user-login/user-login";
import { Http,Headers } from '@angular/http';
import { interfaceUrls }from "../providers/serviceUrls";//接口地址所有的
import { servicesInfo } from "../providers/service-info";
import { urlService } from "../providers/urlService";
import { APPUPDATE_URL, APPCONFIG_URL, UPDATEREGID_URL, PAGEJUMP_URL } from "../providers/Constants";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = UserLogin;
  platform: any = Platform;
  toast: any = ToastController;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发
  firstTime1:any = true;
  @ViewChild(Nav) nav: Nav;


  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    toast: ToastController,
    private http: Http,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public urlService: urlService,
    public servicesInfo:servicesInfo,
    private appVersion:AppVersion,
    private transfer:FileTransfer,
    private file: File,
    private fileOpener:FileOpener,
    private fileTransfer:FileTransferObject,
    private androidPermissions: AndroidPermissions
  ) {
    this.platform = platform;
    this.toast = toast;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();
      statusBar.overlaysWebView(true);
      setTimeout(function () { splashScreen.hide(); }, 1000);
      this.checkUpdate();
      this.initJPush();
      this.autoLogin();
      this.initializeApp();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
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

    if(localStorage.getItem("token")){
      this.nav.setRoot(TabPage);
    }else{
      this.nav.setRoot(UserLogin);
    }

  }

  //检查版本更新
  checkUpdate() {
    let self = this;
    let data = {
       "data":{

       },
       "token":this.servicesInfo.token
    };
　　//查询当前服务器的APP版本号与当前版本号进行对比
    this.urlService.postDatas(APPCONFIG_URL,data).then((resp:any) => {
      if(resp){
        if(resp.errorinfo == null){
          self.appVersion.getVersionNumber().then((version) => {
            // alert(JSON.stringify(resp));
            if (resp.version != version) {
              // this.appUrl=data[0].APPURL;  //可以从服务端获取更新APP的路径
              let updateAlert = self.alertCtrl.create({
                title: '提示',
                message: '发现新版本,是否立即更新?',
                buttons: [{
                  text: '取消'
                }, {
                  text: '确定',
                  handler: () => {
                    self.checkPermission();
                  }
                }
                ]
              });
              updateAlert.present();
            }
          });
        }
      }
    });
      
  }

  toast1(actions){
    let toast = this.toast.create({
      message: actions,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }

  checkPermission(){
     var self = this;
     self.androidPermissions.checkPermission(self.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        result => {
          // alert('可读权限'+result.hasPermission);
          if(result.hasPermission == false){
            self.androidPermissions.requestPermission(self.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
            result => {
              self.androidPermissions.checkPermission(self.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                result => {
                  // alert('可写权限'+result.hasPermission);
                  if(result.hasPermission == false){
                     self.androidPermissions.requestPermission(self.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                        result => {
                            self.upgradeApp();
                        },
                        err => {
                            // alert(JSON.stringify(err));
                            self.toast1("存储权限未打开,升级失败");
                        }
                     )
                  }else{
                    self.upgradeApp();
                  }
                  
                }
              );
            })
          }else{
              self.androidPermissions.checkPermission(self.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                result => {
                  // alert('可写权限'+result.hasPermission);
                  if(result.hasPermission == false){
                     self.androidPermissions.requestPermission(self.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                        result => {
                            self.upgradeApp();
                        },
                        err => {
                            // alert(JSON.stringify(err));
                            self.toast1("存储权限未打开,升级失败");
                        }
                     )
                  }else{
                    self.upgradeApp();
                  }
                  
                }
                // err => self.androidPermissions.requestPermission(self.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                //   result => {
                //       self.upgradeApp();
                //   },
                //   err => {
                //       alert(JSON.stringify(err));
                //   }
                // )
              );
          }
        },
        err => {
          self.toast1("存储权限未打开,升级失败");
        }
      );
  }

  upgradeApp() {

    let self = this;

    let uploading = this.loadingCtrl.create({
      content: "安装包正在下载...",
      dismissOnPageChange: false
    });

    // var options = {};
    uploading.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    const apk = this.file.externalRootDirectory + 'xdll_shop.apk'; //apk保存的目录

    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]).then(
    //   result => {

    //   },
    //   err => {
    //       alert(JSON.stringify(err));
    //   }
    // );
       fileTransfer.download(APPUPDATE_URL, apk).then(
          (result) => {
            uploading.dismiss();
            self.fileOpener.open(apk, 'application/vnd.android.package-archive').then(
              (result) => {
                // alert("ok");
              }
            ).catch((error) => {
                // alert(JSON.stringify(error));
                let toast = self.toast.create({
                  message: error.exception,
                  duration: 2000,
                  position:'middle'
                });
                toast.present();
            });
          },(error) => {
            let toast = self.toast.create({
              message: error.exception,
              duration: 2000,
              position:'middle'
            });
            toast.present();
            uploading.dismiss();
          }
        );

        fileTransfer.onProgress((event) => {
          //进度，这里使用文字显示下载百分比
            var downloadProgress = (event.loaded / event.total) * 100;
            uploading.setContent("已经下载：" + Math.floor(downloadProgress) + "%");

            if (downloadProgress > 99) {
              uploading.dismiss();
            }

        });

  }

}

