import { Component } from '@angular/core';
import { App, NavController, ToastController } from 'ionic-angular';
import { urlService } from "../../providers/urlService";  //post请求
import { servicesInfo } from"../../providers/service-info";//公共信息
import { GETRECYCLEMEN_URL } from "../../providers/Constants";
import { orderBornPage } from "../tab-page/order-born-page/order-born-page";
declare var $;

@Component({
  selector: 'radar-page',
  templateUrl: 'radar-page.html'
})

export class radarPage {
 
  public informedNums:number = 0;
  public radarRotate:any = null;
  public posGroup = [];
  public userInfo = [];
  public scope = 100;

  constructor(
    private app: App,
    public navCtrl: NavController,
    public urlService: urlService,
    public toastCtrl: ToastController,
    public servicesInfo: servicesInfo
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

  goHome(){
    this.navCtrl.popToRoot();
    // console.log(this.navCtrl.indexOf(orderBornPage));
  }


  ionViewDidEnter(){
      let self = this;
      // self.calcPos(self.userInfo);
      // self.radarOn();

      self.getDatas();
      // setTimeout(() =>{
      //   self.calcPos(self.userInfo);
      // },2500);
      // self.navCtrl.remove(-1,1);
      document.addEventListener("backbutton",function(){
        // self.navCtrl.remove(-1,1);
        self.navCtrl.popToRoot();
      }, false); //返回键  
      
  }

  // public userInfo = [
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:20,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:100,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:200,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:400,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:160,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:190,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:240,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:335,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:566,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:144,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:80,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:376,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:700,
  //     x:0,
  //     y:0
  //   },
  //       {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:20,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:100,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:200,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:400,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:160,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:190,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:240,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:335,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:566,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:144,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:80,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:376,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:700,
  //     x:0,
  //     y:0
  //   },
  //       {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:566,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:144,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:80,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:376,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:700,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:20,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:100,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:200,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:400,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:160,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:190,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:240,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:335,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:566,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (2).png',
  //     distance:144,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:80,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/touxiang.png',
  //     distance:376,
  //     x:0,
  //     y:0
  //   },
  //   {
  //     recycleImg:'assets/img/radar/tou2 (1).png',
  //     distance:700,
  //     x:0,
  //     y:0
  //   }
  // ];

  calcPos(data){

    var self = this;

    let dataLen = data.length;
    // this.informedNums = dataLen;
    let inGroup = [],midGroup = [],outGroup = [];
    let tagWidth:any = parseInt($('html').css("font-size"))*0.6;
    // let maxRange:any = 600;
    let maxRange:any = self.scope;
    // let angleOrigin:number = Math.ceil(Math.random()*360);
    let range:number = parseInt($(".radar_outCir").width())/2;
    let rangeIn:number = $('.radar_search').width()/2;
    let rangeMid:number = $('.radar_inCir').width()/2;

    for(var i = 0;i < dataLen;i++){
      let r = (data[i].distance*range/maxRange + tagWidth/2 + $('.radar_mine').width()/2 + parseInt($('html').css("font-size"))*0.36) > range?range:(data[i].distance*range/maxRange + tagWidth/2 + $('.radar_mine').width()/2 + parseInt($('html').css("font-size"))*0.36);
      data[i].r = r;
      if(r <= rangeIn){
        inGroup.push(data[i]);
      }else if(r > rangeIn && r <= rangeMid){
        midGroup.push(data[i]);
      }else{
        outGroup.push(data[i]);
      }
    }

    function getPos(datas,type){
      let angle = Math.ceil(Math.random()*360);
      for(var i = 0;i < datas.length;i++){
          switch(type)
          {
          case 1:
            var degGap = Math.ceil(35 + Math.random()*3);
            break;
          case 2:
            var degGap = Math.ceil(25 + Math.random()*5);
            break;
          default:
            let gapJudge = Math.random();
            var degGap = gapJudge > 0.5 ? Math.ceil(40 + gapJudge*10):Math.ceil(40 - gapJudge*20);
          }
          angle = angle + degGap;
          let r = datas[i].r;
          
          if(angle > 360){
            angle = angle - 360;
          }

          datas[i].deg = angle;
          if(angle > 0 && angle < 90){
              datas[i].x = range - r*Math.cos((Math.PI / 180)*angle) - tagWidth/2;
              datas[i].y = range - r*Math.sin((Math.PI / 180)*angle) - tagWidth/2;
          }else if(angle > 90 && angle < 180){
              datas[i].x = range + r*Math.cos((Math.PI / 180)*(180-angle)) - tagWidth/2;
              datas[i].y = range - r*Math.sin((Math.PI / 180)*(180-angle)) - tagWidth/2;
          }else if(angle > 180 && angle < 270){
              datas[i].x = range + r*Math.sin((Math.PI / 180)*(270-angle)) - tagWidth/2;
              datas[i].y = range + r*Math.cos((Math.PI / 180)*(270-angle)) - tagWidth/2;
          }else if(angle > 270 && angle < 360){
              datas[i].x = range - r*Math.cos((Math.PI / 180)*(360-angle)) - tagWidth/2;
              datas[i].y = range + r*Math.sin((Math.PI / 180)*(360-angle)) - tagWidth/2;
          }else if(angle == 90){
              datas[i].x = range - tagWidth/2;
              datas[i].y = range - r - tagWidth/2;
          }else if(angle == 180){
              datas[i].x = range + r - tagWidth/2;
              datas[i].y = range - tagWidth/2;
          }else if(angle == 270){
              datas[i].x = range - tagWidth/2;
              datas[i].y = range + r - tagWidth/2;
          }else if(angle == 360){
              datas[i].x = range - r - tagWidth/2;
              datas[i].y = range - tagWidth/2;
          }
          self.posGroup.push(datas[i]);
      }
    }

    if(inGroup.length > 0){
      getPos(inGroup,1);
      // this.addRadarViewers(inGroup);
    }

    if(midGroup.length > 0){
      getPos(midGroup,2);
      // this.addRadarViewers(midGroup);
    }

    if(outGroup.length > 0){
      getPos(outGroup,3);
      // this.addRadarViewers(outGroup);
    }
    
  }

  getDatas(){
      let params= {
         "data":{
            "platform":1, 
         },
         "token":this.servicesInfo.token
       }

      let self = this;
       this.urlService.postDatas(GETRECYCLEMEN_URL,params)
       .then(function(resp){
        //  console.log("1",resp);
        if(resp){
            if(resp.errorinfo==null){
              console.log(resp);
              self.userInfo = resp.data.getRecycle;
              self.scope = resp.data.scope;
              self.calcPos(self.userInfo);
              self.radarOn();
            }else{
              self.toast(resp.errorinfo.errormessage);
            }
        }
      });
  }

  radarOn(){
    var self = this;
    var radar = document.getElementById('radar_search');
    var rotateDeg = 0;
    this.radarRotate = setInterval(() =>{

      rotateDeg = rotateDeg + 5;

      radar.style.transform = 'rotate(' + rotateDeg + 'deg)';
      radar.style.webkitTransform = 'rotate(' + rotateDeg + 'deg)';
      var i = this.posGroup.length;
      while(i--){
        let datas = this.posGroup[i];
        if(this.posGroup[i].deg < rotateDeg){
          let img = document.createElement('img');
          if(datas.recycleImg){
            img.src = datas.recycleImg;
          }else{
            img.src = 'assets/img/radar/touxiang.png';
          }
          let viewer = document.createElement('div');
          let viewTip = document.createElement('div');
          let viewTipImg = document.createElement('img');
          let viewTipSpan = document.createElement('span');
          $(viewTipImg).attr('src','assets/img/radar/radar_tip.png');
          $(viewTipSpan).html(datas.distance + ' km');
          $(viewTip).append(viewTipImg).append(viewTipSpan).addClass('radar_viewerTip');
          $(viewer).addClass('radar_viewer viewShow').append(viewTip).append(img).css({'top':datas.y,'left':datas.x});
          $('.radar_outCir').append(viewer);
          this.posGroup.splice(i,1);
          ++this.informedNums;
          if(this.informedNums == this.userInfo.length){
             clearInterval(self.radarRotate);
             $(".radar_search").css({'background':'url(../assets/img/radar/radar_out.png)','background-size':'100%'});
             radar.style.transform = 'rotate(' + 0 + 'deg)';
             $(".radar_mine").show();
          }
        }
      }

    },50);

  }


}
