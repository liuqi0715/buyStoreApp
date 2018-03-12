import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TabPage} from "./tab-page";

@NgModule({
  declarations: [
    TabPage
  ],
  entryComponents: [
    TabPage,
  ],
  imports: [
    IonicPageModule
  ],
  exports: [
    IonicPageModule
  ]
})
export class TabPageModule {}
