        
var APIUrlBankListAPByProdId = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlFillCompanyAP = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillVendorAP = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlInsertUpdateAP = HOST + "/api/UserProfile/InsertUpdateUserProfileAP";

var APIUrlGetUserProfileDetail = HOST + "/api/UserProfile/GetUserProfileInfoByProdid";

var StrUserProfileAPID = 0;
var strCurrentTab = 'PayInvoices';

$(document).ready(function () {
   // GetTransactionCode()
    //  alert('hello vivek');
  //  funGetUserProfileApInfo();
    ShowPayInvoice();

});

//----------- Focus Event------------------//

$('#txtCompanyPaymtInvc').focus(function () {
    FillCompanyAP();
})
$('#txtCompanyAP2').focus(function () {
    FillCompanyAP();
})
$('#btnSaveAP').click(function () {
    if (strCurrentTab = 'PayInvoices') {
        funInsertUserAP();
    }
    else
    {
        funInsertPaymentHistory();
    }
})

$('#txtBankPymntInvc').focus(function () {
    FillBank();
})
$('#txtCompanyBank2').focus(function () {
    FillBank();
})
$('#txtVendor').focus(function () {
    FillVendorAP();
})
$('#txtVendorPh').focus(function () {
    FillVendorAP();
})

//----------Fill CompanyCode-----------//   
function FillCompanyAP() {
    $.ajax({
        url: APIUrlFillCompanyAP + '?ProdId=' + localStorage.ProdId,
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
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CompanyID,
            label: m.CompanyCode,
        };
    });
    $(".SearchAPCompnayCode").autocomplete({
        minLength: 0,
        source: array,
   
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name',ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $(this).removeAttr('name');

            }
        }
    })
}
//-----------------Fill  Currency ----------------//
function FillCurrency() {
    $.ajax({
        url: APIUrlFillCurrency + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { FillCurrencySucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function FillCurrencySucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CurrencyID,
            label: m.CurrencyName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchCurrency").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnCurrency").val(ui.item.value);
            $('#txtCurrency').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnCurrency").val(ui.item.value);
            $('#txtCurrency').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                $("#hdnCurrency").val('');
                $('#txtCurrency  ').val('');
            }
        }
    })
}


//--------------------------------------------------- Bank
function FillBank() {
    $.ajax({
        url: APIUrlBankListAPByProdId + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillBankSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillBankSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.BankId,
            label: m.Bankname,
            //  BuyerId: m.BuyerId,

        };
    });
    $(".SearchBankAP").autocomplete({
     minLength: 0,
     source: array,
     focus: function (event, ui)
    {
        $(this).val(ui.item.label);
        $(this).attr('name', ui.item.value);
        return false;
    },
    select: function (event, ui)
    {
        $(this).val(ui.item.label);
        $(this).attr('name', ui.item.value);
        return false;
    },
    change: function (event, ui)
    {
        if (!ui.item) {
            $(this).val('');
            $(this).removeAttr('name');

        }       
    }
  })
}
//------------------------------------------------------- Save Button


//--------------------------------------------------- Error MSG
function ShowMSG(error) {
    console.log(error);
}

//-----------------FillVendor---------------------//
function FillVendorAP() {
    $.ajax({
        //url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
        url: APIUrlFillVendorAP + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillVendorSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillVendorSucess(response) {
    CheckVendornameAddInvc = [];
    CheckVendornameAddInvc = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
        
        };
    });


    $(".VendorCodeAP").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $(this).removeAttr('name');

            }
        }
    })
}

//=================InsertUserProfileAP================//
function funInsertUserAP() {
    var strUserPayType = 'PayInvoices';
    var ObjUserInfo = {
        UserProfileAPID: StrUserProfileAPID,
        Company: $('#txtCompanyPaymtInvc').val(),
        Currency: $('#txtCurrency').val(),
        BankInfo: $('#txtBankPymntInvc').val(),
        PaymentType: $('#txtPaymentType').val(),
        FromDate: $('#txtFromdate').val(),
        ToDate: $('#txtToDate').val(),
        Vendor: $('#txtVendor').val(),
        BatchNumber: $('#txtBatchNo').val(),
        UserID: localStorage.UserId,
        APType: strUserPayType,
        ProdId:localStorage.ProdId,
        CreatedBy:localStorage.UserId     
    }
        $.ajax({
            url: APIUrlInsertUpdateAP,
            cache: false,
  
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjUserInfo),

        })
              .done(function (response)
              { funInsertUserAPSucess(response); })
              .fail(function (error)
              { ShowMSG(error); })
    }

function funInsertUserAPSucess(response) {
    ShowMsgBox('showMSG', 'Payment Information Saved ..!!', '', '');
  //  location.reload('true');
}

//===========InsertUpdatePaymentHistory===========//
function funInsertPaymentHistory() {
    var strUserPayType = 'PaymentHistory';
    var ObjUserPayType = {
        UserProfileAPID: StrUserProfileAPID,
        Company: $('#txtCompanyAP2').val(),
        Currency: 'USD',
        BankInfo: $('#txtCompanyBank2').val(),
        PaymentType: $('#txtPaymentHistory').val(),
        FromDate: $('#txtPHFromdate').val(),
        ToDate: $('#txtPHdateTo').val(),
        Vendor: $('#txtVendorPh').val(),
        BatchNumber: $('#txtBatchNoPHistory').val(),
        UserID: localStorage.UserId,
        APType: strUserPayType,
        ProdId: localStorage.ProdId,
        CreatedBy: localStorage.UserId
    }
    $.ajax({
        url: APIUrlInsertUpdateAP,
        cache: false,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjUserPayType),

    })
          .done(function (response)
          { funInsertPaymentHistorySucess(response); })
          .fail(function (error)
          { ShowMSG(error); })
}

function funInsertPaymentHistorySucess(response) {
    ShowMsgBox('showMSG', 'Payment History Information Saved ..!!', '', '');
    //  location.reload('true');
}

//===================GetUserProfileInfo=================//

//==============getvendorNumber==================//
function funGetUserProfileApInfo() {
    var strAPType = 'PayInvoices';
    $.ajax({
        url: APIUrlGetUserProfileDetail + '?ProdId=' + localStorage.ProdId + '&APType=' + strAPType + '&UserID=' + localStorage.UserId,
        cache: false,
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { funGetUserProfileApInfoSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function funGetUserProfileApInfoSucess(response) {
    //alert('');
    $('#txtCompanyPaymtInvc').val(response[0].Company);
    $('#txtCurrency').val(response[0].Currency);
    $('#txtBankPymntInvc').val(response[0].BankInfo);
    $('#txtPaymentType').val(response[0].PaymentType);
    $('#txtFromdate').val(response[0].FromDate);
    $('#txtToDate').val(response[0].ToDate);
    $('#txtVendor').val(response[0].Vendor);
    $('#txtBatchNo').val(response[0].BatchNumber);

}

//===============getpaymentHistory=============//
function funGetUserProfilePayment() {
    var strAPType = 'PaymentHistory';
    $.ajax({
        url: APIUrlGetUserProfileDetail + '?ProdId=' + localStorage.ProdId + '&APType=' + strAPType + '&UserID=' + localStorage.UserId,
        cache: false,
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { funGetUserProfilePaymentSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function funGetUserProfilePaymentSucess(response) {
    //alert('');
    $('#txtCompanyAP2').val(response[0].Company);
    $('#').val(response[0].Currency);
    $('#txtCompanyBank2').val(response[0].BankInfo);
    $('#txtPaymentHistory').val(response[0].PaymentType);
    $('#txtPHFromdate').val(response[0].FromDate);
    $('#txtPHdateTo').val(response[0].ToDate);
    $('#txtVendorPh').val(response[0].Vendor);
    $('#txtBatchNoPHistory').val(response[0].BatchNumber);

}

function ShowPayInvoice()
{
    $('#tabPayInvoices').attr('style', 'display:block;');
    $('#tabPaymentHistory').attr('style', 'display:none;');
    $('#btnSaveAP').attr('style','display:block;');
    $('#btnSavePaymentH').attr('style','display:none;');
    $('#LiPayInvoice').addClass('active');
    $('#LiPaymentHistory').removeClass('active');

    funGetUserProfileApInfo();
}

function ShowPaymentHistory() {
    $('#LiPayInvoice').removeClass('active');
    $('#LiPaymentHistory').addClass('active');
    $('#btnSaveAP').attr('style', 'display:none;');
    $('#btnSavePaymentH').attr('style', 'display:block;');
    $('#tabPayInvoices').attr('style', 'display:none;');
    $('#tabPaymentHistory').attr('style', 'display:block;');
    funGetUserProfilePayment();
}

