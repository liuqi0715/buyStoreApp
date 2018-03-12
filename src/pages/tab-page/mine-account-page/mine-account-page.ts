import { Component} from '@angular/core';
import { Http,Response } from '@angular/http';
import { NavController, NavParams} from 'ionic-angular';
import { urlService } from "../../../providers/urlService";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FILEUPLOAD_URL } from "../../../providers/Constants";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
import { App } from 'ionic-angular';
import {UserLogin} from "../../../modules/user-login/user-login";
declare var $; 

@Component({
  selector: 'mine-account-page',
  templateUrl: 'mine-account-page.html',
})
export class myAccountPage {

  orderList: any = [];
  public uploadUrl = null;
  public type = 1;
  public photo1 = false;
  public photo2 = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private camera: Camera,
    public urlService: urlService,
    public toastCtrl: ToastController,
    private transfer: FileTransfer,
    private file: File,
    private app: App,
    ) {
  }

  ionViewDidLoad(){

  }

  goBack(){
    this.navCtrl.pop();
  }

  toast(actions){
    let toast = this.toastCtrl.create({
      message: actions,
      duration: 3000,
      position:'bottom'

    });
    toast.present();
  }

  upload(fileUrl) {

    // var data = {
    //    "data":{
    //      "key":this.orderNo,
    //      "type":1
    //    }
    // };

    var self = this;
    var fileTransfer = this.transfer.create();
    if(self.type == 1){
        var filename = "shengfenzheng";
    }else{
        var filename = "yingyezhizhao";
    }
    let options: FileUploadOptions = {
       fileKey: 'file',
       fileName: filename + '.jpg',
       headers: {}
    }
    
    fileTransfer.upload(fileUrl, self.uploadUrl, options)
     .then((data) => {

     }, (err) => {
       self.toast(err);
     });
  }

  openCam(){
      var self = this;
      const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500
      } 

      this.camera.getPicture(options).then((imageData) => {
        if(self.type == 1){
            self.photo1 = true;
            $(".ma_box1").html("<img src="+imageData+" width='100%' height='100%'/>");
        }else{
            self.photo2 = true;
            $(".ma_box2").html("<img src="+imageData+" width='100%' height='100%'/>");
        }
       self.upload(imageData);

      }, (err) => {
       self.toast(err);
      });
   }

  takeIdenty(){
      this.type = 1;
      this.uploadUrl = FILEUPLOAD_URL + '?type='+4;
      this.openCam();
  }
  takeBussiness(){
      this.type = 2;
      this.uploadUrl = FILEUPLOAD_URL + '?type='+3;
      this.openCam();
  }
  takeIdenty1(){
      if(this.photo1 == true){
        this.type = 1;
        this.uploadUrl = FILEUPLOAD_URL + '?type='+4;
        this.openCam();
      }
  }
  takeBussiness1(){
      if(this.photo2 == true){
        this.type = 2;
        this.uploadUrl = FILEUPLOAD_URL + '?type='+3;
        this.openCam();
      }
  }
  next(){
    if(this.photo1 == false){
      this.toast("还未上传身份证");
    }else if(this.photo2 == false){
      this.toast("还未上传营业执照");
    }else{
      this.toast("补拍成功");
      let self = this;
      setTimeout(function(){
        self.goBack();
      },3000);
    }
  }

}
