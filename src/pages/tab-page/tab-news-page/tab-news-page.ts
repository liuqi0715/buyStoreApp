import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { ToastController } from 'ionic-angular';
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { UserLogin } from "../../../modules/user-login/user-login";
import { App } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { newsDetailsPage } from '../../news/news-details-page/news-details-page';
import { mockDataInfo } from '../../../providers/mock-data';
import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { interfaceUrls } from '../../../providers/serviceUrls';

import ECharts from 'echarts';
// import larkplayer from 'larkplayer';
declare var $;
declare var Swiper;
declare var window;
declare var larkplayer;
declare var document;
@Component({
  selector: 'page-tab-news-page',
  templateUrl: 'tab-news-page.html',

})

export class TabNews {
  @ViewChild('lyScroll')
  lyScrollDiv: ElementRef;
  @ViewChild('btnBackTop')
   bBackTop: ElementRef;
  // @ViewChild('headBgColor')
  //  greetBgDiv: ElementRef;

  noContent = false;
  offline:boolean=false;
  roateFlag = false;    //刷新的动画
  newsList = null;

  maxPage = 1;
  currentPage = 0;
  total;  //数据总数
  hasALL = false;
  column=[];//
  columnId=null;  //栏目Id默认为空
  hasClick = false;
  active = 1;  //当前点击的顶部栏目
  commentConent;
  constructor(public navCtrl: NavController,
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
              private appVersion:AppVersion,
              private transfer:FileTransfer,
              private file: File,
              private fileOpener:FileOpener,
              private fileTransfer:FileTransferObject,
              private androidPermissions: AndroidPermissions,
              public mockDataInfo:mockDataInfo,
              private _sanitizer: DomSanitizer
      ) {
  }


  ionViewDidLoad() {
    // let self = this;
    // $(".has_action").each(function () {
    //   $(this).click(function () {
    //     console.log($(this).attr("id"));
    //     let id = $(this).attr("id");
    //     $(".has_action").unbind('click');
    //     self.goDeatailPage(id);
    //   });
    // })
    if (this.hasALL == true) {

    } else {
      this.getNEwsList();

    }

  }

  ionViewWillLeave() {
  }

  ionViewDidEnter() {
    const image = new Image();
    image.src = "http://192.168.0.156/imgs/news/20180518145311_426.jpg"
    console.log(image,":image","imageSrc:",image.width)
    this.checkNetwork();
    this.queryTabColumnList();
    this.getSort();


  }
  toast(actions) {
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  /**
   * 数组去重--的两种方法
   */
   getSort(){
     let arr = this.mockDataInfo.a;
     var tmp = [];
     for (var i = 0; i < arr.length; i++) {
       if (tmp.indexOf(arr[i].filedidx)==-1) {
         tmp.push(arr[i].filedidx)
       }else{
        //  console.log(arr[i])
       }
      //  tmp.push(arr[i].filedidx)
     }
     function unique(arr) {
       return Array.from(new Set(arr));
     }
   }

   /**
    *
    * @param id 查看文章详情
    */
  goDeatailPage(item){
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '数据加载中'
    });
    loading.present();
    let params = {
      "contId":item.id,
      "userId": this.servicesInfo.userId,
      "rows":10,
      "page":1
    }
    let self = this;
    this.urlService.postDatas(interfaceUrls.getNewsDetail, params)
      .then(function (resp) {
        if (resp) {
          loading.dismiss();
          console.log(resp)
          if (resp.errorinfo === null) {
              console.info('tag:', resp)
              item.hasClick = true;
              self.navCtrl.push(newsDetailsPage,{
              tabconnet:resp,
              contentId: item.id
            });
          } else {
            // self.toast("网络异常");
            if (resp.errorinfo.errorcode == "10003") {
              self.app.getRootNav().setRoot(UserLogin);
            }
          }
        }
      }).catch(()=>{
        self.toast("网络异常。")
      });
  }
/**
 *
 * @param refreshe ==下拉刷新
 */
  doRefresh(refresher) {
    let selfMaxPage = this.maxPage
    // if(this.offline == true){
    //     this.toast('无网络连接，请检查');
    //     refresher.cancel();
    //     return;
    // }
    let params = {
      "rows": 10,
      "page": 1,
      "columnId": this.columnId,
      "token": this.servicesInfo.token
    }
    let self = this;
    this.urlService.postDatas(interfaceUrls.getNewsList, params)
      .then(function (resp) {
        //  console.log("1",resp);
        if (resp) {
          if (resp.errorinfo === null) {
            console.info('tag:', resp)
            refresher.complete()
            for (var i = 0; i < resp.data.length; i++) {
              // var element = array[i];
              resp.data[i]["hasClick"] = false;

            }
            self.newsList = (resp.data);
            if (self.newsList.length==0){
              self.noContent = true;
            }else{
              self.noContent = false;

            }
          } else {
            // self.toast("网络异常");
            refresher.complete()
            if (resp.errorinfo.errorcode == "10003") {
              self.app.getRootNav().setRoot(UserLogin);
            }
          }
        }
      }).catch(() => {
        self.toast("网络异常。");
        refresher.complete();

      });

  }

  /**
   *
   * @param infiniteScroll --上拉加载
   */
  doInfinite(infiniteScroll){
    let self = this;
    // if (this.offline == true) {
    //   this.toast('无网络连接，请检查');
    //   infiniteScroll.cancel();
    //   return;
    // }
    if (this.currentPage<this.maxPage) {
        this.currentPage++;
      let params = {
        "rows": 10,
        "page": this.currentPage,
        "columnId": this.columnId,
        "token": this.servicesInfo.token
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.getNewsList, params)
        .then(function (resp) {
          //  console.log("1",resp);
          if (resp) {
            if (resp.errorinfo === null) {
              console.info('tag:', resp)
              for (var i = 0; i < resp.data.length; i++) {
                // var element = array[i];
                resp.data[i]["hasClick"] = false;

              }
              self.newsList = self.newsList.concat(resp.data);
              infiniteScroll.complete();
            } else {
              // self.toast("网络异常");
              if (resp.errorinfo.errorcode == "10003") {
                self.app.getRootNav().setRoot(UserLogin);
              }
            }
          }else{
            infiniteScroll.complete();

          }
        }).catch(()=>{
          self.toast("网络异常，")
          self.hasALL = false;

          infiniteScroll.complete();
        });
    }else{
      // infiniteScroll.enable(false);
      self.hasALL = true;
      infiniteScroll.complete();
    }


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




  /**
   * 顶部刷新页面
   */
  refresh(){
    if (this.roateFlag==false){
      this.roateFlag = true
    }
    this.getNEwsList();
    setTimeout(function() {
      this.roateFlag = false
      console.log(this.roateFlag)
    }, 1000);
  }

/**
 * 获取新闻列表
 */
getNEwsList(){
  let params = {
    "rows":10,
    "page":1,
    "columnId": this.columnId,
    "token": this.servicesInfo.token
  }
  let self = this;
  this.urlService.postDatas(interfaceUrls.getNewsList, params)
    .then(function (resp) {
      //  console.log("1",resp);
      if (resp) {
        if (resp.errorinfo === null) {
          self.currentPage++;
          if(resp.data.length==0){
              self.newsList = [];

              self.noContent = true
              self.hasALL = false;
          }else{
            for (var i = 0; i < resp.data.length; i++) {
              // var element = array[i];
              resp.data[i]["hasClick"] = false;

            }
            if (resp.data.length <= 10){
              self.hasALL = true;
            } else if (resp.data.length>10){
              self.hasALL = false;

            }
            self.noContent = false;
            console.info('tag:', resp)
            self.newsList = resp.data;
            self.maxPage = resp.totalPage;
            self.total = resp.total;
          }

        } else {
          // self.toast("网络异常");
          if (resp.errorinfo.errorcode == "10003") {
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
    }).catch(()=>{
      if (self.newsList!=null){
        self.noContent = false;
      }else{
        self.noContent = true
      }

      self.toast("网络异常。")
    });
}

/**
 * 获取顶部列表栏目
 */
queryTabColumnList(){
  let params = {

  }
  let self = this;
  this.urlService.postDatas(interfaceUrls.queryTabColumnList, params)
    .then(function (resp) {
      //  console.log("1",resp);
      if (resp) {
        if (resp.errorinfo === null) {
          self.column = resp.data;
          console.log(self.column)
          if (self.column.length<=5){
            $(".topList ul").css({ "width": "100%"});
            $(".topList ul li").css({ "width": 100 / (self.column.length) +"%" })
          }else{
            $(".topList ul").css({ "width": (self.column.length) * 1.52 + "rem" });
            $(".topList ul li").css({"width":"1.52rem"})
          }
        } else {
          console.log("===?")

          self.toast(resp.errorinfo.errormessage);
          if (resp.errorinfo.errorcode == "10003") {
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }else{
        console.log("===")
      }
    }).catch(() => {
      self.toast("网络异常。")
    });
}
/**
 * 根据栏目Id获取新闻
 */
  getColList(item){
    this.active = item.id;
    this.columnId = item.id;
    this.maxPage = 1;
    this.currentPage = 0;
    this.getNEwsList();

  }


  reload(){
    this.getNEwsList();
  }


}
