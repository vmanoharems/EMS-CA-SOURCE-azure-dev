using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EMS.Entity;
using EMS.Business;
using System.Web;
using System.IO;
using System.Xml;
using EMS.Controllers;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/Budgetv2")]
    public class Budgetv2Controller : ApiController
    {
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

        [Route("Budgetv2List")]
        [HttpPost, HttpGet]
        public List<Budgetv2List_Result> Budgetv2List(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();

                return BusinessContext.Budgetv2List(ProdID).ToList();
            }
            else
            {
                List<Budgetv2List_Result> n = new List<Budgetv2List_Result>();
                return n;
            }
        }
        [Route("v2BudgetCRWOperation")]
        [HttpPost]
        public v2CRW_Save_Result v2BudgetCRWOperation(v2BudgetCRW ov2)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.v2BudgetCRWOperation(ov2);
            }
            else
            {
                return new v2CRW_Save_Result();
            }
        }

        [Route("Budgetv2History")]
        [HttpPost, HttpGet]
        public List<Budgetv2GetHistory_Result> Budgetv2History(int BudgetID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();

                return BusinessContext.Budgetv2GetHistoryList(BudgetID, ProdID).ToList();
            }
            else
            {
                List<Budgetv2GetHistory_Result> n = new List<Budgetv2GetHistory_Result>();
                return n;
            }
        }

    }



    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/BudgetOperation")]

    public class BudgetOperationController : ApiController
    {
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

        public int BudGetReturn;

        //  [AllowAnonymous]
        [Route("InsertUpdateBudget")]
        [HttpPost]
        public int InsertUpdateBudget(Budget _Budget)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.InsertUpdateBudget(_Budget);
            }
            else
            {
                return 0;
            }
        }

        // [AllowAnonymous]
        [Route("GetBudgetList")]
        [HttpPost]
        public List<GetBudgetList_Result> GetBudgetList(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.GetBudgetList(ProdID);
            }
            else
            {
                List<GetBudgetList_Result> n = new List<GetBudgetList_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetBudgetDetail")]
        [HttpGet]
        public List<GetBudgetDetail_Result> GetBudgetDetail(int BudgetID, int UserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.GetBudgetDetail(BudgetID, UserID);
            }
            else
            {
                List<GetBudgetDetail_Result> n = new List<GetBudgetDetail_Result>();
                return n;
            }
        }

        //[HttpPost]
        //[AllowAnonymous]
        [Route("ImportBudget")]
        [HttpPost]
        public int ImportBudget()
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                List<String> listMapping = new List<string>();
                if (HttpContext.Current.Request.Files.AllKeys.Any())
                {
                    var httpPostedFile = HttpContext.Current.Request.Files["UploadedXML"];
                    var uploadedby = HttpContext.Current.Request.Form["uploadedby"];
                    var Action = HttpContext.Current.Request.Form["Action"];
                    //var LeaveexistingCOA = HttpContext.Current.Request.Form["LeaveexistingCOA"];
                    var CompanCode = HttpContext.Current.Request.Form["CompanCode"];
                    var prodid = HttpContext.Current.Request.Form["prodid"];
                    //var Episode = HttpContext.Current.Request.Form["Episode"];
                    //var GL = HttpContext.Current.Request.Form["GL"];
                    //var Detail = HttpContext.Current.Request.Form["Detail"];
                    //var BudgetSet = HttpContext.Current.Request.Form["BudgetSet"];
                    var Budgetid = HttpContext.Current.Request.Form["Budgetid"];

                    var S1 = HttpContext.Current.Request.Form["S1"];
                    var S2 = HttpContext.Current.Request.Form["S2"];
                    var S3 = HttpContext.Current.Request.Form["S3"];
                    var S4 = HttpContext.Current.Request.Form["S4"];
                    var S5 = HttpContext.Current.Request.Form["S5"];
                    var S6 = HttpContext.Current.Request.Form["S6"];
                    var S7 = HttpContext.Current.Request.Form["S7"];
                    var S8 = HttpContext.Current.Request.Form["S8"];
                    var LedgerLebel = HttpContext.Current.Request.Form["LedgerLebel"];
                    var SegmentName = HttpContext.Current.Request.Form["SegmentName"];
                    var SegStr1 = HttpContext.Current.Request.Form["SegStr1"];
                    var SegStr2 = HttpContext.Current.Request.Form["SegStr2"];

                    if (httpPostedFile != null)
                    {

                        var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Documents/"), httpPostedFile.FileName);
                        string fileExtension = System.IO.Path.GetExtension(httpPostedFile.FileName);

                        httpPostedFile.SaveAs(fileSavePath);

                        XmlDocument doc = new XmlDocument();
                        doc.Load(Path.Combine(HttpContext.Current.Server.MapPath("~/Documents/"), httpPostedFile.FileName));
                        string xmlcontents = doc.InnerXml;
                        //string aa = xmlcontents.Replace("https://store.entertainmentpartners.com/EPWebStore/mmb/budget.xsd", "");
                        //string aa1 = aa.Replace("'", "");

                        string aa = xmlcontents;
                        string aa1 = "";
                        int index1 = aa.IndexOf("<categories>");
                        if (index1 != -1)
                        {
                            aa1 = aa.Remove(index1);
                        }
                        aa = aa.Replace(aa1, "");

                        aa1 = aa.Replace("'", "");


                        aa1 = "<budget>" + aa1;

                        BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                        BudGetReturn = BusinessContext.ImportBudget(Convert.ToInt32(uploadedby), Convert.ToString(Action), 0, Convert.ToString(CompanCode), Convert.ToInt32(prodid), Convert.ToInt32(Budgetid), aa1, S1, S2, S3, S4, S5, S6, S7, S8, LedgerLebel, SegmentName, SegStr1, SegStr2);
                    }
                }
                return BudGetReturn;
            }
            else
            {
                return 0;
            }
        }


        //  [AllowAnonymous]
        [Route("GetBudgetCategory")]
        [HttpGet]
        public List<GetBudgetCategory_Result> GetBudgetCategory(int BudgetFileID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.GetBudgetCategory(BudgetFileID, ProdID);
            }
            else
            {
                List<GetBudgetCategory_Result> n = new List<GetBudgetCategory_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetBudgetAccounts")]
        [HttpGet]
        public List<GetBudgetAccounts_Result> GetBudgetAccounts(int BudgetFileID, int ProdID, string CreateCOA)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.GetBudgetAccounts(BudgetFileID, ProdID, CreateCOA);
            }
            else
            {
                List<GetBudgetAccounts_Result> n = new List<GetBudgetAccounts_Result>();
                return n;
            }
        }

        [Route("GetBudgetAccountsNew")]
        [HttpGet]
        public List<GetBudgetAccountsNew_Result> GetBudgetAccountsNew(int BudgetFileID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.GetBudgetAccountsNew(BudgetFileID, ProdID);
            }
            else
            {
                List<GetBudgetAccountsNew_Result> n = new List<GetBudgetAccountsNew_Result>();
                return n;
            }
        }

        //[AllowAnonymous]
        [Route("GetBudgetDetails")]
        [HttpGet]
        public List<GetBudgetDetails_Result> GetBudgetDetails(int BudgetFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.GetBudgetDetails(BudgetFileID);
            }
            else
            {
                List<GetBudgetDetails_Result> n = new List<GetBudgetDetails_Result>();
                return n;
            }
        }

        //  [AllowAnonymous]
        [Route("BudgetActionStatus")]
        public int BudgetActionStatus(int BudgetID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.BudgetActionStatus(BudgetID);
            }
            else
            {
                return 0;
            }
        }


        // [AllowAnonymous]
        [Route("UpdateBudgetCategory")]
        public string UpdateBudgetCategory(BudgetCategoryUpdate _BudgetCategoryUpdate)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                var Result = BusinessContext.UpdateBudgetCategory(_BudgetCategoryUpdate);
                return Result;
            }
            else
            {
                return "";
            }
        }

        // [AllowAnonymous]
        [Route("UpdateBudgetAccount")]
        public string UpdateBudgetAccount(BudgetAccountUpdate _BudgetAccountUpdate)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                var Result = BusinessContext.UpdateBudgetAccount(_BudgetAccountUpdate);
                return Result;
            }
            else
            {
                return "";
            }
        }

        //  [AllowAnonymous]
        [Route("ProcessBudget")]
        public void ProcessBudget(BudgetProcessed _BudgetProcessed)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                BusinessContext.ProcessBudget(_BudgetProcessed);
            }
        }

        [Route("GetAccountNameForBudget")]
        [HttpGet, HttpPost]
        public List<GetAccountNameForBudget_Result> GetAccountNameForBudget(int ProdID, string Classification)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.GetAccountNameForBudget(ProdID, Classification);
            }
            else
            {
                List<GetAccountNameForBudget_Result> n = new List<GetAccountNameForBudget_Result>();
                return n;
            }
        }

        [Route("CheckCOAForProduction")]
        public int CheckCOAForProduction(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.CheckCOAForProduction(ProdID);
            }
            else
            {
                return 0;
            }
        }

        [Route("AddNewCategorytoBudget")]
        [HttpPost]
        public int AddNewCategorytoBudget(int Budgetfileid, string CategoryNumber, string CategoryDescription,
 string CategoryFringe, string CategoryTotal, int ProdID, int createdby)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.AddNewCategorytoBudget(Budgetfileid, CategoryNumber, CategoryDescription,
 CategoryFringe, CategoryTotal, ProdID, createdby);
            }
            else
            {
                return 0;
            }
        }

        //  [AllowAnonymous]
        [Route("CreateCOAfromBudgetAccount")]
        [HttpGet]
        public int CreateCOAfromBudgetAccount(string COAString, int Prodid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.CreateCOAfromBudgetAccount(COAString, Prodid);
            }
            else
            {
                return 0;
            }
        }


        [Route("AddNewAccounttoBudget")]
        [HttpPost]
        public int AddNewAccounttoBudget(int Budgetfileid, string AccountNumber, string AccountDescription,
 string AccountFringe, string AccountTotal, int ProdID, int createdby, string CategoryNumber)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.AddNewAccounttoBudget(Budgetfileid, AccountNumber, AccountDescription,
 AccountFringe, AccountTotal, ProdID, createdby, CategoryNumber);
            }
            else
            {
                return 0;
            }
        }


        [Route("ProceedBudgetFinal")]
        [HttpPost]
        public int ProceedBudgetFinal(int BudgetID, int BudgetFileID, int createdby, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.ProceedBudgetFinal(BudgetID, BudgetFileID, createdby, ProdID);
            }
            else
            {
                return 0;
            }
        }




        [Route("InsertBudgetFileLedger")]
        [HttpPost]
        public int InsertBudgetFileLedger()
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                List<String> listMapping = new List<string>();
                if (HttpContext.Current.Request.Files.AllKeys.Any())
                {
                    var httpPostedFile = HttpContext.Current.Request.Files["UploadedXML"];
                    var uploadedby = HttpContext.Current.Request.Form["uploadedby"];
                    var prodid = HttpContext.Current.Request.Form["prodid"];

                    if (httpPostedFile != null)
                    {

                        var fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Documents/"), httpPostedFile.FileName);
                        string fileExtension = System.IO.Path.GetExtension(httpPostedFile.FileName);

                        httpPostedFile.SaveAs(fileSavePath);

                        XmlDocument doc = new XmlDocument();
                        doc.Load(Path.Combine(HttpContext.Current.Server.MapPath("~/Documents/"), httpPostedFile.FileName));
                        string xmlcontents = doc.InnerXml;

                        string aa = xmlcontents;
                        string aa1 = "";
                        int index1 = aa.IndexOf("<categories>");
                        if (index1 != -1)
                        {
                            aa1 = aa.Remove(index1);
                        }
                        aa = aa.Replace(aa1, "");

                        aa1 = aa.Replace("'", "");


                        aa1 = "<budget>" + aa1;

                        BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                        BudGetReturn = BusinessContext.InsertBudgetFileLedger(Convert.ToInt32(uploadedby), Convert.ToInt32(prodid), aa1);
                    }
                }
                return BudGetReturn;
            }
            else
            {
                return 0;
            }
        }


        [Route("UpdateCodeMaskingCategory")]
        [HttpGet]
        public List<UpdateCodeMaskingCategory_Result> UpdateCodeMaskingCategory(int BudgetFileID, string CategoryNumber, int BudgetCategoryID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.UpdateCodeMaskingCategory(BudgetFileID, CategoryNumber, BudgetCategoryID);
            }
            else
            {
                List<UpdateCodeMaskingCategory_Result> n = new List<UpdateCodeMaskingCategory_Result>();
                return n;
            }
        }


        [Route("CheckBudgetInFinalBudget")]
        [HttpGet]
        public List<CheckBudgetInFinalBudget_Result> CheckBudgetInFinalBudget(int BudgetID, int BudgetFileID, int createdby, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.CheckBudgetInFinalBudget(BudgetID, BudgetFileID, createdby, ProdID);
            }
            else
            {
                List<CheckBudgetInFinalBudget_Result> n = new List<CheckBudgetInFinalBudget_Result>();
                return n;
            }
        }

        //[Route("CheckBudgetInFinalBudget")]
        //[HttpPost]
        //public int CheckBudgetInFinalBudget(int BudgetID, int BudgetFileID, int createdby)
        //{
        //    if (this.Execute(this.CurrentUser.APITOKEN) == 0)
        //    {
        //        BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
        //        return BusinessContext.CheckBudgetInFinalBudget(BudgetID, BudgetFileID, createdby);
        //    }
        //    else
        //    {
        //        return 0;
        //    }
        //}


        [Route("UpdateCodeMaskingAccount")]
        [HttpGet]
        public List<UpdateCodeMaskingAccount_Result> UpdateCodeMaskingAccount(int BudgetFileID, string AccountNumber, int BudgetAccountID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.UpdateCodeMaskingAccount(BudgetFileID, AccountNumber, BudgetAccountID);
            }
            else
            {
                List<UpdateCodeMaskingAccount_Result> n = new List<UpdateCodeMaskingAccount_Result>();
                return n;
            }
        }


        [Route("CreateCOAfromBudgetCategoryNew")]
        [HttpGet]
        public int CreateCOAfromBudgetCategoryNew(string BCIString, int BudgetFileID, int Prodid, int CreatedBy)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.CreateCOAfromBudgetCategoryNew(BCIString, BudgetFileID, Prodid, CreatedBy);
            }
            else
            {
                return 0;
            }
        }


        [Route("CreateCOAfromBudgetAccountNew")]
        [HttpGet]
        public int CreateCOAfromBudgetAccountNew(string BAIString, int BudgetFileID, int Prodid, int CreatedBy)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                return BusinessContext.CreateCOAfromBudgetAccountNew(BAIString, BudgetFileID, Prodid, CreatedBy);
            }
            else
            {
                return 0;
            }
        }


        [Route("EmptyBudget")]
        [HttpPost]
        public int EmptyBudget()
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                List<String> listMapping = new List<string>();

                var uploadedby = HttpContext.Current.Request.Form["uploadedby"];
                var CompanCode = HttpContext.Current.Request.Form["CompanCode"];
                var prodid = HttpContext.Current.Request.Form["prodid"];
                var Budgetid = HttpContext.Current.Request.Form["Budgetid"];

                var S1 = HttpContext.Current.Request.Form["S1"];
                var S2 = HttpContext.Current.Request.Form["S2"];
                var S3 = HttpContext.Current.Request.Form["S3"];
                var S4 = HttpContext.Current.Request.Form["S4"];
                var S5 = HttpContext.Current.Request.Form["S5"];
                var S6 = HttpContext.Current.Request.Form["S6"];
                var S7 = HttpContext.Current.Request.Form["S7"];
                var S8 = HttpContext.Current.Request.Form["S8"];
                var LedgerLebel = HttpContext.Current.Request.Form["LedgerLebel"];
                var SegmentName = HttpContext.Current.Request.Form["SegmentName"];
                var SegStr1 = HttpContext.Current.Request.Form["SegStr1"];
                var SegStr2 = HttpContext.Current.Request.Form["SegStr2"];



                BudgetOperationBussiness BusinessContext = new BudgetOperationBussiness();
                BudGetReturn = BusinessContext.EmptyBudget(Convert.ToInt32(uploadedby), Convert.ToString(CompanCode), Convert.ToInt32(prodid), Convert.ToInt32(Budgetid), S1, S2, S3, S4, S5, S6, S7, S8, LedgerLebel, SegmentName, SegStr1, SegStr2);


                return BudGetReturn;
            }
            else
            {
                return 0;
            }
        }

    }
}