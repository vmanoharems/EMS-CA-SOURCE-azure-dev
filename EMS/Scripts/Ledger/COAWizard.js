var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
var APIUrlGetSegmentDetails = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGenrateCOA = HOST + "/api/Ledger/GenerateCOA";
var APIUrlGetCOAListByCompnayId = HOST + "/api/Ledger/GetCOAListByCompany";
var APIUrlGetLedgerDetails = HOST + "/api/Ledger/GetLedgerDetailByProdId";
var APIUrlSaveCOAManual = HOST + "/api/Ledger/InsertupdateCOAManual";
var APIUrlUpdateCOADescriptionById = HOST + "/api/Ledger/UpdateCOADescriptionById";


var APIUrlGetAccountType = HOST + "/api/CompanySettings/GetAllAccountType"; //Account Type

var SegmentDetail = [];
var CurrentSegment = '';
var COALength = 0;
var strCount = 0;
var strCheckCount = '';
var GblDetailPosition = 0;
var GblAccountList = [];
var GblSegmentUse = [];
var gblCodeString = '';
var gblEpisode = '';
var ssAllEpisode = '';



$(document).ready(function () {

    $(document).keyup(function (e) {
        if (e.keyCode == 27) CloseWizardPopup();
    });
    funGetSegmentDetail();
   var   strHtml = '<tr><td colspan="' + 8 + '" style="text-align: center;">No Record Found.. !!</td></tr>';
     $('#tblCOATBody').html(strHtml);

});
function funOpenEpisodeWizard() {
    $('#episodeWizard').show();
    $('#fade').show();
    funGetSegmentDetail();
    $('#DvLedgerDetail').hide();
    $('#tblGLsetupTbody').html('');
}
function funGetSegmentDetail() {
    $.ajax({
        url: APIUrlGetSegmentDetails + '?ProdId=' + localStorage.ProdId + '&Mode=' + 2,
        cache: false,
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetSegmentDetailSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}
function GetSegmentDetailSucess(response) {
    // GblSegmentUse = response;
    GblSegmentUse = [];
    $('#btnNext').show();
    $('#DvAccounts').html('');
    SegmentDetail = [];
    for (var i = 0; i < response.length; i++) {

        var strCompany = response[i].Classification;


        SegmentDetail.push(response[i].Classification);
        if (strCompany != 'Ledger' && strCompany != 'Detail') {
            if (i == 0) {
                var Strhtml = '  <div class="smallerDivs smallerDivs150 overflowAuto height275" id="Dv' + strCompany + '">';
                //var Strhtml = '<div class="col-md-5 col-sm-3 col-xs-4 col-lg-5 height300" style="border: 1px solid #eff1f3;padding: 10px;" id="Dv' + strCompany + '">';
                Strhtml += '<p><b style="margin: 25%;"> ' + strCompany + '</b></p>';
                Strhtml += '<ul id="Ul' + strCompany + 'DetailCOA" class="List-style"></ul></div>';
                CurrentSegment = response[i].Classification;
            } else {
                var Strhtml = '<div class="smallerDivs smallerDivs150  overflowAuto height275" id="Dv' + strCompany + '"  style="display: none;">';
                Strhtml += '<p><b style="margin: 25%;"> ' + strCompany + '</b></p>';
                Strhtml += '<ul id="Ul' + strCompany + 'DetailCOA" class="List-style"></ul></div>';

                //$('#Dv' + strCompany).prop('disabled', 'disabled');
            }

            $('#DvAccounts').append(Strhtml);
        }
    }
    GetCompanyDetails(CurrentSegment);
    for (var i = 0; i < response.length; i++) {

        var strval = response[i].Classification;
        if (strval == 'Detail') {
            break;

        }
        GblSegmentUse.push(strval);
    }
}
//--------------------------------------------- CompanyDetail
function GetCompanyDetails(CurrentSegment) {

    if (CurrentSegment != 'Ledger' && CurrentSegment != 'Detail') {
        $.ajax({
            url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + CurrentSegment,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
        })


.done(function (response)
{ GetCompanyDetailsSucess(response, CurrentSegment); })
.fail(function (error)
{ ShowMSG(error); })
    }
    else {
        $('#DvLedgerDetail').show();

    }

}
function GetCompanyDetailsSucess(response, CurrentSegment) {

    if (CurrentSegment != 'Company' && CurrentSegment != 'Episode') {
        $('#Ul' + CurrentSegment + 'DetailCOA').append('<li id="LiCOA' + CurrentSegment + '_"><input type="checkbox"  id="ChkCOA' + CurrentSegment + '_" style="margin: 5px;margin-bottom: 5px;" onclick="javascript:funCheckBox(' + "'" + CurrentSegment + "'" + ');"><span>All</span></li>');

        var Tcount = response.length;
        for (var i = 0; i < Tcount; i++) {
            $('#Ul' + CurrentSegment + 'DetailCOA').append('<li id="LiCOA' + CurrentSegment + '_' + i + '"><input type="checkbox" AccountId="' + response[i].AccountID + '"  id="ChkCOA' + CurrentSegment + '_' + response[i].AccountCode + '" value="' + response[i].AccountCode + '" class="clsCOA' + CurrentSegment + '" style="margin: 5px;margin-bottom: 5px;"><span>' + response[i].AccountCode + '</span></li>');
        }
    } else if (CurrentSegment == 'Episode') {
        $('#Ul' + CurrentSegment + 'DetailCOA').append('<li id="LiCOA' + CurrentSegment + '_"><input type="checkbox" checked disabled id="ChkCOA' + CurrentSegment + '_" style="margin: 5px;margin-bottom: 5px;" onclick="javascript:funCheckBox(' + "'" + CurrentSegment + "'" + ');"><span>All</span></li>');

        var Tcount = response.length;
        for (var i = 0; i < Tcount; i++) {
            $('#Ul' + CurrentSegment + 'DetailCOA').append('<li id="LiCOA' + CurrentSegment + '_' + i + '"><input type="checkbox" checked disabled  AccountId="' + response[i].AccountID + '"  id="ChkCOA' + CurrentSegment + '_' + response[i].AccountCode + '" value="' + response[i].AccountCode + '" class="clsCOA' + CurrentSegment + '" style="margin: 5px;margin-bottom: 5px;"><span>' + response[i].AccountCode + '</span></li>');
        }
    }

    else {
        $('#Ul' + CurrentSegment + 'DetailCOA').append('<li id="LiCOA' + CurrentSegment + '_"><input type="checkbox"  id="ChkCOA' + CurrentSegment + '_" style="margin: 5px;margin-bottom: 5px;" onclick="javascript:funCheckBox(' + "'" + CurrentSegment + "'" + ');"><span>All</span></li>');

        var Tcount = response.length;
        for (var i = 0; i < Tcount; i++) {
            $('#Ul' + CurrentSegment + 'DetailCOA').append('<li id="LiCOA' + CurrentSegment + '_' + i + '"><input type="checkbox"  AccountId="' + response[i].AccountID + '"  id="ChkCOA' + CurrentSegment + '_' + response[i].AccountCode + '" value="' + response[i].AccountCode + '" class="clsCOA' + CurrentSegment + '" style="margin: 5px;margin-bottom: 5px;"><span>' + response[i].AccountCode + '</span></li>');
        }
    }
    //onchange="javascript:funCheckBoxSize(\'' + CurrentSegment + '\');"
}

//--------------------------------------------- Error
function ShowMSG(error) {
    console.log(error);
}
function funCheckBox(values) {

    var clsCompanyvalue = $('.clsCOA' + values);

    if ($('#ChkCOA' + values + '_').is(':checked')) {
        for (var i = 0; i < clsCompanyvalue.length; i++) {
            var CompId = clsCompanyvalue[i].id;
            $('#' + CompId).prop('checked', true);
        }
    }
    else {
        for (var i = 0; i < clsCompanyvalue.length; i++) {
            var CompId = clsCompanyvalue[i].id;
            $('#' + CompId).prop('checked', false);
        }
    }
}
function funNextSegment() {
    var strCount = 0;
    for (var i = 0; i < SegmentDetail.length; i++) {
        if (SegmentDetail[i] == CurrentSegment) {
            strCount = i + 1;
        }
    }
    CurrentSegment = SegmentDetail[strCount];
    $('#Dv' + CurrentSegment).show();
    if (CurrentSegment != 'Ledger' && CurrentSegment != 'Detail') {
        GetCompanyDetails(CurrentSegment);
    }
    else if (CurrentSegment == 'Detail') {

        GetLedgerDetails('tblLedgerDetailTBody');
        $('#btnNext').hide();
        //  GetLedgerDetails();
        // ShowMsgBox('showMSG', 'Press Next button.. !!', '', '');

    }
    //else if (CurrentSegment == 'Detail') {
    //    //   GetCompanyDetails(CurrentSegment);

    //}

}

//================================================= Account Type
function GetAccountTypeCOA() {
    $.ajax({
        url: APIUrlGetAccountType + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })
        .done(function (response)
        { GetAccountTypeCOASucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
}
function GetAccountTypeCOASucess(response) {
    var strAccountType = '';
    var strHtml = '';
        strAccountType += '<option value=All>All</option>';
        for (var i = 0; i < response.length; i++) {
        strAccountType += '<option value=' +response[i].Code + '>' +response[i].Code + '</option>';
        }

    strHtml += '<label style="width: 90px !important;">' + 'Account Type' + '</label>';
    strHtml += ' <select id="ddlAccountType" class="form-control floatLeft" onchange="javascript: GetCOA();" style="width: 14%;margin-right: 10px;">' + strAccountType + '</select>';
    $('#DvCOAFilter').append(strHtml);
}
//--------------------------------------------------Ledger Detail

function GetLedgerDetails(value) {

    $('#DvLedgerDetail').show();
    $("#preload").css("display", "block");
    $('#tblLedgerDetailTBody').html('');
    $('#tblLedgerDetailCOAManualTBody').html('');


    $.ajax({
        url: APIUrlGetLedgerDetails + '?ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })


.done(function (response)
{ GetLedgerDetailsSucess(response, value); })
.fail(function (error)
{ ShowMSG(error); })
}
function GetLedgerDetailsSucess(response, value) {
    var Tcount = response.length;

    var strLedger = '';
    var strHtml = '';
    for (var i = 0; i < Tcount; i++) {
        var AccountID = response[i].CHILD;
        var AccountCode = response[i].AccountCode;
        var AccountName = response[i].AccountName;
        var ParentId = response[i].PARENT;
        var Child = response[i].ChildCount;
        var SubLevel = response[i].SubLevel;
        var hierarchy = response[i].hierarchy;
        var strChildCount = response[i].ChildCount;


        if (SubLevel > 1) {
            strHtml += '<tr style="display:none;" class="Tr_' + ParentId + '" id="' + i + '" name=' + AccountID + ' >';
        }
        else {
            strHtml += '<tr>';
        }
        if (SubLevel > 1) {
            //----------------------- Detail
            var strindent = '';
            if (SubLevel == 1) { strindent = '<span class="Indent"></span>'; }
            else if (SubLevel == 2) { strindent = '<span class="Indent-Indent"></span>'; }
            else if (SubLevel == 3) { strindent = '<span class="Indent-Indent-Indent"></span>'; }
            else if (SubLevel == 4) { strindent = '<span class="Indent-Indent-Indent-Indent"></span>'; }
            else if (SubLevel == 5) { strindent = '<span class="Indent-Indent-Indent-Indent-Indent"></span>'; }
            else if (SubLevel == 6) { strindent = '<span class="Indent-Indent-Indent-Indent-Indent-Indent"></span>'; }
            else if (SubLevel == 7) { strindent = '<span class="Indent-Indent-Indent-Indent-Indent-Indent-Indent"></span>'; }
            else { strindent = '<span class="Indent-Indent-Indent"></span>'; }
            if (Child == 0) {
                strHtml += '<td style="width:35px;"><a href="javascript:funExpand(' + AccountID + ');"></a></td>';
            }
            else {
                strHtml += '<td style="width:35px;"><span id="spn' + AccountID + '" onclick="javascript:funExpand(' + AccountID + ');" class="RightIcon"></span></td>';
            }
            if (Child == 0) {

                strHtml += '<td>' + strindent + '<input type="checkBox" value="' + hierarchy + '" id="ChkAcc_' + AccountID + '" AccountId="' + AccountID + '" name="' + ParentId + '" class="clsCOADetail clsAccountCode clsP' + ParentId + ' clsA' + AccountID + '" onchange="javascript:funcheckAcode(' + AccountID + ',' + i + ',' + ParentId + ');"/> <span class="clsDetail">' + AccountCode + '</span></td>';
                // <a href="javascript:funExpand(' + AccountID + ');"></a>
            } else {

                strHtml += '<td>' + strindent + '<input type="checkBox" AccountId="' + AccountID + '" value="' + hierarchy + '" id="ChkAcc_' + AccountID + '" AccountId="' + AccountID + '" name="' + ParentId + '" class="clsCOADetail clsAccountCode clsP' + ParentId + ' clsA' + AccountID + '"  onchange="javascript:funcheckAcode(' + AccountID + ',' + i + ',' + ParentId + ');"/> <span class="clsDetail">' + AccountCode + '</span></td>';
                // <span id="spn' + AccountID + '" onclick="javascript:funExpand(' + AccountID + ');" class="RightIcon"></span>
            }
            strHtml += '<td>' + AccountName + '</td>';
            if (strChildCount == 0) {
                strHtml += '<td></td>';
            }
            else {
                strHtml += '<td><input type="checkBox" id="ChkSub_' + AccountID + '" class="clsAccountSubs clsSub_' + ParentId + '_' + AccountID + '" onchange="javascript:funCheckSub(' + AccountID + ');"/></td>';


            }
            strHtml += '</tr>';
        }
            //------------------------------- Ledger
        else {


            strHtml += '<td style="width:35px;"><a href="javascript:funExpand(' + AccountID + ');" ><span id="spn' + AccountID + '" class="RedColor RightIcon"></span></a></td>';
            strHtml += '<td><input type="checkBox" accountId="' + AccountID + '"  id="ChkAcc_' + AccountID + '" class="clsAccountCode clsP' + ParentId + ' clsA' + AccountID + ' clsCOADetail clsCOAPDetail" value="' + hierarchy + '" onchange="javascript:funcheckAcode(' + AccountID + ',' + i + ',' + ParentId + ');"/><span >' + AccountCode + '</span></td>';
            strHtml += '<td>' + AccountName + '</td>';
            if (strChildCount == 0) {
                strHtml += '<td></td>';
            }
            else {
                strHtml += '<td><input type="checkBox" id="ChkSub_' + AccountID + '" class="clsAccountSubs" onchange="javascript:funCheckSub(' + AccountID + ');" /></td>';

            }
            strHtml += '</tr>';
        }
    }
    if (value == 'tblLedgerDetailTBody') {
        $('#tblLedgerDetailTBody').html(strHtml);
    }
    else {
        $('#tblLedgerDetailCOAManualTBody').html(strHtml);

    }
    $("#preload").css("display", "none");

}
//-------------------------------------------------- Operation For Tree
function funcheckAcode(AId, i, PId) {
    if (PId == 0) {
        if ($('#ChkAcc_' + AId).is(':checked')) {
            $('#spn' + AId).removeClass('RedColor');
            $('#spn' + AId).addClass('BlueColor');
        }
        else {
            $('#spn' + AId).removeClass('BlueColor');
            $('#spn' + AId).addClass('RedColor');
            funCheckChildUnselect(AId);
        }
    }
    else {
        if ($('#ChkAcc_' + PId).is(':checked')) {
            if ($('#ChkAcc_' + AId).is(':checked')) {
                $('#spn' + AId).removeClass('RedColor');
                $('#spn' + AId).addClass('BlueColor');
            }
            else {
                $('#spn' + AId).removeClass('BlueColor');
                $('#spn' + AId).addClass('RedColor');
                funCheckChildUnselect(AId);

            }
            var strstatus = '';
            var strvalue = $('.cls' + AId);
            if ($('#ChkAcc_' + i).is(':checked')) {
                strstatus = true;
            }
            else { strstatus = false; }
            for (var i = 0; i < strvalue.length; i++) {
                var Id = strvalue[i].id;
                if (strstatus == false) {
                    $('#' + Id).prop('checked', false);
                } else {

                }
            }
        }
        else {
            //$('#ChkAcc_' + PId).prop('checked', true);
            checkPId(PId);
        }
    }
}
function funCheckChildUnselect(value) {
    var strval = $('.clsP' + value);
    $('#ChkSub_' + value).prop('checked', false);
    for (var i = 0; i < strval.length; i++) {
        var strId = strval[i].id;
        var strname = $('#' + strId).attr('AccountId');
        var strSplit = strId.split('_');
        $('#' + strId).prop('checked', false);
        $('#ChkSub_' + strSplit[1]).prop('checked', false);

        funCheckChildUnselect(strname);

    }
}

function checkPId(PId) {
    var strPId = '';
    if (PId !== 0) {
        var strval = $('.clsA' + PId);
        if (strval.length > 0) {
            var strId = strval[0].id;

            $('#' + strId).prop('checked', true);
            var strPId = $('#' + strId).attr('name');
        }
        if (strPId != undefined) {
            checkPId(strPId);
        }
    }
}


function funCheckSub(AccountID) {
    if ($('#ChkSub_' + AccountID).is(':checked')) {
        var clsvalue = $('.clsP' + AccountID);
        $('#ChkAcc_' + AccountID).prop('checked', true);
        //checkAccountCode(clsvalue);
        for (var i = 0; i < clsvalue.length; i++) {
            var strval = clsvalue[i].id;

            var strsplit = strval.split('_');
            $('#ChkAcc_' + strsplit[1]).prop('checked', true);
            $('#ChkSub_' + strsplit[1]).prop('checked', true);
            var strCClass = $('.clsP' + strsplit[1]);
            if (strCClass.length > 0) {
                funCheckSub(strsplit[1]);
            }
        }
    }
    else {

        var clsvalue = $('.clsP' + AccountID);
        //checkAccountCode(clsvalue);
        for (var i = 0; i < clsvalue.length; i++) {
            var strval = clsvalue[i].id;

            var strsplit = strval.split('_');
            $('#ChkAcc_' + strsplit[1]).prop('checked', false);
            $('#ChkSub_' + strsplit[1]).prop('checked', false);
            var strCClass = $('.clsP' + strsplit[1]);
            if (strCClass.length > 0) {
                funCheckSub(strsplit[1]);
            }
        }

    }
}
function checkAccountCode(clsvalue) {
    for (var i = 0; i < clsvalue.length; i++) {
        var strval = clsvalue[i].id;
        var strsplit = strval.split('_');
        $('#' + strval).prop('checked', true);
        $('#ChkSub_' + strsplit[1]).prop('checked', true);
        if ($('.ClsP' + strsplit[1]).length != 0) {
            checkAccountCode(strsplit[1]);
        }
    }
}
//------------------------------------------------- Expand
function funExpand(value) {
    // $('#spn' + value).text('<i class="fa fa-chevron-circle-down"></i>');
    var strvalue = $('.Tr_' + value);
    if (strvalue.length > 0) {
        var strId = strvalue[0].id;
        if ($('#' + strId).css('display') == 'none') {
            $('#spn' + value).removeClass('RightIcon');
            $('#spn' + value).addClass('DownIcon');

        }
        else {
            $('#spn' + value).removeClass('DownIcon');
            $('#spn' + value).addClass('RightIcon');


        }

        for (var i = 0; i < strvalue.length; i++) {

            var Id = strvalue[i].id;
            if ($('#' + Id).css('display') == 'none') {
                $('#' + Id).show();
            } else {
                $('#' + Id).hide();
                var StrId = $('#' + Id).attr('name');
                var StrId = $('#' + Id).attr('name');
                $('#spn' + StrId).removeClass('DownIcon');
                $('#spn' + StrId).addClass('RightIcon');
                HideAllrow(StrId);
            }
        }
    }
    else {
        $('#DvSuccess').show();
        setTimeout(function () {
            $("#DvSuccess").hide('blind', {}, 500)
        }, 2000);
    }

}
function HideAllrow(value) {
    var strvalue = $('.Tr_' + value);
    for (var i = 0; i < strvalue.length; i++) {
        var Id = strvalue[i].id;
        $('#' + Id).hide();
        var StrId = $('#' + Id).attr('name');
        $('#spn' + StrId).removeClass('DownIcon');
        $('#spn' + StrId).addClass('RightIcon');


        HideAllrow(StrId);
    }
}

//-------------------------------------------------- Check All
function funCheckAll(values) {
    var Strvalue = '';
    var strStatus = '';
    if (values == 'Code') {
        // $('#ChkSub_' + AccountID).is(':checked')
        if ($('#chkAllCode').is(':checked')) {
            strStatus = true;
            Strvalue = $('.clsCOAPDetail');
        }
        else {
            strStatus = false;
            Strvalue = $('.clsAccountCode');
        }
    }
    else if (values == 'Subs') {
        if ($('#ChkAllSubs').is(':checked')) {
            strStatus = true;
            Strvalue = $('.clsAccountSubs');
           
        }
        else {
            strStatus = false;
            Strvalue = $('.clsAccountSubs');
        }
    }
    for (i = 0; i < Strvalue.length; i++) {
        var Id = Strvalue[i].id;
        var strsplit = Id.split('_');

        if (strStatus == true) {
            $('#' + Id).prop('checked', true);
            $('#spn' + strsplit[1]).removeClass('RedColor');
            $('#spn' + strsplit[1]).addClass('BlueColor');
           
            funCheckSub(strsplit[1]);

        }
        else {
            $('#' + Id).prop('checked', false);

            $('#spn' + strsplit[1]).removeClass('BlueColor');
            $('#spn' + strsplit[1]).addClass('RedColor');
            funCheckSub(strsplit[1]);
        }

    }
}
//------------------------------------------------- Generate COA
function funGenrateCOA() {

    var strvalid = 0;
    var strposition = 0;

    var s = '';
    var s1 = '';
    var s2 = '';
    var s3 = '';
    var s4 = '';
    var s5 = '';
    var s6 = '';
    var s7 = '';
    var s8 = '';
    for (var k = 0; k < SegmentDetail.length; k++) {
        if (SegmentDetail[k] == 'Detail') {
            strposition = k;
        }
    }

    for (var i = 0; i < SegmentDetail.length; i++) {
        var clsCompanyvalue = $('.clsCOA' + SegmentDetail[i]);
        s = '';


        for (var j = 0; j < clsCompanyvalue.length; j++) {
            var CompId = clsCompanyvalue[j].id;
            if ($('#' + CompId).is(':checked')) {
                var ComCode = $('#' + CompId).attr('value');
                var ComId = $('#' + CompId).attr('AccountId');
                s += ComCode + ':' + ComId + ',';
            }
        }

        if (i == 0) {
            if (strposition >= i) {
                if (s != '') {

                } else {
                    strvalid = 1;
                }
            }
            s1 = s.substring(0, s.length - 1);
        }
        else if (i == 1) {
            if (strposition >= i) {
                if (s != '') {
                } else {
                    strvalid = 1;
                }
            }
            s2 = s.substring(0, s.length - 1);

        }
        else if (i == 2) {
            if (strposition >= i) {
                if (s != '') {
                } else {
                    strvalid = 1;
                }
            }
            s3 = s.substring(0, s.length - 1);

        }

        else if (i == 3) {
            if (strposition >= i) {
                if (s != '') {
                } else {
                    strvalid = 1;
                }
            }
            s4 = s.substring(0, s.length - 1);

        }
        else if (i == 4) {
            if (strposition >= i) {
                if (s != '') {
                } else {
                    strvalid = 1;
                }
            }
            s5 = s.substring(0, s.length - 1);

        }
        else if (i == 5) {
            if (strposition >= i) {
                if (s != '') {
                } else {
                    strvalid = 1;
                }
            }
            s6 = s.substring(0, s.length - 1);

        }
        else if (i == 6) {
            if (strposition >= i) {
                if (s != '') {
                } else {
                    strvalid = 1;
                }
            }
            s7 = s.substring(0, s.length - 1);

        }
        else if (i == 7) {
            if (strposition >= i) {
                if (s != '') {
                } else {
                    strvalid = 1;
                }
            }
            s8 = s.substring(0, s.length - 1);
        }
    }
    var objCOA = {
        s1: s1,
        s2: s2,
        s3: s3,
        s4: s4,
        s5: s5,
        s6: s6,
        s7: s7,
        s8: s8,
        ProdID: localStorage.ProdId
    }

    if (strvalid == 0) {

        ShowMsgBox('showMSG', 'It will take several minutes to build COA. Have patience...!!', '', '');
        $("#preload").css("display", "block");
        $('#episodeWizard').hide();
        $.ajax({
            url: APIUrlGenrateCOA,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(objCOA),
        })
           .done(function (response)
           { GenrateCOASucess(response); })
           .fail(function (error)
           { ShowMSG(error); })
    } else {
        ShowMsgBox('showMSG', 'Please Select Atleast one Accont from each Segment .. !!', '', '');
    }
}
function GenrateCOASucess(response) {
    $("#preload").css("display", "none");
    ShowMsgBox('showMSG', 'COA Generate Successfully.. !!', '', '');
    CloseWizardPopup();
    GetCOA();

}
//------------------------------------------------- COA Popup
function funCOAShow() {
    showDiv('tabCOA');
    hideDiv('tabAccounts');
    $('#UlSegmentType').hide();
    GetCOA(gblCodeString);
    $('#btnSaveGLsetup').hide();
    $('#btnCancelGLsetup').hide();

    $('#DvMasking').hide();
    $('#hrefAddParent').hide();
    $('#hrefNewAccountAdd').hide();

    $('#DvCOAFilter').show();
    funGetCOLOEP();
    GetCOA();
    $('#LiAccountGL').removeClass('active');
    $('#LiCOAGL').addClass('active');

    $('#btnCOACreate').show();
    $('#btnCOAManual').show();
}
function funGetCOLOEP() {
    $('#DvCOAFilter').html('');
    ssAllEpisode = '';
    for (var i = 0; i < GblSegmentUse.length; i++) {

        var strHtml = '';
        if (GblSegmentUse[i] == 'Episode') {
            strHtml += '<label style="width:70px !important;display:none;">' + GblSegmentUse[i] + '</label>';
            strHtml += ' <select style="display:none;" id="ddl' + GblSegmentUse[i] + 'COA" class="form-control floatLeft" onchange="javascript: funChangeDDL();" style="width: 14%;margin-right: 10px;"></select>';
        }
        else {
            strHtml += '<label style="width:70px !important;">' + GblSegmentUse[i] + '</label>';
            strHtml += ' <select id="ddl' + GblSegmentUse[i] + 'COA" class="form-control floatLeft" onchange="javascript: funChangeDDL();" style="width: 14%;margin-right: 10px;"></select>';
        }

        $('#DvCOAFilter').append(strHtml);
        GetCOLOEP(GblSegmentUse[i]);
    }
    GetAccountTypeCOA();
}
function GetCOLOEP(value) {
    gblCodeString = '';
    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + value,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

           .done(function (response) {
               GetCOLOEPSuccess(response, value);
           })
            .fail(function (error)
            { ShowMSG(error); })
}

function funChangeDDL() {
    gblCodeString = '';
    for (var i = 0; i < GblSegmentUse.length; i++) {
        var strval = $('#ddl' + GblSegmentUse[i] + 'COA').val();
        gblCodeString += strval + '|';
    }
    GetCOA();
}

function GetCOLOEPSuccess(response, value) {
    gblEpisode = '';
   
    for (var i = 0; i < response.length; i++) {
        if (i == 0) {
            gblCodeString += response[i].AccountCode + '|';
            if (value == 'Episode') {
                ssAllEpisode += response[i].AccountCode + ':' + response[i].AccountID + ',';
            }
            else {
                $('#ddl' + value + 'COA').html('<option value="' + 0 + '">Select</option>');

                gblEpisode += response[i].AccountCode + ',';

            }
        }
        else {
            if (value == 'Episode') {
                ssAllEpisode += response[i].AccountCode + ':' + response[i].AccountID + ',';
            }
        }
        $('#ddl' + value + 'COA').append('<option name=' + response[i].AccountID + ' value="' + response[i].AccountCode + '">' + response[i].AccountCode + '</option>');
    }

    ssAllEpisode = ssAllEpisode.substring(0, ssAllEpisode.length - 1);

}
function funAccounts() {
    hideDiv('tabCOA');
    showDiv('tabAccounts');
    $('#UlSegmentType').show();
    $('#fade').hide();
    $('#hrefNewAccountAdd').show();

    $('#LiAccountGL').addClass('active');
    $('#LiCOAGL').removeClass('active');

    $('#btnSaveGLsetup').show();
    $('#btnCancelGLsetup').show();
    $('#LiBreadCrumbName').text('G/L Setup');
    $('#DvMasking').show();
    $('#DvCOAFilter').hide();
    $('#LiCOAGL').removeClass('active');
    $('#LiAccountGL').addClass('active');
    $('#btnCOACreate').hide();
    $('#btnCOAManual').hide();
    //===============================================  Active ul  
    $('#UlSegmentType li').removeClass('active');
    $('#LiSegment_Company').addClass('active');
    GetCompanyList(); //========================= call company
  //  GetCompanyDetails('Company');

}
//---------------------------------------------------- COA List
function GetCOA() {

    $('#LiCOAGL').addClass('active');
    $('#LiAccountGL').removeClass('active');
    $("#preload").css("display", "block");
    $('#LiBreadCrumbName').text('COA');
    $('#tblCOATBody').html('');

    var strHtml1 = '';
    for (var j = 0; j < SegmentDetail.length; j++) {

        if (SegmentDetail[j] == 'Detail') {
            strHtml1 += '<th class="first"> <div class="th-inner">' + SegmentDetail[j] + '</div></th>';
        }
    }
    strHtml1 += '<th class="second"> <div class="th-inner">Description</div></th>';
    strHtml1 += '<th class="third"> <div class="th-inner">ReportDescription</div></th>';
    strHtml1 += '<th class="first"> <div class="th-inner">Posting</div></th>';
    strHtml1 += '<th class="first"> <div class="th-inner">Type</div></th>';
    strHtml1 += '<th class="first"> <div class="th-inner">Level</div></th>';
    strHtml1 += '</tr>';
    $('#tblCOAThead').html(strHtml1);


    $.ajax({
        url: APIUrlGetCOAListByCompnayId + '?ProdId=' + localStorage.ProdId + '&CodeString=' + gblCodeString,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response) {
         GetCOASucess(response);
     })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetCOASucess(response) {
    var strDCount = 0;
    var strHtml = '';
    var ddlAccountType = $('#ddlAccountType').val();

    if (ddlAccountType == 'All') {
        var Tcount = response.length;
        for (var i = 0; i < Tcount; i++) {
            var strDetail = response[i].Detail.replace(/>/g, ' ');
            var strDetail1 = strDetail.split(' ');
            strHtml += '<tr>';
            if (response[i].SubLevel == 1) {
                strHtml += '<td>' + strDetail + '</td>';
                strHtml += '<td>' + response[i].Descriptions + '</td>';
            }
            else if (response[i].SubLevel == 2) {
                strHtml += '<td><span style="float: left;margin-left: 10%;">' + strDetail1[1] + '</span></td>';
                strHtml += '<td><span style="float: left;margin-left: 10%;">' + response[i].Descriptions + '</span></td>';
            }
            else if (response[i].SubLevel == 3) {
                strHtml += '<td><span style="float: left;margin-left: 20%;">' + strDetail1[2] + '</span></td>';
                strHtml += '<td><span style="float: left;margin-left: 20%;">' + response[i].Descriptions + '</span></td>';
            }
            else if (response[i].SubLevel == 4) {
                strHtml += '<td><span style="float: left;margin-left: 30%;">' + strDetail1[3] + '</span></td>';
                strHtml += '<td><span style="float: left;margin-left: 30%;">' + response[i].Descriptions + '</span></td>';
            }
            else if (response[i].SubLevel == 5) {
                strHtml += '<td><span style="float: left;margin-left: 40%;">' + strDetail1[4] + '</span></td>';
                strHtml += '<td><span style="float: left;margin-left: 40%;">' + response[i].Descriptions + '</span></td>';
            }
            else if (response[i].SubLevel == 6) {
                strHtml += '<td><span style="float: left;margin-left: 50%;">' + strDetail1[5] + '</span></td>';
                strHtml += '<td><span style="float: left;margin-left: 50%;">' + response[i].Descriptions + '</span></td>';
            }
            if (response[i].ReportDescription == '') {
                strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].Descriptions + '</span><input type="text" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;"/></td>';
            }
            else {
                strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].ReportDescription + '</span><input type="text" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;"/></td>';
            }
            if (response[i].Posting == true) {
                strHtml += '<td><input type="checkBox" checked disabled/></td>';
            }
            else {
                strHtml += '<td><input type="checkBox" disabled/></td>';
            }
            strHtml += '<td>' + response[i].AccountType + '</td>';
            strHtml += '<td>' + response[i].SubLevel + '</td>';
            strHtml += '</tr>';
        }
    } else if (ddlAccountType != 'EX')
    {
        var Tcount = response.length;
        for (var i = 0; i < Tcount; i++) {
            if (ddlAccountType == response[i].AccountType) {
                var strDetail = response[i].Detail.replace(/>/g, ' ');
                strHtml += '<tr>';
                strHtml += '<td>' + strDetail + '</td>';
                strHtml += '<td>' + response[i].Descriptions + '</td>';
                if (response[i].ReportDescription == '') {
                    strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].Descriptions + '</span><input type="text" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;"/></td>';
                }
                else {
                    strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].ReportDescription + '</span><input type="text" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;"/></td>';
                }
                if (response[i].Posting == true) {
                    strHtml += '<td><input type="checkBox" checked disabled/></td>';
                }
                else {
                    strHtml += '<td><input type="checkBox" disabled/></td>';
                }
                strHtml += '<td>' + response[i].AccountType + '</td>';
                strHtml += '<td>' + response[i].SubLevel + '</td>';
                strHtml += '</tr>';
            }
        }
    }
    else  {
        var Tcount = response.length;
        for (var i = 0; i < Tcount; i++) {
            if ('A' != response[i].AccountType && 'L' != response[i].AccountType) {
                var strDetail = response[i].Detail.replace(/>/g, ' ');
                strHtml += '<tr>';
                strHtml += '<td>' + strDetail + '</td>';
                strHtml += '<td>' + response[i].Descriptions + '</td>';
                if (response[i].ReportDescription == '') {
                    strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].Descriptions + '</span><input type="text" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;"/></td>';
                }
                else {
                    strHtml += '<td><span style="    color: blue;" id="spn_' + response[i].COAID + '" onClick="javascript:funShowTextBox(' + response[i].COAID + ');">' + response[i].ReportDescription + '</span><input type="text" id="txt_' + response[i].COAID + '" onblur="funShowSpan(' + response[i].COAID + ')" style="display:none;width: 100%;"/></td>';
                }
                if (response[i].Posting == true) {
                    strHtml += '<td><input type="checkBox" checked disabled/></td>';
                }
                else {
                    strHtml += '<td><input type="checkBox" disabled/></td>';
                }
                strHtml += '<td>' + response[i].AccountType + '</td>';
                strHtml += '<td>' + response[i].SubLevel + '</td>';
                strHtml += '</tr>';
            }
            else {
                var strHtml = '';
                strHtml += '<tr><td colspan="' + 8 + '" style="text-align: center;">No Record Found.. !!</td></tr>';

            }
        }
    }







    $('#tblCOATBody').html(strHtml);

    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#DvTBB').attr('style', 'height:' + heightt + 'px !important;');

    $(this).click(function () {

        var strvalue = $(this).attr('name');
        funGetValue(strvalue);
    })
    $("#preload").css("display", "none");

    
}
function funCancel() {
    $('#TrCOANewRow').hide();
}

function funGetValue(strvalue) {

}

function funGetAccounts(type) {

    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + type,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })


.done(function (response)
{ funGetAccountsSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}

function funGetAccountsSucess(response) {
    GblAccountList = [];
    GblAccountList = response;
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.AccountCode,
            value: m.AccountName,
            SubLevel: m.SubLevel,
            AccountId: m.AccountID,
        };
    });
    $(".SearchAccount").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.AccountId);
            $('#txtDescription').val(ui.item.value);
            $('#txtLevel').val(ui.item.SubLevel);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $('#txtDescription').val(ui.item.value);
            $('#txtLevel').val(ui.item.SubLevel);
            $(this).attr('name', ui.item.AccountId);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                // $('#f').val('');
                // $(this).val('');
                //$(this).removeAttr('COACode');
                //$(this).removeAttr('COAId');

                //$('#hdnCode_' + values).val('');
                //$('#hdnCOAId_' + values).val('');

            }
        }
    })
}
//======================================================
function funCheckAccountCode(value) {
    var strval = $('#txt' + value).val();
    for (var i = 0; i < GblAccountList.length; i++) {
        if (strval != '') {
            if (GblAccountList[i].AccountCode == strval) {
                $('#txt' + value).val(GblAccountList[i].AccountCode);
            }
            else {
                $('#txt' + value).val('');

            }
        }
    }
}

//----------------------------------------------------- Add new Row COA
function AddNewRowCOA() {
    $('#tblGLsetupTbody').html('');
    /// ////////////////////////////////////////////////////////////////// Add NEW Row Replace with popup
    var strddlSelect = 0;
    for (var i = 0; i < SegmentDetail.length; i++) {
        if ($('#ddl' + SegmentDetail[i] + 'COA').val() == '0') {
            strddlSelect++;
        }
    }
    if (strddlSelect == 0) {
        // $('#TrCOANewRow').show();
        $('#COAManual').show();
        $('#fade').show();

        GetLedgerDetails('tblLedgerDetailCOAManualTBody');
        funshowCom();
    }
    else {
        ShowMsgBox('showMSG', 'Please select Segments above..!!', '', '');
    }

}
function funshowCom()
{
    var strval = '';
    for (var i = 0; i < GblSegmentUse.length; i++) {


        if (GblSegmentUse[i] == 'Episode') {


        }
        else {
            strval += GblSegmentUse[i] + ' : ' + $('#ddl' + GblSegmentUse[i] + 'COA').val() +',';
        }

    }
    strval = strval.substring(0, strval.length - 1);
    $('#lblAccountsCOA').text(strval);
}

// --------------------------------------------------- Save Manual COA
function SaveCOAManual() {
    //InsertupdateCOAManual
    strDetail = -1;
    strEpisode = -1;
    var s0 = '';
    var s = '';
    var s1 = '';
    var s2 = '';
    var s3 = '';
    var s4 = '';
    var s5 = '';
    var s6 = '';
    var s7 = '';
    var s8 = '';


    for (var k = 0; k < SegmentDetail.length; k++) {
        if (SegmentDetail[k] == 'Detail') {
            strDetail = k;
        }

        if (SegmentDetail[k] == 'Episode') {
            strEpisode = k;
        }
    }
    for (var i = 0; i < SegmentDetail.length; i++) {
        s = $('#ddl' + SegmentDetail[i] + 'COA').val();
        s0 = $('#ddl' + SegmentDetail[i] + 'COA').find('option:selected').attr("name");
        s = s + ':' + s0;

        if (strDetail == i) {
            //var strVal = $('#txtDetail').val();
            //var strsplit = strVal.split('>');
            s = '';
            var clsCompanyvalue = $('.clsCOA' + SegmentDetail[i]);
            for (var j = 0; j < clsCompanyvalue.length; j++) {
                var CompId = clsCompanyvalue[j].id;
                if ($('#' + CompId).is(':checked')) {
                    var ComCode = $('#' + CompId).attr('value');
                    var ComId = $('#' + CompId).attr('AccountId');
                    s += ComCode + ':' + ComId + ',';
                }
            }
            //for (var k = 0; k < strsplit.length; k++) {
              
            //    var strvalue = strsplit[k];
            //    if (k == 0)
            //    {
            //        var strvalue = strsplit[k];
            //    }
            //    else if (k == 1)
            //    {
            //        var strvalue = strsplit[0] +'>'+ strsplit[k];
            //    }
            //    else if (k == 2) {
            //        var strvalue = strsplit[0] + '>' + strsplit[1] + '>' + strsplit[2];
            //    }

            //    for (var j = 0; j < GblAccountList.length; j++) {
            //        if (strvalue == GblAccountList[j].AccountCode) {
            //            s+= strvalue + ':' + GblAccountList[j].AccountID + ',';
            //        }
            //    }
            //}
             s=  s.substring(0, s.length - 1);

        }
        if (strEpisode == i) {
            s = ssAllEpisode;
        }
        if (i == 0)
        {
            s1 = s;
            if (s1 == 'undefined:undefined'){s1 = '';}
        }
        else if (i == 1)
        {
            s2 = s;
            if (s2 == 'undefined:undefined') { s2 = ''; }
        }
        else if (i == 2)
        {
            s3 = s;
            if (s3 == 'undefined:undefined') { s3 = ''; }
        }
        else if (i == 3) {
            s4 = s;
            if (s4 == 'undefined:undefined') { s4 = ''; }
        }
        else if (i == 4) {
            s5 = s;
            if (s5 == 'undefined:undefined') { s5 = ''; }
        }
        else if (i == 5) {
            s6 = s;
            if (s6 == 'undefined:undefined') { s6 = ''; }
        }
        else if (i == 6) {
            s7 = s;
            if (s7 == 'undefined:undefined') { s7 = ''; }
        }
        else if (i == 7) {
            s8 = s;
            if (s8 == 'undefined:undefined') { s8 = ''; }
        }

    }

    var objCOA = {
        s1: s1,
        s2: s2,
        s3: s3,
        s4: s4,
        s5: s5,
        s6: s6,
        s7: s7,
        s8: s8,
        ProdID: localStorage.ProdId
    }
    $.ajax({
        url: APIUrlGenrateCOA,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(objCOA),
    })
         .done(function (response)
         { SaveCOAManualSucess(response); })
         .fail(function (error)
         { ShowMSG(error); })
}
function SaveCOAManualSucess(response) {
    if (response == 0) {
        ShowMsgBox('showMSG', 'COA  Already Exists ..!!', '', '');

    }
    else {
        ShowMsgBox('showMSG', 'COA Saved Successfully..!!', '', '');
        GetCOA();
        $('#COAManual').hide();
        $('#fade').hide();

    }
}
//--------------------------------------------------- Close Popup
function CloseWizardPopup() {
    $('#episodeWizard').hide();
    $('#tblLedgerDetailTBody').html('');
    $('#DvAccounts').empty();
    $('#DvLedgerDetail').hide();
    $('#fade').hide();

}


$(document).on('keydown', 'input.detectTab', function (e) {
    var strId = e.currentTarget.id;
    var strVal = $('#' + strId).val();
    $('#' + strId).blur(function () {
        isvalid = false;
        if (strVal == '' || strVal == undefined || strVal == null) {

            $('#' + strId).attr('style', 'border-color:red;');
            return false;
        }
        else {

            $('#' + strId).attr('style', 'border-color:#d2d6de;');
            return true;
        }
    });
});

//=================

function CloseCOAPopup()

{
    $('#COAManual').hide();
    $('#fade').hide();


}


function funShowTextBox(value) {
    var strval = $('#spn_' + value).text();
    $('#spn_' + value).hide();
    $('#txt_' + value).val(strval);
    $('#txt_' + value).show();

    $('#txt_' + value).focus();
    $('#txt_' + value).select();


}
function funShowSpan(value) {
    var strval = $('#txt_' + value).val().trim();
    $('#txt_' + value).hide();
    $('#spn_' + value).text(strval);
    $('#spn_' + value).show();

    ///////////// Ajax Calling 


    $.ajax({
        url: APIUrlUpdateCOADescriptionById + '?COAId=' + value + '&Description=' + strval,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        // async: false,
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ UpdateCOADescriptionByIdSucess(response); })
.fail(function (error)
{ ShowMSG(error); })

}
function UpdateCOADescriptionByIdSucess(response) {

}