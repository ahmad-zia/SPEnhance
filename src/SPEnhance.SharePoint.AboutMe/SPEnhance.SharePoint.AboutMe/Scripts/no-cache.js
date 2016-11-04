var projectVersion = "1.0.0.3";
var projectTitle = "Resume Builder";

$("head").append('<meta charset="utf-8">');
$("head").append('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
$("head > title").text(projectTitle);
$("head").append('<meta name="description" content="">');
$("head").append('<meta http-equiv="default-style" content="text/css" />');
$("head").append('<meta name="viewport" content="width=device-width, initial-scale=1">');
$("head").append('<link rel="start" href="Default.aspx" title="' + projectTitle + '" />');
$("head").append('<link rel="shortcut icon" href="#" />');

var url = document.URL;
var path = "";
if (url.indexOf("/AboutMe/Pages/Admin/List/") > 0)
    path = "../../../";
else if (url.indexOf("/AboutMe/Pages/Admin/") > 0)
    path = "../../";
else if (url.indexOf("/AboutMe/Pages/") > 0)
    path = "../";

$("head").append('<script type="text/javascript" src="/_layouts/15/sp.runtime.js">');
$("head").append('<script type="text/javascript" src="/_layouts/15/sp.js">');
$("head").append('<script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js">');
$("head").append('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js">');
$("head").append('<link rel="Stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />');


$("head").append('<link rel="Stylesheet" type="text/css" href="'+path+'Content/App.min.css?v=' + projectVersion + '" />');
$("head").append('<link rel="stylesheet" type="text/css" href="'+path+'Content/Print.min.css?v=' + projectVersion + '" media="print" />');
$("head").append('<script type="text/javascript" src="'+path+'Scripts/Initialize.min.js?v=' + projectVersion + '">');
$("head").append('<script type="text/javascript" src="'+path+'Scripts/Common.min.js?v=' + projectVersion + '">');
$("head").append('<script type="text/javascript" src="'+path+'Scripts/CSOM.min.js?v=' + projectVersion + '">');