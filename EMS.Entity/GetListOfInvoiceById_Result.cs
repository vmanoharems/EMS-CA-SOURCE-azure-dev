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
    
    public partial class GetListOfInvoiceById_Result
    {
        public int Invoiceid { get; set; }
        public int CompanyID { get; set; }
        public string CompanyCode { get; set; }
        public int VendorID { get; set; }
        public string InvoiceDate { get; set; }
        public bool ThirdParty { get; set; }
        public string ThirdPartyName { get; set; }
        public int BankId { get; set; }
        public string Bankname { get; set; }
        public decimal Amount { get; set; }
        public decimal OriginalAmount { get; set; }
        public decimal CurrentBalance { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceStatus { get; set; }
        public string Description { get; set; }
        public bool RequiredTaxCode { get; set; }
        public string MirrorStatus { get; set; }
        public int ClosePeriodId { get; set; }
        public int CompanyPeriod { get; set; }
        public string ClearringAccountFlag { get; set; }
        public Nullable<bool> VendorRquired { get; set; }
        public string DefaultDropdown { get; set; }
        public string VendorName { get; set; }
        public string PaymentStatus { get; set; }
        public string InvoiceReversed { get; set; }
        public string TransactionNumber { get; set; }
        public string BRStatus { get; set; }
        public string Payby { get; set; }
        public Nullable<System.DateTime> PaymentDate { get; set; }
        public string CheckNumber { get; set; }
        public string VoidJSON { get; set; }
    }
}