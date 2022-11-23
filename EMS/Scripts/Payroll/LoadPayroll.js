
///------------------------------------- Api Calling

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlOverWriteAdminPayroll = HOST + "/api/Payroll/OverWriteAdminPayrollFile";
var APIUrlImportAdminPayroll = HOST + "/api/Payroll/InsertAdminPayrollFile";
var APIUrlGetPayrollList = HOST + "/api/Payroll/GetAdminPayrollFile";

var  GetCompanyDetails = [];
$('#txtCO').click(function () {
    FillCompany();
})
$('#txtCO').focus(function () {
    FillCompany();
})
$(document).ready(function () {

    GetPayrollFile();
   
});
//--------------------------------------------------- CompanyCode   
function FillCompany() {
    $.ajax({
        url: APIUrlFillCompany + '?ProdId=' + localStorage.AdminProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'GET',
       
        contentType: 'application/json; charset=utf-8',
    })

    .done(function (response)
    { FillCompanySucess(response); })
    .fail(function (error)
    { ShowMSG(error); })
}
function FillCompanySucess(response) {
    GetCompanyDetails = [];
    GetCompanyDetails = response;
    var ProductListjson = response;
    var array = response.error ? [] : $.map(response, function (m) {
        return {
            value: m.CompanyID,
            label: m.CompanyCode,
            //  BuyerId: m.BuyerId,
        };
    });
    $(".CompnayCode").autocomplete({
        minLength: 0,
        source: array,
        focus: function (event, ui) {

            $("#hdnCO").val(ui.item.value);
            $('#txtCO').val(ui.item.label);
            return false;
        },
        select: function (event, ui) {

            $("#hdnCO").val(ui.item.value);
            $('#txtCO').val(ui.item.label);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                //$(this).val('');
                //$("#hdnCO").val('');
                //$('#txtCO  ').val('');
            }
        }
    })
}

function UploadPayrollFile() {

    var data = new FormData();
    var files = $("#fileXML").get(0).files;

    if (files.length > 0) {
        $('#fileXML').attr('style', 'border: none;');

        var isvalid = "";
      //  isvalid += CheckRequired($("#txtInvoice"));
        isvalid += CheckRequired($("#txtCO"));
        if (isvalid == "") {
            $('#dvWait').attr('style', 'display:block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');

            data.append("PayrollFileXML", files[0]);
            data.append("InvoiceRef", '');
            data.append("CompanyID", $('#hdnCO').val());
            data.append("prodid", localStorage.AdminProdId);
            data.append("uploadedby", localStorage.AdminUserID);
            data.append("KeyID", $('#txtKey').val());

            var ajaxRequest = $.ajax({
                type: "POST",
                url: APIUrlImportAdminPayroll,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
                },
                cache: false,
                contentType: false,
                processData: false,        
                data: data
            });
            ajaxRequest.done(function (response) {
                //if (response[0].Result == 1) {
                //    GetPayrollFile();
                //}
                $('#txtKey').val('');
                if (response == "1") {
                    GetPayrollFile();
                    $('#dvWait').attr('style', 'display:none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
                }
                else if (response == "InValid") {
                    var Msg = 'Invalid passphrase Key!!';
                    ShowMsgBox('showMSG', Msg, '', 'failuremsg');
                    $('#dvWait').attr('style', 'display:none;');
                }
                else if (response.length > 100) { // We have an error message
                    var Msg = 'Unable to load this Payroll file!';
                    ShowMsgBox('showMSG', Msg, '', 'failuremsg');
                    $('#dvWait').attr('style', 'display:none;');
                }
                else {
                    $('#spanInvoice').html(response[0].InvoiceNumber);
                    $('#dvConfirm').attr('style', 'display:block;');
                    $('#dvWait').attr('style', 'display:none;');
                }
            });
            hideDiv('default');
           
        }
    }
    else {
        $('#fileXML').attr('style', 'border: 1px solid red !important;');
    }
}

function overWritePayroll()
{
    $('#dvConfirm').attr('style', 'display:none;');
    var data = new FormData();
    var files = $("#fileXML").get(0).files;

    if (files.length > 0) {
        $('#fileXML').attr('style', 'border: none;');

        var isvalid = "";
        //  isvalid += CheckRequired($("#txtInvoice"));
        isvalid += CheckRequired($("#txtCO"));
        if (isvalid == "") {
            $('#dvWait').attr('style', 'display:block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
            data.append("PayrollFileXML", files[0]);
            data.append("InvoiceRef", '');
            data.append("CompanyID", $('#hdnCO').val());
            data.append("prodid", localStorage.AdminProdId);
            data.append("uploadedby", localStorage.AdminUserID);

            var ajaxRequest = $.ajax({
                type: "POST",
                url: APIUrlOverWriteAdminPayroll,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
                },
                cache: false,
                contentType: false,
                processData: false,
                data: data
            });
            ajaxRequest.done(function (response) {
                if (response[0].Result == 1) {
                    GetPayrollFile();
                }
                else {
                    $('#spanInvoice1').html(response[0].InvoiceNumber);
                    $('#dvOverWrite').attr('style', 'display:block;');
                }
            });
            hideDiv('default');
            $('#dvWait').attr('style', 'display:none;');
        }
    }
    else {
        $('#fileXML').attr('style', 'border: 1px solid red !important;');
        $('#dvWait').attr('style', 'display:none;');
    }

    $('#dvWait').attr('style', 'display:none;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
}

function GetPayrollFile() {
    //$('#txtInvoice').val('');
    $('#txtCO').val('');
    $('#hdnCO').val('');
    $('#fileXML').val('');

    var ProdID = localStorage.AdminProdId;
    $.ajax({
        url: APIUrlGetPayrollList + '?Prodid=' + ProdID,
        chache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.AdminEMSKeyToken);
        },
        type: 'GET',      
        contentType: 'application/json; charset=utf-8',
    })

       .done(function (response)
       { GetPayrollFileSucess(response); })
}

function GetPayrollFileSucess(response) {
    var TLength = response.length;
    $('#tblPayroll').empty();
    $('#tblPayroll').append('<tr><th>Print</th><th>Load #</th><th>Invoice No.</th><th>Upload Date</th><th>Period Ending</th><th>Company Code</th><th>Total Amount</th><th>Invoiced</th></tr>');

    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {

            var PrintedFlag = response[i].PrintStatus;
            var LoadNumber = response[i].LoadNumber;
            var InvoiceNumber = response[i].InvoiceNumber;
            var CreatedDate = response[i].CreatedDate;
            var EndDate = response[i].EndDate;
            var CompanyCode = response[i].CompanyCode;
            var TotalPayrollAmount = response[i].TotalPayrollAmount;
            var InvoicedFlag = response[i].InvoicedFlag;

            $('#tblPayroll').append('<tr><td>' + PrintedFlag + '</td><td>' + LoadNumber + '</td><td>' + InvoiceNumber + '</td><td>' + CreatedDate + '</td><td>' + EndDate + '</td><td>' + CompanyCode + '</td><td>' + TotalPayrollAmount.toFixed(2) + '</td><td>' + InvoicedFlag + '</td></tr>');
        }
    }
    else {
        $('#tblBudget').append('<tr><td colspan="8" style="text-align: center;">No Record Found !!!</td></tr>');
    }
}


//================CheckCompany======================//
$('#txtCO').blur(function () {
    var StrCheckCompany = $('#txtCO').val().trim();
    if (StrCheckCompany != '')
    {
        for (var i = 0; i < GetCompanyDetails.length; i++)
        {
            if (GetCompanyDetails[i].CompanyCode == StrCheckCompany)
            {
                $('#hdnCO').val(GetCompanyDetails[i].CompanyID);
                $('#txtCO').val(GetCompanyDetails[i].CompanyCode);

                break;
            }
            else {
                $('#hdnCO').val(' ');
                $('#txtCO').val('');

            }
        }

        for (var i = 0; i < GetCompanyDetails.length; i++)
        {
            if (GetCompanyDetails[i].CompanyCode.substring(0, StrCheckCompany.length) === StrCheckCompany)
            {
                $('#hdnCO').val(GetCompanyDetails[i].CompanyID);
                $('#txtCO').val(GetCompanyDetails[i].CompanyCode);
                break;
            }
        }
    }
    else {
        $('#hdnCO').val(GetCompanyDetails[0].CompanyID);
        $('#txtCO').val(GetCompanyDetails[0].CompanyCode);
    }

})