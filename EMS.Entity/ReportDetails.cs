using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Entity
{
  
    public class ReportDetails
    {
        public String ProductionName { get; set; }
        public String Company { get; set; }
        public String Bank { get; set; }
        public String Batch { get; set; }
        public String UserName { get; set; }
        public string Segment { get; set; }
        public string SegmentOptional { get; set; }
        public string TransCode { get; set; }
        public String SClassification { get; set; }
        public string SegmentOrder { get; set; }
    }
    public class InvoiceReportsFilter
    {
        public int CId { get; set; }
        public int BankId { get; set; }
        public string PeriodStatus { get; set; }
        public DateTime CreatedDateFrom { get; set; }
        public DateTime CreatedDateTo { get; set; }
        public String TransactionNumberFrom { get; set; }
        public String TransactionNumberTo { get; set; }
        public String VendorId { get; set; }
        public String BatchNumber { get; set; }
        public String CreatedBy { get; set; }
        public int ProdId { get; set; }
        public string Status { get; set; }


    }
    public class ReportInvoiceDetail
    {
        public ReportDetails objRD { get; set; }
        //public InvoiceReportsFilter objRDF { get; set; }
    }

    public class ReportJEDetails
    {
        public String ProductionName { get; set; }
        public String Company { get; set; }
        public String Bank { get; set; }
        public String Batch { get; set; }
        public String UserName { get; set; }
        public string Segment { get; set; }
        public string SegmentOptional { get; set; }

        public string TransCode { get; set; }

        //public List<SegmentName> ojbSegment { get; set; }
        //public List<TransactionName> objTrans { get; set; }

    }

    //============================================== Jouranl Entry

    public class JEReportFilter
    {
        public int ProdId { get; set; }
        public int CompanyId { get; set; }
        public string PeriodStatus { get; set; }
        public DateTime? CreateDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public string TransactionFrom { get; set; }
        public string TranasactionTo { get; set; }
        public string BatchNumber { get; set; }
        public string UserName { get; set; }
        public List<string> SelectedUserNames { get; set; }
        public string Status { get; set; }

    }
    public class ReportJEAuditDetail
    {
        public ReportDetails objRD { get; set; }
        public JEReportFilter objRDF { get; set; }
    }

    //============================================== Petty Cash

    public class ReportPettyCash //
    {
        public int ProdId { get; set; }
        public DateTime ReportDate { get; set; }
        public int[] Company { get; set; }
        public string Project { get; set; }
        public int PCBank { get; set; }
        public int CurrencyCode { get; set; }
        public int ReportCurrencyCode { get; set; }
        public string ClosePeriodStatus { get; set; }
        public DateTime CreateDateFrom { get; set; }
        public DateTime CreateDateTo { get; set; }
        public string TransactionNoFrom { get; set; }
        public string TransactionNoTo { get; set; }
        public string VendorId { get; set; }
        public string BatchNumber { get; set; }
        public string CreatedBy { get; set; }
        public string Location { get; set; }
        public bool LocationSubTotal { get; set; }
        public bool EpisodeSubTotal { get; set; }
        public string Status{ get; set; }
        public string UserName { get; set; }

    }
    public class ReportPettyCashDetail
    {
        public ReportDetails objRD { get; set; }
        public ReportPettyCash objRPC { get; set; }
    }


    // ================================================= LedgerBible

    public class ReportLedgerBible
    {
        public int Companyid { get; set; }
        public int PeriodIdfrom { get; set; }
        public int PeriodIdTo { get; set; }
        public int ProdId { get; set; }
        public string LO { get; set; }
    }
    public class BibleReport {
        public ReportLedgerBible objLBible {get;set;}
        public ReportDetails ObjRD {get;set;}

    }


    //================================ PO Listing

    public class POListing
    {
        public int ProdId { get; set; }
        public int CompanyId { get; set; }
        public string PeriodNoFrom { get; set; }
        public string PeriodNoTo { get; set; }
        public DateTime CreateDateFrom { get; set; }
        public DateTime CreateDateTo { get; set; }
        public string PoNoFrom { get; set; }
        public string PoNoTo { get; set; }
        public string VendorId { get; set; }
        public string Batch { get; set; }
        public string UserName { get; set; }
        public string POStatus { get; set; }
        public bool LocationSubTotal { get; set; }
        public bool EpisodeSubTotal { get; set; }
    }

    public class POListingReport
    {
        //public POListing objPO { get; set; }
        public ReportDetails ObjRD { get; set; }
    }


    //==============================  Trial Balance

    public class ReportTrial
    {
        public int Companyid { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int ProdId { get; set; }
        public string ProductionName { get; set; }
    }

    public class ReportVendorFilter
    {
        public int ProdID { get; set; }
        public string VendorFrom { get; set; }
        public string VendorTo { get; set; }
        public List<string> CompanyCode { get; set; }
        public DateTime? createdDateFrom { get; set; }
        public DateTime? CreatedDateTo { get; set; }
        public string VendorType { get; set; }
        public string VendorCountry { get; set; }
        public string VendorState { get; set; }
        public string DefaultDropdown { get; set; }
        public bool W9OnFile { get; set; }
        public bool W9NotOnFile { get; set; }
        public int UserID { get; set; }
      
    }
    public class ReportVendors
    {
        public ReportDetails objRD { get; set; }
        public ReportVendorFilter objRDF { get; set; }
    }

    //=====================Custodian

    public class CustodianDetail
    {
        public ReportDetails objRD { get; set; }
        public int ProdId { get; set; }

        //============//
    }
    //============//
    public class ReportLedgerEnquiry
    {
        public int Companyid { get; set; }
        public string PeriodStatus { get; set; }
        public int ProdId { get; set; }
        public DateTime? PostedDateFrom { get; set; }
        public DateTime? PostedDateTo { get; set; }
        public DateTime? DocumentDateFrom { get; set; }
        public DateTime? DocumentDateTo { get; set; }
        public IList<string> Batch { get; set; }
        public IList<string> CreatedBy { get; set; }
        public int TrStart { get; set; }
        public int Trend { get; set; }
        public int UserID { get; set; }
        public string ReportDate { get; set; }
        public string DocumentNo { get; set; }

        public string TransactionType { get; set; }
        public IList<string> Location { get; set; }
        public string VendorFrom { get; set; }
        public string VendorTo { get; set; }

        public string AccountFrom { get; set; }
        public string AccountTo { get; set; }
        public string UserName { get; set;}

    }

    public class LdgerInQuiryFinal
    {
        public ReportLedgerEnquiry objLInquiry { get; set; }
        public ReportDetails ObjRD { get; set; }

    }

}
