import { Component, ViewChild, ElementRef, Renderer} from '@angular/core';
import {Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import{servicesInfo} from"../../../providers/service-info"
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { interfaceUrls }from "../../../providers/serviceUrls";//接地址
import { App } from 'ionic-angular';
import { UserLogin } from "../../../modules/user-login/user-login";
import { mockDataInfo } from '../../../providers/mock-data';
import { Keyboard } from '@ionic-native/keyboard';
import { newsReplyPage } from '../news-replys-page/news-replys-page';
import { DomSanitizer } from '@angular/platform-browser';

// declare let cordova:any;
declare var BMap;
declare let baidumap_location: any;
declare var $;
declare var window;
declare var larkplayer;

@Component({
  selector: 'news-details-page',
  templateUrl: 'news-details-page.html',
})

export class newsDetailsPage {


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

    ],
    tContent:""

  };    //内容

  commentConent:any="";//评论文章的内容
  conentLenght=0  ;//输入框里的内容长度
  hasLike = false;  //喜欢之后显示

  hasGiveLike =true;  //点赞
  maxPage = 1;  //最大页数
  currentPage = 1 ;//当前页
  noComment = false;  //没有评论时默认false
  inputHeight = null;
  inputOutHeight = null;
  // commentReplyList=[];  //评论下的回复数据
  // conentLenght2 = 0;    //回复框的内容长度
  // commentConent2;     //评论下的回复内容

  goreply = true;
  canCommentArticle = false;//根据内容长度判断是否可以评论
  bodyClientHeight = null;
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
      private keyboard: Keyboard,
      private renderer: Renderer,
      private sanitizer: DomSanitizer
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
  // resize() {
  //   var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
  //   var scrollHeight = element.scrollHeight;
  //   element.style.height = scrollHeight + 'px';
  //   this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  // }
  ionViewWillLeave() {
    $("a").unbind("click");
  }

  valueChange(){
    let self = this;
    if (self.commentConent.length > 0) {
        self.canCommentArticle = true;

    } else {
      self.canCommentArticle = false;
    }

  }
  ionViewDidEnter(){
      // alert(document.body.clientHeight)
      this.bodyClientHeight = document.body.clientHeight;
      // let divEle = this.mapElement.nativeElement;
      this.inputHeight = $(".commet_info textarea").height();
      this.inputOutHeight = $(".commet_info").height();

      let self = this;
      var dpr = window.devicePixelRatio;
      let newH
      setTimeout(() =>{

        $(".commet_info textarea").bind("input propertychange",function(event){
          // alert("111:" + event.keyCode)
          // if (self.commentConent.length>0){
          //   if ($(".commet_info textarea").val()==""){
          //     self.canCommentArticle = false;
          //   }else{
          //     self.canCommentArticle = true;

          //   }
          // }else{
          //   self.canCommentArticle = false;
          // }
          // console.log($(".commet_info textarea").val(),"value")


        });
      },50);

      setTimeout(function() {
        let src = $("#video-el").attr("src")
        if (src!=undefined) {
          const player = larkplayer("video-el", {

          }, () => {
            // console.info('ppppp===', '');
          });
        }
        $("a").click((e) => {
          e.preventDefault();
          let selfSRC = e.target.href;
          console.log(selfSRC);
          const browser = self.iab.create(selfSRC, "_self", "location=no");
        })

      }, 50);
      // $(document).on('click', '.lark-request-fullscreen', function () {
      //   // alert("hey it's Sam.");
      //   $(".lark-request-fullscreen").css({"display":"none"})
      //   $(".lark-exit-fullscreen").css({ "display": "block" })
      //   $(".larkplayer ").addClass("lark-fullscreen-adjust")
      // });
      // $(document).on('click', '.lark-exit-fullscreen', function () {
      //   // alert("hey it's Sam.");
      //   $(".lark-request-fullscreen").css({ "display": "block" })
      //   $(".lark-exit-fullscreen").css({ "display": "none" })
      //   $(".larkplayer ").removeClass("lark-fullscreen-adjust")

      // });
      var width = Math.min(document.body.clientWidth, 640);
      this.conent = this.navParams.data.tabconnet;
      this.maxPage = this.conent.totalPage;
      if (this.conent.tContent){
        this.conent.tContent = this.sanitizer.bypassSecurityTrustHtml(this.conent.tContent);
      }

      for (var i = 0; i < this.conent.tabCommentsList.length; i++) {
        this.conent.tabCommentsList[i]["likeShow"] = false;
      }
      this.commentsList = this.conent.tabCommentsList;
      if (this.maxPage==0){
          this.noComment = true;
      }else{
        this.noComment = false;
      }
      /**
       * 监听键盘事件
       *
       */
      this.keyboard.onKeyboardShow().subscribe(e => {
        // alert(document.body.clientHeight)
        if (self.bodyClientHeight > document.body.clientHeight){
          $(".scroll-content").css({ "padding-bottom": e.keyboardHeight + "px" });
          $(".commet_input").css({ "bottom": 0 + "px" });
        }else{
          $(".scroll-content").css({ "padding-bottom": e.keyboardHeight + "px" });
          $(".commet_input").css({ "bottom": e.keyboardHeight + "px" });
        }

        // $(".commet_info").css({ "height": "1.2rem" });
      });
      this.keyboard.onKeyboardHide().subscribe(e => {
        $(".scroll-content").css({ "padding-bottom": 0 + "px" });
        $(".commet_input").css({ "bottom": 0 + "px" })
        // $(".commet_info").css({ "height": ".6rem" });
      });

  }
  goBack() {
    this.navCtrl.pop();
  }
  getCommentList(){

  }
  // inputStart() {
  //   this.keyboard.onKeyboardShow().subscribe(e => {
  //   $(".scroll-content").css({ "padding-bottom": e.keyboardHeight + "px" });
  //   $(".commet_input").css({ "bottom": e.keyboardHeight + "px" })
  //   // $(".commet_info").css({ "height": "1.2rem" });
  //   });
  // }
  // inputEnd() {
  //   this.keyboard.onKeyboardHide().subscribe(e => {
  //   $(".scroll-content").css({ "padding-bottom": 0 + "px" });
  //   $(".commet_input").css({ "bottom": 0 + "px" })
  //   // $(".commet_info").css({ "height": ".6rem" });
  //   });
  // }
  inputChange(){

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
          //  console.log("1",resp);
          if (resp) {
            if (resp.errorinfo == null) {
              // console.info('tag:', resp)
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
   *提交评论内容
   */
  commitComment(){
      if( this.canCommentArticle==false){
          this.toast("评论不能为空。")
      } else if (this.commentConent.length>100){
          this.toast("评论字数不能大于100")
      }else{
        // alert(this.commentConent+this.canCommentArticle)
        let params = {
          "parentId": "",
          "contId": this.navParams.data.contentId,
          "commentsContent": this.commentConent,
          "userId": this.servicesInfo.userId,
        }
        let self = this;
        this.urlService.postDatas(interfaceUrls.addCommentConnet, params)
          .then(function (resp) {
            //  console.log("1",resp);
            if (resp) {
              if (resp.errorinfo == null) {
                self.toast("提交成功，评论审核中。")
                self.commentConent = "";
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
   * 查询回复列表
   */
  getComList(item){
    if (item.replyNums<=0){
      this.listCommentReply = item;
      this.hasComment = true;
      this.navCtrl.push(newsReplyPage, {
        "item": item,
        "contentId": this.navParams.data.contentId
      })
    }else{
      this.listCommentReply = item;
      this.hasComment = true;

        this.navCtrl.push(newsReplyPage, {
          "item": item,
          "contentId": this.navParams.data.contentId
        })


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
          "contId": this.commentConent,
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
                // console.info('tag;;', resp.tabCommentsList)
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
  }
}
