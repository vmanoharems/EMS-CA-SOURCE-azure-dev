//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EMS.Entity
{
    using System;
    
    public partial class ReportsLedgerJEExportJSON_Result
    {
        public int JournalEntryDetailId { get; set; }
        public int JournalEntryId { get; set; }
        public string TransactionLineNumber { get; set; }
        public int COAId { get; set; }
        public decimal DebitAmount { get; set; }
        public decimal CreditAmount { get; set; }
        public Nullable<int> VendorId { get; set; }
        public string VendorName { get; set; }
        public bool ThirdParty { get; set; }
        public string Note { get; set; }
        public string TransactionCodeString { get; set; }
        public string TransactionvalueString { get; set; }
        public Nullable<int> SetId { get; set; }
        public Nullable<int> SeriesId { get; set; }
        public string SetAC { get; set; }
        public string SeriesAC { get; set; }
        public string COAString { get; set; }
        public string TaxCode { get; set; }
        public int AccountTypeId { get; set; }
        public string COACode { get; set; }
        public string AccountCode { get; set; }
        public string Location { get; set; }
        public int ClosePeriod { get; set; }
        public string BatchNumber { get; set; }
        public string DocumentNo { get; set; }
        public string PostedDate { get; set; }
        public string Description { get; set; }
        public string AccountName { get; set; }
        public string TransactionNumber { get; set; }
        public int CompanyPeriod { get; set; }
    }
}