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
    
    public partial class taxinfo
    {
        public int taxinfoID { get; set; }
        public int CompanyID { get; set; }
        public string federaltaxagency { get; set; }
        public string federaltaxform { get; set; }
        public string EIN { get; set; }
        public string CompanyTCC { get; set; }
        public string StateID { get; set; }
        public string StatetaxID { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public int ProdID { get; set; }
    }
}