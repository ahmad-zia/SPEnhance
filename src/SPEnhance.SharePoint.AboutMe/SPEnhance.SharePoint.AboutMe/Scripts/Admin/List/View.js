var listName = decodeURIComponent(getQueryStringParameter("listName"));
//var objClient = new SPClient();
$(document).ready(function () {
    clearMsg();

    objClient = new SPClient();
    objClient.consoleLog(true);

    $("#spanListName").text(listName);

    //objClient.getListData(appWebUrl, listName, "ID," + getFieldsByListName(listName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackListSuccess, callbackFail);
    objClient.getListData(listName, "ID," + getFieldsByListName(listName), "<View><Query><Where><Eq><FieldRef Name='Author'/><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>", callbackListSuccess, callbackFail);

    $("#new").click(function () {
        document.location = "new.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
    });
    
    $("#deleteAllListData").click(function () {
        deleteAllListData(listName);
    });
});

function callbackListSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
    var fieldInternalNamesArray = commaSeperatedFieldInternalNames.split(',');
    var html = "";
    if (objfieldsData.length > 0) {
        if (getListMaxRows(listName) == 1)
            $("#new").hide();
        $("#deleteAllListData").show();

        html += "<div class='table-responsive'><table class='table table-hover'";
        html += "<tr>";
        for (var j = 0 ; j < fieldInternalNamesArray.length ; j++) {
            html += "<th>" + getFieldDisplayNameByListFieldInternalName(listName, fieldInternalNamesArray[j]) + "</th>";
        }
        html += "<th></th>";
        html += "</tr>";
        for (var i = 0 ; i < objfieldsData.length ; i++) {
            html += "<tr>";
            for (j = 0 ; j < fieldInternalNamesArray.length ; j++) {
                var fieldType = getFieldTypeByListFieldInternalName(listName, fieldInternalNamesArray[j]);
                console.log("fieldType: " + fieldType);
                html += "<td>";
                if (objfieldsData[i][fieldInternalNamesArray[j]] == null || objfieldsData[i][fieldInternalNamesArray[j]] == "undefined")
                    html += "&nbsp;";
                else {
                    if (fieldType == "URL") {
                        console.log(objfieldsData[i][fieldInternalNamesArray[j]]);
                        html += "<a href='" + objfieldsData[i][fieldInternalNamesArray[j]].url + "' target='_blank'>" + objfieldsData[i][fieldInternalNamesArray[j]].description + "</a>";
                    }
                    else
                        html += objfieldsData[i][fieldInternalNamesArray[j]];
                }
                html += "</td>";
            }
            html += "<td>";
            html += "<a href='" + appWebUrl + "/Pages/Admin/List/Edit.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&listItemId=" + objfieldsData[i]["ID"] + "&SPHostUrl=" + hostWebUrl + "'>Edit</a> | ";
            html += "<a class='deleteItem pointerCursor' data='" + objfieldsData[i]["ID"] + "'>Delete</a>";
            html += "</td>";
            html += "</tr>";
        }
        html += "</table></div>";
        $("#listData").html(html);
        refreshDynamicEventListener();
    }
    else {
        $("#listData").text("No data exist.");
    }
}

function callbackFail(msg) {
    console.log(msg);
}

function deleteAllListData(listName) {
    if (confirm("Are you sure you want to delete all list data?")) {
        //objClient.deleteAllListData(appWebUrl, listName, callbackDeleteAllListDataSuccess, callbackDeleteAllListDataFail);
        objClient.deleteAllListData(listName, callbackDeleteAllListDataSuccess, callbackDeleteAllListDataFail);
    }
}

function callbackDeleteAllListDataSuccess() {
    //showMsg("All list data has been deleted.");
    //objClient.getListData(appWebUrl, listName, "ID," + getFieldsByListName(listName), "", callbackListSuccess, callbackFail);
    //objClient.getListData(listName, "ID," + getFieldsByListName(listName), "", callbackListSuccess, callbackFail);
    refreshPage();
}

function callbackDeleteAllListDataFail(msg) {
    showMsg(msg);
}

function callbackDeleteItemSuccess() {
    //showMsg("The data has been deleted.");
    //objClient.getListData(appWebUrl, listName, "ID," + getFieldsByListName(listName), "", callbackListSuccess, callbackFail);
    //objClient.getListData(listName, "ID," + getFieldsByListName(listName), "", callbackListSuccess, callbackFail);
    refreshPage();
}

function callbackDeleteItemFail(msg) {
    showMsg(msg);
}