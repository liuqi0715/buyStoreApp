import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { urlService } from "../../../providers/urlService";  //post请求
import { ToastController } from 'ionic-angular';
import{servicesInfo} from"../../../providers/service-info";
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import {Pipe} from 'angular2/core';  //过滤管道
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
@Component({
  selector: 'wallet-bankInfo-page',
  templateUrl: 'wallet-bankInfo-page.html'
})
export class BankInfoPage {
 
  
  constructor(public navCtrl: NavController,
            public urlService: urlService,
            public toastCtrl: ToastController,
            public servicesInfo: servicesInfo,
            public iab: InAppBrowser,
            private app: App,
            private network: Network,
  ) {
    console.log(this.servicesInfo.token,"token")
  }

  bankName="";//银行卡名称
  hotBankType;  //热门银行卡信息
  notHotBankType;  //非热门银行卡信息
  notHotBankType2=[];
  bankCode;    //银行卡code
  pet: string = "puppies";//tab切换
  reLoad = true;    //重新加载页面
  valInput = "";  //搜索时的input中的值
  selectBankInfo;  //初始化所有的不热门银行信息;
  offline:boolean=false;
  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 3000,
      position:'middle'

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

//查询银行卡信息，按照热度
  getAllBankInfo(){
    if(this.offline == true){
      this.toast('无网络连接，请检查');
      return;
   }
    let param = {
      "data":{
        "platform":1,  
      },
      "token":this.servicesInfo.token
    }
    let self = this;
    this.urlService.postDatas(interfaceUrls.getAllBankOfHot,param).then(function(resp){
      if(resp){
          if(resp.errorinfo==null){
            //  console.log(resp.data.hotBank,"==")
             self.hotBankType = resp.data.hotBank;
             self.notHotBankType = resp.data.notHotBank;
             self.selectBankInfo = self.notHotBankType;
             console.log(self.notHotBankType);     
          }else{
            self.toast(resp.errorinfo.errormessage);

            if(resp.errorinfo.errorcode=="10003"){
              self.app.getRootNav().setRoot(UserLogin);
            }

          }
      }
     });
  }
  ionViewDidLoad(){
    this.checkNetwork()        
    
    this.getAllBankInfo();

  }

    //确认热门银行
    confirmHotBank(bank){
        console.log(bank,"bank");
        this.servicesInfo.bankInfo = bank;
        this.navCtrl.pop();

    }
    //确认非热门银行
    confirmBank(bank){
      console.log(bank,"bank");
      this.servicesInfo.bankInfo = bank;
      this.navCtrl.pop();
    }

//重新定义一下
    allBankInfo(){
      this.notHotBankType=this.selectBankInfo;
    }
     a=0;
    //非热门银行搜索
    getItems(ev:any){
        this.allBankInfo();
        this.notHotBankType2=[];
        let val =  ev.target.value;

        if(val && val.trim() != ''){
          console.log("+++++");
          for(var i=0;i<this.notHotBankType.length;i++){
            // console.log((this.notHotBankType[i].bankFullName.toString()).indexOf(val))
            if((this.notHotBankType[i].bankFullName.toString()).indexOf(val.toString())>-1){
                  this.notHotBankType2.push(this.notHotBankType[i])
            }
          }

        this.notHotBankType = this.notHotBankType2;
        console.log(this.notHotBankType,"??");
        
        }   
    }
}
