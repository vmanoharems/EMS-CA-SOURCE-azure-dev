using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class AccountsController : Controller
    {
        public ActionResult AccountsPayable()
        {
            return View();
        }
    }
}
