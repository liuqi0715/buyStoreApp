import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams,ToastController} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { SELLORDERDETAIL_URL,SELLINFO_URL, SELLORDERDETAIL1_URL, CANCELORDER_URL, CONFIRMORDER_URL} from "../../../providers/Constants";
import { AlertController } from 'ionic-angular';
import{servicesInfo} from"../../../providers/service-info";//公共信息
// declare let cordova:any;
declare var BMap;
declare let baidumap_location: any;

@Component({
  selector: 'order-map-page',
  templateUrl: 'order-map-page.html',
})
export class orderMapPage {

  public map = null;
  public latitude = null;
  public longitude = null;
  default:any= {"x":114.06667,"y":22.61667};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public urlService: urlService,
              public servicesInfo: servicesInfo,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
      ) {
  }

  ionViewDidEnter() {
    this.initMap();
  }

  initMap(){
    this.map = new BMap.Map("map1");
    var self = this;
    var geolocationControl = new BMap.GeolocationControl();
    this.map.addControl(new BMap.NavigationControl());
    var latitude = this.navParams.data.latitude;
    var longitude = this.navParams.data.longitude;
    this.locateAddr(longitude,latitude);

    geolocationControl.addEventListener("locationSuccess", function(e){
        var evt:any = e;
        if('undefined' != typeof baidumap_location){
          baidumap_location.getCurrentPosition(function(result){
            self.latitude=result.latitude;
            self.longitude=result.longitude;
            // alert(self.latitude+"/"+self.longitude);
            self.locateAddr(self.longitude,self.latitude);
          }, function (error) {
            self.locateAddr(evt.point.lng, evt.point.lat);
          });
        }
    });

    geolocationControl.addEventListener("locationError",function(e){
       var evt:any = e;
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

    });
    this.map.addControl(geolocationControl);
  }

  locateAddr(longitude,latitude){
      //alert("我的地址是："+longitude+","+latitude);

      // 百度地图API功能

      this.map.clearOverlays();
      console.log(longitude+","+latitude);
      var point1 = new BMap.Point(longitude,latitude);
      this.map.centerAndZoom(point1, 12);
      var icon1 = new BMap.Icon('assets/img/orderDetail/user.png', new BMap.Size(33, 41), {
          anchor: new BMap.Size(5, 22)
      });
      var marker1 = new BMap.Marker(point1);  // 创建标注
      marker1.setIcon(icon1);
      this.map.addOverlay(marker1);               // 将标注添加到地图中
      if(this.navParams.data.staff.longitude){
          var staffPos={
            mapX:this.navParams.data.staff.longitude,
            mapY:this.navParams.data.staff.latitude
          };
          var icon2 = new BMap.Icon('assets/img/orderDetail/staff.png', new BMap.Size(47, 59), {
              anchor: new BMap.Size(5, 22)
          });
          var point2 = new BMap.Point(staffPos.mapX,staffPos.mapY);
          // this.map.centerAndZoom(point2, 13);
          var marker2 = new BMap.Marker(point2);  // 创建标注
          var self = this;
          marker2.setIcon(icon2);
          this.map.addOverlay(marker2);  
          if(parseInt(this.map.getDistance(point1,point2).toFixed(2)).toString().length<2000){
            var level = 16;
          }else{
            var level = 16 - (this.map.getDistance(point1,point2).toFixed(2).toString().length - 4);
          }
          if(parseInt(this.map.getDistance(point1,point2).toFixed(2)).toString().length>2000){
            var transit = new BMap.DrivingRoute(self.map, {renderOptions: {map: self.map}});
            transit.search(point1, point2);
          }             // 将标注添加到地图中
          this.map.centerAndZoom(point2, level);
      }
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

}
