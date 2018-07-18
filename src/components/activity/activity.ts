import { Component } from '@angular/core';

import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { servicesInfo } from"../../providers/service-info";//公共信息

declare var $;
@Component({
  selector: 'activity',
  templateUrl: 'activity.html'
})

export class ActivityComponent {
  hasActivity = true;   //默认不显示活动页面
  skipTime = 5;
  hasSkip = true; //默认没有点击跳过按钮
  text: string;

  constructor(
      public iab: InAppBrowser,
      public servicesInfo: servicesInfo,
  ) {
    console.log('Hello ActivityComponent Component');
    this.text = 'Hello World';
    this.initActity()
  }

    initActity(){
        if (this.hasSkip==false) {
            this.hasActivity = false;
            return;
        }else{
            $(".tabs-ios .tabbar").css({ "display": "none" })
            this.hasActivity = true;
            let self = this;
            setTimeout(function () {
                self.skipTime--;
                // console.info('tag', self.skipTime)
                if (self.skipTime == 0) {
                    self.hasActivity = false;
                    $(".tabs-ios .tabbar").css({ "display": "" })
                    self.skipTime = 5;
                    return
                } else {
                    self.hasActivity = true;

                }
                self.initActity();
            }, 1000);
        }

    }

    skip(){
        $(".tabs-ios .tabbar").css({ "display": "" });
        this.hasActivity = false;
        this.hasSkip = false;
    }
    goNewPage() {
        this.hasActivity = false;
        let self = this;
        const browser = self.iab.create("http://192.168.0.156/imgs/activity/activity.html?access_token=" + self.servicesInfo.token, "_blank", "location=no");
        $(".tabs-ios .tabbar").css({ "display": "" });
        browser.on("loadstart").subscribe(
            (res) => {
                console.log('event exit with' + res);
                $(".tabs-ios .tabbar").css({ "display": "" });
            },
            (error) => {
            }
        );

    }
}
