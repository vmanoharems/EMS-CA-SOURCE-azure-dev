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
    
    public partial class CRWBudgetAccountsFinal_Fix
    {
        public int BudgetAccountID { get; set; }
        public Nullable<int> CategoryId { get; set; }
        public Nullable<int> AccountID { get; set; }
        public string AccountNumber { get; set; }
        public string AccountDesc { get; set; }
        public string AccountFringe { get; set; }
        public string AccountOriginal { get; set; }
        public Nullable<decimal> AccountTotal { get; set; }
        public string AccountVariance { get; set; }
        public Nullable<int> BudgetFileID { get; set; }
        public Nullable<int> BudgetID { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<int> COAID { get; set; }
        public string COACODE { get; set; }
        public Nullable<int> DetailLevel { get; set; }
        public Nullable<int> ParentID { get; set; }
    }
}
