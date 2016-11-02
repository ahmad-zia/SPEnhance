$(document).ready(function () {
    $(".footer-menu").html("<a class=\"pointerCursor\" id=\"refresh\">Refresh</a> | <a class=\"pointerCursor\" id=\"adminHome\">Admin Home</a> | <a class=\"pointerCursor\" id=\"print\">Print</a> | <a class=\"pointerCursor\" href=\"https://spenhance.codeplex.com/discussions\" target=\"_blank\">Technical Support</a>");

    $(".footer-menu-admin").html("<a class=\"pointerCursor\" id=\"refresh\">Refresh</a> | <a class=\"pointerCursor\" id=\"viewResume\">View Resume</a> | <a class=\"pointerCursor\" id=\"adminHome\">Admin Home</a> | <a class=\"pointerCursor\" href=\"https://spenhance.codeplex.com/discussions\" target=\"_blank\">Technical Support</a>");

	$("#refresh").click(function () {
	    refreshPage();
	})

	$("#viewResume").attr("href", appWebUrl + "/Pages/Default.aspx?SPAppWebUrl="+appWebUrl+"&SPHostUrl="+hostWebUrl);
		
	$("#adminHome").attr("href", appWebUrl + "/Pages/Admin/Default.aspx?SPAppWebUrl=" + appWebUrl + "&SPHostUrl=" + hostWebUrl);

	$("#backToSharePoint").click(function () {
		document.location = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
	});
});

function getFieldsByListName(listName){
	var fields = "";
	$.each(listNames.lists, function(i, v) {
		if (v.listName == listName){
			$.each(v.fields, function(j, w) {
				fields += w.fieldInternalName + ",";
			});
			return false;
		}
	});
	return fields.substring(0, fields.lastIndexOf(','));
}
	
function getListMaxRows(listName) {
    var maxRows = -1;//unlimited
    $.each(listNames.lists, function (i, v) {
        if (v.listName == listName && v.maxRows != null) {
            console.log(v.listName + " " + v.maxRows);
            maxRows = v.maxRows;
            return false;
        }
    });
    return maxRows;
}

function getFieldTypeByListFieldInternalName(listName, listFieldName){
	var fieldType = "";
	$.each(listNames.lists, function(i, v) {
		if (v.listName == listName){
				
			console.log(v.listName + " " + JSON.stringify(v.fields));
			$.each(v.fields, function(j, w) {
				console.log(w.fieldType);
				if(w.fieldInternalName == listFieldName){
					fieldType = w.fieldType;
					return false;
				}
			});
			console.log(fieldType);
			return false;
		}
	});
	return fieldType;
}
	
function getFieldDisplayNameByListFieldInternalName(listName, listFieldInternalName){
	var fieldDisplayName = "";
	$.each(listNames.lists, function(i, v) {
		if (v.listName == listName){
				
			console.log(v.listName + " " + JSON.stringify(v.fields));
			$.each(v.fields, function(j, w) {
				console.log(w.fieldType);
				if(w.fieldInternalName == listFieldInternalName){
					fieldDisplayName = w.fieldDisplayName;
					return false;
				}
			});
			console.log(fieldDisplayName);
			return false;
		}
	});
	return fieldDisplayName;
}
	
function showMsg(msg){
	if($("#spanMsg").text().length > 0)
		$("#spanMsg").html($("#spanMsg").html() + "<br/>" + msg);
	else
		$("#spanMsg").html(msg);
	$("#divMsg").show();
}

function clearMsg(){
	$("#spanMsg").html("");
	$("#divMsg").hide();
}
	
function getQueryStringParameter(paramToRetrieve) { 
	var params = 
	    document.URL.split("?")[1].split("&"); 
	for (var i = 0; i < params.length; i = i + 1) { 
	    var singleParam = params[i].split("="); 
	    if (singleParam[0] == paramToRetrieve) 
	        return singleParam[1]; 
	} 
}
	
function refreshPage(){
	window.location.reload(true);
}

function createSingleList(listName, fromAdminPanel) {
	$.each(listNames.lists, function (i, v) {
	    if (v.listName == listName) {
	        //var clientContext = new SP.ClientContext(appWebUrl);
	        /*var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
	        clientContext.set_webRequestExecutorFactory(factory);*/
	        //var appContextSite = new SP.AppContextSite(clientContext, appWebUrl);
	        //createList(clientContext, appContextSite, listName, v.fields, fromAdminPanel);
	        createList(clientContext, listName, v.fields, fromAdminPanel);
	        return;
	    }
	});
}

//function createList(clientContext, appContextSite, listName, fields, fromAdminPanel) {
function createList(clientContext, listName, fields, fromAdminPanel) {
	var listCreationInfo = new SP.ListCreationInformation();
	listCreationInfo.set_title(listName);
	listCreationInfo.set_templateType(SP.ListTemplateType.genericList);

	//if (webLists === null)
	//    webLists = clientContext.get_web().get_lists();

	var oList = webLists.add(listCreationInfo);

	clientContext.load(oList);
	clientContext.executeQueryAsync(onSuccess, onFail);

	function onSuccess() {
	    if (fromAdminPanel)
	        showMsg("List " + listName + " created.");
	    console.log("List " + listName + " created.");
	    //createListFields(clientContext, appContextSite, oList, fields, fromAdminPanel)
	    createListFields(clientContext, oList, fields, fromAdminPanel)
	}
	function onFail(sender, args) {
	    if (fromAdminPanel)
	        showMsg("Failed to create list " + listName + ". Error:" + args.get_message());
	    console.log("Failed to create list " + listName + ". Error:" + args.get_message());
	}
}

//function createListFields(clientContext, appContextSite, oList, fields, fromAdminPanel) {
function createListFields(clientContext, oList, fields, fromAdminPanel) {
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
	clientContext.executeQueryAsync(onSuccess, onFail);
	function onSuccess() {
	    console.log("Fields created in List " + oList.get_title());
	    if (fromAdminPanel) {
	        showMsg("Fields created in List " + oList.get_title());
	        //displayAllLists(clientContext, appContextSite);
	        displayAllLists(clientContext);
	    }
	    else {
	        //var objClient = new SPClient();
	        if (oList.get_title() == overviewListName)
	            objClient.getListData(overviewListName, getFieldsByListName(overviewListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
	        if (oList.get_title() == personalInfoListName)
	            objClient.getListData(personalInfoListName, getFieldsByListName(personalInfoListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
	        if (oList.get_title() == skillListName)
	            objClient.getListData(skillListName, getFieldsByListName(skillListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackSkillSuccess, callbackFail);
	        if (oList.get_title() == certificationListName)
	            objClient.getListData(certificationListName, getFieldsByListName(certificationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackCertificationSuccess, callbackFail);
	        if (oList.get_title() == projectListName)
	            objClient.getListData(projectListName, getFieldsByListName(projectListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackProjectSuccess, callbackFail);
	        if (oList.get_title() == experienceListName)
	            objClient.getListData(experienceListName, getFieldsByListName(experienceListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackExperienceSuccess, callbackFail);
	        if (oList.get_title() == educationListName)
	            objClient.getListData(educationListName, getFieldsByListName(educationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackEducationSuccess, callbackFail);
	    }
	}

	function onFail(sender, args) {
	    if (fromAdminPanel)
	        showMsg("Failed to create fields in list " + oList.get_title() + ". Error:" + args.get_message());
	    console.log("Failed to create fields in list " + oList.get_title() + ". Error:" + args.get_message());
	}
}

//function displayAllLists(clientContext, appContextSite) {
function displayAllLists(clientContext){
    //var listCollection = clientContext.get_web().get_lists();
    //clientContext.load(listCollection);
	clientContext.load(webLists);
	clientContext.executeQueryAsync(onSuccess, onFail);
	function onSuccess() {
	    var le = webLists.getEnumerator();
	    var oList;
	    var listArray = [];
	    var counter = 0;

	    while (le.moveNext()) {
	        oList = le.get_current();
	        if (jQuery.inArray(oList.get_title(), excludeListNames) >= 0) {
	            continue;
	        }
	        listArray[counter++] = oList.get_title();
	    }
	    var html = "<ul class='list-group'>";
	    for (var i = 0; i < listNames.lists.length ; i++) {
	        html += "<li class='list-group-item'>";
	        html += listNames.lists[i].listName;
	        html += "<span style='float:right'>";
	        if (jQuery.inArray(listNames.lists[i].listName, listArray) >= 0) {
	            html += "<a class='deleteSingleList' data='" + listNames.lists[i].listName + "'>Delete</a>";
	            html += " | ";
	            html += "<a href='" + appWebUrl + "/Pages/Admin/List/View.aspx?listName=" + listNames.lists[i].listName + "&SPAppWebUrl=" + appWebUrl + "&SPHostUrl=" + hostWebUrl + "'>Manage Data</a>";
	        }
	        else {
	            html += "<a class='createSingleList' data='" + listNames.lists[i].listName + "'>Create</a>";
	        }
	        html += "</span>";
	        html += "</li>";
	    }
	    html += "</ul>";
	    $("#lists").html(html);
	    refreshDynamicEventListener();
	}
	function onFail(sender, args) {
	    showMsg("Error in getting lists. Error is " + args.get_message());
	}
}

function refreshDynamicEventListener() {
	// Remove handler from existing elements
	$(".createSingleList").off();

	// Re-add event handler for all matching elements
	$(".createSingleList").on("click", function () {
	    clearMsg();
	    createSingleList($(this).attr("data"), true);
	});

	$(".deleteSingleList").off();

	// Re-add event handler for all matching elements
	$(".deleteSingleList").on("click", function () {
	    clearMsg();
	    if (confirm("Are you sure you want to delete?"))
	        deleteSingleList($(this).attr("data"));
	});

	$(".deleteItem").off();

    // Re-add event handler for all matching elements
	$(".deleteItem").on("click", function () {
	    clearMsg();
	    if (confirm("Are you sure you want to delete?"))
	        objClient.deleteListData(listName, $(this).attr("data"), callbackDeleteItemSuccess, callbackDeleteItemFail);
	});
}

function deleteSingleList(listName) {
	$.each(listNames.lists, function (i, v) {
	    if (v.listName == listName) {
	        //var clientContext = new SP.ClientContext(appWebUrl);
	        /*var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
	        clientContext.set_webRequestExecutorFactory(factory);*/
	        //var appContextSite = new SP.AppContextSite(clientContext, appWebUrl);
	        //deleteList(clientContext, appContextSite, listName);
	        deleteList(clientContext, listName);
	        return;
	    }
	});
}

//function deleteList(clientContext, appContextSite, listName) {
function deleteList(clientContext, listName) {
    //var listCollection = appContextSite.get_web().get_lists();
    //var listCollection = clientContext.get_web().get_lists();
    //clientContext.load(listCollection);
    clientContext.load(webLists);
	clientContext.executeQueryAsync(onSuccess, onFail);

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
	        clientContext.executeQueryAsync(onListDeleteSuccess, onListDeleteFail);
	    }
	    else {
	        showMsg("List " + listName + " doesn't exist");
	    }

	    function onListDeleteSuccess() {
	        //showMsg("List " + listName + " deleted.");
	        //displayAllLists(clientContext, appContextSite);
	        //displayAllLists(clientContext);
	        refreshPage();
	    }
	    function onListDeleteFail(sender, args) {
	        showMsg("Failed to delete list " + listName + ". Error:" + args.get_message());
	    }
	}

	function onFail(sender, args) {
	    showMsg("Failed to query lists. Error:" + args.get_message());
	}
}


//function deleteAllLists(clientContext, appContextSite) {
function deleteAllLists(clientContext) {
    $.each(listNames.lists, function (i, v) {
        //var oList = appContextSite.get_web().get_lists().getByTitle(v.listName);
        //var oList = clientContext.get_web().get_lists().getByTitle(v.listName);
        var oList = webLists.getByTitle(v.listName);
        oList.deleteObject();
        clientContext.executeQueryAsync(
            function () {
                showMsg("List " + v.listName + " deleted.");
                deletedListCounter++;
                if(deletedListCounter == listNames.lists.length)
                    refreshPage();
            },
            function (sender, args) {
                showMsg("Failed to delete list " + v.listName + ". Error:" + args.get_message());
            }
        );
    });
    
}

function callbackFail(msg, listName) {
	if (msg.indexOf("List '" + listName + "' does not exist at site with URL") == 0) {
	    createSingleList(listName, false);
	}
	else
	    showMsg(msg);
}

function callbackOverviewSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
	if (objfieldsData.length == 1) {
	    $('.short-overview').text(objfieldsData[0]["Title"]);
	    $('.long-overview').text(objfieldsData[0]["LongOverview"]);
	}
	else {
	    $('.short-overview').html("<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>");
	    $('.long-overview').html("<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>");
	}
	objClient.getListData(personalInfoListName, getFieldsByListName(personalInfoListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
	
}

function callbackPersonalInfoSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
	if (objfieldsData.length == 1) {
	    $('#address').text(objfieldsData[0]["Title"]);
	    $('#email').html(objfieldsData[0]["Email"]);
	    $('#phone').html(objfieldsData[0]["Phone"]);
	}
	else {
	    $('#address').html("<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>");
	    $('#email').html("<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>");
	    $('#phone').html("<a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a>");
	}
	objClient.getListData(skillListName, getFieldsByListName(skillListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackSkillSuccess, callbackFail);
	
}

function callbackSkillSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
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
	$("#skill").html(html);
	objClient.getListData(certificationListName, getFieldsByListName(certificationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackCertificationSuccess, callbackFail);
	
}

function callbackCertificationSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
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
	$("#certification").html(html);
	
	objClient.getListData(experienceListName, getFieldsByListName(experienceListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackExperienceSuccess, callbackFail);
	
}
function callbackExperienceSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<tr>";
	        html += "<td>" + objfieldsData[i]["Title"] + "</td>";
	        html += "<td>" + objfieldsData[i]["Company"].description + "</td>";
	        html += "<td>" + objfieldsData[i]["Company"].url + "</td>";
	        html += "</tr>";
	    }
	}
	$("#experience").html(html);
	objClient.getListData(educationListName, getFieldsByListName(educationListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackEducationSuccess, callbackFail);

}

function callbackEducationSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<tr>";
	        html += "<td class='education'>" + objfieldsData[i]["Title"] + "</td>";
	        html += "<td>" + objfieldsData[i]["University"].description + "</td>";
	        html += "<td>" + objfieldsData[i]["University"].url + "</td>";
	        html += "<td>" + objfieldsData[i]["Completed"] + "</td>";
	        html += "</tr>";
	    }
	}
	$("#education").html(html);
	objClient.getListData(projectListName, getFieldsByListName(projectListName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackProjectSuccess, callbackFail);
}

function callbackProjectSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<div class='project-single-height'>";
	            html += "<div class='row'>" +
					        "<div class='col-xs-12 col-md-5 project'>" + objfieldsData[i]["Title"] + "</div>" +
					        "<div class='col-xs-12 col-md-7 project-version'>" + objfieldsData[i]["Tags"] + "</div>" +
				        "</div>" +
				        "<hr class='hrLine'/>" +
			            objfieldsData[i]["Description"]
            html += "</div>";
	    }
	}
	$("#project").html(html);
}



function setCookie(cname, cvalue) {
	document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	        c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	        return c.substring(name.length, c.length);
	    }
	}
	return "";
}

function getClientContext(siteUrl) {
    if ($.isNullOrEmpty(siteUrl))
        return new SP.ClientContext.get_current();
    return new SP.ClientContext(siteUrl);
}

function updateUrl(urlFieldId) {
    $("#" + urlFieldId).val($("#" + urlFieldId + "_url").val() + ", " + $("#" + urlFieldId + "_description").val());
}