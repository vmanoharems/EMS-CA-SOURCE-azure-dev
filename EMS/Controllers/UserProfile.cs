using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class UserProfileController : Controller
    {
        public ActionResult MyDefaults()
        {
            return View();
        }
        public ActionResult AP()
        {
            return View();
        }
        public ActionResult MYLeddger()
        {
            return View();
        }
        public ActionResult BUDGET()
        {
            return View();
        }
        public ActionResult REPORTS()
        {
            return View();
        }

        
    }
}
