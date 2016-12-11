resumeBuilderApp.controller('ViewResumeController', ['$scope', 'sharePointService', function ($scope, sharePointService) {
    clearMsg();
    getUserName($scope, sharePointService);
    
    objClient.getListData($scope, sharePointService, overviewListName, getFieldsByListName(overviewListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
}]);

function getUserName($scope, sharePointService) {
    objClient.getCurrentUserObject($scope, sharePointService, onSuccess, onFail)

    function onSuccess(user) {
        $scope.title = user.get_title();
    }

    function onFail(args) {
        showMsg('Failed to get user name. Error:' + args.get_message());
    }
}