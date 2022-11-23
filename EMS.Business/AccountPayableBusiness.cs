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
    public class AccountPayableBusiness
    {
        AccountPayableData DataContext = new AccountPayableData();

        public List<GetVendorListByProdID_Result> GetVendorListByProdID(int ProdID, string SortBy)
        {
            var result = DataContext.GetVendorListByProdID(ProdID, SortBy);
            return result.ToList();
        }
        //---------------------insert vendor------------------//
        public int InsertUpdateVendor(tblVendor _vendor)
        {
            var result = DataContext.InsertUpdateVendor(_vendor);
            return result;
        }
        //-----------------GetVendorByProdId and VendorId--------//
        public List<GetVendorDetailByVendorID_Result> GetVendorDetailByVendorID(int VendorID, int ProdID)
        {
            var result = DataContext.GetVendorDetailByVendorID(VendorID, ProdID);
            return result.ToList();
        }
        //===========getvendor number===============//
        public List<GetLastVendorNumByProdId_Result> GetLastVendorNumByProdId(int ProdID)
        {
            var result = DataContext.GetLastVendorNumByProdId(ProdID);
            return result.ToList();
        }

        //===================InsertUpdateVendorInfo==================//

        public int InsertUpdateVendorInfo(List<VendorInfo> _Info)
        {
            var result = DataContext.InsertUpdateVendorInfo(_Info);
            return result;
        }

        //-----------------GetVendorInfoByVendorId--------//
        public List<GetVendorInfoByVendorId_Result> GetVendorInfoByVendorId(int VendorID, int ProdID)
        {
            var result = DataContext.GetVendorInfoByVendorId(VendorID, ProdID);
            return result.ToList();
        }
        public string APVendorsCheckExisting(string JSONparameters)
        {
            var result = DataContext.APVendorsCheckExisting(JSONparameters);
            return Convert.ToString(result);
        }

        //========================Delete Vendor Info=================//

        //public int InsertUpdateVendorInfo(List<VendorInfo> _MYInfo) 
        //{
        //    try
        //    {
        //        var result = DataContext.InsertUpdateVendorInfo(_MYInfo);
        //        return result;
        //    }
        //    catch (Exception ex) { throw ex; }
        //}

        public List<GetInvoiceListForPaymentNew_Result> GetInvoiceListForPaymentNew(int prodId, int BankId, string CompanyCode, string VendorID, DateTime? InvDate1, DateTime? InvDate2, string Period, string PaymentType)
        {
            var result = DataContext.GetInvoiceListForPaymentNew(prodId, BankId, CompanyCode, VendorID, InvDate1, InvDate2, Period, PaymentType);
            return result.ToList();
        }

        public string SavePayment(Payment1 ObjPay)
        {
            string result = DataContext.SavePayment(ObjPay);
            return result;
        }

        public int GetCheckRun(int ProdID, int BankID, int UserID)
        {
            var result = DataContext.GetCheckRun(ProdID, BankID, UserID);
            return result;
        }
        public List<APCheckCycleVoidUnissued_Result> GetAPCheckCycleVoidUnissued(int BankID, int startvoid, int endvoid, int UserID, string vBatchNumber, int ProdID)
        {
            var result = DataContext.GetAPCheckCycleVoidUnissued(BankID, startvoid, endvoid, UserID, vBatchNumber, ProdID);
            return result;
        }


        public List<GetCheckPreview_Result> GetCheckPreview(int CheckRunID)
        {
            var result = DataContext.GetCheckPreview(CheckRunID);
            return result.ToList();
        }

        public void JournalEntryPayment(List<CheckRunJE> _CheckRunJE)
        {
            DataContext.JournalEntryPayment(_CheckRunJE);
        }

        public void ComplateCheckRun(int CheckRunID, int ProdId)
        {
            DataContext.ComplateCheckRun(CheckRunID, ProdId);
        }

        public List<GetVerifyCheck_Result> GetVerifyCheck(int BankID, int ProdID)
        {
            var result = DataContext.GetVerifyCheck(BankID, ProdID);
            return result.ToList();
        }

        public void VerifiedCheckEntry(List<CheckVerification> _CheckVerification)
        {
            DataContext.VerifiedCheckEntry(_CheckVerification);
        }

        public List<GetPaymentVoidData1_Result> GetPaymentVoidData1(int BankID)
        {
            var result = DataContext.GetPaymentVoidData1(BankID);
            return result.ToList();
        }


        public void SaveVoidData(List<VoidPayment> _VoidPayment)
        {
            DataContext.SaveVoidData(_VoidPayment);
        }

        //////////////--- Bank Reconcilation   /////////////////////////

        public List<GetBankReconcilation_Result> GetBankReconcilation(int BankID)
        {
            var result = DataContext.GetBankReconcilation(BankID);
            return result.ToList();
        }


        public int GenerateBankReconcilation(int BankID, int UserID, int ProdID, DateTime StatementDate, string StatementEndingAmount)
        {
            var result = DataContext.GenerateBankReconcilation(BankID, UserID, ProdID, StatementDate, StatementEndingAmount);
            return result;
        }

        public List<GetBankBalance_Result> GetBankBalance(int BankID, int ProdID)
        {
            var result = DataContext.GetBankBalance(BankID, ProdID);
            return result.ToList();
        }

        public void SaveBankAdjustment(List<Adjustment> _BankAdjustment)
        {
            DataContext.SaveBankAdjustment(_BankAdjustment);
        }

        public List<GetBankAdjustmentData_Result> GetBankAdjustmentData(int ReconcilationID, int BankID, int ProdID)
        {
            var result = DataContext.GetBankAdjustmentData(ReconcilationID, BankID, ProdID);
            return result.ToList();
        }

        public void UpdateAdjustment(int AdjustmentID, DateTime ADate, float Amount, string Description, int Mode)
        {
            DataContext.UpdateAdjustment(AdjustmentID, ADate, Amount, Description, Mode);
        }

        public List<BankReconcilatinAction_Result> BankReconcilatinAction(int ReconcilationID, int Mode, int UserID)
        {
            var result = DataContext.BankReconcilatinAction(ReconcilationID, Mode, UserID);
            return result.ToList();
        }

        public List<GetBankTransaction_Result> GetBankTransaction(int BankID, int ReconcilationID, int ProdID)
        {
            var result = DataContext.GetBankTransaction(BankID, ReconcilationID, ProdID);
            return result.ToList();
        }

        public void ClearedCheck(List<BankTransaction> _BankTransaction)
        {
            DataContext.ClearedCheck(_BankTransaction);
        }

        public void UpdateCheckProperty(int ReconcilationID, int Mode, int Value)
        {
            DataContext.UpdateCheckProperty(ReconcilationID, Mode, Value);
        }

        public List<CheckForOpenRunCheck_Result> CheckForOpenRunCheck(int BankID, int ProdID)
        {
            return DataContext.CheckForOpenRunCheck(BankID, ProdID);

        }
        public List<EditCheckNumber_Result> EditCheckNumber(int BankID, int ProdID, string CheckNumber)
        {
            return DataContext.EditCheckNumber(BankID, ProdID, CheckNumber);

        }

        public List<GetStartingCheckNumber_Result> GetStartingCheckNumber(int BankId, int ProdId)
        {
            return DataContext.GetStartingCheckNumber(BankId, ProdId);

        }
        public void CancelCheckRun(int ProdID, int CheckRunID)
        {
            DataContext.CancelCheckRun(ProdID, CheckRunID);
        }


        //////////////////PDF///////////
        public List<PDFInvoiceLine_Result> PDFInvoiceLine(int PaymentID, int BankID, int ProdID)
        {
            return DataContext.PDFInvoiceLine(PaymentID, BankID, ProdID);

        }

        public List<PDFCopiesPID_Result> PDFCopiesPID(int CheckRunID, int BankID, int ProdID)
        {
            return DataContext.PDFCopiesPID(CheckRunID, BankID, ProdID);

        }

        public List<PDFInvoiceTaxAmount_Result> PDFInvoiceTaxAmount(int PaymentID, int BankID, int ProdID)
        {
            return DataContext.PDFInvoiceTaxAmount(PaymentID, BankID, ProdID);

        }

        public List<PDFVendorDetail_Result> PDFVendorDetail(int PaymentID, int BankID, int ProdID)
        {
            return DataContext.PDFVendorDetail(PaymentID, BankID, ProdID);

        }

        public List<GetBankTransactionDisplayAll_Result> GetBankTransactionDisplayAll(int BankID, int ReconcilationID, int ProdID)
        {
            var result = DataContext.GetBankTransactionDisplayAll(BankID, ReconcilationID, ProdID);
            return result.ToList();
        }


        public List<InsertCheckRunByUser_Result> InsertCheckRunByUser(int UserID, int BankID)
        {
            var result = DataContext.InsertCheckRunByUser(UserID, BankID);
            return result.ToList();
        }

        public void CancelCheckRunByUser(int UserID, int BankID)
        {
            DataContext.CancelCheckRunByUser(UserID, BankID);
        }

        public List<CheckWTNo_Result> CheckWTNo(string WTList, int BankID, int ProdID, string CheckType)
        {
            var result = DataContext.CheckWTNo(WTList, BankID, ProdID, CheckType);
            return result.ToList();
        }
        public List<GetDedaultCOLO_Result> GetDedaultCOLO(int ProdID)
        {
            var result = DataContext.GetDedaultCOLO(ProdID);
            return result.ToList();
        }
        ///////////////////////////////
        public void Reconciliation_ClearedTransaction(List<BankReconcilationAddon> Obj)
        {
             DataContext.Reconciliation_ClearedTransaction( Obj);
        }
    }
    public class POSPayBusiness
    {
        POSPayData DataContext = new POSPayData();
        public List<String> POSPayGet(int BankID, int ProdID, bool isAdvanced)
        {
            try
            {
                var result = DataContext.POSPayGet(BankID, ProdID, isAdvanced);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public List<String> POSPaySet(int BankID, int ProdID, bool isAdvanced, string JSONPaymendIDList)
        {
            try
            {
                var result = DataContext.POSPaySet(BankID, ProdID, isAdvanced, JSONPaymendIDList);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
    public class APInvoiceBusiness
    {
        APData DataContext = new APData();
        public List<APInvoiceGet_Result> APInvoiceGet(int ProdID, int InvoiceID, int UserID)
        {
            try
            {
                var result = DataContext.APInvoiceGet(ProdID, InvoiceID, UserID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<APAtlasPaymentMapGet_Result> APAtlasPaymentMapGet(string callParameters)
        {
            try
            {
                var result = DataContext.APAtlasPaymentMapGet(callParameters);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<APAtlasPaymentInformationGet_Result> APAtlasPaymentInformationGet(string callParameters)
        {
            try
            {
                var result = DataContext.APAtlasPaymentInformationGet(callParameters);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

}
