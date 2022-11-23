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
using Newtonsoft.Json.Linq;

namespace EMS.API
{
    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/AccountPayableOp")]
    // [RoutePrefix("api/AccountPayableOp")]
    public class AccountPayableOpController : ApiController
    {
        AccountPayableBusiness BusinessContext = new AccountPayableBusiness();
        ReportP1Business ReportContext = new ReportP1Business();
        CompanySettingsBusiness CompanyContext = new CompanySettingsBusiness();
        AdminToolsBusiness AdminContext = new AdminToolsBusiness();
        private const string LocalLoginProvider = "Local";

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
        //   AccountPayableBusiness BusinessContext = new AccountPayableBusiness();

        //[AllowAnonymous]
        [Route("GetVendorListByProdID")]
        [HttpGet, HttpPost]
        public List<GetVendorListByProdID_Result> GetVendorListByProdID(int ProdID, string SortBy)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetVendorListByProdID(ProdID, SortBy);
            }
            else
            {
                List<GetVendorListByProdID_Result> n = new List<GetVendorListByProdID_Result>();
                return n;
            }
        }
        //--------------------insertUpdatVendor-------------------------//

        //   [AllowAnonymous]
        [Route("InsertUpdateVendor")]
        [HttpPost]

        public int InsertUpdateVendor(tblVendor _vendor)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.InsertUpdateVendor(_vendor);
            }
            else
            {
                return 0;
            }
        }

        //-----------------GetVendor By ProdId And VendorId---------------//
        //  [AllowAnonymous]
        [Route("GetVendorDetailByVendorID")]
        [HttpPost]
        public List<GetVendorDetailByVendorID_Result> GetVendorDetailByVendorID(int VendorID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetVendorDetailByVendorID(VendorID, ProdID);
            }
            else
            {
                List<GetVendorDetailByVendorID_Result> n = new List<GetVendorDetailByVendorID_Result>();
                return n;
            }
        }

        //==============getvendor Number==============//
        // [AllowAnonymous]
        [Route("GetLastVendorNumByProdId")]
        [HttpGet]
        public List<GetLastVendorNumByProdId_Result> GetLastVendorNumByProdId(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetLastVendorNumByProdId(ProdID);
            }
            else
            {
                List<GetLastVendorNumByProdId_Result> n = new List<GetLastVendorNumByProdId_Result>();
                return n;
            }
        }
        //================GetVendorByVendorId====================//
        // [AllowAnonymous]
        [Route("GetVendorInfoByVendorId")]
        [HttpGet]
        public List<GetVendorInfoByVendorId_Result> GetVendorInfoByVendorId(int VendorID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetVendorInfoByVendorId(VendorID, ProdID);
            }
            else
            {
                List<GetVendorInfoByVendorId_Result> n = new List<GetVendorInfoByVendorId_Result>();
                return n;
            }
        }

        //================APVendorsCheckExisting====================//
        // [AllowAnonymous]
        [Route("APVendorsCheckExisting")]
        [HttpGet]
        public string APVendorsCheckExisting(string JSONparameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0) return BusinessContext.APVendorsCheckExisting(JSONparameters);
            else return "";
        }
        //--------------------insertUpdatVendor-------------------------//

        //  [AllowAnonymous]
        [Route("InsertUpdateVendorInfo")]
        [HttpPost]

        public int InsertUpdateVendorInfo(List<VendorInfo> _Info)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.InsertUpdateVendorInfo(_Info);
            }
            else
            {
                return 0;
            }
        }


        //   Added By Vijay

        [Route("GetInvoiceListForPaymentNew")]
        [HttpPost]
        public List<GetInvoiceListForPaymentNew_Result> GetInvoiceListForPaymentNew(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));

                int prodId = Payload["ProdID"];
                int BankId = Payload["hdnBank"];
                string CompanyCode = Payload["CO"];
                string VendorID = Payload["txtVendor"];
                DateTime? InvDate1 = null; DateTime? InvDate2 = null; DateTime DC;
                bool isDate = DateTime.TryParse(Payload["txtInv1"].Value, out DC);
                if (isDate)
                {
                    InvDate1 = Convert.ToDateTime(DC);
                }
                isDate = DateTime.TryParse(Payload["txtInv2"].Value, out DC);
                if (isDate)
                {
                    InvDate1 = Convert.ToDateTime(DC);
                }
                //InvDate2 = Convert.ToDateTime(Payload["txtInv2"].Value);
                string Period = Payload["ddlPeriod"];
                string PaymentType = Payload["ddlPaymentType"];

                //if (VendorID == null)
                //{
                //    VendorID = "";
                //}

                return BusinessContext.GetInvoiceListForPaymentNew(prodId, BankId, CompanyCode, VendorID, InvDate1, InvDate2, Period, PaymentType);
            }
            else
            {
                List<GetInvoiceListForPaymentNew_Result> n = new List<GetInvoiceListForPaymentNew_Result>();
                return n;
            }
        }


        [Route("SavePayment")]
        [HttpPost]
        public string SavePayment(Payment1 ObjPay)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                string Result = BusinessContext.SavePayment(ObjPay);
                return Result;
            }
            else
            {
                return "";
            }
        }

        [Route("GetCheckRun")]
        [HttpPost]
        public int GetCheckRun(int ProdID, int BankID, int UserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCheckRun(ProdID, BankID, UserID);
            }
            else
            {
                return 0;
            }
        }
        [Route("APCheckCycleVoidUnissued")]
        [HttpPost]
        public List<APCheckCycleVoidUnissued_Result> APCheckCycleVoidUnissued(int BankID, int startvoid, int endvoid, int UserID, string vBatchNumber, int ProdID, Boolean FlagVoid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetAPCheckCycleVoidUnissued(BankID, startvoid, endvoid, UserID, vBatchNumber, ProdID).ToList();
            }
            else
            {
                List<APCheckCycleVoidUnissued_Result> n = new List<APCheckCycleVoidUnissued_Result>();
                return n;
            }
        }

        [Route("GetCheckPreview")]
        [HttpGet]
        public List<GetCheckPreview_Result> GetCheckPreview(int CheckRunID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCheckPreview(CheckRunID);
            }
            else
            {
                List<GetCheckPreview_Result> n = new List<GetCheckPreview_Result>();
                return n;
            }
        }


        [Route("JournalEntryPayment")]
        public void JournalEntryPayment(List<CheckRunJE> _CheckRunJE)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.JournalEntryPayment(_CheckRunJE);
            }

            else
            {
                return;
            }
        }

        [Route("ComplateCheckRun")]
        [HttpPost]
        public void ComplateCheckRun(int CheckRunID, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.ComplateCheckRun(CheckRunID, ProdId);
            }

            else
            {
                return;
            }
        }


        [Route("GetVerifyCheck")]
        [HttpGet]
        public List<GetVerifyCheck_Result> GetVerifyCheck(int BankID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetVerifyCheck(BankID, ProdID);
            }
            else
            {
                List<GetVerifyCheck_Result> n = new List<GetVerifyCheck_Result>();
                return n;
            }
        }

        [Route("VerifiedCheckEntry")]
        public void VerifiedCheckEntry(List<CheckVerification> _CheckVerification)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.VerifiedCheckEntry(_CheckVerification);
            }

            else
            {
                return;
            }
        }

        [Route("GetPaymentVoidData1")]
        [HttpGet]
        public List<GetPaymentVoidData1_Result> GetPaymentVoidData1(int BankID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPaymentVoidData1(BankID);
            }
            else
            {
                List<GetPaymentVoidData1_Result> n = new List<GetPaymentVoidData1_Result>();
                return n;
            }
        }



        [Route("SaveVoidData")]
        public void SaveVoidData(List<VoidPayment> _VoidPayment)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.SaveVoidData(_VoidPayment);
            }

            else
            {
                return;
            }
        }


        //////////////--- Bank Reconcilation   /////////////////////////


        [Route("GetBankReconcilation")]
        [HttpGet]
        public List<GetBankReconcilation_Result> GetBankReconcilation(int BankID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetBankReconcilation(BankID);
            }
            else
            {
                List<GetBankReconcilation_Result> n = new List<GetBankReconcilation_Result>();
                return n;
            }
        }


        [Route("GenerateBankReconcilation")]
        [HttpPost]
        public int GenerateBankReconcilation(int BankID, int UserID, int ProdID, DateTime StatementDate, string StatementEndingAmount)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GenerateBankReconcilation(BankID, UserID, ProdID, StatementDate, StatementEndingAmount);
            }
            else
            {
                return 0;
            }
        }

        [Route("GetBankBalance")]
        [HttpGet]
        public List<GetBankBalance_Result> GetBankBalance(int BankID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetBankBalance(BankID, ProdID);
            }
            else
            {
                List<GetBankBalance_Result> n = new List<GetBankBalance_Result>();
                return n;
            }
        }

        [Route("SaveBankAdjustment")]
        public void SaveBankAdjustment(List<Adjustment> _BankAdjustment)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.SaveBankAdjustment(_BankAdjustment);
            }
            else
            {
                return;
            }
        }

        [Route("GetBankAdjustmentData")]
        [HttpGet]
        public List<GetBankAdjustmentData_Result> GetBankAdjustmentData(int ReconcilationID, int BankID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetBankAdjustmentData(ReconcilationID, BankID, ProdID);
            }
            else
            {
                List<GetBankAdjustmentData_Result> n = new List<GetBankAdjustmentData_Result>();
                return n;
            }
        }

        [Route("UpdateAdjustment")]
        public void UpdateAdjustment(int AdjustmentID, DateTime ADate, float Amount, string Description, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.UpdateAdjustment(AdjustmentID, ADate, Amount, Description, Mode);
            }

            else
            {
                return;
            }
        }

        [Route("BankReconcilatinAction")]
        [HttpGet]
        public List<BankReconcilatinAction_Result> BankReconcilatinAction(int ReconcilationID, int Mode, int UserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.BankReconcilatinAction(ReconcilationID, Mode, UserID);
            }
            else
            {
                List<BankReconcilatinAction_Result> n = new List<BankReconcilatinAction_Result>();
                return n;
            }
        }


        [Route("GetBankTransaction")]
        [HttpGet]
        public List<GetBankTransaction_Result> GetBankTransaction(int BankID, int ReconcilationID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetBankTransaction(BankID, ReconcilationID, ProdID);
            }
            else
            {
                List<GetBankTransaction_Result> n = new List<GetBankTransaction_Result>();
                return n;
            }
        }


        [Route("ClearedCheck")]
        public void ClearedCheck(List<BankTransaction> _BankTransaction)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.ClearedCheck(_BankTransaction);
            }

            else
            {
                return;
            }
        }

        [Route("UpdateCheckProperty")]
        public void UpdateCheckProperty(int ReconcilationID, int Mode, int Value)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.UpdateCheckProperty(ReconcilationID, Mode, Value);
            }

            else
            {
                return;
            }
        }

        [Route("CheckForOpenRunCheck")]
        [HttpGet]
        public List<CheckForOpenRunCheck_Result> CheckForOpenRunCheck(int BankID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckForOpenRunCheck(BankID, ProdID);
            }
            else
            {
                List<CheckForOpenRunCheck_Result> n = new List<CheckForOpenRunCheck_Result>();
                return n;
            }
        }


        [Route("EditCheckNumber")]
        [HttpGet]
        public List<EditCheckNumber_Result> EditCheckNumber(int BankID, int ProdID, string CheckNumber)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.EditCheckNumber(BankID, ProdID, CheckNumber);
            }
            else
            {
                List<EditCheckNumber_Result> n = new List<EditCheckNumber_Result>();
                return n;
            }
        }

        [Route("GetStartingCheckNumber")]
        [HttpGet]
        public List<GetStartingCheckNumber_Result> GetStartingCheckNumber(int BankId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetStartingCheckNumber(BankId, ProdId);
            }
            else
            {
                List<GetStartingCheckNumber_Result> n = new List<GetStartingCheckNumber_Result>();
                return n;
            }
        }

        [Route("CancelCheckRun")]
        [HttpGet]
        public void CancelCheckRun(int ProdID, int CheckRunID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.CancelCheckRun(ProdID, CheckRunID);
            }

            else
            {
                return;
            }
        }

        [Route("GetBankTransactionDisplayAll")]
        [HttpGet]
        public List<GetBankTransactionDisplayAll_Result> GetBankTransactionDisplayAll(int BankID, int ReconcilationID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetBankTransactionDisplayAll(BankID, ReconcilationID, ProdID);
            }
            else
            {
                List<GetBankTransactionDisplayAll_Result> n = new List<GetBankTransactionDisplayAll_Result>();
                return n;
            }
        }

        public string FileNameNew(int ID)
        {
            Random random = new Random();
            int password = random.Next(10000);

            string ReturnVal = Convert.ToString(ID) + Convert.ToString(password);
            return ReturnVal;
        }

        //For Backup for Blank Check

        [Route("GenerateCheckPDF")]
        public string GenerateCheckPDF(string CheckNumber, int BankID, int CheckRun, string ProName, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/CheckPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {

                }

                string NewName = "";
                PDFCreation BusinessContext1 = new PDFCreation();
                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");
                string FinalPDFName1 = "Merge" + CheckRun;
                NewName = Convert.ToString(CheckRun);
                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                if (File.Exists(resumeFile))
                {
                    NewName = FileNameNew(CheckRun);
                    FinalPDFName1 = "Merge" + NewName; ;
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }

                string[] tokens = CheckNumber.Split(',');
                for (int i = 0; i < tokens.Length; i++)
                {
                    string PaymentIDss = tokens[i];

                    var ResultInvoice = BusinessContext.PDFInvoiceLine(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var TaxAmount = BusinessContext.PDFInvoiceTaxAmount(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var ResultVendor = BusinessContext.PDFVendorDetail(Convert.ToInt32(PaymentIDss), BankID, ProdID);

                    string Taxx = Convert.ToString(TaxAmount[0].Amount);

                    DateTime today = DateTime.Today;
                    string s_today = today.ToString("MM/dd/yyyy");

                    string NewPDF = "<html>";
                    NewPDF += "<head><title>check_cycle</title></head>";
                    NewPDF += "<body>";
                    NewPDF += "<div style='margin: auto;'>";
                    NewPDF += "<table style='padding: 10px 0; margin-bottom: 10px; width: 100%; table-layout: fixed;'>";
                    NewPDF += "<thead>";
                    NewPDF += "<tr>";
                    NewPDF += "<th style='font-size: 9px; font-family: Arial; text-align: left;'>" + ResultVendor[0].CompanyName + "</th>";
                    NewPDF += "<th style='font-size: 9px; font-family: Arial; text-align: left; width: 200px;'>" + ResultVendor[0].Vendor + "</th>";
                    NewPDF += "<th style='font-size: 9px; font-family: Arial; text-align: left;'></th>";
                    NewPDF += "</tr>";
                    NewPDF += "</thead>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>" + ProName + "</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>1234567890</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>" + s_today + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='border-collapse: collapse; padding: 3px 0; width: 100%;'>";
                    NewPDF += "<thead>";
                    NewPDF += "<tr>";
                    NewPDF += "<th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: left; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Invoice Date</th>";
                    NewPDF += "<th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: left; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Invoice Number</th>";
                    NewPDF += "  <th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: left; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Invoice Description</th>";
                    NewPDF += "   <th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: right; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Amount</th>";
                    NewPDF += " </tr>";
                    NewPDF += "</thead>";
                    NewPDF += "<tbody>";

                    int Amountt = 0;

                    for (int j = 0; j < ResultInvoice.Count; j++)
                    {

                        NewPDF += "<tr>";
                        NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-left-width: 1px; border-left: 1px solid black; vertical-align: top !important; width: 200px!Important;'>" + ResultInvoice[j].InvoiceDate + "</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'>" + ResultInvoice[j].InvoiceNumber + "</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'>" + ResultInvoice[j].Description + "</td>";
                        NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Arial; padding: 5px 10px; border-right-width: 1px; border-right: 1px solid black; vertical-align: top !important; width: 200px!Important;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "</tr>";

                        Amountt += Convert.ToInt32(ResultInvoice[j].InvoiceAmount);
                    }

                    for (int j = 0; j < 31 - Convert.ToInt32(ResultInvoice.Count); j++)
                    {
                        NewPDF += "<tr>";
                        NewPDF += "<td style='font-size: 9px;color:white; font-family: Arial; padding: 5px 10px; border-left-width: 1px; border-left: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Vijay G</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
                        NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Arial; padding: 5px 10px; border-right-width: 1px; border-right: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
                        NewPDF += "</tr>";
                    }

                    string ToWord = ConvertNumbertoWords(Amountt);

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-left-width: 1px; border-left: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
                    NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Arial; padding: 5px 10px; border-right-width: 1px; border-right: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
                    NewPDF += "</tr>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;''></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;''></td>";
                    NewPDF += "</tr>";

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='width: 100%; float: right;'>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>*** Check total :</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>Amount subject to 1099 Reporting :</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Taxx).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='padding: 10px 0; width: 100%;margin-top:24px;'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri;width: 63%;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Calibri; font-weight: bold;'></td>";
                    NewPDF += "<td style='font-size: 8px; font-family: Calibri'></td>";
                    NewPDF += "<td></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Calibri'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Calibri'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Calibri'></td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri;'>Date</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri;'>" + s_today + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri'></td>";
                    NewPDF += "<td style='font-size: 17px;'></td>";
                    NewPDF += "<td style='font-size: 17px;'></td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri;'></td>";
                    NewPDF += "</tr>";

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";

                    NewPDF += "<table style='padding: 10px 0; margin-top: 40px; width: 100%; table-layout: fixed;'>";
                    NewPDF += "<tbody>";

                    NewPDF += "<tr>";

                    string d = Convert.ToDecimal(Amountt).ToString("#,##0.00");

                    string[] a = d.Split(new char[] { '.' });
                    string decimals = a[1];

                    NewPDF += "<td style='padding: 20px 0; font-weight: bold; font-size: 12px; font-family: Calibri;' colspan='3'>PAY EXACTLY : ******" + ToWord + " DOLLARS  AND " + decimals + "/100* </td>";
                    NewPDF += "</tr>";

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";

                    NewPDF += "<table style='width: 100%; table-layout: fixed;'>";
                    NewPDF += "<tbody>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 50px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].Vendor + "</td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;'><b>AMOUNT:</b></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;'><b>$**" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</b></td>";
                    NewPDF += "</tr>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 16px; width: 50px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].W9Address1 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 15px; width: 50px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].W9Address2 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 15px; width: 50px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].W9City + ", " + ResultVendor[0].StateCode + " " + ResultVendor[0].W9Zip + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 15px; width: 50px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'></td>";
                    NewPDF += "<td style='font-size: 15px;' colspan='2'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";

                    NewPDF += "</div>";
                    NewPDF += "</body>";
                    NewPDF += "</html>";


                    string Name = NewName + PaymentIDss;

                    BusinessContext1.GeneratePDF("Check" + Name + "", "CheckPDF", NewPDF);
                }

                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");
                List<string> termsList = new List<string>();
                for (int j = 0; j < tokens.Length; j++)
                {
                    termsList.Add(fileSavePath + "\\Check" + NewName + tokens[j] + ".PDF");
                }
                string[] terms = termsList.ToArray();

                string FinalPDFName = "Merge" + NewName; ;

                MergePDFs(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

                return NewName;
            }

            else
            {
                return "";
            }
        }

        [Route("GenerateCheckPDF_VISTA")]
        public string GenerateCheckPDF_VISTA(string CheckNumber, int BankID, int CheckRun, string ProName, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                List<string> termsList = new List<string>();
                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), ProName);
                string returnPath = "/CheckPDF/" + ProName + "/";

                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/CheckPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    string error;
                    error = ex.ToString();
                }

                string NewName = "";
                PDFCreation BusinessContext1 = new PDFCreation();
                string FinalPDFName1 = "Merge" + CheckRun;
                NewName = Convert.ToString(CheckRun);
                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                if (File.Exists(resumeFile))
                {
                    NewName = FileNameNew(CheckRun);
                    FinalPDFName1 = "Merge" + NewName; ;
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }

                //PDFCls BusinessContext1 = new PDFCls();
                //string NewName = "";
                //string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");
                //string returnPath = "/CheckPDF/" + ProName + "/";
                //string FinalPDFName1 = "Merge" + CheckRun;
                //string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                //NewName = Convert.ToString(CheckRun);

                if (File.Exists(resumeFile))
                {
                    NewName = FileNameNew(CheckRun);
                    FinalPDFName1 = "Merge" + NewName; ;
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }

                string[] tokens = CheckNumber.Split(',');

                for (int i = 0; i < tokens.Length; i++)
                {
                    string PaymentIDss = tokens[i];

                    var ResultInvoice = BusinessContext.PDFInvoiceLine(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var TaxAmount = BusinessContext.PDFInvoiceTaxAmount(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var ResultVendor = BusinessContext.PDFVendorDetail(Convert.ToInt32(PaymentIDss), BankID, ProdID);

                    string Taxx = Convert.ToString(TaxAmount[0].Amount);

                    DateTime today = DateTime.Today;
                    string s_today = today.ToString("MM/dd/yyyy");


                    string NewPDF = "<html>";
                    NewPDF += "<head><title>Check Run " + CheckRun.ToString() + "</title></head>";
                    NewPDF += "<body>";
                    NewPDF += "<div style='margin: auto; padding-top: 2px;padding-bottom: 2px;display: inline;'>";
                    // Begin Check stub
                    //                    NewPDF += "<table style='border:10;width:100%'><tbody><tr><td>";

                    NewPDF += "<table style='padding: 15px 0; margin-bottom: 15px; table-layout: fixed; border:0; '>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 1.125in; height:0.55in'> </td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;width: 165px;'> </td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;'> </td>";
                    NewPDF += "</tr>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 1.125in;'> </td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;width: 1.85in;'>" + ResultVendor[0].VendorID + "</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>" + ResultVendor[0].Vendor + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    //Checkstub related
                    //                    NewPDF += "</td></tr><tr><td>";

                    NewPDF += "<table style='border-collapse: collapse; table-layout: fixed; border:0;'>";
                    NewPDF += "<tbody><tr><td style='height:5.75in; width:8.0in; vertical-align:top; padding: 0px 0px 0px 0px; spacing: 0px 0px 0px 0px; align:left'>";

                    NewPDF += "<table style='border-collapse: collapse; padding: 0px 0px; spacing: 0px 0px 0px 0px; width: 8in; table-layout: fixed; border:0'>";
                    NewPDF += "<tbody>";

                    decimal Amountt = 0;

                    for (int j = 0; j < ResultInvoice.Count; j++)
                    {
                        NewPDF += "<tr style='margin-bottom:3px;'>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; text-align: left;vertical-align:top;padding: 0px; width: .9in;'>" + ResultInvoice[j].InvoiceNumber + "</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; text-align: left;vertical-align:top;padding: 0px; width: 0.5in;'>" + ResultInvoice[j].InvoiceDate + "</td>";
                        NewPDF += "<td style='text-align: right;vertical-align:top;padding: 0px;font-size: 9px; font-family: Calibri; width: 1.1in;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "<td style='text-align: right;vertical-align:top;padding: 0px; font-size: 9px; font-family: Calibri; width: 1.1in;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "<td style='text-align: right;vertical-align:top;padding: 0px; font-size: 9px; font-family: Calibri; width: 1.1in;'>-</td>";
                        NewPDF += "<td style='text-align: right;vertical-align:top;padding: 0px; spacing:3px; font-size: 9px; font-family: Calibri; width: 1.1in;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Calibri; width: 0.001in;color:#fff; width:0.1in;'>p</td>";
                        NewPDF += "<td style='text-align: left;vertical-align:top;padding: 0px;font-size: 9px; font-family: Calibri; text-align:left; width: 2.2in;'>" + ResultInvoice[j].Description + "</td>";
                        NewPDF += "</tr>";

                        Amountt += Convert.ToDecimal(ResultInvoice[j].InvoiceAmount);
                    }

                    string[] parts = Amountt.ToString().Split('.');
                    int i1 = int.Parse(parts[0]);

                    string ToWord = ConvertNumbertoWords(Convert.ToInt32(i1));

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";

                    NewPDF += "</td></tr></tbody></table>";

                    NewPDF += "<table style='width: 100%; float: right;'>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "</tr>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>*** Check total :</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>Amount subject to 1099 Reporting :</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Taxx).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</table>";
                    // End Check stub
                    //                    NewPDF += "</td></tr></tbody></table>";

                    NewPDF += "<table style='padding: 0px 0px 20px 0px ; width: 100%; margin-top: 60px; float: left;'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri; width: 65%;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Calibri;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;'>" + ResultVendor[0].CheckNumber + "</td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri;'>" + ResultVendor[0].CDate + "</td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; margin-left: 6px; float: left; width: 70px;'>" + ResultVendor[0].VendorID + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='padding: 20px 0; width: 100%; table-layout: fixed;'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";

                    string d = Convert.ToDecimal(Amountt).ToString("#,##0.00");

                    string[] a = d.Split(new char[] { '.' });
                    string decimals = a[1];

                    NewPDF += "<td style='padding: 8px 0; font-weight: bold; font-size: 12px; font-family: Calibri;' colspan='3'>PAY EXACTLY : ******" + ToWord + " DOLLARS  AND " + decimals + "/100* </td>";
                    NewPDF += "</tr>";

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='width: 100%; table-layout: fixed; border:0px'>";
                    NewPDF += "<tbody>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%; padding-top: 65px;'>" + ResultVendor[0].Vendor + "</td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; color: #fff;'><b>AMOUNT:</b></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; vertical-align: top; padding-top:10px;'><b>" + Convert.ToDecimal(Amountt).ToString("$**#,##0.00") + "</b></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 16px; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9Address1 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9Address2 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9City + ", " + ResultVendor[0].StateCode + " " + ResultVendor[0].W9Zip + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'></td>";
                    NewPDF += "<td style='font-size: 15px;' colspan='2'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += " </table>";
                    NewPDF += " </div>";
                    NewPDF += "</body></html>";

                    string Name = NewName + PaymentIDss;
                    termsList.Add(BusinessContext1.GeneratePDF_Check("Check" + Name + "", ProName, NewPDF));
                    //BusinessContext1.GeneratePDFChecks("Check" + Name + "", "CheckPDF", NewPDF.Replace("&", "&#38;"));
                }

                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), ProName);
                //List<string> termsList = new List<string>();
                //for (int j = 0; j < tokens.Length; j++)
                //{
                //    termsList.Add(fileSavePath + "\\CheckPDFCheck" + NewName + tokens[j] + ".PDF");
                //}
                string[] terms = termsList.ToArray();
                string FinalPDFName = "Merge" + NewName;

                MergePDFsLetter(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

                return returnPath + FinalPDFName;

                //string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");
                //List<string> termsList = new List<string>();
                //for (int j = 0; j < tokens.Length; j++)
                //{
                //    termsList.Add(fileSavePath + "\\CheckPDFCheck" + NewName + tokens[j] + ".PDF");
                //}
                //string[] terms = termsList.ToArray();

                //string FinalPDFName = "Merge" + NewName; ;

                //MergePDFsLetter(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

                //return NewName;
            }

            else
            {
                return "";
            }
        }

        //For Backup for Blank Check
        [Route("GenerateCheckPDF_PSL")]
        public string GenerateCheckPDF_PSL(string CheckNumber, int BankID, int CheckRun, string ProName, int ProdID)
        {
            //            return GenerateCheckPDF_PSL(CheckNumber, BankID, CheckRun, ProName);
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                List<string> termsList = new List<string>();
                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), ProName);
                string returnPath = "/CheckPDF/" + ProName + "/";

                try
                {
                    string[] filePaths = Directory.GetFiles(fileSavePath1); // (HttpContext.Current.Server.MapPath("~/CheckPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    string error;
                    error = ex.ToString();
                }

                string NewName = "";
                PDFCreation BusinessContext1 = new PDFCreation();
                string FinalPDFName1 = "Merge" + CheckRun;
                NewName = Convert.ToString(CheckRun);
                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                if (File.Exists(resumeFile))
                {
                    NewName = FileNameNew(CheckRun);
                    FinalPDFName1 = "Merge" + NewName; ;
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }

                string[] tokens = CheckNumber.Split(',');
                for (int i = 0; i < tokens.Length; i++)
                {
                    string PaymentIDss = tokens[i];

                    var ResultInvoice = BusinessContext.PDFInvoiceLine(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var TaxAmount = BusinessContext.PDFInvoiceTaxAmount(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var ResultVendor = BusinessContext.PDFVendorDetail(Convert.ToInt32(PaymentIDss), BankID, ProdID);

                    string Taxx = Convert.ToString(TaxAmount[0].Amount);

                    DateTime today = DateTime.Today;
                    string s_today = today.ToString("MM/dd/yyyy");

                    string NewPDF = "<html>";
                    #region CheckHTML
                    NewPDF += "<head><title>Check Run " + CheckRun.ToString() + "</title></head>";
                    NewPDF += "<body>";
                    #region CheckHeader
                    NewPDF += "<table style='padding: 15px 0; margin-bottom: 15px; table-layout: fixed; border:0; '>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 115mm; height:20mm'> </td>";
                    //NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;width: 165px;'> </td>";
                    //NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;'> </td>";
                    //NewPDF += "</tr>";

                    //NewPDF += "<tr>";
                    //NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 1.125in;'> </td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;width: 39mm;'>" + ResultVendor[0].Vendor + "</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;width: 39mm;'>" + ResultVendor[0].CDate + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";

                    #endregion CheckHeader


                    #region CheckStub
                    NewPDF += "<table border=0 style='border-collapse: collapse; table-layout: fixed; border:0;' width=100%>";
                    NewPDF += "<tbody><tr><td style='height:5.75in; vertical-align:top; padding: 0px 0px 0px 0px; spacing: 0px 0px 0px 0px; align:left'>";

                    NewPDF += "<table border=0 width=100% style='border-collapse: collapse; padding: 0px 0px; spacing: 0px 0px 0px 0px; border:0'>";
                    NewPDF += "<tbody>";

                    decimal Amountt = 0;
                    for (int j = 0; j < ResultInvoice.Count; j++)
                    {
                        NewPDF += "<tr style='margin-bottom:0px;'>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; width: 3mm;'> </td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; width: 20mm;'>" + ResultInvoice[j].InvoiceDate + "</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri;width: 42mm'>" + ResultInvoice[j].InvoiceNumber + "</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; width: 62mm'>" + WebUtility.HtmlEncode(ResultInvoice[j].Description) + "</td>";

                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; text-align: right;width: 30mm;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; text-align: right; width: 21mm;'> - </td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; text-align: right; width: 30mm'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "</tr>";


                        Amountt += Convert.ToDecimal(ResultInvoice[j].InvoiceAmount);
                    }

                    string[] parts = Amountt.ToString().Split('.');
                    int i1 = int.Parse(parts[0]);

                    string ToWord = ConvertNumbertoWords(Convert.ToInt32(i1));

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";

                    NewPDF += "</td></tr></tbody></table>";

                    NewPDF += "<table style='width: 100%;'>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "</tr>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>*** Check total :</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>Amount subject to 1099 Reporting :</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Taxx).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</table>";
                    #endregion CheckStub

                    #region CheckBody
                    NewPDF += "<table border=0 style='padding: 0px 0px 20px 0px ; width: 216mm; margin-top: 25mm;'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri; width: 75mm'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 32mm;'>" + ResultVendor[0].VendorID + "</td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 32mm'>" + ResultVendor[0].CheckNumber + "</td>";
                    NewPDF += "<td style='font-size: 9px;  font-family: Calibri; width: 29mm'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; padding-top: -3mm; padding-left: -5mm;'>" + ResultVendor[0].CDate + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";

                    NewPDF += "<table border=0 width=100% style='padding: 0px'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr><td style='padding-top:2mm;'> &nbsp; </td></tr>";
                    string d = Convert.ToDecimal(Amountt).ToString("#,##0.00");
                    string[] a = d.Split(new char[] { '.' });
                    string decimals = a[1];
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; font-weight: bold; width:100%'>PAY EXACTLY : ******" + ToWord + " DOLLARS  AND " + decimals + "/100* </td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; vertical-align: top; width:40mm'><b>" + Convert.ToDecimal(Amountt).ToString("**#,##0.00**") + "</b></td>";
                    NewPDF += "</tr>";

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='width: 216mm; table-layout: fixed; border:0px'>";
                    NewPDF += "<tbody>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 30mm;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%; padding-top:5mm'>" + ResultVendor[0].Vendor + "</td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; color: #fff;'><b>AMOUNT:</b></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 16px; width: 35mm;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9Address1 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9Address2 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9City + ", " + ResultVendor[0].StateCode + " " + ResultVendor[0].W9Zip + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 56px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'></td>";
                    NewPDF += "<td style='font-size: 15px;' colspan='2'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += " </table>";
                    #endregion CheckBody

                    //                    NewPDF += " </div>";
                    NewPDF += "</body>";
                    #endregion CheckHTML
                    NewPDF += "</html>";

                    string Name = NewName + PaymentIDss;

                    //termsList.Add(fileSavePath + "\\CheckPDFCheck" + NewName + tokens[j] + ".PDF");
                    termsList.Add(BusinessContext1.GeneratePDF_Check("Check" + Name + "", ProName, NewPDF));
                    //BusinessContext1.GeneratePDF("Check" + Name + "", ProName, NewPDF);
                }

                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), ProName);
                //for (int j = 0; j < tokens.Length; j++)
                //{
                //}
                string[] terms = termsList.ToArray();

                string FinalPDFName = "Merge" + NewName;

                MergePDFsLetter(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

                return returnPath + FinalPDFName;
            }

            else
            {
                return "";
            }
        }

        /// <summary>
        ///  End Back Up
        /// </summary>
        /// <param name="BankID"></param>
        /// <param name="CheckRun"></param>
        /// <param name="ProName"></param>
        /// <returns></returns>

        [Route("GenerateCheckPDFCopies")]
        public string GenerateCheckPDFCopies(int BankID, int CheckRun, string ProName, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/CheckPDF/")));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {

                }
                string returnPath = "/CheckPDF/" + ProName + "/";

                string NewName = "";

                PDFCls BusinessContext1 = new PDFCls();


                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");

                string FinalPDFName1 = "Merge" + CheckRun;

                NewName = Convert.ToString(CheckRun);

                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

                if (File.Exists(resumeFile))
                {
                    NewName = FileNameNew(CheckRun);
                    FinalPDFName1 = "Merge" + NewName; ;
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }

                List<string> termsList = new List<string>();

                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");

                var CheckNumber = BusinessContext.PDFCopiesPID(CheckRun, BankID, ProdID);

                for (int i = 0; i < CheckNumber.Count; i++)
                {
                    int PaymentIDss = Convert.ToInt32(CheckNumber[i].PaymentID);

                    var ResultInvoice = BusinessContext.PDFInvoiceLine(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var TaxAmount = BusinessContext.PDFInvoiceTaxAmount(Convert.ToInt32(PaymentIDss), BankID, ProdID);
                    var ResultVendor = BusinessContext.PDFVendorDetail(Convert.ToInt32(PaymentIDss), BankID, ProdID);

                    string Taxx = Convert.ToString(TaxAmount[0].Amount);

                    DateTime today = DateTime.Today; // As DateTime
                    string s_today = today.ToString("MM/dd/yyyy");
                    #region checkHTML
                    string NewPDF = "<html>";
                    NewPDF += "<head><title>check_cycle</title></head>";
                    NewPDF += "<body>";
                    NewPDF += "<div style='margin: auto; padding-top: 2px;padding-bottom: 2px;'>";
                    NewPDF += "<table style='padding: 15px 0; margin-bottom: 15px; width: 100%; table-layout: fixed;'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 65px;'>ACSACS</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;width: 165px;'>Ramesh</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;'>10/18/2016</td>";
                    NewPDF += "</tr>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 65px;'>ACSACS</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;width: 165px;'>Ramesh</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;'>10/18/2016</td>";
                    NewPDF += "</tr>";


                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 65px;'>ACSACS</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;width: 165px;'>Ramesh</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff;'>10/18/2016</td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left; color: #fff; width: 65px;'>ACSACS</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;width: 165px;'>" + ResultVendor[0].VendorID + "</td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>" + ResultVendor[0].Vendor + "</td>";
                    NewPDF += "</tr>";

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='border-collapse: collapse; padding: 0px 0; width: 100%;'>";
                    NewPDF += "<tbody>";

                    decimal Amountt = 0;

                    for (int j = 0; j < ResultInvoice.Count; j++)
                    {

                        NewPDF += "<tr style='margin-bottom:3px;'>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; text-align: left; width: 85px;'>" + ResultInvoice[j].InvoiceNumber + "</td>";
                        NewPDF += "<td style='font-size: 9px; font-family: Calibri; text-align: left; width: 62px;'>" + ResultInvoice[j].InvoiceDate + "</td>";
                        NewPDF += "<td style='text-align: right;font-size: 9px; font-family: Calibri; width: 80px;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Calibri; width: 110px;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Calibri; width: 110px;'>-</td>";
                        NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Calibri; width: 140px;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
                        NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Calibri; width: 60px;color:#fff;'>$2.0000</td>";
                        NewPDF += "<td style='text-align: left;font-size: 9px; font-family: Calibri; vertical-align:top; float: left; margin-left:height:25px; 70px;width: 210px'>" + ResultInvoice[j].Description + "</td>";
                        NewPDF += "</tr>";


                        Amountt += Convert.ToDecimal(ResultInvoice[j].InvoiceAmount);
                    }


                    for (int j = 0; j < 23 - Convert.ToInt32(ResultInvoice.Count); j++)
                    {
                        NewPDF += "<tr style='margin-bottom:3px;'>";
                        NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: left; width: 85px;color:#fff;'>A</td>";
                        NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: center; width: 62px;color:#fff;'>A</td>";
                        NewPDF += "<td style='text-align: right; font-size: 10px; font-family: Arial; width: 80px;color:#fff;'>A</td>";
                        NewPDF += "<td style='text-align: right; font-size: 10px; font-family: Arial; width: 110px;color:#fff;'>A</td>";
                        NewPDF += "<td style='text-align: right; font-size: 10px; font-family: Arial; width: 110px;color:#fff;'>-</td>";
                        NewPDF += "<td style='text-align: right; font-size: 10px; font-family: Arial; width: 140px;color:#fff;'>A</td>";
                        NewPDF += "<td style='text-align: right; font-size: 10px; font-family: Arial; width: 60px;color:#fff;'>$2.0000</td>";
                        NewPDF += "<td style='text-align: left; font-size: 10px; font-family: Arial;vertical-align:top; float: left; margin-left: 70px;color:#fff;'>A</td>";
                        NewPDF += "</tr>";
                    }

                    string[] parts = Amountt.ToString().Split('.');
                    int i1 = int.Parse(parts[0]);

                    string ToWord = ConvertNumbertoWords(Convert.ToInt32(i1));


                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='width: 100%; float: right;'>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>*** Check total :</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>Amount subject to 1099 Reporting :</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Taxx).ToString("#,##0.00") + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='padding: 0px 0px 20px 0px ; width: 100%; margin-top: 60px; float: left;'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri; width: 65%;'></td>";
                    NewPDF += "<td style='font-size: 9px; font-family: Calibri;'></td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri;'>" + ResultVendor[0].CheckNumber + "</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri;'>" + ResultVendor[0].CDate + "</td>";
                    NewPDF += "<td style='font-size: 10px; font-family: Calibri; margin-left: 6px; float: left; width: 70px;'>" + ResultVendor[0].VendorID + "</td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='padding: 10px 0; width: 100%; table-layout: fixed;'>";
                    NewPDF += "<tbody>";
                    NewPDF += "<tr>";


                    string d = Convert.ToDecimal(Amountt).ToString("#,##0.00");

                    string[] a = d.Split(new char[] { '.' });
                    string decimals = a[1];

                    NewPDF += "<td style='padding: 8px 0; font-weight: bold; font-size: 12px; font-family: Calibri;' colspan='3'>PAY EXACTLY : ******" + ToWord + " DOLLARS  AND " + decimals + "/100* </td>";
                    NewPDF += "</tr>";

                    NewPDF += "</tbody>";
                    NewPDF += "</table>";
                    NewPDF += "<table style='width: 100%; table-layout: fixed;'>";
                    NewPDF += "<tbody>";

                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 44px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%; padding-top: 50px;'>" + ResultVendor[0].Vendor + "</td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; color: #fff;'><b>AMOUNT:</b></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; vertical-align: top;'><b>$**" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</b></td>";
                    NewPDF += "</tr>";
                    NewPDF += "<tr>";
                    NewPDF += "<td style='font-size: 16px; width: 44px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9Address1 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 44px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9Address2 + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 44px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'>" + ResultVendor[0].W9City + ", " + ResultVendor[0].StateCode + " " + ResultVendor[0].W9Zip + "</td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>                <tr>";
                    NewPDF += "<td style='font-size: 15px; width: 44px;'></td>";
                    NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 60%;'></td>";
                    NewPDF += "<td style='font-size: 15px;' colspan='2'></td>";
                    NewPDF += "<td style='font-size: 15px;'></td>";
                    NewPDF += "</tr>";
                    NewPDF += "</tbody>";
                    NewPDF += " </table>";
                    NewPDF += " </div></body></html>";
                    #endregion checkHTML

                    string Name = NewName + PaymentIDss;
                    BusinessContext1.GeneratePDFChecks("Check" + Name + "", "CheckPDF", NewPDF.Replace("&", "&#38;"));
                    termsList.Add(fileSavePath + "\\CheckPDFCheck" + Name + ".PDF");
                }
                string[] terms = termsList.ToArray();
                string FinalPDFName = "Merge" + NewName; ;
                MergePDFsLetter(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);
                return returnPath + FinalPDFName;
            }

            else
            {
                return "";
            }
        }



        //[Route("GenerateCheckPDFCopies")]
        //public string GenerateCheckPDFCopies(int BankID, int CheckRun, string ProName)
        //{
        //    if (this.Execute(this.CurrentUser.APITOKEN) == 0)
        //    {

        //        try
        //        {
        //            string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath("~/CheckPDF/")));
        //            foreach (string filePath in filePaths)
        //                File.Delete(filePath);
        //        }
        //        catch
        //        {

        //        }

        //        string NewName = "";

        //        PDFCreation BusinessContext1 = new PDFCreation();


        //        string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");

        //        string FinalPDFName1 = "Merge" + CheckRun;

        //        NewName = Convert.ToString(CheckRun);

        //        string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";

        //        if (File.Exists(resumeFile))
        //        {
        //            NewName = FileNameNew(CheckRun);
        //            FinalPDFName1 = "Merge" + NewName; ;
        //            resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
        //        }

        //        List<string> termsList = new List<string>();
        //        // string[] terms = termsList.ToArray();
        //        string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), "");

        //        var CheckNumber = BusinessContext.PDFCopiesPID(CheckRun, BankID);

        //        for (int i = 0; i < CheckNumber.Count; i++)
        //        {
        //            int PaymentIDss = Convert.ToInt32(CheckNumber[i].PaymentID);

        //            var ResultInvoice = BusinessContext.PDFInvoiceLine(Convert.ToInt32(PaymentIDss), BankID);
        //            var TaxAmount = BusinessContext.PDFInvoiceTaxAmount(Convert.ToInt32(PaymentIDss), BankID);
        //            var ResultVendor = BusinessContext.PDFVendorDetail(Convert.ToInt32(PaymentIDss), BankID);

        //            string Taxx = Convert.ToString(TaxAmount[0].Amount);

        //            DateTime today = DateTime.Today; // As DateTime
        //            string s_today = today.ToString("MM/dd/yyyy");

        //            string NewPDF = "<html>";
        //            NewPDF += "<head><title>check_cycle</title></head>";
        //            NewPDF += "<body>";
        //            NewPDF += "<div style='margin: auto;'>";
        //            NewPDF += "<table style='padding: 10px 0; margin-bottom: 10px; width: 100%; table-layout: fixed;'>";
        //            NewPDF += "<thead>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<th style='font-size: 9px; font-family: Arial; text-align: left;'>" + ResultVendor[0].CompanyName + "</th>";
        //            NewPDF += "<th style='font-size: 9px; font-family: Arial; text-align: left; width: 200px;'>" + ResultVendor[0].Vendor + "</th>";
        //            NewPDF += "<th style='font-size: 9px; font-family: Arial; text-align: left;'></th>";
        //            NewPDF += "</tr>";
        //            NewPDF += "</thead>";
        //            NewPDF += "<tbody>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>" + ProName + "</td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>1234567890</td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: left;'>" + s_today + "</td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "</tbody>";
        //            NewPDF += "</table>";
        //            NewPDF += "<table style='border-collapse: collapse; padding: 3px 0; width: 100%;'>";
        //            NewPDF += "<thead>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: left; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Invoice Date</th>";
        //            NewPDF += "<th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: left; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Invoice Number</th>";
        //            NewPDF += "  <th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: left; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Invoice Description</th>";
        //            NewPDF += "   <th style='font-size: 9px; font-family: Arial; padding: 5px 10px; text-align: right; border-bottom-width: 1px; border-bottom: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Amount</th>";
        //            NewPDF += " </tr>";
        //            NewPDF += "</thead>";
        //            NewPDF += "<tbody>";

        //            int Amountt = 0;

        //            for (int j = 0; j < ResultInvoice.Count; j++)
        //            {

        //                NewPDF += "<tr>";
        //                NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-left-width: 1px; border-left: 1px solid black; vertical-align: top !important; width: 200px!Important;'>" + ResultInvoice[j].InvoiceDate + "</td>";
        //                NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'>" + ResultInvoice[j].InvoiceNumber + "</td>";
        //                NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'>" + ResultInvoice[j].Description + "</td>";
        //                NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Arial; padding: 5px 10px; border-right-width: 1px; border-right: 1px solid black; vertical-align: top !important; width: 200px!Important;'>$" + Convert.ToDecimal(ResultInvoice[j].InvoiceAmount).ToString("#,##0.00") + "</td>";
        //                NewPDF += "</tr>";

        //                Amountt += Convert.ToInt32(ResultInvoice[j].InvoiceAmount);
        //            }

        //            for (int j = 0; j < 31 - Convert.ToInt32(ResultInvoice.Count); j++)
        //            {
        //                NewPDF += "<tr>";
        //                NewPDF += "<td style='font-size: 9px;color:white; font-family: Arial; padding: 5px 10px; border-left-width: 1px; border-left: 1px solid black; vertical-align: top !important; width: 200px!Important;'>Vijay G</td>";
        //                NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
        //                NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
        //                NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Arial; padding: 5px 10px; border-right-width: 1px; border-right: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
        //                NewPDF += "</tr>";
        //            }

        //            string ToWord = ConvertNumbertoWords(Amountt);

        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-left-width: 1px; border-left: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px;'></td>";
        //            NewPDF += "<td style='text-align: right; font-size: 9px; font-family: Arial; padding: 5px 10px; border-right-width: 1px; border-right: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
        //            NewPDF += "</tr>";

        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;''></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; padding: 5px 10px; border-top-width: 1px; border-top: 1px solid black; vertical-align: top !important; width: 200px!Important;''></td>";
        //            NewPDF += "</tr>";

        //            NewPDF += "</tbody>";
        //            NewPDF += "</table>";
        //            NewPDF += "<table style='width: 100%; float: right;'>";
        //            // NewPDF += "<thead>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>*** Check total :</td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>Amount subject to 1099 Reporting :</td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Arial; text-align: right;'>$" + Convert.ToDecimal(Taxx).ToString("#,##0.00") + "</td>";
        //            NewPDF += "</tr>";
        //            //NewPDF += "</thead>";
        //            NewPDF += "</table>";
        //            NewPDF += "<table style='padding: 10px 0; width: 100%;margin-top:24px;'>";
        //            NewPDF += "<tbody>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri;width: 63%;'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Calibri; font-weight: bold;'></td>";
        //            NewPDF += "<td style='font-size: 8px; font-family: Calibri'></td>";
        //            NewPDF += "<td></td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri;'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Calibri'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Calibri'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri'></td>";
        //            NewPDF += "<td style='font-size: 9px; font-family: Calibri'></td>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri;'>Date</td>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri;'>" + s_today + "</td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri'></td>";
        //            NewPDF += "<td style='font-size: 17px;'></td>";
        //            NewPDF += "<td style='font-size: 17px;'></td>";
        //            NewPDF += "<td style='font-size: 10px; font-family: Calibri;'></td>";
        //            NewPDF += "</tr>";

        //            NewPDF += "</tbody>";
        //            NewPDF += "</table>";

        //            NewPDF += "<table style='padding: 10px 0; margin-top: 40px; width: 100%; table-layout: fixed;'>";
        //            NewPDF += "<tbody>";

        //            NewPDF += "<tr>";

        //            string d = Convert.ToDecimal(Amountt).ToString("#,##0.00");

        //            string[] a = d.Split(new char[] { '.' });
        //            string decimals = a[1];

        //            NewPDF += "<td style='padding: 20px 0; font-weight: bold; font-size: 12px; font-family: Calibri;' colspan='3'>PAY EXACTLY : ******" + ToWord + " DOLLARS  AND " + decimals + "/100* </td>";
        //            NewPDF += "</tr>";

        //            NewPDF += "</tbody>";
        //            NewPDF += "</table>";

        //            NewPDF += "<table style='width: 100%; table-layout: fixed;'>";
        //            NewPDF += "<tbody>";

        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri; width: 50px;'></td>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].Vendor + "</td>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri;'><b>AMOUNT:</b></td>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri;'><b>$**" + Convert.ToDecimal(Amountt).ToString("#,##0.00") + "</b></td>";
        //            NewPDF += "</tr>";

        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 16px; width: 50px;'></td>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].W9Address1 + "</td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 15px; width: 50px;'></td>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].W9Address2 + "</td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 15px; width: 50px;'></td>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'>" + ResultVendor[0].W9City + ", " + ResultVendor[0].StateCode + " " + ResultVendor[0].W9Zip + "</td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "<tr>";
        //            NewPDF += "<td style='font-size: 15px; width: 50px;'></td>";
        //            NewPDF += "<td style='font-size: 12px; font-family: Calibri;width: 60%;'></td>";
        //            NewPDF += "<td style='font-size: 15px;' colspan='2'></td>";
        //            NewPDF += "<td style='font-size: 15px;'></td>";
        //            NewPDF += "</tr>";
        //            NewPDF += "</tbody>";
        //            NewPDF += "</table>";

        //            NewPDF += "</div>";
        //            NewPDF += "</body>";
        //            NewPDF += "</html>";


        //            string Name = NewName + PaymentIDss;

        //            BusinessContext1.GeneratePDF("Check" + Name + "", "CheckPDF", NewPDF);



        //            termsList.Add(fileSavePath + "\\Check" + Name + ".PDF");
        //        }
        //        string[] terms = termsList.ToArray();

        //        string FinalPDFName = "Merge" + NewName; ;

        //        MergePDFs(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

        //        return NewName;
        //    }

        //    else
        //    {
        //        return "";
        //    }
        //}


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

        private void MergePDFsLetter(string outPutFilePath, params string[] filesPath)
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


        [Route("InsertCheckRunByUser")]
        [HttpGet]
        public List<InsertCheckRunByUser_Result> InsertCheckRunByUser(int UserID, int BankID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.InsertCheckRunByUser(UserID, BankID);
            }
            else
            {
                List<InsertCheckRunByUser_Result> n = new List<InsertCheckRunByUser_Result>();
                return n;
            }
        }

        [Route("CancelCheckRunByUser")]
        [HttpGet]
        public void CancelCheckRunByUser(int UserID, int BankID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.CancelCheckRunByUser(UserID, BankID);
            }

            else
            {
                return;
            }
        }

        [Route("CheckWTNo")]
        [HttpGet]
        public List<CheckWTNo_Result> CheckWTNo(string WTList, int BankID, int ProdID, string CheckType)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckWTNo(WTList, BankID, ProdID, CheckType);
            }
            else
            {
                List<CheckWTNo_Result> n = new List<CheckWTNo_Result>();
                return n;
            }
        }

        //=================//
        [Route("GetDedaultCOLO")]
        [HttpGet, HttpPost]
        public List<GetDedaultCOLO_Result> GetDedaultCOLO(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetDedaultCOLO(ProdID);
            }
            else
            {
                List<GetDedaultCOLO_Result> n = new List<GetDedaultCOLO_Result>();
                return n;
            }
        }
        [Route("Reconciliation_ClearedTransaction")]
        [HttpPost]
        public void Reconciliation_ClearedTransaction(List<BankReconcilationAddon> Obj)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.Reconciliation_ClearedTransaction(Obj);
            }

        }
    }
    [CustomAuthorize()]
    [RoutePrefix("api/POSPay")]
    public class POSPayController : ApiController
    {
        POSPayBusiness BusinessContext = new POSPayBusiness();
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

        [Route("POSPayGet")]
        [HttpPost]
        public HttpResponseMessage POSPayGet(int BankID, int ProdID, bool isAdvanced)
        {
            var response = this.Request.CreateResponse(HttpStatusCode.OK);

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                string combindedString = "{";
                string returnString = string.Join("", BusinessContext.POSPayGet(BankID, ProdID, isAdvanced).ToArray());
                //combindedString += "\"resultJSON\": " + returnString + "}";
                response.Content = new StringContent(returnString, Encoding.UTF8, "application/json");
                return response;
            }
            else
            {
                response.StatusCode = HttpStatusCode.Forbidden;
                return response;
            }
        }
        [Route("POSPaySet")]
        [HttpPost]
        public HttpResponseMessage POSPaySet(int BankID, int ProdID, bool isAdvanced, string JSONPaymentIDList)
        {
            var response = this.Request.CreateResponse(HttpStatusCode.OK);

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                string combindedString = "{";
                string returnString = string.Join("", BusinessContext.POSPaySet(BankID, ProdID, isAdvanced, JSONPaymentIDList).ToArray());
                //combindedString += "\"resultJSON\": " + returnString + "}";
                response.Content = new StringContent(returnString, Encoding.UTF8, "application/json");
                return response;
            }
            else
            {
                response.StatusCode = HttpStatusCode.Forbidden;
                return response;
            }
        }
    }
    [CustomAuthorize()]
    [RoutePrefix("api/APInvoice")]
    public class APInvoiceController: ApiController
    {
        APInvoiceBusiness BusinessContext = new APInvoiceBusiness();
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
        //=================//
        [Route("APInvoiceGet")]
        [HttpPost]
        public List<APInvoiceGet_Result> APInvoiceGet(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                JObject Parameters = JObject.Parse(callParameters.callPayload);
                int ProdID = Convert.ToInt32(Parameters["ProdID"].ToString());
                int InvoiceID = Convert.ToInt32(Parameters["InvoiceID"].ToString());
                int UserID = Convert.ToInt32(Parameters["UserID"].ToString());

                return BusinessContext.APInvoiceGet(ProdID, InvoiceID, UserID);
            }
            else
            {
                List<APInvoiceGet_Result> n = new List<APInvoiceGet_Result>();
                return n;
            }
        }
        [Route("APAtlasPaymentMapGet")]
        [HttpPost]
        public List<APAtlasPaymentMapGet_Result> APAtlasPaymentMapGet(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.APAtlasPaymentMapGet(callParameters.callPayload);
            }
            else
            {
                List<APAtlasPaymentMapGet_Result> n = new List<APAtlasPaymentMapGet_Result>();
                return n;
            }
        }
        [Route("APAtlasPaymentInformationGet")]
        [HttpPost]
        public List<APAtlasPaymentInformationGet_Result> APAtlasPaymentInformationGet(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.APAtlasPaymentInformationGet(callParameters.callPayload);
            }
            else
            {
                List<APAtlasPaymentInformationGet_Result> n = new List<APAtlasPaymentInformationGet_Result>();
                return n;
            }
        }

    }

}

