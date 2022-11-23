using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class AccountPayableData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<GetVendorListByProdID_Result> GetVendorListByProdID(int ProdID, string SortBy)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetVendorListByProdID(ProdID, SortBy);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //------------------SaveVendor---------------------//
        public int InsertUpdateVendor(tblVendor _vendor)
        {
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)

                //  using (CAEntities DBContext = new CAEntities())
                {
                    var CompnayId = DBContext.InsertUpdateVendor(

                        _vendor.VendorID, _vendor.VendorNumber,
                        _vendor.VendorName, _vendor.FirstName, _vendor.MiddleName, _vendor.LastName,
                        _vendor.PrintOncheckAS,
                        _vendor.W9Country, _vendor.W9Address1, _vendor.W9Address2, _vendor.W9Address3, _vendor.W9City, _vendor.W9State,
                        _vendor.W9Zip, _vendor.RemitCountry, _vendor.RemitAddress1, _vendor.RemitAddress2, _vendor.RemitAddress3, _vendor.RemitCity, _vendor.RemitState, _vendor.RemitZip, _vendor.UseRemmitAddrs, _vendor.Qualified, _vendor.Currency, _vendor.DefaultAccount, _vendor.LedgerAccount,
                        _vendor.TaxID, _vendor.Type, _vendor.TaxFormOnFile, _vendor.TaxFormExpiry, _vendor.DefaultForm, _vendor.TaxName,
                        _vendor.ForeignTaxId, _vendor.PaymentType, _vendor.Duecount, _vendor.Duetype, _vendor.netpercentage, _vendor.PaymentAccount, _vendor.Required,
                        _vendor.StudioVendorNumber, _vendor.IsStudioApproved, _vendor.Status, _vendor.Warning, _vendor.DefaultDropdown, _vendor.CreatedBy, _vendor.ProdID,
                        _vendor.COAId, _vendor.COAString, _vendor.TransactionCodeString, _vendor.SetId, _vendor.SeriesId

                     ).FirstOrDefault();
                    return Convert.ToInt32(CompnayId);
                }
            }
            catch
            {
                return _vendor.VendorID;
            }
        }

        //-----------------GetVendorByProdId and VendorId--------//
        public List<GetVendorDetailByVendorID_Result> GetVendorDetailByVendorID(int VendorID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetVendorDetailByVendorID(VendorID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //--------------------GetVendor Number -------------------//
        //public int GetLastVendorNumByProdId(int ProdID)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)
        //    {
        //        try
        //        {
        //            var a = DBContext.GetLastVendorNumByProdId(ProdID);
        //            return Convert.ToInt32(a);
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //}

        public List<GetLastVendorNumByProdId_Result> GetLastVendorNumByProdId(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetLastVendorNumByProdId(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //===================InsertUpdateVendore==============//
        public int InsertUpdateVendorInfo(List<VendorInfo> _Info)
        {
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)

                //  using (CAEntities DBContext = new CAEntities())
                {
                    DBContext.DeleteVendorInfoById(_Info[0].VendorID);
                    foreach (var item in _Info)
                    {
                        DBContext.InsertUpdateVendorInfo(item.VendorInfoID, item.VendorID, item.ContactInfoType, item.VendorContInfo, item.CreatedBy, item.ProdID);
                    }
                    return 0;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //===========getVendorIndorInfo========================//

        public List<GetVendorInfoByVendorId_Result> GetVendorInfoByVendorId(int VendorID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetVendorInfoByVendorId(VendorID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        //===============DeleteInfoVendor=================//
        //public int InsertUpdateVendorInfo(List<VendorInfo> _MYInfo) 
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)

        //    // using (CAEntities DBContext = new CAEntities())
        //    {
        //        try
        //        {

        //            DBContext.DeleteVendorInfoByID(_MYInfo[0].VendorID);
        //            foreach (var item in _MYInfo)
        //            {
        //                var result = DBContext.InsertUpdateVendorInfo(item.VendorInfoID, item.VendorID, item.VendorContInfo, item.ContactInfoType, item.CreatedBy, item.ProdID);
        //            }
        //            return 0;
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //}
        public string APVendorsCheckExisting(string JSONparameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.APVendorsCheckExisting(JSONparameters).FirstOrDefault();
                return Convert.ToString(result);
            }
        }

        public List<GetInvoiceListForPaymentNew_Result> GetInvoiceListForPaymentNew(int prodId, int BankId, string CompanyCode, string VendorID, DateTime? InvDate1, DateTime? InvDate2, string Period, string PaymentType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetInvoiceListForPaymentNew(prodId, BankId, CompanyCode, VendorID, InvDate1, InvDate2, Period, PaymentType);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public string SavePayment(Payment1 ObjPay)
        {
            string PaymentIDs = "";
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (var dbContextTransaction = DBContext.Database.BeginTransaction())
            {
                try
                {
                    var sspaymentLine = ObjPay.ObjPayment;

                    foreach (var item in sspaymentLine)
                    {
                        // var sspaymentId = item.Paymentid;
                        var PaymentID = DBContext.InsertPaymnet(
                               item.InvoiceID, item.BatchNumber, item.GroupNumber, item.CheckDate, item.CheckNumber,
                               item.BankID, item.PayBy, item.PaymentDate, item.CreatedBy, item.ProdID,
                               item.CheckRunID).FirstOrDefault();

                        PaymentIDs += PaymentID + ",";
                        // // END CheckRun Addon  
                    }
                    dbContextTransaction.Commit();
                } catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }
            return PaymentIDs;
        }

        public int GetCheckRun(int ProdID, int BankID, int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCheckRun(ProdID, BankID, UserID).FirstOrDefault();

                return Convert.ToInt32(result);
            }

        }
        public List<APCheckCycleVoidUnissued_Result> GetAPCheckCycleVoidUnissued(int BankID, int startvoid, int endvoid, int UserID, string vBatchNumber, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.APCheckCycleVoidUnissued(BankID, startvoid, endvoid, UserID, vBatchNumber, ProdID);
                return result.ToList();
            }
        }



        public List<GetCheckPreview_Result> GetCheckPreview(int CheckRunID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetCheckPreview(CheckRunID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public void JournalEntryPayment(List<CheckRunJE> _CheckRunJE)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (var dbContextTransaction = DBContext.Database.BeginTransaction())
                // using (CAEntities DBContext = new CAEntities())
                {
                try
                {
                    foreach (var item in _CheckRunJE)
                    {
                        var a = DBContext.JournalEntryPayment(item.PaymentID, item.ProdID, item.UserID, item.CompanyCode, item.BatchNumber).FirstOrDefault();
                    }
                    dbContextTransaction.Commit();
                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }
        }


        public void ComplateCheckRun(int CheckRunID, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                DBContext.ComplateCheckRun(CheckRunID, ProdId);
            }
        }


        public List<GetVerifyCheck_Result> GetVerifyCheck(int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetVerifyCheck(BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public void ClearedCheck(List<BankTransaction> _BankTransaction)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                foreach (var item in _BankTransaction)
                {
                    var result = DBContext.ClearedCheck(item.ReconcilationID, item.PaymentID, item.Mode, item.UserID);
                }
            }

        }

        public void VerifiedCheckEntry(List<CheckVerification> _CheckVerification)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (var dbContextTransaction = DBContext.Database.BeginTransaction())
            {
                try
                {

                    foreach (var item in _CheckVerification)
                    {

                        if (Convert.ToInt16(item.Mode) == 1)
                        {
                            // Insert into JE and JE Detail
                            DBContext.JournalEntryPayment(item.PaymentID, item.ProdID, item.UserID, item.CompanyCode, item.BatchNumber).FirstOrDefault();
                            // Update Payment Status
                            DBContext.VerifiedCheckEntry(item.PaymentID, item.Mode, item.ProdID).SingleOrDefault();
                        }
                        else if (Convert.ToInt16(item.Mode) == 2)
                        {
                            // Insert into JE and JE Detail
                            DBContext.JournalEntryPayment(item.PaymentID, item.ProdID, item.UserID, item.CompanyCode, item.BatchNumber).FirstOrDefault();
                            // Update Payment Status
                            DBContext.VerifiedCheckEntry(item.PaymentID, item.Mode, item.ProdID).SingleOrDefault();
                            // Cancelled Check and Reverse Transaction
                            DBContext.SaveVoidData(item.PaymentID, "NO", item.BatchNumber, item.ProdID, item.UserID, "Cancelled").SingleOrDefault();
                        }
                        else if (Convert.ToInt16(item.Mode) == 3)
                        {
                            // Update Payment Status
                            DBContext.VerifiedCheckEntry(item.PaymentID, item.Mode, item.ProdID).SingleOrDefault();
                        }
                        else if (Convert.ToInt16(item.Mode) == 4)
                        {
                            // Insert into JE and JE Detail
                            DBContext.JournalEntryPayment(item.PaymentID, item.ProdID, item.UserID, item.CompanyCode, item.BatchNumber).FirstOrDefault();
                            // Update Payment Status
                            DBContext.VerifiedCheckEntry(item.PaymentID, item.Mode, item.ProdID).SingleOrDefault();
                            // Cancelled Check and Reverse Transaction
                            DBContext.SaveVoidData(item.PaymentID, "YES", item.BatchNumber, item.ProdID, item.UserID, "Cancelled").SingleOrDefault();
                            // re-Print With New Check Number
                            DBContext.RePrintPayment(item.PaymentID, item.BatchNumber, item.ProdID, item.UserID).SingleOrDefault();

                        }
                    }
                    dbContextTransaction.Commit();
                } catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }
        }

        public List<GetPaymentVoidData1_Result> GetPaymentVoidData1(int BankID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetPaymentVoidData1(BankID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public void SaveVoidData(List<VoidPayment> _VoidPayment)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                foreach (var item in _VoidPayment)
                {
                    try
                    {
                        DBContext.SaveVoidData(item.PaymentID, item.IsReissueInv, item.BatchNumber,
                           item.ProdID, item.UserID, item.Status);
                    }
                    catch (Exception ex)
                    {

                        throw ex;
                    }
                }


            }
        }

        //////////////--- Bank Reconcilation   /////////////////////////

        public List<GetBankReconcilation_Result> GetBankReconcilation(int BankID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetBankReconcilation(BankID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public int GenerateBankReconcilation(int BankID, int UserID, int ProdID, DateTime StatementDate, string StatementEndingAmount)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GenerateBankReconcilation(BankID, UserID, ProdID, StatementDate, StatementEndingAmount).FirstOrDefault();

                return Convert.ToInt32(result);
            }
        }

        public List<GetBankBalance_Result> GetBankBalance(int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetBankBalance(BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public void SaveBankAdjustment(List<Adjustment> _BankAdjustment)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                foreach (var item in _BankAdjustment)
                {
                    DBContext.SaveBankAdjustment(item.BankID, item.ProdID, item.ReconcilationID, item.AdjustmentNumber, item.Date, item.Amount, item.Description, item.UserID);
                }

            }
        }

        public List<GetBankAdjustmentData_Result> GetBankAdjustmentData(int ReconcilationID, int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetBankAdjustmentData(ReconcilationID, BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public void UpdateAdjustment(int AdjustmentID, DateTime ADate, float Amount, string Description, int Mode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateAdjustment(AdjustmentID, ADate, Amount, Description, Mode);
            }

        }

        public List<BankReconcilatinAction_Result> BankReconcilatinAction(int ReconcilationID, int Mode, int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.BankReconcilatinAction(ReconcilationID, Mode, UserID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetBankTransaction_Result> GetBankTransaction(int BankID, int ReconcilationID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetBankTransaction(BankID, ReconcilationID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public void UpdateCheckProperty(int ReconcilationID, int Mode, int Value)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateCheckProperty(ReconcilationID, Mode, Value);
            }
        }

        public List<CheckForOpenRunCheck_Result> CheckForOpenRunCheck(int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.CheckForOpenRunCheck(BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<EditCheckNumber_Result> EditCheckNumber(int BankID, int ProdID, string CheckNumber)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.EditCheckNumber(BankID, ProdID, CheckNumber);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetStartingCheckNumber_Result> GetStartingCheckNumber(int BankId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetStartingCheckNumber(BankId, ProdId);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public void CancelCheckRun(int ProdID, int CheckRunID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.CancelCheckRun(ProdID, CheckRunID);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        ///////////////PDF////////////////

        public List<PDFInvoiceLine_Result> PDFInvoiceLine(int PaymentID, int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.PDFInvoiceLine(PaymentID, BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<PDFCopiesPID_Result> PDFCopiesPID(int CheckRunID, int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.PDFCopiesPID(CheckRunID, BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<PDFInvoiceTaxAmount_Result> PDFInvoiceTaxAmount(int PaymentID, int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.PDFInvoiceTaxAmount(PaymentID, BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<PDFVendorDetail_Result> PDFVendorDetail(int PaymentID, int BankID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.PDFVendorDetail(PaymentID, BankID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetBankTransactionDisplayAll_Result> GetBankTransactionDisplayAll(int BankID, int ReconcilationID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetBankTransactionDisplayAll(BankID, ReconcilationID, ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<InsertCheckRunByUser_Result> InsertCheckRunByUser(int UserID, int BankID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.InsertCheckRunByUser(UserID, BankID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }



        public void CancelCheckRunByUser(int UserID, int BankID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.CancelCheckRunByUser(UserID, BankID);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<CheckWTNo_Result> CheckWTNo(string WTList, int BankID, int ProdID, string CheckType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.CheckWTNo(WTList, BankID, ProdID, CheckType);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        ///////////////////////////////////
        public List<GetDedaultCOLO_Result> GetDedaultCOLO(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetDedaultCOLO(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public void Reconciliation_ClearedTransaction(List<BankReconcilationAddon> Obj)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (var dbContextTransaction = DBContext.Database.BeginTransaction())
            //using (DBContext)
            {
                try
                {
                    foreach (var item in Obj)
                    {
                        try
                        {
                            DBContext.Reconciliation_ClearedTransaction(item.ReconcilationID, item.JEID, item.CheckNumber, item.Mode, item.UserID).FirstOrDefault();
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                    dbContextTransaction.Commit();
                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }
        }
    }
    public class POSPayData
    {
        Data.UtilityData utility = new Data.UtilityData();

        public List<string> POSPayGet(int BankID, int ProdID, bool isAdvanced)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.PosPayGet(BankID, ProdID, isAdvanced);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
        public List<string> POSPaySet(int BankID, int ProdID, bool isAdvanced, string JSONPaymentIDList)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.PosPaySet(BankID, ProdID, isAdvanced, JSONPaymentIDList);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
    }
    public class APData
    {
        Data.UtilityData utility = new Data.UtilityData();

        public List<APInvoiceGet_Result> APInvoiceGet(int ProdID, int InvoiceID, int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.APInvoiceGet(ProdID, InvoiceID, UserID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
        public List<APAtlasPaymentMapGet_Result> APAtlasPaymentMapGet(string callPayload)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.APAtlasPaymentMapGet(callPayload);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }


        }
        public List<APAtlasPaymentInformationGet_Result> APAtlasPaymentInformationGet(string callPayload)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.APAtlasPaymentInformationGet(callPayload);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }


        }
    }

}
