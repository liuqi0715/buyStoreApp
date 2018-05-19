import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams,Tabs } from 'ionic-angular';
import {TabSell} from "./tab-sell-page/tab-sell-page";
// import {TabDiscoverPage} from "./tab-discover-page/tab-discover-page";
// import {TabBroadcastPage} from "./tab-look-page/tab-look-page";
// import {TabMessagesPage} from "./tab-shopcart-page/tab-shopcart-page";
import {TabMine} from "./tab-mine-page/tab-mine-page";
import { TabNews } from './tab-news-page/tab-news-page';

@IonicPage()
@Component({
  selector: 'page-learn-tab-page',
  templateUrl: 'tab-page.html',
})
export class TabPage {
  @ViewChild('mainTabs') tabs: Tabs;
  tabSell: any = TabSell;
  // tab2Root: any = TabDiscoverPage;
  // tab3Root: any = TabBroadcastPage;
  // tab4Root: any = TabMessagesPage;
  tabMine: any = TabMine;
  tabNews: any = TabNews;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  ionViewDidLoad() {
    // this.tabs.select(2);
  }

}
