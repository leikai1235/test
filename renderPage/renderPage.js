function RenderPage(options) {
    this.container = $(options.container);
    this.url = "http://mce.meilishuo.com/jsonp/get/3?offset=0&frame=1&trace=0&limit=10&endId=0&pid=106888&_=1526528205879"
    if (this.container.length === 0 || !this.container) {
        return 0;
    }
    this.init();
}

RenderPage.prototype = {
    constructor: RenderPage,
    init: function () {
        //初始化
        this.getData()
            //若成功接收到数据
            .then(function (res) {
                //回调结果;
                this.json = res.data.list;
                this.renderPage();
            }.bind(this))
            .fail(function () {
                alert("获取数据失败，请重试")
            })
    },
    getData: function () {
        //得到接口的数据
        this.opt = {
            url: this.url,
            dataType: "jsonp",
            statusCode: {
                404: function () {
                    alert('page not found');
                }
            }
        };
        return $.ajax(this.opt);
    },
    renderPage: function () {
        //渲染页面
        this.html ="";
        this.json.forEach(function (item) {
            //字符串模板
            this.html += `  <div class="item-box">
                    <a href="javascript:void(0)" target="_blank"
                       class="picBox" style="background-image: url('${item.image}'); background-size: cover;"
                      > </a>
                    <div class="info">
                        <div class="part">
                            <div class="price">${item.discountPrice}</div>
                            <div class="collect"><i class="icon-star"></i>${item.itemLikes}</div>
                        </div>
                        <a class="title" href="javascript:void(0)">
                            <i class="icon-select"></i>${item.title}</a>
                    </div>
                    <input type="button" value="${item.userId}">
                </div>`;
            this.container.html(this.html);
        }.bind(this))
    }
};