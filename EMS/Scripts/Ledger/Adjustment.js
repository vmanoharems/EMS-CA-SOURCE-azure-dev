var APIUrlGetSegmentList = HOST + "/api/AdminLogin/GetAllSegmentByProdId";
var APIUrlGetTransactionCode = HOST + "/api/CompanySettings/GetTranasactionCode"; //
var APIUrlGetAdjustmentList = HOST + "/api/Ledger/GetJEDetailForAdjutment";
var APIUrlTranscationCode = HOST + "/api/CompanySettings/GetTransactionValueByCodeId";
var APIUrlUpdateJEDDetailByType = HOST + "/api/Ledger/UpdateJEDDetailByType";

var ArrSegment = [];
var ArrTransCode = [];
var GblTransValue = [];
$(document).ready(function () {
    GetSegmentsDetails();
});


function GetSegmentsDetails() {
    $.ajax({
        url: APIUrlGetSegmentList + '?ProdId=' + localStorage.ProdId + '&Mode=' + 0,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        //async: false,
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { GetSegmentListSucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function GetSegmentListSucess(response) {
    ArrSegment = [];
    for (var i = 0; i < response.length; i++) {

        var ObjSegment = {
            SegmentId: response[i].SegmentId, SegmentName: response[i].Classification
        }


        ArrSegment.push(ObjSegment);
        if (response[i].Classification == 'Detail') {
            break;
        }
    }
    GetTransactionCode();

}


function GetTransactionCode() {
    $.ajax({
        url: APIUrlGetTransactionCode + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

     .done(function (response)
     { GetTransactionCodeSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function GetTransactionCodeSucess(response) {
    var strHtml = '';
    strHtml += '<tr>';
    strHtml += '<th class="Third"><div class="th-inner">Vendor</div></th>';
    strHtml += '<th class="Third"><div class="th-inner">Tran #</div></th>';
    strHtml += '<th class="second"><div class="th-inner">3P</div></th>';

    for (var i = 0; i < ArrSegment.length; i++) {
        if (ArrSegment[i].SegmentName=='Detail')
        {
            strHtml += '<th class="four"><div class="th-inner">' + ArrSegment[i].SegmentName + '</div></th>';
        }
        else
        {
            strHtml += '<th class="Third"><div class="th-inner">' + ArrSegment[i].SegmentName + '</div></th>';
        }

       
    }
    for (var i = 0; i < response.length; i++) {
        var obj = { TransCode: response[i].TransCode, TransId: response[i].TransactionCodeID }
        ArrTransCode.push(obj);
        strHtml += '<th class="second"><div class="th-inner">' + response[i].TransCode + '</div></th>';
    }
    strHtml += '<th class="Third"><div class="th-inner">Amount</div></th>';
    strHtml += '<th class="Third"><div class="th-inner">Des</div></th>';
    strHtml += '<th class="second"><div class="th-inner">Source</div></th>';
    strHtml += '<th class="second"><div class="th-inner"> </div></th>';

    strHtml += '</tr>';
    $('#tblAdjustmentThead').html(strHtml);
    funGetAdjustmentList();
    //$("#preload").css("display", "none");

    //var heightt = $(window).height();
    //heightt = heightt - 200;
    //$('#DvTB').attr('style', 'height:' + heightt + 'px !important; ');
}

function funGetAdjustmentList() {
    $.ajax({
        url: APIUrlGetAdjustmentList + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

   .done(function (response)
   { GetAdjustmentListSucess(response); })
   .fail(function (error)
   { ShowMSG(error); })
}
function GetAdjustmentListSucess(response) {

    var Tcount = response.length;
    var strHtml = '';
    for (var i = 0; i < Tcount; i++) {
        var COAString = response[i].COAString.replace(/>/g, ' ');
        var strCode = COAString.split('|');
        strHtml += '<tr id="Tr_' + response[i].JournalEntryDetailId + '">';
        strHtml += '<td>' + response[i].VendorName + '</td>';
        strHtml += '<td>' + response[i].TransactionLineNumber + '</td>';
        strHtml += '<td>' + response[i].ThirdParty + '</td>';
        for (j = 0; j < ArrSegment.length; j++) {
            strHtml += '<td>' + strCode[j] + '</td>';
            if (ArrSegment[j].SegmentName == 'Detail')
            { break; }
        }
        for (j = 0; j < ArrTransCode.length; j++) {
            strHtml += '<td><input type="text" onblur="javascript:funCheckTransCode(\'' + ArrTransCode[j].TransCode + '\',' + i + ');" id="txt_' + ArrTransCode[j].TransCode + '_' + i + '" style="width:100% !important;" class="SearchCode clsTransCode' + i + '" onfocus="javascript:funTransDetail(' + i + ',' + ArrTransCode[j].TransId + ')" name="' + ArrTransCode[j].TransId + '"/></td>';
        }
        if (response[i].CreditAmount != 0) {
            strHtml += '<td>' + response[i].CreditAmount + '</td>';
        }
        else {
            strHtml += '<td>' + response[i].DebitAmount + '</td>';
        }
        strHtml += '<td>' + '-' + '</td>';
        strHtml += '<td>' + 'AP' + '</td>';
        strHtml += '<td><a href="#" onclick="javascript:UpdateTransValue(' + response[i].JournalEntryDetailId + ',' + i + ');" class="btn btn-success"><i class="fa  fa-check"></i></a></td>';
        strHtml += '</tr>';
    }
    $('#tblAdjustmentTBody').html(strHtml);

    for (var i = 0; i < Tcount; i++) {
        var StrTransactionvalueString = response[i].TransactionvalueString;
        if (StrTransactionvalueString !== '') {
            var TvstringSplit = StrTransactionvalueString.split(',');

            for (var j = 0; j < TvstringSplit.length; j++) {
                var strTvs = TvstringSplit[j].split(':');
                $('#txt_' + strTvs[0] + '_' + i).val(strTvs[1]);
                $('#txt_' + strTvs[0] + '_' + i).attr('transvalueid', strTvs[2]);

            }
        }
    }
}

//============
var glbarray = [];

function funTransDetail(value, TransId) {


    glbarray = [];
    $.ajax({
        url: APIUrlTranscationCode + '?TransactionCodeID=' + TransId,
        //cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },

        type: 'POST',

        contentType: 'application/json; charset=utf-8',
    })

 .done(function (response) {
     glbarray = [];
     TransDetailSucess(response);
 })
 .fail(function (error)
 { ShowMSG(error); });
}
function TransDetailSucess(response) {

    GblTransValue = [];
    GblTransValue = response;

    var ProductListjson = response;
    glbarray = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.TransactionValueID,
            label: m.TransValue,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".SearchCode").autocomplete({
        minLength: 0,
        source: glbarray,
        focus: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $(this).attr('TransValueId', ui.item.value);
            $(this).val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //// $('#f').val('');
                //$(this).removeAttr('TransValueId');
                //$(this).val('');
            }
        }
    })
}


function UpdateTransValue(JEDId, value) {


    $('#Tr_' + JEDId).attr('style', 'background-color:#4cbf63;');
    var TransString = '';

    var strTrans = $('.clsTransCode' + value);
    for (var j = 0; j < strTrans.length; j++) {
        var strid = strTrans[j].id;
        var strvalue = $('#' + strid).attr('name');
        var strTransValueId = $('#' + strid).attr('TransValueId');
        if (strTransValueId != undefined) {
            TransString += strvalue;
            TransString += ':' + strTransValueId + ',';
        }
    }

    TransString = TransString.slice(0, -1);

    var obj = {
        Type: 'TransactionUpdate',
        JEDId: JEDId,
        TransactionString: TransString
    }

    $.ajax({
        url: APIUrlUpdateJEDDetailByType,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        cache: false,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
    })

   .done(function (response)
   { UpdateTransValueSucess(response); })
   .fail(function (error)
   { UpdateTransValueError(error); })
}
function UpdateTransValueSucess(response) {
    // ShowMsgBox('showMSG', 'Record Update Successfully', '', '');
    // funGetAdjustmentList();

    // $('#Tr_' + JEDId).attr('style', 'background-color:green');



    setTimeout(function () {
        funGetAdjustmentList();
    }, 2000);

}
function UpdateTransValueError(error) {
    $('#Tr_' + JEDId).attr('style', 'background-color:#red;');

}
function ShowMSG(error) {
    console.log(error);
}

function funCheckTransCode(value, Id) {
   
    var strval = $('#txt_' + value + '_' + Id).val();

    if (strval != '') {
        for (var i = 0; i < GblTransValue.length; i++) {
            if (GblTransValue[i].TransValue == strval) {

                $('#txt_' + value + '_' + Id).val(GblTransValue[i].TransValue);
                $('#txt_' + value + '_' + Id).attr('transvalueid', GblTransValue[i].TransactionValueID);
               
                break;
            }
            else {
                $('#txt_' + value + '_' + Id).val('');
                $('#txt_' + value + '_' +Id).removeAttr('transvalueid');
            }
        }
       
    }
}