
var APIUrlGetCompanyList = HOST + "/api/ReportAPI/GetCompanylistReport";
var APIUrlGetBankList = HOST + "/api/ReportAPI/GetBanklistReport";
var APIUrlfunGetJESoueceListSucess = HOST + "/api/ReportAPI/SourceCodeListing";
var APIUrlfunGetTransactionList = HOST + "/api/ReportAPI/TransactionCodeListing";

var APIUrlGetCustodianList = HOST + "/api/ReportAPI/PettyCashCustodianList";
var APIUrlGetSetList = HOST + "/api/ReportAPI/GetTblAccountDetailsByCategory";
var APIUrlGetLocationList = HOST + "/api/ReportAPI/GetLocationListing";

var showpg = 0;
var PageCnt;


var StrSegment = '';
var StrSegmentOptional = '';
var strTransCode = '';
var StrSClassification = '';
AtlasUtilities.init();
var REv2 = new ReportEngine();

$(document).ready(function () {
    $('#LiSetupReports').addClass('active');
    var retriveSegment = $.parseJSON(localStorage.ArrSegment);
    var retriveTransaction = $.parseJSON(localStorage.ArrTransaction);
    console.log(AtlasUtilities.SEGMENTS_CONFIG);
    for (var i = 0; i < retriveSegment.length; i++) {
        if (retriveSegment[i].Type == 'SegmentRequired') {
            StrSegment = StrSegment + retriveSegment[i].SegmentName + ',';
            StrSClassification = StrSClassification + retriveSegment[i].SegmentClassification + ',';
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
    StrSClassification = StrSClassification.substring(0, StrSClassification.length - 1);
    if (AtlasUtilities.SEGMENTS_CONFIG.Set || AtlasUtilities.SEGMENTS_CONFIG.SET != null)
    {
        $('#FilterSetGroup').show();
    } if (AtlasUtilities.SEGMENTS_CONFIG.LO != null) {
        $('#FilterLocationGroup').show();
    }  if (AtlasUtilities.SEGMENTS_CONFIG.EP != null) {
        $('#FilterEpisodeGroup').show();
    }
})
function ShowHide(value) {
    $('.clsFilter').hide();
    if (value == 'Company') {
        $('#DvCompanyList').show();
        $("#dialog11").css("display", "none");
    }
    else if (value == 'Bank') {
        $('#DvBankList').show();
        $("#dialog11").css("display", "none");
    }
    else if (value == 'SourceCode') {
        $('#DvSourceCode').show();
        $("#dialog11").css("display", "none");
    }
    else if (value == 'Transaction') {
        $('#DvTransactions').show();
        $("#dialog11").css("display", "none");
    }
    else if (value == 'PettyCash') {
        $('#DvCustodian').show();
        $("#dialog11").css("display", "none");
    }
    else if (value=='SetList')
    {
        $('#DvSetList').show();
        $("#dialog11").css("display", "none");
    }
    else if (value == 'Locations') {
        $('#DvLocationList').show();
        $("#dialog11").css("display", "none");
    }
    else if (value == 'Episode') {
        $('#DvEpisodeList').show();
        $("#dialog11").css("display", "none");
    }
};
//=================GetCompanyList========================//
function funComapnyList() {
    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify({
        ProdID: localStorage.ProdId,
        ProName: localStorage.ProductionName,
    });
    JSONParameters.ReportTitle = 'Company';
    JSONParameters.callingDocumentTitle = 'Reports > Setup > Company';
    let RE = new ReportEngine(APIUrlGetCompanyList, JSONParameters);
    RE.RunReport({ DisplayinTab: true });
    return;
}
function ShowMSG(error) {
    console.log(error);
    $('#preload').attr('style', 'display:none;');
}
function PrintBrowserPDF() {

    var PDFURL = 'PayrollPDF/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}
function ClosePDF() {
    $('#btnPreview').show();
    $('#btnPrint').attr('style', 'display:block;');
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');

}
//=================GetBankList=================//

function funGetBankList() {
    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify({
        ProdID: localStorage.ProdId,
        ProName: localStorage.ProductionName,
    });
    JSONParameters.ReportTitle = 'BankList';
    JSONParameters.callingDocumentTitle = 'Reports > Setup > BankList';
    let RE = new ReportEngine(APIUrlGetBankList, JSONParameters);
    RE.RunReport({ DisplayinTab: true });
    return;
}
//=================JE Source Code List=================//
function funGetJESoueceList() {
    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify({
        ProdID: localStorage.ProdId,
        ProName: localStorage.ProductionName,
    });
    JSONParameters.ReportTitle = 'JE Source Code List';
    JSONParameters.callingDocumentTitle = 'Reports > Setup > JE Source Code List';
    let RE = new ReportEngine(APIUrlfunGetJESoueceListSucess, JSONParameters);
    RE.RunReport({ DisplayinTab: true });
    return;
}
//=================Transaction Code List=================//
function funGetTransactionList() {
    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify({
        ProdID: localStorage.ProdId,
        ProName: localStorage.ProductionName,
    });
    JSONParameters.ReportTitle = 'Transaction Code List';
    JSONParameters.callingDocumentTitle = 'Reports > Setup > Transaction Code List';
    let RE = new ReportEngine(APIUrlfunGetTransactionList, JSONParameters);
    RE.RunReport({ DisplayinTab: true });
    return;
}
//=================Custodian Code List=================//

function funGetCustodianList() {

    var ObjReportDetails = {
        ProductionName: localStorage.ProductionName,
        Company: '',
        Bank: localStorage.strBankId,
        Batch: BatchManager.BatchNumber,
        UserName: localStorage.UserId,
        Segment: StrSegment,
        SegmentOptional: StrSegmentOptional,
        TransCode: strTransCode,
        SClassification: StrSClassification,
    }
    var finalobj = {
        objRD: ObjReportDetails,
        ProdId: localStorage.ProdId
    }

    $("#preload").css("display", "block");
    $.ajax({
        url: APIUrlGetCustodianList, //+ '?ProdID=' + localStorage.ProdId + '&ProName=' + localStorage.ProductionName,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        data: JSON.stringify(finalobj),
        contentType: 'application/json; charset=utf-8',

    })
     .done(function (response)
     { funGetCustodianListSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function funGetCustodianListSucess(response) {
    if (response == '') {
        alert('Data not found for given Values.');
    }
    else {
        heightt = $(window).height();
        heightt = heightt - 180;
        $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');
        var fileName = response;
        GlobalFile = fileName;
        $('#dvFilterDv').attr('style', 'display:none');
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'SetupReports/' + fileName;
        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF();" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);

        $('#fade').hide();
        $("#preload").css("display", "none");
    }
}

//=================SetList=================//

function funGetSetList() {
    var StrSegType = 'set';
    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify({
        ProdID: localStorage.ProdId,
        ProName: localStorage.ProductionName,
        Category: StrSegType
    });
    JSONParameters.ReportTitle = 'SetList';
    JSONParameters.callingDocumentTitle = 'Reports > Setup > SetList';
    let RE = new ReportEngine(APIUrlGetSetList, JSONParameters);
    RE.RunReport({ DisplayinTab: true });
    return;
}
//=================Location Listing=================//

function funGetLocation() {
    var StrSegType = 'Location';
    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify({
        ProdID: localStorage.ProdId,
        ProName: localStorage.ProductionName,
        Category: StrSegType
    });
    JSONParameters.ReportTitle = 'Location Listing';
    JSONParameters.callingDocumentTitle = 'Reports > Setup > Location Listing';
    let RE = new ReportEngine(APIUrlGetLocationList, JSONParameters);
    RE.RunReport({ DisplayinTab: true });
    return;
}
//=================Episode Listing=================//

function funGetEpisode() {
    var StrSegType = 'Episode';
    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify({
        ProdID: localStorage.ProdId,
        ProName: localStorage.ProductionName,
        Category: StrSegType
    });
    JSONParameters.ReportTitle = 'Episode Listing';
    JSONParameters.callingDocumentTitle = 'Reports > Setup > Episode Listing';
    let RE = new ReportEngine(APIUrlGetLocationList, JSONParameters);
    RE.RunReport({ DisplayinTab: true });
    return;
}