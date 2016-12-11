//var deletedListCounter = 0;
//var createdListCounter = 0;

resumeBuilderApp.controller('ViewAdminController', ['$scope', 'sharePointService', function ($scope, sharePointService) {
    clearMsg();

    displayAllLists($scope, sharePointService);

    $scope.createAllLists = function () {
        clearMsg();
        createAllLists($scope, sharePointService);
        /*createdListCounter = 0;
        angular.forEach(listNames.lists, function (v, i) {
            createList($scope, sharePointService, clientContext, v.listName, v.fields, true, false);
        });
        displayAllLists($scope, sharePointService);*/
    }

    $scope.deleteAllLists = function () {
        clearMsg();
       // deletedListCounter = 0;
        if (confirm("Are you sure you want to delete all lists?")) {
            deleteAllLists($scope, sharePointService);
        }
    }

    $scope.createList = function ($event) {
        clearMsg();
        createSingleList($scope, sharePointService, $event.currentTarget.getAttribute("data"), true, true);
    }

    $scope.deleteList = function ($event) {
        clearMsg();
        var listName = $event.currentTarget.getAttribute("data");
        if (confirm("Are you sure you want to delete the list " + listName + "?"))
            deleteSingleList($scope, sharePointService, listName);
    }      

    displayConsoleLogButtonValue($scope);

    $scope.enableDisableConsoleLog = function () {
        if (consoleLogEnabled)
            setCookie("consoleLogEnabled", "", -1);
        else
            setCookie("consoleLogEnabled", true, 365);

        consoleLogEnabled = getCookie("consoleLogEnabled");

        displayConsoleLogButtonValue($scope);

        if (consoleLogEnabled) 
            showMsg("Console log has been enabled");
        else 
            showMsg("Console log has been disabled");
    }
}]);

function displayConsoleLogButtonValue($scope) {
    if (consoleLogEnabled) {
        $scope.enableDisableConsoleLogButtonValue = "Disable Console Log";
        objClient.consoleLog(true);
    }
    else {
        $scope.enableDisableConsoleLogButtonValue = "Enable Console Log";
        objClient.consoleLog(false);
    }
}
