namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class PayrollTransValue
    {
        public int ExpenseID { get; set; }
        public int ModifyBy { get; set; }
        public string TransValueStr { get; set; }

        public string COAString { get; set; }

        public string SegmentString { get; set; }

        public string SegmentString1 { get; set; }

        public string SegmentString2 { get; set; }

        public string AccountNumber { get; set; }

        public string PayDescription { get; set; }

        public string SegmentStr1 { get; set; }

        public string TransactionStr1 { get; set; }

        public string SetID { get; set; }

        public string SeriesID { get; set; }
    }
}
