var HOST = window.location.protocol + '://' + window.location.host;
if (window.location.hostname === 'localhost') {
    HOST = '';
} else {
    HOST = '';
}

//-------------------------- API

//var APIUrlLoginDetails = HOST + "/api/CompanySettings/GetUserDetails";
var APIUrlLoginAdminDetails = HOST + "/api/AdminLogin/GetUserDetailsAdmin";

var APIUrlProductionList = HOST + "/api/AdminLogin/GetProdcutionListByUserId";
var APIUrlfunGetDBName = HOST + "/api/AdminLogin/GetDBConfigByProdId";
var APIUrlGenrateAPIKey = HOST + "/api/AdminLogin/UpdateAPIKeyToken";
//var APIUrlGetBatchNumber = HOST + "/api/AdminLogin/GetBatchNumber";
var APIUrlGetVendoreByProdId = HOST + "/api/AccountPayableOp/GetVendorListByProdID";


var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode";
var APIUrlGetMyDefaultsInfo = HOST + "/api/UserProfile/GetMyDefaultsByProdId";

var StrUserInfo = "";

var objLogin = {
    ConnecttoDB: function () {
        let waitKEY = [];
        let waitvar = [];

        AtlasUtilities.CallAjaxPost(
            APIUrlfunGetDBName + '?ProdId=' + localStorage.ProdId
            , false
            , funGetDBNameSucess
            , AtlasUtilities.LogError
            , { async: false }
        );

        waitKEY = AtlasUtilities.CallAjaxPost(
            APIUrlGenrateAPIKey + '?UserId=' + localStorage.UserId + '&Email=' + $('#txtEmail').val() + '&DBName=' + localStorage.DBName
            , false
            , funGenrateAPIKeySucess
            , AtlasUtilities.LogError
            , { async: false }
        );

        $.when(waitKEY).done(
            function() {
                let waitvar = []
                //waitvar.push(
                //    AtlasUtilities.CallAjaxPost(
                //        APIUrlGetBatchNumber + '?UserId=' + localStorage.UserId + '&ProdId=' + localStorage.ProdId
                //        , false
                //        , GetBatchNumberSucess
                //        , AtlasUtilities.LogError
                //        , { async: false }
                //    ))
                //;

                waitvar.push(
                    AtlasUtilities.CallAjaxPost(
                        APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 0
                        , false
                        , GetSegmentListSucess
                        , AtlasUtilities.LogError
                        , { async: false }
                    ))
                ;
                waitvar.push(
                    AtlasUtilities.CallAjaxPost(
                        APIUrlGetTransactionCode + '?ProdId=' + localStorage.ProdId
                        , false
                        , GetTransactionCodeSucess
                        , AtlasUtilities.LogError
                        , { async: false }
                    ))
                ;

        });

        AtlasCache.init();
        AtlasCache.CacheCOA();

        if (typeof AtlasPurchaseOrders !== 'undefined') {
            AtlasPurchaseOrders.BuildAtlasCache();
        }

        waitvar.push(
            AtlasCache.CacheORajax({
                'URL': APIUrlGetVendoreByProdId + '?SortBy=' + 'All' + '&ProdID=' + localStorage.ProdId
                , 'doneFunction': undefined
                , 'objFunctionParameters': {
                }
                , 'cachebyname': 'Vendor List'
            }))
        ;

        waitvar.push(
            AtlasCache.CacheORajax({
                'URL': AtlasCache.APIURLs.AtlasConfig_TransactionCodes
                , 'doneFunction': undefined
                , bustcache: true
                , callParameters: { callPayload: JSON.stringify({ ProdID: localStorage.ProdId }) }
                , contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                , 'cachebyname': 'Config.TransactionCodes'
            })
        );

        AtlasUtilities.HideLoadingAnimation();

        $.when(waitvar).done(
            function () {
                // Get the defaults only at the very end since we'll redirect to the default start page
                AtlasUtilities.CallAjaxPost(
                    APIUrlGetMyDefaultsInfo + '?ProdId=' + localStorage.ProdId + '&UserId=' + localStorage.UserId
                    , false
                    , GetMyDefaultsInfoSucess
                    , AtlasUtilities.LogError
                    , { async: false }
                );
        });

    }
}
;

$(document).ready(function () {
    let isChrome = false;
    var isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
        // is Google Chrome on IOS
        isChrome = true;
    } else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera === false && isIEedge === false) {
        // is Google Chrome
        isChrome = true;
    } else {
        // not Google Chrome 
    }

    if (isChrome===true)
    {
        $('#dvBrowser').attr('style', 'display:none;');
        $('#loginForm').attr('style', 'display:block;');

        if(localStorage.RememberEmail!== 'null')
        {
            $('#chkRemember').prop('checked', true);
           
            $('#txtEmail').val(localStorage.RememberEmail);
        }
        else
        {
            $('#chkRemember').prop('checked', false);
            $('#txtEmail').val('');
        }
    }
    else
    {
        $('#dvBrowser').attr('style', 'display:block;font-family: times new roman;color: red;font-size: 16px;padding: 5px;');
        $('#loginForm').attr('style', 'display:none;');
    }
});
$('#txtPassword').on("keypress", function (e) {
    if (e.keyCode === 13) {
        funLogin();
    }
});


$('#btnLogin').click(function () {
    funLogin();
});

function funLogin()
{
    setTimeout(function () {
        AtlasUtilities.FormDisableToggle('loginForm', true);
        LoginSpin();
        //$('#btnLogin').attr('disabled', true);
        //$('#btnLogin-loading').removeClass('hidden');
    }, 10);

    var eml = $('#txtEmail').val();
    var pwd = $('#txtPassword').val();
    $.ajax({
        url: APIUrlLoginAdminDetails + '?Email=' + eml + '&Password=' + pwd+'&Type='+'User',
        cache: false,
        type: 'GET',
      //  async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        LoginDetailsSucess(response);
    })
    .fail(function (error) {
        LoginDetailsFail(error);
    })
}

function LoginDetailsSucess(response) {
    if ($("#chkRemember").prop('checked') === true) {     
        localStorage.RememberEmail = $('#txtEmail').val();
    } else {    
        localStorage.RememberEmail = null;
    }

    var TLength = response.length;
    if (TLength > 0) {
        localStorage.UserId = response[0].UserID;
        localStorage.Email = $('#txtEmail').val();
        if (localStorage.UserId != -1) {
            GetProductionList();
        }
        $('#DvLoginUSer').hide();
    } else {
        alert('Invalid credentials');
        $('#txtEmail').select();
    }
}

function LoginDetailsFail(error) {
    console.log(error);
}


function GetProductionList() {
    localStorage.DBName = 'LOGIN';
    funGenrateAPIKey();
    $.ajax({
        url: APIUrlProductionList + '?UserId=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetProductionListSucess(response);
    })
    .fail(function (error) {
        LoginDetailsFail(error);
    })
}

function GetProductionListSucess(response)
{
    $('#ddlProductionList').html('');
    $('#ddlProductionList').html('<option value="0">Select</option>');
    if (response.length === 1) {
        localStorage.ProdId = response[0].ProductionId;
        localStorage.ProductionName = response[0].Name;
        objLogin.ConnecttoDB();

        //funGetDBName();
    } else {
        $('#DvProductionList').show();
        $('#ddlProductionList').show();

        for (var i = 0; i < response.length; i++)
        {
            $('#ddlProductionList').append('<option value=' + response[i].ProductionId + '>' + response[i].Name + '</option>');
        }
    }
}

$('#btnGo').click(function () {
    if ($('#ddlProductionList').val() != 0)
    {
        GoSpin()

        AtlasUtilities.FormDisableToggle('loginForm-ddl', false);

        setTimeout(function () {
            GoLoad();
        }
        , 500);
    } else {
        $('#ddlProductionList').focus();
    }
});

function GoLoad() {
    if ($("#chkRemember").prop('checked') === true) {
        localStorage.RememberEmail = $('#txtEmail').val();
    } else {
        localStorage.RememberEmail = null;
    }

    localStorage.ProdId = $('#ddlProductionList').val();
    localStorage.ProductionName = $("#ddlProductionList").find("option:selected").text();

    objLogin.ConnecttoDB();

}

function GoSpin() {
    setTimeout(function () {
        $('#btnGo').attr('disabled', true);
        $('#btnGo-loading').removeClass('hidden');
    }, 100);

}

function LoginSpin() {
    $('#btnLogin').attr('disabled', true);
    $('#btnLogin-loading').removeClass('hidden');
}

function funGetDBName() {
    $.ajax({
        url: APIUrlfunGetDBName + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
       // async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funGetDBNameSucess(response);
    })
    .fail(function (error) {
        ShowErrorMSG(error);
    })
}

function funGetDBNameSucess(response) {
    localStorage.DBName = response[0].DBName;
    sessionStorage.DBName = response[0].DBName;
    if (response.length === 1) {
        funGenrateAPIKey();
    }
}

function ShowMsgBox(divID, msg, url, typ) {
    var s = msg;
    if (typ == '')
    { typ = 'successmsg'; }
    var result = s.replace("\\n", "<br />");
    $('#fade2').fadeIn(2000).fadeOut(5000);
    $('#' + divID).removeClass().addClass("alrtbox ").addClass(typ).html(msg).fadeIn(2000).fadeOut(5000);
    if (url != '')
    { setTimeout('delayer(\'' + HOST + '/' + url + '\')', 7000); }
}


function funGenrateAPIKey()
{
    $.ajax({
         url: APIUrlGenrateAPIKey + '?UserId=' + localStorage.UserId + '&Email=' + $('#txtEmail').val() + '&DBName=' + localStorage.DBName,
       // url: APIUrlGenrateAPIKey + '?UserId=' + localStorage.UserId + '&Email=' + $('#txtEmail').val() ,
        cache: false,
        type: 'POST',
       	async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
    	funGenrateAPIKeySucess(response);
    })
    .fail(function (error) { 
	    LoginDetailsFail(error);
    })
}

function funGenrateAPIKeySucess(response) {
    localStorage.EMSKeyToken = 'Basic '+response;

    if (localStorage.DBName !== 'LOGIN') {
        //funGetBatchNumber();
        GetSegmentList();
    }
}

/*
function funGetBatchNumber()
{
    $.ajax({
        url: APIUrlGetBatchNumber + '?UserId=' + localStorage.UserId + '&ProdId=' +localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetBatchNumberSucess(response);
    })
    .fail(function (error) {
        LoginDetailsFail(error);
    })
}

function GetBatchNumberSucess(response)
{
    localStorage.BatchNumber = response;
    //window.location.replace(HOST + "/AccountPayable/Vendors");
    GetSegmentList();
}
*/

function GetSegmentList() {
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
    .done(function (response) {
        GetSegmentListSucess(response);
    })
    .fail(function (error) {
        LoginDetailsFail(error);
    })
}

function GetSegmentListSucess(response) {
    ArrSegment = [];
    for (var i = 0; i < response.length; i++) {
        var ObjSegment = {
            SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode, SegmentLevel: response[i].SegmentLevel, Type: 'SegmentRequired', SegmentClassification: response[i].Classification
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
                SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode, SegmentLevel: response[i].SegmentLevel, Type: 'SegmentOptional', SegmentClassification: response[i].Classification
            }
            ArrSegment.push(ObjSegment);
        }
        if (response[i].Classification == 'Detail') {
            strval++;
        }

    }
    localStorage.ArrSegment = JSON.stringify(ArrSegment);
    GetTransactionCode();
}

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
        LoginDetailsFail(error);
    })
}

function GetTransactionCodeSucess(response) {
    var ArrTransCode = [];
    for (var i = 0; i < response.length; i++) {
        var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }
        ArrTransCode.push(obj);
    }
    localStorage.ArrTransaction = JSON.stringify(ArrTransCode);
    console.log(localStorage.ArrSegment);
    console.log(localStorage.ArrTransaction);
    //GetMyDefaultsInfo();
}

//====================UserInfo=====================//
function GetMyDefaultsInfo() {
    $.ajax({
        url: APIUrlGetMyDefaultsInfo + '?ProdId=' + localStorage.ProdId + '&UserId=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetMyDefaultsInfoSucess(response);
    })
    .fail(function (error) {
        LoginDetailsFail(error);
    })
}

function GetMyDefaultsInfoSucess(response) {
    var strHtml = '';
    var Tcount = response.length;
     StrUserInfo = response;
     var VarUserLogPath = response[0].m1name;
     var VarUserLogSubPath = response[0].m2name;
     var VarUserLogSubSubPath = response[0].m3name;
     var strLoginPageInfo = '/ ' + VarUserLogPath + '/' + VarUserLogSubPath;
     strLoginPageInfo = strLoginPageInfo.replace(/\s+/g, '');

    // alert(VarUserLogSubSubPath);

     if (strLoginPageInfo != '')
     {
         if (VarUserLogPath == 'Setting')
         {
             if (VarUserLogSubPath == 'CompanyInfo')
             {
                 window.location.replace(HOST + "/Setting/Company");
             }
             else if (VarUserLogSubPath == 'Group')
             {
                 window.location.replace(HOST + "/Setting/Groups");
             }
             else if (VarUserLogSubPath == 'Users')
             {
                 window.location.replace(HOST + "/Setting/ManageUsers");
             }
             else if (VarUserLogSubPath == 'Bank')
             {
                 window.location.replace(HOST + "/Setting/Banks");
             }
             else if (VarUserLogSubPath == 'SourceCode') {
                 window.location.replace(HOST + "/Setting/Codes");
             }
             else if (VarUserLogSubPath == 'Transaction Code')
             {
                 window.location.replace(HOST + "/Setting/Codes");
             }
             else if (VarUserLogSubPath == 'Transaction Value') {
                 window.location.replace(HOST + "/Setting/Codes");
             }

             else {
                 window.location.replace(HOST + "/Setting/Company");
             }
         }

         else if (VarUserLogPath == 'Accounts Payable')
         {
             if (VarUserLogSubPath == 'Vendors')
             {
             window.location.replace(HOST + "/AccountPayable/Vendors");
             }
             else if (VarUserLogSubPath == 'Purchase Orders')
             {
                 if (VarUserLogSubSubPath == 'Add Purchase Order')
                 {
                     window.location.replace(HOST + "/AccountPayable/AddPurchaseOrder");
                    
                 }
                 else
                 {
                     window.location.replace(HOST + "/AccountPayable/PurchaseOrder");
                 }
             }
             else if (VarUserLogSubPath == 'Invoices')
             {
                 if (VarUserLogSubSubPath == 'Pending Invoices')
                 {
                     window.location.replace(HOST + "/AccountPayable/PendingInvoice");
                 }
                 else if (VarUserLogSubSubPath == 'Post Invoices')
                 {
                     window.location.replace(HOST + "/AccountPayable/PostInvoice");
                 }
                 else if (VarUserLogSubSubPath == 'Add Invoice')
                 {
                     window.location.replace(HOST + "/AccountPayable/AddInvoice");
                 }
                 else if (VarUserLogSubSubPath == 'Add Invoice')
                 {
                     window.location.replace(HOST + "/AccountPayable/AddInvoice");
                 }
                 else
                 {
                     window.location.replace(HOST + "/AccountPayable/PendingInvoice");
                 }
             }
             else if (VarUserLogSubPath == 'Check Cycle')
             {
                 window.location.replace(HOST + "/AccountPayable/CheckCycle");
             }

             else
             {
                 window.location.replace(HOST + "/AccountPayable/Vendors");
             }
         }


         else if (VarUserLogPath == 'Payroll')
         {
             if (VarUserLogSubPath == 'Payroll Login')
             {
                 window.location.replace(HOST + "/Payroll/PayrollLogin");
             }
             else if (VarUserLogSubPath == 'Payroll Load')
             {
                 window.location.replace(HOST + "/Payroll/LoadPayroll");
             }
             else if (VarUserLogSubPath == 'Payroll Audit')
             {
                 window.location.replace(HOST + "/Payroll/PayrollAudit");
             }
             else if (VarUserLogSubPath == 'Payroll RCP')
             {
                window.location.replace(HOST + "/Payroll/PayrollRCP");
             }
             else if (VarUserLogSubPath == 'Payroll Setup')
             {
                 if (VarUserLogSubSubPath == 'Bank Setup')
                 {
                     window.location.replace(HOST + "/Payroll/PayrollSetup");
                 }
                 else if (VarUserLogSubSubPath == 'Free Field') {
                     window.location.replace(HOST + "/Payroll/PayrollSetup");
                 }
                 else
                 {
                     window.location.replace(HOST + "/Payroll/PayrollSetup");
                 }
             }
             else
             {
                 window.location.replace(HOST + "/Payroll/PayrollLogin");
             }
         }
         else if (VarUserLogPath == 'CRW')
         {
             window.location.replace(HOST + "/CRW/CRWList");
         }

         else if (VarUserLogPath == 'Ledger')
         {
             if (VarUserLogSubPath == 'Trial Balance')
             {
                 window.location.replace(HOST + "/Ledger/TrailBalance");
             }
             else if (VarUserLogSubPath == 'Journal Entry')
             {
                 if (VarUserLogSubSubPath == 'Journal Entry')
                 {
                     window.location.replace(HOST + "/Ledger/JEDistributionChange");
                 }
                 else if (VarUserLogSubSubPath == 'Add JE') {
                     window.location.replace(HOST + "/Ledger/JEManualEntry");
                 }
                 else if (VarUserLogSubSubPath == 'Audit') {
                     window.location.replace(HOST + "/Ledger/JEAudit");
                 }
                 else if (VarUserLogSubSubPath == 'JE History') {
                     window.location.replace(HOST + "/Ledger/JEPostingHistory");
                 }
                 else
                 {
                     window.location.replace(HOST + "/Ledger/JEDistributionChange");
                 }
             }
             else if (VarUserLogSubPath == 'Adjustment')
             {
                 window.location.replace(HOST + "/Ledger/Adjustments");
             }
             else if (VarUserLogSubPath == 'Segment')
             {
                 window.location.replace(HOST + "/Ledger/Segments");
             }
             else if (VarUserLogSubPath == 'COA')
             {
                 window.location.replace(HOST + "/Ledger/COA");
             }
             else if (VarUserLogSubPath == 'GLSetup')
             {
                 if (VarUserLogSubSubPath == 'GLSetup')
                 {
                     window.location.replace(HOST + "/Ledger/GLSetup");
                 }
                 else if (VarUserLogSubSubPath == 'Accounts')
                 {
                     window.location.replace(HOST + "/Ledger/GLSetup");
                 }
                 else if (VarUserLogSubSubPath == 'COA')
                 {
                     window.location.replace(HOST + "/Ledger/GLSetup");
                 }
                 else
                 {
                     window.location.replace(HOST + "/Ledger/GLSetup");
                 }
             }
             else if (VarUserLogSubPath == 'Close Period')
             {
                 window.location.replace(HOST + "/Ledger/ClosePeriod");
             }
             else
             {
                 window.location.replace(HOST + "/Ledger/TrailBalance");
             }
         }
         else if (VarUserLogPath == 'Budget')
         {
             if (VarUserLogSubPath == 'Budget List')
             {
                 window.location.replace(HOST + "/Budget/Import");
             }
             else{
                 window.location.replace(HOST + "/Budget/Import");
             }
            
         }
         else if (VarUserLogPath == 'Reports')
         {
             window.location.replace(HOST + "/Reports/ReportList");
         }
         else if (VarUserLogPath == 'Config')
         {
             if (VarUserLogSubPath == 'My Default') {
                 window.location.replace(HOST + "/UserProfile/MyDefaults");
             }
             else {
                 window.location.replace(HOST + "/UserProfile/MyDefaults");
             }
         }
         else {
             window.location.replace(HOST + "/AccountPayable/Vendors");
         }
     }
   
    // window.location.replace(HOST + "/AccountPayable/Vendors");
}

