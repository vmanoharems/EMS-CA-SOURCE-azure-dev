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
    public class POInvoiceBussiness
    {
        POInvoiceData DataContext = new POInvoiceData();
        public List<GetVendorAddress_Result> GetVendorAddress(int VendorID)
        {
            var result = DataContext.GetVendorAddress(VendorID);
            return result;
        }

        public List<GetVendorAddPO_Result> GetVendorAddPO(int ProdID)
        {
            var result = DataContext.GetVendorAddPO(ProdID);
            return result;
        }

        public POClass SavePO(POClass ObjPO)
        {
            POClass result = DataContext.SavePO(ObjPO);
            return result;
        }

        public List<GetAllPurchaseOrder_Result> GetAllPurchaseOrder(int ProdId)
        {
            var result = DataContext.GetAllPurchaseOrder(ProdId);
            return result;
        }

        public List<GetPOLines_Result> GetPOLines(int POID, int ProdID)
        {
            var result = DataContext.GetPOLines(POID, ProdID);
            return result;
        }
        public List<GetPODetail_Result> GetPODetail(int POID)
        {
            var result = DataContext.GetPODetail(POID);
            return result;
        }

        public int UpdatePO(POClass ObjPO)
        {
            var result = DataContext.UpdatePO(ObjPO);
            return result;
        }

        public List<GetPONumber_Result> GetPONumber(int ProdID, int VendorId)
        {
            var result = DataContext.GetPONumber(ProdID, VendorId);
            return result;
        }
        public List<GetPONumberForCompany_Result> GetPONumberForCompany(string companyCode)
        {
            var result = DataContext.GetPONumberForCompany(companyCode);
            return result;
        }
        public void DeletePoById(int POId)
        {
            DataContext.DeletePoById(POId);
        }
        public List<GetInvoiceNoByCompanyCode_Result> GetInvoiceNoByCompanyCode(string companyCode)
        {
            var result = DataContext.GetInvoiceNoByCompanyCode(companyCode);
            return result;
        }
        public string SaveInvoice(InvoiceClass ObjInv)
        {
            string result = DataContext.SaveInvoice(ObjInv);
            return result;
        }


        
        public List<GetPendingInvoiceList_Result> GetPendingInvoiceList(int Prodid)
        {
            var result = DataContext.GetPendingInvoiceList(Prodid);
            return result;
        }
        public List<string> UpdateInvoiceStatus(string InvoiceId, int CreatedBy, int ProdId)
        {
            List<string> ResultReturns = new List<string>();
              var strsplit = InvoiceId.Split(',');
              for (var i = 0; i < strsplit.Length; i++)
              {
                  var result = DataContext.UpdateInvoiceStatus(Convert.ToInt32(strsplit[i]), CreatedBy, ProdId);
                  ResultReturns.Add($"{result.First().InvoiceNo},{result.Last().TransactionNo},{result.Last().JEID}");
              }
              return ResultReturns;
        }
        public List<APInvoicesList_Result> APInvoicesOpenInvoicesList(bool paid, int ProdId)
        {
            return DataContext.APInvoicesList(paid, ProdId).ToList();
            //return result;
        }
        public List<GetInvoiceListPosted_Result> GetInvoiceListPosted(int ProdId)
        {
            var result = DataContext.GetInvoiceListPosted(ProdId);
            return result;
        }
        public List<GetPOLinesNotInInvoice_Result> GetPOLinesNotInInvoice(int POID, int ProdID, int VendorId)
        {
            var result = DataContext.GetPOLinesNotInInvoice(POID, ProdID, VendorId);
            return result;
        }
        public List<GetInvoiceListForPayment_Result> GetInvoiceListForPayment(int ProdId, int BankId)
        {
            var result = DataContext.GetInvoiceListForPayment(ProdId, BankId);
            return result;
        }
        public int GetCheckNumberForPayment(int BankId, int ProdId)
        {
            var result = DataContext.GetCheckNumberForPayment(BankId, ProdId);
            return result;
        }
        public List<GetClosePeriodFortransaction_Result> GetClosePeriodFortransaction(int CompanyId)
        {
            var result = DataContext.GetClosePeriodFortransaction(CompanyId);
            return result;
        }
        public List<GetBankInfoByCompanyId_Result> GetBankInfoByCompanyId(int CompanyId, int ProdId)
        {
            var result = DataContext.GetBankInfoByCompanyId(CompanyId, ProdId);
            return result;
        }
        public List<GetListOfInvoiceById_Result> GetListOfInvoiceById(int InvoiceId)
        {
            var result = DataContext.GetListOfInvoiceById(InvoiceId);
            return result;
        }
        public List<GetInvoiceLineDetailById_Result> GetInvoiceLineDetailById(int InvoiceId, int ProdId)
        {
            var result = DataContext.GetInvoiceLineDetailById(InvoiceId, ProdId);
            return result;
        }
        public int DeleteInvoiceLine(List<DeleteInvoiceLineClass> InClass )
        {
            var result = DataContext.DeleteInvoiceLine(InClass);
            return result;
        }
        public int CheckPONumber(string PONumber, int ProdId)
        {
            var result = DataContext.CheckPONumber(PONumber, ProdId);
            return result;
        }
        public void UpdatePOStatusClose(int POId, int prodId, string status)
        {
            DataContext.UpdatePOStatusClose(POId, prodId, status);

        }
        public int CheckInvoiceNumberVendorId(string InvoiceNumber, int InvoiceId, int VendorId, int ProdId)
        {
            var result = DataContext.CheckInvoiceNumberVendorId(InvoiceNumber,InvoiceId, VendorId, ProdId);
            return result;
        }
        public int SavePayment(PaymentClass ObjPay)
        {
            var result = DataContext.SavePayment(ObjPay);
            return result;
        }
        public void UpdatePaymentStatus(string Status, string PaymentId, int ProdId)
        {
            DataContext.UpdatePaymentStatus(Status, PaymentId, ProdId);
        }
        public List<GetPaymentList_Result> GetPaymentList(int ProdId)
        {
            var result = DataContext.GetPaymentList(ProdId);
            return result;

        }
        public int DeletePOLine(int POLineId)
        {
            var result = DataContext.DeletePOLine(POLineId);
            return result;

        }
        public void DeleteInvoiceByInvoiceId(int InvoiceId, int ProdId)
        {
            DataContext.DeleteInvoiceByInvoiceId(InvoiceId, ProdId);
        }
        public int CheckCustodianDuplicacy(int CustodianID, string CustodianCode, int ProdId)
        {
            var result = DataContext.CheckCustodianDuplicacy(CustodianID, CustodianCode, ProdId);
            return result;
        }
        public int InsertupdateCustodian(Custodian _cust)
        {
            var result = DataContext.InsertupdateCustodian(_cust);
            return result;
        }
        public List<GetListOfCustodian_Result> GetListOfCustodian(int ProdId)
        {
            var result = DataContext.GetListOfCustodian(ProdId);
            return result;
        }
        public List<GetRecipientVendorList_Result> GetRecipientVendorList(int ProdId)
        {
            var result = DataContext.GetRecipientVendorList(ProdId);
            return result;
        }
        public int InsertRecipient(Recipient _re)
        {
            var result = DataContext.InsertRecipient(_re);
            return result;
        }
        public List<GetPCEnvelopList_Result> GetPCEnvelopList(int ProdId, string Status)
        {
            var result = DataContext.GetPCEnvelopList(ProdId, Status);
            return result;
        }
        public int SavePCEnvelope(PCEnvelopeClass _PC)
        {
            var result = DataContext.SavePCEnvelope(_PC);
            return result;
        }
        public List<GetCustodianCode_Result> GetCustodianCode(int ProdId)
        {
            var result = DataContext.GetCustodianCode(ProdId);
            return result;
        }
        public List<GetRecipientList_Result> GetRecipientList(int ProdId) 
        {
            var result = DataContext.GetRecipientList(ProdId);

            return result;
        }
        public int CheckPCEnvelopeNumberDuplicacy(string EnvelopeNumber, int PcEnvelopeID, int ProdId)
        {
            var result = DataContext.CheckPCEnvelopeNumberDuplicacy(EnvelopeNumber, PcEnvelopeID, ProdId);
            return result;
        }
        public List<GetCoaDetailforCustodian_Result> GetCoaDetailforCustodian(string CoaCode, int ProdId, int CustodianId)
        {
            var result = DataContext.GetCoaDetailforCustodian(CoaCode, ProdId, CustodianId);
            return result;
        }
        public List<GetVendorListForCustodian_Result> GetVendorListForCustodian(int ProdId)
        {
            var result = DataContext.GetVendorListForCustodian(ProdId);
            return result;
        }
        public List<GetAccountListForRecipient_Result> GetAccountListForRecipient(string CoaCode, int ProdId, int RecipientId)
        {
            var result = DataContext.GetAccountListForRecipient(CoaCode, ProdId, RecipientId);
            return result;
        }
        public List<updatePCEnvelopeStatus_Result> updatePCEnvelopeStatus(string PCEnvelopId)
        {
          return  DataContext.updatePCEnvelopeStatus(PCEnvelopId);

        }
        public List<GetDetailPCEnvelopeById_Result> GetDetailPCEnvelopeById(int PcEnvelopeId)
        {
            var result = DataContext.GetDetailPCEnvelopeById(PcEnvelopeId);
            return result;
        }
        public List<GetPCEnvelopeLineDetailById_Result> GetPCEnvelopeLineDetailById(int PcEnvelopeId)
        {
            var result = DataContext.GetPCEnvelopeLineDetailById(PcEnvelopeId);
            return result;
        }
        public int UpdatePCEnvelopeClosePeriod(int PCEnvelopeId, int ClosePeriodId, int Prodid)
        {
          return  DataContext.UpdatePCEnvelopeClosePeriod(PCEnvelopeId, ClosePeriodId, Prodid);
        }
        public void DeletePCEnvelopeById(int PCEnvelopeId, int ProdId, string Detail)
        {
            DataContext.DeletePCEnvelopeById( PCEnvelopeId,  ProdId,  Detail);
        }
        public int GetPCEnvelopeReverse(int PCEnvelopdID, string BatchNumber, int CreatedBy, int ProdID)
        {
            return DataContext.GetPCEnvelopeReverse(PCEnvelopdID, BatchNumber, CreatedBy, ProdID);
        }
        public int JEReverseByInvoice(int InvoiceId, bool ReIssue)
        {
            return DataContext.JEReverseByInvoice(InvoiceId, ReIssue);
        }

        public int CheckJEReverseByInvoice(int InvoiceId)
        {
            return DataContext.CheckJEReverseByInvoice(InvoiceId);
        }
        public List<APInvoicesList_Result> APInvoicesList(bool paid, int ProdID)
        {
            return DataContext.APInvoicesList(paid, ProdID).ToList();
            //return result.ToList();
        }


    }
}
