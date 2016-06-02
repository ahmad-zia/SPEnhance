var appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

var objClient = new SPClient();
objClient.consoleLog(true);
(function () {

    $(document).ready(function () {
		clearMsg();
		
		objClient.getListData(appWebUrl, overviewListName, getFieldsByListName(overviewListName), "<View><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
		objClient.getListData(appWebUrl, personalInfoListName, getFieldsByListName(personalInfoListName), "<View><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
		objClient.getListData(appWebUrl, skillListName, getFieldsByListName(skillListName), "", callbackSkillSuccess, callbackFail);
		objClient.getListData(appWebUrl, certificationListName, getFieldsByListName(certificationListName), "", callbackCertificationSuccess, callbackFail);
		objClient.getListData(appWebUrl, projectListName, getFieldsByListName(projectListName), "", callbackProjectSuccess, callbackFail);
		objClient.getListData(appWebUrl, experienceListName, getFieldsByListName(experienceListName), "", callbackExperienceSuccess, callbackFail);
		objClient.getListData(appWebUrl, educationListName, getFieldsByListName(educationListName), "", callbackEducationSuccess, callbackFail);
		
        getUserName();
		
		$("#print").click(function(){
			window.print();
		});
		
		$("#viewAdmin").attr("href", document.URL.replace("/Pages/Default", "/Pages/Admin/Default"));
    });
	function callbackFail(msg){
		showMsg(msg);
	}
    function getUserName() {
		var context = SP.ClientContext.get_current();
		var user = context.get_web().get_currentUser();
        context.load(user);
        context.executeQueryAsync(onSuccess, onFail);
		function onSuccess() {
	        $('.title').text(user.get_title());
	    }
	
	    function onFail(sender, args) {
	        showMsg('Failed to get user name. Error:' + args.get_message());
	    }
    }
		
	function callbackOverviewSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
		if(objfieldsData.length == 1){
		    $('.short-overview').text(objfieldsData[0]["Title"]);
		    $('.long-overview').text(objfieldsData[0]["LongOverview"]);
		}
		else {
		    $('.short-overview').text("N/A");
		    $('.long-overview').text("N/A");
		}
    }
	
	function callbackPersonalInfoSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
		if(objfieldsData.length == 1){
		    $('#address').text(objfieldsData[0]["Title"]);
			$('#email').html(objfieldsData[0]["Email"]);
			$('#phone').html(objfieldsData[0]["Phone"]);
		}
		else {
		    $('#address').text("N/A");
		    $('#email').html("N/A");
		    $('#phone').html("N/A");
		}
    }
	
	function callbackSkillSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
		var html = "<tr><td>N/A</td></tr>";
	    if(objfieldsData.length > 0){
			html = "";
			for(var i=0 ; i<objfieldsData.length ; i++){
				var j=0;
				html += "<tr>";
				html += "<td class='skill'>" + objfieldsData[i]["Title"] + "</td>";
				html += "<td>" + objfieldsData[i]["Experience"] + "</td>";
				html += "</tr>";
			}
		}
		$("#skill").html(html);
    }
	
	function callbackCertificationSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
		var html = "<tr><td>N/A</td></tr>";
	    if(objfieldsData.length > 0){
			html = "";
			for(var i=0 ; i<objfieldsData.length ; i++){
				var j=0;
				html += "<tr>";
				html += "<td class='skill'>" + objfieldsData[i]["Title"] + "</td>";
				html += "<td>" + objfieldsData[i]["Completed"] + "</td>";
				html += "</tr>";
			}
		}
		$("#certification").html(html);
    }
	function callbackExperienceSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
		var html = "<tr><td>N/A</td></tr>";
		if(objfieldsData.length > 0){
			html = "";
			for(var i=0 ; i<objfieldsData.length ; i++){
				var j=0;
				html += "<tr>";
				html += "<td>" + objfieldsData[i]["Title"] + "</td>";
				html += "<td>" + objfieldsData[i]["Company"].description + "</td>";
				html += "<td>" + objfieldsData[i]["Company"].url + "</td>";
				html += "</tr>";
			}
		}
		$("#experience").html(html);
    }
	
	function callbackEducationSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
		var html = "<tr><td>N/A</td></tr>";
		if(objfieldsData.length > 0){
			html = "";
			for(var i=0 ; i<objfieldsData.length ; i++){
				var j=0;
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
	
	function callbackProjectSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
		var html = "N/A";
		if(objfieldsData.length > 0){
			html = "";
			for(var i=0 ; i<objfieldsData.length ; i++){
				var j=0;
				html += "<div class='row'>" +
						"<div class='col-xs-12 col-md-5 project'>" + objfieldsData[i]["Title"] +  "</div>" +
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
	
})();