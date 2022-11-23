namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class BudgetCategoryUpdate
    {
        public int BudgetCategoryID { get; set; }
        public string Parameter { get; set; }
        public int ModifyBy { get; set; }
        public int Mode { get; set; }
    }
}
