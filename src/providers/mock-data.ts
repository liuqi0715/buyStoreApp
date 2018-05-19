import { Injectable } from "@angular/core";
import { NativeStorage } from '@ionic-native/native-storage';
@Injectable()
export class mockDataInfo {
   constructor() {}
  newsList = [
    {
      id: 1,
      title: "三个小图",
      listHtml: "<div class='item_detail'><h3 class='dotdot line3' > 赵雷首次在演出现场崩溃，大骂主办方：再这样下去我就废了！</h3><div class='list_image' ><ul class='clearfix' ><li class='list_img_holder' > <img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li><li class='list_img_holder' > <img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li><li class='list_img_holder'><img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li></ul></div> <div class='item_info' ><div><span class='src space' > 果酱音乐 </span><span class='cmt space' >评论831</span><span class='time' title= '2017-05-03 20:43' > 18分钟前</span><span  class='dislike-news fr'></span></div></div> </div>"
    },
    {
    id:1,
    title:"一个小图",
    listHtml: "<div class='item_detail desc'><h3 class='dotdot line3 image-margin-right' > 罗永强任应急管理部消防局副局长，哦哦哦歐尼就哦【朋發就安部消防局副局长</h3 ><div class='item_info oneline'><div><span class='src space' > 油价汽油柴油查询 </span><span class='cmt space' >评论5</span><span class='time' title= '2017-05-03 20:43' > 15分钟前</span><span ' class='dislike-news fr mid-space' > </span></div></div></div><div class='list_img_holder2' ><img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg'></div>"
  },
  {
    id: 1,
    title:"一个大图",
    listHtml: "<h3 class='dotdot2'>宝马5系底价，最高优惠9.99万，立询购车优惠按时打算阿萨德按时打算大松</h3 ><div class='list_img_holder_large'><img src='http://sf1-ttcdn-tos.pstatp.com/img/web.business.image/201805025d0dced9b0d153974e28aa9f~640x0.image'></div><div class='item_info'><span class=' space' > 易车 </span><span class='cmt space' > 评论 0</span><span class='time' title= '2017-05-03 20:28' > 33分钟前</span><span  class='dislike-news fr'></span></div>"
  },
  {
    id: 1,
    title: "三个小图",
    listHtml: "<div class='item_detail'><h3 class='dotdot line3' > 赵雷首次在演出现场崩溃，大骂主办方：再这样下去我就废了！</h3><div class='list_image' ><ul class='clearfix' ><li class='list_img_holder' > <img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li><li class='list_img_holder' > <img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li><li class='list_img_holder'><img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li></ul></div> <div class='item_info' ><div><span class='src space' > 果酱音乐 </span><span class='cmt space' >评论831</span><span class='time' title= '2017-05-03 20:43' > 18分钟前</span><span  class='dislike-news fr'></span></div></div> </div>"
  },
  {
    id: 31,
    title: "三个小图",
    listHtml: "<div class='item_detail'><h3 class='dotdot line3' > 赵雷首次在演出现场崩溃，大骂主办方：再这样下去我就废了！</h3><div class='list_image' ><ul class='clearfix' ><li class='list_img_holder' > <img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li><li class='list_img_holder' > <img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li><li class='list_img_holder'><img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg' ></li></ul></div> <div class='item_info' ><div><span class='src space' > 果酱音乐 </span><span class='cmt space' >评论831</span><span class='time' title= '2017-05-03 20:43' > 18分钟前</span><span  class='dislike-news fr'></span></div></div> </div>"
  },
    {
      id: 11,
      title: "一个小图",
      listHtml: "<div class='item_detail desc'><h3 class='dotdot line3 image-margin-right' > 罗永强任应急管理部消歐尼就哦【朋發就安部消防局副局长</h3 ><div class='item_info oneline'><div><span class='src space' > 油价汽油柴油查询 </span><span class='cmt space' >评论5</span><span class='time' title= '2017-05-03 20:43' > 15分钟前</span><span ' class='dislike-news fr mid-space' > </span></div></div></div><div class='list_img_holder2' ><img src='http://i1.umei.cc/uploads/tu/201804/9999/b60f5b3ec5.jpg'></div>"
    }
]
  commentsList = [{
                id:"001",
                ImgSrc:"http://www.cdhdky.com/images/ttt.jpg",
                name:"1358954654",
                text:"住找钱越来越好你就想个大元宝",
                like:23,
                time:"2017.5.1",
                reply: "你这个傻瓜，我爱你啊",
                reply_num:53,
                hasLike:false,
                isPoint:0
          },{
              id: "002",
              ImgSrc: "http://www.cdhdky.com/images/ttt.jpg",
              name: "13578945641",
              text: "有一只猪写了这篇文章还不承认自己写的懒",
              like: 23,
              time: "2017.5.1",
              reply:"神特么的萧郎！！！！！",
              reply_num:null,
              hasLike: false,
              isPoint:1
          },
        {
          id: "003",
          ImgSrc: "http://www.cdhdky.com/images/ttt.jpg",
          name: "184156231235",
          text: "我想编个段子给你们看看，但是他们限制了最多只能输入140字，所以无负担和维护了我一URIE欧文如惹我丢人为 围殴日欧文诶诶哦我围绕为让欧文二副围绕二维尔哦无二额 ",
          like: 23,
          time: "2017.5.1",
          reply:"今天不想code",
          reply_num:2,
          hasLike: false,
          isPoint:1
        },{
          id: "004",
          ImgSrc: "http://www.cdhdky.com/images/ttt.jpg",
          name: "李白白",
          text: "这个作者好可爱我很喜欢",
          like: 203,
          time: "2017.5.1",
          reply:"感谢您的反馈我们会继续努力的",
          reply_num:99,
          hasLike: false,
          isPoint:0,
        },{
          id: "005",
          ImgSrc: "http://www.cdhdky.com/images/ttt.jpg",
          name: "15735628956",
          text: "这个作者好可爱我很喜欢",
          like: 23,
          time: "2017.5.1",
          reply:null,
          reply_num:489,
          hasLike: false,
          isPoint:0
        }]

  a = [{
    "filed": 1,
    "checked": 1,
    "filedidx": "a",
    "filedname": "",
    "filedname_local": "车牌号",
    "alternative": 1
  }, {
    "filed": 2,
    "checked": 1,
    "filedidx": "b",
    "filedname": "",
    "filedname_local": "车架号（VIN）",
    "alternative": 1
  }, {
    "filed": 3,
    "checked": 1,
    "filedidx": "d",
    "filedname": "",
    "filedname_local": "车系",
    "alternative": 1
  }, {
    "filed": 5,
    "checked": 0,
    "filedidx": "b",
    "filedname": "",
    "filedname_local": "发动机号",
    "alternative": 0
  }, {
    "filed": 8,
    "checked": 1,
    "filedidx": "c",
    "filedname": "",
    "filedname_local": "交车日期",
    "alternative": 1
  }]
}
