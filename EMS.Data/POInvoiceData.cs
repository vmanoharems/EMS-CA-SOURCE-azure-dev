using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class POInvoiceData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<GetVendorAddress_Result> GetVendorAddress(int VendorID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetVendorAddress(VendorID);
                return result.ToList();
            }
        }

        public List<GetVendorAddPO_Result> GetVendorAddPO(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetVendorAddPO(ProdID);
                return result.ToList();
            }
        }


        public POClass SavePO(POClass ObjPO)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (var dbContextTransaction = DBContext.Database.BeginTransaction())
            {
                try
                {
                    var strPO = ObjPO.objPO;
                    var strPOD = ObjPO.objPOLine;

                    decimal? result = DBContext.APPOAdd(
                            strPO.POID, strPO.PONumber, strPO.CompanyID, strPO.VendorID, strPO.VendorName
                            , strPO.ThirdParty, strPO.WorkRegion, strPO.Description, strPO.OriginalAmount
                            , strPO.AdjustmentTotal, strPO.RelievedTotal, strPO.BalanceAmount
                            , strPO.BatchNumber, strPO.ClosePOuponPayment, strPO.Payby, strPO.Status, strPO.CreatedBy
                            , strPO.ProdID, strPO.PODate, strPO.ClosePeriodId, strPO.RequiredTaxCode, strPO.CurrencyDocument
                        ).FirstOrDefault();

                    foreach (var item in strPOD)
                    {
                        var rtn = DBContext.SaveUpdatePurchaseOrderLine(item.POlineID,Convert.ToInt32(result), item.COAID, item.Amount,
                            item.ManualAdjustment, item.ClearedAmount,item.AdjustMentTotal, item.RelievedTotal, item.AvailToRelieve, item.DisplayAmount,
                            item.LineDescription, item.POLinestatus, item.COAString, item.Transactionstring, item.CreatedBy, item.ProdID, item.ThirdPartyVendor, item.SetID, item.SeriesID, item.TaxCode
                        ).FirstOrDefault();
                    }
                    ObjPO.objPO.POID = Convert.ToInt32(result);
                    dbContextTransaction.Commit();
                    return ObjPO; // If all goes well and we get to this point, return back the object that was sent to us with the updated POID

                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }
        }

        public List<GetAllPurchaseOrder_Result> GetAllPurchaseOrder(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetAllPurchaseOrder(ProdId);
                return result.ToList();
            }
        }


        public List<GetPOLines_Result> GetPOLines(int POID, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPOLines(POID, ProdID);
                return result.ToList();
            }
        }
        public List<GetPODetail_Result> GetPODetail(int POID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPODetail(POID);
                return result.ToList();
            }
        }

        public int UpdatePO(POClass ObjPO)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var strPO = ObjPO.objPO;
                    var strPOD = ObjPO.objPOLine;

                    var result = DBContext.UpdatePO(
                        strPO.POID, strPO.PONumber, strPO.CompanyID, strPO.VendorID, strPO.VendorName
                        , strPO.ThirdParty, strPO.WorkRegion, strPO.Description, strPO.OriginalAmount
                        , strPO.AdjustmentTotal, strPO.RelievedTotal, strPO.BalanceAmount
                        , strPO.BatchNumber, strPO.ClosePOuponPayment, strPO.Payby, strPO.Status, strPO.CreatedBy
                        , strPO.ProdID, strPO.PODate, strPO.ClosePeriodId).FirstOrDefault();

                    foreach (var item in strPOD)
                    {
                        var rtn = DBContext.SaveUpdatePurchaseOrderLine(
                            item.POlineID
                            ,Convert.ToInt32(result), item.COAID, item.Amount
                            ,item.ManualAdjustment, item.ClearedAmount
                            ,item.AdjustMentTotal, item.RelievedTotal, item.AvailToRelieve, item.DisplayAmount
                            ,item.LineDescription, item.POLinestatus, item.COAString
                            , item.Transactionstring, item.CreatedBy, item.ProdID, item.ThirdPartyVendor, item.SetID, item.SeriesID, item.TaxCode
                 );



                    }


                    return 0;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetPONumber_Result> GetPONumber(int ProdID, int VendorId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPONumber(ProdID, VendorId);
                return result.ToList();
            }
        }
        public List<GetPONumberForCompany_Result> GetPONumberForCompany(string companyCode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPONumberForCompany(companyCode);
                return result.ToList();
            }
        }
        public void DeletePoById(int POId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.DeletePoById(POId);

            }
        }
        public List<GetInvoiceNoByCompanyCode_Result> GetInvoiceNoByCompanyCode(string companyCode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetInvoiceNoByCompanyCode(companyCode);
                return result.ToList();
            }
        }
        public string SaveInvoice(InvoiceClass ObjInv)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (var dbContextTransaction = DBContext.Database.BeginTransaction())
            {
                try
                {
                    var strIn = ObjInv.objIn;
                    var strInLine = ObjInv.objInLine;
                    var result = DBContext.InsertupdateInvoice(strIn.InvoiceID, strIn.InvoiceNumber, strIn.CompanyID,
                        strIn.VendorID, strIn.VendorName, strIn.ThirdParty, strIn.WorkRegion, strIn.Description, strIn.OriginalAmount,
                        strIn.CurrentBalance, strIn.NewItemamount, strIn.Newbalance, strIn.BatchNumber, strIn.BankID, strIn.InvoiceDate,
                        strIn.DueDate, strIn.Payby, strIn.CheckGroupnumber, strIn.CheckNumber, strIn.InvoiceStatus, strIn.CreatedBy, strIn.ProdID,
                        strIn.Amount, strIn.ClosePeriodID, strIn.RequiredTaxCode).FirstOrDefault();

                    int strInId = Convert.ToInt32(result);
                    foreach (var item in strInLine)
                    {
                        var ret = DBContext.InsertupdateInvoiceLine(item.InvoiceLineID, strInId, item.COAID, item.Amount,
                            item.LineDescription, item.InvoiceLinestatus, item.COAString, item.Transactionstring,
                            item.POlineID, item.CreatedBy, item.ProdID, item.PaymentID, item.SetID, item.SeriesID, item.ClearedFlag, item.TaxCode, item.rowID);
                    }

                    var JEResult = DBContext.InsertUpdateJEByInvoice(strInId).FirstOrDefault();
                    dbContextTransaction.Commit();
                    return JEResult.ToString() + "." + strInId.ToString();
                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }

        }
        public List<GetPendingInvoiceList_Result> GetPendingInvoiceList(int Prodid)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPendingInvoiceList(Prodid);
                return result.ToList();
            }
        }
        public List<UpdateInvoiceStatus_Result> UpdateInvoiceStatus(int InvoiceId, int CreatedBy, int ProdId)
        {


            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateInvoiceStatus(InvoiceId, CreatedBy, ProdId);
                return result.ToList();
            }
        }


        public List<GetInvoiceListPosted_Result> GetInvoiceListPosted(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetInvoiceListPosted(ProdId);
                return result.ToList();

            }
        }

        public List<GetPOLinesNotInInvoice_Result> GetPOLinesNotInInvoice(int POID, int ProdID, int VendorId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPOLinesNotInInvoice(POID, ProdID, VendorId);
                return result.ToList();
            }
        }

        public List<GetInvoiceListForPayment_Result> GetInvoiceListForPayment(int ProdId, int BankId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetInvoiceListForPayment(ProdId, BankId);
                return result.ToList();
            }
        }
        public int GetCheckNumberForPayment(int BankId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCheckNumberForPayment(BankId, ProdId).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public List<GetClosePeriodFortransaction_Result> GetClosePeriodFortransaction(int CompanyId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetClosePeriodFortransaction(CompanyId);
                return result.ToList();
            }
        }
        public List<GetBankInfoByCompanyId_Result> GetBankInfoByCompanyId(int CompanyId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetBankInfoByCompanyId(CompanyId, ProdId);
                return result.ToList();
            }
        }
        public List<GetListOfInvoiceById_Result> GetListOfInvoiceById(int InvoiceId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetListOfInvoiceById(InvoiceId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetInvoiceLineDetailById_Result> GetInvoiceLineDetailById(int InvoiceId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetInvoiceLineDetailById(InvoiceId, ProdId);
                return result.ToList();
            }
        }
        public int DeleteInvoiceLine(List<DeleteInvoiceLineClass> InClass)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                foreach (var item in InClass)
                {
                    var result = DBContext.DeleteInvoiceLine(item.POLineID, item.InvoiceLineID, item.InvoiceID).FirstOrDefault();
                   // return Convert.ToInt32(result);
                }
                return 0;
            }
        }
        public int CheckPONumber(string PONumber, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CheckPONumber(PONumber, ProdId).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public void UpdatePOStatusClose(int POId, int prodId, string status)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdatePOStatusClose(POId, prodId, status);

            }
        }
        public int CheckInvoiceNumberVendorId(string InvoiceNumber, int InvoiceId, int VendorId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CheckInvoiceNumberVendorId(InvoiceNumber,InvoiceId, VendorId, ProdId).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public int SavePayment(PaymentClass ObjPay)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var ssPayment = ObjPay.objPayment;
                var sspaymentLine = ObjPay.objPaymentLine;
                foreach (var item in ssPayment)
                {
                    var sspaymentId = item.PaymentId;
                    var result = DBContext.InsertPayment(
                        item.GroupNumber, item.VendorId, item.PaidAmount, item.CheckDate, item.CheckNumber,
                        item.BankId, item.Status, item.PayBy, item.PaymentDate, item.Memo, item.BatchNumber,
                        item.ProdId, item.CreatedBy).FirstOrDefault();
                    int sspayment = Convert.ToInt32(result);
                    for (var i = 0; i < sspaymentLine.Count; i++)
                    {
                        if (sspaymentLine[i].PaymentId == sspaymentId)
                        {
                            var ret = DBContext.InsertPaymentLine(
                                sspayment, sspaymentLine[i].InvoiceId, sspaymentLine[i].InvoiceAmount,
                                sspaymentLine[i].CreatedBy, sspaymentLine[i].ProdId
                                );
                        }
                    }

                }
            }
            return 0;
        }

        public void UpdatePaymentStatus(string Status, string PaymentId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                DBContext.UpdatePaymentStatus(Status, PaymentId, ProdId);

            }
        }
        public List<GetPaymentList_Result> GetPaymentList(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPaymentList(ProdId);
                return result.ToList();
            }
        }
        public int DeletePOLine(int POLineId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.DeletePOLine(POLineId);
                return 0;
            }
        }
        public void DeleteInvoiceByInvoiceId(int InvoiceId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                DBContext.DeleteInvoiceByInvoiceId(InvoiceId, ProdId);
            }
        }

        ////////////////// Petty Cash

        public int CheckCustodianDuplicacy(int CustodianID, string CustodianCode, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CheckCustodianDuplicacy(CustodianID, CustodianCode, ProdId).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public int InsertupdateCustodian(Custodian _cust)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.InsertupdateCustodian(
                    _cust.CustodianID,
                    _cust.CustodianCode,
                    _cust.Currency,
                    _cust.VendorID,
                    _cust.COAID,
                    _cust.COACode,
                    _cust.Setid,
                    _cust.SeriesID,
                    _cust.Prodid,
                    _cust.CompanyID,
                    _cust.Createdy,
                    _cust.Status

                    ).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public List<GetListOfCustodian_Result> GetListOfCustodian(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetListOfCustodian(ProdId);
                return result.ToList();
            }

        }
        public List<GetRecipientVendorList_Result> GetRecipientVendorList(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetRecipientVendorList(ProdId);
                return result.ToList();
            }
        }
        public int InsertRecipient(Recipient _re)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.InsertRecipient(
                    _re.RecipientID, _re.VendorID, _re.COAID, _re.Prodid, _re.Createdby, _re.CoaString,
                    _re.SetId, _re.SeriesId,_re.Status).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }


        public List<GetPCEnvelopList_Result> GetPCEnvelopList(int ProdId, String Status)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPCEnvelopList(ProdId, Status);
                return result.ToList();
            }
        }
        public int SavePCEnvelope(PCEnvelopeClass _PC)
        {
            var objPC = _PC.objPC;
            var ObjPCLine = _PC.ObjPCLine;

            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (var dbContextTransaction = DBContext.Database.BeginTransaction())
            {
                try
                {
                    var result = DBContext.InsertUpdatePCEnvelope(
                        objPC.PcEnvelopeID, objPC.Companyid, objPC.BatchNumber, objPC.CustodianId, objPC.RecipientId,
                        objPC.EnvelopeNumber, objPC.Description, objPC.AdvanceAmount, objPC.EnvelopeAmount, objPC.LineItemAmount, objPC.Difference,
                        objPC.PostedDate, objPC.Status, objPC.CreatedBy, objPC.Prodid, objPC.PostedBy, objPC.ClosePeriodId, objPC.CurrencyDocument
                    ).FirstOrDefault();

                    foreach (var item in ObjPCLine)
                    {
                        var rr = DBContext.InsertUpdatePCEnvelopeLine(
                            item.EnvelopeLineID, Convert.ToInt32(result), item.TransactionLineNumber, item.COAID, item.Amount,
                            item.VendorID, item.LineDescription, item.TransactionCodeString, item.Setid,
                            item.SeriesID, item.Prodid, item.CreatedBy, item.CoaString, item.TaxCode, item.Displayflag
                        ).SingleOrDefault();
                    }

                    var strResult = DBContext.InsertUpdateJEPCEnvelope(Convert.ToInt32(result)).FirstOrDefault();
                    dbContextTransaction.Commit();
                    return Convert.ToInt32(strResult);
                } catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    throw ex;
                }
            }

        }
        public List<GetCustodianCode_Result> GetCustodianCode(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCustodianCode(ProdId);
                return result.ToList();
            }
        }
        public List<GetRecipientList_Result> GetRecipientList(int ProdId) 
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetRecipientList(ProdId);
                return result.ToList();
            }
        }
        public int CheckPCEnvelopeNumberDuplicacy(string EnvelopeNumber, int PcEnvelopeID, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.CheckPCEnvelopeNumberDuplicacy(EnvelopeNumber, PcEnvelopeID, ProdId).FirstOrDefault();
                return Convert.ToInt32(result);
            }
        }
        public List<GetCoaDetailforCustodian_Result> GetCoaDetailforCustodian(string CoaCode, int ProdId, int CustodianId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCoaDetailforCustodian(CoaCode, ProdId, CustodianId);
                return result.ToList();
            }
        }
        public List<GetVendorListForCustodian_Result> GetVendorListForCustodian(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetVendorListForCustodian(ProdId);
                return result.ToList();
            }
        }

        public List<GetAccountListForRecipient_Result> GetAccountListForRecipient(string CoaCode, int ProdId, int RecipientId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetAccountListForRecipient(CoaCode, ProdId, RecipientId);
                return result.ToList();
            }
        }
        // LAst
        public List<updatePCEnvelopeStatus_Result> updatePCEnvelopeStatus(string PCEnvelopId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.updatePCEnvelopeStatus(PCEnvelopId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetDetailPCEnvelopeById_Result> GetDetailPCEnvelopeById(int PcEnvelopeId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetDetailPCEnvelopeById(PcEnvelopeId);
                return result.ToList();
            }
        }
        public List<GetPCEnvelopeLineDetailById_Result> GetPCEnvelopeLineDetailById(int PcEnvelopeId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPCEnvelopeLineDetailById(PcEnvelopeId);
                return result.ToList();
            }
        }
        public int UpdatePCEnvelopeClosePeriod(int PCEnvelopeId, int ClosePeriodId, int Prodid)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdatePCEnvelopeClosePeriod(PCEnvelopeId, ClosePeriodId, Prodid).FirstOrDefault();
                return Convert.ToInt32(result);

            }
        }
        public void DeletePCEnvelopeById(int PCEnvelopeId, int ProdId, string Detail)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.DeletePCEnvelopeById(PCEnvelopeId, ProdId, Detail);
            }
        }
        public int GetPCEnvelopeReverse(int PCEnvelopdID, string BatchNumber, int CreatedBy, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetPCEnvelopeReverse(PCEnvelopdID, BatchNumber, CreatedBy, ProdID).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int JEReverseByInvoice(int InvoiceId, bool ReIssue)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.JEReverseByInvoice(InvoiceId, ReIssue).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public int CheckJEReverseByInvoice(int InvoiceId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.CheckJEReverseByInvoice(InvoiceId).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<APInvoicesList_Result> APInvoicesList(bool paid, int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.APInvoicesList(paid, ProdID).ToList();
                    //return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
