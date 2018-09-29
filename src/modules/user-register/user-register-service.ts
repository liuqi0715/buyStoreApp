import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';//底部提示信息

export class UserRegCamera {
    loginError = false;
    errMsg = '';
    constructor(public navCtrl: NavController,
                private Camera: Camera,
                public actionSheetCtrl: ActionSheetController
            ) {
    }
    openImg(){
        
    }

}
