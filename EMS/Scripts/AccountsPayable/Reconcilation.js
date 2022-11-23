var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlGetRoncilation = HOST + "/api/AccountPayableOp/GetBankReconcilation";
var APIUrlGenerateReconcilation = HOST + "/api/AccountPayableOp/GenerateBankReconcilation";
var APIUrlBankBalance = HOST + "/api/AccountPayableOp/GetBankBalance";
var APIUrlSaveAdjustment = HOST + "/api/AccountPayableOp/SaveBankAdjustment";
var APIUrlGetBankAdjustment = HOST + "/api/AccountPayableOp/GetBankAdjustmentData";
var APIUrlUpdateAdjustment = HOST + "/api/AccountPayableOp/UpdateAdjustment";
var APIUrlAction = HOST + "/api/AccountPayableOp/BankReconcilatinAction";
var APIUrlGetBankTransaction = HOST + "/api/AccountPayableOp/GetBankTransaction";
var APIUrlGetBankTransactionDisplayAll = HOST + "/api/AccountPayableOp/GetBankTransactionDisplayAll";
var APIUrlClearedCheck = HOST + "/api/AccountPayableOp/ClearedCheck";
var APIUrlUpdateCheckProperty = HOST + "/api/AccountPayableOp/UpdateCheckProperty";
var APIUrlInsertUpdateClearedTransaction = HOST + "/api/AccountPayableOp/Reconciliation_ClearedTransaction";
var APIUrlReportsBankRecDetail = HOST + "/api/ReportAPI/ReportsBankRecDetail";
var APIUrlReportsBankRecSummary = HOST + "/api/ReportAPI/ReportsBankRecSummary";
var APIUrlGetRoncilationList = HOST + "/api/ReportP1/GetReconcilationList";

var GetDate = '';
var CheckBankID = [];
var StrCheckNumber = 0;
var strTempCheck = 0;
var strArrDetail = [];
var BankIDD;
var PublicReconcilationID;
var PaymentFeeOut;
var PaymentFeeCleared;
var VoidListIDs = '';
var ArrBankTransaction = [];

var G_SuspendCalculationUpdate = false;
var G_ForceChecked = false;

let objBR = {
    isAlreadyStarted: false
    , isTransactionListOpen: false
    , isAdjustmentListOpen: false
    , Delta: {}
    , ArrDelta: []
    , Header: {
        AmountStatmentEnding: 0
        , AmountPriorStatementBalance: 0
        , AJCleared: 0
        , AJOutstanding: 0
        , AmountUnreconciledDifference: 0
        , AmountReconciledDifference: 0
        , DRCleared: 0
        , DROutstanding: 0
        , CRCleared: 0
        , CROutstanding: 0
        , PriorStatementBalance: 0
        , Reset: function () {
            this.AmountUnreconciledDifference = 0;
            this.AmountReconciledDifference = 0;
            this.DRCleared = 0;
            this.DROutstanding = 0;
            this.CRCleared = 0;
            this.CROutstanding = 0;
        }
        , Sum: function (DOMobj, precision) {
            precision = (precision === undefined)? 2: precision;
            let returnval = 0;

            $('#' + DOMobj).each(function () {
                returnval += numeral(($(this).is('input')) ? $(this).val() : $(this).html()).value();
            });
            return numeral(returnval.toFixed(precision)).value();
        }
        , UpdateCalculcations: function () {
            this.Reset();

            this.DRCleared = this.Sum('tblTrans tr.bankr-checked td.BR_BT_DR');
            this.DROutstanding = this.Sum('tblTrans tr:not(.bankr-checked) td.BR_BT_DR');
            this.CRCleared = this.Sum('tblTrans tr.bankr-checked td.BR_BT_CR');
            this.CROutstanding = this.Sum('tblTrans tr:not(.bankr-checked) td.BR_BT_CR');
            this.AJCleared = this.Sum('tblAdjust tr.bankr-checked td .BR_AJ_DRCR');
            this.AJOutstanding = this.Sum('tblAdjust tr:not(.bankr-checked) td .BR_AJ_DRCR');
            this.AmountStatmentEnding = numeral($("#txtStmtAmt").val())._value;
            this.PriorStatementBalance = numeral($("#spanPriorBalance").html())._value;

            $('#debitCleared').html(numeral(this.DRCleared).format('$0,0.00'));
            $('#debitOutStanding').html(numeral(this.DROutstanding).format('$0,0.00'));
            $('#creditCleared').html(numeral(this.CRCleared).format('$0,0.00'));
            $('#creditOutStanding').html(numeral(this.CROutstanding).format('$0,0.00'));
            $('#spanAdjustmentCleared').html(numeral(this.AJCleared).format('$0,0.00'));
            $('#spanAdjustmentOutStanding').html(numeral(this.AJOutstanding).format('$0,0.00'));

            this.AmountReconciledDifference = numeral(((this.PriorStatementBalance + this.DRCleared + this.AJCleared) - (this.CRCleared)).toFixed(2)).value();
            this.AmountUnreconciledDifference = numeral((this.AmountStatmentEnding - this.AmountReconciledDifference).toFixed(2)).value();//this.AmountStatmentEnding - (this.PriorStatementBalance + this.DRCleared) - (this.CRCleared + this.AJCleared);

            $('#spanDifference').html(numeral(this.AmountUnreconciledDifference).format('$0,0.00'));
            $('#spanRecDifference').html(numeral(this.AmountReconciledDifference).format('$0,0.00'));

        }
       
    }
};

$(document).ready(function () {
    $('.w2ui-field').w2field('float');
    $('#btnSave').hide();
    //$('#btnSave').addClass('disabled');
    $('#UlAccountPayable li').removeClass('active');
    $('#LiCheckCycle').addClass('active');

    FillBankDetails();

    //$(".NumberOnly").keydown(function (e) {
    //    // Allow: backspace, delete, tab, escape, enter and .
    //    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
    //        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
    //        (e.keyCode >= 35 && e.keyCode <= 40)) {
    //        return;
    //    }
    //    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    //        e.preventDefault();
    //    }
    //});
    setTimeout(function () { randerDTPk(); }, 1000);

    var heightt = $(window).height();
    heightt = heightt - 370;
    $('#dvTrans').attr('style', 'height:' + heightt + 'px;margin-top:10px; margin-bottom:0px;float:left;width:100%;');
    heightt = heightt - 48;
    $('.fixed-table-container-inner').attr('style', 'height:' + heightt + 'px;');

    // Should implement this globally
    window.onbeforeunload = confirmExit;
    function confirmExit() {
        if (Object.keys(objBR.Delta).length !== 0 ) {
            return 'You have unsaved changes. Are you sure you want to leave this page?';
        }
    }
    
});

$('#txtStmtAmt').blur(function () {
    this.value = numeral(this.value).format('0,0.00');
});

function FillBankDetails() {
    $.ajax({
        url: APIUrlFillBankDetails + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) { 
        FillBankDetailsSucess(response); })
    .fail(function (error) { 
        console.log(error.responseText); });
}

function FillBankDetailsSucess(response) {
    if (response.length === 1) {
        $('#txtBankName').val(response[0].Bankname);
        $('#hdnBank').val(response[0].BankId);
    }
    CheckBankID = [];
    CheckBankID = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.BankId,
            label: m.Bankname,
        };
    });
    $(".SearchBank").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnBank").val(ui.item.value);
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnBank").val(ui.item.value);
            $('#txtBankName').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
            }
        }
    })
}

function funBankCheck() {
    var StrAddInvcCheckBanks = $('#txtBankName').val().trim();
    if (StrAddInvcCheckBanks !== '') {
        for (var i = 0; i < CheckBankID.length; i++) {
            if (CheckBankID[i].Bankname === StrAddInvcCheckBanks) {
                $('#hdnBank').val(CheckBankID[i].BankId);
                $('#txtBankName').val(CheckBankID[i].Bankname);
                break;
            } else {
                $('#hdnBank').val('');
                $('#txtBankName').val('');
            }
        }

        for (var i = 0; i < CheckBankID.length; i++) {
            if (CheckBankID[i].Bankname.substring(0, StrAddInvcCheckBanks.length) === StrAddInvcCheckBanks) {
                $('#hdnBank').val(CheckBankID[i].BankId);
                $('#txtBankName').val(CheckBankID[i].Bankname);
                break;
            }
        }
    } else {
        $('#hdnBank').val(CheckBankID[0].BankId);
        $('#txtBankName').val(CheckBankID[0].Bankname);
    }
}

function Adjustment() {
    $('#btnSave').show();
    //$('#btnSave').removeClass('disabled');
    $('#btnProcess').addClass('disabled');
    $('#tblTrans').addClass('displayNone');
    $('#tblAdjust').removeClass('displayNone');
    $('#liTrans').removeClass('active');
    $('#liAdjust').addClass('active');

    if (!objBR.isAdjustmentListOpen) {
        GetBankAdjustment();
    }
    objBR.isAdjustmentListOpen = true;
}

function GetReconcilationData() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetRoncilation + '?BankId=' + BankID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        async: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetRoncilationList();
        GetReconcilationDataSucess(response);
    })
    .fail(function (error) {
        console.log(error.responseText);
    })

    GetBankAdjustment();
    $('#dvVoid').removeClass('displayNone');
    $('#DvSearch').addClass('displayNone');
    $('#dvFilter').removeClass('displayNone');

    G_BankReconciliation = new BankReconciliation(BankID);
}
var statmentDate;
function GetReconcilationDataSucess(response) {
    $('#dvBtn').removeClass('displayNone');
    $('#spanBank').html($('#txtBankName').val());
    $('#spnBankName').html($('#txtBankName').val());

    if (response[0].Status === 'OK') {
        objBR.isAlreadyStarted = true;
        $('#dvVoid').removeClass('displayNone');

        PublicReconcilationID = response[0].ReconcilationID;
        $('#spnRecId').html(PublicReconcilationID);
        //$('#dvConfirm').attr('style', 'display:block;');
        $('#spanReConPopup').html(response[0].ReconcilationID);
        $('#spanReconcilation').html(response[0].ReconcilationID);
       
        $('#txtStmtDate').val(response[0].StatementDate);
        //console.log(response[0].StatementEndingAmount);
        $('#txtStmtAmt').val(numeral(parseFloat(response[0].StatementEndingAmount).toFixed(2)).format('$0,0.00'));
        $('#spanPriorBalance').html(numeral(parseFloat(response[0].PriorBalance).toFixed(2)).format('$0,0.00'));

        $('#txtStmtDate').prop('disabled', true);
        $('#txtStmtAmt').prop('disabled', true);

        $('#spanAdjustmentOutStanding').html(numeral(parseFloat(response[0].OutStandingAdjustment).toFixed(2)).format('$0,0.00'));
        $('#spanAdjustmentCleared').html(numeral(parseFloat(response[0].ClearedAdjustment).toFixed(2)).format('$0,0.00'));

        $('#btnStart').hide();
        //$('#btnStart').addClass('disabled');
        $('#btnSave').show();
        //$('#btnSave').removeClass('disabled');

        //$('#btnComplete').removeClass('disabled');
        $('#btnCancel').removeClass('disabled');
        $('#btnDelete').removeClass('disabled');

        $('#chkDisplayAll').prop('checked', false);
        if (response[0].DisplayAll === '1') {
            $('#chkDisplayAll').prop('checked', true);
            GetBankTransactionDisplayAll();
        } else {
            GetBankTransaction();
        }

        $('#chkMarkVoided').prop('checked', false);
        if (response[0].MarkVoided === '1') {
            $('#chkMarkVoided').prop('checked', true);
        }

        BankBalance();
        $('#dvVoid').notify('This bank already has a reconcilation started.', 'success')

    } else {
        //$('#dvConfirm').attr('style', 'display:none;');
        $('#btnStart').show();
        //$('#btnStart').removeClass('disabled');
        $('#btnSave').hide();
        //$('#btnSave').addClass('disabled');
        $('#spanReconcilation').html('Not Started');
        $('#txtStmtDate').val('');
        $('#txtStmtAmt').val('');
        $('#spanPriorBalance').html('$0.00');
        $('#txtStmtDate').prop('disabled', false);
        $('#txtStmtAmt').prop('disabled', false);

        //$('#btnComplete').addClass('disabled');
        $('#btnCancel').addClass('disabled');
        $('#btnDelete').addClass('disabled');

        $('#chkDisplayAll').prop('checked', false);
        $('#chkMarkVoided').prop('checked', false);
        $('#txtStmtDate').focus();
        $('#spanPriorBalance').html(numeral(response[0].PriorBalance).format('$0,0.00'));

        if (response[0].DD === null) {
            $(".datepicker").datepicker();
        } else {

            $(".datepicker").datepicker({
                minDate: response[0].DD
            });
        }
    }
    
}

function Complete() {
    let DeltaCount = Object.keys(objBR.Delta).length;
    $('.dialog-overlay').attr('style', 'display:none;');

    if (numeral($('#spanDifference').html()).format('0.00') !== '0.00') {
        $('#dvComplete-nonzero').show();
    } else if (DeltaCount !== 0) {
        $('#dvComplete-delta').show();
        //    //$('#dvComplete-delta').attr('style', 'display:block;');
        //} else {
        //    $('#dvComplete-delta').attr('style', 'display:none;');
        //}
        //if (numeral($('#spanDifference').html()).format('0.00') !== '0.00') {
        //} else {
        //    $('#dvComplete-nonzero').attr('style', 'display:none;');
        //}
        ////$('#dvComplete').attr('style', 'display:block;');
    } else {
        ConfirmComplete();
    }
}

function ChangeStatusDel(AdjustmentLineID) {
    ChangeStatusAdj(AdjustmentLineID);
    $('#chkAdjust_' + AdjustmentLineID + '').closest('tr').remove();
}

function Cancel() {
    $('.dialog-overlay').attr('style', 'display:none;');
    $('#dvCancel').attr('style', 'display:block;');
}

function GenerateReconcilation() {
    if ($('#txtStmtDate').val() === '') {
        ShowMsgBox('showMSG', 'Please Select Statement Date before you continue...', '', 'failuremsg');
        $('#txtStmtDate').focus();
    } else if ($('#txtStmtAmt').val() === '') {
        ShowMsgBox('showMSG', 'Please Enter Statement Ending Amount before you continue...', '', 'failuremsg');
        $('#txtStmtAmt').focus();
    } else {
        var BankID = $('#hdnBank').val();
        var StmtDate = $('#txtStmtDate').val();
        var Amt = parseFloat(numeral($('#txtStmtAmt').val()).format('0.000')).toFixed(2);
        //var Amt = $('#txtStmtAmt').val().replace('$', '').replace(",", "");
        $.ajax({
            url: APIUrlGenerateReconcilation + '?BankID=' + BankID + '&UserID=' + localStorage.UserId + '&ProdID=' + localStorage.ProdId + '&StatementDate=' + StmtDate + '&StatementEndingAmount=' + Amt,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            async: false,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            GenerateReconcilationSucess(response);
        })
        .fail(function (error) {
            console.log(error.responseText);
        })
    }
}

function GenerateReconcilationSucess(response) {
    PublicReconcilationID = response;
    $('#btnStart').hide();
    //$('#btnStart').addClass('disabled');
    $('#btnSave').show();
    $('#spanReconcilation').html(response);
    GetReconcilationDataAgain();
    BankTransactionList();
}

function GetReconcilationDataAgain() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetRoncilation + '?BankId=' + BankID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        async: false
    })
    .done(function (response) {
        GetReconcilationDataAgainSucess(response);
    })
    .fail(function (error) {
        console.log(error.responseText);
    })
}

function GetReconcilationDataAgainSucess(response) {
    $('#dvBtn').removeClass('displayNone');
    if (response[0].Status === 'OK') {

        $('#spanReConPopup').html(response[0].ReconcilationID);
        $('#btnStart').hide();
        //$('#btnStart').addClass('disabled');
        $('#btnSave').show();
        //$('#btnSave').removeClass('disabled');
        $('#spanReconcilation').html(response[0].ReconcilationID);

        $('#txtStmtDate').val(response[0].StatementDate);
        $('#txtStmtDate').prop('disabled', true);
        $('#txtStmtAmt').val(numeral(response[0].StatementEndingAmount).format('0,0.00'));
        $('#txtStmtAmt').prop('disabled', true);
        $('#spanPriorBalance').html(numeral(response[0].PriorBalance).format('$0,0.00'));

        //$('#btnComplete').removeClass('disabled');
        $('#btnCancel').removeClass('disabled');
        $('#btnDelete').removeClass('disabled');

        BankBalance();
    } else {

        $('#btnStart').show();
        //$('#btnStart').removeClass('disabled');
        $('#spanReconcilation').html('Not Started');
        $('#txtStmtDate').val('');
        $('#txtStmtAmt').val('');
        $('#spanPriorBalance').html('$0.00');
        $('#txtStmtDate').prop('disabled', false);
        $('#txtStmtAmt').prop('disabled', false);

        //$('#btnComplete').addClass('disabled');
        $('#btnSave').hide();
        //$('#btnSave').addClass('disabled');
        $('#btnCancel').addClass('disabled');
        $('#btnDelete').addClass('disabled');
    }

}

function BankTransactionList() {
    $('#tblTrans').removeClass('displayNone');
    $('#tblAdjust').addClass('displayNone');
    $('#liTrans').addClass('active');
    $('#liAdjust').removeClass('active');
    //$('#btnSave').hide();
    //$('#btnSave').addClass('disabled');
    //$('#btnProcess').removeClass('disabled');

    if (!objBR.isTransactionListOpen) {
        if ($('#chkDisplayAll').is(':checked')) {
            GetBankTransactionDisplayAll();
        } else {
            GetBankTransaction();
        }
    }
}

function BankBalance() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlBankBalance + '?BankId=' + BankID + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        BankBalanceSucess(response);
    })
    .fail(function (error) {
        console.log(error.responseText);
    });
}

function BankBalanceSucess(response) {
    FunDisabledCompleteBtn();
}

function FunDisabledCompleteBtn() {
    var Difference = numeral($('#spanDifference').html()).value(); //.replace('$', '').replace(",", "");
    //if (Difference === 0.00 || Difference === 0) {
    //    $('#btnComplete').removeClass('disabled');
    //} else {
    //    $('#btnComplete').addClass('disabled');
    //}
}

function funSave(callbackfunction) {
    setTimeout(function () {
        AtlasUtilities.ShowLoadingAnimation()
    }, 500);

    SaveAdjustment();
    //return; /// debug
    funSaveBankTransaction(callbackfunction);
    setTimeout(function () {
        AtlasUtilities.HideLoadingAnimation()
    }, 500);
}

function SaveAdjustment() {
    var AdjustmentID = '';
    var Date = $('#txtStmtDate').val();
    var Amount = '0';
    var Description = '';
    var ObjDefaultArr = [];
    var LoopCnt = 4;
    var CheckCntt = 0;
    var IsInvalid = 0;

    // Attempting to use the same logic as before just with better looping by tr and then input
    $('#tblAdjust tr').each(function(e,i) {
        let checked = $($(i).children()[0]).find('input').prop('checked');
        let Description = $($(i).children()[1]).find('input').val();

        if (checked || Description) {
            let Amount = $($(i).children()[3]).find('input').val();
            let AdjustmentID = $(i).data('adjustmentid');
            let strAdjustment = JSON.stringify({
                'Status': checked
                , 'AN': AdjustmentID
            });

            if (Description == '' && Date != '') {
                IsInvalid++;
                $(this).focus().addClass('invalidInput');
                $(this).notify('Please fill the Description');
                //ShowMsgBox('showMSG', 'Please fill Description.', '', 'failuremsg');
                return false;
            } else {
                $(this).removeClass('invalidInput');
            }

            var objAdjustment = {
                BankID: $('#hdnBank').val()
                , ProdID: localStorage.ProdId
                , ReconcilationID: PublicReconcilationID
                , AdjustmentNumber: strAdjustment
                , Date: Date
                , Amount: Amount.replace('$', '').replace(',', '')
                , Description: Description
                , UserID: localStorage.UserId
            }
            ObjDefaultArr.push(objAdjustment);
        }
    });

    if (IsInvalid == 0) {
        console.log(ObjDefaultArr);
        $.ajax({
            url: APIUrlSaveAdjustment,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ObjDefaultArr),
        }).done(function (response) {
            GetBankAdjustment();
        })
    }
}

function funSaveBankTransaction(callbackfunction) {
    var strVoidCancelCls = $('.VoidCancelCls');
    objBR.ArrDelta = Object.keys(objBR.Delta).map(function(element) { return objBR.Delta[element]; });
    let ArrBankTransaction2 = objBR.ArrDelta;

    var ArrObj = [];
    for (var i = 0; i < ArrBankTransaction2.length; i++) {
        let lineHTMLID = ArrBankTransaction2[i].CheckNumber + '_' + (ArrBankTransaction2[i].PaymentId === null ? 'CHECK' : ArrBankTransaction2[i].PaymentId)

        var Mode = false;
        if ($(`[id='chkTrans_${lineHTMLID}']`).prop('checked') == true) {
            Mode = true;
        }

        let checkforAPI = ArrBankTransaction2[i].CheckNumber;
        let JEIDforAPI = ArrBankTransaction2[i].PaymentId;
        if (ArrBankTransaction2[i].Source === 'JE') { // Pass ONLY the JEID for a Journal Entry
            checkforAPI = '';
        } else if (ArrBankTransaction2[i].SourceTable === 'Payment') { // Pass ONLY the CheckNumber for a Payment
            checkforAPI = JSON.stringify({
                'CK': checkforAPI
                , 'PID': JEIDforAPI
            });
            JEIDforAPI = '';
        } // Do nothing and pass both the CheckNumber and the JEID when it's a self paying Invoice

        var obj = {
            ReconcilationID: PublicReconcilationID,
            JEID: JEIDforAPI,
            CheckNumber: checkforAPI,
            Mode: Mode,
            UserID: localStorage.UserId
            , Source: ArrBankTransaction2[i].Source
            , SourceTable: ArrBankTransaction2[i].SourceTable
        }
        ArrObj.push(obj);
    }

    $.ajax({
        url: APIUrlInsertUpdateClearedTransaction,
        async: false,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ArrObj),
    }).done(function (response) {
        $('#dvVoid').notify('Bank Reconciliation Saved Successfully!', 'success');
        objBR.Delta = {}; // Reset the Delta upon a successful save
        //ShowMsgBox('showMSG', 'Saved Successfully!', '', '');
        if (typeof callbackfunction === 'function') {
            callbackfunction();
        }
    })
}

function GetBankAdjustment() {
    var BankID = $('#hdnBank').val();
    if (PublicReconcilationID) {
        $.ajax({
            url: APIUrlGetBankAdjustment + '?ReconcilationID=' + PublicReconcilationID + '&BankId=' + BankID + '&ProdID=' + localStorage.ProdId,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',
            async: false,
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            GetBankAdjustmentSucess(response);
        })
        .fail(function (error) {
            console.log(error.responseText);
        });
    } else {
        GetBankAdjustmentSucess([]);
    }
}

function GetBankAdjustmentSucess(response) {
    var TLength = response.length;
    var StrHtml = '';
    $("#tblAdjustTBody").empty();
    var LastID = TLength;
    let strchecked = '';
    let strcheckedtr = '';

    for (var i = 0; i < TLength; i++) {
        StrHtml += '<tr id=BR_AJ_' + response[i].AdjustmentID + ' class="BR_AJ '; // start the TR

        if (response[i].Status.toUpperCase() === 'CLEARED') {
            strcheckedtr = ' bankr-checked';
            strchecked = ' checked ';
        } else {
            strcheckedtr = '';
            strchecked = '';
        }
        StrHtml += strcheckedtr + `" data-adjustmentid="${response[i].AdjustmentID}">`;
        StrHtml += `<td style="padding:0px !important;"><input style="margin: 3px -5px -5px 4px !important;zoom: 1.7;" onChange="javascript: AJAmtCalculation(${response[i].AdjustmentID},this);" type="checkbox" ${strchecked} ID="chkAdjust_${response[i].AdjustmentID}" /></td>`;
        StrHtml += `<td style="padding:0px !important;"><input id="txtDesc_${response[i].AdjustmentID}" onfocusout="javascript: UpdateAdjustmentDescription(${response[i].AdjustmentID});" class="adjustment a44" value="${response[i].Description}" type="text" /></td>`;
        StrHtml += '<td style="padding:0px !important;"><input disabled id="txtADate_' + response[i].AdjustmentID + '" onfocusout="javascript: UpdateAdjustmentDate(' + response[i].AdjustmentID + ');" class="adjustment datepicker" value=' + $('#txtStmtDate').val() + ' placeholder="MM/DD/YYYY" type="text" /></td>';
        StrHtml += '<td style="padding:0px !important;"><input id="txtAmount_' + response[i].AdjustmentID + '" onfocusout="javascript: UpdateAdjustmentAmount(this);" class="adjustment a33 w2float w2field BR_AJ_DRCR" value=' + numeral(parseFloat(response[i].Amount).toFixed(2)).format('0,0.00') + ' maxlength="20" type="text" /></td>';
        StrHtml += '<input id="txtN' + response[i].AdjustmentID + '" class="adjustment w2float w2field NumberOnly" disabled type="hidden" value=' + response[i].AdjustmentNumber + ' />';
        StrHtml += '</tr>';

        // LastID = response[i].AdjustmentID;
    }
    $("#tblAdjustTBody").append(StrHtml);

    StrHtml = '';
    for (var i = parseInt(LastID) + 1; i < parseInt(LastID + 8) ; i++) {
        StrHtml += '<tr id=BR_AJ_NA' + i + ' class="BR_AJ" data-adjustmentid="-1">';
        StrHtml += `<td style="padding:0px !important;"><input style="margin: 3px -5px -5px 4px !important;zoom: 1.7;" type="checkbox" onchange="javascript: AJAmtCalculation(-1,this);" /></td>`;
        StrHtml += '<td style="padding:0px !important;"><input id="txtDesc_' + i + '" name="ABXZ4" class="adjustment a44" type="text" /></td>';
        StrHtml += `<td style="padding:0px !important;"><input id="txtADate_${i}" name="ABXZ2" class="adjustment datepicker a22 form-control w2float w2field" placeholder="MM/DD/YYYY" type="text" disabled value="${$('#txtStmtDate').val()}"/></td>`;
        StrHtml += '<td style="padding:0px !important;"><input id="txtAmount_' + i + '" name="ABXZ3"  class="adjustment a33 w2float w2field BR_AJ_DRCR" maxlength="20" type="text" onfocusout="javascript: objBR.Header.UpdateCalculcations();" /></td>';
        StrHtml += '<input id="txtN' + i + '" name="ABXZ1" class="adjustment a11 w2float w2field" type="hidden" />';
        StrHtml += '</tr>';
    }
    $('#tblAdjustTBody').append(StrHtml);
    $('.w2ui-field').w2field('float');
    //$('.w2ui-field').w2field('money');


    setTimeout(function () { randerDTPk(); }, 1000);
    $(".NumberOnly").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

function randerDTPk() {
    $(".datepicker").datepicker(); // or 
    $(".datepicker").datepicker("refresh");
    $("#txtStmtDate").datepicker(); // or 
    $("#txtStmtDate").datepicker("refresh");
}

function UpdateAdjustmentDate(AID) {
    $('#txtADate_' + AID).focusin();
    var Date = $('#txtADate_' + AID).val();
    alert(Date);
    //  var Amount=0.00;
    //  var Desc='';
    //  var Mode=2;

    //  $.ajax({
    //      url: APIUrlUpdateAdjustment + '?AdjustmentID=' + AID + '&ADate='+Date+'&Amount='+Amount+'&Description='+Desc+'&Mode='+Mode,
    //      cache: false,
    //      beforeSend: function (request) {
    //          request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
    //      },
    //      type: 'POST',
    //      contentType: 'application/json; charset=utf-8',
    //  })

    //.done(function (response)
    //{ UpdateAdjustmentDateSucess(response, Mode, AID); })
}
function UpdateAdjustmentDateSucess(response, Mode, ID) {

}

function UpdateAdjustmentAmount(AID) {
    let rowid = $(AID).parent().parent().data('adjustmentid');
    let checkobj = $($(AID).parent().parent().children()[0]).find('input');
    AJAmtCalculation (rowid, checkobj);
    return;

    var Date = '01/01/2010';
    var Amount = numeral($(AID).val()).format('0,0.00');//.replace('$', '');
    $(AID).val(Amount);
    var Desc = '';
    var Mode = 3;

    $.ajax({
        url: APIUrlUpdateAdjustment + '?AdjustmentID=' + AID + '&ADate=' + Date + '&Amount=' + Amount + '&Description=' + Desc + '&Mode=' + Mode,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
  .done(function (response) { 
      UpdateAdjustmentDateSucess(response, Mode, AID); 
  })
}

function UpdateAdjustmentDescription(AID) {
    var Date = '01/01/2010';
    var Amount = '0.00';
    var Desc = $('#txtDesc_' + AID).val();
    var Mode = 4;

    $.ajax({
        url: APIUrlUpdateAdjustment + '?AdjustmentID=' + AID + '&ADate=' + Date + '&Amount=' + Amount + '&Description="' + Desc + '"&Mode=' + Mode,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
  .done(function (response) {
      UpdateAdjustmentDateSucess(response, Mode, AID);
  })
}

function ChangeStatusAdj(AID) {
    if ($('#chkAdjust_' + AID).is(':checked')) {

        //var Date = '01/01/2010';
        //var Amount = '0.00';
        //var Desc = '';
        //var Mode = 5;

        //$.ajax({
        //    url: APIUrlUpdateAdjustment + '?AdjustmentID=' + AID + '&ADate=' + Date + '&Amount=' + Amount + '&Description=' + Desc + '&Mode=' + Mode,
        //    cache: false,
        //    beforeSend: function (request) {
        //        request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        //    },
        //    type: 'POST',
        //    contentType: 'application/json; charset=utf-8',
        //})
        //.done(function (response)
        //{ ClearedAdjustment(AID); })

    } else {
        //  var Date = '01/01/2010';
        //  var Amount = '0.00';
        //  var Desc = '';
        //  var Mode = 6;

        //  $.ajax({
        //      url: APIUrlUpdateAdjustment + '?AdjustmentID=' + AID + '&ADate=' + Date + '&Amount=' + Amount + '&Description=' + Desc + '&Mode=' + Mode,
        //      cache: false,
        //      beforeSend: function (request) {
        //          request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        //      },
        //      type: 'POST',
        //      contentType: 'application/json; charset=utf-8',
        //  })
        //.done(function (response)
        //{ UnClearedAdjustment(AID); })
    }
}

//function ClearedAdjustment(AID) {
//    var OldC = $('#spanAdjustmentCleared').html().replace('$', '').replace(",", "");
//    var OldO = $('#spanAdjustmentOutStanding').html().replace('$', '').replace(",", "");

//    var Amt = $('#txtAmount_' + AID).val().replace('$', '').replace(",", "");

//    var NewC = parseFloat(OldC) + parseFloat(Amt);
//    var NewO = parseFloat(OldO) - parseFloat(Amt);

//    $('#spanAdjustmentCleared').html(numeral(parseFloat(NewC).toFixed(2)).format('$0,0.00'));
//    $('#spanAdjustmentOutStanding').html(numeral(parseFloat(NewO).toFixed(2)).format('$0,0.00'));

//    var EndingAmt = parseFloat(numeral($('#txtStmtAmt').val()).format('0.000')).toFixed(2);
//    var Cleared = parseFloat(parseFloat(numeral($('#debitCleared').html()).format('0.000')).toFixed(2) + parseFloat(numeral($('#creditCleared').html()).format('0.000')).toFixed(2) + parseFloat(numeral($('#spanAdjustmentCleared').html()).format('0.000')).toFixed(2)).toFixed(2);
//    var Diff = EndingAmt - Cleared;
//    $('#spanDifference').html(numeral(Diff).format('$0,0.00'));
//    FunDisabledCompleteBtn();
//}

//function UnClearedAdjustment(AID) {
//    var OldC = parseFloat(numeral($('#spanAdjustmentCleared').html()).format('0.000')).toFixed(2);
//    var OldO = parseFloat(numeral($('#spanAdjustmentOutStanding').html()).format('0.000')).toFixed(2);
//    var Amt = parseFloat(numeral($('#txtAmount_' + AID).val()).format('0.000')).toFixed(2);
//    var NewC = parseFloat(OldC) - parseFloat(Amt);
//    var NewO = parseFloat(OldO) + parseFloat(Amt);

//    $('#spanAdjustmentCleared').html(numeral(parseFloat(NewC).toFixed(2)).format('$0,0.00'));
//    $('#spanAdjustmentOutStanding').html(numeral(parseFloat(NewO).toFixed(2)).format('$0,0.00'));

//    var EndingAmt = parseFloat(numeral($('#txtStmtAmt').val()).format('0.000')).toFixed(2);

//    var debitCleared = parseFloat(numeral($('#debitCleared').html()).format('0.000')).toFixed(2);
//    var creditCleared = parseFloat(numeral($('#creditCleared').html()).format('0.000')).toFixed(2);
//    var spanAdjustmentCleared = parseFloat(numeral($('#spanAdjustmentCleared').html()).format('0.000')).toFixed(2);
//    var Cleared = parseFloat(parseFloat(debitCleared) + parseFloat(creditCleared )+ parseFloat(spanAdjustmentCleared)).toFixed(2);
//    var Diff = EndingAmt - Cleared;
//    $('#spanDifference').html(numeral(Diff).format('$0,0.00'));
//    FunDisabledCompleteBtn();
//}

function ReconcilationAction(Mode) {

    $.ajax({
        url: APIUrlAction + '?ReconcilationID=' + PublicReconcilationID + '&Mode=' + Mode + '&UserID=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {

        if (Mode == 3)
        {
            ClearPopup();
            $('#dvNewComplete').attr('style', 'display:block;');
        }
        else if (Mode != 1 && Mode != 3)
            ReconcilationActionSucess(response);
    })
    .fail(function (error) {
        console.log(error.responseText);
    });
}

function ReconcilationActionSucess(response) {
    window.location.href = 'Reconciliation';
}

function ConfirmCancel() {
    objBR.Delta = {};
    ReconcilationAction(2);
}
function ConfirmDelete() {
    //ReconcilationAction(1);
}
function ConfirmComplete() {
    ReconcilationAction(3);
}

function GetBankTransaction() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetBankTransaction + '?BankID=' + BankID + '&ReconcilationID=' + PublicReconcilationID + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetBankTransactionSucess(response);
    })
    .fail(function (error) {
        console.log(error.responseText);
    });
}

function GetBankTransactionSucess(response) {
    objBR.isTransactionListOpen = true;
    //console.log(response);
    ArrBankTransaction = response;
    var TLength = response.length;
    var StrHtml = '';
    var ClearedClsName = '';
    let strchecked = '';
    $("#tblTransactionListTBody").empty();

    for (var i = 0; i < TLength; i++) {
        let iresponse = response[i];
        ClearedClsName = '';
        let lineHTMLID = iresponse.CheckNumber + '_' + (iresponse.PaymentId === null ? 'CHECK' : iresponse.PaymentId)

        StrHtml += '<tr id="BR_BT_' + lineHTMLID + '" class="'; // Give each table row an id and start the class
        if (iresponse.ReconcilationStatus == 'CLEARED') { StrHtml += ' bankr-checked '; }
        if ((iresponse.Status == 'Voided') || (iresponse.Status == 'Cancelled')) {
            StrHtml += ' borderRed BR_BT_VOID';
            ClearedClsName = 'VoidCancelCls';
        } else {
            ClearedClsName = '';
        }
        StrHtml += '">'; // finish up the table row class

        strchecked = (iresponse.ReconcilationStatus == 'CLEARED') ? 'checked' : ''; // checked if 'CLEARED'

        StrHtml += `<td class="VCls" id="${lineHTMLID}" style="padding:0px !important;" sourcetable="${iresponse.SourceTable}">`;
        StrHtml += `<input class="${ClearedClsName} BR_BT_CKBX ${iresponse.SourceTable} ${iresponse.CheckNumber}" style="margin: 3px -5px -5px 4px !important;zoom: 1.7;"  ${strchecked} type="checkbox" onclick="BRAmtCalculation(\'${lineHTMLID}\',this);"  ID="chkTrans_${lineHTMLID}" />`;
        StrHtml += '</td>';

        //StrHtml += '<td style="padding:0 0 0 6px !important;">' + response[i].JournalEntryId + '</td>';
        StrHtml += '<td style="padding:0 0 0 6px !important;">' + iresponse.CheckNumber + '</td>';
        StrHtml += '<td style="padding:0 0 0 6px !important;">' + iresponse.CDate + '</td>';
        StrHtml += '<td style="padding:0 0 0 6px !important;">' + iresponse.VendorName + '</td>';
        StrHtml += '<td style="padding:0 0 0 6px !important;">' + iresponse.Memo + '</td>';

        StrHtml += '<td style="padding:0 0 0 6px !important;">' + (((iresponse.Status == 'Voided') || (iresponse.Status == 'Cancelled')) ? iresponse.Status : iresponse.PayBy) + '</td>';
        StrHtml += '<td class="BR_BT_DR debitAmt_' + lineHTMLID + '" style="padding:0 0 0 6px !important;">' + numeral(parseFloat(iresponse.DebitAmount).toFixed(2)).format('$0,0.00') + '</td>';//'$' + (parseFloat(response[i].DebitAmount)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") 
        StrHtml += '<td class="BR_BT_CR creditAmt_' + lineHTMLID + '" style="padding:0 0 0 6px !important;">' + numeral(parseFloat(iresponse.CreditAmount).toFixed(2)).format('$0,0.00') + '</td>';//'$' + (parseFloat(response[i].CreditAmount)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") 
        StrHtml += '</tr>';
    }
    $("#tblTransactionListTBody").append(StrHtml);
    $('#btnSave').show();

    setTimeout(
        objBR.Header.UpdateCalculcations()
    , 500);
}

function BRAmtCalculation(LineId, obj) {
    if (G_ForceChecked) $(obj).prop('checked', true);
    let ischecked = $(obj).prop('checked');
    if (ischecked) { // add tr css of .bankr-checked
        $(obj).parents("tr").addClass('bankr-checked');
    } else {
        $(obj).parents("tr").removeClass('bankr-checked');
    }
    if (!G_SuspendCalculationUpdate) objBR.Header.UpdateCalculcations();
    let [paymentnumber, paymentid] = LineId.split('_');
    objBR.Delta[LineId] = ArrBankTransaction.find(function (e) { 
        return e.CheckNumber == paymentnumber && e.PaymentId == paymentid;
    });
    //if (objBR.Delta[LineId] === undefined) alert(LineId);
    return;
}

function AJAmtCalculation(LineId, obj) {
    let trid = (LineId === -1)? obj.parentElement.parentElement.id: 'BR_AJ_' + LineId;

    let ischecked = $(obj).prop('checked');
    if (ischecked) { // add tr css of .bankr-checked
        $(`#${trid}`).addClass('bankr-checked');
    } else {
        $(`#${trid}`).removeClass('bankr-checked');
    }
    objBR.Header.UpdateCalculcations();
    objBR.Delta.Adjustment = true;
    return;
}

function ClearChecks() {
    var Mode = 0;
    var ArrPayment = [];
    var LineCount = $('.VCls');
    for (var j = 0; j < LineCount.length; j++) {
        var strId = LineCount[j].id;
        if ($('#chkTrans_' + strId).prop("checked")) Mode = 1;
        else Mode = 2;

        var objBankTransaction = {
            ReconcilationID: PublicReconcilationID,
            PaymentID: strId,
            Mode: Mode,
            UserID: localStorage.UserId
        }
        ArrPayment.push(objBankTransaction);
    }
    $.ajax({
        url: APIUrlClearedCheck,
        cache: false,
        type: 'POST',
        beforeSend: function (request) { request.setRequestHeader("Authorization", localStorage.EMSKeyToken); },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ArrPayment),
    })
    .done(function (response) {
        BankBalance();
    });
}

function UpdateCheckProperty(Mode) {
    if (Mode === 1) {
        if ($('#chkDisplayAll').is(':checked')) {
            GetBankTransactionDisplayAll();
        } else {
            GetBankTransaction();
        }

        $('#chkMarkVoided').prop('checked', false);
    } else if (Mode === 2) {
        if ($('#chkMarkVoided').is(':checked')) {
            $('.VoidCancelCls').prop('checked', true);
            $('.BR_BT_VOID').addClass('bankr-checked');
        } else {
            $('.VoidCancelCls').prop('checked', false);
            $('.BR_BT_VOID').removeClass('bankr-checked');
        }
    } else if (Mode === 3) {
        G_SuspendCalculationUpdate = true;
        if ($('#chkInvoiceList').is(':checked')) {
            $('.BR_BT_CKBX').prop('checked', true);
        } else {
            $('.BR_BT_CKBX').prop('checked', false);
        }
        //let objchecks =
        $('.BR_BT_CKBX').each(function () {
            BRAmtCalculation(this.offsetParent.id, this);
        })
        ;
        G_SuspendCalculationUpdate = false;
        objBR.Header.UpdateCalculcations();
    }

    objBR.Header.UpdateCalculcations();

}

$('#tblAdjustTBody').delegate('.a11', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtN' + stval).length > 0) {
            $('#txtN' + stval).select();
        }
    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtN' + stval).length > 0) {
            $('#txtN' + stval).select();
        }
    }
})

$('#tblAdjustTBody').delegate('.a22', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtADate_' + stval).length > 0) {
            $('#txtADate_' + stval).select();
        }


    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtADate_' + stval).length > 0) {
            $('#txtADate_' + stval).select();
        }

    }

})

$('#tblAdjustTBody').delegate('.a33', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtAmount_' + stval).length > 0) {
            $('#txtAmount_' + stval).select();
        }


    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtAmount_' + stval).length > 0) {
            $('#txtAmount_' + stval).select();
        }

    }

})

$('#tblAdjustTBody').delegate('.a44', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('#txtDesc_' + stval).length > 0) {
            $('#txtDesc_' + stval).select();
        }


    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('#txtDesc_' + stval).length > 0) {
            $('#txtDesc_' + stval).select();
        }
    }
})

$('#tblAdjustTBody').delegate('.a22', 'focus', function (event) {
    var stval = $(this).closest('tr').attr('id');
    if (!$('#txtADate_' + stval).val()) $('#txtADate_' + stval).val(getTodayDate());
});

$('#tblAdjustTBody').delegate('.adjustment', 'blur', function (event) {
    //console.log($(this).val());
    if ($(this).val() != '')
        $(this).removeClass('invalidInput');
});

function GetBankTransactionDisplayAll() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetBankTransactionDisplayAll + '?BankID=' + BankID + '&ReconcilationID=' + PublicReconcilationID + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        async: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetBankTransactionSucess(response);
    })
    .fail(function (error) {
        console.log(error.responseText);
    })
}

function GetReconcilationData1() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetRoncilation + '?BankId=' + BankID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetReconcilationData1Sucess(response);
    })
    .fail(function (error) {
        console.log(error.responseText);
    });

    $('#dvVoid').removeClass('displayNone');
    $('#DvSearch').addClass('displayNone');
    $('#dvFilter').removeClass('displayNone');
}

function GetReconcilationData1Sucess(response) {
    PublicReconcilationID = response[0].ReconcilationID;

    $('#spanReConPopup').html(response[0].ReconcilationID);
    $('#btnSave').show();
    $('#btnStart').hide();
    //$('#btnStart').addClass('disabled');
    $('#btnSave').show();
    //$('#btnSave').removeClass('disabled');
    $('#spanReconcilation').html(response[0].ReconcilationID);

    $('#txtStmtDate').val(response[0].StatementDate);

    $('#txtStmtAmt').val(numeral(response[0].StatementEndingAmount).format('$0,0.00'));
    $('#spanPriorBalance').html(numeral(response[0].PriorBalance).format('$0,0.00'));

    $('#txtStmtDate').prop('disabled', true);
    $('#txtStmtAmt').prop('disabled', true);

    $('#spanAdjustmentOutStanding').html(numeral(response[0].OutStandingAdjustment).format('$0,0.00'));
    $('#spanAdjustmentCleared').html(numeral(response[0].ClearedAdjustment).format('$0,0.00'));

    //$('#btnComplete').removeClass('disabled');
    $('#btnProcess').addClass('disabled');
    $('#btnCancel').removeClass('disabled');
    $('#btnDelete').removeClass('disabled');

    $('#chkDisplayAll').prop('checked', false);
    if (response[0].DisplayAll == '1') {
        $('#chkDisplayAll').prop('checked', true);
    }

    $('#chkMarkVoided').prop('checked', false);
    if (response[0].MarkVoided == '1') {
        $('#chkMarkVoided').prop('checked', true);
    }

    GetBankAdjustment();
}

function getTodayDate() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    return (('' + month).length < 2 ? '0' : '') + month + '/' +
        (('' + day).length < 2 ? '0' : '') + day + '/' +
        d.getFullYear();
}

function SaveCancel() {
    funSave();
    location.href = "/AccountPayable/Reconciliation";
}

function PrintReports()
{
    var Printdetail = $("#chkDetail").is(':checked');
    var PrintdetailUncleared = $("#chkDetailUnCleared").is(':checked');
    var Printsummary = $("#chkSummary").is(':checked');
    var PrintsummaryUncleared = $("#chkSummaryUnCleared").is(':checked');

    if (Printdetail == true) {

        PrintReportCleared(PrintdetailUncleared);
    }
    if (Printsummary == true)
    {
        PrintReportSummury(PrintsummaryUncleared);
    }
}


function PrintReportCleared(isPrintUncleared) {

    var oBankReconcile = {
        "BankReconciliationID": PublicReconcilationID
            , "isSummary": false
            , "includeuncleared": isPrintUncleared
    }

    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify(oBankReconcile);
    APIName = 'APIUrlReportsBankRecDetail';
    let RE = new ReportEngine(APIUrlReportsBankRecDetail);
    RE.ReportTitle = 'Bank Reconciliation Report';
    RE.callingDocumentTitle = 'Bank Reconciliation Report';
    RE.FormCapture('#DivCheckRun');
    RE.FormJSON.CheckRun = JSONParameters;
    RE.FormJSON.BankReconcile = oBankReconcile;
    RE.isJSONParametersCall = true;
    RE.FormJSON.ProdId = localStorage.ProdId;
    RE.FormJSON.BankId = $('#hdnBank').val();
    RE.FormJSON.UserId = localStorage.UserId;
    RE.RunReport({ DisplayinTab: true });
    RE.callbacks = CloseReport();
    G_RE = RE;
}

function PrintReportSummury(isPrintUncleared) {

    var oBankReconcile = {
        "BankReconciliationID": PublicReconcilationID
            , "isSummary": false
            , "includeuncleared": isPrintUncleared
    }

    var JSONParameters = {};
    JSONParameters.callPayload = JSON.stringify(oBankReconcile);
    APIName = 'APIUrlReportsBankRecSummary';
    let RE = new ReportEngine(APIUrlReportsBankRecSummary);
    RE.ReportTitle = 'Bank Reconciliation Report';
    RE.callingDocumentTitle = 'Bank Reconciliation Report';
    RE.FormCapture('#DivCheckRun');
    RE.FormJSON.CheckRun = JSONParameters;
    RE.FormJSON.BankReconcile = oBankReconcile;
    RE.isJSONParametersCall = true;
    RE.FormJSON.ProdId = localStorage.ProdId;
    RE.FormJSON.BankId = $('#hdnBank').val();
    RE.FormJSON.UserId = localStorage.UserId;
    RE.RunReport({ DisplayinTab: true });
    RE.callbacks = CloseReport();
    G_RE = RE;
}

function CloseReport()
{
    $("#dvReportClose").css("display", "block");
}

function ClearPopup()
{
    $("#chkDetail").prop('checked', false);
    $("#chkDetailUnCleared").prop('checked', false);
    $("#chkSummary").prop('checked', false);
    $("#chkSummaryUnCleared").prop('checked', false);
}
function DateRangeCheck()
{
    if(statmentDate != "" || statmentDate != null)
    {
        var start = new Date(statmentDate),
        end   = new Date($("#txtStmtDate").val()),
        diff  = new Date(end - start),
        days  = diff/1000/60/60/24;
        if(days > 35)
        {
            $('#dvDateRange').attr('style', 'display:block;');
        }
    }
}
function ReloadReconcilation()
{
    window.location.href = 'Reconciliation';
}

function GetRoncilationList() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetRoncilationList + '?BankID=' + BankID+'&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        async: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        if(response.length > 0)
        {
            var item = response.length-1;
            statmentDate = response[item].StatementDate;
        }
        else{
            statmentDate = "";
        }
    })
    .fail(function (error) {
        console.log(error.responseText);
    })
}
