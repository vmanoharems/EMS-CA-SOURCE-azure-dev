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
    
    public partial class GetTblAccountDetailsByCategory_Result
    {
        public int AccountID { get; set; }
        public string AccountCode { get; set; }
        public string AccountName { get; set; }
        public bool BalanceSheet { get; set; }
        public bool Status { get; set; }
        public Nullable<bool> Posting { get; set; }
        public int SubLevel { get; set; }
        public string Code { get; set; }
        public int AccountTypeId { get; set; }
        public Nullable<int> ParentId { get; set; }
    }
}