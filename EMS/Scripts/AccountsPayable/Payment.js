var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlGetInvoiceList = HOST + "/api/POInvoice/GetInvoiceListForPayment";
var APIUrlGetCheckNumber = HOST + "/api/POInvoice/GetCheckNumberForPayment";
var APIUrlSavePayment = HOST + "/api/POInvoice/SavePayment";
var GetDate = '';
var CheckBankID = [];
var StrCheckNumber = 0;
var strTempCheck = 0;
var strArrDetail = [];


$(document).ready(function () {
    FillBankDetails();
    //GetInvoiceList();
    var d = new Date();
    GetDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
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
                //$(this).val('');
                //$("#hdnBank").val('');
                //$('#txtBank').val('');
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


    //if ($('#hdnBank').val() != '')
    //{
    //}

    GetInvoiceList();

}



function GetInvoiceList() {
    $.ajax({
        url: APIUrlGetInvoiceList + '?ProdId=' + localStorage.ProdId + '&BankId=' + $('#hdnBank').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { GetInvoiceListSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function GetInvoiceListSucess(response) {

    var strHtml = '';
    for (var i = 0; i < response.length; i++) {
        strHtml += '<tr>';
        strHtml += '<td><input type="checkBox" class="clsInvoiceId" id="chk_' + i + '" vendorId=' + response[i].VendorID + '  name="' + response[i].Invoiceid + '" onchange="javascript:AsignCheckNumber();"></td>';
        strHtml += '<td><span class="clsVendor_' + response[i].VendorID + '" id="' + i + '" attr="' + response[i].VendorID + '">' + response[i].VendorName + '</span></td>';
        strHtml += '<td>' + response[i].InvoiceNumber + '</td>';
        strHtml += '<td><u><a href="#" style="color: #337ab7;" onclick="funGroup(' + i + ');"><span id="spn_' + i + '" >' + 0 + '</span><input type="text" id="txt_' + i + '" style="display:none; width:25%;" onblur="javascript:funTextblur(' + i + ');"></a></u></td>';
        strHtml += '<td>' + response[i].InvoiceDate + '</td>';
        strHtml += '<td><a href="#" ><input type"text" id="txtDate_' + i + '" class="datepicker" onclick="funGetDate();"value="' + GetDate + '" style="width:24%;" /></td>';

        var strAmount = (response[i].OriginalAmount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        strHtml += '<td><span id="spnPL_' + i + '" class="" name="' + i + '">$ </span><span class="clsAmount" id="SpnAmount_' + i + '">' + strAmount + '</span></td>';
        strHtml += '<td><input type="checkBox" id="chkClose_' + i + '" name="' + response[i].Invoiceid + '"><input type="hidden" id="CheckNo_' + i + '"/></td>';
        strHtml += '</tr>';
    }
    $('#tblInvoiceListTBody').html(strHtml);
    $(".datepicker").datepicker();
    GetCheckNumber();
}
function GetCheckNumber() {
    $.ajax({
        url: APIUrlGetCheckNumber + '?BankId=' + $('#hdnBank').val() + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { GetCheckNumberSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}
function GetCheckNumberSucess(response) {
    StrCheckNumber = response;

}
function funCheckAll() {
    var strcheckBox = $('.clsInvoiceId');
    var strval = true;
    if ($('#chkInvoiceList').is(':checked')) {
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

    AsignCheckNumber();
}
function funPostChecks() {
    var ArrInvoiceId = '';
    var strcheckBox = $('.clsInvoiceId');
    for (var i = 0; i < strcheckBox.length; i++) {
        var strId = strcheckBox[i].id;
        if ($('#' + strId).is(":checked")) {
            var strval = $('#' + strId).attr('name');
            ArrInvoiceId += strval + ',';

        }
    }
    ArrInvoiceId = ArrInvoiceId.substring(0, ArrInvoiceId.length - 1);


}

function funGroup(value) {
    var strval = $('#spn_' + value).text();
    $('#spn_' + value).hide();
    $('#txt_' + value).val(strval);
    $('#txt_' + value).show();
    $('#txt_' + value).focus();
}
function funTextblur(value) {
    var strval = $('#txt_' + value).val();
    $('#txt_' + value).hide();
    $('#spn_' + value).show();
    if (strval == '') {
        $('#spn_' + value).text(0);
    }
    else {
        $('#spn_' + value).text(strval);
    }

    AsignCheckNumber();
}

function AsignCheckNumber() {

    var strcheckBox = $('.clsInvoiceId');
    var ssstrval = true;
    for (var x = 0; x < strcheckBox.length; x++) {
        if (strcheckBox[x].checked == false) {
            $('#chkInvoiceList').prop('checked', false);
        }
    }


    strArrDetail = [];
    strTempCheck = 0;
    var Tcount = $('#tblInvoiceListTBody tr').length;
    for (var i = 0; i < Tcount; i++) {
        if ($('#chk_' + i).prop('checked') == true) {

            if (strArrDetail.length == 0) {
                strTempCheck = StrCheckNumber;
                $('#CheckNo_' + i).val(strTempCheck);

                var VendorId = $('#chk_' + i).attr('VendorId');
                var GroupNumber = $('#spn_' + i).text();
                var obj = {
                    sVendorId: VendorId,
                    sGroup: GroupNumber,
                    sCheckNumber: strTempCheck,
                    sRowNo: i
                }
                strArrDetail.push(obj);
                $('#spnPL_' + i).removeClass('');

                $('#spnPL_' + i).addClass('cls' + i);
            }
            else {
                var sTcount = strArrDetail.length;
                var VendorId = $('#chk_' + i).attr('VendorId');
                var GroupNumber = $('#spn_' + i).text();

                for (var k = 0; k < sTcount; k++) {
                    var strStatus = 0;
                    var strMvalue = 0;
                    if (strArrDetail[k].sVendorId == VendorId && strArrDetail[k].sGroup == GroupNumber) {
                        //  $('#CheckNo_' + i).val(strArrDetail[k].sCheckNumber);
                        strStatus = 0;
                        strMvalue = k;

                        $('#spnPL_' + i).removeClass('');

                        $('#spnPL_' + i).addClass('cls' + strArrDetail[k].sRowNo);
                        break;
                    }
                    else {
                        strStatus = 1;
                    }
                }
                if (strStatus == 0) {
                    $('#CheckNo_' + i).val(strArrDetail[strMvalue].sCheckNumber);

                }
                else {
                    strTempCheck++;
                    $('#CheckNo_' + i).val(strTempCheck);
                    var VendorId = $('#chk_' + i).attr('VendorId');
                    var GroupNumber = $('#spn_' + i).text();
                    var obj = {
                        sVendorId: VendorId,
                        sGroup: GroupNumber,
                        sCheckNumber: strTempCheck,
                        sRowNo: i
                    }
                    strArrDetail.push(obj);
                    $('#spnPL_' + i).removeClass('');

                    $('#spnPL_' + i).addClass('cls' + i);
                   
                }

            }

        }
    }
    if (StrCheckNumber == strTempCheck) {
        $('#SpnCheckNumberStart').text(StrCheckNumber);
    }
    else if (strTempCheck == 0) {
        $('#SpnCheckNumberStart').text('');

    }
    else {
        $('#SpnCheckNumberStart').text(StrCheckNumber + ' to ' + strTempCheck);
    }
}


function funPostChecks() {
    var ArrPayment = [];
    var ArrPaymentLine = [];
    var Tcount = strArrDetail.length;
    for (var i = 0; i < Tcount; i++) {
        var RowNo = strArrDetail[i].sRowNo;

        // Amount Sum
        var Amount = 0;
        var LineCount = $('.cls' + RowNo);
        for (var j = 0; j < LineCount.length; j++) {
            var strId = LineCount[j].id;
            var strRowId = $('#' + strId).attr('name');
            var strAoumnt = $('#SpnAmount_' + strRowId).text();
           // strAoumnt = (strAoumnt + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            strAoumnt = strAoumnt.replace(/,/g, '');
            strAoumnt = parseFloat(strAoumnt);
            Amount = Amount + strAoumnt;
        }
        Amount = (Amount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        var paymentObj = {
            Paymentid: i,
            GroupNumber: strArrDetail[i].sGroup,
            VendorId: strArrDetail[i].sVendorId,
            PaidAmount: Amount,
            CheckDate: $('#txtDate_' + RowNo).val(),
            CheckNumber: $('#CheckNo_' + RowNo).val(),
            BankId: $('#hdnBank').val(),
            Status: 'Issued',
            PayBy: 'Check',
            PaymentDate: $('#txtPaymentDate').val(),
            Memo: 'Create Memo here',
            BatchNumber: BatchManager.BatchNumber,
            ProdId: localStorage.ProdId,
            CreatedBy: localStorage.UserId
        }
        ArrPayment.push(paymentObj);


        var LineCount = $('.cls' + RowNo);

        for (var j = 0; j < LineCount.length; j++) {
            var strId = LineCount[j].id;
            var strRowId = $('#' + strId).attr('name');
            
            var objPaymentLine = {
                PaymentId: i,
                InvoiceId: $('#chk_' + strRowId).attr('name'),
                InvoiceAmount: $('#SpnAmount_' + strRowId).text(),
                CreatedBy: localStorage.UserId,
                ProdId: localStorage.ProdId
            }
            ArrPaymentLine.push(objPaymentLine);
        }
    }
    var FinalObj = {
        objPayment: ArrPayment,
        objPaymentLine: ArrPaymentLine
    }

    $.ajax({
        url: APIUrlSavePayment,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(FinalObj),
    })

      .done(function (response)
      { PostChecksSucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
}
function PostChecksSucess(response)
{
   
    GetInvoiceList();
}
//------------------------------------Show  Error 
function ShowMSG(error)
{
    console.log(error);
}