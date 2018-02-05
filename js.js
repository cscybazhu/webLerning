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
    new TextContent().init({id: "#text", div: "#div"}).render();
});

/*
 * 1.简单的实现
 * 这种实现没有继承性
 * */

/*function Animal(name){
 this.name = name;
 this.getName = function(){
 return this.name;
 }
 };

 var pet = new Animal("cs");
 console.log(pet.getName());*/

/*
 * 2.简单的继承
 * */

/*
 function Animal(name){
 this.name = name;
 };

 Animal.prototype.getName = function(){
 return this.name;
 };

 function Dog(name){
 this.name = name;
 };

 //prototype上具有Animal的getName方法
 Dog.prototype = new Animal();

 var dog = new Dog("dog");
 console.log(dog.getName());*/


/*
 * 3.事件机制，观察者模式
 *
 * */

var Class = (function () {
    var _mix = function (r, s) {
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                r[p] = s[p];
            }
        }
    }

    var _extend = function () {
        this.initPrototype = true;
        var prototype = new this();
        this.initPrototype = false;
    }


})();

