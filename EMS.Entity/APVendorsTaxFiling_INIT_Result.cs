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
    
    public partial class APVendorsTaxFiling_INIT_Result
    {
        public string Action { get; set; }
        public short TaxFilingID { get; set; }
        public int ProdID { get; set; }
        public short TaxYear { get; set; }
        public int CompanyID { get; set; }
        public byte ProcessStatus { get; set; }
        public byte FilingType { get; set; }
        public byte FilingStatus { get; set; }
        public string FilingFileJSON { get; set; }
        public Nullable<System.DateTime> FilingDate { get; set; }
        public int Createdby { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public Nullable<int> Modifiedby { get; set; }
        public System.DateTime ModifiedDate { get; set; }
        public Nullable<int> CurrentUserID { get; set; }
        public Nullable<System.DateTime> CurrentUserDate { get; set; }
        public Nullable<System.DateTime> CompletedDate { get; set; }
    }
}
