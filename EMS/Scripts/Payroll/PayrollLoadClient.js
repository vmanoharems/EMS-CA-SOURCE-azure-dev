///------------------------------------- Api Calling

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlFillSegment = HOST + "/api/Payroll/GetSegmentForPayroll";
var APIUrlFillPayrollFileData = HOST + "/api/Payroll/GetPayrollFileinClientSide";
var APIUrlTransCodeForPayroll = HOST + "/api/Payroll/GetTransCodeForPayroll";
var APIUrlPayrollLoad = HOST + "/api/Payroll/GetPayrollDataFileFill";
var APIUrlGetTransactionValueByID = HOST + "/api/CompanySettings/GetTransactionValueFillByID";
var APIUrlPayrollTransactionValue = HOST + "/api/Payroll/InsertUpdatePayrollTransValue";
var APIUrlPayrollAmount = HOST + "/api/Payroll/GetPayrollFileAmountDetail";
var APIUrlPayrollTransactionDate = HOST + "/api/Payroll/SaveTrabsactionDate";
var APIUrlPayrollExpenseUpdate = HOST + "/api/Payroll/UpdatePayrollExpenses";
var APIUrlGetCOAAccount = HOST + "/api/Payroll/FetchCOAbyCOACode";
var APIUrlGetPayrollBankdetailbyProdID = HOST + "/api/Payroll/GetPayrollBankdetailbyProdID";
var APIUrlGetCOA = HOST + "/api/Ledger/GetCOABySegmentPosition";
var APIUrlAccountDetailsByCat = HOST + "/api/Ledger/GetTblAccountDetailsByCategory";

var APIUrlCheckPayrollFileValidation = HOST + "/api/Payroll/CheckPayrollFileBeforePost";
var APIUrlFreeField = HOST + "/api/Payroll/GetFreeFieldDetail";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
var APIUrlSaveInvoice = HOST + "/api/Payroll/INVOICEJETHROUGHPAYROLL1";

var APIUrlSaveJE = HOST + "/api/Payroll/JETHROUGHPAYROLL1";

var APIUrlCheckClearingAccount = HOST + "/api/Payroll/CheckClearingAccount";
var APIUrlFillDefault = HOST + "/api/Payroll/GetPayrollVendor";

var APIUrlCheckClosePeriodStatus = HOST + "/api/Payroll/CheckClosePeriodStatus";
var APIUrlGetClosePeriodStatus = HOST + "/api/Ledger/GetClosePeriodStatus";

var TransCodeTDStr = '';
var TransCodeTRStr = '';
var PayrollLoadID = '';
var pubArrTraCode = [];
var TotalTransCodeLength = '';
var CompanyListByProdiD;

var SegmentStrForXML = '';
var SegmentClsForXML = '';
var SegmentStrTr = '';

var HeadTrCount = 2;
var SuspendAccountNumber;
var SegmentCodd;
var SegmentC1 = ''
var SegmentC2 = '';

var ArrSegment = [];
var ArrOptionalSegment = [];
var GlbCOAList = [];
var ArrSegment = [];

var FreeFiledCount;
var FF1Payroll;
var FF2Payroll;
var FF3Payroll;
var TransCodeIDPayroll;
var TransCodePayroll;

var GetVendorNamePO = [];
var PostType = '';

var PFID;
var CID = '';
var seglength;
var A_memocodes;

$(document).ready(function () {
    //FillCompany();
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlCompanyList({
        'callback': function (objP, data) {
            SelectCompany(objP, data);
        }
            , 'existingValue': parseInt(JSON.parse(localStorage.PayrollAudit || '{}').ShowPayrollHistoryCompanyID)
    }));
    SegmentCodd = '';

    var heightt = $(window).height();
    heightt = heightt - 310;
    $('#dvPayrollContainer').attr('style', 'height:' + heightt + 'px;');

    //$('#txtPayrollBatch').val(localStorage.BatchNumber);

    seglength = AtlasUtilities.SEGMENTS_CONFIG.sequence.length;
    A_memocodes = (AtlasCache.Cache.GetItembyName('Transaction Codes') || [{}]).reduce(function (map, obj) { map[obj.TransactionCodeID] = ''; return map; }, {}); // Use this for the form capture during Load & Save/Poste
});

function showDiv(id) {
    $('#' + id).show();
    $('#fade').show();
    scroll(0, 0);
}

function hideDiv(id) {
    $('#' + id).hide();
    $('#fade').hide();
}

/*
function FillCompany() {
    $.ajax({
        url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response)
    { FillCompanySucess(response); })
}

function FillCompanySucess(response) {
    var TLength = response.length;
    CompanyListByProdiD = '<option  value=0>Select</option>';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            var CompanyID = response[i].CompanyID;
            var CompanyName = response[i].CompanyCode;
            CompanyListByProdiD += "<option  value=" + CompanyID + ">" + CompanyName + "</option>";
        }
    }
    FillSegment();
}
*/
function SelectCompany() {
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());

    var CompanyID = $('#ddlCompany :selected').val(); //legacy
    var CompanyName = $('#ddlCompany :selected').text().split(' ')[0]; //legacy
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': CompanyID
        , 'ShowPayrollHistoryCompanyCode': CompanyName
    });

    FillSegment();
    FillDefault(CompanyID);
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
    .done(function (response) {
        FillSegmentSucess(response);
    })
}

function FillSegmentSucess(response) {
    var TLength = response.length;

    ArrSegment = [];

    SegmentStrTr = ''; // reset SegmentStrTr since it's a var/public
    SegmentStrForXML = '';
    SegmentClsForXML = '';

    var strHtml = '';
    var strHtmlTh = '';
    var strHtmlTd = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            SegmentStrForXML += response[i].SegmentCode + '|' + response[i].Classification + '|';
            SegmentClsForXML += response[i].Classification + '|';
            if (response[i].Classification != 'Company') {
                HeadTrCount += 1;
                SegmentStrTr += '<th>' + response[i].SegmentCode + '</th>';
            }

            var ObjSegment = {
                SegmentId: response[i].SegmentId, SegmentName: response[i].SegmentCode
            }

            ArrSegment.push(ObjSegment);
            var Check = response[i].Classification

            //strHtmlTh += "<th>" + response[i].SegmentCode + "</th>";

            if (Check == 'Company') {
                strHtmlTh += "<th>" + response[i].SegmentCode + "</th>";
                strHtmlTd = '<td class="width100"><input type="text"  class="SearchCode   detectTab" onblur="javascript: GetSegmentValue(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript: funSegment(' + 0 + ',\'' + Check + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + Check + '" /></td>';
            }

            //else if (Check == 'Set') {
            //    strHtmlTd += '<td class="width100"><input type="text"  class="SearchOptionalCode clsOtional' + 0 + '   " onblur="javascript:funCheckOptionalAutoFill(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:GetOptional(' + 0 + ',\'' + Check + '\',' + i + ');" id="txtOptional_' + 0 + '_' + i + '" name="' + Check + '" /></td>';

            //}
            //else if (Check == 'Series') {
            //    strHtmlTd += '<td class="width100"><input type="text"  class="SearchOptionalCode clsOtional' + 0 + '   " onblur="javascript:funCheckOptionalAutoFill(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:GetOptional(' + 0 + ',\'' + Check + '\',' + i + ');" id="txtOptional_' + 0 + '_' + i + '" name="' + Check + '" /><input type="hidden" class="clsCOACode" id="hdnCode_' + 0 + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + 0 + '"  ></td>';

            //}
            //else {
            //    strHtmlTd += '<td class="width100"><input type="text"  class="SearchCode   detectTab" onblur="javascript:GetSegmentValue(' + 0 + ',\'' + Check + '\',' + i + ');" onfocus="javascript:funSegment(' + 0 + ',\'' + Check + '\',' + i + ');" id="txt_' + 0 + '_' + i + '" name="' + Check + '" /></td>';
            //}
            //'<input type="hidden" class="clsCOACode" id="hdnCode_' + 0 + '"/><input type="hidden" class="clsCOAId" id="hdnCOAId_' + 0 + '">';

        }
        strHtml = "<tr>" + strHtmlTh + '<th>Action</th>' + "</tr><tr>" + strHtmlTd + '<td><a class="btn btn-default" href="javascript:FillPayrollFile();">Choose Payroll File</a></td>' + "</tr>";
    } else {
        strHtml += "<tr>";
        strHtml += "<td colspan=" + TLength + " style='text-align:center;'>No Records Found !!</td>";
        strHtml += "</tr>";
    }
    $('#tblSegment').html(strHtml);
    funSegment(0, 'Company', 0);

}

function FillPayrollFile() {
    FillPayrollFileData();
    showDiv('default');
}

function FillPayrollFileData() {
    CID = $('#ddlCompany :selected').text().split(' ')[0];
    //var CID = $('#txt_0_0').val();

    //FillDefault(CID);
    localStorage.ShowPayrollHistoryID = CID;

    $.ajax({
        url: APIUrlFillPayrollFileData + '?CompanyCode=' + CID + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillPayrollFileDataSucess(response);
    })
}

function FillPayrollFileDataSucess(response) {
    var TLength = response.length;
    var strHtml = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            strHtml += "<tr>";
            strHtml += "<td>" + response[i].InvoiceNumber + "</td>";
            strHtml += "<td>" + response[i].FileDate + "</td>";
            strHtml += "<td>" + response[i].PeriodEnd + "</td>";
            strHtml += "<td>" + response[i].PayrollCount + "</td>";
            strHtml += "<td>" + response[i].LoadNumber + "</td>";
            // strHtml += "<td>" + response[i].TotalPayrollAmount + "</td>";
            strHtml += "<td>$ " + (response[i].TotalPayrollAmount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";
            strHtml += `<td><a href='javascript: FreeField(${response[i].PayrollFileID}, "${response[i].InvoiceNumber}" );'>Select</a></td>`;
            strHtml += "</tr>";
        }
    } else {
        strHtml += "<tr>";
        strHtml += "<td colspan='7' style='text-align:center;'>No Records Found !!</td>";
        strHtml += "</tr>";
    }
    $('#tBodyPayrollFill').html(strHtml);
}

function FillPayrollData(PayRollFileID) {
    $('.LoadHeadCls').attr("disabled", "disabled");
    $('#btnLoadSave').attr('style', 'display:block;');
    $('#btnLoadPost').attr('style', 'display:block;');
    $('#dvMainLoad').attr('style', 'display:block;');
    hideDiv('default');
    PayrollLoadID = PayRollFileID;
    $.ajax({
        url: APIUrlTransCodeForPayroll + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillPayrollDataSucess(response);
    })
}

function FillPayrollDataSucess(response) {
    pubArrTraCode.push(null);
    var TLength = response.length;
    var strHtml = '';
    var strHtml1 = '';
    if (TLength > 0) {
        TransCodeIDPayroll = '';
        TransCodePayroll = '';
        TotalTransCodeLength = TLength;
        for (var i = 0; i < TLength; i++) {
            strHtml += "<td><input onClick='javascript: TransCodeFillFn(" + response[i].TransactionCodeID + ',' + '"' + response[i].TransCode + '"' + ");' class='width60 PayrollAutoFilltest" + response[i].TransactionCodeID + "'  type='text' id='" + response[i].TransactionCodeID + "' value='' name='ABXZ'/></td>";
            strHtml1 += "<th>" + response[i].TransCode + "</th>";
            pubArrTraCode.push('PayrollAutoFilltest' + response[i].TransactionCodeID);

            TransCodePayroll += response[i].TransCode + '|';
            TransCodeIDPayroll += response[i].TransactionCodeID + '|';
        }
    }
    TransCodeTDStr = strHtml;
    TransCodeTRStr = strHtml1;
    PayrollLoad();
}

function PayrollLoad() {
    $.ajax({
        url: APIUrlPayrollLoad + '?PayrollFileID=' + PayrollLoadID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { PayrollLoadSucess(response); })

}
function PayrollLoadSucess(response) {
    var TLength = response.length;
    var strHtml = '';
    var SuspenceCnt = 0;
    if (TLength > 0) {
        var OLDStr = '';
        var NewStr = '';
        strHtml += "<tbody>";
        for (var i = 0; i < TLength; i++) {
            NewStr = response[i].Header;

            if (OLDStr == '') {
                strHtml += "<tr style='border-bottom: 1px solid #d2d6de;'>";
                strHtml += "<th colspan='" + HeadTrCount + "'>" + response[i].Header + "</th>";
                //strHtml += "<th style='text-align:center;' colspan=" + TotalTransCodeLength + ">Transaction Value</th>"
                strHtml += "<tr>"
                strHtml += "<tr>" + SegmentStrTr + "<th>Pay Description</th><th>Payment Amount</th>";
                strHtml += TransCodeTRStr;
                strHtml += "</tr>";

                var AccountCheck = response[i].AccountID;
                if (AccountCheck == '0') {
                    SuspenceCnt = parseFloat(SuspenceCnt) + parseFloat(response[i].PaymentAmount);
                    strHtml += "<tr  class='ABCD trLedgerCls' id=" + response[i].PayrollExpenseID + ">";
                }
                else {
                    strHtml += "<tr class='ABCD' id=" + response[i].PayrollExpenseID + ">";
                }
                strHtml += "<td style='display:none;'> <input  type='text' name='AWRYP' id='" + response[i].PayrollExpenseID + "'/></td>";

                //  var straa = SegmentStrForXML.split('|');    
                var straa = SegmentClsForXML.split('|');
                for (var j = 0; j < straa.length - 1; j++) {

                    var SegCode = straa[j];
                    var SegClassification = straa[j];
                    if (SegClassification == 'Company') {

                    }
                    else if (SegClassification == 'Location') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Location Location_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].LocationCode + "'/></td>";

                    }
                    else if (SegClassification == 'Episode') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Episode Episode_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].EpisodeCode + "'/></td>";

                    }

                    else if (SegClassification == 'Ledger') {
                        var AccCode = response[i].PaymentAccount;
                        if (AccCode == '') {
                            AccCode = SuspendAccountNumber;
                        }

                        if (AccountCheck == '0') {
                            strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls txtBgForDetail' name='AWRY' value='" + AccCode + "'/></td>";
                        }
                        else {
                            strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls' name='AWRY' value='" + AccCode + "'/></td>";
                        }
                    }
                    else if (SegClassification == 'Set') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Set Set_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].SetCode + "'/></td>";
                    }
                    else if (SegClassification == 'Series') {


                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Series Series_" + response[i].PayrollExpenseID + "' name='AWRY' value=''/></td>";
                    }
                    else if (SegClassification == 'Detail') {


                        //var Accountt = response[i].AccountID;
                        //if (Accountt == '0') {
                        //    var SuspendAc = response[i].SuspendAccount;

                        //    strHtml += "<td><input class='segmentCls RedBGG Detail Detail_" + response[i].PayrollExpenseID + "' id=" + SegClassification + " name='AWRY' type='text' value='" + SuspendAc + "'/></td>";
                        //}
                        // else {
                        strHtml += "<td><input class='segmentCls Detail Detail_" + response[i].PayrollExpenseID + "' id=" + SegClassification + " name='AWRY' type='text' value='" + response[i].PaymentAccount + "'/></td>";
                        // }
                    }
                    else {
                        //var txtVal = $('#txtSegmentId_' + SegClassification + '').val();
                        var txtVal = $('#txt_0_' + j + '').val();
                        if (txtVal == '') {

                            strHtml += "<td><input class='segmentCls' id=" + SegClassification + " name='AWRY' type='text' value=''/></td>";
                        }
                        else {
                            strHtml += "<td><input class='segmentCls' id=" + SegClassification + " name='AWRY' type='text' value='" + txtVal + "'/></td>";
                        }
                    }
                }

                strHtml += "<td><input name='AWRYDe' type='text' id=txtPayDesc" + response[i].PayrollExpenseID + " value='" + response[i].PayDescription + "'></td>";

                strHtml += "<td>" + response[i].PaymentAmount + "</td>";
                strHtml += "<td style = 'display:none;'><input type='text' id='" + response[i].PayrollExpenseID + "' value='" + response[i].PayrollExpenseID + "'></td>";

                if (FreeFiledCount > 0) {
                    var straaP = TransCodeIDPayroll.split('|');
                    var straaTCode = TransCodePayroll.split('|');
                    for (var j = 0; j < straaP.length - 1; j++) {

                        var TCode = straaP[j];

                        if (TCode == FF1Payroll) {

                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].Freefield1 + "' name='ABXZ'/></td>";

                        }
                        else if (TCode == FF2Payroll) {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].Freefield2 + "' name='ABXZ'/></td>";
                        }
                        else if (TCode == FF3Payroll) {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].FreeField3 + "' name='ABXZ'/></td>";
                        }
                        else {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='' name='ABXZ'/></td>";
                        }
                    }
                }
                else {
                    strHtml += TransCodeTDStr;
                }


                // strHtml += TransCodeTDStr;

                strHtml += "</tr>";

                OLDStr = response[i].Header;
            }
            else if (NewStr == OLDStr) {
                var AccountCheck = response[i].AccountID;
                if (AccountCheck == '0') {
                    SuspenceCnt = parseFloat(SuspenceCnt) + parseFloat(response[i].PaymentAmount);
                    strHtml += "<tr  class='ABCD trLedgerCls' id=" + response[i].PayrollExpenseID + ">";
                }
                else {
                    strHtml += "<tr class='ABCD' id=" + response[i].PayrollExpenseID + ">";
                }
                strHtml += "<td style='display:none;'> <input  type='text' name='AWRYP' id='" + response[i].PayrollExpenseID + "'/></td>";
                // var straa = SegmentStrForXML.split('|');
                var straa = SegmentClsForXML.split('|');
                for (var j = 0; j < straa.length - 1; j++) {


                    var SegCode = straa[j];
                    var SegClassification = straa[j];
                    if (SegClassification == 'Company') {

                    }
                    else if (SegClassification == 'Location') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Location Location_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].LocationCode + "'/></td>";
                    }
                    else if (SegClassification == 'Episode') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Episode Episode_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].EpisodeCode + "'/></td>";

                    }
                    else if (SegClassification == 'Ledger') {
                        var AccCode = response[i].PaymentAccount;
                        if (AccCode == '') {
                            AccCode = SuspendAccountNumber;
                        }

                        if (AccountCheck == '0') {
                            strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls txtBgForDetail' name='AWRY' value='" + AccCode + "'/></td>";
                        }
                        else {
                            strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls' name='AWRY' value='" + AccCode + "'/></td>";
                        }
                    }
                    else if (SegClassification == 'Set') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Set Set_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].SetCode + "'/></td>";
                    }
                    else if (SegClassification == 'Series') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Series Series_" + response[i].PayrollExpenseID + "' name='AWRY' value=''/></td>";
                    }

                    else if (SegClassification == 'Detail') {


                        //var Accountt = response[i].AccountID;
                        //if (Accountt == '0') {
                        //    var SuspendAc = response[i].SuspendAccount;
                        //    strHtml += "<td><input class='segmentCls RedBGG Detail Detail_" + response[i].PayrollExpenseID + "' id=" + SegClassification + " name='AWRY' type='text' value='" + SuspendAc + "'/></td>";
                        //}
                        //else {
                        strHtml += "<td><input class='segmentCls Detail Detail_" + response[i].PayrollExpenseID + "' id=" + SegClassification + " name='AWRY' type='text' value='" + response[i].PaymentAccount + "'/></td>";
                        // }
                    }
                    else {
                        //var txtVal = $('#txtSegmentId_' + SegClassification + '').val();
                        var txtVal = $('#txt_0_' + j + '').val();
                        if (txtVal == '') {

                            strHtml += "<td><input class='segmentCls' id=" + SegClassification + " name='AWRY' type='text' value=''/></td>";
                        }
                        else {
                            strHtml += "<td><input class='segmentCls' id=" + SegClassification + " name='AWRY' type='text' value='" + txtVal + "'/></td>";
                        }
                    }

                }
                strHtml += "<td><input name='AWRYDe' type='text' id=txtPayDesc" + response[i].PayrollExpenseID + " value='" + response[i].PayDescription + "'></td>";

                strHtml += "<td>" + response[i].PaymentAmount + "</td>";
                strHtml += "<td style = 'display:none;'><input type='text' id='" + response[i].PayrollExpenseID + "' value='" + response[i].PayrollExpenseID + "'></td>";
                if (FreeFiledCount > 0) {
                    var straaP = TransCodeIDPayroll.split('|');
                    var straaTCode = TransCodePayroll.split('|');
                    for (var j = 0; j < straaP.length - 1; j++) {

                        var TCode = straaP[j];

                        if (TCode == FF1Payroll) {

                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].Freefield1 + "' name='ABXZ'/></td>";

                        }
                        else if (TCode == FF2Payroll) {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].Freefield2 + "' name='ABXZ'/></td>";
                        }
                        else if (TCode == FF3Payroll) {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].FreeField3 + "' name='ABXZ'/></td>";
                        }
                        else {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='' name='ABXZ'/></td>";
                        }
                    }
                }
                else {
                    strHtml += TransCodeTDStr;
                }
                strHtml += "</tr>";
                OLDStr = response[i].Header;
            }
            else {
                strHtml += "<tr style='border-bottom: 1px solid #d2d6de;'>";
                strHtml += "<th colspan='" + HeadTrCount + "'>" + response[i].Header + "</th>";
                //strHtml += "<th style='text-align:center;' colspan=" + TotalTransCodeLength + ">Transaction Value</th>" 
                strHtml += "<tr>"
                strHtml += "<tr>" + SegmentStrTr + "<th>Pay Description</th><th>Payment Amount</th>";
                strHtml += TransCodeTRStr;
                strHtml += "</tr>";

                var AccountCheck = response[i].AccountID;
                if (AccountCheck == '0') {
                    SuspenceCnt = parseFloat(SuspenceCnt) + parseFloat(response[i].PaymentAmount);
                    strHtml += "<tr  class='ABCD trLedgerCls' id=" + response[i].PayrollExpenseID + ">";
                }
                else {
                    strHtml += "<tr class='ABCD' id=" + response[i].PayrollExpenseID + ">";
                }


                strHtml += "<td style='display:none;'> <input  type='text' name='AWRYP' id='" + response[i].PayrollExpenseID + "'/></td>";
                var straa = SegmentClsForXML.split('|');

                for (var j = 0; j < straa.length - 1; j++) {

                    var SegCode = straa[j];
                    var SegClassification = straa[j];
                    if (SegClassification == 'Company') {

                    }
                    else if (SegClassification == 'Location') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Location Location_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].LocationCode + "'/></td>";

                    }

                    else if (SegClassification == 'Ledger') {
                        var AccCode = response[i].PaymentAccount;
                        if (AccCode == '') {
                            AccCode = SuspendAccountNumber;
                        }

                        if (AccountCheck == '0') {
                            strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls txtBgForDetail' name='AWRY' value='" + AccCode + "'/></td>";
                        }
                        else {
                            strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls' name='AWRY' value='" + AccCode + "'/></td>";
                        }
                    }
                    else if (SegClassification == 'Episode') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Episode Episode_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].EpisodeCode + "'/></td>";

                    }
                    else if (SegClassification == 'Set') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Set Set_" + response[i].PayrollExpenseID + "' name='AWRY' value='" + response[i].SetCode + "'/></td>";
                    }
                    else if (SegClassification == 'Series') {

                        strHtml += "<td><input type='text' id=" + SegClassification + " class='segmentCls Series Series_" + response[i].PayrollExpenseID + "' name='AWRY' value=''/></td>";
                    }
                    else if (SegClassification == 'Detail') {

                        //var Accountt = response[i].AccountID;
                        //if (Accountt == '0') {
                        //    var SuspendAc = response[i].SuspendAccount;
                        //    strHtml += "<td><input class='segmentCls RedBGG Detail Detail_" + response[i].PayrollExpenseID + "' id=" + SegClassification + " name='AWRY' type='text' value='" + SuspendAc + "'/></td>";
                        //}
                        //else {
                        strHtml += "<td><input class='segmentCls Detail Detail_" + response[i].PayrollExpenseID + "' id=" + SegClassification + " name='AWRY' type='text' value='" + response[i].PaymentAccount + "'/></td>";
                        // }
                    }
                    else {
                        //var txtVal = $('#txtSegmentId_' + SegClassification + '').val();
                        var txtVal = $('#txt_0_' + j + '').val();
                        if (txtVal == '') {

                            strHtml += "<td><input class='segmentCls' id=" + SegClassification + " name='AWRY' type='text' value=''/></td>";
                        }
                        else {
                            strHtml += "<td><input class='segmentCls' id=" + SegClassification + " name='AWRY' type='text' value='" + txtVal + "'/></td>";
                        }
                    }

                }
                strHtml += "<td><input name='name='AWRY'' type='text' id=txtPayDesc" + response[i].PayrollExpenseID + "  value='" + response[i].PayDescription + "'></td>";


                strHtml += "<td>" + response[i].PaymentAmount + "</td>";
                strHtml += "<td style = 'display:none;'><input type='text' id='" + response[i].PayrollExpenseID + "' value='" + response[i].PayrollExpenseID + "'></td>";
                if (FreeFiledCount > 0) {
                    var straaP = TransCodeIDPayroll.split('|');
                    var straaTCode = TransCodePayroll.split('|');
                    for (var j = 0; j < straaP.length - 1; j++) {

                        var TCode = straaP[j];

                        if (TCode == FF1Payroll) {

                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].Freefield1 + "' name='ABXZ'/></td>";

                        }
                        else if (TCode == FF2Payroll) {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].Freefield2 + "' name='ABXZ'/></td>";
                        }
                        else if (TCode == FF3Payroll) {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='" + response[i].FreeField3 + "' name='ABXZ'/></td>";
                        }
                        else {
                            strHtml += "<td><input onClick='javascript:TransCodeFillFn(" + TCode + ',' + '"' + straaTCode[j] + '"' + ");' class='width60 PayrollAutoFilltest" + TCode + "'  type='text' id='" + TCode + "' value='' name='ABXZ'/></td>";
                        }
                    }
                }
                else {
                    strHtml += TransCodeTDStr;
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


function TransCodeFillFn(values, code) {
    var ID = this.id;
    TransCodeAutoFill(values, code);
}

function funLoadData() {
    var isvalid = "";
    // isvalid += CheckRequired($("#txtFiscalStart"));
    if (isvalid == "") {
        $('#dvWait1').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        PayrollTransactionDate1('Load');
    }
}

function funSaveData() { /// Exactly the same as funSaveData1 function
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
    var CCCODE1 = CID; //$('#txt_0_0').val();

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
                        SegmentString1: CCCODE1 + '|' + SegmentC1,
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
    })
    .done(function (response) {
        FnLoadSucess(response);
    })
}

function funSaveData1() { // JT Exact same code as funSaveData; logic branching is taking place using public var PostType under funSaveData1Sucess
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
    var CCCODE1 = CID; //$('#txt_0_0').val();

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
                        SegmentString1: CCCODE1 + '|' + SegmentC1,
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
    }).done(function (response) {
        funSaveData1Sucess(response);
    })
}

function funSaveData1Sucess(response) {
    if (PostType == 'JE') {
        SaveJE();
    } else {
        SaveInvoiceAndJE();
    }

    $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
}

function FnLoadSucess(response) {
    var Msg = 'Payroll Load & Save Sucessfully !!';
    ShowMsgBox('showMSG', Msg, '', '');
    window.location.href = 'PayrollHistory';
}

function funCheckPayrollFileValidation() {
    var ExpenseID = '';
    var ObjDefaultArr = [];
    var asas = $('#tblPayrollLoad tbody tr td').length;
    var ObjDefaultArr = [];
    var TblCodes = $('#tblPayrollLoad tr').length;

    var CC = 0;
    var StrAdd = '';
    var VVV = '';
    var SS = 0;
    var AccNumber = '';

    var COAStr = '';
    var SegmentStr = '';

    var LoopCnt = TotalTransCodeLength + HeadTrCount;
    var CheckCntt = 1;

    var CCCODE1 = CID; //$('#txt_0_0').val();

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
                        SegmentString1: CCCODE1 + '|' + SegmentC1,
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

function funCheckPayrollFileValidationSucess(response) {
    if (response != '') {
        $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

        hideDiv('dvInvoice');
        var Msg = 'Please Correct the values, Corresponding COA not found!!';
        ShowMsgBox('showMSG', Msg, '', 'failuremsg');

        var arr = response.split('|');
        for (var i = 0; i < arr.length; i++) {
            var ID = arr[i];
            $('#' + ID).addClass('PayrollValidation');

        }
    } else {
        PayrollTransactionDate('Post');
        //funSaveData();
        //if (PostType == 'JE') {
        //    SaveJE();
        //}
        //else {
        //    SaveInvoiceAndJE();
        //}

        //$('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

    }
}


function PayrollLoadAmount() {
    $.ajax({
        url: APIUrlPayrollAmount + '?PayrollFileID=' + PayrollLoadID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        PayrollLoadAmountSucess(response);
    })

}

function PayrollLoadAmountSucess(response) {
    var TLength = response.length;

    if (TLength > 0) {
        $('#spanExpected').html(response[0].PayrollCount);
        $('#spanActual').html(response[0].PayrollCount);
        $('#spanPeriodEnding').html(response[0].PeriodEnd);
        $('#spanPR').html('$' + (response[0].PRClearing.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        $('#spanFringe').html('$' + (response[0].FringeClearing.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    }

}

function PayrollTransactionDate(status) {
    //var TransactionDate = $('#txtFiscalStart').val();
    var TransactionDate = '01/01/2016';
    // dropdown is Current (#) and Future (#)
    var Period = $('#ddlClosePeriod :selected').text().split(' ')[0];
    $.ajax({
        url: `${APIUrlPayrollTransactionDate}?PayrollFileID=${PayrollLoadID}&TransactionDate=${TransactionDate}&Status=${status}&BatchNumber=${BatchManager.BatchNumber}&PeriodStatus=${Period}`,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    }).done(function (response) {
        PayrollTransactionDateSucess(response);
    })
}

function PayrollTransactionDateSucess(response) {
    funSaveData1();
}

function PeriodStatus(Period) {
    if (Period == 1) {
        return 'Current';
    } else {
        return 'Future';
    }
}

function PayrollTransactionDate1(status) {
    //var TransactionDate = $('#txtFiscalStart').val();
    var TransactionDate = '01/01/2016';
    // dropdown is Current (#) and Future (#)
    var Period = $('#ddlClosePeriod :selected').text().split(' ')[0];
    $.ajax({
        url: `${APIUrlPayrollTransactionDate}?PayrollFileID=${PayrollLoadID}&TransactionDate=${TransactionDate}&Status=${status}&BatchNumber=${BatchManager.BatchNumber}&PeriodStatus=${Period}`,
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
    funSaveData();
}


function funPostData() {
    showDiv('dvInvoice');
}

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
    } else {
        $('#dvWait1').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        CheckClearingAccount();
    }
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
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',

            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            PayrollExpenseUpdateSucess(response);
        })
        .fail(function (error) {
            console.log(error);
        })
    }
}

function PayrollExpenseUpdateSucess(response) {
    var ExpenseID = response[0].ExpenseID;;
    var ColumnName = response[0].Name;;

    if (ColumnName == '1') {
        $('#spanPayAc' + ExpenseID).html($('#txtApyAc' + ExpenseID).val());
    } else if (ColumnName == '2') {
        $('#spanLocCode' + ExpenseID).html($('#txtLocCode' + ExpenseID).val());
    } else if (ColumnName == '3') {
        $('#spanSeriesCode' + ExpenseID).html($('#txtSerCode' + ExpenseID).val());
    } else if (ColumnName == '4') {
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
        .fail(function (error) {
            console.log(error);
        });
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
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            PayrollExpenseUpdateSucess(response);
        })
        .fail(function (error) {
            console.log(error);
        });
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
        .fail(function (error) {
            console.log(error);
        })
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

function TaxFormAutoFill() {
    $.ajax({
        url: APIUrlTaxFormAutoFill,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { TaxFormAutoFillSucess(response); })
    .fail(function (error) {
        console.log(error);
    })
}

function TaxFormAutoFillSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.FederalTaxID,
            label: m.FederalTaxValue,
        };
    });

    $(".TaxFormAutoFill").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {
            $("#hdFederal").val(ui.item.value);
            $('#txtFederal').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            $("#hdFederal").val(ui.item.value);
            $('#txtFederal').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $("#hdFederal").val('');
                $('#txtFederal').val('');
            }
        }
    })
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
   { console.log(error); })
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

/////////////////// auto filll COA
function fnCO() {
    var CompnayCode = $('select#ddlCompany option:selected').text();
    COAAccountFill1(CompnayCode);
    funShowSavedPayrollBankData();
}

function FillCOA(COAValue) {
    COAAccountFill(COAValue);
}

function COAAccountFill(val) {
    $.ajax({
        url: APIUrlGetCOAAccount + '?COACode=' + val + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { COAAccountFillSucess(response); })
   .fail(function (error)
   { console.log(error); })
}

function COAAccountFillSucess(response) {

    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.COACode,
            label: m.AccountCode,
        };
    });
    //var FillTest = 'segmentCls ' + m.COAParent;


    $(".segmentCls").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            //  FillCOA($(this).val());
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            // FillCOA($(this).val());
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $(this).removeAttr('name');
                //  $(this).removeAttr();
            }
        }
    })
}

function funShowSavedPayrollBankData() {
    $.ajax({
        url: APIUrlGetPayrollBankdetailbyProdID + '?CompanyID=' + $('#ddlCompany :selected').text().split(' ')[0],
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funShowSavedPayrollBankDataSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function funShowSavedPayrollBankDataSucess(response) {
    var TLength = response.length;
    if (TLength > 0) {
        SuspendAccountNumber = response[0].AccountCode;
    } else {
        SuspendAccountNumber = '';
    }
}

function ShowMSG(error) {
    console.log(error);
}

//$('#tblGLsetupTbody').delegate('.clsCode', 'change', function () {
$('#tblSegment').delegate('.segmentCls', 'focusout', function () {
    FillCOA($(this).attr("name"));
})

function COAAccountFill1(val) {
    $.ajax({
        url: APIUrlGetCOAAccount + '?COACode=' + val + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { COAAccountFill1Sucess(response); })
   .fail(function (error)
   { console.log(error); })
}

function COAAccountFill1Sucess(response) {
    $('.segmentCls').val('');
    $('.segmentCls').removeAttr('name');
    var array = [];
    // if (response.length > 0) {
    $('.segmentCls').attr('autocomplete', 'on');
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.COACode,
            label: m.AccountCode,
        };
    });
    //var FillTest = 'segmentCls ' + m.COAParent;


    $(".segmentCls").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            //  FillCOA($(this).val());
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('name', ui.item.value);
            // FillCOA($(this).val());
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $(this).removeAttr('name');
                //  $(this).removeAttr();
            }
        }
    })
    //}
    //else {
    //    $('.segmentCls').val('');
    //    $('.segmentCls').removeAttr('name');
    //  //  $(".segmentCls").autocomplete
    //    $('.segmentCls').attr('autocomplete', 'off');
    //}
}

function funSegment(values, SegmentName, SegmentP) {
    GlbCOAList = [];
    var COACode = '';
    var PreSegment = 0;
    COACode = $('#hdnCode_' + values).val();
    if (SegmentP == 0) {
        COACode = '~';
    }
    else {

        PreSegment = SegmentP - 1;
    }
    var strCOACode = $('#txt_' + values + '_' + PreSegment).attr('coacode');
    //txt_0_Company

    $.ajax({
        url: APIUrlGetCOA + '?COACode=' + strCOACode + '&ProdID=' + localStorage.ProdId + '&SegmentPosition=' + SegmentP,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        funSegmentSucess(response, values);
    })
    .fail(function (error) {
        console.log(error);
    })
}

function funSegmentSucess(response, values) {
    GlbCOAList = response;
    return; // Not sure what the purpose of any of the rest of this code is!!!

    if (response.length == 1) {
        $('#ddlCompany').val(GlbCOAList[0].COAID);
        $('#txt_0_0').val(GlbCOAList[0].COANo);
        $('#txt_0_0').attr('COACode', GlbCOAList[0].COACode);
        $('#txt_0_0').attr('COAId', GlbCOAList[0].COAID);
        $('#hdnCode_' + values).val(GlbCOAList[0].COACode);
        $('#hdnCOAId_' + values).val(GlbCOAList[0].COAId);
        AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());
    }
    var array = [];
    var ProductListjson = response;
    array = response.error ? [] : $.map(response, function (m) {
        return {
            label: m.COANo,
            value: m.COACode,
            COAId: m.COAID,
        };
    });

    $(".SearchCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.value);
            $('#ddlCompany').val(ui.item.COAId);
            return false;
        },
        select: function (event, ui) {

            $(this).val(ui.item.label);
            $(this).attr('COACode', ui.item.value);
            $(this).attr('COAId', ui.item.COAId);

            $('#hdnCode_' + values).val(ui.item.value);
            $('#hdnCOAId_' + values).val(ui.item.COAId);
            $('#ddlCompany').val(ui.item.COAId);
            AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlClosePeriod());

            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                // $(this).val('');
                // $('#f').val('');
                //$(this).val('');
                //$(this).removeAttr('COACode');
                //$(this).removeAttr('COAId');

                //$('#hdnCode_' + values).val('');
                //$('#hdnCOAId_' + values).val('');

            }
        }
    })
}

function GetOptional(values, SegmentName, SegmentP) {
    //var strprevalue=0;
    //for (var i = 0; i < ArrOptionalSegment.length; i++)
    //{
    //    if ($('#txtOptional' + values + SegmentP).val() == '')
    //    {
    //        strprevalue++;
    //    }
    //}
    //if (strprevalue != 0) {
    //    SegmentName = '';
    //}
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
        GetOptionalSucess(response, values);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetOptionalSucess(response, values) {
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
    $(".SearchOptionalCode").autocomplete({
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


            }
        }
    })
}

function FreeField(PayRollFileID, PayrollInvoiceNumber) {
    PFID = PayRollFileID;
    $.ajax({
        url: APIUrlFreeField + '?CompanyCode=' + JSON.parse(localStorage.PayrollAudit).ShowPayrollHistoryCompanyCode + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        $('#PayrollInvoiceNumber').text(PayrollInvoiceNumber);
        FreeFieldSucess(response, PayRollFileID, PayrollInvoiceNumber);
    })
}

function FreeFieldSucess(response, PayRollFileID) {
    FreeFiledCount = response.length;
    if (FreeFiledCount > 0) {
        FF1Payroll = response[0].FreeField1;
        FF2Payroll = response[0].FreeField2;
        FF3Payroll = response[0].FreeField3;
    } else {
        FF1Payroll = 0;
        FF2Payroll = 0;
        FF3Payroll = 0;
    }

    FillPayrollData(PayRollFileID);
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

//================CheckVendorName======================//
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
    .done(function (response)
    { FillVendorSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}

function SaveInvoiceAndJE() {
    var VendorID = $('#hdnVendorID').val();

    $.ajax({
        url: APIUrlSaveInvoice + '?PayrollFileID=' + PayrollLoadID + '&UserID=' + localStorage.UserId + '&ProdId=' + localStorage.ProdId + '&VendorID=' + VendorID,
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
    //var Msg = 'Payroll Load & Save Sucessfully !!';
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
        url: APIUrlSaveJE + '?PayrollFileID=' + PayrollLoadID + '&UserID=' + localStorage.UserId + '&ProdId=' + localStorage.ProdId + '&VendorID=' + VendorID,
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
    $('#fade').attr('style', 'display:none;');
    $('#dvInvoice').attr('style', 'display:none;');
    $('#dvJE').attr('style', 'display:block;');
    $('#spanJETransNo').html(response[0].Result1);
    //var Msg = 'Payroll Load & Save Sucessfully !!';
    //ShowMsgBox('showMSG', Msg, '', '');
    //window.location.href = 'PayrollHistory';
}

function CheckClearingAccount() {
    $.ajax({
        url: APIUrlCheckClearingAccount + '?PayrollFileID=' + PayrollLoadID + '&ProdId=' + localStorage.ProdId,
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
            $('#dvWait').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

            hideDiv('dvInvoice');
            var Msg = 'Labor & Fringe Clearing Account not Set for This Company. Please Set Clearing Account First !!';
            ShowMsgBox('showMSG', Msg, '', 'failuremsg');
            $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        } else if ((response[0].LACCOUNT == 'ERROR') && (response[0].FACCOUNT == 'OK')) {
            $('#dvWait').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

            hideDiv('dvInvoice');
            var Msg = 'Labor Clearing Account not Set for This Company. Please Set Labor Clearing Account First !!';
            ShowMsgBox('showMSG', Msg, '', 'failuremsg');
            $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        } else if ((response[0].LACCOUNT == 'OK') && (response[0].FACCOUNT == 'ERROR')) {
            $('#dvWait').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

            hideDiv('dvInvoice');
            var Msg = 'Fringe Clearing Account not Set for This Company. Please Set Fringe Clearing Account First !!';
            ShowMsgBox('showMSG', Msg, '', 'failuremsg');
            $('#dvWait1').attr('style', 'display: none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        } else if ((response[0].LACCOUNT == 'OK') && (response[0].FACCOUNT == 'OK')) {
            funCheckPayrollFileValidation();
        }
    }
}


function FillDefault(CID) {
    var Mode = 1;
    $.ajax({
        url: APIUrlFillDefault + '?CID=' + CID + '&ProdID=' + localStorage.ProdId + '&Mode=' + Mode,
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
    }
}



$('#tblPayrollLoad').delegate('.Location', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('.Location_' + stval).length > 0) {
            $('.Location_' + stval).select();
        }
    } else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('.Location_' + stval).length > 0) {
            $('.Location_' + stval).select();
        }

    }

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
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('.Detail_' + stval).length > 0) {
            $('.Detail_' + stval).select();
        }


    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('.Detail_' + stval).length > 0) {
            $('.Detail_' + stval).select();
        }

    }

})


$('#tblPayrollLoad').delegate('.Set', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('.Set_' + stval).length > 0) {
            $('.Set_' + stval).select();
        }


    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('.Set_' + stval).length > 0) {
            $('.Set_' + stval).select();
        }

    }

})


$('#tblPayrollLoad').delegate('.Series', 'keydown', function (event) {
    var key = event.which || event.keyCode;

    if (event.which === 38) {
        var stval = $(this).closest('tr').prev().attr('id');

        if ($('.Series_' + stval).length > 0) {
            $('.Series_' + stval).select();
        }
    }
    else if (event.which === 40) {
        var stval = $(this).closest('tr').next().attr('id');

        if ($('.Series_' + stval).length > 0) {
            $('.Series_' + stval).select();
        }
    }
})



function CheckFreezePeriodJE() {
    var Period = PeriodStatus($('#ddlClosePeriod').val());
    $.ajax({
        url: APIUrlCheckClosePeriodStatus + '?CompanyID=' + PFID + '&Period=' + Period,
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
    }
    else {
        GenerateJE();
    }
}


/*
1. CheckFreezePeriodInvoice
2. GenerateInvoice
3. CheckClearingAccount
4. funCheckPayrollFileValidation
5. PayrollTransactionDate('Post')
6. funSaveData1
7. SaveInvoiceAndJE or SaveJE

*/
function CheckFreezePeriodInvoice() {
    var Period = $('select#ddlPeriod option:selected').val();
    $.ajax({
        url: APIUrlCheckClosePeriodStatus + '?CompanyID=' + PFID + '&Period=' + Period,
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
    } else {
        GenerateInvoice();
    }
}


function JERedirect() {
    window.location.href = 'PayrollHistory';
}


function InvRedirect() {
    window.location.href = 'PayrollHistory';
}