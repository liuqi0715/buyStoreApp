import {Injectable} from "@angular/core";
import { NativeStorage } from '@ionic-native/native-storage';
@Injectable()
export class servicesInfo {
    token: any = null;
    userId: any = null;    //用户id
    areaId:any=null;    //区域Id
    longitude:any=null;    //经度
    latitude: any = null;    //纬度
    address: any = null;        //店铺详细地址
    pcar: any = null;        //店铺五级联动
    userPhone: any = null;    //注册人手机号
    stroePerson: any = null;    //店铺注册人姓名
    bankInfo: any = null;        //保存热门/非热门银行信息
    orgId: any = null;
    registerNo="";    //营业执照的注册号
    creditCode="";     //社会统一信用代码

    firmName=null;        //营业执照上面的公司名
    operName=null;        //法人名称


    mobilePhone:any = "";
    pwd:any = "";
    hasRegister = false;
    constructor(
      private nativeStorage: NativeStorage,
    ) {
      //  this.token =  localStorage.getItem("token")
      if (!localStorage.getItem("token")) {
        let self = this;
        this.nativeStorage.getItem('token')
          .then(
          data => {
            if (data.token) {
              self.token = data.token;
              console.log(self.token, "服务中的token");
            } else {
              console.info('UserLogin页面')
            }
          },
          error => {
          }
          );
      }else{
        this.token = localStorage.getItem("token")
      }
      /**
     * 获取用户Id
     */
      if (!localStorage.getItem("userId")) {
        let self = this;
        this.nativeStorage.getItem('token')
          .then(
          data => {
            if (data.userId) {
              self.userId = data.userId;
              console.log(self.userId, "服务中的userId");
            } else {

            }
          },
          error => {
          }
          );
      } else {
        this.userId = localStorage.getItem("userId")
      }
    }

}
