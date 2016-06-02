//'use strict';

(function () {
	var hostweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl")); 
	var appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl")); 
    $(document).ready(function () {
		clearMsg();
			
		var clientContext = new SP.ClientContext(appweburl); 
	    var factory = new SP.ProxyWebRequestExecutorFactory(appweburl); 
	    clientContext.set_webRequestExecutorFactory(factory); 
	    var appContextSite = new SP.AppContextSite(clientContext, hostweburl);
		
		displayAllLists(clientContext, appContextSite);
		
		$("#createAllLists").click(function(){
			clearMsg();
			listNames.lists.forEach(
				function(name){
					createList(clientContext, appContextSite, name.listName, name.fields);
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
	
	function displayAllLists(clientContext, appContextSite){
		var listCollection = clientContext.get_web().get_lists();
		clientContext.load(listCollection);
		clientContext.executeQueryAsync(onSuccess, onFail);
		function onSuccess(){
	        var le = listCollection.getEnumerator();
			var oList;
			var listArray = [];
			var counter = 0;
			
	        while (le.moveNext()) {
	            oList = le.get_current();
				if(jQuery.inArray(oList.get_title(), excludeListNames) >= 0){
					continue;
				}	
				listArray[counter++] = oList.get_title();
	        }
			var html = "<ul class='list-group'>";
			for(var i = 0; i < listNames.lists.length ; i++){
				html += "<li class='list-group-item'>";
				html += listNames.lists[i].listName;
				html += "<span style='float:right'>";
				if(jQuery.inArray(listNames.lists[i].listName, listArray) >= 0){
					html += "<a class='deleteSingleList' data='" + listNames.lists[i].listName + "'>Delete</a>";
					html += " | ";
					html += "<a href='" + appweburl+ "/Pages/Admin/List/View.aspx?listName=" + listNames.lists[i].listName + "&SPAppWebUrl="+appweburl+"'>Manage Data</a>";
				}
				else{
					html += "<a class='createSingleList' data='" + listNames.lists[i].listName + "'>Create</a>";
				}
				html += "</span>";
				html += "</li>";
			}
			html += "</ul>";
			$("#lists").html(html);
			refreshDynamicEventListener();
		}
		function onFail(sender, args){
			showMsg("Error in getting lists. Error is " + args.get_message());
		} 
	}
	
	function refreshDynamicEventListener() {
	    // Remove handler from existing elements
	    $(".createSingleList").off(); 
	
	    // Re-add event handler for all matching elements
	    $(".createSingleList").on("click", function() {
			clearMsg();
	        createSingleList($(this).attr("data"));
	    });
		
		$(".deleteSingleList").off(); 
	
	    // Re-add event handler for all matching elements
	    $(".deleteSingleList").on("click", function() {
			clearMsg();
	        deleteSingleList($(this).attr("data"));
	    });
	}
	
	function createSingleList(listName){
		$.each(listNames.lists, function(i, v) {
		    if (v.listName == listName) {
				var clientContext = new SP.ClientContext(appweburl); 
			    var factory = new SP.ProxyWebRequestExecutorFactory(appweburl); 
			    clientContext.set_webRequestExecutorFactory(factory); 
			    var appContextSite = new SP.AppContextSite(clientContext, hostweburl);
				createList(clientContext, appContextSite, listName, v.fields);
				return;
		    }
		});
	}
	
	function deleteSingleList(listName){
		$.each(listNames.lists, function(i, v) {
		    if (v.listName == listName) {
				var clientContext = new SP.ClientContext(appweburl); 
			    var factory = new SP.ProxyWebRequestExecutorFactory(appweburl); 
			    clientContext.set_webRequestExecutorFactory(factory); 
			    var appContextSite = new SP.AppContextSite(clientContext, hostweburl);
				deleteList(clientContext, appContextSite, listName);
				return;
		    }
		});
	}
	
	function createList(clientContext, appContextSite, listName, fields){
		var listCreationInfo = new SP.ListCreationInformation();
		listCreationInfo.set_title(listName);
		listCreationInfo.set_templateType(SP.ListTemplateType.genericList);
		
		var oList = appContextSite.get_web().get_lists().add(listCreationInfo);
		
		clientContext.load(oList);
		clientContext.executeQueryAsync(onSuccess, onFail);
		
		function onSuccess(){
			showMsg("List " + listName + " created.");
			createListFields(clientContext, appContextSite, oList, fields)
		}
		function onFail(sender, args){
			showMsg("Failed to create list " + listName + ". Error:" + args.get_message());
		}
	}
		
	function createListFields(clientContext, appContextSite, oList, fields){
		var fieldXml = "";
		for(var i = 0; i<fields.length ; i++){
			if(jQuery.inArray(fields[i].fieldInternalName, excludeListFieldsToCreate) >= 0)
				continue;
			fieldXml = "<Field " + 
						" Name='" + fields[i].fieldInternalName + "'" +
						" StaticName='" + fields[i].fieldInternalName + "'" +
						" DisplayName='" + fields[i].fieldDisplayName + "'" +
						" Type='" + fields[i].fieldType + "'";
			if(fields[i].fieldFormat != null || fields[i].fieldFormat != "undefined")
				fieldXml += " Format='" + fields[i].fieldFormat + "'";	
			if(fields[i].fieldType == "Note"){
				fieldXml += " NumLines='" + fields[i].numLines + "'";
				fieldXml += " RichText='" + fields[i].richText + "'";
				fieldXml += " Sortable='" + fields[i].sortable + "'";
			}	
								
			fieldXml += " />";
			var newField = oList.get_fields().addFieldAsXml(fieldXml, true, SP.AddFieldOptions.addToDefaultContentType | SP.AddFieldOptions.addFieldInternalNameHint | SP.AddFieldOptions.addFieldToDefaultView);
			newField.update();
		}
		clientContext.executeQueryAsync(onSuccess, onFail);
		function onSuccess(){
			showMsg("Fields created in List " + oList.get_title());
			displayAllLists(clientContext, appContextSite);
		}
		
		function onFail(sender, args){
			showMsg("Failed to create fields in list " + oList.get_title() + ". Error:" + args.get_message());
		}
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
