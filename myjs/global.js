/**
 * Created by cuishaoqi on 2017/12/20.
 */
$(function () {
    toastr.options = {
        closeButton: false,
        positionClass: "toast-center",
        showDuration: "10",
        hideDuration: "500",
        timeOut: "2000"
    };
    localStorage.registerProcess_error = 0;
    if (window.location.pathname.indexOf("home") >= 0) {
        var url = "Page/userProcessFunction.asp";
        $.post(url, {
            reqType: 2,
            auth: GetCookie("auth") || "auth"
        }, function (data) {
            DelCookie('auth');
            DelCookie('username');
            localStorage.logout = data;

        });
    }

});

/**
 * 二维array[oid][value]
 */
function setMulOid(array) {
    var oids = "", i, url = "/Page/getData.asp", returnValue = "";
    for (i = 0; i < array.length; i += 1) {
        //array[i][0]=Number(array[i][0]);console.log(array[i][0]);
        oids += array[i][0] + "=" + array[i][1] + "\017";
    }

    $.ajaxSetup({
        async: false
    });

    $.post(url, {
        caseType: 3,
        oids: oids,
        auth: GetCookie("auth") || "auth"
    }, function (data) {
        returnValue = data;
    });

    $.ajaxSetup({
        async: true
    });
    return returnValue;
}

function getMulOid(array) {
    var oids = "", i, url, returnValue = [];
    for (i = 0; i < array.length; i += 1) {
        //array[i]=Number(array[i]);console.log(array[i]);
        oids += array[i] + "\017";
    }

    url = "/Page/getData.asp";
    $.ajaxSetup({
        async: false
    });

    $.post(url, {
        caseType: 4,
        oids: oids,
        count: array.length,
        auth: GetCookie("auth") || "auth"
    }, function (data) {
        if (data.indexOf("error") >= 0) {
            returnValue = -1;
        } else {
            returnValue = data.split("|");
        }
        
    });

    $.ajaxSetup({
        async: true
    });
    return returnValue;
}

/*
 * Check whether the connection has been successful
 * */
function testConnect(sucCallback, errCallback) {
    $.ajax({
        url: "/Page/userProcessFunction.asp",
        async: true,
        type: "post",
        timeout: 3000,
        data: {
            reqType: 4
        },
        success: function (data) {
            if (data) {
                sucCallback();
            } else {
                errCallback();
            }
        },
        error: function () {
            errCallback();
        }
    });
};

function rebootTest() {
    testConnect(function () {
        setTimeout("window.location.href = 'home.asp';", 2500);
    }, function () {
        setTimeout(reboot, 3000);
    })
};

function reboot() {
    setTimeout("rebootTest()", 8000);
};


function UpdateStatus() {
    var url = "/Page/wait.asp";
    $.post(url, {
        caseType: 3
    }, function (data) {
        if (!localStorage.software) {
            localStorage.software = 1;
            localStorage.softwareChange = 0;
        }
        if (localStorage.software != data) {
            localStorage.softwareChange = 1;
        } else {
            localStorage.softwareChange = 0;
        }
        localStorage.software = data;
        console.log(data);
    });
}


/*
 * Check whether the get data  has been normal
 * */
function testData(sucCallback, errCallback) {
    $.ajax({
        url: "/Page/userProcessFunction.asp",
        async: true,
        type: "post",
        timeout: 4000,
        data: {
            reqType: 4
        },
        success: function (data) {
            if (data.indexOf("success") >= 0) {
                sucCallback();
            } else {
                errCallback();
            }
        },
        error: function () {
            errCallback();
        }
    });
};

function DataTest() {
    testData(function () {
        $(" .loading").fadeOut();
        localStorage.registerProcess_error = 0;
    }, function () {
        localStorage.registerProcess_error++;
        if (localStorage.registerProcess_error < 50) {
            setTimeout(DataTest, 5000);
        }
    })
};

function SetCookie(name, value) {
    //set Cookie value
    var expdate = new Date();
    var argv = arguments;
    var argc = arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    if (expires !== null) {
        expdate.setTime(expdate.getTime() + (expires * 1000 ));
    }

    document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expdate.toGMTString())) + ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
}

function GetCookieVal(offset) {
    //get Cookie value after decoding
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}

function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.GetCookie(name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

function GetCookie(name) {
    //get Cookie original value
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return this.GetCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) {
            break;
        }
    }
}

angular.module("login", ["pascalprecht.translate"])

    .config(function ($translateProvider) {

        var lang = window.localStorage.language || "cn";
        var lanFile = {
            prefix: 'user/i18n/',
            suffix: '.json'
        };
        $translateProvider
            .preferredLanguage(lang)
            .useStaticFilesLoader(lanFile);

    })
    .factory("TT", ["$translate", function ($translate) {
        var T = {
            T: function (key) {
                if (key) {

                    return ($translate.instant(key)).toUpperCase();
                }

                return key.toUpperCase();
            }
        }
        return T;
    }])
    .filter("languageClass", function () {
        return function (input, index) {
            var data = "badge badge-tertiary";
            if (input == index)
                data = "badge badge-secondary";
            return data;
        }
    })
    .controller("logincontroller", ["$scope", "$http", "$translate", "TT", function ($scope, $http, $translate, TT) {
        $scope.loginerror = false;
        $scope.loginValue = {
            "username": "",
            "password": "",
            "usernameoid": "0x01010007",
            "passwordoid": "0x01010008"
        };

        DelCookie('loginFlag');
        DelCookie('auth');
        DelCookie('username');

        $http.get("user/json/login.json")
            .success(function (data) {
                $scope.languageoid = data.languageoid;
                $scope.languageoption = data.languageoption;
                $scope.loginValue.usernameoid = data.usernameoid;
                $scope.loginValue.passwordoid = data.passwordoid;
                
                localStorage.language = localStorage.language || "cn";
                
                $scope.language = localStorage.language;

            }).error(function () {
            $scope.language = "cn";
            localStorage.language = $scope.language;
            console.log(err);
        });
        $translate.use($scope.language);
        $scope.switchLanguage = function (lang) {
            $scope.language = lang;
            $translate.use($scope.language);
            localStorage.language = $scope.language;
            //setMulOid([[$scope.languageoid,$scope.language]]);
        };


        $scope.$watch("loginValue", function () {
            $scope.loginerror = false;
        }, true);

        $scope.login = function () {
            var url = "Page/userProcessFunction.asp";
            var random = (new Date()).getTime();

            
            DelCookie('auth');
            DelCookie('username');

            if (!$scope.loginValue.username || !$scope.loginValue.password) {
                $scope.loginerror = true;
                return;
            }

            $.post(url, {
                reqType: 1,
                username: $scope.loginValue.username,
                password: ($scope.loginValue.password),
                random: random,
                usernameoid: $scope.loginValue.usernameoid,
                passwordoid: $scope.loginValue.passwordoid,
                languageoid: $scope.languageoid,
                language: $scope.language
            }, function (data) {
                if (data != "password_error") {
                    $scope.loginerror = false;

                    SetCookie('username', $scope.loginValue.username, 8000);
                    SetCookie('auth', data, 8000);
                    SetCookie('path', "/", 8000);
                    window.location = "/main.asp#/main";

                } else {
                    $scope.loginerror = true;
                    $scope.$apply();
                }

            });

        }

    }]);
