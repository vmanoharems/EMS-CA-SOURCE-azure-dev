using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class LedgerController : Controller
    {
        //
        // GET: /Ledger/

        public ActionResult LedgerList()
        {
            return View();
        }
        // Added Below
        public ActionResult TrailBalance()
        {
            return View();
        }
        public ActionResult JournalEntries()
        {
            return View();
        }
        public ActionResult Adjustments()
        {
            return View();
        }
        public ActionResult Segments()
        {
            return View();
        }
        public ActionResult COA()
        {
            return View();
        }

        public ActionResult GLSetup()
        {
            return View();
        }
        public ActionResult ClosePeriod()
        {
            return View();
        }
        public ActionResult JEDistributionChange()
        {
            return View();
        }
        public ActionResult JEManualEntry()
        {
            return View();
        }
        public ActionResult JEAudit()
        {
            return View();
        }
        public ActionResult JEPostingHistory()
        {
            return View();
        }


    }
}
