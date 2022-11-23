using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class AdminLogin
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<GetUserDetailsAdmin_Result> GetUserDetailsAdmin(string Email, string Password, string Type)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var a = DBContext.GetUserDetailsAdmin(Email, Password, Type);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<CheckAuthenticationCode_Result> CheckAuthenticationCode(int UserId, string AuthenticationCode)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var a = DBContext.CheckAuthenticationCode(UserId, AuthenticationCode);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetProdcutionListByUserId_Result> GetProdcutionListByUserId(int UserId)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var a = DBContext.GetProdcutionListByUserId(UserId);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetAllSegmentByProdId_Result> GetAllSegmentByProdId(int ProdId, int Mode)
        {
            // using (CAEntities DBContext = new CAEntities())
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetAllSegmentByProdId(ProdId, Mode);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public void SaveSegment(List<Segment> _segment)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)

            // using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.DeleteSegmentByProdId(_segment[0].ProdId);

                    Segment objSegment = new Segment();


                    foreach (var Item in _segment)
                    {
                        try
                        {
                            var rtn = DBContext.UpdateSegmentAdmin(
                                Item.SegmentCode,
                                Item.SegmentName,
                                Item.SegmentReportDescription,
                                Item.CodeLength,
                                Item.DetailFlag,
                                Item.ProdId,
                                Item.CreatedBy,
                                Item.SegmentLevel,
                                Item.Classification
                                ,Item.SubAccount1
                                , Item.SubAccount2
                                , Item.SubAccount3
                                , Item.SubAccount4
                                , Item.SubAccount5
                                , Item.SubAccount6
                                );
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }

                    DBContext.GenerateDefaultAccounts();


                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }


        }
        public int CheckEmailVaild(string Email, string Admin)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.CheckEmailVaild(Email, Admin).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
        public int CheckNewDBName(string DBName)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.CheckNewDBName(DBName).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int InsertEMSUser(AdminUser _AU)
        {
            int strResult = 0;
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.InsertEMSUser(
                        _AU.Email, _AU.Password, _AU.AuthenticationCode, _AU.Accountstatus,
    _AU.Status, _AU.createdby, _AU.AdminFlag, _AU.ProdId

                        ).FirstOrDefault();
                    // return Convert.ToInt32(result);
                    strResult = Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            CAEntities DBContext1 = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext1)
            {
                try
                {
                    var result = DBContext1.InsertOnlyCausersbyemailID(strResult, _AU.Email, _AU.ProdId).FirstOrDefault();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return strResult;
        }
        public List<ProductionNewDBCreate_Result> ProductionNewDBCreate(PrdouctionDBCreate PDBCreate)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.ProductionNewDBCreate(
                        PDBCreate.ProdName, PDBCreate.StudioId, PDBCreate.DivisionId, PDBCreate.status, PDBCreate.CreatedBy
                        , PDBCreate.ProductionCode
                        );
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetUserDetailsPassword_Result> GetUserDetailsPassword(int UserId)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.GetUserDetailsPassword(UserId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int UpdatePasswordOfUser(string Password, int UserId)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.UpdatePasswordOfUser(Password, UserId);// firstordefault
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetDBConfigByProdId_Result> GetDBConfigByProdId(int ProdId)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.GetDBConfigByProdId(ProdId);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int InsertUpdateAdminUser(CAUserAdmin _CAUAdmin)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.InsertUpdateAdminUser(_CAUAdmin.UserID,
                       _CAUAdmin.Email, _CAUAdmin.Password, _CAUAdmin.AuthenticationCode, _CAUAdmin.Accountstatus,
                       _CAUAdmin.Status, _CAUAdmin.createdby

                        ).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }

        public List<UpdateAuthCode_Result> UpdateAuthCode(int UserId, string AuthCode)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.UpdateAuthCode(UserId,AuthCode);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        
        public List<GetAccessByKeyToken_Result> GetAccessByKeyToken(string Email)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.GetAccessByKeyToken(Email);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public int InsertupdateUserProduction(int ProdId, int UserId, int CreatedBy)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.InsertupdateUserProduction( ProdId,  UserId,  CreatedBy);
                    return 0;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetSegmentWithLedger_Result> GetSegmentWithLedger(int ProdId)
        {
            using (CAEntities DBContext = new CAEntities())
            {
                try
                {
                    var result = DBContext.GetSegmentWithLedger(ProdId);
                    return result.ToList();

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        //public List<GetSegmentWithLedgerToday_Result> GetSegmentWithLedgerToday(int ProdId)
        //{
        //    using (CAEntities DBContext = new CAEntities())
        //    {
        //        try
        //        {
        //            var result = DBContext.GetSegmentWithLedgerToday(ProdId);
        //            return result.ToList();

        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //    }
        //}


        public int ProductionCleanUp(int ProdID,string EmailId,int UserId)
        {
            // using (CAEntities DBContext = new CAEntities())
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.ProductionCleanUp(ProdID,EmailId, UserId).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        //================CheckExistingUser=================//
        public int CheckUserexistanceCAAdmin(string Email)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var result = DBContext.CheckUserexistanceCAAdmin(Email).FirstOrDefault();
                    return Convert.ToInt32(result);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }
        //public string GetBatchNumber(int ProdId, int UserId)
        //{
        //    CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
        //    using (DBContext)
        //    {
        //        var result = DBContext.GetBatchNumber( ProdId,  UserId).FirstOrDefault();
        //        return Convert.ToString(result);
        //    }
        //}
        public string UpdateBatchNumber(string BatchNumber,int UserId,int ProdId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                var result = DBContext.UpdateBatchNumber( BatchNumber, UserId, ProdId).ToArray();
                string combindedString = string.Join("", result.ToArray());
                string strReturn = combindedString; //Format for datatables js library

                return strReturn;
            }          
        }
         
    }
    public class AdminTools
    {
        Data.AdminToolsData AdminToolsDataUtility = new Data.AdminToolsData();
        Data.UtilityData utility = new Data.UtilityData(); // keep utility in place for easier migration for now

        public List<String> AdminAPIToolsLedgerJournal(JSONParameters JSONParameters)
        {
            AtlasAdminToolsEntities DBContext = AdminToolsDataUtility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.AdminAPIToolsLedgerJournal(JSONParameters.callPayload);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetProdcutionListByUserId_Result> AdminAPIToolsProductionList(int UserId)
        {
            using (CAAdminEntities DBContext = new CAAdminEntities())
            {
                try
                {
                    var a = DBContext.GetProdcutionListByUserId(UserId);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public List<GetAllSegmentByProdId_Result> AdminAPIToolsAllSegmentList(int ProdId, int Mode)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var result = DBContext.GetAllSegmentByProdId(ProdId, Mode);
                    return result.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
