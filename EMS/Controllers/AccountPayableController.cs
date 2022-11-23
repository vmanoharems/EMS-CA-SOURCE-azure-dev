using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace EMS.Controllers
{
    public class AccountPayableController : Controller
    {


        public ActionResult AccountPayable()
        {
            return View();
        }
        public ActionResult PaymentHistory()
        {
            return View();
        }
        public ActionResult Vendors()
        {
            return View();
        }
        public ActionResult PurchaseOrder()
        {
            return View();
        }
        public ActionResult AddPurchaseOrder()
        {
            return View();
        }
        public ActionResult EditPO()
        {
            return View();
        }
        public ActionResult PendingInvoice()
        {
            return View();
        }
        public ActionResult PostInvoice()
        {
            return View();
        }
        public ActionResult AddInvoice()
        {
            return View();
        }
        public ActionResult EditInvoice()
        {
            return View();
        }
        public ActionResult PettyCash()
        {
            return View();
        }

        public ActionResult CheckCycle()
        {
            return View();
        }

        public ActionResult POSPay()
        {
            return View();
        }

        public ActionResult CheckCyclev2()
        {
            return View();
        }
        public ActionResult CheckResult()
        {
            return View();
        }
        public ActionResult PrintCheck()
        {
            return View();
        }
        public ActionResult CheckRegister()
        {
            return View();
        }
        public ActionResult PaymentFilter()
        {
            return View();
        }
        public ActionResult Void()
        {
            return View();
        }
        public ActionResult VoidUnissued()
        {
            return View();
        }
        public ActionResult Reconciliation()
        {
            return View();
        }

        //Add New Pages
        public ActionResult PCEnvelopes()
        {
            return View();
        }
        public ActionResult EnvelopesEdit()
        {
            return View();
        }
        public ActionResult EnvelopeAudit()
        {
            return View();
        }
        public ActionResult Recipients()
        {
            return View();
        }
        public ActionResult Custodians()
        {
            return View();
        }
        public ActionResult PostedUnpaidInvoices()
        {
            return View();
        }
        public ActionResult AtlasInvoice()
        {
            return View();
        }
    }
}
