var projectVersion = "1.0.1.0";

$("head").append('<link rel="Stylesheet" type="text/css" href="' + path + 'Content/App.min.css?v=' + projectVersion + '" />');
$("head").append('<link rel="stylesheet" type="text/css" href="' + path + 'Content/Print.min.css?v=' + projectVersion + '" media="print" />');

$(document).ready(function() {
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/External/angular.min.js">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/External/angular-route.min.js">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/External/ngHtmlCompile.js">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/External/MicrosoftAjax.js">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/External/sp.runtime.js">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/External/sp.js">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/External/sp.requestexecutor.js">');
    $("footer").append('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/CSOM.min.js?v=' + projectVersion + '">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/Initialize.min.js?v=' + projectVersion + '">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/Common.min.js?v=' + projectVersion + '">');
    $("footer").append('<script type="text/javascript" src="' + path + 'Scripts/'+getJsFile()+'.min.js?v=' + projectVersion + '">');
});

function getJsFile() {
    var url = document.URL.toLowerCase();
    var jsFileName = "";
    if (url.indexOf("/aboutme/pages/admin/list/new") > 0)
        jsFileName = "Admin/List/New";
    else if (url.indexOf("/aboutme/pages/admin/list/edit") > 0)
        jsFileName = "Admin/List/Edit";
    else if (url.indexOf("/aboutme/pages/admin/list/view") > 0)
        jsFileName = "Admin/List/View";
    else if (url.indexOf("/aboutme/pages/admin/default") > 0)
        jsFileName = "Admin/Default";
    else
        jsFileName = "Default";
    return jsFileName;
}