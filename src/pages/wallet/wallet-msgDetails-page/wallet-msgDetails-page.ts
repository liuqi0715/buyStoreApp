import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { MSGDETAILS_URL } from "../../../providers/Constants";
import{servicesInfo} from"../../../providers/service-info";//公共信息

import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
// declare let cordova:any;
declare var $;
@Component({
  selector: 'wallet-msgDetails-page',
  templateUrl: 'wallet-msgDetails-page.html',
})
export class msgDetails {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              public urlService: urlService,
              public servicesInfo: servicesInfo,
              private app: App,
      ) {
  }

  ionViewDidLoad() {
    this.getInfoDatas();
  }

  getInfoDatas(){
    // alert(this.navParams.data.msgContentId);
    let data = {
       "data":{
         "jpusMsgId":this.navParams.data.msgContentId,
         "platform":1,
       },
       "token":this.servicesInfo.token
    };
    // console.log(data);
    let self = this;
    this.urlService.postDatas(MSGDETAILS_URL,data).then(function(resp){
      if(resp){
        // console.log(resp);
        if(resp.errorinfo === null){
          // alert(resp.data.details);
          $("#msgDetails").html(resp.data.details);
        }else{
          if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
    });

  }

}
