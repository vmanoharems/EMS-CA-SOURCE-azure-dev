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
    
    public partial class GetSourceCodeDetails_Result
    {
        public int SourceCodeID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public bool AP { get; set; }
        public bool JE { get; set; }
        public bool PO { get; set; }
        public bool PC { get; set; }
        public bool AR { get; set; }
        public bool PR { get; set; }
        public Nullable<bool> WT { get; set; }
        public string Thirdparty { get; set; }
        public int ProdID { get; set; }
    }
}