
var APIUrlGetModuleList = HOST + "/api/CompanySettings/GetModulesDetails";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlBankListByCompanyId = HOST + "/api/CompanySettings/GetBankInfoDetails"; // GetDefaultBankInfoByCompanyId";
var APIUrlFillSource = HOST + "/api/CompanySettings/GetSourceCodeDetails";
//var APIUrlFillCurrency = HOST + "/api/CompanySettings/GetCurrencyDetails";
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillModuleName = HOST + "/api/CompanySettings/GetModuleDetailsByModuleId";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlInsertupdateMyDefault = HOST + "/api/CompanySettings/InsertupdateMyDefault";
var APIUrlInsertUserAccess = HOST + "/api/CompanySettings/InsertUserAccess";
var APIUrlGetGroupList = HOST + "/api/CompanySettings/GetGroupDetailsBypropId";
var APIUrlGetUserByUserId = HOST + "/api/CompanySettings/GetUserDetailsByUserId"; //
var APIUrlGetMyDefault = HOST + "/api/CompanySettings/GetDefaultSettingByUserId";
var APIUrlGetGroupDetails = HOST + "/api/CompanySettings/GetUserGroupDetails";
var APIUrlGetTrascationDefault = HOST + "/api/CompanySettings/GetTransactionDefaultListByUserId";
//Changes
var APIUrlInsertupdateUsers = HOST + "/api/CompanySettings/InsertUpdateUser";
var APIUrlInsertupdateAdminUsers = HOST + "/api/AdminLogin/InsertUpdateAdminUser";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTAByCategory = HOST + "/api/Ledger/GetTblAccountDetailsByCategory"; // Add here
var APIUrlGetSegmentDetail = HOST + "/api/CompanySettings/GetDefaultSegmentValueByUserId";
var APIUrlfunSendMail = HOST + "/api/AdminLogin/SendMailAddUser";
var APIUrlCheckExistingCOA = HOST + "/api/CompanySettings/CheckUserexistanceCA";

var APIUrlCheckExistingUser = HOST + "/api/AdminLogin/CheckUserexistanceCAAdmin";
var APIUrlfunAddUserForProduction = HOST + "/api/CompanySettings/addproductionaccessforuser";
var APIUrlfunInsertOnlyCausersbyemailID = HOST + "/api/CompanySettings/InsertOnlyCausersbyemailID";

//
//var ArrModuleList = [];
var strUserIdAdmin = 0;
var strCompanyCode = '';
var strCompanyCodeArr = [];
var strStatusInsertUpdate = 'Insert';
var StrModuleName = [];
var StrSubModule = [];
var StrBankList = [];
var StrCheckTransactionCodes = [];
var GetdefaulttransCode = [];
var strUserIdAlready = 0;

$(document).ready(function () {

    GetTransactionCode();
    GetGroupList();
    GetSegmentList();
    GetUserDetailsByUserId();


});

//------------------------------------------------------ Group List
function GetGroupList() {
    $.ajax({
        url: APIUrlGetGroupList + '?PropId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetGroupListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetGroupListSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#UlGroup').append('<li  ><input type="checkBox" id="chk_' + response[i].GroupId + '" class="clsMultipleDropDown"  onclick="javascript:funCheckBoxChange( ' + response[i].GroupId + ',\'' + response[i].GroupName + '\');"/><span id="spn_' + response[i].GroupId + '" style="    margin-left: 10px;" onclick="javascript:funCheckBox( ' + response[i].GroupId + ',\'' + response[i].GroupName + '\');">' + response[i].GroupName + '</span></li>');
        //  $('#UlGroup').append('<li><input type="checkBox" id="chk_' + response[i].GroupId + '" class="clsMultipleDropDown" onclick="javascript:funCheckBoxChange( ' + response[i].GroupId + ',\'' + response[i].Grou pName + '\');"/><span id="spn_' + response[i].GroupId + '" style="    margin-left: 10px;">' + response[i].GroupName + '</span></li>');
    }
}

//--------------------------------------------------- Click Event
$('#txtModuleName').click(function () {
    FillModuleName();
})
$('#txtSubModuleName').click(function () {
    FillSubModuleName();
})
$('#txtCompnayCode').click(function () {
    FillCompany();
})
$('#txtCurrency').click(function () {
    FillCurrency();
})
$('#txtSource').click(function () {
    FillSource();
})
$('#txtBank').click(function () {
    FillBank();
})

//--------------------------------------------------- Focus Event

$('#txtModuleName').focus(function () {
    FillModuleName();
})
$('#txtSubModuleName').focus(function () {
    FillSubModuleName();
})
$('#txtCompnayCode').focus(function () {
    FillCompany();
})
$('#txtCurrency').focus(function () {
    FillCurrency();
})
$('#txtSource').focus(function () {
    FillSource();
})
$('#txtBank').focus(function () {
    FillBank();
})

// -------------------------------------------------- Get Transaction Code Table
function GetTransactionCode() {
    $.ajax({
        url: APIUrlGetTransactionCode + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { GetTransactionCodeSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetTransactionCodeSucess(response) {
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
    $('#TblTransactionCodeTbody').html(strHtml);
}
$('#TblTransactionCode').delegate('.SearchTranscationCode', 'focus', function () {
   // ChektransCode();
    var currentId = $(this).attr("name");
    var res = currentId.split("_");
    // alert(res[0]+'    '+ res[1] + ' dele');
    GetTranscationCode(res[0], res[1]);
})
function GetTranscationCode(value, i) {
    // alert(value + ' ' + i + ' fun');
    //  ChektransCode();
    
    $.ajax({
        url: APIUrlTranscationCode + '?TransactionCodeID=' + value,
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
    StrCheckTransactionCodes = [];
    StrCheckTransactionCodes = response;
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
                $(this).val('');
                // $('#f').val('');
                $('#hdn_' + value).val('');
                $("#TRValue_" + value).val('');
            }
        }
    })
}
//--------------------------------------------------- Module Name
function FillModuleName() {
    $.ajax({
        url: APIUrlFillModuleName + '?ModuleId=' + 0,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { FillModuleNameSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })

}
function FillModuleNameSucess(response) {
    StrModuleName = [];
    StrModuleName = response;
    $('#txtSubModuleName').val('');
    $('#hdnSubModuleId').val('');
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ModuleId,
            label: m.ModuleName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchModuleName").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnModuleId").val(ui.item.value);
            $('#txtModuleName').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnModuleId").val(ui.item.value);
            $('#txtModuleName').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnModuleId").val('');
                //$('#txtModuleName  ').val('');
            }
        }
    })
}
//--------------------------------------------------- Module Sub Name
function FillSubModuleName() {
    var strModuleId = $('#hdnModuleId').val();
    // alert(strModuleId);
    $.ajax({
        url: APIUrlFillModuleName + '?ModuleId=' + strModuleId,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },

        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { FillSubModuleNameSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function FillSubModuleNameSucess(response) {
    var array = [];
    StrSubModule = [];
    StrSubModule = response;


    // $('#txtSubModuleName').prop('disabled', false);
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ModuleId,
            label: m.ModuleName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchSubModuleName").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnSubModuleId").val(ui.item.value);
            $('#txtSubModuleName').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnSubModuleId").val(ui.item.value);
            $('#txtSubModuleName').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnSubModuleId").val('');
                //$('#txtSubModuleName  ').val('');


            }
        }
    })

}
//--------------------------------------------------- CompanyCode   
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

            $("#hdnCompnayCode").val(ui.item.value);
            $('#txtCompnayCode').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnCompnayCode").val(ui.item.value);
            $('#txtCompnayCode').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                $("#hdnCompnayCode").val('');
                $('#txtCompnayCode  ').val('');
            }
        }
    })
}
//--------------------------------------------------- Currency
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
//--------------------------------------------------- Source
function FillSource() {
    $.ajax({
        url: APIUrlFillSource + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { FillSourceSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function FillSourceSucess(response) {
    // alert(response.length);
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.SourceCodeID,
            label: m.Code,
            //  BuyerId: m.BuyerId,

        };
    });
    $(".SearchSource").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnSource").val(ui.item.value);
            $('#txtSource').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnSource").val(ui.item.value);
            $('#txtSource').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                $("#hdnSource").val('');
                $('#txtSource ').val('');
            }
        }
    })
}
//--------------------------------------------------- Bank
function FillBank() {
    var hdnCompanyId = 0;
    if ($('#hdnCompnayCode').val() != '') {
        hdnCompanyId = $('#hdnCompnayCode').val();
    }
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
    StrBankList = [];
    StrBankList = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.BankId,
            label: m.Bankname,
            //  BuyerId: m.BuyerId,

        };
    });
    $(".SearchBank").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnBank").val(ui.item.value);
            $('#txtBank').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBank").val(ui.item.value);
            $('#txtBank').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnBank").val('');
                //$('#txtBank').val('');
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
//-------------------------------------------------------- Save UserDetails
function funUserSave() {


    var ObjUser = {
        UserId: strUserIdAdmin,

        Name: $('#txtUserName').val(),
        Title: $('#txtUserTitle').val(),
        Email: $('#txtUserEmail').val(),
        Status: $('#ChkActive').prop('checked'),
        createdby: localStorage.UserId,
        Adminflag: false,
        GroupBatchAccess: $('#ChkGroupBatchAccess').prop('checked')
        , CanClose: $('#ChkCanClosePeriod').prop('checked'),
        AllBatchAccess: $('#ChkAllBatchAccess').prop('checked'),
        ProdId: localStorage.ProdId,
    }

    $.ajax({
        url: APIUrlInsertupdateUsers,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjUser),
    })
   .done(function (response)
   { funUserSaveSucess(response); })

       .fail(function (error)
       { ShowMSG(error); })

}
function funUserSaveSucess(response) {

    // alert('Saved User');
    if (strStatusInsertUpdate == 'Insert') {
        funSendMail();
        }
    funUserDefaultSave();
    funGroupSave();
    ShowMsgBox('showMSG', 'User Saved Successfully', '', '');
    $(location).attr('href', 'ManageUsers');

}

function funUserAdminSave() {
    var ObjUser = {
        UserID: strUserIdAdmin,
        Email: $('#txtUserEmail').val(),
        password: 'acs123',
        AuthCode: 'EMSCA-ACS',
        AccountStatus: 'Not Confirmed',
        Status: $('#ChkActive').prop('checked'),
        CreatedBy: localStorage.UserId
    }

    $.ajax({
        url: APIUrlInsertupdateAdminUsers,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjUser),
    })
   .done(function (response)
   { funUserSaveAdminSucess(response); })

       .fail(function (error)
       { ShowMSG(error); })
}

function funUserSaveAdminSucess(response) {
    strUserIdAdmin = response;
    funUserSave();
}


// --------------------------------------------------- Save MyDefault 
function funUserDefaultSave() {
    var ObjDefaultArr = [];
    //if ($('#hdnModuleId').val() != '') {

    //}
    if ($('#hdnSubModuleId').val() != '') {
        var ObjDefault = {
            Type: 'StartScreen',
            UserType: 'User',
            RefId: '',
            Defvalue: $('#hdnSubModuleId').val(),
            UserId: strUserIdAdmin,
            ProdId: localStorage.ProdId
        }
        ObjDefaultArr.push(ObjDefault);

    }
    else if ($('#hdnModuleId').val() != '') {
        var ObjDefault = {
            Type: 'StartScreen',
            UserType: 'User',
            RefId: '',
            Defvalue: $('#hdnModuleId').val(),
            UserId: strUserIdAdmin,
            ProdId: localStorage.ProdId
        }
        ObjDefaultArr.push(ObjDefault);
    }
    //if ($('#hdnCompnayCode').val() != '') {
    //    var ObjDefault = {
    //        Type: 'Company',
    //        UserType: 'User',
    //        RefId: '',
    //        Defvalue: $('#hdnCompnayCode').val(),
    //        UserId: strUserIdAdmin,
    //        ProdId: localStorage.ProdId
    //    }
    //    ObjDefaultArr.push(ObjDefault);
    //}
    if ($('#hdnCurrency').val() != '') {
        var ObjDefault = {
            Type: 'Currency',
            UserType: 'User',
            RefId: '',
            Defvalue: $('#hdnCurrency').val(),
            UserId: strUserIdAdmin,
            ProdId: localStorage.ProdId
        }
        ObjDefaultArr.push(ObjDefault);

    }
    if ($('#hdnSource').val() != '') {
        var ObjDefault = {
            Type: 'Source',
            UserType: 'User',
            RefId: '',
            Defvalue: $('#hdnSource').val(),
            UserId: strUserIdAdmin,
            ProdId: localStorage.ProdId
        }
        ObjDefaultArr.push(ObjDefault);

    }
    if ($('#hdnBank').val() != '') {
        var ObjDefault = {
            Type: 'Bank',
            UserType: 'User',
            RefId: '',
            Defvalue: $('#hdnBank').val(),
            UserId: strUserIdAdmin,
            ProdId: localStorage.ProdId
        }
        ObjDefaultArr.push(ObjDefault);

    }

    var DefaultSegment = $('.DefaultSegment');
    var strClassification = $('.SegmentClassification');
    for (var i = 0; i < DefaultSegment.length; i++) {
        var strId = DefaultSegment[i].id;
        if ($('#' + strId).val() != '') {
            var strsplit = strId.split('_');
            var strSegval = $('#' + strId).attr('name');
            /////////////////////////////////////////////////////////////////////////////////////
            var ObjDefault = {
                Type: 'Segment',
                UserType: 'User',
                RefId: strsplit[1],
                Defvalue: strSegval,
                UserId: strUserIdAdmin,
                ProdId: localStorage.ProdId
            }
            ObjDefaultArr.push(ObjDefault);
        }
    }
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
                UserId: strUserIdAdmin,
                ProdId: localStorage.ProdId
            }
            ObjDefaultArr.push(ObjDefault);
        }
    }

    $.ajax({
        url: APIUrlInsertupdateMyDefault,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
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
    console.log(response);
  
}
//------------------------------------------------------ Save Group
function funGroupSave() {
    // var strGroupid = $('#ddlGroupCode').val();
    var strCompanyId = $('.clsMultipleDropDown');
    var strCompany = '';

    var FinGroupId = '';
    for (var i = 0; i < strCompanyId.length; i++) {
        if (strCompanyId[i].checked == true) {
            var StrId = strCompanyId[i].id;
            var FStrId = StrId.split('_');
            strCompany += FStrId[1] + ',';
        }
    }
    strCompany = strCompany.substring(0, strCompany.length - 1);

    var UserGroupAccess = {
        UserId: strUserIdAdmin,
        GroupId: strCompany,  ////// ///GroupID fill
        ProdId: localStorage.ProdId,
        CreatedBy: localStorage.UserId
    }

    $.ajax({
        url: APIUrlInsertUserAccess,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(UserGroupAccess),
    })
.done(function (response)
{ funGroupSaveSucess(response); })

    .fail(function (error)
    { ShowMSG(error); })
}
function funGroupSaveSucess(response) {
    console.log(response);
  
}

//------------------------------------------------------ Get User Details
function GetUserDetailsByUserId() {

    // var strUserId = localStorage.pubUserId;
    strUserIdAdmin = localStorage.pubUserId;
    if (strUserIdAdmin == 0) {
        strStatusInsertUpdate = 'Insert';
    }
    else {
        strStatusInsertUpdate = 'Update';

    }
  
    if (strUserIdAdmin != 0) {
        $('#btnAddUser').hide();

    }
    // alert(localStorage.pubUserId);
    $.ajax({
        url: APIUrlGetUserByUserId + '?UserId=' + strUserIdAdmin,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
 .done(function (response)
 { GetUserDetailsByUserIdSucess(response); })

     .fail(function (error) {
         ShowMSG(error);
     })
}
function GetUserDetailsByUserIdSucess(response) {
    if (response.length > 0) {
        strUserIdAdmin: response[0].UserID;
        $('#LiNewUsers').text(response[0].Name);
        $('#txtUserName').val(response[0].Name);
        $('#txtUserTitle').val(response[0].Title);
        $('#txtUserEmail').val(response[0].Email);
        $('#txtUserEmail').prop('disabled', true);
        $('#ChkActive').prop('checked', response[0].Status);
        $('#ChkGroupBatchAccess').prop('checked', response[0].GroupBatchAccess);
        $('#ChkCanClosePeriod').prop('checked', response[0].CanClose);
        $('#ChkAllBatchAccess').prop('checked', response[0].AllBatchAccess);
        GetGroupDetails();
        GetMyDefault();
        GetTrascationDefault();
        GetSegmentDetail();
    }
}
function GetGroupDetails() {
    $.ajax({
        url: APIUrlGetGroupDetails + '?UserId=' + localStorage.pubUserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
.done(function (response)
{ GetGroupDetailsSucess(response); })

  .fail(function (error) {
      ShowMSG(error);
  })
}
function GetGroupDetailsSucess(response) {
    $('#txtGroupDropDown').val('');
    var clsCompany = $('.clsMultipleDropDown');
    for (var i = 0; i < clsCompany.length; i++) {
        var strId = clsCompany[i].id;
        $('#' + strId).prop('checked', false);
    }

    strCompanyCode = '';
    strCompanyCodeArr = [];
    var Tcount = response.length;
    for (var i = 0; i < Tcount; i++) {
        strCompanyId = response[i].GroupId;
        // $("#ms-opt-" + strCompanyId).prop('checked', true);
        $('#chk_' + response[i].GroupId).prop('checked', true);
        strCompanyCodeArr.push(response[i].GroupName);
        if (Tcount - 1 == i) {
            strCompanyCode += response[i].GroupName;
        } else {
            strCompanyCode += response[i].GroupName + ',';
        }
    }
    $('#txtGroupDropDown').val(strCompanyCode);
}


function GetMyDefault() {
    //  alert(localStorage.pubUserId);

    $.ajax({
        url: APIUrlGetMyDefault + '?UserId=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
.done(function (response)
{ GetMyDefaultSucess(response); })

   .fail(function (error) {
       ShowMSG(error);
   })
}
function GetMyDefaultSucess(response) {
    var Tcount = response.length;
    if (Tcount != 0) {
        $('#txtModuleName').val(response[0].Module1);
        $('#hdnModuleId').val(response[0].Module1Id);

        if (response[0].Module2Id != 0) {
            $('#txtSubModuleName').val(response[0].Module2);
            $('#hdnSubModuleId').val(response[0].Module2Id);
        }
        /////coding

        $('#txt_1').val(response[0].Companycode);

        $('#hdnCompnayCode').val(response[0].CompanyId);
        //  $('#txtCurrency').val(response[0].CurrencyName);   // Not launch In this phase
        $('#hdnCurrency').val(response[0].CurrencyId);
        $('#txt_9').val(response[0].SourceCode);
        $('#hdnSource').val(response[0].SourceId);

        $('#txtBank').val(response[0].BankName);
        $('#hdnBank').val(response[0].BankId);


    }
}

function GetTrascationDefault() {
    $.ajax({
        url: APIUrlGetTrascationDefault + '?UserId=' + localStorage.UserId,
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
function GetTrascationDefaultSucess(response) {
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

//--------------------------------------------------- Error MSG
function ShowMSG(error) {
    console.log(error);
   }


//-------------------------------------------------- Drop Down

function DvOpenClose() {
    if ($('#DvGroup').css('display') == 'block') {
        $('#DvGroup').hide();
    }
    else {
        $('#DvGroup').show();
    }
}
function funCheckBox(CId, CCode) {
    if ($('#chk_' + CId).prop('checked') == true) {
        $('#chk_' + CId).prop('checked', false);
    }
    else {

        $('#chk_' + CId).prop('checked', true);
    }
    funCheckBoxChange(CId, CCode);
}
function funCheckBoxChange(CId, CCode) {
    // $('#chk_' + CId).prop('checked', true);
    var Rcount = 0;
    var ArrLength = strCompanyCodeArr.length;
    if ($('#chk_' + CId).prop('checked') == true) {                      //---------------------------- Add in Array
        for (var i = 0; i < strCompanyCodeArr.length; i++) {
            if (strCompanyCodeArr[i] == CCode) {
                Rcount++;
            }

        }
        if (Rcount == 0) {
            strCompanyCodeArr.push(CCode);
        }
        //strCompanyCode = '';
        //if (ArrLength == strCompanyCodeArr.length - 1) {
        //    strCompanyCode += CCode;
        //} else {
        //    strCompanyCode += CCode + ',';
        //}
    }
    else {
        strCompanyCodeArr.splice($.inArray(CCode, strCompanyCodeArr), 1);  //-------------------- Remove in Array
    }

    //------------------------------------ Fill value in Text Box
    var FCount = strCompanyCodeArr.length;
    strCompanyCode = '';
    for (var i = 0; i < FCount; i++) {
        strCompanyCode += strCompanyCodeArr[i] + ',';
    }
    strCompanyCode = strCompanyCode.substring(0, strCompanyCode.length - 1);
    $('#txtGroupDropDown').val(strCompanyCode);
}
$("#DvMultipleDDL").mouseleave(function () {

    $('#DvGroup').attr('style', 'display:none;');
});



//--------------------------------------------- Default Set

function GetSegmentList() {

    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + '1',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { GetSegmentListSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}

function GetSegmentListSucess(response) {
    var strHtml = '';
    for (var i = 0; i < response.length; i++) {
        if (response[i].Classification == 'Detail') {
            break;
        }
        if (response[i].Classification == 'Ledger') {
           
        }

        else {
            strHtml += '<tr>';
            strHtml += '<td class="SegmentClassification">' + response[i].Classification + '</td>';
            //strHtml += '<td><input type="text" id="txt_' + response[i].SegmentId + '" class="form-control searchDefaultSet DefaultSegment" onfocus="javascript:funDefaultSegmentValue(' + response[i].SegmentId + ',\'' + response[i].Classification + '\');" onblur = "javascript:funCheckDefaultAccoumts( ' + response[i].SegmentId + ');" /></td>';

            strHtml += '<td><input type="text" id="txt_' + response[i].SegmentId + '" class="form-control searchDefaultSet DefaultSegment" onfocus="javascript:funDefaultSegmentValue(' + response[i].SegmentId + ',\'' + response[i].Classification + '\');" /></td>';
            strHtml += '</tr>';
        }
    }
    $('#tblDefaultSetTBody').html(strHtml);
}



function funDefaultSegmentValue(SegmentId, values) {

    $.ajax({
        url: APIUrlGetTAByCategory + '?ProdId=' + localStorage.ProdId + '&Category=' + values,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type:'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response) {

     funDefaultSegmentValueSuccess(response);
 })
 .fail(function (error)
 { ShowMSG(error); })



}
function funDefaultSegmentValueSuccess(response) {
    GetdefaulttransCode = [];
    GetdefaulttransCode = response;
    var ProductListjson = [];
    ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.AccountID,
            label: m.AccountCode,
            //  BuyerId: m.BuyerId,

        };
    });
    $(".searchDefaultSet").autocomplete({
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

function GetSegmentDetail() {
    $.ajax({
        url: APIUrlGetSegmentDetail + '?UserId=' + localStorage.pubUserId + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {

        GetSegmentDetailSuccess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetSegmentDetailSuccess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#txt_' + response[i].SegmentId).val(response[i].AccountCode);
        $('#txt_' + response[i].SegmentId).attr('name', response[i].AccountId);

    }
}

function funSendMail() {
    
    $.ajax({
        url: APIUrlfunSendMail + '?Email=' + $('#txtUserEmail').val() + '&UserId=' + strUserIdAdmin + '&ProdId=' + localStorage.ProdId + '&CreatedBy=' + localStorage.UserId + '&UserName=' + $('#txtUserName').val() + '&ProName=' + localStorage.ProductionName,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {

        funSendMailSuccess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}
function funSendMailSuccess(response) {

}

//=================CheckModuleName======================//
$('#txtModuleName').blur(function () {
    FillModuleName();
    var StrCheckModule = $('#txtModuleName').val().trim();
   if (StrCheckModule != '') {

        for (var i = 0; i < StrModuleName.length; i++) {
            if ((StrModuleName[i].ModuleName).toLowerCase() == StrCheckModule.toLowerCase()) {
                $('#hdnModuleId').val(StrModuleName[i].ModuleId);
                $('#txtModuleName').val(StrModuleName[i].ModuleName);
                break;
            }
            else {
                $('#hdnModuleId').val(' ');
                $('#txtModuleName').val('');

            }
        }
        for (var i = 0; i < StrModuleName.length; ++i) {
            if (StrModuleName[i].ModuleName.substring(0, StrCheckModule.length).toLowerCase() === StrCheckModule.toLowerCase()) {
                $('#hdnModuleId').val(StrModuleName[i].ModuleId);
                $('#txtModuleName').val(StrModuleName[i].ModuleName);
            }
        }      
   }
   else {
       $('#txtModuleName').val(StrModuleName[0].ModuleName);
           $('#hdnModuleId').val(StrModuleName[0].ModuleId);

   }

 })

//===============CheckSubModule======================//
$('#txtSubModuleName').blur(function ()
{
        FillSubModuleName();
        var StrCheckSubModule = $('#txtSubModuleName').val().trim();
        if (StrCheckSubModule != '')
        {
              for (var i = 0; i < StrSubModule.length; i++)
              {
                  if ((StrSubModule[i].ModuleName).toLowerCase() == StrCheckSubModule.toLowerCase())
                  {
        
                 $('#hdnSubModuleId').val(StrSubModule[i].ModuleId);
                 $('#txtSubModuleName').val(StrSubModule[i].ModuleName);            
                 break;
             }
             else {
                 $('#hdnSubModuleId').val(' ');
                 $('#txtSubModuleName').val('');

             }
           }
           for (var i = 0; i < StrSubModule.length; i++) {
               if (StrSubModule[i].ModuleName.substring(0, StrCheckSubModule.length).toLowerCase() === StrCheckSubModule.toLowerCase())
               {
                   $('#hdnSubModuleId').val(StrSubModule[i].ModuleId);
                   $('#txtSubModuleName').val(StrSubModule[i].ModuleName);
              }
           }
          }
        else
        {
              $('#txtSubModuleName').val(StrSubModule[0].ModuleName);
              $('#hdnSubModuleId').val(StrSubModule[0].ModuleId);
          }
 })

//=============CheckBank=====================//

$('#txtBank').blur(function ()
{
    var StrCheckBanks = $('#txtBank').val().trim();
    if (StrCheckBanks != '') {

        for (var i = 0; i < StrBankList.length; i++)
        {
            if ((StrBankList[i].Bankname).toLowerCase() == StrCheckBanks.toLowerCase())
            {         
                $('#hdnBank').val(StrBankList[i].BankId);
                $('#txtBank').val(StrBankList[i].Bankname);
               break;
            }
            else
            {
                $('#hdnBank').val(' ');
                $('#txtBank').val('');
            }
        }
        for (var i = 0; i < StrBankList.length; i++)
        {
            if (StrBankList[i].Bankname.substring(0, StrCheckBanks.length).toLowerCase() === StrCheckBanks.toLowerCase())
            {
                $('#hdnBank').val(StrBankList[i].BankId);
                $('#txtBank').val(StrBankList[i].Bankname);
                break;
            }
        }
    }
    else
    {
       // $('#hdnBank').val(StrBankList[0].BankId);
      //  $('#txtBank').val(StrBankList[0].Bankname);
    }

})

//==============CheckTransactionCodes=======================//

//function funCheckTransCode(value) {

//    var StrCheckTransCode = $('#TRValue_' + value).val();  
//    if (StrCheckTransCode != '')
//    {
//        for (var i = 0; i < StrCheckTransactionCodes.length; i++)
//        {
//            if (StrCheckTransactionCodes[i].TransValue == StrCheckTransCode)
//            {
//                $('#TRValue_' + value).val(StrCheckTransactionCodes[i].TransValue);
//                $('#hdn_' + value).val(StrCheckTransactionCodes[i].TransactionValueID);
//                break;
//            }
//            else
//            {
//                $('#hdn_' + value).val(' ');
//                $('#TRValue_' + value).val('');

//            }
//        }

//        for (var i = 0; i < StrCheckTransactionCodes.length; i++)
//        {
//            if (StrCheckTransactionCodes[i].TransValue.substring(0,StrCheckTransCode.length) === StrCheckTransCode)
//            {
//                $('#TRValue_' + value).val(StrCheckTransactionCodes[i].TransValue);
//                $('#hdn_' + value).val(StrCheckTransactionCodes[i].TransactionValueID);
//                break;
//            }
//        }
//     }
//    else
//    {
//        $('#TRValue_' + value).val(StrCheckTransactionCodes[0].TransValue);
//        $('#hdn_' + value).val(StrCheckTransactionCodes[0].TransactionValueID);

//    }
//   }

//================ChekDefaultAccounts==================//

//function funCheckDefaultAccoumts(value)
//{
//        var StrCheckDefaultAccoumts = $('#txt_' + value).val();
//        if (StrCheckDefaultAccoumts != '')
//        {    
//        for (var i = 0; i < GetdefaulttransCode.length; i++)
//        {
//            if (GetdefaulttransCode[i].AccountCode == StrCheckDefaultAccoumts)
//            {
//                $('#txt_' + value).val(GetdefaulttransCode[i].AccountCode);
//                $('#txt_' + value).attr('name', GetdefaulttransCode[i].AccountId);
//                break;
//            }
//            else
//            {
//                $('#txt_' + value).removeAttr('name');
//                $('#txt_' + value).val('');

//            }
//        }
//        for (var i = 0; i < GetdefaulttransCode.length; ++i)
//        {
//            if (GetdefaulttransCode[i].AccountCode.substring(0, StrCheckDefaultAccoumts.length) === StrCheckDefaultAccoumts)
//            {
//                $('#txt_' + value).val(GetdefaulttransCode[i].AccountCode);
//                $('#txt_' + value).attr('name', GetdefaulttransCode[i].AccountId);
//              break;
//            }
//          }
//        }
//        else
//        {
//            $('#txt_' + value).val(GetdefaulttransCode[0].AccountCode);
//            $('#txt_' + value).attr('name',GetdefaulttransCode[0].AccountId);

//        }
//}
//===================CheckExistingCOA======================//
$('#txtUserEmail').blur(function () {
    CheckExistingUser();
});

function CheckExistingUser() {
    var EE=$('#txtUserEmail').val();

    $.ajax({
        url: APIUrlCheckExistingUser + '?Email=' + EE,
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        }
    })
    .done(function (response) {
        funUserCheckExistinguserSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funUserCheckExistinguserSucess(response) {

    if (response != 0) {
        //$('#txtUserEmail').val('');
        //$('#txtUserEmail').focus();
        // ShowMsgBox('showMSG', 'User Already exist.. !!', '', '');
        ShowDivAdduserinprod();
        strUserIdAlready = response;
    }
    else {

    }
}

function ShowDivAdduserinprod() {
    $('#AdminProductionAccess').show();
    $('#fade').show();
}

function funAddUserForProduction() {
    $('#AdminProductionAccess').hide();
    $('#preload').show();
    $('#fade').show();

    $.ajax({
        url: APIUrlfunAddUserForProduction + '?AdminUserid=' + strUserIdAlready + '&ProdID=' + localStorage.ProdId + '&EmailId=' + $('#txtUserEmail').val() + '&ProdcutionName=' + $('#productionname').text(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',

    })

 .done(function (response)
 { funAddUserForProductionSucess(response); })

     .fail(function (error)
     { ShowMSG(error); })
}
function funAddUserForProductionSucess(response) {
    funInsertOnlyCausersbyemailID();
}

function funInsertOnlyCausersbyemailID() {
    $.ajax({
        url: APIUrlfunInsertOnlyCausersbyemailID + '?AdminUserid=' + strUserIdAlready + '&EmailID=' + $('#txtUserEmail').val() + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ funInsertOnlyCausersbyemailIDSucess(response); })
   .fail(function (error)
   { funInsertOnlyCausersbyemailIDError(error); })
}
function funInsertOnlyCausersbyemailIDError() {
    location.reload(true);
}

function funInsertOnlyCausersbyemailIDSucess(response) {
    ShowMsgBox('showMSG', 'User Added Successfully for this Production ..!!', '', '');
    $(location).attr('href', 'Users');

}
