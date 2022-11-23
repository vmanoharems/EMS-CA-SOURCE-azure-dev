namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class Adjustment
    {
        public int BankID{get;set;}
        public int ProdID{get;set;}
        public int ReconcilationID { get; set; }
        public string AdjustmentNumber { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public int UserID { get; set; }  

    }
}
