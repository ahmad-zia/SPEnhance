﻿<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>About Me</title> 
		<meta name="description" content="">
		<meta http-equiv="default-style" content="text/css" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="start" href="Default.aspx" title="About Me" />
		
		<script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.min.js"></script>
		<script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>	
		<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
		<script type="text/javascript" src="/_layouts/15/sp.js"></script>
		<script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js"></script>
		<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		
		<link rel="Stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
		<link rel="Stylesheet" type="text/css" href="../../../Content/App.css" />
		
		<script type="text/javascript" src="../../../Scripts/Common.js"></script>
		<script type="text/javascript" src="../../../Scripts/CSOM.js"></script>
		<script type="text/javascript" src="../../../Scripts/Admin/List/New.js"></script>
	</head>
	<body>
		<!--[if lt IE 8]>
			<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->
		
		<div class="container">
			<h3>Admin Panel</h3>	
			<div id="divMsg" class="alert alert-danger alert-dismissible msg" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<span id="spanMsg"></span>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading"><span id="spanListName"/></div>
				<div class="panel-body">
					
					<span id="listForm">Loading...</span>
					<p class="text-right">
						<input type="button" id="save" value="Save"/>
						<input type="button" id="cancel" value="Cancel"/>
					</p>
				</div>
			</div>
			<div class="text-right">
				<a class="pointerCursor" id="refresh">Refresh</a> | <a id="viewResume">View Resume</a> | <a id="adminHome">Admin Home</a>
			</div>
		</div>
	</body>
</html>