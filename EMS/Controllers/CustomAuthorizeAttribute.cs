using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using EMS.Entity;
using EMS.Business;
using System.Threading;
using System.Net.Http.Headers;
using System.Text;
using System.Net;
using System.Net.Http;

namespace EMS.Controllers
{

    public class ClientCredentials
    {
      //  public ClientCredentials();

        public string APIKEY { get; set; }
        public string APITOKEN { get; set; }
    }
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        private const string BasicAuthResponseHeader = "WWW-Authenticate";
        private const string BasicAuthResponseHeaderValue = "Basic";

        private CAAdminEntities manager = new CAAdminEntities();

        protected CustomPrincipal CurrentUser
        {
            get { return Thread.CurrentPrincipal as CustomPrincipal; }
            set { Thread.CurrentPrincipal = value as CustomPrincipal; }
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            try
            {
                if (CustomAuthorizeAttribute.SkipAuthorization(actionContext))
                    return;

                this.Users = String.IsNullOrEmpty(this.Users) ? this.GetDefaultUsers() : this.Users;
                this.Roles = String.IsNullOrEmpty(this.Roles) ? this.GetDefaultRoles() : this.Roles;

                AuthenticationHeaderValue auth_value = actionContext.Request.Headers.Authorization;
                if (auth_value == null || String.IsNullOrWhiteSpace(auth_value.Parameter) || auth_value.Scheme != BasicAuthResponseHeaderValue)
                {
                    this.Forbidden(actionContext);
                    return;
                }

                ClientCredentials client_credentials = this.ParseAuthorizationHeader(auth_value.Parameter);
                if (client_credentials == null)
                {
                    this.Forbidden(actionContext); 
                    return;
                }
                AdminLoginBusiness oUser = new AdminLoginBusiness();
                //, client_credentials.APITOKEN
                var access = oUser.GetAccessByKeyToken(client_credentials.APIKEY);
                if (access == null)
                {
                    this.Forbidden(actionContext);
                    return;
                }

                this.CurrentUser = new CustomPrincipal(access[0].Email, access[0].AuthenticationCode);
                HttpContext.Current.User = this.CurrentUser;

                #region Check Users
                if (!String.IsNullOrEmpty(this.Users))
                {
                    if (!this.Users.Split(new char[] { ',', ';' }).Contains(this.CurrentUser.Identity.Name.ToString()))
                    {
                        this.Forbidden(actionContext);
                        return;
                    }
                }
                #endregion
            }
            catch (Exception ex)
            {
                this.Exception(actionContext, ex);
                return;
            }
        }

        private void Exception(HttpActionContext actionContext, Exception ex)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            //actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.InternalServerError);
            //actionContext.Response.Headers.Add(BasicAuthResponseHeader, BasicAuthResponseHeaderValue);
            //actionContext.Response.Content = ex
        }

        private void Forbidden(HttpActionContext actionContext)
        {
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
            //actionContext.Response.Headers.Add(BasicAuthResponseHeader, BasicAuthResponseHeaderValue);
        }

        private string GetDefaultUsers()
        {
            return "";
            //try{ return ConfigurationManager.AppSettings["AuthorizationConfig:Roles"]; }
            //catch { return ""; }
        }

        private string GetDefaultRoles()
        {
            return "";
            //try{return ConfigurationManager.AppSettings["AuthorizationConfig:Users"];}
            //catch { return ""; }
        }

        private ClientCredentials ParseAuthorizationHeader(string authHeader)
        {
            try
            {
                string[] credentials = Encoding.ASCII.GetString(Convert.FromBase64String(authHeader)).Split(new[] { ':' });

                if (credentials.Length != 3 || string.IsNullOrEmpty(credentials[0]) || string.IsNullOrEmpty(credentials[1]))
                    return null;
                ConnnectionString.GlobalValue = credentials[2];
                return new ClientCredentials() { APIKEY = credentials[0], APITOKEN = credentials[1] };
            }
            catch { return null; }
        }

        private static bool SkipAuthorization(HttpActionContext actionContext)
        {
            //System.Diagnostics.Contracts.Contract.Assert(actionContext != null);

            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }
    }
}