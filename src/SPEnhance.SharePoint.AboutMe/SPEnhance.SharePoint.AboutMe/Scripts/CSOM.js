(function () {
    this.SPClient = function (appWebUrl) {

        var thisSPClient = this;
        var doConsoleLog = false;
        var createdListCounter = 0;
        var deletedListCounter = 0;

        var clientContext = new SP.ClientContext(appWebUrl);
        var webLists = clientContext.get_web().get_lists();

        this.reInitializeSPClient = function () {
            clientContext = new SP.ClientContext(appWebUrl);
            webLists = clientContext.get_web().get_lists();
        }

        this.getCurrentUserObject = function ($scope, sharePointService, onSuccess, onFail) {
            var user = clientContext.get_web().get_currentUser();
            clientContext.load(user);

            sharePointService.executeQuery(clientContext).then(onUserNameSuccess, onUserNameFail);

            function onUserNameSuccess() {
                $.displayConsoleLog("user.get_title(): " + user.get_title());
                onSuccess(user);
            }

            function onUserNameFail(args) {
                $.displayConsoleLog('Failed to get user name. Error:' + args.get_message());
                onFail(args);
            }
        }

        this.getListData = function ($scope, sharePointService, listName, commaSeperatedFieldInternalNames, camlQuery, successCallback, failCallback) {
			var errorMessage = "";
			if($.isNullOrEmpty(listName)){
				errorMessage = "List name \"" + listName + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}

            var list = webLists.getByTitle(listName);
            var listFields = list.get_fields();
			clientContext.load(listFields);
			$.displayConsoleLog("sharePointService.executeQuery on listName: " + listName);
			sharePointService.executeQuery(clientContext).then(onSuccessFields, onFailFields);
			
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
				sharePointService.executeQuery(clientContext).then(onSuccessListItems, onFailListItems);
				
				function onSuccessListItems(){
					var listItemEnumerator = listItems.getEnumerator();
					var fieldInternalNames = commaSeperatedFieldInternalNames.split(',');
					var objItem = [];
				    while (listItemEnumerator.moveNext()) {
				        var listItem = listItemEnumerator.get_current();
						var objField = {};
						for(var i=0 ; i<fieldInternalNames.length ; i++){
							//var fieldName = jQuery.trim(fieldInternalNames[i]);
                            var fieldName = fieldInternalNames[i].trim();
							
							if(fieldsArr[fieldName] == SP.FieldType.URL){
								if(listItem.get_item(fieldName) !== null){
									var objUrl = {};
									objUrl[descriptionFieldName] = listItem.get_item(fieldName).get_description();
									objUrl[urlFieldName] = listItem.get_item(fieldName).get_url();
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

				    successCallback($scope, sharePointService, objItem, commaSeperatedFieldInternalNames, listName);
				}
				
				function onFailListItems(sender, args) {
				    if(args != null && typeof args != "undefined") {
				        errorMessage = $.createErrorReason("getListData", args);
				        $.displayConsoleLog(errorMessage);
				        failCallback($scope, sharePointService, args.get_message(), listName);
				    }
				}
			}
			
			function onFailFields(args) {
			    $.displayConsoleLog("onFailFields: sharePointService.executeQuery on listName: " + listName);
			    $.displayConsoleLog("args:" + args);
			    if (args != null && typeof args != "undefined") {
			        $.displayConsoleLog("args is not null or undefined");
			        errorMessage = $.createErrorReason("getListData.onFailFields", args);
			        $.displayConsoleLog(errorMessage);
			        failCallback($scope, sharePointService, args.get_message(), listName);
			    }
			}
		
			this.isError = function(){
				return errorMessage.length > 0 ? true : false;
			}
			
			this.errorReason = function(){
				return errorMessage;
			}
		}

        this.getListItemCount = function ($scope, sharePointService, listName, successCallback, failCallback) {
            var oList = webLists.getByTitle(listName);
            clientContext.load(oList);
            sharePointService.executeQuery(clientContext).then(onListItemCountSuccess, onListItemCountFail);

            function onListItemCountSuccess() {
                $.displayConsoleLog("Item count for list " + listName + " is " + oList.get_itemCount());
                successCallback(oList.get_itemCount());
            }

            function onListItemCountFail(args) {
                $.displayConsoleLog('Failed to get list item count of list ' + listName + '. Error:' + args.get_message());
                failCallback(args);
            }
        }

		this.createOrUpdateListItem = function ($scope, sharePointService, listName, listItemId, jsonListData, successCallback, failCallback) {
		    $.displayConsoleLog(jsonListData);
			var errorMessage = "";

			if($.isNullOrEmpty(listName)){
				errorMessage = "List name \"" + listName + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
            }

			var list = webLists.getByTitle(listName);
			
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
			sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
			
			function onSuccess(){
			    successCallback();
			}
			
			function onFail(args) {
			    errorMessage = $.createErrorReason("createOrUpdateListItem", args);
			    $.displayConsoleLog(errorMessage);
			    $.displayConsoleLog("listName: " + listName);
			    $.displayConsoleLog("listItemId: " + listItemId);
			    $.displayConsoleLog("jsonListData:- ");
			    for (var i = 0 ; i < jsonListData.data.length ; i++)
			        $.displayConsoleLog(jsonListData.data[i].fieldName + ": " + jsonListData.data[i].fieldValue);

			    if (args != null && typeof args != "undefined" ) {
			        
			        failCallback(args);
			    }
			}
			
			this.isError = function(){
				return errorMessage.length > 0 ? true : false;
			}
			
			this.errorReason = function(){
				return errorMessage;
			}
		}
		
		this.deleteListData = function ($scope, sharePointService, listName, listItemId, successCallback, failCallback) {
			var errorMessage = "";
			
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

			var list = webLists.getByTitle(listName);
			
			var listItem = list.getItemById(listItemId);
			listItem.deleteObject();

			sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
			
			function onSuccess(){
			    successCallback($scope, sharePointService, listItemId);
			}
			
			function onFail(args) {
			    if(args != null && typeof args != "undefined") {
			        errorMessage = $.createErrorReason("deleteListData", args);
			        $.displayConsoleLog(errorMessage);
			        failCallback(args);
			    }
			}
			
			this.isError = function(){
				return errorMessage.length > 0 ? true : false;
			}
			
			this.errorReason = function(){
				return errorMessage;
			}
		}
		
	    this.deleteAllListData = function ($scope, sharePointService, listName, successCallback, failCallback) {
			var errorMessage = "";

			if($.isNullOrEmpty(listName)){
				errorMessage = "List name \"" + listName + "\" is empty.";
				$.displayConsoleLog(errorMessage);
				return;
			}

			var list = webLists.getByTitle(listName);
			
			var query = new SP.CamlQuery();
			var items = list.getItems(query);
			clientContext.load(items, "Include(Id)");

            sharePointService.executeQuery(clientContext).then(function(){
				var enumerator = items.getEnumerator(),
				simpleArray = [];
				while (enumerator.moveNext()) {
					simpleArray.push(enumerator.get_current());
				}
				for (var s in simpleArray) {
					simpleArray[s].deleteObject();
				}

				sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
			
				function onSuccess(){
				    successCallback($scope, sharePointService, listName);
				}
				
				function onFail(sender, args) {
				    if(args != null && typeof args != "undefined") {
				        errorMessage = $.createErrorReason("deleteAllListData", args);
				        $.displayConsoleLog(errorMessage);
				        failCallback(args);
				    }
				}
			}, 
			function (args) {
			    if(args != null && typeof args != "undefined") {
			        errorMessage = $.createErrorReason("deleteAllListData.GetAllIDs", args);
			        $.displayConsoleLog(errorMessage);
			        failCallback(args);
			    }
			});
		}

        this.displayAllLists = function ($scope, sharePointService, excludeListNames, successCallback, failCallback) {
            $.displayConsoleLog("displayAllLists");

            clientContext.load(webLists);
            sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
            function onSuccess() {
                var le = webLists.getEnumerator();
                var oList;
                var listArray = [];
                var counter = 0;

                while (le.moveNext()) {
                    oList = le.get_current();
                    //if (jQuery.inArray(oList.get_title(), excludeListNames) >= 0) {
                    if (excludeListNames.indexOf(oList.get_title()) >= 0) {
                        continue;
                    }
                    listArray[counter++] = oList.get_title();
                }
                successCallback($scope, listArray);
            }
            function onFail(args) {
                if (args != null && typeof args != "undefined") {
                    errorMessage = $.createErrorReason("displayAllLists", args);
                    $.displayConsoleLog(errorMessage);
                    failCallback(args);
                }
            }
        }

        this.deleteList = function ($scope, sharePointService, listName, successCallback, failCallback) {
            $.displayConsoleLog("deleting list " + listName);
            clientContext.load(webLists);

            sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
            function onSuccess() {
                var listExists = false;
                var le = webLists.getEnumerator();
                var oList;
                while (le.moveNext()) {
                    oList = le.get_current();
                    if (oList.get_title() == listName) {
                        listExists = true;
                        break;
                    }
                }

                if (listExists) {
                    oList.deleteObject();
                    sharePointService.executeQuery(clientContext).then(onListDeleteSuccess, onListDeleteFail);
                }
                else {
                    $.displayConsoleLog("List " + listName + " doesn't exist");
                }

                function onListDeleteSuccess() {
                    successCallback($scope, listName);
                }
                function onListDeleteFail(args) {
                    if (args != null && typeof args != "undefined") {
                        errorMessage = $.createErrorReason("displayAllLists", args);
                        $.displayConsoleLog(errorMessage);
                        failCallback(args);
                    }
                }
            }

            function onFail(args) {
                if (args != null && typeof args != "undefined") {
                    errorMessage = $.createErrorReason("displayAllLists", args);
                    $.displayConsoleLog(errorMessage);
                    failCallback(args);
                }
            }
        }

        this.deleteAllLists = function ($scope, sharePointService, listNames, successCallback, failCallback) {
            clientContext.load(webLists);
            sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
            function onSuccess() {
                angular.forEach(listNames, function (v, i) {
                    var listExists = false;
                    var le = webLists.getEnumerator();
                    var oList;
                    var listName = v.listName;
                    while (le.moveNext()) {
                        oList = le.get_current();
                        if (oList.get_title() == listName) {
                            listExists = true;
                            break;
                        }
                    }

                    if (listExists) {
                        oList.deleteObject();
                        sharePointService.executeQuery(clientContext).then(onListDeleteSuccess, onListDeleteFail);
                    }
                    else {
                        deletedListCounter++;
                        $.displayConsoleLog("List " + listName + " doesn't exist in deleteAllList");
                        if (deletedListCounter == listNames.length) {
                            successCallback();
                            deletedListCounter = 0;
                        }

                    }

                    function onListDeleteSuccess() {
                        $.displayConsoleLog("List " + listName + " deleted");
                        deletedListCounter++;
                        if (deletedListCounter == listNames.length) {
                            successCallback();
                            deletedListCounter = 0;
                        }
                    }
                    function onListDeleteFail(args) {
                        if (args != null && typeof args != "undefined") {
                            errorMessage = $.createErrorReason("deleteAllLists", args);
                            $.displayConsoleLog(errorMessage);
                            failCallback(args);
                        }
                    }

                });
            }
            function onFail(args) {
                if (args != null && typeof args != "undefined") {
                    errorMessage = $.createErrorReason("displayAllLists", args);
                    $.displayConsoleLog(errorMessage);
                    failCallback(args);
                }
            }
        }

        this.createList = function ($scope, sharePointService, listName, successCallback, failCallback) {
            var listCreationInfo = new SP.ListCreationInformation();
            listCreationInfo.set_title(listName);
            listCreationInfo.set_templateType(SP.ListTemplateType.genericList);

            var oList = webLists.add(listCreationInfo);

            clientContext.load(oList);
            sharePointService.executeQuery(clientContext).then(onSuccess, onFail);

            function onSuccess() {
                $.displayConsoleLog("List " + listName + " created");
                successCallback(listName);
            }
            function onFail(args) {
                $.displayConsoleLog("Failed to create list " + listName);
                if (args != null && typeof args != "undefined") {
                    errorMessage = $.createErrorReason("createList", args);
                    $.displayConsoleLog(errorMessage);
                    failCallback(args, listName);
                }
            }
        }

        this.createListFields = function ($scope, sharePointService, listName, fields, excludeListFieldsToCreate, successCallback, failCallback) {
            thisSPClient.reInitializeSPClient();
            clientContext.load(webLists);
            sharePointService.executeQuery(clientContext).then(onSuccess, onFail);

            function onSuccess() {
                var oList = webLists.getByTitle(listName);
                var fieldXml = "";
                for (var i = 0; i < fields.length; i++) {
                    //if (jQuery.inArray(fields[i].fieldInternalName, excludeListFieldsToCreate) >= 0)
                    if (excludeListFieldsToCreate.indexOf(fields[i].fieldInternalName) >= 0)
                        continue;
                    fieldXml = "<Field " +
                        " Name='" + fields[i].fieldInternalName + "'" +
                        " StaticName='" + fields[i].fieldInternalName + "'" +
                        " DisplayName='" + fields[i].fieldDisplayName + "'" +
                        " Type='" + fields[i].fieldType + "'";
                    if (fields[i].fieldType == "URL")
                        fieldXml += " Format='" + fields[i].fieldFormat + "'";
                    if (fields[i].fieldType == "Note") {
                        fieldXml += " NumLines='" + fields[i].numLines + "'";
                        fieldXml += " RichText='" + fields[i].richText + "'";
                        fieldXml += " Sortable='" + fields[i].sortable + "'";
                    }

                    fieldXml += " />";
                    $.displayConsoleLog(fieldXml);
                    var newField = oList.get_fields().addFieldAsXml(fieldXml, true, SP.AddFieldOptions.addToDefaultContentType | SP.AddFieldOptions.addFieldInternalNameHint | SP.AddFieldOptions.addFieldToDefaultView);
                    newField.update();
                }
                sharePointService.executeQuery(clientContext).then(onFieldCreationSuccess, onFieldCreationFail);
                function onFieldCreationSuccess() {
                    $.displayConsoleLog("Fields created in List " + listName);
                    successCallback(listName);
                }

                function onFieldCreationFail(args) {
                    $.displayConsoleLog("Failed to create fields in list " + listName);
                    if (args != null && typeof args != "undefined") {
                        errorMessage = $.createErrorReason("createListFields", args);
                        $.displayConsoleLog(errorMessage);
                        failCallback(args, listName);
                    }
                }
            }
            function onFail(args) {
                $.displayConsoleLog("Could not find list " + listName);
                if (args != null && typeof args != "undefined") {
                    errorMessage = $.createErrorReason("createListFields", args);
                    $.displayConsoleLog(errorMessage);
                    failCallback(args, listName);
                }
            }
            
        }

        this.createAllLists = function ($scope, sharePointService, listNames, excludeListFieldsToCreate, successCallback, failCallback) {
            angular.forEach(listNames, function (v, i) {
                thisSPClient.createList($scope, sharePointService, v.listName, onSuccessCreateList, onFailCreateList);

                function onSuccessCreateList(listName) {
                    //$.displayConsoleLog("List " + listName + " created.");
                    //$.displayConsoleLog("v.List " + v.listName + " created.");
                    
                    thisSPClient.createListFields($scope, sharePointService, listName, v.fields, excludeListFieldsToCreate, onSuccess, onFail);

                    function onSuccess(listName) {
                        createdListCounter++;
                        if (createdListCounter == listNames.length) {
                            successCallback();
                            createdListCounter = 0;
                        }
                    }
                    function onFail(args, listName) {
                        //$.displayConsoleLog("Failed to create fields in list " + listName + ". Error:" + args.get_message());
                        if (args != null && typeof args != "undefined") {
                            errorMessage = $.createErrorReason("createAllLists", args);
                            //$.displayConsoleLog(errorMessage);
                            failCallback(args);
                        }
                    }
                }
                function onFailCreateList(args, listName) {
                    if (args.get_message().indexOf("A list, survey, discussion board, or document library with the specified title already exists in this Web site") >= 0) {
                        createdListCounter++;
                        if (createdListCounter == listNames.length) {
                            successCallback();
                            createdListCounter = 0;
                        }
                    }
                    else {
                        //$.displayConsoleLog("Failed to create lists. Error:" + args.get_message());
                        if (args != null && typeof args != "undefined") {
                            errorMessage = $.createErrorReason("createAllLists", args);
                            //$.displayConsoleLog(errorMessage);
                            failCallback(args);
                        }
                    }
                }
            });
            /*$.each(listNames, function (i, v) {
                var listCreationInfo = new SP.ListCreationInformation();
                listCreationInfo.set_title(v.listName);
                listCreationInfo.set_templateType(SP.ListTemplateType.genericList);

                var oList = webLists.add(listCreationInfo);

                clientContext.load(oList);
                sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
            });
            

            function onSuccess() {
                createdListCounter++;
                if (createdListCounter == listNames.length) {
                    successCallback();
                    createdListCounter = 0;
                }
            }
            function onFail(args) {
                if (args.get_message().indexOf("A list, survey, discussion board, or document library with the specified title already exists in this Web site") >= 0) {
                    createdListCounter++;
                    if (createdListCounter == listNames.length) {
                        successCallback();
                        createdListCounter = 0;
                    }
                }
                else {
                    $.displayConsoleLog("Failed to create lists. Error:" + args.get_message());
                    if (args != null && typeof args != "undefined") {
                        errorMessage = $.createErrorReason("createAllLists", args);
                        $.displayConsoleLog(errorMessage);
                        failCallback(args);
                    }
                }
            }*/
        }

		this.consoleLog = function(trueFalse){ 
			doConsoleLog = trueFalse;
			$.displayConsoleLog("console log enabled");
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
		
		$.createErrorReason = function (functionName, args) {
		    var str = "Error in function " + functionName;
            if(args != null || typeof args != "undefined")
                str += ". " + args.get_message() + " " + args.get_stackTrace();
            return str;
		}
	}
})();
