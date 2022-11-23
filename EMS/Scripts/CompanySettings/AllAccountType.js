
//-------- -  Api Calling 12/31/2015-- -----------//
var APIUrlGetAccountType = HOST + "/api/CompanySettings/GetAllAccountType";
var APIUrlSaveTaxCode = HOST + "/api/CompanySettings/SettingsTaxCodesUpsert";
var APIUrlGetTaxCodeList = HOST + "/api/CompanySettings/SettingsTaxCodeGet";

$(document).ready(function () {
    GetTaxCodeList();
})
//-------- -  GetAccountType 12/31/2015-- -----------//
function GetAccountType() {
    TabIDD = 2;
    $('#LiAccounttypebreadcrumb').text('Account Types');


    $.ajax({
        url: APIUrlGetAccountType + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
        .done(function (response)
        { GetAccountTypeByProdIdSucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
}
function ShowMSG(error) {
    console.log(error);
}
function GetAccountTypeByProdIdSucess(response) {

    var strHtml = '';
    var TCount = response.length;

    for (var i = 0; i < TCount; i++) {
        var Code = response[i].Code;
        var AccountTypeName = response[i].AccountTypeName;
        var Status = response[i].Status;
        var CheckedStatus = '';
        if (Status == true) {
            CheckedStatus = "checked";
        }
        if (Code == 'EX') {
            strHtml += '<tr style="display:none;">';
        }
        else {
            strHtml += '<tr>';
        }
        strHtml += '<td>' + Code + '</td>';
        strHtml += '<td>' + AccountTypeName + '</td>';
        strHtml += '<td><input ' + CheckedStatus + ' disabled type="checkbox" id="Chk' + Code + '" value="' + Code + '" onclick="javascript:statusUpdate(' + Code + ')";/> </td>';
        strHtml += '</tr>';
    }
    $('#newAccountTypeTBody').html(strHtml);


}
//=========================================================== Get Tax Code
function GetTaxCode() {
    $('#LiAccounttypebreadcrumb').val('Tax Code');
}
//=========================================================== Get TaxCodeList
function GetTaxCodeList() {
    $.ajax({
        url: APIUrlGetTaxCodeList + '?ProdId=' + localStorage.ProdId + '&TaxCodeId=' + 0,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',

    })

               .done(function (response)
               { GetTaxCodeListSucess(response); })
               .fail(function (error)
               { ShowMSG(error); })
}
function GetTaxCodeListSucess(response) {
    console.log(response);
    var strhtml = '';
    for (var i = 0; i < response.length; i++) {
        strhtml += '<tr>';
        strhtml += '<td class="pointerhand" onclick="javascript:funGetTaxCode(' + response[i].TaxID + ');"><a href="#">' + response[i].TaxCode + '</a></td>';
        strhtml += '<td>' + response[i].TaxDescription + '</td>';
        strhtml += '<td><input type="checkbox" disabled ' + ((response[i].Active == true)?' checked ':'');
        strhtml += '></td>';
        //if (response[i].Active == true) {
        //    strhtml += '<td><input type="checkbox" checked/></td>';
        //} else {
        //    strhtml += '<td><input type="checkbox" /></td>';
        //}
        strhtml += '</tr>';
    }
    $('#TaxCodeTbody').html(strhtml);

}

//========================================================== Save TaxCode
function funSaveTaxCode() {

    if ($('#txtTaxCode').val().trim() == '' || $('#txtTaxDescription').val().trim() == '') {
        ShowMsgBox('showMSG', 'fill detail..!!!!', '', 'failuremsg');
        return;
    }
    var obj = {
        TaxID:$('#hdnTaxId').val(),
        TaxCode: $('#txtTaxCode').val().trim(),
        TaxDescription: $('#txtTaxDescription').val().trim(),
        Active: $('#chkStatus').prop('checked'),
        Createdby: localStorage.UserId,
        ProdId: localStorage.ProdId
    }
    $.ajax({
        url: APIUrlSaveTaxCode,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
    })

                .done(function (response)
                { funSaveTaxCodeSucess(response); })
                .fail(function (error)
                { ShowMSG(error); })
}
function funSaveTaxCodeSucess(response) {
    ShowMsgBox('showMSG', 'Tax Code saved successfully...!!!', '', '');
    funClearTaxCode();
    GetTaxCodeList();
}
function funClearTaxCode() {
    $('#txtTaxCode').val('');
    $('#hdnTaxId').val(0);
    $('#txtTaxDescription').val('');
    $('#chkStatus').prop('checked', true);
}
function funGetTaxCode(TaxId)
{
    $.ajax({
        url: APIUrlGetTaxCodeList + '?ProdId=' + localStorage.ProdId + '&TaxCodeId=' + TaxId,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',

    })

              .done(function (response)
              { GetTaxCodeSucess(response); })
              .fail(function (error)
              { ShowMSG(error); })
}

function GetTaxCodeSucess(response)
{
    $('#txtTaxCode').val(response[0].TaxCode);
    $('#txtTaxDescription').val(response[0].TaxDescription);
    if (response[0].Active == true)
        $('#chkStatus').prop('checked', true);
    else
        $('#chkStatus').prop('checked', false);

    $('#hdnTaxId').val(response[0].TaxID);

}
