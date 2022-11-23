
var APIUrlGetModuleList = HOST + "/api/CompanySettings/GetModulesDetails";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlBankList = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlFillSource = HOST + "/api/CompanySettings/GetSourceCodeDetails";
var APIUrlFillCurrency = HOST + "/api/CompanySettings/GetCurrencyDetails";
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

////c
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTAByCategory = HOST + "/api/Ledger/GetTblAccountDetailsByCategory"; // Add here
var APIUrlGetSegmentDetail = HOST + "/api/CompanySettings/GetDefaultSegmentValueByUserId";

var APIUrlfunSendMail = HOST + "/api/AdminLogin/SendMailAddUser";
var APIUrlCheckExistingUser = HOST + "/api/AdminLogin/CheckUserexistanceCAAdmin";

var APIUrlfunAddUserForProduction = HOST + "/api/CompanySettings/addproductionaccessforuser";
var APIUrlfunInsertOnlyCausersbyemailID = HOST + "/api/CompanySettings/InsertOnlyCausersbyemailID";

//var APIUrlCheckExistingEmailId = HOST + "/api/CompanySettings/CheckUserexistanceCA";


//
//var ArrModuleList = [];
var strUserIdAdmin = 0;
var strStatusInsertUpdate = 'Insert';
var StrGetModuleName = [];
var StrgetSubModuleName = [];
var StrBankListAdmin = [];
var StrGetCurrency = [];
var checkCompanyCode = [];
var GetTransactionAdmin = [];
var strUserIdAlready=0;


$(document).ready(function () {

    
    GetTransactionCode();
    GetGroupList();
    GetSegmentList();
    GetUserDetailsByUserId();


});

//------------------------------------------------------ Group List
function GetGroupList() {
    $.ajax({
        url: APIUrlGetGroupList + '?PropId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
        //  $('#UlGroup').append('<li><input type="checkBox" id="chk_' + response[i].GroupId + '" class="clsMultipleDropDown" onclick="javascript:funCheckBoxChange( ' + response[i].GroupId + ',\'' + response[i].GroupName + '\');"/><span id="spn_' + response[i].GroupId + '" style="    margin-left: 10px;">' + response[i].GroupName + '</span></li>');
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
        url: APIUrlGetTransactionCode + '?ProdId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
        strHtml += '<td><input type="text" id="TRValue_' + TransactionCodeID + '" name="' + TransactionCodeID + '_' + i + '" class="SearchTranscationCode"  onclick="javascript:GetTranscationCode(' + TransactionCodeID + ',' + i + ');" onblur="javascript:funCheckTransCode(' + TransactionCodeID + ');"/>';
        strHtml += '<input type="hidden"/ id="hdn_' + TransactionCodeID + '" class="clsCheckValue"></td>';
        strHtml += '</tr>';
    }
    $('#TblTransactionCodeTbody').html(strHtml);
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
        url: APIUrlTranscationCode + '?TransactionCodeID=' + value,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
    GetTransactionAdmin = [];
    GetTransactionAdmin = response;
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
//--------------------------------------------------- Module Name
function FillModuleName() {
    $.ajax({
        url: APIUrlFillModuleName + '?ModuleId=' + 0,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
    StrGetModuleName = []; 
    StrGetModuleName = response;
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
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { FillSubModuleNameSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function FillSubModuleNameSucess(response) {
    StrgetSubModuleName = [];
    StrgetSubModuleName = response;
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
        url: APIUrlFillCompany + '?ProdId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
    checkCompanyCode = [];
    checkCompanyCode = response;
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
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnCompnayCode").val('');
                //$('#txtCompnayCode  ').val('');
            }
        }
    })
}
//--------------------------------------------------- Currency
function FillCurrency() {
    $.ajax({
        url: APIUrlFillCurrency + '?ProdId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
    StrGetCurrency = [];
    StrGetCurrency = response;
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
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnCurrency").val('');
                //$('#txtCurrency  ').val('');
            }
        }
    })
}

//--------------------------------------------------- Source
function FillSource() {
    $.ajax({
        url: APIUrlFillSource + '?ProdId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
    $.ajax({
        url: APIUrlBankList + '?ProdId=' + localStorage.AdminProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
    StrBankListAdmin = [];
    StrBankListAdmin = response;
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

    if (isvalid === "") {
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
        createdby: localStorage.AdminUserID,
        Adminflag: false,
        GroupBatchAccess: $('#ChkGroupBatchAccess').prop('checked')
        , CanClose: $('#ChkCanClosePeriod').prop('checked'),
        AllBatchAccess: $('#ChkAllBatchAccess').prop('checked'),
        ProdId: localStorage.AdminProdId,
    }

    $.ajax({
        url: APIUrlInsertupdateUsers,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
    if (strStatusInsertUpdate === 'Insert') {
        funSendMail();
    }

    funUserDefaultSave();
    funGroupSave();
    ShowMsgBox('showMSG', 'User Saved Successfully', '', '');
    $(location).attr('href', 'Users');
}

function funUserAdminSave() {
    var ObjUser = {
        UserID: strUserIdAdmin,
        Email: $('#txtUserEmail').val(),
        password: 'acs123',
        AuthCode: 'EMSCA-ACS',
        AccountStatus: 'Not Confirmed',
        Status: $('#ChkActive').prop('checked'),
        CreatedBy: localStorage.AdminUserID
    }

    $.ajax({
        url: APIUrlInsertupdateAdminUsers,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
            ProdId: localStorage.AdminProdId
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
            ProdId: localStorage.AdminProdId
        }
        ObjDefaultArr.push(ObjDefault);
    }
    if ($('#hdnCompnayCode').val() != '') {
        var ObjDefault = {
            Type: 'Company',
            UserType: 'User',
            RefId: '',
            Defvalue: $('#hdnCompnayCode').val(),
            UserId: strUserIdAdmin,
            ProdId: localStorage.AdminProdId
        }
        ObjDefaultArr.push(ObjDefault);
    }
    if ($('#hdnCurrency').val() != '') {
        var ObjDefault = {
            Type: 'Currency',
            UserType: 'User',
            RefId: '',
            Defvalue: $('#hdnCurrency').val(),
            UserId: strUserIdAdmin,
            ProdId: localStorage.AdminProdId
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
            ProdId: localStorage.AdminProdId
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
            ProdId: localStorage.AdminProdId
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
                ProdId: localStorage.AdminProdId
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
      ///  if ($('#hdn_' + i).val() != '') {

            //alert($('#hdnCode_' + i).val() + '-----' + $('#hdn_' + i).val());
            var ObjDefault = {
                Type: 'TransactionCode',
                UserType: 'User',
                RefId: $('#hdnCode_' + strGetId[1]).val(),
                Defvalue: $('#hdn_' + strGetId[1]).val(),
                UserId: strUserIdAdmin,
                ProdId: localStorage.AdminProdId
            }
            ObjDefaultArr.push(ObjDefault);
        }
    }

    $.ajax({
        url: APIUrlInsertupdateMyDefault,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
        ProdId: localStorage.AdminProdId,
        CreatedBy: localStorage.UserId
    }

    $.ajax({
        url: APIUrlInsertUserAccess,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(UserGroupAccess),
    })
.done(function (response)
{ funGroupSaveSucess(response); })

.fail(function (error) {
    ShowMSG(error);
})
}
function funGroupSaveSucess(response) {
    console.log(response);
}

//------------------------------------------------------ Get User Details
function GetUserDetailsByUserId() {

    // var strUserId = localStorage.pubUserId;
    strUserIdAdmin = localStorage.AdminpubUserId;

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
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response) {
         GetUserDetailsByUserIdSucess(response);
     })

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
        url: APIUrlGetGroupDetails + '?UserId=' + localStorage.AdminpubUserId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
        url: APIUrlGetMyDefault + '?UserId=' + localStorage.AdminpubUserId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
        $('#txtCompnayCode').val(response[0].Companycode);

        $('#hdnCompnayCode').val(response[0].CompanyId);
        $('#txtCurrency').val(response[0].CurrencyName);
        $('#hdnCurrency').val(response[0].CurrencyId);
        $('#txtSource').val(response[0].SourceCode);
        $('#hdnSource').val(response[0].SourceId);

        $('#txtBank').val(response[0].BankName);
        $('#hdnBank').val(response[0].BankId);


    }
}

function GetTrascationDefault() {
    $.ajax({
        url: APIUrlGetTrascationDefault + '?UserId=' + localStorage.AdminpubUserId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response) {
         GetTrascationDefaultSucess(response);
     })

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

    // }
}

//--------------------------------------------------- Error MSG
function ShowMSG(error) {
    console.log(error);
}


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

//-----------------------------------------------
function GetSegmentList() {

    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId+'&Mode='+2,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
        strHtml += '<tr>';
        strHtml += '<td class="SegmentClassification">' + response[i].Classification + '</td>';
        strHtml += '<td><input type="text" id="txt_' + response[i].SegmentId + '" class="form-control searchDefaultSet DefaultSegment" onfocus="javascript:funDefaultSegmentValue(' + response[i].SegmentId + ',\'' + response[i].Classification + '\');" /></td>';
        strHtml += '</tr>';
    }
    $('#tblDefaultSetTBody').html(strHtml);


}



function funDefaultSegmentValue(SegmentId, values) {

    $.ajax({
        url: APIUrlGetTAByCategory + '?ProdId=' + localStorage.ProdId + '&Category=' + values,
        cache: false,
        type: 'POST',
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
                $(this).val('');
                $(this).removeAttr('name');
            }
        }
    })
}

function GetSegmentDetail() {
    $.ajax({
        url: APIUrlGetSegmentDetail + '?UserId=' + localStorage.pubUserId + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
        url: APIUrlfunSendMail + '?Email=' + $('#txtUserEmail').val() + '&UserId=' + strUserIdAdmin + '&ProdId=' + localStorage.AdminProdId + '&CreatedBy=' + localStorage.AdminUserID + '&UserName=' + $('#txtUserName').val() + '&ProName=' + localStorage.AdminProdName,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
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
$('#txtModuleName').blur(function ()
{
    var StrModuleGetName = $('#txtModuleName').val().trim();
    if (StrModuleGetName != '')
    {
        for (var i = 0; i < StrGetModuleName.length; i++)
        {
            if ((StrGetModuleName[i].ModuleName).toLowerCase() == StrModuleGetName.toLowerCase())
            {
                $('#hdnModuleId').val(StrGetModuleName[i].ModuleId);
                $('#txtModuleName').val(StrGetModuleName[i].ModuleName);            
                break;
            }
            else {
                $('#hdnModuleId').val(' ');
                $('#txtModuleName').val('');
            }
        }
        for (var i = 0; i < StrGetModuleName.length; ++i)
        {
            if (StrGetModuleName[i].ModuleName.substring(0, StrModuleGetName.length).toLowerCase() === StrModuleGetName.toLowerCase()) {
                $('#hdnModuleId').val(StrGetModuleName[i].ModuleId);
                $('#txtModuleName').val(StrGetModuleName[i].ModuleName);
                break;
            }
        }
    }
    else
    {
        $('#hdnModuleId').val(StrGetModuleName[0].ModuleId);
        $('#txtModuleName').val(StrGetModuleName[0].ModuleName);
    }
})

//===============CheckSubModule======================//
$('#txtSubModuleName').blur(function () {
    FillSubModuleName();
    var StrSubModuleGet = $('#txtSubModuleName').val().trim();
    if (StrSubModuleGet != '')
    {
        for (var i = 0; i < StrgetSubModuleName.length; i++)
        {
            if ((StrgetSubModuleName[i].ModuleName).toLowerCase() == StrSubModuleGet.toLowerCase())
            {
                $('#hdnSubModuleId').val(StrgetSubModuleName[i].ModuleId);
                $('#txtSubModuleName').val(StrgetSubModuleName[i].ModuleName);
                break;
            }
            else
            {
                $('#hdnSubModuleId').val(' ');
                $('#txtSubModuleName').val('');
            }
        }
        for (var i = 0; i < StrgetSubModuleName.length; ++i) {
            if (StrgetSubModuleName[i].ModuleName.substring(0, StrSubModuleGet.length).toLowerCase() === StrSubModuleGet.toLowerCase()) {
                $('#hdnSubModuleId').val(StrgetSubModuleName[i].ModuleId);
                $('#txtSubModuleName').val(StrgetSubModuleName[i].ModuleName);
                break;
            }
        }
    }
    else
    {
        $('#hdnSubModuleId').val(StrgetSubModuleName[0].ModuleId);
        $('#txtSubModuleName').val(StrgetSubModuleName[0].ModuleName);
    }
})

//=============CheckBank=====================//

$('#txtCurrency').blur(function () {
    var StrCheckCurrencyAdmin = $('#txtCurrency').val().trim();
    if (StrCheckCurrencyAdmin != '')
    {
        for (var i = 0; i < StrGetCurrency.length; i++)
        {
            if ((StrGetCurrency[i].CurrencyName).toLowerCase() == StrCheckCurrencyAdmin.toLowerCase())
            {
                $('#hdnCurrency').val(StrGetCurrency[i].CurrencyID);
                $('#txtCurrency').val(StrGetCurrency[i].CurrencyName);
                break;
            }
            else
            {
                $('#hdnCurrency').val(' ');
                $('#txtCurrency').val('');
            }
        }
        for (var i = 0; i < StrGetCurrency.length; ++i) {
            if (StrGetCurrency[i].CurrencyName.substring(0, StrCheckCurrencyAdmin.length).toLowerCase() === StrCheckCurrencyAdmin.toLowerCase()) {
                $('#hdnCurrency').val(StrGetCurrency[i].CurrencyID);
                $('#txtCurrency').val(StrGetCurrency[i].CurrencyName);
                break;
            }
        }
    }
    else
    {
        $('#hdnCurrency').val(StrGetCurrency[0].CurrencyID);
        $('#txtCurrency').val(StrGetCurrency[0].CurrencyName);
    }

})

//===============CheckCompanyCode================//
$('#txtCO').blur(function () {
  
    var StrCheckCompanyIdAdmin = $('#txtCO').val().trim();
    //alert(StrCheckCompanyIdAdmin);
    if (StrCheckCompanyIdAdmin != '') {

        for (var i = 0; i < checkCompanyCode.length; i++) {
            if (checkCompanyCode[i].CompanyCode == StrCheckCompanyIdAdmin) {
                $('#hdnCompnayCode').val(checkCompanyCode[i].CompanyID);
                $('#txtCO').val(checkCompanyCode[i].CompanyCode);
               // alert(StrCheckCompanyIdAdmin);
                break;
            }
            else {
                $('#hdnCompnayCode').val(' ');
                $('#txtCO').val('');
            }
       }
    }
})

//=============CheckBank=====================//

$('#txtBank').blur(function () {

    var StrCheckBanks = $('#txtBank').val().trim();
    if (StrCheckBanks != '') {

        for (var i = 0; i < StrBankListAdmin.length; i++)
        {
            if ((StrBankListAdmin[i].Bankname).toLowerCase() == StrCheckBanks.toLowerCase())
            {
                $('#hdnBank').val(StrBankListAdmin[i].BankId);
                $('#txtBank').val(StrBankListAdmin[i].Bankname);
                break;
            }
            else
            {
                $('#hdnBank').val(' ');
                $('#txtBank').val('');
            }
        }
        for (var i = 0; i < StrBankListAdmin.length; ++i) {
            if (StrBankListAdmin[i].Bankname.substring(0, StrCheckBanks.length).toLowerCase() === StrCheckBanks.toLowerCase())
            {
                $('#hdnBank').val(StrBankListAdmin[i].BankId);
                $('#txtBank').val(StrBankListAdmin[i].Bankname);
                break;
            }
        }
    }
    else {
        $('#hdnBank').val(StrBankListAdmin[0].BankId);
        $('#txtBank').val(StrBankListAdmin[0].Bankname);
    }
})

//==============CheckTransactionCodes=======================//

function funCheckTransCode(value) {
    var StrCheckTransCode = $('#TRValue_' + value).val();
    if (StrCheckTransCode != '') {
        for (var i = 0; i < GetTransactionAdmin.length; i++) {
            if (GetTransactionAdmin[i].TransValue == StrCheckTransCode) {
                $('#TRValue_' + value).val(GetTransactionAdmin[i].TransValue);
                $('#hdn_' + value).val(GetTransactionAdmin[i].TransactionValueID);
                break;
            }
            else {
                $('#hdn_' + value).val(' ');
                $('#TRValue_' + value).val('');

            }
        }

        for (var i = 0; i < GetTransactionAdmin.length; i++) {
            if (GetTransactionAdmin[i].TransValue.substring(0, StrCheckTransCode.length) === StrCheckTransCode) {
                $('#TRValue_' + value).val(GetTransactionAdmin[i].TransValue);
                $('#hdn_' + value).val(GetTransactionAdmin[i].TransactionValueID);
                break;
            }
        }
    }
    else {
        $('#TRValue_' + value).val(GetTransactionAdmin[0].TransValue);
        $('#hdn_' + value).val(GetTransactionAdmin[0].TransactionValueID);

    }
}

//==================CheckUserExistance===================//
$('#txtUserEmail').blur(function () {
    CheckExistingAdminUsr();
});

function CheckExistingAdminUsr() {
    var AdminUsr = $('#txtUserEmail').val();

    $.ajax({
        url: APIUrlCheckExistingUser + '?Email=' + AdminUsr,
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',

    })

   .done(function (response)
   { funUserCheckAdminUsrSucess(response); })



       .fail(function (error)
       { ShowMSG(error); })
}

function funUserCheckAdminUsrSucess(response){
  //  alert(response);
    if (response != 0) {
       // $('#txtUserEmail').val('');
        strUserIdAlready = response;
        ShowDivAdduserinprod();
    }
    else {

    }

}

function ShowDivAdduserinprod() {
    $('#AdminProductionAccess').show();
    $('#fade').show();
}
//=====================
function funAddUserForProduction()
{
   // alert(localStorage.AdminProdId);
    $.ajax({
        url: APIUrlfunAddUserForProduction + '?AdminUserid=' + strUserIdAlready + '&ProdID=' + localStorage.AdminProdId + '&EmailId=' + $('#txtUserEmail').val() + '&ProdcutionName=' + $('#spnProdName').text(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',

    })

 .done(function (response)
 { funAddUserForProductionSucess(response); })

     .fail(function (error)
     { ShowMSG(error); })
}
function funAddUserForProductionSucess(response)
{
    if ($('#AdminProductionAccess').css('display') == 'block')
    {
        $('#AdminProductionAccess').hide();
        $(location).attr('href', 'Users');
    }
    funInsertOnlyCausersbyemailID();
    
}

function funInsertOnlyCausersbyemailID()
{
    $.ajax({
        url: APIUrlfunInsertOnlyCausersbyemailID + '?AdminUserid=' + strUserIdAlready + '&EmailID=' + $('#txtUserEmail').val() + '&ProdID=' + localStorage.AdminProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ funInsertOnlyCausersbyemailIDSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function funInsertOnlyCausersbyemailIDSucess(response)
{
 

    ShowMsgBox('showMSG', 'User Added Successfully for this Production ..!!', '', '');
    $(location).attr('href', 'Users');

}

//===============================//

function CheckExistingUser() {
    var EE = $('#txtUserEmail').val();

    $.ajax({
        url: APIUrlCheckExistingEmailId + '?Email=' + EE,
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',

    })

   .done(function (response)
   { funCheckExistingEmailSucess(response); })
       .fail(function (error)
       { ShowMSG(error); })
}
function funCheckExistingEmailSucess(response) {

    if (response == 0) {
        //$('#txtUserEmail').val('');
        //$('#txtUserEmail').focus();
        //  ShowMsgBox('showMSG', 'User Already exist.. !!', '', '');
        //SendEmail

    }
    else {

    }
}