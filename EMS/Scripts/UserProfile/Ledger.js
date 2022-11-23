
var APIUrlFillCompanyforledger = HOST + "/api/CompanySettings/GetCompanyList";

//=========Global variable====================//

$(document).ready(function () {

});


//----------- Focus Event------------------//


$('#txtLedgerCompany').focus(function () {
    FillCompanyForLedger();
})

//----------Fill CompanyCode-----------//   
function FillCompanyForLedger() {
    $.ajax({
        url: APIUrlFillCompanyforledger + '?ProdId=' + localStorage.ProdId,
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
    $(".SearchCompnayCodeLedger").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnLedgerCompany").val(ui.item.value);
            $('#txtLedgerCompany').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnLedgerCompany").val(ui.item.value);
            $('#txtLedgerCompany').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $("#hdnLedgerCompany").val('');
                $('#txtLedgerCompany  ').val('');
            }
        }
    })
}

//================== Error MSG=========================//
function ShowMSG(error) {
    console.log(error);
}


