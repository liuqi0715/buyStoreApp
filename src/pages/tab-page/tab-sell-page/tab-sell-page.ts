import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
// import * as Swiper from 'swiper';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { orderBornPage } from "../order-born-page/order-born-page";
import { orderDetailPage } from "../order-detail-page/order-detail-page";
import { orderAgreePage } from "../order-agree-page/order-agree-page";
import { orderCommentPage } from "../order-comment-page/order-comment-page";
import { chartConfig } from "../../../providers/chartConfig";
import { urlService } from "../../../providers/urlService";
import { SELLINFO_URL, SELLORDER_URL, UPDATEREGID_URL, PAGEJUMP_URL } from "../../../providers/Constants";
import { ToastController } from 'ionic-angular';
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { msgDetails } from "../../wallet/wallet-msgDetails-page/wallet-msgDetails-page";
import { UserLogin } from "../../../modules/user-login/user-login";
import { App } from 'ionic-angular';
import ECharts from 'echarts';
declare var $; 
declare var Swiper; 
declare var window;

@Component({
  selector: 'page-tab-home-page',
  templateUrl: 'tab-sell-page.html',
  providers:[ chartConfig ]
})

export class TabSell {
  @ViewChild('lyScroll')
  lyScrollDiv: ElementRef;
  @ViewChild('btnBackTop')
   bBackTop: ElementRef;
  // @ViewChild('headBgColor')
  //  greetBgDiv: ElementRef;

  oSwiper1: any = null;
  swiper1:any = null;
  swiper2:any = null;
  public headerSlideData = [];
  public orderActive = true;
  public datas = "";
  offline:boolean=false;
  publicOnly:boolean=false;
  recycleIdx = null;
  orderCard: any = {};
  alias: string = 'test';
  // msgList:Array<any>=[];
  msgList:any = {};
  firstClick:boolean=true;
  // firstTime1:any = true;
  // firstTime2:any = true;
  devicePlatform:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public el: ElementRef,
              private camera: Camera,
              public chartConfig: chartConfig,
              public urlService: urlService,
              public servicesInfo: servicesInfo,
              public toastCtrl: ToastController,
              public device: Device,
              private network: Network,
              private app: App,
      ) {
  }

  ionViewDidLoad() {
    this.orderActive = true;    /****/
    this.checkNetwork();
    // this.initJPush();
  }

  ionViewWillLeave() {
     if(this.oSwiper1){
        this.oSwiper1.stopAutoplay();
     }
     if(this.swiper1){
        this.swiper1.stopAutoplay();
     }
  }

  ionViewDidEnter() {
    this.getInfoDatas(null);
  }

  doRefresh(refresher) {
    var self = this;
    // this.oSwiper1=null;
    // this.swiper1=null;
    if(this.offline == true){
        this.toast('无网络连接，请检查');
        refresher.cancel();
        return;
    }

    self.getInfoDatas(refresher); 
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
      position:'middle'
    });
    toast.present();
  }

  getInfoDatas(refresher){
    let data = {
       "data":{

       },
       "token":this.servicesInfo.token
    };

    let self = this;
    this.urlService.postDatas(SELLINFO_URL,data).then(function(resp){
      if(resp){
        if(resp.errorinfo == null){
           if(self.oSwiper1){
              self.oSwiper1.destroy(false);
              self.oSwiper1 = null;
           }
           if(self.swiper1){
              self.swiper1.destroy(false);
              self.swiper1 = null;
           }
           if(self.swiper2){
              self.swiper2.destroy(false);
              self.swiper2 = null;
           }
           sessionStorage.setItem("infoIdx",'0');
           self.datas = resp.data;
           self.initInfoBox(self.datas);
           self.initNoticeSlide();
           self.initCharts();
           if(refresher){
             refresher.complete();
           }
        }else{
           if(refresher){
             refresher.cancel();
           }
           /*token失效的问题*/
           if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
    }).catch(function(error){
         if(refresher){
           refresher.cancel();
         }
         if(self.oSwiper1){
            self.oSwiper1.startAutoplay();
         }
         if(self.swiper1){
            self.swiper1.startAutoplay();
         }
         self.toast("服务器异常，请重试");
    });
    this.urlService.postDatas(SELLORDER_URL,data).then(function(resp){
      if(resp){
        if(resp.errorinfo == null){
          self.orderActive = false;                /*****/
          self.orderCard = resp.data.orderInfo;
          if(refresher){
            refresher.complete();
          }
        }else{
          self.orderActive = true;  
          if(refresher){
             refresher.cancel();
          }
           /*token失效的问题*/
           if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
    }).catch(function(error){
         if(refresher){
           refresher.cancel();
         }
         self.toast("服务器异常，请重试");
    });
  }

  initCharts(){
    
    function addSwiper(con,i){
        return '<div class="swiper-slide"><span class="home-chart-title1">找铅网</span><span class="home-chart-title2">平台指导价: ' + con + '</span><div class="home-chart" id='+ 'chart' + i + '></div></div>';
    }  
    var htmlContain = "";

    // this.oSwiper1.appendSlide(addSwiper(i+1));
    var chartDatas = (this.datas as any).refPriceList;
    if(chartDatas){
      for(var i = 0;i < chartDatas.length;i++){      
          htmlContain = htmlContain + addSwiper(chartDatas[i].catName,i+1);
      }
      $(".headSlideBox").empty().html(htmlContain);
      var self = this,option_l,option_r;
      setTimeout(function(){
          for(var i = 0;i < chartDatas.length;i++){
              var option = (self.chartConfig as any).getConfig();
              option.xAxis.data = [];
              option.series[0].data = [];
              var chartData = chartDatas[i].timePriceArry;
              var obj = {
                date:" ",
                price:""
              }
              chartData.unshift(obj);
              for(var j = chartData.length - 1;j>=0;j--){
                  option.xAxis.data.push(chartData[j].date);
                  option.series[0].data.push(chartData[j].price);
              }
              option.yAxis.min = Math.min.apply(null, option.series[0].data) - Math.min.apply(null, option.series[0].data)/2;
              option.yAxis.max = Math.max.apply(null, option.series[0].data) + Math.max.apply(null, option.series[0].data)/2;
              if(i == 0){
                option_l = option;
              }else if(i == chartDatas.length - 1){
                option_r = option;
              }
              var chart = {};
              var domId = 'chart'+(i+1).toString();
              chart = ECharts.init(document.getElementById(domId) as HTMLDivElement);
              (chart as any).setOption(option);
          }

          self.oSwiper1 = new Swiper('.headSlide', {
            // slidesPerView: 0,
            paginationClickable: true,
            // centeredSlides: true,
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            loop: true,
            // 如果需要分页器
            pagination: '.swiper-pagination',
            // 改变自动更新
            observer:true,
            observeParents:true
          });

          var chartHtml_l = '<span class="home-chart-title1">找铅网</span><span class="home-chart-title2">平台指导价: ' + chartDatas[0].catName +'</span>'+'<div class="home-chart" id="chart_l"></div>';
          var chartHtml_r = '<span class="home-chart-title1">找铅网</span><span class="home-chart-title2">平台指导价: ' + chartDatas[chartDatas.length - 1].catName + '</span>'+'<div class="home-chart" id="chart_r"></div>';
          var copies = $('.headSlide').find('.swiper-slide-duplicate');

          copies.each(function(idx,val) {
            if($(this).attr("data-swiper-slide-index") == '0'){
               $(this).html(chartHtml_l);
            }else if($(this).attr("data-swiper-slide-index") == (chartDatas.length - 1).toString()){
               $(this).html(chartHtml_r);
            }
          });

          var chart_l = ECharts.init(document.getElementById('chart_l') as HTMLDivElement);
          var chart_r = ECharts.init(document.getElementById('chart_r') as HTMLDivElement);
          chart_l.setOption(option_l);
          chart_r.setOption(option_r);

        },100);
    }

   }

  goOrderBorn(data) {

    if(this.publicOnly == false){
        if(data !== undefined){
          this.navCtrl.push(orderBornPage, {
             "recycleId":data[this.recycleIdx].recycleId,
             "recyclePhone":data[this.recycleIdx].recyclePhone,
             "public":true
          });
        }else{
          this.navCtrl.push(orderBornPage, {
             "public":false
          });
        }
    }else{
        this.navCtrl.push(orderBornPage, {
           "public":false
        });
    }

  }

  goOrderDetail(orderCard){ 
    let self = this; 
    if(self.firstClick == true){
        self.firstClick = false;
        if(this.offline == true){
            this.toast('无网络连接，请检查');
            return;
        }

        let data = {
           "data":{

           },
           "token":this.servicesInfo.token
        };
        this.urlService.postDatas(SELLORDER_URL,data).then(function(resp){
            self.firstClick = true;
            if(resp){
              if(resp.errorinfo == null){

                self.orderCard = resp.data.orderInfo;
                if(self.orderCard.pathway == "1"){
                  self.navCtrl.push(orderDetailPage, {
                    "orderNo":orderCard.orderNo
                  });
                }else if(self.orderCard.pathway == "2"){
                  self.navCtrl.push(orderAgreePage, {
                    "orderNo":orderCard.orderNo
                  });
                }else{
                  self.navCtrl.push(orderCommentPage, {
                    "orderId":orderCard.orderId,
                    "orderNo":orderCard.orderNo,
                    "recycleId":orderCard.recycleId,
                    "recyclePhone":orderCard.recyclePhone
                  });
                }

              }else{
                if(resp.errorinfo.errorcode=="10003"){
                  self.app.getRootNav().setRoot(UserLogin);
                }
              }
            }
        }).catch(function(err){
           self.firstClick = true;
        });
    }

  }

  // 初始化滚动条
  private initNoticeSlide() {
    $("#noticeSlider .swiper-wrapper").empty();
    function addNotice(data){
        return '<div class="swiper-slide"><div class="swiper-slide">'+'<span>'+ data.createTime +'</span>'+'<span>'+ data.catName +'</span>'+'<span>'+ data.weightRec +'</span>'+'<span>'+ data.priceRec +'</span>'+'</div></div>';
    }  

    var noticeDatas = (this.datas as any).latelyDealList;
    for(var i = 0;i < noticeDatas.length;i++){
      $("#noticeSlider .swiper-wrapper").append(addNotice(noticeDatas[i]));
    }

    this.swiper1 = new Swiper('#noticeSlider', {
      direction:'vertical',
      autoplay: 3500,
      loop: true,
      observer:true,
      observeParents:true,
      autoplayDisableOnInteraction: false
    });
  }


private initInfoBox(infoDatas) {

  var self = this;

  function slidedata(data){
    var starsDom = '<p>', wordsDom = '<ul>', goodsDom = '<ul>', starsLen = 0;
    if((data.commScore).toString().indexOf(".") == -1){
      starsLen = parseInt(data.commScore);
      for(var i = 0; i < starsLen;i++){
        starsDom = starsDom + '<img src="assets/img/sell/star.png" />';
      }
    }else{
      starsLen = Math.ceil(data.commScore);
      for(var i = 0; i < starsLen;i++){
        if(i < starsLen - 1){
          starsDom = starsDom + '<img src="assets/img/sell/star.png" />';
        }else{
          starsDom = starsDom + '<img src="assets/img/sell/half_star.png" />';
        }
      }
    }

    for(var j = 0; j < 4;j++){
      switch(j)
      {
      case 0:
        wordsDom = wordsDom + '<li>'+ data.commVerygood +'</li>';
        break;
      case 1:
        wordsDom = wordsDom + '<li>'+ data.commGood +'</li>';
        break;
      case 2:
        wordsDom = wordsDom + '<li>'+ data.commNotgood +'</li>';
        break;
      case 3:
        wordsDom = wordsDom + '<li>'+ data.lableName +'</li>';
        break;
      }
    }

    for(var k = 0; k < data.quotePriceList.length;k++){
      goodsDom = goodsDom + '<li><label>'+ data.quotePriceList[k].catName +'</label><span>'+ data.quotePriceList[k].catPrice +'<a>元/kg</a></span></li>';
    }
    
    return '<div class="swiper-slide"><div class="home-display-card">'+'<div class="home-display-card_t"><div class="home-display-card_tag">'+ starsDom+'</p>'+
    '<p>综合评分'+data.commScore+'</p></div><div class="home-display-card_tag"><p>'+data.quoTime+'报价</p><p>'+data.distance+'</p></div></div><div class="home-display-card_m">'+
    wordsDom+'</ul></div><div class="home-display-card_b">'+ goodsDom +'</ul></div></div></div>';
  }

  var datas = infoDatas;

  if(datas && datas.collectorList && datas.collectorList.length>0){
      
      if(datas.collectorList.length > 1){
        $("#home-swiper-navR").hide();
      }

      $(".infoSlide .swiper-wrapper").empty();
      for(var i = 0;i < datas.collectorList.length;i++){
        $(".infoSlide .swiper-wrapper").append(slidedata(datas.collectorList[i]));
      }

      this.swiper2 = new Swiper('.infoSlide', {
        // roundLengths : false, 
        initialSlide :0,
        // speed:600,
        // autoplay :false,
        // followFinger : false,
        observer :true,
        observeParents :true,
        slidesPerView : 'auto',
        centeredSlides : true,
        watchSlidesProgress : true,
        onProgress: function(swiper){
            for (var i = 0; i < swiper.slides.length; i++){
              var slide = swiper.slides[i];
              var progress = slide.progress;
          // scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
              var es = slide.style;
              es.opacity = 1 - Math.min(Math.abs(progress/2),1);
              es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0px,0,'+(-Math.abs(progress*150))+'px)';

            }
        },
        onSetTransition: function(swiper, speed) {
            self.recycleIdx = swiper.activeIndex;
            sessionStorage.setItem("infoIdx",self.recycleIdx);
            // console.log(self.recycleIdx);
            if(swiper.activeIndex == 0){
              $("#home-swiper-navL").show();
            }else{
              $("#home-swiper-navL").hide();
            }

            if(swiper.activeIndex == datas.collectorList.length - 1){
              $("#home-swiper-navR").show();
            }else{
              $("#home-swiper-navR").hide();
            }
            
            for (var i = 0; i < swiper.slides.length; i++) {
              var es = swiper.slides[i].style;
              es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
            }
        }
      });

      // self.swiper2.slides[1].style.transform='scale(0.95)';
      $("#home-swiper-navL").show();
      // if(this.swiper2.on){
      //     this.swiper2.on('slideChangeEnd',function(swiper){
      //       swiper.unlockSwipes();              
      //     });
      // }

      self.publicOnly = false;
      self.recycleIdx = 0;
  }else{
      self.publicOnly = true;
      $("#home-swiper-navL").hide();
      $("#home-swiper-navR").hide();
      $(".infoSlide .swiper-wrapper").empty().append('<div class="home-display-card"><span class="home-display-none">暂无报价</span></div>');
  }

}

}
