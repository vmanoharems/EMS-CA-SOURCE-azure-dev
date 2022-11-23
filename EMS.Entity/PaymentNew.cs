using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
   
    public  class PaymentNew
    {
        public int InvoiceID { get; set; }
        public string BatchNumber { get; set; }
        public string GroupNumber { get; set; }
        public DateTime CheckDate { get; set; }
        public string CheckNumber { get; set; }
        public int BankID { get; set; }
        public string PayBy { get; set; }
        public DateTime PaymentDate { get; set; }
        public int CreatedBy { get; set; }

        public int ProdID { get; set; }

        public int CheckRunID { get; set; }

        ////////////////////////////////
         
    }


    public class Payment1 {

        public List<PaymentNew> ObjPayment { get; set; }
    }
}
