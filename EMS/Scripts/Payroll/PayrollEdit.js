///------------------------------------- Api Calling
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
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlSaveInvoice = HOST + "/api/Payroll/INVOICEJETHROUGHPAYROLL1";
var APIUrlSaveJE = HOST + "/api/Payroll/JETHROUGHPAYROLL1";
var APIUrlCheckClearingAccount = HOST + "/api/Payroll/CheckClearingAccount";
var APIUrlFillDefault = HOST + "/api/Payroll/GetPayrollVendor";
var APIUrlCheckClosePeriodStatus = HOST + "/api/Payroll/CheckClosePeriodStatus";
var APIUrlGetCOABySegmentPosition1 = HOST + "/api/Ledger/GetCOABySegmentPosition1";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";
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

//var SegStrNew1 = '';
//var SegStrNew2 = '';
//var SetID = '';
//var SeriesID = '';

var PostType = '';
var CCCODE = '';
var seglength;
var A_memocodes;


$(document).ready(function () {
    GetTransString(JSON.parse(localStorage.PayrollAudit).PayrollAuditID);
    SegmentCodd = '';
    FillDefault();
    //$('#txtPayrollBatch').val(localStorage.BatchNumber);
    var heightt = $(window).height();
    heightt = heightt - 200;
    $('#dvPayrollContainer').attr('style', 'height:' + heightt + 'px;');
    AtlasUtilities.init();
    $('#ddlCompany').val(JSON.parse(localStorage.PayrollAudit).ShowPayrollHistoryCompanyID);
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod(JSON.parse(localStorage.PayrollAudit).PRPeriod));
    $('#PayrollInvoiceEdit').text(JSON.parse(localStorage.PayrollAudit).PayrollInvoiceNo);

    seglength = AtlasUtilities.SEGMENTS_CONFIG.sequence.length;
    A_memocodes = (AtlasCache.Cache.GetItembyName('Transaction Codes') || [{}]).reduce(function (map, obj) { map[obj.TransactionCodeID] = ''; return map; }, {}); // Use this for the form capture during Load & Save/Poste
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

    .done(function (response)
    { FillFileDateSucess(response); })
}
function FillFileDateSucess(response) {
    var TLength = response.length;
    var strHtml = '';
    var strHtml1 = '';
    if (TLength > 0) {
        TotalTransCodeLength = TLength;
        for (var i = 0; i < TLength; i++) {
            strHtml += "<td><input onfocus='javascript:TransCodeFillFn(" + response[i].TransactionCodeID + ',' + '"' + response[i].TransCode + '"' + ");' class='segmentCls PayrollAutoFilltest" + response[i].TransactionCodeID + "'  type='text' id='" + response[i].TransactionCodeID + "' value='' name='ABXZ'/></td>";
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
            strHtml += "<td><input onfocus='javascript:TransCodeFillFn(" + response[i].SegmentId + ',' + '"' + response[i].SegmentCode + '"' + ");' class='segmentCls PayrollAutoFilltest" + response[i].SegmentId + "'  type='text' id='" + response[i].SegmentId + "' value='' name='ABXZ'/></td>";
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
        url: APIUrlPayrollLoad + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        PayrollLoadSucess(response);
    });
}

function PayrollLoadSucess(response) {
    var TLength = response.length;
    var SuspenceCnt = 0;
    var strHtml = '';
    if (TLength > 0) {
        BatchManager.ForceBatch(response[0].BatchNumber);
        var OLDStr = '';
        var NewStr = '';
        if (response[0].Status == 'Post') {
            $('#btnSave').attr('style', 'display:none;');
            $('#btnPost').attr('style', 'display:none;');
        } else {
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
                            //  strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + AccCode + "'/></td>";
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='clsDT" + i + " segmentCls txtBgForDetail " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "' onfocus=\"javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(" + i + ",'" + SegmentName + "',2, this);\"/><input type=\"hidden\" class=\"clsCOACode\" id=\"hdnCode_" + i + "\" value=\"" + response[i].COAString + "\"/></td>";
                        } else {
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='clsDT" + i + " segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "'  onfocus=\"javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(" + i + ",'" + SegmentName + "',2, this);\"/><input type=\"hidden\" class=\"clsCOACode\" id=\"hdnCode_" + i + "\" value=\"" + response[i].COAString + "\"/></td>";
                        }
                    } else {
                        strHtml += "<td><input type='text' id=" + SegmentName + " class='clsSets" + i + " segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "' onfocus=\"javascript:GetOptional(" + i + ",'" + SegmentName + "',0);\"/></td>";
                    }
                }

                if (response[0].Status == 'Post') {
                    strHtml += "<td>" + response[i].PayDescription + "</td>";
                } else {
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
                    strHtml += "<td><input onfocus='javascript:TransCodeFillFn(" + TrasnCode + ',' + '"' + TrasnValue + '"' + ");' class='segmentCls PayrollAutoFilltest" + TrasnCode + "'  type='text' id='" + TrasnCode + "' value='" + TrasnValue + "' name='ABXZ' /></td>";
                }

                strHtml += "</tr>";

                OLDStr = response[i].Header;
            } else if (NewStr == OLDStr) {
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
                            // strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + " txtBgForDetail' name='AWRY' value='" + AccCode + "'/></td>";
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='clsDT" + i + " segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + " txtBgForDetail' name='AWRY' value='" + Data + "' onfocus=\"javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(" + i + ",'" + SegmentName + "',2, this);\"/><input type=\"hidden\" class=\"clsCOACode\" id=\"hdnCode_" + i + "\" value=\"" + response[i].COAString + "\"/></td>";
                        } else {
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='clsDT" + i + " segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "' onfocus=\"javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(" + i + ",'" + SegmentName + "',2, this);\"/><input type=\"hidden\" class=\"clsCOACode\" id=\"hdnCode_" + i + "\" value=\"" + response[i].COAString + "\"/></td>";
                        }
                    } else {
                        strHtml += "<td><input type='text' id=" + SegmentName + " class='clsSets" + i + " segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "' onfocus=\"javascript:GetOptional(" + i + ",'" + SegmentName + "',0);\"/></td>";
                    }
                }

                if (response[0].Status == 'Post') {
                    //  strHtml += SegmentCodeTDStr;                  
                    strHtml += "<td>" + response[i].PayDescription + "</td>";
                } else {
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
                    strHtml += "<td><input onfocus='javascript:TransCodeFillFn(" + TrasnCode + ',' + '"' + TrasnValue + '"' + ");' class='segmentCls PayrollAutoFilltest" + TrasnCode + "'  type='text' id='" + TrasnCode + "' value='" + TrasnValue + "' name='ABXZ'/></td>";
                }
                strHtml += "</tr>";
                OLDStr = response[i].Header;
            } else {
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
                            // strHtml += "<td><input type='text' id=" + SegmentName + " class='segmentCls txtBgForDetail " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + AccCode + "'/></td>";
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='clsDT" + i + " segmentCls txtBgForDetail " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "' onfocus=\"javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(" + i + ",'" + SegmentName + "',2, this);\"/><input type=\"hidden\" class=\"clsCOACode\" id=\"hdnCode_" + i + "\" value=\"" + response[i].COAString + "\"/></td>";
                        } else {
                            strHtml += "<td><input type='text' id=" + SegmentName + " class='clsDT" + i + " segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "' onfocus=\"javascript: AtlasUtilities.BuildDetailSegmentAutoComplete(" + i + ",'" + SegmentName + "',2, this);\"/><input type=\"hidden\" class=\"clsCOACode\" id=\"hdnCode_" + i + "\" value=\"" + response[i].COAString + "\"/></td>";
                        }
                    } else {
                        strHtml += "<td><input type='text' id=" + SegmentName + " class='clsSets" + i + " segmentCls " + SegmentName + " " + SegmentName + "_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + Data + "' onfocus=\"javascript:GetOptional(" + i + ",'" + SegmentName + "',0);\"/></td>";
                    }
                }

                if (response[0].Status == 'Post') {
                    strHtml += "<td>" + response[i].PayDescription + "</td>";
                } else {
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
                    strHtml += "<td><input onfocus='javascript:TransCodeFillFn(" + TrasnCode + ',' + '"' + TrasnValue + '"' + ");' class='segmentCls PayrollAutoFilltest" + TrasnCode + "'  type='text' id='" + TrasnCode + "' value='" + TrasnValue + "' name='ABXZ'/></td>";
                }
                strHtml += "</tr>";

                OLDStr = response[i].Header;
            }
        }
    } else {
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
                try {
                    var findVal = $(this).val();
                    findVal = findVal.toUpperCase();
                    console.log(findVal);
                    var GetElm = $.grep(array, function (v) {
                        return v.label == findVal;
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
function TransCodeFillFn(values, code) {
    var ID = this.id;

    TransCodeAutoFill(values, code);
}
function PayrollLoadAmount() {
    $.ajax({
        url: APIUrlPayrollAmount + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID,
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

    var SegStrNew1 = '';
    var SegStrNew2 = '';
    var SetID = '';
    var SeriesID = '';

    var LoopCnt = TotalTransCodeLength + HeadTrCount;
    var CheckCntt = 1;
    //var CCCODE1 = CID; //$('#txt_0_0').val(); // Using public var CCCODE instead since this module is not pulling variables the same way as other PR modules

    $('#tblPayrollLoad input[type="text"]').each(function () {
        var CheckCls = $(this).attr('name');
        if ((CheckCls == 'ABXZ') ||
            (CheckCls == 'AWRY') ||
            (CheckCls == 'AWRYP')
            ) {
            if (LoopCnt >= CheckCntt) {
                if (CheckCntt == 1) {
                    ExpenseID = $(this).attr('id');
                }
                if (CheckCls === 'ABXZ') {
                    var TransValforSave = $(this).val();
                    var TransCodeIDforSave = $(this).attr('id');
                    if (CheckCntt !== 1) {
                        A_memocodes[parseInt(TransCodeIDforSave)] = TransValforSave;
                        //StrAdd += TransCodeIDforSave + ',' + TransValforSave + ',';
                        //SegStrNew2 += TransCodeIDforSave + ':' + TransValforSave + ',';
                    }
                } else if (CheckCls === 'AWRY') {
                    if (COAStr.split('|').length < (seglength)) {
                        var SegmentValuee = $(this).val();
                        var SegmentCoddID = $(this).attr('id');

                        SegmentCodd += SegmentCoddID + ',' + SegmentValuee + ',';

                        if (SegmentCoddID == 'Set') {
                            SegmentC2 += SegmentValuee + '|';

                            SetID = SegmentValuee;
                        } else if (SegmentCoddID == 'Series') {
                            SegmentC2 += SegmentValuee + '|';

                            SeriesID = SegmentValuee;
                        } else if (SegmentCoddID == 'Detail') {
                            AccNumber = SegmentValuee;
                            SegStrNew1 += SegmentValuee + '|';
                        } else {
                            SegmentC1 += SegmentValuee + '|';
                            SegStrNew1 += SegmentValuee + '|';
                        }

                        COAStr += SegmentValuee + '|'; // Appears to be a loop error resulting in a duplication of the COAStr values. COAStr is also prefixed with a |
                    }
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

                    Object.keys(A_memocodes).forEach(function (key) {
                        StrAdd += `${key},${A_memocodes[key]},`;
                        SegStrNew2 += `${key}:${A_memocodes[key]},`;
                    });

                    var objpayroll = {
                        ExpenseID: ExpenseID,
                        ModifyBy: localStorage.UserId,
                        TransValueStr: StrAdd,
                        COAString: COAStr,
                        SegmentString: SegmentCodd,
                        SegmentString1: CCCODE + '|' + SegmentC1,
                        SegmentString2: SegmentC2,
                        AccountNumber: AccNumber,
                        PayDescription: $('#txtPayDesc' + ExpenseID).val(),
                        SegmentStr1: SegStrNew1.slice(0, -1),
                        TransactionStr1: SegStrNew2.slice(0, -1),
                        SetID: SetID,
                        SeriesID: SeriesID
                    }
                    ObjDefaultArr.push(objpayroll);

                    // clear our loop vlaues
                    CC = 0;
                    StrAdd = '';
                    SegmentCodd = '';
                    SegmentC1 = '';
                    SegmentC2 = '';
                    COAStr = '';
                    AccNumber = '';
                    SegStrNew1 = '';
                    SegStrNew2 = '';
                    SetID = '';
                    SeriesID = '';
                }
            }
        }
    });
    //return;

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

function funSaveData1() {
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

    var SegStrNew1 = '';
    var SegStrNew2 = '';
    var SetID = '';
    var SeriesID = '';

    var LoopCnt = TotalTransCodeLength + HeadTrCount;
    var CheckCntt = 1;
    //var CCCODE1 = CID; //$('#txt_0_0').val(); // Using public var CCCODE instead since this module is not pulling variables the same way as other PR modules

    $('#tblPayrollLoad input[type="text"]').each(function () {
        var CheckCls = $(this).attr('name');
        if ((CheckCls == 'ABXZ') ||
            (CheckCls == 'AWRY') ||
            (CheckCls == 'AWRYP')
            ) {
            if (LoopCnt >= CheckCntt) {
                if (CheckCntt == 1) {
                    ExpenseID = $(this).attr('id');
                }
                if (CheckCls === 'ABXZ') {
                    var TransValforSave = $(this).val();
                    var TransCodeIDforSave = $(this).attr('id');
                    if (CheckCntt !== 1) {
                        A_memocodes[parseInt(TransCodeIDforSave)] = TransValforSave;
                        //StrAdd += TransCodeIDforSave + ',' + TransValforSave + ',';
                        //SegStrNew2 += TransCodeIDforSave + ':' + TransValforSave + ',';
                    }
                } else if (CheckCls === 'AWRY') {
                    if (COAStr.split('|').length < (seglength)) {
                        var SegmentValuee = $(this).val();
                        var SegmentCoddID = $(this).attr('id');

                        SegmentCodd += SegmentCoddID + ',' + SegmentValuee + ',';

                        if (SegmentCoddID == 'Set') {
                            SegmentC2 += SegmentValuee + '|';

                            SetID = SegmentValuee;
                        } else if (SegmentCoddID == 'Series') {
                            SegmentC2 += SegmentValuee + '|';

                            SeriesID = SegmentValuee;
                        } else if (SegmentCoddID == 'Detail') {
                            AccNumber = SegmentValuee;
                            SegStrNew1 += SegmentValuee + '|';
                        } else {
                            SegmentC1 += SegmentValuee + '|';
                            SegStrNew1 += SegmentValuee + '|';
                        }

                        COAStr += SegmentValuee + '|'; // Appears to be a loop error resulting in a duplication of the COAStr values. COAStr is also prefixed with a |
                    }
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

                    Object.keys(A_memocodes).forEach(function (key) {
                        StrAdd += `${key},${A_memocodes[key]},`;
                        SegStrNew2 += `${key}:${A_memocodes[key]},`;
                    });

                    var objpayroll = {
                        ExpenseID: ExpenseID,
                        ModifyBy: localStorage.UserId,
                        TransValueStr: StrAdd,
                        COAString: COAStr,
                        SegmentString: SegmentCodd,
                        SegmentString1: CCCODE + '|' + SegmentC1,
                        SegmentString2: SegmentC2,
                        AccountNumber: AccNumber,
                        PayDescription: $('#txtPayDesc' + ExpenseID).val(),
                        SegmentStr1: SegStrNew1.slice(0, -1),
                        TransactionStr1: SegStrNew2.slice(0, -1),
                        SetID: SetID,
                        SeriesID: SeriesID
                    }
                    ObjDefaultArr.push(objpayroll);

                    // clear our loop vlaues
                    CC = 0;
                    StrAdd = '';
                    SegmentCodd = '';
                    SegmentC1 = '';
                    SegmentC2 = '';
                    COAStr = '';
                    AccNumber = '';
                    SegStrNew1 = '';
                    SegStrNew2 = '';
                    SetID = '';
                    SeriesID = '';
                }
            }
        }
    });
    //return;

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
    { funSaveData1Sucess(response); })
}
function funSaveData1Sucess(response) {
    if (PostType == 'JE') {
        SaveJE();
    }
    else {
        SaveInvoiceAndJE();
    }

    $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
}
function FnLoadSucess(response) {
    var Msg = 'Payroll Saved Sucessfully !!';

    ShowMsgBox('showMSG', Msg, '', '');

    window.location.href = 'PayrollAudit';
}
function PayrollTransactionDate(Status) {
    var TransactionDate = '01/01/2016';
    var Period = $('select#ddlClosePeriod option:selected').val();

    $.ajax({
        url: `${APIUrlPayrollTransactionDate}?PayrollFileID=${JSON.parse(localStorage.PayrollAudit).PayrollAuditID}&TransactionDate=${TransactionDate}&Status=${Status}&BatchNumber=${BatchManager.BatchNumber}&PeriodStatus=${Period}`,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        funSaveData();
    })
}

function PayrollTransactionDate1(Status) {
    var TransactionDate = '01/01/2016';
    var Period = $('select#ddlClosePeriod option:selected').val();
    $.ajax({
        url: `${APIUrlPayrollTransactionDate}?PayrollFileID=${JSON.parse(localStorage.PayrollAudit).PayrollAuditID}&TransactionDate=${TransactionDate}&Status=${Status}&BatchNumber=${BatchManager.BatchNumber}&PeriodStatus=${Period}`,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        PayrollTransactionDate1Sucess(response);
    })
}

function PayrollTransactionDate1Sucess(response) {
    funSaveData1();
}

function funSaveDataLoad() {
    //  funSaveData();
    $('#dvWait1').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

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
function funSaveDataPost() {
    var ExpenseID = '';
    var ObjDefaultArr = [];
    var asas = $('#tblPayrollLoad tbody tr td').length;
    var TblCodes = $('#tblPayrollLoad tr').length;

    var CC = 0;
    var StrAdd = '';
    var VVV = '';
    var SS = 0;

    var COAStr = '';
    var SegmentStr = '';

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
                    if (SegmentCoddID == 'Series') {
                        SegmentC2 += SegmentValuee + '|';
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
                        SegmentString1: SegmentC1.slice(0, -1),
                        SegmentString2: SegmentC2.slice(0, -1),
                        AccountNumber: '',
                        PayDescription: $('#txtPayDesc' + ExpenseID).val()
                    }
                    ObjDefaultArr.push(objpayroll);
                    CC = 0;
                    StrAdd = '';
                    SegmentCodd = '';
                    SegmentC1 = '';
                    SegmentC2 = '';
                    COAStr = '';
                }
            }
        }
    });

    $.ajax({
        url: APIUrlCheckPayrollFileValidation,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjDefaultArr),
    }).done(function (response)
    { funCheckPayrollFileValidationSucess(response); })
}

function funCheckPayrollFileValidationSucess(response) {
    $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
    if (response != '') {
        var Msg = 'Please Correct the values, Corresponding COA not found!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
        var arr = response.split('|');

        for (var i = 0; i < arr.length; i++) {
            var ID = arr[i];
            $('#' + ID).addClass('PayrollValidation');
        }
    } else {
        PayrollTransactionDate1('Post');
    }
}

function fnPostConfirm() {
    $('#dvInvoice').attr('style', 'display:block;');
}

function fnSaveConfirm() {
    $('#dvConfirmSave').attr('style', 'display:block;');
}

function fnBackToPrev() {
    window.location = HOST + "/Payroll/PayrollAudit";
}

///////////////////////////////////////////////////////
function GenerateInvoice() {
    PostType = 'INVOICE';
    var isvalid = "";
    var VendorID = $('#hdnVendorID').val();

    if (VendorID == "") {
        var Msg = 'Please Select Vendor First!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    } else {
        $('#dvWait1').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        CheckClearingAccount();
    }
}

function GenerateJE() {
    PostType = 'JE';
    var isvalid = "";
    var VendorID = $('#hdnVendorID').val();

    if (VendorID == "") {
        var Msg = 'Please Select Vendor First!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    }
    else {
        $('#dvWait1').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

        CheckClearingAccount();
    }
}

function CheckClearingAccount() {
    $.ajax({
        url: APIUrlCheckClearingAccount + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CheckClearingAccountSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function CheckClearingAccountSucess(response) {
    if (response.length > 0) {
        if ((response[0].LACCOUNT == 'ERROR') && (response[0].FACCOUNT == 'ERROR')) {
            hideDiv('dvInvoice');
            var Msg = 'Labor & Fringe Clearing Account not Set for This Company. Please Set Clearing Account First !!';
            ShowMsgBox('showMSG', Msg, '', 'failuremsg');
            $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        } else if ((response[0].LACCOUNT == 'ERROR') && (response[0].FACCOUNT == 'OK')) {
            hideDiv('dvInvoice');
            var Msg = 'Labor Clearing Account not Set for This Company. Please Set Labor Clearing Account First !!';
            ShowMsgBox('showMSG', Msg, '', 'failuremsg');
            $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        } else if ((response[0].LACCOUNT == 'OK') && (response[0].FACCOUNT == 'ERROR')) {
            hideDiv('dvInvoice');
            var Msg = 'Fringe Clearing Account not Set for This Company. Please Set Fringe Clearing Account First !!';
            ShowMsgBox('showMSG', Msg, '', 'failuremsg');
            $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        } else if ((response[0].LACCOUNT == 'OK') && (response[0].FACCOUNT == 'OK')) {
            funCheckPayrollFileValidation();
        }
    }
}

$('#txtVendor').focusin(function () {
    FillVendor();
    //  $('#hdnVendorID').val(GetVendorNamePO[i].VendorID);
    // $('#txtVendor').val(GetVendorNamePO[i].VendorName);

})

function FillVendor() {
    $.ajax({
        url: APIUrlFillVendor + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillVendorSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillVendorSucess(response) {
    GetVendorNamePO = [];
    GetVendorNamePO = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.VendorID,
            label: m.VendorName,
        };
    });
    $(".VendorCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $("#hdnVendorID").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);

            return false;
        },
        select: function (event, ui) {

            $("#hdnVendorID").val(ui.item.value);
            $('#txtVendor').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {

            }
        }
    })

}

function ShowMSG(error) {
    console.log(error);
}

function funCheckPayrollFileValidation() {
    var ExpenseID = '';
    var ObjDefaultArr = [];
    var asas = $('#tblPayrollLoad tbody tr td').length;
    var TblCodes = $('#tblPayrollLoad tr').length;

    var CC = 0;
    var StrAdd = '';
    var VVV = '';
    var SS = 0;

    var COAStr = '';
    var SegmentStr = '';

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

                    } else {
                        StrAdd += TransCodeIDforSave + ',' + TransValforSave + ',';
                    }
                } else if (CheckCls == 'AWRY') {
                    var SegmentValuee = $(this).val();
                    var SegmentCoddID = $(this).attr('id');

                    SegmentCodd += SegmentCoddID + ',' + SegmentValuee + ',';

                    if (SegmentCoddID == 'Set') {
                        SegmentC2 += SegmentValuee + '|';
                    } else if (SegmentCoddID == 'Series') {
                        SegmentC2 += SegmentValuee + '|';
                    } else if (SegmentCoddID == 'Detail') {
                        SegmentC2 += SegmentValuee + '|';
                        AccNumber = SegmentValuee;
                    } else {
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
                        SegmentString1: CCCODE + '|' + SegmentC1,
                        SegmentString2: AccNumber,
                        AccountNumber: '',
                        PayDescription: $('#txtPayDesc' + ExpenseID).val()
                    }
                    ObjDefaultArr.push(objpayroll);
                    CC = 0;
                    StrAdd = '';
                    SegmentCodd = '';
                    SegmentC1 = '';
                    SegmentC2 = '';
                    COAStr = '';
                }
            }
        }
    });

    $.ajax({
        url: APIUrlCheckPayrollFileValidation,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ObjDefaultArr),
    }).done(function (response) {
        funCheckPayrollFileValidationSucess(response);
    })
}

function FillDefault() {
    var Mode = 2;
    $.ajax({
        url: APIUrlFillDefault + '?CID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID + '&ProdID=' + localStorage.ProdId + '&Mode=' + Mode,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillDefaultSucess(response);
    })
}

function FillDefaultSucess(response) {
    var TLength = response.length;
    if (TLength > 0) {
        $('#spanBank').html(response[0].Bankname);
        if (response[0].VendorID != '0') {
            $('#txtVendor').val(response[0].VendorName);
            $('#hdnVendorID').val(response[0].VendorID);
        }
        CCCODE = response[0].CCode;
    }
}

function SaveInvoiceAndJE() {
    var VendorID = $('#hdnVendorID').val();

    $.ajax({
        url: APIUrlSaveInvoice + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID + '&UserID=' + localStorage.UserId + '&ProdId=' + localStorage.ProdId + '&VendorID=' + VendorID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        SaveInvoiceAndJESucess(response);
    })
}

function SaveInvoiceAndJESucess(response) {
    //var Msg = 'Payroll Load Sucessfully !!';
    //ShowMsgBox('showMSG', Msg, '', '');
    //window.location.href = 'PayrollHistory';

    $('#fade').attr('style', 'display:none;');
    $('#dvInvoice').attr('style', 'display:none;');

    $('#dvInv').attr('style', 'display:block;');
    $('#spanInvNo').html(response[0].Result1);
    $('#spanJETransNo1').html(response[0].Result2);
}

function SaveJE() {
    var VendorID = $('#hdnVendorID').val();

    $.ajax({
        url: APIUrlSaveJE + '?PayrollFileID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID + '&UserID=' + localStorage.UserId + '&ProdId=' + localStorage.ProdId + '&VendorID=' + VendorID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        SaveJESucess(response);
    })
}

function SaveJESucess(response) {
    //var Msg = 'Payroll Load Sucessfully !!';
    //ShowMsgBox('showMSG', Msg, '', '');
    //window.location.href = 'PayrollHistory';

    $('#fade').attr('style', 'display:none;');
    $('#dvInvoice').attr('style', 'display:none;');
    $('#dvJE').attr('style', 'display:block;');
    $('#spanJETransNo').html(response[0].Result1);
}
$('#tblPayrollLoad').delegate('.Location', 'keydown', function (event) {
    //var key = event.which || event.keyCode;
    //if (event.which === 38) {
    //    var stval = $(this).closest('tr').prev().attr('id');
    //    if ($('.Location_' + stval).length > 0)
    //        $('.Location_' + stval).select();
    //}
    //else if (event.which === 40) {
    //    var stval = $(this).closest('tr').next().attr('id');
    //    if ($('.Location_' + stval).length > 0)
    //        $('.Location_' + stval).select();
    //}
})

$('#tblPayrollLoad').delegate('.Episode', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('.Episode_' + stval).length > 0) {
            $('.Episode_' + stval).select();
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('.Episode_' + stval).length > 0) {
            $('.Episode_' + stval).select();
        }

    }
})

$('#tblPayrollLoad').delegate('.Detail', 'keydown', function (event) {
    //var key = event.which || event.keyCode;
    //if (event.which === 38) {
    //    var stval = $(this).closest('tr').prev().attr('id');

    //    if ($('.Detail_' + stval).length > 0) {
    //        $('.Detail_' + stval).select();
    //    }
    //}
    //else if (event.which === 40) {
    //    var stval = $(this).closest('tr').next().attr('id');
    //    if ($('.Detail_' + stval).length > 0) {
    //        $('.Detail_' + stval).select();
    //    }
    //}
})

$('#tblPayrollLoad').delegate('.Set', 'keydown', function (event) {
    //var key = event.which || event.keyCode;
    //if (event.which === 38) {
    //    var stval = $(this).closest('tr').prev().attr('id');
    //    if ($('.Set_' + stval).length > 0) {
    //        $('.Set_' + stval).select();
    //    }
    //}
    //else if (event.which === 40) {
    //    var stval = $(this).closest('tr').next().attr('id');
    //    if ($('.Set_' + stval).length > 0) {
    //        $('.Set_' + stval).select();
    //    }
    //}
})

$('#tblPayrollLoad').delegate('.Series', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('.Series_' + stval).length > 0) {
            $('.Series_' + stval).select();
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('.Series_' + stval).length > 0) {
            $('.Series_' + stval).select();
        }
    }
})

function CheckFreezePeriodJE() {
    var Period = $('select#ddlClosePeriod option:selected').val();
    $("#btnYes").removeAttr("href"); $("#btnYes").css("pointer-events", "none");
    $("#btnNo").removeAttr("href"); $("#btnNo").css("pointer-events", "none");
    $.ajax({
        url: APIUrlCheckClosePeriodStatus + '?CompanyID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID + '&Period=' + Period,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GEt',

        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        CheckFreezePeriodJESucess(response);
    })
}

function CheckFreezePeriodJESucess(response) {

    if (response.length > 0) {
        var Msg = 'Current Period is Frozen , you can Post Only in Future Period!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    } else {
        GenerateJE();
    }
}

// Called from within the cshtml and not referenced within this JS
/*
1. CheckFreezePeriodInvoice
2. GenerateInvoice
3. CheckClearingAccount
4. funCheckPayrollFileValidation
5. PayrollTransactionDate1
6. funSaveData1
7. SaveInvoiceAndJE or SaveJE
*/
function CheckFreezePeriodInvoice() {
    var Period = $('select#ddlClosePeriod option:selected').val();
    $("#btnYes").removeAttr("href"); $("#btnYes").css("pointer-events", "none");
    $("#btnNo").removeAttr("href"); $("#btnNo").css("pointer-events", "none");
    $.ajax({
        url: APIUrlCheckClosePeriodStatus + '?CompanyID=' + JSON.parse(localStorage.PayrollAudit).PayrollAuditID + '&Period=' + Period,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        CheckFreezePeriodInvoiceSucess(response);
    })
}
function CheckFreezePeriodInvoiceSucess(response) {

    if (response.length > 0) {
        var Msg = 'Current Period is Frozen , you can Post Only in Future Period!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');
    }
    else {
        GenerateInvoice();
    }
}

function JERedirect() {
    window.location.href = 'PayrollHistory';
}

function InvRedirect() {
    window.location.href = 'PayrollHistory';
}

function Cancel() {
    $('#dvConfirmCancel').attr('style', 'display:block;');
}

function CancelYes() {
    window.location.href = 'PayrollAudit';
}

function FunGetCOABySegmentPosition(values, SegmentName, SegmentP) {
    GlbCOAList = [];
    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    console.log(values);
    if (SegmentP == 0) COACode = '~';
    else PreSegment = SegmentP - 1;
    var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
    console.log(APIUrlGetCOABySegmentPosition1 + '?COACode=' + (CCCODE + '|' + COACode.split('|').slice(0, -2).join('|')) + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP);
    $.ajax({
        url: APIUrlGetCOABySegmentPosition1 + '?COACode=' + (CCCODE + '|' + COACode.split('|').slice(0, -2).join('|')) + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        GlbCOAList = response;
        var array = [];
        var ProductListjson = response;
        array = response.error ? [] : $.map(response, function (m) {
            return {
                strlabel: m.COANo,
                label: m.COANo1,
                value: m.COACode,
                COAId: m.COAID,
            };
        });
        console.log(array);
        $(".clsDT" + values).autocomplete({
            minLength: 0,
            source: function (request, response) {
                let matches = $.map(array, (item) => { if (item.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) return item; });
                response(matches);
            },
            focus: function (event, ui) {
                $(this).val(ui.item.label);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.strlabel);
                $(this).attr('COACode', ui.item.value);
                $(this).attr('COAId', ui.item.COAId);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                    try {
                        var findVal = $(this).val();
                        findVal = findVal.toUpperCase();
                        console.log(findVal);
                        var GetElm = $.grep(array, function (v) {
                            return v.label == findVal;
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
        });
    }).fail(function (error) {
        console.log(error);
    })
}

function GetOptional(values, SegmentName, SegmentP) {
    $.ajax({
        url: APIUrlAccountDetailsByCat + '?ProdId=' + localStorage.ProdId + '&Category=' + SegmentName,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GblOptionalCOA = [];
        GblOptionalCOA = response;
        var array = [];
        var ProductListjson = response;
        array = response.error ? [] : $.map(response, function (m) {
            return {
                label: m.AccountCode,
                value: m.AccountID,
            };
        });

        $(".clsSets" + values).autocomplete({
            minLength: 0,
            source: array,
            focus: function (event, ui) {
                $(this).val(ui.item.label);
                $(this).attr('AccountID', ui.item.value);
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.label);
                $(this).attr('AccountID', ui.item.value);
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                    try {
                        var findVal = $(this).val();
                        findVal = findVal.toUpperCase();
                        console.log(findVal);
                        var GetElm = $.grep(array, function (v) {
                            return v.label == findVal;
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
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}