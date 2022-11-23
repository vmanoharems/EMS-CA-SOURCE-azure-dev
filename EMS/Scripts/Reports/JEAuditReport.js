var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlAuditTabJEList = HOST + "/api/Ledger/GetJournalEntryList";

var APIUrlfunGetJEntryDetail = HOST + "/api/Ledger/GetJEntryByJEId";
var APIUrlGetJEDetailList = HOST + "/api/Ledger/GetJEDetailByJEId";
var APIUrlDeleteRecordAudit = HOST + "/api/Ledger/DeleteJournalEntryDetailById";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlSaveJE = HOST + "/api/Ledger/SaveJE";

var APIUrlGetCOABySegment = HOST + "/api/Ledger/GetCOABySegmentNumber";
var APIUrlGetJEDetailFilter = HOST + "/api/Ledger/GetJEDetailFilter";
var APIUrlSaveAuditPost = HOST + "/api/Ledger/UpdateJournalEntryStatusById";

var APIUrlGetJEAuditPDF = HOST + "/api/ReportAPI/JEAuditReport";
var ArrSegment = [];
var ArrOptionalSegment = [];
var GlbCompnayArr = [];
var ArrTransCode = [];
var strTrCount = 0;
var strAuditCount = 0;
var strJournalEntryIdAudit = 0;
var strDate = '';

$(document).ready(function () {
    $(".datepicker").datepicker({
        onSelect: function (dateText, inst) {
            this.focus();
        }
    });

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
    
    FillCompany();
    $(".multiselect").multiselect();
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
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
    GetSegmentsDetails();
    //funGetClosePeriodDetail();
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
   // strHtml += '<th>3P</th>';
    strHtml += '<th>TaxCode</th>';

    strHtml += '<th style="width:70px;">Notes</th>';

    strHtml += '</tr>';

    $('#tblJEListTheadAudit').html(strHtml);
    funFilterCreate();
}

function ShowhideFilter() {

    //  alert($("#DvCriteria").css('display'));
    if ($("#DvCriteria").css('display') == 'none') {
        $('#DvCriteria').show();
        $('#DvTab').hide();
        funFilterCreate();
        funAddFilter();
      //  $('#btnSaveAuditPost').hide();
      
    }
    else {
       
        $('#DvCriteria').hide();
        $('#DvTab').show();
     //   $('#btnFilter').hide();
    }
}
function funFilterCreate()
{
    var strhtml = '';
    strhtml += '<tr><td>Company</td><td><select id="ddlFilterCompany" class="form-control"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Currency</td><td><select id="ddlFilterCurrency" class="form-control"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Period</td><td><select id="ddlFilterPeriod" class="form-control" ><option value="0">Select</option><option value="Current">Current</option><option value="Future">Future</option><option value="Both">Both</option></select></td></tr>';
    strhtml += '<tr><td>Document #	</td><td><input type="text" id="ddlFilterDocument" class="form-control"/></td></tr>';
    strhtml += '<tr><td>Trasaction Date	</td><td>From <input type="text" id="txtInvoiceNoS" class="datepicker form-control"> To <input class="datepicker form-control" type="text" id="txtInvoiceNoEnd"></td></tr>';
    strhtml += '<tr><td>Type</td><td><div style="width:27%;"><select id="ddlFilterType" multiple></div></td></tr>';
    for (var i = 0; i < ArrSegment.length; i++)
    {
        if (ArrSegment[i].SegmentName == 'LO')
        {
            strhtml += '<tr><td>Location</td><td><input class="SearchCodeFilter form-control" type="text" id="txt_' + ArrSegment[i].SegmentName + '" onfocus="javascript:funFilterCoa(\'' + ArrSegment[i].SegmentName + '\',' + i + ');"></tr>';
        }
        if (ArrSegment[i].SegmentName == 'EP')
        {
            strhtml += '<tr><td>Episode</td><td><input class="SearchCodeFilter form-control" type="text" id="txt_' + ArrSegment[i].SegmentName + '" onfocus="javascript:funFilterCoa(\'' + ArrSegment[i].SegmentName + '\',' + i + ');"></tr>';

        }
        if (ArrSegment[i].SegmentName == 'DT')
        {
            strhtml += '<tr><td>Detail</td><td><input class="SearchCodeFilter form-control" type="text" id="txt_' + ArrSegment[i].SegmentName + '" onfocus="javascript:funFilterCoa(\'' + ArrSegment[i].SegmentName + '\',' + i + ');"></tr>';

            // To <input type="text" class="SearchCodeFilter" id="txt_DT1" onfocus="javascript:funFilterCoa(' + i + ',' + '1' + ');">
        }
    }
    strhtml += '<tr><td>Set</td><td><input class="SearchOptionalCode form-control" type="text" id="txt_Set" onfocus = "javascript:GetOptional( 0,\'SET\',0);"></td></tr>';
    strhtml += '<tr><td>Vendor</td><td><div style="width:27%;"><select id="ddlFilterVendor" multiple class="form-control"></select><input type="hidden" id="hdnCOA"><input type="hidden" id="hdnCOA1"></div></td></tr>';
    $('#TblEditCriteriaTBody').html(strhtml);
    $(".datepicker").datepicker();
    funAddFilter();
}
function funAddFilter() {
    $('#ddlFilterCompany').html('');  $('#ddlFilterVendor').html('');
   
    for (var i = 0; i < GlbCompnayArr.length; i++) {
        $('#ddlFilterCompany').append('<option value=' + GlbCompnayArr[i].CompanyID + '>' + GlbCompnayArr[i].CompanyCode + '</option>');
    }
 
    $('#ddlFilterType').append('<option value="JE">JE</option><option value="AP">AP</option><option value="WT">WT</option>');
    $('#ddlFilterType').multiselect();

   
    funVendorFilter();
   
}

function ShowhideFilter() {

    //  alert($("#DvCriteria").css('display'));
    if ($("#DvCriteria").css('display') == 'none') {
        $('#DvCriteria').show();
        $('#DvTab').hide();
        $('#btnApply').show();
        $('#btnSaveAuditPost').hide();
    }

    else {
        $('#DvCriteria').hide();
        $('#DvTab').show();
        $('#btnApply').hide();
        // funAuditTabJEList();
        funAuditFilterNew();
    }
}

//function funCompanyChange() {
//    var strCoa = $('#ddlFilterCompany').find("option:selected").text();
//    $('#hdnCOA').val(strCoa);
//    $.ajax({
//        url: APIUrlCompanyClosePeriod + '?CompanyId=' + $('#ddlFilterCompany').val(),
//        cache: false,
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },
//        type: 'POST',

//        contentType: 'application/json; charset=utf-8',
//    })

//    .done(function (response)
//    { funCompanyChangeSuccess(response); })
//    .fail(function (error)
//    { ShowMSG(error); })
//}
//function funCompanyChangeSuccess(response) {
    
  
//    for (var i = 0; i < response.length; i++) {
//        $('#ddlFilterPeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
//    }
  
//}
function funVendorFilter()
{
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
     { funVendorFilterSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function funVendorFilterSucess(response)
{
    for (var i = 0; i < response.length; i++)
    {
        $('#ddlFilterVendor').append('<option value="' + response[i].VendorID + '">' + response[i].VendorName + '</option>');
    }
    $('#ddlFilterVendor').multiselect();  
}

function funFilterCoa(value, position)
{
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
function funFilterCoaSucess(response)
{
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

function funAuditTabJEList()
{
    $('#btnSaveAuditPost').show();
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
function funAuditTabJEListSucess(response)
{
    $('#tblJEList').dataTable().fnDestroy();
    $('#btnSaveAuditPost').show();
    var Tcount = response.length;
    var strHtml = '';
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++)
        {
            var CreditTotal = response[i].CreditTotal;
            CreditTotal = '$ ' + (CreditTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            var DebitTotal = response[i].DebitTotal;
            DebitTotal = '$ ' + (DebitTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            //CreditTotal = "'+response[i].CreditTotal+'", DebitTotal = "'+response[i].DebitTotal+'"
            strHtml += '<tr>';
            strHtml += '<td></td>';

            strHtml += '<td><input type="checkBox" onclick="javascript:funCheckPost(' + response[i].JournalEntryId + ');" class="clsJEList" id="Chk' + response[i].JournalEntryId + '" name="' + response[i].JournalEntryId + '" CreditTotal = "' + response[i].CreditTotal + '", DebitTotal = "' + response[i].DebitTotal + '" Source="' + response[i].Source + '" /></td>';
            strHtml += '<td><a href=# style="color: #337ab7;" onclick="javascript:funJEDetails(' + response[i].JournalEntryId + ');">' + response[i].TransactionNumber + '</a></td>';
            strHtml += '<td>' + response[i].CO + '</td>';
            strHtml += '<td>' + response[i].PostedDate + '</td>';
            strHtml += '<td>' + response[i].Source + '</td>';

            strHtml += '<td>' + CreditTotal + '</td>';
            strHtml += '<td>' + DebitTotal + '</td>';
            strHtml += '<td>' + response[i].TotalLines + '</td>';
            strHtml += '<td>' + response[i].DocumentNo + '</td>';
            strHtml += '<td>' + response[i].PeriodStatus + '</td>';
         

            strHtml += '</tr>';

        }
        $('#tblJEListTBody').html(strHtml);
    } else {
        strHtml += '<tr><td colspan="' + 9+ '" style="text-align: center;">No Record Found.. !!</td></tr>';
    }

    var table = $('#tblJEList').DataTable({
        "iDisplayLength": 15,
        responsive: {
            details: {
               
            }
        },
        columnDefs: [{

            className: 'control',
            orderable: false,
            targets: 0,

        }],
        order: [1, 'asc']
    });
    $('#tblJEList tfoot th').each(function ()
    {
        var title = $('#tblJEList thead th').eq($(this).index()).text();
        if (title == 'Transaction') {
            $(this).html('<input type="text" style="width:82px !important;" placeholder="' + title + '" />');
        }
   
        else if (title == 'CO') {
            $(this).html('<input type="text" style="width:60px !important;" placeholder="' + title + '" />');

        }
        else if (title == 'Transaction Date') {
            $(this).html('<input type="text" style="width:75px !important;" placeholder="' + title + '" />');

        }
      
        else  {
            $(this).html('<input type="text" style="width:60px !important;" placeholder="' + title + '" />');
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

    $('#tblJEList tfoot tr').insertAfter($('#tblJEList thead tr'));
}

function funCheckPost(value)
{
    var DAmount = $('#Chk' + value).attr('debittotal');
    var CAmount = $('#Chk' + value).attr('credittotal');
    var strSoruce = $('#Chk' + value).attr('Source');

    if (strSoruce == 'JE') {
        if (DAmount == CAmount) {
            //  $('#Chk' + value).prop('checked', true);
        }
        else {
            $('#Chk' + value).prop('checked', false);
        }
    }
    else {
        $('#Chk' + value).prop('checked', false);
    }
}
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
            var strSoruce = $('#' + strId).attr('Source');
            if (strSoruce == 'JE') {
                if (strCAmount == strDAmount) {
                    $('#' + strId).prop('checked', true);
                }
                else {
                    strcount++;
                }
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


function funJEDetails(values) {
    $('#btnSaveAuditPost').hide();
    $('#DvAuditListByJEDetail').show();

    $('#DvAuditList').hide();

    $('#btnFilter').hide();
    $('#btnDelete').show();
    $('#btnCancel').show();
    $('#btnSaveAudit').show();
    $('#btnSaveAuditSave').show();

    funGetJEntryDetail(values);
    funGetJEDetailList(values);

    strJournalEntryIdAudit = values;
}


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
         { SaveAuditPostSucess(response); })
         .fail(function (error)
         { ShowMSG(error); })
})
function SaveAuditPostSucess(response)
{
    ShowMsgBox('showMSG', 'Transaction is Posted  Successfully ..!!', '', '');
    // ShowhideFilter();
    funAuditFilterNew();
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
    $('#txtDescription').val(response[0].DocumentNo);
    $('#txtTransactionDateAudit').val(response[0].EntryDate);
    $('#txtDescriptionAudit').val(response[0].Description);
    $('#ddlTypeAudit').val(response[0].Source);
    
    if (response[0].Source == 'AP')
    {
        $('#btnSaveAudit').hide();
    }
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
    //strHtml += '<th>3P</th>';
    strHtml += '<th style="width:40px;">Tax Code</th>';
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
    var strNote = $('#txtDescription').val();
    $('#ddlTaxCode_' ).val('');
 //   $('#ddlTaxCode_').html('');
    var strTaxCode = '<option value="0">Select</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option>';
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
        strhtml += '<tr id="' + j + '" class="clsTr" name="' + j + '">';
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
                strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strDetail + '" coacode="' + strCOAPval + '" /></td>';
            }
            else if (ArrSegment[i].SegmentName == 'CO') {
                strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" coacode="' + strCOAPval + '" disabled /></td>';
            }
            else {
                strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + j + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + j + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" value="' + strSplit[i] + '" coacode="' + strCOAPval + '" /></td>';
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
        strhtml += '<td class="width40"><input type="text" class="  DebitClass detectTab " onchange="javascript:funDebitCredit(' + strTrCount + ',' + 0 + ');" id="txtDebit_' + j + '"  value="' + response[j].DebitAmount + '"/></td>';
        strhtml += '<td class="width40"><input type="text" class="  CreditClass detectTab " onchange="javascript:funDebitCredit(' + strTrCount + ',' + 1 + ');" id="txtCredit_' + j + '" value="' + response[j].CreditAmount + '"/></td>';
        strhtml += '<td id="Vendor_' + strTrCount + '" class="width75"><input type="text" class="SearchVendor  clsVendor " onfocus="javascript:GetVendoreByProdId(' + j + ');" onblur="javascript:funVendorBlur(' + j + ');" id="txtVendor_' + strTrCount + '" value="' + response[j].VendorName + '" name="' + response[j].VendorId + '"/></td>';
        //if (response[j].ThirdParty == true) {
        //    strhtml += '<td class="width40"><input type="checkBox" class="SearchCode cls3p " id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');" checked/></td>';
        //}
        //else {
        //    strhtml += '<td class="width40"><input type="checkBox" class="SearchCode cls3p " id="Chk3P_' + j + '" onchange="javascript:funCheckBox3P(' + j + ');"/></td>';

        //}
         strhtml += '<td><select class="clsTaxCode" id="ddlTaxCode_' + strTrCount + '" >' + strTaxCode + '</select></td>';
      //  strhtml += '<td><select id="ddlTaxCode_' + strTaxCode + '" value="' + response[j].TaxCode + '" ></select></td>';
     //   strhtml += '<td>' + response[j].TaxCode + '</td>';
         strhtml += '<td class="width95"><input type="text" class=" clsNotes" id="txtNotes_' + j + '" onfocus="javascript:funNoteExplode(' + j + ');" onblur="javascript:funFocusout(' + j + ');" value="' + response[j].Note + '" title="' + response[j].Note + '"/><input type="hidden" class="clsJEId" value="' + response[j].JournalEntryDetailId + '"/><input type="hidden" class="clsCOACode"  id="hdnCode_' + j + '" value="' + response[j].COAString + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + j + '" value="' + response[j].COAId + '"></td>';
       //  strhtml += '<td class="width95" ><input type="text"  class="  clsNotes detectTab" id="txtNotes_' + strTrCount + '" onfocus="javascript:funNoteExplode(' + strTrCount + ');" onblur="javascript:funFocusout(' + strTrCount + ');" value="' + response[j].Note + '"/><input type="hidden" class="clsCOACode" id="hdnCode_' + strTrCount + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + strTrCount + '"  ></td>';
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
            $('#ddlTaxCode_' + i).val(response[0].TaxCode);
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
//==========
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

function funAuditListJEDetailNewRow() {

    var strTaxCode = '<option value="0">Select</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option>';
    var strCompnayId = $('#ddlCompanyAudit').find("option:selected").text();
    strAuditCount++;
    var strhtml = '';
    strhtml += '<tr  id="' + strAuditCount + '" class="clsTr"  name="' + 0 + '">';
    strhtml += '<td style="width:30px;"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript:funJEDetailDetail(' + strAuditCount + ',' + 0 + ');"></i></span></td>';

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') {
            strhtml += '<td class="width100"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strAuditCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  /></td>';
        }
        else if (ArrSegment[i].SegmentName == 'CO') {
            strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strAuditCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '" disabled value="' + strCompnayId + '" coaCode="' + strCompnayId + '" /></td>';
        }
        else {
            strhtml += '<td class="width40"><input type="text" class="SearchCode  detectTab" onblur="javascript:GetSegmentValue(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" onfocus="javascript:funSegment(' + strAuditCount + ',\'' + ArrSegment[i].SegmentName + '\',' + i + ');" id="txt_' + strAuditCount + '_' + i + '" name="' + ArrSegment[i].SegmentName + '"  /></td>';

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
   // strhtml += '<td class="width40"><input type="checkBox" class="SearchCode cls3p  " id="Chk3P_' + strAuditCount + '" onchange="javascript:funCheckBox3P(' + strAuditCount + ');"/></td>';
    strhtml += '<td><select class="clsTaxCode" id="ddlTaxCode_' + strAuditCount + '">' + strTaxCode + '</select></td>';
    strhtml += '<td class="width95"><input type="text" class=" clsNotes" id="txtNotes_' + strAuditCount + '" onfocus="javascript:funNoteExplode(' + strAuditCount + ');" onblur="javascript:funFocusout(' + strAuditCount + ');"/><input type="hidden" class="clsJEId" /><input type="hidden" id="hdnCode_' + strAuditCount + '" class="clsCOACode"/><input type="hidden" class="clsCOAId"  id="hdnCOAId_' + strAuditCount + '"></td>';

    strhtml += '</tr>';

    $('#tblJEListTBodyAudit').append(strhtml);
}


function funJEDetailDetail(value, Mode) {

    if (Mode == 0) {
        $('#' + value).remove();
    }
    else {

        $('#DeletePopup').show();
        $('#btndeleteAudit').focus();
        $('#fade').show();
        $('#hdnDeleteRowAudit').val(value);
    }
}
function funDeleteRecordAuditTab() {
    $('#funDeleteRecordAuditTab').focus();

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
  { funSegmentSucess(response, values); })
  .fail(function (error)
  { console.log(error); })
}
function funSegmentSucess(response, values ) {

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

//===============================================Vendor
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
                //$(this).val('');

                //$(this).removeAttr('name');
                //$(this).val('');
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
                if (GlbVendorList[i].DefaultDropdown == null) {
                    $('#ddlTaxCode_' + value).val(0);
                }
                else {
                    $('#ddlTaxCode_' + value).val(GlbVendorList[i].DefaultDropdown);
                }

                //  ddlTaxCode_
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

//================================================= 3 Party Check
//function funCheckBox3P(value) {
//    if ($('#Chk3P_' + value).prop('checked') == true) {
//        $('#txtVendor_' + value).remove();
//        $('#Vendor_' + value).html('<input type="text" class="width40 clsVendor " onfocus="javascript:GetVendoreByProdId(' + value + ');" id="txtVendor_' + value + '" autocomplete="false">');
//    }
//    else {
//        $('#txtVendor_' + value).remove();
//        $('#Vendor_' + value).html('<input type="text" class="width40 clsVendor SearchVendor ui-autocomplete-input " onfocus="javascript:GetVendoreByProdId(' + value + ');" id="txtVendor_' + value + '" autocomplete="off">');
//    }

//}

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
        funAuditListJEDetailNewRow();
        //if (strJECount == 0) {
        //    funAuditListJEDetailNewRow();
        //   // strAuditCount++;
        //}
        //else {
        //    funAuditListJEDetailNewRow();
        //    //strAuditCount++;
        //}
    }

    if (event.altKey === true && key === 83) {
        if ($('#DvAuditListByJEDetail').css('display') == 'block') {
            CheckValidationAuditSave();
        }

    }


});

//=============================================  Note + TAB
//$('#tblJEListTBodyAudit').delegate('.clsNotes', 'keydown', function (event) {
//    var key = event.which || event.keyCode;
//    if (event.which === 9) {
//        var $this = $(this)
//        funAuditListJEDetailNewRow();
//        var strId = $this.attr('id');
//        var strSplit = strId.split('_');
//        funSetPreviousRecord(strSplit[1]);


//    }
//});
$('#tblJEListTBodyAudit').delegate('.clsNotes', 'keydown', function (event) {
    var strRowcount = $('#tblJEListTBodyAudit tr:last').attr('id');
  //  var strRowcount = $("#tblJEListTBodyAudit").find("tr").last();
   // alert(strRowcount);
    var key = event.which || event.keyCode;
    if (event.which === 9) {
        if (event.shiftKey === true && key === 9) {

        }
        else {
            var $this = $(this)
            var strId = $this.attr('id');
            var strSplit = strId.split('_');
           // alert(strSplit);
           if (strRowcount == strSplit[1]) {
             //   alert('if checked ');
                funAuditListJEDetailNewRow();
                funSetPreviousRecord(strSplit[1]);
           }
        }
    }
});

function funSetPreviousRecord(value) {
    strTrCount = $('#tblJEListTBodyAudit tr').length;
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
$('#tblJEListTBodyAudit').delegate('.clsNotes', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtNotes_' + stval).length > 0) {
            $('#txtNotes_' + stval).focus();
        }
        else {
            //alert('No roew');
        }

    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtNotes_' + stval).length > 0) {
            $('#txtNotes_' + stval).focus();
        }
        else {
            //alert('No roew');
        }
    }

})

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

//============================= SAve 
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

   
    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: strJournalEntryIdAudit
        //  TransactionNumber:
               , Source: $('#ddlTypeAudit').val()
               , Description: $('#txtDescriptionAudit').val()
               , EntryDate: $('#txtTransactionDateAudit').val()
               , DebitTotal: strDebitAmount
               , CreditTotal: strCreditAmount
               , TotalLines: ''
               , ImbalanceAmount: strImAmount
               , AuditStatus: value
               , PostedDate: $('#txtTransactionDateAudit').val()
               , ReferenceNumber: ''
               , BatchNumber: BatchManager.BatchNumber
               , ProdId: localStorage.ProdId
               , createdBy: localStorage.UserId
               , ClosePeriod: $('#ddlPeriodAudit').val()
               , CompanyId: $('#ddlCompanyAudit').val()
        , DocumentNo: $('#txtDescription').val()
    }
    ////////////////////////////////////////////////////////////////////////// JE End
    var JEDetailId = $('.clsJEId');
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
    //    var FThirdParty = ThirdParty[i].checked;
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
                         //   , ThirdParty: FThirdParty
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
    formmodified = 0;
    if (value == 'Posted') {
        ShowMsgBox('showMSG', 'Transaction is Posted  Successfully ..!!', '', '');

    }
    else {
        ShowMsgBox('showMSG', 'Transaction is Saved Successfully ..!!', '', '');

    }

    // $("#myTabs li:eq(3) a").tab('show');
  //  funJEDetails(values);
    $('#DvAuditList').show();
    $('#DvAuditListByJEDetail').hide();
   // funAuditTabJEList();
    funAuditFilterNew();
    $('#btnDelete').hide();
    $('#btnCancel').hide();
    $('#btnSaveAudit').hide();
    $('#btnSaveAuditSave').hide();
    $('#btnFilter').show();
}


//=================================================== Filter
function funAuditFilterNew() {
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
    var strFinalVendor = '';
    if (strVendor == null) {
        strVendor = '';
    }
    else {
        for (var i = 0; i < strVendor.length; i++) {
            strFinalVendor = strFinalVendor + ',' + strVendor[i]
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
    var obj = {
        ProdId: localStorage.ProdId,
        ss1: $('#ddlFilterCompany').find("option:selected").text(),
        ss2: strss2,
        ss3: strss3,
        ss4: strss4,
        ss5: strss5,
        START: strStartDate,
        End: strEndDate,
        VendorIds: strFinalVendor,
        CompanyId: $('#ddlFilterCompany').val(),
        Currency: $('#ddlFilterCurrency').val(),
        Period: $('#ddlFilterPeriod').val(),
        Source: StrFinalType,
        SetId: $('#txt_Set').attr('accountid'),
        Type: 'Audit',
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

  .done(function (response)
  { funAuditTabJEListSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })


}

function funCancelJE() {
    $('#CancelAuditPopup').show();
    $('#hrfAuditCancleYes').focus();
    $('#fade').show();
    
}
function funCancelJEAudit() {
    funAuditFilterNew();
    $('#DvAuditList').show();
    $('#DvAuditListByJEDetail').hide();

    $('#CancelAuditPopup').hide();
    $('#fade').hide();

    $('#btnDelete').hide();
    $('#btnCancel').hide();
    $('#btnSaveAudit').hide();
    $('#btnSaveAuditSave').hide();
}

//===================================//
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

//============Alt+S====================//





