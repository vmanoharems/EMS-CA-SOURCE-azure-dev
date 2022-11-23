var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode"; //
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId"; // Transaction Value
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID"; // Vendor
var APIUrlGetTransactionNumber = HOST + "/api/Ledger/GetTransactionNumber";
var APIUrlSaveJE = HOST + "/api/Ledger/SaveJE";
var APIUrlAuditTabJEList = HOST + "/api/Ledger/GetJournalEntryList";
var APIUrlGetJEDetailList = HOST + "/api/Ledger/GetJEDetailByJEId";
var APIUrlDeleteRecordAudit = HOST + "/api/Ledger/DeleteJournalEntryDetailById";
var APIUrlGetTransactionCodeDetail = HOST + "/api/Ledger/GetJournalEntryDetailTransValue";
var APIUrlPostingHistory = HOST + "/api/Ledger/GetJournalEntryDetailByStatus";
var APIUrlSaveAuditPost = HOST + "/api/Ledger/UpdateJournalEntryStatusById";
var APIUrlGetJEListForDistribution = HOST + "/api/Ledger/GetJEListForDistribution";  // Distribution  // Not use
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory"; //Optional COA
var APIUrlGetfunReverse = HOST + "/api/Ledger/GeteverseJEDetail";

//===========
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlfunGetJEntryDetail = HOST + "/api/Ledger/GetJEntryByJEId";
var APIUrlfunDeleteJEAudit = HOST + "/api/Ledger/DeleteJEandJEDetail";

//===========


var strTrCount = 0;
var strAuditCount = 0;
var ArrSegment = [];
var ArrOptionalSegment = [];
var ArrTransCode = [];
var strJournalEntryId = 0;
var strDate = '';
var strJournalEntryIdAudit = 0;
var strJECount = 0;
var CurrentStatus = 'JEManulEntry';

var GetTrId = 0;
var GlbCOAList = [];
var GlbTransList = [];
var GlbVendorList = [];
//
var GlbCompnayArr = [];
var GlbClosePeriod = [];
var GlbType = [];
var GlbVendor = [];


// aririkiaririkishi
$(document).ready(function () {
    GetTaxCodeList();
    GetVendoreByProdId('');
    GlbType.push({ Type: "JE", }); GlbType.push({ Type: "PR", }); GlbType.push({ Type: "WT", });
    FillCompany();
    GetSegmentsDetails();
    //$('#hrfAddJE').attr('disabled', true);

    var date = new Date();
    strDate = date.getFullYear() + "-" + getFormattedPartTime(date.getMonth()) + "-" + getFormattedPartTime(date.getDate()) + " " + getFormattedPartTime(date.getHours()) + ":" + getFormattedPartTime(date.getMinutes()) + ":" + getFormattedPartTime(date.getSeconds());

    var d = new Date();

    var currentDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();

    $('#txtPostDate').val(currentDate);
    $('#DvPostDate').show();

});

function getFormattedPartTime(partTime) {
    if (partTime < 10)
        return "0" + partTime;
    return partTime;
}

//================================================== CompanyList
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
    GlbCompnayArr = response;
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
    funGetClosePeriodDetail();
    //FillVendor();
}

//================================================== Close Period
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
    GlbClosePeriod = response;
    $('#ddlPeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlPeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }

}

//================================================
function funManualEntryTabJEList() {
    strJECount = 0;
    CleanAllHtmlTable();
    strTrCount = 0;
    // $('#btnSaveJE').show();
    $('#btnSaveAudit').hide();
    $('#tblManualEntryTBody').html('');
    $('#hrfAddJE').show();
    $('#hrfNewLine').hide();
    $('#LiBreadCrumb').text('Add JE');
    $('#btnSaveAuditPost').hide();
    $('#btnSaveAuditSave').hide();
    $('#btnSaveDCSave').hide();
    //
    $('#btnDelete').hide();
    $('#btnCancel').hide();

    CurrentStatus = 'JEManulEntry';
    $('#DvPostDate').show();
    var d = new Date();
    var currentDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    $('#txtPostDate').val(currentDate);
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

    .done(function (response)
    { GetSegmentListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
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

     .done(function (response)
     { GetTransactionCodeSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetTransactionCodeSucess(response) {
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th></th>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'Detail') {
            strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
        }
        else {
            strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
        }
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < response.length; i++) {
        var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }
        ArrTransCode.push(obj);
        strHtml += '<th>' + response[i].TransCode + '</th>';

    }
    strHtml += '<th>Debit</th>';
    strHtml += '<th>Credit</th>';
    strHtml += '<th>Vendor</th>';
    strHtml += '<th>3P</th>';
    strHtml += '<th>TaxCode</th>';

    strHtml += '<th style="width:70px;">Notes</th>';

    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);
    //  funTrCreate();

}

//============================================= Create Tr Table  /// Transaction Number
function funAddJournalEntry() {
    //Get  Transacation  #1001
    $.ajax({
        url: APIUrlGetTransactionNumber + '?ProdId=' + localStorage.ProdId + '&CreatedBy=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ funAddJournalEntrySucess(response); })
.fail(function (error)
{ console.log(error); })


}
function funAddJournalEntrySucess(response) {
    strJournalEntryId = response[0].JournalEntryId;

    $('#hdnJEId').val(response[0].JournalEntryId);
    $('#spnTrasactionNo').text(response[0].TransactionNumber);
    funTrCreate();
    $('#hrfAddJE').attr('style', 'display:none;');
    $('#hrfNewLine').attr('style', 'display:inline;');
    $('#btnSaveJE').show();
}

//=============================================== Create New Row Manul Row 
function funTrCreate() {
    var strCompany = $('#ddlCompany').find("option:selected").text();
    //var strTaxCode = '<option value="0">Select</option><option value="01">01=Rents</option><option value="02">02=Royalties</option><option value="03">03=Other Income</option><option value="04">0=Federal Income Tax Withheld</option><option value="05">05=Fishing Boat Proceeds</option><option value="06">06=Medical and Health Care Payments</option><option value="07">07=Nonemployee Compensation</option><option value="14">14=Gross Proceeds Paid to an Attorney</option>';
    var strhtml = '';
    strhtml += '<tr id="' + strTrCount + '" class="clsTr">';
    strhtml += '<td style="width:30px;"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript:funJEDeleteRow(' + strTrCount + ');"></i></span></td>'; /// strTrCount
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') strhtml += '<td class="width100"><input type="text"  class="SearchCode   detectTab" onblur="javascript:funCheckNextValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" /></td>';
        else if (ArrSegment[i].SegmentName == 'CO') strhtml += '<td class="width40"><input type="text"  class="SearchCode   detectTab" onblur="javascript:funCheckNextValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strCompany + '" coacode="' + strCompany + '" disabled /></td>';
        else strhtml += '<td class="width40"><input type="text"  class="SearchCode   detectTab" onblur="javascript:funCheckNextValue(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strTrCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strTrCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" /></td>';
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOtional' + strTrCount + '   " onblur="javascript:funCheckOptionalAutoFill(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + strTrCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + strTrCount + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" /></td>';
        // ArrSegment[i].SegmentName + '_' + ArrSegment[i].SegmentId
    }
    for (var i = 0; i < ArrTransCode.length; i++) {
        strhtml += '<td class="width40"><input type="text" onblur="javascript:funBlurTrans(' + strTrCount + ',\'' + ArrTransCode[i].TransCode + '\');" class="SearchCode clsTransCode' + strTrCount + '  clsTransCode_' + strTrCount + '" onfocus="javascript:funTransDetail(' + strTrCount + ',' + ArrTransCode[i].TransId + ')" id="txt_' + ArrTransCode[i].TransCode + '_' + strTrCount + '" name="' + ArrTransCode[i].TransId + '" /></td>';
    }
    strhtml += '<td class="width40"><input type="text" class="  DebitClass detectTab" onkeypress="javascript:validate(event);"  onchange="javascript:funDebitCredit(' + strTrCount + ',' + 0 + ');" id="txtDebit_' + strTrCount + '" value=""/></td>';
    strhtml += '<td class="width40"><input type="text" class="  CreditClass detectTab" onkeypress="javascript:validate(event);" onchange="javascript:funDebitCredit(' + strTrCount + ',' + 1 + ');" id="txtCredit_' + strTrCount + '" value=""/></td>';
    strhtml += '<td id="Vendor_' + strTrCount + '" class="width75"><input type="text" class="SearchVendor clsVendor  " onfocus="javascript:GetVendoreByProdId(' + strTrCount + ');" onblur="javascript:funVendorBlur(' + strTrCount + ');" id="txtVendor_' + strTrCount + '"/></td>';
    strhtml += '<td class="width40"><input type="checkBox" class="SearchCode cls3p  " id="Chk3P_' + strTrCount + '" onchange="javascript:funCheckBox3P(' + strTrCount + ');"/></td>';
    //strhtml += '<td><select class="clsTaxCode">' + strTaxCode + '</select></td>';
    strhtml += '<td><input type="text" class="clsTaxCode clsTax number"  onfocus="javascript:funTaxCode(' + strTrCount + ');"  id="ddlTaxCode_' + strTrCount + '"  value=""/></td>';
    strhtml += '<td class="width95" ><input type="text"  class="  clsNotes" id="txtNotes_' + strTrCount + '" onfocus="javascript:funNoteExplode(' + strTrCount + ');" onblur="javascript:funFocusout(' + strTrCount + ');"/><input type="hidden" class="clsCOACode" id="hdnCode_' + strTrCount + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + strTrCount + '"  ></td>';

    strhtml += '</tr>';
    $('#tblManualEntryTBody').append(strhtml);


    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'CO') {
            $('#txt_' + strTrCount + '_' + i).focus();
        }
    }

    strTrCount++;
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

}

function funNoteExplode(value) {
    $('#txtNotes_' + value).attr('data-default', $('#txtNotes_' + value).width());
    // $('#txtNotes_' + value).animate({ width: 150 }, 'slow');
}

//=============================================== Get Segment Detail //========= Transaction 
function funCheckNextValue(values, SegmentName, SegmentP) {

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
    if (strStatus == 0)
    { }
    else {
        if (GlbCOAList.length > 0) {
            var strstatus = true;
            var strval = $('#txt_' + values + '_' + SegmentP).val();
            if (strval != '') {
                for (var i = 0; i < GlbCOAList.length; i++) {
                    //if (GlbCOAList[i].COANo.match(strval)) {
                    if (GlbCOAList[i].COANo.replace('-', '').match(strval)) {
                        //  if (strval == GlbCOAList[i].COANo) {
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
            else {
                $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[0].COANo);
                $('#txt_' + values + '_' + SegmentP).attr('COACode', GlbCOAList[0].COACode);
                $('#txt_' + values + '_' + SegmentP).attr('COAId', GlbCOAList[0].COAID);
                $('#hdnCode_' + values).val(GlbCOAList[0].COACode);
                $('#hdnCOAId_' + values).val(GlbCOAList[0].COAID);

            }
            if (strstatus == false)
            { }
            else {

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

//================================================= Optional COA

function GetOptional(values, SegmentName, SegmentP) {
    //var strprevalue=0;
    //for (var i = 0; i < ArrOptionalSegment.length; i++)
    //{
    //    if ($('#txtOptional' + values + SegmentP).val() == '')
    //    {
    //        strprevalue++;
    //    }
    //}
    //if (strprevalue != 0) {
    //    SegmentName = '';
    //}
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
    }
    else {
        //$('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
        //$('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);
    }
}

function funVendorBlur(value) {
    //    GlbVendorList
    var strval = $('#txtVendor_' + value).val().toLowerCase();

    if (strval != '') {
        for (var i = 0; i < GlbVendorList.length; i++) {
            if (GlbVendorList[i].VendorName.toLowerCase().match(strval)) {
                //if (strval == GlbVendorList[i].VendorName) {
                $('#txtVendor_' + value).val(GlbVendorList[i].VendorName);
                $('#txtVendor_' + value).attr('name', GlbVendorList[i].VendorID);
                break;

            } else {
                $('#txtVendor_' + value).val('');
                $('#txtVendor_' + value).removeAttr('name');

            }
        }
    }
    else {
        //$('#txtVendor_' + value).val(GlbVendorList[0].VendorName);
        //$('#txtVendor_' + value).attr('name', GlbVendorList[0].VendorID);
    }
}

//======================================== TransCode Auto Fill
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

   .done(function (response)
   { TransDetailSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
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

function GetVendoreByProdId(values) {
    var strval = 'All';
    $.ajax({

        url: APIUrlGetVendoreByProdId + '?SortBy=' + strval + '&ProdID=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { GetVendoreByProdIdSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetVendoreByProdIdSucess(response) {
    GlbVendorList = [];
    GlbVendorList = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchVendor").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).attr('name', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $(this).attr('name', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');

                //$(this).removeAttr('name');
                //$(this).val('');
            }
        }
    })
}

//================================Transaction Value ======================================================
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
    }
    else {
        //$('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
        //$('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);

    }
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

    }
    else {
        var strvalue = $('#txtCredit_' + value).val();

        if (strvalue == '') {
            $('#txtCredit_' + value).val(0);
        }

        if (strvalue != 0) {
            $('#txtDebit_' + value).val(0);
        }

    }
}
//=========================================== 3rd Party CheckBox //=======================
function funCheckBox3P(value) {
    if ($('#Chk3P_' + value).prop('checked') == true) {
        $('#txtVendor_' + value).remove();
        $('#Vendor_' + value).html('<input type="text" class="width40 clsVendor " onfocus="javascript:GetVendoreByProdId(' + value + ');" id="txtVendor_' + value + '" autocomplete="false">');
    }
    else {
        $('#txtVendor_' + value).remove();
        $('#Vendor_' + value).html('<input type="text" class="width40 clsVendor SearchVendor ui-autocomplete-input " onfocus="javascript:GetVendoreByProdId(' + value + ');" id="txtVendor_' + value + '" autocomplete="off">');
    }

}

//===============================================// Calculation //=======================
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

            strAmount = 0;
        }
        strAmount = strAmount.replace(/,/g, '');
        TotalDebit += parseFloat(strAmount);

        var sstrId = strCredit[i].id;
        var sstrAmount = $('#' + sstrId).val();
        if (sstrAmount == '') {

            sstrAmount = 0;
        }
        sstrAmount = sstrAmount.replace(/,/g, '');
        TotalCredit += parseFloat(sstrAmount);
    }
    TotalImbalance = TotalDebit - TotalCredit;
    //================
    TotalImbalance = Math.abs(TotalImbalance).toFixed(2);
    //=============== Debit
    if (TotalDebit != 0) {
        $('#spnDebit').text(TotalDebit);
    }
    else {
        $('#spnDebit').text(0.00);

    }
    //============== Credit
    if (TotalCredit != 0) {
        $('#spnCredit').text(TotalCredit);
    }
    else {
        $('#spnCredit').text(0.00);

    }
    //================ Imbalance
    if (TotalImbalance != 0) {
        $('#txtImBalance').text(TotalImbalance);
        $('#DvBalImBal').removeClass('green-color');
        $('#DvBalImBal').addClass('red-color');
        //  $('#spnBalancImBalance').text('ImBalance');

    }
    else {
        $('#txtImBalance').text(0.00);
        $('#DvBalImBal').addClass('green-color');
        $('#DvBalImBal').removeClass('red-color');
        $('#spnBalancImBalance').text('Balance');
    }
}


//============================ Save function//=================== Manual Entry
$('#btnSaveJE').click(function () {
    CheckSaveMJEvalidation();

});
function CheckSaveMJEvalidation() {
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
        alert('Add JE Line First.. !!');
    }




    if (isvalid == '') {
        funSaveJE();
    }


}
function funSaveJE() {
    var ArrJEDetail = [];
    var strDebitAmount = $('#spnDebit').text();
    var strCreditAmount = $('#spnCredit').text();
    var strImAmount = $('#txtImBalance').text();

    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: strJournalEntryId
        //  TransactionNumber:
               , Source: 'JE'
               , Description: $('#txtDescription').val()
               , EntryDate: strDate
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
               , ClosePeriod: $('#ddlPeriod').val()
               , CompanyId: $('#ddlCompany').val()
    }
    ////////////////////////////////////////////////////////////////////////// JE End

    var DAmount = $('.DebitClass');
    var CAmount = $('.CreditClass');
    var VendorName = $('.clsVendor');
    var ThirdParty = $('.cls3p');
    var Note = $('.clsNotes');
    var strCOACode = $('.clsCOACode');
    var strCOAId = $('.clsCOAId');
    var strTr = $('.clsTr');
    var strTaxCode = $('.clsTaxCode');

    for (var i = 0; i < strTr.length; i++) {
        var strId = strTr[i].id;
        var TransString = '';
        var COAOptional = '';
        var strSet = '';
        var strSeires = '';
        var strOption = $('.clsOtional' + i);

        for (var j = 0; j < strOption.length; j++) {
            var strid = strOption[j].id;
            // var strvalue = $('#' + strid).attr('name');
            var strAccountId = $('#' + strid).attr('AccountId');
            //if (strAccountId != undefined) {
            //    COAOptional += strvalue;
            //    COAOptional += ':' + strAccountId + ',';
            //}
            if (j == 0) {
                strSet = strAccountId;
            }
            else if (j == 1) {
                strSeires = strAccountId;
            }
        }
        COAOptional = COAOptional.slice(0, -1);

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
        TransString = TransString.slice(0, -1);

        var FDebitAmount = DAmount[i].value;
        if (FDebitAmount == '') { FDebitAmount = 0; }
        var FCreditAmount = CAmount[i].value;
        if (FCreditAmount == '') { FCreditAmount = 0; }
        var FVendorName = VendorName[i].value;
        var strVId = VendorName[i].id;
        var FVendorId = $('#' + strVId).attr('name');
        var FThirdParty = ThirdParty[i].checked;
        var FNote = Note[i].value;
        var FstrCOACode = strCOACode[i].value;
        var FstrCOAId = strCOAId[i].value;
        var FstrTaxCode = strTaxCode[i].value;

        var objJEDetail = {
            JournalEntryId: ''
                            , TransactionLineNumber: $('#spnTrasactionNo').text()
                            , COAId: FstrCOAId
                            , DebitAmount: FDebitAmount
                            , CreditAmount: FCreditAmount
                            , VendorId: FVendorId
                            , VendorName: FVendorName
                            , ThirdParty: FThirdParty
                            , Note: FNote
                            , CompanyId: ''
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

      .done(function (response)
      { funSaveJESucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
}
function funSaveJESucess(response) {
    ShowMsgBox('showMSG', 'Save JournalEntry Successfully ..!!', '', '');

    $('#tblManualEntryTBody').html('');
    $('#hrfAddJE').show();
    $('#hrfNewLine').hide();
    $('#spnTrasactionNo').text('');
    $('#spnDebit').text('0.00');
    $('#spnCredit').text('0.00');
    $('#txtImBalance').text('0.00');
    $('#spnBalancImBalance').text('Balance');
    $('#txtImBalance').text('0.00');
    $('#DvBalImBal').removeClass('red-color');

    $('#DvBalImBal').addClass('green-color');
    $('#btnSaveJE').hide();
    //location.reload(true);


}

//=========================================== //Audit Tab // ==============================================================

function funAuditTabJEList() {
    CleanAllHtmlTable();
    $('#btnSaveJE').hide();
    $('#btnSaveAuditPost').show();
    $('#btnSaveAudit').hide();
    $('#DvAuditList').show();
    $('#DvAuditListByJEDetail').hide();
    $('#NewDvAuditListByJEDetail').hide();
    $('#ddlPeriodAudit').hide();
    $('#EditTransactionBreadCrumb').hide();

    $('#tblManualEntryTBody').html('');
    $('#LiBreadCrumb').text('Audit');
    $('#btnSaveAuditSave').hide();
    $('#btnSaveDCSave').hide();

    //
    $('#btnDelete').hide();
    $('#btnCancel').hide();

    //
    CurrentStatus = 'Audit';
    //=====================
    $.ajax({
        url: APIUrlAuditTabJEList + '?ProdId=' + localStorage.ProdId + '&AuditStatus=' + 'Audit',
        ///url: APIUrlAuditTabJEList + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { funAuditTabJEListSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function funAuditTabJEListSucess(response) {
    var Tcount = response.length;
    var strHtml = '';
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            //"1234255364".replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            var CreditTotal = response[i].CreditTotal;
            CreditTotal = '$ ' + (CreditTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            var DebitTotal = response[i].DebitTotal;
            DebitTotal = '$ ' + (DebitTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            //CreditTotal = "'+response[i].CreditTotal+'", DebitTotal = "'+response[i].DebitTotal+'"
            strHtml += '<tr>';
            strHtml += '<td><input type="checkBox" class="clsJEList" id="Chk' + response[i].JournalEntryId + '" name="' + response[i].JournalEntryId + '" CreditTotal = "' + response[i].CreditTotal + '", DebitTotal = "' + response[i].DebitTotal + '" /></td>';
            strHtml += '<td><a href=# style="color: #337ab7;" onclick="javascript:funJEDetails(' + response[i].JournalEntryId + ');">' + response[i].TransactionNumber + '</a></td>';
            strHtml += '<td>' + response[i].CO + '</td>';
            strHtml += '<td>' + response[i].Source + '</td>';

            strHtml += '<td>' + CreditTotal + '</td>';
            strHtml += '<td>' + DebitTotal + '</td>';
            strHtml += '<td>' + response[i].TotalLines + '</td>';
            strHtml += '<td>' + '-' + '</td>';
            strHtml += '<td>' + '-' + '</td>';


            strHtml += '</tr>';

        }
    } else {
        strHtml += '<tr><td colspan="' + 8 + '" style="text-align: center;">No Record Found.. !!</td></tr>';
    }

    $('#tblJEListTBody').html(strHtml);

    //var table = $('#tblJEList').DataTable({
    //    "iDisplayLength": 15,
    //    responsive: {
    //        details: {
    //            //  type: 'column',
    //        }
    //    },
    //    columnDefs: [{

    //        className: 'control',
    //        orderable: false,
    //        targets: 0,

    //    }],
    //    order: [1, 'asc']
    //});
}

//==========================================// Audit Post By CheckBox//====================================================
$('#chkAllForPosing').change(function () {
    var strcheckBox = $('.clsJEList');
    var strcount = 0;
    var strval = true;
    if ($('#chkAllForPosing').is(':checked')) {
        strval = true;
    }
    else {
        strval = false;
    }

    for (var i = 0; i < strcheckBox.length; i++) {
        var strId = strcheckBox[i].id;
        if (strval == true) {

            var strCAmount = $('#' + strId).attr('credittotal');
            var strDAmount = $('#' + strId).attr('debittotal');
            if (strCAmount == strDAmount) {
                $('#' + strId).prop('checked', true);
            }
            else {
                strcount++;
            }
        }
        else {
            $('#' + strId).prop('checked', false);
        }
    }
    if (strcount > 0) {
        ShowMsgBox('showMSG', 'you Can not select In Balance Amount ..!!', '', 'failuremsg');
    }
})

$('#btnSaveAuditPost').click(function () {
    var strcheckBox = $('.clsJEList');
    var strval = '';

    for (var i = 0; i < strcheckBox.length; i++) {
        var strchecked = strcheckBox[i].checked;
        var strid = strcheckBox[i].id;
        if (strchecked == true) {
            strval += $('#' + strid).attr('name') + ',';
        }
    }

    strval = strval.substring(0, strval.length - 1);
    $.ajax({
        url: APIUrlSaveAuditPost + '?JEId=' + strval,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
         .done(function (response)
         { GenrateCOASucess(response); })
         .fail(function (error)
         { ShowMSG(error); })
})


//========================================// Audit Tab JEDetail //==========================================================

function funJEDetails(values) {
    CurrentStatus = 'JEAuditEdit';
    strJournalEntryIdAudit = values;
    $('#DvAuditList').hide();
    // $('#DvAuditListByJEDetail').show();
    $('#btnSaveAuditPost').hide();
    $('#btnSaveAudit').show();
    $('#btnSaveAuditSave').show();
    $('#DvAuditListByJEDetail').show();

    $('#NewDvAuditListByJEDetail').show();
    $('#PeriodAudit').show();
    $('#EditTransactionBreadCrumb').show();
    
    
    $('#DvPostDate').show();
    //
    $('#btnDelete').show();
    $('#btnCancel').show();

    //


    funGetJEntryDetail(values);
    funGetJEDetailList(values);

}
function funGetClosePeriodDetailAudit() {
    $.ajax({
        url: APIUrlCompanyClosePeriod + '?CompanyId=' + $('#ddlCompanyAudit').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetClosePeriodDetailAuditSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetClosePeriodDetailAuditSucess(response) {
    $('#ddlPeriodAudit').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlPeriodAudit').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }

}

function funGetJEntryDetail(values) {

    for (var i = 0; i < GlbCompnayArr.length; i++) {
        $('#ddlCompanyAudit').append('<option value=' + GlbCompnayArr[i].CompanyID + '>' + GlbCompnayArr[i].CompanyCode + '</option>');
    }
    funGetClosePeriodDetailAudit();

    $.ajax({
        url: APIUrlfunGetJEntryDetail + '?JournalEntryId=' + values,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ funGetJEntryDetailSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function funGetJEntryDetailSucess(response) {
    $('#ddlCompanyAudit').val(response[0].CompanyId);
    $('#txtTransactionDateAudit').val(response[0].EntryDate);
    $('#txtDescriptionAudit').val(response[0].Description);
}
function funGetJEDetailList(values) {
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th></th>';

    for (var i = 0; i < ArrSegment.length; i++) {
        strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < ArrTransCode.length; i++) {
        //   var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }

        strHtml += '<th>' + ArrTransCode[i].TransCode + '</th>';

    }

    strHtml += '<th>Debit</th>';
    strHtml += '<th>Credit</th>';
    strHtml += '<th>Vendor</th>';
    strHtml += '<th>3P</th>';
    strHtml += '<th>Tax Code</th>';
    strHtml += '<th style="width:70px;">Notes</th>';
    strHtml += '</tr>';

    $('#tblJEListTheadAudit').html(strHtml);
    //=================== Record Calling

    $.ajax({
        url: APIUrlGetJEDetailList + '?JournalEntryId=' + values,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { funGetJEDetailListSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}

function funGetJEDetailListSucess(response) {
    //var strTaxCode = '<option value="0">Select</option><option value="01">01=Rents</option><option value="02">02=Royalties</option><option value="03">03=Other Income</option><option value="04">0=Federal Income Tax Withheld</option><option value="05">05=Fishing Boat Proceeds</option><option value="06">06=Medical and Health Care Payments</option><option value="07">07=Nonemployee Compensation</option><option value="14">14=Gross Proceeds Paid to an Attorney</option>';
    var CreditAuditAmount = 0;
    var DebitAuditAmount = 0;
    $('#txtPostDate').val(response[0].PostedDate);
    $('#spnTrasactionNoAudit').text(response[0].TransactionLineNumber);
    var strhtml = '';
    for (var j = 0; j < response.length; j++) {
        strAuditCount = response.length;
        var strSplit = [];
        var strCOACode = response[j].COAString;
        if (strCOACode != '') {
            strSplit = strCOACode.split('|');
        }
        var strCOAPval = '';
        strhtml += '<tr id="' + response[j].JournalEntryDetailId + '" class="clsTr" name="' + j + '">';
        strhtml += '<td style="width:30px;"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript:funJEDetailDetail(' + response[j].JournalEntryDetailId + ',' + 1 + ');"></i></span></td>';
        for (var i = 0; i < ArrSegment.length; i++) {
            if (i == 0) { strCOAPval = strSplit[0]; }
            else if (i == 1) { strCOAPval = strSplit[0] + '|' + strSplit[1]; }
            else if (i == 2) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2]; }
            else if (i == 3) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3]; }
            else if (i == 4) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4]; }
            else if (i == 5) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4] + '|' + strSplit[5]; }
            if (ArrSegment[i].SegmentName == 'DT') {
                //var strDetail = strSplit[i].replace(/>/g, ' ');
                var str = strSplit[i].split('>');

                if (str.length > 1) {
                    var strl = str.length;
                    strl = strl - 1;
                    strDetail = str[strl];
                }
                else {
                    strDetail = str[0];
                }
                strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strDetail + '" coacode="' + strCOAPval + '" /></td>';
            }
            else if (ArrSegment[i].SegmentName == 'CO') {
                strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" coacode="' + strCOAPval + '" disabled /></td>';
            }
            else {
                strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" coacode="' + strCOAPval + '" /></td>';
            }
        }
        for (var i = 0; i < ArrOptionalSegment.length; i++) {
            if (i == 0) {
                strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOptional' + j + '   " onblur="javascript:funCheckOptionalAutoFill(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + j + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" AccountId="' + response[j].SetId + '" value="' + response[j].SetAC + '" /></td>';

            }
            else if (i == 1) {
                strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOptional' + j + '   " onblur="javascript:funCheckOptionalAutoFill(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + j + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" AccountId="' + response[j].SeriesId + '" value="' + response[j].SeriesAC + '" /></td>';

            }
            // ArrSegment[i].SegmentName + '_' + ArrSegment[i].SegmentId
        }
        for (var i = 0; i < ArrTransCode.length; i++) {
            strhtml += '<td class="width40"><input type="text"  onblur="javascript:funBlurTrans(' + j + ',\'' + ArrTransCode[i].TransCode + '\');" class="SearchCode clsTransCode' + j + '  clsTransCode_' + strTrCount + '" onfocus="javascript:funTransDetail(' + j + ',' + ArrTransCode[i].TransId + ')" id="txt_' + ArrTransCode[i].TransCode + '_' + j + '" name="' + ArrTransCode[i].TransId + '" /></td>';
            // strhtml += '<td><input type="text" class="SearchCode clsTransCode' + j + ' width40" onfocus="javascript:funTransDetail(' + j + ',' + ArrTransCode[i].TransId + ')" id="txt_' + ArrTransCode[i].TransCode + '_' + j + '" name="' + ArrTransCode[i].TransId + '" /></td>';

        }
        strhtml += '<td class="width40"><input type="text" class="  DebitClass detectTab " onchange="javascript:funDebitCredit(' + strTrCount + ',' + 0 + ');" id="txtDebit_' + j + '" value="' + response[j].DebitAmount + '"/></td>';
        strhtml += '<td class="width40"><input type="text" class="  CreditClass detectTab " onchange="javascript:funDebitCredit(' + strTrCount + ',' + 1 + ');" id="txtCredit_' + j + '" value="' + response[j].CreditAmount + '"/></td>';
        strhtml += '<td id="Vendor_' + strTrCount + '" class="width75"><input type="text" class="SearchVendor  clsVendor " onfocus="javascript:GetVendoreByProdId(' + j + ');" onblur="javascript:funVendorBlur(' + j + ');" id="txtVendor_' + strTrCount + '" value="' + response[j].VendorName + '" name="' + response[j].VendorId + '"/></td>';
        if (response[j].ThirdParty == true) {
            strhtml += '<td class="width40"><input type="checkBox" class="SearchCode cls3p " id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');" checked/></td>';
        }
        else {
            strhtml += '<td class="width40"><input type="checkBox" class="SearchCode cls3p " id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');"/></td>';

        }
        //strhtml += '<td><select class="clsTaxCode" id="TaxCode_' + j + '">' + strTaxCode + '</select></td>';
        strhtml += '<td><input type="text" class="clsTaxCode clsTax number"  onfocus="javascript:funTaxCode(' + j + ');"  id="ddlTaxCode_' + j + '"  value=""/></td>';

        strhtml += '<td class="width95"><input type="text" class=" clsNotes" id="txtNotes_' + j + '" onfocus="javascript:funNoteExplode(' + j + ');" onblur="javascript:funFocusout(' + j + ');" value="' + response[j].Note + '" title="' + response[j].Note + '"/><input type="hidden" class="clsJEId" value="' + response[j].JournalEntryDetailId + '"/><input type="hidden" class="clsCOACode"  id="hdnCode_' + j + '" value="' + response[j].COAString + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + j + '" value="' + response[j].COAId + '"></td>';
        strhtml += '</tr>';


        CreditAuditAmount = CreditAuditAmount + response[j].CreditAmount;
        DebitAuditAmount = DebitAuditAmount + response[j].DebitAmount;

    }
    $('#tblJEListTBodyAudit').html(strhtml);

    var Tcount = response.length;
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            var TransactionvalueString = response[i].TransactionvalueString;
            //   Set:01:1,FF:01:3,T1:02:6,T2:02:8
            var TvstringSplit = TransactionvalueString.split(',');

            for (var j = 0; j < TvstringSplit.length; j++) {
                var strTvs = TvstringSplit[j].split(':');
                $('#txt_' + strTvs[0] + '_' + i).val(strTvs[1]);
                $('#txt_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);
            }
            $('#TaxCode_' + i).val(response[0].TaxCode);
        }

        //for (var i = 0; i < Tcount; i++) {
        //    var TransactionvalueString = response[i].OptionalCodeValueString;
        //    if (TransactionvalueString != '') {
        //        var TvstringSplit = TransactionvalueString.split(',');

        //        for (var j = 0; j < TvstringSplit.length; j++) {
        //            var strTvs = TvstringSplit[j].split(':');
        //            $('#txtOptional_' + i + '_' + j).val(strTvs[1]);
        //            $('#txtOptional_' + i + '_' + j).attr('AccountId', strTvs[2]);
        //        }
        //    }
        //}
    }

    $('#spnDebitAudit').text(DebitAuditAmount);
    $('#spnCreditAudit').text(CreditAuditAmount);
    var AuditAmountTotal = CreditAuditAmount - DebitAuditAmount;
    AuditAmountTotal = Math.abs(AuditAmountTotal);
    $('#txtImBalanceAudit').text(AuditAmountTotal);
    if (CreditAuditAmount == DebitAuditAmount) {
        $('#DvBalImBalAudit').removeClass('red-color');
        $('#DvBalImBalAudit').addClass('green-color');
    }
    else {
        $('#DvBalImBalAudit').removeClass('green-color');
        $('#DvBalImBalAudit').addClass('red-color');
    }
    strAuditCount = strAuditCount - 1;

    // GetTransactionCodeDetail();
}

function funFocusout(value) {
    var strval = $('#txtNotes_' + value).val();
    $('#txtNotes_' + value).removeAttr('title');
    $('#txtNotes_' + value).attr('title', strval);


    var w = $('#txtNotes_' + value).attr('data-default');
    // $('#txtNotes_' + value).animate({ width: w }, 'slow');
}


function GetTransactionCodeDetail() {
    $.ajax({
        url: APIUrlGetTransactionCodeDetail + '?journalEntryId=' + strJournalEntryIdAudit,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetTransactionCodeDetailSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function GetTransactionCodeDetailSucess(response) {
    var Tcount = response.length;
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            var TransactionvalueString = response[i].TransactionvalueString;
            //   Set:01:1,FF:01:3,T1:02:6,T2:02:8
            var TvstringSplit = TransactionvalueString.split(',');

            for (var j = 0; j < TvstringSplit.length; j++) {
                var strTvs = TvstringSplit[j].split(':');
                $('#txt_' + strTvs[0] + '_' + i).val(strTvs[1]);
                $('#txt_' + strTvs[0] + '_' + i).attr('name', strTvs[2]);

            }
        }
    }
}
//========================================= new Row 
function funAuditListJEDetailNewRow() {
    //var strTaxCode = '<option value="0">Select</option><option value="01">01=Rents</option><option value="02">02=Royalties</option><option value="03">03=Other Income</option><option value="04">0=Federal Income Tax Withheld</option><option value="05">05=Fishing Boat Proceeds</option><option value="06">06=Medical and Health Care Payments</option><option value="07">07=Nonemployee Compensation</option><option value="14">14=Gross Proceeds Paid to an Attorney</option>';
    var strCompnayId = $('#ddlCompanyAudit').find("option:selected").text();
    strAuditCount++;
    var strhtml = '';
    strhtml += '<tr  id="' + strAuditCount + '" class="clsTr"  name="' + 0 + '">';
    strhtml += '<td style="width:30px;"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript:funJEDetailDetail(' + strAuditCount + ',' + 0 + ');"></i></span></td>';

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strAuditCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  /></td>';
        }
        else if (ArrSegment[i].SegmentName == 'CO') {
            strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strAuditCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" disabled value="' + strCompnayId + '" coaCode="' + strCompnayId + '" /></td>';
        }
        else {
            strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strAuditCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  /></td>';

        }
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOtional' + strAuditCount + '   " onblur="javascript:funCheckOptionalAutoFill(' + strAuditCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + strAuditCount + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + strAuditCount + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" /></td>';
        // ArrSegment[i].SegmentName + '_' + ArrSegment[i].SegmentId
    }
    for (var i = 0; i < ArrTransCode.length; i++) {
        strhtml += '<td class="width40"><input type="text"   onblur="javascript:funBlurTrans(' + strAuditCount + ',\'' + ArrTransCode[i].TransCode + '\');" class="SearchCode clsTransCode' + strAuditCount + ' " onfocus="javascript:funTransDetail(' + strAuditCount + ',' + ArrTransCode[i].TransId + ')" id="txt_' + ArrTransCode[i].TransCode + '_' + strAuditCount + '" name="' + ArrTransCode[i].TransId + '" /></td>';
    }
    strhtml += '<td class="width40"><input type="text" class="  DebitClass detectTab" onchange="javascript:funDebitCredit(' + strAuditCount + ',' + 0 + ');" id="txtDebit_' + strAuditCount + '" value="' + 0.00 + '"/></td>';
    strhtml += '<td class="width40"><input type="text" class="  CreditClass detectTab" onchange="javascript:funDebitCredit(' + strAuditCount + ',' + 1 + ');" id="txtCredit_' + strAuditCount + '" value="' + 0.00 + '"/></td>';
    strhtml += '<td id="Vendor_' + strAuditCount + '" class="width75"><input type="text" class="SearchVendor   clsVendor " onfocus="javascript:GetVendoreByProdId(' + strAuditCount + ');" onblur="javascript:funVendorBlur(' + strAuditCount + ');" id="txtVendor_' + strAuditCount + '"/></td>';
    strhtml += '<td class="width40"><input type="checkBox" class="SearchCode cls3p  " id="Chk3P_' + strAuditCount + '" onchange="javascript:funCheckBox3P(' + strAuditCount + ');"/></td>';
    //strhtml += '<td><select class="clsTaxCode">' + strTaxCode + '</select></td>';
    strhtml += '<td><input type="text" class="clsTaxCode clsTax number"  onfocus="javascript:funTaxCode(' + strAuditCount + ');"  id="ddlTaxCode_' + strAuditCount + '"  value=""/></td>';
    strhtml += '<td class="width95"><input type="text" class=" clsNotes" id="txtNotes_' + strAuditCount + '" onfocus="javascript:funNoteExplode(' + strAuditCount + ');" onblur="javascript:funFocusout(' + strAuditCount + ');"/><input type="hidden" class="clsJEId" /><input type="hidden" id="hdnCode_' + strAuditCount + '" class="clsCOACode"/><input type="hidden" class="clsCOAId"  id="hdnCOAId_' + strAuditCount + '"></td>';

    strhtml += '</tr>';

    $('#tblJEListTBodyAudit').append(strhtml);
}


function funJEDetailDetail(value, Mode) {

    // mode New =0, response then =1
    if (Mode == 0) {
        $('#' + value).remove();
    }
    else {

        $('#DeletePopup').show();
        $('#fade').show();
        $('#hdnDeleteRowAudit').val(value);
    }
}
function funDeleteRecordAuditTab() {

    $.ajax({
        url: APIUrlDeleteRecordAudit + '?JournalEntryDetailId=' + $('#hdnDeleteRowAudit').val() + '&Type=' + '',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response) {
     //funDeleteRecordAuditTabSucess(response);
     ShowMsgBox('showMSG', 'Record Delete', '', '');
     $('#DeletePopup').hide();
     $('#fade').hide();
     funGetJEDetailList(strJournalEntryIdAudit);
 })
 .fail(function (error)
 { ShowMSG(error); })

}

$('#tblJEListTBodyAudit').delegate('.DebitClass', 'change', function () {
    funCalculationAudit();

})
$('#tblJEListTBodyAudit').delegate('.CreditClass', 'change', function () {
    funCalculationAudit();

})
function funCalculationAudit() {
    var TotalDebit = 0;
    var TotalCredit = 0;
    var TotalImbalance = 0;

    var strDebit = $('.DebitClass');
    var strCredit = $('.CreditClass');
    for (var i = 0; i < strDebit.length; i++) {
        var strId = strDebit[i].id;
        var strAmount = $('#' + strId).val();
        strAmount = strAmount.replace(/,/g, '');
        TotalDebit += parseFloat(strAmount);

        var sstrId = strCredit[i].id;
        var sstrAmount = $('#' + sstrId).val();
        sstrAmount = sstrAmount.replace(/,/g, '');
        TotalCredit += parseFloat(sstrAmount);
    }
    TotalImbalance = TotalDebit - TotalCredit;
    //================
    TotalImbalance = Math.abs(TotalImbalance);
    //=============== Debit
    if (TotalDebit != 0) {
        $('#spnDebitAudit').text(TotalDebit);
    }
    else {
        $('#spnDebitAudit').text(0.00);

    }
    //============== Credit
    if (TotalCredit != 0) {
        $('#spnCreditAudit').text(TotalCredit);
    }
    else {
        $('#spnCreditAudit').text(0.00);

    }
    //================ Imbalance
    if (TotalImbalance != 0) {
        $('#txtImBalanceAudit').text(TotalImbalance);
        $('#DvBalImBalAudit').removeClass('green-color');
        $('#DvBalImBalAudit').addClass('red-color');
        //  $('#spnBalancImBalance').text('ImBalance');

    }
    else {
        $('#txtImBalanceAudit').text(0.00);
        $('#DvBalImBalAudit').addClass('green-color');
        $('#DvBalImBalAudit').removeClass('red-color');
        $('#spnBalancImBalance').text('Balance');
    }
}


function funDeleteJE() {
    $('#DeleteAuditPopup').show();
    $('#fade').show();

}

function funDeleteJEAudit() {
    $.ajax({
        url: APIUrlfunDeleteJEAudit + '?JournalEntryId=' + strJournalEntryIdAudit,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response) {
    //funDeleteRecordAuditTabSucess(response);

    funAuditTabJEList();
    $('#DeleteAuditPopup').hide();
    $('#fade').hide();
})
.fail(function (error)
{ ShowMSG(error); })
}
function funCancelJE() {
    $('#CancelAuditPopup').show();
    $('#fade').show();

}

function funCancelJEAudit() {
    funJEDetails(strJournalEntryIdAudit);

    $('#CancelAuditPopup').hide();
    $('#fade').hide();

}
//========================================== Save & Post

$('#btnSaveAudit').click(function () {

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
    if ($('#txtImBalanceAudit').text() == '0') {
        if (isvalid == '') {
            funAuditTabSave('Posted');
        }
    }
    else {
        ShowMsgBox('showMSG', 'Transaction is not in Balance ..!!', '', '');
    }



    // funDeleteAllJED();
});
$('#btnSaveAuditSave').click(function () {
    CheckValidationAuditSave();
    // funDeleteAllJED();
});

function CheckValidationAuditSave() {
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

    if (isvalid == '') {
        funAuditTabSave('Saved');
    }
}


function funDeleteAllJED() {
    $.ajax({
        url: APIUrlDeleteRecordAudit + '?JournalEntryDetailId=' + strJournalEntryIdAudit + '&Type=' + 'All',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
  .done(function (response) {
      funAuditTabSave();

  })
  .fail(function (error)
  { ShowMSG(error); })
}

function funAuditTabSave(value) {
    var ArrJEDetail = [];
    var strDebitAmount = $('#spnDebitAudit').text();
    var strCreditAmount = $('#spnCreditAudit').text();
    var strImAmount = $('#txtImBalanceAudit').text();

    alert($('#txtDescriptionAudit').val());
    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: strJournalEntryIdAudit
        //  TransactionNumber:
               , Source: $('#ddlTypeAudit').val()
               , Description: $('#txtDescriptionAudit').val()
               , EntryDate: strDate
               , DebitTotal: strDebitAmount
               , CreditTotal: strCreditAmount
               , TotalLines: ''
               , ImbalanceAmount: strImAmount
               , AuditStatus: value
               , PostedDate: $('#txtPostDate').val()
               , ReferenceNumber: ''
               , BatchNumber: BatchManager.BatchNumber
               , ProdId: localStorage.ProdId
               , createdBy: localStorage.UserId
               , ClosePeriod: $('#ddlPeriodAudit').val()
               , CompanyId: $('#ddlCompanyAudit').val()
    }
    ////////////////////////////////////////////////////////////////////////// JE End
    var JEDetailId = $('.clsJEId');
    var DAmount = $('.DebitClass');
    var CAmount = $('.CreditClass');
    var VendorName = $('.clsVendor');
    var ThirdParty = $('.cls3p');
    var Note = $('.clsNotes');
    var strCOACode = $('.clsCOACode');
    var strCOAId = $('.clsCOAId');
    var strTr = $('.clsTr');
    var strTaxCode = $('.clsTaxCode');

    for (var i = 0; i < strTr.length; i++) {
        var strId = strTr[i].id;

        var strId = $('#' + strId).attr('name');
        var TransString = '';
        var strOptionalString = '';
        var strSet = '';
        var strSeires = '';


        var strOptional = $('.clsOptional' + strId);

        for (var j = 0; j < strOptional.length; j++) {
            var strid = strOptional[j].id;

            var strvalue = $('#' + strid).attr('name');
            var strAccountId = $('#' + strid).attr('AccountId');
            //if (strTransValueId != undefined) {
            //    strOptionalString += strvalue;
            //    strOptionalString += ':' + strTransValueId + ',';
            //}

            if (j == 0) {
                strSet = strAccountId;
            }
            else if (j == 1) {
                strSeires = strAccountId;
            }

        }
        strOptionalString = strOptionalString.slice(0, -1);





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
        TransString = TransString.slice(0, -1);
        var FJEDetailId = JEDetailId[i].value;
        //  var FinalJEId = $('#' + FJEDetailId).attr('name');
        var FDebitAmount = DAmount[i].value;
        var FCreditAmount = CAmount[i].value;
        var FVendorName = VendorName[i].value;
        var strVId = VendorName[i].id;
        var FVendorId = $('#' + strVId).attr('name');
        var FThirdParty = ThirdParty[i].checked;
        var FNote = Note[i].value;
        var FstrCOACode = strCOACode[i].value;
        var FstrCOAId = strCOAId[i].value;
        var FstrTaxCode = strTaxCode[i].value;

        var objJEDetail = {
            JournalEntryId: ''
                            , JournalEntryDetailId: FJEDetailId
                            , TransactionLineNumber: $('#spnTrasactionNoAudit').text()
                            , COAId: FstrCOAId
                            , DebitAmount: FDebitAmount
                            , CreditAmount: FCreditAmount
                            , VendorId: FVendorId
                            , VendorName: FVendorName
                            , ThirdParty: FThirdParty
                            , Note: FNote
                            , CompanyId: ''
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

      .done(function (response)
      { funSaveJEAuditSucess(response, value); })
      .fail(function (error)
      { ShowMSG(error); })
}
function funSaveJEAuditSucess(response, value) {
    if (value == 'Posted') {
        ShowMsgBox('showMSG', 'Transaction is Posted  Successfully ..!!', '', '');

    }
    else {
        ShowMsgBox('showMSG', 'Transaction is Saved Successfully ..!!', '', '');

    }

    // $("#myTabs li:eq(3) a").tab('show');

    $('#DvAuditList').show();
    $('#DvAuditListByJEDetail').hide();
    funAuditTabJEList();

}

//==================================================== // JE History //================================================
function funPostingHistory() {
    CleanAllHtmlTable();
    $('#LiBreadCrumb').text('JE History');
    $('#btnSaveAuditPost').hide();
    $('#btnSaveJE').hide();
    $('#btnSaveAudit').hide();
    $('#btnSaveAuditSave').hide();
    $('#btnSaveAuditSave').hide();
    $('#btnSaveDCSave').hide();

    $('#tblJEPostingHistory').hide();
    $('#JHistoryAuditListByJEDetail').hide();
    $('#jperiod').hide();
    $('#JhistoryTransactionBreadCrumb').hide();

    $('#tblJEListPsoting').show();
    //
    $('#btnDelete').hide();
    $('#btnCancel').hide();

    //

    // $('#btnSaveAuditPost').hide();

    CurrentStatus = 'JEPosting';


    //var strHtml = '';
    //strHtml += '<tr>';
    //strHtml += '<th>Transaction #</th>';
    //for (var i = 0; i < ArrSegment.length; i++) {
    //    strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
    //    if (ArrSegment[i].SegmentName == 'Detail') {
    //        break;
    //    }
    //}
    //strHtml += '<th>Debit</th>';
    //strHtml += '<th>Credit</th>';
    //strHtml += '<th>Vendor</th>';
    //strHtml += '<th>3P</th>';
    //strHtml += '<th>User</th>';
    //strHtml += '<th>Notes</th>';

    //strHtml += '</tr>';
    //$('#tblJEPostingHistoryThead').html(strHtml);


    //==================================================

    //funPostingList();
    GetVendoreByProdId('all');


}
function funPostingList() {
    $('#tblJEListPsoting').show();
    $('#tblJEPostingHistory').hide();
    $('#JHistoryAuditListByJEDetail').hide();
    $('#jperiod').hide();
    $('#JhistoryTransactionBreadCrumb').hide();
    var EntryTo = 0;
    var EntryFrom = 0;
    var strvendor = '';
    var strCheck = 0;

    if ($('#txtEntryTo').val() != '') {
        EntryTo = $('#txtEntryTo').val();
    }
    if ($('#txtEntryFrom').val() != '') {
        EntryFrom = $('#txtEntryFrom').val();
    }
    else {
        EntryFrom = $('#txtEntryTo').val();

    }
    if ($('#txtVendorName').val() != '') {
        strvendor = $('#txtVendorName').val();
    }
    //if ($('#chkpartyVendor').prop('checked') == true) {
    //    strCheck = 1;
    //}


    $.ajax({
        url: APIUrlPostingHistory + '?ProdId=' + localStorage.ProdId + '&StartTransaction=' + EntryTo + '&EndTransaction=' + EntryFrom,
        //+ '&ThirdParty=' + $('#chkpartyVendor').prop('checked') + '&VendorName=' + strvendor
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ funPostingHistorySucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function funPostingHistorySucess(response) {


    var Tcount = response.length;

    var strHtml = '';
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            //"1234255364".replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            var CreditTotal = response[i].CreditTotal;
            CreditTotal = '$ ' + (CreditTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            var DebitTotal = response[i].DebitTotal;
            DebitTotal = '$ ' + (DebitTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            strHtml += '<tr>';
            strHtml += '<td><span onclick="javascript:funReverse(' + response[i].JournalEntryId + ');"><i class="fa fa-circle" aria-hidden="true" ></i></span></td>';
            //<input type="checkBox" class="clsJEList" id="Chk' + response[i].JournalEntryId + '" name="' + response[i].JournalEntryId + '"/>
            strHtml += '<td><a href=# style="color: #337ab7;" onclick="javascript:funJEDetailsPosting(' + response[i].JournalEntryId + ');">' + response[i].TransactionNumber + '</a></td>';
            strHtml += '<td>' + '-' + '</td>';
            strHtml += '<td>' + CreditTotal + '</td>';
            strHtml += '<td>' + DebitTotal + '</td>';
            strHtml += '<td>' + response[i].TotalLines + '</td>';
            strHtml += '<td>' + '-' + '</td>';
            strHtml += '<td>' + '-' + '</td>';
            strHtml += '<td>' + response[i].PostedDate + '</td>';


            strHtml += '</tr>';
        }
    } else {
        strHtml += '<tr><td colspan="' + 8 + '" style="text-align: center;">No Record Found.. !!</td></tr>';
    }

    $('#tblJEListPostingTBody').html(strHtml);
}


function funJEDetailsPosting(value) {

    $('#tblJEListPsoting').hide();
    $('#tblJEPostingHistory').show();
    $('#JHistoryAuditListByJEDetail').show();
    $('#jperiod').show();
    $('#JhistoryTransactionBreadCrumb').show();
    funPostingHistoryJE(value);
    var strHtml = '';
    strHtml += '<tr>';
    // strHtml += '<td></td>';

    for (var i = 0; i < ArrSegment.length; i++) {
        strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < ArrTransCode.length; i++) {
        strHtml += '<th>' + ArrTransCode[i].TransCode + '</th>';
    }

    strHtml += '<th>Debit</th>';
    strHtml += '<th>Credit</th>';
    strHtml += '<th>Vendor</th>';
    strHtml += '<th>3P</th>';
    strHtml += '<th>TaxCode</th>';

    strHtml += '<th style="width:250px;">Notes</th>';

    strHtml += '</tr>';

    $('#tblJEPostingHistoryThead').html(strHtml);
    //=================== Record Calling

    $.ajax({
        url: APIUrlGetJEDetailList + '?JournalEntryId=' + value,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { funGetJEDetailListPostingSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}
function funGetJEDetailListPostingSucess(response) {
    var strhtml = '';
    for (var j = 0; j < response.length; j++) {


        strAuditCount = response.length;
        var strSplit = [];
        var strCOACode = response[j].COAString;
        if (strCOACode != '') {
            strSplit = strCOACode.split('|');
            if (j == 0) {
                $('#spnCompanyPH').text(strSplit[0]);
            }
        }
        strhtml += '<tr id="' + response[j].JournalEntryDetailId + '" class="clsTr" name="' + j + '">';
        //strhtml += '<td></td>';
        for (var i = 0; i < ArrSegment.length; i++) {
            if (ArrSegment[i].SegmentName == 'DT') {
                var strDetail = strSplit[i].replace(/>/g, ' ');
                strhtml += '<td>' + strDetail + '</td>';
            }
            else {
                strhtml += '<td>' + strSplit[i] + '</td>';

            }
        }
        for (var i = 0; i < ArrOptionalSegment.length; i++) {
            if (i == 0) {
                strhtml += '<td><span id="txtOptional_' + j + '_' + i + '">' + response[j].SetAC + '</span></td>';
            }
            else if (i == 1) {
                strhtml += '<td><span id="txtOptional_' + j + '_' + i + '">' + response[j].SeriesAC + '</span></td>';

            }
        }
        for (var i = 0; i < ArrTransCode.length; i++) {
            strhtml += '<td><span id="txt_' + ArrTransCode[i].TransCode + '_' + j + '"></span></td>';
        }
        strhtml += '<td>' + response[j].DebitAmount + '</td>';
        strhtml += '<td>' + response[j].CreditAmount + '</td>';
        strhtml += '<td id="Vendor_' + strTrCount + '">' + response[j].VendorName + '</td>';
        if (response[j].ThirdParty == true) {
            strhtml += '<td><input type="checkBox" disabled class="SearchCode cls3p width40" id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');" checked/></td>';
        }
        else {
            strhtml += '<td><input disabled type="checkBox" class="SearchCode cls3p width40" id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');"/></td>';
        }
        strhtml += '<td>' + response[j].TaxCode + '</td>';

        strhtml += '<td>' + response[j].Note + '</td>';
        strhtml += '</tr>';
    }
    $('#tblJEPostingHistoryTBody').html(strhtml);

    var Tcount = response.length;
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            var TransactionvalueString = response[i].TransactionvalueString;
            var TvstringSplit = TransactionvalueString.split(',');

            for (var j = 0; j < TvstringSplit.length; j++) {
                var strTvs = TvstringSplit[j].split(':');
                $('#txt_' + strTvs[0] + '_' + i).text(strTvs[1]);
                $('#txt_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);
            }
        }

    }

}
function funPostingHistoryJE(value) {
    $.ajax({
        url: APIUrlfunGetJEntryDetail + '?JournalEntryId=' + value,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { funPostingHistoryJESucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}

function funPostingHistoryJESucess(response) {

    $('#spnTrasactionDatePH').text(response[0].EntryDate);
    $('#spnDescriptionPH').text(response[0].Description);
}


function funReverse(value) {

    $.ajax({
        url: APIUrlGetfunReverse + '?JournalEntryId=' + value,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { funReverseSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}

function funReverseSucess(response) {
    ShowMsgBox('showMSG', 'Transaction reverted Successfully..!!', '', '');
    funPostingList();

}
//============================// Border Red //===================
$(document).on('keydown', 'input.detectTab', function (e) {
    var strId = e.currentTarget.id;
    var strVal = $('#' + strId).val();
    $('#' + strId).blur(function () {
        isvalid = false;
        if (strVal == '' || strVal == undefined || strVal == null) {

            // $('#' + strId).attr('style', 'border-color:red;');
            return false;
        }
        else {

            $('#' + strId).attr('style', 'border-color:#d2d6de;');
            return true;
        }
    });
});

//=================================// Show Error //==============================
function ShowMSG(error) {
    console.log(error);
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
//============================ ========================///////////////////////////////////////////////// D Changes
function funDistributionChange() {
    CleanAllHtmlTable();
    CurrentStatus = 'JEDistributionChange';
    $('#LiBreadCrumb').text('DC');
    $('#tblJEListDC').show();
    $('#tblJEDForDC').hide();
    $('#btnSaveDCSave').hide();
    $('#btnSaveAuditPost').hide();
    $('#btnSaveJE').hide();
    $('#btnDelete').hide();
    $('#btnCancel').hide();

    //===============================================
    //var strHtml1 = '';
    //strHtml1 += '<tr>';
    //strHtml1 += '<th>Transaction #</th>';
    //strHtml1 += '<th>Vendor</th>';
    //strHtml1 += '<th>Ref #</th>';
    //strHtml1 += '<th>3P Vendor</th>';

    //for (var i = 0; i < ArrSegment.length; i++) {

    //    strHtml1 += '<th>' + ArrSegment[i].SegmentName + '</th>';
    //    if (ArrSegment[i].SegmentName == 'Detail') {
    //        break;
    //    }

    //}
    //for (var i = 0; i < ArrTransCode.length; i++) {
    //    strHtml1 += '<th>' + ArrTransCode[i].TransCode + '</th>';
    //}
    //strHtml1 += '<th>Amount</th>';
    //strHtml1 += '<th>Description</th>';
    //strHtml1 += '<th>Source</th>';
    //strHtml1 += '</tr>';
    //$('#tblDistributionThead').html(strHtml1);

    //===============================================

}
function funDCFilter() {

    $('#tblJEDForDC').hide();
    $('#tblJEListDC').show();

    var EntryTo = 0;
    var EntryFrom = 0;
    if ($('#txtDCTransTo').val() != '') {
        EntryTo = $('#txtDCTransTo').val();
    }
    if ($('#txtDCTransFrom').val() != '') {
        EntryFrom = $('#txtDCTransFrom').val();
    }
    else {
        EntryFrom = $('#txtDCTransTo').val();

    }


    $.ajax({
        url: APIUrlPostingHistory + '?ProdId=' + localStorage.ProdId + '&StartTransaction=' + EntryTo + '&EndTransaction=' + EntryFrom,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        //  url: APIUrlAuditTabJEList + '?ProdId=' + localStorage.ProdId + '&AuditStatus=' + 'Audit',
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
       .done(function (response)
       { DistributionChangeSucess(response); })
       .fail(function (error)
       { ShowMSG(error); })
}
function DistributionChangeSucess(response) {
    var Tcount = response.length;
    var strHtml = '';
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            //"1234255364".replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            var CreditTotal = response[i].CreditTotal;
            CreditTotal = '$ ' + (CreditTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            var DebitTotal = response[i].DebitTotal;
            DebitTotal = '$ ' + (DebitTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            strHtml += '<tr>';
            strHtml += '<td><input type="checkBox" class="clsJEList" id="Chk' + response[i].JournalEntryId + '" name="' + response[i].JournalEntryId + '"/></td>';
            strHtml += '<td><a href=# style="color: #337ab7;" onclick="javascript:funJEDetailsForDC(' + response[i].JournalEntryId + ');">' + response[i].TransactionNumber + '</a></td>';
            strHtml += '<td>' + response[i].CO + '</td>';
            strHtml += '<td>' + response[i].Source + '</td>';

            strHtml += '<td>' + CreditTotal + '</td>';
            strHtml += '<td>' + DebitTotal + '</td>';
            strHtml += '<td>' + response[i].TotalLines + '</td>';
            strHtml += '<td>' + '-' + '</td>';
            strHtml += '<td>' + '-' + '</td>';
            strHtml += '</tr>';

        }
    }
    else {
        strHtml += '<tr><td colspan="' + 8 + '" style="text-align: center;">No Record Found.. !!</td></tr>';
    }
    $('#tblJEListDCTBody').html(strHtml);
}

function funJEDetailsForDC(value) {
    strJournalEntryIdAudit = 0;
    $('#btnSaveAuditSave').hide();
    $('#btnSaveAudit').hide();
    $('#tblJEDForDC').show();
    $('#tblJEListDC').hide();
    strJournalEntryIdAudit = value;

    //=====================
    var strHtml = '';
    strHtml += '<tr>';
    // strHtml += '<td></td>';

    for (var i = 0; i < ArrSegment.length; i++) {
        strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strHtml += '<th>' + ArrOptionalSegment[i].SegmentName + '</th>';
    }
    for (var i = 0; i < ArrTransCode.length; i++) {
        //   var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }

        strHtml += '<th>' + ArrTransCode[i].TransCode + '</th>';

    }

    strHtml += '<th>Debit</th>';
    strHtml += '<th>Credit</th>';
    strHtml += '<th>Vendor</th>';
    strHtml += '<th>3P</th>';
    strHtml += '<th>TaxCode</th>';
    strHtml += '<th style="width:250px;">Notes</th>';

    strHtml += '</tr>';

    $('#tblJEDForDCTHead').html(strHtml);
    //=================== Record Calling

    $.ajax({
        url: APIUrlGetJEDetailList + '?JournalEntryId=' + value,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { funJEDetailsForDCSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}

function funJEDetailsForDCSucess(response) {
    $('#btnSaveDCSave').show();
    var CreditAuditAmount = 0;
    var DebitAuditAmount = 0;
    $('#txtPostDate').val(response[0].PostedDate);
    $('#spnTrasactionNoDC').text(response[0].TransactionLineNumber);
    var strhtml = '';
    for (var j = 0; j < response.length; j++) {
        strAuditCount = response.length;
        var strSplit = [];
        var strCOACode = response[j].COAString;
        if (strCOACode != '') {
            strSplit = strCOACode.split('|');
        }
        var strCOAPval = '';
        strhtml += '<tr id="' + response[j].JournalEntryDetailId + '" class="clsTr" name="' + j + '">';
        // strhtml += '<td></td>';
        for (var i = 0; i < ArrSegment.length; i++) {

            //------------------------------------------ //----------Important Code---------------------//---------------------
            if (i == 0) { strCOAPval = strSplit[0]; }
            else if (i == 1) { strCOAPval = strSplit[0] + '|' + strSplit[1]; }
            else if (i == 2) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2]; }
            else if (i == 3) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3]; }
            else if (i == 4) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4]; }
            else if (i == 5) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4] + '|' + strSplit[5]; }

            if (ArrSegment[i].SegmentName == 'DT') {
                //var strDetail = strSplit[i].replace(/>/g, ' ');
                var str = strSplit[i].split('>');

                if (str.length > 1) {
                    var strl = str.length;
                    strl = strl - 1;
                    strDetail = str[strl];
                }
                else {
                    strDetail = str[0];
                }
                strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strDetail + '"  coacode="' + strCOAPval + '"/></td>';
            }
            else if (ArrSegment[i].SegmentName == 'CO') {
                strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '"  coacode="' + strCOAPval + '" disabled/></td>';

            }
            else {
                strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:funCheckNextValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" coacode="' + strCOAPval + '" /></td>';
            }
        }
        for (var i = 0; i < ArrOptionalSegment.length; i++) {

            if (i == 0) {
                strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOptional' + j + '   " onblur="javascript:funCheckOptionalAutoFill(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + j + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" AccountId="' + response[j].SetId + '" value="' + response[j].SetAC + '" /></td>';

            }
            else if (i == 1) {
                strhtml += '<td class="width40"><input type="text"  class="SearchOptionalCode clsOptional' + j + '   " onblur="javascript:funCheckOptionalAutoFill(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:GetOptional(' + j + ',\'' + ArrOptionalSegment[i].SegmentName + '\',' + i + ');" id="txtOptional_' + j + '_' + i + '" name="' + ArrOptionalSegment[i].SegmentLevel + '" AccountId="' + response[j].SeriesId + '" value="' + response[j].SeriesAC + '" /></td>';

            }
        }
        for (var i = 0; i < ArrTransCode.length; i++) {
            strhtml += '<td class="width40"><input type="text"  onblur="javascript:funBlurTrans(' + j + ',\'' + ArrTransCode[i].TransCode + '\');" class="SearchCode clsTransCode' + j + '  clsTransCode_' + strTrCount + '" onfocus="javascript:funTransDetail(' + j + ',' + ArrTransCode[i].TransId + ')" id="txt_' + ArrTransCode[i].TransCode + '_' + j + '" name="' + ArrTransCode[i].TransId + '" /></td>';
        }
        strhtml += '<td class="width40"><input type="text" disabled class="  DebitClass detectTab " onchange="javascript:funDebitCredit(' + strTrCount + ',' + 0 + ');" id="txtDebit_' + j + '" value="' + response[j].DebitAmount + '"/></td>';
        strhtml += '<td class="width40"><input type="text" disabled class="  CreditClass detectTab " onchange="javascript:funDebitCredit(' + strTrCount + ',' + 1 + ');" id="txtCredit_' + j + '" value="' + response[j].CreditAmount + '"/></td>';
        strhtml += '<td id="Vendor_' + strTrCount + '" class="width75"><input type="text" disabled class="SearchVendor  clsVendor " onfocus="javascript:GetVendoreByProdId(' + j + ');" onblur="javascript:funVendorBlur(' + j + ');" id="txtVendor_' + strTrCount + '" value="' + response[j].VendorName + '" name="' + response[j].VendorId + '"/></td>';
        if (response[j].ThirdParty == true) {
            strhtml += '<td class="width40"><input type="checkBox" disabled class="SearchCode cls3p " id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');" checked/></td>';
        }
        else {
            strhtml += '<td class="width40"><input type="checkBox" disabled class="SearchCode cls3p " id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');"/></td>';
        }
        strhtml += '<td><input type ="text" disabled value="' + response[j].TaxCode + '"/></td>'
        strhtml += '<td class="width95"><input type="text" disabled  class=" clsNotes" id="txtNotes_' + j + '" onblur="javascript:funFocusout(' + j + ');" value="' + response[j].Note + '" title="' + response[j].Note + '"/><input type="hidden" class="clsJEId" value="' + response[j].JournalEntryDetailId + '"/><input type="hidden" class="clsCOACode"  id="hdnCode_' + j + '" value="' + response[j].COAString + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + j + '" value="' + response[j].COAId + '"></td>';
        strhtml += '</tr>';


        // CreditAuditAmount = CreditAuditAmount + response[j].CreditAmount;
        // DebitAuditAmount = DebitAuditAmount + response[j].DebitAmount;

    }
    $('#tblJEDForDCTBody').html(strhtml);

    var Tcount = response.length;
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            var TransactionvalueString = response[i].TransactionvalueString;
            //   Set:01:1,FF:01:3,T1:02:6,T2:02:8
            var TvstringSplit = TransactionvalueString.split(',');

            for (var j = 0; j < TvstringSplit.length; j++) {
                var strTvs = TvstringSplit[j].split(':');
                $('#txt_' + strTvs[0] + '_' + i).val(strTvs[1]);
                $('#txt_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);
            }
        }

        //for (var i = 0; i < Tcount; i++) {
        //    var TransactionvalueString = response[i].OptionalCodeValueString;
        //    if (TransactionvalueString != '') {
        //        var TvstringSplit = TransactionvalueString.split(',');

        //        for (var j = 0; j < TvstringSplit.length; j++) {
        //            var strTvs = TvstringSplit[j].split(':');
        //            $('#txtOptional_' + i + '_' + j).val(strTvs[1]);
        //            $('#txtOptional_' + i + '_' + j).attr('AccountId', strTvs[2]);
        //        }
        //    }
        //}
    }


    $('#spnDebitDC').text(DebitAuditAmount);
    $('#spnCreditDC').text(CreditAuditAmount);
    var AuditAmountTotal = CreditAuditAmount - DebitAuditAmount;
    AuditAmountTotal = Math.abs(AuditAmountTotal);
    $('#txtImBalanceDC').text(AuditAmountTotal);
    if (CreditAuditAmount == DebitAuditAmount) {
        $('#DvBalImBalAudit').removeClass('red-color');
        $('#DvBalImBalAudit').addClass('green-color');
    }
    else {
        $('#DvBalImBalAudit').removeClass('green-color');
        $('#DvBalImBalAudit').addClass('red-color');
    }
    strAuditCount = strAuditCount - 1;
}

$('#btnSaveDCSave').click(function () {
    funSaveDC();
})
function funSaveDC() {
    var ArrJEDetail = [];
    var strDebitAmount = $('#spnDebitDC').text();
    var strCreditAmount = $('#spnCreditDC').text();
    var strImAmount = $('#txtImBalanceDC').text();
    // strJournalEntryIdAudit = values;
    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: strJournalEntryIdAudit
        //  TransactionNumber:
               , Source: 'JE'
               , Description: 'EMS'
               , EntryDate: strDate
               , DebitTotal: strDebitAmount
               , CreditTotal: strCreditAmount
               , TotalLines: ''
               , ImbalanceAmount: strImAmount
               , AuditStatus: 'Saved'
               , PostedDate: $('#txtPostDate').val()
               , ReferenceNumber: ''
               , BatchNumber: BatchManager.BatchNumber
               , ProdId: localStorage.ProdId
               , createdBy: localStorage.UserId
    }
    ////////////////////////////////////////////////////////////////////////// JE End
    var JEDetailId = $('.clsJEId');
    var DAmount = $('.DebitClass');
    var CAmount = $('.CreditClass');
    var VendorName = $('.clsVendor');
    var ThirdParty = $('.cls3p');
    var Note = $('.clsNotes');
    var strCOACode = $('.clsCOACode');
    var strCOAId = $('.clsCOAId');
    var strTr = $('.clsTr');

    for (var i = 0; i < strTr.length; i++) {
        var strId = strTr[i].id;

        var strId = $('#' + strId).attr('name');
        var TransString = '';
        var strOptionalString = '';
        var strSet = '';
        var strSeires = '';


        var strOptional = $('.clsOptional' + strId);

        for (var j = 0; j < strOptional.length; j++) {
            var strid = strOptional[j].id;

            var strvalue = $('#' + strid).attr('name');
            var strAccountId = $('#' + strid).attr('AccountId');

            if (j == 0) {
                strSet = strAccountId;
            }
            else if (j == 1) {
                strSeires = strAccountId;
            }

        }
        strOptionalString = strOptionalString.slice(0, -1);

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
        TransString = TransString.slice(0, -1);
        var FJEDetailId = JEDetailId[i].value;
        //  var FinalJEId = $('#' + FJEDetailId).attr('name');
        var FDebitAmount = DAmount[i].value;
        var FCreditAmount = CAmount[i].value;
        var FVendorName = VendorName[i].value;
        var strVId = VendorName[i].id;
        var FVendorId = $('#' + strVId).attr('name');
        var FThirdParty = ThirdParty[i].checked;
        var FNote = Note[i].value;
        var FstrCOACode = strCOACode[i].value;
        var FstrCOAId = strCOAId[i].value;


        var objJEDetail = {
            JournalEntryId: ''
                            , JournalEntryDetailId: FJEDetailId
                            , TransactionLineNumber: $('#spnTrasactionNoDC').text()
                            , COAId: FstrCOAId
                            , DebitAmount: FDebitAmount
                            , CreditAmount: FCreditAmount
                            , VendorId: FVendorId
                            , VendorName: FVendorName
                            , ThirdParty: FThirdParty
                            , Note: FNote
                            , CompanyId: ''
                            , ProdId: localStorage.ProdId
                            , CreatedBy: localStorage.UserId
                            , COAString: FstrCOACode
                            , TransactionCodeString: TransString
                            , SetId: strSet
                            , SeriesId: strSeires
        }
        ArrJEDetail.push(objJEDetail);
    }

    var finalObj = {
        objJE: objJournalEntry,
        objJEDetail: ArrJEDetail
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

      .done(function (response)
      { funSaveDCSucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
}
function funSaveDCSucess(response) {
    funDistributionChange();
}
//================
$(document).on('keydown', function (event) {

    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        if (CurrentStatus == 'JEManulEntry') {
            if (strJECount == 0) {
                funAddJournalEntry();
                strJECount++;
            }
            else {
                funTrCreate();
            }
        }
        else if (CurrentStatus == 'JEAuditEdit') {
            funAuditListJEDetailNewRow();
        }

    }
    if (event.altKey === true && key === 83) {
        if (CurrentStatus == 'JEManulEntry') {
            CheckSaveMJEvalidation();
        }
        else if (CurrentStatus == 'JEAuditEdit') {
            CheckValidationAuditSave();
        }
    }

});

$('#tblManualEntryTBody').delegate('.clsNotes', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    if (event.which === 9) {
        if (CurrentStatus == 'JEManulEntry') {
            var $this = $(this)
            funTrCreate();
            var strId = $this.attr('id');
            var strSplit = strId.split('_');

            funSetPreviousRecord(strSplit[1]);
            //alert($this.attr('id'));
        }
    }
});

$('#tblJEListTBodyAudit').delegate('.clsNotes', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    if (event.which === 9) {
        if (CurrentStatus == 'JEAuditEdit') {
            var $this = $(this)
            funAuditListJEDetailNewRow();
            var strId = $this.attr('id');
            var strSplit = strId.split('_');

            funSetPreviousRecord(strSplit[1]);
            //alert($this.attr('id'));
        }
    }
});


function funSetPreviousRecord(value) {

    if (CurrentStatus == 'JEManulEntry') {
        var TrId = strTrCount - 1;
    }
    else if (CurrentStatus == 'JEAuditEdit') {
        var TrId = strTrCount
    }
    for (var i = 0; i < ArrSegment.length; i++) {
        var strval = $('#txt_' + value + '_' + i).val();
        var strCode = $('#txt_' + value + '_' + i).attr('coacode');
        var strcoaid = $('#txt_' + value + '_' + i).attr('coaid');

        $('#txt_' + TrId + '_' + i).val(strval);
        $('#txt_' + TrId + '_' + i).attr('coacode', strCode);
        $('#txt_' + TrId + '_' + i).attr('coaid', strcoaid);

    }

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

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') {
            var stri = i - 1;
            $('#txt_' + TrId + '_' + stri).focus();

        }
    }
}



//================================ Clean All Table Body
function CleanAllHtmlTable() {
    $('#DvPostDate').hide();
    $('#tblJEDForDCTBody').html('');
    $('#tblManualEntryTBody').html(''); //manul
    $('#tblJEListTBody').html(''); //Audit
    $('#tblJEListTBodyAudit').html(''); //Audit Edit

    $('#tblJEPostingHistoryTBody').html('');
    $('#tblJEListDCTBody').html('');//DC
    $('#tblJEDForDCTBody').html('');   //DC Edit


}

//===================================

function ShowhideFilter() {

    //  alert($("#DvCriteria").css('display'));
    if ($("#DvCriteria").css('display') == 'none') {
        $('#DvCriteria').show();
        $('#DvTab').hide();
        funFilterCreate();
        funAddFilter();
    }
    else {
        $('#DvCriteria').hide();
        $('#DvTab').show();
    }
}
function funFilterCreate() {
    var strhtml = '';
    strhtml += '<tr><td>Company</td><td><select id="ddlFilterCompany"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Currency</td><td><select id="ddlFilterCurrency"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Period</td><td><select id="ddlFilterPeriod"></select></td></tr>';
    strhtml += '<tr><td>Document #	</td><td><select id="ddlFilterCompany"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Trasaction Date	</td><td>From <input type="text" id="txtInvoiceNoS" class="datepicker "> To <input class="datepicker " type="text" id="txtInvoiceNoEnd"></td></tr>';
    strhtml += '<tr><td>Type</td><td><select id="ddlFilterType"></td></tr>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'LO') {
            strhtml += '<tr><td>Location</td><td><input class="SearchCodeFilter" type="text" id="txt_LO" onfocus="javascript:funFilterCoa(' + i + ',' + '0' + ');"></tr>';
        }
        if (ArrSegment[i].SegmentName == 'EP') {
            strhtml += '<tr><td>Episode</td><td><input class="SearchCodeFilter" type="text" id="txt_EP" onfocus="javascript:funFilterCoa(' + i + ',' + '0' + ');"></td></tr>';
        }
        if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<tr><td>Account</td><td><input class="SearchCodeFilter" type="text" id="txt_DT" onfocus="javascript:funFilterCoa(' + i + ',' + '0' + ');"></td></tr>';
            // To <input type="text" class="SearchCodeFilter" id="txt_DT1" onfocus="javascript:funFilterCoa(' + i + ',' + '1' + ');">
        }
    }
    strhtml += '<tr><td>Vendor</td><td><select id="ddlFilterVendor"><input type="hidden" id="hdnCOA"><input type="hidden" id="hdnCOA1"></td></tr>';
    $('#TblEditCriteriaTBody').html(strhtml);
    $(".datepicker").datepicker();
}
function funAddFilter() {
    $('#ddlFilterCompany').html(''); $('#ddlFilterPeriod').html(''); $('#ddlFilterVendor').html('');
    for (var i = 0; i < GlbCompnayArr.length; i++) {
        $('#ddlFilterCompany').append('<option value=' + GlbCompnayArr[i].CompanyID + '>' + GlbCompnayArr[i].CompanyCode + '</option>');
    }
    for (var i = 0; i < GlbClosePeriod.length; i++) {
        $('#ddlFilterPeriod').append('<option value="' + GlbClosePeriod[i].ClosePeriodId + '">' + GlbClosePeriod[i].PeriodStatus + '</option>');
    }
    for (var i = 0; i < GlbType.length; i++) {
        $('#ddlFilterType').append('<option value="' + GlbType[i].Type + '">' + GlbType[i].Type + '</option>');
    }
    $('#ddlFilterType').multiselect();
    for (var i = 0; i < GlbVendorList.length; i++) {
        $('#ddlFilterVendor').append('<option value="' + GlbVendorList[i].VendorID + '">' + GlbVendorList[i].VendorName + '</option>');
    }
    $('#ddlFilterVendor').multiselect();
}

function funFilterCoa(i, DT) {
    if (i == 1) {
        var strCompany = $('#ddlFilterCompany').find("option:selected").text();
        $('#hdnCOA').val(strCompany);

    } var strCOACode = $('#hdnCOA').val();
    var SegmentP = i;

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
 { funFilterCoaSucess(response, DT); })
 .fail(function (error)
 { console.log(error); })
}
function funFilterCoaSucess(response, DT) {

    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.COANo,
            value: m.COACode,
            COAId: m.COAID,
        };
    });
    $(".SearchCodeFilter").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            if (DT == 1) {
                $('#hdnCOA1').val(ui.item.value);
            }
            else {
                $('#hdnCOA').val(ui.item.value);

            }
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            if (DT == 1) {
                $('#hdnCOA1').val(ui.item.value);
            }
            else {
                $('#hdnCOA').val(ui.item.value);

            }

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                if (DT == 1) {
                    $('#hdnCOA1').val('');
                }
                else {
                    $('#hdnCOA').val('');

                }

            }
        }
    })
}
