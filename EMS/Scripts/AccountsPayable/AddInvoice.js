var APIUrlFillAccount = HOST + "/api/BudgetOperation/GetAccountNameForBudget"; ///
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlGetVendorAddress = HOST + "/api/POInvoice/GetVendorAddress";//
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlGetTransactionNumber = HOST + "/api/Ledger/GetTransactionNumber";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
//var APIUrlSavePO = HOST + "/api/POInvoice/SavePO";
//var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlFillBankDetails = HOST + "/api/POInvoice/GetBankInfoByCompanyId";
var APIUrlGetPONumber = HOST + "/api/POInvoice/GetPONumber";
var APIUrlFillPOLines = HOST + "/api/POInvoice/GetPOLinesNotInInvoice";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory"; //Optional COA

var APIUrlGetInvoiceNo = HOST + "/api/POInvoice/GetInvoiceNoByCompanyCode";
var APIUrlSaveInvoice = HOST + "/api/POInvoice/SaveInvoice";

var APIUrlCheckInvoiceNumberVendorId = HOST + "/api/POInvoice/CheckInvoiceNumberVendorId";
//var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlFillRefVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";
var APIUrlFillCompanyFirst = HOST + "/api/AccountPayableOp/GetDedaultCOLO";

var strResponse = [];
var strTrCount = 0;
var ArrSegment = [];
var ArrTransCode = [];
var ArrOptionalSegment = [];
var CurrentBalanceAmt = 0;
var OldBalanceAmt = 0;
var CheckBankID = [];
var CheckVendornameAddInvc = [];
var strCOACompanyId = 0;
var strCOAcompanyCode = '';
var strCompanyid = 0;
var ArrPOLinesDetail = [];
var strTrIdForPOLine = 0;

var GlbCOAList = [];
var GlbTransList = [];

var strSaveCount = 0;
var strSaveInvoice = 0;
//

// values used with VendorFill
var strvCOAId = '';
var strvCOACode = '';
var strvCOATransaction = '';
var strvSetId = '';
var strvSetCode = '';
var strvSeriesId = '';
var strvSeriesCode = '';
var Date1 = '';
var ssDefaultDropdown = '';
var ssRequired = '';
var ssWarning = '';

var strvendorCount = 0;
var CheckTabVal = 0;
var TaxCodeArr = [];
var AutoDisplayPODialog = true;

var ShowPODetail_lineindex = 0;
var AtlasInvoice;
var TCodes = [];
var TaxCodes = undefined; //AtlasCache.Cache.GetItembyName('Tax Codes');

class AtlasDocumentOLD {
    constructor(type, Header, Lines) {
        this.type = type;
        if (Header) this.Header = Header;
        if (Lines) this.Lines = Lines;
    }

    get Header() {
        return this._Header;
    }
    set Header(HeaderDOM) {
    }

    get Lines() {
        return this._Lines;
    }
    set Lines(tableDOM) {
        let obj = $(`#${tableDOM}`);
        if (obj.is('tbody')) {
            this._Lines = obj;
        }
    }

    ProcessLines() {
        this.Lines.children().each((i,e) => {
            this.LinetoObject(e);
        });
    }

    LinetoObject(row) {
        let ret = {};
        Array.prototype.forEach.call(row.children, (el, i) => {
            console.log(el);
        });
    }
}

$(function () {
    //$('.w2ui-field').w2field('float'); //INVALID
    if (localStorage.LastInvoice !== '' && localStorage.LastInvoice !== undefined) {
        let jsonLastTrans = {};
        let strTransactionNumber = '';
        try {
            jsonLastTrans = JSON.parse(localStorage.LastInvoice);
            strTransactionNumber = jsonLastTrans['ProdID_' + localStorage.ProdId];
        } catch (e) {
            strTransactionNumber = '';
        }

        if (strTransactionNumber !== '' & strTransactionNumber !== undefined) {
            $('#spnLastTransactionNumber').html('Last Transaction #: ' + strTransactionNumber);
        }
    }

    $('#UlAccountPayable li').removeClass('active');
    $('#LiInvoice').addClass('active');

    FillCompanyFirst();
    FillCompany();
    CurrentBalanceAmt = 0;
    $("#txtThirdParty").attr("disabled", "disabled");

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;

    var curr_year = d.getFullYear();
    if (curr_date.toString().length === 1) {
        curr_date = '0' + curr_date;
    }

    if (curr_month.toString().length === 1) {
        curr_month = '0' + curr_month;
    }

    Date1 = curr_month + '/' + curr_date + '/' + curr_year;

    $('#txtVendor').focus();

    AtlasPaste.Config.StaticColumns(["AMOUNT", "VENDOR", "TAX CODE", "DESCRIPTION"]);
    AtlasPaste.Config.PastetoTable(funTrCreate);
    AtlasPaste.Config.DestinationTable('tblManualEntryTBody');
    AtlasPaste.Config.DisplayOffset({ top: 140, left: -100 });
    AtlasPaste.Config.Clearcallback(PasteClear);
    AtlasPaste.Config.AfterPastecallback(AtlasPasteAfter);
    AtlasInvoice = new AtlasDocumentOLD('Invoice', 'InvoiceHeader', 'tblManualEntryTBody');

    TaxCodes = AtlasCache.Cache.GetItembyName('Tax Codes').filter(T => { return T.Active });
    AtlasCache.CacheORajax({
        'URL': AtlasCache.APIURLs.AtlasConfig_TransactionCodes
        , 'doneFunction': function (response) { 
            TCodes = response.resultJSON;
            TcodesFound = true;
        }
        , bustcache: true
        , callParameters: { callPayload: JSON.stringify({ ProdID: localStorage.ProdId }) }
        , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        , 'cachebyname': 'Config.TransactionCodes'
    });
});

function AtlasPasteAfter(option) {
    GetAmountValue(-1);
}

function PasteClear() {
    let elist = $(`#tblManualEntryTBody`).empty();
    return;
}

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
    //  $('#ddlCompany').append('<option value=0>Select Company</option>');
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
    GetInvoiceNo();
    FillVendor();
    FillBankDetails();
}

function funCheckInNumber() {
    if ($('#hdnVendorID').val() !== '') {
        $.ajax({
            url: APIUrlCheckInvoiceNumberVendorId + '?InvoiceNumber=' + $('#txtInvoiceNumber').val().trim() + '&InvoiceId=' + 0 + '&VendorId=' + $('#hdnVendorID').val() + '&ProdId=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) { 
            funCheckInNumberSucess(response); })
        .fail(function (error) { 
            ShowMSG(error); })
    } else {
        $('#txtVendor').focus();

    }
}

function funCheckInNumberSucess(response) {
    if (response == 0) {
        if (strSaveInvoice == 0) {
            $('#ConfirmPopupPO').show();
            $('#hrefConfirmYes').focus();
        }
    }
}

function funDuplicate(value) {
    if (value == 'Yes') {
        $('#ConfirmPopupPO').hide();
        $('#txtBank').focus();
    } else {
        $('#txtInvoiceNumber').val('');
        $('#txtInvoiceNumber').focus();

    }
    $('#ConfirmPopupZero').hide();
    $('#ConfirmPopupPO').hide();
    $('#fade').hide();
    
    EnableForm();
    //$('#tabAddPO :input').attr('disabled', false);
}

///================================================= Invocie No
function GetInvoiceNo() {
    ///  Bank Empty

    $('#txtBank').val('');
    $('#hdnBank').val('');

    $.ajax({
        url: APIUrlGetInvoiceNo + '?companyCode=' + $('#ddlCompany').find("option:selected").text(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { GetInvoiceNoSucess(response); })
  .fail(function (error) {
      ShowMSG(error);
  })

}
function GetInvoiceNoSucess(response) {

    $('#tblManualEntryTBody').html('');
    strTrCount = 0;
    if (response.length > 0) {
        //   $('#txtInvoiceNumber').val(response[0].InvoiceNo);
        strCOACompanyId = response[0].COAId;
        strCOAcompanyCode = response[0].COACode;
        strCompanyid = response[0].CompanyId;
    }
    funGetClosePeriodDetail();
}
//================================================= Vendor Auto complete

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

    .done(function (response)
    { FillVendorSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}
function FillVendorSucess(response) {
    GetVendorNamePO = [];
    GetVendorNamePO = response;

    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
            Add1W9: m.Addressw9,
            Add2W9: m.Address2w9,
            Add1Re: m.AddressRe,
            Add2Re: m.Address2Re,
            ssCOAId: m.COAId,
            ssCOAString: m.COAString,
            ssTransString: m.TransString,
            ssSetId: m.SetId,
            ssSetCode: m.SetCode,
            ssSeriesId: m.SeriesId,
            ssSeriesCode: m.SeriesCode,
            ssDefaultDropdown: m.DefaultDropdown,
            ssWarning: m.Warning,
            ssRequired: m.Required
        };
    });
    $(".VendorCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $("#hdnVendorID").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);
            $('#lblBillingAddress1').html(ui.item.Add1Re);
            $('#lblBillingAddress2').html(ui.item.Add2Re);
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
        select: function (event, ui) {
            $("#hdnVendorID").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);
            $('#lblBillingAddress1').html(ui.item.Add1Re);
            $('#lblBillingAddress2').html(ui.item.Add2Re);
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
            ShowSegmentNotify("Vendor Default Company does not match the Document Company");
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
    // GetSegmentsDetails();
}
//================================================= Error MSG
function ShowMSG(error) {
    console.log(error);
}

//=================================================
function funGetClosePeriodDetail() {
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());
    GetAmountValue(-1);
}

function GetVendorAddressSucess(response) {
    var BillingAdd1 = response[0].RemitAddress1 + ' ' + response[0].RemitAddress2 + ' ' + response[0].RemitAddress3;
    var ShippingAdd1 = response[0].RemitAddress1 + ' ' + response[0].RemitAddress2 + ' ' + response[0].RemitAddress3;
    var BillingAdd2 = response[0].RemitCity + ' , ' + response[0].RemitState + ' ' + response[0].RemitZip;
    var ShippingAdd2 = response[0].RemitCity + ' , ' + response[0].RemitState + ' ' + response[0].RemitZip;
    $('#lblBillingAddress1').html(ShippingAdd1);
    $('#lblBillingAddress2').html(ShippingAdd2);
    $('#lblShippingAddress1').html(BillingAdd1);
    $('#lblShippingAddress2').html(BillingAdd2);
}

$('#txtVendor').blur(function () {
    var StrCheckVendorName = $('#txtVendor').val().trim();
    var strStatus = 0;

    if (StrCheckVendorName != '') {
        for (var i = 0; i < GetVendorNamePO.length; i++) {
            if (GetVendorNamePO[i].VendorName == StrCheckVendorName) {
                $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
                $('#txtVendor').val(GetVendorNamePO[i].VendorName);

                $('#lblBillingAddress1').html(GetVendorNamePO[i].AddressRe);
                $('#lblBillingAddress2').html(GetVendorNamePO[i].Address2Re);
                $('#lblShippingAddress1').html(GetVendorNamePO[i].AddressRe);
                $('#lblShippingAddress2').html(GetVendorNamePO[i].Address2Re);
                strvCOAId = GetVendorNamePO[i].COAId;
                strvCOACode = GetVendorNamePO[i].COAString;
                strvCOATransaction = GetVendorNamePO[i].TransString;
                strvSetId = GetVendorNamePO[i].SetId;
                strvSetCode = GetVendorNamePO[i].SetCode;
                strvSeriesId = GetVendorNamePO[i].SeriesId;
                strvSeriesCode = GetVendorNamePO[i].SeriesCode;
                ssDefaultDropdown = GetVendorNamePO[i].DefaultDropdown;
                ssWarning = GetVendorNamePO[i].Warning;
                ssRequired = GetVendorNamePO[i].Required;

                strStatus++;
                break;
            }
            else {
            }
        }

        if (strStatus == 0) {
            for (var i = 0; i < GetVendorNamePO.length; ++i) {
                if (GetVendorNamePO[i].VendorName.substring(0, StrCheckVendorName.length).toUpperCase() == StrCheckVendorName.toUpperCase()) {
                    $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
                    $('#txtVendor').val(GetVendorNamePO[i].VendorName);
                    $('#lblBillingAddress1').html(GetVendorNamePO[i].AddressRe);
                    $('#lblBillingAddress2').html(GetVendorNamePO[i].Address2Re);
                    $('#lblShippingAddress1').html(GetVendorNamePO[i].AddressRe);
                    $('#lblShippingAddress2').html(GetVendorNamePO[i].Address2Re);
                    strvCOAId = GetVendorNamePO[i].COAId;
                    strvCOACode = GetVendorNamePO[i].COAString;
                    strvCOATransaction = GetVendorNamePO[i].TransString;
                    strvSetId = GetVendorNamePO[i].SetId;
                    strvSetCode = GetVendorNamePO[i].SetCode;
                    strvSeriesId = GetVendorNamePO[i].SeriesId;
                    strvSeriesCode = GetVendorNamePO[i].SeriesCode;
                    ssDefaultDropdown = GetVendorNamePO[i].DefaultDropdown;
                    ssWarning = GetVendorNamePO[i].Warning;
                    ssRequired = GetVendorNamePO[i].Required;

                    strStatus++;

                    break;
                }

            }
        }
    } else {
        $('#hdnVendorID').val('');
        $('#txtVendor').val('');
        $('#lblBillingAddress1').html('');
        $('#lblBillingAddress2').html('');
        $('#lblShippingAddress1').html('');
        $('#lblShippingAddress2').html('');
        strvCOAId = '';
        strvCOACode = '';
        strvCOATransaction = '';
        strvSetId = '';
        strvSetCode = '';
        strvSeriesId = '';
        strvSeriesCode = '';
        ssDefaultDropdown = '';
        ssWarning = false;
        ssRequired = false;

        $('#DvVendorTax').hide();
        $('#ChkOverride').prop('checked', false);

        strStatus++;
    }

    if (strStatus == 0) {
        $('#hdnVendorID').val(' ');
        $('#txtVendor').val('');

        $('#lblBillingAddress1').html('');
        $('#lblBillingAddress2').html('');
        $('#lblShippingAddress1').html('');
        $('#lblShippingAddress2').html('');
        strvCOAId = '';
        strvCOACode = '';
        strvCOATransaction = '';
        strvSetId = '';
        strvSetCode = '';
        strvSeriesId = '';
        strvSeriesCode = '';

        $('#DvVendorTax').hide();
        $('#ChkOverride').prop('checked', false);
    }

    ShowSegmentNotify("Vendor Default Company does not match the Document Company");
    funVendorTaxCode();
})

function funVendorTaxCode() {
// If logic is in place for unknown reason
    //if (strvendorCount == 0) {
    //    strvendorCount++;

        if (ssRequired == true) {
            $('#txtVendor').notify('This Vendor is setup to require a Tax Code field for all line items');
            //ShowMsgBox('showMSG', 'This Vendor is setup to require a Tax Code field for all line items', '', '');

            $('#DvVendorTax').show();
            $('#lblOverrideTax').addClass('RedFont');

        } else {
            $('#lblOverrideTax').removeClass('RedFont');

        }
        if (ssWarning == true) {
            $('#txtVendor').notify('This Vendor may require a Tax Code field for all line items');
            //ShowMsgBox('showMSG', 'This Vendor may require a Tax Code field for all line items', '', '');
        }
    //}
    GetSegmentsDetails();
}
//================================================= Amount Calculation
// #T9
function GetAmountValue(value) {
    if (numeral($('#hdnOAmount_' + value).val()).value() !== numeral($('#txtAmt_' + value).val()).value()) {
        $('#chkClose_' + value).prop('disabled', false);
        $('#chkClose_' + value).prop('checked', false);
    } else {
        $('#chkClose_' + value).prop('disabled', true);
        $('#chkClose_' + value).prop('checked', true);
    }

    var TotalDebit = 0;
    var strDebit = $('.DebitClass');

    for (var i = 0; i < strDebit.length; i++) {
        var strId = strDebit[i].id;
        var strAmount = numeral($('#' + strId).val()).format('0.00');

        //strAmount = (strAmount == '') ? 0 : strAmount;
        //strAmount = strAmount.replace(/,/g, '');
        TotalDebit = parseFloat(TotalDebit) + parseFloat(strAmount);

    }

    TotalDebit = parseFloat(TotalDebit + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    $('#lblNewItem').html(TotalDebit);
    $('#lblNewBalance').html(TotalDebit);
}

$('#tblManualEntryThead').delegate('.DebitClass', 'focusout', function () {
    var NewAmt = 0;
    var Cntt = 0;
    $('#tblManualEntryThead input[type="text"]').each(function () {
        var CheckCls = $(this).attr('name');
        if (CheckCls == 'POLineAmtt') {
            txtAmt_1
            // var AmtControlID = $(this).attr('id');
            NewAmt = $('#txtAmt_' + Cntt).val();
            Cntt++;

        }
    });
    $('#lblNewItem').html(NewAmt);
    $('#lblNewBalance').html(NewAmt);
});

function ThirdParty() {

    if ($('#chkThirdParty').prop("checked")) {
        //$('#lblBillingAddress1').html('');
        //$('#lblBillingAddress2').html('');
        //$('#lblShippingAddress1').html('');
        //$('#lblShippingAddress2').html('');
        // $("#txtVendor").attr("disabled", "disabled");
        // $('#txtVendor').val('');
        $("#txtThirdParty").removeAttr("disabled");
        $('#txtVendor').attr('style', 'border-color:#d2d6de;');

    } else {
        $("#txtVendor").removeAttr("disabled");
        $("#txtThirdParty").attr("disabled", "disabled");
        $('#txtThirdParty').val('');
        $('#txtThirdParty').attr('style', 'border-color:#d2d6de;');
    }
}


//============================================= Get Segment Detail
function GetSegmentsDetails() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 0,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        GetSegmentListSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetSegmentListSucess(response) {
    ArrSegment = [];
    ArrOptionalSegment = [];
    for (var i = 0; i < response.length; i++) {
        var ObjSegment = {
            SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode
        }

        ArrSegment.push(ObjSegment);
        if (response[i].Classification == 'Detail') {
            break;
        }
    }

    var strval = 0;
    for (var i = 0; i < response.length; i++) {
        if (strval > 0) {
            var ObjSegment = {
                SegmentId: response[i].SegmentId, SegmentName: response[i].Classification, SegmentLevel: response[i].SegmentLevel
            }
            ArrOptionalSegment.push(ObjSegment);
        }

        if (response[i].Classification == 'Detail') {
            strval++;
        }
    }
    GetTransactionCode();
}

//============================================= Get Transaction  Detail
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
    .done(function (response) { 
        GetTransactionCodeSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetTransactionCodeSucess(response) {
    ArrTransCode = [];
    var strHtml1 = '';
    strHtml1 += '<tr>';
    strHtml1 += '<th><input type="checkbox" id="chkPOHead" onChange="javascript:CheckAllPO();" /></th>';
    strHtml1 += '<th>Line #</th>';
    strHtml1 += '<th>PO #</th>';
    strHtml1 += '<th>Status</th>';

    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th></th>';
    strHtml += '<th>PO#</th>';

    for (var i = 0; i < ArrSegment.length; i++) {
        strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
        strHtml1 += '<th>' + ArrSegment[i].SegmentName + '</th>';
    }

    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
        strHtml1 += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
    }

    for (var i = 0; i < response.length; i++) {
        var obj = {
            TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID
        }
        ArrTransCode.push(obj);
        strHtml += '<th>' + response[i].TransCode + '</th>';
        strHtml1 += '<th>' + response[i].TransCode + '</th>';
    }

    strHtml += '<th>Description </th>';
    strHtml += '<th>Amount</th>';
    strHtml += '<th>Tax Code</th>';
    strHtml += '<th>Close</th>';
    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);

    strHtml1 += '<th>Balance</th>';
    strHtml1 += '<th>PO Line Description</th>';

    $('#tblPOLineThead').html(strHtml1)
}

//=================================================== Row Creation
// #T9
function funTrCreate(objD, action, rowID) {
    objD = (objD === undefined) ? {} : objD;
    action = (typeof action === 'object') ? action : { 'action': action };
    let strNote = (objD['DESCRIPTION'] === undefined) ? $('#txtDescription').val() : objD['DESCRIPTION'];
    let strCompany = $('#ddlCompany').find("option:selected").text();

    CheckTabVal = 1;
    if ($('#hdnVendorID').val() != '') {
        var strDes = $('#txtDescription').val();
        if ($('#ddlCompany').val() != 0) {
            var strhtml = '';
            strhtml += '<tr id="' + strTrCount + '" class="clsTr">';
            strhtml += '<td id="tdtrdelete" style="width:30px;"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript: funJEDeleteRow(' + strTrCount + ');"></i></span></td>'; /// strTrCount
            strhtml += `<td id="tdPODetail" class="width100"><input type="text" data-atlas-input-group="po" name="PONumber" class="PoNumber" style="width:82%;" onfocus="javascript: fnPONumber();" onblur="javascript: ShowPODetail(${strTrCount}, true, false);" id="txtPONumber${strTrCount}"/>`;
            strhtml += `<a href="javascript: ShowPODetail(${strTrCount}, true, true)"><i style="color: #blue" id="aDetail${strTrCount}" class="fa fa-chevron-right ArrowCls"></i></a>`;
            strhtml += `<input type="hidden" data-atlas-input-group="po" name="POID" id="hdn_${strTrCount}" class="clsPOId"></td>`;
            for (var i = 0; i < ArrSegment.length; i++) {
                let fieldvalue_default = '';
                let SegmentName = ArrSegment[i].SegmentName;
                if (Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName]).length === 1) {
                    fieldvalue_default = AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName][Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName])[0]].AccountCode;
                }

                if (SegmentName == 'CO') {
                    strhtml += `<td id="td${SegmentName}" class="width40 input-segment"><input type="text" data-atlas-input-group="segment" name="${SegmentName}" class="atlas-edit-0 detectTab input-required" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},'${SegmentName}',${i});" onfocus="javascript: funSegment(${strTrCount}, '${SegmentName}',${i});" id="txt_${strTrCount + '_' + i}" coacode="${strCOAcompanyCode}" coaid="${strCOACompanyId}" value="${strCOAcompanyCode}" disabled/></td>`;
                } else if (SegmentName == 'DT') {
                    strhtml += `<td id="td${SegmentName}" class="width100 input-segment"><input type="text" data-atlas-input-group="segment" name="${SegmentName}" value="${AtlasPaste.FillFieldValue(objD, SegmentName, fieldvalue_default)}" class="detectTab input-required form-segment clsPaste" onfocus="javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(${strTrCount},'${SegmentName}', ${i}, this);" onblur="javascript: GetSegmentValue(${strTrCount}, '${SegmentName}', ${i});" id="txt_${strTrCount + '_' + i}"/></td>`;
                } else {
                    strhtml += `<td id="td${SegmentName}" class="width40 input-segment"><input type="text" data-atlas-input-group="segment" name="${SegmentName}" value="${AtlasPaste.FillFieldValue(objD, SegmentName, fieldvalue_default)}" class="detectTab input-required form-segment clsPaste" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},'${SegmentName}', ${i}, this);" onblur="javascript: GetSegmentValue(${strTrCount}, '${SegmentName}', ${i});" id="txt_${strTrCount + '_' + i}"/></td>`;
                }
            }

            for (var i = 0; i < ArrOptionalSegment.length; i++) {
                strhtml += `<td id="td${ArrOptionalSegment[i].SegmentName}" class="width40"><input type="text" data-atlas-input-group="segment" name="${ArrOptionalSegment[i].SegmentName}" value="${AtlasPaste.FillFieldValue(objD, ArrOptionalSegment[i].SegmentName, '')}" class="clsOtional${strTrCount} clsPaste" onblur="javascript: funCheckOptionalAutoFill(${strTrCount}, '${ArrOptionalSegment[i].SegmentName}', ${i});" onfocus="javascript: GetOptional(${strTrCount},'${ArrOptionalSegment[i].SegmentName}',${i});" id="txtOptional_${strTrCount + '_' + i}" /></td>`;
            }

            for (var i = 0; i < ArrTransCode.length; i++) {
                strhtml += `<td id="TransactionCode" class="width40"><input type="text" data-atlas-input-group="memo" name="${ArrTransCode[i].TransCode}" value="${AtlasPaste.FillFieldValue(objD, ArrTransCode[i].TransCode)}" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" class="clsPaste clsTransCode${strTrCount} clsTransCode_${strTrCount}" onfocus="javascript: funTransDetail(${strTrCount}, ${ArrTransCode[i].TransId}, '${ArrTransCode[i].TransCode}')" id="txt_${ArrTransCode[i].TransCode + '_' + strTrCount}" /></td>`;
            }

            strhtml += `<td id="tdLineDescription" class="width200"><input type="text" data-atlas-input-group="line" name="LineDescription" class="detectTab strDescription CreditClass input-required " id="txtDesc_${strTrCount}" value="${strNote}"/>`;
            //strhtml += `<input type="hidden" class="clsCOACode" id="hdnCode_${strTrCount}"/>`;
            //strhtml += `<input type="hidden" class="clsCOAId" id="hdnCOAId_${strTrCount}"/>`;
            strhtml += `<input type="hidden" data-atlas-input-group="po" name="POLineID" class="clsPOLine" id="hdnPOLineId_${strTrCount}"></td>`;
            strhtml += `<td id="tdAmount" class="width40"><input type="text" data-atlas-input-group="line" name="Amount" value="${AtlasPaste.FillFieldValue(objD, 'AMOUNT', '0.00')}" class="DebitClass w2field amount w2ui-field input-required" onfocusout="javascript: GetAmountValue(${strTrCount});" id="txtAmt_${strTrCount}"/></td>`;

            var ssCheck = $('#ChkOverride').prop('checked');
            let TaxCodeRequired = '';
            if (ssRequired == true && ssCheck == false) {
                TaxCodeRequired = 'input-required';
                //strhtml += '<td class="width40"><input type="text" name="TaxCode" class="clsTax detectTab input-required" name="POLineAmtt" onfocus="javascript:funTaxCode(' + strTrCount + ');" id="txtTaxCode_' + strTrCount + '" value="' + ssDefaultDropdown + '" /></td>';
            //} else {
            //    strhtml += '<td class="width40"><input type="text" name="TaxCode" class="clsTax number" name="POLineAmtt" onfocus="javascript:funTaxCode(' + strTrCount + ');"  id="txtTaxCode_' + strTrCount + '"  value="' + ssDefaultDropdown + '"/></td>';
            }

            strhtml += `<td id="tdTaxCode" class="width40"><input type="text" data-atlas-input-group="line" value="${AtlasPaste.FillFieldValue(objD, 'TAX CODE', ssDefaultDropdown)}" name="TaxCode" class="clsTax detectTab ${TaxCodeRequired}" name="POLineAmtt" onfocus="javascript: funTaxCode(${strTrCount});" id="txtTaxCode_${strTrCount}" /></td>`;
            strhtml += '<td id="tdClosePO" class="width40"><input type="checkbox" data-atlas-input-group="po" name="ClosePO" id="chkClose_' + strTrCount + '" class="strClearedFlag" style="display: none;"/>';
            strhtml += '<input type="hidden" name="POAmount" id="hdnOAmount_' + strTrCount + '"/></td>';

            strhtml += '</tr>';
            $('#tblManualEntryTBody').append(strhtml);
            //fillcompanyandlocation(strTrCount);
            $('#txtPONumber' + strTrCount).select();
            strTrCount++;
        } else {
            ShowMsgBox('showMSG', 'Select Company first..!!', '', '');
        }
    } else {
        ShowMsgBox('showMSG', 'Select Vendor first..!!', '', '');
    }

    if ($('#DvTab').height() >= (window.innerHeight - 330)) { // Space used by JE header
        $(`#tblManualEntry`).stickyTableHeaders('destroy'); // destroy the old sticky headers

        $('#DvTab').height((window.innerHeight - 330)); // Space used by JE header
        $('#DvTab').css('overflow', 'overlay'); // scroll
        $('#tblManualEntry').stickyTableHeaders({ scrollableArea: $('#DvTab') });
    }

    setTimeout(function () {
        $('#txtPONumber' + (strTrCount - 1)).focus();
    }, 10);
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib

    if (Object.keys(objD).length > 0) {
        let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objD);
        if (COAID === undefined || COACode === undefined) {
            let e = $(`#${strTrCount - 1}`)[0];
            Object.keys(SegCheck).forEach((seg) => {
                if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(e).find(`td.input-segment [name=${seg}]`).notify('Invalid Account');
                $(e).find(`td.input-segment [name=${seg}]`).addClass('field-Req');
            });
        }
    }

    AtlasInvoice.Lines.trigger('rowAdd', { id: strTrCount - 1});
}

//========================================================= Segment Code
function funSegment(values, SegmentName, SegmentP) {
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');

    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    } else {
        PreSegment = SegmentP - 1;
    }

    var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
    //txt_0_Company
    $('#fade').show();
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
        funSegmentSucess(response, values, SegmentP);
    })
    .fail(function (error) {
        console.log(error);
    })
}

function funSegmentSucess(response, values, SegmentP) {
    // $('#txt_' + values + '_' + SegmentP).prop("disabled", false);
    $('#fade').hide();
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

    $('#txt_' + values + '_' + SegmentP).addClass('SearchCode');
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

function funCheckNextValue(values, SegmentName, SegmentP) {
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');
    var strval = $('#txt_' + values + '_' + SegmentP).val();
    var strStatus = 1;
    var strhidden = $('#hdnCode_' + values).val();
    var strsplit = strhidden.split('|');
    for (var i = 0; i <= SegmentP; i++) {
        if (i == SegmentP) {
            if (strval == strsplit[i]) {
                strStatus = 0;
            }
        }
    }
    if (strStatus != 0) {
        if (GlbCOAList.length > 0) {
            var strstatus = true;
            var strval = $('#txt_' + values + '_' + SegmentP).val();
            if (strval != '') {
                for (var i = 0; i < GlbCOAList.length; i++) {
                    if (GlbCOAList[i].COANo.replace('-', '').match(strval) || strval == GlbCOAList[i].COANo) {
                        $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[i].COANo);
                        $('#txt_' + values + '_' + SegmentP).attr('COACode', GlbCOAList[i].COACode);
                        $('#txt_' + values + '_' + SegmentP).attr('COAId', GlbCOAList[i].COAID);
                        $('#hdnCode_' + values).val(GlbCOAList[i].COACode);
                        $('#hdnCOAId_' + values).val(GlbCOAList[i].COAID);
                        break;

                    } else {
                        $('#txt_' + values + '_' + SegmentP).val('');
                        $('#txt_' + values + '_' + SegmentP).removeAttr('COACode');
                        $('#txt_' + values + '_' + SegmentP).removeAttr('COAId');
                        $('#hdnCode_' + values).val('');
                        $('#hdnCOAId_' + values).val('');
                        strstatus = false;
                    }
                }
            }
            var strValue = $('#txt_' + values + '_' + SegmentName).val();
            for (var i = SegmentP + 1; i < ArrSegment.length; i++) {
                var strSName = ArrSegment[SegmentP].SegmentName;
                $('#txt_' + values + '_' + i).val('');
            }
            $('#txt_' + values + '_' + SegmentP).removeAttr('style');
            $('#txt_' + values + '_' + SegmentP).attr('style', 'border-color:#d2d6de;');
        }
    }
}

//========================================================= Transaction Code
function funTransDetail(values, TransId, Name) {
    $('#txt_' + Name + '_' + values).removeClass('SearchCodeTransaction');
    $.ajax({
        url: APIUrlTranscationCode + '?TransactionCodeID=' + TransId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        TransDetailSucess(response, values, Name); })
    .fail(function (error) { 
        ShowMSG(error); })
}

function TransDetailSucess(response, values, Name) {
    var array = [];
    var ProductListjson = response;
    GlbTransList = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
            //  BuyerId: m.BuyerId,
        };
    });

    $('#txt_' + Name + '_' + values).addClass('SearchCodeTransaction');

    $(".SearchCodeTransaction").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //$(this).removeAttr('TransValueId');
                //$(this).val('');
            }
        }
    })
}

function funBlurTrans(value, Name) {
    if (GlbTransList.length == 0)
    { }
    else
        var strtextval = $('#txt_' + Name + '_' + value).val();

    if (strtextval != '') {
        for (var i = 0; i < GlbTransList.length; i++) {
            if (GlbTransList[i].TransValue.match(strtextval)) {
                // if (GlbTransList[i].TransValue == strtextval) {
                $('#txt_' + Name + '_' + value).val(GlbTransList[i].TransValue);
                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[i].TransactionValueID);
                break;
            } else {
                $('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);
            }
        }
    } else {
    }
    $('#txt_' + Name + '_' + value).removeClass('SearchCodeTransaction');
}

//========================================================= Optional SET/Series
function GetOptional(values, SegmentName, SegmentP) {
    $('#txtOptional_' + values + '_' + SegmentP).removeClass('SearchOptionalCode');
    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + SegmentName,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        GetOptionalSucess(response, values, SegmentP); })
    .fail(function (error) { 
        ShowMSG(error); })
}

function GetOptionalSucess(response, values, SegmentP) {
    GblOptionalCOA = [];
    GblOptionalCOA = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.AccountCode,
            value: m.AccountID,

        };
    });

    $('#txtOptional_' + values + '_' + SegmentP).addClass('SearchOptionalCode');
    $(".SearchOptionalCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('AccountID', ui.item.value);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('AccountID', ui.item.value);

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
                //if (strval == GblOptionalCOA[i].AccountCode) {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[i].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[i].AccountID);
                break;
            } else {
            }
        }
    } else {
    }

    $('#txtOptional_' + value + '_' + valueN).removeClass('SearchOptionalCode');
}

//==================================================== Row Delete
function funJEDeleteRow(value) {
    $('#' + value).remove();
    CheckTabVal--;

    var strlength = $('#tblManualEntryTBody tr').length;
    if (strlength == 0) {
        $('#txtVendor').prop('disabled', false);
    }
    GetAmountValue(-1);
}

//================================================== Split operation
/* Where is this being called from???
function funSplit(value) {
    var strhtml = '';
    strhtml += '<tr id="' + strTrCount + '" class="clsTr">';
    strhtml += '<td style="width:30px;"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript:funJEDeleteRow(' + strTrCount + ');"></i></span></td>'; /// strTrCount
    // strhtml += '<td class="width100"><input type="text" class="thirdPVendor" id="txtThirdd' + strTrCount + '"/></td>';
    strhtml += '<td class="width100"><input type="text" class="PoNumber" style="width:82%;" onfocus="javascript:fnPONumber();"  id="txtPONumber' + strTrCount + '" disabled/>';
    strhtml += '<a href="javascript:ShowPODetail(' + strTrCount + ')"><i style="color: #blue" id=aDetail' + strTrCount + ' class="fa fa-chevron-right ArrowCls"></i></a>';
    strhtml += '<input type="hidden" id="hdn_' + strTrCount + '" class="clsPOId"></td>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO') {
            strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab input-required" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" coacode="' + strCOAcompanyCode + '" coaid="' + strCOACompanyId + '" value="' + strCOAcompanyCode + '"  disabled/></td>';
        }
        else if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab input-required" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" disabled/></td>';
        }
        else {
            strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab input-required" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" disabled/></td>';
        }
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOtional' + strTrCount + '   " onblur="javascript:funCheckOptionalAutoFill(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + strTrCount + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" disabled /></td>';
        // ArrSegment[i].SegmentName + '_' + ArrSegment[i].SegmentId
    }
    for (var i = 0; i < ArrTransCode.length; i++) {
        strhtml += '<td class="width40"><input type="text" class="SearchCode clsTransCode' + strTrCount + '  clsTransCode_' + strTrCount + '" onfocus="javascript:funTransDetail(' + strTrCount + ',' + ArrTransCode[i].TransId + ')" id="txt_' + ArrTransCode[i].TransCode + '_' + strTrCount + '" name="' + ArrTransCode[i].TransId + '"  disabled/></td>';
    }
    strhtml += '<td class="width40"><input type="text" class="  DebitClass detectTab number" onfocusout="javascript:GetAmountValue();" name="POLineAmtt"  id="txtAmt_' + strTrCount + '" value="0"/></td>';
    strhtml += '<td class="width100"><input type="text" class=" strDescription CreditClass detectTab" id="txtDesc_' + strTrCount + '" value=""/><input type="hidden" class="clsCOACode" id="hdnCode_' + strTrCount + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + strTrCount + '"></td>';
    strhtml += '<td class="width40"><input type="checkbox"  id="chkClose' + strTrCount + '"/></td>';
    strhtml += '<td class="width40"><a href="#" onclick="funSplit(' + strTrCount + ');"> <i class="fa fa-exchange" aria-hidden="true" style="font-size: 21px;"></i></a></td>';

    strhtml += '</tr>';
    $('#' + value).after(strhtml);
    strTrCount++;
    var PONumber = $('#txtPONumber' + value).val();
    var POLineId = $('#hdn_' + value).val();
    var strcoaId = $('#hdnCOAId_' + value).val();
    var strCOACode = $('#hdnCode_' + value).val();
    var strPONumber = $('#txtPONumber' + value).val();
    var strPOId = $('#hdn_' + value).val();
    var strDes = $('#txtDesc' + value).val();
    var strCount = strTrCount - 1;
    var strCOACodesplit = strCOACode.split('|');
    for (var i = 0; i < ArrSegment.length; i++) {
        $('#txt_' + strCount + '_' + i).val(strCOACodesplit[i]);
    }

    $('#txtPONumber' + strCount).val(PONumber);
    $('#hdn_' + strCount).val(POLineId);

    $('#hdnCOAId_' + strCount).val(strcoaId);
    $('#hdnCode_' + strCount).val(strCOACode);

    // Optional Code
    var strSetCode = $('#txtOptional_' + value + '_' + 0).val();
    var strSetId = $('#txtOptional_' + value + '_' + 0).attr('accountid');
    var strSeriesCode = $('#txtOptional_' + value + '_' + 1).val();
    var strSeriesId = $('#txtOptional_' + value + '_' + 1).attr('accountid');

    $('#txtOptional_' + strCount + '_' + 0).val(strSetCode);
    $('#txtOptional_' + strCount + '_' + 0).addClass('accountid', strSetId);

    $('#txtOptional_' + strCount + '_' + 1).val(strSeriesCode);
    $('#txtOptional_' + strCount + '_' + 1).addClass('accountid', strSeriesId);
    // Optional Code End

    // Trasaction Code
    for (var i = 0; i < ArrTransCode.length; i++) {
        var strCode = $('#txt_' + ArrTransCode[i].TransCode + '_' + value).val();
        var strId = $('#txt_' + ArrTransCode[i].TransCode + '_' + i).attr('transvalueid');

        $('#txt_' + ArrTransCode[i].TransCode + '_' + strCount).val(strCode);
        $('#txt_' + ArrTransCode[i].TransCode + '_' + strCount).attr('transvalueid', strId);
    }
    // Trasaction Code End

}
*/

//=========================================================== Add PO List
function funAddPOLine() {
    EnableForm();
    //$('#tabAddPO :input').attr('disabled', false);

    var ArrPOLineId = [];
    var strPOLine = $('.poCheck');
    for (var i = 0; i < strPOLine.length; i++) {
        var strId = strPOLine[i].id;
        if ($('#' + strId).is(':checked')) {
            var strId = $('#' + strId).attr('name');
            ArrPOLineId.push(parseInt(strId));
        }
    }

    // We have the list of POs and will now place them inline with the existing content.
    //for (var k = 0; k < ArrPOLineId.length; k++) {
    //    var strArrVal = ArrPOLineId[k];
    for (var i = 0; i < ArrPOLineId.length; i++) {
        console.log(ShowPODetail_lineindex);
        if ($(`#${ShowPODetail_lineindex}`).length === 0) {
            funTrCreate();
        }
        funPOLineAdd(ShowPODetail_lineindex, ArrPOLinesDetail.find((e, ei) => { return e.POlineID === ArrPOLineId[i]; }));
        ShowPODetail_lineindex++;
    }
    //    if (ArrPOLinesDetail[i].POlineID == strArrVal) {
    //        if (k == 0) {
    //            funPOLineAdd(i);
    //        } else {
    //            funTrCreate();
    //            funPOLineAdd(i);
    //        }
    //    }
    //}
    //}
    $('#dvPOLines').hide();
    $('#fade').hide();
}

function funPOLineAdd(InvoiceLineID, POLine) {
    // strTrIdForPOLine
    var strCOAId = POLine.COAID;
    var strCOAString = POLine.COAString;
    var strCOASplit = strCOAString.split('|');
    var strTransactionstring = POLine.TransStr;
    var strrsplit = strTransactionstring.split(',');
    var strSetID = POLine.SetID;
    var strSetCode = POLine.SetCode;
    var strSeriesID = POLine.SeriesID;
    var strSeriesCode = POLine.SeriesCode;
    var strPOLineID = POLine.POlineID;
    var POID = POLine.POID;
    var strPONumber = POLine.PONumber;
    var strAmount = numeral(POLine.Amount).format('0,0.00');
    var strLineDescription = POLine.LineDescription;
    var vTaxCode = POLine.TaxCode;
    var strTr = InvoiceLineID;
    //if (i == 0) {
    //    strTr = strTrIdForPOLine;
    //} else {
    //    strTr = strTrCount - 1;
    //}
    $('#hdnPOLineId_' + strTr).val(strPOLineID);
    $('#hdnPOID_' + strTr).val(POID);
    $('#txtPONumber' + strTr).val(strPONumber);
    $('#txtPONumber' + strTr).prop('disabled', true);
    if (strPONumber == null) {
        $('#chkClose_' + strTr).hide();
    } else {
        $('#chkClose_' + strTr).show();
        $('#hdnPOLineId_' + strTr).val(strPOLineID);
        $('#hdnPOID_' + strTr).val(POID);
        $('#txtPONumber' + strTr).val(strPONumber);
        $('#txtPONumber' + strTr).prop('disabled', true);
        // $('#chkClose_' + strTr).prop('checked', true);
    }
    var strCOAPval = '';
    if (j == 0) { strCOAPval = strCOASplit[0]; }
    else if (j == 1) { strCOAPval = strCOASplit[0] + '|' + strCOASplit[1]; }
    else if (j == 2) { strCOAPval = strCOASplit[0] + '|' + strCOASplit[1] + '|' + strCOASplit[2]; }
    else if (j == 3) { strCOAPval = strCOASplit[0] + '|' + strCOASplit[1] + '|' + strCOASplit[2] + '|' + strCOASplit[3]; }
    else if (j == 4) { strCOAPval = strCOASplit[0] + '|' + strCOASplit[1] + '|' + strCOASplit[2] + '|' + strCOASplit[3] + '|' + strCOASplit[4]; }
    else if (j == 5) { strCOAPval = strCOASplit[0] + '|' + strCOASplit[1] + '|' + strCOASplit[2] + '|' + strCOASplit[3] + '|' + strCOASplit[4] + '|' + strCOASplit[5]; }
    for (var j = 0; j < ArrSegment.length; j++) {
        if (ArrSegment[j].SegmentName == 'DT') {
            var strsplit1 = strCOASplit[j].split('>');
            var strlength = strsplit1.length;
            $('#txt_' + strTr + '_' + j).val(strsplit1[strlength - 1]);
            $('#txt_' + strTr + '_' + j).attr('coacode', strCOAPval);
        } else {
            $('#txt_' + strTr + '_' + j).val(strCOASplit[j]);
            $('#txt_' + strTr + '_' + j).attr('coacode', strCOAPval);

        }
        $('#txt_' + strTr + '_' + j).prop('disabled', true);
    }

    for (var j = 0; j < ArrOptionalSegment.length; j++) {
        if (j == 0) {
            $('#txtOptional_' + strTr + '_' + j).val(strSetCode);
            $('#txtOptional_' + strTr + '_' + j).attr('accountid', strSetID);
            $('#txtOptional_' + strTr + '_' + j).prop('disabled', true);
        } else {
            $('#txtOptional_' + strTr + '_' + j).val(strSeriesCode);
            $('#txtOptional_' + strTr + '_' + j).attr('accountid', strSeriesID);
            $('#txtOptional_' + strTr + '_' + j).prop('disabled', true);
        }
    }

    for (var j = 0; j < strrsplit.length; j++) {
        let fullsplit = strrsplit[j].split(':'); // Use the full split to get the pieces needed for just the field
        var strVal = strrsplit[j].split(':').slice(0, 1); // Get only the field name #3397
        for (var k = 0; k < strVal.length; k++) {
            $('#txt_' + fullsplit[k] + '_' + strTr).val(fullsplit[1]);
            $('#txt_' + fullsplit[k] + '_' + strTr).attr('transvalueid', fullsplit[2]);

            $('#txt_' + strVal[k] + '_' + strTr).prop('disabled', true);
        }
    }

    for (var j = 0; j < ArrTransCode.length; j++) {
        $('#txt_' + ArrTransCode[j].TransCode + '_' + strTr).prop('disabled', false);
    }
    $('#txtDesc_' + strTr).val(strLineDescription);
    $('#txtTaxCode_' + strTr).val(vTaxCode);
    $('#txtAmt_' + strTr).val(strAmount);
    // $('#txtAmt_' + strTr).prop('disabled', true);
    $('#hdnOAmount_' + strTr).val(strAmount);

    $('#hdnCode_' + strTr).val(strCOAString);
    $('#chkClose_' + strTr).prop('checked', true);
    $('#hdnCOAId_' + strTr).val(strCOAId);
    GetAmountValue(-1);
}

//============================================ Save Invoice 
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 83) {
        // sanjay
        GetAmountValue(-1);
        IscheckedfunSaveInvoice();
    }
});

function IscheckedfunSaveInvoice() {
    $('#fade').show();
    $('#tabAddPO :input').attr('disabled', true);

    var isvalid = hasZeroValues($('.clsTr'));
    if (isvalid > 0) {
        $('#ConfirmPopupZero').show();
        $("#PopupYesPress").focus(); // Set focus to the [Yes] button
    } else {
        funSave();
    }
}

function RemoveLastLine() {
    RemoveZeroLines($('.clsTr'), funJEDeleteRow)

    $('#ConfirmPopupZero').hide();
    funSave();
}

function funSave() {
    $('#ConfirmPopupZero').hide();
    $('#ConfirmPopup').hide();

    var isvalid = '';
    var strClass = $('.input-required');
    for (var i = 0; i < strClass.length; i++) {
        var strId = strClass[i].id;
        var strvalue = strClass[i].value;
        if (strvalue == '') {
            $('#' + strId).attr('style', 'border-color: red;');
            isvalid = isvalid + 1;
        }
    }

    if ($('select#ddlCompany option:selected').val() == "0") {
        isvalid = "1";
    }

    isvalid += CheckRequired($("#txtPODate"));
    isvalid += CheckRequired($("#txtInvoiceNumber"));
    isvalid += CheckRequired($("#txtDescription"));
    isvalid += CheckRequired($("#txtAmount"));
    isvalid += CheckRequired($("#txtBank"));
    isvalid += CheckRequired($("#txtVendor"));

    if ($('#chkThirdParty').prop("checked")) {
        isvalid += CheckRequired($('#txtThirdParty'));
    } else {
        isvalid += CheckRequired($('#txtVendor'));
    }

    if (isvalid == '') {
        var strBlance = $('#lblNewBalance').text();
        var strtxtBal = $('#txtAmount').val();

        strBlance = parseFloat(strBlance.replace(/,/g, ''));
        strtxtBal = parseFloat(strtxtBal.replace(/,/g, ''));
        if (strtxtBal == strBlance) {
            if (strSaveCount == 0) {
                strSaveCount = funSaveInvoice(); // Things checked out, so let's save the invoice lines and update the POs
            } else {
            }
        } else {
            ShowMsgBox('showMSG', 'Invoice Line Amount and Invoice Amount do not match. You cannot save this Invoice..!!', '', 'failuremsg');
            $('#txtAmount').select();
            EnableForm();
            //$('#tabAddPO :input').attr('disabled', false);
            
            $('#fade').hide();
        }
    } else {
        var Msg = 'Please Fill All required  Information First !!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
        EnableForm();
        //$('#tabAddPO :input').attr('disabled', false);
        $('#fade').hide();
    }
}

function funSaveInvoice() {
    let invaliddata = 0;
    strSaveInvoice++;
    var ArrInvoiceLine = [];
    var VendorName = '';
    var ThirdParty = 0;
    var VendorID = 0;
    VendorID = $('#hdnVendorID').val();
    VendorName = $('#txtThirdParty').val();
    if ($('#chkThirdParty').prop("checked")) {
        ThirdParty = 1;
    } else {
        ThirdParty = 0;
    }

    var ObjInvoice = {
        Invoiceid: 0,
        InvoiceNumber: $('#txtInvoiceNumber').val(),
        CompanyID: strCompanyid,
        VendorID: VendorID,
        VendorName: VendorName,
        ThirdParty: ThirdParty,
        WorkRegion: '',
        Description: $('#txtDescription').val(),
        OriginalAmount: $('#lblNewBalance').text(),
        CurrentBalance: $('#lblNewBalance').text(),
        NewItemamount: 0,
        Newbalance: 0,
        BatchNumber: BatchManager.BatchNumber,
        BankId: $('#hdnBank').val(),
        InvoiceDate: $('#txtPODate').val(),
        Duedate: '',
        CheckGroupnumber: '',
        Payby: 'Check',
        InvoiceStatus: 'Pending',
        CreatedBy: localStorage.UserId,
        ProdID: localStorage.ProdId,
        Amount: $('#txtAmount').val(),
        ClosePeriodId: $('#ddlClosePeriod').val(),
        RequiredTaxCode: $('#ChkOverride').prop('checked')
    }
    ArrInvoiceLine = [];

    $('#tblManualEntryTBody tr').each((i, e) => {
        var objLine = {};
        var theobj = e;

        Array.prototype.forEach.call($(e.children), tde => {
            $(tde).removeClass('field-Req');
            $(tde).find('input').each(function (tdei, tede) {
                $(this).removeClass('field-Req');
                let thevalue = tede.value;
                if (tede.type === 'checkbox') thevalue = tede.checked;
                //if (e.name === '') console.log(e);
                //let aig = $(this).data('atlasInputGroup');
                //if (!objLine[aig]) objLine[aig] = {};
                //objLine[aig][tede.name] = tede;
                objLine[tede.name] = thevalue;
            })
        });

        console.log(objLine);
        let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objLine);
        if (COAID === undefined || COACode === undefined) {
            try {
                Object.keys(SegCheck).forEach((seg) => {
                    if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(e).find(`td.input-segment [name=${seg}]`).notify('Invalid Account');
                    $(e).find(`td.input-segment [name=${seg}]`).addClass('field-Req');
                });
            } catch (e) {
                $(e).notify('Invalid Account Coding');
            }
            invaliddata++;
        }
        let SetID;
        try {
            if (AtlasUtilities.SEGMENTS_CONFIG.Set && objLine.Set !== '') {
                let objSet = AtlasUtilities.SEGMENTS_CONFIG.Set[objLine.Set];
                if (!objSet) {
                    $(e).find('td[id=tdSet]').addClass('field-Req');
                    $(e).find('input[name=Set]').notify('Invalid Set');
                    invaliddata++;
                } else {
                    SetID = objSet.AccountID;
                }
            }
        } catch (e) {
            $(e).notify('We cannot process this set');
        }

        try {
            if (objLine.TaxCode !== '' && TaxCodes.find(function(e){ return (e.TaxCode === objLine.TaxCode); }) === undefined) {
                // Invalid Tax Code provided
                $($(e.children.tdTaxCode).find('input')[0]).notify('Invalid Tax Code');
                $($(e.children.tdTaxCode).find('input')[0]).addClass('field-Req');
                invaliddata++
            }
        } catch(e) {}

        let TransString = '';
        if (TCodes) {
                TCodes.forEach(T => {
                    let theobj = $(e).find(`input[name=${T.TransCode}]`)[0];
                    let thevalue = theobj.value ;//+ ' test';
                    let thename = theobj.name;
                    let isvalid = true;
                    try {
                        isvalid = (thevalue === '')? true: T.TV.find((V) => { return V.TransValue === thevalue; });
                    } catch (e) {
                        isvalid = false;
                    }
                    if (!isvalid) {
                        $(theobj).notify('Invalid Code');
                        $(theobj).addClass('field-Req');
                        invaliddata++
                    } else if (isvalid !== true) {
                        TransString += T.Details.TCID;
                        TransString += ':' + isvalid.TVID + ',';
                    }
                });
                TransString = TransString.slice(0, -1);
        }

        let obj = {
            InvoiceLineID: 0,
            InvoiceID: 0,
            COAID: COAID,
            Amount: numeral(objLine.Amount).format('0.00'),
            LineDescription: objLine.LineDescription,
            InvoiceLinestatus: 'Pending',
            COAString: COACode,
            Transactionstring: TransString,
            Polineid: objLine.POLineID,
            CreatedBy: localStorage.UserId,
            ProdID: localStorage.ProdId,
            PaymentID: null,
            SetId: SetID,
            SeriesId: null,
            ClearedFlag: objLine.ClosePO,
            TaxCode: objLine.TaxCode
        }
        ArrInvoiceLine.push(obj);

    }) // End Table loop

    if (invaliddata > 0) {
        EnableForm();
        //$('#tabAddPO :input').attr('disabled', false);
        $('#breadcrumbVendorLi').notify('This entry was NOT SAVED. Please correct your data and then save again.');
        $('#fade').hide();
        strSaveCount = 0;
        return 0;
    }

    if (ArrInvoiceLine.length === 0) {
        EnableForm();
        $('#breadcrumbVendorLi').notify('We cannot process the lines of your Invoice. Please contact support. Thanks!');
        $('#fade').hide();
        strSaveCount = 0;
        return 0;
    }

    let FinalObj = {
        objIn: ObjInvoice,
        objInLine: ArrInvoiceLine
    }

    $.ajax({
        url: APIUrlSaveInvoice,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(FinalObj),
    })
    .done(function (response) {
        funSaveInovioce(response);
    })
    .fail(function (error) {
        ShowMSG(error);
        $('#btnsavevendor').notify('Unable to Save this Invoice. Please notify Support. Thanks.', { elementPosition: 'left bottom'})
        $('#fade').hide();
    })

    return 1;
}

function funSaveInovioce(response) {
    $('#spanTRNumber').text(response);
    let jsonLastTrans = {};
    try {
        jsonLastTrans = JSON.parse(localStorage.LastInvoice);
    } catch (e) {
        // There is no valid JSON in the localStorage
    }
    jsonLastTrans['ProdID_' + localStorage.ProdId] = response;
    localStorage.LastInvoice = JSON.stringify(jsonLastTrans);

    $('#ConfirmPopupPO').hide();
    $('#ConfirmPopupZero').hide();
    $('#SaveInvoiceSuccess').show();
    $('#btnSaveOK').focus();
}

function funSaveInvoiceSuccess() {
    // window.location.href = 'PendingInvoice';
    formmodified = 0;
    location.reload(true);
}

//---------------Filling Bank Details----------------//
$('#txtBank').focus(function () {
    FillBankDetails();
})

function FillBankDetails() {
    $.ajax({
        url: APIUrlFillBankDetails + '?CompanyId=' + $('#ddlCompany').val() + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        FillBankDetailsSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillBankDetailsSucess(response) {
    if (response.length == 1) {
        $("#hdnBank").val(response[0].BankId);
        $('#txtBank').val(response[0].Bankname);
    }

    CheckBankID = [];
    CheckBankID = response;
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
            }
        }
    })
}

function fnPONumber() {
    $.ajax({
        url: APIUrlGetPONumber + '?ProdID=' + localStorage.ProdId + '&VendorId=' + $('#hdnVendorID').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        PONumberSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function PONumberSucess(response) {
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.POID,
            label: m.PONumber,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".PoNumber").autocomplete({
        minLength: 0,
        delay: 300,
        autoFocus: true,
        source: function (request, response) {
            let matches = $.map(array, (item) => {
                if (item.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) {
                    return item;
                }
            });
            response(matches);
        },
        focus: function (event, ui) {
            event.preventDefault();

            return false;
        },
        change: function (event, ui) {
            if (this.value === '') { event.preventDefault(); return false; }
            $(this).attr('PoNumberID', ui.item.value);
            $(this).val(ui.item.label);
            $(this).attr('ponumberid', ui.item.value);
            var rowid = $(this).parents('tr')[0].id;
            ShowPODetail_lineindex = rowid;
            ShowPODetail(rowid, true, true);
            return false;
        }
    })
}

function ReturnFocus(obj) {
    EnableForm();
    //$('#tabAddPO :input').attr('disabled', false);
    $('#txt_' + ShowPODetail_lineindex + '_1').focus();
}

function ShowPODetail(ID, autoDisplay, forceDisplay) {
    ShowPODetail_lineindex = ID;

    autoDisplay = (typeof autoDisplay === 'undefined') ? false : autoDisplay;
    forceDisplay = (typeof forceDisplay === 'undefined') ? true : forceDisplay;
    //AutoDisplayPODialog = autoDisplay === true;

    if ((AutoDisplayPODialog === autoDisplay) || forceDisplay) {
        $('#tabAddPO :input').attr('disabled', true); // Disable the entire form
        strTrIdForPOLine = 0;
        var StrVendorId = 0;
        StrVendorId = $('#hdnVendorID').val();
        let POID = 0;
        if (typeof ID === 'object') {
            POID = ID.getAttribute('ponumberid');
            strTrIdForPOLine = ID.id.replace("txtPONumber", "")
        } else {
            POID = $('#txtPONumber' + ID).attr('ponumberid');
            strTrIdForPOLine = ID;
        }
        if (POID != undefined && POID !== 0) {
            GetPOLines(POID, 0);
        } else {
            POID = 0;
            GetPOLines(POID, StrVendorId);

        }
    }
}

function GetPOLines(POID, StrVendorId) {
    $.ajax({
        url: APIUrlFillPOLines + '?POID=' + POID + '&ProdId=' + localStorage.ProdId + '&VendorId=' + StrVendorId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPOLinesSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetPOLinesSucess(response) {
    var Company = $('#ddlCompany :selected').text();
    response = $.grep(response, function (v) {
        if ((v.COAString.split('|')[0]) == Company)
            return v;
    });

    ArrPOLinesDetail = [];
    ArrPOLinesDetail = response;
    var strHtml = '';
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            strHtml += '<tr>';
            var strStatus = 0;
            var strclsPOId = $('.clsPOLine');
            for (var j = 0; j < strclsPOId.length; j++) {
                var strId = strclsPOId[j].id;
                var strValue = $('#' + strId).val();
                if (response[i].POlineID == strValue) {
                    strStatus++;
                }
            }

            if (strStatus > 0) {
                strHtml += '<td><input type="checkbox" class="poCheck1" id="chkD' + i + '" name="' + response[i].POlineID + '" disabled/> </td>';

            } else {
                strHtml += '<td><input type="checkbox" class="poCheck" id="chkD' + i + '" name="' + response[i].POlineID + '"/> </td>';
            }

            var strCount = i + 1;
            strHtml += '<td>' + strCount + '</td>';
            strHtml += '<td>' + response[i].PONumber + '</td>';
            strHtml += '<td>' + response[i].POLinestatus + '<input type="hidden" id="hdnTaxCod' + i + '" value="' + response[i].TaxCode + '"></td>';

            var straa = response[i].COAString.split('|');
            var TrasnValue = '';
            for (var j = 0; j < straa.length; j++) {
                var SegVal = straa[j];
                if (SegVal.indexOf('>') === -1) {
                    strHtml += '<td>' + SegVal + '</td>';
                } else {
                    var det = SegVal.split('>');
                    strHtml += '<td>' + det[1] + '</td>';
                }
            }

            for (var j = 0; j < ArrOptionalSegment.length; j++) {
                if (j == 0) {
                    strHtml += '<td class="width40">' + response[0].SetCode + '</td>';
                } else {
                    strHtml += '<td class="width40">' + response[0].SeriesCode + '</td>';
                }
                // ArrSegment[i].SegmentName + '_' + ArrSegment[i].SegmentId
            }

            for (var j = 0; j < ArrTransCode.length; j++) {
                strHtml += '<td><span id="spn_' + ArrTransCode[j].TransCode + '_' + i + '"></span></td>';
            }

            var strAmount = '$ ' + parseFloat(response[i].Amount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            strHtml += '<td>' + strAmount + '</td>';
            strHtml += '<td>' + response[i].LineDescription + '</td>';

            strHtml += '</tr>';
        }
    } else {
        if (!AutoDisplayPODialog) {
            var strHtml = '';
            strHtml += '<tr>';
            strHtml += '<td colspan="12" style="text-align: center;">All PO Lines are Invoiced already.</td>';
            strHtml += '</tr>';
            $('#tblPOLineTBody').html('<tr><th>Purchase Line </th></tr>');
        }
        ReturnFocus();
    }

    $('#tblPOLineTBody').html(strHtml);
    //$('#dvPOLines').attr('style', 'display:block;');
    if (strHtml !== '') {
        $('#dvPOLines').show();
        $("#chkPOHead").prop('checked', false);
        $('#chkPOHead').focus();
        $('#fade').show();
    }
    //  $('#dvPOLines').fadeIn(4000);

    AutoDisplayPODialog = false;

    for (var i = 0; i < response.length; i++) {
        var TransactionvalueString = response[i].TransStr;
        var TvstringSplit = TransactionvalueString.split(',');

        for (var j = 0; j < TvstringSplit.length; j++) {
            var strTvs = TvstringSplit[j].split(':');
            $('#spn_' + strTvs[0] + '_' + i).text(strTvs[1]);
            $('#spn_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);
        }
    }
}

function CheckAllPO() {
    if ($("#chkPOHead").prop('checked') == true) {
        $(".poCheck").prop('checked', true);
    }
    else {
        $(".poCheck").prop('checked', false);
    }

}

//=================CheckBank===================//
$('#txtBank').blur(function () {
    var StrAddInvcCheckBanks = $('#txtBank').val().trim();
    if (StrAddInvcCheckBanks != '') {
        for (var i = 0; i < CheckBankID.length; i++) {
            if (CheckBankID[i].Bankname == StrAddInvcCheckBanks) {
                $('#hdnBank').val(CheckBankID[i].BankId);
                $('#txtBank').val(CheckBankID[i].Bankname);
                break;
            } else {
                $('#hdnBank').val(' ');
                $('#txtBank').val('');
            }
        }

        for (var i = 0; i < CheckBankID.length; i++) {
            if (CheckBankID[i].Bankname.substring(0, StrAddInvcCheckBanks.length).toUpperCase() === StrAddInvcCheckBanks.toUpperCase()) {
                $('#hdnBank').val(CheckBankID[i].BankId);
                $('#txtBank').val(CheckBankID[i].Bankname);
                break;
            }
        }
    } else {
        $('#hdnBank').val(CheckBankID[0].BankId);
        $('#txtBank').val(CheckBankID[0].Bankname);
    }
})

//================CheckVendorName======================//
//$('#txtVendor').blur(function () {

//    var StrCheckAddIvcVendorName = $('#txtVendor').val().trim();
//    if (StrCheckAddIvcVendorName != '') {
//        for (var i = 0; i < CheckVendornameAddInvc.length; i++) {
//            if (CheckVendornameAddInvc[i].VendorName == StrCheckAddIvcVendorName) {
//                $('#hdnVendorID').val(CheckVendornameAddInvc[i].VendorID);
//                $('#txtVendor').val(CheckVendornameAddInvc[i].VendorName);
//                break;
//            }
//            else {
//                $('#hdnVendorID').val(' ');
//                $('#txtVendor').val('');

//            }
//        }
//        for (var i = 0; i < CheckVendornameAddInvc.length; i++) {
//            if (CheckVendornameAddInvc[i].VendorName.substring(0, StrCheckAddIvcVendorName.length) === StrCheckAddIvcVendorName) {
//                $('#hdnVendorID').val(CheckVendornameAddInvc[i].VendorID);
//                $('#txtVendor').val(CheckVendornameAddInvc[i].VendorName);
//                break;
//            }
//        }
//    }
//    else {
//       // $('#hdnVendorID').val(CheckVendornameAddInvc[0].VendorID);
//      //  $('#txtVendor').val(CheckVendornameAddInvc[0].VendorName);
//    }
//    $('#txtInvoiceNumber').focus();
//})

$('#txtAmount').blur(function () {
    //var strval = $('#txtAmount').val();
    //strval = (strval + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    //$('#txtAmount').val(strval);
    $('#txtAmount').attr('style', 'width: 65%;');
})

$('#tblManualEntryTBody').delegate('.strClearedFlag', 'keydown', function (event) {
    var strRowcount = $('#tblManualEntryTBody tr:last').attr('id');
    var key = event.which || event.keyCode;
    if (event.which === 9) {
        var $this = $(this)

        var strId = $this.attr('id');
        var strSplit = strId.split('_');
        if (strRowcount == strSplit[1]) {
            funTrCreate(0);
            funSetPreviousRecord(strSplit[1]);
        }
    } else if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtDesc_' + stval).length > 0) {
            $('#txtDesc_' + stval).focus();
        } else {
            //alert('No roew');
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtDesc_' + stval).length > 0) {
            $('#txtDesc_' + stval).focus();
        } else {
            //alert('No roew');
        }
    }
})

function funSetPreviousRecord(value) {
    // strTrCount
    //  alert(strTrCount);
    var TrId = strTrCount - 1;

    for (var i = 0; i < ArrSegment.length; i++) {

        var strval = $('#txt_' + value + '_' + i).val();
        var strCode = $('#txt_' + value + '_' + i).attr('coacode');
        var strcoaid = $('#txt_' + value + '_' + i).attr('coaid');

        $('#txt_' + TrId + '_' + i).val(strval);
        $('#txt_' + TrId + '_' + i).attr('coacode', strCode);
        $('#txt_' + TrId + '_' + i).attr('coaid', strcoaid);

    }
    var strCOACode = $('#hdnCode_' + value).val();
    var strCOAId = $('#hdnCOAId_' + value).val();

    $('#hdnCode_' + TrId).val(strCOACode);
    $('#hdnCOAId_' + TrId).val(strCOAId);

    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        var strval = $('#txtOptional_' + value + '_' + i).val();
        var strId = $('#txtOptional_' + value + '_' + i).attr('accountid');

        $('#txtOptional_' + TrId + '_' + i).val(strval);
        $('#txtOptional_' + TrId + '_' + i).attr('accountid', strId);
    }
    var strCoaCode = $('#hdnCode_' + value).val();
    var strCoaId = $('#hdnCOAId_' + value).val();
    $('#hdnCode_' + TrId).val(strCoaCode);
    $('#hdnCOAId_' + TrId).val(strCoaId);


    var strdesc = $('#txtDesc_' + value).val();
    $('#txtDesc_' + TrId).val(strdesc);

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'Detail') {
            var stri = i - 1;
            $('#txt_' + TrId + '_' + stri).select();
        }
    }
}

$(document).ready(function () {
    GetTaxCodeList();
    formmodified = 0;
    $('form *').change(function () {
        formmodified = 1;
        window.onbeforeunload = confirmExit;
    });

    function confirmExit() {
        if (formmodified == 1) {
            return "You are about to cancel your form. All your data will be lost. Are you sure you want to do this?";
        }
    }
    $("input[name='commit']").click(function () {
        formmodified = 0;
    });
});

function funCanel() {
    $('#DvCancel').show();
    //if(value=='')
}

function funInvoiceCanel(value) {
    if (value == 'Yes') {
        // window.location.replace(HOST + "/AccountPayable/PendingInvoice");
        localStorage.LastInvoiceTransactionNumber = '';
        formmodified = 0;
        location.reload(true);
    } else {
        $('#DvCancel').hide();
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

$('#txtPODate').blur(function () {


    var strval = $('#txtPODate').val();
    if (strval == '') {
        $('#txtPODate').val(Date1);

    }
})


$('#tblManualEntryTBody').delegate('.clsTax', 'keydown', function (event) {
    var strRowcount = $('#tblManualEntryTBody tr:last').attr('id');
    var key = event.which || event.keyCode;
    if (event.which === 9) {
        if (event.shiftKey === true && key === 9) {
        } else {
            var $this = $(this)
            var strId = $this.attr('id');
            var strSplit = strId.split('_');
            if (strRowcount == strSplit[1]) {
                funTrCreate();
                funSetPreviousRecord(strSplit[1]);
            }
        }
    } else if (event.which === 38) {
            var stval = $(this).closest('tr').prev().attr('id');

            if ($('#txtDesc_' + stval).length > 0) {
                $('#txtDesc_' + stval).focus();
            } else {
            }
        } else if (event.which === 40) {
            var stval = $(this).closest('tr').next().attr('id');

            if ($('#txtDesc_' + stval).length > 0) {
                $('#txtDesc_' + stval).focus();
            } else {
                //alert('No roew');
            }
        }

})

$('#tblManualEntryTBody').delegate('.DebitClass', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtAmt_' + stval).length > 0) {
            $('#txtAmt_' + stval).select();
        } else {
            //alert('No roew');
        }

    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtAmt_' + stval).length > 0) {
            $('#txtAmt_' + stval).select();
        } else {
        }
    }
})

$('#tblManualEntry').on('change', 'input, select, textarea', 'change keyup"', function () {
    formmodified = 1;
});

//============================
$('#ChkOverride').click(function () {
    var strclsTax = $('.clsTax');
    if ($('#ChkOverride').prop('checked') == true) {
        for (var i = 0; i < strclsTax.length; i++) {
            var id = strclsTax[i].id;
            $('#' + id).removeClass('detectTab input-required');
        }
    } else {
        for (var i = 0; i < strclsTax.length; i++) {
            var id = strclsTax[i].id;
            $('#' + id).addClass('detectTab input-required');
        }

    }
});

function funTaxCode(value) {
    var array = [];
    var ProductListjson = TaxCode1099;
    array = TaxCode1099.error ? [] : $.map(TaxCode1099, function (m) {
        return { label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(), };
    });
    $(".clsTax").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                try {
                    var findVal = $(this).val();
                    findVal = findVal.toUpperCase();
                    var GetElm = $.grep(array, function (v) {
                        return v.value == findVal;
                    });
                    if (GetElm.length > 0)
                        $(this).val(findVal);
                    else
                        $(this).val('');
                }
                catch (er) {
                    $(this).val('');
                    console.log(er);
                }
            }
        }

    })
}

function ShowDeletePopup() {
    $('#DeletePopup').show();
    $('#fade').show();
}

$('#hrfAddJE').focusout(function () {
    if (CheckTabVal <= 0) {
        funTrCreate();
        //ShowPODetail(0, true);
    } else {
        ReturnFocus(this);
    }
});

//=========================Refvendor=======================//
//=================================Vendor Auto complete sanjay
function FillRefVendor() {
    //  alert('1123');
    $.ajax({
        //url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
        url: APIUrlFillRefVendor + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        FillRefVendorSucess(response); })
    .fail(function (error) { 
        ShowMSG(error); })
}

function FillRefVendorSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
        };
    });
    $(".RefVendor").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnRefVendorID").val(ui.item.value);
            $('#txtThirdParty').val(ui.item.label);

            return false;
        },
        select: function (event, ui) {

            $("#hdnRefVendorID").val(ui.item.value);
            $('#txtThirdParty').val(ui.item.label);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $("#hdnRefVendorID").val('');
                $('#txtThirdParty').val('');
            }
        }
    })
}

//==================================================//
function fun1Segment123(values, SegmentName, SegmentP) {
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
    //txt_0_Company

    $.ajax({
        url: APIUrl12GetCOA123 + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        fun1Segment123Sucess(response, values, SegmentP); })
    .fail(function (error) { 
        console.log(error); })
}

function fun1Segment123Sucess(response, values, SegmentP) {
    GlbCOAList = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            strlabel: m.COANo,
            label: m.COANo1,
            value: m.COACode,
            COAId: m.COAID,
        };
    });
    $('#txt_' + values + '_' + SegmentP).addClass('SearchCode');
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: function (request, response) {
            let matches = $.map(array, (item) => { if (item.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) return item; });
            response(matches);
        },
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.strlabel);
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

//========================Default First Autofill=================//
function FillCompanyFirst() {
    $.ajax({
        url: APIUrlFillCompanyFirst + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        FillCompanyFirstSucess(response); })
    .fail(function (error) { 
        ShowMSG(error); })
}

function FillCompanyFirstSucess(response) {
    strResponse = response;
}

function fillcompanyandlocation(strTrCount) {
    if (strResponse.length == 1) {
        $('#txt_' + strTrCount + '_1').attr('coacode', strResponse[0].LOCOA);
        $('#txt_' + strTrCount + '_1').val(strResponse[0].Location);
        $('#txt_' + strTrCount + '_1').attr('name', 'LO');
        $('#txt_' + strTrCount + '_1').attr('coaid', strResponse[0].LOCOAID);

        $('#hdnCOAId_' + strTrCount).val(strResponse[0].LOCOAID);
        $('#hdnCOAId_' + strTrCount).val(strResponse[0].LOCOA);
    } else {
    }
}

var ShowSegmentNotify = function (sMessage) {
    var sControlName = $("#ddlCompany option:selected").text();
    if (strvCOACode != "") {
        var tempCoaCus = strvCOACode.split("|");
        if (tempCoaCus[0] != sControlName) {
            $.notify(sMessage, "warn");
        }
    }
}

$("#ddlCompany").change(function () {
    ShowSegmentNotify("Vendor Default Company does not match the Document Company");
});

$(document).keydown(function (e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        hideDiv('dvPOLines', 'hrfAddJE');
        ReturnFocus(this);
    }
});

function EnableForm() {
    let classfilter = ('NEW'.toUpperCase() === 'POSTED')? '.atlas-edit-1': '.atlas-edit-0';

    $('#tabAddPO :input').not('.atlas-edit-0').not(classfilter).attr('disabled', false);
    $('#fade').hide();
}
