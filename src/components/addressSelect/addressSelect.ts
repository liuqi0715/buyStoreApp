import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { servicesInfo } from"../../providers/service-info";//公共信息
import { interfaceUrls } from "../../providers/serviceUrls"
import { ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
declare var $;
@Component({
    selector: 'address-piker',
    templateUrl: 'addressSelect.html'
})

export class AddressComponent {
    @Output()
    pinkerAdd = new EventEmitter();
    // @Input() isDisappear:boolean;

    hasActivity = true;   //默认不显示活动页面
    skipTime = 5;
    hasSkip = true; //默认没有点击跳过按钮
    text: string;
    addTips = false;
  /**
   * 选择城镇需要的字段
   */
    showPicker = false;
    pickerData = [];
    pickerRegions = [];
    pickerRegionName = null;
    loading = false;
    /**
     * 对选中的样式进行控制
     */
    hasPro = true;
    hasCity = false;
    hasArea = false;
    hasTown = false;
    hasStree = false;
    /**
     * 请选择的出现于隐藏
     * @type {boolean}
     */
    hasSECity = false;
    hasSEArea = false;
    hasSETown = false;
    hasSEStree = false;

    isDisappear = false;//控制显示隐藏
    isEdit = null;

    proSNAME = null;
    citySNAME = null;
    areaSNAME = null;
    townSNAME = null;
    streeSNAME = null;

    active = -1;		//省份选择变色
    activeCity = -1;//城市点击变色
    activeArea = -1;//区域点击变色
    activeStree = -1;//乡镇点击变色
    activeCountry = -1;//街道点击变色

    provinceList=[];
    cityList=[];
    areaList=[];
    streetList=[];
    countryList=[];
    datas={
        provice:"",
        city:"",
        area:"",
        town:"",
        stree:"",
        pickerRegionName:"",
        countryId:""
    }

  constructor(
      public iab: InAppBrowser,
      public servicesInfo: servicesInfo,
      public toastCtrl: ToastController,
      private http: Http,
  ) {
    console.log('Hello AddressComponent Component');
    }
ngOnInit() {
      this.getProvince();
}
toast(actions) {
      let toast = this.toastCtrl.create({
          message: actions,
          duration: 3000,
          position: 'bottom'
      });
      toast.present();
  }
getProvince(){
      let params = {
          "data": {}
      }
      let self = this;
      this.http.post(interfaceUrls.getProvinceList, params)
          .map(res => res.json())
          .subscribe(function (data) {
              if (data.errorinfo == null) {
                  // console.log(self,":this")
                  self.provinceList = data.data.provinceList
                  self.loading = false;
              } else {
                  self.loading = false;
                  self.toast(data.errorinfo.errormessage);
              }
          }, function (err) {
              self.toast("服务器异常，请稍后再试")
          })
  };

touchPickerCancel() {
    this.showPicker = false;
    this.pickerData = [];
    this.pickerRegions = [];
    this.pickerRegionName = null;
}
/**
 * 新的地区选择逻辑
 */
show(isEdit=null){
    this.isDisappear = true;
        if (isEdit!==null) {
            this.addTips = true;
            this.isEdit = isEdit
            if (typeof (this.isEdit) == "string") {
                var PARAMS = JSON.parse(this.isEdit);
            } else {
                var PARAMS = (this.isEdit);
            }
            if (PARAMS.province) {
                this.proSNAME = PARAMS.province;
                console.info(this.proSNAME)
                if (this.provinceList.length) {
                    for (var i = 0; i < this.provinceList.length; i++) {
                        if (this.proSNAME == this.provinceList[i].provinceName) {
                            this.selectPro(this.provinceList[i].provinceName, this.provinceList[i].provinceId, null, this.proSNAME);
                        }
                    }
                }
            }
            if (PARAMS.city) {
                this.citySNAME = PARAMS.city;
            }
            if (PARAMS.district) {
                this.areaSNAME = PARAMS.district;
            }

        }else{
            console.warn(isEdit)
        }
}

hide(){
    this.isDisappear = false;

    this.proSNAME = null;
    this.citySNAME = null;
    this.areaSNAME = null;
    this.townSNAME = null;
    this.streeSNAME = null;

    this.active = -1;		//省份选择变色
    this.activeCity = -1;//城市点击变色
    this.activeArea = -1;//区域点击变色
    this.activeStree = -1;//乡镇点击变色
    this.activeCountry = -1;//街道点击变色

}

provice() {
    $("#address-info").animate({ "margin-left": "0%" }, 300);
    this.hasPro = true;
    this.hasCity = false;
    this.hasArea = false;
    this.hasTown = false;
    this.hasStree = false;
    $(".provice").siblings().removeClass("address-now");
}
city() {
    $("#address-info").animate({ "margin-left": "-100%" }, 300);
    this.hasPro = false;
    this.hasCity = true;
    this.hasArea = false;
    this.hasTown = false;
    this.hasStree = false;
    $(".city").siblings().removeClass("address-now");
}
area() {
    $("#address-info").animate({ "margin-left": "-200%" }, 300);
    this.hasPro = false;
    this.hasCity = false;
    this.hasArea = true;
    this.hasTown = false;
    this.hasStree = false;
    $(".area").siblings().removeClass("address-now");
}
town() {
    $("#address-info").animate({ "margin-left": "-300%" }, 300);
    this.hasCity = false;
    this.hasArea = false;
    this.hasTown = true;
    this.hasStree = false;
    $(".town").siblings().removeClass("address-now");
}
stree() {
    $("#address-info").animate({ "margin-left": "-400%" }, 300);
    this.hasCity = false;
    this.hasArea = false;
    this.hasTown = false;
    this.hasStree = true;
    $(".stree").siblings().removeClass("address-now");
}
/**
 * 选择省份
 * @param pro
 * @param provinceId
 * @private
 */
selectPro(provinceName, provinceId, isClick,location=null) {
    console.info(location, '===')
    $("#address-info").animate({ "margin-left": "-100%" });
    this.loading = true;

    this.hasPro = false;
    this.hasCity = true;
    this.hasArea = false;
    this.hasTown = false;
    this.hasStree = false;

    this.hasSECity = true;
    this.hasSEArea = false;
    this.hasSETown = false;
    this.hasSEStree = false;
    if (this.isEdit == null || this.isEdit == undefined || isClick != null) {
        this.citySNAME = null;
        this.areaSNAME = null;
        this.townSNAME = null;
        this.streeSNAME = null;

        this.activeCity = -1;//城市点击变色
        this.activeArea = -1;//区域点击变色
        this.activeStree = -1;//乡镇点击变色
        this.activeCountry = -1;//街道点击变色
    } else {
        if (typeof (this.isEdit) == "string") {
            var PARAMS = JSON.parse(this.isEdit);
        } else {
            var PARAMS = (this.isEdit);
        }
        this.proSNAME = PARAMS.province;
        this.citySNAME = PARAMS.city;
        this.areaSNAME =  PARAMS.district;
        // this.townSNAME = PARAMS.streetName;
        // this.streeSNAME = PARAMS.countryName
    }
    this.active = provinceId;
    this.proSNAME = provinceName;
    let params = {
        "data": {
            "provinceId": "" +provinceId + ""
        }
    }
    let self = this;
    this.http.post(interfaceUrls.getCityList, params)
        .map(res => res.json())
        .subscribe(function (data) {
            if (data.errorinfo == null) {
                self.cityList = data.data.cityList
                if (location!==null) {

                    if (self.cityList.length) {
                        for (var i = 0; i < self.cityList.length; i++) {
                            if (self.citySNAME==self.cityList[i].cityName) {
                                self.selectCity(self.cityList[i].cityName, self.cityList[i].cityId, null, self.citySNAME);
                                console.info('location', location)
                            }else{

                            }
                        }
                    }
                }
                self.loading = false;
            } else {
                self.loading = false;
                self.toast(data.errorinfo.errormessage);
            }
        }, function (err) {
            self.toast("服务器异常，请稍后再试")
        })
}

/**
 * 点击城市获取区域	areaList
 * @param city
 * @param cityId
 * @private
 */
selectCity(cityName, cityId, isClick,location=null) {
    this.loading = true;
    this.hasPro = false;
    this.hasCity = false;
    this.hasArea = true;
    this.hasTown = false;
    this.hasStree = false;

    this.hasSECity = true;
    this.hasSEArea = true;
    this.hasSETown = false;
    this.hasSEStree = false;

    if (this.isEdit == null || this.isEdit == undefined || isClick != null) {
        this.areaSNAME = null;
        this.townSNAME = null;
        this.streeSNAME = null;

        this.activeArea = -1;//区域点击变色
        this.activeStree = -1;//乡镇点击变色
        this.activeCountry = -1;//街道点击变色
    } else {
        if (typeof (this.isEdit) == "string") {
            var PARAMS = JSON.parse(this.isEdit);
        } else {
            var PARAMS = (this.isEdit);
        }
        this.proSNAME = PARAMS.province;
        this.citySNAME = PARAMS.city;
        this.areaSNAME =  PARAMS.district;
        // this.townSNAME = PARAMS.streetName;
        // this.streeSNAME = PARAMS.countryName
    }
    this.citySNAME = cityName;
    this.activeCity = cityId;
    $("#address-info").animate({ "margin-left": "-200%" });
    let params = {
        "data": {
            "cityId": "" +cityId + ""
        }
    }
    let self = this;
    this.http.post(interfaceUrls.getAreaList, params)
        .map(res => res.json())
        .subscribe(function (data) {
            if (data.errorinfo == null) {
                self.areaList = data.data.areaList
                if (location!==null) {
                    if (self.areaList.length) {
                        for (var i = 0; i < self.areaList.length; i++) {
                            if (self.areaSNAME == self.areaList[i].areaName) {
                                self.selectArea(self.areaList[i].areaName, self.areaList[i].areaId,null);
                                console.info('location', location)
                            }else{

                            }
                        }
                    }
                }
                self.loading = false;
            } else {
                self.loading = false;
                self.toast(data.errorinfo.errormessage);
            }
        }, function (err) {
            self.toast("服务器异常，请稍后再试")
        }
        )
}
selectArea(areaName, areaId, isClick){
    this.loading = true;
    this.hasPro = false;
    this.hasCity = false;
    this.hasArea = false;
    this.hasTown = true;
    this.hasStree = false;

    this.hasSECity = true;
    this.hasSEArea = true;
    this.hasSETown = true;
    this.hasSEStree = false;
    this.activeArea = areaId;//区域点击变色
    if (this.isEdit == null || this.isEdit == undefined || isClick != null) {
        this.townSNAME = null;
        this.streeSNAME = null;
        this.activeStree = -1;//乡镇点击变色
        this.activeCountry = -1;//街道点击变色
    } else {
        if (typeof (this.isEdit) == "string") {
            var PARAMS = JSON.parse(this.isEdit);
        } else {
            var PARAMS = (this.isEdit);
        }
        this.proSNAME = PARAMS.province;
        this.citySNAME = PARAMS.city;
        this.areaSNAME =  PARAMS.district;
        // this.townSNAME = PARAMS.streetName;
        // this.streeSNAME = PARAMS.countryName;
    }
    $("#address-info").animate({ "margin-left": "-300%" });
    this.areaSNAME = areaName;
    let params = {
        "data": {
            "areaId": "" +areaId + ""
        }
    }
    let self = this;
    this.http.post(interfaceUrls.getStreetList, params)
        .map(res => res.json())
        .subscribe(function (data) {
            if (data.errorinfo == null) {
                self.streetList = data.data.streetList
                self.addTips = false;
                self.loading = false;
            } else {
                self.loading = false;
                self.toast(data.errorinfo.errormessage);
            }
        }, function (err) {
            self.toast("服务器异常，请稍后再试")
        })
}

selectTown(stName, stId, isClick) {
    this.loading = true;

    this.hasPro = false;
    this.hasCity = false;
    this.hasArea = false;
    this.hasTown = false;
    this.hasStree = true;

    this.hasSECity = true;
    this.hasSEArea = true;
    this.hasSETown = true;
    this.hasSEStree = true;
    this.activeStree = stId;//乡镇点击变色
    $("#address-info").animate({ "margin-left": "-400%" });
    this.townSNAME = stName;
    if (this.isEdit == null || this.isEdit == undefined || isClick != null) {
        this.streeSNAME = null;
        this.activeCountry = -1;//街道点击变色
    } else {
        if (typeof (this.isEdit) == "string") {
            var PARAMS = JSON.parse(this.isEdit);
        } else {
            var PARAMS = (this.isEdit);
        }
        this.proSNAME = PARAMS.province;
        this.citySNAME = PARAMS.city;
        this.areaSNAME =  PARAMS.district;
        // this.townSNAME = PARAMS.streetName;
        // this.streeSNAME = PARAMS.countryName;
    }
    let params = {
        "data": {
            "streetId": "" + stId + ""
        }
    }
    let self = this;
    this.http.post(interfaceUrls.getCountryList, params)
        .map(res => res.json())
        .subscribe(function (data) {
            if (data.errorinfo == null) {
                // console.log(self,":this")
                self.countryList = data.data.countryList
                self.loading = false;
            } else {
                self.loading = false;
                self.toast(data.errorinfo.errormessage);
            }
        }, function (err) {
            self.toast("服务器异常，请稍后再试")
        })
}
selectCountry(countryName, countryId) {
    this.streeSNAME = countryName;
    this.datas.countryId = countryId;
    this.streeSNAME = countryName;
    this.datas.pickerRegionName = this.proSNAME + this.citySNAME + this.areaSNAME + this.townSNAME + this.streeSNAME;
    this.datas.provice = this.proSNAME;

    this.datas.city = this.citySNAME;
    this.datas.area = this.areaSNAME;
    this.datas.town = this.townSNAME;
    this.datas.stree = this.streeSNAME;
    this.pinkerAdd.emit(this.datas);
    this.isDisappear = false;


    this.proSNAME = null;
    this.citySNAME = null;
    this.areaSNAME = null;
    this.townSNAME = null;
    this.streeSNAME = null;

    this.active = -1;		//省份选择变色
    this.activeCity = -1;//城市点击变色
    this.activeArea = -1;//区域点击变色
    this.activeStree = -1;//乡镇点击变色
    this.activeCountry = -1;//街道点击变色
}

}
