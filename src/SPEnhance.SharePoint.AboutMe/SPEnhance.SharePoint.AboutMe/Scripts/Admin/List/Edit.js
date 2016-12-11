var listName = decodeURIComponent(getQueryStringParameter("listName"));
var listItemId = decodeURIComponent(getQueryStringParameter("listItemId"));

resumeBuilderApp.controller("EditListDataController", ["$scope", "sharePointService", function ($scope, sharePointService) {
    clearMsg();

    $scope.listName = listName;
    $scope.formData = {}

    var camlQuery = "<View><Query><Where><Eq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>" + listItemId + "</Value></Eq></Where></Query></View>";
    objClient.getListData($scope, sharePointService, listName, "ID," + getFieldsByListName(listName), camlQuery, callbackListDataSuccess, callbackListDataFail);


    $scope.save= function () {
        consoleLog("in save");
        var objFields = [];
        var objField = {};

        angular.forEach($scope.formData, function (value, key) {
            objField = {};
            objField.fieldName = key;
            objField.fieldValue = value;
            objFields.push(objField);

        });

        var jsonListData = { "data": objFields };
        consoleLog(jsonListData);
        objClient.createOrUpdateListItem($scope, sharePointService, listName, listItemId, jsonListData, callbackSaveSuccess, callbackSaveFail);

    }

    $scope.cancel = function () {
        document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
    }
}]);

function callbackListDataSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
    createForm($scope, objfieldsData, listName);
}

function callbackListDataFail(msg) {
    showMsg(msg);
}

function callbackSaveSuccess() {
    document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
}

function callbackSaveFail(sender, args) {
    showMsg(args.get_message());
}

function createForm($scope, objfieldsData, listName) {
    consoleLog(objfieldsData);
    var formHtml = "<div class='form-horizontal'>";
    angular.forEach(listNames.lists, function (v, i) {
        if (v.listName == listName) {
            consoleLog(v.listName + " " + JSON.stringify(v.fields));

            angular.forEach(v.fields, function (w, j) {

                formHtml += "<div class='form-group'>";
                consoleLog(w.fieldInternalName);
                formHtml += "<label for='" + w.fieldInternalName + "' class='col-sm-2 control-label'>" + w.fieldDisplayName + "</label>";
                formHtml += "<div class='col-sm-10'>";

                if (w.fieldType == "Note") {
                    formHtml += "<textarea ng-model='formData." + w.fieldInternalName + "' fieldType='Note' width='100%' rows='5' data='field' class='form-control' id='" + w.fieldInternalName + "' ng-init='formData." + w.fieldInternalName + "=\"" + objfieldsData[0][w.fieldInternalName] + "\"'></textarea>";
                }
                else if (w.fieldType == "URL") {
                    var url = objfieldsData[0][w.fieldInternalName] == null ? "" : objfieldsData[0][w.fieldInternalName].url;
                    var description = objfieldsData[0][w.fieldInternalName] == null ? "" : objfieldsData[0][w.fieldInternalName].description;
                    formHtml += "<div class='form-group'>";
                    formHtml += "<div class='col-sm-5'><label>Url: </label><input ng-model='hyperlink.url' ng-change='formData." + w.fieldInternalName + "=hyperlink.url.length > 0 ? (hyperlink.url + \", \" + hyperlink.description) : \"\"' type='text' class='form-control' id='" + w.fieldInternalName + "_url' ng-init='hyperlink.url=\"" + url + "\"' placeholder='http://www.google.com'/></div>";
                    formHtml += "<div class='col-sm-5'><label>Title: </label><input ng-model='hyperlink.description' ng-change='formData." + w.fieldInternalName + "=hyperlink.description.length > 0 ? (hyperlink.url + \", \" + hyperlink.description) : \"\"' type='text' class='form-control' id='" + w.fieldInternalName + "_description' ng-init='hyperlink.description=\"" + description + "\"' placeholder='Google'/></div>";
                    formHtml += "<input ng-model='formData." + w.fieldInternalName + "' type='hidden' data='field' class='form-control' id='" + w.fieldInternalName + "' ng-init='formData." + w.fieldInternalName + "=\"" + url + ", " + description + "\"'/>";
                    formHtml += "</div>";
                }
                else {
                    formHtml += "<input ng-model='formData." + w.fieldInternalName + "' type='text' data='field' class='form-control' id='" + w.fieldInternalName + "' ng-init='formData."+w.fieldInternalName+"=\""  + objfieldsData[0][w.fieldInternalName] + "\"'/>";
                }
                formHtml += "</div>";
                formHtml += "</div>";
            });

            return false;
        }
    });
    formHtml += "</div>";

    $scope.listForm = formHtml;
}