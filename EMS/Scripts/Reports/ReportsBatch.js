var REConfig = new AtlasConfig();
var APIURL_byTransaction = HOST + "/api/ReportAPI/JEAuditReportFilter";
var APIURL_byAccount = HOST + "/api/ReportAPI/JEAuditReportFilter";
var G_TCodes;
var G_TCodesFound = false;
var WHATISGOINGON;

AtlasUtilities.init();
var REv2 = new ReportEngine();
var G_Segment = '';
var G_SegmentOptional = '';
var G_TransCode = '';
var G_SClassification = '';

const C_ExportbyTransaction =  {
    "TransactionNumber": "Transaction #",
    "DocumentNo": "Document #",
    "COAString": function (COAS) {
        return REv2.ExportFunctions.COAStohash(COAS);
    },
    "TransactionvalueString": function (TVS) {
        return REv2.ExportFunctions.TCodestohash(TVS);
    },
    "DebitAmount": "Debit",
    "CreditAmount": "Credit",
    "Currency": function () { return { "Currency": "USD" } },
    "VendorName": "Vendor",
    "TaxCode": "Tax Code",
    "Note": "Line Description",
    "EntryDate": function (EntryDate) {
        return { "Document Date": EntryDate.split('T')[0] }
    },
    "PostedDate": function (PostedDate) {
        return { "Posted Date": PostedDate.split('T')[0] }
    },
    "ClosePeriod": "Company Period",
    "BatchNumber": "Batch #",
    "Source": function () { return { "Type": "JE" } },
    "Description": "Document Description",
    "AccountName": "Account Description"
}

C_ExportbyAccount = {
    "COAString": function (COAS) {
        return REv2.ExportFunctions.COAStohash(COAS);
    },
    "TransactionvalueString": function (TVS) {
        return REv2.ExportFunctions.TCodestohash(TVS);
    },
    "TransactionNumber": "Transaction #",
    "DocumentNo": "Document #",
    "DebitAmount": "Debit",
    "CreditAmount": "Credit",
    "Currency": function () { return { "Currency": "USD" } },
    "VendorName": "Vendor",
    "TaxCode": "Tax Code",
    "Note": "Line Description",
    "EntryDate": function (EntryDate) {
        return { "Document Date": EntryDate.split('T')[0] }
    },
    "PostedDate": function (PostedDate) {
        return { "Posted Date #": PostedDate.split('T')[0] }
    },
    "ClosePeriod": "Company Period",
    "BatchNumber": "Batch #",
    "Source": function () { return { "Type": "JE" } },
    "Description": "Document Description",
    "AccountName": "Account Description"
};

class RECommander {
    constructor(Config) {
        if (Config) {
            this._FormCapture = Config.FormCapture;
            this._ReportFormat = Config.ReportFormat;
            this._APIURLbyAccount = Config.APIURL_byAccount;
            this._APIURLbyTransaction = Config.APIURL_byTransaction;
            this._ReportTitle = Config.ReportTitle;
            this._callingDocumentTitle = Config.callingDocumentTitle;
            this._Sort = Config.Sort;
            this._ExportbyAccount = Config.Export;
            this._ExportbyTransaction = Config.Export;
        }
    }

    get FormCapture() {
        return this._FormCapture;
    }

    get ReportFormat() {
        return this._ReportFormat;
    }

    
}

$(document).ready(function () {
    $('#LiReportsBatches').addClass('active');

    AtlasCache.CacheORajax({
        'URL': AtlasCache.APIURLs.AtlasConfig_TransactionCodes
        , 'doneFunction': function (response) {
            G_TCodes = response.resultJSON;
            G_TcodesFound = true;
        }
        , bustcache: true
        , callParameters: { callPayload: JSON.stringify({ ProdID: localStorage.ProdId }) }
        , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
        , 'cachebyname': 'Config.TransactionCodes'
    });

    $(".datepicker").datepicker({
        onSelect: function (dateText, inst) {
            this.focus();
        }
    });


    var retriveSegment = $.parseJSON(localStorage.ArrSegment);
    var retriveTransaction = $.parseJSON(localStorage.ArrTransaction);

    for (let i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type.toUpperCase() === 'SEGMENTREQUIRED') {
            G_Segment += retriveSegment[i].SegmentName + ',';
            G_SClassification += retriveSegment[i].SegmentClassification + ',';
        }
        else {
            G_SegmentOptional += retriveSegment[i].SegmentName + ',';
        }
    }
    for (let i = 0; i < retriveTransaction.length; i++) {
        G_TransCode += retriveTransaction[i].TransCode + ',';
    }

    G_Segment = G_Segment.substring(0, G_Segment.length - 1);
    G_SegmentOptional = G_SegmentOptional.substring(0, G_SegmentOptional.length - 1);
    G_TransCode = G_TransCode.substring(0, G_TransCode.length - 1);
    G_SClassification = G_SClassification.substring(0, G_SClassification.length - 1);

    $('#dvBatchReportFilter #ReportDate').val(new Date().format('mm/dd/yyyy'));

    // Audit
    let theDIV = 'dvBatchReportFilter';
    REv2.Form.RenderMemoCodes(`#${theDIV} #additionalfilters`, 'fieldsetMC');
    REv2.Form.RenderSegments({
        domID: 'BatchAsegmentfilters'
        , fieldset: 'fieldsetSegments'
        , legendlabel: ''
        , A_List: AtlasUtilities.SEGMENTS_CONFIG.sequence
    });

    REv2.Form.RenderfieldsetPeriod({
        formID: `#${theDIV}`
        , fieldset: '#fieldsetPeriod'
        , legendlabel: 'PERIODS & DATES'
        , excludelist: { 'Period': 'x', 'PostedDate': 'x' }
    });

    REv2.Form.RenderBatchSelect({ DOM: $(`#${theDIV} #ddlBatchNumber`) });

    // For all Period & Date groupings
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

    REv2.Form.RenderMultiCurrency({
        formID: '#dvBatchReportFilter'
        , fieldset: '#fieldsetCurrency'
        , legendlabel: 'CURRENCY'
    })

    G_BuildSegmentOrder();
});


//====================JE Audit Report=======================//
function RunReport(isExport) {
    let FormCapture = $('#dvFilterDv').find('div.active')[0].id; // Pull the active filter tab
    let ReportFormat = $(`#${FormCapture} [name="ReportFormat"]:checked`).val().toUpperCase();

    let DocumentStatus = 'SAVED';
    let APIURL = APIURL_byTransaction;
    let ReportTitle = 'Batch Audit by Transaction';
    let callingDocumentTitle = 'Reports > Batch Report';
    let Sort = 'TRANSACTION';

    let objExport = C_ExportbyTransaction;

    var l_objRD = {
        ProductionName: localStorage.ProductionName,
        Company: '',
        Bank: localStorage.strBankId,
        Batch: localStorage.BatchNumber,
        UserName: localStorage.UserId,
        Segment: G_Segment,
        SegmentOptional: G_SegmentOptional,
        TransCode: G_TransCode,
        SClassification: G_SClassification
    };

    var l_objRDF = {
        ProdId: localStorage.ProdId,
        CompanyId: 1,//parseFloat($('#JEAuditFilterCompany').val()[0]), <<< PERM NEEDED
        PeriodStatus: $(`#${FormCapture} #PeriodStatus`).val(),
        CreateDateFrom: $(`#${FormCapture} #DocumentDateFrom`).val(),
        CreatedDateTo: $(`#${FormCapture} #DocumentDateTo`).val(),
        TransactionFrom: $(`#${FormCapture} #TransFrom`).val(),
        TranasactionTo: $(`#${FormCapture} #TransTo`).val(),
        BatchNumber: $(`#${FormCapture} #BatchNumber`).val(),
        UserName: '',
        Status: DocumentStatus
    }

    G_TCodes = AtlasCache.Cache.GetItembyName('Transaction Codes');

    if (ReportFormat === 'BYACCOUNT') {
        APIURL = APIURL_byAccount;
        ReportTitle = 'Batch Audit by Account';
        Sort = 'ACCOUNT';
        objExport = C_ExportbyAccount;
    }
    let RE = new ReportEngine(APIURL);
    RE.ReportTitle = ReportTitle
    RE.callingDocumentTitle = callingDocumentTitle;
    RE.FormCapture(`#${FormCapture}`);
    RE.FormJSON.ReportConfig = {
        objRD: l_objRD
        , objRDF: l_objRDF
    }
    RE.FormJSON.ReportTitle = ReportTitle;
    RE.FormJSON.TTInclude = 'ALL';
    RE.FormJSON.ProdID = localStorage.ProdId;
    RE.FormJSON.UserID = localStorage.UserId;
    RE.FormJSON.JEReport = 'JEAudit';
    RE.FormJSON.JESort = Sort;
    if (isExport) {
        RE.setasExport(objExport)
    }

    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });

}
