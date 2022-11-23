var APIUrlGetPCenvelopsList = HOST + "/api/POInvoice/GetPCEnvelopList";
var APIUrlUpdatePcEnvelope = HOST + "/api/POInvoice/updatePCEnvelopeStatus";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlGetPCEnvelopDetail = HOST + "/api/POInvoice/GetDetailPCEnvelopeById";
var APIUrlGetPCEnvelopLineDetail = HOST + "/api/POInvoice/GetPCEnvelopeLineDetailById";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlPendingToPost = HOST + "/api/POInvoice/UpdatePCEnvelopeClosePeriod";
var APIUrlReverseTransaction = HOST + "/api/POInvoice/GetPCEnvelopeReverse";
var APIUrlUpdatePC = HOST + "/api/POInvoice/SavePCEnvelope";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";

var StrEnvelopId = 0;
var StrClosePeriodId = 0;
var CompanyPeriod = 0;
var retriveSegment = [];
var retriveTransaction = [];
var PageCnt;
var GlbTransList = [];
var iCustodianId = 0;
var sStatus = "";
var iRecipiemntId = 0;
var GetVendorNamePO = [];
var TCodes;
$(document).ready(function () {
    $('#navMainUL li').removeClass('active');
    $('#hrefPayable').parent().addClass('active');
    $('#UlAccountPayable li').removeClass('active');
    $('#LiPettyCash').addClass('active');
    
    GetPCenvelopsList();
    GetTaxCodeList();
    TCodes = (AtlasCache.Cache.GetItembyName('Config.TransactionCodes')) ? AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON : {};
})


$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 83) {
        UpdatePCLineDetails();
    }

});

$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});

function GetPCenvelopsList() {
    $.ajax({
        url: APIUrlGetPCenvelopsList + '?ProdId=' + localStorage.ProdId + '&Status=' + 'Posted',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       GetPCenvelopsListSucess(response);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
}

function GetPCenvelopsListSucess(response) {
    var strhtml = '';
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            strhtml += '<tr id="' + response[i].PcEnvelopeID + '" >';
            strhtml += '<td>' + response[i].Status + '</td>';
            strhtml += '<td>' + response[i].CompanyCode + '</td>';
            strhtml += '<td><a href="#" onclick="GetPCEnvelopDetail(\'POSTED\',' + response[i].PcEnvelopeID + ');">' + response[i].EnvelopeNumber + '</a></td>';
            strhtml += '<td>' + response[i].CreatedDate + '</td>';
            strhtml += '<td>' + response[i].TransactionNumber + '</td>';
            strhtml += '<td>' + response[i].VendorName + '</td>';
            strhtml += '<td>' + parseFloat(response[i].AdvanceAmount).toFixed(2) + '</td>';
            strhtml += '<td>' + parseFloat(response[i].EnvelopeAmount).toFixed(2) + '</td>';
            strhtml += '<td>' + response[i].CurrencyDocument + '</td>';
            strhtml += '</tr>';
        }
    } else {
        strhtml += '<tr><td style="text-align:center;" colspan=8>No Records Found.</td></tr>';
    }
    $('#TblPCPostedTBody').html(strhtml);

    var PgNo = (PageCnt / 32);

    var substr = PgNo.toString().split('.');
    showpg = parseInt(substr[0]);

    var table = $('#TblPCPosted').DataTable({
        "dom": 'C<"clear"><Rrt<"positionFixed"pli>>',
        "iDisplayLength": showpg,
        responsive: {
            details: {
                //  type: 'column',
            }
        },
        columnDefs: [{
            className: 'control',
            orderable: false,
            targets: 0
        }],
        order: [1, 'asc']
    });

    $('#TblPCPosted tfoot th').each(function () {
        var title = $('#TblPCPosted thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%;" placeholder=" ' + title + '" />');
    });

    // Apply the search
    table.columns().eq(0).each(function (colIdx) {
        $('input', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
        $('select', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });

    $('#TblPCPosted tfoot tr').insertAfter($('#TblPCPosted thead tr'));
    $('#TblPCPosted').parent().css('overflow', 'scroll');
    $('#TblPCPosted').parent().css('max-height', ($(window).height() - 180) + 'px');
    $('#TblPCPosted').parent().css('min-height', ($(window).height() - 180) + 'px');
    $('#TblPCPosted').parent().css('height', ($(window).height() - 180) + 'px');
    $('#TblPCPosted tr').click(function () {
        strPublicTR = $(this).closest('tr').attr('id');
        strPublicParentId = $('#' + strPublicTR).val();
        $('#TblPCPosted tr').removeClass('blueColor');
        $('#' + strPublicTR).addClass('blueColor');
        StrEnvelopId = strPublicTR;
    })
}

$('#chkCheckAll').change(function () {
    var strcheckBox = $('.clsCheck');
    var strval = true;
    if ($('#chkCheckAll').is(':checked')) {
        strval = true;
    } else {
        strval = false;
    }

    for (var i = 0; i < strcheckBox.length; i++) {
        var strId = strcheckBox[i].id;
        if (strval == true) {
            $('#' + strId).prop('checked', true);
        } else {
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
    } else {
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
    .done(function (response) {
        PCEnvelopePostSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function PCEnvelopePostSucess(response) {
    // GetPCenvelopsList();
    $('#SaveInvoiceSuccess').show();
    $('#fade').show();

    var strhtml = '';
    strhtml += '<tr><th style="width: 31%; text-align: center;">Invoice #</th><th style="text-align: center;"> Transaction #</th></tr>';
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

function funSuccessOkMultiple() {
    GetPCenvelopsList();
    $('#DvSuccessMultiple').hide();
    $('#fade').hide();
}

function funViewPosted() {
    $('#DvPosted').show();
    $('#DvTab01').hide();

    $('#DvView').hide();
    $('#DvPosedList').show();

    $('#DvPostedDetail').hide();
    $('#DvPostedDetailBtn').hide();
    $('#DvAdd').hide();

    funPostedPCList();
}

function funBackToUnPosted() {
    $('#DvPosted').hide();
    $('#DvTab01').show();

    $('#DvView').show();
    $('#DvPosedList').hide();
    GetPCenvelopsList();
}

function funPostedPCList() {

    $.ajax({
        url: APIUrlGetPCenvelopsList + '?ProdId=' + localStorage.ProdId + '&Status=' + 'Posted',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPCenvelopsListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funPostedPCListSucess(response) {

    var strhtml = '';
    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {

            strhtml += '<tr id="' + response[i].PcEnvelopeID + '" >';
            // strhtml += '<td><input type="checkbox" class="clsCheck" id="chk_' + response[i].PcEnvelopeID + '" name="' + response[i].PcEnvelopeID + '"></td>';
            strhtml += '<td>' + response[i].Status + '</td>';
            strhtml += '<td>' + response[i].CompanyCode + '</td>';
            strhtml += '<td>' + response[i].EnvelopeNumber + '</td>';
            strhtml += '<td>' + response[i].CreatedDate + '</td>';
            // strhtml += '<td>' + response[i].CustodianCode + '</td>';
            strhtml += '<td>' + response[i].TransactionNumber + '</td>';
            strhtml += '<td>' + response[i].VendorName + '</td>';
            strhtml += '<td>' + ' $ ' + parseFloat(response[i].AdvanceAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            strhtml += '<td>' + ' $ ' + parseFloat(response[i].EnvelopeAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            strhtml += '</tr>';
        }
    } else {
        strhtml += '<tr><td style="text-align:center;" colspan=8>No Records Found.</td></tr>';
    }
    $('#TblPCPostedTBody').html(strhtml);

    $('#TblPCPostedTBody').css('overflow', 'scroll');
    $('#TblPCPostedTBody').css('max-height', ($(window).height() - 180) + 'px');

    $('#TblPCPostedTBody tr').click(function () {
        strPublicTR = $(this).closest('tr').attr('id');
        strPublicParentId = $('#' + strPublicTR).val();
        $('#TblPCPostedTBody tr').removeClass('blueColor');
        $('#' + strPublicTR).addClass('blueColor');
        StrEnvelopId = strPublicTR;
    })
}


function GetPCEnvelopDetail(value, thePCEnvelopID) {
    StrEnvelopId = thePCEnvelopID;

    if (StrEnvelopId == 0) {
        ShowMsgBox('showMSG', 'Please select a PC Envelope first', '', '');
    } else {

        if (value == 'POSTED') {
            $('#DvTab01').show();
            $('#DvPosedList').hide();
            $('#DvAdd').show();
            $('#DvPosted').hide();
            $('#DvPostedDetail').show();
            $('#DvPostedDetailBtn').show();
            $('#LiReverse').removeClass('display-None');
        } else {
            $('#DvView').hide();
            $('#DvAdd').show();
            $('#DvTab01').hide();
            $('#DvPendingDetail').show();
        }

        $.ajax({
            url: APIUrlGetPCEnvelopDetail + '?PcEnvelopeId=' + StrEnvelopId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            GetPCEnvelopDetailSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }

}

function GetPCEnvelopDetailSucess(response) {
    if (response.length > 0) {
        BatchManager.ForceBatch(response[0].BatchNumber);
        AtlasDocument.BindCurrency(response[0].CurrencyDocument);

        StrEnvelopId = response[0].PcEnvelopeID;
        $('#txtCompany').val(response[0].CompanyCode);
        //$('#txtBatchNumberPC').val(response[0].BatchNumber);
        $('#txtBatchNumberPC').val(response[0].BatchNumber);
        $('#txtCustodian').val(response[0].CustodianCode);
        iCustodianId = response[0].CustodianId;
        $('#txtRecipient').val(response[0].VendorName);
        $('#txtEnvelopeNumber').val(response[0].EnvelopeNumber);
        $('#txtEnvelopeDate').val(response[0].CreatedDate);
        $('#txtDescription').val(response[0].Description);
        $('#txtAdvanceAmount').val(response[0].AdvanceAmount);
        $('#txtEnvelopeAmount').val(response[0].EnvelopeAmount);
        $('#txtLineItemAmount').val(response[0].LineItemAmount);
        $('#txtDifference').val(parseFloat(response[0].Difference).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        StrClosePeriodId = response[0].ClosePeriodId;
        CompanyPeriod = response[0].CompanyPeriod;
        //$('#hdnCompany').val(response[0].Companyid);
        $('#ddlCompany').val(response[0].Companyid);
        sStatus = response[0].Status;
        iRecipiemntId = response[0].RecipientId;
        if (response[0].Status == 'Reversed') {
            $('#LiReverse').addClass('display-None');
        } else if (sStatus == "Posted") { $('#hrfAddPCLine').hide(); }
      
        if (response[0].MirrorStatus == 1 || response[0].MirrorStatus == 2) {
            $('#LiReverse').addClass('display-None');
        }
        $('#SpnTransactionNobreadcrumb').text('Transaction # (' + response[0].TransactionNumber + ')');
        GetPCEnvelopLineDetail();
        // Since this is a posted transaction, we will use RenderData ONLY the period of the transaction
        AtlasForms.Controls.DropDown.RenderData(
            [{
                'ClosePeriodId': StrClosePeriodId
                , 'CompanyPeriod': CompanyPeriod
                , 'PeriodStatus': 'Period: '
                , 'CompanyPeriod': response[0].CompanyPeriod
            }]
            , AtlasForms.FormItems.ddlClosePeriod()
        );
        return;

    }
    //$('.w2float').w2field('float');
    $('.w2field.amount').w2field('currency', { currencyPrefix: '' });
}

function GetPCEnvelopLineDetail() {
    $.ajax({
        url: APIUrlGetPCEnvelopLineDetail + '?PcEnvelopeId=' + StrEnvelopId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPCEnvelopLineDetailSucess(response);
    })
    .fail(function (error) {
        console.log(error);
    })
}

function GetPCEnvelopLineDetailSucess(response) {
    retriveSegment = $.parseJSON(localStorage.ArrSegment);
    retriveTransaction = $.parseJSON(localStorage.ArrTransaction);
    funCreateThead();
    $('#TblPCLineTBody').html('');
    for (var i = 0; i < response.length; i++) {

        CreateCustodianRow();
        var A = i + 1;
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
                } else {
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
        if (response[i].TransactionCodeString !== '') {
            let TString = response[i].TransactionCodeString.split(',');
            for (var k = 0; k < TString.length; k++) {
                var TraVal = TString[k].split(':');
                var TCodesId = $.grep(TCodes, function (v) { return v.Details.TCID == TraVal[0]; });
                var TCodesVID = $.grep(TCodesId[0].TV, function (v) { return v.TVID == TraVal[1]; });
                $('#txt_' + TCodesId[0].TransCode + '_' + A).val(TCodesVID[0].TransValue);
                $('#txt_' + TCodesId[0].TransCode + '_' + A).attr('transvalueid', TCodesVID[0].TVID);
            }
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
            } else {
                $('#txtDescription_' + A).prop('disabled', false);
            }
        }
    }

    funGetClosePeriodDetail();
    //$('.w2float').w2field('float');
    $('.w2field.amount').w2field('currency', { currencyPrefix: '' });
    AllControlDisabled();
    AtlasUtilities.AddStickyTableHeaders('TblPCLine', 'DvTable', 250);
}

function funCreateThead() {
    strhtml = '';
    strhtml += '<tr>';
    strhtml += '<td>Line</td>';
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].SegmentName == 'CO') {
            strhtml += '<th style="display:none;">' + retriveSegment[i].SegmentName + '</th>';
        } else {
            strhtml += '<th>' + retriveSegment[i].SegmentName + '</th>';
        }
    }

    for (var i = 0; i < retriveTransaction.length; i++) {
        strhtml += '<th>' + retriveTransaction[i].TransCode + '</th>';
    }
    strhtml += '<th>Description</th>';
    strhtml += '<th>Amount</th>';
    strhtml += '<th>VendorName</th>';
    strhtml += '<th>Tax</th>';
    strhtml += '</tr>';
    $('#TblPCLineThead').html(strhtml);
}

function CreateCustodianRow() {

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
                    strhtml += '<td style="display:none;"><input type="text"  class="    input-required" onblur="javascript:funCheckNextValue(' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:    ' + Tcount + ',\'' + retriveSegment[i].SegmentName + '\',' + i + ');" id="txt_' + Tcount + '_' + i + '" name="' + retriveSegment[i].SegmentName + '" coacode="' + strCompany + '" /></td>';
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
        strhtml += '<td class="width40"><input type="text" class="detectTab clsDescription" id="txtDescription_' + Tcount + '"/></td>';
        strhtml += '<td class="width40"><input type="text" class="detectTab clsAmount w2field amount" id="txtAmount_' + Tcount + '"/></td>';
        strhtml += '<td class="width40"><input type="text" class=" VendorCode clsVendorName" id="txtVendorName_' + Tcount + '" onfocus="javascript: FillVendor();" onblur="javascript: VendorBlur(' + Tcount + ')" /></td>';
        strhtml += '<td class="width40"><input type="text" id="chkThirdParty_' + Tcount + '" class="  clsThridParty clsTaxPC"  name="POLineAmtt"  onfocus="javascript:funTaxCode(' + Tcount + ');"  value="" /></td>';
        //strhtml += '<td class="width40"><select class="clsThridParty" id="chkThirdParty_' + Tcount + '"><option value="0">Select</option><option value="01">01</option><option value="03">03</option><option value="07">07</option><select/></td>';
        strhtml += '<td style="display:none;"><input type="hidden" class="clsCOAId" id="hdnCoaId_' + Tcount + '"><input type="hidden" class="clsCOACode" id="hdnCoaCode_' + Tcount + '"> <input type="hidden" class="clsPCLine" id="hdnLineId_' + Tcount + '"></td>';
        strhtml += '</tr>';
        $('#TblPCLineTBody').append(strhtml);
        //$('.w2float').w2field('float');
        $('.w2field.amount').w2field('currency', { currencyPrefix: '' });
    } else {
        ShowMsgBox('showMSG', 'Select Company first..!!', '', 'failuremsg');
    }
    var Tcount = $('#TblPCLineTBody tr').length;
    if (Tcount == 3) {
        $('#SpnAddNewRow').show();
    }
    FillVendor();
}


//===================== Close Period 

function funGetClosePeriodDetail() {
    return;

    $.ajax({
        url: APIUrlCompanyClosePeriod + '?CompanyId=' + $('#hdnCompany').val(),
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

    if ($('#DvPendingDetail').css('display') == 'block') {
        $('#ddlClosePeriodPCPending').html('');
        for (var i = 0; i < response.length; i++) {
            $('#ddlClosePeriodPCPending').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
        }
        $('#ddlClosePeriodPCPending').val(StrClosePeriodId);

    } else {

        $('#ddlClosePeriodPC').html('');
        for (var i = 0; i < response.length; i++) {
            $('#ddlClosePeriodPC').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
        }
        $('#ddlClosePeriodPC').val(StrClosePeriodId);
        $('#ddlClosePeriodPC').prop('disabled', true);
    }
}

//==================== Reverse
function funReversePost(value) {
    if (value == 'Show') {
        $('#DvReverse').show();
        $('#fade').show();
    } else if (value == 'hide') {
        $('#DvReverse').hide();
        $('#fade').hide();
    } else {
        funReverseTransaction();
    }
}

//===================== Pending View  Detail
function funCancelPendingList() {
    $('#DvTab01').show();
    $('#DvPendingDetail').hide();

    $('#DvAdd').hide();
    $('#DvView').show();

    GetPCenvelopsList();
}

function funPendingToPost() {
    $.ajax({
        url: APIUrlPendingToPost + '?PCEnvelopeId=' + StrEnvelopId + '&ClosePeriodId=' + $('#ddlClosePeriodPCPending').val() + '&Prodid=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funPendingToPostSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funPendingToPostSucess(response) {
    var strEnvelopeNo = $('#txtEnvelopeNumber').val();
    $('#DvSuccess').show();
    setTimeout(function () {
        $('#hrfSuccessOK').focus();
    }, 300);
    $('#fade').show();
    $('#spnTransactionNo').text(response);
    $('#hrfSuccessOK').focus();
}

//============================== Reverse 
function funReverseTransaction() {
    let theCall = {
        callParameters: {
            PCEnvelopeID: StrEnvelopId
            , BatchNumber: BatchManager.BatchNumber
	        , CreatedBy: localStorage.UserId
            , ProdID: localStorage.ProdId
        }
    };

    $.ajax({
        url: APIUrlReverseTransaction //+ 'JSONParams=' ?PCEnvelopeId=' + StrEnvelopId,
        , data: { callPayload: JSON.stringify(theCall.callParameters) },
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false
    })
    .done(function (response) {
        ReverseTransactionSucess(response);
    })
    .fail(function (error) {
        $('#DvReverse').hide();
        AtlasUtilities.ShowError();
        console.log(error);
    })
}

function ReverseTransactionSucess(response) {
    $('#DvReverse').hide();
    $('#DvSuccess_Reverse_TRANSACTIONNUMBER').html(response);
    $('#DvSuccess_Reverse').show();
}

//===================
function funSuccessOk() {
    location.reload(true);
}

function AllControlDisabled() {
    var Tcount = $('#TblPCLineTBody tr').length;

    $('#txtCompany').prop('disabled', true);
    $('#txtCustodian').prop('disabled', true);
    $('#txtRecipient').prop('disabled', true);
    $('#txtEnvelopeNumber').prop('disabled', true);
    $('#txtEnvelopeDate').prop('disabled', true);
    $('#txtAdvanceAmount').prop('disabled', true);
    $('#txtEnvelopeAmount').prop('disabled', true);
    $('#txtDescription').prop('disabled', false);

    for (var i = 1; i <= Tcount; i++) {

        $('#spn_' + i).hide();
        for (var j = 0; j < retriveSegment.length; j++) {
            $('#txt_' + i + '_' + j).prop('disabled', true);
        }
       
        for (var j = 0; j < retriveTransaction.length; j++) {
            $('#txt_' + retriveTransaction[j].TransCode + '_' + i).prop('disabled', false);
        }

        $('#txtOptional_' + i + '_0').prop('disabled', true);
        $('#txtOptional_' + i + '_1').prop('disabled', true);

        $('#txtDescription_' + i).prop('disabled', false);
        $('#txtVendorName_' + i).prop('disabled', false);
        $('#txtAmount_' + i).prop('disabled', true);
        $('#chkThirdParty_' + i).prop('disabled', false);

    }
}

function UpdatePCLineDetails() {
    var Tcount = $('#TblPCLineTBody tr').length;
    var ArrPCLine = [];
    var StrDisplayType = '';

    var ObjPCEn = {
        PcEnvelopeID: StrEnvelopId,
        //Companyid: $('#hdnCompany').val(),
        Companyid: $('#ddlCompany').val(),
        BatchNumber: $('#txtBatchNumberPC').val(),
        CustodianId: iCustodianId,
        RecipientId: iRecipiemntId,
        EnvelopeNumber: $('#txtEnvelopeNumber').val(),
        Description: $('#txtDescription').val(),
        AdvanceAmount: $('#txtAdvanceAmount').val(),
        EnvelopeAmount: $('#txtEnvelopeAmount').val(),
        LineItemAmount: $('#txtLineItemAmount').val(),
        Difference: $('#txtDifference').val(),
        PostedDate: $('#txtEnvelopeDate').val(),
        Status: sStatus,
        CreatedBy: localStorage.UserId,
        Prodid: localStorage.ProdId,
        PostedBy: null,
        ClosePeriodId: StrClosePeriodId
    }
    var SclsCOAId = $('.clsCOAId');
    var SclsCOACode = $('.clsCOACode');
    var SclsAmount = $('.clsAmount');
    var SclsVendorName = $('.clsVendorName');
    var SclsThridParty = $('.clsThridParty');
    var SclsDescription = $('.clsDescription');
    var SclsPCLine = $('.clsPCLine');
    var sclsTr = $('.clsTr');
    var isDisabled = $('.clsDisplay');
    for (var i = 0; i < sclsTr.length; i++) {
        var strVendorId = SclsVendorName[i].id;
        var FvendorId = $('#' + strVendorId).attr('vendorid');
        var FsclsTr = sclsTr[i].id;
        var TransString = '';
        var strSet = '';
        var strSeires = '';
        var strOption = $('.clsOtional' + FsclsTr);
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
        var stridDisplay, strDisplayvalue = "";
        var strDisplayT = $('.clsDisplay');
        if (strDisplayT.length != 0) {
            stridDisplay = strDisplayT[i].id;
            strDisplayvalue = $('#' + stridDisplay).val();
        }
      
        let lineCOA = SclsCOAId[i].value;
        if (!SclsCOAId[i].value) {
            lineCOA = AtlasUtilities.SEGMENTS.DETAILS.asObjects.COACode[SclsCOACode[i].value].COAID;
        }

        var objPCEnLine = {
            EnvelopeLineID: SclsPCLine[i].value,
            PCEnvelopeID: StrEnvelopId,
            TransactionLineNumber: '',
            COAID: lineCOA,
            Amount: SclsAmount[i].value,
            VendorID: FvendorId,
            TaxCode: SclsThridParty[i].value,
            LineDescription: SclsDescription[i].value,
            TransactionCodeString: TransString,
            Setid: strSet,
            SeriesID: strSeires,
            Prodid: localStorage.ProdId,
            CreatedBy: localStorage.UserId,
            CoaString: SclsCOACode[i].value,
            Displayflag: strDisplayvalue

        }
        ArrPCLine.push(objPCEnLine);
    }
    var finalObj = {
        objPC: ObjPCEn,
        ObjPCLine: ArrPCLine
    }

    $.ajax({
        url: APIUrlUpdatePC,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(finalObj),
    })
    .done(function (response) {
        UpdatePCSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function UpdatePCSucess(response) {
    //   location.reload(true);
    $('#DvSuccess').show();
    setTimeout(function () {
        $('#hrfSuccessOK').focus();
    }, 300);
    $('#fade').show();
    if ($('#SpnTransactionNobreadcrumb').text() != '') {
        $('#spnTransactionNo').text($('#SpnTransactionNobreadcrumb').text().replace("Transaction # ", "").replace("(", "").replace(")", " ").trim());
    } else {
        $('#spnTransactionNo').text(response);
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
       TransDetailSucess(response, values, Name);
   })
   .fail(function (error) {
       ShowMSG(error);
   })
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
        minLength: 1,
        source: array,
        autoFocus: true,
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            //    $(this).attr('TransValueId', ui.item.value);
            //    $(this).val(ui.item.label);
            //    return false;
        },
        select: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                var isExist = IsExistItem(response, $(this).val(), "TransValue");
                if (isExist == false) {
                    $(this).val('');
                    $(this).removeAttr('TransValueId');
                }
            }
        }
    })
}

function funBlurTrans(value, Name) {
    //if (GlbTransList.length == 0) {
    //} else {
    var strtextval = $('#txt_' + Name + '_' + value).val();
    //}

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

function funTaxCode(value) {
    var array = [];
    var ProductListjson = TaxCode1099;
    array = TaxCode1099.error ? [] : $.map(TaxCode1099, function (m) {
        return {
            label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(),
        };
    });
    $(".clsTaxPC").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
            //$(this).val(ui.item.value);
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
        minLength: 1,
        source: array,
        autoFocus: true,
        focus: function (event, ui) {
            if (event.which !== 9) {
                event.preventDefault();
            }
        },
        //focus: function (event, ui) {
        //    $(this).val(ui.item.label);
        //    $(this).attr('vendorId', ui.item.value);
        //    return false;
        //},
        select: function (event, ui) {
            //            event.preventDefault();
            $(this).val(ui.item.label);
            $(this).attr('vendorId', ui.item.value);
            return false;
            if (this.value !== '') {
            } else {
                event.preventDefault();
            }
            if (event.keyCode == 13) {
                $(this).next("input").focus().select();
            }
        },
        change: function (event, ui) {
            if (!ui.item) {

                $(this).val('');
                $(this).removeAttr('vendorId');
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
            } else {

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
    } else {
        $('#txtVendor').focus();
        $('#hdnVendorID').val('');
        strStatus++;
    }

    if (strStatus == 0) {
        $('#hdnVendorID').val(' ');
        $('#txtVendor').val('');
    }
}