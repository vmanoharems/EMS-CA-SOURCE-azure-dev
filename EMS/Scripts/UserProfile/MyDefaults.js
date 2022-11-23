


//var APIUrlBankListByCompanyId = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlBankListByCompanyId = HOST + "/api/Payroll/GetBankInfoPayroll";

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetEpisodeByProdId = HOST + "/api/BudgetOperation/GetAccountNameForBudget";

var APIUrlFillMydefModuleName = HOST + "/api/CompanySettings/GetModuleDetailsByModuleId";
var APIUrlGetTransactionCodeDef = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlTranscationCodeMydef = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlGetModuleDefaultsByGroupId = HOST + "/api/UserProfile/GetModuleTreeforgroup";
var APIUrlGetMyDefaultsInfo = HOST + "/api/UserProfile/GetMyDefaultsByProdId";

var APIUrlInsertupdateMyDefaultUser = HOST + "/api/UserProfile/InsertUpdateMyDefaultUserProfile";

var APIUrlGetTrascationMyDefault = HOST + "/api/CompanySettings/GetTransactionDefaultListByUserId";

$(document).ready(function ()
{
    GetTransactionCodeDefaults();
    GetMyDefaultsInfo();
});

//==========Global Variables============//
var GetcomapnyforMdefaults = [];
var varGetBankName = [];
var strCheckEpisode = [];
var StrCheckTransactionCodes = [];
var GetSubModuleStr = [];
var GetSubSubModuleStr = [];
var strUserIdAdmin = 0;
var ModuleNameDef = "";
var StrGetModuleName = [];
var StrGetSubModuleName = [];


//----------- Focus Event------------------//


$('#txtCompanyMyDef').focus(function ()
{
    FillCompany();
})
$('#txtCurrency').focus(function ()
{
    FillCurrency();
})

$('#txtBankMyDefaults').focus(function ()
{
    var strCompanyId = $('#hdnCompanyMyDef').val().trim();
    FillBank(strCompanyId);
})
$('#txtEpisode').focus(function ()
{
    AutofillEpisode('Episode');
})
$('#txtModuleMyDefName').click(function () {
    FillModuleNameMyDef();
})
$('#txtSubModuledefName').focus(function ()
{
    value = $('#txtModuleMyDefName').attr('name');
    FillSubModuleNameMydef(value);
})

$('#txtPendingInvoices').focus(function ()
{
    value = $('#txtSubModuledefName').attr('name');
    FillSubSubModuleNameMydef(value);
})

//================OnChangeFunction=================//
// -------------------------------------------------- Get Transaction Code Table
function GetTransactionCodeDefaults()
{
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
function GetTransactionCodeByProdidSucess(response)
{
    var strHtml = '';
    var Tcount = response.length;
    for (i = 0; i < Tcount; i++)
    {
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
    GetTrascationMyDefault();
}
$('#TblTransactionCode').delegate('.SearchTranscationCode', 'focus', function ()
{
    var currentId = $(this).attr("name");
    var res = currentId.split("_");
    GetTranscationCode(res[0], res[1]);
})
function GetTranscationCode(value, i)
{
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
function GetTranscationCodeSucess(response, value, i)
{
    StrCheckTransactionCodes = [];
    StrCheckTransactionCodes = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
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
function FillCompany()
{
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
function FillCompanySucess(response)
{
    GetcomapnyforMdefaults = [];
    GetcomapnyforMdefaults = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CompanyID,
            label: m.CompanyCode,
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
                $(this).val('');
                // $('#f').val('');
                $("#hdnCompanyMyDef").val('');
                $('#txtCompanyMyDef  ').val('');
            }
        }
    })
}
//-----------------Fill  Currency ----------------//
function FillCurrency()
{
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
function FillBank(strCompanyId) {  
    $.ajax({
        //url: APIUrlBankListByCompanyId + '?ProdId=' + localStorage.ProdId,
        // url: APIUrlBankListByCompanyId + '?ProdId=' + localStorage.ProdId + '&CompanyID=' + strCompanyId,
        url: APIUrlBankListByCompanyId + '?CompanyID=' + strCompanyId + '&ProdId=' + localStorage.ProdId,
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


//================Check CompanyCode==================//
//$('#txtCompanyMyDef').blur(function ()
//{
//    var StrGetCompany = $('#txtCompanyMyDef').val().trim();
//    if (StrGetCompany != '')
//    {
//        for (var i = 0; i < GetcomapnyforMdefaults.length; i++)
//        {
//            if (GetcomapnyforMdefaults[i].CompanyCode == StrGetCompany)
//            {

//                $('#hdnCompanyMyDef ').val(GetcomapnyforMdefaults[i].CompanyID);
//                $('#txtCompanyMyDef').val(GetcomapnyforMdefaults[i].CompanyCode);
//                break;
//            }
//            else
//            {
//                $('#hdnCompanyMyDef').val('');
//                $('#txtCompanyMyDef').val('');

//            }
//        }
//        for (var i = 0; i < GetcomapnyforMdefaults.length; ++i)
//        {
//            if (GetcomapnyforMdefaults[i].CompanyCode.substring(0,StrGetCompany.length) === StrGetCompany)
//            {
//                $('#hdnCompanyMyDef ').val(GetcomapnyforMdefaults[i].CompanyID);
//                $('#txtCompanyMyDef').val(GetcomapnyforMdefaults[i].CompanyCode);
//                break;
//            }
//        }
//    }
//    else
//    {
//        $('#hdnCompanyMyDef ').val(GetcomapnyforMdefaults[0].CompanyID);
//        $('#txtCompanyMyDef').val(GetcomapnyforMdefaults[0].CompanyCode);
//    }

//})

//=============== Check Bank==========================//

//$('#txtBankMyDefaults').blur(function ()
//{
//    var StrAddCheckBanks = $('#txtBankMyDefaults').val().trim();
//    if (StrAddCheckBanks != '')
//    {
//        for (var i = 0; i < varGetBankName.length; i++)
//        {
//            if (varGetBankName[i].Bankname == StrAddCheckBanks)
//            {
//                $('#hdnBankMyDefaults').val(varGetBankName[i].BankId);
//                $('#txtBankMyDefaults').val(varGetBankName[i].Bankname);
//                break;
//            }
//            else
//            {
//                $('#hdnBankMyDefaults').val(' ');
//                $('#txtBankMyDefaults').val('');
//            }
//        }
//        for (var i = 0; i < varGetBankName.length; i++)
//        {
//            if (varGetBankName[i].Bankname.substring(0, StrAddCheckBanks.length) === StrAddCheckBanks)
//            {
//                $('#hdnBankMyDefaults').val(varGetBankName[i].BankId);
//                $('#txtBankMyDefaults').val(varGetBankName[i].Bankname);
//                break;
//            }
//        }
//    }
//    else
//    {
//        $('#hdnBankMyDefaults').val(varGetBankName[0].BankId);
//        $('#txtBankMyDefaults').val(varGetBankName[0].Bankname);
//    }
//})

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
function FillMyDefModuleNameSucess(response)
{
    StrGetModuleName = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ModuleId,
            label: m.ModuleName,
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
function FillSubModuleNameMydef(value)
{
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
  { FillSubModuleNameMyDefaultSucess(response, value); })
  .fail(function (error)
  { ShowMSG(error); })
}
function FillSubModuleNameMyDefaultSucess(response, value)
{
    StrGetSubModuleName = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ModuleId,
            label: m.ModuleName,
        };
    });
    $(".SearchSubModuleMyDefName").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            return false;
            $('#txtScrren_' + value).attr('name', ui.item.value);
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            $('#txtScrren_' + value).attr('name', ui.item.value);
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
//=============Module Sub-sub Name=====================//

function FillSubSubModuleNameMydef(strvalue)
{
    $.ajax({
        url: APIUrlFillMydefModuleName + '?ModuleId=' + strvalue,
        cache: false, 
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { FillSubSubModuleNameMyDefaultSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function FillSubSubModuleNameMyDefaultSucess(response) {
    StrGetPendingModuleName = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ModuleId,
            label: m.ModuleName,
     
        };
    });
    $(".SearchSubSubModuleMyDefName").autocomplete({
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

//================InsertUpdateMy defaults======================//
   $('#BtnInsertMydefaults').click(function () {
       funMyDefaultSave();
   })

//==================GetModule===================//

   //function GetModuleDefaults() {

   //    $.ajax({
   //        url: APIUrlGetModuleDefaultsByGroupId + '?GroupId=' +0,
   //        cache: false,
   //        beforeSend: function (request) {
   //            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
   //        },
   //        type: 'GET',
   //        contentType: 'application/json; charset=utf-8',
   //    })

   //     .done(function (response)
   //     { GetModuleDefaultsSucess(response); })
   //     .fail(function (error)
   //     { ShowMSG(error); })
   //}
   //function GetModuleDefaultsSucess(response) {

   //    var strHtml = '';
   //    // var Value = 0;
   //    var TCount = response.length;
   //        for (var i = 0; i < TCount; i++) {
   //            var Title = response[i].Title;
   //            var ModuleNameDef = response[i].ModuleName;
   //            var ModuleLevelDef = response[i].Modulelevel;
   //            var ChildrenDef = response[i].ChildCount;
   //            var ParentIdDef = response[i].PARENT; 
   //            var MdouleIdDef = response[i].CHILD;
   //            if (ChildrenDef != 0) {
   //                strHtml += '<tr id="Tr_">';
   //                if (ParentIdDef == 0) {
   //                    strHtml += '<td><span class="myclass" onclick="#" id="spn_' + MdouleIdDef + '"   style="font-size:14px;" >' + ModuleNameDef + '</span></td>';
   //                    //class="fa fa-caret-right"
   //                    strHtml += '<td><input type="text" id="txt_' + MdouleIdDef + '" onfocus="FillSubModuleNameMydef(' + MdouleIdDef + ');" class ="SearchSubModuleMyDefName clsCheckValueOfSub"></td>';
                      
   //                    strHtml += '<td><input type="text" id="txtScrren_' + MdouleIdDef + '" onfocus="fillScrrenval(' + MdouleIdDef + ');"class ="SearchfillScrrenval clsCheckValueOfSub"></td>';


   //                }
   //                //  strHtml += '<td><a href="#"> Edit</a></td>';
   //              //  strHtml += '<td><select id="ddlMId_' + MdouleId + '" </td>';
   //            }
   //        }
   //        $('#TblModuleTBodyMyDefault').html(strHtml);
   //}

   function fillScrrenval(value)
   {
       var strval = $('#txtScrren_' + value).attr('name');
       $.ajax({
           url: APIUrlFillMydefModuleName + '?ModuleId=' + strval,
           cache: false,
           type: 'POST',
           beforeSend: function (request) {
               request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
           },

           contentType: 'application/json; charset=utf-8',
       })

 .done(function (response)
 { fillScrrenvalSucess(response, value); })
 .fail(function (error)
 { ShowMSG(error); })
   }
   function fillScrrenvalSucess(response, value) {
       
       var array = [];
       var ProductListjson = response;
       array = response.error ? [] : $.map(response, function (m) {
           return {
               value: m.ModuleId,
               label: m.ModuleName,
               //  BuyerId: m.BuyerId,
           };
       });
       $(".SearchfillScrrenval").autocomplete({
           minLength: 0,
           source: array,
           focus: function (event, ui) {
               $(this).val(ui.item.label);
               $(this).attr('name', ui.item.value);
               return false;
            //   $('#txtScrren_' + value).attr('name', ui.item.value);
           },
           select: function (event, ui) {

               $(this).val(ui.item.label);
               $(this).attr('name', ui.item.value);
             //  $('#txtScrren_' + value).attr('name', ui.item.value);


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

//==========================Check StartScreen=========================//

   //=================CheckModuleName======================//
   $('#txtModuleMyDefName').blur(function () {
       
       var StrCheckModuleMy = $('#txtModuleMyDefName').val().trim();
       if (StrCheckModuleMy != '') {

           for (var i = 0; i < StrGetModuleName.length; i++) {
               if ((StrGetModuleName[i].ModuleName).toLowerCase() == StrCheckModuleMy.toLowerCase()) {
              
                   $('#txtModuleMyDefName').attr('name', StrGetModuleName[i].ModuleId);
                   $('#txtModuleMyDefName').val(StrGetModuleName[i].ModuleName);
                   break;
               }
               else {
               
                   $('#txtModuleMyDefName').val('');
                   $('#txtModuleMyDefName').removeAttr('name');

               }
           }
           for (var i = 0; i < StrGetModuleName.length; ++i) {
               if (StrGetModuleName[i].ModuleName.substring(0, StrCheckModuleMy.length).toLowerCase() === StrCheckModuleMy.toLowerCase()) {
               
                   $('#txtModuleMyDefName').attr('name', StrGetModuleName[i].ModuleId);
                   $('#txtModuleMyDefName').val(StrGetModuleName[i].ModuleName);
               }
           }
       }
       else {       
           $('#txtModuleMyDefName').attr('name', StrGetModuleName[0].ModuleId);
           $('#txtModuleMyDefName').val(StrGetModuleName[0].ModuleName);

         //  $('#hdnModuleId').val(StrModuleName[0].ModuleId);
       }
   })

   //===============CheckSubModule======================//
   $('#txtSubModuledefName').blur(function ()
   {
       var StrCheckSubModule = $('#txtSubModuledefName').val().trim();
       if (StrCheckSubModule != '') {

           for (var i = 0; i < StrGetSubModuleName.length; i++) {
               if ((StrGetSubModuleName[i].ModuleName).toLowerCase() == StrCheckSubModule.toLowerCase()) {

                   $('#txtSubModuledefName').attr('name', StrGetSubModuleName[i].ModuleId);
                   $('#txtSubModuledefName').val(StrGetSubModuleName[i].ModuleName);
                   break;
               }
               else {

                   $('#txtSubModuledefName').val('');
                   $('#txtSubModuledefName').removeAttr('name');

               }
           }
           for (var i = 0; i < StrGetSubModuleName.length; ++i) {
               if (StrGetSubModuleName[i].ModuleName.substring(0, StrCheckSubModule.length).toLowerCase() === StrCheckSubModule.toLowerCase()) {

                   $('#txtSubModuledefName').attr('name', StrGetSubModuleName[i].ModuleId);
                   $('#txtSubModuledefName').val(StrGetSubModuleName[i].ModuleName);
               }
           }
       }
       else {
           $('#txtSubModuledefName').attr('name', StrGetSubModuleName[0].ModuleId);
           $('#txtSubModuledefName').val(StrGetSubModuleName[0].ModuleName);
       }
   })
//==============CheckSubsubModule=================//

   $('#txtPendingInvoices').blur(function () {
       var StrCheckPendingModule = $('#txtPendingInvoices').val().trim();
       if (StrCheckPendingModule != '') {

           for (var i = 0; i < StrGetPendingModuleName.length; i++) {
               if ((StrGetPendingModuleName[i].ModuleName).toLowerCase() == StrCheckPendingModule.toLowerCase()) {

                   $('#txtPendingInvoices').attr('name',StrGetPendingModuleName[i].ModuleId);
                   $('#txtPendingInvoices').val(StrGetPendingModuleName[i].ModuleName);
                   break;
               }
               else
               {

                   $('#txtPendingInvoices').val('');
                   $('#txtPendingInvoices').removeAttr('name');

               }
           }
           for (var i = 0; i < StrGetPendingModuleName.length; ++i)
           {
               if (StrGetPendingModuleName[i].ModuleName.substring(0, StrCheckPendingModule.length).toLowerCase() === StrCheckPendingModule.toLowerCase())
               {

                   $('#txtPendingInvoices').attr('name', StrGetPendingModuleName[i].ModuleId);
                   $('#txtPendingInvoices').val(StrGetPendingModuleName[i].ModuleName);
               }
           }
       }
       else
       {
           $('#txtPendingInvoices').attr('name', StrGetPendingModuleName[0].ModuleId);
           $('#txtPendingInvoices').val(StrGetPendingModuleName[0].ModuleName);
       }
   })
 //===============Function InsertUpdateMydefaults===============//

   function funMyDefaultSave() {
       var ObjDefaultArr = [];
       if ($('#txtModuleMyDefName').val() != '') {
           var ObjDefault = {
               Type: 'StartScreen',
               UserType: 'User',
               RefId: '',
               Defvalue: $('#txtModuleMyDefName').attr('name'),
               UserId: localStorage.UserId,
               ProdId: localStorage.ProdId
           }
           ObjDefaultArr.push(ObjDefault);
       }
       if ($('#txtSubModuledefName').val() != '') {
           ObjDefaultArr = [];
           var ObjDefault = {
               Type: 'StartScreen',
               UserType: 'User',
               RefId: '',
               Defvalue: $('#txtSubModuledefName').attr('name'),
               UserId: localStorage.UserId,
               ProdId: localStorage.ProdId
           }
           ObjDefaultArr.push(ObjDefault);
       }

       if ($('#txtPendingInvoices').val() != '') {
           ObjDefaultArr = [];
           var ObjDefault = {
               Type: 'StartScreen',
               UserType: 'User',
               RefId: '',
               Defvalue: $('#txtPendingInvoices').attr('name'),
               UserId: localStorage.UserId,
               ProdId: localStorage.ProdId
           }
           ObjDefaultArr.push(ObjDefault);
       }
    
       if ($('#hdnCompanyMyDef').val() != '') {
           var ObjDefault = {
               Type: 'Company',
               UserType: 'User',
               RefId: '',
               Defvalue: $('#hdnCompanyMyDef').val(),
               UserId: localStorage.UserId,
               ProdId: localStorage.ProdId
           }
           ObjDefaultArr.push(ObjDefault);
       }

       if ($('#hdnBankMyDefaults').val() != '') {
           var ObjDefault = {
               Type: 'Bank',
               UserType: 'User',
               RefId: '',
               Defvalue: $('#hdnBankMyDefaults').val(),
               UserId: localStorage.UserId,
               ProdId: localStorage.ProdId
           }
           ObjDefaultArr.push(ObjDefault);

       }
       if ($('#hdnEpisode').val() != '') {
           var ObjDefault = {
               Type: 'Source',
               UserType: 'User',
               RefId: '',
               Defvalue: $('#hdnEpisode').val(),
               UserId: localStorage.UserId,
               ProdId: localStorage.ProdId
           }
           ObjDefaultArr.push(ObjDefault);

       }
       // ================Fill Modules======================//
      
       //var Tcount = $('#tblModuleList tr').length;
       //var ModuleName = $('.myclass');
      
       //for (i = 0; i < Tcount; i++) {
       //    if (Tcount[i] != 0 && Tcount[i] != 0)
            
       //        ObjDefault = {
       //            Type: $('#spn_' + i).text(),
       //            UserType: 'User',
       //            RefId: $('#txt_' + i).attr('name'),
       //            Defvalue: $('#txtScrren_' + i).attr('name'),
       //            UserId: localStorage.UserId,
       //            ProdId: localStorage.ProdId
       //        }
       //    ObjDefaultArr.push(ObjDefault);

       //}

       //================Insert transactions===============//
       var TblCodes = $('#TblTransactionCodeTbody tr').length;
       var strValue = $('.clsCheckValue');
       for (i = 0; i < strValue.length; i++) {
           if (strValue[i].value != 0 && strValue[i].value != 0) {

               var GetId = strValue[i].id;
               var strGetId = GetId.split('_');

               //alert($('#hdnCode_' + i).val() + '-----' + $('#hdn_' + i).val());
               var ObjDefault = {
                   Type: 'TransactionCode',
                   UserType: 'User',
                   RefId: $('#hdnCode_' + strGetId[1]).val(),
                   Defvalue: $('#hdn_' + strGetId[1]).val(),
                   UserId: localStorage.UserId,
                   ProdId: localStorage.ProdId
               }
               ObjDefaultArr.push(ObjDefault);
           }
       }

       $.ajax({
           url: APIUrlInsertupdateMyDefaultUser,
           cache: false,
           type: 'POST',

           contentType: 'application/json; charset=utf-8',
           data: JSON.stringify(ObjDefaultArr),
       })
   .done(function (response)
   { funUserDefaultSaveSucess(response); })

       .fail(function (error)
       { ShowMSG(error); })
   }
   function funUserDefaultSaveSucess(response) {
       strUserIdAdmin = response;
       console.log(response);
       ShowMsgBox('showMSG', 'Default setting for User Saved successfully', '', '');
   }

//=====================GetMyDefaultsInfo======//
   function GetMyDefaultsInfo() {
       $.ajax({
           url: APIUrlGetMyDefaultsInfo + '?ProdId=' + localStorage.ProdId + '&UserId='+ localStorage.UserId,
           cache: false,
           beforeSend: function (request) {
               request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
           },
           type:'GET',

           contentType: 'application/json; charset=utf-8',
       })

        .done(function (response)
        { GetMyDefaultsInfoSucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
   }
   function GetMyDefaultsInfoSucess(response) {
       var strHtml = '';
       var Tcount = response.length;
       $('#txtCompanyMyDef').val(response[0].Companycode);
       $('#hdnCompanyMyDef').val(response[0].CompanyId);
       $('#txtBankMyDefaults').val(response[0].BankName);
       $('#hdnBankMyDefaults').val(response[0].BankId);
       $('#txtEpisode').val(response[0].Episode);
       $('#hdnEpisode').val(response[0].SourceId);
       $('#txtModuleMyDefName').val(response[0].m1name);
       $('#txtModuleMyDefName').attr('name',response[0].m1Id);
      
       $('#txtSubModuledefName').attr('name', response[0].m2Id);
       $('#txtSubModuledefName').val(response[0].m2name);
      
       $('#txtPendingInvoices').attr('name', response[0].m3Id);
       $('#txtPendingInvoices').val(response[0].m3name);
   }

//==============GetTransactionCode================//

   function GetTrascationMyDefault() {
       $.ajax({
           url: APIUrlGetTrascationMyDefault + '?UserId=' + localStorage.UserId,
           cache: false,
           beforeSend: function (request) {
               request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
           },
           type: 'POST',

           contentType: 'application/json; charset=utf-8',
       })
    .done(function (response)
    { GetTrascationDefaultSucess(response); })

       .fail(function (error) {
           ShowMSG(error);
       })
   }
   function GetTrascationDefaultSucess(response)
   {
       var Tcount = response.length;
       for (var i = 0; i < Tcount; i++) {
           var TransactionCodeID = response[i].TransactionCodeID;
           var TransactionValueid = response[i].TransactionValueid;
           var TransactionValue = response[i].TransValue;
           var hiddenId = $('#hdnCode_' + TransactionValueid).val();
           $('#TRValue_' + TransactionCodeID).val(TransactionValue);
           $('#hdn_' + TransactionCodeID).val(TransactionValueid);
       }
   }

