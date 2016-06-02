(function(){
	var appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
	var listName = decodeURIComponent(getQueryStringParameter("listName"));
	var listItemId = decodeURIComponent(getQueryStringParameter("listItemId"));
	var objClient = new SPClient();

	$(document).ready(function () {
		clearMsg();
		
		$("#spanListName").text(listName);
		var camlQuery = "<View><Query><Where><Eq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>" + listItemId + "</Value></Eq></Where></Query></View>";
		objClient.getListData(appWebUrl, listName, "ID,"+getFieldsByListName(listName), camlQuery, callbackListDataSuccess, callbackListDataFail);
		
		
		$("#save").click(function(){
			var objClient = new SPClient();
			var objFields = [];
			var objField = {};

			$.each($("input[data='field'], textarea[data='field']"), function(i, d){
				objField = {};
				objField.fieldName = $(d).attr("id");
				console.log($(d).attr("fieldType") + " " + $(d).val());
				objField.fieldValue = $(d).val();	
				objFields.push(objField);
			});
			
			var jsonListData = { "data": objFields};
			console.log(JSON.stringify(jsonListData));
			objClient.createOrUpdateListItem(appWebUrl, listName, listItemId, jsonListData, callbackSaveSuccess, callbackSaveFail);
			
		});
		
		$("#cancel").click(function(){
			document.location = "View.aspx?SPAppWebUrl="+appWebUrl+"&listName="+listName;
		});
	});
	
	function callbackListDataSuccess(objfieldsData, commaSeperatedFieldInternalNames){
		createForm(listName, objfieldsData);	
	}
	
	function callbackListDataFail(msg){
		showMsg(msg);	
	}
	
	function callbackSaveSuccess(){
		document.location = "View.aspx?SPAppWebUrl="+appWebUrl+"&listName="+listName;
	}
	
	function callbackSaveFail(sender, args){
		showMsg(args.get_message());
	}
	
	function createForm(listName, objfieldsData){
		console.log(objfieldsData);
		var formHtml = "<div class='form-horizontal'>";
		$.each(listNames.lists, function(i, v) {
			if (v.listName == listName){
				console.log(v.listName + " " + JSON.stringify(v.fields));
				
				$.each(v.fields, function(j, w) {
					
					formHtml += "<div class='form-group'>";
						console.log(w.fieldInternalName);
						formHtml += "<label for='"+w.fieldInternalName+"' class='col-sm-2 control-label'>"+w.fieldDisplayName+"</label>";
						formHtml += "<div class='col-sm-10'>";
							
							if(w.fieldType == "Note"){
								formHtml += "<textarea fieldType='Note' width='100%' rows='5' data='field' class='form-control' id='"+w.fieldInternalName+"'>"+objfieldsData[0][w.fieldInternalName]+"</textarea>";
							}
							else if(w.fieldType == "URL"){
								formHtml += "<input type='text' data='field' class='form-control' id='"+w.fieldInternalName+"' value='"+objfieldsData[0][w.fieldInternalName].url + ", " + objfieldsData[0][w.fieldInternalName].description +"'/>";
								formHtml += "Example:- http://www.google.com, Google";
							}
							else{
								formHtml += "<input type='text' data='field' class='form-control' id='"+w.fieldInternalName+"' value='"+objfieldsData[0][w.fieldInternalName]+"'/>";	
							}
						formHtml += "</div>";
					formHtml += "</div>";
				});
				
				return false;
			}
		});
		formHtml += "</div>";
		
		$("#listForm").html(formHtml);
	}
	
	
})()