import { Component,ViewChild} from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FILEUPLOAD_URL } from "../../../providers/Constants";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
import { App } from 'ionic-angular';
import {UserLogin} from "../../../modules/user-login/user-login";
import { servicesInfo } from '../../../providers/service-info';
import { interfaceUrls } from "../../../providers/serviceUrls";//接地址
import { AddressComponent } from '../../../components/addressSelect/addressSelect';
declare var $;
declare var larkplayer;

@Component({
  selector: 'mine-coupon-page',
  templateUrl: 'mine-coupon-page.html',
})
 
export class myCouponPage {
  @ViewChild("Address") AddressCom : AddressComponent;
  CouponList:any=[]; //优惠卷信息

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private camera: Camera,
    public urlService: urlService,
    public toastCtrl: ToastController,
    private transfer: FileTransfer,
    private file: File,
    public servicesInfo: servicesInfo,
    private app: App,
    ) {
  }
  wantWithdraw=false;
  isDisappear:boolean;
  isEdit = {
    city:"深圳市",
    district: "龙岗区",
    province: "广东省",
    street: "五和南路",
    streetNumber:"41号"
  };
  ionViewDidEnter(){
   
    this.getCouponList();

  }
  ionViewDidLoad(){
 
  }
  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 3000,
      position:'bottom'

    });
    toast.present();
  }
  touchPickerShow(){
    this.AddressCom.show(this.isEdit);
  }
  getCouponList(){
    let params = {
      "data": {
        "platform": 1,
      },
      "token": this.servicesInfo.token
    }
    let self = this;
    this.urlService.postDatas(interfaceUrls.getCouponList, params)
      .then(function (resp) {
       
        if (resp) {
          if (resp.errorinfo == null) {
            self.CouponList =  resp.data.listConpon;
          } else {
            self.toast(resp.errorinfo.errormessage);
            if (resp.errorinfo.errorcode == "10003") {
              //  self.toast("账号在别处登录，请重新登录")
              self.app.getRootNav().setRoot(UserLogin);
            }
          }
        }
      }).catch(() => {
        self.toast("服务器异常，请稍后再试。")
      });
  }

  /**
   * 提現部分
   */

  wantDraw(){
    this.wantWithdraw=true;

    setTimeout(function() {
      console.log($(window).width());

     
      $("#wd_keybord").find('li').css({"width":100/3+"%"});
    }, 50);

  }
  /**
   * 接收子组件中的数据变化
   *
   */
  stateChange($event){
    this.wantWithdraw = false;
  }

  addressPinker($event){
    console.log('tag', $event);
  }


}
