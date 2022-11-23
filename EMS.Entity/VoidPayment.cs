namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class VoidPayment
    {
        public int PaymentID { get; set; }
        public string IsReissueInv { get; set; }
        public string BatchNumber { get; set; }
        public int ProdID { get; set; }
        public int UserID { get; set; }
        public string Status { get; set; }

    }
}
