import { Component, ViewChild, ElementRef } from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams,ToastController} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { SELLORDERDETAIL_URL,SELLINFO_URL, SELLORDERDETAIL1_URL, CANCELORDER_URL, CONFIRMORDER_URL} from "../../../providers/Constants";
import { AlertController } from 'ionic-angular';
import { servicesInfo } from"../../../providers/service-info";//公共信息
import { orderMapPage } from "../order-map-page/order-map-page";
import { Network } from '@ionic-native/network';
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
// declare let cordova:any;
declare var $; 
declare var BMap;
declare let baidumap_location: any;
@Component({
  selector: 'order-detail-page',
  templateUrl: 'order-detail-page.html',
})
export class orderDetailPage {

  public map = null;
  default:any= {"x":114.06667,"y":22.61667};
  datas: any = [];
  touchTime:any = 0;
  duration:any = 0;
  orderInfoBean: any = {};
  orderStateWater: any = [];
  recyclesInfoBean: any = {};
  offline:boolean=false;
  firstOffline:boolean=false;
  public latitude = null;
  public longitude = null;

  @ViewChild('map') mapElement: ElementRef;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              private network: Network,
              public urlService: urlService,
              public servicesInfo: servicesInfo,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private app: App,
      ) {
  }

  ionViewDidEnter() {
    this.datas = [];
    this.orderInfoBean = {};
    this.orderStateWater = [];
    this.recyclesInfoBean = {};
    this.initMap();
    this.checkNetwork();
    this.getInfoDatas();
  }

  checkNetwork(){
    let self = this;

    self.network.onDisconnect().subscribe(()=>{
        self.offline = true; 
        if(self.datas.length == 0){
          self.firstOffline = true;
        }
        self.toast('无网络连接，请检查');
    });
    self.network.onConnect().subscribe(()=>{
        self.offline=false; 
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  reload(){
    this.getInfoDatas();
  }

  mapDetail(){
    if(this.longitude){
      this.navCtrl.push(orderMapPage, {
        "latitude":this.latitude,
        "longitude":this.longitude,
        "staff":this.recyclesInfoBean
      });
    }
  }

  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 2000,
      position:'middle'

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
    this.urlService.postDatas(SELLORDERDETAIL_URL,data).then(function(resp){
      console.log(resp);
      if(resp){
        if(resp.errorinfo == null){

            self.datas = resp.data;
            self.orderInfoBean = resp.data.orderInfoBean;
            self.orderStateWater = resp.data.orderStateWater;
            self.recyclesInfoBean = resp.data.recyclesInfoBean;
            self.firstOffline = false;
           
        }else{
           /*token失效的问题*/
           if(resp.errorinfo.errorcode=="10003"){
            self.app.getRootNav().setRoot(UserLogin);
          }
        }
      }
      self.firstOffline = false;
    }).catch(function(){
      self.toast("服务器连接异常");
      if(self.offline==false && self.datas.length != 0){
         self.firstOffline = false;
      }
    });
  }

  initMap(){
    this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });
    var self = this;
    // self.locateAddr(self.default.x, self.default.y);
    if('undefined' != typeof baidumap_location){
      baidumap_location.getCurrentPosition(function(result){
        self.latitude=result.latitude;
        self.longitude=result.longitude;
        // alert(self.latitude+"/"+self.longitude);
        self.locateAddr(self.longitude,self.latitude);
      }, function (error) {
        self.locateAddr(self.default.x, self.default.y);
      });
    }
  }

  locateAddr(longitude,latitude){
      //alert("我的地址是："+longitude+","+latitude);

      // 百度地图API功能
      var point1 = new BMap.Point(longitude,latitude);
      var self = this;
      this.map.centerAndZoom(point1, 13);
      var icon1 = new BMap.Icon('assets/img/orderDetail/user.png', new BMap.Size(33, 41), {
          anchor: new BMap.Size(5, 22)
      });
      var marker1 = new BMap.Marker(point1);  // 创建标注
      marker1.setIcon(icon1);
      this.map.addOverlay(marker1);               // 将标注添加到地图中
      if(this.recyclesInfoBean.longitude){
          var staffPos={
            mapX:this.recyclesInfoBean.longitude,
            mapY:this.recyclesInfoBean.latitude
          };
          var icon2 = new BMap.Icon('assets/img/orderDetail/staff.png', new BMap.Size(47, 59), {
              anchor: new BMap.Size(5, 22)
          });
          var point2 = new BMap.Point(staffPos.mapX,staffPos.mapY);
          // this.map.centerAndZoom(point2, 13);
          var marker2 = new BMap.Marker(point2);  // 创建标注
          marker2.setIcon(icon2);
          this.map.addOverlay(marker2);               // 将标注添加到地图中
          this.map.addOverlay(marker2);  
          if(parseInt(this.map.getDistance(point1,point2).toFixed(2)).toString().length<2000){
            var level = 16;
          }else{
            var level = 16 - (this.map.getDistance(point1,point2).toFixed(2).toString().length - 4);
          }             // 将标注添加到地图中
          if(parseInt(this.map.getDistance(point1,point2).toFixed(2)).toString().length>2000){
            var transit = new BMap.DrivingRoute(self.map, {renderOptions: {map: self.map}});
            transit.search(point1, point2);
          }
          this.map.centerAndZoom(point2, level);
      }
      this.map.addEventListener('touchstart',function(){ 
        $("#od_map_tip").hide();
        self.touchTime = Math.floor(new Date().getTime());
      });
      this.map.addEventListener('touchend',function(){
        $("#od_map_tip").show();
        (self.duration as any) = Math.floor(new Date().getTime() - self.touchTime); 
        if(self.duration < 100){
          self.mapDetail();
        } 
      });
      //把地址在地图上标出来
      // var geoc = new BMap.Geocoder();
      // geoc.getLocation(point, function(rs){
      //   var addrmsg=rs.address;
      //   //var addComp = rs.addressComponents;  //详细的分省市县街道的信息
      //   //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);

      //   var opts = {
      //     width : 200,     // 信息窗口宽度
      //     height: 50,     // 信息窗口高度
      //   }
      //   var infoWindow = new BMap.InfoWindow("地址:"+addrmsg, opts);  //创建信息窗口对象 
      //   this.map.openInfoWindow(infoWindow,point); //开启信息窗口


      // }); 



    }
    orderNext(){
      if(this.offline == true){
         this.toast('无网络连接，请检查');
         return;
      }

      let confirm = this.alertCtrl.create({
        title: '确认取消订单吗?',
        // message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
        buttons: [
          {
            text: '取消',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: '确认',
            handler: () => {
                let data = {
                   "data":{
                     "orderNo":this.navParams.data.orderNo
                   },
                   "token":this.servicesInfo.token,
                };
                let self = this;
                this.urlService.postDatas(CANCELORDER_URL,data).then(function(resp){
                  if(resp){
                    if(resp.errorinfo == null){
                       self.toast("取消订单成功");
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
        ]
      });
      confirm.present();
    }

  public goodListTitle = ["型号","数量","单价(元)"];

}
