using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class AdminEMSController : Controller
    {
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult SetupProduction()
        {
            return View();
        }
        public ActionResult SegmentSetup()
        {
            return View();
        }  public ActionResult AdminPayroll()
        {
            return View();
        }
       
        public ActionResult AddGroup()
        {
            return View();
        }

        public ActionResult AddUsers()
        {
            return View();
        }

        public ActionResult Users()
        {
            return View();
        }

        public ActionResult CheckSetting()
        {
            return View();
        }
        public ActionResult TimeZone()
        {
            return View();
        }
        public ActionResult ComingSoon()
        {
            return View();
        }
        public ActionResult AdminToolsLedgerJournal()
        {
            return View();
        }
      
    }
}
