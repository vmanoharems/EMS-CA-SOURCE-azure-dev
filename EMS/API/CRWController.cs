using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Net.Mail;
using EMS.Entity;
using EMS.Business;
using System.Web;
using SendGrid;
using System.Text;
using Newtonsoft.Json;

//using SendGrid;


using EMS.Controllers;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/CRWv2")]
    public class CRWv2Controller : ApiController
    {
        private const string LocalLoginProvider = "Local";
        CRWv2Bussiness BusinessContext = new CRWv2Bussiness();
        protected CustomPrincipal CurrentUser
        {
            get { return HttpContext.Current.User as CustomPrincipal; }
        }
        protected int Execute(string APITOKEN = null)
        {
            try
            {
                if (this.CurrentUser == null)
                    return -1;//"Authorization Failed!";
                if (this.CurrentUser.Identity != null || APITOKEN != null)//this.CurrentUser.IsInRole("Admin") ||
                    return 0;//"Success"
                else
                    return 1;//"ClientID is not valid!";
            }
            catch { return 99; }
        }
        private string MakeJSONExport(dynamic strResult)
        {
            string combindedString = Convert.ToString(strResult); //JsonConvert.SerializeObject(strResult);

            string json = "{\"exportdata\":"
                + combindedString
                + ",\"GUID\":\"" + Guid.NewGuid().ToString() + "\""
                + "}";
            string jsonReturn = json; // JsonConvert.SerializeObject(json);
            return jsonReturn.ToString();

        }

        [Route("CRWv2GetCRWData")]
        [HttpPost]
        public HttpResponseMessage CRWv2GetCRWData(JSONParameters callParameters)
        {
            CRWv2Bussiness BusinessContext = new CRWv2Bussiness();
            try
            {
                var varResult = BusinessContext.CRWv2GetCRWData(callParameters);
                var Payload = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
                string combindedString = "";

                if (Convert.ToBoolean(Payload["isExport"] ?? false))
                {
                    if (Convert.ToBoolean(Payload["SuppressZuro"]))
                    {
                       string combineStr = string.Join("", varResult.ToArray());
                       dynamic dynJson = JsonConvert.DeserializeObject(combineStr);
                       List<object> filteredData = new List<object>();
                       foreach (var item in dynJson)
                       {
                         decimal addition = Convert.ToDecimal(item.AT) + Convert.ToDecimal(item.AP)+Convert.ToDecimal(item.APO) 
                                          + Convert.ToDecimal(item.TC) + Convert.ToDecimal(item.V)+ Convert.ToDecimal(item.B);
                         if(addition != 0)
                         {
                          filteredData.Add(item);
                         }
                       }
                      var finalData = JsonConvert.SerializeObject(filteredData);
                         combindedString = MakeJSONExport(finalData);
                    }else { 
                    combindedString = string.Join("", varResult.ToArray());
                    combindedString = MakeJSONExport(combindedString);
                        }
                }
                else
                {
                    combindedString = string.Join("", varResult.ToArray());
                    combindedString = "{  \"dtData\": " + combindedString + "}"; //Format for datatables js library
                }
                var response = this.Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
                return response;
            }
            catch (Exception ex)
            {
                var response = this.Request.CreateResponse(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(ex.ToString() + ConnnectionString.GlobalValue);
                return response;
            }
        }
    }

    [CustomAuthorize()]
    [RoutePrefix("api/CRW")]
    public class CRWController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        CRWBussiness BusinessContext = new CRWBussiness();
        protected CustomPrincipal CurrentUser
        { get { return HttpContext.Current.User as CustomPrincipal; } }
        protected int Execute(string APITOKEN = null)
        {
            try
            {
                if (this.CurrentUser == null)
                    return -1;//"Authorization Failed!";
                if (this.CurrentUser.Identity != null || APITOKEN != null)//this.CurrentUser.IsInRole("Admin") ||
                    return 0;//"Success"
                else
                    return 1;//"ClientID is not valid!";
            }
            catch { return 99; }
        }

        [Route("GetBudgetByCompanyForCRW")]
        [HttpGet]
        public List<GetBudgetByCompanyForCRW_Result> GetBudgetByCompanyForCRW(string CompanCode, int ProdID, string LO, string EP, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetBudgetByCompanyForCRW(CompanCode, ProdID, LO, EP, Mode);
            }
            else
            {
                List<GetBudgetByCompanyForCRW_Result> n = new List<GetBudgetByCompanyForCRW_Result>();
                return n;
            }

        }


        [Route("GetCRWInfo")]
        [HttpGet]
        public List<GetCRWRollUp_Result> GetCRWRollUp(int BudgetFileID, int BudgetID, int Prodid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCRWRollUp(BudgetFileID, BudgetID, Prodid);
            }
            else
            {
                List<GetCRWRollUp_Result> n = new List<GetCRWRollUp_Result>();
                return n;
            }
        }

        [Route("InsertUpdateCRWNew")]
        [HttpGet]
        public List<InsertUpdateCRWNew_Result> InsertUpdateCRWNew(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue,
           string Changes, int COAID, string ModeType)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.InsertUpdateCRWNew(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            }
            else
            {
                List<InsertUpdateCRWNew_Result> n = new List<InsertUpdateCRWNew_Result>();
                return n;
            }
        }

        [Route("GetCRWNotesNew")]
        [HttpGet]
        public List<GetCRWNotesNew_Result> GetCRWNotesNew(int COAID, int BudgetID, int BudgetFileID, int ProdID, int UserID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetCRWNotesNew(COAID, BudgetID, BudgetFileID, ProdID, UserID);
            }
            else
            {
                List<GetCRWNotesNew_Result> n = new List<GetCRWNotesNew_Result>();
                return n;
            }
        }

        [Route("SaveCRWNotes")]
        [HttpGet]
        public List<SaveCRWNotes_Result> SaveCRWNotes(int COAID, int BudgetID, int BudgetFileID, int UserID, string Note, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.SaveCRWNotes(COAID, BudgetID, BudgetFileID, UserID, Note, ProdID);
            }
            else
            {
                List<SaveCRWNotes_Result> n = new List<SaveCRWNotes_Result>();
                return n;
            }
        }

        [Route("UpdateCRWNotes")]
        [HttpGet]

        public int UpdateCRWNotes(int CRWNotesID, string Status)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWNotes(CRWNotesID, Status);
            }
            else
            {
                return 0;
            }
        }

        [Route("GetPODetailListCRW")]
        [HttpGet]
        public List<GetPODetailListCRW_Result> GetPODetailListCRW(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID, int ProdID, string AccountNumber)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetPODetailListCRW(CID, BudgetID, BudgetFileID, BudgetCategoryID, ProdID, AccountNumber);
            }
            else
            {
                List<GetPODetailListCRW_Result> n = new List<GetPODetailListCRW_Result>();
                return n;
            }
        }

        [Route("GetInvoiceDetailListCRW")]
        [HttpGet]
        public List<GetInvoiceDetailListCRW_Result> GetInvoiceDetailListCRW(int CID, int BudgetID, int BudgetFileID, int BudgetCategoryID, int ProdID, string AccountNumber)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetInvoiceDetailListCRW(CID, BudgetID, BudgetFileID, BudgetCategoryID, ProdID, AccountNumber);
            }
            else
            {
                List<GetInvoiceDetailListCRW_Result> n = new List<GetInvoiceDetailListCRW_Result>();
                return n;
            }
        }


        [Route("GetJEDetailListCRW")]
        [HttpGet]
        public List<GetJEDetailListCRW_Result> GetJEDetailListCRW(int CID, int ProdID, string AccountNumber)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetJEDetailListCRW(CID, ProdID, AccountNumber);
            }
            else
            {
                List<GetJEDetailListCRW_Result> n = new List<GetJEDetailListCRW_Result>();
                return n;
            }
        }


        [Route("GetAccountForCRWFromBudget")]
        [HttpGet]
        public List<GetAccountForCRWFromBudget_Result> GetAccountForCRWFromBudget(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetAccountForCRWFromBudget(ProdID);
            }
            else
            {
                List<GetAccountForCRWFromBudget_Result> n = new List<GetAccountForCRWFromBudget_Result>();
                return n;
            }
        }

        [Route("GetLocationForCRWFromBudget")]
        [HttpGet]
        public List<GetLocationForCRWFromBudget_Result> GetLocationForCRWFromBudget(int ProdID, string CO)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetLocationForCRWFromBudget(ProdID, CO);
            }
            else
            {
                List<GetLocationForCRWFromBudget_Result> n = new List<GetLocationForCRWFromBudget_Result>();
                return n;
            }
        }

        [Route("GetEpisodeForCRWFromBudget")]
        [HttpGet]
        public List<GetEpisodeForCRWFromBudget_Result> GetEpisodeForCRWFromBudget(int ProdID, string CO, string LO)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetEpisodeForCRWFromBudget(ProdID, CO, LO);
            }
            else
            {
                List<GetEpisodeForCRWFromBudget_Result> n = new List<GetEpisodeForCRWFromBudget_Result>();
                return n;
            }
        }



        [Route("DeleteCRWNotes")]
        [HttpGet]
        public List<DeleteCRWNotes_Result> DeleteCRWNotes(int COAID, int BudgetID, int BudgetFileID, int ProdID, int UserID, int NotesID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.DeleteCRWNotes(COAID, BudgetID, BudgetFileID, ProdID, UserID, NotesID);
            }
            else
            {
                List<DeleteCRWNotes_Result> n = new List<DeleteCRWNotes_Result>();
                return n;
            }
        }


        [Route("GetDetailLevelAccountCRW")]
        [HttpGet]
        public List<GetDetailLevelAccountCRW_Result> GetDetailLevelAccountCRW(int ProdID, string AccountCode, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetDetailLevelAccountCRW(ProdID, AccountCode, Mode);
            }
            else
            {
                List<GetDetailLevelAccountCRW_Result> n = new List<GetDetailLevelAccountCRW_Result>();
                return n;
            }
        }


        [Route("GetSetForCRW")]
        [HttpGet]
        public List<GetSetForCRW_Result> GetSetForCRW(int COAID, int BudgetFileID, int BudgetID, int Prodid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetSetForCRW(COAID, BudgetFileID, BudgetID, Prodid);
            }
            else
            {
                List<GetSetForCRW_Result> n = new List<GetSetForCRW_Result>();
                return n;
            }
        }

        [Route("GetSeriesForCRW")]
        [HttpGet]
        public List<GetSeriesForCRW_Result> GetSeriesForCRW(int COAID, int Setid, int BudgetFileID, int BudgetID, int Prodid)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetSeriesForCRW(COAID, Setid, BudgetFileID, BudgetID, Prodid);
            }
            else
            {
                List<GetSeriesForCRW_Result> n = new List<GetSeriesForCRW_Result>();
                return n;
            }
        }

        [Route("CRWBudgetAmountRollUp")]
        [HttpGet]
        public List<CRWBudgetAmountRollUp_Result> CRWBudgetAmountRollUp(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CRWBudgetAmountRollUp(COAID, BudgetID, BudgetFileID, Amount);
            }
            else
            {
                List<CRWBudgetAmountRollUp_Result> n = new List<CRWBudgetAmountRollUp_Result>();
                return n;
            }
        }

        [Route("CRWBudgetAmountDistribution")]
        [HttpGet]
        public List<CRWBudgetAmountDistribution_Result> CRWBudgetAmountDistribution(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CRWBudgetAmountDistribution(COAID, BudgetID, BudgetFileID, Amount);
            }
            else
            {
                List<CRWBudgetAmountDistribution_Result> n = new List<CRWBudgetAmountDistribution_Result>();
                return n;
            }
        }


        [Route("CRWBudgetAmountDistributionAfterL2")]
        [HttpGet]
        public List<CRWBudgetAmountDistributionAfterL2_Result> CRWBudgetAmountDistributionAfterL2(int COAID, int BudgetID, int BudgetFileID, string Amount)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CRWBudgetAmountDistributionAfterL2(COAID, BudgetID, BudgetFileID, Amount);
            }
            else
            {
                List<CRWBudgetAmountDistributionAfterL2_Result> n = new List<CRWBudgetAmountDistributionAfterL2_Result>();
                return n;
            }
        }


        [Route("UpdateCRWBudget")]
        [HttpGet]
        public List<UpdateCRWBudget_Result> UpdateCRWBudget(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, int COAID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWBudget(BudgetID, BudgetFileID, DetailLevel, SaveValue, COAID);
            }
            else
            {
                List<UpdateCRWBudget_Result> n = new List<UpdateCRWBudget_Result>();
                return n;
            }
        }


        [Route("UpdateCRWEFC")]
        [HttpGet]
        public List<UpdateCRWEFC_Result> UpdateCRWEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue,
           string Changes, int COAID, string ModeType)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            }
            else
            {
                List<UpdateCRWEFC_Result> n = new List<UpdateCRWEFC_Result>();
                return n;
            }
        }

        [Route("UpdateCRWETC")]
        [HttpGet]
        public List<UpdateCRWETC_Result> UpdateCRWETC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue,
           string Changes, int COAID, string ModeType)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWETC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            }
            else
            {
                List<UpdateCRWETC_Result> n = new List<UpdateCRWETC_Result>();
                return n;
            }
        }


        [Route("UpdateCRWSetBudget")]
        [HttpGet]
        public List<UpdateCRWSetBudget_Result> UpdateCRWSetBudget(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, int COAID, int SetID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWSetBudget(BudgetID, BudgetFileID, DetailLevel, SaveValue, COAID, SetID);
            }
            else
            {
                List<UpdateCRWSetBudget_Result> n = new List<UpdateCRWSetBudget_Result>();
                return n;
            }
        }


        [Route("UpdateCRWSetEFC")]
        [HttpGet]
        public List<UpdateCRWSetEFC_Result> UpdateCRWSetEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue,
           string Changes, int COAID, int SetID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWSetEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, SetID);
            }
            else
            {
                List<UpdateCRWSetEFC_Result> n = new List<UpdateCRWSetEFC_Result>();
                return n;
            }
        }


        [Route("UpdateCRWSetETC")]
        [HttpGet]
        public List<UpdateCRWSetETC_Result> UpdateCRWSetETC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue,
           string Changes, int COAID, int SetID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWSetETC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, SetID);
            }
            else
            {
                List<UpdateCRWSetETC_Result> n = new List<UpdateCRWSetETC_Result>();
                return n;
            }
        }


        [Route("UpdateCRWBudgetBlank")]
        [HttpGet]
        public List<UpdateCRWBudgetBlank_Result> UpdateCRWBudgetBlank(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue, int COAID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateCRWBudgetBlank(BudgetID, BudgetFileID, DetailLevel, SaveValue, COAID);
            }
            else
            {
                List<UpdateCRWBudgetBlank_Result> n = new List<UpdateCRWBudgetBlank_Result>();
                return n;
            }
        }


        [Route("UpdateBlankEFC")]
        [HttpGet]
        public List<UpdateBlankEFC_Result> UpdateBlankEFC(int BudgetID, int BudgetFileID, int DetailLevel, string SaveValue,
           string Changes, int COAID, string ModeType)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.UpdateBlankEFC(BudgetID, BudgetFileID, DetailLevel, SaveValue, Changes, COAID, ModeType);
            }
            else
            {
                List<UpdateBlankEFC_Result> n = new List<UpdateBlankEFC_Result>();
                return n;
            }
        }


        [Route("CRWLockRow")]
        [HttpGet]
        public List<CRWLockRow_Result> CRWLockRow(int COAID, int BudgetID, int BudgetFileID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CRWLockRow(COAID, BudgetID, BudgetFileID);
            }
            else
            {
                List<CRWLockRow_Result> n = new List<CRWLockRow_Result>();
                return n;
            }
        }



        [Route("CheckForSetSegment")]
        [HttpGet]
        public List<CheckForSetSegment_Result> CheckForSetSegment(int ProdID, string Type)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckForSetSegment(ProdID, Type);
            }
            else
            {
                List<CheckForSetSegment_Result> n = new List<CheckForSetSegment_Result>();
                return n;
            }
        }

        [Route("CheckForSegment")]
        [HttpGet]
        public List<CheckForSegment_Result> CheckForSegment(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CheckForSegment(ProdID);
            }
            else
            {
                List<CheckForSegment_Result> n = new List<CheckForSegment_Result>();
                return n;
            }
        }

    }
}







