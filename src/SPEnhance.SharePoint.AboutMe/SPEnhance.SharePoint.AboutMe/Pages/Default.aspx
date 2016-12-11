<%@ Page MasterPageFile="../_catalogs/masterpage/ResumeBuilder.master" %>
<asp:Content ContentPlaceHolderID="PageContent" runat="server">
    <progress-bar id="progressBar" ng-init="progressBarValueNow = 0" ng-show="progressBarValueNow > 0" ng-hide="progressBarValueNow == 100" class="no-print"></progress-bar>
	<div ng-controller="ViewResumeController">
		<div class="row">
			<div class="col-md-7">
				<div class="title" ng-bind="title">loading...</div>
				<div class="short-overview" ng-html-compile="shortOverview">loading...</div>
			</div>
			<div class="col-md-5">
				<div class="address">
					<span class="glyphicon glyphicon-home" aria-hidden="true"></span> <span id="address" ng-html-compile="address">Loading...</span>
					<br/><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> <span id="email" ng-html-compile="email">Loading...</span>
					<br/><span class="glyphicon glyphicon-phone" aria-hidden="true"></span> <span id="phone" ng-html-compile="phone">Loading...</span>
				</div>
			</div>
		</div>
		<hr/>
		<p class="long-overview" ng-html-compile="longOverview">
			loading...
		</p>

		<div class="row">
			<div class="col-md-6">
				<div class="panel panel-default">
					<div class="panel-heading">Skills</div>
					<table id="skill" class="table table-bordered skill-table" ng-html-compile="skill">
						<tr><td>loading...</td></tr>
					</table>
				</div>
			</div>
			<div class="col-md-6">
				<div class="panel panel-default">
					<div class="panel-heading">Certifications</div>
					<table id="certification" class="table table-bordered skill-table" ng-html-compile="certification">
						<tr><td>loading...</td></tr>
					</table>
				</div>
			</div>
		</div>
			
		<div class="row">
			<div class="col-md-6">
				<div class="panel panel-default">
					<div class="panel-heading">Work Experience</div>
					<table id="experience" class="table table-bordered skill-table" ng-html-compile="experience">
						<tr><td>loading...</td></tr>
					</table>
				</div>
			</div>
			<div class="col-md-6">
				<div class="panel panel-default">
					<div class="panel-heading">Education</div>
					<table id="education" class="table table-bordered skill-table" ng-html-compile="education">
						<tr><td>loading...</td></tr>
					</table>
				</div>
			</div>
		</div>
			
		<div class="panel panel-default">
			<div class="panel-heading">Projects</div>
			<div id="project" class="panel-body" ng-html-compile="project">Loading...</div>
		</div>
	</div>
</asp:Content>
