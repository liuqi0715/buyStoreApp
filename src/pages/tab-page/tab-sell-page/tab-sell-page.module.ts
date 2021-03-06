import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabSell } from './tab-sell-page';
import { orderBornPage } from "../order-born-page/order-born-page";
import { orderConfirmPage } from "../order-confirm-page/order-confirm-page";
import { orderDetailPage } from "../order-detail-page/order-detail-page";
import { orderMapPage } from "../order-map-page/order-map-page";
import { orderAgreePage } from "../order-agree-page/order-agree-page";
import { orderCommentPage } from "../order-comment-page/order-comment-page";
import { radarPage } from "./../../radar/radar-page";
import { ActivityComponent } from "../../../components/activity/activity"
@NgModule({
  declarations: [
    TabSell,
    radarPage,
    orderBornPage,
    orderConfirmPage,
    orderDetailPage,
    orderAgreePage,
    orderCommentPage,
    ActivityComponent,
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
    radarPage,
    orderBornPage,
    orderConfirmPage,
    orderDetailPage,
    orderAgreePage,
    orderCommentPage,
    ActivityComponent,
    orderMapPage
  ]
})
export class TabSellModule {}
