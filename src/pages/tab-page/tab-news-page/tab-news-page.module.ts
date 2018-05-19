import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabNews } from './tab-news-page';
import { newsDetailsPage } from './../../news/news-details-page/news-details-page';
import { newsReplyPage } from './../../news/news-replys-page/news-replys-page';
@NgModule({
  declarations: [
    TabNews,
    newsDetailsPage,
    newsReplyPage,
  ],
  imports: [
    IonicPageModule
  ],
  exports: [
    IonicPageModule,
  ],
  entryComponents:[
    TabNews,
    newsDetailsPage,
    newsReplyPage,
  ]
})
export class TabNewsModule {}
