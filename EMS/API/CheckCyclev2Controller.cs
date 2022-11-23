using EMS.Business;
using EMS.Controllers;
using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/CheckCyclev2")]
    public class CheckCyclev2Controller : ApiController
    {
        CheckCycleBusiness BusinessContext = new CheckCycleBusiness();

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


        [Route("GetCheckCycle")]
        [HttpPost]
        public HttpResponseMessage GetCheckCycle(JSONParameters callParameters)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                string returnString = string.Join("", BusinessContext.GetCheckCycle(callParameters).ToArray());
                var response = this.Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new StringContent(returnString, Encoding.UTF8, "application/json");
                return response;
            }
            else
            {
                var response = this.Request.CreateResponse(HttpStatusCode.Forbidden);
                return response;
                //CheckCycleEntity n = new CheckCycleEntity();
                //return n;
            }
        }

    }
}
