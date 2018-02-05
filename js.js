/**
 * Created by cuishaoqi on 2018/2/5.
 * 作用域隔离
 */
var divContent = {
    input: null,
    div: null,
    init: function (config) {
        this.input = $(config.id);
        this.div = $(config.div);
        this.bind();
        //可以实现链式调用
        return this;
    },
    bind: function () {
        var self = this;
        this.input.on('keyup', function () {
            self.render();
        });
    },
    render: function () {
        var content = this.input.val();
        this.div.text(content);
    }
};

$(function () {
    //console.log(divContent.init({id:"#text",div:"#div"}).input);
});

/**
 * Created by cuishaoqi on 2018/2/5.
 * 私有方法，函数闭包
 * 上面的作用域隔离方法能够随意改变
 */

var TextContent = (function () {
    //私有方法，外面访问不到
    var _bind = function (that) {
        that.input.on('keyup', function () {
            that.render();
        });
    };

    //声明一个构造函数，它具有默认的属性prototype
    var TextContentFun = function () {
    };

    TextContentFun.prototype.init = function (config) {
        this.input = $(config.id);
        this.div = $(config.div);

        _bind(this);

        return this;
    };

    TextContentFun.prototype.render = function () {
        this.div.text(this.input.val());
    };
    return TextContentFun;
})();

$(function () {
    console.log(new TextContent().init({id: "#text", div: "#div"}).render());
    console.log(new TextContent());
});