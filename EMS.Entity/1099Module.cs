using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
    public class  TaxYears
    {
        public int? dtTaxYear { get; set; }
        public int iHasFilling { get; set; }
    }
    public class TransactionsFilters {    
        public string  sFilters { get; set; }     
    }
    public class TaxFilling
    {
        public int ProdID { get; set; }
        public short TaxYear { get; set; }
        public int CompanyID { get; set; }
        public int Createdby { get; set; }
    }

    public class Worksheet
    {
        public int ProdID { get; set; }
        public int TaxFillingId { get; set; }
        public string sJson { get; set; }
        public short sTaxYear { get; set; }     
    }


    public class WorksheetVendorSummary
    {
        public string WorkState { get; set; }
        public string TaxCode { get; set; }
        public decimal Amount { get; set; }
    }
}
