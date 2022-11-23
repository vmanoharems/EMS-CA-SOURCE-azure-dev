var APIUrlGetCompanyCode = HOST + "/api/CompanySettings/GetCompnayCodeByProdId";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTBListNew = HOST + "/api/Ledger/GetListForTrailBalance";
var APIUrlReportGetTBListPDF = HOST + "/api/ReportAPI/GetListForTrailBalance";

var pubGlPos = 0;
var pubDetailPos = 0;
var strTrgFields = [];
var GblYear = 0;
var GblSegment = [];
var BSegmentCount = 0;
var strSegmentid = 0;

$(document).ready(function () {

    GblYear = new Date().getFullYear();
    GetCompnayCode();
    // GetTBList();
   

});
//===================================== Company 
function GetCompnayCode() {
    $.ajax({
        url: APIUrlGetCompanyCode + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { GetCompanyCodeSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function GetCompanyCodeSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value="' + response[i].CompanyCode + '">' + response[i].CompanyCode + '</option>');
    }
    GetSegmentsDetails();

}
//===================================== Segment
function GetSegmentsDetails() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 0,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetSegmentListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetSegmentListSucess(response) {
    GblSegment = response;
    for (var i = 0; i < response.length; i++) {

        if (response[i].SegmentName == 'Ledger') {
            pubGlPos = i;

        }
        else if (response[i].SegmentName == 'Company')
        { }
        else if (response[i].SegmentName == 'Detail') {
            $('#ddlSegmentName').append('<option value="' + response[i].SegmentLevel + '">' + 'Detail Header' + '</option>');
            $('#ddlSegmentName').append('<option value="' + response[i].SegmentLevel + '">' + 'Detail Level1' + '</option>');
            break;
        }
        else {
            $('#ddlSegmentName').append('<option value="' + response[i].SegmentLevel + '">' + response[i].SegmentName + '</option>');
        }
    }

    // GetTBList();
}

//
function funSelectSegment() {
    var strSegmentName = $('#ddlSegmentName').val()
}
//====================================== Change Period
function funPeriodchange() {
    if ($('#ddlPeriod').val() == 'YearPeriod') {
        $('#txtFrom').prop('disabled', true);
        $('#txtTo').prop('disabled', true);
        $('#DvSelectDate').removeAttr('style');
        $('#DvSelectDate').attr('style', 'visibility: visible;');
        $('#ddlYearPeriod').html('<option value=' + 0 + '>Select</option>');
        $('#ddlYearPeriod').append('<option value=' + GblYear + '>This Year</option>');

    }
    else {
        $('#txtFrom').prop('disabled', false);
        $('#txtTo').prop('disabled', false);
        $('#DvSelectDate').removeAttr('style');
        $('#DvSelectDate').attr('style', 'visibility:hidden;');
        $('#txtFrom').val('');
        $('#txtTo').val('');
    }
}

function funFillDate() {
    var strYear = $('#ddlYearPeriod').val();
    if ($('#ddlYearPeriod').val() != 0) {
        if ($('#ddlYearPeriod').val() == GblYear) {
            var d = new Date();
            var currentDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
            $('#txtFrom').val('01/01/' + GblYear + '');
            $('#txtTo').val(currentDate);

        }
        else {
            $('#txtFrom').val('01/01/' + strYear + '');
            $('#txtTo').val('31/12/' + strYear + '');
        }
    }
}


function CreateCSV(value) {

    var obj = {
        ProdId: localStorage.ProdId,
        CompanyId: '01',
        SegmentName: '',
        Period: '',
        FromDate: '',
        ToDate: ''
    }

    $.ajax({
        url: APIUrlGetTBList,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
    })
    .done(function (response) {
        //  xyz(response);
        CreateCSVSuccess(response, value);
    })
    .fail(function (error) {
        Console.log(error);
    })
}


function CreateCSVSuccess(response, value) {
    tableLength = response.length;
    console.log(response);
    var data = response;
    var csvContent = "";// "data:text/csv;charset=utf-8,";
    var Headers = Object.keys(data[0]);
    console.log(Headers);

    var csvContentHead = "data:text/csv;charset=utf-8,";// += strTrgFields;
    var addOnce = 0;

    $.each(data, function (index, infoArray) {
        var array = $.map(infoArray, function (value, ind) {
            var b = Headers.indexOf(ind);
            if (b >= 0) {
                if (addOnce == 0) {
                    csvContentHead += ind;
                    csvContentHead += ",";
                }
                return [value];
            }
            //else {
            //    alert(ind);
            //}
        });
        dataString = array.join(",");
        csvContent += index < data.length ? dataString + "\n" : dataString;
        addOnce = 1;
    });
    csvContent = csvContentHead + "\n" + csvContent;

    //strSrcFields = [];
    //strTrgFields = [];

    var encodedUri = encodeURI(csvContent);
    var downloadLink = document.createElement("a");
    downloadLink.href = encodedUri;
    downloadLink.download = "TrailBalance." + value;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


function xyz(response) {
    for (var i = 0; i < response.length; i++) {
        var COAID = response[i].COAID;
        var COAString = response[i].COAString;
        var strCOAString = COAString.split('|');
        for (var j = 0; j < strCOAString.length; j++) {

        }
    }
}


///-===================new trial=================//

function GetTBList() {
    var strHtml = '';
    var strSegment = $('#ddlSegmentName option:selected').text();
    strSegmentid = $('#ddlSegmentName option:selected').val();

    strHtml += '<tr>';
    for (var i = 0; i < strSegmentid; i++) {

        if (strSegmentid == GblSegment[i].SegmentID) {

            strHtml += '<th>' + GblSegment[i].SegmentCode + '</th>';

            BSegmentCount = i;
            break;

        }
        else if ('Ledger' == GblSegment[i].SegmentName) {

        }
        else {
            strHtml += '<th>' + GblSegment[i].SegmentCode + '</th>';
        }

    }
    strHtml += '<th>Description</th>';
    strHtml += '<th>Begining Balance</th>';
    strHtml += '<th>Current Activity</th>';
    strHtml += '<th>Account Balance</th>';
    strHtml += '<th>Currency</th>';
    strHtml += '</tr>';
    $('#tblTBThead').html(strHtml);



    var obj = {
        ProdId: localStorage.ProdId,
        CompanyCode: $('#ddlCompany').val(),
        Segmentcode: strSegment,
        FromDate: $('#txtFrom').val(),
        ToDate: $('#txtTo').val()
    }


    $.ajax({
        url: APIUrlGetTBListNew,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
    })
    .done(function (response) {
        GetTBListSuccess(response);
    })
 .fail(function (error)
 { ShowMSG(error); })

}
function GetTBListSuccess(response) {


    var strHtml = '';
    var Tcount = response.length;
    for (var i = 0; i < Tcount; i++) {


        var COA = response[i].COAString;

        var strCOA = COA.split('|');

        strHtml += '<tr>';



        for (j = 0; j <= strSegmentid - 1; j++) {
            strHtml += '<td>' + strCOA[j] + '</td>';

        }

        strHtml += '<td>' + response[i].Description + '</td>';
        strHtml += '<td>' + response[i].BeginingBal + '</td>';
        strHtml += '<td>' + response[i].CurrentActivity + '</td>';
        strHtml += '<td>' + response[i].AccountBal + '</td>';
        strHtml += '<td>' + 'USD' + '</td>';
        strHtml += '</tr>';
    }
    $('#tblTBTBody').html(strHtml);

    var heightt = $(window).height();
    heightt = heightt - 250;
    $('#DvtblCOA').attr('style', 'height:' + heightt + 'px;');
}


//===========================Trial Balance Report=======================//

function ReportTrialBList() {
  
    var strHtml = '';
    var strSegment = $('#ddlSegmentName option:selected').text();
    strSegmentid = $('#ddlSegmentName option:selected').val();

    strHtml += '<tr>';
    for (var i = 0; i < strSegmentid; i++) {

        if (strSegmentid == GblSegment[i].SegmentID) {

            strHtml += '<th>' + GblSegment[i].SegmentCode + '</th>';

            BSegmentCount = i;
            break;

        }
        else if ('Ledger' == GblSegment[i].SegmentName) {

        }
        else {
            strHtml += '<th>' + GblSegment[i].SegmentCode + '</th>';
        }

    }
    strHtml += '<th>Description</th>';
    strHtml += '<th>Begining Balance</th>';
    strHtml += '<th>Current Activity</th>';
    strHtml += '<th>Account Balance</th>';
    strHtml += '<th>Currency</th>';
    strHtml += '</tr>';
    $('#tblTBThead').html(strHtml);
    var obj = {
        ProdId: localStorage.ProdId,
        CompanyCode: $('#ddlCompany').val(),
        Segmentcode: strSegment,
        FromDate: $('#txtFrom').val(),
        ToDate: $('#txtTo').val()
    }


    $.ajax({
        url: APIUrlReportGetTBListPDF,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
    })
    .done(function (response) {
        ReportTrialBListSuccess(response);
    })
 .fail(function (error)
 { ShowMSG(error); })

}
function ReportTrialBListSuccess(response) {
    alert('Report Printed');
}










