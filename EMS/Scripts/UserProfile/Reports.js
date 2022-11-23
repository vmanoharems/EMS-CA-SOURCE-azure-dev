

//var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";

var APIUrlTranscationCodeMydef = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";

//Changes




$(document).ready(function () {
   // GetTransactionCode()
    GetTransactionCodeDefaults();
  //  alert('hello vivek');

});

//==========Global Variables============//
var GetcomapnyforMdefaults = [];
var varGetBankName = [];
var strCheckEpisode = [];
var StrCheckTransactionCodes = [];


//----------- Focus Event------------------//


$('#txtCompanyMyDef').focus(function () {
    FillCompany();
})
$('#txtCurrency').focus(function () {
    FillCurrency();
})

$('#txtBankMyDefaults').focus(function () {
    FillBank();
})
$('#txtEpisode').focus(function(){
    AutofillEpisode('Episode');
})
$('#txtModuleMyDefName').click(function () {
    FillModuleNameMyDef();
})
$('#txtSubModuledefName').focus(function () {
    value = $('#txtModuleMyDefName').attr('name');
    FillSubModuleNameMydef(value);
  })

// -------------------------------------------------- Get Transaction Code Table
function GetTransactionCodeDefaults() {
    $.ajax({
        url: APIUrlGetTransactionCodeDef + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { GetTransactionCodeByProdidSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetTransactionCodeByProdidSucess(response) {
    StrCheckTransactionCodes = [];
    StrCheckTransactionCodes = response;
    var strHtml = '';
    // var Value = 0;
    var Tcount = response.length;
    for (i = 0; i < Tcount; i++) {
        var TrasactionCode = response[i].TransCode;
        var TransactionCodeID = response[i].TransactionCodeID;
        strHtml += '<tr id="Tr_' + TransactionCodeID + '">';
        strHtml += '<td>' + TrasactionCode + '</td>';
        strHtml += '<td style="display:none;"><input type="hidden" id="hdnCode_' + TransactionCodeID + '" value=' + TransactionCodeID + '></td>';
        strHtml += '<td><input type="text" id="TRValue_' + TransactionCodeID + '" name="' + TransactionCodeID + '_' + i + '" class="SearchTranscationCode"  onfocus="javascript:GetTranscationCode(' + TransactionCodeID + ',' + i + ');" onblur="javascript:funCheckTransCode(' + TransactionCodeID + ');"/>';
        strHtml += '<input type="hidden"/ id="hdn_' + TransactionCodeID + '" class="clsCheckValue"></td>';
        strHtml += '</tr>';
    }
    $('#TblTransactionCodeByProdIdTbody').html(strHtml);
}
$('#TblTransactionCode').delegate('.SearchTranscationCode', 'focus', function () {
    var currentId = $(this).attr("name");
    var res = currentId.split("_");
    // alert(res[0]+'    '+ res[1] + ' dele');
    GetTranscationCode(res[0], res[1]);
})
function GetTranscationCode(value, i) {
    // alert(value + ' ' + i + ' fun');

    $.ajax({
        url: APIUrlTranscationCodeMydef + '?TransactionCodeID=' + value,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { GetTranscationCodeSucess(response, value, i); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetTranscationCodeSucess(response, value, i) {
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchTranscationCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $('#hdn_' + value).val(ui.item.value);
            $("#TRValue_" + value).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $('#hdn_' + value).val(ui.item.value);
            $("#TRValue_" + value).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$('#hdn_' + value).val('');
                //$("#TRValue_" + value).val('');
            }
        }
    })
}



//----------Fill CompanyCode-----------//   
function FillCompany() {
    $.ajax({
        url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
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
    GetcomapnyforMdefaults = [];
    GetcomapnyforMdefaults = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CompanyID,
            label: m.CompanyCode,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchCompnayCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnCompanyMyDef").val(ui.item.value);
            $('#txtCompanyMyDef').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnCompanyMyDef").val(ui.item.value);
            $('#txtCompanyMyDef').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnCompanyMyDef").val('');
                //$('#txtCompanyMyDef  ').val('');
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
        url: APIUrlBankListByCompanyId + '?ProdId=' + localStorage.ProdId,
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
    varGetBankName = [];
    varGetBankName = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.BankId,
            label: m.Bankname,
            //  BuyerId: m.BuyerId,

        };
    });
    $(".SearchBankDefault").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnBankMyDefaults").val(ui.item.value);
            $('#txtBankMyDefaults').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBankMyDefaults").val(ui.item.value);
            $('#txtBankMyDefaults').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnBankMyDefaults").val('');
                //$('#txtBankMyDefaults').val('');
            }
        }
    })
}
//------------------------------------------------------- Save Button
$('#btnUserSave').click(function () {
    var isvalid = "";
    isvalid += CheckRequired($("#txtUserName"));
    isvalid += CheckRequired($("#txtUserEmail"));
    isvalid += CheckRequired($("#txtUserTitle"));

    if (isvalid == "") {

        funUserAdminSave();

    }

})


//--------------------------------------------------- Error MSG
function ShowMSG(error) {
    console.log(error);
}


//-----------------FillEpisode---------------------//
function AutofillEpisode(value) {
   
    $.ajax({
        url: APIUrlGetEpisodeByProdId + '?ProdId=' + localStorage.ProdId + '&Classification=' + value,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
        .done(function (response)
        { AutofillEpisodeSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })

}
function AutofillEpisodeSucess(response) {
    strCheckEpisode = [];
    strCheckEpisode = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.AccountId,
            label: m.AccountCode,

        };
    });
    $(".SearchEpisode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnEpisode").val(ui.item.value);
            $('#txtEpisode').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnEpisode").val(ui.item.value);
            $('#txtEpisode').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnEpisode").val('');
                //$('#txtEpisode').val('');
            }
        }
    })
}



//-==================Module Name==================//
//function FillModuleNameMyDef() {
//    $.ajax({
//        url: APIUrlFillMydefModuleName + '?ModuleId=' + 0,
//        cache: false,
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },
//        type: 'POST',

//        contentType: 'application/json; charset=utf-8',
//    })

//     .done(function (response)
//     { FillMyDefModuleNameSucess(response); })
//     .fail(function (error)
//     { ShowMSG(error); })

//}
//function FillMyDefModuleNameSucess(response) {
//    $('#txtModuleMyDefName').val('');
//    $('#hdnModuleMyDefName').val('');
//    var ProductListjson = response;
//    var array = response.error ? [] : $.map(response, function (m) {
//        return {
//            value: m.ModuleId,
//            label: m.ModuleName,
//            //  BuyerId: m.BuyerId,
//        };
//    });
//    $(".SearchModuleMyDefName").autocomplete({
//        minLength: 0,
//        source: array,
//        focus: function (event, ui) {

//            $("#hdnModuleMyDefName").val(ui.item.value);
//            $('#txtModuleMyDefName').val(ui.item.label);
//            return false;
//        },
//        select: function (event, ui) {

//            $("#hdnModuleMyDefName").val(ui.item.value);
//            $('#txtModuleMyDefName').val(ui.item.label);
//            return false;
//        },
//        change: function (event, ui) {
//            if (!ui.item) {
//                //$(this).val('');
//                //// $('#f').val('');
//                //$("#hdnModuleId").val('');
//                //$('#txtModuleMyDefName').val('');
//            }
//        }
//    })
//}



////=============== Module Sub Name======================//
//function FillSubModuleNameMydef() {
//    var strSubModuleId = $('#hdnModuleMyDefName').val();
//    // alert(strModuleId);
//    $.ajax({
//        url: APIUrlFillMydefModuleName + '?ModuleId=' + strSubModuleId,
//        cache: false,
//        type: 'POST',
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },

//        contentType: 'application/json; charset=utf-8',
//    })

//  .done(function (response)
//  { FillSubModuleNameMyDefaultSucess(response); })
//  .fail(function (error)
//  { ShowMSG(error); })
//}
//function FillSubModuleNameMyDefaultSucess(response) {
//    var array = [];

//    // $('#txtSubModuleName').prop('disabled', false);
//    var ProductListjson = response;
//    array = response.error ? [] : $.map(response, function (m) {
//        return {
//            value: m.ModuleId,
//            label: m.ModuleName,
//            //  BuyerId: m.BuyerId,
//        };
//    });
//    $(".SearchSubModuleMyDefName").autocomplete({
//        minLength: 0,
//        source: array,
//        focus: function (event, ui) {

//            $("#hdnSubModuledefName").val(ui.item.value);
//            $('#txtSubModuledefName').val(ui.item.label);
//            return false;
//        },
//        select: function (event, ui) {

//            $("#hdnSubModuledefName").val(ui.item.value);
//            $('#txtSubModuledefName').val(ui.item.label);
//            return false;
//        },
//        change: function (event, ui) {
//            if (!ui.item) {
//                $(this).val('');
//                // $('#f').val('');
//                $("#hdnsubmoduledefname").val('');
//                $('#txtsubmoduledefname  ').val('');


//            }
//        }
//    })

//}
//================Check CompanyCode==================//
$('#txtCompanyMyDef').blur(function ()
{
    //alert('');
    var StrGetCompany = $('#txtCompanyMyDef').val().trim();
    if (StrGetCompany != '')
    {
        for (var i = 0; i < GetcomapnyforMdefaults.length; i++)
        {
            if (GetcomapnyforMdefaults[i].CompanyCode == StrGetCompany)
            {

                $('#hdnCompanyMyDef ').val(GetcomapnyforMdefaults[i].CompanyID);
                $('#txtCompanyMyDef').val(GetcomapnyforMdefaults[i].CompanyCode);
                break;
            }
            else
            {
                $('#hdnCompanyMyDef').val('');
                $('#txtCompanyMyDef').val('');

            }
        }
        for (var i = 0; i < GetcomapnyforMdefaults.length; ++i)
        {
            if (GetcomapnyforMdefaults[i].CompanyCode.substring(0,StrGetCompany.length) === StrGetCompany)
            {
                $('#hdnCompanyMyDef ').val(GetcomapnyforMdefaults[i].CompanyID);
                $('#txtCompanyMyDef').val(GetcomapnyforMdefaults[i].CompanyCode);
                break;
            }
        }
    }
    else
    {
        $('#hdnCompanyMyDef ').val(GetcomapnyforMdefaults[0].CompanyID);
        $('#txtCompanyMyDef').val(GetcomapnyforMdefaults[0].CompanyCode);
    }

})

//=============== Check Bank==========================//

$('#txtBankMyDefaults').blur(function ()
{
    var StrAddCheckBanks = $('#txtBankMyDefaults').val().trim();
    if (StrAddCheckBanks != '')
    {
        for (var i = 0; i < varGetBankName.length; i++)
        {
            if (varGetBankName[i].Bankname == StrAddCheckBanks)
            {
                $('#hdnBankMyDefaults').val(varGetBankName[i].BankId);
                $('#txtBankMyDefaults').val(varGetBankName[i].Bankname);
                break;
            }
            else
            {
                $('#hdnBankMyDefaults').val(' ');
                $('#txtBankMyDefaults').val('');
            }
        }
        for (var i = 0; i < varGetBankName.length; i++)
        {
            if (varGetBankName[i].Bankname.substring(0, StrAddCheckBanks.length) === StrAddCheckBanks)
            {
                $('#hdnBankMyDefaults').val(varGetBankName[i].BankId);
                $('#txtBankMyDefaults').val(varGetBankName[i].Bankname);
                break;
            }
        }
    }
    else
    {
        $('#hdnBankMyDefaults').val(varGetBankName[0].BankId);
        $('#txtBankMyDefaults').val(varGetBankName[0].Bankname);
    }
})

//==============CheckEpisode================//

$('#txtEpisode').blur(function ()
{
    var StrAddCheckEpisode = $('#txtEpisode').val().trim();
    if (StrAddCheckEpisode != '')
    {
        for (var i = 0; i < strCheckEpisode.length; i++) {
            if (strCheckEpisode[i].AccountCode == StrAddCheckEpisode) {
                $('#hdnEpisode').val(strCheckEpisode[i].AccountId);
                $('#txtEpisode').val(strCheckEpisode[i].AccountCode);
                break;
            }
            else {
                $('#hdnEpisode').val(' ');
                $('#txtEpisode').val('');
            }
        }
        for (var i = 0; i < strCheckEpisode.length; ++i) {
            if (strCheckEpisode[i].AccountCode.substring(0, StrAddCheckEpisode.length) === StrAddCheckEpisode) {
                $('#hdnEpisode').val(strCheckEpisode[i].AccountId);
                $('#txtEpisode').val(strCheckEpisode[i].AccountCode);
                break;
            }
        }
    }
    else {
        $('#hdnEpisode').val(strCheckEpisode[0].AccountId);
        $('#txtEpisode').val(strCheckEpisode[0].AccountCode);
    }
})

//==============CheckTransactionCodes=======================//

function funCheckTransCode(value)
{
    var StrCheckTransCode = $('#TRValue_' + value).val();
    // alert(StrCheckTransCode);
    if (StrCheckTransCode != '') {
     
        for (var i = 0; i < StrCheckTransactionCodes.length; i++)
        {
            if (StrCheckTransactionCodes[i].TransValue == StrCheckTransCode)
            {
                $('#TRValue_' + value).val(StrCheckTransactionCodes[i].TransValue);
                $('#hdn_' + value).val(StrCheckTransactionCodes[i].TransactionValueID);
                break;
            }
            else
            {
                $('#hdn_' + value).val(' ');
                $('#TRValue_' + value).val('');

            }
        }

        for (var i = 0; i < StrCheckTransactionCodes.length; ++i)
        {
            if (StrCheckTransactionCodes[i].TransValue.substring(0, StrCheckTransCode.length) === StrCheckTransCode)
            {
                $('#TRValue_' + value).val(StrCheckTransactionCodes[i].TransValue);
                $('#hdn_' + value).val(StrCheckTransactionCodes[i].TransactionValueID);
                break;
            }
        }
    }
    else
    {
        $('#TRValue_' + value).val(StrCheckTransactionCodes[0].TransValue);
        $('#hdn_' + value).val(StrCheckTransactionCodes[0].TransactionValueID);

    }
}

//============CheckModuleName===========//

function FillModuleNameMyDef() {
    $.ajax({
        url: APIUrlFillMydefModuleName + '?ModuleId=' + 0,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { FillMyDefModuleNameSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })

}
function FillMyDefModuleNameSucess(response) {
   // $('#txtModuleMyDefName').val('');
   // $('#hdnModuleMyDefName').val('');
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ModuleId,
            label: m.ModuleName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchModuleMyDefName").autocomplete({
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
                //$(this).val('');
                //$(this).removeAttr('name');

            }
        }
    })
}



//=============== Module Sub Name======================//
function FillSubModuleNameMydef(value) {
  //  var strSubModuleId = $('#hdnModuleMyDefName').val();
    // alert(strModuleId);
    
    $.ajax({
        url: APIUrlFillMydefModuleName + '?ModuleId=' + value,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },

        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { FillSubModuleNameMyDefaultSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function FillSubModuleNameMyDefaultSucess(response) {
    var array = [];

    // $('#txtSubModuleName').prop('disabled', false);
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ModuleId,
            label: m.ModuleName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchSubModuleMyDefName").autocomplete({
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
                //$(this).val('');
                //$(this).removeAttr('name');

            }
        }
    })

}


