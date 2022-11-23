using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace EMS.Models
{
    public class RequireHttpsAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            string IsSSLEnabled = Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["IsSSLEnabled"]);
            if (actionContext.Request.RequestUri.Scheme != Uri.UriSchemeHttps && IsSSLEnabled == "true")
            {
                actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden)
                {
                    ReasonPhrase = "HTTPS Required"
                };
            }
            else
            {
                base.OnAuthorization(actionContext);
            }
        }
    }
}