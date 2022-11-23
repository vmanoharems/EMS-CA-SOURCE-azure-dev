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
    public class UserProfileBusiness
    {
        UserProfileData DataContext = new UserProfileData();

        public List<GetModuleTreeforgroup_Result> GetModuleTreeforgroup(int GroupId)
        {
            var result = DataContext.GetModuleTreeforgroup(GroupId);
            return result.ToList();
        }
        //===============insertupdateUserProfileAP============//
          public int InsertUpdateUserProfileAP(UserProfileAP _UserAp)
          {
            var result = DataContext.InsertUpdateUserProfileAP(_UserAp);
            return result;
          }
          public List<GetUserProfileInfoByProdid_Result> GetUserProfileInfoByProdid(int ProdId, string APType, int UserID)
          {
              var result = DataContext.GetUserProfileInfoByProdid(ProdId, APType, UserID);
              return result.ToList();
          }

          public List<GetMyDefaultsByProdId_Result> GetMyDefaultsByProdId(int UserId)
          {
              var result = DataContext.GetMyDefaultsByProdId(UserId);
              return result.ToList();
          }

          public int InsertUpdateMyDefaultUserProfile(List<Mydefault> _MyDef)
          {
              var result = DataContext.InsertUpdateMyDefaultUserProfile(_MyDef);
              return result;
          }
    }
}
