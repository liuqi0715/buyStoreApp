
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform} from 'ionic-angular';

import {ChangeDetectorRef} from'@angular/core'
import{interfaceUrls} from "../../providers/serviceUrls"
import {Http,Headers} from '@angular/http';
import{UserRegister} from "../user-register/user-register "
import{servicesInfo} from "../../providers/service-info"
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AddressComponent} from '../../components/addressSelect/addressSelect';
declare var BMap:any; //declare var AMap: any;
declare var baidumap_location:any;
declare var $: any;//引入jq
@Component({
    selector: 'page-UserRegAddress',
    templateUrl: 'UserRegAddress.html',
})

export class UserRegAddress {
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild("Address") AddressCom: AddressComponent;
    constructor(public navCtrl: NavController,
                private platform: Platform,
                private network: Network,
                private cdr: ChangeDetectorRef,
                private http: Http,
                public servicesInfo: servicesInfo,
                public toastCtrl: ToastController,
                )
        {

        };

    
    code: string; //城市编码
    addressInfo;
    map:any;
    default:any= {"x":114.06667,"y":22.61667};
    addresInfo2="";
    offline:boolean=false;
    isEdit=null;
    addTips = true;
    pcar=null;
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
        imageSize:new BMap.Size(20, 20)		//图标的大小
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
      addresInfo2 = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
      console.info('tag', addComp)
      if (addComp.province!="" && addComp.city!="" && addComp.district!=""){
        self.isEdit = addComp
       
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
        map.centerAndZoom(point, 15);//设置中心和地图显示级别

        // map = new BMap.Map("map");
        // this.locateAddr(this.default.x, this.default.y);
        var self = this;
        if('undefined' != typeof baidumap_location){

          baidumap_location.getCurrentPosition(function(result){
            var latitude=result.latitude;
            var longitude=result.longitude;
            // console.log(latitude,lontitude,"++++");
            // alert(latitude+","+longitude)
            self.locateAddr(longitude,latitude);
          }, function (error) {
            self.locateAddr(this.default.x, this.default.y);
          });
        }else{
          // alert("1")
          self.locateAddr(this.default.x, this.default.y);
          console.log(typeof baidumap_location)
        }



        function showInfo(e){
           this.a = e.point.lng;
           this.b = e.point.lat;
           map.clearOverlays();
           var new_point = new BMap.Point(this.a, this.b);
           var myIcon = new BMap.Icon("assets/img/login/addressIcon.png",new BMap.Size(20, 20), {
               anchor: new BMap.Size(5, 10),		//图标的定位点相对于图标左上角的偏移值。
               imageSize:new BMap.Size(20, 20)		//图标的大小
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
 let mapY0 = map.getCenter().lng;
 let mapX0 = map.getCenter().lat;
 map.clearOverlays();
 var new_point = new BMap.Point(mapY0, mapX0);
 var myIcon = new BMap.Icon("assets/img/login/addressIcon.png",new BMap.Size(20, 20), {
     anchor: new BMap.Size(5, 22),		//图标的定位点相对于图标左上角的偏移值。
     imageSize:new BMap.Size(20, 20)		//图标的大小
 });

 var marker = new BMap.Marker(new_point,{icon:myIcon});  // 创建标注
 map.addOverlay(marker);              // 将标注添加到地图中

})


    }

  getFiveAddress(){
    this.AddressCom.show(this.isEdit);
  }





  // selectStree(stree, countryId){
  //   this.activeStree = countryId;
  //    let self = this;
  //     self.servicesInfo.areaId = stree.countryId;
  //     $(".stree").text(stree.countryName);
  //     $("#addressFixed").hide();
  //     $("#addressFixed").css({ "display": "none" })
  //     self.realAddress = $(".provice").text()+$(".city").text()+$(".area").text()+$(".twon").text()+$(".stree").text();
  //     self.servicesInfo.pcar = self.realAddress
  //     $("#chose").text(self.realAddress);
  //     self.newAddress = true;
  //  }

   //注册最后一步------
  addressPinker($event) {
    console.log('tag', $event);
    this.servicesInfo.areaId = $event.countryId;
    this.servicesInfo.pcar = $event.pickerRegionName;
    this.pcar = $event.pickerRegionName;
  }
    next(){
      console.log("//",this.servicesInfo.areaId,this.addresInfo2)
      if(this.servicesInfo.areaId==undefined){
        this.toast("您必须选择区域")
      }else if(this.addresInfo2==""){
        this.toast("您必须输入详细地址");
      }else if(this.addresInfo2!=""){
        this.servicesInfo.address = this.addresInfo2;
        console.log(this.servicesInfo.address,this.servicesInfo.longitude,this.servicesInfo.latitude,this.servicesInfo.pcar)
        this.navCtrl.pop();
      }

     }




/*根部的括号*/}
