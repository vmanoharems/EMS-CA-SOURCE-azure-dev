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
    
    public partial class tblVendor
    {
        public tblVendor()
        {
            this.JournalEntryDetails = new HashSet<JournalEntryDetail>();
            this.PurchaseOrders = new HashSet<PurchaseOrder>();
            this.PCEnvelopeLines = new HashSet<PCEnvelopeLine>();
            this.Invoices = new HashSet<Invoice>();
        }
    
        public int VendorID { get; set; }
        public string VendorNumber { get; set; }
        public string VendorName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string PrintOncheckAS { get; set; }
        public string W9Country { get; set; }
        public string W9Address1 { get; set; }
        public string W9Address2 { get; set; }
        public string W9Address3 { get; set; }
        public string W9City { get; set; }
        public string W9State { get; set; }
        public string W9Zip { get; set; }
        public string RemitCountry { get; set; }
        public string RemitAddress1 { get; set; }
        public string RemitAddress2 { get; set; }
        public string RemitAddress3 { get; set; }
        public string RemitCity { get; set; }
        public string RemitState { get; set; }
        public string RemitZip { get; set; }
        public bool UseRemmitAddrs { get; set; }
        public string Qualified { get; set; }
        public string Currency { get; set; }
        public string DefaultAccount { get; set; }
        public string LedgerAccount { get; set; }
        public string TaxID { get; set; }
        public string Type { get; set; }
        public Nullable<bool> TaxFormOnFile { get; set; }
        public Nullable<System.DateTime> TaxFormExpiry { get; set; }
        public string DefaultForm { get; set; }
        public string TaxName { get; set; }
        public string ForeignTaxId { get; set; }
        public string PaymentType { get; set; }
        public Nullable<int> Duecount { get; set; }
        public string Duetype { get; set; }
        public Nullable<decimal> netpercentage { get; set; }
        public string PaymentAccount { get; set; }
        public Nullable<bool> Required { get; set; }
        public string StudioVendorNumber { get; set; }
        public Nullable<bool> IsStudioApproved { get; set; }
        public Nullable<bool> Status { get; set; }
        public Nullable<bool> Warning { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<int> ProdID { get; set; }
        public Nullable<int> COAId { get; set; }
        public string COAString { get; set; }
        public string TransactionCodeString { get; set; }
        public Nullable<int> SetId { get; set; }
        public Nullable<int> SeriesId { get; set; }
        public string DefaultDropdown { get; set; }
        public int AtlasGEOCountryID_Remit { get; set; }
        public int AtlasGEOCountryID_W9 { get; set; }
        public int AtlasGEOStateID_Remit { get; set; }
        public int AtlasGEOStateID_W9 { get; set; }
    
        public virtual ICollection<JournalEntryDetail> JournalEntryDetails { get; set; }
        public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; }
        public virtual ICollection<PCEnvelopeLine> PCEnvelopeLines { get; set; }
        public virtual ICollection<Invoice> Invoices { get; set; }
    }
}