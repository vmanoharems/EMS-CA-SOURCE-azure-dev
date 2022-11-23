///------------------------------------- Api Calling
var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetPayrollHistory = HOST + "/api/Payroll/GetPayrollHistoryNew";
var APIUrlPrintChecks = HOST + "/api/Payroll/PayrollCheckPrint";
var showpg = 0;
var PageCnt;
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
   // $("#ddlCompany").append("<option  value=0>Select</option>");
    if (TLength > 0) {

        for (var i = 0; i < TLength; i++) {
            var CompanyID = response[i].CompanyID;
            var CompanyCode = response[i].CompanyCode;

            $("#ddlCompany").append("<option  value=" + CompanyID + ">" + CompanyCode + "</option>");
        }
        $('#dvCompany').attr('style', 'display:block;');
        FillPayrollHistory();
    }
}

function backToPre(){
    if(sessionStorage.selectedId === undefined){
       
    } else {
        setTimeout(function(){
            $('#ddlCompany').val(sessionStorage.selectedId);
            FillPayrollHistory();
        },500);
    }
}
backToPre();

var calcNumberofRowsDisplay = function () {
    return parseInt(($(window).height() - 232) / 33); // Window height minus header/overhead and divide it by the row height with some padding 
};

function FillPayrollHistory() {
    var CID = $('select#ddlCompany option:selected').val();
    sessionStorage.selectedId = CID;
    $('#tblPayrollRCP').addClass('hidden');

    $.ajax({
        url: APIUrlGetPayrollHistory + '?CompanyID=' + CID+'&UserID=' + localStorage.UserId,
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
    if ($.fn.dataTable.isDataTable('#tblPayrollRCP')) {
        $('#tblPayrollRCP').dataTable().fnDestroy();
    };

    var TLength = response.length;
    var strHtml = '';
    //strHtml += "<tr><th>Print</th><th>Load #</th><th>Invoice No.</th><th>Load Date</th><th>Period Ending</th><th>Transaction Date</th><th>#Checks</th><th>Total Amount</th><th>Labor Amount</th><th>Fringe Amount</th><th>Invoiced</th><th>Company Code</th><th>Posted</th></tr>";

    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            strHtml += "<tr>";
            //strHtml += "<td></td>";
            var IsPosted = response[i].PrintStatus;
            if (IsPosted === "Print") {
                strHtml += "<td><a id='DLPayrollfileID_" + response[i].PayrollFileID + "' href='javascript:RcpPrint(" + response[i].PayrollFileID + "," + response[i].PayrollCount + ")'>Print</a></td>";
            } else {
                strHtml += "<td>" + response[i].PrintStatus + "</td>";
            }

            strHtml += "<td>" + response[i].LoadNumber + "</td>";
            //strHtml += "<td>" + response[i].InvoiceNumber + "</td>";
            strHtml += `<td><a href='javascript: PayrollPreview(${response[i].PayrollFileID}, "${response[i].InvoiceNumber}")'>${response[i].InvoiceNumber}</a></td>`;
            strHtml += "<td>" + response[i].CreatedDate + "</td>";

            strHtml += "<td>" + response[i].EndDate + "</td>";
            strHtml += "<td>" + response[i].TransactionDate + "</td>";
            strHtml += "<td>" + response[i].PayrollCount + "</td>";
          
            strHtml += "<td>$ " + (response[i].TotalPayrollAmount.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";
            strHtml += "<td>$ " + (response[i].LaborAmount.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";

            strHtml += "<td>$ " + (response[i].FringeAmount.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";

            if (response[i].InvoicedFlag === true) {
                strHtml += "<td>YES</td>";
            } else {
                strHtml += "<td>NO</td>";
            }

            strHtml += "<td>" + response[i].CompanyCode + "</td>";
            IsPosted = response[i].PostedFlag;
            if (IsPosted === true) {
                strHtml += "<td>Yes</td>";
            } else {
                strHtml += "<td>No</td>";
            }
            strHtml += "</tr>";
        }
    } else {
        strHtml += "<tr>";
        strHtml += "<td colspan='13' style='text-align:center;'>No Records Found !!</td>";
        strHtml += "</tr>";
    }

    $('#bodyPayrollRCP').html(strHtml);

    if (TLength > 0) {
        var PgNo = (PageCnt / 28);
        if (parseInt(PageCnt) < 500) {
            PgNo = (PageCnt / 28);
        } else if (parseInt(PageCnt) < 800) {
            PgNo = (PageCnt / 24);
        }

        var substr = PgNo.toString().split('.');
        showpg = parseInt(substr[0]);

        var table = $('#tblPayrollRCP').DataTable({
            "dom": 'C<"clear"><Rrt<"positionFixed"pli>>',
            "iDisplayLength": showpg
            //responsive: {
            //    details: {
            //        //  type: 'column',
            //    }
            //},
            //columnDefs: [{
            //    className: 'control',
            //    orderable: false,
            //    targets: 0,
            //}],
            , ordering: true
            , orderCellsTop: true
            , order: [1, 'desc']
            , pageLength: Math.round(($(window).height() - 200) / 36)
        });

        $('#tblPayrollRCP thead .filterhead').each(function (i) {
            //var title = $('#tblPayrollHistory thead th').eq($(this).index()).text();
            //$(this).html('<input type="text" style="width:100%;" placeholder=" ' + title + '" />');
            var title = $(table.column(i).header()).text();
            var inputtxt = $('<input type="text" style="width:100%;" placeholder=" ' + title + '" />')
                    .appendTo($(this).empty())
                    .on('keyup change', function () {
                        var term = $(this).val();
                        table.column(i).search($(this).val(), false, false).draw();
                    });
        });

        //$('#tblPayrollRCP tfoot th').each(function () {
        //    var title = $('#tblPayrollRCP thead th').eq($(this).index()).text();
        //        $(this).html('<input type="text" style="width:100%;" placeholder=" ' + title + '" />');
        //});

        //table.columns().eq(0).each(function (colIdx) {
        //    $('input', table.column(colIdx).footer()).on('keyup change', function () {
        //        table
        //            .column(colIdx)
        //            .search(this.value)
        //            .draw();
        //    });
        //    $('select', table.column(colIdx).footer()).on('keyup change', function () {
        //        table
        //            .column(colIdx)
        //            .search(this.value)
        //            .draw();
        //    });
        //});
        $('#tblPayrollRCP').parent().css('overflow', 'scroll');
        $('#tblPayrollRCP').parent().css('max-height', ($(window).height() - 200) + 'px');
        $('#tblPayrollRCP').parent().css('min-height', ($(window).height() - 200) + 'px');
        $('#tblPayrollRCP').parent().css('height', ($(window).height() - 200) + 'px');
        //$('#tblPayrollRCP tfoot tr').insertAfter($('#tblPayrollRCP thead'));
    }

    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        //, 'PayrollAuditID': PayrollFileID
        , 'PrePage': 'RCP'
        //, 'PRPeriod': PRPeriod
        //, 'PayrollInvoiceNo': InvoiceNo
    });

    $('#tblPayrollRCP').removeClass('hidden');

}

$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});

function RcpPrint(PayrollFileID, CheckCount) {
    localStorage.PayrollIDRcpPrint = PayrollFileID;
    // window.location.hre = 'PayrollEdit';
    //  window.location = HOST + "/Payroll/RcpPrint";

    $('#dvConfirm').attr('style', 'display:block;');
    $('.checksCnt').html(CheckCount);
}

function Print() {
    $.ajax({
        url: APIUrlPrintChecks + '?PayrollFileID=' + localStorage.PayrollIDRcpPrint + '&ProName=' + localStorage.ProductionName,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })
    .done(function (response) {
        PrintPDF(response);
        $("#DLPayrollfileID_"+localStorage.PayrollIDRcpPrint).html("Printed");
        $("#DLPayrollfileID_"+localStorage.PayrollIDRcpPrint).removeAttr("href");
    })
}

function PrintPDF(response) {
    var fileName = response + ".pdf";
    var w = window.open(fileName);
    w.print();
    window.location.href = 'PayrollRCP';
    return;

    $("#dialog").data('PDFFILEURL',fileName);
    $("#dialog").dialog({
        modal: true,
        title: fileName,
        width: 840,
        height: 500,
        buttons: {
            Close: function () {
                //$(this).dialog('close');
                window.location.href = 'PayrollRCP';
            }
            , Print: function () {
                console.log('Verifying Check print: ')
                console.log ($("#dialog").data('PDFFILEURL'));
                alert($("#dialog").data('PDFFILEURL'));
                var w = window.open(fileName);
                w.print();
                window.location.href = 'PayrollRCP';
            }
        },
        open: function () {
            var object = "<object data=\"{FileName}#toolbar=0&navpanes=0&scrollbar=0\" type=\"application/pdf\" width=\"800px\" height=\"350px\">";
            object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
            object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
            object += "</object>";
            //var object = "<iframe onload=\"AutoPrint('"+fileName+"')\" id='iframePDF' src=\"{FileName}#toolbar=0&navpanes=0&scrollbar=0\" type=\"application/pdf\" width=\"800px\" height=\"350px\">";
            //object += "If you are unable to view file, you can download from <a href=\"{FileName}\">here</a>";
            //object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
            //object += "</iframe>";

            object = object.replace(/{FileName}/g, fileName);

            $("#dialog").html(object);
            
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function AutoPrint(response) {
    try {
        var iframe = document.getElementById('iframePDF');
        if (iframe.src) {
            var frm = iframe.contentWindow;

            iframe.contentWindow.focus();// focus on contentWindow is needed on some versions  
            iframe.contentWindow.print();
            $("#dialog").dialog('close');
//            window.location.href = 'PayrollRCP';
        }
    } catch (e) {
        alert(e.description);
    }
}

function PayrollPreview(PayrollFileID, InvoiceNo) {
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        , 'PayrollAuditID': PayrollFileID
        , 'PrePage': 'RCP'
        , 'PayrollFileID': PayrollFileID
        , 'PayrollInvoiceNo': InvoiceNo
    });
    localStorage.PrePage = 'RCP';
    window.location = HOST + "/Payroll/PayrollPreview";
}
