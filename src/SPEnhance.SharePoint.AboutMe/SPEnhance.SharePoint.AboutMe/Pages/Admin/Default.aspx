<!DOCTYPE html>
<html lang="en">
	<head>
   		<title></title> 
		<script type="text/javascript" src="../../Scripts/External/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="../../Scripts/External/MicrosoftAjax.js"></script>
        <script type="text/javascript">
            $("head").append('<script type="text/javascript" src="../../Scripts/no-cache.min.js?d=' + new Date().toISOString() + '">');
            $("head").append('<script type="text/javascript" src="../../Scripts/Admin/Default.min.js?v=' + projectVersion + '">');
        </script>
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
            <div>
                <p>Use Admin Panel to create the lists and manage the information.</p>
            </div>
			<div class="panel panel-default">
				<div class="panel-heading">Lists</div>
				<div class="panel-body">
					<span id="lists">Loading...</span>
					<p>
						<input type="button" id="createAllLists" value="Create All Lists"/>
						<input type="button" id="deleteAllLists" value="Delete All Lists"/>
					</p>
				</div>
			</div>
			
            <div class="row">
				<div class="col-md-6 no-print">
					<input type="button" value="Back to SharePoint" id="backToSharePoint" />
				</div>
				<div class="col-md-6 text-right no-print footer-menu-admin"></div>
			</div>
		</div>
        
	</body>
</html>