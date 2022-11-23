var REConfig = new AtlasConfig();

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetBatchNumByProdId = HOST + "/api/ReportAPI/GetAllBatchNumber";
var APIUrlGetUserByProdId = HOST + "/api/ReportAPI/GEtAllUserInfo";

var APIUrlReportPOListing = HOST + "/api/ReportAPI/POListingReports";
var APIUrlReportsPOListing = HOST + "/api/ReportAPI/ReportsPOListing";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";
var APIUrlGetPeriodForPO = HOST + "/api/ReportAPI/GetPeriodForBible";

var ApiUrlReportPOHistory = HOST + "/api/ReportAPI/POHistoryReports";



var StrSegment = '';
var StrSegmentOptional = '';
var strTransCode = '';
var StrSClassification = '';
var tabindex = 0;
AtlasUtilities.init();
var REv2 = new ReportEngine();

$(document).ready(function () {
    $('#LiPurchaseReports').addClass('active');

    if ($('#txtPOFilterReportDate').val() === '') {
        $(this).next().show();
        $('[tabindex=' + tabindex + ']').focus();

    }

    var retriveSegment = $.parseJSON(localStorage.ArrSegment);
    var retriveTransaction = $.parseJSON(localStorage.ArrTransaction);

    for (let i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type == 'SegmentRequired') {
            StrSegment = StrSegment + retriveSegment[i].SegmentName + ',';
            StrSClassification = StrSClassification + retriveSegment[i].SegmentClassification + ',';
        } else {
            StrSegmentOptional = StrSegmentOptional + retriveSegment[i].SegmentName + ',';
        }
    }

    for (let i = 0; i < retriveTransaction.length; i++) {
        strTransCode = strTransCode + retriveTransaction[i].TransCode + ',';
    }

    StrSegment = StrSegment.substring(0, StrSegment.length - 1);
    StrSegmentOptional = StrSegmentOptional.substring(0, StrSegmentOptional.length - 1);
    strTransCode = strTransCode.substring(0, strTransCode.length - 1);
    StrSClassification = StrSClassification.substring(0, StrSClassification.length - 1);

    //$('#POReportdiv #ReportDate').val(Date1);


    // Filter Rendering
    REv2.Form.RenderMemoCodes('#POReportdiv #additionalfilters', 'fieldsetMC');
    REv2.Form.RenderSegments({
        domID: 'APPOsegmentfilters'
        , fieldset: 'fieldsetSegments'
        , legendlabel: ''
        , excludelist: {}
        , A_List: AtlasUtilities.SEGMENTS_CONFIG.sequence
    });
    REv2.Form.RenderMultiCurrency({
        formID: '#POReportdiv'
        , fieldset: '#fieldsetCurrency'
        , legendlabel: 'CURRENCY'
    })

    REv2.Form.RenderfieldsetPeriod({
        formID: '#POReportdiv'
        , fieldset: '#fieldsetPeriod'
        , legendlabel: 'PERIODS & DATES'
        , excludelist: { 'PeriodCF': 'x', 'PostedDate': 'x' }
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

    AtlasDocument.FillVendorAutoComplete($('#POReportdiv #txtVendorFrom'));
    AtlasDocument.FillVendorAutoComplete($('#POReportdiv #txtVendorTo'));

    REv2.Form.RenderBatchSelect({ DOM: $('#POReportdiv #ddlBatchNumber') });
    REv2.Form.RenderBatchSelect({ DOM: $('#POReportdiv #ddlBatchNumber') });

    //$('#POReportdiv #txtReportDate').val(Date1);
    let propadate = moment(new Date, 'MM/DD/YYYY').format('MM/DD/YYYY');
    $('.propadate').val(propadate);

    G_MakePeriodAutoComplete();
    G_BuildSegmentOrder();
});

/*
//========= Company
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
    for (var i = 0; i < response.length; i++) {
        $('#ddlPOFilterCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
}
*/
/*
//============Batch
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
    .done(function (response) {
        funBatchNumberFilterSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.LogError(error);
    })
}

function funBatchNumberFilterSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlPOFilterBatch').append('<option value="' + response[i].BatchNumber + '">' + response[i].BatchNumber + '</option>');
    }
    $('#ddlPOFilterBatch').multiselect({ nonSelectedText: 'Select', enableFiltering: true });
}
*/
/*
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
    .done(function (response) {
        funGetUserFilterSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funGetUserFilterSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlPOFilterUserName').append('<option value="' + response[i].UserID + '">' + response[i].Name + '</option>');
    }
    $('#ddlPOFilterUserName').multiselect();
}
*/
function funPreview(isExport) {
    //if (1 === 1) {
    //    var obj = {
    //        CompanyId: ($('#ddlPOFilterCompany').val()[0]),
    //        PeriodNoFrom: $('#txtPOFilterPeriodNoFrom').val(),
    //        PeriodNoTo: $('#txtPOFilterPeriodNoTo').val(),
    //        CreateDateFrom: ($('#txtPOFilterCreateDateFrom').val() === '') ? '01/01/2017' : $('#txtPOFilterCreateDateFrom').val(), //$('#txtPOFilterCreateDateFrom').val(),
    //        CreateDateTo: ($('#txtPOFilterCreateDateTo').val() === '') ? '01/01/2017' : $('#txtPOFilterCreateDateTo').val(), //$('#txtPOFilterCreateDateTo').val(),
    //        PoNoFrom: $('#txtPOFilterFrom').val(),
    //        PoNoTo: $('#txtPOFilterTo').val(),
    //        //  VendorId: strFinalVendor,
    //        // Batch: strFinalBatchNumber,
    //        //  POStatus: strPOStatus,
    //    }

        var ObjReportDetails = {
            ProductionName: localStorage.ProductionName,
            Company: '',
            Bank: localStorage.strBankId,
            Batch: BatchManager.BatchNumber,
            Segment: StrSegment,
            SegmentOptional: StrSegmentOptional,
            TransCode: strTransCode,
            SClassification: StrSClassification
        }
        var finalObj = {
            //objPO: obj,
            ObjRD: ObjReportDetails
        }

        //var ddlSelectText = {
        //    userName: $("#ddlPOFilterUserName option:selected").map(function () {
        //        return $(this).text();
        //    }).get().join(',').split(',')[0],
        //    vendorName: $("#ddlPOFilterVendor option:selected").map(function () {
        //        return $(this).text();
        //    }).get().join(',').split(',')[0]
        //}
    //}

    let objExport = {
        "PONumber": "PO Number",
        "tblVendorName": "Vendor Name",
        "COAString": function (COAstring) {
            let ret = {};
            $.each(COAstring.split('|'), function (key, value) {
                if (value.indexOf(">")) {
                    var DTvalue = value.split('>');
                    this[AtlasUtilities.SEGMENTS_CONFIG.sequence[key].SegmentCode] = '="' + DTvalue[DTvalue.length - 1] + '"';
                } else {
                    this[AtlasUtilities.SEGMENTS_CONFIG.sequence[key].SegmentCode] = '="' + value + '"';
                }
            }.bind(ret));
            return ret;
        },
        "SetCode": "Set",
        "TransStr": function (TransStr) {
            let objTCS = TransStr.split(',').reduce((acc, cur, i) => { let a = cur.split(':'); acc[a[0]] = a[1]; return acc; }, {});
            let ret = Object.keys(TCodes).reduce((acc, cur, i) => { acc[TCodes[cur].TransCode] = objTCS[TCodes[cur].TransCode]; return acc; }, {});
            return ret;
        },
        "TaxCode": "Tax Code",
        "LineDescription": "Line Item Description",
        "Currency": function () { return { "Currency": "USD" } },
        "CompanyPeriod": "Period",
        "POLinestatus": "PO Status",
        "PODate": "PO Date",
        "Amount_POL": "Original Amount",
        "Adjustment_POL": "Adjusted Amount",
        "NewAmount": "Open Amount",
        "BatchNumber": true
    };

    var TCodes = AtlasCache.Cache.GetItembyName('Transaction Codes');
    APIName = 'ApiUrlReportPOHistory';
    let ReportTitle = 'Purchase Order History by PO Number';
    let callingDocumentTitle = 'Reports > PO > PO History Reports';
    let APIURL = ApiUrlReportPOHistory;

    if ($('#liPOListing').attr('class') === 'active') {
        APIName = 'APIUrlReportPOListing';
        ReportTitle = 'PO Audit';
        callingDocumentTitle = 'Reports > PO > PO Audit';
        APIURL = APIUrlReportPOListing;

        //let RE = new ReportEngine(APIUrlReportPOListing);
        //RE.FormCapture('#POReportdiv');
        //if (isExport) {
        //    RE.setasExport(objExport)
        //}
        //RE.FormJSON.objPO = obj;
        //RE.FormJSON.ObjRD = ObjReportDetails;
        //RE.FormJSON.PO = finalObj;
        //RE.FormJSON.DdlSelectText = ddlSelectText;
        //RE.FormJSON.ProductionName = localStorage.ProductionName;
        //RE.isJSONParametersCall = true;
        //RE.FormJSON.EpisodeFilterID = 'POFilterEpisode';
        //RE.RunReport({ DisplayinTab: true });
    } else {
        //let RE = new ReportEngine(ApiUrlReportPOHistory);
        //RE.FormCapture('#POReportdiv');

        //if (isExport) {
        //    RE.setasExport({
        //        "PONumber": "PO Number",
        //        "tblVendorName": "Vendor Name",
        //        "COAString": function (COAstring) {
        //            let ret = {};
        //            $.each(COAstring.split('|'), function (key, value) {
        //                if (value.indexOf(">")) {
        //                    var DTvalue = value.split('>');
        //                    this[AtlasUtilities.SEGMENTS_CONFIG.sequence[key].SegmentCode] = '="' + DTvalue[DTvalue.length - 1] + '"';
        //                } else {
        //                    this[AtlasUtilities.SEGMENTS_CONFIG.sequence[key].SegmentCode] = '="' + value + '"';
        //                }
        //            }.bind(ret));
        //            return ret;
        //        },
        //        "SetCode": "Set",
        //        "TransStr": function (TransStr) {
        //            let objTCS = TransStr.split(',').reduce((acc, cur, i) => { let a = cur.split(':'); acc[a[0]] = a[1]; return acc; }, {});
        //            let ret = Object.keys(TCodes).reduce((acc, cur, i) => { acc[TCodes[cur].TransCode] = objTCS[TCodes[cur].TransCode]; return acc; }, {});
        //            return ret;
        //        },
        //        "TaxCode": "Tax Code",
        //        "LineDescription": "Line Item Description",
        //        "Currency": function () { return { "Currency": "USD" } },
        //        "CompanyPeriod": "Period",
        //        "POLinestatus": "PO Status",
        //        "PODate": "PO Date",
        //        "Amount_POL": "Original Amount",
        //        "Adjustment_POL": "Adjusted Amount",
        //        "RelievedTotal_POL": "Relieved Amount",
        //        "NewAmount": "Open Amount",
        //        "BatchNumber": true
        //    })
        //}
        //RE.FormJSON.objPO = obj;
        //RE.FormJSON.ObjRD = ObjReportDetails;
        //RE.FormJSON.PO = finalObj;
        //RE.FormJSON.DdlSelectText = ddlSelectText;
        //RE.FormJSON.ProductionName = localStorage.ProductionName;
        //RE.isJSONParametersCall = true;
        //RE.FormJSON.EpisodeFilterID = 'POFilterEpisode';
        //RE.RunReport({ DisplayinTab: true });
    }
    let RE = new ReportEngine(APIURL);
    RE.ReportTitle = ReportTitle;
    RE.callingDocumentTitle = callingDocumentTitle;
    RE.APIName = APIName;
    RE.FormCapture('#POReportdiv');
    if (isExport) {
        RE.setasExport(objExport)
    }

    RE.FormJSON.ObjRD = ObjReportDetails;
    RE.FormJSON.PO = finalObj;
    RE.FormJSON.ProductionName = localStorage.ProductionName;
    RE.isJSONParametersCall = true;
    RE.FormJSON.EpisodeFilterID = 'POFilterEpisode';
    RE.RunReport({ DisplayinTab: true });

}

function PrintBrowserPDF() {

    var PDFURL = 'POListing/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}

function ShowMSG(error) {
    console.log(error);
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
    .done(function (response) {
        funVendorFilterSucess(response);
    })
    .fail(function (error) {
        AtlasUtilities.LogError(error);
    })
    ;
}

function funVendorFilterSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#ddlPOFilterVendor').append('<option value="' + response[i].VendorID + '">' + response[i].VendorName + '</option>');
    }
    $('#ddlPOFilterVendor').multiselect({ nonSelectedText: 'Select', enableFiltering: true });
}
*/
/*
//=================Period  Autofill=====================//
function GetPeriodForPO(objDom) {

    $.ajax({
        url: APIUrlGetPeriodForPO + '?CompanyId=-1' //+ $('#ddlPOFilterCompany').val(),
        , cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetPeriodForPOSucess(response, objDom);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetPeriodForPOSucess(response, objDom) {
    StrCompanyListGet = [];
    StrCompanyListGet = response;
    var ProductListjson = response;
    var strgetcoaId = response.COAId;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ClosePeriodId,
            label: m.CompanyPeriod,
        };
    });
    $(objDom).data('aclist', array);

    $(".SearchPOPeriod").autocomplete({
        minLength: 0,
        //autoFocus: true,
        source: array,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);

            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);

            return false;
        },
        change: function (event, ui) {
            let find = $(this).data('aclist').filter(e => e.value == this.value).length;

            if (find === 0) {
                $(this).val('');
                $(this).removeAttr('name');
            }
        }
    })
}
*/
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
