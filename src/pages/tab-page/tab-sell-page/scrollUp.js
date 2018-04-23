var ua = navigator.userAgent.toLowerCase();	
    var dpr = window.devicePixelRatio;
	if (/iphone|ipad|ipod/.test(ua)) {
		var fontRate = dpr>2?1.1:1;	
	}else{
		var fontRate = 1;
	}
  window.requestAnimFrame = (function(callback){  
      return window.requestAnimationFrame ||  
      window.webkitRequestAnimationFrame ||  
      window.mozRequestAnimationFrame ||  
      window.oRequestAnimationFrame ||  
      window.msRequestAnimationFrame ||  
      function(callback){  
          window.setTimeout(callback, 1000 / 60);  
      };  
  })(); 

  function SrollUp(){
      this.self = null,
      this.el = null,
      this.ctx = null,
      this.width = null,
      this.height = null,
      this.fontSize = 16,
      this.bgColor = '#FFF',
      this.textColor = '#333',
      this.textPos = [],
      this.content = []
  }

  SrollUp.prototype = {
      init: function (data) {
          var _this = this;
          _this.fontSize = data.fontSize * fontRate;
          _this.bgColor = data.bgColor;
          _this.textColor = data.textColor;
          _this.content = data.datas;
          _this.el = document.createElement("canvas");
          _this.el.width = _this.width = _this.self.width();
          _this.el.height = _this.height = _this.self.height();
          _this.el.style.width = _this.self.width();
          _this.el.style.height = _this.self.height();
          _this.self.append(_this.el);
          _this.ctx = _this.el.getContext('2d');
          _this.ctx.fillStyle = _this.bgColor;
          _this.ctx.fillRect(0,0,_this.width,_this.height);
          _this.draw();
          _this.drawStep();
      },       
      draw: function(){
          this.ctx.font = this.fontSize + "px bold Microsoft YaHei";
          this.ctx.textAlign = "center";
          this.ctx.textBaseline = "hanging";
          this.ctx.fillStyle = this.textColor;
          for(var i = 0;i<this.content.length;i++){
              this.textPos.push((this.fontSize+10)*i + this.height);
              this.ctx.fillText(this.content[i], this.width/2, (this.fontSize+10)*i + this.height);
          }
      },
      drawStep:function(){
          this.ctx.fillStyle = this.textColor;
          for(var i = 0;i<this.content.length;i++){
              this.textPos[i] = this.textPos[i] - 0.8;
              this.ctx.fillText(this.content[i], this.width/2, this.textPos[i]);
              if(this.textPos[i] - 0.8 < -(this.fontSize+10)){
                if((this.fontSize+10)*(this.content.length) > this.height){
                	this.textPos[i] = (this.fontSize+10)*(this.content.length - 1) + 10;
                }else{
                	this.textPos[i] = (this.fontSize+10)+this.height;
                }
              }
          }
          var self = this;
          requestAnimFrame(function(){  
              self.ctx.clearRect(0,0,self.width,self.height);
              self.ctx.fillStyle = self.bgColor;
              self.ctx.fillRect(0,0,self.width,self.height);
              self.drawStep();  
          }); 
      }
  };

  $.fn.srollUp = function (data) {
      var obj = new SrollUp();
      obj.self = $(this);
      obj.init(data);
  };