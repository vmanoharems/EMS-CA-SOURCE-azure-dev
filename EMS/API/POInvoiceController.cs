using System;
using System.Collections.Generic;
using System.Web.Http;
using EMS.Entity;
using EMS.Business;
using System.Web;

using EMS.Controllers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/POInvoice")]

    public class POInvoiceController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        protected CustomPrincipal CurrentUser
        { get { return HttpContext.Current.User as CustomPrincipal; } }
        protected int Execute(string APITOKEN = null)
        {
            try
            {
                if (this.CurrentUser == null)
                    return -1;//"Authorization Failed!";
                if (this.CurrentUser.Identity != null || APITOKEN != null)//this.CurrentUser.IsInRole("Admin") ||
                    return 0;//"Success"
                else
                    return 1;//"ClientID is not valid!";
            }
            catch { return 99; }
        }

        POInvoiceBussiness BusinessContext = new POInvoiceBussiness();


        [Route("GetVendorAddress")]
        [HttpGet]
        public List<GetVendorAddress_Result> GetVendorAddress(int VendorID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetVendorAddress(VendorID);
            }
            else
            {
                List<GetVendorAddress_Result> n = new List<GetVendorAddress_Result>();
                return n;
            }

        }


        [Route("GetVendorAddPO")]
        [HttpGet, HttpPost]
        public List<GetVendorAddPO_Result> GetVendorAddPO(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetVendorAddPO(ProdID);
            }
            else
            {
                List<GetVendorAddPO_Result> n = new List<GetVendorAddPO_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("POAdd")]
        [HttpPost]
        public POClass POAdd(POClass ObjPO)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.SavePO(ObjPO);
            }
            else
            {
                //return new POClass();
                throw new Exception("USER ACCESS DENIED");
            }
        }

        [Route("GetAllPurchaseOrder")]
        [HttpPost]
        public List<GetAllPurchaseOrder_Result> GetAllPurchaseOrder(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetAllPurchaseOrder(ProdId);
            }
            else
            {
                List<GetAllPurchaseOrder_Result> n = new List<GetAllPurchaseOrder_Result>();
                return n;
            }
        }

        [Route("GetPOLines")]
        [HttpGet]
        public List<GetPOLines_Result> GetPOLines(int POID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPOLines(POID, ProdID);
            }
            else
            {
                List<GetPOLines_Result> n = new List<GetPOLines_Result>();
                return n;
            }
        }

        [Route("GetPODetail")]
        [HttpGet]
        public List<GetPODetail_Result> GetPODetail(int POID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPODetail(POID);
            }
            else
            {
                List<GetPODetail_Result> n = new List<GetPODetail_Result>();
                return n;
            }
        }

        [AllowAnonymous]
        [Route("UpdatePO")]
        [HttpPost]
        public int UpdatePO(POClass ObjPO)
        {
            return BusinessContext.UpdatePO(ObjPO);
        }



        [Route("GetPONumber")]
        [HttpGet, HttpPost]
        public List<GetPONumber_Result> GetPONumber(int ProdID, int VendorId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPONumber(ProdID, VendorId);
            }
            else
            {
                List<GetPONumber_Result> n = new List<GetPONumber_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetPONumberForCompany")]
        [HttpPost]
        public List<GetPONumberForCompany_Result> GetPONumberForCompany(string companyCode)
        {

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPONumberForCompany(companyCode);
            }
            else
            {
                List<GetPONumberForCompany_Result> p = new List<GetPONumberForCompany_Result>();
                return p;
            }
        }

        // [AllowAnonymous]
        [Route("DeletePoById")]
        [HttpPost]
        public void DeletePoById(int POId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.DeletePoById(POId);
            }
        }
        [Route("GetInvoiceNoByCompanyId")]
        [HttpPost]
        public List<GetInvoiceNoByCompanyCode_Result> GetInvoiceNoByCompanyCode(string companyCode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetInvoiceNoByCompanyCode(companyCode);
            }
            else
            {
                List<GetInvoiceNoByCompanyCode_Result> n = new List<GetInvoiceNoByCompanyCode_Result>();
                return n;
            }
        }
        [Route("SaveInvoice")]
        [HttpPost]
        public string SaveInvoice(InvoiceClass ObjInv)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                string returnvalue = BusinessContext.SaveInvoice(ObjInv);
                return returnvalue;
            }
            else
            {
                return "0";
            }
        }
        [Route("GetPendingInvoiceList")]
        [HttpPost]
        public List<GetPendingInvoiceList_Result> GetPendingInvoiceList(int Prodid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPendingInvoiceList(Prodid);
            }
            else
            {
                List<GetPendingInvoiceList_Result> n = new List<GetPendingInvoiceList_Result>();
                return n;
            }
        }
        // Obsolete with LedgerCollection feature
        //[Route("UpdateInvoiceStatus")]
        //[HttpPost]
        //public List<string> UpdateInvoiceStatus(string InvoiceId, int CreatedBy, int ProdId)
        //{
        //    if (this.Execute(this.CurrentUser.APITOKEN) == 0)
        //    {
        //        return BusinessContext.UpdateInvoiceStatus(InvoiceId, CreatedBy, ProdId);
        //    }
        //    else
        //    {
        //        List<string> n = new List<string>();
        //        return n;
        //    }
        //}

        [Route("GetInvoiceListPosted")]
        [HttpPost]
        public List<GetInvoiceListPosted_Result> GetInvoiceListPosted(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetInvoiceListPosted(ProdId);
            }
            else
            {
                List<GetInvoiceListPosted_Result> n = new List<GetInvoiceListPosted_Result>();
                return n;
            }
        }
        [Route("GetPOLinesNotInInvoice")]
        [HttpPost]
        public List<GetPOLinesNotInInvoice_Result> GetPOLinesNotInInvoice(int POID, int ProdID, int VendorId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPOLinesNotInInvoice(POID, ProdID, VendorId);
            }
            else
            {
                List<GetPOLinesNotInInvoice_Result> n = new List<GetPOLinesNotInInvoice_Result>();
                return n;
            }
        }
        [Route("GetInvoiceListForPayment")]
        [HttpPost]
        public List<GetInvoiceListForPayment_Result> GetInvoiceListForPayment(int ProdId, int BankId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetInvoiceListForPayment(ProdId, BankId);
            }
            else
            {
                List<GetInvoiceListForPayment_Result> n = new List<GetInvoiceListForPayment_Result>();
                return n;
            }
        }
        [Route("GetCheckNumberForPayment")]
        [HttpPost]
        public int GetCheckNumberForPayment(int BankId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCheckNumberForPayment(BankId, ProdId);
            }
            else
            {
                return 0;
            }
        }
        [Route("GetClosePeriodFortransaction")]
        [HttpPost]
        public List<GetClosePeriodFortransaction_Result> GetClosePeriodFortransaction(int CompanyId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetClosePeriodFortransaction(CompanyId);
            }
            else
            {
                List<GetClosePeriodFortransaction_Result> n = new List<GetClosePeriodFortransaction_Result>();
                return n;
            }
        }
        [Route("GetBankInfoByCompanyId")]
        [HttpPost]
        public List<GetBankInfoByCompanyId_Result> GetBankInfoByCompanyId(int CompanyId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetBankInfoByCompanyId(CompanyId, ProdId);
            }
            else
            {
                List<GetBankInfoByCompanyId_Result> n = new List<GetBankInfoByCompanyId_Result>();
                return n;
            }
        }
        [Route("GetListOfInvoiceById")]
        [HttpPost]
        public List<GetListOfInvoiceById_Result> GetListOfInvoiceById(int InvoiceId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetListOfInvoiceById(InvoiceId);
            }
            else
            {
                List<GetListOfInvoiceById_Result> n = new List<GetListOfInvoiceById_Result>();
                return n;
            }
        }
        [Route("GetInvoiceLineDetailById")]
        [HttpPost]
        public List<GetInvoiceLineDetailById_Result> GetInvoiceLineDetailById(int InvoiceId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetInvoiceLineDetailById(InvoiceId, ProdId);
            }
            else
            {
                List<GetInvoiceLineDetailById_Result> n = new List<GetInvoiceLineDetailById_Result>();
                return n;
            }
        }
        [Route("DeleteInvoiceLine")]
        [HttpPost]
        public int DeleteInvoiceLine(List<DeleteInvoiceLineClass> InClass)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.DeleteInvoiceLine(InClass);
            }
            else
            {
                return 0;
            }
        }
        [Route("CheckPONumber")]
        [HttpPost]
        public int CheckPONumber(string PONumber, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckPONumber(PONumber, ProdId);
            }
            else
            {
                return 0;
            }
        }
        [Route("UpdatePOStatusClose")]
        [HttpPost]
        public void UpdatePOStatusClose(int POId, int prodId, string status)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.UpdatePOStatusClose(POId, prodId, status);
            }
            else
            {

            }
        }
        [Route("CheckInvoiceNumberVendorId")]
        [HttpPost]
        public int CheckInvoiceNumberVendorId(string InvoiceNumber, int InvoiceId, int VendorId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckInvoiceNumberVendorId(InvoiceNumber, InvoiceId, VendorId, ProdId);
            }
            else
            {
                return 0;
            }
        }
        [Route("SavePayment")]
        [HttpPost]
        public int SavePayment(PaymentClass ObjPay)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.SavePayment(ObjPay);
            }
            else
            {
                return 0;
            }
        }
        [Route("UpdatePaymentStatus")]
        [HttpPost]
        public void UpdatePaymentStatus(string Status, string PaymentId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.UpdatePaymentStatus(Status, PaymentId, ProdId);
            }
            else
            {

            }
        }
        [Route("GetPaymentList")]
        [HttpPost]
        public List<GetPaymentList_Result> GetPaymentList(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPaymentList(ProdId);

            }
            else
            {
                List<GetPaymentList_Result> n = new List<GetPaymentList_Result>();
                return n;
            }
        }
        [Route("DeletePOLine")]
        [HttpPost]
        public int DeletePOLine(int POLineId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.DeletePOLine(POLineId);

            }
            else
            {

                return 0;
            }
        }
        [Route("DeletePOLine")]
        [HttpPost]
        public void DeleteInvoiceByInvoiceId(int InvoiceId, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.DeleteInvoiceByInvoiceId(InvoiceId, ProdId);
            }

        }

        [Route("CheckCustodianDuplicacy")]
        [HttpPost]
        public int CheckCustodianDuplicacy(int CustodianID, string CustodianCode, int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckCustodianDuplicacy(CustodianID, CustodianCode, ProdId);
            }
            else
            {
                return 0;
            }
        }
        [Route("InsertupdateCustodian")]
        [HttpPost]
        public int InsertupdateCustodian(Custodian _cust)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.InsertupdateCustodian(_cust);
            }
            else
            {
                return 0;
            }
        }
        [Route("GetListOfCustodian")]
        [HttpPost]
        public List<GetListOfCustodian_Result> GetListOfCustodian(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetListOfCustodian(ProdId);
            }
            else
            {
                List<GetListOfCustodian_Result> n = new List<GetListOfCustodian_Result>();
                return n;
            }
        }
        [Route("GetRecipientVendorList")]
        [HttpPost]
        public List<GetRecipientVendorList_Result> GetRecipientVendorList(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetRecipientVendorList(ProdId);
            }
            else
            {
                List<GetRecipientVendorList_Result> n = new List<GetRecipientVendorList_Result>();
                return n;
            }
        }
        [Route("InsertRecipient")]
        [HttpPost]
        public int InsertRecipient(Recipient _re)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.InsertRecipient(_re);
            }
            else
            {
                return 0;
            }
        }

        [Route("GetPCEnvelopList")]
        [HttpPost]
        public List<GetPCEnvelopList_Result> GetPCEnvelopList(int ProdId, string Status)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPCEnvelopList(ProdId, Status);
            }
            else
            {
                List<GetPCEnvelopList_Result> n = new List<GetPCEnvelopList_Result>();
                return n;
            }
        }

        [Route("SavePCEnvelope")]
        [HttpPost]
        public int SavePCEnvelope(PCEnvelopeClass _PC)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.SavePCEnvelope(_PC);
            }
            else
            {
                return 0;

            }
        }

        [Route("GetCustodianCode")]
        [HttpPost]
        public List<GetCustodianCode_Result> GetCustodianCode(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCustodianCode(ProdId);
            }
            else
            {
                List<GetCustodianCode_Result> n = new List<GetCustodianCode_Result>();
                return n;
            }
        }

        [Route("GetRecipientList")]
        [HttpPost]
        public List<GetRecipientList_Result> GetRecipientList(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetRecipientList(ProdId);
            }
            else
            {
                List<GetRecipientList_Result> n = new List<GetRecipientList_Result>();
                return n;
            }
        }

        [Route("CheckPCEnvelopeNumberDuplicacy")]
        [HttpPost]
        public int CheckPCEnvelopeNumberDuplicacy(PCEnvelope OPCEnvelope)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckPCEnvelopeNumberDuplicacy(OPCEnvelope.EnvelopeNumber, OPCEnvelope.PcEnvelopeID, Convert.ToInt32(OPCEnvelope.Prodid));
            }
            else
            {
                return 0;
            }
        }
        [Route("GetCoaDetailforCustodian")]
        [HttpPost]
        public List<GetCoaDetailforCustodian_Result> GetCoaDetailforCustodian(string CoaCode, int ProdId, int CustodianId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCoaDetailforCustodian(CoaCode, ProdId, CustodianId);
            }
            else
            {
                List<GetCoaDetailforCustodian_Result> n = new List<GetCoaDetailforCustodian_Result>();
                return n;
            }
        }
        [Route("GetCoaDetailforCustodian")]
        [HttpPost]
        public List<GetVendorListForCustodian_Result> GetVendorListForCustodian(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetVendorListForCustodian(ProdId);
            }
            else
            {
                List<GetVendorListForCustodian_Result> n = new List<GetVendorListForCustodian_Result>();
                return n;
            }
        }
        [Route("GetAccountListForRecipient")]
        [HttpPost]
        public List<GetAccountListForRecipient_Result> GetAccountListForRecipient(string CoaCode, int ProdId, int RecipientId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetAccountListForRecipient(CoaCode, ProdId, RecipientId);
            }
            else
            {
                List<GetAccountListForRecipient_Result> n = new List<GetAccountListForRecipient_Result>();
                return n;
            }
        }

        // Obsolete due to LedgerCollection feature. This API should NOT be called directly anymore
        //[Route("updatePCEnvelopeStatus")]
        //[HttpPost]
        //public List<updatePCEnvelopeStatus_Result> updatePCEnvelopeStatus(string PCEnvelopId)
        //{
        //    if (this.Execute(this.CurrentUser.APITOKEN) == 0)
        //    {
        //        return BusinessContext.updatePCEnvelopeStatus(PCEnvelopId);
        //    }
        //    else
        //    {
        //        List<updatePCEnvelopeStatus_Result> n = new List<updatePCEnvelopeStatus_Result>();
        //        return n;
        //    }

        //}
        [Route("GetDetailPCEnvelopeById")]
        [HttpPost]
        public List<GetDetailPCEnvelopeById_Result> GetDetailPCEnvelopeById(int PcEnvelopeId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetDetailPCEnvelopeById(PcEnvelopeId);
            }
            else
            {
                List<GetDetailPCEnvelopeById_Result> n = new List<GetDetailPCEnvelopeById_Result>();
                return n;
            }
        }

        [Route("GetPCEnvelopeLineDetailById")]
        [HttpPost]
        public List<GetPCEnvelopeLineDetailById_Result> GetPCEnvelopeLineDetailById(int PcEnvelopeId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPCEnvelopeLineDetailById(PcEnvelopeId);
            }
            else
            {
                List<GetPCEnvelopeLineDetailById_Result> n = new List<GetPCEnvelopeLineDetailById_Result>();
                return n;
            }
        }

        [Route("UpdatePCEnvelopeClosePeriod")]
        [HttpPost]
        public int UpdatePCEnvelopeClosePeriod(int PCEnvelopeId, int ClosePeriodId, int Prodid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdatePCEnvelopeClosePeriod(PCEnvelopeId, ClosePeriodId, Prodid);
            }
            else
            {
                return 0;
            }
        }
        [Route("DeletePCEnvelopeById")]
        [HttpPost]
        public void DeletePCEnvelopeById(int PCEnvelopeId, int ProdId, string Detail)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                BusinessContext.DeletePCEnvelopeById(PCEnvelopeId, ProdId, Detail);
            }
        }
        [Route("GetPCEnvelopeReverse")]
        [HttpPost]
        public int GetPCEnvelopeReverse(JSONParameters callParameters)
        {
            JObject jsonO = JObject.Parse(callParameters.callPayload);


            int PCEnvelopdID = (int)jsonO["PCEnvelopeID"];
            string BatchNumber = jsonO["BatchNumber"].ToString();
            int CreatedBy = (int)jsonO["CreatedBy"];
            int ProdID = (int)jsonO["ProdID"];

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPCEnvelopeReverse(PCEnvelopdID, BatchNumber, CreatedBy, ProdID);
            }
            else
            {
                return -1;
            }
        }
        [Route("JEReverseByInvoice")]
        [HttpPost]
        public int JEReverseByInvoice(int InvoiceId, bool ReIssue)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.JEReverseByInvoice(InvoiceId, ReIssue);
            }
            else
            {
                return 0;
            }
        }


        [Route("CheckJEReverseByInvoice")]
        [HttpPost]
        public int CheckJEReverseByInvoice(int InvoiceId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckJEReverseByInvoice(InvoiceId);
            }
            else
            {
                return 2;
            }
        }
        [Route("APInvoicesOpenInvoicesList")]
        [HttpPost]
        public List<APInvoicesList_Result> APInvoicesOpenInvoicesList(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.APInvoicesList(false, ProdId);
            }
            else
            {
                List<APInvoicesList_Result> n = new List<APInvoicesList_Result>();
                return n;
            }
        }
        [Route("APInvoicesPaidInvoicesList")]
        [HttpPost]
        public List<APInvoicesList_Result> APInvoicesPaidInvoicesList(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.APInvoicesList(true, ProdID);
            }
            else
            {
                List<APInvoicesList_Result> n = new List<APInvoicesList_Result>();
                return n;
            }
        }

    }
}
