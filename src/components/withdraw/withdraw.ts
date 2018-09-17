import { Component, Input, Output,EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';//打开页面
import { servicesInfo } from "../../providers/service-info";//公共信息

declare var $;
@Component({
  selector: 'withdraw',
  templateUrl: 'withdraw.html'
})

export class WithdrawComponent {
  /**
   * 接收来自父组件的数据
   */
  @Input()
  withdraw:boolean;

  /**
   * 通过change自定义事件将子组件中改变的数据 emit 给父组件
   * 以达到数据共享，同步显示影藏的问题
   */
  @Output()
  change = new EventEmitter();

  pwd="";
  text: string;
  constructor(
    public iab: InAppBrowser,
    public servicesInfo: servicesInfo,
  ) {
  

  }
  ngOnInit() {
    // console.log(this.withdraw,"withdraw");    // 父组件内传入的值或者我们自己设置的初始值0
   
    $("#wd_keybord ul li").css({ "width": ($("window").width() - 2) / 3 })
  }
  ionViewDidEnter(){

  }
  close(){
    this.withdraw = false;
    this.change.emit(this.withdraw);
    this.pwd = "";
  }
  /**
   * 填写密码
   */
  writePwd(e){

    var inner = e.target.innerText;
    if (inner=="") {

    }else{
      // console.log(inner,"inner");
      this.pwd = this.pwd + inner;
      if (this.pwd.length > 0 && this.pwd.length<6) {
        $("#wd_password ul li:eq(" + (this.pwd.length - 1) + ")").children().css({ "display": "block" })
      }else
      if (this.pwd.length == 6) {
        this.pwd = this.pwd;
        console.log(this.pwd,"可用的密码")
        $("#wd_password ul li:eq(" + (this.pwd.length-1) + ")").children().css({ "display": "block" })
      }else {
        this.pwd = this.pwd.substring(0,6)
      }


    }

  }
  delectPwd(){
    if (this.pwd.length==0) {

    }if (this.pwd.length>6) {
      this.pwd = this.pwd.substring(0, this.pwd.length - 1);
      console.log("666++",this.pwd)
      $("#wd_password ul li:eq(" + this.pwd.length + ")").children().css({ "display": "none" })

    } else if (this.pwd.length==6){
      this.pwd = this.pwd.substring(0,this.pwd.length-1);
      console.log('tag',this.pwd)
      $("#wd_password ul li:eq(" + this.pwd.length + ")").children().css({ "display": "none" })
    }else{
      this.pwd = this.pwd.substring(0, this.pwd.length - 1);
      $("#wd_password ul li:eq(" + this.pwd.length + ")").children().css({ "display": "none" })
    }

  }

}
