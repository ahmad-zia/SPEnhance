$(document).ready(function () {
    clearMsg();

    getUserName();

    objClient = new SPClient();
    objClient.consoleLog(true);

    objClient.getListData(overviewListName, getFieldsByListName(overviewListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
    
    $("#print").click(function () {
        window.print();
    });

    $("#viewAdmin").attr("href", document.URL.replace("/Pages/Default", "/Pages/Admin/Default"));

});

function getUserName() {
    //var context = SP.ClientContext.get_current();
    var user = clientContext.get_web().get_currentUser();
    clientContext.load(user);
    clientContext.executeQueryAsync(onUserNameSuccess, onUserNameFail);

    function onUserNameSuccess() {
        $('.title').text(user.get_title());
    }

    function onUserNameFail(sender, args) {
        showMsg('Failed to get user name. Error:' + args.get_message());
    }
}