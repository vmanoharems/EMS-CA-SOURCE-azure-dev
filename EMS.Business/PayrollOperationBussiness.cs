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
    public class PRPortalBusiness
    {
        private AtlasSecurity _AtlasSecurity;
        private PRPortalData _PRDataContext;
        public PRPortalBusiness(AtlasSecurity ASec)
        {
            this._AtlasSecurity = ASec;
            this._PRDataContext = new PRPortalData(ASec);
        }
        public List<AtlasPRList_Result> PRList(int ProdID, JSONParameters callParameters)
        {
            return this._PRDataContext.PRList(ProdID, callParameters);
        }
        public List<string> PRGet(int PREditID, int ProdID, int UserID)
        {
            return this._PRDataContext.PRGet(PREditID, ProdID, UserID);
        }
        public List<string> PRSave(int PREditID, int ProdID, int UserID, JSONParameters callParameters)
        {
            return this._PRDataContext.PRSave(PREditID, ProdID, UserID, callParameters);
        }
    }
    public class PayrollOperationBussiness
    {
        PayrollData DataContext = new PayrollData();
        public string InsertAdminPayrollFile(string InvoiceRef, int CompanyID, int ProdID, int uploadedby, string UploadedXML)
        {
            var result = DataContext.InsertAdminPayrollFile(InvoiceRef, CompanyID, ProdID, uploadedby, UploadedXML);
            return result;
        }

        public List<OverWriteAdminPayrollFile_Result> OverWriteAdminPayrollFile(string InvoiceRef, int CompanyID, int ProdID, int uploadedby, string UploadedXML)
        {
            var result = DataContext.OverWriteAdminPayrollFile(InvoiceRef, CompanyID, ProdID, uploadedby, UploadedXML);
            return result;
        }

        public List<GetAdminPayrollFile_Result> GetAdminPayrollFile(int ProdID)
        {
            var result = DataContext.GetAdminPayrollFile(ProdID);
            return result;
        }

        public List<GetPayrollFileinClientSide_Result> GetPayrollFileinClientSide(string CompanyCode, int ProdID)
        {
            var result = DataContext.GetPayrollFileinClientSide(CompanyCode, ProdID);
            return result;
        }
        public List<GetPayrollDataFileFill_Result> GetPayrollDataFileFill(int PayrollFileID)
        {
            var result = DataContext.GetPayrollDataFileFill(PayrollFileID);
            return result;
        }
        public List<GetTransCodeForPayroll_Result> GetTransCodeForPayroll(int ProdID)
        {
            var result = DataContext.GetTransCodeForPayroll(ProdID);
            return result;
        }

        public List<GetPayrollHistory_Result> GetPayrollHistory(int CompanyID)
        {
            var result = DataContext.GetPayrollHistory(CompanyID);
            return result;
        }

        public void InsertUpdatePayrollTransValue(List<PayrollTransValue> _PayrollTransValue)
        {
            DataContext.InsertUpdatePayrollTransValue(_PayrollTransValue);
        }

        public string CheckPayrollFileBeforePost(List<PayrollTransValue> _PayrollTransValue)
        {
            return DataContext.CheckPayrollFileBeforePost(_PayrollTransValue);
        }


        public List<GetTransCodeForPayrollAudit_Result> GetTransCodeForPayrollAudit(int PayrollFileID)
        {
            var result = DataContext.GetTransCodeForPayrollAudit(PayrollFileID);
            return result;
        }

        public List<GetTransCodeFromExpense_Result> GetTransCodeFromExpense(string TransStr)
        {
            var result = DataContext.GetTransCodeFromExpense(TransStr);
            return result;
        }
        public List<GetSourceCodeBySource_Result> GetSourceCodeBySource(int ProdID, string Source)
        {
            var result = DataContext.GetSourceCodeBySource(ProdID, Source);
            return result;
        }

        //---------------------keys

        public int InsertUpdatePayrollfreeFields(PayrollFreeField _keys)
        {
        var result = DataContext.InsertUpdatePayrollfreeFields(_keys);
            return result;
       }
        ////-------------------------------showkeydata
        public List<GetPayrollFreeFieldByCompanyId_Result> GetPayrollFreeFieldByCompanyId(int companyID)
        {
            var result = DataContext.GetPayrollFreeFieldByCompanyId(companyID);
            return result;
        }
        //-----------------------showbankDetails

        public int insertUpdatepayrollbanksetup(PayrollBankSetup _SetUp)
        {
            var result = DataContext.insertUpdatepayrollbanksetup(_SetUp);
            return result;
        }
        //----------------------------------getall bank details by prodId
        public List<GetBankSetupByProdID_Result> GetBankSetupByProdID(int CompanyID, int ProdID)
        {
            var result = DataContext.GetBankSetupByProdID(CompanyID, ProdID);
            return result;
        }
        //--------------------------------------getpayrolloffsets

        public List<GetPayrollOffsets_Result> GetPayrollOffsets(int CompanyID)
        {
            var result = DataContext.GetPayrollOffsets(CompanyID);
            return result;
        }
        //------------------------------insertupdateoffsets

        public int InsertUpdateAddOffsets(PayrollOffset _Offset)
        {
            var result = DataContext.InsertUpdateAddOffsets(_Offset);
            return result;
        }

        public List<GetPayrollFileAmountDetail_Result> GetPayrollFileAmountDetail(int PayrollFileID)
        {
            var result = DataContext.GetPayrollFileAmountDetail(PayrollFileID);
            return result;
        }

        public List<GetPayrollFileAmountDetailPost_Result> GetPayrollFileAmountDetailPost(int PayrollFileID)
        {
            var result = DataContext.GetPayrollFileAmountDetailPost(PayrollFileID);
            return result;
        }
        public void SaveTrabsactionDate(int PayrollFileID, DateTime TransactionDate, string Status, string BatchNumber, string PeriodStatus)
        {
            DataContext.SaveTrabsactionDate(PayrollFileID, TransactionDate, Status, BatchNumber, PeriodStatus);
           
        }

        public List<GetPayrollFileUserListByPayrollID_Result> GetPayrollFileUserListByPayrollID(int PayrollFileID)
        {
            var result = DataContext.GetPayrollFileUserListByPayrollID(PayrollFileID);
            return result;
        }
        public List<GetPayrollExpenseByPayrollUser_Result> GetPayrollExpenseByPayrollUser(int PayrollFileID, int PayrollUserID)
        {
            var result = DataContext.GetPayrollExpenseByPayrollUser(PayrollFileID, PayrollUserID);
            return result;
        }
        //---------------payrollAddrangefringe----------------//
        public int InsertUpdateFringeByCompanyId(PayrollFringeHeader _Fringe)
        {
            var result = DataContext.InsertUpdateFringeByCompanyId(_Fringe);
            return result;
        }

        public List<GetPayrollFringeByCompanyID_Result> GetPayrollFringeByCompanyID(int CompanyID)
        {
            var result = DataContext.GetPayrollFringeByCompanyID(CompanyID);
            return result;
        }

        //public List<UpdatePayrollExpenses_Result> UpdatePayrollExpenses(int PayrollExpenseID, string ParameterValue, int ModifyBy, int ColumnName)
        //{
        //    return DataContext.UpdatePayrollExpenses(PayrollExpenseID, ParameterValue, ModifyBy, ColumnName);
        //}

        //----------------------------getAddfringe
        //public List<GetPayrollAddRange_Result> GetPayrollAddRange(int CompanyID)
        //{
        //    var result = DataContext.GetPayrollAddRange(CompanyID);
        //    return result;
        //}
        //---------------------------InsertupdateAddRange
        //public int InsertUpdateAddRange(PayrollFringetable _AdFring)
        //{
        //    var result = DataContext.InsertUpdateAddRange(_AdFring);
        //    return result;
        //}
        //----------------------------getAddfringeByCompanyId
        //public List<GetPayrollAddFringeByConpanyID_Result> GetPayrollAddFringeByConpanyID(int CompanyID)
        //{
        //    var result = DataContext.GetPayrollAddFringeByConpanyID(CompanyID);
        //    return result;
        //}
        //-----------------Autofill Suspense Account-----------//
        public List<GetSuspenseAccountbyProdId_Result> GetSuspenseAccountbyProdId(int ProdId, string Type, int ParentId)
        {
            var result = DataContext.GetSuspenseAccountbyProdId(ProdId,Type, ParentId);
            return result;
        }
        //-------------------Autofill Start End Range--------------//
        public List<GetStartEndRange_Result> GetStartEndRange(int CompanyID)
        {
            var result = DataContext.GetStartEndRange(CompanyID);
            return result;
        }

        public List<GetSegmentForPayroll_Result> GetSegmentForPayroll(int ProdID)
        {
            try
            {
                var result = DataContext.GetSegmentForPayroll(ProdID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<FetchCOAbyCOACode_Result> FetchCOAbyCOACode(string COACode, int ProdID)
        {
            try
            {
                var result = DataContext.FetchCOAbyCOACode(COACode, ProdID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<GetPayrollDataFileForAudit_Result> GetPayrollDataFileForAudit(int PayrollFileID)
        {
            var result = DataContext.GetPayrollDataFileForAudit(PayrollFileID);
            return result;
        }

        public List<GetSegmentStringFromExpense_Result> GetSegmentStringFromExpense(string SegmentStr, int ProdID)
        {
            var result = DataContext.GetSegmentStringFromExpense(SegmentStr, ProdID);
            return result;
        }

        public List<PayrollCheckPrint_Result> PayrollCheckPrint(int PayrollFileID)
        {
            var result = DataContext.PayrollCheckPrint(PayrollFileID);
            return result;
        }

        public List<GetPayrollAuditList_Result> GetPayrollAuditList(int CompanyID,int UserID)
        {
            var result = DataContext.GetPayrollAuditList(CompanyID,UserID);
            return result;
        }

        public List<GetFreeFieldDetail_Result> GetFreeFieldDetail(string CompanyCode, int ProdID)
        {
            var result = DataContext.GetFreeFieldDetail(CompanyCode, ProdID);
            return result;
        }

        public List<GetPayrollHistoryNew_Result> GetPayrollHistoryNew(int CompanyID,int UserID)
        {
            var result = DataContext.GetPayrollHistoryNew(CompanyID,UserID);
            return result;
        }

        public List<INVOICEJETHROUGHPAYROLL1_Result> INVOICEJETHROUGHPAYROLL1(int PayrollFileID, int UserID, int ProdId, int VendorID)
        {
            var result = DataContext.INVOICEJETHROUGHPAYROLL1(PayrollFileID, UserID, ProdId, VendorID);
            return result;
        }

        public List<JETHROUGHPAYROLL1_Result>JETHROUGHPAYROLL1(int PayrollFileID, int UserID, int ProdId, int VendorID)
        {
            var result = DataContext.JETHROUGHPAYROLL1(PayrollFileID, UserID, ProdId, VendorID);
            return result;
        }


        public List<CheckClearingAccount_Result> CheckClearingAccount(int PayrollFileID, int ProdId)
        {
            var result = DataContext.CheckClearingAccount(PayrollFileID, ProdId);
            return result;
        }

        //===========================//////////////////////////////

        public List<GetBankInfoPayroll_Result> GetBankInfoPayroll(int CompanyId, int ProdId)
        {
            var result = DataContext.GetBankInfoPayroll(CompanyId, ProdId);
            return result;
        }

        public List<GetPayrollVendor_Result> GetPayrollVendor(int CID, int ProdID, int Mode)
        {
            var result = DataContext.GetPayrollVendor(CID, ProdID, Mode);
            return result;
        }

        public List<CheckClosePeriodStatus_Result> CheckClosePeriodStatus(int CompanyID, string Period)
        {
            var result = DataContext.CheckClosePeriodStatus(CompanyID, Period);
            return result;
        }

        public List<InvoiceNumberAutoFill_Result> InvoiceNumberAutoFill(int CompanyID, int Mode)
        {
            var result = DataContext.InvoiceNumberAutoFill(CompanyID, Mode);
            return result;
        }
    }
}
