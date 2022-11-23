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
   public class CompanySettingsBusiness
    {
        CompanySettings DataContext = new CompanySettings();

        //public List<GetUserDetails_Result> GetUserDetails(string Email, string Password)
        //{
        //    try
        //    {
        //        var result = DataContext.GetUserDetails(Email, Password);
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}
       

        public int InsertUpdateGroups(EMS.Entity.CompanyGroup _Groups)
        {
            var result = DataContext.InsertUpdateGroups(_Groups);
            return result;
        }
        public List<GetGroupDetailsBypropId_Result> GetGroupDetailsBypropId(int PropId)
        {
            try
            {
                var result = DataContext.GetGroupDetailsBypropId(PropId);
                return result;
            }catch(Exception ex)
            {

                throw ex;
            }
        }

        public List<GetCompanyList_Result> GetCompanyList(int ProdID)
        {
            try
            {
                var result = DataContext.GetCompanyList(ProdID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<GetCompanyDetail_Result> GetCompanyDetail(int CompanyID)
        {
            try
            {
                var result = DataContext.GetCompanyDetail(CompanyID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int InsertUpdateCompanyCreation(Company _ComCre)
        {
            var result = DataContext.InsertUpdateCompanyCreation(_ComCre);
            return result;
        }

        public int InsertUpdateCompanyTaxInfo(taxinfo _TaxInfo)
        {
            var result = DataContext.InsertUpdateCompanyTaxInfo(_TaxInfo);
            return result;
        }
        public List<GetCAUserListByPropId_Result> GetCAUserListByPropId(int propid)
        {
            var result = DataContext.GetCAUserListByPropId(propid);
            return result;
        }
        public List<GetModulesDetails_Result> GetModulesDetails(int GroupId)
        {
            var result = DataContext.GetModulesDetails(GroupId);
            return result;

        }
        public List<GetCompnayCodeByProdId_Result> GetCompnayCodeByProdId(int ProdId)
        {
            var result = DataContext.GetCompnayCodeByProdId(ProdId);
            return result;

        }
        public void InsertUpdateCompanySetting(CompanySetting _CompanySetting)
        {
            DataContext.InsertUpdateCompanySetting(_CompanySetting);
        }
        public void InsertUpdateCurrencyExchange(List<CurrencyExchange> _CurrencyExchange)
        {
            DataContext.InsertUpdateCurrencyExchange(_CurrencyExchange);
        }
        public List<GetExchangeRate_Result> GetExchangeRate(int CompanyID)
        {
            try
            {
                var result = DataContext.GetExchangeRate(CompanyID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void InsertUpdateStartingvalue(StartingValue _StartingValue)
        {
            DataContext.InsertUpdateStartingvalue(_StartingValue);
        }
        public List<GetStartingvalue_Result> GetStartingvalue(int CompanyID)
        {
            try
            {
                var result = DataContext.GetStartingvalue(CompanyID);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int InsertUpdatePermission(List<GroupPermission> Gp)
        {
            var result = DataContext.InsertUpdatePermission(Gp);
            return result;
        }
        public int InsertUpdateGroupCompanyAccess(CompanyGroupAccess AGP)
        {
            var result = DataContext.InsertUpdateGroupCompanyAccess(AGP);
            return result;
        }

       // user Page
       /*
        public List<GetCurrencyDetails_Result> GetCurrencyDetails(int ProdId)
        {
            var result = DataContext.GetCurrencyDetails(ProdId);
            return result;
        }
        */
        public List<GetSourceCodeDetails_Result> GetSourceCodeDetails(int ProdId)
        {
            var result = DataContext.GetSourceCodeDetails(ProdId);
            return result;
        }
        public List<GetBankInfoDetails_Result> GetBankInfoDetails(int ProdId)
        {
            var result = DataContext.GetBankInfoDetails(ProdId);
            return result;
        }
        public List<GetTranasactionCode_Result> GetTranasactionCode(int ProdId)
        {
            var result = DataContext.GetTranasactionCode(ProdId);
            return result;
        }
        public List<GetModuleDetailsByModuleId_Result> GetModuleDetailsByModuleId(int ModuleId)
        {
            var result = DataContext.GetModuleDetailsByModuleId(ModuleId);
            return result;
        }
        public int InsertupdateMyDefault(List<Mydefault> _MYdefault)
        {
            try
            {
                var result = DataContext.InsertupdateMyDefault(_MYdefault);
                return result;
            }
            catch (Exception ex) { throw ex; }
        }
        public List<GetTransactionValueByCodeId_Result> GetTransactionValueByCodeId(int TransactionCodeID)
        {
            var result = DataContext.GetTransactionValueByCodeId(TransactionCodeID);
            return result;
        }
        public int InsertUserAccess(UserGroupAccess UGA)
        {
            var result = DataContext.InsertUserAccess(UGA);
            return result;
        }
        public void UpdateUserStatus(int UserId, bool Status)
        {
            DataContext.UpdateUserStatus(UserId, Status);
        
        }
        public int CheckCompanyCode(string CompanyCode, int ProdID)
        {
            var result = DataContext.CheckCompanyCode(CompanyCode, ProdID);
            return result;
        }
        public int CheckGroupName(int ProdId, string GroupName, int GroupId)
        {
            var result = DataContext.CheckGroupName(ProdId, GroupName, GroupId);
            return result;
        }
      
        public List<GetDefaultSettingByUserId_Result> GetDefaultSettingByUserId(int UserId)
        {
            var result = DataContext.GetDefaultSettingByUserId(UserId);
            return result;
        }
        public List<GetUserGroupDetails_Result> GetUserGroupDetails(int UserId)
        {
            var result = DataContext.GetUserGroupDetails(UserId);
            return result;
        }
        public int InsertUpdateBankInfo(BankInfo _BK)
        {
            var result = DataContext.InsertUpdateBankInfo(_BK);
            return result;
        
        }
        public List<GetBankInfoList_Result> GetBankInfoList(int ProdId)
        {
            var result = DataContext.GetBankInfoList(ProdId);
            return result;
        }
        public List<GetStateListByCountryId_Result> GetStateListByCountryId(int CountryID)
        {
            var result = DataContext.GetStateListByCountryId(CountryID);
            return result;
        }

        public List<FederalTaxAgencyAutoFill_Result> FederalTaxAgencyAutoFill()
        {
            try
            {
                var result = DataContext.FederalTaxAgencyAutoFill();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<FederalTaxFormAutoFill_Result> FederalTaxFormAutoFill()
        {
            try
            {
                var result = DataContext.FederalTaxFormAutoFill();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int InsertupdateCheckSetting(CheckSetting _CS)
        {
            var result = DataContext.InsertupdateCheckSetting(_CS);
            return result;
        }
        public List<GetTransactionDefaultListByUserId_Result> GetTransactionDefaultListByUserId(int UserId)
        {
            var result = DataContext.GetTransactionDefaultListByUserId(UserId);
            return result;
        }

        public List<GetTransactionCode_Result> GetTransactionCode(int ProdId)
        {
            var result = DataContext.GetTransactionCode(ProdId);
            return result;
        }

        public List<GetAllAccountType_Result> GetAllAccountType(int ProdId)
        {
            var result = DataContext.GetAllAccountType(ProdId);
            return result;
        }
        public List<GetCompanyIdByGroupId_Result> GetCompanyIdByGroupId(int GroupId)
        {
            var result = DataContext.GetCompanyIdByGroupId(GroupId);
            return result;
        }

        public List<GetTransactionCodeFill_Result> GetTransactionCodeFill(int ProdId)
        {
            var result = DataContext.GetTransactionCodeFill(ProdId);
            return result;
        }

        public void TransFieldStatusChange(int TransactionCodeID, bool Status)
        {
            DataContext.TransFieldStatusChange(TransactionCodeID, Status);

        }

        public List<GetAllTransactionValue_Result> GetAllTransactionValue(int ProdId)
        {
            var result = DataContext.GetAllTransactionValue(ProdId);
            return result;
        }

        public void TransValueStatusChange(int TransactionValueID, bool Status)
        {
            DataContext.TransValueStatusChange(TransactionValueID, Status);

        }

        public int CheckTransactionCodeField(string TransactionCode, int ProdID)
        {
            var result = DataContext.CheckTransactionCodeField(TransactionCode, ProdID);
            return result;
        }

        public List<GetUniqueTransCode_Result> GetUniqueTransCode(int ProdId)
        {
            var result = DataContext.GetUniqueTransCode(ProdId);
            return result;
        }

        public void SaveTransactionCode(TransactionCode _TransCode)
        {
            DataContext.SaveTransactionCode(_TransCode);

        }

        public string SaveTransactionValue(TransactionValue _TransValue)
        {
           return DataContext.SaveTransactionValue(_TransValue);

        }
        public void UpdateTransactionCode(TransactionCode _TransCode)
        {
            DataContext.UpdateTransactionCode(_TransCode);

        }

        public List<GetTransactionValueFillByID_Result> GetTransactionValueFillByID(int TransactionCodeID)
        {
            var result = DataContext.GetTransactionValueFillByID(TransactionCodeID);
            return result;
        }

        public void UpdateTransactionValue(TransactionValue _TransValue)
        {
            DataContext.UpdateTransactionValue(_TransValue);

        }
        public List<GetBankInfoById_Result> GetBankInfoById(int BankId)
        {
            var result = DataContext.GetBankInfoById(BankId);
            return result;
        }
        public int InsertUpdateUser(CAUser _causer)
        {
            var result = DataContext.InsertUpdateUser(_causer);
            return result;
        }
        public List<GetUserDetailsByUserId_Result> GetUserDetailsByUserId(int UserId)
        {
            var result = DataContext.GetUserDetailsByUserId(UserId);
            return result;
        }
        public List<GetDefaultBankInfoByCompanyId_Result> GetDefaultBankInfoByCompanyId(int prodId, int CompanyId)
        {
            var result = DataContext.GetDefaultBankInfoByCompanyId( prodId,  CompanyId);
            return result;
        }
        public List<GetDefaultSegmentValueByUserId_Result> GetDefaultSegmentValueByUserId(int UserId, int ProdId)
        {
            var result = DataContext.GetDefaultSegmentValueByUserId( UserId,  ProdId);
            return result;
        }


       //===============CheckExistingCOA===============//
        public int CheckUserexistanceCA(string Email)
        {
            var result = DataContext.CheckUserexistanceCA(Email);
            return result;
        }
        public int addproductionaccessforuser(int AdminUserid, int ProdID, string EmailId)
        {
            var result = DataContext.addproductionaccessforuser(AdminUserid, ProdID, EmailId);
            return result;
        }
        public int InsertOnlyCausersbyemailID(int AdminUserId, string EmailID, int Prodid)
        {
            var result = DataContext.InsertOnlyCausersbyemailID( AdminUserId,  EmailID,  Prodid);
            return result;
        }
        public int InsertUpdateClearingAccount(List<AccountClearing> AC)
        {
            var result = DataContext.InsertUpdateClearingAccount( AC);
            return result;
        }
        public List<GetCOAForClearing_Result> GetCOAForClearing(AccountClearingObj _AC)
        {
            var result = DataContext.GetCOAForClearing( _AC);
            return result;
        }
        public List<GetCleringAccountById_Result> GetCleringAccountById(string Type, int CompanyId)
        {
            var result = DataContext.GetCleringAccountById( Type,  CompanyId);
            return result;
        }
        public void CheckSettingUpdate(int BankId, string StartNumber, string EndNumber, int ProdId, int CreatedBy)
        {
            DataContext.CheckSettingUpdate( BankId,  StartNumber,  EndNumber,  ProdId,  CreatedBy);
        }


        public List<spTimeZone_Result> spTimeZone(int ProdID, string TimeZone, string TimeDifference, int Mode)
        {
            var result = DataContext.spTimeZone(ProdID, TimeZone, TimeDifference,Mode);
            return result;
        }
        public int SettingsTaxCodesUpsert(TaxCodeDetail ObjTaxCodes)
        {
            var result = DataContext.SettingsTaxCodesUpsert(ObjTaxCodes);
            return result;

        }
        public List<SettingsTaxCodeGet_Result> SettingsTaxCodeGet(int ProdId, int TaxCodeId)
        {
            var result = DataContext.SettingsTaxCodeGet(ProdId, TaxCodeId);
            return result;

        }
        public List<SettingBankAccounts_Result> SettingBankAccounts(AccountClearingObj _AC)
        {
            return DataContext.SettingBankAccounts(_AC);
        }

        public void InsertUpdatePOSPayInfo(POSPaySetting _BK)
        {
           DataContext.InsertUpdatePOSPayInfo(_BK);
        }
    }

}
