using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
    public class CCCGI
    {
        public int InvoiceID { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceDate { get; set; }
        public double Amount { get; set; }
    }

    public class CCCG
    {
        public int CheckCycleID { get; set; }
        public int CheckGroupID { get; set; }
        public string VendorName { get; set; }
        public string CheckGroupNumber { get; set; }
        public string CheckNumber { get; set; }
        public string CheckStatus { get; set; }
        public bool PrintStatus { get; set; }
        public string CheckDate { get; set; }
        public List<CCCGI> CCCGI { get; set; }
    }

    public class V
    {
        public int VendorID { get; set; }
        public string VendorName { get; set; }
        public List<CCCG> CCCG { get; set; }
    }

    public class CheckCycleEntity
    {
        public int createdby { get; set; }
        public int CheckCycleID { get; set; }
        public string Status { get; set; }
        public string State { get; set; }
        public int BankID { get; set; }
        public string PaymentType { get; set; }
        public DateTime createdDatetime { get; set; }
        public string JSONdocument { get; set; }
        public int prodID { get; set; }
        public bool isdeleted { get; set; }
        public string CCSetup { get; set; }
        public List<V> V { get; set; }
    }
}
