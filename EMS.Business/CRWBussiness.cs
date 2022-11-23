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
    public class CRWv2Bussiness
    {
        CRWv2Data DataContext = new CRWv2Data();
        public List<String> CRWv2GetCRWData(JSONParameters JSONParameters)
        {
            try
            {
                var result = DataContext.CRWv2GetCRWData(JSONParameters);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
    public class CRWBussiness
    {
        CRWData DataContext = new CRWData();
        public List<GetBudgetByCompanyForCRW_Result> GetBudgetByCompanyForCRW(string CompanCode, int ProdID, string LO, string EP, int Mode)
        {
            var result = DataContext.GetBudgetByCompanyForCRW(CompanCode, ProdID,LO,EP,Mode);
            return result;
        }

        public List<GetCRWRollUp_Result> GetCRWRollUp(int BudgetFileID, int BudgetID, int Prodid)
        {
            var result = DataContext.GetCRWRollUp(BudgetFileID, BudgetID, Prodid);
            return result;
        }
        public List<GetCRWRollUpReport_Result> GetCRWRollUpReport(int BudgetFileID, int BudgetID, int Prodid, string FilterJSON)
        {
            var result = DataContext.GetCRWRollUpReport(BudgetFileID, BudgetID, Prodid, FilterJSON);
            return result;
        }

        public List<string> GetCRWv2GetCRWData(string callParameters)
        {
            var result = DataContext.GetCRWv2GetCRWData(callParameters);
            return result;
        }

        //public List<GetCRWDetail_Result> GetCRWDetail(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID)
        //{
        //    var result = DataContext.GetCRWDetail(CID, BudgetID, BudgetFileID, BudgetCategoryID);
        //    return result;
        //}

        public List<InsertUpdateCRWNew_Result> InsertUpdateCRWNew(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, string Changes
            , int COAID, string ModeType)
        {
            var result = DataContext.InsertUpdateCRWNew(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            return result;
        }

        public List<GetCRWNotesNew_Result> GetCRWNotesNew(int COAID, int BudgetID, int BudgetFileID, int ProdID, int UserID)
        {
            var result = DataContext.GetCRWNotesNew(COAID, BudgetID, BudgetFileID, ProdID, UserID);
            return result;
        }
        public List<SaveCRWNotes_Result> SaveCRWNotes(int COAID, int BudgetID, int BudgetFileID,int UserID, string Note, int ProdID)
        {
            var result = DataContext.SaveCRWNotes(COAID, BudgetID, BudgetFileID, UserID, Note, ProdID);
            return result;
        }
        
        public int UpdateCRWNotes(int CRWNotesID, string Status)
        {
            var result = DataContext.UpdateCRWNotes(CRWNotesID,Status);
            return result;
        }

        public List<GetPODetailListCRW_Result> GetPODetailListCRW(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID,int ProdID, string AccountNumber)
        {
            var result = DataContext.GetPODetailListCRW(CID, BudgetID, BudgetFileID, BudgetCategoryID,ProdID, AccountNumber);
            return result;
        }
        public List<GetInvoiceDetailListCRW_Result> GetInvoiceDetailListCRW(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID, int ProdID, string AccountNumber)
        {
            var result = DataContext.GetInvoiceDetailListCRW(CID, BudgetID, BudgetFileID, BudgetCategoryID, ProdID, AccountNumber);
            return result;
        }

        public List<GetJEDetailListCRW_Result> GetJEDetailListCRW(int CID,int ProdID, string AccountNumber)
        {
            var result = DataContext.GetJEDetailListCRW(CID,ProdID, AccountNumber);
            return result;
        }

        public List<GetAccountForCRWFromBudget_Result> GetAccountForCRWFromBudget(int ProdID)
        {
            try
            {
                var result = DataContext.GetAccountForCRWFromBudget(ProdID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<GetLocationForCRWFromBudget_Result> GetLocationForCRWFromBudget(int ProdID, string CO)
        {
            try
            {
                var result = DataContext.GetLocationForCRWFromBudget(ProdID, CO);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<GetEpisodeForCRWFromBudget_Result> GetEpisodeForCRWFromBudget(int ProdID, string CO,string LO)
        {
            try
            {
                var result = DataContext.GetEpisodeForCRWFromBudget(ProdID, CO,LO);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<DeleteCRWNotes_Result> DeleteCRWNotes(int COAID, int BudgetID, int BudgetFileID, int ProdID, int UserID, int NotesID)
        {
            var result = DataContext.DeleteCRWNotes(COAID, BudgetID,BudgetFileID, ProdID, UserID ,NotesID);
            return result;
        }

        public List<GetDetailLevelAccountCRW_Result> GetDetailLevelAccountCRW(int ProdID, string AccountCode, int Mode)
        {
            var result = DataContext.GetDetailLevelAccountCRW(ProdID, AccountCode,Mode);
            return result;
        }

        public List<GetSetForCRW_Result> GetSetForCRW(int COAID, int BudgetFileID, int BudgetID, int Prodid)
        {
            var result = DataContext.GetSetForCRW(COAID,BudgetFileID,BudgetID,Prodid);
            return result;
        }

        public List<GetSeriesForCRW_Result> GetSeriesForCRW(int COAID, int Setid, int BudgetFileID, int BudgetID, int Prodid)
        {
            var result = DataContext.GetSeriesForCRW(COAID, Setid ,BudgetFileID , BudgetID , Prodid);
            return result;
        }

        public List<CRWBudgetAmountRollUp_Result> CRWBudgetAmountRollUp(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            var result = DataContext.CRWBudgetAmountRollUp(COAID, BudgetID, BudgetFileID,Amount);
            return result;
        }

        public List<CRWBudgetAmountDistribution_Result> CRWBudgetAmountDistribution(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            var result = DataContext.CRWBudgetAmountDistribution(COAID, BudgetID, BudgetFileID, Amount);
            return result;
        }

        public List<CRWBudgetAmountDistributionAfterL2_Result> CRWBudgetAmountDistributionAfterL2(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            var result = DataContext.CRWBudgetAmountDistributionAfterL2(COAID, BudgetID, BudgetFileID, Amount);
            return result;
        }

        public List<UpdateCRWBudget_Result> UpdateCRWBudget(int BudgetID, int BudgetFileID,int DetailLevel, string SaveValue,int COAID)
        {
            var result = DataContext.UpdateCRWBudget(BudgetID, BudgetFileID,DetailLevel, SaveValue, COAID);
            return result;
        }

        public List<UpdateCRWEFC_Result> UpdateCRWEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, string Changes
          , int COAID, string ModeType)
        {
            var result = DataContext.UpdateCRWEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            return result;
        }

        public List<UpdateCRWETC_Result> UpdateCRWETC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, string Changes
        , int COAID, string ModeType)
        {
            var result = DataContext.UpdateCRWETC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            return result;
        }

        public List<UpdateCRWSetBudget_Result> UpdateCRWSetBudget(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, int COAID, int SetID)
        {
            var result = DataContext.UpdateCRWSetBudget(BudgetID, BudgetFileID, DetailLevel, SaveValue, COAID, SetID);
            return result;
        }

        public List<UpdateCRWSetEFC_Result> UpdateCRWSetEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, string Changes
         , int COAID, int SetID)
        {
            var result = DataContext.UpdateCRWSetEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, SetID);
            return result;
        }

        public List<UpdateCRWSetETC_Result> UpdateCRWSetETC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, string Changes
       , int COAID, int SetID)
        {
            var result = DataContext.UpdateCRWSetETC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, SetID);
            return result;
        }

        public List<UpdateCRWBudgetBlank_Result> UpdateCRWBudgetBlank(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, int COAID)
        {
            var result = DataContext.UpdateCRWBudgetBlank(BudgetID, BudgetFileID, DetailLevel, SaveValue, COAID);
            return result;
        }

        public List<UpdateBlankEFC_Result> UpdateBlankEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, string Changes
        , int COAID, string ModeType)
        {
            var result = DataContext.UpdateBlankEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            return result;
        }

        public List<CRWLockRow_Result> CRWLockRow(int COAID, int BudgetID, int BudgetFileID)
        {
            var result = DataContext.CRWLockRow(COAID,BudgetID, BudgetFileID);
            return result;
        }

        public List<CheckForSetSegment_Result> CheckForSetSegment(int ProdID, string Type)
        {
            var result = DataContext.CheckForSetSegment(ProdID, Type);
            return result;
        }

        public List<CheckForSegment_Result> CheckForSegment(int ProdID)
        {
            var result = DataContext.CheckForSegment(ProdID);
            return result;
        }
    }
}
