
var APIUrlGetCheckRun = HOST + "/api/ReportP1/GetCheckRunList";
var APIUrlPrintPDF = HOST + "/api/ReportP1/CheckPrintPDF";
var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlFillSegment = HOST + "/api/Payroll/GetSegmentForPayroll";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";

var heightt;
var GlobalFile;

AtlasUtilities.init();
var REv2 = new ReportEngine();

$(document).ready(function () {
    funCheckRun();
    FillBankDetails();
    FillSegment();
    $('#LiReportBanking').addClass('active');
    heightt = $(window).height();
    heightt = heightt - 180;
    $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
    $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');

    let SegmentJSON = AtlasUtilities.SegmentJSON(
        {
            "Company": {
                fillElement: '#BankingCheckRunFilterCompany'
            }
            , "Location": {
                fillElement: '#BankingCRFilterLocation'
                , ElementGroupID: '#BankingCRFilterLocationGroup'
                , ElementGroupLabelID: '#BankingCRFilterLocationLabel'
            }
            , "Episode": {
                fillElement: 'BankingCRFilterEpisode'
                , ElementGroupID: 'BankingCRFilterEpisodeGroup'
                , ElementGroupLabelID: 'BankingCRFilterEpisodeLabel'
            }
            , "Set": {
                fillElement: '#BankingCRFilterSet'
                , ElementGroupID: '#BankingCRFilterSetGroup'
                , ElementGroupLabelID: '#BankingCRFilterSetLabel'
            }
        }
    );

    REv2.FormRender(SegmentJSON);
});

function FillBankDetails() {
    $.ajax({
        url: APIUrlFillBankDetails + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillBankDetailsSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillBankDetailsSucess(response) {

    if (response.length == 1) {
        $('#txtBankName').val(response[0].Bankname);
        $('#hdnBank').val(response[0].BankId);
    }

    CheckBankID = [];
    CheckBankID = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.BankId,
            label: m.Bankname,

        };
    });
    $(".SearchBank").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnBank").val(ui.item.value);
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBank").val(ui.item.value);
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}
function funSegment(values, SegmentName, SegmentP) {
    GlbCOAList = [];
    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    }
    else {

        PreSegment = SegmentP - 1;
    }
    var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
    //txt_0_Company

    $.ajax({
        url: APIUrlGetCOA + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { funSegmentSucess(response, values); })
  .fail(function (error)
  { console.log(error); })
}
function funSegmentSucess(response, values) {

    GlbCOAList = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.COANo,
            value: m.COACode,
            COAId: m.COAID,
        };
    });
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {

            }
        }
    })
}
function FillSegment() {
    $.ajax({
        url: APIUrlFillSegment + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillSegmentSucess(response); })
}

function FillSegmentSucess(response) {
    ArrSegment = [];
    var TLength = response.length;
    var strHtml = '';
    var strHtmlTh = '';
    var strHtmlTd = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {

            //if (response[i].Classification != 'Company') {          
            //    SegmentStrTr += '<th>' + response[i].SegmentCode + '</th>';
            //}

            var ObjSegment = {
                SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode
            }


            ArrSegment.push(ObjSegment);
            var Check = response[i].Classification

            //strHtmlTh += "<th>" + response[i].SegmentCode + "</th>";

            if (Check == 'Company') {
                // strHtmlTh += "<th>" +  + "</th>";
                $('#lblCO').html(response[i].SegmentCode);
                strHtmlTd = '<input type="text" style="margin-left:13px !important; float:left;" tabindex="1"  class="SearchCode form-control marb0 detectTab" onblur="javascript:GetSegmentValue(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + Check + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + Check + '" />';
                TabID = "txt_0_" + i + "";
            }

            //else if (Check == 'Set') {
            //    strHtmlTd += '<td class="width100"><input type="text"  class="SearchOptionalCode clsOtional' + 0 + '   " onblur="javascript:funCheckOptionalAutoFill(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:GetOptional(' + 0 + ',\'' + Check + '\',' + i + ');" id="txtOptional_' + 0 + '_' + i + '" name="' + Check + '" /></td>';

            //}
            //else if (Check == 'Series') {
            //    strHtmlTd += '<td class="width100"><input type="text"  class="SearchOptionalCode clsOtional' + 0 + '   " onblur="javascript:funCheckOptionalAutoFill(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:GetOptional(' + 0 + ',\'' + Check + '\',' + i + ');" id="txtOptional_' + 0 + '_' + i + '" name="' + Check + '" /><input type="hidden" class="clsCOACode" id="hdnCode_' + 0 + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + 0 + '"  ></td>';

            //}
            //else {
            //    strHtmlTd += '<td class="width100"><input type="text"  class="SearchCode   detectTab" onblur="javascript:GetSegmentValue(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + Check + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + Check + '" /></td>';
            //}
            '<input type="hidden" class="clsCOACode" id="hdnCode_' + 0 + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + 0 + '">';

        }

    }

    $('#tblSegment').html(strHtmlTd);

    CheckCompanyCnt();
}

function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}


function CheckCompanyCnt() {
    $.ajax({
        url: APIUrlGetCOA + '?COACode=' + "0" + '&ProdId=' + localStorage.ProdId + '&SegmentPosition=' + 0,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { CheckCompanyCntSucess(response); })
  .fail(function (error)
  { console.log(error); })
}

function CheckCompanyCntSucess(response) {
    if (response.length == 1) {
        $('#txt_0_0').val(response[0].COACode);
        FillBankDetails();
    }
}

//===============multiselect ===========//
function funCheckRun() {
  
    $.ajax({
        url: APIUrlGetCheckRun + '?ProdID=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { funCheckRunSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}

function funCheckRunSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlCheckRun').append('<option value="' + response[i].CheckRunID + '">' + response[i].CheckRunID + '</option>');
    }
    $('#ddlCheckRun').multiselect();
}

function PrintCheckPDF()
{
    var Error = '';
    var strCheckRun = $('#ddlCheckRun').val();
    var CID = parseFloat($('#BankingCheckRunFilterCompany').val()[0]);
    var BankID = $('#hdnBank').val();
    var strFinalCheckRun = '';
    if (strCheckRun == null) {
        strCheckRun = '';
    }
    else {
        for (var i = 0; i < strCheckRun.length; i++) {
            strFinalCheckRun = strFinalCheckRun + ',' + strCheckRun[i]
        }
    }

    var Date1 = $('#txtFrom').val();
    var Date2 = $('#txtTo').val();

    if (Date1 != '')
    {
        if (Date2 == '')
        {
            Error = 'Date To is Missing';
        }
    }
    else if (Date2 != '') {
        Error = 'Date From is Missing';
    }
    else if ((Date1 == '') && (Date2 != ''))
    {
        Error = 'Date From is Missing';
    }
    else if ((Date2 == '') && (Date1 != '')) {
        Error = 'Date To is Missing';
    }

    if ((strFinalCheckRun == '') && (Date1 == '') && (Date2 == '') && (CID == '') && (BankID == ''))
    {
        Error = 'Please Enter any filter Values';
    }

    if (Error == '') {
        var Filter = CID + '|' + BankID + '|'+ strFinalCheckRun + '|' + Date1 + '|' + Date2;

        //$('#dvWait').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify({
            Filter: Filter,
            ProdID: localStorage.ProdId,
            ProName: localStorage.ProductionName,
            UserID: localStorage.UserId,
        });
        APIName = 'APIUrlPrintPDF';
        let RE = new ReportEngine(APIUrlPrintPDF);
        RE.ReportTitle = 'Check Run Register';
        RE.callingDocumentTitle = 'Reports > Banking > Check Run Register';
        RE.FormCapture('#DivCheckRun');
        RE.FormJSON.CheckRun = JSONParameters;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        return;
        $.ajax({
            url: APIUrlPrintPDF + '?Filter=' + Filter + '&ProdID=' + localStorage.ProdId + '&ProName=' + localStorage.ProductionName + '&UserID=' + localStorage.UserId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'post',
            contentType: 'application/json; charset=utf-8',
        })
       .done(function (response) {
           PDFSucess(response);
       })
       .fail(function (error)
       { ShowMSG(error); })
    }
    else {
        alert(Error);
    }
}

function PDFSucess(FileName) {
    if (FileName == '')
    {
        alert('Data not found for given Values.');
    }
    else
    {
        $('#btnPrint').attr('style', 'display:none;');
        var fileName = FileName + ".pdf";
        GlobalFile = fileName;
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'BankingPDF/' + fileName;    
        $('#dvFilterDv').attr('style', 'display:none');
        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF();" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);      
    }
    $('#dvWait').attr('style', 'display:none;');
}

function VerifyCheck(pdfUrl) {
    $('#dialog').dialog('close');
    var w = window.open(pdfUrl);
    w.print();
}

function PrintBrowserPDF() {
    var PDFURL = 'BankingPDF/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#btnPrint').attr('style', 'display:block;');
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}

function funBankCheck() {
    var StrAddInvcCheckBanks = $('#txtBankName').val().trim();
    if (StrAddInvcCheckBanks != '') {
        for (var i = 0; i < CheckBankID.length; i++) {
            if (CheckBankID[i].Bankname == StrAddInvcCheckBanks) {
                $('#hdnBank').val(CheckBankID[i].BankId);
                $('#txtBankName').val(CheckBankID[i].Bankname);
                break;
            }
            else {
                $('#hdnBank').val('');
                $('#txtBankName').val('');
            }
        }
        for (var i = 0; i < CheckBankID.length; i++) {
            if (CheckBankID[i].Bankname.substring(0, StrAddInvcCheckBanks.length) === StrAddInvcCheckBanks) {
                $('#hdnBank').val(CheckBankID[i].BankId);
                $('#txtBankName').val(CheckBankID[i].Bankname);
                break;
            }
        }
    }
    else {
        $('#hdnBank').val(CheckBankID[0].BankId);
        $('#txtBankName').val(CheckBankID[0].Bankname);
    }
}