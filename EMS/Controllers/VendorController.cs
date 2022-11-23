using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class VendorController : Controller
    {
        // GET: Vendor
        public ActionResult TaxYear()
        {
            return View();
        }

        public ActionResult Worksheet()
        {
            return View();
        }



    }
}