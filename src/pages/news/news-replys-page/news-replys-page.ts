import {Component} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import {servicesInfo} from"../../../providers/service-info"
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
import { mockDataInfo } from '../../../providers/mock-data';
import { Keyboard } from '@ionic-native/keyboard';
declare var BMap;
declare let baidumap_location: any;
declare var $;
declare var window;
@Component({
  selector: 'news-replys-page',
  templateUrl: 'news-replys-page.html',
})
export class newsReplyPage {
  offline:boolean=false;
  commentsList = null;  //评论列表
  hasCommet = true;  //真假评论显示
  hasComment = false; //回复页面显示隐藏
  listCommentReply={
    "id":"",
    "reply_num": 0,
    "ImgSrc":"",
    "name":"",
    "text":"",
    "like":""
  };//回复评论的列表
  conent:any={
    title:"",
    contAuthor:"",
    contTime:"",
    tabCommentsList:[

    ]

  };    //内容

  conentLenght=0  ;//输入框里的内容长度
  hasLike = false;  //喜欢之后显示
  hasGiveLike =true;  //点赞
  maxPage = 1;  //最大页数
  currentPage = 1 ;//当前页
  noComment = false;  //没有评论时默认false
  commentReplyList=[];  //评论下的回复数据
  conentLenght2 = 0;    //回复框的内容长度
  commentConent2="";     //评论下的回复内容
  conLenght2 = true;    //根据内容长度判断是否可以输入；

  inputHeight = null;
  inputOutHeight = null;
  canCommentArticle = false;//根据内容长度判断是否可以回复评论
  bodyClientHeight = null; //记录页面可视区域高度
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      public http: Http,
      public urlService: urlService,
      public toastCtrl: ToastController,
      public servicesInfo: servicesInfo,
      public iab: InAppBrowser,
      private app: App,
      private mockDataInfo: mockDataInfo,
      private network: Network,
      private keyboard: Keyboard
    ) {
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
  ionViewDidLoad() {
    this.checkNetwork();
  }
  valueChange(){
    let self = this;
    if (self.commentConent2.length > 0) {
      self.canCommentArticle = true;

    } else {
      self.canCommentArticle = false;
    }
  }
  ionViewDidEnter(){
    this.bodyClientHeight = document.body.clientHeight;
    this.listCommentReply = this.navParams.data.item;
    console.log(this.listCommentReply, "==");
    this.getComList(this.listCommentReply);

    this.inputHeight = $(".commet_info textarea").height();
    this.inputOutHeight = $(".commet_info").height();

    let self = this;
    var dpr = window.devicePixelRatio;
    let newH
    setTimeout(() => {

      $(".commet_info textarea").bind("input propertychange", function (event) {
        /* alert("111:" + event.keyCode)
        if (self.commentConent2.length > 0) {

          if (self.commentConent2 == null) {
            self.canCommentArticle = false;
          } else {
            self.canCommentArticle = true

          }
        } else {
          self.canCommentArticle = false;
        }
        console.log(self.commentConent2, "value")
        var _this = this;
        _this.style.height = 'auto';
        _this.style.height = _this.scrollHeight + "px";
        console.log($(".commet_info").scrollTop())
        console.log(self.inputOutHeight, _this.scrollHeight, self.inputHeight);
        if (_this.scrollHeight - self.inputHeight - 10 > 0) {
            $(".commet_info").height(self.inputOutHeight + _this.scrollHeight - self.inputHeight - parseInt($('.commet_info textarea').css('padding-top')) + 5);
            newH = $(".commet_info").height(self.inputOutHeight + _this.scrollHeight - self.inputHeight - parseInt($('.commet_info textarea').css('padding-top')) + 5);
            if ($(".commet_info").height() >= 78) {
               $(".commet_info").height(78)
               $(".commet_info").scrollTop($('.commet_info textarea').height() - 65);
            } else {
               $(".commet_info").scrollTop($('.commet_info').height() - $(".commet_info textarea").height());
            }
        } else {
            $('.commet_info textarea').css('padding-top', 10);
            $(".commet_info textarea").height(self.inputHeight);
            $(".commet_info").height(self.inputOutHeight);
            if ($(".commet_info textarea").val() == "") {
              $(".commet_info").scrollTop(0);
              $(".commet_info").height(self.inputOutHeight);
              console.log($(".commet_info").scrollTop(), $(".commet_info textarea").scrollTop())
            }

            console.error('tag', '')
         } */

      });
    }, 50);

    /**
     * 监听软键盘
     */
    this.keyboard.onKeyboardShow().subscribe(e => {

      if (self.bodyClientHeight > document.body.clientHeight) {
        $(".scroll-content").css({ "padding-bottom": e.keyboardHeight + "px" });
        $(".commet_input").css({ "bottom": 0 + "px" });
      } else {
        $(".scroll-content").css({ "padding-bottom": e.keyboardHeight + "px" });
        $(".commet_input").css({ "bottom": e.keyboardHeight + "px" });
      }
    });

    this.keyboard.onKeyboardHide().subscribe(e => {
      $(".scroll-content").css({ "padding-bottom": 0 + "px" });
      $(".commet_input").css({ "bottom": 0 + "px" })
    });
  }

  disappear(){
    this.hasComment = false;
  }
  Ilike(item){
    if (this.hasGiveLike==true){
      this.hasGiveLike = false;
      let params = {
        "commentId": item.id,
        "userId": this.servicesInfo.userId,
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.likeThisComment, params)
        .then(function (resp) {
          if (resp) {
            if (resp.errorinfo == null) {
              console.info('tag:', resp)
              setTimeout(function () {
                item.likeShow = false;
                self.hasGiveLike = true;
              }, 1000);
              if (item.isPoint == 0) {
                item.isPoint = 1;
                item.likeShow = true;
                item.giveNums = item.giveNums + 1
              } else if (item.isPoint == 1) {
                item.isPoint = 0;
                item.likeShow = false;
                item.giveNums = item.giveNums - 1
              }
            } else {
              self.toast(resp.errorinfo.errormessage);
              if (resp.errorinfo.errorcode == "10003") {
                self.app.getRootNav().setRoot(UserLogin);
              }
            }
          }
        }).catch(() => {
          self.toast("服务器异常，请稍后再试");
        });
    }
  }

  /**
   * 查询回复列表
   */
  getComList(item){
    if (item.replyNums<=0){
      this.listCommentReply = item;
      this.hasComment = true;
    }else{
      this.listCommentReply = item;
      this.hasComment = true;
      let params = {
        "page": 1,
        "rows": 200,
        "parentId": item.id,
        "userId": this.servicesInfo.userId,
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.getReplyTabCommentsPage, params)
        .then(function (resp) {
          if (resp) {
            if (resp.errorinfo == null) {
                if (resp.total==0) {
                  self.toast("暂无回复")
                }else{
                  for (var i = 0; i <resp.tabCommentsList.length; i++) {
                    resp.tabCommentsList[i]["likeShow"] = false;
                  }
                  self.commentReplyList = resp.tabCommentsList;
                }
            } else {
              self.toast(resp.errorinfo.errormessage);
              if (resp.errorinfo.errorcode == "10003") {
                self.app.getRootNav().setRoot(UserLogin);
              }
            }
          }
        }).catch(() => {
          self.toast("服务器异常，请稍后再试。");
        });
    }

  }
  /**
   * 提交回复内容
   */
  commitReply(){
    if (this.canCommentArticle == false) {
      this.toast("评论不能为空。")
    } else if (this.commentConent2.length > 100) {
      this.toast("评论字数不能大于100")
    }else {
      let params = {
        "parentId": this.listCommentReply.id,
        "contId": this.navParams.data.contentId,
        "commentsContent": this.commentConent2,
        "userId": this.servicesInfo.userId,
      }
      let self = this;
      this.urlService.postDatas(interfaceUrls.addCommentConnet, params)
        .then(function (resp) {
          if (resp) {
            if (resp.errorinfo == null) {
              self.toast("提交成功，评论审核中。")
              self.commentConent2 = "";
              self.conentLenght = 0
              self.canCommentArticle = false;
              $(".commet_info textarea").val("");
            } else {
              self.toast(resp.errorinfo.errormessage);
              if (resp.errorinfo.errorcode == "10003") {
                self.app.getRootNav().setRoot(UserLogin);
              }
            }
          }
        }).catch(() => {
          self.toast("服务器异常，请稍后再试");
        });
    }
  }
  /**
   * 获取更多评论
   */
  doInfinite(infiniteScroll){
      if (this.currentPage<this.maxPage){
        this.currentPage++
        let params = {
          "page": this.currentPage,
          "rows": 10,
          "contId": this.commentConent2,
          "userId": this.servicesInfo.userId,
        }
        let self = this;
        this.urlService.postDatas(interfaceUrls.getTabCommentsPage, params)
          .then(function (resp) {
            if (resp) {
              if (resp.errorinfo == null) {
                for (var i = 0; i < resp.tabCommentsList.length; i++) {
                  resp.tabCommentsList[i]["likeShow"] = false;
                }
                console.info('tag;;', resp.tabCommentsList)
                self.commentsList = self.commentsList.concat(resp.tabCommentsList )
                infiniteScroll.complete();
              } else {
                self.toast(resp.errorinfo.errormessage);
                if (resp.errorinfo.errorcode == "10003") {
                  self.app.getRootNav().setRoot(UserLogin);
                }
              }
            }
          }).catch(() => {
            self.toast("服务器异常，请稍后再试。");
            infiniteScroll.complete();
          });
      }else{
        infiniteScroll.complete();
      }
  }
  KeyboardHe(){
    $("#commet_info").focus();
    console.log("00")
  }
}
