   

//--------  API Colling 12/26/2015-- -----------//
var APIUrlPrintVendorMailPDF = HOST + "/api/ReportAPI/GetVendorAddPO";
var APIUrlFillVendor = HOST + "/api/POInvoice/GetVendorAddPO";
//-----------Global  Varable --------//

//---------End Decelaration-------//

$(document).ready(function () {
    FillVendor();
  //  PrintVendormailPDF();
    $('#UlReports li').removeClass('active');
    $('#LiVendorMailing').addClass('active');

});
function PrintVendormailPDF() {
    alert('00');
    $.ajax({
        url: APIUrlPrintVendorMailPDF + '?ProdID=' + localStorage.ProdId,
        cache: false,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        contentType: 'application/json; charset=utf-8',
    })
     .done(function (response)
     { PrintVendormailPDFSucess(response); })
     .fail(function (error)
     { ShowMSG(error); })
}
function ShowMSG(error) {
    console.log(error);
}
function PrintVendormailPDFSucess(response) {
    alert('PDF VMailing');
    var fileName = "VMailingReport.pdf";
    $("#dialog").dialog({
        modal: true,
        title: fileName,
        width: 840,
        height: 500,
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }

        },
        open: function () {
            var object = "<object data=\"{FileName}\" type=\"application/pdf\" width=\"800px\" height=\"350px\">";
            object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
            object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
            object += "</object>";

            object = object.replace(/{FileName}/g, /CheckPDF/ + fileName);

            $("#dialog").html(object);
        }
    });

}


//==================Showing vendor Mailing Address==================//

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
function FillVendorSucess(response) {
    var strHtml = '';
    var Tcount = response.length;
    for (i = 0; i < Tcount; ) {
        strHtml += '<tr>';
        if (i >= Tcount) {
            strHtml += '<td></td>';
        }
        else {
            strHtml += '<td>' + response[i].VendorName + '</br>' + response[i].Addressw9 + '</br>' + response[i].Address2w9 + '</td>';
            i++;
        }
        if (i >= Tcount) {
            strHtml += '<td></td>';
        }
        else {
            strHtml += '<td>' + response[i].VendorName + '</br>' + response[i].Addressw9 + '</br>' + response[i].Address2w9 + '</td>';
            i++;
        }
        
        if (i >= Tcount) {
            strHtml += '<td></td>';
        }
        else {
            strHtml += '<td>' + response[i].VendorName + '</br>' + response[i].Addressw9 + '</br>' + response[i].Address2w9 + '</td>';
            i++;
        }
        strHtml += '</tr>';
    }
    $('#TblTblVendrMailingTbody').html(strHtml);
}






