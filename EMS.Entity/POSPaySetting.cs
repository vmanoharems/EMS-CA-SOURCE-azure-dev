using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
    public class POSPaySetting
    {
        public int BankID { get; set; }
        public string ConfigSettingAttribute { get; set; }
        public string ConfigSettingJSON { get; set; }
        public int ProdID { get; set; }
    }
}
