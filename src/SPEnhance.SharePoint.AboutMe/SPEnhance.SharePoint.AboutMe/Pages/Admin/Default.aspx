<%@ Page MasterPageFile="../../_catalogs/masterpage/ResumeBuilderAdmin.master" %>
<asp:Content ContentPlaceHolderID="PageContent" runat="server">
	<div ng-controller="ViewAdminController">
        <div>
            <p>Use Admin Panel to create the lists and manage the information.</p>
        </div>
		<div class="panel panel-default">
			<div class="panel-heading">Lists</div>
			<div class="panel-body">
				<span id="lists" ng-html-compile="lists">Loading...</span>
				<div class="row">
                    <div class="col-md-6">
					    <input type="button" id="createAllLists" value="Create All Lists" ng-click="createAllLists()" click-disable/>
					    <input type="button" id="deleteAllLists" value="Delete All Lists" ng-click="deleteAllLists()" click-disable/>
                    </div>
                    <div class="col-md-6 enableDisableConsoleLogButton">
                        <input type="button" id="enableConsoleLog" value="{{enableDisableConsoleLogButtonValue}}" ng-click="enableDisableConsoleLog()" click-disable/>
                    </div>
				</div>
			</div>
		</div>
	</div>
</asp:Content>        
