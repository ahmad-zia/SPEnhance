(function () {

    $(document).ready(function () {
		clearMsg();

		getUserName();
		
		var objClient = new SPClient();
		objClient.consoleLog(true);

		objClient.getListData(appWebUrl, overviewListName, getFieldsByListName(overviewListName), "<View><Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where><RowLimit>1</RowLimit></View>", callbackOverviewSuccess, callbackFail);
		objClient.getListData(appWebUrl, personalInfoListName, getFieldsByListName(personalInfoListName), "<View><Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where><RowLimit>1</RowLimit></View>", callbackPersonalInfoSuccess, callbackFail);
		objClient.getListData(appWebUrl, skillListName, getFieldsByListName(skillListName), "<View><Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where></View>", callbackSkillSuccess, callbackFail);
		objClient.getListData(appWebUrl, certificationListName, getFieldsByListName(certificationListName), "<View><Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where></View>", callbackCertificationSuccess, callbackFail);
		objClient.getListData(appWebUrl, projectListName, getFieldsByListName(projectListName), "<View><Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where></View>", callbackProjectSuccess, callbackFail);
		objClient.getListData(appWebUrl, experienceListName, getFieldsByListName(experienceListName), "<View><Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where></View>", callbackExperienceSuccess, callbackFail);
		objClient.getListData(appWebUrl, educationListName, getFieldsByListName(educationListName), "<View><Where><Eq><FieldRef Name='Author' LookupId='True'/><Value Type='Lookup'><UserID/></Value></Eq></Where></View>", callbackEducationSuccess, callbackFail);
        		
        $("#print").click(function () {
			window.print();
		});
		
        $("#viewAdmin").attr("href", document.URL.replace("/Pages/Default", "/Pages/Admin/Default"));

    });
    
    function getUserName() {
		var context = SP.ClientContext.get_current();
		var user = context.get_web().get_currentUser();
        context.load(user);
        context.executeQueryAsync(onUserNameSuccess, onUserNameFail);

        function onUserNameSuccess() {
		    $('.title').text(user.get_title());
	    }
	
        function onUserNameFail(sender, args) {
	        showMsg('Failed to get user name. Error:' + args.get_message());
	    }
    }
})();