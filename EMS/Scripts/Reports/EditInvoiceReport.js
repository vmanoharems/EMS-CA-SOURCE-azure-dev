var REConfig = new AtlasConfig();

var APIUrlGetGetInvoicePDFTransaction = HOST + "/api/ReportAPI/APAuditByTransaction";

var APIUrlGetGetInvoicePDF = HOST + "/api/ReportAPI/APAuditByAccount";

var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlBankListByCompanyId = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlGetBatchNumByProdId = HOST + "/api/ReportAPI/GetAllBatchNumber";
var APIUrlGetUserByProdId = HOST + "/api/ReportAPI/GEtAllUserInfo";


var APIUrlGetClosePeriodByProdId = HOST + "/api/ReportAPI/GetClosePeriodList";

var APIUrlGetOpenPeriodByProdId = HOST + "/api/ReportAPI/GetOpenPeriod";

var StrSegment = '';
var StrSegmentOptional = '';
var strTransCode = '';

AtlasUtilities.init();
var REv2 = new ReportEngine();
$(document).ready(function () {
    FillBank();
    heightt = $(window).height();
    heightt = heightt - 180;
    $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
    $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');

    $('#dvAuditCPeriod').removeClass('displayNone');


    funVendorFilter();
    funBatchNumberFilter();
    funGetUserFilter();
    $('#txtApInvsBank').focus();
    $('#LiAPInvoiceReports').addClass('active');
    var retriveSegment = $.parseJSON(localStorage.ArrSegment);
    var retriveTransaction = $.parseJSON(localStorage.ArrTransaction);

    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type == 'SegmentRequired') {
            StrSegment = StrSegment + retriveSegment[i].SegmentName + ',';
        }
        else {
            StrSegmentOptional = StrSegmentOptional + retriveSegment[i].SegmentName + ',';
        }
    }
    for (var i = 0; i < retriveTransaction.length; i++) {
        strTransCode = strTransCode + retriveTransaction[i].TransCode + ',';
    }

    StrSegment = StrSegment.substring(0, StrSegment.length - 1);
    StrSegmentOptional = StrSegmentOptional.substring(0, StrSegmentOptional.length - 1);
    strTransCode = strTransCode.substring(0, strTransCode.length - 1);
    /*
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

    $('#txtApInvsCreatedTo').val(Date1);
    */
    let propadate = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
    $('.propadate').val(propadate);

    $(".datepicker").datepicker({
        onSelect: function (dateText, inst) {
            this.focus();
        }
    });
    
    // Filter Rendering
    REv2.Form.RenderMemoCodes('#DivInvoiceA #additionalfilters', 'fieldsetMC');
    REv2.Form.RenderSegments({
        domID: 'APIAsegmentfilters'
        , fieldset: 'fieldsetSegments'
        , legendlabel: ''
        , excludelist: { }
        , A_List: AtlasUtilities.SEGMENTS_CONFIG.sequence
    });

    REv2.Form.RenderfieldsetPeriod({
        formID: '#DivInvoiceA'
        , fieldset: '#fieldsetPeriod'
        , legendlabel: 'PERIODS & DATES'
        , excludelist: { 'Period': 'x', 'PostedDate': 'x' }
    });

    REv2.Form.RenderMemoCodes('#DivInvoiceP #additionalfilters', 'fieldsetMC');
    REv2.Form.RenderSegments({
        domID: 'APIPsegmentfilters'
        , fieldset: 'fieldsetSegments'
        , legendlabel: ''
        , excludelist: {}
        , A_List: AtlasUtilities.SEGMENTS_CONFIG.sequence
    });

    REv2.Form.RenderfieldsetPeriod({
        formID: '#DivInvoiceP'
        , fieldset: '#fieldsetPeriod'
        , legendlabel: 'PERIODS & DATES'
        , excludelist: { 'PeriodCF': 'x' }
    });


    REv2.Form.RenderMultiCurrency({
        formID: ['#DivInvoiceA', '#DivInvoiceP']
        , fieldset: '#fieldsetCurrency'
        , legendlabel: 'CURRENCY'
    })

    $('.Period')
        .data('xor', '#PostedDateFrom,#PostedDateTo,#DocumentDateFrom,#DocumentDateTo')
        .data('xorfriend', ".Period")
    ;
    $('.PostedDate')
        .data('xor', '#PeriodFrom,#PeriodTo,#DocumentDateFrom,#DocumentDateTo')
        .data('xorfriend', '.PostedDate')
    ;
    $('.DocDate')
        .data('xor', '#PeriodFrom,#PeriodTo,#PostedDateFrom,#PostedDateTo')
        .data('xorfriend', '.DocDate')
    ;

    $('.fieldsetPeriod').on('change', 'input', null, function () {
        let xorlist = $(this).data('xor');
        let xorfriend = $(this).data('xorfriend');
        let disable = false;
        let objDisabled = { disable: false };

        if (this.value !== '') {// || (xorfriend !== undefined && $(xorfriend).val() !=='')) {
            objDisabled.disable = true;
        }
        $(event.currentTarget).find(xorfriend).each(function (i, e) {
            if (!objDisabled.disable) objDisabled.disable = (e.value !== '') || objDisabled.disable;
        });

        xorlist.split(',').forEach((el) => {
            $(event.currentTarget).find(el).prop('disabled', objDisabled.disable);
        });
    });

    $('.smartdate').blur(function () {
        if (this.value === '') return;
        let thedate = moment(this.value, 'MM/DD/YYYY').format('MM/DD/YYYY');
        if (thedate.toUpperCase() === 'INVALID DATE') { // moment.isValid doesn't work properly for a value like 33, which is invalid
            this.value = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
        } else {
            this.value = thedate;
        }
    });

    AtlasDocument.FillVendorAutoComplete($('#DivInvoiceA #txtVendorFrom'));
    AtlasDocument.FillVendorAutoComplete($('#DivInvoiceA #txtVendorTo'));
    AtlasDocument.FillVendorAutoComplete($('#DivInvoiceP #txtVendorFrom'));
    AtlasDocument.FillVendorAutoComplete($('#DivInvoiceP #txtVendorTo'));

    REv2.Form.RenderBatchSelect({ DOM: $('#DivInvoiceA #ddlBatchNumber') });
    REv2.Form.RenderBatchSelect({ DOM: $('#DivInvoiceP #ddlBatchNumber') });

    funPeriodNumberFilter();

    G_BuildSegmentOrder();
});

$(document).ajaxStop(() => {
    $('.btnReports').attr('disabled', false);
});

function ShowHide(objDOM) {
    let divShow = $(objDOM).data('show');
    let divHide = $(objDOM).data('hide');

    $(divShow).show();
    $(divHide).hide();
}

function funTaxCode() {
    var array = [];
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
//--------------------------------------------------- Bank
function FillBank() {
    $.ajax({
        url: APIUrlBankListByCompanyId + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillBankSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillBankSucess(response) {
    if (response.length == 1) {
        $('#DivInvoiceA #txtAPIBank').val(response[0].Bankname);
        $('#DivInvoiceA #txtAPIBank').data('bankid', response[0].BankId);
        $('#DivInvoiceP #txtAPIBank').val(response[0].Bankname);
        $('#DivInvoiceP #txtAPIBank').data('bankid', response[0].BankId);
    }

    StrBankList = [];
    StrBankList = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.BankId,
            label: m.Bankname,
            //  BuyerId: m.BuyerId,

        };
    });
    $(".SearchBank").autocomplete({
        minLength: 1,
        source: array,
        autoFocus: true,
        select: function (event, ui) {
            $('#txtAPIBank').val(ui.item.label);
            $('#txtAPIBank').data('bankid', ui.item.value);
            return false;
        },
    })
}

//----------------------------------------------------- Preview
function FunEditInvoice(isExport) {
    //var strStatus = '';
    //var strFinalPeriodID = '';
    let DIVAuditvPosted = '#DivInvoiceP';
    let AuditvPosted = 'Posted';
    if ($('#liInvoiceAudit').attr('class') == 'active') {
        DIVAuditvPosted = '#DivInvoiceA';
        AuditvPosted = 'Audit';
    }

    //var StrInvoiceUser = $('#ddlInvoiceUserName').val();
    //var StrFinalInvoiceVen = '';
    //if (StrInvoiceUser == null) {
    //    StrFinalInvoiceVen = '';
    //}
    //else {
    //    for (var i = 0; i < StrInvoiceUser.length; i++) {
    //        StrFinalInvoiceVen = StrFinalInvoiceVen + ',' + StrInvoiceUser[i]
    //    }
    //}
    //var strVendor = $('#ddlInvoiceVendor').val();
    //var strFinalVendor = '';
    //if (strVendor == null) {
    //    strVendor = '';
    //}
    //else {
    //    for (var i = 0; i < strVendor.length; i++) {
    //        strFinalVendor = strFinalVendor + ',' + strVendor[i]
    //    }
    //}

    var strBatchNumber = $(`${DIVAuditvPosted} #ddlInvoiceBatch`).val();
    //var strFinalBatchNumber = '';
    //if (strBatchNumber == null) {
    //    strBatchNumber = '';
    //}
    //else {
    //    for (var j = 0; j < strBatchNumber.length; j++) {
    //        strFinalBatchNumber = strFinalBatchNumber + ',' + strBatchNumber[j]

    //    }
    //}
    //var strUserName = $('#ddlAPInvoiceReportVendor').val();
    //var strFinalUSerName = '';
    //if (strUserName == null) {
    //    strFinalUSerName = '';
    //}
    //else {
    //    for (var k = 0; k < strUserName.length; k++) {
    //        strFinalUSerName = strFinalUSerName + ',' + strUserName[k]
    //    }
    //}

    //var obj = {
    //    CId: parseFloat($('#InvoiceFilterCompany').val()[0]),// $('select#ddlCompany option:selected').val(),
    //    BankId: $('#txtInvshdnBank').val(),
    //    PeriodStatus: strFinalPeriodID,
    //    CreatedDateFrom: ($('#txtApInvsCreatedFrom').val() === '') ? '01/01/2017' : $('#txtApInvsCreatedFrom').val(),
    //    CreatedDateTo: $('#txtApInvsCreatedTo').val(),
    //    TransactionNumberFrom: $('#txtInvoiceTransFrom').val(),
    //    TransactionNumberTo: $('#txtInvoiceTransTo').val(),
    //    VendorId: strFinalVendor,
    //    BatchNumber: strFinalBatchNumber,
    //    CreatedBy: StrFinalInvoiceVen,
    //    ProdId: localStorage.ProdId,
    //    Status: strStatus
    //}
    let strClassification = Object.keys(AtlasUtilities.SEGMENTS_CONFIG.classification).reduce(function(r,e) {
        //console.log(e);
        return `${r},${e}`;
    });

    var ObjReportDetails = {
        ProductionName: localStorage.ProductionName,
        Company: '',
        Bank: localStorage.strBankId,
        Batch: BatchManager.BatchNumber,
        UserName: localStorage.UserId,
        Segment: StrSegment,
        SegmentOptional: StrSegmentOptional,
        TransCode: strTransCode,
        SClassification: strClassification,
        SegmentOrder: G_SegmentOrder
    }
    var finalObj = {
        objRD: ObjReportDetails,
        //objRDF: obj
    }
    //var ddlSelectText = {
    //    userName: $("#ddlInvoiceUserName option:selected").map(function () {
    //        return $(this).text();
    //    }).get().join(',').split(',')[0],
    //    vendorName: $("#ddlInvoiceVendor option:selected").map(function () {
    //        return $(this).text();
    //    }).get().join(',').split(',')[0],
    //    Batch: $("#ddlInvoiceBatch option:selected").map(function () {
    //        return $(this).text();
    //    }).get().join(',').split(',')[0]
    //}

    let objExport = {
        "TransactionNumber": function (TransactionNumber) {
            return { "Transaction #": TransactionNumber }
        },
        "VendorName": function (VendorName) {
            return { "Vendor": VendorName }
        },
        "PrintOncheckAS": (PrintOncheckAS) => {
            return { 'Print on Check': PrintOncheckAS }
        },
        "InvoiceNumber": function (InvoiceNumber) {
            return { "Invoice #": InvoiceNumber }
        },
        "InvoiceDate": function (InvoiceDate) {
            return { "Invoice Date": InvoiceDate }
        },
        "Description": function (Description) {
            return { "Invoice Description": Description }
        },
        "ClosePeriod": function (ClosePeriod) {
            return { "Period": ClosePeriod }
        },
        "PaymentID": function (PaymentID) {
            return { "Payment #": PaymentID }
        },
        "PaymentDate": function (PaymentDate) {
            return { "Payment Date": PaymentDate }
        },
        "BatchNumber": function (BatchNumber) {
            return { "Batch #": BatchNumber }
        }
        , "Segments": function (SegmentsJSON) {
            return RE.ExportFunctions.SegmentJSONtohash(SegmentsJSON);
        }
        //"Location": true,
        //"AccountCode": function (AccountCode) {
        //    return { "Detail": AccountCode }
        //},
        ///"MemoCode":true,
        , "TaxCode": function (TaxCode) {
            return { "Tax Code (1099)": TaxCode }
        },
        "Amount": function (Amount) {
            return { "Line Item Amount": Amount }
        },
        "LineDescription": function (LineDescription) {
            return { "Line Item Description": LineDescription }
        }
    };

    let ReportAPI = APIUrlGetGetInvoicePDFTransaction;
    let ReportGrouping = 'Transaction';
    let CallingDocumentTitle = 'Reports > Invoices';

    if (
        ($("#RAAccount").prop("checked") && AuditvPosted == 'Audit')
        ||
        ($("#RPAccount").prop("checked") && AuditvPosted == 'Posted')
        ) {
        APIName = 'APIUrlGetGetInvoicePDF';
        ReportAPI = APIUrlGetGetInvoicePDF;
        ReportGrouping = 'Account';

        //RE.ReportTitle = 'AP Invoice Audit';
        //let RE = new ReportEngine(APIUrlGetGetInvoicePDF);
        //RE.FormCapture('#DivInvoiceF');
        //if (isExport) {
        //    RE.setasExport(objExport);
        //}
        //RE.FormJSON.Invoice = finalObj;
        //RE.isJSONParametersCall = true;
        //RE.FormJSON.Status = strStatus;
        //RE.FormJSON.DdlSelectText = ddlSelectText;
        //RE.FormJSON.ProductionName = localStorage.ProductionName;
        //RE.RunReport({ DisplayinTab: true });
        //return;
    //} else {
    //    APIName = 'APIUrlGetGetInvoicePDFTransaction';
    //    let RE = new ReportEngine(APIUrlGetGetInvoicePDFTransaction);
    //    RE.ReportTitle = 'AP Posting by Transaction';
    //    RE.callingDocumentTitle = 'Reports > Invoices > AP Invoice Posting';
    //    RE.FormCapture('#DivInvoiceF');
    //    if (isExport) {
    //        RE.setasExport(objExport);
    //    }
    //    RE.FormJSON.Invoice = finalObj;
    //    RE.isJSONParametersCall = true;
    //    RE.FormJSON.Status = strStatus;
    //    RE.FormJSON.DdlSelectText = ddlSelectText;
    //    RE.FormJSON.ProductionName = localStorage.ProductionName;
    //    RE.RunReport({ DisplayinTab: true });
        //return;
    }

    let ReportTitle = `AP ${AuditvPosted} by ${ReportGrouping}`;
    let RE = new ReportEngine(ReportAPI);
    RE.FormCapture(DIVAuditvPosted);
    RE.FormJSON.BankID = $('#txtAPIBank').data('bankid');
    if (isExport) {
        RE.setasExport(objExport);
    }
    RE.FormJSON.Invoice = finalObj;
    RE.isJSONParametersCall = true;
    RE.FormJSON.ProductionName = localStorage.ProductionName;
    RE.ReportTitle = ReportTitle;
    RE.callingDocumentTitle = CallingDocumentTitle;

    RE.RunReport({ DisplayinTab: true });
}
function FunEditInvoiceSucess(response) {
    if (response == '') {
        alert(' No Records Found for the search Criteria');
    }
    //  $('#btnPreview').show();
}

function ShowMSG(error) {
    console.log(error);
    //$('#preload').attr('style', 'display:none;');
}

//===============multiselect Vendor===========//
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
        $('#ddlInvoiceVendor').append('<option value="' + response[i].VendorID + '">' + response[i].VendorName + '</option>');
    }
    // $('#ddlInvoiceVendor').multiselect();
    $('#ddlInvoiceVendor').multiselect({ nonSelectedText: 'Select', enableFiltering: true, maxHeight: 350 });

}

//===============multiselect BatchNumber===========//
function funPeriodNumberFilter() {
    //var CID = $('select#ddlCompany option:selected').val();
    var CID = ($('#InvoiceFilterCompany').val());
    if (CID == null)
        return;
    $.ajax({
        url: APIUrlGetClosePeriodByProdId + '?ProdID=' + localStorage.ProdId + '&CID=' + CID[0] + '&Mode=' + 1,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { funPeriodNumberFilterSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function funPeriodNumberFilterSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#txtApInvsPeriodPost').append('<option value="' + response[i].CPeriod + '">' + response[i].CPeriod + '</option>');
    }
    // $('#txtApInvsPeriodPost').multiselect();
}





function funBatchNumberFilter() {
    $.ajax({
        url: APIUrlGetBatchNumByProdId + '?ProdID=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { funBatchNumberFilterSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function funBatchNumberFilterSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlInvoiceBatch').append('<option value="' + response[i].BatchNumber + '">' + response[i].BatchNumber + '</option>');
    }
    //  $('#ddlInvoiceBatch').multiselect();
    $('#ddlInvoiceBatch').multiselect({ nonSelectedText: 'Select', enableFiltering: true, maxHeight: 350 });

}

//===============multiselect Users===========//
function funGetUserFilter() {
    $.ajax({
        url: APIUrlGetUserByProdId + '?ProdID=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { funGetUserFilterSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function funGetUserFilterSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlInvoiceUserName').append('<option value="' + response[i].UserID + '">' + response[i].Name + '</option>');
    }
    $('#ddlInvoiceUserName').multiselect();

}

//==============//
function SetfocustoNext() {
    if ($('#txtApInvsCreatedTo').val() == '') {
        $('#txtInvoiceTransFrom').focus();
    }
}


function PrintBrowserPDF(value) {
    var PDFURL = '/' + value + '/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#btnPreview').show();
    $('#btnPrint').attr('style', 'display:block;');
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}
//================InvoicePosting==================//

function GetClosePeriod() {
    funPeriodNumberFilter();
    //  funOpenPeriod();
}