var listName = decodeURIComponent(getQueryStringParameter("listName"));

resumeBuilderApp.controller('NewListDataController', ['$scope', 'sharePointService', function ($scope, sharePointService) {
    consoleLog("in NewListDataController");

    clearMsg();
    
    $scope.listName = listName;
    $scope.formData = {};
    $scope.hyperlink = {};

    $scope.save = function () {
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
        objClient.createOrUpdateListItem($scope, sharePointService, listName, 0, jsonListData, callbackSaveSuccess, callbackSaveFail);
    }

    $scope.cancel = function () {
        document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
    }

    $scope.createForm = function () {
        clearMsg();
        $scope.listForm = createForm(listName);
    }

    $scope.createForm();
}]);

function callbackSaveSuccess() {
    document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
}

function callbackSaveFail(args) {
    showMsg(args.get_message());
}

function createForm(listName) {
    var formHtml = "<div class='form-horizontal'>";
    angular.forEach(listNames.lists, function (v, i) {
        if (v.listName == listName) {
            angular.forEach(v.fields, function (w, j) {
                formHtml += "<div class='form-group'>";
                formHtml += "<label for='" + w.fieldInternalName + "' class='col-sm-2 control-label'>" + w.fieldDisplayName + "</label>";
                formHtml += "<div class='col-sm-10'>";

                if (w.fieldType == "Note") {
                    formHtml += "<textarea ng-model='formData."+w.fieldInternalName+"' width='100%' rows='5' data='field' class='form-control' id='" + w.fieldInternalName + "'/>";
                }
                else if (w.fieldType == "URL") {
                    formHtml += "<div class='form-group'>";
                    formHtml += "<div class='col-sm-5'><label>Url: </label><input ng-model='hyperlink.url' ng-change='formData." + w.fieldInternalName + "=hyperlink.url.length > 0 ? (hyperlink.url + \", \" + hyperlink.description) : \"\"' type='text' class='form-control' id='" + w.fieldInternalName + "_url' placeholder='http://www.google.com'/></div>";
                    formHtml += "<div class='col-sm-5'><label>Title: </label><input ng-model='hyperlink.description' ng-change='formData." + w.fieldInternalName + "=hyperlink.description.length > 0 ? (hyperlink.url + \", \" + hyperlink.description) : \"\"' type='text' class='form-control' id='" + w.fieldInternalName + "_description' placeholder='Google'/></div>";
                    formHtml += "<input ng-model='formData." + w.fieldInternalName + "' type='hidden' data='field' class='form-control' id='" + w.fieldInternalName + "'/>";
                    formHtml += "</div>";
                }
                else
                    formHtml += "<input ng-model='formData." + w.fieldInternalName + "' type='text' data='field' class='form-control' id='" + w.fieldInternalName + "'/>";

                formHtml += "</div>";
                formHtml += "</div>";
                
            });


            return false;
        }
    });
    formHtml += "</div>";

    return formHtml;
}

