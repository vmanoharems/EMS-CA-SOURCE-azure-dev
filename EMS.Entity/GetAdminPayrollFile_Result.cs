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
    
    public partial class GetAdminPayrollFile_Result
    {
        public int PayrollFileID { get; set; }
        public Nullable<int> LoadNumber { get; set; }
        public string CreatedDate { get; set; }
        public string InvoiceNumber { get; set; }
        public string PrintStatus { get; set; }
        public string CompanyCode { get; set; }
        public string TransactionDate { get; set; }
        public string EndDate { get; set; }
        public decimal TotalPayrollAmount { get; set; }
        public Nullable<bool> InvoicedFlag { get; set; }
    }
}
