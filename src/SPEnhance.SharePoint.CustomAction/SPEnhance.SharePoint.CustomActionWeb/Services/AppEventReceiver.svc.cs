using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;

namespace SPEnhance.SharePoint.CustomActionWeb.Services
{
    public class AppEventReceiver : IRemoteEventService
    {
        string customActionTitle = "Print";
        /// <summary>
        /// Handles app events that occur after the app is installed or upgraded, or when app is being uninstalled.
        /// </summary>
        /// <param name="properties">Holds information about the app event.</param>
        /// <returns>Holds information returned from the app event.</returns>
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult status = new SPRemoteEventResult();
            switch (properties.EventType)
            {
                case SPRemoteEventType.AppInstalled:
                    RemovePrintCustomAction(properties);
                    AddPrintCustomAction(properties);
                    break;
                case SPRemoteEventType.AppUninstalling:
                    RemovePrintCustomAction(properties);
                    break;
            }

            return status;
        }
        
        private void RemovePrintCustomAction(SPRemoteEventProperties properties)
        {
            using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, false))
            {
                if (clientContext != null)
                {
                    try
                    {
                        clientContext.Load(clientContext.Site);
                        UserCustomActionCollection collUCA = clientContext.Site.UserCustomActions;

                        clientContext.Load(collUCA);
                        clientContext.ExecuteQuery();

                        bool found = false;
                        for (int i = 0; i < collUCA.Count; i++)
                        {
                            if (collUCA[i].Title == customActionTitle)
                            {
                                found = true;
                                collUCA[i].DeleteObject();
                            }
                        }

                        if (found)
                        {
                            clientContext.Site.RootWeb.Update();
                            clientContext.ExecuteQuery();
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new System.Net.WebException("Error when handling App Installed event.", ex);
                    }
                }
            }

        }

        private void AddPrintCustomAction(SPRemoteEventProperties properties)
        {
            using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, false))
            {
                if (clientContext != null)
                {
                    try
                    {
                        clientContext.Load(clientContext.Site);
                        UserCustomActionCollection collUCA = clientContext.Site.UserCustomActions;
                                                                                                  
                        clientContext.Load(collUCA);
                        clientContext.ExecuteQuery();

                        if (!IsCustomActionExist(collUCA))
                        {
                            UserCustomAction action = collUCA.Add();
                            action.Location = "CommandUI.Ribbon";
                            action.Sequence = 5;
                            action.Title = customActionTitle;

                            string commandAction = "(function() { "
                                + " var printWindow = window.open('', 'printWindow', ''); "
                                + " var printWindowDocument = printWindow.document; "
                                + " var tableToPrint; "
                                + " var titleOfPage = document.title; "
                                
                                + " var allElements = document.getElementsByClassName('ms-formtoolbar'); "
                                + " if(allElements && allElements.length > 0) "
                                + "     allElements[0].innerHTML = ''; " //hiding the created modified info
 
                                + " allElements = document.getElementsByClassName('ms-formtable'); "
                                + " if (allElements && allElements.length > 0) "
                                + "     tableToPrint = allElements[0].innerHTML; "
                                
                                + " printWindowDocument.write('<html><head><title>' + titleOfPage + '</title>'); "

                                + " printWindowDocument.write('<style>'); "
                                + " printWindowDocument.write('body {color: #444; font-family: Segoe UI, Segoe, Tahoma, Helvetica, Arial, sans-serif; font-size: 11px; }'); "
                                + " printWindowDocument.write('.ms-formlabel {white-space: nowrap; font-weight: normal; padding: 5px 5px 5px 0px; }'); "
                                + " printWindowDocument.write('.ms-standardheader {font-size: 1em; margin: 0px; text-align: left; font-weight: normal; padding: 5px 5px; }'); "
                                + " printWindowDocument.write('.ms-h3 {font-family: Segoe UI Semilight, Segoe UI, Segoe, Tahoma, Helvetica, Arial, sans-serif; color: #262626; }'); "
                                + " printWindowDocument.write('.ms-formbody {background: transparent; padding: 5px 5px; }'); "

                                + " printWindowDocument.write('.titleStyle{font-family: verdana; vertical-align: top;background: #ebf3ff;border-top: 1px solid #d8d8d8;padding: 3px 6px 4px 6px;}'); "
                                + " printWindowDocument.write('table{border-collapse:collapse;}'); "
                                + " printWindowDocument.write('table, td, th{border:1px solid #d8d8d8;}'); "
                                + " printWindowDocument.write('</style>'); "

                                + " printWindowDocument.write('</head><body>'); "

                                + " printWindowDocument.write('<div class=titleStyle>'); "
                                + " printWindowDocument.write(titleOfPage); "
                                + " printWindowDocument.write('</div><br/>'); "

                                + " printWindowDocument.write('<table>'); "
                                + " printWindowDocument.write(tableToPrint); "
                                + " printWindowDocument.write('</table>'); "

                                + " printWindowDocument.write('</body></html>'); "
                                + " printWindowDocument.close(); "

                                + " printWindow.focus(); "
                                + " printWindow.print(); "
                                + " printWindow.close(); "
                            + "})();";

                            commandAction = commandAction.Replace("<", "&lt;").Replace(">", "&gt;").Replace("&&", "&amp;&amp;");

                            action.CommandUIExtension = @"<CommandUIExtension><CommandUIDefinitions>"
                                   + "<CommandUIDefinition Location=\"Ribbon.ListForm.Display.Manage.Controls._children\">"
                                   + "<Button Id=\"InvokeAction.Button\" TemplateAlias=\"o1\" Command=\"Invoke_Command\" CommandType=\"General\" LabelText=\"" + customActionTitle + "\""
                                   + " Alt=\"" + customActionTitle + "\""
                                   + " ToolTipTitle = \"" + customActionTitle + "\""
                                   + " ToolTipDescription = \"Print list item\""
                                   + " Image32by32=\"https://spenhancecustomaction.azurewebsites.net/images/print32x32.png\""
                                   + " Image16by16=\"https://spenhancecustomaction.azurewebsites.net/images/print16x16.png\" />"
                                   + "</CommandUIDefinition>"
                                   + "</CommandUIDefinitions>"
                                   + "<CommandUIHandlers>"
                                   + "<CommandUIHandler Command =\"Invoke_Command\" CommandAction=\"javascript:" + commandAction + "\" />"
                                   + "</CommandUIHandlers></CommandUIExtension>";

                            action.Update();
                            clientContext.ExecuteQuery();
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new System.Net.WebException("Error when handling App Installed event.", ex);
                    }
                }
            }
        }

        private bool IsCustomActionExist(UserCustomActionCollection collUCA)
        {
            for (int i = 0; i < collUCA.Count; i++)
            {
                if (collUCA[i].Title == customActionTitle)
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// This method is a required placeholder, but is not used by app events.
        /// </summary>
        /// <param name="properties">Unused.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            throw new NotImplementedException();
        }

    }
}
