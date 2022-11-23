using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class ReportP1Data
    {
        Data.UtilityData utility = new Data.UtilityData();
        //Data
        public List<GetCheckRunList_Result> GetCheckRunList(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetCheckRunList(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetDataForCheckReport_Result> GetDataForCheckReport(int CheckRunID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetDataForCheckReport(CheckRunID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetDataForCheckReportHeader_Result> GetDataForCheckReportHeader(int CheckRunID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetDataForCheckReportHeader(CheckRunID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        
        public List<ReportsBankingCheckRunRegReportJSON_Result> GetCheckPrintFilter(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.ReportsBankingCheckRunRegReportJSON(callParameters.callPayload).ToList();
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<ReportsBankingCheckRegisterSummaryJSON_Result> GetCheckSummaryFilter(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.ReportsBankingCheckRegisterSummaryJSON(callParameters.callPayload);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetCheckSummaryTotal_Result> GetCheckSummaryTotal(string CompanyID, string BankID, DateTime Date1, DateTime Date2, string ProdID, string CheckRunList, int UserID, string ChecKType)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetCheckSummaryTotal(CompanyID, BankID, Date1, Date2, ProdID, CheckRunList, UserID, ChecKType);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<ReportsPayrollFilterJSON_Result> GetPayrollFilterData(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.ReportsPayrollFilterJSON(callParameters.callPayload);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetPayrollReportHeader_Result> GetPayrollReportHeader(int PayrollFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetPayrollReportHeader(PayrollFileID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetCRWListForReport_Result> GetCRWListForReport(int ProdID, int Mode, string CompanyID, string Location, int BudgetID, int BudgetFileID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetCRWListForReport(ProdID, Mode, CompanyID,Location,BudgetID,BudgetFileID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<ReportsBankingCheckRegDetailReportJSON_Result> CheckRegisterFilter(JSONParameters callParameters)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.ReportsBankingCheckRegDetailReportJSON(callParameters.callPayload).ToList();
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<BankRegisterHeader_Result> BankRegisterHeader(int CompanyID, int BankId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.BankRegisterHeader(CompanyID, BankId);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetVarianceReportData_Result> GetVarianceReportData(int BudgetID, int BudgetFileID,int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetVarianceReportData(BudgetID, BudgetFileID,UserID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetReconcilationList_Result> GetReconcilationList(int ProdID, int BankID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetReconcilationList(ProdID, BankID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<ReconcilationListForReport_Result> ReconcilationListForReport(string CompanyID, string BankID, string RecID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.ReconcilationListForReport(CompanyID, BankID, RecID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetReconcilationReportHeader_Result> GetReconcilationReportHeader(int ReconcilationID, int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetReconcilationReportHeader(ReconcilationID, UserID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetReconcilationReportData_Result> GetReconcilationReportData(int ReconcilationID,int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetReconcilationReportData(ReconcilationID, UserID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public string UserSpecificTime(int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetUserSpecificTime(UserID).FirstOrDefault();

                    return result;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<getDetailAccount_Result> getDetailAccount(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.getDetailAccount(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}
