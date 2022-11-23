using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;
using System.Data.Entity.Core.EntityClient;

namespace EMS.Data
{
    public class CompanySettings
    {
        Data.UtilityData utility = new Data.UtilityData();
        // Business.Utility utility = new Business.Utility();

        // public List<GetUserDetails_Result> GetUserDetails(string Email, string Password)
        // {
        //     CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //     using (DBContext)

        ////    using (CAEntities DBContext = new CAEntities())
        //     {

        //         try
        //         {
        //             // CAEntities DBContext = new CAEntities();

        //             var a = DBContext.GetUserDetails(Email, Password);
        //             return a.ToList();
        //         }
        //         catch (Exception ex)
        //         {
        //             throw ex;
        //         }
        //     }
        // }


        public int InsertUpdateGroups(CompanyGroup _Groups)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.InsertUpdateGroups(_Groups.GroupId, _Groups.GroupName, _Groups.Prodid, _Groups.Status,
                        _Groups.CreatedBy).FirstOrDefault();

                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetGroupDetailsBypropId_Result> GetGroupDetailsBypropId(int PropId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetGroupDetailsBypropId(PropId);

                return result.ToList();
            }
        }
        public List<GetCompanyList_Result> GetCompanyList(int ProdID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetCompanyList(ProdID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetCompanyDetail_Result> GetCompanyDetail(int ComapnyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetCompanyDetail(ComapnyID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetCAUserListByPropId_Result> GetCAUserListByPropId(int PropId)
        {

            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.GetCAUserListByPropId(PropId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetModulesDetails_Result> GetModulesDetails(int GroupId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.GetModulesDetails(GroupId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetCompnayCodeByProdId_Result> GetCompnayCodeByProdId(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.GetCompnayCodeByProdId(ProdId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public int InsertUpdateCompanyCreation(Company _compnay)
        {
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)

                //  using (CAEntities DBContext = new CAEntities())
                {
                    var CompnayId = DBContext.InsertUpdateCompanyCreation(

                        _compnay.CompanyID,
                        _compnay.CompanyCode, _compnay.ProductionTitle, _compnay.CompanyName,
                        _compnay.Address1,
                        _compnay.Address2, _compnay.Address3, _compnay.City, _compnay.State, _compnay.Zip, _compnay.CompanyPhone,
                        _compnay.Contact, _compnay.Entry, _compnay.Cost, _compnay.Format, _compnay.FiscalStartDate,
                        _compnay.DefaultValue, _compnay.createdby, _compnay.ProdID, _compnay.PeriodStart, _compnay.Country, _compnay.PeriodStartType

                     ).FirstOrDefault();
                    return Convert.ToInt32(CompnayId);
                }
            }
            catch
            {
                return _compnay.CompanyID;
            }
        }

        public int InsertUpdateCompanyTaxInfo(taxinfo _TaxInfo)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {

                    var CompanyTaxID = DBContext.InsertUpdateCompanyTaxInfo(_TaxInfo.CompanyID, _TaxInfo.federaltaxagency, _TaxInfo.federaltaxform,
                        _TaxInfo.EIN, _TaxInfo.CompanyTCC, _TaxInfo.StateID, _TaxInfo.StatetaxID, _TaxInfo.CreatedBy, _TaxInfo.ProdID).FirstOrDefault();

                    return Convert.ToInt32(CompanyTaxID);
                }
                catch (Exception ex) { throw ex; }

            }
        }

        public void InsertUpdateCompanySetting(CompanySetting _CompanySetting)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {

                    DBContext.InsertUpdateCompanySetting(_CompanySetting.CompanyID, _CompanySetting.AccountingCurrency, _CompanySetting.ReportLabel,
                    _CompanySetting.RealTimeCurrency, _CompanySetting.FringeAccountID, _CompanySetting.LaborAccountID, _CompanySetting.SuspenseAccountID, _CompanySetting.createdby, _CompanySetting.ProdID).FirstOrDefault();


                }
                catch (Exception ex) { throw ex; }

            }
        }
        //public void InsertUpdateCurrencyExchange(Currecny _Currecny)
        //{
        //    using (CAEntities DBContext = new CAEntities())
        //    {
        //        try
        //        {
        //            DBContext.InsertUpdateCurrencyExchange(_Currecny.CompanyID, _Currecny.CurrencyName, _Currecny.Currencycode,
        //            _Currecny.ExchangeRate, _Currecny.createdby, _Currecny.DefaultFlag, _Currecny.ProdID);
        //        }
        //        catch (Exception ex) { throw ex; }

        //    }
        //}

        public void InsertUpdateCurrencyExchange(List<CurrencyExchange> _CurrencyExchange)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                foreach (var item in _CurrencyExchange)
                {
                    DBContext.InsertUpdateCurrencyExchange(item.CompanyID, item.CurrencyName, item.Currencycode,
                       item.ExchangeRate, item.createdby, item.DefaultFlag, item.ProdID);
                }

            }
        }
        public List<GetExchangeRate_Result> GetExchangeRate(int ComapnyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetExchangeRate(ComapnyID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public void InsertUpdateStartingvalue(StartingValue _StartingValue)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //using (CAEntities DBContext = new CAEntities())
            {
                try
                {

                    DBContext.InsertUpdateStartingvalue(_StartingValue.CompanyID, _StartingValue.AP, _StartingValue.PO,
                    _StartingValue.Invoice, _StartingValue.CreatedBy, _StartingValue.ProdID);


                }
                catch (Exception ex) { throw ex; }

            }
        }
        public List<GetStartingvalue_Result> GetStartingvalue(int ComapnyID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.GetStartingvalue(ComapnyID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public int InsertUpdatePermission(List<GroupPermission> Gp)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    //var result = DBContext.InsertUpdatePermission(
                    //    Gp.GroupID, Gp.ModuleID, Gp.Access, Gp.CreatedBy, Gp.ProdID

                    //    ).FirstOrDefault();
                    //return Convert.ToInt32(result);

                    foreach (var item in Gp)
                    {
                        var result = DBContext.InsertUpdatePermission(
                            item.GroupID, item.ModuleID, item.Access == null? "No Access" : item.Access, item.CreatedBy, item.ProdID

                            ).FirstOrDefault();
                        //return Convert.ToInt32(result);
                    }
                    return 0;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int InsertUpdateGroupCompanyAccess(CompanyGroupAccess AGP)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //   using (CAEntities DBContext = new CAEntities())
            {
                CompanyGroup CG = new CompanyGroup();
                CG = AGP.ObjGroup;
                var GroupId = DBContext.InsertUpdateGroups(CG.GroupId, CG.GroupName, CG.Prodid, CG.Status,
                      CG.CreatedBy).FirstOrDefault();
                var result = DBContext.InsertUpdateGroupCompanyAccess(GroupId, AGP.Company, AGP.ProdId, AGP.CreatedBy);
                return Convert.ToInt32(GroupId);
            }
        }
        public List<GetTranasactionCode_Result> GetTranasactionCode(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTranasactionCode(ProdId);
                return result.ToList();
            }
        }

        // user page 
        /*
        public List<GetCurrencyDetails_Result> GetCurrencyDetails(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetCurrencyDetails(ProdId);
                return result.ToList();
            }
        }
        */
        public List<GetSourceCodeDetails_Result> GetSourceCodeDetails(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetSourceCodeDetails(ProdId);
                return result.ToList();
            }
        }
        public List<GetBankInfoDetails_Result> GetBankInfoDetails(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetBankInfoDetails(ProdId);
                return result.ToList();
            }
        }
        public List<GetModuleDetailsByModuleId_Result> GetModuleDetailsByModuleId(int ModuleId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetModuleDetailsByModuleId(ModuleId);
                return result.ToList();
            }
        }

        public int InsertupdateMyDefault(List<Mydefault> _MYdefault)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {

                    DBContext.DeleteMyDefaultForUser(_MYdefault[0].UserId);
                    foreach (var item in _MYdefault)
                    {
                        var result = DBContext.InsertupdateMyDefault(item.Type, item.UserType, item.RefId, item.Defvalue, item.UserId, item.ProdId);
                    }
                    return 0;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetTransactionValueByCodeId_Result> GetTransactionValueByCodeId(int TransactionCodeID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTransactionValueByCodeId(TransactionCodeID);
                return result.ToList();
            }
        }

        public int InsertUserAccess(UserGroupAccess UGA)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.InsertUserAccess(UGA.UserId, UGA.GroupId, UGA.ProdId, UGA.CreatedBy);
                return Convert.ToInt32(result);
            }
        }
        public void UpdateUserStatus(int UserId, bool Status)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.UpdateUserStatus(UserId, Status);

            }

            using (CAAdminEntities DBContexts = new CAAdminEntities())
            {
                var result = DBContexts.UpdateUserStatusAdmin(UserId, Status);
            }
        }

        public int CheckCompanyCode(string CompanyCode, int ProdID)
        {
            // var CompanyCount = "";
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)

                // using (CAEntities DBContext = new CAEntities())
                {
                    var CompanyCount = DBContext.CheckCompanyCode(
CompanyCode, ProdID
                     ).FirstOrDefault();
                    return Convert.ToInt32(CompanyCount);
                }
            }
            catch
            {
                return 0;
            }
        }
        public int CheckGroupName(int ProdId, string GroupName, int GroupId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.CheckGroupName(ProdId, GroupName, GroupId).FirstOrDefault();
                return Convert.ToInt32(result);

            }

        }

        public List<GetDefaultSettingByUserId_Result> GetDefaultSettingByUserId(int UserId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetDefaultSettingByUserId(UserId);
                return result.ToList();
            }
        }
        public List<GetUserGroupDetails_Result> GetUserGroupDetails(int UserId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetUserGroupDetails(UserId);
                return result.ToList();
            }
        }
        public int InsertUpdateBankInfo(BankInfo _BK)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.InsertUpdateBankInfo(
                        _BK.BankId, _BK.Bankname, _BK.CompanyId, _BK.Address1, _BK.Address2, _BK.Address3, _BK.city, _BK.State, _BK.zip,
                        _BK.Country, _BK.RoutingNumber, _BK.AccountNumber, _BK.BranchNumber, _BK.Branch, _BK.Clearing, _BK.Cash, _BK.Suspense, _BK.Bankfees, _BK.Deposits

                        , _BK.SourceCodeID, _BK.CurrencyBank, _BK.Status, _BK.PostiivePay, _BK.Prodid, _BK.CreatedBy).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
        }
        public List<GetBankInfoList_Result> GetBankInfoList(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetBankInfoList(ProdId);
                return result.ToList();
            }
        }
        public List<GetStateListByCountryId_Result> GetStateListByCountryId(int CountryID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetStateListByCountryId(CountryID);
                return result.ToList();
            }

        }

        public List<FederalTaxAgencyAutoFill_Result> FederalTaxAgencyAutoFill()
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.FederalTaxAgencyAutoFill();
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<FederalTaxFormAutoFill_Result> FederalTaxFormAutoFill()
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var a = DBContext.FederalTaxFormAutoFill();
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int InsertupdateCheckSetting(CheckSetting _CS)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.InsertupdateCheckSetting(
                        _CS.CheckSettingID, _CS.CompanyID, _CS.Style, _CS.Prefix, _CS.Length, _CS.StartNumber, _CS.EndNumber, _CS.Collated,
                        _CS.PrintZero, _CS.Copies, _CS.TopMargin, _CS.BottomMargin, _CS.LeftMargin, _CS.RightMargin, _CS.Status, _CS.BankID,
                        _CS.Prodid, _CS.CreatedBy, _CS.SectionOne, _CS.SectionTwo, _CS.SectionThree).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetTransactionDefaultListByUserId_Result> GetTransactionDefaultListByUserId(int UserId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.GetTransactionDefaultListByUserId(UserId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetTransactionCode_Result> GetTransactionCode(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTransactionCode(ProdId);
                return result.ToList();
            }
        }

        public List<GetAllAccountType_Result> GetAllAccountType(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetAllAccountType(ProdId);
                return result.ToList();
            }
        }

        public List<GetTransactionCodeFill_Result> GetTransactionCodeFill(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTransactionCodeFill(ProdId);
                return result.ToList();
            }
        }
        public List<GetCompanyIdByGroupId_Result> GetCompanyIdByGroupId(int GroupId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetCompanyIdByGroupId(GroupId);
                return result.ToList();
            }
        }

        public void TransFieldStatusChange(int TransactionCodeID, bool Status)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.TransFieldStatusChange(TransactionCodeID, Status);

            }
        }

        public List<GetAllTransactionValue_Result> GetAllTransactionValue(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetAllTransactionValue(ProdId);
                return result.ToList();
            }
        }

        public void TransValueStatusChange(int TransactionValueID, bool Status)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.TransValueStatusChange(TransactionValueID, Status);
            }
        }

        public int CheckTransactionCodeField(string TransactionCode, int ProdID)
        {
            // var CompanyCount = "";
            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)

                // using (CAEntities DBContext = new CAEntities())
                {
                    var TransCountCount = DBContext.CheckTransactionCodeField(
TransactionCode, ProdID
                     ).FirstOrDefault();
                    return Convert.ToInt32(TransCountCount);
                }
            }
            catch
            {
                return 0;
            }
        }

        public List<GetUniqueTransCode_Result> GetUniqueTransCode(int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetUniqueTransCode(ProdId);
                return result.ToList();
            }
        }

        public void SaveTransactionCode(TransactionCode _TransCode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    DBContext.SaveTransactionCode(_TransCode.Description, _TransCode.TransCode, _TransCode.Status,
                        _TransCode.ProdID, _TransCode.CreatedBy);


                }
                catch (Exception ex) { throw ex; }

            }
        }

        public string SaveTransactionValue(TransactionValue _TransValue)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.SaveTransactionValue(_TransValue.TransactionCodeID, _TransValue.TransValue, _TransValue.Status, _TransValue.Description,
                          _TransValue.ProdID, _TransValue.CreatedBy).FirstOrDefault();

                    return result;
                }
                catch (Exception ex) { throw ex; }

            }
        }

        public void UpdateTransactionCode(TransactionCode _TransCode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    DBContext.UpdateTransactionCode(_TransCode.TransactionCodeID, _TransCode.TransCode, _TransCode.Description, _TransCode.Status,
                         _TransCode.ModifiedBy);


                }
                catch (Exception ex) { throw ex; }

            }
        }

        public List<GetTransactionValueFillByID_Result> GetTransactionValueFillByID(int TransactionCodeID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                var result = DBContext.GetTransactionValueFillByID(TransactionCodeID);
                return result.ToList();
            }
        }

        public void UpdateTransactionValue(TransactionValue _TransCode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            //  using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    DBContext.UpdateTransactionValue(_TransCode.TransactionValueID, _TransCode.TransValue, _TransCode.Description, _TransCode.Status,
                         _TransCode.ModifiedBy);


                }
                catch (Exception ex) { throw ex; }

            }
        }
        public List<GetBankInfoById_Result> GetBankInfoById(int BankId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.GetBankInfoById(BankId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public int InsertUpdateUser(CAUser _causer)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    // CAEntities DBContext = new CAEntities();
                    var result = DBContext.InsertUpdateUser(
                        _causer.UserID, _causer.Name, _causer.Title, _causer.Email, _causer.Status, _causer.createdby
                        , _causer.GroupBatchAccess, _causer.CanClose, _causer.AllBatchAccess, _causer.ProdID

                           ).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetUserDetailsByUserId_Result> GetUserDetailsByUserId(int UserId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetUserDetailsByUserId(UserId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
        }
        public List<GetDefaultBankInfoByCompanyId_Result> GetDefaultBankInfoByCompanyId(int prodId, int CompanyId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetDefaultBankInfoByCompanyId(prodId, CompanyId);
                return result.ToList();
            }
        }

        public List<GetDefaultSegmentValueByUserId_Result> GetDefaultSegmentValueByUserId(int UserId, int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetDefaultSegmentValueByUserId(UserId, ProdId);
                return result.ToList();
            }
        }

        //============CheckExistingCOA==============//
        public int CheckUserexistanceCA(string Email)
        {

            try
            {
                CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
                using (DBContext)
                // using (CAEntities DBContext = new CAEntities())
                {
                    var result = DBContext.CheckifuserCA2(Email).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int addproductionaccessforuser(int AdminUserid, int ProdID, string EmailId)
        {
            int strUserid = 0;
            using (CAAdminEntities DBContexts = new CAAdminEntities())
            {
                try
                {
                    var result = DBContexts.addproductionaccessforuser(AdminUserid, ProdID).FirstOrDefault();
                    strUserid = Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.InsertUpdateUser(
                      AdminUserid, EmailId, "", EmailId, true, AdminUserid, true, true, true, ProdID).FirstOrDefault();
                    //return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
            return strUserid;

        }
        public int InsertOnlyCausersbyemailID(int AdminUserId, string EmailID, int Prodid)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.InsertOnlyCausersbyemailID(AdminUserId, EmailID, Prodid).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int InsertUpdateClearingAccount(List<AccountClearing> AC)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {

                foreach (var item in AC)
                {
                    var result = DBContext.InsertUpdateClearingAccount(item.AccountClearingId,
        item.Type, item.AccountName, item.COAId, item.CompanyId, item.BankId, item.CreatedBy, item.ProdId, item.AccountCode,
        item.ClearingType
                        ).FirstOrDefault();

                }
                return 0;
            }
        }
        public List<GetCOAForClearing_Result> GetCOAForClearing(AccountClearingObj _AC)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCOAForClearing(
                    _AC.ProdId, _AC.AccountType, _AC.CompanyId, _AC.Bankid, _AC.ClearingType, _AC.SegmentPosition
                  , _AC.COACode, _AC.AccountName
                    );
                return result.ToList();
            }
        }
        public List<GetCleringAccountById_Result> GetCleringAccountById(string Type, int CompanyId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.GetCleringAccountById(Type, CompanyId);
                return result.ToList();
            }
        }
        public void CheckSettingUpdate(int BankId, string StartNumber, string EndNumber, int ProdId, int CreatedBy)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.CheckSettingUpdate(BankId, StartNumber, EndNumber, ProdId, CreatedBy);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<spTimeZone_Result> spTimeZone(int ProdID, string TimeZone, string TimeDifference, int Mode)
        {

            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.spTimeZone(ProdID, TimeZone, TimeDifference, Mode);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int SettingsTaxCodesUpsert(TaxCodeDetail ObjTaxCodes)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.SettingsTaxCodesUpsert(ObjTaxCodes.TaxID, Convert.ToString(ObjTaxCodes.TaxCode).Trim(),
                    Convert.ToString(ObjTaxCodes.TaxDescription).Trim(),
                    ObjTaxCodes.Active, ObjTaxCodes.Createdby, ObjTaxCodes.Createdby, ObjTaxCodes.ProdId).FirstOrDefault();
                return result.TaxID;
            }
        }
        public List<SettingsTaxCodeGet_Result> SettingsTaxCodeGet(int ProdId, int TaxCodeId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                return DBContext.SettingsTaxCodeGet(ProdId, TaxCodeId).ToList();
            }
        }

           public List<SettingBankAccounts_Result> SettingBankAccounts(AccountClearingObj _AC)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                return DBContext.SettingBankAccounts(_AC.ProdId, _AC.AccountType, _AC.CompanyId, 
                    _AC.Bankid, _AC.ClearingType, _AC.SegmentPosition, _AC.COACode, _AC.AccountName).ToList();
                
            }
        }

        public void InsertUpdatePOSPayInfo(POSPaySetting _BK)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.BankInfoConfig_Update(
                        _BK.BankID, _BK.ConfigSettingAttribute, _BK.ConfigSettingJSON, true, _BK.ProdID);
                   
                }
                catch (Exception ex)
                {
                    throw ex;
                }

            }
        }
    }
}


