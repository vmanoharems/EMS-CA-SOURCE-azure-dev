var APIUrlFillBankDetails = HOST + "/api/CompanySettings/GetBankInfoDetails";
var APIUrlVoidUnissuedList = HOST + "/api/AccountPayableOp/APCheckCycleVoidUnissued";
let isUserConfirmedVOID = false;

$(document).ready(function () {
    FillBankDetails();
    var heightt = $(window).height();
    heightt = heightt - 230;
    $('.fixed-table-container-inner').attr('style', 'height:' + heightt + 'px;');
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
        if (response.length > 0) {
            $('#txtBankName').val(response[0].Bankname);
            $('#hdnBank').val(response[0].BankId);
        }
        GetVoidUnissuedData(0, 1, false, 1);
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
                isUserConfirmedVOID = false;
                $('#tblVoidTBody').html(''); // Wipe the list of voided transactions
                GetVoidUnissuedData(0, 1, false, 1); // Refresh the list when bank is selected
                return false;
            },
            change: function (event, ui) {
                if (!ui.item) {
                }
            }
        })
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

var returnedData = [];
function GetVoidUnissuedData(startvoid, endvoid, FlagVoid, FlagFillTbl) {
    var BankID = $('#hdnBank').val();
    var VarUserID = (isUserConfirmedVOID) ? localStorage.UserId : -1; // Switch to -1 is we're pulling the list instead of performing the void
    var BatchNumber = BatchManager.BatchNumber;
    var ProdID = localStorage.ProdId;
    $.ajax({
        url: APIUrlVoidUnissuedList + '?BankID=' + BankID + '&startvoid=' + startvoid + '&endvoid=' + endvoid + '&UserID=' + VarUserID + '&vBatchNumber=' + BatchNumber + '&ProdID=' + ProdID + '&FlagVoid=' + FlagVoid,
        cache: false,
        async: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        returnedData = response;
        if (FlagFillTbl === 1) ShowVoidUnissuedTableList(response);
    })
    .fail(function (error) {
        ShowMSG(error);
    })
}

function ShowVoidUnissuedTableList(response) {
    if (response.length === 0) {
        return;
    }
    if (response[0].Action !== 'Inserted' && response[0].Action !== 'VOID UNISSUED') {
        ShowMsgBox('showMSG', 'This action could not be performed for the following reason: ' + response[0].Action,'','failuremsg');
        return;
    }

    var NoofVoidUnissued = 0;
    var fillData = $.grep(response, function (element, index) {
        return element.Status == 'Void Unissued';
    });
    $('#tblVoidTBody').html('');
    var strHtml = '';
    $.each(fillData, function (index, value) {
        NoofVoidUnissued++;
        strHtml += '<tr>';
        strHtml += '<td>' + value.Status + '</td>';
        strHtml += '<td>' + GetDateFomate(value.CheckDate, 2) + '</td>';
        strHtml += '<td>' + value.CheckNumber + '</td>';
        strHtml += '<td>' + value.BatchNumber + '</td>';
        strHtml += '</tr>';
    });
    if (NoofVoidUnissued === 0) strHtml += '<tr><td colspan="7" style="text-align:center;"> No Records found !!</td?</tr>';
    $('#tblVoidTBody').html(strHtml);

    setTimeout(function () {
        isUserConfirmedVOID = false;
        GetVoidUnissuedData(0, 1, false, 1); // Refresh the list after we show them the voids
    }, 5000);
}

function SaveVoidUnissued() {
    var VoidFrom = $('#txtInv1').val();
    var VoidTo = $('#txtInv2').val();
    if (VoidFrom == '') {
        $('#txtInv1').focus();
        ShowMsgBox('showMSG', 'Please fill Void From Check#.', '', 'failuremsg');
        return false;
    }
    if (VoidTo == '') {
        $('#txtInv2').focus();
        ShowMsgBox('showMSG', 'Please fill Void To Check#.', '', 'failuremsg');
        return false;
    }

//    GetVoidUnissuedData(VoidFrom, VoidTo, false, 0); WHY IS THIS BEING CALLED BEFORE the prompt?????
    setTimeout(function () {
        isUserConfirmedVOID = false;
        //if (returnedData.length > 0) {
            var IssuedRec = $.grep(returnedData, function (element, index) {
                return element.Status == 'Issued';
            });
            var msg = 'Are you sure you want to VOID these unissued checks?<br /><br />This cannot be reversed.<br />';
            $('#UnissuedNo').hide();
            $('#UnissuedYes').hide();
            $('#UnissuedOK').hide();

            if (IssuedRec.length > 0) { 
                console.log(IssuedRec);
                var vCheckNumbers = '';
                $.each(IssuedRec, function (index, value) {
                    vCheckNumbers += value.CheckNumber + (IssuedRec.length - 1 == index ? '' : ',');
                });
                //CheckNumber
                //Check To and from API we check to make sure that checks have not already been issued in that range
                $('#hdnIsChecksIssued').val(1);
                msg = 'The checks that have already been issued in that range.<br /><br />Check# are issued: ' + vCheckNumbers;
                $('#UnissuedOK').show();
            }
            else {
                $('#hdnIsChecksIssued').val(0);
                $('#UnissuedNo').show(); $('#UnissuedYes').show();
            }

            $('#lblMsg').html(msg);
            $('#dvVoidUnissuedPopUp').attr('style', 'display:block;');
        //}
    }, 300);
}

$('#UnissuedYes').click(function () {isUserConfirmedVOID
    isUserConfirmedVOID = true;
    console.log($('#hdnIsChecksIssued').val());
    if ($('#hdnIsChecksIssued').val() == 0) {
        var VoidFrom = $('#txtInv1').val();
        var VoidTo = $('#txtInv2').val();
        GetVoidUnissuedData(VoidFrom, VoidTo, true, 1);
// This is invalid logic
        //setTimeout(function () {
        //    ShowMsgBox('showMSG', 'You have VOIDED unissued checks ranging from ' + VoidFrom + ' to ' + VoidTo + '. These checks cannot be issued in the future.', '', '');
        //}, 3000);
    }
    else alert('Checks have already been issued');
});
function ShowMSG(error) {
    console.log(error);
}