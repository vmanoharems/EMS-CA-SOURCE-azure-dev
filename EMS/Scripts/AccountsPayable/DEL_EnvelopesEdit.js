var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillCustodian = HOST + "/api/POInvoice/GetCustodianCode";
var APIUrlFillRecipient = HOST + "/api/POInvoice/GetRecipientList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlCheckPCEnvelopeNumberDuplicacy = HOST + "/api/POInvoice/CheckPCEnvelopeNumberDuplicacy";
var APIUrlSavePC = HOST + "/api/POInvoice/SavePCEnvelope";

var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";

var APIUrlGetPCenvelopsList = HOST + "/api/POInvoice/GetPCEnvelopList";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlGetPCEnvelopDetail = HOST + "/api/POInvoice/GetDetailPCEnvelopeById";
var APIUrlGetPCEnvelopLineDetail = HOST + "/api/POInvoice/GetPCEnvelopeLineDetailById";
var APIUrlDeletePCDetail = HOST + "/api/POInvoice/DeletePCEnvelopeById";

var APIUrlUpdatePcEnvelope = HOST + "/api/POInvoice/updatePCEnvelopeStatus";

var ArrCompany = [];
var ArrCustodian = [];
var ArrRecipient = [];
var retriveSegment = [];
var retriveTransaction = [];
var GlbTransList = [];
var strCCount = 0;
var strAdAmountCount = 0;
var strEnvelopCount = 0;
var StrEnvelopId = 0;
var GetVendorNamePO = [];
var strClosePeriodId = 0;


$(document).ready(function () {
    $('#navMainUL li').removeClass('active');
    $('#hrefPayable').parent().addClass('active');
    $('#UlAccountPayable li').removeClass('active');
    $('#LiPettyCash').addClass('active');

    GetPCenvelopsList();
    FillCompany();
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

    $('#txtEnvelopeDate').val(Date1);
    var strBatch = $('#spnBatchNumber').text();
    $('#txtBatchNumberPC').val(strBatch);
    $('.w2float').w2field('float');
    $('#txtEnvelopeAmount').w2field('float', { min: 0 });
    retriveSegment = $.parseJSON(localStorage.ArrSegment);
    retriveTransaction = $.parseJSON(localStorage.ArrTransaction);
    funCreateThead();
    FillCustodian();
    FillRecipient();
    $('#DvTable').css('height', ($(window).height() - 10) + 'px');

})

//===================================== List
function GetPCenvelopsList() {
    $.ajax({
        url: APIUrlGetPCenvelopsList + '?ProdId=' + localStorage.ProdId + '&Status=' + 'Pending',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { GetPCenvelopsListSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function GetPCenvelopsListSucess(response) {
    var strhtml = '';
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {

            strhtml += '<tr id="' + response[i].PcEnvelopeID + '" >';
            strhtml += '<td><input type="checkbox" class="clsCheck" id="chk_' + response[i].PcEnvelopeID + '" name="' + response[i].PcEnvelopeID + '"></td>';
            strhtml += '<td>' + response[i].Status + '</td>';
            strhtml += '<td>' + response[i].CompanyCode + '</td>';
            strhtml += '<td>' + response[i].EnvelopeNumber + '</td>';
            strhtml += '<td>' + response[i].CreatedDate + '</td>';
            //strhtml += '<td>' + response[i].CustodianCode + '</td>';
            strhtml += '<td>' + response[i].TransactionNumber + '</td>';
            strhtml += '<td>' + response[i].VendorName + '</td>';
            strhtml += '<td>' + ' $ ' + parseFloat(response[i].AdvanceAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            strhtml += '<td>' + ' $ ' + parseFloat(response[i].EnvelopeAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            strhtml += '</tr>';

        }
    } else {
        strhtml += '<tr><td style="text-align:center;" colspan=9>No Records Found...</td></tr>';
    }
    $('#TblPCTBody').html(strhtml);


    $('#TblPCTBody tr').click(function () {
        strPublicTR = $(this).closest('tr').attr('id');
        strPublicParentId = $('#' + strPublicTR).val();
        $('#TblPCTBody tr').removeClass('blueColor');
        $('#' + strPublicTR).addClass('blueColor');
        StrEnvelopId = strPublicTR;
    })

}

function funCreateThead() {
    strhtml = '';
    strhtml += '<tr>';
    strhtml += '<td>Line</td>';
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].SegmentName == 'CO') {
            strhtml += '<th style="display:none;">' + retriveSegment[i].SegmentName + '</th>';
        }
        else {
            strhtml += '<th>' + retriveSegment[i].SegmentName + '</th>';
        }
    }

    for (var i = 0; i < retriveTransaction.length; i++) {
        strhtml += '<th>' + retriveTransaction[i].TransCode + '</th>';
    }
    strhtml += '<td>Description</td>';
    strhtml += '<td>Amount</td>';
    strhtml += '<td>VendorName</td>';
    strhtml += '<td>Tax</td>';
    strhtml += '</tr>';
    $('#TblPCLineThead').html(strhtml);
}
//====================================== Fill Company
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
    if (response.length == 1) {
        $('#txtCompany').val(response[0].CompanyCode);
        $('#hdnCompany').val(response[0].CompanyID);
    }
    else {
        ArrCompany = response;
        var ProductListjson = response;
        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.CompanyID,
                label: m.CompanyCode
            };
        })
        $(".SearchCompany").autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {
                $('#txtCompany').val(ui.item.label);
                $('#hdnCompany').val(ui.item.value);
                return false;
            },
            select: function (event, ui) {
                $('#txtCompany').val(ui.item.label);
                $('#hdnCompany').val(ui.item.value);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {

                }
            }

        })
    }
}
//====================================== Fill Custodian
function FillCustodian() {

    $.ajax({
        url: APIUrlFillCustodian + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {

        FillCustodianSucess(response);
    })
    .fail(function (error) {

        ShowMSG(error);
    })
}
function FillCustodianSucess(response) {
    if (response.length == 1) {
        $('#txtCustodian').val(response[0].CustodianCode);
        $('#txtCustodian').attr('name', response[0].CustodianID);
    }
    else {
        ArrCustodian = response;

        var ProductListjson = response;
        var array = response.error ? [] : $.map(response, function (m) {
            return {
                value: m.CustodianID,
                label: m.CustodianCode
            };
        })
        $(".SearchCustodian").autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {

                $('#txtCustodian').val(ui.item.label);
                $('#txtCustodian').attr('name', ui.item.value);

                return false;
            },
            select: function (event, ui) {
                $('#txtCustodian').val(ui.item.label);
                $('#txtCustodian').attr('name', ui.item.value);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {

                }
            }
        })
    }
}
//====================================== Fill Recipent
function FillRecipient() {
    $.ajax({
        url: APIUrlFillRecipient + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillRecipientSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillRecipientSucess(response) {
    ArrRecipient = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
            CAId: m.CoaID,
            AccountCode: m.CoaString,
            RecipientID: m.RecipientID
        };
    })
    $(".SearchRecipient").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $('#txtRecipient').val(ui.item.label);
            $('#txtRecipient').attr('name', ui.item.value);
            $('#hdnRecipientId').val(ui.item.RecipientID);
            $('#hdnRecipientCode').val(ui.item.AccountCode);
            $('#hdnRecipientCAId').val(ui.item.CAId);
            return false;
        },
        select: function (event, ui) {
            $('#txtRecipient').val(ui.item.label);
            $('#txtRecipient').attr('name', ui.item.value);
            $('#hdnRecipientId').val(ui.item.RecipientID);
            $('#hdnRecipientCode').val(ui.item.AccountCode);
            $('#hdnRecipientCAId').val(ui.item.CAId);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {

            }
        }
    })

}
//====================================== Close
function funGetClosePeriodDetail() {
    if ($('#hdnCompany').val() != '') {
        $.ajax({
            url: APIUrlCompanyClosePeriod + '?CompanyId=' + $('#hdnCompany').val(),
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
}
function GetClosePeriodDetailSucess(response) {
    $('#ddlPeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlPeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
    //  GetAmountValue();
}
//====================================== Row Creation
function CreateCustodianRow(value) {

    var StrDescription = $('#txtDescription').val();
    var strCompany = $('#txtCompany').val();
    if (strCompany != '') {
        var Tcount = $('#TblPCLineTBody tr').length;
        Tcount++;
        var strhtml = '';
        strhtml += '<tr id="' + Tcount + '" class="clsTr">';
        strhtml += '<td class="width40"> <span id="spn_' + Tcount + '"> <i class="fa fa-minus-circle" onclick="javascript:funJEDeleteRow(' + Tcount + ');"></i></span></td>';   // 
        for (var i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].Type == 'SegmentRequired') {
                if (retriveSegment[i].SegmentName == 'CO') {
                    strhtml += '<td style="display:none;"><input type="text"  class="    input-required" onblur="javascript:funCheckNextValue(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" id="txt_' + Tcount + '_' + i + '" name="' + retriveSegment[i].SegmentName + '" coacode="' + strCompany + '" /></td>';
                }
                else if (retriveSegment[i].SegmentName == 'DT') {
                    strhtml += '<td class="width100"><input type="text"  class="   detectTab input-required" onblur="javascript:funCheckNextValue(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" id="txt_' + Tcount + '_' + i + '" name="' + retriveSegment[i].SegmentName + '" /></td>';
                }
                else {
                    strhtml += '<td class="width40"><input type="text"  class="   detectTab input-required" onblur="javascript:funCheckNextValue(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" id="txt_' + Tcount + '_' + i + '" name="' + retriveSegment[i].SegmentName + '" /></td>';
                }
            }
        }
        var strCount = 0;
        for (var i = 0; i < retriveSegment.length; i++) {
            if (retriveSegment[i].Type != 'SegmentRequired') {
                strhtml += '<td class="width40"><input type="text"  class=" clsOtional' + Tcount + '   " onblur="javascript:funCheckOptionalAutoFill(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + strCount + ');" onfocus="javascript:GetOptional(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + strCount + ');" id="txtOptional_' + Tcount + '_' + strCount + '" name="' + retriveSegment[i].SegmentLevel + '" /></td>';
                strCount++;
            }
        }
        for (var i = 0; i < retriveTransaction.length; i++) {
            strhtml += '<td class="width40"><input type="text" onblur="javascript:funBlurTrans(' + Tcount + ',\'' + retriveTransaction[i].TransCode + '\');" class=" clsTransCode' + Tcount + '  clsTransCode_' + Tcount + '" onfocus="javascript:funTransDetail(' + Tcount + ',' + retriveTransaction[i].TransId + ',\'' + retriveTransaction[i].TransCode + '\')" id="txt_' + retriveTransaction[i].TransCode + '_' + Tcount + '" name="' + retriveTransaction[i].TransId + '" /></td>';
        }
        if (value == -1) {
            strhtml += '<td class="width40"><input type="text" class="detectTab clsDescription" id="txtDescription_' + Tcount + '" value="' + StrDescription + '" /></td>';

        }
        else {
            strhtml += '<td class="width40"><input type="text" class="detectTab clsDescription" id="txtDescription_' + Tcount + '"/></td>';
        }
        strhtml += '<td class="width40"><input type="text" class="detectTab AmountCalculation clsAmount w2float" id="txtAmount_' + Tcount + '" class="w2float"  /></td>';
        strhtml += '<td class="width40"><input type="text" class=" VendorCode clsVendorName" id="txtVendorName_' + Tcount + '" onfoucs="javascript:FillVendor();" onblur="javascript:VendorBlur(' + Tcount + ')" /></td>';
        strhtml += '<td class="width40"><select class="clsThridParty" id="chkThirdParty_' + Tcount + '"><option value="0">Select</option><option value="01">01</option><option value="03">03</option><option value="07">07</option><select/></td>';
        strhtml += '<td style="display:none;"><input type="hidden" class="clsCOAId" id="hdnCoaId_' + Tcount + '"><input type="hidden" class="clsCOACode" id="hdnCoaCode_' + Tcount + '"> <input type="hidden" class="clsPCLine" id="hdnLineId_' + Tcount + '"></td>';
        strhtml += '</tr>';
        $('#TblPCLineTBody').append(strhtml);
        $('.w2float').w2field('float');
    }
    else {
        ShowMsgBox('showMSG', 'Select Company first..!!', '', 'failuremsg');
    }
    var Tcount = $('#TblPCLineTBody tr').length;
    if (Tcount == 3) {
        $('#SpnAddNewRow').show();
    }
    FillVendor();

    $('#txt_' + Tcount + '_' + 1).select();
}
function funJEDeleteRow(value) {


    var strVal = $('#hdnLineId_' + value).val();
    funDeletePCDetail('PCEnvelopeLineId', strVal);
    $('#' + value).remove();
}
//======================================= Check Duplicacy
function CheckPCEnvelopeNumber() {
    $.ajax({
        url: APIUrlCheckPCEnvelopeNumberDuplicacy + '?EnvelopeNumber=' + $('#txtEnvelopeNumber').val().trim() + '&PcEnvelopeID=' + 0 + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { CheckPCEnvelopeNumberSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function CheckPCEnvelopeNumberSucess(response) {
    if (response == 1) {
        $('#txtEnvelopeNumber').val('');
        $('#txtEnvelopeNumber').focus();
        ShowMsgBox('showMSG', 'The envelope # entered is already in use. You must specify another envelope #...!!', '', '');
    }

}

$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        funShowDiv('New');
    }
    if (event.altKey === true && key === 83) {
        if ($('#DvAdd').css('display') == 'block') {
            SavePCDetail();
        }

    }


});

$('#txtAdvanceAmount').blur(function () {

    var strval = $('#txtAdvanceAmount').val().replace('$', '');
    strval = strval.replace(/,/g, "");
    strval = parseFloat(strval);
    var strval1 = strval - (strval * 2);
    $('#txtAmount_1').val(strval1);
    $('#txtAmount_2').val(strval);
    $('#txtAmount_' + 1).removeClass('AmountCalculation');
    $('#txtAmount_' + 2).removeClass('AmountCalculation');

    GetAmountCalculation();
    $('.w2float').w2field('float');
})

$('#txtEnvelopeAmount').blur(function () {

    var strval = $('#txtEnvelopeAmount').val().replace('$', '');
    strval = strval.replace(/,/g, "");
    strval = parseFloat(strval);
    strval = strval - (strval * 2);
    $('#txtAmount_3').val(strval);
    $('#txtAmount_' + 3).removeClass('AmountCalculation');
    GetAmountCalculation();

    $('.w2float').w2field('float');

})

//====================================== Pop up
function funAction(value) {
    if (value == 'Cancel') {
        $('#DivIDcancel').show();
        $('#fade').show();
    }
    else if (value == 'Delete') {
        $('#DivDelete').show();
        $('#fade').show();
    }
}
//====================================== Save Pc
function SavePCDetail() {
    var isvalid = "";
    var strClass = $('.detectTab');
    for (var i = 0; i < strClass.length; i++) {
        var strId = strClass[i].id;
        var strvalue = strClass[i].value;
        if (strvalue == '') {
            $('#' + strId).attr('style', 'border-color: red;');
            isvalid = isvalid + 1;
        }
    }
    if (isvalid == '') {
        var strDAmount = parseFloat($('#txtDifference').val());
        if (strDAmount == 0.00) {
            SavePC();
        }
        else {
            $('#CantSave').show();
            $('#fade').show();
        }
    }
}
function SavePC() {
    var Tcount = $('#TblPCLineTBody tr').length;
    var ArrPCLine = [];

    var ObjPCEn = {
        PcEnvelopeID: StrEnvelopId,
        Companyid: $('#hdnCompany').val(),
        BatchNumber: localStorage.BatchNumber,
        CustodianId: $('#txtCustodian').attr('name'),
        RecipientId: $('#hdnRecipientId').val(),
        EnvelopeNumber: $('#txtEnvelopeNumber').val(),
        Description: $('#txtDescription').val(),
        AdvanceAmount: $('#txtAdvanceAmount').val(),
        EnvelopeAmount: $('#txtEnvelopeAmount').val(),
        LineItemAmount: $('#txtLineItemAmount').val(),
        Difference: $('#txtDifference').val(),
        PostedDate: null,
        Status: 'Posted',
        CreatedBy: localStorage.UserId,
        Prodid: localStorage.ProdId,
        PostedBy: null,
        ClosePeriodId: $('#ddlPeriod').val()
    }
    var SclsCOAId = $('.clsCOAId');
    var SclsCOACode = $('.clsCOACode');
    var SclsAmount = $('.clsAmount');
    var SclsVendorName = $('.clsVendorName');
    var SclsThridParty = $('.clsThridParty');
    var SclsDescription = $('.clsDescription');
    var SclsPCLine = $('.clsPCLine');
    var sclsTr = $('.clsTr');
    //  

    for (var i = 0; i < sclsTr.length; i++) {

        var strVendorId = SclsVendorName[i].id;
        var FvendorId = $('#' + strVendorId).attr('vendorid');
        var FsclsTr = sclsTr[i].id;
        var TransString = '';
        var strSet = '';
        var strSeires = '';
        var strOption = $('.clsOtional' + FsclsTr);
        for (var j = 0; j < 2; j++) {
            var strid = strOption[j].id;
            var strAccountId = $('#' + strid).attr('AccountId');
            if (j == 0) {
                strSet = strAccountId;
            }
            else if (j == 1) {
                strSeires = strAccountId;
            }
        }
        var strTrans = $('.clsTransCode' + FsclsTr);
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

        var objPCEnLine = {
            EnvelopeLineID: SclsPCLine[i].value,
            PCEnvelopeID: StrEnvelopId,
            TransactionLineNumber: '',
            COAID: SclsCOAId[i].value,
            Amount: SclsAmount[i].value,
            VendorID: FvendorId,
            TaxCode: SclsThridParty[i].value,
            LineDescription: SclsDescription[i].value,
            TransactionCodeString: TransString,
            Setid: strSet,
            SeriesID: strSeires,
            Prodid: localStorage.ProdId,
            CreatedBy: localStorage.UserId,
            CoaString: SclsCOACode[i].value
        }
        ArrPCLine.push(objPCEnLine);

    }
    var finalObj = {
        objPC: ObjPCEn,
        ObjPCLine: ArrPCLine
    }

    $.ajax({
        url: APIUrlSavePC,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(finalObj),
    })
      .done(function (response)
      { SavePCSucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
}
function SavePCSucess(response) {
    //   location.reload(true);
    $('#DvSuccess').show();
    $('#fade').show();
    $('#spnTransactionNo').text(response);
}
function funSuccessOk() {
    location.reload(true);
    //FillCompany();
    //FillCustodian();
    //FillRecipient();
    //$('#DvSuccess').hide();
    //$('#fade').hide();
    //$('#txtCompany').val('');
    //$('#txtCustodian').val('');
    //$('#txtRecipient').val('');
    //$('#txtEnvelopeNumber').val('');
    //$('#txtDescription').val('');
    //$('#txtAdvanceAmount').val('');
    //$('#txtEnvelopeAmount').val('');
    //$('#txtLineItemAmount').val('');
    //$('#txtDifference').val('');
    //$('#TblPCLineTBody').html('');
    // strAdAmountCount = 0;
    // strEnvelopCount = 0;
    // StrEnvelopId = 0;
}

$('#TblPCLineTBody').delegate('.clsDescription', 'keydown', function (event) {
    var strRowcount = $('#tblManualEntryTBody tr:last').attr('id');
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtDescription_' + stval).length > 0) {
            $('#txtDescription_' + stval).focus();
        }
    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtDescription_' + stval).length > 0) {
            $('#txtDescription_' + stval).focus();
        }
    }
})
$('#TblPCLineTBody').delegate('.clsAmount', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtAmount_' + stval).length > 0) {
            $('#txtAmount_' + stval).select();
        }
    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtAmount_' + stval).length > 0) {
            $('#txtAmount_' + stval).select();
        }
    }
    GetAmountCalculation();
})
//==================================== calculation Amount
$(document).on('blur', ".clsAmount", function () {
    GetAmountCalculation();
});

function GetAmountCalculation() {

    var sclsAmount = $('.AmountCalculation');
    var total = 0;
    for (var i = 0; i < sclsAmount.length; i++) {
        var subTotal = sclsAmount[i].value;
        subTotal = (subTotal == '') ? 0 : subTotal;
        if (subTotal == 0)
        { }
        else {
            subTotal = subTotal.replace(/,/g, '');
        }
        subTotal = parseFloat(subTotal);
        total = total + subTotal;
    }
    total = parseFloat(total);
    if (total == 0) {
        total = '0.00';
    }

    var strLineAmount = $('#txtEnvelopeAmount').val();

    strLineAmount = (strLineAmount == '') ? 0 : strLineAmount;
    if (strLineAmount == 0)
    { }
    else {
        strLineAmount = strLineAmount.replace(/,/g, '');
    }


    var strDifferenceAmount = parseFloat(strLineAmount) - parseFloat(total);
    strDifferenceAmount = parseFloat(strDifferenceAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    total = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    if (strDifferenceAmount == 0) {
        strDifferenceAmount = '0.00';
    }
    $('#txtDifference').val(strDifferenceAmount);
    $('#txtLineItemAmount').val(total);

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

    // $('#txt_' + values + '_' + SegmentP).prop("disabled", false);
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

            $('#hdnCoaCode_' + values).val(ui.item.value);
            $('#hdnCoaId_' + values).val(ui.item.COAId);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCoaCode_' + values).val(ui.item.value);
            $('#hdnCoaId_' + values).val(ui.item.COAId);
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
    if (strStatus == 0)
    { }
    else {
        if (GlbCOAList.length > 0) {
            var strstatus = true;
            var strval = $('#txt_' + values + '_' + SegmentP).val();
            if (strval != '') {
                for (var i = 0; i < GlbCOAList.length; i++) {
                    //if (GlbCOAList[i].COANo.match(strval)) {
                    if (strval == GlbCOAList[i].COANo) {
                        $('#txt_' + values + '_' + SegmentP).val(GlbCOAList[i].COANo);
                        $('#txt_' + values + '_' + SegmentP).attr('COACode', GlbCOAList[i].COACode);
                        $('#txt_' + values + '_' + SegmentP).attr('COAId', GlbCOAList[i].COAID);

                        $('#hdnCoaCode_' + values).val(GlbCOAList[i].COACode);
                        $('#hdnCoaId_' + values).val(GlbCOAList[i].COAID);
                        break;

                    } else {
                        $('#txt_' + values + '_' + SegmentP).val('');
                        $('#txt_' + values + '_' + SegmentP).removeAttr('COACode');
                        $('#txt_' + values + '_' + SegmentP).removeAttr('COAId');

                        $('#hdnCoaCode_' + values).val('');
                        $('#hdnCoaId_' + values).val('');
                        strstatus = false;
                    }
                }
            }
            else {
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

   .done(function (response)
   { TransDetailSucess(response, values, Name); })
   .fail(function (error)
   { ShowMSG(error); })
}
function TransDetailSucess(response, values, Name) {
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
                $(this).val('');
                // $('#f').val('');
                $(this).removeAttr('TransValueId');
                $(this).val('');
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


.done(function (response)
{ GetOptionalSucess(response, values, SegmentP); })
.fail(function (error)
{ ShowMSG(error); })

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
//=========================================================== Detail

function PCEnvelopDetail() {
    if (StrEnvelopId == 0) {
        ShowMsgBox('showMSG', 'Please select the Row ..!!!', '', '');
    }
    else {
        GetPCEnvelopDetail();
    }
}
function GetPCEnvelopDetail() {

    $('#PCNew').addClass('active');
    $('#PCView').removeClass('active');
    $('#DvAdd').show();
    $('#DvView').hide();
    $('#DvViewIcon').hide();
    $('#DvPCSaveIcon').show();


    $.ajax({
        url: APIUrlGetPCEnvelopDetail + '?PcEnvelopeId=' + StrEnvelopId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { GetPCEnvelopDetailSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}
function GetPCEnvelopDetailSucess(response) {
    if (response.length > 0) {
        StrEnvelopId = response[0].PcEnvelopeID;
        $('#txtCompany').val(response[0].CompanyCode);
        $('#txtBatchNumberPC').val(response[0].BatchNumber);
        $('#txtCustodian').val(response[0].CustodianCode);
        $('#txtCustodian').attr('name', response[0].CustodianId);
        $('#txtCustodian').prop('disabled', true);
        $('#txtRecipient').val(response[0].VendorName);
        $('#hdnRecipientId').val(response[0].RecipientId);
        $('#txtRecipient').prop('disabled', true);
        $('#txtEnvelopeNumber').val(response[0].EnvelopeNumber);
        $('#txtEnvelopeDate').val(response[0].CreatedDate);
        $('#txtDescription').val(response[0].Description);
        $('#txtAdvanceAmount').val(numeral(response[0].AdvanceAmount).format('0,0.00'));
        $('#txtEnvelopeAmount').val(numeral(response[0].EnvelopeAmount).format('0,0.00'));
        $('#txtLineItemAmount').val(numeral(response[0].LineItemAmount).format('0,0.00'));
        $('#txtDifference').val(numeral(response[0].Difference).format('0,0.00'));

        $('#hdnCompany').val(response[0].Companyid);
        $('#ddlPeriod').val(response[0].ClosePeriodId);
        GetPCEnvelopLineDetail();
    }

}

function GetPCEnvelopLineDetail() {
    $.ajax({
        url: APIUrlGetPCEnvelopLineDetail + '?PcEnvelopeId=' + StrEnvelopId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetPCEnvelopLineDetailSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function GetPCEnvelopLineDetailSucess(response) {

    funCreateThead();
    $('#TblPCLineTBody').html('');
    for (var i = 0; i < response.length; i++) {

        var A = i + 1;
        CreateCustodianRow(0); //// Create Row

        var strsplit = response[i].CoaString.split('|');
        var strCOAPval = '';
        for (var j = 0; j < retriveSegment.length; j++) {
            if (retriveSegment[j].Type == 'SegmentRequired') {
                if (j == 0) { strCOAPval = strsplit[0]; }
                else if (j == 1) { strCOAPval = strsplit[0] + '|' + strsplit[1]; }
                else if (j == 2) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2]; }
                else if (j == 3) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3]; }
                else if (j == 4) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4]; }
                else if (j == 5) { strCOAPval = strsplit[0] + '|' + strsplit[1] + '|' + strsplit[2] + '|' + strsplit[3] + '|' + strsplit[4] + '|' + strsplit[5]; }

                if (retriveSegment[j].SegmentName == 'DT') {
                    var stsplit = strsplit[j].split('>');
                    var strlength = stsplit.length;
                    strlength = strlength - 1;
                    $('#txt_' + A + '_' + j).attr('coacode', strCOAPval);
                    $('#txt_' + A + '_' + j).val(stsplit[strlength]);


                }
                else {
                    $('#txt_' + A + '_' + j).attr('coacode', strCOAPval);
                    $('#txt_' + A + '_' + j).val(strsplit[j]);


                }
            }
        }
        $('#txtOptional_' + A + '_0').attr('accountid', response[i].Setid);
        $('#txtOptional_' + A + '_0').val(response[i].setAccountCode);

        $('#txtOptional_' + A + '_1').attr('accountid', response[i].SeriesID);
        $('#txtOptional_' + A + '_1').val(response[i].SeriesAccountCode);

        var strvCOATransaction = response[i].TransactionvalueString;
        var trastr = strvCOATransaction.split(',');
        for (var k = 0; k < trastr.length; k++) {
            var TraVal = trastr[k];
            var trastr1 = TraVal.split(':');
            $('#txt_' + trastr1[0] + '_' + A).val(trastr1[1]);
            $('#txt_' + trastr1[0] + '_' + A).attr('transvalueid', trastr1[2]);
        }
        $('#txtDescription_' + A).val(response[i].LineDescription);
        $('#txtAmount_' + A).val(response[i].Amount);
        $('#txtVendorName_' + A).val(response[i].VendorName);
        $('#txtVendorName_' + A).attr('vendorid', response[i].VendorID);

        $('#chkThirdParty_' + A).val(response[i].TaxCode);

        $('#hdnCoaId_' + A).val(response[i].COAID);
        $('#hdnCoaCode_' + A).val(response[i].CoaString);
        $('#hdnLineId_' + A).val(response[i].EnvelopeLineID);

        if (i <= 2) {
            $('#spn_' + A).hide();
            for (var z = 0; z < retriveSegment.length; z++) {
                if (retriveSegment[z].Type == 'SegmentRequired') {
                    $('#txt_' + A + '_' + z).prop('disabled', true);
                }
            }
            $('#txtOptional_' + A + '_0').prop('disabled', true);
            $('#txtOptional_' + A + '_1').prop('disabled', true);
            for (var z = 0; z < retriveTransaction.length; z++) {
                $('#txt_' + retriveTransaction[z].TransCode + '_' + A).prop('disabled', true);
            }

            $('#txtAmount_' + A).prop('disabled', true);
            if (i == 2) {
                $('#txtDescription_' + A).prop('disabled', false);
            }
            else {
                $('#txtDescription_' + A).prop('disabled', true);
            }
            $('#txtVendorName_' + A).removeClass('detectTab');
        }
    }
    $('.w2float').w2field('float');
    funGetClosePeriodDetail();
}
//========================================================== Vendor Name
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

    .done(function (response)
    { FillVendorSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
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

            $(this).val(ui.item.label);
            $(this).attr('vendorId', ui.item.value);

            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('vendorId', ui.item.value);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {

            }
        }
    })

}
function VendorBlur(value) {
    var StrCheckVendorName = $('#txtVendorName_' + value).val().trim();
    var strStatus = 0;


    if (StrCheckVendorName != '') {

        for (var i = 0; i < GetVendorNamePO.length; i++) {
            if (GetVendorNamePO[i].VendorName == StrCheckVendorName) {
                $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
                $('#txtVendor').val(GetVendorNamePO[i].VendorName);
                strStatus++;
                break;
            }
            else {

            }
        }
        for (var i = 0; i < GetVendorNamePO.length; ++i) {
            if (GetVendorNamePO[i].VendorName.substring(0, StrCheckVendorName.length) === StrCheckVendorName) {
                $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
                $('#txtVendor').val(GetVendorNamePO[i].VendorName);
                strStatus++;
                break;
            }

        }
    }
    else {
        $('#txtVendor').focus();
        $('#hdnVendorID').val('');
        strStatus++;
    }
    if (strStatus == 0) {
        $('#hdnVendorID').val(' ');
        $('#txtVendor').val('');
    }
}
//============================================================ Delete 
function funDeletePCDetail(Type, Id) {
    var strVal = 0;
    if (Type == 'PCEnvelope') {
        strVal = StrEnvelopId;
    }
    else {
        strVal = Id;
    }
    $.ajax({
        url: APIUrlDeletePCDetail + '?PCEnvelopeId=' + strVal + '&ProdId=' + localStorage.ProdId + '&Detail=' + Type,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { funDeletePCSucess(response, Type); })
   .fail(function (error)
   { ShowMSG(error); })
}
function funDeletePCSucess(response, Type) {

    if (Type == 'PCEnvelope') {
        location.reload(true);
    }
    else {
        GetAmountCalculation();
    }
}
//============================================================ Cancel
function funCancel() {
    location.reload(true);
}
//============================================================ Add NEW / View
function funShowDiv(value) {
    if (value == 'New') {

        $('#PCNew').addClass('active');
        $('#PCView').removeClass('active');
        $('#DvAdd').show();
        $('#DvView').hide();
        $('#DvViewIcon').hide();
        $('#DvPCSaveIcon').show();
        $('#txtCompany').focus();
        StrEnvelopId = 0;
        strAdAmountCount = 0;
        strEnvelopCount = 0;
        strCCount = 0;

        $('#txtCompany').val('');
        $('#txtCustodian').val('');
        $('#txtRecipient').val('');
        $('#txtEnvelopeNumber').val('');
        $('#txtDescription').val('');
        $('#txtAdvanceAmount').val('');
        $('#txtEnvelopeAmount').val('');
        $('#txtLineItemAmount').val('');
        $('#txtDifference').val('');
        $('#txtBatchNumberPC').val(localStorage.BatchNumber);

        FillValue();

    }
    else {
        $('#PCView').addClass('active');
        $('#PCNew').removeClass('active');
        $('#DvAdd').hide();
        $('#DvView').show();
        $('#DvViewIcon').show();
        $('#DvPCSaveIcon').hide();
        PCEnvelopDetail();
    }
}

function FillValue() {
    if (ArrCompany.length == 1) {
        $('#txtCompany').val(ArrCompany[0].CompanyCode);
        $('#hdnCompany').val(ArrCompany[0].CompanyID);
    }
    if (ArrCustodian.length == 1) {
        $('#txtCustodian').val(ArrCustodian[0].CustodianCode);
        $('#txtCustodian').attr('name', ArrCustodian[0].CustodianID);
    }
    if (ArrRecipient.length == 1) {
        $('#txtRecipient').val(ArrRecipient[0].VendorName);
        $('#txtRecipient').attr('name', ArrRecipient[0].VendorID);
        $('#hdnRecipientId').val(ArrRecipient[0].RecipientID);
        $('#hdnRecipientCode').val(ArrRecipient[0].CoaString);
        $('#hdnRecipientCAId').val(ArrRecipient[0].CoaID);


    }

}

$('#TblPCLineTBody').delegate('.clsThridParty', 'keydown', function (event) {

    var strRowcount = $('#TblPCLineTBody tr:last').attr('id');

    if (event.which === 9) {
        if (event.shiftKey === true && key === 9) {

        } else {

            var $this = $(this)
            var strId = $this.attr('id');
            var strSplit = strId.split('_');
            if (strRowcount == strSplit[1]) {
                CreateCustodianRow(0);
                funSetPreviousRecord(strSplit[1]);
            }
        }
    }
})

function funSetPreviousRecord(value) {

    //var strRowcount = $('#TblPCLineTBody tr:last').attr('id');
    var TrId = parseInt(value) + 1;

    for (var i = 0; i < retriveSegment.length; i++) {

        if (retriveSegment[i].Type == 'SegmentRequired') {
            var strval = $('#txt_' + value + '_' + i).val();
            var strCode = $('#txt_' + value + '_' + i).attr('coacode');
            var strcoaid = $('#txt_' + value + '_' + i).attr('coaid');

            $('#txt_' + TrId + '_' + i).val(strval);
            $('#txt_' + TrId + '_' + i).attr('coacode', strCode);
            $('#txt_' + TrId + '_' + i).attr('coaid', strcoaid);
        }
    }
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type != 'SegmentRequired') {
            var strval = $('#txtOptional_' + value + '_' + i).val();
            var strId = $('#txtOptional_' + value + '_' + i).attr('accountid');

            $('#txtOptional_' + TrId + '_' + i).val(strval);
            $('#txtOptional_' + TrId + '_' + i).attr('accountid', strId);
        }
    }
    var strCoaCode = $('#hdnCoaCode_' + value).val();
    var strCoaId = $('#hdnCoaId_' + value).val();
    $('#hdnCoaCode_' + TrId).val(strCoaCode);
    $('#hdnCoaId_' + TrId).val(strCoaId);

    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].SegmentName == 'DT') {
            var stri = i - 1;
            $('#txt_' + TrId + '_' + stri).select();
        }
    }
    var strdesc = $('#txtDescription_' + value).val();
    $('#txtDescription_' + TrId).val(strdesc);

}

// DeletePCEnvelopeById --- Trigger

$('#chkCheckAll').change(function () {
    var strcheckBox = $('.clsCheck');
    var strval = true;
    if ($('#chkCheckAll').is(':checked')) {
        strval = true;
    }
    else {
        strval = false;
    }
    for (var i = 0; i < strcheckBox.length; i++) {
        var strId = strcheckBox[i].id;
        if (strval == true) {
            $('#' + strId).prop('checked', true);
        }
        else {
            $('#' + strId).prop('checked', false);
        }
    }

})

function UpdatePcEnvelope() {
    var strcheckBox = $('.clsCheck');
    var strval = '';


    for (var i = 0; i < strcheckBox.length; i++) {
        var strchecked = strcheckBox[i].checked;
        var strid = strcheckBox[i].id;
        if (strchecked == true) {
            strval += $('#' + strid).attr('name') + ',';
        }
    }

    strval = strval.substring(0, strval.length - 1);
    if (strval == '') {
        ShowMsgBox('showMSG', 'Please Select PC Envelope first..!!', '', '');
    }
    else {

        //show popup
        PCEnvelopePost(strval);
    }
}
function PCEnvelopePost(strval) {

    $.ajax({
        url: APIUrlUpdatePcEnvelope + '?PCEnvelopId=' + strval,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

  .done(function (response)
  { PCEnvelopePostSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}
function PCEnvelopePostSucess(response) {
    // GetPCenvelopsList();
    $('#SaveInvoiceSuccess').show();
    $('#fade').show();


    var strhtml = '';
    strhtml += '<tr><th style="width: 31%; text-align: center;">Envelope #</th><th style="text-align: center;"> Transaction #</th></tr>';
    for (var i = 0; i < response.length; i++) {

        strhtml += '<tr>';
        strhtml += '<td>' + response[i].EnvelopeNumber + '</td>';
        strhtml += '<td>' + response[i].TransactionNumber + '</td>';
        strhtml += '</tr>';
    }
    $('#tblResult').html(strhtml);
    $('#btnSaveOK').focus();
}

function funSaveInvoiceSuccess() {
    location.reload(true);
}