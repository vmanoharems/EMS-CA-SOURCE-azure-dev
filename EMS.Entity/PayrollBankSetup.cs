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
    
    public partial class PayrollBankSetup
    {
        public int PayrollBankSetupID { get; set; }
        public Nullable<int> DefaultCompanyID { get; set; }
        public Nullable<int> DefaultBankId { get; set; }
        public string DefaultCurrency { get; set; }
        public Nullable<int> PRSource { get; set; }
        public Nullable<int> APSource { get; set; }
        public System.DateTime createddate { get; set; }
        public Nullable<System.DateTime> modifieddate { get; set; }
        public int createdby { get; set; }
        public Nullable<int> modifiedby { get; set; }
        public int ProdID { get; set; }
        public Nullable<int> VendorID { get; set; }
    }
}