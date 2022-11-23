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
    public class Budgetv2Business
    {
        BudgetOperation DataContext = new BudgetOperation();

    }
    public class BudgetOperationBussiness
   {
       BudgetOperation DataContext = new BudgetOperation();
       public int InsertUpdateBudget(Budget _Budget)
       {
           var result = DataContext.InsertUpdateBudget(_Budget);
           return result;
       }
       public List<GetBudgetList_Result> GetBudgetList(int ProdID)
       {
           var result = DataContext.GetBudgetList(ProdID);
           return result;
       }
        public List<Budgetv2List_Result> Budgetv2List(int ProdID)
        {
            return DataContext.Budgetv2List(ProdID);
        }
          public List<Budgetv2GetHistory_Result> Budgetv2GetHistoryList(int BudgetId ,int ProdID)
        {
            return DataContext.Budgetv2GetHistoryList(BudgetId,ProdID);
        }
       public List<GetBudgetDetail_Result> GetBudgetDetail(int BudgetID,int UserID)
       {
           var result = DataContext.GetBudgetDetail(BudgetID,UserID);
           return result;
       }

       public int ImportBudget(int uploadedby,string Action ,int LeaveexistingCOA ,string CompanCode ,int prodid,int Budgetid,string UploadedXML,string S1,string S2,string S3,string S4,string S5,string S6,string S7,string S8,string LedgerLebel,string SegmentName,string SegStr1,string SegStr2)
       {
           var result = DataContext.ImportBudget(uploadedby, Action, LeaveexistingCOA, CompanCode, prodid, Budgetid, UploadedXML, S1, S2, S3, S4, S5, S6,S7,S8, LedgerLebel, SegmentName, SegStr1, SegStr2);   
           return result;
       }

       public List<GetBudgetCategory_Result> GetBudgetCategory(int BudgetFileID, int ProdID)
       {
           try
           {
               var result = DataContext.GetBudgetCategory(BudgetFileID, ProdID);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }

       public List<GetBudgetAccounts_Result> GetBudgetAccounts(int BudgetFileID, int ProdID, string CreateCOA)
       {
           try
           {
               var result = DataContext.GetBudgetAccounts(BudgetFileID, ProdID, CreateCOA);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }

       public List<GetBudgetAccountsNew_Result> GetBudgetAccountsNew(int BudgetFileID, int ProdID)
       {
           try
           {
               var result = DataContext.GetBudgetAccountsNew(BudgetFileID, ProdID);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }

       public List<GetBudgetDetails_Result> GetBudgetDetails(int BudgetFileID)
       {
           try
           {
               var result = DataContext.GetBudgetDetails(BudgetFileID);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }

       public int BudgetActionStatus(int BudgetID)
       {
           var result = DataContext.BudgetActionStatus(BudgetID);
           return result;
       }

       public string UpdateBudgetCategory(BudgetCategoryUpdate _BudgetCategoryUpdate)
       {
          return DataContext.UpdateBudgetCategory(_BudgetCategoryUpdate);
       }
       public string UpdateBudgetAccount(BudgetAccountUpdate _BudgetAccountUpdate)
       {
           return DataContext.UpdateBudgetAccount(_BudgetAccountUpdate);
       }

       public void ProcessBudget(BudgetProcessed _BudgetProcessed)
       {
           DataContext.ProcessBudget(_BudgetProcessed);
       }

       public List<GetAccountNameForBudget_Result> GetAccountNameForBudget(int ProdID, string Classification)
       {
           try
           {
               var result = DataContext.GetAccountNameForBudget(ProdID,Classification);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }

       public List<CheckBudgetInFinalBudget_Result> CheckBudgetInFinalBudget(int BudgetID, int BudgetFileID, int createdby, int ProdID)
       {
           try
           {
               var result = DataContext.CheckBudgetInFinalBudget(BudgetID, BudgetFileID, createdby, ProdID);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }

       //public int CheckBudgetInFinalBudget(int BudgetID, int BudgetFileID, int createdby)
       //{
       //    var result = DataContext.CheckBudgetInFinalBudget(BudgetID, BudgetFileID, createdby);
       //    return result;
       //}

       public int CheckCOAForProduction(int ProdID)
       {
           var result = DataContext.CheckCOAForProduction(ProdID);
           return result;
       }

       public int AddNewCategorytoBudget(int Budgetfileid, string CategoryNumber, string CategoryDescription,
 string CategoryFringe, string CategoryTotal, int ProdID, int createdby)
       {
           var result = DataContext.AddNewCategorytoBudget(Budgetfileid ,CategoryNumber,CategoryDescription ,
 CategoryFringe ,CategoryTotal ,ProdID,createdby);
           return result;
       }


       public int CreateCOAfromBudgetAccount(string COAString, int Prodid)
       {
           var result = DataContext.CreateCOAfromBudgetAccount(COAString,Prodid);
           return result;
       }

       public int AddNewAccounttoBudget(int Budgetfileid, string AccountNumber, string AccountDescription,
 string AccountFringe, string AccountTotal, int ProdID, int createdby, string CategoryNumber)
       {
           var result = DataContext.AddNewAccounttoBudget(Budgetfileid, AccountNumber, AccountDescription,
 AccountFringe, AccountTotal, ProdID, createdby, CategoryNumber);
           return result;
       }

       public int ProceedBudgetFinal(int BudgetID, int BudgetFileID, int createdby, int ProdID)
       {
           var result = DataContext.ProceedBudgetFinal(BudgetID, BudgetFileID, createdby, ProdID);
           return result;
       }
       //public int CheckBudgetInFinalBudget(int BudgetID,int BudgetFileID, int createdby)
       //{
       //    var result = DataContext.CheckBudgetInFinalBudget(BudgetID,BudgetFileID, createdby);
       //    return result;
       //}

       public int InsertBudgetFileLedger(int uploadedby, int prodid,string UploadedXML)
       {
           var result = DataContext.InsertBudgetFileLedger(uploadedby, prodid, UploadedXML);
           return result;
       }


       public List<UpdateCodeMaskingCategory_Result> UpdateCodeMaskingCategory(int BudgetFileID, string CategoryNumber, int BudgetCategoryID)
       {
           try
           {
               var result = DataContext.UpdateCodeMaskingCategory(BudgetFileID, CategoryNumber, BudgetCategoryID);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }


       public List<UpdateCodeMaskingAccount_Result> UpdateCodeMaskingAccount(int BudgetFileID, string AccountNumber, int BudgetAccountID)
       {
           try
           {
               var result = DataContext.UpdateCodeMaskingAccount(BudgetFileID, AccountNumber, BudgetAccountID);
               return result;
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }

       public int CreateCOAfromBudgetCategoryNew(string BCIString, int BudgetFileID, int Prodid, int CreatedBy)
       {
           var result = DataContext.CreateCOAfromBudgetCategoryNew(BCIString, BudgetFileID, Prodid,CreatedBy);
           return result;
       }

       public int CreateCOAfromBudgetAccountNew(string BAIString, int BudgetFileID, int Prodid, int CreatedBy)
       {
           var result = DataContext.CreateCOAfromBudgetAccountNew(BAIString,BudgetFileID,Prodid,CreatedBy);
           return result;
       }

       public v2CRW_Save_Result v2BudgetCRWOperation(v2BudgetCRW ov2)
       {
           var result = DataContext.v2BudgetCRWOperation(ov2);
           return result;
       }
       public int EmptyBudget(int uploadedby, string CompanCode, int prodid, int Budgetid, string S1, string S2, string S3, string S4, string S5, string S6, string S7, string S8, string LedgerLebel, string SegmentName, string SegStr1, string SegStr2)
       {
           var result = DataContext.EmptyBudget(uploadedby, CompanCode, prodid, Budgetid, S1, S2, S3, S4, S5, S6, S7, S8, LedgerLebel, SegmentName, SegStr1, SegStr2);
           return result;
       }
   
   }
}
