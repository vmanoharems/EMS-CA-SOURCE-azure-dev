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
    using System.Collections.Generic;
    
    public partial class PurchaseOrderLine
    {
        public PurchaseOrderLine()
        {
            this.InvoiceLines = new HashSet<InvoiceLine>();
        }
    
        public int POlineID { get; set; }
        public int POID { get; set; }
        public int COAID { get; set; }
        public decimal Amount { get; set; }
        public string LineDescription { get; set; }
        public string POLinestatus { get; set; }
        public string COAString { get; set; }
        public string Transactionstring { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public int ProdID { get; set; }
        public string ThirdPartyVendor { get; set; }
        public Nullable<int> SetID { get; set; }
        public Nullable<int> SeriesID { get; set; }
        public string TaxCode { get; set; }
        public decimal ManualAdjustment { get; set; }
        public decimal ClearedAmount { get; set; }
        public decimal AdjustMentTotal { get; set; }
        public decimal RelievedAmount { get; set; }
        public decimal AvailToRelieve { get; set; }
        public decimal DisplayAmount { get; set; }
        public decimal RelievedTotal { get; set; }
    
        public virtual COA COA { get; set; }
        public virtual ICollection<InvoiceLine> InvoiceLines { get; set; }
    }
}
