
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform} from 'ionic-angular';

import {ChangeDetectorRef} from'@angular/core'
import{interfaceUrls} from "../../providers/serviceUrls"
import {Http,Headers} from '@angular/http';
import{UserRegister} from "../user-register/user-register "
import{servicesInfo} from "../../providers/service-info"
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
declare var BMap:any; //declare var AMap: any;

declare var baidumap_location:any;

declare var $: any;//引入jq

@Component({
    selector: 'page-UserRegAddress',
    templateUrl: 'UserRegAddress.html',
})

export class UserRegAddress {
    @ViewChild('map') mapElement: ElementRef;
    constructor(public navCtrl: NavController,
                private platform: Platform,
                private network: Network,
                private cdr: ChangeDetectorRef,
                private http: Http,
                public servicesInfo: servicesInfo,
                public toastCtrl: ToastController,
                )
        {



        // console.log($,":$")
        //  alert(baidumap_location)
        };

    cityData: any[]; //城市数据
    cityName: string = '请选择您的城市'; //初始化城市名
    code: string; //城市编码
    areadata: any;
    addressInfo;
    map:any;
    default:any= {"x":114.06667,"y":22.61667};
    addresInfo2="";

    loading = true;  //数据没有加载出来显示loading
    provinceList;//五级联动省份----
    cityList;    //五级联动市区-----
    areaList;    //五级联动区域----
    townList;    //五级电动乡列表---
    streeList;    //五级联动村的列表---

    realAddress;  //最终五级联系再一起----
    newAddress=true;    //关闭以后重置页面
    offline:boolean=false;

    hasCity=false;
    hasArea=false;
    hasTown=false;
    hasStree=false;
    /**
     * 对选中的样式进行控制
     */
    hasPro2=true;
    hasCity2=false;
    hasArea2=false;
    hasTown2=false;
    hasStree2=false;

    active = -1;
    activeCity = -1;//城市点击变色
    activeArea = -1;//区域点击变色
    activeTown = -1;//乡镇点击变色
    activeStree = -1;//街道点击变色



    timer1; //    三个定时器
    timer2;
    timer3;

    addTips = true;
    ngOnInit(){
        this.loadMap();
        this.fiveAddress()
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

      // console.log(this.map,"?????")
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
      // console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);

      addresInfo2 = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
      //  self.addresInfo2 = addresInfo2;
      // console.log(addresInfo2,"1");
      if (addComp.province!="" && addComp.city!="" && addComp.district!=""){

          self.fiveAddress();
     self.timer1 = setTimeout(function () {
            if (self.provinceList.length){
              for (var i = 0; i < self.provinceList.length; i++) {
                if (addComp.province == self.provinceList[i].provinceName) {
                  self.selectPro(self.provinceList[i], self.provinceList[i].provinceId);
                  // console.info('tag', self.provinceList)
                }
              }
            }else{
              self.addTips = false;
            }

          }, 1000);

      self.timer2 = setTimeout(function () {
            if (self.cityList.length){
              for (var i = 0; i < self.cityList.length; i++) {
                if (addComp.city == self.cityList[i].cityName) {
                  self.selectCity(self.cityList[i], self.cityList[i].cityId);

                  // console.info('tag', self.cityList)

                }
              }
            }else{
              self.addTips = false;
            }

          }, 2000);

      self.timer3 = setTimeout(function () {
            if (self.areaList.length){
              for (var i = 0; i < self.areaList.length; i++) {
                if (addComp.district == self.areaList[i].areaName) {
                  self.selectArea(self.areaList[i], self.areaList[i].areaId);
                }
              }
            }
            self.addTips = false;
          }, 3000);
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

          //  self.servicesInfo.longitude = this.a;
          //  self.servicesInfo.latitude = this.b;

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


        // self.addresInfo2 = addresInfo2;

        //  console.log(addresInfo2,"12");
        //  console.log(self.addresInfo2,"nowadd")

        //  self.cdr.markForCheck();
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



    setMapEvent() {
    //     let sizeMap = new BMap.Size(10, 80);//显示位置
    //    this.map.addControl(new BMap.NavigationControl({
    //       anchor: BMAP_ANCHOR_BOTTOM_RIGHT,//显示方向
    //       offset: sizeMap
    //     }));
    }




    findPasswordCode(){

    }

    getFiveAddress(){
      $("#addressFixed").show();
    }
   fiveAddress(){

    this.newAddress = true;
    if (this.activeCity != -1 && this.servicesInfo.areaId == null){
      this.hasTown = true;
      this.hasPro2 = false;
    } else if (this.servicesInfo.areaId != null){
      this.hasPro2 = false;
      // this.hasTown = true;
    }



    $(".toogle-address").animate({"bottom":"0px"},500);

    // console.log(this.newAddress,"chulai");
    let params={
      "data":{}
    }
      let self = this;
      this.http.post(interfaceUrls.getProvinceList,params)
      .map(res => res.json())
      .subscribe(function (data) {
          if(data.errorinfo==null){
            // console.log(self,":this")
            self.provinceList =  data.data.provinceList
            self.loading = false;
          }else{
            self.loading = false;
            self.toast(data.errorinfo.errormessage);
          }
        }, function (err) {
          self.toast("服务器异常，请稍后再试")
        }
    )
}
  provice(){
    $("#address-info").animate({"margin-left":"0%"},300);
    $(".provice").addClass("address-now");
    $(".provice").siblings().removeClass("address-now");
  }
  city(){
    $("#address-info").animate({"margin-left":"-100%"},300);
    $(".city").addClass("address-now");
    $(".city").siblings().removeClass("address-now");
  }
  area(){
    $("#address-info").animate({"margin-left":"-200%"},300);
    $(".area").addClass("address-now");
    $(".area").siblings().removeClass("address-now");
  }
  town(){
    $("#address-info").animate({"margin-left":"-300%"},300);
    $(".town").addClass("address-now");
    $(".town").siblings().removeClass("address-now");
  }
  stree(){
    $("#address-info").animate({"margin-left":"-400%"},300);
    $(".stree").addClass("address-now");
    $(".stree").siblings().removeClass("address-now");
  }
  //重新加载页面

  reLoad(){

    $("#addressFixed").hide();
    $("#addressFixed").css({"display":"none"})
    // this.hasPro2 = true;
    // $(".toogle-address").css({"bottom":"-6rem"});
    // $("#address-info").animate({ "margin-left": "0%" }, 300);
    // $(".provice").addClass("address-now");
    // $(".provice").siblings().removeClass("address-now");
    // this.newAddress = false;
  }
  //点击省份获取市区
  selectPro(proId, provinceId){
    clearTimeout(this.timer1)
    this.hasPro2=false;
    this.hasCity2=true;
    this.hasArea2=false;
    this.hasTown2=false;
    this.hasStree2=false;


    this.hasCity=true;
    $(".city").addClass("address-now");
    $(".city").siblings().removeClass("address-now");
    // console.log($(".city").text())
      /**
       * 如果用户重新选择重置掉地址。
       */
    this.hasArea = false;

    this.hasTown = false;
    this.hasStree = false;
    $(".city").text("请选择");
    $(".area").text("请选择");
    $(".town").text("请选择");
    $(".stree").text("请选择");
    this.active = provinceId;
    $(".provice").text(proId.provinceName);
    $("#address-info").animate({"margin-left":"-100%"});
    // console.log($(".city").text())
      this.loading = true;
      let params = {
        "data":{
          "provinceId": "" + proId.provinceId+""
        }
      }
      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
       }

      let self = this;
      this.http.post(interfaceUrls.getCityList,params)
      .map(res => res.json())
      .subscribe(function (data) {
          if(data.errorinfo==null){

            self.cityList =  data.data.cityList
            self.loading = false;
            // console.log(self.cityList,":this")
          }else{
            self.loading = false;
            self.toast(data.errorinfo.errormessage);
          }
        }, function (err) {
          self.toast("服务器异常，请稍后再试")
        }
    )
   }
//点击城市获取县区
  selectCity(city,cityId){
    clearTimeout(this.timer2)
    this.hasPro2=false;
    this.hasCity2=false;
    this.hasArea2=true;
    this.hasTown2=false;
    this.hasStree2=false;
        /**
         * 如果用户重新选择重置掉地址；
         */
        this.hasTown = false;
        this.hasStree = false;

        $(".area").text("请选择");
        $(".town").text("请选择");
        $(".stree").text("请选择");

        this.activeCity = cityId;   //点击当前变色

        // $($event.target).css({"color":"red"});
        // $($event.target).siblings().css({"color":"black"})


        this.hasArea=true;

        $(".city").text(city.cityName);
        $("#address-info").animate({"margin-left":"-200%"});

        $(".area").addClass("address-now");
        $(".area").siblings().removeClass("address-now");


      this.loading = true;
       if(this.offline == true){
              this.toast('无网络连接，请检查');
              return;
       }
        let params = {
          "data":{
            "cityId":""+city.cityId+""
          }
        }
        let self = this;
        this.http.post(interfaceUrls.getAreaList,params)
        .map(res => res.json())
        .subscribe(function (data) {
            if(data.errorinfo==null){

              self.areaList =  data.data.areaList
              self.loading = false;
              // console.log(self.areaList,":this")
            }else{
              self.loading = false;
              self.toast(data.errorinfo.errormessage);
            }
          }, function (err) {
            self.toast("服务器异常，请稍后再试")
          }
      )
   }

//点击县区获取乡镇

  selectArea(area, areaId){
    clearTimeout(this.timer3)
    this.hasPro2=false;
    this.hasCity2=false;
    this.hasArea2=false;
    this.hasTown2=true;
    this.hasStree2=false;
      /**
       * 如果用户重新选择县，重置掉地址
       */
      $(".town").text("请选择");
      $(".stree").text("请选择");
      this.hasStree = false;

      // $($event.target).css({"color":"red"});
      // $($event.target).siblings().css({"color":"black"})
      this.activeArea = areaId;
      $(".town").css({"display":"block"})

      this.hasTown=true;

     this.loading = true;
      $("#address-info").animate({"margin-left":"-300%"});
      $(".area").text(area.areaName);

      $(".town").addClass("address-now");
      $(".town").siblings().removeClass("address-now");


      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
       }
      let params = {
        "data":{
          "areaId":""+area.areaId+""
        }
      }
      let self = this;
      this.http.post(interfaceUrls.getStreetList,params)
      .map(res => res.json())
      .subscribe(function (data) {
          if(data.errorinfo==null){
            // console.log(self,":this")
            self.townList =  data.data.streetList
            self.loading = false;
          }else{
            self.loading = false;
            self.toast(data.errorinfo.errormessage);
          }
        }, function (err) {
          self.toast("服务器异常，请稍后再试")
        })

   }
//点击乡镇获取村落
  selectTown(town, stId){
    this.hasPro2=false;
    this.hasCity2=false;
    this.hasArea2=false;
    this.hasTown2=false;
    this.hasStree2=true;


    this.hasStree=true;
    this.activeTown = stId;
    // $($event.target).css({"color":"red"});
    // $($event.target).siblings().css({"color":"black"})



     this.loading = true;
      $("#address-info").animate({"margin-left":"-400%"});
      $(".town").text(town.stName);

      $(".stree").addClass("address-now");
      $(".stree").siblings().removeClass("address-now");
      $(".stree").text("请选择");

      if(this.offline == true){
        this.toast('无网络连接，请检查');
        return;
       }
      // let countryId = town.countryId;
      let params = {
        "data":{
          "streetId":""+town.stId+""
        }
      }
      let self = this;
      this.http.post(interfaceUrls.getCountryList,params)
      .map(res => res.json())
      .subscribe(function (data) {
          if(data.errorinfo==null){
            // console.log(self,":this")
            self.streeList =  data.data.countryList
            self.loading = false;
          }else{
            self.loading = false;
            self.toast(data.errorinfo.errormessage);
          }
        }, function (err) {
          self.toast("服务器异常，请稍后再试")
        })

   }

  selectStree(stree, countryId){
    // this.hasPro2=true;
    this.activeStree = countryId;
    // $($event.target).css({"color":"red"});
    // $($event.target).siblings().css({"color":"black"})

     let self = this;

      // console.log(stree.countryId,"最终需要的ID");
      self.servicesInfo.areaId = stree.countryId;

      $(".stree").text(stree.countryName);
      $("#addressFixed").hide();
      // $(".toogle-address").css({"bottom":"-6rem"});
      $("#addressFixed").css({ "display": "none" })

      self.realAddress = $(".provice").text()+$(".city").text()+$(".area").text()+$(".twon").text()+$(".stree").text();
      self.servicesInfo.pcar = self.realAddress
      // console.log(self.realAddress);
      $("#chose").text(self.realAddress);
      self.newAddress = true;
   }

   //注册最后一步------

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
