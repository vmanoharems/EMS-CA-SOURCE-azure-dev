var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlGetTransactionNumber = HOST + "/api/Ledger/GetTransactionNumber";

var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
//var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlSaveJE = HOST + "/api/Ledger/SaveJE";
var APIUrlFillCompanyFirst = HOST + "/api/AccountPayableOp/GetDedaultCOLO";
//
var ArrSegment = [];
var ArrOptionalSegment = [];
var ArrTransCode = [];
var GlbTransList = [];
var strTrCount = 0;
var strJECount = 0;
var strSaveCount = 0;
var strJournalEntryId = 0;
var strResponse = [];

var TcodesFound = false;
//

$(document).ready(function () {
    GetTaxCodeList();
    FillCompanyFirst();
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;

    var curr_year = d.getFullYear();
    if (curr_date.toString().length == 1) {
        curr_date = '0' + curr_date;
    }

    if (curr_month.toString().length == 1) {
        curr_month = '0' + curr_month;
    }

    var Date1 = curr_month + '/' + curr_date + '/' + curr_year;
    $('#txtTransactionDate').val(Date1);
    FillCompany();
    GetSegmentsDetails();

    AtlasPaste.Config.StaticColumns(["DEBIT", "CREDIT", "VENDOR", "TAXCODE", "DESCRIPTION"]);
    AtlasPaste.Config.PastetoTable(funTrCreate);
    AtlasPaste.Config.DestinationTable('tblManualEntryTBody');
    AtlasPaste.Config.DisplayOffset({top:140, left:-100});
    AtlasPaste.Config.Clearcallback(PasteClear);
    AtlasPaste.Config.AfterPastecallback(funCalculation);

    AtlasCache.CacheORajax({
        'URL': AtlasCache.APIURLs.AtlasConfig_TransactionCodes
        , 'doneFunction': function (response) { TcodesFound = true; }
        , bustcache: true
        , callParameters: { callPayload: JSON.stringify({ ProdID: localStorage.ProdId }) }
        , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        , 'cachebyname': 'Config.TransactionCodes'
    })

// Scrolling JE distribution
    AtlasJE.Config.BodyTable('tblManualEntry');
    AtlasJE.Config.BodyTableth('tblManualEntryThead');
    AtlasJE.Config.BodyTabletbody('tblManualEntryTBody');
    AtlasJE.Config.BodyTablediv('tabMenualEntry');

    AtlasDocument.BindCurrency('');
})

function PasteClear() {
    let elist = $(`#${AtlasJE.Config.BodyTabletbody()}`).empty();
    return;

    /*    let elist = $(`#${AtlasJE.Config.BodyTable()}`).find('tr'); ///.filter(function(e,i) { return $(i).data('action') === 'existing'});
        elist.each(function(e) {
            let JEID = elist[e].id
            funDeleteRecordAuditTab(JEID);
        });
        */
}

//============================== Company 
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
    GlbCompnayArr = response;
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
    funGetClosePeriodDetail();
}

function funGetClosePeriodDetail() {
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());
    return;
}

function GetClosePeriodDetailSucess(response) {
    GlbClosePeriod = response;
    $('#ddlPeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlPeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
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
        GetSegmentListSucess(response); })
    .fail(function (error) { 
        console.log(error); 
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
        GetTransactionCodeSucess(response);
    })
    .fail(function (error) { 
        ShowMSG(error);
    })
}

function GetTransactionCodeSucess(response) {
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th class="DistributionRowID_JE"></th>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName === 'Detail' || ArrSegment[i].SegmentName === 'DT') {
            strHtml += '<th class="DistributionDetail_JE">' + ArrSegment[i].SegmentName + '</th>';
        } else {
            strHtml += '<th class="DistributionSegment_JE">' + ArrSegment[i].SegmentName + '</th>';
        }
    }

    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th class="DistributionOptional_JE">' + ArrOptionalSegment[i].SegmentName + '</th>';
    }

    for (var i = 0; i < response.length; i++) {
        var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }
        ArrTransCode.push(obj);
        strHtml += '<th class="DistributionMemoCode_JE">' + response[i].TransCode + '</th>';

    }
    strHtml += '<th class="DistributionAmount_JE">Debit</th>';
    strHtml += '<th class="DistributionAmount_JE">Credit</th>';
    strHtml += '<th class="DistributionVendor_JE">Vendor</th>';
    strHtml += '<th class="DistributionTaxCode_JE">TaxCode</th>';
    strHtml += '<th class="DistributionDescription_JE">Description</th>';

    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);
    //$('#tblManualEntryThead').stickyTableHeaders();
    $('#ddlCompany').focus();

}

//============================================= Create Tr Table  /// Transaction Number
function funAddJournalEntry() {
    $.ajax({
        url: APIUrlGetTransactionNumber + '?ProdId=' + localStorage.ProdId + '&CreatedBy=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        funAddJournalEntrySucess(response); 
    })
    .fail(function (error) { 
        console.log(error); 
    })
}

function funAddJournalEntrySucess(response) {
    strJournalEntryId = response[0].JournalEntryId;
    $('#hdnJEId').val(response[0].JournalEntryId);
    $('#spnTrasactionNo').text(response[0].TransactionNumber);

    $('#hrfAddJE').attr('style', 'display:none;');
    $('#hrfNewLine').attr('style', 'display:inline;');
    $('#btnSaveJE').show();
    funTrCreate();
    $('#txt_' + 0 + '_' + 1).focus();

}

//=============================================== Create New Row Manul Row 
function funTrCreate(objD, action, rowID) {
    objD = (objD === undefined) ? {} : objD;

    $('#btnCancel').show();
    $('#btnSaveJE').show();
    var strNote = (objD['DESCRIPTION'] === undefined) ? $('#txtDescription').val() : objD['DESCRIPTION'];
    var strCompany = $('#ddlCompany').find("option:selected").text();

    var strhtml = '';
    strhtml += `<tr id="${strTrCount}" class="clsTr" >`;
    strhtml += '<td class="DistributionRowID_JE"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript:funJEDeleteRow(' + strTrCount + ');"></i></span></td>'; /// strTrCount

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') strhtml += `<td class="DistributionDetail_JE input-segment"><input type="text" class=" form-control detectTab clsPaste form-segment DT" value="${AtlasPaste.FillFieldValue(objD, ArrSegment[i].SegmentName)}" onfocus="javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);"  id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}"/></td>`;
        else if (ArrSegment[i].SegmentName == 'CO') strhtml += `<td class="DistributionSegment_JE input-segment"><input type="text" class="form-control detectTab clsPaste form-segment CO" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" value="${strCompany}" coacode="${strCompany}" disabled /></td>`;
        else if (ArrSegment[i].SegmentName == 'LO') strhtml += `<td class="DistributionSegment_JE input-segment"><input type="text" class="form-control detectTab clsPaste form-segment LO" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" onfocus="this.select();" value="${AtlasPaste.FillFieldValue(objD, ArrSegment[i].SegmentName)}" /></td>`;
        else strhtml += `<td class="DistributionSegment_JE input-segment"><input type="text" class="form-control detectTab clsPaste form-segment ${ArrSegment[i].SegmentName}" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" value="${AtlasPaste.FillFieldValue(objD, ArrSegment[i].SegmentName)}"/></td>`;
    }

    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strhtml += `<td class="DistributionSegment_JE"><input type="text" class="input-segment-optional ${strTrCount} form-control SearchOptionalCode clsPaste clsOtional${strTrCount}" value="${AtlasPaste.FillFieldValue(objD, ArrOptionalSegment[i].SegmentName)}" onblur="javascript:funCheckOptionalAutoFill(${strTrCount},\'${ArrOptionalSegment[i].SegmentName}\',${i});" onfocus="javascript:GetOptional(${strTrCount},\'${ArrOptionalSegment[i].SegmentName}\',${i});" id="txtOptional_${strTrCount + '_' + i}" name="${ArrOptionalSegment[i].SegmentLevel}" /></td>`;
    }

    for (var i = 0; i < ArrTransCode.length; i++) {
        strhtml += `<td class="DistributionSegment_JE"><input value="${AtlasPaste.FillFieldValue(objD, ArrTransCode[i].TransCode)}" type="text" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" class="form-control SearchCode clsPaste clsTransCode${strTrCount} clsTransCode_${strTrCount}" onfocus="javascript:funTransDetail(${strTrCount},${ArrTransCode[i].TransId})" id="txt_${ArrTransCode[i].TransCode}_${strTrCount}" name="${ArrTransCode[i].TransId}" TCode="${ArrTransCode[i].TransCode}" /></td>`;
    }
    strhtml += `<td class="DistributionAmount_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'DEBIT', 0)}" type="text" class="form-control w2ui-field DebitClass detectTab w2field amount" onkeypress="javascript:validate(event);" onchange="javascript: funDebitCredit(${strTrCount},0);" id="txtDebit_${strTrCount}"/></td>`;
    strhtml += `<td class="DistributionAmount_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'CREDIT', 0)}" type="text" class="form-control w2ui-field CreditClass detectTab w2field amount" onkeypress="javascript:validate(event);" onchange="javascript:funDebitCredit(${strTrCount},1);" id="txtCredit_${strTrCount}"/></td>`;
    strhtml += `<td id="Vendor_${strTrCount}" class="DistributionVendor_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'VENDOR')}" type="text" class="form-control SearchVendor clsVendor " onfocus="javascript: AtlasJE.fnGetVendorList(this);" onblur="javascript: AtlasJE.fnVendorBlur(this);" id="txtVendor_${strTrCount}"/></td>`;
    strhtml += `<td class="DistributionSegment_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'TAXCODE')}" type="text" class="clsTaxCode clsTax number " onfocus="javascript: funTaxCode(${strTrCount});"  id="ddlTaxCode_${strTrCount}"/></td>`;
    strhtml += `<td class="DistributionDescription_JE" ><input value="${strNote}" type="text" class=" form-control clsNotes detectTab " id="txtNotes_${strTrCount}" onfocus="javascript: funNoteExplode(${strTrCount});" onblur="javascript: funFocusout(${strTrCount});" /><input type="hidden" class="clsCOACode" id="hdnCode_${strTrCount}"/><input type="hidden" class="clsCOAId" id="hdnCOAId_${strTrCount}"></td>`;

    strhtml += '</tr>';
    $('#tblManualEntryTBody').append(strhtml);
    AtlasJE.fnVendorBlur($(`#txtVendor_${strTrCount}`)[0], true);

    fillcompanyandlocation(strTrCount);
    if (strTrCount == 0) {
        //   $('#txt_' + strTrCount + '_' + 1).focus();
    }

    strTrCount++;
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib

    if ($('#DvTab').height() >= (window.innerHeight - 330)) { // Space used by JE header
        $(`#tblManualEntry`).stickyTableHeaders('destroy'); // destroy the old sticky headers

        $('#DvTab').height((window.innerHeight - 330)); // Space used by JE header
        $('#DvTab').css('overflow','overlay'); // scroll
        $('#tblManualEntry').stickyTableHeaders({scrollableArea: $('#DvTab')});
    }

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

    $('#txt_' + (strTrCount-1) + '_1').focus();
}

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

    })
}

function funJEDeleteRow(value) {
    $('#' + value).remove();
    funCalculation();
}

//======================== Segment Position
function funSegment(values, SegmentName, SegmentP) {
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
        url: APIUrlGetCOA + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

        .done(function (response)
        { funSegmentSucess(response, values, SegmentP); })
        .fail(function (error)
        { console.log(error); })
}

function funSegmentSucess(response, values, SegmentP) {
    if (response.length > 0) {
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
    } else {
        //  ShowMsgBox('showMSG', 'Please build COA First Before adding JE', '', 'failuremsg');
    }
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
                    if (strval.indexOf('(') != -1) {
                        strval = strval.split('(')[0].trim();
                    }
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
            for (var i = SegmentP + 1; i < ArrSegment.length; i++) {
                $('#txt_' + values + '_' + i).val('');
            }
            $('#txt_' + values + '_' + SegmentP).removeAttr('style');
            $('#txt_' + values + '_' + SegmentP).attr('style', 'border-color:#d2d6de;');
        }
    }
    if ($('#txt_' + values + '_' + SegmentP).val() != '') {
        $('#txt_' + values + '_' + SegmentP).removeAttr('style');
        $('#txt_' + values + '_' + SegmentP).attr('style', 'border-color:#d2d6de;');
    } else {
        $('#txt_' + values + '_' + SegmentP).removeAttr('style');
        $('#txt_' + values + '_' + SegmentP).attr('style', 'border-color:red;');
    }
}

//================================================= Optional COA
function GetOptional(values, SegmentName, SegmentP) {
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
        { GetOptionalSucess(response, values); })
        .fail(function (error)
        { ShowMSG(error); })

}
function GetOptionalSucess(response, values) {
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
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);

            }
        }
    } else {
        //$('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
        //$('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);
    }
}


//================================================
function funTransDetail(values, TransId) {
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
        TransDetailSucess(response); 
    })
    .fail(function (error) { 
        ShowMSG(error); 
    })
}

function TransDetailSucess(response) {
    GlbTransList = [];
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
    $(".SearchCode").autocomplete({
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
                //// $('#f').val('');
                //$(this).removeAttr('TransValueId');
                //$(this).val('');
            }
        }
    })
}

/*
function funBlurTrans(value, Name) {
    if (GlbTransList.length === 0) return 
    //else
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
        //$('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
        //$('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);

    }
}
*/
//================================================= 3 Party Check
function funCheckBox3P(value) {
    if ($('#Chk3P_' + value).prop('checked') == true) {
        $('#txtVendor_' + value).remove();
        $('#Vendor_' + value).html('<input type="text" class="width40 clsVendor " onfocus="javascript: AtlasJE.fnGetVendorList(' + value + ');" id="txtVendor_' + value + '" autocomplete="false">');
    } else {
        $('#txtVendor_' + value).remove();
        $('#Vendor_' + value).html('<input type="text" class="width40 clsVendor SearchVendor ui-autocomplete-input " onfocus="javascript: AtlasJE.fnGetVendorList(' + value + ');" id="txtVendor_' + value + '" autocomplete="off">');
    }

}

function funNoteExplode(value) {
    $('#txtNotes_' + value).attr('data-default', $('#txtNotes_' + value).width());
    // $('#txtNotes_' + value).animate({ width: 150 }, 'slow');
}

//================================================== Note 
function funFocusout(value) {
    var strval = $('#txtNotes_' + value).val();
    $('#txtNotes_' + value).removeAttr('title');
    $('#txtNotes_' + value).attr('title', strval);


    var w = $('#txtNotes_' + value).attr('data-default');
    // $('#txtNotes_' + value).animate({ width: w }, 'slow');
}

//================================================== Alt+N
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {

        if (strJECount == 0) {
            funAddJournalEntry();
            strJECount++;
        } else {
            funTrCreate();
        }
    }

    if (key === 9) {
        if (strTrCount == 0) {

            if (this.activeElement.id == 'txtDescription') {
                funAddJournalEntry();
                //funTrCreate();
                return false;
                $('#txt_0_1').focus();
            }
        }
    }
});

//=============================================  Note + TAB
$('#tblManualEntryTBody').delegate('.clsNotes', 'keydown', function (event) {
    var strRowcount = $('#tblManualEntryTBody tr:last').attr('id');
    var key = event.which || event.keyCode;
    if (event.which === 9) {
        if (event.shiftKey === true && key === 9) {

        }
        else {
            var $this = $(this)
            var strId = $this.attr('id');
            var strSplit = strId.split('_');
            if (strRowcount == strSplit[1]) {
                funTrCreate();
                funSetPreviousRecord(strSplit[1]);
            }
        }
    }
});

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

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') {
            var stri = i - 1;
            $('#txt_' + TrId + '_' + stri).focus();

        }
    }
    var strdesc = $('#txtNotes_' + value).val();
    $('#txtNotes_' + TrId).val(strdesc);
}

//=========================================== Debit / Credit //===========================
function funDebitCredit(value, Type) {
    if (Type == 0) {
        var strvalue = $('#txtDebit_' + value).val();

        if (strvalue == '') {
            $('#txtDebit_' + value).val(0);
        }

        if (strvalue != 0) {
            $('#txtCredit_' + value).val(0);
        }
    } else {
        var strvalue = $('#txtCredit_' + value).val();

        if (strvalue == '') {
            $('#txtCredit_' + value).val(0);
        }

        if (strvalue != 0) {
            $('#txtDebit_' + value).val(0);
        }
    }
}

$('#tblManualEntryTBody').delegate('.DebitClass', 'change', function () {
    funCalculation();

})

$('#tblManualEntryTBody').delegate('.CreditClass', 'change', function () {
    funCalculation();
})

function funCalculation() {
    var TotalDebit = 0;
    var TotalCredit = 0;
    var TotalImbalance = 0;

    var strDebit = $('.DebitClass');
    var strCredit = $('.CreditClass');
    for (var i = 0; i < strDebit.length; i++) {
        var strId = strDebit[i].id;
        var strAmount = $('#' + strId).val();
        if (strAmount == '') {
            strAmount = '0.00';
        }

        strAmount = strAmount.replace(/,/g, '');
        TotalDebit += parseFloat(strAmount);

        var sstrId = strCredit[i].id;
        var sstrAmount = $('#' + sstrId).val();
        if (sstrAmount == '') {
            sstrAmount = '0.00';
        }
        sstrAmount = sstrAmount.replace(/,/g, '');
        TotalCredit += parseFloat(sstrAmount);
    }
    TotalImbalance = TotalDebit - TotalCredit;
    //================
    TotalImbalance = Math.abs(TotalImbalance).toFixed(2);
    //=============== Debit
    if (TotalDebit != 0) {
        $('#spnDebit').text(parseFloat(TotalDebit + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    } else {
        $('#spnDebit').text('0.00');
    }

    //============== Credit
    if (TotalCredit != 0) {
        $('#spnCredit').text(parseFloat(TotalCredit + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    } else {
        $('#spnCredit').text('0.00');

    }

    //================ Imbalance
    if (TotalImbalance != 0) {
        $('#txtImBalance').text(parseFloat(TotalImbalance + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#DvBalImBal').removeClass('green-color');
        $('#DvBalImBal').addClass('red-color');
    } else {
        $('#txtImBalance').text('0.00');
        $('#DvBalImBal').addClass('green-color');
        $('#DvBalImBal').removeClass('red-color');
        $('#spnBalancImBalance').text('Balance');
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

$('#btnSaveJE').click(function () {
    formmodified = 0;
    $('#spnSaveOk').focus();
    CheckSaveMJEvalidation();

});

function CheckSaveMJEvalidation() {
    var strval = parseFloat($('#txtImBalance').text());
    if (strval != 0) {
        $('#SaveImbanace').show();
        $('#fade').show();
    } else {
        funSaveFinal();
    }
}

function funSaveFinal() {
    $('#SaveImbanace').hide();
    $('#fade').hide();
    $('#spnSaveOk').focus();
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

    if ($('#tblManualEntryTBody  > tr').length == 0) {
        isvalid = isvalid + 1;
        //  alert('Add JE Line First.. !!');
    }

    if (isvalid == '') {
        if (strSaveCount === 0) {
            strSaveCount += funSaveJE();
        }
    } else {
        $('#idfConfirmOk').focus();
        $('#IdAlerttransaction').show();
    }
}

function funSaveJE() {
    let invaliddata = 0;

    var ArrJEDetail = [];
    var strDebitAmount = $('#spnDebit').text();
    var strCreditAmount = $('#spnCredit').text();
    var strImAmount = $('#txtImBalance').text();

    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: strJournalEntryId
        //  TransactionNumber:
        , Source: $('#ddlType').val()
        , Description: $('#txtDescription').val()
        , EntryDate: $('#txtTransactionDate').val()
        , DebitTotal: strDebitAmount
        , CreditTotal: strCreditAmount
        , TotalLines: ''
        , ImbalanceAmount: strImAmount.substring(1, strImAmount.length)
        , AuditStatus: 'Saved'
        , PostedDate: $('#txtPostDate').val()
        , ReferenceNumber: ''
        , BatchNumber: BatchManager.BatchNumber
        , ProdId: localStorage.ProdId
        , createdBy: localStorage.UserId
        , ClosePeriod: $('#ddlClosePeriod').val()
        , CompanyId: $('#ddlCompany').val()
        , DocumentNo: $('#txtReferenceNo').val()
        , CurrencyTransaction: $('#ddlCurrency :selected').val()
    }
    ////////////////////////////////////////////////////////////////////////// JE End

    var DAmount = $('.DebitClass');
    var CAmount = $('.CreditClass');
    var VendorName = $('.clsVendor');
    // var ThirdParty = $('.cls3p');
    var Note = $('.clsNotes');
    var strCOACode = $('.clsCOACode');
    var strCOAId = $('.clsCOAId');
    var strTr = $('.clsTr');
    var strTaxCode = $('.clsTaxCode');

    AtlasJE.fnGetVendorList({}); // So that C&P will work properly
    for (var i = 0; i < strTr.length; i++) {
        var strId = strTr[i].id;
        var TransString = '';
        //var COAOptional = '';
        var strSet = '';
        var strSeires = '';
        //var strOption = $('.clsOtional' + strId);
        var strOptional = $(`.form-segment-optional.${strId}`);

        for (var j = 0; j < strOptional.length; j++) {
            let strid = strOptional[j].id;
            if ($('#' + strid).val() === '') break;
            let theSets = AtlasUtilities.SEGMENTS_CONFIG.Set;
            if (!theSets) {
                strSet = '';
                $('#' + strid).notify('Invalid Code');
                $(`#${strid}`).addClass('field-Req');
                invaliddata++;
            } else {
                if (AtlasUtilities.SEGMENTS_CONFIG.Set[$('#' + strid).val()] === undefined) {
                    strSet = '';
                    $('#' + strid).notify('Invalid Code');
                    $(`#${strid}`).addClass('field-Req');
                } else {
                    strSet = AtlasUtilities.SEGMENTS_CONFIG.Set[$('#' + strid).val()].AccountID;
                    $(`#${strid}`).removeClass('field-Req');
                }
            }
        }

        let TCodes = (AtlasCache.Cache.GetItembyName('Config.TransactionCodes'))? AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON: undefined;
        var strTrans = $('.clsTransCode' + strId);
        for (var j = 0; j < strTrans.length; j++) {
            let strid = strTrans[j].id;
            var strvalue = $('#' + strid).attr('name');
            //var strTransValueId = $('#' + strid).attr('TransValueId');
            var strTransValueId = undefined;
            if ($(`#${strid}`).val() !== '' ) {
                try {
                    strTransValueId = TCodes.reduce((o,i) => { o[i.TransCode] = i; return o}, {})[$('#' + strid).attr('TCode')].TV.find(function(i) { return i.TransValue === $('#' + strid).val();}).TVID;
                    $(`#${strid}`).removeClass('field-Req');
                } catch (e) {
                    console.log(e);
                    $(`#${strid}`).notify('Invalid value');
                    $(`#${strid}`).addClass('field-Req');
                    invaliddata++;
                }
            }

            if (strTransValueId !== undefined) {
                TransString += strvalue;
                TransString += ':' + strTransValueId + ',';
            }
        }
        TransString = TransString.slice(0, -1);


        var FDebitAmount = DAmount[i].value;
        if (FDebitAmount == '') { FDebitAmount = 0; }
        var FCreditAmount = CAmount[i].value;
        if (FCreditAmount == '') { FCreditAmount = 0; }

        var strVId = VendorName[i].id;
        let VID = AtlasJE.fnVendorBlur(VendorName[i], true); // blur the Vendor field to get the VendorID
        if (VID === undefined) {
            $(`#${strVId}`).notify('Invalid Vendor');
            $(`#${strVId}`).addClass('field-Req');
            invaliddata++;
        }
        var FVendorName = VendorName[i].value;
        var FVendorId = (VID === 0)? undefined: VID; //$(`#${strVId}`).attr('name');
        //  var FThirdParty = ThirdParty[i].checked;
        var FNote = Note[i].value;
        var FstrTaxCode = strTaxCode[i].value;
        if ($(`#${strTaxCode[i].id}`).val() !== '' && AtlasCache.Cache.GetItembyName('Tax Codes').find(function(e){ return (e.TaxCode === $(`#${strTaxCode[i].id}`).val());}) === undefined) {
            // Invalid Tax Code provided
            $(`#${strTaxCode[i].id}`).notify('Invalid Tax Code');
            $(`#${strTaxCode[i].id}`).addClass('field-Req');
            invaliddata++
        } 

        // Get the COAID and COACode based upon current values rather than on-the-fly (buggy) setting of segment values
        let objCOA = {}
        $($(strTr)[i]).find('td.input-segment').each(function(tde){ 
            $(this).find('input').each(function(ie){ 
                objCOA[this.name] = $(this).val();
                $(this).removeClass('field-Req');
            });
        });
        let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objCOA);
        if (COAID === undefined || COACode === undefined) {
            if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(strTr[i]).notify('Invalid Account');
            Object.keys(SegCheck).forEach((seg) => {$($(strTr)[i]).find(`td.input-segment [name=${seg}]`).addClass('field-Req');});
            $(strTr[i]).addClass('field-Req');
            invaliddata++;
        }

        var FstrCOACode = COACode;
        var FstrCOAId = COAID;
        //var FstrCOACode = strCOACode[i].value;
        //var FstrCOAId = strCOAId[i].value;

        var objJEDetail = {
            JournalEntryId: ''

            , TransactionLineNumber: $('#spnTrasactionNo').text()
            , COAId: FstrCOAId
            , DebitAmount: FDebitAmount
            , CreditAmount: FCreditAmount
            , VendorId: FVendorId
            , VendorName: FVendorName
            // , ThirdParty: FThirdParty
            , Note: FNote
            , CompanyId: $('#ddlCompany').val()
            , ProdId: localStorage.ProdId
            , CreatedBy: localStorage.UserId
            , COAString: FstrCOACode
            , TransactionCodeString: TransString
            , SetId: strSet
            , SeriesId: strSeires
            , TaxCode: FstrTaxCode
        }
        ArrJEDetail.push(objJEDetail);
    }

    var finalObj = {
        objJE: objJournalEntry,
        objJEDetail: ArrJEDetail
    }
    
    if (invaliddata >0 ) {
        $('#spnTrasactionNo').notify('This entry was NOT SAVED. Please correct your data and then save again.');
        $('#fade').hide();
        return 0;
    }

    $.ajax({
        url: APIUrlSaveJE,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
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
        strSaveCount--;
        AtlasUtilities.ShowError(error);
        //ShowMSG(error);
    });

    formmodified = 0;
    return 1; // We're assuming that the JE Save worked and will increment the save count so that we don't get a double save
}

function funSaveJESucess(response) {
    // var ss = $('#spnTrasactionNo').text();
    $('#spnTransId').text($('#spnTrasactionNo').text());
    $('#SaveSuccess').show();
    $('#spnSaveOk').focus();
    $('#fade').show();
}

function funSaveOkResponse() {
    location.reload(true);
}

//========================= Cancle
function funCancelJE() {
    formmodified = 0;
    $('#CancelAuditPopup').show();
    $('#CancelPopYes').focus();
    $('#fade').show();
}

function funCancelJEYes(value) {
    if (value == 'Yes') {
        location.reload(true);
    } else {
        $('#CancelAuditPopup').hide();
        $('#fade').hide();
    }
}

//============================= 
//$('#txtDescription').click(function () {

//    funTrCreate();
//})
$('#txtDescription').blur(function () {
    if ($('#tblManualEntryTBody tr').length == 0) {
        funAddJournalEntry();
    }

})

//=============================== Desc Amount 
$('#tblManualEntryTBody').delegate('.clsNotes', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtNotes_' + stval).length > 0) {
            $('#txtNotes_' + stval).focus();
        } else {
            //alert('No roew');
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtNotes_' + stval).length > 0) {
            $('#txtNotes_' + stval).focus();
        } else {
            //alert('No roew');
        }
    }

})

$('#tblManualEntryTBody').delegate('.DebitClass', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtDebit_' + stval).length > 0) {
            $('#txtDebit_' + stval).select();
        } else {
            //alert('No roew');
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtDebit_' + stval).length > 0) {
            $('#txtDebit_' + stval).select();
        } else {
            //alert('No roew');
        }
    }
})

$('#tblManualEntryTBody').delegate('.CreditClass', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtCredit_' + stval).length > 0) {
            $('#txtCredit_' + stval).select();
        } else {
            //alert('No roew');
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtCredit_' + stval).length > 0) {
            $('#txtCredit_' + stval).select();
        } else {
            //alert('No roew');
        }
    }
})

//=======
$(document).ready(function () {
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

// ================== SAve shortcut
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 83) {
        CheckSaveMJEvalidation();
    }
});

$('#tblManualEntryTBody').delegate('.DebitClass', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtDebit_' + stval).length > 0) {
            $('#txtDebit_' + stval).select();
        } else {
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtDebit_' + stval).length > 0) {
            $('#txtDebit_' + stval).select();
        } else {
            //alert('No roew');
        }
    }
})

$('#tblManualEntryTBody').delegate('.CreditClass', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtCredit_' + stval).length > 0) {
            $('#txtCredit_' + stval).select();
        } else {
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtCredit_' + stval).length > 0) {
            $('#txtCredit_' + stval).select();
        } else {
        }
    }
})

$('#txtTransactionDate').focusout(function () {
    $('#ddlType').focus();
});

function SetFocusTrans() {
    $('#IdAlerttransaction').hide();
    $('#txt_' + 0 + '_' + 1).focus();
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
        });
    })
    .fail(function (error) { 
        console.log(error); })
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
    if (strResponse.length == 1 && strResponse.LOCOAID !== undefined) {
        $('#txt_' + strTrCount + '_1').attr('coacode', strResponse[0].LOCOA);
        if ($('#txt_' + strTrCount + '_1').val() === '') $('#txt_' + strTrCount + '_1').val(strResponse[0].Location); // Support for C&P
        $('#txt_' + strTrCount + '_1').attr('name', 'LO');
        $('#txt_' + strTrCount + '_1').attr('coaid', strResponse[0].LOCOAID);

        $('#hdnCOAId_' + strTrCount).val(strResponse[0].LOCOAID);
        $('#hdnCOAId_' + strTrCount).val(strResponse[0].LOCOA);
    }
}

