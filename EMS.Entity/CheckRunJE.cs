namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class CheckRunJE
    {
        public int PaymentID { get; set; }
        public int ProdID { get; set; }
        public int UserID { get; set; }
        public string CompanyCode { get; set; }

        public string BatchNumber { get; set; }
    }
}
