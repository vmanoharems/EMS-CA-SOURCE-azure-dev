var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlGetInvoiceList = HOST + "/api/AccountPayableOp/GetInvoiceListForPaymentNew";
var APIUrlGetCheckNumber = HOST + "/api/POInvoice/GetCheckNumberForPayment";
var APIUrlSavePayment = HOST + "/api/AccountPayableOp/SavePayment";
var APIUrlGetCheckRun = HOST + "/api/AccountPayableOp/GetCheckRun";
var APIUrlGetGetCheckData = HOST + "/api/AccountPayableOp/GetCheckPreview";
var APIUrlJECheckRun = HOST + "/api/AccountPayableOp/JournalEntryPayment";
var APIUrlCompleteCheckRun = HOST + "/api/AccountPayableOp/ComplateCheckRun";
var APIUrlVerifyCheck = HOST + "/api/AccountPayableOp/GetVerifyCheck";
var APIUrlCheckVerification = HOST + "/api/AccountPayableOp/VerifiedCheckEntry";
var APIUrlCheckForOpenRunCheck = HOST + "/api/AccountPayableOp/CheckForOpenRunCheck";
var APIUrlEditCheckNumber = HOST + "/api/AccountPayableOp/EditCheckNumber";
var APIUrlGetStartingCheckNumber = HOST + "/api/AccountPayableOp/GetStartingCheckNumber";
var APIUrlCancelCheckRun = HOST + "/api/AccountPayableOp/CancelCheckRun";
var APIUrlGenerateCheckPDF = HOST + "/api/AccountPayableOp/GenerateCheckPDF";
var APIUrlGenerateCheckPDFCopies = HOST + "/api/AccountPayableOp/GenerateCheckPDFCopies";

var APIUrlInsertCheckRunByUser = HOST + "/api/AccountPayableOp/InsertCheckRunByUser";
var APIUrlCancelCheckRunByUser = HOST + "/api/AccountPayableOp/CancelCheckRunByUser";
var APIUrlCheckWTNo = HOST + "/api/AccountPayableOp/CheckWTNo";

var GetDate = '';
var CheckBankID = [];
var StrCheckNumber = 0;
var strTempCheck = 0;
var strArrDetail = [];
var G_BankIDD;
var PublicCheckRunID = 0;
var G_CCODE;
var PaymentIDs;
var VerifiedCheckIDs = '';
var VerifiedPaymentIDs = '';
var PIDAgain = '';
var GlobalCheckList = '';
var CheckGroupNo = '';
var GlobalTodayDate = '';
var EndCheckStore = '';
var BankStartingCheckNo = '';
var CheckNoList = '';
var NewGlobalList = '';
var PublicCheckedPID;
var IsPrintBtn = '';
var PrintCopies = 'NO';
var NoOfInvoices = 0;

var G_FilterParameter;
var G_PaymentType;

$(document).ready(function () {
    G_FilterParameter = JSON.parse(localStorage.CheckCycleTemp);
    G_BankIDD = G_FilterParameter.hdnBank;//arr[1];
    G_CCODE = G_FilterParameter.CO;//arr[0];
    G_FilterParameter.ProdID = localStorage.ProdId;
    G_PaymentType = G_FilterParameter.ddlPaymentType;
    if (G_PaymentType.toUpperCase() !== 'CHECK') {
        $('#dvCheckNo_CheckDetails').hide();
    }

    let objConfig = new AtlasConfig();
    objConfig.ConfigGet('Settings.Banks.PaymentTypes.List', function (response) {
        AtlasForms.Controls.DropDown.RenderData(
            JSON.parse(response.ConfigJSON),
            {
                domID: 'ddlPaymentType',
                mapping: { label: (l) => { return l; }, value: (v) => { return v; } },
                existingValue: G_PaymentType
            }
        );
    })

    BatchManager.ForceBatch(BatchManager.BatchNumber);

    $('#dvDate').removeClass('displayNone');
    IsPrintBtn = '';
    $('#btnPrint').attr('style', 'display:none;');
    $('#dvCheckType').attr('style', 'display:block;');
    //PublicCheckRunID = 0;
    $('#spanCTitle').attr('style', 'display:block;');
    $('#btnPrintCopies').addClass('disabled');

    if (localStorage.CheckCycleTemp == '') {
        window.location.href = "CheckCycle";
    } else {
        $('#UlAccountPayable li').removeClass('active');
        $('#LiCheckCycle').addClass('active');
    }

    CheckCheckRunStatusForUser();

    $(".NumberOnly").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    var heightt = $(window).height();
    heightt = heightt - 260;

    $('.fixed-table-container-inner').attr('style', 'height:' + heightt + 'px;');
});

function GetInvoiceList() {
    //var arr = FilterParameter.split('|');
    $('#SpnBankName').html(G_FilterParameter.txtBankName);

    $.ajax({
        url: APIUrlGetInvoiceList// + '?prodId=' + localStorage.ProdId + '&BankId=' + arr[1] + '&CompanyCode=' + arr[0] + '&VendorID=' + arr[2] + '&InvDate1=' + arr[3] + '&InvDate2=' + arr[4] + '&Period=' + arr[6],
        , data: {
            callPayload: JSON.stringify(G_FilterParameter)
        }
        , cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8' //'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetInvoiceListSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetInvoiceListSucess(response) {
    var strHtml = '';
    NoOfInvoices = response.length;
    let thePaymentType = G_FilterParameter.ddlPaymentType.toUpperCase();
    if (thePaymentType === 'CHECK') $('#tblthCheckNumber').addClass('displayNone')

    if (NoOfInvoices > 0) {
        for (var i = 0; i < response.length; i++) {
            strHtml += '<tr>';
            strHtml += '<td><input type="checkBox" class="clsInvoiceId" id="chk_' + i + '" vendorId=' + response[i].VendorID + '  name="' + response[i].Invoiceid + '" onchange="javascript:AsignCheckNumber(' + i + ');"></td>';
            strHtml += '<td><span class="clsVendor_' + response[i].VendorID + '" id="' + i + '" attr="' + response[i].VendorID + '">' + response[i].VendorName + '</span></td>';
            strHtml += `<td class="${(thePaymentType === 'CHECK') ? 'displayNone' : ''} CheckChangeType"><input type="text" id="CheckNoW_${i}" value="${response[i].CheckNumber || ''}"/></td>`;
            strHtml += '<td>' + response[i].InvoiceNumber + '</td>';
            strHtml += `<td><u><a href="#" style="color: #337ab7;" onclick="funGroup(${i});"><span id="spn_${i}">${response[i].CheckGroupnumber}</span><input type="text" id="txt_${i}" class="w30N" style="display:none;" onblur="javascript: funTextblur(${i});"></a></u></td>`;
            strHtml += '<td>' + response[i].InvoiceDate + '</td>';
            strHtml += '<td><a href="#" ><input type"text" disabled id="txtDate_' + i + '" class="datepicker dtCls" onclick="funGetDate();"value="' + GlobalTodayDate + '" style="width:43%;" /></td>';

            var strAmount = parseFloat(response[i].OriginalAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            strHtml += '<td><span id="spnPL_' + i + '" class="" name="' + i + '"></span><span class="clsAmount" id="SpnAmount_' + i + '">$' + strAmount + '</span><input type="hidden" id="CheckNo_' + i + '"/></td>';
            strHtml += '</tr>';
        }
    } else {
        strHtml += '<tr><td colspan="7" style="text-align:center;">No Invoices Found !!</td></tr>';
    }
    $('#tblInvoiceListTBody').html(strHtml);

    let tableheight = window.innerHeight - 300;

    var table = $('#tblInvList').DataTable({
        "dom": 'C<"clear"><Rrt<"positionFixed"pli>>',

        "iDisplayLength": 9999999,
        responsive: {
            details: {
            }
        }
        , scrollY: tableheight
        ,
        columnDefs: [{
            className: 'controlhh',
            orderable: false,
            targets: 0,
        }],
        order: [1, 'asc']
    });

    table.columns().eq(0).each(function (colIdx) {
        $('input', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
        $('select', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });
    $('#tblInvList_paginate').attr('style', 'display:none;');
    $(".datepicker").datepicker();
    GetCheckNumber();
}

function GetCheckNumber() {
    $.ajax({
        url: APIUrlGetCheckNumber + '?BankId=' + BankIDD + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetCheckNumberSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetCheckNumberSucess(response) {
    StrCheckNumber = response;
}

function funCheckAll() {
    if ($('#txtDate_1').val() == '') {
        $('#chkInvoiceList').prop('checked', false);
        alert('Please Enter Date First.');
        $('#txtPaymentDate').focus();
    } else {
        var ReturnResult = '';
        ReturnResult = 0;

        var strcheckBox = $('.clsInvoiceId');
        var strval = true;
        if ($('#chkInvoiceList').is(':checked')) {
            strval = true;

            for (var i = 0; i < strcheckBox.length; i++) {
                var strId = strcheckBox[i].id;
                if (strval == true) {
                    $('#' + strId).prop('checked', true);
                }
                else {
                    $('#' + strId).prop('checked', false);
                }
            }
            var CheckTypeN = $('select#ddlPaymentType option:selected').val();
            if ((CheckTypeN == 'Wire Check') || ((CheckTypeN == 'Manual Check'))) {
                ReturnResult = CheckALLCheckNOO();
            }
        } else {
            strval = false;
        }
        if (ReturnResult == 0) {
            for (var i = 0; i < strcheckBox.length; i++) {
                var strId = strcheckBox[i].id;
                if (strval == true) {
                    $('#' + strId).prop('checked', true);
                } else {
                    $('#' + strId).prop('checked', false);
                }
            }
            AsignCheckNumber(1);
        } else if (ReturnResult == 1) {
            strval = false;
            for (var i = 0; i < strcheckBox.length; i++) {
                var strId = strcheckBox[i].id;
                if (strval == true) {
                    $('#' + strId).prop('checked', true);
                } else {
                    $('#' + strId).prop('checked', false);
                }
            }
            $('#chkInvoiceList').prop('checked', false);
            alert('You may only pay a single Group with this payment type');
        } else if (ReturnResult == 2) {
            strval = false;
            for (var i = 0; i < strcheckBox.length; i++) {
                var strId = strcheckBox[i].id;
                if (strval == true) {
                    $('#' + strId).prop('checked', true);
                } else {
                    $('#' + strId).prop('checked', false);
                }
            }
        }
    }
}

function CheckALLCheckNOO() {
    var GlobalCheckList1 = "";
    var CheckGroupNo1 = "";

    var Tcount = $('#tblInvoiceListTBody tr').length;
    for (var i = 0; i < Tcount; i++) {
        if ($('#chk_' + i).prop('checked') == true) {
            if (strArrDetail.length == 0) {
                var VendorId = $('#chk_' + i).attr('VendorId');
                GlobalCheckList1 = GlobalCheckList1 + VendorId + '|';
                var GroupNumber = $('#spn_' + i).text();
                CheckGroupNo1 = CheckGroupNo1 + GroupNumber + '|';
            }
        }
    }

    var Checkk = '';
    var Checkk1 = '';
    var listt = GlobalCheckList1.slice(0, -1).split('|');
    for (var i = 0; i < listt.length; i++) {
        for (var j = 0 ; j < listt.length ; j++) {
            if (listt[i] == listt[j]) {
            } else if (listt[i] == undefined) {
            } else {
                Checkk = '1';
                break;
            }
        }
    }

    if (Checkk == '') {
        var listt1 = CheckGroupNo1.slice(0, -1).split('|');
        for (var i = 0; i < listt1.length; i++) {
            for (var j = 0 ; j < listt1.length; j++) {
                if (listt1[i] == listt1[j]) {
                } else if (listt1[i] == undefined) {
                } else {
                    Checkk1 = '1';
                    break;
                }
            }
        }

        if (Checkk1 == '') {
            return 0;
        } else {
            return 1;
        }
    } else {
        return 2;
    }
}

function funGroup(value) {
    var strval = $('#spn_' + value).text();
    $('#spn_' + value).hide();
    $('#txt_' + value).val(strval);
    $('#txt_' + value).show();
    $('#txt_' + value).focus();
}

function funTextblur(value) {
    var strval = $('#txt_' + value).val();
    $('#txt_' + value).hide();
    $('#spn_' + value).show();
    if (strval == '') {
        $('#spn_' + value).text(0);
    } else {
        $('#spn_' + value).text(strval);
    }
    AsignCheckNumber(value);
}

function AsignCheckNumber(ID) {
    if ($('#txtDate_' + ID).val() == '') {
        $('#chk_' + ID).prop('checked', false);
        alert('Please Enter Date First.');
        $('#txtPaymentDate').focus();
    } else {

        $('#SpnCheckNumberStart').text('');
        $('#SpnTo').text('');
        $('#SpnCheckNumberEnd').text('');
        EndCheckStore = '';
        var ReturnResult = '';
        ReturnResult = 0;
        var GrpWithCheckNo = '';
        var CheckTypeN = $('select#ddlPaymentType option:selected').val();
        if ((CheckTypeN == 'Wire Check') || ((CheckTypeN == 'Manual Check'))) {
            if ($('#chk_' + ID).prop('checked') == true) {
                var VendorId1 = $('#chk_' + ID).attr('VendorId');
                var GroupNumber1 = $('#spn_' + ID).text();
                ReturnResult = Verification(VendorId1, GroupNumber1, ID);
            }
        }

        if (ReturnResult == 0) {
            GlobalCheckList = '';
            CheckGroupNo = '';
            var OldVID = '';
            var OldGrpID = '';
            var OldVIDCont = '';
            var OldGrpCont = ''
            strArrDetail = [];
            strTempCheck = 0;
            // var Tcount = $('#tblInvoiceListTBody tr').length;
            var Tcount = NoOfInvoices;
            for (var i = 0; i < Tcount; i++) {
                if ($('#chk_' + i).prop('checked') == true) {
                    if (strArrDetail.length == 0) {
                        strTempCheck = StrCheckNumber;
                        $('#CheckNo_' + i).val(strTempCheck);
                        var VendorId = $('#chk_' + i).attr('VendorId');
                        GlobalCheckList = GlobalCheckList + VendorId + '|';
                        var GroupNumber = $('#spn_' + i).text();
                        CheckGroupNo = CheckGroupNo + GroupNumber + '|';
                        var obj = {
                            sVendorId: VendorId,
                            sGroup: GroupNumber,
                            sCheckNumber: strTempCheck,
                            sRowNo: i
                        }
                        strArrDetail.push(obj);

                        OldVID = VendorId;
                        OldGrpID = GroupNumber;
                        OldGrpCont = GroupNumber;

                        $('#spnPL_' + i).removeClass('');
                        $('#spnPL_' + i).addClass('cls' + i);

                        GrpWithCheckNo = GroupNumber + ',' + strTempCheck;
                    } else {
                        var sTcount = strArrDetail.length;
                        var VendorId = $('#chk_' + i).attr('VendorId');
                        var GroupNumber = $('#spn_' + i).text();
                        GlobalCheckList = GlobalCheckList + VendorId + '|';
                        if (OldVID == VendorId) {
                            // OldGrpCont = OldGrpCont + '|' + GroupNumber;
                        } else {
                            OldGrpCont = '';
                            OldGrpCont = GroupNumber;
                            GrpWithCheckNo = "";
                        }

                        if ((OldVID == VendorId) && (OldGrpID == GroupNumber)) {
                        } else {
                            if (OldGrpCont.length == 1) {
                                strTempCheck++;
                                GrpWithCheckNo += "|" + GroupNumber + ',' + strTempCheck;
                            } else {
                                var CheckgrpAgain = '';
                                var arr = OldGrpCont.split('|');
                                for (var s = 0; s < arr.length; s++) {
                                    if (GroupNumber == arr[s]) {
                                        CheckgrpAgain = 'OK'
                                    }
                                }
                                if (CheckgrpAgain == 'OK')
                                { }
                                else
                                {
                                    strTempCheck++;
                                }
                            }
                        }

                        if (OldVID == VendorId) {
                            OldGrpCont = OldGrpCont + '|' + GroupNumber;
                        }

                        OldVID = VendorId;
                        OldGrpID = GroupNumber;

                        var NewCC = '';
                        var arr1 = GrpWithCheckNo.split('|');
                        for (var s = 0; s < arr1.length; s++) {
                            var arr2 = arr1[s].split(',');
                            if (GroupNumber == arr2[0]) {
                                NewCC = 'OK'
                                $('#CheckNo_' + i).val(arr2[1]);
                            }
                        }

                        if (NewCC == 'OK') {
                            NewCC = ''
                        } else {
                            $('#CheckNo_' + i).val(strTempCheck);
                        }

                        var VendorId = $('#chk_' + i).attr('VendorId');
                        var GroupNumber = $('#spn_' + i).text();
                        CheckGroupNo = CheckGroupNo + GroupNumber + '|';

                        var obj = {
                            sVendorId: VendorId,
                            sGroup: GroupNumber,
                            sCheckNumber: strTempCheck,
                            sRowNo: i
                        }
                        strArrDetail.push(obj);
                        $('#spnPL_' + i).removeClass('');
                        $('#spnPL_' + i).addClass('cls' + i);
                    }
                } else {
                    $('#chkInvoiceList').prop('checked', false);
                }
            }
            if (StrCheckNumber == strTempCheck) {
                $('#SpnCheckNumberStart').text(StrCheckNumber);
            } else if (strTempCheck == 0) {
                $('#SpnCheckNumberStart').text('');
                $('#SpnTo').text('');
                $('#SpnCheckNumberEnd').text('');
            } else {
                $('#SpnCheckNumberStart').text(StrCheckNumber);
                $('#SpnTo').text(' To ');
                $('#SpnCheckNumberEnd').text(strTempCheck);
                EndCheckStore = parseInt(strTempCheck) - parseInt(StrCheckNumber);
            }
        } else if (ReturnResult == 1) {
            alert('You may only pay a single Group with this payment type');
        } else if (ReturnResult == 2) {
            alert(' You may only pay a single Vendor with this payment type');
        }
    }
}

function funPostChecks() {
    var ArrPayment = [];
    var ArrPaymentLine = [];
    var Tcount = strArrDetail.length;
    for (var i = 0; i < Tcount; i++) {
        var RowNo = strArrDetail[i].sRowNo;
        var LineCount = $('.cls' + RowNo);

        for (var j = 0; j < LineCount.length; j++) {
            var strId = LineCount[j].id;
            var strRowId = $('#' + strId).attr('name');

            var CheckType = $('select#ddlPaymentType option:selected').val();
            if ((CheckType == 'Wire Check') || ((CheckType == 'Manual Check'))) {
                var objPaymentLine = {
                    InvoiceID: $('#chk_' + strRowId).attr('name'),
                    BatchNumber: BatchManager.BatchNumber,
                    GroupNumber: $('#spn_' + strRowId).html(),
                    CheckDate: $('#txtDate_' + strRowId).val(),
                    CheckNumber: $('#CheckNoW_' + strRowId).val(),
                    BankID: BankIDD,
                    PayBy: $('select#ddlPaymentType option:selected').val(),
                    PaymentDate: $('#txtPaymentDate').val(),
                    CreatedBy: localStorage.UserId,
                    ProdID: localStorage.ProdId,
                    CheckRunID: PublicCheckRunID
                }
                ArrPaymentLine.push(objPaymentLine);
            } else {
                var objPaymentLine = {
                    InvoiceID: $('#chk_' + strRowId).attr('name'),
                    BatchNumber: BatchManager.BatchNumber,
                    GroupNumber: $('#spn_' + strRowId).html(),
                    CheckDate: $('#txtDate_' + strRowId).val(),
                    CheckNumber: $('#CheckNo_' + strRowId).val(),
                    BankID: BankIDD,
                    PayBy: $('select#ddlPaymentType option:selected').val(),
                    PaymentDate: $('#txtPaymentDate').val(),
                    CreatedBy: localStorage.UserId,
                    ProdID: localStorage.ProdId,
                    CheckRunID: PublicCheckRunID
                }
                ArrPaymentLine.push(objPaymentLine);
            }
        }
    }

    var FinalObj = { ObjPayment: ArrPaymentLine }

    $.ajax({
        url: APIUrlSavePayment,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(FinalObj),
    })
    .done(function (response) {
        PostChecksSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function PostChecksSucess(response) {
    PublicCheckedPID = response;
    if (/-1/.test(PublicCheckedPID)) {
        // One of the Payments is invalid
        $('#spnMsg').html('At least one of the check numbers you supplied is already in use. Check numbers already in use will be removed from your list.');
        $('#dvNotification').show();
        $('#fade').show();
        setTimeout(function () { $("#NotificationOK").focus(); }, 100); // wait for Chrome to set focus properly
    }
    // GetInvoiceList();
    GetCheckData();
}

//------------------------------------Show  Error 
function ShowMSG(error) {
    console.log(error);
}

function GetCheckRun() {
    $('#spanCTitle').attr('style', 'display:none;');
    $('#btnPreview').attr('style', 'display:none;');
    $('#btnEditCriteria').attr('style', 'display:none;');
    $('#btnCancelCheckRun').removeClass('displayNone');

    $.ajax({
        url: APIUrlGetCheckRun + '?ProdID=' + localStorage.ProdId + '&BankID=' + G_BankIDD + '&UserID=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetCheckRunSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetCheckRunSucess(response) {
    PublicCheckRunID = response;
    var CheckRunDisplay = ShowCheckRun(PublicCheckRunID);
    $('#spanCheckRun').html(CheckRunDisplay);
    $('#liCheckRun').removeClass('displayNone');
    funPostChecks(); // This must be here because the ajax calls are not chained properly such that the PublicCheckRunID value is not available until this Success call

    $('#dvPreview').removeClass('displayNone');
    $('#dvFilter').addClass('displayNone');

    $('#btnPrint').attr('style', 'display:block;');
    $('#btnPrintDirect').attr('style', 'display:none;');
    $('#liCheckRun').show()
}

function ShowCheckRun(PublicCheckRunID) {
    var ReturnVal;
    if (PublicCheckRunID.length = 1) {
        ReturnVal = '#0000' + PublicCheckRunID;
    } else if (PublicCheckRunID.length = 2) {
        ReturnVal = '#000' + PublicCheckRunID;
    } else if (PublicCheckRunID.length = 3) {
        ReturnVal = '#00' + PublicCheckRunID;
    }

    return ReturnVal;
}

function PreviewTab1() {
    IsPrintBtn = 'OK';
    PreviewTab();
}

function CheckWTNumber() {
    var WTList = '';
    var Tcount = NoOfInvoices;
    let isMissingCheckNumbers = false;

    for (var i = 0; i < Tcount; i++) {
        if ($('#chk_' + i).prop('checked') == true) {
            var CheckWTNo = $('#CheckNoW_' + i).val();
            WTList += CheckWTNo + ',';

            if ($('#CheckNoW_' + i).val() == '') {
                isMissingCheckNumbers = true;
                break;
            }
        }
    }

    if (isMissingCheckNumbers) {
        $('#spanErrorMsg').html('Invalid Check Number!');
        $('#dvError').attr('style', 'display:block;');
        return;
    }
    var CheckType = $('select#ddlPaymentType option:selected').val();

    $.ajax({
        url: APIUrlCheckWTNo + '?WTList=' + WTList + '&BankID=' + BankIDD + '&ProdID=' + localStorage.ProdId + '&CheckType=' + CheckType,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CheckWTNumberSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function CheckWTNumberSucess(response) {
    if (response.length == 0) {
        IsPrintBtn = 'OK';
        PreviewTab();
    } else {
        var CheckStatusAlert = '';
        for (var i = 0; i < response.length; i++) {
            CheckStatusAlert += response[i].CheckNumber + ' , '
        }
        $('#spanErrorMsg').html(CheckStatusAlert + ' CheckNumber is already in use!');
        $('#dvError').attr('style', 'display:block;');
    }
}

function PreviewTabNew() {
    var CheckType = $('select#ddlPaymentType option:selected').val();

    if (CheckType == 'Check') {
        PreviewTab();
    } else {
        CheckWTNumber();
    }
}

function PreviewTab() {
    if ($('#txtPaymentDate').val() == '') {
        alert('Please Enter Payment Date.');
        $('#txtPaymentDate').focus();
    } else {
        if ($('#SpnCheckNumberStart').text() != '') {
            $('#dvDate').addClass('displayNone');
            var CheckType = $('select#ddlPaymentType option:selected').val();
            if ((CheckType == 'Wire Check') || ((CheckType == 'Manual Check'))) {
                var Checkk = '';
                var Checkk1 = '';
                var listt = GlobalCheckList.slice(0, -1).split('|');
                for (var i = 0; i < listt.length; i++) {
                    for (var j = 0 ; j < listt.length ; j++) {
                        if (listt[i] == listt[j]) {
                        } else if (listt[i] == undefined) {
                        } else {
                            Checkk = '1';
                            break;
                        }
                    }
                }

                if (Checkk == '') {
                    var listt1 = CheckGroupNo.slice(0, -1).split('|');
                    for (var i = 0; i < listt1.length; i++) {
                        for (var j = 0 ; j < listt1.length; j++) {
                            if (listt1[i] == listt1[j]) {
                            } else if (listt1[i] == undefined) {
                            } else {
                                Checkk1 = '1';
                                break;
                            }
                        }
                    }

                    if (Checkk1 == '') {
                        $('#SpnCheckNumberStart').text('');
                        $('#SpnTo').text('');
                        $('#SpnCheckNumberEnd').text('');
                        GetCheckRun(); // <<< funPostChecks() is in GetCheckRunSuccess, which is not ideal
                    } else {
                        alert('You may only pay a single Group with this payment type');
                    }
                } else {
                    //alert(' You may only pay a single Vendor with this payment type');
                }
            } else {
                $('#SpnCheckNumberStart').text('');
                $('#SpnTo').text('');
                $('#SpnCheckNumberEnd').text('');
                GetCheckRun(); // <<< funPostChecks() is in GetCheckRunSuccess, which is not ideal
                $('#dvCheckType').attr('style', 'display:none;');
            }
        } else {
            alert('Please Select Invoice from List , before you proceed.');
        }
    }
}

function GetCheckData() {
    $.ajax({
        url: APIUrlGetGetCheckData + '?CheckRunID=' + PublicCheckRunID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetCheckDataSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetCheckDataSucess(response) {
    var strHtml = '';
    for (var i = 0; i < response.length; i++) {
        strHtml += '<tr>';
        strHtml += '<td>';
        if (response[i].Status == 'Printed') {
            strHtml += 'Accepted';
        } else if (response[i].Status == 'Cancelled') {
            strHtml += 'Cancelled';
        } else if (response[i].Status == 'Issued') {
            strHtml += '<input checked type="checkBox" onChange="javascript:PrintSelected(' + response[i].PaymentId + ');" class="clsPreview" id="chkPreview_' + response[i].PaymentId + '" name=' + response[i].CheckNumber + '>';
        } else {
            strHtml += response[i].Status;
        }

        strHtml += '</td>';
        strHtml += '<td>' + response[i].CheckNumber + '</td>';
        strHtml += '<td>' + response[i].CheckDate + '</td>';
        strHtml += '<td>' + response[i].VendorName + '</td>';
        strHtml += '<td>' + response[i].LineItems + '</td>';
        strHtml += '<td>$' + parseFloat(response[i].PaidAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
        //strHtml += '<td>' + response[i].Status + '</td>';
        strHtml += '</tr>';
    }
    $('#tblPreviewTBody').html(strHtml);

    if (IsPrintBtn == 'OK') {
        var data = PublicCheckedPID;
        var arr = data.split(',');
        for (var k = 0; k < arr.length; k++) {
            $('#chkPreview_' + arr[k]).prop('checked', true);
        }
        PrintCheck();
    }
}

function PrintCheck() {
    var PrintPaymentID = '';
    var CheckNos = '';
    var CheckNos1 = '';
    var LineCount = $('.clsPreview');
    for (var j = 0; j < LineCount.length; j++) {
        var strId = LineCount[j].id;
        var strRowId = $('#' + strId).attr("name");

        if ($('#' + strId).prop("checked") == true) {
            PrintPaymentID += ',' + strId.replace("chkPreview_", "");
            CheckNos += ',' + strRowId;
            CheckNos1 += ',' + strId.replace('chkP_', '').replace('chkPreview_', '');
        }
    }

    $('#dvVerifiedPreview').addClass('displayNone');
    PaymentIDs = PrintPaymentID;
    if (PrintPaymentID == '') {
        alert('Please Select Atleast 1 check to Print.');
    } else {
        $('#btnCancelCheckRun').addClass('displayNone');
        $('#dvWait').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
        //$('.clsPreview').prop('checked', false);
        var result = CheckNos.substring(1, CheckNos.length);
        var result1 = CheckNos1.substring(1, CheckNos1.length);

        result = result.split(',').filter((v, i, a) => { return a.indexOf(v) === i })
        result1 = result1.split(',').filter((v, i, a) => { return a.indexOf(v) === i })
        PDF(result1, BankIDD, PublicCheckRunID);
        // $('#dvPrint').attr('style', 'display:block;');
    }
}

function VerifyCheck(pdfUrl) {
    debugger
    console.log('Verify Check with: ' + pdfUrl);

    $('#dialog').dialog('close');
    if (PrintCopies == 'NO') {
        $('#dvVerifyCheck').attr('style', 'display:block;');
    } else {
        CompleteCheckRun();
        $('#dvPrintExit').attr('style', 'display:block;');
    }

    var w = window.open(pdfUrl);
    w.print();
}

function ReturnPrint() {
    $('#dvPrint').attr('style', 'display:block;');
    $('#dvVerifyCheck').attr('style', 'display:none;');    
}

function PrintCheckCopies() {
    var PrintCheckRun = ShowCheckRun(PublicCheckRunID);
    $('.spanCheckRunCopies').html(PrintCheckRun);
    $('#dvPrintingChecksCopies').attr('style', 'display:block');
    $('#dvVerifyCheck').attr('style', 'display:none;');
}

function PrintExit() {
    $('#dvPrintExit').attr('style', 'display:block;');
    $('#dvPrintingChecksCopies').attr('style', 'display:none;');
}

function CheckRunJE() {
    var ArrPayment = [];
    var PaymentID = PaymentIDs.substring(1, PaymentIDs.length);
    var arr = PaymentID.split(',');
    var Tcount = arr.length;
    $('.spanCheckCnt').html(Tcount);
    for (var i = 0; i < Tcount; i++) {
        let isnotnumber = arr[i].split('_')[1]; // Something is setting the array to chkP_#####
        isnotnumber = (isnotnumber === undefined) ? arr[i] : isnotnumber;

        var objCheckRunJE = {
            PaymentID: isnotnumber,
            ProdID: localStorage.ProdId,
            UserID: localStorage.UserId,
            CompanyCode: G_CCODE,
            BatchNumber: BatchManager.BatchNumber
        }
        ArrPayment.push(objCheckRunJE);
    }

    $.ajax({
        url: APIUrlJECheckRun,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(ArrPayment),
    })
    .done(function (response) {
        CheckRunJESucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function CheckRunJESucess(response) {
    PrintCheckCopies();
    // PrintExit();
}

function CompleteCheckRun() {
    $.ajax({
        url: APIUrlCompleteCheckRun + '?CheckRunID=' + PublicCheckRunID + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CompleteCheckRunSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function CompleteCheckRunSucess(response) {
    //  CheckRunJE();
    PrintExit();
}

function PrintCheckCopies11() {
    ReturnPrint();
}

function GetVerifyCheck() {
    VerifiedCheckIDs = '';
    $('#dvVerifiedPreview').attr('style', 'display:none;');
    var PaymentIDD = PaymentIDs.substring(1, PaymentIDs.length);
    PaymentIDD = PaymentIDD.replace('|', ',');
    $.ajax({
        url: APIUrlVerifyCheck + '?BankID=' + BankIDD + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVerifyCheckSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetVerifyCheckSucess(response) {
    var strHtml = '';
    for (var i = 0; i < response.length; i++) {
        strHtml += '<tr>';
        strHtml += '<td class="VCls" id=' + response[i].PaymentId + '>';
        if (response[i].Status == 'Printed') {
            strHtml += '<input checked disabled style="float: left;margin: 5px;" type="checkBox" title="Accept" onClick="javascript:VerifyCheckA(' + response[i].PaymentId + ');"  id="chkA_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '<input disabled style="float: left;margin: 5px;" type="checkBox" title="Cancel" onClick="javascript:VerifyCheckC(' + response[i].PaymentId + ');" id="chkC_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '<input disabled style="float: left;margin: 5px;" type="checkBox" title="Reprint" onClick="javascript:VerifyCheckR(' + response[i].PaymentId + ');" id="chkR_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '</td>';
            strHtml += '<td>Accepted</td>';
        } else if (response[i].Status == 'Cancelled') {
            strHtml += '<input disabled style="float: left;margin: 5px;" type="checkBox" title="Accept" onClick="javascript:VerifyCheckA(' + response[i].PaymentId + ');"  id="chkA_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '<input checked disabled style="float: left;margin: 5px;" type="checkBox" title="Cancel" onClick="javascript:VerifyCheckC(' + response[i].PaymentId + ');" id="chkC_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '<input disabled style="float: left;margin: 5px;" type="checkBox" title="Reprint" onClick="javascript:VerifyCheckR(' + response[i].PaymentId + ');" id="chkR_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '</td>';
            strHtml += '<td>' + response[i].Status + '</td>';
        } else if (response[i].Status == 'Issued') {
            strHtml += '<input checked style="float: left;margin: 5px;" type="checkBox" title="Accept" onClick="javascript:VerifyCheckA(' + response[i].PaymentId + ');"  id="chkA_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '<input  style="float: left;margin: 5px;" type="checkBox" title="Cancel" onClick="javascript:VerifyCheckC(' + response[i].PaymentId + ');" id="chkC_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '<input  style="float: left;margin: 5px;" type="checkBox" title="Reprint" onClick="javascript:VerifyCheckR(' + response[i].PaymentId + ');" id="chkR_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '>';
            strHtml += '</td>';
            strHtml += '<td>' + response[i].Status + '</td>';
        }

        strHtml += '<td>' + response[i].CheckNumber + '</td>';
        strHtml += '<td>' + response[i].PaymentId + '</td>';
        strHtml += '<td>' + response[i].CheckDate + '</td>';
        strHtml += '<td>' + response[i].VendorName + '</td>';
        strHtml += '<td>$' + parseFloat(response[i].PaidAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';

        strHtml += '</tr>';
    }
    $('#tblVerifyTBody').html(strHtml);
    $('#dvPreview').addClass('displayNone');
    $('#dvVerify').removeClass('displayNone');
    $('.PrintCheck1').addClass('displayNone');
    $('.PrintCheck2').removeClass('displayNone');
}

function VerifyCheckA(PaymentID) {
    if ($('#chkA_' + PaymentID).is(':checked')) {
        $('#chkC_' + PaymentID).prop('checked', false);
        $('#chkR_' + PaymentID).prop('checked', false);
        //VerifiedCheckIDs = VerifiedCheckIDs.replace('2|' + PaymentID, '');
        //VerifiedCheckIDs = VerifiedCheckIDs.replace('3|' + PaymentID, '');
        //VerifiedCheckIDs = VerifiedCheckIDs.replace('4|' + PaymentID, '');
        //VerifiedCheckIDs = VerifiedCheckIDs + '1|' + PaymentID + ',';
    } else {
        //  VerifiedCheckIDs = VerifiedCheckIDs.replace('1|' + PaymentID, '');
    }
    // VerifiedCheckIDs = VerifiedCheckIDs.replace(',,', ',')
}

function VerifyCheckC(PaymentID) {
    if ($('#chkC_' + PaymentID).is(':checked')) {
        $('#chkA_' + PaymentID).prop('checked', false);
    }
}

function VerifyCheckR(PaymentID) {
    if ($('#chkR_' + PaymentID).is(':checked')) {
        $('#chkA_' + PaymentID).prop('checked', false);
        //$('#chkC_' + PaymentID).prop('checked', true);
        //    VerifiedCheckIDs = VerifiedCheckIDs.replace('1|' + PaymentID, '');
        //    if ($('#chkC_' + PaymentID).is(':checked')) {

        //        VerifiedCheckIDs = VerifiedCheckIDs.replace('2|' + PaymentID, '');
        //        VerifiedCheckIDs = VerifiedCheckIDs + '4|' + PaymentID + ',';


        //    }
        //    else {
        //        VerifiedCheckIDs = VerifiedCheckIDs + '3|' + PaymentID + ',';
        //    }

        //}
        //else {
        //    VerifiedCheckIDs = VerifiedCheckIDs.replace('3|' + PaymentID, '');
    }
    // VerifiedCheckIDs = VerifiedCheckIDs.replace(',,', ',')
}

function CheckVerification() {
    // VerifiedCheckIDs = VerifiedCheckIDs.replace(',,', ',')
    var CheckCCnt = 0;
    var ArrPayment = [];
    var LineCount = $('.VCls');
    for (var j = 0; j < LineCount.length; j++) {
        var strId = LineCount[j].id;
        var strRowId = $('#' + strId).attr("id");

        if ($('#chkA_' + strRowId).prop("checked") === true) {
            CheckCCnt++;

            var objCheckRunJE = {
                PaymentID: strRowId,
                Mode: 1,
                ProdID: localStorage.ProdId,
                UserID: localStorage.UserId,
                CompanyCode: G_CCODE,
                BatchNumber: BatchManager.BatchNumber
            }
            ArrPayment.push(objCheckRunJE);
        } else if (($('#chkC_' + strRowId).prop("checked") === true) && ($('#chkR_' + strRowId).prop("checked") === true)) {
            CheckCCnt++;

            var objCheckRunJE = {
                PaymentID: strRowId,
                Mode: 4,
                ProdID: localStorage.ProdId,
                UserID: localStorage.UserId,
                CompanyCode: G_CCODE,
                BatchNumber: BatchManager.BatchNumber
            }
            ArrPayment.push(objCheckRunJE);
        }
        else if ($('#chkC_' + strRowId).prop("checked") === true) {
            CheckCCnt++;

            var objCheckRunJE = {
                PaymentID: strRowId,
                Mode: 2,
                ProdID: localStorage.ProdId,
                UserID: localStorage.UserId,
                CompanyCode: G_CCODE,
                BatchNumber: BatchManager.BatchNumber
            }
            ArrPayment.push(objCheckRunJE);
        } else if ($('#chkR_' + strRowId).prop("checked") === true) {
            CheckCCnt++;

            var objCheckRunJE = {
                PaymentID: strRowId,
                Mode: 3,
                ProdID: localStorage.ProdId,
                UserID: localStorage.UserId,
                CompanyCode: G_CCODE,
                BatchNumber: BatchManager.BatchNumber
            }
            ArrPayment.push(objCheckRunJE);
        }
    }

    if (parseInt(CheckCCnt) > 0) {
        $('#dvVerify').addClass('displayNone');
        $('#dvVerifiedPreview').attr('style', 'display:block;');

        $.ajax({
            url: APIUrlCheckVerification,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ArrPayment),
        })
        .done(function (response) {
            CheckVerificationSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    } else {
        alert('Please Select Checks.');
    }
}

function CheckVerificationSucess(response) {
    GetVerifyPreview();
}

function GetVerifyPreview() {
    var PaymentIDD = VerifiedPaymentIDs.substring(0, VerifiedPaymentIDs.length - 1);

    $.ajax({
        url: APIUrlVerifyCheck + '?BankID=' + BankIDD + '&ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVerifyPreviewSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetVerifyPreviewSucess(response) {
    if (response.length > 0) {
        if (parseInt(response[0].ExitStatus) == 0) {
            $('#dvVerifiedPreview').attr('style', 'display: none;');
            CompleteCheckRun();
            $('#dvPrintExit').attr('style', 'display:block;');
        } else {
            var strHtml = '';
            for (var i = 0; i < response.length; i++) {
                strHtml += '<tr>';

                if (response[i].Status == 'Cancelled') {
                    strHtml += '<td><input disabled style="float: left;margin: 5px;" type="checkBox" onClick="javascript:VerifyCheckA(' + response[i].PaymentId + ');"  id="chkA_' + response[i].PaymentId + '" name=' + response[i].PaymentId + '></td>';

                    strHtml += '<td>Cancelled</td>';
                } else if (response[i].Status == 'Printed') {
                    strHtml += '<td><input disabled style="float: left;margin: 5px;" type="checkBox"></td>';

                    strHtml += '<td>Accepted</td>';
                } else {
                    strHtml += '<td><input style="float: left;margin: 5px;" type="checkBox" onClick="javascript:VerifyCheckP(' + response[i].PaymentId + ');" class="clsPreview" id="chkP_' + response[i].PaymentId + '" name=' + response[i].CheckNumber + '></td>';

                    strHtml += '<td>Issued</td>';
                }

                strHtml += '<td>' + response[i].CheckNumber + '</td>';
                strHtml += '<td>' + response[i].PaymentId + '</td>';
                strHtml += '<td>' + response[i].CheckDate + '</td>';
                strHtml += '<td>' + response[i].VendorName + '</td>';
                strHtml += '<td>$' + parseFloat(response[i].PaidAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
                strHtml += '</tr>';
            }
            $('#tblVerifiedPreviewTBody').html(strHtml);

            $('#dvVerifiedPreview').removeClass('displayNone');
            $('#dvVerify').addClass('displayNone');

            $('.PrintCheck1').removeClass('displayNone');
            $('.PrintCheck2').addClass('displayNone');

        }
    } else {
        $('#dvVerifiedPreview').attr('style', 'display: none;');

        $('#dvPrintExit').attr('style', 'display:block;');
    }
}

function VerifyCheckP(PID) {
    if ($('#chkP_' + PID).is(':checked')) {
        var strval = $('#chkP_' + PID).attr('name');
        PIDAgain += strval + ',';
    } else {
        var strval = $('#chkP_' + PID).attr('name');
        PIDAgain = PIDAgain.replace(strval, '').replace(',,', ',');
    }
}

function PrintCheckAgain() {
    if (PIDAgain == '') {
        alert('Please select alteast 1 check to continue..');
    } else {
        PaymentIDs = PIDAgain;
        $('#dvPrint').attr('style', 'display:block;');
    }
}

$('.content').mousemove(function () {
    $('.dtCls').val($('#txtPaymentDate').val());
})

function chkAllPreview() {
    if ($('#chkPreviewHead').is(':checked')) {
        $('.clsPreview').prop('checked', true);
    } else {
        $('.clsPreview').prop('checked', false);
    }
    PrintSelected(1);
}

function CheckCheckRunStatus() {
    //G_FilterParameter = JSON.parse(localStorage.CheckCycleTemp);
    //var arr = FilterParameter.split('|');
    //G_BankIDD = G_FilterParameter.hdnBank;// arr[1];

    $.ajax({
        url: APIUrlCheckForOpenRunCheck + '?BankID=' + G_BankIDD + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CheckCheckRunStatusSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function CheckCheckRunStatusSucess(response) {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;

    var curr_year = d.getFullYear();
    if (curr_date.toString().length == 1) {
        curr_date = '0' + curr_date;
    }

    if (curr_month.toString().length == 1) {
        curr_month = '0' + curr_month;
    }

    var Date1 = curr_month + '/' + curr_date + '/' + curr_year;

    GlobalTodayDate = Date1;
    $('#btnCancelCheckRun').removeClass('displayNone');
    $('#txtPaymentDate').val(Date1);

    if (response.length > 0) {
        if (response[0].UserID == localStorage.UserId) {
            if (response[0].JSONPayments !== null) {
                ResurrectCheckRun(response[0]);
                $('#dialog-previous-check-run').dialog({
                    modal: true,
                    title: "Please Complete Your Previous Check Run",
                    width: 640,
                    //height: 500,
                    draggable: false,
                    //dialogClass: "no-close",
                    closeOnEscape: true,
                    buttons: {
                        Close: function () {
                            $(this).dialog('close');
                        }
                    }
                });
                GetVerifyCheck();
                return;
            }
            $('#SpnBankName').html(response[0].Bankname);
            /*
            var FilterParameter = localStorage.CheckCycleTemp;
            var arr = FilterParameter.split('|');
            BankIDD = arr[1];
            CCODE = arr[0];
            */
            GetCheckRun(); // <<< funPostChecks() is in GetCheckRunSuccess, which is not ideal
        } else {
            $('#spanCheckRunUser').html(response[0].Name);
            $('#CheckRunWorking').attr('style', 'display:block;');
        }
    } else {
        GetInvoiceList();
    }
}

function ResurrectCheckRun(CheckForOpenRunCheck) {
    PaymentIDs = '';
    PublicCheckRunID = CheckForOpenRunCheck.CheckRunID;
    let A_Resurrection = [];
    let showACR = true; // Default to showing the ACR screen
    $('#SpnBankName').text(CheckForOpenRunCheck.Bankname);
    G_CCODE = JSON.parse(localStorage.CheckCycleTemp)["CO"]; //localStorage.CheckCycleTemp.split('|')[0];

    $('#dvFilter').hide();
    $('#btnEditCriteria').hide();
    $('#btnCancelCheckRun').hide();
    $('#dvDate').hide();
    $('#dvCheckNo_CheckDetails').hide();

    $('#dvCheckType').hide();

    JSON.parse(CheckForOpenRunCheck.JSONPayments).forEach((CR) => {
        //console.log(CR);
        CR.P.forEach((P) => {
            PaymentIDs += `|${P.PaymentID}`;
            if ($('#SpnCheckNumberStart').text() === '') $('#SpnCheckNumberStart').text(P.CheckNumber);
            if (P.CheckStatus.toUpperCase() !== 'ISSUED') showACR = false; // if any of the checks are a status other ISSUED, then show them the Process screen... MAYBE!
            P.PL.forEach((PL) => {
                let theobj = {
                    CheckRunID: CR.CheckRunID
                    , BatchNumber: BatchManager.BatchNumber
                    , ProdID: localStorage.ProdId
                    , CreatedBy: localStorage.UserId
                    , GroupNumber: P.GroupNumber
                    , CheckDate: P.CheckDate
                    , BankID: P.BankID
                    , PayBy: P.PayBy
                    , PaymentDate: P.PaymentDate
                };

                A_Resurrection.push(theobj);
                //console.log(theobj);
            })
        });
        //console.log(theobj);
    })
}

function PrintSelected(CheckNo) {
}

function PrintPDF(FileName) {
    let fileName = '';
    if (/Merge/.test(FileName)) {
        fileName = FileName + ".pdf"
    } else {
        fileName = "Merge" + FileName + ".pdf";
    }
    fileName = encodeURI(fileName);
    console.log('Call to PrintPDF with: ' + fileName);
    $("#dialog").dialog({
        modal: true,
        title: "Please print your check",
        width: 840,
        height: 500,
        draggable: false,
        dialogClass: "no-close",
        closeOnEscape: false,
        buttons: {
            Print: function () {
                if (/Merge/.test(fileName)) {
                    VerifyCheck(fileName);
                } else {
                    VerifyCheck(/CheckPDF/ + fileName);
                }
            }
        },
        open: function () {
            var object = "<object data=\"{FileName}\" type=\"application/pdf\" width=\"800px\" height=\"350px\">";
            object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
            object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
            object += "</object>";

            if (/Merge/.test(FileName)) {
                object = object.replace(/{FileName}/g, fileName);
            } else {
                object = object.replace(/{FileName}/g, /CheckPDF/ + fileName);
            }

            $("#dialog").html(object);
        }
    });
    $('#dvWait').attr('style', 'display:none;');
}

function CheckTypeStatus() {
    var Check1 = $('select#ddlPaymentType option:selected').val();

    if ((Check1 == 'Wire Check') || ((Check1 == 'Manual Check'))) {
        var Checkk = '';
        var Checkk1 = '';
        var listt = GlobalCheckList.slice(0, -1).split('|');
        for (var i = 0; i < listt.length; i++) {
            for (var j = 0 ; j < listt.length ; j++) {
                if (listt[i] == listt[j]) {
                } else if (listt[i] == undefined) {
                } else {
                    Checkk = '1';
                    break;
                }
            }
        }

        if (Checkk == '') {
            var listt1 = CheckGroupNo.slice(0, -1).split('|');
            for (var i = 0; i < listt1.length; i++) {
                for (var j = 0 ; j < listt1.length; j++) {
                    if (listt1[i] == listt1[j]) {
                    } else if (listt1[i] == undefined) {
                    } else {
                        Checkk1 = '1';
                        break;
                    }
                }
            }

            if (Checkk1 == '') {
                $('.CheckChangeType').removeClass('displayNone');
                $('#dvCheckNo_CheckDetails').addClass('displayNone');
            } else {
                //alert('You may only pay a single Group with this payment type');
                //$('#ddlType').val('Check');
            }
        } else {
            //alert(' You may only pay a single Vendor with this payment type');
            //$('#ddlType').val('Check');
        }
    } else {
        $('#dvCheckNo_CheckDetails').removeClass('displayNone');
        $('.CheckChangeType').addClass('displayNone');
    }
}

function Verification(VID, GID, ID) {
    var GlobalCheckList1 = GlobalCheckList + VID + "|";
    var CheckGroupNo1 = CheckGroupNo + GID + "|";

    var Checkk = '';
    var Checkk1 = '';
    var listt = GlobalCheckList1.slice(0, -1).split('|');
    for (var i = 0; i < listt.length; i++) {
        for (var j = 0 ; j < listt.length ; j++) {
            if (listt[i] == listt[j]) {
            } else if (listt[i] == undefined) {
            } else {
                Checkk = '1';
                break;
            }
        }
    }

    if (Checkk == '') {
        var listt1 = CheckGroupNo1.slice(0, -1).split('|');
        for (var i = 0; i < listt1.length; i++) {
            for (var j = 0 ; j < listt1.length; j++) {
                if (listt1[i] == listt1[j]) {
                } else if (listt1[i] == undefined) {
                } else {
                    Checkk1 = '1';
                    break;
                }
            }
        }

        if (Checkk1 == '') {
            return 0;
        } else {
            $('#chk_' + ID).prop('checked', false);
            return 1;
        }
    } else {
        $('#chk_' + ID).prop('checked', false);
        return 2;
    }
}

function ChangeStartingCheck() {
    $('#SpnCheckNumberStart').attr('style', 'display:none;');
    $('#txtCheckNumberStart').attr('style', 'display:block;');
    $('#txtCheckNumberStart').val($('#SpnCheckNumberStart').html());
}

$('#txtCheckNumberStart').keyup(function () {

    var Start = $('#SpnCheckNumberStart').html();
    var Changes = $('#txtCheckNumberStart').val();
    var LastCheck = EndCheckStore;
    if (LastCheck == '') {
    } else {
        var Result = parseInt(Changes) + parseInt(EndCheckStore);
        $('#SpnCheckNumberEnd').html(Result)
    }
});



function UpdateStartCheckNo() {
    NewGlobalList = '';
    CheckNoList = '';
    var S = $('#txtCheckNumberStart').val();

    if (parseInt(S) >= parseInt(BankStartingCheckNo)) {
        var E = $('#SpnCheckNumberEnd').html();
        if (E != '') {
            for (var i = S; i <= E; i++) {
                CheckNoList += i + ',';
                NewGlobalList += i + '|';
            }
        } else {
            CheckNoList = S;
            NewGlobalList = S + '|';
        }

        $.ajax({
            url: APIUrlEditCheckNumber + '?BankID=' + BankIDD + '&ProdId=' + localStorage.ProdId + '&CheckNumber=' + CheckNoList,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            UpdateStartCheckNoSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    } else {
        alert('Bank Starting Check Number is -' + BankStartingCheckNo + '');

        $('#SpnCheckNumberStart').attr('style', 'display:block;float:left;');
        $('#txtCheckNumberStart').attr('style', 'display:none');

        if (EndCheckStore != '') {
            $('#SpnCheckNumberEnd').html(parseInt($('#SpnCheckNumberStart').html()) + EndCheckStore);
        }
    }
}

function UpdateStartCheckNoSucess(response) {
    if (response.length > 0) {
        var list = '';
        for (var i = 0; i < response.length; i++) {
            list += response[i].CheckNo + ',';
        }
        list.slice(0, -1)

        $('#spanEditCheckList').html(list);
        $('#dvEditCheck').attr('style', 'display:block;');
    } else {
        var NN = $('#txtCheckNumberStart').val();
        StrCheckNumber = NN;
        var Tcount = strArrDetail.length;
        for (var i = 0; i < Tcount; i++) {
            $('#CheckNo_' + i).val(NN);
            NN++;
        }

        $('#dvEditCheck').attr('style', 'display:none;');
        $('#SpnCheckNumberStart').attr('style', 'display:block;float:left;');
        $('#txtCheckNumberStart').attr('style', 'display:none');
        $('#SpnCheckNumberStart').html($('#txtCheckNumberStart').val() + ' ');
        if (EndCheckStore != '') {
            $('#SpnCheckNumberEnd').html(parseInt($('#txtCheckNumberStart').val()) + EndCheckStore);
        }
    }
    AsignCheckNumber(1);
}

function RsassignAgain() {
    $('#dvEditCheck').attr('style', 'display:none;');
    $('#SpnCheckNumberStart').attr('style', 'display:block;float:left;');
    $('#txtCheckNumberStart').attr('style', 'display:none');
    if (EndCheckStore != '') {
        $('#SpnCheckNumberEnd').html(parseInt($('#SpnCheckNumberStart').html()) + EndCheckStore);
    }
}

function GetStartingCheckNumberForBank() {

    $.ajax({
        url: APIUrlGetStartingCheckNumber + '?BankId=' + BankIDD + '&ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetStartingCheckNumberForBankSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function GetStartingCheckNumberForBankSucess(response) {
    BankStartingCheckNo = response[0].CheckNumber;
}

function ConfirmCancel() {
    $('#dvCancelCR').attr('style', 'display:block;');
}

function CancelCheckRun() {
    $('#dvDate').removeClass('displayNone');

    if (PublicCheckRunID == 0) {
        $.ajax({
            url: APIUrlCancelCheckRunByUser + '?UserID=' + localStorage.UserId + '&BankID=' + BankIDD,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            CancelCheckRunSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    } else {
        $.ajax({
            url: APIUrlCancelCheckRun + '?ProdID=' + localStorage.ProdId + '&CheckRunID=' + PublicCheckRunID,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
        })
        .done(function (response) {
            CancelCheckRunSucess(response);
        })
        .fail(function (error) {
            ShowMSG(error);
        })
    }
}

function CancelCheckRunSucess(response) {
    window.location.href = 'CheckCycle';
}

function PDF(checkNumber, BankID, CheckRun) {
    let theURL = APIUrlGenerateCheckPDF + '_';
    if (parseInt(localStorage.ProdId) === 54) {
        theURL += 'VISTA'
    } else {
        theURL += 'PSL'
    }

    $.ajax({
        url: `${theURL}?CheckNumber=${checkNumber}&BankID=${BankID}&CheckRun=${CheckRun}&ProName=${localStorage.ProductionName}&ProdID=${localStorage.ProdId}`,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        PDFSucess(response);
    })
    .fail(function (error)
    { ShowMSG(error); })
}

function PDFSucess(response) {
    $('.clsPreview').prop('checked', false);

    PrintPDF(response);
}

function PrintCheckPDFCopies() {
    PrintCopies = 'YES';
    $('#dvWait').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
    $.ajax({
        url: `${APIUrlGenerateCheckPDFCopies}?BankID=${BankIDD}&CheckRun=${PublicCheckRunID}&ProName=${localStorage.ProductionName}&ProdID=${localStorage.ProdId}`,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
   .done(function (response) {
       PDFSucess(response);
   })
   .fail(function (error)
   { ShowMSG(error); })
}

function CheckCheckRunStatusForUser() {
    //G_FilterParameter = JSON.parse(localStorage.CheckCycleTemp);
    //var arr = FilterParameter.split('|');
    BankIDD = G_FilterParameter.hdnBank;

    $.ajax({
        url: APIUrlInsertCheckRunByUser + '?UserID=' + localStorage.UserId + '&BankID=' + BankIDD,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        CheckCheckRunStatusForUserSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function CheckCheckRunStatusForUserSucess(response) {
    if (response.length > 0) {
        if (response[0].ReturnStatus.toUpperCase() == 'ACCESS') {
            $('#btnCancelCheckRun').removeClass('displayNone');
            CheckCheckRunStatus();
            GetStartingCheckNumberForBank();
        } else {
            $('#spanCheckRunUser').html(response[0].Name);
            $('#CheckRunWorking').attr('style', 'display:block;');
        }
    }
}

function FinalizeCheckRun() {
    localStorage.CheckCycleTemp = '';
    window.location.href = "CheckCycle";
}