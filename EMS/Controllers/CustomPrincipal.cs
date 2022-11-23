using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Principal;

namespace EMS.Controllers
{
    public class CustomPrincipal : IPrincipal
    {


        #region Properties
        public string[] Roles { get; set; }
        public string APITOKEN { get; set; }
        public IIdentity Identity { get; private set; }
        #endregion

        public bool IsInRole(string role)
        {
            if (String.IsNullOrEmpty(role))
                return true;

            if (this.Roles == null || this.Roles.Length <= 0)
                return false;

            if (this.Roles.Any(r => r.Trim().ToLower() == role.Trim().ToLower()))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public CustomPrincipal(string APIKEY, string vAPITOKEN)
        {
            string[] roles = { "Admin", "Owner", "Sales Person", "SuperAdmin" };
            this.Identity = new GenericIdentity(APIKEY);
            this.APITOKEN = vAPITOKEN;
            this.Roles = roles;
        }


    }

}