var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillPayrollFileData = HOST + "/api/Payroll/GetPayrollFileinClientSide";
var APIUrlTransCodeForPayroll = HOST + "/api/Payroll/GetTransCodeForPayroll";
var APIUrlPayrollLoad = HOST + "/api/Payroll/GetPayrollDataFileForAudit";
var APIUrlGetTransactionValueByID = HOST + "/api/CompanySettings/GetTransactionValueFillByID";
var APIUrlPayrollTransactionValue = HOST + "/api/Payroll/InsertUpdatePayrollTransValue";

var APIUrlGetTransString = HOST + "/api/Payroll/GetTransCodeForPayrollAudit";
var APIUrlPayrollTransactionValueAudit = HOST + "/api/Payroll/GetTransCodeFromExpense";

var APIUrlPayrollAmount = HOST + "/api/Payroll/GetPayrollFileAmountDetailPost";
var APIUrlPayrollTransactionDate = HOST + "/api/Payroll/SaveTrabsactionDate";
var APIUrlPayrollExpenseUpdate = HOST + "/api/Payroll/UpdatePayrollExpenses";

var APIUrlGetSegmentString = HOST + "/api/Payroll/GetSegmentStringFromExpense";
var APIUrlCheckPayrollFileValidation = HOST + "/api/Payroll/CheckPayrollFileBeforePost";

var TransCodeTDStr = '';
var TransCodeTRStr = '';
var SegmentCodeTDStr = '';
var SegmentCodeTRStr = '';

var PayrollLoadID = '';
var pubArrTraCode = [];
var TotalTransCodeLength = '';

var HeadTrCount = 1;
var SegmentCodd;
var SegmentC1 = ''
var SegmentC2 = '';

var Labor = 0;
var Fringe = 0;
var Suspenseee = 0;

$(document).ready(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#dvPayrollContainer').attr('style', 'height:' + heightt + 'px;');

    GetTransString(JSON.parse(localStorage.PayrollAudit).PayrollFileID); //localStorage.PayrollPreviewID);
    SegmentCodd = '';
});

function FillFileDate(TrasnValue) {
    $.ajax({
        url: APIUrlPayrollTransactionValueAudit + '?TransStr=' + TrasnValue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillFileDateSucess(response);
    })
}

function FillFileDateSucess(response) {
    var TLength = response.length;
    var strHtml = '';
    var strHtml1 = '';
    if (TLength > 0) {
        TotalTransCodeLength = TLength;
        for (var i = 0; i < TLength; i++) {
            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + response[i].TransactionCodeID + ',' + '"' + response[i].TransCode + '"' + ");' class='segmentCls PayrollAutoFilltest" + response[i].TransactionCodeID + "'  type='text' id='" + response[i].TransactionCodeID + "' value='' name='ABXZ'/></td>";
            strHtml1 += "<th>" + response[i].TransCode + "</th>";
            pubArrTraCode.push('PayrollAutoFilltest' + response[i].TransactionCodeID);
        }
    }
    TransCodeTDStr = strHtml;
    TransCodeTRStr = strHtml1;
    //  PayrollLoad();
}


function GetSegmentStr(SegmentValue) {
    $.ajax({
        url: APIUrlGetSegmentString + '?SegmentStr=' + SegmentValue + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetSegmentStrSucess(response);
    })
}

function GetSegmentStrSucess(response) {
    var TLength = response.length;
    var strHtml = '';
    var strHtml1 = '';
    if (TLength > 0) {
        //  TotalTransCodeLength = TLength;
        for (var i = 0; i < TLength; i++) {
            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + response[i].SegmentId + ',' + '"' + response[i].SegmentCode + '"' + ");' class='segmentCls PayrollAutoFilltest" + response[i].SegmentId + "'  type='text' id='" + response[i].SegmentId + "' value='' name='ABXZ'/></td>";
            strHtml1 += "<th>" + response[i].SegmentCode + "</th>";
            pubArrTraCode.push('PayrollAutoFilltest' + response[i].SegmentId);
        }
    }
    SegmentCodeTDStr = strHtml;
    SegmentCodeTRStr = strHtml1;
    PayrollLoad();
}

function GetTransString(PayrollFileID) {
    $.ajax({
        url: APIUrlGetTransString + '?PayrollFileID=' + PayrollFileID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetTransStringSucess(response);
    })
}

function GetTransStringSucess(response) {
    var TransStr = response[0].TransactionString;
    var NewStr = TransStr.slice(0, -1);
    var straa = TransStr.split(',');
    var TrasnValue = '';
    for (var i = 0; i < straa.length; i += 2) {
        TrasnValue += straa[i] + ',';
    }
    FillFileDate(TrasnValue);

    var SegmentStr = response[0].SegmentString;
    var NewSegStr = SegmentStr.slice(0, -1);
    var strSeg = SegmentStr.split(',');
    var SegmentVal = '';
    for (var i = 0; i < strSeg.length; i += 2) {
        SegmentVal += strSeg[i] + ',';
        HeadTrCount += 1;
    }

    GetSegmentStr(SegmentVal);
}

function PayrollLoad() {
    $.ajax({
        url: APIUrlPayrollLoad + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollFileID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        PayrollLoadSucess(response);
    })
}

function PayrollLoadSucess(response) {
    BatchManager.ForceBatch(response[0].BatchNumber);
    $('#SapnInvoice').html(JSON.parse(localStorage.PayrollAudit).PayrollInvoiceNo); //localStorage.PayrollInvoiceNo)

    var TLength = response.length;
    var SuspenceCnt = 0;
    var strHtml = '';
    if (TLength > 0) {
        var OLDStr = '';
        var NewStr = '';
        if (response[0].Status == 'Post') {
            $('#btnSave').attr('style', 'display:none;');
            $('#btnPost').attr('style', 'display:none;');
        }
        else {
            $('#btnSave').attr('style', 'display:block;');
            // $('#btnPost').html('Audit &amp; Post');
        }
        strHtml += "<tbody>";
        for (var i = 0; i < TLength; i++) {

            var AccNo = '';
            var DetailTab = response[i].SegmentString;
            var arr4 = DetailTab.split(',');
            for (var l = 0; l < arr4.length - 1; l = l + 2) {
                var Data1 = arr4[l];
                if (Data1 == 'Detail') {
                    AccNo = l / 2;
                }
            }

            NewStr = response[i].Header;
            if (OLDStr == '') {

                strHtml += "<tr style='border-bottom: 1px solid #d2d6de;'>";
                strHtml += "<th colspan='" + HeadTrCount + "'>" + response[i].Header + "</th>";
                //strHtml += "<th style='text-align:center;' colspan=" + TotalTransCodeLength + ">Transaction Value</th><tr>"
                strHtml += "<th style='text-align:center;' colspan=" + TotalTransCodeLength + "></th><tr>"

                strHtml += "<tr>" + SegmentCodeTRStr + "<th>Pay Description</th><th>Payment Amount</th>";
                strHtml += TransCodeTRStr;
                strHtml += "</tr>";

                strHtml += "<tr class='ABCD' id=" + response[i].PayrollExpenseID + ">";
                strHtml += "<td style='display:none;'> <input  type='text' name='AWRYP' id='" + response[i].PayrollExpenseID + "'/></td>";


                var SegmentData = response[i].COAString;
                var arr2 = SegmentData.split('|');

                var SegCntt = 0;
                for (var g = 0; g < arr2.length - 1; g++) {
                    var Data = arr2[g];

                    var Segment = response[i].SegmentString;
                    var arr4 = Segment.split(',');
                    var SegmentName = arr4[SegCntt];
                    SegCntt = SegCntt + 2;

                    if (AccNo == g) {
                        var AccCode = response[i].SuspendAccount;

                        var AccountCheck = response[i].AccountID;
                        if (AccountCheck == '0') {
                            SuspenceCnt = parseFloat(SuspenceCnt) + parseFloat(response[i].PaymentAmount);
                            // strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail' name='AWRY' value='" + AccCode + "'/></td>";
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail' name='AWRY' value='" + Data + "'/></td>";

                        }
                        else {

                            strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls' name='AWRY' value='" + Data + "'/></td>";
                        }
                    }
                    else {
                        strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls' name='AWRY' value='" + Data + "'/></td>";
                    }
                }

                if (response[0].Status == 'Post') {
                    strHtml += "<td>" + response[i].PayDescription + "</td>";
                }
                else {
                    strHtml += "<td><input name='ABY' type='text' id=txtPayDesc" + response[i].PayrollExpenseID + " onfocusout='javascript:UpdatePayDesc(" + response[i].PayrollExpenseID + ");' class='PayrollHide cls1' value='" + response[i].PayDescription + "' style='display:none;'><span id=spanPayDesc" + response[i].PayrollExpenseID + " ondblclick='javascript:editPaymentDesc(" + response[i].PayrollExpenseID + ");' class='PayrollShow'>" + response[i].PayDescription + "</span></td>";
                }

                strHtml += "<td>" + response[i].PaymentAmount + "</td>";
                strHtml += "<td style = 'display:none;'><input type='text' id='" + response[i].PayrollExpenseID + "' value='" + response[i].PayrollExpenseID + "'></td>";

                var TransStr = response[i].TransactionString;
                var NewStr = TransStr.slice(0, -1);
                var straa = TransStr.split(',');
                var TrasnValue = '';
                for (var j = 0; j < straa.length - 1; j += 2) {
                    var TrasnCode = straa[j];
                    var TrasnValue = straa[j + 1];
                    strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TrasnCode + ',' + '"' + TrasnValue + '"' + ");' class='segmentCls PayrollAutoFilltest" + TrasnCode + "'  type='text' id='" + TrasnCode + "' value='" + TrasnValue + "' name='ABXZ' /></td>";
                }

                strHtml += "</tr>";

                OLDStr = response[i].Header;
            }
            else if (NewStr == OLDStr) {
                strHtml += "<tr class='ABCD' id=" + response[i].PayrollExpenseID + ">";
                strHtml += "<td style='display:none;'> <input  type='text' name='AWRYP' id='" + response[i].PayrollExpenseID + "'/></td>";
                var SegmentData = response[i].COAString;
                var arr2 = SegmentData.split('|');
                var SegCntt = 0;
                for (var g = 0; g < arr2.length - 1; g++) {
                    var Data = arr2[g];

                    var Segment = response[i].SegmentString;
                    var arr4 = Segment.split(',');
                    var SegmentName = arr4[SegCntt];
                    SegCntt = SegCntt + 2;
                    if (AccNo == g) {

                        var AccCode = response[i].SuspendAccount;

                        var AccountCheck = response[i].AccountID;
                        if (AccountCheck == '0') {
                            SuspenceCnt = parseFloat(SuspenceCnt) + parseFloat(response[i].PaymentAmount);
                            // strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail' name='AWRY' value='" + AccCode + "'/></td>";
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail' name='AWRY' value='" + Data + "'/></td>";

                        }
                        else {
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls' name='AWRY' value='" + Data + "'/></td>";
                        }
                    }
                    else {
                        strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls' name='AWRY' value='" + Data + "'/></td>";
                    }
                }
                if (response[0].Status == 'Post') {
                    //  strHtml += SegmentCodeTDStr;                  
                    strHtml += "<td>" + response[i].PayDescription + "</td>";
                }
                else {
                    //  strHtml +=SegmentCodeTDStr;
                    strHtml += "<td><input name='ABY' type='text' id=txtPayDesc" + response[i].PayrollExpenseID + " onfocusout='javascript:UpdatePayDesc(" + response[i].PayrollExpenseID + ");' class='PayrollHide cls1' value='" + response[i].PayDescription + "' style='display:none;'><span id=spanPayDesc" + response[i].PayrollExpenseID + " ondblclick='javascript:editPaymentDesc(" + response[i].PayrollExpenseID + ");' class='PayrollShow'>" + response[i].PayDescription + "</span></td>";

                }

                strHtml += "<td>" + response[i].PaymentAmount + "</td>";
                strHtml += "<td style = 'display:none;'><input type='text' id='" + response[i].PayrollExpenseID + "' value='" + response[i].PayrollExpenseID + "'></td>";
                var TransStr = response[i].TransactionString;
                var NewStr = TransStr.slice(0, -1);
                var straa = TransStr.split(',');
                var TrasnValue = '';
                for (var j = 0; j < straa.length - 1; j += 2) {
                    var TrasnCode = straa[j];
                    var TrasnValue = straa[j + 1];
                    strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TrasnCode + ',' + '"' + TrasnValue + '"' + ");' class='segmentCls PayrollAutoFilltest" + TrasnCode + "'  type='text' id='" + TrasnCode + "' value='" + TrasnValue + "' name='ABXZ'/></td>";
                }
                strHtml += "</tr>";
                OLDStr = response[i].Header;
            }
            else {
                strHtml += "<tr style='border-bottom: 1px solid #d2d6de;'>";
                strHtml += "<th colspan='" + HeadTrCount + "'>" + response[i].Header + "</th>";
                //strHtml += "<th style='text-align:center;' colspan=" + TotalTransCodeLength + ">Transaction Value</th><tr>"
                strHtml += "<th style='text-align:center;' colspan=" + TotalTransCodeLength + "></th><tr>"
                strHtml += "<tr>" + SegmentCodeTRStr + "<th>Pay Description</th><th>Payment Amount</th>";
                strHtml += TransCodeTRStr;
                strHtml += "</tr>";

                strHtml += "<tr class='ABCD' id=" + response[i].PayrollExpenseID + ">";
                strHtml += "<td style='display:none;'> <input  type='text' name='AWRYP' id='" + response[i].PayrollExpenseID + "'/></td>";
                var SegmentData = response[i].COAString;
                var arr2 = SegmentData.split('|');

                var SegCntt = 0;
                for (var g = 0; g < arr2.length - 1; g++) {
                    var Data = arr2[g];

                    var Segment = response[i].SegmentString;
                    var arr4 = Segment.split(',');
                    var SegmentName = arr4[SegCntt];
                    SegCntt = SegCntt + 2;

                    if (AccNo == g) {
                        var AccCode = response[i].SuspendAccount;
                        var AccountCheck = response[i].AccountID;
                        if (AccountCheck == '0') {
                            SuspenceCnt = parseFloat(SuspenceCnt) + parseFloat(response[i].PaymentAmount);
                            // strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail' name='AWRY' value='" + AccCode + "'/></td>";
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail' name='AWRY' value='" + Data + "'/></td>";

                        }
                        else {
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls' name='AWRY' value='" + Data + "'/></td>";
                        }
                    }
                    else {
                        strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls' name='AWRY' value='" + Data + "'/></td>";
                    }
                }

                if (response[0].Status == 'Post') {
                    strHtml += "<td>" + response[i].PayDescription + "</td>";
                }
                else {
                    strHtml += "<td><input name='ABY' type='text' id=txtPayDesc" + response[i].PayrollExpenseID + " onfocusout='javascript:UpdatePayDesc(" + response[i].PayrollExpenseID + ");' class='PayrollHide cls1' value='" + response[i].PayDescription + "' style='display:none;'><span id=spanPayDesc" + response[i].PayrollExpenseID + " ondblclick='javascript:editPaymentDesc(" + response[i].PayrollExpenseID + ");' class='PayrollShow'>" + response[i].PayDescription + "</span></td>";
                }

                strHtml += "<td>" + response[i].PaymentAmount + "</td>";
                strHtml += "<td style = 'display:none;'><input type='text' id='" + response[i].PayrollExpenseID + "' value='" + response[i].PayrollExpenseID + "'></td>";
                var TransStr = response[i].TransactionString;
                var NewStr = TransStr.slice(0, -1);
                var straa = TransStr.split(',');
                var TrasnValue = '';
                for (var j = 0; j < straa.length - 1; j += 2) {
                    var TrasnCode = straa[j];
                    var TrasnValue = straa[j + 1];
                    strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TrasnCode + ',' + '"' + TrasnValue + '"' + ");' class='segmentCls PayrollAutoFilltest" + TrasnCode + "'  type='text' id='" + TrasnCode + "' value='" + TrasnValue + "' name='ABXZ'/></td>";
                }
                strHtml += "</tr>";

                OLDStr = response[i].Header;
            }
        }
    }
    else {
        strHtml += "<tr>";
        strHtml += "<td colspan='7' style='text-align:center;'>No Records Found !!</td>";
        strHtml += "</tr>";
    }
    $('#tblPayrollLoad').html(strHtml);

    $('#spanSuspense').html('$' + (SuspenceCnt.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    PayrollLoadAmount();
}

function TransCodeAutoFill(val, code) {
    $.ajax({
        url: APIUrlGetTransactionValueByID + '?TransactionCodeID=' + val,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { TransFieldAutoFillSucess(response, val); })
   .fail(function (error)
   { ShowMSG(error); })
}

function TransFieldAutoFillSucess(response, Tcode) {

    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
        };
    });
    var FillTest = 'PayrollAutoFilltest' + Tcode;
    $("." + FillTest).autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            //   $(this).attr('id',  value );
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            //  $(this).attr('id', value );
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                //  $(this).removeAttr();

            }
        }
    })
}

function TransCodeFillFn(values, code) {
    var ID = this.id;

    TransCodeAutoFill(values, code);
}


function PayrollLoadAmount() {
    $.ajax({
        url: APIUrlPayrollAmount + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollFileID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { PayrollLoadAmountSucess(response); })

}
function PayrollLoadAmountSucess(response) {
    var TLength = response.length;

    if (TLength > 0) {
        $('#spanExpected').html(response[0].PayrollCount);
        $('#spanActual').html(response[0].PayrollCount);
        $('#spanPeriodEnding').html(response[0].PeriodEnd);
        //$('#spanPR').html(response[0].PRClearing);
        //$('#spanFringe').html(response[0].FringeClearing);
        $('#spanPR').html('$' + (response[0].PRClearing.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFringe').html('$' + (response[0].FringeClearing.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        // $('#txtFiscalStart').val(response[0].TransactionDate);
        $('.segmentCls').attr("disabled", true);
    }
}

function funSaveData() {
    var ExpenseID = '';
    var ObjDefaultArr = [];
    var asas = $('#tblPayrollLoad tbody tr td').length;
    var ObjDefaultArr = [];
    var TblCodes = $('#tblPayrollLoad tr').length;

    var CC = 0;
    var StrAdd = '';
    var VVV = '';
    var SS = 0;

    var COAStr = '';
    var SegmentStr = '';
    var AccNumber = '';

    var LoopCnt = TotalTransCodeLength + HeadTrCount;
    var CheckCntt = 1;

    $('#tblPayrollLoad input[type="text"]').each(function () {
        var CheckCls = $(this).attr('name');
        if ((CheckCls == 'ABXZ') || (CheckCls == 'AWRY') || (CheckCls == 'AWRYP')) {

            if (LoopCnt >= CheckCntt) {
                if (CheckCntt == 1) {
                    ExpenseID = $(this).attr('id');
                }
                if (CheckCls == 'ABXZ') {
                    var TransValforSave = $(this).val();
                    var TransCodeIDforSave = $(this).attr('id');
                    if (CheckCntt == 1) {

                    }
                    else {
                        StrAdd += TransCodeIDforSave + ',' + TransValforSave + ',';
                    }
                }
                else if (CheckCls == 'AWRY') {
                    var SegmentValuee = $(this).val();
                    var SegmentCoddID = $(this).attr('id');

                    SegmentCodd += SegmentCoddID + ',' + SegmentValuee + ',';

                    if (SegmentCoddID == 'Set') {
                        SegmentC2 += SegmentValuee + '|';
                    }
                    else if (SegmentCoddID == 'Series') {
                        SegmentC2 += SegmentValuee + '|';
                    }
                    else if (SegmentCoddID == 'Detail') {
                        AccNumber = SegmentValuee;
                    }
                    else {
                        SegmentC1 += SegmentValuee + '|';
                    }


                    COAStr += SegmentValuee + '|';
                }
                CheckCntt++;
                if (LoopCnt == CheckCntt) {

                    CheckCntt = 1;
                    if (SegmentC1.length > 0) {
                        SegmentC1 = SegmentC1.slice(0, -1)
                    }
                    if (SegmentC2.length > 0) {
                        SegmentC2 = SegmentC2.slice(0, -1)
                    }


                    var objpayroll = {
                        ExpenseID: ExpenseID,
                        ModifyBy: localStorage.UserId,
                        TransValueStr: StrAdd,
                        COAString: COAStr,
                        SegmentString: SegmentCodd,
                        SegmentString1: SegmentC1,
                        SegmentString2: SegmentC2,
                        AccountNumber: AccNumber,
                        PayDescription: $('#txtPayDesc' + ExpenseID).val()
                    }
                    ObjDefaultArr.push(objpayroll);
                    CC = 0;
                    StrAdd = '';
                    SegmentCodd = '';
                    SegmentC1 = '';
                    SegmentC2 = '';
                    COAStr = '';
                    AccNumber = '';
                }
            }
        }
    });

    $.ajax({
        url: APIUrlPayrollTransactionValue,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjDefaultArr),
    }).done(function (response)
    { FnLoadSucess(response); })
}


function FnLoadSucess(response) {
    var Msg = 'Payroll Saved Sucessfully !!';

    ShowMsgBox('showMSG', Msg, '', '');

    // localStorage.ShowPayrollHistoryID = $('select#ddlCompany option:selected').val();
    // $('#dvMainLoad').attr('style', 'display:none;');
    window.location.href = 'PayrollAudit';
}


function PayrollTransactionDate(Status) {
    //  var TransactionDate = $('#txtFiscalStart').val();
    var TransactionDate = '';
    $.ajax({
        url: APIUrlPayrollTransactionDate + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollFileID + '&TransactionDate=' + TransactionDate + '&Status=' + Status,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    }).done(function (response)
    { funSaveData(); })
}


function funSaveDataLoad() {
    //  funSaveData();
    PayrollTransactionDate('Load');
}

/////////////////////////////////////////////////// Double Click Code

function UpdatePaymentAccount(PayrollExpenseID) {
    var isvalid = "";
    isvalid = CheckRequired($("#txtApyAc" + PayrollExpenseID));
    if (isvalid == '') {

        var ParameterValue = $('#txtApyAc' + PayrollExpenseID).val();
        var ModifyBy = localStorage.UserId;
        var ColumnName = 1;
        $.ajax({
            url: APIUrlPayrollExpenseUpdate + '?PayrollExpenseId=' + PayrollExpenseID + '&ParameterValue=' + ParameterValue + '&ModifyBy=' + ModifyBy + '&ColumnName=' + ColumnName,
            cache: false,
            type: 'POST',

            contentType: 'application/json; charset=utf-8',

        })

    .done(function (response) {
        PayrollExpenseUpdateSucess(response);
    })
         .fail(function (error)
         { console.log(error); })
    }
}

function PayrollExpenseUpdateSucess(response) {

    var ExpenseID = response[0].ExpenseID;;
    var ColumnName = response[0].Name;;

    if (ColumnName == '1') {
        $('#spanPayAc' + ExpenseID).html($('#txtApyAc' + ExpenseID).val());
    }
    else if (ColumnName == '2') {
        $('#spanLocCode' + ExpenseID).html($('#txtLocCode' + ExpenseID).val());
    }
    else if (ColumnName == '3') {
        $('#spanSeriesCode' + ExpenseID).html($('#txtSerCode' + ExpenseID).val());
    }
    else if (ColumnName == '4') {
        $('#spanPayDesc' + ExpenseID).html($('#txtPayDesc' + ExpenseID).val());
    }
    ShowMsgBox('showMSG', 'Record Updated Sucessfully.', '', '');

    $('.PayrollHide').attr('style', 'display:none;');
    $('.PayrollShow').attr('style', 'display:block;');
}

function UpdateLocationCode(PayrollExpenseID) {

    var isvalid = "";
    isvalid = CheckRequired($("#txtLocCode" + PayrollExpenseID));
    if (isvalid == '') {

        var ParameterValue = $('#txtLocCode' + PayrollExpenseID).val();
        var ModifyBy = localStorage.UserId;
        var ColumnName = 2;
        $.ajax({
            url: APIUrlPayrollExpenseUpdate + '?PayrollExpenseId=' + PayrollExpenseID + '&ParameterValue=' + ParameterValue + '&ModifyBy=' + ModifyBy + '&ColumnName=' + ColumnName,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',

        })

    .done(function (response) {
        PayrollExpenseUpdateSucess(response);
    })
         .fail(function (error)
         { console.log(error); })
    }
}

function UpdateSeriesCode(PayrollExpenseID) {

    var isvalid = "";
    isvalid = CheckRequired($("#txtSerCode" + PayrollExpenseID));
    if (isvalid == '') {

        var ParameterValue = $('#txtSerCode' + PayrollExpenseID).val();
        var ModifyBy = localStorage.UserId;
        var ColumnName = 3;
        $.ajax({
            url: APIUrlPayrollExpenseUpdate + '?PayrollExpenseId=' + PayrollExpenseID + '&ParameterValue=' + ParameterValue + '&ModifyBy=' + ModifyBy + '&ColumnName=' + ColumnName,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',

        })

    .done(function (response) {
        PayrollExpenseUpdateSucess(response);
    })
         .fail(function (error)
         { console.log(error); })
    }
}

function UpdatePayDesc(PayrollExpenseID) {

    var isvalid = "";
    isvalid = CheckRequired($("#txtPayDesc" + PayrollExpenseID));
    if (isvalid == '') {

        var ParameterValue = $('#txtPayDesc' + PayrollExpenseID).val();
        var ModifyBy = localStorage.UserId;
        var ColumnName = 4;
        $.ajax({
            url: APIUrlPayrollExpenseUpdate + '?PayrollExpenseId=' + PayrollExpenseID + '&ParameterValue=' + ParameterValue + '&ModifyBy=' + ModifyBy + '&ColumnName=' + ColumnName,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',

        })

    .done(function (response) {
        PayrollExpenseUpdateSucess(response);
    })
         .fail(function (error)
         { console.log(error); })
    }

}

function editPaymentAC(PayrollExpenseID) {
    $('.PayrollHide').attr('style', 'display:none;');
    $('.PayrollShow').attr('style', 'display:block;');
    $('#spanPayAc' + PayrollExpenseID).attr('style', 'display:none;');
    $('#txtApyAc' + PayrollExpenseID).attr('style', 'display:block !important;');
}

function editLocationCode(PayrollExpenseID) {
    $('.PayrollHide').attr('style', 'display:none;');
    $('.PayrollShow').attr('style', 'display:block;');
    $('#spanLocCode' + PayrollExpenseID).attr('style', 'display:none;');
    $('#txtLocCode' + PayrollExpenseID).attr('style', 'display:block !important;');

}

function editSeriesCode(PayrollExpenseID) {
    $('.PayrollHide').attr('style', 'display:none;');
    $('.PayrollShow').attr('style', 'display:block;');
    $('#spanSeriesCode' + PayrollExpenseID).attr('style', 'display:none;');
    $('#txtSerCode' + PayrollExpenseID).attr('style', 'display:block !important;');

}

function editPaymentDesc(PayrollExpenseID) {
    $('.PayrollHide').attr('style', 'display:none;');
    $('.PayrollShow').attr('style', 'display:block;');
    $('#spanPayDesc' + PayrollExpenseID).attr('style', 'display:none;');
    $('#txtPayDesc' + PayrollExpenseID).attr('style', 'display:block !important;');

}


function funCheckPayrollFileValidationSucess(response) {
    if (response != '') {

        var Msg = 'Please Correct the values, Corresponding COA not found!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');

        var arr = response.split('|');

        for (var i = 0; i < arr.length; i++) {
            var ID = arr[i];
            $('#' + ID).addClass('PayrollValidation');

        }
    }
    else {
        PayrollTransactionDate('Post');
        funSaveData();
    }
}

function GoToPreviousPage() {
    console.log(localStorage.PrePage);

    switch (localStorage.PrePage) {
        case "RCP":
            window.location = HOST + "/Payroll/PayrollRCP";
            break;
        case "History":
            window.location = HOST + "/Payroll/PayrollHistory";
            break;
        case "Audit":
            window.location = HOST + "/Payroll/PayrollAudit";
            break;
        default:
            window.location = HOST + "/Payroll/LoadPayroll";
    }
}