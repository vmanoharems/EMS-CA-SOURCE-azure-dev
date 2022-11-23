using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Net.Mail;
using EMS.Entity;
using EMS.Business;
using System.Web;
using SendGrid;
using System.Text;
using Newtonsoft;

//using SendGrid;

using EMS.Controllers;
using iTextSharp.text.pdf;
using iTextSharp.text;
using System.IO;
using Newtonsoft.Json;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/ReportEngine")]
    public class ReportEngineController : ApiController
    {
        //Legacy Support
        AccountPayableBusiness BusinessContext = new AccountPayableBusiness();
        ReportP1Business ReportContext = new ReportP1Business();
        public static string MakeJSONExport(dynamic strResult)
        {
            string combindedString = JsonConvert.SerializeObject(strResult);

            string json = "{\"exportdata\":"
                + combindedString
                + ",\"GUID\":\"" + Guid.NewGuid().ToString() + "\""
                + "}";
            string jsonReturn = json; // JsonConvert.SerializeObject(json);
            return jsonReturn.ToString();

        }
        public static string MakeMemoCodesHTML(string[] TransCodeList, string strTransString, string strDOMStyle = "padding: 5px; font-size: 11px;")
        {
            // TransCodeList = array of the transaction codes for the production
            // strTransString = string value of the transactions transaction codes
            // strDOMStyle = specific markup style for the HTML to return

            string strReturn = "";
            Boolean notfound = true;

            for (int iTC = 0; iTC < TransCodeList.Length; iTC++)
            {
                notfound = true;
                if (strTransString == "")
                {
                    strReturn += ("<td style='" + strDOMStyle + "'></td>"); // Add blank cells
                }
                else
                {
                    string[] strTransString1 = strTransString.Split(',');
                    for (int iTS = 0; iTS < strTransString1.Length; iTS++)
                    {
                        string[] newTransValu = strTransString1[iTS].Split(':');
                        if (newTransValu[0] == TransCodeList[iTC])
                        {
                            strReturn += ("<td style='" + strDOMStyle + "'>" + newTransValu[1] + "</td>");
                            notfound = false;
                            break;
                        }
                    }
                }

                if (notfound && strTransString != "")
                {
                    strReturn += ("<td style='" + strDOMStyle + "'></td>"); // Add blank cells
                }
            }

            return strReturn;
        }

    }
    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/ReportAPI")]
    // [RoutePrefix("api/AccountPayableOp")]
    public class ReportAPIController : ApiController
    {
        AccountPayableBusiness BusinessContext = new AccountPayableBusiness();
        ReportP1Business ReportContext = new ReportP1Business();
        CompanySettingsBusiness CompanyContext = new CompanySettingsBusiness();
        AdminToolsBusiness AdminContext = new AdminToolsBusiness();
        //AccountPayableBusiness BusinessContext = new AccountPayableBusiness();
        //private const string LocalLoginProvider = "Local";

        protected CustomPrincipal CurrentUser
        { get { return HttpContext.Current.User as CustomPrincipal; } }
        protected int Execute(string APITOKEN = null)
        {
            try
            {
                if (this.CurrentUser == null)
                    return -1;//"Authorization Failed!";
                if (this.CurrentUser.Identity != null || APITOKEN != null)//this.CurrentUser.IsInRole("Admin") ||
                    return 0;//"Success"
                else
                    return 1;//"ClientID is not valid!";
            }
            catch { return 99; }
        }


        [Route("APAuditByTransaction")]
        [HttpPost]
        public string APAuditByTransaction(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    ReportInvoiceDetail AP = JsonConvert.DeserializeObject<ReportInvoiceDetail>(Convert.ToString(Payload["Invoice"]));

                    var srtRD = AP.objRD;
                    string strReportType = (Payload["Status"] == "audit") ? "Accounts Payable Audit by Transaction" : "Accounts Payable Posted by Transaction";

                    var result = BusinessContext.ReportsInvoiceTransactionJSON(callParameters);
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        return ReportEngineController.MakeJSONExport(result);
                    }
                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintDate = Payload["ReportDate"];//BusinessContextR.UserSpecificTime(Convert.ToInt32(AP.objRDF.ProdId));
                    var CompanyName = BusinessContext.GetCompanyNameByID(1);

                    StringBuilder ojbSB = new StringBuilder();

                    var StrCount = result.Count;

                    decimal TotalAmountSum = 0;
                    int ColumnLength = 6;

                    if (StrCount > 0)
                    {
                        var OptSegment = srtRD.SegmentOptional.Split(',');
                        ColumnLength = ColumnLength + OptSegment.Length;

                        string TransactionCode = srtRD.TransCode;
                        string[] TransCode11 = TransactionCode.Split(',');
                        ColumnLength = ColumnLength + TransCode11.Length;

                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title>" + strReportType + "</title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table style='width: 10.5in; float: left; repeat-header: yes; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "'>");

                        #region ReportHeader
                        // Begin Report Header
                        bool AuditORPosted = (Payload.Status.ToString() == "audit");
                        string TransactionNumberFromTo = (Payload.fieldsetTransactionIDs.TransFrom.ToString() + Payload.fieldsetTransactionIDs.TransTo.ToString() == "") ? "ALL" : Payload.fieldsetTransactionIDs.TransFrom.ToString() + " to " + Payload.fieldsetTransactionIDs.TransTo.ToString();
                        ojbSB.Append("<table style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Company : " + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_CO)) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + Payload["ProductionName"] + " </th>");
                        ojbSB.Append($"<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Transaction No. : {TransactionNumberFromTo}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Location : " + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO)) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + CompanyName[0].CompanyName + " </th>");
                        if (AuditORPosted)
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: right;'>Period Status : " + Payload.fieldsetPeriod.PeriodStatus.ToString() + "</td>");
                        else
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: right;'>Period : " + ((Payload.fieldsetPeriod.PeriodFrom.ToString() + Payload.fieldsetPeriod.PeriodTo.ToString()) == "" ? "ALL" : Payload.fieldsetPeriod.PeriodFrom.ToString() + " to " + Payload.fieldsetPeriod.PeriodTo.ToString()) + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        string aa = Convert.ToString(Payload["Invoice"]["objRD"]["Segment"]);
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Episode(s)  : " + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)) + "</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>" + strReportType + "</th>");
                        }
                        else
                        {
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>" + strReportType + "</th>");
                        }

                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Account(s) : "
                            + ((Payload.fieldsetSegments.fieldsetSegments_DTFrom.ToString() + Payload.fieldsetSegments.fieldsetSegments_DTTo.ToString() == "")
                            ? "ALL"
                            : Payload.fieldsetSegments.fieldsetSegments_DTFrom.ToString() + " to " + Payload.fieldsetSegments.fieldsetSegments_DTTo.ToString())
                            + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp; </th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Date : "
                            + ((Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateFrom" : "PostedDateFrom")].ToString() + Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateTo" : "PostedDateTo")].ToString() == "")
                            ? "ALL"
                            : Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateFrom" : "PostedDateFrom")].ToString() + " to " + Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateTo" : "PostedDateTo")].ToString())
                            + "</td>");
                        ojbSB.Append("</tr>");

                        string fieldsetSegments_Set = String.Join(",", Payload.fieldsetSegments.fieldsetSegments_Set ?? "");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Set(s) : "
                            + ((fieldsetSegments_Set == "")
                            ? "ALL"
                            : fieldsetSegments_Set)
                            + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp; </th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank : " + ((Payload["APIBank"]).ToString() == "" ? "ALL" : (Payload["APIBank"]).ToString()) + "</td>");

                        ojbSB.Append("</tr>");


                        string CurrencyFilter = (Payload.fieldsetCurrency.CurrencyFilter.ToString() == "") ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                        string CurrencyReport = Payload.fieldsetCurrency.CurrencyReport.ToString();
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Batch : " + (Payload["BatchNumber"].ToString() == "" ? "ALL" : String.Join(",", Payload["BatchNumber"])) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp; </th>");
                        ojbSB.Append($"<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Currency Filter : {CurrencyFilter}</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor : " + ((Payload.VendorFrom.ToString() + Payload.VendorTo.ToString()) == "" ? "ALL" : (Payload.VendorFrom.ToString() + " to " + Payload.VendorTo.ToString())) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append($"<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Report Currency : {CurrencyReport}</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Tax Code : "
                            + ((Payload.TaxCode.ToString() == "")
                            ? "ALL"
                            : Payload.TaxCode.ToString())
                            + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Report Date : " + PrintDate + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        // End Report Header
                        #endregion ReportHeader

                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        //  ojbSB.Append("<tr style='background-color: #DFE4F7;'>"); Changing Background Color
                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Batch</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>LO</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Detail</th>");

                        int OptLen = 0;
                        var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                        OptLen = strOptionalSegment.Length;
                        for (int z = 0; z < strOptionalSegment.Length; z++)
                        {
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strOptionalSegment[z] + "</th>");
                        }

                        int TLen = 0;
                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        TLen = TransCode1.Length;

                        for (int z = 0; z < TransCode1.Length; z++)
                        {
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + TransCode1[z] + "</th>");
                        }

                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>1099</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Line Item Description</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Amount</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        ojbSB.Append("<tbody>");


                        string OldTransactionNo = "";
                        string NewTransactionNo = "";


                        for (int J = 0; J < result.Count; J++)
                        {
                            NewTransactionNo = result[J].TransactionNumber;
                            if (OldTransactionNo == "")
                            {

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='font-weight: bold !important; font-size: 10px; text-align: left;  border-top-width: 1px; border-top: 1px solid white; background-color: #FFFAE3;'>Transaction # </th>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  border-top-width: 1px; border-top: 1px solid white; background-color: #FFFAE3;'>" + result[J].TransactionNumber + "</th>");

                                if (OptLen == 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  border-top-width: 1px; border-top: 1px solid white; background-color: #FFFAE3;'>Period : " + result[J].ClosePeriod + "</th>");
                                }
                                else if (OptLen == 1)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important; border-top-width: 1px; border-top: 1px solid white;  background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  border-top-width: 1px; border-top: 1px solid white; background-color: #FFFAE3;'>Period : " + result[J].ClosePeriod + "</th>");
                                }
                                else if (OptLen == 2)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important; border-top-width: 1px; border-top: 1px solid white;  background-color: #FFFAE3;'></th>");

                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  border-top-width: 1px; border-top: 1px solid white; background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; border-top-width: 1px; border-top: 1px solid white;  background-color: #FFFAE3;'>Period : " + result[J].ClosePeriod + "</th>");
                                }

                                if (TLen > 0)
                                {
                                    for (int d = 0; d < TLen; d++)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  border-top-width: 1px; border-top: 1px solid white; background-color: #FFFAE3;'></th>");
                                    }
                                }

                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;' border-top-width: 1px; border-top: 1px solid white; colspan='3'><b>Invoice Number : </b>" + result[J].InvoiceNumber + "</th>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;background-color: #FFFAE3;'>Vendor</th>");



                                if (OptLen == 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].VendorName + "</th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important; background-color: #FFFAE3;'>Payment #: " + result[J].PaymentID + "</th>");
                                }
                                else if (OptLen == 1)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].VendorName + "</th>");

                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>Payment #: " + result[J].PaymentID + "</th>");
                                }
                                else if (OptLen == 2)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important;background-color: #FFFAE3;'>" + result[J].VendorName + "</th>");


                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>Payment #: " + result[J].PaymentID + "</th>");
                                }


                                if (TLen > 0)
                                {
                                    for (int d = 0; d < TLen; d++)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'></th>");
                                    }
                                }

                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;' colspan='3'><b>Invoice Date : </b>" + result[J].InvoiceDate + "</th>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left; background-color: #FFFAE3;'>Ref. Vendor</th>");



                                if (OptLen == 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>" + result[J].ReferenceVendor + "</th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;background-color: #FFFAE3;'>Payment Date : " + result[J].PaymentDate + "</th>");
                                }
                                else if (OptLen == 1)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>" + result[J].ReferenceVendor + "</th>");

                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>Payment Date: " + result[J].PaymentDate + "</th>");
                                }
                                else if (OptLen == 2)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].ReferenceVendor + "</th>");


                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Payment Date: " + result[J].PaymentDate + "</th>");
                                }


                                if (TLen > 0)
                                {
                                    for (int d = 0; d < TLen; d++)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    }
                                }


                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;' colspan='3'><b>Invoice Description : </b>" + result[J].Description + "</th>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Print on Check</th>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].PrintOncheckAS + "</th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: right;  background-color: #FFFAE3;' colspan='" + (ColumnLength - 3) + "'>Invoice Amount</th>");

                                if (Convert.ToDecimal(result[J].OriginalAmount) >= 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'>$" + Convert.ToDecimal(result[J].OriginalAmount).ToString("#,##0.00") + "</th>");
                                }
                                else
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'>-$" + (Convert.ToDecimal(result[J].OriginalAmount) * -1).ToString("#,##0.00") + "</th>");
                                }


                                ojbSB.Append("</tr>");

                                OldTransactionNo = result[J].TransactionNumber;
                                TotalAmountSum += Convert.ToDecimal(result[J].OriginalAmount);

                            }

                            else if (OldTransactionNo != NewTransactionNo)
                            {

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;' colspan='" + (ColumnLength - 2) + "'></th>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;'><b>Invoice Total</b></th>");


                                if (Convert.ToDecimal(result[J - 1].OriginalAmount) >= 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;'><b>$" + Convert.ToDecimal(result[J - 1].OriginalAmount).ToString("#,##0.00") + "</b></th>");
                                }
                                else
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;'><b>-$" + (Convert.ToDecimal(result[J - 1].OriginalAmount) * -1).ToString("#,##0.00") + "</b></th>");
                                }

                                ojbSB.Append("</tr>");

                                NewTransactionNo = result[J].TransactionNumber;
                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Transaction # </th>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].TransactionNumber + "</th>");

                                if (OptLen == 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'>Period : " + result[J].ClosePeriod + "</th>");
                                }
                                else if (OptLen == 1)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Period : " + result[J].ClosePeriod + "</th>");
                                }
                                else if (OptLen == 2)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'></th>");

                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Period : " + result[J].ClosePeriod + "</th>");
                                }

                                if (TLen > 0)
                                {
                                    for (int d = 0; d < TLen; d++)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    }
                                }

                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;' colspan='3'><b>Invoice Number : </b>" + result[J].InvoiceNumber + "</th>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Vendor</th>");

                                //  ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].VendorName + "</th>");


                                if (OptLen == 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].VendorName + "</th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'>Payment #: " + result[J].PaymentID + "</th>");
                                }
                                else if (OptLen == 1)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].VendorName + "</th>");

                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Payment #: " + result[J].PaymentID + "</th>");
                                }
                                else if (OptLen == 2)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].VendorName + "</th>");


                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Payment #: " + result[J].PaymentID + "</th>");
                                }


                                if (TLen > 0)
                                {
                                    for (int d = 0; d < TLen; d++)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    }
                                }

                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;' colspan='3'><b>Invoice Date : </b>" + result[J].InvoiceDate + "</th>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Ref. Vendor</th>");



                                if (OptLen == 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].ReferenceVendor + "</th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'>Payment Date : " + result[J].PaymentDate + "</th>");
                                }
                                else if (OptLen == 1)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].ReferenceVendor + "</th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Payment Date: " + result[J].PaymentDate + "</th>");
                                }
                                else if (OptLen == 2)
                                {
                                    ojbSB.Append("<th colspan='2' style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].ReferenceVendor + "</th>");

                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Payment Date: " + result[J].PaymentDate + "</th>");
                                }


                                if (TLen > 0)
                                {
                                    for (int d = 0; d < TLen; d++)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'></th>");
                                    }
                                }


                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;' colspan='3'><b>Invoice Description : </b>" + result[J].Description + "</th>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Print on Check</th>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + result[J].PrintOncheckAS + "</th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: right;  background-color: #FFFAE3;' colspan='" + (ColumnLength - 3) + "'>Invoice Amount</th>");

                                if (Convert.ToDecimal(result[J].OriginalAmount) >= 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'>$" + Convert.ToDecimal(result[J].OriginalAmount).ToString("#,##0.00") + "</th>");
                                }
                                else
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold !important;  background-color: #FFFAE3;'>-$" + (Convert.ToDecimal(result[J].OriginalAmount) * -1).ToString("#,##0.00") + "</th>");
                                }

                                ojbSB.Append("</tr>");
                                OldTransactionNo = result[J].TransactionNumber;
                                TotalAmountSum += Convert.ToDecimal(result[J].OriginalAmount);
                            }

                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].BatchNumber + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].Location + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-top-width: 1px; border-top: 1px solid white; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].AccountCode + "</th>");

                            var strSegmentOptioanl = srtRD.SegmentOptional;
                            var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                            for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                            {
                                if (k == 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].SetCode + "</th>");
                                }
                                if (k == 1)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-top-width: 1px; border-top: 1px solid white; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].SeriesCode + "</th>");
                                }
                            }

                            string strTransString = result[J].TransStr;
                            string[] strTransString1 = strTransString.Split(',');
                            int strTrvalCount = strTransString1.Length;

                            if (strTransString == "")
                            {
                                for (int z = 0; z < TransCode1.Length; z++)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                                }
                            }
                            else
                            {
                                Boolean matchTransString = false;
                                for (int z = 0; z < TransCode1.Length; z++)
                                {
                                    matchTransString = false;
                                    foreach (String TransStringItem in strTransString1)
                                    {
                                        string[] newTransValu = TransStringItem.Split(':');
                                        if (newTransValu[0] == TransCode1[z])
                                        {
                                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + newTransValu[1] + "</th>");
                                            matchTransString = true;
                                            break;
                                        }
                                    }
                                    if (!matchTransString)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                                    }
                                }
                            }

                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].TaxCode + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-top-width: 1px; border-top: 1px solid white; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].LineDescription + "</th>");

                            if (Convert.ToDecimal(result[J].Amount) >= 0)
                            {
                                ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid white;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(result[J].Amount).ToString("#,##0.00") + "</th>");
                            }
                            else
                            {
                                ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-top-width: 1px; border-top: 1px solid white; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>-$" + (Convert.ToDecimal(result[J].Amount) * -1).ToString("#,##0.00") + "</th>");
                            }

                            ojbSB.Append("</tr>");

                        }


                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='" + (ColumnLength - 2) + "'></th>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>Invoice Total</b></th>");

                        if (Convert.ToDecimal(result[result.Count - 1].OriginalAmount) >= 0)
                        {
                            ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + Convert.ToDecimal(result[result.Count - 1].OriginalAmount).ToString("#,##0.00") + "</b></th>");
                        }
                        else
                        {
                            ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>-$" + (Convert.ToDecimal(result[result.Count - 1].OriginalAmount)).ToString("#,##0.00") + "</b></th>");
                        }
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='" + ColumnLength + "'>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;' colspan='" + (ColumnLength - 3) + "'></th>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold;' colspan='2'>Report Total :</th>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold;'>$" + Convert.ToDecimal(TotalAmountSum).ToString("#,##0.00") + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table></body></html>");

                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                    else
                    {
                        return "";
                    }
                }

                catch (Exception ex)
                {
                    return "Exception:" + ex.Message;
                }
            }
            else
            {
                return "";
            }
        }



        [Route("APAuditByAccount")]
        [HttpPost]
        public string APAuditByAccount(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    ReportInvoiceDetail AP = JsonConvert.DeserializeObject<ReportInvoiceDetail>(Convert.ToString(Payload["Invoice"]));

                    var srtRD = AP.objRD;
                    //var strRDF = AP.objRDF;
                    string strReportType = Payload["Status"] == "audit" ? "Accounts Payable Audit by Account" : "Accounts Payable Posted by Account";

                    var result = BusinessContext.ReportsInvoiceAccountJSON(callParameters);
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        return ReportEngineController.MakeJSONExport(result);
                    }
                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintDate = Payload.ReportDate.ToString();

                    StringBuilder ojbSB = new StringBuilder();
                    //string CId = (string.Join(",", Payload.InvoiceFilterCompany) == "" ? "ALL" : string.Join(",", Payload.InvoiceFilterCompany));
                    var CompanyName = BusinessContext.GetCompanyNameByID(1);

                    var StrCount = result.Count;
                    decimal TotalAmountSum = 0;
                    int ColumnLength = 11; //13
                    decimal AccountTotalAmt = 0;

                    if (StrCount > 0)
                    {
                        string strSegment = srtRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');

                        ColumnLength += Convert.ToInt32(strSegment1.Length);

                        if (srtRD.SegmentOptional != "")
                        {
                            var OptSegment = srtRD.SegmentOptional.Split(',');
                            ColumnLength = ColumnLength + OptSegment.Length;
                        }
                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        if (srtRD.TransCode != "")
                        {
                            ColumnLength = ColumnLength + TransCode1.Length;
                        }
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title id='REPORTCSS'>" + strReportType + "</title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table style='width: 10.5in; float: left; repeat-header: yes; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "'>");

                        #region ReportHeader
                        // Begin Report Header
                        bool AuditORPosted = (Payload.Status.ToString() == "audit");
                        string TransactionNumberFromTo = (Payload.fieldsetTransactionIDs.TransFrom.ToString() + Payload.fieldsetTransactionIDs.TransTo.ToString() == "") ? "ALL" : Payload.fieldsetTransactionIDs.TransFrom.ToString() + " to " + Payload.fieldsetTransactionIDs.TransTo.ToString();
                        ojbSB.Append("<table style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Company : " + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_CO)) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + Payload["ProductionName"] + " </th>");
                        ojbSB.Append($"<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Transaction No. : {TransactionNumberFromTo}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Location : " + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO)) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + CompanyName[0].CompanyName + " </th>");
                        if (AuditORPosted)
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: right;'>Period Status : " + Payload.fieldsetPeriod.PeriodStatus.ToString() + "</td>");
                        else
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: right;'>Period : " + ((Payload.fieldsetPeriod.PeriodFrom.ToString() + Payload.fieldsetPeriod.PeriodTo.ToString()) == "" ? "ALL" : Payload.fieldsetPeriod.PeriodFrom.ToString() + " to " + Payload.fieldsetPeriod.PeriodTo.ToString()) + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        string aa = Convert.ToString(Payload["Invoice"]["objRD"]["Segment"]);
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Episode(s)  : " + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)) + "</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>" + strReportType + "</th>");
                        }
                        else
                        {
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>" + strReportType + "</th>");
                        }

                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Account(s) : "
                            + ((Payload.fieldsetSegments.fieldsetSegments_DTFrom.ToString() + Payload.fieldsetSegments.fieldsetSegments_DTTo.ToString() == "")
                            ? "ALL"
                            : Payload.fieldsetSegments.fieldsetSegments_DTFrom.ToString() + " to " + Payload.fieldsetSegments.fieldsetSegments_DTTo.ToString())
                            + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp; </th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Date : "
                            + ((Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateFrom" : "PostedDateFrom")].ToString() + Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateTo" : "PostedDateTo")].ToString() == "")
                            ? "ALL"
                            : Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateFrom" : "PostedDateFrom")].ToString() + " to " + Payload.fieldsetPeriod[((AuditORPosted) ? "DocumentDateTo" : "PostedDateTo")].ToString())
                            + "</td>");
                        ojbSB.Append("</tr>");

                        string fieldsetSegments_Set = String.Join(",", Payload.fieldsetSegments.fieldsetSegments_Set ?? "");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Set(s) : "
                            + ((fieldsetSegments_Set == "")
                            ? "ALL"
                            : fieldsetSegments_Set)
                            + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp; </th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank : " + ((Payload["APIBank"]).ToString() == "" ? "ALL" : (Payload["APIBank"]).ToString()) + "</td>");

                        ojbSB.Append("</tr>");


                        string CurrencyFilter = (Payload.fieldsetCurrency.CurrencyFilter.ToString() == "") ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                        string CurrencyReport = Payload.fieldsetCurrency.CurrencyReport.ToString();
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Batch : " + (Payload["BatchNumber"].ToString() == "" ? "ALL" : String.Join(",", Payload["BatchNumber"])) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp; </th>");
                        ojbSB.Append($"<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Currency Filter : {CurrencyFilter}</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor : " + ((Payload.VendorFrom.ToString() + Payload.VendorTo.ToString()) == "" ? "ALL" : (Payload.VendorFrom.ToString() + " to " + Payload.VendorTo.ToString())) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append($"<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Report Currency : {CurrencyReport}</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Tax Code : "
                            + ((Payload.TaxCode.ToString() == "")
                            ? "ALL"
                            : Payload.TaxCode.ToString())
                            + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Report Date : " + PrintDate + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        // End Report Header
                        #endregion ReportHeader

                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");

                        #region SegmentOrder
                        int strDetailPosition = 0;
                        bool isSegmentOrder = false;
                        if (srtRD.SegmentOrder != null)
                        {
                            strSegment = srtRD.SegmentOrder;
                            isSegmentOrder = true;
                            strSegment1 = strSegment.Split(',');
                        }
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');


                        string ColWidthSegment = "18";
                        for (int a = 0; a < strSegment1.Length; a++)
                        {
                            if (strSegment1[a].ToString() == "DT") ColWidthSegment = "33";
                            ojbSB.Append("<th nowrap width='" + ColWidthSegment + "' class='data-th' style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strSegment1[a].ToString() + " </th>");
                        }
                        #endregion SegmentOrder

                        //ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Detail</th>");
                        //ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>LO</th>");

                        int OptLen = 0;
                        if (srtRD.SegmentOptional != "")
                        {
                            var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                            OptLen = strOptionalSegment.Length;
                            for (int z = 0; z < strOptionalSegment.Length; z++)
                            {
                                ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strOptionalSegment[z] + "</th>");
                            }
                        }

                        int TLen = 0;
                        //string TransCode = srtRD.TransCode;
                        //string[] TransCode1 = TransCode.Split(',');
                        if (TransCode != "")
                        {
                            TLen = TransCode1.Length;
                            for (int z = 0; z < TransCode1.Length; z++)
                            {
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + TransCode1[z] + "</th>");
                            }
                        }

                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>1099</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Line Item Description</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Vendor Name</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Trans#</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Per.#</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Batch#</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Payment#</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Invoice#</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Invoice Date</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Invoice Description</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Amount</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        ojbSB.Append("<tbody>");

                        string OldAccountNo = "";
                        string NewAccountNo = "";

                        for (int J = 0; J < result.Count; J++)
                        {
                            NewAccountNo = result[J].AccountCode;
                            if (OldAccountNo == "")
                            {
                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th colspan='" + ColumnLength + "' style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>" + result[J].AccountCode + " " + result[J].AccountName + "</th>");
                                ojbSB.Append("</tr>");
                                OldAccountNo = result[J].AccountCode;
                                // TotalAmountSum += Convert.ToDecimal(result[J].OriginalAmount);
                            }

                            else if (OldAccountNo != NewAccountNo)
                            {
                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;' colspan='" + (ColumnLength - 2) + "'></th>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;'><b>Total for Account</b></th>");

                                if (AccountTotalAmt >= 0)
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;'><b>$" + Convert.ToDecimal(AccountTotalAmt).ToString("#,##0.00") + "</b></th>");
                                }
                                else
                                {
                                    ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid white;'><b>-$" + Convert.ToDecimal(AccountTotalAmt).ToString("#,##0.00") + "</b></th>");
                                }


                                ojbSB.Append("</tr>");

                                AccountTotalAmt = 0;

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th colspan='" + ColumnLength + "' style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>" + result[J].AccountCode + " " + result[J].AccountName + "</th>");
                                ojbSB.Append("</tr>");

                                OldAccountNo = result[J].AccountCode;
                            }
                            AccountTotalAmt += Convert.ToDecimal(result[J].Amount);
                            TotalAmountSum += Convert.ToDecimal(result[J].Amount);
                            ojbSB.Append("<tr>");

                            Newtonsoft.Json.Linq.JObject SegmentJSON = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject<dynamic>(result[J].Segments)[0];
                            if (isSegmentOrder)
                            {
                                foreach (var Seg in SegmentJSON)
                                {
                                    string thekey = Seg.Key;
                                    string thevalue = (string)Seg.Value;
                                    if (thekey.ToUpper() == "DT")
                                    {
                                        thevalue = thevalue.Substring(thevalue.LastIndexOf(">") + 1);
                                    }
                                    ojbSB.Append("<td style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + thevalue + "</td>");
                                }
                            }
                            else
                            {
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].AccountCode + "</th>");
                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].Location + "</th>");
                            }

                            var strSegmentOptioanl = srtRD.SegmentOptional;
                            if (strSegmentOptioanl != "")
                            {
                                var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                                for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                                {
                                    if (k == 0)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].SetCode + "</th>");
                                    }
                                    if (k == 1)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].SeriesCode + "</th>");
                                    }
                                }
                            }

                            if (srtRD.TransCode != "")
                            {
                                string strTransString = result[J].TransStr;
                                string[] strTransString1 = strTransString.Split(',');
                                int strTrvalCount = strTransString1.Length;

                                if (strTransString == "")
                                {
                                    for (int z = 0; z < TransCode1.Length; z++)
                                    {
                                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                                    }
                                }
                                else
                                {
                                    Boolean matchTransString = false;
                                    for (int z = 0; z < TransCode1.Length; z++)
                                    {
                                        matchTransString = false;
                                        foreach (String TransStringItem in strTransString1)
                                        {
                                            string[] newTransValu = TransStringItem.Split(':');
                                            if (newTransValu[0] == TransCode1[z])
                                            {
                                                ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + newTransValu[1] + "</th>");
                                                matchTransString = true;
                                                break;
                                            }
                                        }
                                        if (!matchTransString)
                                        {
                                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                                        }
                                    }
                                }
                            }

                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].TaxCode + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].LineDescription + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].VendorName + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].TransactionNumber + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].ClosePeriod + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].BatchNumber + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].PaymentID + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].InvoiceNumber + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].InvoiceDate + "</th>");
                            ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + result[J].LineDescription + "</th>");

                            if (Convert.ToDecimal(result[J].Amount) >= 0)
                            {
                                ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(result[J].Amount).ToString("#,##0.00") + "</th>");
                            }
                            else
                            {
                                ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>-$" + (Convert.ToDecimal(result[J].Amount)).ToString("#,##0.00") + "</th>");
                            }

                            ojbSB.Append("</tr>");

                        }

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='" + (ColumnLength - 2) + "'></th>"); //123456
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>Total for Account</b></th>");

                        ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + (Convert.ToDecimal(AccountTotalAmt).ToString("#,##0.00")) + "</b></th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='" + ColumnLength + "'>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: normal;' colspan='" + (ColumnLength - 3) + "'></th>");
                        ojbSB.Append("<th style='font-size: 10px; text-align: left; font-weight: bold;' colspan='2'>Report Total :</th>");


                        if (TotalAmountSum >= 0)
                        {
                            ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold;'>$" + Convert.ToDecimal(TotalAmountSum).ToString("#,##0.00") + "</th>");
                        }
                        else
                        {
                            ojbSB.Append("<th style='font-size: 10px; text-align: right; font-weight: bold;'>-$" + Convert.ToDecimal(TotalAmountSum * -1).ToString("#,##0.00") + "</th>");
                        }

                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table></body></html>");
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                    else
                    {
                        return "";
                    }
                }

                catch (Exception ex)
                {
                    return "Exception:" + ex.Message;
                }
            }
            else
            {
                return "";
            }
        }



        //======================== JE Audit Report =====================//        
        [Route("JEAuditReportFilter")]
        [HttpPost]
        public string JEAuditReportFilter(JSONParameters callParameters)
        {
            //List<string> fileNames = new List<string>();
            //StringBuilder objSBPath = new StringBuilder();
            try
            {
                if (this.Execute(this.CurrentUser.APITOKEN) == 0)
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    ReportJEAuditDetail TT = JsonConvert.DeserializeObject<ReportJEAuditDetail>(Convert.ToString(Payload["ReportConfig"]));
                    var srtRD = TT.objRD;
                    var strRDF = TT.objRDF;
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        return ReportEngineController.MakeJSONExport(BusinessContext.ReportsLedgerJEAuditJSON(callParameters));
                    }
                    var strResult = BusinessContext.ReportsLedgerJEAuditJSON(callParameters);

                    if (strResult.Count == 0)
                    {
                        return "";
                    }
                    else
                    {
                        string Sort = Payload["JESort"];
                        //PDFCreation BusinessContext1 = new PDFCreation();
                        ReportP1Business BusinessContextR = new ReportP1Business();
                        string Pritingtdate = Payload["ReportDate"]; //BusinessContextR.UserSpecificTime(Convert.ToInt32(TT.objRDF.ProdId));
                        var CompanyName = BusinessContext.GetCompanyNameByID(1);

                        string StrReportName = Payload.ReportTitle.ToString();
                        //if (Payload["JESort"] == "ACCOUNT")
                        //{
                        //    StrReportName = (strRDF.Status == "Saved" ? "Journal Entry Audit by Account" : "Journal Entry Posted by Account");
                        //}
                        //else
                        //{
                        //    StrReportName = (strRDF.Status == "Saved" ? "Journal Entry Audit by Transaction" : "Journal Entry Posted by Transaction");
                        //}

                        string stest = "";
                        StringBuilder strDLHeader = new StringBuilder();
                        StringBuilder ojbSB = new StringBuilder();
                        int strTdCount = 0;
                        int StrheaderCount = 3; // We'll baseline with 2 because of 1099, Description, Amount
                        int strDetailPosition = 0;
                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');


                        ojbSB.Append("<html><head><title>" + StrReportName + "</title></head>\r\n");
                        ojbSB.Append("<body>\r\n");
                        ojbSB.Append("<table style=\"repeat-header: yes; width: 10.5in;border-spacing:0px;\">\r\n");

                        #region reportHeader

                        if (Payload["JESort"] == "ACCOUNT")
                        {
                            #region detailsHeader Account
                            //  ojbSB.Append("<thead>");


                            ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                            ojbSB.Append("<th style='width:30px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Detail</th>");
                            ojbSB.Append("<th style='width:15px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>LO</th>");

                            int OptLen = 0;
                            var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                            if (srtRD.SegmentOptional != "")
                            {
                                OptLen = strOptionalSegment.Length;
                            }
                            if (OptLen > 0)
                            {
                                for (int z = 0; z < strOptionalSegment.Length; z++)
                                {
                                    ojbSB.Append("<th style='width:15px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strOptionalSegment[z] + "</th>");
                                }
                            }

                            int TLen = 0;
                            string TransCodeN = srtRD.TransCode;
                            string[] TransCodeN1 = TransCodeN.Split(',');

                            if (srtRD.TransCode != "")
                            {
                                TLen = TransCodeN1.Length;
                                for (int z = 0; z < TransCodeN1.Length; z++)
                                {
                                    ojbSB.Append("<th style='width:15px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + TransCodeN1[z] + "</th>");
                                }
                            }

                            ojbSB.Append("<th style='width:20px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>1099</th>");
                            ojbSB.Append("<th style='width:100px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Line Item Description</th>");

                            ojbSB.Append("<th style='width:70px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Vendor Name</th>");
                            ojbSB.Append("<th style='width:30px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Trans#</th>");
                            ojbSB.Append("<th style='width:20px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Per.#</th>");
                            ojbSB.Append("<th style='width:50px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Batch#</th>");
                            ojbSB.Append("<th style='width:50px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Document#</th>");
                            ojbSB.Append("<th style='width:60px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Transaction Date</th>");
                            //                        ojbSB.Append("<th style='width:100px; padding: 1px 3px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Description</th>");
                            ojbSB.Append("<th style='width:50px; padding: 1px 3px; font-size: 10px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Debit Amount</th>");
                            ojbSB.Append("<th style='width:50px; padding: 1px 3px; font-size: 10px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Credit Amount</th>");
                            ojbSB.Append("<th style='width:50px; padding: 1px 3px; font-size: 10px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Amount</th>");
                            // ojbSB.Append("</tr>");
                            // ojbSB.Append("</thead>");
                            #endregion
                        }
                        else
                        {
                            #region datalistHeader
                            // Build the DL header so that we know how many columns to span for the report
                            strDLHeader.Append("<tr style=\"background-color:#A4DEF9;\">\r\n"); // blue bg header to report with main header
                            string strSegment = srtRD.Segment;
                            string[] strSegment1 = strSegment.Split(',');

                            strTdCount = Convert.ToInt32(strSegment1.Length - 1);
                            StrheaderCount += strTdCount;

                            for (int z = 0; z < strSegment1.Length; z++)
                            {
                                string segName = Convert.ToString(strSegment1[z]);
                                if (strSegment1[z] == "CO")
                                { }
                                else if (strSegment1[z] == "DT")
                                {
                                    strDetailPosition = z;
                                    // strDLHeader.Append("<th style=\"width:30px; border-bottom-width: 1px;border-bottom: 1px solid black;padding: 3px; font-size: 10px; text-align:left; font-weight:bold;\">Account</th>\r\n");
                                    strDLHeader.Append("<th style=\"width:75px; border-bottom-width: 1px;border-bottom: 1px solid black;padding: 3px; font-size: 10px; text-align:left; font-weight:bold;\">Account</th>\r\n");
                                }
                                else
                                    strDLHeader.Append("<th style=\"width:50px; text-align:left; border-bottom-width: 1px;border-bottom: 1px solid black;padding: 3px; font-size: 10px; font-weight:bold;\">" + strSegment1[z] + " </th>\r\n");

                            }

                            if (srtRD.SegmentOptional != "")
                            {
                                var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                                strTdCount = Convert.ToInt32(strOptionalSegment.Length);
                                StrheaderCount += strTdCount;

                                for (int z = 0; z < strOptionalSegment.Length; z++)
                                {
                                    strDLHeader.Append("<th style=\"width:50px; border-bottom-width: 1px;border-bottom: 1px solid black;padding: 3px; font-size: 10px; font-weight:bold;text-align: left;\">" + strOptionalSegment[z] + "</th>\r\n");
                                }
                            }
                            strTdCount = Convert.ToInt32(TransCode1.Length);
                            StrheaderCount += strTdCount;

                            for (int z = 0; z < TransCode1.Length; z++)
                            {
                                strDLHeader.Append("<th style=\"text-align: left;width:50px; border-bottom-width: 1px;border-bottom: 1px solid black;padding: 3px; font-size: 10px; font-weight:bold;\">" + TransCode1[z] + " </th>\r\n");
                            }
                            strDLHeader.Append("<th style=\"width:120px; border-bottom-width: 1px;border-bottom: 1px solid black;padding: 3px; font-size: 10px; font-weight:bold;text-align: left;\"> 1099 </th>\r\n");
                            strDLHeader.Append("<th colspan=\"4\" style=\"border-bottom-width: 1px;border-bottom: 1px solid black;padding: 3px; font-size: 10px; font-weight:bold;text-align: left;\">Line Item Description</th>\r\n");
                            strDLHeader.Append("<th style=\"border-bottom-width: 1px;border-bottom: 1px solid black;text-align:right;padding: 3px; font-size: 10px; font-weight:bold;\">Amount</th>\r\n");
                            #endregion datalistHeader
                        }

                        // start the header
                        ojbSB.Append("<thead><tr><th colspan=\"" + (StrheaderCount - 1 + 4) + "\">\r\n");


                        int ColumnLength = 13; // There are 13 fixed columns on the by Account Report


                        if (Payload["JESort"] == "ACCOUNT" || Payload["JESort"] == "TRANSACTION")
                        {

                            #region account header
                            // The following doesn't seem valid since we are not showing dynamic segments yet.
                            //int iSegmentCount = srtRD.Segment.Split(',').Length - 1; // Add how many segments we ahve (minus 1 b/c Company is not displayed)
                            //ColumnLength += iSegmentCount;

                            var OptSegment = srtRD.SegmentOptional.Split(',');
                            if (srtRD.SegmentOptional != "")
                            {
                                ColumnLength += OptSegment.Length;
                            }

                            string TransactionCode = srtRD.TransCode;
                            string[] TransCode11 = TransactionCode.Split(',');
                            if (TransactionCode != "")
                            {
                                ColumnLength += TransCode11.Length;
                            }

                            string TransactionFromTo = "";
                            if (Payload.fieldsetTransactionIDs.TransFrom == "" && Payload.fieldsetTransactionIDs.TransTo == "")
                            {
                                TransactionFromTo = "ALL";
                            }
                            else
                            {
                                TransactionFromTo = 
                                    (Payload.fieldsetTransactionIDs.TransFrom == "" ? "1" : Payload.fieldsetTransactionIDs.TransFrom.Value)
                                    + " to "
                                    + (Payload.fieldsetTransactionIDs.TransTo == "" ? " END" : Payload.fieldsetTransactionIDs.TransTo.Value)
                                ;
                            }
                            string PStatus = "";
                            if (strRDF.Status == "SAVED")
                            {
                                if (strRDF.PeriodStatus == "Both")
                                {
                                    PStatus = "ALL";
                                }
                                else
                                {
                                    PStatus = strRDF.PeriodStatus;
                                }
                            }
                            else
                            {
                                if (Payload.fieldsetPeriod.PeriodFrom == "" && Payload.fieldsetPeriod.PeriodTo == "")
                                {
                                    PStatus = "ALL";
                                }
                                else
                                {
                                    if (Payload.fieldsetPeriod.PeriodFrom != "")
                                    {
                                        PStatus = Payload.fieldsetPeriod.PeriodFrom;
                                    }
                                    else
                                    {
                                        PStatus = "0";
                                    }
                                    if (Payload.fieldsetPeriod.PeriodTo != "")
                                    {
                                        PStatus += " to " + Payload.fieldsetPeriod.PeriodTo;
                                    }
                                    else
                                    {
                                        PStatus += " to Future";
                                    }
                                }
                            }

                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th colspan='" + ColumnLength + "'>");
                            ojbSB.Append("<table border=0 style='width: 100%;'>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th width='20%' style='vertical-align:top; align:left;'>");
                            ojbSB.Append("<table border=0 width='100%'>");
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Company : " + CompanyName[0].CompanyCode + "</td></tr>");
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>");
                            if (srtRD.SClassification.IndexOf("Episode") != -1)
                            {
                                ojbSB.Append("Episode(s) : " + (string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)));
                            }
                            else
                            {
                                ojbSB.Append("&nbsp;");
                            }
                            ojbSB.Append("</td></tr>");
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Batch : " + (Payload.BatchNumber.ToString() == "" ? "ALL" : Payload.BatchNumber.ToString()) + "</td></tr>");
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'></td></tr>");
                            string AccountFromTo = "";
                            if (Payload.fieldsetSegments.fieldsetSegments_DTFrom.Value == "" && Payload.fieldsetSegments.fieldsetSegments_DTTo.Value == "")
                            {
                                AccountFromTo = "ALL";
                            }
                            else
                            {
                                AccountFromTo =
                                    (Payload.fieldsetSegments.fieldsetSegments_DTFrom == "" ? "START" : Payload.fieldsetSegments.fieldsetSegments_DTFrom.Value)
                                    + " to "
                                    + (Payload.fieldsetSegments.fieldsetSegments_DTTo == "" ? " END" : Payload.fieldsetSegments.fieldsetSegments_DTTo.Value)
                                ;
                            }

                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Account : " + (AccountFromTo) + "</td></tr>");
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Transaction : " + TransactionFromTo + "</td></tr>");

                            string FilterCurrency = (Payload.fieldsetCurrency.CurrencyFilter.ToString() == "") ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                            ojbSB.Append("</table>");
                            ojbSB.Append("</th>");
                            ojbSB.Append("<th width='60%' style='vertical-align:top;'>");
                            ojbSB.Append("<table border=0 width='100%' style='margin:auto; width=50%'>");
                            ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>&nbsp;</th></tr>");
                            ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>" + srtRD.ProductionName + "</th></tr>");
                            ojbSB.Append("<tr><th style='padding: 0px; font-size: 17px; text-align: center;'>" + CompanyName[0].CompanyName + "</th></tr>");
                            ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>" + StrReportName + "</th></tr>");
                            ojbSB.Append("</table>");
                            ojbSB.Append("</th>");
                            ojbSB.Append("<th width='20%' style='vertical-align:top; align:left;'>");
                            ojbSB.Append("<table border=0 width='100%'>");
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px;text-align: left;'>Period : " + PStatus + "</td></tr>");

                            string PostedorDoc = "";
                            string DatetoDisplayFromTo = "";
                            //string DatetoDisplayT = "";
                            if ((Payload.fieldsetPeriod.PostedDateFrom ?? "") != "" || (Payload.fieldsetPeriod.PostedDateTo ?? "") != "")
                            {
                                PostedorDoc = "Posted";
                                //DatetoDisplayFromTo = (Payload.fieldsetPeriod.PostedDateFrom.ToString() + Payload.fieldsetPeriod.PostedDateFrom.ToString() == "") ? "ALL"
                                //    : Payload.fieldsetPeriod.PostedDateFrom.ToString() + " to " + Payload.fieldsetPeriod.PostedDateTo.ToString();
                            }
                            else
                            {
                                PostedorDoc = "Document";
                            }
                            DatetoDisplayFromTo = (Payload.fieldsetPeriod[PostedorDoc + "DateFrom"].ToString() + Payload.fieldsetPeriod[PostedorDoc + "DateTo"].ToString() == "") ? "ALL"
                                : Payload.fieldsetPeriod[PostedorDoc + "DateFrom"].ToString() + " to " + Payload.fieldsetPeriod[PostedorDoc + "DateTo"].ToString();
                            ojbSB.Append("<tr><td style=\"padding: 0px; font-size: 12px;text-align: left;\">" + PostedorDoc + " Date : " + DatetoDisplayFromTo + "</td>\r\n");
                            //ojbSB.Append("<tr><td style=\"padding: 0px; font-size: 12px;text-align: left;\">" + PostedorDoc + " Date To: " + DatetoDisplayT + "</td>\r\n");
                            ojbSB.Append($"<tr><td style='padding: 0px; font-size: 12px;text-align: left;'>Filter Currency : {FilterCurrency}</td></tr>");
                            ojbSB.Append($"<tr><td style='padding: 0px; font-size: 12px;text-align: left;'>Report Currency : {Payload.fieldsetCurrency.CurrencyReport.ToString()}</td></tr>");

                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Report Date : " + Pritingtdate + "</td></tr>");
                            ojbSB.Append("</table>");
                            ojbSB.Append("</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("</table>");
                            ojbSB.Append("</th>");
                            ojbSB.Append("</tr>");
                            #endregion
                        }
                        else
                        {
                            #region mainHeader
                            ojbSB.Append("<table width=\"100%\"style=\"border-spacing: 0px;\" ><tr>\r\n");
                            ojbSB.Append("<th style=\"width: 33%;vertical-align: top;border-bottom-width: 1px;border-bottom: 1px solid black;\">\r\n");
                            ojbSB.Append("<table>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Company</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\">" + CompanyName[0].CompanyCode + "</th></tr>\r\n");

                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Episode(s):</th>\r\n");
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>");
                            if (srtRD.SClassification.IndexOf("Episode") != -1)
                            {
                                ojbSB.Append("Episode(s) : " + (string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)));
                            }
                            else
                            {
                                ojbSB.Append("&nbsp;");
                            }
                            ojbSB.Append("</td></tr>");
                            //if (strRDF.Status == "Posted")
                            //{
                            //    ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\">" + (string.Join(",", Payload.JEPostingFilterEpisode) == "" ? "ALL" : string.Join(",", Payload.JEPostingFilterEpisode)) + "</th></tr>\r\n");
                            //}
                            //else
                            //{
                            //    ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\">" + (string.Join(",", Payload.JEAuditFilterEpisode) == "" ? "ALL" : string.Join(",", Payload.JEAuditFilterEpisode)) + "</th></tr>\r\n");
                            //}
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Batch</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\">" + ((strRDF.BatchNumber ?? "") == "" ? "ALL" : strRDF.BatchNumber.Substring(1)) + "</th></tr>\r\n");
                            //ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">User Name</th>\r\n");
                            //ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\">" + ((strRDF.UserName ?? "") == "" ? "ALL" : strRDF.UserName.Substring(1)) + "</th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Currency</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\">USD</th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Trans #</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\">" + (((strRDF.TransactionFrom ?? "") == "") & ((strRDF.TranasactionTo ?? "") == "") ? "ALL" : strRDF.TransactionFrom.ToString() + " to " + strRDF.TranasactionTo.ToString()) + "</th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;\"></th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\"></th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;\"></th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;\"></th></tr>\r\n");
                            ojbSB.Append("</table></th>\r\n");
                            ojbSB.Append(" <th style=\"vertical-align: top;width: 33%;border-bottom-width: 1px;border-bottom: 1px solid black;\">\r\n");
                            ojbSB.Append("<table>\r\n");
                            ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:17px;text-align:center;\">" + srtRD.ProductionName + "</th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:10px;text-align:center;\">" + CompanyName[0].CompanyName + "</th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding:5px 10px; text-align:center;\">" + StrReportName + "</th></tr>\r\n");
                            ojbSB.Append("</table>\r\n");
                            ojbSB.Append("</th>\r\n");
                            ojbSB.Append("<th align=right style=\"vertical-align: top;width: 33%;border-bottom-width: 1px;border-bottom: 1px solid black;\">\r\n");
                            ojbSB.Append("<table align=right>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Period Status </th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\">" + ((strRDF.PeriodStatus ?? "")) + "</th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Document Date</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\">" 
                                + ((Payload.fieldsetPeriod.DocumentDateFrom.ToString() + Payload.fieldsetPeriod.DocumentDateTo.ToString() == "")? "ALL"
                                    : Payload.fieldsetPeriod.DocumentDateFrom.ToString() + " to " + Payload.fielldsetPeriod.DocumentDateTo.ToString())
                                + "</th></tr>\r\n");
                            if (strRDF.Status == "SAVED")
                            {
                                ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\"></th>\r\n");
                                ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\"></th></tr>\r\n");
                                ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\"></th>\r\n");
                                ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\"></th></tr>\r\n");
                            }
                            else
                            {
                                ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Posted Date From:</th>\r\n");
                                ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\">" + (Payload.CreatedDateJEPostingFrom == "" ? "ALL" : Payload.CreatedDateJEPostingFrom) + "</th></tr>\r\n");
                                ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Posted Date To:</th>\r\n");
                                ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\">" + (Payload.PostedDateJEPostingTo == "" ? "ALL" : Payload.PostedDateJEPostingTo) + "</th></tr>\r\n");
                            }

                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Printed on</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\">" + Pritingtdate + "</th></tr>\r\n");

                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Posted Date From:</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\">" + (Payload.CreatedDateJEPostingFrom == "" ? "ALL" : Payload.CreatedDateJEPostingFrom) + "</th></tr>\r\n");
                            ojbSB.Append("<tr><th style=\"padding: 5px; font-size: 11px;text-align: left;\">Posted Date To:</th>\r\n");
                            ojbSB.Append("<th style=\"padding: 5px; font-size: 11px;text-align: left;\">" + (Payload.PostedDateJEPostingTo == "" ? "ALL" : Payload.PostedDateJEPostingTo) + "</th></tr>\r\n");
                            ojbSB.Append("</table>\r\n");
                            ojbSB.Append("</th>\r\n");

                            ojbSB.Append("</tr></table>\r\n");


                            #endregion mainHeader
                        }

                        ojbSB.Append("</th></tr>\r\n"); // End mainHeader
                                                        //                        ojbSB.Append("<tr>\r\n");
                                                        //                        ojbSB.AppendLine("<th colspan=\"11\">\r\n"); // Begin datalistHeader
                        ojbSB.AppendLine(strDLHeader.ToString());
                        //                        ojbSB.Append("</th>");
                        ojbSB.AppendLine("</tr></thead>\r\n"); // End the whole header

                        #endregion Header
                        // end the header
                        ojbSB.Append("<tbody>\r\n"); // start the body
                        Decimal dReportTotal = 0;
                        string strTransactionHeader = "";

                        #region reportBody
                        string OldTN = "";
                        string NewTN = "";
                        string OldAccountNo = "";
                        string NewAccountNo = "";
                        decimal AccTotal = 0;
                        decimal TotalAmountSum = 0;
                        decimal AccountDebit = 0;
                        decimal AccountCredit = 0;
                        for (int J = 0; J < strResult.Count; J++)
                        {


                            if (Sort == "ACCOUNT")
                            {
                                #region account

                                NewAccountNo = strResult[J].AccountCode;

                                if (OldAccountNo == "") // First Account
                                {
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th colspan='" + ColumnLength + "' style='padding: 1px 3px; font-weight: bold !important; font-size: 10px; text-align: left;  background-color: #FFFAE3;'>" + strResult[J].AccountCode + " " + strResult[J].AccountName + "</th>");
                                    ojbSB.Append("</tr>");

                                    OldAccountNo = strResult[J].AccountCode;
                                }
                                else if (OldAccountNo != NewAccountNo) // New Account; display the summary
                                {
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='" + (ColumnLength - 7) + "'></th>");
                                    ojbSB.Append("<th style='padding: 1px 3px; font - size: 10px; text - align: right; font - weight: normal; border - bottom - width: 1px; border - bottom: 1px solid #ccc;'><b></b></th>");
                                    ojbSB.Append("<th style='padding: 1px 3px; font - size: 10px; text - align: right; font - weight: normal; border - bottom - width: 1px; border - bottom: 1px solid #ccc;'><b></b></th>");
                                    ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='2'><b>Total for Account</b></th>");

                                    ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + Convert.ToDecimal(AccountDebit).ToString("#,##0.00") + "</b></th>");
                                    ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + Convert.ToDecimal(AccountCredit * -1).ToString("#,##0.00") + "</b></th>");

                                    AccTotal = AccountDebit - AccountCredit;
                                    if (AccTotal >= 0)
                                    {
                                        ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + Convert.ToDecimal(AccTotal).ToString("#,##0.00") + "</b></th>");
                                    }
                                    else
                                    {
                                        ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>-$" + Convert.ToDecimal(AccTotal * -1).ToString("#,##0.00") + "</b></th>");
                                    }

                                    ojbSB.Append("</tr>");

                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th colspan='" + ColumnLength + "' style='padding: 1px 3px; font-weight: bold !important; font-size: 10px; text-align: left;  background-color: #FFFAE3;'>" + strResult[J].AccountCode + " " + strResult[J].AccountName + "</th>");
                                    ojbSB.Append("</tr>");

                                    TotalAmountSum += AccTotal;
                                    AccTotal = 0;
                                    AccountDebit = 0;
                                    AccountCredit = 0;
                                    OldAccountNo = strResult[J].AccountCode;

                                }

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].AccountCode + "</th>");
                                ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].Location + "</th>");

                                if (srtRD.SegmentOptional != "")
                                {
                                    var strSegmentOptioanlN = srtRD.SegmentOptional;
                                    var strSegmentOptioanlN1 = strSegmentOptioanlN.Split(',');
                                    for (int k = 0; k < strSegmentOptioanlN1.Length; k++)
                                    {
                                        if (k == 0)
                                        {
                                            ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].SetAC + "</th>");
                                        }
                                        if (k == 1)
                                        {
                                            ojbSB.Append("<th style='padding: 1px 3px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].SeriesId + "</th>");
                                        }
                                    }
                                }
                                var resultJournalEntry = strResult[J];
                                #region transactiondetailsFreeFields
                                string strTransString = resultJournalEntry.TransactionvalueString;
                                if (TransCode != "")
                                {
                                    string strMemoCodesHTML = ReportEngineController.MakeMemoCodesHTML(TransCode1, strTransString, "width:15px; padding: 3px; font-size: 10px; border-bottom-width: 1px; border-bottom: 1px solid #ccc;");
                                    ojbSB.Append(strMemoCodesHTML);
                                }
                                #endregion transactiondetailsFreeFields

                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + (strResult[J].TaxCode == "0" ? "" : strResult[J].TaxCode) + "</th>");
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + WebUtility.HtmlEncode(strResult[J].Note) + "</th>");


                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].VendorName + "</th>");
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].TransactionNumber + "</th>");
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].ClosePeriod + "</th>");
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + strResult[J].BatchNumber + "</th>");
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + WebUtility.HtmlEncode(strResult[J].DocumentNo) + "</th>");
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + Convert.ToDateTime(strResult[J].PostedDate).ToShortDateString() + "</th>");
                                //                            ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + WebUtility.HtmlEncode( result[J].Description ) + "</th>");

                                if (Convert.ToDecimal(strResult[J].DebitAmount) != 0)
                                {
                                    AccountDebit += Convert.ToDecimal(strResult[J].DebitAmount);

                                    ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(strResult[J].DebitAmount).ToString("#,##0.00") + "</th>");
                                    ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                                }
                                else
                                {
                                    AccountCredit += Convert.ToDecimal(strResult[J].CreditAmount);
                                    ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                                    ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(strResult[J].CreditAmount).ToString("#,##0.00") + "</th>");
                                }

                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                                ojbSB.Append("</tr>");  // comment
                                #endregion
                            }
                            else
                            {
                                #region transaction

                                LedgerBusiness LA = new LedgerBusiness();
                                var resultJournalEntry = strResult[J];
                                NewTN = resultJournalEntry.TransactionNumber.ToString();
                                if (OldTN != NewTN)
                                {
                                    OldTN = resultJournalEntry.TransactionNumber.ToString();
                                    strTransactionHeader = "";
                                    strTransactionHeader = strTransactionHeader + ("<tr><td colspan=\"" + (StrheaderCount - 1 + 4) + "\">\r\n");
                                    #region transactionheader
                                    strTransactionHeader = strTransactionHeader + ("<table style=\"font-size:10px; width:100%; border-collapse:collapse; border:1px solid #ccc;\">\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<tbody>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<tbody>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<tr style=\"background:#FFFAE3;\">\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style=\"font-weight:bold;width:11%; padding: 3px; font-size: 10px;\">Batch</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style='padding: 3px;width:8%; font-size: 10px;'>" + resultJournalEntry.BatchNumber + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style=\"font-weight: bold;width:11%; padding: 3px; font-size: 10px;\">Document Number</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style='padding: 3px;width:8%; font-size: 10px;'>" + WebUtility.HtmlEncode(resultJournalEntry.DocumentNo) + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style='padding: 3px;width:45%; font-size: 10px;'></td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style=\"font-weight:bold;padding: 3px; font-size: 10px;\">Trans#</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style='padding: 3px; font-size: 10px; text-align:right;'>" + resultJournalEntry.TransactionNumber + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("</tr>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<tr style=\"background:#FFFAE3;\">");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style=\"font-weight:bold; padding: 3px; font-size: 10px;\">Currency</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style='padding: 3px; font-size: 10px;'>USD</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style=\" font-weight:bold;padding: 3px;font-size: 10px;\">Document Date:</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"5\" style='padding: 3px; font-size: 10px;'>" + resultJournalEntry.EntryDate.ToShortDateString() + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("</tr>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<tr style=\"background:#FFFAE3;\">\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style=\"font-weight: bold; padding: 3px; font-size: 10px;\">Ledger Period</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style='padding: 3px; font-size: 10px;'>" + resultJournalEntry.ClosePeriod + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style=\"font-weight: bold;padding: 3px; font-size: 10px;\">Journal Desc:</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"3\" style='padding: 3px; font-size: 10px;' >" + WebUtility.HtmlEncode(resultJournalEntry.Description) + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style=\"font-weight: bold;padding: 3px; font-size: 10px; \">Debit Amount:</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style='padding: 3px; font-size: 10px;text-align:right'> $" + Convert.ToDecimal(resultJournalEntry.DebitTotal).ToString("#,##0.00") + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("</tr>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<tr style=\"background:#FFFAE3;\">\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"3\"></td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style=\"font-weight: bold;padding: 3px; font-size: 10px;\">JE Source Code:</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"3\" style=\"padding: 3px; font-size: 10px;\">" + resultJournalEntry.Source + "</td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"1\" style=\"font-weight: bold; padding: 3px; font-size: 10px;\">Credit Amount:</td>\r\n");
                                    if (Convert.ToDecimal(resultJournalEntry.CreditTotal) > 0)
                                    {
                                        strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style='padding: 3px; font-size: 10px;text-align:right'>-$" + Convert.ToDecimal(resultJournalEntry.CreditTotal).ToString("#,##0.00") + "</td>\r\n");
                                    }
                                    else
                                    {
                                        strTransactionHeader = strTransactionHeader + ("<td colspan=\"2\" style='padding: 3px; font-size: 10px;text-align:right'>$" + Convert.ToDecimal(resultJournalEntry.CreditTotal).ToString("#,##0.00") + "</td>\r\n");
                                    }
                                    strTransactionHeader = strTransactionHeader + ("</tr>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<tr style=\"background:#FFFAE3;\">\r\n");
                                    strTransactionHeader = strTransactionHeader + ("<td colspan=\"10\" style=\"padding-bottom: 3px;font-size: 14px; text-align: left; font-weight: bold; width: 100px;border-bottom-width: 1px;border-bottom: 1px solid black;\"></td>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("</tr>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("</tbody>\r\n");
                                    strTransactionHeader = strTransactionHeader + ("</table>\r\n");
                                    #endregion transactionheader
                                    strTransactionHeader = strTransactionHeader + ("</td></tr>\r\n");
                                    ojbSB.Append(strTransactionHeader);
                                }
                                #region transactiondetails
                                var CoaCode = resultJournalEntry.COAString;
                                var straa = CoaCode.Split('|');
                                #region transactiondetailsLine
                                ojbSB.AppendLine("<tr style=\"border-bottom-width: 1px;border-bottom: 1px solid black;\">");
                                #region transactiondetailsSegments
                                for (int k = 0; k < straa.Length; k++)
                                {
                                    if (k != 0)
                                    {
                                        if (strDetailPosition == k)
                                        {
                                            string strCOADetail = straa[k];
                                            string[] strDetail = strCOADetail.Split('>');
                                            if (strDetail.Length == 1)
                                            {
                                                ojbSB.AppendLine("<td style='width:30px; padding: 3px; font-size: 10px;'>" + strDetail[0] + "</td>");
                                            }
                                            else
                                            {
                                                ojbSB.AppendLine("<td style='width:30px; padding: 3px; font-size: 10px;'>" + strDetail[strDetail.Length - 1] + "</td>");
                                            }
                                        }
                                        else
                                        {
                                            ojbSB.AppendLine("<td style='width:15px; padding: 3px; font-size: 10px;'>" + straa[k] + "</td>");
                                        }
                                    }
                                }
                                #endregion transactiondetailsSegments
                                #region transactiondetailsSegmentsOptional
                                var strSegmentOptioanl = srtRD.SegmentOptional;
                                if (strSegmentOptioanl != "")
                                {
                                    var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                                    for (int kk = 0; kk < strSegmentOptioanl1.Length; kk++)
                                    {
                                        if (kk == 0)
                                        {
                                            ojbSB.AppendLine("<td style='width:15px; padding: 3px; font-size: 10px;'>" + resultJournalEntry.SetAC + "&nbsp;</td>");
                                        }
                                        if (kk == 1)
                                        {
                                            ojbSB.AppendLine("<td style='width:15px; padding: 3px; font-size: 10px;'>" + resultJournalEntry.SeriesAC + "&nbsp;</td>");
                                        }
                                    }
                                }
                                #endregion transactiondetailsSegmentsOptional
                                #region transactiondetailsFreeFields
                                string strTransString = resultJournalEntry.TransactionvalueString;
                                string strMemoCodesHTML = ReportEngineController.MakeMemoCodesHTML(TransCode1, strTransString, "width:15px; padding: 3px; font-size: 10px;");
                                ojbSB.Append(strMemoCodesHTML);
                                #endregion transactiondetailsFreeFields
                                #region transactiondetailsTaxCode
                                ojbSB.AppendLine("<td style='width:15px; font-size:10px'>" + (resultJournalEntry.TaxCode == "0" ? "" : resultJournalEntry.TaxCode) + "</td>");
                                #endregion transactiondetailsTaxCode
                                ojbSB.AppendLine("<td colspan=\"3\" style='padding: 3px;font-size: 10px;text-align: justify;width: 250px !important;'>" + WebUtility.HtmlEncode(resultJournalEntry.Note) + "</td>");
                                if (resultJournalEntry.CreditAmount != 0)
                                {
                                    var aa = Convert.ToDecimal(resultJournalEntry.CreditAmount).ToString("#,##0.00");
                                    decimal ab = Convert.ToDecimal(resultJournalEntry.CreditAmount);
                                    decimal b = 0;
                                    if (ab > 0) { b = (ab > 0) ? (-ab) : ab; } else { b = (ab < 0) ? (-ab) : ab; }

                                    ojbSB.AppendLine("<td colspan=\"2\" style='padding: 3px; font-size: 10px;text-align:right;'>$" + Convert.ToDecimal(b).ToString("#,##0.00") + "</td>");
                                }
                                else
                                {
                                    ojbSB.AppendLine("<td colspan=\"2\" style='padding: 3px; font-size: 10px;text-align:right;'>$" + Convert.ToDecimal(resultJournalEntry.DebitAmount).ToString("#,##0.00") + "</td>");
                                }
                                ojbSB.AppendLine("</tr>");
                                #endregion transactiondetailsLine
                                if ((strResult.Count - 1) != J)
                                {
                                    if (OldTN != strResult[J + 1].TransactionNumber.ToString())
                                    {
                                        #region transactiondetailsFooter
                                        ojbSB.AppendLine("<tr>");
                                        ojbSB.AppendLine("<th colspan=\"" + Convert.ToInt32(StrheaderCount - 3 + 3) + "\" style=\"padding: 5px 10px; font-size: 14px; text-align: right;\"></th>");
                                        ojbSB.AppendLine("<th colspan=\"2\" style =\"text-align: right;padding-right: 1%;\">Total for Transaction " + resultJournalEntry.TransactionNumber + "</th>");
                                        ojbSB.AppendLine("<th style=\" font-size: 14px; border-top-width: 1px;border-top: 1px solid black;text-align: right;width: 100px;\">$" + Convert.ToDecimal(resultJournalEntry.DebitTotal - resultJournalEntry.CreditTotal).ToString("#,##0.00") + "</th></tr>");
                                        #endregion transactiondetailsFooter
                                    }
                                }
                                else
                                {
                                    #region transactiondetailsFooter
                                    ojbSB.AppendLine("<tr>");
                                    ojbSB.AppendLine("<th colspan=\"" + Convert.ToInt32(StrheaderCount - 3 + 3) + "\" style=\"padding: 5px 10px; font-size: 14px; text-align: right;\"></th>");
                                    ojbSB.AppendLine("<th colspan=\"2\" style =\"text-align: right;padding-right: 1%;\">Total for Transaction " + resultJournalEntry.TransactionNumber + "</th>");
                                    ojbSB.AppendLine("<th style=\" font-size: 14px; border-top-width: 1px;border-top: 1px solid black;text-align: right;width: 100px;\">$" + Convert.ToDecimal(resultJournalEntry.DebitTotal - resultJournalEntry.CreditTotal).ToString("#,##0.00") + "</th></tr>");
                                    #endregion transactiondetailsFooter
                                }
                                dReportTotal += Convert.ToDecimal(resultJournalEntry.DebitTotal - resultJournalEntry.CreditTotal);
                                #endregion transactiondetails
                                #endregion
                            }
                        }



                        #endregion reportBody

                        if (Sort == "ACCOUNT")
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='" + (ColumnLength - 7) + "'></th>");
                            ojbSB.Append("<th style='padding: 1px 3px; font - size: 10px; text - align: right; font - weight: normal; border - bottom - width: 1px; border - bottom: 1px solid #ccc;'><b></b></th>");
                            ojbSB.Append("<th style='padding: 1px 3px; font - size: 10px; text - align: right; font - weight: normal; border - bottom - width: 1px; border - bottom: 1px solid #ccc;'><b></b></th>");
                            ojbSB.Append("<th style='padding: 3px 13px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='2'><b>Total for Account</b></th>");

                            AccTotal = AccountDebit - AccountCredit;

                            TotalAmountSum += AccTotal;


                            ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + Convert.ToDecimal(AccountDebit).ToString("#,##0.00") + "</b></th>");

                            ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + Convert.ToDecimal(AccountCredit).ToString("#,##0.00") + "</b></th>");

                            AccTotal = AccountDebit - AccountCredit;
                            if (AccTotal >= 0)
                            {
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>$" + Convert.ToDecimal(AccTotal).ToString("#,##0.00") + "</b></th>");
                            }
                            else
                            {
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'><b>-$" + Convert.ToDecimal(AccTotal * -1).ToString("#,##0.00") + "</b></th>");
                            }

                            ojbSB.Append("</tr>");

                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='border-bottom-width: 1px; border-bottom: 1px solid #ccc;' colspan='" + ColumnLength + "'>");
                            ojbSB.Append("</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: normal;' colspan='" + (ColumnLength - 5) + "'></th>");
                            ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: left; font-weight: bold;' colspan='4'>Report Total</th>");

                            if (TotalAmountSum >= 0)
                            {
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: bold;'>$" + Convert.ToDecimal(TotalAmountSum).ToString("#,##0.00") + "</th>");
                            }
                            else
                            {
                                ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px; text-align: right; font-weight: bold;'>-$" + Convert.ToDecimal(TotalAmountSum * -1).ToString("#,##0.00") + "</th>");
                            }

                            ojbSB.Append("</tr>");
                            ojbSB.Append("</tbody>");
                        }
                        else
                        {

                            ojbSB.AppendLine("\r\n"); // End the Body
                            ojbSB.AppendLine("<tr>\r\n"); // Start the Report Ending
                            ojbSB.AppendLine("<th colspan=\"" + Convert.ToInt32(StrheaderCount - 1 + 3) + "\" style=\"padding: 5px 10px; font-size: 14px; text-align: right;\">Report Total</th>\r\n");
                            ojbSB.AppendLine("<th style=\"padding: 5px 10px; font-size: 14px; border-top-width: 1px;border-top: 1px solid black;text-align: right;\">$" + dReportTotal.ToString("#,##0.00") + "</th>\r\n");
                            ojbSB.AppendLine("</tr>\r\n"); // End the Report Ending
                            ojbSB.AppendLine("</tbody></table>");
                            ojbSB.AppendLine("</body></html>");

                        }
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();

                    }
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //=======================Petty Cash===========================//
        [Route("ReportPettyCash")]
        [HttpPost]
        public string ReportPettyCash(JSONParameters callParameters)
        {
            var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));


            POInvoiceBussiness POBusinessContext = new POInvoiceBussiness();
            ReportsBussiness BusinessContext = new ReportsBussiness();

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                var result = BusinessContext.ReportsPettyCashFilterJSON(callParameters);
                if (Convert.ToBoolean(Payload["isExport"] ?? false))
                {
                    return ReportEngineController.MakeJSONExport(result);
                }

                try
                {
                    string strReportType = "";
                    strReportType = (Payload.Status.ToString() == "Pending" ? "Petty Cash Audit by Transaction" : "Petty Cash Posted by Transaction");

                    POInvoiceBussiness BC = new POInvoiceBussiness();

                    StringBuilder ojbSB = new StringBuilder();
                    string stest = ojbSB.ToString();

                    int ColumnLength = 7;
                    int optLen = 0;
                    int SgLen = 0;
                    int Tlen = 0;

                    if (result.Count != 0)
                    {

                        string strSegmentH = Payload.Segment.ToString();
                        string[] strSegment1H = strSegmentH.Split(',');
                        for (int z = 0; z < strSegment1H.Length; z++)
                        {
                            if ((strSegment1H[z] == "CO") || (strSegment1H[z] == "LO") || (strSegment1H[z] == "DT"))
                            {
                            }
                            else
                            {
                                SgLen++;
                            }
                        }

                        string strOptionalSegmentH = Payload.SegmentOptional.ToString();
                        string[] strOptionalSegment1H = strOptionalSegmentH.Split(',');
                        for (int z = 0; z < strOptionalSegment1H.Length; z++)
                        {
                            optLen++;
                        }

                        string TransCodeH = Payload.TransCode.ToString();
                        string[] TransCode1H = TransCodeH.Split(',');
                        for (int z = 0; z < TransCode1H.Length; z++)
                        {
                            Tlen++;
                        }

                        ColumnLength = ColumnLength + SgLen + optLen + Tlen;

                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title>" + strReportType + "</title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table style='width: 10.5in; float: left; repeat-header: yes; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "'>");
                        ojbSB.Append("<table style='width: 10.5in'>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;font-size: 12px;'>Company (s) : " + (string.Join(",", Payload.fieldsetSegments.fieldsetSegments_CO.ToString()) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_CO)) + "</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align:center;'>&nbsp</th>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;font-size: 12px;text-align: right;'>Posted Date From : " + (Payload.fieldsetPeriod.DocumentDateFrom.ToString() == "" ? "ALL" : Payload.fieldsetPeriod.DocumentDateFrom.ToString()) + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;font-size: 12px;'>Location (s) : " + (string.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO) == "" ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO)) + "</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align:center;'></th>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;font-size: 12px;text-align: right;'>Posted Date To : " + (Payload.fieldsetPeriod.DocumentDateTo.ToString() == "" ? "ALL" : Payload.fieldsetPeriod.DocumentDateTo.ToString()) + "</td>");
                        ojbSB.Append("</tr>");

                        string EP = Convert.ToString(Payload["Segment"]);
                        if (EP.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td class='header-td' style='width: 20%;font-size: 12px;'>Episode(s) : " + (string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)) + "</td>");
                            ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align:center;'></th>");
                            ojbSB.Append("<td class='header-td' style='width: 20%;font-size: 12px;text-align: right;'>Period Status: " + (Payload.fieldsetPeriod.PeriodStatus ?? "") + "</td>");
                            ojbSB.Append("</tr>");
                        }

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;'>Batch : " + (string.Join(",", Payload.BatchNumber) == "" ? "ALL" : string.Join(",", Payload.BatchNumber)) + "</td>");
                        ojbSB.Append("<th style='font-size: 16px; width: 60%; text-align: center;'>" + (Payload["ProductionName"]) + "</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;text-align: right; '>Custodian(s) : " + (Convert.ToString(Payload.PettyCashCustodian) == "" ? "ALL" : Convert.ToString(Payload.PettyCashCustodian)) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; '>&nbsp;</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align:center;'>" + strReportType + "</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;text-align: right; '>Recipient(s) : " + (Convert.ToString(Payload.PettyCashRecipient) == "" ? "ALL" : Convert.ToString(Payload.PettyCashRecipient)) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; '>Trans # : " + ((Payload.fieldsetTransactionIDs.TransFrom.ToString() + Payload.fieldsetTransactionIDs.TransTo.ToString()) == "" ? "ALL" : Payload.fieldsetTransactionIDs.TransFrom.ToString() + " to " + Payload.fieldsetTransactionIDs.TransTo.ToString()) + "</td>");
                        ojbSB.Append("<th style=' font-size: 17px; width: 60%;  text-align: center;'></th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;text-align: right; '>Envelope To : " + (Payload.fieldsetTransactionIDs.TransTo.ToString() == "" ? "ALL" : Payload.fieldsetTransactionIDs.TransTo.ToString()) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; '>Envelope From : " + (Payload.fieldsetTransactionIDs.TransFrom.ToString() == "" ? "ALL" : Payload.fieldsetTransactionIDs.TransFrom.ToString()) + "</td>");
                        ojbSB.Append("<th style=' font-size: 17px; width: 60%;  text-align: center;'></th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;text-align: right;'>Report Date :" + (Payload["ReportDate"] == "" ? "ALL" : Payload["ReportDate"]) + "</td>");
                        ojbSB.Append("</tr>");

                        if (EP.IndexOf("EP") == -1)
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;'>Vendor : " + ((Payload.VendorFrom.ToString() + Payload.VendorTo.ToString()) == "" ? "ALL" : (Payload.VendorFrom.ToString() + " to " + Payload.VendorTo.ToString())) + "</td>");
                            //ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; '>Vendor :" + (string.Join(",", Payload["DdlSelectText"]["PettyCashVendor"]) == "" ? "ALL" : string.Join(",", Payload["DdlSelectText"]["PettyCashVendor"])) + "</td>");
                            ojbSB.Append("<th style=' font-size: 17px; width: 60%;  text-align: center;'></th>");
                            ojbSB.Append("<td class='header-td' style='width: 20%;font-size: 12px;text-align: right;'>&nbsp;</td>");
                            ojbSB.Append("</tr>");
                        }

                        //ojbSB.Append("<tr>");
                        //ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'></td>");
                        //// ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; color: white;'>2</th>");
                        //ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'></td>");
                        //ojbSB.Append("</tr>");

                        //ojbSB.Append("<tr>");
                        //ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'></td>");
                        ////  ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + strReportType + "</th>");
                        //ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'></th>");
                        //ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'></td>");
                        //ojbSB.Append("</tr>");

                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");

                        string HeadRepeatStr = "";

                        // HeadRepeatStr+="<tr style='background-color: #DFE4F7;'>"; For Changing Background Color
                        HeadRepeatStr += "<tr style='background-color: #A4DEF9;'>";
                        HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>LO</th>";

                        string strSegment = Payload["Segment"];
                        string[] strSegment1 = strSegment.Split(',');

                        for (int z = 0; z < strSegment1.Length; z++)
                        {
                            if ((strSegment1[z] == "CO") || (strSegment1[z] == "LO") || (strSegment1[z] == "DT"))
                            {
                            }
                            else
                            {
                                HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strSegment1[z] + "</th>";
                            }
                        }

                        HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Account</th>";

                        int a = SgLen + optLen + Tlen;
                        if (a < 2)
                        {
                            for (int y = 0; y < (3 - a); y++)
                            {
                                a = (3 - a);
                                HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'></th>";
                            }
                        }
                        string strSegmentOptional = Payload["SegmentOptional"];
                        string[] strSegmentOptional1 = strSegmentOptional.Split(',');
                        //var strOptionalSegment = Payload["SegmentOptional"].Split(',');
                        for (int z = 0; z < strSegmentOptional1.Length; z++)
                        {
                            HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strSegmentOptional1[z] + "</th>";
                        }

                        string TransCode = Payload["TransCode"];
                        string[] TransCode1 = TransCode.Split(',');
                        for (int z = 0; z < TransCode1.Length; z++)
                        {
                            HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + TransCode1[z] + "</th>";
                        }

                        HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>1099</th>";
                        HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Vendor Name</th>";

                        HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Line Item Description</th>";
                        HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'></th>";
                        HeadRepeatStr += "<th style='padding: 5px 10px; font-size: 10px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Amount</th>";
                        HeadRepeatStr += "</tr>";
                        ojbSB.Append(HeadRepeatStr);
                        ojbSB.Append("</thead>");
                        ojbSB.Append("<tbody>");
                        // decimal ReportTotal = 0;
                        decimal EnvalopTotal = 0;
                        decimal ExpenseTotal = 0;
                        decimal AdvanceTotal = 0;

                        for (int J = 0; J < result.Count; J++)
                        {

                            var resultInvoice = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(result[J].PCHeaderJSON)); // BC.GetDetailPCEnvelopeById(result[J].PcEnvelopeID);
                            var resultInvoiceLine = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(result[J].PCDetailsJSON)); //BC.GetPCEnvelopeLineDetailById(result[J].PcEnvelopeID);
                            EnvalopTotal += Convert.ToDecimal(resultInvoice[0].EnvelopeAmount);
                            ExpenseTotal += Convert.ToDecimal(resultInvoice[0].LineItemAmount);
                            AdvanceTotal += Convert.ToDecimal(resultInvoice[0].AdvanceAmount);
                            // ojbSB.Append(HeadRepeatStr);
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Batch </th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>" + resultInvoice[0].BatchNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>PC Recipient </th>");
                            ojbSB.Append("<th colspan='" + (a - 1) + "' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;background-color: #FFFAE3;'>" + resultInvoice[0].VendorName + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Envelope Number </th>");
                            ojbSB.Append("<th colspan='2' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + resultInvoice[0].EnvelopeNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>Trans#</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + resultInvoice[0].TransactionNumber + "</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left; background-color: #FFFAE3;'>PC Bank </th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + resultInvoice[0].CustodianCode + "</th>");
                            ojbSB.Append("<th colspan='" + (SgLen + optLen + Tlen) + "' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>Envelope Date</th>");
                            ojbSB.Append("<th colspan='2' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>" + resultInvoice[0].CreatedDate + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>EffectiveDate</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Currency</th>");
                            ojbSB.Append($"<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>{resultInvoice[0].CurrencyDocument}</th>");
                            ojbSB.Append("<th colspan='" + (SgLen + optLen + Tlen) + "' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;background-color: #FFFAE3;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>Envelope Description</th>");
                            ojbSB.Append("<th colspan='2' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>" + resultInvoice[0].Description + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-weight: bold !important; font-size: 11px; text-align: left;  background-color: #FFFAE3;'>Ledger Period</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important;  background-color: #FFFAE3;'>" + resultInvoice[0].ClosePeriodId + "</th>");
                            ojbSB.Append("<th colspan='" + (SgLen + optLen + Tlen) + "' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>Advance Amount</th>");
                            ojbSB.Append("<th colspan='2' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>$" + resultInvoice[0].AdvanceAmount.ToString("$#,##,0.00") + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold !important; background-color: #FFFAE3;'>Envelope Amt</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: bold !important; background-color: #FFFAE3;'>" + (resultInvoice[0].EnvelopeAmount).ToString("$#,##,0.00") + "</th>");
                            ojbSB.Append("</tr>");
                            if (resultInvoiceLine.Count > 0)
                            {
                                for (var b = 0; b < resultInvoiceLine.Count; b++)
                                {

                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].Location + "</th>");
                                    if (SgLen > 0)
                                    {
                                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].Episode + "</th>");
                                    }

                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].Acct + "</th>");


                                    string strSegmentOptioanl = Payload["SegmentOptional"];
                                    string[] strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                                    for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                                    {
                                        if (k == 0)
                                        {
                                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].setAccountCode??"" + "</th>");
                                        }
                                        if (k == 1)
                                        {
                                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].SeriesAccountCode + "</th>");
                                        }
                                    }
                                    string strTransString = resultInvoiceLine[b].TransactionvalueString;
                                    string[] strTransString1 = strTransString.Split(',');
                                    int strTrvalCount = strTransString1.Length;
                                    if (strTransString == "")
                                    {
                                        for (int z = 0; z < TransCode1.Length; z++)
                                        {
                                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'></th>");
                                        }
                                    }
                                    else
                                    {
                                        for (int z = 0; z < strTrvalCount; z++)
                                        {
                                            if (TransCode1.Length == 0)
                                            {
                                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'></th>");
                                            }
                                            else
                                            {
                                                string[] newTransValu = strTransString1[z].Split(':');
                                                if (newTransValu[0] == TransCode1[z])
                                                {
                                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + newTransValu[1] + "</th>");

                                                }
                                                else
                                                {
                                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'></th>");
                                                }
                                            }
                                        }
                                        int strTrremval = Convert.ToInt32(TransCode1.Length) - strTrvalCount;
                                        for (int z = 0; z < strTrremval; z++)
                                        {
                                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'></th>");
                                        }
                                    }
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].TaxCode??"" + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].VendorName??"" + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'>" + resultInvoiceLine[b].LineDescription + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;'></th>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal;'>$" + Convert.ToDecimal(resultInvoiceLine[b].Amount).ToString("#,##0.00") + "</th>");
                                    ojbSB.Append("</tr>");
                                }

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;' colspan='" + (ColumnLength - 3) + "'></th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold;' colspan='2'>Envelope Amount :</th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: bold;'>$" + resultInvoice[0].EnvelopeAmount.ToString("#,##0.00") + "</th>");
                                ojbSB.Append("</tr>");
                            }
                        }
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "' style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;  border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;' colspan='" + (ColumnLength - 3) + "'></th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold;' colspan='2'>Advance Amount Total :</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: bold;'>" + AdvanceTotal.ToString("$#,##0.00") + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal;' colspan='" + (ColumnLength - 3) + "'></th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: bold;' colspan='2'>Envelope Amount Total :</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: bold;'>" + EnvalopTotal.ToString("$#,##0.00") + "</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table></body></html>");
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                    else
                    {
                        return "";
                    }
                }
                catch (Exception ex)
                {
                    return "Exception:" + ex.Message;
                }
            }
            else
            {
                return "";
            }
        }

        [Route("TBReportComExpense")]
        [HttpPost]

        public string TBReportComExpense(JSONParameters callParameters)
        {
            ReportsBussiness BusinessContext = new ReportsBussiness();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    ReportTrial RP = JsonConvert.DeserializeObject<ReportTrial>(Convert.ToString(Payload["TrailBalance"]));
                    var StrResult = new List<ReportsLedgerTBJSON_Result>();
                    if (Convert.ToBoolean(Payload["TrailBalance"]["SuppressZuro"]))
                    {
                        StrResult = BusinessContext.ReportsLedgerTBJSON(callParameters).Where(e => (e.AccountBal + e.Currentactivity) != 0.00M).ToList();
                    }
                    else
                    {
                        StrResult = BusinessContext.ReportsLedgerTBJSON(callParameters).ToList();
                    }

                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        return ReportEngineController.MakeJSONExport(StrResult);
                    }
                    StringBuilder ojbSB = new StringBuilder();
                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string Pritingtdate = BusinessContextR.UserSpecificTime(Convert.ToInt32(RP.ProdId));
                    Boolean isExpense = false;

                    #region Header
                    ojbSB.Append("<html><head><style type=\"text/css\"></style></head>");
                    ojbSB.Append(" <body><table style=\"width: 10.5in; border-collapse: collapse; border-top: 1px solid #ccc; repeat-header: yes;\"><tbody><tr><td style=\"width: 42%;vertical-align: top;border-bottom-width: 2px;\"><table style=\"font-size:10px;\"><thead>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td >Cur:</td>");
                    ojbSB.Append("<td >USD/ All</td></tr>");
                    ojbSB.Append("<tr><td >Post Date:</td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td >Episode:</td>");
                    ojbSB.Append("<td >N/A</td></tr>");
                    ojbSB.Append("<tr><td >Location:</td>");
                    ojbSB.Append("<td >N/A</td></tr>");
                    ojbSB.Append("<tr><td >Set(s):</td>");
                    ojbSB.Append("<td >N/A</td></tr>");
                    ojbSB.Append("<tr><td >Period:</td>");
                    ojbSB.Append("<td >Current</td></tr></thead></table></td>");

                    ///// Center Part
                    ojbSB.Append("<td style=\"vertical-align: top;width: 41%;border-bottom-width: 2px;\">");
                    ojbSB.Append("<table style=\"font-size:10px;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + RP.ProductionName + "</th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:17px;text-align:center;\"></th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:10px;text-align:center;\">Detail Trial Balance</th></tr></thead></table></td>");
                    ojbSB.Append("<td style=\"vertical-align: top;width: 18%;border-bottom-width: 2px;\">");
                    // Center Part End


                    ojbSB.Append("<table style=\"font-size:10px;\"><thead><tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td ></td>");
                    ojbSB.Append("<td ></td></tr>");
                    ojbSB.Append("<tr><td >Exclude Net Zero:</td>");
                    ojbSB.Append("<td>Y</td></tr>");
                    ojbSB.Append("<tr><td >Compress Expenses:</td>");
                    ojbSB.Append("<td >Y</td></tr>");
                    ojbSB.Append("<tr><td >Include PO's:</td>");
                    ojbSB.Append("<td >N</td></tr>");

                    ojbSB.Append("<tr><td >Include Location Bkdwn:</td>");
                    ojbSB.Append("<td >N</td></tr>");
                    ojbSB.Append("<tr><td >Summary Totals Only:</td>");
                    ojbSB.Append("<td >N</td></tr>");



                    ojbSB.Append("<tr><td >Printed on</td>");
                    ojbSB.Append("<td >" + Pritingtdate + "</td></tr></thead></table></td></tr></tbody></table>");
                    #endregion Header

                    #region SecondPage
                    ojbSB.Append("<table style=\"font-size:12px; width:10.5in;; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                    ojbSB.Append("<tr style=\"background-Color:#A4DEF9;border-top: 3px solid black;height: 30px;\">");
                    ojbSB.Append("<th colspan=\"2\" style=\"width:30%;border-bottom-width: 2px;border-bottom: 3px solid black;text-align:left;\">Account</th>");
                    ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;text-align: left;\">Account Description</th>");
                    ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;text-align: right;\">Begining Balance</th>");
                    ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;text-align: right;\">Current Activity</th>");
                    ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;text-align: right;padding-right: 50px;\">Ending Balance</th></tr>");


                    //header end
                    //header2 her
                    /*
                     * We have to track the Beginning Balance, Current Activity, and Ending Balance (Beginning Balance + Current Activity) by
                     * Grand Total, Account Type, and Header Account
                    */
                    Dictionary<string, decimal> TBSummary = new Dictionary<string, decimal>();

                    decimal strTotalBal = 0;
                    decimal strTotalCur = 0;
                    decimal strTotalEnd = 0;
                    string strPreType = "";
                    string strPreAccount = "";
                    string strPreDescription = "";

                    decimal strTotalBalF = 0;
                    decimal strTotalCurF = 0;
                    decimal strTotalEndF = 0;

                    string StrDescParent = "";

                    for (int z = 0; z < StrResult.Count; z++)
                    {
                        string strType = StrResult[z].Type;

                        string strChild = StrResult[z].Child;
                        string strAccountNo = StrResult[z].Parent;

                        // initiate the Total values or add to them
                        if (z == 0)
                        {
                            TBSummary["Total_B"] = Convert.ToDecimal(StrResult[z].BeginingBal);
                            TBSummary["Total_C"] = Convert.ToDecimal(StrResult[z].Currentactivity);
                        }
                        else
                        {
                            TBSummary["Total_B"] += Convert.ToDecimal(StrResult[z].BeginingBal);
                            TBSummary["Total_C"] += Convert.ToDecimal(StrResult[z].Currentactivity);
                        }

                        // initiate the Type values or add to them
                        if (strPreType != StrResult[z].Type)
                        {
                            TBSummary[StrResult[z].Type + "_B"] = Convert.ToDecimal(StrResult[z].BeginingBal);
                            TBSummary[StrResult[z].Type + "_C"] = Convert.ToDecimal(StrResult[z].Currentactivity);
                        }
                        else
                        {
                            TBSummary[StrResult[z].Type + "_B"] += Convert.ToDecimal(StrResult[z].BeginingBal);
                            TBSummary[StrResult[z].Type + "_C"] += Convert.ToDecimal(StrResult[z].Currentactivity);
                        }

                        // initiate the Parent values or add to them
                        if (strPreAccount != StrResult[z].Parent)
                        {
                            TBSummary[StrResult[z].Parent + "_B"] = Convert.ToDecimal(StrResult[z].BeginingBal);
                            TBSummary[StrResult[z].Parent + "_C"] = Convert.ToDecimal(StrResult[z].Currentactivity);
                        }
                        else
                        {
                            TBSummary[StrResult[z].Parent + "_B"] += Convert.ToDecimal(StrResult[z].BeginingBal);
                            TBSummary[StrResult[z].Parent + "_C"] += Convert.ToDecimal(StrResult[z].Currentactivity);
                        }

                        if (z != 0) // Don't do this for the first record
                        {
                            if (strPreAccount != StrResult[z].Parent)
                            {
                                ojbSB.Append("<tr style=\"background-Color:#FFF; font-weight: bold;height: 30px;\">");
                                ojbSB.Append("<td colspan=\"2\" style=\"color: white;\">.</td>");
                                ojbSB.Append("<td style=\"text-align:left;font-weight:bold;\">" + StrDescParent + "  Total" + "</td>");
                                ojbSB.Append("<td style=\" text-align:right;border-top: 1px solid;\">$" + Convert.ToDecimal(TBSummary[strPreAccount + "_B"]).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td style=\" text-align:right;border-top: 1px solid;\">$" + Convert.ToDecimal(TBSummary[strPreAccount + "_C"]).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td style=\" text-align:right;border-top: 1px solid;padding-right: 50px;\">$" + Convert.ToDecimal(TBSummary[strPreAccount + "_B"] + TBSummary[strPreAccount + "_C"]).ToString("#,##0.00") + "</td></tr>");
                                //strTotalBal = 0; strTotalCur = 0; strTotalEnd = 0;
                                StrDescParent = StrResult[z].Description;

                            }


                            if (strPreType != StrResult[z].Type)
                            {
                                //strTotalBalF = 0;
                                //strTotalCurF = 0;
                                //strTotalEndF = 0;
                                //for (int a = 0; a < StrResult.Count; a++)
                                //{
                                //    if (strPreType == StrResult[a].Type)
                                //    {
                                //        strTotalBalF = strTotalBalF + Convert.ToDecimal(StrResult[a].BeginingBal);
                                //        strTotalCurF = strTotalCurF + Convert.ToDecimal(StrResult[a].Currentactivity);
                                //        strTotalEndF = strTotalEndF + Convert.ToDecimal(StrResult[a].AccountBal);
                                //    }
                                //}

                                ojbSB.Append("<tr style=\"background-Color:#FFF;height: 30px;\">");
                                ojbSB.Append("<td colspan=\"2\" style=\"color: white;\">.</td>");
                                ojbSB.Append("<td style=\"text-align:left;font-weight:bold;\">" + strPreType + "  Total" + "</td>");
                                ojbSB.Append("<td style=\"border-top: 3px solid black;text-align: right; font-weight:bold;\">$" + Convert.ToDecimal(TBSummary[strPreType + "_B"]).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td style=\"border-top: 3px solid black;text-align: right; font-weight:bold;\">$" + Convert.ToDecimal(TBSummary[strPreType + "_C"]).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td style=\"border-top: 3px solid black;text-align: right; font-weight:bold;padding-right: 50px;\">$" + Convert.ToDecimal(TBSummary[strPreType + "_B"] + TBSummary[strPreType + "_C"]).ToString("#,##0.00") + "</td></tr>");
                            }
                        }

                        if (z == 0)
                        {
                            ojbSB.Append("<tr style=\"background-Color:#A4DEF9;height: 30px;\">");
                            ojbSB.Append("<th  colspan=\"2\" style=\"text-align: left; border-bottom-width: 2px;border-bottom: 3px solid black;\">" + StrResult[z].Type + "</th>");
                            ojbSB.Append("<th colspan=\"4\" style=\"padding:5px 10px; font-size:10px; text-align:right;border-bottom-width: 2px;border-bottom: 3px solid black;\"></th></tr>");
                            StrDescParent = StrResult[z].Description;

                        }
                        else
                        {
                            if (strPreType != StrResult[z].Type)
                            {
                                ojbSB.Append("<tr style=\"border-top: 3px solid black; background-Color:#A4DEF9;height: 30px;\">");
                                ojbSB.Append("<th colspan=\"2\" style=\"text-align: left; padding:5px 10px; width:20px;border-bottom-width: 2px;border-bottom: 3px solid black;\">" + StrResult[z].Type + "</th>");
                                ojbSB.Append("<th colspan=\"4\" style=\"padding:5px 10px; font-size:10px; text-align:right;border-bottom-width: 2px;border-bottom: 3px solid black;\"></th></tr>");
                                StrDescParent = StrResult[z].Description;
                            }
                        }

                        if (z != 0)
                        {
                            if (StrResult[z].Parent == "All Expenses")
                            {
                                ojbSB.Append("<tr style=\"background-Color:#FFFAE3;height: 30px;\"><td colspan=\"6\" >" + StrResult[z].Parent + "</td></tr>");
                                strTotalBal = 0; strTotalCur = 0; strTotalEnd = 0;
                            }
                            else
                            {
                                if (strPreAccount != StrResult[z].Parent)
                                    strTotalBal = 0; strTotalCur = 0; strTotalEnd = 0;
                            }
                        }

                        if (StrResult[z].Parent != "All Expenses")
                        {
                            if (StrResult[z].Child == "" && StrResult[z].Posting == false)
                            {
                                ojbSB.Append("<tr style=\"background-Color:#FFFAE3;height: 30px;\"><td colspan=\"2\" style=\"font-weight:bold;\">" + StrResult[z].Parent + " - " + StrResult[z].Description + "</td><td colspan=\"4\"></td></tr>");
                            }
                            else if (StrResult[z].Child == "" && StrResult[z].Posting == true)
                            {
                                ojbSB.Append("<tr style=\"background-Color:#FFFAE3;height: 30px;\">");
                                ojbSB.Append("<td colspan=\"3\"  style=\"  font-weight:bold;\">" + StrResult[z].Parent + "-" + StrResult[z].Description + "</td>");
                                ojbSB.Append("<td style=\"font-weight:bold;text-align:right;\">$" + Convert.ToDecimal(StrResult[z].BeginingBal).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;text-align:right;\">$" + Convert.ToDecimal(StrResult[z].Currentactivity).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;text-align:right;\">$" + Convert.ToDecimal(StrResult[z].AccountBal).ToString("#,##0.00") + "</td></tr>");
                            }

                            else if (StrResult[z].Child != "" && StrResult[z].Posting == true)
                            {
                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\"2\" >" + StrResult[z].Child + "</td>");
                                ojbSB.Append("<td >" + StrResult[z].Description + "</td>");
                                ojbSB.Append("<td style=\"  text-align:right;\">$" + Convert.ToDecimal(StrResult[z].BeginingBal).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td  style=\"   text-align:right;\">$" + Convert.ToDecimal(StrResult[z].Currentactivity).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td   style=\"   text-align:right;padding-right: 50px;\">$" + Convert.ToDecimal(StrResult[z].AccountBal).ToString("#,##0.00") + "</td></tr>");


                            }
                        }

                        strPreType = StrResult[z].Type;
                        strPreAccount = StrResult[z].Parent;
                        strPreDescription = StrResult[z].Description;

                        strTotalBal = strTotalBal + Convert.ToDecimal(StrResult[z].BeginingBal);
                        strTotalCur = strTotalCur + Convert.ToDecimal(StrResult[z].Currentactivity);
                        strTotalEnd = strTotalEnd + Convert.ToDecimal(StrResult[z].AccountBal);
                        if (z == StrResult.Count - 1)
                        {
                            ojbSB.Append("<tr style=\"background-Color:#FFF; height: 30px;\">");
                            ojbSB.Append("<td colspan=\"2\" style=\"color: white;\">.</td>");
                            ojbSB.Append("<td  style=\"text-align:left;font-weight:bold;\">" + StrResult[z].Description + "  Total" + "</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;\">$" + Convert.ToDecimal(strTotalBal).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;\">$" + Convert.ToDecimal(strTotalCur).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;padding-right: 50px;\">$" + Convert.ToDecimal(strTotalEnd).ToString("#,##0.00") + "</td></tr>");

                            ojbSB.Append("<tr style=\"background-Color:#FFF; height: 30px;\">");
                            ojbSB.Append("<td colspan=\"2\" style=\"color: white;\">.</td>");
                            ojbSB.Append("<td  style=\"text-align:left;font-weight:bold;\">Expense Total</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;\">$" + Convert.ToDecimal(strTotalBal).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;\">$" + Convert.ToDecimal(strTotalCur).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;padding-right: 50px;\">$" + Convert.ToDecimal(strTotalEnd).ToString("#,##0.00") + "</td></tr>");


                            //strTotalBalF = 0;
                            //strTotalCurF = 0;
                            //strTotalEndF = 0;
                            //for (int a = 0; a < StrResult.Count; a++)
                            //{

                            //    strTotalBalF = strTotalBalF + Convert.ToDecimal(StrResult[a].BeginingBal);
                            //    strTotalCurF = strTotalCurF + Convert.ToDecimal(StrResult[a].Currentactivity);
                            //    strTotalEndF = strTotalEndF + Convert.ToDecimal(StrResult[a].AccountBal);

                            //}

                            ojbSB.Append("<tr style=\"background-Color:#FFF;height: 30px;\">");
                            ojbSB.Append("<td colspan=\"2\" style=\"color: white;\">.</td>");
                            ojbSB.Append("<td style=\"text-align:left;font-weight:bold;\">Report Total</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;\">$" + Convert.ToDecimal(TBSummary["Total_B"]).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;\">$" + Convert.ToDecimal(TBSummary["Total_C"]).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"text-align:right; border-top: 3px solid black;font-weight:bold;padding-right: 50px;\">$" + Convert.ToDecimal(strTotalEndF).ToString("#,##0.00") + "</td></tr>");
                        }
                    }


                    ojbSB.Append("</thead></table></body></html>");
                    #endregion FirstPage
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();

                    //string stest = ojbSB.ToString();
                    //PDFCreation BusinessContext1 = new PDFCreation();
                    //DateTime CurrentDate1 = DateTime.Now;
                    //string ReturnName1 = "TrialBalance" + (CurrentDate1.ToShortTimeString().Replace(":", "_").Replace(" ", "_"));
                    //var ResponseResult = BusinessContext1.ReportPDFGenerateFolder("Reports/TrialBalance", ReturnName1, "TrialBalance", stest.Replace("&", "&#38;"));
                    //string[] strResultResponse = ResponseResult.Split('/');
                    //string strRes = strResultResponse[2];
                    //return strRes;
                }
                catch (Exception ex)
                {
                    return "Exception:" + ex.Message;
                }
            }
            else
            {
                return "";
            }
        }

        //===============GetAllUSers====================//

        [Route("GEtAllUserInfo")]
        [HttpGet, HttpPost]
        public List<GEtAllUserInfo_Result> GEtAllUserInfo(int ProdId)
        {
            ReportsBussiness BusinessContext = new ReportsBussiness();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GEtAllUserInfo(ProdId);
            }
            else
            {
                List<GEtAllUserInfo_Result> n = new List<GEtAllUserInfo_Result>();
                return n;
            }
        }
        //==================GetAllBatchNumbers=============//

        [Route("GetAllBatchNumber")]
        [HttpGet, HttpPost]
        public List<GetAllBatchNumber_Result> GetAllBatchNumber(int ProdId)
        {
            ReportsBussiness BusinessContext = new ReportsBussiness();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetAllBatchNumber(ProdId);
            }
            else
            {
                List<GetAllBatchNumber_Result> n = new List<GetAllBatchNumber_Result>();

                return n;
            }
        }

        //==================GetClosePeriodFor Bible===========//

        [Route("GetPeriodForBible")]
        [HttpGet, HttpPost]
        public List<GetPeriodForBible_Result> GetPeriodForBible(int CompanyId)
        {
            ReportsBussiness BusinessContext = new ReportsBussiness();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPeriodForBible(CompanyId);
            }
            else
            {
                List<GetPeriodForBible_Result> n = new List<GetPeriodForBible_Result>();
                return n;
            }
        }
        //============================ PO Listing ========================/////////
        [Route("POListingReports")]
        [HttpPost]
        public string POListingReports(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    POListingReport PO = JsonConvert.DeserializeObject<POListingReport>(Convert.ToString(Payload["PO"]));
                    int strTdCount = 0;
                    var srtRD = PO.ObjRD;
                    //var srtPO = PO.objPO; // Filters
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        var POListingExportJSONResult = BusinessContext.ReportsPOListingExportJSON(callParameters);
                        return ReportEngineController.MakeJSONExport(POListingExportJSONResult);
                    }

                    string ReportTitle = "Purchase Order Audit by Transaction";
                    List<ReportsPOListingExportJSON_Result> strResult = BusinessContext.ReportsPOListingExportJSON(callParameters); //BusinessContext.ReportsPOListing(callParameters);
                    StringBuilder ojbSB = new StringBuilder();

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string Pritingtdate = Payload.ReportDate.ToString();
                    var CompanyName = BusinessContext.GetCompanyNameByID(1);
                    if (strResult.Count == 0)
                    {
                        return "";
                    }
                    else
                    {
                        #region FirstPage
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body  style='width: 10.5in;'>");
                        ojbSB.Append("<table border=0 style='width: 100%; float: left; repeat-header: yes; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th>");
                        ojbSB.Append("<table border=0 style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th width='20%' style='vertical-align:top; align:left;'>");
                        ojbSB.Append("<table border=0 width='100%'>");
                        ojbSB.Append("<tr  style='font-size: 12px;'><td style='padding: 0px;  float: left;'>Company</td><td>" + CompanyName[0].CompanyCode + "</td></tr>");
                        ojbSB.Append("<tr  style='font-size: 12px;'><td style='padding: 0px;  float: left;'>Location</td><td>" + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO)) + "</td></tr>");
                        string CheckEpisode = Convert.ToString(PO.ObjRD.Segment);
                        if (CheckEpisode.IndexOf("EP") != -1)
                            ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Episode</td><td>" + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px;  float: left;'>Batch </td><td>" + (string.Join(",", Payload.BatchNumber) == "" ? "ALL" : string.Join(",", Payload.BatchNumber)) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Vendor </td><td>" + ((Payload.VendorFrom.ToString() + Payload.VendorTo.ToString()) == "" ? "ALL" : (Payload.VendorFrom.ToString() + " to " + Payload.VendorTo.ToString())) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>PO Status</td><td>" + (Payload.POFilterStatus.ToString() == "" ? "ALL" : Payload.POFilterStatus.ToString()) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Period </td><td>" + ((Payload.fieldsetPeriod.PeriodFrom.ToString() + Payload.fieldsetPeriod.PeriodTo.ToString()) == "" ? "ALL" : Payload.fieldsetPeriod.PeriodFrom.ToString() + " to " + Payload.fieldsetPeriod.PeriodTo.ToString()) + "</td></tr>");
                        ojbSB.Append("<td>" + Payload["POFilterReportDate"] + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        /// Cendter Part of Logo
                        ojbSB.Append("<th width='60%' style='vertical-align:top;'>");
                        ojbSB.Append("<table border=0 width='100%' style='margin:auto; width=50%'>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>&nbsp;</th></tr>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>" + Payload.ProductionName.ToString() + "</th></tr>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 17px; text-align: center;'></th></tr>");
                        ojbSB.Append($"<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>{ReportTitle}</th></tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        /// Cendter Part of Logo End
                        string PONumberFromTo = ((Payload.fieldsetTransactionIDs.PONoFrom.ToString() + Payload.fieldsetTransactionIDs.PONoTo.ToString()) == "") ? "ALL" : Payload.fieldsetTransactionIDs.PONoFrom.ToString() + " to " + Payload.fieldsetTransactionIDs.PONoTo.ToString();
                        string DateFromTo = ((Payload.fieldsetPeriod.DocumentDateFrom.ToString() + Payload.fieldsetPeriod.DocumentDateTo.ToString()) == "") ? "ALL" : Payload.fieldsetPeriod.DocumentDateFrom.ToString() + " to " + Payload.fieldsetPeriod.DocumentDateTo.ToString();
                        ojbSB.Append("<th width='20%' style='vertical-align:top; align:left;'>");
                        ojbSB.Append("<table border=0 width='100%'>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>&nbsp;</td><td>&nbsp;</td></tr>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>PO Number</td><td>{PONumberFromTo}</td></tr>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>PO Date</td><td>{DateFromTo}</td></tr>");
                        string CurrencyFilter = (Payload.fieldsetCurrency.CurrencyFilter.ToString() == "") ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                        string CurrencyReport = Payload.fieldsetCurrency.CurrencyReport.ToString();
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Filter Currency</td><td>{CurrencyFilter}</td></tr>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Report Currency</td><td>{CurrencyReport}</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Report Date</td><td>" + Pritingtdate + "</td></tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");

                        // Header End here 
                        #endregion FirstPage
                        #region second page
                        ojbSB.Append("<table style=\"width:10.5in; border-collapse:collapse;border:1px solid #ccc;font-size:10px;repeat-header: yes;\"><thead>");
                        ojbSB.Append("<tr style=\"background-color:#A4DEF9; border:1px solid black; font-size:12px;\">");

                        int strHeaderCount = 7;
                        int strDetailPosition = 0;

                        string strSegment = srtRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strSegment1.Length - 1);
                        for (int z = 0; z < strSegment1.Length; z++)
                        {
                            if (strSClassification1[z] == "Company")
                            {
                            }
                            else if (strSClassification1[z] == "Detail")
                            {
                                strHeaderCount++;
                                strDetailPosition = z;
                                ojbSB.Append("<th style=\"text-align:left\">Account</th>");
                            }
                            else
                            {
                                strHeaderCount++;
                                ojbSB.Append("<th style=\"text-align:left\">" + strSegment1[z] + " </th>");

                            }

                        }
                        var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strOptionalSegment.Length);

                        for (int z = 0; z < strOptionalSegment.Length; z++)
                        {
                            strHeaderCount++;
                            ojbSB.Append("<th style=\"text-align:left\">" + strOptionalSegment[z] + "</th>");
                        }

                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1.Length);

                        for (int z = 0; z < TransCode1.Length; z++)
                        {
                            strHeaderCount++;
                            ojbSB.Append("<th style=\"text-align:left;\">" + TransCode1[z] + " </th>");

                        }
                        ojbSB.Append("<th style=\"text-align:left\" colspan=\"5\">Line Item Description</th>");
                        ojbSB.Append("<th style=\"text-align:left\"> 1099 </th>");
                        ojbSB.Append("<th style=\"text-align:left\">Amount</th></tr></thead>");

                        if (strResult.Count > 0)
                        {
                            int PreviousPOID = strResult[0].POID;
                            decimal? PreviousBalanceAmount = strResult[0].BalanceAmount;

                            for (int a = 0; a < strResult.Count; a++)
                            {
                                GetPODetail_Result strResultPO = new GetPODetail_Result(strResult[a]);
                                GetPOLines_Result strResultPOLine = new GetPOLines_Result(strResult[a]);

                                if (a == 0 || PreviousPOID != strResult[a].POID)
                                {
                                    if (a != 0)
                                    {
                                        ojbSB.Append("<tr ><td colspan=\"" + Convert.ToInt32(strHeaderCount - 2) + "\" style=\" font-weight: bold;\"></td>");
                                        ojbSB.Append("<td style=\"font-weight:bold;\">PO Line Total</td>");
                                        ojbSB.Append("<td style=\"border-top:1px solid black;\">$" + Convert.ToDecimal(PreviousBalanceAmount).ToString("#,##0.00") + "</td></tr>");
                                        ojbSB.Append("<tr style=\"background:#FFFAE3;\"><td colspan=\"" + Convert.ToInt32(strHeaderCount) + "\" style=\" font-size: 14px; text-align: left; font-weight: bold; width: 100px;border-bottom-width: 1px;border-bottom: 2px solid black;\"></td></tr>");
                                        ojbSB.Append("</tbody>");

                                        PreviousBalanceAmount = strResult[a].BalanceAmount;
                                    }
                                    PreviousPOID = strResult[a].POID;
                                    strResultPO.BatchNumber = strResult[a].BatchNumber;
                                    POInvoiceBussiness POBussiness = new POInvoiceBussiness();
                                    //OBSOLETE//var strResultPO = POBussiness.GetPODetail(strResult[a].POID);
                                    //OBSOLETE//var strResultPOLine = POBussiness.GetPOLines(strResult[a].POID, (int)Payload["ProdID"]);
                                    //if (strResultPOLine.Count == 0) { continue; }
                                    ojbSB.Append("<tbody>");
                                    ojbSB.Append("<tr style=\"background:#FFFAE3;\">");
                                    ojbSB.Append("<td style=\"font-weight:bold;\">Batch</td>");
                                    ojbSB.Append("<td colspan=\"2\">" + strResultPO.BatchNumber + " </td>");
                                    ojbSB.Append("<td  style=\"font-weight:bold;\">Vendor info</td>");
                                    if (strResultPO.VendorName == "")
                                    {
                                        ojbSB.Append("<td colspan=\"" + Convert.ToInt32(strHeaderCount - 6) + "\">" + strResultPO.tblVendorName + "</td>"); // colspan=\"" + Convert.ToInt32(strHeaderCount -5) + "\"
                                    }
                                    else
                                    {
                                        ojbSB.Append("<td colspan=\"" + Convert.ToInt32(strHeaderCount - 6) + "\">" + strResultPO.VendorName + "</td>"); // colspan=\"" + Convert.ToInt32(strHeaderCount -5) + "\"
                                    }
                                    ojbSB.Append("<td style=\"font-weight:bold;\">PO Number</td>");
                                    ojbSB.Append("<td >" + strResultPO.PONumber + "</td>");
                                    ojbSB.Append("</tr>");
                                    ojbSB.Append("<tr style=\"background:#FFFAE3;\">");
                                    ojbSB.Append("<td style=\"font-weight: bold;\">Ledger Period:</td>");
                                    ojbSB.Append("<td colspan=\"2\">" + strResultPO.CompanyPeriod + "</td>");
                                    ojbSB.Append("<td colspan=\"" + Convert.ToInt32(strHeaderCount - 5) + "\"></td>");
                                    ojbSB.Append("<td  style=\"font-weight:bold;\">PO Date</td>");
                                    ojbSB.Append("<td >" + Convert.ToDateTime(strResultPO.PODate).ToString("MM/dd/yyyy") + "</td>");
                                    ojbSB.Append("</tr>");
                                    ojbSB.Append("<tr style=\"background:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=\"" + Convert.ToInt32(strHeaderCount - 2) + "\" style=\"font-weight: bold;\"></td>");
                                    ojbSB.Append("<td  style=\"font-weight:bold;\">PO Description</td>");
                                    ojbSB.Append("<td >" + strResultPO.Description + "</td></tr>");
                                    ojbSB.Append("<tr style=\"background:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=\"" + Convert.ToInt32(strHeaderCount - 2) + "\" style=\"font-weight:bold;\"></td>");
                                    ojbSB.Append("<td   style=\"font-weight:bold;\"> PO Open Amount</td>");
                                    ojbSB.Append("<td>$" + Convert.ToDecimal(strResultPO.BalanceAmount).ToString("#,##0.00") + "</td>");
                                    ojbSB.Append("</tr>");

                                    ojbSB.Append("<tr style=\"background:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=\"" + Convert.ToInt32(strHeaderCount - 2) + "\" style=\"border-bottom:1px solid black;\"></td>");
                                    ojbSB.Append("<td  style=\"font-weight:bold;padding-bottom:4px;\"> PO Status</td>");
                                    ojbSB.Append($"<td style='padding-bottom:4px;'>{strResult[a].POStatus}</td>");
                                    ojbSB.Append("</tr>");

                                    ojbSB.Append("<tr style=\"background:#FFFAE3;\"><td colspan=\"" + Convert.ToInt32(strHeaderCount) + "\" style=\" font-size:14px;text-align:left; font-weight:bold; width:100px;\"></td></tr>");
                                    ojbSB.Append("<tr style=\"background:#FFFAE3;\"><td colspan=\"" + Convert.ToInt32(strHeaderCount) + "\" style=\" font-size:14px;text-align:left; font-weight:bold; width:100px;border-bottom-width:1px;border-bottom:1px solid black;\"></td></tr>");

                                }

                                //for (int b = 0; b < strResultPOLine.Count; b++)
                                //{
                                    var CoaCode = strResultPOLine.line.COAString;
                                    var straa = CoaCode.Split('|');
                                    ojbSB.Append("<tr>");
                                    for (int k = 0; k < straa.Length; k++)
                                    {
                                        if (k == 0)
                                        { }
                                        else
                                        {
                                            if (strDetailPosition == k)
                                            {
                                                string strCOADetail = straa[k];
                                                string[] strDetail = strCOADetail.Split('>');
                                                if (strDetail.Length == 1)
                                                {
                                                    ojbSB.Append("<td style=\"border-bottom:1px solid black;\">" + strDetail[0] + "</td>");
                                                }
                                                else
                                                {
                                                    ojbSB.Append("<td style=\"border-bottom:1px solid black;\">" + strDetail[strDetail.Length - 1] + "</td>");
                                                }
                                            }
                                            else
                                            {
                                                ojbSB.Append("<td style=\"border-bottom:1px solid black;\">" + straa[k] + "</td>");
                                            }
                                        }
                                    }

                                    var strSegmentOptioanl = srtRD.SegmentOptional;
                                    var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                                    for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                                    {
                                        if (k == 0)
                                        {
                                            ojbSB.Append("<td style=\"border-bottom:1px solid black;\">" + strResultPOLine.line.SetCode + "</td>");
                                        }
                                        if (k == 1)
                                        {
                                            ojbSB.Append("<td style=\"border-bottom:1px solid black;\">" + strResultPOLine.line.SeriesCode + "</td>");
                                        }
                                    }

                                    string strTransString = strResultPOLine.line.TransStr;
                                    string[] strTransString1 = strTransString.Split(',');
                                    int strTrvalCount = strTransString1.Length;
                                    string strMemoCodesHTML = ReportEngineController.MakeMemoCodesHTML(TransCode.Split(','), strTransString, "border-bottom:1px solid black;");
                                    ojbSB.Append(strMemoCodesHTML);
                                    ojbSB.Append("<td colspan=\"6\" style=\"border-bottom:1px solid black;\">" + strResultPOLine.line.LineDescription + "</td>");
                                    ojbSB.Append("<td style=\"border-bottom:1px solid black;\">$" + Convert.ToDecimal(strResultPOLine.line.Amount_POL).ToString("#,##0.00") + "</td></tr>");
                                //}

                                //ojbSB.Append("<tr ><td colspan=\"" + Convert.ToInt32(strHeaderCount - 2) + "\" style=\" font-weight: bold;\"></td>");
                                //ojbSB.Append("<td style=\"font-weight:bold;\">PO Line Total</td>");
                                //ojbSB.Append("<td style=\"border-top:1px solid black;\">$" + Convert.ToDecimal(strResultPO.BalanceAmount).ToString("#,##0.00") + "</td></tr>");
                                //ojbSB.Append("<tr style=\"background:#FFFAE3;\"><td colspan=\"" + Convert.ToInt32(strHeaderCount) + "\" style=\" font-size: 14px; text-align: left; font-weight: bold; width: 100px;border-bottom-width: 1px;border-bottom: 2px solid black;\"></td></tr>");
                                //ojbSB.Append("</tbody>");
                            }
                        }

                        ojbSB.Append("</table></body></html>");
                        #endregion FirstPage
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }
        //=================Bible ===================//

        [Route("LedgerBible")]
        [HttpPost]
        public string LedgerBible(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    BibleReport BR = JsonConvert.DeserializeObject<BibleReport>(Convert.ToString(Payload["Bible"]));
                    int strTdCount = 0;
                    var srtRD = BR.ObjRD;
                    var srtBR = BR.objLBible;


                    string PFrom = "ALL";
                    string PTO = "ALL";
                    if (srtBR.PeriodIdfrom != 0)
                    {
                        PFrom = Convert.ToString(srtBR.PeriodIdfrom);
                    }

                    if (srtBR.PeriodIdTo != 0)
                    {
                        PTO = Convert.ToString(srtBR.PeriodIdTo);
                    }

                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var strResult = BusinessContext.ReportsLedgerBibleJSON(callParameters);
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        return ReportEngineController.MakeJSONExport(strResult);
                    }
                    var CompanyName = BusinessContext.GetCompanyNameByID(srtBR.Companyid);



                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();

                    double GrandTotal = 0;

                    if (strResult.Count == 0)
                    {
                        return "";
                    }
                    else
                    {
                        int headerSpanCnt = 11;
                        string ReportTitle = "General Ledger Bible";
                        string strSegmentQ = srtRD.Segment;
                        string[] strSegment1Q = strSegmentQ.Split(',');
                        string strSClassificationQ = srtRD.SClassification;
                        string[] strSClassification1Q = strSClassificationQ.Split(',');

                        for (int a = 0; a < strSegment1Q.Length; a++)
                        {
                            if (strSClassification1Q[a] == "Detail")
                            {
                                headerSpanCnt++;
                            }
                            else
                            {
                                headerSpanCnt++;
                            }
                        }

                        var strOptionalSegmentQ = srtRD.SegmentOptional.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strOptionalSegmentQ.Length);

                        for (int a = 0; a < strOptionalSegmentQ.Length; a++)
                        {
                            headerSpanCnt++;
                        }

                        string TransCodeQ = srtRD.TransCode;
                        string[] TransCode1Q = TransCodeQ.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1Q.Length);
                        ReportP1Business BusinessContext4 = new ReportP1Business();
                        string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(BR.ObjRD.UserName));

                        for (int a = 0; a < TransCode1Q.Length; a++)
                        {
                            headerSpanCnt++;
                        }
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title>General Ledger Bible</title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table border=0 style='width: 10.5in; border-collapse: collapse; repeat-header: yes;'>");

                        #region header
                        string CurrencyFilter = (Payload.fieldsetCurrency.CurrencyFilter.ToString() == "") ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr><th colspan='" + headerSpanCnt + "'>");
                        ojbSB.Append("<table style='width: 10.5in; border-collapse: collapse;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: left'>Company Code : " + CompanyName[0].CompanyCode + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + srtRD.ProductionName + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: right'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: left'>Location(s) : " + (srtBR.LO == "" ? "ALL" : srtBR.LO) + "</th>");
                        ojbSB.Append($"<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>{ReportTitle}</th>");
                        ojbSB.Append($"<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: right'>{"Filter Currency : " + CurrencyFilter}</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: left'>Period No From : " + PFrom + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; color: white;'>nbsp;</th>");
                        ojbSB.Append($"<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: right'>{"Report Currency : " + Payload.fieldsetCurrency.CurrencyReport.ToString()}</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: left'>Period No To : " + PTO + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: right'>Printed on : " + Payload.BiblePeportDate.ToString() + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        #endregion header

                        #region detaildatalistheader
                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");

                        int strDetailPosition = 0;
                        string strSegment = srtRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');

                        int HeadSpan1 = 0;
                        strTdCount = strTdCount + Convert.ToInt32(strSegment1.Length - 1);
                        int ColNo = 10;
                        ojbSB.Append("<th style=\"width:50px; padding: 1px 1px;font-size: 10px;border-bottom-width:1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 0px;border-top: 1px solid black;\">Account</th>");
                        for (int a = 0; a < strSegment1.Length; a++)
                        {

                            if (strSClassification1[a] == "Company")
                            {
                            }
                            else if (strSClassification1[a] == "Detail")
                            {
                                ColNo++;
                                strDetailPosition = a;
                            }
                            else
                            {
                                ColNo++;
                                ojbSB.Append("<th style=\"width:30px; padding: 1px 1px;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">" + strSegment1[a] + " </th>");
                            }
                        }

                        // ojbSB.Append("<th style=\"padding:5px 10px; font-size:10px text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\"></th>");
                        if (srtRD.SegmentOptional != "")
                        {
                            var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                            strTdCount = strTdCount + Convert.ToInt32(strOptionalSegment.Length);

                            for (int a = 0; a < strOptionalSegment.Length; a++)
                            {
                                ColNo++;
                                ojbSB.Append("<th style=\"width:20px; border-bottom-width: 1px;font-size: 10px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">" + strOptionalSegment[a] + "</th>");
                            }
                        }

                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1.Length);
                        for (int a = 0; a < TransCode1.Length; a++)
                        {
                            ColNo++;
                            ojbSB.Append("<th style=\"width:20px; text-align:left;border-bottom-width: 1px;font-size: 10px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">" + TransCode1[a] + " </th>");
                        }

                        //  ojbSB.Append("<th style=\"padding:5px 10px; font-size:10px text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Ins </th>");
                        //ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"></th>");

                        ojbSB.Append("<th style=\"width:100px; text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">Line Item Description</th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Vendor Name </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Trans# </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Doc Date </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> TT </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Cur. </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Per. </th>");
                        ojbSB.Append("<th style=\"width:80px; text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Document# </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Posted Date </th>");
                        //ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> PO# </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Payment# </th>");
                        ojbSB.Append("<th style=\"text-align:right;font-size: 10px;padding: 1px 1px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">Amount</th></tr>");
                        ojbSB.Append("</thead>");
                        #endregion detaildatalistheader
                        ojbSB.Append("<tbody>");

                        #region detailbody
                        string strPreAcct = "";
                        for (int z = 0; z < strResult.Count; z++)
                        {
                            string strType = strResult[z].AcctDescription;

                            #region detailbodyaccountheader
                            if (z == 0)
                            {
                                int HeadSpan = ColNo - 5;
                                HeadSpan1 = HeadSpan;
                                ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                ojbSB.Append("<td colspan=" + HeadSpan + " style=\"font-size: 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;font-weight:bold;padding: 1px 1px;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                ojbSB.Append("<td colspan=\"5\" style=\"font-size: 10px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align:left;font-weight:bold;padding: 1px 1px;\">Begining Balance:</td>");
                                ojbSB.Append("<td  style=\"font-size: 10px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;padding: 1px 1px;\">$" +
                                    (Convert.ToDecimal(strResult[z].BeginingBal) >= 0
                                    ? Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00")
                                    : (Convert.ToDecimal(strResult[z].BeginingBal) * -1).ToString("#,##0.00"))
                                    + "</td>");
                                ojbSB.Append("</tr>");
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    decimal strAmount = 0;
                                    for (int zz = 0; zz < strResult.Count; zz++)
                                    {
                                        if (strPreAcct == strResult[zz].Acct)
                                            strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                    }
                                    ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                    ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 4) + " \"></td>");
                                    ojbSB.Append("<td colspan=\"4\" style=\"font-weight:bold;font-size: 10px;\">Total For Account:</td>");
                                    ojbSB.Append("<td  style=\"font-size: 10px;padding: 1px 1px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;float:right;\">$" + (Convert.ToDecimal(strAmount) >= 0 ? Convert.ToDecimal(strAmount).ToString("#,##0.00") : (Convert.ToDecimal(strAmount) * -1).ToString("#,##0.00")) + "</td>");
                                    ojbSB.Append("</tr>");
                                    ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                    ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 4) + " \"></td>");
                                    ojbSB.Append("<td colspan=\"4\" style=\"font-weight:bold;font-size: 10px;\">Ending Balance:</td>");
                                    if (Convert.ToDecimal(strAmount) >= 0)
                                    {
                                        GrandTotal += Convert.ToDouble(strAmount);
                                        ojbSB.Append("<td  style=\"padding: 1px 1px;font-size: 10px; border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                    }
                                    else
                                    {
                                        GrandTotal += Convert.ToDouble(strAmount);
                                        ojbSB.Append("<td  style=\"padding: 1px 1px;font-size: 10px; border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;float:right;\">-$" + (Convert.ToDecimal(strAmount) * -1).ToString("#,##0.00") + "</td>");
                                    }

                                    ojbSB.Append("</tr>");
                                }
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    int HeadSpan = ColNo - 5;
                                    ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=" + HeadSpan + " style=\"font-size: 10px;padding: 1px 1px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;font-weight:bold;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                    ojbSB.Append("<td colspan=\"5\" style=\"font-size: 10px;padding: 1px 1px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: left;font-weight:bold;\">Begining Balance:</td>");
                                    // ojbSB.Append("<td  style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px; text-align: center;font-weight:bold;float:right;\">$" + Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00") + "</td>");
                                    ojbSB.Append("<td  style=\"font-size: 10px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;padding: 1px 1px;\">$" +
                                        (Convert.ToDecimal(strResult[z].BeginingBal) >= 0
                                        ? Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00")
                                    : (Convert.ToDecimal(strResult[z].BeginingBal) * -1).ToString("#,##0.00"))
                                        + "</td>");

                                    ojbSB.Append("</tr>");
                                }
                            }
                            #endregion  detailbodyaccountheader
                            #region maindatalist
                            ojbSB.Append("<tr style=\"background-Color:#FFF; border-bottom-width: 0px;border-bottom: 1px solid black; height:18px;\">");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].Acct + "</td>");
                            var CoaCode = strResult[z].COAString;
                            var straa = CoaCode.Split('|');
                            //Boolean hasSet = false;
                            string theSET = "";
                            bool hasSet = (straa.Length > strSClassification1.Count() ? true : false);
                            //                            if (straa.Length > strSClassification1.Count()) { hasSet = true; }
                            int addedcolumns = 0;
                            for (int k = 0; k < straa.Length; k++)
                            {
                                if (k == 0)
                                { }
                                else
                                {
                                    if (strDetailPosition != k)
                                    {
                                        ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + straa[k] + "</td>");
                                        addedcolumns++;
                                    }
                                    if (k > strSClassification1.Count() - 1) { theSET = straa[k]; }
                                }
                            }
                            // ojbSB.Append("<td style=\"padding:5px 10px; font-size:10px text-align:left;\"></td>"); /// Account Description
                            var strSegmentOptioanl = srtRD.SegmentOptional;
                            var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                            for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                            {
                                if (k == 0 && (addedcolumns == 1))
                                {
                                    ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + theSET + "</td>"); /// set 
                                }
                                if (k == 1)
                                {
                                    ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\"></td>"); /// Series
                                }
                            }

                            string strTransString = strResult[z].TransactionCode;
                            string[] strTransString1 = strTransString.Split(',');
                            #region transactiondetailsFreeFields
                            string strMemoCodesHTML = ReportEngineController.MakeMemoCodesHTML(TransCode1, strTransString, "font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;");
                            ojbSB.Append(strMemoCodesHTML);
                            #endregion transactiondetailsFreeFields

                            int strTrvalCount = strTransString1.Length;
                            //ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\"></td>");

                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].LineDescription.Replace("<", "&lt;").Replace(">", "&gt;") + "</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].VendorName + "</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].TransactionNumber + "</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + Convert.ToDateTime(strResult[z].DocDate).ToString("MM/dd/yyyy") + "</td>"); //
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].Source + "</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">USD</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].ClosePeriod + "</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].DocumentNo + "</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + Convert.ToDateTime(strResult[z].PostedDate).ToString("MM/dd/yyyy") + "</td>"); //
                            //ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].PoNumber + "</td>");
                            ojbSB.Append("<td style=\"font-size: 10px;text-align: left;padding: -5px 0px -5px; vertical-align:top;\">" + strResult[z].CheckNumber + "</td>");
                            //  ojbSB.Append("<td style=\"text-align: center;float:right;\">$" + Convert.ToDecimal(strResult[z].Amount).ToString("#,##0.00") + "</td>");
                            if (Convert.ToDecimal(strResult[z].Amount) >= 0)
                            {
                                ojbSB.Append("<td  style=\"font-size: 10px;text-align: right;padding: -5px 0px -5px; vertical-align:top;float:right;\">$" + Convert.ToDecimal(strResult[z].Amount).ToString("#,##0.00") + "</td>");
                            }
                            else
                            {
                                ojbSB.Append("<td  style=\"font-size: 10px;text-align: right;padding: -5px 0px -5px; vertical-align:top;float:right;\">-$" + (Convert.ToDecimal(strResult[z].Amount) * -1).ToString("#,##0.00") + "</td>");
                            }

                            ojbSB.Append("</tr>");
                            #endregion maindatalist
                            strPreAcct = strResult[z].Acct;

                            if (z == strResult.Count - 1)
                            {
                                decimal strAmount = 0;
                                for (int zz = 0; zz < strResult.Count; zz++)
                                {
                                    if (strPreAcct == strResult[zz].Acct)
                                    {
                                        strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                    }
                                }

                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 4) + " \"></td>");
                                ojbSB.Append("<td colspan=\"4\" style=\"font-size: 10px;font-weight:bold;\">Total For Account:</td>");
                                ojbSB.Append("<td style=\"font-size: 10px;padding: 1px 7px;text-align: right;font-weight:bold;border-bottom: 1px solid black;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 4) + " \"></td>");
                                ojbSB.Append("<td colspan=\"4\" style=\"font-weight:bold;font-size: 10px;\">Ending Balance:</td>");
                                if (Convert.ToDecimal(strAmount) >= 0)
                                {
                                    GrandTotal += Convert.ToDouble(strAmount);
                                    ojbSB.Append("<td  style=\"font-size: 10px;padding: 1px 7px; border-top: 1px solid;height: 25px;text-align: right;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                }
                                else
                                {
                                    GrandTotal += Convert.ToDouble(strAmount);
                                    ojbSB.Append("<td  style=\"font-size: 10px;padding: 1px 7px; border-top: 1px solid;height: 25px;text-align: right;float:right;\">-$" + (Convert.ToDecimal(strAmount) * -1).ToString("#,##0.00") + "</td>");
                                }
                                ojbSB.Append("</tr>");
                            }
                        }

                        ojbSB.Append("<tr style=\"background-Color:#A4DEF9;\">");
                        ojbSB.Append("<td colspan=" + HeadSpan1 + " style=\"font-size: 10px;border-bottom-width:1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;;height: 25px;font-weight:bold;padding: 1px 7px;\"></td>");
                        ojbSB.Append("<td colspan=\"5\" style=\"font-size: 10px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;padding: 1px 7px;\">Grand Total :</td>");
                        String tmpGT = (Convert.ToDecimal(GrandTotal) >= 0 ? Convert.ToDecimal(GrandTotal).ToString("#,##0.00") : (Convert.ToDecimal(GrandTotal) * -1).ToString("#,##0.00"));
                        ojbSB.Append("<td  style=\"font-size: 10px !important;border-bottom: 1px solid !important;border-top: 1px solid !important;text-align: right !important;font-weight: bold !important;padding: 1px 7px !important;\">$" + tmpGT + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table>");
                        #endregion detailbody
                        ojbSB.Append("</body></html>");
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            {
                return "";
            }
        }

        //======================== VendorListing Report =====================//              
        [Route("VendorListing")]
        [HttpPost]
        public String GetReportVendorList(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    ReportsBussiness BusinessContext = new ReportsBussiness();

                    var result = BusinessContext.ReportsVendorListingReportJson(callParameters);
                    var StrCount = result.Count;
                    if (StrCount > 0)
                    {
                        var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                        ReportVendors RepVen = JsonConvert.DeserializeObject<ReportVendors>(Convert.ToString(Payload["VL"]));
                        var objRD = RepVen.objRD;
                        var objRDF = RepVen.objRDF;

                        ReportP1Business BusinessContext1 = new ReportP1Business();
                        string CurrentDate = BusinessContext1.UserSpecificTime(Convert.ToInt32(objRDF.ProdID));

                        List<string> fileNames = new List<string>();
                        StringBuilder objSBPath = new StringBuilder();
                        POInvoiceBussiness BC = new POInvoiceBussiness();
                        string strVendorFrom = objRDF.VendorFrom;
                        if (strVendorFrom == "")
                        {
                            strVendorFrom = "ALL";
                        }
                        else
                        {

                        }
                        string strVendorTo = objRDF.VendorTo;
                        if (strVendorTo == "")
                        {
                            strVendorTo = "ALL";
                        }
                        else
                        {

                        }
                        string strVendorCountry = objRDF.VendorCountry;
                        if (strVendorCountry == "")
                        {
                            strVendorCountry = "ALL";
                        }
                        else
                        {

                        }
                        String StrCompany = (objRDF.CompanyCode == null ? "" : objRDF.CompanyCode[0]);
                        if (StrCompany == "")
                        {
                            StrCompany = "ALL";
                        }
                        else
                        {

                        }
                        String FinalStrW9 = "";
                        if (objRDF.W9OnFile == true)
                        {
                            FinalStrW9 = "Y";
                        }
                        else
                        {
                            FinalStrW9 = "N";
                        }
                        string W9NotOnFile = "";
                        if (FinalStrW9 == "Y")
                        {
                            W9NotOnFile = "N";
                        }
                        else
                        {
                            W9NotOnFile = "Y";
                        }

                        for (int J = 0; J < result.Count; J++)
                        {
                            StringBuilder ojbSB = new StringBuilder();

                            ojbSB.Append("<html>");
                            ojbSB.Append("<head><title></title></head>");
                            ojbSB.Append("<body>");
                            ojbSB.Append("<table border=0 style='width: 10.5in; float: left;repeat-header: yes;border-spacing: 0;'>");
                            ojbSB.Append("<thead>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th colspan='6'>");

                            ojbSB.Append("<table border=0 style='width: 100%; float: left;'>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Name From: : " + strVendorFrom + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + objRD.ProductionName + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>W9 on File : " + FinalStrW9 + "</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Name To: : " + strVendorTo + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'> &nbsp;</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>W9 Not on File : " + W9NotOnFile + "</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Company Code :" + StrCompany + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; '>&nbsp;</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Country : " + strVendorCountry + "</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Report Sort : Vendor Name</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; '>&nbsp;</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Type: All</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>Vendor Listing Name Only</th>");
                            ojbSB.Append("<th style='padding: 0px 0; font-size: 12px; float: right; padding-bottom: 10px; text-align: right;'>Printed on : " + CurrentDate + "</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; '>&nbsp;</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'></th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("</table>");
                            ojbSB.Append("</th>");
                            ojbSB.Append("</tr>");

                            //ojbSB.Append("<tr>");
                            //ojbSB.Append("<th colspan='6'>");
                            //ojbSB.Append("<table style='width: 100%; float: left;'>");
                            //ojbSB.Append("<tr>");
                            //ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp;</th>");
                            //ojbSB.Append("</tr>");
                            //ojbSB.Append("</table>");
                            //ojbSB.Append("</th>");
                            //ojbSB.Append("</tr>");

                            ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 12px; text-align: left; border-top-width: 1px; border-top: 1px solid black;border-bottom-width: 1px; border-bottom: 1px solid black;'>Vendor Name</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 12px; text-align: left; border-top-width: 1px; border-top: 1px solid black;border-bottom-width: 1px; border-bottom: 1px solid black;'>Vendor Code</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 12px; text-align: left; border-top-width: 1px; border-top: 1px solid black;border-bottom-width: 1px; border-bottom: 1px solid black;'>Vendor Type</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 12px; text-align: left; border-top-width: 1px; border-top: 1px solid black;border-bottom-width: 1px; border-bottom: 1px solid black;'>Fed ID#</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 12px; text-align: left; border-top-width: 1px; border-top: 1px solid black;border-bottom-width: 1px; border-bottom: 1px solid black;'>W9 on file</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 12px; text-align: left; border-top-width: 1px; border-top: 1px solid black;border-bottom-width: 1px; border-bottom: 1px solid black;'>Enabled</th>");

                            ojbSB.Append("</tr>");

                            ojbSB.Append("</thead>");
                            ojbSB.Append("<tbody>");

                            for (int i = 0; i < result.Count; i++)
                            {
                                ojbSB.Append("<tr>");
                                ojbSB.Append("<td style=\" padding: 5px 10px; font-size: 12px;\">" + result[i].VendorName + "</td>");
                                ojbSB.Append("<td style=\" padding: 5px 10px; font-size: 12px;\">" + result[i].VendorNumber + "</td>");
                                ojbSB.Append("<td style=\" padding: 5px 10px; font-size: 12px;\">" + result[i].Type + "</td>");
                                ojbSB.Append("<td style=\" padding: 5px 10px; font-size: 12px;\">" + string.Concat("".PadLeft(12, '*'), result[i].TaxID.Substring(result[i].TaxID.Length < 4 ? 0 : result[i].TaxID.Length - 4)) + "</td>");
                                ojbSB.Append("<td style=\" padding: 5px 10px; font-size: 12px;\">" + result[i].TaxFormOnFile + "</td>");
                                ojbSB.Append("<td style=\" padding: 5px 10px; font-size: 12px;\">" + result[i].Status + "</td>");
                                ojbSB.Append("</tr>");
                            }
                            ojbSB.Append("</tbody>");
                            ojbSB.Append("</table></body></html>");

                            string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                            return jsonReturn.ToString();
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            {
                return "";
            }
            return "";
        }
        //======================== VendorFolder Report =====================//              
        //[Route("GetReportVendorFolder")]
        //[HttpPost]
        //public String GetReportVendorFolder(ReportVendors RepFol)
        //{
        //    if (this.Execute(this.CurrentUser.APITOKEN) == 0)
        //    {
        //        try
        //        {
        //            ReportsBussiness BusinessContext = new ReportsBussiness();
        //            var objRD = RepFol.objRD;
        //            var objRDF = RepFol.objRDF;
        //            var result = BusinessContext.GetReportVendorFolder(objRDF);

        //            ReportP1Business BusinessContext4 = new ReportP1Business();
        //            string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(objRDF.ProdID));

        //            List<string> fileNames = new List<string>();
        //            StringBuilder objSBPath = new StringBuilder();

        //            POInvoiceBussiness BC = new POInvoiceBussiness();
        //            var StrCount = result.Count;
        //            if (StrCount > 0)
        //            {
        //                for (int J = 0; J < result.Count; J++)
        //                {
        //                    StringBuilder ojbSB = new StringBuilder();
        //                    #region FirstPage
        //                    ojbSB.Append("<html>");

        //                    #endregion first
        //                    // Header End here 
        //                    #region second
        //                    ojbSB.Append("<table style=\"border: 1px solid #000; width:100%;font-size:12px; \">");
        //                    ojbSB.Append("<tbody>");


        //                    for (int i = 0; i < result.Count; )
        //                    {
        //                        ojbSB.Append("<tr style=\" height:20px;\">");


        //                        for (int xx = 0; xx < 2; xx++)
        //                        {
        //                            if (xx == 0 && i == result.Count - 1)
        //                            {

        //                                ojbSB.Append("<td style=\" width: 30%;    border: 1px solid #000; font-weight:bold;\">" + result[i].VendorName + "</td>");
        //                                ojbSB.Append("<td style=\" width: 10%;    border: 1px solid #000; font-weight:bold;\">(AP)</td>");
        //                                ojbSB.Append("<td style=\"  width: 20%;     \"></td>");

        //                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
        //                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
        //                                i++;
        //                                break;
        //                            }
        //                            else
        //                            {
        //                                if (xx == 0)
        //                                {
        //                                    ojbSB.Append("<td style=\"  width: 30%;      border: 1px solid #000; font-weight:bold;\">" + result[i].VendorName + "</td>");
        //                                    ojbSB.Append("<td style=\"  width: 10%;   border: 1px solid #000; font-weight:bold;\">(AP)</td>");
        //                                    ojbSB.Append("<td style=\"  width: 20%;     \"></td>");
        //                                    i++;
        //                                }
        //                                else
        //                                {
        //                                    ojbSB.Append("<td style=\"     float: right;width: 30%;   border: 1px solid #000; font-weight:bold;\">" + result[i].VendorName + "</td>");
        //                                    ojbSB.Append("<td style=\" width: 10%;     border: 1px solid #000; font-weight:bold;\">(AP)</td>");
        //                                    i++;
        //                                }
        //                            }

        //                        }
        //                        ojbSB.Append("</tr>");
        //                    }
        //                    ojbSB.Append("</tbody>");
        //                    ojbSB.Append("</table></html>");
        //                    #endregion FirstPage
        //                    string stest = ojbSB.ToString();
        //                    stest = stest.Replace("&", "&#38;");
        //                    PDFCreation BusinessContext1 = new PDFCreation();
        //                    DateTime CurrentDate1 = DateTime.Now;
        //                    string ReturnName1 = "VendorFolder" + (CurrentDate1.ToShortTimeString().Replace(":", "_").Replace(" ", "_"));
        //                    var ResponseResult = BusinessContext1.GeneratePDFReport("Reports/VendorFolder", ReturnName1, "VendorFolder", stest);
        //                    string[] strResultResponse = ResponseResult.Split('/');
        //                    string strRes = strResultResponse[2];
        //                    return strRes;
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }

        //    }
        //    else
        //    {
        //        return "";
        //    }
        //    return "";
        //}


        [Route("GetReportVendorFolder")]
        [HttpPost]
        public String GetReportVendorFolder(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    ReportVendors RepFol = JsonConvert.DeserializeObject<ReportVendors>(Convert.ToString(Payload["VenFol"]));

                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var objRD = RepFol.objRD;
                    var objRDF = RepFol.objRDF;
                    var result = BusinessContext.ReportsVendorFolderReportJSON(callParameters);

                    ReportP1Business BusinessContext4 = new ReportP1Business();
                    string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(objRDF.ProdID));

                    var StrCount = result.Count;
                    if (StrCount > 0)
                    {

                        StringBuilder ojbSB = new StringBuilder();

                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table style='width: 100%; font-size: 12px; border-collapse: collapse;'>");
                        ojbSB.Append("<tbody>");
                        ojbSB.Append("<tr><td colspan='2' style='float:left;color:white;'>abcd</td> </tr>");
                        ojbSB.Append("<tr><td colspan='2' style='float:left;color:white;'>abcd</td> </tr>");
                        ojbSB.Append("<tr><td colspan='2' style='float:left;color:white;'>abcd</td> </tr>");
                        ojbSB.Append("<tr><td colspan='2' style='float:left;color:white;'>abcd</td> </tr>");

                        int PageNo = 30;

                        for (int i = 0; i < result.Count;)
                        {
                            ojbSB.Append("<tr>");

                            for (int xx = 0; xx < 2; xx++)
                            {
                                if (xx == 1 && i == result.Count)
                                {
                                    ojbSB.Append("<td style='padding-left: 15px; width: 50%;'>");
                                    ojbSB.Append("<table style='width: 98%;'>");
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<td style='font-size: 12px; font-family: comberia; padding: 6px; padding-left: 20px; padding-bottom: 23px;color: white;'>BARCLAYS OVERSEAS EXCHANGE - AP</td>");
                                    ojbSB.Append("</tr>");
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<td style='font-size: 12px; font-family: comberia; padding-top: 10px; color: white;'>San Francisco,95098</td>");
                                    ojbSB.Append("</tr>");
                                    ojbSB.Append("</table>");
                                    ojbSB.Append("</td>");

                                }
                                else
                                {
                                    if (xx == 0)
                                    {
                                        ojbSB.Append("<td style='width: 50%;'>");
                                        ojbSB.Append("<table style='width: 93%;'>");
                                        ojbSB.Append("<tr>");
                                        ojbSB.Append("<td style='font-size: 12px; font-family: comberia; padding: 6px; padding-left: 40px; padding-bottom: 23px; vertical-align:middle;'>" + result[i].VendorName + " - AP</td>");
                                        ojbSB.Append("</tr>");

                                        if (result[i].VendorName.Length <= 54)
                                        {
                                            ojbSB.Append("<tr>");
                                            ojbSB.Append("<td style='font-size: 12px; font-family: comberia; padding-top: 10px; color: white;'>San Francisco,95098</td>");
                                            ojbSB.Append("</tr>");
                                        }


                                        ojbSB.Append("</table>");
                                        ojbSB.Append("</td>");
                                        i++;
                                    }
                                    else
                                    {

                                        ojbSB.Append("<td style='padding-left: 15px; width: 50%;'>");
                                        ojbSB.Append("<table style='width: 93%;'>");
                                        ojbSB.Append("<tr>");
                                        ojbSB.Append("<td style='font-size: 12px; font-family: comberia; padding: 6px; padding-left: 20px; padding-bottom: 23px;' vertical-align:middle;>" + result[i].VendorName + " - AP</td>");
                                        ojbSB.Append("</tr>");
                                        if (result[i].VendorName.Length <= 54)
                                        {
                                            ojbSB.Append("<tr>");
                                            ojbSB.Append("<td style='font-size: 12px; font-family: comberia; padding-top: 10px; color: white;'>San Francisco,95098</td>");
                                            ojbSB.Append("</tr>");
                                        }
                                        ojbSB.Append("</table>");
                                        ojbSB.Append("</td>");
                                        i++;
                                    }
                                }

                            }
                            ojbSB.Append("</tr>");

                            if (i == PageNo)
                            {
                                PageNo += 30;

                                ojbSB.Append("<tr><td colspan='2' style='padding-top:23px;float:left;color:white;'>abcd</td> </tr>");
                                ojbSB.Append("<tr><td colspan='2' style='float:left;color:white;'>abcd</td> </tr>");

                            }
                        }
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td colspan='2' style='color: white;'>hiiiiii</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</body>");
                        ojbSB.Append("</html>");
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            {
                return "";
            }
            return "";
        }


        //======================== Vendor Mailing Label Report =====================//   
        //[Route("GetVendorMailingLabels")]
        //[HttpPost]
        //public String GetVendorMailingLabels(ReportVendors VenMail)
        //{
        //    if (this.Execute(this.CurrentUser.APITOKEN) == 0)
        //    {
        //        try
        //        {
        //            ReportsBussiness BusinessContext = new ReportsBussiness();
        //            var objRD = VenMail.objRD;
        //            var objRDF = VenMail.objRDF;
        //            var result = BusinessContext.GetVendorMailingLabels(objRDF);

        //            ReportP1Business BusinessContext4 = new ReportP1Business();
        //            string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(objRDF.ProdID));
        //            List<string> fileNames = new List<string>();
        //            StringBuilder objSBPath = new StringBuilder();


        //            var StrCount = result.Count;
        //            if (StrCount > 0)
        //            {
        //                for (int J = 0; J < result.Count; J++)
        //                {
        //                    StringBuilder ojbSB = new StringBuilder();
        //                    #region first
        //                    ojbSB.Append("<html><head><title></title></head><body>");

        //                    #endregion first
        //                    // Header End here 
        //                    #region second
        //                    ojbSB.Append("<table style=\"width:100%;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\">");

        //                    ojbSB.Append("<tbody>");
        //                    int x = 1;
        //                    decimal CheckValue = result.Count;

        //                    decimal aa = CheckValue / 3;
        //                    decimal num = aa;
        //                    string str = num.ToString("0.00");

        //                    decimal ab = Convert.ToDecimal(str);
        //                    // string str1 = ab.ToString("N2");


        //                    //  double number = 10.20;
        //                    decimal str1 = (int)(((decimal)ab % 1) * 100);

        //                    // Console.Write("{0:00}", first2DecimalPlaces);


        //                    for (int i = 0; i < result.Count; i++)
        //                    {
        //                        if (x == 1)
        //                        {
        //                            ojbSB.Append("<tr style=\"height:20px;\">");
        //                            ojbSB.Append("<td style='padding-top: 15px;width:10px;'></td>");
        //                        }

        //                        ojbSB.Append("<td style='padding-top: 15px;width:33%;'>");
        //                        ojbSB.Append("<table style='width:96%;border-width: 1px; border: 1px solid black;'>");
        //                        ojbSB.Append("<tr><td style='font-size:12px;font-family:comberia;padding: 5px;'>");
        //                        ojbSB.Append(result[i].VendorName); ojbSB.Append("</td></tr>");
        //                        ojbSB.Append("<tr><td style='font-size:12px;font-family:comberia;padding: 5px;'>");
        //                        ojbSB.Append(result[i].RemitAddress1 + "," + result[i].RemitAddress2 + "," + result[i].RemitAddress3);
        //                        ojbSB.Append("</td></tr><tr><td style='font-size:12px;font-family:comberia;padding: 5px;'>");
        //                        ojbSB.Append(result[i].RemitCity + "," + result[i].RemitZip);
        //                        ojbSB.Append("</td></tr></table></td>");
        //                        x++;
        //                        if (x == 4)
        //                        {
        //                            ojbSB.Append("</tr>");
        //                            x = 1;
        //                        }
        //                    }

        //                    if (str1 == 0)
        //                    {

        //                    }
        //                    else if (str1 > 50)
        //                    {
        //                        ojbSB.Append("<td></td></tr>");
        //                    }
        //                    else
        //                    {
        //                        ojbSB.Append("<td colspan='2'></td></tr>");
        //                    }

        //                    ojbSB.Append("<tr><td colspan='4' style='color:white;'>hiiiiii</td></tr>");

        //                    ojbSB.Append("</tbody>");
        //                    ojbSB.Append("</table></body></html>");
        //                    #endregion FirstPage
        //                    string stest = ojbSB.ToString();

        //                    stest = stest.Replace("&", "&#38;");
        //                    PDFCreation BusinessContext1 = new PDFCreation();
        //                    DateTime CurrentDate1 = DateTime.Now;  //GeneratePDFReport
        //                    string ReturnName1 = "VendorMailing" + (CurrentDate1.ToShortTimeString().Replace(":", "_").Replace(" ", "_"));
        //                    var ResponseResult = BusinessContext1.GeneratePDFReport("Reports/VendorMailing", ReturnName1, "VendorMailing", stest);
        //                    // string[] strResultResponse = ResponseResult.Split('/');
        //                    //  string strRes = strResultResponse[2];
        //                    return ReturnName1 + ".pdf";
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }

        //    }
        //    else
        //    {
        //        return "";
        //    }
        //    return "";

        //}



        [Route("GetVendorMailingLabels")]
        [HttpPost]
        public String GetVendorMailingLabels(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                ReportVendors VenMail = JsonConvert.DeserializeObject<ReportVendors>(Convert.ToString(Payload["VenMail"]));
                try
                {
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var objRD = VenMail.objRD;
                    var objRDF = VenMail.objRDF;
                    var result = BusinessContext.ReportsVendorMailingReportJSON(callParameters);

                    ReportP1Business BusinessContext4 = new ReportP1Business();
                    string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(objRDF.ProdID));

                    if (result.Count == 0) { return ""; }
                    var StrCount = result.Count;
                    StringBuilder ojbSB = new StringBuilder();


                    ojbSB.Append("<html><head><title></title></head>");
                    ojbSB.Append("<body>");
                    // table for top margin spacing
                    ojbSB.Append("<table style='width:100%;'><tr><td style='height:0.35in; width=100%;'> </td></tr></table>");
                    ojbSB.Append("<table style='width: 100%;'>");

                    int x = 0;
                    int z = 0;
                    for (int i = 1; i < Convert.ToInt32(result.Count) + 1; i++)
                    {
                        z = i - 1;
                        if (i == 1 || (((i - 1) % 3) == 0))
                        {
                            ojbSB.Append("<tr>");
                        }
                        ojbSB.Append("<td style='font-size: 12px; font-family: sans-serif; width: 2.57in; height: 1in; margin: 0; vertical-align: top; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; padding: 0.05in; overflow: hidden;'>");
                        ojbSB.Append(result[z].VendorName + "<br/>");
                        string FullAdd = "";
                        FullAdd += (result[z].RemitAddress1 == "" ? "" : result[z].RemitAddress1);
                        FullAdd += (result[z].RemitAddress2 == "" ? "" : ", " + result[z].RemitAddress2);
                        FullAdd += (result[z].RemitAddress3 == "" ? "" : ", " + result[z].RemitAddress3);
                        ojbSB.Append(FullAdd + "<br/>");
                        ojbSB.Append(result[z].RemitCity + ", " + result[z].RemitState + " " + result[z].RemitZip);

                        ojbSB.Append("</td>	");
                        if ((i % 3) != 0)
                        {
                            ojbSB.Append("<td style='width: 0.12in;'> </td>");
                        }
                        else
                        {
                            ojbSB.Append("</tr>");
                        }
                        if (((i % 30) == 0)) // We're starting a new table
                        {
                            ojbSB.Append("</table>");
                            if ((i != Convert.ToInt32(result.Count)))
                            {
                                ojbSB.Append("<table style='width:100%;'><tr><td style='height:0.35in; width=100%;'> </td></tr></table>");
                                ojbSB.Append("<table style='width: 100%;'>");
                            }
                        }

                        x++;
                    }

                    if ((x % 3) != 0)
                    {
                        ojbSB.Append("</tr>");
                    }
                    if ((x % 30) != 0)
                    {
                        ojbSB.Append("</table>");
                    }
                    ojbSB.Append("</body>");
                    ojbSB.Append("</html>");
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            {
                return "";
            }
        }


        //======================== COA Listing =====================//   

        [Route("COAListing")]
        [HttpPost]
        public string COAListing(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Json = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdId = Convert.ToInt32(Json["ProdId"]);
                    string ProductionName = Convert.ToString(Json["ProductionName"]);
                    LedgerBusiness BusinessContext = new LedgerBusiness();
                    var strResult = BusinessContext.ReportsLedgerCOAJSON(callParameters);
                    StringBuilder ojbSB = new StringBuilder();


                    #region FirstPage



                    ojbSB.Append("<html>");
                    ojbSB.Append("<head><title></title></head>");
                    ojbSB.Append("<body>");
                    ojbSB.Append("<table style='width: 10in; float: left;repeat-header: yes;border-collapse: collapse;' >");
                    ojbSB.Append("<thead>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th colspan='6'>");

                    ojbSB.Append("<table style='width: 100%;'>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Account : ALL</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + ProductionName + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp</th>");
                    ojbSB.Append(" <th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>Chart of Accounts Listing</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");
                    ojbSB.Append("</th>");

                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th colspan='6'>");
                    ojbSB.Append("<table style='width: 100%;'>");
                    ojbSB.Append("<tr>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string Pritingtdate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdId));

                    ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; float: right; padding-bottom: 10px; text-align: right;'>Printed on : " + Pritingtdate + "</td>");
                    ojbSB.Append(" </tr>");
                    ojbSB.Append("</table>");
                    ojbSB.Append("</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr style='border: 1px solid #000; background-color: #A4DEF9 ;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Category</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Account</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Account Description</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Account Level</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Report Type</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Disabled</th>");

                    ojbSB.Append("</tr>");
                    ojbSB.Append("</thead>");
                    ojbSB.Append("<tbody>");

                    for (int z = 0; z < strResult.Count; z++)
                    {
                        if (strResult[z].SubLevel == 1)
                        {
                            ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                            ojbSB.Append("<td style=\"padding: 5px 10px; font-size: 11px; text-align:left;height: 25px;border-bottom-width: 1px;border-bottom: 1px solid black;\">" + strResult[z].Code + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px; font-size: 11px;text-align:left;height: 25px;border-bottom-width: 1px;border-bottom: 1px solid black;\">" + strResult[z].AccountCode + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px; font-size: 11px;text-align:left;height: 25px;border-bottom-width: 1px;border-bottom: 1px solid black;\">" + strResult[z].AccountName + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px; font-size: 11px;text-align:left;height: 25px;border-bottom-width: 1px;border-bottom: 1px solid black;\">" + "Header" + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px; font-size: 11px;text-align:left;height: 25px;border-bottom-width: 1px;border-bottom: 1px solid black;\">" + strResult[z].Code + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px; font-size: 11px;text-align:left;height: 25px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> </td>");
                            ojbSB.Append("</tr>");
                        }
                        else
                        {
                            ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                            ojbSB.Append("<td style=\"padding: 5px 10px; font-size: 11px; text-align:left;height: 25px;\">" + strResult[z].Code + "</td>");
                            if (strResult[z].SubLevel == 2)
                            {
                                ojbSB.Append("<td style=\"text-align:left;height: 25px;padding: 5px 10px; font-size: 11px;\">" + strResult[z].AccountCode + "</td>");
                                ojbSB.Append("<td style=\"text-align:left;height: 25px;padding: 5px 10px; font-size: 11px;\">" + strResult[z].AccountName + "</td>");
                                ojbSB.Append("<td style=\"text-align:left;height: 25px;padding: 5px 10px; font-size: 11px;\" >" + "Detail" + "</td>");
                            }
                            else
                            {
                                ojbSB.Append("<td style=\"text-align:left;height: 25px; padding: 5px 10px; font-size: 11px;\">" + strResult[z].AccountCode + "</td>");
                                ojbSB.Append("<td style=\"text-align:left;height: 25px;padding: 5px 10px; font-size: 11px;\">" + strResult[z].AccountName + "</td>");
                                ojbSB.Append("<td  style=\"text-align:left;height: 25px;padding: 5px 10px; font-size: 11px;\">" + "SubHeader" + "</td>");
                            }
                            ojbSB.Append("<td style=\"text-align:left;height: 25px;padding: 5px 10px; font-size: 11px;\" >" + strResult[z].Code + "</td>");
                            ojbSB.Append("<td style=\"text-align:left;height: 25px;padding: 5px 10px; font-size: 11px;\" > </td>");
                            ojbSB.Append("</tr>");
                        }
                    }

                    #endregion Second

                    ojbSB.Append("</tbody></table></body></html>");

                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            {
                return "";
            }
        }

        //======================== Vendor Inquiry =====================//   

        [Route("VendorInquiryReport")]
        [HttpPost]
        public String VendorInquiryReport(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    ReportVendors RepVen = JsonConvert.DeserializeObject<ReportVendors>(Convert.ToString(Payload["VI"]));

                    var objRD = RepVen.objRD;
                    var objRDF = RepVen.objRDF;
                    StringBuilder ojbSB = new StringBuilder();

                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        var VendorInqReportJSONResult = BusinessContext.ReportsVendorInqReportJSON(callParameters);
                        return ReportEngineController.MakeJSONExport(VendorInqReportJSONResult);
                    }

                    var strResult = BusinessContext.ReportsVendorInqReportJSON(callParameters);
                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string Pritingtdate = BusinessContextR.UserSpecificTime(Convert.ToInt32(RepVen.objRDF.ProdID));

                    string strVendorFrom = objRDF.VendorFrom;
                    if (strVendorFrom == "")
                    {
                        strVendorFrom = "ALL";
                    }
                    else
                    {

                    }
                    string strVendorTo = objRDF.VendorTo;
                    if (strVendorTo == "")
                    {
                        strVendorTo = "ALL";
                    }
                    else
                    {

                    }
                    string strVendorCountry = objRDF.VendorCountry;
                    if (strVendorCountry == "")
                    {
                        strVendorCountry = "ALL";
                    }
                    else
                    {

                    }
                    String StrCompany = string.Join(",", objRDF.CompanyCode);
                    if (objRDF.CompanyCode[0] == "")
                    {
                        StrCompany = "ALL";
                    }
                    else
                    {

                    }
                    String FinalStrW9 = "";
                    if (objRDF.W9OnFile == true)
                    {
                        FinalStrW9 = "Y";
                    }
                    else
                    {
                        FinalStrW9 = "N";
                    }
                    string W9NotOnFile = "";
                    if (FinalStrW9 == "Y")
                    {
                        W9NotOnFile = "N";
                    }
                    else
                    {
                        W9NotOnFile = "Y";
                    }

                    string stest = "";
                    if (strResult.Count != 0)
                    {
                        int ColCnt = 11;
                        decimal FSumAmt = 0;
                        string strSegmentH = objRD.Segment;
                        string[] strSegment1H = strSegmentH.Split(',');
                        string strSClassificationH = objRD.SClassification;
                        string[] strSClassification1H = strSClassificationH.Split(',');

                        for (int z = 0; z < strSegment1H.Length; z++)
                        {
                            if (strSClassification1H[z] == "Detail")
                            {
                                ColCnt++;
                            }
                            else
                            {
                                ColCnt++;
                            }
                        }

                        var strOptionalSegmentH = objRD.SegmentOptional.Split(',');

                        for (int z = 0; z < strOptionalSegmentH.Length; z++)
                        {
                            ColCnt++;
                        }

                        string TransCodeH = objRD.TransCode;
                        string[] TransCode1H = TransCodeH.Split(',');

                        for (int z = 0; z < TransCode1H.Length; z++)
                        {
                            ColCnt++;
                        }
                        #region ReportHeader
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table border=0 style='width: 10.5in; border-collapse: collapse; border-top: 1px solid #ccc;repeat-header: yes;'>");

                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr><th colspan='" + ColCnt + "'>");
                        ojbSB.Append("<table style='width: 100%; border-collapse: collapse;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Name From : " + strVendorFrom + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + objRD.ProductionName + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>W9 on File : " + FinalStrW9 + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Name To : " + strVendorTo + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>W9 Not on File : " + W9NotOnFile + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Company Code :" + StrCompany + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Country : " + strVendorCountry + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Vendor Type : All</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>Vendor Inquiry</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; color: white;'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0 0 3px 0; font-size: 12px; width: 20%; float: left; color: white;'>Statement Amount </th>");
                        ojbSB.Append("<th style='padding: 0 0 3px 0; font-size: 16px; width: 60%; float: left; text-align: center; '>&nbsp;</th>");

                        ReportP1Business BusinessContext4 = new ReportP1Business();
                        string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(objRDF.ProdID));

                        ojbSB.Append("<th style='padding: 0 10px 3px 0; font-size: 12px; width: 18%; float: left; text-align: right;'>Printed on : " + CurrentDate + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");


                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-left-width: 1px; border-left: 1px solid black;'>Trans#</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>TT</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>CUR</th>");

                        int strHeaderCount = 12;
                        int strDetailPosition = 0;

                        string strSegment = objRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = objRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');

                        for (int z = 0; z < strSegment1.Length; z++)
                        {
                            if (strSClassification1[z] == "Company")
                            {
                            }
                            else if (strSClassification1[z] == "Detail")
                            {
                                strHeaderCount++;
                                strDetailPosition = z;
                                ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Account</th>");
                            }
                            else
                            {
                                strHeaderCount++;
                                ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strSegment1[z] + " </th>");
                            }
                        }
                        var strOptionalSegment = objRD.SegmentOptional.Split(',');
                        for (int z = 0; z < strOptionalSegment.Length; z++)
                        {
                            strHeaderCount++;
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + strOptionalSegment[z] + "</th>");
                        }

                        string TransCode = objRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');

                        for (int z = 0; z < TransCode1.Length; z++)
                        {
                            strHeaderCount++;
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + TransCode1[z] + " </th>");
                        }
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'> 1099 Vendor </th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'> Period </th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'> PO# </th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'> Line Item Vendor </th>");

                        ojbSB.Append("<th  colspan=\"3\" style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Line Item Description</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Amount</th></tr></thead>");
                        #endregion ReportHeader

                        ojbSB.Append("<tbody>");
                        string strPreVenodrName = "";
                        int strPreInvoiceNumber = 0;
                        decimal dReportTotal = 0;

                        if (strResult.Count > 0)
                        {
                            #region ReportBody
                            for (var a = 0; a < strResult.Count; a++)
                            {
                                dReportTotal += strResult[a].LineAmount;
                                #region ReportBodyVendor
                                if (a != 0 && strPreVenodrName != strResult[a].vendorname)
                                {
                                    ojbSB.Append("<tr style=\"vertical-align: top;width: 25%;\">");
                                    ojbSB.Append("<td style=\"padding: 3px 3px;text-align:left; font-size: 10px;font-weight: bold;border-bottom-width: 1px; solid #ccc;\"colspan=\"" + Convert.ToInt32(strHeaderCount - 9) + "\"></td>");
                                    ojbSB.Append("<td style=\"padding: 3px 3px;text-align:left; font-size: 10px;font-weight: bold;border-bottom-width: 1px; solid #ccc;\">" + WebUtility.HtmlEncode(strResult[a - 1].vendorname) + "</td>");
                                    ojbSB.Append("<td style=\"padding: 3px 3px;text-align:left; font-size: 10px;font-weight: bold;border-bottom-width: 1px; solid #ccc;\"colspan=\"5\"> Vendor Code:" + WebUtility.HtmlEncode(strPreVenodrName) + " (Type:" + strResult[a - 1].Type + ")" + "</td>");

                                    ojbSB.Append("<td style=\"padding:3px 3px; font-size: 10px; text-align: left; font-weight: bold; border-bottom-width: 1px; solid #ccc;\">Total:</td>");

                                    ojbSB.Append("<td style=\"padding:3px 3px; font-size: 10px;font-weight: bold;text-align:right;border-bottom-width: 1px; solid #ccc; \">" + Convert.ToDecimal(FSumAmt).ToString("$#,##,0.00") + "</td></tr>");
                                    FSumAmt = 0;
                                }
                                if (a == 0)
                                {
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<td colspan=\"5\" style='padding:3px 3px; text-align:left;height: 20px;font-size: 10px;font-weight:bold;border-bottom-width: 1px; solid #ccc;'>" + WebUtility.HtmlEncode(strResult[a].vendorname) + "</td>");
                                    ojbSB.Append("<td style='padding:3px 3px;text-align:left;height:20px;font-size: 10px;font-weight:bold;border-bottom-width: 1px; solid #ccc;' colspan=\"" + Convert.ToInt32(strHeaderCount - 6) + "\"> Vendor Code: " + strResult[a].VendorNumber + " (Type:" + strResult[a].Type + ")" + "</td></tr>");

                                    ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight: bold; border-bottom-width: 1px; solid #ccc;' colspan=\"4\">Payment / Invoice#:" + (strResult[a].paymentId == 0 ? "UNPAID" : strResult[a].checkNumber.ToString()) + " / " + strResult[a].InvoiceNumber + "</td>");
                                    //ojbSB.Append("<td style='padding: 5px 10px; font-size: 12px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'></td>");
                                    ojbSB.Append("<td style='padding: 3px 3px;text-align:left; height: 20px;font-size: 10px;font-weight:bold;border-bottom-width: 1px; solid #ccc;'colspan=\"" + Convert.ToInt32(strHeaderCount - 12) + "\"> Desc:" + WebUtility.HtmlEncode(strResult[a].HeaderDescription) + "</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;' colspan=\"2\"> Bank:" + strResult[a].BankName + "</td>");
                                    //ojbSB.Append("<td style='padding: 5px 10px; font-size: 12px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'></td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'>USD</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'> Check Date</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'>" + (strResult[a].paymentId == 0 ? "UNPAID" : strResult[a].CheckDate.Value.ToShortDateString()) + "</td>");

                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight: bold; border-bottom-width: 1px;solid #ccc;'colspan=\"1\"> Invoice Total</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: right; font-weight: bold; border-bottom-width: 1px; solid #ccc;'>" + Convert.ToDecimal(strResult[a].InvoiceTotal).ToString("$#,##,0.00") + "</td></tr>");
                                    FSumAmt += Convert.ToDecimal(Convert.ToDecimal(strResult[a].InvoiceTotal));
                                    //   strPreVenodrName = strResult[a].vendorname;
                                }
                                if (a != 0 && strPreInvoiceNumber != strResult[a].Invoiceid)
                                {
                                    if (strPreVenodrName != strResult[a].vendorname)
                                    {
                                        ojbSB.Append("<tr>");
                                        ojbSB.Append("<td colspan=\"5\" style='padding:5px 10px; text-align:left;height: 20px;font-size: 12px;font-weight:bold;border-bottom-width: 1px; solid #ccc;'>" + WebUtility.HtmlEncode(strResult[a].vendorname) + "</td>");
                                        ojbSB.Append("<td style='padding: 5px 10px;text-align:left;height:20px;font-size: 12px;font-weight:bold;border-bottom-width: 1px; solid #ccc;' colspan=\"" + Convert.ToInt32(strHeaderCount - 6) + "\"> Vendor Code: " + strResult[a].VendorNumber + " (Type:" + strResult[a].Type + ")" + "</td></tr>");
                                    }

                                    ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight: bold; border-bottom-width: 1px; solid #ccc;' colspan=\"4\">Payment / Invoice#:" + (strResult[a].paymentId == 0 ? "UNPAID" : strResult[a].checkNumber.ToString()) + " / " + strResult[a].InvoiceNumber + "</td>");
                                    //ojbSB.Append("<td style='padding: 5px 10px; font-size: 12px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'></td>");
                                    ojbSB.Append("<td style='padding: 3px 3px;text-align:left; height: 20px;font-size: 10px;font-weight:bold;border-bottom-width: 1px; solid #ccc;'colspan=\"" + Convert.ToInt32(strHeaderCount - 12) + "\"> Desc:" + WebUtility.HtmlEncode(strResult[a].HeaderDescription) + "</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;' colspan=\"2\"> Bank:" + strResult[a].BankName + "</td>");
                                    //ojbSB.Append("<td style='padding: 5px 10px; font-size: 12px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'></td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'>USD</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'> Check Date</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight:bold; border-bottom-width: 1px;solid #ccc;'>" + (strResult[a].paymentId == 0 ? "UNPAID" : strResult[a].CheckDate.Value.ToShortDateString()) + "</td>");

                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: left; font-weight: bold; border-bottom-width: 1px;solid #ccc;'colspan=\"1\"> Invoice Total</td>");
                                    ojbSB.Append("<td style='padding: 3px 3px; font-size: 10px; text-align: right; font-weight: bold; border-bottom-width: 1px; solid #ccc;'>" + Convert.ToDecimal(strResult[a].InvoiceTotal).ToString("$#,##,0.00") + "</td></tr>");
                                    FSumAmt += Convert.ToDecimal(Convert.ToDecimal(strResult[a].InvoiceTotal));
                                    //  strPreVenodrName = strResult[a].vendorname;
                                }
                                #endregion ReportBodyVendor

                                ojbSB.Append("<tr style=\"vertical-align: top;width: 25%;\" >");
                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'>" + strResult[a].TransactionNumber + "</td>");
                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'>" + strResult[a].Source + "</td>");
                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'>USD</td>");

                                var CoaCode = strResult[a].COAstring;
                                var straa = CoaCode.Split('|');

                                for (int b = 0; b < strSegment1.Length; b++)
                                {
                                    if (b == 0) { }
                                    else
                                    {
                                        if (strDetailPosition == b && b < straa.Length)
                                        {
                                            string strCOADetail = (CoaCode == "") ? "INVALID COA|INVALIDCOA" : straa[b];
                                            string[] strDetail = strCOADetail.Split('>');
                                            if (strDetail.Length == 1)
                                            {
                                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'>" + strDetail[0] + "</td>");
                                            }
                                            else
                                            {
                                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'>" + strDetail[strDetail.Length - 1] + "</td>");
                                            }
                                        }
                                        else
                                        {
                                            if (CoaCode == "" || b >= straa.Length) // This check handles a scenario where the COA code is invalid 
                                            {
                                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px;solid #ccc;'>" + "INVALID COA" + "</td>");
                                            }
                                            else
                                            {
                                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px;solid #ccc;'>" + straa[b] + "</td>");
                                            }
                                        }
                                    }
                                }
                                for (int b = 0; b < strOptionalSegment.Length; b++)
                                {
                                    if (b == 0)
                                    {
                                        ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'></td>");
                                    }
                                    else if (b == 1)
                                    {
                                        ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'></td>");
                                    }
                                }
                                string strTransString = strResult[a].TransStr;
                                string[] strTransString1 = strTransString.Split(',');
                                int strTrvalCount = strTransString1.Length;
                                if (strTransString == "")
                                {
                                    for (int z = 0; z < TransCode1.Length; z++)
                                    {
                                        ojbSB.Append("<td style='padding:3px 3px;text-align:left;height: 20px;font-size: 10px;border-bottom-width: 1px;solid #ccc;'></td>");
                                    }
                                }
                                else
                                {
                                    for (int m = 0; m < TransCode1.Length; m++)
                                    {
                                        int count = 0;
                                        for (int n = 0; n < strTransString1.Length; n++)
                                        {
                                            string[] newTransValu = strTransString1[n].Split(':');
                                            if (newTransValu[0] == TransCode1[m])
                                            {
                                                count++;
                                                ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'>" + newTransValu[1] + "</td>");
                                            }
                                            else
                                            {
                                                //ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'></td>");
                                            }
                                        }
                                        if (count == 0)
                                        {
                                            ojbSB.Append("<td style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'></td>");
                                        }
                                    }
                                }

                                ojbSB.Append("<td style='padding:3px 3px; height: 20px;text-align:left;font-size: 10x;border-bottom-width: 1px; solid #ccc;'></td>");
                                ojbSB.Append("<td style='padding:3px 3px; height: 20px;text-align:left;font-size: 10px;border-bottom-width: 1px; solid #ccc;'></td>");
                                ojbSB.Append("<td colspan=\"2\" style='padding:3px 3px;text-align:left; height: 20px;font-size: 10px;border-bottom-width: 1px; solid #ccc;'>" + WebUtility.HtmlEncode(strResult[a].PONumber) + "</td>");
                                ojbSB.Append("<td colspan=\"3\" style='padding:3px 3px; height: 20px;font-size: 10px;text-align:left;border-bottom-width: 1px; solid #ccc;'>" + WebUtility.HtmlEncode(strResult[a].LineDescription) + "</td>");
                                //ojbSB.Append("<td style='padding:3px 3px; height: 20px;font-size: 10px;text-align:left;border-bottom-width: 1px; solid #ccc;'></td>");
                                ojbSB.Append("<td style='padding:3px 3px; height: 20px;font-size: 10px;text-align:right;border-bottom-width: 1px; solid #ccc;'>" + Convert.ToDecimal(strResult[a].LineAmount).ToString("$#,##,0.00") + "</td></tr>");
                                strPreVenodrName = strResult[a].vendorname;
                                strPreInvoiceNumber = strResult[a].Invoiceid;
                                if (a == (strResult.Count - 1))
                                {
                                    ojbSB.Append("<tr style=\"vertical-align: top;width: 25%;\">");
                                    ojbSB.Append("<td style='padding:3px 3px; height:20px;font-size: 10px;text-align: left;border-bottom-width: 1px; solid #ccc;'colspan=\"" + Convert.ToInt32(strHeaderCount - 5) + "\"></td>");
                                    ojbSB.Append("<td style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'> Paid Total:</td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'>" + strResult[a].InvoiceTotal + "</td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'>Invoice Total:</td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:right;border-bottom-width: 1px;solid #ccc;' >" + Convert.ToDecimal(strResult[a].LineAmount).ToString("$#,##,0.00") + "</td></tr>");
                                    ojbSB.Append("<tr  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'><td colspan=\"" + Convert.ToInt32(strHeaderCount - 9) + "\"></td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'>" + WebUtility.HtmlEncode(strResult[a].vendorname) + "</td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'colspan=\"3\"> Vendor Code:" + strPreVenodrName + "(Type:" + strResult[a].Type + ")" + "</td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'>Paid Total:</td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'>" + dReportTotal.ToString("$#,##,0.00") + "</td>");

                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:left;border-bottom-width: 1px; solid #ccc;'></td>");
                                    ojbSB.Append("<td  style='padding:3px 3px; height:20px;font-size: 10px;font-weight:bold;text-align:right;border-bottom-width: 1px; solid #ccc;'></td></tr>");
                                }
                                #endregion ReportBody
                            }
                        }
                        //ojbSB.Append("</tbody>");
                        //ojbSB.Append("</table></body></html>");
                        //stest = ojbSB.ToString();
                        //stest = stest.Replace("&", "&#38;");
                    }
                    else
                    {
                        return "";
                    }

                    //PDFCreation BusinessContext1 = new PDFCreation();

                    //DateTime CurrentDate1 = DateTime.Now;
                    //string ReturnName1 = "VendorInquiry" + (CurrentDate1.ToShortTimeString().Replace(":", "_").Replace(" ", "_"));
                    //var ResponseResult = BusinessContext1.ReportPDFGenerateFolder("Reports/Vendor", ReturnName1, "Vendor", stest);
                    //string[] strResultResponse = ResponseResult.Split('/');
                    //string strRes = strResultResponse[2];
                    //return strRes;
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        //======================== PO Hisotry =========================//

        [Route("POHistoryReports")]
        [HttpPost]
        public string POHistoryReports(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    POListingReport PO = JsonConvert.DeserializeObject<POListingReport>(Convert.ToString(Payload["PO"]));

                    var srtRD = PO.ObjRD;
                    //var srtPO = PO.objPO;
                    //string jsonParameters = JsonConvert.SerializeObject(PO.objPO);

                    int strTdCount = 0;
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    // PO history json Procedure name ReportsPOListingReportsJSON
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        var POListingExportJSONResult = BusinessContext.ReportsPOListingExportJSON(callParameters);
                        return ReportEngineController.MakeJSONExport(POListingExportJSONResult);
                    }

                    string ReportTitle = "Purchase Order History";
                    var strResult = BusinessContext.ReportsPOListingExportJSON(callParameters);
                    StringBuilder ojbSB = new StringBuilder();

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string Pritingtdate = Payload.ReportDate.ToString();
                    var CompanyName = BusinessContext.GetCompanyNameByID(1);

                    if (strResult.Count == 0)
                    {
                        return "";
                    }
                    else
                    {
                        #region FirstPage
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body  style='width: 10.5in;'>");
                        ojbSB.Append("<table border=0 style='width: 100%; float: left; repeat-header: yes; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th>");
                        ojbSB.Append("<table border=0 style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th width='20%' style='vertical-align:top; align:left;'>");
                        ojbSB.Append("<table border=0 width='100%'>");
                        ojbSB.Append("<tr  style='font-size: 12px;'><td style='padding: 0px;  float: left;'>Company</td><td>" + CompanyName[0].CompanyCode + "</td></tr>");
                        ojbSB.Append("<tr  style='font-size: 12px;'><td style='padding: 0px;  float: left;'>Location</td><td>" + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO)) + "</td></tr>");
                        string CheckEpisode = Convert.ToString(PO.ObjRD.Segment);
                        if (CheckEpisode.IndexOf("EP") != -1)
                            ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Episode</td><td>" + (String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : String.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px;  float: left;'>Batch </td><td>" + (string.Join(",", Payload.BatchNumber) == "" ? "ALL" : string.Join(",", Payload.BatchNumber)) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Vendor </td><td>" + ((Payload.VendorFrom.ToString() + Payload.VendorTo.ToString()) == "" ? "ALL" : (Payload.VendorFrom.ToString() + " to " + Payload.VendorTo.ToString())) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>PO Status</td><td>" + (Payload.POFilterStatus.ToString() == "" ? "ALL" : Payload.POFilterStatus.ToString()) + "</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Period </td><td>" + ((Payload.fieldsetPeriod.PeriodFrom.ToString() + Payload.fieldsetPeriod.PeriodTo.ToString()) == "" ? "ALL" : Payload.fieldsetPeriod.PeriodFrom.ToString() + " to " + Payload.fieldsetPeriod.PeriodTo.ToString()) + "</td></tr>");
                        ojbSB.Append("<td>" + Payload["POFilterReportDate"] + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        /// Cendter Part of Logo
                        ojbSB.Append("<th width='60%' style='vertical-align:top;'>");
                        ojbSB.Append("<table border=0 width='100%' style='margin:auto; width=50%'>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>&nbsp;</th></tr>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>" + Payload.ProductionName.ToString() + "</th></tr>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 17px; text-align: center;'></th></tr>");
                        ojbSB.Append($"<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>{ReportTitle}</th></tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        /// Cendter Part of Logo End
                        string PONumberFromTo = ((Payload.fieldsetTransactionIDs.PONoFrom.ToString() + Payload.fieldsetTransactionIDs.PONoTo.ToString()) == "") ? "ALL" : Payload.fieldsetTransactionIDs.PONoFrom.ToString() + " to " + Payload.fieldsetTransactionIDs.PONoTo.ToString();
                        string DateFromTo = ((Payload.fieldsetPeriod.DocumentDateFrom.ToString() + Payload.fieldsetPeriod.DocumentDateTo.ToString()) == "") ? "ALL" : Payload.fieldsetPeriod.DocumentDateFrom.ToString() + " to " + Payload.fieldsetPeriod.DocumentDateTo.ToString();
                        ojbSB.Append("<th width='20%' style='vertical-align:top; align:left;'>");
                        ojbSB.Append("<table border=0 width='100%'>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>&nbsp;</td><td>&nbsp;</td></tr>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>PO Number</td><td>{PONumberFromTo}</td></tr>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>PO Date</td><td>{DateFromTo}</td></tr>");
                        string CurrencyFilter = (Payload.fieldsetCurrency.CurrencyFilter.ToString() == "") ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                        string CurrencyReport = Payload.fieldsetCurrency.CurrencyReport.ToString();
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Filter Currency</td><td>{CurrencyFilter}</td></tr>");
                        ojbSB.Append($"<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Report Currency</td><td>{CurrencyReport}</td></tr>");
                        ojbSB.Append("<tr style='font-size: 12px;'><td style='padding: 0px; float: left;'>Report Date</td><td>" + Pritingtdate + "</td></tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");

                        // Header End here 
                        #endregion FirstPage
                        #region second page

                        ojbSB.Append("<table border=0 style=\"repeat-header: yes; width:10.5in; border-collapse:collapse; border:1px solid #ccc;font-size: 10px;\"><thead>");
                        ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");

                        int strHeaderCount = 13;
                        int strDetailPosition = 0;

                        string strSegment = srtRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');

                        strTdCount = strTdCount + Convert.ToInt32(strSegment1.Length - 1);

                        ojbSB.Append("<th style=\"border-bottom-width: 1px;font-size: 12px;border-bottom:1px solid black;\">Account</th>");
                        for (int z = 0; z < strSegment1.Length; z++)
                        {
                            if (strSClassification1[z] == "Company") { }
                            else if (strSClassification1[z] == "Detail")
                            {
                                strHeaderCount++;
                                strDetailPosition = z;

                            }
                            else
                            {
                                strHeaderCount++;
                                ojbSB.Append("<th style=\"border-bottom-width: 1px;font-size: 12px;border-bottom: 1px solid black;\">" + strSegment1[z] + " </th>");

                            }

                        }
                        var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strOptionalSegment.Length);

                        for (int z = 0; z < strOptionalSegment.Length; z++)
                        {
                            strHeaderCount++;
                            ojbSB.Append("<th style=\"border-bottom-width:1px;font-size: 12px;border-bottom: 1px solid black;\">" + strOptionalSegment[z] + "</th>");
                        }

                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1.Length);

                        for (int z = 0; z < TransCode1.Length; z++)
                        {
                            strHeaderCount++;
                            ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\">" + TransCode1[z] + " </th>");

                        }
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\">1099 </th>");
                        ojbSB.Append("<th colspan=\"4\" style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\">Line Item Description</th>");
                        ojbSB.Append("<th colspan=\"2\" style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> Vendor </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> PO Trans# </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> CUR </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> PER </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> PO Status </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> PO Date </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> Original Amount </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> Adjustment Amount </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\"> Relieved Amount </th>");
                        ojbSB.Append("<th style=\"font-size: 12px;border-bottom-width: 1px;border-bottom: 1px solid black;\">Open Amount</th></tr></thead>");

                        ojbSB.Append("<tbody>");
                        if (strResult.Count > 0)
                        {
                            // Report Total Amounts
                            Decimal FOAmount = 0;
                            Decimal FAAmount = 0;
                            Decimal FRAmount = 0;
                            Decimal FOpenAmount = 0;
                            // End Report Total Amounts

                            int POID_current = 0;
                            int POID_previous = -1;

                            // Our PO Footer values
                            Decimal OAmount = 0;
                            Decimal AAmount = 0;
                            Decimal RAmount = 0;
                            Decimal OpenAmount = 0;
                            // End PO Footer values

                            for (var a = 0; a < strResult.Count; a++)
                            {
                                POID_current = strResult[a].POID;
                                /* Porting to using ReportsPOListingExportJSON
                                //POInvoiceBussiness POBussiness = new POInvoiceBussiness();
                                //var strResultPO = POBussiness.GetPODetail(strResult[a].POID);
                                //var strResultPOLine = POBussiness.GetPOLines(strResult[a].POID, (int)(Payload["ProdID"]));
                                //if (strResultPOLine.Count == 0) { continue; }
                                */

                                if (POID_current != POID_previous)
                                {
                                    if (a > 0)
                                    {
                                        ojbSB.Append("<tr ><td colspan=\"" + Convert.ToInt32(strHeaderCount - 4) + "\" style=\" padding: 5px 10px;font-size: 12px;font-weight: bold;\"></td>");
                                        ojbSB.Append("<td colspan=\"4\" style=\"padding: 5px 10px;font-size: 12px; font-weight:bold;border-bottom-width:1px; solid #ccc;\">PO #" + strResult[a - 1].PONumber + "- " + strResult[a - 1].Description + "</td>");
                                        ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">$" + Convert.ToDecimal(OAmount).ToString("#,##0.00") + "</td>");
                                        ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">$" + Convert.ToDecimal(AAmount).ToString("#,##0.00") + "</td>");
                                        ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">$" + Convert.ToDecimal(RAmount).ToString("#,##0.00") + "</td>");
                                        ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; text-align:right;\">$" + Convert.ToDecimal(OpenAmount).ToString("#,##0.00") + "</td></tr>");
                                    }
                                    ojbSB.Append("<tr style=\"padding-top: 3px;background:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=\"" + Convert.ToInt32(strHeaderCount + 5) + "\" style=\"border-bottom-width: 1px;font-size: 12px;font-weight:bold;\">PO #" + strResult[a].PONumber + "- " + strResult[a].Description + "</td></tr>");

                                    // Our PO Footer values
                                    OAmount = 0;
                                    AAmount = 0;
                                    RAmount = 0;
                                    OpenAmount = 0;
                                    // End PO Footer values
                                }

                                /* Porting to using ReportsPOListingExportJSON
                                for (int b = 0; b < strResultPOLine.Count; b++)
                                {
                                */
                                string[] straa = strResult[a].COAString.Split('|');
                                ojbSB.Append("<tr>");
                                for (int k = 0; k < straa.Length; k++)
                                {
                                    if (strDetailPosition == k)
                                    {
                                        string strCOADetail = straa[k];
                                        string[] strDetail = strCOADetail.Split('>');
                                        if (strDetail.Length == 1)
                                        {
                                            ojbSB.Append("<td style=\"font-size: 12px; border-bottom-width:1px;\">" + strDetail[0] + "</td>");
                                        }
                                        else
                                        {
                                            ojbSB.Append("<td style=\"font-size: 12px; border-bottom-width:1px;\">" + strDetail[strDetail.Length - 1] + "</td>");
                                        }
                                    }
                                }

                                for (int k = 0; k < straa.Length; k++)
                                {
                                    if (k == 0)
                                    { }
                                    else
                                    {
                                        if (strDetailPosition != k)
                                        {
                                            ojbSB.Append("<td style=\"font-size: 12px;border-bottom-width:1px;\">" + straa[k] + "</td>");
                                        }
                                    }
                                }

                                var strSegmentOptioanl = srtRD.SegmentOptional;
                                var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                                for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                                {
                                    if (k == 0)
                                    {
                                        ojbSB.Append("<td style=\"font-size: 12px;border-bottom-width:1px;\">" + strResult[a].SetCode + "</td>");
                                    }
                                    if (k == 1)
                                    {
                                        ojbSB.Append("<td style=\"font-size: 12px;border-bottom-width:1px;\">" + strResult[a].SeriesCode + "</td>");
                                    }
                                }

                                string strTransString = strResult[a].TransStr;
                                //string[] strTransString1 = strResult[a].TransStr.Split(',');
                                //int strTrvalCount = strTransString1.Length;
                                string strMemoCodesHTML = ReportEngineController.MakeMemoCodesHTML(TransCode.Split(','), strTransString, "padding: 5px 10px; font-size: 12px; border-bottom-width:1px;");
                                ojbSB.Append(strMemoCodesHTML);

                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \"></td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + strResult[a].TaxCode + "</td>");
                                ojbSB.Append("<td colspan=\"5\"  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + strResult[a].LineDescription + "</td>");

                                Decimal POLineOriginalAmount = Convert.ToDecimal(strResult[a].Amount_POL);
                                Decimal POLineRelievedAmount = Convert.ToDecimal(strResult[a].RelievedTotal_POL);
                                Decimal POLineAdjustmentAmount = POLineRelievedAmount + Convert.ToDecimal(strResult[a].NewAmount) - POLineOriginalAmount;
                                //Convert.ToDecimal((strResultPOLine[b].NewAmount == 0) ? 0 : (strResultPOLine[b].NewAmount - strResultPOLine[b].Amount));
                                Decimal POLineBalance = POLineOriginalAmount + POLineAdjustmentAmount - POLineRelievedAmount;
                                if (strResult[a].POCloseStatus == "1") { POLineBalance = 0; }

                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + strResult[a].tblVendorName + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + strResult[a].POID + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">USD</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + strResult[a].CompanyPeriod + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + strResult[a].POLinestatus + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + strResult[a].CreatedDate_POL + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + POLineOriginalAmount.ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + POLineAdjustmentAmount.ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; \">" + POLineRelievedAmount.ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px; text-align:right;\">" + POLineBalance.ToString("#,##0.00") + "</td></tr>");

                                OAmount += POLineOriginalAmount;
                                AAmount += POLineAdjustmentAmount;
                                RAmount += POLineRelievedAmount;
                                OpenAmount += POLineBalance;

                                FOAmount += POLineOriginalAmount;
                                FAAmount += POLineAdjustmentAmount;
                                FRAmount += POLineRelievedAmount;
                                FOpenAmount += POLineBalance;

                                //}
                                POID_previous = strResult[a].POID;
                            }
                            ojbSB.Append("<tr ><td colspan=\"" + Convert.ToInt32(strHeaderCount - 4) + "\" style=\" font-weight: bold;\"></td>");
                            ojbSB.Append("<td colspan=\"4\" style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px;  font-weight:bold;text-align:right;\">Report- Total </td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px;\">$" + Convert.ToDecimal(FOAmount).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px;\">$" + Convert.ToDecimal(FAAmount).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px;\">$" + Convert.ToDecimal(FRAmount).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("<td style=\"padding: 5px 10px;font-size: 12px;border-bottom-width:1px;text-align:right;\">$" + Convert.ToDecimal(FOpenAmount).ToString("#,##0.00") + "</td></tr>");
                        }


                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table></body></html>");


                        #endregion FirstPage

                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {

                return "";
            }
        }

        //======================== Company Listing =====================//   
        [Route("CompanyListing")]
        [HttpPost]
        public string GetCompanylistReport(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(JOrigin["ProdID"]);
                    string ProName = Convert.ToString(JOrigin["ProName"]);

                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var strResult = BusinessContext.GetCompanylistReport(ProdID);
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();

                    ojbSB.Append("<html><head></head>");
                    ojbSB.Append(" <body><table style=\"width: 10.5in;border-spacing: 0px;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;\"><thead><tr><td ></td>");
                    ojbSB.Append("<td></td></tr>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string Pritingtdate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdID));

                    ojbSB.Append("</thead></table></td>");
                    /// Cendter Part of Logo
                    ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + ProName + "</th></tr>");
                    // ojbSB.Append("<tr><th style=\"padding:5px 10px;text-align:center;\"><img style=\"\" src=\"" + EMSLogo + "\" /></th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">Company Listing</th></tr></thead></table></td>");
                    /// Cendter Part of Logo End
                    ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                    ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");
                    ojbSB.Append("<td>" + Pritingtdate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                    // Header End here 

                    #region Second

                    ojbSB.Append("<table style=\"width:10.5in;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                    ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Company Information</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Address</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Phone and Contact Person</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Federal Tax ID</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left; border-bottom-width: 2px;border-bottom: 3px solid black;\">State Tax ID</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left; border-bottom-width: 2px;border-bottom: 3px solid black;\">Status</th></tr></thead>");
                    //for (int i = 0; i < strResult.Count; i++)
                    //{
                    for (int i = 0; i < strResult.Count; i++)
                    {
                        ojbSB.Append("<tbody><tr style=\"height:25px;\">");
                        ojbSB.Append("<td style=\"padding-left:5px;\">" + strResult[i].CompanyName + "</td>");
                        ojbSB.Append("<td >" + strResult[i].Address1 + "</td>");
                        ojbSB.Append("<td> Phone:" + strResult[i].CompanyPhone + "</td>");
                        ojbSB.Append("<td>" + strResult[i].taxinfoID + "</td>");
                        ojbSB.Append("<td>" + strResult[i].StatetaxID + "</td>");
                        ojbSB.Append("<td>" + strResult[i].Status + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td> Contact:" + strResult[i].Contact + "</td>");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("</tr></tbody>");
                    }
                    ojbSB.Append("</table></body></html>");

                    #endregion Second
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        ////======================== Company Listing =====================//   
        [Route("BankListing")]
        [HttpPost]
        public string GetBanklistReport(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(JOrigin["ProdID"]);
                    string ProName = Convert.ToString(JOrigin["ProName"]);
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var strResult = BusinessContext.GetBanklistReport(ProdID);
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();
                    #region FirstPage

                    ojbSB.Append("<html><head></head>");
                    ojbSB.Append(" <body><table style=\"width: 10.5in;border-spacing: 0px;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;\"><thead><tr><td></td>");
                    ojbSB.Append("<td></td></tr>");

                    ojbSB.Append("</thead></table></td>");
                    /// Cendter Part of Logo
                    ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + ProName + "</th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">Bank Listing</th></tr></thead></table></td>");
                    /// Cendter Part of Logo End
                    ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                    ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintingDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdID));

                    ojbSB.Append("<td>" + PrintingDate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                    // Header End here 
                    #endregion FirstPage
                    #region Second
                    ojbSB.Append("<table style=\"width:10.5in;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                    ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Bank Code</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Bank Information</th>");
                    ojbSB.Append("<th colspan=\"4\" style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Check Information</th></tr></thead>");

                    for (int i = 0; i < strResult.Count; i++)
                    {
                        string strColleted = strResult[i].Collated;
                        if (strColleted == "Collated")
                        {
                            strColleted = "Yes";
                        }
                        else
                        {
                            strColleted = "No";
                        }
                        //style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\"
                        ojbSB.Append("<tbody><tr style=\"height:25px;\">");
                        ojbSB.Append("<td style=\"padding-left:5px;height: 25px;font-weight:bold;\">" + strResult[i].BranchNumber + "</td>");
                        ojbSB.Append("<td style=\"height: 25px;font-weight:bold;\">" + strResult[i].Bankname + "</td>");
                        ojbSB.Append("<td colspan=\"4\"></td></tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td style=\"padding-left:5px;\">USD</td>");
                        ojbSB.Append("<td>" + strResult[i].Address1 + "</td>");
                        ojbSB.Append("<td>Valid Check Number Range</td>");
                        ojbSB.Append("<td>" + strResult[i].StartNumber + " </td>");
                        ojbSB.Append("<td>To</td>");
                        ojbSB.Append("<td>" + strResult[i].EndNumber + " </td></tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td colspan=\"2\"></td>");
                        ojbSB.Append("<td>Number of Copies</td>");
                        ojbSB.Append("<td colspan=\"3\">" + strResult[i].Copies + " </td></tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td>" + strResult[i].Address2 + "</td>");
                        ojbSB.Append("<td>Collate Checks</td>");
                        ojbSB.Append("<td colspan=\"3\">" + strColleted + " </td></tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td>" + strResult[i].Country + "</td>");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td colspan=\"3\"> </td></tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td colspan=\"2\"></td>");
                        ojbSB.Append("<td>Account Number</td>");
                        ojbSB.Append("<td colspan=\"3\">" + strResult[i].AccountNumber + " </td></tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td></td>");
                        ojbSB.Append("<td>" + strResult[i].zip + "</td>");
                        ojbSB.Append("<td>Routing Number</td>");
                        ojbSB.Append("<td colspan=\"3\">" + strResult[i].RoutingNumber + " </td></tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td colspan=\"2\"></td>");
                        ojbSB.Append("<td style=\"height: 25px;font-weight:bold;\">Default Accounts</td>");
                        ojbSB.Append("<td colspan=\"3\"></td></tr>");


                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td colspan=\"2\"></td>");
                        ojbSB.Append("<td>AP Cleraring</td>");
                        ojbSB.Append("<td colspan=\"3\">" + strResult[i].APClearing + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td colspan=\"2\"></td>");
                        ojbSB.Append("<td>Cash Accounts</td>");
                        ojbSB.Append("<td colspan=\"3\">" + strResult[i].CASHAccount + "</td>");

                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 2px;border-bottom: 3px solid black;' colspan='6'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                    }
                    ojbSB.Append("</table></body></html>");
                    #endregion Second
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        ////======================== Source Listing =====================//   
        [Route("SourceCodeListing")]
        [HttpPost]
        public string SourceCodeListing(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(JOrigin["ProdID"]);
                    string ProName = Convert.ToString(JOrigin["ProName"]);

                    CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                    var strResult = BusinessContext.GetSourceCodeDetails(ProdID);
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();
                    #region FirstPage

                    ojbSB.Append("<html><head></head>");
                    ojbSB.Append(" <body><table style=\"width: 10.5in;border-spacing: 0px;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;\"><thead><tr><td></td>");
                    ojbSB.Append("<td></td></tr>");

                    ojbSB.Append("</thead></table></td>");
                    /// Cendter Part of Logo
                    ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + ProName + "</th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">JE Source Code Listing</th></tr></thead></table></td>");
                    /// Cendter Part of Logo End
                    ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                    ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintingDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdID));

                    ojbSB.Append("<td>" + PrintingDate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                    // Header End here 
                    #endregion FirstPage
                    #region Second
                    ojbSB.Append("<table style=\"width:10.5in;font-size:12px; border-collapse:collapse; border:1px solid #ccc;border-spacing: 0px;\"><thead>");
                    ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Module</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Description</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">AP</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">JE</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">PO</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">PC</th>");
                    //ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">AP</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">PR</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">WT</th></tr></thead>");
                    // ojbSB.Append("<th colspan=\"4\" style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Check Information</th></tr></thead>");

                    for (int i = 0; i < strResult.Count; i++)
                    {
                        ojbSB.Append("<tbody><tr style=\"height:25px;\">");
                        ojbSB.Append("<td style=\"padding-left:5px;\">" + strResult[i].Code + "</td>");
                        ojbSB.Append("<td>" + strResult[i].Description + "</td>");
                        ojbSB.Append("<td>" + strResult[i].AP + "</td>");
                        ojbSB.Append("<td>" + strResult[i].JE + "</td>");
                        ojbSB.Append("<td>" + strResult[i].PO + "</td>");
                        ojbSB.Append("<td>" + strResult[i].PC + "</td>");
                        //ojbSB.Append("<td>" + strResult[i].AP + "</td>");
                        ojbSB.Append("<td>" + strResult[i].PR + "</td>");
                        ojbSB.Append("<td>" + strResult[i].WT + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                    }
                    ojbSB.Append("</table></body></html>");
                    #endregion Second
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        ////======================== Transaction Code  Listing =====================//   
        [Route("TransactionCodeListing")]
        [HttpPost]
        public string TransactionCodeListing(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(JOrigin["ProdID"]);
                    string ProName = Convert.ToString(JOrigin["ProName"]);

                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var strResult = BusinessContext.GetTransCodeValuByProdID(ProdID);

                    //GetTransCodeValuByProdID(ProdID)
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();
                    #region FirstPage

                    ojbSB.Append("<html><head></head>");
                    ojbSB.Append(" <body><table style=\"width: 10.5in;border-spacing: 0px;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;\"><thead><tr><td></td>");
                    ojbSB.Append("<td></td></tr>");

                    ojbSB.Append("</thead></table></td>");
                    /// Cendter Part of Logo
                    ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + ProName + "</th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">Transaction Codes Listing</th></tr></thead></table></td>");
                    /// Cendter Part of Logo End
                    ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                    ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintingDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdID));

                    ojbSB.Append("<td>" + PrintingDate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                    // Header End here 
                    #endregion FirstPage
                    #region Second
                    ojbSB.Append("<table style=\"width:10.5in;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                    ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Transaction Code</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Value</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Description</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Active</th></tr></thead>");
                    for (int i = 0; i < strResult.Count; i++)
                    {

                        ojbSB.Append("<tbody>");
                        ojbSB.Append("<tr style=\"height:25px;\">");
                        if (strResult[i].Parent == "")
                        {
                            ojbSB.Append("<td style=\"background-color:#FFFAE3;padding-left:5px;\">" + strResult[i].Trcode + "</td>");
                            ojbSB.Append("<td style=\"background-color:#FFFAE3; height:25px;\"></td>");

                            ojbSB.Append("<td style=\"background-color:#FFFAE3; height:25px;\">" + strResult[i].TRDes + "</td>");
                            ojbSB.Append("<td style=\"background-color:#FFFAE3; height:25px;\">" + strResult[i].Trstatus + "</td>");

                        }
                        else
                        {
                            ojbSB.Append("<td ></td>");
                            ojbSB.Append("<td>" + strResult[i].Trcode + "</td>");
                            ojbSB.Append("<td>" + strResult[i].TRDes + "</td>");
                            ojbSB.Append("<td>" + strResult[i].Trstatus + "</td>");
                        }


                        ojbSB.Append("</tr>");

                        ojbSB.Append("</tbody>");
                    }
                    ojbSB.Append("</table></body></html>");
                    #endregion Second
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            else
            {
                return "";
            }
        }

        ////======================== PettyCash Custodian Listing =====================//   
        [Route("PettyCashCustodianList")]
        [HttpPost]
        public string PettyCashCustodianList(CustodianDetail CD)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var srtRD = CD.objRD;
                    POInvoiceBussiness BusinessContext = new POInvoiceBussiness();
                    var strResult = BusinessContext.GetListOfCustodian(CD.ProdId);
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();
                    #region FirstPage

                    ojbSB.Append("<html><head>Petty Cash Custodian</head>");
                    ojbSB.Append(" <body><table style=\"width: 100%;border-spacing: 0px;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;\"><thead><tr><td></td>");
                    ojbSB.Append("<td></td></tr>");

                    ojbSB.Append("</thead></table></td>");
                    /// Cendter Part of Logo
                    ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + srtRD.ProductionName + "</th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">Petty Cash Custodian Listing</th></tr></thead></table></td>");
                    /// Cendter Part of Logo End
                    ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                    ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintingDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(CD.ProdId));


                    ojbSB.Append("<td>" + PrintingDate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                    // Header End here 
                    #endregion FirstPage
                    #region Second
                    ojbSB.Append("<table style=\"width:100%;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                    ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Custodian Code</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Currency</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Vendor</th>");

                    int strHeaderCount = 3;
                    int strDetailPosition = 0;

                    string strSegment = srtRD.Segment;
                    string[] strSegment1 = strSegment.Split(',');
                    string strSClassification = srtRD.SClassification;
                    string[] strSClassification1 = strSClassification.Split(',');
                    for (int z = 0; z < strSegment1.Length; z++)
                    {
                        if (strSClassification1[z] == "Detail")
                        {
                            strHeaderCount++;
                            strDetailPosition = z;
                            ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + strSegment1[z] + " </th>");
                        }
                        else
                        {
                            strHeaderCount++;
                            ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + strSegment1[z] + " </th>");
                        }
                    }
                    var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                    for (int z = 0; z < strOptionalSegment.Length; z++)
                    {
                        strHeaderCount++;
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + strOptionalSegment[z] + "</th>");
                    }
                    ojbSB.Append("</tr></thead>");

                    for (int i = 0; i < strResult.Count; i++)
                    {

                        ojbSB.Append("<tbody>");
                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td style=\"padding-left:5px;\">" + strResult[i].CustodianCode + "</td>");
                        ojbSB.Append("<td>USD</td>");
                        ojbSB.Append("<td>" + strResult[i].VendorName + "</td>");
                        var COACode = strResult[i].COACode;
                        var SplitCoa = COACode.Split('|');
                        for (int k = 0; k < SplitCoa.Length; k++)
                        {
                            if (strDetailPosition == k)
                            {
                                string strCOADetail = SplitCoa[k];
                                string[] strDetail = strCOADetail.Split('>');
                                if (strDetail.Length == 1)
                                {
                                    ojbSB.Append("<td>" + strDetail[0] + "</td>");
                                }
                                else
                                {
                                    ojbSB.Append("<td>" + strDetail[strDetail.Length - 1] + "</td>");
                                }
                            }
                            else
                            {
                                ojbSB.Append("<td>" + SplitCoa[k] + "</td>");
                            }
                        }
                        var strSegmentOptioanl = srtRD.SegmentOptional;
                        var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                        for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                        {
                            if (k == 0)
                            {
                                ojbSB.Append("<td style=\"border-bottom: 1px solid black;\">" + strResult[k].SetCode + "</td>");
                            }
                            if (k == 1)
                            {
                                ojbSB.Append("<td style=\"border-bottom: 1px solid black;\">" + strResult[k].SeriesCode + "</td>");
                            }
                        }
                        ojbSB.Append("</tr>");

                        ojbSB.Append("</tbody>");
                    }
                    ojbSB.Append("</table></body></html>");
                    #endregion Second
                    string stest = ojbSB.ToString();

                    stest = stest.Replace("&", "&#38;");
                    PDFCreation BusinessContext1 = new PDFCreation();
                    DateTime CurrentDate1 = DateTime.Now;
                    string ReturnName1 = "SetupReports" + (CurrentDate1.ToShortTimeString().Replace(":", "_").Replace(" ", "_"));
                    var ResponseResult = BusinessContext1.ReportPDFGenerateFolder("Reports/SetupReports", ReturnName1, "SetupReports", stest);
                    string[] strResultResponse = ResponseResult.Split('/');
                    string strRes = strResultResponse[2];

                    return strRes;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        ////======================== Set Listing =====================//   
        [Route("GetSetListing")]
        [HttpPost]
        public string GetTblAccountDetailsByCategory(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(JOrigin["ProdID"]);
                    string ProName = Convert.ToString(JOrigin["ProName"]);
                    string Category = Convert.ToString(JOrigin["Category"]);
                    LedgerBusiness BusinessContext = new LedgerBusiness();
                    var strResult = BusinessContext.GetTblAccountDetailsByCategory(ProdID, Category);
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();
                    #region FirstPage

                    ojbSB.Append("<html><head></head>");
                    ojbSB.Append(" <body><table style=\"width: 10.5in;border-spacing: 0px;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;\"><thead><tr><td></td>");
                    ojbSB.Append("<td></td></tr>");

                    ojbSB.Append("</thead></table></td>");
                    /// Cendter Part of Logo
                    ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + ProName + "</th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">Sets Listing</th></tr></thead></table></td>");
                    /// Cendter Part of Logo End
                    ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                    ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintingDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdID));

                    ojbSB.Append("<td>" + PrintingDate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                    // Header End here 
                    #endregion FirstPage
                    #region Second
                    ojbSB.Append("<table style=\"width:10.5in;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                    ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Account Code</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Account Name</th>");
                    //   ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Posting</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Status</th></tr></thead>");
                    ojbSB.Append("<tbody>");
                    for (int i = 0; i < strResult.Count; i++)
                    {

                        ojbSB.Append("<tr style=\"height:25px;\">");
                        ojbSB.Append("<td style=\"padding-left:5px;\">" + strResult[i].AccountCode + "</td>");
                        ojbSB.Append("<td>" + strResult[i].AccountName + "</td>");
                        ojbSB.Append("<td>" + strResult[i].Status + "</td>");
                        //  ojbSB.Append("<td>" + strResult[i].Status + "</td>");

                        ojbSB.Append("</tr>");
                    }
                    ojbSB.Append("</tbody>");
                    ojbSB.Append("</table></body></html>");
                    #endregion Second
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        ////======================== Location Listing =====================//   
        [Route("GetLocationListing")]
        [HttpPost]
        public string GetLocationListing(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(JOrigin["ProdID"]);
                    string ProName = Convert.ToString(JOrigin["ProName"]);
                    string Category = Convert.ToString(JOrigin["Category"]);
                    LedgerBusiness BusinessContext = new LedgerBusiness();
                    var strResult = BusinessContext.GetTblAccountDetailsByCategory(ProdID, Category);
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();
                    #region FirstPage

                    ojbSB.Append("<html><head></head>");
                    ojbSB.Append(" <body><table style=\"width: 10.5in;border-spacing:0px;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;\"><thead><tr><td></td>");
                    ojbSB.Append("<td></td></tr>");

                    ojbSB.Append("</thead></table></td>");
                    /// Cendter Part of Logo
                    ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + ProName + "</th></tr>");
                    ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">" + Category + " Listing</th></tr></thead></table></td>");
                    /// Cendter Part of Logo End
                    ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                    ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                    ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintingDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdID));

                    ojbSB.Append("<td>" + PrintingDate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                    // Header End here 
                    #endregion FirstPage
                    #region Second
                    ojbSB.Append("<table style=\"width:10.5in;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                    ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Account Code</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Account Name</th>");
                    //  ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Posting</th>");
                    ojbSB.Append("<th style=\"height: 25px; text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Status</th></tr></thead>");
                    ojbSB.Append("<tbody>");
                    for (int i = 0; i < strResult.Count; i++)
                    {

                        ojbSB.Append("<tr style=\"height:25px;\">");

                        ojbSB.Append("<td style=\"padding-left:5px;\">" + strResult[i].AccountCode + "</td>");
                        ojbSB.Append("<td>" + strResult[i].AccountName + "</td>");
                        ojbSB.Append("<td>" + strResult[i].Status + "</td>");
                        ojbSB.Append("</tr>");


                    }
                    ojbSB.Append("</tbody>");
                    ojbSB.Append("</table></body></html>");
                    #endregion Second
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        //=====================Ledger Inquiry Report================//
        [Route("LedgerInQuiry")]
        [HttpPost]
        //public string LedgerInQuiry(LdgerInQuiryFinal LE)
        public string LedgerInQuiry(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));

                    LdgerInQuiryFinal LE = JsonConvert.DeserializeObject<LdgerInQuiryFinal>(Convert.ToString(Payload["LE"]));

                    int strTdCount = 0;
                    var srtRD = LE.ObjRD; //JsonConvert.DeserializeObject<dynamic>(Convert.ToString(Payload["ObjRD"]));// LE.ObjRD;
                    var srtBR = LE.objLInquiry; //JsonConvert.DeserializeObject<dynamic>(Convert.ToString(Payload["objLInquiry"]));// LE.objLInquiry;

                    var StrCompany = new object();
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var strResult = BusinessContext.ReportsLedgerInQuiryAccountJSON(Convert.ToString(Payload));
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        return ReportEngineController.MakeJSONExport(strResult);
                    }
                    var CompanyName = BusinessContext.GetCompanyNameByID(Convert.ToInt32(srtBR.Companyid));
                    string ReportTitle = "General Ledger Inquiry by Account";
                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder ojbSB1 = new StringBuilder();

                    if (strResult.Count == 0) { return ""; }
                    else
                    {

                        int ColExtVal = 12;
                        string strSegmentH = srtRD.Segment;
                        string[] strSegment1H = strSegmentH.Split(',');
                        string strSClassificationH = srtRD.SClassification;
                        string[] strSClassification1H = strSClassificationH.Split(',');

                        ColExtVal += strSegment1H.Length;

                        if (srtRD.SegmentOptional != "")
                        {
                            var strOptionalSegmentH = srtRD.SegmentOptional.Split(',');
                            ColExtVal += strOptionalSegmentH.Length;
                        }

                        string TransCodeH = srtRD.TransCode;
                        string[] TransCode1H = TransCodeH.Split(',');
                        ColExtVal += TransCode1H.Length;


                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title>General Ledger Inquiry by Account</title>");
                        ojbSB.Append("<style>");
                        ojbSB.Append(".header-td {padding: 0px; font-size: 12px; float: left;} ");
                        ojbSB.Append(".data-th { text-align:left; padding: 1px 3px; font-size: 11px; border-top-width: 1px; border-top: 1px solid black;}");
                        ojbSB.Append("</style>");
                        ojbSB.Append("</head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table border=0 style='width: 10.5in; border-collapse: collapse; repeat-header: yes;'>");

                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr><th colspan='" + ColExtVal + "'>");

                        #region Header
                        string PostedDateFrom = (srtBR.PostedDateFrom.ToString() == "" ? "ALL" : Convert.ToDateTime(srtBR.PostedDateFrom).ToShortDateString());
                        string PostedDateTo = (srtBR.PostedDateTo.ToString() == "" ? "ALL" : Convert.ToDateTime(srtBR.PostedDateTo).ToShortDateString());
                        string TrStart = (srtBR.TrStart == 0 ? "ALL" : srtBR.TrStart.ToString());
                        string TrEnd = ((srtBR.Trend == 9999999) || (srtBR.Trend == 0) ? "ALL" : srtBR.Trend.ToString());
                        string DTFrom = (Payload.fieldsetSegments.fieldsetSegments_DTFrom == "" ? "ALL" : Payload.fieldsetSegments.fieldsetSegments_DTFrom);
                        string DTTo = (Payload.fieldsetSegments.fieldsetSegments_DTTo == "") ? "ALL" : Payload.fieldsetSegments.fieldsetSegments_DTTo;
                        string TaxCode = (Payload.TaxCode.ToString() == "") ? "ALL" : Payload.TaxCode.ToString();
                        string TransactionType = (srtBR.TransactionType == "") ? "ALL" : srtBR.TransactionType;
                        string CurrencyFilter = (Payload.fieldsetCurrency.CurrencyFilter.ToString() == "") ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                        ojbSB.Append("<table style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;'>Company : " + (srtBR.Companyid == 0 ? "ALL" : CompanyName[0].CompanyCode) + "</td>");
                        ojbSB.Append("<th class='header-td' style='width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Date From : " + PostedDateFrom}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;'>");
                        if (srtRD.SClassification.IndexOf("Episode") != -1)
                        {
                            ojbSB.Append("Episode(s) : " + (string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP) == "" ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP)));
                        } else
                        {
                            ojbSB.Append("&nbsp;");
                        }
                        ojbSB.Append("</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align:center;'>" + srtRD.ProductionName + "</th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Date To : " + PostedDateTo}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;'>Location(s) : " + (string.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO) == "" ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO)) + "</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align: center;'>" + CompanyName[0].CompanyName + "</th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Transaction No. From : " + TrStart}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%; overflow: hidden;'>Batch : " + (srtBR.Batch == null ? "ALL" : string.Join(",", srtBR.Batch)) + "</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%;'>  &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Transaction No. To : " + TrEnd}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;'>{"TaxCode: " + TaxCode}</td>");
                        ojbSB.Append($"<th class='header-td' style='font-size: 16px; width: 60%; text-align: center;'>{ReportTitle}</th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Account From : " + DTFrom}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;'>Period : " + (srtBR.PeriodStatus == "" ? "ALL" : srtBR.PeriodStatus) + "</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 16px; width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right; '>{"Account To : " + DTTo}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;'>{"Filter Currency : " + CurrencyFilter}</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 16px; width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Transaction Type : " + TransactionType}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;'>{"Report Currency : " + Payload.fieldsetCurrency.CurrencyReport.ToString()}</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 16px; width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width:20%;text-align: right;'>{"Report Date : " + LE.objLInquiry.ReportDate}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        #endregion Header
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");


                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");

                        #region SegmentOrder
                        int strDetailPosition = 0;
                        bool isSegmentOrder = false;
                        string strSegment = srtRD.Segment;
                        if (srtRD.SegmentOrder != null)
                        {
                            strSegment = srtRD.SegmentOrder;
                            isSegmentOrder = true;
                        }
                            
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');

                        strTdCount = strTdCount + Convert.ToInt32(strSegment1.Length - 1);
                        int ColNo = 11; // There are a minimum of 11 fixed columns on this report: TaxCode, Line Item Description, Vendor Name, Trans#, Doc Date, TT, Cur, Per, Document#, Posted Date, Amount
                        string ColWidthSegment = "18";

                        for (int a = 0; a < strSegment1.Length; a++)
                        {
                            if (strSegment1[a].ToString() == "DT") ColWidthSegment = "33";
                            ColNo++;
                            ojbSB.Append("<th width='" + ColWidthSegment + "' class='data-th' style=' color: #000000;'>" + strSegment1[a].ToString() + " </th>");
                        }
                        #endregion SegmentOrder

                        var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                        if (srtRD.SegmentOptional != "")
                        {
                            strTdCount += Convert.ToInt32(strOptionalSegment.Length);

                            for (int a = 0; a < strOptionalSegment.Length; a++)
                            {
                                ColNo++;
                                //  ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + strOptionalSegment[a] + "</th>");
                                ojbSB.Append("<th width='18' class='data-th' style=' color: #000000;'>" + strOptionalSegment[a] + " </th>");
                            }
                        }

                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = { };
                        if (TransCode != "")
                        {
                            TransCode1 = TransCode.Split(',');
                            strTdCount = strTdCount + Convert.ToInt32(TransCode1.Length);

                            for (int a = 0; a < TransCode1.Length; a++)
                            {
                                ColNo++;
                                // ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + TransCode1[a] + " </th>");
                                ojbSB.Append("<th width='18' class='data-th' style=' color: #000000;'>" + TransCode1[a] + " </th>");
                            }
                        }

                        //                        ojbSB.Append("<th style='padding: 1px 3px; font-size: 11px; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>1099</th>");
                        ojbSB.Append("<th class='data-th'> TaxCode</th>");
                        ojbSB.Append("<th colspan='2' width='120' class='data-th'>Line Item Description</th>");
                        ojbSB.Append("<th width='60' class='data-th'>Vendor Name</th>");
                        ojbSB.Append("<th class='data-th'>Trans#</th>");
                        ojbSB.Append("<th class='data-th'>Doc Date</th>");
                        ojbSB.Append("<th class='data-th'>TT</th>");
                        ojbSB.Append("<th class='data-th'>Cur.</th>");
                        ojbSB.Append("<th class='data-th'>Per.</th>");
                        ojbSB.Append("<th class='data-th'>Document#</th>");
                        ojbSB.Append("<th class='data-th'>Posted Date</th>");

                        ojbSB.Append("<th style='padding: 1px 3px 1px 3px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; border-right-width: 1px; border-right: 1px solid black;'>Amount</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        ojbSB.Append("<tbody>");

                        string strPreAcct = "";
                        decimal TotalAmt = 0;

                        for (int z = 0; z < strResult.Count; z++)
                        {
                            string strType = strResult[z].AcctDescription;

                            if (z == 0)
                            {
                                int HeadSpan = ColNo + 2; // We add 2 for detail columns that span more than one colum: Line Description
                                ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                ojbSB.Append("<td colspan=" + (HeadSpan) + " style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px; font-size: 10px;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                // ojbSB.Append("<td colspan=\"3\" style=\"border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: center; font-size: 10px;\">Begining Balance:</td>");
                                // ojbSB.Append("<td  style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right; font-size: 10px;\">$" + Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("</tr>");
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    decimal strAmount = 0;

                                    for (int zz = 0; zz < strResult.Count; zz++)
                                    {
                                        if (strPreAcct == strResult[zz].Acct)
                                        {
                                            strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                        }
                                    }
                                    ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                    ojbSB.Append("<td colspan=\"" + (Convert.ToInt32(ColNo) - 2) + "\"></td>");
                                    ojbSB.Append("<td colspan=\"2\" style=\"font-weight:bold; font-size: 10px;\">Total For Account:</td>");
                                    ojbSB.Append("<td style=\"text-align: left;font-weight:bold;border-bottom: 1px solid black; font-size: 10px;text-align:right;\">" + Convert.ToDecimal(strAmount).ToString("$#,##0.00") + "</td>");
                                    ojbSB.Append("</tr>");
                                }
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    int HeadSpan = ColNo + 2; // We add 2 for detail columns that span more than one colum: Line Description
                                    ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=" + (HeadSpan) + " style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px; font-size: 10px;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                    //  ojbSB.Append("<td colspan=\"3\" style=\"border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: center; font-size: 10px;\">Begining Balance:</td>");
                                    //  ojbSB.Append("<td  style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px; text-align: right; font-size: 10px;\">$" + Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00") + "</td>");
                                    ojbSB.Append("</tr>");
                                }
                            }

                            ojbSB.Append("<tr style=\"background-Color:#FFF; border-bottom-width: 0px;border-bottom: 1px solid black;height: 13px;\">");

                            //ojbSB.Append("<td style=\" font-size: 10px;\">" + strResult[z].Acct + "</td>");
                            var CoaCode = strResult[z].COAString;
                            var straa = CoaCode.Split('|');
                            Newtonsoft.Json.Linq.JObject SegmentJSON = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject<dynamic>(strResult[z].Segments)[0];

                            bool hasSet = false;
                            string theSET = strResult[z].SetCode??"";
                            if (straa.Length > strSClassification1H.Count()) { hasSet = true; }

                            int addedcolumns = 0;
                            if (isSegmentOrder)
                            {
                                addedcolumns = SegmentJSON.Count - 1;
                                foreach (var Seg in SegmentJSON)
                                {
                                    string thekey = Seg.Key;
                                    string thevalue = (string)Seg.Value;
                                    if (thekey.ToUpper() == "DT")
                                    {
                                        thevalue = thevalue.Substring(thevalue.LastIndexOf(">") + 1);
                                    }
                                    ojbSB.Append("<td style=\" font-size: 10px;\">" + thevalue + "</td>");
                                }
                            }
                            else
                            {
                                for (int k = 0; k < straa.Length; k++)
                                {
                                    if (k == 0)
                                    { }
                                    else
                                    {
                                        if (strDetailPosition != k)
                                        {
                                            ojbSB.Append("<td style=\" font-size: 10px;\">" + straa[k] + "</td>");
                                            addedcolumns++;
                                        }
                                        if (k > strSClassification1H.Count() - 1) { theSET = straa[k]; }

                                    }
                                }
                            }
                            // ojbSB.Append("<td style=\"padding:5px 10px; font-size:10px text-align:left;\"></td>"); /// Account Description
                            var strSegmentOptioanl = srtRD.SegmentOptional;
                            var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                            if (strSegmentOptioanl != "")
                            {
                                for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                                {
                                    //if ((k == 0) && (addedcolumns == 1))
                                    //{
                                    ojbSB.Append("<td style=\" font-size: 10px;\">" + theSET + "</td>"); /// set 
                                    //}
                                    //if (k == 1)
                                    //{
                                    //    ojbSB.Append("<td style=\"text-align: left;\"></td>"); /// Series
                                    //}
                                }
                            }
                            string strTransString = strResult[z].TransactionCode;

                            string strMemoCodesHTML = ReportEngineController.MakeMemoCodesHTML(TransCode1, strTransString);
                            ojbSB.Append(strMemoCodesHTML);
                            ojbSB.Append("<td style=\" font-size: 10px; \">" + strResult[z].TaxCode + "</td>");
                            ojbSB.Append("<td colspan='2' style=\" font-size: 10px; text-align:left; \">" + strResult[z].LineDescription.Replace("<", "&lt;").Replace(">", "&gt;") + "</td>");
                            ojbSB.Append("<td style=\" font-size: 10px; text-align:left; \">" + strResult[z].VendorName + "</td>");
                            ojbSB.Append("<td style=\" font-size: 10px;\">" + strResult[z].TransactionNumber + "</td>");
                            ojbSB.Append("<td style=\" font-size: 10px;\">" + Convert.ToDateTime(strResult[z].DocDate).ToShortDateString() + "</td>"); //
                            ojbSB.Append("<td style=\" font-size: 10px;\">" + strResult[z].Source + "</td>");
                            ojbSB.Append("<td style=\" font-size: 10px;\">USD</td>");
                            ojbSB.Append("<td style=\" font-size: 10px;\">" + strResult[z].ClosePeriod + "</td>");
                            ojbSB.Append("<td style=\" font-size: 10px;\">" + strResult[z].DocumentNo + "</td>");
                            ojbSB.Append("<td style=\" font-size: 10px;\">" + Convert.ToDateTime(strResult[z].PostedDate).ToShortDateString() + "</td>"); //
                            ojbSB.Append("<td style=\"text-align: right; font-size: 10px;\">" + Convert.ToDecimal(strResult[z].Amount).ToString("$#,##0.00") + "</td>");
                            ojbSB.Append("</tr>");

                            TotalAmt += Convert.ToDecimal(strResult[z].Amount);
                            strPreAcct = strResult[z].Acct;

                            if (z == strResult.Count - 1)
                            {
                                decimal strAmount = 0;
                                for (int zz = 0; zz < strResult.Count; zz++)
                                {
                                    if (strPreAcct == strResult[zz].Acct)
                                    {
                                        strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                    }
                                }

                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\"" + (Convert.ToInt32(ColNo) - 2) + "\"></td>");
                                ojbSB.Append("<td colspan=\"2\" style=\"font-weight:bold; font-size: 10px;\">Total For Account:</td>");
                                ojbSB.Append("<td style=\"text-align: right;font-weight:bold;border-bottom: 1px solid black; font-size: 10px;\">" + Convert.ToDecimal(strAmount).ToString("$#,##0.00") + "</td>");
                                ojbSB.Append("</tr>");

                            }
                        }

                        #region reporttotal
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 3px 7px; font-size: 11px; font-weight: bold;' colspan='" + (ColExtVal - 4) + "'></th>");
                        ojbSB.Append("<th style='text-align:left; font-size: 10px; font-weight: bold;' colspan='2'>Report Total :</th>");
                        ojbSB.Append("<th style='text-align:right; font-size: 10px; font-weight: bold;'>" + TotalAmt.ToString("$#,##0.00") + "</th>");
                        ojbSB.Append("</tr>");
                        #endregion reporttotal



                        ojbSB.Append("</tbody></table></body></html>");

                        string stest = ojbSB.ToString();
                        string json = "{\"reportdata\":\""
                                    + ojbSB.ToString()
                                        + "}";
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }


        [Route("LedgerInQuiryTransaction")]
        [HttpPost]
        public string LedgerInQuiryTransaction(JSONParameters callParameters/*LdgerInQuiryFinal LE*/)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    ReportsBussiness BusinessContext = new ReportsBussiness();

                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    LdgerInQuiryFinal LE = JsonConvert.DeserializeObject<LdgerInQuiryFinal>(Convert.ToString(Payload["LE"]));

                    var strResult = BusinessContext.ReportsLedgerInQuiryAccountJSON(Convert.ToString(Payload));
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        return ReportEngineController.MakeJSONExport(strResult);
                    }

                    var srtRD = LE.ObjRD;
                    var srtBR = LE.objLInquiry;
                    var CompanyName = BusinessContext.GetCompanyNameByID(Convert.ToInt32(srtBR.Companyid));
                    string ReportTitle = (Payload["ReportTitle"] ?? "") == "" ? "General Ledger Inquiry by Transaction" : Payload.ReportTitle.ToString();

                    var StrCompany = new object();
                    string Amt = "";
                    int strTdCount = 0;

                    StringBuilder ojbSB = new StringBuilder();
                    StringBuilder sbLine = new StringBuilder();

                    if (strResult.Count == 0)
                    {
                        return "";
                    }
                    else
                    {

                        int ColExtVal = 12;
                        string strSegmentH = srtRD.Segment;
                        string[] strSegment1H = strSegmentH.Split(',');
                        string strSClassificationH = srtRD.SClassification;
                        string[] strSClassification1H = strSClassificationH.Split(',');

                        int ExtraCol = 0;
                        int LocationPostion = 0;
                        int EpisodePostion = 0;

                        for (int a = 0; a < strSegment1H.Length; a++)
                        {
                            if (strSClassification1H[a] == "Company")
                            {

                            }
                            else if (strSClassification1H[a] == "Detail")
                            {

                            }
                            else
                            {
                                if (strSClassification1H[a] == "Location")
                                {
                                    LocationPostion = a;
                                }
                                else if (strSClassification1H[a] == "Episode")
                                {
                                    EpisodePostion = a;
                                }
                                ColExtVal++;
                                ExtraCol++;
                            }
                        }


                        var strOptionalSegmentH = srtRD.SegmentOptional.Split(',');

                        for (int a = 0; a < strOptionalSegmentH.Length; a++)
                        {
                            ColExtVal++;
                            ExtraCol++;
                        }

                        string TransCodeH = srtRD.TransCode;
                        string[] TransCode1H = TransCodeH.Split(',');

                        for (int a = 0; a < TransCode1H.Length; a++)
                        {
                            ColExtVal++;
                            ExtraCol++;
                        }

                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title>General Ledger Inquiry by Transaction</title>");
                        ojbSB.Append("<style>");
                        ojbSB.Append(" .header-td {padding: 0px; font-size: 12px; float: left;} ");
                        ojbSB.Append(" .data-th { text-align:left; padding: 1px 3px; font-size: 11px; border-top-width: 1px; border-top: 1px solid black;}");
                        ojbSB.Append(" .linedata { font-size: 10px; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;}");
                        ojbSB.Append("</style>");
                        ojbSB.Append("</head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table border=0 style='width: 10.5in; float: left; repeat-header: yes; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + (ColExtVal + 2) + "'>");

                        #region reportHeader
                        string PostedDateFrom = (srtBR.PostedDateFrom.ToString() == "" ? "ALL" : Convert.ToDateTime(srtBR.PostedDateFrom).ToShortDateString());
                        string PostedDateTo = (srtBR.PostedDateTo.ToString() == "" ? "ALL" : Convert.ToDateTime(srtBR.PostedDateTo).ToShortDateString());
                        string TrStart = (srtBR.TrStart == 0 ? "ALL" : srtBR.TrStart.ToString());
                        string TrEnd = ((srtBR.Trend == 9999999) || (srtBR.Trend == 0) ? "ALL" : srtBR.Trend.ToString());
                        string DTFrom = (String.IsNullOrEmpty((string)Payload.fieldsetSegments.fieldsetSegments_DTFrom) ? "ALL" : Payload.fieldsetSegments.fieldsetSegments_DTFrom);
                        string DTTo = (String.IsNullOrEmpty((string)Payload.fieldsetSegments.fieldsetSegments_DTTo) ? "ALL" : Payload.fieldsetSegments.fieldsetSegments_DTTo);
                        string TaxCode = (String.IsNullOrEmpty((string)Payload.TaxCode) ? "ALL" : Payload.TaxCode.ToString());
                        string TransactionType = String.IsNullOrEmpty(srtBR.TransactionType) ? "ALL" : srtBR.TransactionType;
                        string CurrencyFilter = (Payload.fieldsetCurrency.CurrencyFilter ?? "") == "" ? "ALL" : Payload.fieldsetCurrency.CurrencyFilter.ToString();
                        ojbSB.Append("<table style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;'>Company : " + (srtBR.Companyid == 0 ? "ALL" : CompanyName[0].CompanyCode) + "</td>");
                        ojbSB.Append("<th class='header-td' style='width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Date From : " + PostedDateFrom}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;'>");
                        if (srtRD.SClassification.IndexOf("Episode") != -1)
                        {
                            ojbSB.Append($"Episode(s) : {(Payload.fieldsetSegments.fieldsetSegments_EP == null ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_EP))}");
                        }
                        else
                        {
                            ojbSB.Append("&nbsp;");
                        }
                        ojbSB.Append("</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align:center;'>" + srtRD.ProductionName + "</th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Date To : " + PostedDateTo}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;'>Location(s) : {(Payload.fieldsetSegments.fieldsetSegments_LO == null ? "ALL" : string.Join(",", Payload.fieldsetSegments.fieldsetSegments_LO))}</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%; text-align: center;'>" + CompanyName[0].CompanyName + "</th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Transaction No. From : " + TrStart}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%; overflow: hidden;'>Batch : " + (srtBR.Batch == null ? "ALL" : string.Join(",", srtBR.Batch)) + "</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 17px; width: 60%;'>  &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Transaction No. To : " + TrEnd}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;'>{"TaxCode: " + TaxCode}</td>");
                        ojbSB.Append($"<th class='header-td' style='font-size: 16px; width: 60%; text-align: center;'>{ReportTitle}</th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Account From : " + DTFrom}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td class='header-td' style='width: 20%;'>Period : " + (String.IsNullOrEmpty(srtBR.PeriodStatus) ? "ALL" : srtBR.PeriodStatus) + "</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 16px; width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right; '>{"Account To : " + DTTo}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;'>{"Filter Currency : " + CurrencyFilter}</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 16px; width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;text-align: right;'>{"Transaction Type : " + TransactionType}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append($"<td class='header-td' style='width: 20%;'>{"Report Currency : " + Payload.fieldsetCurrency.CurrencyReport.ToString()}</td>");
                        ojbSB.Append("<th class='header-td' style='font-size: 16px; width: 60%;'> &nbsp; </th>");
                        ojbSB.Append($"<td class='header-td' style='width:20%;text-align: right;'>{"Report Date : " + LE.objLInquiry.ReportDate}</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        #endregion reportHeader

                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");

                        #region datalistheader
                        int strDetailPosition = 0;
                        string strSegment = srtRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');

                        strTdCount = strTdCount + Convert.ToInt32(strSegment1.Length - 1);
                        int ColNo = 13;

                        //  ojbSB.Append("<tr style='background-color: #DFE4F7;'>"); For Changing Background Color
                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                        ojbSB.Append("<th width='45' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'>Account</th>");

                        for (int a = 0; a < strSegment1.Length; a++)
                        {
                            if (strSClassification1[a] == "Company")
                            {
                            }
                            else if (strSClassification1[a] == "Detail")
                            {
                                ColNo++;
                                strDetailPosition = a;
                            }
                            else
                            {
                                ColNo++;
                                ojbSB.Append("<th width='18' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'>" + strSegment1[a] + "</th>");
                            }
                        }

                        var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strOptionalSegment.Length);

                        for (int a = 0; a < strOptionalSegment.Length; a++)
                        {
                            ColNo++;
                            ojbSB.Append("<th width='18' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'>" + strOptionalSegment[a] + "</th>");
                        }

                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1.Length);

                        for (int a = 0; a < TransCode1.Length; a++)
                        {
                            ColNo++;
                            ojbSB.Append("<th width='18' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'>" + TransCode1[a] + "</th>");
                        }

                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;width:50px;'>1099</th>");
                        ojbSB.Append("<th width='140' colspan=2 style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;text-align: left;'>Line Item Description</th>");
                        //ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;width:120px;text-align: left;'>Reference Vendor</th>");
                        ojbSB.Append("<th width='25' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'>Trans#</th>");
                        ojbSB.Append("<th width='140' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;width:50px;'>Doc Date</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;width:30px;'>TT</th>");
                        ojbSB.Append("<th style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;width:30px;'>Curr.</th>");
                        ojbSB.Append("<th colspan='2' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;width:30px;'>Per.</th>");
                        //ojbSB.Append("<th style='padding: 3px 7px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'>Document#</th>");
                        ojbSB.Append("<th width='140' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;width:50px;'>Posted Date</th>");
                        ojbSB.Append("<th width='40' colspan='2' style='padding: 1px 1px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'>Check#</th>");
                        //                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 10px;  border-top-width: 1px; border-top: 1px solid black;'></th>");
                        ojbSB.Append("<th width='60' style='padding: 1px 1px; font-size: 10px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Amount</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("</thead>");
                        #endregion  datalistheader

                        #region ledgerbody
                        ojbSB.Append("<tbody>");

                        string OLDTransaction = "";
                        string NewTransaction = "";

                        decimal TotalAmt = 0;
                        decimal TransTotal = 0;
                        decimal DebitTotal = 0;
                        decimal CreditTotal = 0;

                        for (int z = 0; z < strResult.Count; z++)
                        {
                            NewTransaction = Convert.ToString(strResult[z].TransactionNumber);
                            if (NewTransaction != OLDTransaction)
                            {
                                if (OLDTransaction != "")
                                {
                                    #region transactionsummary
                                    sbLine.Append("<tr>");
                                    sbLine.Append("<th style='font-size: 10px; font-weight: normal;' colspan='" + (ExtraCol + 9) + "'></th>");

                                    string AmtTrans = "";
                                    AmtTrans = TransTotal.ToString("$#,##0.00");
                                    TransTotal = 0;

                                    sbLine.Append("<th style='font-size: 10px; font-weight: bold;' colspan='4'>Total For Transaction " + strResult[z - 1].TransactionNumber + ":</th>");
                                    sbLine.Append("<th style='font-size: 10px;text-align: right; font-weight: bold;'>" + AmtTrans + "</th>");
                                    sbLine.Append("</tr>");
                                    sbLine.Append("<tr>");
                                    sbLine.Append("<th style='border-bottom-width: 1px; border-bottom: 1px solid black;' colspan='" + (ExtraCol + 14) + "'></th>");
                                    sbLine.Append("</tr>");

                                    sbLine.Replace("<<DEBITSTOTAL>>", DebitTotal.ToString("$#,##0.00"));
                                    sbLine.Replace("<<CREDITSTOTAL>>", CreditTotal.ToString("$#,##0.00"));
                                    #endregion transactionsummary
                                }

                                #region transactionheader
                                sbLine.Append("<tr><td colspan='" + (ColExtVal + 2) + "'><table width='100%' border=0 cellspacing=0><tr>");
                                sbLine.Append("<th style='white-space:nowrap;padding: 5px 10px;font-size: 11px;border-top: 1px solid black;background-color: #FFFAE3;width: 80px;text-align: right;'>Vendor Name: </th>");
                                sbLine.Append("<th style='font-size: 10px;background-color: #FFFAE3;text-align: left;width: 95px !important;border-top: 1px solid black;'>" + WebUtility.HtmlEncode(strResult[z].VendorName) + "</th>");
                                sbLine.Append("<th style='font-size: 10px;text-align: right;border-top: 1px solid black;background-color: #FFFAE3;width: 30px;padding: 5px 10px;' colspan='" + (ExtraCol) + "'>Vendor #:</th>");
                                sbLine.Append("<th style='font-size: 10px;font-weight: bold !important;border-top-width: 1px;border-top: 1px solid black;background-color: #FFFAE3;text-align: left;'>" + ((strResult[z].VendorID ?? 0) == 0 ? "" : strResult[z].VendorID.ToString()) + "</th>");
                                sbLine.Append("<th style='font-size: 10px;border-top: 1px solid black;background-color: #FFFAE3;text-align: right;width: 140px;padding: 5px 10px;'>Document Number:</th>");
                                sbLine.Append("<th style='font-size: 10px;border-top: 1px solid black;background-color: #FFFAE3;width: 160px;text-align: left;'>" + WebUtility.HtmlEncode(strResult[z].DocumentNo) + "</th>");
                                sbLine.Append("<th style='font-size: 10px;text-align: right;border-top: 1px solid black;background-color: #FFFAE3;width: 60px;padding: 5px 10px;' colspan='7'>Trans#:</th>");
                                sbLine.Append("<th style='font-size: 10px;border-top: 1px solid black;background-color: #FFFAE3;width: 70px;text-align: left;'>" + strResult[z].TransactionNumber + "</th>");
                                sbLine.Append(" </tr>");
                                sbLine.Append("<tr>");
                                sbLine.Append("<th style='white-space:nowrap;padding: 5px 10px;font-size: 11px;background-color: #FFFAE3;width: 80px;text-align: right;'>Batch : </th>");
                                sbLine.Append("<th style='font-size: 10px; background-color: #FFFAE3;text-align: left;width: 100px !important;' colspan='" + (ExtraCol + 2) + "'>" + strResult[z].batchnumber + "</th>");
                                sbLine.Append("<th style='font-size: 10px;background-color: #FFFAE3;text-align: right;padding: 5px 10px;'>Document Date :</th>");
                                sbLine.Append("<th style='font-size: 10px;background-color: #FFFAE3;text-align: left;' colspan='6'>" + Convert.ToDateTime(strResult[z].DocDate).ToShortDateString() + "</th>");
                                sbLine.Append("<th style='font-size: 10px;background-color: #FFFAE3;text-align: left;'colspan='3'>Total Debit: &nbsp;&nbsp;&nbsp;<<DEBITSTOTAL>></th>"); //DebitTotal.ToString("$#,##0.00") 
                                sbLine.Append("</tr>");
                                sbLine.Append("<tr>");
                                sbLine.Append("<th style='white-space:nowrap;padding: 5px 10px;font-size: 11px;background-color: #FFFAE3;width: 80px;text-align: right;border-bottom: 1px solid #ccc;'><!--Bank Code:--></th>");
                                sbLine.Append("<th style='font-size: 10px;background-color: #FFFAE3;text-align: left;border-bottom: 1px solid #ccc;' colspan='" + (ExtraCol + 2) + "'><!--01--></th>");
                                sbLine.Append("<th style='font-size: 10px;border-bottom: 1px solid #ccc;background-color: #FFFAE3;padding: 5px 10px;text-align: right;'>Document Description :</th>");
                                sbLine.Append("<th style='font-size: 10px;font-weight: bold !important;border-bottom: 1px solid #ccc;background-color: #FFFAE3;text-align: left;' colspan='6'>" + WebUtility.HtmlEncode(strResult[z].Description) + "</th>");
                                sbLine.Append("<th style='font-size: 10px;background-color: #FFFAE3;text-align: left;border-bottom: 1px solid #ccc;'colspan='3' >Total Credit:&nbsp;&nbsp;&nbsp;<<CREDITSTOTAL>></th>"); //CreditTotal.ToString("$#,##0.00")
                                sbLine.Append("</tr></table></td></tr>");
                                #endregion transactionheader

                                // Reset transaction related values
                                OLDTransaction = Convert.ToString(strResult[z].TransactionNumber);
                                DebitTotal = 0;
                                CreditTotal = 0;
                            }

                            if (strResult[z].Amount < 0)
                            {
                                CreditTotal += strResult[z].Amount;
                            }
                            else
                            {
                                DebitTotal += strResult[z].Amount;
                            }

                            string Location = "";
                            string Episode = "";
                            string CoaCode = strResult[z].COAString;
                            var straa = CoaCode.Split('|');
                            Boolean hasSet = false;
                            string theSET = "";
                            if (straa.Length > strSClassification1H.Count()) { hasSet = true; }
                            for (int k = 0; k < straa.Length; k++)
                            {
                                Boolean isSet = false;
                                if (k == 0)
                                {
                                }
                                else
                                {
                                    if (LocationPostion == k)
                                    {
                                        Location = straa[k];
                                    }
                                    else if (EpisodePostion == k)
                                    {
                                        Episode = straa[k];
                                    }

                                    if (k > strSClassification1H.Count() - 1) { theSET = straa[k]; }
                                }
                            }

                            sbLine.Append("<tr>");
                            sbLine.Append("<th class='linedata'>" + strResult[z].Acct + "</th>");
                            if (LocationPostion != 0)
                            {
                                sbLine.Append("<th class='linedata'>" + Location + "</th>");
                            }
                            // Need non-hard coded handling
                            if (EpisodePostion != 0)
                            {
                                sbLine.Append("<th class='linedata'>" + Episode + "</th>");
                            }

                            var strSegmentOptioanl = srtRD.SegmentOptional;
                            var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                            for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                            {
                                if (k == 0)
                                {
                                    sbLine.Append("<th class='linedata'>" + theSET + "</th>"); /// set 
                                }
                                if (k == 1)
                                {
                                    sbLine.Append("<th class='linedata'></th>"); /// Series
                                }
                            }

                            string strTransString = strResult[z].TransactionCode;
                            string strMemoCodesHTML = ReportEngineController.MakeMemoCodesHTML(TransCode1, strTransString, "font-size: 10px; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;");
                            sbLine.Append(strMemoCodesHTML);

                            sbLine.Append("<th class='linedata'>" + (strResult[z].TaxCode == "0" ? "" : strResult[z].TaxCode) + "</th>");
                            sbLine.Append("<th colspan='2' style='font-size: 10px; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc; text-align: left;'>" + WebUtility.HtmlEncode(strResult[z].LineDescription) + "</th>");
                            //ojbSB.Append("<th style='font-size: 10px; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc; text-align: left;'>" + strResult[z].RefVendor + "</th>");
                            sbLine.Append("<th class='linedata'>" + strResult[z].TransactionNumber + "</th>");
                            sbLine.Append("<th class='linedata'>" + Convert.ToDateTime(strResult[z].DocDate).ToShortDateString() + "</th>");
                            sbLine.Append("<th class='linedata'>" + strResult[z].Source + "</th>");
                            sbLine.Append("<th class='linedata'>USD</th>");
                            sbLine.Append("<th colspan='2' class='linedata'>" + strResult[z].ClosePeriod + "</th>");
                            //ojbSB.Append("<th class='linedata'>" + WebUtility.HtmlEncode(strResult[z].DocumentNo) + "</th>");
                            sbLine.Append("<th class='linedata'>" + Convert.ToDateTime(strResult[z].PostedDate).ToShortDateString() + "</th>");
                            sbLine.Append("<th class='linedata' colspan='2'>" + strResult[z].CheckNumber + "</th>");

                            Amt = "";
                            decimal amtOri = Convert.ToDecimal(strResult[z].Amount);

                            TransTotal += amtOri;
                            TotalAmt += amtOri;
                            Amt = amtOri.ToString("$#,##0.00");

                            sbLine.Append("<th style='font-size: 10px;text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + Amt + "</th>");
                            sbLine.Append("</tr>");
                            ojbSB.Append(sbLine);
                            sbLine.Clear();
                        }
                        ojbSB.Replace("<<DEBITSTOTAL>>", DebitTotal.ToString("$#,##0.00"));
                        ojbSB.Replace("<<CREDITSTOTAL>>", CreditTotal.ToString("$#,##0.00"));
                        // TotalAmt += Convert.ToDecimal(strResult[strResult.Count - 1].Amount);
                        string Val = "";
                        Val = TransTotal.ToString("$#,##0.00");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-size: 10px; font-weight: normal;' colspan='" + (ExtraCol + 9) + "'></th>");
                        ojbSB.Append("<th style='font-size: 10px; font-weight: bold;' colspan='4'>Total For Transaction " + strResult[strResult.Count - 1].TransactionNumber + ":</th>");
                        ojbSB.Append("<th style='font-size: 10px;text-align: right; font-weight: bold;'>" + Val + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='border-bottom-width: 1px; border-bottom: 1px solid black;' colspan='" + (ExtraCol + 14) + "'></th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-size: 10px; font-weight: normal;' colspan='" + (ExtraCol + 9) + "'></th>");
                        ojbSB.Append("<th style='font-size: 10px; font-weight: bold;' colspan='4'>Report Total :</th>");

                        string Amt1 = "";
                        decimal amtOri1 = Convert.ToDecimal(TotalAmt);
                        Amt1 = amtOri1.ToString("$#,##0.00");

                        ojbSB.Append("<th style='font-size: 10px;text-align: right; font-weight: bold;'>" + Amt1 + "</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("</tbody></table>");
                        #endregion ledgerbody

                        ojbSB.Append("</body></html>");

                        string json = "{\"reportdata\":\""
                                + ojbSB.ToString()
                                + "}";
                        string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                        return jsonReturn.ToString();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }
        //=====================Ledger Inquiry Report================//
        [Route("LedgerListing")]
        [HttpPost]
        public string LedgerListing(LdgerInQuiryFinal LE)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                try
                {
                    int strTdCount = 0;
                    var srtRD = LE.ObjRD;
                    var srtBR = LE.objLInquiry;

                    var StrCompany = new object();
                    StrCompany = srtBR.Companyid;
                    if (StrCompany == "")
                    {
                        StrCompany = "ALL";
                    }
                    else
                    {
                        StrCompany = "Company";
                    }
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var strResult = BusinessContext.LedgerInQuiry(LE);

                    StringBuilder ojbSB = new StringBuilder();

                    StringBuilder ojbSB1 = new StringBuilder();

                    if (strResult.Count == 0)
                    {
                        return "";
                    }
                    else
                    {
                        #region FirstPage

                        ojbSB.Append("<html><head></head>");
                        ojbSB.Append(" <body><table style=\" width: 100%;\"><tbody><tr><td style=\"width: 30%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                        ojbSB.Append("<table style=\"font-size:12px;\"><thead style='display:table-header-group;'><tr><td>Batch :</td>");
                        ojbSB.Append("<td>All</td></tr>");

                        ojbSB.Append("<tr><td>Comapny</td>");
                        ojbSB.Append("<td >" + StrCompany + "</td></tr>");
                        ojbSB.Append("<tr><td>Currency</td>");
                        ojbSB.Append("<td>USD</td></tr>");
                        ojbSB.Append("<tr><td>Period Status</td>");
                        ojbSB.Append("<td >All</td></tr>");
                        ojbSB.Append("<tr><td>Batch</td>");
                        ojbSB.Append("<td >All</td></tr>");
                        ojbSB.Append("<tr><td>UserName</td>");
                        ojbSB.Append("<td>All</td></tr>");
                        ojbSB.Append("<tr><td ></td>");
                        ojbSB.Append("<td></td></tr>");
                        ojbSB.Append("<tr><td></td>");
                        ojbSB.Append("<td></td></tr>");

                        ojbSB.Append("</thead></table></td>");
                        /// Cendter Part of Logo
                        ojbSB.Append("<td style=\"vertical-align: top;width: 40%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                        ojbSB.Append("<table style=\"margin:auto;\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                        ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\">" + srtRD.ProductionName + "</th></tr>");
                        ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:15px;text-align:center;\">General Ledger List By Account: Detail</th></tr></thead></table></td>");
                        /// Cendter Part of Logo End

                        ojbSB.Append("<td style=\"vertical-align: bottom;width: 30%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                        ojbSB.Append("<table style=\"font-size:12px;float:right;\"><thead><tr><td style=\"font-size:10px\"> </td>");
                        ojbSB.Append("<td></td></tr><tr><td >Report Date</td>");

                        ReportP1Business BusinessContextR = new ReportP1Business();
                        string PrintingDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(LE.objLInquiry.ProdId));

                        ojbSB.Append("<td>" + PrintingDate + "</td></tr></thead></table></td></tr></tbody></table>"); //

                        // Header End here 
                        #endregion FirstPage
                        //  ojbSB1

                        #region Second

                        ojbSB.Append("<table style=\" width:100%;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                        ojbSB.Append("<tr style=\"background-color:#A4DEF9;\">");

                        int strDetailPosition = 0;
                        string strSegment = srtRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');


                        strTdCount = strTdCount + Convert.ToInt32(strSegment1.Length - 1);
                        int ColNo = 10;
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">Account</th>");
                        for (int a = 0; a < strSegment1.Length; a++)
                        {

                            if (strSClassification1[a] == "Company")
                            {
                            }
                            else if (strSClassification1[a] == "Detail")
                            {
                                ColNo++;
                                strDetailPosition = a;
                            }
                            else
                            {
                                ColNo++;
                                ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + strSegment1[a] + " </th>");
                            }
                        }

                        // ojbSB.Append("<th style=\"padding:5px 10px; font-size:10px text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\"></th>");
                        var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strOptionalSegment.Length);

                        for (int a = 0; a < strOptionalSegment.Length; a++)
                        {
                            ColNo++;
                            ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + strOptionalSegment[a] + "</th>");
                        }

                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1.Length);

                        for (int a = 0; a < TransCode1.Length; a++)
                        {
                            ColNo++;
                            ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\">" + TransCode1[a] + " </th>");
                        }

                        //  ojbSB.Append("<th style=\"padding:5px 10px; font-size:10px text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Ins </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"></th>"); //Placeholder from previously non-dynamic optional segments. This can be deleted but will effect the rest of the table

                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;text-align: left;padding-left: 15px;\">Line Item Description</th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"> VendorName </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"> Trans# </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"> TT </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"> Cur. </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"> Per. </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"> Document# </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;\"> Posted Date </th>");
                        ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black; text-align:right;\">Amount</th></tr></thead>");


                        string strPreAcct = "";
                        string strPreAccount = "";

                        for (int z = 0; z < strResult.Count; z++)
                        {
                            string strType = strResult[z].AcctDescription;

                            if (z == 0)
                            {
                                int HeadSpan = ColNo - 4;
                                ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                ojbSB.Append("<td colspan=" + HeadSpan + " style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                // ojbSB.Append("<td colspan=\"3\" style=\"border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: center;\">Begining Balance:</td>");
                                ojbSB.Append("<td colspan=\"3\" style=\"border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: center;\"></td>");
                                //  ojbSB.Append("<td  style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: center;\">$" + Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("<td  style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: center;\"></td>");
                                ojbSB.Append("</tr>");
                                strPreAccount = strResult[z].AcctDescription;
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    decimal strAmount = 0;

                                    for (int zz = 0; zz < strResult.Count; zz++)
                                    {
                                        if (strPreAcct == strResult[zz].Acct)
                                        {
                                            strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                        }

                                    }
                                    ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                    ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 7) + " \"></td>");
                                    ojbSB.Append("<td colspan=\"6\" style=\"font-weight:bold;\">Acc :" + strPreAccount + "- PRODUCTION FUNDING Total:</td>");
                                    ojbSB.Append("<td style=\"text-align: center;font-weight:bold;border-bottom: 1px solid black;\">$" + (strAmount).ToString("#,##0.00") + "</td>");
                                    ojbSB.Append("</tr>");


                                    ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                    ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 7) + " \"></td>");
                                    ojbSB.Append("<td colspan=\"6\" style=\"font-weight:bold;\"></td>");
                                    ojbSB.Append("<td style=\"text-align: center;font-weight:bold;border-bottom: 1px solid black;\"></td>");
                                    ojbSB.Append("</tr>");
                                }
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    int HeadSpan = ColNo - 4;
                                    ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=" + HeadSpan + " style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                    ojbSB.Append("<td colspan=\"3\" style=\"border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: center;\"></td>");
                                    ojbSB.Append("<td  style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px; text-align: center;\"></td>");
                                    ojbSB.Append("</tr>");
                                    strPreAccount = strResult[z].AcctDescription;
                                }
                            }

                            ojbSB.Append("<tr style=\"background-Color:#FFF; border-bottom-width: 0px;border-bottom: 1px solid black;height: 23px;\">");

                            ojbSB.Append("<td style=\"text-align: center;\">" + strResult[z].Acct + "</td>");
                            var CoaCode = strResult[z].COAString;
                            var straa = CoaCode.Split('|');
                            for (int k = 0; k < straa.Length; k++)
                            {
                                if (k == 0)
                                { }
                                else
                                {
                                    if (strDetailPosition != k)
                                    {
                                        ojbSB.Append("<td style=\"text-align: center;\">" + straa[k] + "</td>");
                                    }
                                }
                            }
                            var strSegmentOptioanl = srtRD.SegmentOptional;
                            var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                            for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                            {
                                if (k == 0)
                                {
                                    ojbSB.Append("<td style=\"text-align: center;\"></td>"); /// set 
                                }
                                if (k == 1)
                                {
                                    ojbSB.Append("<td style=\"text-align: center;\"></td>"); /// Series
                                }
                            }

                            string strTransString = strResult[z].TransactionCode;
                            string[] strTransString1 = strTransString.Split(',');
                            int strTrvalCount = strTransString1.Length;
                            if (strTransString == "")
                            {
                                for (int k = 0; k < TransCode1.Length; k++)
                                {
                                    ojbSB.Append("<td style=\"text-align: center;\"></td>");
                                }
                            }
                            else
                            {
                                for (int k = 0; k < strTrvalCount; k++)
                                {
                                    if (TransCode1.Length == 0)
                                    {
                                        ojbSB.Append("<td style=\"text-align: center;\"></td>");

                                    }
                                    else
                                    {
                                        string[] newTransValu = strTransString1[k].Split(':');
                                        if (newTransValu[0] == TransCode1[k])
                                        {
                                            ojbSB.Append("<td style=\"text-align: center;\">" + newTransValu[2] + "</td>");
                                        }
                                        else
                                        {
                                            ojbSB.Append("<td style=\"text-align: center;\"></td>");
                                        }
                                    }
                                }

                                int xxx = Convert.ToInt32(TransCode1.Length - strTrvalCount);
                                for (int k = 0; k < xxx; k++)
                                {
                                    ojbSB.Append("<td style=\"text-align: center;\"></td>");
                                }
                            }

                            ojbSB.Append("<td style=\"text-align: center;\"></td>");

                            ojbSB.Append("<td style=\"text-align: left;padding-left: 15px;\">" + strResult[z].LineDescription + "</td>");
                            ojbSB.Append("<td style=\"text-align: center;\">" + strResult[z].VendorName + "</td>");
                            ojbSB.Append("<td style=\"text-align: center;\">" + strResult[z].TransactionNumber + "</td>");
                            ojbSB.Append("<td style=\"text-align: center;\">" + strResult[z].Source + "</td>");
                            ojbSB.Append("<td style=\"text-align: center;\">USD</td>");
                            ojbSB.Append("<td style=\"text-align: center;\">" + strResult[z].ClosePeriod + "</td>");
                            ojbSB.Append("<td style=\"text-align: center;\">" + strResult[z].DocumentNo + "</td>");
                            ojbSB.Append("<td style=\"text-align: center;\">" + Convert.ToDateTime(strResult[z].DocDate).ToString("MM/dd/yyyy") + "</td>"); //
                            ojbSB.Append("<td style=\"text-align: right;\">$" + Convert.ToDecimal(strResult[z].Amount).ToString("#,##0.00") + "</td>");
                            ojbSB.Append("</tr>");


                            strPreAcct = strResult[z].Acct;


                            if (z == strResult.Count - 1)
                            {

                                decimal strAmount = 0;
                                for (int zz = 0; zz < strResult.Count; zz++)
                                {
                                    if (strPreAcct == strResult[zz].Acct)
                                    {
                                        strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                    }
                                }

                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 7) + " \"></td>");
                                ojbSB.Append("<td colspan=\"6 \" style=\"font-weight:bold;\">Acc :" + strPreAccount + "- PRODUCTION FUNDING Total:</td>");
                                ojbSB.Append("<td style=\"text-align: center;font-weight:bold;border-bottom: 1px solid black;\">$" + (strAmount).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 7) + " \"></td>");
                                ojbSB.Append("<td colspan=\"6\" style=\"font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\"text-align: center;font-weight:bold;border-bottom: 1px solid black;\"></td>");
                                ojbSB.Append("</tr>");
                            }
                        }

                        ojbSB.Append("</table></body></html>");

                        #endregion Second
                        string stest = ojbSB.ToString();
                        stest = stest.Replace("&", "&#38;");
                        PDFCreation BusinessContext1 = new PDFCreation();
                        DateTime CurrentDate1 = DateTime.Now;
                        string ReturnName1 = "LedgerBible" + (CurrentDate1.ToShortTimeString().Replace(":", "_").Replace(" ", "_"));
                        var ResponseResult = BusinessContext1.ReportPDFGenerateFolder("Reports/LedgerBible", ReturnName1, "LedgerBible", stest);
                        string[] strResultResponse = ResponseResult.Split('/');
                        string strRes = strResultResponse[2];

                        return strRes;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        //======================== Detail Vendor List by Name  =====================//   
        [Route("GetVendorDetails")]
        [HttpPost]
        public String GetVendorDetails(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    ReportVendors RepVen = JsonConvert.DeserializeObject<ReportVendors>(Convert.ToString(Payload["VenDetail"]));

                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var objRD = RepVen.objRD;
                    var objRDF = RepVen.objRDF;
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        var POListingExportJSONResult = BusinessContext.ReportsVendorDetailReportJSON(callParameters);
                        return ReportEngineController.MakeJSONExport(POListingExportJSONResult);
                    }
                    var result = BusinessContext.ReportsVendorDetailReportJSON(callParameters);
                    ReportP1Business BusinessContext4 = new ReportP1Business();
                    string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(objRDF.ProdID));

                    List<string> fileNames = new List<string>();
                    StringBuilder objSBPath = new StringBuilder();
                    POInvoiceBussiness BC = new POInvoiceBussiness();
                    string strVendorFrom = objRDF.VendorFrom;
                    if (strVendorFrom == "") { strVendorFrom = "ALL"; }

                    string strVendorTo = objRDF.VendorTo;
                    if (strVendorTo == "") { strVendorTo = "ALL"; }

                    string strVendorCountry = objRDF.VendorCountry;
                    if (strVendorCountry == "") { strVendorCountry = "ALL"; }

                    String StrCompany = objRDF.CompanyCode[0];
                    if (objRDF.CompanyCode[0] == "") { StrCompany = "ALL"; }

                    String FinalStrW9 = "";
                    FinalStrW9 = (objRDF.W9OnFile == true ? "Y" : "N");

                    string W9NotOnFile = "";
                    W9NotOnFile = (FinalStrW9 == "Y" ? "N" : "Y");

                    var StrCount = result.Count;
                    if (StrCount > 0)
                    {
                        for (int J = 0; J < result.Count; J++)
                        {
                            StringBuilder ojbSB = new StringBuilder();
                            //  StringBuilder ojbSBHader = new StringBuilder();
                            #region FirstPage
                            ojbSB.Append("<html><head></head>");
                            ojbSB.Append(" <body><table style=\"width: 10.5in;\"><tbody><tr><td style=\"width: 34%;vertical-align: top;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                            ojbSB.Append("<table style=\"\"><thead ><tr><td style=\"padding:0px; font-size:10px;\"></td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\"></td></tr>");
                            ojbSB.Append("<tr><td style=\"padding:0px; font-size:10px;\">Vendor Name From:</td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\">" + strVendorFrom + "</td></tr>");
                            ojbSB.Append("<tr><td style=\"padding:0px; font-size:10px;\">Vendor Name To:</td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\">" + strVendorTo + "</td></tr>");

                            ojbSB.Append("<tr><td style=\"padding:0px; font-size:10px;\">Company Code:</td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\">" + StrCompany + "</td></tr>");
                            ojbSB.Append("<tr><td style=\"padding:0px; font-size:10px;\">Report Sort</td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\">VENDOR NAME</td></tr>");
                            ojbSB.Append("<tr><td style=\"padding:0px; font-size:10px;\">Vendor Type:</td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\">ALL</td></tr>");
                            ojbSB.Append("<tr><td style=\"padding:0px; font-size:10px;\"></td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\"></td></tr>");
                            ojbSB.Append("<tr><td style=\"padding:0px; font-size:10px;\"></td>");
                            ojbSB.Append("<td style=\"padding:0px; font-size:10px;\"></td></tr></thead></table></td>");

                            /// Cendter Part of Logo
                            ojbSB.Append("<td style=\"vertical-align: top;width: 44%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                            ojbSB.Append("<table style=\"\"><thead><tr><th style=\"padding:5px 10px; font-size:20px;text-align:center;\"></th></tr>"); // LIFE AT THESE SPEEDS
                            ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:17px;text-align:center;\">" + objRD.ProductionName + "</th></tr>");
                            ojbSB.Append("<tr><th style=\"padding:5px 10px; font-size:10px;text-align:center;\">Detailed List of Vendors by Name</th></tr></thead></table></td>");
                            /// Cendter Part of Logo End

                            ojbSB.Append("<td style=\"vertical-align: top;width: 25%;border-bottom-width: 2px;border-bottom: 3px solid black;\">");
                            ojbSB.Append("<table style=\"\"><thead><tr><td style=\"font-size:10px;\">W9 on File </td>");
                            ojbSB.Append("<td style=\"font-size:10px;\">" + FinalStrW9 + "</td></tr>");
                            ojbSB.Append("<tr><td style=\"font-size:10px;\">W9 Not on File</td>");
                            ojbSB.Append("<td style=\"font-size:10px;\">" + W9NotOnFile + "</td></tr>");
                            ojbSB.Append("<tr><td style=\"font-size:10px;\">Vendor Country</td>");
                            ojbSB.Append("<td style=\"font-size:10px;\">" + strVendorCountry + "</td></tr>");
                            ojbSB.Append("<tr><td style=\"font-size:10px;\">Printed on</td>");
                            ojbSB.Append("<td style=\"font-size:10px;\">" + CurrentDate + "</td></tr>");
                            ojbSB.Append("<tr><td style=\"font-size:10px;\"></td>");
                            ojbSB.Append("<td style=\"font-size:10px;\"></td></tr>");
                            ojbSB.Append("<tr><td style=\"font-size:10px;\"></td>");
                            ojbSB.Append("<td style=\"font-size:10px;\"></td></tr>");
                            ojbSB.Append("<tr><td style=\"font-size:10px;\"></td>");
                            ojbSB.Append("<td style=\"font-size:10px;\"></td></tr>");
                            ojbSB.Append("<tr><td style=\"font-size:10px;\"></td>");
                            ojbSB.Append("<td style=\"font-size:10px;\"></td></tr>");
                            ojbSB.Append("</thead></table></td></tr></tbody></table>");
                            #endregion first
                            // Header End here 
                            #region second
                            ojbSB.Append("<table style=\"width:10.5in;font-size:12px; border-collapse:collapse; border:1px solid #ccc;\"><thead>");
                            ojbSB.Append("<tr style=\" height:30px;\">");
                            ojbSB.Append("<th style=\"text-align:left;\">Vendor#</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Name</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Contact</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Tax ID Number</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">TIN Name</th></tr>");

                            ojbSB.Append("<tr style=\" height:30px;\">");
                            ojbSB.Append("<th ></th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Address 1</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Phone Number</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Default 1099 Code</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Terms</th></tr>");

                            ojbSB.Append("<tr style=\" height:30px;\">");
                            ojbSB.Append("<th ></th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Address 2</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Studio Vendor Number</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">W9 on File/Tin </th>");
                            ojbSB.Append("<th style=\"text-align:left;\">TypeDue Days</th></tr>");

                            ojbSB.Append("<tr style=\" height:30px;\">");
                            ojbSB.Append("<th ></th>");
                            ojbSB.Append("<th style=\"text-align:left;\">City/State/Zip-code</th>");
                            ojbSB.Append("<th style=\"text-align:left;\"> Country</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Currency</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Default Account</th></tr>");

                            ojbSB.Append("<tr style=\" height:30px;\">");
                            ojbSB.Append("<th ></th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Comments </th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Active/Inactive </th>");
                            ojbSB.Append("<th style=\"text-align:left;\"></th>");
                            ojbSB.Append("<th style=\"text-align:left;\">PC Vendor</th></tr>");

                            ojbSB.Append("<tr style=\" height:30px;\">");
                            ojbSB.Append("<th ></th>");
                            ojbSB.Append("<th style=\"text-align:left;\">E-mail Address</th>");
                            ojbSB.Append("<th style=\"text-align:left;\">Fax Number</th>");
                            ojbSB.Append("<th style=\"text-align:left;\"></th>");
                            ojbSB.Append("<th style=\"text-align:left;\"></th></tr>");
                            // ojbSB.Append("<th style=\"border-bottom-width: 2px;border-bottom: 3px solid black;text-align:left;\">Enabled</th>");
                            ojbSB.Append("</thead>");

                            for (int i = 0; i < result.Count; i++)
                            {
                                if (i % 2 == 0)
                                {
                                    ojbSB.Append("<tbody style=\"background-color:#dddedf;\">");
                                }
                                else
                                {
                                    ojbSB.Append("<tbody>");
                                }

                                ojbSB.Append("<tr style=\" height:20px;\">");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].VendorID + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].VendorName + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].Name + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].TaxID + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td></tr>");

                                ojbSB.Append("<tr style=\" height:20px;\">");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].RemitAddress1 + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].Phone + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].DefaultCode + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td></tr>");

                                ojbSB.Append("<tr style=\" height:20px;\">");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].RemitAddress2 + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].StudioVendorNumber + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].W9onFile + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].Duecount + "</td></tr>");

                                ojbSB.Append("<tr style=\" height:20px;\">");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].RemitCity + "" + result[i].RemitState + "" + result[i].RemitPostalCode + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].RemitCountry + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].Currency + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].DefaultAccount + "</td></tr>");

                                ojbSB.Append("<tr style=\" height:20px;\">");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].Status + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td></tr>");


                                ojbSB.Append("<tr style=\" height:20px;\">");
                                ojbSB.Append("<td style=\" font-weight:bold;\"></td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].Email + "</td>");
                                ojbSB.Append("<td style=\" font-weight:bold;\">" + result[i].Fax + "</td>");
                                ojbSB.Append("<td  colspan=\"2\" style=\" font-weight:bold;\"></td></tr>");

                                //   ojbSB.Append("</tr>"); " + result[i].RemitCity + "," + result[i].RemitZip + "
                                ojbSB.Append("</tbody>");
                            }
                            ojbSB.Append("</table></body></html>");
                            #endregion FirstPage
                            string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                            return jsonReturn.ToString();
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
            return "";
        }

        //=================Bible ===================//

        [Route("LedgerBibleWithoutPO")]
        [HttpPost]
        public string LedgerBibleWithoutPO(BibleReport BR)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    int strTdCount = 0;
                    var srtRD = BR.ObjRD;
                    var srtBR = BR.objLBible;

                    var StrCompany = new object();
                    StrCompany = srtBR.Companyid;
                    if (StrCompany == "")
                    {
                        StrCompany = "ALL";
                    }
                    else
                    {
                        StrCompany = "Company";
                    }

                    string PFrom = "ALL";
                    string PTO = "ALL";
                    if (srtBR.PeriodIdfrom != 0)
                    {
                        PFrom = Convert.ToString(srtBR.PeriodIdfrom);
                    }

                    if (srtBR.PeriodIdTo != 0)
                    {
                        PTO = Convert.ToString(srtBR.PeriodIdTo);
                    }

                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var strResult = BusinessContext.LedgerBible(BR);

                    StringBuilder ojbSB = new StringBuilder();

                    StringBuilder ojbSB1 = new StringBuilder();

                    double GrandTotal = 0;

                    if (strResult.Count == 0)
                    {
                        return "";
                    }
                    else
                    {
                        int headerSpanCnt = 9;
                        string strSegmentQ = srtRD.Segment;
                        string[] strSegment1Q = strSegmentQ.Split(',');
                        string strSClassificationQ = srtRD.SClassification;
                        string[] strSClassification1Q = strSClassificationQ.Split(',');

                        for (int a = 0; a < strSegment1Q.Length; a++)
                        {
                            if (strSClassification1Q[a] == "Detail")
                            {
                                headerSpanCnt++;
                            }
                            else
                            {
                                headerSpanCnt++;
                            }
                        }

                        var strOptionalSegmentQ = srtRD.SegmentOptional.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strOptionalSegmentQ.Length);

                        for (int a = 0; a < strOptionalSegmentQ.Length; a++)
                        {
                            headerSpanCnt++;
                        }

                        string TransCodeQ = srtRD.TransCode;
                        string[] TransCode1Q = TransCodeQ.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1Q.Length);

                        for (int a = 0; a < TransCode1Q.Length; a++)
                        {
                            headerSpanCnt++;
                        }

                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table style='width: 100%; border-collapse: collapse; border-top: 1px solid #ccc;repeat-header: yes;'>");

                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr><th colspan='" + headerSpanCnt + "'>");
                        ojbSB.Append("<table style='width: 100%; border-collapse: collapse;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Company Code : " + StrCompany + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + srtRD.ProductionName + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Location(s) : All</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'></th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Period No From : " + PFrom + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; color: white;'>r</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Period No To : " + PTO + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>General Ledger Bible</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; color: white;'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0 0 3px 0; font-size: 12px; width: 20%; float: left; color: white;'>Statement Amount </th>");
                        ojbSB.Append("<th style='padding: 0 0 3px 0; font-size: 16px; width: 60%; float: left; text-align: center; color: white;'>f</th>");

                        ReportP1Business BusinessContext4 = new ReportP1Business();
                        string CurrentDate = BusinessContext4.UserSpecificTime(Convert.ToInt32(BR.objLBible.ProdId));

                        ojbSB.Append("<th style='padding: 0 10px 3px 0; font-size: 12px; width: 18%; float: left; text-align: right;'>Printed on : " + CurrentDate + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");

                        int strDetailPosition = 0;
                        string strSegment = srtRD.Segment;
                        string[] strSegment1 = strSegment.Split(',');
                        string strSClassification = srtRD.SClassification;
                        string[] strSClassification1 = strSClassification.Split(',');

                        int HeadSpan1 = 0;
                        strTdCount = strTdCount + Convert.ToInt32(strSegment1.Length - 1);
                        int ColNo = 10;
                        ojbSB.Append("<th style=\"padding: 5px 10px;font-size: 11px;border-bottom-width:1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">Account</th>");
                        for (int a = 0; a < strSegment1.Length; a++)
                        {
                            if (strSClassification1[a] == "Company")
                            {
                            }
                            else if (strSClassification1[a] == "Detail")
                            {
                                ColNo++;
                                strDetailPosition = a;
                            }
                            else
                            {
                                ColNo++;
                                ojbSB.Append("<th style=\"padding: 5px 10px;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">" + strSegment1[a] + " </th>");
                            }
                        }

                        // ojbSB.Append("<th style=\"padding:5px 10px; font-size:10px text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\"></th>");
                        var strOptionalSegment = srtRD.SegmentOptional.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(strOptionalSegment.Length);

                        for (int a = 0; a < strOptionalSegment.Length; a++)
                        {
                            ColNo++;
                            ojbSB.Append("<th style=\"border-bottom-width: 1px;font-size: 11px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">" + strOptionalSegment[a] + "</th>");
                        }

                        string TransCode = srtRD.TransCode;
                        string[] TransCode1 = TransCode.Split(',');
                        strTdCount = strTdCount + Convert.ToInt32(TransCode1.Length);

                        for (int a = 0; a < TransCode1.Length; a++)
                        {
                            ColNo++;
                            ojbSB.Append("<th style=\"text-align:left;border-bottom-width: 1px;font-size: 11px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">" + TransCode1[a] + " </th>");
                        }

                        //  ojbSB.Append("<th style=\"padding:5px 10px; font-size:10px text-align:left;border-bottom-width: 2px;border-bottom: 3px solid black;\">Ins </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">1099 </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">Line Item Description</th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> VendorName </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Trans# </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> TT </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Cur. </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Per. </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Document# </th>");
                        ojbSB.Append("<th style=\"text-align:left;font-size: 11px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\"> Payment# </th>");
                        ojbSB.Append("<th style=\"text-align:right;font-size: 11px;padding: 5px 10px;border-bottom-width: 1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;\">Amount</th></tr>");

                        ojbSB.Append("</thead>");
                        ojbSB.Append("<tbody>");

                        string strPreAcct = "";

                        for (int z = 0; z < strResult.Count; z++)
                        {
                            string strType = strResult[z].AcctDescription;

                            if (z == 0)
                            {

                                int HeadSpan = ColNo - 4;
                                HeadSpan1 = HeadSpan;
                                ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                ojbSB.Append("<td colspan=" + HeadSpan + " style=\"font-size: 11px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;font-weight:bold;padding: 5px 10px;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                ojbSB.Append("<td colspan=\"3\" style=\"font-size: 11px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align:left;font-weight:bold;padding: 5px 10px;\">Begining Balance:</td>");

                                ojbSB.Append("<td  style=\"font-size: 10px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;padding: 1px 7px;\">$" +
                                    (Convert.ToDecimal(strResult[z].BeginingBal) >= 0 ?
                                    Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00")
                                    : (Convert.ToDecimal(strResult[z].BeginingBal) * -1).ToString("#,##0.00")) + "</td>");
                                ojbSB.Append("</tr>");
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    decimal strAmount = 0;
                                    for (int zz = 0; zz < strResult.Count; zz++)
                                    {
                                        if (strPreAcct == strResult[zz].Acct)
                                        {
                                            strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                        }
                                    }
                                    ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                    ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 3) + " \"></td>");
                                    ojbSB.Append("<td colspan=\"2\" style=\"font-weight:bold;font-size: 11px;\">Total For Account:</td>");
                                    // ojbSB.Append("<td style=\"text-align: center;font-weight:bold;border-bottom: 1px solid black;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                    if (Convert.ToDecimal(strAmount) >= 0)
                                    {
                                        ojbSB.Append("<td  style=\"font-size: 11px;padding: 5px 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                    }
                                    else
                                    {
                                        ojbSB.Append("<td  style=\"font-size: 11px;padding: 5px 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;float:right;\">-$" + (Convert.ToDecimal(strAmount) * -1).ToString("#,##0.00") + "</td>");
                                    }

                                    ojbSB.Append("</tr>");

                                    ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                    ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 3) + " \"></td>");
                                    ojbSB.Append("<td colspan=\"2\" style=\"font-weight:bold;font-size: 11px;\">Ending Balance:</td>");
                                    // ojbSB.Append("<td style=\"text-align: center;font-weight:bold;border-bottom: 1px solid black;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                    if (Convert.ToDecimal(strAmount) >= 0)
                                    {
                                        GrandTotal += Convert.ToDouble(strAmount);
                                        ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 11px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                    }
                                    else
                                    {
                                        GrandTotal += Convert.ToDouble(strAmount);
                                        ojbSB.Append("<td  style=\"padding: 5px 10px;font-size: 11px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;float:right;\">-$" + (Convert.ToDecimal(strAmount) * -1).ToString("#,##0.00") + "</td>");
                                    }
                                    ojbSB.Append("</tr>");
                                }
                            }

                            if (z != 0)
                            {
                                if (strPreAcct != strResult[z].Acct)
                                {
                                    int HeadSpan = ColNo - 4;
                                    ojbSB.Append("<tr style=\"background-Color:#FFFAE3;\">");
                                    ojbSB.Append("<td colspan=" + HeadSpan + " style=\"font-size: 11px;padding: 5px 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;font-weight:bold;\">Acc :" + strResult[z].AcctDescription + "</td>");
                                    ojbSB.Append("<td colspan=\"3\" style=\"font-size: 11px;padding: 5px 10px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: left;font-weight:bold;\">Begining Balance:</td>");
                                    // ojbSB.Append("<td  style=\" border-bottom: 1px solid;border-top: 1px solid;height: 25px; text-align: center;font-weight:bold;float:right;\">$" + Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00") + "</td>");

                                    ojbSB.Append("<td  style=\"font-size: 10px;border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;font-weight:bold;padding: 1px 7px;\">$" + (Convert.ToDecimal(strResult[z].BeginingBal) >= 0
                                        ? Convert.ToDecimal(strResult[z].BeginingBal).ToString("#,##0.00")
                                        : (Convert.ToDecimal(strResult[z].BeginingBal) * -1).ToString("#,##0.00")) + "</td>");

                                    ojbSB.Append("</tr>");
                                }
                            }

                            ojbSB.Append("<tr style=\"background-Color:#FFF; border-bottom-width: 0px;border-bottom: 1px solid black;height: 23px;\">");

                            ojbSB.Append("<td style=\"font-size: 11px;text-align: left;padding: 5px 10px;\">" + strResult[z].Acct + "</td>");
                            var CoaCode = strResult[z].COAString;
                            var straa = CoaCode.Split('|');
                            for (int k = 0; k < straa.Length; k++)
                            {
                                if (k == 0)
                                { }
                                else
                                {
                                    if (strDetailPosition != k)
                                    {
                                        ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + straa[k] + "</td>");
                                    }
                                }
                            }
                            // ojbSB.Append("<td style=\"padding:5px 10px; font-size:10px text-align:left;\"></td>"); /// Account Description
                            var strSegmentOptioanl = srtRD.SegmentOptional;
                            var strSegmentOptioanl1 = strSegmentOptioanl.Split(',');
                            for (int k = 0; k < strSegmentOptioanl1.Length; k++)
                            {
                                if (k == 0)
                                {
                                    ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\"></td>"); /// set 
                                }
                                if (k == 1)
                                {
                                    ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\"></td>"); /// Series
                                }
                            }

                            string strTransString = strResult[z].TransactionCode;
                            string[] strTransString1 = strTransString.Split(',');
                            int strTrvalCount = strTransString1.Length;
                            if (strTransString == "")
                            {
                                for (int k = 0; k < TransCode1.Length; k++)
                                {
                                    ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\"></td>");
                                }
                            }
                            else
                            {
                                for (int k = 0; k < strTrvalCount; k++)
                                {
                                    if (TransCode1.Length == 0)
                                    {
                                        ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\"></td>");

                                    }
                                    else
                                    {
                                        string[] newTransValu = strTransString1[k].Split(':');
                                        if (newTransValu[0] == TransCode1[k])
                                        {
                                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + newTransValu[2] + "</td>");
                                        }
                                        else
                                        {
                                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\"></td>");
                                        }
                                    }
                                }

                                int xxx = Convert.ToInt32(TransCode1.Length - strTrvalCount);
                                for (int k = 0; k < xxx; k++)
                                {
                                    ojbSB.Append("<td style=\"text-align: left;\"></td>");
                                }
                            }

                            ojbSB.Append("<td style=\"text-align: left;\"></td>");
                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + strResult[z].LineDescription + "</td>");
                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + strResult[z].VendorName + "</td>");
                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + strResult[z].TransactionNumber + "</td>");
                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + strResult[z].Source + "</td>");
                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">USD</td>");
                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + strResult[z].ClosePeriod + "</td>");
                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + strResult[z].DocumentNo + "</td>");

                            ojbSB.Append("<td style=\"text-align: left;font-size: 11px;\">" + strResult[z].CheckNumber + "</td>");
                            //  ojbSB.Append("<td style=\"text-align: center;float:right;\">$" + Convert.ToDecimal(strResult[z].Amount).ToString("#,##0.00") + "</td>");
                            if (Convert.ToDecimal(strResult[z].Amount) >= 0)
                            {
                                ojbSB.Append("<td  style=\"font-size: 11px;text-align:right;padding: 5px 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;float:right;\">$" + Convert.ToDecimal(strResult[z].Amount).ToString("#,##0.00") + "</td>");
                            }
                            else
                            {
                                ojbSB.Append("<td  style=\"font-size: 11px;text-align:right;padding: 5px 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;float:right;\">-$" + (Convert.ToDecimal(strResult[z].Amount) * -1).ToString("#,##0.00") + "</td>");
                            }
                            ojbSB.Append("</tr>");

                            strPreAcct = strResult[z].Acct;
                            if (z == strResult.Count - 1)
                            {
                                decimal strAmount = 0;
                                for (int zz = 0; zz < strResult.Count; zz++)
                                {
                                    if (strPreAcct == strResult[zz].Acct)
                                    {
                                        strAmount = strAmount + Convert.ToDecimal(strResult[zz].Amount);
                                    }
                                }

                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 3) + " \"></td>");
                                ojbSB.Append("<td colspan=\"2\" style=\"font-size: 11px;font-weight:bold;\">Total For Account:</td>");
                                ojbSB.Append("<td style=\"font-size: 11px;padding: 5px 10px;text-align: right;font-weight:bold;border-bottom: 1px solid black;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr style=\"background-Color:#FFF;\">");
                                ojbSB.Append("<td colspan=\" " + (Convert.ToInt32(ColNo) - 3) + " \"></td>");
                                ojbSB.Append("<td colspan=\"2\" style=\"font-weight:bold;font-size: 11px;\">Ending Balance:</td>");
                                //  ojbSB.Append("<td style=\"text-align: center;font-weight:bold;border-bottom: 1px solid black;float: right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                if (Convert.ToDecimal(strAmount) >= 0)
                                {
                                    GrandTotal += Convert.ToDouble(strAmount);
                                    ojbSB.Append("<td  style=\"font-size: 11px;padding: 5px 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;float:right;\">$" + Convert.ToDecimal(strAmount).ToString("#,##0.00") + "</td>");
                                }
                                else
                                {
                                    GrandTotal += Convert.ToDouble(strAmount);
                                    ojbSB.Append("<td  style=\"font-size: 11px;padding: 5px 10px; border-bottom: 1px solid;border-top: 1px solid;height: 25px;text-align: right;float:right;\">-$" + (Convert.ToDecimal(strAmount) * -1).ToString("#,##0.00") + "</td>");
                                }
                                ojbSB.Append("</tr>");
                            }
                        }

                        // Report Total
                        ojbSB.Append("<tr style=\"background-Color:#A4DEF9;\">");
                        ojbSB.Append("<td colspan=" + HeadSpan1 + " style=\"font-size: 11px;border-bottom-width:1px;border-bottom: 1px solid black;font-weight:bold;border-top-width: 1px;border-top: 1px solid black;;height: 25px;font-weight:bold;padding: 5px 10px;\"></td>");
                        ojbSB.Append("<td colspan=\"3\" style=\"font-size: 10px !important;border-bottom: 1px solid !important;border-top: 1px solid !important;text-align: right !important;font-weight: bold !important;padding: 1px 7px !important;\">Grand Total :</td>");
                        String TmpGT = (Convert.ToDecimal(GrandTotal) >= 0 ? Convert.ToDecimal(GrandTotal).ToString("#,##0.00") : (Convert.ToDecimal(GrandTotal) * -1).ToString("#,##0.00"));
                        ojbSB.Append("<td  style=\"font-size: 10px !important;border-bottom: 1px solid !important;border-top: 1px solid !important;text-align: right !important;font-weight: bold !important;padding: 1px 7px !important;\">$" + TmpGT + "</td>");


                        ojbSB.Append("</tr>");

                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table></body></html>");

                        string stest = ojbSB.ToString();
                        stest = stest.Replace("&", "&#38;");
                        PDFCreation BusinessContext1 = new PDFCreation();
                        DateTime CurrentDate1 = DateTime.Now;
                        string ReturnName1 = "Bible_" + (CurrentDate1.ToShortTimeString().Replace(":", "_").Replace(" ", "_"));
                        var ResponseResult = BusinessContext1.ReportPDFGenerateFolder("Reports/LedgerBible", ReturnName1, "LedgerBible", stest);
                        string[] strResultResponse = ResponseResult.Split('/');
                        string strRes = strResultResponse[2];

                        return strRes;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                return "";
            }
        }

        [Route("GetClosePeriodList")]
        [HttpGet, HttpPost]
        public List<GetClosePeriodList_Result> GetClosePeriodList(int ProdID, int CID, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                ReportsBussiness BusinessContext = new ReportsBussiness();
                return BusinessContext.GetClosePeriodList(ProdID, CID, Mode);
            }
            else
            {
                List<GetClosePeriodList_Result> n = new List<GetClosePeriodList_Result>();
                return n;
            }
        }

        [Route("GetOpenPeriod")]
        [HttpGet, HttpPost]
        public List<GetOpenPeriod_Result> GetOpenPeriod(int ProdID, int CID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                ReportsBussiness BusinessContext = new ReportsBussiness();
                return BusinessContext.GetOpenPeriod(ProdID, CID);
            }
            else
            {
                List<GetOpenPeriod_Result> n = new List<GetOpenPeriod_Result>();
                return n;
            }
        }

        [Route("ReportsBankRecDetail")]
        [HttpPost]
        public string ReportsBankRecDetail(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckRun"]["callPayload"])));
            var BankReconcileJSON = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["BankReconcile"]));
            int BankID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["BankId"])));
            int ProdID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ProdId"])));
            int UserId = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["UserId"])));

            StringBuilder ojbSB = new StringBuilder();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                int BankReconciliationID = Convert.ToInt32(BankReconcileJSON["BankReconciliationID"]);
                string isSummary = Convert.ToString(BankReconcileJSON["isSummary"]).ToUpper();
                string includeuncleared = Convert.ToString(BankReconcileJSON["includeuncleared"]).ToUpper();
                string ReportDate = DateTime.Now.ToShortDateString();

                string isInclude = ""; string width = "";
                if (includeuncleared == "TRUE") { isInclude = "Included"; width = "189px"; } else { isInclude = "Not Included"; width = "211px"; }

                var bankInfo = CompanyContext.GetBankInfoById(BankID);
                var databaseItems = AdminContext.AdminAPIToolsProductionList(UserId);
                var currentDB = databaseItems.Where(i => i.ProductionId == ProdID).FirstOrDefault();

                var bankTransactions = BusinessContext.GetBankTransaction(BankID, BankReconciliationID, ProdID);

                var bankAdjustment = BusinessContext.GetBankAdjustmentData(BankReconciliationID, BankID, ProdID);

                var clearedTransactions = bankTransactions.Where(i => i.ReconcilationStatus == "CLEARED");

                var clearedAdjustment = bankAdjustment.Where(i => i.Status == "CLEARED");

                var reconcilationList = ReportContext.GetReconcilationList(ProdID, BankID);
                var currentReconcilation = reconcilationList.Where(i => i.ReconcilationID == BankReconciliationID).FirstOrDefault();

                var priorBankRec = reconcilationList.TakeWhile(x => x.ReconcilationID != BankReconciliationID).LastOrDefault();

                string postedDateFrom = "-"; decimal priorBalance = 0;
                if (priorBankRec != null)
                {
                    postedDateFrom = priorBankRec.StatementDate.ToShortDateString();
                    priorBalance = priorBankRec.StatementEndingAmount;
                }


                ojbSB.Append("<html>");
                ojbSB.Append("<head><title>Bank Reconciliation Reports</title>");
                ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 10mm; }</style></head>");
                ojbSB.Append("<body style='margin:0mm'>");
                ojbSB.Append("<table style='width: 8.5in; font-family: Arial, Helvetica, sans-serif;font-size: 12px;border-spacing:0;'>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Bank:</strong> <span class='bankid'>" + bankInfo[0].Bankname.ToUpper() + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Bank Reconciliation ID:</strong>  <span class='BankRecId'>" + BankReconciliationID + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong>" + currentDB.Name + "</strong></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Posted Date From:</strong> <span class='PostedDateFrom'>" + postedDateFrom + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;width: 448px;'><strong>BANK RECONCILIATION REPORT</strong></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Posted Date To:</strong> <span class='PostedDateTo'>" + currentReconcilation.StatementDate.ToShortDateString() + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong>" + bankInfo[0].Bankname.ToUpper() + "</strong></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;width: " + width + ";'><strong>Uncleared Transactions:</strong> <span class='Include'>" + isInclude + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong>Statement Ending: <span class='EndingDate'>" + currentReconcilation.StatementDate.ToShortDateString() + "</span></strong></td>");
                ojbSB.Append("<td style='text-align: right;'><strong>Report Date:</strong> <span class='ReportDate'>" + ReportDate + "</span></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td colspan='3'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td colspan='3'>");
                ojbSB.Append("<table style='width: 8.5in; font-family: Arial, Helvetica, sans-serif;font-size: 12px;border-spacing:0;'>");
                ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                ojbSB.Append("<td style='padding:5px;border-bottom: 1px solid;text-align:right;'><strong>Date</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:5px;border-bottom:1px solid;'><strong>Vendor Name</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:5px;border-bottom:1px solid;'><strong>Document #</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:5px;border-bottom:1px solid;'><strong>Amount</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:5px;border-bottom:1px solid;'><strong>Balance </strong> </td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='2'><strong>Previous Statement’s Ending Bank Balance:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;' class='PreviousEndingBalance'>$ " + Convert.ToDecimal(priorBalance).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'><strong>Cleared Transactions:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'><strong>Deposits:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                bool isCombined = false; string combineVal = "";

                decimal? totalCleared = 0;
                decimal? totalDeposites = 0;
                foreach (var deposits in clearedTransactions)
                {
                    if ((deposits.DebitAmount - deposits.CreditAmount) > 0 && deposits.SourceTable == "Manual JE")
                    {
                        combineVal = "";
                        if (deposits.DebitAmount != 0 && deposits.CreditAmount != 0)
                        {
                            combineVal = " **"; isCombined = true;
                        }

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding:4px;' class='DepositeDate'>" + deposits.EntryDate.ToShortDateString() + "</td>");
                        ojbSB.Append("<td style='text-align:left;padding:4px;' class='DepositeVendor'>" + deposits.VendorName + "</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;' class='DepositeDocument'>" + deposits.CheckNumber + "</td>");
                        ojbSB.Append("<td style='text-align:right;padding:4px;' class='DepositeAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal(deposits.DebitAmount - deposits.CreditAmount).ToString("#,##0.00") + combineVal + "</span></td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;' >&nbsp;</td>");
                        ojbSB.Append("</tr>");

                        totalDeposites = totalDeposites + (deposits.DebitAmount - deposits.CreditAmount);
                    }
                }

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'>Total Cleared Deposits:</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:right;padding:4px;text-align: right;border-bottom: 1px solid;width: 150px;' class='TotalCleared' >$ " + Convert.ToDecimal(totalDeposites).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'><strong>Other Entries:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;' >&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");

                decimal? totalOthers = 0;
                foreach (var others in clearedTransactions)
                {
                    if ((others.DebitAmount - others.CreditAmount) <= 0 && others.SourceTable == "Manual JE")
                    {
                        combineVal = "";
                        if (others.DebitAmount != 0 && others.CreditAmount != 0)
                        {
                            combineVal = " **"; isCombined = true;
                        }

                        ojbSB.Append("<td style='padding:4px;' class='OtherDate'>" + others.EntryDate.ToShortDateString() + "</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;' class='OthreVendor'>" + others.VendorName + "</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;' class='OtherDocument'>" + others.CheckNumber + "</td>");
                        ojbSB.Append("<td style='text-align:right;padding:4px;' class='OtherAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((others.DebitAmount - others.CreditAmount)).ToString("#,##0.00") + combineVal + "</span></td>");
                        ojbSB.Append("<td style='padding:4px;text-align:right;' >&nbsp;</td>");
                        ojbSB.Append("</tr>");

                        totalOthers = totalOthers + (others.DebitAmount - others.CreditAmount);
                    }
                }

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'>Total Cleared Other Entries:</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalOtherCleared'>$ " + Convert.ToDecimal(totalOthers).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'><strong>Checks:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' >&nbsp;</td>");
                ojbSB.Append("</tr>");

                decimal? totalChecks = 0;
                foreach (var checks in clearedTransactions)
                {
                    if (
                         (checks.SourceTable == "Payment" && (checks.PayBy == "Check" || checks.PayBy == "Manual Check"))
                         ||
                         (checks.SourceTable == "Invoice" && (checks.PayBy == "Invoice"))
                    )
                    //if (checks.SourceTable == "Payment" && (checks.PayBy == "Check" || checks.PayBy == "Manual Check"))
                    {
                        combineVal = "";
                        if (checks.DebitAmount != 0 && checks.CreditAmount != 0)
                        {
                            combineVal = " **"; isCombined = true;
                        }

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding:4px;' class='checksDate'>" + checks.EntryDate.ToShortDateString() + "</td>");
                        ojbSB.Append("<td style='text-align:left;padding:4px;' class='checksVendor'>" + checks.VendorName + "</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;' class='checksDocument'>" + checks.CheckNumber + "</td>");
                        ojbSB.Append("<td style='text-align:right;padding:4px;' class='checksAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((checks.DebitAmount - checks.CreditAmount)).ToString("#,##0.00") + combineVal + "</span></td>");
                        ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                        ojbSB.Append("</tr>");

                        totalChecks = totalChecks + (checks.DebitAmount - checks.CreditAmount);
                    }
                }

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'>Total Cleared Checks:</td>");
                ojbSB.Append("<td style='text-align: center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align: center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align: center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalChecksCleared'>$ " + Convert.ToDecimal(totalChecks).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'><strong>Wires:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                decimal? totalWires = 0;
                foreach (var wires in clearedTransactions)
                {
                    if (wires.SourceTable == "Payment" && (wires.PayBy == "Wire Check" || wires.PayBy == "ACH"))
                    {
                        combineVal = "";
                        if (wires.DebitAmount != 0 && wires.CreditAmount != 0)
                        {
                            combineVal = " **"; isCombined = true;
                        }
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding:4px;'  class='WiresDate'>" + wires.EntryDate.ToShortDateString() + "</td>");
                        ojbSB.Append("<td style='text-align:left;padding:4px;'  class='WiresVendor'>" + wires.VendorName + "</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;'  class='WiresDocuments'>" + wires.CheckNumber + "</td>");
                        ojbSB.Append("<td style='text-align:right;padding:4px;'  class='WiresAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((wires.DebitAmount - wires.CreditAmount)).ToString("#,##0.00") + combineVal + "</span></td>");
                        ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                        ojbSB.Append("</tr>");

                        totalWires = totalWires + (wires.DebitAmount - wires.CreditAmount);
                    }
                }

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'>Total Cleared Wires:</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalWiresCleared'>$ " + Convert.ToDecimal(totalWires).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'><strong>Adjustment:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                decimal? totalAdjustment = 0;
                foreach (var adjustment in clearedAdjustment)
                {

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'  class='adjDate'>" + adjustment.Date + "</td>");
                    ojbSB.Append("<td style='text-align:left;padding:4px;'  class='adjVendor'>" + adjustment.Description + "</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'  class='adjDocuments'></td>");
                    ojbSB.Append("<td style='text-align:right;padding:4px;'  class='adjAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((adjustment.Amount)).ToString("#,##0.00") + "</span></td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    totalAdjustment = totalAdjustment + (adjustment.Amount);
                }

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;'>Total Cleared Adjustment:</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalWiresCleared'>$ " + Convert.ToDecimal(totalAdjustment).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                totalCleared = priorBalance + totalDeposites + totalOthers + totalChecks + totalWires + totalAdjustment;

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align: left;' colspan='2'><strong>Total Cleared Bank Balance As Of: <span class='statmentdate'>" + currentReconcilation.StatementDate.ToShortDateString() + "</span>: </strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;border-bottom: 1px solid;width: 150px;'><strong class='TotalBankBalanceCleared'>$ " + Convert.ToDecimal(totalCleared).ToString("#,##0.00") + "</strong></td>");
                ojbSB.Append("</tr>");

                if (isCombined == true && includeuncleared != "TRUE")
                {
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;'  colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='2'>** Combined entries on this Journal Entry</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;'></td>");
                    ojbSB.Append("</tr>");
                }

                ojbSB.Append("</table>");
                ojbSB.Append("</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</table>");

                if (includeuncleared == "TRUE")
                {
                    decimal? totalUnCleared = 0;
                    var unclearedTransactions = bankTransactions.Where(i => i.ReconcilationStatus == "UNCLEARED");

                    var unclearedAdjustment = bankAdjustment.Where(i => i.Status == "UNCLEARED");

                    ojbSB.Append("<table style='width: 8.5in; font-family: Arial, Helvetica, sans-serif;font-size: 12px;border-spacing:0;'>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'><strong>Uncleared Transactions:</strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'><strong>Deposits:</strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    decimal? totalUnClearedDeposites = 0;
                    foreach (var deposits in unclearedTransactions)
                    {
                        if ((deposits.DebitAmount - deposits.CreditAmount) > 0 && deposits.SourceTable == "Manual JE")
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding:4px;' class='DepositeDate'>" + deposits.EntryDate.ToShortDateString() + "</td>");
                            ojbSB.Append("<td style='text-align:left;padding:4px;' class='DepositeVendor'>" + deposits.VendorName + "</td>");
                            ojbSB.Append("<td style='text-align:center;padding:4px;' class='DepositeDocument'>" + deposits.CheckNumber + "</td>");
                            ojbSB.Append("<td style='text-align:right;padding:4px;' class='DepositeAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((deposits.DebitAmount - deposits.CreditAmount)).ToString("#,##0.00") + "</span></td>");
                            ojbSB.Append("<td style='text-align:center;padding:4px;' >&nbsp;</td>");
                            ojbSB.Append("</tr>");

                            totalUnClearedDeposites = totalUnClearedDeposites + (deposits.DebitAmount - deposits.CreditAmount);
                        }
                    }

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'>Total Uncleared Deposits:</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;border-bottom: 1px solid;width: 150px;' class='TotalUnCleared'>$ " + Convert.ToDecimal(totalUnClearedDeposites).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'><strong>Other Entries:</strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;' >&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    decimal? totalUnClearedOthers = 0;
                    foreach (var others in unclearedTransactions)
                    {
                        if ((others.DebitAmount - others.CreditAmount) <= 0 && others.SourceTable == "Manual JE")
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding:4px;' class='OtherDate'>" + others.EntryDate.ToShortDateString() + "</td>");
                            ojbSB.Append("<td style='text-align:left;padding:4px;' class='OthreVendor'>" + others.VendorName + "</td>");
                            ojbSB.Append("<td style='text-align:center;padding:4px;' class='OtherDocument'>" + others.CheckNumber + "</td>");
                            ojbSB.Append("<td style='text-align:right;padding:4px;' class='OtherAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((others.DebitAmount - others.CreditAmount)).ToString("#,##0.00") + "</span></td>");
                            ojbSB.Append("<td style='padding:4px;text-align:right;' >&nbsp;</td>");
                            ojbSB.Append("</tr>");

                            totalUnClearedOthers = totalUnClearedOthers + (others.DebitAmount - others.CreditAmount);
                        }
                    }

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'>Total Uncleared Other Entries:</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalOtherUnCleared'>$ " + Convert.ToDecimal(totalUnClearedOthers).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'><strong>Checks:</strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;' >&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    decimal? totalUnClearedChecks = 0;
                    foreach (var checks in unclearedTransactions)
                    {
                        if (
                             (checks.SourceTable == "Payment" && (checks.PayBy == "Check" || checks.PayBy == "Manual Check"))
                             ||
                             (checks.SourceTable == "Invoice" && (checks.PayBy == "Invoice"))
                        )
                        //if (checks.SourceTable == "Payment" && (checks.PayBy == "Check" || checks.PayBy == "Manual Check"))
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding:4px;' class='checksDate'>" + checks.EntryDate.ToShortDateString() + "</td>");
                            ojbSB.Append("<td style='text-align:left;padding:4px;' class='checksVendor'>" + checks.VendorName + "</td>");
                            ojbSB.Append("<td style='text-align:center;padding:4px;' class='checksDocument'>" + checks.CheckNumber + "</td>");
                            ojbSB.Append("<td style='text-align:right;padding:4px;' class='checksAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((checks.DebitAmount - checks.CreditAmount)).ToString("#,##0.00") + "</span></td>");
                            ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                            ojbSB.Append("</tr>");

                            totalUnClearedChecks = totalUnClearedChecks + (checks.DebitAmount - checks.CreditAmount);
                        }
                    }

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'>Total Uncleared Checks:</td>");
                    ojbSB.Append("<td style='text-align: center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalChecksUnCleared'>$ " + Convert.ToDecimal(totalUnClearedChecks).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'><strong>Wires:</strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");

                    decimal? totalUnClearedWires = 0;
                    foreach (var wires in unclearedTransactions)
                    {
                        if (wires.SourceTable == "Payment" && (wires.PayBy == "Wire Check" || wires.PayBy == "ACH"))
                        {
                            ojbSB.Append("<td style='padding:4px;'  class='WiresDate'>" + wires.EntryDate.ToShortDateString() + "</td>");
                            ojbSB.Append("<td style='text-align:left;padding:4px;'  class='WiresVendor'>" + wires.VendorName + "</td>");
                            ojbSB.Append("<td style='text-align:center;padding:4px;'  class='WiresDocuments'>" + wires.CheckNumber + "</td>");
                            ojbSB.Append("<td style='text-align:right;padding:4px;'  class='WiresAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((wires.DebitAmount - wires.CreditAmount)).ToString("#,##0.00") + "</spnan></td>");
                            ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                            ojbSB.Append("</tr>");

                            totalUnClearedWires = totalUnClearedWires + (wires.DebitAmount - wires.CreditAmount);
                        }
                    }
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'>Total Uncleared Wires:</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalWiresUnCleared'>$ " + Convert.ToDecimal(totalUnClearedWires).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<td style='padding:4px;'><strong>Adjustment:</strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");

                    decimal? totalUnClearedAdjustment = 0;
                    foreach (var adjustment in unclearedAdjustment)
                    {

                        ojbSB.Append("<td style='padding:4px;'  class='WiresDate'>" + adjustment.Date + "</td>");
                        ojbSB.Append("<td style='text-align:left;padding:4px;'  class='WiresVendor'>" + adjustment.Description + "</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;'  class='WiresDocuments'></td>");
                        ojbSB.Append("<td style='text-align:right;padding:4px;'  class='WiresAmount'><span style='text-align:left;'>$ </span><span style='text-align:right;'>" + Convert.ToDecimal((adjustment.Amount)).ToString("#,##0.00") + "</spnan></td>");
                        ojbSB.Append("<td style='padding:4px;text-align:right;'>&nbsp;</td>");
                        ojbSB.Append("</tr>");

                        totalUnClearedAdjustment = totalUnClearedAdjustment + (adjustment.Amount);

                    }
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;'>Total Uncleared Adjustment:</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;border-bottom: 1px solid;width: 150px;' class='TotalWiresUnCleared'>$ " + Convert.ToDecimal(totalUnClearedAdjustment).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    totalUnCleared = totalCleared + totalUnClearedDeposites + totalUnClearedOthers + totalUnClearedChecks + totalUnClearedWires + totalUnClearedAdjustment;

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align: left;' colspan='2'><strong>Ending Ledger Balance As Of : <span class='statmentdate'>" + currentReconcilation.StatementDate.ToShortDateString() + "</span></strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;border-bottom: 1px solid;width: 150px;'><strong class='TotalBankBalanceUnCleared'>$ " + Convert.ToDecimal(totalUnCleared).ToString("#,##0.00") + "</strong></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;'  colspan='5'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    if (isCombined == true)
                    {
                        ojbSB.Append("<br><tr>");
                        ojbSB.Append("<td style='padding:4px;' colspan='2'>** Combined entries on this Journal Entry</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                        ojbSB.Append("<td style='text-align:center;padding:4px;'>&nbsp;</td>");
                        ojbSB.Append("<td style='padding:4px;text-align:right;'></td>");
                        ojbSB.Append("</tr><br><br>");
                    }
                    ojbSB.Append("</table>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");

                }
                ojbSB.Append("</body>");
                ojbSB.Append("</html>");
            }
            string json = "{\"reportdata\":\""
               + ojbSB.ToString()
               + "}";
            string jsonReturn = JsonConvert.SerializeObject(ojbSB);
            return jsonReturn.ToString();

        }

        [Route("ReportsBankRecSummary")]
        [HttpPost]
        public string ReportsBankRecSummary(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckRun"]["callPayload"])));
            var BankReconcileJSON = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["BankReconcile"]));
            int BankID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["BankId"])));
            int ProdID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ProdId"])));
            int UserId = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["UserId"])));

            StringBuilder ojbSB = new StringBuilder();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                int BankReconciliationID = Convert.ToInt32(BankReconcileJSON["BankReconciliationID"]);
                string isSummary = Convert.ToString(BankReconcileJSON["isSummary"]).ToUpper();
                string includeuncleared = Convert.ToString(BankReconcileJSON["includeuncleared"]).ToUpper();
                string ReportDate = DateTime.Now.ToShortDateString();

                var bankInfo = CompanyContext.GetBankInfoById(BankID);
                var databaseItems = AdminContext.AdminAPIToolsProductionList(UserId);
                var currentDB = databaseItems.Where(i => i.ProductionId == ProdID).FirstOrDefault();

                var bankTransactions = BusinessContext.GetBankTransaction(BankID, BankReconciliationID, ProdID);
                var bankAdjustment = BusinessContext.GetBankAdjustmentData(BankReconciliationID, BankID, ProdID);

                var clearedTransactions = bankTransactions.Where(i => i.ReconcilationStatus == "CLEARED");
                var clearedAdjustment = bankAdjustment.Where(i => i.Status == "CLEARED");

                var reconcilationList = ReportContext.GetReconcilationList(ProdID, BankID);
                var currentReconcilation = reconcilationList.Where(i => i.ReconcilationID == BankReconciliationID).FirstOrDefault();

                var priorBankRec = reconcilationList.TakeWhile(x => x.ReconcilationID != BankReconciliationID).LastOrDefault();

                string postedDateFrom = "-"; decimal priorBalance = 0;
                if (priorBankRec != null)
                {
                    postedDateFrom = priorBankRec.StatementDate.ToShortDateString();
                    priorBalance = priorBankRec.StatementEndingAmount;
                }

                string isInclude = ""; string width = "";
                if (includeuncleared == "TRUE") { isInclude = "Included"; width = "189px"; } else { isInclude = "Not Included"; width = "211px"; }

                ojbSB.Append("<html>");
                ojbSB.Append("<head><title>Bank Reconciliation Reports</title>");
                ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 10mm; }</style></head>");
                ojbSB.Append("<body>");
                ojbSB.Append("<table style='width:8.5in; font-family: Arial, Helvetica, sans-serif;font-size: 12px;border-spacing:0;'>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Bank:</strong> <span class='bankid'>" + bankInfo[0].Bankname.ToUpper() + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Bank Reconciliation ID:</strong>  <span class='BankRecId'>" + BankReconciliationID + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong>" + currentDB.Name.ToUpper() + "</strong></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Posted Date From:</strong> <span class='PostedDateFrom'>" + postedDateFrom + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;width: 448px;'><strong>BANK RECONCILIATION REPORT </strong></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;'><strong>Posted Date To:</strong> <span class='PostedDateTo'>" + currentReconcilation.StatementDate.ToShortDateString() + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong>" + bankInfo[0].Bankname.ToUpper() + "</strong></td>");
                ojbSB.Append("<td style='text-align: right;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:5px;width: " + width + ";'><strong>Uncleared Transactions:</strong> <span class='Include'>" + isInclude + "</span></td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong>Statement Ending: <span class='EndingDate'>" + currentReconcilation.StatementDate.ToShortDateString() + "</span></strong></td>");
                ojbSB.Append("<td style='text-align: right;'><strong>Report Date:</strong> <span class='ReportDate'>" + ReportDate + "</span></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td colspan='3'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td colspan='3'>");
                ojbSB.Append("<table style='width:8.5in; font-family: Arial, Helvetica, sans-serif;font-size: 12px;border-spacing:0;'>");
                ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                ojbSB.Append("<td style='padding:5px;border-bottom: 1px solid;width: 406px;' >&nbsp;</td>");
                ojbSB.Append("<td style='padding:5px; border-bottom-style: solid; border-bottom-color: inherit; border-bottom-width: 1px;text-align: right;'  colspan='3'><strong>Balance </strong> </td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='3'><strong>Previous Statement’s Ending Bank Balance:</strong></td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' ><strong>$ " + Convert.ToDecimal(priorBalance).ToString("#,##0.00") + "</strong></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='4'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;width: 406px;' ><strong>Cleared Transactions:</strong></td>");
                ojbSB.Append("<td style='text-align:center;padding:4px;' colspan='3'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;' colspan='4'>&nbsp;</td>");
                ojbSB.Append("</tr>");

                var totalDeposits = (from cl in clearedTransactions
                                     where cl.SourceTable == "Manual JE" && (cl.DebitAmount - cl.CreditAmount) > 0
                                     select (cl.DebitAmount - cl.CreditAmount)).Sum();

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;width: 406px;' >Total Cleared Deposits: </td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;'  colspan='3'>$ " + Convert.ToDecimal(totalDeposits).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                var totalOthers = (from cl in clearedTransactions
                                   where cl.SourceTable == "Manual JE" && (cl.DebitAmount - cl.CreditAmount) <= 0
                                   select (cl.DebitAmount - cl.CreditAmount)).Sum();

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align: left' colspan='2' >Total Cleared Other Entries: </td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' >$ " + Convert.ToDecimal(totalOthers).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                var totalChecks = (from cl in clearedTransactions
                                   where
                                        (cl.SourceTable == "Payment" && (cl.PayBy == "Check" || cl.PayBy == "Manual Check"))
                                        ||
                                        (cl.SourceTable == "Invoice" && (cl.PayBy == "Invoice"))
                                   select (cl.DebitAmount - cl.CreditAmount)).Sum();

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align: left' colspan='2' >Total Cleared Checks: </td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' >$ " + Convert.ToDecimal(totalChecks).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                var totalWires = (from cl in clearedTransactions
                                  where cl.SourceTable == "Payment" && (cl.PayBy == "Wire Check" || cl.PayBy == "ACH")
                                  select (cl.DebitAmount - cl.CreditAmount)).Sum();

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align: left' colspan='2' >Total Cleared Wires: </td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' ><div style='border-bottom: 0px solid;width: 20%;float: right;'>$ " + Convert.ToDecimal(totalWires).ToString("#,##0.00") + "</div></td>");
                ojbSB.Append("</tr>");

                var totalAdjustments = (from cl in clearedAdjustment
                                        where cl.Status == "CLEARED"
                                        select cl.Amount).Sum();

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align: left' colspan='2' >Total Cleared Adjustment: </td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' ><div style='border-bottom: 1px solid;width: 20%;float: right;'>$ " + Convert.ToDecimal(totalAdjustments).ToString("#,##0.00") + "</div></td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align: left' colspan='2' >&nbsp;</td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' >&nbsp;</td>");
                ojbSB.Append("</tr>");

                var totalCleared = priorBalance + totalAdjustments + (from cl in clearedTransactions select (cl.DebitAmount - cl.CreditAmount)).Sum();

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align: left;' colspan='2' ><strong>Total Cleared Bank Balance As Of: " + currentReconcilation.StatementDate.ToShortDateString() + ":</strong></td>");
                ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' ><strong><div style='border-bottom: 1px solid;width: 20%;float: right;'>$ " + Convert.ToDecimal(totalCleared).ToString("#,##0.00") + "</strong></div></td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding:4px;text-align:right;'  colspan='4'>");

                if (includeuncleared == "TRUE")
                {
                    var unclearedTransactions = bankTransactions.Where(i => i.ReconcilationStatus == "UNCLEARED");

                    var unclearedAdjustment = bankAdjustment.Where(i => i.Status == "UNCLEARED");

                    ojbSB.Append("<table style='width:8.5in; font-family: Arial, Helvetica, sans-serif;font-size: 12px;border-spacing:0;'>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='4'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;width: 362px;text-align: left;' ><strong>UnCleared Transactions:</strong></td>");
                    ojbSB.Append("<td style='text-align:center;padding:4px;' colspan='3'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;' colspan='4'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    var totalUnClearedDeposits = (from uncl in unclearedTransactions
                                                  where uncl.SourceTable == "Manual JE" && (uncl.DebitAmount - uncl.CreditAmount) > 0
                                                  select (uncl.DebitAmount - uncl.CreditAmount)).Sum();

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;width: 362px;text-align: left;' >Total UnCleared Deposits: </td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;'  colspan='3'>$ " + Convert.ToDecimal(totalUnClearedDeposits).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");

                    var totalUnClearedOthers = (from uncl in unclearedTransactions
                                                where uncl.SourceTable == "Manual JE" && (uncl.DebitAmount - uncl.CreditAmount) <= 0
                                                select (uncl.DebitAmount - uncl.CreditAmount)).Sum();

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align: left;width: 750px;' colspan='2' >Total UnCleared Other Entries: </td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' >$ " + Convert.ToDecimal(totalUnClearedOthers).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");

                    var totalUnCleareChecks = (from uncl in unclearedTransactions
                                               where
                                                    (uncl.SourceTable == "Payment" && (uncl.PayBy == "Check" || uncl.PayBy == "Manual Check"))
                                                    ||
                                                    (uncl.SourceTable == "Invoice" && (uncl.PayBy == "Invoice"))
                                               select (uncl.DebitAmount - uncl.CreditAmount)).Sum();


                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align: left;width: 750px;' colspan='2' >Total UnCleared Checks: </td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' >$ " + Convert.ToDecimal(totalUnCleareChecks).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");

                    var totalUnCleareWires = (from uncl in unclearedTransactions
                                              where uncl.SourceTable == "Payment" && (uncl.PayBy == "Wires" || uncl.PayBy == "ACH's")
                                              select (uncl.DebitAmount - uncl.CreditAmount)).Sum();

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align: left;width: 750px;' colspan='2' >Total UnCleared Wires: </td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' ><div style='border-bottom: 0px solid;width: 20%;float: right;'>$ " + Convert.ToDecimal(totalUnCleareWires).ToString("#,##0.00") + "</div></td>");
                    ojbSB.Append("</tr>");

                    var totalUnCleareAdjustment = (from cl in unclearedAdjustment
                                                   where cl.Status == "UNCLEARED"
                                                   select cl.Amount).Sum();

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align: left;width: 750px;' colspan='2' >Total UnCleared Adjustment: </td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' ><div style='border-bottom: 1px solid;width: 20%;float: right;'>$ " + Convert.ToDecimal(totalUnCleareAdjustment).ToString("#,##0.00") + "</div></td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align: left;width: 750px;' colspan='2' >&nbsp;</td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' >&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    var totalUnCleared = totalCleared + totalUnCleareAdjustment + (from uncl in unclearedTransactions select (uncl.DebitAmount - uncl.CreditAmount)).Sum();

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align: left;width: 750px;' colspan='2' ><strong>Ending Ledger Balance As Of : " + currentReconcilation.StatementDate.ToShortDateString() + ":</strong></td>");
                    ojbSB.Append("<td style='padding:4px;text-align: right;' colspan='2' ><div style='border-bottom: 1px solid;width: 20%;float: right;'><strong>$ " + Convert.ToDecimal(totalUnCleared).ToString("#,##0.00") + "</strong></div></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding:4px;text-align:right;'  colspan='4'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append(" </table>");
                }
                ojbSB.Append(" </td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</table>");
                ojbSB.Append("</body>");
                ojbSB.Append("</html>");
            }
            string json = "{\"reportdata\":\""
               + ojbSB.ToString()
               + "}";
            string jsonReturn = JsonConvert.SerializeObject(ojbSB);
            return jsonReturn.ToString();

        }
        [Route("ReportsPaymentPreview")]
        [HttpPost]
        public string ReportsPaymentPreview(JSONParameters callParameters)
        {

            try
            {
                var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckCycle"]["callPayload"])));
                CheckCycleEntity checkcycle = JsonConvert.DeserializeObject<CheckCycleEntity>(Convert.ToString(JOrigin["CheckCycle"]["callPayload"]));
                int BankID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["BankId"])));
                int ProdID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ProdId"])));
                int UserId = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["UserId"])));

                var Filters = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["Filters"])));

                var Paydate = Filters["PayDate"];
                var PaymentType = Filters["PaymentType"];
                var PeriodStatus = Filters["PeriodStatus"];
                var InvoiceDtFrom = Filters["InvoiceDtFrom"];
                var InvoiceDtTo = Filters["InvoiceDtTo"];
                var InvoiceAmntFrom = Filters["InvoiceAmntFrom"];
                var InvoiceAmntTo = Filters["InvoiceAmntTo"];
                var UserName = Filters["UserName"];
                var Location = Convert.ToString(Filters["Location"]);
                if (Convert.ToString(Filters["Location"]) == "") { Location = "All"; }
                var Episode = Convert.ToString(Filters["Episode"]);
                var Sets = Convert.ToString(Filters["Sets"]);
                var Vendor = Convert.ToString(Filters["Vendor"]);
                if (Vendor == "") { Vendor = "All"; }

                string ReportDate = DateTime.Now.ToShortDateString();

                var bankInfo = CompanyContext.GetBankInfoById(BankID);
                var databaseItems = AdminContext.AdminAPIToolsProductionList(UserId);
                var currentDB = databaseItems.Where(i => i.ProductionId == ProdID).FirstOrDefault();

                var VendorGroup = checkcycle.V;




                StringBuilder ojbSB = new StringBuilder();
                if (this.Execute(this.CurrentUser.APITOKEN) == 0)
                {
                    ojbSB.Append("<html>");
                    ojbSB.Append("<head><title>Bank Reconciliation Reports</title>");
                    ojbSB.Append("<head><title>Bank Reconciliation Reports</title>");
                    ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 10mm; }</style></head>");
                    ojbSB.Append("<body>");
                    ojbSB.Append("<table style='width:10.5in;font-family: Arial, Helvetica, sans-serif;font-size: 12px;border-spacing:0;'>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td colspan='7'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                    ojbSB.Append("<td style=' width: 117px;' >Location(s):</td>");
                    ojbSB.Append("<td style='width: 145px;' >" + Location + "</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;' >Vendor From:</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;'>" + Vendor + "</td>");
                    ojbSB.Append("<td style='width: 189px;text-align: left;'>Payment Type:</td>");
                    ojbSB.Append("<td style='width: 305px;text-align: left;'>" + PaymentType + "</td>");
                    ojbSB.Append("<td style='text-align: right;font-size: 13px;'>" + currentDB.Name.ToUpper() + "</td>");
                    ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                    if (Episode != "")
                    {
                        ojbSB.Append("<td style='width: 117px;'>Episode(s):</td>");
                        ojbSB.Append("<td style='width: 145px;' >" + Episode + "</td>");
                    }
                    else
                    {
                        if (Sets == "") { Sets = "All"; }
                        ojbSB.Append("<td style='width: 117px;'>Set(s):</td>");
                        ojbSB.Append("<td style='width: 145px;' >" + Sets + "</td>");
                    }
                    ojbSB.Append("<td style='width: 137px;text-align: left;' >Vendor To:</td>");
                    ojbSB.Append("<td style='width: 131px;text-align: left;font-size: small;'>" + Vendor + "</td>");
                    ojbSB.Append("<td style='text-align: left;width: 215px;font-size: small;'>Posted Unpaid Invoice:</td>");
                    ojbSB.Append("<td style='width: 305px;text-align: left;' > Included</td>");
                    ojbSB.Append("<td style='text-align: right;font-size: 13px;width: 20%;'>" + currentDB.Name.ToUpper() + "</td>");
                    ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='height: 19px;' ></td>");
                    ojbSB.Append("<td style='text-align: left;'>Period Status:</td>");
                    ojbSB.Append("<td style='text-align: left;width: 145px;' >" + PeriodStatus + "</td>");
                    ojbSB.Append("<td style='text-align: left;width: 190px;'>Invoice Amount From:</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;'>" + InvoiceAmntFrom + "</td>");
                    ojbSB.Append("<td style='width: 189px;text-align: left;'>Currency:</td>");
                    ojbSB.Append("<td style='text-align: left;'>USD</td>");
                    ojbSB.Append("<td style='text-align: right;font-size: 13px;'><strong>Payment Preview Report</strong></td>");
                    ojbSB.Append("<td style='text-align: left;'></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 150px;' >Invoice Date From: </td>");
                    ojbSB.Append("<td style='width: 145px;' >" + InvoiceDtFrom + "</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;' >Invoice Amount To:</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;' >" + InvoiceAmntTo + "</td>");
                    ojbSB.Append("<td style='width: 189px;text-align: left;' >Report Date:</td>");
                    ojbSB.Append("<td style='width: 305px;text-align: left;'>" + ReportDate + " </td>");
                    ojbSB.Append("<td style='text-align: right;font-size: 13px;'>" + bankInfo[0].Bankname.ToUpper() + "</td>");
                    ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 10px;height: 19px;' ></td>");
                    ojbSB.Append("<td style='width: 117px;height: 19px;' >Invoice Date To:</td>");
                    ojbSB.Append("<td style='width: 145px;height: 19px;' >" + InvoiceDtTo + "</td>");
                    ojbSB.Append("<td style='width: 137px;height: 19px;text-align: left;' >Batch No.:</td>");
                    ojbSB.Append("<td style='height: 19px;width: 137px;text-align: left;' >All</td>");
                    ojbSB.Append("<td style='width: 189px;height: 19px;text-align: left;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 305px;height: 19px;text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:left;height: 19px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:left;height: 19px;'></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td style=' width: 117px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='width: 145px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;'>User Name:</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;'>" + UserName + "</td>");
                    ojbSB.Append("<td style='width: 189px;text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: left;'></td>");
                    ojbSB.Append("<td style='text-align: left;'></td>");
                    ojbSB.Append("<td style='text-align: left;'></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                    ojbSB.Append("<td style=' width: 117px;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 145px;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 189px;text-align: left;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 305px;text-align: left;' ></td>");
                    ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 10px;height: 6px;' ></td>");
                    ojbSB.Append("<td style='width: 117px; height: 6px;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 145px; height: 6px;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 137px;height: 6px;text-align: left;' >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 137px;text-align: left;' ></td>");
                    ojbSB.Append("<td style='width: 189px;height: 6px;' ></td>");
                    ojbSB.Append("<td style='width: 305px;height: 6px;text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: left;height: 6px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: left;height: 6px;'></td>");
                    ojbSB.Append("</tr>");


                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                    ojbSB.Append("<td colspan='7'>");

                    ojbSB.Append("<table style='width:100%; border-spacing:0;font-size: 12px;  font-family: Arial, Helvetica, sans-serif;'>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td>");
                    ojbSB.Append("<table style='width:100%; border-spacing:0;font-size: 12px;  font-family: Arial, Helvetica, sans-serif;'>");
                    ojbSB.Append("<tr style='font-weight:bold;background-color: #A4DEF9;'>");
                    ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px; height: 28px;' colspan='3'>Vendor Name</td>");
                    ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px; height: 28px;' colspan='2'>Pay Grouping</td>");
                    ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px; height: 28px;width: 115px;'>Pay Date</td>");
                    ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px;height: 28px;width: 136px;'>Payment #</td>");
                    ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px; width: 139px;height: 28px;'>Invoice Date</td>");
                    ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px;width: 188px;height: 28px;'>Invoice #</td>");
                    ojbSB.Append("<td style='text-align: center;padding: 5px; border-bottom: solid 1px; height: 28px;width: 11%;'>Invoice Amount</td>");
                    ojbSB.Append("<td style='text-align: center;padding: 5px; border-bottom: solid 1px; height: 28px;width: 10%;'>Check Amount</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clsbreak'>");
                    ojbSB.Append("<td colspan='11' style='height:20px'></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr class='clsvendordtl'>");
                    ojbSB.Append("<td style='height: 20px;' colspan='11'>");
                    ojbSB.Append("<table style='width:100%; border-spacing:0;font-size: 12px;  font-family: Arial, Helvetica, sans-serif;'>");
                    ojbSB.Append("<tr style='font-weight:bold;'>");
                    ojbSB.Append("<td style='text-align: left;font-size: medium;'>Invoices to be Paid </td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr style='font-weight:bold;'>");
                    ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("</tr>");


                    var tempVendor = ""; double totalpaid = 0;
                    foreach (var vendors in VendorGroup)
                    {

                        if (tempVendor != vendors.VendorName)
                        {
                            int totalchecks = 0; int totalinvoices = 0; double amount = 0;
                            foreach (var groups in vendors.CCCG)
                            {
                                if (groups.CheckGroupNumber != "-1" && groups.VendorName == vendors.VendorName)
                                {
                                    totalchecks++;

                                    foreach (var inv in groups.CCCGI)
                                    {
                                        totalinvoices++;

                                        amount = amount + inv.Amount;
                                    }
                                }
                            }

                            if (totalchecks != 0)
                            {
                                ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                ojbSB.Append("<td style='text-align:left;'  class='date vendorname' colspan='3'><strong>" + vendors.VendorName + "</strong></td>");
                                ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center;width: 115px;'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center; width: 136px;' class='checkcount'></td>");
                                ojbSB.Append("<td style='text-align: right;width: 139px;'>&nbsp;</td>");
                                ojbSB.Append("<td style='width: 188px;text-align: center;' class='invcount'></td>");
                                ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:right;'><span style='float:left;text-align:left;'></td>");
                                //ojbSB.Append("<td style='text-align:right;'><span style='float:left;text-align:left;'><strong>$</strong></span><strong>" + Convert.ToDecimal(amount).ToString("#,##0.00")  + "</strong></td>");
                                ojbSB.Append("</tr>");

                                var tempgroup = "";
                                foreach (var groups in vendors.CCCG)
                                {
                                    if (groups.CheckGroupNumber != "-1" && groups.VendorName == vendors.VendorName)
                                    {
                                        double subtotal = 0;
                                        foreach (var inv in groups.CCCGI)
                                        {
                                            if (groups.CheckGroupNumber != tempgroup)
                                            {
                                                ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                                ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'></td>");
                                                ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>" + groups.CheckGroupNumber + "</td>");
                                                ojbSB.Append("<td style='text-align:center;width: 115px;'>" + Paydate + "</td>");
                                                ojbSB.Append("<td style='text-align:center; width: 136px;'  >" + groups.CheckNumber + "</td>");
                                                ojbSB.Append("<td  style='text-align: center; width: 139px;'>" + inv.InvoiceDate + "</td>");
                                                ojbSB.Append("<td  style='width: 188px;text-align: left;'>" + inv.InvoiceNumber + "</td>");
                                                ojbSB.Append("<td style='text-align:right;'><span style='float:left;text-align:left;margin-left: 20%;'class='amount'>$</span>" + Convert.ToDecimal(inv.Amount).ToString("#,##0.00") + "</td>");
                                                ojbSB.Append("<td style='text-align:right;'></td>");
                                                ojbSB.Append("</tr>");

                                                tempgroup = groups.CheckGroupNumber;
                                            }
                                            else
                                            {
                                                ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                                ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'></td>");
                                                ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'></td>");
                                                ojbSB.Append("<td style='text-align:center;width: 115px;'></td>");
                                                ojbSB.Append("<td style='text-align:center; width: 136px;'  ></td>");
                                                ojbSB.Append("<td  style='text-align: center; width: 139px;'>" + inv.InvoiceDate + "</td>");
                                                ojbSB.Append("<td  style='width: 188px;text-align: left;'>" + inv.InvoiceNumber + "</td>");
                                                ojbSB.Append("<td style='text-align:right;'><span style='float:left;text-align:left;margin-left: 20%;'class='amount'>$</span>" + Convert.ToDecimal(inv.Amount).ToString("#,##0.00") + "</td>");
                                                ojbSB.Append("<td style='text-align:right;'></td>");
                                                ojbSB.Append("</tr>");
                                            }

                                            subtotal = subtotal + inv.Amount;

                                        }

                                        ojbSB.Append("<tr class='clssubtotal' style='padding: 5px;'>");
                                        ojbSB.Append("<td colspan='3' style=' height: 18px;'></td>");
                                        ojbSB.Append("<td colspan='2' style=' height: 18px;'></td>");
                                        ojbSB.Append("<td style='height: 18px;width: 115px;'></td>");
                                        ojbSB.Append("<td style='height: 18px;width: 136px;'></td>");
                                        ojbSB.Append("<td style='width: 139px;height: 18px;'></td>");
                                        ojbSB.Append("<td style=' width: 188px;text-align: left;'><strong>Check #" + groups.CheckNumber + "</strong>&nbsp;&nbsp;</td>");
                                        ojbSB.Append("<td style='height: 18px;'></td>");
                                        ojbSB.Append("<td style='text-align:right;height: 18px;'><span style='float:left;text-align:left;margin-left: 16%;'><strong>$</strong></span><strong>" + Convert.ToDecimal(subtotal).ToString("#,##0.00") + "</strong></td>");
                                        ojbSB.Append("</tr>");

                                        ojbSB.Append("<tr class='clsbreak'>");
                                        ojbSB.Append("<td colspan='8' style='height:10px'></td>");
                                        ojbSB.Append("</tr>");

                                        totalpaid = totalpaid + subtotal;
                                    }
                                }


                                ojbSB.Append("<tr class='clssubtotal' style='padding: 5px;'>");
                                ojbSB.Append("<td colspan='3' style=' height: 18px;'></td>");
                                ojbSB.Append("<td colspan='2' style=' height: 18px;'></td>");
                                ojbSB.Append("<td style='height: 18px;width: 115px;'></td>");
                                ojbSB.Append("<td style='height: 18px;width: 136px;'></td>");
                                ojbSB.Append("<td style='width: 139px;height: 18px;'></td>");
                                ojbSB.Append("<td style=' width: 188px;border-bottom: solid 1px;' colspan='2'><strong>" + vendors.VendorName + "</strong></td>");
                                //ojbSB.Append("<td style='height: 18px;text-align: left;border-bottom: solid 1px;'></td>");
                                ojbSB.Append("<td style='text-align:right;height: 18px;border-bottom: solid 1px;'><span style='float:left;text-align:left;margin-left: 16%;'><strong>$</strong></span><strong>" + Convert.ToDecimal(amount).ToString("#,##0.00") + "</strong></td>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr class='clsbreak'>");
                                ojbSB.Append("<td colspan='8' style='height:10px'></td>");
                                ojbSB.Append("</tr>");
                            }
                            tempVendor = vendors.VendorName;
                        }

                    }

                    ojbSB.Append("<tr class='clsbreak'>");
                    ojbSB.Append("<td colspan='11' style='height:20px'></td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clstotal' style='padding: 5px;'>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td  style='width: 265px;'></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td style='width: 104px;'></td>");
                    ojbSB.Append("<td style='width: 115px;'></td>");
                    ojbSB.Append("<td style=' width: 136px;'></td>");
                    ojbSB.Append("<td style='text-align:right;font-weight:bold; width: 139px;'  >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 188px;border-bottom: solid 1px;text-align: left;' colspan='2'><strong>Total Paid Amount: </strong></td>");
                    //ojbSB.Append("<td style='border-bottom: solid 1px;text-align: left;'></td>");
                    ojbSB.Append("<td style='text-align:right;border-bottom: solid 1px;'  class='total'><span style='text-align:left; float: left;height: 15px;    margin-left: 16%;'><strong>$</strong></span><strong>" + Convert.ToDecimal(totalpaid).ToString("#,##0.00") + "</strong></td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                    ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;width: 115px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center; width: 136px;'>&nbsp;</td>");
                    ojbSB.Append("<td  style='text-align: center; width: 139px;'>&nbsp;</td>");
                    ojbSB.Append("<td  style='width: 188px;text-align: center;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                    ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;width: 115px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center; width: 136px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: center; width: 139px;'>&nbsp;</td>");
                    ojbSB.Append("<td  style='width: 188px;text-align: center;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                    ojbSB.Append("<td style='text-align:left;font-size: medium;'  colspan='3'><strong>Remaining Unpaid Invoices </strong></td>");
                    ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;width: 115px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center; width: 136px;'>&nbsp;</td>");
                    ojbSB.Append("<td  style='text-align: center; width: 139px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='width: 188px;text-align: center;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                    ojbSB.Append("<td style='text-align:left;font-size: medium;' colspan='3'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center;width: 115px;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:center; width: 136px;'  >&nbsp;</td>");
                    ojbSB.Append("<td style='text-align: center; width: 139px;'>&nbsp;</td>");
                    ojbSB.Append("<td  style='width: 188px;text-align: center;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                    ojbSB.Append("</tr>");

                    var tempUnpaidVendor = ""; double totalunpaid = 0;
                    foreach (var vendors in VendorGroup)
                    {
                        foreach (var groups in vendors.CCCG)
                        {
                            if (groups.CheckGroupNumber == "-1" && groups.VendorName == vendors.VendorName)
                            {
                                double subtotal = 0;
                                foreach (var inv in groups.CCCGI)
                                {

                                    if (tempUnpaidVendor != vendors.VendorName)
                                    {
                                        ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                        ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'><strong>" + vendors.VendorName + "</strong></td>");
                                        ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align:center;width: 115px;'>&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align:center; width: 136px;'  >&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align: center; width: 139px;'>" + inv.InvoiceDate + "</td>");
                                        ojbSB.Append("<td style='width: 188px;text-align: left;'>" + inv.InvoiceNumber + "</td>");
                                        ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align:right;'><span style='text-align:left; float: left;height: 15px;'>$</span>" + Convert.ToDecimal(inv.Amount).ToString("#,##0.00") + "</td>");
                                        ojbSB.Append("</tr>");
                                    }
                                    else
                                    {
                                        ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                        ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'><strong></strong></td>");
                                        ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align:center;width: 115px;'>&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align:center; width: 136px;'  >&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align: center; width: 139px;'>" + inv.InvoiceDate + "</td>");
                                        ojbSB.Append("<td style='width: 188px;text-align: left;'>" + inv.InvoiceNumber + "</td>");
                                        ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                                        ojbSB.Append("<td style='text-align:right;'><span style='text-align:left; float: left;height: 15px;'></span>" + Convert.ToDecimal(inv.Amount).ToString("#,##0.00") + "</td>");
                                        ojbSB.Append("</tr>");
                                    }


                                    tempUnpaidVendor = vendors.VendorName;

                                    subtotal = subtotal + inv.Amount;

                                }

                                totalunpaid = totalunpaid + subtotal;


                                ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center;width: 115px;'  >&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center; width: 136px;'  >&nbsp;</td>");
                                ojbSB.Append("<td style='text-align: center; width: 139px;'>&nbsp;</td>");
                                ojbSB.Append("<td style='width: 188px;text-align: center;'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center;width: 115px;'  >&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center; width: 136px;'  >&nbsp;</td>");
                                ojbSB.Append("<td style='text-align: center; width: 139px;'>&nbsp;</td>");
                                ojbSB.Append("<td style='width: 188px;border-bottom: solid 1px;' colspan='2'><strong>Unpaid " + vendors.VendorName + ":</strong></td>");
                                //ojbSB.Append("<td  style='border-bottom: solid 1px;text-align: left;'></td>");
                                ojbSB.Append("<td style='text-align:right;border-bottom: solid 1px;'><span style='float:left;text-align:left;'><strong>$</strong></span><strong>" + Convert.ToDecimal(subtotal).ToString("#,##0.00") + "</strong></td>");
                                ojbSB.Append("</tr>");


                                ojbSB.Append("<tr class='clstransactions' style='padding: 5px;'>");
                                ojbSB.Append("<td style='text-align:left;'  class='date' colspan='3'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center;'  class='source' colspan='2'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center;width: 115px;'  >&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:center; width: 136px;'  >&nbsp;</td>");
                                ojbSB.Append("<td style='text-align: center; width: 139px;'>&nbsp;</td>");
                                ojbSB.Append("<td style='width: 188px;text-align: center;'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                                ojbSB.Append("<td style='text-align:right;'>&nbsp;</td>");
                                ojbSB.Append("</tr>");
                            }
                        }
                    }
                    ojbSB.Append("<tr class='clstotal' style='padding: 5px;'>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td style='width: 265px;'></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td style='width: 104px;'></td>");
                    ojbSB.Append("<td style='width: 115px;'></td>");
                    ojbSB.Append("<td style=' width: 136px;'></td>");
                    ojbSB.Append("<td style='text-align:right;font-weight:bold; width: 139px;'  >&nbsp;</td>");
                    ojbSB.Append("<td style='width: 188px;border-bottom: solid 1px;text-align: left;' colspan='2'><strong>Total Unpaid Amount: </strong></td>");
                    //ojbSB.Append("<td style='border-bottom: solid 1px;text-align: left;'></td>");
                    ojbSB.Append("<td style='text-align:right;border-bottom: solid 1px;'  class='total'><span style='text-align:left; float: left;height: 15px;'><strong>$</strong></span><strong>" + Convert.ToDecimal(totalunpaid).ToString("#,##0.00") + "</strong></td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clsbreak'>");
                    ojbSB.Append("<td colspan='11'></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr class='clsbreak'>");
                    ojbSB.Append("<td colspan='11'>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</ table >");
                    ojbSB.Append("</ td > ");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td>&nbsp;</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append(" </table>");
                    ojbSB.Append("</body>");
                    ojbSB.Append("</html>");

                }

                string json = "{\"reportdata\":\""
                  + ojbSB.ToString()
                  + "}";
                string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                return jsonReturn.ToString();
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
                return ex.ToString();
            }


        }

    }

    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/ReportAPIAPInvoices")]
    public class ReportAPIAPInvoicesController : ReportAPIController
    {
        [Route("ReportsAPInvoicesByTransaction")]
        [HttpPost]
        public HttpResponseMessage ReportsAPInvoicesByTransaction(JSONParameters callParameters)
        {
            HttpResponseMessage response = this.Request.CreateResponse(HttpStatusCode.OK);
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));

                    int ProdID = Convert.ToInt32(Payload["ProdID"]);
                    // Get the ReportConfig
                    AtlasUtilities AU = new AtlasUtilities();
                    string ReportConfig = AU.AtlasUtilities_Config_Get("Reports.ReportConfig.Master", null, ProdID, null).ConfigJSON;

                    string strReportType = (Payload["Status"] == "Saved") ? "AP INVOICE AUDIT REPORT" : "AP INVOICE POSTED REPORT";

                    var result = BusinessContext.ReportsInvoiceTransactionJSON(callParameters);
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
                        string returnString = ReportEngineController.MakeJSONExport(result);
                        combindedString += ",  \"resultExport\": " + returnString + "}";
                        response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
                        return response;
                    }
                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintDate = BusinessContextR.UserSpecificTime(Convert.ToInt32(ProdID));
                    var CompanyName = BusinessContext.GetCompanyNameByID(Convert.ToInt32(string.Join(",", Payload.InvoiceFilterCompany).Substring(1)));

                    StringBuilder ojbSB = new StringBuilder();

                    var StrCount = result.Count;

                    int ColumnLength = 6;

                    if (StrCount > 0)
                    {

                        dynamic SegmentConfig = JsonConvert.DeserializeObject<dynamic>(Payload.SegmentConfig.ToString());
                        string[] OptSegment = SegmentConfig.OptionalSegments.ToString().Split(','); //srtRD.SegmentOptional.Split(',');
                        ColumnLength = ColumnLength + OptSegment.Length;
                        string[] TransCode11 = SegmentConfig.TransCodes.ToString().Split(',');
                        ColumnLength = ColumnLength + TransCode11.Length;
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title id='ReportCSS'>" + strReportType + "</title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table cellpadding='3' class='reportheadertable'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + (ColumnLength + 2) + "'>");
                        ojbSB.Append("<table style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Company : " + (CompanyName[0].CompanyCode) + "</td>");
                        ojbSB.Append("<th style='text-align: center; padding: 0px; font-size: 16px; width: 70%; float: left;'>" + Payload["ProductionName"] + " </th>");
                        ojbSB.Append("<td style='width: 15%;'>Transaction No. From : " + (Payload["InvoiceTransFrom"] == "" ? "All" : Payload["InvoiceTransFrom"]) + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Location : " + (string.Join(",", Payload.InvoiceFilterLocation) == "" ? "All" : string.Join(",", Payload.InvoiceFilterLocation)) + "</td>");
                        ojbSB.Append("<th style='text-align: center; padding: 0px; font-size: 16px; width: 70%; float: left;'>" + CompanyName[0].CompanyName + " </th>");
                        ojbSB.Append("<td style='width: 15%;'>Transaction No To : " + (Payload["InvoiceTransTo"] == "" ? "All" : Payload["InvoiceTransTo"]) + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        string aa = SegmentConfig.Segments.ToString();
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<td style='width: 15%;'>Episode(s)  : " + (string.Join(",", Payload.InvoiceFilterEpisode) == "" ? "All" : string.Join(",", Payload.InvoiceFilterEpisode)) + "</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 70%; float: left; text-align: center;'>&nbsp;</th>");
                            ojbSB.Append("<td style='width: 15%; float: right;'>Period Status : " + (Payload["txtApInvsPeriod"] == "" ? "All" : Payload["txtApInvsPeriod"]) + "</td>");
                            ojbSB.Append("</tr>");
                        }
                        else
                            ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Bank : " + ((Payload["ApInvsBank"]).ToString() == "" ? "All" : (Payload["ApInvsBank"]).ToString()) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 70%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<td style='width: 15%;'> Vendor Name : " + (Convert.ToString(Payload["ddlInvoiceVendor"]) == "" ? "All" : Convert.ToString(Payload["ddlInvoiceVendor"])) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        if (aa.IndexOf("EP") == -1)
                        {
                            ojbSB.Append("<td style='width: 15%;'>Period Status : " + ((Payload["txtApInvsPeriod"]).ToString() == "" ? "All" : (Payload["txtApInvsPeriod"]).ToString()) + "</td>");
                        }
                        else
                            ojbSB.Append("<td style='width: 15%;'>&nbsp;</td>");

                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 70%; float: left; text-align: center;'>" + strReportType + "</th>");
                        ojbSB.Append("<td style='width: 15%;'>Batch : " + (Convert.ToString(Payload["ddlInvoiceBatch"]) == "" ? "All" : Convert.ToString(Payload["ddlInvoiceBatch"])) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Invoice Date From : " + ((Payload["ApInvsCreatedFrom"]).ToString() == "" ? "All" : (Payload["ApInvsCreatedFrom"]).ToString()) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 70%; float: left; text-align: center;'>By Transaction</th>");
                        ojbSB.Append("<td style='width: 15%;'>UserName : " + (Convert.ToString(Payload["ddlInvoiceUserName"]) == "" ? "All" : Convert.ToString(Payload["ddlInvoiceUserName"])) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Invoice Date To : " + ((Payload["ApInvsCreatedTo"]).ToString() == "" ? "All" : (Payload["ApInvsCreatedTo"]).ToString()) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 70%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<td style='width: 15%;'>Report Date : " + PrintDate + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr style='background-color: #A4DEF9; border-bottom: 1px solid;'>");
                        ojbSB.Append("<th>Trans #</th>");
                        ojbSB.Append("<th>Vendor</th>");
                        ojbSB.Append("<th>Invoice #</th>");
                        ojbSB.Append("<th>Date</th>");
                        ojbSB.Append("<th>Period</th>");
                        ojbSB.Append("<th>Batch #</th>");
                        ojbSB.Append("<th>Invoice Description</th>");
                        ojbSB.Append("<th colspan='" + (ColumnLength - 5) + "'>&nbsp;</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr style='background-color: #A4DEF9;  border-bottom: 1px solid;'>");
                        ojbSB.Append("<th colspan='" + (ColumnLength - 7) + "' class='fieldheader'>&nbsp;</th>");
                        ojbSB.Append("<th class='fieldheader'>CO</th>");
                        ojbSB.Append("<th class='fieldheader'>LO</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th class='fieldheader'>EP</th>");
                        }
                        ojbSB.Append("<th class='fieldheader'>Detail</th>");
                        ojbSB.Append("<th class='fieldheader'>FF1</th>");
                        ojbSB.Append("<th class='fieldheader'>FF2</th>");
                        ojbSB.Append("<th class='fieldheader'>Line Item Description</th>");
                        ojbSB.Append("<th class='fieldheader'>Tax Code</th>");
                        ojbSB.Append("<th class='amount fieldheader'>Amount</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        //Header ends

                        //data 1 starts
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: bold;'  ># 124</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Castex Rental</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>37884215</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>04/22/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>2</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>ak04222018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Grip Package Rental</th>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 5) + "'>&nbsp;</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength + 2) + "'>Payment #12345 Payment Date: 04/22/2018 (Voided)</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4707</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Grip Package Rental-1st</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ 638.12</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr class='pencilbottom'>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 2) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Total: Transaction #124</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>&nbsp;</th>");
                        ojbSB.Append("<th class='amount' style='font-weight:bold'>$ 638.12</th>");
                        ojbSB.Append("</tr>");
                        //data 1 ends

                        //data 2 starts
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: bold;'  ># 125</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Hollywood Center</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>78241154</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>04/22/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>2</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>ak04232018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Vally House Set-Episode 3</th>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 5) + "'>&nbsp;</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength + 2) + "'>Reversed Invoice: 04/22/2018 (Voided)</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>003</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4143</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Light Fixture For Valley House</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ -2200.50</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr class='pencilbottom'>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 2) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Total: Transaction #125</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>&nbsp;</th>");
                        ojbSB.Append("<th class='amount' style='font-weight:bold'>$ 2200.50</th>");
                        ojbSB.Append("</tr>");
                        //data 2 ends

                        //data 3 starts
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: bold;'  ># 126</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Birns & Sawyer, In</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>884215</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>04/22/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>2</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>ak04232018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Grip Expendables @House</th>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 5) + "'>&nbsp;</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength + 2) + "'>Payment #12345 Payment Date: 04/22/2018</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>002</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4707</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Expendables For Valley House</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ 789.36</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength + 2) + "'>Payment #12345 Payment Date: 04/22/2018</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>002</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4707</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Expendables For Valley House</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ 789.36</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength + 2) + "'>Payment #12345 Payment Date: 04/22/2018</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>002</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4707</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Expendables For Valley House</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ 789.36</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength + 2) + "'>Payment #12345 Payment Date: 04/22/2018</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>002</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4707</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Expendables For Valley House</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ 789.36</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength + 2) + "'>Payment #12345 Payment Date: 04/22/2018</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>002</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4707</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Expendables For Valley House</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ 789.36</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr class='pencilbottom'>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 2) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Total: Transaction #126</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>&nbsp;</th>");
                        ojbSB.Append("<th class='amount' style='font-weight:bold'>$ 3946.80</th>");
                        ojbSB.Append("</tr>");
                        //data 3 ends

                        //data 4 starts
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: bold;'  ># 127</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Castex Rentals</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>37884215</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>04/22/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>2</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>ak04232018</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Package Rental</th>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 5) + "'>&nbsp;</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 7) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >01</th>");
                        ojbSB.Append("<th style='font-weight: bold;' >00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: bold;'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: bold;'  >4143</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Q</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>Grip Rental Package - 1st Week</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>01</th>");
                        ojbSB.Append("<th class='amount'>$ 638.12</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr class='pencilbottom'>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 2) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Total: Transaction #127</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>&nbsp;</th>");
                        ojbSB.Append("<th class='amount' style='font-weight:bold'>$ 638.12</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 2) + "'>&nbsp;</th>");
                        ojbSB.Append("<th style='font-weight: bold;'  >Total Invoices By Transaction</th>");
                        ojbSB.Append("<th style='font-weight: normal;'>&nbsp;</th>");
                        ojbSB.Append("<th class='amount' style='font-weight:bold'>$ 638.12</th>");
                        ojbSB.Append("</tr>");
                        //data 4 ends

                        ojbSB.Append("</table></body></html>");

                        string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
                        combindedString += ", \"ReportConfig\": " + ReportConfig; // We're expecting the ReportConfig to be a properly formatted JSON doc
                        string returnString = ojbSB.ToString();
                        combindedString += ", \"ReportHTML\": \"" + returnString.Replace("\"", "\\\"") + "\"";
                        combindedString += "}";

                        response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
                        return response;
                    }
                    else
                    {
                        response.Content = new StringContent("", Encoding.UTF8, "application/json");
                        return response;
                    }
                }
                catch (Exception ex)
                {
                    response.Content = new StringContent("Exception:" + ex.Message, Encoding.UTF8, "application/json");
                    return response;
                }
            }
            else
            {
                response.Content = new StringContent("", Encoding.UTF8, "application/json");
                return response;
            }
        }
        [Route("ReportsAPInvoicesByAccount")]
        [HttpPost]
        public HttpResponseMessage ReportsAPInvoicesByAccount(JSONParameters callParameters)
        {
            HttpResponseMessage response = this.Request.CreateResponse(HttpStatusCode.OK);

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    ReportsBussiness BusinessContext = new ReportsBussiness();
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(Payload["ProdID"]);
                    // Get the ReportConfig
                    AtlasUtilities AU = new AtlasUtilities();
                    string ReportConfig = AU.AtlasUtilities_Config_Get("Reports.ReportConfig.Master", null, ProdID, null).ConfigJSON;
                    string strReportType = Payload["Status"] == "Saved" ? "AP INVOICE AUDIT REPORT" : "AP INVOICE POSTED REPORT";

                    var result = BusinessContext.ReportsInvoiceAccountJSON(callParameters);
                    if (Convert.ToBoolean(Payload["isExport"] ?? false))
                    {
                        string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
                        string returnString = ReportEngineController.MakeJSONExport(result);
                        combindedString += ",  \"resultExport\": " + returnString + "}";
                        response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
                        return response;
                    }

                    ReportP1Business BusinessContextR = new ReportP1Business();
                    string PrintDate = BusinessContextR.UserSpecificTime(ProdID);

                    StringBuilder ojbSB = new StringBuilder();
                    string CId = (string.Join(",", Payload.InvoiceFilterCompany) == "" ? "ALL" : string.Join(",", Payload.InvoiceFilterCompany));
                    var CompanyName = BusinessContext.GetCompanyNameByID(Convert.ToInt32(string.Join(",", Payload.InvoiceFilterCompany).Substring(1)));

                    var StrCount = result.Count;
                    int ColumnLength = 14;
                    if (StrCount > 0)
                    {
                        dynamic SegmentConfig = JsonConvert.DeserializeObject<dynamic>(Payload.SegmentConfig.ToString());
                        string[] OptSegment = SegmentConfig.OptionalSegments.ToString().Split(','); //srtRD.SegmentOptional.Split(',');
                        ColumnLength = ColumnLength + OptSegment.Length;
                        string[] TransCode11 = SegmentConfig.TransCodes.ToString().Split(',');
                        ColumnLength = ColumnLength + TransCode11.Length;
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title id='ReportCSS'>" + strReportType + "</title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table cellpadding='3' class='reportheadertable'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "'>");
                        ojbSB.Append("<table style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Company : " + (CompanyName[0].CompanyCode) + "</td>");
                        ojbSB.Append("<th style='text-align: center; padding: 0px; font-size: 16px; width: 70%; float: left;'>" + Payload["ProductionName"] + " </th>");
                        ojbSB.Append("<td style='width: 15%;'>Transaction No. From : " + (Payload["InvoiceTransFrom"] == "" ? "ALL" : Payload["InvoiceTransFrom"]) + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Location : " + (string.Join(",", Payload.InvoiceFilterLocation) == "" ? "ALL" : string.Join(",", Payload.InvoiceFilterLocation)) + "</td>");
                        ojbSB.Append("<th style='text-align: center; padding: 0px; font-size: 16px; width: 70%; float: left;'>" + CompanyName[0].CompanyName + " </th>");
                        ojbSB.Append("<td style='width: 15%;'>Transaction No To : " + (Payload["InvoiceTransTo"] == "" ? "ALL" : Payload["InvoiceTransTo"]) + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        string aa = SegmentConfig.Segments.ToString();
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<td style='width: 15%;'>Episode(s)  : " + (string.Join(",", Payload.InvoiceFilterEpisode) == "" ? "ALL" : string.Join(",", Payload.InvoiceFilterEpisode)) + "</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 70%; float: left; text-align: center;'>&nbsp;</th>");
                            ojbSB.Append("<td style='width: 15%;'>Vendor Name : " + (Convert.ToString(Payload["ddlInvoiceVendor"]) == "" ? "ALL" : Convert.ToString(Payload["ddlInvoiceVendor"])) + "</td>");
                            ojbSB.Append("</tr>");
                        }
                        else
                            ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Bank : " + ((Payload["ApInvsBank"]).ToString() == "" ? "ALL" : (Payload["ApInvsBank"]).ToString()) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 70%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<td style='width: 15%;'>Batch : " + (Convert.ToString(Payload["ddlInvoiceBatch"]) == "" ? "ALL" : Convert.ToString(Payload["ddlInvoiceBatch"])) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        //if (aa.IndexOf("EP") == -1) Invalid
                        //{
                        ojbSB.Append("<td style='width: 15%;'>Period Status : " + ((Payload["txtApInvsPeriod"]).ToString() == "" ? "ALL" : (Payload["txtApInvsPeriod"]).ToString()) + "</td>");
                        //}
                        //else
                        //ojbSB.Append("<td style='width: 15%;'>&nbsp;</td>");

                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 70%; float: left; text-align: center;'>" + strReportType + "</th>");
                        ojbSB.Append("<td style='width: 15%;'>UserName : " + (Convert.ToString(Payload["ddlInvoiceUserName"]) == "" ? "ALL" : Convert.ToString(Payload["ddlInvoiceUserName"])) + "</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Invoice Date From : " + ((Payload["ApInvsCreatedFrom"]).ToString() == "" ? "ALL" : (Payload["ApInvsCreatedFrom"]).ToString()) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 70%; float: left; text-align: center;'>By Account</th>");
                        ojbSB.Append("<td style='width: 15%; float: right;'>&nbsp;</td>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='width: 15%;'>Invoice Date To : " + ((Payload["ApInvsCreatedTo"]).ToString() == "" ? "ALL" : (Payload["ApInvsCreatedTo"]).ToString()) + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 70%; float: left; text-align: center;'>&nbsp;</th>");
                        ojbSB.Append("<td style='width: 15%;'>Report Date : " + PrintDate + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                        ojbSB.Append("<th class='fieldheader'>CO</th>");
                        ojbSB.Append("<th class='fieldheader'>LO</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th class='fieldheader'>EP</th>");
                        }
                        ojbSB.Append("<th class='fieldheader'>DT</th>");
                        ojbSB.Append("<th class='fieldheader'>FF!</th>");
                        ojbSB.Append("<th class='fieldheader'>FF2</th>");
                        ojbSB.Append("<th class='fieldheader'>Date</th>");
                        ojbSB.Append("<th class='fieldheader'>Invoice #</th>");
                        ojbSB.Append("<th colspan='2' class='fieldheader'>Description</th>");
                        ojbSB.Append("<th class='fieldheader'>Trans #</th>");
                        ojbSB.Append("<th colspan='2' class='fieldheader'>Batch</th>");
                        ojbSB.Append("<th class='fieldheader'>Period</th>");
                        ojbSB.Append("<th colspan='2' class='fieldheader'>Line Description</th>");
                        ojbSB.Append("<th class='fieldheader'>Tax Code</th>");
                        ojbSB.Append("<th class='amount fieldheader'>Amount</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        //Header ends

                        //Body starts 1st
                        ojbSB.Append("<tbody>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + (ColumnLength - 2) + "' style='font-weight: bold !important;  background-color: #FFFAE3;'>0201 – PC – Marianne Reynolds – Custodian</th>");
                        ojbSB.Append("<th style='font-weight: bold !important; background-color: #FFFAE3;'>Total:</th>");
                        ojbSB.Append("<th class='amount' style='font-weight: bold !important; background-color: #FFFAE3;'>$ 14,000.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("<tbody style='border:1px solid'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "' style='font-weight: bold !important; font-size: 11px; text-align: left;'>Marianne Reynolds</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1002</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>88</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1002</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>88</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1002</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>88</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1002</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>88</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;' colspan='" + (ColumnLength - 3) + "'></th>"); //123456
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>SubTotal Marianne Reynolds</b></th>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>0201</b></th>");
                        ojbSB.Append("<th class='amount' style='font-weight: normal;  border-bottom-width: 1px;'><b>$ 1,000.00</b></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");

                        ojbSB.Append("<tbody style='border:1px solid'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "' style='font-weight: bold !important; font-size: 11px; text-align: left;'>Elvis Presley</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1002</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>88</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #2</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;' colspan='" + (ColumnLength - 3) + "'></th>"); //123456
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>SubTotal Elvis Presley</b></th>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>0201</b></th>");
                        ojbSB.Append("<th class='amount' style='font-weight: normal;  border-bottom-width: 1px;'><b>$ 1,000.00</b></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        //Body ends 1st

                        //Body starts 2nd
                        ojbSB.Append("<tbody>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + (ColumnLength - 2) + "' style='font-weight: bold !important;  background-color: #FFFAE3;'>0202 – PC – Alex King</th>");
                        ojbSB.Append("<th style='font-weight: bold !important;  background-color: #FFFAE3;'>Total:</th>");
                        ojbSB.Append("<th class='amount' style='font-weight: bold !important; background-color: #FFFAE3;'>$ 14,000.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("<tbody style='border:1px solid'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "' style='font-weight: bold !important; font-size: 11px; text-align: left;'>Alex King</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1003</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>89</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1003</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>89</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1003</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>89</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1003</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>89</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #1</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;' colspan='" + (ColumnLength - 3) + "'></th>"); //123456
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>SubTotal Alex King</b></th>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>0202</b></th>");
                        ojbSB.Append("<th class='amount' style='font-weight: normal;  border-bottom-width: 1px;'><b>$ 1,000.00</b></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");

                        ojbSB.Append("<tbody style='border:1px solid'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + ColumnLength + "' style='font-weight: bold !important; font-size: 11px; text-align: left;'>Wyatt Earp</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>00</th>");
                        if (aa.IndexOf("EP") != -1)
                        {
                            ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>001</th>");
                        }
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>0201</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>CA</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>NQ</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>04/23/2018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1295</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>94</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>mm02182018</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>1</th>");
                        ojbSB.Append("<th colspan='2' style='font-weight: normal;  ' class='pencilbottom'>AP Invoice by account #2</th>");
                        ojbSB.Append("<th style='font-weight: normal;  ' class='pencilbottom'>01</th>");
                        ojbSB.Append("<th style='font-size: 11px; text-align: right; font-weight: normal;  ' class='pencilbottom'>$ 129.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;' colspan='" + (ColumnLength - 3) + "'></th>"); //123456
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>SubTotal Wyatt Earp</b></th>");
                        ojbSB.Append("<th style='font-weight: normal;  border-bottom-width: 1px;'><b>0202</b></th>");
                        ojbSB.Append("<th class='amount' style='font-weight: normal;  border-bottom-width: 1px;'><b>$ 1,000.00</b></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        //Body ends 2nd

                        ojbSB.Append("<tbody>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th class='pencilbottom' colspan='" + ColumnLength + "'>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='font-weight: normal;' colspan='" + (ColumnLength - 3) + "'></th>");
                        ojbSB.Append("<th style='font-weight: bold;' colspan='2'>Total Invoices by Account :</th>");
                        ojbSB.Append("<th class='amount' style='font-weight: bold;'>$ 85,858.00</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table></body></html>");

                        string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
                        combindedString += ", \"ReportConfig\": " + ReportConfig; // We're expecting the ReportConfig to be a properly formatted JSON doc
                        string returnString = ojbSB.ToString();
                        combindedString += ", \"ReportHTML\": \"" + returnString.Replace("\"", "\\\"") + "\"";
                        combindedString += "}";

                        response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
                        return response;
                    }
                    else
                    {
                        response.Content = new StringContent("", Encoding.UTF8, "application/json");
                        return response;
                    }
                }

                catch (Exception ex)
                {
                    response.Content = new StringContent("Exception:" + ex.Message, Encoding.UTF8, "application/json");
                    return response;
                }
            }
            else
            {
                response.Content = new StringContent("", Encoding.UTF8, "application/json");
                return response;
            }
        }
    }
}