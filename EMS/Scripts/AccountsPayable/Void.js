var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlGetVoidList = HOST + "/api/AccountPayableOp/GetPaymentVoidData1";
var APIUrlVoidPayment = HOST + "/api/AccountPayableOp/SaveVoidData";
var showpg = 0;
var PageCnt;
var GetDate = '';
var CheckBankID = [];
var StrCheckNumber = 0;
var strTempCheck = 0;
var strArrDetail = [];
var BankIDD;
var PublicCheckRunID;
var CCODE;
var PaymentIDs;
var VerifiedCheckIDs = '';
var VerifiedPaymentIDs = '';
var PIDAgain = '';
var VoidListIDs = {};
var oVoidConfirm = [];
var oVoidReissue = []; // Not how this should be done

$(document).ready(function () {

    $('#UlAccountPayable li').removeClass('active');
    $('#LiCheckCycle').addClass('active');

    FillBankDetails();

    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;

    $('#txtBankName').focus();
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
        FillBankDetailsSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function FillBankDetailsSucess(response) {
    if (response.length == 1) {
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
    if (StrAddInvcCheckBanks != '') {
        for (var i = 0; i < CheckBankID.length; i++) {
            if (CheckBankID[i].Bankname == StrAddInvcCheckBanks) {
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


function GetVoidData() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetVoidList + '?BankId=' + BankID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVoidDataSucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })

    $('#dvVoid').removeClass('displayNone');
    $('#DvSearch').addClass('displayNone');
    $('#dvFilter').removeClass('displayNone');
}

function GetVoidDataSucess(response) {
    VoidListIDs = {};
    localStorage.CheckCycleTemp = "";
    var strHtml = '';
    var BalanceAmt = 0;

    if (response.length > 0) {
        for (var i = 0; i < response.length; i++) {
            var oBRStatus = $.parseJSON(response[i].BRStatus);

            strHtml += '<tr>';
            strHtml += '<td></td>';

            if ((response[i].Status == 'Voided') || (response[i].Status == 'Cancelled')) {
                strHtml += '<td>' + response[i].Status + '</td>';
                strHtml += `<td>${(response[i].Reissued)? 'Reissued': ''}</td>`;
                strHtml += '<td>' + response[i].CDate + '</td>';
            } else {
                if (oBRStatus != null) {
                    if (oBRStatus.RAStatus == "CLEARED" && oBRStatus.BRStatus == "Completed") {
                        strHtml += '<td><input type="checkBox" disabled  id="chkVoid_' + response[i].PaymentId + '" onchange="javascript: GetVoideNo(' + response[i].PaymentId + ');GetCheckVoid(' + oBRStatus.ReconcilationID + ', \'' + oBRStatus.StatementDate + '\', \'' + oBRStatus.RAStatus + '\',   \'' + oBRStatus.BRStatus + '\', ' + response[i].PaymentId + ', \'' + response[i].CheckNumber + '\',this)"></td>';
                    } else {
                        strHtml += '<td><input type="checkBox"  id="chkVoid_' + response[i].PaymentId + '" onchange="javascript: GetVoideNo(' + response[i].PaymentId + ');GetCheckVoid(' + oBRStatus.ReconcilationID + ', \'' + oBRStatus.StatementDate + '\', \'' + oBRStatus.RAStatus + '\',   \'' + oBRStatus.BRStatus + '\', ' + response[i].PaymentId + ', \'' + response[i].CheckNumber + '\',this)"></td>';
                    }
                } else {
                    strHtml += '<td><input type="checkBox"  id="chkVoid_' + response[i].PaymentId + '" onchange="javascript: GetVoideNo(' + response[i].PaymentId + ');GetCheckVoid(0, \'0\', \'0\', \'0\',' + response[i].PaymentId + ', \'' + response[i].CheckNumber + '\',this);"></td>';
                }
                strHtml += '<td><input type="checkBox" disabled  id="chkReissue_' + response[i].PaymentId + '" onclick="javascript: GetReissue(' + response[i].PaymentId + ',this);ConfirmReissue(' + response[i].PaymentId + ',this);"></td>';
                strHtml += '<td>' + response[i].CDate + '</td>';
            }

            strHtml += '<td>' + response[i].CheckNumber + '</td>';
            strHtml += '<td>' + response[i].TransactionNumber + '</td>';
            strHtml += '<td>' + response[i].VendorName + '</td>';
            strHtml += '<td>$' + parseFloat(response[i].PaidAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
            if (oBRStatus != null) {
                if (oBRStatus.RAStatus == "CLEARED") {
                    strHtml += '<td><b>' + oBRStatus.RAStatus + '</b> (' + oBRStatus.StatementDate + ')</td>';
                } else {
                    strHtml += '<td></td>';
                }
            } else {
                strHtml += '<td></td>';
            }
            strHtml += '</tr>';
        }
    } else {
        strHtml += '<tr><td colspan="8" style="text-align:center;"> No Records found !!</td?</tr>';
    }

    $('#tblVoidTBody').html(strHtml);

    if (parseInt(PageCnt) < 500) {
        var PgNo = (PageCnt / 28);
    } else if (parseInt(PageCnt) < 800) {
        var PgNo = (PageCnt / 24);
    }

    var substr = PgNo.toString().split('.');
    showpg = parseInt(substr[0]);

    $('#tblVoid').DataTable().destroy();

    var table = $('#tblVoid').DataTable({
        "iDisplayLength": showpg,
        responsive: {
            details: {
                type: 'column',
            }
        },
        columnDefs: [{

            className: 'control',
            orderable: false,
            targets: 0,

        }],
        order: [1, 'asc']
    });

    $('#tblVoid tfoot th').each(function () {
        var title = $('#tblVoid thead th').eq($(this).index()).text();
        $(this).html('<input type="text"  style="width:100px !important;" placeholder="' + title + '" />');

    });

    // Apply the search
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

    $('#tblVoid tfoot tr').insertAfter($('#tblVoid thead tr'));

    $('#tblVoid').parent().css('overflow', 'scroll');
    $('#tblVoid').parent().css('max-height', ($(window).height() - 180) + 'px');
    $('#tblVoid').parent().css('min-height', ($(window).height() - 180) + 'px');
    $('#tblVoid').parent().css('height', ($(window).height() - 180) + 'px');

    $('#tblVoid_wrapper').attr('style', 'height:' + PageCnt + 'px;');
    $('#spanBank').html($('#txtBankName').val());
}

function GetVoideNo(JEDID) {
    if ($('#chkVoid_' + JEDID).is(':checked')) {
        VoidListIDs[JEDID] = 'V';

        //VoidListIDs = VoidListIDs + JEDID + ',';
        //VoidListIDs = VoidListIDs.replace(',,', ',');
        $('#chkReissue_' + JEDID).prop("disabled", false);
        $('#chkReissue_' + JEDID).prop('checked', false);
    } else {
        delete VoidListIDs[JEDID];

        //VoidListIDs = VoidListIDs.replace(JEDID + ',', '');
        //VoidListIDs = VoidListIDs.replace(',,', ',');
        $('#chkReissue_' + JEDID).prop("disabled", true);
        $('#chkReissue_' + JEDID).prop('checked', false);
    }
}

function SaveVoid() {
    if (Object.keys(VoidListIDs).length === 0) {
        alert('Please select atleast 1 Check.');
    } else {
        //$('#dvVoidPopUp').attr('style', 'display:block;');
        $("#dvVoidPopUpNew").dialog({
            modal: true,
            buttons: {
                "OK": function () {
                    VoidRecord();
                },
                Cancel: function () {

                    $(this).dialog("close");
                }
            },
            width: "700px",           
        });
    }
}

function GetReissue(JEID,ele) {
    if ($(ele).is(':checked')) {
        VoidListIDs[JEID] = 'R'
        //VoidListIDs = VoidListIDs + ',' + JEID;
        //VoidListIDs = VoidListIDs.replace(',,', ',');
    } else {
        VoidListIDs[JEID] = 'V'
        //VoidListIDs = VoidListIDs.replace(JEID, '');
        //VoidListIDs = VoidListIDs.replace(',,', ',');
    }
}

function VoidRecord() {
    var ArrPaymentVoid = [];
    var PaymentID = Object.keys(VoidListIDs).join(','); // VoidListIDs.substring(0, VoidListIDs.length - 1);

    var arr = PaymentID.split(',');

    var Tcount = arr.length;

    if (oVoidConfirm.length > 0) {
        for (var i = 0; i < Tcount; i++) {
            var ReIssue = 'NO';
            if ($('#chkReissue_' + arr[i]).is(':checked')) {
                ReIssue = 'YES';
            }
            var payid = arr[i];

            if ($.inArray(payid, oVoidConfirm) > -1) {
                var objVoid = {
                    PaymentID: payid,
                    IsReissueInv: ReIssue,
                    BatchNumber: BatchManager.BatchNumber,
                    ProdID: localStorage.ProdId,
                    UserID: localStorage.UserId,
                    Status: 'Voided'
                }
                ArrPaymentVoid.push(objVoid);
            }
        }

        $.ajax({
            url: APIUrlVoidPayment,
            cache: false,
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(ArrPaymentVoid),
        })
        .done(function (response) {

            VoidRecordSucess(response);

        })
        .fail(function (error) {
            ShowMSG(error);
        });
   

    } else {
        alert("Please confirm atleast 1 Check.");
    }
}

function VoidRecordSucess(response) {
    RefreshList(); 
}

function RefreshList() {
    $('tbody tr td input[type="checkbox"]').prop('checked', false);
    $.each(oVoidConfirm, function (key, value) {
        let tdV = $("#chkVoid_" + value).closest("td");
        let tdR = $("#chkReissue_" + value).closest('td');

        $("#chkVoid_" + value).hide();
        $("#chkReissue_" + value).hide();
        tdV.text("Voided");
        tdR.text(($.inArray(value, oVoidReissue) > -1) ? 'Reissued' : '');
    });
    oVoidConfirm = [];
    oVoidReissue = [];

    $("#tbvoidlist").html("");
    $("#dvVoidPopUpNew").dialog("close");
}

function GetVoidData1() {
    var BankID = $('#hdnBank').val();
    $.ajax({
        url: APIUrlGetVoidList + '?BankId=' + BankID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        GetVoidData1Sucess(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })

    $('#dvVoid').removeClass('displayNone');
    $('#DvSearch').addClass('displayNone');
    $('#dvFilter').removeClass('displayNone');
}

function GetVoidData1Sucess(response) {
    VoidListIDs = {};
    localStorage.CheckCycleTemp = "";
    var strHtml = '';
    var BalanceAmt = 0;

    $('#tblVoidTBody').empty();
    for (var i = 0; i < response.length; i++) {

        var oBRStatus = $.parseJSON(response[i].BRStatus);
        strHtml += '<tr>';
       // BalanceAmt = BalanceAmt - parseFloat(response[i].CreditAmount);
        if ((response[i].Status == 'Voided') || (response[i].Status == 'Cancelled')) {
            strHtml += '<td>' + response[i].Status + '</td>';
            strHtml += `<td>${(response[i].Reissued) ? 'Reissued' : ''}</td>`;
            strHtml += '<td>' + response[i].CDate + '</td>';
        } else {
            strHtml += '<td><input type="checkBox"  id="chkVoid_' + response[i].PaymentId + '" onchange="javascript:GetVoideNo(' + response[i].PaymentId + ');"></td>';
            strHtml += '<td><input type="checkBox" disabled  id="chkReissue_' + response[i].PaymentId + '" onchange="javascript: GetReissue(' + response[i].PaymentId + ',this); ConfirmReissue(' + response[i].PaymentId + ',this);"></td>';
            strHtml += '<td>' + response[i].CDate + '</td>';
        }
        strHtml += '<td>' + response[i].CheckNumber + '</td>';
        strHtml += '<td>' + response[i].TransactionNumber + '</td>';
        //strHtml += '<td>' + response[i].InvoiceId + '</td>';
        strHtml += '<td>' + response[i].VendorName + '</td>';
        strHtml += '<td>$' + parseFloat(response[i].PaidAmount + "").toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</td>';
        if (oBRStatus != null) {
            if (oBRStatus.RAStatus == "CLEARED") {
                strHtml += '<td><b>' + oBRStatus.RAStatus + '</b> (' + oBRStatus.StatementDate + ')</td>';
            }
            else {
                strHtml += '<td></td>';
            }
        }
        else {
            strHtml += '<td></td>';
        }
        strHtml += '</tr>';
    }
    $('#tblVoidTBody').html(strHtml);

    if (parseInt(PageCnt) < 500) {
        var PgNo = (PageCnt / 28);
    } else if (parseInt(PageCnt) < 800) {
        var PgNo = (PageCnt / 24);
    }

    var substr = PgNo.toString().split('.');
    showpg = parseInt(substr[0]);

    $('#tblVoid tfoot th').each(function () {
        var title = $('#tblVoid thead th').eq($(this).index()).text();
        $(this).html('<input type="text"  style="width:100px !important;" placeholder="' + title + '" />');

    });

    // Apply the search
    /*table.columns().eq(0).each(function (colIdx) {
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
    */
    $('#tblVoid tfoot tr').insertAfter($('#tblVoid thead tr'));

    $('#tblVoid').parent().css('overflow', 'scroll');
    $('#tblVoid').parent().css('max-height', ($(window).height() - 180) + 'px');
    $('#tblVoid').parent().css('min-height', ($(window).height() - 180) + 'px');
    $('#tblVoid').parent().css('height', ($(window).height() - 180) + 'px');

    $('#tblVoid_wrapper').attr('style', 'height:' + PageCnt + 'px;');

    $('#spanBank').html($('#txtBankName').val());
}

function ShowMSG(error) {
    console.log(error);
}

function GetCheckVoid(RecId, StatementDt, RAStatus, BRStatus, PaymentId, Checkno,ele) {

    var sHTMLTemplate = "";
    if ($(ele).prop("checked") == true) {
        sHTMLTemplate += '<tr role="row" class="odd" id="' + PaymentId + '" >';
        if (RecId != 0) {
            sHTMLTemplate += '<td ><input type="checkBox"  id="chk_' + PaymentId + '"" onchange="javascript:ConfirmCheck(' + PaymentId + ',this);"></td>';
        } else {
            oVoidConfirm.push(PaymentId.toString());

            sHTMLTemplate += '<td ><input type="checkBox"  id="chk_' + PaymentId + '"" checked onchange="javascript:ConfirmCheck(' + PaymentId + ',this);"></td>';
        }

        sHTMLTemplate += '<td ><input type="checkBox"  id="chkRe_' + PaymentId + '"" onclick="javascript: GetReissue(' + PaymentId + ',this); ConfirmReissue(' + PaymentId + ',this);"></td>';
        sHTMLTemplate += '<td >' + Checkno + '</td>';
        if (RecId != 0) {
            sHTMLTemplate += '<td >Check is on an <b>' + BRStatus + '</b> bank reconciliation: <b>' + RAStatus + '</b> (' + StatementDt + ')</td>';
        } else {
            sHTMLTemplate += '<td ></td>';
        }

        $("#tblVoidList tbody").append(sHTMLTemplate);
    } else {
        $("#chk_"+PaymentId).closest("tr").remove();
    }
}

function ConfirmCheck(paymentid, ele) {
    if ($(ele).prop("checked") == true) {
        oVoidConfirm.push(paymentid.toString());
    } else {
        oVoidConfirm.splice($.inArray(paymentid.toString(), oVoidConfirm), 1);
    }
}

function ConfirmReissue(paymentid, ele) {
    if ($(ele).prop("checked") == true) {
        $("#chkRe_" + paymentid).prop("checked",true);
        oVoidReissue.push(paymentid.toString());
    } else {
        $("#chkRe_" + paymentid).prop("checked", false);
        oVoidReissue.splice($.inArray(paymentid.toString(), oVoidReissue), 1);
    }
}