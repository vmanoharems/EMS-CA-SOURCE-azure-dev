using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using EMS.Entity;
using EMS.Business;

using Newtonsoft;
using Newtonsoft.Json;

using EMS.Controllers;
using System.Text;

namespace EMS.API
{
    //[Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/Ledger")]
    public class LedgerController : ApiController
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

        //[AllowAnonymous]
        [Route("SaveCompnayAccounts")]
        [HttpPost]
        public int SaveCompnayAccounts(List<AccountCreationCompany> ObjACC)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.SaveCompnayAccounts(ObjACC);
            }
            else
            {

                return 0;
            }
        }
        // [AllowAnonymous]
        [Route("InsertUpdateAccounts")]
        [HttpPost]

        public int InsertUpdateAccounts(List<TblAccount> TA)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.InsertUpdateAccounts(TA);
            }
            else
            {
                return 0;
            }
        }
        // [AllowAnonymous]
        [Route("CheckLedgerExistance")]
        [HttpPost]
        public List<CheckLedgerExistance_Result> CheckLedgerExistance(string DetailCode, int ParentId, int Sublevel)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.CheckLedgerExistance(DetailCode, ParentId, Sublevel);
            }
            else
            {
                List<CheckLedgerExistance_Result> n = new List<CheckLedgerExistance_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GetTblAccountDetailsByCategory")]
        [HttpPost]
        public List<GetTblAccountDetailsByCategory_Result> GetTblAccountDetailsByCategory(int ProdId, string Category)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetTblAccountDetailsByCategory(ProdId, Category);
            }
            else
            {
                List<GetTblAccountDetailsByCategory_Result> n = new List<GetTblAccountDetailsByCategory_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GetCompanyDetailForAccount")]
        [HttpPost]
        public List<GetCompanyDetailForAccount_Result> GetCompanyDetailForAccount(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetCompanyDetailForAccount(ProdId);
            }
            else
            {
                List<GetCompanyDetailForAccount_Result> n = new List<GetCompanyDetailForAccount_Result>();
                return n;
            }

        }
        //[AllowAnonymous]
        [Route("GetAccountTypeForGL")]
        [HttpGet]
        public List<GetAccountTypeForGL_Result> GetAccountTypeForGL(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetAccountTypeForGL(ProdId);
            }
            else
            {
                List<GetAccountTypeForGL_Result> n = new List<GetAccountTypeForGL_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetBudgetCategoryForGL")]
        [HttpGet]
        public List<GetBudgetCategoryForGL_Result> GetBudgetCategoryForGL(int Budgetfileid, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetBudgetCategoryForGL(Budgetfileid, ProdID);
            }
            else
            {
                List<GetBudgetCategoryForGL_Result> n = new List<GetBudgetCategoryForGL_Result>();
                return n;
            }
        }

        //[AllowAnonymous]
        [Route("GetBudgetAccountForGL")]
        [HttpGet]
        public List<GetBudgetAccountForGL_Result> GetBudgetAccountForGL(int Budgetfileid, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetBudgetAccountForGL(Budgetfileid, ProdID);
            }
            else
            {
                List<GetBudgetAccountForGL_Result> n = new List<GetBudgetAccountForGL_Result>();
                return n;
            }
        }

        //[AllowAnonymous]
        [Route("GetBudgetDetailForGL")]
        [HttpGet]
        public List<GetBudgetDetailForGL_Result> GetBudgetDetailForGL(int Budgetfileid, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetBudgetDetailForGL(Budgetfileid, ProdID);
            }
            else
            {
                List<GetBudgetDetailForGL_Result> n = new List<GetBudgetDetailForGL_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GetAllDetailOfTblAccount")]
        [HttpPost]
        public List<GetAllDetailOfTblAccount_Result> GetAllDetailOfTblAccount(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetAllDetailOfTblAccount(ProdId);
            }
            else
            {
                List<GetAllDetailOfTblAccount_Result> n = new List<GetAllDetailOfTblAccount_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GetAccountDetailByProdId")]
        [HttpPost]
        public List<GetAccountDetailByProdId_Result> GetAccountDetailByProdId(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetAccountDetailByProdId(ProdId);
            }
            else
            {
                List<GetAccountDetailByProdId_Result> n = new List<GetAccountDetailByProdId_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GenerateCOA")]
        [HttpPost]
        public void GenerateCOA(GenerateCOA objCOA)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                BusinessContext.GenerateCOA(objCOA);
            }
        }
        // [AllowAnonymous]
        [Route("GetCOAbyProdId")]
        [HttpPost]
        public List<GetCOAbyProdId_Result> GetCOAbyProdId(int ProdId, string COAString)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetCOAbyProdId(ProdId, COAString);
            }
            else
            {
                List<GetCOAbyProdId_Result> n = new List<GetCOAbyProdId_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GetLedgerDetailByProdId")]
        [HttpPost]
        public List<GetLedgerDetailByProdId_Result> GetLedgerDetailByProdId(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetLedgerDetailByProdId(ProdId);
            }
            else
            {
                List<GetLedgerDetailByProdId_Result> n = new List<GetLedgerDetailByProdId_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetCOAListByCompany")]
        [HttpPost]
        public List<GetCOAListByCompany_Result> GetCOAListByCompany(int ProdId, string CodeString)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetCOAListByCompany(ProdId, CodeString);
            }
            else
            {
                List<GetCOAListByCompany_Result> n = new List<GetCOAListByCompany_Result>();
                return n;
            }
        }



        // [AllowAnonymous]
        [Route("InsertupdateCOAManual")]
        [HttpPost]
        public int InsertupdateCOAManual(COA _COA)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.InsertupdateCOAManual(_COA);
            }
            else
            {
                return 0;
            }
        }

        // [AllowAnonymous]
        [Route("GetTransactionNumber")]
        [HttpPost]
        public List<GetTransactionNumber_Result> GetTransactionNumber(int ProdId, int CreatedBy)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetTransactionNumber(ProdId, CreatedBy);
            }
            else
            {
                List<GetTransactionNumber_Result> nn = new List<GetTransactionNumber_Result>();
                return nn;
            }
        }
        // [AllowAnonymous]
        [Route("GetCOABySegmentPosition")]
        [HttpPost]
        public List<GetCOABySegmentPosition_Result> GetCOABySegmentPosition(string COACode, int ProdId, int SegmentPosition)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetCOABySegmentPosition(COACode, ProdId, SegmentPosition);
            }
            else
            {
                List<GetCOABySegmentPosition_Result> n = new List<GetCOABySegmentPosition_Result>();
                return n;
            }
        }


        [Route("GetCOABySegmentPosition1")]
        [HttpPost]
        public List<GetCOABySegmentPosition1_Result> GetCOABySegmentPosition1(string COACode, int ProdId, int SegmentPosition)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetCOABySegmentPosition1(COACode, ProdId, SegmentPosition);
            }
            else
            {
                List<GetCOABySegmentPosition1_Result> n = new List<GetCOABySegmentPosition1_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("SaveJE")]
        [HttpPost]
        public int SaveJE(JEClass ObjJE)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.SaveJE(ObjJE);
            }
            else
            {
                return 0;
            }
        }
        // [AllowAnonymous]
        [Route("GetJournalEntryList")]
        [HttpPost]
        public List<GetJournalEntryList_Result> GetJournalEntryList(int ProdId, string AuditStatus)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJournalEntryList(ProdId, AuditStatus);
            }
            else
            {
                List<GetJournalEntryList_Result> n = new List<GetJournalEntryList_Result>();
                return n;
            }
        }

        [Route("GetClosePeriodDeomJE")]
        [HttpGet]
        public List<GetClosePeriodDeomJE_Result> GetClosePeriodDeomJE(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetClosePeriodDeomJE(ProdID);
            }
            else
            {
                List<GetClosePeriodDeomJE_Result> n = new List<GetClosePeriodDeomJE_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetStartEndPeriodByCompanyId")]
        [HttpPost]
        public List<GetStartEndPeriodByCompanyId_Result> GetStartEndPeriodByCompanyId(int CompanyID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetStartEndPeriodByCompanyId(CompanyID);
            }
            else
            {
                List<GetStartEndPeriodByCompanyId_Result> n = new List<GetStartEndPeriodByCompanyId_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("InsertUpdateClosePeriod")]
        [HttpPost]

        public int InsertUpdateClosePeriod(ClosePeriod _Close)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.InsertUpdateClosePeriod(_Close);
            }
            else
            {
                return 0;
            }
        }


        // [AllowAnonymous]
        [Route("GetJEDetailByJEId")]
        [HttpPost]
        public List<GetJEDetailByJEId_Result> GetJEDetailByJEId(int JournalEntryId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJEDetailByJEId(JournalEntryId);
            }
            else
            {
                List<GetJEDetailByJEId_Result> n = new List<GetJEDetailByJEId_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("DeleteJournalEntryDetailById")]
        [HttpPost]
        public void DeleteJournalEntryDetailById(string JournalEntryDetailId, string Type)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                BusinessContext.DeleteJournalEntryDetailById(JournalEntryDetailId, Type);
            }
        }

        // [AllowAnonymous]
        [Route("GetJournalEntryDetailTransValue")]
        [HttpPost]
        public List<GetJournalEntryDetailTransValue_Result> GetJournalEntryDetailTransValue(int journalEntryId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJournalEntryDetailTransValue(journalEntryId);
            }
            else
            {
                List<GetJournalEntryDetailTransValue_Result> n = new List<GetJournalEntryDetailTransValue_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GetJournalEntryDetailByStatus")]
        [HttpPost]
        public List<GetJournalEntryDetailByStatus_Result> GetJournalEntryDetailByStatus(int ProdId, int StartTransaction, int EndTransaction)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJournalEntryDetailByStatus(ProdId, StartTransaction, EndTransaction);
            }
            else
            {
                List<GetJournalEntryDetailByStatus_Result> n = new List<GetJournalEntryDetailByStatus_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GetJEDetailForAdjutment")]
        [HttpPost]
        public List<GetJEDetailForAdjutment_Result> GetJEDetailForAdjutment(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJEDetailForAdjutment(ProdId);
            }
            else
            {
                List<GetJEDetailForAdjutment_Result> n = new List<GetJEDetailForAdjutment_Result>();
                return n;
            }
        }
        //  [AllowAnonymous]
        [Route("UpdateJEDDetailByType")]
        [HttpPost]
        public int UpdateJEDDetailByType(UpdateJournalEntry UPE)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.UpdateJEDDetailByType(UPE);
            }
            else
            {
                return 0;
            }
        }

        // [AllowAnonymous]
        [Route("GetClosePeriodStatus")]
        [HttpPost]
        public List<GetClosePeriodStatus_Result> GetClosePeriodStatus(int CompanyId, int ClosePeriodID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetClosePeriodStatus(CompanyId, ClosePeriodID);
            }
            else
            {
                List<GetClosePeriodStatus_Result> n = new List<GetClosePeriodStatus_Result>();
                return n;
            }
        }
        //[AllowAnonymous]
        //[Route("GetListForTrialBalance")]
        //[HttpPost]
        //public List<GetListForTrialBalance_Result> GetListForTrialBalance(TrailBalanceList _TB)
        //{
        //    LedgerBusiness BusinessContext = new LedgerBusiness();
        //    return BusinessContext.GetListForTrialBalance(_TB);

        //}

        //  [AllowAnonymous]
        [Route("UpdateJournalEntryStatusById")]
        [HttpPost]
        public List<UpdateJournalEntryStatusById_Result> UpdateJournalEntryStatusById(string JEId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.UpdateJournalEntryStatusById(JEId);
            }
            else
            {
                List<UpdateJournalEntryStatusById_Result> n = new List<UpdateJournalEntryStatusById_Result>();
                return n;

            }
        }

        // [AllowAnonymous]
        [Route("DeleteTblAccountById")]
        [HttpPost]
        public int DeleteTblAccountById(int AccountId, string SegmentType)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.DeleteTblAccountById(AccountId, SegmentType);
            }
            else
            {
                return 0;
            }
        }
        // [AllowAnonymous]
        [Route("GetJEListForDistribution")]
        [HttpPost]
        public List<GetJEListForDistribution_Result> GetJEListForDistribution(int prodId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJEListForDistribution(prodId);
            }
            else
            {
                List<GetJEListForDistribution_Result> n = new List<GetJEListForDistribution_Result>();
                return n;
            }

        }
        // [AllowAnonymous]
        [Route("UpdateCOADescriptionById")]
        [HttpPost]
        public int UpdateCOADescriptionById(int COAId, string Description)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.UpdateCOADescriptionById(COAId, Description);
            }
            else
            {
                return 0;
            }
        }
        // [AllowAnonymous]
        [Route("GetDetailAccountNoParent")]
        [HttpPost]
        public List<GetDetailAccountNoParent_Result> GetDetailAccountNoParent(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetDetailAccountNoParent(ProdId);
            }
            else
            {
                List<GetDetailAccountNoParent_Result> n = new List<GetDetailAccountNoParent_Result>();
                return n;
            }
        }
        // [AllowAnonymous]
        [Route("GeteverseJEDetail")]
        [HttpPost]
        public int GeteverseJEDetail(int JournalEntryId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GeteverseJEDetail(JournalEntryId);
            }
            else
            {
                return 0;
            }
        }



        // [AllowAnonymous]
        [Route("GetListForTrailBalance")]
        [HttpPost]
        public List<GetListForTrailBalance_Result> GetListForTrailBalance(TrailBalanceListNew _TBNew)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetListForTrailBalance(_TBNew);
            }
            else
            {
                List<GetListForTrailBalance_Result> n = new List<GetListForTrailBalance_Result>();
                return n;
            }

        }
        [Route("GetJEntryByJEId")]
        [HttpPost]
        public List<GetJEntryByJEId_Result> GetJEntryByJEId(int JournalEntryId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJEntryByJEId(JournalEntryId);
            }
            else
            {
                List<GetJEntryByJEId_Result> n = new List<GetJEntryByJEId_Result>();
                return n;
            }
        }
        [Route("DeleteJEandJEDetail")]
        [HttpPost]
        public void DeleteJEandJEDetail(int JournalEntryId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                BusinessContext.DeleteJEandJEDetail(JournalEntryId);
            }

        }
        [Route("GetJEDetailFilter")]
        [HttpPost]
        public List<GetJEDetailFilter_Result> GetJEDetailFilter(JEFilter JEF)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetJEDetailFilter(JEF);
            }
            else
            {
                List<GetJEDetailFilter_Result> n = new List<GetJEDetailFilter_Result>();
                return n;
            }
        }
        [Route("GetCOABySegmentNumber")]
        [HttpPost]
        public List<GetCOABySegmentNumber_Result> GetCOABySegmentNumber(int ProdId, int Segment)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetCOABySegmentNumber(ProdId, Segment);
            }
            else
            {
                List<GetCOABySegmentNumber_Result> n = new List<GetCOABySegmentNumber_Result>();
                return n;
            }
        }

        [Route("GetTBByEP")]
        [HttpPost]
        public List<GetTBByEP_Result> GetTBByEP(TrailBalanceList _TB)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetTBByEP(_TB);
            }
            else
            {
                List<GetTBByEP_Result> n = new List<GetTBByEP_Result>();
                return n;
            }
        }
        [Route("GetTBByLevel1Ep")]
        [HttpPost]
        public List<GetTBByLevel1Ep_Result> GetTBByLevel1Ep(TrailBalanceList _TB)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetTBByLevel1Ep(_TB);
            }
            else
            {
                List<GetTBByLevel1Ep_Result> n = new List<GetTBByLevel1Ep_Result>();
                return n;
            }
        }
        [Route("GetTBByLevel1NonEp")]
        [HttpPost]
        public List<GetTBByLevel1NonEp_Result> GetTBByLevel1NonEp(TrailBalanceList _TB)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.GetTBByLevel1NonEp(_TB);
            }
            else
            {
                List<GetTBByLevel1NonEp_Result> n = new List<GetTBByLevel1NonEp_Result>();
                return n;
            }
        }
        [Route("PostedCollection")]
        [HttpPost]
        public HttpResponseMessage PostCollection(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                //Data.UtilityData utility = new Data.UtilityData();
                //CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                //using (System.Data.Entity.DbContextTransaction dbContextTransaction = DBContext.Database.BeginTransaction())
                //{ }
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Not needed
                string combindedString = "";

                var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                int ProdID = Convert.ToInt32(Payload.ProdID.ToString());
                int PostingUserID = Convert.ToInt32(Payload.PostingUserID.ToString());
                string PostingType = Payload.PostingType.ToString();
                LedgerBusiness LedgerContext = new LedgerBusiness();

                int PostedCollectionID = LedgerContext.PostedCollectionInit(PostingUserID, PostingType, ProdID);
                string csvIDs = Payload.JEID; // JEIDs for JE, InvoiceID for Invoices, PCEnvelopeID for Petty Cash

                switch (PostingType)
                {
                    case "JE":
                        // JE returns List<UpdateJournalEntryStatusById>
                        List<UpdateJournalEntryStatusById_Result> JEIDList = LedgerContext.UpdateJournalEntryStatusById(csvIDs);
                        string LegacyReturn = JsonConvert.SerializeObject(JEIDList); // We need a value that is backwards compatible with the existing posting process

                        string jsonJEID = "[";
                        JEIDList.ForEach(delegate (UpdateJournalEntryStatusById_Result res)
                        {
                            jsonJEID += $"{res.JournalEntryId.ToString()},";
                        }
                        );
                        jsonJEID = jsonJEID.TrimEnd(',') + "]";

                        PostedCollectionID = LedgerContext.PostedCollectionTransactions(PostedCollectionID, jsonJEID, ProdID);
                        Payload.ReturnLegacy = LegacyReturn;
                        Payload.PostedCollectionID = PostedCollectionID;
                        break;
                    case "AP":
                        // Invoice posting returns List<string>
                        POInvoiceBussiness POInvoiceContext = new POInvoiceBussiness();
                        List<string> APLegacyReturn = POInvoiceContext.UpdateInvoiceStatus(csvIDs, PostingUserID, ProdID);
                        string jsonJEID_AP = "[";
                        APLegacyReturn.ForEach(delegate (string csvInvoiceIDplusJEID)
                        {
                            string[] A_csv = csvInvoiceIDplusJEID.Split(',');
                            jsonJEID_AP += $"{A_csv[2]},"; // Pull the second item from the csv, which is the JEID
                        });
                        jsonJEID_AP = jsonJEID_AP.TrimEnd(',') + "]";

                        PostedCollectionID = LedgerContext.PostedCollectionTransactions(PostedCollectionID, jsonJEID_AP, ProdID);
                        Payload.ReturnLegacy = JsonConvert.SerializeObject(APLegacyReturn);
                        Payload.PostedCollectionID = PostedCollectionID;
                        break;
                    case "PC":
                        // PC Posting returns <updatePCEnvelopeStatus_Result>
                        POInvoiceBussiness PCContext = new POInvoiceBussiness();
                        List<updatePCEnvelopeStatus_Result> PCList = PCContext.updatePCEnvelopeStatus(csvIDs);
                        string PCLegacyReturn = JsonConvert.SerializeObject(PCList);

                        string jsonJEID_PC = "[";
                        PCList.ForEach(delegate (updatePCEnvelopeStatus_Result res)
                        {
                            jsonJEID_PC += $"{res.JEID.ToString()}";
                        });
                        jsonJEID_PC = jsonJEID_PC.TrimEnd(',') + "]";

                        PostedCollectionID = LedgerContext.PostedCollectionTransactions(PostedCollectionID, jsonJEID_PC, ProdID);
                        Payload.ReturnLegacy = PCLegacyReturn;
                        Payload.PostedCollectionID = PostedCollectionID;
                        break;
                    default:
                        break;
                }
                combindedString = Payload.ToString();

                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
                return response;
            }
            else
            {
                return null;
            }
        }
        [Route("TransactionListbyAccountCode")]
        [HttpPost]
        public HttpResponseMessage TransactionListbyAccountCode(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                LedgerBusiness BusinessContext = new LedgerBusiness();
                try
                {
                    var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                    int ProdID = Convert.ToInt32(Payload.ProdID.ToString());
                    string AccountCodes = Payload.AccountCodes.ToString();

                    var varResult = BusinessContext.TransactionListbyAccountCode(ProdID, AccountCodes);
                    string combindedString = "";

                    combindedString = string.Join("", varResult.ToArray());
                    //combindedString = "{  \"dtData\": " + combindedString + "}"; //Format for datatables js library

                    var response = this.Request.CreateResponse(HttpStatusCode.OK);
                    response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
                    return response;
                }
                catch (Exception ex)
                {
                    var response = this.Request.CreateResponse(HttpStatusCode.InternalServerError);
                    response.Content = new StringContent(ex.ToString() + ConnnectionString.GlobalValue);
                    return response;
                }
            }
            else
            {
                return null;
            }
        }
        [Route("PostCollectionList")]
        [HttpPost]
        public List<PostCollectionList_Result> PostCollectionList(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                int ProdID = Convert.ToInt32(Payload.ProdID.ToString());
                int UserID = Convert.ToInt32(Payload.UserID.ToString());
                string PostingType = Payload.PostingType.ToString();

                LedgerBusiness BusinessContext = new LedgerBusiness();
                return BusinessContext.PostCollectionList(ProdID, UserID, PostingType);
            }
            else
            {
                List<PostCollectionList_Result> n = new List<PostCollectionList_Result>();
                return n;
            }
        }

    }
}