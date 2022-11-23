
var APIUrlImportBudget = HOST + "/api/BudgetOperation/InsertBudgetFileLedger";
var APIUrlFillSegment = HOST + "/api/Payroll/GetSegmentForPayroll";
var APIUrlFillAccountType = HOST + "/api/Ledger/GetAccountTypeForGL";
var APIUrlFillBudgetCategory = HOST + "/api/Ledger/GetBudgetCategoryForGL";
var APIUrlFillBudgetAccount = HOST + "/api/Ledger/GetBudgetAccountForGL";
var APIUrlFillBudgetDetail = HOST + "/api/Ledger/GetBudgetDetailForGL";
var ApiUrlfunSaveOther = HOST + "/api/Ledger/InsertUpdateAccounts";

var AccountListStr = '';
var BudgetFileIDLedger;
var LedgerButtonName = 'Category';
var LedgerLoadCount = 0;
var DetailLoadCount = 0;
var DetailChildLoadCount = 0;

var ChCategory1 = 0;
var ChAccount1 = 0;
var ChDetail1 = 0;


$(document).ready(function () {
    $('#setting').attr('style', 'display:none;');
    showLoad(2);
});

function ShowBudget(DivName) {
    $('#tabSettings').attr('style', 'display:none;');
    $('#tabLoadAccounts').attr('style', 'display:none;');
    $('#tabBuildCOA').attr('style', 'display:none;');
    $('#tabResults').attr('style', 'display:none;');

    $('#' + DivName).attr('style', 'display:block;');
    showLoad(2);
}

function UploadXML() {
    $('#btn1').attr('style', 'display:none;');
    BudgetStatus = 'Saved';

    BudgetAction = 'Initial Upload';

    var data = new FormData();
    var files = $("#fileXML").get(0).files;
    var LeaveCOA = 1;

    if (files.length > 0) {
        if ($('#chkCOA').attr('checked')) {
            $('#liCOA').attr('style', 'display:block;');
        } else {
            $('#liCOA').attr('style', 'display:none;');
        }

        $('#fileXML').attr('style', 'border: none;');
        showLoad(1);


        data.append("UploadedXML", files[0]);
        data.append("uploadedby", localStorage.UserId);
        data.append("prodid", localStorage.ProdId);


        var ajaxRequest = $.ajax({

            url: APIUrlImportBudget,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: "POST",
            //  async: false,
            contentType: false,
            processData: false,
            data: data
        });
        ajaxRequest.done(function (response) {
            BudgetFileIDLedger = response;
            FillSegment();
            ShowBudget('tabLoadAccounts');
            $('#liSetting').removeClass('active');
            $('#liLoadAccount').addClass('active');
            $('#dvCategoryddl').addClass('BudgetLedgerBg');
        });

    }
    else {
        $('#btn1').attr('style', 'display:block;');
        $('#fileXML').attr('style', 'border: 1px solid red !important;');
    }
}

function showLoad(value) {
    if (value == 1) {
        $('#dvLoader').attr('style', 'display:block;');
    }
    else {
        $('#dvLoader').attr('style', 'display:none;');
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
            var Check = response[i].Classification
            if (Check == 'Ledger') {
                $('#ddlCategory').append('<option value=' + response[i].segmentid + '>' + response[i].SegmentName + '</option>');
            }
            else if (Check == 'Detail') {
                $('#ddlAccounts').append('<option value=' + response[i].segmentid + '>' + response[i].SegmentName + '</option>');
                $('#ddlDetails').append('<option value=' + response[i].segmentid + '>' + response[i].SegmentName + '</option>');
            }
            //else if (Check == 'Detail') {
            //    $('#ddlDetails').append('<option value=' + response[i].segmentid + '>' + response[i].SegmentName + '</option>');
            //}
        }
    }
}

function LoadCategory() {
    var VarValue = $('select#ddlAccounts option:selected').val();
    if (VarValue == undefined) {
        ShowMsgBox('showMSG', 'Detail Account not Setup in Segment Section.', '', 'failuremsg');
    }
    else {
        showLoad(1);
        $('#btnLoadAccount').attr('style', 'display:none;');
        $('#btnLoadCategory').attr('style', 'display:block;');
        FillAccountType();
    }
}

function FillAccountType() {
    $.ajax({
        url: APIUrlFillAccountType + '?ProdID=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillAccountTypeSucess(response); })
     .fail(function (error) {
         console.log(error);
     })
}

function FillAccountTypeSucess(response) {

    var TLength = response.length;
    AccountListStr = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {

            AccountListStr += '<option value=' + response[i].AccountTypeID + '>' + response[i].Code + '</option>';
        }
    }
    FillCategoryData();
}

function FillCategoryData() {
    $.ajax({
        url: APIUrlFillBudgetCategory + '?Budgetfileid=' + BudgetFileIDLedger + '&ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillCategoryDataSucess(response); })
}

function FillCategoryDataSucess(response) {
    var TLength = response.length;
    var StrHtml = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            if (response[i].AccountAbail == 'YES') {
                StrHtml += '<tr class="trLedgerCls">';
            }
            else {
                StrHtml += '<tr>';
            }

            // StrHtml += '<option value=' + response[i].AccountTypeID + '>' + response[i].Code + '</option>';
            StrHtml += '<td><input type="checkbox" id=chk' + i + '><span style="display:none;" id=spanAcCheck' + i + '>' + response[i].AccountAbail + '</span></td>';
            StrHtml += '<td><span id=spanCat' + i + '>' + response[i].CategoryNumber + '</span></td>';
            StrHtml += '<td><span id=spanDesc' + i + '>' + response[i].CategoryDescription + '</span></td>';
            StrHtml += '<td><select id=ddlCateAccount' + (i + 1) + '>' + AccountListStr + '</select></td>';
            StrHtml += '<td><input type="checkbox" id=chkBalance' + i + '/></td>';
            StrHtml += '</tr>';
        }
    }
    $('#tbodyBudgetCategory').html(StrHtml);
    $('#tblBudgetCategory').attr('style', 'display:block;');
    showLoad(2);
}
function SaveCategoryGL() {

    SaveCategoryFromBudget();
}

function SaveCategoryFromBudget() {
    if (StrClassification == 'Ledger') {
        fnSaveLedger();
    }
    else if (StrClassification == 'Detail') {
        fnSaveDetail();
    }
}

function fnSaveLedger() {
    var ObjDefaultArr = [];
    var TblCodes = $('#tbodyBudgetCategory tr').length;

    var CheckStatus = '';
    var CountNo = 0;
    for (i = 0; i < TblCodes; i++) {
        //  spanAcCheck
        if ($("#chk" + i).prop("checked")) {
            var Status = $("#spanAcCheck" + i).html();
            if (Status == 'YES') {
                CheckStatus = '1';
            }
            else {
                CountNo = CountNo + 1;
            }
        }
    }
    if (CheckStatus == '') {
        if (CountNo == 0) {
            ShowMsgBox('showMSG', 'Please Select Atleast one account !!', '', 'failuremsg');
        }
        else {
            showLoad(1);
            LedgerLoadCount = CountNo;

            for (i = 0; i < TblCodes; i++) {
                if ($("#chk" + i).prop("checked")) {
                    var BalanceSheet = '';
                    //  if ($('#chkCheckAll').attr('checked'))
                    if ($("#chkBalance" + i).prop("checked")) {
                        BalanceSheet = 1;
                    } else {
                        BalanceSheet = 0;
                    }

                    var ObjAccount = {
                        AccountId: 0
                  , SegmentId: StrSegmentId
                  , AccountCode: $('#spanCat' + i).text()
                  , AccountName: $('#spanDesc' + i).text()  //Description in all and 
                  , AccountTypeId: $('#ddlCateAccount' + (i + 1)).val() // // ledger
                  , BalanceSheet: BalanceSheet // Ledger
                  , Status: true     // All
                  , Posting: ''  // Details
                  , SubLevel: '' // Details
                  , SegmentType: StrClassification //All
                  , ParentId: '' //Detail
                  , CreatedBy: localStorage.UserId
                  , ProdId: localStorage.ProdId
                    }
                    ObjDefaultArr.push(ObjAccount);
                }

            }
            // TblArr.push(ObjAccount);
            $.ajax({
                url: ApiUrlfunSaveOther,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                cache: false,
                type: 'POST',

                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjDefaultArr),
            })
            .done(function (response) { SaveOtherCategorySuccess(response); })
            .fail(function (error) { console.log(error); })
        }
    }
    else {
        ShowMsgBox('showMSG', 'Please Correct error first !!', '', 'failuremsg');
    }
}
function SaveOtherCategorySuccess(response) {
    $('#btnBudCategory1').attr('style', 'display:none;');
    $('#btnBudCategory2').attr('style', 'display:block;');

    document.getElementById('dvBudgetTop').scrollTop = 0;
    ShowMsgBox('showMSG', 'Account Created Sucessfully. !!', '', '');
    fnLoadBudgetAccounts();
}

function CheckAllBudgetLedger() {
    var CheckStatus = '';
    if ($("#chkCheckAll").prop("checked")) {
        CheckStatus = 'checked';
    } else {
        CheckStatus = 'unchecked';
    }

    var TblCodes = $('#tbodyBudgetCategory tr').length;
    for (i = 0; i < TblCodes; i++) {
        if (CheckStatus == 'checked') {
            $("#chk" + i).prop('checked', true)
        }
        else {
            $("#chk" + i).prop('checked', false);
        }
    }
}

function CheckAllBudgetAccountLedger() {
    var CheckStatus = '';
    if ($("#chkCheckAllAccount").prop("checked")) {
        CheckStatus = 'checked';
    } else {
        CheckStatus = 'unchecked';
    }

    var TblCodes = $('#tbodyBudgetAccount tr').length;
    for (i = 0; i < TblCodes; i++) {
        if (CheckStatus == 'checked') {
            $("#chkAccount" + i).prop('checked', true)
        }
        else {
            $("#chkAccount" + i).prop('checked', false);
        }
    }
}

function fnLoadBudgetAccounts() {

    $('#btnLoadCategory').attr('style', 'display:none;');
    $('#btnLoadAccounts').attr('style', 'display:block;');
    $('#dvCategoryddl').removeClass('BudgetLedgerBg');
    $('#dvAccountddl').addClass('BudgetLedgerBg');

    $('#dvBudgetCategoryDivision').attr('style', 'display:none;');
    $('#dvBudgetAccountsDivision').attr('style', 'display:block;');

    FillAccountDataFromBudget();
}


function FillAccountDataFromBudget() {
    $.ajax({
        url: APIUrlFillBudgetAccount + '?Budgetfileid=' + BudgetFileIDLedger + '&ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillAccountDataFromBudgetSucess(response); })
}

function FillAccountDataFromBudgetSucess(response) {
    var TLength = response.length;
    var StrHtml = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            if (response[i].AccountAvailable == 'YES') {
                StrHtml += '<tr class="trLedgerCls">';
            }
            else {
                StrHtml += '<tr>';
            }

            StrHtml += '<td><input type="checkbox" id=chkAccount' + i + '><span style="display:none;" id=spanAcChecks' + i + '>' + response[i].AccountAvailable + '</span><span style="display:none;" id=spanAcID' + i + '>' + response[i].ParentID + '</span></td>';
            // StrHtml += '<td><input type="checkbox" id=chkAccount' + i + '></td>';
            StrHtml += '<td><span id=spanCategoryAccount' + i + '>' + response[i].CategoryNumber + '</span></td>';
            StrHtml += '<td><span id=spanCategoryCode' + i + '>' + response[i].AccountNumber + '</span></td>';
            StrHtml += '<td><span id=spanDescAccount' + i + '>' + response[i].AccountDesc + '</span></td>';
            StrHtml += '<td><input type="checkbox" id=chkBalanceAccount' + i + '/></td>';
            StrHtml += '</tr>';
        }
    }
    $('#tbodyBudgetAccount').html(StrHtml);
    showLoad(2);
    // $('#tbodyBudgetAccount').attr('style', 'display:block;');
}

function SaveAccountsGL() {

    var ObjDefaultArr = [];
    var TblCodes = $('#tbodyBudgetAccount tr').length;

    var CheckStatus = '';
    var CountNo = 0;
    for (i = 0; i < TblCodes; i++) {

        if ($("#chkAccount" + i).prop("checked")) {
            var Status1 = $("#spanAcChecks" + i).html();
            if (Status1 == 'YES') {
                CheckStatus = '1';
            }
            else {
                CountNo = CountNo + 1;
            }
        }
    }
    if (CheckStatus == '') {
        if (CountNo == 0) {
            ShowMsgBox('showMSG', 'Please Select Atleast one account !!', '', 'failuremsg');
        }
        else {
            showLoad(1);
            DetailLoadCount = CountNo;

            for (i = 0; i < TblCodes; i++) {
                if ($("#chkAccount" + i).prop("checked")) {
                    var Posting = '';
                    //  if ($('#chkCheckAll').attr('checked'))
                    if ($("#chkBalanceAccount" + i).prop("checked")) {
                        Posting = 1;
                    } else {
                        Posting = 0;
                    }

                    var ObjAccount = {
                        AccountId: 0
                  , SegmentId: 5
                  , AccountCode: $('#spanCategoryCode' + i).text()
                  , AccountName: $('#spanDescAccount' + i).text()  //Description in all and 
                  , AccountTypeId: '0' // // ledger
                  , BalanceSheet: false // Ledger
                  , Status: true     // All
                  , Posting: $("#chkBalanceAccount" + i).prop("checked")  // Details
                  , SubLevel: '1' // Details
                  , SegmentType: 'Detail' //All
                  , ParentId: $('#spanAcID' + i).text() //Detail  
                  , CreatedBy: localStorage.UserId
                  , ProdId: localStorage.ProdId
                    }
                    ObjDefaultArr.push(ObjAccount);
                }

            }
            // TblArr.push(ObjAccount);
            $.ajax({
                url: ApiUrlfunSaveOther,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                cache: false,
                type: 'POST',

                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjDefaultArr),
            })
            .done(function (response) { SaveAccountSuccess(response); })
            .fail(function (error) { console.log(error); })
        }
    }
    else {
        ShowMsgBox('showMSG', 'Please Correct error first !!', '', 'failuremsg');
    }
}
function SaveAccountSuccess(response) {
    $('#btnBudAccount1').attr('style', 'display:none;');
    $('#btnBudAccount2').attr('style', 'display:block;');

    ShowMsgBox('showMSG', 'Account Created Sucessfully. !!', '', '');
    fnLoadBudgetDetails();
}
function fnLoadBudgetDetails() {

    $('#btnLoadAccounts').attr('style', 'display:none;');
    $('#btnLoadDetails').attr('style', 'display:block;');
    $('#dvAccountddl').removeClass('BudgetLedgerBg');
    $('#dvDetailddl').addClass('BudgetLedgerBg');
    $('#dvBudgetAccountsDivision').attr('style', 'display:none;');
    $('#dvBudgetDetailsDivision').attr('style', 'display:block;');
    FillDetailDataFromBudget();
}

function FillDetailDataFromBudget() {
    $.ajax({
        url: APIUrlFillBudgetDetail + '?Budgetfileid=' + BudgetFileIDLedger + '&ProdId=' + localStorage.ProdId,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillDetailDataFromBudgetSucess(response); })
}

function FillDetailDataFromBudgetSucess(response) {
    $('#btnBudDetail1').attr('style', 'display:none;');
    $('#btnBudDetail2').attr('style', 'display:block;');

    var TLength = response.length;
    var StrHtml = '';
    var OldStr = ''
    var NewStr = '';
    var GlobalCount = 1;
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            NewStr = response[i].AccountCode;
            if (OldStr == '') {
                if (response[i].Available == 'NO') {
                    StrHtml += '<tr class="trLedgerCls">';
                }
                else {
                    StrHtml += '<tr>';
                }

                StrHtml += '<td><input type="checkbox" id=chkDetail' + i + '><span style="display:none;" id=spanDetailCheck' + i + '>' + response[i].Available + '</span><span style="display:none;" id=spanDetailID' + i + '>' + response[i].ParentID + '</span></td>';
                StrHtml += '<td><span id=spanCategoryAccount' + i + '>' + response[i].AccountNumber1 + '</span></td>';

                StrHtml += '<td><input type="text" id=txtDetailCode' + i + ' value="' + response[i].DetailCode + '"/></td>';
                if (response[i].Description1 == '') {
                    StrHtml += '<td><input type="text" class="txtBgForDetail" onfocusout="javascript:BdetailDesc(' + i + ');" id=txtDetailCodeDesc' + i + ' value="' + response[i].Description1 + '"/></td>';
                }
                else {
                    StrHtml += '<td><input type="text" id=txtDetailCodeDesc' + i + ' onfocusout="javascript:BdetailDesc(' + i + ');"  value="' + response[i].Description1 + '"/></td>';
                }

                StrHtml += '<td><input type="checkbox" checked id=chkPostingDetail' + i + '></td>';
                StrHtml += '</tr>';
                OldStr = response[i].AccountNumber1;
            }
            else if (OldStr == NewStr) {
                if (response[i].Available == 'NO') {
                    StrHtml += '<tr class="trLedgerCls">';
                }
                else {
                    StrHtml += '<tr>';
                }

                StrHtml += '<td><input type="checkbox" id=chkDetail' + i + '><span style="display:none;" id=spanDetailCheck' + i + '>' + response[i].Available + '</span><span style="display:none;" id=spanDetailID' + i + '>' + response[i].ParentID + '</span></td>';
                StrHtml += '<td><span id=spanCategoryAccount' + i + '>' + response[i].AccountNumber1 + '</span></td>';

                StrHtml += '<td><input type="text" id=txtDetailCode' + i + ' value="' + response[i].DetailCode + '"/></td>';
                if (response[i].Description1 == '') {
                    StrHtml += '<td><input type="text" class="txtBgForDetail" onfocusout="javascript:BdetailDesc(' + i + ');" id=txtDetailCodeDesc' + i + ' value="' + response[i].Description1 + '"/></td>';
                }
                else {
                    StrHtml += '<td><input type="text" id=txtDetailCodeDesc' + i + ' onfocusout="javascript:BdetailDesc(' + i + ');" value="' + response[i].Description1 + '"/></td>';
                }
                StrHtml += '<td><input type="checkbox" checked id=chkPostingDetail' + i + '></td>';
                StrHtml += '</tr>';
                OldStr = response[i].AccountNumber1;
            }
            else {
                GlobalCount = 1;
                if (response[i].Available == 'NO') {
                    StrHtml += '<tr class="trLedgerCls">';
                }
                else {
                    StrHtml += '<tr>';
                }

                StrHtml += '<td><input type="checkbox" id=chkDetail' + i + '><span style="display:none;" id=spanDetailCheck' + i + '>' + response[i].Available + '</span><span style="display:none;" id=spanDetailID' + i + '>' + response[i].ParentID + '</span></td>';
                StrHtml += '<td><span id=spanCategoryAccount' + i + '>' + response[i].AccountNumber1 + '</span></td>';


                StrHtml += '<td><input type="text" id=txtDetailCode' + i + ' value="' + response[i].DetailCode + '"/></td>';
                if (response[i].Description1 == '') {
                    StrHtml += '<td><input type="text" onfocusout="javascript:BdetailDesc(' + i + ');" class="txtBgForDetail" id=txtDetailCodeDesc' + i + ' value="' + response[i].Description1 + '"/></td>';
                }
                else {
                    StrHtml += '<td><input type="text" onfocusout="javascript:BdetailDesc(' + i + ');" id=txtDetailCodeDesc' + i + ' value="' + response[i].Description1 + '"/></td>';
                }
                StrHtml += '<td><input type="checkbox" checked id=chkPostingDetail' + i + '></td>';
                StrHtml += '</tr>';
                OldStr = response[i].AccountNumber1;

            }

        }
    }
    $('#tbodyBudgetDetail').html(StrHtml);
    // $('#tbodyBudgetAccount').attr('style', 'display:block;');
    showLoad(2);
}

function chkCheckAllDetail() {
    var CheckStatus = '';
    if ($("#chkCheckAllDetail").prop("checked")) {
        CheckStatus = 'checked';
    } else {
        CheckStatus = 'unchecked';
    }

    var TblCodes = $('#tbodyBudgetDetail tr').length;
    for (i = 0; i < TblCodes; i++) {
        if (CheckStatus == 'checked') {
            $("#chkDetail" + i).prop('checked', true)
        }
        else {
            $("#chkDetail" + i).prop('checked', false);
        }
    }
}

function SaveDetailsGL() {
    var ObjDefaultArr = [];
    var TblCodes = $('#tbodyBudgetDetail tr').length;

    var CheckStatus = '';
    var CountNo = 0;
    for (i = 0; i < TblCodes; i++) {

        if ($("#chkDetail" + i).prop("checked")) {
            var Status = $("#spanDetailCheck" + i).html();
            if (Status == 'NO') {
                CheckStatus = '1';
            }
            else {
                CountNo = CountNo + 1;
            }
            if ($('#txtDetailCode' + i).val() == '') {
                CheckStatus = '1';
            }
            if ($('#txtDetailCodeDesc' + i).val() == '') {
                CheckStatus = '1';
            }
        }

    }
    if (CheckStatus == '') {
        if (CountNo == 0) {
            ShowMsgBox('showMSG', 'Please Select Atleast one account !!', '', 'failuremsg');
        }
        else {
            DetailChildLoadCount = CountNo;
            for (i = 0; i < TblCodes; i++) {
                if ($("#chkDetail" + i).prop("checked")) {
                    var Posting = '';
                    //  if ($('#chkCheckAll').attr('checked'))
                    if ($("#chkBalanceAccount" + i).prop("checked")) {
                        Posting = 1;
                    } else {
                        Posting = 0;
                    }

                    var ObjAccount = {
                        AccountId: 0
                  , SegmentId: 5
                  , AccountCode: $('#txtDetailCode' + i).val()
                  , AccountName: $('#txtDetailCodeDesc' + i).val()  //Description in all and 
                  , AccountTypeId: '0' // // ledger
                  , BalanceSheet: false // Ledger
                  , Status: true     // All
                  , Posting: $("#chkPostingDetail" + i).prop("checked")  // Details
                  , SubLevel: '2' // Details
                  , SegmentType: 'Detail' //All
                  , ParentId: $('#spanDetailID' + i).text() //Detail  
                  , CreatedBy: localStorage.UserId
                  , ProdId: localStorage.ProdId
                    }
                    ObjDefaultArr.push(ObjAccount);
                }

            }
            // TblArr.push(ObjAccount);
            $.ajax({
                url: ApiUrlfunSaveOther,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                cache: false,
                type: 'POST',

                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjDefaultArr),
            })
            .done(function (response) { SaveDetailSuccess(response); })
            .fail(function (error) { console.log(error); })
        }
    }
    else {
        ShowMsgBox('showMSG', 'Please Correct error first !!', '', 'failuremsg');
    }
}
function SaveDetailSuccess(response) {
    ShowMsgBox('showMSG', 'Account Created Sucessfully. !!', '', '');
    $('#tabLoadAccounts').attr('style', 'display:none;');
    $('#tabResults').attr('style', 'display:block;');
    $('#liLoadAccount').removeClass('active');
    $('#liResult').addClass('active');
    $('#spanResultLedger').html(LedgerLoadCount);
    $('#spanResultDetail').html(DetailLoadCount);
    $('#spanResultDetailChild').html(DetailChildLoadCount);
}

function BdetailDesc(ID) {
    var textDetail = $('#txtDetailCodeDesc' + ID).val();
    if (textDetail == '') {
        $('#txtDetailCodeDesc' + ID).addClass('txtBgForDetail');
    }
    else {
        $('#txtDetailCodeDesc' + ID).removeClass('txtBgForDetail');
    }
}

function AddAccountFromBudget() {
    $('#btn1').attr('style', 'display:block;');
    $('#fileXML').val('');
    $('.BudgetTopCls').removeClass('active');
    $('#liLoadAccount').addClass('active');
    $('.tabCls').attr('style', 'display:none;');
    $('#tabSettings').attr('style', 'display:block;');

    showDiv('setting');
}

function LoadCategoryPrevious1()
{
    if (ChCategory1 == 0) {
        LoadCategoryPrevious();
    }
    else {
        $('.BudgetLedgerClsNew').attr('style', 'display:none;');
        $('#dvAccountddl').removeClass('BudgetLedgerBg');
        $('#dvDetailddl').removeClass('BudgetLedgerBg');
        $('#dvCategoryddl').addClass('BudgetLedgerBg');
        $('#btnLoadCategory').attr('style', 'display:block;');
        $('#dvBudgetCategoryDivision').attr('style', 'display:block;');
        $('#tblBudgetCategory').attr('style', 'display:block;');
    }
}

function LoadCategoryPrevious() {
    ChCategory1 = 1;
    showLoad(1);
    $('.BudgetLedgerClsNew').attr('style', 'display:none;');

    $('#dvAccountddl').removeClass('BudgetLedgerBg');
    $('#dvDetailddl').removeClass('BudgetLedgerBg');
    $('#dvCategoryddl').addClass('BudgetLedgerBg');
    $('#btnLoadCategory').attr('style', 'display:block;');
    $('#dvBudgetCategoryDivision').attr('style', 'display:block;');
    FillAccountType();
}

function SaveCategoryGLPrevious1()
{
    if (ChAccount1 == 0) {
        SaveCategoryGLPrevious();
    }
    else {
        $('.BudgetLedgerClsNew').attr('style', 'display:none;');

        $('#dvAccountddl').addClass('BudgetLedgerBg');
        $('#dvDetailddl').removeClass('BudgetLedgerBg');
        $('#dvCategoryddl').removeClass('BudgetLedgerBg');
        $('#dvBudgetAccountsDivision').attr('style', 'display:block;');
        $('#btnLoadAccounts').attr('style', 'display:block;');
    }
}

function SaveCategoryGLPrevious() {
    ChAccount1 = 1;
    showLoad(1);
    $('.BudgetLedgerClsNew').attr('style', 'display:none;');

    $('#dvAccountddl').addClass('BudgetLedgerBg');
    $('#dvDetailddl').removeClass('BudgetLedgerBg');
    $('#dvCategoryddl').removeClass('BudgetLedgerBg');
    $('#dvBudgetAccountsDivision').attr('style', 'display:block;');
    $('#btnLoadAccounts').attr('style', 'display:block;');

    FillAccountDataFromBudget();
}

function SaveDetailGLPrevious1() {
    if (ChDetail1 == 0) {
        SaveDetailGLPrevious();
    }
    else {
        $('.BudgetLedgerClsNew').attr('style', 'display:none;');
        $('#dvAccountddl').removeClass('BudgetLedgerBg');
        $('#dvDetailddl').addClass('BudgetLedgerBg');
        $('#dvCategoryddl').removeClass('BudgetLedgerBg');
        $('#dvBudgetDetailsDivision').attr('style', 'display:block;');
        $('#btnLoadDetails').attr('style', 'display:block;');
        $('#btnBudDetail1').attr('style', 'display:none;');
        $('#btnBudDetail2').attr('style', 'display:block;');
    }

}

function SaveDetailGLPrevious() {
    ChDetail1 = 1;
    showLoad(1);
    $('.BudgetLedgerClsNew').attr('style', 'display:none;');
    $('#dvAccountddl').removeClass('BudgetLedgerBg');
    $('#dvDetailddl').addClass('BudgetLedgerBg');
    $('#dvCategoryddl').removeClass('BudgetLedgerBg');

    $('#dvBudgetDetailsDivision').attr('style', 'display:block;');
    $('#btnLoadDetails').attr('style', 'display:block;');

    FillDetailDataFromBudget();


}


//$(document).on('keydown', 'input.detectTab', function (e) {
//    var keyCode = e.keyCode || e.which;
//    if (keyCode == 27) {

//    }
//});

$(document).keyup(function (e) {

    if (e.keyCode == 27) {
        hideDiv('setting');
    }
});