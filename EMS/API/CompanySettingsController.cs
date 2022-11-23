using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Net.Mail;
using System.Web;
//using System.Web.Routing;
//using Newtonsoft.Json;

using EMS.Entity;
using EMS.Business;
using EMS.Controllers;
using SendGrid;

namespace EMS.API
{
    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/CompanySettings")]
    public class CompanySettingsController : ApiController
    {
        //[AllowAnonymous]
        //[Route("GetUserDetails")]
        //[HttpGet]
        //public List<GetUserDetails_Result> GetUserDetails(string Email, string Password)
        //{
        //    CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
        //    return BusinessContext.GetUserDetails(Email, Password);

        //}

        private const string LocalLoginProvider = "Local";
        protected CustomPrincipal CurrentUser
        { get { return HttpContext.Current.User as CustomPrincipal; } }
        protected int Execute(string APITOKEN = null)
        {
            try
            {
                if (this.CurrentUser == null)
                    return -1;//"Authorization Failed!";
                if (this.CurrentUser.Identity != null || APITOKEN != null)//this.CurrentUser.IsInRole("Admin") ||
                    return 0;//"Success"
                else
                    return 1;//"ClientID is not valid!";
            }
            catch { return 99; }
        }



        // [AllowAnonymous]
        [Route("GetCAUserListByPropId")]
        [HttpPost]
        public List<GetCAUserListByPropId_Result> GetCAUserListByPropId(int PropId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetCAUserListByPropId(PropId);
            }
            else
            {
                List<GetCAUserListByPropId_Result> n = new List<GetCAUserListByPropId_Result>();
                return n;
            }
        }

        //  [AllowAnonymous]
        [Route("GetUserDetails")]
        [HttpPost]
        public int InsertUpdateUser(CAUser _causer)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUpdateUser(_causer);
            }
            else
            {
                return 0;
            }
        }


        // [AllowAnonymous]
        [Route("InsertUpdateGroups")]
        [HttpPost]

        public int InsertUpdateGroups(CompanyGroup _Groups)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUpdateGroups(_Groups);
            }
            else
            {
                return 0;
            }
        }
        //  [AllowAnonymous]
        [Route("GetGroupDetailsBypropId")]
        [HttpPost]
        public List<GetGroupDetailsBypropId_Result> GetGroupDetailsBypropId(int PropId)     ////// error
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetGroupDetailsBypropId(PropId);
            }
            else
            {
                List<GetGroupDetailsBypropId_Result> n = new List<GetGroupDetailsBypropId_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("InsertUpdateName")]
        [HttpPost]
        public int InsertUpdateName(int nam)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                //  return BusinessContext.InsertUpdateGroups(_Groups);
                return 0;
            }
            else
            {
                return 0;
            }
        }
        //[AllowAnonymous]
        [Route("InsertUpdateCompanyCreation")]
        public int InsertUpdateCompanyCreation(Company _ComCre)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUpdateCompanyCreation(_ComCre);
            }
            else
            {
                return 0;
            }
        }


        // [AllowAnonymous]
        [Route("InsertUpdateCompanyTaxInfo")]

        public int InsertUpdateCompanyTaxInfo(taxinfo _TaxInfo)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUpdateCompanyTaxInfo(_TaxInfo);
            }
            else
            {
                return 0;
            }
        }

        //    [AllowAnonymous]
        [Route("GetCompanyList")]
        [HttpGet, HttpPost]
        public List<GetCompanyList_Result> GetCompanyList(int ProdID)            /////////
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetCompanyList(ProdID);
            }
            else
            {
                List<GetCompanyList_Result> n = new List<GetCompanyList_Result>();
                return n;
            }
        }

        // [AllowAnonymous]
        [Route("GetCompanyDetail")]
        [HttpGet]
        public List<GetCompanyDetail_Result> GetCompanyDetail(int CompanyID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetCompanyDetail(CompanyID);
            }
            else
            {
                List<GetCompanyDetail_Result> n = new List<GetCompanyDetail_Result>();
                return n;
            }
        }



        // [AllowAnonymous]
        [Route("GetModulesDetails")]
        [HttpPost]
        public List<GetModulesDetails_Result> GetModulesDetails(int GroupId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetModulesDetails(GroupId);
            }
            else
            {
                List<GetModulesDetails_Result> n = new List<GetModulesDetails_Result>();
                return n;
            }
        }

        //  [AllowAnonymous]
        [Route("GetCompnayCodeByProdId")]
        [HttpPost]
        public List<GetCompnayCodeByProdId_Result> GetCompnayCodeByProdId(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetCompnayCodeByProdId(ProdId);
            }
            else
            {
                List<GetCompnayCodeByProdId_Result> n = new List<GetCompnayCodeByProdId_Result>();
                return n;
            }
        }
        //  [AllowAnonymous]
        [Route("InsertUpdateCompanySetting")]
        public void InsertUpdateCompanySetting(CompanySetting _CompanySetting)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.InsertUpdateCompanySetting(_CompanySetting);
            }
            else
            {
                return;
            }
        }


        // [AllowAnonymous]
        [Route("InsertUpdateCurrencyExchange")]
        public void InsertUpdateCurrencyExchange(List<CurrencyExchange> _CurrencyExchange)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.InsertUpdateCurrencyExchange(_CurrencyExchange);
            }

            else
            {
                return;
            }
        }

        // [AllowAnonymous]
        [Route("GetExchangeRate")]
        [HttpGet]
        public List<GetExchangeRate_Result> GetExchangeRate(int CompanyID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetExchangeRate(CompanyID);
            }
            else
            {
                List<GetExchangeRate_Result> n = new List<GetExchangeRate_Result>();
                return n;

            }

        }


        // [AllowAnonymous]
        [Route("InsertUpdateStartingvalue")]
        public void InsertUpdateStartingvalue(StartingValue _StartingValue)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.InsertUpdateStartingvalue(_StartingValue);
            }
            else
            {
                return;
            }
        }

        // [AllowAnonymous]
        [Route("GetStartingvalue")]
        [HttpGet]
        public List<GetStartingvalue_Result> GetStartingvalue(int CompanyID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetStartingvalue(CompanyID);
            }
            else
            {
                List<GetStartingvalue_Result> n = new List<GetStartingvalue_Result>();
                return n;

            }
        }

        //  [AllowAnonymous]
        [Route("InsertUpdatePermission")]
        [HttpPost]
        public int InsertUpdatePermission(List<GroupPermission> Gp)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUpdatePermission(Gp);
            }
            else
            {
                return 0;
            }
        }

        //  [AllowAnonymous]
        [Route("InsertUpdateGroupCompanyAccess")]
        [HttpPost]
        public int InsertUpdateGroupCompanyAccess(CompanyGroupAccess AGP)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUpdateGroupCompanyAccess(AGP);
            }
            else
            {
                return 0;
            }
        }
        // user Page

        /*
        [Route("GetCurrencyDetails")]
        [HttpPost]
        public List<GetCurrencyDetails_Result> GetCurrencyDetails(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetCurrencyDetails(ProdId);
            }
            else
            {
                List<GetCurrencyDetails_Result> n = new List<GetCurrencyDetails_Result>();
                return n;

            }

        }
        */
        //  [AllowAnonymous]
        [Route("GetSourceCodeDetails")]
        [HttpPost]
        public List<GetSourceCodeDetails_Result> GetSourceCodeDetails(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetSourceCodeDetails(ProdId);
            }
            else
            {
                List<GetSourceCodeDetails_Result> n = new List<GetSourceCodeDetails_Result>();
                return n;

            }

        }
        // [AllowAnonymous]
        [Route("GetBankInfoDetails")]
        [HttpPost]
        public List<GetBankInfoDetails_Result> GetBankInfoDetails(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetBankInfoDetails(ProdId);
            }
            else
            {
                List<GetBankInfoDetails_Result> n = new List<GetBankInfoDetails_Result>();
                return n;

            }
        }
        // [AllowAnonymous]
        [Route("GetTranasactionCode")]
        [HttpPost]
        public List<GetTranasactionCode_Result> GetTranasactionCode(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetTranasactionCode(ProdId);
            }
            else
            {
                List<GetTranasactionCode_Result> n = new List<GetTranasactionCode_Result>();
                return n;

            }
        }
        // [AllowAnonymous]
        [Route("GetModuleDetailsByModuleId")]
        [HttpPost]
        public List<GetModuleDetailsByModuleId_Result> GetModuleDetailsByModuleId(int ModuleId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetModuleDetailsByModuleId(ModuleId);
            }
            else
            {
                List<GetModuleDetailsByModuleId_Result> n = new List<GetModuleDetailsByModuleId_Result>();
                return n;

            }

        }
        //  [AllowAnonymous]
        [Route("InsertupdateMyDefault")]
        [HttpPost]
        public int InsertupdateMyDefault(List<Mydefault> _MYdefault)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertupdateMyDefault(_MYdefault);
            }
            else
            {
                return 0;
            }
        }
        // [AllowAnonymous]
        [Route("GetTransactionValueByCodeId")]
        [HttpPost]
        public List<GetTransactionValueByCodeId_Result> GetTransactionValueByCodeId(int TransactionCodeID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetTransactionValueByCodeId(TransactionCodeID);
            }
            else
            {
                List<GetTransactionValueByCodeId_Result> n = new List<GetTransactionValueByCodeId_Result>();
                return n;

            }
        }

        //  [AllowAnonymous]
        [Route("InsertUserAccess")]
        [HttpPost]
        public int InsertUserAccess(UserGroupAccess UGA)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUserAccess(UGA);
            }
            else
            {
                return 0;
            }
        }
        // [AllowAnonymous]
        [Route("UpdateUserStatus")]
        [HttpPost]
        public void UpdateUserStatus(int UserId, bool Status)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {


                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.UpdateUserStatus(UserId, Status);
            }
            else
            {
                return;
            }
        }
        // [AllowAnonymous]
        [Route("CheckCompanyCode")]
        public int CheckCompanyCode(string CompanyCode, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.CheckCompanyCode(CompanyCode, ProdID);
            }
            else
            {
                return 0;
            }
        }

        //  [AllowAnonymous]
        [Route("CheckGroupName")]
        [HttpPost]
        public int CheckGroupName(int ProdId, string GroupName, int GroupId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.CheckGroupName(ProdId, GroupName, GroupId);
            }
            else
            {
                return 0;
            }
        }

        // [AllowAnonymous]
        [Route("GetDefaultSettingByUserId")]
        [HttpPost]
        public List<GetDefaultSettingByUserId_Result> GetDefaultSettingByUserId(int UserId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {


                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetDefaultSettingByUserId(UserId);
            }
            else
            {
                List<GetDefaultSettingByUserId_Result> n = new List<GetDefaultSettingByUserId_Result>();
                return n;

            }
        }
        //  [AllowAnonymous]
        [Route("GetUserGroupDetails")]
        [HttpPost]
        public List<GetUserGroupDetails_Result> GetUserGroupDetails(int UserId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetUserGroupDetails(UserId);
            }
            else
            {
                List<GetUserGroupDetails_Result> n = new List<GetUserGroupDetails_Result>();
                return n;

            }
        }
        // [AllowAnonymous]
        [Route("InsertUpdateBankInfo")]
        [HttpPost]
        public int InsertUpdateBankInfo(BankInfo _BK)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertUpdateBankInfo(_BK);
            }
            else
            {
                return 0;

            }
        }
        // [AllowAnonymous]
        [Route("GetBankInfoList")]
        [HttpPost]
        public List<GetBankInfoList_Result> GetBankInfoList(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetBankInfoList(ProdId);
            }
            else
            {
                List<GetBankInfoList_Result> n = new List<GetBankInfoList_Result>();
                return n;

            }
        }
        //  [AllowAnonymous]
        [Route("GetStateListByCountryId")]
        [HttpPost]
        public List<GetStateListByCountryId_Result> GetStateListByCountryId(int CountryID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetStateListByCountryId(CountryID);
            }
            else
            {
                List<GetStateListByCountryId_Result> n = new List<GetStateListByCountryId_Result>();
                return n;

            }
        }

        //  [AllowAnonymous]
        [Route("FederalTaxAgencyAutoFill")]
        [HttpGet]
        public List<FederalTaxAgencyAutoFill_Result> FederalTaxAgencyAutoFill()
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.FederalTaxAgencyAutoFill();
            }
            else
            {
                List<FederalTaxAgencyAutoFill_Result> n = new List<FederalTaxAgencyAutoFill_Result>();
                return n;

            }

        }

        //   [AllowAnonymous]
        [Route("FederalTaxFormAutoFill")]
        [HttpGet]
        public List<FederalTaxFormAutoFill_Result> FederalTaxFormAutoFill()
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.FederalTaxFormAutoFill();
            }
            else
            {
                List<FederalTaxFormAutoFill_Result> n = new List<FederalTaxFormAutoFill_Result>();
                return n;

            }

        }
        // [AllowAnonymous]
        [Route("InsertupdateCheckSetting")]
        [HttpPost]
        public int InsertupdateCheckSetting(CheckSetting _CS)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.InsertupdateCheckSetting(_CS);
            }
            else
            {
                return 0;
            }
        }
        //  [AllowAnonymous]
        [Route("GetTransactionDefaultListByUserId")]
        [HttpPost]
        public List<GetTransactionDefaultListByUserId_Result> GetTransactionDefaultListByUserId(int UserId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetTransactionDefaultListByUserId(UserId);
            }
            else
            {
                List<GetTransactionDefaultListByUserId_Result> n = new List<GetTransactionDefaultListByUserId_Result>();
                return n;

            }
        }

        // [AllowAnonymous]
        [Route("GetTransactionCode")]
        [HttpGet]
        public List<GetTransactionCode_Result> GetTransactionCode(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetTransactionCode(ProdId);
            }
            else
            {
                List<GetTransactionCode_Result> n = new List<GetTransactionCode_Result>();
                return n;

            }
        }

        //  [AllowAnonymous]
        [Route("GetAllAccountType")]
        [HttpGet]
        public List<GetAllAccountType_Result> GetAllAccountType(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetAllAccountType(ProdId);
            }
            else
            {
                List<GetAllAccountType_Result> n = new List<GetAllAccountType_Result>();
                return n;

            }
        }

        // [AllowAnonymous]
        [Route("GetTransactionCodeFill")]
        [HttpGet]
        public List<GetTransactionCodeFill_Result> GetTransactionCodeFill(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetTransactionCodeFill(ProdId);
            }
            else
            {
                List<GetTransactionCodeFill_Result> n = new List<GetTransactionCodeFill_Result>();
                return n;

            }
        }
        //  [AllowAnonymous]
        [Route("GetCompanyIdByGroupId")]
        [HttpPost]
        public List<GetCompanyIdByGroupId_Result> GetCompanyIdByGroupId(int GroupId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetCompanyIdByGroupId(GroupId);
            }
            else
            {
                List<GetCompanyIdByGroupId_Result> n = new List<GetCompanyIdByGroupId_Result>();
                return n;

            }
        }
        //[AllowAnonymous]
        [Route("GetBankInfoById")]
        [HttpPost]
        public List<GetBankInfoById_Result> GetBankInfoById(int BankId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetBankInfoById(BankId);
            }
            else
            {
                List<GetBankInfoById_Result> n = new List<GetBankInfoById_Result>();
                return n;

            }

        }

        // [AllowAnonymous]
        [Route("TransFieldStatusChange")]
        [HttpPost]
        public void TransFieldStatusChange(int TransactionCodeID, bool Status)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.TransFieldStatusChange(TransactionCodeID, Status);
            }
            else
            {
                return;
            }
        }

        // [AllowAnonymous]
        [Route("GetAllTransactionValue")]
        [HttpGet]
        public List<GetAllTransactionValue_Result> GetAllTransactionValue(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetAllTransactionValue(ProdId);
            }
            else
            {
                List<GetAllTransactionValue_Result> n = new List<GetAllTransactionValue_Result>();
                return n;

            }

        }

        //  [AllowAnonymous]
        [Route("TransValueStatusChange")]
        [HttpPost]
        public void TransValueStatusChange(int TransactionValueID, bool Status)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.TransValueStatusChange(TransactionValueID, Status);
            }
            else
            {
                return;
            }
        }


        //  [AllowAnonymous]
        [Route("CheckTransactionCodeField")]
        public int CheckTransactionCodeField(string TransactionCode, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.CheckTransactionCodeField(TransactionCode, ProdID);
            }
            else
            {
                return 0;
            }
        }

        // [AllowAnonymous]
        [Route("GetUniqueTransCode")]
        [HttpGet]
        public List<GetUniqueTransCode_Result> GetUniqueTransCode(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetUniqueTransCode(ProdId);
            }
            else
            {
                List<GetUniqueTransCode_Result> n = new List<GetUniqueTransCode_Result>();
                return n;

            }
        }

        //[AllowAnonymous]
        [Route("SaveTransactionCode")]
        [HttpPost]
        public void SaveTransactionCode(TransactionCode _TransCode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.SaveTransactionCode(_TransCode);
            }
            else
            {
                return;
            }
        }

        // [AllowAnonymous]
        [Route("SaveTransactionValue")]
        [HttpPost]
        public string SaveTransactionValue(TransactionValue _TransValue)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.SaveTransactionValue(_TransValue);
            }
            else
            {
                return "";
            }
        }

        //   [AllowAnonymous]
        [Route("UpdateTransactionCode")]
        [HttpPost]
        public void UpdateTransactionCode(TransactionCode _TransCode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.UpdateTransactionCode(_TransCode);
            }
            else
            {
                return;
            }
        }

        //  [AllowAnonymous]
        [Route("GetTransactionValueFillByID")]
        [HttpGet]
        public List<GetTransactionValueFillByID_Result> GetTransactionValueFillByID(int TransactionCodeID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.GetTransactionValueFillByID(TransactionCodeID);
            }
            else
            {
                List<GetTransactionValueFillByID_Result> n = new List<GetTransactionValueFillByID_Result>();
                return n;

            }
        }

        // [AllowAnonymous]
        [Route("UpdateTransactionValue")]
        [HttpPost]
        public void UpdateTransactionValue(TransactionValue _TransValue)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.UpdateTransactionValue(_TransValue);
            }
            else
            {
                return;
            }


        }


        // [AllowAnonymous]
        [Route("GetUserDetailsByUserId")]
        [HttpPost]
        public List<GetUserDetailsByUserId_Result> GetUserDetailsByUserId(int UserId)
        {
            CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
            return BusinessContext.GetUserDetailsByUserId(UserId);
        }
        [Route("GetDefaultBankInfoByCompanyId")]
        [HttpPost]
        public List<GetDefaultBankInfoByCompanyId_Result> GetDefaultBankInfoByCompanyId(int prodId, int CompanyId)
        {
            CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
            return BusinessContext.GetDefaultBankInfoByCompanyId(prodId, CompanyId);
        }

        [Route("GetDefaultSegmentValueByUserId")]
        [HttpPost]
        public List<GetDefaultSegmentValueByUserId_Result> GetDefaultSegmentValueByUserId(int UserId, int ProdId)
        {
            CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
            return BusinessContext.GetDefaultSegmentValueByUserId(UserId, ProdId);
        }

        //=============CheckCOA====================//
        [AllowAnonymous]
        [Route("CheckUserexistanceCA")]
        [HttpPost]
        public int CheckUserexistanceCA(string Email)
        {
            CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
            var result = BusinessContext.CheckUserexistanceCA(Email);
            return result;
        }

        [Route("addproductionaccessforuser")]
        [HttpPost]
        public int addproductionaccessforuser(int AdminUserid, int ProdID, string EmailId, string ProdcutionName)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                var result = BusinessContext.addproductionaccessforuser(AdminUserid, ProdID, EmailId);


                ///////////////////////////// Send Mail ///////////////////////



                var myMessage = new SendGridMessage();
                myMessage.From = new MailAddress("emsca.ca@gmail.com");
                myMessage.AddTo(EmailId);
                myMessage.Subject = " registration for EMSCA";
                string url = HttpContext.Current.Request.Url.Authority;
                if (url == "182.70.240.22")
                {
                    url = url + ":88/EMSCA";
                }
                String msgbody = "<table width=\"600\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"font-family: Arial;\"><tr><td style=\"height: 117px; padding: 5px 28px 0 14px; ";
                msgbody += "background-color: #5a8ec0; border-radius: 10px 10px 0px 0px;\">";
                //Start LOGO
                msgbody += "<a href=\"#\" class=\"appbrand\"><img src=\"https://" + url + "/Content/images/logo.png\" alt=\"logo\" style=\" padding: 10px; background-color: rgb(240, 240, 240); border-radius: 10px; width:30%;\"></a>";
                //End LOGO
                msgbody += "</td></tr><tr><td style=\"border-left: 1px solid #84bd00; border-right: 1px solid #84bd00; border-bottom: 5px solid #84bd00; padding: 16px 17px 0;\"><p><strong style=\"margin-right: 33px;\"></strong>&nbsp;";


                msgbody += "<br /><strong style=\"margin-right: 15px;\">Email ID:</strong>&nbsp;";
                msgbody += EmailId;


                msgbody += "<br /> <br />  </p><p>You now have access to another production :[ <b>" + ProdcutionName + "</b>]</p>";
                msgbody += "<br /><p style=\"margin-right: 15px;\">https://" + url + "</p>&nbsp;";
                msgbody += "<br /><p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">Thank you,</p>";
                msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">The EMS ATLAS Accounting Team</p>";
                msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; margin:0 !important; padding: 0; line-height: 17px;\">This message was sent from an unmonitored email address. Please do not reply to this message.</p><br />";
                msgbody += " </td></tr><tr>";
                msgbody += " <td style=\"width: 100%; height: 117px; padding: 13px 28px 13px 14px; background-color: #5a8ec0; border-radius: 0px 0px 8px 10px; color: #fff;\">";
                msgbody += "<div style=\"float: left; width: 73%;\"><p style=\"color: #fff; font-size: 14px; font-weight: bold; line-height: 17px; padding: 0 0 16px 0; margin: 0px;\">";
                msgbody += "  <a style=\"font-weight: 700; font-size: 16pt; color: #fff; text-decoration: none;\" href=\"#\"></a>";
                msgbody += "  </p></div></td></tr></table>";


                ////////////////////////////////////////////////////////////

                myMessage.Html = msgbody;

                MailMessage Msg = new MailMessage();
                // Sender e-mail address.
                //Msg.From = new MailAddress("emsca.ca@gmail.com");
                //Msg.From = new MailAddress("notifications@emspayroll.com");
                Msg.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
                // Recipient e-mail address.
                Msg.To.Add(EmailId);
                Msg.Subject = "EMSCA-Production Access";
                Msg.Body = msgbody;
                Msg.IsBodyHtml = true;
                // your remote SMTP server IP.
                //SmtpClient smtp = new SmtpClient();
                //smtp.Host = "smtp.gmail.com";
                //smtp.Port = 587;
                //smtp.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["mailuser"], System.Configuration.ConfigurationManager.AppSettings["mailuserpassword"]);
                //smtp.EnableSsl = true;
                //smtp.Send(Msg);

                SmtpClient smtp = new SmtpClient();
                smtp.Host = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
                smtp.UseDefaultCredentials = false;
                smtp.Port = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"]);
                smtp.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["mailuser"], System.Configuration.ConfigurationManager.AppSettings["mailuserpassword"]);
                smtp.EnableSsl = true;                
                smtp.Send(Msg);

                ////////////////////////////////////////////////////////////




                return result;
            }
            else
            {
                return 0;
            }
        }

        [Route("InsertOnlyCausersbyemailID")]
        [HttpPost]
        public int InsertOnlyCausersbyemailID(int AdminUserId, string EmailID, int Prodid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                var result = BusinessContext.InsertOnlyCausersbyemailID(AdminUserId, EmailID, Prodid);
                return result;
            }
            else
            {
                return 0;
            }
        }
        [Route("InsertUpdateClearingAccount")]
        [HttpPost]
        public int InsertUpdateClearingAccount(List<AccountClearing> AC)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                var result = BusinessContext.InsertUpdateClearingAccount(AC);
                return result;
            }
            else
            {
                return 0;
            }
        }

        [Route("GetCOAForClearing")]
        [HttpPost]
        public List<GetCOAForClearing_Result> GetCOAForClearing(AccountClearingObj _AC)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                var result = BusinessContext.GetCOAForClearing(_AC);
                return result;
            }
            else
            {
                List<GetCOAForClearing_Result> n = new List<GetCOAForClearing_Result>();
                return n;
            }
        }
        [Route("GetCleringAccountById")]
        [HttpPost]
        public List<GetCleringAccountById_Result> GetCleringAccountById(string Type, int CompanyId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                var result = BusinessContext.GetCleringAccountById(Type, CompanyId);
                return result;
            }
            else
            {
                List<GetCleringAccountById_Result> n = new List<GetCleringAccountById_Result>();
                return n;
            }
        }

        [Route("CheckSettingUpdate")]
        [HttpPost]
        public void CheckSettingUpdate(int BankId, string StartNumber, string EndNumber, int ProdId, int CreatedBy)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.CheckSettingUpdate(BankId, StartNumber, EndNumber, ProdId, CreatedBy);

            }
        }


        [Route("spTimeZone")]
        [HttpPost]
        public List<spTimeZone_Result> spTimeZone(int ProdID, string TimeZone, string TimeDifference, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.spTimeZone(ProdID, TimeZone, TimeDifference, Mode);
            }
            else
            {
                List<spTimeZone_Result> n = new List<spTimeZone_Result>();
                return n;
            }
        }
        [Route("SettingsTaxCodesUpsert")]
        [HttpPost]
        public int SettingsTaxCodesUpsert(TaxCodeDetail ObjTaxCodes)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.SettingsTaxCodesUpsert(ObjTaxCodes);
            }
            else
            {
                return 0;
            }
        }
        [Route("SettingsTaxCodeGet")]
        [HttpPost]
        public List<SettingsTaxCodeGet_Result> SettingsTaxCodeGet(int ProdId, int TaxCodeId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                return BusinessContext.SettingsTaxCodeGet(ProdId, TaxCodeId);
            }
            else
            {
                List<SettingsTaxCodeGet_Result> obj = new List<SettingsTaxCodeGet_Result>();
                return obj;
            }
        }

        [Route("SettingBankAccounts")]
        [HttpPost]
        public List<SettingBankAccounts_Result> SettingBankAccounts(AccountClearingObj _AC)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                var result = BusinessContext.SettingBankAccounts(_AC);
                return result;
            }
            else
            {
                List<SettingBankAccounts_Result> n = new List<SettingBankAccounts_Result>();
                return n;
            }
        }

        [Route("InsertUpdatePOSPayInfo")]
        [HttpPost]
        public void InsertUpdatePOSPayInfo(POSPaySetting _BK)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                CompanySettingsBusiness BusinessContext = new CompanySettingsBusiness();
                BusinessContext.InsertUpdatePOSPayInfo(_BK);
            }
            
        }
    }

}




