// export const GOODLIST_URL = 'http://rapapi.org/mockjsdata/18396/api/discove/goodlist';
// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.SELLINFO_URL = 'http://192.168.0.16:6020/home/getView';


// const urls = "http://120.79.117.124/storeApp";
const urls = "http://192.168.0.156/storeApp";    //李子

export const SELLINFO_URL = urls+'/home/getView';
export const SELLORDER_URL =  urls+'/orderInfoController/selectOrder';
export const SELLORDERDETAIL_URL =  urls+'/orderInfoController/selectOrderDetialPre';
export const SELLORDERDETAIL1_URL =  urls+'/orderInfoController/selectOrderDetialRec';
export const ORDERBORN_URL =  urls+'/ReportOrder/clickReportOrder';
export const COMMENT_URL =  urls+'/evaluate/getCommType';
export const COMMENTSUBMIT_URL =  urls+'/evaluate/addEvaluate';
export const CANCELORDER_URL =  urls+'/orderInfoController/undoOrder';
export const CONFIRMORDER_URL =  urls+'/orderInfoController/confirOrder';
export const RELEASEORDER_URL =  urls+'/ReportOrder/releaseOrder';
export const FILEUPLOAD_URL =  urls+'/fileUploadController/uploadImage';
export const ORDERLIST_URL =  urls+'/ReportOrder/getOrderList';
export const MSG_URL =  urls+'/message/getMsgList';
export const EDITPW_URL =  urls+'/storeInfo/updatePwd';
export const BASICINFO_URL =  urls+'/storeInfo/searchInfo';
export const MSGDETAILS_URL =  urls+'/message/getMessageDetails';
export const UPDATEREGID_URL =  urls+'/login/upteStoreRegId';
export const APPUPDATE_URL = "http://www.buypb.cn/softDownLoad/xdllstore.apk";
export const APPCONFIG_URL =  urls+"/login/getVerCode";
export const PAGEJUMP_URL =  urls+"/message/pageJump";
export const PRICELIST_URL = urls + "/price/getRecylePrice";
export const SIGNINFO_URL = urls+"/login/addSigninInfo";
export const GETRECYCLEMEN_URL = urls+'/ReportOrder/getPriceSendRecycle';
