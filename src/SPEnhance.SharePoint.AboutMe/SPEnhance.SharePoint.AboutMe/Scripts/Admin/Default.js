var deletedListCounter = 0;
$(document).ready(function () {
    clearMsg();

    //var clientContext = new SP.ClientContext(appWebUrl);
    /*var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
    clientContext.set_webRequestExecutorFactory(factory);*/
    //var appContextSite = new SP.AppContextSite(clientContext, appWebUrl);
    objClient = new SPClient();
    //displayAllLists(clientContext, appContextSite);
    displayAllLists(clientContext);

    $("#createAllLists").click(function () {
        clearMsg();
        listNames.lists.forEach(
            function (name) {
                //createList(clientContext, appContextSite, name.listName, name.fields, true);
                createList(clientContext, name.listName, name.fields, true);
            }
        );
    });
    $("#deleteAllLists").click(function () {
        clearMsg();
        /*listNames.lists.forEach(
            function(name){
                deleteList(clientContext, appContextSite, name.listName);
            }
        );*/
        //deleteAllLists(clientContext, appContextSite);
        deleteAllLists(clientContext);
        
    });

    refreshDynamicEventListener();
});