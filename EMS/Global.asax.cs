using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
//using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace EMS
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public sealed class LogonAuthorize : System.Web.Mvc.AuthorizeAttribute
        {
            public override void OnAuthorization(AuthorizationContext filterContext)
            {
                bool skipAuthorization = filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true)
                || filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AllowAnonymousAttribute), true);
                if (!skipAuthorization)
                {
                    base.OnAuthorization(filterContext);
                }
            }
        }
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new LogonAuthorize());
        }
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(System.Web.Http.GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();
            MvcHandler.DisableMvcResponseHeader = true;
        }
        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            var application = sender as HttpApplication;
            if (application != null && application.Context != null)
            {
                application.Context.Response.Headers.Remove("Server");
            }
            HttpContext.Current.Response.AddHeader("X-Frame-Options", "DENY");
            HttpContext.Current.Response.Cache.SetAllowResponseInBrowserHistory(false);
            HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            HttpContext.Current.Response.Cache.SetNoStore();
            Response.Cache.SetExpires(DateTime.Now);
            Response.Cache.SetValidUntilExpires(true);
        }
        protected void Application_Error(object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();

            Response.Clear();

            HttpException httpException = exception as HttpException;

            if (httpException != null)
            {
                string action;
                switch (httpException.GetHttpCode())
                {
                    case 404:
                        // page not found
                        action = "notfound";
                        break;
                    case 500:
                        // server error
                        action = "Internalservererror";
                        break;
                    default:
                        action = "Error";
                        break;
                }
                // clear error on server
                Server.ClearError();
                Response.Redirect(String.Format("~/Error/{0}/?message={1}", action, exception.Message));
            }
            else
            {
                System.Diagnostics.Debug.WriteLine(exception);
                Response.Clear();
                Response.Redirect(String.Format("~/Error/ErrorCustome/?message={0}", exception.Message));
            }
        }
    }
}