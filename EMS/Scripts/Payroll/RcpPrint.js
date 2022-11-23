
var APIUrlFillClient = HOST + "/api/Payroll/GetPayrollFileUserListByPayrollID";
var APIUrlGetFillCheckInfo = HOST + "/api/Payroll/GetPayrollExpenseByPayrollUser";

$(document).ready(function () {
    FillClient();
});


function FillClient() {
    var PayrolID = localStorage.PayrollIDRcpPrint;
    $.ajax({
        url: APIUrlFillClient + '?PayrollFileID=' + PayrolID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
       
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillClientSucess(response); })
     .fail(function (error)
     { console.log(error); })

}
function FillClientSucess(response) {
    var TLength = response.length;

    $('#ddlClient').empty();
    $("#ddlClient").append("<option  value=0>Select</option>");
    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {
            var PayrollUserID = response[i].PayrollUserID;
            var Name = response[i].Name;

            $("#ddlClient").append("<option  value=" + PayrollUserID + ">" + Name + "</option>");
        }
     
    }
}

function FillCheckInfo() {
    var ClientID = $('select#ddlClient option:selected').val();
    $.ajax({
        url: APIUrlGetFillCheckInfo + '?PayrollFileID=' + localStorage.PayrollIDRcpPrint + '&PayrollUserID=' + ClientID,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
       
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillCheckInfoSucess(response); })

}
function FillCheckInfoSucess(response) {
    var TLength = response.length;
    var strHtml = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            strHtml += "<tr>";

            strHtml += "<td>" + response[i].PaymentAccount + "</td>";
            strHtml += "<td>" + response[i].PayDescription + "</td>";
            strHtml += "<td>" + response[i].PaymentAmount + "</td>";
            strHtml += "</tr>";
        }
    }
    else {
        strHtml += "<tr>";
        strHtml += "<td colspan='3' style='text-align:center;'>No Records Found !!</td>";
        strHtml += "</tr>";
    }

    $('#tblCheck').html(strHtml);

    $('#spanClientName').html($('select#ddlClient option:selected').text());
    $('#spanCheckNo').html(response[0].CheckNumber);

    $('#spanGross').html(response[0].TotalAmt);
    $('#spanNet').html(response[0].LaborAmt);
    $('#spanCompany').html(response[0].CompanyName);
}

