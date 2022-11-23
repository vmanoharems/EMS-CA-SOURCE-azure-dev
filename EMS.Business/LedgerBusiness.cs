using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Data;
using EMS.Entity;
using System.Data;

namespace EMS.Business
{
   
   public class LedgerBusiness
    {
       LedgerData DataContext = new LedgerData();
       public int SaveCompnayAccounts(List<AccountCreationCompany> ObjACC)
       {
           var result = DataContext.SaveCompnayAccounts(ObjACC);
           return result;
       }

       public int InsertUpdateAccounts(List<TblAccount> TA)
       {
           var result = DataContext.InsertUpdateAccounts(TA);
           return result;
       }
       public List<CheckLedgerExistance_Result> CheckLedgerExistance(string DetailCode, int ParentId, int Sublevel)
       {
           var result = DataContext.CheckLedgerExistance(DetailCode, ParentId, Sublevel);
           return result;
       }
       public List<GetTblAccountDetailsByCategory_Result> GetTblAccountDetailsByCategory(int ProdId, string Category)
       {
           var result = DataContext.GetTblAccountDetailsByCategory( ProdId,  Category);
           return result;
       }
       public List<GetCompanyDetailForAccount_Result> GetCompanyDetailForAccount(int ProdId) {

           var result = DataContext.GetCompanyDetailForAccount(ProdId);
           return result;
       
       }
       public List<GetAccountTypeForGL_Result> GetAccountTypeForGL(int ProdId)
       {
           var result = DataContext.GetAccountTypeForGL(ProdId);
           return result;
       }

       public List<GetBudgetCategoryForGL_Result> GetBudgetCategoryForGL(int Budgetfileid, int ProdID)
       {
           var result = DataContext.GetBudgetCategoryForGL(Budgetfileid, ProdID);
           return result;
       }

       public List<GetBudgetAccountForGL_Result> GetBudgetAccountForGL(int Budgetfileid, int ProdID)
       {
           var result = DataContext.GetBudgetAccountForGL(Budgetfileid,ProdID);
           return result;
       }

       public List<GetBudgetDetailForGL_Result> GetBudgetDetailForGL(int Budgetfileid, int ProdID)
       {
           var result = DataContext.GetBudgetDetailForGL(Budgetfileid, ProdID);
           return result;
       }
       public List<GetAllDetailOfTblAccount_Result> GetAllDetailOfTblAccount(int ProdId)
       {
           var result = DataContext.GetAllDetailOfTblAccount(ProdId);
           return result;
       }
        public List<ReportsLedgerCOAJSON_Result> ReportsLedgerCOAJSON(JSONParameters callParameters)
        {
            var result = DataContext.ReportsLedgerCOAJSON(callParameters);
            return result;
        }
       public List<GetAccountDetailByProdId_Result> GetAccountDetailByProdId(int ProdId)
       {
           var result = DataContext.GetAccountDetailByProdId(ProdId);
           return result;
       
       }
       public void GenerateCOA(GenerateCOA objCOA)
       {
           try
           {
               DataContext.GenerateCOA(objCOA);
           }
           catch (Exception ex)
           {

               throw ex;
           }
       }
       public List<GetCOAbyProdId_Result> GetCOAbyProdId(int ProdId, string COAString)
       {
           var result = DataContext.GetCOAbyProdId( ProdId,  COAString);
           return result;
       }
       public List<GetLedgerDetailByProdId_Result> GetLedgerDetailByProdId(int ProdId)
       {
           var result = DataContext.GetLedgerDetailByProdId(ProdId);
           return result;
       }
       public List<GetCOAListByCompany_Result> GetCOAListByCompany(int ProdId, string CodeString)
       {
           var result = DataContext. GetCOAListByCompany( ProdId,  CodeString);
           return result;
       }
       public int InsertupdateCOAManual(COA _COA)
       {
           var result = DataContext.InsertupdateCOAManual(_COA);
           return result;
       }
       public List<GetTransactionNumber_Result> GetTransactionNumber(int ProdId, int CreatedBy)
       {
           var result = DataContext.GetTransactionNumber(ProdId, CreatedBy);
           return result;
       }
       public List<GetCOABySegmentPosition_Result> GetCOABySegmentPosition(string COACode, int ProdId, int SegmentPosition)
       {
           var result = DataContext.GetCOABySegmentPosition( COACode,  ProdId,  SegmentPosition);
           return result;
       }
       public List<GetCOABySegmentPosition1_Result> GetCOABySegmentPosition1(string COACode, int ProdId, int SegmentPosition)
       {
           var result = DataContext.GetCOABySegmentPosition1(COACode, ProdId, SegmentPosition);
           return result;
       }
       public int SaveJE(JEClass ObjJE)
       {
           var result = DataContext.SaveJE(ObjJE);
           return result;
       }
       public List<GetJournalEntryList_Result> GetJournalEntryList(int ProdId, string AuditStatus)
       {
           var result = DataContext.GetJournalEntryList(ProdId, AuditStatus);
           return result;

       }

       public List<GetClosePeriodDeomJE_Result> GetClosePeriodDeomJE(int ProdID)
       {
           var result = DataContext.GetClosePeriodDeomJE(ProdID);
           return result;

       }
   
       public List<GetStartEndPeriodByCompanyId_Result> GetStartEndPeriodByCompanyId(int CompanyID)
       {
           var result = DataContext.GetStartEndPeriodByCompanyId(CompanyID);
           return result;
       }
    
       public int InsertUpdateClosePeriod(ClosePeriod _Close)
       {
           var result = DataContext.InsertUpdateClosePeriod(_Close);
           return result;
       }
     
       public List<GetJEDetailByJEId_Result> GetJEDetailByJEId(int JournalEntryId)
       {
           var result = DataContext.GetJEDetailByJEId(JournalEntryId);
           return result;

       }
       public void DeleteJournalEntryDetailById(string JournalEntryDetailId, string Type)
       {
           DataContext.DeleteJournalEntryDetailById(JournalEntryDetailId, Type);

       }
       public List<GetJournalEntryDetailTransValue_Result> GetJournalEntryDetailTransValue(int journalEntryId)
       {
           var result = DataContext.GetJournalEntryDetailTransValue(journalEntryId);
           return result;
       }
       public List<GetJournalEntryDetailByStatus_Result> GetJournalEntryDetailByStatus(int ProdId, int StartTransaction, int EndTransaction)
       {
           var result = DataContext.GetJournalEntryDetailByStatus( ProdId,  StartTransaction,  EndTransaction);
           return result;

       }
       public List<GetJEDetailForAdjutment_Result> GetJEDetailForAdjutment(int ProdId)
       {
           var result = DataContext.GetJEDetailForAdjutment( ProdId);
           return result;

       }
       public int UpdateJEDDetailByType(UpdateJournalEntry UPE)
       {
           var result = DataContext.UpdateJEDDetailByType(UPE);
           return result;
       }


       public List<GetClosePeriodStatus_Result> GetClosePeriodStatus(int CompanyId, int ClosePeriodID)
       {
           var result = DataContext.GetClosePeriodStatus(CompanyId, ClosePeriodID);
           return result;

       }
       //public List<GetListForTrialBalance_Result> GetListForTrialBalance(TrailBalanceList _TB)
       //{
       //    var result = DataContext.GetListForTrialBalance(_TB);
       //    return result;

       //}
       public List<UpdateJournalEntryStatusById_Result> UpdateJournalEntryStatusById(string JEId)
       {
           var result = DataContext.UpdateJournalEntryStatusById(JEId);
           return result;
       }
       public int DeleteTblAccountById(int AccountId, string SegmentType)
       {
           var result = DataContext.DeleteTblAccountById(AccountId, SegmentType);
           return result;
       }
       public List<GetJEListForDistribution_Result> GetJEListForDistribution(int prodId)
       {
           var result = DataContext.GetJEListForDistribution( prodId);
           return result;
       
       }
       public int UpdateCOADescriptionById(int COAId, string Description)
       {
           var result = DataContext.UpdateCOADescriptionById( COAId,  Description);
           return result;
       
       }
       public List<GetDetailAccountNoParent_Result> GetDetailAccountNoParent(int ProdId)
       {
           var result = DataContext.GetDetailAccountNoParent( ProdId);
           return result;
       }
       public int GeteverseJEDetail(int JournalEntryId)
       {
           var result = DataContext.GeteverseJEDetail( JournalEntryId);
           return result;
           
       }

       //=============New trial balance==============//
       public List<GetListForTrailBalance_Result> GetListForTrailBalance(TrailBalanceListNew _TBNew)
       {
           var result = DataContext.GetListForTrailBalance(_TBNew);
           return result;

       }
       public List<GetJEntryByJEId_Result> GetJEntryByJEId(int JournalEntryId)
       {
           var result = DataContext.GetJEntryByJEId( JournalEntryId);
           return result;
       }
       public void DeleteJEandJEDetail(int JournalEntryId)
       {
            DataContext.DeleteJEandJEDetail( JournalEntryId);
       }
       public List<GetJEDetailFilter_Result> GetJEDetailFilter(JEFilter JEF)
       {
           var result = DataContext.GetJEDetailFilter( JEF);
           return result;
       }
       public List<GetCOABySegmentNumber_Result> GetCOABySegmentNumber(int ProdId, int Segment)
       {
           var result = DataContext.GetCOABySegmentNumber(ProdId, Segment);
           return result;
       }
        public List<GetTBByEP_Result> GetTBByEP(TrailBalanceList _TB)
        {
            var result = DataContext.GetTBByEP( _TB);
            return result;
        }
            public List<GetTBByLevel1Ep_Result> GetTBByLevel1Ep(TrailBalanceList _TB)
        {
            var result = DataContext.GetTBByLevel1Ep( _TB);
            return result;
            }
        public List<GetTBByLevel1NonEp_Result> GetTBByLevel1NonEp(TrailBalanceList _TB)
        {
            var result = DataContext.GetTBByLevel1NonEp(_TB);
            return result;
        }
        public int PostedCollectionInit(int PostedUserID, string PostingType, int ProdID)
        {
            return DataContext.PostedCollectionInit(PostedUserID, PostingType, ProdID);
        }
        public int PostedCollectionTransactions(int CollectionID, string JEIDJSON, int ProdID)
        {
            return DataContext.PostedCollectionTransactions(CollectionID, JEIDJSON, ProdID);
        }
        public List<String> TransactionListbyAccountCode(int ProdID, string AccountCodes)
        {
            try
            {
                List<String> result = DataContext.TransactionListbyAccountCode(ProdID, AccountCodes);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<PostCollectionList_Result> PostCollectionList(int ProdID, int UserID, string PostingType)
        {
            List <PostCollectionList_Result> result = DataContext.PostCollectionList(ProdID, UserID, PostingType);
            return result;
        }
    }
}
