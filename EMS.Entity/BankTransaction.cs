namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class BankTransaction
    {
        public int ReconcilationID { get; set; }
        public int PaymentID { get; set; }
        public int Mode { get; set; }
        public int UserID { get; set; }
    }
}
