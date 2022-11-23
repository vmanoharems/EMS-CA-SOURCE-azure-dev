
var APIUrlPrintPDF = HOST + "/api/ReportP1/Variance1";
var APIUrlFillAccount = HOST + "/api/CRW/GetAccountForCRWFromBudget";
var APIUrlFillLocation = HOST + "/api/CRW/GetLocationForCRWFromBudget";
var APIUrlFillBudgetForCompany = HOST + "/api/CRW/GetBudgetByCompanyForCRW";
var APIUrlCheckSetSegment = HOST + "/api/CRW/CheckForSetSegment";


var heightt;
var GlobalFile;
var CheckLocationStatus = 'NO';

$(document).ready(function () {  
    $('#LiCostReport').addClass('active');
    CheckLocationStatus1();
    heightt = $(window).height();
    heightt = heightt - 180;
    $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
    $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');
});

function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}

function PrintCheckPDF()
{
    var Error = '';
    var CO = $('#ddlCompany').val();
    var LO = $('#ddlLocation').val();
    var Budget = $('#ddlBudget').val();
    if (CO == '0')
    {
        Error = 'Please Select Company.';
    }
    if (Error == '') {
     
        if (LO == null)
        {
            LO = '0';
        }
        //$('#dvWait').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

        var FinalFilter = CO+'|'+LO+'|'+Budget;
        var JSONParameters = {};
        JSONParameters.callPayload = JSON.stringify({
            ProdID: localStorage.ProdId,
            Filter: FinalFilter,
            ProName: localStorage.ProductionName,
            UserID: localStorage.UserId,
        });

        let RE = new ReportEngine(APIUrlPrintPDF);
        RE.ReportTitle = 'Cost Report Variance Notes';
        RE.callingDocumentTitle = 'Reports > Cost Report > Variance';
        RE.FormCapture('#VarianceReportdiv');
        RE.FormJSON.CR = JSONParameters.callPayload;
        RE.isJSONParametersCall = true;
        RE.FormJSON.ProdId = localStorage.ProdId;
        RE.FormJSON.UserId = localStorage.UserId;
        RE.RunReport({ DisplayinTab: true });
        return;

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
        var FILECompleteName = 'Variance/' + fileName;
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
        //            VerifyCheck(/CostPDF/ + fileName);
        //        }
        //    },
        //    open: function () {
        //        var object = "<object data=\"{FileName}\" type=\"application/pdf\" width=\"800px\" height=\"350px\">";
        //        object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
        //        object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
        //        object += "</object>";

        //        object = object.replace(/{FileName}/g, /CostPDF/ + fileName);

        //        $("#dialog").html(object);
        //    }
        //});
    }

    $('#dvWait').attr('style', 'display:none;');
}


function PrintBrowserPDF() {

    var PDFURL = 'Variance/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#btnPrint').attr('style', 'display:block;');
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}

function VerifyCheck(pdfUrl) {

    $('#dialog').dialog('close');
    var w = window.open(pdfUrl);
    w.print();
}


function FillCompany() {
    $.ajax({
        url: APIUrlFillAccount + '?ProdId=' + localStorage.ProdId,
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
    //$('#ddlLocation').empty();
    //if (response.length == 1)
    //{
    //    for (var i = 0; i < response.length; i++) {
    //        $('#ddlCompany').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
    //    }
    //    FillLocation();
    //}
    //else
    //{
    //    $('#ddlCompany').append('<option value=0>Select Company</option>');
    //    for (var i = 0; i < response.length; i++) {
    //        $('#ddlCompany').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
    //    }
    //}  
    $('#ddlLocation').empty();
    if (response.length == 1) {
        for (var i = 0; i < response.length; i++) {
            $('#ddlCompany').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
        }
        if (CheckLocationStatus == 'YES') {
            $('#dvLo').attr('style', 'display:block;');
            FillLocation();
        }
        else {
            $('#dvLo').attr('style', 'display:none;');
            FillBudgetForCompany('', '', 1);
        }
    }
    else {
        $('#ddlCompany').append('<option value=0>Select Company</option>');
        for (var i = 0; i < response.length; i++) {
            $('#ddlCompany').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
        }

        if (CheckLocationStatus == 'YES') {
            $('#dvLo').attr('style', 'display:block;');
        }
        else {
            $('#dvLo').attr('style', 'display:none;');
            FillBudgetForCompany('', '', 1);
        }
    }
}

function FillLocation() {
    $('#ddlLocation').empty();
    $('#ddlBudget').empty();
    
    var CO = $('select#ddlCompany option:selected').val();

    $.ajax({
        url: APIUrlFillLocation + '?ProdId=' + localStorage.ProdId + '&CO=' + CO,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ FillLocationSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}

function FillLocationSucess(response) {
    if (response.length == 1)
    {
        $('#ddlBudget').empty();
        for (var i = 0; i < response.length; i++) {
            var Check = parseInt(response[i].AccountCode);
            //if (Check > 0) {
            //    $('#ddlLocation').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
            //}
            if (Check > 0) {
                $('#dvLo').attr('style', 'display:block;');
                $('#ddlLocation').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
            }
            else {
                $('#dvLo').attr('style', 'display:none;');
                FillBudgetForCompany('', '', 1);
            }
        }
        LO();
    }
    else
    {
        $('#ddlLocation').append('<option value=0>Select Location</option>');   
    }
}

function CO() {
    FillLocation();
    FillBudgetForCompany('', '', 1);
}

function LO() {
    $('#ddlBudget').empty();
    var CO = $('select#ddlCompany option:selected').val();
    var LO = $('select#ddlLocation option:selected').val();
    if (LO == '0') {
        FillBudgetForCompany(LO, '', 1);
    }
    else {
        FillBudgetForCompany(LO, '', 2);
    }
}


function FillBudgetForCompany(LO, EP, Mode) {
    var CompanyCode = $('select#ddlCompany option:selected').val();
    if (CompanyCode != '0') {
        $.ajax({
            url: APIUrlFillBudgetForCompany + '?CompanCode=' + CompanyCode + '&ProdID=' + localStorage.ProdId + '&LO=' + LO + '&EP=' + EP + '&Mode=' + Mode,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response)
        { FillBudgetForCompanySucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
    }
    else {  
        $('#ddlLocation').empty(); 
    }
}

function ShowMSG(error) {
    console.log(error);
}

function FillBudgetForCompanySucess(response) {
    var TLength = response.length;
    var str = '';
    if (TLength === 1) {
         for (var i = 0; i < TLength; i++) {
            var Value = response[i].Budgetid + "," + response[i].BudgetFileID;
            $('#ddlBudget').append('<option value=' + Value + ' selected>' + response[i].BudgetName + '</option>');           
        }
    } else {
        $('#ddlBudget').append('<option value=0>Select Budget</option>');

        for (var i = 0; i < TLength; i++) {
            var Value = response[i].Budgetid + "," + response[i].BudgetFileID;
            $('#ddlBudget').append('<option value=' + Value + '>' + response[i].BudgetName + '</option>');
        }
    }
}

function CheckLocationStatus1() {
    $.ajax({
        url: APIUrlCheckSetSegment + '?ProdID=' + localStorage.ProdId + '&Type=Location',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {
        CheckLocationStatusSucess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}

function CheckLocationStatusSucess(response) {
    if (response.length > 0) {
        CheckLocationStatus = 'YES';
    }
    else {
        CheckLocationStatus = 'NO';
    }

    FillCompany();
}