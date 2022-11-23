var APIUrlGetBankList = HOST + "/api/CompanySettings/GetBankInfoList";
var APIUrlGetBankDetails = HOST + "/api/CompanySettings/GetBankInfoById";
var APIUrlCheckSettingSave = HOST + "/api/CompanySettings/CheckSettingUpdate";

$(document).ready(function () {
    GetBankList();
})
//==================================== Bank List
function GetBankList() {
    $.ajax({
        url: APIUrlGetBankList + '?ProdId=' + localStorage.AdminProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { GetBankListSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function GetBankListSucess(response) {
    $('#ddlBank').html('');
    $('#ddlBank').html('<option value="0">Select</option>');

    for (var i = 0; i < response.length; i++) {
        $('#ddlBank').append('<option value=' + response[i].BankId + '>' + response[i].Bankname + '</option>');
    }
}
//==================================== Bank Detail With No
function funBankDetail() {
    $.ajax({
        url: APIUrlGetBankDetails + '?BankId=' + $('#ddlBank').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

        .done(function (response)
        { BankDetailsSucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
}
function BankDetailsSucess(response) {
   
  
    $('#txtStartingNumber').val(response[0].StartNumber);
    $('#txtEndNumber').val(response[0].EndNumber);
   
}

//================================== Bank Info Save
function funSaveBankInfo() {
   
    if ($('#ddlBank').val() != '0') {
        if ($('#txtStartingNumber').val() != '') {
            if ($('#txtEndNumber').val() != '') {
                CheckSettingSave();
            }
            else {
                $('#txtEndNumber').focus();
            }
        }
        else {
            $('#txtStartingNumber').focus();
        }
    }
    else {
        $('#ddlBank').focus();
    }

    
}

function CheckSettingSave() {

 
    $.ajax({
        url: APIUrlCheckSettingSave + '?BankId=' + $('#ddlBank').val() + '&StartNumber=' + $('#txtStartingNumber').val()
            + '&EndNumber=' + $('#txtEndNumber').val() + '&ProdId=' + localStorage.AdminProdId + '&CreatedBy=' + localStorage.AdminUserID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

      .done(function (response)
      { CheckSettingSaveSucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
}
function CheckSettingSaveSucess(response)
{
    alert('Check Setting Is Saved Successfully..');
}

$('input[id="txtStartingNumber"]').keypress(function () {
    if (this.value.length >= 8) {
        return false;
    }
});

$('input[id="txtEndNumber"]').keypress(function () {
    if (this.value.length >= 8) {
        return false;
    }
});


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
