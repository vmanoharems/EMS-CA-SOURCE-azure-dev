using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMS.Entity;

namespace EMS.Data
{
    public class UserProfileData
    {
        Data.UtilityData utility = new Data.UtilityData();
        public List<GetModuleTreeforgroup_Result> GetModuleTreeforgroup(int GroupId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetModuleTreeforgroup(GroupId);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //============InsertUpdateAP==============//
        public int InsertUpdateUserProfileAP(UserProfileAP _UserAp)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var UserProfile = DBContext.InsertUpdateUserProfileAP(_UserAp.UserProfileAPID, _UserAp.Company, _UserAp.Currency, _UserAp.BankInfo, _UserAp.PaymentType, _UserAp.FromDate, _UserAp.ToDate, _UserAp.Vendor, _UserAp.BatchNumber, _UserAp.UserID, _UserAp.ProdId, _UserAp.APType, _UserAp.CreatedBy, _UserAp.CreatedDate
                        );
                    return Convert.ToInt32(UserProfile);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<GetUserProfileInfoByProdid_Result>GetUserProfileInfoByProdid(int ProdId,string APType,int UserID)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetUserProfileInfoByProdid(ProdId, APType, UserID);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //================GetmyDefaults===============//
        public List<GetMyDefaultsByProdId_Result> GetMyDefaultsByProdId(int UserId)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    var a = DBContext.GetMyDefaultsByProdId(UserId);
                    return a.ToList();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        //========================InsertUpdateMyfaults====================//

        public int InsertUpdateMyDefaultUserProfile(List<Mydefault> _MyDef)
        {
            CAEntities DBContext = utility.DBChange(ConnnectionString.GlobalValue);
            using (DBContext)
            {
                try
                {
                    DBContext.DeleteMyDefaultForUser(_MyDef[0].UserId);
                    foreach (var item in _MyDef)
                    {
                        var result = DBContext.InsertUpdateMyDefaultUserProfile(item.Type,
                            item.UserType, item.RefId, item.Defvalue, item.UserId, item.ProdId);
                    }
                    return 0;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
