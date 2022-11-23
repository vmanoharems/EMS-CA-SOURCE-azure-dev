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
//using SendGrid;

using EMS.Controllers;
using iTextSharp.text.pdf;
using iTextSharp.text;
using System.IO;
using System.Globalization;
using Newtonsoft.Json;

namespace EMS.API
{
    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/ReportP1")]
    // [RoutePrefix("api/AccountPayableOp")]
    public class ReportP1Controller : ApiController
    {
        ReportP1Business BusinessContext = new ReportP1Business();
        PayrollOperationBussiness BusinessContextPayroll = new PayrollOperationBussiness();
        CRWBussiness BusinessContextCRW = new CRWBussiness();

        private const string LocalLoginProvider = "Local";
        int LoopNo;

        protected CustomPrincipal CurrentUser
        { get { return HttpContext.Current.User as CustomPrincipal; } }
        protected int Execute(string APITOKEN = null)
        {
            try
            {
                if (this.CurrentUser == null)
                    return -1;//"Authorization Failed!";
                if (this.CurrentUser.Identity != null || APITOKEN != null)//this.CurrentUser.IsInRole("Admin")||
                    return 0;//"Success"
                else
                    return 1;//"ClientID is not valid!";
            }
            catch { return 99; }
        }
        //   AccountPayableBusiness BusinessContext = new AccountPayableBusiness();

        public string FileNameNew(int ID)
        {
            Random random = new Random();
            int password = random.Next(10000);
            string ReturnVal = Convert.ToString(ID) + Convert.ToString(password);
            return ReturnVal;
        }

        [Route("CheckPrintPDF")]
        public string CheckPrintPDF(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckRun"]["callPayload"])));

            string ProdID = Convert.ToString(JOriginCheckRun["ProdId"]);
            string ProName = Convert.ToString(JOriginCheckRun["ProName"]);
            string Filter = Convert.ToString(JOriginCheckRun["Filter"]);
            int UserID = Convert.ToInt32(JOriginCheckRun["UserId"]);

            string[] tokens = Filter.Split('|');
            string CompanyID = tokens[0];
            string BankID = tokens[1];
            string CheckRunList = tokens[2];
            DateTime Date1;
            DateTime Date2;
            try
            {
                Date1 = Convert.ToDateTime(tokens[3]);
            }
            catch (Exception ex)
            {
                Date1 = Convert.ToDateTime("01/01/0001");
            }

            try
            {
                Date2 = Convert.ToDateTime(tokens[4]);
            }
            catch (Exception ex)
            {
                Date2 = Convert.ToDateTime("01/01/9999");
            }

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Reports/BankingPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {
                }

                PDFCreation BusinessContext1 = new PDFCreation();

                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/BankingPDF/"), "");

                string FinalPDFName1 = "Merge" + DateTime.Now;

                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                if (File.Exists(resumeFile))
                {
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/BankingPDF/"), "");
                List<string> termsList = new List<string>();
                Boolean isHeaderPrinted = false;

                var CheckRunIDs = BusinessContext.GetCheckPrintFilter(callParameters);
                if (CheckRunIDs.Count > 0)
                {
                    StringBuilder ojbSB = new StringBuilder();

                    for (int i = 0; i < CheckRunIDs.Count; i++)
                    {
                        int CheckRunID = Convert.ToInt32(CheckRunIDs[i].CheckRunID);

                        var PDFData = BusinessContext.GetDataForCheckReport(CheckRunID);
                        if (!isHeaderPrinted)
                        {
                            var HeaderData = BusinessContext.GetDataForCheckReportHeader(CheckRunID);
                            ojbSB.Append("<html>");
                            ojbSB.Append("<head><title></title></head>");
                            ojbSB.Append("<body>");
                            ojbSB.Append("<table style='width: 10.5in; float: left;'>");
                            ojbSB.Append("<thead>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank : " + HeaderData[0].Bankname + "</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + HeaderData[0].CompanyName + "</th>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp;</td>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Currency : USD</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + ProName + "</th>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp;</td>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Period : " + HeaderData[0].Period + "</td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'></th>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp;</td>");
                            ojbSB.Append(" </tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'></td>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'></th>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp;</td>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left; '>&nbsp;</td>");
                            ojbSB.Append(" <th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>Check Run Register</th>");
                            ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp;</td>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("</thead>");
                            ojbSB.Append("</table>");
                            ojbSB.Append("<table style='width: 10.5in; float: left;'>");
                            ojbSB.Append("<thead>");
                            ojbSB.Append("<tr>");

                            string CurrentDate = BusinessContext.UserSpecificTime(Convert.ToInt32(ProdID));

                            ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; float: right; padding-bottom: 10px; text-align: right;'>Printed on : " + CurrentDate + "</td>");
                            ojbSB.Append(" </tr>");
                            ojbSB.Append("</thead>");

                            ojbSB.Append("</table>");
                            ojbSB.Append("<table style='width: 10.5in; border-collapse: collapse; border-top: 1px solid #ccc;'>");
                            ojbSB.Append("<thead>");
                            ojbSB.Append("<tr style='border: 1px solid #000; background-color: #A4DEF9 ;'>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Check #</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Vendor Code</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Vendor (Payee Name)</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Period</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Trans # </th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Check Type</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Run #</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Check Amount</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("</thead>");
                            isHeaderPrinted = true;
                        }
                        ojbSB.Append("<tbody>");
                        decimal AmountSum = 0;
                        for (int j = 0; j < PDFData.Count; j++)
                        {
                            ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CheckNo + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].VendorNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].PrintOncheckAS + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CompanyPeriod + "</th>");
                            ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].TransactionNumber + "</th>");
                            if ((PDFData[j].Status == "Voided") || (PDFData[j].Status == "Cancelled"))
                            {
                                ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].Status + "</th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CheckRunID + "</th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>-$" + Convert.ToDecimal(PDFData[j].PaidAmount).ToString("#,##0.00") + "</th>");
                                AmountSum = AmountSum - Convert.ToDecimal(PDFData[j].PaidAmount);
                            }
                            else
                            {
                                ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].PayBy + "</th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CheckRunID + "</th>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(PDFData[j].PaidAmount).ToString("#,##0.00") + "</th>");
                                AmountSum = AmountSum + Convert.ToDecimal(PDFData[j].PaidAmount);
                            }
                            ojbSB.Append(" </tr>");
                        }
                        ojbSB.Append(" <tr>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; line-height: 45px;' colspan='3'>Check Count Total : " + PDFData.Count + "</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; line-height: 45px;'></th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; line-height: 45px;'></th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; line-height: 45px;' colspan='2'>Report Total</th>");
                        if (AmountSum > 0)
                        {
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; line-height: 45px;'>$" + Convert.ToDecimal(AmountSum).ToString("#,##0.00") + "</th>");
                        }
                        else
                        {
                            AmountSum = AmountSum * (-1);
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; line-height: 45px;'>-$" + Convert.ToDecimal(AmountSum).ToString("#,##0.00") + "</th>");
                        }

                        ojbSB.Append("</tr>");

                        //string NewPDF = ojbSB.ToString();

                        //string TimeStampp =Convert.ToString(DateTime.Now.ToLongTimeString());

                        //BusinessContext1.GeneratePDFReport("Reports/BankingPDF", "CheckPrint" + CheckRunID + TimeStampp.Replace(":", "_").Replace(" ", "_") + "", "BankingPDF", NewPDF.Replace("&", "&#38;"));
                        //termsList.Add(fileSavePath + "\\CheckPrint" + CheckRunID + TimeStampp.Replace(":", "_").Replace(" ", "_") + ".PDF");
                    }
                    ojbSB.Append(" </tbody>");
                    ojbSB.Append("</table>");
                    ojbSB.Append("</body>");
                    ojbSB.Append("</html>");

                    //string[] terms = termsList.ToArray();

                    //string FinalPDFName = "CheckRunRegister_" + DateTime.Now.ToShortTimeString().Replace(":", "_").Replace(" ", "_");

                    //MergePDFs(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

                    //return FinalPDFName;

                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }
        }

        [Route("CheckSummary")]
        public string CheckSummary(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));

            var JOriginCRSummary = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CRSummary"])));

            int ProdID = Convert.ToInt32(JOriginCRSummary["ProdId"]);
            string ProName = Convert.ToString(JOriginCRSummary["ProName"]);
            string Filter = Convert.ToString(JOriginCRSummary["Filter"]);
            int UserID = Convert.ToInt32(JOriginCRSummary["UserId"]);
            string[] tokens = Filter.Split('|');
            string CompanyID = tokens[0];
            string BankID = tokens[1];
            string CheckRunList = tokens[2];
            DateTime Date1;
            DateTime Date2;
            try
            {
                Date1 = Convert.ToDateTime(tokens[3]);
            }
            catch (Exception ex)
            {
                Date1 = Convert.ToDateTime("01/01/0001");
            }

            try
            {
                Date2 = Convert.ToDateTime(tokens[4]);
            }
            catch (Exception ex)
            {
                Date2 = Convert.ToDateTime("01/01/9999");
            }

            string CheckType = tokens[5];

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Reports/BankingPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {
                }

                PDFCreation BusinessContext1 = new PDFCreation();

                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/BankingPDF/"), "");

                string FinalPDFName1 = "Merge" + DateTime.Now;

                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                if (File.Exists(resumeFile))
                {
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/BankingPDF/"), "");
                List<string> termsList = new List<string>();
                string FinalPDFName = "";


                var PDFData = BusinessContext.GetCheckSummaryFilter(callParameters);
                if (PDFData.Count > 0)
                {
                    var HeaderData = BusinessContext.GetDataForCheckReportHeader(Convert.ToInt32(PDFData[0].CheckRunID));

                    StringBuilder ojbSB = new StringBuilder();
                    ojbSB.Append("<html>");
                    ojbSB.Append("<head><title></title></head>");
                    ojbSB.Append("<body>");
                    ojbSB.Append("<table style='width: 10.5in; float: left;repeat-header: yes;border-collapse: collapse;' >");
                    ojbSB.Append("<thead>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th colspan='10'>");

                    ojbSB.Append("<table style='width: 100%;'>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank : " + HeaderData[0].Bankname + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + HeaderData[0].CompanyName + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Currency : USD</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + ProName + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Period : " + HeaderData[0].Period + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'></th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</th>");
                    ojbSB.Append(" </tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'></th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</th>");
                    ojbSB.Append(" <th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>Check Register Summary</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>&nbsp;</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");
                    ojbSB.Append("</th>");

                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th colspan='10'>");
                    ojbSB.Append("<table style='width: 100%;'>");
                    ojbSB.Append("<tr>");

                    string CurrentDate = BusinessContext.UserSpecificTime(ProdID);

                    ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; float: right; padding-bottom: 10px; text-align: right;'>Printed on : " + CurrentDate + "</td>");
                    ojbSB.Append(" </tr>");
                    ojbSB.Append("</table>");
                    ojbSB.Append("</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr style='border: 1px solid #000; background-color: #A4DEF9 ;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Payment #</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Payment Date</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Check Type</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Vendor Code</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Vendor (Payee_Name)</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Period #</th>");

                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Run #</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Cleared_Date</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Pos_Pay_#</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Payment_Amount</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</thead>");
                    ojbSB.Append("<tbody>");

                    int CheckTypeCount = 0;
                    decimal CheckTypeAmount = 0;

                    int ManualCheckCount = 0;
                    decimal ManualCheckAmount = 0;

                    int WireCount = 0;
                    decimal WireAmount = 0;

                    int VoidCount = 0;
                    decimal VoidAmount = 0;

                    int CancelCount = 0;
                    decimal CancelAmount = 0;

                    for (int j = 0; j < PDFData.Count; j++)
                    {
                        if (PDFData[j].Status == "Printed")
                        {
                            if (PDFData[j].PayBy == "Check")
                            {
                                CheckTypeCount++;
                                CheckTypeAmount += Convert.ToDecimal(PDFData[j].PaidAmount);
                            }
                            if (PDFData[j].PayBy == "Manual Check")
                            {
                                ManualCheckCount++;
                                ManualCheckAmount += Convert.ToDecimal(PDFData[j].PaidAmount);
                            }
                            if (PDFData[j].PayBy == "Wire Check")
                            {
                                WireCount++;
                                WireAmount += Convert.ToDecimal(PDFData[j].PaidAmount);
                            }
                            ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CheckNo + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].PaymentDate + "</th>");
                            ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].PayBy + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].VENDorNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].PrintOncheckAS + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CompanyPeriod + "</th>");
                            //ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].TransactionNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CheckRunID + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(PDFData[j].PaidAmount).ToString("#,##0.00") + "</th>");
                        }
                        else
                        {
                            if (PDFData[j].Status == "Voided")
                            {
                                VoidCount++;
                                VoidAmount += Convert.ToDecimal(PDFData[j].PaidAmount);
                            }
                            if (PDFData[j].Status == "Cancelled")
                            {
                                CancelCount++;
                                CancelAmount += Convert.ToDecimal(PDFData[j].PaidAmount);
                            }

                            ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CheckNo + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].PaymentDate + "</th>");
                            ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].Status + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].VENDorNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].PrintOncheckAS + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CompanyPeriod + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PDFData[j].CheckRunID + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'></th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(PDFData[j].PaidAmount).ToString("#,##0.00") + "</th>");
                        }
                        ojbSB.Append("</tr>");
                    }

                    ojbSB.Append("</tbody>");
                    ojbSB.Append("</table>");

                    ojbSB.Append("<div style='float:left;width:100%;'>");

                    ojbSB.Append("<table>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width:40%;'>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("<td style='width:50%;text-align:centre;'>");
                    ojbSB.Append("<table style='margin-top:20px;border-collapse: collapse; border-top: 1px solid #ccc; display:inline-block;'>");
                    ojbSB.Append("<thead>");
                    ojbSB.Append("<tr style='border: 1px solid #000; background-color: #A4DEF9 ;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Payment Type</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: center; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Total Count</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Total Payments</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</thead>");
                    ojbSB.Append("<tbody>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Check</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + CheckTypeCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + CheckTypeAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Manual Check</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + ManualCheckCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + ManualCheckAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Wire Check</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + WireCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + WireAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Cancelled</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + CancelCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + CancelAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Voided</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + VoidCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + VoidAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>ACH</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>0</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$0.00</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("</tbody>");
                    ojbSB.Append("</table>");

                    ojbSB.Append("</td>");
                    ojbSB.Append("<td>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");

                    ojbSB.Append("</div>");

                    ojbSB.Append("</body>");
                    ojbSB.Append("</html>");

                    //string NewPDF = ojbSB.ToString();

                    //string TimeStampp = DateTime.Now.ToShortTimeString();

                    //FinalPDFName = "CheckRegisterSummary_" + DateTime.Now.ToShortTimeString().Replace(":", "_").Replace(" ", "_");
                    //BusinessContext1.GeneratePDFReportLandScape("Reports/BankingPDF", FinalPDFName, "BankingPDF", NewPDF.Replace("&", "&#38;"));
                    //return FinalPDFName;
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                else
                {
                    return "";
                }

            }
            else
            {
                return "";
            }
        }

        [Route("PayrollEditReportPDF")]
        [HttpGet, HttpPost]
        public string PayrollEditReportPDF(JSONParameters callParameters)
        {
            var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Reports/PayrollPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                { }

                PDFCreation BusinessContext1 = new PDFCreation();

                int ColCount = 2;
                List<string> termsList = new List<string>();

                var PayrollIDs = BusinessContext.GetPayrollFilterData(callParameters);
                if (PayrollIDs.Count > 0)
                {
                    StringBuilder ojbSB = new StringBuilder();
                    for (int i = 0; i < PayrollIDs.Count; i++)
                    {
                        var PDFHeaderData = BusinessContext.GetPayrollReportHeader(PayrollIDs[i].PayrollFileID);

                        var PDFTrData = BusinessContextPayroll.GetTransCodeForPayrollAudit(PayrollIDs[i].PayrollFileID);

                        // ---- Transaction Code ------------------------
                        string TransStr = PDFTrData[0].TransactionString;
                        string TrasnValue = "";
                        if (TransStr != "")
                        {
                            string NewStr = TransStr.Remove(TransStr.Length - 1);
                            string[] straa = TransStr.Split(',');

                            for (int j = 0; j < straa.Length; j += 2)
                            {
                                TrasnValue += straa[j] + ',';
                            }
                        }
                        int RowLength = 2;
                        string TransactionCodeTR = "";

                        var TransactionCodes = BusinessContextPayroll.GetTransCodeFromExpense(TrasnValue);

                        RowLength = RowLength + TransactionCodes.Count;

                        for (int k = 0; k < TransactionCodes.Count; k++)
                        {
                            TransactionCodeTR = TransactionCodeTR + "<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>" + TransactionCodes[k].TransCode + "</th>";
                        }
                        ColCount = ColCount + TransactionCodes.Count;

                        //---   Segment Code-----------\\

                        string SegmentStr = PDFTrData[0].SegmentString;
                        string NewSegStr = SegmentStr.Remove(SegmentStr.Length - 1);
                        string[] strSeg = SegmentStr.Split(',');
                        string SegmentVal = "";
                        for (int l = 0; l < strSeg.Length; l += 2)
                        {
                            SegmentVal += strSeg[l] + ',';
                        }

                        var SegmentCodes = BusinessContextPayroll.GetSegmentStringFromExpense(SegmentVal, (int)Payload["ProdID"]);

                        string SegmentCodeTR = "";

                        RowLength = RowLength + SegmentCodes.Count;

                        for (int m = 0; m < SegmentCodes.Count; m++)
                        {
                            SegmentCodeTR = SegmentCodeTR + "<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>" + SegmentCodes[m].SegmentCode + "</th>";
                        }
                        ColCount = ColCount + SegmentCodes.Count;

                        //------------ Payroll Data//////

                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body>");

                        ojbSB.Append("<table style='width: 10.5in; border-collapse: collapse; border-top: 1px solid #ccc;repeat-header: yes;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr><th colspan='" + RowLength + "'>");
                        ojbSB.Append("<table border=0 style='width: 100%; float: left; repeat-header: yes; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='" + RowLength + "'>");
                        ojbSB.Append("<table border=0 style='width: 100%;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th width='20%' style='vertical-align:top; align:left;'>");
                        ojbSB.Append("<table border=0 width='100%'>");
                        ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Company : " + Payload["PayrollFilterCompany"][0] + "</td></tr>");
                        ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Location(s) : " + (string.Join(",", Payload.PayrollFilterLocation) == "" ? "ALL" : string.Join(",", Payload.PayrollFilterLocation)) + "</td></tr>");
                        if (Convert.ToString(Payload["PayrollFilterEpisode"]) != "")
                        {
                            ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Episode(s) : " + (string.Join(",", Payload.PayrollFilterEpisode) == "" ? "ALL" : string.Join(",", Payload.PayrollFilterEpisode)) + "</td></tr>");
                        }
                        ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Invoice Number : " + PDFHeaderData[0].InvoiceNumber + "</td></tr>");
                        ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Payroll Date From : " + Payload["From"] + "</td></tr>");
                        ojbSB.Append("<tr><td style='padding: 0px; font-size: 12px; float: left;'>Payroll Date To : " + Payload["To"] + "</td></tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("<th width='60%' style='vertical-align:top;'>");
                        ojbSB.Append("<table border=0 width='100%' style='margin:auto; width=50%'>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>&nbsp;</th></tr>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 17px; text-align: center;'>" + PDFHeaderData[0].CompanyName + "</th></tr>");
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>" + PDFHeaderData[0].RunDateTime + "</th></tr>");
                        if (Payload["Mode"] == 1)
                        {
                            ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>PAYROLL EDIT</th></tr>");
                        }
                        else
                        {
                            ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>PAYROLL POSTED</th></tr>");
                        }
                        ojbSB.Append("<tr><th style='padding: 0px; font-size: 16px; text-align: center;'>Week Ending :" + PDFHeaderData[0].EndDate + "</th></tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr><th colspan='" + RowLength + "'>");
                        ojbSB.Append("<table style='width: 100%; float: left;'>");

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 12px; padding-bottom: 10px;width:25%; color: white;'>Printed on : 01/07/2016 12:37:15 AM</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 12px; padding-bottom: 10px;width:25%; color: white;'>Printed on : 01/07/2016 12:37:15 AM</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 12px; padding-bottom: 10px;width:25%; color: white;'>Printed on : 01/07/2016 12:37:15 AM</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 12px; padding-bottom: 10px;width:25%; color: white;'>Printed on : 01/07/2016 12:37:15 AM</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Currency : </th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Vendor</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Payroll Source Code</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>AP Source Code</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>USD</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>" + PDFHeaderData[0].VendorName + "</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>PR</th>");
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>AP</th>");
                        ojbSB.Append("</tr>");

                        ojbSB.Append("</table>");
                        ojbSB.Append("</th></tr>");

                        ojbSB.Append("<tr style='border: 1px solid #000; background-color: #A4DEF9;'>");
                        ojbSB.Append(SegmentCodeTR);
                        ojbSB.Append(TransactionCodeTR);
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Payment Amount</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Pay Description</th>");

                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        ojbSB.Append("<tbody>");

                        var PayrollData = BusinessContextPayroll.GetPayrollDataFileForAudit(PayrollIDs[i].PayrollFileID);

                        string OldHeader = "";
                        string NewHeader = "";

                        for (int z = 0; z < PayrollData.Count; z++)
                        {
                            NewHeader = PayrollData[z].Header;
                            if (OldHeader == NewHeader)
                            {
                            }
                            else
                            {
                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc; background-color: #FFFAE3;' colspan='" + RowLength + "'>");
                                ojbSB.Append("Name : " + PayrollData[z].LastName + " " + PayrollData[z].FirstName + " ");
                                ojbSB.Append("<span style='color: #FFFAE3;'>Vijay Gupta India</span>");
                                ojbSB.Append("SSN: " + PayrollData[z].SSN + "");
                                ojbSB.Append("<span style='color: #FFFAE3;'>Vijay Gupta India</span>");
                                ojbSB.Append("Check No. " + PayrollData[z].CheckNumber + "");
                                ojbSB.Append("<span style='color: #FFFAE3;'>Vijay Gupta India</span>");
                                ojbSB.Append("Total Payment Amount : $" + Convert.ToDecimal(PayrollData[z].TotalPaymentAmount).ToString("#,##0.00") + "");
                                ojbSB.Append("</th>");
                                ojbSB.Append("</tr>");
                                OldHeader = NewHeader;
                            }

                            ojbSB.Append("<tr>");

                            string GridData = PayrollData[z].COAString;
                            string[] arr2 = GridData.Split('|');

                            for (int g = 0; g < arr2.Length - 1; g++)
                            {
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + arr2[g] + "</th>");
                            }

                            string GridData1 = PayrollData[z].TransactionString;
                            string[] arr3 = GridData1.Split(',');

                            for (int y = 0; y < arr3.Length - 1; y += 2)
                            {
                                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + arr3[y + 1] + "</th>");
                            }

                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(PayrollData[z].PaymentAmount).ToString("#,##0.00") + "</th>");
                            ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PayrollData[z].PayDescription.Replace("&", "&#38;") + "</th>");

                            ojbSB.Append("</tr>");
                        }

                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</body>");
                        ojbSB.Append("</html>");
                    }
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }
        }

        [Route("RunPayrollEditReportPDF")]
        [HttpGet, HttpPost]
        public string RunPayrollEditReportPDF(int ProdId, int PayrollFileID, string ProName)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Payroll/Reports/PayrollPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {
                }

                PDFCreation BusinessContext1 = new PDFCreation();

                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/Payroll/Reports/PayrollPDF/"), "");

                string FinalPDFName1 = "Merge" + DateTime.Now;

                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                if (File.Exists(resumeFile))
                {
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Payroll/Reports/PayrollPDF/"), "");
                List<string> termsList = new List<string>();

                var PDFHeaderData = BusinessContext.GetPayrollReportHeader(PayrollFileID);

                var PDFTrData = BusinessContextPayroll.GetTransCodeForPayrollAudit(PayrollFileID);

                // ---- Transaction Code ------------------------
                string TransStr = PDFTrData[0].TransactionString;
                string TrasnValue = "";
                if (TransStr != "")
                {
                    string NewStr = TransStr.Remove(TransStr.Length - 1);
                    string[] straa = TransStr.Split(',');

                    for (int j = 0; j < straa.Length; j += 2)
                    {
                        TrasnValue += straa[j] + ',';
                    }
                }

                int RowLength = 2;
                string TransactionCodeTR = "";

                var TransactionCodes = BusinessContextPayroll.GetTransCodeFromExpense(TrasnValue);

                RowLength = RowLength + TransactionCodes.Count;

                for (int k = 0; k < TransactionCodes.Count; k++)
                {
                    TransactionCodeTR = TransactionCodeTR + "<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>" + TransactionCodes[k].TransCode + "</th>";
                }

                //---   Segment Code-----------\\

                string SegmentStr = PDFTrData[0].SegmentString;
                string NewSegStr = SegmentStr.Remove(SegmentStr.Length - 1);
                string[] strSeg = SegmentStr.Split(',');
                string SegmentVal = "";
                for (int l = 0; l < strSeg.Length; l += 2)
                {
                    SegmentVal += strSeg[l] + ',';
                }

                var SegmentCodes = BusinessContextPayroll.GetSegmentStringFromExpense(SegmentVal, ProdId);

                string SegmentCodeTR = "";

                RowLength = RowLength + SegmentCodes.Count;

                for (int m = 0; m < SegmentCodes.Count; m++)
                {
                    SegmentCodeTR = SegmentCodeTR + "<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>" + SegmentCodes[m].SegmentCode + "</th>";
                }

                //------------ Payroll Data//////

                StringBuilder ojbSB = new StringBuilder();
                ojbSB.Append("<html>");
                ojbSB.Append("<head><title></title></head>");
                ojbSB.Append("<body>");
                ojbSB.Append("<table style='width: 10.5in; float: left;'>");
                ojbSB.Append("<thead>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; '>Invoice No. : " + PDFHeaderData[0].InvoiceNumber + "</td>");
                ojbSB.Append("<th style='padding: 2px; font-size: 16px; width: 60%; text-align: center;'>" + PDFHeaderData[0].CompanyName + "</th>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; '>Run Date Time : " + PDFHeaderData[0].RunDateTime + "</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white;'> </td>");
                ojbSB.Append("<th style='padding: 2px; font-size: 16px; width: 60%; text-align: center;'>" + ProName + "</th>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white; '> </td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white;'> </td>");
                ojbSB.Append("<th style='padding: 2px; font-size: 16px; width: 60%; text-align: center;'>LABOR / FRINGE REPORT</th>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white; '> </td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white;'> </td>");
                ojbSB.Append("<th style='padding: 2px; font-size: 16px; width: 60%; text-align: center;'>Period End :" + PDFHeaderData[0].EndDate + "</th>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white; '> </td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white;'> </td>");
                ojbSB.Append("<th style='padding: 2px; font-size: 16px; width: 60%; text-align: center;'>INVOICE PREVIOUSLY POSTED</th>");
                ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white; '> </td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</thead>");
                ojbSB.Append("</table>");
                ojbSB.Append("<table style='width: 10.5in; float: left;'>");
                ojbSB.Append("<thead>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'> </td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'> </td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'> </td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'> </td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'></td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'> </td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'> </td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'> </td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 12px; padding-bottom: 10px; color: white;'></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Currency</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Vendor</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Payroll Interface</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Payroll Source Code</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold; color: white;'></td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>AP Source Code</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Sort by</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'>Fringe in</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold;'></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>US</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>" + PDFHeaderData[0].VendorName + "</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>FLV</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>PR</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 11px; padding-bottom: 4px; font-weight: bold; color: white;'></td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>AP</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>Union</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>Detail</td>");
                ojbSB.Append("<td style='padding: 0px 0; font-size: 10px; padding-bottom: 10px; font-weight: bold;'>** List **</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</thead>");
                ojbSB.Append("</table>");
                ojbSB.Append("<table style='width: 10.5in; border-collapse: collapse; border-top: 1px solid #ccc;repeat-header: yes;'>");
                ojbSB.Append("<thead>");

                ojbSB.Append("<tr style='border: 1px solid #000; background-color: #A4DEF9;'>");

                ojbSB.Append(SegmentCodeTR);
                ojbSB.Append(TransactionCodeTR);
                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Payment Amount</th>");
                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Pay Description</th>");

                ojbSB.Append("</tr>");
                ojbSB.Append("</thead>");
                ojbSB.Append("<tbody>");

                var PayrollData = BusinessContextPayroll.GetPayrollDataFileForAudit(PayrollFileID);

                string OldHeader = "";
                string NewHeader = "";

                for (int z = 0; z < PayrollData.Count; z++)
                {
                    NewHeader = PayrollData[z].Header;
                    if (OldHeader == NewHeader)
                    {
                    }
                    else
                    {
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc; background-color: #FFFAE3;' colspan='" + RowLength + "'>");
                        ojbSB.Append("Name : " + PayrollData[z].LastName + " " + PayrollData[z].FirstName + " ");
                        ojbSB.Append("<span style='color: #FFFAE3;'> </span>");
                        ojbSB.Append("SSN: " + PayrollData[z].SSN + "");
                        ojbSB.Append("<span style='color: #FFFAE3;'> </span>");
                        ojbSB.Append("Check No. " + PayrollData[z].CheckNumber + "");
                        ojbSB.Append("<span style='color: #FFFAE3;'> </span>");
                        ojbSB.Append("Total Payment Amount : $" + Convert.ToDecimal(PayrollData[z].TotalPaymentAmount).ToString("#,##0.00") + "");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        OldHeader = NewHeader;
                    }

                    ojbSB.Append("<tr>");

                    string GridData = PayrollData[z].COAString;
                    string[] arr2 = GridData.Split('|');

                    for (int g = 0; g < arr2.Length - 1; g++)
                    {
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + arr2[g] + "</th>");
                    }

                    string GridData1 = PayrollData[z].TransactionString;
                    string[] arr3 = GridData1.Split(',');

                    for (int y = 0; y < arr3.Length - 1; y += 2)
                    {
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + arr3[y + 1] + "</th>");
                    }

                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>$" + Convert.ToDecimal(PayrollData[z].PaymentAmount).ToString("#,##0.00") + "</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + PayrollData[z].PayDescription.Replace("&", "&#38;") + "</th>");
                    ojbSB.Append("</tr>");
                }

                ojbSB.Append("</tbody>");
                ojbSB.Append("</table>");
                ojbSB.Append("</body>");
                ojbSB.Append("</html>");

                string NewPDF = ojbSB.ToString();
                //string TimeStampp = DateTime.Now.ToShortTimeString();
                //BusinessContext1.GeneratePDFReportLandScape("Payroll/Reports/PayrollPDF", "PayrollEdit" + PayrollFileID + TimeStampp.Replace(":", "_").Replace(" ", "_") + "", "PayrollPDF", NewPDF.Replace("&", "&#38;"));
                //string FinalPDFName = "PayrollEdit" + PayrollFileID + TimeStampp.Replace(":", "_").Replace(" ", "_");
                string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                return jsonReturn.ToString();

                //return FinalPDFName;
            }
            else
            {
                return "";
            }
        }

        [Route("CostReportv1")]
        [HttpGet, HttpPost]
        public string CostReportv1(JSONParameters callParameters)
        {
            string FilterJSON = callParameters.callPayload;
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));

            var JOriginCR = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CR"])));

            int ProdID = Convert.ToInt32(JOriginCR["ProdID"]);
            string ProName = Convert.ToString(JOriginCR["ProName"]);
            string Filter = Convert.ToString(JOriginCR["Filter"]);
            int UserID = Convert.ToInt32(JOriginCR["UserID"]);

            string[] tokens = Filter.Split('|');
            string CID = tokens[0];
            string LO = tokens[1];
            string Budget = tokens[2];
            int BID = 0;
            int BudgetFileID = 0;
            int Mode = 0;

            if ((LO == "0") && (Budget == "0"))
            {
                Mode = 1;
            }
            else if ((LO == "0") && (Budget != "0"))
            {
                string[] tokens1 = Budget.Split(',');
                BID = Convert.ToInt32(tokens1[0]);
                BudgetFileID = Convert.ToInt32(tokens1[1]);
                Mode = 3;
            }
            else if ((LO != "0") && (Budget == "0"))
            {
                Mode = 2;
            }
            else
            {
                string[] tokens1 = Budget.Split(',');
                BID = Convert.ToInt32(tokens1[0]);
                BudgetFileID = Convert.ToInt32(tokens1[1]);
                Mode = 3;
            }

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Reports/CostPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {
                }

                PDFCreation BusinessContext1 = new PDFCreation();

                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/CostPDF/"), "");

                string FinalPDFName1 = "Merge" + Guid.NewGuid().ToString() + DateTime.Now.ToShortDateString();

                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                if (File.Exists(resumeFile))
                {
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/CostPDF/"), "");
                List<string> termsList = new List<string>();
                StringBuilder ojbSB = new StringBuilder();

                var CRWData = BusinessContext.GetCRWListForReport(ProdID, Mode, CID, LO, BID, BudgetFileID);
                if (CRWData.Count > 0)
                {
                    for (int i = 0; i < CRWData.Count; i++)
                    {
                        var PDFData = BusinessContextCRW.GetCRWRollUpReport(CRWData[i].BudgetFileID, CRWData[i].Budgetid, ProdID, FilterJSON);
                        #region reportheader
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table style='width: 10.5in; float: left;repeat-header: yes;border-spacing: 0;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th colspan='10'>");

                        ojbSB.Append("<table style='width: 10.5in; float: left;'>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;text-align: left;'>Budget Name : " + CRWData[i].BudgetName + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + CRWData[i].CompanyName + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: right;'>Include PO's: : Y</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;text-align: left;'>Company Code(s) : " + CRWData[i].S1 + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + ProName + "</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; '>Show Epi/Loc/Prod :Y</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;text-align: left;'></th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 80%; float: left; text-align: center; color: white;'>&nbsp;</th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; '>Show Set Codes :N</th>");
                        ojbSB.Append("</tr>");
                        //ojbSB.Append("<tr>");
                        //ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>" + (CRWData[i].S3 == ""?"":"Episode(s) :" + CRWData[i].S3) + "</th>");
                        //ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; color: white;'>a</th>");
                        //ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; color: white; float: left;'>dd</th>");
                        //ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: left;'></th>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; margin-left:20%; float: left; text-align: center;'>Cost Report - Detail</th>");
                        string CurrentDate = BusinessContext.UserSpecificTime(ProdID);
                        ojbSB.Append("<th style='padding: 0px 0; font-size: 12px; float: left; padding-bottom: 10px; text-align: right;    padding-left: 50px;'>Printed on : " + CurrentDate + "</th>");
                        ojbSB.Append("</tr>");
                        //ojbSB.Append("<tr>");
                        //ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; color: white;'>d</th>");
                        //ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'></th>");
                        //ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; color: white; float: left;'></th>");
                        //ojbSB.Append("</tr>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</th>");
                        ojbSB.Append("</tr>");
                        //ojbSB.Append("<tr>");
                        //ojbSB.Append("<th colspan='10'>");
                        //ojbSB.Append("<table style='width: 100%; float: left;'>");
                        //ojbSB.Append("<tr>");
                        //ojbSB.Append("</tr>");
                        //ojbSB.Append("</table>");

                        //ojbSB.Append("</th>");
                        //ojbSB.Append("</tr>");

                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Account</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Description</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Period Activity</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Actuals</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>PO's </th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Total Cost</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>ETC</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>EFC</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Total Budget</th>");
                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Variance</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        #endregion reportheader
                        ojbSB.Append("<tbody>");

                        decimal FinalBB;
                        decimal ETCC = 0;
                        decimal EFCC = 0;

                        string CRWGrp1 = "";
                        string CRWGrp2 = "";

                        string strCurrentAccountType = "";
                        string strPreviousAccountType = "";
                        string strPreviousAccountTypeCode = "";
                        string strHeaderAccountCode = "";
                        string strHeaderAccountDescription = "";
                        Boolean LastWasHeader = true;

                        Int32 iPreviousParent = 0;
                        Int32 iCurrentParent = 0;

                        decimal HeaderPeriodActivity = 0;
                        decimal HeaderActuals = 0;
                        decimal HeaderPO = 0;
                        decimal HeaderTotalCost = 0;
                        decimal HeaderETC = 0;
                        decimal HeaderEFC = 0;
                        decimal HeaderTotalBudget = 0;
                        decimal HeaderVariance = 0;

                        decimal AccountTypePeriodActivity = 0;
                        decimal AccountTypeActuals = 0;
                        decimal AccountTypePO = 0;
                        decimal AccountTypeTotalCost = 0;
                        decimal AccountTypeETC = 0;
                        decimal AccountTypeEFC = 0;
                        decimal AccountTypeTotalBudget = 0;
                        decimal AccountTypeVariance = 0;

                        decimal GrandTotalPeriodActivity = 0;
                        decimal GrandTotalActuals = 0;
                        decimal GrandTotalPO = 0;
                        decimal GrandTotalTotalCost = 0;
                        decimal GrandTotalETC = 0;
                        decimal GrandTotalEFC = 0;
                        decimal GrandTotalTotalBudget = 0;
                        decimal GrandTotalVariance = 0;

                        int HeaderSumID = 0;
                        for (int j = 0; j < PDFData.Count; j++)
                        {
                            if (PDFData[j].AccountName == "(Blank)") // Don't include "Blanks", which are used for the CRW
                            { }
                            else
                            {
                                strCurrentAccountType = PDFData[j].AccountTypeName;
                                iCurrentParent = Convert.ToInt32(PDFData[j].PARENT);
                                #region HeaderSummary
                                if (iCurrentParent != iPreviousParent && iPreviousParent != 0 && LastWasHeader == false) // Print the header total when the parent changes
                                {
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; padding-left: 30px; font-weight: bold;'>" + strHeaderAccountCode + " - " + strHeaderAccountDescription + "</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>Total</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderPeriodActivity).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderActuals).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderPO).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderTotalCost).ToString("#,##0") + "</th>");

                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderETC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderEFC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderTotalBudget).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(HeaderVariance).ToString("#,##0") + "</th>");
                                    ojbSB.Append("</tr>");

                                    // Reset Header values
                                    HeaderPeriodActivity = 0;
                                    HeaderActuals = 0;
                                    HeaderPO = 0;
                                    HeaderTotalCost = 0;
                                    HeaderETC = 0;
                                    HeaderEFC = 0;
                                    HeaderTotalBudget = 0;
                                    HeaderVariance = 0;

                                }
                                #endregion HeaderSummary
                                #region AccountTypeSummary
                                if (strPreviousAccountType != strCurrentAccountType && strPreviousAccountType != "") // Print the Account Type total when the account type changes
                                {
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; padding-left: 30px; font-weight: bold;'>" + strPreviousAccountTypeCode + " - " + strPreviousAccountType + "</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>Total</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypePeriodActivity).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypeActuals).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypePO).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypeTotalCost).ToString("#,##0") + "</th>");

                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypeETC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypeEFC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypeTotalBudget).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='background-color: #A4DEF9;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(AccountTypeVariance).ToString("#,##0") + "</th>");
                                    ojbSB.Append("</tr>");
                                }

                                if (strPreviousAccountType == "" || (strPreviousAccountType != strCurrentAccountType))
                                {
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #A4DEF9;' colspan='10'>" + PDFData[j].Code + " - " + PDFData[j].AccountTypeName + "</th>");
                                    ojbSB.Append("</tr>");

                                    // Reset Account Type values
                                    AccountTypePeriodActivity = 0;
                                    AccountTypeActuals = 0;
                                    AccountTypePO = 0;
                                    AccountTypeTotalCost = 0;
                                    AccountTypeETC = 0;
                                    AccountTypeEFC = 0;
                                    AccountTypeTotalBudget = 0;
                                    AccountTypeVariance = 0;
                                }
                                #endregion AccountTypeSummary
                                #region Calculations
                                EFCC = Convert.ToDecimal(PDFData[j].EFC);
                                ETCC = EFCC - Convert.ToDecimal(PDFData[j].ActualtoDate1) - Convert.ToDecimal(PDFData[j].POAmount1);
                                if (Convert.ToInt32(PDFData[j].ChildCount) == 0)
                                {
                                    FinalBB = Convert.ToDecimal(PDFData[j].Budget);
                                }
                                else
                                {
                                    if (Convert.ToDecimal(PDFData[j].Budget1) > 0 || Convert.ToInt32(PDFData[j].ChildCount) > 0)
                                    {
                                        FinalBB = Convert.ToDecimal(PDFData[j].Budget1);
                                    }
                                    else
                                    {
                                        FinalBB = Convert.ToDecimal((Convert.ToDecimal(PDFData[j].Budget) <= 0 ? 0 : PDFData[j].Budget));
                                    }
                                }

                                Double TotalCost = Convert.ToDouble(PDFData[j].ActualtoDate) + Convert.ToDouble(PDFData[j].POAmount);
                                Double strVariance = Convert.ToDouble(FinalBB) - Convert.ToDouble(PDFData[j].EFC);
                                if (PDFData[j].detaillevel == 1) // This is a header account
                                {
                                    strHeaderAccountCode = PDFData[j].AccountCode;
                                    strHeaderAccountDescription = PDFData[j].AccountName;
                                    LastWasHeader = true;
                                    // Use the Budget information from the header values in the sp return
                                    //HeaderETC = Convert.ToDecimal(ETCC);
                                    //HeaderEFC = Convert.ToDecimal(EFCC);
                                    //HeaderTotalBudget = Convert.ToDecimal(FinalBB);
                                    //HeaderVariance = Convert.ToDecimal(strVariance);
                                }
                                else
                                {
                                    LastWasHeader = false; // Add the values to the Activity for the Header
                                    HeaderETC += Convert.ToDecimal(ETCC);
                                    HeaderEFC += Convert.ToDecimal(EFCC);
                                    HeaderTotalBudget += Convert.ToDecimal(FinalBB);
                                    HeaderVariance += Convert.ToDecimal(strVariance);
                                    HeaderPeriodActivity += Convert.ToDecimal(PDFData[j].ActualthisPeriod);
                                    HeaderActuals += Convert.ToDecimal(PDFData[j].ActualtoDate);
                                    HeaderPO += Convert.ToDecimal(PDFData[j].POAmount);
                                    HeaderTotalCost += Convert.ToDecimal(TotalCost);

                                    AccountTypePeriodActivity += Convert.ToDecimal(PDFData[j].ActualthisPeriod);
                                    AccountTypeActuals += Convert.ToDecimal(PDFData[j].ActualtoDate);
                                    AccountTypePO += Convert.ToDecimal(PDFData[j].POAmount);
                                    AccountTypeTotalCost += Convert.ToDecimal(TotalCost);
                                    AccountTypeETC += Convert.ToDecimal(ETCC);
                                    AccountTypeEFC += Convert.ToDecimal(EFCC);
                                    AccountTypeTotalBudget += Convert.ToDecimal(FinalBB);
                                    AccountTypeVariance += Convert.ToDecimal(strVariance);

                                    GrandTotalPeriodActivity += Convert.ToDecimal(PDFData[j].ActualthisPeriod);
                                    GrandTotalActuals += Convert.ToDecimal(PDFData[j].ActualtoDate);
                                    GrandTotalPO += Convert.ToDecimal(PDFData[j].POAmount);
                                    GrandTotalTotalCost += Convert.ToDecimal(TotalCost);
                                    GrandTotalETC += Convert.ToDecimal(ETCC);
                                    GrandTotalEFC += Convert.ToDecimal(EFCC);
                                    GrandTotalTotalBudget += Convert.ToDecimal(FinalBB);
                                    GrandTotalVariance += Convert.ToDecimal(strVariance);
                                }
                                #endregion Calculations

                                if (j == (PDFData.Count - 1)/*PDFData[j].AccountTypeName == "ABCVijay"*/) // We have reached the end of the report data
                                {
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; padding-left: 30px; font-weight: bold;'></th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>Grand Total</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalPeriodActivity).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalActuals).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalPO).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalTotalCost).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalETC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalEFC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalTotalBudget).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalVariance).ToString("#,##0") + "</th>");
                                    ojbSB.Append("</tr>");
                                }
                                else if (PDFData[j].Posting == true)
                                { // If the account allows posting, then display the full details for that account
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFFFF;' colspan='2'>" + PDFData[j].AccountCode + " - " + PDFData[j].AccountName + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(PDFData[j].ActualthisPeriod).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(PDFData[j].ActualtoDate).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(PDFData[j].POAmount).ToString("#,##0") + "</th>");

                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(TotalCost).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(ETCC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(EFCC).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(FinalBB).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 2px solid black; background-color: #FFFFFF;'>" + Convert.ToInt32(strVariance).ToString("#,##0") + "</th>");
                                    ojbSB.Append("</tr>");
                                }
                                else
                                { // Otherwise, just print the account code and name (usually for a Header account)
                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 5px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan='10'>" + PDFData[j].AccountCode + " - " + PDFData[j].AccountName + "</th>");
                                    ojbSB.Append("</tr>");
                                }

                                strPreviousAccountTypeCode = PDFData[j].Code;
                                strPreviousAccountType = PDFData[j].AccountTypeName;
                                iPreviousParent = Convert.ToInt32(PDFData[j].PARENT);
                            }
                        }

                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</body>");
                        ojbSB.Append("</html>");

                        //string NewPDF = ojbSB.ToString();

                        //string TimeStampp = DateTime.Now.ToShortTimeString();
                        //BusinessContext1.GeneratePDFReportLandScape("Reports/CostPDF", "CostPDF" + CRWData[i].BudgetFileID + TimeStampp.Replace(":", "_").Replace(" ", "_") + "", "CostPDF", NewPDF.Replace("&", "&#38;"));
                        //termsList.Add(fileSavePath + "\\CostPDF" + CRWData[i].BudgetFileID + TimeStampp.Replace(":", "_").Replace(" ", "_") + ".PDF");
                    }

                    //string[] terms = termsList.ToArray();
                    //string FinalPDFName = "CostReport_" + DateTime.Now.ToShortTimeString().Replace(":", "_").Replace(" ", "_");
                    //MergePDFsLandScape(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);
                    //return FinalPDFName;
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                else
                {
                    return "";
                }
            }

            else
            {
                return "";
            }
        }

        [Route("CostReport")]
        [HttpGet, HttpPost]
        public string CostReport(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                //string FilterJSON = callParameters.callPayload;
                var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));

                //var JOriginCR = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CR"])));

                string ReportTitle = "Cost Report - Detail";
                int ProdID = Convert.ToInt32(JOrigin["ProdID"]);
                string ProName = Convert.ToString(JOrigin["ProName"]);
                int UserID = Convert.ToInt32(JOrigin["UserID"]);
                int BudgetID = Convert.ToInt32(JOrigin["BudgetID"]);
                int BudgetFileID = Convert.ToInt32(JOrigin["BudgetFileID"]);

                if (JOrigin["ReportSelection"].ToString() == "ChangeNotes")
                {
                    ReportTitle = "EFC Change Details";
                    JOrigin.isSummary = "0";
                    JOrigin.ShowChangeinVariance = "1";
                    JOrigin.ShowChangeNotes = "1";
                }
                bool isSummary = Convert.ToBoolean(Convert.ToByte(JOrigin["isSummary"]));
                bool isShowChangeinVariance = Convert.ToBoolean(Convert.ToByte(JOrigin.ShowChangeinVariance));
                bool isShowChangeNotes = Convert.ToBoolean(Convert.ToByte(JOrigin.ShowChangeNotes));

                var CRWData = BusinessContext.GetCRWListForReport(ProdID, 3, "", "", BudgetID, BudgetFileID);
                int i = 0;
                StringBuilder ojbSB = new StringBuilder();
                CRWBussiness BusinessContextCRWv2 = new CRWBussiness();
                var varResultaa = BusinessContextCRWv2.GetCRWv2GetCRWData(Convert.ToString((JOrigin)));
                var combindedString = string.Join("", varResultaa.ToArray());
                dynamic dynJson = JsonConvert.DeserializeObject(combindedString);
                int colspan = 10;
                if (isShowChangeinVariance) colspan += 2; // Add two columns for Prior Variance and Change in Variance
                const string C_CSS_ReportTableHeader = "padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;";
                const string C_CSS_ReportTableGrouping = "background-color: #FFFAE3;padding: 5px 5px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;";
                const string C_CSS_ReportTableTD = "background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;";
                #region reportheader
                ojbSB.Append("<html>");
                ojbSB.Append("<head><title></title></head>");
                ojbSB.Append("<body>");
                ojbSB.Append("<table style='width: 10.5in; float: left;repeat-header: yes;border-spacing: 0;'>");
                ojbSB.Append("<thead>");
                ojbSB.Append("<tr>");
                ojbSB.Append($"<th colspan=\"{colspan}\">");

                ojbSB.Append("<table style='width: 10.5in; float: left;'>");
                ojbSB.Append("<tr>");
                ojbSB.Append($"<th style='padding: 0px; font-size: 12px; width: 20%; float: left;text-align: left;'>Budget Name : {CRWData[i].BudgetName}</th>");
                ojbSB.Append($"<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>{CRWData[i].CompanyName}</th>");
                ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: right;'>&nbsp;</th>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append($"<th style='padding: 0px; font-size: 12px; width: 20%; float: left;text-align: left;'>Company Code(s) : {CRWData[i].S1}</th>");
                ojbSB.Append($"<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>{ProName}</th>");
                ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; '>&nbsp;</th>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: left;'></th>");
                ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 80%; float: left; text-align: center; color: white;'>&nbsp;</th>");
                ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; text-align: left;'></th>");
                ojbSB.Append($"<th style='padding: 0px; font-size: 16px; width: 60%; margin-left:20%; float: left; text-align: center;'>{ReportTitle}</th>");
                string CurrentDate = BusinessContext.UserSpecificTime(ProdID);
                ojbSB.Append($"<th style='padding: 0px 0; font-size: 12px; float: left; padding-bottom: 10px; text-align: right;    padding-left: 50px;'>Printed on : {CurrentDate}</th>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</table>");
                ojbSB.Append("</th>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Account</th>");
                ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Description</th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">Period Activity</th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">Actuals</th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">PO's </th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">Total Cost</th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">ETC</th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">EFC</th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">Total Budget</th>");
                ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">Variance</th>");
                if (isShowChangeinVariance)
                {
                    ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">Prior Variance</th>");
                    ojbSB.Append($"<th style=\"{C_CSS_ReportTableHeader}\">Change</th>");
                }
                ojbSB.Append("</tr>");
                ojbSB.Append("</thead>");
                #endregion reportheader
                ojbSB.Append("<tbody>");
                int ii = 0;
                string PreviousParentACC = "";
                string PreviousParentAD = "";
                string CurrentParentACC = "";

                decimal GroupTotalPeriodActivity = 0;
                decimal GroupTotalActuals = 0;
                decimal GroupTotalPO = 0;
                decimal GroupTotalTotalCost = 0;
                decimal GroupTotalETC = 0;
                decimal GroupTotalEFC = 0;
                decimal GroupTotalTotalBudget = 0;
                decimal GroupTotalVariance = 0;
                decimal GroupTotalChangeinVariance = 0;
                decimal GroupTotalPriorVariance = 0;

                decimal GrandTotalPeriodActivity = 0;
                decimal GrandTotalActuals = 0;
                decimal GrandTotalPO = 0;
                decimal GrandTotalTotalCost = 0;
                decimal GrandTotalETC = 0;
                decimal GrandTotalEFC = 0;
                decimal GrandTotalTotalBudget = 0;
                decimal GrandTotalVariance = 0;
                decimal GrandTotalPriorVariance = 0;
                decimal GrandTotalChangeinVariance = 0;

                foreach (var item in dynJson)
                {
                    ii++;
                    if (isSummary)
                    {
                        #region Details
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; padding-left: 30px; font-weight: bold;'>" + item.PA + "</th>");
                        ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>" + item.PN + "</th>");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.AP.ToString("#,##0")}</th>");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.AT.ToString("#,##0")}</ th > ");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.APO.ToString("#,##0")}</ th > ");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.TC.ToString("#,##0")}</ th > ");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.ETC.ToString("#,##0")}</th>");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.EFC.ToString("#,##0")}</th>");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.B.ToString("#,##0")}</th>");
                        ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.V.ToString("#,##0")}</th>");
                        if (isShowChangeinVariance)
                        {
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.PV.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.VV.ToString("#,##0")}</th>");
                        }
                        ojbSB.Append("</tr>");
                        #endregion Details
                    }
                    else
                    {
                        CurrentParentACC = item.PA.ToString();
                        if (PreviousParentACC != CurrentParentACC && PreviousParentACC != "")
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td colspan=2 style='background-color: #FFFAE3;padding: 5px 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + PreviousParentACC + " - " + PreviousParentAD + "</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalPeriodActivity.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalActuals.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalPO.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalTotalCost.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalETC.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalEFC.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalTotalBudget.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalVariance.ToString("#,##0")}</td>");
                            if (isShowChangeinVariance)
                            {
                                ojbSB.Append($"<th style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalPriorVariance.ToString("#,##0")}</th>");
                                ojbSB.Append($"<th style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalChangeinVariance.ToString("#,##0")}</th>");
                            }
                            ojbSB.Append("</tr>");

                            if (ii != dynJson.Count)
                            {
                                PreviousParentACC = "";
                                GroupTotalPeriodActivity = 0;
                                GroupTotalActuals = 0;
                                GroupTotalPO = 0;
                                GroupTotalTotalCost = 0;
                                GroupTotalETC = 0;
                                GroupTotalEFC = 0;
                                GroupTotalTotalBudget = 0;
                                GroupTotalVariance = 0;
                                GroupTotalPriorVariance = 0;
                                GroupTotalChangeinVariance = 0;
                            }
                            else
                            {
                                PreviousParentACC = item.PA.ToString();
                                PreviousParentAD = item.PN.ToString();
                            }
                        }
                        else
                        {
                            PreviousParentACC = item.PA.ToString();
                            PreviousParentAD = item.PN.ToString();
                        }
                        if (PreviousParentACC == "" || ii == 1)
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append($"<th style='padding: 5px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan=\"{colspan}\">" + item.PA + " - " + item.PN + "</th>");
                            ojbSB.Append("</tr>");
                        }

                        #region Details
                        if (item.AA != item.PA) // Don't include the parent account on the report detail
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; padding-left: 30px; font-weight: bold;'>" + item.AA + "</th>");
                            ojbSB.Append("<th style='background-color: #FFFFFF;padding: 5px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>" + item.AN + "</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.AP.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.AT.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.APO.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.TC.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.ETC.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.EFC.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.B.ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.V.ToString("#,##0")}</th>");
                            if (isShowChangeinVariance)
                            {
                                ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.PV.ToString("#,##0")}</th>");
                                ojbSB.Append($"<th style=\"{C_CSS_ReportTableTD}\">{item.VV.ToString("#,##0")}</th>");
                            }
                            ojbSB.Append("</tr>");
                            #endregion Details
                            #region ChangeNotes
                            if (isShowChangeNotes && !isSummary)
                            {
                                if (!String.IsNullOrEmpty((item.Notes??"").ToString())) // Cannot user item.Notes != null because it will return a runtime exception
                                {
                                    StringBuilder SBChangeNotes = new StringBuilder();

                                    Newtonsoft.Json.Linq.JArray ChangeNotes = (Newtonsoft.Json.Linq.JArray)JsonConvert.DeserializeObject<dynamic>(item.Notes.ToString()).Edits;
                                    if (ChangeNotes.Count > 0)
                                    {
                                        ojbSB.Append($"<tr><td colspan=2>&nbsp;</td><td colspan=\"{colspan-2}\"><table width=\"100%\" border=0 style=\"font-size:11px; text-align:left;\">");
                                        ojbSB.Append("<tr><th>Date</th><th>User</th><th style=\"text-align:right\">Old EFC</th><th style=\"text-align:right\">New EFC</th><th style=\"text-align:right\">Change</th><th width=\"200px;\">Notes</th></tr>");
                                        foreach (Newtonsoft.Json.Linq.JValue edit in ChangeNotes)
                                        {
                                            Newtonsoft.Json.Linq.JObject objedit = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(edit.ToString());
                                            string D = (objedit["D"] ?? "").ToString();
                                            string UE = (objedit["UE"] ?? "").ToString();
                                            decimal OEFC = Convert.ToDecimal(objedit["EC"] ?? "0");//
                                            decimal NEFC = Convert.ToDecimal(objedit["EU"] ?? "0");//.ToString("#,##0")
                                            decimal EFCC = NEFC - OEFC;
                                            SBChangeNotes.Insert(0, $"<tr><td>{D}</td><td>{UE}</td><td style=\"text-align:right;\">{OEFC.ToString("#,##0")}</td><td style=\"text-align:right;\">{NEFC.ToString("#,##0")}</td><td style=\"text-align:right;\">{EFCC.ToString("#,##0")}</td><td>{objedit["N"]??"".ToString()}</td>");
                                        }
                                        ojbSB.Append(SBChangeNotes.ToString());
                                        ojbSB.Append("</table></td></tr>");
                                    }
                                }
                            }
                            #endregion

                            GroupTotalPeriodActivity += Convert.ToDecimal(item.AP);
                            GroupTotalActuals += Convert.ToDecimal(item.AT);
                            GroupTotalPO += Convert.ToDecimal(item.APO);
                            GroupTotalTotalCost += Convert.ToDecimal(item.TC);
                            GroupTotalETC += Convert.ToDecimal(item.ETC);
                            GroupTotalEFC += Convert.ToDecimal(item.EFC);
                            GroupTotalTotalBudget += Convert.ToDecimal(item.B);
                            GroupTotalVariance += Convert.ToDecimal(item.V);
                            GroupTotalPriorVariance += Convert.ToDecimal(item.PV);
                            GroupTotalChangeinVariance += Convert.ToDecimal(item.VV);
                        }
                    }

                    GrandTotalPeriodActivity += Convert.ToDecimal(item.AP);
                    GrandTotalActuals += Convert.ToDecimal(item.AT);
                    GrandTotalPO += Convert.ToDecimal(item.APO);
                    GrandTotalTotalCost += Convert.ToDecimal(item.TC);
                    GrandTotalETC += Convert.ToDecimal(item.ETC);
                    GrandTotalEFC += Convert.ToDecimal(item.EFC);
                    GrandTotalTotalBudget += Convert.ToDecimal(item.B);
                    GrandTotalVariance += Convert.ToDecimal(item.V);
                    GrandTotalPriorVariance += Convert.ToDecimal(item.PV);
                    GrandTotalChangeinVariance += Convert.ToDecimal(item.VV);

                    if (ii == dynJson.Count)
                    {
                        // Close the group first and then include the grand totals
                        if (!isSummary)
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<td colspan=2 style='background-color: #FFFAE3;padding: 5px 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>" + PreviousParentACC + " - " + PreviousParentAD + "</td>");
                            //ojbSB.Append("<th style='background-color: #FFFAE3;padding: 5px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>" + PreviousParentAD + "</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalPeriodActivity.ToString("#,##0")}</ td > ");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalActuals.ToString("#,##0")}</ td > ");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalPO.ToString("#,##0")}</ td > ");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalTotalCost.ToString("#,##0")}</ td > ");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalETC.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalEFC.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalTotalBudget.ToString("#,##0")}</td>");
                            ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalVariance.ToString("#,##0")}</td>");
                            if (isShowChangeinVariance)
                            {
                                ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalChangeinVariance.ToString("#,##0")}</td>");
                                ojbSB.Append($"<td style=\"{C_CSS_ReportTableGrouping}\">{GroupTotalChangeinVariance.ToString("#,##0")}</td>");
                            }
                            ojbSB.Append("</tr>");
                        }

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; padding-left: 30px; font-weight: bold;'></th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>Grand Total</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalPeriodActivity).ToString("#,##0") + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalActuals).ToString("#,##0") + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalPO).ToString("#,##0") + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalTotalCost).ToString("#,##0") + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalETC).ToString("#,##0") + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalEFC).ToString("#,##0") + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalTotalBudget).ToString("#,##0") + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>" + Convert.ToDouble(GrandTotalVariance).ToString("#,##0") + "</th>");
                        if (isShowChangeinVariance)
                        {
                            ojbSB.Append($"<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>{Convert.ToDouble(GrandTotalPriorVariance).ToString("#,##0")}</th>");
                            ojbSB.Append($"<th style='padding: 5px 5px; font-size: 13px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 2px solid black; border-bottom: 1px solid #ccc;'>{Convert.ToDouble(GrandTotalChangeinVariance).ToString("#,##0")}</th>");
                        }
                        ojbSB.Append("</tr>");
                    }

                }
                ojbSB.Append("</tbody>");
                ojbSB.Append("</table>");
                ojbSB.Append("</body>");
                ojbSB.Append("</html>");
                string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                return jsonReturn.ToString();

            }
            /* obsolete
                }
                else
                {
                    return "";
                }
            }
                */
            else
            {
                return "";
            }

        }


        [Route("CheckRegisterReport")]
        [HttpGet, HttpPost]
        public string CheckRegisterReport(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCR = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CR"])));

            int ProdID = Convert.ToInt32(JOriginCR["ProdID"]);
            string ProName = Convert.ToString(JOriginCR["ProName"]);
            string Filter = Convert.ToString(JOriginCR["Filter"]);
            int UserID = Convert.ToInt32(JOriginCR["UserID"]);

            string[] tokens = Filter.Split('|');
            string CompanyID = tokens[0];
            string BankID = tokens[1];
            string VendorID = tokens[2];
            string CheckNoo = "ALL";

            string CheckFrom;
            string CheckTo;
            if (tokens[3] == "")
            {
                CheckFrom = "0";
            }
            else
            {
                CheckFrom = tokens[3];
                CheckNoo = CheckFrom.ToString();
            }
            if (tokens[4] == "")
            {
                CheckTo = "z";
            }
            else
            {
                CheckTo = tokens[4];
                CheckNoo = CheckNoo + " To " + CheckTo.ToString();
            }

            string CheckType = tokens[5];

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                //try
                //{
                //    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Reports/CheckRegisterPDF/")));
                //    foreach (string filePath in filePaths)
                //        File.Delete(filePath);
                //}
                //catch
                //{
                //}

                //PDFCreation BusinessContext1 = new PDFCreation();

                //string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/CheckRegisterPDF/"), "");

                //string FinalPDFName1 = "Merge" + DateTime.Now;

                //string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                //if (File.Exists(resumeFile))
                //{
                //    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                //}
                //string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/CheckRegisterPDF/"), "");
                //List<string> termsList = new List<string>();

                string Check = "";
                if (CheckType == "")
                {
                    Check = "ALL";
                }

                int NewCnt;
                int NewCnt1;

                var PDFData = BusinessContext.CheckRegisterFilter(callParameters);
                if (Convert.ToBoolean(JOrigin["isExport"] ?? false))
                {
                    return ReportEngineController.MakeJSONExport(PDFData);
                }

                if (PDFData.Count > 0)
                {
                    int ColCount = 0;
                    var TransCode = BusinessContextPayroll.GetTransCodeForPayroll(ProdID);
                    ColCount = TransCode.Count + 2;

                    NewCnt = 9 + ColCount;
                    NewCnt1 = 11 + ColCount;

                    var HeaderData = BusinessContext.BankRegisterHeader(Convert.ToInt32(PDFData[0].CompanyID), Convert.ToInt32(PDFData[0].BankId));

                    StringBuilder ojbSB = new StringBuilder();
                    ojbSB.Append("<html>");
                    ojbSB.Append("<head><title></title></head>");
                    ojbSB.Append("<body>");
                    ojbSB.Append("<table style='width: 10.5in; float: left;repeat-header: yes;border-collapse: collapse;'>");
                    ojbSB.Append("<thead>");
                    ojbSB.Append("<tr><th colspan='" + NewCnt1 + "'>");

                    ojbSB.Append("<table style='width:100% ; float: left;'>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank Code : " + HeaderData[0].BankId + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + HeaderData[0].CompanyName + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Period : ALL</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank Currency Code : USD</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + ProName + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Effective Date : ALL</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank AP Cash Account :" + HeaderData[0].AccountCode + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Check Type : " + Check + "</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Check Number : " + CheckNoo + "</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; '>&nbsp;</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Cancel Type : ALL</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; color: white;'>Set(S) : </th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>Check Register with Invoice Detail</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%;  float: left;'>&nbsp;</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Outstanding Checks Only : NO</td>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>&nbsp;</th>");
                    string CurrentDate = BusinessContext.UserSpecificTime(ProdID);
                    ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Printed on : " + CurrentDate + "</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");

                    ojbSB.Append("</th></tr>");

                    ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                    ojbSB.Append("<th style='padding: 5px; width: 20px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;' colspan='2'>Payment #</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Payment</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: center; border-top-width: 1px; border-top: 1px solid black; width: 25px;'>GL</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; width: 60px;'>Check Type</th>");

                    for (int k = 0; k < TransCode.Count; k++)
                    {
                        ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>PO's </th>");
                    }

                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>To</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>To</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>Va</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>Va</th>");

                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>Ve</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Vendor_(Payee_Name)</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Invoice</th>");
                    ojbSB.Append("<th style='padding-right: 5px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Payment</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                    ojbSB.Append("<th style='padding-left: 5px; width: 20px; font-size: 11px; text-align: left;' colspan='2'>Payment #</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left;'>Date</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: center; width: 25px;'>PER</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left;'>Trans #</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left;'>Invoice / Document </th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left;'>Loc.</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left;'>Account</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left;'>SET</th>");

                    for (int u = 0; u < TransCode.Count; u++)
                    {
                        ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left;'>" + TransCode[u].TransCode + "</th>");
                    }

                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left;'>1099</th>");
                    ojbSB.Append("<th style='padding-left: 5px; font-size: 11px; text-align: left;'>Line Item Description</th>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right;'>Amount</th>");
                    ojbSB.Append("<th style='padding-right: 5px; font-size: 11px; text-align: right;'>Amount</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("</thead>");
                    ojbSB.Append("<tbody>");

                    string OLDCheckNo = "";
                    string NewCheckNo = "";

                    int CheckTypeCount = 0;
                    decimal CheckTypeAmount = 0;

                    int ManualCheckCount = 0;
                    decimal ManualCheckAmount = 0;

                    int WireCount = 0;
                    decimal WireAmount = 0;

                    int VoidCount = 0;
                    decimal VoidAmount = 0;

                    int CancelCount = 0;
                    decimal CancelAmount = 0;

                    int PreviousID = 0;
                    for (int i = 0; i < PDFData.Count; i++)
                    {
                        NewCheckNo = PDFData[i].CheckNumber;
                        if (i == 0)
                        {
                            OLDCheckNo = NewCheckNo;
                            PreviousID = i;
                            if (PDFData[i].Status == "Cancelled")
                            {
                                CancelCount++;
                                CancelAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                            }
                            else if (PDFData[i].Status == "Voided")
                            {
                                VoidCount++;
                                VoidAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                            }
                            else
                            {
                                if (PDFData[i].PayBy == "Check")
                                {
                                    CheckTypeCount++;
                                    CheckTypeAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                }
                                if (PDFData[i].PayBy == "Manual Check")
                                {
                                    ManualCheckCount++;
                                    ManualCheckAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                }
                                if (PDFData[i].PayBy == "Wire Check")
                                {
                                    WireCount++;
                                    WireAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                }
                            }

                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan='2'>" + PDFData[i].CheckNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>" + PDFData[i].PaymentDate + "</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>" + PDFData[i].PeriodID_Payment + "</th>");

                            if ((PDFData[i].Status == "Cancelled") || (PDFData[i].Status == "Voided"))
                            {
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3; width: 70px;' colspan='2'>" + PDFData[i].Status + "</th>");
                            }
                            else
                            {
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3; width: 70px;' colspan='2'>" + PDFData[i].PayBy + "</th>");
                            }
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan='2'>Bank Rec. Status</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3; text-align: center;' colspan='" + ColCount + "'>Outstanding</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>" + PDFData[i].VendorName + "</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'></th>");
                            ojbSB.Append("<th style='padding: 5px 5px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>$" + Convert.ToDecimal(PDFData[i].HeaderAmount).ToString("#,##0.00") + "</th>");
                            ojbSB.Append("</tr>");
                        }
                        else
                        {
                            if (OLDCheckNo != NewCheckNo)
                            {
                                if (PDFData[i].Status == "Cancelled")
                                {
                                    CancelCount++;
                                    CancelAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                }
                                else if (PDFData[i].Status == "Voided")
                                {
                                    VoidCount++;
                                    VoidAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                }
                                else
                                {
                                    if (PDFData[i].PayBy == "Check")
                                    {
                                        CheckTypeCount++;
                                        CheckTypeAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                    }
                                    if (PDFData[i].PayBy == "Manual Check")
                                    {
                                        ManualCheckCount++;
                                        ManualCheckAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                    }
                                    if (PDFData[i].PayBy == "Wire Check")
                                    {
                                        WireCount++;
                                        WireAmount += Convert.ToDecimal(PDFData[i].PaidAmount);
                                    }
                                }

                                OLDCheckNo = NewCheckNo;

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 13px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;' colspan='" + NewCnt + "'>Invoice Sub-Total for Trans " + PDFData[PreviousID].TransactionNumber + " </th>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>$" + Convert.ToDecimal(PDFData[PreviousID].HeaderAmount).ToString("#,##0.00") + "</th>");
                                ojbSB.Append("<th style='padding: 5px 5px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                                ojbSB.Append("</tr>");
                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='" + NewCnt1 + "'></th>");
                                ojbSB.Append("</tr>");

                                ojbSB.Append("<tr>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan='2'>" + PDFData[i].CheckNumber + "</th>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>" + PDFData[i].PaymentDate + "</th>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>1</th>");

                                if ((PDFData[i].Status == "Cancelled") || (PDFData[i].Status == "Voided"))
                                {
                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3; width: 70px;' colspan='2'>" + PDFData[i].Status + "</th>");
                                }
                                else
                                {
                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3; width: 70px;' colspan='2'>" + PDFData[i].PayBy + "</th>");
                                }

                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan='2'>Bank Rec. Status</th>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3; text-align: center;' colspan='" + ColCount + "'>Outstanding</th>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>" + PDFData[i].VendorName + "</th>");
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'></th>");
                                ojbSB.Append("<th style='padding: 5px 5px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;'>$" + Convert.ToDecimal(PDFData[i].HeaderAmount).ToString("#,##0.00") + "</th>");
                                ojbSB.Append("</tr>");
                                PreviousID = i;
                            }
                        }

                        string PrintAmt = "";
                        if ((float)Convert.ToDouble(PDFData[i].PaidAmount) > 0)
                        {
                            PrintAmt = "$" + Convert.ToDecimal(PDFData[i].Amount).ToString("#,##0.00");
                        }
                        else
                        {
                            PrintAmt = "-$" + Convert.ToDecimal(PDFData[i].Amount).ToString("#,##0.00");
                        }

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; width: 60px;'>Bank Code : </th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].BankId + "</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>USD</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].TransactionNumber + "</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].ReferenceNumber + "</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].SS2 + "</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].AccountCode + "</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].SetCode + "</th>");

                        try
                        {
                            string[] straa = PDFData[i].TransactionvalueString.Split(',');
                            for (int y = 0; y < straa.Length; y++)
                            {
                                string[] straa1 = straa[y].Split(':');
                                {
                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + straa1[1] + "</th>");
                                }
                            }
                            for (int t = 0; t < TransCode.Count - straa.Length; t++)
                            {
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                            }
                        }
                        catch
                        {
                            if (TransCode.Count == 0)
                            { }
                            else
                            {
                                ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='" + TransCode.Count + "'></th>");
                            }
                        }

                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].TaxCode + "</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[i].Description + "</th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PrintAmt + "</th>");
                        ojbSB.Append("<th style='padding: 5px 5px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                        ojbSB.Append("</tr>");
                    }

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 13px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;' colspan='" + NewCnt + "'>Invoice Sub-Total for Trans " + PDFData[PreviousID].TransactionNumber + " </th>");
                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;'>$" + Convert.ToDecimal(PDFData[PreviousID].HeaderAmount).ToString("#,##0.00") + "</th>");
                    ojbSB.Append("<th style='padding: 5px 5px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 13px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; font-weight: bold;' colspan='" + NewCnt1 + "'> </th>");

                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='" + NewCnt1 + "'></th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("</tbody>");
                    ojbSB.Append("</table>");

                    ojbSB.Append("<div style='float:left;width:100%;'>");

                    ojbSB.Append("<table>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width:40%;'>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("<td style='width:50%;text-align:centre;'>");

                    ojbSB.Append("<table style='margin-top:20px;border-collapse: collapse; border-top: 1px solid #ccc; display:inline-block;'>");
                    ojbSB.Append("<thead>");
                    ojbSB.Append("<tr style='border: 1px solid #000; background-color: #A4DEF9 ;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Payment Type</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: center; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Total Count</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black; border-bottom-width: 1px; border-bottom: 1px solid black;'>Total Payments</th>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</thead>");
                    ojbSB.Append("<tbody>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Check</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + CheckTypeCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + CheckTypeAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Manual Check</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + ManualCheckCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + ManualCheckAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Wire Check</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + WireCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + WireAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Cancelled</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + CancelCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + CancelAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>Voided</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>" + VoidCount + "</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$" + VoidAmount.ToString("#,##0.00") + "</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append(" <tr style='border-bottom: 1px solid #ccc;'>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-left: 1px solid black;'>ACH</th>");
                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align:center; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;'>0</th>");
                    ojbSB.Append(" <th style='padding: 5px 10px; font-size: 11px; text-align: right; font-weight: normal; border-bottom-width: 1px; border-bottom: 1px solid #ccc;border-right: 1px solid black;'>$0.00</th>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("</tbody>");
                    ojbSB.Append("</table>");

                    ojbSB.Append("</td>");
                    ojbSB.Append("<td>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("</table>");

                    ojbSB.Append("</div>");

                    ojbSB.Append("</body>");
                    ojbSB.Append("</html>");

                    //string NewPDF = ojbSB.ToString();

                    //string TimeStampp = DateTime.Now.ToShortTimeString();
                    //BusinessContext1.GeneratePDFReportLandScape("Reports/CheckRegisterPDF", "CheckRegisterDetail_" + TimeStampp.Replace(":", "_").Replace(" ", "_") + "", "CheckRegisterPDF", NewPDF.Replace("&", "&#38;"));
                    //string FinalPDFName = "CheckRegisterDetail_" + TimeStampp.Replace(":", "_").Replace(" ", "_");
                    //return FinalPDFName;
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }
        }

        private void MergePDFsLandScape(string outPutFilePath, params string[] filesPath)
        {
            using (FileStream MergeFS = new FileStream(outPutFilePath, FileMode.Create))
            {
                Document document = new Document();
                PdfCopy pdf = new PdfCopy(document, MergeFS);
                PdfReader reader = null;
                try
                {
                    document.Open();
                    foreach (string file in filesPath)
                    {
                        reader = new PdfReader(file);
                        pdf.AddDocument(reader);
                        reader.Close();
                    }
                }
                catch (Exception)
                {
                    if (reader != null)
                    {
                        reader.Close();
                    }
                }
                finally
                {
                    if (document != null)
                    {
                        document.Close();
                    }
                }
            }
        }

        private void MergePDFs(string outPutFilePath, params string[] filesPath)
        {
            List<PdfReader> readerList = new List<PdfReader>();
            foreach (string filePath in filesPath)
            {
                PdfReader pdfReader = new PdfReader(filePath);
                readerList.Add(pdfReader);
            }

            //Define a new output document and its size, type
            Document document = new Document(PageSize.LETTER, 0, 0, 0, 0);
            //Create blank output pdf file and get the stream to write on it.
            PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(outPutFilePath, FileMode.Create));
            document.Open();

            foreach (PdfReader reader in readerList)
            {
                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    PdfImportedPage page = writer.GetImportedPage(reader, i);
                    document.Add(iTextSharp.text.Image.GetInstance(page));
                }
            }

            document.Close();
        }


        public static string ConvertNumbertoWords(int number)
        {
            if (number == 0)
                return "ZERO";
            if (number < 0)
                return "minus " + ConvertNumbertoWords(Math.Abs(number));
            string words = "";
            if ((number / 1000000) > 0)
            {
                words += ConvertNumbertoWords(number / 1000000) + " MILLION ";
                number %= 1000000;
            }
            if ((number / 1000) > 0)
            {
                words += ConvertNumbertoWords(number / 1000) + " THOUSAND ";
                number %= 1000;
            }
            if ((number / 100) > 0)
            {
                words += ConvertNumbertoWords(number / 100) + " HUNDRED ";
                number %= 100;
            }
            if (number > 0)
            {
                if (words != "")
                    words += "AND ";
                var unitsMap = new[] { "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN" };
                var tensMap = new[] { "ZERO", "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY" };

                if (number < 20)
                    words += unitsMap[number];
                else
                {
                    words += tensMap[number / 10];
                    if ((number % 10) > 0)
                        words += " " + unitsMap[number % 10];
                }
            }
            return words;
        }

        [Route("GetCheckRunList")]
        [HttpGet, HttpPost]
        public List<GetCheckRunList_Result> GetCheckRunList(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCheckRunList(ProdID);
            }
            else
            {
                List<GetCheckRunList_Result> n = new List<GetCheckRunList_Result>();
                return n;
            }
        }

        [Route("Variance1")]
        [HttpGet, HttpPost]
        public string Variance1(JSONParameters callParameters) //int ProdId, string Filter, string ProName, int UserID)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCR = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CR"])));

            int ProdID = Convert.ToInt32(JOriginCR["ProdID"]);
            string ProName = Convert.ToString(JOriginCR["ProName"]);
            string Filter = Convert.ToString(JOriginCR["Filter"]);
            int UserID = Convert.ToInt32(JOriginCR["UserID"]);

            string[] tokens = Filter.Split('|');
            string CID = tokens[0];
            string LO = tokens[1];
            string Budget = tokens[2];
            int BID = 0;
            int BudgetFileID = 0;
            int Mode = 0;

            if ((LO == "0") && (Budget == "0"))
            {
                Mode = 1;
            }
            else if ((LO == "0") && (Budget != "0"))
            {
                string[] tokens1 = Budget.Split(',');
                BID = Convert.ToInt32(tokens1[0]);
                BudgetFileID = Convert.ToInt32(tokens1[1]);
                Mode = 3;
            }
            else if ((LO != "0") && (Budget == "0"))
            {
                Mode = 2;
            }
            else
            {
                string[] tokens1 = Budget.Split(',');
                BID = Convert.ToInt32(tokens1[0]);
                BudgetFileID = Convert.ToInt32(tokens1[1]);
                Mode = 3;
            }

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                /*
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Reports/Variance/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {
                }

                PDFCreation BusinessContext1 = new PDFCreation();
                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/Variance/"), "");
                string FinalPDFName1 = "Merge" + DateTime.Now;
                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                if (File.Exists(resumeFile))
                {
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/Variance/"), "");
                List<string> termsList = new List<string>();
                */
                string PrintAmt = "";
                var CRWData = BusinessContext.GetCRWListForReport(ProdID, Mode, CID, LO, BID, BudgetFileID);
                if (CRWData.Count > 0)
                {
                    StringBuilder ojbSB = new StringBuilder();
                    for (int i = 0; i < CRWData.Count; i++)
                    {
                        var PDFData = BusinessContext.GetVarianceReportData(CRWData[i].Budgetid, CRWData[i].BudgetFileID, UserID);
                        if (PDFData.Count > 0)
                        {
                            ojbSB.Append("<html>");
                            ojbSB.Append("<head><title></title></head>");
                            ojbSB.Append("<body>");
                            ojbSB.Append("<table style='width: 8.5in; border-collapse: collapse; border-top: 1px solid #ccc;repeat-header: yes;'>");

                            ojbSB.Append("<thead>");
                            ojbSB.Append("<tr><th colspan='9'>");
                            ojbSB.Append("<table style='width: 100%; border-collapse: collapse;'>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Budget Name : " + CRWData[i].BudgetName + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + CRWData[i].CompanyName + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Company Code(s) : " + JOrigin["Company"].Value + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>" + ProName + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'> &nbsp; </th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; color: white;'>r</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left;'> &nbsp; </th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center;'>EFC Change</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 12px; width: 20%; float: left; color: white;'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0 0 3px 0; font-size: 12px; width: 20%; float: left; color: white;'> &nbsp; </th>");
                            ojbSB.Append("<th style='padding: 0 0 3px 0; font-size: 16px; width: 60%; float: left; text-align: center; color: white;'>f</th>");
                            string CurrentDate = BusinessContext.UserSpecificTime(ProdID);
                            ojbSB.Append("<th style='padding: 0 10px 3px 0; font-size: 12px; width: 18%; float: left; text-align: right;'>Printed on : " + CurrentDate + "</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("</table>");
                            ojbSB.Append("</th>");
                            ojbSB.Append("</tr>");

                            ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-left-width: 1px; border-left: 1px solid black;'>Account</th>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>Date of Change</th>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; color: #A4DEF9;'>Date of Change</th>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Date of Change</th>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Prior EFC</th>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Current EFC</th>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;'>Change</th>");
                            ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: center; border-top-width: 1px; border-top: 1px solid black;'>Period Value</th>");
                            ojbSB.Append("<th style='padding: 5px 15px 1px 15px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black; border-right-width: 1px; border-right: 1px solid black;'>Change Notes</th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("</thead>");
                            ojbSB.Append("<tbody>");

                            string Old = "";
                            string New = "";

                            float Difference = 0;
                            for (int j = 0; j < PDFData.Count; j++)
                            {
                                New = PDFData[j].AccountCode;
                                if (j == 0)
                                {
                                    LoopNo = j;
                                    Old = PDFData[j].AccountCode;
                                    New = PDFData[j].AccountCode;

                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan='9'>" + PDFData[j].AccountCode + " - " + PDFData[j].AccountName + "</th>");
                                    ojbSB.Append("</tr>");

                                    ojbSB.Append("<tr>");
                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='3'></th>");
                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[j].SaveDate + "</th>");

                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].EFCOLD).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].EFCNEW).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].Change).ToString("#,##0") + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 15px 1px 15px; font-size: 11px; text-align: Center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[j].Period + "</th>");
                                    ojbSB.Append("<th style='padding: 5px 15px 1px 15px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + (PDFData[j].Notes ?? "") + "</th>");
                                    ojbSB.Append("</tr>");
                                    Difference = Difference + (float)Convert.ToDouble(PDFData[j].Change);
                                }
                                else
                                {
                                    LoopNo = j;
                                    if (Old == New)
                                    {
                                        ojbSB.Append("<tr>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='3'></th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[j].SaveDate + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].EFCOLD).ToString("#,##0") + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].EFCNEW).ToString("#,##0") + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].Change).ToString("#,##0") + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 15px 1px 15px; font-size: 11px; text-align: Center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[j].Period + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 15px 1px 15px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + (PDFData[j].Notes ?? "") + "</th>");
                                        ojbSB.Append("</tr>");
                                        Difference = Difference + (float)Convert.ToDouble(PDFData[j].Change);
                                        Old = PDFData[j].AccountCode;
                                    }
                                    else
                                    {
                                        if ((float)Convert.ToDouble(Difference) > 0)
                                        {
                                            PrintAmt = "$" + Convert.ToDecimal(Difference).ToString("#,##0");
                                        }
                                        else
                                        {
                                            PrintAmt = "-$" + Convert.ToDecimal(Difference).ToString("#,##0");
                                        }

                                        ojbSB.Append("<tr>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 1px solid black;' colspan='6'>Total EFC Changes for Account " + PDFData[LoopNo].AccountCode + "</th>");
                                        ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 1px solid black;'>" + PrintAmt + "</th>");
                                        ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                                        ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                                        ojbSB.Append("</tr>");

                                        Difference = 0;

                                        ojbSB.Append("<tr>");
                                        ojbSB.Append("<th style='padding: 5px 10px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black; background-color: #FFFAE3;' colspan='9'>" + PDFData[j].AccountCode + " - " + PDFData[j].AccountName + "</th>");
                                        ojbSB.Append("</tr>");

                                        ojbSB.Append("<tr>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='3'></th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[j].SaveDate + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].EFCOLD).ToString("#,##0") + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].EFCNEW).ToString("#,##0") + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + "$" + Convert.ToDecimal(PDFData[j].Change).ToString("#,##0") + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 15px 1px 15px; font-size: 11px; text-align: Center; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[j].Period + "</th>");
                                        ojbSB.Append("<th style='padding: 5px 15px 1px 15px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + (PDFData[j].Notes ?? "") + "</th>");
                                        ojbSB.Append("</tr>");
                                        Difference = Difference + (float)Convert.ToDouble(PDFData[j].Change);
                                        Old = PDFData[j].AccountCode;

                                        LoopNo = j;
                                    }

                                }
                            }
                            PrintAmt = "";
                            if ((float)Convert.ToDouble(Difference) > 0)
                            {
                                PrintAmt = "$" + Convert.ToDecimal(Difference).ToString("#,##0");
                            }
                            else
                            {
                                PrintAmt = "-$" + Convert.ToDecimal(Difference).ToString("#,##0");
                            }

                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 1px solid black;' colspan='6'>Total EFC Changes for Account " + PDFData[LoopNo].AccountCode + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 1px solid black;'>" + PrintAmt + "</th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                            ojbSB.Append("</tr>");

                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='9'></th>");
                            ojbSB.Append("</tr>");
                            ojbSB.Append("</tbody>");
                            ojbSB.Append("</table>");
                            ojbSB.Append("</body>");
                            ojbSB.Append("</html>");

                            //string NewPDF = ojbSB.ToString();
                            //string TimeStampp = DateTime.Now.ToShortTimeString();
                            //BusinessContext1.GeneratePDFReportLandScape("Reports/Variance", "VariancePDF" + CRWData[i].BudgetFileID + TimeStampp.Replace(":", "_").Replace(" ", "_") + "", "CostPDF", NewPDF.Replace("&", "&#38;"));
                            //termsList.Add(fileSavePath + "\\VariancePDF" + CRWData[i].BudgetFileID + TimeStampp.Replace(":", "_").Replace(" ", "_") + ".PDF");
                        }
                    }
                    string json = "{\"reportdata\":\""
                        + ojbSB.ToString()
                        + "}";
                    string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                    return jsonReturn.ToString();

                    //string[] terms = termsList.ToArray();
                    //if (terms.Length > 0)
                    //{
                    //    string FinalPDFName = "VarianceReport_" + DateTime.Now.ToShortTimeString().Replace(":", "_").Replace(" ", "_");
                    //    MergePDFsLandScape(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);
                    //    return FinalPDFName;
                    //}
                    //else
                    //{
                    //    return "";
                    //}
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }
        }

        [Route("ReconciliationReport")]
        [HttpGet, HttpPost]
        public string ReconciliationReport(string ProdID, string Filter, string ProName, int UserID)
        {
            string[] tokens = Filter.Split('|');
            string CompanyID = tokens[0];
            string BankID = tokens[1];
            string ReconcilationID = tokens[2];

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/Reports/Reconciliation/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                { }

                PDFCreation BusinessContext1 = new PDFCreation();

                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/Reconciliation/"), "");

                string FinalPDFName1 = "Merge" + DateTime.Now;

                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                if (File.Exists(resumeFile))
                {
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Reports/Reconciliation/"), "");
                List<string> termsList = new List<string>();


                var ReconcilationIDs = BusinessContext.ReconcilationListForReport(CompanyID, BankID, ReconcilationID);
                if (ReconcilationIDs.Count > 0)
                {
                    for (int i = 0; i < ReconcilationIDs.Count; i++)
                    {
                        int ReconID = Convert.ToInt32(ReconcilationIDs[i].ReconcilationID);

                        var PDFData = BusinessContext.GetReconcilationReportData(ReconID, UserID);
                        var HeaderData = BusinessContext.GetReconcilationReportHeader(ReconID, Convert.ToInt32(ProdID));

                        StringBuilder ojbSB = new StringBuilder();
                        ojbSB.Append("<html>");
                        ojbSB.Append("<html>");
                        ojbSB.Append("<head><title></title></head>");
                        ojbSB.Append("<body>");
                        ojbSB.Append("<table style='width: 100%; float: left;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 30%; float: left;'>Bank Code : " + HeaderData[0].BankCode + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 45%; float: left; text-align: center;'>" + HeaderData[0].CompanyName + "</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 25%; float: left;'>Bank Rec. : Finalized</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 30%; float: left;'>Bank Currency Code : USD</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 45%; float: left; text-align: center;'>" + ProName + "</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 25%; float: left;'>Finalized Date : " + HeaderData[0].FinilizedDate + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 30%; float: left;'>Bank AP Cash Account :" + HeaderData[0].CashAccount + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 45%; float: left; text-align: center; color: white;'>r</th>");
                        string FinalizedBy = "";
                        if (HeaderData[0].Email != "")
                        {
                            FinalizedBy = HeaderData[0].Email;
                        }
                        else
                        {
                            FinalizedBy = HeaderData[0].Name;
                        }
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Finalized by : " + FinalizedBy + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Bank Rec. # : " + HeaderData[0].ReconcilationID + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 17px; width: 60%; float: left; text-align: center; color: white;'>a</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;color:white;'>Cancel Type : ALL</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left; color: white;'>Set(S) : </td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>Bank Reconciliation Report</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; color: white; float: left;'>dd</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Statement Amount : $" + Convert.ToDecimal(HeaderData[0].StatementEndingAmount).ToString("#,##0.00") + "</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;'>Statement Date : " + HeaderData[0].StatementDate + "</th>");

                        string CurrentDate = BusinessContext.UserSpecificTime(Convert.ToInt32(ProdID));

                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;'>Printed on : " + CurrentDate + "</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left; color:white;'>Statement Amount : $1256.25</td>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 16px; width: 60%; float: left; text-align: center;color:white;'>Statement Date 6/1/2016</th>");
                        ojbSB.Append("<td style='padding: 0px; font-size: 12px; width: 20%; float: left;color:white;'>Printed on : 01/07/2016</td>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("<table style='width: 100%; border-collapse: collapse;'>");
                        ojbSB.Append("<thead>");
                        ojbSB.Append("<tr style='background-color: #A4DEF9;'>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;border-left-width: 1px; border-left: 1px solid black;'>Type</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Payment #</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Journal #</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Doc. Date</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Line Item Description</th>");
                        ojbSB.Append("<th style='padding: 5px; font-size: 11px; text-align: left; border-top-width: 1px; border-top: 1px solid black;'>Trans. #</th>");
                        ojbSB.Append("<th style='padding: 5px 15px 1px 5px; font-size: 11px; text-align: right; border-top-width: 1px; border-top: 1px solid black;border-right-width: 1px; border-right: 1px solid black;'>Amount</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</thead>");
                        ojbSB.Append("<tbody>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: bold; border-top-width: 1px; border-top: 1px solid black;' colspan='6'>Cleared  Deposits, Fees, and Adjustments </th>");
                        ojbSB.Append("</tr>");
                        decimal Amt = 0;
                        for (int k = 0; k < PDFData.Count; k++)
                        {
                            ojbSB.Append("<tr>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[k].Source + "</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[k].PaymentID + "</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'></th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[k].Date + "</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[k].Description + "</th>");
                            ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>" + PDFData[k].TransactionNumber + "</th>");
                            ojbSB.Append("<th style='padding: 5px 15px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'>$" + Convert.ToDecimal(PDFData[k].DebitTotal).ToString("#,##0.00") + "</th>");
                            ojbSB.Append("</tr>");
                            Amt = Amt + Convert.ToDecimal(PDFData[k].DebitTotal);
                        }

                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 5px 0px 1px 5px; font-size: 11px; text-align: right; font-weight: bold; border-top-width: 1px; border-top: 1px solid black;' colspan='6'>Total Deposits, Fees, and Adjustments - Cleared</th>");
                        ojbSB.Append("<th style='padding: 5px 15px 1px 5px; font-size: 11px; text-align: right; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;'> " + "$" + Convert.ToDecimal(Amt).ToString("#,##0.00") + "</th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("<tr>");
                        ojbSB.Append("<th style='padding: 0px; font-size: 11px; text-align: left; font-weight: normal; border-top-width: 1px; border-top: 1px solid black;' colspan='7'></th>");
                        ojbSB.Append("</tr>");
                        ojbSB.Append("</tbody>");
                        ojbSB.Append("</table>");
                        ojbSB.Append("</body>");
                        ojbSB.Append("</html>");

                        string NewPDF = ojbSB.ToString();

                        string TimeStampp = DateTime.Now.ToShortTimeString();

                        BusinessContext1.GeneratePDFReport("Reports/Reconciliation", "Reconciliation" + 1 + TimeStampp.Replace(":", "_").Replace(" ", "_") + "", "BankingPDF", NewPDF.Replace("&", "&#38;"));
                        termsList.Add(fileSavePath + "\\Reconciliation" + 1 + TimeStampp.Replace(":", "_").Replace(" ", "_") + ".PDF");
                    }

                    string[] terms = termsList.ToArray();
                    string FinalPDFName = "MergeReconciliation" + DateTime.Now.ToShortTimeString().Replace(":", "_").Replace(" ", "_");

                    MergePDFs(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

                    return FinalPDFName;
                }
                else
                {
                    return "";
                }
            }

            else
            {
                return "";
            }
        }

        [Route("GetReconcilationList")]
        [HttpGet, HttpPost]
        public List<GetReconcilationList_Result> GetReconcilationList(int ProdID, int BankID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetReconcilationList(ProdID, BankID);
            }
            else
            {
                List<GetReconcilationList_Result> n = new List<GetReconcilationList_Result>();
                return n;
            }
        }


        [Route("getDetailAccount")]
        [HttpGet, HttpPost]
        public List<getDetailAccount_Result> getDetailAccount(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.getDetailAccount(ProdID);
            }
            else
            {
                List<getDetailAccount_Result> n = new List<getDetailAccount_Result>();
                return n;
            }
        }
    }
}

