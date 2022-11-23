
//-------- -  Api Calling 12/31/2015-- -----------//
var APIUrlGetSourceCodeDetails = HOST + "/api/CompanySettings/GetSourceCodeDetails";
var TabIDD = 0;


$(document).ready(function () {
    GetAllSourceType();
})
//-------- -  GetAllSourceType 12/27/2015-- -----------//
function GetAllSourceType() {
    TabIDD = 1;
    $('#LiAccounttypebreadcrumb').text('Source Codes');
    $.ajax({
        url: APIUrlGetSourceCodeDetails + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
       
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { GetAllSourceTypeByProdIdSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function ShowMSG(error) {
    console.log(error);
}
function GetAllSourceTypeByProdIdSucess(response) {
    var strHtml = '';
    var TCount = response.length;
 
    for (var i = 0; i < TCount; i++) {
        var Code = response[i].Code;
        var Description = response[i].Description;
        var AP = response[i].AP;
        var JE = response[i].JE;
        var PO = response[i].PO;
        var PC = response[i].PC;
        var AR = response[i].AR;
        var PR = response[i].PR;
        var WT = response[i].WT;
        var Thirdparty = response[i].Thirdparty;
        strHtml += '<tr>';
        strHtml += '<td>' + Code + '</td>';
        strHtml += '<td>' + Description + '</td>';
        var CheckedStatusAP = '';
        if (AP == true) {
            CheckedStatusAP = "checked";
        }
        strHtml += '<td><input ' + CheckedStatusAP + ' disabled type="checkbox" id="Chk' + AP + '" value="' + Code + '" onclick="javascript:statusUpdate(' + AP + ')";/> </td>';

        var CheckedStatusJE = '';
        if (JE == true) {
            CheckedStatusJE = "checked";
        }
        strHtml += '<td><input ' + CheckedStatusJE + ' disabled type="checkbox" id="Chk' + JE + '" value="' + Code + '" onclick="javascript:statusUpdate(' + JE + ')";/> </td>';

        var CheckedStatusPO = '';
        if (PO == true) {
            CheckedStatusPO = "checked";
        }
        strHtml += '<td><input ' + CheckedStatusPO + ' disabled type="checkbox" id="Chk' + PO + '" value="' + Code + '" onclick="javascript:statusUpdate(' + PO + ')";/> </td>';

         var CheckedStatusPC = '';
        if (PC == true) {
            CheckedStatusPC = "checked";
        }
        strHtml += '<td><input ' + CheckedStatusPC + ' disabled type="checkbox" id="Chk' + PC + '" value="' + Code + '" onclick="javascript:statusUpdate(' + PC + ')";/> </td>';

        var CheckedStatusAR = '';
        if (AR == true) {
            CheckedStatusAR = "checked";
        }
        strHtml += '<td><input ' + CheckedStatusAR + ' disabled type="checkbox" id="Chk' + AR + '" value="' + Code + '" onclick="javascript:statusUpdate(' + AR + ')";/> </td>';

        var CheckedStatusPR = '';
        if (PR == true) {
            CheckedStatusPR = "checked";
        }
        strHtml += '<td><input ' + CheckedStatusPR + ' disabled type="checkbox" id="Chk' + PR + '" value="' + Code + '" onclick="javascript:statusUpdate(' + PR + ')";/> </td>';
        var CheckedStatusWT = '';
        if (WT == true) {
            CheckedStatusWT = "checked";
        }
        strHtml += '<td><input ' + CheckedStatusWT + ' disabled type="checkbox" id="Chk' + WT + '" value="' + Code + '" onclick="javascript:statusUpdate(' + WT + ')";/> </td>';

        strHtml += '<td><input type="textbox" id="txt' + Thirdparty + '" class="form-control" disabled value="' + Thirdparty + '"/> </td>';
    
        strHtml += '</tr>';
    }
    $('#tblSourceCodeTBody').html(strHtml);
    for (var i = 0; i < TCount; i++) {
        var Code = response[i].Code;
       $('#Chk' + Code).prop('checked', Code);
        
    }
}


