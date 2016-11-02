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
var descriptionFieldName = "description";
var urlFieldName = "url";
var excludeListFieldsToCreate = [titleFieldName];

var clientContext = new SP.ClientContext(appWebUrl);
var webLists = clientContext.get_web().get_lists();
var objClient = null;

var listNames = {
    "lists":
	[
		{
		    "listName": overviewListName,
		    "fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Short Overview", "fieldType": "Text" }, { "fieldInternalName": "LongOverview", "fieldDisplayName": "Long Overview", "fieldType": "Note", "numLines": "6", "richText": "FALSE", "sortable": "FALSE" }],
		    "maxRows": 1
		},
		{
		    "listName": personalInfoListName,
		    "fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Address", "fieldType": "Text" }, { "fieldInternalName": "Email", "fieldDisplayName": "Email", "fieldType": "Text" }, { "fieldInternalName": "Phone", "fieldDisplayName": "Phone", "fieldType": "Text" }],
		    "maxRows": 1
		},
		{
		    "listName": skillListName,
		    "fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Skill", "fieldType": "Text" }, { "fieldInternalName": "Experience", "fieldDisplayName": "Experience", "fieldType": "Text" }]
		},
		{
		    "listName": certificationListName,
		    "fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Certificate", "fieldType": "Text" }, { "fieldInternalName": "Completed", "fieldDisplayName": "Completed", "fieldType": "Text" }]
		},
		{
		    "listName": experienceListName,
		    "fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Time (year range)", "fieldType": "Text" }, { "fieldInternalName": "Company", "fieldDisplayName": "Company", "fieldType": "URL", "fieldFormat": "Hyperlink" }]
		},
		{
		    "listName": educationListName,
		    "fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Degreee", "fieldType": "Text" }, { "fieldInternalName": "University", "fieldDisplayName": "University", "fieldType": "URL", "fieldFormat": "Hyperlink" }, { "fieldInternalName": "Completed", "fieldDisplayName": "Completed", "fieldType": "Text" }]
		},
		{
		    "listName": projectListName,
		    "fields": [{ "fieldInternalName": "Title", "fieldDisplayName": "Project Name", "fieldType": "Text" }, { "fieldInternalName": "Description", "fieldDisplayName": "Description", "fieldType": "Note", "numLines": "6", "richText": "FALSE", "sortable": "FALSE" }, { "fieldInternalName": "Tags", "fieldDisplayName": "Tags", "fieldType": "Text" }]
		}
	]
};

function getQueryStringParameter(paramToRetrieve) {
    var returnValue = "";
    var params = document.URL.split("?")[1].split("&");
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            returnValue = singleParam[1];
    }
    return returnValue;
}