using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Net.Mail;
using EMS.Entity;
using EMS.Business;
using System.Web;
using SendGrid;
using System.Text;
//using SendGrid;


using EMS.Controllers;

namespace EMS.API
{
    // [Authorize]
    [CustomAuthorize()]
    [RoutePrefix("api/UserProfile")]

    public class UserProfileController : ApiController
    {
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
        //[AllowAnonymous]
        [Route("GetModuleTreeforgroup")]
        [HttpPost, HttpGet]
        public List<GetModuleTreeforgroup_Result> GetModuleTreeforgroup(int GroupId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                UserProfileBusiness DataContext = new UserProfileBusiness();
                return DataContext.GetModuleTreeforgroup(GroupId);
            }
            else
            {
                List<GetModuleTreeforgroup_Result> n = new List<GetModuleTreeforgroup_Result>();
                return n;
            }
        }

        //=====================//
        [AllowAnonymous]
        [Route("InsertUpdateUserProfileAP")]
        [HttpPost]
        public int InsertUpdateUserProfileAP(UserProfileAP _UserAp)
        {
            UserProfileBusiness BusinessContext = new UserProfileBusiness();
            return BusinessContext.InsertUpdateUserProfileAP(_UserAp);
        }

        //[AllowAnonymous]
        [Route("GetModuleTreeforgroup")]
        [HttpGet]
        public List<GetUserProfileInfoByProdid_Result> GetUserProfileInfoByProdid(int ProdId, string APType, int UserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                UserProfileBusiness DataContext = new UserProfileBusiness();
                return DataContext.GetUserProfileInfoByProdid(ProdId, APType, UserID);
            }
            else
            {
                List<GetUserProfileInfoByProdid_Result> n = new List<GetUserProfileInfoByProdid_Result>();
                return n;
            }

        }

        //=================PDF Generator================//

        [Route("GetMyDefaultsByProdId")]
        [HttpGet, HttpPost]
        public List<GetMyDefaultsByProdId_Result> GetMyDefaultsByProdId(int UserId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                UserProfileBusiness DataContext = new UserProfileBusiness();
                return DataContext.GetMyDefaultsByProdId(UserId);
            }
            else
            {
                List<GetMyDefaultsByProdId_Result> n = new List<GetMyDefaultsByProdId_Result>();
                return n;
            }


        }


        //==================================================//

        [AllowAnonymous]
        [Route("InsertUpdateMyDefaultUserProfile")]
        [HttpPost]
        public int InsertUpdateMyDefaultUserProfile(List<Mydefault> _MyDef)
        {
            UserProfileBusiness BusinessContext = new UserProfileBusiness();
            return BusinessContext.InsertUpdateMyDefaultUserProfile(_MyDef);
        }
    }
}









