function Magnifier(options) {
    //必选参数和非必选参数;
    /*
        options = {
            small_ele:"string",
            focus_ele:"string",
            big_ele:"string"
        }
    */
    this.small_ele = $(options.small_ele);
    this.focus_ele = $(options.focus_ele);
    this.big_ele = $(options.big_ele);
    //参数判断
    if (this.small_ele.length === 0 || this.focus_ele.length === 0 || this.big_ele.length === 0) return;
    //运行代码
    this.init();
}

Magnifier.prototype = {
    constructor: Magnifier,
    init() {
        //比例
        this.scale = this.big_ele.width() / this.focus_ele.width();
        this.ratio();
        //绑定鼠标移入事件;
        this.small_ele.on("mouseenter", {hidden: false}, $.proxy(this.toggleFocus, this));
        this.small_ele.on("mouseleave", {hidden: true}, $.proxy(this.toggleFocus, this));
        this.small_ele.on("mousemove.smallMove", $.proxy(this.smallMove, this));
        this.small_ele.on("mousemove.bigMove", $.proxy(this.bigMove, this));
        // this.small_ele.on("mousewheel",$.proxy(this.ratio,this));

        this.small_ele[0].onmousewheel = function (event) {
            //谷歌;
            let evt = event || window.event;
            // console.log(evt.wheelDelta);
            //传参调用 ratio => 传入 谷歌 | 当前实现对象里的事件信息;
            this.ratio("ch", evt.wheelDelta);
        }.bind(this);
        this.small_ele[0].addEventListener("DOMMouseScroll", function (event) {
            // console.log(event.detail);
            this.ratio("ff", event.detail);
        }.bind(this));

    },
    toggleFocus(event) {
        let opacity_img = this.small_ele.find(".opacity-img");
        // console.log(opacity_img);
        if (event.data.hidden) {
            this.focus_ele.stop().fadeOut(200);
            this.big_ele.stop().fadeOut(200);
            opacity_img.stop().fadeTo("fast", 1);
        } else {
            this.focus_ele.stop().fadeIn(200);
            this.big_ele.stop().fadeIn(200);
            opacity_img.stop().fadeTo("fast", 0.3);
        }
    },
    smallMove(event) {
        let eleX = event.offsetX - this.focus_ele.width() / 2;
        let eleY = event.offsetY - this.focus_ele.height() / 2;
        // console.log(eleX,eleY);
        // 边界检测;
        let maxWidth = this.small_ele.width() - this.focus_ele.width();
        let maxHeight = this.small_ele.height() - this.focus_ele.height();

        eleX = eleX <= 0 ? 0 : eleX;
        eleX = eleX >= maxWidth ? maxWidth : eleX;

        eleY = eleY <= 0 ? 0 : eleY;
        eleY = eleY >= maxHeight ? maxHeight : eleY;

        this.focus_ele.css({
            left: eleX,
            top: eleY,
            backgroundPosition: `${-eleX}px ${-eleY}px`
        });

        let fullLongX = this.small_ele.width() - this.focus_ele.width();
        let fullLongY = this.small_ele.height() - this.focus_ele.height();
        this.propX = Math.round(eleX / fullLongX * 100);
        this.propY = Math.round(eleY / fullLongY * 100);
        // console.log(this.propX,this.propY);
    },
    bigMove() {
        let bigImg = this.big_ele.find("img")
        let fullLongX = bigImg.width() - this.big_ele.width();
        let fullLongY = bigImg.height() - this.big_ele.height();

        let eleX = -Math.round(fullLongX * this.propX / 100);
        let eleY = -Math.round(fullLongY * this.propY / 100);

        bigImg.css({
            left: eleX,
            top: eleY
        })
        // console.log(eleX);
    },
    ratio(browser_type, data) {
        // 初始化逻辑;
        // 不传参数为缩放大图功能;
        if (!browser_type || !data) {
            //1.按比例缩放大图;
            let bigImg = this.big_ele.find("img");
            bigImg.css({
                width: Math.round(this.small_ele.width() * this.scale),
                height: Math.round(this.small_ele.height() * this.scale)
            });
            // 如果我做了这件事，那么其余的事我就不做了;
            return 0;
        }

        //传递参数为鼠标滚轮 事件 处理函数 ;
        //滚轮逻辑;
        //向下滚是变小的;
        //向上滚是变大的;
        var turn;
        if (browser_type == "ch") {
            data > 0 ? turn = "top" : turn = "bottom";
        } else if (browser_type == "ff") {
            data > 0 ? turn = "bottom" : turn = "top";
        }
        // console.log(turn);
        //让小框宽高动起来;

        var focus_ele_width = this.focus_ele.width();
        var focus_ele_height = this.focus_ele.height();

        if (turn == "top") {
            if (this.focus_ele.width() <= this.small_ele.width() * 0.8) {
                this.focus_ele
                    .css({
                        width: "+=2",
                        height: "+=2",
                        top: "-=1",
                        backgroundPosition: `${-this.focus_ele.position().left + 1}px ${-this.focus_ele.position().top + 1}px`
                    })

                var left = this.focus_ele.position().left;
                left = left <= 0 ? 0 : left - 1;
                this.focus_ele.css({
                    left: left
                })
            }
            //重新计算 比例值;
        } else if (turn === "bottom") {
            if (this.focus_ele.width() >= this.small_ele.width() * 0.1) {
                this.focus_ele
                    .css({
                        width: "-=2",
                        height: "-=2",
                        left: "+=1",
                        top: "+=1",
                        backgroundPosition: `${-this.focus_ele.position().left - 1}px ${-this.focus_ele.position().top - 1}px`
                    })
            }
        }

        this.scale = this.big_ele.width() / this.focus_ele.width();
        this.ratio();
        this.bigMove();
    }
};
