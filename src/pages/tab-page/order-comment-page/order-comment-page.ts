import { Component} from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { COMMENT_URL,COMMENTSUBMIT_URL } from "../../../providers/Constants";
import { ToastController } from 'ionic-angular';
import { servicesInfo } from"../../../providers/service-info";
import { Network } from '@ionic-native/network';

import { App } from 'ionic-angular';
import {UserLogin} from "../../../modules/user-login/user-login";

@Component({
  selector: 'order-comment-page',
  templateUrl: 'order-comment-page.html',
})
export class orderCommentPage {

  public iconActive1 = "assets/img/orderDetail/fengchangmanyi1.png";
  public iconActive2 = "assets/img/orderDetail/manyi1.png";
  public iconActive3 = "assets/img/orderDetail/tucao1.png";
  public labelActive1 = false;
  public labelActive2 = false;
  public labelActive3 = false;
  public commTags = [];
  public tagIdArray = [];
  public subObj = {
    commDetail : null,
    lable : null,
    commType : null
  };
  datas: any = null;
  comm1: any = {};
  comm2: any = {};
  comm3: any = {};
  offline:boolean=false;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public http: Http,
      public urlService: urlService,
      public toastCtrl: ToastController,
      public servicesInfo: servicesInfo,
      private network: Network,
      private app: App,
    ) {
  }

  ionViewDidLoad() {
    this.checkNetwork();
    this.getInfoDatas();
  }

  goBack() {
    this.navCtrl.pop();

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
      position:'bottom'

    });
    toast.present();
  }

  getInfoDatas(){
    
    let data = {
       "data":{
         "orderNo":this.navParams.data.orderNo,

       },
       "token":this.servicesInfo.token,
    };
    let self = this;
    this.urlService.postDatas(COMMENT_URL,data).then(function(resp){
      if(resp){
        console.log(resp);
        if(resp.errorinfo == null){
            self.datas = resp.data;
            console.log(self.datas);
            self.comm1 = self.datas.commType[0];
            self.comm2 = self.datas.commType[1];
            self.comm3 = self.datas.commType[2];
        }else{
          self.toast(resp.errorinfo.errormessage);
          /*token失效的问题*/
          if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
    });
  }
  getTag(tag,idx){
    this.subObj.lable = null;
    this.tagIdArray = [];
    this.commTags[idx].check = !this.commTags[idx].check
    if(this.commTags && this.commTags.length){
      for(var i = 0; i < this.commTags.length; i++){
        if(this.commTags[i].check == true){
          this.tagIdArray.push(this.commTags[i].lableId);
        }
      }
      this.subObj.lable = this.tagIdArray;
    }
  }

  activeIcon(idx){
    if(idx == 1){
        this.iconActive1 = "assets/img/orderDetail/fengchangmanyi.png";
        this.iconActive2 = "assets/img/orderDetail/manyi1.png";
        this.iconActive3 = "assets/img/orderDetail/tucao1.png";
        this.labelActive1 = true;
        this.labelActive2 = false;
        this.labelActive3 = false;
        this.commTags = this.comm1.Lable;
        this.subObj.commType = this.comm1.commTypeId;
    }else if(idx == 2){
        this.iconActive1 = "assets/img/orderDetail/fengchangmanyi1.png";
        this.iconActive2 = "assets/img/orderDetail/manyi.png";
        this.iconActive3 = "assets/img/orderDetail/tucao1.png";
        this.labelActive1 = false;
        this.labelActive2 = true;
        this.labelActive3 = false;
        this.commTags = this.comm2.Lable;
        this.subObj.commType = this.comm2.commTypeId;
    }else{
        this.iconActive1 = "assets/img/orderDetail/fengchangmanyi1.png";
        this.iconActive2 = "assets/img/orderDetail/manyi1.png";
        this.iconActive3 = "assets/img/orderDetail/tucao.png";
        this.labelActive1 = false;
        this.labelActive2 = false;
        this.labelActive3 = true;
        this.commTags = this.comm3.Lable;
        this.subObj.commType = this.comm3.commTypeId;
    }
  }

  submit(){
    if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
    }

    if(this.subObj.lable == null){
        this.toast('请选择标签');
        return;
    }

    let data = {
       "data":{
         "orderId":this.navParams.data.orderId,
         "orderNo":this.navParams.data.orderNo,
         "recycleId":this.navParams.data.recycleId,
         "recyclePhone":this.navParams.data.recyclePhone,
         "commType":this.subObj.commType,
         "lable":this.subObj.lable,
         "commDetail":this.subObj.commDetail,
       },
       "token":this.servicesInfo.token,
    };
    
    let self = this;
    this.urlService.postDatas(COMMENTSUBMIT_URL,data).then(function(resp){
      console.log(resp);
      if(resp){
        if(resp.errorinfo == null){
          self.toast("提交成功!");
          setTimeout(function(){
            self.goBack();
          },2000);
        }else{
            self.toast(resp.errorinfo.errormessage);
            /*token失效的问题*/
            if(resp.errorinfo.errorcode=="10003"){
              self.app.getRootNav().setRoot(UserLogin);
            }
        }
      }
    });
  }

}
