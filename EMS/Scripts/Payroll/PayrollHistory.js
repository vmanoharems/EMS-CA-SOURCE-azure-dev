
///------------------------------------- Api Calling

var APIUrlFillCompany = HOST + "/api/CompanySettings/GetCompanyList";
var APIUrlGetPayrollHistory = HOST + "/api/Payroll/GetPayrollHistoryNew";
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

/*
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
    var Assign = '';
    if (TLength > 0) {
        for (var i = 0; i < TLength; i++) {
            var CompanyID = response[i].CompanyID;
            var CompanyCode = response[i].CompanyCode;
            if (CompanyCode == localStorage.ShowPayrollHistoryID) {
                Assign = CompanyID;
            }

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
*/

var calcNumberofRowsDisplay = function () {
    return parseInt(($(window).height() - 232) / 30); // Window height minus header/overhead and divide it by the row height with some padding 
};

function FillPayrollHistory() {
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        //, 'PayrollAuditID': PayrollFileID
        , 'PrePage': 'History'
        //, 'PRPeriod': PRPeriod
        //, 'PayrollInvoiceNo': InvoiceNo
    });

    var CID = $('select#ddlCompany option:selected').val();
    $('#tblPayrollHistory').addClass('hidden');

    //let table = $('#tblPayrollHistory').DataTable();
    //table.destroy();

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
    $('#tblPayrollHistory tbody').empty();
    if ($.fn.DataTable.isDataTable('#tblPayrollHistory')) {
        $('#tblPayrollHistory').DataTable().destroy();
    }

    var TLength = response.length;
    var strHtml = ``;
    //strHtml += "<tr><th>EMS Invoice #</th><th>Load Date</th><th>Load #</th><th>Period Ending</th><th>Payroll Count</th><th>Total Amount</th><th>Labor Amount</th><th>Fringe Amount</th><th>Company Code</th><th>Status</th></tr>";
    if (TLength > 0) {
        $('#tblPayrollHistory').removeClass('hidden');
        for (var i = 0; i < TLength; i++) {
            strHtml += "<tr>";
            //strHtml += "<td></td>";
            strHtml += "<td><a href='javascript: PayrollPreview(" + response[i].PayrollFileID + ",\"" + response[i].InvoiceNumber +"\");'>" + response[i].InvoiceNumber + "</a></td>";
           // strHtml += "<td>" + response[i].InvoiceNumber + "</td>";
            strHtml += "<td>" + response[i].CreatedDate + "</td>"; 
            strHtml += "<td>" + response[i].LoadNumber + "</td>";
            strHtml += "<td>" + response[i].EndDate + "</td>";
            //strHtml += "<td>" + response[i].TransactionDate + "</td>";
            strHtml += "<td>" + response[i].PayrollCount + "</td>";
            //strHtml += "<td>" + response[i].TotalPayrollAmount + "</td>";
            strHtml += "<td>$ " + (response[i].TotalPayrollAmount.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";
            strHtml += "<td>$ " + (response[i].LaborAmount.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";

            strHtml += "<td>$ " + (response[i].FringeAmount.toFixed(2) + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</td>";

            strHtml += "<td>" + response[i].CompanyCode + "</td>";
            var Status1 = response[i].Status;
            if (Status1 == "Post") {
                Status1 = 'Posted';
            }
            if (Status1 == "Load") {
                Status1 = 'Saved';
            }
            strHtml += "<td>" + Status1 + "</td>";
            strHtml += "</tr>";
        }
    } else {
        $('#tblPayrollHistory').removeClass('hidden');
        strHtml += "<tr>";
        strHtml += "<td colspan='10' style='text-align:center;'>No Records Found !!</td>";
        strHtml += "</tr>";
    }

    $('#bdyPayrollHistory').html(strHtml);

    if (TLength > 0) {
        if (parseInt(PageCnt) < 500) {
            var PgNo = (PageCnt / 28);
        } else if (parseInt(PageCnt) < 800) {
            var PgNo = (PageCnt / 24);
        }

        var substr = PgNo.toString().split('.');
        showpg = parseInt(substr[0]);

        var table = $('#tblPayrollHistory').DataTable({
            "dom": 'C<"clear"><Rrt<"positionFixed"pli>>'
            //, "iDisplayLength": showpg
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
            , order: [2, 'desc']
            , fixedHeader: true
            , pageLength: Math.round(($(window).height() - 200) / 36)
        });

        $('#tblPayrollHistory thead .filterhead').each(function (i) {
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

        //// Apply the search
        //table.columns().every(function () {
        //    var that = this;

        //    $('input', this.header()).on('keyup change', function () {
        //        if (that.search() !== this.value) {
        //            that
        //                .search(this.value)
        //                .draw();
        //        }
        //    });
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
        $('#tblPayrollHistory').parent().css('overflow', 'scroll');
        $('#tblPayrollHistory').parent().css('max-height', ($(window).height() - 200) + 'px');
        $('#tblPayrollHistory').parent().css('min-height', ($(window).height() - 200) + 'px');
        $('#tblPayrollHistory').parent().css('height', ($(window).height() - 200) + 'px');
        //return;
        //$('#tblPayrollHistory tfoot tr').insertAfter($('#tblPayrollHistory thead tr'));
    }
}

$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});


function PayrollPreview(PayrollFileID, InvoiceNo)
{
    localStorage.PayrollAudit = JSON.stringify({
        'ShowPayrollHistoryCompanyID': $('select#ddlCompany option:selected').val()
        , 'PayrollAuditID': PayrollFileID
        , 'PrePage': 'History'
        //, 'PRPeriod': PRPeriod
        , 'PayrollFileID': PayrollFileID
        , 'PayrollInvoiceNo': InvoiceNo
    });
    //localStorage.PayrollPreviewID = PayrollFileID;
    //localStorage.PayrollInvoiceNo = InvoiceNo;
    localStorage.PrePage = 'History';
    //console.log(localStorage.PrePage);
    window.location = HOST + "/Payroll/PayrollPreview";
}

function backToPre() {
    if (sessionStorage.selectedId == undefined) {

    } else {
        setTimeout(function () {
            //$('#ddlCompany').val(sessionStorage.selectedId);
            FillPayrollHistory();
        }, 500);
    }
}
backToPre();