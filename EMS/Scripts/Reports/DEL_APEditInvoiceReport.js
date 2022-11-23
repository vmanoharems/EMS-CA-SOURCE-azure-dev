var APIUrlGetInvoiceList = HOST + "/api/POInvoice/GetInvoiceListPosted";
var APIUrlGetGetInvoicePDF = HOST + "/api/ReportAPI/UpdateInvoiceStatus";

var showpg = 0;
var PageCnt;

$(document).ready(function () {
    $('#UlAccountPayable li').removeClass('active');
    $('#LiInvoice').addClass('active');
    GetInvoiceList();
});


function GetInvoiceList()
{
    $.ajax({
        url: APIUrlGetInvoiceList + '?ProdId=' + localStorage.ProdId,
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
        },
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
    })

.done(function (response)
{ GetInvoiceListSucess(response); })
.fail(function (error)
{ console.log(error); })
}

function GetInvoiceListSucess(response)
{
    var strhtml = '';
    var Tcount = response.length;
  
    for (var i = 0; i < Tcount; i++) {
        strhtml += '<tr>';
       // strhtml += '<td><input type="checkBox" id="chk_' + response[i].Invoiceid + '" class="clsPosting" name="' + response[i].Invoiceid + '"/></td>';
        strhtml += '<td>' + response[i].InvoiceDate + '</td>';
        strhtml += '<td><a href="#" style="color: #337ab7;" onclick="funGetInvoiceDetail(' + response[i].Invoiceid + ');">' + response[i].InvoiceNumber + '</a></td>';
        strhtml += '<td>' + response[i].CompanyCode + '</td>';
        strhtml += '<td>' + response[i].BatchNumber + '</td>';
        strhtml += '<td>' + response[i].tblVendorName + '</td>';
        strhtml += '<td>' + response[i].ThirdPartyVendor + '</td>';
        strhtml += '<td>' + response[i].InoviceLine + '</td>';
        var strAmount = '$ ' + (response[i].CurrentBalance + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        strhtml += '<td>' + strAmount + '</td>';
        strhtml += '</tr>';
    }
    $('#TblPostedListTbody').html(strhtml);

    if (parseInt(PageCnt) < 500) {
        var PgNo = (PageCnt / 28);
    }
    else if (parseInt(PageCnt) < 800) {
        var PgNo = (PageCnt / 24);
    }

    var substr = PgNo.toString().split('.');
    showpg = parseInt(substr[0]);
  

    var table = $('#TblPosted').DataTable({
        "iDisplayLength": showpg,
        responsive: {
            details: {
                type: 'column',
            }
        },
        columnDefs: [{

            className: 'control',
            orderable: false,
            targets: 0,

        }],
        order: [1, 'asc']
    });

    
    $('#TblPosted tfoot th').each(function () {
        var title = $('#TblPosted thead th').eq($(this).index()).text();
        $(this).html('<input type="text"  style="width:100px !important;" placeholder="' + title + '" />');
        
    });

    // Apply the search
    table.columns().eq(0).each(function (colIdx) {
        $('input', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
        $('select', table.column(colIdx).footer()).on('keyup change', function () {
            table
                .column(colIdx)
                .search(this.value)
                .draw();
        });
    });

    $('#TblPosted tfoot tr').insertAfter($('#TblPosted thead tr'));

    $('#TblPosted').parent().css('overflow', 'scroll');
    $('#TblPosted').parent().css('max-height', ($(window).height() - 180) + 'px');
    $('#TblPosted').parent().css('min-height', ($(window).height() - 180) + 'px');
    $('#TblPosted').parent().css('height', ($(window).height() - 180) + 'px');

    $('#TblPosted_wrapper').attr('style', 'height:' + PageCnt + 'px;');
}

$(function () {
    var heightt = $(window).height();
    heightt = heightt - 200;
    PageCnt = heightt;
});

function funGetInvoiceDetail(value) {
    localStorage.EditInvoiceId = value;
    window.location.replace(HOST + "/Reports/EditInvoiceReport");
}

//========================= Alt+N
$(document).on('keydown', function (event) {
    event = event || document.event;
    var key = event.which || event.keyCode;

    if (event.altKey === true && key === 78) {
      //  window.location.replace(HOST + "/AccountPayable/AddInvoice");
    }


});


//====================AP Invoice Posting Report=======================//
//function GetInvoicePDF() {
//    alert('ACS');
//    $.ajax({
//        url: APIUrlGetGetInvoicePDF ,
//        cache: false,
//        beforeSend: function (request) {
//            request.setRequestHeader("Authorization", localStorage.EMSKeyToken);
//        },
//        type: 'POST',
//        contentType: 'application/json; charset=utf-8',
//    })

//.done(function (response)
//{ GetInvoicePDFSucess(response); })
//.fail(function (error)
//{ console.log(error); })
//}

//function GetInvoicePDFSucess(response) {
//    alert('PDF Created');
//}