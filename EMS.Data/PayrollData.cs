using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class PRPortalData
    {
        private AtlasSecurity _AtlasSecurity;
        public PRPortalData(AtlasSecurity ASec)
        {
            this._AtlasSecurity = ASec;
        }
        public List<AtlasPRList_Result> PRList(int ProdID, JSONParameters callParameters)
        {
            return this._AtlasSecurity.GetDBConnection().AtlasPRList(ProdID, callParameters.callPayload).ToList();
        }
        public List<string> PRGet(int PREditID, int ProdID, int UserID)
        {
            return this._AtlasSecurity.GetDBConnection().AtlasPRGet(PREditID, ProdID, UserID).ToList();
        }
        public List<string> PRSave(int PREditID, int ProdID, int UserID, JSONParameters callParameters)
        {
            return this._AtlasSecurity.GetDBConnection().AtlasPRSave(PREditID, ProdID, UserID, callParameters.callPayload).ToList();
        }
    }
    public class PayrollData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public string InsertAdminPayrollFile(string InvoiceRef, int CompanyID, int ProdID, int uploadedby, string UploadedXML)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            //using (CAEntities DBContext = new CAEntities())
            {

                try
                {
                    var result = DBContext.InsertAdminPayrollFile(InvoiceRef, CompanyID, ProdID, uploadedby, UploadedXML).FirstOrDefault();
                    return result.ToString();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<OverWriteAdminPayrollFile_Result> OverWriteAdminPayrollFile(string InvoiceRef, int CompanyID, int ProdID, int uploadedby, string UploadedXML)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            //using (CAEntities DBContext = new CAEntities())
            {

                try
                {
                    var result = DBContext.OverWriteAdminPayrollFile(InvoiceRef, CompanyID, ProdID, uploadedby, UploadedXML);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetAdminPayrollFile_Result> GetAdminPayrollFile(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetAdminPayrollFile(ProdID);
                return result.ToList();
            }
        }
        public List<GetPayrollFileinClientSide_Result> GetPayrollFileinClientSide(string CompanyCode, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollFileinClientSide(CompanyCode, ProdID);
                return result.ToList();
            }
        }

        public List<GetPayrollDataFileFill_Result> GetPayrollDataFileFill(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            //using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollDataFileFill(PayrollFileID);
                return result.ToList();
            }
        }

        public List<GetTransCodeForPayroll_Result> GetTransCodeForPayroll(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTransCodeForPayroll(ProdID);
                return result.ToList();
            }
        }

        public List<GetPayrollHistory_Result> GetPayrollHistory(int CompanyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollHistory(CompanyID);
                return result.ToList();
            }
        }

        public void InsertUpdatePayrollTransValue(List<PayrollTransValue> _PayrollTransValue)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                foreach (var item in _PayrollTransValue)
                {
                    DBContext.InsertUpdatePayrollTransValue(item.ExpenseID, item.ModifyBy, item.TransValueStr, item.COAString, item.SegmentString, item.SegmentString1, item.SegmentString2, item.AccountNumber, item.PayDescription, item.SegmentStr1, item.TransactionStr1, item.SetID, item.SeriesID);
                }

            }
        }

        public string CheckPayrollFileBeforePost(List<PayrollTransValue> _PayrollTransValue)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var Result = "";
                var Result1 = "";
                var RE = "";
                foreach (var item in _PayrollTransValue)
                {
                    RE+= DBContext.CheckPayrollFileBeforePost(item.ExpenseID, item.ModifyBy, item.TransValueStr, item.COAString, item.SegmentString, item.SegmentString1, item.SegmentString2, item.PayDescription).FirstOrDefault();
                    if (RE=="0")
                    {

                    }
                    else
                    {
                        Result1 = RE + "|";                   
                        Result += Result1;
                    }
                    RE = "";
                    Result1 = "";

                }
                return Result;
            }
        }

        public List<GetTransCodeForPayrollAudit_Result> GetTransCodeForPayrollAudit(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTransCodeForPayrollAudit(PayrollFileID);
                return result.ToList();
            }
        }

        public List<GetTransCodeFromExpense_Result> GetTransCodeFromExpense(string TransStr)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTransCodeFromExpense(TransStr);
                return result.ToList();
            }
        }
        // vivek

        public List<GetSourceCodeBySource_Result> GetSourceCodeBySource(int ProdID, string Source)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetSourceCodeBySource(ProdID, Source);
                return result.ToList();
            }
        }
        //-----------------------keys
        public int InsertUpdatePayrollfreeFields(PayrollFreeField _keys)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {

                try
                {
                    var result = DBContext.InsertUpdatePayrollfreeFields(_keys.PayrollFreeFieldID,
                        _keys.FreeField1, _keys.FreeField2,
                        _keys.FreeField3,
                        _keys.createdby,
                        _keys.ProdID,
                        _keys.CompanyId

                        );
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //----------------------show key data

        public List<GetPayrollFreeFieldByCompanyId_Result> GetPayrollFreeFieldByCompanyId(int companyId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.GetPayrollFreeFieldByCompanyId(companyId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        //------------------------insertupdate bank details

        public int insertUpdatepayrollbanksetup(PayrollBankSetup _SetUp)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {

                try
                {
                    var result = DBContext.insertUpdatepayrollbanksetup(_SetUp.PayrollBankSetupID,
                        _SetUp.DefaultCompanyID,
                        _SetUp.DefaultBankId, _SetUp.DefaultCurrency,
                        _SetUp.PRSource,
                        _SetUp.APSource,
                        _SetUp.createdby,
                        _SetUp.ProdID,
                        _SetUp.VendorID);
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        //----------------------get bank details by ProdId
        public List<GetBankSetupByProdID_Result> GetBankSetupByProdID(int CompanyID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetBankSetupByProdID(CompanyID, ProdID);
                return result.ToList();
            }
        }
        //-----------------------------InsertUpdateAddOffsets
        public int InsertUpdateAddOffsets(PayrollOffset _Offset)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {

                try
                {
                    var result = DBContext.InsertUpdateAddOffsets(_Offset.PayrollOffsetID,

                                       _Offset.OffsetType,
                                       _Offset.OffsetAccount,
                                       _Offset.Offsetdescription,
                                       _Offset.Active,
                                      _Offset.createdby,
                                      _Offset.ProdID,
                                     _Offset.CompanyID
                                     );
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        //----------------------------GetPayrollAddOffsets

        public List<GetPayrollOffsets_Result> GetPayrollOffsets(int CompanyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollOffsets(CompanyID);
                return result.ToList();
            }
        }

        public List<GetPayrollFileAmountDetail_Result> GetPayrollFileAmountDetail(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollFileAmountDetail(PayrollFileID);
                return result.ToList();
            }
        }

        public List<GetPayrollFileAmountDetailPost_Result> GetPayrollFileAmountDetailPost(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollFileAmountDetailPost(PayrollFileID);
                return result.ToList();
            }
        }

        public void SaveTrabsactionDate(int PayrollFileID, DateTime TransactionDate, string Status, string BatchNumber, string PeriodStatus)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.SaveTrabsactionDate(PayrollFileID, TransactionDate, Status, BatchNumber, PeriodStatus);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetPayrollFileUserListByPayrollID_Result> GetPayrollFileUserListByPayrollID(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollFileUserListByPayrollID(PayrollFileID);
                return result.ToList();
            }
        }

        public List<GetPayrollExpenseByPayrollUser_Result> GetPayrollExpenseByPayrollUser(int PayrollFileID, int PayrollUserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollExpenseByPayrollUser(PayrollFileID, PayrollUserID);
                return result.ToList();
            }
        }

        //public int InsertUpdateFringeByProdID(PayrollFringeHeader _Fringe)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)  
        //   // using (CAEntities DBContext = new CAEntities())
        //    {

        //        try
        //        {
        //            var result = DBContext.InsertUpdateFringeByProdID(_Fringe.CompanyStart,
        //                              _Fringe.Companyto,
        //                               _Fringe.Glfrom,
        //                               _Fringe.Glto,
        //                               _Fringe.ProdID,
        //                              _Fringe.createdby);
        //            return Convert.ToInt32(result);
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //}
        //----------------------------------getfringeby ProdId
        public List<GetPayrollFringeByCompanyID_Result> GetPayrollFringeByCompanyID(int CompanyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollFringeByCompanyID(CompanyID);
                return result.ToList();
            }
        }

        //public List<UpdatePayrollExpenses_Result> UpdatePayrollExpenses(int PayrollExpenseID, string ParameterValue, int ModifyBy, int ColumnName)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)  
        //   // using (CAEntities DBContext = new CAEntities())
        //    {


        //        var result =DBContext.UpdatePayrollExpenses(PayrollExpenseID, ParameterValue, ModifyBy, ColumnName);
        //        return result.ToList();
        //       // return Result;
        //    }
        //}
        //------------------------getAddfringe
        //public List<GetPayrollAddRange_Result> GetPayrollAddRange(int CompanyID)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext) 
        //   // using (CAEntities DBContext = new CAEntities())
        //    {
        //        var result = DBContext.GetPayrollAddRange(CompanyID);
        //        return result.ToList();
        //    }
        //}
        //----------------------------InsertUpdateAddFringe
        public int InsertUpdateFringeByCompanyId(PayrollFringeHeader _AdFring)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {

                try
                {
                    var result = DBContext.InsertUpdateFringeByCompanyId(_AdFring.PayrollFringeHeaderID,
                                       _AdFring.StartRange,
                                       _AdFring.EndRange,
                                       _AdFring.LOId,
                                       _AdFring.EpiId,
                                       _AdFring.SetId,
                                       _AdFring.BananasId,
                                       _AdFring.FringeAccount,
                                       _AdFring.ProdID,
                                       _AdFring.createdby,

                                      _AdFring.CompanyID
                                      );
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        //------------------------------------GetAddfringebyCompanyId
        //public List<GetPayrollAddFringeByConpanyID_Result> GetPayrollAddFringeByConpanyID(int CompanyID)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)
        //    //  using (CAEntities DBContext = new CAEntities())
        //    {
        //        var result = DBContext.GetPayrollAddFringeByConpanyID(CompanyID);
        //        return result.ToList();
        //    }
        //}
        //-------------------Autofill Suspense Account-----------//
        public List<GetSuspenseAccountbyProdId_Result> GetSuspenseAccountbyProdId(int ProdId, string Type, int ParentId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetSuspenseAccountbyProdId(ProdId, Type, ParentId);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }

        }
        //--------------Autofill StartEnd Range------------------------//
        public List<GetStartEndRange_Result> GetStartEndRange(int CompanyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetStartEndRange(CompanyID);
                    return result.ToList();
                }
                catch (Exception ex)
                { throw ex; }
            }

        }

        public List<GetSegmentForPayroll_Result> GetSegmentForPayroll(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetSegmentForPayroll(ProdID);
                return result.ToList();
            }
        }

        public List<FetchCOAbyCOACode_Result> FetchCOAbyCOACode(string COACode, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.FetchCOAbyCOACode(COACode, ProdID);
                return result.ToList();
            }
        }

        public List<GetPayrollDataFileForAudit_Result> GetPayrollDataFileForAudit(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            //using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollDataFileForAudit(PayrollFileID);
                return result.ToList();
            }
        }

        public List<GetSegmentStringFromExpense_Result> GetSegmentStringFromExpense(string SegmentStr, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetSegmentStringFromExpense(SegmentStr, ProdID);
                return result.ToList();
            }
        }

        public List<PayrollCheckPrint_Result> PayrollCheckPrint(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            //using (CAEntities DBContext = new CAEntities())
            {

                try
                {
                    var result = DBContext.PayrollCheckPrint(PayrollFileID);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetPayrollAuditList_Result> GetPayrollAuditList(int CompanyID,int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollAuditList(CompanyID,UserID);
                return result.ToList();
            }
        }

        public List<GetFreeFieldDetail_Result> GetFreeFieldDetail(string CompanyCode, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetFreeFieldDetail(CompanyCode, ProdID);
                return result.ToList();
            }
        }

        public List<GetPayrollHistoryNew_Result> GetPayrollHistoryNew(int CompanyID,int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollHistoryNew(CompanyID,UserID);
                return result.ToList();
            }
        }


        public List<INVOICEJETHROUGHPAYROLL1_Result> INVOICEJETHROUGHPAYROLL1(int PayrollFileID, int UserID, int ProdId, int VendorID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            try
            {
                using (DBContext)
                // using (CAEntities DBContext = new CAEntities())
                {
                    var result = DBContext.JETHROUGHPAYROLL1(PayrollFileID, UserID, ProdId, VendorID);

                    var JEID = result.First().JEID;

                    var result1 = DBContext.INVOICEJETHROUGHPAYROLL1(PayrollFileID, UserID, ProdId, JEID, VendorID);
                    return result1.ToList();
                }
            } catch (Exception up)
            {
                throw up;
            }
        }

        public List<JETHROUGHPAYROLL1_Result> JETHROUGHPAYROLL1(int PayrollFileID, int UserID, int ProdId, int VendorID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.JETHROUGHPAYROLL1(PayrollFileID, UserID, ProdId, VendorID);
                return result.ToList();
            }
        }

        public List<CheckClearingAccount_Result> CheckClearingAccount (int PayrollFileID, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.CheckClearingAccount(PayrollFileID, ProdId);
                return result.ToList();
            }
        }

        public List<GetBankInfoPayroll_Result> GetBankInfoPayroll(int CompanyId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetBankInfoPayroll(CompanyId, ProdId);
                return result.ToList();
            }
        }

        public List<GetPayrollVendor_Result> GetPayrollVendor(int CID, int ProdID, int Mode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetPayrollVendor(CID, ProdID, Mode);
                return result.ToList();
            }
        }


        public List<CheckClosePeriodStatus_Result> CheckClosePeriodStatus(int CompanyID, string Period)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.CheckClosePeriodStatus(CompanyID, Period);
                return result.ToList();
            }
        }

        public List<InvoiceNumberAutoFill_Result> InvoiceNumberAutoFill(int CompanyID, int Mode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.InvoiceNumberAutoFill(CompanyID, Mode);
                return result.ToList();
            }
        }

    }
}
