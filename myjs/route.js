/**
 * Created by cuishaoqi on 2017/11/27.
 */
angular.module("Routing", ["ui.router"])
    .provider("routermenu", function ($stateProvider) {

        var urlCollection;
        this.$get = function ($http, $state) {
            return {
                setUpRoutes: function () {
                    var views;
                    $http.get(urlCollection).success(function (collection) {
                        $.each(collection, function (x, data) {
                            var routeName = collection[x].sref;
                            if (routeName && !$state.get(routeName)) {
                                if (routeName.indexOf(".") >= 0) {
                                    views = {
                                        "config": {templateUrl: "config/config.html"}
                                    };
                                } else {
                                    views = {
                                        "body": {templateUrl: "config/body.html"}
                                    };
                                    if (collection[x].controller) {
                                        views.body.controller = collection[x].controller;
                                    }
                                }
                                $stateProvider.state(routeName, {
                                    url: collection[x].url,
                                    views: views
                                });
                            }
                        })
                        /*for (var x in collection){
                         var routeName = collection[x].sref;
                         if(routeName && !$state.get(routeName)){
                         if(routeName.indexOf(".")>=0){
                         views = {
                         "config" : {templateUrl : "config/config.html"}
                         };
                         } else {
                         views = {
                         "body" : {templateUrl : "config/body.html"}
                         };
                         if(collection[x].controller){
                         views.body.controller = collection[x].controller;
                         }
                         }
                         $stateProvider.state(routeName,{
                         url : collection[x].url,
                         views : views
                         });
                         }
                         }*/

                    });
                }
            }
        };
        this.setCollectionUrl = function (url) {
            urlCollection = url;
        }
    });
angular.module("myapp", ["ui.router", "pascalprecht.translate", "Routing"])

    .config(function ($stateProvider, $urlRouterProvider, $translateProvider, routermenuProvider) {

        var url = "Page/userProcessFunction.asp";
        $.post(url, {
            reqType: 3
        }, function (data) {
            if (data.indexOf("error") >= 0) {
                window.location = "/home.asp";
                return;
            }
        });

        var lang = window.localStorage.language || "cn";
        var lanFile = {
            prefix: 'user/i18n/',
            suffix: '.json'
        };
        $translateProvider
            .preferredLanguage(lang)
            .useStaticFilesLoader(lanFile);

        $stateProvider
            .state('main', {
                url: "/main" + "?v=" + GetCookie("loginFlag"),
                views: {
                    "body": {templateUrl: "config/body.html", controller: "home"}
                }
            });

        routermenuProvider.setCollectionUrl("user/json/route.json?v=20171124");
        $urlRouterProvider.otherwise("/main");

    })

    .run(["$rootScope", "$location", "$state", "$interval", "json", "routermenu", "T", "recreatearray", "createnewarray", function ($rootScope, $location, $state, $interval, json, routermenu, T, recreatearray, createnewarray) {
        var version = 20180131, tableOids, tableOidsList = [], tableName, tableIndex, formOids, tableCount = [], amount = 0, count = 0;


        routermenu.setUpRoutes();

        $rootScope.location = $location.path();

        json.getJson("form.json", version).success(function (data) {
            var program = data[0].program, i = -1;
            $rootScope.formElements = {};

            $.each(data, function (index, value) {
                if (data[index].program == program) {
                    i++;
                } else {
                    program = data[index].program;
                    i = 0;
                }

                if (!$rootScope.formElements[program]) {
                    $rootScope.formElements[program] = [];
                }

                $rootScope.formElements[program].push({
                    "type": data[index].type,
                    "label": data[index].label,
                    "name": data[index].name,
                    "pattern": data[index].pattern,
                    "min": data[index].min,
                    "max": data[index].max,
                    "show": data[index].show,
                    "oid": data[index].oid,
                    "readonly": data[index].readonly,
                    "option": data[index].option,
                    "info": (data[index].info) ? ("&nbsp;(" + data[index].info + ")") : ''
                })
            });


        }).error(function () {
            toastr.clear();
            toastr.error(T.T("gettingData") + ": form.json");
        });

        json.getJson("tree.json", version).success(function (data) {
            $rootScope.headTree = data;
        }).error(function () {
            toastr.clear();
            toastr.error(T.T("gettingData") + ": tree.json");
        });


        $rootScope.$watch("location", function () {

            $rootScope.formElement = {
                "form": [],
                "data": []
            };
            
            //console.log($rootScope.location[1])
            /*get current form oids and get data from database*/
            if ($rootScope.location.length > 2)
                return;
            var forms = $rootScope.formElements[$rootScope.location[1]] || 0;
            var i = 0, form = [];

            //当没有该项表单时，直接返回
            if (forms == 0) {
                return;
            }

            $.each(forms, function (keys, val) {
                if (forms[keys].type == "form") {
                    if (i > 0) {
                        $rootScope.formElement.form.push(form);
                        form = [];
                    }
                    i++;
                }
                form.push(forms[keys]);
            });
            $rootScope.formElement.form.push(form);

            //console.log($rootScope.formElement.form[0]);


            var formNames, formSubmit, datas, tmpData, diff, mask, tmpoids = [], errorFlag = 0, tmpval;

            $.each($rootScope.formElement.form, function (x, vals) {
                datas = {};
                $.each($rootScope.formElement.form[x], function (y, val) {
                    if (y == 0 || $rootScope.formElement.form[x][y].oid == 0) {
                        return true;
                        //continue;
                    }
                    formOids = $rootScope.formElement.form[x][y].oid;


                    formNames = $rootScope.formElement.form[x][y].name;
                    if ("number" == (typeof $rootScope.formElement.form[x][y].show) && "number" == (typeof $rootScope.formElement.form[x][y].readonly))
                        formSubmit = $rootScope.formElement.form[x][y].show - $rootScope.formElement.form[x][y].readonly;
                    else
                        formSubmit = [$rootScope.formElement.form[x][y].show, $rootScope.formElement.form[x][y].readonly];

                    if ($rootScope.formElement.form[x][y].type == "checkbox") {
                        tmpDatai = getMulOid([formOids])[0] || "--";
                        tmpDatai = tmpDatai.split(",");
                        tmpi = 0;
                        tmpData = {};
                        $.each($rootScope.formElement.form[x][y].option, function (yy, vals) {
                            tmpData[yy] = Number(tmpDatai[tmpi]);
                            tmpi++;
                        })

                        //console.log(tmpData)

                    } else if ($rootScope.formElement.form[x][y].type == "table") {
                        var tableEdit = [], tableCancel = [], tableSave = [], tableReadonly = [];
                        count = 0;
                        tmpData = [];
                        tableName = formNames;//only one table
                        tableIndex = x;
                        mask = getMulOid(formOids[0])[0] || -1;

                        tableOids = formOids;

                        $rootScope.amount = $rootScope.formElement.form[x][y].min;
                        amount = $rootScope.amount;
                        if (parseInt(mask) > 0) {
                            for (var m = 0; m < 16; m++) {
                                tmpoids = [];
                                if (mask & (1 << m)) {
                                    for (var s = 1; s < formOids.length; s++) {
                                        diff = (formOids[s][1] - formOids[s][0] + 1) / 16 - 1;
                                        tmpoids.push("0x" + (Number(formOids[s][0]) + m * (Math.pow(16, diff))).toString(16));
                                        if (count == 0) {
                                            tableReadonly.push(formOids[s][2]);
                                        }
                                        console.log(s)
                                    }

                                    count++;

                                    if (tmpoids.length > 0) {
                                        tmpval = getMulOid(tmpoids);
                                        if (tmpval < 0) {
                                            errorFlag++;
                                            tmpval = [];
                                        }
                                        tmpData.push(tmpval);
                                        tableEdit.push(true);
                                        tableCancel.push(false);
                                        tableSave.push(false);
                                        tableOidsList.push(tmpoids);
                                    }
                                }

                            }
                        }

                        if (mask == -1 || errorFlag > 0) {
                            toastr.clear();
                            toastr.error(T.T("gettingData"));
                        }

                        $rootScope.tablecount = createnewarray.T(Math.ceil(count / Number(amount)));


                        $rootScope.tableEdit = tableEdit;
                        $rootScope.tableCancel = tableCancel;
                        $rootScope.tableSave = tableSave;
                        $rootScope.tableReadonly = tableReadonly;
                        $rootScope.currentPage = 0;
                        $rootScope.startList = 0;
                        $rootScope.endList = amount;
                        $rootScope.tableAddShow = false;
                        $rootScope.tableTrAddValue = createnewarray.T(s - 1);

                        if (count >= 16) {
                            $rootScope.addButtonShow = false;
                        } else {
                            $rootScope.addButtonShow = true;
                        }


                    } else {
                        tmpData = getMulOid([formOids])[0] || "--";

                    }

                    if ($rootScope.location[1] == "password") {
                        datas[formNames] = ['', '', tmpData];
                    } else {
                        datas[formNames] = [tmpData, formSubmit];
                    }
                })
                
                $rootScope.formElement.data.push(datas);

            });


        });
        $rootScope.$on("$stateChangeStart", function (eve, toState, formState) {
            //console.log($location.path())

        });

        $rootScope.$on('$viewContentLoading', function () {
            $(" .loading").show();

        });
        $rootScope.$on('$viewContentLoaded', function () {
            $(" .loading").fadeOut("slow");

        });

        $rootScope.$on("$stateChangeSuccess", function (eve, toState, formState) {
            //主页的状态界面

            if (toState.name.indexOf("main") >= 0) {
                json.getJson("overview.json", version).success(function (data) {

                    var title = data[0].title, i = -1, errorFlag = 0, tmpval;
                    $rootScope.overView = {};

                    $.each(data, function (index, val) {
                        if (data[index].title == title) {
                            i++;
                        } else {
                            title = data[index].title;
                            i = 0;
                        }

                        if (!$rootScope.overView[title]) {
                            $rootScope.overView[title] = [];
                        }

                        tmpval = getMulOid([data[index].oid]);
                        if (tmpval == -1) {
                            errorFlag++;
                        }
                        $rootScope.overView[title].push({
                            "name": data[index].name,
                            "oid": data[index].oid,
                            "val": data[index].option[tmpval[0]] || "--"
                        })
                    });
                    if (errorFlag > 0) {
                        toastr.clear();
                        toastr.error(T.T("gettingData"));
                    }


                }).error(function () {
                    toastr.clear();
                    toastr.error(T.T("gettingData") + ": overview.json");
                });
            }

            $rootScope.formElement = {
                "data": [],
                "form": []
            };

            $rootScope.location = toState.name.split(".");
            if ($rootScope.location.length == 1) {
                $rootScope.location[1] = $rootScope.location[0];
            }

            /*get current menu object*/
            $.each($rootScope.headTree, function (keys, val) {
                if ($rootScope.headTree[keys].name == $rootScope.location[1]) {
                    $rootScope.headTree.currentMenu = $rootScope.headTree[keys];
                    return false;
                    //break;
                }
            });


            /*get current form oids and get data from database*/
            var forms = $rootScope.formElements[$rootScope.location[1]] || 0;
            var i = 0, form = [];

            //当没有该项表单时，直接返回
            if (forms == 0) {
                return;
            }

            $.each(forms, function (keys, val) {
                if (forms[keys].type == "form") {
                    if (i > 0) {
                        $rootScope.formElement.form.push(form);
                        form = [];
                    }
                    i++;
                }
                form.push(forms[keys]);
            });


            $rootScope.formElement.form.push(form);


        });

        /*删除表格中的第str+1数据*/


        $rootScope.tableConfig = function (str, index, pro) {
            var DELETE = 0, EDIT = 1, CANCEL = 2, SAVE = 3,
                PREVPAGE = 4, NEXTPAGE = 6, PAGE = 5,
                ADD = 7;

            if (pro == DELETE) {
                var tmpPage = $rootScope.tablecount;
                count--;
                $rootScope.tablecount = createnewarray.T(Math.ceil(count / Number(amount)));

                if ($rootScope.currentPage > 0 && $rootScope.tablecount.length < tmpPage.length) {
                    $rootScope.currentPage--;
                    $rootScope.startList = $rootScope.startList - amount;
                    $rootScope.endList = $rootScope.endList - amount;
                }

                if (count >= 16) {
                    $rootScope.addButtonShow = false;
                } else {
                    $rootScope.addButtonShow = true;
                }

                if (index == '#') {
                    $rootScope.tableAddShow = false;
                    return;
                }
                var tmpDeleteData = $rootScope.formElement.data[tableIndex][tableName][0];
                var maskValue = getMulOid(tableOids[0])[0];

                for (var listIndex = 0, tmp = 0; listIndex < 16; listIndex++) {
                    if (maskValue & (1 << listIndex)) {
                        if (tmp == (index + $rootScope.currentPage * amount)) {
                            maskValue &= ~(1 << listIndex);
                            break;
                        }
                        tmp++;
                    }
                }

                $rootScope.formElement.data[tableIndex][tableName][0] = recreatearray.T(tmpDeleteData, tmp);
                tableOidsList = recreatearray.T(tableOidsList, tmp);

                setMulOid([[tableOids[0][0], maskValue]]);
            } else if (pro == EDIT) {
                $rootScope.tableEdit[index] = false;
                $rootScope.tableCancel[index] = true;
                $rootScope.tableSave[index] = true;
            } else if (pro == CANCEL) {
                $rootScope.tableEdit[index] = true;
                $rootScope.tableCancel[index] = false;
                $rootScope.tableSave[index] = false;
            } else if (pro == SAVE) {
                var setValues = [];
                if (index == '#') {
                    var tmpoids = [], diff, tmp = [];
                    var maskValue = getMulOid(tableOids[0])[0];

                    for (var listIndex = 0; listIndex < 16; listIndex++) {
                        if (!(maskValue & (1 << listIndex))) {
                            maskValue |= (1 << listIndex);
                            break;
                        }
                    }
                    setValues.push([tableOids[0], maskValue]);
                    for (var s = 1; s < formOids.length; s++) {
                        diff = (formOids[s][1] - formOids[s][0] + 1) / 16 - 1;
                        tmpoids.push("0x" + (Number(formOids[s][0]) + listIndex * (Math.pow(16, diff))).toString(16));
                    }

                    for (var s = 0; s < $rootScope.tableTrAddValue.length; s++) {
                        setValues.push([tmpoids[s], $("#tableadd" + s).val()]);
                        tmp.push($("#tableadd" + s).val());
                    }
                    $rootScope.tableAddShow = false;
                    setMulOid(setValues);
                    $rootScope.formElement.data[tableIndex][tableName][0].push(tmp);

                    $rootScope.tablecount = createnewarray.T(Math.ceil(count / Number(amount)));
                    if (listIndex < amount) {
                        $rootScope.tableEdit[listIndex] = true;
                    }
                    tableOidsList = recreatearray.T(tableOidsList, listIndex, tmpoids);

                    return;
                }

                $rootScope.tableEdit[index] = true;
                $rootScope.tableCancel[index] = false;
                $rootScope.tableSave[index] = false;

                for (var tmp = 0; tmp < str.length; tmp++) {

                    if ($rootScope.tableReadonly[tmp] == 1) {
                        /*只读*/
                        continue;
                    }

                    setValues.push([tableOidsList[index + $rootScope.currentPage * amount][tmp], $("#table" + index + tmp).val()]);
                    $rootScope.formElement.data[tableIndex][tableName][0][index + $rootScope.currentPage * amount][tmp] = $("#table" + index + tmp).val();
                }

                setMulOid(setValues);
            } else if (pro == ADD) {
                count++;
                $rootScope.tableAddShow = true;
                if (count >= 16) {
                    $rootScope.addButtonShow = false;
                } else {
                    $rootScope.addButtonShow = true;
                }


            } else if (pro == PREVPAGE) {
                if ($rootScope.currentPage > 0) {
                    $rootScope.currentPage--;
                    $rootScope.startList = $rootScope.startList - amount;
                    $rootScope.endList = $rootScope.endList - amount;
                }
            } else if (pro == PAGE) {
                $rootScope.currentPage = index;
                $rootScope.startList = index * amount;
                $rootScope.endList = $rootScope.startList + amount;
            } else if (pro == NEXTPAGE) {
                if ($rootScope.currentPage < $rootScope.tablecount.length - 1) {
                    $rootScope.currentPage++;
                    $rootScope.startList = $rootScope.startList + amount;
                    $rootScope.endList = $rootScope.endList + amount;

                }
            }
        }

    }]);