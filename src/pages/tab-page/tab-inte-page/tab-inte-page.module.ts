import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabInte } from './tab-inte-page';
@NgModule({
  declarations: [
    TabInte
  ],
  imports: [
    IonicPageModule
  ],
  exports: [
    IonicPageModule,
  ],
  entryComponents:[
    TabInte
  ]
})
export class TabInteModule {}
