var listName = decodeURIComponent(getQueryStringParameter("listName"));

$(document).ready(function () {
    clearMsg();
    objClient = new SPClient();
    objClient.consoleLog(true);

    $("#spanListName").text(listName);
    createForm(listName);

    $("#save").click(function () {

        var objFields = [];
        var objField = {};

        $("#")

        $.each($("input[data='field'], textarea[data='field']"), function (i, d) {
            objField = {};
            objField.fieldName = $(d).attr("id");
            objField.fieldValue = $(d).val();
            objFields.push(objField);
        });

        var jsonListData = { "data": objFields };
        //objClient.createOrUpdateListItem(appWebUrl, listName, 0, jsonListData, callbackSaveSuccess, callbackSaveFail);
        objClient.createOrUpdateListItem(listName, 0, jsonListData, callbackSaveSuccess, callbackSaveFail);

    });

    $("#cancel").click(function () {
        document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
    });
});

function callbackSaveSuccess() {
    document.location = "View.aspx?SPAppWebUrl=" + appWebUrl + "&listName=" + listName + "&SPHostUrl=" + hostWebUrl;
}

function callbackSaveFail(sender, args) {
    showMsg(args.get_message());
}

function createForm(listName) {
    var formHtml = "<div class='form-horizontal'>";
    $.each(listNames.lists, function (i, v) {
        if (v.listName == listName) {
            $.each(v.fields, function (j, w) {
                formHtml += "<div class='form-group'>";
                formHtml += "<label for='" + w.fieldInternalName + "' class='col-sm-2 control-label'>" + w.fieldDisplayName + "</label>";
                formHtml += "<div class='col-sm-10'>";

                if (w.fieldType == "Note") {
                    formHtml += "<textarea width='100%' rows='5' data='field' class='form-control' id='" + w.fieldInternalName + "'/>";
                }
                else if (w.fieldType == "URL") {
                    formHtml += "<div class='form-group'>";
                    formHtml += "<div class='col-sm-5'><label>Url: </label><input type='text' class='form-control' onchange='updateUrl(\"" + w.fieldInternalName + "\")' id='" + w.fieldInternalName + "_url' placeholder='http://www.google.com'/></div>";
                    formHtml += "<div class='col-sm-5'><label>Title: </label><input type='text' class='form-control' onchange='updateUrl(\"" + w.fieldInternalName + "\")' id='" + w.fieldInternalName + "_description' placeholder='Google'/></div>";
                    formHtml += "<input type='hidden' data='field' class='form-control' id='" + w.fieldInternalName + "'/>";
                    formHtml += "</div>";
                }
                else
                    formHtml += "<input type='text' data='field' class='form-control' id='" + w.fieldInternalName + "'/>";
                if (w.fieldType == "URL") {
                    
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

