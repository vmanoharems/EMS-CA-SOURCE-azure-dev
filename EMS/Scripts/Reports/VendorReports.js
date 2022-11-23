var APIUrlVendorListingReport = HOST + "/api/ReportAPI/GetReportVendorList";
var APIUrlGetVenCompanyCode = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetStateList = HOST + "/api/CompanySettings/GetStateListByCountryId";
var APIUrlFunVendorFolder = HOST + "/api/ReportAPI/GetReportVendorFolder";
var APIUrlVendorMailing = HOST + "/api/ReportAPI/GetVendorMailingLabels";
var APIUrlFunVendorInquiry = HOST + "/api/ReportAPI/VendorInquiryReport";
var APIUrlGetCompanyCodeVenInq = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetVendorInqStateList = HOST + "/api/CompanySettings/GetStateListByCountryId";
var APIUrlVendorDetails = HOST + "/api/ReportAPI/GetVendorDetails";
var GetCountryListVar = [];
var VendorNameArr = [];
var VendorTypeArr = [];
var getVendorCountry = [];
var getVendorStateRemit = [];
var StrSegment = '';
var StrSegmentOptional = '';
var strTransCode = '';
var StrSClassification = '';
AtlasUtilities.init();
var REv2 = new ReportEngine();
$(document).ready(function () {
    $('#DvVendorListFilter').show();
    $(".datepicker").datepicker({
        onSelect: function (dateText, inst) {
            this.focus();
        }
    });
  
    // $('#txtVendorTypes').multiselect();
    $('#txtVendorListPeportDate').focus();
    GetCompanyCodeVenInq();
    //funVendorName();
    GetCompanyCode();
    G_FillCountryAutoComplete($('#txtVendorCountry'));
    G_FillCountryAutoComplete($('#txtVendorInqCountry'));
    
    //FillAutoCountrySuccess(cntryList);
    //FillAutoCountryVenInqSuccess(cntryList);
    // VendorListing();
    $('#txtVendorNameFrom').val('');
    $('#txtVendorNameTo').val('');
    $('#LiVendorsReports').addClass('active');
    // $('#txtBibleFilterLocation').bind(strVendorTypes);

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;

    var curr_year = d.getFullYear();
    if (curr_date.toString().length === 1) {
        curr_date = '0' + curr_date;
    }

    if (curr_month.toString().length === 1) {
        curr_month = '0' + curr_month;
    }

    var Date1 = curr_month + '/' + curr_date + '/' + curr_year;

    $('#txtVendorCreatedTo').val(Date1);
    $('#txtVendorModDateTo').val(Date1);
    $('#txtVendorListPeportDate').val(Date1);
    $('#txtVendorInqPeportDate').val(Date1);

    $('#txtVendorInqCreatedTo').val(Date1);
    heightt = $(window).height();
    heightt = heightt - 180;
    $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
    $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');


    var retriveSegment = $.parseJSON(localStorage.ArrSegment);
    var retriveTransaction = $.parseJSON(localStorage.ArrTransaction);

    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type == 'SegmentRequired') {
            StrSegment = StrSegment + retriveSegment[i].SegmentName + ',';
            StrSClassification = StrSClassification + retriveSegment[i].SegmentClassification + ',';
        } else {
            StrSegmentOptional = StrSegmentOptional + retriveSegment[i].SegmentName + ',';
        }
    }
    for (var i = 0; i < retriveTransaction.length; i++) {
        strTransCode = strTransCode + retriveTransaction[i].TransCode + ',';
    }

    StrSegment = StrSegment.substring(0, StrSegment.length - 1);
    StrSegmentOptional = StrSegmentOptional.substring(0, StrSegmentOptional.length - 1);
    strTransCode = strTransCode.substring(0, strTransCode.length - 1);
    StrSClassification = StrSClassification.substring(0, StrSClassification.length - 1);

    //VendorList Company segmentJson
    let VLSegmentJSON = AtlasUtilities.SegmentJSON(
        {
            "Company": {
                fillElement: '#txtVendorCompany'
            }
            , "Location": {
                fillElement: '#VLFilterLocation'
                , ElementGroupID: '#VLFilterLocationGroup'
                , ElementGroupLabelID: '#VLFilterLocationLabel'
            }
            , "Episode": {
                fillElement: '#VLFilterEpisode'
                , ElementGroupID: '#VLFilterEpisodeGroup'
                , ElementGroupLabelID: '#VLFilterEpisodeLabel'
            }
            , "Set": {
                fillElement: '#VLFilterFilterSet'
                , ElementGroupID: '#VLFilterSetGroup'
                , ElementGroupLabelID: '#VLFilterSetLabel'
            }
        }
    );
    VLSegmentJSON.Company.elementConfig.ignoreselectsingle = true;
    VLSegmentJSON.Location.elementConfig.ignoreselectsingle = true;
    VLSegmentJSON.Episode.elementConfig.ignoreselectsingle = true;
    VLSegmentJSON.Set.elementConfig.ignoreselectsingle = true;

    REv2.FormRender(VLSegmentJSON);

    //VendorInquery Company segmentJson
    let VISegmentJSON = AtlasUtilities.SegmentJSON(
        {
            "Company": {
                fillElement: '#txtVendorInqCompany'
            }
            , "Location": {
                fillElement: '#VIFilterLocation'
                , ElementGroupID: '#VIFilterLocationGroup'
                , ElementGroupLabelID: '#VIFilterLocationLabel'
            }
            , "Episode": {
                fillElement: '#VIFilterEpisode'
                , ElementGroupID: '#VIFilterEpisodeGroup'
                , ElementGroupLabelID: '#VIFilterEpisodeLabel'
            }
            , "Set": {
                fillElement: '#VIFilterFilterSet'
                , ElementGroupID: '#VIFilterSetGroup'
                , ElementGroupLabelID: '#VIFilterSetLabel'
            }
        }
    );
    REv2.FormRender(VISegmentJSON);

    //REv2.Form.RenderMemoCodes('additionalfilters', 'fieldsetMC');
});

//--------   Country list 12/25/2015----------------------//
function FillAutoCountrySuccess(response) {
    GetCountryListVar = [];
    getVendorCountry = response;
    GetCountryListVar = response;
    var ProductListjson = GetCountryList();
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.ID,
            label: m.name,
            //value: m.CountryCode,
            //label: m.CountryName,
        };
    });
    $(".searchCountry").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnVendorCountry").val(ui.item.value);
            $('#txtVendorCountry').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnVendorCountry").val(ui.item.value);
            $('#txtVendorCountry').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$("#hdnVendorCountry").val('');
                //$('#txtVendorCountry  ').val('');
            }
        }
    })
}

function ShowHide(value) {
    $('.clsFilter').hide();
    $('.clsdivFilter').hide();
    if (value == 'VendorList') {
        //EmptyFilter();
        $('#DvVendrList').show();
        $('#DvVendorListFilter').show();       
    } else if (value == 'VendorLabel') {
        //EmptyFilter();
        $('#DvVendorListFilter').show();
        $('#DvVendrFolder').show();
    } else if (value == 'VendorMailing') {
        //EmptyFilter();
        $('#DvVendorListFilter').show();
        $('#DvVendorMailing').show();
    } else if (value == 'VendorInquiry') {
        $('#DvVendrInquiryheader').show();
        $('#DvVendorInquiry').show();
    } else if (value == 'VendorDetails') {
        //$('#DvVendorListFilter').show();
        $('#DvVendorInquiry').show();
        $('#DvVendorDetails').show();
    } else {
        $('#DvVendorListFilter').show();
    }
};

//=================Company Autofill=====================//
function GetCompanyCode() {
    $.ajax({
        url: APIUrlGetVenCompanyCode + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetCompanyCodeSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetCompanyCodeSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#txtVendorCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }  ///txtVendorCompany

}

//=================Error Message====================//
function ShowMSG(error) {
    console.log(error);
}

function PrintBrowserPDF(value) {
    var PDFURL = '' + value + '/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#dialog11').attr('style', 'display:none;');
    //   $('#dvFilterDv').attr('style', 'display:block');
    $('#dialog11').html('');
    $('#preload').html('');
}

//================Vendor Listing======================//
function VendorListing() {
    var strVendorType = $('#txtVendorTypes').val();
    var strFinalVendorType = '';
    if (strVendorType == null) {
        strVendorType = '';
    } else {
        for (var i = 0; i < strVendorType.length; i++) {
            strFinalVendorType = strFinalVendorType + ',' + strVendorType[i]
        }
    }

    var objVenFilter = {
        ProdID: parseInt(localStorage.ProdId),
        VendorFrom: $('#txtVendorNameFrom').val(),
        VendorTo: $('#txtVendorNameTo').val(),
        CompanyCode: $('#txtVendorCompany').val(),
        createdDateFrom: $('#txtVendorCreatedFrom').val(),
        CreatedDateTo: $('#txtVendorCreatedTo').val(),
        VendorType: strFinalVendorType,
        VendorCountry: $('#txtVendorCountry').val(),
        VendorState: $('#txtVendorState').val(),
        DefaultDropdown:'',
        W9OnFile: $('#txtVendorW9OnFile').prop('checked'),
        W9NotOnFile: $('#txtVendorNotOnFile').prop('checked')
    }
    var ObjVen = {
        ProductionName: localStorage.ProductionName,
        Company: '',
        Bank: localStorage.strBankId,
        Batch: BatchManager.BatchNumber,
        UserName: localStorage.UserId,
        Segment: '',
        SegmentOptional: '',
        TransCode: '',

    }
    var finalObj = {
        objRDF: objVenFilter,
        objRD: ObjVen
    }

    APIName = 'APIUrlVendorListingReport';
    let RE = new ReportEngine(APIUrlVendorListingReport + '?ProdID=' + localStorage.ProdId);
    RE.ReportTitle = 'Vendor Listing';
    RE.callingDocumentTitle = 'Reports > Vendors > VendorListing';
    RE.FormCapture('#DvVendorListFilter');
    //RE.FormJSON.objRDF = objVenFilter;
    //RE.FormJSON.objRD = ObjVen;
    RE.FormJSON.VL = finalObj;
    RE.FormJSON.ProdId = localStorage.ProdId;
    RE.FormJSON.UserId = localStorage.UserId;
    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });
    return;
}

function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}

function PrintVendorPDFSucess(response) {
    if (response == '') {
        alert(' No Records Found for the search Criteria');
    } else {
        $('#btnPreview').hide();
        var fileName = response;
        GlobalFile = fileName;
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'VendorListing/' + fileName;
        // $('#dialog11').html('<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>');   
        $('#dvFilterDv').attr('style', 'display:none');

        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF(\'VendorListing\');" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);

    }
    $('#dvWait').attr('style', 'display:none;');
    $('#preload').attr('style', 'display:none;');
}

/*
function GetStateList() {
    var strValue = $('#txtVendorCountry').attr('name');
    //var strValue = -1;
    //if ($('#hdnVendorCountry').val() != 0) {
    //    strValue = $('#hdnVendorCountry').val()
    //}

    $.ajax({
        url: APIUrlGetStateList + '?CountryID=' + strValue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetStateListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetStateListSucess(response) {
    GetStateListVar = [];
    GetStateListVar = response;
    getVendorStateRemit = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.StateID,
            label: m.StateName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchState").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            //   $("#hdnBankCountry").val(ui.item.value);
            $('#txtVendorState').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            //  $("#hdnBankCountry").val(ui.item.value);
            $('#txtVendorState').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                // $('#f').val('');
                //  $("#hdnBankCountry").val('');
                $('#txtVendorState  ').val('');
            }
        }
    })
}
*/

function ShowMSG(error) {
    console.log(error);
    $('#preload').attr('style', 'display:none;');
}

function ClosePDF() {
    $('#btnPreview').show();
    $('#btnPrint').attr('style', 'display:block;');
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}

//================VendorFolder Report======================//
function FunVendorFolder() {
    var strVendorType = $('#txtVendorTypes').val();
    var strFinalVendorType = '';
    if (strVendorType == null) {
        strVendorType = '';
    } else {
        for (var i = 0; i < strVendorType.length; i++) {
            strFinalVendorType = strFinalVendorType + ',' + strVendorType[i]
        }
    }

    var objVenFilter = {
        ProdID: parseInt(localStorage.ProdId),
        VendorFrom: $('#txtVendorNameFrom').val(),
        VendorTo: $('#txtVendorNameTo').val(),
        CompanyCode: $('#txtVendorCompany').val(),
        createdDateFrom: ($('#txtVendorCreatedFrom').val() === '') ? '01/01/2017' : $('#txtVendorCreatedFrom').val(),
        CreatedDateTo: ($('#txtVendorCreatedTo').val() === '') ? '01/01/2017' : $('#txtVendorCreatedTo').val(),
        VendorType: strFinalVendorType,
        VendorCountry: $('#txtVendorCountry').val(),
        VendorState: $('#txtVendorState').val(),
        W9OnFile: $('#txtVendorW9OnFile').prop('checked'),
        W9NotOnFile: $('#txtVendorNotOnFile').prop('checked')
    }

    var ObjVen =
        {
            ProductionName: localStorage.ProductionName,
            Company: '',
            Bank: localStorage.strBankId,
            Batch: BatchManager.BatchNumber,
            UserName: localStorage.UserId,
            Segment: '',
            SegmentOptional: '',
            TransCode: '',

        }
    var finalObj =
        {
            objRDF: objVenFilter,
            objRD: ObjVen
        }
    APIName = 'APIUrlFunVendorFolder';
    let RE = new ReportEngine(APIUrlFunVendorFolder + '?ProdID=' + localStorage.ProdId);
    RE.ReportTitle = 'Vendor Folder';
    RE.callingDocumentTitle = 'Reports > Vendors > Vendor Folder';
    RE.FormCapture('#DvVendorListFilter');
    RE.FormJSON.VenFol = finalObj;
    RE.FormJSON.ProdId = localStorage.ProdId;
    RE.FormJSON.UserId = localStorage.UserId;
    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });
}

function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}

function FunVendorFolderSucess(response) {
    if (response == '') {
        alert(' No Records Found for the search Criteria');
    } else {
        $('#dialog11').attr('style', 'display:block;');
        $('#btnPreview').hide();
        var fileName = response;
        GlobalFile = fileName;
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'VendorFolder/' + fileName;
        $('#dvFilterDv').attr('style', 'display:none');
        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF(\'VendorFolder\');" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);
    }
    $('#dvWait').attr('style', 'display:none;');
    $('#preload').attr('style', 'display:none;');
}

//================VendorMailing Label Report======================//
function FunVendorMailing() {
    var strVendorType = $('#txtVendorTypes').val();
    var strFinalVendorType = '';
    if (strVendorType == null) {
        strVendorType = '';
    } else {
        for (var i = 0; i < strVendorType.length; i++) {
            strFinalVendorType = strFinalVendorType + ',' + strVendorType[i]
        }
    }
    var objVenFilter = {
        ProdID: parseInt(localStorage.ProdId),
        VendorFrom: $('#txtVendorNameFrom').val(),
        VendorTo: $('#txtVendorNameTo').val(),
        CompanyCode: $('#txtVendorCompany').val(),
        createdDateFrom: ($('#txtVendorCreatedFrom').val() === '') ? '01/01/2017' : $('#txtVendorCreatedFrom').val(),
        CreatedDateTo: ($('#txtVendorCreatedTo').val() === '') ? '01/01/2017' : $('#txtVendorCreatedTo').val(),
        VendorType: strFinalVendorType,
        VendorCountry: $('#txtVendorCountry').val(),
        VendorState: $('#txtVendorState').val(),
        W9OnFile: $('#txtVendorW9OnFile').prop('checked'),
        W9NotOnFile: $('#txtVendorNotOnFile').prop('checked')
    }

    var ObjVen = {
        ProductionName: localStorage.ProductionName,
        Company: '',
        Bank: localStorage.strBankId,
        Batch: BatchManager.BatchNumber,
        UserName: localStorage.UserId,
        Segment: '',
        SegmentOptional: '',
        TransCode: '',

    }
    var finalObj = {
        objRDF: objVenFilter,
        objRD: ObjVen
    }
    APIName = 'APIUrlVendorMailing';
    let RE = new ReportEngine(APIUrlVendorMailing + '?ProdID=' + localStorage.ProdId);
    RE.ReportTitle = 'Vendor Mailing Labels';
    RE.callingDocumentTitle = 'Reports > Vendors > VendorMailing';
    RE.FormCapture('#DvVendorListFilter');
    RE.FormJSON.VenMail = finalObj;
    RE.FormJSON.ProdId = localStorage.ProdId;
    RE.FormJSON.UserId = localStorage.UserId;
    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });
}

function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}

function FunVendorMailingSucess(response) {
    if (response == '') {
        alert(' No Records Found for the search Criteria');
    } else {
        $('#btnPreview').hide();
        var fileName = response;
        GlobalFile = fileName;
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'VendorMailing/' + fileName;
        $('#dvFilterDv').attr('style', 'display:none');
        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF(\'VendorMailing\');" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);
    }
    $('#dvWait').attr('style', 'display:none;');
    $('#preload').attr('style', 'display:none;');
}

//function EmptyFilter() {
//    $('#txtVendorNameFrom').val('');
//    $('#txtVendorNameTo').val('');
//    $('#txtVendorCompany').val('');
//    $('#txtVendorCreatedFrom').val('');
//    $('#txtVendorTrnsFrom').val('');
//    $('#txtVendorCountry').val('');
//    $('#txtVendorState').val('');

//    $('#txtVendorTypes').attr('checked', false);
//}
function W9Onfile() {
    if ($('#txtVendorNotOnFile').is(':checked')) {
        $('#txtVendorNotOnFile').prop("checked", false);
    } else {
        // $('#ChkWarning').prop("disabled", false);
    }

}

function W9NotOnfile() {
    if ($('#txtVendorW9OnFile').is(':checked')) {
        $('#txtVendorW9OnFile').prop("checked", false);
    } else {
        // $('#ChkRequired').prop("disabled", false);
    }
}

function funVendorinquiry(isExport) {
    var strVendorType = $('#txtVendorInquiryTypes').val();
    var strFinalVendorType = '';
    if (strVendorType === null) {
        strVendorType = '';
    } else {
        for (var i = 0; i < strVendorType.length; i++) {
            strFinalVendorType = strFinalVendorType + ',' + strVendorType[i]
        }
    }

    var strDefaultType = $('#ddl1099Multiselect').val();
    var strFinalDefaultType = '';
    if (strDefaultType === null) {
        strDefaultType = '';
    } else {
        for (var i = 0; i < strDefaultType.length; i++) {
            strFinalDefaultType = strFinalDefaultType + ',' + strDefaultType[i]
        }
    }

    var objVenFilter = {
        ProdID: parseInt(localStorage.ProdId),
        VendorFrom: $('#txtVendorInqNameFrom').val(),
        VendorTo: $('#txtVendorInqNameTo').val(),
        CompanyCode:$('#txtVendorInqCompany').val(),
        createdDateFrom: $('#txtVendorInqCreatedFrom').val(),
        CreatedDateTo: $('#txtVendorInqCreatedTo').val(),
        VendorType: strFinalVendorType,
        VendorCountry: $('#txtVendorInqCountry').val(),
        VendorState: $('#txtVendorInqState').val(),
        DefaultDropdown: strFinalDefaultType,
        W9OnFile: $('#txtVendorInqW9OnFile').prop('checked'),
        W9NotOnFile: $('#txtVendorInqNotOnFile').prop('checked')
    }
    var ObjVen = {
        ProductionName: localStorage.ProductionName,
        Company: '',
        Bank: localStorage.strBankId,
        Batch: BatchManager.BatchNumber,
        UserName: localStorage.UserId,
        Segment: StrSegment,
        SegmentOptional: StrSegmentOptional,
        TransCode: strTransCode,
        SClassification: StrSClassification
    }
    var finalObj = {
        objRDF: objVenFilter,
        objRD: ObjVen
    }

    let TCodes = AtlasCache.Cache.GetItembyName('Transaction Codes');
    APIName = 'APIUrlFunVendorInquiry';
    let RE = new ReportEngine(APIUrlFunVendorInquiry + '?ProdID=' + localStorage.ProdId);
    RE.ReportTitle = 'Vendor Inquiry';
    RE.callingDocumentTitle = 'Reports > Vendors > VendorInquiry';
    RE.FormCapture('#DvVendorInquiry');

    if (isExport) {
        RE.setasExport({
            "vendorname": "Vendor Name",
            "VendorNumber": "Vendor Code",
            "Type": "Vendor Type",
            "checkNumber": "Payment",
            "InvoiceNumber": "Invoice",
            "HeaderDescription": function (HDescription) {
                return {
                    "Description": HDescription
                }
            },
            "BankName": "Bank",
            "CUR": function () {
                return {
                    "Currency": "USD"
                }
            },
            "CheckDate": function (CheckDate) {
                return { "Check Date": CheckDate.split('T')[0] }
            },
            "InvoiceTotal": "Invoice Total",
            "TransactionNumber": "Transaction #",
            "AP": function () { return { "Transaction Type": "AP" } },
            "COAstring": function (COAS) {
                return RE.ExportFunctions.COAStohash(COAS);
            },
            "TransStr": function (TransStr) {
                let objTCS = TransStr.split(',').reduce((acc, cur, i) => { let a = cur.split(':'); acc[a[0]] = a[1]; return acc; }, {});
                let ret = Object.keys(TCodes).reduce((acc, cur, i) => { acc[TCodes[cur].TransCode] = objTCS[TCodes[cur].TransCode]; return acc; }, {});
                return ret;
            },
            //"Memo": "Memo Codes",
            "TaxCode": "Tax Code (1099)",
            "CompanyPeriod": "Period",
            "PONumber": "PO #",
            "LineItemDescription": function (LineDe,h) {
                return {
                    "Line Item Description": h.LineDescription
                }
            }, 
            "LineAmount": "Line Item Amount"
        });
    }

    RE.FormJSON.VI = finalObj;
    RE.FormJSON.ProdId = localStorage.ProdId;
    RE.FormJSON.UserId = localStorage.UserId;
    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });
}

function funVendorinquirySucess(response) {
    if (response == '') {
        alert('Data not found for given Values.');
    } else {
        heightt = $(window).height();
        heightt = heightt - 180;
        $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');
        var fileName = response;
        GlobalFile = fileName;
        $('#dvFilterDv').attr('style', 'display:none');
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'Vendor/' + fileName;
        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF(\'Vendor\');" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);
        $('#fade').hide();
        $("#preload").css("display", "none");
    }
    $("#preload").css("display", "none");
}

$('#txtVendorState').focusout(function () {
    $('#txtVendorW9OnFile').focus();
})

$('#txtVendorNotOnFile').focusout(function () {
    $('#btn').focus();
})

//===================================================//
$('#txtVendorCountry').blur(function () {
    var StrCountryVenRemit = $('#txtVendorCountry').val().trim();
 
    if (StrCountryVenRemit != '') {
        for (var i = 0; i < getVendorCountry.length; i++) {
            if ((getVendorCountry[i].name).toLowerCase() == (StrCountryVenRemit).toLowerCase()) {
                $('#hdnVendorCountry').val(getVendorCountry[i].ID);
                $('#txtVendorCountry').val(getVendorCountry[i].name);
                break;
            } else {
                $('#hdnVendorCountry').val('');
                $('#txtVendorCountry').val('');
            }
        }
        for (var i = 0; i < getVendorCountry.length; ++i) {
            if (getVendorCountry[i].name.substring(0, StrCountryVenRemit.length).toLowerCase() === StrCountryVenRemit.toLowerCase()) {
                $('#hdnVendorCountry').val( getVendorCountry[i].ID);
                $('#txtVendorCountry').val(getVendorCountry[i].name);
                break;
            }
        }
    } else {
    }
})

$('#txtVendorState').blur(function () {

    var StrStateVenRemit = $('#txtVendorState').val().trim();

    if (StrStateVenRemit != '') {
        for (var i = 0; i < getVendorStateRemit.length; i++) {
            if ((getVendorStateRemit[i].StateName).toLowerCase() == StrStateVenRemit.toLowerCase()) {
                $('#txtVendorState').val(getVendorStateRemit[i].StateName);
                $('#txtVendorState').attr('name', getVendorStateRemit[i].StateID);
                break;
            } else {
                $('#txtVendorState').val('');
                $('#txtVendorState').removeAttr('name');
            }
        }
        for (var i = 0; i < getVendorStateRemit.length; ++i) {
            if (getVendorStateRemit[i].StateName.substring(0, StrStateVenRemit.length).toLowerCase() === StrStateVenRemit.toLowerCase()) {
                $('#txtVendorState').val(getVendorStateRemit[i].StateName);
                $('#txtVendorState').attr('name', getVendorStateRemit[i].StateID);
                break;
            }
        }
    } else {
        //$('#txtVendorState').val(getVendorStateRemit[0].StateName);
        //$('#txtVendorState').attr('name', getVendorStateRemit[0].StateID);
    }

})

$('#txtVendorListPeportDate').change(function () {
    $('#txtVendorNameFrom').focus();
});

$('#txtVendorCreatedFrom').change(function () {
    $('#txtVendorCreatedTo').focus();
});
$('#txtVendorCreatedTo').change(function () {
    $('#txtVendorTypes').focus();
});

//===================vendorInquiry COmpany==============//
function GetCompanyCodeVenInq() {
    $.ajax({
        url: APIUrlGetCompanyCodeVenInq + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetCompanyCodeVenInqSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetCompanyCodeVenInqSucess(response) {
    for (var i = 0; i < response.length; i++) {
        $('#txtVendorInqCompany').append('<option value=' + response[i].CompanyID + '>' + response[i].CompanyCode + '</option>');
    }
}

//===============VendorInquiryState============//
/*
function FillAutoCountryVenInqSuccess(response) {
    GetCountryListVar = [];
    getVendorCountry = response;
    GetCountryListVar = response;
    var ProductListjson = GetCountryList();
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CountryCode,
            label: m.CountryName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".searchCountryInq").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $("#hdnVendorInqCountry").val(ui.item.value);
            $('#txtVendorInqCountry').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            $("#hdnVendorInqCountry").val(ui.item.value);
            $('#txtVendorInqCountry').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}
*/

/*
function GetStateVendorInq() {
    var strValue = -1;
    if ($('#hdnVendorInqCountry').val() != 0) {
        strValue = $('#hdnVendorInqCountry').val()
    }

    $.ajax({
        url: APIUrlGetVendorInqStateList + '?CountryID=' + strValue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetStateListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetStateListSucess(response) {
    GetStateListVar = [];
    GetStateListVar = response;
    getVendorStateRemit = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.StateID,
            label: m.StateName,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchStateVenInq").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            //   $("#hdnBankCountry").val(ui.item.value);
            $('#txtVendorInqState').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            //  $("#hdnBankCountry").val(ui.item.value);
            $('#txtVendorInqState').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                ////  $("#hdnBankCountry").val('');
                //$('#txtVendorState  ').val('');
            }
        }
    })
}
*/
//==============VendorDetails====================//
function FunVendorDetails(isExport) {
    if (1 === 1) {
        var strVendorType = $('#txtVendorTypes').val();
        var strFinalVendorType = '';
        if (strVendorType == null) {
            strVendorType = '';
        } else {
            for (var i = 0; i < strVendorType.length; i++) {
                strFinalVendorType = strFinalVendorType + ',' + strVendorType[i]
            }
        }

        var strDefault1099 = $('#ddl1099Multiselect').val();
        var strFinalDefault1099 = '';
        if (strDefault1099 == null) {
            strDefault1099 = '';
        } else {
            for (var i = 0; i < strDefault1099.length; i++) {
                strFinalDefault1099 = strFinalDefault1099 + ',' + strDefault1099[i]
            }
        }

        var objVenFilter = {
            ProdID: parseInt(localStorage.ProdId),
            VendorFrom: $('#txtVendorInqNameFrom').val(),
            VendorTo: $('#txtVendorInqNameTo').val(),
            CompanyCode: $('#txtVendorInqCompany').val(), //!=null ?$('#txtVendorInqCompany').val()[0]:0,
            createdDateFrom: $('#txtVendorInqCreatedFrom').val(),
            CreatedDateTo: $('#txtVendorInqCreatedTo').val(),
            VendorType: strFinalVendorType,
            VendorCountry: $('#txtVendorInqCountry').val(),
            VendorState: $('#txtVendorInqState').val(),
            DefaultDropdown: strFinalDefault1099,
            W9OnFile: $('#txtVendorInqW9OnFile').prop('checked'),
            W9NotOnFile: $('#txtVendorInqNotOnFile').prop('checked')
        }

        var ObjVen = {
            ProductionName: localStorage.ProductionName,
            Company: '',
            Bank: localStorage.strBankId,
            Batch: BatchManager.BatchNumber,
            UserName: localStorage.UserId,
            Segment: '',
            SegmentOptional: '',
            TransCode: '',

        }
        var finalObj = {
            objRDF: objVenFilter,
            objRD: ObjVen
        }
    }
    APIName = 'APIUrlVendorDetails';
    let RE = new ReportEngine(APIUrlVendorDetails + '?ProdID=' + localStorage.ProdId);
    RE.ReportTitle = 'Vendor Details';
    RE.callingDocumentTitle = 'Reports > Vendors > VendorDetails';
    RE.FormCapture('#DvVendorInquiry');
    if (isExport) {
        RE.setasExport(
            {
                'VendorNumber': 'Vendor Number'
                , 'VendorName': 'Vendor Name'
                , 'FirstName': 'First Name'
                , 'MiddleName': 'Middle Name'
                , 'LastName': 'Last Name'
                , 'PrintonCheck': 'Print on Check'
                , 'W9Country': 'W9 Country'
                , 'W9Address1': 'W9 Address 1'
                , 'W9Address2': 'W9 Address 2'
                , 'W9Address3': 'W9 Address 3'
                , 'W9City': 'W9 City'
                , 'W9State': 'W9 State'
                , 'W9PostalCode': 'W9 Postal Code'
                , 'RemitCountry': 'Remit Country'
                , 'RemitAddress1': 'Remit Address 1'
                , 'RemitAddress2': 'Remit Address 2'
                , 'RemitAddress3': 'Remit Address 3'
                , 'RemitCity': 'Remit City'
                , 'RemitState': 'Remit State'
                , 'RemitPostalCode': 'Remit Postal Code'
                , 'Currency': true
                , 'VendorType': 'Vendor Type'
                , 'TaxFormonFile': 'Tax Form on File'
                , 'TaxForm': 'Tax Form'
                , 'TaxName': 'Tax Name'
                , 'Active': true
            }
        )
        ;
    }
    RE.FormJSON.VenDetail = finalObj;
    RE.FormJSON.ProdId = localStorage.ProdId;
    RE.FormJSON.UserId = localStorage.UserId;
    RE.isJSONParametersCall = true;
    RE.RunReport({ DisplayinTab: true });
}

function ShowMSG(error) {
    console.log(error);
    $("#preload").css("display", "none");
}

function VendorDetailsSucess(response) {
    if (response == '') {
        alert(' No Records Found for the search Criteria');
    } else {
        $('#btnPreview').hide();
        var fileName = response;
        GlobalFile = fileName;
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'VendorDetails/' + fileName;
        // $('#dialog11').html('<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>');   
        $('#dvFilterDv').attr('style', 'display:none');

        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF(\'VendorDetails\');" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);
    }
    $('#dvWait').attr('style', 'display:none;');
    $('#preload').attr('style', 'display:none;');
}

