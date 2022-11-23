namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class BudgetProcessed
    {
        public string ActionType { get; set; }
        public int BudgetFileID { get; set; }
        public int BudgetID { get; set; }
        public int createdby { get; set; }
    }
    public partial class v2BudgetCRW
    {
        public int BudgetID { get; set; }
        public string BudgetName { get; set; }
        public string BudgetDescription { get; set; }
        public string BudgetType { get; set; }
        public string segmentJSON { get; set; }
        public string CRWJSON { get; set; }
        public bool isSave { get; set; }
        public int BudgetOrigin { get; set; }
        public int prodID { get; set; }
        public int Mode { get; set; }
        public int UserID { get; set; }
    }
}
