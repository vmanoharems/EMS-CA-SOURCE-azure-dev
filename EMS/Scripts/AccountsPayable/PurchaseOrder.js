var APIUrlFillPO = HOST + "/api/POInvoice/GetAllPurchaseOrder";
var APIUrlFillPOLines = HOST + "/api/POInvoice/GetPOLines";
var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlfunClosePO = HOST + "/api/POInvoice/UpdatePOStatusClose";

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillBankDetails = HOST + "/api/POInvoice/GetBankInfoByCompanyId";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";

var strHeadDetailRow = '';
var strDetailRow = '';
var strTrCount = 0;
var ArrSegment = [];
var ArrTransCode = [];
var PurchaseOID = 0;
var ArrOptionalSegment = [];

var CheckBankID = [];
var GlbCompany = [];
var showpg = 0;
var PageCnt;

$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});

$(function () {
    $('#UlAccountPayable li').removeClass('active');
    $('#LiAPPO').addClass('active');
    FillPO();
    funVendorFilter();
});


function FillPO() {
    var Obj = {
        PODate: '01-01-1990',
        PONumber: '',
        POCO: '',
        POstatus: '',
        POVendorId: '',
        POThirdPartyVendor: '',
        POBatchNumber: '',
        Balance: '',
        ProdID: localStorage.ProdId
    }

    // Don't cache PO list
    //AtlasCache.CacheORajax(
    //    {
    //        'URL': APIUrlFillPO + '?ProdId=' + localStorage.ProdId
    //        , 'doneFunction': FillPOSucess
    //        , 'objFunctionParameters': {
    //            callParameters: JSON.stringify(Obj)
    //        }
    //    }
    //);
    //return;

    $.ajax({
        url: APIUrlFillPO + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(Obj),
    })
    .done(function (response) {
        FillPOSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function ShowMSG(error) {
    console.log(error);
}

function FillPOSucess(response) {
    $('#TblPO').dataTable().fnDestroy();
    $('#tbodyPO').html('');
    var str = '';

    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            var TParty = '';
            var VName = '';
            var TP = response[i].ThirdParty;
            if (TP == 0) {
                TParty = '';
                VName = response[i].VendorName;
            }
            else {
                TParty = response[i].VendorName;
                VName = '';
            }

            //===================================
            str += '<tr>';
            str += '<td></td>';
            str += '<td>' + response[i].PODate + '</td>';
            str += '<td><a href="javascript:editPO(' + response[i].POID + ');" style="color: #337ab7;">' + response[i].PONumber + '</a></td>';
            str += '<td>' + response[i].COCode + '</td>';
            str += '<td>' + response[i].status + '</td>';
            str += '<td>' + response[i].tblVendorName + '</td>';
            if (response[i].status == 'Closed') {
                str += '<td><input type="checkBox" id="chk_' + response[i].POID + '" onclick="javascript:funCloseOpen(' + response[i].POID + ');" checked/></td>';
            }
            else {
                str += '<td><input type="checkBox" id="chk_' + response[i].POID + '" onclick="javascript:funCloseOpen(' + response[i].POID + ');"/></td>';
            }
            var strAmount = '$ ' + parseFloat(response[i].OriginalAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            str += '<td>' + strAmount + '</td>';
            var strBalance = '$ ' + parseFloat(response[i].BalanceAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            str += '<td>' + strBalance + '</td>';
            str += '<td>' + response[i].PeriodStatus + '</td>';
            str += '<td>' + response[i].CurrencyDocument + '</td>';
            str += '</tr>';
        }
        $('#tbodyPO').html(str);
    } else {
        str += '<tr><td style="text-align:center;" colspan=8>No Purchase Order Found.</td></tr>';
        $('#tbodyPO').append(str);
    }
   
    var PgNo = (PageCnt / 28);
    if (parseInt(PageCnt) <= 500) {
    } else if (parseInt(PageCnt) <= 800) {
        var PgNo = (PageCnt / 38);
    }

    var substr = PgNo.toString().split('.');
     showpg = parseInt(substr[0]);
    
    var table = $('#TblPO').DataTable({
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
            targets: 0,
        }],
        order: [1, 'asc']
    });
    $(".datepicker").datepicker();   

    $('#TblPO tfoot th').each(function () {
        var title = $('#TblPO thead th').eq($(this).index()).text();
       
        if (title == 'Status') {
            $(this).html('<select><option value="">All</option><option value="Open">Open</option><option value="Close">Close</option><option value="Partial">Partial</option></select>');
        } else {
            $(this).html('<input type="text" style="width:100%;" placeholder=" ' + title + '" />');
        }
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

    $('#TblPO tfoot tr').insertAfter($('#TblPO thead tr'));

    $('#TblPO').parent().css('overflow', 'scroll');
    $('#TblPO').parent().css('max-height', ($(window).height() - 180) + 'px');
    $('#TblPO').parent().css('min-height', ($(window).height() - 180) + 'px');
    $('#TblPO').parent().css('height', ($(window).height() - 180) + 'px');
   // $('#TblPO_wrapper').attr('style', 'height:' + PageCnt + 'px;');
}

function FillDetail(POID) {
    PurchaseOID = POID;
    GetSegmentsDetails();
    showDiv('transactionsPopup');
}

function editPO(PONumber) {
    localStorage.EditPONo = PONumber;
    window.location.href = 'EditPO';
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

    .done(function (response)
    { GetSegmentListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetSegmentListSucess(response) {
    ArrSegment = [];
    ArrOptionalSegment = [];
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
    ArrTransCode = [];
    $('#tblManualEntryThead').html('');
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th>Date</th>';

    strHtml += '<th>3rd Party Vendor</th>';
    strHtml += '<th>Transaction</th>';


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

    strHtml += '<th>Amount</th>';
    strHtml += '<th>Description</th>';
    strHtml += '<th>Status</th>';
    strHtml += '</tr>';

    $('#tblManualEntryThead').html(strHtml);
    GetPOLines();

}

function GetPOLines() {

    $.ajax({
        url: APIUrlFillPOLines + '?POID=' + PurchaseOID + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetPOLinesSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetPOLinesSucess(response) {
    var strHtml = '';
    if (response.length > 0) {

        for (var i = 0; i < response.length; i++) {

            strHtml += '<tr>';
            strHtml += '<td>' + response[i].CreatedDate + '</td>';
            strHtml += '<td></td>';
            strHtml += '<td>-</td>';


            var straa = response[i].COAString.split('|');
            var TrasnValue = '';
            for (var j = 0; j < straa.length; j++) {

                var SegVal = straa[j];
                if (SegVal.indexOf('>') === -1) {
                    strHtml += '<td>' + SegVal + '</td>';
                }
                else {
                    var det = SegVal.split('>');
                    strHtml += '<td>' + det[1] + '</td>';
                }
            }

            strHtml += '<td>' + response[i].SetCode + '</td>';
            strHtml += '<td>' + response[i].SeriesCode + '</td>';



            var trastr = response[i].TransStr.split(',');
            //for (var k = 0; k < trastr.length; k++) {
            //    var TraVal = trastr[k];
            //    var trastr1 = TraVal.split(':');
            //    strHtml += '<td>' + trastr1[1] + '</td>';
            //}
            for (var k = 0; k < ArrTransCode.length; k++) {
                strHtml += '<td id="txt_' + ArrTransCode[k].TransCode + '_' + i + '"></td>';

            }
            var strAmount = '$ ' + (response[i].Amount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            strHtml += '<td>' + strAmount + '</td>';
            strHtml += '<td>' + response[i].LineDescription + '</td>';
            strHtml += '<td>' + response[i].POLinestatus + '</td>';
            strHtml += '</tr>';
        }
    }
    else {
        var strHtml = '';
        strHtml += '<tr>';
        strHtml += '<td>There are no transactions associated with this PO</td>';
        strHtml += '</tr>';
        $('#tblManualEntryThead').html('<tr><th>Purchase Line </th></tr>');
    }

    $('#tblManualEntryTBody').html(strHtml);

    for (var i = 0; i < response.length; i++) {
        var TransactionvalueString = response[i].TransStr;
        //   Set:01:1,FF:01:3,T1:02:6,T2:02:8
        var TvstringSplit = TransactionvalueString.split(',');

        for (var j = 0; j < TvstringSplit.length; j++) {
            var strTvs = TvstringSplit[j].split(':');
            $('#txt_' + strTvs[0] + '_' + i).html(strTvs[1]);
            // $('#txt_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);
        }
    }
}

$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        window.location.replace(HOST + "/AccountPayable/AddPurchaseOrder");
    }


});

//===========
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


            $('#TrVendor').val(ui.item.label);
            $('#TrVendor').attr('vendorId', ui.item.value);


            return false;
        },
        select: function (event, ui) {

            $('#TrVendor').val(ui.item.label);
            $('#TrVendor').attr('vendorId', ui.item.value);

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $('#TrVendor').val('');
                $('#TrVendor').removeAttr('vendorId');
            }
        }
    })

}

function funFilter() {

    //var str = '';
    //str += '<tr style="background-color: gray;" class="TrHide" id="TrFilter">';
    //str += '<td></td>';
    //str += '<td><input type="text" id="TrPODate" class="datepicker" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrPONo" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrPOCO" style="width: 100%;"/></td>';
    //str += '<td><select id="TrStatus" style="height: 100% !important;"><option value="" selected>Select</option> <option value="Open">Open</option><option value="Close">Close</option><option value="Partial">Partial</option> </select></td>';
    ////<input type="text" id="TrStatus" style="width: 100%;"/>
    //str += '<td><input type="text" id="TrVendor" style="width: 100%;" class="VendorCode" onfocus="javascript:FillVendor();"/></td>';
    //str += '<td><input type="text" id="TrThirdPartyVendor" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrPOBatchNumber" style="width: 100%;"/></td>';
    //str += '<td><input type="text" id="TrBalance" style="width: 100%;"/></td>';
    //str += '<td><span class="GreenDot" style="display:inline;" onclick="javascript:funSearchFilter();"></span></td></td>';
    ////<span class="redDot" style="display:inline;margin-top: 3px;margin-left: 1px;"></span>
    //str += '</tr>';

    if ($('#TrFilter').hasClass('TrHide') == true) {
        $('#TrFilter').removeClass('TrHide');
        $('#TrFilter').addClass('TrShow');
      
    }
    else {
        $('#TrFilter').removeClass('TrShow');
        $('#TrFilter').addClass('TrHide');
        
    }
}
function funSearchFilter() {

    var PODate = $('#TrPODate').val();
    if(PODate=='')
    {
        PODate='01-01-1900';
    }
    var PONumber = $('#TrPONo').val();
    var POCO = $('#TrPOCO').val();
    var POstatus = $('#TrStatus').val();
    var POVendorId = $('#TrVendor').attr('vendorid');
    var POThirdPartyVendor = $('#TrThirdPartyVendor').val();
    var POBatchNumber = $('#TrPOBatchNumber').val();
    var Balance = $('#TrBalance').val();
   
    var Obj = {
        PODate :PODate,
        PONumber:PONumber,
        POCO:POCO,
        POstatus :POstatus,
        POVendorId :POVendorId,
        POThirdPartyVendor :POThirdPartyVendor,
        POBatchNumber :POBatchNumber,
        Balance :Balance,
        ProdID: localStorage.ProdId
    }
    $.ajax({
        url: APIUrlFillPO + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(Obj),
    })

   .done(function (response)
   { FillPOSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })

}


//=========================

function funCloseOpen(value) {
    if ($('#chk_' + value).prop('checked') == true) {
        $('#ClosePopupPO').show();
        $('#hdnOpenClose').val(value);
    }
    else {
        $('#chk_' + value).prop('checked', true);
    }
}

function funClosePO(value)
{

    if (value == 'Yes') {
        funClosePOConfirm();
    }
    else {
        var strPOId = $('#hdnOpenClose').val();
        $('#chk_' + strPOId).prop('checked', false);
        $('#ClosePopupPO').hide();
    }

}

function funClosePOConfirm()
{
    var strstatus = '';
    var strPOId = $('#hdnOpenClose').val();
    if ($('#chk_' + strPOId).prop('checked') == true) {
        strstatus = 'Closed';
    }
   


    $.ajax({
        url: APIUrlfunClosePO + '?POId=' + strPOId + '&prodId=' + localStorage.ProdId + '&status=' + strstatus,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response)
 { funClosePOSucess(response); })
 .fail(function (error)
 { ShowMSG(error); })
}
function funClosePOSucess(response)
{

    location.reload(true);
}

//========================

//========================================================= Segment Code

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

    GlbCompany = response;

    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CompanyID,
            label: m.CompanyCode,

        };
    });
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnCompany").val(ui.item.value);
            $('#txtCompany').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnCompany").val(ui.item.value);
            $('#txtCompany').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
               
            }
        }
    })
   
}
function funCompanyblur()
{
   // GlbCompany
}

//======================================================== Bank 
$('#txtBankName123').blur(function () {
    $.ajax({
        url: APIUrlFillBankDetails + '?CompanyId=' + $('#hdnCompany').val() + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })
      .done(function (response)
      { FillBankDetailsSucess(response); })
      .fail(function (error) {
          ShowMSG(error);
      })
});
function FillBankDetailsSucess(response) {
    CheckBankID = [];
    CheckBankID = response;
    if (response.length == 1) {
        $("#hdnBank").val(response[0].BankId);
        $('#txtBankName').val(response[0].Bankname);
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
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBank").val(ui.item.value);
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
             
            }
        }
    })
}
function funBankCheck()
{

}

function funVendorFilter() {
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
function funVendorFilterSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlVendor').append('<option value="' + response[i].VendorID + '">' + response[i].VendorName + '</option>');
    }
    $('#ddlVendor').multiselect();
}