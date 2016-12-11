<%@ Page MasterPageFile="../../../_catalogs/masterpage/ResumeBuilderAdmin.master" %>
<asp:Content ContentPlaceHolderID="PageContent" runat="server">
	<div ng-controller="EditListDataController">
		<div class="panel panel-default">
			<div class="panel-heading" ng-bind="listName"></div>
			<div class="panel-body">
				<span id="listForm" ng-html-compile="listForm">Loading...</span>
				<p class="text-right">
					<input type="button" id="save" value="Save" ng-click="save()" click-disable/>
					<input type="button" id="cancel" value="Cancel" ng-click="cancel()" click-disable/>
				</p>
			</div>
		</div>
	</div>
</asp:Content>