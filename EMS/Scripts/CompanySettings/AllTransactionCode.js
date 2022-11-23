
//-------- -  Api Calling 12/28/2015-- -----------//
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTransactionCodeFill";
var APIUrlTransactionFieldStatus = HOST + "/api/CompanySettings/TransFieldStatusChange";
var APIUrlTransactionCodeCheck = HOST + "/api/CompanySettings/CheckTransactionCodeField";
var APIUrlSaveTransactionCode = HOST + "/api/CompanySettings/SaveTransactionCode";
var APIUrlUpdateTransactionCode = HOST + "/api/CompanySettings/UpdateTransactionCode";
//-------- -  GetTransactionCode 12/28/2015-- -----------//
var TabSubID = 0;
var TransEditValueKey = 0;
var SaveEnterCode = 0;
var UpdateEnterCode = 1;


function GetTransactionCode() {
    TabIDD = 3;
    TabSubID = 1;
    $('#LiAccounttypebreadcrumb').text('Transaction');
    $.ajax({
        url: APIUrlGetTransactionCode + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { GetTransactionCodeByProdIdSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function ShowMSG(error) {
    console.log(error);
}
function GetTransactionCodeByProdIdSucess(response) {

    var strHtml = '';
    var TCount = response.length;
    $('#newTransactionTypeTBody').removeData();
    $('#newTransactionTypeTBody').empty();
    for (var i = 0; i < TCount; i++) {
        var TraID = response[i].TransactionCodeID;
        var TransactionCode = response[i].TransCode;
        var Description = response[i].Description;
        var Status = response[i].Status;
        var CheckedStatus = '';
        if (Status == true) {
            CheckedStatus = "checked";
        }

        strHtml += '<tr id=tr' + TraID + ' class="trShow">';

        strHtml += '<td>';
        strHtml += '<a class="transShow" href="#" id=a' + TraID + ' onclick="javascript:GetTransactionCodeShow(' + TraID + ',\'' + TransactionCode + '\');">' + TransactionCode + '</a>';
        strHtml += '<input class="transHide form-control" type="text" onBlur="javascript:Check();" id=txtTraID' + TraID + ' style="display:none;" value="' + TransactionCode + '">';
        strHtml += '</td>';
        strHtml += '<td><input class="transHide form-control" onBlur="javascript:Check();" type="text" id=txtDesc' + TraID + ' style="display:none;" value="' + Description + '"><span class="transShow" id=aDesc' + TraID + '>' + Description + '</span></td>';

        strHtml += '<td><input ' + CheckedStatus + ' type="checkbox" id="chkTrasField' + TraID + '" value="' + TransactionCode + '" onclick="javascript:TransFieldStatus(' + TraID + ')";/> </td>';
        strHtml += '<td><a href="#" id=aEdit' + TraID + ' onclick="javascript:EditTransCode(' + TraID + ');" class="transShow btn btn-warning  pull-left marginRight11"><i class="fa fa-pencil"></i></a><div id=aSave' + TraID + ' class="transHide" style="display:none;"><a href="#"  onclick="javascript:UpdateTransCode(' + TraID + ');"class="btn btn-success"><i class="fa  fa-check"></i></a>  <a href="javascript:TransCodeCancel();" class="btn btn-primary"><i class="fa fa-close"></i></a></div></td>';
        strHtml += '</tr>';
    }
    $('#newTransactionTypeTBody').html(strHtml); 
}
function Check()
{ }
//-------- -  showFields 12/28/2015-- -----------//
function showFields() {
    TabSubID = 1;
    $('#spanTranValueText').html('');
    $('#LiAccounttypebreadcrumb').text('Transaction Code');
    $('#lishowFields').addClass('active');
    $('#litransva').removeClass('active');

    $('#tabTransactionFields').attr('style', 'display:block;')
    $('#tabTransactionValues').attr('style', 'display:none;')
    $('#trAddTransCode').attr('style', 'display:none;');
    $('#txtTransFieldDescAdd').val('');
    $('#txtTransFieldAdd').val('');
    $('#lishowFields').addClass('active');
    $('#litransva').removeClass('active');
}
//-------- - showTransValue 12/28/2015-- -----------//
function showTransVa() {
    $('#lishowFields').removeClass('active');
    $('#liTransVa').addClass('active');

    $('#tabTransactionFields').attr('style', 'display:none;')
    $('#tabTransactionValues').attr('style', 'display:block;')
    $('#trAddTransValue').attr('style', 'display:none;');
    $('#txtTransFieldValueAdd').val('');
    $('#txtTransValueAdd').val('');
    $('#txtTransValueDescAdd').val('');
    GetAllTransactionValue();
}
//-------- - Transaction FieldStatus 12/29/2015-- -----------//
function TransFieldStatus(TranCodeID) {
    var StatusValue = 0;
    StatusValue = $('#chkTrasField' + TranCodeID).prop('checked');
    $.ajax({
        url: APIUrlTransactionFieldStatus + '?TransactionCodeID=' + TranCodeID + '&Status=' + StatusValue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
}

function CheckTransactionCode() {

}
//-------- - focusout 12/29/2015-- -----------//
$("#txtTransFieldAdd").focusout(function () {

    var TransactionCode = $('#txtTransFieldAdd').val();
    var ProdID = localStorage.ProdId
    $.ajax({
        url: APIUrlTransactionCodeCheck + '?TransactionCode=' + TransactionCode + '&ProdID=' + ProdID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
        // data: JSON.stringify(ProdID),
    })
     .done(function (response) {
         TransactionCodeCheckSucess(response);
     })
});

function TransactionCodeCheckSucess(response) {
    if (response != 0) {
        ShowMsgBox('showMSG', 'Transaction Code Already Exists !!', '', 'failuremsg');
        $('#txtTransFieldAdd').val('');
    }
}
//-------- -SaveTransField 12/29/2015-- -----------//
function SaveTransField() {
    if (SaveEnterCode == 0) {
        TransEditValueKey = 0;
        var isvalid = "";
        isvalid += CheckRequired($("#txtTransFieldAdd"));
        isvalid += CheckRequired($("#txtTransFieldDescAdd"));

        if (isvalid == "") {

            var StatusValue = 0;
            StatusValue = $('#chkTransFieldAdd').prop('checked');

            ObjTransCode = {
                Description: $('#txtTransFieldDescAdd').val(),
                TransCode: $('#txtTransFieldAdd').val(),
                Status: StatusValue,
                CreatedBy: localStorage.UserId,
                ProdID: localStorage.ProdId
            }

            $.ajax({
                url: APIUrlSaveTransactionCode,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                //sync: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjTransCode),
            }).done(function (response) {
                document.getElementById("chkTransFieldAdd").checked = false;
                $('#txtTransFieldDescAdd').val(''),
                $('#txtTransFieldAdd').val(''),
                //var Msg = 'Company ' + CheckStatus + ' Sucessfully !!';

                GetTransactionCode();
                ShowMsgBox('showMSG', 'Transaction Code Added Sucessfully.', '', '');
            });
           
        }
        SaveEnterCode = 1;
        TransCodeCancel();
    }
}
//-------- addNewTransactionCode 12/30/2015-- -----------//
function addNewTransCode() {
    SaveEnterCode = 0;
    TransEditValueKey = 0;
    if (TabIDD == 3) {
        if (TabSubID == 1) {
            $('.trShow').removeClass("saveBg");
            $('.transHide').attr("style", 'display:none;');
            $('.transShow').attr("style", 'display:block;');

            $('#trAddTransCode').attr('style', 'display:table-row;');
            $("#Newtranscode").css("background", "#4CBF63");
            $("#chkTransFieldAdd").prop("checked", true)
            $('#LiAccounttypebreadcrumb').text(' New Transaction Code');
            $('#btnTransCodeCancel').attr('style', 'display:block;');
            $('#txtTransFieldAdd').on({
                keydown: function (e) {
                    if (e.which === 32)
                        return false;
                },
                change: function () {
                    this.value = this.value.replace(/\s/g, "");
                }
            });


            $('#txtTransFieldAdd').focus();
        }
        else {
            addNewTransValue();
        }
    }
}
//-------- TransactionCodeTransCodeCancel 12/30/2015-- -----------//
function TransCodeCancel() {
    TransEditValueKey = 0;
    document.getElementById("chkTransFieldAdd").checked = false;
    $('#txtTransFieldDescAdd').val(''),
    $('#txtTransFieldAdd').val(''),
    $('#trAddTransCode').attr('style', 'display:none;');

    $('.trShow').removeClass("saveBg");
    $('.transHide').attr("style", 'display:none;');
    $('.transShow').attr("style", 'display:block;');
    $('#Newtranscode').attr('style', 'display:block;');
    $('#LiAccounttypebreadcrumb').text('Transaction Code');
    $('#btnTransCodeCancel').attr('style', 'display:none;');
}
//-------- EditTransactionCode 12/30/2015-- -----------//
function EditTransCode(TransID) {
    UpdateEnterCode = 0;
    TransEditValueKey = TransID;

    $('.trShow').removeClass("saveBg");
    $('.transHide').attr("style", 'display:none;');
    $('.transShow').attr("style", 'display:block;');

    $('#trAddTransCode').attr('style', 'display:none;');
    $('#tr' + TransID).addClass("saveBg");
    $('#a' + TransID).attr('style', 'display:none');
    $('#txtTraID' + TransID).attr('style', 'display:block');
    $('#txtTraID' + TransID).on({
        keydown: function (e) {
            if (e.which === 32)
                return false;
        },
        change: function () {
            this.value = this.value.replace(/\s/g, "");
        }
    });

    $('#aDesc' + TransID).attr('style', 'display:none');
    $('#txtDesc' + TransID).attr('style', 'display:block');
    $('#aEdit' + TransID).attr('style', 'display:none');
    $('#aSave' + TransID).attr('style', 'display:block');
    $('#txtTraID' + TransID).focus();
}
//-------- Update Transaction Code 12/30/2015-- -----------//
function UpdateTransCode(TransID) {
  
   // var Firstname = document.getElementById('txtTraID').value;
   // alert(Firstname);
    var isvalid = "";
    isvalid += CheckRequired($("#txtTraID" + TransID));
    isvalid += CheckRequired($("#txtDesc" + TransID));
    if (UpdateEnterCode == 0) {
        var StatusValue = 0;
        StatusValue = $('#chkTrasField' + TransID).prop('checked');
        if (isvalid == "") {
            var TC = $("#txtTraID" + TransID).val();
            var TD = $("#txtDesc" + TransID).val();
            ObjTransCode = {
                TransactionCodeID: TransID,
                Description: TD,
                TransCode: TC,
                Status: StatusValue,
                ModifiedBy: localStorage.UserId,
                ProdID: localStorage.ProdId
            }

            $.ajax({
                url: APIUrlUpdateTransactionCode,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                //sync: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjTransCode),
            }).done(function (response) {
                TransCodeCancel();
                ShowMsgBox('showMSG', 'Transaction Code Updated Sucessfully.', '', '');
                GetTransactionCode();
            });
           
        }
        UpdateEnterCode = 1;
    }
}
//--------  Get Transaction Code 12/30/2015-- -----------//
function GetTransactionCodeShow(TransID, TransCode) {
    $('#lishowFields').removeClass('active');
    $('#litransva').addClass('active');

    $('#tabTransactionFields').attr('style', 'display:none;')
    $('#tabTransactionValues').attr('style', 'display:block;')
    $('#trAddTransValue').attr('style', 'display:none;');
    GetAllTransactionValueByID(TransID, TransCode);
}

