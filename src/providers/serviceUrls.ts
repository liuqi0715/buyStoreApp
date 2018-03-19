// http://192.168.0.156:8080/RecycleApp/getRecycleQuotation
// const urls = "http://127.0.0.1:8031";
// http://127.0.0.1:8031/quotation/getRecycleQuotation
// http://127.0.0.1:8031/quotation/getRecycleQuotation

// const urls ="http://192.168.0.13:6020";        
// const urls2 = "http://192.168.0.13:6020";    //李子
const urls5 = "192.168.0.16:6888";    //张
// const urls4 = "http://192.168.0.13:6888";    //添加银行卡

const urls = "http://120.79.117.124/storeApp";        
const urls2 = "http://120.79.117.124/storeApp";    //李子
const urls3 = "http://120.79.117.124/storeApp";    //张
const urls4 = "http://120.79.117.124/storeApp";    //添加银行卡

// const urls3 = "http://192.168.0.45/recycleApp";
export const interfaceUrls = {
    publicOffer : urls+"/quotation/getRecycleQuotation",
    updatePublic : urls+"/quotation/updateRecycleQuotation",    
    login: urls +"/login/login",                        //登录接口
    getCode:urls2+"/storeController/getCheckCode",     //获取验证码
    findPwd:urls+"/login/resetAccountPwd",            //找回密
    addStoreRegistered:urls2+"/storeController/storeRegistered",    //第一步的注册接口
    updStoreRegistered:urls2+"/storeController/updStoreRegistered",    //第二步的注册接口
    uploadImage:urls2+"/fileUploadController/uploadImage",                //上传图片 
    getStoreType:urls2+"/storeController/getStoreType",    //获取店铺类型 
    getProvinceList:urls2+"/storeController/getProvinceList",    //获取省份接口
    getCityList:urls2+"/storeController/getCityList",    //获取市级接口
    getAreaList:urls2+"/storeController/getAreaList",    //获取区县级接口
    getStreetList:urls2+"/storeController/getStreetList",    //获取乡镇接口
    getCountryList:urls2+"/storeController/getCountryList",    //获取村级接口
    personInfo:urls+"/storeInfo/searchInfo",                    //获取个人信息头像等

    /*--------------------------银行部分----------------------*/

    addwithdrawReq:urls3+"/pay/withdrawBillController/addwithdrawReq",    //申请提现 
    getSubAccountAmount:urls3+"/pay/accountInfo/getSubAccountAmount",       //查询余额 
    searchTradeByReqNo:urls3+"/pay/withdrawBillController/searchTradeByReqNo",    //查询交易信息成功或者失败
    getSubAccountBankInfo:urls3+"/pay/accountInfo/getSubAccountBankInfo",            //查询银行卡信
    getAllBankOfHot:urls3+"/pay/accountInfo/getAllBankOfHot",                        //根据热度查询银行卡名称；开户用
    getAccountBillList:urls3+"/pay/accountInfo/getAccountBillList",                //查询交易流水
    updateStoreState:urls+"/storeInfo/updateStoreState",                //临时营业执照
    findPwdCode:urls+"/login/getCheckCode",                            //找回密码验证码
    changePayPwd:urls3+"/pay/accountInfo/updatePwd",                    //修改交易密码
    changePayPhone:urls3+"/pay/accountInfo/updatePhone",                //修改绑定手机号
    addCard:urls4+"/pay/accountInfo/addBank",                            //绑定银行卡
    getAllBank:urls3+"/pay/accountInfo/getAllBank",                        //获取所有的银行卡信息        //*** 可以注释*/
    checkAddCard:urls4+"/pay/accountInfo/getBindingStateByOrgUserId",        //查询帮卡是否成功
    checkBankInfo:urls4+"/pay/accountInfo/getAiBankInfo",                        //根据输入的银行卡号查询银行卡名称
    openAccountQuery:urls2+"/storeInfo/getUserSatatByUserId",            //？？？？？开户查询是否开户
    addUser:urls4+"/pay/accountInfo/addUser",                        //登录开户
    addUserByNoLogin:urls4+"/pay/accountInfo/addUserByNoLogin",        //未登录开户
    openAccountQuery2:urls4+"/pay/accountInfo/openAccountQuery",       //进入钱包查询开户是否
    getBindInformation:urls3+"/pay/accountInfo/getBindInformation",        //查询虚拟卡信息

    /*------------------------------频繁修改处注释用--------------------------------*/
    queryAccCheck:urls+"/pay/accountInfo/queryAccCheck",                    //查询今日提现/充值最大限额；
    // getTenxAiRecognized:"http://192.168.0.13:6888/tenx/getTenxAiRecognized",
    getTenxAiRecognized:urls+"/tenx/getTenxAiRecognized",                    //上传银行卡识别卡号信息
    exitApp:urls+"/storeInfo/deleteToken",                                //退出登录

    /*-------------------------------------修改微信账号-----------------------------*/
    updateWXPhone:urls+"/storeInfo/updateWXPhone",                
}



