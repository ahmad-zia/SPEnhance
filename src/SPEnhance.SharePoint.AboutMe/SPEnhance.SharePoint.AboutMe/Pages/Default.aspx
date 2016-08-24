<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Resume Builder</title> 
		<meta name="description" content="">
		<meta http-equiv="default-style" content="text/css" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="start" href="Default.aspx" title="Resume Builder" />
		
		<script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.min.js"></script>
		<script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>	
		<script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
		<script type="text/javascript" src="/_layouts/15/sp.js"></script>
		<script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js"></script>
		<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		
		<link rel="Stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
		<link rel="Stylesheet" type="text/css" href="../Content/App.css" />
		<link rel="stylesheet" type="text/css" href="../Content/Print.css" media="print" />
		
		<script type="text/javascript" src="../Scripts/Common.js"></script>
		<script type="text/javascript" src="../Scripts/CSOM.js"></script>
		<script type="text/javascript" src="../Scripts/Default.js"></script>
        
	</head>
	<body>
		<!--[if lt IE 8]>
			<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->
		
		<div class="container">
			<div id="divMsg" class="alert alert-danger alert-dismissible msg no-print" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<span id="spanMsg"></span>
			</div>
			<div class="row">
				<div class="col-xs-12 col-md-8">
					<div class="title">loading...</div>
					<div class="short-overview">loading...</div>
				</div>
				<div class="col-xs-12 col-md-4">
					<div class="address">
						<span class="glyphicon glyphicon-home" aria-hidden="true"></span> <span id="address">Loading...</span>
						<br/><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> <span id="email">Loading...</span>
						<br/><span class="glyphicon glyphicon-phone" aria-hidden="true"></span> <span id="phone">Loading...</span>
					</div>
				</div>
			</div>
			<hr/>
			<p class="long-overview">
				loading...
			</p>

			<div class="row">
				<div class="col-md-6">
					<div class="panel panel-default">
						<div class="panel-heading">Skills</div>
						<table id="skill" class="table table-bordered skill-table">
							<tr><td>loading...</td></tr>
						</table>
					</div>
				</div>
				<div class="col-md-6">
					<div class="panel panel-default">
						<div class="panel-heading">Certifications</div>
						<table id="certification" class="table table-bordered skill-table">
							<tr><td>loading...</td></tr>
						</table>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-md-6">
					<div class="panel panel-default">
						<div class="panel-heading">Work Experience</div>
						<table id="experience" class="table table-bordered skill-table">
							<tr><td>loading...</td></tr>
						</table>
					</div>
				</div>
				<div class="col-md-6">
					<div class="panel panel-default">
						<div class="panel-heading">Education</div>
						<table id="education" class="table table-bordered skill-table">
							<tr><td>loading...</td></tr>
						</table>
					</div>
				</div>
			</div>
			
			<div class="panel panel-default">
				<div class="panel-heading">Projects</div>
				<div id="project" class="panel-body">Loading...</div>
			</div>
			<div class="text-right no-print"><a id="viewAdmin">Admin</a> | <a href="#" id="print">Print</a> | <a class="pointerCursor" id="refresh">Refresh</a></div>

            <div class="no-print">
                <input type="button" value="Back to SharePoint" id="backToSharePoint" />
            </div>
		</div>
        
	</body>
</html>