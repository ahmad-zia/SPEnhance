(function(){
	this.SPClient = function(){
		var doConsoleLog = false;

		this.getListData = function(siteUrl, listName, commaSeperatedFieldInternalNames, camlQuery, successCallback, failCallback){
			var errorMessage = "";
			if($.isNullOrEmpty(siteUrl)){
				errorMessage = "Site Url \"" + siteUrl + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			if($.isNullOrEmpty(listName)){
				errorMessage = "List name \"" + listName + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			
			var clientContext = $.getClientContext(siteUrl);
			var list = clientContext.get_web().get_lists().getByTitle(listName);
			var listFields = list.get_fields();
			clientContext.load(listFields);
			clientContext.executeQueryAsync(onSuccessFields, onFailFields);
			
			function onSuccessFields(){
				var fieldsArr = [];
				var fieldEnumerator = listFields.getEnumerator();
	            while (fieldEnumerator.moveNext()) {
	                var field = fieldEnumerator.get_current();
	                var fieldType = field.get_fieldTypeKind();
					fieldsArr[field.get_title()] = fieldType;
				}
			
				var qry = new SP.CamlQuery();
				if(!$.isNullOrEmpty(camlQuery))
					qry.set_viewXml(camlQuery);
				else
					qry = SP.CamlQuery.createAllItemsQuery();
				var listItems = list.getItems(qry);
				if(commaSeperatedFieldInternalNames.length > 0)
					clientContext.load(listItems, "Include(" + commaSeperatedFieldInternalNames + ")");
				else
					clientContext.load(listItems);	
				clientContext.executeQueryAsync(onSuccessListItems, onFailListItems);
				
				function onSuccessListItems(){
					var listItemEnumerator = listItems.getEnumerator();
					var fieldInternalNames = commaSeperatedFieldInternalNames.split(',');
					var objItem = [];
				    while (listItemEnumerator.moveNext()) {
				        var listItem = listItemEnumerator.get_current();
						var objField = {};
						for(var i=0 ; i<fieldInternalNames.length ; i++){
							var fieldName = jQuery.trim(fieldInternalNames[i]);
							
							if(fieldsArr[fieldName] == SP.FieldType.URL){
								if(listItem.get_item(fieldName) !== null){
									var objUrl = {};
									objUrl["description"] = listItem.get_item(fieldName).get_description();
									objUrl["url"] = listItem.get_item(fieldName).get_url();
									objField[fieldName] = objUrl;
								}
								else
									objField[fieldName] = null;
							}
							else{
								objField[fieldName] = listItem.get_item(fieldName);
							}
						}
						objItem.push(objField);
				    }

					successCallback(objItem, commaSeperatedFieldInternalNames);
				}
				
				function onFailListItems(sender, args) {
				    if (args != null) {
				        errorMessage = $.createErrorReason("getListData", args);
				        $.displayConsoleLog(errorMessage);
				        failCallback(args.get_message());
				    }
				}
			}
			
			function onFailFields(sender, args) {
			    if (args != null) {
			        errorMessage = $.createErrorReason("getListData.onFailFields", args);
			        $.displayConsoleLog(errorMessage);
			        failCallback(args.get_message());
			    }
			}
		
			this.isError = function(){
				return errorMessage.length > 0 ? true : false;
			}
			
			this.errorReason = function(){
				return errorMessage;
			}
		}
		
		this.createOrUpdateListItem = function(siteUrl, listName, listItemId, jsonListData, successCallback, failCallback){
			var errorMessage = "";
			if($.isNullOrEmpty(siteUrl)){
				errorMessage = "Site Url \"" + siteUrl + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			if($.isNullOrEmpty(listName)){
				errorMessage = "List name \"" + listName + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			
			var clientContext = $.getClientContext(siteUrl);
			var list = clientContext.get_web().get_lists().getByTitle(listName);
			
			var listItemCreateInfo = new SP.ListItemCreationInformation();
			var listItem;
			if(listItemId > 0)
				listItem = list.getItemById(listItemId);
			else
				listItem = list.addItem(listItemCreateInfo);
			
			for(var i=0 ; i<jsonListData.data.length ; i++)
				listItem.set_item(jsonListData.data[i].fieldName, jsonListData.data[i].fieldValue);
			
			listItem.update();
			clientContext.load(listItem);
			clientContext.executeQueryAsync(onSuccess, onFail);
			
			function onSuccess(){
				successCallback();
			}
			
			function onFail(sender, args) {
			    if (args != null) {
			        errorMessage = $.createErrorReason("createOrUpdateListItem", args);
			        $.displayConsoleLog(errorMessage);
			        failCallback(args.get_message());
			    }
			}
			
			this.isError = function(){
				return errorMessage.length > 0 ? true : false;
			}
			
			this.errorReason = function(){
				return errorMessage;
			}
		}
		
		this.deleteListData = function(siteUrl, listName, listItemId, successCallback, failCallback){
			var errorMessage = "";
			if($.isNullOrEmpty(siteUrl)){
				errorMessage = "Site Url \"" + siteUrl + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			if($.isNullOrEmpty(listName)){
				errorMessage = "List name \"" + listName + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			if(listItemId <= 0){
				errorMessage = "List item Id cannot be \"" + listItemId + "\"";
				$.displayConsoleLog(errorMessage);
				return;
			}
			var clientContext = $.getClientContext(siteUrl);
			var list = clientContext.get_web().get_lists().getByTitle(listName);
			
			var listItem = list.getItemById(listItemId);
			listItem.deleteObject();
			
			clientContext.executeQueryAsync(onSuccess, onFail);
			
			function onSuccess(){
				successCallback(listItemId);
			}
			
			function onFail(sender, args) {
			    if (args != null) {
			        errorMessage = $.createErrorReason("deleteListData", args);
			        $.displayConsoleLog(errorMessage);
			        failCallback(args.get_message());
			    }
			}
			
			this.isError = function(){
				return errorMessage.length > 0 ? true : false;
			}
			
			this.errorReason = function(){
				return errorMessage;
			}
		}
		
		this.deleteAllListData = function(siteUrl, listName, successCallback, failCallback){
			var errorMessage = "";
			if($.isNullOrEmpty(siteUrl)){
				errorMessage = "Site Url \"" + siteUrl + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			if($.isNullOrEmpty(listName)){
				errorMessage = "List name \"" + listName + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}
			
			var clientContext = $.getClientContext(siteUrl);
			var list = clientContext.get_web().get_lists().getByTitle(listName);
			
			var query = new SP.CamlQuery();
			var items = list.getItems(query);
			clientContext.load(items, "Include(Id)");
			clientContext.executeQueryAsync(function () {
				var enumerator = items.getEnumerator(),
				simpleArray = [];
				while (enumerator.moveNext()) {
					simpleArray.push(enumerator.get_current());
				}
				for (var s in simpleArray) {
					simpleArray[s].deleteObject();
				}
				clientContext.executeQueryAsync(onSuccess, onFail);
			
				function onSuccess(){
					successCallback();
				}
				
				function onFail(sender, args) {
				    if (args != null) {
				        errorMessage = $.createErrorReason("deleteAllListData", args);
				        $.displayConsoleLog(errorMessage);
				        failCallback(args.get_message());
				    }
				}
			}, 
			function () {
			    if (args != null) {
			        errorMessage = $.createErrorReason("deleteAllListData.GetAllIDs", args);
			        $.displayConsoleLog(errorMessage);
			        failCallback(args.get_message());
			    }
			});
		}
		
		this.consoleLog = function(trueFalse){ 
			doConsoleLog = trueFalse;
			$.displayConsoleLog("console log enabled");
		}
		
		$.getClientContext = function(siteUrl){
			if($.isNullOrEmpty(siteUrl))
				return new SP.ClientContext.get_current();
			return new SP.ClientContext(siteUrl);
		}
		
		$.displayConsoleLog = function(msg){
			if(doConsoleLog) console.log(msg);
		}
		
		$.isNullOrEmpty = function(obj){
			switch(obj){
				case null:
				case "":
				case typeof this === 'undefined':
					return true;
				default:
					return false;	
			}
		}
		
		$.createErrorReason = function(functionName, args){
			return "Error in function " + functionName ;//+ ". " + args.get_message() + " " + args.get_stackTrace();
		}
	}
})();