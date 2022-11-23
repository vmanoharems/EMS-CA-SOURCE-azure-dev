using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
    public class AdminUser
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string AuthenticationCode { get; set; }
        public string Accountstatus { get; set; }
        public bool Status { get; set; }
        public int createdby { get; set; }
        public bool AdminFlag { get; set; }
        public int ProdId { get; set; }
    }
    public class PrdouctionDBCreate
    {
        public string ProdName { get; set; }
        public int StudioId { get; set; }
        public int DivisionId { get; set; }
        public string status { get; set; }
        public int CreatedBy { get; set; }

        public string ProductionCode { get; set; }

    }
}
