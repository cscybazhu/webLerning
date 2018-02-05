/**
 * Created by cuishaoqi on 2017/11/27.
 */
angular.module("myapp")
    .filter("languageClass", function () {
        return function (input, index) {
            var data = "badge badge-tertiary";
            if (input == index)
                data = "badge badge-secondary";
            return data;
        }
    })
    .filter("activeClass", function () {
        return function (input, index) {
            var data = "";
            if (input == index)
                data = "active";
            return data;
        }
    })
    .filter("limitBetween", function () {
        return function (input, start, end) {
            return input.slice(start, end);
        }
    })