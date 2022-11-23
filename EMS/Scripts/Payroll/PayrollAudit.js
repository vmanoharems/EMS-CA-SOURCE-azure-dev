
///------------------------------------- Api Calling

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetPayrollHistory = HOST + "/api/Payroll/GetPayrollAuditList";
var APIUrlPrintPDF = HOST + "/api/ReportP1/RunPayrollEditReportPDF";

var heightt;
var GlobalFile;

$(document).ready(function () {
    //FillCompany();
    AtlasForms.Controls.DropDown.RenderURL(AtlasForms.FormItems.ddlCompanyList(
        {
            'callback': FillPayrollHistory
            , 'existingValue': parseInt(JSON.parse(localStorage.PayrollAudit || '{}').ShowPayrollHistoryCompanyID)
        }
    ));
});

function FillCompany() {
    $.ajax({
        url: APIUrlFillCompany + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',

        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillCompanySucess(response);
    })
}

function FillCompanySucess(response) {
    var TLength = response.length;

    $('#ddlCompany').empty();
    //$("#ddlCompany").append("<option  value=0>Select</option>");
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            var CompanyID = response[i].CompanyID;
            var CompanyCode = response[i].CompanyCode;
            $("#ddlCompany").append("<option  value=" + CompanyID + ">" + CompanyCode + "</option>");
        }
        $('#dvCompany').attr('style', 'display:block;');
        FillPayrollHistory();
    }

    if (JSON.parse(localStorage.PayrollAudit).ShowPayrollHistoryCompanyID != null) {
        $('#ddlCompany').val(JSON.parse(localStorage.PayrollAudit).ShowPayrollHistoryCompanyID);
        FillPayrollHistory();
        localStorage.removeItem("ShowPayrollHistoryID");
    }
}

var calcNumberofRowsDisplay = function () {
    return parseInt(($(window).height() - 232) / 33); // Window height minus header/overhead and divide it by the row height with some padding 
};

function FillPayrollHistory() {
    var CID = $('select#ddlCompany option:selected').val();
    $('#tblAudit').addClass('hidden');

    $.ajax({
        url: APIUrlGetPayrollHistory + '?CompanyID=' + CID + '&UserID=' + localStorage.UserId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        FillPayrollHistorySucess(response);
    })
}

function FillPayrollHistorySucess(response) {
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
    if ($.fn.dataTable.isDataTable('#tblAudit')) {
        $('#tblAudit').dataTable().fnDestroy();
    }

    var TLength = response.length;
    var strHtml = '';
    //strHtml += "<tr><th>Edit Invoice</th><th>Run Edit Report</th><th>Load #</th><th>Invoice No.</th><th>Load Date</th><th>Period Ending</th><th>Transaction Date</th><th>Payroll Count</th><th>Total Amount</th><th>Invoiced</th><th>Company Code</th></tr>";
    $('#tblAudit').removeClass('hidden');
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            strHtml += "<tr>";

            var Status1 = response[i].Status;
            if (Status1 == "Post") {
                strHtml += `<td><a href='javascript: AuditPayroll("${response[i].InvoiceNumber}", ${response[i].PayrollFileID})'>POSTED</a></td>`;
            } else {
                strHtml += `<td><a href='javascript: AuditPayroll("${response[i].InvoiceNumber}", ${response[i].PayrollFileID}, ${response[i].CompanyPeriod})'>Edit</a></td>`;
            }
            strHtml += "<td style='text-align:center;'><a href='javascript: PREditReport_Print(" + response[i].PayrollFileID + ");' style='font-size:24px;'><i class='fa fa-caret-right'></i></a> </td>";
            strHtml += "<td>" + response[i].LoadNumber + "</td>";
            strHtml += "<td>" + response[i].InvoiceNumber + "</td>";
            strHtml += "<td>" + response[i].CreatedDate + "</td>";
            strHtml += "<td>" + response[i].EndDate + "</td>";
            strHtml += "<td>" + response[i].TransactionDate + "</td>";
            strHtml += "<td>" + response[i].PayrollCount + "</td>";
            //strHtml += "<td>" + response[i].TotalPayrollAmount + "</td>";
            strHtml += "<td>$ " + (response[i].TotalPayrollAmount + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";

            if (response[i].InvoicedFlag == true) {
                strHtml += "<td>YES</td>";
            } else {
                strHtml += "<td>NO</td>";
            }
            strHtml += "<td>" + response[i].CompanyCode + "</td>";
            strHtml += "</tr>";
        }
    } else {
        strHtml += "<tr>";
        strHtml += "<td colspan='11' style='text-align:center;'>No Records Found !!</td>";
        strHtml += "</tr>";
    }
    $('#bdyPayrollAudit').html(strHtml);
    if (TLength > 0) {
        var table = $('#tblAudit').dataTable({
            "order": [[2, 'desc']],
            "pageLength": calcNumberofRowsDisplay()
        });
    }
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        //, 'PayrollAuditID': PayrollFileID
        //, 'PrePage': 'Audit'
        //, 'PRPeriod': PRPeriod
    });

}

function AuditPayroll(InvoiceNumber, PayrollFileID, PRPeriod) {
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        , 'PayrollAuditID': PayrollFileID
        , 'PrePage': 'Audit'
        , 'PRPeriod': PRPeriod
        , 'PayrollInvoiceNo': InvoiceNumber
    });
    //localStorage.ShowPayrollHistoryCompanyID = $('select#ddlCompany option:selected').val();
    //localStorage.PayrollAuditID = PayrollFileID;
    localStorage.PrePage = 'Audit';
    window.location = "/Payroll/PayrollEdit";
}



function PayrollPreview(PayrollFileID, InvoiceNo) {
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        , 'PayrollAuditID': PayrollFileID
        , 'PrePage': 'Audit'
        , 'PayrollInvoiceNo': InvoiceNo
    });
    //localStorage.PayrollPreviewID = PayrollFileID;
    //localStorage.PayrollInvoiceNo = InvoiceNo;
    window.location = "/Payroll/PayrollPreview";
}


function PREditReport_Print(PayrollFileID) {
    var objFinalres = {
    }
    //  $('#dvWait').attr('style', 'display: block;width: 100%;margin: auto 0px;text-align: center;top: 30%;');
    objFinalres.ReportTitle = 'Payroll Audit';
    objFinalres.callingDocumentTitle = 'Reports > Ledger > JE Posting';
    let RE = new ReportEngine(APIUrlPrintPDF + '?ProdId=' + localStorage.ProdId + '&PayrollFileID=' + PayrollFileID + '&ProName=' + localStorage.ProductionName, objFinalres);
    RE.RunReport({ DisplayinTab: true });
    $("#preload").css("display", "none");
    return false;
/*
        $.ajax({
            url: APIUrlPrintPDF + '?ProdId=' + localStorage.ProdId + '&PayrollFileID=' + PayrollFileID + '&ProName=' + localStorage.ProductionName,
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(objFinalres),
          
        })
       .done(function (response) {
           PREditReport_Print_Success(response);
       })
       .fail(function (error)
       { ShowMSG(error); })
*/
}
/*
function PREditReport_Print_Success(FileName) {
    //alert(2);
    if (FileName == '') {
        alert('Data not found for given Values.');
    } else {
        heightt = $(window).height();
        heightt = heightt - 180;
        $('#dvMainDv').attr('style', 'height:' + heightt + 'px;');
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;');


        var fileName = FileName + ".pdf";
        GlobalFile = fileName;
        $('#dialog11').attr('style', 'width:100%;height:' + heightt + 'px;display:block;');
        var FILECompleteName = 'Reports/PayrollPDF/' + fileName;
        var DialogContent = '<object data="' + FILECompleteName + '" type="application/pdf" style="width:100%;height:100%;"><a href="' + FILECompleteName + '">ii</a> </object>';
        DialogContent = DialogContent + '<a href="#" style="margin:0 20px 0 10px;" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript:PrintBrowserPDF();" id="btnPrint">Print</a>';
        DialogContent = DialogContent + '<a href="#" class="btn btn-default floatRight  pull-right marginLeft10" onclick="javascript: ClosePDF();" id="btnClose">Close</a>';
        $('#dialog11').html(DialogContent);

        $('#dvFilterDv').attr('style', 'display:none');
        //$("#dialog").dialog({
        //    modal: true,
        //    title: fileName,
        //    width: 1080,
        //    height: 500,
        //    buttons: {
        //        Close: function () {
        //            $(this).dialog('close');
        //        },

        //        Print: function () {
        //            VerifyCheck(/PayrollPDF/ + fileName);
        //        }
        //    },
        //    open: function () {
        //        var object = "<object data=\"{FileName}\" type=\"application/pdf\" width=\"100%\" height=\"350px\">";
        //        object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
        //        object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
        //        object += "</object>";

        //        object = object.replace(/{FileName}/g, /PayrollPDF/ + fileName);

        //        $("#dialog").html(object);
        //    }
        //});
    }

    $('#dvWait').attr('style', 'display:none;');
}
*/
function PrintBrowserPDF() {
    var PDFURL = 'Reports/PayrollPDF/' + GlobalFile;
    var w = window.open(PDFURL);
    w.print();
}

function ClosePDF() {
    $('#dialog11').attr('style', 'display:none;');
    $('#dvFilterDv').attr('style', 'display:block');
}