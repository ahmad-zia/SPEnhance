<!DOCTYPE html>
<html lang="en">
	<head>
		<title></title> 
		<script type="text/javascript" src="../Scripts/External/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="../Scripts/External/MicrosoftAjax.js"></script>
        <script type="text/javascript">
            $("head").append('<script type="text/javascript" src="../Scripts/no-cache.min.js?d=' + new Date().toISOString() + '">');
		    $("head").append('<script type="text/javascript" src="../Scripts/Default.min.js?v='+projectVersion+'">');
        </script>
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
				<div class="col-xs-12 col-md-7">
					<div class="title">loading...</div>
					<div class="short-overview">loading...</div>
				</div>
				<div class="col-xs-12 col-md-5">
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
			
            <div class="row">
				<div class="col-md-6 no-print">
					<input type="button" value="Back to SharePoint" id="backToSharePoint" />
				</div>
				<div class="col-md-6 text-right no-print footer-menu"></div>
			</div>
		</div>
        
	</body>
</html>