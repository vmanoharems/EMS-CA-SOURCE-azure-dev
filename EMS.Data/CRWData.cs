using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class CRWv2Data
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<String> CRWv2GetCRWData(JSONParameters JSONParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.CRWv2GetCRWData(JSONParameters.callPayload);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
    public class CRWData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<GetBudgetByCompanyForCRW_Result> GetBudgetByCompanyForCRW(string CompanCode, int ProdID, string LO, string EP, int Mode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetBudgetByCompanyForCRW(CompanCode, ProdID,LO,EP,Mode);
                return result.ToList();
            }
        }

        public List<GetCRWRollUp_Result> GetCRWRollUp(int BudgetFileID, int BudgetID, int Prodid)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCRWRollUp(BudgetFileID, BudgetID, Prodid);
                return result.ToList();
            }
        }
        public List<GetCRWRollUpReport_Result> GetCRWRollUpReport(int BudgetFileID, int BudgetID, int Prodid, string FilterJSON)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCRWRollUpReport(BudgetFileID, BudgetID, Prodid, FilterJSON);
                return result.ToList();
            }
        }

        public List<string> GetCRWv2GetCRWData(string callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CRWv2GetCRWData(callParameters).ToList();
                return result;
            }
        }
        //public List<GetCRWDetail_Result> GetCRWDetail(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)
        //    {
        //        var result = DBContext.GetCRWDetail(CID, BudgetID, BudgetFileID, BudgetCategoryID);
        //        return result.ToList();
        //    }
        //}


        public List<InsertUpdateCRWNew_Result> InsertUpdateCRWNew(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue
           , string Changes, int COAID, string ModeType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.InsertUpdateCRWNew(BudgetID, BudgetFileID, DetailLevel, SaveValue,Changes, COAID, ModeType);
                return result.ToList();
            }
        }

        public List<GetCRWNotesNew_Result> GetCRWNotesNew(int COAID, int BudgetID, int BudgetFileID, int ProdID, int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCRWNotesNew(COAID, BudgetID,BudgetFileID,ProdID,UserID);
                return result.ToList();
            }
        }
        public List<SaveCRWNotes_Result> SaveCRWNotes(int COAID, int BudgetID, int BudgetFileID , int UserID, string Note, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.SaveCRWNotes(COAID, BudgetID, BudgetFileID, UserID, Note, ProdID);
                return result.ToList();
            }
        }
       
        public int UpdateCRWNotes(int CRWNotesID, string Status)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    // CAEntities DBContext = new CAEntities();
                    var result = DBContext.UpdateCRWNotes(
                        CRWNotesID, Status

                           ).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetPODetailListCRW_Result> GetPODetailListCRW(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID,int ProdID, string AccountNumber)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPODetailListCRW(CID, BudgetID, BudgetFileID, BudgetCategoryID,ProdID, AccountNumber);
                return result.ToList();
            }
        }

        public List<GetInvoiceDetailListCRW_Result> GetInvoiceDetailListCRW(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID, int ProdID, string AccountNumber)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetInvoiceDetailListCRW(CID, BudgetID, BudgetFileID, BudgetCategoryID, ProdID, AccountNumber);
                return result.ToList();
            }
        }

        public List<GetJEDetailListCRW_Result> GetJEDetailListCRW(int CID,int ProdID, string AccountNumber)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetJEDetailListCRW(CID,ProdID, AccountNumber);
                return result.ToList();
            }
        }

        public List<GetAccountForCRWFromBudget_Result> GetAccountForCRWFromBudget(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetAccountForCRWFromBudget(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetLocationForCRWFromBudget_Result> GetLocationForCRWFromBudget(int ProdID, string CO)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetLocationForCRWFromBudget(ProdID, CO);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetEpisodeForCRWFromBudget_Result> GetEpisodeForCRWFromBudget(int ProdID, string CO, string LO)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetEpisodeForCRWFromBudget(ProdID, CO, LO);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<DeleteCRWNotes_Result> DeleteCRWNotes(int COAID, int BudgetID, int BudgetFileID, int ProdID, int UserID, int NotesID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.DeleteCRWNotes(COAID, BudgetID, BudgetFileID,ProdID, UserID ,NotesID);
                return result.ToList();
            }
        }

        public List<GetDetailLevelAccountCRW_Result> GetDetailLevelAccountCRW(int ProdID, string AccountCode, int Mode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetDetailLevelAccountCRW(ProdID,AccountCode,Mode);
                return result.ToList();
            }
        }

        public List<GetSetForCRW_Result> GetSetForCRW(int COAID, int BudgetFileID, int BudgetID, int Prodid)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetSetForCRW(COAID,BudgetFileID, BudgetID,Prodid);
                return result.ToList();
            }
        }

        public List<GetSeriesForCRW_Result> GetSeriesForCRW(int COAID, int Setid, int BudgetFileID, int BudgetID, int Prodid)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetSeriesForCRW(COAID, Setid ,BudgetFileID , BudgetID , Prodid);
                return result.ToList();
            }
        }

        public List<CRWBudgetAmountRollUp_Result> CRWBudgetAmountRollUp(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CRWBudgetAmountRollUp(COAID, BudgetID, BudgetFileID,Amount);
                return result.ToList();
            }
        }


        public List<CRWBudgetAmountDistribution_Result> CRWBudgetAmountDistribution(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CRWBudgetAmountDistribution(COAID, BudgetID, BudgetFileID, Amount);
                return result.ToList();
            }
        }

        public List<CRWBudgetAmountDistributionAfterL2_Result> CRWBudgetAmountDistributionAfterL2(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CRWBudgetAmountDistributionAfterL2(COAID, BudgetID, BudgetFileID, Amount);
                return result.ToList();
            }
        }

        public List<UpdateCRWBudget_Result> UpdateCRWBudget(int BudgetID, int BudgetFileID,int DetailLevel, string SaveValue, int COAID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCRWBudget(BudgetID, BudgetFileID,DetailLevel, SaveValue, COAID);
                return result.ToList();
            }
        }


        public List<UpdateCRWEFC_Result> UpdateCRWEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue
         , string Changes, int COAID, string ModeType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCRWEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
                return result.ToList();
            }
        }


        public List<UpdateCRWETC_Result> UpdateCRWETC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue
       , string Changes, int COAID, string ModeType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCRWETC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
                return result.ToList();
            }
        }

        public List<UpdateCRWSetBudget_Result> UpdateCRWSetBudget(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, int COAID, int SetID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCRWSetBudget(BudgetID, BudgetFileID, DetailLevel, SaveValue, COAID, SetID);
                return result.ToList();
            }
        }

        public List<UpdateCRWSetEFC_Result> UpdateCRWSetEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue
        , string Changes, int COAID, int SetID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCRWSetEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, SetID);
                return result.ToList();
            }
        }

        public List<UpdateCRWSetETC_Result> UpdateCRWSetETC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue
      , string Changes, int COAID, int SetID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCRWSetETC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, SetID);
                return result.ToList();
            }
        }

        public List<UpdateCRWBudgetBlank_Result> UpdateCRWBudgetBlank(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, int COAID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCRWBudgetBlank(BudgetID, BudgetFileID, DetailLevel, SaveValue, COAID);
                return result.ToList();
            }
        }

        public List<UpdateBlankEFC_Result> UpdateBlankEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue
        , string Changes, int COAID, string ModeType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateBlankEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
                return result.ToList();
            }
        }

        public List<CRWLockRow_Result> CRWLockRow(int COAID,int BudgetID, int BudgetFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CRWLockRow(COAID,BudgetID, BudgetFileID);
                return result.ToList();
            }
        }


        public List<CheckForSetSegment_Result> CheckForSetSegment(int ProdID, string Type)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CheckForSetSegment(ProdID, Type);
                return result.ToList();
            }
        }


        public List<CheckForSegment_Result> CheckForSegment(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CheckForSegment(ProdID);
                return result.ToList();
            }
        }
    }
}
