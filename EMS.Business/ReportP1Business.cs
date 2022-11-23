using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Data;
using EMS.Entity;
using System.Data;

namespace EMS.Business
{
    public class ReportP1Business
    {
        ReportP1Data DataContext = new ReportP1Data();
        //Bussiness Report
        public List<GetCheckRunList_Result> GetCheckRunList(int ProdID)
        {
            var result = DataContext.GetCheckRunList(ProdID);
            return result.ToList();
        }

        public List<GetDataForCheckReport_Result> GetDataForCheckReport(int CheckRunID)
        {
            var result = DataContext.GetDataForCheckReport(CheckRunID);
            return result.ToList();
        }

        public List<GetDataForCheckReportHeader_Result> GetDataForCheckReportHeader(int CheckRunID)
        {
            var result = DataContext.GetDataForCheckReportHeader(CheckRunID);
            return result.ToList();
        }

        public List<ReportsBankingCheckRunRegReportJSON_Result> GetCheckPrintFilter(JSONParameters callParameters)
        {
            var result = DataContext.GetCheckPrintFilter(callParameters);
            return result.ToList();
        }

        public List<ReportsBankingCheckRegisterSummaryJSON_Result> GetCheckSummaryFilter(JSONParameters callParameters)
        {
            var result = DataContext.GetCheckSummaryFilter(callParameters);
            return result.ToList();
        }

        public List<GetCheckSummaryTotal_Result> GetCheckSummaryTotal(string CompanyID, string BankID, DateTime Date1, DateTime Date2, string ProdID, string CheckRunList, int UserID, string ChecKType)
        {
            var result = DataContext.GetCheckSummaryTotal(CompanyID, BankID, Date1, Date2, ProdID, CheckRunList, UserID, ChecKType);
            return result.ToList();
        }

        public List<ReportsPayrollFilterJSON_Result> GetPayrollFilterData(JSONParameters callParameters)
        {
            var result = DataContext.GetPayrollFilterData(callParameters);
            return result.ToList();
        }

        public List<GetPayrollReportHeader_Result> GetPayrollReportHeader(int PayrollFileID)
        {
            var result = DataContext.GetPayrollReportHeader(PayrollFileID);
            return result.ToList();
        }

        public List<GetCRWListForReport_Result> GetCRWListForReport(int ProdID, int Mode, string CompanyID, string Location, int BudgetID, int BudgetFileID)
        {
            var result = DataContext.GetCRWListForReport(ProdID, Mode,CompanyID, Location, BudgetID,BudgetFileID);
            return result.ToList();
        }

        public List<ReportsBankingCheckRegDetailReportJSON_Result> CheckRegisterFilter(JSONParameters callParameters)
        {
            var result = DataContext.CheckRegisterFilter(callParameters);
            return result.ToList();
        }

        public List<BankRegisterHeader_Result> BankRegisterHeader(int CompanyID, int BankId)
        {
            var result = DataContext.BankRegisterHeader(CompanyID, BankId);
            return result.ToList();
        }

        public List<GetVarianceReportData_Result> GetVarianceReportData(int BudgetID, int BudgetFileID,int UserID)
        {
            var result = DataContext.GetVarianceReportData(BudgetID, BudgetFileID,UserID);
            return result.ToList();
        }


        public List<GetReconcilationList_Result> GetReconcilationList(int ProdID, int BankID)
        {
            var result = DataContext.GetReconcilationList(ProdID,BankID);
            return result.ToList();
        }

        public List<ReconcilationListForReport_Result> ReconcilationListForReport(string CompanyID, string BankID, string RecID)
        {
            var result = DataContext.ReconcilationListForReport(CompanyID, BankID, RecID);
            return result.ToList();
        }

        public List<GetReconcilationReportHeader_Result> GetReconcilationReportHeader(int ReconcilationID, int UserID)
        {
            var result = DataContext.GetReconcilationReportHeader(ReconcilationID, UserID);
            return result.ToList();
        }

        public List<GetReconcilationReportData_Result> GetReconcilationReportData(int ReconcilationID, int UserID)
        {
            var result = DataContext.GetReconcilationReportData(ReconcilationID, UserID);
            return result.ToList();
        }

        public string UserSpecificTime(int UserID)
        {
            var result = DataContext.UserSpecificTime(UserID);
            return result;
        }

        public List<getDetailAccount_Result> getDetailAccount(int ProdID)
        {
            var result = DataContext.getDetailAccount(ProdID);
            return result.ToList();
        }
    }
}
