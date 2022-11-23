using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace EMS.Data
{
    public class _1099ModuleData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<TaxYears> GetTaxYears(int ProdID)
        {
            List<TaxYears> year = new List<TaxYears>();
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    year = (from trans in DBContext.APVendorsTaxFiling_GET(ProdID)
                            select new TaxYears
                            {
                                dtTaxYear = trans.TransactionYear,
                                iHasFilling = trans.hasFiling

                            }).ToList();

                    return year;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<APVendorsTaxFiling_GET_Result> VedorTaxDetails(int ProdID)
        {
            List<APVendorsTaxFiling_GET_Result> taxyeardetails = new List<APVendorsTaxFiling_GET_Result>();
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var taxdetails = DBContext.APVendorsTaxFiling_GET(ProdID);
                    taxyeardetails = taxdetails.ToList();
                    return taxyeardetails;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<APVendorsTaxFilingTransactionDetails_GET_Result> GetTransactionDetails(TransactionsFilters TransDetails)
        {
            List<APVendorsTaxFilingTransactionDetails_GET_Result> taxyeardetails = new List<APVendorsTaxFilingTransactionDetails_GET_Result>();
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var taxdetails = DBContext.APVendorsTaxFilingTransactionDetails_GET(TransDetails.sFilters);
                    return taxyeardetails = taxdetails.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<APVendorsTaxFiling_INIT_Result> CreateTaxFilling(TaxFilling otaxfilling)
        {
            
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.APVendorsTaxFiling_INIT(otaxfilling.ProdID, otaxfilling.TaxYear, otaxfilling.CompanyID, otaxfilling.Createdby).ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<String> SaveWorksheet(Worksheet oWorksheet)
        {

            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                   return DBContext.APVendorsTaxFiling_SAVE(oWorksheet.ProdID, oWorksheet.TaxFillingId, oWorksheet.sJson).ToList();                                   
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}
