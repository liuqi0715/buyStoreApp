import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabMine } from './tab-mine-page';
import { WalletPage } from "./../../wallet/my-wallet";
import { addCardPage } from "./../../wallet/wallet-addCard-page/wallet-addCard-page";
import { changePhonePage } from "./../../wallet/wallet-phone-page/wallet-phone-page";
import { changePasswordPage } from "./../../wallet/wallet-password-page/wallet-password-page";
import { WalletMoney } from "./../../wallet/wallet-money-page/wallet-money-page";
import { BalancePage } from "./../../wallet/wallet-balance-page/wallet-balance-page";
import { orderListPage } from "../order-list-page/order-list-page";
import { rechargePage } from "./../../wallet/wallet-recharge-page/wallet-recharge-page";
import { messagePage } from "./../../wallet/wallet-message-page/wallet-message-page";
import { msgDetails } from "./../../wallet/wallet-msgDetails-page/wallet-msgDetails-page";
import { myInfoPage } from "../mine-info-page/mine-info-page";
import { myAccountPage } from "../mine-account-page/mine-account-page";
import { BankInfoPage } from "../../wallet/wallet-bankInfo-page/wallet-bankInfo-page"
import { myCouponPage} from '../mine-coupon-page/mine-coupon-page';
import { mineLocationChange } from '../mine-location-change/mine-location-change';
import { WithdrawComponent } from "../../../components/withdraw/withdraw"
// import { StatusBar } from '@ionic-native/status-bar';
@NgModule({
  declarations: [
    TabMine,
    WalletPage,
    addCardPage,
    changePhonePage,
    changePasswordPage,
    WalletMoney,
    BalancePage,
    orderListPage,
    rechargePage,
    messagePage,
    msgDetails,
    myInfoPage,
    myAccountPage,
    BankInfoPage,
    myCouponPage,
    mineLocationChange,
    WithdrawComponent
  ],
  imports: [
    IonicPageModule,

  ],
  exports: [
    IonicPageModule
  ],
  entryComponents:[
    TabMine,
    WalletPage,
    addCardPage,
    changePhonePage,
    changePasswordPage,
    WalletMoney,
    BalancePage,
    orderListPage,
    rechargePage,
    messagePage,
    msgDetails,
    myInfoPage,
    myAccountPage,
    BankInfoPage,
    myCouponPage,
    mineLocationChange,
    WithdrawComponent

  ]
})
export class TabMineModule {}
