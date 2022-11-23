using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class CompanySettingsController : Controller
    {
        public ActionResult Company()
        {
            return View();
        }
        public ActionResult ManageUsers()
        {
            return View();
        }
        public ActionResult Groups()
        {
            return View();
        }
    }
}