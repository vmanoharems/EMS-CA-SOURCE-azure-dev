var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlAuditTabJEList = HOST + "/api/Ledger/GetJournalEntryList";
var APIUrlPostingHistory = HOST + "/api/Ledger/GetJournalEntryDetailByStatus";

var APIUrlfunGetJEntryDetail = HOST + "/api/Ledger/GetJEntryByJEId";
var APIUrlGetJEDetailList = HOST + "/api/Ledger/GetJEDetailByJEId";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlGetCOABySegment = HOST + "/api/Ledger/GetCOABySegmentNumber";
var APIUrlGetJEDetailFilter = HOST + "/api/Ledger/GetJEDetailFilter";
var APIUrlGetfunReverse = HOST + "/api/Ledger/GeteverseJEDetail";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlCheckCloseID = HOST + "/api/Ledger/GetClosePeriodDeomJE";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlSaveJE = HOST + "/api/Ledger/SaveJE";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";

var ArrSegment = [];
var GlbTransList = [];
var ArrOptionalSegment = [];
var GlbCompnayArr = [];
var ArrTransCode = [];
var strTrCount = 0;
var strDate = '';
var pubObj = '';
var iJournalEntryId = 0;
var oPrevNextJEId = [];
var iPrevNextIndx = 0;
var oJEIds = [];
var GlbClosePeriod = undefined;

$(document).ready(function () {
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

    strDate = curr_month + '/' + curr_date + '/' + curr_year;
    GetTaxCodeList();
    FillCompany();
    oPrevNextJEId = JSON.parse(localStorage.getItem("JEHistory"));
})

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
        AtlasUtilities.ShowError(error);
    })
}

function FillCompanySucess(response) {
    GlbCompnayArr = response;
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
    GetSegmentsDetails();
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
    .done(function (response) {
        GetClosePeriodDetailSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function GetClosePeriodDetailSucess(response) {
    return;
    GlbClosePeriod = response;
    $('#ddlClosePeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
    GetSegmentsDetails();
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
        AtlasUtilities.ShowError(error);
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
        AtlasUtilities.ShowError(error);
    })
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

    strHtml += '<th style="width:70px;">Description</th>';

    strHtml += '</tr>';

    $('#tblJEListTheadAudit').html(strHtml);
    //  funTrCreate();
    funFilterCreate();
}

function funFilterCreate() {
    var strhtml = '';

    strhtml += '<tr><td>Company</td><td><select id="ddlFilterCompany" class="form-control"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Currency</td><td><select id="ddlFilterCurrency" class="form-control"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Period</td><td style="float: left;width: 200px; margin-bottom: 5px;"><select id="ddlFilterPeriod" multiple class="form-control  pull-left" onfocus="javascript: funCheckCloseID();" ></select></td></tr>';
    strhtml += '<tr><td>Document #	</td><td><input type="text" id="ddlFilterDocument" class="form-control"/></td></tr>';
    strhtml += '<tr><td>Transaction Date	</td><td>From <input type="text" id="txtInvoiceNoS" class="datepicker form-control"> To <input class="datepicker form-control" type="text" id="txtInvoiceNoEnd"></td></tr>';
    strhtml += '<tr><td>Type</td><td><div style="width:27%;"><select id="ddlFilterType" multiple></div></td></tr>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'LO') {
            strhtml += '<tr><td>Location</td><td><input class="SearchCodeFilter form-control" type="text" id="txt_' + ArrSegment[i].SegmentName + '" onfocus="javascript:funFilterCoa(\'' + ArrSegment[i].SegmentName + '\',' + i + ');"></tr>';
        }
        if (ArrSegment[i].SegmentName == 'EP') {
            strhtml += '<tr><td>Episode</td><td><input class="SearchCodeFilter form-control" type="text" id="txt_' + ArrSegment[i].SegmentName + '" onfocus="javascript:funFilterCoa(\'' + ArrSegment[i].SegmentName + '\',' + i + ');"></tr>';

        }
        if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<tr><td>Detail</td><td><input class="SearchCodeFilter form-control" type="text" id="txt_' + ArrSegment[i].SegmentName + '" onfocus="javascript:funFilterCoa(\'' + ArrSegment[i].SegmentName + '\',' + i + ');"></tr>';

            // To <input type="text" class="SearchCodeFilter" id="txt_DT1" onfocus="javascript:funFilterCoa(' + i + ',' + '1' + ');">
        }
    }
    strhtml += '<tr><td>Set</td><td><input class="SearchOptionalCode form-control" type="text" id="txt_Set" onfocus = "javascript:GetOptional( 0,\'SET\',0);"></td></tr>';
    strhtml += '<tr><td>Vendor</td><td><div style="width:27%;"><select id="ddlFilterVendor" multiple class="form-control"></select><input type="hidden" id="hdnCOA"><input type="hidden" id="hdnCOA1"></div></td></tr>';
    $('#TblEditCriteriaTBody').html(strhtml);
    $(".datepicker").datepicker();
    funCheckCloseID();
    funAddFilter();
}

function funCheckCloseID() {
    $.ajax({
        url: APIUrlCheckCloseID + '?ProdID=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       funCheckCloseIDSucess(response);
   })
   .fail(function (error) {
       AtlasUtilities.ShowError(error);
   })
}

function funCheckCloseIDSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlFilterPeriod').append('<option value="' + response[i].ClosePeriod + '">' + response[i].ClosePeriod + '</option>');
    }
    $('#ddlFilterPeriod').multiselect();
}

function funAddFilter() {
    $('#ddlFilterCompany').html('');
    for (var i = 0; i < GlbCompnayArr.length; i++) {
        $('#ddlFilterCompany').append('<option value=' + GlbCompnayArr[i].CompanyID + '>' + GlbCompnayArr[i].CompanyCode + '</option>');
    }

    $('#ddlFilterType').append('<option value="AP">AP</option><option value="JE">JE</option><option value="PC">PC</option><option value="AR">AR</option><option value="PR">PR</option><option value="WT">WT</option>');
    $('#ddlFilterType').multiselect();
    funPHFilterNew();
    //GetVendoreByProdId();
}


//================================================ COA
function funFilterCoa(value, position) {
    var strSegment = 0;

    strSegment = position + 1;
    $.ajax({
        url: APIUrlGetCOABySegment + '?ProdId=' + localStorage.ProdId + '&Segment=' + strSegment,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funFilterCoaSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function funFilterCoaSucess(response) {
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.COANo,

        };
    });
    $(".SearchCodeFilter").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
            }
        }
    })
}

function ShowhideFilter() {
    //  alert($("#DvCriteria").css('display'));
    if ($("#DvCriteria").css('display') == 'none') {
        $('#DvCriteria').show();
        $('#DvTab').hide();
        $('#btnApply').show();
    } else {
        $('#DvCriteria').hide();
        $('#DvTab').show();
        $('#btnApply').hide();
        // funPostingList();
        funPHFilterNew();
    }
}

function funPostingList() {
    $.ajax({
        url: APIUrlAuditTabJEList + '?ProdId=' + localStorage.ProdId + '&AuditStatus=' + 'Posted',
        ///url: APIUrlAuditTabJEList + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funPostingHistorySucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function funPostingHistorySucess(response) {
    $('#TheadJEListPsoting').html(
      `<tr>
        <th></th>
        <th style="width: 5%;">Transaction #</th>
        <th>CO</th>
        <th style="width: 10%;">Document #</th>
        <th style="width: 8%;">Document Date</th>
        <th style="width: 8%;">Post Date</th>
        <th style="width: 5%;">Period</th>
        <th style="width: 5%;">Type</th>
        <th style="width: 5%;"># of Lines</th>
        <th style="width: 10%;">Debit</th>
        <th style="width: 10%;">Credit</th>
        <th style="width: 5%;">Currency</th>
      </tr>`);
    $('#tblTfoot').html(
      `<tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>`);

    $("#tblJEListPostingTBody").html('');

    var Tcount = response.length;
    console.log(response)
    var strHtml = '';
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            let CreditTotal = response[i].CreditTotal;
            CreditTotal = '$ ' + parseFloat(CreditTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); //(CreditTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            let DebitTotal = response[i].DebitTotal;
            DebitTotal = '$ ' + parseFloat(DebitTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); //(DebitTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            let currentStatus = response[i].CurrentStatus === 'Reversed';
            let source = response[i].Source;
            let sourceTableNull = response[i].SourceTable === null;
            let onclick = `javascript: setCurrentJEId(${response[i].JournalEntryId}); funJEDetailsPosting(${response[i].JournalEntryId},${response[i].TransactionNumber},${currentStatus},'${source}',${sourceTableNull},'${response[i].PostedDate}');`
            if (source == "JE") {
                oJEIds.push(response[i].JournalEntryId + ";" + response[i].TransactionNumber + ";" + currentStatus + ";" + source + ";" + sourceTableNull + ";" + response[i].PostedDate);

                strHtml +=
                  `<tr>
                <td></td>
                <td><a href=# style="color: #337ab7;" id=${response[i].JournalEntryId} onclick="${onclick}">${response[i].TransactionNumber}</a></td>
                <td style="width: 15px;">${response[i].CO}</td>
                <td>${response[i].DocumentNo}</td>
                <td>${response[i].EntryDate.substring(0, response[i].EntryDate.indexOf('T'))}</td>
                <td>${response[i].PostedDate}</td>
                <td>${response[i].CompanyPeriod}</td>
                <td>${response[i].Source}</td>
                <td>${response[i].TotalLines}</td>
                <td>${DebitTotal}</td>
                <td>${CreditTotal}</td>
                <td>${response[i].CurrencyTransaction}</td>
              </tr>`
            }
        }
    } else {
        strHtml += '<tr><td colspan="10" style="text-align: center;">No Record Found.. !!</td></tr>';
    }

    strHtml += '</table>';
    $('#tblJEListPostingTBody').html(strHtml);
    var oSearchVal = [];
    var table = $('#tblJEListPsoting').DataTable({
        "bDestroy": true,
        "iDisplayLength": 20,
        responsive: {
            details: {

            }
        },
        columnDefs: [{
            className: 'control',
            orderable: false,
            targets: 0,
        }],
        stateSave: true,
        stateSaveCallback: function (settings, data) {
            localStorage.setItem('DataTables_JEHistory' + settings.sInstance, JSON.stringify(data)); GetJEHistory();
        },
        stateLoadCallback: function (settings) {
            if (JSON.parse(localStorage.getItem('DataTables_JEHistory' + settings.sInstance)) != null) {
                var searchval = JSON.parse(localStorage.getItem('DataTables_JEHistory' + settings.sInstance)).columns;
                $.each(searchval, function (index, value) {
                    oSearchVal.push(value.search.search);
                });
            }
            return JSON.parse(localStorage.getItem('DataTables_JEHistory' + settings.sInstance))
        },
    }).on('click', 'th', function () {
        GetJEHistory();
    });

    $('#tblJEListPsoting tfoot th').each(function () {
        var title = $('#tblJEListPsoting thead th').eq($(this).index()).text();
        var val = ""; if (oSearchVal[$(this).index()] != undefined) { val = oSearchVal[$(this).index()]; }
        if (title == 'Transaction') {
            $(this).html('<input type="text" style="width:82px !important;" placeholder="' + title + '"  value="' + val + '"/>');
        } else if (title == 'CO' || title == 'Type') {
            $(this).html('<input type="text" style="width:60px !important;" placeholder="' + title + '"  value="' + val + '"/>');
        } else if (title == 'Transaction Date') {
            $(this).html('<input type="text" style="width:75px !important;" placeholder="' + title + '"  value="' + val + '"/>');
        } else if (title == 'Reverse') {

        } else {
            $(this).html('<input type="text" style="width:60px !important;" placeholder="' + title + '"  value="' + val + '"/>');
        }
    });

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

    $('#tblJEListPsoting tfoot tr').insertAfter($('#tblJEListPsoting thead tr'));
    GetJEHistory();
}

function funJEDetailsPosting(value, TranNo, currentStatus, source, sourceTableNull, PostedDate) {
    $('#tblJEPostingHistoryTBody').html(''); // reset the detail lines

    $('#btnBack').show();
    $('#hdnReverseValue').val('');
    $('#hdnReverseSource').val('');
    $('#hdnReverseCurrentStatus').val('');
    if (source === 'JE' && sourceTableNull) {
        $('#btnReverse').show();
        $('#hdnReverseValue').val(value);
        $('#hdnReverseSource').val(source);
        $('#hdnReverseCurrentStatus').val(currentStatus);
        $('#btnReverse').on('click', () => funReverseCheck(value, source, currentStatus));
        console.log(currentStatus);
        $('#spnMsgReversal').html(currentStatus ? 'A reversal on this transaction has been previously created. This could create a duplicate reversal transaction.  Are you sure you want to perform this action?' :
            'This will create an unposted transaction. Are you sure you want to perform this action?');
    }
    $('#SpnDCTranNumber').text(TranNo);
    $('#tblJEListPsoting').hide();
    $('#btnSaveJE').removeClass('atlas-hide');
    $('#navPrevNext').removeClass('atlas-hide');
    $('#tblJEListPsoting_info').hide();
    $('#tblJEListPsoting_paginate').hide();
    $('#txtPostDate').val(PostedDate);
    $('#tblJEPostingHistory').height(() => { return window.innerHeight - 200;})
    $('#tblJEPostingHistory').show();
    $('#JHistoryAuditListByJEDetail').show();
    $('#jperiod').show();
    $('#JhistoryTransactionBreadCrumb').show();

    funPostingHistoryJE(value);

    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th>#</th>';

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
    strHtml += '<th>TaxCode</th>';
    strHtml += '<th style="width:550px;">Description</th>';
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
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funGetJEDetailListPostingSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    });
}

function funGetJEDetailListPostingSucess(response) {
    var strhtml = '';
    let TCodes = (AtlasCache.Cache.GetItembyName('Config.TransactionCodes'))? AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON: [];

    for (var j = 0; j < response.length; j++) {
        let objData = Object.assign({}, AtlasUtilities.SEGMENTS_CONFIG._COA._COAID[response[j].COAId]);
        if (response[j].TransactionCodeString !== '') {
            let TString = response[j].TransactionCodeString.split(','); // Split the TransactionString
            TString.reduce(function(acc, cur) { 
                let [TC,TV] = cur.split(':'); 
                let TCV = TCodes.find(function(item) { 
                    return item.Details.TCID == TC;
                });
            
                let TVID = TCV.TV.find(function(tv){ 
                    return tv.TVID == TV; 
                });

                acc[TCV.TransCode] = TVID.TransValue;
                return acc;
                //TCodes.find(function (TC) { return TC.Details.TCID ===  }).TV.find(function (TV) { return TV.TVID === 1 })
            }, objData);
        }

        objData.SET = response[j].SetAC;
        objData.DEBIT = numeral(response[j].DebitAmount).format('0,0.00');
        objData.CREDIT = numeral(response[j].CreditAmount).format('0,0.00');
        objData.VENDOR = response[j].VendorName;
        objData.TAXCODE = response[j].TaxCode;
        objData.DESCRIPTION = response[j].Note;
        objData.JEDID = response[j].JournalEntryDetailId;
        let objD = objData;
        let rowID = j;

        strAuditCount = response.length;
        var strSplit = [];
        var strCOACode = response[j].COAString;
        if (strCOACode != '') {
            strSplit = strCOACode.split('|');
            if (j == 0) {
                $('#ddlCompany').append('<option value=' + strSplit[0] + '>' + strSplit[0] + '</option>');
            }
        }
        strhtml += '<tr id="' + response[j].JournalEntryDetailId + '" class="clsTr" name="' + j + '">';
        strhtml += '<td style="width:40px;">' + (j + 1) + '</td>';

        var strCompany = $('#ddlCompany').find("option:selected").text();
        for (var i = 0; i < ArrSegment.length; i++) {
            if (ArrSegment[i].SegmentName == 'DT')  {
                var strDetail = strSplit[i].split('>');
                strhtml += '<td class="width100"><input type="text"  class=" form-control  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onchange="javascript:fun1Segment123(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  value="' + strDetail[strDetail.length - 1] + '" disabled/></td>';
            }
            else if (ArrSegment[i].SegmentName == 'CO') strhtml += '<td class="width40"><input type="text"  class=" form-control  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onchange="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strCompany + '" coacode="' + strCompany + '"  disabled/></td>';
            else if (ArrSegment[i].SegmentName == 'LO') strhtml += '<td class="width40"><input type="text"  class=" form-control  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onchange="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" onfocus="this.select();"  value="' + strSplit[i] + '" disabled/></td>';
            else strhtml += '<td class="width40"><input type="text"  class=" form-control  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onchange="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" disabled/></td>';
        }

        for (var i = 0; i < ArrOptionalSegment.length; i++) {
            if (i == 0) {
                strhtml += '<td class="width40" ><span class="clsOptional" id="txtOptional_' + j + '_' + i + '">' + response[j].SetAC + '</span></td>';
            } else if (i == 1) {
                strhtml += '<td class="width40"><span class="clsOptional" id="txtOptional_' + j + '_' + i + '">' + response[j].SeriesAC + '</span></td>';
            }
        }
        for (var i = 0; i < ArrTransCode.length; i++) {
            strhtml += `<td class="DistributionSegment_JE width40"><input value="${AtlasPaste.FillFieldValue(objD, ArrTransCode[i].TransCode)}" type="text" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" class="form-control SearchCode clsPaste clsTransCode${rowID} clsTransCode_${rowID}" onfocus="javascript:funTransDetail(${rowID},${ArrTransCode[i].TransId})" id="txt_${ArrTransCode[i].TransCode}_${rowID}" name="${ArrTransCode[i].TransId}" TCode="${ArrTransCode[i].TransCode}" /></td>`;
        }

        strhtml += '<td class="width100"><input type="text" class="form-control DebitClass detectTab w2field amount" id="txtDebit_' + j + '"  value="' + response[j].DebitAmount + '" disabled/></td>';
        strhtml += '<td class="width100"><input type="text" class="form-control CreditClass detectTab w2field amount" id="txtCredit_' + j + '" value="' + response[j].CreditAmount + '" disabled/></td>';
        strhtml += '<td id="Vendor_' + j + '" class="width100"><input type="text" class="form-control SearchVendor clsVendor  " onfocus="javascript:GetVendoreByProdId(' + j + ');" onblur="javascript:funVendorBlur(' + j + ');" id="txtVendor_' + j + '" value="' + response[j].VendorName + '"  name="' + response[j].VendorId + '"/></td>';

        strhtml += '<td class="width40"><input type="text" class="form-control clsTaxCode clsTax number"  onfocus="javascript:funTaxCode(' + j + ');"  id="ddlTaxCode_' + j + '"  value="' + response[j].TaxCode + '"/></td>';

        strhtml += '<td class="width95"><input class="form-control clsNotes" tyep="text" id="txtDesc_' + j + '" value="' + response[j].Note + '" /><input type="hidden" class="clsCOACode" id="hdnCode_' + j + '" value="' + response[j].COAString + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + j + '"  value="' + response[j].COAId + '"></td>';
        strhtml += '</tr>';
    }

    $('#tblJEPostingHistoryTBody').html(strhtml);

    $('#ddlClosePeriod').css("display", "block");
    $("#btnSaveJE").css("display", "block");

    var Tcount = response.length;
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            var TransactionvalueString = response[i].TransactionvalueString;
            var TvstringSplit = TransactionvalueString.split(',');

            for (var j = 0; j < TvstringSplit.length; j++) {
                var strTvs = TvstringSplit[j].split(':');
                $('#txt_' + strTvs[0] + '_' + i).val(strTvs[1]);
                $('#txt_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);
            }
        }
    }
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib
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
    .done(function (response) {
        funPostingHistoryJESucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function funPostingHistoryJESucess(response) {
    AtlasDocument.BindCurrency(response[0].CurrencyTransaction);
    BatchManager.ForceBatch(response[0].BatchNumber);
    iJournalEntryId = response[0].JournalEntryId
    $('#txtTransactionDate').val(response[0].EntryDate);
    $('#txtDescription').val(response[0].Description);
    $('#txtReferenceNo').val(response[0].DocumentNo)

    // Since this is a posted transaction, we will use RenderData ONLY the period of the transaction
    AtlasForms.Controls.DropDown.RenderData(
        [{
            'ClosePeriodId': response[0].ClosePeriodId
            , 'CompanyPeriod': response[0].CompanyPeriod
            , 'PeriodStatus': 'Period: '
        }]
        , AtlasForms.FormItems.ddlClosePeriod(response[0].ClosePeriodId)
    );

}

function funBack() {
    $('#btnBack').hide();
    $('#btnReverse').hide();
    $('#tblJEListPsoting').show();
    $('#JHistoryAuditListByJEDetail').hide();
    $('#jperiod').hide();
    $('#JhistoryTransactionBreadCrumb').hide();
    $('#tblJEPostingHistory').hide();
    $('#tblJEListPsoting_info').show();
    $('#tblJEListPsoting_paginate').show();
    $('#btnSaveJE').hide();
    $('#navPrevNext').addClass('atlas-hide');
    $('#ddlClosePeriod').hide();
}

//=================================================== Filter
function funPHFilterNew() {
    var strss2 = '';
    var strss3 = '';
    var strss4 = '';
    var strss5 = '';
    var strStartDate = '';
    var strEndDate = '';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (i == 1) {
            strss2 = $('#txt_' + ArrSegment[i].SegmentName).val();
        } else if (i == 2) {
            strss3 = $('#txt_' + ArrSegment[i].SegmentName).val();
        } else if (i == 3) {
            strss4 = $('#txt_' + ArrSegment[i].SegmentName).val();
        } else if (i == 4) {
            strss5 = $('#txt_' + ArrSegment[i].SegmentName).val();
        }
    }
    if ($('#txtInvoiceNoS').val() == '') {
        strStartDate = '01/01/1990';
    } else {
        strStartDate = $('#txtInvoiceNoS').val();
    }

    if ($('#txtInvoiceNoEnd').val() == '') {
        strEndDate = strDate;
    } else {
        strEndDate = $('#txtInvoiceNoEnd').val();
    }

    var strVendor1 = $('#ddlFilterVendor').val();
    var strVendor = '';
    if (strVendor1 != null) {
        for (var z = 0; z < strVendor1.length; z++) {
            strVendor += strVendor1[z] + ',';
        }
    }

    var strType = $("#ddlFilterType").val();
    var StrFinalType = '';
    if (strType == null) {
        strType = '';
    } else {
        for (var i = 0; i < strType.length; i++) {
            StrFinalType = StrFinalType + ',' + strType[i]
        }
    }

    var CPeriodList = $('#ddlFilterPeriod').val();
    var PeriodList = '';
    if (CPeriodList != null) {
        for (var z = 0; z < CPeriodList.length; z++) {
            PeriodList += CPeriodList[z] + ',';
        }
    }

    if (pubObj != '') {
    } else {
        var obj = {
            ProdId: localStorage.ProdId,
            ss1: $('#ddlFilterCompany').find("option:selected").text(),
            ss2: strss2,
            ss3: strss3,
            ss4: strss4,
            ss5: strss5,
            START: strStartDate,
            End: strEndDate,
            VendorIds: strVendor,
            CompanyId: $('#ddlFilterCompany').val(),
            Currency: $('#ddlFilterCurrency').val(),
            Period: PeriodList,
            Source: StrFinalType,
            SetId: $('#txt_Set').attr('accountid'),
            Type: 'Posted',
            DocumentNo: $('#ddlFilterDocument').val()
        }
        pubObj = obj;
    }
    $.ajax({
        url: APIUrlGetJEDetailFilter,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        data: JSON.stringify(pubObj),
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funPostingHistorySucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

//=============================revese 
function funReverseCheck(value, Source, CurrentStatus) {
    $('#RereverseJE').show();
}

function funReverse() {
    var value = $('#hdnReverseValue').val();
    var Source = $('#hdnReverseSource').val();
    var CurrentStatus = $('#hdnReverseCurrentStatus').val();
    if (Source == 'JE') {
        $.ajax({
            url: APIUrlGetfunReverse + '?JournalEntryId=' + value,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            funReverseSucess(response, value);
        })
        .fail(function (error) {
            AtlasUtilities.ShowError(error);
        });
    } else {
        ShowMsgBox('showMSG', 'Resvese is only allow for JE Type', '', '');
    }
}

function funReverseSucess(response, value) {
    $('#SaveSuccess').show();
    $('#spnTransId').text(response);
    $('#btnReverse').hide();
    $('#RereverseJE').hide();
    //  funPHFilterNew();
}
function funSaveOkResponse() {
    $('#SaveSuccess').hide();
    $('#fade').hide();

    // #1733 keep the user on the transaction so they can make additional changes or move to P/N transaction
    //window.location = HOST + '/Ledger/JEPostingHistory';
    //funBack();
}

function funGetClosePeriodDetail() {
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());
    return;
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
    return;
    GlbClosePeriod = response;
    $('#ddlClosePeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }

}

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
        console.log(error);
    })
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
       AtlasUtilities.ShowError(error);
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
    } else {
        //$('#txt_' + Name + '_' + value).val(GlbTransList[0].TransValue);
        //$('#txt_' + Name + '_' + value).attr('TransValueId', GlbTransList[0].TransactionValueID);
    }
}

function funSegment(values, SegmentName, SegmentP) {
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
                }
            }
        })
    } else {
    }
}

function funSaveJE() {
    let invaliddata = 0;
    AtlasUtilities.ShowLoadingAnimation();

    formmodified = 0;
    var ArrJEDetail = [];
    var strDebitAmount = "0.00";
    var strCreditAmount = "0.00";
    var strImAmount = "0.00";

    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: iJournalEntryId
        , Source: $('#ddlType').val()
        , Description: $('#txtDescription').val()
        , EntryDate: $('#txtTransactionDate').val()
        , DebitTotal: strDebitAmount
        , CreditTotal: strCreditAmount
        , TotalLines: ''
        , ImbalanceAmount: strImAmount.substring(1, strImAmount.length)
        , AuditStatus: 'Posted'
        , PostedDate: $('#txtPostDate').val()
        , ReferenceNumber: ''
        , BatchNumber: BatchManager.BatchNumber
        , ProdId: localStorage.ProdId
        , createdBy: localStorage.UserId
        , ClosePeriod: $('#ddlClosePeriod').val()
        , CompanyId: $('#ddlCompany').val()
        , DocumentNo: $('#txtReferenceNo').val()
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

    for (var i = 0; i < strTr.length; i++) {
        var strId = strTr[i].id;
        var TransString = '';
        var COAOptional = '';
        var strSet = '';
        var strSeires = '';
        var strOption = $('.clsOptional' + i);

        for (var j = 0; j < strOption.length; j++) {
            var strid = strOption[j].id;
            var strAccountId = $('#' + strid).attr('AccountId');
            if (j == 0) {
                strSet = strAccountId;
            } else if (j == 1) {
                strSeires = strAccountId;
            }
        }
        COAOptional = COAOptional.slice(0, -1);

        let TCodes = (AtlasCache.Cache.GetItembyName('Config.TransactionCodes'))? AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON: undefined;
        var strTrans = $('.clsTransCode' + i);
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
        var FVendorName = VendorName[i].value;
        var strVId = VendorName[i].id;
        var FVendorId = $('#' + strVId).attr('name');
        //  var FThirdParty = ThirdParty[i].checked;
        var FNote = Note[i].value;
        var FstrCOACode = strCOACode[i].value;
        var FstrCOAId = strCOAId[i].value;
        var FstrTaxCode = strTaxCode[i].value;

        var objJEDetail = {
            JournalEntryId: iJournalEntryId,
            JournalEntryDetailId: strId
            , TransactionLineNumber: $('#SpnDCTranNumber').text()
            , COAId: FstrCOAId
            , DebitAmount: FDebitAmount.replace('$', '')
            , CreditAmount: FCreditAmount.replace('$', '')
            , VendorId: FVendorId
            , VendorName: FVendorName
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
        $('#JhistoryTransactionBreadCrumb').notify('This entry was NOT SAVED. Please correct your data and then save again.');
        $('#fade').hide();
        AtlasUtilities.HideLoadingAnimation();
        return 0;
    }

    $.ajax({
        url: APIUrlSaveJE,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(finalObj),
    })
    .done(function (response) {
        funSaveJESucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function funSaveJESucess(response) {
    AtlasUtilities.HideLoadingAnimation();
    $('#spnTransId').text($('#SpnDCTranNumber').text());
    $('#SaveSuccess').show();
}

function funPrevNext(index)
{
    if (index == 0) $('#prev').hide(); else $('#prev').show();
    if (index == oPrevNextJEId.length - 1) $('#next').hide(); else $('#next').show();
    if (index <= oPrevNextJEId.length) {
        var JEId = oPrevNextJEId[index];

        $.each(oJEIds, function (index, value) {
            var JEDetails = value.split(';');

            if (JEDetails[0] == JEId) {
                funJEDetailsPosting(JEDetails[0], JEDetails[1], JEDetails[2], JEDetails[3], JEDetails[4], JEDetails[5]);
            }
        });
    }
}

function setCurrentJEId(Id)
{
    $.each(oPrevNextJEId, function (index, value) {
        var JEId = value.split(';')[0];
        if (JEId == Id) { iPrevNextIndx = index; }

    });
}

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


$('#btnSaveJE').click(function () {
    funSaveJE();
});

function GetVendoreByProdId() {
    var strval = 'All';
    $.ajax({

        url: APIUrlGetVendoreByProdId + '?SortBy=' + strval + '&ProdID=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        async: false,
        cache: false,
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVendoreByProdIdSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    });
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
            TaxCode: m.DefaultDropdown,
        };
    });
    $(".SearchVendor").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).attr('name', ui.item.value);
            $(this).attr('TaxtCode', ui.item.TaxCode);
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $(this).attr('name', ui.item.value);
            $(this).attr('TaxtCode', ui.item.TaxCode);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {

            }
        }
    })
}

function funVendorBlur(value) {
    //    GlbVendorList
    var strval = $('#txtVendor_' + value).val();

    if (strval != '') {
        for (var i = 0; i < GlbVendorList.length; i++) {
            if (GlbVendorList[i].VendorName.match(strval)) {
                //if (strval == GlbVendorList[i].VendorName) {
                $('#txtVendor_' + value).val(GlbVendorList[i].VendorName);
                $('#txtVendor_' + value).attr('name', GlbVendorList[i].VendorID);

                break;

            } else {
                $('#txtVendor_' + value).val('');
                $('#txtVendor_' + value).removeAttr('name');

            }
        }
    } else {
        //$('#txtVendor_' + value).val(GlbVendorList[0].VendorName);
        //$('#txtVendor_' + value).attr('name', GlbVendorList[0].VendorID);
    }
}

function GetJEHistory() {
    oPrevNextJEId = [];

    var table = $('#tblJEListPsoting')
    table.find('tr').each(function (i, el) {
        var id = $(this).find("td").find('a').attr("id");
        if (id != undefined) {
            oPrevNextJEId.push(id);
        }
    });

    localStorage.setItem("JEHistory", JSON.stringify(oPrevNextJEId));
}