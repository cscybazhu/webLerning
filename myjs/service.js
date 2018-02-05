/**
 * Created by cuishaoqi on 2017/11/27.
 */
angular.module("myapp")
    .service("config", function ($http) {
        this.getConfig = function (type) {
            return $http({method: 'get', url: "/Page/getData.asp?caseType=13&dataType=" + type, timeout: 4000});
        }
    })
    .service("json", function ($http) {
        this.getJson = function (data, version) {
            return $http.get("user/json/" + data + "?v=" + version);
        }
    })
    .service("submit", function ($http) {

        this.setConfig = function (url, data) {
            if (data) {
                return $http.post(url, data);
            } else {
                return $http.post(url);
            }
        }

    })
    .factory("T", ["$translate", function ($translate) {
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
    /*key:表示删除该下标的数据*/
    .factory("recreatearray", function () {
        var CreateArray = {
            T: function (str, key, oid) {

                if (oid) {//add one
                    if (key == 0) {
                        str.unshift(oid);
                    } else if (key == str.length - 1) {
                        str.push(oid);
                    } else {
                        var tmp1, tmp2;
                        tmp1 = str.slice(0, key);
                        tmp1.push(oid);
                        tmp2 = str.slice(key + 1);
                        str = tmp1.concat(tmp2);
                    }
                    return str;
                }

                if (key == 0) {//delete one
                    str.shift();
                } else if (key == str.length - 1) {
                    str.pop();
                } else {
                    var tmp1, tmp2;
                    tmp1 = str.slice(0, key);
                    tmp2 = str.slice(key + 1);
                    str = tmp1.concat(tmp2);
                }

                return str;
            }
        }
        return CreateArray;
    })
    .factory("createnewarray", function () {
        var CreateArray = {
            T: function (str) {
                var tmp = [];
                for (var i = 0; i < str; i++) {
                    tmp.push(i);
                }
                return tmp;
            }
        }
        return CreateArray;
    })
    .factory("creatform", function (T) {
        var creatform = {
            form: function (formStr, index, clickfun) {

                var objtmp = formStr;
                var tmphtml, html = '';
                var label = [], show = [], type = [], option = {}, readonly = [], name = [], model = [], pattern = [], info = [], min = [], max = [];
                //for(var keys in objtmp){
                var key = 0;
                $.each(objtmp, function (keys, val) {
                    key = keys;
                    if (keys == 0) {
                        return true;
                        //continue;
                    }

                    label.push(objtmp[keys].label);
                    show.push(objtmp[keys].show);

                    if (objtmp[keys].option) {

                        var option = '{';
                        $.each(objtmp[keys].option, function (i, j) {
                            option = option + "'" + i + "':" + "'" + j + "',";
                        })
                        
                        option = option + '}';
                    }


                    objtmp[keys].pattern = (objtmp[keys].pattern == 0) ? "nochinese" : objtmp[keys].pattern;
                    tmphtml = '';
                    var tmpshoworhide = 1, tmpreadonly = 0;
                    if (objtmp[keys].show) {

                        if ("object" == typeof objtmp[keys].show) {
                            tmpshoworhide = "(";
                            $.each(objtmp[keys].show, function (i) {
                                $.each(objtmp[keys].show[i], function (j) {
                                    tmpshoworhide += "configForm" + index + "." + i + ".$modelValue==\'" + objtmp[keys].show[i][j] + "\' || "

                                });

                                tmpshoworhide += '0) && ';
                            });

                            tmpshoworhide += "1";
                        }

                        if ("object" == typeof objtmp[keys].readonly) {
                            tmpreadonly = "(";
                            for (var i in objtmp[keys].readonly) {

                                for (var j in objtmp[keys].readonly[i]) {
                                    tmpreadonly += "configForm" + index + "." + i + ".$modelValue==\'" + objtmp[keys].readonly[i][j] + "\' || "
                                }

                                tmpreadonly += '0) && ';
                            }
                            tmpreadonly += "1";
                        } else if (objtmp[keys].readonly == 1) {
                            tmpreadonly = 1;
                        }

                        switch (objtmp[keys].type) {

                            case 'password':
                                tmphtml = '<div class="control-group" id="' + objtmp[keys].name + '" ng-if="' + tmpshoworhide + '">' +
                                    '<label class="control-label">' + T.T(objtmp[keys].label) + '</label>' +
                                    '<div class="controls">' +
                                    '<input type=password name="' + objtmp[keys].name + '" ng-model="formElement.data[' + index + '].' + objtmp[keys].name + '[0]" ' +
                                    ' ng-readonly="' + tmpreadonly +
                                    '" ' + objtmp[keys].pattern + '-format ' +
                                    ' mins=' + objtmp[keys].min +
                                    ' maxs=' + objtmp[keys].max +
                                    ' />' +
                                    ' <span id="eye' + keys + '" style="vertical-align:middle;cursor:pointer" class="icon-eye-open" onclick="var e = document.getElementById(\'eye' + keys + '\').previousSibling.previousSibling;e.type = (e.type==\'password\') ? \'text\' : \'password\';$(this).toggleClass(\'icon-eye-close icon-eye-open\')"></span>' +
                                    '<' + objtmp[keys].pattern + ' value="configForm' + index + '.' + objtmp[keys].name + '.$error.' + objtmp[keys].pattern + 'Format" min="' + objtmp[keys].min + '" max="' + objtmp[keys].max + '" />' +
                                    objtmp[keys].info + '<span ng-show="false">{{formElement.data[' + index + '].' + objtmp[keys].name + '[1]=' + tmpshoworhide + '-' + tmpreadonly + '}}</span>' +
                                    '</div></div>';
                                break;
                            case 'select':
                                tmphtml = '<div class="control-group" id="' + objtmp[keys].name + '" ng-if="' + tmpshoworhide + '">' +
                                    '<label class="control-label">' + T.T(objtmp[keys].label) + '</label>' +
                                    '<div class="controls">' +
                                        //'<select name="' + objtmp[keys].name + '" ng-model="formElement.data['+index+'].'+ objtmp[keys].name + '[0]" '+
                                        //    'ng-disabled='+tmpreadonly + ' >'+
                                        //    '<option ng-repeat="(x,y) in ' + option +'" value="{{x}}">{{y | translate}}</option>'+
                                        //'</select>'+ objtmp[keys].info + ' '+'<span ng-show="false">{{formElement.data['+index+ '].'+objtmp[keys].name+'[1]='+tmpshoworhide+'-'+ tmpreadonly +'}}</span>'+
                                    '<select ng-model="formElement.data[' + index + '].' + objtmp[keys].name + '[0]" ng-options="y as x for (y,x) in ' + option + '"></select>' +
                                    '</div></div>';
                                break;
                            case 'radio':
                                tmphtml = '<div class="control-group" id="' + objtmp[keys].name + '" ng-if="' + tmpshoworhide + '">' +
                                    '<label class="control-label">' + T.T(objtmp[keys].label) + '</label>' +
                                    '<div class="controls">' +
                                    '<label class="radio" ng-repeat="(x,y) in ' + option + '" >' +
                                    '<input type=radio name="' + objtmp[keys].name + '" ng-value="{{x}}" ng-model="formElement.data[' + index + '].' + objtmp[keys].name + '[0]" ' +
                                    'ng-disabled=' + tmpreadonly + ' >' +
                                    '{{y | translate}}' +
                                    '</label>' + '<span ng-show="false">{{formElement.data[' + index + '].' + objtmp[keys].name + '[1]=' + tmpshoworhide + '-' + tmpreadonly + '}}</span>' +
                                    '</div></div>';
                                break;
                            case 'span':
                                tmphtml = '<div class="control-group" id="' + objtmp[keys].name + '" ng-if="' + tmpshoworhide + '">' +
                                    '<label class="control-label">' + T.T(objtmp[keys].label) + '</label>' +
                                    '<div class="controls">' +
                                    '<label class="radio" style="padding-left: 0" ng-bind="formElement.data[' + index + '].' + objtmp[keys].name + '[0]"></label>' +
                                    '</div></div>';
                                break;
                            case 'checkbox':
                                tmphtml = '<div class="control-group" id="' + objtmp[keys].name + '" ng-if="' + tmpshoworhide + '">' +
                                    '<label class="control-label">' + T.T(objtmp[keys].label) + '</label>' +
                                    '<div class="controls">' +
                                    '<label class="checkbox" ng-repeat="(x,y) in ' + option + '">' +
                                    '<input type=checkbox name="' + objtmp[keys].name + '" ng-model="formElement.data[' + index + '].' + objtmp[keys].name + '[0][x]" ' +
                                    ' ng-disabled="' + tmpreadonly +
                                    '" ng-true-value={{x}} ' +
                                        //' ng-false-value="0" '+
                                    '/>{{y | translate}}' +
                                    '</label>' + '<span ng-show="false">{{formElement.data[' + index + '].' + objtmp[keys].name + '[1]=' + tmpshoworhide + '-' + tmpreadonly + '}}</span>' +
                                    '</div></div>';
                                break;
                            case 'text':
                                tmphtml = '<div class="control-group"id="' + objtmp[keys].name + '" ng-if="' + tmpshoworhide + '">' +
                                    '<label class="control-label">' + T.T(objtmp[keys].label) + '</label>' +
                                    '<div class="controls">' +
                                    '<input type=text name="' + objtmp[keys].name + '" ng-model="formElement.data[' + index + '].' + objtmp[keys].name + '[0]" ' +
                                    ' ng-readonly="' + tmpreadonly +
                                    '" ' + objtmp[keys].pattern + '-format ' +
                                    ' mins=' + objtmp[keys].min +
                                    ' maxs=' + objtmp[keys].max +
                                    ' />' + objtmp[keys].info + '<span ng-show="false">{{formElement.data[' + index + '].' + objtmp[keys].name + '[1]=' + tmpshoworhide + '-' + tmpreadonly + '}}</span>' +
                                    '<' + objtmp[keys].pattern + ' value="configForm' + index + '.' + objtmp[keys].name + '.$error.' + objtmp[keys].pattern + 'Format" min="' + objtmp[keys].min + '" max="' + objtmp[keys].max + '" />' +
                                    '</div></div>';
                                break;
                            case 'file':
                                tmphtml = '<div class="control-group" id="' + objtmp[keys].name + '">' +
                                    '<!--[if lte IE 8]><p style="color:indianred">{{"UpdateBrowser" | translate}}</p><![endif]-->' +
                                    '<label class="control-label">' + T.T(objtmp[keys].label) + '</label>' +
                                    '<div class="controls">' +
                                    '<input type=file name="' + objtmp[keys].name + '" ng-model="formElement.data[' + index + '].' + objtmp[keys].name + '[0]" ' +
                                    ' />' + objtmp[keys].info +
                                    '</div></div>';

                                break;
                            case 'table':
                                tmphtml = '<table class="table table-bordered table-striped lora">' +
                                    '<thead><tr>' +
                                    '<th ng-repeat="x in ' + option + '">{{x | translate | uppercase}}</th>' +
                                    '<th ng-if="!' + objtmp[keys].readonly + '">' + T.T("config") + '</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr ng-repeat="(index,value) in formElement.data[' + index + '].' + objtmp[keys].name + '[0] | limitBetween:startList:endList" >' +
                                    '<td>{{index+1+currentPage*amount}}</td>' +
                                    '<td ng-repeat="(y,x) in value track by $index"><span ng-if="tableEdit[index] || tableReadonly[y]">{{x}}</span><input ng-if="tableCancel[index] && !tableReadonly[y]" maxlength="65" id="table{{index}}{{y}}" type="text" style="width:100px" ng-model="x" /></td>' +
                                    '<td width="30%" ng-if="!' + objtmp[keys].readonly + '"><span class="btn btn-danger" ng-click="tableConfig(value,index,0)">' + T.T("delete") + '</span>&nbsp;' +
                                    '<span ng-if="tableEdit[index]" class="btn btn-info" ng-click="tableConfig(value,index,1)">' + T.T("edit") + '</span>&nbsp;' +
                                    '<span ng-if="tableCancel[index]" class="btn btn-inverse" ng-click="tableConfig(value,index,2)">' + T.T("cancel") + '</span>&nbsp;' +
                                    '<span ng-if="tableSave[index]" class="btn btn-primary" ng-click="tableConfig(value,index,3)">' + T.T("save") + '</span></td>' +
                                    '</tr>' +
                                    '<tr ng-if="tableAddShow">' +
                                    '<td>#</td>' +
                                    '<td ng-repeat="(y,x) in tableTrAddValue track by $index"><input  maxlength="65" id="tableadd{{y}}" name="tableadd{{y}}" type="text" style="width:100px" /></td>' +
                                    '<td width="30%"><span class="btn btn-danger" ng-click="tableConfig(value,\'#\',0)">' + T.T("delete") + '</span>&nbsp;' +
                                    '<span class="btn btn-primary" ng-click="tableConfig(value,\'#\',3)">' + T.T("save") + '</span></td>' +
                                    '</tr>' +
                                    '<tr ng-if="!' + objtmp[keys].readonly + '"><td colspan="{{tableReadonly.length+2}}"><span ng-if="addButtonShow" class="btn btn-info" ng-click="tableConfig(value,index,7)">' + T.T("add") + '</span><page /></td></tr>' +
                                    '</tbody>' +
                                    '</table>';
                                break;

                        }
                    }

                    html = html + tmphtml;
                })
                //}

                var style, icon, formtype, formaction;

                if (objtmp[0].pattern != 0) {
                    label = objtmp[0].label;
                    style = "background:white;border-top:0";
                    icon = objtmp[0].min;
                    btnname = objtmp[0].max;
                    formaction = "/goform/uploadConfigFile";
                    formtype = "multipart/form-data";
                } else {
                    label = '';
                    style = '';
                    icon = '';
                    formaction = '';
                    formtype = '';
                    btnname = '';
                }

                var submit = ' <div class="form-actions" style=' + style + '>' +
                    '<submit form-Element="formElement" disabled="configForm' + index + '.$invalid" label="' + label + '" buttonname="' + btnname + '" formindex="' + index + '" icon="' + icon + '" ></submit> </div>' +
                    ' </fieldset></form>';
                var title = '<h6 class="title">' + T.T(objtmp[0].label) + '</h6>';
                var form = ' <form method="post"  id="configForm' + index + '"  name="configForm' + index + '" class="form-horizontal" novalidate="novalidate" autocomplete="off" action="' + formaction + '" enctype="' + formtype + '" ><fieldset ng-cloak>';

                if (objtmp[key].type == "table") {
                    submit = ' </fieldset></form>';
                }

                html = title + form + html + submit;

                return html;
            }

        }

        return creatform;
    })

;