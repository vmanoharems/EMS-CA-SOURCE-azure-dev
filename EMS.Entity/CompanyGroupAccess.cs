using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
    public class CompanyGroupAccess
    {
        public int GroupId { get; set; }
        public string Company { get; set; }
        public int ProdId { get; set; }
        public int CreatedBy { get; set; }

        public CompanyGroup ObjGroup { get; set; }
    }

    public class UserGroupAccess
    {
        public int UserId { get; set; }
        public string GroupId { get; set; }
        public int ProdId { get; set; }
        public int CreatedBy { get; set; }

    }

    public class AccountCreationCompany
    {

        public int CreatedBy { get; set; }
        public int ProdId { get; set; }
        public string ACCountCode { get; set; }
        public string AccountName { get; set; }

    }
    public class AccountClearingObj
    {
        public int ProdId { get; set; }
        public int AccountType { get; set; }
        public int CompanyId { get; set; }
        public int Bankid { get; set; }
        public string ClearingType { get; set; }
        public int SegmentPosition { get; set; }
        public string COACode { get; set; }
        public string AccountName { get; set; }
    }
}
