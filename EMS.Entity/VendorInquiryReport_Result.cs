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
    
    public partial class VendorInquiryReport_Result
    {
        public int paymentId { get; set; }
        public string VendorNumber { get; set; }
        public string Type { get; set; }
        public string vendorname { get; set; }
        public string checkNumber { get; set; }
        public int Invoiceid { get; set; }
        public string InvoiceNumber { get; set; }
        public string Memo { get; set; }
        public string BankName { get; set; }
        public Nullable<System.DateTime> CheckDate { get; set; }
        public Nullable<decimal> InvoiceTotal { get; set; }
        public string COAstring { get; set; }
        public Nullable<int> COAID { get; set; }
        public string Transactionstring { get; set; }
        public string TransStr { get; set; }
        public Nullable<decimal> LineAmount { get; set; }
        public string TransactionNumber { get; set; }
        public string Source { get; set; }
        public string LineDescription { get; set; }
    }
}
