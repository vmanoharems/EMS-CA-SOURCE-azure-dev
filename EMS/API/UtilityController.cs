using System;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EMS.Entity;
using EMS.Controllers;
using EMS.Business;
using System.Web;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/AtlasUtilities")]
    public class AtlasUtilitiesController : ApiController
    {
        private const string LocalLoginProvider = "Local";
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
        public HttpResponseMessage AtlasUtilities_SegmentsConfig(JSONParameters callParameters)
        {
            JObject Parameters = JObject.Parse(callParameters.callPayload);
            int ProdID = Convert.ToInt32(Parameters["ProdID"].ToString());
            string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
            AtlasUtilities Utilities = new AtlasUtilities();
            string returnString = string.Join("", Utilities.AtlasUtilities_SegmentsJSON(ProdID).ToArray());
            combindedString += ",  \"resultJSON\": " + returnString + "}"; //Format for datatables js library
            var response = this.Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
            return response;
        }
        public HttpResponseMessage AtlasUtilities_Access(JSONParameters callParameters)
        {
            JObject Parameters = JObject.Parse(callParameters.callPayload);
            int ProdID = Convert.ToInt32(Parameters["ProdID"].ToString());
            int UserID = Convert.ToInt32(Parameters["UserID"].ToString());
            String securityhash = Parameters["GUID"].ToString();
            string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
            AtlasUtilities Utilities = new AtlasUtilities();
            string returnString = JsonConvert.SerializeObject(Utilities.AtlasUtilities_Access(ProdID, UserID, securityhash));
            combindedString += ",  \"resultJSON\": " + returnString + "}"; //Format for datatables js library
            var response = this.Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
            return response;
        }
        public HttpResponseMessage AtlasConfig_TransactionCodes(JSONParameters callParameters)
        {
            JObject Parameters = JObject.Parse(callParameters.callPayload);
            int ProdID = Convert.ToInt32(Parameters["ProdID"].ToString());
            string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
            AtlasUtilities Utilities = new AtlasUtilities();
            string returnString = string.Join("", Utilities.AtlasConfig_TransactionCodes(ProdID).ToArray());
            combindedString += ",  \"resultJSON\": " + returnString + "}"; //Format for datatables js library
            var response = this.Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
            return response;
        }

        public HttpResponseMessage APIAtlasUtilities_Config_Upsert(JSONParameters callParameters)
        {
            JObject Parameters = JObject.Parse(callParameters.callPayload);
            int ConfigID = Convert.ToInt32(Parameters["ConfigID"].ToString());
            string ConfigName = Convert.ToString(Parameters["ConfigName"].ToString());
            string ConfigJSON = Convert.ToString(Parameters["ConfigJSON"].ToString());
            int ProdID = Convert.ToInt32(Parameters["ProdID"].ToString());
            int? UserID = null;
            if (Parameters["UserID"] != null)
            {
                UserID = Convert.ToInt32(Parameters["UserID"].ToString());
            }
            //  String securityhash = Parameters["GUID"].ToString();
            string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();
            AtlasUtilities Utilities = new AtlasUtilities();
            string returnString = JsonConvert.SerializeObject(Utilities.AtlasUtilities_Config_Upsert(ConfigID, ConfigName, ConfigJSON, ProdID, UserID));
            combindedString += ",  \"resultJSON\": " + returnString + "}"; //Format for datatables js library
            var response = this.Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
            return response;
        }

        public APIAtlasUtilities_Config_Result APIAtlasUtilities_Config(JSONParameters callParameters)
        {
            JObject Parameters = JObject.Parse(callParameters.callPayload);
            int ProdID = Convert.ToInt32(Parameters["ProdID"].ToString());
            int? UserID = Convert.ToInt32(Parameters["UserID"].ToString());
            int? ConfigID = (Parameters["ConfigID"] == null) ? null : (int?)Convert.ToInt32(Parameters["ConfigID"].ToString());
            string ConfigName = (Parameters["ConfigName"] == null) ? null : Parameters["ConfigName"].ToString();
            //ConfigName = Convert.ToString(Parameters["ConfigName"].ToString());
            string combindedString = "{ \"callJSON\": " + callParameters.callPayload.ToString();

            AtlasUtilities Utilities = new AtlasUtilities();
            //string returnString = string.Join("", 
            return Utilities.AtlasUtilities_Config_Get(ConfigName, ConfigID, ProdID, UserID);

            //combindedString += ",  \"resultJSON\": " + returnString + "}"; //Format for datatables js library
            //var response = this.Request.CreateResponse(HttpStatusCode.OK);
            //response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
            //return response;
        }

    }

    [Authorize]
    [RoutePrefix("api/Utility")]
    public class UtilityController : ApiController
    {


        [AllowAnonymous]
        [Route("PassDBName")]
        [HttpGet]
        public int PassDBName(string DBName)
        {
            ConnnectionString.GlobalValue = DBName;

            return 0;
        }



    }
}