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
    
    public partial class GetJEntryByJEId_Result
    {
        public int JournalEntryId { get; set; }
        public string TransactionNumber { get; set; }
        public decimal CreditTotal { get; set; }
        public decimal DebitTotal { get; set; }
        public Nullable<decimal> ImbalanceAmount { get; set; }
        public string EntryDate { get; set; }
        public string BatchNumber { get; set; }
        public Nullable<int> CompanyId { get; set; }
        public string Description { get; set; }
        public string ReferenceNumber { get; set; }
        public string Source { get; set; }
        public string DocumentNo { get; set; }
        public int ClosePeriodId { get; set; }
        public int CompanyPeriod { get; set; }
        public int ClosePeriod { get; set; }
        public string CurrencyTransaction { get; set; }
    }
}
