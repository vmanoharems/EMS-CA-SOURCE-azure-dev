namespace EMS.Entity
{
    using System;
    using System.Collections.Generic;

    public partial class CurrencyExchange
    {      
        public int CompanyID { get; set; }
        public string CurrencyName { get; set;}
        public string Currencycode { get; set;}
        public decimal ExchangeRate { get; set;}
        public int createdby { get; set; }
        public bool DefaultFlag { get; set;}
        public int ProdID { get; set; }
    }
}
