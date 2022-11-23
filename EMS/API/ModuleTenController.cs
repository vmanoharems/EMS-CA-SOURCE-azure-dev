using EMS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EMS.Business;
using EMS.Controllers;
using System.Web;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using iTextSharp.text.pdf;
using iTextSharp.text;
using Newtonsoft.Json.Linq;

namespace EMS.API
{
    [CustomAuthorize()]
    [RoutePrefix("api/ModuleTen")]
    public class ModuleTenController : ApiController
    {
        _1099ModuleBusiness BusinessContext = new _1099ModuleBusiness();
        AdminToolsBusiness AdminContext = new AdminToolsBusiness();

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


        [Route("GetTaxYear")]
        [HttpPost]
        public List<TaxYears> GetTaxYear(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetTaxYears(ProdID).ToList();
            }
            else
            {
                List<TaxYears> years = new List<TaxYears>();
                return years;
            }

        }

        [Route("GetTaxYearDetails")]
        [HttpPost]
        public List<APVendorsTaxFiling_GET_Result> GetTaxYearDetails(int ProdID)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.VedorTaxDetails(ProdID).ToList();
            }
            else
            {
                List<APVendorsTaxFiling_GET_Result> yeardetails = new List<APVendorsTaxFiling_GET_Result>();
                return yeardetails;
            }
        }

        [Route("GetTransactionDetails")]
        [HttpPost]
        public List<APVendorsTaxFilingTransactionDetails_GET_Result> GetTransactionDetails(TransactionsFilters TransDetails)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.GetTransactionDetails(TransDetails);
            }
            else
            {
                List<APVendorsTaxFilingTransactionDetails_GET_Result> transdetails = new List<APVendorsTaxFilingTransactionDetails_GET_Result>();
                return transdetails;
            }
        }

        [Route("CreateTaxFilling")]
        [HttpPost]
        public List<APVendorsTaxFiling_INIT_Result> CreateTaxFilling(TaxFilling otaxfilling)
        {

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.CreateTaxFilling(otaxfilling);
            }
            else
            {

                List<APVendorsTaxFiling_INIT_Result> taxfilling = new List<APVendorsTaxFiling_INIT_Result>();
                return taxfilling;
            }
        }

        [Route("SaveWorksheet")]
        [HttpPost]
        public List<String> SaveWorksheet(Worksheet oWorksheet)
        {
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                return BusinessContext.SaveWorksheet(oWorksheet);
            }
            else
            {
                List<String> result = new List<String>();
                return result;
            }
        }

        private void MergePDFs(string outPutFilePath, params string[] filesPath)
        {
            List<PdfReader> readerList = new List<PdfReader>();
            foreach (string filePath in filesPath)
            {
                PdfReader pdfReader = new PdfReader(filePath);
                readerList.Add(pdfReader);
            }

            //Define a new output document and its size, type
            Document document = new Document(PageSize.LETTER, 0, 0, 0, 0);
            //Create blank output pdf file and get the stream to write on it.
            PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(outPutFilePath, FileMode.Create));
            document.Open();

            foreach (PdfReader reader in readerList)
            {
                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    PdfImportedPage page = writer.GetImportedPage(reader, i);
                    document.Add(iTextSharp.text.Image.GetInstance(page));
                }
            }

            document.Close();
        }

        [Route("IRSPrintPDF")]
        [HttpPost]
        public string IRSPrintPDF(JSONParameters callParameters)
        {

            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckRun"]["callPayload"])));
            var CompanyDetailsJSON = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["CompanyDetails"]));
            string ProdID = JOrigin["ProdID"];
            string baseuri = "Reports/Module1099PDF/" + ProdID + "/";
            string basepath = "/" + baseuri;

            ////////string host = HttpContext.Current.Request.Url.Host;

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {
                //MUST PRODUCE PDF BECAUSE THE X FOR VOID AND CORRECTED MUST PRINT INSIDE THE MARGIN AND OUTSIDE THE STANDARD PRINT AREA
                try
                {
                    string[] filePaths = Directory.GetFiles((HttpContext.Current.Server.MapPath(basepath)));
                    foreach (string filePath in filePaths)
                        File.Delete(filePath);
                }
                catch
                {
                }
                PDFCreation BusinessContext1 = new PDFCreation();
                string fileSavePath1 = Path.Combine(HttpContext.Current.Server.MapPath(basepath), "");
                string FinalPDFName1 = "Merge" + DateTime.Now;
                string resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                if (File.Exists(resumeFile))
                {
                    resumeFile = @"" + fileSavePath1 + "\\" + FinalPDFName1 + ".PDF";
                }
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~" + basepath), "");
                List<string> termsList = new List<string>();

                string CompanyName = Convert.ToString(CompanyDetailsJSON["CompanyName"]).ToUpper();
                string CompAddress1 = Convert.ToString(CompanyDetailsJSON["CompAddress1"]).ToUpper();
                string CompAddress2 = Convert.ToString(CompanyDetailsJSON["CompAddress2"]).ToUpper();
                string CompAddress3 = Convert.ToString(CompanyDetailsJSON["CompAddress3"]).ToUpper();
                string CompCity = Convert.ToString(CompanyDetailsJSON["CompCity"]).ToUpper();
                string CompState = Convert.ToString(CompanyDetailsJSON["CompState"]).ToUpper();
                string CompCountry = Convert.ToString(CompanyDetailsJSON["CompCountry"]).ToUpper();
                string CompZip = Convert.ToString(CompanyDetailsJSON["CompZip"]);
                string CompanyPhone = Convert.ToString(CompanyDetailsJSON["CompanyPhone"]);
                string CompanyEIN = Convert.ToString(CompanyDetailsJSON["CompanyEIN"]);

                ////////string loc = CompCity + ", " + CompState + " " + CompCountry + " " + CompZip; // + ", " + CompanyPhone;
                string CompAddress = CompAddress1 + ((string.IsNullOrEmpty(CompAddress2)) ? "" : "<br/>" + CompAddress2) + ((string.IsNullOrEmpty(CompAddress3)) ? "" : "<br/>" + CompAddress3);
                string Comploc = CompCity + ", " + CompState + " " + CompZip + ((string.IsNullOrEmpty(CompanyPhone)) ? "" : "<br/>" + CompanyPhone);
                string CompanyDetails = CompanyName + "<br/>" + CompAddress + "<br/>" + Comploc;

                StringBuilder ojbSB = new StringBuilder();
                //ojbSB.Append("<html>");
                //ojbSB.Append("<head><title>1099</title>");
                //ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 20mm; }</style></head>");
                //ojbSB.Append("<body style='margin:0mm'>");
                string topmargin = "0mm";
                Boolean pagebreak = false;
                string voidORcorrected = "";
                string vORcdiv = "68mm"; // 48mm is void placement; 68 = corrected placement;
                bool skip1099 = false;

                for (int i = 0; i <= JOriginCheckRun.Count - 1; i++)
                {
                    skip1099 = false;
                    var TaxCodesJSON = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOriginCheckRun[i]["TaxCodes"]), new JsonSerializerSettings
                    {
                        MissingMemberHandling = MissingMemberHandling.Ignore,
                        NullValueHandling = NullValueHandling.Ignore
                    });
                    ////////ojbSB.Length = 0;
                    #region VendorInfo
                    string VendorId = Convert.ToString(JOriginCheckRun[i]["VendorID"]);
                    string VendorName = Convert.ToString(JOriginCheckRun[i]["VendorName"]).ToUpper();
                    string Address1 = Convert.ToString(JOriginCheckRun[i]["Address1"]).ToUpper();
                    string Address2 = Convert.ToString(JOriginCheckRun[i]["Address2"]).ToUpper();
                    string Address3 = Convert.ToString(JOriginCheckRun[i]["Address3"]).ToUpper();
                    string City = Convert.ToString(JOriginCheckRun[i]["City"]).ToUpper();
                    string State = Convert.ToString(JOriginCheckRun[i]["State"]).ToUpper();
                    string PostalCode = Convert.ToString(JOriginCheckRun[i]["PostalCode"]);
                    string Country = Convert.ToString(JOriginCheckRun[i]["Country"]).ToUpper();
                    string VendorType = Convert.ToString(JOriginCheckRun[i]["VendorType"]).ToUpper();
                    string TIN = Convert.ToString(JOriginCheckRun[i]["TIN"]);
                    string checkvORc = Convert.ToString(JOriginCheckRun[i]["PrintStatus"]).ToUpper();
                    switch (checkvORc)
                    {
                        case "VOID":
                            voidORcorrected = "X";
                            vORcdiv = "48mm";
                            break;
                        case "CORRECTED":
                            voidORcorrected = "X";
                            vORcdiv = "68mm";
                            break;
                        case "1099":
                            voidORcorrected = "";
                            break;
                        case "":
                            skip1099 = true;
                            break;
                    }

                    if (skip1099) continue;
                    #endregion VendorInfo

                    string Address = Address1 + "<br/>" + Address2 + " " + Address3;
                    string Venloc = City + ", " + State + " " + PostalCode;
                    string loc = City + ", " + State + " " + Country + " " + PostalCode; // + ", " + CompanyPhone;

                    // Needed if output is PDF
                    ojbSB.Append("<html>");
                    ojbSB.Append("<head><title>1099</title>");
                    ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 10mm; }</style></head>");
                    ojbSB.Append("<body style='margin:0mm'>");
                    // End PDF specific HTML output

                    ojbSB.Append($"<table border=0 style='margin-left:17.5mm; margin-top:{topmargin}; margin-bottom:7.5mm; margin-left:8mm; width: 185mm; font-size:12px !important; font-family: Courier, Arial, Helvetica , sans-serif !important; border-spacing:0 !important; '>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td style='height:6mm;' colspan='5'><div style='padding-left:{vORcdiv}; vertical-align:middle;'>{voidORcorrected}</div></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td colspan='2' rowspan='3' style='width:86mm; !important; height:34mm; vertical-align:top; padding-top:6mm; padding-left:10em;'>{CompanyDetails}</td>");
                    ojbSB.Append($"<td style='width:35mm; !important; height:12mm; vertical-align:-15em; padding-left:5mm;'>{$"{(TaxCodesJSON["01"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("<td colspan='2' rowspan='2' style='vertical-align:bottom; height:25mm; width:63mm;'> ");
                    //////ojbSB.Append("<table style='width: 100%; border-spacing:0;'>"); I DON'T THINK THIS IS NEEDED JT
                    //////ojbSB.Append("<tr>");
                    //////ojbSB.Append("<td style='width: 38mm; height: 24mm; vertical-align:bottom;'></td>");
                    //////ojbSB.Append("<td style='width: 38mm; height: 24mm; vertical-align:bottom;'></td>");
                    //////ojbSB.Append("</tr>");
                    //////ojbSB.Append("</table>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td style='width:35mm;height:13mm; vertical-align:bottom; padding-left:5mm; padding-bottom:1mm;'>{$"{(TaxCodesJSON["02"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td style='width:35mm; height:8mm; vertical-align:-5em; padding-left:5mm;'>{$"{(TaxCodesJSON["03"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("<td style='width:35mm; !important; height:8mm; vertical-align:bottom;'><!--federal withheld--> </td>");
                    ojbSB.Append("<td rowspan='2' style='width: 28mm; height: 25mm; vertical-align:bottom; padding-left:7mm;'> </td>");
                    ojbSB.Append("</tr>");
                    #region TaxIDs
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td style='width: 43mm; height: 17mm; vertical-align:middle; padding-left:3mm;'>{CompanyEIN}</td>");
                    ojbSB.Append($"<td style='width: 43mm; height: 17mm; vertical-align:middle; padding-left:3mm;'>{TIN}</td>");
                    ojbSB.Append($"<td style='width: 35mm; height: 17mm; vertical-align:bottom; padding-left:7mm;'>{$"{(TaxCodesJSON["05"] ?? ""):0.00}"}</td>");
                    ojbSB.Append($"<td style='width: 35mm; height: 17mm; vertical-align:bottom; padding-left:7mm;'>{$"{(TaxCodesJSON["06"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("</tr>");
                    #endregion TaxIDs
                    #region Vendor Data
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width: 86mm; height: 13mm; vertical-align:bottom; padding-bottom:1mm; padding-left:10em;' colspan='2'>" + VendorName + "</td>");
                    //ojbSB.Append("</tr>");
                    // Works so far KINDA
                    ojbSB.Append("<td style='width: 86mm; ' colspan='2' rowspan='3'>");
                    ojbSB.Append("  <table border=0 style='width: 90%; border-spacing:0; font-size:12px; font-family:Courier;'>");
                    ojbSB.Append("  <tr>");
                    ojbSB.Append($" <td style='width: 35.5mm; height: 17mm; vertical-align:-20em; padding-left:5mm;'>{$"{(TaxCodesJSON["07"] ?? ""):0.00}"}</td>");
                    ojbSB.Append($" <td style='width: 35.5mm; height: 17mm; vertical-align:bottom; padding-left:7mm;'>{$"{(TaxCodesJSON["08"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("  </tr>");
                    ojbSB.Append("  <tr>");
                    ojbSB.Append("  <td style='width: 35.5mm; height: 12.5mm; vertical-align:bottom; '></td>");
                    ojbSB.Append($" <td style='width: 35.5mm; height: 12.5mm; vertical-align:bottom;  padding-left:7mm;'>{$"{(TaxCodesJSON["10"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("  </tr>");
                    ojbSB.Append("  <tr>");
                    ojbSB.Append($" <td style='width: 35.5mm; height: 8mm; vertical-align:bottom;  padding-left:7mm;'>{$"{(TaxCodesJSON["11"] ?? ""):0.00}"}</td>");
                    ojbSB.Append($" <td style='width: 35.5mm; height: 8mm; vertical-align:bottom;  padding-left:7mm;'>{$"{(TaxCodesJSON["12"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("  </tr>");
                    ojbSB.Append("  </table>");
                    ojbSB.Append("</td>");
                    ojbSB.Append("<td style='width: 28mm; height: 51mm; vertical-align:bottom;' rowspan='4'></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td colspan='2' style='width: 86mm; height: 13mm; vertical-align:bottom; padding-bottom:1mm; padding-left:10em;'>{Address.TrimEnd(',')}</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td colspan='2' style='width: 86mm; height: 13mm; vertical-align:bottom; padding-bottom:1mm; padding-left:10em;'>{loc.TrimEnd(',')}</td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td colspan='2' style='width: 86mm; height: 13mm;'>");
                    ojbSB.Append("  <table border=0 style='width: 90%; border-spacing:0;'>");
                    ojbSB.Append("  <tr>");
                    ojbSB.Append("  <td style='width:55mm; height:12mm; vertical-align:bottom; '></td>");
                    ojbSB.Append("  <td style='width:15mm; height:12mm; vertical-align:bottom; '></td>");
                    ojbSB.Append("  <td style='width:13mm; height:12mm; vertical-align:bottom; '></td>");
                    ojbSB.Append("  </tr>");
                    ojbSB.Append("  </table>");
                    ojbSB.Append("</td>");
                    ojbSB.Append($"<td style='width: 35.5mm; height: 13mm; vertical-align:bottom;  padding-left:7mm;'>{$"{(TaxCodesJSON["13"] ?? ""):0.00}"}</td>");
                    ojbSB.Append($"<td style='width: 35.5mm; height: 13mm; vertical-align:bottom;  padding-left:7mm;'>{$"{(TaxCodesJSON["14"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("</tr>");
                    #endregion Vendor Data
                    ojbSB.Append("<tr>");
                    ojbSB.Append($"<td style='width:43mm; height:13mm; vertical-align:bottom;  padding-left:7mm;' rowspan='2'>{$"{(TaxCodesJSON["15a"] ?? ""):0.00}"}</td>");
                    ojbSB.Append($"<td style='width:43mm; height:13mm; vertical-align:bottom;  padding-left:7mm;' rowspan='2'>{$"{(TaxCodesJSON["15b"] ?? ""):0.00}"}</td>");
                    ojbSB.Append("<td style='width:35mm; height:8mm; vertical-align:bottom;  padding-left:7mm;'><!--state withheld--></td>");
                    ojbSB.Append("<td style='width:35mm; height:8mm; vertical-align:bottom;  padding-left:7mm;'><!--Work State--></td>");
                    ojbSB.Append("<td style='width:28mm; height:8mm; vertical-align:bottom;  padding-left:7mm;'><!--State Income--></td>");
                    ojbSB.Append("</tr>");
                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='width:35mm; height:4mm; vertical-align:bottom; '></td>");
                    ojbSB.Append("<td style='width:35mm; height:4mm; vertical-align:bottom; '></td>");
                    ojbSB.Append("<td style='width:28mm; height:4mm; vertical-align:bottom; '></td>");
                    ojbSB.Append("</tr>");
                    if (1 == 2)
                    {
                    }
                    ojbSB.Append("</table>");

                    if (pagebreak || i == (JOriginCheckRun.Count - 1))
                    {
                        string NewPDF = ojbSB.ToString();
                        string TimeStampp = Convert.ToString(DateTime.Now.ToLongTimeString());
                        string filename = "1099_" + DateTime.Now.ToString("yyyyMMddHHmmss") + Guid.NewGuid().ToString();
                        BusinessContext1.GeneratePDF1099(basepath, filename, "", NewPDF.Replace("&", "&#38;"));
                        termsList.Add(fileSavePath + "\\" + filename + ".PDF");
                        ojbSB.Append("<div class='pagebreak'> </div>"); // if output is HTML, this does the page breaking
                        ojbSB.Length = 0; // If this is a PDF, we need to reset everything for a new page
                    }
                    else
                    {
                        ojbSB.Append("<div class='gap'> </div>");
                    }
                    pagebreak = !pagebreak;
                }
                // needed if output is HTML. Not needed if output is PDF
                //ojbSB.Append("</body>");
                //ojbSB.Append("</html>");

                string[] terms = termsList.ToArray();
                string FinalPDFName = "1099_" + DateTime.Now.ToString("yyyyMMddHHmmss") + Guid.NewGuid().ToString();
                MergePDFs(@"" + fileSavePath + "\\" + FinalPDFName + ".PDF", terms);


                //string json = "{\"reportdata\":\""
                //     + ojbSB.ToString()
                //     + "}";
                //string jsonReturn = JsonConvert.SerializeObject(ojbSB);
                //return jsonReturn.ToString();
                string path = baseuri + FinalPDFName + ".pdf";
                return path;
            }
            else
            {
                return "";
            }
        }

        [Route("PrintSetupReport")]
        [HttpPost]
        public string PrintSetupReport(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckRun"]["callPayload"])));
            var CompanyDetailsJSON = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ComapanyItems"]));

            StringBuilder ojbSB = new StringBuilder();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                int CompanyID = Convert.ToInt32(CompanyDetailsJSON["Company"]);
                string CompanyName = Convert.ToString(CompanyDetailsJSON["CompanyName"]);
                string TaxYear = Convert.ToString(CompanyDetailsJSON["TaxYear"]).ToUpper();
                string WorkState = Convert.ToString(CompanyDetailsJSON["WorkState"]).ToUpper();
                string Payment = Convert.ToString(CompanyDetailsJSON["Payment"]).ToUpper();
                string Amount = Convert.ToString(CompanyDetailsJSON["Amount"]).ToUpper();
                string Invoice = Convert.ToString(CompanyDetailsJSON["Invoice"]).ToUpper();
                string VendorTotal = Convert.ToString(CompanyDetailsJSON["VendorTotal"]).ToUpper();
                string PaymentDate = Convert.ToString(CompanyDetailsJSON["PaymentDate"]).ToUpper();
                string Account = Convert.ToString(CompanyDetailsJSON["Account"]).ToUpper();
                string Taxcode = "ALL";


                if (Convert.ToString(CompanyDetailsJSON["Taxcode"]) != "")
                {
                    Taxcode = Convert.ToString(CompanyDetailsJSON["Taxcode"]).ToUpper();
                }

                string Source = "ALL";

                if (Convert.ToString(CompanyDetailsJSON["Source"]) != "")
                {
                    Source = Convert.ToString(CompanyDetailsJSON["Source"]).ToUpper();
                }



                int ProdID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ProdId"])));
                int UserId = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["UserId"])));

                string ReportDate = DateTime.Now.ToShortDateString();

                var databaseItems = AdminContext.AdminAPIToolsProductionList(UserId);
                var currentDB = databaseItems.Where(i => i.ProductionId == ProdID).FirstOrDefault();

                ojbSB.Append("<html>");
                ojbSB.Append("<head><title>1099</title>");
                ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 10mm; }</style></head>");
                ojbSB.Append("<body style='margin:0mm'>");
                ojbSB.Append(" <table style='width: 10.5in; border-spacing:0; font-size: 12px; font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr><td colspan='7' >&nbsp;</td></tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Company:</td>");
                ojbSB.Append("<td style='width: 337px;' name='company'>" + CompanyID + "</td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong><span><strong>" + currentDB.Name.ToUpper() + "</strong></span></strong> </td>");
                ojbSB.Append(" <td style='text-align: right;width: 352px;'>Vendor Type:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;ALL</td>");
                ojbSB.Append(" <td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Tax Year:</td>");
                ojbSB.Append("<td  name='taxyear'>" + TaxYear + "</td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong><span><strong>" + CompanyName.ToString().ToUpper() + "</strong></span></strong> </td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Account:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;" + Account + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td class='auto-style1' ></td>");
                ojbSB.Append("<td class='auto-style2' >Vendors:</td>");
                ojbSB.Append("<td class='auto-style3' >" + VendorTotal + "</td>");
                ojbSB.Append("<td style='text-align: center; font-size: 14px;'></td>");
                ojbSB.Append("<td style='text-align: right;'>Vendor Name:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;ALL</td>");
                ojbSB.Append("<td style='text-align: left;'></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Payment Date:</td>");
                ojbSB.Append("<td  >" + PaymentDate + "</td>");
                ojbSB.Append("<td >&nbsp;</td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Payment #: </td>");
                ojbSB.Append("<td style='text-align: left;' name='payment'>&nbsp;&nbsp;" + Payment + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Source: </td>");
                ojbSB.Append("<td  >" + Source + "</td>");
                ojbSB.Append("<td >&nbsp;</td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Amount:</td>");
                ojbSB.Append("<td style='text-align: left;' name='amount'>&nbsp;&nbsp;" + Amount + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Tax Code:</td>");
                ojbSB.Append("<td  name='taxcode'>" + Taxcode + "</td>");
                ojbSB.Append("<td style='text-align: center;'></td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Invoice:</td>");
                ojbSB.Append("<td style='text-align: left;' name='invoice'>&nbsp;&nbsp;" + Invoice + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Work State: </td>");
                ojbSB.Append("<td  name='workstate'>" + WorkState + "</td>");
                ojbSB.Append("<td style='text-align: center;'><strong>1099 VENDOR SETUP REPORT </strong></td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Report Date:</td>");
                ojbSB.Append("<td style='text-align: left;' name='reportdate'>&nbsp;&nbsp;" + ReportDate + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                //ojbSB.Append("<tr>");
                //ojbSB.Append(" <td style='font - size: x - small;' colspan='7'>&nbsp;</td>");
                //ojbSB.Append("</tr>");
                //ojbSB.Append("<tr>");
                //ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                //ojbSB.Append("<td colspan='5'></td>");
                //ojbSB.Append("<td>&nbsp;</td>");
                //ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                ojbSB.Append("<td colspan='5'><table style='width:100%; border-spacing:0;font-size: 10px;  font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr style='font-weight:bold;background-color: #A4DEF9;'>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>Vendor Name/dba Name</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>Street Address</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>City</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>State</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>Zip Code</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>Telephone Number</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>Vendor Type</td>");
                ojbSB.Append(" <td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;'>Tax I.D. Number</td>");
                ojbSB.Append("</tr>");
                //ojbSB.Append("<tr><td colspan='8'>&nbsp;</td></tr>");
                for (int i = 0; i <= JOriginCheckRun.Count - 1; i++)
                {

                    string VendorId = Convert.ToString(JOriginCheckRun[i]["VendorID"]);
                    string VendorName = Convert.ToString(JOriginCheckRun[i]["VendorName"]).ToUpper();
                    string Address1 = Convert.ToString(JOriginCheckRun[i]["Address1"]).ToUpper();
                    string Address2 = Convert.ToString(JOriginCheckRun[i]["Address2"]).ToUpper();
                    string Address3 = Convert.ToString(JOriginCheckRun[i]["Address3"]).ToUpper();
                    string City = Convert.ToString(JOriginCheckRun[i]["City"]).ToUpper();
                    string State = Convert.ToString(JOriginCheckRun[i]["State"]).ToUpper();
                    string PostalCode = Convert.ToString(JOriginCheckRun[i]["PostalCode"]);
                    string Country = Convert.ToString(JOriginCheckRun[i]["Country"]).ToUpper();
                    string VendorType = Convert.ToString(JOriginCheckRun[i]["VendorType"]).ToUpper();
                    string Taxid = Convert.ToString(JOriginCheckRun[i]["TIN"]);
                    string Phone = "";
                    if (Convert.ToString(JOriginCheckRun[i]["Phone"]) != "null")
                    {
                        Phone = Convert.ToString(JOriginCheckRun[i]["Phone"]);
                    }

                    string Address = Address1 + " " + Address2 + ", " + Address3;

                    Address = Address.Trim().TrimEnd(',');

                    ojbSB.Append("<tr>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='vendorname'>" + VendorName + "</td>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='streetaddress'>" + Address + "</td>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='city'>" + City + "</td>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='state'>" + State + "</td>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='zip'>" + PostalCode + "</td>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='tel'>" + Phone + "</td>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='type'>" + VendorType + "</td>");
                    ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;' name='taxid'>" + Taxid + "</td>");
                    ojbSB.Append("</tr>");

                }
                ojbSB.Append(" </table></td><td></td></tr>");
                ojbSB.Append("</table></body></html>");


            }

            string json = "{\"reportdata\":\""
                 + ojbSB.ToString()
                 + "}";
            string jsonReturn = JsonConvert.SerializeObject(ojbSB);
            return jsonReturn.ToString();

        }

        [Route("PrintWorkSheet")]
        [HttpPost]
        public string PrintWorkSheet(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckRun"]["callPayload"])));
            var CompanyDetailsJSON = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ComapanyItems"]));

            StringBuilder ojbSB = new StringBuilder();
            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {

                string Company = Convert.ToString(CompanyDetailsJSON["Company"]).ToUpper();
                string CompanyName = Convert.ToString(CompanyDetailsJSON["CompanyName"]);
                string TaxYear = Convert.ToString(CompanyDetailsJSON["TaxYear"]).ToUpper();
                string WorkState = Convert.ToString(CompanyDetailsJSON["WorkState"]).ToUpper();
                string Payment = Convert.ToString(CompanyDetailsJSON["Payment"]).ToUpper();
                string Amount = Convert.ToString(CompanyDetailsJSON["Amount"]).ToUpper();
                string Invoice = Convert.ToString(CompanyDetailsJSON["Invoice"]).ToUpper();
                string VendorTotal = Convert.ToString(CompanyDetailsJSON["VendorTotal"]).ToUpper();
                string PaymentDate = Convert.ToString(CompanyDetailsJSON["PaymentDate"]).ToUpper();
                string Account = Convert.ToString(CompanyDetailsJSON["Account"]).ToUpper();
                string Total = Convert.ToString(CompanyDetailsJSON["WorkSheetTotal"]).ToUpper();
                string Taxcode = "ALL";


                if (Convert.ToString(CompanyDetailsJSON["Taxcode"]) != "")
                {
                    Taxcode = Convert.ToString(CompanyDetailsJSON["Taxcode"]).ToUpper();
                }

                string Source = "ALL";

                if (Convert.ToString(CompanyDetailsJSON["Source"]) != "")
                {
                    Source = Convert.ToString(CompanyDetailsJSON["Source"]).ToUpper();
                }

                int ProdID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ProdId"])));
                int UserId = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["UserId"])));

                string ReportDate = DateTime.Now.ToShortDateString();

                var databaseItems = AdminContext.AdminAPIToolsProductionList(UserId);
                var currentDB = databaseItems.Where(i => i.ProductionId == ProdID).FirstOrDefault();

                ojbSB.Append("<html>");
                ojbSB.Append("<head><title>1099 WorkSheet</title>");
                ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 10mm; }</style></head>");
                ojbSB.Append("<body style='margin:0mm'>");
                ojbSB.Append(" <table style='width: 10.5in; border-spacing:0; font-size: 12px; font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr><td colspan='7' >&nbsp;</td></tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Company:</td>");
                ojbSB.Append("<td style='width: 337px;' name='company'>" + Company + "</td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong><span><strong>" + currentDB.Name.ToUpper() + "</strong></span></strong> </td>");
                ojbSB.Append("<td style='text-align: right;width: 352px;'>Vendor Type:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;ALL</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Tax Year:</td>");
                ojbSB.Append("<td  name='taxyear'>" + TaxYear + "</td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong><span><strong>" + CompanyName.ToUpper() + "</strong></span></strong> </td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Account:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;" + Account + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td class='auto-style1' ></td>");
                ojbSB.Append("<td class='auto-style2' >Vendors:</td>");
                ojbSB.Append("<td class='auto-style3' >" + VendorTotal + "</td>");
                ojbSB.Append("<td style='text-align: center; font-size: 14px;'></td>");
                ojbSB.Append("<td style='text-align: right;'>Vendor Name:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;ALL</td>");
                ojbSB.Append("<td style='text-align: left;'></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Payment Date:</td>");
                ojbSB.Append("<td  >" + PaymentDate + "</td>");
                ojbSB.Append("<td >&nbsp;</td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Payment #: </td>");
                ojbSB.Append("<td style='text-align: left;' name='payment'>&nbsp;&nbsp;" + Payment + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Source: </td>");
                ojbSB.Append("<td  >" + Source + "</td>");
                ojbSB.Append("<td >&nbsp;</td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Amount:</td>");
                ojbSB.Append("<td style='text-align: left;' name='amount'>&nbsp;&nbsp;" + Amount + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Tax Code:</td>");
                ojbSB.Append("<td  name='taxcode'>" + Taxcode + "</td>");
                ojbSB.Append("<td style='text-align: center;'></td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Invoice:</td>");
                ojbSB.Append("<td style='text-align: left;' name='invoice'>&nbsp;&nbsp;" + Invoice + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Work State: </td>");
                ojbSB.Append("<td  name='workstate'>" + WorkState + "</td>");
                ojbSB.Append("<td style='text-align: center;'><strong>1099 WORKSHEET REPORT</strong></td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Report Date:</td>");
                ojbSB.Append("<td style='text-align: left;' name='reportdate'>&nbsp;&nbsp;" + ReportDate + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                //ojbSB.Append("<tr>");
                //ojbSB.Append(" <td style='font - size: x - small;' colspan='7'>&nbsp;</td>");
                //ojbSB.Append("</tr>");
                //ojbSB.Append("<tr>");
                //ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                //ojbSB.Append("<td colspan='5'></td>");
                //ojbSB.Append("<td>&nbsp;</td>");
                //ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                ojbSB.Append("<td colspan='5'><table style='width: 10.5in; border-spacing:0;font-size: 10px;  font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr style='font-weight:bold;background-color: #A4DEF9;'>");
                ojbSB.Append("<td style='border-bottom-style:solid;border-bottom-width:thin;border-bottom-color: #000000;text-align: left;width:200px;'>Vendor Name/dba Name</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:300px;'>W-9 Address</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:200px;'>Vendor Type</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:100px;'>TIN</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:100px;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<td colspan='5'>");
                ojbSB.Append("<table style='width: 10.5in; border-spacing:0;font-size: 10px;  font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr style='font-weight:bold;background-color: #A4DEF9;'>");
                ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px;'>Date</td>");
                ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px;'>Payment # </td>");
                ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px;'>Invoice # </td>");
                ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px;'>Source </td>");
                ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px;'>Account </td>");
                ojbSB.Append("<td style='text-align: left; border-bottom: solid 1px;'>Description </td>");
                ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px;'>Tax Year </td>");
                ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px;'>Work State</td>");
                ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px;'>Tax Code </td>");
                ojbSB.Append("<td style='text-align: right;width: 70px; border-bottom: solid 1px;'>Amount </td>");
                ojbSB.Append("</tr>");

                //ojbSB.Append("<tr class='clsbreak'><td colspan='10' style='height:20px'></td></tr>");

                int vendorcount = 0, transactioncount = 0;


                for (int i = 0; i <= JOriginCheckRun.Count - 1; i++)
                {
                    List<string> workstate = new List<string>();
                    string VendorId = Convert.ToString(JOriginCheckRun[i]["VendorID"]);
                    string VendorName = Convert.ToString(JOriginCheckRun[i]["VendorName"]).ToUpper();
                    string Address1 = Convert.ToString(JOriginCheckRun[i]["Address1"]).ToUpper();
                    string Address2 = Convert.ToString(JOriginCheckRun[i]["Address2"]).ToUpper();
                    string Address3 = Convert.ToString(JOriginCheckRun[i]["Address3"]).ToUpper();
                    string City = Convert.ToString(JOriginCheckRun[i]["City"]).ToUpper();
                    string State = Convert.ToString(JOriginCheckRun[i]["State"]).ToUpper();
                    string PostalCode = Convert.ToString(JOriginCheckRun[i]["PostalCode"]);
                    string Country = Convert.ToString(JOriginCheckRun[i]["Country"]).ToUpper();
                    string VendorType = Convert.ToString(JOriginCheckRun[i]["VendorType"]).ToUpper();
                    string Taxid = Convert.ToString(JOriginCheckRun[i]["TIN"]);
                    string SubTotal = Convert.ToString(JOriginCheckRun[i]["Total"]);
                    var Transactions = JOriginCheckRun[i]["Transactions"];

                    string Phone = "";
                    if (Convert.ToString(JOriginCheckRun[i]["Phone"]) != "null")
                    {
                        Phone = Convert.ToString(JOriginCheckRun[i]["Phone"]);
                    }

                    string Address = "";

                    if (Address1 != "") { Address += Address1 + ", "; }
                    if (Address2 != "") { Address += Address2 + ", "; }
                    if (Address3 != "") { Address += Address3 + ", "; }
                    if (City != "") { Address += City + ", "; }
                    if (State != "") { Address += State + " "; }
                    if (PostalCode != "") { Address += PostalCode + " "; }


                    Address = Address.Trim().TrimEnd(',');

                    ojbSB.Append("<tr class='clsvendordtl'>");
                    ojbSB.Append("<td style='height: 20px;' colspan='10'>");
                    ojbSB.Append("<table style='width: 10.5in; border-spacing:0;font-size: 10px;  font-family: Arial, Helvetica, sans-serif;'>");
                    ojbSB.Append("<tr style='font-weight:bold;'>");
                    ojbSB.Append("<td style='width:200px;text-align: left;' class='vendorname'>" + VendorName + "</td>");
                    ojbSB.Append("<td style='width:300px;text-align: left;'  class='address'>" + Address + "</td>");
                    ojbSB.Append("<td style='width:200px;text-align: left;'  class='vendortype'>" + VendorType + "</td>");
                    ojbSB.Append("<td style='width:100px;text-align: left;font-weight:bold;'  class='tin'>" + Taxid + "</td>");
                    ojbSB.Append("<td style='width:100px;'>&nbsp;</td>");
                    ojbSB.Append("</tr></table></td></tr>");

                    for (int j = 0; j <= Transactions.Count - 1; j++)
                    {

                        string Date = Convert.ToString(Transactions[j]["Date"]);
                        string iPayment = Convert.ToString(Transactions[j]["Payment"]);
                        string sInvoice = Convert.ToString(Transactions[j]["Invoice"]);
                        string sSource = Convert.ToString(Transactions[j]["Source"]);
                        string sTaxYear = Convert.ToString(Transactions[j]["TaxYear"]);
                        string sWorkState = Convert.ToString(Transactions[j]["WorkState"]);
                        string sAccount = Convert.ToString(Transactions[j]["Account"]);
                        string Description = Convert.ToString(Transactions[j]["Description"]);
                        string tc = Convert.ToString(Transactions[j]["TaxCode"]);
                        string iAmount = Convert.ToString(Transactions[j]["Amount"]);

                        ojbSB.Append("<tr class='clstransactions' style=''>");
                        ojbSB.Append("<td style='text-align:left;'  class='date'>" + Date + "</td>");
                        ojbSB.Append("<td style='text-align:left;'  class='payment'>" + iPayment + "</td>");
                        ojbSB.Append("<td style='text-align:left;'  class='invoice'>" + sInvoice + "</td>");
                        ojbSB.Append("<td style='text-align:left;'  class='source'>" + sSource + "</td>");
                        ojbSB.Append("<td style='text-align:left;'  class='account'>" + sAccount + "</td>");
                        ojbSB.Append("<td style='text-align:left;'  class='description'>" + Description + "</td>");
                        ojbSB.Append("<td style='text-align:center;'  class='taxyear'>" + sTaxYear + "</td>");
                        ojbSB.Append("<td style='text-align:center;'  class='workstate'>" + sWorkState + "</td>");
                        ojbSB.Append("<td style='text-align:center;width:50px;width: 60px;'  class='taxcode'>" + tc + "</td>");
                        ojbSB.Append("<td style='text-align:right;'><span style='float:left;text-align:left;'class='amount'>$</span>" + Convert.ToDecimal(iAmount).ToString("#,##0.00") + "</td>");
                        ojbSB.Append("</tr>");

                        if (!workstate.Contains(sWorkState, StringComparer.OrdinalIgnoreCase))
                        {
                            workstate.Add(sWorkState);
                        }


                    }



                    ojbSB.Append("<tr class='clssubtotal' style=''>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td style='text-align:right;border-top: solid 1px;'  class='subtotal'><span style='float:left;text-align:left;'>$</span>" + Convert.ToDecimal(SubTotal).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clsbreak'><td colspan='10' style='height:20px'></td></tr>");

                    vendorcount++;

                    transactioncount = transactioncount + workstate.Count;
                }



                ojbSB.Append("<tr class='clstotal' style=''>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;font-weight:bold;' >Total Amount:</td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append(" <td style='text-align:right;border-top: solid 1px;font-weight:bold;' class='total'><span style='float:left;text-align:left;'>$</span>" + Convert.ToDecimal(Total).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr class='clscount' style=''>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;font-weight:bold;' >Vendor Count: </td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;border-top: solid 1px;font-weight:bold;'  class='total'><span style='float:left;text-align:left;'></span>" + vendorcount + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr class='clscount' style=''>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;font-weight:bold;' >Form Count: </td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;font-weight:bold;'  class='total'><span style='float:left;text-align:left;'></span>" + transactioncount + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr class='clstotal' style=''>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;font-weight:bold;' >Dollar Total:</td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append(" <td style='text-align:right;font-weight:bold;' class='total'><span style='float:left;text-align:left;'>$</span>" + Convert.ToDecimal(Total).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");



                ojbSB.Append("<tr class='clsbreak'><td colspan='10' style='height:20px'></td></tr>");
                ojbSB.Append("</table>");
                ojbSB.Append("</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</table>");
                ojbSB.Append("</td><td></td><td></td>");
                ojbSB.Append("</table>");


            }

            string json = "{\"reportdata\":\""
                 + ojbSB.ToString()
                 + "}";
            string jsonReturn = JsonConvert.SerializeObject(ojbSB);
            return jsonReturn.ToString();

        }

        [Route("PrintWorkSheetSummary")]
        [HttpPost]
        public string PrintWorkSheetSummary(JSONParameters callParameters)
        {
            var JOrigin = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(callParameters.callPayload));
            var JOriginCheckRun = JsonConvert.DeserializeObject<dynamic>(Convert.ToString((JOrigin["CheckRun"]["callPayload"])));
            var CompanyDetailsJSON = JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ComapanyItems"]));

            StringBuilder ojbSB = new StringBuilder();

            int count = 0;

            if (this.Execute(this.CurrentUser.APITOKEN) == 0)
            {


                string Company = Convert.ToString(CompanyDetailsJSON["Company"]).ToUpper();
                string CompanyName = Convert.ToString(CompanyDetailsJSON["CompanyName"]);
                string TaxYear = Convert.ToString(CompanyDetailsJSON["TaxYear"]).ToUpper();
                string WorkState = Convert.ToString(CompanyDetailsJSON["WorkState"]).ToUpper();
                string Payment = Convert.ToString(CompanyDetailsJSON["Payment"]).ToUpper();
                string Amount = Convert.ToString(CompanyDetailsJSON["Amount"]).ToUpper();
                string Invoice = Convert.ToString(CompanyDetailsJSON["Invoice"]).ToUpper();
                string VendorTotal = Convert.ToString(CompanyDetailsJSON["VendorTotal"]).ToUpper();
                string PaymentDate = Convert.ToString(CompanyDetailsJSON["PaymentDate"]).ToUpper();
                string Account = Convert.ToString(CompanyDetailsJSON["Account"]).ToUpper();
                string Total = Convert.ToString(CompanyDetailsJSON["WorkSheetTotal"]).ToUpper();
                string Taxcode = "ALL";


                if (Convert.ToString(CompanyDetailsJSON["Taxcode"]) != "")
                {
                    Taxcode = Convert.ToString(CompanyDetailsJSON["Taxcode"]).ToUpper();
                }

                string Source = "ALL";

                if (Convert.ToString(CompanyDetailsJSON["Source"]) != "")
                {
                    Source = Convert.ToString(CompanyDetailsJSON["Source"]).ToUpper();
                }

                int ProdID = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["ProdId"])));
                int UserId = Convert.ToInt32(JsonConvert.DeserializeObject<dynamic>(Convert.ToString(JOrigin["UserId"])));

                string ReportDate = DateTime.Now.ToShortDateString();

                var databaseItems = AdminContext.AdminAPIToolsProductionList(UserId);
                var currentDB = databaseItems.Where(i => i.ProductionId == ProdID).FirstOrDefault();

                ojbSB.Append("<html>");
                ojbSB.Append("<head><title>1099 WorkSheet</title>");
                ojbSB.Append("<style>.pagebreak { page-break-before: always; } .gap { height: 10mm; }</style></head>");
                ojbSB.Append("<body style='margin:0mm'>");
                ojbSB.Append(" <table style='width: 10.5in; border-spacing:0; font-size: 12px; font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr><td colspan='7' >&nbsp;</td></tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Company:</td>");
                ojbSB.Append("<td style='width: 337px;' name='company'>" + Company + "</td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong><span><strong>" + currentDB.Name.ToUpper() + "</strong></span></strong> </td>");
                ojbSB.Append("<td style='text-align: right;width: 352px;'>Vendor Type:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;ALL</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Tax Year:</td>");
                ojbSB.Append("<td  name='taxyear'>" + TaxYear + "</td>");
                ojbSB.Append("<td style='text-align: center;font-size: 14px;'><strong><span><strong>" + CompanyName.ToUpper() + "</strong></span></strong> </td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Account:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;" + Account + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td class='auto-style1' ></td>");
                ojbSB.Append("<td class='auto-style2' >Vendors:</td>");
                ojbSB.Append("<td class='auto-style3' >" + VendorTotal + "</td>");
                ojbSB.Append("<td style='text-align: center; font-size: 14px;'></td>");
                ojbSB.Append("<td style='text-align: right;'>Vendor Name:</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;&nbsp;ALL</td>");
                ojbSB.Append("<td style='text-align: left;'></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Payment Date:</td>");
                ojbSB.Append("<td  >" + PaymentDate + "</td>");
                ojbSB.Append("<td >&nbsp;</td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Payment #: </td>");
                ojbSB.Append("<td style='text-align: left;' name='payment'>&nbsp;&nbsp;" + Payment + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Source: </td>");
                ojbSB.Append("<td  >" + Source + "</td>");
                ojbSB.Append("<td >&nbsp;</td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Amount:</td>");
                ojbSB.Append("<td style='text-align: left;' name='amount'>&nbsp;&nbsp;" + Amount + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Tax Code:</td>");
                ojbSB.Append("<td  name='taxcode'>" + Taxcode + "</td>");
                ojbSB.Append("<td style='text-align: center;'></td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Invoice:</td>");
                ojbSB.Append("<td style='text-align: left;' name='invoice'>&nbsp;&nbsp;" + Invoice + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;' >&nbsp;</td>");
                ojbSB.Append("<td style='width: 84px;' >Work State: </td>");
                ojbSB.Append("<td  name='workstate'>" + WorkState + "</td>");
                ojbSB.Append("<td style='text-align: center;'><strong>1099 VENDOR SUMMARY REPORT</strong></td>");
                ojbSB.Append("<td style='text-align: right;width: 305px;'>Report Date:</td>");
                ojbSB.Append("<td style='text-align: left;' name='reportdate'>&nbsp;&nbsp;" + ReportDate + "</td>");
                ojbSB.Append("<td style='text-align: left;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                //ojbSB.Append("<tr>");
                //ojbSB.Append(" <td style='font - size: x - small;' colspan='7'>&nbsp;</td>");
                //ojbSB.Append("</tr>");
                //ojbSB.Append("<tr>");
                //ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                //ojbSB.Append("<td colspan='5'></td>");
                //ojbSB.Append("<td>&nbsp;</td>");
                //ojbSB.Append("</tr>");
                ojbSB.Append("<tr>");
                ojbSB.Append("<td style='width: 10px;'>&nbsp;</td>");
                ojbSB.Append("<td colspan='5'><table style='width: 10.5in; border-spacing:0;font-size: 10px;  font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr style='font-weight:bold;background-color: #A4DEF9;'>");
                ojbSB.Append("<td style='border-bottom-style:solid;border-bottom-width:thin;border-bottom-color: #000000;text-align: left;width:200px;'>Vendor Name/dba Name</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:300px;'>W-9 Address</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:200px;'>Vendor Type</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:100px;'>TIN</td>");
                ojbSB.Append("<td style='border-bottom-style: solid; border-bottom-width: thin; border-bottom-color: #000000;text-align: left;width:100px;'>&nbsp;</td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</tr>");
                ojbSB.Append("<td colspan='5'>");
                ojbSB.Append("<table style='width: 10.5in; border-spacing:0;font-size: 10px;  font-family: Arial, Helvetica, sans-serif;'>");
                ojbSB.Append("<tr style='font-weight:bold;background-color: #A4DEF9;'>");
                ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px;width:750px' colspan='7'>&nbsp;</td>");
                ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px;'>Work State</td>");
                ojbSB.Append("<td style='text-align: center; border-bottom: solid 1px;width:70px'>Tax Code</td>");
                ojbSB.Append("<td style='text-align: right;width: 70px; border-bottom: solid 1px;'>Amount </td>");
                ojbSB.Append("</tr>");

                //ojbSB.Append("<tr class='clsbreak'><td colspan='10' style='height:20px'></td></tr>");

                for (int i = 0; i <= JOriginCheckRun.Count - 1; i++)
                {
                    List<string> workstate = new List<string>();
                    string VendorId = Convert.ToString(JOriginCheckRun[i]["VendorID"]);
                    string VendorName = Convert.ToString(JOriginCheckRun[i]["VendorName"]).ToUpper();
                    string Address1 = Convert.ToString(JOriginCheckRun[i]["Address1"]).ToUpper();
                    string Address2 = Convert.ToString(JOriginCheckRun[i]["Address2"]).ToUpper();
                    string Address3 = Convert.ToString(JOriginCheckRun[i]["Address3"]).ToUpper();
                    string City = Convert.ToString(JOriginCheckRun[i]["City"]).ToUpper();
                    string State = Convert.ToString(JOriginCheckRun[i]["State"]).ToUpper();
                    string PostalCode = Convert.ToString(JOriginCheckRun[i]["PostalCode"]);
                    string Country = Convert.ToString(JOriginCheckRun[i]["Country"]).ToUpper();
                    string VendorType = Convert.ToString(JOriginCheckRun[i]["VendorType"]).ToUpper();
                    string Taxid = Convert.ToString(JOriginCheckRun[i]["TIN"]);
                    string SubTotal = Convert.ToString(JOriginCheckRun[i]["Total"]);
                    var Transactions = JOriginCheckRun[i]["Transactions"];

                    string Phone = "";
                    if (Convert.ToString(JOriginCheckRun[i]["Phone"]) != "null")
                    {
                        Phone = Convert.ToString(JOriginCheckRun[i]["Phone"]);
                    }

                    string Address = "";

                    if (Address1 != "") { Address += Address1 + ", "; }
                    if (Address2 != "") { Address += Address2 + ", "; }
                    if (Address3 != "") { Address += Address3 + ", "; }
                    if (City != "") { Address += City + ", "; }
                    if (State != "") { Address += State + " "; }
                    if (PostalCode != "") { Address += PostalCode + " "; }

                    Address = Address.Trim().TrimEnd(',');

                    ojbSB.Append("<tr class='clsvendordtl'>");
                    ojbSB.Append("<td style='height: 20px;' colspan='10'>");
                    ojbSB.Append("<table style='width: 10.5in; border-spacing:0;font-size: 10px;  font-family: Arial, Helvetica, sans-serif;'>");
                    ojbSB.Append("<tr style='font-weight:bold;'>");
                    ojbSB.Append("<td style='width:200px;text-align: left;' class='vendorname'>" + VendorName + "</td>");
                    ojbSB.Append("<td style='width:300px;text-align: left;'  class='address'>" + Address + "</td>");
                    ojbSB.Append("<td style='width:200px;text-align: left;'  class='vendortype'>" + VendorType + "</td>");
                    ojbSB.Append("<td style='width:100px;text-align: left;font-weight:bold;'  class='tin'>" + Taxid + "</td>");
                    ojbSB.Append("<td style='width:100px;'>&nbsp;</td>");
                    ojbSB.Append("</tr></table></td></tr>");

                    IList<WorksheetVendorSummary> trans = Transactions.ToObject<IList<WorksheetVendorSummary>>();

                    var alltrans = (from bs in trans
                                    group bs by new
                                    {
                                        bs.WorkState,
                                        bs.TaxCode,

                                    } into g
                                    orderby g.Sum(x => x.Amount)
                                    select new WorksheetVendorSummary
                                    {
                                        WorkState = g.Key.WorkState,
                                        Amount = g.Sum(x => x.Amount),
                                        TaxCode = g.Key.TaxCode
                                    }).ToList();



                    for (int j = 0; j <= alltrans.Count - 1; j++)
                    {

                        string sWorkState = Convert.ToString(alltrans[j].WorkState);
                        string tc = Convert.ToString(alltrans[j].TaxCode);
                        string iAmount = Convert.ToString(alltrans[j].Amount);

                        ojbSB.Append("<tr class='clstransactions' style=''>");
                        ojbSB.Append("<td style='text-align:left;'  class='date' colspan='7'>&nbsp;</td>");
                        ojbSB.Append("<td style='text-align:center;'  class='description'>" + sWorkState + "</td>");
                        ojbSB.Append("<td style='text-align:center;width:50px;width: 60px;'  class='taxcode'>" + tc + "</td>");
                        ojbSB.Append("<td style='text-align:right;'><span style='float:left;text-align:left;'class='amount'>$</span>" + Convert.ToDecimal(iAmount).ToString("#,##0.00") + "</td>");
                        ojbSB.Append("</tr>");

                        if (!workstate.Contains(sWorkState, StringComparer.OrdinalIgnoreCase))
                        {
                            workstate.Add(sWorkState);
                        }
                    }

                    ojbSB.Append("<tr class='clssubtotal' style=''>");
                    ojbSB.Append("<td colspan='7'></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td></td>");
                    ojbSB.Append("<td style='text-align:right;border-top: solid 1px;'  class='subtotal'><span style='float:left;text-align:left;'>$</span>" + Convert.ToDecimal(SubTotal).ToString("#,##0.00") + "</td>");
                    ojbSB.Append("</tr>");

                    ojbSB.Append("<tr class='clsbreak'><td colspan='10' style='height:20px'></td></tr>");
                    count = count + workstate.Count;
                }

                ojbSB.Append("<tr class='clstotal' style=''>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;font-weight:bold;' >Total Amount:</td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;border-top: solid 1px;font-weight:bold;'  class='total'><span style='float:left;text-align:left;'>$</span>" + Convert.ToDecimal(Total).ToString("#,##0.00") + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr class='clscount' style=''>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;font-weight:bold;' >Form Count: </td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("<td style='text-align:right;border-top: solid 1px;font-weight:bold;'  class='total'><span style='float:left;text-align:left;'></span>" + count + "</td>");
                ojbSB.Append("</tr>");

                ojbSB.Append("<tr class='clsbreak'><td colspan='10' style='height:20px'></td></tr>");

                ojbSB.Append("</table>");
                ojbSB.Append("</td></tr>");
                ojbSB.Append("</table></td>");
                ojbSB.Append("<td></td>");
                ojbSB.Append("</tr>");
                ojbSB.Append("</table>");

            }

            string json = "{\"reportdata\":\""
                 + ojbSB.ToString()
                 + "}";
            string jsonReturn = JsonConvert.SerializeObject(ojbSB);
            return jsonReturn.ToString();

        }
    }
}
