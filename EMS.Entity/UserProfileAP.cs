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
    
    public partial class UserProfileAP
    {
        public int UserProfileAPID { get; set; }
        public string Company { get; set; }
        public string Currency { get; set; }
        public string BankInfo { get; set; }
        public string PaymentType { get; set; }
        public Nullable<System.DateTime> FromDate { get; set; }
        public Nullable<System.DateTime> ToDate { get; set; }
        public string Vendor { get; set; }
        public string BatchNumber { get; set; }
        public string UserID { get; set; }
        public Nullable<int> ProdId { get; set; }
        public string APType { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
    }
}
