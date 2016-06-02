
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
	var appWebUrl = "";
	
	var listNames = {
		"lists" : 
		[
			{
				"listName": overviewListName,
				"fields": [{"fieldInternalName": "Title", "fieldDisplayName":"Short Overview", "fieldType":"Text"}, {"fieldInternalName": "LongOverview", "fieldDisplayName":"Long Overview", "fieldType":"Note", "numLines": "6" , "richText":"FALSE", "sortable": "FALSE"}] 
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
		var appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
		$("#viewResume").attr("href", appWebUrl + "/Pages/Default.aspx?SPAppWebUrl="+appWebUrl);
		
		$("#adminHome").attr("href", appWebUrl + "/Pages/Admin/Default.aspx?SPAppWebUrl="+appWebUrl);
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
