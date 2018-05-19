var ua = navigator.userAgent.toLowerCase();
    var dpr = window.devicePixelRatio;
	if (/iphone|ipad|ipod/.test(ua)) {
		var fontRate = dpr>2?1.1:1;
	}else{
		var fontRate = 1;
	}

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
      this.width = null,
      this.height = null,
      this.fontSize = 14,
      this.bgColor = '#FFF',
      this.textColor = '#333',
      this.textPos = [],
      this.content = [],
      this.items = [],
      this.itemWidth = null,
      this.drawing = false,
      this.setInterval = true,
      this.intervalTime = 1600,
      this.intervalEnd = true,
      this.scrollRate = 0.8,
      this.wordSpace = 10,
      this.standOutIdx = null,
      this.frame = null,
      this.scrollCount = null
  }

  SrollUp.prototype = {
      init: function (data) {
          var _this = this;
          // if(data.fontSize){
          //   _this.fontSize = data.fontSize;
          // }

          if(data.fontSize && parseInt(data.fontSize)<18){
            _this.fontSize = dpr>2?16:data.fontSize;
          }else{
            _this.fontSize = dpr>2?16:_this.fontSize;
          }

          _this.bgColor = data.bgColor;
          _this.textColor = data.textColor;
          _this.content = data.datas;
          _this.el = document.createElement("ul");

          _this.width = this.self.width();
          _this.height = this.self.height();

          $(_this.el).width(_this.width).css({'position':'relative','overflow':'hidden','background':'rgba(255,255,255,.1)'});
          $(_this.el).height(_this.height);

          if(data.itemWidth){
            _this.itemWidth = data.itemWidth;
          }else{
            _this.itemWidth = _this.width;
          }
          // _this.self.append(_this.el);
          _this.self.append(_this.el);
          _this.scrollRate = _this.setInterval?dpr*2:dpr*0.8;
          _this.draw();
          _this.drawStep();
      },
      draw: function(){

          var self = this;

          for(var i = 0;i<self.content.length;i++){
              var li = document.createElement("li");
              var item = {};
              item.text = self.content[i];
              item.width = self.itemWidth;
              item.height = self.fontSize+self.wordSpace;
              item.x = 0;
              item.y = i*(self.fontSize+self.wordSpace);
              if((self.fontSize+self.wordSpace)*(self.content.length) > self.height){
                item.y = i*(self.fontSize+self.wordSpace);
              }else{
                var offsetTop = (self.height - self.content.length*(self.fontSize+self.wordSpace))/2
                item.y = i*(self.fontSize+self.wordSpace)+offsetTop;
              }
              $(li).html(self.content[i]).css({'position':'absolute','font-size':self.fontSize,'text-align':'center','color':self.textColor,'width':self.itemWidth,'height':self.fontSize+self.wordSpace,'line-height':self.fontSize+self.wordSpace+'px'});
              // self.items.push(item);
              $(li).data(item);

              li.style.transform = 'translate3d('+ item.x +'px,'+ item.y +'px, 0)';

              li.style.webkitTransform = 'translate3d('+ item.x +'px,'+ item.y +'px, 0)';

              self.el.appendChild(li);
          }
      },
      drawStep:function(){

          var self = this;

          if((self.fontSize+self.wordSpace)*(self.content.length) <= self.height){
            return;
          }

          var items = self.el.getElementsByTagName('li');

          for(var i = 0; i<items.length;i++){
            var li = items[i];
            var offsetX = $(li).data('x');
            var offsetY = $(li).data('y');
            var liHeight = $(li).data('height');
            $(li).css({'font-size':self.fontSize,'color':self.textColor});

            li.style.transition = 'transform 0.5s ease-out';

            li.style.webkitTransition = '-webkit-transform 0.5s ease-out';

            li.style.transform = 'translate3d(' + offsetX + 'px,' + (offsetY - liHeight) + 'px, 0)';

            li.style.webkitTransform = 'translate3d(' + offsetX + 'px,' + (offsetY - liHeight) + 'px, 0)';

            $(li).data('y',(offsetY - liHeight));
          }


          setTimeout(function(){
            for(var i = 0; i<items.length;i++){
              var li = items[i];
              var offsetX = $(li).data('x');
              var offsetY = $(li).data('y');
              var liHeight = $(li).data('height');
              if(Math.abs(offsetY + liHeight/2 - self.height/2) < 13){
                $(li).css({'font-size':self.fontSize+2,'color':'#f5fa31'});
              }
              if(offsetY < 0){
                var setOffset = (items.length - 1)*liHeight;
                $(li).data('y',setOffset);

                li.style.transition = 'transform 0s ease-out';

                li.style.webkitTransition = '-webkit-transform 0s ease-out';

                li.style.transform = 'translate3d('+ offsetX +'px,'+ setOffset +'px, 0)';

                li.style.webkitTransform = 'translate3d('+ offsetX +'px,'+ setOffset +'px, 0)';
              }
            }
          },500);

          setTimeout(function(){
            self.drawStep();
          },self.intervalTime);

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
