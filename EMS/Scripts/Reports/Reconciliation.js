
var APIUrlPrintPDF = HOST + "/api/ReportP1/ReconciliationReport";

var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlFillRecID = HOST + "/api/ReportP1/GetReconcilationList";
var APIUrlFillSegment = HOST + "/api/Payroll/GetSegmentForPayroll";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";

var CheckBankID = [];

var TabID = '';


var heightt;
var GlobalFile;

$(document).ready(function () {
    $('#LiReportBanking').addClass('active');
   
    FillBankDetails();
    FillSegment();

    heightt = $(window).height();
    heightt = heightt - 180;
    $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
    $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');
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
        FillReconcilation();
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


function FillRecIDSucess(response) {
    $('#ddlID').empty();
    $('#ddlID').append('<option value="">Select</option>');
    for (var i = 0; i < response.length; i++) {
        $('#ddlID').append('<option value=' + response[i].ReconcilationID + '>' + response[i].ReconcilationID + '</option>');
    }
}
function ShowMSG(error) {
    console.log(error);
}
//================CheckVendorName======================//
function FillReconcilation()
{
    FillRecID($('#hdnBank').val());
}

function FillRecID(BankID) {
    $.ajax({
        url: APIUrlFillRecID + '?ProdID=' + localStorage.ProdId+'&BankID='+BankID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillRecIDSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
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
                strHtmlTd = '<input type="text" tabindex="1"  class="SearchCode form-control marb0 detectTab" onblur="javascript:GetSegmentValue(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + Check + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + Check + '" />';
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

///-------------------------------------------------------------

function ApplyFilter() {
    var CID = $('#txt_0_0').val();
    var BankID = $('#hdnBank').val();
    if ((CID == '') || (BankID == '')) {
        $('#' + TabID).focus();
        ShowMsgBox('showMSG', 'Please Select Company & Bank before you can continue...', '', 'failuremsg');

    }
    else {

        var D1 = "";
        var D2 = "";
        var V = $('#hdnVendorID').val();

        if ($('#txtInv1').val() == "") {
            D1 = "01/01/1099";
        }
        else {
            D1 = $('#txtInv1').val();
        }
        if ($('#txtInv2').val() == "") {
            D2 = "01/01/9999";
        }
        else {
            D2 = $('#txtInv2').val();
        }


        var P = $('select#ddlPeriod option:selected').val();

        localStorage.CheckCycleTemp = CID + "|" + BankID + "|" + V + "|" + D1 + "|" + D2 + "|" + $('#txtBankName').val() + "|" + P;
        window.location.href = 'PaymentFilter';
    }
}

$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 83) {
        ApplyFilter();
    }
});

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

function PrintCheckPDF() {
    var Error = '';
    var CID = $('#txt_0_0').val();
    var BankID = $('#hdnBank').val();
   // var CheckType = $('select#ddlType option:selected').val();
    var RecID = $('select#ddlID option:selected').val();

    $('#dvWait').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

    var FinalFilter = CID + '|' + BankID + '|' + RecID;
   
    $.ajax({
        url: APIUrlPrintPDF + '?ProdId=' + localStorage.ProdId + '&Filter=' + FinalFilter + '&ProName=' + localStorage.ProductionName + '&UserID=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       PDFSucess(response);
   })
   .fail(function (error)
   { ShowMSG(error); })
}

function PDFSucess(FileName) {
    if (FileName == '') {
        alert('Data not found for given Values.');
    }
    else {

        $('#btnPrint').attr('style', 'display:none;');
        var fileName = FileName + ".pdf";
        GlobalFile = fileName;
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'Reconciliation/' + fileName;
        // $('#dialog11').html('<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>');   
        $('#dvFilterDv').attr('style', 'display:none');


        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF();" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);





        //var fileName = FileName + ".pdf";
        //$("#dialog").dialog({
        //    modal: true,
        //    title: fileName,
        //    width: 840,
        //    height: 500,
        //    buttons: {
        //        Close: function () {
        //            $(this).dialog('close');
        //        },

        //        Print: function () {
        //            VerifyCheck(/CheckRegisterPDF/ + fileName);
        //        }
        //    },
        //    open: function () {
        //        var object = "<object data=\"{FileName}\" type=\"application/pdf\" width=\"800px\" height=\"350px\">";
        //        object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
        //        object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
        //        object += "</object>";

        //        object = object.replace(/{FileName}/g, /CheckRegisterPDF/ + fileName);

        //        $("#dialog").html(object);
        //    }
        //});
    }

    $('#dvWait').attr('style', 'display:none;');
}

function VerifyCheck(pdfUrl) {

    $('#dialog').dialog('close');
    var w = window.open(pdfUrl);
    w.print();
}

function PrintBrowserPDF() {

    var PDFURL = 'Reconciliation/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#btnPrint').attr('style', 'display:block;');
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}