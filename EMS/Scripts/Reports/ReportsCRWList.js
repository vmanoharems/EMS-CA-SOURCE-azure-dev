
var APIUrlFillAccount = HOST + "/api/CRW/GetAccountForCRWFromBudget";
var APIUrlFillLocation = HOST + "/api/CRW/GetLocationForCRWFromBudget";
var APIUrlFillEpisode = HOST + "/api/CRW/GetEpisodeForCRWFromBudget";
var APIUrlFillBudgetForCompany = HOST + "/api/CRW/GetBudgetByCompanyForCRW";
var APIUrlGetCRWInfo = HOST + "/api/CRW/GetCRWRollUp";
var APIUrlFillCrwDetailData = HOST + "/api/CRW/GetCRWDetail";
var APIUrlFillCrwDetailData1 = HOST + "/api/CRW/GetDetailLevelAccountCRW";

var APIUrlFillCrwUpdate = HOST + "/api/CRW/InsertUpdateCRWNew";
var APIUrlGetCRWNote = HOST + "/api/CRW/GetCRWNotesNew";
var APIUrlSaveCRWNote = HOST + "/api/CRW/SaveCRWNotes";
var APIUrlDeleteCRWNote = HOST + "/api/CRW/DeleteCRWNotes";
var APIUrlUpdateCRWNote = HOST + "/api/CRW/UpdateCRWNotes";

var APIUrlGetPODetailListCRW = HOST + "/api/CRW/GetPODetailListCRW";
var APIUrlGetInvoiceDetailListCRW = HOST + "/api/CRW/GetInvoiceDetailListCRW";
var GetJEDetailListCRW = HOST + "/api/CRW/GetJEDetailListCRW";

var APIUrlGetSetForCRW = HOST + "/api/CRW/GetSetForCRW";
var APIUrlGetSeriesForCRW = HOST + "/api/CRW/GetSeriesForCRW";

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

$(document).ready(function () {
    $('.main-sidebar').attr('style', 'display:none;');
    $('.content-wrapper').attr('style', 'margin-left:0;');
    $('.sidebar-toggle').attr('style', 'display:none;');

    FillCompany();
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
        $('#ddlLocation').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
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
        $('#ddlEpisode').append('<option value=' + response[i].AccountCode + '>' + response[i].AccountCode + '</option>');
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
    FillBudgetForCompany(LO, '', 2);
    FillEpisode();
}

function EP() {
    var EP = $('select#ddlEpisode option:selected').val();
    var LO = $('select#ddlLocation option:selected').val();
    FillBudgetForCompany(LO, EP, 3);
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
    }
}

function ShowMSG(error) {
    console.log(error);
}

function FillBudgetForCompanySucess(response) {
    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#tblResponse').attr('style', 'height:' + heightt + 'px;');
    var TLength = response.length;
    var str = '';
    if (TLength > 0) {
        var str = '';
        for (var i = 0; i < TLength; i++) {
            str += "<li id=li" + i + "><a  href='javascript:GetCRW(" + i + "," + response[i].Budgetid + "," + response[i].BudgetFileID + ",\"" + response[i].BudgetName + "\");'>" + response[i].BudgetName + "</a></li>"
        }
    }
    else {
        ShowMsgBox('showMSG', 'No Budgets have been loaded for Company - ' + $('select#ddlCompany option:selected').val() + '', '', 'failuremsg');
    }
    $('#ulBudgetList').html(str);
    $('#tbodyCrw').html('');
}

function GetCRW(liID, BudgetID, BudgetFileID, BudgetName) {

    BudgetIDCrw = BudgetID;
    BudgetFileIDCrw = BudgetFileID;

    $('#ulBudgetList li').removeClass('active');
    $('#li' + liID).addClass('active');

    $('#spanBudget').html('Budget : - ' + BudgetName);
    // CompanyIDCrw = CompanyID;
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
    { GetCRWSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function GetCRWSucess(response) {
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
            var IsPosting = response[i].Posting;


            if (BlankCheck == '(Blank)') {

                str += '<tr id="trBlank_' + response[i].COAID + '" class="trBlankR abcd">';

                var ChildNo = response[i].ChildCount;
                if (ChildNo > 0) {
                    str += '<td></td>';
                }
                else {
                    str += '<td></td>';
                }

                str += '<td>' + response[i].AccountCode + '</td>';
                str += '<td></td>';
                str += '<td></td>';
                str += '<td><b>' + LastAccountName + '</b></td>';
                str += '<td>' + response[i].ActualthisPeriod + '</td>';
                str += '<td>' + response[i].ActualtoDate + '</td>';
                str += '<td>' + response[i].POAmount + '</td>';
                str += '<td><span id=spanTotalHeader' + response[i].COAID + '>' + TotalCost + '</span></td>';

                var EFCC = response[i].EFC;
                if (EFCC > 0) {

                }
                else {
                    EFCC = response[i].Budget;
                }

                var ETCC = 0;
                ETCC = (EFCC) - (TotalCost);

                str += '<td><span id=spanETCHeader' + response[i].BudgetCategoryID + '>' + ETCC + '</span></td>';
                str += '<td><span id=spanEFCHeader' + response[i].BudgetCategoryID + '>' + EFCC + '</span></td>';

                if (DetailLevel == '3') {

                    str += '<td><span id=spanSumHeader' + response[i].BudgetCategoryID + '>' + BudgetAmt + '</span></td>';
                }
                else {
                    str += '<td><span id=spanSumHeader' + response[i].BudgetCategoryID + '>' + response[i].Budget + '</span></td>';
                }

                var Variance = (response[i].Budget) - (EFCC);

                str += '<td><span id=spanVarianceHeader' + response[i].COAID + '>' + Variance + '</span></td>';

                str += '</tr>';

                ChildCount = response[i].ChildCount;
                Posting = response[i].Posting;

            }
            else {
                if (DetailLevel == '1') {
                    str += '<tr class="greenRow">';
                }
                else if (DetailLevel == '2') {
                    BudgetAmt = parseFloat(response[i].Budget) / parseInt(response[i].ChildCount);
                    BudgetAmt = BudgetAmt.toFixed(2);
                    str += '<tr class="drilldown crwDetailRowL2 abcd pH' + Parent + '">';
                }
                else if (DetailLevel == '3') {
                    str += '<tr class="drilldown crwDetailRowL3 abcd pH' + Parent + '">';
                }
                else if (DetailLevel == '4') {
                    str += '<tr class="drilldown crwDetailRowL4 abcd pH' + Parent + '">';
                }
                else if (DetailLevel == '5') {
                    str += '<tr class="drilldown crwDetailRowL5 abcd pH' + Parent + '">';
                }
                else if (DetailLevel == '6') {
                    str += '<tr class="drilldown crwDetailRowL6 abcd pH' + Parent + '">';
                }

                var ChildNo = response[i].ChildCount;
                if (IsPosting == true) {
                    str += '<td><a href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a></td>';
                }
                else if (ChildNo > 0)
                {
                    str += '<td><a href="javascript:ShowNextLevel(' + response[i].COAID + ',' + Child + ',' + DetailLevel + ',' + i + ',' + IsPosting + ');"><i style="color: #fff" id=ii' + response[i].COAID + ' class="fa fa-chevron-right ArrowCls"></i></a></td>';
                }
                else {
                    str += '<td></td>';
                }
                LastAccountName = response[i].AccountName;

                str += '<td>' + response[i].AccountCode + '</td>';
                str += '<td></td>';
                str += '<td></td>';
                str += '<td>' + response[i].AccountName + '</td>';
                str += '<td>' + response[i].ActualthisPeriod1 + '</td>';
                str += '<td>' + response[i].ActualtoDate1 + '</td>';
                str += '<td>' + response[i].POAmount1 + '</td>';
                str += '<td><span id=spanTotalHeader' + response[i].COAID + '>' + TotalCost1 + '</span></td>';

                var EFCC = response[i].EFC;
                if (EFCC > 0) {

                }
                else {
                    EFCC = response[i].Budget;
                }
                var ETCC = 0;
                ETCC = (EFCC) - (TotalCost1);

                //str += '<td><span id=spanETCHeader' + response[i].BudgetCategoryID + '>' + ETCC + '</span></td>';
                //str += '<td><span id=spanEFCHeader' + response[i].BudgetCategoryID + '>' + EFCC + '</span></td>';
        

                str += '<td onclick="javascript:EditETC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanETC' + response[i].COAID + '">' + ETCC + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab" style="display:none;" value="' + ETCC + '" id="txtETC' + response[i].COAID + '" onfocusout="javascript:UpdateETC(' + response[i].COAID + ','+DetailLevel+');"/></td>';
                str += '<td onclick="javascript:EditEFC(\'' + response[i].COAID + '\');"><span class="CRWHide" id="spanEFC' + response[i].COAID + '">' + EFCC + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab" style="display:none;" value="' + EFCC + '" id="txtEFC' + response[i].COAID + '" onfocusout="javascript:UpdateEFC(' + response[i].COAID + ',' + DetailLevel + ');"/> </td>';




                if (DetailLevel == '3') {
                    str += '<td><span id=spanSumHeader' + response[i].COAID + '>' + BudgetAmt + '</span></td>';
                }
                else {  
                    str += '<td><span id=spanSumHeader' + response[i].COAID + '>' + response[i].Budget + '</span></td>';
                }
                var Variance = (response[i].Budget) - (EFCC);

                //if ((response[i].CRWN) > 0) {
                //    str += '<td>' + Variance + '<a style="float:right;" href="javascript:ShowNotes(\'' + response[i].accountnumber + '\',' + i + ')"><i id=iik' + i + ' class="fa fa-pencil-square-o" style="color:Red;"></i></a></td>';
                //}
                //else {
                str += '<td><span id=spanVarianceHeader' + response[i].COAID + '>' + Variance + '</span><a style="float:right;" href="javascript:ShowNotes(\'' + response[i].COAID + '\',' + i + ')"><i id=iik' + i + ' class="fa fa-pencil-square-o" style="color:#5C8FBE;"></i></a></td>';
                //}


             //   str += '<td><span id=spanVarianceHeader' + response[i].COAID + '>' + Variance + '</span></td>';




                str += '</tr>';

                ChildCount = response[i].ChildCount;
                Posting = response[i].Posting;
            }
        }
    }
    else {
        ShowMsgBox('showMSG', 'No Budgets have been loaded for Company - ' + $('select#ddlCompany option:selected').val() + '', '', 'failuremsg');
    }
    $('#tbodyCrw').html(str);
}

function ShowNextLevel(ID, Parentt, DLevel, RowID,Posting) {
    $('.trBlankR').addClass('abcd');
    
    if (DLevel == 1) {
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
            str += '<td>' + response[i].bwamt + '</td>';
            str += '<td>' + response[i].InvAmt + '</td>';
            str += '<td>' + response[i].PoAmt + '</td>';
            str += '<td>' + TotalCost + '</td>';

            var EFCC = response[i].EFC;
            if (EFCC == '') {
                EFCC = response[i].AccountTotal;
            }

            var ETCC = (EFCC) - (TotalCost);

            str += '<td onclick="javascript:EditETC(\'' + response[i].accountnumber + '\');"><span class="CRWHide" id="spanETC' + response[i].accountnumber + '">' + ETCC + '</span><input name=' + (i + 1) + ':1 type="text" class="CRWShow detectTab" style="display:none;" value="' + ETCC + '" id="txtETC' + response[i].accountnumber + '" onfocusout="javascript:UpdateETC(\'' + response[i].accountnumber + '\');"/></td>';
            str += '<td onclick="javascript:EditEFC(\'' + response[i].accountnumber + '\');"><span class="CRWHide" id="spanEFC' + response[i].accountnumber + '">' + EFCC + '</span><input type="text" name=' + (i + 1) + ':2 class="CRWShow detectTab" style="display:none;" value="' + EFCC + '" id="txtEFC' + response[i].accountnumber + '" onfocusout="javascript:UpdateEFC(\'' + response[i].accountnumber + '\');"/> </td>';
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

function UpdateETC(accountNo,DetailLevel) {
    var OLDV = $('#spanETC' + accountNo).html();
    var NEWV = $('#txtETC' + accountNo).val();
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
            url: APIUrlFillCrwUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + NEWV + '&Changes=' + SaveValue + '&COAID=' + accountNo + '&ModeType=ETC',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {
            var EFCHead = $('#spanEFCHeader' + BudgetCategoryIDCrw).html();
            EFCHead = parseFloat(EFCHead) + parseFloat(SaveValue);

            var ETCHead = 0;
            ETCHead = parseFloat(EFCHead) - parseFloat($('#spanTotalHeader' + BudgetCategoryIDCrw).html());

            $('#spanEFCHeader' + BudgetCategoryIDCrw).html(EFCHead);
            $('#spanETCHeader' + BudgetCategoryIDCrw).html(ETCHead);

            var Vari = 0;
            Vari = parseFloat($('#spanSumHeader' + BudgetCategoryIDCrw).html()) - parseFloat(EFCHead)
            $('#spanVarianceHeader' + BudgetCategoryIDCrw).html(Vari);

            UpdateETCSucess(response);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdateETCSucess(response) {
    var AccID = response[0].AccountID;
    var EFC = response[0].SaveType;
     SucessMsg('Record Updated Sucessfully.');
    //$('#spanETC' + AccID).html($('#txtETC' + AccID).val());
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
  
    var TotalCost = $('#spanTotalHeader' + AccID).html();

    $('#spanETC' + AccID).html(parseFloat(EFC) - parseFloat(TotalCost));
    $('#txtETC' + AccID).val(parseFloat(EFC) - parseFloat(TotalCost));

    $('#spanEFC' + AccID).html(EFC);
    $('#txtEFC' + AccID).val(EFC);

    var BudgetAmt = $('#spanSumHeader' + AccID).html();

    $('#spanVarianceHeader' + AccID).html(parseFloat(BudgetAmt) - parseFloat(EFC));
    
    
    //if (AccountTabPressed == 'YES') {
    //    TabAccountKeyPressed();
    //}
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
    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtETC' + AccountNo).attr('style', 'display:block;');
    $('#spanETC' + AccountNo).attr('style', 'display:none;');
    $('#txtETC' + AccountNo).focus();
}


function UpdateEFC(accountNo, DetailLevel) {

    var OLDV = $('#spanEFC' + accountNo).html();
    var NEWV = $('#txtEFC' + accountNo).val();
    if (OLDV == NEWV) {
        $('.CRWShow').attr('style', 'display:none;');
        $('.CRWHide').attr('style', 'display:block;');
        if (AccountTabPressed == 'YES') {
            TabAccountKeyPressed();
        }
    }
    else {

        var SaveValue = $('#txtEFC' + accountNo).val();
        $.ajax({
            url: APIUrlFillCrwUpdate + '?BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&DetailLevel=' + DetailLevel + '&SaveValue=' + SaveValue + '&Changes=' + SaveValue + '&COAID=' + accountNo + '&ModeType=EFC',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',

            contentType: 'application/json; charset=utf-8',
        })

        .done(function (response) {
            var OLDV = $('#spanEFC' + accountNo).html();
            var NEWV = $('#txtEFC' + accountNo).val();

            var SaveValue = NEWV - OLDV;
            var EFCHead = $('#spanEFCHeader' + BudgetCategoryIDCrw).html();
            EFCHead = parseFloat(EFCHead) + parseFloat(SaveValue);

            var ETCHead = 0;
            ETCHead = parseFloat(EFCHead) - parseFloat($('#spanTotalHeader' + BudgetCategoryIDCrw).html());

            $('#spanEFCHeader' + BudgetCategoryIDCrw).html(EFCHead);
            $('#spanETCHeader' + BudgetCategoryIDCrw).html(ETCHead);

            var Vari = 0;
            Vari = parseFloat($('#spanSumHeader' + BudgetCategoryIDCrw).html()) - parseFloat(EFCHead)
            $('#spanVarianceHeader' + BudgetCategoryIDCrw).html(Vari);


            UpdateEFCSucess(response);
        })
        .fail(function (error)
        { ShowMSG(error); })
    }
}

function UpdateEFCSucess(response) {
    var AccID = response[0].AccountID;
    var EFC = response[0].SaveType;
    SucessMsg('Record Updated Sucessfully.');
    //$('#spanETC' + AccID).html($('#txtETC' + AccID).val());
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');

    var TotalCost = $('#spanTotalHeader' + AccID).html();

    $('#spanETC' + AccID).html(parseFloat(EFC) - parseFloat(TotalCost));
    $('#txtETC' + AccID).val(parseFloat(EFC) - parseFloat(TotalCost));

    $('#spanEFC' + AccID).html(EFC);
    $('#txtEFC' + AccID).val(EFC);

    var BudgetAmt = $('#spanSumHeader' + AccID).html();

    $('#spanVarianceHeader' + AccID).html(parseFloat(BudgetAmt) - parseFloat(EFC));

    //if (AccountTabPressed == 'YES') {
    //    TabAccountKeyPressed();
    //}
}

function EditEFC(AccountNo) {
    BudAccID = AccountNo;
    $('.CRWShow').attr('style', 'display:none;');
    $('.CRWHide').attr('style', 'display:block;');
    $('#txtEFC' + AccountNo).attr('style', 'display:block;');
    $('#spanEFC' + AccountNo).attr('style', 'display:none;');
    $('#txtEFC' + AccountNo).focus();
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
        $('#iik' + iiValue).attr('style', 'color:red;');
    }
    else {
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

            str += '<td>' + thisPeriod + '</td>';
            str += '<td>' + Total + '</td>';
            str += '<td>' + Total + '</td>';
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
        url: APIUrlDeleteCRWNote + '?COAID=' + COAIDforNotes + '&BudgetID=' + BudgetIDCrw + '&BudgetFileID=' + BudgetFileIDCrw + '&ProdID=' + localStorage.ProdId+'&UserID=' + localStorage.UserId + '&NotesID=' + NotesID,
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

function GetSetSucess(response) {
    var TLength = response.length;
    // var AMTT = parseFloat(Total) / parseInt(TLength);
    // rowIDCRW1 = parseInt(L1) + parseInt(L2);
    if (TLength > 0) {
        CurrentRowIDSet = CurrentRowID+1;
        for (var i = 0; i < TLength; i++) {

            var TotalCost = response[i].ActualtoDateforSet + response[i].POAmountForSet;
            var str = '';
            str += '<tr class="crwSetRow">';
            str += '<td><a href="javascript:GetSeries(' + i + ',' + response[i].SetID + ')"><i id="Set' + i + '" class="fa fa-chevron-right ArrowCls2"></i></a></td>';
            str += '<td></td>';
            str += '<td style="padding:0 0 0 40px;">' + response[i].SetCode + '</td>';

            str += '<td></td>';
            str += '<td>' + response[i].SetDescription + '</td>';
            str += '<td>' + response[i].ActualthisPeriodforSet + '</td>';
            str += '<td>' + response[i].ActualtoDateforSet + '</td>';
            str += '<td>' + response[i].POAmountForSet + '</td>';
            str += '<td>' + TotalCost + '</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
            str += '<td>0</td>';
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

        //if (GlobalIDSet == 0)
        //{
        //    CurrentRowIDSeries = CurrentRowID + GlobalIDSet + 1;
        //}
        //else
        //{

        CurrentRowIDSeries = CurrentRowID + GlobalIDSet + 2;
        // }

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
            str += '<td>' + response[i].ActualthisPeriod + '</td>';
            str += '<td>' + response[i].ActualtoDate + '</td>';
            str += '<td>' + response[i].PoAmount + '</td>';
            str += '<td>' + TotalCost + '</td>';
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
