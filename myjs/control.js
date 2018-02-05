/**
 * Created by cuishaoqi on 2017/11/27.
 */
angular.module("myapp")
    .controller("home", ["$scope", "T", function ($scope, T) {
        var url = "Page/userProcessFunction.asp";
        $scope.logout = function () {
            if ($.browser.version == "8.0") {

                confirm(T.T("logout"), T.T("logoutquestion"), function (isConfirm) {
                    if (isConfirm) {
                        $.post(url, {
                            reqType: 2,
                            auth: GetCookie("auth") || "auth"
                        }, function (data) {
                            DelCookie('auth');
                            DelCookie('username');
                            localStorage.logout = data;
                            window.location.href = 'home.asp';

                        });
                        //after click the confirm
                    } else {
                        //after click the cancel
                    }
                }, {confirmButtonText: T.T("sure"), cancelButtonText: T.T("cancel"), width: 400});
            } else {

                swal({
                    title: T.T("logout"),
                    text: T.T("logoutquestion"),
                    type: "warning",
                    showCancelButton: true,
                    showconfirmButton: false,
                    confirmButtonColor: "#7da64b",
                    confirmButtonText: T.T("sure"),
                    cancelButtonText: T.T("cancel"),
                    closeOnConfirm: false

                }, function () {

                    $.post(url, {
                        reqType: 2,
                        auth: GetCookie("auth") || "auth"
                    }, function (data) {
                        DelCookie('auth');
                        DelCookie('username');
                        localStorage.logout = data;
                        window.location.href = 'home.asp';

                    });

                })
            }


        };

    }])
    .controller("network", ["$scope", "$compile", function ($scope, $compile) {

    }])
    .controller("system", ["$scope", function ($scope) {

    }])
    .controller("advanced", ["$scope", function ($scope) {

    }])
    .controller("lte", ["$scope", function ($scope) {

    }])
