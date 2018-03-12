import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabSell } from './tab-sell-page';
import { orderBornPage } from "../order-born-page/order-born-page";
import { orderConfirmPage } from "../order-confirm-page/order-confirm-page";
import { orderDetailPage } from "../order-detail-page/order-detail-page";
import { orderMapPage } from "../order-map-page/order-map-page";
import { orderAgreePage } from "../order-agree-page/order-agree-page";
import { orderCommentPage } from "../order-comment-page/order-comment-page";
import { adsPage } from "./../../ads/ads-page";

@NgModule({
  declarations: [
    TabSell,
    adsPage,
    orderBornPage,
    orderConfirmPage,
    orderDetailPage,
    orderAgreePage,
    orderCommentPage,
    orderMapPage
  ],
  imports: [
    IonicPageModule
  ],
  exports: [
    IonicPageModule
  ],
  entryComponents:[
    TabSell,
    adsPage,
    orderBornPage,
    orderConfirmPage,
    orderDetailPage,
    orderAgreePage,
    orderCommentPage,
    orderMapPage
  ]
})
export class TabSellModule {}
