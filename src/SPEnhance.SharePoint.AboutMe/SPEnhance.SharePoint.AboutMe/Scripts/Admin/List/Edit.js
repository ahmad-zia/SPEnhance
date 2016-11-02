var listName = decodeURIComponent(getQueryStringParameter("listName"));
var listItemId = decodeURIComponent(getQueryStringParameter("listItemId"));

$(document).ready(function () {
    clearMsg();
    objClient = new SPClient();
    objClient.consoleLog(true);

    $("#spanListName").text(listName);
    var camlQuery = "<View><Query><Where><Eq><FieldRef Name=\'ID\'/><Value Type=\'Number\'>" + listItemId + "</Value></Eq></Where></Query></View>";
    //objClient.getListData(appWebUrl, listName, "ID," + getFieldsByListName(listName), camlQuery, callbackListDataSuccess, callbackListDataFail);
    objClient.getListData(listName, "ID," + getFieldsByListName(listName), camlQuery, callbackListDataSuccess, callbackListDataFail);


    $("#save").click(function () {
        var objFields = [];
        var objField = {};

        $.each($("input[data='field'], textarea[data='field']"), function (i, d) {
            objField = {};
            objField.fieldName = $(d).attr("id");
            console.log($(d).attr("fieldType") + " " + $(d).val());
            objField.fieldValue = $(d).val();
            objFields.push(objField);
        });

        var jsonListData = { "data": objFields };
        console.log(JSON.stringify(jsonListData));
        //objClient.createOrUpdateListItem(appWebUrl, listName, listItemId, jsonListData, callbackSaveSuccess, callbackSaveFail);
        objClient.createOrUpdateListItem(listName, listItemId, jsonListData, callbackSaveSuccess, callbackSaveFail);

    });

    $("#cancel").click(function () {
        document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
    });
});

function callbackListDataSuccess(objfieldsData, commaSeperatedFieldInternalNames) {
    createForm(listName, objfieldsData);
}

function callbackListDataFail(msg) {
    showMsg(msg);
}

function callbackSaveSuccess() {
    document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
}

function callbackSaveFail(sender, args) {
    showMsg(args.get_message());
}

function createForm(listName, objfieldsData) {
    console.log(objfieldsData);
    var formHtml = "<div class='form-horizontal'>";
    $.each(listNames.lists, function (i, v) {
        if (v.listName == listName) {
            console.log(v.listName + " " + JSON.stringify(v.fields));

            $.each(v.fields, function (j, w) {

                formHtml += "<div class='form-group'>";
                console.log(w.fieldInternalName);
                formHtml += "<label for='" + w.fieldInternalName + "' class='col-sm-2 control-label'>" + w.fieldDisplayName + "</label>";
                formHtml += "<div class='col-sm-10'>";

                if (w.fieldType == "Note") {
                    formHtml += "<textarea fieldType='Note' width='100%' rows='5' data='field' class='form-control' id='" + w.fieldInternalName + "'>" + objfieldsData[0][w.fieldInternalName] + "</textarea>";
                }
                else if (w.fieldType == "URL") {
                    formHtml += "<div class='form-group'>";
                    formHtml += "<div class='col-sm-5'><label>Url: </label><input type='text' class='form-control' onchange='updateUrl(\"" + w.fieldInternalName + "\")' id='" + w.fieldInternalName + "_url' value='" + objfieldsData[0][w.fieldInternalName].url + "' placeholder='http://www.google.com'/></div>";
                    formHtml += "<div class='col-sm-5'><label>Title: </label><input type='text' class='form-control' onchange='updateUrl(\"" + w.fieldInternalName + "\")' id='" + w.fieldInternalName + "_description' value='" + objfieldsData[0][w.fieldInternalName].description + "' placeholder='Google'/></div>";
                    formHtml += "<input type='hidden' data='field' class='form-control' id='" + w.fieldInternalName + "' value='" + objfieldsData[0][w.fieldInternalName].url + ", " + objfieldsData[0][w.fieldInternalName].description + "'/>";
                    formHtml += "</div>";
                }
                /*else if (w.fieldType == "URL") {
                    formHtml += "<input type='text' data='field' class='form-control' id='" + w.fieldInternalName + "' value='" + objfieldsData[0][w.fieldInternalName].url + ", " + objfieldsData[0][w.fieldInternalName].description + "'/>";
                    formHtml += "Example:- http://www.google.com, Google";
                }*/
                else {
                    formHtml += "<input type='text' data='field' class='form-control' id='" + w.fieldInternalName + "' value='" + objfieldsData[0][w.fieldInternalName] + "'/>";
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