;+function ($) {
    $.fn.Banner = function (warp, options) {
        new Banner(warp, options, this);
    };

    function Banner(warp, options, container) {
        this.init(warp, options, container);
    }

    Banner.prototype = {
        constructor: Banner,
        //初始化
        init: function (warp, options, container) {
            this.container = container;
            //当前显示的内容;
            this.index = 0;
            // 主体元素选择;
            this.bannerWrapper = $(warp);
            //动画模式;
            //默认是fade
            this.direction = options.animate ? options.animate : "fade";

            //获取轮播项
            this.bannerItem = this.bannerWrapper.children();
            this.bannerNum = this.bannerItem.length;

            //导航
            this.pagination = $(options.pagination ? options.pagination : "");
            this.check_pagination();

            //按钮元素获取
            this.btnPrev = $(options.prevBtn);
            this.btnNext = $(options.nextBtn);
            this.btnPrev
                .on("click.changeIndex", {turn: "prev"}, $.proxy(this.change_index, this))
                .on("click.animation", $.proxy(this.animation, this));
            this.btnNext
                .on("click", {turn: "next"}, $.proxy(this.change_index, this))
                .on("click", $.proxy(this.animation, this));

            //是否自动播放
            this.autoplayTrigger = options.autoplay;
            if(this.autoplayTrigger){
                this.auto_play()
            }
        },
        check_pagination: function () {
            //要是有pagenation就建立其dom
            if (this.pagination.length !== 0) {
                for (let i = 0; i < this.bannerNum; i++) {
                    let span = $("<span></span>");
                    this.pagination.append(span);
                    if (i === this.index) {
                        span.addClass("active");
                    }
                }
                this.paginationItem = this.pagination.children();
                this.paginationItem.on("mouseover.changeIndex", {"turn": "toIndex"}, $.proxy(this.change_index, this));
                this.paginationItem.on("mouseover.animation", $.proxy(this.animation, this));
            }
        },
        //改变下标
        change_index: function (event) {
            //建立方向数组
            let turnList = {
                //向前
                "prev": function () {
                    this.prev = this.index;
                    if (this.index === 0) {
                        this.index = this.bannerNum - 1;
                    } else {
                        this.index--;
                    }
                }.bind(this),
                //向后
                "next": function () {
                    this.prev = this.index;
                    if (this.index === this.bannerNum - 1) {
                        this.index = 0;
                    } else {
                        this.index++;
                    }
                }.bind(this),
                "toIndex": function () {
                    this.prev = this.index;
                    this.index = $(event.target).index();
                }.bind(this)
            };
            //不传方向的话直接跳出
            if (!(typeof turnList[event.data.turn] === "function")) return 0;

            turnList[event.data.turn]();
        },
        //执行动画
        animation: function () {
            if (this.prev === this.index) return;
            //选择动画方式
            let animationList = {
                "slide": function () {
                    this.animation_init();
                    this.bannerItem.eq(this.index)
                        .addClass("active")
                        .css({
                            display: "none"
                        })
                        .slideDown()
                        .siblings()
                        .removeClass("active");
                }.bind(this),
                "fade": function () {
                    this.animation_init();
                    this.bannerItem.eq(this.index)
                        .addClass("active")
                        .css({
                            display: "none"
                        })
                        .fadeIn()
                        .siblings()
                        .removeClass("active");
                }.bind(this)
            };
            animationList[this.direction]();
            this.pagination.children().eq(this.index)
                .addClass("active")
                .siblings()
                .removeClass("active")
        },
        //初始化动画
        animation_init:function(){
            this.bannerItem.eq(this.prev)
                .css({
                    zIndex: 1
                })
                .siblings()
                .css({
                    zIndex: ""
                })
        },
        //自动播放
        auto_play(){
            this.container.mouseenter(function(){
                clearInterval(this.timer);
            }.bind(this));
            this.container.mouseleave(function(){
                this.timer = setInterval(function(){
                    //自动轮播是调用计算下标的方法
                    this.change_index({"data":{"turn":"next"}});
                    //调用图片运动方法
                    this.animation();
                }.bind(this),3000);
            }.bind(this));
            //当页面加载时。默认执行这个事件的方法
            this.container.trigger("mouseleave");
        }
    }

}(jQuery);


