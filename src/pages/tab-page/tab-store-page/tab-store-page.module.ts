import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabStore } from './tab-store-page';
@NgModule({
  declarations: [
    TabStore
  ],
  imports: [
    IonicPageModule
  ],
  exports: [
    IonicPageModule,
  ],
  entryComponents:[
    TabStore
  ]
})
export class TabStoreModule {}
