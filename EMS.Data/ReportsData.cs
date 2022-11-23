using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Data
{
    public class ReportsData
    {
        Data.UtilityData utility = new Data.UtilityData();
        /*
        public List<APInvoiceFilter_Result> APInvoiceFilter(InvoiceReportsFilter AP)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.APInvoiceFilter(
                        AP.BankId, AP.PeriodStatus, AP.CreatedDateFrom, AP.CreatedDateTo,
                        AP.TransactionNumberFrom, AP.TransactionNumberTo, AP.VendorId,
                         AP.BatchNumber, 0, false, false,
                         false, false, AP.ProdId, AP.Status
                           );
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
        */
        public List<ReportsLedgerJEPostingJSON_Result> ReportsLedgerJEPostingJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsLedgerJEPostingJSON(callParameters.callPayload);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<ReportsLedgerJEExportJSON_Result> ReportsLedgerJEExportJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsLedgerJEExportJSON(callParameters.callPayload);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<ReportsPettyCashFilterJSON_Result> ReportsPettyCashFilterJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsPettyCashFilterJSON(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<ReportsLedgerTBJSON_Result> ReportsLedgerTBJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsLedgerTBJSON(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex) { throw ex; }
            }
        }
        public List<GetAllBatchNumber_Result> GetAllBatchNumber(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetAllBatchNumber(ProdId);
                return result.ToList();
            }
        }
        public List<GEtAllUserInfo_Result> GEtAllUserInfo(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GEtAllUserInfo(ProdId);
                return result.ToList();
            }
        }
        public List<GetPeriodForBible_Result> GetPeriodForBible(int CompanyId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetPeriodForBible(CompanyId);
                return result.ToList();
            }

        }
        /*
        public List<POListingReports_Result> POListingReports(POListingReport PO)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var strpo = PO.objPO;
                var result = DBContext.POListingReports(
                    strpo.ProdId, strpo.CompanyId, strpo.PeriodNoFrom, strpo.PeriodNoTo,
    strpo.CreateDateFrom, strpo.CreateDateTo, strpo.PoNoFrom, strpo.PoNoTo, strpo.VendorId,
    strpo.Batch, strpo.UserName, strpo.POStatus, strpo.LocationSubTotal, strpo.EpisodeSubTotal);
                return result.ToList();
            }
        }
        */
        public List<LedgerBible_Result> LedgerBible(BibleReport BR)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var strBR = BR.objLBible;
                var result = DBContext.LedgerBible(
                   strBR.Companyid, strBR.PeriodIdfrom, strBR.PeriodIdTo, strBR.ProdId, strBR.LO
                    );
                return result.ToList();
            }
        }
        public List<ReportsLedgerBibleJSON_Result> ReportsLedgerBibleJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.ReportsLedgerBibleJSON(callParameters.callPayload);
                return result.ToList();
            }
        }
        public List<GetReportVendorList_Result> GetReportVendorList(ReportVendorFilter Ven)
        {

            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    if (Ven.createdDateFrom == Convert.ToDateTime("1/1/0001 12:00:00 AM"))
                    {
                        Ven.createdDateFrom = Convert.ToDateTime("01/01/2000");
                    }

                    var result = DBContext.GetReportVendorList(Ven.ProdID, Ven.VendorFrom,
                        Ven.VendorTo, Ven.CompanyCode[0], Ven.createdDateFrom, Ven.CreatedDateTo,
                        Ven.VendorType, Ven.VendorCountry, Ven.VendorState,
                        Ven.W9OnFile, Ven.W9NotOnFile, Ven.UserID);
                    return result.ToList();
                }
                catch (Exception ex) { throw ex; }
            }

        }
        public List<ReportsVendorListingReportJson_Result> ReportsVendorListingReportJson(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsVendorListingReportJson(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex) { throw ex; }
            }

        }
        public List<ReportsVendorFolderReportJSON_Result> ReportsVendorFolderReportJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsVendorFolderReportJSON(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex) { throw ex; }
            }

        }
        public List<ReportsVendorMailingReportJSON_Result> ReportsVendorMailingReportJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    //if (Mailing.createdDateFrom == Convert.ToDateTime("1/1/0001 12:00:00 AM"))
                    //{
                    //    Mailing.createdDateFrom = Convert.ToDateTime("01/01/2000");
                    //}

                    var result = DBContext.ReportsVendorMailingReportJSON(Convert.ToString(callParameters.callPayload));
                    return result.ToList();
                }
                catch (Exception ex) { throw ex; }
            }

        }
        public List<ReportsVendorInqReportJSON_Result> ReportsVendorInqReportJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsVendorInqReportJSON(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetCompanylistReport_Result> GetCompanylistReport(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCompanylistReport(ProdID);
                return result.ToList();
            }
        }
        public List<GetBanklistReport_Result> GetBanklistReport(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetBanklistReport(ProdID);
                return result.ToList();
            }
        }
        public List<GetTransCodeValuByProdID_Result> GetTransCodeValuByProdID(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetTransCodeValuByProdID(ProdID);
                return result.ToList();

            }
        }
        public List<LedgerInQuiry_Result> LedgerInQuiry(LdgerInQuiryFinal LE)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var strBR = LE.objLInquiry;
                var result = DBContext.LedgerInQuiry(
                   strBR.Companyid, strBR.PeriodStatus, strBR.ProdId, strBR.PostedDateFrom, strBR.PostedDateTo,
                   strBR.Batch.ToString(), strBR.CreatedBy.ToString(), strBR.TrStart, strBR.Trend, strBR.DocumentNo, strBR.TransactionType,
                strBR.VendorFrom, strBR.VendorTo, strBR.Location.ToString(), strBR.AccountFrom, strBR.AccountTo
                    );
                return result.ToList();
            }
        }
        public List<LedgerShared_Result> ReportsLedgerInQuiryAccountJSON(string JSONparameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    SqlParameter sqlJSONparameters = new SqlParameter("@JSONparameters", JSONparameters);
                    List<LedgerShared_Result> a = DBContext.Database.SqlQuery<LedgerShared_Result>("ReportsLedgerInQuiryAccountJSON @JSONparameters", sqlJSONparameters).ToList();
                    return a;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<LedgerInQuiryTransaction_Result> LedgerInQuiryTransaction(LdgerInQuiryFinal LE)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var strBR = LE.objLInquiry;
                var result = DBContext.LedgerInQuiryTransaction(
                   strBR.Companyid, strBR.PeriodStatus, strBR.ProdId, strBR.PostedDateFrom, strBR.PostedDateTo,
                   strBR.Batch.ToString(), strBR.CreatedBy.ToString(), strBR.TrStart, strBR.Trend, strBR.DocumentNo, strBR.TransactionType,
                strBR.VendorFrom, strBR.VendorTo, strBR.Location.ToString(), strBR.AccountFrom, strBR.AccountTo

                    );
                return result.ToList();
            }
        }
        //===================================================//
        public List<ReportsVendorDetailReportJSON_Result> ReportsVendorDetailReportJSON(JSONParameters callParameters)
        {

            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsVendorDetailReportJSON(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex) { throw ex; }
            }

        }
        public List<GetClosePeriodList_Result> GetClosePeriodList(int ProdID, int CID, int Mode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetClosePeriodList(ProdID, CID, Mode);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetOpenPeriod_Result> GetOpenPeriod(int ProdID, int CID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetOpenPeriod(ProdID, CID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<ReportsInvoiceTransactionJSON_Result> ReportsInvoiceTransactionJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsInvoiceTransactionJSON(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
        public List<ReportsInvoiceAccountJSON_Result> ReportsInvoiceAccountJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsInvoiceAccountJSON(callParameters.callPayload);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
        public List<ReportsLedgerJEAuditJSON_Result> ReportsLedgerJEAuditJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ReportsLedgerJEAuditJSON(callParameters.callPayload);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetCompanyNameByID_Result> GetCompanyNameByID(int CID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetCompanyNameByID(CID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<ReportsPOListingReportsJSON_Result> ReportsPOListing(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.ReportsPOListingReportsJSON(callParameters.callPayload).ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<ReportsPOListingExportJSON_Result> ReportsPOListingExportJSON(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    return DBContext.ReportsPOListingExportJSON(callParameters.callPayload).ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}

