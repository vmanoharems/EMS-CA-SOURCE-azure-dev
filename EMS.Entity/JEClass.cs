using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
    public class JEClass
    {
        public JournalEntry objJE { get; set; }
        public List<JournalEntryDetail> objJEDetail { get; set; }
        //public JournalEntryDetailAddon objJEAddon { get; set; }

    }
    public class UpdateJournalEntry
    {
        public string Type { get; set; }
        public int JEDId { get; set; }
        public string TransactionString { get; set; }
    }
    public class TrailBalanceList
    {
        public int ProdId { get; set; }
        public int CompanyId { get; set; }
        //public string SegmentName { get; set; }
        //public string Period { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class TrailBalanceListNew
    {
        public int ProdId { get; set; }
        public string CompanyCode { get; set; }
        public string Segmentcode { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
    public class JEFilter
    {
        public int ProdId { get; set; }
        public string ss1 { get; set; }
        public string ss2 { get; set; }
        public string ss3 { get; set; }
        public string ss4 { get; set; }
        public string ss5 { get; set; }
        public DateTime START { get; set; }
        public DateTime End { get; set; }
        public string VendorIds { get; set; }
        public int CompanyId { get; set; }
        public string Currency { get; set; }
        public string Period { get; set; }
        public string Source { get; set; }
        public int SetId { get; set; }
        public string Type { get; set; }
        public string DocumentNo { get; set; }


    }
}
