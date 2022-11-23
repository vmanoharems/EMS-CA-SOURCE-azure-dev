namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class CheckVerification
    {
        public int PaymentID { get; set; }
        public int Mode { get; set; }
        public int ProdID { get; set; }
      
        // Add on 5 Aug 16

        public int UserID { get; set; }
        public string CompanyCode { get; set; }
        public string BatchNumber { get; set; }
    }
}
