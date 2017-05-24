var consoleLogEnabled = getCookie("consoleLogEnabled");
var listCreatedCounter = 0;

angular.module('sharePointService', [])
    .factory('sharePointService', ['$q', function ($q) {
     var SharePointService = {};
     SharePointService.executeQuery = function (context) {
         var deferred = $q.defer();
         context.executeQueryAsync(deferred.resolve, function (o, args) {
             deferred.reject(args);
         });
         return deferred.promise;
     };
     return SharePointService;
 }]);

resumeBuilderApp.directive("divAlertMsg", function () {
    return {
        template: '<div class="alert alert-dismissible msg" role="alert">' +
				    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				    '<span id="spanMsg"></span>' +
			        '</div>'
    };
});

resumeBuilderApp.directive("footerMenu", function () {
    return {
        template: '<div class="col-md-6 no-print">' +
				        '<input type="button" value="Back to SharePoint" id="backToSharePoint" ng-click="backToSharePoint()"/>' +
			        '</div>' +
			        '<div class="col-md-6 no-print footer-menu" ng-html-compile="footerMenuLinks"></div>',
        scope: {},
        link: function (scope, elem, attrs) {

            if (attrs.isAdmin == "true")
                scope.footerMenuLinks = "<a id=\"refresh\" ng-click=\"refresh()\">Refresh</a> | <a href=\"{{viewResumeUrl}}\" id=\"viewResume\">View Resume</a> | <a href=\"{{adminHomeUrl}}\" id=\"adminHome\">Admin Home</a> | <a href=\"https://github.com/ahmad-zia/SPEnhance/blob/master/Support.md\" target=\"_blank\">Technical Support</a>";
            else
                scope.footerMenuLinks = "<a id=\"refresh\" ng-click=\"refresh()\">Refresh</a> | <a href=\"{{adminHomeUrl}}\" id=\"adminHome\">Admin Home</a> | <a id=\"print\" ng-click=\"print()\">Print</a> | <a href=\"https://github.com/ahmad-zia/SPEnhance/blob/master/Support.md\" target=\"_blank\">Technical Support</a>";

            scope.viewResumeUrl = appWebUrl + "/Pages/Default.aspx?SPAppWebUrl=" + appWebUrl + "&SPHostUrl=" + hostWebUrl;

            scope.backToSharePoint = function () {
                document.location = hostWebUrl;
            }

            scope.adminHomeUrl = appWebUrl + "/Pages/Admin/Default.aspx?SPAppWebUrl=" + appWebUrl + "&SPHostUrl=" + hostWebUrl;

            scope.refresh = function () {
                refreshPage();
            }

            scope.print = function () {
                window.print();
            }
        }

    };
});

resumeBuilderApp.directive("clickDisable", function(){
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).click(function(){
                $("input[type='button']").attr("disabled", "disabled");
            });
        }
    };
});

resumeBuilderApp.directive("progressBar", function () {
    return {
        template: '<div class="progress">' +
                    '<div class="progress-bar" role="progressbar" aria-valuenow="{{progressBarValueNow}}" aria-valuemin="0" aria-valuemax="100" style= "width:{{progressBarValueNow}}%">Loading {{progressBarValueNow}}%</div>'+
                  '</div>'
    };
});

function consoleLog(msg) {
    if (consoleLogEnabled)
        console.log(msg);
}

function setCookie(key, value, days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ";path=/";
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

/*function getClientContext(siteUrl) {
    if ($.isNullOrEmpty(siteUrl))
        return new SP.ClientContext.get_current();
    return new SP.ClientContext(siteUrl);
}*/

function getFieldsByListName(listName){
	var fields = "";
    angular.forEach(listNames.lists, function (v, i) {
		if (v.listName == listName){
            angular.forEach(v.fields, function (w, j) {
				fields += w.fieldInternalName + ",";
			});
			return false;
		}
	});
	return fields.substring(0, fields.lastIndexOf(','));
}

function getFieldsObjectByListName(listName) {
    var fields = {};
    angular.forEach(listNames.lists, function (v, i) {
        if (v.listName == listName)
            fields = v.fields;
    });
    return fields;
}
	
function getListMaxRows(listName) {
    var maxRows = -1;//unlimited
    angular.forEach(listNames.lists, function (v, i) {
        if (v.listName == listName && v.maxRows != null) {
            consoleLog(v.listName + " " + v.maxRows);
            maxRows = v.maxRows;
            return false;
        }
    });
    return maxRows;
}

function getFieldTypeByListFieldInternalName(listName, listFieldName){
	var fieldType = "";
    angular.forEach(listNames.lists, function(v, i) {
		if (v.listName == listName){
				
			consoleLog(v.listName + " " + JSON.stringify(v.fields));
            angular.forEach(v.fields, function(w, j) {
				consoleLog(w.fieldType);
				if(w.fieldInternalName == listFieldName){
					fieldType = w.fieldType;
					return false;
				}
			});
			consoleLog(fieldType);
			return false;
		}
	});
	return fieldType;
}
	
function getFieldDisplayNameByListFieldInternalName(listName, listFieldInternalName){
	var fieldDisplayName = "";
    angular.forEach(listNames.lists, function(v, i) {
		if (v.listName == listName){
				
			consoleLog(v.listName + " " + JSON.stringify(v.fields));
            angular.forEach(v.fields, function(w, j) {
				consoleLog(w.fieldType);
				if(w.fieldInternalName == listFieldInternalName){
					fieldDisplayName = w.fieldDisplayName;
					return false;
				}
			});
			consoleLog(fieldDisplayName);
			return false;
		}
	});
	return fieldDisplayName;
}

function getListItemCount($scope, sharePointService, listName, htmlElementId) {
    objClient.getListItemCount($scope, sharePointService, listName, successCallback, failCallback);

    function successCallback(itemCount) {
        $("#" + htmlElementId).text(itemCount);
    }

    function failCallback(args) {
        consoleLog(args.get_message());
    }
}


function showHideFooterMenu(showHide) {
    var domElement = document.getElementById('footerMenu');
    var scope = angular.element(domElement).scope();
    consoleLog('Going to show/hide footer menu: ' + showHide);
    scope.allListsCreated = showHide;
}

function updateProgressBar(value) {
    var domElement = document.getElementById('progressBar');
    var scope = angular.element(domElement).scope();

    value = Math.round(value / listNames.lists.length * 100, 0);
    consoleLog('Going to update progressBar: ' + value);
    scope.progressBarValueNow = value;
}		

function showMsg(msg){
	$("#spanMsg").html(msg);
    $("#divMsg").show();
    setTimeout(
        function () {
            $("input[type='button']").removeAttr("disabled"); 
        },
        1000
    );
}

function clearMsg(){
	$("#spanMsg").html("");
	$("#divMsg").hide();
}
	
function refreshPage(){
	window.location.reload(true);
}

function createSingleList($scope, sharePointService, listName, fromAdminPanel) {
    angular.forEach(listNames.lists, function (v, i) {
	    if (v.listName == listName) {
	        consoleLog("createList with listName: " + listName);
	        createList($scope, sharePointService, listName, v.fields, fromAdminPanel);
	        return;
	    }
	});
}

/*function createList($scope, sharePointService, clientContext, listName, fields, fromAdminPanel, isSingleList) {
	var listCreationInfo = new SP.ListCreationInformation();
	listCreationInfo.set_title(listName);
	listCreationInfo.set_templateType(SP.ListTemplateType.genericList);

	var oList = webLists.add(listCreationInfo);

	clientContext.load(oList);
	sharePointService.executeQuery(clientContext).then(onSuccess, onFail);

	function onSuccess() {
	    if (fromAdminPanel)
	        ;//showMsg("List " + listName + " created.");
	    consoleLog("List " + listName + " created.");
	    createListFields($scope, sharePointService, clientContext, oList, fields, fromAdminPanel, isSingleList)
	}
	function onFail(args) {
	    if (fromAdminPanel) {
	        if (args.get_message().indexOf("A list, survey, discussion board, or document library with the specified title already exists in this Web site") >= 0) {
	            createdListCounter++;
	            if (createdListCounter == listNames.lists.length) {
	                displayAllLists($scope, sharePointService);
	                showMsg("All lists have been created");
	            }
	        }
	    }
	    consoleLog("Failed to create list " + listName + ". Error:" + args.get_message());
	}
}*/

function createList($scope, sharePointService, listName, fields, fromAdminPanel) {

    objClient.createList($scope, sharePointService, listName, onSuccess, onFail)
   
    function onSuccess(listName) {
        consoleLog("List " + listName + " created..");
        createListFields($scope, sharePointService, listName, fields, fromAdminPanel)
    }
    function onFail(args, listName) {
        consoleLog("Failed to create list " + listName + ". Error:" + args.get_message());
    }
}

/*function createListFields($scope, sharePointService, clientContext, oList, fields, fromAdminPanel, isSingleList) {
	var fieldXml = "";
	for (var i = 0; i < fields.length ; i++) {
	    if (jQuery.inArray(fields[i].fieldInternalName, excludeListFieldsToCreate) >= 0)
	        continue;
	    fieldXml = "<Field " +
					" Name='" + fields[i].fieldInternalName + "'" +
					" StaticName='" + fields[i].fieldInternalName + "'" +
					" DisplayName='" + fields[i].fieldDisplayName + "'" +
					" Type='" + fields[i].fieldType + "'";
	    if (fields[i].fieldFormat != null || fields[i].fieldFormat != "undefined")
	        fieldXml += " Format='" + fields[i].fieldFormat + "'";
	    if (fields[i].fieldType == "Note") {
	        fieldXml += " NumLines='" + fields[i].numLines + "'";
	        fieldXml += " RichText='" + fields[i].richText + "'";
	        fieldXml += " Sortable='" + fields[i].sortable + "'";
	    }

	    fieldXml += " />";
	    var newField = oList.get_fields().addFieldAsXml(fieldXml, true, SP.AddFieldOptions.addToDefaultContentType | SP.AddFieldOptions.addFieldInternalNameHint | SP.AddFieldOptions.addFieldToDefaultView);
	    newField.update();
	}
	sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
	function onSuccess() {
	    consoleLog("Fields created in List " + oList.get_title());
	    
	    if (fromAdminPanel) {
	        if (isSingleList) {
	            showMsg("List '" + oList.get_title() + "' has been created");
	            displayAllLists($scope, sharePointService);
	        }
	        else {
	            createdListCounter++;
	            if (createdListCounter == listNames.lists.length) {
	                showMsg("All lists have been created");
	                displayAllLists($scope, sharePointService);
	            }
	        }
	    }
	    else {
	        if (oList.get_title() == overviewListName)
	            objClient.getListData($scope, sharePointService, overviewListName, getFieldsByListName(overviewListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
	        if (oList.get_title() == personalInfoListName)
	            objClient.getListData($scope, sharePointService, personalInfoListName, getFieldsByListName(personalInfoListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
	        if (oList.get_title() == skillListName)
	            objClient.getListData($scope, sharePointService, skillListName, getFieldsByListName(skillListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackSkillSuccess, callbackFail);
	        if (oList.get_title() == certificationListName)
	            objClient.getListData($scope, sharePointService, certificationListName, getFieldsByListName(certificationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackCertificationSuccess, callbackFail);
	        if (oList.get_title() == projectListName)
	            objClient.getListData($scope, sharePointService, projectListName, getFieldsByListName(projectListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackProjectSuccess, callbackFail);
	        if (oList.get_title() == experienceListName)
	            objClient.getListData($scope, sharePointService, experienceListName, getFieldsByListName(experienceListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackExperienceSuccess, callbackFail);
	        if (oList.get_title() == educationListName)
	            objClient.getListData($scope, sharePointService, educationListName, getFieldsByListName(educationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackEducationSuccess, callbackFail);
	    }
	}

	function onFail(args) {
	    
	    if (fromAdminPanel)
	        showMsg("Failed to create fields in list " + oList.get_title() + ". Error:" + args.get_message());
	    consoleLog("Failed to create fields in list " + oList.get_title() + ". Error:" + args.get_message());
	}
}*/

function createListFields($scope, sharePointService, listName, fields, fromAdminPanel) {

    objClient.createListFields($scope, sharePointService, listName, fields, excludeListFieldsToCreate, onSuccess, onFail);
    
    function onSuccess(listName) {

        if (fromAdminPanel) {
            showMsg("List '" + listName + "' has been created");
            displayAllLists($scope, sharePointService);
        }
        else {
            if (listName == overviewListName)
                objClient.getListData($scope, sharePointService, overviewListName, getFieldsByListName(overviewListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
            if (listName == personalInfoListName)
                objClient.getListData($scope, sharePointService, personalInfoListName, getFieldsByListName(personalInfoListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
            if (listName == skillListName)
                objClient.getListData($scope, sharePointService, skillListName, getFieldsByListName(skillListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackSkillSuccess, callbackFail);
            if (listName == certificationListName)
                objClient.getListData($scope, sharePointService, certificationListName, getFieldsByListName(certificationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackCertificationSuccess, callbackFail);
            if (listName == projectListName)
                objClient.getListData($scope, sharePointService, projectListName, getFieldsByListName(projectListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackProjectSuccess, callbackFail);
            if (listName == experienceListName)
                objClient.getListData($scope, sharePointService, experienceListName, getFieldsByListName(experienceListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackExperienceSuccess, callbackFail);
            if (listName == educationListName)
                objClient.getListData($scope, sharePointService, educationListName, getFieldsByListName(educationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackEducationSuccess, callbackFail);
        }
    }

    function onFail(args, listName) {

        if (fromAdminPanel)
            showMsg("Failed to create fields in list " + listName + ". Error:" + args.get_message());
        consoleLog("Failed to create fields in list " + listName + ". Error:" + args.get_message());
    }
}

function createAllLists($scope, sharePointService) {
    
    objClient.createAllLists($scope, sharePointService, listNames.lists, excludeListFieldsToCreate, onSuccess, onFail);

    function onSuccess() {
        displayAllLists($scope, sharePointService);
        showMsg("Lists have been created");
    }

    function onFail(args) {
        consoleLog("Failed to create lists. Error:" + args.get_message());
    }
}

function displayAllLists($scope, sharePointService) {

    objClient.displayAllLists($scope, sharePointService, excludeListNames, onSuccess, onFail);

    function onSuccess($scope, listArray) {
        var html = "<ul class='list-group'>";
        for (var i = 0; i < listNames.lists.length; i++) {
            var listName = listNames.lists[i].listName;
            getListItemCount($scope, sharePointService, listName, "listItemCount_"+listName);

            html += "<li class='list-group-item'>";
            html += listName + " <span id='listItemCount_" + listName + "' class='badge' style='float: none !important'></span>";
            html += "<span style='float:right'>";
            //if (jQuery.inArray(listNames.lists[i].listName, listArray) >= 0) {
            if (listArray.indexOf(listNames.lists[i].listName) >= 0) {
                html += "<a class='deleteSingleList' data='" + listName + "' ng-click='deleteList($event)'>Delete</a>";
                html += " | ";
                html += "<a href='" + appWebUrl + "/Pages/Admin/List/View.aspx?listName=" + listName + "&SPAppWebUrl=" + appWebUrl + "&SPHostUrl=" + hostWebUrl + "'>Manage Data</a>";
            }
            else {
                html += "<a class='createSingleList' data='" + listName + "' ng-click='createList($event)'>Create</a>";
            }
            html += "</span>";
            html += "</li>";
        }
        html += "</ul>";
        $scope.lists = html;
    }
    function onFail(args) {
        showMsg("Error in getting lists. Error is " + args.get_message());
    }
}

function deleteSingleList($scope, sharePointService, listName) {
    angular.forEach(listNames.lists, function (v, i) {
	    if (v.listName == listName) {
	        deleteList($scope, sharePointService, listName);
	        return;
	    }
	});
}

function deleteList($scope, sharePointService, listName) {
    objClient.deleteList($scope, sharePointService, listName, onListDeleteSuccess, onListDeleteFail)
    function onListDeleteSuccess() {
        displayAllLists($scope, sharePointService);
        showMsg("List '" + listName + "' has been deleted");
    }
    function onListDeleteFail(args) {
        showMsg("Failed to delete list " + listName + ". Error:" + args.get_message());
    }
}

/*function deleteAllLists($scope, sharePointService, clientContext) {

    clientContext.load(webLists);
    sharePointService.executeQuery(clientContext).then(onSuccess, onFail);
    function onSuccess() {
        angular.forEach(listNames.lists, function (v, i) {
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
                consoleLog("List " + listName + " doesn't exist in deleteAllList");
                if (deletedListCounter == listNames.lists.length) {
                    displayAllLists($scope, sharePointService); //refreshPage();
                    showMsg("All lists have been deleted");
                }

            }

            function onListDeleteSuccess() {
                deletedListCounter++;
                if (deletedListCounter == listNames.lists.length) {
                    displayAllLists($scope, sharePointService); //refreshPage();
                    showMsg("All lists have been deleted");
                }
            }
            function onListDeleteFail(args) {
                showMsg("Could not delete all lists. Please try again later");
            }
            
        });
    }
    function onFail(args) {
        showMsg("Failed to query lists. Error:" + args.get_message());
    }
}*/

function deleteAllLists($scope, sharePointService) {
    objClient.deleteAllLists($scope, sharePointService, listNames.lists, onListDeleteSuccess, onListDeleteFail);

    function onListDeleteSuccess() {
        displayAllLists($scope, sharePointService);
        showMsg("Lists have been deleted");
    }
    function onListDeleteFail(args) {
        showMsg("Could not delete all lists. Please try again later");
    }
}

function callbackFail($scope, sharePointService, msg, listName) {
    consoleLog("in callbackFail with listName: " + listName + " msg: " + msg );
	if (msg.indexOf("List '" + listName + "' does not exist at site with URL") == 0) {
	    createSingleList($scope, sharePointService, listName, false);
	}
	else
	    showMsg(msg);
}

function callbackOverviewSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
	if (objfieldsData.length == 1) {
	    $scope.shortOverview = objfieldsData[0]["Title"];
	    $scope.longOverview = objfieldsData[0]["LongOverview"];
	}
	else {
	    $scope.shortOverview = "<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>";
	    $scope.longOverview = "<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>";
	}
	objClient.getListData($scope, sharePointService, personalInfoListName, getFieldsByListName(personalInfoListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
    updateProgressBar(++listCreatedCounter);
}

function callbackPersonalInfoSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
	if (objfieldsData.length == 1) {
	    $scope.address = objfieldsData[0]["Title"];
	    $scope.email = objfieldsData[0]["Email"];
	    $scope.phone = objfieldsData[0]["Phone"];
	}
	else {
	    $scope.address = "<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>";
	    $scope.email = "<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>";
	    $scope.phone = "<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>";
	}
	objClient.getListData($scope, sharePointService, skillListName, getFieldsByListName(skillListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackSkillSuccess, callbackFail);
    updateProgressBar(++listCreatedCounter);
}

function callbackSkillSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<tr>";
	        html += "<td class='skill'>" + objfieldsData[i]["Title"] + "</td>";
	        html += "<td>" + objfieldsData[i]["Experience"] + "</td>";
	        html += "</tr>";
	    }
	}
	$scope.skill = html;
	objClient.getListData($scope, sharePointService, certificationListName, getFieldsByListName(certificationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackCertificationSuccess, callbackFail);
    updateProgressBar(++listCreatedCounter);
}

function callbackCertificationSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<tr>";
	        html += "<td class='skill'>" + objfieldsData[i]["Title"] + "</td>";
	        html += "<td>" + objfieldsData[i]["Completed"] + "</td>";
	        html += "</tr>";
	    }
	}
	$scope.certification = html;
	
	objClient.getListData($scope, sharePointService, experienceListName, getFieldsByListName(experienceListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackExperienceSuccess, callbackFail);
    updateProgressBar(++listCreatedCounter);
}
function callbackExperienceSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
        for (var i = 0; i < objfieldsData.length; i++) {
	        html += "<tr>";
	        html += "<td>" + objfieldsData[i]["Title"] + "</td>";
	        html += "<td>" + (objfieldsData[i]["Company"] == null ? "" : objfieldsData[i]["Company"].description) + "</td>";
	        html += "<td>" + (objfieldsData[i]["Company"] == null ? "" : objfieldsData[i]["Company"].url) + "</td>";
	        html += "</tr>";
	    }
	}
	$scope.experience = html;
	objClient.getListData($scope, sharePointService, educationListName, getFieldsByListName(educationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackEducationSuccess, callbackFail);
    updateProgressBar(++listCreatedCounter);
}

function callbackEducationSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<tr>";
	        html += "<td class='education'>" + objfieldsData[i]["Title"] + "</td>";
	        html += "<td>" + (objfieldsData[i]["University"] == null ? "" : objfieldsData[i]["University"].description) + "</td>";
	        html += "<td>" + (objfieldsData[i]["University"] == null ? "" : objfieldsData[i]["University"].url) + "</td>";
	        html += "<td>" + objfieldsData[i]["Completed"] + "</td>";
	        html += "</tr>";
	    }
	}
	$scope.education = html;
    objClient.getListData($scope, sharePointService, projectListName, getFieldsByListName(projectListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackProjectSuccess, callbackFail);
    updateProgressBar(++listCreatedCounter);
}

function callbackProjectSuccess($scope, sharePointService, objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<div class='project-single-height'>";
	            html += "<div class='row'>" +
					        "<div class='col-xs-12 col-md-5 project'>" + objfieldsData[i]["Title"] + "</div>" +
					        "<div class='col-xs-12 col-md-7 project-tag'>" + objfieldsData[i]["Tags"] + "</div>" +
				        "</div>" +
				        "<hr class='hrLine'/>" +
			            objfieldsData[i]["Description"]
            html += "</div>";
	    }
	}
    $scope.project = html;

    showHideFooterMenu(true);
    updateProgressBar(++listCreatedCounter);
}

