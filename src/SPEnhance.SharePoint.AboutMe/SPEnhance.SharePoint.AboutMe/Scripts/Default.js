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
		
        $("#print").click(function () {
			window.print();
		});
		
        $("#viewAdmin").attr("href", document.URL.replace("/Pages/Default", "/Pages/Admin/Default"));

    });
    
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
		
	
	
})();