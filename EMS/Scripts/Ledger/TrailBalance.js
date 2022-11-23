var APIUrlGetCompanyCode = HOST + "/api/CompanySettings/GetCompnayCodeByProdId";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";

var APIUrlGetTBByEP = HOST + "/api/Ledger/GetTBByEP";
var APIUrlGetTBByLevel1Ep = HOST + "/api/Ledger/GetTBByLevel1Ep";
var GetTBByLevel1NonEp = HOST + "/api/Ledger/GetTBByLevel1NonEp";


var pubGlPos = 0;
var pubDetailPos = 0;
var strTrgFields = [];
var GblYear = 0;
var GblSegment = [];
var BSegmentCount = 0;
var strSegmentid = 0;
var strEPcount = 0;

var retriveSegment = [];

$(document).ready(function () {

    GblYear = new Date().getFullYear();
    GetCompnayCode();
    // GetTBList();
    retriveSegment = $.parseJSON(localStorage.ArrSegment);

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
        $('#ddlCompany').append('<option value="' + response[i].CompanyID + '">' + response[i].CompanyCode + '</option>');
    }
    GetSegmentsDetails();

}
//===================================== Segment
function GetSegmentsDetails() {
  
    for (var i = 0; i < retriveSegment.length; i++) {

        if (retriveSegment[i].SegmentName == 'EP') {

            strEPcount++;
        }
    }
    if (strEPcount > 0) {
        $('#ddlSegmentName').append('<option value="Episode">' + 'Episode' + '</option>');
        $('#ddlSegmentName').append('<option value="Level1">' + 'Level 1' + '</option>');
    }
    else {
        $('#ddlSegmentName').append('<option value="Level1">' + 'Level 1' + '</option>');
    }
}

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

    var strTBType = '';
    if (strEPcount > 0) {
        var strSummarize = $('#ddlSegmentName').val();
        strTBType = $('#ddlSegmentName').val();
    }
    else {
        strTBType = 'NonEPisodic';
    }

    var obj = {
        ProdId: localStorage.ProdId,
        CompanyId: $('#ddlCompany').val(),
        FromDate: $('#txtFrom').val(),
        ToDate: $('#txtTo').val()
    }

    if (strTBType == 'NonEPisodic') {
        $.ajax({
            url: GetTBByLevel1NonEp,
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
            GetNonEPisodicSuccess(response, strTBType);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
    else if (strTBType == 'Episode') {
        $.ajax({
            url: APIUrlGetTBByEP,
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
                   GetTBListEpisodeSuccess(response, strTBType);
               })
               .fail(function (error)
               { ShowMSG(error); })
    }
    else if (strTBType == 'Level1')
    {
        $.ajax({
            url: APIUrlGetTBByLevel1Ep,
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
               GetTBListLevel1Success(response, strTBType);
           })
           .fail(function (error)
           { ShowMSG(error); })
    }
}

function GetNonEPisodicSuccess(response, strTBType) {

    var strHtml1 = '';
    strHtml1 += '<tr>';
    strHtml1 += '<th class="third"> <div class="th-inner">CO</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Account</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Type</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Description</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Begining Balance</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Current Activity</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Account Balance</div></th>';
    strHtml1 += '</tr>';
    $('#tblTBThead').html(strHtml1);

    

    var strHtml = '';
    var Tcount = response.length;
    for (var i = 0; i < Tcount; i++) {
        strHtml += '<tr>';
        strHtml += '<td>' + response[i].CO + '</td>';
        strHtml += '<td>' + response[i].Account + '</td>';
        strHtml += '<td>' + response[i].Type + '</td>';
        strHtml += '<td>' + response[i].Description + '</td>';
        strHtml += '<td>' + '$ ' + parseFloat(response[i].BeginingBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
        strHtml += '<td>' + '$ ' + parseFloat(response[i].Currentactivity + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
        strHtml += '<td>' + '$ ' + parseFloat(response[i].AccountBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
        strHtml += '</tr>';
    }
    $('#tblTBTBody').html(strHtml);
    var heightt = $(window).height();
    heightt = heightt - 250;
    $('#DvTB').attr('style', 'height:' + heightt + 'px;');
}

function GetTBListEpisodeSuccess(response, strTBType)
{

    var strHtml1 = '';
    strHtml1 += '<tr>';
    strHtml1 += '<th class="third"> <div class="th-inner">CO</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Episode</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Account</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Type</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Description</div></th>';
    strHtml1 += '<th class="four"> <div class="th-inner">Begining Balance</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Current Activity</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Account Balance</div></th>';
    strHtml1 += '</tr>';
    $('#tblTBThead').html(strHtml1);

  

    var strHtml = '';
    var Tcount = response.length;
    for (var i = 0; i < Tcount; i++) {
        strHtml += '<tr>';
        strHtml += '<td>' + response[i].CO + '</td>';
        strHtml += '<td>' + response[i].Episode + '</td>';
        strHtml += '<td>' + response[i].Account + '</td>';
        strHtml += '<td>' + response[i].Type + '</td>';
        strHtml += '<td>' + response[i].Description + '</td>';
        if (response[i].Type == 'Liability') {
            if (response[i].BeginingBal < 0) {
                var strval1 = response[i].BeginingBal - (response[i].BeginingBal * 2);
                strHtml += '<td style="color:red;"> ' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            else {
                strHtml += '<td>' + '$ ' + parseFloat(response[i].BeginingBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
            if (response[i].Currentactivity < 0) {
                var strval1 = response[i].Currentactivity - (response[i].Currentactivity * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            else {
                strHtml += '<td>' + '$ ' + parseFloat(response[i].Currentactivity + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
            if (response[i].AccountBal < 0) {
                var strval1 = response[i].AccountBal - (response[i].AccountBal * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            else {
                strHtml += '<td>' + '$ ' + parseFloat(response[i].AccountBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
        }
        else {
            if (response[i].BeginingBal <= 0) {
                var strval1 = response[i].BeginingBal - (response[i].BeginingBal * 2);
                strHtml += '<td>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
             
            }
         
            else {
                var strval1 = response[i].BeginingBal - (response[i].BeginingBal * 2);
                strHtml += '<td style="color:red;"> ' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            if (response[i].Currentactivity <= 0) {
                var strval1 = response[i].Currentactivity - (response[i].Currentactivity * 2);
                strHtml += '<td>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
               
            }
            else {
                var strval1 = response[i].Currentactivity - (response[i].Currentactivity * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            if (response[i].AccountBal <= 0) {
                var strval1 = response[i].AccountBal - (response[i].AccountBal * 2);
                strHtml += '<td>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
            else {
                var strval1 = response[i].AccountBal - (response[i].AccountBal * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';

               
            }
        }
        strHtml += '</tr>';
    }
    $('#tblTBTBody').html(strHtml);
    var heightt = $(window).height();
    heightt = heightt - 250;
    $('#DvTB').attr('style', 'height:' + heightt + 'px;');
}

function GetTBListLevel1Success(response, strTBType)
{
   

    var strHtml1 = '';
    strHtml1 += '<tr>';
    strHtml1 += '<th class="third"> <div class="th-inner">CO</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Account</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Episode</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Type</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Description</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Begining Balance</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Current Activity</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">Account Balance</div></th>';
    strHtml1 += '</tr>';
    $('#tblTBThead').html(strHtml1);


    var strHtml = '';
    var Tcount = response.length;
    var strval = '';
    var stri = 0;
    var strNewi = 0;

    for (var i = 0; i < Tcount; i++) {
      if (i == 0) {
             strval = response[i].Account;stri = i;
        }
        else {
            if (strval != response[i].Account) {
                strNewi = i;
                var strBBal = 0; var strCActivity = 0; var strABal = 0;
                for (var j = stri; j < strNewi; j++) {
                    strBBal += response[j].BeginingBal;
                    strCActivity += response[j].Currentactivity;
                    strABal += response[j].AccountBal;
                }
                strHtml += '<tr>'; strHtml += '<td></td>'; strHtml += '<td><b>' + strval + '</b></td>';
                strHtml += '<td></td>'; strHtml += '<td><b>Total</b></td>'; strHtml += '<td></td>';
                if (strBBal < 0) {
                    strval1 = strBBal - (strBBal * 2);
                    strHtml += '<td ><b>' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</b></td>';
                }else{
                    strHtml += '<td><b>' + '$ ' + parseFloat(strBBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
                }
                if (strCActivity < 0) {
                    strval1 = strCActivity - (strCActivity * 2);
                    strHtml += '<td ><b>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
                }
                else {
                    strHtml += '<td><b>' + '$ ' + parseFloat(strCActivity + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
                }
                if (strABal < 0) {
                    strval1 = strABal - (strABal * 2);
                    strHtml += '<td ><b>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
                }
                else {
                    strHtml += '<td><b>' + '$ ' + parseFloat(strABal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
                }
                strHtml += '</tr>';
                strval = response[i].Account;
                stri = i;
            }
        }

        strHtml += '<tr>';
        strHtml += '<td>' + response[i].CO + '</td>';
        strHtml += '<td>' + response[i].Account + '</td>';
        strHtml += '<td>' + response[i].Episode + '</td>';

        strHtml += '<td>' + response[i].Type + '</td>';
        strHtml += '<td>' + response[i].Description + '</td>';
        if (response[i].Type == 'Liability') {
            if (response[i].BeginingBal < 0) {
                var strval1 = response[i].BeginingBal - (response[i].BeginingBal * 2);
                strHtml += '<td style="color:red;"> ' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            else {
                strHtml += '<td>' + '$ ' + parseFloat(response[i].BeginingBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
            if (response[i].Currentactivity < 0) {
                var strval1 = response[i].Currentactivity - (response[i].Currentactivity * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            else {
                strHtml += '<td>' + '$ ' + parseFloat(response[i].Currentactivity + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
            if (response[i].AccountBal < 0) {
                var strval1 = response[i].AccountBal - (response[i].AccountBal * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            else {
                strHtml += '<td>' + '$ ' + parseFloat(response[i].AccountBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
        }
        else {
            if (response[i].BeginingBal <= 0) {
                var strval1 = response[i].BeginingBal - (response[i].BeginingBal * 2);
                strHtml += '<td>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';

            }

            else {
                var strval1 = response[i].BeginingBal - (response[i].BeginingBal * 2);
                strHtml += '<td style="color:red;"> ' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            if (response[i].Currentactivity <= 0) {
                var strval1 = response[i].Currentactivity - (response[i].Currentactivity * 2);
                strHtml += '<td>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';

            }
            else {
                var strval1 = response[i].Currentactivity - (response[i].Currentactivity * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';
            }
            if (response[i].AccountBal <= 0) {
                var strval1 = response[i].AccountBal - (response[i].AccountBal * 2);
                strHtml += '<td>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            }
            else {
                var strval1 = response[i].AccountBal - (response[i].AccountBal * 2);
                strHtml += '<td style="color:red;">' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</td>';


            }
        }
        strHtml += '</tr>';

        if (i == response.length - 1)
        {
            strHtml += '<tr>'; strHtml += '<td></td>'; strHtml += '<td><b>' + strval + '</b></td>';
            strHtml += '<td></td>'; strHtml += '<td><b>Total</b></td>'; strHtml += '<td></td>';
            if (strBBal < 0) {
                strval1 = strBBal - (strBBal * 2);
                strHtml += '<td style="color:red;"><b>' + '( $ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ')</b></td>';
            } else {
                strHtml += '<td><b>' + '$ ' + parseFloat(strBBal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
            }
            if (strCActivity < 0) {
                strval1 = strCActivity - (strCActivity * 2);
                strHtml += '<td style="color:red;"><b>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
            }
            else {
                strHtml += '<td><b>' + '$ ' + parseFloat(strCActivity + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
            }
            if (strABal < 0) {
                strval1 = strABal - (strABal * 2);
                strHtml += '<td style="color:red;"><b>' + '$ ' + parseFloat(strval1 + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
            }
            else {
                strHtml += '<td><b>' + '$ ' + parseFloat(strABal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</b></td>';
            }
        }




    }
    $('#tblTBTBody').html(strHtml);
    var heightt = $(window).height();
    heightt = heightt - 250;
    $('#DvTB').attr('style', 'height:' + heightt + 'px;');
}