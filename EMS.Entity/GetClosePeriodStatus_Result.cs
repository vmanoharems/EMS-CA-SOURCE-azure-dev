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
    
    public partial class GetClosePeriodStatus_Result
    {
        public int ClosePeriodId { get; set; }
        public int CompanyId { get; set; }
        public int CompanyPeriod { get; set; }
        public Nullable<System.DateTime> StartPeriod { get; set; }
        public Nullable<System.DateTime> EndPeriod { get; set; }
        public string Status { get; set; }
        public string PeriodStatus { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
    }
}
