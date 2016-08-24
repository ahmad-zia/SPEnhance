//'use strict';

(function () {
	//var hostweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl")); 
	//var appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl")); 
    $(document).ready(function () {
		clearMsg();
			
		var clientContext = new SP.ClientContext(appWebUrl); 
		var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
	    clientContext.set_webRequestExecutorFactory(factory); 
	    var appContextSite = new SP.AppContextSite(clientContext, hostWebUrl);
		
		displayAllLists(clientContext, appContextSite);
		
		$("#createAllLists").click(function(){
			clearMsg();
			listNames.lists.forEach(
				function(name){
					createList(clientContext, appContextSite, name.listName, name.fields, true);
				}
			);
		}); 
		$("#deleteAllLists").click(function(){
			clearMsg();
			listNames.lists.forEach(
				function(name){
					deleteList(clientContext, appContextSite, name.listName);
				}
			);
			displayAllLists(clientContext, appContextSite);
		}); 
		
		refreshDynamicEventListener(); 
	});
			
	function deleteSingleList(listName){
		$.each(listNames.lists, function(i, v) {
		    if (v.listName == listName) {
		        var clientContext = new SP.ClientContext(appWebUrl);
		        var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
			    clientContext.set_webRequestExecutorFactory(factory); 
			    var appContextSite = new SP.AppContextSite(clientContext, hostWebUrl);
				deleteList(clientContext, appContextSite, listName);
				return;
		    }
		});
	}
	
	function deleteList(clientContext, appContextSite, listName){
		var listCollection = appContextSite.get_web().get_lists();
		clientContext.load(listCollection);
		clientContext.executeQueryAsync(onSuccess, onFail);
		
		function onSuccess(){
			var listExists = false;  
	        var le = listCollection.getEnumerator();
			var oList;
	        while (le.moveNext()) {
	            oList = le.get_current();
	            if(oList.get_title() == listName) {
	                listExists = true;
	                break;
	            }
	        }
	
			if(listExists){
				oList.deleteObject();
				clientContext.executeQueryAsync(onListDeleteSuccess, onListDeleteFail);
			}
			else{
				showMsg("List "+ listName + " doesn't exist");
			}
			
			function onListDeleteSuccess(){
				showMsg("List " + listName + " deleted.");
				displayAllLists(clientContext, appContextSite);
			}
			function onListDeleteFail(sender, args){
				showMsg("Failed to delete list " + listName + ". Error:" + args.get_message());
			}
		}
		
		function onFail(sender, args){
			showMsg("Failed to query lists. Error:" + args.get_message());
		}
	}
})();
