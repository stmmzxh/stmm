/**
 * 说明：海尔智慧生活
 */
var s7LoopObj = {
  a : {},
  b : {},
  l : {}
};
var s7LoopItem = $('.hn-smtlf-s7-loop-item');
for(var i = 1; i <= s7LoopItem.length; i++){
  s7LoopObj['a']['_a' + i] = window['a' + i];
  s7LoopObj['b']['_b' + i] = window['b' + i];
  s7LoopObj['l']['_l' + i] = window['l' + i];
}
(function(){
  //本页面一些列方法的顶级对象，smtlfObj:smart life object
  var smtlfObj = {};
  smtlfObj.init = function(){
    /*进入页面的初始化方法*/
    smtlfObj.genSwiper();
    //绑定事件
    smtlfObj.bindLis();
    //进入第一屏
    smtlfObj.inS1();
  };
  smtlfObj.genSwiper = function(){
    smtlfObj.swiper = new Swiper('#smtlfMain', {
      pagination : '.swiper-pagination',
      direction : 'vertical',
      mode : 'vertical',
      slidesPerView : 1,
      paginationClickable : true,
      spaceBetween : 30,
      speed : 1000,
      mousewheelControl : true,
      onSlideChangeEnd : function(swiper){
        //清除动画什么的
        smtlfObj.clear();
        smtlfObj.checkPage();
      },
      onSlideNext : function(swiper){
        var swiper = smtlfObj.swiper;
        var curPage = swiper.activeSlide();
        var $curPage = $(curPage);
        var pageType = $curPage.attr('data-pagetype') * 1;
        switch(pageType){
          case 9:
            //smtlfObj.inS9();
            break;
        }
      }
    });
  };
  smtlfObj.checkPage = function(){
    /*判断是哪个页*/
    var swiper = smtlfObj.swiper;
    var curPage = swiper.activeSlide();
    var $curPage = $(curPage);
    var pageType = $curPage.attr('data-pagetype') * 1;
    switch(pageType){
      case 1:
        break;
      case 2:
        smtlfObj.s2ShowPage();
        break;
      case 3:
        smtlfObj.inS3();
        break;
      case 7:
        //目前转移到第七屏
        smtlfObj.s8ReadNum(41000000, 2000000, 2400);
        break;
      case 8:
        //读数的动画，这个方法需要请求完再调用
        smtlfObj.s8ReadNum(41000000, 2000000, 2400);
        break;
      case 9:
        smtlfObj.inS9();
        break;
    }
  };


  smtlfObj.clear = function(){
    clearInterval(smtlfObj.s2ImgLoop);
    //暂停播放视频
    smtlfObj.stopVideo();
    $('.js-hn-smtlf-s8').css('margin-top', 0);
  };
  //js-hn-smtlf-s7-loop-item-img
  smtlfObj.bindLis = function(){
    /*绑定事件*/
    //smtlfObj.s7CardHover
    //第三屏导航
    smtlfObj.s3Nav();
    //箭头右移
    smtlfObj.s7LongCardHover();
    //第七屏轮播
    smtlfObj.s7LogoLoop();
    //smtlfObj.s8Scrol();

  };
  smtlfObj.inS9 = function(){
    var foot = $('.hn-smartLife-foot');
    var footH = foot.height();
    var s9Page = $('.js-hn-smtlf-s9');
    var s9PageH = s9Page.height();
    var dis = s9PageH - footH;
    if(dis > 0){
      $('.js-hn-smtlf-s8').animate({
        'margin-top' : dis
      }, 100)
    }
  };
  smtlfObj.s8Scrol = function(){
    new Swiper('.hn-smartLife-s8-container', {
      mousewheelControl : true,
      mode : 'vertical',
      scrollContainer : true
    })
  };
  smtlfObj.inS1 = function(){
    /*进入第一屏要做的*/
    var imgs = $('img');
    smtlfObj.loadImgNum = 0;
    var imgsLen = imgs.length;
    var srcObj = {};//用来方便检查图片的src
    var srcLen = 0;
    //检查实际使用的图片的数目
    for(var i = 0; i < imgsLen; i++){
      var img = imgs[i];
      var src = img.src;
      if(!srcObj[src]){
        srcObj[src] = true;
        srcLen++;
      }
    }
    for(var p in srcObj){
      var image = new Image();
      image.onload = image.onerror = function(){
        $('.hn-smtlf-s1-loading-num').text(~~(++smtlfObj.loadImgNum * 100 / srcLen) + '%');
        if(smtlfObj.loadImgNum == srcLen){
          $('.js-hn-smtlf-s1-loading').hide();
          $('.hn-smartLife-s1-ie8bg').show();
          var s1Video = $('#s1Video')[0];
          if(s1Video.play){
            s1Video.play();
          }
          setTimeout(function(){
            //circleAy是三个圈的最大直径的负数
            var circleAy = [-371, -260, -200];
            for(var i = 1; i <= circleAy.length; i++){
              var h = circleAy[i - 1];
              var cPar = $('.hn-smtlf-s1-c' + i);
              cPar.stop().animate({
                //因为根据top 50%,margin-top负值，所以需要调整margin-top
                'margin-top' : h / 2
              }, (circleAy.length - i) * 1000, (function(cPar, i){

                //奇数顺时针，偶数逆时针
                var direct = i % 2 ? 1 : -1;
                return function(){
                  /*旋转*/
                  cPar.rotate({
                    duration : 16000,
                    angle : 0,
                    animateTo : 360 * direct,
                    easing : function(x, t, b, c, d){
                      return c * (t / d) + b;
                    },
                    callback : function(){
                      cPar.rotate({
                        duration : 16000,
                        angle : 0,
                        animateTo : 360 * direct,
                        easing : function(x, t, b, c, d){
                          return c * (t / d) + b;
                        }
                      });
                    }
                  });
                  //最后一个运行完后再显示小球
                  if(i == 1){
                    $('.hn-smtlf-s1-nav-title').animate({
                      'opacity' : 1
                    });
                    for(var j = 1; j < 5; j++){
                      //hn-smtlf-s1-nav-ball-1
                      setTimeout((function(j){
                        return function(){
                          var ball = $('.hn-smtlf-s1-nav-ball-' + j).find('img');
                          //设置margin因为img位置是靠左上的，不居中
                          ball.stop().animate({
                            'width' : '130%',
                            'height' : '130%',
                            'margin-top' : '-15%',
                            'margin-left' : '-15%'
                          }, function(){
                            ball.animate({
                              'width' : '100%',
                              'height' : '100%',
                              'margin-top' : 0,
                              'margin-left' : 0
                            })
                          });
                        }
                      })(j), 500 * (j - 1));
                    }
                  }
                };
              })(cPar, i));
              //同心圆缩放，从默认的20%到100%
              cPar.find('img').stop().animate({
                'width' : '100%',
                'height' : '100%'
              }, (circleAy.length - i) * 1000);
            }
          }, 1500)
        }
      };
      image.src = p;
    }
  };
  smtlfObj.s2ShowPage = function(){
    /*第二屏进入时的动画*/
    //hn-smtlf-s2-btm-inf-l
    smtlfObj.s2ImgLoop = setInterval(function(){
      var imgs = $('.hn-smtlf-s2-loop').find('img');
      var curImg, nextImg;
      if(imgs.eq(0).attr('data-cur') == '1'){
        curImg = imgs.eq(0);
        nextImg = imgs.eq(1);
      }else{
        curImg = imgs.eq(1);
        nextImg = imgs.eq(0);
      }
      //当前变下一个，下一个变当前
      curImg.attr('data-cur', 0);
      nextImg.attr('data-cur', 1);

      var imgSrc = nextImg.prop('src');
      var imgNum = imgSrc.substr(imgSrc.length - 5, 1) * 1;
      var nextNum = (imgNum + 1) % 3 + 1;
      //当前的路径变为下一张的路径
      curImg.prop('src', imgSrc.substr(0, imgSrc.length - 5) + nextNum + '.png');
      curImg.stop().animate({
        'opacity' : 0,
        //'top' : '-100px',
        'width' : 0,
        'height' : 0,
        'margin-left' : '50%'
      }, 800, function(){
        curImg.css({
          //'bottom' : '-50px',
          'opacity' : 0,
          'display' : 'none',
          'width' : 0,
          'height' : 0,
          'margin-top' : '70%'
        });
        nextImg.css('display', 'inline');
        nextImg.stop().animate({
          'opacity' : 1,
          //'top' : 0,
          'width' : '100%',
          'height' : '100%',
          'margin-left' : 0,
          'margin-top' : 0
        }, 800);
      });
    }, 5000);
    var btmInfL = $('.hn-smtlf-s2-btm-inf-l');
    var btmInfR = $('.hn-smtlf-s2-btm-inf-r');
    //左下文字重置样式
    btmInfL.css({
      left : 0,
      opacity : 0
    });
    //右下文字重置样式
    btmInfR.css({
      right : 0,
      opacity : 0
    });
    //左下文字进场
    btmInfL.stop().animate({
      'left' : '64px',
      'opacity' : 1
    });
    //右下文字进场
    btmInfR.stop().animate({
      'right' : '64px',
      'opacity' : 1
    });
    var minInf = $('.hn-smtlf-s2-btm-inf-mid');
    //中间内容重置样式
    minInf.css({
      bottom : '76px',
      opacity : 0
    });
    minInf.stop().animate({
      'bottom' : '20px',
      'opacity' : 1
    });
  };
  smtlfObj.inS3 = function(){
    /*进入第三屏要干的*/
    var navItem = $('.hn-smtlf-s3-nav-item');
    navItem.eq(0).click();
  };
  smtlfObj.stopVideo = function(){
    /*暂停播放视频*/
    var videos = $('.js-s3-video');
    for(var i = 0; i < videos.length; i++){
      if(videos[i].pause){
        videos[i].pause();
      }
    }
  };
  smtlfObj.s3ShowPage = function(num){
    //暂停其他页的视频，只播放本页的
    num = 1;


    smtlfObj.stopVideo();
    if($('.js-s3-video-' + (smtlfObj.swiper.activeIndex - 1))[0].play){
      $('.js-s3-video-' + (smtlfObj.swiper.activeIndex - 1))[0].play();
    }else{
      //$('.hn-smtlf-s3-ie8bg').hide();
      //$('.hn-smtlf-s3-ie8bg-' + num).show();
    }
    /*第三屏的文字进入动画*/
    $('.js-hn-smtlf-s3-inf').css({
      opacity : 0.1,
      left : 0
    });
    var curPage = $('.js-hn-smtlf-s3-inf-' + num);
    var btn = curPage.find('.hn-smtlf-btn1');
    btn.css({
      'margin-top' : 0,
      'opacity' : 0.1
    });
    curPage.stop().animate({
      'left' : '64px',
      'opacity' : 1
    }, 600, function(){
      btn.stop().animate({
        'margin-top' : '30px',
        'opacity' : 1
      })
    });
  };
  smtlfObj.s3Nav = function(){
    /*第三屏的导航事件*/
    var navItem = $('.hn-smtlf-s3-nav-item');
    navItem.on('click', function(event){
      var $this = $(this);

      //标记是那个页
      var num = $this.attr('data-num');

      if(event.originalEvent){
        smtlfObj.swiper.swipeTo(1 + parseInt(num))
      }


      // $('.js-s3-video').hide();
      // $('.js-s3-video-' + num).show();
      $('.js-hn-smtlf-s3-inf').hide();
      //展示动画
      num = 1;
      smtlfObj.s3ShowPage(num);
      $('.js-hn-smtlf-s3-inf-' + num).show();
    });
  };
  smtlfObj.s7LogoLoop = function(){
    /*第七屏的轮播事件*/
    //动画以后再说


    var loopItemImgs = $('.js-hn-smtlf-s7-loop-item-img');
    //点击的元素进入中间
    function roll(curPos, imglen){
      /*选中的进入中间*/
      var dis = Math.abs(3 - curPos);
      var loopItem = $('.hn-smtlf-s7-loop-item');
      var loopItemImgsPar = $(".loop_over");
      if(curPos < 3){
        for(var i = imglen - dis; i < imglen; i++){
          if(dis == 1){
            loopItemImgsPar.prepend(loopItem[2]);
          }else{
            loopItemImgsPar.prepend(loopItem[loopItem.length - i]);
          }
        }
      }else if(curPos > 3){
        for(var i = 0; i < dis; i++){
          loopItemImgsPar.append(loopItem[i]);
        }

      }
      $(".hn-smtlf-s7-loop-item").eq(2).siblings().find("img").css("opacity", 0.6)
      $(".hn-smtlf-s7-loop-item").eq(2).find("img").css("opacity", 1);
      $(".hn-smtlf-s7-logoInf").css({"bottom" : "-20px", "opacity" : 0}).animate({"bottom" : 0, "opacity" : 1}, 500)
      $(".js-hn-smtlf-btn1").css({"bottom" : "-20px", "opacity" : 0}).animate({"bottom" : 0, "opacity" : 1}, 500)
    }

    loopItemImgs.on('click', function(){
      var $this = $(this);
      var thisNum = $this.attr('data-num');
      $(".hn-smtlf-s7-logoInf span").html(s7LoopObj['a']['_a' + thisNum]);
      $(".hn-smtlf-btn1").html(s7LoopObj['b']['_b' + thisNum]);
      $(".js-hn-smtlf-btn1").attr("href", s7LoopObj['l']['_l' + thisNum]);
      //当前所在的位置
      var curPos;
      var curLoopItemImgs = $('.js-hn-smtlf-s7-loop-item-img');
      var imglen = curLoopItemImgs.length;
      for(var i = 0; i < curLoopItemImgs.length; i++){
        var $img = $(curLoopItemImgs[i]);
        if($img.attr('data-num') == thisNum){
          curPos = i + 1;
          break;
        }
      }
      roll(curPos, imglen);
    });
    $('.hn-smtlf-s7-loop-arrow-l').on('click', function(){
      var loopItem = $('.hn-smtlf-s7-loop-item');
      var loopItemImgsPar = $(".loop_over");

      setTimeout(function(){
        for(var i = 0; i < loopItem.length-1; i++){
          loopItemImgsPar.append(loopItem[i]);
        }


        $(".hn-smtlf-s7-loop-item").eq(2).siblings().find("img").css("opacity", 0.6)
        $(".hn-smtlf-s7-loop-item").eq(2).find("img").css("opacity", 1);
        $(".hn-smtlf-s7-logoInf").css({"bottom" : "-20px", "opacity" : 0}).animate({"bottom" : 0, "opacity" : 1}, 1000)
        $(".js-hn-smtlf-btn1").css({"bottom" : "-20px", "opacity" : 0}).animate({"bottom" : 0, "opacity" : 1}, 1000)

        var thisNum = loopItem.eq(1).find("img").attr("data-num");
        $(".hn-smtlf-s7-logoInf span").html(s7LoopObj['a']['_a' + thisNum]);
        $(".hn-smtlf-btn1").html(s7LoopObj['b']['_b' + thisNum]);
        $(".js-hn-smtlf-btn1").attr("href", s7LoopObj['l']['_l' + thisNum]);
      }, 1000)


      $(".loop_over").animate({"left" : "230px"}, 1000, function(){
        $(this).css("left", 0);

      })


    })

    $('.hn-smtlf-s7-loop-arrow-r').on('click', function(){

      var loopItem = $('.hn-smtlf-s7-loop-item');
      var loopItemImgsPar = $(".loop_over");

      setTimeout(function(){
        for(var i = loopItem.length-1; i > 0; i--){
          loopItemImgsPar.prepend(loopItem[i]);
        }

        $(".hn-smtlf-s7-loop-item").eq(2).siblings().find("img").css("opacity", 0.6)
        $(".hn-smtlf-s7-loop-item").eq(2).find("img").css("opacity", 1);
        $(".hn-smtlf-s7-logoInf").css({"bottom" : "-20px", "opacity" : 0}).animate({"bottom" : 0, "opacity" : 1}, 1000)
        $(".js-hn-smtlf-btn1").css({"bottom" : "-20px", "opacity" : 0}).animate({"bottom" : 0, "opacity" : 1}, 1000)


        var thisNum = loopItem.eq(3).find("img").attr("data-num");
        $(".hn-smtlf-s7-logoInf span").html(s7LoopObj['a']['_a' + thisNum]);
        $(".hn-smtlf-btn1").html(s7LoopObj['b']['_b' + thisNum]);
        $(".js-hn-smtlf-btn1").attr("href", s7LoopObj['l']['_l' + thisNum]);
      }, 1000)

      $(".loop_over").animate({"left" : "-230px"}, 1000, function(){
        $(this).css("left", 0);

      })


    })


  };
  smtlfObj.s8ReadNum = function(users, devices, interact){
    var options = {
      useEasing : true,
      useGrouping : true,
      separator : ',',
      decimal : '.',
      prefix : '',
      suffix : ''
    };
    //累计线上用户
    var s7Users = new countUp("s7Users", 0, users || 0, 0, 2, options);
    //实时在线设备
    var s7Devices = new countUp("s7Devices", 0, devices || 0, 0, 2, options);
    //在线交互次数
    var s7Interact = new countUp("s7Interact", 0, interact || 0, 0, 2, options);
    s7Users.start();
    s7Devices.start();
    s7Interact.start();
  };
  smtlfObj.s7LongCardHover = function(){
    /*箭头右移*/
    var s7CardLong = $('.js-hn-smtlf-s7-card-long');
    s7CardLong.on('mouseover', function(){
      s7CardLong.find('.hn-smtlf-s7-card-long-p2').find('i').stop().animate({
        'margin-left' : '12px'
      }, 300);
    });
    s7CardLong.on('mouseout', function(){
      s7CardLong.find('.hn-smtlf-s7-card-long-p2').find('i').stop().animate({
        'margin-left' : '7px'
      }, 300);
    });
  };
  //最后初始化
  smtlfObj.init();
})();