var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlGetInvoiceDetail = HOST + "/api/POInvoice/GetListOfInvoiceById";
var APIUrlGetInvoiceLineDetail = HOST + "/api/POInvoice/GetInvoiceLineDetailById";
var APIUrlGetPONumber = HOST + "/api/POInvoice/GetPONumber";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlGetVendorAddress = HOST + "/api/POInvoice/GetVendorAddress";
var APIUrlFillPOLines = HOST + "/api/POInvoice/GetPOLinesNotInInvoice";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlGetInvoiceNo = HOST + "/api/POInvoice/GetInvoiceNoByCompanyCode";

var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";

var APIUrlDeleteInvoiceLine = HOST + "/api/POInvoice/DeleteInvoiceLine";
var APIUrlSaveInvoice = HOST + "/api/POInvoice/SaveInvoice";
var APIUrlDeleteInvoiceByInvoiceId = HOST + "/api/POInvoice/DeleteInvoiceByInvoiceId";
var APIUrlInvoiceReversed = HOST + "/api/POInvoice/JEReverseByInvoice";

var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlCheckInvoiceNumberVendorId = HOST + "/api/POInvoice/CheckInvoiceNumberVendorId";
var APIUrlFillBankDetails = HOST + "/api/POInvoice/GetBankInfoByCompanyId";
var APIUrlFillRefVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";

var APIUrlCheckInvoiceReversed = HOST + "/api/POInvoice/CheckJEReverseByInvoice";


/////////
var strClosePeriodId = 0;


var strCOACompanyId = 0;
var strCOAcompanyCode = '';
var strCompanyid = 0;
var StrVendorID = 0;
var strSaveInvoice = 0;

var strTrCount = 0;
var strvendorCount = 0;
var ArrSegment = [];
var ArrOptionalSegment = [];

var ArrTransCode = [];
var strClosePeriodId = 0;
var strClearringAccountFlag = '';

var GlbTransList = [];
var ssDefaultDropdown = '';
var ssWarning = '';
var ssRequired = '';
var strInvoiceStatus = '';

var strPaymentStatus = '';
var ArrDeleteInvoiceLineDetail = [];
var GetVendorNamePO = [];

var ShowPODetail_lineindex = 0;

var iInvoiceId = 0;
var oPrevNextInvoiceId = [];
var iPrevNextIndx = 0;

var objInvoice;
/*
GetSegmentsDetails > GetTransactionCode > GetInvoiceDetail
*/
//#T9
var AutoDisplayPODialog = false;
var AtlasInvoice;
var TCodes = []; //AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON;
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

            //$(obj).bind('rowAdd', function (event, objLine) {
            //    console.log(objLine);
            //});
        }
    }

    ProcessLines() {
        this.Lines.children().each((i, e) => {
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


$(document).ready(function () {
    // #T9
    AtlasInvoice = new AtlasDocumentOLD('Invoice', 'InvoiceHeader', 'tblManualEntryTBody');

    objInvoice = undefined;
    oPrevNextInvoiceId = JSON.parse(localStorage.getItem("Invoices"));
    GetTaxCodeList();
    //$('.w2ui-field').w2field('float'); //INVALID
    $('#UlAccountPayable li').removeClass('active');
    $('#LiInvoice').addClass('active');
    if (localStorage.EditInvoiceId === undefined) {
        window.location.replace(HOST + "/AccountPayable/PendingInvoice");
    } else {
        setCurrentId(localStorage.EditInvoiceId);
        GetSegmentsDetails();
    }
    $('#btncancelinvoice').prop('disabled',true);

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

// #T9
function AtlasPasteAfter(option) {
    GetAmountValue(-1);
}
// #T9
function PasteClear() {
    let elist = $(`#${AtlasPaste.Config.DestinationTable()}`).find('tr').filter(function(e,i) { return $(i).data('action') === 'existing'});
    elist.each(function(e) {
        let JEID = elist[e].id
        funJEDeleteRow(JEID, true);
    });

    // Now clear anything that was added during an edit
    $(`#${AtlasPaste.Config.DestinationTable()}`).empty();
}


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
        AtlasUtilities.ShowError(error);
    })
}

function GetSegmentListSucess(response) {
    ArrSegment = [];
    for (let i = 0; i < response.length; i++) {
        let ObjSegment = {
            SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode
        }
        ArrSegment.push(ObjSegment);
        if (response[i].Classification === 'Detail') {
            break;
        }
    }
    var strval = 0;
    for (let i = 0; i < response.length; i++) {

        if (strval > 0) {
            let ObjSegment = {
                SegmentId: response[i].SegmentId, SegmentName: response[i].Classification, SegmentLevel: response[i].SegmentLevel
            }
            ArrOptionalSegment.push(ObjSegment);
        }
        if (response[i].Classification === 'Detail') {
            strval++;
        }

    }
    GetTransactionCode();
}

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
        AtlasUtilities.ShowError(error);
    })
}

function GetTransactionCodeSucess(response) {
    var strHtml1 = '';
    strHtml1 += '<tr>';
    strHtml1 += '<th><input type="checkbox" id="chkPOHead" onChange="javascript:CheckAllPO();" /></th>';
    strHtml1 += '<th>Line #</th>';
    strHtml1 += '<th>PO #</th>';
    strHtml1 += '<th>Status</th>';

    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th></th>';

    //strHtml += '<th>3rd Party Vendor</th>';
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
        var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }
        ArrTransCode.push(obj);
        strHtml += '<th>' + response[i].TransCode + '</th>';
        strHtml1 += '<th>' + response[i].TransCode + '</th>';
    }
    strHtml += '<th>Description </th>';
    strHtml += '<th>Amount</th>';
    strHtml += '<th>TaxCode</th>';

    strHtml += '<th>Close</th>';
    // strHtml += '<th>Split</th>';

    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);

    strHtml1 += '<th>Balance</th>';
    strHtml1 += '<th>PO Line Description</th>';

    $('#tblPOLineThead').html(strHtml1)
    GetInvoiceDetail();
}

function funBlurTrans(value, Name) {
    //alert(value + '   ' + Name);
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
            }
            else {
                $('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);
            }
        }
    } else {
    }
}

function GetInvoiceDetail() {
    $.ajax({
        url: APIUrlGetInvoiceDetail + '?InvoiceId=' + localStorage.EditInvoiceId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetInvoiceDetailSucess(response);
    })
    .fail(function (error) {
        console.log(error);
    });
}

function GetInvoiceDetailSucess(response) {
    objInvoice = response[0];
    if (objInvoice.InvoiceStatus.toUpperCase() === 'POSTED') {
        AtlasPaste.Config.StaticColumns(["TAX CODE", "DESCRIPTION"]);
        AtlasInvoice.isPosted = true;
        $('#txtAmount').addClass('atlas-edit-0');
        $('#txtAmount').prop('disabled', true);
        $('#txtBank').addClass('atlas-edit-0');
        $('#txtBank').prop('disabled', true);
    } else {
        //#T9
        AtlasPaste.Config.StaticColumns(["AMOUNT", "VENDOR", "TAX CODE", "DESCRIPTION"]);
        AtlasPaste.Config.PastetoTable(funTrCreate);
        AtlasPaste.Config.DestinationTable('tblManualEntryTBody');
        AtlasPaste.Config.DisplayOffset({ top: 140, left: -100 });
        AtlasPaste.Config.Clearcallback(PasteClear);
        AtlasPaste.Config.AfterPastecallback(AtlasPasteAfter);
    }

    if (response.length > 0) {
        strClearringAccountFlag = response[0].ClearringAccountFlag;
        if (objInvoice.PaymentStatus !== 'NotPaid') {
            let CheckStatus = objInvoice.PaymentStatus; //(!BRStatus) ? objInvoice.PaymentStatus : (BRStatus.Status + ': ' + BRStatus.StatementDate);
            let BRStatus = JSON.parse(objInvoice.BRStatus);
            let VoidJSON = JSON.parse(objInvoice.VoidJSON);
            let divIPDBG = '#5c8fbe';
            if (CheckStatus === 'Voided') {
                divIPDBG = '#fb3640'
                CheckStatus += ` (${VoidJSON.VoidedDate.split('T')[0]})`;
            } else if (BRStatus) {
                CheckStatus = (BRStatus.Status + ': ' + BRStatus.StatementDate);
                divIPDBG = '#4cbf63'
            }

            $('#spnPaymentNumberValue').text(objInvoice.CheckNumber);
            $('#spnPaymentDateValue').text(objInvoice.PaymentDate.split('T')[0]);
            $('#spnPaymentStatusValue').text(CheckStatus);
            $('#spnPayByValue').text(objInvoice.Payby);

            $('#divInvoicePaymentDetails').css('background-color', divIPDBG);
            $('#divInvoicePaymentDetails').css('visibility', 'visible');
        }

        $('#ddlCompany').html('<option value="' + response[0].CompanyID + '">' + response[0].CompanyCode + '</option>');
        $('#txtInvoiceNumber').val(response[0].InvoiceNumber);
        $('#txtBank').val(response[0].Bankname);
        $('#hdnBank').val(response[0].BankId);
        $('#txtPODate').val(response[0].InvoiceDate);
        $('#txtVendor').val(response[0].VendorName);
        $('#hdnVendorID').val(response[0].VendorID);
        if (response[0].ThirdParty == true) {
            //   $('#chkThirdParty').prop('checked', true);

            $('#chkThirdParty').prop('checked', true);
            $('#txtThirdParty').prop('disabled', false);

        }
        $('#txtThirdParty').val(response[0].ThirdPartyName);
        var strAmount = (response[0].Amount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        $('#txtAmount').val(strAmount);


        $('#txtDescription').val(response[0].Description);
        $('#breadcrumbEditInvoice').text('Transaction # (' + response[0].TransactionNumber + ')');

        strInvoiceStatus = response[0].InvoiceStatus;
        if (response[0].InvoiceStatus.toUpperCase() === 'POSTED') {
            if (localStorage.ActiveInvoiceTab === '/AccountPayable/PostedUnpaidInvoices') {
                $('#LiAPInvoicesOpenInvoicesTab').addClass('active');

                $('#txtVendor').prop('disabled', true);
                $('#txtThirdParty').prop('disabled', true);
                $('#chkThirdParty').prop('disabled', true);
                $('#txtInvoiceNumber').prop('disabled', true);
                $('#txtBank').prop('disabled', true);
                $('#txtPODate').prop('disabled', true);
                $('#txtAmount').prop('disabled', true);
                $("#hrfAddJE").removeAttr("accesskey");

            } else {
                $('#LiPosted').addClass('active');
            }
            $('#btnSaveInvoice').hide();
            $('#btnSavePostInvoice').hide();
            $('#btnSavePostedInvoice').show();
            $('#btnInvoiceDelete').hide();
            $('#btnReverse').show();
        } else if (response[0].InvoiceStatus === 'Pending') {
            $('#LiPending').addClass('active');
            $('#btnReverse').hide();
        }

        strPaymentStatus = response[0].PaymentStatus;
        if (response[0].PaymentStatus === 'NotPaid') {
            $('#btnDelete').show();
        } else {
            $('#btnDelete').hide();
        }

        strClosePeriodId = response[0].ClosePeriodId;
        if (response[0].VendorRquired === true) {
            $('#DvVendorTax').show();
            ssRequired = response[0].VendorRquired;
        }
        if (response[0].RequiredTaxCode === true) {
            $('#ChkOverride').prop('checked', true);
        }
        ssDefaultDropdown = response[0].DefaultDropdown;

        if (response[0].MirrorStatus === '1' || response[0].MirrorStatus === '2') {
            $('#btnReverse').hide();
        }
    } else {
        window.location.href = 'PendingInvoice';
    }

    GetInvoiceNo();
    GetInvoiceLineDetail();
}

function GetInvoiceNo() {
    ///  Bank Empty

    $.ajax({
        url: APIUrlGetInvoiceNo + '?companyCode=' + $('#ddlCompany').find("option:selected").text(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response) {
         GetInvoiceNoSucess(response);
     })
     .fail(function (error) {
         AtlasUtilities.ShowError(error);
     })
}

function GetInvoiceNoSucess(response) {
    if (response.length > 0) {
        //   $('#txtInvoiceNumber').val(response[0].InvoiceNo);
        strCOACompanyId = response[0].COAId;
        strCOAcompanyCode = response[0].COACode;
        strCompanyid = response[0].CompanyId;
    }
    funGetClosePeriodDetail();
}

function funGetClosePeriodDetail() {
    if (objInvoice.InvoiceStatus.toUpperCase() === 'POSTED') {
        // Since this is a posted transaction, we will use RenderData ONLY the period of the transaction
        AtlasForms.Controls.DropDown.RenderData(
            [{
                'ClosePeriodId': objInvoice.ClosePeriodId
                , 'CompanyPeriod': objInvoice.CompanyPeriod
                , 'PeriodStatus': 'Period: '
                , 'CompanyPeriod': objInvoice.CompanyPeriod
            }]
            , AtlasForms.FormItems.ddlClosePeriod()
        );
        return;
    } else {
        AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(objInvoice.ClosePeriodId));
        return;
    }
}

function GetClosePeriodDetailSucess(response) {
    $('#ddlClosePeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
}

//=================================================== Row Creation
// #T9
function funTrCreate(objD, action, rowID) {
    objD = (objD === undefined) ? {} : objD;
    let classeditfilter = (strInvoiceStatus.toUpperCase() === 'POSTED')? 'atlas-edit-0': 'atlas-edit-1';

    action = (typeof action === 'object') ? action : { 'action': action };
    let strNote = (objD['DESCRIPTION'] === undefined) ? $('#txtDescription').val() : objD['DESCRIPTION'];
    let strCompany = $('#ddlCompany').find("option:selected").text();
    if (rowID === undefined) rowID = strTrCount;

    CheckTabVal = 1;
    if ($('#hdnVendorID').val() != '') {
        var strDes = $('#txtDescription').val();
        if ($('#ddlCompany').val() != 0) {
            var strhtml = '';
            strhtml += `<tr id="${rowID}" class="clsTr" data-trcount="${strTrCount}" data-action="${action.action}">`;
            strhtml += '<td id="tdtrdelete" style="width:30px;">';
            if (strInvoiceStatus.toUpperCase() !== 'POSTED') {
                strhtml += `<span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript: funJEDeleteRow(${strTrCount});"></i></span>`;
            }
            strhtml += '</td>';
            strhtml += `<td id="tdPODetail" class="width100"><input type="text" data-atlas-input-group="po" name="PONumber" class="PoNumber ${classeditfilter}" style="width:82%;" onfocus="javascript: fnPONumber();" onblur="javascript: ShowPODetail(${strTrCount}, true, false);" id="txtPONumber${strTrCount}"/>`;
            if (strInvoiceStatus.toUpperCase() !== 'POSTED') {
                strhtml += `<a href="javascript: ShowPODetail(${strTrCount}, true, true)"><i style="color: #blue" id="aDetail${strTrCount}" class="${classeditfilter} fa fa-chevron-right ArrowCls"></i></a>`;
            }
            strhtml += `<input type="hidden" data-atlas-input-group="po" name="POID" id="hdnPOID_${strTrCount}" class="clsPOId"></td>`;
            for (var i = 0; i < ArrSegment.length; i++) {
                let fieldvalue_default = '';
                let SegmentName = ArrSegment[i].SegmentName;
                if (Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName]).length === 1) {
                    fieldvalue_default = AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName][Object.keys(AtlasUtilities.SEGMENTS_CONFIG[ArrSegment[i].SegmentName])[0]].AccountCode;
                }

                if (SegmentName == 'CO') {
                    strhtml += `<td id="td${SegmentName}" class="width40 input-segment"><input type="text" data-atlas-input-group="segment" name="${SegmentName}" class="atlas-edit-0 detectTab input-required" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},'${SegmentName}',${i});" onfocus="javascript: funSegment(${strTrCount}, '${SegmentName}',${i});" id="txt_${strTrCount + '_' + i}" coacode="${strCOAcompanyCode}" coaid="${strCOACompanyId}" value="${strCOAcompanyCode}" disabled/></td>`;
                } else if (SegmentName == 'DT') {
                    strhtml += `<td id="td${SegmentName}" class="width100 input-segment"><input type="text" data-atlas-input-group="segment" name="${SegmentName}" value="${AtlasPaste.FillFieldValue(objD, SegmentName, fieldvalue_default)}" class="${classeditfilter} detectTab input-required form-segment clsPaste" onfocus="javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(${strTrCount},'${SegmentName}', ${i}, this);" onblur="javascript: GetSegmentValue(${strTrCount}, '${SegmentName}', ${i});" id="txt_${strTrCount + '_' + i}"/></td>`;
                } else {
                    strhtml += `<td id="td${SegmentName}" class="width40 input-segment"><input type="text" data-atlas-input-group="segment" name="${SegmentName}" value="${AtlasPaste.FillFieldValue(objD, SegmentName, fieldvalue_default)}" class="${classeditfilter} detectTab input-required form-segment clsPaste" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},'${SegmentName}', ${i}, this);" onblur="javascript: GetSegmentValue(${strTrCount}, '${SegmentName}', ${i});" id="txt_${strTrCount + '_' + i}"/></td>`;
                }
            }

            for (var i = 0; i < ArrOptionalSegment.length; i++) {
                strhtml += `<td id="td${ArrOptionalSegment[i].SegmentName}" class="width40"><input type="text" data-atlas-input-group="segment" name="${ArrOptionalSegment[i].SegmentName}" value="${AtlasPaste.FillFieldValue(objD, ArrOptionalSegment[i].SegmentName, '')}" class="clsOtional${strTrCount} clsPaste atlas-edit-1" onblur="javascript: funCheckOptionalAutoFill(${strTrCount}, '${ArrOptionalSegment[i].SegmentName}', ${i});" onfocus="javascript: GetOptional(${strTrCount},'${ArrOptionalSegment[i].SegmentName}',${i});" id="txtOptional_${strTrCount + '_' + i}" /></td>`;
            }

            for (var i = 0; i < ArrTransCode.length; i++) {
                strhtml += `<td id="TransactionCode" class="width40"><input type="text" data-atlas-input-group="memo" name="${ArrTransCode[i].TransCode}" value="${AtlasPaste.FillFieldValue(objD, ArrTransCode[i].TransCode)}" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" class="clsPaste clsTransCode${strTrCount} clsTransCode_${strTrCount}" onfocus="javascript: funTransDetail(${strTrCount}, ${ArrTransCode[i].TransId}, '${ArrTransCode[i].TransCode}')" id="txt_${ArrTransCode[i].TransCode + '_' + strTrCount}" /></td>`;
            }

            strhtml += `<td id="tdLineDescription" class="width200"><input type="text" data-atlas-input-group="line" name="LineDescription" class="detectTab strDescription CreditClass input-required " id="txtDesc_${strTrCount}" value="${strNote}"/>`;
            //strhtml += `<input type="hidden" class="clsCOACode" id="hdnCode_${strTrCount}"/>`;
            //strhtml += `<input type="hidden" class="clsCOAId" id="hdnCOAId_${strTrCount}"/>`;
            strhtml += `<input type="hidden" class="clsInvoiceLine" name="hdnInvoiceLineId" id="hdnInvoiceLineId_${strTrCount}">`;
            strhtml += `<input type="hidden" data-atlas-input-group="po" name="POLineID" class="clsPOLine" id="hdnPOLineId_${strTrCount}"></td>`;
            strhtml += `<td id="tdAmount" class="width40"><input type="text" data-atlas-input-group="line" name="Amount" value="${AtlasPaste.FillFieldValue(objD, 'AMOUNT', '0.00')}" class="${classeditfilter} DebitClass w2field amount w2ui-field input-required" onfocusout="javascript: GetAmountValue(${strTrCount});" id="txtAmt_${strTrCount}"/></td>`;

            var ssCheck = $('#ChkOverride').prop('checked');
            let TaxCodeRequired = '';
            if (ssRequired == true && ssCheck == false) {
                TaxCodeRequired = 'input-required';
                //strhtml += '<td class="width40"><input type="text" name="TaxCode" class="clsTax detectTab input-required" name="POLineAmtt" onfocus="javascript:funTaxCode(' + strTrCount + ');" id="txtTaxCode_' + strTrCount + '" value="' + ssDefaultDropdown + '" /></td>';
                //} else {
                //    strhtml += '<td class="width40"><input type="text" name="TaxCode" class="clsTax number" name="POLineAmtt" onfocus="javascript:funTaxCode(' + strTrCount + ');"  id="txtTaxCode_' + strTrCount + '"  value="' + ssDefaultDropdown + '"/></td>';
            }

            strhtml += `<td id="tdTaxCode" class="width40"><input type="text" data-atlas-input-group="line" value="${AtlasPaste.FillFieldValue(objD, 'TAX CODE', ssDefaultDropdown)}" name="TaxCode" class="clsTax detectTab ${TaxCodeRequired}" name="POLineAmtt" onfocus="javascript: funTaxCode(${strTrCount});" id="txtTaxCode_${strTrCount}" /></td>`;
            strhtml += `<td id="tdClosePO" class="width40"><input type="checkbox" data-atlas-input-group="po" name="ClosePO" id="chkClose_${strTrCount}" class="strClearedFlag ${classeditfilter}" style="display: none;"/>`;
            strhtml += '<input type="hidden" name="POAmount" id="hdnOAmount_' + strTrCount + '"/></td>';

            strhtml += '</tr>';
            $('#tblManualEntryTBody').append(strhtml);

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

    AtlasInvoice.Lines.trigger('rowAdd', { id: strTrCount - 1 });
}

//========================================================= Segment Code

function funSegment(values, SegmentName, SegmentP) {
    $('#txt_' + values + '_' + SegmentP).removeClass('SearchCode');

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
    if (strStatus == 0) {
    } else {
        if (GlbCOAList.length > 0) {
            var strstatus = true;
            var strval = $('#txt_' + values + '_' + SegmentP).val();
            if (strval != '') {
                for (var i = 0; i < GlbCOAList.length; i++) {
                    //if (GlbCOAList[i].COANo.match(strval)) {
                    if (GlbCOAList[i].COANo.replace('-', '').match(strval) || strval == GlbCOAList[i].COANo) {
                        //if (strval == GlbCOAList[i].COANo) {
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
            } else {
                //$('#txt_' + values + '_' + SegmentP).val(GlbCOAList[0].COANo);
                //$('#txt_' + values + '_' + SegmentP).attr('COACode', GlbCOAList[0].COACode);
                //$('#txt_' + values + '_' + SegmentP).attr('COAId', GlbCOAList[0].COAID);
                //$('#hdnCode_' + values).val(GlbCOAList[0].COACode);
                //$('#hdnCOAId_' + values).val(GlbCOAList[0].COAID);

            }
            //if (strstatus == false) {
            //} else {
            //}
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
function funTransDetail(value, TransId, Name) {

    $('[id=\'txt_' + Name + '_' + value + '\']').removeClass('SearchCodeTransaction');
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
       TransDetailSucess(response, value, Name);
   })
   .fail(function (error) {
       AtlasUtilities.ShowError(error);
   })
}

function TransDetailSucess(response, value, Name) {
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

    $('[id=\'txt_' + Name + '_' + value + '\']').addClass('SearchCodeTransaction');

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
                //                $(this).val('');
                //                // $('#f').val('');
                //                $(this).removeAttr('TransValueId');
                //                $(this).val('');
            }
        }
    })
}

function funBlurTrans(value, Name) {
    //alert(value + '   ' + Name);
    var nomatch = 1;

    if (GlbTransList.length == 0) {
        // Something went wrong in the beginning
    }
    //    else
    var strtextval = $('[id=\'txt_' + Name + '_' + value + '\']').val();

    if (typeof strtextval == 'undefined') {
        nomatch = 1;
    } else if (strtextval != '') {
        for (var i = 0; i < GlbTransList.length; i++) {
            if (GlbTransList[i].TransValue.match(strtextval)) {
                // Do nothing
                //                $('#txt_' + Name + '_' + value).val(GlbTransList[i].TransValue);
                //                $('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[i].TransactionValueID);
                nomatch = 0;
                break;
            }
        }
    }
    if (nomatch == 1) {
        $('[id=\'txt_' + Name + '_' + value + '\']').val('');
        $('[id=\'txt_' + Name + '_' + value + '\']').attr('TransValueId', null);
    }

    $('[id=\'txt_' + Name + '_' + value + '\']').removeClass('SearchCodeTransaction');
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
    .done(function (response)
    {
        GetOptionalSucess(response, values, SegmentP);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
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


function GetInvoiceLineDetail() {
    $.ajax({
        url: APIUrlGetInvoiceLineDetail + '?InvoiceId=' + localStorage.EditInvoiceId + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetInvoiceLineDetailSucess(response);
    })
    .fail(function (error) {
        console.log(error);
    })

}

function GetInvoiceLineDetailSucess(response) {
    $('#tblManualEntryTBody').empty();
    strTrCount = 0; // Have to reset the global tr count
    for (let i = 0; i < response.length; i++) {
        funTrCreate({}, 'existing');

        var CoaId = response[i].COAID;
        var CoaCode = response[i].COAString;
        var straa = CoaCode.split('|');
        var SetId = response[i].SetId;
        var SetCode = response[i].SetCode;
        var SeriesId = response[i].SeriesId;
        var SeriesCode = response[i].SeriesCode;
        var Amount = response[i].Amount;
        var Des = response[i].LineDescription;
        var Transaction = response[i].TransStr;
        var InvoiceLineId = response[i].InvoiceLineID;
        var POLineId = response[i].Polineid;
        var POID = response[i].POID;
        var PONumber = response[i].PONumber;
        var strClearedFlag = response[i].ClearedFlag;
        var strstatus = 'enable';
        var taxCode = response[i].TaxCode;
        if (PONumber != null) {
            // strstatus = 'disabled';
        }

        var strCOAPval = '';
        var ssCount = strTrCount - 1;
        $('#txtPONumber' + ssCount).val(PONumber);
        $('#txtPONumber' + ssCount).prop(strstatus, true);
        if (PONumber == null) {
            $('#chkClose_' + ssCount).hide();
        } else {
            $('#chkClose_' + ssCount).show();
            $('#txtPONumber' + ssCount).val(PONumber);
            $('#txtPONumber' + ssCount).prop('disabled', true);
            $('#txtPONumber' + ssCount).prop(strstatus, true);
            $('#chkClose_' + ssCount).prop('checked', strClearedFlag);
        }
        $('#hdnPOLineId_' + ssCount).val(POLineId);
        $('#hdnPOID_' + ssCount).val(POID);

        for (var j = 0; j < ArrSegment.length; j++) {
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
                $('#txt_' + i + '_' + j).prop(strstatus, true);
            } else {
                var sLength = ssSegVal.length;
                sLength = sLength - 1;
                // ssSegVal = ssSegVal[sLength];

                $('#txt_' + i + '_' + j).val(ssSegVal[sLength]);
                $('#txt_' + i + '_' + j).attr('coacode', strCOAPval);
                $('#txt_' + i + '_' + j).prop(strstatus, true);
            }
        }

        $('#hdnCode_' + ssCount).val(CoaCode);
        $('#hdnCOAId_' + ssCount).val(CoaId);
        $('#chkClose_' + ssCount).prop('checked', strClearedFlag);

        for (var j = 0; j < ArrOptionalSegment.length; j++) {
            if (j == 0) {
                $('#txtOptional_' + ssCount + '_' + 0).val(SetCode);
                $('#txtOptional_' + ssCount + '_' + 0).attr('AccountId', SetId);
                $('#txtOptional_' + ssCount + '_' + 0).prop(strstatus, true);

            } else {
                $('#txtOptional_' + ssCount + '_' + 1).val(SeriesCode);
                $('#txtOptional_' + ssCount + '_' + 1).attr('AccountId', SeriesId);
                $('#txtOptional_' + ssCount + '_' + 1).prop(strstatus, true);
            }
        }
        var trastr = Transaction.split(',');
        for (var k = 0; k < trastr.length; k++) {
            var TraVal = trastr[k];
            var trastr1 = TraVal.split(':');
            $('#txt_' + trastr1[0] + '_' + ssCount).val(trastr1[1]);
            $('#txt_' + trastr1[0] + '_' + ssCount).attr('transvalueid', trastr1[2]);
        }
        for (var k = 0; k < ArrTransCode.length; k++) {
            $('#txt_' + ArrTransCode[k].TransCode + '_' + ssCount).prop(strstatus, true);
        }
        $('#txtAmt_' + ssCount).val(Amount);
        //  $('#txtAmt_' + ssCount).prop(strstatus, true);
        $('#hdnOAmount_' + ssCount).val(Amount);
        //$('#chkClose_' + ssCount).prop('checked', true);
        //$('.w2ui-field').w2field('float'); //INVALID
        $('#txtDesc_' + ssCount).val(Des);
        $('#hdnInvoiceLineId_' + ssCount).val(InvoiceLineId);
        $('#txtTaxCode_' + ssCount).val(taxCode);
    }

    VendorAddress();
    //funGetClosePeriodDetail();

    if (strInvoiceStatus.toUpperCase() == 'POSTED') {
        AllControlDisabled();
    }
    $('#btncancelinvoice').prop('disabled', false);
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 });
    GetAmountValue(-1); // Update the Line Amount value ONLY at the very end. Related to #1844
}

//====================================== Delete InvoiceLine
function funJEDeleteRow(value, noPopup) {
    var poLineId = $('#hdnPOLineId_' + value).val();
    var InvoiceLineId = $('#hdnInvoiceLineId_' + value);
    if (InvoiceLineId > 0) {
        $('#' + value).remove();
    } else {
        $('#hdnDeleteRowAudit').val(value);
        if (!noPopup) {
            $('#DeletePopup').show();
            $('#fade').show();
            $('#DeletePopup_YES').focus();
        } else {
            funDeleteRecordAuditTab();
        }
    }
}

function funJEZeroDeleteRow(value) {
    var poLineId = $('#hdnPOLineId_' + value).val();
    var InvoiceLineId = $('#hdnInvoiceLineId_' + value);
    if (InvoiceLineId > 0) {
        $('#' + value).remove();
    } else {
    }
}

function funDeleteRecordAuditTab() {
    var ssval = $('#hdnDeleteRowAudit').val();
    var poLineId = $('#hdnPOLineId_' + ssval).val();
    var InvoiceLineId = $('#hdnInvoiceLineId_' + ssval).val();
    if (poLineId == '') {
        poLineId = 0;
    }
    var obj = {
        POLineID: poLineId,
        InvoiceLineID: InvoiceLineId,
        InvoiceID: localStorage.EditInvoiceId
    }
    if (strPaymentStatus != 'Payment') {
        ArrDeleteInvoiceLineDetail.push(obj);
        $('#DeletePopup').hide();
        $('#fade').hide();
        var ss = $('#hdnDeleteRowAudit').val();
        $('#' + ss).remove();
        GetAmountValue(-1);                                                          // Calculation
        $('#hrfAddJE').focus();
    } else {
        ShowMsgBox('showMSG', 'Used in Payment.. !!', '', 'failuremsg');
    }
    $('#fade').hide();
}

function funDeleteInvoiceLine() {
    $.ajax({
        url: APIUrlDeleteInvoiceLine, //+ '?poLineId=' + poLineId + '&InvoiceLineId=' + InvoiceLineId + '&InvoiceId=' + localStorage.EditInvoiceId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ArrDeleteInvoiceLineDetail),
    })
    .done(function (response) {
        DeleteInvoiceLineSucess(response);
    })
    .fail(function (error) {
        console.log(error);
    })
}

function DeleteInvoiceLineSucess(response) {
    if (response == -1) {
        ShowMsgBox('showMSG', 'Used in Payment.. !!', '', 'failuremsg');
    } else {
        $('#DeletePopup').hide();
        var ss = $('#hdnDeleteRowAudit').val();
        $('#' + ss).remove();
    }
    //funSaveInvoice('Pending'); // MUST BE 'Pending' This is NOT the InvoiceStatus
    GetAmountValue(-1);
}

//===========================================PO Number 
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
        PONumberSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
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
        source: array,
        focus: function (event, ui) {

            $(this).attr('PoNumberID', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $(this).attr('PoNumberID', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                if (this.value === '') { // handle focus bug in Chrome
                    $(this).val('');
                    // $('#f').val('');
                    $(this).removeAttr('PoNumberID');
                    $(this).val('');
                }
            }
        }
    })
}

function CheckAllPO() {
    if ($("#chkPOHead").prop('checked') == true) {
        $(".poCheck").prop('checked', true);
    } else {
        $(".poCheck").prop('checked', false);
    }

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

//=========================================================== Vendor Address
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
}

//=========================================================== Save 
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 83) {
        if (strInvoiceStatus.toUpperCase() != 'POSTED') {
            GetAmountValue(-1);
            IscheckedfunSaveInvoice();
        } else if (strInvoiceStatus.toUpperCase() == 'POSTED') {
            funSaveInvoice(strInvoiceStatus)
        }
    }
});

function IscheckedfunSaveInvoice(objP) {
    objP = (typeof objP === 'object')? objP: {};
    AtlasInvoice.isClone = objP.isClone;

    $('#fade').show();
    $('#tabAddPO :input').attr('disabled', true);

    var isvalid = hasZeroValues($('.clsTr'));
    if (isvalid > 0) {
        $('#ConfirmPopupZero').show();
        $("#PopupYesPress").focus(); // Set focus to the [Yes] button
    } else {
        funSave('Pending'); // This MUST be Pending. This is not related to InvoiceStatus
    }
}

function RemoveLastLine() {
    RemoveZeroLines($('.clsTr'), funJEDeleteRow, funDeleteRecordAuditTab)

    $('#ConfirmPopupZero').hide();
    funSave(strInvoiceStatus); //'Pending');
}

function funSave(value) {
    $('#ConfirmPopupZero').hide();
    $('#ConfirmPopup').hide();
    var sstrStatus = 0;
    if (value.toUpperCase() === 'POSTED') {
        var strNB = $('#hdnNewItem').val();
        strNB = strNB.replace(/,/g, '');
        strNB = parseFloat(strNB);
        var strAmount = $('#txtAmount').val();
        strAmount = strAmount.replace(/,/g, '');
        strAmount = parseFloat(strAmount);
        if (strNB == strAmount)
            sstrStatus = 0;
        else
            sstrStatus = 1;
    }

    var isvalid = "";
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

    if ($('#chkThirdParty').prop("checked")) {
        isvalid += CheckRequired($('#txtThirdParty'));
    } else {
        isvalid += CheckRequired($('#txtVendor'), {'blur': false});
    }

    if (isvalid == '') {
        var strBlance = $('#lblNewBalance').text();
        var strtxtBal = $('#txtAmount').val();
        strBlance = parseFloat(strBlance.replace(/,/g, ''));
        strtxtBal = parseFloat(strtxtBal.replace(/,/g, ''));

        if (sstrStatus == 0) {
            if (strtxtBal == strBlance) {
                if (value.toUpperCase() === 'PENDING') {
                    //funDeleteInvoiceLine();
                    funSaveInvoice(value);
                } else if (value.toUpperCase() === 'POSTED' && strClearringAccountFlag == 'No') {
                    ShowMsgBox('showMSG', 'Before Posting this invoice please set the AP Clearing Account For associated Bank..!!', '', '');
                    /* INVALID                } else {
                                        //======================= Delete Function Sanjay
                                        funDeleteInvoiceLine();
                                        // funSaveInvoice(value);
                    */
                }
            } else {
                ShowMsgBox('showMSG', 'Invoice Line Amount and Invoice Amount do not match. You cannot save this Invoice..!!', '', 'failuremsg');
            }
        } else {
            ShowMsgBox('showMSG', 'Invoice Line Amount and Invoice Amount do not match. You cannot save this Invoice..!!', '', 'failuremsg');
        }
    } else {
        var Msg = 'Please Fill All required  Information First !!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    }

    EnableForm();
}

function EnableForm() {
    let classfilter = (strInvoiceStatus.toUpperCase() === 'POSTED')? '.atlas-edit-1': '.atlas-edit-0';

    $('#tabAddPO :input').not('.atlas-edit-0').not(classfilter).attr('disabled', false);
    $('#fade').hide();
}

function funSaveInvoice(invoicestatus) {
    let invaliddata = 0;
    var strClass = $('.input-required');
    for (var i = 0; i < strClass.length; i++) {
        var strId = strClass[i].id;
        var strvalue = strClass[i].value;

        if (strvalue == '') {
            $('#' + strId).attr('style', 'border-color: red;');
            invaliddata++;
        }
    }
    if (invaliddata > 0) {
        $('#breadcrumbEditInvoice').notify('This entry was NOT SAVED. Please correct your data and then save again.');
        return;
    }

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
        Invoiceid: (AtlasInvoice.isClone)? 0: localStorage.EditInvoiceId, // Use zero for cloning
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
        InvoiceStatus: (AtlasInvoice.isClone)? 'Pending': strInvoiceStatus,
        CreatedBy: localStorage.UserId,
        ProdID: localStorage.ProdId,
        Amount: $('#txtAmount').val(),
        ClosePeriodId: $('#ddlClosePeriod').val(),
        RequiredTaxCode: $('#ChkOverride').prop('checked')
    }
    ArrInvoiceLine = [];
    debugger;

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
        //console.log(objLine);
        let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objLine);
        if (COAID === undefined || COACode === undefined) {
            Object.keys(SegCheck).forEach((seg) => {
                if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(e).find(`td.input-segment [name=${seg}]`).notify('Invalid Account');
                $(e).find(`td.input-segment [name=${seg}]`).addClass('field-Req');
            });
            invaliddata++;
        }
        let SetID;
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

        if (objLine.TaxCode !== '' && TaxCodes.find(function(e){ return (e.TaxCode === objLine.TaxCode); }) === undefined) {
            // Invalid Tax Code provided
            $($(e.children.tdTaxCode).find('input')[0]).notify('Invalid Tax Code');
            $($(e.children.tdTaxCode).find('input')[0]).addClass('field-Req');
            invaliddata++
        }

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
            InvoiceLineID: (AtlasInvoice.isClone)? 0: objLine.hdnInvoiceLineId, // Use zero for cloning
            InvoiceID: (AtlasInvoice.isClone)? 0: localStorage.EditInvoiceId, // Use zero for cloning
            COAID: COAID,
            Amount: numeral(objLine.Amount).format('0.00'),
            LineDescription: objLine.LineDescription,
            InvoiceLinestatus: (AtlasInvoice.isClone)? 'Pending': strInvoiceStatus,
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

    if (invaliddata > 0 ) {
        EnableForm();
        $('#breadcrumbEditInvoice').notify('This entry was NOT SAVED. Please correct your data and then save again.');
        $('#fade').hide();
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

    //console.log(FinalObj);
    //return;

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
        funSaveInvoice1(response, strInvoiceStatus);
    })
    .fail(function (error) {
        ShowMSG(error);
    })

    return 1;
}

function funSaveInvoice1(response, value) {
    funDeleteInvoiceLine(); // Delete the lines after we know the save is good

    $('#spanInvoiceAction').text((AtlasInvoice.isClone)? 'CLONED': 'SAVED');
    $('#breadcrumbEditInvoice').notify(`Invoice ${(AtlasInvoice.isClone)? 'CLONED': 'SAVED'}`, 'success');
    $('#spanTRNumber').text(response);
    $('#ConfirmPopupPO').hide();
    $('#fade').show();
    $('#SaveInvoiceSuccess').show();
    $('#btnSaveOK').focus();

    if (value.toUpperCase() !== 'POSTED') {
        formmodified = 0;
    }

    if (AtlasInvoice.isClone) {
        $('#InvoiceSaveMessageAdditional').text('You will remain on the existing Invoice. To view the CLONE Invoice, you should go back to the Unposted tab and edit that Invoice');
    }

    AtlasInvoice.isClone = false;
}

function funSaveInvoiceSuccess() {
    EnableForm();
    //$('#tabAddPO :input').attr('disabled', false);
    $('#fade').hide();

    formmodified = 0;
    $('#SaveInvoiceSuccess').hide();
    //$('#tabAddPO :input').attr('disabled', false);
    $('#fade').hide();
}

function ReturnFocus(obj) {
    EnableForm();
    $('#txt_' + ShowPODetail_lineindex + '_1').focus();
}

//===========================================================  PO Detail
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
        AtlasUtilities.ShowError(error);
    })
}

function GetPOLinesSucess(response) {
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
            strHtml += '<td>' + response[i].POLinestatus + '</td>';

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
            var StrAmount1 = '$ ' + parseFloat(response[i].Amount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            strHtml += '<td>' + StrAmount1 + '</td>';
            strHtml += '<td>' + response[i].LineDescription + '</td>';
            strHtml += '</tr>';
        }
    } else {
        var strHtml = '';
        strHtml += '<tr>';
        strHtml += '<td colspan="12" style="text-align: center;">All PO Lines are Invoiced already ..! </td>';
        strHtml += '</tr>';
        $('#tblPOLineTBody').html('<tr><th>Purchase Line </th></tr>');
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

    for (var i = 0; i < response.length; i++) {
        var TransactionvalueString = response[i].TransStr;
        var TvstringSplit = TransactionvalueString.split(',');

        for (var j = 0; j < TvstringSplit.length; j++) {
            var strTvs = TvstringSplit[j].split(':');
            $('#spn_' + strTvs[0] + '_' + i).text(strTvs[1]);
            $('#spn_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);
        }
    }

    if (strInvoiceStatus == "Posted") { $('.btnVendor').css("display", "none"); }
}

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
        if ($(`#${ShowPODetail_lineindex}`).length === 0) {
            funTrCreate();
        }
        console.log(ShowPODetail_lineindex);
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

//============================================================ Close Period
/*
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
        AtlasUtilities.ShowError(error);
    })
}

function GetClosePeriodDetailSucess(response) {
    var cc = '';
    var NewStatus = '';
    $('#ddlClosePeriod').html('');
    for (var i = 0; i < response.length; i++) {
        if (strClosePeriodId == response[i].ClosePeriodId) {
            cc = 'OK';
        } else {
            if (response[i].PeriodStatus == 'Current') {
                NewStatus = response[i].ClosePeriodId;
            }
        }
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
    if (cc == 'OK') {
        $('#ddlClosePeriod').val(strClosePeriodId);
    } else {
        $('#ddlClosePeriod').val(NewStatus);
    }

    GetAmountValue(-1);
}
*/

$('#txtAmount').blur(function () {
    //var strval = $('#txtAmount').val();
    //strval = (strval + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    //$('#txtAmount').val(strval);
    $('#txtAmount').attr('style', 'width: 65%;');
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
                if (strInvoiceStatus.toUpperCase() !== 'POSTED') {
                    funTrCreate();
                    funSetPreviousRecord(strSplit[1]);
                }
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
    }

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
    formmodified = 0;
    $('form *').change(function () {
        formmodified = 1;
    });
    //window.onbeforeunload = confirmExit;
    function confirmExit() {
        if (formmodified == 1) {
            return "You are about to cancel your form. All your data will be lost. Are you sure you want to do this?";
        }
    }
    $("input[name='commit']").click(function () {
        formmodified = 0;
    });
});

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

////===  =============================== Delete Invoice
function ShowDeletePopup() {
    $('#fade').show();
    $('#DeletePopupInvoice').show();
    var strInvoice = $('#txtInvoiceNumber').val();
    $('#SpnInvoiceNumber').text(strInvoice);
    //  $('#hdnInvoiceId').val(localStorage.EditInvoiceId);
}
function funDeleteInvoice(value) {
    if (value == 'No') {
        $('#DeletePopupInvoice').hide();
        $('#fade').hide();
        //   $('#hdnInvoiceId').val(0);
    } else {
        $.ajax({
            url: APIUrlDeleteInvoiceByInvoiceId + '?InvoiceId=' + localStorage.EditInvoiceId + '&ProdId=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            funDeleteInvoiceSucess(response);
        })
        .fail(function (error) {
            console.log(error);
        })
    }
}

function funDeleteInvoiceSucess(response) {
    window.location.href = 'PendingInvoice';
}

function funCancelInvoice() {
    if (strInvoiceStatus == 'Pending') {
        window.location.replace(HOST + "/AccountPayable/PendingInvoice");
    } else {
        let ActiveInvoiceTab = localStorage.ActiveInvoiceTab;
        localStorage.ActiveInvoiceTab = '';
        if (ActiveInvoiceTab == undefined || ActiveInvoiceTab == '')
            window.location.replace(HOST + '/AccountPayable/PostInvoice');
        else
            window.location.replace(HOST + ActiveInvoiceTab);
    }
}

function InvoiceReversed() {
    $.ajax({
        url: APIUrlInvoiceReversed + '?InvoiceId=' + localStorage.EditInvoiceId + '&ReIssue=' + $('#ChkReIssue').prop('checked'),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        InvoiceReversedSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.LogError(error);
    });
}

function InvoiceReversedFinal() {
    CheckInvoiceReversed();
}

function InvoiceReversedSucess(response) {
    if (response === -9) { // There is a payment involved with this Invoice
        $('#fade').show();
        $('#DivDelete').hide();
        $('#DivAlert').show();
    } else {
        $('#DivDelete').hide();
        if (response === 0) {
        } else {
            $('#spanTRNumber').text(response);
            $('#ConfirmPopupPO').hide();
            $('#SaveInvoiceSuccess').show();
            $('#btnSaveOK').focus();
        }
    }
}

function AllControlDisabled() {
    $('#hrfAddJE').hide();

    $('#txtAmount').prop('disabled', true);
    $('#ChkOverride').prop('disabled', true);
    $('#ddlClosePeriod').prop('disabled', true);
    var Tcount = $('#tblManualEntryTBody tr').length;

    for (var i = 0; i < Tcount; i++) {
        $('#txtPONumber' + i).prop('disabled', true);

        for (var j = 0; j < ArrSegment.length; j++) {
            $('#txt_' + i + '_' + j).prop('disabled', true);
        }
        for (var j = 0; j < ArrOptionalSegment.length; j++) {
            $('#txtOptional_' + i + '_' + j).prop('disabled', true);
        }
        for (var j = 0; j < ArrTransCode.length; j++) {

            $('#txt_' + ArrTransCode[j].TransCode + '_' + i).prop('disabled', false);
        }
        $('#txtTaxCode_' + i).prop('disabled', false);
        $('#txtAmt_' + i).prop('disabled', true);
        $('#txtDesc_' + i).prop('disabled', false);
    }

}

function funhideAlert() {
    $('#fade').hide();
    $('#DivAlert').hide();
}

function funhideDiv(value) {
    if ('DivDelete' == value) {
        $('#DivDelete').hide();
    }
}


// JE Trigger name ------ JECreationOnPosted

//=============================================================//
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
    .done(function (response) {
        FillVendorSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
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
    // GetSegmentsDetails();
}

function funCheckInNumber() {
    if ($('#hdnVendorID').val() != '') {
        $.ajax({
            url: APIUrlCheckInvoiceNumberVendorId + '?InvoiceNumber=' + $('#txtInvoiceNumber').val().trim() + '&InvoiceId=' + localStorage.EditInvoiceId + '&VendorId=' + $('#hdnVendorID').val() + '&ProdId=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            funCheckInNumberSucess(response);
        })
        .fail(function (error) {
            AtlasUtilities.ShowError(error);
        })
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
        FillBankDetailsSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
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
                //$(this).val('');
                //$("#hdnBank").val('');
                //$('#txtBank').val('');
            }
        }
    })
}

//=======================//
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

function ThirdParty() {
    if ($('#chkThirdParty').prop("checked")) {
        $("#txtThirdParty").removeAttr("disabled");
        $('#txtVendor').attr('style', 'border-color:#d2d6de;');
    } else {
        //$("#txtVendor").removeAttr("disabled");
        $("#txtThirdParty").attr("disabled", "disabled");
        $('#txtThirdParty').val('');
        $('#txtThirdParty').attr('style', 'border-color:#d2d6de;');
    }
}

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
        AtlasUtilities.ShowError(error);
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

//==================================================//
function fun1Segment123(values, SegmentName, SegmentP) {
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
    })
    .fail(function (error) {
        console.log(error);
    })
}

function CheckInvoiceReversed() {
    $.ajax({
        url: APIUrlCheckInvoiceReversed + '?InvoiceId=' + localStorage.EditInvoiceId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CheckInvoiceReversedSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    });
}

function CheckInvoiceReversedSucess(response) {
    if (response === 1) { // sp returns 1 if a Payment exists; 0 otherwise
        $('#fade').show();
        $('#DivAlert').show();
    } else if (response === 0) {
        $('#DivDelete').show();
    }
}

function funPrevNext(index) {
    if (index == 0) $('#prev').hide(); else $('#prev').show();
    if (index == oPrevNextInvoiceId.length - 1) $('#next').hide(); else $('#next').show();

    var InvoiceId = oPrevNextInvoiceId[index];
    localStorage.EditInvoiceId = InvoiceId;
    GetInvoiceDetail();
}

function setCurrentId(Id) {
    $.each(oPrevNextInvoiceId, function (index, value) {
        var InvoiceId = value;
        if (InvoiceId == Id) { iPrevNextIndx = index; }
    });
}

// Moved to AtlasUtilities so that it can be implemented on any page.
//$(window).keydown(function (e) {
//    if (e.altKey) {
//        switch (e.keyCode) {
//            case 37:
//                $("#prev").trigger("click");
//                e.preventDefault();
//                break;
//            case 39:
//                $("#next").trigger("click");
//                e.preventDefault();
//                break;
//        }
//    }
//});

$('#prev').click(function () {

    if (iPrevNextIndx != 0) {
        iPrevNextIndx--;
        funPrevNext(iPrevNextIndx);
    }
});

$('#next').click(function () {
    iPrevNextIndx++;
    funPrevNext(iPrevNextIndx);
});

// #T9
$(document).keydown(function (e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        hideDiv('dvPOLines', 'hrfAddJE');
        ReturnFocus(this);
    }
});

var ShowSegmentNotify = function (sMessage) {
    var sControlName = $("#ddlCompany option:selected").text();
    if (strvCOACode != "") {
        var tempCoaCus = strvCOACode.split("|");
        if (tempCoaCus[0] != sControlName) {
            $.notify(sMessage, "warn");
        }
    }
}
