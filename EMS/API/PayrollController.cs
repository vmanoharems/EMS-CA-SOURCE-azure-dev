using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EMS.Entity; // REQUIRED FOR EF RETURN TYPE
using EMS.Data;
using EMS.Business;
using System.Web;
using System.IO;
using System.Xml;
using EMS.Controllers;
using System.Xml.XPath;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Text;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/PRPortal")]
    public class PRPortalController : ApiController
    {
        private AtlasSecurity _AtlasSecurity;
        private PRPortalBusiness _PRPortalBusinessContext;
        protected CustomPrincipal CurrentUser
        {
            get { return HttpContext.Current.User as CustomPrincipal; }
        }
        protected bool Authorized()
        {
            bool ret = (this.CurrentUser.Identity != null || this.CurrentUser.APITOKEN != null);
            if (ret)
            {
                this._AtlasSecurity = new AtlasSecurity(Request.Headers);
                this._PRPortalBusinessContext = new PRPortalBusiness(this._AtlasSecurity);
            }
            return ret;
        }
        // Legacy
        protected int Execute(string APITOKEN = null)
        {
            try
            {
                if (this.CurrentUser == null) // Coult not authorize
                    return -1;
                if (this.CurrentUser.Identity != null || APITOKEN != null) // Successful authorization
                {
                    return 0;
                }
                else // Invalid authorization
                {
                    return 1;
                }
            }
            catch
            {
                return 99;
            }
        }
        // End Legacy
        [Route("PRList")]
        [HttpPost]
        public List<AtlasPRList_Result> PRList(JSONParameters callParameters)
        {
            try
            {
                if (this.Authorized())
                {
                    var Payload = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Payload["ProdID"];

                    return this._PRPortalBusinessContext.PRList(ProdID, callParameters);
                }
                else
                {
                    throw new System.Exception("NOT AUTHORIZED");
                }
            }
            catch (Exception ex)
            {
                return new List<AtlasPRList_Result>();
            }
        }

        [Route("PRGet")]
        [HttpPost]
        public HttpResponseMessage PRGet(JSONParameters callParameters)
        {
            try
            {
                if (this.Authorized())
                {
                    var Payload = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int PREditID = Payload["PREditID"];
                    int ProdID = Payload["ProdID"];
                    int UserID = Payload["UserID"];

                    string result = string.Join("", this._PRPortalBusinessContext.PRGet(PREditID, ProdID, UserID).ToArray());
                    HttpResponseMessage response = this.Request.CreateResponse(HttpStatusCode.OK);
                    response.Content = new StringContent(result, Encoding.UTF8, "application/json");
                    return response;
                } else
                {
                    throw new System.Exception("NOT AUTHORIZED");
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = this.Request.CreateResponse(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(ex.ToString());
                return response;
            }
        }

        [Route("PRSave")]
        [HttpPost]
        public HttpResponseMessage PRSave(JSONParameters callParameters)
        {
            try
            {
                if (this.Authorized())
                {
                    var Payload = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int PREditID = Payload["PREditID"];
                    int ProdID = Payload["ProdID"];
                    int UserID = Payload["UserID"];

                    string result = string.Join("", this._PRPortalBusinessContext.PRSave(PREditID, ProdID, UserID, callParameters).ToArray());
                    HttpResponseMessage response = this.Request.CreateResponse(HttpStatusCode.OK);
                    response.Content = new StringContent(result, Encoding.UTF8, "application/json");
                    return response;
                }
                else
                {
                    throw new System.Exception("NOT AUTHORIZED");
                }
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = this.Request.CreateResponse(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(ex.ToString());
                return response;
            }
        }
    }

    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/Payroll")]
    public class PayrollController : ApiController
    {
        PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
        // added here

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


        //
        public int PayrollGetReturn;


        // [AllowAnonymous]
        [Route("InsertAdminPayrollFile")]
        [HttpPost]
        public string InsertAdminPayrollFile()
        {
            try
            {
                /*                string baseDir = AppDomain.CurrentDomain.BaseDirectory + "/Documents/";
                                string[] filePaths = Directory.GetFiles(baseDir );
                                string filedeletion = "";
                                try
                                {

                                    foreach (string filePath in filePaths)
                                        File.Delete(filePath);
                                }
                                catch (Exception ex)
                                {
                                    filedeletion = ex.ToString();
                                }
                */
                if (this.Execute(this.CurrentUser.APITOKEN) == 0)
                {
                    List<String> listMapping = new List<string>();
                    var httpPostedFile = HttpContext.Current.Request.Files["PayrollFileXML"];
                    var uploadedby = HttpContext.Current.Request.Form["uploadedby"];
                    var prodid = HttpContext.Current.Request.Form["prodid"];
                    var CompanyID = HttpContext.Current.Request.Form["CompanyID"];
                    var InvoiceRef = HttpContext.Current.Request.Form["InvoiceRef"];
                    var KeyPassword = HttpContext.Current.Request.Form["KeyID"];

                    //                    var fileSavePath = Path.Combine(baseDir, httpPostedFile.FileName);
                    //                    string fileExtension = System.IO.Path.GetExtension(httpPostedFile.FileName);
                    //                    httpPostedFile.SaveAs(fileSavePath);

                    //                    DecryptFile(fileSavePath, KeyPassword);
                    //                    bool Result = CheckFile(fileSavePath.Replace(".gpg", ""));

                    if (httpPostedFile.InputStream.ToString() != "")// (Result == true)
                    {
                        XmlDocument doc = new XmlDocument();
                        doc.Load(httpPostedFile.InputStream); //, httpPostedFile.FileName.Replace(".gpg", "")));
                        string xmlcontents = doc.InnerXml;
                        string aa = xmlcontents;
                        string aa1 = "";
                        int index1 = aa.IndexOf("<PayrollData");
                        if (index1 != -1)
                        {
                            aa1 = aa.Remove(index1);
                        }
                        aa = aa.Replace(aa1, "");
                        aa1 = aa.Replace("'", "");

                        return BusinessContext.InsertAdminPayrollFile(InvoiceRef, Convert.ToInt32(CompanyID), Convert.ToInt32(prodid), Convert.ToInt32(uploadedby), aa1);
                    }
                    else
                    {
                        return "InValid";
                    }
                }
                else
                {
                    //List<InsertAdminPayrollFile_Result> n = new List<InsertAdminPayrollFile_Result>();
                    //return n;
                    return "";
                }
            }
            catch (Exception ex)
            {
                return "Top level: " + ex.ToString();
            }
        }

        public string DecryptFile(string encryptedFilePath, string Password)
        {

            FileInfo info = new FileInfo(encryptedFilePath);
            string decryptedFileName = info.FullName.Substring(0, info.FullName.LastIndexOf('.'));
            string encryptedFileName = info.FullName;
            //string password = System.Configuration.ConfigurationManager.AppSettings["passphrase"].ToString();
            string password = Password;
            System.Diagnostics.ProcessStartInfo psi = new System.Diagnostics.ProcessStartInfo("cmd.exe");
            psi.CreateNoWindow = true;
            psi.UseShellExecute = false;
            psi.RedirectStandardInput = true;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;
            // psi.WorkingDirectory = "C:\\Inetpub\\wwwroot";
            System.Diagnostics.Process process = System.Diagnostics.Process.Start(psi);
            string sCommandLine = @"echo " + password + "|gpg.exe --passphrase-fd 0 --batch --verbose --yes --output " + decryptedFileName + @" --decrypt " + encryptedFileName;
            process.StandardInput.WriteLine(sCommandLine);
            process.StandardInput.Flush();
            process.StandardInput.Close();
            process.WaitForExit();
            string result = process.StandardOutput.ReadToEnd();
            string error = process.StandardError.ReadToEnd();
            process.Close();
            return decryptedFileName;
        }

        public bool CheckFile(string FilePath)
        {
            FileInfo sFile = new FileInfo(FilePath);
            bool fileExist = sFile.Exists;
            return fileExist;
        }


        [Route("OverWriteAdminPayrollFile")]
        [HttpPost]
        public List<OverWriteAdminPayrollFile_Result> OverWriteAdminPayrollFile()
        {
            try
            {
                if (this.Execute(this.CurrentUser.APITOKEN) == 0)
                {
                    List<String> listMapping = new List<string>();
                    var httpPostedFile = HttpContext.Current.Request.Files["PayrollFileXML"];
                    var uploadedby = HttpContext.Current.Request.Form["uploadedby"];
                    var prodid = HttpContext.Current.Request.Form["prodid"];
                    var CompanyID = HttpContext.Current.Request.Form["CompanyID"];
                    var InvoiceRef = HttpContext.Current.Request.Form["InvoiceRef"];
                    string baseDir = AppDomain.CurrentDomain.BaseDirectory + "\\Documents\\";

                    XmlDocument doc = new XmlDocument();
                    doc.Load(httpPostedFile.InputStream); //Path.Combine(baseDir , httpPostedFile.FileName.Replace(".gpg", "")));
                    string xmlcontents = doc.InnerXml;
                    string aa = xmlcontents;
                    string aa1 = "";
                    int index1 = aa.IndexOf("<PayrollData");
                    if (index1 != -1)
                    {
                        aa1 = aa.Remove(index1);
                    }
                    aa = aa.Replace(aa1, "");
                    aa1 = aa.Replace("'", "");

                    return BusinessContext.OverWriteAdminPayrollFile(InvoiceRef, Convert.ToInt32(CompanyID), Convert.ToInt32(prodid), Convert.ToInt32(uploadedby), aa1);
                }
                else
                {
                    List<OverWriteAdminPayrollFile_Result> n = new List<OverWriteAdminPayrollFile_Result>();
                    return n.ToList();
                }
            }
            catch (Exception ex)
            {
                List<OverWriteAdminPayrollFile_Result> n = new List<OverWriteAdminPayrollFile_Result>();
                return n.ToList();
            }
        }


        //  [AllowAnonymous]
        [Route("GetAdminPayrollFile")]
        [HttpGet]
        public List<GetAdminPayrollFile_Result> GetAdminPayrollFile(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetAdminPayrollFile(ProdID);
            }
            else
            {
                List<GetAdminPayrollFile_Result> n = new List<GetAdminPayrollFile_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetPayrollFileinClientSide")]
        [HttpGet]
        public List<GetPayrollFileinClientSide_Result> GetPayrollFileinClientSide(string CompanyCode, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollFileinClientSide(CompanyCode, ProdID);
            }
            else
            {
                List<GetPayrollFileinClientSide_Result> n = new List<GetPayrollFileinClientSide_Result>();
                return n;
            }
        }

        //  [AllowAnonymous]
        [Route("GetPayrollDataFileFill")]
        [HttpGet]
        public List<GetPayrollDataFileFill_Result> GetPayrollDataFileFill(int PayrollFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollDataFileFill(PayrollFileID);
            }
            else
            {
                List<GetPayrollDataFileFill_Result> n = new List<GetPayrollDataFileFill_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetTransCodeForPayroll")]
        [HttpGet]
        public List<GetTransCodeForPayroll_Result> GetTransCodeForPayroll(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetTransCodeForPayroll(ProdID);
            }
            else
            {
                List<GetTransCodeForPayroll_Result> n = new List<GetTransCodeForPayroll_Result>();
                return n;
            }
        }

        //  [AllowAnonymous]
        [Route("GetPayrollHistory")]
        [HttpGet]
        public List<GetPayrollHistory_Result> GetPayrollHistory(int CompanyID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollHistory(CompanyID);
            }
            else
            {
                List<GetPayrollHistory_Result> n = new List<GetPayrollHistory_Result>();
                return n;
            }
        }


        //  [AllowAnonymous]
        [Route("InsertUpdatePayrollTransValue")]
        public void InsertUpdatePayrollTransValue(List<PayrollTransValue> _PayrollTransValue)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                BusinessContext.InsertUpdatePayrollTransValue(_PayrollTransValue);
            }
            else
            {
                return;
            }
        }


        [Route("CheckPayrollFileBeforePost")]
        public string CheckPayrollFileBeforePost(List<PayrollTransValue> _PayrollTransValue)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.CheckPayrollFileBeforePost(_PayrollTransValue);
            }
            else
            {
                return "";
            }
        }

        // [AllowAnonymous]
        [Route("GetTransCodeForPayrollAudit")]
        [HttpGet]
        public List<GetTransCodeForPayrollAudit_Result> GetTransCodeForPayrollAudit(int PayrollFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetTransCodeForPayrollAudit(PayrollFileID);
            }
            else
            {
                List<GetTransCodeForPayrollAudit_Result> n = new List<GetTransCodeForPayrollAudit_Result>();
                return n;
            }
        }

        //  [AllowAnonymous]
        [Route("GetTransCodeFromExpense")]
        [HttpGet]
        public List<GetTransCodeFromExpense_Result> GetTransCodeFromExpense(string TransStr)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                string TransStr1 = TransStr.Replace(",,", ",");
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetTransCodeFromExpense(TransStr1);
            }
            else
            {
                List<GetTransCodeFromExpense_Result> n = new List<GetTransCodeFromExpense_Result>();
                return n;
            }
        }

        //---------------vivek------------//

        //  [AllowAnonymous]
        [Route("GetSourceCodeBySource")]
        [HttpPost]
        public List<GetSourceCodeBySource_Result> GetSourceCodeBySource(int ProdID, string Source)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetSourceCodeBySource(ProdID, Source);
            }
            else
            {
                List<GetSourceCodeBySource_Result> n = new List<GetSourceCodeBySource_Result>();
                return n;
            }
        }
        //-----------------------------keyinsertupdatecontroller
        //  [AllowAnonymous]
        [Route("InsertUpdatePayrollfreeFields")]
        [HttpPost]

        public int InsertUpdatePayrollfreeFields(PayrollFreeField _keys)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.InsertUpdatePayrollfreeFields(_keys);
            }
            else
            {
                return 0;
            }

        }
        //-----------------getpayrolldata
        //  [AllowAnonymous]
        [Route("GetPayrollFreeFieldByCompanyId")]
        [HttpPost]
        public List<GetPayrollFreeFieldByCompanyId_Result> GetPayrollFreeFieldByCompanyId(int CompanyId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollFreeFieldByCompanyId(CompanyId);
            }
            else
            {
                List<GetPayrollFreeFieldByCompanyId_Result> n = new List<GetPayrollFreeFieldByCompanyId_Result>();
                return n;
            }
        }

        //--------------------------------savebankdata

        //  [AllowAnonymous]
        [Route("insertUpdatepayrollbanksetup")]
        [HttpPost]

        public int insertUpdatepayrollbanksetup(PayrollBankSetup _SetUp)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.insertUpdatepayrollbanksetup(_SetUp);
            }
            else
            {
                return 0;
            }

        }
        //-----------------------------GetAll Bank Detailsby ProdId
        //  [AllowAnonymous]
        [Route("GetBankSetupByProdID")]
        [HttpPost]
        public List<GetBankSetupByProdID_Result> GetBankSetupByProdID(int CompanyID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetBankSetupByProdID(CompanyID, ProdID);
            }
            else
            {
                List<GetBankSetupByProdID_Result> n = new List<GetBankSetupByProdID_Result>();
                return n;
            }
        }
        //----------------------------getpayrolloffsets

        // [AllowAnonymous]
        [Route("GetPayrollOffsets")]
        [HttpPost]
        public List<GetPayrollOffsets_Result> GetPayrollOffsets(int CompanyID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollOffsets(CompanyID);
            }
            else
            {
                List<GetPayrollOffsets_Result> n = new List<GetPayrollOffsets_Result>();
                return n;
            }
        }

        //-------------------------insertupdatepayrolloffsets
        // [AllowAnonymous]
        [Route("InsertUpdateAddOffsets")]
        [HttpPost]

        public int InsertUpdateAddOffsets(PayrollOffset _Offset)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.InsertUpdateAddOffsets(_Offset);
            }
            else
            {
                return 0;
            }
        }

        //  [AllowAnonymous]
        [Route("GetPayrollFileAmountDetail")]
        [HttpGet]
        public List<GetPayrollFileAmountDetail_Result> GetPayrollFileAmountDetail(int PayrollFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollFileAmountDetail(PayrollFileID);
            }
            else
            {
                List<GetPayrollFileAmountDetail_Result> n = new List<GetPayrollFileAmountDetail_Result>();
                return n;
            }
        }

        [Route("GetPayrollFileAmountDetailPost")]
        [HttpGet]
        public List<GetPayrollFileAmountDetailPost_Result> GetPayrollFileAmountDetailPost(int PayrollFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollFileAmountDetailPost(PayrollFileID);
            }
            else
            {
                List<GetPayrollFileAmountDetailPost_Result> n = new List<GetPayrollFileAmountDetailPost_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("SaveTrabsactionDate")]
        [HttpPost]
        public void SaveTrabsactionDate(int PayrollFileID, DateTime TransactionDate, string Status, string BatchNumber, string PeriodStatus)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                BusinessContext.SaveTrabsactionDate(PayrollFileID, TransactionDate, Status, BatchNumber, PeriodStatus);
            }
            else
            {
                return;
            }
        }

        // [AllowAnonymous]
        [Route("GetPayrollFileUserListByPayrollID")]
        [HttpGet]
        public List<GetPayrollFileUserListByPayrollID_Result> GetPayrollFileUserListByPayrollID(int PayrollFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollFileUserListByPayrollID(PayrollFileID);
            }
            else
            {
                List<GetPayrollFileUserListByPayrollID_Result> n = new List<GetPayrollFileUserListByPayrollID_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetPayrollExpenseByPayrollUser")]
        [HttpGet]
        public List<GetPayrollExpenseByPayrollUser_Result> GetPayrollExpenseByPayrollUser(int PayrollFileID, int PayrollUserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollExpenseByPayrollUser(PayrollFileID, PayrollUserID);
            }
            else
            {
                List<GetPayrollExpenseByPayrollUser_Result> n = new List<GetPayrollExpenseByPayrollUser_Result>();
                return n;
            }
        }

        //  [AllowAnonymous]
        [Route("InsertUpdateFringeByCompanyId")]
        [HttpPost]

        public int InsertUpdateFringeByCompanyId(PayrollFringeHeader _Fringe)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.InsertUpdateFringeByCompanyId(_Fringe);
            }
            else
            {
                return 0;
            }

        }
        //-------------------------------getFringebyProId
        // [AllowAnonymous]
        [Route("GetPayrollFringeByCompanyID")]
        [HttpGet]
        public List<GetPayrollFringeByCompanyID_Result> GetPayrollFringeByCompanyID(int CompanyID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollFringeByCompanyID(CompanyID);
            }
            else
            {
                List<GetPayrollFringeByCompanyID_Result> n = new List<GetPayrollFringeByCompanyID_Result>();
                return n;
            }
        }

        //[AllowAnonymous]
        //[Route("UpdatePayrollExpenses")]
        //[HttpPost]
        //public List<UpdatePayrollExpenses_Result> UpdatePayrollExpenses(int PayrollExpenseID, string ParameterValue, int ModifyBy, int ColumnName)
        //{
        //    PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
        //    var Result = BusinessContext.UpdatePayrollExpenses(PayrollExpenseID, ParameterValue, ModifyBy, ColumnName);
        //    return Result;
        //}

        //--------------------------getAddrange
        //[AllowAnonymous]
        //[Route("GetPayrollAddRange")]
        //[HttpPost]
        //public List<GetPayrollAddRange_Result> GetPayrollAddRange(int CompanyID)
        //{
        //    PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
        //    return BusinessContext.GetPayrollAddRange(CompanyID);
        //}
        //---------------------------------insertupdatePayrollAddrange
        //[AllowAnonymous]
        //[Route("InsertUpdateAddRange")]
        //[HttpPost]

        //public int InsertUpdateAddRange(PayrollFringetable _AdFring)
        //{
        //    PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
        //    return BusinessContext.InsertUpdateAddRange(_AdFring);

        //}
        //--------------------------getAddrangeByCompanyid
        // [AllowAnonymous]
        //[Route("GetPayrollAddFringeByConpanyID")]
        //[HttpPost]
        //public List<GetPayrollAddFringeByConpanyID_Result> GetPayrollAddFringeByConpanyID(int CompanyID)
        //{
        //    if (this.Execute(this.CurrentUser.APITOKEN) == 0)
        //    {
        //        PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
        //        return BusinessContext.GetPayrollAddFringeByConpanyID(CompanyID);
        //    }
        //    else
        //    {
        //        List<GetPayrollAddFringeByConpanyID_Result> n = new List<GetPayrollAddFringeByConpanyID_Result>();
        //        return n;
        //    }
        //}
        //----------------Autofill Suspense Account--------------//
        /// [AllowAnonymous]
        [Route("GetSuspenseAccountbyProdId")]
        [HttpPost]
        public List<GetSuspenseAccountbyProdId_Result> GetSuspenseAccountbyProdId(int ProdId, string Type, int ParentId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetSuspenseAccountbyProdId(ProdId, Type, ParentId);
            }
            else
            {
                List<GetSuspenseAccountbyProdId_Result> n = new List<GetSuspenseAccountbyProdId_Result>();
                return n;
            }
        }

        [Route("GetSegmentForPayroll")]
        [HttpGet]
        public List<GetSegmentForPayroll_Result> GetSegmentForPayroll(int ProdID)
        {
            //
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetSegmentForPayroll(ProdID);
            }
            else
            {
                List<GetSegmentForPayroll_Result> n = new List<GetSegmentForPayroll_Result>();
                return n;
            }
        }


        [Route("GetAdminPayrollFile")]
        [HttpGet]
        public List<FetchCOAbyCOACode_Result> FetchCOAbyCOACode(string COACode, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.FetchCOAbyCOACode(COACode, ProdID);
            }
            else
            {
                List<FetchCOAbyCOACode_Result> n = new List<FetchCOAbyCOACode_Result>();
                return n;
            }
        }

        [Route("GetPayrollDataFileForAudit")]
        [HttpGet]
        public List<GetPayrollDataFileForAudit_Result> GetPayrollDataFileForAudit(int PayrollFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollDataFileForAudit(PayrollFileID);
            }
            else
            {
                List<GetPayrollDataFileForAudit_Result> n = new List<GetPayrollDataFileForAudit_Result>();
                return n;
            }
        }

        [Route("GetSegmentStringFromExpense")]
        [HttpGet]
        public List<GetSegmentStringFromExpense_Result> GetSegmentStringFromExpense(string SegmentStr, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                string TransStr1 = SegmentStr.Replace(",,", ",");
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetSegmentStringFromExpense(SegmentStr, ProdID);
            }
            else
            {
                List<GetSegmentStringFromExpense_Result> n = new List<GetSegmentStringFromExpense_Result>();
                return n;
            }
        }


        [Route("PayrollCheckPrint")]
        [HttpPost]
        public string PayrollCheckPrint(int PayrollFileID, string ProName)
        {
            try
            {
                //ProName = WebUtility.UrlEncode(ProName);
                string FinalPDFName = "";
                string returnPath = "/CheckPDF/" + ProName + "/" + PayrollFileID.ToString();
                try
                {
                    DirectoryInfo di = new DirectoryInfo(returnPath);
                    foreach (FileInfo file in di.GetFiles())
                    {
                        file.Delete();
                    }
                }
                catch (Exception e)
                {
                    // We're going to do nothing because it is likely that hte dir just doesn't exist.
                }

                if (this.Execute(this.CurrentUser.APITOKEN) == 0)
                {
                    PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                    var PDF = BusinessContext.PayrollCheckPrint(PayrollFileID);

                    List<string> termsList = new List<string>();
                    ///// Create PDF Individuals/////////////////
                    var fileSavePath = "";
                    var pdffilename = "";
                    for (int i = 0; i < PDF.Count; i++)
                    {
                        string base64 = @"" + PDF[i].CheckPDF + "";
                        byte[] sPDFDecoded = Convert.FromBase64String(base64);

                        fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/CheckPDF/"), ProName, PayrollFileID.ToString());
                        pdffilename = fileSavePath + "\\pdf" + PDF[i].PdfCheckNum.ToString() + ".pdf";
                        System.IO.FileInfo file = new System.IO.FileInfo(pdffilename);
                        file.Directory.Create();

                        File.WriteAllBytes(@"" + pdffilename, sPDFDecoded);
                        termsList.Add(fileSavePath + "\\pdf" + PDF[i].PdfCheckNum.ToString() + ".PDF");
                    }

                    string[] terms = termsList.ToArray();
                    FinalPDFName = PDF[0].InvoiceNumber;
                    MergePDFs(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);

                }
                return returnPath + "/" + FinalPDFName;

                //return FinalPDFName;
            }
            catch (Exception ex)
            {
                return ex.InnerException.ToString();
            }
        }


        private void MergePDFs(string outPutFilePath, params string[] filesPath)
        {
            try
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
            catch (Exception ex)
            {
                throw ex;
            }

        }


        [Route("GetPayrollAuditList")]
        [HttpGet]
        public List<GetPayrollAuditList_Result> GetPayrollAuditList(int CompanyID, int UserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollAuditList(CompanyID, UserID);
            }
            else
            {
                List<GetPayrollAuditList_Result> n = new List<GetPayrollAuditList_Result>();
                return n;
            }
        }


        [Route("GetFreeFieldDetail")]
        [HttpGet]
        public List<GetFreeFieldDetail_Result> GetFreeFieldDetail(string CompanyCode, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetFreeFieldDetail(CompanyCode, ProdID);
            }
            else
            {
                List<GetFreeFieldDetail_Result> n = new List<GetFreeFieldDetail_Result>();
                return n;
            }
        }

        [Route("GetPayrollHistoryNew")]
        [HttpGet]
        public List<GetPayrollHistoryNew_Result> GetPayrollHistoryNew(int CompanyID, int UserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollHistoryNew(CompanyID, UserID);
            }
            else
            {
                List<GetPayrollHistoryNew_Result> n = new List<GetPayrollHistoryNew_Result>();
                return n;
            }
        }

        [Route("INVOICEJETHROUGHPAYROLL1")]
        [HttpGet]
        public List<INVOICEJETHROUGHPAYROLL1_Result> INVOICEJETHROUGHPAYROLL1(int PayrollFileID, int UserID, int ProdId, int VendorID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.INVOICEJETHROUGHPAYROLL1(PayrollFileID, UserID, ProdId, VendorID);
            }
            else
            {
                List<INVOICEJETHROUGHPAYROLL1_Result> n = new List<INVOICEJETHROUGHPAYROLL1_Result>();
                return n;
            }
        }

        [Route("JETHROUGHPAYROLL1")]
        [HttpGet]
        public List<JETHROUGHPAYROLL1_Result> JETHROUGHPAYROLL1(int PayrollFileID, int UserID, int ProdId, int VendorID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.JETHROUGHPAYROLL1(PayrollFileID, UserID, ProdId, VendorID);
            }
            else
            {
                List<JETHROUGHPAYROLL1_Result> n = new List<JETHROUGHPAYROLL1_Result>();
                return n;
            }
        }


        [Route("CheckClearingAccount")]
        [HttpGet]
        public List<CheckClearingAccount_Result> CheckClearingAccount(int PayrollFileID, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.CheckClearingAccount(PayrollFileID, ProdId);
            }
            else
            {
                List<CheckClearingAccount_Result> n = new List<CheckClearingAccount_Result>();
                return n;
            }
        }

        [Route("GetBankInfoPayroll")]
        [HttpPost]
        public List<GetBankInfoPayroll_Result> GetBankInfoPayroll(int CompanyId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetBankInfoPayroll(CompanyId, ProdId);
            }
            else
            {
                List<GetBankInfoPayroll_Result> n = new List<GetBankInfoPayroll_Result>();
                return n;

            }
        }

        [Route("GetPayrollVendor")]
        [HttpGet]
        public List<GetPayrollVendor_Result> GetPayrollVendor(int CID, int ProdID, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.GetPayrollVendor(CID, ProdID, Mode);
            }
            else
            {
                List<GetPayrollVendor_Result> n = new List<GetPayrollVendor_Result>();
                return n;
            }
        }


        [Route("CheckClosePeriodStatus")]
        [HttpGet]
        public List<CheckClosePeriodStatus_Result> CheckClosePeriodStatus(int CompanyID, string Period)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.CheckClosePeriodStatus(CompanyID, Period);
            }
            else
            {
                List<CheckClosePeriodStatus_Result> n = new List<CheckClosePeriodStatus_Result>();
                return n;

            }
        }

        [Route("InvoiceNumberAutoFill")]
        [HttpGet]
        public List<InvoiceNumberAutoFill_Result> InvoiceNumberAutoFill(int CompanyID, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                PayrollOperationBussiness BusinessContext = new PayrollOperationBussiness();
                return BusinessContext.InvoiceNumberAutoFill(CompanyID, Mode);
            }
            else
            {
                List<InvoiceNumberAutoFill_Result> n = new List<InvoiceNumberAutoFill_Result>();
                return n;

            }
        }

    }
}