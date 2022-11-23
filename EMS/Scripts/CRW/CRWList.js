
var APIUrlFillSegment = HOST + "/api/Payroll/GetSegmentForPayroll";
var APIUrlFillAccount = HOST + "/api/CRW/GetAccountForCRWFromBudget";
var APIUrlFillLocation = HOST + "/api/CRW/GetLocationForCRWFromBudget";
var APIUrlFillEpisode = HOST + "/api/CRW/GetEpisodeForCRWFromBudget";
var APIUrlFillBudgetForCompany = HOST + "/api/CRW/GetBudgetByCompanyForCRW";
var APIUrlFillCrwDetailData = HOST + "/api/CRW/GetCRWDetail";
var APIUrlFillCrwDetailData1 = HOST + "/api/CRW/GetDetailLevelAccountCRW";

var APIUrlGetCRWInfo = HOST + "/api/CRW/GetCRWRollUp";
var APIUrlGetCRWNote = HOST + "/api/CRW/GetCRWNotesNew";
var APIUrlGetPODetailListCRW = HOST + "/api/CRW/GetPODetailListCRW";
var APIUrlGetInvoiceDetailListCRW = HOST + "/api/CRW/GetInvoiceDetailListCRW";
var GetJEDetailListCRW = HOST + "/api/CRW/GetJEDetailListCRW";

var APIUrlEFCUpdate = HOST + "/api/CRW/UpdateCRWEFC";
var APIUrlETCUpdate = HOST + "/api/CRW/UpdateCRWETC";
var APIUrlUpdateCRWNote = HOST + "/api/CRW/UpdateCRWNotes";
var APIUrlSaveCRWNote = HOST + "/api/CRW/SaveCRWNotes";
var APIUrlDeleteCRWNote = HOST + "/api/CRW/DeleteCRWNotes";


var APIUrlGetSetForCRW = HOST + "/api/CRW/GetSetForCRW";
var APIUrlGetSeriesForCRW = HOST + "/api/CRW/GetSeriesForCRW";
var APIUrlUpdateBudget = HOST + "/api/CRW/UpdateCRWBudget";
var APIUrlUpdateCRWSetBudget = HOST + "/api/CRW/UpdateCRWSetBudget";
var APIUrlEFCSetUpdate = HOST + "/api/CRW/UpdateCRWSetEFC";
var APIUrlETCSetUpdate = HOST + "/api/CRW/UpdateCRWSetETC";
var APIUrlUpdateBudgetBlank = HOST + "/api/CRW/UpdateCRWBudgetBlank";
var APIUrlEFCBlankUpdate = HOST + "/api/CRW/UpdateBlankEFC";

var APIUrlRollUpBudget = HOST + "/api/CRW/CRWBudgetAmountRollUp";
var APIUrlDistributionBudget = HOST + "/api/CRW/CRWBudgetAmountDistribution";
var APIUrlDistributionBudgetAfterL2 = HOST + "/api/CRW/CRWBudgetAmountDistributionAfterL2";
var APIUrlCRWLockRow = HOST + "/api/CRW/CRWLockRow";

var APIUrlCheckSetSegment = HOST + "/api/CRW/CheckForSetSegment";
var APIUrlCheckForSegment = HOST + "/api/CRW/CheckForSegment";

var CompanyIDCrw;
var rowIDCRW;
var rowIDCRW1;
var rowIDCRW2;
var rowIDCRW3;
var OldrowIDCRW = '';
var OldrowIDCRW1 = '';
var OldrowIDCRW2 = '';
var OldrowIDCRW3 = '';
var BudgetIDCrw;
var BudgetFileIDCrw;
var BudgetCategoryIDCrw;
var BudAccID;
var AccountTabPressed = 'NO';
var AccountCurrentColumn = 0;
var iiValue;
var COAIDforNotes;
var COAIDforRollUp;
var BudgetAmtRollUp;
var AhrefRollUp;
var LiIDG;
var BudgetNameG;

var ID7;
var Parentt7;
var DLevel7;
var RowID7;
var Posting7;
var ExpandStatus7;
var BudgetAmt7;
var BudgetChild7;

var GlobalID1 = '';
var GlobalID2 = '';
var GlobalID3 = '';
var GlobalID4 = '';
var GlobalID5 = '';
var GlobalID6 = '';
var GlobalIDSet = '';
//var GlobalID6 = '';
var CurrentRowID = '';
var CurrentRowIDSet = '';
var CurrentRowIDSeries = '';

var L1 = 0;
var L2 = 0;
var L3 = 0;
var L4 = 0;
var L5 = 0;

var CheckSetStatus = 'NO'
var IsUpdated = 'OK';
var CheckDTStatus = '';

var TT1 = 0;
var TT2 = 0;
var TT3 = 0;
var TT4 = 0;
var TT5 = 0;
var TT6 = 0;
var TT7 = 0;
var TT8 = 0;

$(document).ready(function () {
    CheckSetStatus1();
    $('.w2ui-fieldInt').w2field('int');
    $('.main-sidebar').attr('style', 'display:none;');
    $('.content-wrapper').attr('style', 'margin-left:0;');
    $('.sidebar-toggle').attr('style', 'display:none;');

    FillCompany();
    FillSegment();
    ChecksegmentAfterDT();
});

function FillCompany() {
    $.ajax({
        url: APIUrlFillAccount + '?ProdId=' + localStorage.ProdId,
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
    $('#ddlCompany').append('<option value=0>Select Company</option>');
    for (var i = 0; i < response.length; i++) {
        $('#ddlCompany').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
    }
    $('#ddlLocation').empty();
    $('#ddlEpisode').empty();
}

function FillLocation() {
    $('#ddlLocation').empty();
    $('#ddlEpisode').empty();
    var CO = $('select#ddlCompany option:selected').val();

    $.ajax({
        url: APIUrlFillLocation + '?ProdId=' + localStorage.ProdId + '&CO=' + CO,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ FillLocationSucess(response); })
.fail(function (error)
{ ShowMSG(error); })
}

function FillLocationSucess(response) {
    $('#ddlLocation').append('<option value=0>Select Location</option>');
    for (var i = 0; i < response.length; i++) {
        var Check = parseInt(response[i].AccountCode);
        if (Check > 0) {
            $('#ddlLocation').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
        }
    }
}

function FillEpisode() {

    $('#ddlEpisode').empty();
    var CO = $('select#ddlCompany option:selected').val();
    var LO = $('select#ddlLocation option:selected').val();

    $.ajax({
        url: APIUrlFillEpisode + '?ProdId=' + localStorage.ProdId + '&CO=' + CO + '&LO=' + LO,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response) {
    FillEpisodeSucess(response);
    // FillBudgetForCompany('', '', 2);
})
.fail(function (error)
{ ShowMSG(error); })
}

function FillEpisodeSucess(response) {
    $('#ddlEpisode').append('<option value=0>Select Episode</option>');
    for (var i = 0; i < response.length; i++) {
        var Check = parseInt(response[i].AccountCode);
        if (Check > 0) {
            $('#ddlEpisode').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
        }
    }
}

function CO() {
    FillLocation();
    FillEpisode();
    FillBudgetForCompany('', '', 1);
}

function LO() {
    var CO = $('select#ddlCompany option:selected').val();
    var LO = $('select#ddlLocation option:selected').val();
    if (LO == '0') {
        FillBudgetForCompany(LO, '', 1);
    }
    else {
        FillBudgetForCompany(LO, '', 2);
    }
    FillEpisode();
}

function EP() {
    var EP = $('select#ddlEpisode option:selected').val();
    var LO = $('select#ddlLocation option:selected').val();
    if (EP == '0') {
        FillBudgetForCompany(LO, EP, 2);
    }
    else {
        FillBudgetForCompany(LO, EP, 3);
    }
}

function FillBudgetForCompany(LO, EP, Mode) {
    var CompanyCode = $('select#ddlCompany option:selected').val();
    if (CompanyCode != '0') {
        $.ajax({
            url: APIUrlFillBudgetForCompany + '?CompanCode=' + CompanyCode + '&ProdID=' + localStorage.ProdId + '&LO=' + LO + '&EP=' + EP + '&Mode=' + Mode,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response)
        { FillBudgetForCompanySucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
    }
    else {
        $('#ulBudgetList').html('');
        $('#tbodyCrw').html('');
        $('#ddlLocation').empty();
        $('#ddlEpisode').empty();
        $('.w2ui-fieldInt').w2field('int');
    }
}

function ShowMSG(error) {
    console.log(error);
}

function FillBudgetForCompanySucess(response) {
    var heightt = $(window).height();
    heightt = heightt - 50;
    $('#tbodyCrw').attr('style', 'height:' + heightt + 'px;');
    var TLength = response.length;
    var str = '';
    if (TLength > 0) {
        var str = '';
        for (var i = 0; i < TLength; i++) {
            str += "<li id=li" + i + "><a  href='javascript:GetCRW(" + i + "," + response[i].Budgetid + "," + response[i].BudgetFileID + ",\"" + response[i].BudgetName + "\",1);'>" + response[i].BudgetName + "</a></li>"
        }
    }
    else {
        ShowMsgBox('showMSG', 'No Budgets have been loaded for Company - ' + $('select#ddlCompany option:selected').val() + '', '', 'failuremsg');
    }
    $('#ulBudgetList').html(str);
    $('#tbodyCrw').html('');
    $('.w2ui-fieldInt').w2field('int');
}

function GetCRW(liID, BudgetID, BudgetFileID, BudgetName, RollUpCheck) {

    LiIDG = liID;
    BudgetNameG = BudgetName;
    BudgetIDCrw = BudgetID;
    BudgetFileIDCrw = BudgetFileID;

    $('#ulBudgetList li').removeClass('active');
    $('#li' + liID).addClass('active');
    $('#spanBudget').html('Budget : - ' + BudgetName);

    $.ajax({
        url: APIUrlGetCRWInfo + '?BudgetFileID=' + BudgetFileID + '&BudgetID=' + BudgetID + '&Prodid=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetCRWSucess(response, RollUpCheck); })
    .fail(function (error)
    { ShowMSG(error); })
}

function GetCRWSucess(response, RollUpCheck) {

    $('#tblCrwFooterDiv').attr('style', 'dispaly:block;');
    $('#tblCrwFooter').attr('style', 'dispaly:block;');

    var TLength = response.length;
    var str = '';
    var ChildCount;
    var BudgetAmt = 0;
    var Posting = '0';
    var LastAccountName;
    if (TLength > 0) {
        var str = '';
        for (var i = 0; i < TLength; i++) {
            var TotalCost1 = response[i].ActualtoDate1 + response[i].POAmount1;
            var TotalCost = response[i].ActualtoDate + response[i].POAmount;
            var DetailLevel = response[i].detaillevel;
            var Parent = response[i].PARENT;
            var Child = response[i].CHILD;
            var BlankCheck = response[i].AccountName;
            var IsPosting = Boolean(response[i].Posting == 1);

            if (BlankCheck == '(Blank)') {

                str += '<tr id="trBlank_' + response[i].COAID + '" class="trBlankR abcd">';
                str += '<td></td>';
                str += '<td>' + response[i].AccountCode + '</td>';
                if (CheckSetStatus == 'YES') {
                    str += '<td></td>';
                    str += '<td></td>';
                }
                else {
                }

                str += '<td><b>' + LastAccountName + '</b></td>';
                str += '<td>' + response[i].ActualthisPeriod + '</td>';
                str += '<td>' + response[i].ActualtoDate + '</td>';
                str += '<td>' + response[i].POAmount + '</td>';
                str += '<td><span id=spanTotalHeaderb' + response[i].COAID + '>' + TotalCost + '</span></td>';

                var ETCCC;
                var NewD = parseInt(DetailLevel) - 1;
                var BEFC;
                if (parseInt(ChildNo) > 0) {

                    BEFC = response[i].BlankEFC;
                    ETCCC = parseFloat(BEFC) - parseFloat(TotalCost);

                    str += '<td id=tdETCb' + response[i].COAID + ' onclick="javascript:EditETCb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETCb' + response[i].COAID + '">' + ETCCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCCC + '" id="txtETCb' + response[i].COAID + '" onfocusout="javascript:UpdateETCb(' + response[i].COAID + ',' + NewD + ');"/></td>';
                    str += '<td id=tdEFCb' + response[i].COAID + ' onclick="javascript:EditEFCb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFCb' + response[i].COAID + '">' + BEFC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + BEFC + '" id="txtEFCb' + response[i].COAID + '" onfocusout="javascript:UpdateEFCb(' + response[i].COAID + ',' + NewD + ');"/> </td>';
                    str += '<td id=tdBb' + response[i].COAID + ' onclick="javascript:EditBudgetb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanSumHeaderb' + response[i].COAID + '">' + response[i].BlankBudget.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].BlankBudget + '" id="txtBudgetb' + response[i].COAID + '" onfocusout="javascript:UpdateBudgetb(' + response[i].COAID + ',' + NewD + ');"/> </td>';
                    var Variance = (response[i].BlankBudget) - (BEFC);
                }
                else {
                    if (IsPosting == 1) {

                        if (parseFloat(response[i].BlankEFC) > 0) {
                            BEFC = response[i].BlankEFC; // If a Blank EFC is present, then set the BEFC to that
                        }
                        else {
                            BEFC = 0; //response[i].Budget; // Otherwise, there should be no EFC
                        }


                        ETCCC = parseFloat(BEFC) - parseFloat(TotalCost);


                        //  ETCCC = parseFloat(response[i].EFC) - parseFloat(TotalCost);
                        str += '<td id=tdETCb' + response[i].COAID + ' onclick="javascript:EditETCb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETCb' + response[i].COAID + '">' + ETCCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCCC + '" id="txtETCb' + response[i].COAID + '" onfocusout="javascript:UpdateETCb(' + response[i].COAID + ',' + NewD + ');"/></td>';
                        str += '<td id=tdEFCb' + response[i].COAID + ' onclick="javascript:EditEFCb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFCb' + response[i].COAID + '">' + BEFC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + BEFC + '" id="txtEFCb' + response[i].COAID + '" onfocusout="javascript:UpdateEFCb(' + response[i].COAID + ',' + NewD + ');"/> </td>';
                        str += '<td id=tdBb' + response[i].COAID + ' onclick="javascript:EditBudgetb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanSumHeaderb' + response[i].COAID + '">' + response[i].Budget.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].Budget + '" id="txtBudgetb' + response[i].COAID + '" onfocusout="javascript:UpdateBudgetb(' + response[i].COAID + ',' + NewD + ');"/> </td>';
                        var Variance = (response[i].Budget) - (BEFC);
                    }
                    else {
                        ETCCC = parseFloat(response[i].EFC) - parseFloat(TotalCost);
                        str += '<td id=tdETCb' + response[i].COAID + ' onclick="javascript:EditETCb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETCb' + response[i].COAID + '">' + ETCCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCCC + '" id="txtETCb' + response[i].COAID + '" onfocusout="javascript:UpdateETCb(' + response[i].COAID + ',' + NewD + ');"/></td>';
                        str += '<td id=tdEFCb' + response[i].COAID + ' onclick="javascript:EditEFCb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFCb' + response[i].COAID + '">' + response[i].EFC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].EFC + '" id="txtEFCb' + response[i].COAID + '" onfocusout="javascript:UpdateEFCb(' + response[i].COAID + ',' + NewD + ');"/> </td>';
                        str += '<td id=tdBb' + response[i].COAID + ' onclick="javascript:EditBudgetb(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanSumHeaderb' + response[i].COAID + '">' + response[i].BlankBudget.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].BlankBudget + '" id="txtBudgetb' + response[i].COAID + '" onfocusout="javascript:UpdateBudgetb(' + response[i].COAID + ',' + NewD + ');"/> </td>';
                        var Variance = (response[i].BlankBudget) - (response[i].EFC);
                    }

                }

                str += '<td><span id=spanVarianceHeaderb' + response[i].COAID + '>' + Variance.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';

                str += '</tr>';

                ChildCount = response[i].ChildCount;
                Posting = response[i].Posting;
            }
            else {

                var ReturnValueDrillDown = 0;
                var ExpandValue = response[i].ExpandValue;
                var BudgetParent = response[i].Budget;
                var BudgetChild = response[i].Budget1;
                var ChildNo = response[i].ChildCount;

                if (parseInt(ExpandValue) == 9) { ReturnValueDrillDown = 9; } // If the header has never been expanded, then prompt to distribute
                if (ChildNo == 0 && IsPosting == 1) { ReturnValueDrillDown = 8; } // If there is no child and posting is allowed, then Drill to Blank
                if (ChildNo > 0 && BudgetChild == 0 && parseInt(ExpandValue) != 0) {
                    ReturnValueDrillDown = 2;
                    BudgetChild = BudgetParent;
                } // If you have more than on child and the Child Budget > 0 then don't prompt



                if (CheckDTStatus == 'YES') {
                    if (DetailLevel == '1') {
                        str += '<tr class="greenRow">';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str += '<td><a id=al' + response[i].COAID + ' href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a></td>';
                        }
                        else if (ChildNo > 0) {
                            str += '<td><a id=al' + response[i].COAID + ' href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a></td>';
                        }
                        else {
                            str += '<td></td>';
                        }
                        str += '<td>' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '2') {

                        str += '<tr class="drilldown crwDetailRowL2 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';
                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {

                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }

                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '3') {
                        str += '<tr class="drilldown crwDetailRowL3 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }

                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '4') {
                        str += '<tr class="drilldown crwDetailRowL4 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                            str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                            str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                            str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                        }
                    }
                    else if (DetailLevel == '5') {
                        str += '<tr class="drilldown crwDetailRowL5 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }
                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '6') {
                        str += '<tr class="drilldown crwDetailRowL6 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + '),' + BudgetChild + ';"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }
                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                }
                    ///////////////////////////////////////////////////////////////////////////
                else if ((CheckDTStatus == 'NO') && (ChildNo == 0)) {
                    if (DetailLevel == '1') {
                        str += '<tr class="greenRow">';

                        str += '<td></td>';

                        str += '<td>' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '2') {

                        str += '<tr class="drilldown crwDetailRowL2 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';
                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '3') {
                        str += '<tr class="drilldown crwDetailRowL3 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '4') {
                        str += '<tr class="drilldown crwDetailRowL4 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';

                    }
                    else if (DetailLevel == '5') {
                        str += '<tr class="drilldown crwDetailRowL5 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';


                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '6') {
                        str += '<tr class="drilldown crwDetailRowL6 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';


                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                }
                else {

                    if (DetailLevel == '1') {
                        str += '<tr class="greenRow">';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str += '<td><a id=al' + response[i].COAID + ' href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a></td>';
                        }
                        else if (ChildNo > 0) {
                            str += '<td><a id=al' + response[i].COAID + ' href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a></td>';
                        }
                        else {
                            str += '<td></td>';
                        }
                        str += '<td>' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '2') {

                        str += '<tr class="drilldown crwDetailRowL2 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';
                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {

                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }

                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '3') {
                        str += '<tr class="drilldown crwDetailRowL3 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }

                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '4') {
                        str += '<tr class="drilldown crwDetailRowL4 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                            str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                            str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                            str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                        }
                    }
                    else if (DetailLevel == '5') {
                        str += '<tr class="drilldown crwDetailRowL5 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" class="fa fa-chevron-right"></i><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }
                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                    else if (DetailLevel == '6') {
                        str += '<tr class="drilldown crwDetailRowL6 abcd pH' + Parent + '">';
                        str += '<td></td>';
                        var str11 = '';

                        var ChildNo = response[i].ChildCount;
                        if (IsPosting == true) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + '),' + BudgetChild + ';"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else if (ChildNo > 0) {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a>';
                        }
                        else {
                            str11 = '<a id=al' + response[i].COAID + ' class="levelClsDistance" href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ',' + ReturnValueDrillDown + ',' + BudgetParent + ',' + ChildNo + ',' + BudgetChild + ');"></a>';
                        }
                        str += '<td>' + str11 + '' + response[i].AccountCode + '</td>';
                    }
                }

                LastAccountName = response[i].AccountName;

                if (CheckSetStatus == 'YES') {
                    str += '<td></td>';
                    str += '<td></td>';
                }
                else {
                }

                str += '<td>' + response[i].AccountName + '</td>';
                str += '<td>' + numeral(response[i].ActualthisPeriod1.toFixed(0)).format('0,0') + '</td>'; //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
                str += '<td>' + numeral(response[i].ActualtoDate1.toFixed(0)).format('0,0') + '</td>'; //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
                str += '<td>' + numeral(response[i].POAmount1.toFixed(0)).format('0,0') + '</td>'; //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
                str += '<td><span id=spanTotalHeader' + response[i].COAID + '>' + numeral(TotalCost1.toFixed(0)).format('0,0') + '</span></td>'; //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';

                var FinalBB;
                var EFCC = response[i].EFC;
                if (EFCC >= 0) {

                }
                else {
                    if (ChildNo == 0) {
                        EFCC = response[i].Budget;
                    }
                    else {
                        if (parseFloat(response[i].Budget1) > 0) {
                            EFCC = response[i].Budget1;
                        }
                        else {
                            EFCC = response[i].Budget;
                        }
                    }
                }
                var ETCC = 0;
                ETCC = (EFCC) - (TotalCost1);
                if (ChildNo == 0) {
                    FinalBB = parseFloat(response[i].Budget);
                } else {
                    FinalBB = parseFloat(response[i].Budget1); //Child Budget
                }

                if ((parseInt(response[i].ExpandValue) == 9 || (response[i].Posting == false))) {
                    str += '<td><span class="CRWHide" id="spanETC' + response[i].COAID + '">' + numeral(ETCC.toFixed(0)).format('0,0') + '</span></td>'; //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';
                    str += '<td><span class="CRWHide" id="spanEFC' + response[i].COAID + '">' + numeral(EFCC.toFixed(0)).format('0,0') + '</span></td>'; //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';
                    str += '<td><span id=spanSumHeader' + response[i].COAID + '>' + numeral(FinalBB.toFixed(0)).format('0,0') + '</span></td>'; //.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';
                    var Variance = parseFloat(FinalBB) - (EFCC);
                } else if ((ReturnValueDrillDown == 9)) {
                    if (parseInt(ChildNo) == 0) {
                        str += '<td id=tdETC' + response[i].COAID + ' onclick="javascript:EditETC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETC' + response[i].COAID + '">' + ETCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCC + '" id="txtETC' + response[i].COAID + '" onfocusout="javascript:UpdateETC(' + response[i].COAID + ',' + DetailLevel + ');"/></td>';
                        str += '<td id=tdEFC' + response[i].COAID + ' onclick="javascript:EditEFC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFC' + response[i].COAID + '">' + EFCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + EFCC + '" id="txtEFC' + response[i].COAID + '" onfocusout="javascript:UpdateEFC(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                        str += '<td id=tdB' + response[i].COAID + ' onclick="javascript:EditBudget(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanSumHeader' + response[i].COAID + '">' + response[i].Budget.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].Budget + '" id="txtBudget' + response[i].COAID + '" onfocusout="javascript:UpdateBudget(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                        var Variance = FinalBB - (EFCC);
                    } else {
                        str += '<td><span class="CRWHide" id="spanETC' + response[i].COAID + '">' + ETCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';
                        str += '<td><span class="CRWHide" id="spanEFC' + response[i].COAID + '">' + EFCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';
                        str += '<td><span id=spanSumHeader' + response[i].COAID + '>' + FinalBB.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span></td>';
                        var Variance = parseFloat(response[i].Budget1) - (EFCC);
                    }
                } else if ((ReturnValueDrillDown == 0)) {
                    if (parseInt(ChildNo) == 0) {
                        str += '<td id=tdETC' + response[i].COAID + ' onclick="javascript:EditETC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETC' + response[i].COAID + '">' + ETCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCC + '" id="txtETC' + response[i].COAID + '" onfocusout="javascript:UpdateETC(' + response[i].COAID + ',' + DetailLevel + ');"/></td>';
                        str += '<td id=tdEFC' + response[i].COAID + ' onclick="javascript:EditEFC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFC' + response[i].COAID + '">' + EFCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + EFCC + '" id="txtEFC' + response[i].COAID + '" onfocusout="javascript:UpdateEFC(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                        str += '<td id=tdB' + response[i].COAID + ' onclick="javascript:EditBudget(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanSumHeader' + response[i].COAID + '">' + FinalBB.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].Budget + '" id="txtBudget' + response[i].COAID + '" onfocusout="javascript:UpdateBudget(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                        var Variance = FinalBB - (EFCC);
                    } else {
                        str += '<td id=tdETC' + response[i].COAID + ' onclick="javascript:EditETC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETC' + response[i].COAID + '">' + ETCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCC + '" id="txtETC' + response[i].COAID + '" onfocusout="javascript:UpdateETC(' + response[i].COAID + ',' + DetailLevel + ');"/></td>';
                        str += '<td id=tdEFC' + response[i].COAID + ' onclick="javascript:EditEFC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFC' + response[i].COAID + '">' + EFCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + EFCC + '" id="txtEFC' + response[i].COAID + '" onfocusout="javascript:UpdateEFC(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                        str += '<td id=tdB' + response[i].COAID + ' onclick="javascript:EditBudget(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanSumHeader' + response[i].COAID + '">' + FinalBB.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + FinalBB + '" id="txtBudget' + response[i].COAID + '" onfocusout="javascript:UpdateBudget(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                        var Variance = FinalBB - (EFCC);
                    }
                } else {
                    str += '<td id=tdETC' + response[i].COAID + ' onclick="javascript:EditETC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETC' + response[i].COAID + '">' + ETCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCC + '" id="txtETC' + response[i].COAID + '" onfocusout="javascript:UpdateETC(' + response[i].COAID + ',' + DetailLevel + ');"/></td>';
                    str += '<td id=tdEFC' + response[i].COAID + ' onclick="javascript:EditEFC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFC' + response[i].COAID + '">' + EFCC.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + EFCC + '" id="txtEFC' + response[i].COAID + '" onfocusout="javascript:UpdateEFC(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                    str += '<td id=tdB' + response[i].COAID + ' onclick="javascript:EditBudget(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanSumHeader' + response[i].COAID + '">' + FinalBB.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + FinalBB + '" id="txtBudget' + response[i].COAID + '" onfocusout="javascript:UpdateBudget(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';
                    var Variance = FinalBB - (EFCC);
                }

                var NotesCnt = response[i].NotesCount;
                if (NotesCnt > 0) {
                    str += '<td><span id=spanVarianceHeader' + response[i].COAID + '>' + numeral(Variance.toFixed(0)).format('0,0') + '</span><a style="float:right;" href="javascript:ShowNotes(\'' + response[i].COAID + '\',' + i + ')"><i id=iik' + i + ' class="fa fa-pencil-square-o" style="color:Red;"></i></a></td>';
                }
                else {
                    str += '<td><span id=spanVarianceHeader' + response[i].COAID + '>' + numeral(Variance.toFixed(0)).format('0,0') + '</span><a style="float:right;" href="javascript:ShowNotes(\'' + response[i].COAID + '\',' + i + ')"><i id=iik' + i + ' class="fa fa-pencil-square-o" style="color:#5C8FBE;"></i></a></td>';
                }

                str += '</tr>';

                ChildCount = response[i].ChildCount;
                Posting = response[i].Posting;
            }

            if (DetailLevel == 1) {
                TT1 += response[i].ActualthisPeriod1;
                TT2 += response[i].ActualtoDate1;
                TT3 += response[i].POAmount1;
                TT4 += TotalCost1;
                TT5 += ETCC;
                TT6 += EFCC;
                TT7 += FinalBB;

            }
        }
        TT8 = TT7 - TT6;
        // var strAmount = parseFloat(response[i].OriginalAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        $('#spanFPeriod').html(TT1.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFPO').html(TT2.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFActual').html(TT3.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFTC').html(TT4.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFetc').html(TT5.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFefc').html(TT6.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFBudget').html(TT7.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFVariance').html(TT8.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    }
    else {
        ShowMsgBox('showMSG', 'No Budgets have been loaded for Company - ' + $('select#ddlCompany option:selected').val() + '', '', 'failuremsg');
    }

    str += '<tr><td colspan=12></td></tr>';
    str += '<tr><td colspan=12></td></tr>';
    str += '<tr><td colspan=12></td></tr>';
    str += '<tr><td colspan=12></td></tr>';
    str += '<tr><td colspan=12></td></tr>';
    $('#tbodyCrw').html(str);
    $('.w2ui-fieldInt').w2field('int');

    if (RollUpCheck == 'YES') {
        ShowNextLevel(ID7, Parentt7, DLevel7, RowID7, Posting7, 9, BudgetAmt7, 0, BudgetChild7);
    }
}

function ShowNextLevel(ID, Parentt, DLevel, RowID, Posting, ExpandStatus, BudgetAmt, ChildNo, ChildAmt) {

    if (IsUpdated == 'OK') {
    }
    else {
        $('#ddlCompany').focus();
    }

    try {
        if (parseInt(ExpandStatus) == 9) {
            BudgetAmt = 0;

        }

        else {
            BudgetAmt = $('#txtBudget' + ID).val();
            BudgetAmt = BudgetAmt.replace(/,/g, "");
        }
    }
    catch (e) {
        BudgetAmt = 0;
    }

    ID7 = ID;
    Parentt7 = Parentt;
    DLevel7 = DLevel;
    RowID7 = RowID;
    Posting7 = Posting;
    ExpandStatus7 = ExpandStatus;
    BudgetAmt7 = BudgetAmt;
    BudgetChild7 = ChildAmt;

    if (ExpandStatus == 1) {
        COAIDforRollUp = ID;
        BudgetAmtRollUp = BudgetAmt;
        showDiv('dvConfirm');
    }
    else if (ExpandStatus == 8) {
        LockRow(ID, DLevel, RowID);
    }
    else if (ExpandStatus == 2) {
        COAIDforRollUp = ID;
        BudgetAmtRollUp = BudgetAmt;
        if (parseInt(DLevel) > 1) {
            showDiv('dvConfirmL2Plus');
        }
        else {
            showDiv('dvConfirm');
        }

    }
    else if (ExpandStatus == 3) {
        COAIDforRollUp = ID;
        BudgetAmtRollUp = BudgetAmt;
        showDiv('dvConfirmL2Plus');
    }
    else {

        $('.trBlankR').addClass('abcd');

        if (DLevel == 1) {
            //if (ExpandStatus == 9) {
            //    GlobalID1 = '';
            //}
            if (ID == GlobalID1) {
                $('.drilldown').addClass('abcd');
                $('.ArrowCls').removeClass('fa fa-chevron-down');
                $('.ArrowCls').addClass('fa fa-chevron-right');
                GlobalID1 = '';
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
            }
            else {
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                CurrentRowID = RowID;

                if (Posting == 1) {
                    $('#trBlank_' + ID).removeClass('abcd');
                    GetSet(ID);
                }

                GlobalCOAID = ID;
                GlobalID1 = ID;
                $('.ArrowCls').removeClass('fa fa-chevron-down');
                $('.ArrowCls').addClass('fa fa-chevron-right');
                $('.drilldown td a li').addClass('fa fa-chevron-right');
                $('.drilldown').addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
                $('.pH' + Parentt).removeClass('abcd');

            }
        }
        if (DLevel == 2) {

            $(".crwDetailRowL3").addClass('abcd');
            $(".crwDetailRowL4").addClass('abcd');
            $(".crwDetailRowL5").addClass('abcd');
            $(".crwDetailRowL6").addClass('abcd');

            if (ID == GlobalID2) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID2 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID2 = ID;
                if (Posting == 1) {
                    $('#trBlank_' + ID).removeClass('abcd');
                    GetSet(ID);
                }
                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }
        if (DLevel == 3) {

            $(".crwDetailRowL4").addClass('abcd');
            $(".crwDetailRowL5").addClass('abcd');
            $(".crwDetailRowL6").addClass('abcd');
            if (ID == GlobalID3) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID3 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID3 = ID;

                if (Posting == 1) {
                    $('#trBlank_' + ID).removeClass('abcd');
                    GetSet(ID);
                }
                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }


        if (DLevel == 4) {

            $(".crwDetailRowL5").addClass('abcd');
            $(".crwDetailRowL6").addClass('abcd');
            if (ID == GlobalID4) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID4 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID4 = ID;

                if (Posting == 1) {
                    $('#trBlank_' + ID).removeClass('abcd');
                    GetSet(ID);
                }
                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }

        if (DLevel == 5) {

            $(".crwDetailRowL6").addClass('abcd');
            if (ID == GlobalID5) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID5 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID5 = ID;

                if (Posting == 1) {
                    $('#trBlank_' + ID).removeClass('abcd');
                    GetSet(ID);
                }
                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }

        if (DLevel == 6) {
            if (ID == GlobalID6) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID6 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID6 = ID;

                if (Posting == 1) {
                    $('#trBlank_' + ID).removeClass('abcd');
                    GetSet(ID);
                }
                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }
    }
}

function ShowSubDetailL2(rowID, BudgetID, BudgetFileID, BudgetCategoryID) {
    BudgetIDCrw = BudgetID;
    BudgetFileIDCrw = BudgetFileID;
    BudgetCategoryIDCrw = BudgetCategoryID;
    L1 = rowID;

    rowIDCRW = rowID;
    if (OldrowIDCRW == '') {
        if (OldrowIDCRW == '0') {
            OldrowIDCRW = '';
            $(".crwDetailRowL2").remove();
            $(".crwDetailRowL3").remove();
            $(".crwDetailRowSet").remove();
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls').removeClass('fa fa-chevron-down');
            $('.ArrowCls').addClass('fa fa-chevron-right');
            $('#ii' + rowID).removeClass('fa fa-chevron-right');
            $('#ii' + rowID).addClass('fa fa-chevron-right');
        }
        else {
            OldrowIDCRW = rowIDCRW;
            $(".crwDetailRowL2").remove();
            $(".crwDetailRowL3").remove();
            $(".crwDetailRowSet").remove();
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls').removeClass('fa fa-chevron-down');
            $('.ArrowCls').addClass('fa fa-chevron-right');
            $('#ii' + rowID).removeClass('fa fa-chevron-right');
            $('#ii' + rowID).addClass('fa fa-chevron-down');
            GetDetail(BudgetID, BudgetFileID, BudgetCategoryID);
        }
    }
    else if (OldrowIDCRW == rowIDCRW) {
        OldrowIDCRW = '';
        $(".crwDetailRowL2").remove();
        $(".crwDetailRowL3").remove();
        $(".crwDetailRowSet").remove();
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls').removeClass('fa fa-chevron-down');
        $('.ArrowCls').addClass('fa fa-chevron-right');
        $('#ii' + rowID).removeClass('fa fa-chevron-right');
        $('#ii' + rowID).addClass('fa fa-chevron-right');
    }
    else {
        OldrowIDCRW = rowIDCRW;
        $(".crwDetailRowL2").remove();
        $(".crwDetailRowL3").remove();
        $(".crwDetailRowSet").remove();
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls').removeClass('fa fa-chevron-down');
        $('.ArrowCls').addClass('fa fa-chevron-right');
        $('#ii' + rowID).removeClass('fa fa-chevron-right');
        $('#ii' + rowID).addClass('fa fa-chevron-down');

        GetDetail(BudgetID, BudgetFileID, BudgetCategoryID);
    }
}

function GetDetail(BudgetID, BudgetFileID, BudgetCategoryID) {

    $.ajax({
        url: APIUrlFillCrwDetailData + '?CID=' + CompanyIDCrw + '&&BudgetID=' + BudgetID + '&&BudgetFileID=' + BudgetFileID + '&&BudgetCategoryID=' + BudgetCategoryID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetDetailSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function GetDetailSucess(response) {
    var TLength = response.length;

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var TotalCost = response[i].InvAmt + response[i].PoAmt;
            var str = '';
            str += '<tr id=tra' + response[i].accountnumber + ' ondblclick="javascript:ShowTransaction(\'' + response[i].accountnumber + '\');" class="crwDetailRowL2">';
            // str += '<td></td>';
            str += '<td><a href="javascript:ShowSubDetailL3(\'' + response[i].accountnumber + '\',' + i + ',' + response[i].AccountTotal + ',1);"><i id="D' + i + '" class="fa fa-chevron-right ArrowCls1"></i></a></td>';
            str += '<td style="padding:0 0 0 20px;">' + response[i].accountnumber + '</td>';
            str += '<td></td>';
            str += '<td></td>';
            str += '<td>' + response[i].accountdesc + '</td>';
            str += '<td>' + numeral(response[i].bwamt).format('0,0') + '</td>';
            str += '<td>' + numeral(response[i].InvAmt).format('0,0') + '</td>';
            str += '<td>' + numeral(response[i].PoAmt).format('0,0') + '</td>';
            str += '<td>' + numeral(TotalCost).format('0,0') + '</td>';

            var EFCC = response[i].EFC;
            if (EFCC == '') {
                EFCC = response[i].AccountTotal;
            }

            var ETCC = (EFCC) - (TotalCost);

            str += '<td onclick="javascript:EditETC(\'' + response[i].accountnumber + '\');"><span class="CRWHide" id="spanETC' + response[i].accountnumber + '">' + ETCC + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + ETCC + '" id="txtETC' + response[i].accountnumber + '" onfocusout="javascript:UpdateETC(\'' + response[i].accountnumber + '\');"/></td>';
            str += '<td onclick="javascript:EditEFC(\'' + response[i].accountnumber + '\');"><span class="CRWHide" id="spanEFC' + response[i].accountnumber + '">' + EFCC + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + EFCC + '" id="txtEFC' + response[i].accountnumber + '" onfocusout="javascript:UpdateEFC(\'' + response[i].accountnumber + '\');"/> </td>';
            str += '<td>' + response[i].AccountTotal + '</td>';

            var Variance = (response[i].AccountTotal) - EFCC;

            if ((response[i].CRWN) > 0) {
                str += '<td>' + Variance + '<a style="float:right;" href="javascript:ShowNotes(\'' + response[i].accountnumber + '\',' + i + ')"><i id=iik' + i + ' class="fa fa-pencil-square-o" style="color:Red;"></i></a></td>';
            }
            else {
                str += '<td>' + Variance + '<a style="float:right;" href="javascript:ShowNotes(\'' + response[i].accountnumber + '\',' + i + ')"><i id=iik' + i + ' class="fa fa-pencil-square-o" style="color:#5C8FBE;"></i></a></td>';
            }

            str += '</tr>';

            $('#tblCRW > tbody > tr').eq(rowIDCRW + i).after(str);
        }
        //<a href="javascript:ShowSubDetail(' + i + ',' + response[i].BudgetID + ',' + response[i].Budgetfileid + ',' + response[i].BudgetCategoryID + ')"><i style="color: #fff" id=ii' + i + ' class="fa fa-chevron-right ArrowCls"></i></a>
    }
    else {

    }
    if (AccountTabPressed == 'YES') {
        TabAccountKeyPressed();
    }
}

function SucessMsg(Msg) {
    $("#dvMsgCategory").removeClass('ErrorCls');
    $("#dvMsgCategory").html(Msg);
    $("#dvMsgCategory").addClass('SucessCls');
    $("#dvMsgCategory").show();
    setTimeout(function () {
        $("#dvMsgCategory").hide('blind', {}, 500)
    }, 2000);
}

function EditETC(AccountNo) {
    IsUpdated = 'NO';
    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtETC' + AccountNo).attr('style', 'display:block;');
    $('#spanETC' + AccountNo).attr('style', 'display:none;');
    $('#txtETC' + AccountNo).focus();
}

function EditEFC(AccountNo) {
    IsUpdated = 'NO';
    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtEFC' + AccountNo).attr('style', 'display:block;');
    $('#spanEFC' + AccountNo).attr('style', 'display:none;');
    $('#txtEFC' + AccountNo).focus();
}

function EditBudget(AccountNo) {
    IsUpdated = 'NO';
    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtBudget' + AccountNo).attr('style', 'display:block;');
    $('#spanSumHeader' + AccountNo).attr('style', 'display:none;');
    $('#txtBudget' + AccountNo).focus();
}

function ShowNotes(AccountNo, Vall) {
    COAIDforNotes = AccountNo;
    iiValue = Vall;
    BudAccID = AccountNo;
    $.ajax({
        url: APIUrlGetCRWNote + '?COAID=' + AccountNo + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&ProdID=' + localStorage.ProdId + '&UserID=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { ShowNotesSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}

function ShowNotesSucess(response) {
    var TLength = response.length;
    var str = '';
    if (TLength > 0) {
        var str = '';
        for (var i = 0; i < TLength; i++) {

            str += '<tr>';
            str += '<td>' + response[i].Name + '</td>';
            str += '<td>' + response[i].Ndate + '</td>';
            str += '<td>' + response[i].Notes + '</td>';


            var UploadBy = response[i].UserID;
            var myID = response[i].LoginUserID;

            var Statuss = response[i].Status;

            if (Statuss == 'Public') {
                if (UploadBy == myID) {
                    str += '<td><input type="checkbox" id=chkChangeStatus_' + response[i].CRWNotesID + ' onchange="javascript:ChangeStatus(' + response[i].CRWNotesID + ');" </td>';
                    str += '<td><a href="javascript:DeleteNotes(' + response[i].CRWNotesID + ');"><i class="fa fa-trash"></i></a> </td>';
                }
                else {
                    str += '<td></td>';
                    str += '<td></td>';
                }
            }
            else {
                str += '<td><input type="checkbox" id=chkChangeStatus_' + response[i].CRWNotesID + '  checked onchange="javascript:ChangeStatus(' + response[i].CRWNotesID + ');" </td>';
                str += '<td><a href="javascript:DeleteNotes(' + response[i].CRWNotesID + ');"><i class="fa fa-trash"></i></a></td>';
            }
            str += '</tr>';
        }
        $('#tbodyCRWNote').html(str);
        $('.w2ui-fieldInt').w2field('int');
        $('#iik' + iiValue).attr('style', 'color:red;');
    }
    else {
        $('#iik' + iiValue).attr('style', 'color:#5C8FBE;');

        $('#tbodyCRWNote').html('<tr><td colspan="5" style="text-align:center;">No Notes Found !</td></tr>');
    }


    $('#dvNotes').attr('style', 'display:block;');
}

function SaveNotes()  //BudAccID
{
    if ($('#txtNotes').val() != '') {
        $.ajax({
            url: APIUrlSaveCRWNote + '?COAID=' + COAIDforNotes + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&UserID=' + localStorage.UserId + '&Note=' + $('#txtNotes').val() + '&ProdID=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

       .done(function (response)
       { ShowNotesSucess(response); })
      .fail(function (error)
      { ShowMSG(error); })
    }
    else {
        ShowMsgBox('showMSG', 'Please Enter Notes !!', '', 'failuremsg');
    }
}

function ChangeStatus(CRWNotesID) {
    var Status = '';
    if ($('#chkChangeStatus_' + CRWNotesID).prop("checked")) {
        Status = 'Private';
    }
    else {
        Status = 'Public';
    }

    $.ajax({
        url: APIUrlUpdateCRWNote + '?CRWNotesID=' + CRWNotesID + '&&Status=' + Status,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

      .done(function (response)
      { })
}

$(document).on('keydown', 'input.detectTab', function (e) {
    var keyCode = e.keyCode || e.which;

    var data = this.name;
    var arr = data.split(':');
    AccountCurrentRow = arr[0];
    AccountCurrentColumn = arr[1];
    if (keyCode == 9) {
        AccountTabPressed = 'YES'
    }
    else {
        AccountTabPressed = 'NO'
    }
});

function TabAccountKeyPressed() {
    AccountTabPressed = 'NO';
    if (AccountCurrentColumn == (2)) {

        var nextAccountTrId = $('#tra' + BudAccID).next("tr").attr("id").substring(3);
        BudAccID = nextAccountTrId;
        EditETC(BudAccID);
        $('#txtETC' + BudAccID).focus();

    }
    else {
        EditEFC(BudAccID);

        $('#txtEFC' + BudAccID).focus();
    }
}

function ShowTransaction(AccountNo) {

    $('#ulTransac li').removeClass('active');
    $('#liTransaction').addClass('active');

    $.ajax({
        url: APIUrlGetPODetailListCRW + '?CID=' + CompanyIDCrw + '&BudgetID=' + BudgetIDCrw + '&&BudgetFileID=' + BudgetFileIDCrw + '&BudgetCategoryID=' + BudgetCategoryIDCrw + '&ProdId=' + localStorage.ProdId + '&AccountNumber=' + AccountNo,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { ShowTransactionSucess(response, AccountNo); })
   .fail(function (error)
   { ShowMSG(error); })
}

function ShowTransactionSucess(response, AccountNo) {
    var TLength = response.length;
    var str = '';
    if (TLength > 0) {
        var str = '';
        for (var i = 0; i < TLength; i++) {

            str += '<tr>';
            str += '<td>' + response[i].Date + '</td>';
            str += '<td>' + response[i].VendorName + '</td>';
            str += '<td>' + response[i].LineDescription + '</td>';
            str += '<td>' + response[i].ddd + '</td>';
            str += '<td>' + response[i].PO + '</td>';
            str += '<td>' + response[i].PO + '</td>';
            str += '<td>AP</td>';


            str += '</tr>';
        }
        $('#tbodyPODetail').html(str);

    }
    else {
        $('#tbodyPODetail').html('<tr><td colspan="7" style="text-align:center;">There are no transactions for this account !</td></tr>');
    }


    $('#poPopup').attr('style', 'display:block;');
    ShowTransactionInvoice(AccountNo);
}

function ShowTransactionInvoice(AccountNo) {

    $.ajax({
        url: APIUrlGetInvoiceDetailListCRW + '?CID=' + CompanyIDCrw + '&BudgetID=' + BudgetIDCrw + '&&BudgetFileID=' + BudgetFileIDCrw + '&BudgetCategoryID=' + BudgetCategoryIDCrw + '&ProdId=' + localStorage.ProdId + '&AccountNumber=' + AccountNo,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { ShowTransactionInvoiceSucess(response, AccountNo); })
   .fail(function (error)
   { ShowMSG(error); })
}

function ShowTransactionInvoiceSucess(response, AccountNo) {
    var TLength = response.length;
    var str = '';
    if (TLength > 0) {
        var str = '';
        for (var i = 0; i < TLength; i++) {

            str += '<tr>';
            str += '<td>' + response[i].Date + '</td>';
            str += '<td>' + response[i].VendorName + '</td>';
            str += '<td>' + response[i].Description + '</td>';
            str += '<td>' + response[i].ddd + '</td>';
            str += '<td>' + response[i].InvAmt + '</td>';
            str += '<td>' + response[i].InvAmt + '</td>';
            str += '<td>AP</td>';

            str += '</tr>';
        }
        $('#tbodyInvoiceDetail').html(str);

    }
    else {
        $('#tbodyInvoiceDetail').html('<tr><td colspan="7" style="text-align:center;">There are no transactions for this account !</td></tr>');
    }

    ShowTransactionJE(AccountNo);

}

function ShowTransactionJE(AccountNo) {

    $.ajax({
        url: GetJEDetailListCRW + '?CID=' + CompanyIDCrw + '&ProdId=' + localStorage.ProdId + '&AccountNumber=' + AccountNo,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { ShowTransactionJESucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}

function ShowTransactionJESucess(response) {
    var TLength = response.length;
    var str = '';
    if (TLength > 0) {
        var str = '';
        for (var i = 0; i < TLength; i++) {

            str += '<tr>';
            str += '<td>' + response[i].CDate + '</td>';
            str += '<td>' + response[i].VendorName + '</td>';
            str += '<td>' + response[i].Note + '</td>';

            var Credit = response[i].CreditAmount;
            var Debit = response[i].DebitAmount;
            var CC = response[i].CC;
            var DD = response[i].DD;

            var thisPeriod = parseFloat(CC) - parseFloat(DD);
            var Total = parseFloat(Credit) - parseFloat(Debit);

            str += '<td>' + numeral(thisPeriod).format('0,0') + '</td>';
            str += '<td>' + numeral(Total).format('0,0') + '</td>';
            str += '<td>' + numeral(Total).format('0,0') + '</td>';
            str += '<td>JE</td>';

            str += '</tr>';
        }
        $('#tbodyJDetail').html(str);

    }
    else {
        $('#tbodyJDetail').html('<tr><td colspan="7" style="text-align:center;">There are no transactions for this account !</td></tr>');
    }


    $('#poPopup').attr('style', 'display:block;');
}

function DeleteNotes(NotesID)  //BudAccID
{

    $.ajax({
        url: APIUrlDeleteCRWNote + '?COAID=' + COAIDforNotes + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&ProdID=' + localStorage.ProdId + '&UserID=' + localStorage.UserId + '&NotesID=' + NotesID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { ShowNotesSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })

}

function ShowSubDetailL3(AccountCode, rowID1, Total, Mode) {
    L2 = rowID1;

    rowIDCRW1 = rowID1;
    if (OldrowIDCRW1 == '') {
        if (OldrowIDCRW1 == '0') {
            OldrowIDCRW1 = '';
            $(".crwDetailRowL3").remove();
            $(".crwDetailRowSet").remove();
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls1').removeClass('fa fa-chevron-down');
            $('.ArrowCls1').addClass('fa fa-chevron-right');
            $('#D' + rowID1).removeClass('fa fa-chevron-right');
            $('#D' + rowID1).addClass('fa fa-chevron-right');
        }
        else {
            OldrowIDCRW1 = rowIDCRW1;
            $(".crwDetailRowL3").remove();
            $(".crwDetailRowSet").remove();
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls1').removeClass('fa fa-chevron-down');
            $('.ArrowCls1').addClass('fa fa-chevron-right');
            $('#D' + rowID1).removeClass('fa fa-chevron-right');
            $('#D' + rowID1).addClass('fa fa-chevron-down');
            GetDetail1(AccountCode, Total, Mode);
        }
    }
    else if (OldrowIDCRW1 == rowIDCRW1) {
        OldrowIDCRW1 = '';
        $(".crwDetailRowL3").remove();
        $(".crwDetailRowSet").remove();
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls1').removeClass('fa fa-chevron-down');
        $('.ArrowCls1').addClass('fa fa-chevron-right');
        $('#D' + rowID1).removeClass('fa fa-chevron-right');
        $('#D' + rowID1).addClass('fa fa-chevron-right');
    }
    else {
        OldrowIDCRW1 = rowIDCRW1;
        $(".crwDetailRowL3").remove();
        $(".crwDetailRowSet").remove();
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls1').removeClass('fa fa-chevron-down');
        $('.ArrowCls1').addClass('fa fa-chevron-right');
        $('#D' + rowID1).removeClass('fa fa-chevron-right');
        $('#D' + rowID1).addClass('fa fa-chevron-down');

        GetDetail1(AccountCode, Total, Mode);
    }
}

function GetDetail1(AccountCode, Total, Mode) {

    $.ajax({
        url: APIUrlFillCrwDetailData1 + '?ProdID=' + localStorage.ProdId + '&AccountCode=' + AccountCode + '&Mode=' + Mode,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetDetail1Sucess(response, Total); })
    .fail(function (error)
    { ShowMSG(error); })
}

function GetDetail1Sucess(response, Total) {
    var TLength = response.length;
    var AMTT = parseFloat(Total) / parseInt(TLength);
    rowIDCRW1 = parseInt(L1) + parseInt(L2);
    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var TotalCost = response[i].InvAmt + response[i].PoAmt;
            var str = '';
            str += '<tr class="crwDetailRowL3">';
            str += '<td><a href="javascript:ShowSubDetailSet(' + i + ',2)"><i id="Set' + i + '" class="fa fa-chevron-right ArrowCls2"></i></a></td>';

            str += '<td style="padding:0 0 0 40px;">' + response[i].AccountCode + '</td>';
            str += '<td></td>';
            str += '<td></td>';
            str += '<td>' + response[i].AccountName + '</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '</tr>';


            $('#tblCRW > tbody > tr').eq(rowIDCRW1 + 1).after(str);
            rowIDCRW1 = rowIDCRW1 + 1;
        }

    }


}

function ShowSubDetailSet(rowID2, Mode) {
    L3 = rowID2;

    rowIDCRW2 = rowID2;
    if (OldrowIDCRW2 == '') {
        if (OldrowIDCRW2 == '0') {
            OldrowIDCRW2 = '';

            $(".crwDetailRowSet").remove();
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls2').removeClass('fa fa-chevron-down');
            $('.ArrowCls2').addClass('fa fa-chevron-right');
            $('#Set' + rowID2).removeClass('fa fa-chevron-right');
            $('#Set' + rowID2).addClass('fa fa-chevron-right');
        }
        else {
            OldrowIDCRW2 = rowIDCRW2;
            $(".crwDetailRowSet").remove();
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls2').removeClass('fa fa-chevron-down');
            $('.ArrowCls2').addClass('fa fa-chevron-right');
            $('#Set' + rowID2).removeClass('fa fa-chevron-right');
            $('#Set' + rowID2).addClass('fa fa-chevron-down');
            GetDetail2(Mode);
        }
    }
    else if (OldrowIDCRW2 == rowIDCRW2) {
        OldrowIDCRW2 = '';
        $(".crwDetailRowSet").remove();
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls2').removeClass('fa fa-chevron-down');
        $('.ArrowCls2').addClass('fa fa-chevron-right');
        $('#Set' + rowID2).removeClass('fa fa-chevron-right');
        $('#Set' + rowID2).addClass('fa fa-chevron-right');
    }
    else {
        OldrowIDCRW2 = rowIDCRW2;
        $(".crwDetailRowSet").remove();
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls2').removeClass('fa fa-chevron-down');
        $('.ArrowCls2').addClass('fa fa-chevron-right');
        $('#Set' + rowID2).removeClass('fa fa-chevron-right');
        $('#Set' + rowID2).addClass('fa fa-chevron-right');

        GetDetail2(Mode);
    }
}

function GetDetail2(Mode) {

    $.ajax({
        url: APIUrlFillCrwDetailData1 + '?ProdID=' + localStorage.ProdId + '&AccountCode=""&Mode=' + Mode,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetDetail2Sucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function GetDetail2Sucess(response) {
    var TLength = response.length;

    rowIDCRW2 = parseInt(L1 + 1) + parseInt(L2 + 1) + parseInt(L3)

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {


            var str = '';
            str += '<tr class="crwDetailRowSet">';
            // str += '<td></td>';
            str += '<td><a href="javascript:ShowSubDetail3(' + i + ',3)"><i id="Series' + i + '" class="fa fa-chevron-right ArrowCls3"></i></a></td>';
            str += '<td></td>';
            str += '<td>' + response[i].AccountCode + '</td>';

            str += '<td></td>';
            str += '<td>' + response[i].AccountName + '</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '</tr>';

            $('#tblCRW > tbody > tr').eq(rowIDCRW2 + i).after(str);
            // rowIDCRW1 = rowIDCRW1 + 1;
        }
    }
}

function ShowSubDetail3(rowID3, Mode) {
    L4 = rowID3;

    rowIDCRW3 = rowID3;
    if (OldrowIDCRW3 == '') {
        if (OldrowIDCRW3 == '0') {
            OldrowIDCRW3 = '';
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls3').removeClass('fa fa-chevron-down');
            $('.ArrowCls3').addClass('fa fa-chevron-right');
            $('#Series' + rowID3).removeClass('fa fa-chevron-right');
            $('#Series' + rowID3).addClass('fa fa-chevron-right');
        }
        else {
            OldrowIDCRW3 = rowIDCRW3;
            $(".crwDetailRowSeries").remove();
            $('.ArrowCls3').removeClass('fa fa-chevron-down');
            $('.ArrowCls3').addClass('fa fa-chevron-right');
            $('#Series' + rowID3).removeClass('fa fa-chevron-right');
            $('#Series' + rowID3).addClass('fa fa-chevron-down');
            GetDetail3(Mode);
        }
    }
    else if (OldrowIDCRW3 == rowIDCRW3) {
        OldrowIDCRW3 = '';
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls3').removeClass('fa fa-chevron-down');
        $('.ArrowCls3').addClass('fa fa-chevron-right');
        $('#Series' + rowID3).removeClass('fa fa-chevron-right');
        $('#Series' + rowID3).addClass('fa fa-chevron-right');
    }
    else {
        OldrowIDCRW3 = rowIDCRW3;
        $(".crwDetailRowSeries").remove();
        $('.ArrowCls3').removeClass('fa fa-chevron-down');
        $('.ArrowCls3').addClass('fa fa-chevron-right');
        $('#Series' + rowID3).removeClass('fa fa-chevron-right');
        $('#Series' + rowID3).addClass('fa fa-chevron-right');

        GetDetail3(Mode);
    }
}

function GetDetail3(Mode) {

    $.ajax({
        url: APIUrlFillCrwDetailData1 + '?ProdID=' + localStorage.ProdId + '&AccountCode=""&Mode=' + Mode,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetDetail3Sucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function GetDetail3Sucess(response) {
    var TLength = response.length;

    rowIDCRW3 = parseInt(L1 + 1) + parseInt(L2 + 1) + parseInt(L3 + 1) + parseInt(L4);

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {


            var str = '';
            str += '<tr class="crwDetailRowSeries">';
            // str += '<td></td>';
            str += '<td></td>';
            str += '<td></td>';
            str += '<td></td>';
            str += '<td>' + response[i].AccountCode + '</td>';
            str += '<td>' + response[i].AccountName + '</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '</tr>';

            $('#tblCRW > tbody > tr').eq(rowIDCRW3 + i).after(str);
            // rowIDCRW1 = rowIDCRW1 + 1;
        }
    }
}

///   Set ////////

function GetSet(COAID) {
    if (CheckSetStatus == 'YES') {
        $.ajax({
            url: APIUrlGetSetForCRW + '?COAID=' + COAID + '&BudgetFileID=' + BudgetFileIDCrw + '&BudgetID=' + BudgetIDCrw + '&Prodid=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response)
        { GetSetSucess(response); })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function GetSetSucess(response) {
    var TLength = response.length;

    if (TLength > 0) {
        CurrentRowIDSet = CurrentRowID + 1;
        for (var i = 0; i < TLength; i++) {

            var TotalCost = response[i].ActualtoDateforSet + response[i].POAmountForSet;
            var str = '';
            str += '<tr class="crwSetRow">';
            str += '<td></td>';
            str += '<td></td>';
            // str += '<td><a class="levelClsDistance" href="javascript:GetSeries(' + i + ',' + response[i].SetID + ')"><i id="Set' + i + '" class="fa fa-chevron-right ArrowCls2"></i></a>' + response[i].SetCode + '</td>';
            str += '<td>' + response[i].SetCode + '</td>';

            str += '<td></td>';
            str += '<td>' + response[i].SetDescription + '</td>';
            str += '<td>' + numeral(response[i].ActualthisPeriodforSet).format('0,0') + '</td>';
            str += '<td>' + numeral(response[i].ActualtoDateforSet).format('0,0') + '</td>';
            str += '<td>' + numeral(response[i].POAmountForSet).format('0,0') + '</td>';
            // str += '<td>' + TotalCost + '</td>';

            var ID = (response[i].COAID).toString() + (response[i].SetID).toString();
            str += '<td><span id=spanTotalCostSet' + ID + '>' + numeral(TotalCost).format('0,0') + '</span></td>';



            var SetETC = parseFloat(response[i].EFC) - parseFloat(TotalCost);

            str += '<td id=tdsetETC' + ID + ' onclick="javascript:EditsetETC(\'' + ID + '\');"><span class="CRWHide" id="spansetETC' + ID + '">' + numeral(SetETC).format('0,0') + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + SetETC + '" id="txtsetETC' + ID + '" onfocusout="javascript:UpdatesetETC(' + response[i].COAID + ',' + response[i].DetailLevel + ',' + response[i].SetID + ');"/></td>';
            str += '<td id=tdsetEFC' + ID + ' onclick="javascript:EditsetEFC(\'' + ID + '\');"><span class="CRWHide" id="spanSetEFC' + ID + '">' + numeral(response[i].EFC).format('0,0') + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].EFC + '" id="txtsetEFC' + ID + '" onfocusout="javascript:UpdatesetEFC(' + response[i].COAID + ',' + response[i].DetailLevel + ',' + response[i].SetID + ');"/> </td>';
            str += '<td id=tdsetB' + ID + ' onclick="javascript:EditSetBudget(\'' + ID + '\');"><span class="CRWHide" id="spanSetBudget' + ID + '">' + numeral(response[i].Budget).format('0,0') + '</span><input type="text" class="CRWShow detectTab w2ui-fieldInt" style="display:none;" value="' + response[i].Budget + '" id="txtSetBudget' + ID + '" onfocusout="javascript:UpdateSetBudget(' + response[i].COAID + ',' + response[i].DetailLevel + ',' + response[i].SetID + ');"/> </td>';

            var Variance = parseFloat(response[i].Budget) - parseFloat(0);

            str += '<td><span id=spanSetVariance' + ID + '>' + numeral(Variance).format('0,0') + '</span></td>';


            str += '</tr>';

            $('#tblCRW > tbody > tr').eq(CurrentRowIDSet).after(str);
            CurrentRowIDSet = CurrentRowIDSet + 1;
        }
    }
}

/////////////// Series    /////////////////////////////////////

function GetSeries(RowID, Setid) {

    if (String(RowID) == GlobalIDSet) {
        $('.ArrowCls2').removeClass('fa fa-chevron-down');
        $('.ArrowCls2').addClass('fa fa-chevron-right');
        GlobalIDSet = '';

        $(".crwSeriesRow").remove();
    }
    else {
        $('.ArrowCls2').removeClass('fa fa-chevron-down');
        $('.ArrowCls2').addClass('fa fa-chevron-right');
        $(".crwSeriesRow").remove();
        $('#Set' + RowID).addClass('fa fa-chevron-down');
        GlobalIDSet = RowID;
        $.ajax({
            url: APIUrlGetSeriesForCRW + '?COAID=' + GlobalCOAID + '&Setid=' + Setid + '&BudgetFileID=' + BudgetFileIDCrw + '&BudgetID=' + BudgetIDCrw + '&Prodid=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response)
        { GetSeriesSucess(response, RowID); })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function GetSeriesSucess(response, RowID) {

    var TLength = response.length;
    // var AMTT = parseFloat(Total) / parseInt(TLength);
    // rowIDCRW1 = parseInt(L1) + parseInt(L2);
    if (TLength > 0) {

        CurrentRowIDSeries = CurrentRowID + GlobalIDSet + 2;


        for (var i = 0; i < TLength; i++) {

            var TotalCost = response[i].ActualtoDate + response[i].PoAmount;
            var str = '';
            str += '<tr class="crwSeriesRow">';
            // str += '<td><a href="javascript:ShowSubDetailSet(' + i + ',2)"><i id="Set' + i + '" class="fa fa-chevron-right ArrowCls2"></i></a></td>';
            str += '<td></td>';
            str += '<td></td>';
            str += '<td></td>';
            str += '<td style="padding:0 0 0 40px;">' + response[i].SeriesCode + '</td>';

            str += '<td>' + response[i].SeriesDescription + '</td>';
            str += '<td>' + numeral(response[i].ActualthisPeriod).format('0,0') + '</td>';
            str += '<td>' + numeral(response[i].ActualtoDate).format('0,0') + '</td>';
            str += '<td>' + numeral(response[i].PoAmount).format('0,0') + '</td>';
            str += '<td>' + numeral(TotalCost).format('0,0') + '</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '</tr>';

            $('#tblCRW > tbody > tr').eq(CurrentRowIDSeries).after(str);
            CurrentRowIDSeries = CurrentRowIDSeries + 1;
        }
    }
}

/// Rollup///////

function RollUpBudget()  //BudAccID
{

    $.ajax({
        url: APIUrlRollUpBudget + '?COAID=' + COAIDforRollUp + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&Amount=' + BudgetAmtRollUp,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { RollUpBudgetSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}

function RollUpBudgetSucess(response) {
    $('#spanSumHeader' + COAIDforRollUp).html(BudgetAmtRollUp);
    $('#spanEFC' + COAIDforRollUp).html(BudgetAmtRollUp);

    $('#spanETC' + COAIDforRollUp).html(BudgetAmtRollUp);

    $('#spanVarianceHeader' + COAIDforRollUp).html(BudgetAmtRollUp);

    var ETC = parseFloat(BudgetAmtRollUp) - parseFloat($('#spanTotalHeader' + COAIDforRollUp).html());
    $('#spanETC' + COAIDforRollUp).html(ETC);



    document.getElementById("al" + COAIDforRollUp).href = "javascript:ShowNextLevel(" + ID7, Parentt7, DLevel7, RowID7, Posting7, 9, BudgetAmt7, '', BudgetChild7 + ");";


    hideDiv('dvConfirmRollUp');

    RollUpG();
}

function DistributeBudget() {
    $.ajax({
        url: APIUrlDistributionBudget + '?COAID=' + COAIDforRollUp + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&Amount=' + BudgetAmtRollUp.replace(/,/g, ""),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { DistributeBudgetSucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}

function DistributeBudgetSucess(response) {

    document.getElementById("al" + COAIDforRollUp).href = "javascript:ShowNextLevel(" + ID7 + "," + Parentt7 + "," + DLevel7 + "," + RowID7 + "," + Posting7 + ",0," + BudgetAmt7 + ",0," + BudgetChild7 + ")";
    hideDiv('dvConfirm');

    $('#tdB' + COAIDforRollUp).prop('onclick', null);
    $('#tdETC' + COAIDforRollUp).prop('onclick', null);
    $('#tdEFC' + COAIDforRollUp).prop('onclick', null);

    if (response.length > 0) {
        var TLength = response.length;
        for (var i = 0; i < TLength; i++) {

            var COAid = response[i].COAID;
            var Amt = response[i].Amount;
            var AhrefVal = $('#al' + COAid).attr("href");

            try {
                AhrefVal = AhrefVal.replace('javascript: ShowNextLevel(', '');
                var arr = AhrefVal.split(',');
                var Parent0 = arr[1];
                var DLevel = arr[2];
                var Row0 = arr[3];
                var IsPost = arr[4];
                var Child0 = arr[7];


                if (parseInt(Child0) > 0) {
                    document.getElementById("al" + COAid).href = "javascript:ShowNextLevel(" + COAid + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + ",3," + Amt + "," + Child0 + ")";
                }
                else {
                    if (IsPost == 'true') {
                        document.getElementById("al" + COAid).href = "javascript:ShowNextLevel(" + COAid + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + ",8," + Amt + "," + Child0 + ")";
                    }
                    else {
                        document.getElementById("al" + COAid).href = "javascript:ShowNextLevel(" + COAid + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + ",0," + Amt + "," + Child0 + ")";
                    }

                    try {
                        $('#spanEFCb' + COAid).html($('#spanEFC' + COAid).html());
                        $('#txtEFCb' + COAid).val($('#txtEFC' + COAid).val());

                        $('#spanETCb' + COAid).html($('#spanETC' + COAid).html());
                        $('#txtETCb' + COAid).val($('#txtETC' + COAid).val());
                        $('#spanVarianceHeaderb' + COAid).html($('#spanVarianceHeader' + COAid).html());
                        $('#txtBudgetb' + COAid).val($('#txtBudget' + COAid).val());

                        $('#spanSumHeaderb' + COAid).html($('#spanSumHeader' + COAid).html());
                    }
                    catch (e) {

                    }
                }
            }
            catch (ex)
            { }



            $('#spanSumHeader' + COAid).html(Amt);
            $('#txtBudget' + COAid).val(Amt);

            var TCost = $('#spanTotalHeader' + COAid).html();
            $('#spanEFC' + COAid).html(response[i].EFCC);
            $('#txtEFC' + COAid).val(response[i].EFCC);

            $('#spanVarianceHeader' + COAid).html(parseFloat($('#spanSumHeader' + COAid).html() - parseFloat($('#spanEFC' + COAid).html())));

            var ETC = parseFloat(response[i].EFCC) - parseFloat($('#spanTotalHeader' + COAid).html());
            $('#spanETC' + COAid).html(ETC);
            $('#txtETC' + COAid).val(ETC);



        }
    }
    RollUpG();
}

function RollUpG() {
    // GlobalID1 = '';
    // GetCRW(LiIDG, BudgetIDCrw, BudgetFileIDCrw, BudgetNameG, 'YES');
    ShowNextLevel(ID7, Parentt7, DLevel7, RowID7, Posting7, 9, BudgetAmt7, '', BudgetChild7);
}

function DistributeBudgetAfterL2() {
    $.ajax({
        url: APIUrlDistributionBudgetAfterL2 + '?COAID=' + COAIDforRollUp + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&Amount=' + BudgetAmtRollUp.replace(/,/g, ""),
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { DistributeBudgetAfterL2Sucess(response); })
  .fail(function (error)
  { ShowMSG(error); })
}

function DistributeBudgetAfterL2Sucess(response) {
    document.getElementById("al" + COAIDforRollUp).href = "javascript:ShowNextLevel(" + ID7 + "," + Parentt7 + "," + DLevel7 + "," + RowID7 + "," + Posting7 + ",0," + BudgetAmt7 + ", '0'," + BudgetChild7 + ")";
    hideDiv('dvConfirmL2Plus');

    // RollUpG();

    $('#tdB' + COAIDforRollUp).prop('onclick', null);
    $('#tdETC' + COAIDforRollUp).prop('onclick', null);
    $('#tdEFC' + COAIDforRollUp).prop('onclick', null);


    if (response.length > 0) {
        var TLength = response.length;
        for (var i = 0; i < TLength; i++) {

            var COAid = response[i].COAID;
            var Amt = response[i].Amount;

            try {
                var AhrefVal = $('#al' + COAid).attr("href");

                AhrefVal = AhrefVal.replace('javascript: ShowNextLevel(', '');


                var arr = AhrefVal.split(',');
                var Parent0 = arr[1];
                var DLevel = arr[2];
                var Row0 = arr[3];
                var IsPost = arr[4];
                var Child0 = arr[7];
                var CAmt = arr[8];


                if (parseInt(Child0) > 0) {
                    document.getElementById("al" + COAid).href = "javascript:ShowNextLevel(" + COAid + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + ",3," + Amt + "," + Child0 + "," + CAmt + "";
                }
                else {
                    // document.getElementById("al" + COAid).href = "javascript:ShowNextLevel(" + COAid + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + ",0," + Amt + "," + Child0 + "," + CAmt + "";
                    if (IsPost == 'true') {
                        document.getElementById("al" + COAid).href = "javascript:ShowNextLevel(" + COAid + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + ",8," + Amt + "," + Child0 + ")";
                    }
                    else {
                        document.getElementById("al" + COAid).href = "javascript:ShowNextLevel(" + COAid + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + ",0," + Amt + "," + Child0 + ")";
                    }

                    try {
                        $('#spanEFCb' + COAid).html($('#spanEFC' + COAid).html());
                        $('#txtEFCb' + COAid).val($('#txtEFC' + COAid).val());

                        $('#spanETCb' + COAid).html($('#spanETC' + COAid).html());
                        $('#txtETCb' + COAid).val($('#txtETC' + COAid).val());
                        $('#spanVarianceHeaderb' + COAid).html($('#spanVarianceHeader' + COAid).html());
                        $('#txtBudgetb' + COAid).val($('#txtBudget' + COAid).val());

                        $('#spanSumHeaderb' + COAid).html($('#spanSumHeader' + COAid).html());
                    }
                    catch (e) {

                    }
                }
            }
            catch (ex) { }

            $('#spanSumHeader' + COAid).html(Amt);
            $('#txtBudget' + COAid).val(Amt);

            var TCost = $('#spanTotalHeader' + COAid).html();

            $('#spanEFC' + COAid).html(response[i].EFCC);
            $('#txtEFC' + COAid).val(response[i].EFCC);

            $('#spanVarianceHeader' + COAid).html(parseFloat($('#spanSumHeader' + COAid).html() - parseFloat($('#spanEFC' + COAid).html())));

            //  var ETC = parseFloat(BudgetAmtRollUp) - parseFloat($('#spanTotalHeader' + COAid).html());
            var ETC = parseFloat(response[i].EFCC) - parseFloat($('#spanTotalHeader' + COAid).html());
            $('#spanETC' + COAid).html(ETC);
            $('#txtETC' + COAid).val(ETC);


        }

    }
    RollUpG();
}

function UpdateBudget(accountNo, DetailLevel) {
    IsUpdated = 'OK';
    var NEWV = $('#txtBudget' + accountNo).val().replace(/,/g, '') * 1;
    NEWV = NEWV.toString().replace(/,/g, '') * 1;


    var NEWV1 = $('#txtBudget' + accountNo).val().replace(/,/g, '') * 1;
    var OLD1 = $('#spanSumHeader' + accountNo).html().replace(/,/g, '') * 1;
    var Chk = parseFloat(NEWV1) - parseFloat(OLD1);

    $('#spanFBudget').html(parseFloat(parseFloat($('#spanFBudget').html().replace(/,/g, "")) + parseFloat(Chk)).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    $('#spanFVariance').html(parseFloat(parseFloat($('#spanFBudget').html().replace(/,/g, "")) - parseFloat($('#spanFefc').html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));

    $.ajax({
        url: APIUrlUpdateBudget + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + NEWV + '&COAID=' + accountNo,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response, accountNo) {
        UpdateBudgetSucess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}

function UpdateBudgetSucess(response) {

    var TLength = response.length;

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;
            var CheckEFC = $('#spanEFC' + COAIDD).html();
            var TCost = $('#spanTotalHeader' + COAIDD).html();

            if (Status == 'OK') {
                $('#spanSumHeader' + COAIDD).html(parseFloat(BAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtBudget' + COAIDD).val(parseFloat(BAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanVarianceHeader' + COAIDD).html(parseFloat(BAmt - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            }
            else {
                var OldAmt = $('#spanSumHeader' + COAIDD).html().replace(/,/g, "");
                var NewAmt = parseFloat(OldAmt.replace(/,/g, '')) + parseFloat(BAmt);
                $('#spanSumHeader' + COAIDD).html(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtBudget' + COAIDD).val(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanVarianceHeader' + COAIDD).html(parseFloat(NewAmt - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            }

            $('.CRWShow').attr('style', 'display:none;');
            $('.CRWHide').attr('style', 'display:block;');

            var AhrefVal = $('#al' + COAIDD).attr("href");
            try {
                AhrefVal = AhrefVal.replace('javascript: ShowNextLevel(', '');
                var arr = AhrefVal.split(',');
                var Parent0 = arr[1];
                var DLevel = arr[2];
                var Row0 = arr[3];
                var IsPost = arr[4];
                var ExValue = arr[5];
                var Child0 = arr[7];
                var Camt = arr[8];
                if (parseFloat(BAmt) == parseFloat(Camt)) {
                    ExValue = 9;
                }

                document.getElementById("al" + COAIDD).href = "javascript:ShowNextLevel(" + COAIDD + "," + Parent0 + "," + DLevel + "," + Row0 + "," + IsPost + "," + ExValue + "," + BAmt + "," + Child0 + "," + Camt + "";

            }
            catch (ex) {

            }



        }
        SucessMsg('Record Updated Sucessfully.');
    }
}

function UpdateEFC(accountNo, DetailLevel) {
    IsUpdated = 'OK';
    var OLDV = $('#spanEFC' + accountNo).html().replace(/,/g, '') * 1;
    var NEWV = $('#txtEFC' + accountNo).val().replace(/,/g, '') * 1;
    if (OLDV == NEWV) {
        $('.CRWShow').attr('style', 'display:none;');
        $('.CRWHide').attr('style', 'display:block;');
        if (AccountTabPressed == 'YES') {
            TabAccountKeyPressed();
        }
    }
    else {
        var CC = parseFloat(NEWV) - parseFloat(OLDV);

        $('#spanFefc').html(parseFloat(parseFloat($('#spanFefc').html().replace(/,/g, "")) + parseFloat(CC)).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFetc').html(parseFloat(parseFloat($('#spanFefc').html().replace(/,/g, "")) - parseFloat($('#spanFTC').html())).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFVariance').html(parseFloat(parseFloat($('#spanFBudget').html().replace(/,/g, "")) - parseFloat($('#spanFefc').html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));

        // Bottom Total


        var SaveValue = $('#txtEFC' + accountNo).val().replace(/,/g, "") * 1;
        var OLDVal = $('#spanEFC' + accountNo).html().replace(/,/g, "") * 1;
        $.ajax({
            url: APIUrlEFCUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + SaveValue.toString().replace(/,/g, "") + '&Changes=' + OLDVal.toString().replace(/,/g, "") + '&COAID=' + accountNo + '&ModeType=EFC',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {
            UpdateEFCSucess(response);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdateEFCSucess(response) {

    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TLength = response.length;

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;

            if (Status == 'OK') {
                $('#spanEFC' + COAIDD).html(parseFloat(BAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtEFC' + COAIDD).val(parseFloat(BAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanETC' + COAIDD).html(parseFloat(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtETC' + COAIDD).val(parseFloat(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanVarianceHeader' + COAIDD).html(parseFloat(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            }
            else {

                var OldAmt = $('#spanEFC' + COAIDD).html().replace(/[^0-9]/g, '');
                var NewAmt = (parseFloat(OldAmt.replace(/[^0-9]/g, '')) || 0) + parseFloat(BAmt);


                $('#spanEFC' + COAIDD).html(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtEFC' + COAIDD).val(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanETC' + COAIDD).html(parseFloat(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanVarianceHeader' + COAIDD).html(parseFloat(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));

            }
        }
        SucessMsg('Record Updated Sucessfully.');
    }

}

function UpdateETC(accountNo, DetailLevel) {
    IsUpdated = 'OK';
    var OLDV = $('#spanETC' + accountNo).html().replace(/,/g, "") * 1;
    var NEWV = $('#txtETC' + accountNo).val().replace(/,/g, "") * 1;
    if (OLDV == NEWV) {
        $('.CRWShow').attr('style', 'display:none;');
        $('.CRWHide').attr('style', 'display:block;');
        if (AccountTabPressed == 'YES') {
            TabAccountKeyPressed();
        }
    }
    else {

        var CC = parseFloat(NEWV) - parseFloat(OLDV);
        // For Botton Total
        $('#spanFetc').html(parseFloat(parseFloat($('#spanFetc').html().replace(/,/g, "")) + parseFloat(CC)).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFefc').html(parseFloat(parseFloat($('#spanFefc').html().replace(/,/g, "")) + parseFloat(CC)).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));

        $('#spanFetc').html(parseFloat(parseFloat($('#spanFefc').html().replace(/,/g, "")) - parseFloat($('#spanFTC').html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFVariance').html(parseFloat(parseFloat($('#spanFBudget').html().replace(/,/g, "")) - parseFloat($('#spanFefc').html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));

        // Bottom Total


        var SaveValue = NEWV - OLDV;
        var OLDEFC = $('#spanEFC' + accountNo).html().replace(/,/g, "");;
        $.ajax({
            url: APIUrlETCUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + SaveValue.toString().replace(/,/g, "") + '&Changes=' + OLDEFC.toString().replace(/,/g, "") + '&COAID=' + accountNo + '&ModeType=ETC',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {

            UpdateETCSucess(response);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdateETCSucess(response) {


    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TLength = response.length;

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;

            if (Status == 'OK') {
                $('#spanEFC' + COAIDD).html(parseFloat(BAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtEFC' + COAIDD).val(parseFloat(BAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));


                $('#spanETC' + COAIDD).html(parseFloat(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));


                $('#spanVarianceHeader' + COAIDD).html(parseFloat(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            }
            else {

                var OldAmt = $('#spanEFC' + COAIDD).html().replace(/,/g, "");
                var NewAmt = parseFloat(OldAmt) + parseFloat(BAmt);

                //$('#spanSumHeader' + COAIDD).html(NewAmt);
                //$('#txtBudget' + COAIDD).val(NewAmt);
                //$('#spanVarianceHeader' + COAIDD).html(NewAmt - parseFloat($('#spanEFC' + COAIDD).html()));

                $('#spanEFC' + COAIDD).html(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtEFC' + COAIDD).val(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanETC' + COAIDD).html(parseFloat(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#spanVarianceHeader' + COAIDD).html(parseFloat(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            }
        }
        SucessMsg('Record Updated Sucessfully.');
    }
}

function FillSegment() {
    $.ajax({
        url: APIUrlFillSegment + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillSegmentSucess(response); })
}

function FillSegmentSucess(response) {
    var TLength = response.length;
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            if (response[i].Classification == 'Episode') {
                $('#lblEP').attr('style', 'display:block;');
                $('#ddlEpisode').attr('style', 'display:block;');
            }
            else if (response[i].Classification == 'Location') {
                $('#lblLO').attr('style', 'display:block;');
                $('#ddlLocation').attr('style', 'display:block;');
            }

        }
    }

}

function UpdateSetBudget(COAID, DetailLevel, SetID) {
    IsUpdated = 'OK';
    var ID = COAID.toString() + SetID.toString();
    var NEWV = $('#txtSetBudget' + ID).val().replace(/,/g, '');
    NEWV = NEWV.toString().replace(/,/g, '') * 1;
    $.ajax({
        url: APIUrlUpdateCRWSetBudget + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + NEWV + '&COAID=' + COAID + '&SetID=' + SetID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {
        UpdateSetBudgetSucess(response, COAID, SetID);
        //  var OLDV = $('#spanEFC' + accountNo).html();

    })
    .fail(function (error)
    { ShowMSG(error); })
}

function UpdateSetBudgetSucess(response, COAID1, SetID1) {
    var SetII = COAID1.toString() + SetID1.toString();
    var TLength = response.length;

    if (TLength > 0) {

        $('#spanSetBudget' + SetII).html($('#txtSetBudget' + SetII).val());
        var BB = $('#txtSetBudget' + SetII).val().replace(/,/g, '') * 1;
        var EFCCC = $('#spanSetEFC' + SetII).html().replace(/,/g, '') * 1;
        var Vari = parseFloat(BB) - parseFloat(EFCCC);
        $('#spanSetVariance' + SetII).html(Vari);


        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;


            if (Status == 'OK') {


            }
            else {
                var OldAmt = $('#spanSumHeader' + COAIDD).html().replace(/,/g, "");
                var NewAmt = parseFloat(OldAmt) + parseFloat(BAmt);
                $('#spanSumHeader' + COAIDD).html(NewAmt);
                $('#txtBudget' + COAIDD).val(NewAmt);

                $('#spanVarianceHeader' + COAIDD).html(NewAmt - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")));
            }

            $('.CRWShow').attr('style', 'display:none;');
            $('.CRWHide').attr('style', 'display:block;');
        }
        SucessMsg('Record Updated Sucessfully.');
    }
}

function EditSetBudget(AccountNo) {
    IsUpdated = 'NO';
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtSetBudget' + AccountNo).attr('style', 'display:block;');
    $('#spanSetBudget' + AccountNo).attr('style', 'display:none;');
    $('#txtSetBudget' + AccountNo).focus();
}

function EditsetETC(ID) {
    IsUpdated = 'NO';
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtsetETC' + ID).attr('style', 'display:block;');
    $('#spansetETC' + ID).attr('style', 'display:none;');
    $('#txtsetETC' + ID).focus();
}

function EditsetEFC(ID) {
    IsUpdated = 'NO';
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtsetEFC' + ID).attr('style', 'display:block;');
    $('#spanSetEFC' + ID).attr('style', 'display:none;');
    $('#txtsetEFC' + ID).focus();
}

function UpdatesetEFC(COAID, DetailLevel, SetID) {
    IsUpdated = 'OK';
    var ID = (COAID).toString() + (SetID).toString();

    var OLDV = $('#spanSetEFC' + ID).html().replace(/,/g, "") * 1;
    var NEWV = $('#txtsetEFC' + ID).val().replace(/,/g, "") * 1;
    if (OLDV == NEWV) {
        $('.CRWShow').attr('style', 'display:none;');
        $('.CRWHide').attr('style', 'display:block;');
        if (AccountTabPressed == 'YES') {
            TabAccountKeyPressed();
        }
    }
    else {

        var SaveValue = $('#txtsetEFC' + ID).val().replace(/,/g, '') * 1;
        var Change = parseFloat(NEWV) - parseFloat(OLDV);

        $.ajax({
            url: APIUrlEFCSetUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + SaveValue.toString().replace(/,/g, "") + '&Changes=' + Change.toString().replace(/,/g, "") + '&COAID=' + COAID + '&SetID=' + SetID,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {
            UpdatesetEFCSucess(response, COAID, SetID);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdatesetEFCSucess(response, COAID1, SetID1) {

    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TLength = response.length;

    if (TLength > 0) {

        var ID = (COAID1).toString() + (SetID1).toString();

        $('#spanSetEFC' + ID).html(numeral($('#txtsetEFC' + ID).val() * 1).format('0,0'));

        $('#spansetETC' + ID).html(numeral(parseFloat($('#spanSetEFC' + ID).html().replace(/,/g, '')) - parseFloat($('#spanTotalCostSet' + ID).html().replace(/,/g, ''))).format('0,0'));
        $('#spanSetVariance' + ID).html(numeral(parseFloat($('#spanSetBudget' + ID).html() * 1) - parseFloat($('#spanSetEFC' + ID).html() * 1)).format('0,0'));


        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;

            if (Status == 'OK') {

            }
            else {

                var OldAmt = $('#spanEFC' + COAIDD).html().replace(/,/g, '') * 1;
                var NewAmt = parseFloat(OldAmt) + parseFloat(BAmt);


                $('#spanEFC' + COAIDD).html(numeral(NewAmt).format('0,0'));
                $('#txtEFC' + COAIDD).val(NewAmt);
                $('#spanETC' + COAIDD).html(numeral(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
                $('#spanVarianceHeader' + COAIDD).html(numeral(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).format('0,0'));

            }
        }
        SucessMsg('Record Updated Sucessfully.');
    }
}

function UpdatesetETC(COAID, DetailLevel, SetID) {
    IsUpdated = 'OK';
    var ID = (COAID).toString() + (SetID).toString();

    var OLDV = $('#spansetETC' + ID).html().replace(/,/g, '') * 1;
    var NEWV = $('#txtsetETC' + ID).val().replace(/,/g, '') * 1;
    if (OLDV == NEWV) {
        $('.CRWShow').attr('style', 'display:none;');
        $('.CRWHide').attr('style', 'display:block;');
        if (AccountTabPressed == 'YES') {
            TabAccountKeyPressed();
        }
    }
    else {
        var SaveValue = NEWV - OLDV;
        $.ajax({
            url: APIUrlETCSetUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + SaveValue.toString().replace(/,/g, "") + '&Changes=' + SaveValue.toString().replace(/,/g, "") + '&COAID=' + COAID + '&SetID=' + SetID,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {

            UpdatesetETCSucess(response, COAID, SetID);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdatesetETCSucess(response, COAID1, SetID1) {
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TLength = response.length;

    if (TLength > 0) {

        var ID = (COAID1).toString() + (SetID1).toString();
        var Changes = parseFloat($('#txtsetETC' + ID).val().replace(/,/g, '') * 1) - parseFloat($('#spansetETC' + ID).html().replace(/,/g, "")) * 1;

        var ETCText = $('#txtsetETC' + ID).val().replace(/,/g, "");
        $('#spansetETC' + ID).html(numeral(ETCText).format('0,0'));

        var FinalEFCVAL = parseFloat($('#txtsetEFC' + ID).val().replace(/,/g, "")) + parseFloat(Changes);
        $('#txtsetEFC' + ID).val(FinalEFCVAL);

        var strval = $('#txtsetEFC' + ID).val().replace(/,/g, "");
        $('#spanSetEFC' + ID).text(strval);



        var NN = (parseFloat($('#spanSetEFC' + ID).text().replace(/,/g, "")) - parseFloat($('#spanTotalCostSet' + ID).text().replace(/,/g, "")));

        $('#spansetETC' + ID).html(numeral(NN).format('0,0'));

        $('#spanSetVariance' + ID).html(numeral(parseFloat($('#spanSetBudget' + ID).html().replace(/,/g, "")) - parseFloat($('#spanSetEFC' + ID).html().replace(/,/g, ""))).format('0,0'));


        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;

            if (Status == 'OK') {

            }
            else {

                var OldAmt = $('#spanEFC' + COAIDD).html().replace(/,/g, "");
                var NewAmt = parseFloat(OldAmt) + parseFloat(BAmt);


                $('#spanEFC' + COAIDD).html(numeral(NewAmt).format('0,0'));
                $('#txtEFC' + COAIDD).val(NewAmt);
                $('#spanETC' + COAIDD).html(numeral(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
                $('#spanVarianceHeader' + COAIDD).html(numeral(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).format('0,0'));

            }
        }
        SucessMsg('Record Updated Sucessfully.');
    }
}

function EditETCb(AccountNo) {
    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtETCb' + AccountNo).attr('style', 'display:block;');
    $('#spanETCb' + AccountNo).attr('style', 'display:none;');
    $('#txtETCb' + AccountNo).focus();
    $('#txtETCb' + AccountNo).select();
}

function EditEFCb(AccountNo) {

    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtEFCb' + AccountNo).attr('style', 'display:block;');
    $('#spanEFCb' + AccountNo).attr('style', 'display:none;');
    $('#txtEFCb' + AccountNo).focus();
    $('#txtEFCb' + AccountNo).select();
}

function EditBudgetb(AccountNo) {

    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtBudgetb' + AccountNo).attr('style', 'display:block;');
    $('#spanSumHeaderb' + AccountNo).attr('style', 'display:none;');
    $('#txtBudgetb' + AccountNo).focus();
    $('#txtBudgetb' + AccountNo).focus();

}

function UpdateBudgetb(accountNo, DetailLevel) {
    var NEWV = $('#txtBudgetb' + accountNo).val().replace(/,/g, '') * 1;
    NEWV = NEWV.toString().replace(/,/g, '') * 1;
    $.ajax({
        url: APIUrlUpdateBudgetBlank + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + NEWV + '&COAID=' + accountNo,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {
        UpdateBudgetbSucess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}

function UpdateBudgetbSucess(response) {
    var TLength = response.length;
    if (TLength > 0) {
        var Diff = 0;
        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;

            if (Status == 'OK') {
                Diff = parseInt($('#txtBudgetb' + COAIDD).val().replace(/,/g, "")) - parseInt($('#spanSumHeaderb' + COAIDD).html().replace(/,/g, ""));
                $('#spanSumHeaderb' + COAIDD).html(numeral(parseFloat(BAmt).toFixed(0)).format('0,0'));
                $('#txtBudgetb' + COAIDD).val(parseFloat(BAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));

                $('#spanVarianceHeaderb' + COAIDD).html(numeral(parseFloat(BAmt - parseFloat($('#spanEFCb' + COAIDD).html().replace(/,/g, ""))).toFixed(0)).format('0,0'));
            }
            else {
                var OldAmt = $('#spanSumHeader' + COAIDD).html().replace(/,/g, "");
                var NewAmt = parseFloat(OldAmt) + parseFloat(Diff);
                $('#spanSumHeader' + COAIDD).html(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
                $('#txtBudget' + COAIDD).val(parseFloat(NewAmt).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));

                $('#spanVarianceHeader' + COAIDD).html(parseFloat(NewAmt - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
            }
            $('.CRWShow').attr('style', 'display:none;');
            $('.CRWHide').attr('style', 'display:block;');
        }

    }
}

function UpdateEFCb(accountNo, DetailLevel) {
    var OLDV = $('#spanEFCb' + accountNo).html().replace(/,/g, '') * 1;
    var NEWV = $('#txtEFCb' + accountNo).val().replace(/,/g, '') * 1;
    if (OLDV == NEWV) {
        $('.CRWShow').attr('style', 'display:none;');
        $('.CRWHide').attr('style', 'display:block;');
        if (AccountTabPressed == 'YES') {
            TabAccountKeyPressed();
        }
    }
    else {
        var Changes = parseFloat(NEWV) - parseFloat(OLDV);
        var SaveValue = $('#txtEFCb' + accountNo).val().replace(/,/g, '') * 1;
        $.ajax({
            url: APIUrlEFCBlankUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + SaveValue.toString().replace(/,/g, "") + '&Changes=' + Changes.toString().replace(/,/g, "") + '&COAID=' + accountNo + '&ModeType=EFC',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {
            UpdateEFCbSucess(response);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdateEFCbSucess(response) {

    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TLength = response.length;

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;

            if (Status == 'OK') {
                $('#spanEFCb' + COAIDD).html(numeral(BAmt).format('0,0'));
                $('#txtEFCb' + COAIDD).val(BAmt);

                $('#spanETCb' + COAIDD).html(numeral(parseFloat($('#spanEFCb' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeaderb' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
                $('#txtETCb' + COAIDD).val(parseFloat($('#spanEFCb' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeaderb' + COAIDD).html().replace(/,/g, "")));
                $('#spanVarianceHeaderb' + COAIDD).html(numeral(parseFloat($('#spanSumHeaderb' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFCb' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
            }
            else {

                var OldAmt = $('#spanEFC' + COAIDD).html().replace(/,/g, '') * 1;
                var NewAmt = parseFloat(OldAmt) + parseFloat(BAmt);

                $('#spanEFC' + COAIDD).html(numeral(NewAmt).format('0,0'));
                $('#txtEFC' + COAIDD).val(NewAmt);
                $('#spanETC' + COAIDD).html(numeral(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
                $('#spanVarianceHeader' + COAIDD).html(numeral(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).format('0,0'));

            }
        }
    }

}

function UpdateETCb(accountNo, DetailLevel) {
    var OLDV = $('#spanETCb' + accountNo).html().replace(/,/g, '') * 1;
    var NEWV = $('#txtETCb' + accountNo).val().replace(/,/g, '') * 1;
    if (OLDV == NEWV) {
        $('.CRWShow').attr('style', 'display:none;');
        $('.CRWHide').attr('style', 'display:block;');
        if (AccountTabPressed == 'YES') {
            TabAccountKeyPressed();
        }
    }
    else {

        var Changes = parseFloat(NEWV) - parseFloat(OLDV);
        var SaveValue = parseFloat($('#txtEFCb' + accountNo).val().replace(/,/g, "")) + Changes;



        $.ajax({
            url: APIUrlEFCBlankUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + SaveValue.toString().replace(/,/g, "") + '&Changes=' + Changes.toString().replace(/,/g, "") + '&COAID=' + accountNo + '&ModeType=EFC',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {
            UpdateETCbSucess(response);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdateETCbSucess(response) {
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TLength = response.length;

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;
            var BAmt = response[i].BAmount;
            var Status = response[i].Status;

            if (Status == 'OK') {
                $('#spanEFCb' + COAIDD).html(numeral(BAmt).format('0,0'));
                $('#txtEFCb' + COAIDD).val(BAmt);

                $('#spanETCb' + COAIDD).html(numeral(parseFloat($('#spanEFCb' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeaderb' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
                $('#txtETCb' + COAIDD).val(parseFloat($('#spanEFCb' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeaderb' + COAIDD).html().replace(/,/g, "")));
                $('#spanVarianceHeaderb' + COAIDD).html(numeral(parseFloat($('#spanSumHeaderb' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFCb' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
            }
            else {

                var OldAmt = $('#spanEFC' + COAIDD).html().replace(/,/g, '') * 1;
                var NewAmt = parseFloat(OldAmt) + parseFloat(BAmt);

                $('#spanEFC' + COAIDD).html(numeral(NewAmt).format('0,0'));
                $('#txtEFC' + COAIDD).val(NewAmt);
                $('#spanETC' + COAIDD).html(numeral(parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanTotalHeader' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
                $('#spanVarianceHeader' + COAIDD).html(numeral(parseFloat($('#spanSumHeader' + COAIDD).html().replace(/,/g, "")) - parseFloat($('#spanEFC' + COAIDD).html().replace(/,/g, ""))).format('0,0'));
            }
        }
    }
}

function LockRow(accountNo, Dlevel, RowID) {

    $.ajax({
        url: APIUrlCRWLockRow + '?COAID=' + accountNo + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {
        LockRowSucess(response, accountNo, Dlevel, RowID);
    })
    .fail(function (error)
    { ShowMSG(error); })
}

function LockRowSucess(response, ID, DLevel, RowID) {
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TLength = response.length;

    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {

            var COAIDD = response[i].COAID;

            $('#tdB' + COAIDD).prop('onclick', null);
            $('#tdETC' + COAIDD).prop('onclick', null);
            $('#tdEFC' + COAIDD).prop('onclick', null);

            $('#spanEFCb' + COAIDD).html($('#spanEFC' + COAIDD).html());
            $('#txtEFCb' + COAIDD).val($('#txtEFC' + COAIDD).val());

            $('#spanETCb' + COAIDD).html($('#spanETC' + COAIDD).html());
            $('#txtETCb' + COAIDD).val($('#txtETC' + COAIDD).val());
            $('#spanVarianceHeaderb' + COAIDD).html($('#spanVarianceHeader' + COAIDD).html());
            $('#txtBudgetb' + COAIDD).val($('#txtBudget' + COAIDD).val());

            $('#spanSumHeaderb' + COAIDD).html($('#spanSumHeader' + COAIDD).html());
        }


        document.getElementById("al" + COAIDD).href = "javascript:ShowNextLevel(" + ID7 + "," + Parentt7 + "," + DLevel7 + "," + RowID7 + "," + Posting7 + ",9," + BudgetAmt7 + ",0," + BudgetChild7 + ")";

        $('.trBlankR').addClass('abcd');

        var ExpandStatus = 9;
        if (DLevel == 1) {
            if (ExpandStatus == 9) {
                GlobalID1 = '';
            }
            if (ID == GlobalID1) {
                $('.drilldown').addClass('abcd');
                $('.ArrowCls').removeClass('fa fa-chevron-down');
                $('.ArrowCls').addClass('fa fa-chevron-right');
                GlobalID1 = '';
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
            }
            else {
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                CurrentRowID = RowID;

                $('#trBlank_' + ID).removeClass('abcd');
                GetSet(ID);

                GlobalCOAID = ID;
                GlobalID1 = ID;
                $('.ArrowCls').removeClass('fa fa-chevron-down');
                $('.ArrowCls').addClass('fa fa-chevron-right');
                $('.drilldown td a li').addClass('fa fa-chevron-right');
                $('.drilldown').addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
                $('.pH' + Parentt).removeClass('abcd');
            }
        }
        if (DLevel == 2) {

            $(".crwDetailRowL3").addClass('abcd');
            $(".crwDetailRowL4").addClass('abcd');
            $(".crwDetailRowL5").addClass('abcd');
            $(".crwDetailRowL6").addClass('abcd');

            if (ID == GlobalID2) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID2 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID2 = ID;

                $('#trBlank_' + ID).removeClass('abcd');
                GetSet(ID);

                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }
        if (DLevel == 3) {

            $(".crwDetailRowL4").addClass('abcd');
            $(".crwDetailRowL5").addClass('abcd');
            $(".crwDetailRowL6").addClass('abcd');
            if (ID == GlobalID3) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID3 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID3 = ID;

                $('#trBlank_' + ID).removeClass('abcd');
                GetSet(ID);

                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }

        if (DLevel == 4) {

            $(".crwDetailRowL5").addClass('abcd');
            $(".crwDetailRowL6").addClass('abcd');
            if (ID == GlobalID4) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID4 = '';
            }
            else {
                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID4 = ID;

                $('#trBlank_' + ID).removeClass('abcd');
                GetSet(ID);

                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }

        if (DLevel == 5) {
            $(".crwDetailRowL6").addClass('abcd');
            if (ID == GlobalID5) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID5 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID5 = ID;

                $('#trBlank_' + ID).removeClass('abcd');
                GetSet(ID);

                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }

        if (DLevel == 6) {
            if (ID == GlobalID6) {
                $('.pH' + Parentt).addClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-down');
                $('#ii' + ID).addClass('fa fa-chevron-right');
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID6 = '';
            }
            else {

                CurrentRowID = RowID;
                $(".crwSetRow").remove();
                $(".crwSeriesRow").remove();
                GlobalID6 = ID;

                $('#trBlank_' + ID).removeClass('abcd');
                GetSet(ID);

                $('.pH' + Parentt).removeClass('abcd');
                $('#ii' + ID).removeClass('fa fa-chevron-right');
                $('#ii' + ID).addClass('fa fa-chevron-down');
            }
        }
    }
}

function CheckSetStatus1() {

    $.ajax({
        url: APIUrlCheckSetSegment + '?ProdID=' + localStorage.ProdId + '&Type=Set',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {
        CheckSetStatusSucess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}

function CheckSetStatusSucess(response) {
    if (response.length > 0) {
        $('.third').removeClass('abcd')
        CheckSetStatus = 'YES';
    }
    else {
        $('.third').addClass('abcd');
        CheckSetStatus = 'NO';
    }
}

function ChecksegmentAfterDT() {

    $.ajax({
        url: APIUrlCheckForSegment + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response) {
        ChecksegmentAfterDTSucess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}

function ChecksegmentAfterDTSucess(response) {
    if (response.length > 0) {
        CheckDTStatus = 'YES';
    }
    else {
        CheckDTStatus = 'NO';
    }
}
