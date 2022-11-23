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
using Newtonsoft;
//using SendGrid;


using EMS.Controllers;
using System.Configuration;
using System.Web.Http.Results;
using Newtonsoft.Json;

namespace EMS.API
{
    [CustomAuthorize()]
    // [Authorize]
    [RoutePrefix("api/AdminTools")]
    public class AdminToolsController : ApiController
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
        //[AllowAnonymous]
        [Route("AdminAPIToolsProductionList")]
        [HttpGet]
        public List<GetProdcutionListByUserId_Result> AdminAPIToolsProductionList(int UserId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                AdminToolsBusiness BusinessContext = new AdminToolsBusiness();
                return BusinessContext.AdminAPIToolsProductionList(UserId);
            }
            else
            {
                return new List<GetProdcutionListByUserId_Result>();
            }
        }
        //[AllowAnonymous]
        [Route("AdminAPIToolsSegmentList")]
        [HttpGet]
        public List<GetAllSegmentByProdId_Result> AdminAPIToolsSegmentList(int ProdId, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                AdminToolsBusiness BusinessContext = new AdminToolsBusiness();
                return BusinessContext.AdminAPIToolsSegmentList(ProdId, Mode);
            }
            else
            {
                List<GetAllSegmentByProdId_Result> n = new List<GetAllSegmentByProdId_Result>();
                return n;
            }
        }
        //        [AllowAnonymous]
        [Route("AdminAPIToolsLedgerJournal")]
        [HttpPost]
        //        public JsonResult<string> AdminAPIToolsLedgerJournal(string JSONParameters)
        public HttpResponseMessage AdminAPIToolsLedgerJournal(JSONParameters callParameters)
        {
            AdminToolsBusiness BusinessContext = new AdminToolsBusiness();
            //            var result = BusinessContext.AdminAPIToolsLedgerJournal(JSONParameters);
            string combindedString = string.Join("", BusinessContext.AdminAPIToolsLedgerJournal(callParameters).ToArray());
            combindedString = "{  \"dtData\": " + combindedString + "}"; //Format for datatables js library
            var response = this.Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(combindedString, Encoding.UTF8, "application/json");
            return response;

            //            return Newtonsoft.Json.JsonConvert.SerializeObject(combindedString);
            //            return combindedString;
            //var result = JsonConvert.SerializeObject(combindedString);
            //return View( result,"application/json");
            //            return result;
        }
    }

    [CustomAuthorize()]
    // [Authorize]
    [RoutePrefix("api/AdminLogin")]
    public class AdminLoginController : ApiController
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
        [AllowAnonymous]
        [Route("GetUserDetailsAdmin")]
        [HttpGet, HttpPost]
        public List<GetUserDetailsAdmin_Result> GetUserDetailsAdmin(string Email, string Password, string Type)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            var result = BusinessContext.GetUserDetailsAdmin(Email, Password, Type);

            //  Session ["partialProdId"] = result[0].UserID;
            // ConnnectionString.GlobalValue = Convert.ToString(result[0].UserID);
            return result;
        }
        [AllowAnonymous]
        [Route("CheckAuthenticationCode")]
        [HttpGet]
        public List<CheckAuthenticationCode_Result> CheckAuthenticationCode(int UserId, string AuthenticationCode)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.CheckAuthenticationCode(UserId, AuthenticationCode);
        }
        //        [AllowAnonymous]
        [Route("GetProdcutionListByUserId")]
        [HttpGet, HttpPost]
        public List<GetProdcutionListByUserId_Result> GetProdcutionListByUserId(int UserId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
                return BusinessContext.GetProdcutionListByUserId(UserId);
            }
            else
            {
                List<GetProdcutionListByUserId_Result> n = new List<GetProdcutionListByUserId_Result>();
                return n;
            }
        }
        //[AllowAnonymous]
        [Route("GetAllSegmentByProdId")]
        [HttpGet, HttpPost]
        public List<GetAllSegmentByProdId_Result> GetAllSegmentByProdId(int ProdId, int Mode)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
                return BusinessContext.GetAllSegmentByProdId(ProdId, Mode);
            }
            else
            {
                List<GetAllSegmentByProdId_Result> n = new List<GetAllSegmentByProdId_Result>();
                return n;
            }
        }
        //  [AllowAnonymous]
        [Route("SaveSegment")]
        [HttpPost]
        public void SaveSegment(List<Segment> _segment)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
                BusinessContext.SaveSegment(_segment);
            }
            else
            {
                return;
            }
        }
        [AllowAnonymous]
        [Route("CheckEmailVaild")]
        [HttpPost]
        public int CheckEmailVaild(string Email, string Admin)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.CheckEmailVaild(Email, Admin);
        }
        [AllowAnonymous]
        [Route("CheckNewDBName")]
        [HttpPost]
        public int CheckNewDBName(string DBName)
        {
            // if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            //  {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.CheckNewDBName(DBName);
            //  }
            //   else
            //  {
            //    return 0;
            //   }
        }
        [AllowAnonymous]
        [Route("InsertEMSUser")]
        [HttpPost]
        public int InsertEMSUser(AdminUser _AU)
        {
            try
            {
                AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
                int strId = BusinessContext.InsertEMSUser(_AU);

                ///////////////////////////// Send Mail ///////////////////////

                var myMessage = new SendGridMessage();
                //myMessage.From = new MailAddress("emsca.ca@gmail.com");
                //myMessage.From = new MailAddress("notifications@emspayroll.com");
                myMessage.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
                myMessage.AddTo(_AU.Email);
                myMessage.Subject = " registration for EMSCA";
                string url = HttpContext.Current.Request.Url.Authority;
                String msgbody = "<table width=\"600\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"font-family: Arial;\"><tr><td style=\"height: 117px; padding: 5px 28px 0 14px; ";
                msgbody += "background-color: #5a8ec0; border-radius: 10px 10px 0px 0px;\">";
                //Start LOGO
                msgbody += "<a href=\"#\" class=\"appbrand\"><img src=\"https://" + url + "/Content/images/logo.png\" alt=\"logo\" style=\" padding: 10px; background-color: rgb(240, 240, 240); border-radius: 10px; width:30%;\"></a>";
                //End LOGO
                msgbody += "</td></tr><tr><td style=\"border-left: 1px solid #84bd00; border-right: 1px solid #84bd00; border-bottom: 5px solid #84bd00; padding: 16px 17px 0;\"><p><strong style=\"margin-right: 33px;\">Name:</strong>&nbsp;";

                if (_AU.Name == "")
                {
                    msgbody += _AU.Email;
                }
                else
                {
                    msgbody += _AU.Name;
                }
                msgbody += "<br /><strong style=\"margin-right: 15px;\">Email ID:</strong>&nbsp;";
                msgbody += _AU.Email;
                msgbody += "<br /><strong style=\"margin-right: 5px;\">Company:</strong>&nbsp;";
                msgbody += _AU.Name;

                msgbody += "<br /> <br />  </p><p style=\"color: #000000; font-family: arial; font-size: 13px; font-weight:normal; margin: 0; padding: 0;\">You have been added to the following project for EMS ATLAS Accounting:<strong style=\"margin-right: 15px;\">" + _AU.Name + ".</strong>&nbsp;<br/> Getting started is simple: <br />1. Click <a href=\"";
                msgbody += "https://" + url + "/setting/NewPassword?token=" + strId + "";
                msgbody += "\">HERE </a>  to confirm your email <br/> 2. Devise a brilliant password!<br/> ";
                msgbody += "<br /></p>";
                msgbody += "<br /><p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">Thank you,</p>";
                msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">The EMS ATLAS Accounting Team</p>";
                msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; margin:0 !important; padding: 0; line-height: 17px;\">This message was sent from an unmonitored email address. Please do not reply to this message.</p><br />";
                msgbody += " </td></tr><tr>";
                msgbody += " <td style=\"width: 100%; height: 117px; padding: 13px 28px 13px 14px; background-color: #5a8ec0; border-radius: 0px 0px 8px 10px; color: #fff;\">";
                msgbody += "<div style=\"float: left; width: 73%;\"><p style=\"color: #fff; font-size: 14px; font-weight: bold; line-height: 17px; padding: 0 0 16px 0; margin: 0px;\">";
                msgbody += "  <a style=\"font-weight: 700; font-size: 16pt; color: #fff; text-decoration: none;\" href=\"#\"></a>";
                msgbody += "  </p></div></td></tr></table>";

                ////////////////////////////////////////////////////////////
                myMessage.Html = msgbody;
                MailMessage Msg = new MailMessage();
                // Sender e-mail address.
                //Msg.From = new MailAddress("emsca.ca@gmail.com");
                //Msg.From = new MailAddress("notifications@emspayroll.com");
                Msg.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
                // Recipient e-mail address.
                Msg.To.Add(_AU.Email);
                Msg.Subject = "EMSCA Auth Code";
                Msg.Body = msgbody;
                Msg.IsBodyHtml = true;
                // your remote SMTP server IP.
                SmtpClient smtp = new SmtpClient();
                //smtp.Host = "smtp.gmail.com";
                smtp.Host = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
                smtp.UseDefaultCredentials = false;
                smtp.Port = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"]);
                smtp.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["mailuser"], System.Configuration.ConfigurationManager.AppSettings["mailuserpassword"]);
                smtp.EnableSsl = true;
                smtp.Send(Msg);

                ////////////////////////////////////////////////////////////
                //myMessage.Html = msgbody;

                //myMessage.Text = "EMSCA"; // Change Thriii
                //var credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["mailuser"], ConfigurationManager.AppSettings["mailuserpassword"]);

                //// Create an Web transport for sending email.
                //var transportWeb = new Web(credentials);
                //// Send the email.
                //// You can also use the **DeliverAsync** method, which returns an awaitable task.
                //transportWeb.DeliverAsync(myMessage); //open it letter
                //For AZURE hosting sites//*********************************************************************************************

                ///////////////////////////// Send Mail ///////////////////////

                return strId;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        [AllowAnonymous]
        [Route("ProductionNewDBCreate")]
        [HttpPost]
        public List<ProductionNewDBCreate_Result> ProductionNewDBCreate(PrdouctionDBCreate PDBCreate)
        {
            //  if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            //  {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.ProductionNewDBCreate(PDBCreate);
            //   }
            //  else
            //   {
            //      return 0;
            //   }
        }
        [AllowAnonymous]
        [Route("GetUserDetailsPassword")]
        [HttpPost]
        public List<GetUserDetailsPassword_Result> GetUserDetailsPassword(int UserId)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.GetUserDetailsPassword(UserId);
        }
        [AllowAnonymous]
        [Route("UpdatePasswordOfUser")]
        [HttpPost, HttpGet]
        public int UpdatePasswordOfUser(string Password, int UserId)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.UpdatePasswordOfUser(Password, UserId);
        }
        //        [AllowAnonymous]
        [Route("GetDBConfigByProdId")]
        [HttpPost]
        public List<GetDBConfigByProdId_Result> GetDBConfigByProdId(int ProdId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            var result = BusinessContext.GetDBConfigByProdId(ProdId);

            ConnnectionString.GlobalValue = Convert.ToString(result[0].DBName);
            return result;
            }
            else
            {
                List<GetDBConfigByProdId_Result> n = new List<GetDBConfigByProdId_Result>();
                return n;

            }

        }
        //        [AllowAnonymous]
        [Route("InsertUpdateAdminUser")]
        [HttpPost]
        public int InsertUpdateAdminUser(CAUserAdmin _CAUAdmin)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.InsertUpdateAdminUser(_CAUAdmin);
        }
        //        [AllowAnonymous]
        [Route("UpdateAuthCode")]
        [HttpPost]
        public List<UpdateAuthCode_Result> UpdateAuthCode(int UserId, string AuthCode)
        {
            try
            {
                string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
                string numbers = "1234567890";

                string characters = numbers;
                // if (rbType.SelectedItem.Value == "1")
                //  {
                characters += alphabets + small_alphabets + numbers;
                //  }
                int length = 10;
                string otp = string.Empty;
                for (int i = 0; i < length; i++)
                {
                    string character = string.Empty;
                    do
                    {
                        int index = new Random().Next(0, characters.Length);
                        character = characters.ToCharArray()[index].ToString();
                    } while (otp.IndexOf(character) != -1);
                    otp += character;
                }

                AuthCode = otp;
                AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
                var result = BusinessContext.UpdateAuthCode(UserId, AuthCode);
                //===========================================

                //  MailMessage Msg = new MailMessage();
                //// Sender e-mail address.
                //Msg.From = new MailAddress("emsca.ca@gmail.com");
                //// Recipient e-mail address.
                //Msg.To.Add("sanjay@itsabacus.com");
                //Msg.Subject = "faltu";
                //Msg.Body = "ok";
                //// your remote SMTP server IP.
                //SmtpClient smtp = new SmtpClient();
                //smtp.Host = "smtp.gmail.com";
                //smtp.Port = 587;
                //smtp.Credentials = new System.Net.NetworkCredential("emsca.ca@gmail.com", "acs12345");
                //smtp.EnableSsl = true;
                //smtp.Send(Msg);
                //======================================
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                var myMessage = new SendGridMessage();
                //myMessage.From = new MailAddress("emsca.ca@gmail.com");
                myMessage.From = new MailAddress("notifications@emspayroll.com");
                //myMessage.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
                myMessage.AddTo(result[0].Email);
                myMessage.Subject = " Authentication Code for EMSCA Login";
                string url = HttpContext.Current.Request.Url.Authority;

                String msgbody = "<table width=\"600\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"font-family: Arial;\"><tr><td style=\"height: 117px; padding: 5px 28px 0 14px; ";
                msgbody += "background-color: #84bd00; border-radius: 10px 10px 0px 0px;\">";
                //Start LOGO
                msgbody += "<a href=\"#\" class=\"appbrand\"><img src=\"https://" + url + "/Content/images/CAlogo.png\" alt=\"logo\" style=\"padding: 10px; background-color: rgb(240, 240, 240); border-radius: 10px;\"></a>";
                //End LOGO
                msgbody += "</td></tr><tr><td style=\"border-left: 1px solid #84bd00; border-right: 1px solid #84bd00; border-bottom: 5px solid #84bd00; padding: 16px 17px 0;\"><p><strong style=\"margin-right: 33px;\"></strong>&nbsp;";

                msgbody += "<br /><strong style=\"margin-right: 15px;\">Email ID:</strong>&nbsp;";
                msgbody += result[0].Email + "<br/>";
                msgbody += " </td></tr><tr>";
                msgbody += "<strong style=\"margin-right: 15px;\">Authentication Code:</strong>&nbsp;";
                msgbody += "&nbsp;" + result[0].AuthenticationCode;

                msgbody += " <td style=\"width: 100%; height: 117px; padding: 13px 28px 13px 14px; background-color: #84bd00; border-radius: 0px 0px 8px 10px; color: #fff;\">";
                msgbody += "<div style=\"float: left; width: 73%;\"><p style=\"color: #fff; font-size: 14px; font-weight: bold; line-height: 17px; padding: 0 0 16px 0; margin: 0px;\">";
                msgbody += "  <a style=\"font-weight: 700; font-size: 16pt; color: #fff; text-decoration: none;\" href=\"#\"></a>";
                msgbody += "  </p></div></td></tr></table>";

                myMessage.Html = msgbody;

                MailMessage Msg = new MailMessage();
                // Sender e-mail address.
                //Msg.From = new MailAddress("emsca.ca@gmail.com");
                Msg.From = new MailAddress("notifications@emspayroll.com");
                //Msg.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
                // Recipient e-mail address.
                Msg.To.Add(result[0].Email);
                Msg.Subject = "EMSCA Auth Code";
                Msg.Body = msgbody;
                Msg.IsBodyHtml = true;
                // your remote SMTP server IP.
                
                SmtpClient smtp = new SmtpClient();
                //smtp.Host = "smtp.gmail.com";
                smtp.Host = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
                smtp.UseDefaultCredentials = false;
                smtp.Port = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"]);
                smtp.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["mailuser"], System.Configuration.ConfigurationManager.AppSettings["mailuserpassword"]);
                smtp.EnableSsl = true;

                smtp.Send(Msg);

                ///////////////////////////////// Send Mail//////////////////////////////

                //// Send the email
                //SmtpClient client = new SmtpClient();
                //client.Host = "smtp.office365.com";
                //client.Port = 587;
                //client.UseDefaultCredentials = true;
                //client.Credentials = new System.Net.NetworkCredential("notifications@emspayroll.com", "Lightend22!");
                //client.EnableSsl = true;
                //client.ServicePoint.MaxIdleTime = 1;
                //client.Send(Msg);

                ///////////////////////////////// Send Mail End//////////////////////////////


                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        [AllowAnonymous]
        [Route("UpdateAPIKeyToken")]
        [HttpPost]
        public string UpdateAPIKeyToken(int UserId, string Email, string DBName)
        {
            //,string DBName
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";

            string characters = numbers;
            // if (rbType.SelectedItem.Value == "1")
            //  {
            characters += alphabets + small_alphabets + numbers;
            //  }
            int length = 10;
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character = string.Empty;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character) != -1);
                otp += character;
            }

            String authorizationHeader = Email + ":" + otp + ":" + DBName;
            //
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(authorizationHeader);
            UTF8Encoding enc = new UTF8Encoding();
            byte[] b = enc.GetBytes(authorizationHeader);
            string cvtd = Convert.ToBase64String(b);
            sb.AppendLine(cvtd);
            byte[] c = Convert.FromBase64String(cvtd);
            string backAgain = enc.GetString(c);
            sb.AppendLine(backAgain);
            //  var res= BusinessContext.UpdateAPIKeyToken(UserId, otp);

            String KeyToken = Convert.ToBase64String(c, 0, authorizationHeader.Length, Base64FormattingOptions.InsertLineBreaks);
            return KeyToken;
        }
        [AllowAnonymous]
        [Route("ForGetPassword")]
        [HttpPost]
        public int ForGetPassword(string UserId, string Email)
        {
            var myMessage = new SendGridMessage();
            //myMessage.From = new MailAddress("emsca.ca@gmail.com");
            //myMessage.From = new MailAddress("notifications@emspayroll.com");
            myMessage.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
            myMessage.AddTo(Email);
            myMessage.Subject = " registration for EMSCA";
            string url = HttpContext.Current.Request.Url.Authority;

            String msgbody = "<table width=\"600\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"font-family: Arial;\"><tr><td style=\"height: 117px; padding: 5px 28px 0 14px; ";
            msgbody += "background-color: #5a8ec0; border-radius: 10px 10px 0px 0px;\">";
            //Start LOGO
            msgbody += "<a href=\"#\" class=\"appbrand\"><img src=\"https://" + url + "/Content/images/logo.png\" alt=\"logo\" style=\"padding: 10px; background-color: rgb(240, 240, 240); border-radius: 10px;width:30%;\"></a>";
            //End LOGO
            msgbody += "</td></tr><tr><td style=\"border-left: 1px solid #84bd00; border-right: 1px solid #84bd00; border-bottom: 5px solid #84bd00; padding: 16px 17px 0;\"><p><strong style=\"margin-right: 33px;\">Name:</strong>&nbsp;";
            msgbody += Email;

            msgbody += "<br /><strong style=\"margin-right: 15px;\">Email ID:</strong>&nbsp;";
            msgbody += Email;
            msgbody += "<br /><strong style=\"margin-right: 5px;\">Company:</strong>&nbsp;";
            // msgbody += _AU.Name;

            msgbody += "<br /> <br />  </p><p style=\"color: #000000; font-family: arial; font-size: 13px; font-weight:normal; margin: 0; padding: 0;\">Getting started is simple: <br />1. Click <a href=\"";
            msgbody += "https://" + url + "/setting/ForGetPassword?token=" + UserId + "";
            msgbody += "\">HERE </a>  to Set New Password for your email <br/> 2. Devise a brilliant password!<br/> ";

            msgbody += "<br /></p>";

            msgbody += "<br /><p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">Thank you,</p>";
            msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">The EMS ATLAS Accounting Team</p>";
            msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; margin:0 !important; padding: 0; line-height: 17px;\">This message was sent from an unmonitored email address. Please do not reply to this message.</p><br />";
            msgbody += " </td></tr><tr>";
            msgbody += " <td style=\"width: 100%; height: 117px; padding: 13px 28px 13px 14px; background-color: #5a8ec0; border-radius: 0px 0px 8px 10px; color: #fff;\">";
            msgbody += "<div style=\"float: left; width: 73%;\"><p style=\"color: #fff; font-size: 14px; font-weight: bold; line-height: 17px; padding: 0 0 16px 0; margin: 0px;\">";
            msgbody += "  <a style=\"font-weight: 700; font-size: 16pt; color: #fff; text-decoration: none;\" href=\"#\"></a>";
            msgbody += "  </p></div></td></tr></table>";


            /////////////////////////////////////////////////////////////

            myMessage.Html = msgbody;

            MailMessage Msg = new MailMessage();
            // Sender e-mail address.
            //Msg.From = new MailAddress("emsca.ca@gmail.com");
            //Msg.From = new MailAddress("notifications@emspayroll.com");
            Msg.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
            // Recipient e-mail address.
            Msg.To.Add(Email);
            Msg.Subject = "EMSCA Auth Code";
            Msg.Body = msgbody;
            Msg.IsBodyHtml = true;
            // your remote SMTP server IP.
            SmtpClient smtp = new SmtpClient();
            //smtp.Host = "smtp.gmail.com";
            smtp.Host = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
            smtp.UseDefaultCredentials = false;
            smtp.Port = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"]);
            smtp.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["mailuser"], System.Configuration.ConfigurationManager.AppSettings["mailuserpassword"]);
            smtp.EnableSsl = true;
            smtp.Send(Msg);

            return 0;
        }
        //        [AllowAnonymous]
        [Route("SendMailAddUser")]
        [HttpPost]
        public int SendMailAddUser(string Email, int UserId, int ProdId, int CreatedBy, string UserName, string ProName)
        {
            var myMessage = new SendGridMessage();
            //myMessage.From = new MailAddress("emsca.ca@gmail.com");
            //myMessage.From = new MailAddress("notifications@emspayroll.com");
            myMessage.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
            myMessage.AddTo(Email);
            myMessage.Subject = " registration for EMSCA";
            string url = HttpContext.Current.Request.Url.Authority;

            String msgbody = "<table width=\"600\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"font-family: Arial;\"><tr><td style=\"height: 117px; padding: 5px 28px 0 14px; ";
            msgbody += "background-color: #5a8ec0; border-radius: 10px 10px 0px 0px;\">";
            msgbody += "<a href=\"#\" class=\"appbrand\"><img src=\"https://" + url + "/Content/images/logo.png\" alt=\"logo\" style=\"padding: 10px; background-color: rgb(240, 240, 240); border-radius: 10px; width:30%;\"></a>";
            msgbody += "</td></tr><tr><td style=\"border-left: 1px solid #84bd00; border-right: 1px solid #84bd00; border-bottom: 5px solid #84bd00; padding: 16px 17px 0;\"><p><strong style=\"margin-right: 33px;\"></strong>&nbsp;";
            msgbody += "<br /><strong style=\"margin-right: 15px;\">Name:</strong>&nbsp;";
            msgbody += UserName;
            msgbody += "<br /><strong style=\"margin-right: 15px;\">Email ID:</strong>&nbsp;";
            msgbody += Email;
            msgbody += "<br /><strong style=\"margin-right: 5px;\">Company:</strong>&nbsp;";
            msgbody += ProName;
            msgbody += "<br /> <br />  </p><p style=\"color: #000000; font-family: arial; font-size: 13px; font-weight:normal; margin: 0; padding: 0; \">You have been added to the following project for EMS ATLAS Accounting: <strong style=\"margin-right: 15px;\">" + ProName + ".</strong>&nbsp;<br/> Getting started is simple: <br />1. Click <a href=\"";
            msgbody += "https://" + url + "/setting/NewPassword?token=" + UserId + "";
            msgbody += "\">HERE </a>  to confirm your email <br/> 2. Devise a brilliant password!<br/> ";
            msgbody += "<br /></p>";
            msgbody += "<br /><p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">Thank you,</p>";
            msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; font-weight: bold; margin: 0; padding: 0; line-height: 17px;\">The EMS ATLAS Accounting Team</p>";
            msgbody += " <p style=\"color: #626262; font-family: arial; font-size: 13px; margin:0 !important; padding: 0; line-height: 17px;\">This message was sent from an unmonitored email address. Please do not reply to this message.</p><br />";
            msgbody += " </td></tr><tr>";
            msgbody += " <td style=\"width: 100%; height: 117px; padding: 13px 28px 13px 14px; background-color: #5a8ec0; border-radius: 0px 0px 8px 10px; color: #fff;\">";
            msgbody += "<div style=\"float: left; width: 73%;\"><p style=\"color: #fff; font-size: 14px; font-weight: bold; line-height: 17px; padding: 0 0 16px 0; margin: 0px;\">";
            msgbody += "  <a style=\"font-weight: 700; font-size: 16pt; color: #fff; text-decoration: none;\" href=\"#\"></a>";
            msgbody += "  </p></div></td></tr></table>";
            ////////////////////////////////////////////////////////////

            myMessage.Html = msgbody;

            MailMessage Msg = new MailMessage();
            // Sender e-mail address.
            //Msg.From = new MailAddress("emsca.ca@gmail.com");
            //Msg.From = new MailAddress("notifications@emspayroll.com");
            Msg.From = new MailAddress("emsdevenoahdevelopment@gmail.com");
            // Recipient e-mail address.
            Msg.To.Add(Email);
            Msg.Subject = "EMS User Setup";
            Msg.Body = msgbody;
            Msg.IsBodyHtml = true;
            // your remote SMTP server IP.
            SmtpClient smtp = new SmtpClient();
            //smtp.Host = "smtp.gmail.com";
            smtp.Host = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
            smtp.UseDefaultCredentials = false;
            smtp.Port = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"]);
            smtp.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["mailuser"], System.Configuration.ConfigurationManager.AppSettings["mailuserpassword"]);
            smtp.EnableSsl = true;
            smtp.Send(Msg);


            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            var result = BusinessContext.InsertupdateUserProduction(ProdId, UserId, CreatedBy);

            return 0;

        }

        //        [AllowAnonymous]
        [Route("GetSegmentWithLedger")]
        [HttpGet]
        public List<GetSegmentWithLedger_Result> GetSegmentWithLedger(int ProdId)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.GetSegmentWithLedger(ProdId);
        }
        //[AllowAnonymous]
        //[Route("GetSegmentWithLedgerToday")]
        //[HttpGet]
        //public List<GetSegmentWithLedgerToday_Result> GetSegmentWithLedgerToday(int ProdId)
        //{
        //    AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
        //    return BusinessContext.GetSegmentWithLedgerToday(ProdId);
        //}

        // [AllowAnonymous]
        [Route("ProductionCleanUp")]
        [HttpPost]
        public int ProductionCleanUp(int ProdID, string EmailId, int UserId)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
                return BusinessContext.ProductionCleanUp(ProdID, EmailId, UserId);
            }
            else
            {
                return 0;
            }
        }
        //==============CheckExistingUser================//
        //        [AllowAnonymous]
        [Route("CheckUserexistanceCAAdmin")]
        [HttpPost, HttpGet]
        public int CheckUserexistanceCAAdmin(string Email)
        {
            AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
            return BusinessContext.CheckUserexistanceCAAdmin(Email);
        }

        //[Route("GetBatchNumber")]
        //[HttpPost]
        //public string GetBatchNumber(int ProdId, int UserId)
        //{
        //    AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
        //    return BusinessContext.GetBatchNumber(ProdId, UserId);
        //}
        [Route("UpdateBatchNumber")]
        [HttpPost]
        public string UpdateBatchNumber(string BatchNumber, int UserID, int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                AdminLoginBusiness BusinessContext = new AdminLoginBusiness();
                return BusinessContext.UpdateBatchNumber(BatchNumber, UserID, ProdID);
            }
            else
            {
                string BN = "";
                return BN;
            }
        }
    }
}