using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class Budgetv2Operation
    {
        Data.UtilityData utility = new Data.UtilityData();

    }
    public class BudgetOperation
    {
        Data.UtilityData utility = new Data.UtilityData();
        public int InsertUpdateBudget(Budget _Budget)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.InsertUpdateBudget(_Budget.BudgetId, _Budget.Prodid, _Budget.BudgetName, _Budget.createdby, _Budget.Description).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public List<GetBudgetList_Result> GetBudgetList(int Prodid)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetBudgetList(Prodid);
                return result.ToList();
            }
        }
        public List<Budgetv2List_Result> Budgetv2List(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                return DBContext.Budgetv2List(ProdID).ToList();
            }
        }

        public List<GetBudgetDetail_Result> GetBudgetDetail(int BudgetID, int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            //using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetBudgetDetail(BudgetID, UserID);
                return result.ToList();
            }
        }

        public int ImportBudget(int uploadedby, string Action, int LeaveexistingCOA, string CompanCode, int prodid, int Budgetid, string UploadedXML, string S1, string S2, string S3, string S4, string S5, string S6, string S7, string S8, string LedgerLebel, string SegmentName, string SegStr1, string SegStr2)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.InsertBudgetFile(uploadedby, Action, LeaveexistingCOA, CompanCode, prodid, Budgetid, UploadedXML, S1, S2, S3, S4, S5, S6, S7, S8, LedgerLebel, SegmentName, SegStr1, SegStr2).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }

        public List<GetBudgetCategory_Result> GetBudgetCategory(int BudgetFileID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetBudgetCategory(BudgetFileID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetBudgetAccounts_Result> GetBudgetAccounts(int BudgetFileID, int ProdID, string CreateCOA)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetBudgetAccounts(BudgetFileID, ProdID, CreateCOA);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        		
		public List<Budgetv2GetHistory_Result> Budgetv2GetHistoryList(int BudgetId ,int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                return DBContext.Budgetv2GetHistory(BudgetId,ProdID).ToList();
            }
        }

        public List<GetBudgetAccountsNew_Result> GetBudgetAccountsNew(int BudgetFileID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetBudgetAccountsNew(BudgetFileID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetBudgetDetails_Result> GetBudgetDetails(int BudgetFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetBudgetDetails(BudgetFileID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public int BudgetActionStatus(int BudgetID)
        {
            // var CompanyCount = "";
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)
                // using (CAEntities DBContext = new CAEntities())
                {
                    var BudgetCount = DBContext.BudgetActionStatus(BudgetID
                     ).FirstOrDefault();
                    return Convert.ToInt32(BudgetCount);
                }
            }
            catch
            {
                return 0;
            }
        }

        public string UpdateBudgetCategory(BudgetCategoryUpdate _BudgetCategoryUpdate)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var Result = "";

                Result = DBContext.UpdateBudgetCategory(_BudgetCategoryUpdate.BudgetCategoryID, _BudgetCategoryUpdate.Parameter, _BudgetCategoryUpdate.ModifyBy,
                       _BudgetCategoryUpdate.Mode).FirstOrDefault();

                return Result;
            }
        }

        public string UpdateBudgetAccount(BudgetAccountUpdate _BudgetAccountUpdate)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var Result = "";

                Result = DBContext.UpdateBudgetAccount(_BudgetAccountUpdate.BudgetAccountID, _BudgetAccountUpdate.Parameter, _BudgetAccountUpdate.ModifyBy,
                       _BudgetAccountUpdate.Mode).FirstOrDefault();

                return Result;
            }
        }

        public void ProcessBudget(BudgetProcessed _BudgetProcessed)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {

                    DBContext.ProcessBudget(_BudgetProcessed.ActionType, _BudgetProcessed.BudgetFileID, _BudgetProcessed.BudgetID,
                           _BudgetProcessed.createdby);


                }
                catch (Exception ex) { }

            }
        }

        public List<GetAccountNameForBudget_Result> GetAccountNameForBudget(int ProdID, string Classification)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetAccountNameForBudget(ProdID, Classification);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<CheckBudgetInFinalBudget_Result> CheckBudgetInFinalBudget(int BudgetID, int BudgetFileID, int createdby, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.CheckBudgetInFinalBudget(BudgetID, BudgetFileID, createdby, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //public int CheckBudgetInFinalBudget(int BudgetID, int BudgetFileID, int createdby)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)
        //    // using (CAEntities DBContext = new CAEntities())
        //    {
        //        var result = DBContext.CheckBudgetInFinalBudget(BudgetID, BudgetFileID, createdby).FirstOrDefault();
        //        return Convert.ToInt32(result);
        //    }
        //}

        public int CheckCOAForProduction(int ProdID)
        {
            // var CompanyCount = "";
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)
                // using (CAEntities DBContext = new CAEntities())
                {
                    var BudgetCount = DBContext.CheckCOAForProduction(ProdID).FirstOrDefault();
                    return Convert.ToInt32(ProdID);
                }
            }
            catch
            {
                return 0;
            }
        }

        public int AddNewCategorytoBudget(int Budgetfileid, string CategoryNumber, string CategoryDescription,
  string CategoryFringe, string CategoryTotal, int ProdID, int createdby)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.AddNewCategorytoBudget(Budgetfileid, CategoryNumber, CategoryDescription,
  CategoryFringe, CategoryTotal, ProdID, createdby).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }


        public int CreateCOAfromBudgetAccount(string COAString, int Prodid)
        {
            // var CompanyCount = "";
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)
                // using (CAEntities DBContext = new CAEntities())
                {
                    var BudgetCount = DBContext.CreateCOAfromBudgetAccount(COAString, Prodid).FirstOrDefault();
                    return Convert.ToInt32(BudgetCount);
                }
            }
            catch
            {
                return 0;
            }
        }

        public int AddNewAccounttoBudget(int Budgetfileid, string AccountNumber, string AccountDescription,
  string AccountFringe, string AccountTotal, int ProdID, int createdby, string CategoryNumber)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.AddNewAccounttoBudget(Budgetfileid, AccountNumber, AccountDescription,
  AccountFringe, AccountTotal, ProdID, createdby, CategoryNumber).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }

        public int ProceedBudgetFinal(int BudgetID, int BudgetFileID, int createdby, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.ProceedBudgetFinal(BudgetID, BudgetFileID, createdby, ProdID).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }

        //public int CheckBudgetInFinalBudget(int BudgetID,int BudgetFileID, int createdby)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)
        //    // using (CAEntities DBContext = new CAEntities())
        //    {
        //        var result = DBContext.CheckBudgetInFinalBudget(BudgetID,BudgetFileID, createdby).FirstOrDefault();
        //        return Convert.ToInt32(result);
        //    }
        //}

        public int InsertBudgetFileLedger(int uploadedby, int prodid, string UploadedXML)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.InsertBudgetFileLedger(uploadedby, prodid, UploadedXML).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }



        public List<UpdateCodeMaskingCategory_Result> UpdateCodeMaskingCategory(int BudgetFileID, string CategoryNumber, int BudgetCategoryID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.UpdateCodeMaskingCategory(BudgetFileID, CategoryNumber, BudgetCategoryID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<UpdateCodeMaskingAccount_Result> UpdateCodeMaskingAccount(int BudgetFileID, string AccountNumber, int BudgetAccountID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.UpdateCodeMaskingAccount(BudgetFileID, AccountNumber, BudgetAccountID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public int CreateCOAfromBudgetCategoryNew(string BCIString, int BudgetFileID, int Prodid, int CreatedBy)
        {
            // var CompanyCount = "";
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)
                // using (CAEntities DBContext = new CAEntities())
                {
                    var BudgetCount = DBContext.CreateCOAfromBudgetCategoryNew(BCIString, BudgetFileID, Prodid, CreatedBy).FirstOrDefault();
                    return Convert.ToInt32(BudgetCount);
                }
            }
            catch
            {
                return 0;
            }
        }

        public int CreateCOAfromBudgetAccountNew(string BAIString, int BudgetFileID, int Prodid, int CreatedBy)
        {
            // var CompanyCount = "";
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)
                // using (CAEntities DBContext = new CAEntities())
                {
                    var BudgetCount = DBContext.CreateCOAfromBudgetAccountNew(BAIString, BudgetFileID, Prodid, CreatedBy).FirstOrDefault();
                    return Convert.ToInt32(BudgetCount);
                }
            }
            catch
            {
                return 0;
            }
        }


        public int EmptyBudget(int uploadedby, string CompanCode, int prodid, int Budgetid, string S1, string S2, string S3, string S4, string S5, string S6, string S7, string S8, string LedgerLebel, string SegmentName, string SegStr1, string SegStr2)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.EmptyBudget(uploadedby, CompanCode, prodid, Budgetid, S1, S2, S3, S4, S5, S6, S7, S8, LedgerLebel, SegmentName, SegStr1, SegStr2).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public v2CRW_Save_Result v2BudgetCRWOperation(v2BudgetCRW ov2)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            try
            {
                Budgetv2Upsert_Result vBudgetId = new Budgetv2Upsert_Result();
                if (ov2.BudgetID == 0 && ov2.BudgetOrigin == 0)
                {
                    // We're creating a new Budget from scratch
                    vBudgetId = DBContext.Budgetv2Upsert(ov2.BudgetID, ov2.BudgetName, ov2.BudgetDescription, null, ov2.segmentJSON, ov2.UserID, ov2.prodID, false, true).FirstOrDefault();
                }
                else
                {
                    vBudgetId.BudgetID = ov2.BudgetID;
                    //segmentJSON is using for islocked status <<<< THIS IS NOT THE PURPOSE OF segmentJSON
                    if (ov2.Mode < 2) // Mode 2 indicates a CRW save (a non-Budget operation)
                    {
                        vBudgetId = DBContext.Budgetv2Upsert(ov2.BudgetID, ov2.BudgetName, "", null, "", ov2.UserID, ov2.prodID, Convert.ToBoolean(ov2.Mode), true).FirstOrDefault();
                    }
                    // We're creating cloning an existing Budget or updating an existing Budget
                    // We don't need to make an update to the Budget itself. We just need to update the CRW
                    //vBudgetId = DBContext.Budgetv2Upsert(ov2.BudgetID, ov2.BudgetName, ov2.BudgetDescription, ov2.BudgetOrigin, ov2.segmentJSON, ov2.UserID, ov2.prodID, false, true).FirstOrDefault();
                }
                //if (vBudgetId != null)
                return DBContext.v2CRW_Save(vBudgetId.BudgetID, ov2.UserID, ov2.isSave, ov2.prodID, ov2.CRWJSON).FirstOrDefault();
                //else
            }
                catch (Exception ex)
            {
                throw ex;
            }
               
        }
    }
}
