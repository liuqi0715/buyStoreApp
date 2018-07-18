import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule,} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import {Data} from '../providers/data';
import {urlService} from "../providers/urlService";
import {HttpModule} from "@angular/http";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {SuperTabsModule} from "ionic2-super-tabs";
import {TabSellModule} from "../pages/tab-page/tab-sell-page/tab-sell-page.module";
import {TabMineModule} from "../pages/tab-page/tab-mine-page/tab-mine-page.module";
import {TabNewsModule} from '../pages/tab-page/tab-news-page/tab-news-page.module';
import {TabInteModule} from '../pages/tab-page/tab-inte-page/tab-inte-page.module';
import {TabStoreModule } from '../pages/tab-page/tab-store-page/tab-store-page.module';
import {TabPageModule} from "../pages/tab-page/tab-page.module";
import {Camera} from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';//选择图片上传
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import {servicesInfo} from "../providers/service-info";
import { mockDataInfo } from '../providers/mock-data';
import { UserLogin } from '../modules/user-login/user-login';
import { UserRegister } from "../modules/user-register/user-register ";
import { UserRegInfo } from "../modules/user-Reg-Info/userRegInfo";
import { UserRegAddress } from "../modules/user-Reg-Address/userRegAddress";
import { UserAgreement } from "../modules/user-agreement/user-agreement";
import { UserPwdFind } from "../modules/user-pwd-find/userPwdFind";//找回密码
import { UserOpenAccount } from "../modules/user-open-account/userOpenAccount";
import { DatePipe } from '@angular/common'; //日期
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ImagePicker } from '@ionic-native/image-picker';
import { NativeStorage } from '@ionic-native/native-storage';
import { Keyboard } from '@ionic-native/keyboard';
import { AppUpdate } from '@ionic-native/app-update';
//我的钱包页面

@NgModule({
  declarations: [
    MyApp,

    UserLogin,
    UserRegister,
    UserRegInfo,
    UserRegAddress,
    UserAgreement,
    UserPwdFind,
    UserOpenAccount
  ],
  imports: [
    LazyLoadImageModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      swipeBackEnabled: 'true',
      tabsHideOnSubPages: 'true' ,       //隐藏全部子页面tabs
      iconMode: 'ios',
      mode: 'ios',
      backButtonText: '',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
    }),
    SuperTabsModule.forRoot(),
    IonicStorageModule.forRoot(),//就这里
    TabPageModule,
    TabSellModule,
    TabMineModule,
    TabNewsModule,
    TabInteModule,
    TabStoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UserLogin,
    UserRegister,
    UserRegInfo,
    UserRegAddress,
    UserAgreement,
    UserPwdFind,
    UserOpenAccount
  ],
  providers: [
    Data,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    urlService,
    Camera,
    File,
    FileTransfer,
    HttpModule,
    FileChooser,
    servicesInfo,
    mockDataInfo,
    DatePipe,
    Device,
    Network,
    InAppBrowser,
    FileOpener,
    AppVersion,
    FileTransferObject,
    AndroidPermissions,
    ScreenOrientation,
    ImagePicker,
    NativeStorage,
    Keyboard,
    AppUpdate
  ]
})
export class AppModule {
}
