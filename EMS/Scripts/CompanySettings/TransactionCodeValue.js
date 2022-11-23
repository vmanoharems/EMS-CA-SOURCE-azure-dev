
//--------- Api Calling 12/26/2015-- -----------//
var APIUrlGetTransactionValue = HOST + "/api/CompanySettings/GetAllTransactionValue";
var APIUrlTransactionValueStatus = HOST + "/api/CompanySettings/TransValueStatusChange";
var APIUrlTransactionValueFill = HOST + "/api/CompanySettings/GetUniqueTransCode";
var APIUrlSaveTransactionValue = HOST + "/api/CompanySettings/SaveTransactionValue";
var APIUrlGetTransactionValueByID = HOST + "/api/CompanySettings/GetTransactionValueFillByID";
var APIUrlUpdateTransactionValue = HOST + "/api/CompanySettings/UpdateTransactionValue";

var valValue;
var CancelValue = 0;
var TransValueEditValueKey = 0;
var SaveEnter = 0;
var UpdateEnter = 0;

//--------- GetAllTransactionValue 12/26/2015-- -----------//
function GetAllTransactionValue() {
    TabSubID = 2;
    $.ajax({
        url: APIUrlGetTransactionValue + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { GetAllTransactionValueByCodeIdSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function ShowMSG(error) {
    console.log(error);
}
function GetAllTransactionValueByCodeIdSucess(response) {
    var strHtml = '';
    var TCount = response.length;

    for (var i = 0; i < TCount; i++) {
        var TransValueID = response[i].TransactionValueID;
        var TransactionCode = response[i].TransCode;
        var TransactionValue = response[i].TransValue;
        var Description = response[i].Description;
        var Status = response[i].Status;
        var CheckedStatus = '';
        if (Status == true) {
            CheckedStatus = "checked";
        }

        strHtml += '<tr id=tr1' + TransValueID + ' class="trShow">';
        strHtml += '<td>' + TransactionCode + '</td>';
        strHtml += '<td>';
        strHtml += '<a class="transShow" href="#" id=aV' + TransValueID + '>' + TransactionValue + '</a>';
        strHtml += '<input class="transHide form-control" type="text" id=txtTraID1' + TransValueID + ' style="display:none;" value="' + TransactionValue + '">';
        strHtml += '</td>';
        strHtml += '<td><input class="transHide form-control" type="text" id=txtDesc1' + TransValueID + ' style="display:none;" value="' + Description + '"><a href="#" class="transShow" id=aDesc1' + TransValueID + '>' + Description + '</a></td>';

        strHtml += '<td><input ' + CheckedStatus + ' type="checkbox" id="chkTransVal' + TransValueID + '"  onclick="javascript:TransValueStatus(' + TransValueID + ')";/> </td>';

        // strHtml += '<td><a href="#"  onclick="javascript:EditTransValue(' + TransValueID + ');" class="btn btn-warning  pull-left marginRight11"><i class="fa fa-pencil"></i></a><a id=aSave1' + TransValueID + '  href="#" style="display:none;" onclick="javascript:UpdateTransValue(' + TransValueID + ');"class="transHide btn btn-success pull-left"><i class="fa  fa-check"></i> Save</a></td>';
        strHtml += '<td><a href="#" id=aEdit1' + TransValueID + ' onclick="javascript:EditTransValue(' + TransValueID + ');" class="transShow btn btn-warning  pull-left marginRight11"><i class="fa fa-pencil"></i></a><div id=aSave1' + TransValueID + ' class="transHide" style="display:none;"> <a href="javascript:TransValueCancel();" class="btn btn-primary pull-right marginLeft10">Cancel</a><a href="#"  onclick="javascript:UpdateTransValue(' + TransValueID + ');"class="btn btn-success pull-left"><i class="fa  fa-check"></i> Save</a></div></td>';

        strHtml += '</tr>';
    }
    $('#newFeildTBody').html(strHtml);

}
function TransValueStatus(TranCodeID) {
    var StatusValue = 0;

    StatusValue = $('#chkTransVal' + TranCodeID).prop('checked');
    $.ajax({
        url: APIUrlTransactionValueStatus + '?TransactionValueID=' + TranCodeID + '&Status=' + StatusValue,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })
}

$('#txtTransFieldValueAdd').click(function () {
    TransFieldAutoFill();
})
$('#txtTransFieldValueAdd').focus(function () {
    TransFieldAutoFill();
})
//--------- TransFieldAutoFill 12/26/2015-- -----------//
function TransFieldAutoFill() {
    $.ajax({
        url: APIUrlTransactionValueFill + '?ProdID=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { TransFieldAutoFillSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}

function TransFieldAutoFillSucess(response) {
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionCodeID,
            label: m.TransCode,
        };
    });

    $(".TransFieldAutoFill").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdTransField").val(ui.item.value);
            $('#txtTransFieldValueAdd').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdTransField").val(ui.item.value);
            $('#txtTransFieldValueAdd').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
                $("#hdTransField").val('');
                $('#txtTransFieldValueAdd').val('');
            }
        }
    })
}
//--------- TransFieldAutoFill 12/28/2015-- -----------//
function SaveTransValue() {
    if (SaveEnter == 0) {
        TransValueEditValueKey = 0;
        var isvalid = "";
        isvalid += CheckRequired($("#txtTransFieldValueAdd"));
        isvalid += CheckRequired($("#txtTransValueAdd"));

        if (isvalid == "") {

            var StatusValue = 0;
            StatusValue = $('#chkTransValueAdd').prop('checked');

            ObjTransCode = {
                TransactionCodeID: valValue,
                TransValue: $('#txtTransValueAdd').val(),
                Description: $('#txtTransValueDescAdd').val(),

                Status: StatusValue,
                CreatedBy: localStorage.UserId,
                ProdID: localStorage.ProdId
            }
            $.ajax({
                url: APIUrlSaveTransactionValue,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                //sync: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjTransCode),
            })
             .done(function (response)
             { SaveTransactionValueSucess(response); })
            SaveEnter = 1;
        }
    }
}
function SaveTransactionValueSucess(response) {
    document.getElementById("chkTransValueAdd").checked = false;
    $('#txtTransValueAdd').val(''),
     $('#txtTransValueDescAdd').val(''),
    $('#trAddTransValue').attr('style', 'display:none;');

    $('.trShow').removeClass("saveBg");
    $('.transHide').attr("style", 'display:none;');
    $('.transShow').attr("style", 'display:block;');

    $('#NewTransvalue').attr('style', 'display:block;');

    if (response == '1') {
        ShowMsgBox('showMSG', 'Transaction Value Already Exist !!.', '', 'failuremsg');
    }
    else {
        ShowMsgBox('showMSG', 'Transaction Value Added Sucessfully.', '', '');
    }
    document.getElementById("chkTransValueAdd").checked = false;

    $('#txtTransValueAdd').val(''),
     $('#txtTransValueDescAdd').val(''),


    GetAllTransactionValueByID(valValue, $('#txtTransFieldValueAdd').val());
}

function GetAllTransactionValueByID(TransCodeID, Transcode) {
    TabSubID = 2;
    CancelValue = 0;
    $('#spanTranValueText').html("- " + Transcode);
    $('#txtTransFieldValueAdd').val(Transcode);
    valValue = TransCodeID;
    $.ajax({
        url: APIUrlGetTransactionValueByID + '?TransactionCodeID=' + TransCodeID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { GetAllTransactionValueByIDSucess(response); })
}

function GetAllTransactionValueByIDSucess(response) {
    var strHtml = '';
    var TCount = response.length;
    if (TCount > 0) {

        for (var i = 0; i < TCount; i++) {
            var TransValueID = response[i].TransactionValueID;
            var TransactionCode = response[i].TransCode;
            var TransactionValue = response[i].TransValue;
            var Description = response[i].Description;
            var Status = response[i].Status;
            var CheckedStatus = '';
            if (Status == true) {
                CheckedStatus = "checked";
            }

            strHtml += '<tr id=tr1' + TransValueID + ' class="trShow">';
            strHtml += '<td>' + TransactionCode + '</td>';
            strHtml += '<td>';
            strHtml += '<span class="transShow" href="#" id=aV' + TransValueID + '>' + TransactionValue + '</span>';
            strHtml += '<input class="transHide form-control" type="text" id=txtTraID1' + TransValueID + ' style="display:none;" value="' + TransactionValue + '">';
            strHtml += '</td>';
            strHtml += '<td><input class="transHide form-control" type="text" id=txtDesc1' + TransValueID + ' style="display:none;" value="' + Description + '"><span  class="transShow" id=aDesc1' + TransValueID + '>' + Description + '</span></td>';

            strHtml += '<td><input ' + CheckedStatus + ' type="checkbox" id="chkTransVal' + TransValueID + '"  onclick="javascript:TransValueStatus(' + TransValueID + ')";/> </td>';

            //  strHtml += '<td><a href="#"  onclick="javascript:EditTransValue(' + TransValueID + ');" class="btn btn-warning  pull-left marginRight11"><i class="fa fa-pencil"></i></a><a id=aSave1' + TransValueID + '  href="#" style="display:none;" onclick="javascript:UpdateTransValue(' + TransValueID + ');"class="transHide btn btn-success pull-left"><i class="fa  fa-check"></i> Save</a></td>';
            strHtml += '<td><a href="#" id=aEdit1' + TransValueID + ' onclick="javascript:EditTransValue(' + TransValueID + ');" class="transShow btn btn-warning  pull-left marginRight11"><i class="fa fa-pencil"></i></a><div id=aSave1' + TransValueID + ' class="transHide" style="display:none;"> <a href="#"  onclick="javascript:UpdateTransValue(' + TransValueID + ');"class="btn btn-success"><i class="fa  fa-check"></i></a> <a href="javascript:TransValueCancel();" class="btn btn-primary"><i class="fa fa-close"></i></a></div></td>';
            strHtml += '</tr>';
        }
        $('#newFeildTBody').empty();
        $('#newFeildTBody').html(strHtml);
    }
    else {
        strHtml += '<tr><td colspan="5" style="text-align:center;">No Transaction Value found</td></tr>';
        $('#newFeildTBody').html(strHtml);
    }
    $('#lishowFields').removeClass('active');
    $('#litransva').addClass('active');
}
//--------- Add new Transaction value 12/28/2015-- -----------//
function addNewTransValue() {
    SaveEnter = 0;
    TransValueEditValueKey = 0;
    if (TabIDD == 3) {
        if (TabSubID == 2) {
            CancelValue = 1;
            $('.trShow').removeClass("saveBg");
            $('.transHide').attr("style", 'display:none;');
            $('.transShow').attr("style", 'display:block;');
            $('#trAddTransValue').attr('style', 'display:table-row;');
            ////
            $("#NewTransvalue").css("background", "#4CBF63");
            ///
            $("#chkTransValueAdd").prop("checked", true)
            $('#LiAccounttypebreadcrumb').text('Transaction Value');
            $('#txtTransValueAdd').focus();
        }
        else {
            addNewTransCode();
        }
    }
}
//--------- Transaction value Cancel 12/28/2015-- -----------//
function TransValueCancel() {
    TransValueEditValueKey = 0;
    document.getElementById("chkTransValueAdd").checked = false;
    // $('#txtTransFieldValueAdd').val(''),
    $('#txtTransValueAdd').val(''),
     $('#txtTransValueDescAdd').val(''),
    $('#trAddTransValue').attr('style', 'display:none;');

    $('.trShow').removeClass("saveBg");
    $('.transHide').attr("style", 'display:none;');
    $('.transShow').attr("style", 'display:block;');
    //
    $('#NewTransvalue').attr('style', 'display:block;');

    if (CancelValue == 0) {
        showFields();
    }
    CancelValue = 0;
}
//--------- Edit Transaction value Cancel 12/28/2015-- -----------//
function EditTransValue(TransID) {
    UpdateEnter = 0;
    TransValueEditValueKey = TransID;
    CancelValue = 1;
    $('.trShow').removeClass("saveBg");
    $('.transHide').attr("style", 'display:none;');
    $('.transShow').attr("style", 'display:block;');

    $('#trAddTransValue').attr('style', 'display:none;');
    $('#tr1' + TransID).addClass("saveBg");
    $('#aV' + TransID).attr('style', 'display:none');
    $('#txtTraID1' + TransID).attr('style', 'display:block');
    $('#aDesc1' + TransID).attr('style', 'display:none');
    $('#txtDesc1' + TransID).attr('style', 'display:block');
    $('#aSave1' + TransID).attr('style', 'display:block');
    $('#aEdit1' + TransID).attr('style', 'display:none');
    $('#txtTraID1' + TransID).focus();
    // $('#' + TransID).attr('style', 'display:none');
}
//--------- Update Transaction value Cancel 12/28/2015-- -----------//
function UpdateTransValue(TransID) {
   
    var isvalid = "";
    isvalid += CheckRequired($("#txtTraID1" + TransID));
    //isvalid += CheckRequired($("#txtDesc1" + TransID));
    if (UpdateEnter == 0) {
        var StatusValue = 0;
        StatusValue = $('#chkTransVal' + TransID).prop('checked');

        if (isvalid == "") {

            var TD = $("#txtDesc1" + TransID).val();
            var TC = $("#txtTraID1" + TransID).val();

            ObjTransCode = {
                TransactionValueID: TransID,
                Description: TD,
                TransValue: TC,
                Status: StatusValue,
                ModifiedBy: localStorage.UserId,
                ProdID: localStorage.ProdId
            }
            $.ajax({
                url: APIUrlUpdateTransactionValue,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
                },
                type: 'POST',
                //sync: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(ObjTransCode),
            }).done(function (response) {
                document.getElementById("chkTransValueAdd").checked = false;

                $('.trShow').removeClass("saveBg");
                $('.transHide').attr("style", 'display:none;');
                $('.transShow').attr("style", 'display:block;');
                $('#NewTransvalue').attr('style', 'display:block;');

                ShowMsgBox('showMSG', 'Transaction Value Updated Sucessfully.', '', '');
                GetAllTransactionValueByID(valValue, $('#txtTransFieldValueAdd').val())
            });
           
            // GetAllTransactionValue();
        }
        UpdateEnter = 1;
    }
}

//$('form').keypress(function (e) {

//    var code = e.keyCode || e.which;
//    if (code === 13) {
//        if (TabIDD == 3) {
//            if (TabSubID == 2) {
//                alert('Enter Key Value');
//            }
//        }
//    }
//})


$('#tabTransactionFields').keypress(function (e) {
    var key = e.which;
    //e.preventDefault();
    if (key == 13)  // the enter key code
    {
        
        if (TabIDD == 3) {
            if (TabSubID == 1) {
                if (TransEditValueKey != 0) {
                    $('#aEdit1').focus();
                    UpdateTransCode(TransEditValueKey);
                }
                else {
                    SaveTransField();

                }
                TransCodeCancel();
            }
        }
    }
});

$('#tabTransactionValues').keypress(function (e) {
    var key = e.which;
    //e.preventDefault();
    if (key == 13)  // the enter key code
    {
        if (TabIDD == 3) {
            if (TabSubID == 2) {
                if (TransValueEditValueKey != 0) {
                    UpdateTransValue(TransValueEditValueKey);

                }
                else {
                    SaveTransValue();
                    TransValueCancel();
                }
                
            }
        }
    }
});