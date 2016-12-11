<%@ Page MasterPageFile="../../../_catalogs/masterpage/ResumeBuilderAdmin.master" %>
<asp:Content ContentPlaceHolderID="PageContent" runat="server">
	<div ng-controller="ViewListDataController">
		<div class="panel panel-default">
			<div class="panel-heading" ng-bind="listName"></div>
			<div class="panel-body">
				<p class="text-right">
					<input type="button" id="new" value="New" ng-show="displayNewButton" ng-click="new()" click-disable/>
					<input type="button" id="deleteAllListData" value="Delete All" ng-show="displayDeleteAllButton" ng-click="deleteAll()" click-disable/>
				</p>
				<span id="listData" ng-html-compile="listData">Loading...</span>
			</div>
		</div>
	</div>
</asp:Content>