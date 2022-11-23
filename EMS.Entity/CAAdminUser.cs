using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Entity
{
   public class CAAdminUser
    {

    public int UserId {get;set;}
	public string Name {get;set;}
	public string  Title {get;set;}
	public string Email {get;set;}
	public string Password {get;set;}
	public string Authcode {get;set;}
	public string AccountStatus {get;set;}
	public bool Status {get;set;}
	public int createdby {get;set;}
	public bool Adminflag {get;set;}
	public bool GroupBatchAccess {get;set;}
	public bool CanClose {get;set;}
	public bool AllBatchAccess {get;set;}
    public int ProdId { get; set; }

    }
}
