/**
 * Created by cuishaoqi on 2017/11/27.
 */
angular.module("myapp")
    .directive("header", function () {
        return {
            restrict: "EA",
            templateUrl: "header.html?v=" + Math.random()
        }
    })
    .directive("footer", function () {
        return {
            restrict: "EA",
            template: "<div id='footer'><div class='container'><div class='row'>" +
            "<div class='span6'>(c) " + (new Date()).getFullYear() + " all rights reserved.</div>" +
            "<div id='builtby' class='span6'><a href='#'>Built by <a href='http://www.comba.com/' target='_blank'>Comba</a> </a>" +
            "</div> </div> </div> </div> ",
            replace: true
        }
    })
    .directive("top", function () {
        return {
            restrict: "EA",
            template: '<ul id="main-nav" class="nav pull-right">' +
            '<li class="dropdown" ui-sref-active="active" ui-sref="{{y.second==0?y.sref:y.second[0].sref}}" ng-repeat="(x,y) in headTree">' +
            '<a ui-sref="{{y.sref}}">' +
            '<i class="{{y.icon}}"></i>' +
            '<span>{{y.name | translate | uppercase}}</span>' +
            '</a></li>' +
            '</ul>',
            replace: true,
            scope: {
                headTree: "="
            }
        }
    })
    .directive("pagetree", function () {
        return {
            restrict: "EA",
            template: '<ul class="nav nav-tabs nav-stacked" >' +
            '<li ui-sref-active="active" ui-sref="{{y.sref}}" {{$index}} ng-repeat="(x,y) in headTree.currentMenu.second">' +
            '<a data-toggle="tab" >' +
            '<i class="{{y.icon}}"></i>' +
            '{{y.name | translate | uppercase}}' +
            '<i class="icon-chevron-right"></i>' +
            '</a></li></ul>',
            replace: true,
            scope: {
                headTree: "="
            }
        }
    })
    /***
     * 自定义表单验证：
     * 1.ip 单ip
     * 2.number 数字以及范围
     * 3.wpa wpa的密码格式
     * 4.password 密码的字符必须包含两种字符
     * 5.nochinese 不包含中文字符，长度有限
     */
    .directive("ip", function () {
        return {
            restrict: "EAC",
            scope: {
                value: "="
            },
            template: "<div ng-show='value'><span class='error' >{{'FormatErr' | translate}}1.1.1.1</span></div>",
            replace: true
        }
    })
    //自定义表单验证
    .directive('ipFormat', function () {
        return {
            require: "ngModel",
            link: function (scope, ele, attrs, ctrl) {

                ctrl.$parsers.push(function (val) {

                    var pattern = /^((2[0-4]\d|25[0-5]|[1]\d?\d?|[2-9]\d?|[0])\.){3}(2[0-4]\d|25[0-5]|[1]\d?\d?|[2-9]\d?|[0])$/;
                    if (!val || !pattern.test(val) || val == "255.255.255.255") {
                        ctrl.$setValidity("ipFormat", false);
                    } else {
                        ctrl.$setValidity("ipFormat", true);
                    }
                    return val;
                });
            }
        }
    })
    .directive("number", function () {
        return {
            restrict: "EAC",
            scope: {
                value: "=",
                min: "=",
                max: "="
            },
            template: "<div ng-show='value'><span class='error' >{{'FormatErr' | translate}}{{'number' | translate}}{{min}}~{{max || 10000}}</span></div>",
            replace: true
        }
    })
    .directive('numberFormat', function () {
        return {
            require: "ngModel",
            link: function (scope, ele, attrs, ctrl) {
                ctrl.$parsers.push(function (val) {
                    var pattern = /^[0-9]{1,255}$/;
                    ctrl.$setValidity("numberFormat", true);
                    var min = Number(attrs.mins) || 0;
                    var max = Number(attrs.maxs) || 10000;

                    if (!val || !pattern.test(val) || Number(val) < min || Number(val) > max) {
                        ctrl.$setValidity("numberFormat", false);
                    }

                    return val;
                });
            }
        }
    })
    .directive("wpa", function () {
        return {
            restrict: "EAC",
            scope: {
                value: "="
            },
            template: "<div ng-show='value'><span class='error' >{{'FormatErr' | translate}}{{'wpa' | translate}}</span></div>",
            replace: true
        }
    })
    .directive('wpaFormat', function () {
        return {
            require: "ngModel",
            link: function (scope, ele, attrs, ctrl) {
                ctrl.$parsers.push(function (val) {
                    var patternHex = /^[0-9a-fA-F]{1,255}$/;
                    ctrl.$setValidity("wpaFormat", true);
                    var min = 8;
                    var max = 64;
                    var valTmp = val.split("");

                    if (patternHex.test(val) && valTmp.length >= min && valTmp.length <= max) {
                        ctrl.$setValidity("wpaFormat", true);
                    } else if (valTmp.length >= min && valTmp.length < max) {
                        for (var i = 0; i < valTmp.length; i++) {
                            var ascull = valTmp[i].charCodeAt();
                            if (ascull < 0 || ascull > 255) {//no ASCII characters
                                ctrl.$setValidity("wpaFormat", false);
                                break;
                            }
                        }
                    } else {
                        ctrl.$setValidity("wpaFormat", false);
                    }
                    return val;
                });
            }
        }
    })
    .directive("password", function () {
        return {
            restrict: "EAC",
            scope: {
                value: "=",
                min: "=",
                max: "="
            },
            template: "<div ng-show='value'><span class='error' >{{'FormatErr' | translate}}{{min || 8}}~{{max || 20}}{{'password' | translate}}(0-9),(a-zA-Z),(-+*_@.)</span></div>",
            replace: true
        }
    })
    //密码必须至少包含两宗字符
    .directive('passwordFormat', function () {
        return {
            require: "ngModel",
            link: function (scope, ele, attrs, ctrl) {
                ctrl.$parsers.push(function (val) {
                    var pattern1 = /[0-9]/;
                    var pattern2 = /[a-zA-Z]/;
                    var pattern3 = /[-+*_@\.]/;
                    var pattern = /^[0-9a-z_A-Z-+*@\.]{1,255}$/;

                    var tmp = 0;
                    ctrl.$setValidity("passwordFormat", true);

                    var min = Number(attrs.mins) || 8;
                    var max = Number(attrs.maxs) || 20;
                    var strlen = val.length;
                    if (min && max) {
                        if (!val || !pattern.test(val) || strlen > max || strlen < min) {
                            ctrl.$setValidity("passwordFormat", false);
                        } else {
                            if (pattern1.test(val)) {
                                tmp++;
                            }
                            if (pattern2.test(val)) {
                                tmp++;
                            }
                            if (pattern3.test(val)) {
                                tmp++;
                            }
                            if (tmp < 2) {
                                ctrl.$setValidity("passwordFormat", false);
                            }
                        }
                    } else {
                        if (!val || !pattern.test(val)) {
                            ctrl.$setValidity("passwordFormat", false);
                        } else {
                            if (pattern1.test(val)) {
                                tmp++;
                            }
                            if (pattern2.test(val)) {
                                tmp++;
                            }
                            if (pattern3.test(val)) {
                                tmp++;
                            }
                            if (tmp < 2) {
                                ctrl.$setValidity("passwordFormat", false);
                            }
                        }
                    }

                    return val;
                });
            }
        }
    })
    .directive("nochinese", function () {
        return {
            restrict: "EAC",
            scope: {
                value: "=",
                min: "=",
                max: "="
            },
            template: "<div ng-show='value'><span class='error' >{{'FormatErr' | translate}}{{min || 1}}~{{max || 64}}{{'nochinese' | translate}}</span></div>",
            replace: true
        }
    })
    .directive('nochineseFormat', function () {
        return {
            require: "ngModel",
            link: function (scope, ele, attrs, ctrl) {
                ctrl.$parsers.push(function (val) {
                    var pattern = /[\u0391-\uFFE5]/;
                    ctrl.$setValidity("nochineseFormat", true);
                    var min = Number(attrs.mins) | 1;
                    var max = Number(attrs.maxs) | 64;

                    if (!val || pattern.test(val) || val.length < min || val.length > max) {
                        ctrl.$setValidity("nochineseFormat", false);
                    } else {
                        ctrl.$setValidity("nochineseFormat", true);
                    }

                    return val;
                });
            }
        }
    })
    /*
     *生成表单
     */
    .directive("formasp", function ($compile, T, creatform) {
        return {
            restrict: "EAC",
            replace: true,
            template: "<div>3</div>",

            link: function (scope, ele) {
                var html = '';


                $.each(scope.formElement.form, function (keys) {
                    html = html + creatform.form(scope.formElement.form[keys], keys, scope.clickfun);
                });


                ele.html($compile(html)(scope));//console.log(html);

            }

        }
    })

    .directive("overview", function () {
        return {
            restrict: "EA",
            template: '<div id="content" ng-cloak >' +
            '<div class="container">' +
            '<div class="row" >' +
            '<div class="span6" ng-repeat="(key,value) in overView">' +
            '<h3 class="title">{{key | translate | uppercase}}</h3>' +
            '<table class="table stat-table"> <tbody>' +
            '<tr ng-repeat="(x,y) in value">' +
            '<td class="value">{{y.val  | translate | uppercase}}</td>' +
            '<td class="full">{{y.name | translate | uppercase}}</td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            replace: true,
            scope: {
                overView: "="
            }
        }
    })
    .directive("page", function () {
        return {
            restrict: "EA",
            template: '<span class="pagination" ng-if="tablecount.length!=0">' +
            '<ul style="float:right">' +
            '<li><a href="javascript:;" ng-click="tableConfig(1,1,4)"><i class="icon-caret-left" ></i></a></li>' +
            '<li ng-repeat="(x,y) in tablecount track by $index" ng-click="tableConfig(1,x,5)" class="{{ currentPage | activeClass:x}}"><a href="javascript:;" >{{x+1}}</a></li>' +
            '<li><a href="javascript:;" ng-click="tableConfig(1,1,6)"><i class="icon-caret-right" ></i></a></li>' +
            '</ul>' +
            '</span>',
            replace: true
        }
    })


    /*
     * 提交按钮
     * */
    .directive('submit', function (T, submit) {
        return {
            restrict: "EA",
            template: "<button type=button class='btn btn-primary btn-large' ng-disabled='disabled'><i class='{{Class}}' ></i> {{save | translate | uppercase}}</button>",
            replace: true,
            scope: {
                formElement: "=",
                disabled: "="
            },
            link: function (scope, element, attrs) {
                scope.Class = "icon-check";
                scope.save = "save";
                var info, error, success, subapply;
                info = T.T("saving");
                error = T.T("saveerror");
                success = T.T("savesuccess");

                if (attrs.label) {
                    scope.save = attrs.buttonname;
                    scope.Class = attrs.icon;
                    var url, formdata;
                    var result = {
                        "Doing": "------<span style='color:green'>[Doing]</span>"
                    };

                    switch (attrs.label) {
                        case "reboot":
                            url = "/Page/wait.asp";
                            formdata = "caseType=1";
                            scope.alert = {
                                title: T.T("reboot"),
                                text: T.T("rebootquestion"),
                                type: "warning",
                                showCancelButton: true,
                                showConfirmButton: true,
                                confirmButtonColor: "#7da64b",
                                confirmButtonText: T.T("sure"),
                                cancelButtonText: T.T("cancel"),
                                closeOnConfirm: false
                            };
                            scope.doing = {
                                title: T.T("reboot"),
                                text: T.T("rebooting"),
                                type: "warning",
                                showConfirmButton: false
                            };

                            scope.success = {
                                title: T.T("reboot"),
                                text: T.T("rebootok"),
                                type: "success",
                                showConfirmButton: false,
                                timer: "1500"
                            };

                            scope.error = {
                                title: T.T("reboot"),
                                text: T.T("rebootfail"),
                                type: "error",
                                showConfirmButton: true
                            };
                            break;
                        case "restore":
                            url = "/goform/setRestoreDefault";
                            formdata = 0;

                            scope.alert = {
                                title: T.T("restore"),
                                text: T.T("restorequestion"),
                                type: "warning",
                                showCancelButton: true,
                                showConfirmButton: true,
                                confirmButtonColor: "#7da64b",
                                confirmButtonText: T.T("sure"),
                                cancelButtonText: T.T("cancel"),
                                closeOnConfirm: false
                            };
                            scope.doing = {
                                title: T.T("restore"),
                                text: T.T("restoring"),
                                type: "warning",
                                showConfirmButton: false
                            };

                            scope.success = {
                                title: T.T("restore"),
                                text: T.T("restoreok"),
                                type: "success",
                                showConfirmButton: false,
                                timer: "1500"
                            };

                            scope.error = {
                                title: T.T("restore"),
                                text: T.T("restorefail"),
                                type: "error",
                                showConfirmButton: true
                            };
                            break;
                        case "export":
                            url = "/goform/exportDatabase";
                            formdata = 0;
                            scope.doing = {
                                title: T.T("export"),
                                text: T.T("exporting"),
                                type: "warning",
                                showConfirmButton: false
                            };

                            scope.success = {
                                title: T.T("export"),
                                text: T.T("exportok"),
                                type: "success",
                                showConfirmButton: false,
                                timer: "1500"
                            };

                            scope.error = {
                                title: T.T("export"),
                                text: T.T("exportfail"),
                                type: "error",
                                showConfirmButton: true
                            };
                            break;
                        case "import":
                            url = "/Page/wait.asp";
                            formdata = "caseType=5&data='wlanImportInOutUpload'";
                            scope.doing = {
                                title: T.T("import"),
                                text: T.T("importing"),
                                type: "warning",
                                showConfirmButton: false
                            };

                            scope.success = {
                                title: T.T("import"),
                                text: T.T("importok"),
                                type: "success",
                                showConfirmButton: false,
                                timer: "1500"
                            };

                            scope.error = {
                                title: T.T("import"),
                                text: T.T("importfail"),
                                type: "error",
                                showConfirmButton: true
                            };
                            break;
                        case "software":
                            url = "/Page/wait.asp";
                            formdata = "caseType=5&data='wlanwebupdateUpload'";
                            scope.doing = {
                                title: T.T("software"),
                                text: T.T("uploading"),
                                type: "warning",
                                showConfirmButton: false
                            };

                            scope.success = {
                                title: T.T("software"),
                                text: T.T("softwareok"),
                                type: "success",
                                showConfirmButton: false,
                                timer: "1500"
                            };

                            scope.error = {
                                title: T.T("software"),
                                text: T.T("softwarefail"),
                                type: "error",
                                showConfirmButton: true
                            };
                            break;
                        case "passwordMan":
                            url = "/Page/wait.asp";
                            formdata = "caseType=5&data='wlanwebupdateUpload'";
                            scope.alert = {
                                title: T.T("passwordMan"),
                                text: T.T("passwordManquestion"),
                                type: "warning",
                                showCancelButton: true,
                                showConfirmButton: true,
                                confirmButtonColor: "#7da64b",
                                confirmButtonText: T.T("sure"),
                                cancelButtonText: T.T("cancel"),
                                closeOnConfirm: false
                            };
                            scope.doing = {
                                title: T.T("passwordMan"),
                                text: T.T("passwordManing"),
                                type: "warning",
                                showConfirmButton: false
                            };

                            scope.success = {
                                title: T.T("passwordMan"),
                                text: T.T("passwordManok"),
                                type: "success",
                                showConfirmButton: false,
                                timer: "2500"
                            };

                            scope.error = {
                                title: T.T("passwordMan"),
                                text: T.T("passwordManfail"),
                                type: "error",
                                showConfirmButton: true
                            };

                            break;
                        default :
                            break;
                    }

                    subapply = function () {

                        switch (attrs.label) {
                            case "reboot":
                                if ($.browser.version == "8.0") {
                                    confirm(T.T("reboot"), T.T("rebootquestion"), function (isConfirm) {
                                        if (isConfirm) {
                                            alert(T.T("reboot"), T.T("rebooting"), '', {
                                                type: 'info',
                                                showCancelButton: false,
                                                showConfirmButton: false
                                            });
                                            submit.setConfig(url, formdata).success(function () {
                                                reboot();
                                            }).error(function () {
                                                alert(T.T("reboot"), T.T("rebootfail"), '', {
                                                    type: 'error',
                                                    showCancelButton: false,
                                                    showConfirmButton: true,
                                                    confirmButtonText: T.T("sure")
                                                });
                                            });
                                            //after click the confirm
                                        } else {
                                            //after click the cancel
                                        }
                                    }, {confirmButtonText: T.T("sure"), cancelButtonText: T.T("cancel"), width: 400});
                                } else {
                                    swal(scope.alert, function () {
                                        swal(scope.doing);

                                        submit.setConfig(url, formdata).success(function () {
                                            reboot();
                                        }).error(function () {
                                            swal(scope.error);
                                        });
                                    });
                                }


                                break;
                            case "restore":
                                if ($.browser.version == "8.0") {
                                    confirm(T.T("restore"), T.T("restorequestion"), function (isConfirm) {
                                        if (isConfirm) {
                                            alert(T.T("restore"), T.T("restoreing"), '', {
                                                type: 'info',
                                                showCancelButton: false,
                                                showConfirmButton: false
                                            });
                                            submit.setConfig(url, formdata).success(function () {
                                                reboot();
                                            }).error(function () {
                                                alert(T.T("restore"), T.T("restorefail"), '', {
                                                    type: 'error',
                                                    showCancelButton: false,
                                                    showConfirmButton: true,
                                                    confirmButtonText: T.T("sure")
                                                });
                                            });
                                            //after click the confirm
                                        } else {
                                            //after click the cancel
                                        }
                                    }, {confirmButtonText: T.T("sure"), cancelButtonText: T.T("cancel"), width: 400});
                                } else {
                                    swal(scope.alert, function () {
                                        swal(scope.doing);
                                        $("div.sweet-alert p").html($("div.sweet-alert p").html() + result.Doing);
                                        submit.setConfig(url, formdata).success(function (data) {
                                            if (data.indexOf("success") >= 0) {
                                                $("div.sweet-alert p span:eq(0)").html("[OK]");
                                                $("div.sweet-alert p").html($("div.sweet-alert p").html() + "<br>" + T.T("rebooting") + result.Doing);
                                                reboot();
                                            } else {
                                                swal(scope.error);
                                            }

                                        }).error(function () {
                                            swal(scope.error);
                                        });
                                    });
                                }
                                
                                break;
                            case "export":
                                submit.setConfig(url, formdata).success(function () {

                                }).error(function () {
                                    swal(scope.error);
                                });
                                break;
                            case "import":

                                /*var formConfig = new FormData(document.getElementById("configForm"+attrs.formindex));
                                 $.ajax({
                                 url:"/goform/uploadConfigFile",
                                 type:"post",
                                 data:formConfig,
                                 processData:false,
                                 contentType:false,
                                 success:function(data){

                                 }
                                 })*/


                                break;
                            case "software":
                                var DOWNLOAD_SUCCESS = 0,
                                    DOWNLOAD_ERROR = 1,
                                    CHECK_SUCCESS = 2,
                                    CHECK_ERROR = 3,
                                    UNPACKAGE_SUCCESS = 4,
                                    UNPACKAGE_ERROR = 5,
                                    COPY_SUCCESS = 6,
                                    COPY_ERROR = 7,
                                    REBOOT_SUCCESS = 8,
                                    REBOOT_ERROR = 9;
                                var setStatus = function () {
                                    if (localStorage.softwareChange == 1) {
                                        switch (true) {
                                            case localStorage.software < 2 :
                                                $("div.sweet-alert p").html($("div.sweet-alert p").html() + "<br>" + T.T("softwarechecking") + result.Doing);
                                                break;
                                            case localStorage.software <= 2 :
                                                $("div.sweet-alert p span:eq(1)").html("[OK]");
                                                $("div.sweet-alert p").html($("div.sweet-alert p").html() + "<br>" + T.T("updating") + result.Doing);

                                                break;
                                            case localStorage.software <= 3 :

                                                $("div.sweet-alert p span:eq(1)").html("[FAIL]");
                                                break;
                                            case localStorage.software <= 4 :
                                                $("div.sweet-alert p span:eq(1)").html("[OK]");
                                                $("div.sweet-alert p span:eq(2)").html("[OK]");
                                                $("div.sweet-alert p").html($("div.sweet-alert p").html() + "<br>" + T.T("rebooting") + result.Doing);
                                                reboot();
                                                break;
                                            case localStorage.software <= 5 :
                                                $("div.sweet-alert p span:eq(3)").html("[FAIL]");
                                                break;
                                        }

                                    }
                                    //$("div.sweet-alert p").html( $("div.sweet-alert p").html()+"<br>"+ T.T("softwarechecking")+"[OK]");

                                }
                                $.post(url, {
                                    caseType: 5,
                                    data: "wlanwebupdateUpload"
                                }, function () {
                                    $("#configForm4").ajaxSubmit({
                                        type: "post",
                                        url: "/goform/uploadConfigFile",
                                        beforeSubmit: function () {
                                            swal(scope.doing);
                                            $("div.sweet-alert p").html($("div.sweet-alert p").html() + result.Doing);
                                        },
                                        success: function (data) {
                                            if (data.indexOf("error") > 0) {
                                                swal(scope.error);
                                            } else {
                                                //swal(scope.success);
                                                $("div.sweet-alert p span:eq(0)").html("[OK]");
                                                $.post(url, {
                                                    caseType: 2
                                                }, function (data) {
                                                    if (data == 1) {

                                                        var status = setInterval(UpdateStatus, 3000);
                                                        setInterval(setStatus, 1000);
                                                    }
                                                });

                                            }
                                        },
                                        error: function () {
                                            swal(scope.error);
                                        }
                                    })
                                });

                                break;
                            case "passwordMan":
                                var formValue = scope.formElement.data[0];
                                var formData = scope.formElement.form[0];
                                var formvalues = [], i = 1, tmp;

                                for (var keys in formValue) {

                                    tmp = [];
                                    tmp.push(formData[i].oid);

                                    if (i <= 2) {
                                        tmp.push([formValue[keys][0], formValue[keys][2]]);
                                    } else {
                                        tmp.push(formValue[keys][0]);
                                    }

                                    formvalues.push(tmp);

                                    i++;
                                }

                                var username = formvalues[0][1][1].split(","),//current username
                                    password = formvalues[1][1][1].split(","),//old password
                                    inusername = formvalues[0][1][0],//input username
                                    inpassword = formvalues[1][1][0],//input old password
                                    newpassword = formvalues[2][1];//input new password

                                if (username[0] == "--") {
                                    toastr.clear();
                                    toastr.error(T.T("gettingData"));
                                    break;
                                } else if (newpassword != formvalues[3][1] || !formvalues[3][1]) {
                                    toastr.clear();
                                    toastr.error(T.T("newpwddiffconpwd"));
                                    break;
                                } else {
                                    for (var i = 0; i < username.length; i++) {

                                        if (username[i] == inusername && md5(inpassword) == password[i]) {

                                            password[i] = md5(newpassword);

                                            if ($.browser.version == "8.0") {
                                                confirm(T.T("passwordMan"), T.T("passwordManquestion"), function (isConfirm) {
                                                    if (isConfirm) {
                                                        var result = setMulOid([[formvalues[1][0], password.join(",")]]);

                                                        if (result && result >= 0) {
                                                            alert(T.T("passwordMan"), T.T("passwordManing"), '', {
                                                                type: 'info',
                                                                showCancelButton: false,
                                                                showConfirmButton: false
                                                            });

                                                            setTimeout("window.location.href = 'home.asp';", 2500);
                                                        } else {
                                                            alert(T.T("passwordMan"), T.T("passwordManfail"), '', {
                                                                type: 'info',
                                                                showCancelButton: false,
                                                                showConfirmButton: false
                                                            });

                                                        }
                                                        //after click the confirm
                                                    } else {
                                                        //after click the cancel
                                                    }
                                                }, {
                                                    confirmButtonText: T.T("sure"),
                                                    cancelButtonText: T.T("cancel"),
                                                    width: 400
                                                });
                                            } else {
                                                swal(scope.alert, function () {
                                                    var result = setMulOid([[formvalues[1][0], password.join(",")]]);

                                                    if (result && result >= 0) {
                                                        swal(scope.success);
                                                        setTimeout("window.location.href = 'home.asp';", 2500);
                                                    } else {
                                                        swal(scope.error);
                                                    }
                                                });
                                            }
                                            break;
                                        }
                                    }
                                    if (i >= username.length) {
                                        toastr.clear();
                                        toastr.error(T.T("usernameorpassworderror"));
                                    }
                                }

                                break;
                        }

                    }


                } else {
                    subapply = function () {
                        scope.disabled = true;
                        toastr.clear();
                        toastr.options.timeOut = "200000";
                        toastr.info(info);
                        var formIndex = Number(attrs.formindex);
                        var formValue = scope.formElement.data[formIndex];
                        var formData = scope.formElement.form[formIndex];
                        var formvalues = [], i = 1, tmp;

                        for (var keys in formValue) {

                            tmp = [];
                            if (formValue[keys][1] >= 1) {
                                tmp.push(formData[i].oid);
                                tmp.push(formValue[keys][0]);
                                formvalues.push(tmp);
                            }
                            i++;
                        }

                        if (formvalues.length <= 0) {
                            toastr.clear();
                            toastr.success(success);
                            scope.disabled = false;
                            return;
                        }
                        var result = setMulOid(formvalues);
                        toastr.options.timeOut = "2000";
                        if (result && result >= 0) {
                            toastr.clear();
                            toastr.success(success);
                            scope.disabled = false;
                        } else {
                            toastr.clear();
                            toastr.error(error);
                            scope.disabled = false;
                        }
                        ;

                        scope.$apply();
                    }
                }

                element.bind('click', subapply);

            }
        }
    })