var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlAuditTabJEList = HOST + "/api/Ledger/GetJournalEntryList";
var APIUrlPostingHistory = HOST + "/api/Ledger/GetJournalEntryDetailByStatus";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlfunGetJEntryDetail = HOST + "/api/Ledger/GetJEntryByJEId";
var APIUrlGetJEDetailList = HOST + "/api/Ledger/GetJEDetailByJEId";

var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlSaveJE = HOST + "/api/Ledger/SaveJE";
var APIUrlGetCOABySegment = HOST + "/api/Ledger/GetCOABySegmentNumber";
var APIUrlGetJEDetailFilter = HOST + "/api/Ledger/GetJEDetailFilter";
var APIUrlCheckCloseID = HOST + "/api/Ledger/GetClosePeriodDeomJE";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";

var ArrSegment = [];
var ArrOptionalSegment = [];
var GlbCompnayArr = [];
var ArrTransCode = [];
var strTrCount = 0;
var strJournalEntryIdAudit = 0;
var strDate = '';
var StrCompanyId = 0;
var strClosePeriodId = 0;

var GlbClosePeriod = [];
var strCompnayId = 0;
var strDescription = '';
var GlbJEDetailResponse = [];
var oJEDisId = [];
var iPrevNextIndx = 0;
var oJEDCIds = [];

$(document).ready(function () {
    formmodified = 0;
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
    oJEDisId = JSON.parse(localStorage.getItem("JEDistribution"));
    FillCompany();

})


function getFormattedPartTime(partTime) {
    if (partTime < 10)
        return "0" + partTime;
    return partTime;
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
    GlbCompnayArr = response;
    //for (var i = 0; i < response.length; i++) {
    //    if (i == 0)
    //    {
    //        strCompnayId = response[i].CompanyID;
    //    }
    //    $('#ddlFilterCompany ').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    //}

    GetSegmentsDetails();
    // funGetClosePeriodDetail('Auto');
    //FillVendor();
}
//================================================== Close Period
function funGetClosePeriodDetail() {

    $.ajax({
        url: APIUrlCompanyClosePeriod + '?CompanyId=' + $('#ddlFilterCompany').val(),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetClosePeriodDetailSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetClosePeriodDetailSucess(response) {

    $('#ddlFilterPeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlFilterPeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
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
    //strHtml += '<th>3P</th>';
    strHtml += '<th>TaxCode</th>';

    strHtml += '<th style="width:70px;">Description</th>';

    strHtml += '</tr>';

    $('#tblJEListTheadAudit').html(strHtml);
    //  funTrCreate();
    funFilterCreate();
}
//=============================================== Vendor 
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
     .done(function (response)
     { GetVendoreByProdIdSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetVendoreByProdIdSucess(response) {
    //456
    $('#ddlFilterVendor').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlFilterVendor').append('<option value="' + response[i].VendorID + '">' + response[i].VendorName + '</option>');
    }
    $('#ddlFilterVendor').multiselect();

}

function ShowhideFilter() {

    //  alert($("#DvCriteria").css('display'));
    if ($("#DvCriteria").css('display') == 'none') {
        $('#DvCriteria').show();
        $('#DvTab').hide();
        $('#btnApply').show();
        $('#btnSaveDCSave').hide();
    }

    else {
        $('#DvCriteria').hide();
        $('#DvTab').show();
        $('#btnApply').hide();
        // funDCFilter();
        funDCFilterNew();
    }
}

function funFilterCreate() {
    //123
    var strhtml = '';

    strhtml += '<tr><td>Company</td><td><select id="ddlFilterCompany" class="form-control"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Currency</td><td><select id="ddlFilterCurrency" class="form-control"><option value="USD">USD</option></select></td></tr>';
    // strhtml += '<tr><td>Period</td><td><select id="ddlFilterPeriod" class="form-control" ><option value="0">Select</option><option value="Current">Current</option><option value="Future">Future</option><option value="Both">Both</option></select></td></tr>';
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
   .done(function (response)
   { funCheckCloseIDSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}

function funCheckCloseIDSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlFilterPeriod').append('<option value="' + response[i].ClosePeriod + '">' + response[i].ClosePeriod + '</option>');
    }
    $('#ddlFilterPeriod').multiselect();
}

function funAddFilter() {

    $('#ddlFilterCompany').html(''); $('#ddlFilterVendor').html('');
    for (var i = 0; i < GlbCompnayArr.length; i++) {
        $('#ddlFilterCompany').append('<option value=' + GlbCompnayArr[i].CompanyID + '>' + GlbCompnayArr[i].CompanyCode + '</option>');
    }
    //funGetClosePeriodDetail();

    $('#ddlFilterType').append('<option value="JE">JE</option><option value="PR">PR</option><option value="WT">WT</option>');
    $('#ddlFilterType').multiselect();
    //funGetClosePeriodDetail();
    GetVendoreByProdId();
}

//
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


.done(function (response)
{ funFilterCoaSucess(response); })
.fail(function (error)
{ ShowMSG(error); })


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

function funDCFilter() {
    $.ajax({
        url: APIUrlAuditTabJEList + '?ProdId=' + localStorage.ProdId + '&AuditStatus=' + 'Posted',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        DistributionChangeSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function DistributionChangeSucess(response) {
    var Tcount = response.length;
    var strHtml = '';
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            //"1234255364".replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            var CreditTotal = response[i].CreditTotal;
            CreditTotal = '$ ' + parseFloat(CreditTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); //(CreditTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            var DebitTotal = response[i].DebitTotal;
            DebitTotal = '$ ' + parseFloat(DebitTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); //(DebitTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            oJEDCIds.push(response[i].JournalEntryId + ";" + response[i].CompanyId + ";" + response[i].ClosePeriod + ";" + ''+";"+ response[i].TransactionNumber);
            strHtml += `
              <tr>
                <td><input type="checkBox" class="clsJEList" id="Chk${response[i].JournalEntryId}" name="${response[i].JournalEntryId}"/></td>
                <td><a href=# style="color: #337ab7;" onclick="javascript: setCurrentId(${response[i].JournalEntryId}); funJEDetailsForDC(${response[i].JournalEntryId},${response[i].CompanyId},${response[i].ClosePeriod},\'\',${response[i].TransactionNumber});">${response[i].TransactionNumber}</a></td>
                <td>${response[i].CO}</td>
                <td>${response[i].DocumentNo}</td>
                <td>${response[i].EntryDate}</td>
                <td>${DebitTotal}</td>
                <td>${CreditTotal}</td>
                <td>${response[i].CompanyPeriod}</td>
                <td>${response[i].Source}</td>
                <td>${response[i].CurrencyTransaction}</td>
              </tr>
            `;
        }
    }
    else {
        strHtml += '<tr><td colspan="10" style="text-align: center;">No Record Found.. !!</td></tr>';
    }
    $('#tblJEListDCTBody').html(strHtml);
    var oSearchVal = [];
    var table = $('#tblJEListDC').DataTable({
        "bDestroy": true,
        "iDisplayLength": 25,
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
            localStorage.setItem('DataTables_JEDis' + settings.sInstance, JSON.stringify(data)); GetJEDis();
        },
        stateLoadCallback: function (settings) {
            if (JSON.parse(localStorage.getItem('DataTables_JEDis' + settings.sInstance)) != null) {
                var searchval = JSON.parse(localStorage.getItem('DataTables_JEDis' + settings.sInstance)).columns;
                $.each(searchval, function (index, value) {
                    oSearchVal.push(value.search.search);
                });
            }
            return JSON.parse(localStorage.getItem('DataTables_JEDis' + settings.sInstance))
        },
    }).on('click', 'th', function () {
        GetJEDis();
    });

    $('#tblJEListDC tfoot th').each(function () {
        var title = $('#tblJEListDC thead th').eq($(this).index()).text();
        var val = ""; if (oSearchVal[$(this).index()] != undefined) { val = oSearchVal[$(this).index()]; }
        if (title == 'Transaction') {
            $(this).html('<input type="text" style="width:82px !important;" placeholder="' + title + '"  value="' + val + '"/>');
        }

        else if (title == 'CO' || title == 'Type') {
            $(this).html('<input type="text" style="width:60px !important;" placeholder="' + title + '"  value="' + val + '"/>');

        }
        else if (title == 'Transaction Date') {
            $(this).html('<input type="text" style="width:75px !important;" placeholder="' + title + '"  value="' + val + '"/>');

        }
        else if (title == 'Reverse') {

        }
        else {
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

    $('#tblJEListDC tfoot tr').insertAfter($('#tblJEListDC thead tr'));
    GetJEDis();
}

function funJEDetailsForDC(value, CompanyId, ClosePeriodId, Dvalue,transno) {
    $('#tblJEListDC').hide();
    $('#tblJEListDC').hide();
    $('#tblJEListDC_info').hide();
    $('#tblJEListDC_paginate').hide();
    $('#btnFilter').hide();
    $('#btnSaveDCSave').show();
    $('#btnCancelDCSave').show();
    $('#spnTrasactionDis').text(transno);
    $('#JEDistBreadCrumb').show();
    strJournalEntryIdAudit = value;
    StrCompanyId = CompanyId;
    strClosePeriodId = ClosePeriodId;
    strDescription = Dvalue;
    //=====================
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th>Number</th>';

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
    strHtml += '<th>TaxCode</th>';
    strHtml += '<th style="width:250px;">Description</th>';

    strHtml += '</tr>';

    $('#tblJEDForDCTHead').html(strHtml);

    funGetJEById(value);
    GetJEDetailById(value);

}


function funGetJEById(value) {
    $.ajax({
        url: APIUrlfunGetJEntryDetail + '?JournalEntryId=' + value,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funPostingHistoryJESucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
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

    $('#spnDocumentDC').text(response[0].DocumentNo);
}

function GetJEDetailById(value) {
    $.ajax({
        url: APIUrlGetJEDetailList + '?JournalEntryId=' + value,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funJEDetailsForDCSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.ShowError(error);
    })
}

function funJEDetailsForDCSucess(response) {
    GlbJEDetailResponse = response;
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
        strhtml += '<td style="width:30px;">' + (j+1) + '</td>';

        for (var i = 0; i < ArrSegment.length; i++) {
            //------------------------------------------ //----------Important Code---------------------//---------------------
            if (i == 0) { strCOAPval = strSplit[0]; }
            else if (i == 1) { strCOAPval = strSplit[0] + '|' + strSplit[1]; }
            else if (i == 2) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2]; }
            else if (i == 3) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3]; }
            else if (i == 4) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4]; }
            else if (i == 5) { strCOAPval = strSplit[0] + '|' + strSplit[1] + '|' + strSplit[2] + '|' + strSplit[3] + '|' + strSplit[4] + '|' + strSplit[5]; }

            if (ArrSegment[i].SegmentName == 'DT') {
                var str = strSplit[i].split('>');

                if (str.length > 1) {
                    var strl = str.length;
                    strl = strl - 1;
                    strDetail = str[strl];
                }
                else {
                    strDetail = str[0];
                }
                if (response[j].SourceTable == 'Payment') {
                    strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:fun1Segment123(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strDetail + '"  coacode="' + strCOAPval + '" disabled/></td>';
                }
                else {
                    strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:fun1Segment123(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strDetail + '"  coacode="' + strCOAPval + '" /></td>';
                }

            }
            else if (ArrSegment[i].SegmentName == 'CO') {
                strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '"  coacode="' + strCOAPval + '" disabled/></td>';

            }
            else {
                if (response[j].SourceTable == 'Payment') {
                    strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" coacode="' + strCOAPval + '" disabled/></td>';
                }
                else {
                    strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" coacode="' + strCOAPval + '" /></td>';
                }

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
        //var strDebitAmount = '$ ' + parseFloat(response[j].DebitAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        //var strCreditAmount = '$ ' + parseFloat(response[j].CreditAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        strhtml += '<td class="width40"><input type="text" disabled class="DebitClass detectTab w2field amount" id="txtDebit_' + j + '" value="' + response[j].DebitAmount + '"/></td>';
        strhtml += '<td class="width40"><input type="text" disabled class="CreditClass detectTab w2field amount" id="txtCredit_' + j + '" value="' + response[j].CreditAmount + '"/></td>';
        strhtml += '<td id="Vendor_' + strTrCount + '" class="width75"><input type="text" disabled class="SearchVendor  clsVendor " onfocus="javascript:GetVendoreByProdId(' + j + ');" onblur="javascript:funVendorBlur(' + j + ');" id="txtVendor_' + strTrCount + '" value="' + response[j].VendorName + '" name="' + response[j].VendorId + '"/></td>';

        strhtml += '<td class="width40"><input type ="text" disabled value="' + response[j].TaxCode + '" class="clsTaxCode"/></td>'
        strhtml += '<td class="width95"><input type="text" disabled  class=" clsNotes" id="txtNotes_' + j + '" onblur="javascript:funFocusout(' + j + ');" value="' + response[j].Note + '" title="' + response[j].Note + '"/><input type="hidden" class="clsJEId" value="' + response[j].JournalEntryDetailId + '"/><input type="hidden" class="clsCOACode"  id="hdnCode_' + j + '" value="' + response[j].COAString + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + j + '" value="' + response[j].COAId + '"></td>';
        strhtml += '</tr>';
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
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib
}


$('#btnSaveDCSave').click(function () {

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
        funSaveDC();
    }

})
function funSaveDC() {
    var strChangeCount = 0;
    var ArrJEDetail = [];
    var strDebitAmount = $('#spnDebitDC').text();
    var strCreditAmount = $('#spnCreditDC').text();
    var strImAmount = $('#txtImBalanceDC').text();
    // strJournalEntryIdAudit = values;
    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: 0
        , SourceTable: 'Journal'
        , Source: 'JE'
        , Description: strDescription
        , EntryDate: strDate
        , DebitTotal: strDebitAmount.replace('$', '')
        , CreditTotal: strCreditAmount.replace('$', '')
        , TotalLines: ''
        , ImbalanceAmount: strImAmount.replace('$', '')
        , AuditStatus: 'Saved'
        , PostedDate: $('#txtPostDate').val()
        , ReferenceNumber: strJournalEntryIdAudit
        , BatchNumber: 'DC' + BatchManager.BatchNumber
        , ProdId: localStorage.ProdId
        , createdBy: localStorage.UserId
        , ClosePeriod: strClosePeriodId
        , CompanyId: StrCompanyId
        , DocumentNo: $('#spnDocumentDC').text()
        , CurrencyTransaction: $('#ddlCurrency :selected').val()
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
        var FDebitAmount = DAmount[i].value.replace('$', '');
        var FCreditAmount = CAmount[i].value.replace('$', '');
        var FVendorName = VendorName[i].value;
        var strVId = VendorName[i].id;
        var FVendorId = $('#' + strVId).attr('name');
        var FNote = Note[i].value;
        var FstrCOACode = strCOACode[i].value;
        var FstrCOAId = strCOAId[i].value;
        var FstrTaxCode = strTaxCode[i].value;


        // if (FJEDetailId == GlbJEDetailResponse[i].JournalEntryDetailId)
        if (FstrCOACode != GlbJEDetailResponse[i].COAString) {
            strChangeCount++;
            var objJEDetail = {
                JournalEntryId: ''
                             , JournalEntryDetailId: 0
                             , TransactionLineNumber: $('#spnTrasactionNoDC').text()
                             , COAId: FstrCOAId
                             , DebitAmount: FDebitAmount
                             , CreditAmount: FCreditAmount
                             , VendorId: FVendorId
                             , VendorName: FVendorName
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


            var objJEDetail = {
                JournalEntryId: ''
                            , JournalEntryDetailId: 0
                            , TransactionLineNumber: $('#spnTrasactionNoDC').text()
                            , COAId: GlbJEDetailResponse[i].COAId
                            , DebitAmount: FCreditAmount
                            , CreditAmount: FDebitAmount
                            , VendorId: FVendorId
                            , VendorName: FVendorName
                            , Note: FNote
                            , CompanyId: ''
                            , ProdId: localStorage.ProdId
                            , CreatedBy: localStorage.UserId
                            , COAString: GlbJEDetailResponse[i].COAString
                            , TransactionCodeString: TransString
                            , SetId: strSet
                            , SeriesId: strSeires
                           , TaxCode: FstrTaxCode
            }
            ArrJEDetail.push(objJEDetail);
        }




    }

    var finalObj = {
        objJE: objJournalEntry,
        objJEDetail: ArrJEDetail
    }

    if (strChangeCount != 0) {
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
    else {
        ShowMsgBox('showMSG', 'None of Changes were made..', '', '');
    }
}
function funSaveDCSucess(response) {
    //funDistributionChange();
    //   ShowhideFilter();

    $('#spnTransId').text(response);
    $('#SaveSuccess').show();
    $('#spnSaveOk').focus();
}
function funSaveOkResponse() {
    formmodified = 0;
    location.reload(true);
}
//=============================================

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
}

//=================================================== Filter
function funDCFilterNew() {

    var strss2 = '';
    var strss3 = '';
    var strss4 = '';
    var strss5 = '';
    var strStartDate = '';
    var strEndDate = '';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (i == 1) {
            strss2 = $('#txt_' + ArrSegment[i].SegmentName).val();
        }
        else if (i == 2) {
            strss3 = $('#txt_' + ArrSegment[i].SegmentName).val();
        }
        else if (i == 3) {
            strss4 = $('#txt_' + ArrSegment[i].SegmentName).val();
        }
        else if (i == 4) {
            strss5 = $('#txt_' + ArrSegment[i].SegmentName).val();
        }
    }
    if ($('#txtInvoiceNoS').val() == '') {
        strStartDate = '01/01/1990';
    }
    else {
        strStartDate = $('#txtInvoiceNoS').val();
    }
    if ($('#txtInvoiceNoEnd').val() == '') {
        strEndDate = strDate;
    }
    else {
        strEndDate = $('#txtInvoiceNoEnd').val();
    }
    var strVendor = $('#ddlFilterVendor').val();
    var srttttt = '';
    if (strVendor == null) {
        strVendor = '';
    }
    else {
        for (var i = 0; i < strVendor.length; i++) {
            srttttt = srttttt + ',' + strVendor[i]
        }
    }
    var strType = $("#ddlFilterType").val();
    var StrFinalType = '';
    if (strType == null) {
        strType = '';
    }
    else {
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


    var obj = {
        ProdId: localStorage.ProdId,
        ss1: $('#ddlFilterCompany').find("option:selected").text(),
        ss2: strss2,
        ss3: strss3,
        ss4: strss4,
        ss5: strss5,
        START: strStartDate,
        End: strEndDate,
        VendorIds: srttttt,
        CompanyId: $('#ddlFilterCompany').val(),
        Currency: $('#ddlFilterCurrency').val(),
        Period: PeriodList,
        Source: StrFinalType,
        SetId: $('#txt_Set').attr('accountid'),
        Type: 'Posted',
        DocumentNo: $('#ddlFilterDocument').val()
    }

    $.ajax({
        url: APIUrlGetJEDetailFilter,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        DistributionChangeSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

//=======
$(document).ready(function () {
    formmodified = 0;

    $('form *').change(function () {
        formmodified = 1;

    });
    window.onbeforeunload = confirmExit;
    function confirmExit() {
        if (formmodified == 1) {
            return "This will cancel your entry and your data will be lost. Are you sure you want to do this?";
        }
    }
    $("input[name='commit']").click(function () {
        formmodified = 0;
    });
});


function funCancelDC() {
    formmodified = 0;
    window.location.href = 'JEDistributionChange';
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

  .done(function (response)
  { fun1Segment123Sucess(response, values, SegmentP); })
  .fail(function (error)
  { console.log(error); })
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
            let matches = $.map(array, (item) => { if (item.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) return  item; });
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
}
function GetJEDis() {
    oJEDisId = [];

    var table = $('#tblJEListDC')
    table.find('tr').each(function (i, el) {
        var id = $(this).find("td").find('input').attr("name");
        if (id != undefined) {
            oJEDisId.push(id);
        }
    });

    localStorage.setItem("JEDistribution", JSON.stringify(oJEDisId));
}


function funPrevNext(index) {
    if (index == 0) $('#prev').hide(); else $('#prev').show();
    if (index == oJEDisId.length - 1) $('#next').hide(); else $('#next').show();

    var JEId = oJEDisId[index];

    $.each(oJEDCIds, function (index, value) {
        var JEDetails = value.split(';');
        if (JEDetails[0] == JEId) {
            funJEDetailsForDC(JEDetails[0], JEDetails[1], JEDetails[2], JEDetails[3], JEDetails[4]);
        }
    });
}

function setCurrentId(Id) {
    $.each(oJEDisId, function (index, value) {
        var JEDisId = value;
        if (JEDisId == Id) { iPrevNextIndx = index; }

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