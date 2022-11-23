namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class PaymentCheckRun
    {
        public int Paymentid { get; set; }
        public string GroupNumber { get; set; }
        public int VendorId { get; set; }
        public decimal PaidAmount { get; set; }

        public DateTime CheckDate { get; set; }

        public string CheckNumber { get; set; }

        public int BankId { get; set; }

        public string Status { get; set; }

        public string PayBy { get; set; }

        public DateTime PaymentDate { get; set; }

        public string Memo { get; set; }

        public string BatchNumber { get; set; }

        public int ProdId { get; set; }

        public int CreatedBy { get; set; }

        public int CheckRunID { get; set; }
    }
}
