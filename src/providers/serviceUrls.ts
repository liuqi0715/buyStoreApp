

const urls = "http://120.79.117.124/storeApp";
const urlsR = "http://120.79.117.124/news";     //汪湘

// const urls = "http://192.168.0.156/storeApp";    //李子
// const urlsR = "http://192.168.0.156:6100";     //汪湘


// const urls = "http://buypb.e1.luyouxia.net:28708/storeApp"
// const urlsR = "http://buypb.e1.luyouxia.net:28708/news"


export const interfaceUrls = {
    publicOffer : urls+"/quotation/getRecycleQuotation",
    updatePublic : urls+"/quotation/updateRecycleQuotation",
    login: urls +"/login/login",                        //登录接口
    getCode:urls+"/storeController/getCheckCode",     //获取验证码
    findPwd:urls+"/login/resetAccountPwd",            //找回密
    addStoreRegistered:urls+"/storeController/storeRegistered",    //第一步的注册接口
    updStoreRegistered:urls+"/storeController/updStoreRegistered",    //第二步的注册接口

    uploadImage:urls+"/fileUploadController/uploadImage",                //上传图片
    getStoreType: urls+"/storeController/getStoreType",    //获取店铺类型
    getProvinceList: urls+"/storeController/getProvinceList",    //获取省份接口
    getCityList: urls+"/storeController/getCityList",    //获取市级接口
    getAreaList: urls+"/storeController/getAreaList",    //获取区县级接口
    getStreetList: urls+"/storeController/getStreetList",    //获取乡镇接口
    getCountryList: urls+"/storeController/getCountryList",    //获取村级接口
    personInfo: urls+"/storeInfo/searchInfo",                    //获取个人信息头像等

    /*--------------------------银行部分----------------------*/

    addwithdrawReq: urls+"/pay/withdrawBillController/addwithdrawReq",    //申请提现
    getSubAccountAmount: urls+"/pay/accountInfo/getSubAccountAmount",       //查询余额
    searchTradeByReqNo: urls+"/pay/withdrawBillController/searchTradeByReqNo",    //查询交易信息成功或者失败
    getSubAccountBankInfo: urls+"/pay/accountInfo/getSubAccountBankInfo",            //查询银行卡信
    getAllBankOfHot: urls+"/pay/accountInfo/getAllBankOfHot",                        //根据热度查询银行卡名称；开户用
    getAccountBillList: urls+"/pay/accountInfo/getAccountBillList",                //查询交易流水
    updateStoreState:urls+"/storeInfo/updateStoreState",                //临时营业执照
    findPwdCode:urls+"/login/getCheckCode",                            //找回密码验证码
    changePayPwd: urls+"/pay/accountInfo/updatePwd",                    //修改交易密码
    changePayPhone: urls+"/pay/accountInfo/updatePhone",                //修改绑定手机号
    addCard: urls+"/pay/accountInfo/addBank",                            //绑定银行卡
    getAllBank: urls+"/pay/accountInfo/getAllBank",                        //获取所有的银行卡信息        //*** 可以注释*/
    checkAddCard: urls+"/pay/accountInfo/getBindingStateByOrgUserId",        //查询帮卡是否成功
    checkBankInfo: urls+"/pay/accountInfo/getAiBankInfo",                        //根据输入的银行卡号查询银行卡名称
    openAccountQuery: urls+"/storeInfo/getUserSatatByUserId",            //？？？？？开户查询是否开户
    addUser:urls+"/pay/accountInfo/addUser",                        //登录开户
    addUserByNoLogin: urls+"/pay/accountInfo/addUserByNoLogin",        //未登录开户
    openAccountQuery2: urls+"/pay/accountInfo/openAccountQuery",       //进入钱包查询开户是否
    getBindInformation: urls+"/pay/accountInfo/getBindInformation",        //查询虚拟卡信息

    /*------------------------------频繁修改处注释用--------------------------------*/
    queryAccCheck:urls+"/pay/accountInfo/queryAccCheck",                    //查询今日提现/充值最大限额；
    // getTenxAiRecognized:"http://192.168.0.13:6888/tenx/getTenxAiRecognized",
    getTenxAiRecognized:urls+"/pay/tenx/getTenxAiRecognized",                    //上传银行卡识别卡号信息
    exitApp:urls+"/storeInfo/deleteToken",                                //退出登录

    /*-------------------------------------修改微信账号-----------------------------*/
    updateWXPhone:urls+"/storeInfo/updateWXPhone",
    addSigninInfo:urls+"/login/addSigninInfo",
    /*--------------------------------------新闻阅读评论部分------------------------------*/
    getNewsList: urlsR +"/tabContent/contentMain",      //新闻阅读列表
    getNewsDetail: urlsR +"/tabContent/queryById",        //获取新闻详情
    addCommentConnet: urlsR +"/tabComments/insert",       //新增评论或者回复接口
    likeThisComment: urlsR +"/tabPointGoods/insert",      //点赞评论
    getTabCommentsPage: urlsR +"/tabComments/getTabCommentsPage", //根据内容获取评论
    getReplyTabCommentsPage: urlsR +"/tabComments/getReplyTabCommentsPage", //获取评论里的回复数据
    queryTabColumnList: urlsR +"/tabColumn/queryTabColumn",              //查询顶部栏目
    getCouponList: urls +"/acticity/queryCoupon",       //获取
    changeLocation: urls +"/storeInfo/modifiedAddress",    //修改地理坐标

}



