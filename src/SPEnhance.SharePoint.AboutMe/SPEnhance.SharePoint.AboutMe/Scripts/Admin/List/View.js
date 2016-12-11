var listName = decodeURIComponent(getQueryStringParameter("listName"));

resumeBuilderApp.controller('ViewListDataController', ['$scope', 'sharePointService', function ($scope, sharePointService) {
    clearMsg();

    $scope.listName = listName;

    $scope.displayNewButton = true;
    $scope.displayDeleteAllButton = false;

    objClient.getListData($scope, sharePointService, listName, "ID," + getFieldsByListName(listName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackListSuccess, callbackFail);

    $scope.new = function () {
        document.location = "new.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
    }

    $scope.deleteAll = function () {
        clearMsg();
        deleteAllListData($scope, sharePointService, listName);
    }

    $scope.deleteListItem = function (listItemId) {
        clearMsg();
        if (confirm("Are you sure you want to delete?"))
            objClient.deleteListData($scope, sharePointService, listName, listItemId, callbackDeleteItemSuccess, callbackDeleteItemFail);
    }
}]);

function callbackListSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
    var fieldInternalNamesArray = commaSeperatedFieldInternalNames.split(',');
    var html = "";
    if (objfieldsData.length > 0) {
        if (getListMaxRows(listName) == 1) {
            $scope.displayNewButton = false;
            $scope.displayDeleteAllButton = false;
        }
        else
            $scope.displayDeleteAllButton = true;

        html += "<div class='table-responsive'><table class='table table-hover'";
        html += "<tr>";
        for (var j = 0 ; j < fieldInternalNamesArray.length ; j++) {
            html += "<th>" + getFieldDisplayNameByListFieldInternalName(listName, fieldInternalNamesArray[j]) + "</th>";
        }
        html += "<th></th>";
        html += "</tr>";
        for (var i = 0 ; i < objfieldsData.length ; i++) {
            html += "<tr>";
            for (j = 0 ; j < fieldInternalNamesArray.length ; j++) {
                var fieldType = getFieldTypeByListFieldInternalName(listName, fieldInternalNamesArray[j]);
                consoleLog("fieldType: " + fieldType);
                html += "<td>";
                if (objfieldsData[i][fieldInternalNamesArray[j]] == null || objfieldsData[i][fieldInternalNamesArray[j]] == "undefined")
                    html += "&nbsp;";
                else {
                    if (fieldType == "URL") {
                        consoleLog(objfieldsData[i][fieldInternalNamesArray[j]]);
                        html += "<a href='" + objfieldsData[i][fieldInternalNamesArray[j]].url + "' target='_blank'>" + objfieldsData[i][fieldInternalNamesArray[j]].description + "</a>";
                    }
                    else
                        html += objfieldsData[i][fieldInternalNamesArray[j]];
                }
                html += "</td>";
            }
            html += "<td>";
            html += "<a href='" + appWebUrl + "/Pages/Admin/List/Edit.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&listItemId=" + objfieldsData[i]["ID"] + "&SPHostUrl=" + hostWebUrl + "'>Edit</a> | ";
            html += "<a class='deleteItem' ng-click='deleteListItem(" + objfieldsData[i]["ID"] + ")' data='" + objfieldsData[i]["ID"] + "'>Delete</a>";
            html += "</td>";
            html += "</tr>";
        }
        html += "</table></div>";
        $scope.listData = html;
    }
    else {
        $scope.listData = "No data exist.";
        $scope.displayNewButton = true;
        $scope.displayDeleteAllButton = false;
    }
}

function callbackFail(msg) {
    consoleLog(msg);
}

function deleteAllListData($scope, sharePointService, listName) {
    if (confirm("Are you sure you want to delete all list data?")) {
        objClient.deleteAllListData($scope, sharePointService, listName, callbackDeleteAllListDataSuccess, callbackDeleteAllListDataFail);
    }
}

function callbackDeleteAllListDataSuccess($scope, sharePointService, listName) {
    showMsg("All list data has been deleted.");
    objClient.getListData($scope, sharePointService, listName, "ID," + getFieldsByListName(listName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackListSuccess, callbackFail);
}

function callbackDeleteAllListDataFail(msg) {
    showMsg(msg);
}

function callbackDeleteItemSuccess($scope, sharePointService, listItemId) {
    showMsg("List data with Id '" + listItemId + "' has been deleted.");
    objClient.getListData($scope, sharePointService, listName, "ID," + getFieldsByListName(listName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackListSuccess, callbackFail);
}

function callbackDeleteItemFail(msg) {
    showMsg(msg);
}