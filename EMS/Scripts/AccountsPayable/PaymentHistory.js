var APIUrlGetPaymentList = HOST + "/api/POInvoice/GetPaymentList";
var APIUrlUpdatePaymentStatus = HOST + "/api/POInvoice/UpdatePaymentStatus";

var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";


var ArrSegment = [];

$(document).ready(function () {
    GetPaymentList();
});


function GetPaymentList() {
    $.ajax({
        url: APIUrlGetPaymentList + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetPaymentListSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function GetPaymentListSucess(response) {
    var strHtml = '';
    for (var i = 0; i < response.length; i++) {

        strHtml += '<tr>';
        if (response[i].Status == 'Voided')
        { strHtml += '<td></td>'; }
        else if (response[i].Status == 'Cleared') {
            strHtml += '<td><input type="checkBox" class="clsInvoiceId1" id="chk_' + i + '" PaymentId=' + response[i].PaymentId + ' PStatus=' + response[i].Status + ' disabled></td>';
        }
        else { strHtml += '<td><input type="checkBox" class="clsInvoiceId" id="chk_' + i + '" PaymentId=' + response[i].PaymentId + ' PStatus=' + response[i].Status + '></td>'; }
        strHtml += '<td>' + response[i].CheckNumber + '</td>';
        strHtml += '<td>' + response[i].CheckDate + '</td>';
        strHtml += '<td>' + response[i].VendorName + '</td>';
        strHtml += '<td>' + response[i].LineCount + '</td>';
        var strAmount ='$ '+ (response[i].PaidAmount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        strHtml += '<td>' + strAmount + '</td>';
        strHtml += '<td>' + response[i].Status + '</td>';

        strHtml += '</tr>';

    }
    $('#TblPaymentHistoryTBody').html(strHtml);
}

function funCheckAll() {
    var strcheckBox = $('.clsInvoiceId');
    var strval = true;
    if ($('#CheckAll').is(':checked')) {
        strval = true;
    }
    else {
        strval = false;
    }
    for (var i = 0; i < strcheckBox.length; i++) {
        var strId = strcheckBox[i].id;
        if (strval == true) {
            $('#' + strId).prop('checked', true);
        }
        else {
            $('#' + strId).prop('checked', false);
        }
    }


}
function funPopShow(value) {

    var strInvoice = $('.clsInvoiceId');
    var FinalPaymentId = '';
    var sClearedCount = 0;
    for (var i = 0; i < strInvoice.length; i++) {
        var strchecked = strInvoice[i].checked;
        var strid = strInvoice[i].id;
        var PStatus = $('#' + strid).attr('PStatus');
        if (strchecked == true) {
            sClearedCount++;
        }
    }

    if (sClearedCount == 0) {
        ShowMsgBox('showMSG', 'Please Select Payment First.. !!', '', 'failuremsg');
    }
    else {

        if (value == 'Cancel') {
            $('#cancelChecks').show();
        }
        else if (value == 'Reissue') {
            $('#reissueChecks').show();

        }
        else if (value == 'Void') {
            $('#voidChecks').show();

        }
    }
}


function funCancel(value) {
    var strInvoice = $('.clsInvoiceId');
    var FinalPaymentId = '';
    var sClearedCount = 0;
    for (var i = 0; i < strInvoice.length; i++) {
        var strchecked = strInvoice[i].checked;
        var strid = strInvoice[i].id;
        var PStatus = $('#' + strid).attr('PStatus');
        if (PStatus == 'Cleared') {
            sClearedCount++;
        }
        else {
            if (strchecked == true) {
                FinalPaymentId += $('#' + strid).attr('paymentid') + ',';
            }
        }
    }
    FinalPaymentId = FinalPaymentId.substring(0, FinalPaymentId.length - 1);

    if (sClearedCount != 0) {
        //  $('#cancelCheckError').show();
    }

    $.ajax({
        url: APIUrlUpdatePaymentStatus + '?Status=' + value + '&PaymentId=' + FinalPaymentId + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ CheckResponse(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function CheckResponse(response) {
    GetPaymentList();
    // location.reload(true);
    $('#cancelChecks').hide();
    $('#reissueChecks').hide();
    $('#voidChecks').hide();
    $('#cancelCheckError').hide();
}


function funEditCriteria(value) {
    if (value == 'Edit') {
        $('#DvEditCriteria').show();
        $('#DvPaymentHistory').hide();
        GetSegmentsDetails();
    } else {
        $('#DvEditCriteria').hide();
        $('#DvPaymentHistory').show();
    }
}


//================================== Searching 
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
    .fail(function (error) {
        ShowMSG(error);
    })
}
function GetSegmentListSucess(response) {
    ArrSegment = [];
    var strhtml = '';
    for (var i = 0; i < response.length; i++) {
        if (response[i].Classification == 'Detail') {
            break;
        }
        var ObjSegment = {
            SegmentId: response[i].SegmentId, SegmentName: response[i].Classification
        }
        ArrSegment.push(ObjSegment);
       
    }
    for (var i = 0; i < ArrSegment.length; i++) {
        strhtml += '<tr>';
        strhtml += '<td>' + ArrSegment[i].SegmentName + '</td><td><input type="text" id="txt_' + ArrSegment[i].SegmentName + '" class="SearchCode"  onfocus="javascript:funSegment(\'' + ArrSegment[i].SegmentName + '\',' +i+ ');"></td>';
        strhtml += '</tr>';
    }
    strhtml += '<tr>';
    strhtml += '<td>Vendor</td><td><input type="text" id="txtVendor" class="VendorCode" onfocus="javascript:FillVendor();"><input type="hidden" id="hdnVendorId"></td>';
    strhtml += '</tr>';
    strhtml += '<tr>';
    strhtml += '<td>3rd Party Vendor</td><td><input type="checkbox" id="chk3PartyVendor"></td>';
    strhtml += '</tr>';
    strhtml += '<tr>';
    strhtml += '<td>Invoice #</td><td>From <input type="text" id="txtInvoiceNoS" class="datepicker"> To <input class="datepicker" type="text" id="txtInvoiceNoEnd"></td>';
    strhtml += '</tr>';
    strhtml += '<tr>';
    strhtml += '<td>Invoice Date</td><td><input type="text" id="txtInvoiceDate" class="datepicker"></td>';
    strhtml += '</tr>';
    strhtml += '<tr>';
    strhtml += '<td>Due Date</td><td><input type="text" id="txtInvoiceDueDate" class="datepicker"></td>';
    strhtml += '</tr>';
    strhtml += '<tr>';
    strhtml += '<td>Bank</td><td><input type="text" id="txtBankName" class="SearchBank" onfocus="javascript:FillBankDetails();"><input type="hidden" id="hdnBankid"></td>';
    strhtml += '</tr>';
    strhtml += '<tr style="display:none;">';
    strhtml += '<td><input type="hidden" id="hdnCOAId"><input type="hidden" id="hdnCOAString"></td>';
    strhtml += '</tr>';
    $('#TblEditCriteriaTBody').html(strhtml);

    $(".datepicker").datepicker();
}

//vendor
function FillVendor() {
 
    $.ajax({
        //url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
        url: APIUrlFillVendor + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillVendorSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}
function FillVendorSucess(response) {
    CheckVendornameAddInvc = [];
    CheckVendornameAddInvc = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
            Add1W9: m.Addressw9,
            Add2W9: m.Address2w9,
            Add1Re: m.AddressRe,
            Add2Re: m.Address2Re,
        };
    });


    $(".VendorCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnVendorId").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);
         
            return false;
        },
        select: function (event, ui) {

            $("#hdnVendorId").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //$("#hdnVendorID").val('');
                //$('#txtVendor  ').val('');
            }
        }
    })
  
}

//Bank

function FillBankDetails() {
    $.ajax({
        url: APIUrlFillBankDetails +'?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillBankDetailsSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}
function FillBankDetailsSucess(response) {
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

            $("#hdnBankid").val(ui.item.value);
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBankid").val(ui.item.value);
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //$("#hdnBank").val('');
                //$('#txtBank').val('');
            }
        }
    })
}
// COA
function funSegment(SegmentName, SegmentP) {

    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCOAString').val();
    if (SegmentP == 0) {
        COACode = '~';
    }
    else {

        PreSegment = SegmentP - 1;
    }
    var strCOACode = $('#txt_'+ PreSegment).attr('coacode');
    //txt_0_Company

    $.ajax({
        url: APIUrlGetCOA + '?COACode=' + COACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { funSegmentSucess(response); })
  .fail(function (error) {
      console.log(error);
  })
}
function funSegmentSucess(response) {
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

            $('#hdnCOAString').val(ui.item.value);
            $('#hdnCOAId').val(ui.item.COAId);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCOAString').val(ui.item.value);
            $('#hdnCOAId').val(ui.item.COAId);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                $(this).val('');
                $(this).removeAttr('COACode');
                $(this).removeAttr('COAId');

                $('#hdnCode_' + values).val('');
                $('#hdnCOAId_' + values).val('');
            }
        }
    })
}