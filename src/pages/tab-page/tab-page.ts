import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams,Tabs } from 'ionic-angular';
import {TabSell} from "./tab-sell-page/tab-sell-page";
import {TabMine} from "./tab-mine-page/tab-mine-page";
import {TabNews} from './tab-news-page/tab-news-page';
import {TabInte} from './tab-inte-page/tab-inte-page';
import {TabStore} from './tab-store-page/tab-store-page';
@IonicPage()
@Component({
  selector: 'page-learn-tab-page',
  templateUrl: 'tab-page.html',
})
export class TabPage {
  @ViewChild('mainTabs') tabs: Tabs;
  tabSell: any = TabSell;
  tabInte: any = TabInte;
  tabMine: any = TabMine;
  tabNews: any = TabNews;
  tabStore: any = TabStore;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

    }

}
