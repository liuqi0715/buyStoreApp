import {Injectable} from "@angular/core";

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
    constructor() {
      //  this.token =  localStorage.getItem("token")
    }

}
