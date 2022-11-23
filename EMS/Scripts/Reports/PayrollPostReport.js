
var APIUrlPrintPDF = HOST + "/api/ReportP1/PayrollEditReportPDF";

var APIUrlFillAccount = HOST + "/api/BudgetOperation/GetAccountNameForBudget";

var APIUrlInvoiceNo = HOST + "/api/Payroll/InvoiceNumberAutoFill";

var heightt;
var GlobalFile;
AtlasUtilities.init();
var REv2 = new ReportEngine();
$(document).ready(function () {
    $('#btnPrint').attr('style', 'display:block;');
    $('#LiReportPayroll').addClass('active');
    heightt = $(window).height();
    heightt = heightt - 180;
    $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
    $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');
    FillCompany();
    let SegmentJSON = AtlasUtilities.SegmentJSON(
        {
            "Company": {
                fillElement: '#PayrollFilterCompany'
            }
            , "Location": {
                fillElement: '#PayrollFilterLocation'
                , ElementGroupID: '#PayrollFilterLocationGroup'
                , ElementGroupLabelID: '#PayrollFilterLocationLabel'
            }
            , "Episode": {
                fillElement: 'PayrollFilterEpisode'
                , ElementGroupID: 'PayrollFilterEpisodeGroup'
                , ElementGroupLabelID: 'PayrollFilterEpisodeLabel'
            }
            , "Set": {
                fillElement: '#PayrollFilterSet'
                , ElementGroupID: '#PayrollFilterSetGroup'
                , ElementGroupLabelID: '#PayrollFilterSetLabel'
            }
        }
    );
    REv2.FormRender(SegmentJSON);
});

function ShowMSG(error) {
    $('#btnPrint').attr('style', 'display:block;');
    console.log(error);
    $("#preload").css("display", "none");
}

function PrintCheckPDF() {
    var Error = '';
    var strCO = $('#hdnCO').val();
    var InvNo = $('#txtInvoiceNo').val();
    var Date1 = $('#txtFrom').val();
    var Date2 = $('#txtTo').val();

    if (Date1 != '') {
        if (Date2 == '') {
            Error = 'Date To is Missing';
        }
    }
    else if (Date2 != '') {
        Error = 'Date From is Missing';
    }
    else if ((Date1 == '') && (Date2 != '')) {
        Error = 'Date From is Missing';
    }
    else if ((Date2 == '') && (Date1 != '')) {
        Error = 'Date To is Missing';
    }


    if ((strCO == '') && (Date1 == '') && (Date2 == '') && (InvNo == '')) {
        Error = 'Please Enter any filter Values';
    }

    if (Error == '') {
        if (InvNo != '') {
            APIName = 'APIUrlPrintPDF';
            let RE = new ReportEngine(APIUrlPrintPDF);
            RE.ReportTitle = 'Payroll Edit';
            RE.callingDocumentTitle = 'Reports > Payroll > Payroll Post';
            RE.FormCapture('#DivPayrollPost');
            RE.FormJSON.Mode = 1;
            RE.FormJSON.ProName = localStorage.ProductionName;
            RE.isJSONParametersCall = true;
            RE.RunReport({ DisplayinTab: true });
        }
        else {
            alert('Please Select Invoice Number.');
        }
    }
    else {
        alert(Error);
    }

}

function PDFSucess(FileName) {
    if (FileName == '') {
        alert('There is no data for this report. Please change the criteria.');
    }
    else {
        $('#btnPrint').attr('style', 'display:none;');
        var fileName = FileName + ".pdf";
        GlobalFile = fileName;

        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'PayrollPDF/' + fileName;
        $('#dialog11').html('<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>');
        $('#dvFilterDv').attr('style', 'display:none');


        // var FILECompleteName = 'Reports/PayrollPDF/' + fileName;
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

    var PDFURL = 'PayrollPDF/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#btnPrint').attr('style', 'display:block;');
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}


$('#txtCO').click(function () {
    FillCompany();
    $("#hdnInvoice").val('');
    $("#txtInvoiceNo").val('');
})
$('#txtCO').focus(function () {
    FillCompany();
    $("#hdnInvoice").val('');
    $("#txtInvoiceNo").val('');
})

function FillCompany() {
    $.ajax({
        url: APIUrlFillAccount + '?ProdId=' + localStorage.ProdId + '&Classification=Company',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillCompanySucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function FillCompanySucess(response) {
    if (response.length == 1) {
        $("#hdnCO").val(response[0].AccountId);
        $('#txtCO').val(response[0].AccountCode);
    }
    else {
        VarGetCompanyId = [];
        VarGetCompanyId = response;
        var ProductListjson = response;
        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.AccountId,
                label: m.AccountCode,
            };
        });
        $(".CompnayCode").autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {

                $("#hdnCO").val(ui.item.value);
                $('#txtCO').val(ui.item.label);
                return false;
            },
            select: function (event, ui) {

                $("#hdnCO").val(ui.item.value);
                $('#txtCO').val(ui.item.label);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        })
    }
}


$('#txtInvoiceNo').click(function () {
    var CID = $("#hdnCO").val();
    if (CID == '') {
        $("#hdnInvoice").val('');
        $("#txtInvoiceNo").val('');
    }
    else {
        InvoiceNo();
    }

})
$('#txtInvoiceNo').focus(function () {
    var CID = $("#hdnCO").val();
    if (CID == '') {
        $("#hdnInvoice").val('');
        $("#txtInvoiceNo").val('');
    }
    else {
        InvoiceNo();
    }
})

function InvoiceNo() {
    var CID = $("#hdnCO").val();
    $.ajax({
        url: APIUrlInvoiceNo + '?CompanyID=' + CID + '&Mode=2',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { InvoiceNoSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function InvoiceNoSucess(response) {
    if (response.length == 1) {
        $("#hdnInvoice").val(response[0].InvoiceNumber);
        $('#txtInvoiceNo').val(response[0].InvoiceNumber);
    }
    else {
        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.InvoiceNumber,
                label: m.InvoiceNumber,
            };
        });
        $(".InvoiceNo").autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {

                $("#hdnInvoice").val(ui.item.value);
                $('#txtInvoiceNo').val(ui.item.label);
                return false;
            },
            select: function (event, ui) {

                $("#hdnInvoice").val(ui.item.value);
                $('#txtInvoiceNo').val(ui.item.label);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        })
    }
}