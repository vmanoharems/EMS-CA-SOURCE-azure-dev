var APIUrlGetCompanyCode = HOST + "/api/CompanySettings/GetCompanyList";
//var APIUrlGetCurrency = HOST + "/api/CompanySettings/GetCurrencyDetails";
var APIUrlInsertUpdateBankInfo = HOST + "/api/CompanySettings/InsertUpdateBankInfo";
var APIUrlCheckSettingSave = HOST + "/api/CompanySettings/CheckSettingUpdate";
var APIUrlGetBankList = HOST + "/api/CompanySettings/GetBankInfoList";   //// Bank List
var APIUrlGetStateList = HOST + "/api/CompanySettings/GetStateListByCountryId";
var APIUrlInsertUpdateCheckSetting = HOST + "/api/CompanySettings/InsertupdateCheckSetting";
var APIUrlGetBankDetails = HOST + "/api/CompanySettings/GetBankInfoById";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode"; //
var APIUrlGetCOAForBank = HOST + "/api/CompanySettings/GetCOABySegmentAccountsBank"; //
var APIUrlGetClearingAccount = HOST + "/api/CompanySettings/GetCOAForClearing";
var APIUrlSaveClearingAccounts = HOST + "/api/CompanySettings/InsertUpdateClearingAccount";
var APIUrlClearingAccountList = HOST + "/api/CompanySettings/GetCleringAccountById";
var APIUrlGetSettingBankAccounts = HOST + "/api/CompanySettings/SettingBankAccounts";
var APIUrlSavePOSSettings = HOST + "/api/CompanySettings/InsertUpdatePOSPayInfo"

var StrBankInfo = 0;
var StrCheckSettingId = 0;
var Defaultvalue = 0;
var strCurrentTab = 'BankInfo';
var GetCountryListVar = [];
var GetStateListVar = [];
var StrCompanyListGet = [];
var ArrSegment = [];
var strTrCount = 0;
var ArrOptionalSegment = [];
var ArrTransCode = [];
var strgetcoaId = [];
var GlbCOAList = [];
var strFocusCode = '';
var strFocusOutCode = '';
var strcount = 0;
var oAdditionalFields = [];
var oAdditionalItems = [];

//// POS Pay related
var BankConfig = "";
var objBankConfig;
var objAConfig;
var objAConfigList;

$(document).ready(function () {
    GetSegmentsDetails();
    $("#ChkBankActive").prop("checked", true);
    $("#chkCSActive").prop("checked", true);
    // window.onbeforeunload = null;
    if (window.location.href.indexOf('Banks') > -1) {
        GetBankList();
    }

    GetCompanyCode();
    //GetCurrency();
    $('#txtBankZip').mask('99999', { clearIfNotMatch: true });
    $('#txtBankZip1').mask('9999', { clearIfNotMatch: true });
    FillAutoCountrySuccess(cntryList);
    if (localStorage.strBankId !== undefined && localStorage.strBankId !== '' && location.pathname !== '/Setting/Banks') {
        BankIdDetails();
        $('#UlBankAddTi').hide();
        $('#UlTabBank').show();
        Defaultvalue++;
        $('#HrefAddBank').hide();

        if ($('#txtBankCountry').val() != '') {
            GetStateList();
        }
    } else {
        AtlasDocument.BindCurrency('');
    }

    if (StrBankInfo == 0) {
        $('#tabCheckSettings').attr('style', 'disabled,true;');
    }


    $("#ddlBankList").change(function () {
        $("#possettings").html("");
        oAdditionalFields = [];
        oAdditionalItems = [];
        RenderPOSPay(this.value, objBankConfig);
    });
    G_FillCountryAutoComplete($('#txtBankCountry'));

});

$('#txtBankCash').blur(function () {
    funAccountSegment();
})

$('#txtBankCountry').blur(function () {
    let thisvalue = this.value;
    let validcountry = cntryList.find((c) => {
        return c.name === thisvalue;
    })
    if (!validcountry) {
        $(this).notify('Please select a valid country');
        $(this).addClass('field-Req');
    }
})

function funAddNewBak() {
    ChangeTextBankBtn();
    //   $('#ChkBankActive').prop('checked', true);
    $('#btnBankCheck').attr('style', 'disply:none;');
    localStorage.strBankId = '';
    $(location).attr('href', 'AddBanks');
    Defaultvalue = 0;
}

//--------------Get Company Code 12/21/2015----------------------//
function GetCompanyCode() {
    $.ajax({
        url: APIUrlGetCompanyCode + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetCompanyCodeSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetCompanyCodeSucess(response) {
    StrCompanyListGet = [];
    StrCompanyListGet = response;
    var ProductListjson = response;
    var strgetcoaId = response.COAId;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CompanyID,
            label: m.CompanyCode,
            COAID: m.COAId,
            //  BuyerId: m.BuyerId,
        };
    });

    $(".SearchCompanyCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnBankCompanyCode").val(ui.item.value);
            $('#txtBankCompnayCode').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBankCompanyCode").val(ui.item.value);
            $('#txtBankCompnayCode').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}

//--------Get Currency  12/22/2015----------------------//
/*
function GetCurrency() {
    $.ajax({
        url: APIUrlGetCurrency + '?ProdId=' + localStorage.ProdId,
        cache: false,

        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetCurrencySucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetCurrencySucess(response) {
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

            $("#hdnBankCurrencyId").val(ui.item.value);
            $('#txtBankCurrencyName').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBankCurrencyId").val(ui.item.value);
            $('#txtBankCurrencyName').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                $("#hdnBankCurrencyId").val('');
                $('#txtBankCurrencyName  ').val('');
            }
        }
    })
}
*/
$('#txtBankName').blur(function () {
    $('#LiBankName').text('');
    var BankName = $('#txtBankName').val().trim();
    $('#LiBankName').text(BankName);
});

//-------- Bank Details Save  12/22/2015----------------------//
function funSaveBankDetails() {
    if ($('.field-Req').length > 0) {
        $('#LiBankName').notify('Please fill the required fields');
        return 0;
    }
    var isValid = 0;
    var isAPC_AcType = $('#RadioAPAccount').prop('checked');
    var isCA_AcType = $('#RadioCAAccount').prop('checked');
    var isAPCOA = $('#RadioAPCOA').prop('checked');
    var isCACOA = $('#RadioCACOA').prop('checked');
    console.log(isAPC_AcType);
    console.log(isCA_AcType);
    console.log(isAPCOA);
    console.log(isCACOA);
    if (isAPCOA) {
        isValid = isValid + CheckValidValueByID('txt_0_1');
        if (isValid == 0)
            isValid = isValid + CheckValidValueByID('txt_0_2');
    }

    if (isCACOA) {
        isValid = isValid + CheckValidValueByID('txt_1_1');
        if (isValid == 0)
            isValid = isValid + CheckValidValueByID('txt_1_2');
    }

    if (isValid == 0) {
        $('.clsValidDT').each(function (i, val) {
            if (CheckValidValue('clsValidDT', i) > 0)
            { isValid++; return false; }
        });
    }

    if (isValid == 0) {
        if ($("#ddlBankList").val() != "") {
            $.each(oAdditionalFields, function (key, value) {
                if ($("#txt" + value).val() == "") {
                    isValid++; return false;
                }
            });
        //} else {
        //    ShowMsgBox('showMSG', 'Please select Bank for POS Pay Setting.', '', 'failuremsg');
        //    isValid++; return false;
        }
    }

    if (isValid == 0) {
        if (strCurrentTab == 'BankInfo') {
            funSaveBankInfo();
        } else if (strCurrentTab == 'CheckSettings') {
            funSaveCheckSetting();
        }
    }
}

function CheckValidValueByID(Ctrlid) {
    if ($('#' + Ctrlid).val() == '') {
        $('#' + Ctrlid).focus();
        ShowMsgBox('showMSG', 'Please fill required value', '', 'failuremsg');
        return 1;
    } else {
        return 0;
    }
}

//=================check validations =============//
function CheckValidValue(cls, idx) {
    var strvalue = $('#' + $('.' + cls)[idx].id).val();
    if (strvalue == '') {
        if ($('#' + $('.' + cls)[idx].id).attr("disabled")) {
            $('#' + $('.' + cls)[idx].id).focus();
            ShowMsgBox('showMSG', 'Please fill required value', '', 'failuremsg');
            console.log('disabled is set on field so focus is not working');
        } else {
            $('#' + $('.' + cls)[idx].id).focus();
            ShowMsgBox('showMSG', 'Please fill required value', '', 'failuremsg');
        }

        return 1;
    }
}

function funSaveBankInfo() {
    window.onbeforeunload = null;
    var StrZip = '';
    if ($('#txtBankZip1').val() != '') {
        StrZip = ($('#txtBankZip').val() + '-' + $('#txtBankZip1').val());
    } else {
        StrZip = $('#txtBankZip').val();
    }

    var ObjBankInfo = {
        BankId: StrBankInfo,
        Bankname: $('#txtBankName').val(),
        CompanyId: $('#hdnBankCompanyCode').val(),
        Address1: $('#txtBankAddress1').val(),
        Address2: $('#txtBankAddress2').val(),
        Address3: $('#txtBankAddress3').val(),
        city: $('#txtBankCity').val(),
        State: $('#txtBankState').val(),
        zip: StrZip,
        Country: $('#txtBankCountry').val(),
        RoutingNumber: $('#txtRoutingNumber').val(),
        AccountNumber: $('#txtAccountNumber').val(),
        BranchNumber: $('#txtBranchNumber').val(),
        Branch: $('#txtBranchName').val(),
        Clearing: $('#hdnBankClearing').val(),
        Cash: $('#hdeBankCash').val(),
        Suspense: $('#hdnBankSuspense').val(),
        Bankfees: $('#hdnBankFees').val(),
        Deposits: $('#hdnBankDeposits').val(),
        SourceCodeID: $('#hdnBankSourceDode').val(),
        CurrencyBank: $('#ddlCurrency :selected').val(),//$('#hdnBankCurrencyId').val(),
        Status: $('#ChkBankActive').prop('checked'),
        PostiivePay: 'No',
        Prodid: localStorage.ProdId,
        CreatedBy: localStorage.UserId
    }

    var isvalid = "";
    isvalid += CheckRequired($("#txtBankCompnayCode"));
    isvalid += ($('#ddlCurrency :selected').val() === '') ? '1' : '';
    isvalid += CheckRequired($("#txtBankName"));
    isvalid += CheckRequired($("#txtBankCountry"));
    isvalid += CheckRequired($("#txtBankAddress1"));
    isvalid += CheckRequired($("#txtBankCity"));
    isvalid += CheckRequired($("#txtBankZip"));
    isvalid += CheckRequired($("#txtRoutingNumber"));
    isvalid += CheckRequired($("#txtAccountNumber"));
    isvalid += CheckRequired($("#txtBranchName"));
    isvalid += CheckRequired($("#txtBankState"));
    isvalid += CheckRequired($("#txtStartingNumber"));
    isvalid += CheckRequired($("#txtEndNumber"));

    if (isvalid == "") {
        $.ajax({
            url: APIUrlInsertUpdateBankInfo,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjBankInfo),
        })
        .done(function (response) {
            localStorage.strBankId = response;

            $.ajax({
                url: APIUrlCheckSettingSave + '?BankId=' + response + '&StartNumber=' + $('#txtStartingNumber').val() + '&EndNumber=' + $('#txtEndNumber').val() + '&ProdId=' + localStorage.ProdId + '&CreatedBy=' + localStorage.UserId,
                cache: false,
                beforeSend: function (request) { request.setRequestHeader("Authorization", localStorage.EMSKeyToken); },
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
            })
            .done(function (response) {
                SavePOSSetting();
                console.log('Check Setting Is Saved Successfully..');
            })
            .fail(function (error) {
                ShowMSG(error);
            })

            BankInfoSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
            $('#txtBankName').notify('This Bank information could not be saved.\nIf this problem persists, please contact Support. Thanks!', { autoHide: false })
        })
    }
}

function BankInfoSucess(response) {
    StrBankInfo = response;
    funSaveClearingAccounts(StrBankInfo);

    if (StrBankInfo != 0) {
        $(location).attr('href', 'Banks');
        ShowMsgBox('showMSG', 'Bank Information Saved ..!!', '', '');
    }
}

//-------- Check Setting Save 12/22/2015----------------------//
function funSaveCheckSetting() {
    window.onbeforeunload = null;
    var SqCount = $('.cont');
    // funSaveBankInfo();
    var isvalid = "";
    isvalid += CheckRequired($("#txtCSTopMargin"));
    isvalid += CheckRequired($("#txtCSLeftMargin"));
    isvalid += CheckRequired($("#txtCSRightMargin"));
    isvalid += CheckRequired($("#txtCSBottomMargin"));

    if (isvalid == "") {
        var ObjCheckSetting = {
            CheckSettingID: StrCheckSettingId,
            CompanyID: $('#hdnBankCompanyCode').val(),
            Style: '1/3*1/3*1/3',
            Prefix: $('#txtPrefix').val(),
            Length: $('#txtCSNumberLength').val(),
            StartNumber: $('#txtCSStart').val(),
            EndNumber: $('#txtCSEnd').val(),
            Collated: $('#ddlReverseCollated').val(),
            PrintZero: $('#ChkCSPrintZero').prop('checked'),
            Copies: $('#txtCSCopies').val(),
            TopMargin: $('#txtCSTopMargin').val(),
            BottomMargin: $('#txtCSBottomMargin').val(),
            LeftMargin: $('#txtCSLeftMargin').val(),
            RightMargin: $('#txtCSRightMargin').val(),
            Status: 'Actvie',
            BankID: StrBankInfo,
            Prodid: localStorage.ProdId,
            CreatedBy: localStorage.UserId,
            SectionOne: SqCount[0].textContent,
            SectionTwo: SqCount[1].textContent,
            SectionThree: SqCount[2].textContent,
        }

        $.ajax({
            url: APIUrlInsertUpdateCheckSetting,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjCheckSetting),
        })
        .done(function (response) {
            funSaveCheckSettingSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function funSaveCheckSettingSucess(response) {
    StrCheckSettingId = response;
    $(location).attr('href', 'Banks');
    ShowMsgBox('showMSG', 'Check Setting Saved ..!!', '', '');
}

//--------  GetBankList 12/24/2015----------------------//
function GetBankList() {
    $.ajax({
        url: APIUrlGetBankList + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetBankListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetBankListSucess(response) {
    $('#tblBankInfoTBody').html('');

    var Tcount = response.length;
    var strHtml = '';
    for (var i = 0; i < Tcount; i++) {
        let CompanyCode = response[i].CompanyCode;
        let Bankname = response[i].Bankname;
        let CurrencyName = response[i].CurrencyName;
        let BankId = response[i].BankId;
        let PostiivePay = response[i].PostiivePay;
        let StartNo = response[i].StartNumber;
        let EndNo = response[i].EndNumber;
        strHtml += '<tr>';
        strHtml += '<td>' + CompanyCode + '</td>';
        strHtml += '<td><a href="#" onclick="javascript:funGetBankDetails(' + BankId + ');" style="color: #337ab7;">' + Bankname + '</a></td>';
        strHtml += `<td>${CurrencyName}</td>`;
        strHtml += '<td>' + StartNo + '</td>';
        strHtml += '<td>' + EndNo + '</td>';
        strHtml += '<td>' + ((response[i].NextCheckNumber == -1) ? StartNo : response[i].NextCheckNumber) + '</td>';
        strHtml += '<td>' + '-' + '</td>';
        strHtml += '</tr>';
    }
    $('#tblBankInfoTBody').html(strHtml);
}

//--------   Country list from countrylist.js ----------------------//
function FillAutoCountrySuccess(response) {
    GetCountryListVar = [];
    GetCountryListVar = response;
    var ProductListjson = GetCountryList();
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ID,
            label: m.name,
            //value: m.CountryCode,
            //label: m.CountryName,
        };
    });

    $(".searchCountry").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnBankCountry").val(ui.item.value);
            $('#txtBankCountry').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBankCountry").val(ui.item.value);
            $('#txtBankCountry').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}
/*
function GetStateList() {
    var strValue = -1;
    if ($('#hdnBankCountry').val() != 0) {
        strValue = $('#hdnBankCountry').val()
    }

    $.ajax({
        url: APIUrlGetStateList + '?CountryID=' + strValue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetStateListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetStateListSucess(response) {
    GetStateListVar = [];
    GetStateListVar = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.StateID,
            label: m.StateName,
            //  BuyerId: m.BuyerId,
        };
    });

    $(".SearchState").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            //   $("#hdnBankCountry").val(ui.item.value);
            $('#txtBankState').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            //  $("#hdnBankCountry").val(ui.item.value);
            $('#txtBankState').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}
*/
//--------   Bank Details 12/25/2015----------------------//
function funGetBankDetails(values) {
    localStorage.strBankId = values;
    $(location).attr('href', 'AddBanks');
}

function BankIdDetails() {
    $.ajax({
        url: APIUrlGetBankDetails + '?BankId=' + localStorage.strBankId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        BankDetailsSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function BankDetailsSucess(response) {
    if (response.length === 1) {
        StrBankInfo = response[0].BankId;
        $('#txtBankCompnayCode').val(response[0].CompanyCode);
        $('#hdnBankCompanyCode').val(response[0].CompanyId);
        AtlasDocument.BindCurrency(response[0].CurrencyCode);

        $('#txtBankName').val(response[0].Bankname);
        $('#LiBankName').text(response[0].Bankname);
        $('#txtBankCountry').val(response[0].Country);
        // $('#hdnBankCountry').val(response[0].);
        $('#txtBankAddress1').val(response[0].Address1);
        $('#txtBankAddress2').val(response[0].Address2);
        $('#txtBankAddress3').val(response[0].Address3);
        $('#txtBankCity').val(response[0].city);
        $('#txtBankState').val(response[0].State);
        $('#ChkBankActive').prop('checked', response[0].BankStatus);
        if (response[0].zip.length > 5) {
            var strZip = response[0].zip;
            var FstrZip = strZip.split('-');
            $('#txtBankZip').val(FstrZip[0]);
            $('#txtBankZip1').val(FstrZip[1]);
        } else {
            $('#txtBankZip').val(response[0].zip);
        }
        $('#txtRoutingNumber').val(response[0].RoutingNumber);
        $('#txtAccountNumber').val(response[0].AccountNumber);
        $('#txtBranchName').val(response[0].Branch);
        $('#txtBranchNumber').val(response[0].BranchNumber);

        ////////////////check Setting
        $('#txtCSNumberLength').val(response[0].Length);
        //  $('#txtCSChkIsIssued').val(response[0].);
        $('#txtCSStart').val(response[0].StartNumber);
        $('#txtCSEnd').val(response[0].EndNumber);
        if (response[0].Collated != null) {
            $('#ddlReverseCollated').val(response[0].Collated);
        }
        $('#ChkCSPrintZero').prop('checked', response[0].PrintZero);
        $('#txtCSCopies').val(response[0].Copies);
        $('#txtCSTopMargin').val(response[0].TopMargin);
        $('#txtCSLeftMargin').val(response[0].LeftMargin);
        $('#txtCSRightMargin').val(response[0].RightMargin);
        $('#txtCSBottomMargin').val(response[0].BottomMargin);
        $('#chkCSActive').prop('checked', response[0].CheckStatus);
        $('#txtStartingNumber').val(response[0].StartNumber);
        $('#txtEndNumber').val(response[0].EndNumber);
        if (response[0].SectionOne != null) {
            $('#Section1').text(response[0].SectionOne);
            $('#Section2').text(response[0].SectionTwo);
            $('#Section3').text(response[0].SectionThree);
        }

        var bankconfig = JSON.parse(response[0].configJSON);
        if (bankconfig.POSPay != undefined) {
            //var pospay = jQuery.parseJSON(config.POSPay);
            objBankConfig = bankconfig.POSPay.Config;
            BankConfig = objBankConfig["Settings.Banks.POSPay.List"];

            //GetConfig("Settings.Banks.POSPay.List"); // INVALID call to unecessary function and called outside individual bank edit
            objAConfigList = new AtlasConfig();
            objAConfigList.ConfigGet('Settings.Banks.POSPay.List'
                , (response) => {
                    BindBankDropDown(JSON.parse(response.ConfigJSON), BankConfig);
                    RenderPOSPay(BankConfig, objBankConfig);
                }
            );


        }

        $('#hdnBankCountry').val(response[0].CountryCode);
        //GetStateList();
    }

    $('#txt_0_0').val(response[0].CompanyCode);
    $('#txt_1_0').val(response[0].CompanyCode);
    $('#txt_0_0').attr('coacode', response[0].CompanyCode);
    $('#txt_1_0').attr('coacode', response[0].CompanyCode);

    $('#hdnCOACode_0').val(response[0].CompanyCode);
    $('#hdnCOACode_1').val(response[0].CompanyCode);

    GetClearingAccountList();
}

//------------------------------------------------ Error 
function ShowMSG(error) {
    console.log(error);
}

$('#chkChkIssued').change(function () {
    if ($(this).is(":checked")) {

        $('#txtCSStart').prop("disabled", false);
        $('#txtCSEnd').prop("disabled", false);
        $('#txtCSStart').val('');
        $('#txtCSEnd').val('');
    } else {
        $('#txtCSStart').prop("disabled", true);
        $('#txtCSEnd').prop("disabled", true);
    }
});

//INVALID; Shouldn't have a second document.ready in the same js file.
$(document).ready(function () {
    formmodified = 0;
    $('form *').change(function () {
        formmodified = 1;
    });

    window.onbeforeunload = confirmExit;
    function confirmExit() {
        if (formmodified == 1) {
            return "Changes were made but not saved. Would you like to save changes? ";
        }
    }

    $("input[name='commit']").click(function () {
        formmodified = 0;
    });
});

function funCheckCurrentTab(values) {
    strCurrentTab = values;
}

/*
function FuncheckCountry() {
    var StrCountryCompany = $('#txtBankCountry').val().trim();
    if (StrCountryCompany != '') {
        for (var i = 0; i < GetCountryListVar.length; i++) {
            if ((GetCountryListVar[i].name).toLowerCase() == StrCountryCompany.toLowerCase()) {
                $('#hdnBankCountry ').val(GetCountryListVar[i].ID);
                $('#txtBankCountry').val(GetCountryListVar[i].name);
                break;
            } else {
                $('#hdnBankCountry').val('');
                $('#txtBankCountry').val('');
            }
        }

        for (var i = 0; i < GetCountryListVar.length; ++i) {
            if (GetCountryListVar[i].name.substring(0, StrCountryCompany.length).toLowerCase() === StrCountryCompany.toLowerCase()) {
                $('#hdnBankCountry ').val(GetCountryListVar[i].ID);
                $('#txtBankCountry').val(GetCountryListVar[i].name);
                break;
            }
        }
    } else {
        $('#hdnBankCountry ').val(GetCountryListVar[0].ID);
        $('#txtBankCountry').val(GetCountryListVar[0].name);
    }
}
*/

/*
$('#txtBankState').blur(function () {
    GetStateList();
    var StrStateCompany = $('#txtBankState').val().trim();
    if (StrStateCompany != '') {
        for (var i = 0; i < GetStateListVar.length; i++) {
            if ((GetStateListVar[i].StateName).toLowerCase() == StrStateCompany.toLowerCase()) {
                $('#txtBankState ').attr('name', GetStateListVar[i].StateID);
                $('#txtBankState').val(GetStateListVar[i].StateName);
                break;
            } else {
                $('#txtBankState').removeAttr('name');
                $('#txtBankState').val('');
            }
        }

        for (var i = 0; i < GetStateListVar.length; ++i) {
            if (GetStateListVar[i].StateName.substring(0, StrStateCompany.length).toLowerCase() === StrStateCompany.toLowerCase()) {
                $('#txtBankState ').attr('name', GetStateListVar[i].StateID);
                $('#txtBankState').val(GetStateListVar[i].StateName);
                break;
            }
        }
    } else {
        $('#txtBankState ').attr('name', GetStateListVar[0].StateID);
        $('#txtBankState').val(GetStateListVar[0].StateName);
    }
})
*/
//================Check CompanyCode==================//
$('#txtBankCompnayCode').blur(function () {
    var strCOAID = '';
    $('#txt_').val(strCOAID);

    var StrGetCompany = $('#txtBankCompnayCode').val().trim();
    if (StrGetCompany != '') {
        for (var i = 0; i < StrCompanyListGet.length; i++) {
            if ((StrCompanyListGet[i].CompanyCode).toLowerCase() == StrGetCompany.toLowerCase()) {

                $('#hdnBankCompanyCode ').val(StrCompanyListGet[i].CompanyID);
                $('#txtBankCompnayCode').val(StrCompanyListGet[i].CompanyCode);
                break;
            } else {
                $('#hdnBankCompanyCode').val('');
                $('#txtBankCompnayCode').val('');
            }
        }

        for (var i = 0; i < StrCompanyListGet.length; ++i) {
            if (StrCompanyListGet[i].CompanyCode.substring(0, StrGetCompany.length).toLowerCase() === StrGetCompany.toLowerCase()) {
                $('#hdnBankCompanyCode ').val(StrCompanyListGet[i].CompanyID);
                $('#txtBankCompnayCode').val(StrCompanyListGet[i].CompanyCode);
                break;
            }
        }
    } else {
        $('#hdnBankCompanyCode ').val(StrCompanyListGet[0].CompanyID);
        $('#txtBankCompnayCode').val(StrCompanyListGet[0].CompanyCode);
    }
    funPassCompanyCode();
})

function funPassCompanyCode() {
    if ($('#txtBankCompnayCode').val() != '') {
        var strval = $('#txtBankCompnayCode').val();
        if ($('#txt_0_0').val() != strval) {
            for (var i = 0; i < ArrSegment.length; i++) {
                $('#txt_0_' + i).val('');
                $('#txt_0_' + i).removeAttr('coacode');
            }

            for (var i = 0; i < ArrSegment.length; i++) {
                $('#txt_1_' + i).val('');
                $('#txt_1_' + i).removeAttr('coacode');
            }
        }

        if ($('#txt_0_0').val() == '') {
            $('#txt_0_0').val(strval);
            $('#txt_1_0').val(strval);
            $('#txt_0_0').attr('coacode', strval);
            $('#txt_1_0').attr('coacode', strval);
            $('#hdnCOACode_0').val(strval);
            $('#hdnCOACode_0').attr(strval);
        }
    }
}

$('input[id="txtCSStart"]').keypress(function () {
    if (this.value.length >= $('#txtCSNumberLength').val()) {
        return false;
    }
});

$('input[id="txtCSEnd"]').keypress(function () {
    if (this.value.length >= $('#txtCSNumberLength').val()) {
        return false;
    }
});

//================minVAlue For Routing Number============//
function phoneno() {
    var a = $('#txtRoutingNumber').val();
    var alength = a.length;
    if (alength == 9) {
    } else {
        $('#txtRoutingNumber').val('');
    }
}

function ChangeTextBankBtn() {
    $('#btnSaveBank').text('');
}

//=================Get Transaction  Detail
//===================segment
function funSegment123(values, SegmentName, SegmentP) { ////// 123
    GlbCOAList = [];
    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    } else {
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
    .done(function (response) {
        funSegmentSucess(response, values);
    })
    .fail(function (error) {
        console.log(error);
    })
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
            }
        }
    })
}

function funCheckOptionalAutoFill(value, segmentName, valueN) {
    var strval = $('#txtOptional_' + value + '_' + valueN).val();

    if (strval != '') {
        for (var i = 0; i < GblOptionalCOA.length; i++) {
            if (GblOptionalCOA[i].AccountCode.match(strval)) {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[i].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[i].AccountID);
                break;
            } else {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);
            }
        }
    } else {
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
        ShowMSG(error);
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

//// Seems likely to be INVALID
//=============getCOA Accounts================//
function funTrCreate() {
    var strhtml = '';
    strcount = ArrSegment.length;
    strhtml += '<tr><th>Type</th><th style="text-align: center;">AccountType</th>';
    strhtml += '<th colspan=' + strcount + ' style="text-align: center;border-bottom: #baccdd;border-bottom-style: solid;">Account</th>';
    strhtml += '</tr>';
    strhtml += '<tr><th></th><th></th>';
    for (var i = 0; i < ArrSegment.length; i++) {
        strhtml += '<th style="text-align: center;">' + ArrSegment[i].SegmentName + '</th>';
    }

    strhtml += '</tr>';
    strhtml += '<tr><td style="width: 20%;">AP Clearing</td>';
    strhtml += '<td style="width: 25%;"><input type="radio" name="APClearing" id="RadioAPAccount" checked onclick="javascript:funCheckAccountType(0,0);"> Account <input type="radio" name="APClearing" id="RadioAPCOA" onclick="javascript:funCheckAccountType(1,0);"> COA</td>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO')
            strhtml += '<td class="width40"><input type="text" class="clsValidCO" onblur="javascript:funCheckNextValue(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" disabled style="width:40%;"/></td>';
        else if (ArrSegment[i].SegmentName == 'DT')
            strhtml += '<td class="width40"><input type="text" class="input-required clsValidDT" onblur="javascript:funCheckNextValue(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" style="width:60%;"/></td>';
        else
            strhtml += '<td class="width40"><input type="text" class="clsValidLO" onblur="javascript:funCheckNextValue(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" style="width:60%;" disabled/></td>';
    }
    strhtml += '<td style="display:none;"><input type="hidden" id="hdnACId_0"/><input type="hidden" id="hdnCOACode_0"/><input type="hidden" id="hdnCOAId_0"/></td>';
    strhtml += '</tr>';
    strhtml += '<tr>';
    strhtml += '<td style="width: 20%;">Cash Account</td>';
    strhtml += '<td style="width: 25%;"><input type="radio" name="CashAccount" id="RadioCAAccount" checked onclick="javascript:funCheckAccountType(0,1);"> Account <input type="radio" name="CashAccount" id="RadioCACOA" onclick="javascript:funCheckAccountType(1,1);"> COA</td>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO')
            strhtml += '<td class="width40"><input type="text" class="clsValidCO" onblur="javascript:funCheckNextValue(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 1 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" disabled style="width:40%;"/></td>';
        else if (ArrSegment[i].SegmentName == 'DT')
            strhtml += '<td class="width40"><input type="text" class="input-required clsValidDT" onblur="javascript:funCheckNextValue(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 1 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" style="width:60%;" /></td>';
        else
            strhtml += '<td class="width40"><input type="text" class="clsValidLO" onblur="javascript:funCheckNextValue(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + 1 + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + 1 + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="" coaid="" style="width:60%;" disabled /></td>';
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
        strAccountName = 'APClearing';
    } else {
        strval = 4;
        strAccountName = 'CashAccount';
    }

    var Obj = {
        ProdId: localStorage.ProdId,
        AccountType: strval,
        CompanyId: $('#hdnBankCompanyCode').val(),
        Bankid: localStorage.strBankId,
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
            $(this).val(ui.item.label);
            $('#hdnCOACode_' + values).val(ui.item.COACode);
            $('#hdnCOAId_' + values).val(ui.item.COAId);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
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
                } catch (er) {
                    $(this).val('');
                    $(this).removeAttr('COAId');
                    $(this).removeAttr('COACode');
                }
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
        url: APIUrlClearingAccountList + '?Type=' + 'Bank' + '&CompanyId=' + localStorage.strBankId,
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
        if (response[i].AccountName === 'APClearing') {
            if (response[i].ClearingType === 'COA') {
                var strCOACode = response[i].AccountCode;
                var strCOACodesplit = strCOACode.split('|');
                for (var j = 0; j < ArrSegment.length; j++) {
                    if (ArrSegment[j].SegmentName == 'DT') {
                        var strval = strCOACodesplit[j].split('>');
                        var strvallength = strval.length;

                        var strDetail = strval[strvallength - 1];
                        $('#txt_0_' + j).val(strDetail);
                    } else {
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
        } else if (response[i].AccountName == 'CashAccount') {
            if (response[i].ClearingType == 'COA') {
                var strCOACode = response[i].AccountCode;
                var strCOACodesplit = strCOACode.split('|');
                for (var j = 0; j < ArrSegment.length; j++) {
                    if (ArrSegment[j].SegmentName == 'DT') {
                        var strval = strCOACodesplit[j].split('>');
                        var strvallength = strval.length;
                        var strDetail = strval[strvallength - 1];
                        $('#txt_1_' + j).val(strDetail);
                    } else {
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

            for (var j = 0; j < ArrSegment.length; j++) {

                $('#txt_1_' + j).prop('disabled', true);
            }
            $('#RadioCAAccount').prop('disabled', true);
            $('#RadioCACOA').prop('disabled', true);
        }
    }
}

function funSaveClearingAccounts(value) {
    var ArrAC = [];
    var strDetailPostion = 0;
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') {
            strDetailPostion = i;
        }
    }
    var strClearingType0 = 'Account';
    var strClearingType1 = 'Account';

    var strval0 = $('#hdnCOACode_0').val().split('|');
    var strval1 = $('#hdnCOACode_1').val().split('|');
    if (strval0.length > 1) {
        strClearingType0 = 'COA';
    }
    if (strval1.length > 1) {
        strClearingType1 = 'COA';
    }

    var obj = {
        AccountClearingId: $('#hdnACId_0').val(),
        Type: 'Bank',
        AccountName: 'APClearing',
        COAId: $('#hdnCOAId_0').val(),
        CompanyId: $('#hdnBankCompanyCode').val(),

        BankId: value,
        CreatedBy: localStorage.UserId,
        ProdId: localStorage.ProdId,
        AccountCode: $('#hdnCOACode_0').val(),
        ClearingType: strClearingType0
    }

    if ($('#txt_0_' + strDetailPostion).val() != '') {
        ArrAC.push(obj);
    }

    var obj = {
        AccountClearingId: $('#hdnACId_1').val(),
        Type: 'Bank',
        AccountName: 'CashAccount',
        COAId: $('#hdnCOAId_1').val(),
        CompanyId: $('#hdnBankCompanyCode').val(),
        BankId: value,
        CreatedBy: localStorage.UserId,
        ProdId: localStorage.ProdId,
        AccountCode: $('#hdnCOACode_1').val(),
        ClearingType: strClearingType1
    }
    if ($('#txt_1_' + strDetailPostion).val() != '') {
        ArrAC.push(obj);
    }

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
    .fail(function (error) {
        ShowMSG(error);
    })
}

// INVALID FUNCTION THAT PERFORMS NOTHING
function SaveClearingAccountsSucess(response) {

}

//========================================= CheckAccountCOA
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
        } else {
            for (var i = 0; i <= strNewCount; i++) {
                $('#txt_0_' + i).addClass(' input-required');

                if (i != 0) {
                    $('#txt_0_' + i).prop('disabled', false);
                    $('#txt_0_' + i).val('');
                }
                $('#hdnCOAId_0').val('');
            }
        }
    } else if (Type == 1) {
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

        } else {
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
}

//=========Check Number ===============//
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}

//function GetConfig(sSetting) {
////// INVALID usage of object prototype instead of creating the object and using the object as defined
//    AtlasConfig.prototype.ConfigGet(sSetting, GetConfigSuccess); INVALID
//}

function RenderPOSPayList(response) {
    if (response.ConfigName == "Settings.Banks.POSPay.List") {
        BindBankDropDown(JSON.parse(response.ConfigJSON), BankConfig);
    }
}

function RenderPOSPay(BankConfig, ExistingConfig) {
    //console.log(config);
    /* INVALID
    if (response.ConfigName == "Settings.Banks.POSPay.List") {
        var config = JSON.parse(response.ConfigJSON);
        BindBankDropDown(config, BankConfig);
    } else {
    */
    objAConfig = new AtlasConfig();
    let EFConfig = (ExistingConfig.ExtraFields) ? ExistingConfig.ExtraFields : {};

    if (BankConfig !== null) {
        objAConfig.ConfigGet(BankConfig
            , (response) => {
                var config = JSON.parse(response.ConfigJSON);
                if (config.ConfigAdditionalFields != null) {
                    var sAdditionalFieldHTML = "";
                    $.each(config.ConfigAdditionalFields, function (key, value) {
                        oAdditionalFields.push(value.replace(" ", "").toLowerCase());
                        oAdditionalItems.push(value.replace(" ", ""));

                        sAdditionalFieldHTML += "<div class='clearfix'></div><div class='floatLeft'>";
                        sAdditionalFieldHTML += "<label>" + value + "*: </label>";
                        sAdditionalFieldHTML += `<input type="text" id="txt${value.replace(' ', '').toLowerCase()}" value="${(EFConfig[value]) ? EFConfig[value] : ''}" class="form-control" placeholder="${value}">`;
                        sAdditionalFieldHTML += "</div>";
                    });

                    $('#possettings').append(sAdditionalFieldHTML);
                }
            }
        )
    }
    //} INVALID
}

function BindBankDropDown(configdata, existingValue) {
    var objParams = {
        domID: 'ddlBankList'
        , URL: ""
        , mapping: {
            'value': 'Config Name'
            , 'label': (data) => {
                return `${data["Display Name"]}`;
            }
        }
        , errorFunction: AtlasUtilities.LogError
        , cache: true
        , options: {}
        , 'existingValue': existingValue
        , hasblank: function (datalist, objP) {
            return (datalist.length > 1 /*|| objP.existingValue*/);
        }
    }

    AtlasForms.Controls.DropDown.RenderData(configdata, objParams);
}

function SavePOSSetting() {
    var flagSave = false;

    if ($("#ddlBankList").val() != "") {
        if (oAdditionalFields.length != 0) {
            $.each(oAdditionalFields, function (key, value) {
                if ($("#txt" + value).val() != "") {
                    flagSave = true;
                } else {
                    ShowMsgBox('showMSG', 'Please fill POS Setting Required Fields.', '', 'failuremsg');
                    flagSave = false;
                    return false;
                }
            });
        } else {
            flagSave = true;
        }
    } else {
        flagSave = true;
    }

    if (flagSave === true) {
        let configItems = PrepairPOSSetting();

        let obj = {
            BankID: localStorage.strBankId,
            ConfigSettingAttribute: 'POSPay.Config',
            ConfigSettingJSON: configItems,
            ProdID: localStorage.ProdId
        };

        AtlasUtilities.CallAjaxPost(
            APIUrlSavePOSSettings
            , false
            , (response) => {
                formmodified = false;
                $('#ddlBankList').notify('POS Pay Settings Saved', 'success');
                //ShowMsgBox('showMSG', 'POS Setting has been saved.', '', '');
            }
            , AtlasUtilities.LogError
            , {
                callParameters: obj
                , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        );
    }
    return flagSave;
    //} else {
    //    ShowMsgBox('showMSG', 'Please select Bank for POS Pay Setting.', '', 'failuremsg');
    //    return false;
    //}
}

function PrepairPOSSetting() {
    var oExtrafields = {};
    if (oAdditionalItems.length > 0) {
        $.each(oAdditionalItems, function (key, value) {
            oExtrafields[value] = $("#txt" + value.toLowerCase()).val()
        });
    }

    /* INVALID
        var objPOSConfig = {
            "Config": {
                "Settings.Banks.POSPay.List": $("#ddlBankList").val(),
                "ExtraFields": oExtrafields
            }
        }
    */
    objPOSConfig = {
        "Settings.Banks.POSPay.List": $("#ddlBankList").val()
        , "ExtraFields": oExtrafields
    };

    return JSON.stringify(objPOSConfig);
}

/* INVALID additional usage of equivalent to document.ready
$(function () {
    $("#ddlBankList").change(function () {
        $("#possettings").html("");
        oAdditionalFields = [];
        oAdditionalItems = [];
        //GetConfig($(this).val()); INVALID
    });
});
*/