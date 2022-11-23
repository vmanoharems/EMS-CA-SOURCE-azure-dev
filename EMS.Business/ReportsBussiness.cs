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
    public class ReportsBussiness
    {
        ReportsData DataContext = new ReportsData();
        /*
        public List<APInvoiceFilter_Result> APInvoiceFilter(InvoiceReportsFilter AP)
        {
            return DataContext.APInvoiceFilter(AP);
        }
        */
        public List<ReportsLedgerJEPostingJSON_Result> ReportsLedgerJEPostingJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsLedgerJEPostingJSON(callParameters);
        }
        public List<ReportsLedgerJEExportJSON_Result> ReportsLedgerJEExportJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsLedgerJEExportJSON(callParameters);
        }
        public List<ReportsPettyCashFilterJSON_Result> ReportsPettyCashFilterJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsPettyCashFilterJSON(callParameters);
        }
        public List<ReportsLedgerTBJSON_Result> ReportsLedgerTBJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsLedgerTBJSON(callParameters);
        }
        public List<GetAllBatchNumber_Result> GetAllBatchNumber(int ProdId)
        {
            return DataContext.GetAllBatchNumber(ProdId);
        }
        public List<GEtAllUserInfo_Result> GEtAllUserInfo(int ProdId)
        {
            return DataContext.GEtAllUserInfo(ProdId);
        }
        public List<GetPeriodForBible_Result> GetPeriodForBible(int CompanyId)
        {
            return DataContext.GetPeriodForBible(CompanyId);
        }
        /*
        public List<POListingReports_Result> POListingReports(POListingReport PO)
        {
            return DataContext.POListingReports(PO);
        }
        */
        public List<LedgerBible_Result> LedgerBible(BibleReport BR)
        {
            return DataContext.LedgerBible(BR);
        }
        public List<ReportsLedgerBibleJSON_Result> ReportsLedgerBibleJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsLedgerBibleJSON(callParameters);
        }
        public List<GetReportVendorList_Result> GetReportVendorList(ReportVendorFilter Ven)
        {
            return DataContext.GetReportVendorList(Ven);
        }
        public List<ReportsVendorListingReportJson_Result> ReportsVendorListingReportJson(JSONParameters callParameters)
        {
            return DataContext.ReportsVendorListingReportJson(callParameters);
        }
        public List<ReportsVendorInqReportJSON_Result> ReportsVendorInqReportJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsVendorInqReportJSON(callParameters);
        }
        public List<ReportsVendorFolderReportJSON_Result> ReportsVendorFolderReportJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsVendorFolderReportJSON(callParameters);
        }
        public List<ReportsVendorMailingReportJSON_Result> ReportsVendorMailingReportJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsVendorMailingReportJSON(callParameters);
        }
        public List<GetCompanylistReport_Result> GetCompanylistReport(int ProdID)
        {
            return DataContext.GetCompanylistReport(ProdID);
        }
        public List<GetBanklistReport_Result> GetBanklistReport(int ProdID)
        {
            return DataContext.GetBanklistReport(ProdID);
        }
        public List<GetTransCodeValuByProdID_Result>GetTransCodeValuByProdID(int ProdID)
        {
            return DataContext.GetTransCodeValuByProdID(ProdID);
        }
        public List<LedgerInQuiry_Result> LedgerInQuiry(LdgerInQuiryFinal LE)
        {
            return DataContext.LedgerInQuiry(LE);
        }
        public List<LedgerShared_Result> ReportsLedgerInQuiryAccountJSON(string JSONparameters)
        {
            return DataContext.ReportsLedgerInQuiryAccountJSON(JSONparameters);
        }
        public List<LedgerInQuiryTransaction_Result> LedgerInQuiryTransaction(LdgerInQuiryFinal LE)
        {
            return DataContext.LedgerInQuiryTransaction(LE);
        }
        //=============//
        public List<ReportsVendorDetailReportJSON_Result> ReportsVendorDetailReportJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsVendorDetailReportJSON(callParameters);
        }
        public List<GetClosePeriodList_Result> GetClosePeriodList(int ProdID,int CID, int Mode)
        {
            var result = DataContext.GetClosePeriodList(ProdID,CID, Mode);
            return result.ToList();
        }
        public List<GetOpenPeriod_Result> GetOpenPeriod(int ProdID, int CID)
        {
            var result = DataContext.GetOpenPeriod(ProdID, CID);
            return result.ToList();
        }
         public List<ReportsInvoiceTransactionJSON_Result> ReportsInvoiceTransactionJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsInvoiceTransactionJSON(callParameters);
        }
      public List<ReportsInvoiceAccountJSON_Result> ReportsInvoiceAccountJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsInvoiceAccountJSON(callParameters);
        }
        public List<ReportsLedgerJEAuditJSON_Result> ReportsLedgerJEAuditJSON(JSONParameters callParameters)
        {
            return DataContext.ReportsLedgerJEAuditJSON(callParameters);
        }
        public List<GetCompanyNameByID_Result> GetCompanyNameByID(int CID)
        {
            var result = DataContext.GetCompanyNameByID(CID);
            return result.ToList();
        }
        public List<ReportsPOListingReportsJSON_Result> ReportsPOListing(JSONParameters callParameters)
        {
            var result = DataContext.ReportsPOListing(callParameters);
            return result;
        }
        public List<ReportsPOListingExportJSON_Result> ReportsPOListingExportJSON(JSONParameters callParameters)
        {
            var result = DataContext.ReportsPOListingExportJSON(callParameters);
            return result;
        }
   }
}