// Posted Collection requirements
var REConfig = new AtlasConfig();
var G_BASE_CURRENCY = 'USD';
var G_LedgerCollection = new LedgerCollection({
    divid: 'SaveInvoiceSuccess'
    , reportapi: '/api/ReportAPI/LedgerInQuiryTransaction'
    , callingdocumenttitle: 'Ledger > Audit'
    , transactiontype: 'JE'
    , reporttitle: 'Posting Report (Journal Entry)'
    , legacycallback: SaveAuditPostSucess
});
// Posted Collection

var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlCompanyClosePeriod = HOST + "/api/POInvoice/GetClosePeriodFortransaction";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlAuditTabJEList = HOST + "/api/Ledger/GetJournalEntryList";

var APIUrlDeleteRecordAudit = HOST + "/api/Ledger/DeleteJournalEntryDetailById";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlSaveJE = HOST + "/api/Ledger/SaveJE";

var APIUrlGetCOABySegment = HOST + "/api/Ledger/GetCOABySegmentNumber";
var APIUrlGetJEDetailFilter = HOST + "/api/Ledger/GetJEDetailFilter";
var APIUrl12GetCOA123 = HOST + "/api/Ledger/GetCOABySegmentPosition1";
var APIUrlfunDeleteJEAudit = HOST + "/api/Ledger/DeleteJEandJEDetail";

var APIUrlSaveAuditPost = HOST + "/api/Ledger/UpdateJournalEntryStatusById";
//var APIUrlSaveAuditPostCollection = "/api/Ledger/PostCollection";

var ArrSegment = [];
var ArrOptionalSegment = [];
var GlbCompnayArr = [];
var ArrTransCode = [];
var strTrCount = 0;
var strAuditCount = 0;
var strJournalEntryIdAudit = 0;
var strDate = '';
var strval = '';
var strDeleteLineJE = '';
var oJEAuditId = [];
var iPrevNextIndx = 0;

var GlbTransList = [];

var strCompany;

var DT_tblJEList;
var DTCount = 0;

var objJE = {
    tblID: 'tblJEListAudit'
    , divtblID: 'DvAuditListByJEDetail'
}

$(document).ready(function () {
    GetTaxCodeList();
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

    oJEAuditId = JSON.parse(localStorage.getItem("JEAudit"));
    FillCompany();
    $(".multiselect").multiselect();
    funAuditTabJEList();

    AtlasPaste.Config.StaticColumns(["DEBIT", "CREDIT", "VENDOR", "TAXCODE", "DESCRIPTION"]);
    AtlasPaste.Config.PastetoTable(funTrCreate);
    AtlasPaste.Config.DestinationTable('tblJEListTBodyAudit');
    AtlasPaste.Config.DisplayOffset({ top: 140, left: -100 });
    AtlasPaste.Config.Clearcallback(PasteClear);

    AtlasCache.CacheORajax({
        'URL': AtlasCache.APIURLs.AtlasConfig_TransactionCodes
        , 'doneFunction': function (response) { TcodesFound = true; }
        , bustcache: true
        , callParameters: { callPayload: JSON.stringify({ ProdID: localStorage.ProdId }) }
        , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        , 'cachebyname': 'Config.TransactionCodes'
    });

    AtlasCache.CacheORajax({
        'URL': `${AtlasCache.APIURLs.AtlasCache_VendorList}?SortBy=All&ProdID=${localStorage.ProdId}`
        , 'doneFunction': function (response) { TcodesFound = true; }
        , bustcache: true
        , callParameters: { callPayload: JSON.stringify({ ProdID: localStorage.ProdId }) }
        , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        , 'cachebyname': 'Vendor List'
    });

    AtlasJE.Config.BodyTableth('tblJEListTheadAudit');
    AtlasJE.Config.BodyTable('tblJEListAudit');
    AtlasJE.Config.BodyTabletbody('tblJEListTBodyAudit');
    AtlasJE.Config.BodyTablediv('DvAuditListByJEDetail');
    AtlasJE.Config.NewLine(funTrCreate, SetFocusAfterAddNew);

    // Posted Collection requirement
    G_BuildSegmentOrder();
    G_AtlasConfig.ConfigGet('Settings.Currencies.Rates', (configRates) => {
        let RatesJSON = JSON.parse(configRates.ConfigJSON);
        G_BASE_CURRENCY = RatesJSON.BASE;
    })
    // Posted Collection
})

function PasteClear() {
    let elist = $(`#${AtlasJE.Config.BodyTabletbody()}`).find('tr').filter(function(e,i) { return $(i).data('action') === 'existing'});
    elist.each(function(e) {
        let JEID = elist[e].id
        funDeleteRecordAuditTab(JEID);
    });

    // Now clear anything that was added during an edit
    $(`#${AtlasJE.Config.BodyTabletbody()}`).empty();
}

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
    GetSegmentsDetails();
}

//================================================== Close Period
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
        ShowMSG(error);
    })
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
    strHtml += '<th></th>';
    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'Detail') {
            strHtml += '<th>' + ArrSegment[i].SegmentName + '</th>';
        } else {
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
    strHtml += '<th>TaxCode</th>';
    strHtml += '<th style="width:70px;">Notes</th>';

    strHtml += '</tr>';

    $('#tblJEListTheadAudit').html(strHtml);
    funFilterCreate();
}

function ShowhideFilter() {
    if ($("#DvCriteria").css('display') == 'none') {
        $('#DvCriteria').show();
        $('#DvTab').hide();
        funFilterCreate();
        funAddFilter();
    } else {
        $('#DvCriteria').hide();
        $('#DvTab').show();
    }
}

function funFilterCreate() {
    var strhtml = '';
    strhtml += '<tr><td>Company</td><td><select id="ddlFilterCompany" class="form-control"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Currency</td><td><select id="ddlFilterCurrency" class="form-control"><option value="USD">USD</option></select></td></tr>';
    strhtml += '<tr><td>Period</td><td><select id="ddlFilterPeriod" class="form-control" ><option value="0">Select</option><option value="Current">Current</option><option value="Future">Future</option><option value="Both">Both</option></select></td></tr>';
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
        }
    }
    strhtml += '<tr><td>Set</td><td><input class="SearchOptionalCode form-control" type="text" id="txt_Set" onfocus = "javascript:GetOptional( 0,\'SET\',0);"></td></tr>';
    strhtml += '<tr><td>Vendor</td><td><div style="width:27%;"><select id="ddlFilterVendor" multiple class="form-control"></select><input type="hidden" id="hdnCOA"><input type="hidden" id="hdnCOA1"></div></td></tr>';
    $('#TblEditCriteriaTBody').html(strhtml);
    $(".datepicker").datepicker();
    funAddFilter();
}

function funAddFilter() {
    $('#ddlFilterCompany').html(''); $('#ddlFilterVendor').html('');

    for (var i = 0; i < GlbCompnayArr.length; i++) {
        $('#ddlFilterCompany').append('<option value=' + GlbCompnayArr[i].CompanyID + '>' + GlbCompnayArr[i].CompanyCode + '</option>');
    }

    $('#ddlFilterType').append('<option value="JE">JE</option><option value="AP">AP</option><option value="WT">WT</option>');
    $('#ddlFilterType').multiselect();

}

function ShowhideFilter() {
    if ($("#DvCriteria").css('display') == 'none') {
        $('#DvCriteria').show();
        $('#DvTab').hide();
        $('#btnApply').show();
        $('#btnSaveAuditPost').hide();
    } else {
        $('#DvCriteria').hide();
        $('#DvTab').show();
        $('#btnApply').hide();
        // funAuditTabJEList();
        funAuditFilterNew();
    }
}

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
        ShowMSG(error);
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

function funAuditTabJEList() {
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
    .done(function (response) {
        funAuditTabJEListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funAuditTabJEListSucess(response) {
    if (DTCount !== 0) {
        $($('#tblJEList thead tr')[1]).appendTo($('#tblJEList tfoot'))
        DT_tblJEList.destroy();
        //$('#tblJEList').dataTable().fnDestroy();
    }

    $('#btnSaveAuditPost').show();
    var Tcount = response.length;
    var strHtml = '';
    if (Tcount > 0) {
        for (var i = 0; i < Tcount; i++) {
            var CreditTotal = response[i].CreditTotal;
            CreditTotal = '$ ' + parseFloat(CreditTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); //(CreditTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            var DebitTotal = response[i].DebitTotal;
            DebitTotal = '$ ' + parseFloat(DebitTotal + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); //(DebitTotal + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            if (response[i].CreditTotal != response[i].DebitTotal) {
                strHtml += '<tr style="background-color:#FFFAE3;">'
            } else { strHtml += '<tr>' }

            //strHtml += '<td></td>';
            strHtml += '<td><input type="checkBox" onclick="javascript:funCheckPost(' + response[i].JournalEntryId + ');" class="clsJEList" id="Chk' + response[i].JournalEntryId + '" name="' + response[i].JournalEntryId + '" CreditTotal = "' + response[i].CreditTotal + '", DebitTotal = "' + response[i].DebitTotal + '" Source="' + response[i].Source + '" /></td>';
            strHtml += '<td onclick="javascript: setCurrentId(' + response[i].JournalEntryId + ');funJEDetails(' + response[i].JournalEntryId + ');"><a href=# style="color: #337ab7;">' + response[i].TransactionNumber + '</a></td>';
            strHtml += '<td>' + response[i].CO + '</td>';
            strHtml += '<td>' + response[i].PostedDate + '</td>';
            strHtml += '<td>' + response[i].Source + '</td>';
            strHtml += '<td>' + CreditTotal + '</td>';
            strHtml += '<td>' + DebitTotal + '</td>';
            strHtml += '<td>' + response[i].TotalLines + '</td>';
            strHtml += '<td>' + response[i].DocumentNo + '</td>';
            strHtml += '<td>' + response[i].PeriodStatus + '</td>';
            strHtml += '<td>' + response[i].CurrencyTransaction + '</td>';
            strHtml += '</tr>';
        }
    } else {
        strHtml += '<tr><td colspan="' + 9 + '" style="text-align: center;">No Journal Entry Records Found.</td></tr>';
    }
    $('#tblJEListTBody').html(strHtml);
    var oSearchVal = [];
    DT_tblJEList = $('#tblJEList').DataTable({
        paging: false,
        //responsive: {
        //    details: {
        //    }
        //},
        //columnDefs: [{
        //    className: 'control',
        //    orderable: false,
        //    targets: 0
        //}],
        stateSave: true,
        stateSaveCallback: function (settings, data) {
            localStorage.setItem('DataTables_JEAudit' + settings.sInstance, JSON.stringify(data)); GetJEAudit();
        },
        stateLoadCallback: function (settings) {
            if (JSON.parse(localStorage.getItem('DataTables_JEAudit' + settings.sInstance)) != null) {
                var searchval = JSON.parse(localStorage.getItem('DataTables_JEAudit' + settings.sInstance)).columns;
                $.each(searchval, function (index, value) {
                    oSearchVal.push(value.search.search);
                });
            }
            return JSON.parse(localStorage.getItem('DataTables_JEAudit' + settings.sInstance))
        },
    })
    .on('click', 'th', function () {
        GetJEAudit();
    });
    if (DTCount === 0) {
        $('#tblJEList tfoot th').each(function () {
            var title = $('#tblJEList thead th').eq($(this).index()).text();
            var val = ""; if (oSearchVal[$(this).index()] != undefined) { val = oSearchVal[$(this).index()]; }
            if (title == 'Transaction') {
                $(this).html('<input type="text" style="width:82px !important;" placeholder="' + title + '" value="' + val + '"/>');
            } else if (title == 'CO') {
                $(this).html('<input type="text" style="width:60px !important;" placeholder="' + title + '" value="' + val + '"/>');
            } else if (title == 'Transaction Date') {
                $(this).html('<input type="text" style="width:75px !important;" placeholder="' + title + '" value="' + val + '"/>');
            } else {
                $(this).html('<input type="text" style="width:60px !important;" placeholder="' + title + '" value="' + val + '"/>');
            }
        });

        DT_tblJEList.columns().eq(0).each(function (colIdx) {
            $('input', DT_tblJEList.column(colIdx).footer()).on('keyup change', function () {
                if (this.type === 'checkbox') return;
                DT_tblJEList
                    .column(colIdx)
                    .search(this.value)
                    .draw();
            });
            //$('select', table.column(colIdx).footer()).on('keyup change', function () {
            //    table
            //        .column(colIdx)
            //        .search(this.value)
            //        .draw();
            //});
        });

    }
    $('#tblJEList tfoot tr').insertAfter($('#tblJEList thead tr'));
    DTCount++;

    GetJEAudit();
}

function funCheckPost(value) {
    var DAmount = $('#Chk' + value).attr('debittotal');
    var CAmount = $('#Chk' + value).attr('credittotal');
    var strSoruce = $('#Chk' + value).attr('Source');

    if (strSoruce == 'JE') {
        if (DAmount == CAmount) {
            //  $('#Chk' + value).prop('checked', true);
        } else {
            $('#Chk' + value).prop('checked', false);
            msgUnbalancedTransactionSelected();
        }
    } else {
        $('#Chk' + value).prop('checked', false);
    }
}

$('#chkAllForPosing').change(function () {
    var strcheckBox = $('.clsJEList');
    var strcount = 0;
    var strval = true;
    if ($('#chkAllForPosing').is(':checked')) {
        strval = true;
    } else {
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
                } else {
                    strcount++;
                }
            }
        } else {
            $('#' + strId).prop('checked', false);
        }
    }

    if (strcount > 0) {
        msgUnbalancedTransactionSelected();
    }
});

function msgUnbalancedTransactionSelected() {
    ShowMsgBox('showMSG', 'You have attempted to select transaction(s) that are not balanced. You can post balanced transactions ONLY.', '', 'failuremsg');
}

function funJEDetails(values) {
    $('#btnSaveAuditPost').hide();
    $('#DvAuditListByJEDetail').show();
    $('#NewDvAuditListByJEDetail').show();
    $('#ddlClosePeriod').show();
    $('#EditTransactionBreadCrumb').show();
    $('#DvAuditList').hide();
    $('#btnFilter').hide();
    $('#btnDelete').show();
    $('#btnCancel').show();
    $('#btnSaveAuditSave').show();

    strJournalEntryIdAudit = values;
    AtlasJE.init(strJournalEntryIdAudit, funGetJEntryDetailSucess, funGetJEDetailListSucess);
    return;
}

function funGetJEntryDetailSucess(response) {
    AtlasDocument.BindCurrency(response[0].CurrencyTransaction);
    $('#ddlCompany').val(response[0].CompanyId);
    $('#txtDocumentNo').val(response[0].DocumentNo);
    $('#txtTransactionDateAudit').val(response[0].EntryDate);
    $('#txtDescription').val(response[0].Description);
    $('#ddlTypeAudit').val(response[0].Source);
    $('#spnTrasactionNoAudit').text(response[0].TransactionNumber);
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(response[0].ClosePeriodId));
    if (response[0].Source == 'AP') {
        $('#btnSaveAudit').hide();
    }

    strCompany = $('#ddlCompany').find("option:selected").text();

    $('#spnDebitAudit').html(numeral(response[0].DebitTotal).format('0,0.00'));
    $('#spnCreditAudit').html(numeral(response[0].CreditTotal).format('0,0.00'));
    $('#txtImBalanceAudit').html(numeral((response[0].DebitTotal - response[0].CreditTotal)).format('0,0.00'));

    BatchManager.ForceBatch(response[0].BatchNumber);
}

function funTrCreate(objD, action, rowID) {
    objD = (objD === undefined) ? {} : objD;
    let strTrCount = strAuditCount;
    let accountnoun = (objD.AccountCode)? 'AccountCode': 'DT';
    if (rowID === undefined) rowID = strTrCount;

    let tblID = AtlasJE.Config.BodyTable();
    let divID = AtlasJE.Config.BodyTablediv();

    var strNote = (objD['DESCRIPTION'] === undefined) ? $('#txtDescription').val() : objD['DESCRIPTION'];

    var strhtml = '';
    strhtml += `<tr id="${rowID}" class="clsTr" data-trcount="${strTrCount}" data-action="${action}">`;
    strhtml += `<td class="DistributionRowID_JE"><span style="font-size: 14px;color: red;"><i class="fa fa-minus-circle" onclick="javascript: funJEDetailDetail(${AtlasPaste.FillFieldValue(objD, 'JEDID', 0)}, 1, ${rowID});"></i></span></td>`;

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName == 'DT') strhtml += `<td class="DistributionDetail_JE input-segment"><input type="text" class="form-control detectTab clsPaste form-segment DT" value="${AtlasPaste.FillFieldValue(objD, accountnoun)}" onfocus="javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" data-cpname="${ArrSegment[i].SegmentName}"/></td>`;
        else if (ArrSegment[i].SegmentName == 'CO') strhtml += `<td class="DistributionSegment_JE input-segment"><input type="text" class="form-control detectTab clsPaste form-segment CO" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" value="${strCompany}" coacode="${strCompany}" disabled data-cpname="${ArrSegment[i].SegmentName}"/></td>`;
        else if (ArrSegment[i].SegmentName == 'LO') strhtml += `<td class="DistributionSegment_JE input-segment"><input type="text" class="form-control detectTab clsPaste form-segment LO" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" value="${AtlasPaste.FillFieldValue(objD, ArrSegment[i].SegmentName)}" onfocus="this.select();" data-cpname="${ArrSegment[i].SegmentName}"/></td>`;
        else strhtml += `<td class="DistributionSegment_JE input-segment"><input type="text" class="form-control detectTab clsPaste form-segment ${ArrSegment[i].SegmentName}" onfocus="javascript: AtlasUtilities.BuildSegmentsAutoComplete(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" onblur="javascript: AtlasUtilities.legacy.GetSegmentValue(${strTrCount},\'${ArrSegment[i].SegmentName}\',${i}, this);" id="txt_${strTrCount + '_' + i}" name="${ArrSegment[i].SegmentName}" data-cpname="${ArrSegment[i].SegmentName}" value="${AtlasPaste.FillFieldValue(objD, ArrSegment[i].SegmentName)}" /></td>`;
    }

    for (var i = 0; i < ArrOptionalSegment.length; i++) {
        strhtml += `<td class="DistributionSegment_JE"><input value="${AtlasPaste.FillFieldValue(objD, ArrOptionalSegment[i].SegmentName.toUpperCase())}" type="text" class="form-segment-optional ${rowID} form-control SearchOptionalCode clsPaste clsOtional${strTrCount} " onblur="javascript:funCheckOptionalAutoFill(${strTrCount},\'${ArrOptionalSegment[i].SegmentName}\',${i});" onfocus="javascript:GetOptional(${strTrCount},\'${ArrOptionalSegment[i].SegmentName}\',${i});" id="txtOptional_${strTrCount + '_' + i}" name="${ArrOptionalSegment[i].SegmentLevel}"/></td>`;
    }

    for (var i = 0; i < ArrTransCode.length; i++) {
        strhtml += `<td class="DistributionSegment_JE"><input value="${AtlasPaste.FillFieldValue(objD, ArrTransCode[i].TransCode)}" type="text" onblur="javascript: AtlasUtilities.legacy.TransactionCodeBlur(this, 'TransValueId', GlbTransList);" class="form-control SearchCode clsPaste clsTransCode${rowID} clsTransCode_${rowID}" onfocus="javascript: funTransDetail(${rowID},${ArrTransCode[i].TransId}, this)" id="txt_${ArrTransCode[i].TransCode}_${rowID}" name="${ArrTransCode[i].TransId}" TCode="${ArrTransCode[i].TransCode}" /></td>`;
    }

    strhtml += `<td class="DistributionAmount_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'DEBIT', 0)}" type="text" class="form-control w2ui-field DebitClass detectTab w2field amount" onkeypress="javascript:validate(event);" onchange="javascript: funDebitCredit(${strTrCount},0);" id="txtDebit_${strTrCount}"/></td>`;
    strhtml += `<td class="DistributionAmount_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'CREDIT', 0)}" type="text" class="form-control w2ui-field CreditClass detectTab w2field amount" onkeypress="javascript:validate(event);" onchange="javascript:funDebitCredit(${strTrCount},1);" id="txtCredit_${strTrCount}"/></td>`;
    strhtml += `<td id="Vendor_${strTrCount}" class="DistributionVendor_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'VENDOR')}" type="text" class="form-control SearchVendor clsVendor " onfocus="javascript: AtlasJE.fnGetVendorList(this);" onblur="javascript: AtlasJE.fnVendorBlur(this);" id="txtVendor_${strTrCount}"/></td>`;
    strhtml += `<td class="DistributionSegment_JE"><input value="${AtlasPaste.FillFieldValue(objD, 'TAXCODE')}" type="text" class="clsTaxCode clsTax number " onfocus="javascript: funTaxCode(${strTrCount}, this);"  id="ddlTaxCode_${strTrCount}"/></td>`;
    strhtml += `<td class="DistributionDescription_JE" ><input value="${strNote}" type="text" class=" form-control clsNotes detectTab " id="txtNotes_${strTrCount}" onfocus="javascript: funNoteExplode(${strTrCount});" onblur="javascript: funFocusout(${strTrCount});" data-cpname="DESCRIPTION"/>`;
    strhtml += `<input type="hidden" class="clsCOACode" id="hdnCode_${strTrCount}"/><input type="hidden" class="clsCOAId" id="hdnCOAId_${strTrCount}"></td>`;
    strhtml += `<input type="hidden" class="clsJEId" value="${AtlasPaste.FillFieldValue(objD, 'JEDID')}"/>`;

    strAuditCount++;
    strhtml += '</tr>';
    $(`#${tblID}`).append(strhtml);
    AtlasJE.fnVendorBlur($(`#txtVendor_${strTrCount}`)[0], true);

    if (Object.keys(objD).length > 0) {
        let {COAID, COACode, SegCheck} = AtlasInput.LineCOA(objD);
        if (COAID === undefined || COACode === undefined) {
            let e = $(`#${strTrCount}`)[0];
            Object.keys(SegCheck).forEach((seg) => {
                if (SegCheck[AtlasUtilities.SEGMENTS_CONFIG.sequence[AtlasUtilities.SEGMENTS_CONFIG.DetailIndex].SegmentCode]) $(e).find(`td.input-segment [name=${seg}]`).notify('Invalid Account');
                $(e).find(`td.input-segment [name=${seg}]`).addClass('field-Req');
            });
        }
    }

    $('#txt_' + (strTrCount) + '_1').focus();

    return;
}

function funGetJEDetailListSucess(response) {
    $('#btnCancel').show();
    $('#btnSaveJE').show();
    let tblID = AtlasJE.Config.BodyTable();
    let divID = AtlasJE.Config.BodyTablediv();

    let TCodes = (AtlasCache.Cache.GetItembyName('Config.TransactionCodes'))? AtlasCache.Cache.GetItembyName('Config.TransactionCodes').resultJSON: [];
    response.forEach(function (line) {
        let objData = Object.assign({}, AtlasUtilities.SEGMENTS_CONFIG._COA._COAID[line.COAId]);
        if (line.TransactionCodeString !== '') {
            let TString = line.TransactionCodeString.split(','); // Split the TransactionString
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

        objData.SET = line.SetAC;
        objData.DEBIT = numeral(line.DebitAmount).format('0,0.00');
        objData.CREDIT = numeral(line.CreditAmount).format('0,0.00');
        objData.VENDOR = line.VendorName;
        objData.TAXCODE = line.TaxCode;
        objData.DESCRIPTION = line.Note;
        objData.JEDID = line.JournalEntryDetailId;

        funTrCreate(objData, 'existing', objData.JEDID);
    });

    if ($(`#${divID}`).height() >= (window.innerHeight - 330)) { // Space used by JE header
        $(`#${tblID}`).stickyTableHeaders('destroy'); // destroy the old sticky headers

        $(`#${divID}`).height((window.innerHeight - 330)); // Space used by JE header
        $(`#${divID}`).css('overflow', 'overlay'); // scroll
        $(`#${tblID}`).stickyTableHeaders({ scrollableArea: $(`#${objJE.divtblID}`) });
        AtlasJE.ScrollingBody = true;
    }

    //$('.w2ui-field').w2field('float'); //INVALID
    $('.w2field.amount').w2field('currency', { currencyPrefix: '', step: 0 }); // Format all currency fields using w2field lib

    $('#txt_' + (strAuditCount-1) + '_1').focus();
    return;
}

function SetFocusAfterAddNew () {
    let tblID = AtlasJE.Config.BodyTable();
    let divID = AtlasJE.Config.BodyTablediv();

    if ($(`#${divID}`).height() >= (window.innerHeight - 330)) { // Space used by JE header
        $(`#${tblID}`).stickyTableHeaders('destroy'); // destroy the old sticky headers

        $(`#${divID}`).height((window.innerHeight - 330)); // Space used by JE header
        $(`#${divID}`).css('overflow', 'overlay'); // scroll
        $(`#${tblID}`).stickyTableHeaders({ scrollableArea: $(`#${objJE.divtblID}`) });
        AtlasJE.ScrollingBody = true;
    }
    $('#txt_' + (strAuditCount-1) + '_1').focus();
}

function funTaxCode(value, objDom) {
    //clsTax
    var array = [];
    var ProductListjson = TaxCode1099;
    array = TaxCode1099.error ? [] : $.map(TaxCode1099, function (m) {
        return { label: m.TaxCode.trim() + ' = ' + m.TaxDescription.trim(), value: m.TaxCode.trim(), };
    });
    $(`#${objDom.id}`).autocomplete({
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
//==========
function funGetClosePeriodDetailAudit() {
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
        GetClosePeriodDetailAuditSucess(response); })
    .fail(function (error) { 
        ShowMSG(error); })
}

function GetClosePeriodDetailAuditSucess(response) {
    $('#ddlClosePeriod').html('');
    for (var i = 0; i < response.length; i++) {
        $('#ddlClosePeriod').append('<option value="' + response[i].ClosePeriodId + '">' + response[i].PeriodStatus + '</option>');
    }
}

function funJEDetailDetail(value, Mode, TrId) {
    if (value === 0) {
        $('#' + TrId).remove();
    } else {
        $('#DeletePopup').show();
        $('#btndeleteAudit').focus();
        $('#fade').show();
        $('#hdnDeleteRowAudit').val(value);
        $('#hdnDeleteRowId').val(TrId);
    }
    strAuditCount--; //decrement the LineCount
    return;

    if (Mode == 0) {
        $('#' + value).remove();
    } else {
        $('#DeletePopup').show();
        $('#btndeleteAudit').focus();
        $('#fade').show();
        $('#hdnDeleteRowAudit').val(value);
        $('#hdnDeleteRowId').val(TrId);
    }
}

function funDeleteRecordAuditTab(JEID) {
    var strVal = $('#hdnDeleteRowAudit').val();
    var strTr = $('#hdnDeleteRowId').val();
    if (JEID) {
        strVal = JEID;
    }
    strDeleteLineJE += strVal + ',';
    $('#' + JEID).remove();
    $('#DeletePopup').hide();
    $('#fade').hide();
}

function funJELineDeleteAFTERSave(TransactionNumber) {
    if (strDeleteLineJE !== '') {
        $.ajax({
            url: APIUrlDeleteRecordAudit + '?JournalEntryDetailId=' + strDeleteLineJE + '&Type=' + '',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
     .done(function (response) {
         //funDeleteRecordAuditTabSucess(response);
         //funFinalSaveJE('Audit');
     })
     .fail(function (error) {
         ShowMSG(error);
     })
    } else {
        //funFinalSaveJE('Audit');
    }
}

//======================== Segment Position
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
        funSegmentSucess(response, values); })
    .fail(function (error) { 
        console.log(error); })
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
    .done(function (response) { 
        GetOptionalSucess(response, values); })
    .fail(function (error) { 
        ShowMSG(error); })
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
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[i].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[i].AccountID);
                break;
            } else {
                $('#txtOptional_' + value + '_' + valueN).val(GblOptionalCOA[0].AccountCode);
                $('#txtOptional_' + value + '_' + valueN).attr('AccountID', GblOptionalCOA[0].AccountID);
            }
        }
    } else {
    }
}

function funTransDetail(values, TransId, objDom) {
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
        TransDetailSucess(response, objDom);
    })
    .fail(function (error) { 
        ShowMSG(error); 
    })
    ;
}

function TransDetailSucess(response, objDom) {
    objDom = (objDom === undefined)? {}: objDom;
    GlbTransList = [];
    GlbTransList = response;
    var array = [];
    var ProductListjson = response;
    var domID = (objDom.id === undefined)? '.SearchCode': `#${objDom.id}`;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
            //  BuyerId: m.BuyerId,
        };
    });
    $(`${domID}`).autocomplete({
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
        $('#txt_' + Name + '_' + value).attr('TransValueId', '');

    }
}

function funNoteExplode(value) {
    $('#txtNotes_' + value).attr('data-default', $('#txtNotes_' + value).width());
}

//================================================== Note 
function funFocusout(value) {
    var strval = $('#txtNotes_' + value).val();
    $('#txtNotes_' + value).removeAttr('title');
    $('#txtNotes_' + value).attr('title', strval);

    var w = $('#txtNotes_' + value).attr('data-default');
}

//================================================== Alt+N
$(document).on('keydown', function (event) {
    if (event.keyCode != $.ui.keyCode.TAB) return;
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
        funAuditListJEDetailNewRow();
    }

    if (event.altKey === true && key === 83) {
        if ($('#DvAuditListByJEDetail').css('display') == 'block') {
            CheckValidationAuditSave();
        }
    }
});

$('#tblJEListTBodyAudit').delegate('.clsNotes', 'keydown', function (event) {
    var strRowcount = $('#tblJEListTBodyAudit tr:last').attr('id');
    //  var strRowcount = $("#tblJEListTBodyAudit").find("tr").last();
    var key = event.which || event.keyCode;
    if (event.which === 9) {
        if (event.shiftKey === true && key === 9) {
        } else {
            let tablerowcount = $(`#${AtlasJE.Config.BodyTable()}`)[0].rows.length - 1; // Remove the one for the th
            let thisrow = $(this.closest('tr')).index() + 1; // Add one since index is a base 0
            if (AtlasJE.ScrollingBody) tablerowcount--;
            if (tablerowcount === thisrow) {
                let objCopy = {};
                try {
                    for (cell of $(this).closest('tr')[0].children) { objCopy[$(cell).find('input').data('cpname')] = $(cell).find('input').val(); }
                } catch (e) {}
                funTrCreate(objCopy);
                //funSetPreviousRecord(strSplit[1]);
                return;
            }
        }
    }
});

//=========================================== Debit / Credit //===========================
function funDebitCredit(value, Type) { // 0: Debit; 1:Credit
    let dc = ['txtDebit_','txtCredit_'];
    $('#' + dc[Type] + value).val(numeral($('#' + dc[Type] + value).val()).format('0,0.00'));
    $('#' + dc[Math.abs(Type-1)] + value).val('0.00');
}

$('#tblJEListTBodyAudit').delegate('.clsNotes', 'keydown', function (event) {
    var key = event.which || event.keyCode;
    if (event.which === 38) {
        //var stval = $(this).closest('tr').prev().attr('id');
        $('#txtNotes_' + $(this).closest('tr').prev().data('trcount')).focus();
        return;
    } else if (event.which === 40) {
        $('#txtNotes_' + $(this).closest('tr').next().data('trcount')).focus();
        return;
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
        strAmount = strAmount.replace(/,/g, '').replace('$', '');
        TotalDebit += parseFloat(strAmount);

        var sstrId = strCredit[i].id;
        var sstrAmount = $('#' + sstrId).val();
        sstrAmount = sstrAmount.replace(/,/g, '').replace('$', '');
        TotalCredit += parseFloat(sstrAmount);
    }
    TotalImbalance = (parseFloat(TotalDebit) - parseFloat(TotalCredit)).toFixed(2);
    //================
    TotalImbalance = Math.abs(TotalImbalance);
    //=============== Debit
    if (TotalDebit != 0) {
        $('#spnDebitAudit').text(numeral(TotalDebit).format('0,0.00'));
    } else {
        $('#spnDebitAudit').text(0.00);

    }
    //============== Credit
    if (TotalCredit != 0) {
        $('#spnCreditAudit').text(numeral(TotalCredit).format('0,0.00'));
    } else {
        $('#spnCreditAudit').text(0.00);

    }
    //================ Imbalance
    if (TotalImbalance != 0) {
        $('#txtImBalanceAudit').text(numeral(TotalImbalance).format('0,0.00'));
        $('#DvBalImBalAudit').removeClass('green-color');
        $('#DvBalImBalAudit').addClass('red-color');
    } else {
        $('#txtImBalanceAudit').text(parseFloat(0.00).toFixed(2));
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
    } else {
        $('#spnDebit').text(0.00);

    }
    //============== Credit
    if (TotalCredit != 0) {
        $('#spnCredit').text(TotalCredit);
    } else {
        $('#spnCredit').text(0.00);

    }
    //================ Imbalance
    if (TotalImbalance != 0) {
        $('#txtImBalance').text(TotalImbalance);
        $('#DvBalImBal').removeClass('green-color');
        $('#DvBalImBal').addClass('red-color');
        //  $('#spnBalancImBalance').text('ImBalance');

    } else {
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
    } else {
        ShowMsgBox('showMSG', 'Transaction is not in Balance ..!!', '', '');
    }
    // funDeleteAllJED();
});

$('#btnSaveAuditSave').click(function () {
    CheckValidationAuditSave();
});

function CheckValidationAuditSave() {
    var strval = parseFloat($('#txtImBalanceAudit').text());
    if (strval != 0) {
        $('#SaveImbanace').show();
        $('#fade').show();
    } else {
        funSaveFinal();
    }
}

function funSaveFinal() {
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

    if (isvalid === '') {
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
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funAuditTabSave(value) {
    // Delete the lines AFTER
    funFinalSaveJE('Audit');
    //funJELineDeleteBeforeSave();
}

function funFinalSaveJE(value) {
    let invaliddata = 0;
    $('#SaveImbanace').hide();
    var ArrJEDetail = [];
    var strDebitAmount = $('#spnDebitAudit').text();
    var strCreditAmount = $('#spnCreditAudit').text();
    var strImAmount = $('#txtImBalanceAudit').text();

    ////////////////////////////////////////////////////////////////////////// JE
    var objJournalEntry = {
        JournalEntryId: strJournalEntryIdAudit
        //  TransactionNumber:
        , Source: $('#ddlTypeAudit').val()
        , Description: $('#txtDescription').val()
        , EntryDate: $('#txtTransactionDateAudit').val()
        , DebitTotal: strDebitAmount.replace('$', '')
        , CreditTotal: strCreditAmount.replace('$', '')
        , TotalLines: ''
        , ImbalanceAmount: strImAmount.replace('$', '')
        , AuditStatus: value
        , PostedDate: $('#txtTransactionDateAudit').val()
        , ReferenceNumber: ''
        , BatchNumber: BatchManager.BatchNumber
        , ProdId: localStorage.ProdId
        , createdBy: localStorage.UserId
        , ClosePeriod: $('#ddlClosePeriod').val()
        , CompanyId: $('#ddlCompany').val()
        , DocumentNo: $('#txtDocumentNo').val()
        , CurrencyTransaction: $('#ddlCurrency :selected').val()
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

    AtlasJE.fnGetVendorList({}); // So that C&P will work properly
    for (var i = 0; i < strTr.length; i++) {
        var strId = strTr[i].id;
        var TransString = '';
        //var strOptionalString = '';
        var strSet = '';
        var strSeires = '';
        //var strOptional = $('.clsOptional' + strId);
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

        var FJEDetailId = JEDetailId[i].value;
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
            , JournalEntryDetailId: FJEDetailId
            , TransactionLineNumber: $('#spnTrasactionNoAudit').text()
            , COAId: FstrCOAId
            , DebitAmount: FDebitAmount.replace('$', '')
            , CreditAmount: FCreditAmount.replace('$', '')
            , VendorId: FVendorId
            , VendorName: FVendorName
            //   , ThirdParty: FThirdParty
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
        $('#spnTrasactionNoAudit').notify('This entry was NOT SAVED. Please correct your data and then save again.');
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
        funJELineDeleteAFTERSave(response);
        funSaveJEAuditSucess(response, value);
    })
    .fail(function (error) { 
        ShowMSG(error);
    })
}

function funSaveJEAuditSucess(response, value) {
    $('#spnTransId').text(response);
    $('#SaveSuccess').show();
    $('#fade').show();

    $('#spnSaveOk').focus();

    formmodified = 0;

    funAuditFilterNew();
    $('#btnDelete').hide();
    $('#btnCancel').hide();
    $('#btnSaveAudit').hide();
    $('#btnSaveAuditSave').hide();
    $('#btnFilter').show();
}

function funSucessOK() {
    location.reload(true);
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

//================================//
function funPostJE() {
    let csvJEID = '';
    $('.clsJEList:checked').each((e,i) => csvJEID += `${i.name},`) // Build a csv of the JEIDs
    //var strcheckBox = $('.clsJEList:checked');
    //var strCleringFlagCount = 0; <<< Not implemented

    //for (var i = 0; i < strcheckBox.length; i++) {
    //    var strchecked = strcheckBox[i].checked;
    //    var strid = strcheckBox[i].id;
    //    if (strchecked == true) {
    //        if ($('#' + strid).attr('clearingflag') == 'No') {
    //            strval += $('#' + strid).attr('name') + ',';
    //            strCleringFlagCount++;
    //        } else {
    //            strval += $('#' + strid).attr('name') + ',';
    //        }
    //    }
    //}
// ^^^^^^^^^^^^^^^^^^^ obsolete
    csvJEID = csvJEID.substring(0, csvJEID.length - 1);
    if (csvJEID == '') {
        ShowMsgBox('showMSG', 'Please Select Transactions to Post first.', '', '');
    } else {
        G_LedgerCollection.PostCollection(csvJEID);
    }
}

//========
function JEPOsting(strval) {
    $.ajax({
        url: APIUrlSaveAuditPost + '?JEId=' + strval,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        SaveAuditPostSucess(response);
    })
    .fail(function (error) { 
        ShowMSG(error); 
    })
}

function SaveAuditPostSucess(response) {
    $('#SaveInvoiceSuccess').show();
    var strhtml = '';
    strhtml += '<tr><th style="text-align: center;"> Transaction #</th><th style="width: 31%; display:none;">JE #</th></tr>';
    for (var i = 0; i < response.length; i++) {
        strhtml += '<tr>';
        strhtml += '<td style="text-align: center;"> ' + response[i].TransactionNumber + '</td>';
        strhtml += '<td style="width: 31%; display:none;">' + response[i].TransactionNumber + '</td>';
        strhtml += '</tr>';
    }
    $('#tblResult').html(strhtml);
    $('#btnSaveOK').focus();
    funAuditTabJEList();
}

//=================================== Delete 
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
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        location.reload(true);
        $('#DeleteAuditPopup').hide();
        $('#fade').hide();
    })
    .fail(function (error) { 
        ShowMSG(error);
    })
}

function funCancelJE() {
    $('#CancelAuditPopup').show();
    $('#fade').show();

}

function funCancelJEAudit() {
    funJEDetails(strJournalEntryIdAudit);

    $('#CancelAuditPopup').hide();
    $('#fade').hide();
    $('#DvAuditList').show();
    $('#DvAuditListByJEDetail').hide();
    $('#NewDvAuditListByJEDetail').hide();
    $('#ddlClosePeriod').hide();
    $('#EditTransactionBreadCrumb').hide();
    $('#CancelAuditPopup').hide();
    $('#fade').hide();

    $('#btnDelete').hide();
    $('#btnCancel').hide();
    $('#btnSaveAudit').hide();
    $('#btnSaveAuditSave').hide();

    $('#btnSaveAuditPost').show();
    $('#btnFilter').show();
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

function GetJEAudit() {
    oJEAuditId = [];

    var table = $('#tblJEList')
    table.find('tr').each(function (i, el) {
        var id = $(this).find("td").find('input').attr("name");
        if (id != undefined) {
            oJEAuditId.push(id);
        }
    });

    localStorage.setItem("JEAudit", JSON.stringify(oJEAuditId));
}

function funPrevNext(index) {
    if (index == 0) $('#prev').hide(); else $('#prev').show();
    if (index == oJEAuditId.length - 1) $('#next').hide(); else $('#next').show();
    if (index <= oJEAuditId.length) {
        var JEAuditId = oJEAuditId[index];
        funJEDetails(JEAuditId);
    }
}

function setCurrentId(Id) {
    $.each(oJEAuditId, function (index, value) {
        var JEAuditId = value;
        if (JEAuditId == Id) { iPrevNextIndx = index; }
    });
}

$(window).keydown(function (e) {
    if (e.keyCode != $.ui.keyCode.TAB) return;

    if (e.altKey) {
        switch (e.keyCode) {
            case 37:
                $("#prev").trigger("click");
                e.preventDefault();
                break;
            case 39:
                $("#next").trigger("click");
                e.preventDefault();
                break;
        }
    }
});

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