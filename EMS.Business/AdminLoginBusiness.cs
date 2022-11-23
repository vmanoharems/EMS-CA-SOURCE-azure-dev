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
    public class AdminToolsBusiness
    {
        AdminTools DataContext = new AdminTools();
        public List<String> AdminAPIToolsLedgerJournal(JSONParameters JSONParameters)
        {
            try
            {
                var result = DataContext.AdminAPIToolsLedgerJournal(JSONParameters);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<GetProdcutionListByUserId_Result> AdminAPIToolsProductionList(int UserId)
        {
            var result = DataContext.AdminAPIToolsProductionList(UserId);
            return result;
        }
        public List<GetAllSegmentByProdId_Result> AdminAPIToolsSegmentList(int ProdId, int Mode)
        {
            var result = DataContext.AdminAPIToolsAllSegmentList(ProdId, Mode);
            return result;
        }
    }
    public class AdminLoginBusiness
    {

        AdminLogin DataContext = new AdminLogin();
        public List<GetUserDetailsAdmin_Result> GetUserDetailsAdmin(string Email, string Password, string Type)
        {
            try
            {
                var result = DataContext.GetUserDetailsAdmin(Email, Password, Type);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<CheckAuthenticationCode_Result> CheckAuthenticationCode(int UserId, string AuthenticationCode)
        {
            var result = DataContext.CheckAuthenticationCode(UserId, AuthenticationCode);
            return result;
        }
        public List<GetProdcutionListByUserId_Result> GetProdcutionListByUserId(int UserId)
        {
            var result = DataContext.GetProdcutionListByUserId(UserId);
            return result;
        }
        public List<GetAllSegmentByProdId_Result> GetAllSegmentByProdId(int ProdId, int Mode)
        {
            var result = DataContext.GetAllSegmentByProdId(ProdId, Mode);
            return result;
        }
        public void SaveSegment(List<Segment> _segment)
        {
            try
            {
                DataContext.SaveSegment(_segment);
            }
            catch (Exception ex)
            { throw ex; }
        }
        public int CheckEmailVaild(string Email, string Admin)
        {
            var result = DataContext.CheckEmailVaild(Email, Admin);
            return result;
        }
        public int CheckNewDBName(string DBName)
        {
            var result = DataContext.CheckNewDBName(DBName);
            return result;
        }
        public int InsertEMSUser(AdminUser _AU)
        {
            var result = DataContext.InsertEMSUser(_AU);
            return result;
        }
        public List<ProductionNewDBCreate_Result> ProductionNewDBCreate(PrdouctionDBCreate PDBCreate)
        {
            var result = DataContext.ProductionNewDBCreate(PDBCreate);
            return result;
        }
        public List<GetUserDetailsPassword_Result> GetUserDetailsPassword(int UserId)
        {
            var result = DataContext.GetUserDetailsPassword(UserId);
            return result;
        }
        public int UpdatePasswordOfUser(string Password, int UserId)
        {
            var result = DataContext.UpdatePasswordOfUser(Password,  UserId);
            return result;
        }
        public List<GetDBConfigByProdId_Result> GetDBConfigByProdId(int ProdId)
        {
            var result = DataContext.GetDBConfigByProdId(ProdId);
            return result;
        }
        public int InsertUpdateAdminUser(CAUserAdmin _CAUAdmin)
        {
            var result = DataContext.InsertUpdateAdminUser(_CAUAdmin);
            return result;
        }

        public List<UpdateAuthCode_Result> UpdateAuthCode(int UserId, string AuthCode)
        {
            var result = DataContext.UpdateAuthCode(UserId, AuthCode);
            return result;
        }

       
        public List<GetAccessByKeyToken_Result> GetAccessByKeyToken(string Email )
        {
            var result = DataContext.GetAccessByKeyToken( Email);
            return result;
        }
        public int InsertupdateUserProduction(int ProdId, int UserId, int CreatedBy)
        {
            var result = DataContext.InsertupdateUserProduction( ProdId,  UserId,  CreatedBy);
            return result;
        }
        public List<GetSegmentWithLedger_Result> GetSegmentWithLedger(int ProdId)
        {
            var result = DataContext.GetSegmentWithLedger( ProdId);
            return result;
        }
        //public List<GetSegmentWithLedgerToday_Result> GetSegmentWithLedgerToday(int ProdId)
        //{
        //    var result = DataContext.GetSegmentWithLedgerToday(ProdId);
        //    return result;
        //}


        public int ProductionCleanUp(int ProdID, string EmailId, int UserId)
        {
            return DataContext.ProductionCleanUp( ProdID, EmailId, UserId);

        }
        //===============CheckExistingUserId=================//
        public int CheckUserexistanceCAAdmin(string Email)
        {
            var result = DataContext.CheckUserexistanceCAAdmin(Email);
            return result;
        }
        //public string GetBatchNumber(int ProdId, int UserId)
        //{
        //    var result = DataContext.GetBatchNumber( ProdId,  UserId);
        //    return result;
        //}
        public string UpdateBatchNumber(string BatchNumber, int UserId, int ProdId)
        {
            var result = DataContext.UpdateBatchNumber( BatchNumber,  UserId,  ProdId);
            return result;
        }
    }
}
