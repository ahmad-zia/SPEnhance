var hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
var appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

var overviewListName = "Overview";
var personalInfoListName = "PersonalInfo";
var skillListName = "Skills";
var certificationListName = "Certifications";
var experienceListName = "Experience";
var educationListName = "Education";
var projectListName = "Projects";
	
var composedLookListName = "Composed Looks";
var masterPageGalleryListName = "Master Page Gallery";
var excludeListNames = [composedLookListName, masterPageGalleryListName];
	
var titleFieldName = "Title";
var excludeListFieldsToCreate = [titleFieldName];
	
var listNames = {
	"lists" : 
	[
		{
			"listName": overviewListName,
			"fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Short Overview", "fieldType": "Text" }, { "fieldInternalName": "LongOverview", "fieldDisplayName": "Long Overview", "fieldType": "Note", "numLines": "6", "richText": "FALSE", "sortable": "FALSE" }]
		},
		{
			"listName": personalInfoListName,
			"fields": [{"fieldInternalName": "Title", "fieldDisplayName":"Address", "fieldType":"Text"}, {"fieldInternalName": "Email", "fieldDisplayName":"Email", "fieldType":"Text"}, {"fieldInternalName": "Phone", "fieldDisplayName":"Phone", "fieldType":"Text"}]
		}, 
		{
			"listName": skillListName,
			"fields": [{"fieldInternalName": "Title", "fieldDisplayName":"Skill", "fieldType":"Text"}, {"fieldInternalName": "Experience", "fieldDisplayName":"Experience", "fieldType":"Text"}]
		}, 
		{
			"listName": certificationListName,
			"fields": [{"fieldInternalName": "Title", "fieldDisplayName":"Certificate", "fieldType":"Text"}, {"fieldInternalName": "Completed", "fieldDisplayName":"Completed", "fieldType":"Text"}]
		}, 
		{
			"listName": experienceListName,
			"fields": [{"fieldInternalName": "Title", "fieldDisplayName":"Time (year range)", "fieldType":"Text"}, {"fieldInternalName": "Company", "fieldDisplayName":"Company", "fieldType":"URL", "fieldFormat":"Hyperlink"}]
		}, 
		{
			"listName": educationListName,
			"fields": [{"fieldInternalName": "Title", "fieldDisplayName":"Degreee", "fieldType":"Text"}, {"fieldInternalName": "University", "fieldDisplayName":"University", "fieldType":"URL", "fieldFormat":"Hyperlink"}, {"fieldInternalName": "Completed", "fieldDisplayName":"Completed", "fieldType":"Text"}]
		},
		{
			"listName": projectListName,
			"fields": [{"fieldInternalName": "Title", "fieldDisplayName":"Project Name", "fieldType":"Text"}, {"fieldInternalName": "Description", "fieldDisplayName":"Description", "fieldType":"Note", "numLines": "6" , "richText":"FALSE", "sortable": "FALSE"}, {"fieldInternalName": "Tags", "fieldDisplayName":"Tags", "fieldType":"Text"}]
		}
	]
};
	
$(document).ready(function () {
	$("#refresh").click(function(){
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
	        var clientContext = new SP.ClientContext(appWebUrl);
	        /*var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
	        clientContext.set_webRequestExecutorFactory(factory);*/
	        var appContextSite = new SP.AppContextSite(clientContext, appWebUrl);
	        createList(clientContext, appContextSite, listName, v.fields, fromAdminPanel);
	        return;
	    }
	});
}

function createList(clientContext, appContextSite, listName, fields, fromAdminPanel) {
	var listCreationInfo = new SP.ListCreationInformation();
	listCreationInfo.set_title(listName);
	listCreationInfo.set_templateType(SP.ListTemplateType.genericList);

	var oList = appContextSite.get_web().get_lists().add(listCreationInfo);

	clientContext.load(oList);
	clientContext.executeQueryAsync(onSuccess, onFail);

	function onSuccess() {
	    if (fromAdminPanel)
	        showMsg("List " + listName + " created.");
	    console.log("List " + listName + " created.");
	    createListFields(clientContext, appContextSite, oList, fields, fromAdminPanel)
	}
	function onFail(sender, args) {
	    if (fromAdminPanel)
	        showMsg("Failed to create list " + listName + ". Error:" + args.get_message());
	    console.log("Failed to create list " + listName + ". Error:" + args.get_message());
	}
}

function createListFields(clientContext, appContextSite, oList, fields, fromAdminPanel) {
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
	        displayAllLists(clientContext, appContextSite);
	    }
	    else {
	        var objClient = new SPClient();
	        if (oList.get_title() == overviewListName)
	            objClient.getListData(appWebUrl, overviewListName, getFieldsByListName(overviewListName), "<View><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
	        if (oList.get_title() == personalInfoListName)
	            objClient.getListData(appWebUrl, personalInfoListName, getFieldsByListName(personalInfoListName), "<View><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
	        if (oList.get_title() == skillListName)
	            objClient.getListData(appWebUrl, skillListName, getFieldsByListName(skillListName), "", callbackSkillSuccess, callbackFail);
	        if (oList.get_title() == certificationListName)
	            objClient.getListData(appWebUrl, certificationListName, getFieldsByListName(certificationListName), "", callbackCertificationSuccess, callbackFail);
	        if (oList.get_title() == projectListName)
	            objClient.getListData(appWebUrl, projectListName, getFieldsByListName(projectListName), "", callbackProjectSuccess, callbackFail);
	        if (oList.get_title() == experienceListName)
	            objClient.getListData(appWebUrl, experienceListName, getFieldsByListName(experienceListName), "", callbackExperienceSuccess, callbackFail);
	        if (oList.get_title() == educationListName)
	            objClient.getListData(appWebUrl, educationListName, getFieldsByListName(educationListName), "", callbackEducationSuccess, callbackFail);
	    }
	}

	function onFail(sender, args) {
	    if (fromAdminPanel)
	        showMsg("Failed to create fields in list " + oList.get_title() + ". Error:" + args.get_message());
	    console.log("Failed to create fields in list " + oList.get_title() + ". Error:" + args.get_message());
	}
}

function displayAllLists(clientContext, appContextSite) {
	var listCollection = clientContext.get_web().get_lists();
	clientContext.load(listCollection);
	clientContext.executeQueryAsync(onSuccess, onFail);
	function onSuccess() {
	    var le = listCollection.getEnumerator();
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
	    deleteSingleList($(this).attr("data"));
	});
}

function deleteSingleList(listName) {
	$.each(listNames.lists, function (i, v) {
	    if (v.listName == listName) {
	        var clientContext = new SP.ClientContext(appWebUrl);
	        /*var factory = new SP.ProxyWebRequestExecutorFactory(appWebUrl);
	        clientContext.set_webRequestExecutorFactory(factory);*/
	        var appContextSite = new SP.AppContextSite(clientContext, appWebUrl);
	        deleteList(clientContext, appContextSite, listName);
	        return;
	    }
	});
}

function deleteList(clientContext, appContextSite, listName) {
	var listCollection = appContextSite.get_web().get_lists();
	clientContext.load(listCollection);
	clientContext.executeQueryAsync(onSuccess, onFail);

	function onSuccess() {
	    var listExists = false;
	    var le = listCollection.getEnumerator();
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
	        showMsg("List " + listName + " deleted.");
	        displayAllLists(clientContext, appContextSite);
	    }
	    function onListDeleteFail(sender, args) {
	        showMsg("Failed to delete list " + listName + ". Error:" + args.get_message());
	    }
	}

	function onFail(sender, args) {
	    showMsg("Failed to query lists. Error:" + args.get_message());
	}
}


function deleteAllLists(clientContext, appContextSite) {
    $.each(listNames.lists, function (i, v) {
        var oList = appContextSite.get_web().get_lists().getByTitle(v.listName);
        oList.deleteObject();
        clientContext.executeQueryAsync(
            function () {
                showMsg("List " + v.listName + " deleted.");
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
}

function callbackProjectSuccess(objfieldsData, commaSeperatedFieldInternalNames, listName) {
	var html = "<tr><td><a name=\"add\" class=\"no-print\" href=\"" + document.URL.replace("/Pages/Default.aspx?", "/Pages/Admin/List/new.aspx?listName=" + listName + "&") + "\">Add</a></td></tr>";
	if (objfieldsData.length > 0) {
	    html = "";
	    for (var i = 0 ; i < objfieldsData.length ; i++) {
	        var j = 0;
	        html += "<div class='row'>" +
					"<div class='col-xs-12 col-md-5 project'>" + objfieldsData[i]["Title"] + "</div>" +
					"<div class='col-xs-12 col-md-7 project-version'>" + objfieldsData[i]["Tags"] + "</div>" +
				"</div>" +
				"<hr class='hrLine'/>" +
			objfieldsData[i]["Description"];
	    }
	}
	$("#project").html(html);
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