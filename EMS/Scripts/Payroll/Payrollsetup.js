//----------------------- Api Calling----------------------------------//
var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlInsertUpdatePayrollfreeFields = HOST + "/api/Payroll/InsertUpdatePayrollfreeFields";
var APIUrlFunSaveAllBankDetails = HOST + "/api/Payroll/insertUpdatepayrollbanksetup";
//var APIUrlGetPayrollBankdetailbyProdID = HOST + "/api/Payroll/GetPayrollBankdetailbyProdID";
var APIUrlGetPayrollBankdetailbyProdID = HOST + "/api/Payroll/GetBankSetupByProdID";

var APIUrlGetPayrollOffsetsbyCompanyId = HOST + "/api/Payroll/GetPayrollOffsets";
var APIUrlSaveAddOffset = HOST + "/api/Payroll/InsertUpdateAddOffsets";
var APIUrlGetPayrollFringebyCompanyId = HOST + "/api/Payroll/GetPayrollFringeByCompanyID";
var APIUrlInsertFringeDetails = HOST + "/api/Payroll/InsertUpdateFringeByCompanyId";
var APIUrlTransCodeAutoFill = HOST + "/api/Payroll/GetTransCodeForPayroll";
var APIUrlfunGetfreeFields = HOST + "/api/Payroll/GetPayrollFreeFieldByCompanyId";
var APIUrlAutoFillAccount = HOST + "/api/Payroll/GetSuspenseAccountbyProdId";
var APIUrlFringeAutofill = HOST + "/api/BudgetOperation/GetAccountNameForBudget";
var APIUrlTransCode = HOST + "/api/CompanySettings/GetTransactionValueFillByID";
var APIUrlFillPayrollTransactionCode = HOST + "/api/Payroll/GetTransCodeForPayroll";
var APIUrlTransCodeAutoFillFreeField = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlFillCompanyDetails = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlInsertUpdatePayrollFringeTrans = HOST + "/api/Payroll/InsertUpdateTransValueByCompanyId";


var APIUrlGetCOAForBank = HOST + "/api/CompanySettings/GetCOABySegmentAccountsBank"; //
var APIUrlGetClearingAccount = HOST + "/api/CompanySettings/GetCOAForClearing";
var APIUrlSaveClearingAccounts = HOST + "/api/CompanySettings/InsertUpdateClearingAccount";
var APIUrlClearingAccountList = HOST + "/api/CompanySettings/GetCleringAccountById";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";


var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlGetSettingBankAccounts = HOST + "/api/CompanySettings/SettingBankAccounts";

//Global  Varable 
var currenttab = "";
var PublicCompanyID = 0;
var pubArrTraCode = [];
//end Global Decelaration
var TransactionCodeArr = [];
var ObjTransVal = {};
var FinalObjArray = [];
var strFringId = 0;
var strUserId = 0;
var strPayrollKeyId = 0;

var ArrSegment = [];
var strgetcoaId = [];
var GlbCOAList = [];
var strFocusCode = '';
var strFocusOutCode = '';

$(document).ready(function () {
    $('#frmCompanyPayrollSetup').hide();
    $('#SaveSetupBank').hide();

    GetSegmentsDetails();
    PublicCompanyID = 0;
    $('#SaveSetupfringe').attr('style', 'display:none;');
    //  $('#SaveSetupoffset').attr('style','display:none;');
    $('#SaveSetupkey').attr('style', 'display:none;');
    //$('#SaveSetupBank').attr('style', 'display:block;');
    $('#ShowBnkBtnLi').addClass('active');
    EmptyPayrollFreeFieldTextbox();
    currenttab = "Banktab";
    //GetCompanyId();
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlCompanyList({
        'callback': Oncompanychange
        , 'existingValue': parseInt(JSON.parse(localStorage.PayrollAudit || '{}').ShowPayrollHistoryCompanyID)
    }));

    funShowSavedPayrollBankData();
    GetPayrollFringebyCompanyId();
    funGetfreeFields();
   // funPassCompanyCode();

});

//--------- .focus Event----------------------//

$('#txtBank').focus(function () {
    FillBankDetails();
})
$('#txtCurrency').focus(function () {
    FillCurrencyDetails();

})
$('#txtPrSource').focus(function () {
    FillPRSourceDetails();
})
$('#txtArSource').focus(function () {
    FillARSourceDetails();
})

$('#keystab').focus(function () {
    TransCodeAutoFillFreeField();
})

$('#txtDsAccount').focus(function () {
    //  FunAutofillAccount('Ledger'); 
})
$('#txtSubAccount').focus(function () {
    //FunAutofillAccount('Detail'); 
})
$('#txtContSubAccount').focus(function () {
    // FunAutofillAccount('Detail');
})

$('#txtOffsetAccountAdd').focus(function () {
    SuspenseAutoFillFreeField();
})

$('#txtLOId').focus(function () {
    LOAutofill('Location');
})

$('#txtEpiId').focus(function () {
    LOAutofill('Episode');
})
$('#txtSet').focus(function () {
    LOAutofill('Set');
})
$('#txtbanana').focus(function () {
    BananaAutofill();
})

$('#txtStart').focus(function () {
    SuspenseAutoFillFreeField();
})
$('#txtEND').focus(function () {
    SuspenseAutoFillFreeField();
})

$('#ABXZ').focus(function () {
    TransCodeAutoFillFreeField();
})

$('#chkTransactionCode').change(function () {
    FillPayrollTransactionCode();
})


//-----------------Fill Currency-----------------//
//function FillCurrencyDetails() {
//    $.ajax({
//        url: APIUrlFillCurrencyDetails + '?ProdId=' + localStorage.ProdId,
//        cache: false,
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },
//        type: 'POST',
//        async: false,
//        contentType: 'application/json; charset=utf-8',
//    })

//     .done(function (response)
//     { FillCurrencyDetailsSucess(response); })
//     .fail(function (error)
//     { ShowMSG(error); })
//}
//function FillCurrencyDetailsSucess(response) {
//    var ProductListjson = response;
//    var array = response.error ? [] : $.map(response, function (m) {
//        return {
//            value: m.CurrencyID,
//            label: m.CurrencyName,
//        };
//    });
//    $(".SearchCurrency").autocomplete({
//        minLength: 0,
//        source: array,
//        focus: function (event, ui) {

//            $("#hdnCurrency").val(ui.item.value);
//            $('#txtCurrency').val(ui.item.label);
//            return false;
//        },
//        select: function (event, ui) {

//            $("#hdnCurrency").val(ui.item.value);
//            $('#txtCurrency').val(ui.item.label);
//            return false;
//        },
//        change: function (event, ui) {
//            if (!ui.item) {
//                $(this).val('');
//                $("#hdnCurrency").val('');
//                $('#txtCurrency  ').val('');
//            }
//        }
//    })
//}
//---------------Filling Bank Details----------------//
function FillBankDetails() {
    $.ajax({
        url: APIUrlFillBankDetails + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillBankDetailsSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillBankDetailsSucess(response) {
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
                //$("#hdnBank").val('');
                //$('#txtBank').val('');
            }
        }
    })
}

//----------------Save Button free Fields---------------------//
$('#SaveSetupkey').click(function () {
    funInsertUpdatefreefield();

})
// ---------- Save button Bank -----------------------//

$('#SaveSetupBank').click(function () {
    var strval0 = $('#hdnCOACode_0').val();
    var strval1 = $('#hdnCOACode_1').val();
    var strval2 = $('#hdnCOACode_2').val();
    if (strval0 == strval1 == strval2) {
        var Msg = 'Please Select Different COA  !!';
        ShowMsgBox('showMSG', Msg, '', '');
    }
    else
    {
        FunSaveAllBankDetails();
    }
})
//--------save Button Fringe-------------------//
$('#SaveSetupfringe').click(function () {
    InsertUpdateFringByProdId();
})

//----------------save funtion Insert Update free field----------------//

function funInsertUpdatefreefield() {
    var objpayrollkeys = {
        PayrollFreeFieldID: strPayrollKeyId,

        FreeField1: $("#txtFreeField1").attr("name"),
        FreeField2: $("#txtFreeField2").attr("name"),
        FreeField3: $("#txtFreeField3").attr("name"),
        createdby: localStorage.UserId,
        ProdID: localStorage.ProdId,
        CompanyId: $('select#ddlCompany option:selected').val()
        //CompanyId: $('select#PayrollDropdownId option:selected').val()
}
    $.ajax({
        url: APIUrlInsertUpdatePayrollfreeFields,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(objpayrollkeys),
    })
    .done(function (response) {
        funInsertUpdatefreefieldSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function funInsertUpdatefreefieldSucess(response) {
    var Msg = 'Free Field Saved Sucessfully !!';
    ShowMsgBox('showMSG', Msg, '', '');
    console.log(response);
    function ShowMSG(error) {
        console.log(error);
    }
}

//-----------------Show bank tab-------------//
function showbtnbank() {
    EmptyPayrollFreeFieldTextbox();
    currenttab = "Banktab";
    $('#Lisetuppage').text('Bank');
    $('#tabBank').attr('style', 'display:block;');
    $('#tabFringe').attr('style', 'display:none;');
    $('#tabOffsets').attr('style', 'display:none;');
    $('#tabKeys').attr('style', 'display:none;');

    $('#SaveSetupfringe').attr('style', 'display:none;');

    $('#SaveSetupkey').attr('style', 'display:none;');
    //$('#SaveSetupBank').attr('style', 'display:block;');
    $('#SaveClearingAccount').attr('style', 'display:none;');

    $('#ShowBnkBtnLi').addClass('active');
    $('#ShowFringBtnLi').removeClass('active');
    $('#ShowOffsetBtnLi').removeClass('active');
    $('#showbtnkeyLi').removeClass('active');

    $('#showClearingLi').removeClass('active');
    $('#AccountClearing').attr('style', 'display:none;');
    funShowSavedPayrollBankData();
    funTrCreate();
}
//------------------Show Fringe Tab--------------//
function showbtnfringtable() {
    currenttab = "FringeTabletab";
    $('#Lisetuppage').text('Fringe Table');

    $('#tabFringe').attr('style', 'display:block;');
    $('#tabBank').attr('style', 'display:none;');
    $('#tabOffsets').attr('style', 'display:none;');
    $('#tabKeys').attr('style', 'display:none;');

    $('#SaveSetupBank').attr('style', 'display:none;');
    $('#SaveSetupkey').attr('style', 'display:none;');
    $('#SaveSetupfringe').attr('style', 'display:block;');
    $('#SaveClearingAccount').attr('style', 'display:none;');

    $('#ShowFringBtnLi').addClass('active');
    $('#ShowBnkBtnLi').removeClass('active');
    $('#ShowOffsetBtnLi').removeClass('active');
    $('#showbtnkeyLi').removeClass('active');
    $('#showClearingLi').removeClass('active');
    $('#AccountClearing').attr('style', 'display:none;');
    GetPayrollFringebyCompanyId();
    AddRangeCancel();
}
//-----------------Show Offset Tab---------//
function showbtnoffset() {
    currenttab = "Offsetskeytab";
    $('#Lisetuppage').text('Offsets');
    $('#tabOffsets').attr('style', 'display:block;');
    $('#tabFringe').attr('style', 'display:none;');
    $('#tabBank').attr('style', 'display:none;');
    $('#tabKeys').attr('style', 'display:none;');
    $('#SaveSetupBank').attr('style', 'display:none;');
    $('#SaveSetupfringe').attr('style', 'display:none;');
    $('#SaveSetupkey').attr('style', 'display:none;');
    $('#SaveClearingAccount').attr('style', 'display:none;');
    $('#ShowOffsetBtnLi').addClass('active');
    $('#ShowBnkBtnLi').removeClass('active');
    $('#ShowFringBtnLi').removeClass('active');
    $('#showbtnkeyLi').removeClass('active');
    $('#showClearingLi').removeClass('active');
    $('#AccountClearing').attr('style', 'display:none;');
    $('#showClearingLi').removeClass('active');
    $('#AccountClearing').attr('style', 'display:none;');
    GetPayrollOffsetsbyCompanyId();
    OffsetCodeCancel();

}

//-----------Show Free Fields Tab------------//
function showbtnkey() {
    currenttab = "keystab";
    $('#Lisetuppage').text('Keys');
    $('#tabKeys').attr('style', 'display:block;');
    $('#tabFringe').attr('style', 'display:none;');
    $('#tabBank').attr('style', 'display:none;');
    $('#tabOffsets').attr('style', 'display:none;');
    $('#SaveSetupfringe').attr('style', 'display:none;');
    $('#SaveSetupkey').attr('style', 'display:block;');
    $('#SaveClearingAccount').attr('style', 'display:none;');
    $('#showbtnkeyLi').addClass('active');
    $('#ShowBnkBtnLi').removeClass('active');
    $('#ShowFringBtnLi').removeClass('active');
    $('#ShowOffsetBtnLi').removeClass('active');
    $('#showClearingLi').removeClass('active');
    $('#AccountClearing').attr('style', 'display:none;');
    Oncompanychange(); // This should be replaced with better logic
    $('#SaveSetupBank').attr('style', 'display:none;');
}

//=========================================================== Show Clearing
function funClearing() {
    currenttab = "Clearingtab";
    $('#Lisetuppage').text('Fringe Table');

    $('#tabFringe').attr('style', 'display:none;');
    $('#AccountClearing').attr('style', 'display:block;');

    $('#tabBank').attr('style', 'display:none;');
    $('#tabOffsets').attr('style', 'display:none;');
    $('#tabKeys').attr('style', 'display:none;');

    $('#SaveSetupBank').attr('style', 'display:none;');
    $('#SaveSetupkey').attr('style', 'display:none;');
    $('#SaveSetupfringe').attr('style', 'display:block;');
    $('#SaveClearingAccount').attr('style', 'display:block;');

    $('#ShowFringBtnLi').removeClass('active');
    $('#ShowBnkBtnLi').removeClass('active');
    $('#ShowOffsetBtnLi').removeClass('active');
    $('#showbtnkeyLi').removeClass('active');
    $('#showClearingLi').addClass('active');
    
}


//------------showsaved data of Free Fields--------------//
function funGetfreeFields() {
    $.ajax({
        url: APIUrlfunGetfreeFields + '?CompanyID=' + $('#ddlCompany').val(),
        //url: APIUrlfunGetfreeFields + '?CompanyID=' + $('#PayrollDropdownId').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funGetfreeFieldsSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function funGetfreeFieldsSucess(response) {
    var TLength = response.length;
    if (TLength > 0) {
        $('#txtFreeField1').val(response[0].FF1Val);
        $('#hdnFreeField1').val(response[0].FreeField1);
        $('#txtFreeField2').val(response[0].FF2Val);
        $('#hdnFreeField2').val(response[0].FreeField2);
        $('#txtFreeField3').val(response[0].FF3Val);
        $('#hdnFreeField3').val(response[0].FreeField3);
    }
    $('#frmCompanyPayrollSetup').removeClass('hidden');

}

function ShowMSG(error) {
    console.log(error);
}

//-----------saveAllBankdetails----------------//

function FunSaveAllBankDetails() {
    var objpayrollbankdata = {
        PayrollBankSetupid: strPayrollKeyId,
        DefaultCompanyID: $('select#ddlCompany option:selected').val(),
        //DefaultCompanyID: $('select#PayrollDropdownId option:selected').val(),
        DefaultBankId: $('#hdnBank').val(),
        PRSource: $('#txtPrSource').val(),
        APSource: $('#txtArSource').val(),
        VendorID: $('#hdnVendorID').val(),
        createdby: localStorage.UserId,
        ProdID: localStorage.ProdId,
    }
    $.ajax({
        url: APIUrlFunSaveAllBankDetails,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(objpayrollbankdata),
    })
.done(function (response)
{ FunSaveAllBankDetailsSucess(response); })

.fail(function (error)
{ ShowMSG(error); })
}
function FunSaveAllBankDetailsSucess(response) {
    StrBankInfo = response;
    funSaveClearingAccounts(StrBankInfo);
    var Msg = 'Payroll Bank Setup Saved  !!';
    ShowMsgBox('showMSG', Msg, '', '');
    console.log(response);
   // funSaveClearingAccounts();
    function ShowMSG(error) {
        console.log(error);
    }
}

//------------showsaved Bank data ----------------//
function funShowSavedPayrollBankData() {
    var strCompany = $('#ddlCompany').val();
    //var strCompany = $('#PayrollDropdownId').val();
    $.ajax({
        url: APIUrlGetPayrollBankdetailbyProdID + '?CompanyID=' + strCompany + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funShowSavedPayrollBankDataSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funShowSavedPayrollBankDataSucess(response) {
    $('#txtBank').val('');
    $('#hdnBank').val('');
    $('#txtVendor').val('');
    $('#hdnVendorID').val('');
    //$('#txtDsAccount').val('');
    //$('#txtSubAccount').val('');
    //$('#txtContSubAccount').val('');
    //$('#txtSubAccount').val('');
    GetClearingAccountList();

    CompanyCode = $('select#ddlCompany option:selected').val();
    //CompanyCode = $('select#PayrollDropdownId option:selected').val();
    var TLength = response.length;
    if (TLength > 0) {
        $('#txtBank').val(response[0].Bankname);
        $('#hdnBank').val(response[0].BankId);
        $('#txtVendor').val(response[0].VendorName);
        $('#hdnVendorID').val(response[0].VendorID);
      
        $('#frmCompanyPayrollSetup').removeClass('hidden');
    } else {
        // var Msg = 'Please save data for company!!';
        // ShowMsgBox('showMSG', Msg, '', '');
    }
}
function ShowMSG(error) {
    console.log(error);
}

//-------------------------offsets function

function GetPayrollOffsetsbyCompanyId() {
    $.ajax({
        url: APIUrlGetPayrollOffsetsbyCompanyId + '?CompanyID=' + $('#ddlCompany').val(),
        //url: APIUrlGetPayrollOffsetsbyCompanyId + '?CompanyID=' + $('#PayrollDropdownId').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPayrollOffsetsbyCompanyIdSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function ShowMSG(error) {
    console.log(error);
}

function GetPayrollOffsetsbyCompanyIdSucess(response) {
    var strHtml = '';
    var tcount = response.length;
    for (var i = 0; i < tcount; i++) {
        var PayrollOffsetID = response[i].PayrollOffsetID;
        var OffsetType = response[i].OffsetType;
        var OffsetAccount = response[i].AccountCode;
        var Offsetdescription = response[i].Offsetdescription;
        var Active = response[i].Active;

        var checkedstatus = '';
        if (Active == true) {
            checkedstatus = "checked";
        }
        strHtml += '<tr id=tr' + PayrollOffsetID + ' class="trshow">';

        strHtml += '<a class="transshow" href="#" id=a' + PayrollOffsetID + ';>' + OffsetType + '</a>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtOffsetType' + PayrollOffsetID + ' style="display:none;" value=' + OffsetType + '><span class="transshow" id=aOffsetType' + PayrollOffsetID + '>' + OffsetType + '</span></td>';
        strHtml += '<td><input class=" transhide form-control" type="text" id=txtdesc' + PayrollOffsetID + ' style="display:none;" value=' + OffsetAccount + '><span class=" transshow" id=adesc' + PayrollOffsetID + '>' + OffsetAccount + '</span></td>';

        strHtml += '<td><input class="transhide form-control" type="text" id=txtoffdesc' + PayrollOffsetID + ' style="display:none;" value=' + Offsetdescription + '><span class="transshow" id=aoffdesc' + PayrollOffsetID + '>' + Offsetdescription + '</span></td>';

        strHtml += '<td><input ' + checkedstatus + ' type="checkbox" id="chktrasfield' + PayrollOffsetID + '" value="' + OffsetType + '";/> </td>';
        // strHtml += '<td><a href="#" id=aedit' + PayrollOffsetID + ' onclick="javascript:EditOffsets(' + PayrollOffsetID + ');"  class="transshow btn btn-warning  pull-left marginright11"><i class="fa fa-pencil"></i></a><div id=asave' + PayrollOffsetID + ' class="transhide" style="display:none;"><a href="javascript:UpdateOffsets(' + PayrollOffsetID + ');"class="btn btn-success"><i class="fa  fa-check"></i></a>  <a href="javascript:OffsetCodeCancel();" class="btn btn-primary"><i class="fa fa-close"></i></a></div></td>';
        strHtml += '<td><a href="#" id=aedit' + PayrollOffsetID + ' class="transshow btn btn-warning  pull-left marginright11"><i class="fa fa-pencil"></i></a><div id=asave' + PayrollOffsetID + ' class="transhide" style="display:none;"><a href="javascript:UpdateOffsets(' + PayrollOffsetID + ');"class="btn btn-success"><i class="fa  fa-check"></i></a>  <a href="javascript:OffsetCodeCancel();" class="btn btn-primary"><i class="fa fa-close"></i></a></div></td>';
        strHtml += '</tr>';
    }
    $('#PayrolloffsetsTBody').html(strHtml);
}
function TransFieldStatus(TranCodeID) {
    var StatusValue = 0;
    StatusValue = $('#chkTrasField' + TranCodeID).prop('checked');
    $.ajax({
        url: APIUrlTransactionFieldStatus + '?TransactionCodeID=' + TranCodeID + '&Status=' + StatusValue,
        cache: false,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
}
function TransactionCodeCheckSucess(response) {
    if (response != 0) {
        ShowMsgBox('showMSG', 'Transaction Code Already Exists !!', '', 'failuremsg');
        $('#txtOffsettypeAdd').val('');
    }
}
//----------------Save Add Offsets-------------//
function SaveAddOffset() {
    var isvalid = "";
    isvalid += CheckRequired($("#txtOffsettypeAdd"));
    isvalid += CheckRequired($("#txtOffsetAccountAdd"));
    isvalid += CheckRequired($("#txtOffTranDecAdd"));
    if (isvalid == "") {
        var StatusValue = 0;
        var PayrollOffsetID1 = 0;
        StatusValue = $('#chkOffsetAccountAdd').prop('checked');
        ObjPayrollOffset = {
            PayrollOffsetID: PayrollOffsetID1,
            OffsetType: $('#txtOffsettypeAdd').val(),
            OffsetAccount: $("#txtOffsetAccountAdd").attr("name"),
            Offsetdescription: $('#txtOffTranDecAdd').val(),
            Active: StatusValue,
            CreatedBy: localStorage.UserId,
            ProdID: localStorage.ProdId,
            CompanyId: $('select#ddlCompany option:selected').val()
            //CompanyId: $('select#PayrollDropdownId option:selected').val()
    }

        $.ajax({
            url: APIUrlSaveAddOffset,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            sync: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjPayrollOffset),
        })
        .done(function (response) {
            SaveAddOffsetSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function SaveAddOffsetSucess(response) {
    ShowMsgBox('showMSG', 'Offset Added!!!.', '', '');
    showbtnoffset();
    $('#trAddOffsets').hide();
    GetPayrollOffsetsbyCompanyId();
}
function addNewOffset() {
    $('#Lisetuppage').text('Add Offset');
    $('.trshow').removeClass("saveBg");
    $('.transhide').attr("style", 'display:none;');
    $('.transshow').attr("style", 'display:block;');
    $('#trAddOffsets').attr('style', 'display:table-row;');
    $("#AddOffsets").css("background", "#4CBF63");
    $("#chkOffsetAccountAdd").prop("checked", true);
    EmptyPayrollOffsets();
}

//-------------Company  Dropdown------//
/*
function GetCompanyId() {
    $.ajax({
        url: APIUrlFillCompanyDetails + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })

      .done(function (response)
      { GetCompanyIdSucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
}

function GetCompanyIdSucess(response) {
    var TLength = response.length;
    for (var i = 0; i < TLength; i++) {
        var CompanyID = response[i].CompanyID;
        var CompanyName = response[i].CompanyName;
        if (i == 0) {
            PublicCompanyID = CompanyID;
        }
        $("#PayrollDropdownId").append("<option  value=" + CompanyID + " name=" + response[i].CompanyCode + ">" + CompanyName + "</option>");
    }
}
*/
//-----------Empty Free Fields textbox-------------//
function EmptyPayrollFreeFieldTextbox() {
    $('#txtFreeField1').val('');
    $('#txtFreeField2').val('');
    $('#txtFreeField3').val('');
}
//-----------Empty Offsets textbox-------------//
function EmptyPayrollOffsets() {
    $('#txtOffsettypeAdd').val('');
    $('#txtOffsetAccountAdd').val('');
    $('#txtOffTranDecAdd').val('');

}
//-----------Company onchange-------------//
function Oncompanychange() {
    $('#frmCompanyPayrollSetup').hide();
    $('#SaveSetupBank').hide();
    $('#tblAccountClearing').html('');
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        //, 'PayrollAuditID': PayrollFileID
    //, 'PrePage': 'RCP'
        //, 'PRPeriod': PRPeriod
        //, 'PayrollInvoiceNo': InvoiceNo
    });

    if (currenttab == "keystab") {
        EmptyPayrollFreeFieldTextbox();
        funGetfreeFields();
    } else if (currenttab == "Banktab") {
        funTrCreate();
       // funPassCompanyCode();
        funShowSavedPayrollBankData();
    } else if (currenttab == "Offsetskeytab") {
        OffsetCodeCancel();
        GetPayrollOffsetsbyCompanyId();
    } else if (currenttab == "FringeTabletab") {
        $('#trAddRange').attr('style', 'display:none;');
        GetPayrollFringebyCompanyId();
    } else if (currenttab == "Clearingtab") {
        // $('#trAddRange').attr('style', 'display:none;');
        GetClearingAccountList();
    }
    $('#frmCompanyPayrollSetup').show();
    $('#SaveSetupBank').show();
}

//----------------EditPayrollOffsets------------//
function EditOffsets(PayrollOffsetID) {
    $('.trshow').removeClass("saveBg");
    $('.transhide').attr("style", 'display:none;');
    $('.transshow').attr("style", 'display:block;');
    $('#trAddOffsets').attr('style', 'display:none;');
    $('#txtdesc').addClass('SearchSuspenseAccount;');
    $('#tr' + PayrollOffsetID).addClass("saveBg");
    $('#a' + PayrollOffsetID).attr('style', 'display:none');
    $('#txtOffsetType' + PayrollOffsetID).attr('style', 'display:block');
    $('#txtdesc' + PayrollOffsetID).attr('style', 'display:block');
    $('#txtoffdesc' + PayrollOffsetID).attr('style', 'display:block');
    $('#aOffsetType' + PayrollOffsetID).attr('style', 'display:none');
    $('#adesc' + PayrollOffsetID).attr('style', 'display:none');
    $('#aoffdesc' + PayrollOffsetID).attr('style', 'display:none');
    $('#aedit' + PayrollOffsetID).attr('style', 'display:none');
    $('#asave' + PayrollOffsetID).attr('style', 'display:block');
    $('#AddOffsets').attr('style', 'display:block;');
}
//----------------Update PayrollOffsets------------//
function UpdateOffsets(PayrollOffsetID) {
    var isvalid = "";
    isvalid += CheckRequired($("#txtOffsetType" + PayrollOffsetID));
    isvalid += CheckRequired($("#txtdesc" + PayrollOffsetID));
    isvalid += CheckRequired($("#txtoffdesc" + PayrollOffsetID));
    var StatusValue = 0;
    StatusValue = $('#chktrasfield' + PayrollOffsetID).prop('checked');
    if (isvalid == "") {
        ObjOffsetkey = {
            PayrollOffsetID: PayrollOffsetID,
            OffsetType: $("#txtOffsetType" + PayrollOffsetID).val(),
            OffsetAccount: $("#txtdesc" + PayrollOffsetID).val(),
            Offsetdescription: $("#txtoffdesc" + PayrollOffsetID).val(),
            Active: StatusValue,
            createdby: localStorage.UserId,
            ProdID: localStorage.ProdId,
            CompanyID: $('select#ddlCompany option:selected').val()
            //CompanyID: $('select#PayrollDropdownId option:selected').val()
    }
        $.ajax({
            url: APIUrlUpdateOffsets,
            cache: false,
            type: 'POST',
            sync: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjOffsetkey),
        })
        ShowMsgBox('showMSG', 'Offset Updated Sucessfully.', '', '');
        // GetPayrollOffsetsbyCompanyId();
    }
}
//----------------Cancel PayrollOffsets------------//
function OffsetCodeCancel() {
    $('#Lisetuppage').text('Offset');
    $('#txtOffsettypeAdd').val(''),
    $('#txtOffsetAccountAdd').val(''),
    $('#txtOffTranDecAdd').val(''),
    $('#trAddOffsets').attr('style', 'display:none;');
    $('.trshow').removeClass("saveBg");
    $('.transhide').attr("style", 'display:none;');
    $('.transshow').attr("style", 'display:block;');
    $('#AddOffsets').attr('style', 'display:block;');
}
//----------------Add Range--------------//

function addNewRange() {
    $('#txtLOId').val(''),
    $('#txtEpiId').val(''),
    $('#txtStart').val(''),
     $('#txtEND').val(''),
    $('#txtSet').val(''),
    $('#txtbanana').val(''),
    $('#txtFringeAccount').val(''),
    $('#Lisetuppage').text('Add Range');
    $('.trshow').removeClass("saveBg");
    $('.transhide').attr("style", 'display:none;');
    $('.transshow').attr("style", 'display:block;');
    $('#trAddRange').attr('style', 'display:table-row;');
    $("#AddRange").css("background", "#4CBF63");
}
//------------Cancel AddRange------------//

function AddRangeCancel() {
    $('#Lisetuppage').text('Fringe Table');
    $('#txtLOId').val(''),
    $('#txtEpiId').val(''),
    $('#txtStart').val(''),
    $('#txtEND').val(''),
    $('#txtSet').val(''),
    $('#txtbanana').val(''),
    $('#txtFringeAccount').val(''),
    $('#trAddRange').attr('style', 'display:none;');
    $('.trshow').removeClass("saveBg");
    $('.transhide').attr("style", 'display:none;');
    $('.transshow').attr("style", 'display:block;');
    $('#AddRange').attr('style', 'display:block;');

}
//------------Update AddRange------------//

function UpdateFringeAddrange(PayrollFringetableID) {
    var isvalid = "";
    isvalid += CheckRequired($("#txtfringeCCOA" + PayrollFringetableID));
    isvalid += CheckRequired($("#txtToCOA" + PayrollFringetableID));
    isvalid += CheckRequired($("#txtFrAcount" + PayrollFringetableID));
    if (isvalid == "") {
        ObjAddRange = {
            PayrollFringetableID: PayrollFringetableID,
            FromCOA: $("#txtfringeCCOA" + PayrollFringetableID).val(),
            ToCOA: $("#txtToCOA" + PayrollFringetableID).val(),
            FringeCOA: $("#txtFrAcount" + PayrollFringetableID).val(),
            CreatedBy: localStorage.UserId,
            ProdID: localStorage.ProdId,
            //CompanyID: $('select#PayrollDropdownId option:selected').val()
            CompanyID: $('select#ddlCompany option:selected').val()
    }
        $.ajax({
            url: APIUrlUpdateFringeAddrange,
            cache: false,
            type: 'POST',
            sync: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjAddRange),
        })
        ShowMsgBox('showMSG', 'Fringe Updated Sucessfully.', '', '');
    }
}

//------------ EditAddFringe-------------//

function EditFringe(PayrollFringetableID) {
    $('.trshow').removeClass("saveBg");
    $('.transhide').attr("style", 'display:none;');
    $('.transshow').attr("style", 'display:block;');
    $('#trAddRange').attr('style', 'display:none;');
    $('#tr' + PayrollFringetableID).addClass("saveBg");
    $('#a' + PayrollFringetableID).attr('style', 'display:none');
    $('#txtfringeCCOA' + PayrollFringetableID).attr('style', 'display:block');
    $('#txtToCOA' + PayrollFringetableID).attr('style', 'display:block');
    $('#txtFrAcount' + PayrollFringetableID).attr('style', 'display:block');

    $('#afringeCCOA' + PayrollFringetableID).attr('style', 'display:none');
    $('#aToCOA' + PayrollFringetableID).attr('style', 'display:none');
    $('#aFrAcount' + PayrollFringetableID).attr('style', 'display:none');
    $('#aedit' + PayrollFringetableID).attr('style', 'display:none');
    $('#asave' + PayrollFringetableID).attr('style', 'display:block');
    $('#AddRange').attr('style', 'display:block;');
}
//--------------Get Add Range------------//

function GetPayrollFringebyCompanyId() {
    $.ajax({
        url: APIUrlGetPayrollFringebyCompanyId + '?CompanyID=' + $('#ddlCompany').val(),
        //url: APIUrlGetPayrollFringebyCompanyId + '?CompanyID=' + $('#PayrollDropdownId').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPayrollFringebyCompanyIdSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function ShowMSG(error) {
    console.log(error);
}

function GetPayrollFringebyCompanyIdSucess(response) {
    var strHtml = '';
    var tcount = response.length;

    for (var i = 0; i < tcount; i++) {
        var PayrollFringeHeaderID = response[i].PayrollFringetableID;
        var LOId = response[i].LOCode;
        var EpiId = response[i].EpiCode;
        var StartRange = response[i].StartRangeCode;
        var EndRange = response[i].EndRangeCode;
        var SetId = response[i].SetCode;
        var BananasId = response[i].BanasCode;
        var TransactionCode = "";
        var FringeAccount = response[i].FringCode;
        strHtml += '<tr id=tr' + PayrollFringeHeaderID + ' class="trshow">';
        strHtml += '<a class="transshow" href="#" id=a' + PayrollFringeHeaderID + ';>' + LOId + '</a>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtLO' + PayrollFringeHeaderID + ' style="display:none;" value=' + LOId + '><span class="transshow" id=aTxtLO' + PayrollFringeHeaderID + '>' + LOId + '</span></td>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtEpi' + PayrollFringeHeaderID + ' style="display:none;" value=' + EpiId + '><span class="transshow" id=aEpi' + PayrollFringeHeaderID + '>' + EpiId + '</span></td>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtstartrange' + PayrollFringeHeaderID + ' style="display:none;" value=' + StartRange + '><span class="transshow" id=astartrange' + PayrollFringeHeaderID + '>' + StartRange + '</span></td>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtEndRange' + PayrollFringeHeaderID + ' style="display:none;" value=' + EndRange + '><span class="transshow" id=aEndRange' + PayrollFringeHeaderID + '>' + EndRange + '</span></td>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtSet' + PayrollFringeHeaderID + ' style="display:none;" value=' + Set + '><span class="transshow" id=aSet' + PayrollFringeHeaderID + '>' + SetId + '</span></td>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtBananas' + PayrollFringeHeaderID + ' style="display:none;" value=' + BananasId + '><span class="transshow" id=aBananas' + PayrollFringeHeaderID + '>' + BananasId + '</span></td>';
        strHtml += '<td><input class="transhide form-control" type="checkbox" id=txttransactionCode' + PayrollFringeHeaderID + ' style="display:none;" value=' + TransactionCode + '><span class="transshow" id=atransactionCode' + PayrollFringeHeaderID + '>' + TransactionCode + '</span></td>';
        strHtml += '<td><input class="transhide form-control" type="text" id=txtFrAcount' + PayrollFringeHeaderID + ' style="display:none;" value=' + FringeAccount + '><span class="transshow" id=aFrAcount' + PayrollFringeHeaderID + '>' + FringeAccount + '</span></td>';

        strHtml += '<td><a href="#" id=aedit' + PayrollFringeHeaderID + '  class="transshow btn btn-warning  pull-left marginright11"><i class="fa fa-pencil"></i></a><div id=asave' + PayrollFringeHeaderID + ' class="transhide" style="display:none;"><a href="javascript:UpdateFringeAddrange(' + PayrollFringeHeaderID + ');"class="btn btn-success"><i class="fa  fa-check"></i></a>  <a href="javascript:AddRangeCancel();" class="btn btn-primary"><i class="fa fa-close"></i></a></div></td>';

        strHtml += '</tr>';
    }
    $('#PayrollFringeTBody').html(strHtml);

}

//--------------------save Add range Fringe Table--------------//

function InsertFringeDetails() {
    var isvalid = "";
    isvalid += CheckRequired($("#txtLOId"));
    isvalid += CheckRequired($("#txtEpiId"));
    isvalid += CheckRequired($("#txtStart"));
    isvalid += CheckRequired($("#txtEND"));
    isvalid += CheckRequired($("#txtSet"));
    isvalid += CheckRequired($("#txtbanana"));
    isvalid += CheckRequired($("#txtFringeAccount"));

    if (isvalid == "") {
        var PayrollFringeHeaderID1 = 0;
        ObjPayrollFringe = {
            PayrollFringeHeaderID: PayrollFringeHeaderID1,
            StartRange: $("#txtStart").attr("name"),
            EndRange: $("#txtEND").attr("name"),
            LOId: $("#txtLOId").attr("name"),
            EpiId: $("#txtEpiId").attr("name"),
            SetId: $("#txtSet").attr("name"),
            BananasId: $("#txtbanana").attr("name"),
            FringeAccount: $("#txtFringeAccount").attr("name"),
            ProdID: localStorage.ProdId,
            createdby: localStorage.UserId,
            CompanyID: $('select#ddlCompany option:selected').val()
            //CompanyID: $('select#PayrollDropdownId option:selected').val()
    }
        $.ajax({
            url: APIUrlInsertFringeDetails,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            sync: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjPayrollFringe),
        })
        .done(function (response) {
            InsertFringeDetailsSucess(response);
        })

.fail(function (error)
{ ShowMSG(error); })
    }
}
function InsertFringeDetailsSucess(response) {
    ShowMsgBox('showMSG', 'Fringe Added!!!.', '', '');
    $('#trAddRange').hide();
    strFringId = response;

    checkchecked(strFringId);



    GetPayrollFringebyCompanyId();
}


//------------outofillFreeFields------------------//

function TransCodeAutoFillFreeField() {
    $.ajax({
        url: APIUrlTransCodeAutoFill + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { TransCodeAutoFillFreeFieldSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function TransCodeAutoFillFreeFieldSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {

            value: m.TransactionCodeID,
            label: m.TransCode,
        };
    });
    $(".SearchTransCodeForPayrollfield").autocomplete({
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

//----------------------AutofillSuspense Account-------------------//
function FunAutofillAccount(value, Type) {
    if (value == 'Ledger') {
        strParentId = 0;
    } else {
        strParentId = $('#' + Type).attr('name');
        if (strParentId == undefined) {
            strParentId = 0;
        } else {
            strParentId = $('#' + Type).attr('name');
        }
    }

    $.ajax({
        url: APIUrlAutoFillAccount + '?ProdId=' + localStorage.ProdId + '&Type=' + value + '&ParentId=' + strParentId,

        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillAccountSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillAccountSucess(response) {
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.AccountId,
            label: m.AccountCode,
        };
    });
    $(".SearchSuspenseAccount").autocomplete({
        // position: { my: "left bottom", at: "left top", collision: "flip" },
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

//-------------LOAutofill--------//
function LOAutofill(value) {
    $.ajax({
        url: APIUrlFringeAutofill + '?ProdId=' + localStorage.ProdId + '&Classification=' + value,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
        .done(function (response)
        { LOAutofillSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })

}
function LOAutofillSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.AccountId,
            label: m.AccountCode,

        };
    });
    $(".SearchLO").autocomplete({
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
//-------------------------------//

function FillPayrollTransactionCode() {
    $.ajax({
        url: APIUrlFillPayrollTransactionCode + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillPayrollTransactionSucess(response); })
}

function FillPayrollTransactionSucess(response) {
    pubArrTraCode.push(null);
    var TLength = response.length;
    var strHtml = '';
    var strHtml1 = '';
    if (TLength > 0) {
        TotalTransCodeLength = TLength;
        for (var i = 0; i < TLength; i++) {
            strHtml += '<td style="height:100px;"><span id="spn' + response[i].TransactionCodeID + '" calss="from-control"></span></td>';
            // strHtml += "<td><input onfocus='javascript:funTransactionValue("+ response[i].TransactionCodeID + ',' + '"' + response[i].TransCode + '"' + ");' class='width60 SearchTransCodeValue " + response[i].TransactionCodeID + "'  type='text' id='" + response[i].TransactionCodeID + "' value='' name='ABXZ'/></td>";
            strHtml1 += "<th>" + response[i].TransCode + "</th>";
            pubArrTraCode.push('PayrollAutoFilltest' + response[i].TransactionCodeID);
            TransactionCodeArr.push(response[i].TransactionCodeID);
        }
    }
    TransCodeTDStr = strHtml;
    TransCodeTRStr = strHtml1;
    $('#Theadpayrollsetup').html(TransCodeTRStr);
    $('#trpayrollsetup').html(TransCodeTDStr);
    $('#showTable').show();
    $('#fade').show();
    GetTransactionvalueByLoop();
}

function GetTransactionvalueByLoop() {
    for (var i = 0; i < TransactionCodeArr.length; i++) {
        var strvalue = TransactionCodeArr[i];
        GetTvalue(strvalue);
    }
}

function GetTvalue(strvalue) {
    $.ajax({
        url: APIUrlTransCodeAutoFillFreeField + '?TransactionCodeID=' + strvalue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response)
   { funTransactionvSuccess(response, strvalue) })
   .fail(function (error)
   { ShowMSG(error); })
}
function funTransactionvSuccess(response, TransactionCodeArr) {
    $('#spn' + TransactionCodeArr).text('');
    var Tcount = response.length;
    for (var i = 0; i < Tcount; i++) {
        var Strvalue = '';
        Strvalue = '<input type="checkBox" class="cls' + TransactionCodeArr + '" id="' + TransactionCodeArr + response[i].TransactionValueID + '"> ' + response[i].TransValue + '</br>';
        $('#spn' + TransactionCodeArr).append(Strvalue);
    }
}
//--------------Div Show Hide-------------------//
function DvShowhide() {

    if ($('#showTable').css('display') == 'block') {
        checkchecked();
        $('#showTable').hide();
        $('#fade').hide();
        $('#chkTransactionCode').prop('checked', false);
        //  FunInsertPayrollTransByCompanyID();

    }
    else {

        $('#showTable').show();
        //  checkchecked();

    }
}

//----------Soring Checkbox 2-22-16---------------//
function checkchecked(value) {
    FinalObjArray = [];
    for (var i = 0; i < TransactionCodeArr.length; i++) {
        var strVal = $('.cls' + TransactionCodeArr[i]);
        for (var j = 0; j < strVal.length; j++) {
            var strId = strVal[j].id;
            if ($('#' + strId).is(':checked')) {
                pubArrTraCode = {
                    TransactionId: strVal,
                    TransactionValueId: strId,

                    PayrollFringeHeaderID: value,
                    createdby: localStorage.UserId,
                    ProdID: localStorage.ProdId,
                    CompanyID: $('select#ddlCompany option:selected').val()
                    //CompanyID: $('select#PayrollDropdownId option:selected').val()
            }
                FinalObjArray.push(pubArrTraCode);
            }
        }
    }

    $.ajax({
        url: APIUrlInsertUpdatePayrollFringeTrans,
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(FinalObjArray),
    })
    .done(function (response) {
        checkcheckedSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function checkcheckedSucess(response) {
    console.log(response);
}
//-----------------InsertUpdatePayrollTrans-------------------//

function FunInsertPayrollTransByCompanyID() {
    var PayrollFringeHeaderID1 = 0;
    var objpayrollTransdata = {
        PayrollFringeHeaderID: PayrollFringeHeaderID1,
        TransactionCodeId: $("#TransactionCodeId").val(),
        TransactionValueId: $("#TransactionValueId").val(),
        createdby: localStorage.UserId,
        ProdID: localStorage.ProdId,
        CompanyID: $('select#ddlCompany option:selected').val(),
        //CompanyID: $('select#PayrollDropdownId option:selected').val(),
    }

    $.ajax({
        url: APIUrlFunInsertPayrollTransByCompanyID,
        cache: false,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(objpayrollTransdata),
    })
    .done(function (response) {
        FunInsertPayrollTransByCompanyIDSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function FunInsertPayrollTransByCompanyIDSucess(response) {
    var Msg = 'Payroll Trans Saved  !!';
    ShowMsgBox('showMSG', Msg, '', '');
    console.log(response);
    function ShowMSG(error) {
        console.log(error);
    }
}
//-----------------saveAddRangeAndTransactionCode------------//



//function GetClearingAccount(value) {
//    $.ajax({
//        url: APIUrlGetClearingAccount + '?ProdId=' + localStorage.ProdId + '&AccountType=' + 5 + '&CompanyId=' + $('#PayrollDropdownId').val(),
//        cache: false,
//        type: 'POST',
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },
//        contentType: 'application/json; charset=utf-8',
//    })
//.done(function (response) {
//    if (value == 'Labor') {
//        GetClearingAccountSucess(response);
//    }
//    else if (value == 'Fringe') {
//        GetClearingAccountFringeSucess(response);
//    }
//    else
//    {
//        GetClearingAccountSuspenseSucess(response);
//    }
//})

//.fail(function (error)
//{ ShowMSG(error); })
//}
//function GetClearingAccountSucess(response) {
//    var ProductListjson = response;
//    var array = response.error ? [] : $.map(response, function (m) {
//        return {
//            label: m.COANo,
//            COAId: m.COAID,

//        };
//    });
//    $(".SearchLabor").autocomplete({
//        minLength: 0,
//        source: array,
//        focus: function (event, ui) {


//            $(this).attr('COAId', ui.item.COAId);
//            $(this).attr('COACode', ui.item.label);
//            $(this).val(ui.item.label);

//            return false;
//        },
//        select: function (event, ui) {


//            $(this).attr('COAId', ui.item.COAId);
//            $(this).attr('COACode', ui.item.label);
//            $(this).val(ui.item.label);


//            return false;
//        },
//        change: function (event, ui) {
//            if (!ui.item) {
//                $(this).val('');
//                $(this).removeAttr('COAId');
//                $(this).removeAttr('COACode');
//            }
//        }
//    })
//}
//function GetClearingAccountFringeSucess(response) {
//    var ProductListjson = response;
//    var array = response.error ? [] : $.map(response, function (m) {
//        return {
//            label: m.COANo,
//            COAId: m.COAID,

//        };
//    });
//    $(".SearchFringe").autocomplete({
//        minLength: 0,
//        source: array,
//        focus: function (event, ui) {


//            $(this).attr('COAId', ui.item.COAId);
//            $(this).attr('COACode', ui.item.label);
//            $(this).val(ui.item.label);

//            return false;
//        },
//        select: function (event, ui) {


//            $(this).attr('COAId', ui.item.COAId);
//            $(this).attr('COACode', ui.item.label);
//            $(this).val(ui.item.label);


//            return false;
//        },
//        change: function (event, ui) {
//            if (!ui.item) {
//                $(this).val('');
//                $(this).removeAttr('COAId');
//                $(this).removeAttr('COACode');
//            }
//        }
//    })
//}

//function GetClearingAccountSuspenseSucess(response) {
//    var ProductListjson = response;
//    var array = response.error ? [] : $.map(response, function (m) {
//        return {
//            label: m.COANo,
//            COAId: m.COAID,

//        };
//    });
//    $(".SearchSuspense").autocomplete({
//        minLength: 0,
//        source: array,
//        focus: function (event, ui) {


//            $(this).attr('COAId', ui.item.COAId);
//            $(this).attr('COACode', ui.item.label);
//            $(this).val(ui.item.label);

//            return false;
//        },
//        select: function (event, ui) {


//            $(this).attr('COAId', ui.item.COAId);
//            $(this).attr('COACode', ui.item.label);
//            $(this).val(ui.item.label);


//            return false;
//        },
//        change: function (event, ui) {
//            if (!ui.item) {
//                $(this).val('');
//                $(this).removeAttr('COAId');
//                $(this).removeAttr('COACode');
//            }
//        }
//    })
//}


//function GetClearingAccountList() {
//    $.ajax({
//        url: APIUrlClearingAccountList + '?Type=' + 'Payroll' + '&CompanyId=' + $('#PayrollDropdownId').val(),
//        cache: false,
//        type: 'POST',
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },
//        contentType: 'application/json; charset=utf-8',
//    })
//.done(function (response) {
//    ClearingAccountListSucess(response);
//})
//.fail(function (error)
//{ ShowMSG(error); })
//}
//function ClearingAccountListSucess(response)
//{

//    $('#hdntxtLaborACId').val('');
//    $('#txtLabor').removeAttr('coaid');
//    $('#txtLabor').val('');
//    $('#hdntxtFringeACId').val('');
//    $('#txtFringe').removeAttr('coaid');
//    $('#txtFringe').val('');
//    $('#hdntxtLaborACId').val('');
//    $('#txtLabor').removeAttr('coaid');
//    $('#txtLabor').val('');



//    var Tcount=response.length;
//    for (var i = 0; i < Tcount; i++)

//    {
//        if(response[i].AccountName == 'Labor')
//        {
//            $('#hdntxtLaborACId').val(response[i].AccountClearingId);
//            $('#txtLabor').attr('coaid', response[i].COAId);
//            $('#txtLabor').val(response[i].AccountCode);
//        }
//        if (response[i].AccountName == 'Fringe') {
//            $('#hdntxtFringeACId').val(response[i].AccountClearingId);
//            $('#txtFringe').attr('coaid', response[i].COAId);
//            $('#txtFringe').val(response[i].AccountCode);
//        }
//        if (response[i].AccountName == 'Suspense') {
//            $('#hdntxtsuspenseACId').val(response[i].AccountClearingId);
//            $('#txtsuspense').attr('coaid', response[i].COAId);
//            $('#txtsuspense').val(response[i].AccountCode);
//        }
//    }
//}

//function funSaveClearingAccounts() {
//    var ArrAC = [];
   
//        var obj = {
//            AccountClearingId: $('#hdntxtLaborACId').val(),
//            Type: 'Payroll',
//            AccountName: 'Labor',
//            COAId: $('#txtLabor').attr('coaid'),
//            CompanyId: $('#PayrollDropdownId').val(),
//            BankId: 0,
//            CreatedBy: localStorage.UserId,
//            ProdId: localStorage.ProdId,
//            AccountCode: $('#txtLabor').val()
//        }
//        ArrAC.push(obj);
 
   
//        var obj = {
//            AccountClearingId: $('#hdntxtFringeACId').val(),
//            Type: 'Payroll',
//            AccountName: 'Fringe',
//            COAId: $('#txtFringe').attr('coaid'),
//            CompanyId: $('#PayrollDropdownId').val(),
//            BankId: 0,
//            CreatedBy: localStorage.UserId,
//            ProdId: localStorage.ProdId,
//            AccountCode: $('#txtFringe').val()
//        }
//        ArrAC.push(obj);

//        var obj = {
//            AccountClearingId: $('#hdntxtsuspenseACId').val(),
//            Type: 'Payroll',
//            AccountName: 'Suspense',
//            COAId: $('#txtsuspense').attr('coaid'),
//            CompanyId: $('#PayrollDropdownId').val(),
//            BankId: 0,
//            CreatedBy: localStorage.UserId,
//            ProdId: localStorage.ProdId,
//            AccountCode: $('#txtsuspense').val()
//        }
//        ArrAC.push(obj);

  
//    $.ajax({
//        url: APIUrlSaveClearingAccounts,
//        cache: false,
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },
//        type: 'POST',

//        contentType: 'application/json; charset=utf-8',
//        data: JSON.stringify(ArrAC),
//    })
//      .done(function (response) {
//          SaveClearingAccountsSucess(response);
//      })

//.fail(function (error)
//{ ShowMSG(error); })

//}
//function SaveClearingAccountsSucess(response) {
//    GetClearingAccountList();
//}


//===================Suspense Account============================//
//===================segment

function funSegment123(values, SegmentName, SegmentP) { ////// 123
    GlbCOAList = [];
    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    }
    else {

        PreSegment = SegmentP - 1;
    }
    var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
    if (strCOACode == '' && SegmentName == 'DT') {

    }

    //txt_0_Company

    $.ajax({
        url: APIUrlGetCOA + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { funSegmentSucess(response, values); })
  .fail(function (error)
  { console.log(error); })
}
function funSegmentSucess(response, values) {

    GlbCOAList = response;
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

            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                // $(this).val('');
                // $('#f').val('');
                //$(this).val('');
                //$(this).removeAttr('COACode');
                //$(this).removeAttr('COAId');

                //$('#hdnCode_' + values).val('');
                //$('#hdnCOAId_' + values).val('');

            }
        }
    })
}

function funCheckOptionalAutoFill(value, segmentName, valueN) {

    var strval = $('#txtOptional_' + value + '_' + valueN).val();

    if (strval != '') {
        for (var i = 0; i < GblOptionalCOA.length; i++) {
            if (GblOptionalCOA[i].AccountCode.match(strval)) {
                //if (strval == GblOptionalCOA[i].AccountCode) {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[i].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[i].AccountID);
                break;
            } else {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);

            }
        }
    }
    else {
        //$('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
        //$('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);
    }
}

function validate(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}
//============================================= Get Segment Detail
function GetSegmentsDetails() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + '0',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetSegmentListSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function GetSegmentListSucess(response) {
    ArrSegment = [];
    for (var i = 0; i < response.length; i++) {

        var ObjSegment = {
            SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode
        }
        ArrSegment.push(ObjSegment);
        if (response[i].Classification == 'Detail') {
            break;
        }
    }

    funTrCreate();
}
//=============getCOA Accounts================//

function funTrCreate() {
    $('#tblAccountClearing').html('');
    var strCompanyCode = $('#ddlCompany :selected').text().split(' ')[0];
    //var strCompanyCode = $('#PayrollDropdownId').find("option:selected").attr('name');
    var strhtml = '';
    strcount = ArrSegment.length;

    strhtml += '<tr>';
    strhtml += '<th>Type</th>';
    strhtml += '<th style="text-align: center;">AccountType</th>';
    strhtml += '<th colspan=' + strcount + ' style="text-align: center;border-bottom: #baccdd;border-bottom-style: solid;">Account</th>';
    strhtml += '</tr>';

    strhtml += '<tr>';
    strhtml += '<th></th>';
    strhtml += '<th></th>';

    for (var i = 0; i < ArrSegment.length; i++) {
        strhtml += '<th style="text-align: center;">' + ArrSegment[i].SegmentName + '</th>';
    }
    //==========================//
    strhtml += '<tr>';
    strhtml += '<td style="width: 20%;">Suspense Account</td>';
    strhtml += '<td style="width: 25%;"><input type="radio" name="SuspenseAccount" id="RadioSusAccount" checked onclick="javascript:funCheckAccountType(0,2);"> Account <input type="radio" name="SuspenseAccount" id="RadioCASusCOA" onclick="javascript:funCheckAccountType(1,2);"> COA</td>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO') {
            strhtml += '<td style="10%"><input type="text"  class=""  onblur="javascript:funCheckNextValue(' + 2 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');"  onfocus="javascript:funSegment(' + 2 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 2 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  coaid="" disabled value="' + strCompanyCode + '" coacode="' + strCompanyCode + '"/></td>';
        } else if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<td style="10%"><input type="text"  class="input-required"  onblur="javascript:funCheckNextValue(' + 2 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');"  onfocus="javascript:funSegment(' + 2 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 2 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid=""/></td>';
        } else {
            strhtml += '<td style="10%"><input type="text"  class=""  onblur="javascript:funCheckNextValue(' + 2 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');"  onfocus="javascript:funSegment(' + 2 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 2 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" disabled /></td>';
        }
    }
    strhtml += '<td style="display:none;"><input type="hidden" id="hdnACId_2"/><input type="hidden" id="hdnCOACode_2"/><input type="hidden" id="hdnCOAId_2"/></td>';
    strhtml += '</tr>';
    //===========================//

    //strhtml += '</tr>';
    strhtml += '<tr>';
    strhtml += '<td style="width: 20%;">Fringe Clearing</td>';
    strhtml += '<td style="width: 25%;"><input type="radio" name="APClearing" id="RadioAPAccount" checked onclick="javascript:funCheckAccountType(0,0);"> Account <input type="radio" name="APClearing" id="RadioAPCOA" onclick="javascript:funCheckAccountType(1,0);"> COA</td>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO') {
            strhtml += '<td style="10%"><input type="text"  class=""  onblur="javascript:funCheckNextValue(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="' + strCompanyCode + '" coaid="" disabled value="' + strCompanyCode + '"/></td>';
        }
        else if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<td style="10%"><input type="text"   class="input-required" onblur="javascript:funCheckNextValue(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid=""/></td>';
        }
        else {
            strhtml += '<td style="10%"><input type="text"   class="" onblur="javascript:funCheckNextValue(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" disabled /></td>';
        }
    }
    strhtml += '<td style="display:none;"><input type="hidden" id="hdnACId_0"/><input type="hidden" id="hdnCOACode_0"/><input type="hidden" id="hdnCOAId_0"/></td>';
    strhtml += '</tr>';

    //////////////////////// 
    strhtml += '<tr>';
    strhtml += '<td style="width: 20%;">Labor Clearing</td>';
    strhtml += '<td style="width: 25%;"><input type="radio" name="CashAccount" id="RadioCAAccount" checked onclick="javascript:funCheckAccountType(0,1);"> Account <input type="radio" name="CashAccount" id="RadioCACOA" onclick="javascript:funCheckAccountType(1,1);"> COA</td>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO') {
            strhtml += '<td style="10%"><input type="text"  class=""  onblur="javascript:funCheckNextValue(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');"  onfocus="javascript:funSegment(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 1 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="' + strCompanyCode + '" coaid="" disabled value="' + strCompanyCode + '"/></td>';
        } else if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<td style="10%"><input type="text"  class="input-required"  onblur="javascript:funCheckNextValue(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');"  onfocus="javascript:funSegment(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 1 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" /></td>';
        } else {
            strhtml += '<td style="10%"><input type="text"  class=""  onblur="javascript:funCheckNextValue(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');"  onfocus="javascript:funSegment(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 1 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" disabled /></td>';
        }
    }
    strhtml += '<td style="display:none;"><input type="hidden" id="hdnACId_1"/><input type="hidden" id="hdnCOACode_1"/><input type="hidden" id="hdnCOAId_1"/></td>';
    strhtml += '</tr>';

    $('#tblAccountClearing').html(strhtml);

}

/////////////////////////////// AP Clearing
function funSegment(values, SegmentName, SegmentP) {
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');
    strFocusCode = $('#txt_' + values + '_' + SegmentP).val();
    var PreSegment = 0;
    var strClearingType = 'COA';
    COACode = $('#hdnCOACode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    } else {
        PreSegment = SegmentP - 1;
    }

    var strCOACode = '';
    strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');

    if (strCOACode == '' && SegmentName == 'DT') {
        strClearingType = 'Account';
    }

    if (strCOACode == undefined) {
        strClearingType = 'Account';
    }

    var strval = 0;
    var strAccountName = '';
    if (values == 0) {
        strval = 5;
        strAccountName = 'Fringe';
    } else if (values == 2) {
        strval = 5;
        strAccountName = 'Suspense';
    } else {
        strval = 5;
        strAccountName = 'Labor';
    }

    var Obj = {
        ProdId: localStorage.ProdId,
        AccountType: strval,
        CompanyId: $('#ddlCompany').val(),
        //CompanyId: $('#PayrollDropdownId').val(),
        Bankid: 0,
        ClearingType: strClearingType,
        SegmentPosition: SegmentP,
        COACode: strCOACode,
        AccountName: strAccountName
    }

    $.ajax({
        url: APIUrlGetSettingBankAccounts,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(Obj),
    })
    .done(function (response) {
        GetClearingAccountSucess(response, values, SegmentName, SegmentP);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetClearingAccountSucess(response, values, SegmentName, SegmentP) {
    GlbCOAList = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            label: (m.COADescription == '' ? m.COANo : m.COADescription),
            COANo: m.COANo,
            COAId: m.COAID,
            COACode: m.COACode
        };
    });
    $('#txt_' + values + '_' + SegmentP).addClass('SearchCode');
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).attr('COAId', ui.item.COAId);
            $(this).attr('COACode', ui.item.COACode);
            $(this).val(ui.item.label);
            $('#hdnCOACode_' + values).val(ui.item.COACode);
            $('#hdnCOAId_' + values).val(ui.item.COAId);

            return false;
        },
        select: function (event, ui) {
            $(this).attr('COAId', ui.item.COAId);
            $(this).attr('COACode', ui.item.COACode);
            $(this).val(ui.item.COANo);
            $('#hdnCOACode_' + values).val(ui.item.COACode);
            $('#hdnCOAId_' + values).val(ui.item.COAId);
            return false;
        },
        change: function (event, ui) {
            try {
                var findVal = $(this).val();
                findVal = findVal.toUpperCase();
                var GetElm = $.grep(array, function (v) {
                    return v.COANo == findVal;
                });
                if (GetElm.length > 0)
                    $(this).val(findVal);
                else {
                    $(this).val('');
                    $(this).removeAttr('COAId');
                    $(this).removeAttr('COACode');
                }
            }
            catch (er) {
                $(this).val('');
                $(this).removeAttr('COAId');
                $(this).removeAttr('COACode');
            }
        }
    })
}

function funCheckNextValue(values, SegmentName, SegmentP) {
    if ($('#txt_' + values + '_' + SegmentP).val() != '') {
        strFocusOutCode = $('#txt_' + values + '_' + SegmentP).val();

        var strCOACode = $('#txt_' + values + '_' + SegmentP).val();
        var SegmentP1 = SegmentP + 1;
        if (strFocusCode != strFocusOutCode) {
            for (var i = SegmentP1; i < ArrSegment.length; i++) {
                $('#txt_' + values + '_' + i).val('');
                $('#hdnCOACode_' + values).val('');
                $('#hdnCOAId_' + values).val('');
            }
        }
        //GlbCOAList

        if (GlbCOAList.length > 0) {

            if (strFocusOutCode.indexOf('(') != -1)
                strFocusOutCode = strFocusOutCode.split('(')[0].trim();
            for (var i = 0; i < GlbCOAList.length; i++) {
                if (GlbCOAList[i].COANo.replace('-', '').trim().match(strFocusOutCode.replace('-', '').trim()) || strFocusOutCode == GlbCOAList[i].COANo) {
                    $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[i].COANo);
                    $('#hdnCOACode_' + values).val(GlbCOAList[i].COACode);
                    $('#hdnCOAId_' + values).val(GlbCOAList[i].COAID);
                    console.log(GlbCOAList[i].COANo + '>>' + GlbCOAList[i].COACode);
                    break;
                }
            }
        }
    }
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');
}

function GetClearingAccountList() {
    $.ajax({
        url: APIUrlClearingAccountList + '?Type=' + 'Payroll' + '&CompanyId=' + $('#ddlCompany').val(),
        //url: APIUrlClearingAccountList + '?Type=' + 'Payroll' + '&CompanyId=' + $('#PayrollDropdownId').val(),
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        ClearingAccountListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function ClearingAccountListSucess(response) {

    for (var i = 0; i < response.length; i++) {
        if (response[i].AccountName == 'Fringe') {
            if (response[i].ClearingType == 'COA') {
                var strCOACode = response[i].AccountCode;
                var strCOACodesplit = strCOACode.split('|');
                for (var j = 0; j < ArrSegment.length; j++) {
                    if (ArrSegment[j].SegmentName == 'DT') {
                        var strval = strCOACodesplit[j].split('>');
                        var strvallength = strval.length;

                        var strDetail = strval[strvallength - 1];
                        $('#txt_0_' + j).val(strDetail);
                    }
                    else {
                        $('#txt_0_' + j).val(strCOACodesplit[j]);
                        $('#hdnCOACode_0').val(response[i].AccountCode);
                        $('#hdnCOAId_0').val(response[i].COAId);
                        $('#hdnACId_0').val(response[i].AccountClearingId);
                    }
                }
                $('#RadioAPCOA').prop('checked', true);
            } else {
                for (var j = 0; j < ArrSegment.length; j++) {
                    if (ArrSegment[j].SegmentName == 'DT') {
                        $('#txt_0_' + j).val(response[i].AccountCode);
                        $('#hdnCOACode_0').val(response[i].AccountCode);
                        $('#hdnCOAId_0').val(response[i].COAId);
                        $('#hdnACId_0').val(response[i].AccountClearingId);
                    }
                }
            }
        }
        else if (response[i].AccountName == 'Labor') {
            if (response[i].ClearingType == 'COA') {
                var strCOACode = response[i].AccountCode;
                var strCOACodesplit = strCOACode.split('|');
                for (var j = 0; j < ArrSegment.length; j++) {
                    if (ArrSegment[j].SegmentName == 'DT') {
                        var strval = strCOACodesplit[j].split('>');
                        var strvallength = strval.length;
                        var strDetail = strval[strvallength - 1];
                        $('#txt_1_' + j).val(strDetail);
                    }
                    else {
                        $('#txt_1_' + j).val(strCOACodesplit[j]);
                        $('#hdnCOACode_1').val(response[i].AccountCode);
                        $('#hdnCOAId_1').val(response[i].COAId);
                        $('#hdnACId_1').val(response[i].AccountClearingId);

                    }
                }
                $('#RadioCACOA').prop('checked', true);
            } else {
                for (var j = 0; j < ArrSegment.length; j++) {

                    if (ArrSegment[j].SegmentName == 'DT') {
                        $('#txt_1_' + j).val(response[i].AccountCode);
                        $('#hdnCOACode_1').val(response[i].AccountCode);
                        $('#hdnCOAId_1').val(response[i].COAId);
                        $('#hdnACId_1').val(response[i].AccountClearingId);
                    }
                }
            }
        }
        else if (response[i].AccountName == 'Suspense') {
            if (response[i].ClearingType == 'COA') {
                var strCOACode = response[i].AccountCode;
                var strCOACodesplit = strCOACode.split('|');
                for (var j = 0; j < ArrSegment.length; j++) {
                    if (ArrSegment[j].SegmentName == 'DT') {
                        var strval = strCOACodesplit[j].split('>');
                        var strvallength = strval.length;
                        var strDetail = strval[strvallength - 1];
                        $('#txt_2_' + j).val(strDetail);
                    }
                    else {
                        $('#txt_2_' + j).val(strCOACodesplit[j]);
                        $('#hdnCOACode_2').val(response[i].AccountCode);
                        $('#hdnCOAId_2').val(response[i].COAId);
                        $('#hdnACId_2').val(response[i].AccountClearingId);

                    }
                }
                $('#RadioCASusCOA').prop('checked', true);
            } else {
                for (var j = 0; j < ArrSegment.length; j++) {

                    if (ArrSegment[j].SegmentName == 'DT') {
                        $('#txt_2_' + j).val(response[i].AccountCode);
                        $('#hdnCOACode_2').val(response[i].AccountCode);
                        $('#hdnCOAId_2').val(response[i].COAId);
                        $('#hdnACId_2').val(response[i].AccountClearingId);
                    }
                }
            }
        }
    }

}

function funSaveClearingAccounts(value) {

    var ArrAC = [];
    var strClearingType0 = 'Account';
    var strClearingType1 = 'Account';
    var strClearingType2 = 'Account';

    // if ($('#txtLabor').val() != '') {

    var strval0 = $('#hdnCOACode_0').val().split('|');
    var strval1 = $('#hdnCOACode_1').val().split('|');
    var strval2 = $('#hdnCOACode_2').val().split('|');
    if (strval0.length > 1) {
        strClearingType0 = 'COA';
    }
    if (strval1.length > 1) {
        strClearingType1 = 'COA';
    }
    if (strval2.length > 1) {
        strClearingType2 = 'COA';
    }


    var obj = {
        AccountClearingId: $('#hdnACId_0').val(),
        Type: 'Payroll',
        AccountName: 'Fringe',
        COAId: $('#hdnCOAId_0').val(),
        CompanyId: $('#ddlCompany').val(),
        //CompanyId: $('#PayrollDropdownId').val(),
        //$('#hdnBankCompanyCode').val()
        BankId: value,
        CreatedBy: localStorage.UserId,
        ProdId: localStorage.ProdId,
        AccountCode: $('#hdnCOACode_0').val(),
        ClearingType: strClearingType0
    }
    ArrAC.push(obj);
    //  }

    //if ($('#txtFringe').val() != '') {
    var obj = {
        AccountClearingId: $('#hdnACId_1').val(),
        Type: 'Payroll',
        AccountName: 'Labor',
        COAId: $('#hdnCOAId_1').val(),
        CompanyId: $('#ddlCompany').val(),
        //CompanyId: $('#PayrollDropdownId').val(),
        BankId: value,
        CreatedBy: localStorage.UserId,
        ProdId: localStorage.ProdId,
        AccountCode: $('#hdnCOACode_1').val(),
        ClearingType: strClearingType1
    }
    ArrAC.push(obj);

    var obj = {
        AccountClearingId: $('#hdnACId_2').val(),
        Type: 'Payroll',
        AccountName: 'Suspense',
        COAId: $('#hdnCOAId_2').val(),
        CompanyId: $('#ddlCompany').val(),
        //CompanyId: $('#PayrollDropdownId').val(),
        BankId: value,
        CreatedBy: localStorage.UserId,
        ProdId: localStorage.ProdId,
        AccountCode: $('#hdnCOACode_2').val(),
        ClearingType: strClearingType2
    }
    ArrAC.push(obj);
    //}
    $.ajax({
        url: APIUrlSaveClearingAccounts,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ArrAC),
    })
      .done(function (response) {
          SaveClearingAccountsSucess(response);
      })

.fail(function (error)
{ ShowMSG(error); })

}
function SaveClearingAccountsSucess(response) {
    // GetClearingAccountList();
}

/*
function funPassCompanyCode123() {
    if ($('#PayrollDropdownId option').attr('name')!= '') {
        var strval = $('#PayrollDropdownId option').attr('name');
        if ($('#txt_0_0').val() != strval) {
            for (var i = 0; i < ArrSegment.length; i++) {
                $('#txt_0_' + i).val('');
                $('#txt_0_' + i).removeAttr('coacode');
            }
            for (var i = 0; i < ArrSegment.length; i++) {
                $('#txt_1_' + i).val('');
                $('#txt_1_' + i).removeAttr('coacode');
            }
            for (var i = 0; i < ArrSegment.length; i++) {
                $('#txt_2_' + i).val('');
                $('#txt_2_' + i).removeAttr('coacode');
            }
        }
        if ($('#txt_0_0').val() == '') {
            $('#txt_0_0').val(strval);
            $('#txt_1_0').val(strval);
            $('#txt_2_0').val(strval);
            $('#txt_0_0').attr('coacode', strval);
            $('#txt_1_0').attr('coacode', strval);
            $('#txt_2_0').attr('coacode', strval);
            $('#hdnCOACode_0').val(strval);
            $('#hdnCOACode_0').attr(strval);
        }

    }
}
*/
function funCheckAccountType(AccountType, Type) {
  
    var strNewCount = strcount - 1;
    if (Type == 0) {
        if (AccountType == 0) {
            for (var i = 0; i <= strNewCount; i++) {
                $('#txt_0_' + i).removeClass('input-required');
                $('#txt_0_' + i).prop('disabled', true);
                if (i != 0) {
                    $('#txt_0_' + i).val('');
                }
            }
            $('#txt_0_' + strNewCount).addClass('input-required');
            $('#hdnCOAId_0').val('');
            $('#txt_0_' + strNewCount).prop('disabled', false);
        }
        else {
            for (var i = 0; i <= strNewCount; i++) {
                $('#txt_0_' + i).addClass(' input-required');
              
                if (i != 0) {
                    $('#txt_0_' + i).prop('disabled', false);
                    $('#txt_0_' + i).val('');
                }
                $('#hdnCOAId_0').val('');

            }
        }
    }
    else if (Type == 1) {
        if (AccountType == 0) {
            for (var i = 0; i <= strNewCount; i++) {
                $('#txt_1_' + i).removeClass(' input-required');
                $('#txt_1_' + i).prop('disabled', true);
                if (i != 0) {
                    $('#txt_1_' + i).val('');
                }
            }
            $('#txt_1_' + strNewCount).addClass(' input-required');
            $('#hdnCOAId_1').val('');
            $('#txt_1_' + strNewCount).prop('disabled', false);

        }
        else {
            for (var i = 0; i <= strNewCount; i++) {
                $('#txt_1_' + i).addClass(' input-required');
              

                if (i != 0) {
                    $('#txt_1_' + i).prop('disabled', false);
                    $('#txt_1_' + i).val('');
                }
                $('#hdnCOAId_1').val('');

            }
        }
    }
    if (Type == 2) {
        if (AccountType == 0) {
            for (var i = 0; i <= strNewCount; i++) {
                $('#txt_2_' + i).removeClass('input-required');
                $('#txt_2_' + i).prop('disabled', true);
                if (i != 0) {
                    $('#txt_2_' + i).val('');
                }
            }
            $('#txt_2_' + strNewCount).addClass('input-required');
            $('#hdnCOAId_2').val('');
            $('#txt_2_' + strNewCount).prop('disabled', false);
        }
        else {
            for (var i = 0; i <= strNewCount; i++) {
                $('#txt_2_' + i).addClass(' input-required');
               
                if (i != 0) {
                    $('#txt_2_' + i).prop('disabled', false);
                    $('#txt_2_' + i).val('');
                }
                $('#hdnCOAId_2').val('');

            }
        }
    }
}
//=================================Vendor Auto complete sanjay
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
    .done(function (response) {
        FillVendorSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillVendorSucess(response) {
    GetVendorNamePO = [];
    GetVendorNamePO = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
        };
    });
    $(".VendorCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnVendorID").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnVendorID").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);
            $('#lblBillingAddress1').html(ui.item.Add1W9);
            $('#lblBillingAddress2').html(ui.item.Add2W9);
            $('#lblShippingAddress1').html(ui.item.Add1Re);
            $('#lblShippingAddress2').html(ui.item.Add2Re);
            strvCOAId = ui.item.ssCOAId;
            strvCOACode = ui.item.ssCOAString;
            strvCOATransaction = ui.item.ssTransString;
            strvSetId = ui.item.ssSetId;
            strvSetCode = ui.item.ssSetCode;
            strvSeriesId = ui.item.ssSeriesId;
            strvSeriesCode = ui.item.ssSeriesCode;
            ssDefaultDropdown = ui.item.ssDefaultDropdown;
            ssWarning = ui.item.ssWarning;
            ssRequired = ui.item.ssRequired;
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
    //GetSegmentsDetails();
}