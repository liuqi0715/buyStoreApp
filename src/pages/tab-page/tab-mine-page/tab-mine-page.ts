import { Component } from '@angular/core';
import { NavController, NavParams,AlertController,App,Platform } from 'ionic-angular';
import { WalletPage } from "./../../wallet/my-wallet";
import { orderListPage } from "../order-list-page/order-list-page";
import { myInfoPage } from "../mine-info-page/mine-info-page";
import { myAccountPage } from "../mine-account-page/mine-account-page";
import { messagePage } from "./../../wallet/wallet-message-page/wallet-message-page";
import { changePasswordPage } from "./../../wallet/wallet-password-page/wallet-password-page";
import { UserOpenAccount } from "../../../modules/user-open-account/userOpenAccount";
/**
 * Generated class for the TabMorePagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
import { Network } from '@ionic-native/network';
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { urlService } from "../../../providers/urlService";  //post请求
import { ToastController } from 'ionic-angular';
import { servicesInfo } from"../../../providers/service-info";
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { UserLogin } from "../../../modules/user-login/user-login";
import { AppVersion } from '@ionic-native/app-version';
import { addCardPage } from "../../wallet/wallet-addCard-page/wallet-addCard-page";
import { NativeStorage } from '@ionic-native/native-storage';
import { myCouponPage } from '../mine-coupon-page/mine-coupon-page';
declare var $;
@Component({
  selector: 'page-tab-more-page-page',
  templateUrl: 'tab-mine-page.html',
})
export class TabMine {

  constructor(public navCtrl: NavController,
           public navParams: NavParams,
           public urlService: urlService,
           public toastCtrl: ToastController,
           public servicesInfo: servicesInfo,
           public iab: InAppBrowser,
           private alertCtrl: AlertController,
           private app: App,
           private network: Network,
           private appVersion:AppVersion,
           public  platform: Platform,
           private nativeStorage: NativeStorage,
    ) {
      console.log(this.servicesInfo.token,"token")

  }

  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 1500,
      position:'middle'

    });
    toast.present();
  }
  storeImage = 'assets/img/default.png';    //头像
  userName;    //登录名
  whetherAccount = false;  //是否显示开户
  loading = false;    //加载动画

  canGo = false;
  isBindCard:any = null;  //钱包是否跳页
  success;

  CHECK:any = null; //开户页面跳转
  ERROR;  //已开户无需
  notRead:any= 0;//未读信息条数
  offline:boolean=false;
  version:any = null;
  openHeadImg = false;  //点击扩大之后查看头像
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
    this.appVersion.getVersionNumber().then((version) => {
        this.version = version;
    });
    let self = this;
    document.addEventListener("backbutton",function(){
        self.openHeadImg = false;
        $(".tabbar").css({"display":""});
        $("#addCladd img").removeClass("anmiate");
    }, false); //返回键  
  }
//获取个人信息
  ionViewDidEnter(){
    // this.hasSuccess = true;
    let params={
      "data":{
        "platform":1,
      },
      "token":this.servicesInfo.token
    }
    let self = this;
    this.urlService.postDatas(interfaceUrls.personInfo,params)
    .then(function(resp){
     //  console.log("1",resp);
     if(resp){
         if(resp.errorinfo==null){
             self.userName = resp.data.storesInfo.userName;
             self.storeImage = resp.data.storesInfo.storeImage;
             self.whetherAccount = resp.data.whetherAccount;
            if(resp.data.notRead>99){
                 self.notRead ="99+";
            }else{
                 self.notRead = resp.data.notRead;
            }

            // if(self.notRead>99){
            //      self.notRead = "99+";
            // }else{
            //      self.notRead = 100;
            // }


         }else{
           self.toast(resp.errorinfo.errormessage);
           if(resp.errorinfo.errorcode=="10003"){
            //  self.toast("账号在别处登录，请重新登录")
             self.app.getRootNav().setRoot(UserLogin);
          }
         }
     }
   });
  }


// console.log($);
//查询是否绑定卡--
  goMyWallet2(){
    // this.navCtrl.push(WalletPage);    //测试用，正式环境注释
    if(this.offline == true){
      this.toast('无网络连接，请检查');
      return;
     }

      let params= {
        "data":{
           "platform":1,
        },
        "token":this.servicesInfo.token
      }
       let self = this;
        this.urlService.postDatas(interfaceUrls.openAccountQuery2,params)
        .then(function(resp){
         if(resp){

             if(resp.errorinfo==null){
                 if(resp.data.susses=="Y"){
                    if(resp.data.isBindCard==1){
                      self.isBindCard=1;
                     }else if(resp.data.isBindCard==0){

                      self.isBindCard=0;
                     console.log( self.isBindCard)
                     }
                     self.servicesInfo.creditCode = resp.data.creditCode;
                     self.servicesInfo.firmName = resp.data.firmName;    //公司名称
                     self.servicesInfo.operName = resp.data.operName;    //法人名称
                 }else if(resp.data.susses=="N"){
                    // self.toast("暂未开户")
                    self.isBindCard="N";
                    self.servicesInfo.creditCode = resp.data.creditCode;
                    self.servicesInfo.firmName = resp.data.firmName;    //公司名称
                    self.servicesInfo.operName = resp.data.operName;    //法人名称
                 }

             }else{
              self.toast(resp.errorinfo.errormessage);
               /*token失效的问题*/
               if(resp.errorinfo.errorcode=="10003"){
                self.app.getRootNav().setRoot(UserLogin);
              }
             }
         }
       })
       .catch(function(error){
        self.toast("服务器异常,请稍后再试。");
      });


  }


  goOrderList(){
    this.navCtrl.push(orderListPage)
  }
  goMessage(){
    this.navCtrl.push(messagePage);
  }
  goBasicInfo(){
    this.navCtrl.push(myInfoPage);
  }

  //？？？？

  goAccount2(){
    if(this.offline == true){
      this.toast('无网络连接，请检查');
      return;
   }
    let params= {
         "data":{
            "platform":1,
         },
         "token":this.servicesInfo.token
       }
      let self = this;
       this.urlService.postDatas(interfaceUrls.openAccountQuery,params)
       .then(function(resp){
        if(resp){
            if(resp.errorinfo==null){
                  if(resp.data.check=="OK"){
                    //  self.navCtrl.push(UserOpenAccount);
                      self.CHECK = "OK"
                  }else if(resp.data.check=="NG"){
                    // self.navCtrl.push(myAccountPage);
                    self.CHECK = "NG"
                  }else{
                    self.CHECK="AL"
                    // self.toast("已开户。")
                  }
            }else{
              // self.toast(resp.errorinfo.errormessage);

              self.ERROR = resp.errorinfo.errormessage
              self.CHECK = "ER"
               /*token失效的问题*/
               if(resp.errorinfo.errorcode=="10003"){
                self.app.getRootNav().setRoot(UserLogin);
              }
            }
        }
      });
  }
  goAccount(){
    if(this.CHECK==null){
      this.toast("正在校验开户信息,请稍后重试!");

    }else{
      if(this.CHECK=="OK"){
        this.navCtrl.push(UserOpenAccount);
      }else if(this.CHECK=="NG"){
        this.navCtrl.push(myAccountPage);
      }else if(this.CHECK=="AL"){
        this.toast("已开户。")
      }else if(this.CHECK=="ER"){
        this.toast(this.ERROR);
      }else{
        this.toast("服务器异常，请稍后再试。");
      }
    }
  }
  goMyWallet(){
    if(this.isBindCard==null){
      this.toast("正在校验绑卡信息,请稍后重试!");
      this.goMyWallet2();  //在请求一次
    }else{
      if( this.isBindCard==1){
        this.navCtrl.push(WalletPage)
      }else if(this.isBindCard==0){
        this.navCtrl.push(addCardPage)
        this.toast("你还没有绑定银行卡,请先绑卡");
      }else if(this.isBindCard=="N"){
        this.toast("暂未开户。");
      }else{
        this.toast("服务器异常，请稍后再试。");
      }
    }
  }
  ionViewWillEnter(){
    this.goMyWallet2();
    this.goAccount2();
  }


  editPassword(){
    this.navCtrl.push(changePasswordPage);
  }
  //退出登录app
  confirm(str: string = '您确定此操作吗？',  noStr: string = '取消',okStr: string = '确定',): Promise<any> {
    return new Promise((resolve, reject) => {
        return this.alertCtrl.create({
            title: "提示",
            message: str,
             enableBackdropDismiss: false,
              buttons: [ {
                text: noStr, handler: () => {
                    reject('操作被取消')
                }
            },{
              text: okStr,
              handler: resolve
          },]
        }).present();
    });
}
//退出登录
  exitApp(){
    let self = this;
    this.confirm("你确定要退出登录吗？")
    .then(() => {
          let params={
            "data":{
              "platform":1,
           },
           "token":this.servicesInfo.token
          }
          this.urlService.postDatas(interfaceUrls.exitApp,params)
          .then(function(resp){
           //  console.log("1",resp);
           if(resp){
              if(resp.errorinfo==null){
                // console.log(self.app.getRootNav().setRoot())
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("pwd");
                self.nativeStorage.remove("token").then(
                    data=>{
                      console.log("datatuichu:",data)
                    }
                )
                self.app.getRootNav().setRoot(UserLogin);
              }else{
                self.toast(resp.errorinfo.errormessage);
              }
           }
         });

    })
    .catch(err => {
         self.toast("操作取消。");
    })
  }

  //设置为跟页面
  setRootPage(){
    // this.app.getRootNav().setRoot(UserLogin);
    // this.navCtrl.push(orderListPage);
    console.log("work");
  }
  closeHeadImg(){
    this.openHeadImg = false;
    $(".tabbar").css({"display":""});
    $("#addCladd img").removeClass("anmiate");
    // setTimeout()
  }
  showHeadImg(){
    this.openHeadImg = true;
    $(".tabbar").css({"display":"none"});

    setTimeout(()=>{
      $("#addCladd img").addClass("anmiate");
    },100)
    // this.platform.registerBackButtonAction(()=>{
    //     this.openHeadImg = false;
    // })

  }
  //去往优惠卷页面
  goCoupon(){
    this.navCtrl.push(myCouponPage)
  }

}
