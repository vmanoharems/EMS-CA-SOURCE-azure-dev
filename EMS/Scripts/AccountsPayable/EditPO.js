// Static
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";

var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlFillRefVendor = HOST + "/api/POInvoice/GetVendorAddPO";

// Slightly dynamic
var APIUrlCompanyPOStartVal = HOST + "/api/POInvoice/GetPONumberForCompany"; // dynamic by Company
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction"; // dynamic by Company
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory"; //Optional COA; dynamic by SegmentName & SegmentLevel

// Individually dynamic
var APIUrlGetVendorAddress = HOST + "/api/POInvoice/GetVendorAddress";

var APIUrlSaveGetPODetail = HOST + "/api/POInvoice/GetPODetail";
var APIUrlFillPOLines = HOST + "/api/POInvoice/GetPOLines";
var APIUrlDeletePoById = HOST + "/api/POInvoice/DeletePoById";
var APIUrlfunClosePO = HOST + "/api/POInvoice/UpdatePOStatusClose";

//Action API calls
var APIUrlSavePO = HOST + "/api/POInvoice/UpdatePO";
var APIUrlfunDeletePOLine = HOST + "/api/POInvoice/DeletePOLine";

//var APIUrlGetTransactionNumber = HOST + "/api/Ledger/GetTransactionNumber";


var strTrCount = 0;
var ArrSegment = [];
var ArrOptionalSegment = [];
var ArrTransCode = [];
var CurrentBalanceAmt = 0;
var OldBalanceAmt = 0;
var strStatus = 0;
var strCOAccId = 0;
var strCOAccCode = 0;
var StrPOStatus = '';

var GlbCOAList = [];
var GlbTransList = [];
var StrPOlineStatus = [];

var strvCOAId = '';
var strvCOACode = '';
var strvCOATransaction = '';
var strvSetId = '';
var strvSetCode = '';
var strvSeriesId = '';
var strvSeriesCode = '';
var strClosePeriodId = 0;

var ssDefaultDropdown = '';
var ssWarning = '';
var ssRequired = '';
var publicstrStatus = 'enabled';

let objAtlasAPPO =
    {
        COCode: ''
        , Currency: 'USD'
        , PONumber: ''
        , PODate: ''
        , VendorName: ''
        , RefVendor: ''
        , Description: ''
        , AmountBalance: 0.00
        , AmountOriginal: 0.00
        , AmountAdjustment: 0.00
        , AmountRelieved: 0.00
        , AmountField: 0.00
        , ClosedPeriodID: undefined
        , objPOLines: {}
        , LineAmount: 0.00
        , CalculateLineAmount: function () {
            objAtlasAPPO.LineAmount = 0.00;

            $('.DebitClass').each(function (i, obj) {
                objAtlasAPPO.LineAmount += numeral(obj.value).value();
            });
        }
    }

$(function () {
    //$('.w2float').w2field('float'); //INVALID
    $('#UlAccountPayable li').removeClass('active');
    $('#LiAPPO').addClass('active');

    FillCompany();
    CurrentBalanceAmt = 0;
    $("#txtThirdParty").attr("disabled", "disabled");
    $("#preload").css("display", "block");

    AtlasCache.init();
    AtlasCache.CacheCOA()

});


function GetPODetail() {
    $.ajax({
        url: APIUrlSaveGetPODetail + '?POID=' + localStorage.EditPONo,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPODetailSucess(response); })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetPODetailSucess(response) {
    if (response.length > 0) {
        BatchManager.ForceBatch(response[0].BatchNumber);
        var strAmount = parseFloat(response[0].OriginalAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        $('#ddlCompany').val(response[0].CompanyID);
        $('#txtPONumber').val(response[0].PONumber);
        $('#ddlPayBy').val(response[0].Payby);
        $('#txtDescription').val(response[0].Description);
        $('#txtPODate').val(response[0].PODate);
        $('#lblOriAmt').html(strAmount);
        $('#lblCurrBal').html(strAmount);
        ///////////////////////////////

        var strAdjustmentTotal = parseFloat(response[0].AdjustmentTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        $('#lblAdjustmentTotal').html(strAdjustmentTotal);
        var strRelivedTotal = parseFloat(response[0].RelievedTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        $('#lblRelivedTotal').html(strRelivedTotal);

        let PendingReliefTotal = parseFloat(response[0].RelievedTotal) - (parseFloat(response[0].OriginalAmount) - parseFloat(response[0].BalanceAmount - parseFloat(response[0].AdjustmentTotal))); // Calculating the Pending Relief from the balance vs original vs the RelievedTotal
        PendingReliefTotal = parseFloat(PendingReliefTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        $('#lblPendingRelief').html(PendingReliefTotal);

        var strBalanceTotal = parseFloat(response[0].BalanceAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        $('#lblBalanceTotal').html(strBalanceTotal);

        ///////////////////////////////
        $('#breadcrumbVendorLi').text('PO# (' + response[0].PONumber + ')');
        var VID = response[0].VendorID;
        //if (VID != '0') {
        $('#txtVendor').val(response[0].tblVendorName);
        $('#hdnVendorID').val(VID);
        //}
        //else {

        if (response[0].ThirdParty === true) {
            $("#chkThirdParty").prop('checked', true);
            $('#txtThirdParty').prop('disabled', false);

        }

        $('#txtThirdParty').val(response[0].VendorName);
        //}

        strStatus = response[0].Status;
        if (strStatus === 'Closed') {
            $('#btnSavePO').hide();
            $('#btnOpen').show();
            $('#btnClose').hide();
            publicstrStatus = 'disabled';
            $('#txtVendor').prop('disabled', true);
            $('#txtThirdParty').prop('disabled', true);
            $('#txtPONumber').prop('disabled', true);
            $('#txtPODate').prop('disabled', true);
            $('#txtAmount').prop('disabled', true);
            $('#txtDescription').prop('disabled', true);
            $('#chkThirdParty').prop('disabled', true);
            $('#ddlClosePeriod').prop('disabled', true);
        }
        if (strStatus != 'Open') {
            $('#btnDelete').hide();
        }

    }
    var strval = (response[0].OriginalAmount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    $('#txtAmount').val(parseFloat(response[0].BalanceAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    strClosePeriodId = response[0].ClosePeriodId;

    if (response[0].RequiredTaxCode === true) {
        $('#ChkOverride').prop('checked', true);
    }
    // 

    objAtlasAPPO.COCode = response[0].COCode;
    objAtlasAPPO.Currency = 'USD';
    objAtlasAPPO.PONumber = response[0].PONumber;
    objAtlasAPPO.PODate = response[0].PODate;
    objAtlasAPPO.VendorName = response[0].tblVendorName;
    objAtlasAPPO.AmountBalance = parseFloat(response[0].BalanceAmount + "").toFixed(2);
    objAtlasAPPO.AmountOriginal = parseFloat(response[0].OriginalAmount + "").toFixed(2);
    objAtlasAPPO.AmountAdjustment = parseFloat(response[0].AdjustmentTotal + "").toFixed(2);
    objAtlasAPPO.AmountRelieved = parseFloat(response[0].RelievedTotal + "").toFixed(2);
    objAtlasAPPO.AmountField = parseFloat(response[0].BalanceAmount + "").toFixed(2);
    objAtlasAPPO.ClosedPeriodID = response[0].ClosePeriodId;

    VendorAddress();
}

function GetPOLines() {
    $.ajax({
        url: APIUrlFillPOLines + '?POID=' + localStorage.EditPONo + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
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
    var strHtml = '';
    StrPOlineStatus = response;

    for (var i = 0; i < response.length; i++) {
        objAtlasAPPO.objPOLines[i] = {};
        objAtlasAPPO.objPOLines[i].AmountOriginal = parseFloat(response[i].Amount);
        objAtlasAPPO.objPOLines[i].AmountRelieved = parseFloat(response[i].RelievedTotal);
        objAtlasAPPO.objPOLines[i].AmountBalance = parseFloat(response[i].NewAmount);
        objAtlasAPPO.objPOLines[i].POlineID = response[i].POlineID;
        objAtlasAPPO.LineAmount += parseFloat(response[i].NewAmount);

        var CheckCloseStatus = response[i].POCloseStatus;
        var CloseStatusCls = '';
        var CheckStatus = response[i].POLinestatus;
        if (CheckCloseStatus == '1' && response[i].NewAmount == 0) {
            $('#txtVendor').prop('disabled', true);
            $('#txtThirdParty').prop('disabled', true);
            $('#txtPONumber').prop('disabled', true);
            $('#txtPODate').prop('disabled', true);
            $('#txtDescription').prop('disabled', true);
            $('#chkThirdParty').prop('disabled', true);
            $('#ddlClosePeriod').prop('disabled', true);
        }
        //  if (CheckStatus == 'New') {
        if (CheckStatus == 'Invoiced') {
            StrPOStatus = 1;
        }
        funTrCreate(
            {
                idx: i
                , "POLineID": response[i].POlineID
                , "AmountRelieved": parseFloat(response[i].RelievedTotal)
                , "responseline": response[i]
            }
        );

        if (CheckCloseStatus == '1') {
            $('#txtAmt_' + i).prop('disabled', true);
            $('#txtThirdd' + i).prop('disabled', true);
            $('#txtDesc_' + i).prop('disabled', true);
            $('#txtTaxCode_' + i).prop('disabled', true);

        } else {
            $('#txtAmt_' + i).prop('disabled', false);
            $('#txtThirdd' + i).prop('disabled', false);
            $('#txtDesc_' + i).prop('disabled', false);
            $('#txtTaxCode_' + i).prop('disabled', false);
        }

        $('#txtThirdd' + i).val(response[i].ThirdPartyVendor);

        if (response[i].NewAmount > 0) {
            $('#txtAmt_' + i).val(response[i].NewAmount);
        } else {
            $('#txtAmt_' + i).removeClass('w2ui-field');
            $('#txtAmt_' + i).val(numeral(response[i].NewAmount).format('0,0.00'));
        }
        $('#txtDesc_' + i).val(response[i].LineDescription);
        $('#txtTaxCode_' + i).val(response[i].TaxCode);
        if (response[i].POLinestatus == 'Closed') {
            $('#chkDStatus' + i).prop('checked', true);
        } else {
            $('#chkDStatus' + i).prop('checked', false);
        }

        $('#hdnOA_' + i).val(response[i].Amount);
        $('#hdnNewA_' + i).val(response[i].NewAmount);

        $('#hdnRA_' + i).val(response[i].RelievedTotal);
        $('#checkRelAmt_' + i).text(response[i].POCloseStatus); //lll

        var straa = response[i].COAString.split('|');
        var TrasnValue = '';
        for (var j = 0; j < straa.length; j++) {
            if (i == 0 && j == 0) {
                var strCOAccId = 0;
                var strCOAccCode = straa[0];
            }
            if (j == 0) { strCOAPval = straa[0]; }
            else if (j == 1) { strCOAPval = straa[0] + '|' + straa[1]; }
            else if (j == 2) { strCOAPval = straa[0] + '|' + straa[1] + '|' + straa[2]; }
            else if (j == 3) { strCOAPval = straa[0] + '|' + straa[1] + '|' + straa[2] + '|' + straa[3]; }
            else if (j == 4) { strCOAPval = straa[0] + '|' + straa[1] + '|' + straa[2] + '|' + straa[3] + '|' + straa[4]; }
            else if (j == 5) { strCOAPval = straa[0] + '|' + straa[1] + '|' + straa[2] + '|' + straa[3] + '|' + straa[4] + '|' + straa[5]; }
            var SegVal = straa[j];
            var ssSegVal = SegVal.split('>');
            if (ssSegVal.length == 1) {
                $('#txt_' + i + '_' + j).val(SegVal);
                $('#txt_' + i + '_' + j).attr('coacode', strCOAPval);
            } else {
                var sLength = ssSegVal.length;
                sLength = sLength - 1;
                // ssSegVal = ssSegVal[sLength];

                $('#txt_' + i + '_' + j).val(ssSegVal[sLength]);
                $('#txt_' + i + '_' + j).attr('coacode', strCOAPval);
            }

            if (CheckCloseStatus == '1') {
                $('#txt_' + i + '_' + j).prop('disabled', true);

            } else {
                $('#txt_' + i + '_' + j).prop('disabled', false);

            }
        }

        var trastr = response[i].TransStr.split(',');
        for (var k = 0; k < trastr.length; k++) {
            var TraVal = trastr[k];
            var trastr1 = TraVal.split(':');
            $('#txt_' + trastr1[0] + '_' + i).val(trastr1[1]);
            $('#txt_' + trastr1[0] + '_' + i).attr('transvalueid', trastr1[2]);

            if (CheckCloseStatus == '1') {
                $('#txt_' + trastr1[0] + '_' + i).prop('disabled', true);

            } else {
                $('#txt_' + trastr1[0] + '_' + i).prop('disabled', false);

            }

        }
        for (var k = 0; k < ArrOptionalSegment.length; k++) {
            if (k == 0) {
                $('#txtOptional_' + i + '_' + k).val(response[i].SetCode);
                $('#txtOptional_' + i + '_' + k).attr('AccountId', response[i].SetID);
            } else {
                $('#txtOptional_' + i + '_' + k).val(response[i].SeriesCode);
                $('#txtOptional_' + i + '_' + k).attr('AccountId', response[i].SeriesID);
            }

            if (CheckCloseStatus == '1') {
                $('#txtOptional_' + i + '_' + k).prop('disabled', true);
            } else {
                $('#txtOptional_' + i + '_' + k).prop('disabled', false);
            }

        }

        $('#hdnCode_' + i).val(response[i].COAString);
        $('#hdnCOAId_' + i).val(response[i].COAID);
        $('#hdnPOLineId_' + i).val(response[i].POlineID);
        $('#hdnPOLineId_' + i).attr('POstatus', CheckStatus);
    }
    if (StrPOStatus == 1) {
        // $('#btnSavePO').hide();
        $('#btnDelete').hide();

    }
    // VendorAddress();
    $("#preload").css("display", "none");
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib
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
    .done(function (response) {
        FillCompanySucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillCompanySucess(response) {
    $('#ddlCompany').append('<option value=0>Select Company</option>');
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
    //  FillVendor();
    GetSegmentsDetails();
}

//--------------------------------------------------- CompanyCode   
function FillVendor() {
    $.ajax({
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

function ShowMSG(error) {
    console.log(error);
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

}

$('#txtVendor').blur(function () {
    var StrCheckVendorName = $('#txtVendor').val().trim();
    var strStatus = 0;

    if (StrCheckVendorName != '') {
        for (var i = 0; i < GetVendorNamePO.length; i++) {
            if (GetVendorNamePO[i].VendorName == StrCheckVendorName) {
                $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
                $('#txtVendor').val(GetVendorNamePO[i].VendorName);
                $('#lblBillingAddress1').html(GetVendorNamePO[i].Add1W9);
                $('#lblBillingAddress2').html(GetVendorNamePO[i].Add2W9);
                $('#lblShippingAddress1').html(GetVendorNamePO[i].Add1Re);
                $('#lblShippingAddress2').html(GetVendorNamePO[i].Add2Re);
                strvCOAId = GetVendorNamePO[i].COAId;
                strvCOACode = GetVendorNamePO[i].COAString;
                strvCOATransaction = GetVendorNamePO[i].TransString;
                strvSetId = GetVendorNamePO[i].SetId;
                strvSetCode = GetVendorNamePO[i].SetCode;
                strvSeriesId = GetVendorNamePO[i].SeriesId;
                strvSeriesCode = GetVendorNamePO[i].SeriesCode;

                strStatus++;
                break;
            } else {
                // do nothing
            }
        }

        for (var i = 0; i < GetVendorNamePO.length; ++i) {
            if (GetVendorNamePO[i].VendorName.substring(0, StrCheckVendorName.length) === StrCheckVendorName) {
                $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
                $('#txtVendor').val(GetVendorNamePO[i].VendorName);
                $('#lblBillingAddress1').html(GetVendorNamePO[i].Add1W9);
                $('#lblBillingAddress2').html(GetVendorNamePO[i].Add2W9);
                $('#lblShippingAddress1').html(GetVendorNamePO[i].Add1Re);
                $('#lblShippingAddress2').html(GetVendorNamePO[i].Add2Re);
                strvCOAId = GetVendorNamePO[i].COAId;
                strvCOACode = GetVendorNamePO[i].COAString;
                strvCOATransaction = GetVendorNamePO[i].TransString;
                strvSetId = GetVendorNamePO[i].SetId;
                strvSetCode = GetVendorNamePO[i].SetCode;
                strvSeriesId = GetVendorNamePO[i].SeriesId;
                strvSeriesCode = GetVendorNamePO[i].SeriesCode;
                strStatus++;
                break;
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
    }
})

function VendorAddress() {
    $.ajax({
        url: APIUrlGetVendorAddress + '?VendorID=' + $('#hdnVendorID').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
  .done(function (response) {
      GetVendorAddressSucess(response);
  })
  .fail(function (error) {
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
  })
}

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

function GetAmountValue(objParams) {
    objParams = typeof objParams !== 'undefined' ? objParams : undefined;
    objAtlasAPPO.CalculateLineAmount();

    var TotalDebit = 0;
    var strDebit = $('.DebitClass');

    for (var i = 0; i < strDebit.length; i++) {
        var strId = strDebit[i].id;
        var strAmount = $('#' + strId).val();

        strAmount = (strAmount === '') ? '0' : strAmount;
        strAmount = strAmount.replace(/,/g, '');
        TotalDebit = parseFloat(TotalDebit) + parseFloat(strAmount);
    }

    var strOAmount = 0;
    var strDebit = $('.clsOA');

    for (var i = 0; i < strDebit.length; i++) {
        var strId = strDebit[i].id;
        var strAmount = $('#' + strId).val();
        if (strAmount == '') {
            strAmount = 0;
        }
        strAmount = (strAmount == '') ? '0' : strAmount;
        strAmount = strAmount.replace(/,/g, '');
        strOAmount = parseFloat(strOAmount) + parseFloat(strAmount);
    }
    ////
    var strRAmount = 0;
    var strDebit = $('.clsRA');

    for (var i = 0; i < strDebit.length; i++) {
        var strId = strDebit[i].id;
        var strAmount = $('#' + strId).val();

        strAmount = (strAmount == '') ? '0' : strAmount;
        strAmount = strAmount.replace(/,/g, '');
        strRAmount = parseFloat(strAmount) + parseFloat(strRAmount);
    }

    if (objParams !== undefined) { // This means we're getting called on the Amount field's blur
        let AmountBalance = 0;
        if (objParams.isNew) {
            AmountBalance = $('#txtAmt_' + objParams.POLineID).val();
        } else {
            AmountBalance = objAtlasAPPO.objPOLines[objParams.POLineID].AmountBalance
        }
        AmountBalance = parseFloat(numeral(AmountBalance)._value).toFixed(2);
        let AmountNew = parseFloat(numeral(objParams.NewAmount)._value).toFixed(2);
        let AmountDiff = parseFloat(AmountNew - AmountBalance).toFixed(2);

        let strTotalAdjustment = numeral($('#lblAdjustmentTotal').text())._value;
        strTotalAdjustment = parseFloat(parseFloat(strTotalAdjustment) + parseFloat(AmountDiff)).toFixed(2);

        $('#lblAdjustmentTotal').text(numeral(strTotalAdjustment).format('0,0.00'));
        objAtlasAPPO.objPOLines[objParams.POLineID].AmountBalance = parseFloat(AmountNew);
    }

    TotalDebit = parseFloat(TotalDebit + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    strRAmount = parseFloat(strRAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    $('#hdnNewItem').val(TotalDebit);
    var ssAmount = $('#hdnNewItem').val();
    $('#lblNewItem').text(TotalDebit);
    $('#lblNewBalance').text(TotalDebit);
    //$('#lblRelivedTotal').text(strRAmount); Not sure why the relieved total is being changed as a calculation
    $('#lblBalanceTotal').html(TotalDebit);
    //$('.w2float').w2field('float'); //INVALID

    formmodified = 0;
}

$('#tblManualEntryThead').delegate('.DebitClass', 'focusout', function () {
    var NewAmt = 0;
    var Cntt = 0;
    $('#tblManualEntryThead input[type="text"]').each(function () {
        var CheckCls = $(this).attr('name');
        if (CheckCls == 'POLineAmtt') {
            //  txtAmt_1
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
    strvCOAId = response[0].COAId;
    strvCOACode = response[0].COAString;
    strvCOATransaction = response[0].TransString;
    strvSetId = response[0].SetId;
    strvSetCode = response[0].SetCode;
    strvSeriesId = response[0].SeriesId;
    strvSeriesCode = response[0].SeriesCode;

    ssDefaultDropdown = response[0].DefaultDropdown;
    ssWarning = response[0].Warning;
    ssRequired = response[0].Required;

    GetPOLines();
    ForCompanyPOStartVal();
    funVendorTaxCode();
}

function funVendorTaxCode() {
    //alert(ssDefaultDropdown + ' ' + ssWarning + ' ' + ssRequired);
    if (ssRequired == true) {
        // alert('This Vendor is setup to require a Tax Code field for all line items');
        $('#DvVendorTax').show();
    }
    if (ssWarning == true) {
        //  alert('This Vendor may require a Tax Code field for all line items');
    }
}

function ThirdParty() {
    if ($('#chkThirdParty').prop("checked")) {
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
            SegmentId: response[i].SegmentId, SegmentName: response[i].Classification
        }
        ArrSegment.push(ObjSegment);
        if (response[i].Classification == 'Detail') {
            break;
        }
    }
    var strval = 0;
    for (var i = 0; i < response.length; i++) {
        ArrOptionalSegment = [];
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
        GetTransactionCodeSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}
function GetTransactionCodeSucess(response) {
    ArrTransCode = [];
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th></th>';

    // strHtml += '<th>3rd Party Vendor</th>';

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
    strHtml += '<th>Description</th>';
    strHtml += '<th>Close</th>';
    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);

    GetPODetail();
}

function funTrCreate(objParams) {
    let value = undefined;
    let displayDelete = true;
    let isNewRow = false;
    if (typeof (objParams) === 'object') {
        value = objParams.POLineID;
        value = objParams.idx;
        displayDelete = (numeral(objParams.AmountRelieved)._value === 0);
        strvCOACode = objParams.responseline.COAString;
    } else {
        isNewRow = true;
        value = $('#tblManualEntryTBody tr').length; // in the case of adding a blank new line we'll make sure value has something!
        objAtlasAPPO.objPOLines[value] = {};
    }
    // alert(value);
    var strhtml = '';
    strhtml += '<tr id="' + strTrCount + '" class="clsTr">';
    strhtml += '<td style="width:30px;">';
    if (displayDelete) {
        strhtml += '<span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript:funJEDeleteRow(' + strTrCount + ');"></i></span>';
    }
    strhtml += '</td>'; /// strTrCount
    for (var i = 0; i < ArrSegment.length; i++) {
        let fieldvalue_default = '';
        // inconsistent functions to perform the same action as what's in AddPO
        //if (Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName]).length === 1) {
        //    fieldvalue_default = AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName][Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName])[0]].AccountCode;
        //}

        if (Object.keys(AtlasUtilities.SEGMENTS_CONFIG[AtlasUtilities.SEGMENTS_CONFIG.sequence[i].SegmentCode]).length === 1) {
            fieldvalue_default = AtlasUtilities.SEGMENTS_CONFIG[AtlasUtilities.SEGMENTS_CONFIG.sequence[i].SegmentCode][Object.keys(AtlasUtilities.SEGMENTS_CONFIG[AtlasUtilities.SEGMENTS_CONFIG.sequence[i].SegmentCode])[0]].AccountCode;
        }

        if (ArrSegment[i].SegmentName == 'Company') {
            strhtml += '<td class="width40"><input type="text" class="  detectTab input-required" onblur="javascript:GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ', this);" onfocus="javascript:AtlasPurchaseOrders.funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" disabled  coaid="' + strCOAccId + '" coacode="' + strCOAccCode + '" value="' + strCOAccCode + '" /></td>';
        } else if (ArrSegment[i].SegmentName == 'Detail') {
            strhtml += '<td class="width100"><input type="text" class="  detectTab input-required" onblur="javascript:GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ', this);" onfocus="javascript:AtlasPurchaseOrders.fun1Segment123(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  ' + publicstrStatus + '/></td>';

        } else {
            strhtml += '<td class="width40"><input type="text" value="' + fieldvalue_default + '" class="  detectTab input-required" onblur="javascript:GetSegmentValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ', this);" onfocus="javascript:AtlasPurchaseOrders.funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  ' + publicstrStatus + '/></td>';
        }
    }

    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strhtml += '<td class="width40"><input type="text"  class=" clsOtional' + strTrCount + '   " onblur="javascript:funCheckOptionalAutoFill(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + strTrCount + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" ' + publicstrStatus + ' /></td>';
    }

    for (var i = 0; i < ArrTransCode.length; i++) {
        strhtml += `<td class="width40"><input type="text" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" class="clsTransCode${strTrCount} clsTransCode_${strTrCount}" onfocus="javascript: funTransDetail(${strTrCount},${ArrTransCode[i].TransId},'${ArrTransCode[i].TransCode}')" id="txt_${ArrTransCode[i].TransCode + '_' + strTrCount}" name="${ArrTransCode[i].TransId}" ${publicstrStatus} /></td>`;
    }

    var ssCheck = $('#ChkOverride').prop('checked');
    if (ssRequired == true && ssCheck == false) {
        strhtml += '<td class="width40"><input type="text" class="  clsTax detectTab input-required"  name="POLineAmtt"  id="txtTaxCode_' + strTrCount + '" onfocus="javascript:funTaxCode(' + strTrCount + ');" value="' + ssDefaultDropdown + '" ' + publicstrStatus + ' /></td>';
    } else {
        strhtml += '<td class="width40"><input type="text" class="  clsTax  number "  name="POLineAmtt"  id="txtTaxCode_' + strTrCount + '" onfocus="javascript:funTaxCode(' + strTrCount + ');"  value="' + ssDefaultDropdown + '" ' + publicstrStatus + '/></td>';

    }

    strhtml += '<td class="width40"><span style="float: left;background: #fff;padding: 4px 0px;">$</span><input type="text" class="AmountDoller DebitClass detectTab w2field amount" onfocusout="javascript:GetAmountValue({POLineID:' + value + ',NewAmount:this.value,isNew:' + isNewRow + '});" name="POLineAmtt"  id="txtAmt_' + strTrCount + '" value="0.00" ' + publicstrStatus + '/></td>';
    strhtml += '<td class="width100"><input type="text" class=" ClsDescription CreditClass detectTab input-required " id="txtDesc_' + strTrCount + '" value="" ' + publicstrStatus + '/><input type="hidden" class="clsCOACode" id="hdnCode_' + strTrCount + '" value="' + strCOAccCode + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + strTrCount + '"><input type="hidden" class="clsPOLine" id="hdnPOLineId_' + strTrCount + '"></td>';
    if (strStatus == 'Closed') {
        strhtml += '<td class="width40"><input type="checkbox" class="clspoCheck' + strTrCount + '" id="chkDStatus' + strTrCount + '" name="" disabled/> </td>';

    } else {
        strhtml += '<td class="width40"><input type="checkbox" class="clspoCheck' + strTrCount + '" id="chkDStatus' + strTrCount + '" name=""/> </td>';

    }
    strhtml += '<td style="display:none;"><input type="hidden" id="hdnOA_' + strTrCount + '" class="clsOA"/><input type="hidden" id="hdnNewA_' + strTrCount + '" class="clsNewA"/><input type="hidden" id="hdnRA_' + strTrCount + '" class="clsRA"/></td>';
    strhtml += '<td id="checkRelAmt_' + strTrCount + '" style="display:none;"></td>'
    strhtml += '<td id="checkRelAmt_' + strTrCount + '" style="display:none;"></td>'
    strhtml += '</tr>';
    $('#tblManualEntryTBody').append(strhtml);
    $('#txt_' + strTrCount + '_1').focus();
    //$('.w2float').w2field('float'); //INVALID

    strTrCount++;
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib

    if (value == 1) {
        if (strvCOACode == '') {
            $('#txt_' + strTr + '_' + 0).val(strCOAccCode);
            $('#txt_' + strTr + '_' + 0).attr('coacode', strCOAccId);
        } else {
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

            $('#hdnCode_' + strTr).val(strvCOACode);
            $('#hdnCOAId_' + strTr).val(strvCOAId);
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
    }

    if (isNewRow) {
        formmodified = 1;
    }
}

function funJEDeleteRow(value) {
    $('#hdnDeletePOline').val('');
    var POLineId = $('#hdnPOLineId_' + value).val();
    var POLineStatus = $('#hdnPOLineId_' + value).attr('POstatus');

    if (POLineId == '') {
        $('#' + value).remove();
    } else {
        if (POLineStatus != 'Invoiced') {
            $('#DeletePOlinePopup').show();
            $('#fade').show();
            $('#hdnDeletePOline').val(value);
        } else {
            ShowMsgBox('showMSG', 'PO Line used in Invoiced.. !!', '', 'failuremsg');
        }
    }
}

function funDeletePOLine() {
    var str = $('#hdnDeletePOline').val();
    var sttPOLine = $('#hdnPOLineId_' + str).val();
    $('#' + str).remove();
    $.ajax({
        url: APIUrlfunDeletePOLine + '?POLineId=' + sttPOLine,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (sttPOLine, response) {
        delete objAtlasAPPO.objPOLines[str]; // Delete our POLine object
        objAtlasAPPO.CalculateLineAmount();
        funDeletePOLineSucess(response);
    }.bind(sttPOLine))
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funDeletePOLineSucess(response) {
    $('#DeletePOlinePopup').hide();
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
       TransDetailSucess(response, values, Name);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
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
            // #1850 bug on tab through
            //if (!ui.item) {
            //    $(this).val('');
            //    // $('#f').val('');
            //    $(this).removeAttr('TransValueId');
            //    $(this).val('');
            //}
        }
    })
}
function funBlurTrans(value, Name) {
    let strtextval = '';
    if (GlbTransList.length == 0) {
    } else {
        strtextval = $('#txt_' + Name + '_' + value).val();
    }

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
        //$('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
        //$('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);
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
        GetOptionalSucess(response, values, SegmentP);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
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
            if (!ui.item) { }
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

function IscheckedfunSavePO() {
    let requiredcount = $('.field-Req').length;
    if (requiredcount > 0) {
        $('#breadcrumbVendorLi').notify('Please fill the required fields with valid data');
        return;
    }

    var checkstatus = 0;
    var isvalid = hasZeroValues($('.clsTr'));
    if (isvalid > 0) {
        for (var i = 0; i < StrPOlineStatus.length; i++) {
            if (StrPOlineStatus[i].POCloseStatus == 1) {
                checkstatus++;
            }
        }
        var strclsTr = $('.clsTr');
        for (var i = 0; i < strclsTr.length; i++) {
            var strId = strclsTr[i].id;
            if ($('#hdnPOLineId_' + strId).val() == 0) {
                checkstatus = 0;
            }
        }

        if (checkstatus > 0) {
            funSavePO();
            return;
        } else {
            $('#ConfirmPopupZero').show();
            $("#PopupYesPress").focus(); // Set focus to the [Yes] button
        }
    } else {
        funSavePO('posted');
    }
}

function RemoveLastLine() {
    RemoveZeroLines($('.clsTr'), funJEDeleteRow, funDeletePOLine)
    //  RemoveZeroLines($('.clsTr'), funJEDeleteRow, funDeletePOLine)

    //$('.clsTr').each(function (i,val) {
    //    var strvalue = $('#txtAmt_' + $(this).attr('id')).val();
    //    if (parseInt(strvalue)== 0)  {
    //        console.log($(this).attr('id'));
    //        funJEDeleteRow($(this).attr('id'));
    //        funDeletePOLine();
    //    }
    //});
    $('#ConfirmPopupZero').hide();
    funSavePO('posted');
}

function funSavePO() {
    objAtlasAPPO.CalculateLineAmount();
    $('#ConfirmPopupZero').hide();
    window.onbeforeunload = null;
    var strvalTotal = 0;
    var isvalid = "";
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

    isvalid += CheckRequired($("#txtPODate"));
    isvalid += CheckRequired($("#txtPONumber"));
    isvalid += CheckRequired($("#txtDescription"));

    if ($('#chkThirdParty').prop("checked")) {
        isvalid += CheckRequired($('#txtThirdParty'));
    } else {
        //  isvalid += CheckRequired($('#txtVendor'));
    }

    var strval = $('#lblNewBalance').text();
    var strBlance = $('#lblNewBalance').text();

    if (isvalid === '') {
        var strval = $('#lblNewBalance').text().replace(/,/g, '');
        var strBlance = parseFloat($('#lblNewBalance').text().replace(/,/g, ''));
        var strtxtBal = parseFloat(numeral($('#txtAmount').val())._value); //.replace(/,/g, ''));
        if (numeral(strtxtBal).format('0,0.00') === numeral(objAtlasAPPO.LineAmount).format('0,0.00')) {

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
                // VendorID = 0;
                // VendorName = $('#txtThirdParty').val();
                ThirdParty = 1;
            } else {
                //VendorName = $('#txtVendor').val();
                //VendorID = $('#hdnVendorID').val();
                ThirdParty = 0;
            }
            var PoNo = $('#txtPONumber').val();
            var CLOSEPO = 0;

            if ($('#chkClosePO').prop("checked")) {
                CLOSEPO = 1;
            } else {
                CLOSEPO = 0;
            }
            objAtlasAPPO.ClosedPeriodID = $('#ddlClosePeriod').val();

            ////////////////////////////////////////////////////////////////////////// JE
            var objPOEntry = {
                POID: localStorage.EditPONo
                     , PONumber: PoNo
                       , CompanyID: $('select#ddlCompany option:selected').val()
                       , VendorID: VendorID
                       , VendorName: VendorName
                       , ThirdParty: ThirdParty
                       , WorkRegion: ''
                       , Description: $('#txtDescription').val()
                //                       , OriginalAmount: $('#lblNewBalance').html()   NO IDEA WHY THIS IS HERE

                       , AdjustmentTotal: 0
                       , RelievedTotal: $('#txtAmount').val()
                       , BalanceAmount: $('#txtAmount').val()

                       , BatchNumber: BatchManager.BatchNumber
                       , ClosePOuponPayment: CLOSEPO
                       , Payby: 'Check'
                       , Status: 'Open'
                       , CreatedBy: localStorage.UserId
                       , ProdID: localStorage.ProdId
                       , PODate: $('#txtPODate').val()
                       , ClosePeriodId: objAtlasAPPO.ClosedPeriodID //$('#ddlClosePeriod').val()
                       , RequiredTaxCode: $('#ChkOverride').prop('checked')
            }
            ////////////////////////////////////////////////////////////////////////// JE End

            var DAmount = $('.DebitClass');
            var Desc = $('.CreditClass');
            var Note = $('.clsNotes');
            var strCOACode = $('.clsCOACode');
            var strCOAId = $('.clsCOAId');
            var strTr = $('.clsTr');
            var TParty = $('.thirdPVendor');
            var TclsTax = $('.clsTax');
            var TclsPOLine = $('.clsPOLine');
            var TclsOA = $('.clsOA');
            var TclsNewA = $('.clsNewA');
            for (var i = 0; i < strTr.length; i++) {
                var strId = strTr[i].id;
                var TransString = '';
                var strSet = '';
                var strSeires = '';
                var strLineStatus = '';

                var strOption = $('.clsOtional' + i);
                for (var j = 0; j < strOption.length; j++) {
                    var strid = strOption[j].id;
                    var strAccountId = $('#' + strid).attr('AccountId');
                    if (j == 0) {
                        strSet = strAccountId;
                    }
                    else if (j == 1) {
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
                    }
                }
                var strpoCheck = $('.clspoCheck' + strId);
                for (var j = 0; j < strpoCheck.length; j++) {
                    var strId = strpoCheck[j].id;
                    if ($('#' + strId).is(':checked')) {
                        strLineStatus = 'Closed';
                    }
                    else {
                        strLineStatus = 'Open';
                    }
                }
                TransString = TransString.slice(0, -1);

                var FDebitAmount = DAmount[i].value;
                var Description = Desc[i].value;
                var FstrCOACode = strCOACode[i].value;
                var FstrCOAId = strCOAId[i].value;
                var FclsTax = TclsTax[i].value;
                var FTclsPOLine = TclsPOLine[i].value;
                var FTclsOA = TclsOA[i].value;
                var FTclsNewA = TclsNewA[i].value;
                var FManualAdjustment = 0;
                var FAdjustmentTotal = 0;
                var FDisplayAmount = 0;
                var FAvailabletoRelieve = 0;

                //FDifference = FTclsOA - FDebitAmount;
                if (FTclsPOLine == 0) {
                    FManualAdjustment = 0;
                    FAdjustmentTotal = 0;
                    FDisplayAmount = FDebitAmount;
                    FAvailabletoRelieve = FDebitAmount;
                } else {
                    FDebitAmount = FDebitAmount.replace(/,/g, '');
                    FTclsNewA = FTclsNewA.replace(/,/g, '');

                    FManualAdjustment = FDebitAmount - FTclsNewA;
                    FAdjustmentTotal = FTclsNewA - FDebitAmount;
                    FDisplayAmount = FTclsNewA - FDebitAmount;
                    FAvailabletoRelieve = FTclsNewA - FDebitAmount;
                }
                var TPV = '';

                var objPODetail = {
                    JournalEntryId: ''
                                     , POLineId: FTclsPOLine
                                    , POID: localStorage.EditPONo
                                    , COAID: FstrCOAId
                                    , Amount: FDebitAmount
                                    , ManualAdjustment: FManualAdjustment
                                    , ClearedAmount: 0
                                    , AdjustMentTotal: FAdjustmentTotal
                                    , RelievedTotal: FDisplayAmount
                                    , AvailToRelieve: FDebitAmount
                                    , DisplayAmount: FDebitAmount
                                    , LineDescription: Description
                                    , POLinestatus: strLineStatus
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
            $.ajax({
                url: APIUrlSavePO,
                cache: false,
                type: 'POST',
                //async: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(finalObj),
            })
            .done(function (response) {
                funSaveJESucess(response);
            })
            .fail(function (error) {
                ShowMSG(error);
            })

        } else {
            ShowMsgBox('showMSG', 'Amount and PO line amount not same', '', 'failuremsg');
            $('#txtAmount').select();
        }
    } else {
        if (strvalTotal != 0) {
            ShowMsgBox('showMSG', 'Amount and PO line amount not same', '', 'failuremsg');
        } else {
            var Msg = 'Please Fill All required  Information First !!';
            ShowMsgBox('showMSG', Msg, '', 'failuremsg');
        }
    }
}

function funSaveJESucess(response) {
    formmodified = 0;
    ShowMsgBox('showMSG', 'Purchase Order Updated Successfully ..!!', '', '');
    window.location.href = 'PurchaseOrder';
}

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

    //for (var i = 0; i < ArrTransCode.length; i++)
    //{
    //    var strval = $('#txt_' + ArrTransCode[i].TransCode + '_' + value).val();
    //    var strId = $('#txt_' + ArrTransCode[i].TransCode + '_' + value).attr('transvalueid');

    //    $('#txt_' + ArrTransCode[i].TransCode + '_' + TrId).val(strval);
    //    $('#txt_' + ArrTransCode[i].TransCode + '_' + TrId).attr('transvalueid', strId);
    //}
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
        if (ArrSegment[i].SegmentName == 'Detail') {
            var stri = i - 1;
            $('#txt_' + TrId + '_' + stri).select();
        }
    }
    var strdesc = $('#txtDesc_' + value).val();
    $('#txtDesc_' + TrId).val(strdesc);

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
                //$('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
                //$('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);

            }
        }
    } else {
        //$('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
        //$('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);
    }
}

$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        funTrCreate(1);
    }
});

function ShowDeletePopup() {
    $('#DeletePopup').show();
    $('#fade').show();
}

function funDelete() {
    //if (strStatus == 'Open') {
    $.ajax({
        url: APIUrlDeletePoById + '?POId=' + localStorage.EditPONo,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funDeleteSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
    //}
    //else {

    //}
}

function funDeleteSucess(response) {
    $(location).attr('href', 'PurchaseOrder');
}

function ForCompanyPOStartVal() {
    $.ajax({
        url: APIUrlCompanyPOStartVal + '?companyCode=' + $('#ddlCompany').find('option:selected').text(),
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
}

function ForCompanyPOStartValSucess(response) {
    strCOAccId = 0;
    strCOAccCode = 0;
    if (response.length > 0) {
        strCOAccId = response[0].COAId;
        strCOAccCode = response[0].COACode;
    }
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(objAtlasAPPO.ClosedPeriodID));
    //funGetClosePeriodDetail();
}

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
    .done(function (response) {
        GetClosePeriodDetailSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetClosePeriodDetailSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
    $('#ddlClosePeriod').val(strClosePeriodId);
    GetAmountValue();
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

$('#txtAmount').blur(function () {
    var strval = $('#txtAmount').val();
    strval = (strval + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    $('#txtAmount').val(strval);
    $('#txtAmount').attr('style', 'width: 65%;');
})

function funCancel() {
    window.location.replace(HOST + "/AccountPayable/AddPurchaseOrder");
}

$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 83) {
        IscheckedfunSavePO();
    }
});

//=============================================== Close PO
function CloseOpenPO(value) {
    if (value == 'Close') {
        $('#ClosePopupPO').show();
    } else {
        $('#OpenPopupPO').show();
    }
}

function funClosePO(Value) {
    if (Value == 'Yes') {
        $.ajax({
            url: APIUrlfunClosePO + '?POId=' + localStorage.EditPONo + '&prodId=' + localStorage.ProdId + '&status=' + 'Closed',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            funClosePOSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    } else {
        $('#ClosePopupPO').hide();
    }
}

function funClosePOSucess(response) {
    window.location.href = 'PurchaseOrder';
}

function funOpenPO(value) {
    if (value == 'Yes') {
        $.ajax({
            url: APIUrlfunClosePO + '?POId=' + localStorage.EditPONo + '&prodId=' + localStorage.ProdId + '&status=' + 'Open',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
      .done(function (response) {
          funOpenPOSucess(response);
      })
      .fail(function (error) {
          ShowMSG(error);
      })
    } else {
        $('#OpenPopupPO').hide();
    }
}

function funOpenPOSucess(response) {
    $('#OpenPopupPO').hide();
    $('#btnClose').show();
    $('#btnOpen').hide();
    $('#btnSavePO').show();
    window.location.href = 'PurchaseOrder';
}

//=============================================== Close PO End
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

//===================
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

//===============================================
function funTaxCode(value) {
    //clsTax
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
    });
}


$('#tblManualEntryTBody').delegate('.ClsDescription', 'keydown', function (event) {
    var strRowcount = $('#tblManualEntryTBody tr:last').attr('id');
    var key = event.which || event.keyCode;
    if (event.which === 9) { // Tab from last field adds new line
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

$('#tblManualEntryTBody').delegate('.DebitClass', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    //if (event.which === 9) {
    //    if (event.shiftKey === true && key === 9) {

    //    } else {

    //        var $this = $(this)
    //        funTrCreate();
    //        var strId = $this.attr('id');
    //        var strSplit = strId.split('_');
    //        funSetPreviousRecord(strSplit[1]);
    //    }
    //}
    //else
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
        }
        else {
            //alert('No roew');
        }
    }

})


$('#tblManualEntry').on('change', 'input, select, textarea', 'change keyup"', function () {
    formmodified = 1;
});

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
        FillRefVendorSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
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