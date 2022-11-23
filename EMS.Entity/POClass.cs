using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
    public class POClass
    {
        public PurchaseOrder objPO { get; set; }
        public List<PurchaseOrderLine> objPOLine { get; set; }


    }
    public class InvoiceClass
    {
        public Invoice objIn { get; set; }
        public List<InvoiceLine> objInLine { get; set; }
    }
    public class PaymentClass
    {
        public List<Payment> objPayment { get; set; }
        public List<PaymentLine> objPaymentLine { get; set; }

        public List<PaymentCheckRun> objCheckRun { get; set; }

    }
    public class PCEnvelopeClass
    {
        public PCEnvelope objPC { get; set; }
        public List<PCEnvelopeLine> ObjPCLine { get; set; }

    }
    public class DeleteInvoiceLineClass
    {
        public int POLineID { get; set; }
        public int InvoiceLineID { get; set; }
        public int InvoiceID { get; set; }

    }
    public class BankReconcilationAddon
    {
        public int ReconcilationID { get; set; }
        public int JEID { get; set; }
        public bool Mode { get; set; }
        public int UserID { get; set; }
        public string Source { get; set; }
        public string SourceTable { get; set; }
        public string CheckNumber { get; set; }

    }



}
