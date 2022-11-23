var REConfig = new AtlasConfig();

var APIUrlGetPettyCashPDF = HOST + "/api/ReportAPI/ReportPettyCash";
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlGetBatchNumByProdId = HOST + "/api/ReportAPI/GetAllBatchNumber";
var APIUrlGetUserByProdId = HOST + "/api/ReportAPI/GEtAllUserInfo";
var APIUrlPCBankAutofill = HOST + "/api/POInvoice/GetCustodianCode";
var APIUrlFillRecipient = HOST + "/api/POInvoice/GetRecipientList";

//var APIUrlGetVendoreByProdId = HOST + "/api/POInvoice/GetVendorListForCustodian";


var StrSegment = '';
var StrSegmentOptional = '';
var strTransCode = '';

AtlasUtilities.init();
var REv2 = new ReportEngine();

$(document).ready(function () {
    $(".datepicker").datepicker({
        onSelect: function (dateText, inst) {
            this.focus();
        }
    });

    if ($('#txtReportDate').val() == '') {
        $('#ddlCompany').focus();
        $(this).next('input').focus();
    }

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
    $('#txtReportDate').val(Date1);
    $('#txtApInvsCreatedTo').val(Date1);
*/

    $('#LiReportPettyCash').addClass('active');

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

    // Filter Rendering
    REv2.Form.RenderMemoCodes('#DivPCA #additionalfilters', 'fieldsetMC');
    REv2.Form.RenderSegments({
        domID: 'APPCAsegmentfilters'
        , fieldset: 'fieldsetSegments'
        , legendlabel: ''
        , excludelist: {}
        , A_List: AtlasUtilities.SEGMENTS_CONFIG.sequence
    });
    REv2.Form.RenderMultiCurrency({
        formID: ['#DivPCA', '#DivPCP']
    , fieldset: '#fieldsetCurrency'
    , legendlabel: 'CURRENCY'
    })

    REv2.Form.RenderfieldsetPeriod({
        formID: '#DivPCA'
        , fieldset: '#fieldsetPeriod'
        , legendlabel: 'PERIODS & DATES'
        , excludelist: { 'Period': 'x', 'PostedDate': 'x' }
    });

    REv2.Form.RenderMemoCodes('#DivPCP #additionalfilters', 'fieldsetMC');
    REv2.Form.RenderSegments({
        domID: 'APPCPsegmentfilters'
        , fieldset: 'fieldsetSegments'
        , legendlabel: ''
        , excludelist: {}
        , A_List: AtlasUtilities.SEGMENTS_CONFIG.sequence
    });

    REv2.Form.RenderfieldsetPeriod({
        formID: '#DivPCP'
        , fieldset: '#fieldsetPeriod'
        , legendlabel: 'PERIODS & DATES'
        , excludelist: { 'PeriodCF': 'x' }
    });

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

    AtlasDocument.FillVendorAutoComplete($('#DivPCA #txtVendorFrom'));
    AtlasDocument.FillVendorAutoComplete($('#DivPCA #txtVendorTo'));
    AtlasDocument.FillVendorAutoComplete($('#DivPCP #txtVendorFrom'));
    AtlasDocument.FillVendorAutoComplete($('#DivPCP #txtVendorTo'));

    REv2.Form.RenderBatchSelect({ DOM: $('#DivPCA #ddlBatchNumber') });
    REv2.Form.RenderBatchSelect({ DOM: $('#DivPCP #ddlBatchNumber') });

    //$('#DivPCA #txtReportDate').val(Date1);
    //$('#DivPCP #txtReportDate').val(Date1);
    let propadate = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
    $('.propadate').val(propadate);

    FillCustodian($('#DivPCA #ddlPettyCashCustodian'));
    FillRecipient($('#DivPCA #ddlPettyCashRecipient'));
    FillCustodian($('#DivPCP #ddlPettyCashCustodian'));
    FillRecipient($('#DivPCP #ddlPettyCashRecipient'));

    G_BuildSegmentOrder();
});
/*
//============= Company
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

    //$('#ddlCompany').append('<option value=0>Select Company</option>');
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }

}
*/

function FilterPettyCash() {
    //var ddlSelectText = {
    //    PettyCashCustodian: $("#ddlPettyCashCustodian option:selected").map(function () {
    //        return $(this).text();
    //    }).get().join(',').split(',')[0],
    //    PettyCashRecipient: $("#ddlPettyCashRecipient option:selected").map(function () {
    //        return $(this).text();
    //    }).get().join(',').split(',')[0],
    //    PettyCashUserName: $("#ddlPettyCashUserName option:selected").map(function () {
    //        return $(this).text();
    //    }).get().join(',').split(',')[0],
    //    thirdPartyVendor: $("#ddlthirdPartyVendor option:selected").map(function () {
    //        return $(this).text();
    //    }).get().join(',').split(',')[0],
    //    PettyCashVendor: $("#ddlPettyCashVendor option:selected").map(function () {
    //        return $(this).text();
    //    }).get(),
    //    ids: $("#ddlPettyCashVendor option:selected").map(function () {
    //        return $(this).val();
    //    }).get(),

    //}
    APIName = 'APIUrlGetPettyCashPDF';
    let ReportTitle = 'Petty Cash';
    let callingDocumentTitle = 'Reports > Petty Cash > Petty Cash Audit';
    let FormCapture = '#DivPCA';
    let strStatus = 'Pending';

    if ($('#liPCAudit').attr('class') == 'active') {
    } else {
        callingDocumentTitle = 'Reports > Petty Cash > Petty Cash Posted';
        FormCapture = '#DivPCP';
        strStatus = 'Posted';
    }
    let RE = new ReportEngine(APIUrlGetPettyCashPDF);
    RE.ReportTitle = ReportTitle;
    RE.callingDocumentTitle = callingDocumentTitle
    RE.FormCapture(FormCapture);

    //RE.FormJSON.DdlSelectText = ddlSelectText;
    RE.FormJSON.Segment = StrSegment;
    RE.FormJSON.SegmentOptional = StrSegmentOptional;
    RE.FormJSON.TransCode = strTransCode;
    RE.FormJSON.ProductionName = localStorage.ProductionName;
    RE.FormJSON.Status = strStatus;
    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });
}

function PrintBrowserPDF() {

    var PDFURL = 'PettyCashReport/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}


function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}

function ShowhideFilter() {


}
/*
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
        $('#ddlPettyCashVendor').append('<option value="' + response[i].VendorID + '">' + response[i].VendorName + '</option>');
        $('#ddlthirdPartyVendor').append('<option value="' + response[i].VendorID + '">' + response[i].VendorName + '</option>');
    }
    $('#ddlPettyCashVendor').multiselect(
     {
         includeSelectAllOption: true
         , enableFiltering: true
         , maxHeight: 300
     });
    $('#ddlthirdPartyVendor').multiselect(
     {
         includeSelectAllOption: true
         , enableFiltering: true
         , maxHeight: 300
     });
}

//===============multiselect BatchNumber===========//
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
        $('#ddlPettyCashBatch').append('<option value="' + response[i].BatchNumber + '">' + response[i].BatchNumber + '</option>');
    }
    $('#ddlPettyCashBatch').multiselect(
     {
         includeSelectAllOption: true
         , enableFiltering: true
         , maxHeight: 300
     });
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
        $('#ddlPettyCashUserName').append('<option value="' + response[i].UserID + '">' + response[i].Name + '</option>');
    }
    $('#ddlPettyCashUserName').multiselect(
        {
           includeSelectAllOption: true
         , enableFiltering: true
         , maxHeight: 300
        });

}
*/
//===============PC Bank =================//
function FillCustodian(objDOM) {
    $.ajax({
        url: APIUrlPCBankAutofill + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        for (var i = 0; i < response.length; i++) {
            $(objDOM).append('<option value="' + response[i].CustodianID + '">' + response[i].CustodianCode + '</option>');
        }
        $(objDOM).multiselect({
            includeSelectAllOption: true
             , enableFiltering: true
             , maxHeight: 300
        });
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillRecipient(objDOM) {
    $.ajax({
        url: APIUrlFillRecipient + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        for (var i = 0; i < response.length; i++) {
            $(objDOM).append('<option value="' + response[i].RecipientID + '">' + response[i].VendorName + '</option>');
        }
        $(objDOM).multiselect(
         {
             includeSelectAllOption: true
             , enableFiltering: true
             , maxHeight: 300
         });
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function ShowHide(objDOM) {
    let divShow = $(objDOM).data('show');
    let divHide = $(objDOM).data('hide');

    $(divShow).show();
    $(divHide).hide();
}
