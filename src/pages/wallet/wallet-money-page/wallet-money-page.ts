import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import{BalancePage} from "../balance/my-balance"
import {Http,Headers} from '@angular/http';
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import{servicesInfo} from"../../../providers/service-info"
import { urlService } from "../../../providers/urlService";
import { ToastController } from 'ionic-angular';
import { DatePipe } from '@angular/common';    //日期
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
declare var $: any;//引入jq

@Component({
  selector: 'wallet-money-page',
  templateUrl: 'wallet-money-page.html'
})

export class WalletMoney {
 
  
  constructor(public navCtrl: NavController,
              private http: Http,
              public servicesInfo: servicesInfo,
              public urlService: urlService,
              public toastCtrl: ToastController,
              private datePipe: DatePipe,
              private app: App,
              private network: Network,
  ) {

  }
  pageNum = 1;     //当前页
  pageSize=14;  //每页条数
  count = 0;      //计算总页数与    cout(数量相区别这里是总页数)
  // timeStarts;
  cashAmount;//可提现
  freezeCashAmount;//不可提现
  freezeUncashAmount;//冻结不可用
  BillList;
  date = new Date();
  timeStarts = this.datePipe.transform(this.date,'yyyy-MM');
  noData = false;
  hasSuccess=false;  //模态框的显示
  offline:boolean=false;
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
    back(){
      this.navCtrl.pop()
    }
    getDate(){
         
    }
    cancle(){

    }
    affirm(){
      
    }
    //根据日期变化重新渲染交易情况
    cityChange(){
      this.hasSuccess = true;
      this.noData = false;
      this.pageNum = 1;
      console.log(this.timeStarts,"??");
      let param2 = {
        "data":{
          "platform":1,
          "pageSize":this.pageSize,
          "pageNum":this.pageNum,
          "date":this.timeStarts
        },
        "token":this.servicesInfo.token,
      }
      let self2 = this;
      this.urlService.postDatas(interfaceUrls.getAccountBillList,param2).then(function(resp){
       if(resp){
         self2.hasSuccess = false;
           if(resp.errorinfo==null){
             self2.BillList =[];
             if(resp.data.total == 0){
              self2.noData = true;
             }else{
           
              console.log(resp.data);
              self2.BillList =  resp.data.rows;
              self2.count = Math.ceil((resp.data.total)/self2.pageSize);
             }
          
            
           }else{
             self2.toast(resp.errorinfo.errormessage);
             
                 if(resp.errorinfo.errorcode=="10003"){
                  self2.app.getRootNav().setRoot(UserLogin);
                }
           }
       }
      });
    }

    ionViewWillEnter() {
      this.hasSuccess = true;
       let params= {
         "data":{
            "platform":1,
         },
         "token":this.servicesInfo.token
       }
        this.http
        .post(interfaceUrls.getSubAccountAmount, params)
        .map(res => res.json())
        .subscribe(data => {
          this.hasSuccess = false;
          if(data.errorinfo==null){
            console.log(data);
            this.cashAmount = data.data.cashAmount;
            this.freezeCashAmount = data.data.freezeCashAmount;
            this.freezeUncashAmount = data.data.freezeUncashAmount;
          }
           
      })
      //查询交易流水

      let param2 = {
        "data":{
          "platform":1,
          "pageSize":this.pageSize,
          "pageNum":this.pageNum,
          "date":this.timeStarts
        },
        "token":this.servicesInfo.token,
      }
      let self2 = this;
      this.urlService.postDatas(interfaceUrls.getAccountBillList,param2).then(function(resp){
       if(resp){
           if(resp.errorinfo==null){
             if(resp.data.total == 0){
              self2.noData = true;
             }else{
           
              console.log(resp.data);
              self2.BillList =  resp.data.rows;
              self2.count = Math.ceil((resp.data.total)/self2.pageSize);
             }   
           }else{
             self2.toast(resp.errorinfo.errormessage);
           }
       }
      });
         
  }
  doInfinite2(infiniteScroll){
    console.log("??");
  }
  
  doInfinite(infiniteScroll) {
    //上拉加载..
    console.log("11");
   console.log(this.count,this.pageNum,">>>>");
   if(this.offline == true){
    this.toast('无网络连接，请检查');
    return;
  }
    if (this.count > this.pageNum) {
        this.pageNum += 1;
        let param2 = {
          "data":{
            "platform":1,
            "pageSize":this.pageSize,
            "pageNum":this.pageNum,
            "date":this.timeStarts
          },
          "token":this.servicesInfo.token,
        }

      let self2 = this;
      this.urlService.postDatas(interfaceUrls.getAccountBillList,param2).then(function(resp){
       if(resp){
           if(resp.errorinfo==null){
            //  self2.bankCardNo = (resp.data.bankCardNo).slice(-4)
            self2.BillList = (self2.BillList).concat(resp.data.rows);
            infiniteScroll.complete();	//加载完成
           }else{
             self2.toast(resp.errorinfo.errormessage);
           }
       }
      });
    } else {
        infiniteScroll.complete();	//加载完成
    }

  

}

}