var ua = navigator.userAgent.toLowerCase();	
    var dpr = window.devicePixelRatio;
	if (/iphone|ipad|ipod/.test(ua)) {
		var fontRate = dpr>2?1.1:1;	
	}else{
		var fontRate = 1;
	}
  // window.requestAnimFrame = (function(callback){  
  //     return window.requestAnimationFrame ||  
  //     window.webkitRequestAnimationFrame ||  
  //     window.mozRequestAnimationFrame ||  
  //     window.oRequestAnimationFrame ||  
  //     window.msRequestAnimationFrame ||  
  //     function(callback){  
  //         window.setTimeout(callback, 1000 / 60);  
  //     };  
  // })(); 

 var lastTime = 0;
 var vendors = ['ms', 'moz', 'webkit', 'o'];
 for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
 }
 
 if (!window.requestAnimationFrame)
  window.requestAnimationFrame = function(callback, element) {
   var currTime = new Date().getTime();
   var timeToCall = Math.max(0, 16 - (currTime - lastTime));
   var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
    timeToCall);
   lastTime = currTime + timeToCall;
   return id;
  };
 
 if (!window.cancelAnimationFrame)
  window.cancelAnimationFrame = function(id) {
   clearTimeout(id);
  };

  function SrollUp(){
      this.self = null,
      this.el = null,
      this.ctx = null,
      this.width = null,
      this.height = null,
      this.fontSize = dpr*14,
      this.bgColor = '#FFF',
      this.textColor = '#333',
      this.textPos = [],
      this.content = [],
      this.drawing = false,
      this.setInterval = true,
      this.intervalTime = 1500,
      this.intervalEnd = true,
      this.scrollRate = 0.8,
      this.standOutIdx = null,
      this.frame = null
  }

  SrollUp.prototype = {
      init: function (data) {
          var _this = this;
          if(data.fontSize){
            _this.fontSize = dpr*data.fontSize * fontRate;
          }
          _this.bgColor = data.bgColor;
          _this.textColor = data.textColor;
          _this.content = data.datas;
          _this.el = document.createElement("canvas");
          _this.el.width = _this.width = dpr*_this.self.width();
          _this.el.height = _this.height = dpr*_this.self.height();

          _this.self.append(_this.el);
          _this.ctx = _this.el.getContext('2d');
          _this.ctx.fillStyle = _this.bgColor;
          _this.ctx.fillRect(0,0,dpr*_this.width,dpr*_this.height);
          _this.scrollRate = _this.setInterval?dpr*2:dpr*0.8;
          _this.draw();
          _this.drawStep();
      },       
      draw: function(){
          this.ctx.font = this.fontSize + "px bold Microsoft YaHei";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "hanging";
          this.ctx.fillStyle = this.textColor;

          if((this.fontSize+10)*(this.content.length) > this.height){
            if(this.setInterval == true){
              for(var i = 0;i<this.content.length;i++){
                  this.textPos.push((this.fontSize+10)*i);
                  this.ctx.fillText(this.content[i], this.width/2, (this.fontSize+10)*i);
              }
            }else{
              for(var i = 0;i<this.content.length;i++){
                  this.textPos.push((this.fontSize+10)*i + this.height);
                  this.ctx.fillText(this.content[i], this.width/2, (this.fontSize+10)*i + this.height);
              }
            }
          }else{
            for(var i = 0;i<this.content.length;i++){
                this.textPos.push((this.fontSize+10)*i + this.height);
                this.ctx.fillText(this.content[i], this.width/2, (this.fontSize+10)*i + 10);
            }
          }
      },
      drawStep:function(){
          if((this.fontSize+10)*(this.content.length) <= this.height){
            return;
          }

          var self = this;
          for(var i = 0;i<this.content.length;i++){
              this.textPos[i] = this.textPos[i] - this.scrollRate;
              if(self.setInterval == true && i == this.standOutIdx){
                 self.ctx.fillStyle = '#f5fa31';
                 self.ctx.font = dpr*18 + "px bold Microsoft YaHei";
              }else{
                 this.ctx.font = this.fontSize + "px bold Microsoft YaHei";
                 this.ctx.fillStyle = this.textColor;
              }
              this.ctx.fillText(this.content[i], this.width/2, this.textPos[i]);

              // if(dpr%2 == 0){
              //   $(this.el).css("transform","scale("+ 1/dpr +") translate(-"+ this.width/dpr +"px,-"+ this.height/dpr+"px" +")");
              // }else{
              //   $(this.el).css("transform","scale("+ 1/dpr +") translate(-"+ this.width +"px,-"+ this.height+"px" +")");
              // }
              // $(this.el).css("transform","scale("+ 1/dpr +")");
              var offsetX = (dpr-1)*this.width/2, offsetY = (dpr-1)*this.height/2;
              $(this.el).css("transform","scale("+ 1/dpr +") translate(-"+ offsetX +"px,-"+ offsetY+"px" +")");


              if(this.textPos[i] - this.scrollRate <= -(this.fontSize+10)){
                this.standOutIdx = (i+2)<this.content.length?i+2:1;
                if(self.setInterval == true && self.drawing == true){ 
                    self.drawing = false;
                    self.intervalEnd = false;
                    self.textPos[i] = (self.fontSize+10)*(self.content.length-1);
                    self.ctx.save();          
                    self.cancelStep();
                    setTimeout(function(){
                      self.intervalEnd = true;
                      self.ctx.restore();
                      self.drawStep();
                    },self.intervalTime);
                }else{
                  if((this.fontSize+10)*(this.content.length) > this.height){
                    this.textPos[i] = (this.fontSize+10)*(this.content.length - 1) + 10;
                  }else{
                    this.textPos[i] = (this.fontSize+10)+this.height;
                  }
                }
             }
          }
          
          if(self.setInterval == true){
             if(self.intervalEnd){
                 self.frame = requestAnimationFrame(function(){  
                    self.drawing = true;
                    self.ctx.clearRect(0,0,self.width,self.height);
                    self.ctx.fillStyle = self.bgColor;
                    self.ctx.fillRect(0,0,self.width,self.height);
                    self.drawStep();
                 }); 
             }
          }else{
            self.frame = requestAnimationFrame(function(){  
                self.drawing = true;
                self.ctx.clearRect(0,0,self.width,self.height);
                self.ctx.fillStyle = self.bgColor;
                self.ctx.fillRect(0,0,self.width,self.height);
                self.drawStep();
            }); 
          }



          
      },
      cancelStep:function(){
          cancelAnimationFrame(this.frame);
      }
  };

  $.fn.srollUp = function (data) {
      var obj = new SrollUp();
      obj.self = $(this);
      obj.init(data);
  };