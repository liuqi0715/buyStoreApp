import {Injectable} from "@angular/core";

@Injectable()
export class servicesInfo {
    token:any;
    userId:any;    //用户id
    areaId:any;    //区域Id
    longitude:any;    //经度
    latitude:any;    //纬度
    address:any;        //店铺详细地址
    pcar:any;        //店铺五级联动
    userPhone:any;    //注册人手机号
    stroePerson:any;    //店铺注册人姓名
    bankInfo:any;        //保存热门/非热门银行信息
    orgId:any;
    registerNo="";    //营业执照的注册号
    creditCode="";     //社会统一信用代码
    
    firmName=null;        //营业执照上面的公司名
    operName=null;        //法人名称
    constructor() {
       this.token =  localStorage.getItem("token")
    }
    
}