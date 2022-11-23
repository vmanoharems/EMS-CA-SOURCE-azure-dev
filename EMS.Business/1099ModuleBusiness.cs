using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Data;

namespace EMS.Business
{
    public class _1099ModuleBusiness
    {
        _1099ModuleData DataContext = new _1099ModuleData();
        public List<TaxYears> GetTaxYears(int ProdID)
        {
            var result = DataContext.GetTaxYears(ProdID);
            return result.ToList();
        }


        public List<APVendorsTaxFiling_GET_Result> VedorTaxDetails(int ProdID)
        {
            var result = DataContext.VedorTaxDetails(ProdID);
            return result.ToList();
        }

        public List<APVendorsTaxFilingTransactionDetails_GET_Result> GetTransactionDetails(TransactionsFilters TransDetails)
        {
            var result = DataContext.GetTransactionDetails(TransDetails);
            return result.ToList();
        }

        public List<APVendorsTaxFiling_INIT_Result> CreateTaxFilling(TaxFilling otaxfilling)
        {
            return DataContext.CreateTaxFilling(otaxfilling);
        }

        public List<String> SaveWorksheet(Worksheet oWorksheet)
        {
           return DataContext.SaveWorksheet(oWorksheet);                        
        }
    }
}
