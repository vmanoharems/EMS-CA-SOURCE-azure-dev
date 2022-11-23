//--------  API Colling 12/26/2015-- -----------//
var APIUrlCompanySetting = HOST + "/api/CompanySettings/InsertUpdateCompanyCreation";
var APIUrlCompanyTaxInfo = HOST + "/api/CompanySettings/InsertUpdateCompanyTaxInfo";
var APIUrlCompanyList = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlCompanyDetail = HOST + "/api/CompanySettings/GetCompanyDetail";
var APIUrlCompanySeting = HOST + "/api/CompanySettings/InsertUpdateCompanySetting";
var APIUrlCompanyExchangeRate = HOST + "/api/CompanySettings/InsertUpdateCurrencyExchange";
var APIUrlCompanyExchangeRateGet = HOST + "/api/CompanySettings/GetExchangeRate";
var APIUrlCompanyStartingValue = HOST + "/api/CompanySettings/InsertUpdateStartingvalue";
var APIUrlCompanyStartingValueGet = HOST + "/api/CompanySettings/GetStartingvalue";
var APIUrlCompanyCodeCheck = HOST + "/api/CompanySettings/CheckCompanyCode";
var APIUrlTaxAgencyAutoFill = HOST + "/api/CompanySettings/FederalTaxAgencyAutoFill";
var APIUrlTaxFormAutoFill = HOST + "/api/CompanySettings/FederalTaxFormAutoFill";
var APIUrlFillState = HOST + "/api/CompanySettings/GetStateListByCountryId";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlClearingAccountList = HOST + "/api/CompanySettings/GetCleringAccountById";

//-----------Global  Varable --------//
var getFirstState = '';
var PublicCompanyID = 0;
var Objtaxinfo;
var TaxInfoCheck;
var CheckStatus;
var ExchangeRateCheck = 0;
var ObjExRange;
var StartingValCheck = 0;
var objStartingValue;
var ExCheck;
var StrGetCompanyState = [];
var StrFillStateVar = [];
var getCompanyCountry = [];

//----end Decelaration-------//
$(document).ready(function () {
    G_AtlasConfig.ConfigGet('Settings.Currencies.Rates', (config) => {
        let base = JSON.parse(config.ConfigJSON).BASE;
        AtlasDocument.BindCurrency(base);
    })

    $('#txtCompanyCode').prop('disabled', false);
    PublicCompanyID = 0;
    TaxInfoCheck = 0;
    GetCompanyList();
    G_FillCountryAutoComplete($('#txtCompanyCountry'));
    //FillCompanyCountry(cntryList);
    GetSegmentsDetails();
   
    $(".NumberOnly").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});
//--------  Tax info Function 12/26/2015-- -----------//
function DvTaxInfo() {
    $('#default').show();
}

function GetCompanyList() {
    var ProdID = localStorage.ProdId;
    $.ajax({
        url: APIUrlCompanyList + '?ProdID=' + ProdID, 
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(ProdID),
    })
.done(function (response) {
    CompanyListSucess(response);
})
}
//--------  CompanyListSucess 12/26/2015-- -----------//
function CompanyListSucess(response) {
    var TLength = response.length;
    $('#dvCompany').attr('style', 'display:none;');
    $('#ddlCompany').empty();
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            var CompanyID = response[i].CompanyID;
            var CompanyName = response[i].CompanyName;
            $("#ddlCompany").append("<option  value=" + CompanyID + ">" + CompanyName + "</option>");
        }
        GetClearingAccountList(response[0].CompanyID);
        $('#dvCompany').attr('style', 'display:block;');
    } else {
        $('#dvCompany').attr('style', 'display:none;');
    }

    if (TLength === 0) {
        $('#spanBreadCum').html('Add New Company');
    } else {
        var CompanyNameBreadCum = response[0].CompanyName;
        $('#spanBreadCum').html(CompanyNameBreadCum);
        var CompanyID = response[0].CompanyID;
        $("#" + CompanyID).attr('style', 'border-bottom: 30px solid #4cbf63;');
        GetCompanyDetail(CompanyID);
    }
}
//-------- saving Company 12/26/2015-- -----------//
$('#btnSaveCompany').click(function () {
    funSaveCreation();
})

function funSaveCreation() {
    formmodified = 0;

    CheckStatus = "Updated";
    if (PublicCompanyID == 0) {
        CheckStatus = "Created";
    }
    CheckBeforeSave();
}
function GetSegmentsDetails() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 1,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetSegmentListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetSegmentListSucess(response) {
    var glbSegment = [];
    glbSegment = response;


    for (var i = 0; i < response.length; i++) {
        if (response[i].Classification = 'Company') {
            if (i == 0) {
                $('#spnMaskingType').text(response[i].CodeLength);
                $("#txtCompanyCode").attr('maxlength', response[i].CodeLength);
            }
            
        }
    }
}

function CheckBeforeSave() {
    if (PublicCompanyID == 0) {
        if (TaxInfoCheck == 1) {
            SaveCompany();
        } else {
            var isvalid = "";
            isvalid += CheckRequired($("#txtCompanyCode"));
            isvalid += CheckRequired($("#txtProTitle"));
            isvalid += CheckRequired($("#txtCompanyName"));
            isvalid += CheckRequired($("#txtCompanyCountry"));
            isvalid += CheckRequired($("#txtAddress1"));
            isvalid += CheckRequired($("#txtCity"));
            isvalid += CheckRequired($("#txtCompanyState"));
            isvalid += CheckRequired($("#txtZip"));
            isvalid += CheckRequired($("#txtPhone"));
            isvalid += CheckRequired($("#txtContactName"));
            isvalid += CheckRequired1($("#txtEntry"));
            isvalid += CheckRequired1($("#txtCost"));
            isvalid += CheckRequired($("#txtFormat"));
            isvalid += CheckRequired($("#txtLabel"));
            //isvalid += CheckRequired($("#txtFiscalStart"));
            isvalid += CheckRequired($("#txtPeriodStart"));

            if (isvalid == "") {
                var Msg = 'Please Save Tax Related Info First !!';
                ShowMsgBox('showMSG', Msg, '', 'failuremsg');
            }
            $("#txtFiscalStart").val($("#txtPeriodStart").val())
        }
    } else {
        SaveCompany();
    }
}

function SaveCompany() {
    $("#txtFiscalStart").val($("#txtPeriodStart").val())
    var isvalid = "";
    isvalid += CheckRequired($("#txtCompanyCode"));
    isvalid += CheckRequired($("#txtProTitle"));
    isvalid += CheckRequired($("#txtCompanyName"));
    isvalid += CheckRequired($("#txtCompanyCountry"));
    isvalid += CheckRequired($("#txtAddress1"));
    isvalid += CheckRequired($("#txtCity"));
    isvalid += CheckRequired($("#txtCompanyState"));
    isvalid += CheckRequired($("#txtZip"));
    isvalid += CheckRequired($("#txtPhone"));
    isvalid += CheckRequired($("#txtContactName"));
    isvalid += CheckRequired1($("#txtEntry"));
    isvalid += CheckRequired1($("#txtCost"));
    isvalid += CheckRequired($("#txtFormat"));
    isvalid += CheckRequired($("#txtLabel"));
    //isvalid += CheckRequired($("#txtFiscalStart"));
    isvalid += CheckRequired($("#txtPeriodStart"));

    if (isvalid == "") {  
        var ObjCompany = {
            CompanyID: PublicCompanyID,
            CompanyCode: $('#txtCompanyCode').val(),
            ProductionTitle: $('#txtProTitle').val(),
            CompanyName: $('#txtCompanyName').val(),
            Address1: $('#txtAddress1').val(),
            Address2: $('#txtAddress2').val(),
            Address3: $('#txtAddress3').val(),
            City: $('#txtCity').val(),
            State: $('#txtCompanyState').val(),
            Zip: $('#txtZip').val(),
            CompanyPhone: $('#txtPhone').val(),
            Contact: $('#txtContactName').val(),
            Entry: $('#txtEntry').val(),
            Cost: $('#txtCost').val(),
            Format: $('#txtFormat').val(),
            FiscalStartDate: $('#txtPeriodStart').val(),
            DefaultValue: $('select#ddlDefault option:selected').val(),
            Createdby: localStorage.UserId,
            ProdID: localStorage.ProdId,
            PeriodStart: $('#txtPeriodStart').val(),
            Country: $('#txtCompanyCountry').val(),
            PeriodStartType: $('select#ddlPeriod option:selected').val()
        }

        $.ajax({
            url: APIUrlCompanySetting,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjCompany),
        })
        .done(function (response) {
            CompanyCreationSucess(response);
            formmodified = 0;
        })
        .fail(function (error) {
            CompanyCreationFail(error);
        })
    }
}

function CompanyCreationSucess(response) {
    $('#ddlPeriod').attr('disabled', true);
    $('#txtPeriodStart').attr('disabled', true);

    PublicCompanyID = response;
    //$("#ulCompanyTab").append("<li class='liComDet' id=" + PublicCompanyID + "><a href=\"javascript:GetCompanyDetail('" + PublicCompanyID + "')\">" + $('#txtCompanyName').val() + "</a></li>");

    CompanySetting();

    if (TaxInfoCheck == 1) {
        funcSaveTaxInfo();
    }
    if (ExchangeRateCheck == 1) {
        SaveExchangeRate();
    }
    if (StartingValCheck == 1) {
        SaveStartingValue();
    }
    if (ExCheck != 0) {
        var ObjDefaultArr = [];
        var TblCodes = $('#tblExcRange tr').length;
        for (i = 0; i < TblCodes; i++) {
            var ObjDefault = {
                CompanyID: PublicCompanyID,
                CurrencyName: $('#spanEx1' + i).html(),
                Currencycode: $('#spanEx1' + i).html(),
                ExchangeRate: $('#spanEx2' + i).html(),
                DefaultFlag: 1,
                createdby: localStorage.UserId,
                ProdID: localStorage.ProdId
            }
            ObjDefaultArr.push(ObjDefault);
        }

        $.ajax({
            url: APIUrlCompanyExchangeRate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            sync: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjDefaultArr),
        })
    }
    var Msg = 'Company ' + CheckStatus + ' Sucessfully !!';

    ShowMsgBox('showMSG', Msg, '', '');

    if (CheckStatus == "Created") {
        $("#ddlCompany").attr('style', 'display:block;');
        var CName = $('#txtCompanyName').val();
        $('#spanBreadCum').html(CName);
        $("#ddlCompany").append("<option  value=" + PublicCompanyID + ">" + CName + "</option>");
        $("#ddlCompany").val(PublicCompanyID);
    }
    $('#txtCompanyCode').prop('disabled', true);
    GetCompanyList();

}
function CompanyCreationFail(error) {
    console.log(error);
}

function CompanySetting() {
    var RealTimeCur;
    if ($('#chkRealTime').attr('checked')) {
        RealTimeCur = 1;
    } else {
        RealTimeCur = 0;
    }

    var ObjCompanySetting = {
        CompanyID: PublicCompanyID,
        AccountingCurrency: $('#ddlCurrency :selected').val(),
        ReportLabel: $('#txtLabel').val(),
        RealTimeCurrency: RealTimeCur,
        //FringeAccountID: $('#txtFringe').val(),
       // LaborAccountID: $('#txtLabor').val(),
        //SuspenseAccountID: $('#txtSuspense').val(),
        Createdby: localStorage.UserId,
        ProdID: localStorage.ProdId
    }

    $.ajax({
        url: APIUrlCompanySeting,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        sync: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjCompanySetting),
    })

}

//-------- Tax Info Division. 12/26/2015-- -----------//

$('#btnSaveTaxInfo').click(function () {
    formmodified = 0;
    var isvalid = "";
    isvalid += CheckRequired($("#txtFederalTaxAgency"));
    isvalid += CheckRequired($("#txtFederal"));
    isvalid += CheckRequired($("#txtEIN"));
    isvalid += CheckRequired($("#txtIncorporation"));
    isvalid += CheckRequired($("#txtTaxID"));

    if (isvalid == "") {
        TaxInfoCheck = 1;
        funcSaveTaxInfo();
    }
})
//-------- Function save Tax info 12/26/2015-- -----------//
function funcSaveTaxInfo() {
    Objtaxinfo = {
        CompanyID: PublicCompanyID,
        federaltaxagency: $('#txtFederalTaxAgency').val(),
        federaltaxform: $('#txtFederal').val(),
        EIN: $('#txtEIN').val(),
        CompanyTCC: $('#txtTCC').val(),
        StateID: $('#txtIncorporation').val(),
        StatetaxID: $('#txtTaxID').val(),
        CreatedBy: localStorage.UserId,
        ProdID: localStorage.ProdId
    }

    if (PublicCompanyID != 0) {
        formmodified = 0;
        $.ajax({
            url: APIUrlCompanyTaxInfo,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            sync: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(Objtaxinfo),
        })
    }
    hideDiv('default');
}

function CompanyCreationerror(error) {
    console.log(error);
}
//-------- AddCompany 12/26/2015-- -----------//
function AddCompany() {
    $('#dvCompanySection').show();

    $('#ddlPeriod').attr('disabled', false);
    $('#txtPeriodStart').attr('disabled', false);

    $('#txtCompanyCode').prop('disabled', false);
    $(".liComDet").attr('style', 'border-bottom:30px solid #5c8fbe');
    $("#liAddCompany").attr('style', 'border-bottom:30px solid #4cbf63;');
    $('#spanBreadCum').html('Add New Company');
    $('#ddlCompany').attr('style', 'display:none;');
    ResetFormValue();
    GetSegmentsDetails();
}
function Cancel() {
    $('#ddlPeriod').attr('disabled', true);
    $('#txtPeriodStart').attr('disabled', true);

    formmodified = 0;
    ShowMsgBox('showMSG', 'Changes were not saved !!', '', 'failuremsg');
    $('#ddlCompany').attr('style', 'display:block;');
    GetCompanyList();
}
//-------- Reset All Fields 12/26/2015-- -----------//
function ResetFormValue() {
    formmodified = 0;
    PublicCompanyID = 0;
    $('#txtCompanyCode').val('');
    $('#txtProTitle').val('');
    $('#txtCompanyName').val('');
    $('#txtAddress1').val('');
    $('#txtAddress2').val('');
    $('#txtAddress3').val('');
    $('#txtCity').val('');
    $('#txtCompanyState').val('');
    $('#txtZip').val('');
    $('#txtPhone').val('');
    $('#txtContactName').val('');
    $('#txtEntry').val('2');
    $('#txtCost').val('0');
    $('#txtCompanyCountry').val('');
    $('#txtFiscalStart').val('');
    $("#ddlDefault").val('Weekly');

    $('#txtFederalTaxAgency').val('IRS');
    $('#txtFederal').val('1099');
    $('#txtEIN').val('');
    $('#txtTCC').val('');
    $('#txtIncorporation').val('');
    $('#txtTaxID').val('');

    $('#txtAP').val('');
    $('#txtPO').val('');
    $('#txtInvoice').val('');
    $('#txtTaxID').val('');

    //$('#txtFringe').val('1');
    //$('#txtLabor').val('2');
    //$('#txtSuspense').val('3');
    $('#txtPeriodStart').val('');
    $('#spanTaxInfoHead').html('New Company');
    $('#ddlPeriod').val('Period Start');
    TaxInfoCheck = 0;
    StartingValCheck = 0;
    ExchangeRateCheck = 0;
    $('#txtFiscalStart').prop('disabled', false);

}
//-------- GetCompanyDetail 12/28/2015-- -----------//
function GetCompanyDetail(CompanyID) {
    $('#dvCompanySection').show();

    PublicCompanyID = CompanyID;
    $(".liComDet").attr('style', 'border-bottom: 30px solid #337ab7;');
    $("#" + CompanyID).attr('style', 'border-bottom: 30px solid #4cbf63;');
    $.ajax({
        url: APIUrlCompanyDetail + '?CompanyID=' + CompanyID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(ProdID),
    })
.done(function (response) {
    CompanyDetailSucess(response);
})
}

function CompanyDetailSucess(response) {
    var TLength = response.length;
    $('.form-control').attr('style', 'border-color:#d2d6de;');
    for (var i = 0; i < TLength; i++) {
        $('#txtCompanyCode').prop('disabled', true);
        $('#txtCompanyCode').val(response[i].CompanyCode);
        $('#txtProTitle').val(response[i].ProductionTitle);
        $('#txtCompanyName').val(response[i].CompanyName);
        $('#txtAddress1').val(response[i].Address1);
        $('#txtAddress2').val(response[i].Address2);
        $('#txtAddress3').val(response[i].Address3);
        $('#txtCity').val(response[i].City);
        $('#txtCompanyCountry').val(response[i].Country);
        $('#txtCompanyState').val(response[i].State);
        $('#txtZip').val(response[i].Zip);
        $('#txtPhone').val(response[i].CompanyPhone);
        $('#txtContactName').val(response[i].Contact);
        $('#txtEntry').val(response[i].Entry);
        $('#txtCost').val(response[i].Cost);
        $('#txtFormat').val(response[i].Format);
        $('#txtFiscalStart').val(response[i].FiscalStartDate);
        $('#ddlDefault').val(response[i].DefaultValue);
        // Changes 2 values
        $('#txtFederalTaxAgency').val('IRS');
        $('#txtFederal').val('1099');
        // Changes 2 values
        $('#txtEIN').val(response[i].EIN);
        $('#txtTCC').val(response[i].CompanyTCC);
        $('#txtIncorporation').val(response[i].StateID);
        $('#txtTaxID').val(response[i].StatetaxID);
        $('#txtFiscalStart').val(response[i].FiscalStartDate);
        $('#txtPeriodStart').val(response[i].PeriodStart);
        $('#ddlPeriod').val(response[i].PeriodStartType);
        $('#txtLabel').val(response[i].ReportLabel);
        //$('#txtFringe').val(response[i].FringeAccountID);
       // $('#txtLabor').val(response[i].LaborAccountID);
        //$('#txtSuspense').val(response[i].SuspenseAccountID);
        $('#ddlDefault').val(response[i].DefaultValue);
        $('#spanTaxInfoHead').html(response[i].CompanyCode);
        $('#spanBreadCum').html(response[i].CompanyName);

        $('#txtFiscalStart').prop('disabled', true);
    }
    var strcompanyid = $('#ddlCompany').val();
    GetClearingAccountList(strcompanyid);
}
//-------- Button ExchangeRate 12/26/2015-- -----------//
$('#btnExchangeRate').click(function () {
    formmodified = 0;
    var isvalid = "";
    isvalid += CheckRequired($("#txtCurrency"));
    isvalid += CheckRequired($("#txtExchangeRate"));

    if (isvalid == "") {
        if (PublicCompanyID == 0) {
            var CurrCode = $('#txtCurrency').val();
            var ExcRate = $('#txtExchangeRate').val();
            var ExSp1 = 'spanEx1' + ExCheck;
            var ExSp2 = 'spanEx2' + ExCheck;
            $("#tblExcRange").append("<tr><td style='width: 25%;'><span id='" + ExSp1 + "'>" + CurrCode + "</span></td><td><span id='" + ExSp2 + "'>" + ExcRate + "</span></td></tr>");
            $('#txtCurrency').val('');
            $('#txtExchangeRate').val('');
            ExCheck = ExCheck + 1;
            $('#txtCurrency').focus();
        }
        else {
            ExchangeRateCheck = 1;
            SaveExchangeRate();
        }
    }
})
//-------- Save ExchangeRate 12/28/2015-- -----------//
function SaveExchangeRate() {
    formmodified = 0;
    var ObjDefaultArr = [];
    ObjExRange = {
        CompanyID: PublicCompanyID,
        CurrencyName: $('#txtCurrency').val(),
        Currencycode: $('#txtCurrency').val(),
        ExchangeRate: $('#txtExchangeRate').val(),
        DefaultFlag: 1,
        createdby: localStorage.UserId,
        ProdID: localStorage.ProdId
    }
    ObjDefaultArr.push(ObjExRange);

    if (PublicCompanyID != 0) {
        formmodified = 0;
        $.ajax({
            url: APIUrlCompanyExchangeRate,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            sync: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjDefaultArr),
        })
        .done(function (response) {
            ExchangeRateSucess(response);
        })
    }
}
function ExchangeRateSucess(response) {
    var CurrCode = $('#txtCurrency').val();
    var ExcRate = $('#txtExchangeRate').val();
    $("#tblExcRange").append("<tr><td style='width: 25%;'>" + CurrCode + "</td><td>" + ExcRate + "</td></tr>");
    $('#txtCurrency').val('');
    $('#txtExchangeRate').val('');
    $('#txtCurrency').focus();
}
//--------  ExchangeRate 12/26/2015-- -----------//
function ExRate() {
    formmodified = 0;
    ExCheck = 0;
    showDiv('addnew');
    if (PublicCompanyID == 0) {
        $("#tblExcRange").empty();
        $('#spanExchangeRateHead').html('New Company');
    }
    else {
        $.ajax({
            url: APIUrlCompanyExchangeRateGet + '?CompanyID=' + PublicCompanyID,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })
    .done(function (response) {
        ExRateSucess(response);
    })
    }
}
function ExRateSucess(response) {
    var TLength = response.length;
    $("#tblExcRange").empty();
    for (var i = 0; i < TLength; i++) {
        var CurrCode = response[i].Currencycode;
        var ExcRate = response[i].ExchangeRate;
        $('#spanExchangeRateHead').html(response[i].CompanyCode);
        $("#tblExcRange").append("<tr><td style='width: 25%;'>" + CurrCode + "</td><td>" + ExcRate + "</td></tr>");
    }
}

$('#btnStartingValue').click(function () {

    var isvalid = "";
    isvalid += CheckRequired($("#txtAP"));
    isvalid += CheckRequired($("#txtPO"));
    // isvalid += CheckRequired($("#txtInvoice"));

    if (isvalid == "") {
        StartingValCheck = 1;
        SaveStartingValue();
        hideDiv('startValues');
    }
})
//-------- Save Starting values 12/28/2015-- -----------//
function SaveStartingValue() {
    objStartingValue = {
        CompanyID: PublicCompanyID,
        AP: $('#txtAP').val(),
        PO: $('#txtPO').val(),
        Invoice: $('#txtInvoice').val(),
        CreatedBy: localStorage.UserId,
        ProdID: localStorage.ProdId
    }
    if (PublicCompanyID != 0) {
        formmodified = 0;
        $.ajax({
            url: APIUrlCompanyStartingValue,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(objStartingValue),
        })
    }
}
//-------- Get Starting value  12/28/2015-- -----------//
function GetStartingVal() {
    showDiv('startValues');
    $('#btnStartingValue').show();
    // $('#txtAP').val('');
    // $('#txtPO').val('');
    $('#txtInvoice').val('');
    if (PublicCompanyID == 0) {
        $('#spanStartingValueHead').html('New Company');
    }
    else {
        $('#txtAP').val('');
        $('#txtPO').val('');
        $.ajax({
            url: APIUrlCompanyStartingValueGet + '?CompanyID=' + PublicCompanyID,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })
      .done(function (response) {
          StartingValueSucess(response);
      })
    }
}

function StartingValueSucess(response) {
    var TLength = response.length;
    for (var i = 0; i < TLength; i++) {
        if (response[i].AP != '') {
            $('#btnStartingValue').hide();

        }
        else {
            $('#btnStartingValue').show();
        }
        $('#txtAP').val(response[i].AP);
        $('#txtPO').val(response[i].PO);
        $('#txtInvoice').val(response[i].Invoice);

        $('#spanStartingValueHead').html(response[i].CompanyCode);
    }
}

function GetCompanyDetailbyID() {
    var CompanyID = $('select#ddlCompany option:selected').val();
    GetCompanyDetail(CompanyID);
}

$(window).load(function () {
    $('.phone_us').mask('(000) 000-0000');
    $('.zipCode').mask('00000');
});

$("#txtCompanyCode").focusout(function () {
    if (PublicCompanyID == 0) {
        var CompanyCode = $('#txtCompanyCode').val();
        var ProdID1 = localStorage.ProdId
        $.ajax({
            url: APIUrlCompanyCodeCheck + '?CompanyCode=' + CompanyCode + '&ProdID=' + ProdID1,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
            // data: JSON.stringify(ProdID),
        })
         .done(function (response) {
             CompanyCodeCheckSucess(response);
         })
    }
});

function CompanyCodeCheckSucess(response) {
    if (response != 0) {
        ShowMsgBox('showMSG', 'Company Code Already Exists !!', '', 'failuremsg');
        $('#txtCompanyCode').val('');
    }
}

$('#txtFederalTaxAgency').click(function () {
    TaxAgencyAutoFill();
})
$('#txtFederalTaxAgency').focus(function () {
    TaxAgencyAutoFill();
})

$('#txtFederal').click(function () {
    TaxFormAutoFill();
})
$('#txtFederal').focus(function () {
    TaxFormAutoFill();
})
//-------- TaxAgencyAutoFill 12/28/2015-- -----------//
function TaxAgencyAutoFill() {
    $.ajax({
        url: APIUrlTaxAgencyAutoFill,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { TaxAgencyAutoFillSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function ShowMSG(error) {
    console.log(error);
}
//-------- TaxFormAutoFill 12/28/2015-- -----------//
function TaxFormAutoFill() {
    $.ajax({
        url: APIUrlTaxFormAutoFill,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { TaxFormAutoFillSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function TaxAgencyAutoFillSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.FederalTaxID,
            label: m.FederalTaxValue,
            //  BuyerId: m.BuyerId,
        };
    });

    $(".TaxAgencyAutoFill").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdFederalTaxAgency").val(ui.item.value);
            $('#txtFederalTaxAgency').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdFederalTaxAgency").val(ui.item.value);
            $('#txtFederalTaxAgency').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                $("#hdFederalTaxAgency").val('');
                $('#txtFederalTaxAgency').val('');
            }
        }
    })
}

function TaxFormAutoFillSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.FederalTaxID,
            label: m.FederalTaxValue,
            //  BuyerId: m.BuyerId,
        };
    });

    $(".TaxFormAutoFill").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdFederal").val(ui.item.value);
            $('#txtFederal').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdFederal").val(ui.item.value);
            $('#txtFederal').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                $("#hdFederal").val('');
                $('#txtFederal').val('');
            }
        }
    })
}


const C_FillState = function () {
    G_CountryStates($('#txtCompanyCountry'), this)
}
//-------- button Click 12/29/2015-- -----------//
$('#txtIncorporation').click(C_FillState);
$('#txtIncorporation').focus(C_FillState);

$('#txtCompanyState').click(function () {
        FillCompanyStateState();  
})
$('#txtCompanyState').focus(function () {  
    FillCompanyStateState();
})
//-------- FillCompanyStateState 12/29/2015-- -----------//
function FillCompanyStateState() {
    var strValue = -1;
    if ($('#txtCompanyCountry').val() != 0) {
        strValue = $('#hdCompanyCountry').val();
    } 
    //}
    $.ajax({
        url: APIUrlFillState + '?CountryID=' + strValue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillCompanyStateStateSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillCompanyStateStateSucess(response) {
 
    StrGetCompanyState = [];
    StrGetCompanyState = response;
  
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.StateID,
            label: m.StateName,
            //  BuyerId: m.BuyerId,
        };
    });

    $(".CompanyStateAutoFill").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdCompanyState").val(ui.item.value);
            $('#txtCompanyState').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdCompanyState").val(ui.item.value);
            $('#txtCompanyState').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');

                //$("#hdCompanyState").val('');
                //$('#txtCompanyState').val('');
            }
        }
    })
}


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


//=================Check State For new Corporation==============//
 $('#txtIncorporation').blur(function () {
     var StrCheckstateFornewCo = $('#txtIncorporation').val().trim();

      if (StrCheckstateFornewCo != '') {

         for (var i = 0; i < StrFillStateVar.length; i++) {
             if ((StrFillStateVar[i].StateName).toLowerCase() == StrCheckstateFornewCo.toLowerCase()) {
                 $('#hdState').val(StrFillStateVar[i].StateName);
                 $('#txtIncorporation').val(StrFillStateVar[i].StateName);
                 break;
             }
             else {
               //  $('#hdCompanyState').val('');
                 $('#txtIncorporation').val('');

             }
         }
         for (var i = 0; i < StrFillStateVar.length; ++i) {
             if (StrFillStateVar[i].StateName.substring(0, StrCheckstateFornewCo.length).toLowerCase() === StrCheckstateFornewCo.toLowerCase()) {
                 $('#hdState').val(StrFillStateVar[i].StateName);
                 $('#txtIncorporation').val(StrFillStateVar[i].StateName);
                 break;
             }
         }
      }
      else {
          $('#hdState').val(StrFillStateVar[0].StateName);
         $('#txtIncorporation').val(StrFillStateVar[0].StateName);

      }

 })


/*
$('#txtCompanyCountry').blur(function () {

     var StrCountryVen = $('#txtCompanyCountry').val().trim();
      if (StrCountryVen != '') {
         for (var i = 0; i < getVendorCountry.length; i++) {
             if ((getVendorCountry[i].name).toLowerCase() == StrCountryVen.toLowerCase()) {

                 $('#hdCompanyCountry').val(getVendorCountry[i].ID);
                 $('#txtCompanyCountry').val(getVendorCountry[i].name);
                 break;
             }
             else {
                 $('#hdCompanyCountry').val('');
                 $('#txtCompanyCountry').val('');
             }
         }
         
         for (var i = 0; i < getVendorCountry.length; ++i) {
             if (getVendorCountry[i].name.substring(0, StrCountryVen.length).toLowerCase() === StrCountryVen.toLowerCase()) {
                 $('#hdCompanyCountry').val(getVendorCountry[i].ID);
                 $('#txtCompanyCountry').val(getVendorCountry[i].name);
                break;
             }
         }
     }
     else {
          
          $('#hdCompanyCountry').val(getVendorCountry[0].ID);
          $('#txtCompanyCountry').val(getVendorCountry[0].name);       
     }
 })
*/

/*
 $('#txtCompanyState').blur(function () {
     FillCompanyStateState();
     var StrCheckComapnystate = $('#txtCompanyState').val().trim();
     if (StrCheckComapnystate != '') {

         for (var i = 0; i < StrGetCompanyState.length; i++) {
             if ((StrGetCompanyState[i].StateName).toLowerCase() == StrCheckComapnystate.toLowerCase()) {
                 $('#txtCompanyState ').attr('name', StrGetCompanyState[i].StateID);
                 $('#txtCompanyState').val(StrGetCompanyState[i].StateName);
                 break;
             }
             else {
                 $('#txtCompanyState').removeAttr('name');
                 $('#txtCompanyState').val('');

             }
         }
         for (var i = 0; i < StrGetCompanyState.length; ++i) {
             if (StrGetCompanyState[i].StateName.substring(0, StrCheckComapnystate.length).toLowerCase() === StrCheckComapnystate.toLowerCase()) {
                 $('#txtCompanyState ').attr('name', StrGetCompanyState[i].StateID);
                 $('#txtCompanyState').val(StrGetCompanyState[i].StateName);
                 break;
             }
         }
     }
     else {
         $('#txtCompanyState ').attr('name', StrGetCompanyState[0].StateID);
         $('#txtCompanyState').val(StrGetCompanyState[0].StateName);
     }

 });
*/

 function checkMaking() {

     $('#txtCompanyCode').removeClass('RedBorder');
     var strCurrentId = $('#txtCompanyCode').val();
     if (strCurrentId == '') {
         $('#txtCompanyCode').addClass('RedBorder');
     }
     else {
         $('#txtCompanyCode').removeClass('RedBorder');
     }
     var MaskingType = $('#spnMaskingType').text();
     var maskingLength = MaskingType.length;
     
     var strval = $('#txtCompanyCode').val();
     var strlength = strval.length;

     for (var i = 0; i < strlength; i++) {
         var res = strval.charAt(i);
         var value = res.charCodeAt(0);


         var res1 = MaskingType.charAt(i);
         var strvalue = res1.charCodeAt(0);


         if (strvalue == 35) {

             if (value > 47 && value < 58) {
                 funDivShowCode(1);
             }
             else {
                 $('#txtCompanyCode').val(strval.substring(0, strval.length - 1));
                 funDivShowCode(2);
             }
         }
         else if (strvalue == 97) {

             if (value >= 65 && value <= 90 || value >= 97 && value <= 122) {
                 funDivShowCode(1);
             }
             else {
                 $('#txtCompanyCode').val(strval.substring(0, strval.length - 1));
                 funDivShowCode(2);
             }
         }
         else if (strvalue == 65) {

             if (value >= 65 && value <= 90 || value >= 97 && value <= 122 || value >= 47 && value <= 58) {
                 funDivShowCode(1);
             }
             else {
                 $('#txtCompanyCode').val(strval.substring(0, strval.length - 1));
                 funDivShowCode(2);
             }
         }
         else if (strvalue == 45) {

             if (value == 45) {
                 funDivShowCode(1);
             }
             else {
                 $('#txtCompanyCode').val(strval.substring(0, strval.length - 1));
                 funDivShowCode(2);
             }
         }
     }
     if (maskingLength == strlength) {
     }
     else if (strlength > maskingLength ) {
         $('#txtCompanyCode').val(strval.substring(0, strval.length - 1));
         funDivShowCode(2);

         $('#txtCompanyCode').focus();
     }

     if (MaskingType.charAt(strlength) == '-') {
         var strval = $('#txtCompanyCode').val();
         $('#txtCompanyCode').val(strval + '-');
     }

 };
 function funDivShowCode(value) {

     if (value == 1) {
         $('#DvMasking').attr('style', 'visibility:inline;');

         $('#lblMask').removeClass('RedColor');
         $('#spnMaskingType').removeClass('RedColor');

         $('#lblMask').addClass('BlueColor');
         $('#spnMaskingType').addClass('BlueColor');

     }
     else {
         $('#DvMasking').attr('style', 'visibility:inline;');
         $('#lblMask').removeClass('BlueColor');
         $('#spnMaskingType').removeClass('BlueColor');

         $('#lblMask').addClass('RedColor');
         $('#spnMaskingType').addClass('RedColor');

     }
 };


 function GetClearingAccountList(PCompanyID) {
 //    alert(PCompanyID);
     $.ajax({
         url: APIUrlClearingAccountList + '?Type=' + 'Payroll' + '&CompanyId=' + PCompanyID,
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
 .fail(function (error)
 { ShowMSG(error); })
 }
 function ClearingAccountListSucess(response) {

     $('#txtFringe').val('');
     $('#txtLabor').val('');
     $('#txtSuspense').val('');

     var Tcount = response.length;
     for (var i = 0; i < Tcount; i++) {
         if (response[i].AccountName == 'Labor') {

             var strval = response[i].AccountCode;
             var sstrval = strval.split('|');
             var ssstrval = sstrval[sstrval.length - 1];
             var ffstr = ssstrval.split('>');
             if (ffstr.length > 1)
             {
                 ssstrval = ffstr[ffstr.length - 1];
             }
             $('#txtLabor').val(ssstrval);
         }
         if (response[i].AccountName == 'Fringe') {
             var strval = response[i].AccountCode;
             var sstrval = strval.split('|');
             var ssstrval = sstrval[sstrval.length - 1];
             var ffstr = ssstrval.split('>');
             if (ffstr.length > 1) {
                 ssstrval = ffstr[ffstr.length - 1];
             }
             $('#txtFringe').val(ssstrval);
         }
         if (response[i].AccountName == 'Suspense') {
             // alert(response[i].AccountCode);
             var strval = response[i].AccountCode;
             var sstrval = strval.split('|');
             var ssstrval = sstrval[sstrval.length - 1];
             var ffstr = ssstrval.split('>');
             if (ffstr.length > 1) {
                 ssstrval = ffstr[ffstr.length - 1];
             }
             $('#txtSuspense').val(ssstrval);
            }
     }
 }
