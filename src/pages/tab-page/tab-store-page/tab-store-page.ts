import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { ToastController, Tabs } from 'ionic-angular';
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import { Pipe, PipeTransform } from "@angular/core";
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { TabSell } from "../tab-sell-page/tab-sell-page";
import { GETINTEGRAT_URL, GETSIGNIN_URL } from "../../../providers/Constants";
declare var $;
@Component({
  selector: 'page-tab-store-page',
  templateUrl: 'tab-store-page.html'
})

export class TabStore {
  @ViewChild('inteDiv')
  inteDiv: ElementRef;
  noContent = false;
  offline:boolean = false;
  signedDays:any = 0;
  touchTime:any = 0;
  duration:any = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public el: ElementRef,
    public urlService: urlService,
    public servicesInfo: servicesInfo,
    public toastCtrl: ToastController,
    public device: Device,
    private network: Network,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private app: App,
    public tabs: Tabs,
    public iab: InAppBrowser
   ) {
  }
  ionViewDidEnter() {
    var self = this;
    this.inteDiv.nativeElement.addEventListener('touchstart',function(){
      self.touchTime = Math.floor(new Date().getTime());
    });
    this.inteDiv.nativeElement.addEventListener('touchend',function(){
      (self.duration as any) = Math.floor(new Date().getTime() - self.touchTime);
      if(self.duration < 100){
        self.goIntegration();
      }
    });
  }
  goIntegration(){
    let self = this;
    let urlLink = '';
    let browser = self.iab.create("http://192.168.0.156:8019/h5/index.html?access_token="+self.servicesInfo.token,"_self",{"location":"no","clearcache":"yes"});
    browser.on("loadstart").subscribe( event=>{
      console.log('wvent', event);
      if (event.url.match("mobile/close")) {
        browser.close();
        console.log('wvent',event);
      }
    }

    )
  }
  toast(actions) {
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 2000,
      position: 'middle'
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


}
