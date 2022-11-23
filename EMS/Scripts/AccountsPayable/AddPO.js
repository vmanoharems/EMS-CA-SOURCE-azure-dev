// Static
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillCompanyFirst = HOST + "/api/AccountPayableOp/GetDedaultCOLO";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlFillRefVendor = HOST + "/api/POInvoice/GetVendorAddPO";

// Slightly dynamic
var APIUrlCompanyPOStartVal = HOST + "/api/POInvoice/GetPONumberForCompany"; // dynamic by Company
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction"; // dynamic by Company
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory"; //Optional COA; dynamic by SegmentName & SegmentLevel
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";

// Individually dynamic
var APIUrlGetVendorAddress = HOST + "/api/POInvoice/GetVendorAddress";
var APIUrlCheckPONumber = HOST + "/api/POInvoice/CheckPONumber";

//Action API calls
//var APIUrlSavePO = HOST + "/api/POInvoice/SavePO";
var APIUrlSavePO = HOST + "/api/POInvoice/POAdd";

//var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
//var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";


var strResponse = [];
var strTrCount = 0;
var ArrSegment = [];
var ArrTransCode = [];
var CurrentBalanceAmt = 0;
var OldBalanceAmt = 0;
var GetVendorNamePO = [];
var ArrOptionalSegment = [];
var strCOAccId = 0;
var strCOAccCode = 0;

var GlbCOAList = [];

var GlbTransList = [];
var strvCOAId = '';
var strvCOACode = '';
var strvCOATransaction = '';
var strvSetId = '';
var strvSetCode = '';
var strvSeriesId = '';
var strvSeriesCode = '';
var ssDefaultDropdown = '';
var ssWarning = '';
var ssRequired = '';
var strSaveCount = 0;
var strvendorCount = 0;

var TCodes = []; //AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON;
var TaxCodes = undefined; //AtlasCache.Cache.GetItembyName('Tax Codes');

$(function () {
    if (strSaveCount === 0) {
        $('#txtPONumber').focus();
    }
    //$('.w2float').w2field('float'); INVALID
    if (localStorage.LastPO !== '' && localStorage.LastPO !== undefined) {
        let jsonLastTrans = {};
        let strTransactionNumber = '';
        try {
            jsonLastTrans = JSON.parse(localStorage.LastPO);
            strTransactionNumber = jsonLastTrans['ProdID_' + localStorage.ProdId];
        } catch (e) {
            strTransactionNumber = '';
        }

        if (strTransactionNumber !== '' & strTransactionNumber !== undefined) {
            $('#spnLastTransactionNumber').html('Last Transaction #: ' + strTransactionNumber);
        }
    }
    $("#hrfAddJE").keydown(function (event) {
        event.preventDefault();
        if (event.which === 9) {
            funTrCreate();
        }
    });

    $('#UlAccountPayable li').removeClass('active');
    $('#LiAPPO').addClass('active');

    FillCompany();

    ForCompanyPOStartVal();
    FillVendor();

    FillCompanyFirst();
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

    var Date1 = curr_month + '/' + curr_date + '/' + curr_year;

    $('#txtPODate').val(Date1);

    //AtlasPurchaseOrders.BuildAtlasCache();

    AtlasCache.CacheCOA(false);
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());
    AtlasPaste.Config.StaticColumns(["TAX CODE", "AMOUNT", "DESCRIPTION"]);
    AtlasPaste.Config.PastetoTable(funTrCreate);
    AtlasPaste.Config.DestinationTable('tblManualEntryTBody');
    AtlasPaste.Config.DisplayOffset({ top: 140, left: -100 });
    AtlasPaste.Config.Clearcallback(PasteClear);
    AtlasPaste.Config.AfterPastecallback(GetAmountValue);

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
    TaxCodes = AtlasCache.Cache.GetItembyName('Tax Codes').filter(T => { return T.Active });

    AtlasDocument.BindCurrency('');
});

function PasteClear() {
    let elist = $(`#${AtlasPaste.Config.DestinationTable()}`).empty();
    return;
}

$("#txtPODate").datepicker({
    onSelect: function (dateText, inst) {
        this.focus();
    }
});

function FillCompany() {
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlFillCompany + '?ProdId=' + localStorage.ProdId
            , 'doneFunction': FillCompanySucess
            , 'objFunctionParameters': {}
        }
    );

    return;
}

function FillCompanySucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
}

//--------------------------------------------------- CompanyCode   
//=================================Vendor Auto complete sanjay
function FillVendor() {
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlFillVendor + '?ProdId=' + localStorage.ProdId
            , 'doneFunction': FillVendorSucess
            , 'objFunctionParameters': {
            }
        }
    );
    return;
}

function FillVendorSucess(response) {
    GetVendorNamePO = [];
    GetVendorNamePO = response;
    var ProductListjson = response;
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
    GetSegmentsDetails();
}
//================CheckVendorName======================//
$('#txtVendor').blur(function () {
    var StrCheckVendorName = $('#txtVendor').val().trim();
    var strStatus = 0;

    if (StrCheckVendorName !== '') {
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
            } else {

            }
        }
        for (var i = 0; i < GetVendorNamePO.length; ++i) {
            if (GetVendorNamePO[i].VendorName.substring(0, StrCheckVendorName.length).toUpperCase() === StrCheckVendorName.toUpperCase()) {
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
    } else {
        $('#txtVendor').focus();
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
        ssWarning = '';
        ssRequired = '';
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
        ssDefaultDropdown = '';
        ssWarning = '';
        ssRequired = '';
        $('#DvVendorTax').hide();
        $('#ChkOverride').prop('checked', false);
    }
    ShowSegmentNotify("Vendor Default Company does not match the Document Company");
    funVendorTaxCode();
})

function funVendorTaxCode() {
    if (strvendorCount == 0) {
        strvendorCount++;

        if (ssRequired == true) {
            ShowMsgBox('showMSG', 'This Vendor is setup to require a Tax Code field for all line items', '', '');

            $('#DvVendorTax').show();
            $('#lblOverrideTax').addClass('RedFont');
        } else {
            $('#lblOverrideTax').removeClass('RedFont');

        }

        if (ssWarning == true) {
            ShowMsgBox('showMSG', 'This Vendor may require a Tax Code field for all line items', '', '');
        }
    }
}

//============================= Error MSG
function ShowMSG(error) {
    console.log(error);
}

$("#txtVendor").focusout(function () {
    // $.ajax({
    //     //url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
    //     url: APIUrlGetVendorAddress + '?VendorID=' + $('#hdnVendorID').val(),
    //     cache: false,
    //     beforeSend: function (request) {
    //         request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
    //     },
    //     type: 'GET',

    //     contentType: 'application/json; charset=utf-8',
    // })

    //.done(function (response)
    //{ GetVendorAddressSucess(response); })
    //.fail(function (error) {
    //    $('#lblBillingAddress1').html('');
    //    $('#lblBillingAddress2').html('');
    //    $('#lblShippingAddress1').html('');
    //    $('#lblShippingAddress2').html('');
    //})
});

function GetAmountValue1() {
    var NewAmt = 0;
    var Cntt = 0;
    $('#tblManualEntryTBody input[type="text"]').each(function () {
        var CheckCls = $(this).attr('name');
        if (CheckCls == 'POLineAmtt') {

            // var AmtControlID = $(this).attr('id');
            NewAmt = parseFloat($('#txtAmt_' + Cntt).val()) + parseFloat(NewAmt);
            Cntt++;
            NewAmt = (NewAmt + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        }
    });
    $('#lblNewItem').html(NewAmt);
    $('#lblNewBalance').html(NewAmt);
}
function GetAmountValue() {

    var TotalDebit = 0;
    var strDebit = $('.DebitClass');

    for (var i = 0; i < strDebit.length; i++) {
        var strId = strDebit[i].id;
        var strAmount = $('#' + strId).val();

        strAmount = parseFloat(((strAmount === '') ? '0' : strAmount).replace(/,/g, ''));
        //if (strAmount !== 0) {
        //    strAmount = strAmount.replace(/,/g, '');
        //}
        TotalDebit = parseFloat(TotalDebit) + parseFloat(strAmount); // Resolve Javascript bug with float calculations
    }

    TotalDebit = numeral(TotalDebit.toFixed(2)).format('0,0.00'); //(TotalDebit + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    $('#hdnNewItem').val(TotalDebit);
    var ssAmount = $('#hdnNewItem').val();
    $('#lblNewItem').text(TotalDebit);
    $('#lblNewBalance').text(TotalDebit);

    //$('.w2ui-field').w2field('float', { min: 0 }); INVALID
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
function GetVendorAddressSucess(response) {
    var BillingAdd1 = response[0].W9Address1 + ' ' + response[0].W9Address2 + ' ' + response[0].W9Address3;
    var ShippingAdd1 = response[0].RemitAddress1 + ' ' + response[0].RemitAddress2 + ' ' + response[0].RemitAddress3;
    var BillingAdd2 = response[0].W9City + ' , ' + response[0].W9State + ' ' + response[0].W9Zip;
    var ShippingAdd2 = response[0].RemitCity + ' , ' + response[0].RemitState + ' ' + response[0].RemitZip;
    $('#lblBillingAddress1').html(ShippingAdd1);
    $('#lblBillingAddress2').html(ShippingAdd2);
    $('#lblShippingAddress1').html(BillingAdd1);
    $('#lblShippingAddress2').html(BillingAdd2);
}
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
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 0
            , 'doneFunction': GetSegmentListSucess
            , 'objFunctionParameters': {}
        }
    );
    return;
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
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlGetTransactionCode + '?ProdId=' + localStorage.ProdId
            , 'doneFunction': GetTransactionCodeSucess
            , 'objFunctionParameters': {}
        }
    );
    return;
}

function GetTransactionCodeSucess(response) {
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th></th>';

    for (var i = 0; i < ArrSegment.length; i++) {
        strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < response.length; i++) {
        var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }
        ArrTransCode.push(obj);
        strHtml += '<th>' + response[i].TransCode + '</th>';
    }

    strHtml += '<th>Tax Code</th>';
    strHtml += '<th>Amount</th>';
    strHtml += '<th>Description </th>';

    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);

}

function funTrCreate(objD, action, rowID) {
    objD = (objD === undefined) ? {} : objD;

    var strDe = $('#txtDescription').val();
    if (strCOAccCode === 0) {
        ShowMsgBox('showMSG', 'Please Build COA first..!!', '', '');
        return;
    } else {
        let strNote = (objD['DESCRIPTION'] === undefined) ? $('#txtDescription').val() : objD['DESCRIPTION'];
        let strCompany = $('#ddlCompany :selected').text();
        objD['CO'] = strCompany;

        // var strcompanyval = $('#ddlCompany').find("option:selected").text();
        var strhtml = '';
        strhtml += '<tr id="' + strTrCount + '" class="clsTr">';
        strhtml += '<td style="width:30px;"><span style="font-size: 14px;color: red;"><i id="POL_DEL_' + strTrCount + '" class="fa fa-minus-circle" onclick="javascript:funJEDeleteRow(' + strTrCount + ');"></i></span></td>'; /// strTrCount
        let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objD);
        strvCOACode = COACode;
        strvCOAId = COAID;

        //  strhtml += '<td class="width95"><input type="text" class="thirdPVendor" id="txtThirdd' + strTrCount + '"/></td>';
        for (var i = 0; i < ArrSegment.length; i++) {
            let fieldvalue_default = '';
            let SegmentName = ArrSegment[i].SegmentName;

            if (Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName]).length === 1) {
                fieldvalue_default = AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName][Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName])[0]].AccountCode;
                if (!COAID && !fieldvalue_default) fieldvalue_default = '';
            }
            if (ArrSegment[i].SegmentName == 'CO') {
                strhtml += `<td id="td${SegmentName}" class="width40 input-segment"><input type="text" value="${strCompany}" class="clsPaste detectTab input-required" onblur="javascript:GetSegmentValue(${strTrCount},'${ArrSegment[i].SegmentName}',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" coacode="${strCOAccCode}" coaid="${strCOAccId}" value="${strCOAccCode}"  disabled/></td>`;
            } else if (ArrSegment[i].SegmentName == 'DT') {
                strhtml += `<td id="td${SegmentName}" class="width100 input-segment"><input type="text" value="${AtlasPaste.FillFieldValue(objD, SegmentName, fieldvalue_default)}" class="clsPaste detectTab input-required" onblur="javascript: GetSegmentValue(${strTrCount},'${ArrSegment[i].SegmentName}',${i}, this);" onfocus="javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(${strTrCount},'${ArrSegment[i].SegmentName}',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" /></td>`;
            } else {
                strhtml += `<td id="td${SegmentName}" class="width40 input-segment"><input type="text" value="${AtlasPaste.FillFieldValue(objD, SegmentName, fieldvalue_default)}" class="clsPaste detectTab input-required" onblur="javascript: GetSegmentValue(${strTrCount},'${ArrSegment[i].SegmentName}',${i}, this);" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},'${ArrSegment[i].SegmentName}',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" /></td>`;
            }
        }
        for (var i = 0; i < ArrOptionalSegment.length; i++) {
            strhtml += `<td id="td${ArrOptionalSegment[i].SegmentName}" class="width40"><input type="text" value="${AtlasPaste.FillFieldValue(objD, ArrOptionalSegment[i].SegmentName, '')}" class="clsPaste clsOtional${strTrCount}" onblur="javascript: funCheckOptionalAutoFill(${strTrCount},'${ArrOptionalSegment[i].SegmentName}',${i});" onfocus="javascript: GetOptional(${strTrCount},'${ArrOptionalSegment[i].SegmentName}',${i});" id="txtOptional_${strTrCount + '_' + i}" name="${ArrOptionalSegment[i].SegmentLevel}" /></td>`;
        }
        for (var i = 0; i < ArrTransCode.length; i++) {
            strhtml += `<td id="TransactionCode" class="width40"><input type="text" value="${AtlasPaste.FillFieldValue(objD, ArrTransCode[i].TransCode)}" class="clsPaste clsTransCode${strTrCount} clsTransCode_${strTrCount}" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" onfocus="javascript: funTransDetail(${strTrCount},${ArrTransCode[i].TransId},'${ArrTransCode[i].TransCode}')" id="txt_${ArrTransCode[i].TransCode + '_' + strTrCount}" name="${ArrTransCode[i].TransId}" /></td>`;
        }
        var ssCheck = $('#ChkOverride').prop('checked');
        if (ssRequired == true && ssCheck == false) {
            strhtml += `<td class="width40"><input type="text" class="clsTax detectTab input-required" name="POLineAmtt" onfocus="javascript:funTaxCode(${strTrCount});" id="txtTaxCode_${strTrCount}" value="${AtlasPaste.FillFieldValue(objD, 'TAX CODE', ssDefaultDropdown)}" /></td>`;
        } else {
            strhtml += `<td class="width40"><input type="text" class="clsTax " name="POLineAmtt" onfocus="javascript:funTaxCode(${strTrCount});" id="txtTaxCode_${strTrCount}" value="${AtlasPaste.FillFieldValue(objD, 'TAX CODE', ssDefaultDropdown)}" /></td>`;
        }
        strhtml += `<td class="width40"><span style="float: left;background: #fff;padding: 4px 0px;"></span><input type="text" class="AmountDollar DebitClass detectTab w2field amount" onfocusout="javascript: GetAmountValue();" name="POLineAmtt" id="txtAmt_${strTrCount}" value="${AtlasPaste.FillFieldValue(objD, 'AMOUNT', '0.00')}"/></td>`;
        strhtml += `<td class="width200"><input type="text" class="ClsDescription CreditClass detectTab input-required" id="txtDesc_${strTrCount}" value="${strNote}"/>`;
        strhtml += `<input type="hidden" class="clsCOACode" id="hdnCode_${strTrCount}" value="${COACode}"/>`;
        strhtml += `<input type="hidden" class="clsCOAId" id="hdnCOAId_${strTrCount}" value="${COAID}"></td>`;
        strhtml += '</tr>';
        $('#tblManualEntryTBody').append(strhtml);
        fillcompanyandlocation(strTrCount);

        let newline = $(`#${strTrCount}`);
        if (action) { // Only perform the field value checks when action has a value
            let TransString = '';
            if (TCodes) {
                TCodes.forEach(T => {
                    let theobj = newline.find(`input[name=${T.Details.TCID}]`)[0];
                    let thevalue = theobj.value ;//+ ' test';
                    let thename = theobj.name;
                    let isvalid = (thevalue === '')? true: T.TV.find(V => { return V.TransValue === thevalue; });
                    if (!isvalid) {
                        $(theobj).notify('Invalid Code');
                        $(theobj).addClass('field-Req');
                        //invaliddata++
                    } else if (isvalid !== true) {
                        TransString += T.Details.TCID;
                        TransString += ':' + isvalid.TVID + ',';
                    }
                });
                TransString = TransString.slice(0, -1);
            }

            if (TaxCodes) {
                if ((objD['TAX CODE'] !== '' && objD['TAX CODE'] !== undefined) && TaxCodes.find(function(e){ return (e.TaxCode === objD['TAX CODE']); }) === undefined) {
                    // Invalid Tax Code provided
                    $($(newline.children().find('.clsTax')[0])).notify('Invalid Tax Code');
                    $($(newline.children().find('.clsTax')[0])).addClass('field-Req');
                    //invaliddata++
                }
            }

            if (COAID === undefined || COACode === undefined) {
                if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(newline).notify('Invalid Account');
                Object.keys(SegCheck).forEach((seg) => {
                    $(newline).find(`td.input-segment [name=${seg}]`).addClass('field-Req');
                    $(newline).find(`td.input-segment [name=${seg}]`).notify('Invalid Value');
                });
                //invaliddata++;
            }
        }

        $('#txt_' + strTrCount + '_1').focus();
        strTrCount++;
        $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib
    }
    if ($('#DvTab').height() >= (window.innerHeight - 330)) { // Space used by JE header
        $(`#tblManualEntry`).stickyTableHeaders('destroy'); // destroy the old sticky headers

        $('#DvTab').height((window.innerHeight - 330)); // Space used by JE header
        $('#DvTab').css('overflow', 'overlay'); // scroll
        $('#tblManualEntry').stickyTableHeaders({ scrollableArea: $('#DvTab') });
    }

    //$('.w2float').w2field('float'); // invalid
    if (strvCOACode) {
        var strSplit = strvCOACode.split('|');
        var strTr = strTrCount - 1;
        var strCOAPval = '';
        for (var i = 0; i < ArrSegment.length; i++) {
            if (i == 0) { strCOAPval = strSplit[0]; }
            else if (i == 1) { strCOAPval = strSplit[0] + '|' + strSplit[1]; }
            else if (i == 2) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2]; }
            else if (i == 3) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3]; }
            else if (i == 4) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4]; }
            else if (i == 5) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4] + '|' + strSplit[5]; }
            //$('#txt_' + strTr + '_' + i).val(strSplit[i]);
            //$('#txt_' + strTr + '_' + i).attr('coacode', strCOAPval);

            var SegVal = strSplit[i];

            var ssSegVal = SegVal.split('>');
            if (ssSegVal.length == 1) {
                $('#txt_' + strTr + '_' + i).val(SegVal);
                $('#txt_' + strTr + '_' + i).attr('coacode', strCOAPval);
            } else {
                var sLength = ssSegVal.length;
                sLength = sLength - 1;

                $('#txt_' + strTr + '_' + i).val(ssSegVal[sLength]);
                $('#txt_' + strTr + '_' + i).attr('coacode', strCOAPval);

            }
        }

        for (var i = 0; i < ArrOptionalSegment.length; i++) {
            if (i == 0) {
                $('#txtOptional_' + strTr + '_' + i).val(strvSetCode);
                $('#txtOptional_' + strTr + '_' + i).attr('accountid', strvSetId);

            } else {
                $('#txtOptional_' + strTr + '_' + i).val(strvSeriesCode);
                $('#txtOptional_' + strTr + '_' + i).attr('accountid', strvSeriesId);
            }
        }

        var trastr = strvCOATransaction.split(',');
        for (var k = 0; k < trastr.length; k++) {
            var TraVal = trastr[k];
            var trastr1 = TraVal.split(':');
            $('#txt_' + trastr1[0] + '_' + strTr).val(trastr1[1]);
            $('#txt_' + trastr1[0] + '_' + strTr).attr('transvalueid', trastr1[2]);
        }

        $('#hdnCode_' + strTr).val(strvCOACode);
        $('#hdnCOAId_' + strTr).val(strvCOAId);
    } else {
    }
}

function funTaxCode(value) {
    //clsTax
    var array = [];
    var ProductListjson = AtlasUtilities.TaxCode1099;
    array = AtlasUtilities.TaxCode1099.error ? [] : $.map(AtlasUtilities.TaxCode1099, function (m) {
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
            $(this).removeClass('field-Req');
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                try {
                    var findVal = this.value.toUpperCase();
                    //findVal = findVal.toUpperCase();
                    var GetElm = $.grep(array, function (v) {
                        return v.value == findVal;
                    });
                    if (GetElm.length > 0 || findVal === '') {
                        this.value = findVal;
                        $(this).removeClass('field-Req');
                        //$(this).val(findVal);
                    } else {
                        $(this).addClass('field-Req');
                        $(this).notify('Invalid Tax Code');
                        //$(this).val('');
                    }
                }
                catch (er) {
                    $(this).notify('Invalid Tax Code');
                    console.log(er);
                }
            }
        }

    })
}

function funJEDeleteRow(value) {
    $('#' + value).remove();
    GetAmountValue();
    //amount
}

//========================================================= Transaction Code
function funTransDetail(values, TransId, Name) {
    $('#txt_' + Name + '_' + values).removeClass('SearchCodeTransaction');
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlTranscationCode + '?TransactionCodeID=' + TransId
            , 'doneFunction': TransDetailSucess
            , 'objFunctionParameters': {
                'values': values
                , 'TransId': TransId
                , 'Name': Name
            }
        }
    );
    return;
}

function TransDetailSucess(response, objParams) { //values, Name) {
    let values = objParams.objFunctionParameters.values;
    let Name = objParams.objFunctionParameters.Name;
    GlbTransList = response;
    var array = [];
    var ProductListjson = response;
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
            }
        }
    })
}

function funBlurTrans(value, Name) {
    if (GlbTransList.length == 0) {
    } else {
        var strtextval = $('#txt_' + Name + '_' + value).val();
    }

    if (strtextval !== '') {
        for (var i = 0; i < GlbTransList.length; i++) {
            if (GlbTransList[i].TransValue.match(strtextval)) {
                // if (GlbTransList[i].TransValue == strtextval) {
                $('#txt_' + Name + '_' + value).val(GlbTransList[i].TransValue);
                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[i].TransactionValueID);
                break;
            }
            else {
                $('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);
            }
        }
    } else {
        //  $('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
        // $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);

    }
    $('#txt_' + Name + '_' + value).removeClass('SearchCodeTransaction');
}

//========================================================= Optional SET/Series
function GetOptional(values, SegmentName, SegmentP) {
    $('#txtOptional_' + values + '_' + SegmentP).removeClass('SearchOptionalCode');
    let cache = AtlasCache.Cache.GetItem('SearchOptionalCode');

    if (!cache) {
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
            AtlasCache.Cache.SetItem(
                {
                    cacheItemName: 'SearchOptionalCode'
                    , cacheItemValue: response
                    , overwrite: true
                }
            );

            GetOptionalSucess(response, values, SegmentP);
        })
        .fail(function (error) {
            ShowMSG(error);
        });
    } else {
        GetOptionalSucess(cache, values, SegmentP);
    }
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
    }
    else {
    }

    $('#txtOptional_' + value + '_' + valueN).removeClass('SearchOptionalCode');
}

//===============================================/// SAVE PO
function IscheckedfunSavePO() {
    let requiredcount = $('.field-Req').length;
    if (requiredcount > 0) {
        $('#breadcrumbVendorLi').notify('Please fill the required fields with valid data');
        return;
    }

    var isvalid = hasZeroValues($('.clsTr'));
    if (isvalid > 0) {
        $('#ConfirmPopupZero').show();
        $("#PopupYesPress").focus(); // Set focus to the [Yes] button
    } else {
        funSavePO();
    }
}

function RemoveLastLine() {
    RemoveZeroLines($('.clsTr'), funJEDeleteRow)
    $('#ConfirmPopupZero').hide();
    funSavePO();
}

function funSavePO() {
    $('#ConfirmPopupZero').hide();
    window.onbeforeunload = null;

    var strClass = $('.detectTab');
    var isvalid = '';

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
    isvalid += CheckRequired($("#txtAmount"));
    isvalid += CheckRequired($("#txtPONumber"));
    isvalid += CheckRequired($("#txtDescription"));

    if ($('#chkThirdParty').prop("checked")) {
        isvalid += CheckRequired($('#txtThirdParty'));
    }
    else {
        isvalid += CheckRequired($('#txtVendor'));
    }

    if (isvalid == '') {
        invaliddata = 0;
        if (strSaveCount == 0) {
            var strval = $('#lblNewBalance').text().replace(/,/g, '');
            var strBlance = parseFloat($('#lblNewBalance').text().replace(/,/g, ''));
            var strtxtBal = parseFloat($('#txtAmount').val().replace(/,/g, ''));
            //strBlance = strBlance.replaceAll(",$", "");
            if (strtxtBal == strBlance) {
                var ArrPODetail = [];
                var strDebitAmount = $('#spnDebit').text();
                var strCreditAmount = $('#spnCredit').text();
                var strImAmount = $('#txtImBalance').text();

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
                var PoNo = $('#txtPONumber').val();
                var CLOSEPO = 0;

                if ($('#chkClosePO').prop("checked")) {
                    CLOSEPO = 1;
                } else {
                    CLOSEPO = 0;
                }

                // var CID=
                ////////////////////////////////////////////////////////////////////////// JE
                var objPOEntry = {
                    POID: 0
                    , PONumber: PoNo
                    , CompanyID: $('select#ddlCompany option:selected').val()
                    , VendorID: VendorID
                    , VendorName: VendorName
                    , ThirdParty: ThirdParty
                    , WorkRegion: ''
                    , Description: $('#txtDescription').val()
                    , OriginalAmount: $('#lblNewBalance').html()

                    , AdjustmentTotal: 0
                    , RelievedTotal: $('#txtAmount').val()
                    , BalanceAmount: $('#txtAmount').val()

                    , BatchNumber: BatchManager.BatchNumber
                    , ClosePOuponPayment: CLOSEPO
                    , Payby: $('#ddlPayBy').val()
                    , Status: 'Open'
                    , CreatedBy: localStorage.UserId
                    , ProdID: localStorage.ProdId
                    , PODate: $('#txtPODate').val()
                    , ClosePeriodId: $('#ddlClosePeriod').val()
                    , RequiredTaxCode: $('#ChkOverride').prop('checked')
                    , CurrencyDocument: $('#ddlCurrency :selected').val()
                }

                var DAmount = $('.DebitClass');
                var Desc = $('.CreditClass');
                var Note = $('.clsNotes');
                var strCOACode = $('.clsCOACode');
                var strCOAId = $('.clsCOAId');
                var strTr = $('.clsTr');
                var TParty = $('.thirdPVendor');
                var TclsTax = $('.clsTax');
                for (var i = 0; i < strTr.length; i++) {
                    let objCOA = {};
                    $(strTr[i]).find('.input-segment').each(
                        function(i,e){
                            objCOA[$(e).find('input')[0].name] = $(e).find('input')[0].value;
                        }
                    );

                    let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objCOA);
                    if (COAID === undefined || COACode === undefined) {
                        if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(strTr[i]).notify('Invalid Account');
                        Object.keys(SegCheck).forEach((seg) => {
                            $(strTr[i]).find(`td.input-segment [name=${seg}]`).addClass('field-Req');
                            $(strTr[i]).find(`td.input-segment [name=${seg}]`).notify('Invalid Value');
                        });
                        invaliddata++;
                    }

                    var strId = strTr[i].id;
                    var TransString = '';
                    var strSet = '';
                    var strSeires = '';

                    var strOption = $('.clsOtional' + i);
                    for (var j = 0; j < strOption.length; j++) {
                        var strid = strOption[j].id;
                        var strAccountId = $('#' + strid).attr('AccountId');
                        if (j == 0) {
                            strSet = strAccountId;
                        } else if (j == 1) {
                            strSeires = strAccountId;
                        }
                    }

                    var strTrans = $('.clsTransCode' + strId);
                    for (var j = 0; j < strTrans.length; j++) {
                        var strid = strTrans[j].id;
                        var strvalue = $('#' + strid).attr('name');
                        var strTransValueId = $('#' + strid).attr('TransValueId');
                        if (strTransValueId != undefined) {
                            TransString += strvalue;
                            TransString += ':' + strTransValueId + ',';
                        } else { // This means we have maybe a copy and paste or some invalid value
                            if (TCodes) {
                                if ($(`#${strid}`).val() !== '') {
                                    let isvalid = TCodes.find((T) => {return parseInt(strvalue) === T.Details.TCID}).TV.find((TV) => {return TV.TransValue ===  $('#' + strid).val()});
                                    if (!isvalid) {
                                        $(`#${strid}`).notify('Invalid Code');
                                        $(`#${strid}`).addClass('field-Req');
                                        invaliddata++
                                    } else {
                                        $(`#${strid}`).removeClass('field-Req');
                                        TransString += strvalue;
                                        TransString += ':' + isvalid.TVID + ',';
                                    }
                                }
                            }
                        }
                    }
                    TransString = TransString.slice(0, -1);

                    var FDebitAmount = DAmount[i].value;
                    var Description = Desc[i].value;
                    var FstrCOACode = COACode;
                    var FstrCOAId = COAID;
                    var FclsTax = TclsTax[i].value;
                    var TPV = '';

                    var objPODetail = {
                        JournalEntryId: ''
                        , POlineID: 0
                        , POID: 0
                        , COAID: FstrCOAId
                        , Amount: FDebitAmount
                        , ManualAdjustment: 0
                        , ClearedAmount: 0
                        , AdjustMentTotal: 0
                        , RelievedTotal: 0
                        , AvailToRelieve: FDebitAmount
                        , DisplayAmount: FDebitAmount
                        , LineDescription: Description
                        , POLinestatus: 'Open'
                        , ProdID: localStorage.ProdId
                        , CreatedBy: localStorage.UserId
                        , COAString: FstrCOACode
                        , Transactionstring: TransString
                        , ThirdPartyVendor: TPV
                        , SetID: strSet
                        , SeriesID: strSeires
                        , TaxCode: FclsTax
                    }
                    ArrPODetail.push(objPODetail);
                }

                var finalObj = {
                    objPO: objPOEntry,
                    objPOLine: ArrPODetail
                }
                if (invaliddata > 0) {
                    $('#breadcrumbVendorLi').notify('This Purchase Order was NOT Saved. Please correct the entries.');
                    return;
                }

                $.ajax({
                    url: APIUrlSavePO,
                    cache: false,
                    type: 'POST',
                    beforeSend: function (request) {
                        request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(finalObj),
                })
                .done(function (response) {
                    strSaveCount++;
                    funSaveJESucess(response);
                })
                .fail(function (error) {
                    ShowMSG(error);
                });
            } else {
                ShowMsgBox('showMSG', 'Your PO amount does not match your line item Amount', '', 'failuremsg');
                $('#txtAmount').select();
            }
        } else {

        }
    } else {
        var Msg = 'Please Fill All required  Information First !!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    }
}

function funSaveJESucess(response) {
    let POID = response.objPO.POID;

    $('#spanTRNumber').text(POID);
    let jsonLastTrans = {};
    try {
        jsonLastTrans = JSON.parse(localStorage.LastPO);
    } catch (e) {
        // There is no valid JSON in the localStorage
    }
    jsonLastTrans['ProdID_' + localStorage.ProdId] = POID;
    localStorage.LastPO = JSON.stringify(jsonLastTrans);

    $('#POSuccessTran').show();
    $('#ConfirmPopupPO').hide();
    $('#ConfirmPopupZero').hide();
    $('#btnSaveOK').focus();
    // ShowMsgBox('showMSG', 'Purchase Order Saved Successfully ..!!', '', '');

}

function funSaveSuccess() {
    // window.location.href = 'PurchaseOrder';
    location.reload(true);
}
function validate(evt) {
    //var theEvent = evt || window.event;
    //var key = theEvent.keyCode || theEvent.which;
    //key = String.fromCharCode(key);
    //var regex = /[0-9]|\./;
    //if (!regex.test(key)) {
    //    theEvent.returnValue = false;
    //    if (theEvent.preventDefault) theEvent.preventDefault();
    //}
}

//=======
function ForCompanyPOStartVal() {
    $.ajax({
        url: APIUrlCompanyPOStartVal + '?companyCode=' + $('#ddlCompany').find("option:selected").text(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        ForCompanyPOStartValSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
    ;
}

function ForCompanyPOStartValSucess(response) {
    $('#tblManualEntryTBody').html('');
    strTrCount = 0;
    $('#txtPONumber').val('');
    strCOAccId = 0;
    strCOAccCode = 0;
    if (response.length > 0) {
        // $('#txtPONumber').val(response[0].PONumber);
        strCOAccId = response[0].COAId;
        strCOAccCode = response[0].COACode;
    }
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());

    //funGetClosePeriodDetail();
}

$('#tblManualEntryTBody').delegate('.ClsDescription', 'keydown', function (event) {
    var strRowcount = $('#tblManualEntryTBody tr:last').attr('id');
    var key = event.which || event.keyCode;
    if (key === 9) {
        if (event.shiftKey === true) {
        } else {
            var $this = $(this)
            var strId = $this.attr('id');
            var strSplit = strId.split('_');
            if (strRowcount == strSplit[1]) {
                funTrCreate();
                funSetPreviousRecord(strSplit[1]);
                event.preventDefault();
            }
        }
    } else if (key === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtDesc_' + stval).length > 0) {
            $('#txtDesc_' + stval).focus();
        } else {
            //alert('No roew');
        }
    } else if (key === 40) {
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
            return false;
        }
        else {
            //alert('No roew');
        }

    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtAmt_' + stval).length > 0) {
            $('#txtAmt_' + stval).select();
            return false;
        }
        else {
            //alert('No roew');
        }
    }

})
function funSetPreviousRecord(value) {
    var TrId = strTrCount - 1;

    for (var i = 0; i < ArrSegment.length; i++) {
        var strval = $('#txt_' + value + '_' + i).val();
        var strCode = $('#txt_' + value + '_' + i).attr('coacode');
        var strcoaid = $('#txt_' + value + '_' + i).attr('coaid');

        $('#txt_' + TrId + '_' + i).val(strval);
        $('#txt_' + TrId + '_' + i).attr('coacode', strCode);
        $('#txt_' + TrId + '_' + i).attr('coaid', strcoaid);
    }

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

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') {
            var stri = i - 1;
            $('#txt_' + TrId + '_' + stri).select();
        }
    }
    var strdesc = $('#txtDesc_' + value).val();
    $('#txtDesc_' + TrId).val(strdesc);
}

$('#txtAmount').blur(function () {
    $('#txtAmount').attr('style', 'width: 65%;');
})

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
//---------------------------------------------------------- 
function funGetClosePeriodDetail() {
    $.ajax({
        url: APIUrlCompanyClosePeriod + '?CompanyId=' + $('#ddlCompany').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetClosePeriodDetailSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function GetClosePeriodDetailSucess(response) {
    $('#ddlClosePeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
    GetAmountValue();
}

//-==================================================
function funCheckPONumber() {
    //   $('#PopupYesPress').focus();
    $.ajax({
        url: APIUrlCheckPONumber + '?PONumber=' + $('#txtPONumber').val() + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funCheckPONumberSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funCheckPONumberSucess(response) {
    if (response == 0) {
        $('#ConfirmPopupPO').show();
        $('#PopupYesPress').focus();
    }
}

function funDuplicate(value) {
    if (value == 'Yes') {
        $('#ConfirmPopupPO').hide();
        $('#txtPODate').focus();
    } else {
        $('#txtPONumber').val('');
        $('#txtPONumber').focus();
    }
    $('#ConfirmPopupPO').hide();
}
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 83) {
        IscheckedfunSavePO();
    }
});

function funPOAddCancel() {
    $('#POCancel').show();
}

function funCancelButton(value) {
    if (value == 'Yes') {
        let jsonLastTrans = {};
        try {
            jsonLastTrans = JSON.parse(localStorage.LastPO);
        } catch (e) {
            // There is no valid JSON in the localStorage
        }
        jsonLastTrans['ProdID_' + localStorage.ProdId] = '';
        localStorage.LastPO = JSON.stringify(jsonLastTrans);

        window.location.href = 'PurchaseOrder';
    }
    else {
        $('#POCancel').hide();
    }
}

$(document).ready(function () {
    AtlasUtilities.GetTaxCodeList();

    formmodified = 0;
    $('form *').change(function () {
        formmodified = 1;
    });
    window.onbeforeunload = confirmExit;
    function confirmExit() {
        if (formmodified == 1) {
            return "You are about to cancel your form. All your data will be lost. Are you sure you want to do this?";
        }
    }
    $("input[name='commit']").click(function () {
        formmodified = 0;
    });
});

//==================
$('#ChkOverride').click(function () {
    var strclsTax = $('.clsTax');
    if ($('#ChkOverride').prop('checked') == true) {
        for (var i = 0; i < strclsTax.length; i++) {
            var id = strclsTax[i].id;
            $('#' + id).removeClass('detectTab input-required');
        }
    }
    else {
        for (var i = 0; i < strclsTax.length; i++) {
            var id = strclsTax[i].id;
            $('#' + id).addClass('detectTab input-required');
        }

    }
});

//=================================Vendor Auto complete sanjay
function FillRefVendor() {
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlFillRefVendor + '?ProdId=' + localStorage.ProdId
            , 'doneFunction': FillRefVendorSucess
            , 'objFunctionParameters': {
                //'values': values
                //, 'TransId': TransId
                //, 'Name': Name
            }
        }
    );
    return;

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

//========================Default First Autofill=================//
function FillCompanyFirst() {
    AtlasCache.CacheORajax(
        {
            'URL': APIUrlFillCompanyFirst + '?ProdId=' + localStorage.ProdId
            , 'doneFunction': FillCompanyFirstSucess
            , 'objFunctionParameters': {
            }
        }
    );
    return;
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

