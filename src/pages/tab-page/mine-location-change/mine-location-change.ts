
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, NavParams} from 'ionic-angular';

import {ChangeDetectorRef} from'@angular/core'
import{interfaceUrls} from "../../../providers/serviceUrls"
import {Http,Headers} from '@angular/http';
import { UserLogin } from "../../../modules/user-login/user-login";
import{servicesInfo} from "../../../providers/service-info"
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { urlService } from "../../../providers/urlService";
import { App } from 'ionic-angular';
import { TabMine } from '../tab-mine-page/tab-mine-page';
declare var BMap:any; //declare var AMap: any;

declare var baidumap_location:any;

declare var $: any;//引入jq

@Component({
  selector: 'page-mine-location',
    templateUrl: 'mine-location-change.html',
})

export class mineLocationChange {
    @ViewChild('map') mapElement: ElementRef;
    constructor(public navCtrl: NavController,
                private platform: Platform,
                private network: Network,
                private cdr: ChangeDetectorRef,
                private http: Http,
                private app: App,
                public navParams: NavParams,
                public urlService: urlService,
                public servicesInfo: servicesInfo,
                public toastCtrl: ToastController,
                )
        {



        // console.log($,":$")
        //  alert(baidumap_location)
        };


    map:any;
    default:any= {"x":114.06667,"y":22.61667};

    offline:boolean=false;
    touchTime: any = 0;
    duration: any = 0;
    changeLatitude = "";//改变后的维度
    changeLongitude = "";//改变后的经度
    /**
     * 对选中的样式进行控制
     */




    ngOnInit(){
        this.loadMap();

    }
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
    ionViewDidEnter(){
      console.log(this.navParams.data.user.longitude)
      this.locateAddr(this.navParams.data.user.longitude, this.navParams.data.user.latitude);
    }
    locateAddr(lontitude,latitude){
      // alert("我的地址是："+lontitude+","+latitude);
      this.servicesInfo.longitude = lontitude;
      this.servicesInfo.latitude = latitude;
      this.map.clearOverlays();
      // 百度地图API功能
      var point = new BMap.Point(lontitude,latitude);
      this.map.centerAndZoom(point, 15);
      // var point2 = new BMap.Point(lontitude, latitude);
      var myIcon = new BMap.Icon("assets/img/login/addressIcon.png",new BMap.Size(33, 41), {
        anchor: new BMap.Size(5, 22),		//图标的定位点相对于图标左上角的偏移值。
        imageSize: new BMap.Size(25, 30)		//图标的大小
      });
      var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
      this.map.addOverlay(marker);          // 将标注添加到地图中

      //把地址在地图上标出来
      var geoc = new BMap.Geocoder();
      var addresInfo2;

      var self = this;

      geoc.getLocation(point, function(rs){

      var addrmsg=rs.address;
      var addComp = rs.addressComponents;  //详细的分省市县街道的信息
      // console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);

      addresInfo2 = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
      //  self.addresInfo2 = addresInfo2;
      // console.log(addresInfo2,"1");
      if (addComp.province!="" && addComp.city!="" && addComp.district!=""){







      }


      return addresInfo2;
      });
    }


    loadMap(){
        // console.log("11",this)
        let map = this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });//创建地图实例

        // let map = new BMap.Map("map");

        map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
        map.enableContinuousZoom();//连续缩放效果，默认禁用
        let point = new BMap.Point(114.066112, 22.548515);//坐标可以通过百度地图坐标拾取器获取
        map.centerAndZoom(point, 18);//设置中心和地图显示级别

        // map = new BMap.Map("map");
        // this.locateAddr(this.default.x, this.default.y);
        var self = this;
        if('undefined' != typeof baidumap_location){

          // baidumap_location.getCurrentPosition(function(result){
          //   var latitude=result.latitude;
          //   var longitude=result.longitude;;
          //   // console.log(latitude,lontitude,"++++");
          //   // alert(latitude+","+longitude)
          //   self.changeLatitude = result.latitude;
          //   self.changeLongitude = result.longitude;
          //   self.locateAddr(longitude,latitude);
          // }, function (error) {
          //   self.locateAddr(this.default.x, this.default.y);
          // });
        }else{
          // alert("1")
          // self.locateAddr(this.default.x, this.default.y);
          // console.log(typeof baidumap_location)
        }



        function showInfo(e){
          this.a = e.point.lng;
           this.b = e.point.lat;

          //  self.servicesInfo.longitude = this.a;
          //  self.servicesInfo.latitude = this.b;

           map.clearOverlays();
           var new_point = new BMap.Point(this.a, this.b);
           var myIcon = new BMap.Icon("assets/img/login/addressIcon.png", new BMap.Size(33, 41), {
             anchor: new BMap.Size(5, 22),		//图标的定位点相对于图标左上角的偏移值。
             imageSize: new BMap.Size(25, 30)		//图标的大小
           });

           var marker = new BMap.Marker(new_point,{icon:myIcon});  // 创建标注
           map.addOverlay(marker);              // 将标注添加到地图中
           map.panTo(new_point);
        //    map.setZoom(18);	//定位后自动放大
           map.centerAndZoom(new_point, 12);//设置中心和地图显示级别



//点击之后获取详细的地址信息

 //把地址在地图上标出来
         var geoc = new BMap.Geocoder();
         var addresInfo2;
         geoc.getLocation(new_point, function(rs){

         var addrmsg=rs.address;
         var addComp = rs.addressComponents;  //详细的分省市县街道的信息
        //  console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
         if(addComp.streetNumber==""){
            addresInfo2 = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street;
         }else{
            addresInfo2 = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
         }
         self.cdr.detectChanges();

         return addresInfo2;
         });





        }

        // map.addEventListener("click", showInfo);


/*-----------------------------------------------地图拖动--------------------------------------------*/

    map.addEventListener('dragend', function(){
      // console.log("地图被拖动了+++++++++++++++++++++++");
      // console.log("当前地图中心点：" + map.getCenter().lng + "," + map.getCenter().lat);
              // 将标注添加到地图中
      self.changeLatitude = "";
      self.changeLongitude = "";
      let mapY0 = map.getCenter().lng;
      let mapX0 = map.getCenter().lat;
      console.log(mapY0, mapX0)
      map.clearOverlays();
      var new_point = new BMap.Point(mapY0, mapX0);
      var myIcon = new BMap.Icon("assets/img/login/addressIcon.png", new BMap.Size(33, 41), {
        anchor: new BMap.Size(5, 22),		//图标的定位点相对于图标左上角的偏移值。
        imageSize: new BMap.Size(25, 30)		//图标的大小
      });

      var marker = new BMap.Marker(new_point, { icon: myIcon });  // 创建标注
      map.addOverlay(marker);



    })
    map.addEventListener('touchstart', function () {
      $("#od_map_tip").hide();
      self.touchTime = Math.floor(new Date().getTime());
    });
    map.addEventListener('touchend', function (e) {
      $("#od_map_tip").show();
      (self.duration as any) = Math.floor(new Date().getTime() - self.touchTime);
      console.log(self.duration)
      if (self.duration < 500) {
        console.log("dianji ");
        console.log(e.point.lng + "," + e.point.lat)
        self.changeLatitude = e.point.lat;
        self.changeLongitude = e.point.lng;
        map.clearOverlays();
        var new_point = new BMap.Point(e.point.lng, e.point.lat);
        var myIcon = new BMap.Icon("assets/img/login/addressIcon.png", new BMap.Size(33, 41), {
          anchor: new BMap.Size(5, 22),		//图标的定位点相对于图标左上角的偏移值。
          imageSize: new BMap.Size(25, 30)		//图标的大小
        });

        var marker = new BMap.Marker(new_point, { icon: myIcon });  // 创建标注
        map.addOverlay(marker);

      }else{
        console.log("???????")

      }
    });


    }



    setMapEvent() {
    }

    next(){

      let self = this;
      this.urlService.confirm("您只有一次修改的机会，是否确认修改。").then(()=>{
        if (self.changeLatitude == "" || self.changeLongitude=="") {
          self.toast("您还没有选取门店位置坐标。");
        }else{
          let params = {
            data: {
              "latitude": self.changeLatitude,
              "longitude": self.changeLongitude,
            },
            token: this.servicesInfo.token
          }
          this.urlService.postDatas(interfaceUrls.changeLocation, params).then(function (resp) {
            if (resp) {
              if (resp.errorinfo === null) {
                self.toast("修改成功");
                setTimeout(function() {
                  self.navCtrl.popToRoot();
                }, 2000);

              } else {
                self.toast(resp.errorinfo.errormessage);
                if (resp.errorinfo.errorcode == "10003") {
                  self.app.getRootNav().setRoot(UserLogin);
                }
              }
            }
          }).catch(() => {
            self.toast("服务器异常，请稍后再试。");


          });
        }

      }).catch(err=>{

      })
    }

  getLocal(){
    var self = this;
    if ('undefined' != typeof baidumap_location) {

      baidumap_location.getCurrentPosition(function(result){
        var latitude=result.latitude;
        var longitude=result.longitude;;
        // console.log(latitude,lontitude,"++++");
        // alert(latitude+","+longitude)
        // self.changeLatitude = result.latitude;
        // self.changeLongitude = result.longitude;
        self.locateAddr(longitude,latitude);
      }, function (error) {
        self.locateAddr(this.default.x, this.default.y);
      });
    } else {
      // alert("1")
      self.locateAddr(this.default.x, this.default.y);
      console.log(typeof baidumap_location)
    }
  }




/*根部的括号*/}
