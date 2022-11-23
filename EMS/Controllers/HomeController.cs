using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult ForgotPassword()
        {
            ViewBag.Message = "Forgot Password";

            return View();
        }

        public ActionResult LogIn()
        {
            ViewBag.Title = "LogIn";

            return View();
        } 
    }
}
